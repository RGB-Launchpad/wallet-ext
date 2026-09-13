// Chrome Web Store screenshots, 1280x800, from the real popup.
//
//     python3 test/browser/serve.py &
//     node store/screenshots.mjs [outDir]
//
// The `chrome` stub is installed before any page script runs and applies to the iframe too,
// so what gets photographed is popup.js itself rather than a mock-up of it. playwright is
// not a dependency of this project; see test/browser/run-identity.mjs for PLAYWRIGHT=.
let chromium;
try { ({ chromium } = await import(process.env.PLAYWRIGHT || "playwright")); }
catch { console.error("playwright not found: npm i playwright, or set PLAYWRIGHT=<path to index.mjs>"); process.exit(2); }

const OUT = process.argv[2] || "store/screenshots";
const BASE = "http://127.0.0.1:8777";

const ASSETS = [
    { assetId: "rgb:7rpb4dzk-d6_YcBP-HA5naMq-EUUs14G-tP6haiF-V_n~x5c",
      ticker: "SIGSMOKE", name: "Signet Smoke", precision: 0,
      balance: { settled: "100000", future: "100000" } },
    { assetId: "rgb:2Wv9QmK-xLp4Rt7-nB8cYdA-fG3hJ5s-Kw1Nz6T-Qr0Vb~e",
      ticker: "PONS", name: "Pons Token", precision: 2,
      balance: { settled: "250000", future: "275000" } },
];
const NOW = Math.floor(Date.now() / 1000);

const stub = (state) => `(() => {
  const S = ${JSON.stringify(state)};
  const ok = (data) => ({ ok: true, data });
  const REPLY = {
    hasVault: () => ok({ hasVault: true }),
    isUnlocked: () => ok({ unlocked: true }),
    status: () => ok({ unlocked: true, network: S.network || "Signet", online: true,
                       onlineErr: null, persisted: true, proxyMissing: false,
                       backupNeeded: false }),
    assets: () => ok({ assets: S.assets || [], backupNeeded: false }),
    btc: () => ok({ balance: S.btc || { vanilla: { spendable: 1035768, settled: 1035768 },
                                        colored: { future: 60000 } },
                    address: "tb1pppvwtdsk9k460qwm0dx7hj0fw467j3hp24e4kxlv6xha80ax5hwqaypqcj",
                    slots: 3 }),
    transfers: () => ok({ transfers: S.transfers || [], target: 1 }),
    sites: () => ok({ sites: {} }),
    receive: () => ok(S.invoice || {}),
    approvalGet: () => ok(S.approval || {}),
    identity: () => ok({ address: "tb1pppvwtdsk9k460qwm0dx7hj0fw467j3hp24e4kxlv6xha80ax5hwqaypqcj" }),
  };
  window.chrome = {
    runtime: { sendMessage: async (m) => (REPLY[m.cmd] ? REPLY[m.cmd]() : ok({})),
               onMessage: { addListener: () => {} }, getURL: (p) => p },
    storage: { local: { get: async () => ({ backupDoneAt: 1 }) } },
    tabs: { query: async () => [], create: async () => {} },
    windows: { create: async () => {} },
  };
})()`;

// The frame is the popup at its real width; the page around it is only a backdrop.
const SCALE = 1.22;   // per-shot override where the content is tall

const canvas = (src, caption, frameH, scale = SCALE) => `
<!doctype html><meta charset="utf-8">
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin:0; width:1280px; height:800px; display:flex; flex-direction:column;
         align-items:center; justify-content:center; gap:26px;
         background: linear-gradient(160deg,#f6f7f9 0%,#eceef2 55%,#e4e7ec 100%);
         font:400 15px/1.5 -apple-system, system-ui, sans-serif; color:#1c1e21; }
  h1 { margin:0; font-size:27px; font-weight:600; letter-spacing:-0.015em; text-align:center; }
  /* ⚠️ transform:scale() takes no layout space, so the scaled shell used to overflow
     upwards and sit on top of the caption. The wrapper reserves the scaled size. */
  .wrap { width:${Math.round(380 * scale)}px; height:${Math.round(frameH * scale)}px;
          display:grid; place-items:center; }
  .shell { width:380px; height:${frameH}px; border-radius:13px; overflow:hidden;
           background:#fff; transform:scale(${scale}); transform-origin:center;
           box-shadow:0 18px 44px rgba(20,24,33,.17), 0 2px 7px rgba(20,24,33,.09); }
  iframe { width:380px; height:${frameH}px; border:0; display:block; }
</style>
<h1>${caption}</h1>
<div class="wrap"><div class="shell"><iframe src="${src}"></iframe></div></div>
`;

