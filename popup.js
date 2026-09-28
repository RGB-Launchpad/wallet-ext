import { call } from "./lib/msg.js";
import { amountOf, ago, sats, toRaw } from "./lib/fmt.js";
import { NETWORKS } from "./config.js";
import { isChainMismatch, RESETTABLE } from "./lib/chain.js";
import * as motion from "./lib/motion.js";
import { assetList, describe } from "./lib/registry.js";
import { renderQr } from "./lib/qr.js";
import { enhanceAll } from "./lib/picker.js";

const $ = (id) => document.getElementById(id);
// Ticker / name / assetId come from contract metadata and are issuer-controlled.
// NOTE: escape them before innerHTML; the CSP blocks script execution, not fake content.
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const show = (id, on = true) => { $(id).hidden = !on; };
const setErr = (id, e) => { const n = $(id); if (!e) { n.hidden = true; return; } n.textContent = e; n.hidden = false; };
/** Head and tail of a long identifier; the full value stays one copy away. */
const short = (s, head = 8, tail = 6) => { s = String(s || ""); return s.length > head + tail + 1 ? `${s.slice(0, head)}…${s.slice(-tail)}` : s; };

const ICON = {
    in: '<svg viewBox="0 0 24 24"><path d="M12 4v14M6 12l6 6 6-6M5 21h14"/></svg>',
    out: '<svg viewBox="0 0 24 24"><path d="M12 20V6M6 12l6-6 6 6M5 3h14"/></svg>',
    issue: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    copy: '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>',
    warn: '<svg viewBox="0 0 24 24"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/></svg>',
};

// Avatar colour, fixed per contract ID so an asset keeps its colour across screens.
const AVATAR = ["#B79CFF", "#F2B33D", "#4FD1C5", "#4CD28F", "#7FA3FF", "#38D6FF", "#FF6B5E"];
function avatar(a, cls = "") {
    let h = 0;
    for (const c of String(a?.assetId || "")) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const letter = String(a?.ticker || "?").trim().charAt(0).toUpperCase() || "?";
    return `<span class="av ${cls}" style="background:${AVATAR[h % AVATAR.length]}">${esc(letter)}</span>`;
}

function setNet(el, network) {
    const label = NETWORKS[network]?.label || network || "";
    el.hidden = !label;
    el.querySelector("span").textContent = label;
    el.classList.toggle("main", network === "Mainnet");
}

/** Copies and confirms on the button itself. */
async function copy(text, btn) {
    await navigator.clipboard.writeText(text);
    const label = btn.querySelector("span");
    if (label) {
        label.dataset.text ??= label.textContent;
        label.textContent = "Copied";
    }
    btn.classList.add("done");
    motion.bump(btn);
    clearTimeout(btn._t);
    btn._t = setTimeout(() => {
        btn.classList.remove("done");
        if (label) label.textContent = label.dataset.text;
    }, 1200);
}

let mode = "new";
let assetsCache = [];

async function route() {
    const has = await call("hasVault");
    if (!has.ok) { showOnly("setup"); setErr("setupErr", has.err); return; }
    if (!has.data.hasVault) { showOnly("welcome"); return; }

    const st = await call("isUnlocked");
    if (st.ok && st.data.unlocked) {
        const s = await call("status");
        if (s.ok && s.data.unlocked) { await enterMain(s.data); return; }
    }
    await showLocked();
}

// ---------- screens and header ----------
const SCREENS = ["welcome", "setup", "seed", "locked", "main", "settings-view"];
let lastScreen = "welcome";
let current = null;
let backAction = null;

/** `none` on the illustrated screens, `main` on the wallet home, `sub` with a back arrow elsewhere. */
function header(kind, title = "", back = null) {
    show("hdr", kind !== "none");
    show("hMain", kind === "main");
    show("hSub", kind === "sub");
    $("hTitle").textContent = title;
    backAction = back;
    show("hBack", !!back);
}
$("hBack").onclick = () => backAction?.();

function showOnly(which) {
    if (which !== "settings-view") lastScreen = which;
    for (const s of SCREENS) show(s, s === which);
    show("lock", which === "main");
    if (which === "welcome" || which === "locked") header("none");
    else if (which === "main") viewHeader();
    else if (which === "settings-view") header("sub", "Settings", leaveSettings);
    else if (which === "setup") header("sub", mode === "import" ? "Import wallet" : "Create wallet", () => showOnly("welcome"));
    else if (which === "seed") header("sub", "Recovery phrase");   // no way back: the phrase is shown once
    if (which !== current) {
        current = which;
        motion.enter($(which));
        motion.rise($(which).querySelectorAll("[data-rise]"), { delay: 60 });
    }
}

async function showLocked() {
    showOnly("locked");
    const s = await call("settings");         // readable while locked; `status` is not
    if (s.ok) setNet($("netLocked"), s.data.network);
}

/**
 * Full-tab mode: the same page opened in a tab, which survives focus changes that dismiss
 * the action popup. The tab carries `?tab=1`; nothing else differs, and both views talk to
 * the same wallet in the offscreen document.
 */
const TAB_URL = chrome.runtime.getURL("popup.html?tab=1");
// tabs.query takes a match pattern, which does not reliably include a query string:
// match the path with a trailing wildcard.
const TAB_MATCH = chrome.runtime.getURL("popup.html") + "*";
const inTab = new URLSearchParams(location.search).get("tab") === "1";

if (inTab) {
    document.body.classList.add("tab");
    show("expand", false);           // already there
} else {
    $("expand").onclick = async () => {
        // Reuse an open tab rather than adding duplicates.
        const open = await chrome.tabs.query({ url: TAB_MATCH });
        if (open.length) {
            await chrome.tabs.update(open[0].id, { active: true });
            await chrome.windows.update(open[0].windowId, { focused: true });
        } else {
            await chrome.tabs.create({ url: TAB_URL });
        }
        window.close();              // the popup has served its purpose
    };
}

// Settings are reachable while locked, so a bad endpoint can always be corrected.
$("gear").onclick = openSettings;
for (const b of document.querySelectorAll("[data-gear]")) b.onclick = openSettings;

/**
 * What stops the wallet from working, as rows on the home screen: no indexer, no proxy.
 *
 * NOTE: whether the wallet is backed up is the owner's business and is not nagged about here.
 * Backup stays one tap away on the home screen and carries its state in settings.
 */
