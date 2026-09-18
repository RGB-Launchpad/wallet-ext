// Wallet engine: holds the plaintext recovery phrase and the wasm wallet instance.
// Runs in an offscreen document, which survives service worker eviction. Locking closes the
// document and erases the phrase.
//
// NOTE: offscreen documents support chrome.runtime only. This file reads and writes no
// storage; settings and the vault arrive by message and a new vault is returned to the
// service worker to persist.
import init, { generateKeys, restoreKeys, WasmWallet, WasmInvoice } from "./pkg/rgb_lib_wasm_bindings.js";
import { unseal, seal } from "./lib/vault.js";
import { listen, plain } from "./lib/msg.js";
import { buildToSignPsbt, extractWitness, signatureFromWitness, decodeAddress, scriptPubKeyOf, hex } from "./lib/bip322.js";
import { DEFAULTS, NETWORKS } from "./config.js";
import { clearingRate, bid } from "./lib/fee.js";
import { slotBlocker, slotsToCreate, explainSendError } from "./lib/slots.js";
import { dataDirOf } from "./lib/chain.js";
import { pickSwapInput } from "./lib/swap.js";

const S = {
    wallet: null,
    online: null,
    network: null,
    settings: null,
    persisted: null,
    proxyMissing: false,
    onlineErr: null,
};

// Settings arrive at boot and are cached. Changing them relocks the wallet.
function settingsOf(args) {
    const s = args?.settings || S.settings;
    if (!s) throw new Error("Settings missing: the service worker did not pass them in");
    return { ...DEFAULTS, ...s };
}

function endpoints(settings) {
    const net = NETWORKS[settings.network];
    if (!net) throw new Error(`Unknown network ${settings.network}`);
    return {
        esplora: settings.esploraUrl || net.esplora,
        proxy: settings.proxyUrl || net.proxy,
    };
}

async function bootWallet(mnemonic, settings) {
    await init();
    const { esplora, proxy } = endpoints(settings);
    // A proxy is only needed to move consignments, not to create the wallet.

    const keys = restoreKeys(settings.network, mnemonic);
    const wallet = await WasmWallet.create(JSON.stringify({
        // NOTE: the IndexedDB key is `dataDir/<master fingerprint>`, so the network has to be
        // part of it. A shared key loads the other chain's snapshot and BDK rejects it.
        // The Regtest reset in sw.js deletes by this same prefix.
        dataDir: dataDirOf(settings.network),
        bitcoinNetwork: settings.network,
        databaseType: "Sqlite",
        maxAllocationsPerUtxo: 5,
        accountXpubVanilla: keys.accountXpubVanilla,
        accountXpubColored: keys.accountXpubColored,
        mnemonic,
        masterFingerprint: keys.masterFingerprint,
        vanillaKeychain: null,
        supportedSchemas: ["Nia", "Ifa"],
        // Pins the address index so the identity address is stable across sessions.
        // NOTE: rotateAddress must stay unexposed; rotating changes the identity.
        reuseAddresses: true,
    }));
    await wallet.flush();          // waits for the IndexedDB commit

    // NOTE: storage is not persistent by default, and without the stash the phrase alone
    // cannot restore the assets.
    let persisted = false;
    try { persisted = (await navigator.storage.persisted()) || (await navigator.storage.persist()); }
    catch { persisted = false; }

    S.wallet = wallet;              // the wasm wallet holds the phrase; no second copy here
    S.settings = settings;
    S.network = settings.network;
    S.persisted = persisted;
    S.proxyMissing = !proxy;
    S.onlineErr = null;
    S.online = null;

    // Going online can fail; balances and backups still work offline.
    try { S.online = await wallet.goOnline(true, esplora); }
    catch (e) { S.onlineErr = String(e?.message || e); }

    return status();
}

function status() {
    // `backupInfo()` is true when the wallet changed since the last backup.
    let backupNeeded = null;
    try { backupNeeded = S.wallet ? S.wallet.backupInfo() : null; } catch { /* no signal, no prompt */ }
    return {
        unlocked: !!S.wallet,
        network: S.network,
        online: !!S.online,
        onlineErr: S.onlineErr,
        persisted: S.persisted,
        proxyMissing: !!S.proxyMissing,
        backupNeeded,
    };
}

