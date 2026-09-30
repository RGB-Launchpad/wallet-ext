// Wallet engine: holds the plaintext recovery phrase and the wasm wallet instance.
// Runs in an offscreen document, which survives service worker eviction. Locking closes the
// document and erases the phrase.
//
// NOTE: offscreen documents support chrome.runtime only. This file reads and writes no
// storage; settings and the vault arrive by message and a new vault is returned to the
// service worker to persist.
import init, { generateKeys, restoreKeys, WasmWallet, WasmInvoice } from "./pkg/rgb_lib_wasm_bindings.js";
// The same module again, as a namespace: the wallet module takes the bindings by injection.
import * as BINDINGS from "./pkg/rgb_lib_wasm_bindings.js";
import { unseal, seal } from "./lib/vault.js";
import { listen, plain } from "./lib/msg.js";
import { dataDirOf } from "./lib/chain.js";
import WalletManagerRgb from "./vendor/wdk-wallet-rgb.js";
import { buildToSignPsbt, extractWitness, signatureFromWitness, decodeAddress, scriptPubKeyOf, hex } from "./lib/bip322.js";
import { DEFAULTS, NETWORKS, feeFor, chainOf } from "./config.js";
import { clearingRate, bid } from "./lib/fee.js";
import { pickSwapInput, pickSellerInput, sellerPayout, sellable } from "./lib/swap.js";

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

/**
 * One boot stage, for the create/unlock progress display. Sent to open views; a view that
 * is not listening simply never lights the row.
 */
function stage(step) {
    chrome.runtime.sendMessage({ to: "views", ev: "stage", step }).catch(() => {});
}

// Opening the wallet ends with `goOnline`, and that is the only stage that waits on the
// network. The engine exposes it as one call, so the boundary is hooked here — on the
// prototype, which every wallet instance created by the bindings shares.
const goOnline0 = BINDINGS.WasmWallet.prototype.goOnline;
BINDINGS.WasmWallet.prototype.goOnline = function (...args) {
    stage("online");
    return goOnline0.apply(this, args);
};

function endpoints(settings) {
    const net = NETWORKS[settings.network];
    if (!net) throw new Error(`Unknown network ${settings.network}`);
    return {
        esplora: settings.esploraUrl || net.esplora,
        proxy: settings.proxyUrl || net.proxy,
    };
}

async function bootWallet(mnemonic, settings) {
    const { esplora, proxy } = endpoints(settings);
    // A proxy is only needed to move consignments, not to create the wallet.

    // The engine now lives in @darkhorse-wallet/wdk-wallet-rgb, bundled into vendor/. It owns the
    // snapshot key, the serial queue, the storage-persistence request and going online — all
    // of which used to be written out here. The bindings passed in are this extension's own
    // build: it carries the swap additions the published package does not have.
    const manager = new WalletManagerRgb(mnemonic, {
        // rgb-lib knows four networks, and the wallet's own list is longer: `Local` is a
        // regtest chain of this machine's. It gets its own snapshot key, because the other
        // regtest is a different chain answering to the same name.
        network: chainOf(settings.network),
        dataDir: dataDirOf(settings.network),
        esploraUrl: esplora,
        proxyUrl: proxy || null,
        bindings: BINDINGS,
        minConfirmations: DEFAULTS.minConfirmations,
        invoiceMinutes: DEFAULTS.invoiceMinutes,
    });
    const account = await manager.getAccount(0);
    const st = await account.getStatus();

    // The swap handlers call the engine directly, for the six bindings the module does not
    // wrap. They take the wallet from here and the queue from `runExclusive`.
    const { wallet, online } = await account.runExclusive((wallet, online) => ({ wallet, online }));

    S.manager = manager;
    S.account = account;
    S.wallet = wallet;
    S.online = online;
    S.settings = settings;
    S.network = settings.network;
    S.mnemonic = mnemonic;
    S.persisted = st.persisted;
    S.proxyMissing = !proxy;
    S.onlineErr = st.onlineError;

    return status();
}