async function banner(st) {
    const items = [];

    if (st.onlineErr) {
        items.push({ text: `Indexer unreachable: ${st.onlineErr}`, action: null });
    }
    if (st.proxyMissing) {
        items.push({
            text: "No RGB proxy configured. Sending and receiving need one.",
            action: { id: "bnSettings", label: "Settings" },
        });
    }

    const n = $("banner");
    const was = !n.hidden && n.childElementCount;
    n.innerHTML = items.map((i) => `<div class="note red">${ICON.warn}
        <span class="grow">${esc(i.text)}</span>
        ${i.action ? `<button id="${i.action.id}" class="act">${esc(i.action.label)}</button>` : ""}
    </div>`).join("");
    n.hidden = items.length === 0;
    if (!was && items.length) motion.rise(n.children);

    if ($("bnSettings")) $("bnSettings").onclick = openSettings;
}

/** Re-reads status and repaints the notices. */
async function refreshBanner() {
    const st = await call("status");
    if (st.ok) await banner(st.data);
}

async function enterMain(st) {
    view = "home";
    for (const v of VIEWS) show("v-" + v, v === "home");
    showOnly("main");
    setNet($("net"), st.network);
    try { lastSyncAt = (await chrome.storage.session.get("lastSyncAt")).lastSyncAt ?? null; } catch { /* no session storage */ }
    syncLabel();
    await banner(st);
    await loadHome({ rise: true });
}

// ---------- create / import ----------
for (const b of document.querySelectorAll("[data-start]")) {
    b.onclick = () => { mode = b.dataset.start; syncSetupMode(); showOnly("setup"); };
}

function syncSetupMode() {
    const imp = mode === "import";
    show("mnemonicBox", imp);
    show("setupSteps", !imp);
    $("setupLead").textContent = imp
        ? "Enter your recovery phrase, then set a password for this device."
        : "Step 1 of 2 · Set a password for this device.";
    $("doCreate").textContent = imp ? "Import wallet" : "Create wallet";
    setErr("setupErr", null);
}

$("doCreate").onclick = async () => {
    setErr("setupErr", null);
    const [p1, p2] = [$("pw1").value, $("pw2").value];
    const refuse = (msg) => { setErr("setupErr", msg); motion.shake($("doCreate")); };
    if (p1 !== p2) return refuse("Passwords do not match");
    if (p1.length < 8) return refuse("Password must be at least 8 characters");
    $("doCreate").disabled = true;
    $("doCreate").textContent = "Working…";
    const r = await call("create", { password: p1, mnemonic: mode === "import" ? $("mnemonicIn").value : "" });
    $("doCreate").disabled = false;
    syncSetupMode();
    if (!r.ok) return refuse(r.err);
    $("pw1").value = $("pw2").value = $("mnemonicIn").value = "";
    if (r.data.mnemonic) {
        const words = r.data.mnemonic.trim().split(/\s+/);
        $("seedWords").innerHTML = words.map((w, i) => `<span><b>${i + 1}</b>${esc(w)}</span>`).join("");
        showOnly("seed");
        motion.pop($("seedWords").children);
        // The phrase is dropped here; only the status goes into the dataset.
        const { mnemonic, ...rest } = r.data;
        $("seedDone").dataset.st = JSON.stringify(rest);
    } else {
        await enterMain(r.data);
    }
};

$("seedOk").onchange = () => { $("seedDone").disabled = !$("seedOk").checked; };
$("seedDone").onclick = async () => {
    $("seedWords").innerHTML = "";              // remove the phrase from the DOM
    await enterMain(JSON.parse($("seedDone").dataset.st || "{}"));
};

// ---------- unlock / lock ----------
$("doUnlock").onclick = async () => {
    setErr("lockErr", null);
    $("doUnlock").disabled = true; $("doUnlock").textContent = "Unlocking…";
    const r = await call("unlock", { password: $("pwUnlock").value });
    $("doUnlock").disabled = false; $("doUnlock").textContent = "Unlock";
    if (!r.ok) { setErr("lockErr", r.err); motion.shake($("pwUnlock")); return; }
    $("pwUnlock").value = "";
    show("lockMsg", false);
    await enterMain(r.data);
};
$("pwUnlock").onkeydown = (e) => { if (e.key === "Enter") $("doUnlock").click(); };
$("lock").onclick = async () => { await call("lock"); await showLocked(); };

// The engine can close while a tab is on screen; the view follows it back to the locked
// screen instead of showing a stale unlocked one.
chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.to !== "views" || msg.ev !== "locked") return;
    // A wipe closes the engine too, so the surviving vault decides which screen to show.
    call("hasVault").then((r) => (r.ok && r.data.hasVault ? showLocked() : showOnly("welcome")));
});

// ---------- navigation ----------
// Home, plus panels reached from it that return with Back.
const VIEWS = ["home", "recv", "send", "hist", "backup"];
const TITLES = { recv: "Receive", send: "Send", hist: "Activity", backup: "Backup" };
let view = "home";

function viewHeader() {
    if (view === "home") header("main");
    else header("sub", TITLES[view], () => goto("home"));
}

async function goto(v, { tab } = {}) {
    view = v;
    for (const x of VIEWS) show("v-" + x, x === v);
    viewHeader();
    motion.enter($("v-" + v));
    if (v === "home") await loadHome({ rise: true });
    if (v === "recv") { setRecvTab(tab || "rgb"); await (recvTab === "btc" ? loadBtc() : loadSlots()); }
    if (v === "send") { if (btcSpendable === null) await loadBtc(); await loadSendForm(); }
    if (v === "hist") await loadHistory();
}

for (const b of document.querySelectorAll("[data-view]")) {
    b.onclick = () => goto(b.dataset.view);
}

// ---------- home ----------
let btcAddress = null;
let shownSats = null;       // the figure on the balance card, so a change counts from it

$("btcCard").onclick = (e) => { if (!e.target.closest("button")) goto("recv", { tab: "btc" }); };
$("btcCard").onkeydown = (e) => { if (e.key === "Enter" && e.target === $("btcCard")) goto("recv", { tab: "btc" }); };
$("idAddr").onclick = (e) => { e.stopPropagation(); if (btcAddress) copy(btcAddress, $("idAddr")); };

/**
 * Bitcoin on the card, then one row per RGB asset: the settled balance, with anything in
 * flight as a signed delta under it. The contract ID sits one tap away.
 */
