// The buyer half of a peer-to-peer swap, end to end against the regtest server: the shipped
// offscreen.js prepares, the platform's daemon colours, offscreen.js checks and signs, the
// platform signs last and broadcasts, and the asset lands in the wallet. What the page would do
// (take, hand back the signature, poll) is done here with a dev session.
//
//     python3 test/browser/serve.py &
//     PLAYWRIGHT=<path to index.mjs> node test/browser/run-swap.mjs <offerId>
//     ABANDON=1 …   stop once the seller has signed and let the session expire
//     MNEMONIC=… …  restore the wallet an earlier run printed
//     PREPARE_ONLY=1 …  stop after swapPrepare; the offer is read, not taken
//
// 🚨 Regtest only. Needs ssh to the server (RGB_SERVER, via deploy/_local.sh) to fund the wallet,
// mint a session and mine. Consumes the offer.
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const offerId = process.argv[2];
if (!offerId) { console.error("usage: run-swap.mjs <offerId>"); process.exit(2); }
let chromium;
try { ({ chromium } = await import(process.env.PLAYWRIGHT || "playwright")); }
catch { console.error("playwright not found: npm i playwright, or set PLAYWRIGHT=<path to index.mjs>"); process.exit(2); }

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const API = "https://rgblaunchpad.meme/api/regtest/trade";
const sh = (script) => execFileSync("bash", ["-c", `. deploy/_local.sh && need_local RGB_SERVER && ${script}`],
    { cwd: ROOT, encoding: "utf8" }).trim();
const bcli = (...a) => sh(`ssh -o BatchMode=yes "$RGB_SERVER" docker exec rgb-regtest-bitcoind-1 bitcoin-cli -regtest -datadir=/srv/app/.bitcoin -rpcwallet=miner ${a.join(" ")}`);
const mine = () => bcli("-generate", "1");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const step = (s) => console.log(`\n== ${s}`);
const die = (m) => { console.log(`FAIL  ${m}`); process.exit(1); };

// Chrome grants the extension host access; a test page has none, so CORS is switched off.
const b = await chromium.launch({ args: ["--disable-web-security"] });
const p = await (await b.newContext()).newPage();
// The engine logs why it refuses a consignment to the console and nowhere else.
p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.log(`[${m.type()}]`, m.text().slice(0, 400)); });
p.on("pageerror", (e) => console.log("[pageerror]", String(e).slice(0, 300)));
await p.goto("http://127.0.0.1:8777/test/browser/swap-probe.html");
await p.waitForFunction(() => document.title === "ready", null, { timeout: 60000 });
const call = async (cmd, args) => {
    const r = await p.evaluate(([c, a]) => window.call(c, a), [cmd, args]);
    console.log(`${cmd} ->`, JSON.stringify(r).slice(0, 600));
    return r;
};
const must = async (cmd, args) => { const r = await call(cmd, args); if (!r.ok) die(`${cmd}: ${r.err}`); return r.data; };

step("create a regtest wallet");
const settings = { network: "Regtest" };
// MNEMONIC=<phrase> restores a wallet an earlier run used. Its colored address index starts
// again, so the first address tried is one that run's swap already named on the proxy.
const created = await must("create", { password: "probe-password", settings, mnemonic: process.env.MNEMONIC });
if (created.mnemonic) console.log(`mnemonic: ${created.mnemonic}`);
const { address } = await must("identity");

step("fund it with 0.002 BTC and confirm");
console.log("txid", bcli("sendtoaddress", address, "0.002"));
mine();
for (let i = 0; ; i++) {
    await sleep(3000);
    const bal = await must("btc");
    if (BigInt(bal.balance.vanilla.settled) > 0n) break;
    if (i > 20) die("the funding never settled");
}

step("swapPrepare");
const prepared = await must("swapPrepare", { offerId, apiBase: API, network: "regtest" });
console.log("recipient", prepared.buyerInvoice.match(/wvout:([^?]+)/)?.[1]);
// PREPARE_ONLY=1 stops before taking the offer: swapPrepare reads the offer but reserves nothing.
if (process.env.PREPARE_ONLY) { await b.close(); console.log("\nPREPARED"); process.exit(0); }

step("take the offer");
const token = JSON.parse(sh(`bash deploy/server.sh dev tools session ${address}`)).token;
const api = async (method, p_, body) => {
    const r = await fetch(`${API}${p_}`, { method, headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: body && JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) die(`${method} ${p_} ${r.status} ${JSON.stringify(j)}`);
    return j;
};
const { buyerInvoice, buyerSeal, buyerOutpoint, buyerInputSats, buyerChangeScript, feeSats } = prepared;
const taken = await api("POST", `/v1/p2p/offers/${offerId}/take`, {
    clientRequestId: `probe-${Date.now()}`, buyerInvoice, buyerSeal, buyerOutpoint, buyerInputSats, buyerChangeScript, feeSats });
console.log("take ->", JSON.stringify(taken));

step("wait for the seller's PSBT");
let psbt = null;
// WAIT_MIN: how long to wait for the seller. A person selling from its own wallet confirms by
// hand; the platform's daemon answers within seconds.
const waitRounds = Number(process.env.WAIT_MIN || 2) * 30;
for (let i = 0; i < waitRounds && !psbt; i++) {
    const s = await api("GET", `/v1/p2p/sessions/${taken.sessionId}`);
    if (s.psbt) psbt = s.psbt;
    else if (s.state !== "MATCHED" && s.state !== "COLORED") die(`session is ${s.state}`);
    else await sleep(2000);
}
if (!psbt) die("the seller did not colour in time");
// ABANDON=1 stops here and lets the session expire, so the next run colours the same allocation
// a second time: the path where a stale consignment used to reach the buyer.
if (process.env.ABANDON) { await b.close(); console.log(`\nABANDONED  session ${taken.sessionId} will expire`); process.exit(0); }

step("swapSign");
const signed = await must("swapSign", { offerId, psbt, apiBase: API });
await api("POST", `/v1/p2p/sessions/${taken.sessionId}/sign`, { psbt: signed.psbt });

step("wait for the seller to sign and broadcast");
for (let i = 0; i < waitRounds && !signed.txid; i++) {
    const s = await api("GET", `/v1/p2p/sessions/${taken.sessionId}`);
    if (s.txid) signed.txid = s.txid;
    else if (s.state !== "BUYER_SIGNED") die(`session is ${s.state}`);
    else await sleep(2000);
}
if (!signed.txid) die("the seller did not broadcast in time");
console.log("broadcast", signed.txid);

step("confirm and pick up the asset");
mine();
let got = null;
for (let i = 0; i < 20 && !got; i++) {
    await sleep(4000);
    await call("refresh");
    const { assets } = await must("assets");
    got = assets.find((a) => a.assetId === prepared.assetId && BigInt(a.balance?.settled ?? 0) > 0n) || null;
}
await b.close();
if (!got) die("the asset did not settle in the wallet");
console.log(`\nPASS  ${offerId}: bought ${got.balance.settled} of ${got.assetId}, txid ${signed.txid}`);