function needWallet() {
    if (!S.wallet) throw new Error("Wallet is locked");
    return S.wallet;
}
function needOnline() {
    needWallet();
    if (!S.online) throw new Error(`Indexer unreachable${S.onlineErr ? ": " + S.onlineErr : ""}`);
    return S.online;
}

/** Sats parked on the seal output a swap pays the buyer. rgb-lib's own UTXO size. */
const SWAP_SEAL_SATS = 1000;

/** One offer, from the platform's public endpoint. Read here, never taken from the page. */
async function platformOffer(apiBase, offerId) {
    // NOTE: the service worker has already resolved this against the calling site and refused
    // anything else. Repeated here because this document must not read an offer over plain http
    // whatever reaches it: a rewritten offer is what the signature is checked against.
    const base = String(apiBase || "").replace(/\/+$/, "");
    if (!/^https:\/\//.test(base) && !/^http:\/\/(localhost|127\.0\.0\.1)([:/]|$)/.test(base)) {
        throw new Error("The platform endpoint must be https");
    }
    const r = await fetch(`${base}/v1/p2p/offers/${encodeURIComponent(String(offerId))}`);
    const body = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(body?.error?.message || `offer ${r.status}`);
    return body;
}

/**
 * The counterparty's input, read out of the PSBT.
 *
 * Which UTXO the seller spends is its own business; what matters is that there are exactly two
 * inputs and that one of them is this wallet's. The asset arriving is guaranteed by the
 * consignment, not by the seller's choice of input.
 */
function psbtSellerInput(psbt, mine) {
    const inputs = plain(WasmWallet.swapPsbtInputs(psbt));
    if (inputs.length !== 2) throw new Error(`A swap has two inputs, this PSBT has ${inputs.length}`);
    const others = inputs.filter((i) => i !== mine);
    if (others.length !== 1) throw new Error("The PSBT does not spend this wallet's prepared UTXO");
    return others[0];
}

/**
 * Whether the proxy already holds a consignment for `recipientId`. It refuses a second one for
 * the same id, so a swap naming a used id cannot complete. Unreachable is an error, not a no:
 * guessing "free" is what fails the swap later.
 */
async function proxyHasConsignment(proxy, recipientId) {
    const url = String(proxy).replace(/^rpcs:\/\//, "https://").replace(/^rpc:\/\//, "http://");
    const r = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "consignment.get", params: { recipient_id: recipientId } }),
        signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) throw new Error(`RGB proxy ${r.status}`);
    const body = await r.json();
    if (body.result?.consignment) return true;
    // -400 "Consignment file not found": the id is free.
    if (body.error?.code === -400) return false;
    throw new Error(`RGB proxy: ${body.error?.message || "unexpected reply"}`);
}