async function loadHome({ rise = false } = {}) {
    setErr("homeErr", null);
    const box = $("homeList");

    const [oc, btc] = await Promise.all([call("assets"), call("btc")]);
    if (oc.ok) assetsCache = oc.data.assets || [];       // Send and Activity read this

    // Built before the error check so a failed asset read still shows the Bitcoin that pays fees.
    // The address is the one `btc` already returned: asking a second command for the identity
    // address would be the same string, and a failed second call would silently drop the row.
    if (btc.ok) {
        if (btc.data.address) {
            btcAddress = btc.data.address;
            $("idAddr").innerHTML = `<span>${esc(short(btcAddress))}</span>${ICON.copy}`;
            show("idAddr");
        }
        const s = String(btc.data.balance?.vanilla?.spendable ?? "0");
        motion.count($("btcBig"), shownSats === null ? 0 : Number(shownSats) / 1e8, Number(s) / 1e8, 8, sats.toBtc(s));
        shownSats = s;
    }

    if (!oc.ok) { box.innerHTML = `<div class="err fine pad">${esc(oc.err)}</div>`; return; }

    const list = oc.data.assets || [];
    $("assetCount").textContent = `Assets · ${list.length}`;

    // Asset identity, if an index is configured. It never blocks the list: a slow or missing
    // index leaves every asset exactly as the wallet already knows it.
    const st = await call("settings").catch(() => null);
    const s = st?.ok ? st.data : null;
    const known = await assetList(s?.registryUrl, s?.network || "").catch(() => null);

    box.innerHTML = list.map((a) => {
        const settled = amountOf(a.balance?.settled ?? "0", a.precision);
        const id = describe(known, a.assetId, a.ticker);
        return `<button class="asset" data-id="${esc(a.assetId)}">
            ${avatar(a)}
            <span class="nm"><span class="tk">${esc(a.ticker || "?")}</span><span class="sub">${esc(a.name || "")}</span></span>
            <span class="amt">${esc(settled.text)}${deltaOf(a.balance?.settled, a.balance?.future, a.precision)}
                ${settled.unknown ? `<small class="unk">base units</small>` : ""}</span>
        </button>
        <div class="more" hidden>
            <div class="copyline"><code>${esc(a.assetId)}</code>
                <button class="chip-btn" data-copy="${esc(a.assetId)}">${ICON.copy}<span>Copy</span></button></div>
            ${settled.unknown ? `<span class="fine">Precision unknown. The balance is the raw base-unit value.</span>` : ""}
            ${identityLines(id)}
        </div>`;
    }).join("") || `<p class="fine pad">No assets yet. Use Receive to get some.</p>`;

    for (const row of box.querySelectorAll(".asset")) {
        row.onclick = () => {
            const open = !row.classList.contains("open");
            row.classList.toggle("open", open);
            motion.reveal(row.nextElementSibling, open);
        };
    }
    for (const b of box.querySelectorAll("[data-copy]")) b.onclick = () => copy(b.dataset.copy, b);
    if (rise) motion.rise(box.querySelectorAll(".asset"), { delay: 120 });
}

/**
 * What an index says about an asset, one line per fact.
 *
 * 🚨 Never a single verdict. "Signed" means a key claimed the asset; "verified" means that key
 * was tied to a domain or account; "reviewed" means the index operator looked at an issuer's
 * papers. None of them says an asset is safe, and an asset nobody registered is not thereby
 * suspicious.
 */
function identityLines(id) {
    if (!id) return "";
    const lines = [];

    if (id.sameTicker.length) {
        lines.push(`<span class="warn fine">${id.sameTicker.length} other contract${id.sameTicker.length > 1 ? "s use" : " uses"}
            the ticker ${esc(id.ticker || "")}. A ticker is not an identity: check the contract id.</span>`);
    }
    if (id.disputed) lines.push(`<span class="warn fine">A complaint about this asset was accepted and is unresolved.</span>`);

    if (!id.registered) {
        lines.push(`<span class="fine">Not registered with the configured index. That is not a verdict: the asset
            is identified by its contract id above.</span>`);
        return lines.join("");
    }

    const issuer = id.issuerIdentified ? "reviewed by the index operator"
        : id.issuerVerified ? "verified against a domain or account"
        : id.issuerSigned ? "signed by a key, with no identity proof"
        : "no issuer has claimed it";
    lines.push(`<span class="fine">Issuer: ${issuer}.${id.listed ? " Listed by a publisher's ledger." : ""}</span>`);
    return lines.join("");
}

/** Asset picker label: ticker, settled balance, and a marker when precision is unknown. */
function optionLabel(x) {
    const b = amountOf(x.balance?.settled ?? "0", x.precision);
    return `${x.ticker || "?"} · ${b.text}${b.unknown ? " (base units)" : ""}`;
}

/**
 * In-flight change as a signed delta. `future - settled`, which is negative when the
 * pending transfer is outgoing.
 */
function deltaOf(settled, future, precision) {
    if (settled == null || future == null) return "";
    const d = BigInt(future) - BigInt(settled);
    if (d === 0n) return "";
    const mag = amountOf((d < 0n ? -d : d).toString(), precision);
    return d < 0n
        ? `<small>−${esc(mag.text)} leaving</small>`
        : `<small class="in">+${esc(mag.text)} incoming</small>`;
}

// ---------- sync ----------
let lastSyncAt = null;

function syncLabel() {
    const a = lastSyncAt ? ago(Math.floor(lastSyncAt / 1000)) : "";
    $("refreshMs").textContent = a ? `Synced ${a} ago` : "Sync";
}
setInterval(() => { if (!$("doRefresh").disabled) syncLabel(); }, 10_000);

/**
 * Holds Sync unavailable for the rest of its cooldown, counting down on the button so the
 * wait is visible rather than the click just doing nothing.
 *
 * The service worker owns the limit; this only mirrors it. Closing the popup kills the timer,
 * but reopening and clicking hits the same gate and lands back here.
 */
function holdRefresh(ms) {
    const btn = $("doRefresh");
    let left = Math.ceil(ms / 1000);
    btn.disabled = true;
    const tick = () => {
        if (left <= 0) { btn.disabled = false; syncLabel(); return; }
        $("refreshMs").textContent = `Sync in ${left}s`;
        left -= 1;
        setTimeout(tick, 1000);
    };
    tick();
}

$("doRefresh").onclick = async (e) => {
    e.stopPropagation();
    const btn = $("doRefresh");
    btn.disabled = true;
    setErr("homeErr", null);
    $("refreshMs").textContent = "Verifying…";        // client-side validation grows with history
    const stop = motion.spin(btn.querySelector("svg"));
    const r = await call("refresh");
    stop();

    // Asked again too soon: nothing ran, so say how long is left and leave the screen alone.
    if (r.ok && r.data.cooledDown) { holdRefresh(r.data.waitMs); return; }
    if (!r.ok) {
        btn.disabled = false; syncLabel();
        setErr("homeErr", r.err);
        await offerChainReset(r.err);
        return;
    }
    show("chainReset", false);
    btn.title = `Last sync took ${r.data.ms} ms`;
    lastSyncAt = Date.now();
    try { await chrome.storage.session.set({ lastSyncAt }); } catch { /* shown for this popup only */ }
    await loadHome();
    holdRefresh(r.data.cooldownMs ?? 0);
};

