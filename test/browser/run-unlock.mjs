// The 0.17.3 lockout: the vendored wallet module referenced the global `Buffer`, which a
// browser does not have, so bip39's seed-phrase check threw inside its own try/catch and a
// correct password came back as "Invalid seed phrase.". Node has a global Buffer, so the
// unit tests could not see it — this probe runs the unlock path in a real browser:
// seal a phrase, unseal it, canonicalize, construct the module, exactly as offscreen.js.
//     python3 test/browser/serve.py &
//     PLAYWRIGHT=<path to index.mjs> node test/browser/run-unlock.mjs
let chromium;
try { ({ chromium } = await import(process.env.PLAYWRIGHT || "playwright")); }
catch (e) { console.error("playwright not found: npm i playwright, or set PLAYWRIGHT=<path to index.mjs>"); process.exit(2); }
const b = await chromium.launch();
const p = await (await b.newContext()).newPage();
p.on("pageerror", e => console.log("[pageerror]", String(e).slice(0, 300)));
await p.goto("http://127.0.0.1:8777/test/browser/unlock-probe.html");
await p.waitForFunction(() => document.title === "done", null, { timeout: 60000 });
const r = JSON.parse(await p.textContent("#out"));
await b.close();
if (r.error) { console.log("ERROR", r.error); process.exit(1); }
const ok = r.ok === true && r.seedBytes === 64;
console.log(ok ? "PASS  the vendored module boots a phrase in a browser" : "FAIL  " + JSON.stringify(r));
process.exit(ok ? 0 : 1);
