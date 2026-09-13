// Regtest chain reset against the real engine and a real IndexedDB: only the Regtest
// snapshot is dropped, Signet is untouched, and rgb-lib still opens the database after.
//     python3 test/browser/serve.py &
//     PLAYWRIGHT=~/.npm/_npx/<hash>/node_modules/playwright/index.mjs node test/browser/run-chain-reset.mjs
let chromium;
try { ({ chromium } = await import(process.env.PLAYWRIGHT || "playwright")); }
catch { console.error("playwright not found: npm i playwright, or set PLAYWRIGHT=<path to index.mjs>"); process.exit(2); }

const b = await chromium.launch();
const ctx = await b.newContext();              // empty storage, to cover the no-database path
const p = await ctx.newPage();
p.on("pageerror", (e) => console.log("[pageerror]", String(e).slice(0, 300)));
await p.goto("http://127.0.0.1:8777/test/browser/chain-reset-probe.html");
await p.waitForFunction(() => document.title === "done", null, { timeout: 180000 });
const r = JSON.parse(await p.textContent("#out"));
await b.close();

if (r.error) { console.log("ERROR", r.error); process.exit(1); }
console.log(JSON.stringify(r, null, 2));

const regtest = (keys) => keys.filter((k) => k.startsWith(":memory:/Regtest/"));
const signet = (keys) => keys.filter((k) => k.startsWith(":memory:/Signet/"));
const checks = [
    ["removes nothing when the database is absent", r.removedFromMissingDb === 0],
    ["one snapshot per network before the reset", regtest(r.keysBefore).length === 1 && signet(r.keysBefore).length === 1],
    ["removes exactly one", r.removed === 1],
    ["Regtest gone, Signet kept", regtest(r.keysAfter).length === 0 && signet(r.keysAfter).length === 1],
    ["both networks usable after reopening", regtest(r.keysReopened).length === 1 && signet(r.keysReopened).length === 1],
    ["the Signet identity address is unchanged", r.signetAddress === r.signetAddressAgain],
];
let fail = 0;
for (const [name, pass] of checks) { console.log(pass ? "✅" : "🚨", name); if (!pass) fail = 1; }
process.exit(fail);