/** Offers the reset when the indexer's chain no longer holds the blocks this wallet remembers. */
async function offerChainReset(e) {
    if (!isChainMismatch(e)) { show("chainReset", false); return; }
    const st = await call("status");
    show("chainReset", st.ok && RESETTABLE.has(st.data.network));
}

$("doChainReset").onclick = async () => {
    const b = $("doChainReset"); b.disabled = true;
    const r = await call("resetChain");
    b.disabled = false;
    if (!r.ok) { setErr("homeErr", r.err); return; }
    show("chainReset", false);
    setErr("homeErr", null);
    // The engine closed; unlocking boots it on an empty Regtest snapshot.
    await showLocked();
    $("lockMsg").textContent = "Regtest data cleared. Unlock to sync with the current chain.";
    show("lockMsg");
};

// ---------- receive ----------
let recvTab = "rgb";

function setRecvTab(t) {
    recvTab = t;
    for (const x of document.querySelectorAll("[data-recv]")) x.classList.toggle("on", x.dataset.recv === t);
    show("recv-rgb", t === "rgb");
    show("recv-btc", t === "btc");
    show("recvFoot", t === "rgb");
}
for (const b of document.querySelectorAll("[data-recv]")) {
    b.onclick = async () => {
        if (b.dataset.recv === recvTab) return;
        setRecvTab(b.dataset.recv);
        motion.enter($("recv-" + recvTab));
        await (recvTab === "btc" ? loadBtc() : loadSlots());
    };
}

async function loadSlots() {
    const r = await call("btc");
    const n = r.ok ? Number(r.data.slots) : null;
    // A slot holds an allocation only once its transaction is in a block, and the count
    // cannot see that: an unconfirmed UTXO looks like any other. Colored sats that are not
    // settled are what gives it away, and saying "ready" without checking is a lie the
    // reader finds out from rgb-lib.
    const colored = r.ok ? r.data.balance?.colored : null;
    const settled = colored ? BigInt(colored.settled) : 0n;
    const usable = n > 0 && settled > 0n;

    // "0 waiting" reads as though something were on its way; nothing is.
    $("slots").textContent = n === null ? "?" : (n === 0 ? "0" : (usable ? `${n} ready` : `${n} waiting`));
    $("slots").style.color = usable ? "var(--color-up)" : "var(--color-gold)";

    // The button is never blocked on this: with no slot ready the invoice falls back to one
    // the sender pays for, and says so.
    $("doInvoice").title = usable ? "" : "No slot ready — the invoice will use the sender's output instead.";
}

$("doPrepare").onclick = async () => {
    setErr("recvErr", null); show("recvMsg", false);
    const b = $("doPrepare"); b.disabled = true; b.textContent = "Adding…";
    const r = await call("prepare");
    b.disabled = false; b.textContent = "Add slots";
    if (!r.ok) return setErr("recvErr", r.err);
    await loadSlots();
    motion.bump($("slots"));
    if (r.data.created) {
        $("recvMsg").textContent = `Created ${r.data.created} slots. Usable after 1 confirmation.`;
        show("recvMsg");
    }
    await refreshBanner();
};

// The first invoice is gated on having exported a backup.
async function backupEverDone() {
    return !!(await chrome.storage.local.get("backupDoneAt")).backupDoneAt;
}
$("goBackup").onclick = () => goto("backup");
$("anyway").onclick = async () => { motion.reveal($("noBackupWarn"), false); await makeInvoice(); };

$("doInvoice").onclick = async () => {
    if (!(await backupEverDone())) { motion.reveal($("noBackupWarn"), true); return; }
    await makeInvoice();
};

/** Whether an invoice failed only because no slot of this wallet's was usable. */
const noSlotToUse = (err) => /slot/i.test(String(err || ""));

/**
 * One button, two kinds of invoice.
 *
 * A blinded one is better for the recipient — the sender learns an identifier and nothing
 * else — but it needs a confirmed slot. Without one the asset can still be received, on an
 * output of the sender's own transaction, which they pay for and can therefore see.
 *
 * Which of the two is possible is not something to make the reader work out, and the state
 * that decides it can be a block old. So this asks for the better one and falls back, and
 * the invoice says which it got.
 */
async function makeInvoice() {
    setErr("recvErr", null);
    const b = $("doInvoice"); b.disabled = true;

    let r = await call("receive", {});
    let witness = false;

    if (!r.ok && noSlotToUse(r.err)) { r = await call("receiveWitness", {}); witness = true; }

    b.disabled = false;
    if (!r.ok) return setErr("recvErr", r.err);
    $("invoice").textContent = r.data.invoice;
    renderQr($("invoiceQr"), r.data.invoice);
    const exp = r.data.expirationTimestamp;
    // Which kind this is. The two look alike, and only the recipient id says so: `utxob` is
    // a blinded UTXO of this wallet, `wvout` an output of the sender's transaction.
    const kind = witness
        ? "No slot used · the sender creates the output and can see which one it is. Invoices stay this kind until this one is used or expires."
        : "Uses one slot · the sender sees nothing but a blinded identifier";
    $("invoiceExp").textContent = exp
        ? `${kind} · expires ${new Date(Number(exp) * 1000).toLocaleString(undefined,
            { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`
        : kind;
    show("invoiceEmpty", false);
    show("invoiceBox");
    motion.enter($("invoiceBox"));
    await loadSlots();
    await refreshBanner();          // a blind invoice consumes a slot: wallet state changed
}

$("copyInvoice").onclick = () => copy($("invoice").textContent, $("copyInvoice"));
$("copyAddr").onclick = () => copy($("btcAddr").textContent, $("copyAddr"));

// ---------- bitcoin ----------
// Only the vanilla path is spendable as plain BTC; colored UTXOs are never touched.
let btcSpendable = null;

async function loadBtc() {
    const r = await call("btc");
    if (!r.ok) { $("btcBal").innerHTML = `<div class="err">${esc(r.err)}</div>`; return; }
    $("btcAddr").textContent = r.data.address;
    renderQr($("btcQr"), r.data.address);
    const { vanilla, colored } = r.data.balance;
    btcSpendable = String(vanilla.spendable);
    // `spendable` is confirmed plus unconfirmed, not a subset of `settled` — the two are
    // shown as its parts so the labels cannot be read the other way round.
    const pending = BigInt(vanilla.spendable) - BigInt(vanilla.settled);
    // `future` for the colored side: it is a total, not something to spend, so pending
    // slots belong in it. Without this row, creating slots looks like losing Bitcoin.
    $("btcBal").innerHTML = `<div class="r"><span>Available</span><b class="num">${sats.toBtc(vanilla.spendable)} BTC</b></div>
        <div class="r sub"><span>Confirmed</span><span class="num">${sats.toBtc(vanilla.settled)} BTC</span></div>
        ${pending > 0n ? `<div class="r sub"><span>Waiting to confirm</span>
            <span class="num">${esc(sats.toBtc(pending.toString()))} BTC</span></div>` : ""}
        <div class="r"><span>In RGB UTXOs</span><span class="num">${sats.toBtc(colored.future)} BTC</span></div>
        <p class="fine">RGB UTXOs carry the assets. Their Bitcoin is not spendable as plain BTC.
        ${pending > 0n ? "Creating slots waits for every input to confirm." : ""}</p>`;
}

