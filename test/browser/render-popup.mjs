// Renders the real popup against a stubbed `chrome`, so screens that need the extension
// APIs can still be checked. `addInitScript` installs the stub before any page script runs,
// which is what lets popup.js itself be the code under test rather than a copy of it.
//
//     python3 test/browser/serve.py &
//     node test/browser/render-popup.mjs [outDir]
//
// playwright is not a dependency of this project; see run-identity.mjs for PLAYWRIGHT=.
let chromium;
try { ({ chromium } = await import(process.env.PLAYWRIGHT || "playwright")); }
catch { console.error("playwright not found: npm i playwright, or set PLAYWRIGHT=<path to index.mjs>"); process.exit(2); }

const OUT = process.argv[2] || ".";

const stub = (state) => `(() => {
  const S = ${JSON.stringify(state)};
  const ok = (data) => ({ ok: true, data });
  const REPLY = {
    hasVault: () => ok({ hasVault: true }),
    isUnlocked: () => ok({ unlocked: true }),
    status: () => ok({ unlocked: true, network: "Signet", online: !S.onlineErr,
                       onlineErr: S.onlineErr || null, persisted: S.persisted,
                       proxyMissing: !!S.proxyMissing, backupNeeded: S.backupNeeded }),
    assets: () => ok({ assets: S.assets, backupNeeded: S.backupNeeded }),
    btc: () => ok({ balance: S.btc || { vanilla: { spendable: 1126786, settled: 1126786 },
                                        colored: { settled: 750000, future: 750000 } },
                    address: "tb1pexample", slots: 3 }),
    receive: () => ok(S.invoice || {}),
    sites: () => ok({ sites: {} }),
    transfers: () => ok({ transfers: S.transfers || [], target: S.target ?? 1 }),
    refresh: () => ok(S.refresh || { ms: 12, cooldownMs: 5000 }),
    settings: () => ok({ network: S.network || "Signet", registryUrl: S.registryUrl || "",
                         lang: S.lang || "en" }),
  };
  window.chrome = {
    runtime: { sendMessage: async (m) => (REPLY[m.cmd] ? REPLY[m.cmd]() : ok({})),
               onMessage: { addListener: () => {} }, getURL: (p) => p },
    storage: { local: { get: async () => (S.backupDoneAt ? { backupDoneAt: 1 } : {}), set: async () => {} } },
    tabs: { query: async () => [], create: async () => {} },
    windows: { create: async () => {} },
  };
  // The asset index is stubbed at the network boundary: lib/registry.js itself is under test.
  if (S.registryAssets) {
    const real = window.fetch;
    window.fetch = async (url, init) => (String(url).includes("/v1/assets")
      ? new Response(JSON.stringify({ assets: S.registryAssets }), { headers: { "content-type": "application/json" } })
      : real(url, init));
  }
})()`;

const ASSETS = [{
    assetId: "rgb:7rpb4dzk-d6_YcBP-HA5naMq-EUUs14G-tP6haiF-V_n~x5c",
    ticker: "SIGSMOKE", name: "Signet Smoke", precision: 0,
    balance: { settled: "0", future: "100000" },
}];
const BASE = { backupNeeded: true, persisted: false, backupDoneAt: 1, assets: ASSETS };

// 1278888 settled, of which only 8888 sits on UTXOs no invoice or pending transfer holds.
const HELD = {
    assetId: "rgb:KpdyOz~w-K~VX34e-4~u0gsM-l9eCz9~-cVplLOG-Kg0W2MQ", ticker: "TEST", name: "Test",
    precision: 8,
    balance: { settled: "127888800000000", future: "127888800000000", spendable: "888800000000" },
};

