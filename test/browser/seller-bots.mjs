// Simulated sellers for peer-to-peer swaps on the regtest server. Each bot is a real wallet on the
// shipped offscreen.js, in its own persistent browser profile: it buys the asset from the pool,
// withdraws it into its wallet, lists offers at the pool price, and completes both of the
// seller's confirmations whenever an offer is taken.
//
//     python3 test/browser/serve.py &
//     PLAYWRIGHT=<path to index.mjs> node test/browser/seller-bots.mjs <assetId> [bots] [tokens per offer]
//
// 🚨 Regtest only. Uses ssh to the server (RGB_SERVER, via deploy/_local.sh) to mint sessions,
// credit sats (dev-tools credit, a DEV ledger entry, as the load-test bots do) and mine.
// State (recovery phrases, profiles) is kept in BOT_DIR, default ~/.rgb-seller-bots.
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const [assetId, botsArg, tokensArg] = process.argv.slice(2);
if (!assetId) { console.error("usage: seller-bots.mjs <assetId> [bots] [tokens per offer]"); process.exit(2); }
const BOTS = Number(botsArg || 3);
const TOKENS = BigInt(tokensArg || 450000);
let chromium;
try { ({ chromium } = await import(process.env.PLAYWRIGHT || "playwright")); }
catch { console.error("playwright not found: npm i playwright, or set PLAYWRIGHT=<path to index.mjs>"); process.exit(2); }

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const API = "https://rgblaunchpad.meme/api/regtest/trade";
const BOT_DIR = process.env.BOT_DIR || path.join(os.homedir(), ".rgb-seller-bots");
fs.mkdirSync(BOT_DIR, { recursive: true });
const sh = (script) => execFileSync("bash", ["-c", `. deploy/_local.sh && need_local RGB_SERVER && ${script}`],
    { cwd: ROOT, encoding: "utf8" }).trim();