// ---------- send ----------
let sendTab = "rgb";
for (const b of document.querySelectorAll("[data-send]")) {
    b.onclick = () => {
        if (b.dataset.send === sendTab) return;
        sendTab = b.dataset.send;
        for (const x of document.querySelectorAll("[data-send]")) x.classList.toggle("on", x === b);
        show("send-rgb", sendTab === "rgb");
        show("send-btc", sendTab === "btc");
        show("doSendRgb", sendTab === "rgb");
        show("doSendBtc", sendTab === "btc");
        motion.enter($("send-" + sendTab));
    };
}

async function loadSendForm() {
    const a = await call("assets");
    assetsCache = a.ok ? a.data.assets : [];
    $("sAsset").innerHTML = assetsCache.map((x) =>
        `<option value="${esc(x.assetId)}">${esc(optionLabel(x))}</option>`).join("")
        || `<option value="">No assets</option>`;
    syncUnit();
    syncBtcUnit();
    const f = await call("feeSuggestion");
    // Says the number is deliberately high, so it does not read as a bad estimate.
    const hint = f.ok
        ? `${f.data.feeRate} sat/vB, set above what the network is clearing. Adjust if you want.`
        : "Could not reach the network for an estimate — enter a rate manually.";
    $("sFeeHint").textContent = hint;
    $("bFeeHint").textContent = hint;
    if (f.ok) { $("sFee").value = f.data.feeRate; $("bFee").value = f.data.feeRate; }
}

function currentAsset() { return assetsCache.find((x) => x.assetId === $("sAsset").value); }

/**
 * The most a send can move right now, in base units.
 *
 * NOTE: `settled` also counts assets on UTXOs held by an open invoice or a pending transfer.
 * rgb-lib will not spend those, so checking a send against `settled` lets it through only for
 * rgb-lib to fail with "Insufficient total assignments".
 */
function sendableRaw(a) {
    return BigInt(a?.balance?.spendable ?? a?.balance?.settled ?? "0");
}

/** The button names what it will send, once there is something to name. */
function rgbSendLabel() {
    const a = currentAsset();
    const v = $("sAmount").value.trim();
    $("doSendRgb").textContent = a && /^\d*\.?\d+$/.test(v) && Number(v) > 0
        ? `Send ${v} ${a.ticker || ""}`.trim() : "Send";
}

function btcSendLabel() {
    const v = $("bAmount").value.trim();
    $("doSendBtc").textContent = /^\d*\.?\d+$/.test(v) && Number(v) > 0
        ? `Send ${v} ${btcUnit === "btc" ? "BTC" : "sats"}` : "Send";
}

function syncUnit() {
    const a = currentAsset();
    // Without precision the amount has to be entered in base units.
    $("sUnit").textContent = a
        ? (a.precision === null || a.precision === undefined
            ? "precision unknown, enter base units"
            : `up to ${a.precision} decimals`)
        : "";
    const max = $("sMax");
    max.hidden = !a;
    if (a) max.textContent = `Max ${amountOf(sendableRaw(a).toString(), a.precision).text}`;
    rgbSendLabel();
}

$("sMax").onclick = () => {
    const a = currentAsset();
    if (a) $("sAmount").value = amountOf(sendableRaw(a).toString(), a.precision).text;
    rgbSendLabel();
};
$("sAsset").onchange = syncUnit;
$("sAmount").oninput = rgbSendLabel;

// ---------- Bitcoin amount unit ----------
// Balances are displayed in BTC, so BTC is the input default. sats stays available for
// fee-level amounts.
let btcUnit = "btc";

function syncBtcUnit() {
    const isBtc = btcUnit === "btc";
    $("bUnitBtc").classList.toggle("on", isBtc);
    $("bUnitSat").classList.toggle("on", !isBtc);
    $("bAmount").placeholder = isBtc ? "0.001" : "100000";
    $("bAvail").textContent = btcSpendable === null
        ? ""
        : `Spendable ${isBtc ? `${sats.toBtc(btcSpendable)} BTC` : `${btcSpendable} sats`}`;
    syncBtcAmountHint();
}

/** Echoes the value in the other unit. */
function syncBtcAmountHint() {
    btcSendLabel();
    const raw = $("bAmount").value.trim();
    const node = $("bAmountHint");
    if (!raw) { node.textContent = ""; return; }
    try {
        node.textContent = btcUnit === "btc"
            ? `= ${btcAmountToSats(raw)} sats`
            : `= ${satsAmountToBtc(raw)} BTC`;
    } catch (e) {
        node.textContent = e.message || String(e);
    }
}

/**
 * BTC string to a whole number of sats, as a string. `sats.fromBtc` rejects more than
 * 8 decimals rather than truncating.
 */
function btcAmountToSats(v) {
    const out = sats.fromBtc(v);
    if (!/^\d+$/.test(out)) throw new Error("Amount must be positive");
    return out;
}

/**
 * Whole sats to a BTC string.
 * NOTE: `sats.toBtc` does not validate; it pads whatever it is given, so "1.5" returns
 * "0.000001.5". User input is checked before it reaches this.
 */
function satsAmountToBtc(v) {
    if (!/^\d+$/.test(v)) throw new Error("Enter a whole number of sats");
    return sats.toBtc(v);
}

function setBtcUnit(u) {
    if (btcUnit === u) return;
    const raw = $("bAmount").value.trim();
    // Carries the value across the unit switch instead of clearing the field.
    if (raw) {
        try {
            $("bAmount").value = u === "sats" ? btcAmountToSats(raw) : satsAmountToBtc(raw);
        } catch { /* leave the text alone; the hint will explain */ }
    }
    btcUnit = u;
    syncBtcUnit();
}

$("bUnitBtc").onclick = () => setBtcUnit("btc");
$("bUnitSat").onclick = () => setBtcUnit("sats");
$("bAmount").oninput = syncBtcAmountHint;

// A pasted invoice is read as soon as typing pauses.
let decodeTimer = null;
$("sInvoice").oninput = () => {
    clearTimeout(decodeTimer);
    decodeTimer = setTimeout(decodeInvoice, 350);
};