const SHOTS = [
    { name: "1-assets", caption: "Your RGB assets, validated on your own device",
      page: "popup.html", frameH: 440,
      state: { assets: ASSETS } },

    { name: "2-receive", caption: "Create an invoice to receive an asset",
      page: "popup.html", frameH: 520, view: "recv", click: "#doInvoice",
      state: { assets: ASSETS,
               invoice: { invoice: "rgb:2Wv9QmK-xLp4Rt7-nB8cYdA-fG3hJ5s-Kw1Nz6T-Qr0Vb~e/RBTC/"
                                 + "utxob:8kqL2mN-pR4vX7c-Td9YfHs-Jw3Bz6Q-nM1sV5g-Kx0Ra~t",
                          expirationTimestamp: NOW + 3600 } } },

    { name: "3-activity", caption: "Every transfer, with how far it has confirmed",
      page: "popup.html", frameH: 430, view: "hist",
      state: { assets: ASSETS, transfers: [
          { idx: 3, batch_transfer_idx: 3, status: "WaitingConfirmations", kind: "ReceiveBlind",
            amount: "25000", assetId: ASSETS[1].assetId, txid: "a7af07bd7cb05dab700202beb465a418c",
            confirmations: 0, created_at: NOW - 240, updated_at: NOW - 240 },
          { idx: 2, batch_transfer_idx: 2, status: "Settled", kind: "ReceiveBlind",
            amount: "100000", assetId: ASSETS[0].assetId, txid: "3f81c0aa9d27e5b41c6f",
            created_at: NOW - 7200, updated_at: NOW - 7200 },
          { idx: 1, batch_transfer_idx: 1, status: "Settled", kind: "Send",
            amount: "5000", assetId: ASSETS[1].assetId, txid: "bb2190ce7714a03d8e52",
            created_at: NOW - 86400, updated_at: NOW - 86400 },
      ] } },

    { name: "4-bitcoin", caption: "Bitcoin for fees, kept apart from asset UTXOs",
      page: "popup.html", frameH: 400, view: "btc",
      state: { assets: ASSETS,
               btc: { vanilla: { spendable: 1141877, settled: 1035768 },
                      colored: { future: 60000 } } } },

    { name: "5-signing", caption: "Sites ask; you approve. No key ever leaves the wallet",
      page: "approve.html?req=demo", frameH: 610, scale: 1.05,
      state: { approval: { method: "signMessage", origin: "https://rgblaunchpad.meme",
                           status: "pending",
                           params: { message: "RGB Launchpad \u00b7 Sign in\n"
                               + "Address: tb1pppvwtdsk9k460qwm0dx7hj0fw467j3hp24e4kxlv6xha80ax5hwqaypqcj\n"
                               + "Network: signet\nNonce: 466a0a4d87d3f3fbad2fef9fea3f3491\n\n"
                               + "This signature is only used to sign in. It does not move any assets." } } } },
];

const b = await chromium.launch();
for (const s of SHOTS) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 },
                                     deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    p.on("pageerror", (e) => console.log("  [pageerror]", String(e).slice(0, 160)));
    await p.addInitScript(stub(s.state));          // applies to the iframe too
    await p.setContent(canvas(`${BASE}/${s.page}`, s.caption, s.frameH, s.scale));
    const frame = p.frameLocator("iframe");
    await frame.locator("#main, #app").first().waitFor({ timeout: 15000 });
    if (s.view) await frame.locator(`[data-view="${s.view}"]`).first().click();
    // Some screens only show what matters after an action — the invoice, for one.
    if (s.click) { await frame.locator(s.click).click(); await p.waitForTimeout(250); }
    await p.waitForTimeout(600);
    await p.screenshot({ path: `${OUT}/${s.name}.png` });
    console.log(`  ${s.name}.png`);
    await ctx.close();
}
await b.close();
console.log(`\n${SHOTS.length} shots, 1280x800, in ${OUT}/`);