const bcli = (...a) => sh(`ssh -o BatchMode=yes "$RGB_SERVER" docker exec rgb-regtest-bitcoind-1 bitcoin-cli -regtest -datadir=/srv/app/.bitcoin -rpcwallet=miner ${a.join(" ")}`);
const mine = () => bcli("-generate", "1");
const devTools = (...a) => sh(`bash deploy/server.sh dev tools ${a.map((x) => `'${x}'`).join(" ")}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (bot, ...m) => console.log(`[${new Date().toISOString().slice(11, 19)}] ${bot.name}`, ...m);

async function api(bot, method, p, body) {
    const r = await fetch(`${API}${p}`, {
        method,
        headers: { authorization: `Bearer ${bot.token}`, "content-type": "application/json" },
        body: body && JSON.stringify(body),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`${method} ${p} ${r.status} ${JSON.stringify(j).slice(0, 300)}`);
    return j;
}

async function poolPriceQ18() {
    const r = await (await fetch(`${API}/v1/pools`)).json();
    const p = r.pools.find((x) => x.assetId === assetId);
    if (!p?.graduated) throw new Error("the asset has no graduated pool");
    return BigInt(p.priceQ18);
}

// ---------- one bot ----------
const browser = [];
async function startBot(i) {
    const name = `bot${i}`;
    const stateFile = path.join(BOT_DIR, `${name}.json`);
    const state = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, "utf8")) : {};
    const ctx = await chromium.launchPersistentContext(path.join(BOT_DIR, `${name}-profile`), {
        headless: true, args: ["--disable-web-security"],
    });
    browser.push(ctx);
    const page = ctx.pages()[0] || await ctx.newPage();
    const bot = { name, state, stateFile, page, crashed: false };
    page.on("pageerror", (e) => {
        console.log(name, "[pageerror]", String(e).slice(0, 200));
        // A panic leaves the engine unusable; the next round reopens the wallet.
        if (/unreachable/.test(String(e))) bot.crashed = true;
    });
    // The engine reports a panic, with where it happened, on the console.
    page.on("console", (m) => { if (m.type() === "error") console.log(name, "[console]", m.text().slice(0, 600)); });
    await page.goto("http://127.0.0.1:8777/test/browser/swap-probe.html");
    await page.waitForFunction(() => document.title === "ready", null, { timeout: 60000 });
    bot.call = async (cmd, args) => {
        const r = await page.evaluate(([c, a]) => window.call(c, a), [cmd, args]);
        if (!r.ok) throw new Error(`${cmd}: ${r.err}`);
        return r.data;
    };
    const save = () => fs.writeFileSync(stateFile, JSON.stringify(bot.state, null, 2), { mode: 0o600 });
    bot.reopen = async () => {
        await page.reload();
        await page.waitForFunction(() => document.title === "ready", null, { timeout: 60000 });
        await bot.call("create", { password: "bot-password", settings: { network: "Regtest" }, mnemonic: bot.state.mnemonic });
        bot.crashed = false;
        log(bot, "engine reopened after a crash");
    };

    const created = await bot.call("create", {
        password: "bot-password", settings: { network: "Regtest" }, mnemonic: state.mnemonic,
    });
    if (created.mnemonic) { bot.state.mnemonic = created.mnemonic; save(); }
    const { address } = await bot.call("identity");
    const session = JSON.parse(devTools("session", address));
    bot.token = session.token;
    bot.userId = session.userId;
    log(bot, "wallet", address, "user", bot.userId);
    return bot;
}

/** Settled holding of the asset on the bot's wallet. */
async function holding(bot) {
    const s = await bot.call("swapSellable", { assetId });
    return { total: BigInt(s.total), max: BigInt(s.max) };
}

/** The bot's platform balance of the asset: `{ available, frozen }` in base units. */
async function platformHolding(bot) {
    const b = (await api(bot, "GET", "/v1/me/balances")).balances?.[assetId] || {};
    return { available: BigInt(b.available ?? 0), frozen: BigInt(b.frozen ?? 0) };
}

/**
 * Get the bot `need` base units of the asset into its own wallet: bought from the pool with
 * credited sats unless the platform account already holds it, then withdrawn to the wallet.
 * Safe to run again after an interruption: nothing is bought or withdrawn twice.
 */
async function stock(bot, need) {
    await bot.call("refresh").catch(() => {});
    if ((await holding(bot)).max >= need) return;

    let acct = await platformHolding(bot);
    if (acct.available + acct.frozen < need) {
        const q18 = await poolPriceQ18();
        const short = need - acct.available - acct.frozen;
        // Sats: what the shortfall costs at the pool, plus the fee and room for the price to move.
        const sats = short * q18 / 10n ** 18n * 12n / 10n + 10_000n;
        devTools("credit", bot.userId, "sats", sats.toString());
        await api(bot, "POST", "/v1/swap", {
            assetIn: "sats", assetOut: assetId, amountIn: sats.toString(), minOut: "0",
            clientRequestId: `${bot.name}-buy-${Date.now()}`,
        });
        acct = await platformHolding(bot);
        log(bot, "bought; platform balance", acct.available.toString());
    }

    // Bitcoin for the wallet's own slots and fees, then slots to receive on.
    const btc = await bot.call("btc");
    if (BigInt(btc.balance.vanilla.settled) < 200_000n) {
        bcli("sendtoaddress", btc.address, "0.005"); mine(); await sleep(4000);
    }
    await bot.call("prepare").catch((e) => log(bot, "slots:", e.message));
    mine(); await sleep(4000); await bot.call("refresh").catch(() => {});

    if (acct.frozen === 0n) {
        // Any asset: a wallet that has never held this contract cannot name it in an invoice.
        const recv = await bot.call("receive", { minutes: 120 });
        const w = await api(bot, "POST", "/v1/withdrawals", {
            kind: "RGB", assetId, amount: acct.available.toString(), destination: recv.invoice,
            clientRequestId: `${bot.name}-wd-${Date.now()}`,
        });
        log(bot, "withdrawal of", acct.available.toString(), "queued, intent", w.intentId);
    } else {
        log(bot, "a withdrawal is already on its way");
    }
    for (let i = 0; i < 60; i++) {
        await sleep(6000);
        await bot.call("refresh").catch(() => {});
        if (i % 2 === 1) mine();
        if ((await holding(bot)).max >= need) { log(bot, "stocked"); return; }
    }
    throw new Error("the withdrawal did not settle in the wallet");
}

/** List one offer of `tokens` at the pool price. */
async function list(bot, amount) {
    const q18 = await poolPriceQ18();
    const priceSats = amount * q18 / 10n ** 18n;
    const r = await api(bot, "POST", "/v1/p2p/offers", {
        assetId, amount: amount.toString(), priceSats: priceSats.toString(), hours: 24,
        clientRequestId: `${bot.name}-offer-${Date.now()}`,
    });
    log(bot, "listed", r.offerId, amount.toString(), "for", priceSats.toString(), "sats");
}

/** One round of the seller's duties: colour what was taken, finish what the buyer signed. */
async function serve(bot) {
    const { offers } = await api(bot, "GET", "/v1/p2p/my/offers");
    for (const o of offers.filter((x) => x.assetId === assetId)) {
        const s = o.session;
        if (!s) continue;
        try {
            if (s.state === "MATCHED") {
                const r = await bot.call("swapColor", { offerId: o.offerId, apiBase: API, network: "regtest", session: s });
                await api(bot, "POST", `/v1/p2p/sessions/${s.sessionId}/colored`, { psbt: r.psbt, sellerOutpoint: r.sellerOutpoint });
                log(bot, "coloured", o.offerId, "for session", s.sessionId);
            } else if (s.state === "BUYER_SIGNED" && s.buyerPsbt) {
                const r = await bot.call("swapFinish", { offerId: o.offerId, apiBase: API, psbt: s.buyerPsbt });
                await api(bot, "POST", `/v1/p2p/sessions/${s.sessionId}/broadcast`, { txid: r.txid });
                log(bot, "sold", o.offerId, "broadcast", r.txid);
            }
        } catch (e) { log(bot, "session", s.sessionId, "failed:", e.message); }
    }
    return offers.filter((x) => x.assetId === assetId).length;
}

// ---------- main ----------
const precisionTokens = TOKENS * 10n ** 8n;       // YUZU and the platform's launches use precision 8
const bots = [];
for (let i = 1; i <= BOTS; i++) bots.push(await startBot(i));
for (const [i, bot] of bots.entries()) {
    // Offers of different sizes, so the list is not all alike.
    const amount = precisionTokens + BigInt(i) * 10n ** 13n;
    try {
        await stock(bot, amount);
        const { offers } = await api(bot, "GET", "/v1/p2p/my/offers");
        if (!offers.some((o) => o.assetId === assetId)) await list(bot, amount);
        bot.amount = amount;
    } catch (e) { log(bot, "setup failed:", e.message); }
}
log({ name: "all" }, "serving; Ctrl-C to stop");
process.on("SIGINT", async () => { for (const c of browser) await c.close().catch(() => {}); process.exit(0); });
for (let round = 0; ; round++) {
    for (const bot of bots) {
        try {
            if (bot.crashed) await bot.reopen();
            const open = await serve(bot);
            // Relist once the offer is gone (sold, expired or withdrawn) and stock remains.
            if (open === 0 && bot.amount && round % 6 === 0) {
                if ((await holding(bot)).max >= bot.amount) await list(bot, bot.amount);
            }
            if (round % 12 === 0) await bot.call("refresh").catch(() => {});
        } catch (e) { log(bot, "round failed:", e.message); }
    }
    await sleep(5000);
}