async function decodeInvoice() {
    const text = $("sInvoice").value.trim();
    setErr("sendErr", null);
    if (!text) { show("decoded", false); return; }
    const r = await call("decodeInvoice", { invoice: text });
    if (text !== $("sInvoice").value.trim()) return;          // edited while reading
    if (!r.ok) { show("decoded", false); return setErr("sendErr", r.err); }
    const d = r.data.data;
    // Preselect the asset the invoice names, before reading the requested amount:
    // the amount can only be shown in human units once the precision is known.
    if (d.assetId && assetsCache.some((x) => x.assetId === d.assetId)) { $("sAsset").value = d.assetId; syncUnit(); }
    const asset = d.assetId ? assetsCache.find((x) => x.assetId === d.assetId) : null;
    const want = requestedAmount(d.assignment, currentAsset()?.precision);
    if (want) {
        // Prefill so the sent amount matches what was asked for; still editable.
        $("sAmount").value = want.text;
        rgbSendLabel();
    }
    const head = want
        ? `${esc(want.text)}${want.unknown ? " (base units)" : ""} ${esc(asset?.ticker || "")}`
        : "Any amount";
    const rows = [
        ["Asset", d.assetId ? `<code title="${esc(d.assetId)}">${esc(short(d.assetId, 12, 6))}</code>` : "Any asset"],
        ["Network", esc(d.network || "?")],
    ];
    if (d.expirationTimestamp) rows.push(["Expires", esc(new Date(Number(d.expirationTimestamp) * 1000).toLocaleString())]);
    if (d.transportEndpoints?.length) rows.push(["Consignment to", `<code>${esc(d.transportEndpoints[0])}</code>`]);
    $("decoded").innerHTML = `<div class="row">${asset ? avatar(asset, "sm") : `<span class="av sm" style="background:var(--color-card-soft);color:var(--color-ink-2)">?</span>`}
            <span class="grow" style="font-weight:600;font-size:14px">${head}</span></div>`
        + rows.map(([k, v]) => `<div class="r"><span>${k}</span><span>${v}</span></div>`).join("")
        + r.data.warnings.map((w) => `<div class="err">${esc(w)}</div>`).join("");
    const was = !$("decoded").hidden;
    show("decoded");
    if (!was) motion.enter($("decoded"));
}

/**
 * The amount an invoice asks for, in human units. `assignment` arrives from the bindings as
 * `{ Fungible: n }`, `"Any"` or `"NonFungible"`; only the fungible form carries a number, in
 * base units. Anything unrecognised returns null rather than a guess.
 */
function requestedAmount(assignment, precision) {
    const n = assignment && typeof assignment === "object"
        ? (assignment.Fungible ?? assignment.fungible)
        : null;
    if (n === null || n === undefined) return null;
    let raw;
    try { raw = BigInt(String(n)).toString(); } catch { return null; }
    if (raw === "0") return null;
    return amountOf(raw, precision);
}

function sent(html) {
    $("sendOut").innerHTML = html;
    show("sendOut");
    motion.enter($("sendOut"));
}

$("doSendRgb").onclick = async () => {
    setErr("sendErr", null); show("sendOut", false);
    const a = currentAsset();
    if (!a) return setErr("sendErr", "Select an asset");
    let amountRaw;
    try {
        // Human units to base units via string padding.
        amountRaw = (a.precision === null || a.precision === undefined)
            ? BigInt($("sAmount").value.trim()).toString()
            : toRaw($("sAmount").value.trim(), a.precision);
    } catch (e) { return setErr("sendErr", `Invalid amount: ${e.message}`); }

    const have = sendableRaw(a);
    if (BigInt(amountRaw) > have) {
        return setErr("sendErr", `More than can be sent now. Max ${amountOf(have.toString(), a.precision).text}`);
    }

    const btn = $("doSendRgb"); btn.disabled = true; btn.textContent = "Sending…";
    const r = await call("sendRgb", {
        invoice: $("sInvoice").value, assetId: a.assetId, amountRaw,
        feeRate: Number($("sFee").value) || undefined,
    });
    btn.disabled = false; rgbSendLabel();
    if (!r.ok) return setErr("sendErr", r.err);
    // Not broadcast. RGB posts the consignment and waits: the recipient validates it and
    // acknowledges, and only then does this wallet put the transaction on chain.
    sent(`<span>Sent · <code>${esc(r.data.txid)}</code></span>
        <span class="fine">Nothing is on chain until the recipient accepts it. The wallet
        finishes that on its own — leave it unlocked until it does. Locking or closing the
        browser first means sending again; the asset stays here either way.</span>`);
    $("sAmount").value = ""; $("sInvoice").value = ""; show("decoded", false);
    rgbSendLabel();
    await loadHome();
    await refreshBanner();          // the wallet changed: the backup is now stale
};

$("doSendBtc").onclick = async () => {
    setErr("sendErr", null); show("sendOut", false);
    const raw = $("bAmount").value.trim();
    if (!raw) return setErr("sendErr", "Enter an amount");
    // Convert here, at the single boundary. What crosses to the engine is always sats.
    let amt;
    try {
        amt = btcUnit === "btc" ? btcAmountToSats(raw) : raw;
        if (!/^\d+$/.test(amt)) throw new Error("Amount must be a whole number of sats");
        if (amt === "0") throw new Error("Amount must be greater than zero");
        // The fee comes out of the same balance; the engine decides whether amount plus fee fits.
        if (btcSpendable !== null && BigInt(amt) > BigInt(btcSpendable)) {
            throw new Error(`Insufficient balance — spendable is ${sats.toBtc(btcSpendable)} BTC`);  // engine value, already an integer
        }
    } catch (e) { return setErr("sendErr", e.message || String(e)); }
    const btn = $("doSendBtc"); btn.disabled = true; btn.textContent = "Sending…";
    const r = await call("sendBtc", {
        address: $("bAddr").value, amountSat: amt, feeRate: Number($("bFee").value) || undefined,
    });
    btn.disabled = false; btcSendLabel();
    if (!r.ok) return setErr("sendErr", r.err);
    sent(`<span>Broadcast <code>${esc(r.data.txid)}</code></span>`);
    $("bAmount").value = ""; syncBtcAmountHint();
    await loadBtc();
    await refreshBanner();
};

// ---------- activity ----------
const STATUS_TEXT = {
    // For a send this is the step before anything is broadcast, not after.
    WaitingCounterparty: "Waiting for the other side",
    WaitingConfirmations: "Confirming",
    Settled: "Settled",
    Failed: "Failed",
};
const STATUS_CLASS = { WaitingCounterparty: "wait", WaitingConfirmations: "conf", Settled: "ok", Failed: "fail" };
const finished = (t) => t.status === "Settled" || t.status === "Failed";

/**
 * How far along a pending transfer is. `null` means the indexer could not be asked, which
 * is different from zero and so says nothing rather than "no confirmations".
 */