const NOW = Math.floor(Date.now() / 1000);
const TRANSFERS = [
    { idx: 3, batch_transfer_idx: 3, status: "WaitingConfirmations", kind: "ReceiveBlind",
      amount: "100000", assetId: ASSETS[0].assetId, txid: "a7af07bd7cb05dab700202beb465a418c",
      confirmations: 0, created_at: NOW - 12 * 60, updated_at: NOW - 12 * 60 },
    { idx: 2, batch_transfer_idx: 2, status: "WaitingConfirmations", kind: "ReceiveBlind",
      amount: "5000", assetId: ASSETS[0].assetId, txid: "bb11",
      confirmations: 2, created_at: NOW - 3600, updated_at: NOW - 3600, },
    // Indexer could not be asked: no number rather than a wrong one.
    { idx: 1, batch_transfer_idx: 1, status: "WaitingCounterparty", kind: "ReceiveBlind",
      amount: "1", assetId: ASSETS[0].assetId, created_at: NOW - 90, updated_at: NOW - 90 },
    { idx: 0, batch_transfer_idx: 0, status: "Settled", kind: "Send", amount: "42",
      assetId: ASSETS[0].assetId, txid: "cc22", created_at: NOW - 86400, updated_at: NOW - 86400 },
];

// `expect` is asserted; a case that does not match exits non-zero.
const CASES = [
    // A real regtest invoice: utxob plus the expiry and the proxy endpoint. 151 characters is
    // version 8 at error correction M, which is 49 modules plus two of quiet zone each side.
    { name: "receive-qr", label: "the QR carries the whole invoice, not a shortened one",
      state: { ...BASE, invoice: { invoice: "rgb:~/~/~/bcrt:utxob:y98IppFk-7y6Wcqt-hsqoyC~-e_7~Udx"
                                          + "-Og9hGYy-RlRBMyY-CxMSo?expiry=1789901489&endpoints="
                                          + "rpcs://regtest-proxy.dhorse.fun/json-rpc",
                                   expirationTimestamp: NOW + 3600 } },
      view: "recv", click: "#doInvoice",
      expect: { invoiceLen: 144, qrSide: 53 } },

    { name: "notice-none", label: "a wallet that needs a backup is not nagged about it",
      state: BASE,
      expect: { noticeRows: 0, redRows: 0 } },
    { name: "notice-blocking", label: "an unreachable indexer is a red row, because nothing works without one",
      state: { ...BASE, onlineErr: "fetch failed" },
      expect: { noticeRows: 1, redRows: 1 } },
    { name: "btc-pending", label: "the Bitcoin panel breaks out the unconfirmed amount",
      state: { ...BASE, btc: { vanilla: { spendable: 1141877, settled: 1035768 },
                               colored: { future: 750000 } } },
      view: "btc",
      expect: { btcRows: ["Available = 0.01141877 BTC", "Confirmed = 0.01035768 BTC",
                          "Waiting to confirm = 0.00106109 BTC", "In RGB UTXOs = 0.0075 BTC"] } },
    { name: "btc-all-confirmed", label: "no extra row when nothing is unconfirmed",
      state: { ...BASE, btc: { vanilla: { spendable: 1035768, settled: 1035768 },
                               colored: { future: 0 } } },
      view: "btc",
      expect: { btcRows: ["Available = 0.01035768 BTC", "Confirmed = 0.01035768 BTC",
                          "In RGB UTXOs = 0 BTC"] } },
    { name: "home-pending", label: "the headline counts what is spendable now; the unconfirmed part is named under it",
      state: { ...BASE, btc: { vanilla: { spendable: 1141877, settled: 1035768 },
                               colored: { future: 750000 } } },
      wait: 900,           // the figure counts up for 700ms before the exact text lands
      expect: { btcBig: "0.01141877", btcPend: "Includes 0.00106109 BTC waiting to confirm" } },
    { name: "home-all-confirmed", label: "no pending line under the headline when nothing is unconfirmed",
      state: { ...BASE, btc: { vanilla: { spendable: 1035768, settled: 1035768 },
                               colored: { future: 0 } } },
      wait: 900,
      expect: { btcBig: "0.01035768", btcPend: "" } },
    { name: "send-unconfirmed-warn", label: "spending past the confirmed balance warns but does not block",
      state: { ...BASE, btc: { vanilla: { spendable: 1141877, settled: 1035768 },
                               colored: { future: 750000 } } },
      view: "send", preClick: "[data-send=btc]", fill: { "#bAmount": "0.011" },
      expect: { bPendHint: "More than the confirmed balance — the rest is still waiting to confirm. " +
                           "If that transaction never confirms, this send fails with it." } },
    { name: "send-within-confirmed", label: "an amount inside the confirmed balance gets no warning",
      state: { ...BASE, btc: { vanilla: { spendable: 1141877, settled: 1035768 },
                               colored: { future: 750000 } } },
      view: "send", preClick: "[data-send=btc]", fill: { "#bAmount": "0.001" },
      expect: { bPendHint: "" } },
    { name: "asset-identity", label: "a lookalike ticker is called out, and statuses stay separate",
      state: { ...BASE, assets: [HELD], registryUrl: "https://dhorse.fun/api/signet/public",
               registryAssets: [
                 { contract_id: HELD.assetId, ticker: "TEST", name: "Test",
                   status: { issuer_signed: true, listed_by: [{ publisher: "signet:x" }] } },
                 { contract_id: "rgb:lookalike", ticker: "test", name: "Lookalike",
                   status: { issuer_signed: true, issuer_verified: true, listed_by: [] } },
               ] },
      click: ".asset" },
    { name: "asset-unregistered", label: "an asset no index knows is shown as unregistered, not as suspect",
      state: { ...BASE, assets: [HELD], registryUrl: "https://dhorse.fun/api/signet/public", registryAssets: [] },
      click: ".asset" },
    { name: "sync-cooldown", label: "Sync enters a cooldown and counts down",
      state: { ...BASE, assets: ASSETS }, click: "#doRefresh",
      expect: { syncDisabled: true, syncLabel: "Sync in 5s" } },
    { name: "sync-rate-limited", label: "clicking during the cooldown shows the time left and does not refresh",
      state: { ...BASE, assets: ASSETS, refresh: { cooledDown: true, waitMs: 3200 } },
      click: "#doRefresh",
      expect: { syncDisabled: true, syncLabel: "Sync in 4s" } },
    { name: "send-max", label: "Max offers what can be sent now, not the settled balance",
      state: { ...BASE, assets: [HELD] }, view: "send", click: "#sMax",
      expect: { maxShown: true, maxLabel: "Max 8888", amountValue: "8888" } },
    { name: "send-over-max", label: "an amount above the max is stopped before rgb-lib sees it",
      state: { ...BASE, assets: [HELD] }, view: "send",
      fill: { "#sAmount": "1270000" }, click: "#doSendRgb",
      expect: { sendErr: "More than can be sent now. Max 8888" } },
    { name: "home-asset-inflight", label: "an in-flight asset names its step under the amount",
      state: { ...BASE, assets: ASSETS, transfers: TRANSFERS, target: 3 },
      expect: { assetSub: ["Confirming · in the mempool"] } },
    { name: "settings-lang", label: "the language row shows the language in use, not the default",
      state: { ...BASE, lang: "zh" }, click: "#gear",
      expect: { langLabel: "中文" } },
    { name: "activity-confirmations", label: "Activity shows confirmation progress",
      state: { ...BASE, transfers: TRANSFERS, target: 3 }, view: "hist",
      expect: { rows: 4,
                texts: ["Confirming · in the mempool",
                        "Confirming · 2 of 3",
                        "Waiting for the other side",  // say nothing when the indexer is unreachable
                        "Settled"] } },          // no progress once settled
];

