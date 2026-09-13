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
                                        colored: { future: 750000 } },
                    address: "tb1pexample", slots: 3 }),
    sites: () => ok({ sites: {} }),
    transfers: () => ok({ transfers: S.transfers || [], target: S.target ?? 1 }),
    refresh: () => ok(S.refresh || { ms: 12, cooldownMs: 5000 }),
  };
  window.chrome = {
    runtime: { sendMessage: async (m) => (REPLY[m.cmd] ? REPLY[m.cmd]() : ok({})),
               onMessage: { addListener: () => {} }, getURL: (p) => p },
    storage: { local: { get: async () => (S.backupDoneAt ? { backupDoneAt: 1 } : {}) } },
    tabs: { query: async () => [], create: async () => {} },
    windows: { create: async () => {} },
  };
})()`;

const ASSETS = [{
    assetId: "rgb:7rpb4dzk-d6_YcBP-HA5naMq-EUUs14G-tP6haiF-V_n~x5c",
    ticker: "SIGSMOKE", name: "Signet Smoke", precision: 0,
    balance: { settled: "0", future: "100000" },
}];
const BASE = { backupNeeded: true, persisted: false, backupDoneAt: 1, assets: ASSETS };

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
    { name: "notice-collapsed", label: "a lone backup notice stays collapsed",
      state: BASE,
      expect: { noticeShown: true, noticeText: "⚠", stripShown: false, dupWarn: 0 } },
    { name: "notice-blocking", label: "a blocking notice expands on its own",
      state: { ...BASE, onlineErr: "fetch failed" },
      expect: { noticeShown: true, noticeText: "⚠ 2", stripShown: true, dupWarn: 0 } },
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
    { name: "sync-cooldown", label: "Sync enters a cooldown and counts down",
      state: { ...BASE, assets: ASSETS }, click: "#doRefresh",
      expect: { syncDisabled: true, syncLabel: "Sync 5s" } },
    { name: "sync-rate-limited", label: "clicking during the cooldown shows the time left and does not refresh",
      state: { ...BASE, assets: ASSETS, refresh: { cooledDown: true, waitMs: 3200 } },
      click: "#doRefresh",
      expect: { syncDisabled: true, syncLabel: "Sync 4s" } },
    { name: "activity-confirmations", label: "Activity shows confirmation progress",
      state: { ...BASE, transfers: TRANSFERS, target: 3 }, view: "hist",
      expect: { rows: 4,
                texts: ["In the mempool, no confirmations yet · 12m",
                        "2 of 3 confirmations · 1h",
                        "",                      // say nothing when the indexer is unreachable
                        ""] } },                 // no progress line once settled
];

const b = await chromium.launch();
let failed = 0;
for (const c of CASES) {
    const ctx = await b.newContext({ viewport: { width: 380, height: 520 } });
    const p = await ctx.newPage();
    p.on("pageerror", (e) => { console.log("  [pageerror]", String(e).slice(0, 200)); failed++; });
    await p.addInitScript(stub(c.state));
    await p.goto("http://127.0.0.1:8777/popup.html");
    await p.waitForSelector("#main:not([hidden])", { timeout: 15000 });
    if (c.view) {
        await p.click(`[data-view="${c.view}"]`);
        await p.waitForSelector(`#v-${c.view}:not([hidden])`, { timeout: 5000 });
    }
    // Some screens only show what matters after an action — the sync cooldown, for one.
    if (c.click) await p.click(c.click);
    await p.waitForTimeout(300);

    const got = await p.evaluate(() => ({
        rows: document.querySelectorAll("#histList .asset").length,
        texts: [...document.querySelectorAll("#histList .asset")].map((el) => {
            const m = [...el.querySelectorAll(".muted")]
                .map((x) => x.textContent.trim())
                .filter((x) => /confirmation|mempool/.test(x));
            return m[0] || "";
        }),
        // Label and value read separately: the template puts them adjacent, so joining
        // the text would depend on incidental whitespace.
        syncDisabled: document.getElementById("doRefresh").disabled,
        syncLabel: document.getElementById("doRefresh").textContent,
        btcRows: [...document.querySelectorAll("#btcBal .row")].map((el) =>
            `${el.children[0]?.textContent.trim()} = ${el.children[1]?.textContent.trim()}`),
        noticeShown: !document.getElementById("notice").hidden,
        noticeText: document.getElementById("notice").textContent,
        stripShown: !document.getElementById("banner").hidden,
        dupWarn: document.querySelectorAll("#homeList .warn").length,
        // Nothing may widen the popup past its fixed body width.
        overflow: document.documentElement.scrollWidth > 380,
    }));
    const eq = (a, b) => (Array.isArray(b) ? JSON.stringify(a) === JSON.stringify(b) : a === b);
    const bad = Object.entries(c.expect).filter(([k, v]) => !eq(got[k], v));
    if (got.overflow) bad.push(["overflow", false]);
    console.log(`${bad.length ? "FAIL" : "ok  "}  ${c.label}  ${JSON.stringify(got)}`);
    if (bad.length) { console.log("      expected", JSON.stringify(Object.fromEntries(bad))); failed++; }
    await p.screenshot({ path: `${OUT}/${c.name}.png` });
    await ctx.close();
}
await b.close();
console.log(failed ? `\n${failed} failed` : "\nPASS");
process.exit(failed ? 1 : 0);