function progressText(t, target) {
    if (t.confirmations == null) return "";
    if (t.confirmations === 0) return "in the mempool";
    if (t.confirmations < target) return `${t.confirmations} of ${target}`;
    return `${t.confirmations} confirmations`;
}

let hist = { list: [], target: 1, err: null };
let histFilter = "all";

for (const b of document.querySelectorAll("[data-hf]")) {
    b.onclick = () => {
        histFilter = b.dataset.hf;
        for (const x of document.querySelectorAll("[data-hf]")) x.classList.toggle("on", x === b);
        renderHistory();
    };
}

async function loadHistory() {
    const r = await call("transfers");
    hist = r.ok
        ? { list: r.data.transfers, target: r.data.target ?? 1, err: null }
        : { list: [], target: 1, err: r.err };
    renderHistory();
}

function renderHistory() {
    const box = $("histList");
    if (hist.err) { box.innerHTML = `<div class="empty-line err">${esc(hist.err)}</div>`; return; }
    const list = hist.list.filter((t) => histFilter === "all" || (histFilter === "done") === finished(t));
    if (!list.length) {
        box.innerHTML = `<div class="empty-line">${hist.list.length ? "Nothing here." : "Nothing yet."}</div>`;
        return;
    }
    box.innerHTML = list.map((t) => {
        const asset = assetsCache.find((x) => x.assetId === t.assetId);
        // An asset no longer held is not in the cache, so precision is unknown more often
        // here. Unknown precision is marked, as on the balance rows.
        const a = t.amount != null ? amountOf(t.amount, asset?.precision) : null;
        const recv = String(t.kind || "").startsWith("Receive");
        const issued = t.kind === "Issuance";
        const verb = issued ? "Issued" : recv ? "Received" : "Sent";
        const amt = a ? `${recv || issued ? "+" : "−"}${a.text}${a.unknown ? " (base units)" : ""}` : "";
        const p = finished(t) ? "" : progressText(t, hist.target);
        const age = ago(t.updated_at ?? t.created_at);
        const stuck = !finished(t) && t.batchTransferIdx != null;
        return `<div class="tx">
            <span class="ic">${issued ? ICON.issue : recv ? ICON.in : ICON.out}</span>
            <span class="mid">
                <span>${verb} <span class="num">${esc(amt)} ${esc(asset?.ticker || "")}</span></span>
                <span class="st ${STATUS_CLASS[t.status] || ""}"><i></i>${esc(STATUS_TEXT[t.status] || t.status || "")}${p ? ` · ${esc(p)}` : ""}</span>
                ${t.txid ? `<span class="id" hidden>${esc(t.txid)}</span>` : ""}
            </span>
            <span class="end">${age ? `${esc(age)} ago` : ""}
                ${stuck ? `<button data-fail="${esc(t.batchTransferIdx)}">Cancel</button>` : ""}</span>
        </div>`;
    }).join("");
    // The txid opens under the row, so the list stays short.
    for (const row of box.querySelectorAll(".tx")) {
        const id = row.querySelector(".id");
        if (id) { row.style.cursor = "pointer"; row.onclick = () => motion.reveal(id, id.hidden); }
    }
    for (const b of box.querySelectorAll("[data-fail]")) {
        b.onclick = async (e) => {
            e.stopPropagation();
            b.disabled = true;
            const r = await call("failTransfer", { batchTransferIdx: b.dataset.fail });
            if (!r.ok) { b.disabled = false; b.textContent = r.err; return; }
            await loadHistory();
            await loadHome();
        };
    }
    motion.rise(box.children);
}

$("doHist").onclick = async () => {
    const stop = motion.spin($("doHist").querySelector("svg"));
    await loadHistory();
    stop();
};
$("doCleanup").onclick = async () => {
    const b = $("doCleanup"); b.disabled = true; b.textContent = "Clearing…";
    const r = await call("cleanup");
    b.disabled = false; b.textContent = "Clear";
    $("cleanMsg").textContent = r.ok ? `Cleared. ${r.data.slots} free slots.` : r.err;
    await loadHistory();
};

