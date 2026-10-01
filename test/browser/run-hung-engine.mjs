// Scratch (not for commit): the wedged-engine case. The stub answers everything except
// `status`, which never settles — the condition behind "wallet opens as a black window".
// The popup must still paint the locked screen and offer the restart button.
let chromium;
try { ({ chromium } = await import(process.env.PLAYWRIGHT || "playwright")); }
catch { console.error("playwright not found"); process.exit(2); }

const stub = `(() => {
  const ok = (data) => ({ ok: true, data });
  const REPLY = {
    hasVault: () => ok({ hasVault: true }),
    isUnlocked: () => ok({ unlocked: true }),
    status: () => new Promise(() => {}),          // received, never answered
    settings: () => ok({ network: "Mainnet", lang: "en", registryUrl: "", byNetwork: {}, netDefaults: {} }),
    lock: () => ok({ locked: true }),
  };
  window.chrome = {
    runtime: { sendMessage: async (m) => (REPLY[m.cmd] ? REPLY[m.cmd]() : ok({})),
               onMessage: { addListener: () => {} }, getURL: (p) => p },
    storage: { local: { get: async () => ({}), set: async () => {} },
               session: { get: async () => ({}), set: async () => {}, remove: async () => {} } },
    tabs: { query: async () => [], create: async () => {} },
    windows: { create: async () => {} },
  };
})()`;

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 380, height: 520 } });
const p = await ctx.newPage();
p.on("pageerror", (e) => console.log("[pageerror]", String(e).slice(0, 300)));
await p.addInitScript(stub);
await p.goto("http://127.0.0.1:8777/popup.html");

// Before the fix this never appears: the popup sits on its bare background forever.
await p.waitForSelector("#locked:not([hidden])", { timeout: 16000 });
const s1 = await p.evaluate(() => ({
    locked: !document.getElementById("locked").hidden,
    restart: !document.getElementById("doRestart").hidden,
    err: document.getElementById("lockErr").textContent,
}));
console.log("after timeout:", JSON.stringify(s1));
const ok1 = s1.locked && s1.restart && /not responding/i.test(s1.err);

await p.click("#doRestart");
await p.waitForTimeout(500);
const s2 = await p.evaluate(() => ({
    restartGone: document.getElementById("doRestart").hidden,
    errGone: document.getElementById("lockErr").hidden,
    pwVisible: !document.getElementById("pwUnlock").closest("section").hidden,
}));
console.log("after restart:", JSON.stringify(s2));
const ok2 = s2.restartGone && s2.errGone;

await b.close();
const ok = ok1 && ok2;
console.log(ok ? "PASS  a wedged engine reaches the locked screen and the restart" : "FAIL");
process.exit(ok ? 0 : 1);