const b = await chromium.launch();
let failed = 0;
for (const c of CASES) {
    const ctx = await b.newContext({ viewport: { width: 380, height: 520 } });
    const p = await ctx.newPage();
    p.on("pageerror", (e) => { console.log("  [pageerror]", String(e.stack || e).slice(0, 600)); failed++; });
    await p.addInitScript(stub(c.state));
    await p.goto("http://127.0.0.1:8777/popup.html");
    await p.waitForSelector("#main:not([hidden])", { timeout: 15000 });
    // Bitcoin is the Bitcoin tab of Receive, reached from the balance card.
    if (c.view === "btc") {
        await p.click("#btcCard .figure");
        await p.waitForSelector("#recv-btc:not([hidden])", { timeout: 5000 });
    } else if (c.view) {
        await p.click(`[data-view="${c.view}"]`);
        await p.waitForSelector(`#v-${c.view}:not([hidden])`, { timeout: 5000 });
    }
    // A tab inside the view may have to open before its inputs accept a fill.
    if (c.preClick) await p.click(c.preClick);
    for (const [sel, value] of Object.entries(c.fill || {})) await p.fill(sel, value);
    // Some screens only show what matters after an action — the sync cooldown, for one.
    if (c.click) await p.click(c.click);
    await p.waitForTimeout(c.wait || 300);

    const got = await p.evaluate(() => ({
        rows: document.querySelectorAll("#histList .tx").length,
        texts: [...document.querySelectorAll("#histList .tx .st")].map((el) => el.textContent.trim()),
        // Label and value read separately: the template puts them adjacent, so joining
        // the text would depend on incidental whitespace.
        maxShown: !document.getElementById("sMax").hidden,
        maxLabel: document.getElementById("sMax").textContent,
        amountValue: document.getElementById("sAmount").value,
        sendErr: document.getElementById("sendErr").hidden ? "" : document.getElementById("sendErr").textContent,
        btcBig: document.getElementById("btcBig").textContent,
        btcPend: document.getElementById("btcPend").hidden ? "" : document.getElementById("btcPend").textContent,
        bPendHint: document.getElementById("bPendHint").hidden ? "" : document.getElementById("bPendHint").textContent,
        syncDisabled: document.getElementById("doRefresh").disabled,
        syncLabel: document.getElementById("refreshMs").textContent,
        // The language row is a picker button standing in for the native select: the button
        // is what the user reads, and it does not follow `.value` set in code on its own.
        langLabel: (() => {
            const b = document.getElementById("stLang").nextElementSibling;
            return b?.querySelector(".picker-label")?.textContent ?? "";
        })(),
        btcRows: [...document.querySelectorAll("#btcBal .r")].map((el) =>
            `${el.children[0]?.textContent.trim()} = ${el.children[1]?.textContent.trim()}`),
        // The step under an in-flight asset amount: a bare delta reads as stuck.
        assetSub: [...document.querySelectorAll("#homeList .asset .amt small.fine")]
            .map((el) => el.textContent.trim()),
        noticeRows: document.getElementById("banner").hidden ? 0 : document.querySelectorAll("#banner .note").length,
        redRows: document.querySelectorAll("#banner .note.red").length,
        // Nothing may widen the popup past its fixed body width.
        overflow: document.documentElement.scrollWidth > 380,
        // A QR that encodes a shortened invoice looks exactly like one that does not, so the
        // symbol is measured instead: its module count is a function of how much it carries.
        qrSide: (() => {
            const svg = document.querySelector("#invoiceQr svg");
            return svg ? Number(svg.getAttribute("viewBox").split(" ")[3]) : 0;
        })(),
        invoiceLen: document.getElementById("invoice").textContent.length,
    }));
    const eq = (a, b) => (Array.isArray(b) ? JSON.stringify(a) === JSON.stringify(b) : a === b);
    const bad = Object.entries(c.expect || {}).filter(([k, v]) => !eq(got[k], v));
    if (got.overflow) bad.push(["overflow", false]);
    console.log(`${bad.length ? "FAIL" : "ok  "}  ${c.label}  ${JSON.stringify(got)}`);
    if (bad.length) { console.log("      expected", JSON.stringify(Object.fromEntries(bad))); failed++; }
    await p.screenshot({ path: `${OUT}/${c.name}.png` });
    await ctx.close();
}
await b.close();
console.log(failed ? `\n${failed} failed` : "\nPASS");
process.exit(failed ? 1 : 0);