// ---------- backup ----------
$("doBackup").onclick = async () => {
    const out = $("bkOut");
    out.textContent = "Packing…";
    const r = await call("backup", { password: $("bkPw").value });
    if (!r.ok) { out.innerHTML = `<span class="err">${esc(r.err)}</span>`; motion.shake($("bkPw")); return; }
    const blob = new Blob([new Uint8Array(r.data.bytes)], { type: "application/octet-stream" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `rgb-wallet-backup-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "")}.bin`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
    $("bkPw").value = "";
    await chrome.storage.local.set({ backupDoneAt: Date.now() });
    show("noBackupWarn", false);
    // rgb-lib marks the wallet as backed up during backup(), so re-reading status clears
    // the warning.
    await refreshBanner();
    out.textContent = "Exported. The backup password is separate from the wallet password.";
};

$("doRestore").onclick = async () => {
    const out = $("rsOut");
    const f = $("rsFile").files?.[0];
    if (!f) { out.innerHTML = `<span class="err">Select a backup file</span>`; return; }
    out.textContent = "Restoring…";
    const bytes = Array.from(new Uint8Array(await f.arrayBuffer()));
    const r = await call("restoreBackup", { bytes, password: $("rsPw").value });
    $("rsPw").value = "";
    if (!r.ok) { out.innerHTML = `<span class="err">${esc(r.err)}</span>`; return; }
    out.textContent = "Restored.";
    await loadHome();
    await refreshBanner();
};

// ---------- settings ----------
async function openSettings() {
    showOnly("settings-view");
    $("stMsg").textContent = "";
    try { $("stVersion").textContent = `v${chrome.runtime.getManifest().version}`; } catch { /* no manifest */ }
    await Promise.all([loadSettingsForm(), loadSites(), loadBackupRow()]);
}

function leaveSettings() {
    for (const b of document.querySelectorAll("[data-more].open")) { b.classList.remove("open"); show(b.dataset.more, false); }
    if (lastScreen === "locked") showLocked();
    else showOnly(lastScreen);
}

// Rows that open a block under them.
for (const b of document.querySelectorAll("[data-more]")) {
    b.onclick = () => {
        const open = !b.classList.contains("open");
        b.classList.toggle("open", open);
        motion.reveal($(b.dataset.more), open);
    };
}

async function loadSites() {
    const r = await call("sites");
    const box = $("sitesList");
    if (!r.ok) { box.innerHTML = `<p class="err">${esc(r.err)}</p>`; return; }
    const entries = Object.entries(r.data.sites || {});
    $("sitesCount").textContent = String(entries.length);
    if (!entries.length) { box.innerHTML = `<p class="fine">No sites connected.</p>`; return; }
    box.innerHTML = entries.map(([origin, info]) => `<div class="site">
        <span class="grow">${esc(origin)}<span>${esc(new Date(info.grantedAt).toLocaleString())}</span></span>
        <button class="secondary sm" data-revoke="${esc(origin)}">Revoke</button></div>`).join("");
    for (const b of box.querySelectorAll("[data-revoke]")) {
        b.onclick = async () => { await call("revokeSite", { origin: b.dataset.revoke }); await loadSites(); };
    }
}

async function loadBackupRow() {
    const st = await call("status");
    const unlocked = st.ok && st.data.unlocked;
    show("stBackup", unlocked);
    if (!unlocked) return;
    const needed = !(await backupEverDone()) || st.data.backupNeeded;
    $("stBackupVal").textContent = needed ? "Needed" : "Up to date";
    $("stBackupVal").style.color = needed ? "var(--color-gold)" : "";
}
$("stBackup").onclick = () => { leaveSettings(); goto("backup"); };

// Endpoints are per network, so the form shows the selected network's values.
let settingsSnapshot = null;
let formBase = "";

const formValues = () => JSON.stringify([$("stNetwork").value, $("stEsplora").value.trim(), $("stProxy").value.trim()]);

/** Host of an endpoint, for the row summary. */
function hostOf(u) {
    const s = String(u || "").trim().replace(/^rpcs:\/\//, "https://").replace(/^rpc:\/\//, "http://");
    try { return new URL(s).host; } catch { return s; }
}

/** The Save bar appears only when something differs from what is stored. */
function syncDirty() {
    $("stEsploraVal").textContent = hostOf($("stEsplora").value);
    $("stProxyVal").textContent = hostOf($("stProxy").value);
    const dirty = formValues() !== formBase;
    if (dirty && $("stFoot").hidden) { show("stFoot"); motion.enter($("stFoot")); }
    if (!dirty) show("stFoot", false);
}

function fillEndpoints(network) {
    const saved = settingsSnapshot?.byNetwork?.[network] || {};
    const def = settingsSnapshot?.netDefaults?.[network] || {};
    $("stEsplora").value = saved.esploraUrl ?? def.esploraUrl ?? "";
    $("stProxy").value = saved.proxyUrl ?? def.proxyUrl ?? "";
    $("stRegistry").value = saved.registryUrl ?? def.registryUrl ?? "";
}

async function loadSettingsForm() {
    const r = await call("settings");
    if (!r.ok) return;
    const s = settingsSnapshot = r.data;
    $("stNetwork").innerHTML = Object.entries(NETWORKS)
        .map(([k, v]) => `<option value="${esc(k)}" ${k === s.network ? "selected" : ""}>${esc(v.label)}</option>`).join("");
    fillEndpoints(s.network);
    formBase = formValues();
    syncDirty();
}

$("stNetwork").onchange = () => { fillEndpoints($("stNetwork").value); syncDirty(); };
$("stEsplora").oninput = syncDirty;
$("stProxy").oninput = syncDirty;

// The manifest declares only the default endpoints; anything else is granted at runtime.
// `rpc://` and `rpcs://` are the RGB proxy schemes and map to http and https.
function originsOf(urls) {
    const out = [];
    for (const u of urls) {
        const s = String(u || "").trim().replace(/^rpcs:\/\//, "https://").replace(/^rpc:\/\//, "http://");
        if (!/^https?:\/\//.test(s)) continue;
        try { out.push(new URL(s).origin + "/*"); } catch { /* not a URL, skip */ }
    }
    return [...new Set(out)];
}

async function ensureHostAccess(urls) {
    const origins = originsOf(urls);
    if (!origins.length) return true;
    if (await chrome.permissions.contains({ origins })) return true;
    return await chrome.permissions.request({ origins });
}

$("doSaveSettings").onclick = async () => {
    const granted = await ensureHostAccess([
        $("stEsplora").value, $("stProxy").value,
    ]);
    if (!granted) { $("stMsg").textContent = "Access to those endpoints was not granted"; return; }
    const r = await call("saveSettings", {
        settings: {
            network: $("stNetwork").value,
            esploraUrl: $("stEsplora").value.trim(),
            registryUrl: $("stRegistry").value.trim(),
            proxyUrl: $("stProxy").value.trim(),
        },
    });
    if (!r.ok) { $("stMsg").textContent = r.err; return; }
    // A running wallet is still bound to the old endpoints, so lock it and let it reopen.
    if (r.data.needsRelock) { await call("lock"); await showLocked(); return; }
    formBase = formValues();
    syncDirty();
    $("stMsg").textContent = "Saved";
    if (lastScreen === "welcome" || lastScreen === "setup") setTimeout(leaveSettings, 600);
};

$("wipeOk").onchange = () => { $("doWipe").disabled = !$("wipeOk").checked; };
$("doWipe").onclick = async () => {
    const r = await call("wipe");
    if (!r.ok) { $("stMsg").textContent = r.err; return; }
    $("wipeOk").checked = false; $("doWipe").disabled = true;
    btcAddress = null; shownSats = null;
    showOnly("welcome");
};

$("doChangePw").onclick = async () => {
    const r = await call("changePassword", { oldPassword: $("cpOld").value, newPassword: $("cpNew").value });
    $("cpOld").value = $("cpNew").value = "";
    $("stMsg").textContent = r.ok ? "Password changed" : r.err;
    if (!r.ok) motion.shake($("cpBox"));
};

// Issuing lives in Advanced, not on the wallet's main path: an asset made here has no market
// and no listing, and it costs a receive slot. Someone looking for it will find it.
$("doIssue").onclick = async () => {
    setErr("issueErr", null); show("issueMsg", false);

    const ticker = $("isTicker").value.trim();
    const name = $("isName").value.trim();
    const amount = $("isAmount").value.trim();
    const precision = Number($("isPrecision").value);

    const refuse = (msg) => { setErr("issueErr", msg); motion.shake($("issueBox")); };

    if (!ticker || !name) return refuse("A ticker and a name are required");
    if (!/^\d+$/.test(amount) || BigInt(amount) <= 0n) return refuse("The supply must be a whole number above 0");
    if (!Number.isInteger(precision) || precision < 0 || precision > 18) return refuse("Decimals must be between 0 and 18");

    const b = $("doIssue"); b.disabled = true; b.textContent = "Issuing…";
    const r = await call("issueAsset", { ticker, name, precision, amount });
    b.disabled = false; b.textContent = "Issue";

    if (!r.ok) return refuse(r.err);

    $("isTicker").value = $("isName").value = $("isAmount").value = "";
    $("issueMsg").textContent = `Issued ${r.data.ticker}. ${r.data.assetId}`;
    show("issueMsg");
};

enhanceAll();
route();
