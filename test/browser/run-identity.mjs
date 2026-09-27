// Reinstalling the extension and restoring the same recovery phrase must yield the same
// identity address.
//     python3 test/browser/serve.py &
//     node test/browser/run-identity.mjs
// playwright is not a dependency of this project. Install one (npm i playwright), or point
// PLAYWRIGHT at an existing copy. NOTE: NODE_PATH has no effect on an ESM import(), so it has
// to be a path.
//     PLAYWRIGHT=~/.npm/_npx/<hash>/node_modules/playwright/index.mjs node test/browser/run-identity.mjs
let chromium;
try { ({ chromium } = await import(process.env.PLAYWRIGHT || "playwright")); }
catch (e) { console.error("playwright not found: npm i playwright, or set PLAYWRIGHT=<path to index.mjs>"); process.exit(2); }
const b = await chromium.launch();
const run = async (label, mnemonic) => {
  const ctx = await b.newContext();          // empty storage: a freshly installed browser
  const p = await ctx.newPage();
  p.on("pageerror", e => console.log("[pageerror]", String(e).slice(0,300)));
  const q = mnemonic ? "?m=" + encodeURIComponent(mnemonic) : "";
  await p.goto("http://127.0.0.1:8777/test/browser/identity-probe.html" + q);
  await p.waitForFunction(() => document.title === "done", null, { timeout: 180000 });
  const r = JSON.parse(await p.textContent("#out"));
  await ctx.close();
  if (r.error) { console.log(label, "ERROR", r.error); process.exit(1); }
  console.log(`${label.padEnd(22)} ${r.address}`);
  return r;
};
const first = await run("first install", null);
const r2 = await run("reinstall and restore the phrase", first.mnemonic);
const r3 = await run("reinstall once more", first.mnemonic);
const same = new Set([first.address, first.again, r2.address, r3.address]).size === 1;
console.log("\n" + (same ? "PASS  three installs plus a same-instance recheck, address identical" : "FAIL  the address changed"));
await b.close();
process.exit(same ? 0 : 1);