/** The value of `txid:vout`, from the configured indexer. */
async function outputSats(outpoint) {
    const [txid, vout] = String(outpoint).split(":");
    const base = endpoints(S.settings).esplora.replace(/\/+$/, "");
    const r = await fetch(`${base}/tx/${txid}`, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error(`Cannot read the seller's input ${outpoint}: indexer ${r.status}`);
    const out = (await r.json()).vout?.[Number(vout)];
    if (!Number.isSafeInteger(out?.value)) throw new Error(`The seller's input ${outpoint} does not exist`);
    return out.value;
}

/** Free colored allocation slots. Receiving needs at least one. */
function freeSlots(wallet) {
    return wallet.listUnspents(false)
        .filter((u) => u.utxo.colorable)
        .reduce((a, u) => a + Math.max(0, 5 - u.rgbAllocations.length), 0);
}

/** The mempool queue, from `/mempool` — standard esplora, so every offered indexer has it. */
async function mempoolHistogram(esplora) {
    const r = await fetch(`${esplora.replace(/\/+$/, "")}/mempool`);
    if (!r.ok) throw new Error(`mempool ${r.status}`);
    return (await r.json()).fee_histogram || [];
}

/**
 * What to bid, in sat/vB. Trailing underscore avoids clashing with the feeRate argument
 * callers pass in. The maths, and why the floor matters, are in lib/fee.js.
 */
async function feeRate_() {
    const seen = [];
    try { seen.push(clearingRate(await mempoolHistogram(endpoints(S.settings).esplora))); }
    catch { /* indexer without /mempool: the floor still applies */ }
    try { seen.push(await S.wallet.getFeeEstimation(S.online, 1)); }
    catch { /* no estimate on a fresh regtest chain */ }
    return BigInt(bid(seen));
}

/**
 * Adds a confirmation count to transfers still waiting on the chain. rgb-lib's `Transfer`
 * carries no such field, so it comes from the indexer: one tip lookup plus one status
 * lookup per pending txid. Settled and Failed transfers are skipped — the count would tell
 * the user nothing they do not already see.
 *
 * A lookup that fails leaves `confirmations` undefined. Showing the list without the number
 * beats failing the whole screen because the indexer hiccuped.
 */
async function withConfirmations(transfers) {
    const pending = transfers.filter(
        (t) => t.txid && t.status !== "Settled" && t.status !== "Failed");
    if (!pending.length) return transfers;

    const base = endpoints(S.settings).esplora.replace(/\/+$/, "");
    const get = (path) => fetch(`${base}${path}`, { signal: AbortSignal.timeout(8000) });

    let tip;
    try { tip = Number(await (await get("/blocks/tip/height")).text()); }
    catch { return transfers; }
    if (!Number.isFinite(tip)) return transfers;

    const depth = new Map();
    for (const txid of new Set(pending.map((t) => t.txid))) {
        try {
            const st = await (await get(`/tx/${txid}/status`)).json();
            // Being in a block at the tip is one confirmation, not zero.
            depth.set(txid, st.confirmed ? Math.max(0, tip - st.block_height + 1) : 0);
        } catch { /* leave this one unknown */ }
    }
    return transfers.map((t) => (depth.has(t.txid) ? { ...t, confirmations: depth.get(t.txid) } : t));
}

const handlers = {
    status,

    /** Creates or imports a wallet. An empty mnemonic generates one. Returns the vault to persist. */
    async create(args) {
        const { password, mnemonic } = args;
        if (!password || password.length < 8) throw new Error("Password must be at least 8 characters");
        const settings = settingsOf(args);
        await init();
        const m = (mnemonic || "").trim() || generateKeys(settings.network).mnemonic;
        // Validates the phrase before sealing it.
        restoreKeys(settings.network, m);
        const vault = await seal(m, password);
        const st = await bootWallet(m, settings);
        // Returned once, at creation, for the user to write down.
        return { ...st, vault, mnemonic: mnemonic ? undefined : m };
    },

    async unlock(args) {
        const { password, vault } = args;
        if (!vault) throw new Error("No wallet yet");
        const m = await unseal(vault, password);      // throws on a wrong password
        return await bootWallet(m, settingsOf(args));
    },

    /** Reseals the phrase. Wallet state in IndexedDB is untouched. */
    async changePassword({ oldPassword, newPassword, vault }) {
        if (!newPassword || newPassword.length < 8) throw new Error("New password must be at least 8 characters");
        if (!vault) throw new Error("Current vault not provided");
        const m = await unseal(vault, oldPassword);
        return { vault: await seal(m, newPassword) };
    },

    async btc() {
        const w = needWallet();
        try { if (S.online) await w.sync(S.online); } catch { /* offline: show the last known figures */ }
        return { balance: plain(w.getBtcBalance()), address: w.getAddress(), slots: freeSlots(w) };
    },

    /** Asset list. Precision comes from contract metadata and stays null when unknown. */
    async assets() {
        const w = needWallet();
        const list = plain(w.listAssets([]));
        const out = [];
        for (const a of [...(list.nia || []), ...(list.ifa || [])]) {
            let precision = a.precision ?? null;
            try { precision = plain(w.getAssetMetadata(a.assetId)).precision ?? precision; } catch { /* keep the list value */ }
            out.push({
                assetId: a.assetId, ticker: a.ticker, name: a.name,
                precision, balance: a.balance,
            });
        }
        // Whether the wallet changed since the last backup.
        let backupNeeded = null;
        try { backupNeeded = w.backupInfo(); } catch { /* leave it null */ }
        return { assets: out, backupNeeded };
    },

    /** Creates empty colored UTXOs, which receiving requires. */
    async prepare(args) {
        const w = needWallet();
        const on = needOnline();
        await w.sync(on);
        const count = slotsToCreate(plain(w.listUnspents(false)));
        if (count === 0) return { created: 0, slots: freeSlots(w) };
        // The rate comes first: the cost moves with the network.
        const rate = await feeRate_();
        const blocked = slotBlocker(w.getBtcBalance().vanilla, rate, count);
        if (blocked) throw new Error(blocked);
        // NOTE: `upTo` is false. With it true, rgb-lib counts every UTXO that still has room for
        // an allocation, including ones already holding assets, and creates nothing.
        const psbt = await w.createUtxosBegin(on, false, count, DEFAULTS.utxoSizeSat, rate, false);
        const signed = w.signPsbt(psbt);
        const n = await w.createUtxosEnd(on, signed, false);
        await w.flush();
        return { created: n, slots: freeSlots(w) };
    },

    /** Blind receive invoice. `undefined` means any asset; the bindings reject null. */
    async receive(args = {}) {
        const { assetId, minutes } = args;
        const w = needWallet();
        needOnline();
        if (freeSlots(w) < 1) throw new Error("No free allocation slot. Create slots first.");
        const { proxy } = endpoints(settingsOf(args));
        if (!proxy) throw new Error("No RGB proxy configured. The invoice must name where the consignment goes.");
        const r = w.blindReceive(
            assetId || undefined,
            "Any",
            (minutes || DEFAULTS.invoiceMinutes) * 60,
            [proxy],
            DEFAULTS.minConfirmations,
        );
        await w.flush();
        return plain(r);
    },

    /** Picks up consignments and advances the state machine. Cost grows with transfer history. */
    async refresh() {
        const w = needWallet();
        const on = needOnline();
        const t0 = Date.now();
        await w.sync(on);
        const out = plain(await w.refresh(on, undefined, [], false));
        await w.flush();
        return { ms: Date.now() - t0, changed: out };
    },

    async transfers({ assetId } = {}) {
        const w = needWallet();
        // NOTE: the first argument is an AssetFilter enum, not an asset id, and its variants
        // are lowercase: "any" / "noAsset" / { id }.
        const list = plain(w.listTransfers(assetId ? { id: assetId } : "any"));
        const out = list.slice().reverse();             // newest first
        // `target` is what this wallet asked for when it built the invoice, so the UI can
        // say "1 of 1" rather than a bare count. rgb-lib does not hand the stored value
        // back, but the wallet has only ever passed this constant.
        return { transfers: await withConfirmations(out), target: DEFAULTS.minConfirmations };
    },

    /** Encrypted backup. The phrase alone cannot restore RGB assets; the stash must be included. */
    async backup({ password }) {
        const w = needWallet();
        if (!password || password.length < 8) throw new Error("Backup password must be at least 8 characters");
        const bytes = w.backup(password);
        // plain array so it can cross the message channel
        return { bytes: Array.from(bytes), needed: (() => { try { return w.backupInfo(); } catch { return null; } })() };
    },

    /**
     * Identity: the pinned address on the vanilla path.
     * `publicKey` is the taproot x-only output key (32 bytes), decoded from the address.
     */
    async identity() {
        const w = needWallet();
        const address = w.getAddress();
        const { version, program } = decodeAddress(address);
        return { address, publicKey: hex.to(program), witnessVersion: version, network: S.network };
    },

    /**
     * The buyer's half of a peer-to-peer swap, step one (platform `docs/design/20`).
     *
     * A swap moves an RGB asset one way and sats the other in a single bitcoin transaction. This
     * call produces what the page needs to take an offer, and remembers it so step two can check
     * what comes back:
     *
     *   - a **witness** invoice of this wallet, so the asset lands on a seal it owns. A blind
     *     invoice cannot receive from a swap: colouring assigns the asset to an output of the
     *     swap transaction itself.
     *   - a **vanilla** UTXO to pay with. A colored one would be spent without a state transition
     *     for what it carries, destroying it.
     *   - the change script, so step two can tell its own change from an output redirected
     *     somewhere else.
     *
     * The page performs the platform calls; it holds the session. This wallet holds the keys and
     * decides what it signs.
     */
    async swapPrepare({ offerId, apiBase, network }) {
        const w = needWallet();
        // The site names its network in lower case. Checked first: on another network the offer
        // cannot be paid, and the invoice below would name the wrong chain.
        if (typeof network === "string" && network.toLowerCase() !== String(S.network).toLowerCase()) {
            throw new Error(`This wallet is on ${S.network} and the site is on ${network}. Switch the network in the wallet's settings.`);
        }
        const on = needOnline();
        const { proxy } = endpoints(S.settings);
        if (!proxy) throw new Error("No RGB proxy configured. The consignment needs somewhere to arrive.");
        const offer = await platformOffer(apiBase, offerId);
        if (offer.state && offer.state !== "OPEN") throw new Error(`The offer is ${offer.state}`);

        // ~300 vB for a swap (two inputs, four outputs), measured on the platform side.
        const feeSats = Number(await feeRate_()) * 320;
        const need = Number(offer.priceSats) + feeSats + SWAP_SEAL_SATS;
        const vanilla = pickSwapInput(plain(await w.listUnspentsVanilla(on, DEFAULTS.minConfirmations, false)), need);
        if (!vanilla) throw new Error(`No confirmed Bitcoin output holding more than ${need} sats. Fund the wallet's Bitcoin address.`);

        // NOTE: no free slot is needed. A witness invoice names an output of the swap transaction
        // itself, not a UTXO this wallet already has. Opened after the input is found, so a
        // wallet that cannot pay leaves no invoice behind.
        // 🚨 A colored address no earlier swap used. Addresses are pinned (reuseAddresses), so
        // without rotating every swap names the same seal script and so the same recipient id,
        // and the proxy refuses the second consignment for it ("Cannot change uploaded file").
        // Rotating once is not enough: a wallet restored from its phrase starts the index again,
        // and a swap that expired unbroadcast leaves no trace on-chain, only on the proxy. So the
        // proxy is asked. Only the colored keychain (0) rotates; the identity address is on the
        // vanilla one and does not change. The index is saved with the wallet snapshot.
        let recv = null;
        for (let i = 0; i < 20 && !recv; i++) {
            w.rotateAddress(0);
            const r = plain(w.witnessReceive(
                undefined,                          // the contract is unknown until the consignment arrives
                { Fungible: Number(offer.amount) },
                DEFAULTS.invoiceMinutes * 60,
                [proxy],
                DEFAULTS.minConfirmations,
            ));
            if (!(await proxyHasConsignment(proxy, r.recipientId ?? r.recipient_id))) recv = r;
        }
        if (!recv) throw new Error("Could not find an unused receiving address. Try again later.");
        await w.flush();
        const seal = WasmWallet.invoiceSealScript(recv.invoice);

        const changeScript = hex.to(scriptPubKeyOf(w.getAddress()));
        const prepared = {
            offerId,
            assetId: offer.assetId,
            amount: String(offer.amount),
            priceSats: String(offer.priceSats),
            buyerInvoice: recv.invoice,
            buyerSeal: seal,
            buyerOutpoint: vanilla.outpoint,
            buyerInputSats: vanilla.sats,
            buyerChangeScript: changeScript,
            feeSats: String(feeSats),
        };
        S.swaps = S.swaps || new Map();
        S.swaps.set(String(offerId), prepared);
        return prepared;
    },

    /**
     * The buyer's half, step two: check the counterparty's coloured PSBT and sign this wallet's
     * input. The seller signs after this and broadcasts.
     *
     * 🚨 The check is the whole defence. A signature covers every output, so an output redirected
     * before signing is authorised by that signature and cannot be disputed afterwards. What is
     * compared: both inputs, every output's script and value in the fixed order, the RGB
     * commitment being output 0, and the fee.
     *
     * The seller's payout script is not compared; only its value is. The buyer agreed to a price,
     * not to where the seller keeps it. The commitment output's content comes from the seller's
     * colouring and cannot be recomputed here, so only its shape and position are checked.
     */
    async swapSign({ offerId, psbt, apiBase }) {
        const w = needWallet();
        const on = needOnline();
        const prepared = S.swaps?.get(String(offerId));
        if (!prepared) throw new Error("This wallet did not prepare that swap");
        // Re-read the offer rather than trusting anything the page passed in.
        const offer = await platformOffer(apiBase, offerId);
        if (String(offer.amount) !== prepared.amount || String(offer.priceSats) !== prepared.priceSats) {
            throw new Error("The offer changed after it was prepared");
        }

        const price = Number(prepared.priceSats);
        const fee = Number(prepared.feeSats);
        const sellerIn = psbtSellerInput(psbt, prepared.buyerOutpoint);
        // The seller's colored input funds the seal output alongside the buyer's, so the buyer's
        // change is what both inputs hold minus the layout. Its value is read from this wallet's
        // own indexer, not from the PSBT the counterparty built.
        const change = Number(prepared.buyerInputSats) + await outputSats(sellerIn)
            - SWAP_SEAL_SATS - price - fee;
        if (change < 0) throw new Error("The prepared input no longer covers the price and the fee");
        WasmWallet.checkSwapPsbt(
            psbt,
            [sellerIn, prepared.buyerOutpoint],
            [
                { script: null, sats: 0 },                              // the RGB commitment
                { script: prepared.buyerSeal, sats: SWAP_SEAL_SATS },   // the asset arrives here
                { script: null, sats: price },                          // the seller's payout
                { script: prepared.buyerChangeScript, sats: change },   // this wallet's change
            ],
            BigInt(prepared.feeSats),
        );

        // The seller signs last and broadcasts: it records the transfer in its own wallet as it
        // does so. This wallet only adds its signature; the asset arrives through the proxy once
        // the transaction confirms.
        const signed = w.signPsbt(psbt);
        S.swaps.delete(String(offerId));
        await w.flush();
        return { offerId, psbt: signed, assetId: prepared.assetId, amount: prepared.amount, priceSats: prepared.priceSats };
    },

    /**
     * BIP-322 simple signature. The PSBT is built here and never reaches the page.
     * NOTE: never expose a generic "sign any PSBT" call; it would let a page spend a colored
     * UTXO, which destroys the assets on it.
     */
    async signMessage({ message }) {
        const w = needWallet();
        if (typeof message !== "string" || !message) throw new Error("Message is required");
        const address = w.getAddress();
        // Signed verbatim: the server verifies against its own stored copy.
        const psbt = await buildToSignPsbt(address, message);
        const signed = w.signPsbt(psbt);
        return { address, signature: signatureFromWitness(extractWitness(signed)) };
    },

    /** Decodes an invoice and rejects a network mismatch or an expired invoice. */
    async decodeInvoice({ invoice }) {
        await init();
        const d = plain(new WasmInvoice(String(invoice || "").trim()).invoiceData());
        const warnings = [];
        if (d.network && S.network && String(d.network).toLowerCase() !== String(S.network).toLowerCase()) {
            throw new Error(`Invoice is for ${d.network}, this wallet is on ${S.network}`);
        }
        if (d.expirationTimestamp && Number(d.expirationTimestamp) * 1000 < Date.now()) {
            throw new Error("Invoice has expired");
        }
        if (!d.transportEndpoints?.length) warnings.push("Invoice names no consignment endpoint; the configured proxy will be used.");
        return { data: d, warnings };
    },

    /**
     * Sends RGB to an invoice.
     * NOTE: the invoice's own transportEndpoints take precedence; the consignment has to land
     * where the recipient looks for it.
     */
    async sendRgb(args) {
        const { invoice, assetId, amountRaw, feeRate } = args;
        const w = needWallet();
        const on = needOnline();
        const d = plain(new WasmInvoice(String(invoice || "").trim()).invoiceData());
        if (d.network && String(d.network).toLowerCase() !== String(S.network).toLowerCase()) {
            throw new Error(`Invoice network ${d.network} does not match wallet network ${S.network}`);
        }
        if (d.assetId && assetId && d.assetId !== assetId) {
            throw new Error("The invoice names a different asset");
        }
        const amount = BigInt(amountRaw);
        if (amount <= 0n) throw new Error("Amount must be greater than 0");

        const { proxy } = endpoints(settingsOf(args));
        const eps = d.transportEndpoints?.length ? d.transportEndpoints : [proxy];
        if (!eps[0]) throw new Error("No consignment endpoint in the invoice and no proxy configured");
        const rate = feeRate ? BigInt(feeRate) : await feeRate_();

        await w.sync(on);
        const recipient = (fungible) => ({
            [assetId || d.assetId]: [{
                recipientId: d.recipientId,
                witnessData: undefined,               // blind mode carries no witness data
                assignment: { Fungible: fungible },
                transportEndpoints: eps,
            }],
        });
        // NOTE: amounts pass as BigInt. Number loses precision past 2^53 and real supplies
        // sit above it, so the Number path is only taken when the value fits exactly.
        let psbt;
        try {
            try {
                psbt = await w.sendBegin(on, recipient(amount), false, rate, DEFAULTS.minConfirmations);
            } catch (e) {
                if (amount > BigInt(Number.MAX_SAFE_INTEGER)) {
                    throw new Error(`Amount exceeds 2^53 and the bindings rejected BigInt: ${e?.message || e}`);
                }
                psbt = await w.sendBegin(on, recipient(Number(amount)), false, rate, DEFAULTS.minConfirmations);
            }
        } catch (e) {
            throw new Error(explainSendError(e?.message || e, rate));
        }
        const signed = w.signPsbt(psbt);
        const r = plain(await w.sendEnd(on, signed, false));
        await w.flush();
        return r;
    },

    /** Sends plain Bitcoin. Spends the vanilla keychain only, never a UTXO carrying assets. */
    async sendBtc({ address, amountSat, feeRate }) {
        const w = needWallet();
        const on = needOnline();
        const amount = BigInt(amountSat);
        if (amount <= 0n) throw new Error("Amount must be greater than 0");
        const rate = feeRate ? BigInt(feeRate) : await feeRate_();
        await w.sync(on);
        const psbt = await w.sendBtcBegin(on, String(address).trim(), amount, rate, false);
        const signed = w.signPsbt(psbt);
        const txid = await w.sendBtcEnd(on, signed, false);
        await w.flush();
        return { txid };
    },

    /** Suggested fee rate in sat/vB. */
    async feeSuggestion() { return { feeRate: Number(await feeRate_()) }; },

    /**
     * Fails expired invoices and deletes the ones with no asset.
     * NOTE: the sweep only reaches transfers that are waiting for the counterparty and have
     * expired. A dangling invoice holds an allocation slot until then.
     */
    async cleanup() {
        const w = needWallet();
        const on = needOnline();
        const failed = await w.failTransfers(on, undefined, false, false);
        let deleted = false;
        try { deleted = w.deleteTransfers(undefined, true); } catch { /* nothing to delete */ }
        await w.flush();
        return { failed, deleted, slots: freeSlots(w) };
    },

    /**
     * Fails one transfer by index, which is how a transfer stuck at "waiting for
     * confirmations" is cleared. The indexless sweep cannot reach that state.
     */
    async failTransfer({ batchTransferIdx }) {
        const w = needWallet();
        const on = needOnline();
        const idx = Number(batchTransferIdx);
        if (!Number.isInteger(idx)) throw new Error("Missing transfer index");
        const changed = await w.failTransfers(on, idx, false, false);
        await w.flush();
        return { changed };
    },

    /** Restores from an encrypted backup. Requires the same recovery phrase, already unlocked. */
    async restoreBackup({ bytes, password }) {
        const w = needWallet();
        if (!bytes?.length) throw new Error("No backup file selected");
        w.restoreBackup(new Uint8Array(bytes), password);
        await w.flush();
        return status();
    },

    async lockNow() { return { bye: true }; },   // the service worker performs the close
};

listen("offscreen", handlers);