/**
 * Reopens the wallet on new settings while it stays unlocked: the phrase is already in
 * memory here, so a settings save does not have to send the user back to the lock screen.
 * A network change lands on that network's own snapshot, exactly as an unlock would.
 */
async function rebuildWallet(settings) {
    if (!S.mnemonic) throw new Error("Wallet is locked");
    // A prepared swap names UTXOs and an invoice of the old engine; drop it rather than
    // let step two check them against a wallet that no longer exists.
    S.swaps = new Map();
    if (S.manager?.dispose) S.manager.dispose();
    S.manager = S.account = S.wallet = S.online = null;
    return await bootWallet(S.mnemonic, settings);
}

async function status() {
    // True when the wallet changed since the last backup.
    let backupNeeded = null;
    try { backupNeeded = S.account ? await S.account.isBackupNeeded() : null; } catch { /* no signal, no prompt */ }
    return {
        unlocked: !!S.account,
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

/** The wallet module's account. Everything that is not a swap goes through it. */
function needAccount() {
    if (!S.account) throw new Error("Wallet is locked");
    return S.account;
}
function needOnline() {
    needWallet();
    if (!S.online) throw new Error(`Indexer unreachable${S.onlineErr ? ": " + S.onlineErr : ""}`);
    return S.online;
}

/**
 * What one transfer moved, in the asset's base units. rgb-lib carries the amount inside the
 * assignments, not as a field: the sum of what was assigned, falling back to what was asked
 * for while a receive is still on its way in. `Assignment` is `{ Fungible: <base units> }`.
 */
function transferAmount(row) {
    const one = (x) => (x && typeof x === "object" && x.Fungible != null ? BigInt(x.Fungible) : 0n);
    const assigned = (row.assignments || []).reduce((n, x) => n + one(x), 0n);
    return (assigned > 0n ? assigned : one(row.requestedAssignment)).toString();
}

/** A transfer row in the shape the UI reads: amount and assetId derived, timestamps named. */
function transferRow(row, assetId) {
    return {
        ...row,
        assetId: assetId ?? row.assetId,
        amount: row.amount ?? transferAmount(row),
        created_at: row.createdAt ?? row.created_at,
        updated_at: row.updatedAt ?? row.updated_at,
        batchTransferIdx: row.batchTransferIdx ?? row.batch_transfer_idx,
    };
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

/**
 * The output `txid:vout` spends, as `{ sats, script, tx }`, from the configured indexer. `tx` is
 * the whole transaction in hex: the signer refuses an input without it.
 */
async function prevOutput(outpoint) {
    const [txid, vout] = String(outpoint).split(":");
    const base = endpoints(S.settings).esplora.replace(/\/+$/, "");
    const get = (p) => fetch(`${base}${p}`, { signal: AbortSignal.timeout(8000) });
    const [r, h] = await Promise.all([get(`/tx/${txid}`), get(`/tx/${txid}/hex`)]);
    if (!r.ok || !h.ok) throw new Error(`Cannot read ${outpoint}: indexer ${r.ok ? h.status : r.status}`);
    const out = (await r.json()).vout?.[Number(vout)];
    if (!Number.isSafeInteger(out?.value)) throw new Error(`${outpoint} does not exist`);
    return { sats: out.value, script: out.scriptpubkey, tx: (await h.text()).trim() };
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
    const fee = feeFor(S.network);
    const seen = [];
    try { seen.push(clearingRate(await mempoolHistogram(endpoints(S.settings).esplora), fee)); }
    catch { /* indexer without /mempool: the floor still applies */ }
    try { seen.push(await S.wallet.getFeeEstimation(S.online, 1)); }
    catch { /* no estimate on a fresh regtest chain */ }
    return BigInt(bid(seen, fee));
}

const handlers = {
    status,

    /** Creates or imports a wallet. An empty mnemonic generates one. Returns the vault to persist. */
    async create(args) {
        const { password, mnemonic } = args;
        if (!password || password.length < 8) throw new Error("Password must be at least 8 characters");
        const settings = settingsOf(args);
        await init();
        // rgb-lib's four networks again, not the wallet's own name for the chain.
        const chain = chainOf(settings.network);
        stage("phrase");
        const m = (mnemonic || "").trim() || generateKeys(chain).mnemonic;
        // Validates the phrase before sealing it.
        restoreKeys(chain, m);
        stage("encrypt");
        const vault = await seal(m, password);
        stage("open");
        const st = await bootWallet(m, settings);
        // Returned once, at creation, for the user to write down.
        return { ...st, vault, mnemonic: mnemonic ? undefined : m };
    },

    async unlock(args) {
        const { password, vault } = args;
        if (!vault) throw new Error("No wallet yet");
        stage("phrase");
        const m = await unseal(vault, password);      // throws on a wrong password
        stage("open");
        return await bootWallet(m, settingsOf(args));
    },

    /**
     * Applies new settings without locking: rebuilds the engine on them and reports the
     * new status. Refused while a transfer is still waiting for its counterparty, because
     * that transfer's state lives inside the engine being torn down.
     */
    async reconfigure(args) {
        const pending = S.account ? await S.account.pendingHandovers().catch(() => []) : [];
        if (pending.length) {
            throw new Error("A transfer is waiting for its recipient. Let it finish before changing settings.");
        }
        return await rebuildWallet(settingsOf(args));
    },

    /** Reseals the phrase. Wallet state in IndexedDB is untouched. */
    async changePassword({ oldPassword, newPassword, vault }) {
        if (!newPassword || newPassword.length < 8) throw new Error("New password must be at least 8 characters");
        if (!vault) throw new Error("Current vault not provided");
        const m = await unseal(vault, oldPassword);
        return { vault: await seal(m, newPassword) };
    },

    async btc() {
        const a = needAccount();
        try { if (S.online) await a.sync(); } catch { /* offline: show the last known figures */ }
        return { balance: await a.getBtcBalance(), address: await a.getAddress(), slots: await a.getFreeSlots() };
    },

    /** Asset list. Precision comes from contract metadata and stays null when unknown. */
    async assets() {
        const a = needAccount();
        return { assets: await a.listAssets(), backupNeeded: await a.isBackupNeeded() };
    },

    /** Creates empty colored UTXOs, which receiving requires. */
    async prepare() {
        return needAccount().createUtxos();
    },

    /** Blind receive invoice. `undefined` means any asset; the bindings reject null. */
    async receive(args = {}) {
        return needAccount().receiveAsset({ assetId: args.assetId, minutes: args.minutes });
    },

    /**
     * An invoice that needs no free slot: the asset lands on an output of the sender's own
     * transaction, which the sender creates and pays for.
     */
    async receiveWitness(args = {}) {
        return needAccount().receiveAssetToWitness({ assetId: args.assetId, minutes: args.minutes });
    },

    /**
     * Issues a new asset, the whole supply to this wallet.
     *
     * NOTE: one allocation per amount, and each takes a slot. The wallet issues a single
     * allocation, so what it costs is one slot and the caller can see it beforehand.
     */
    async issueAsset({ ticker, name, precision, amount }) {
        return needAccount().issueAsset({
            ticker: String(ticker || "").trim(),
            name: String(name || "").trim(),
            precision: Number(precision),
            amounts: [String(amount)],
        });
    },

    /**
     * Sends of this wallet's that are still waiting on their recipient. A send is not on the
     * chain until the recipient has validated the consignment and this wallet has refreshed,
     * so this is what tells the service worker whether it still has work to do.
     */
    async pending() {
        return { pending: await needAccount().pendingHandovers() };
    },

    /** Picks up consignments and advances the state machine. Cost grows with transfer history. */
    async refresh() {
        return needAccount().refresh();
    },

    async transfers({ assetId } = {}) {
        // `target` is what this wallet asked for when it built the invoice, so the UI can
        // say "1 of 1" rather than a bare count. rgb-lib does not hand the stored value
        // back, but the wallet has only ever passed this constant.
        const account = needAccount();
        let rows = await account.listTransfers(assetId || undefined);
        // A transfer row carries no asset id of its own and no flat amount: both are derived
        // here, in the row shape the UI reads. The asset comes from the per-asset listing.
        if (assetId) rows = rows.map((r) => transferRow(r, assetId));
        else if (rows.length) {
            const byIdx = new Map();
            for (const a of await account.listAssets()) {
                for (const r of await account.listTransfers(a.assetId)) byIdx.set(r.idx, a.assetId);
            }
            rows = rows.map((r) => transferRow(r, byIdx.get(r.idx)));
        }

        // Plain Bitcoin sends and receives live in the wallet's transaction list, not among
        // the RGB transfers. The two meet at the transactions an RGB transfer anchored on,
        // which the transfer rows already cover.
        const txs = assetId ? [] : await account.listTransactions().catch(() => []);
        const seen = new Set(rows.map((r) => r.txid).filter(Boolean));
        const btc = [];
        for (const tx of txs) {
            if (tx.transactionType !== "User" || seen.has(tx.txid)) continue;
            const recv = BigInt(tx.received) > BigInt(tx.sent);
            // `sent` counts the wallet's inputs and `received` its own outputs back, so what
            // reached the destination is the difference minus the fee. For a receive it is
            // the whole of `received`: the sender paid the fee.
            const amount = recv
                ? BigInt(tx.received)
                : BigInt(tx.sent) - BigInt(tx.received) - BigInt(tx.fee || 0);
            if (amount <= 0n) continue;
            btc.push({
                kind: recv ? "ReceiveBtc" : "SendBtc",
                status: tx.status,
                confirmations: tx.confirmations,
                txid: tx.txid,
                amount: amount.toString(),
                created_at: Number(tx.confirmationTime?.timestamp ?? Math.floor(Date.now() / 1000)),
                batchTransferIdx: null,
            });
        }
        const transfers = [...btc, ...rows].sort((x, y) => (y.created_at ?? 0) - (x.created_at ?? 0));
        return { transfers, target: DEFAULTS.minConfirmations };
    },

    /** Encrypted backup. The phrase alone cannot restore RGB assets; the stash must be included. */
    async backup({ password }) {
        const a = needAccount();
        if (!password || password.length < 8) throw new Error("Backup password must be at least 8 characters");
        const bytes = await a.createBackup(password);
        // plain array so it can cross the message channel
        return { bytes: Array.from(bytes), needed: await a.isBackupNeeded() };
    },

    /**
     * Identity: the pinned address on the vanilla path.
     * `publicKey` is the taproot x-only output key (32 bytes), decoded from the address.
     */
    async identity() {
        const address = await needAccount().getAddress();
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
        // The seller's colored input funds the seal output, and what it holds beyond that goes back
        // to the seller; the buyer's change is its own input minus the price and the fee. The
        // seller's input is read from this wallet's own indexer, not from the counterparty's PSBT.
        const sellerSats = await outputSats(sellerIn);
        const payout = Number(sellerPayout(price, sellerSats, SWAP_SEAL_SATS));
        const change = Number(prepared.buyerInputSats) - price - fee;
        if (change < 0) throw new Error("The prepared input no longer covers the price and the fee");
        WasmWallet.checkSwapPsbt(
            psbt,
            [sellerIn, prepared.buyerOutpoint],
            [
                { script: null, sats: 0 },                              // the RGB commitment
                { script: prepared.buyerSeal, sats: SWAP_SEAL_SATS },   // the asset arrives here
                { script: null, sats: payout },                         // the seller's payout
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

    /** How much of an asset this wallet can offer; see `sellable`. Read-only. */
    async swapSellable({ assetId }) {
        const w = needWallet();
        if (S.online) { try { await w.sync(S.online); } catch { /* offline: last known figures */ } }
        return sellable(plain(w.listUnspents(false)), String(assetId || ""));
    },

    /**
     * The seller's half of a swap, step one: build the transaction and colour it.
     *
     * The offer (asset, amount, price) is read from the platform's public endpoint, not taken
     * from the page. The page supplies the buyer's side of the session; what the seller relies on
     * is built here: the asset leaves only from this wallet's own UTXO, and the payout goes to
     * this wallet's address for the price plus what that UTXO holds beyond the seal.
     *
     * Colouring goes through rgb-lib's transfer path (`swapBegin`), so the sale is recorded in
     * this wallet as any send is. Nothing is signed here: the seller signs last, in `swapFinish`.
     */
    async swapColor({ offerId, apiBase, network, session }) {
        const w = needWallet();
        if (typeof network === "string" && network.toLowerCase() !== String(S.network).toLowerCase()) {
            throw new Error(`This wallet is on ${S.network} and the site is on ${network}. Switch the network in the wallet's settings.`);
        }
        const on = needOnline();
        const offer = await platformOffer(apiBase, offerId);
        if (offer.state && offer.state !== "MATCHED") throw new Error(`The offer is ${offer.state}`);
        const s = session || {};

        // The buyer's seal has to be the one its invoice names; the consignment goes to the
        // proxies the invoice names.
        const inv = plain(new WasmInvoice(String(s.buyerInvoice || "")).invoiceData());
        const seal = WasmWallet.invoiceSealScript(s.buyerInvoice);
        if (seal !== s.buyerSeal) throw new Error("The buyer's seal does not match its invoice");
        const proxies = (inv.transportEndpoints || []).length
            ? inv.transportEndpoints
            : [endpoints(S.settings).proxy];

        await w.sync(on);
        const unspents = plain(w.listUnspents(false));
        const own = new Set(unspents.map((u) => `${u.utxo.outpoint.txid}:${u.utxo.outpoint.vout}`));
        if (own.has(String(s.buyerOutpoint))) throw new Error("The buyer's input is one of this wallet's own");
        const seller = pickSellerInput(unspents, offer.assetId, offer.amount);
        if (!seller) throw new Error("No settled UTXO of this wallet holds that much of the asset");

        const [sellerPrev, buyerPrev] = await Promise.all([prevOutput(seller.outpoint), prevOutput(s.buyerOutpoint)]);
        const price = BigInt(offer.priceSats);
        const fee = BigInt(s.feeSats);
        const change = BigInt(buyerPrev.sats) - price - fee;
        if (change < 0n) throw new Error("The buyer's input does not cover the price and the fee");
        const payout = sellerPayout(price, sellerPrev.sats, SWAP_SEAL_SATS);

        const psbt = WasmWallet.buildSwapPsbt(
            [
                { outpoint: seller.outpoint, sats: sellerPrev.sats, script: sellerPrev.script, tx: sellerPrev.tx },
                { outpoint: String(s.buyerOutpoint), sats: buyerPrev.sats, script: buyerPrev.script, tx: buyerPrev.tx },
            ],
            [
                { script: seal, sats: SWAP_SEAL_SATS },
                { script: hex.to(scriptPubKeyOf(w.getAddress())), sats: Number(payout) },
                { script: String(s.buyerChangeScript), sats: Number(change) },
            ],
        );
        const colored = await w.swapBegin(
            on, psbt, offer.assetId, BigInt(offer.amount), inv.recipientId, 1, BigInt(SWAP_SEAL_SATS),
            proxies, DEFAULTS.minConfirmations,
        );
        await w.flush();
        return { psbt: colored, sellerOutpoint: seller.outpoint };
    },

    /**
     * The seller's half, step two: sign the buyer-signed transaction and broadcast it.
     *
     * Only the transaction this wallet coloured can be finished: `sendEnd` looks its transfer up
     * by the transaction id, and a PSBT with any output changed has another id. `sendEnd` then
     * broadcasts, posts the consignment to the buyer's proxy and records the sale.
     */
    async swapFinish({ psbt }) {
        const w = needWallet();
        const on = needOnline();
        if (typeof psbt !== "string" || !psbt) throw new Error("psbt is required");
        const signed = w.signPsbt(psbt);
        const r = plain(await w.sendEnd(on, signed, false));
        await w.flush();
        return { txid: r.txid };
    },

    /**
     * BIP-322 simple signature. The PSBT is built here and never reaches the page.
     * NOTE: never expose a generic "sign any PSBT" call; it would let a page spend a colored
     * UTXO, which destroys the assets on it.
     */
    async signMessage({ message }) {
        // Signed verbatim: the server verifies against its own stored copy.
        return needAccount().signMessage(message);
    },

    /** Decodes an invoice and rejects a network mismatch or an expired invoice. */
    async decodeInvoice({ invoice }) {
        await init();
        const d = plain(new WasmInvoice(String(invoice || "").trim()).invoiceData());
        const warnings = [];
        // Against the chain, not the wallet's name for it: an invoice says "regtest" whether
        // the wallet calls that network Regtest or Local.
        const chain = chainOf(S.network);
        if (d.network && chain && String(d.network).toLowerCase() !== String(chain).toLowerCase()) {
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
        const r = await needAccount().transfer({
            token: assetId,
            recipient: invoice,
            amount: amountRaw,
            feeRate,
        });
        return r.transfer;
    },

    /** Sends plain Bitcoin. Spends the vanilla keychain only, never a UTXO carrying assets. */
    async sendBtc({ address, amountSat, feeRate }) {
        const r = await needAccount().sendTransaction({ to: address, value: amountSat, feeRate });
        return { txid: r.hash };
    },

    /** Suggested fee rate in sat/vB. */
    async feeSuggestion() { return { feeRate: Number((await needAccount().quoteSendTransaction()).fee) }; },

    /**
     * Fails expired invoices and deletes the ones with no asset.
     * NOTE: the sweep only reaches transfers that are waiting for the counterparty and have
     * expired. A dangling invoice holds an allocation slot until then.
     */
    async cleanup() {
        return needAccount().cleanup();
    },

    /**
     * Fails one transfer by index, which is how a transfer stuck at "waiting for
     * confirmations" is cleared. The indexless sweep cannot reach that state.
     */
    async failTransfer({ batchTransferIdx }) {
        const idx = Number(batchTransferIdx);
        if (!Number.isInteger(idx)) throw new Error("Missing transfer index");
        // Not part of the module's surface: it fails one transfer by index, which only a UI
        // showing the list can ask for.
        return needAccount().runExclusive(async (w, on) => {
            if (!on) throw new Error("Indexer unreachable");
            const changed = await w.failTransfers(on, idx, false, false);
            await w.flush();
            return { changed };
        });
    },

    /** Restores from an encrypted backup. Requires the same recovery phrase, already unlocked. */
    async restoreBackup({ bytes, password }) {
        await needAccount().restoreBackup(bytes, password);
        return status();
    },

    async lockNow() { return { bye: true }; },   // the service worker performs the close
};

// One engine command at a time: concurrent calls panic inside rgb-lib.
//
// The wallet module queues its own calls, so its handlers are dispatched as they are. The
// swap handlers reach the engine directly — they use the six bindings the module does not
// wrap — and take the same queue through `runExclusive`.
//
// 🚨 Both, and nothing is wrapped twice: the queue is not reentrant, so a module call made
//    inside `runExclusive` would wait for a queue its own caller is holding.
const RAW_ENGINE = new Set(["swapPrepare", "swapSign", "swapSellable", "swapColor", "swapFinish"]);

listen("offscreen", Object.fromEntries(Object.entries(handlers).map(([cmd, fn]) => [
    cmd,
    RAW_ENGINE.has(cmd) ? (args) => needAccount().runExclusive(() => fn(args)) : fn,
])));
