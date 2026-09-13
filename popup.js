import { call } from "./lib/msg.js";
import { amountOf, ago, sats, toRaw } from "./lib/fmt.js";
import { NETWORKS, DEFAULTS } from "./config.js";
import { isChainMismatch, RESETTABLE } from "./lib/chain.js";

const $ = (id) => document.getElementById(id);
// Ticker / name / assetId come from contract metadata and are issuer-controlled.
// NOTE: escape them before innerHTML; the CSP blocks script execution, not fake content.
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const show = (id, on = true) => { $(id).hidden = !on; };
const setErr = (id, e) => { const n = $(id); if (!e) { n.hidden = true; return; } n.textContent = e; n.hidden = false; };

let mode = "new";
let assetsCache = [];

async function route() {
    const has = await call("hasVault");
    if (!has.ok) { setErr("setupErr", has.err); show("setup"); return; }
    if (!has.data.hasVault) { showOnly("setup"); return; }

    const st = await call("isUnlocked");
    if (st.ok && st.data.unlocked) {
        const s = await call("status");
        if (s.ok && s.data.unlocked) { await enterMain(s.data); return; }
    }
    showOnly("locked");
}

const SCREENS = ["setup", "seed", "locked", "main", "settings-view"];
let lastScreen = "setup";

function showOnly(which) {
    if (which !== "settings-view") lastScreen = which;
    for (const s of SCREENS) show(s, s === which);
    show("lock", which === "main");
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
$("gear").onclick = async () => { showOnly("settings-view"); await loadSettingsForm(); await loadSites(); };
$("gearBack").onclick = () => showOnly(lastScreen);

async function loadSites() {
    const r = await call("sites");
    const box = $("sitesList");
    if (!r.ok) { box.innerHTML = `<p class="err">${esc(r.err)}</p>`; return; }
    const entries = Object.entries(r.data.sites || {});
    if (!entries.length) { box.innerHTML = `<p class="muted">No sites connected.</p>`; return; }
    box.innerHTML = entries.map(([origin, info]) => `<div class="row">
        <span class="addr">${esc(origin)}<br><span class="muted">${esc(new Date(info.grantedAt).toLocaleString())}</span></span>
        <button data-revoke="${esc(origin)}">Revoke</button></div>`).join("");
    for (const b of box.querySelectorAll("[data-revoke]")) {
        b.onclick = async () => { await call("revokeSite", { origin: b.dataset.revoke }); await loadSites(); };
    }
}

// Whether the strip is expanded. Kept across repaints so a refresh does not fold it shut
// under the user.
let noticeOpen = false;

/**
 * The warning strip at the top of the wallet.
 * Carries conditions the user can clear. `backupNeeded` drives it; `persisted` only sets the
 * severity, since the engine already requests persistent storage and a refusal is not
 * actionable.
 *
 * Everything collapses behind the header icon, except items marked `blocking`: with no
 * indexer or no proxy the wallet cannot do anything, and hiding that is worse than nagging.
 */
async function banner(st) {
    const items = [];

    const never = !(await backupEverDone());
    if (never || st.backupNeeded) {
        items.push({
            text: never
                ? "No backup yet. Without one the recovery phrase alone will not restore your assets."
                : "The wallet changed since your last backup.",
            // Without persistent storage the browser may clear the data at any time.
            extra: st.persisted === false ? " Browser storage is not persistent." : "",
            action: { id: "bnBackup", label: never ? "Back up now" : "Export a new backup" },
        });
    }
    if (st.onlineErr) {
        items.push({ text: `Indexer unreachable: ${st.onlineErr}`, extra: "", action: null, blocking: true });
    }
    if (st.proxyMissing) {
        items.push({
            text: "No RGB proxy configured. Sending and receiving need one.",
            extra: "",
            action: { id: "bnSettings", label: "Open settings" },
            blocking: true,
        });
    }

    const n = $("banner");
    n.innerHTML = items.map((i) => `<div class="bn">
        <span>${esc(i.text)}${esc(i.extra)}</span>
        ${i.action ? `<button id="${i.action.id}" class="ghost">${esc(i.action.label)}</button>` : ""}
    </div>`).join("");
    const btn = $("notice");
    btn.hidden = items.length === 0;
    btn.textContent = items.length > 1 ? `\u26A0 ${items.length}` : "\u26A0";
    btn.title = items.map((i) => i.text + i.extra).join("\n");
    btn.onclick = () => { noticeOpen = !noticeOpen; n.hidden = !noticeOpen; };

    if (items.some((i) => i.blocking)) noticeOpen = true;
    n.hidden = items.length === 0 || !noticeOpen;

    if ($("bnBackup")) $("bnBackup").onclick = () => document.querySelector('[data-view="backup"]').click();
    if ($("bnSettings")) $("bnSettings").onclick = () => $("gear").click();
}

/** Re-reads status and repaints the strip. */
async function refreshBanner() {
    const st = await call("status");
    if (st.ok) await banner(st.data);
}

async function enterMain(st) {
    showOnly("main");
    $("net").textContent = st.network || "";
    await banner(st);
    for (const v of VIEWS) show("v-" + v, v === "home");
    await loadHome();
}

// ---------- create / import ----------
for (const b of document.querySelectorAll("[data-mode]")) {
    b.onclick = () => {
        mode = b.dataset.mode;
        for (const x of document.querySelectorAll("[data-mode]")) x.classList.toggle("on", x === b);
        show("mnemonicIn", mode === "import");
        $("doCreate").textContent = mode === "import" ? "Import" : "Create";
    };
}

$("doCreate").onclick = async () => {
    setErr("setupErr", null);
    const [p1, p2] = [$("pw1").value, $("pw2").value];
    if (p1 !== p2) return setErr("setupErr", "Passwords do not match");
    if (p1.length < 8) return setErr("setupErr", "Password must be at least 8 characters");
    $("doCreate").disabled = true;
    $("doCreate").textContent = "Working…";
    const r = await call("create", { password: p1, mnemonic: mode === "import" ? $("mnemonicIn").value : "" });
    $("doCreate").disabled = false;
    $("doCreate").textContent = mode === "import" ? "Import" : "Create";
    if (!r.ok) return setErr("setupErr", r.err);
    $("pw1").value = $("pw2").value = $("mnemonicIn").value = "";
    if (r.data.mnemonic) {
        $("seedWords").textContent = r.data.mnemonic;
        showOnly("seed");
        // The phrase is dropped here; only the status goes into the dataset.
        const { mnemonic, ...rest } = r.data;
        $("seedDone").dataset.st = JSON.stringify(rest);
    } else {
        await enterMain(r.data);
    }
};

$("seedOk").onchange = () => { $("seedDone").disabled = !$("seedOk").checked; };
$("seedDone").onclick = async () => {
    $("seedWords").textContent = "";            // remove the phrase from the DOM
    await enterMain(JSON.parse($("seedDone").dataset.st || "{}"));
};

// ---------- unlock / lock ----------
$("doUnlock").onclick = async () => {
    setErr("lockErr", null);
    $("doUnlock").disabled = true; $("doUnlock").textContent = "Unlocking…";
    const r = await call("unlock", { password: $("pwUnlock").value });
    $("doUnlock").disabled = false; $("doUnlock").textContent = "Unlock";
    if (!r.ok) return setErr("lockErr", r.err);
    $("pwUnlock").value = "";
    show("lockMsg", false);
    await enterMain(r.data);
};
$("pwUnlock").onkeydown = (e) => { if (e.key === "Enter") $("doUnlock").click(); };
$("lock").onclick = async () => { await call("lock"); showOnly("locked"); };

// The engine can close while a tab is on screen; the view follows it back to the locked
// screen instead of showing a stale unlocked one.
chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.to !== "views" || msg.ev !== "locked") return;
    // A wipe closes the engine too, so the surviving vault decides which screen to show.
    call("hasVault").then((r) => showOnly(r.ok && r.data.hasVault ? "locked" : "setup"));
});

// ---------- navigation ----------
// Home, plus panels reached from it that return with Back.
const VIEWS = ["home", "recv", "send", "hist", "btc", "backup"];

async function goto(view) {
    for (const v of VIEWS) show("v-" + v, v === view);
    if (view === "home") await loadHome();
    if (view === "btc") await loadBtc();
    if (view === "recv") await loadSlots();
    if (view === "send") { if (btcSpendable === null) await loadBtc(); await loadSendForm(); }
    if (view === "hist") await loadHistory();
}

// Static entry points; rows rendered later call `goto` directly.
for (const b of document.querySelectorAll("[data-view]")) {
    b.onclick = () => goto(b.dataset.view);
}

// ---------- home: the wallet's RGB assets ----------
/**
 * Renders one row per asset held in this wallet: the settled balance, with anything in
 * flight as a signed delta under it.
 */
async function loadHome() {
    setErr("homeErr", null);
    const box = $("homeList");

    const [oc, btc] = await Promise.all([call("assets"), call("btc")]);
    if (oc.ok) assetsCache = oc.data.assets || [];       // Send and Activity read this

    // Bitcoin is one row at the end, built before the error check so a failed asset read
    // still leaves a route to the funding address.
    const walletSats = BigInt(btc.ok ? (btc.data.balance?.vanilla?.spendable ?? "0") : "0");
    const btcRow = `<div class="asset click" data-view="btc">
        <div class="top"><span class="tk">Bitcoin</span>
            <span class="amt">${esc(sats.toBtc(walletSats.toString()))} BTC</span></div>
        <div class="brk">Pays on-chain fees</div>
    </div>`;
    const wire = () => {
        for (const el of box.querySelectorAll("[data-view]")) el.onclick = () => goto(el.dataset.view);
    };

    if (!oc.ok) { box.innerHTML = `<div class="err">${esc(oc.err)}</div>` + btcRow; wire(); return; }

    const list = oc.data.assets || [];
    const html = list.map((a) => {
        const settled = amountOf(a.balance?.settled ?? "0", a.precision);
        const inflight = deltaOf(a.balance?.settled, a.balance?.future, a.precision);
        return `<div class="asset">
            <div class="top"><span class="tk">${esc(a.ticker || "?")}</span>
                <span class="amt">${esc(settled.text)}</span></div>
            ${a.name ? `<div class="muted">${esc(a.name)}</div>` : ""}
            ${inflight}
            ${settled.unknown ? `<div class="unk">Precision unknown. Showing the raw base-unit value.</div>` : ""}
            <div class="id">${esc(a.assetId)}</div>
        </div>`;
    }).join("");

    // No backup warning here: the header notice already carries it, from the same
    // `backupInfo()` the status call reads.
    box.innerHTML = (html || `<p class="muted">No assets yet. Use Receive to get some.</p>`) + btcRow;
    wire();      // the row is rendered here, so its handler is attached here
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
    const sign = d < 0n ? "−" : "+";
    const mag = amountOf((d < 0n ? -d : d).toString(), precision);
    const word = d < 0n ? "leaving" : "incoming";
    return `<div class="muted">${sign}${esc(mag.text)} ${word}</div>`;
}

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
        if (left <= 0) { btn.disabled = false; btn.textContent = "Sync"; return; }
        btn.textContent = `Sync ${left}s`;
        left -= 1;
        setTimeout(tick, 1000);
    };
    tick();
}

$("doRefresh").onclick = async () => {
    const btn = $("doRefresh");
    btn.disabled = true;
    btn.textContent = "Verifying…";        // client-side validation grows with history
    $("refreshMs").textContent = "";
    const r = await call("refresh");

    // Asked again too soon: nothing ran, so say how long is left and leave the screen alone.
    if (r.ok && r.data.cooledDown) {
        $("refreshMs").textContent = "Synced a moment ago";
        holdRefresh(r.data.waitMs);
        return;
    }
    if (!r.ok) {
        btn.disabled = false; btn.textContent = "Sync";
        $("refreshMs").textContent = r.err;
        await offerChainReset(r.err);
        return;
    }
    show("chainReset", false);
    $("refreshMs").textContent = `${r.data.ms} ms`;
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
    if (!r.ok) { $("refreshMs").textContent = r.err; return; }
    show("chainReset", false);
    $("refreshMs").textContent = "";
    // The engine closed; unlocking boots it on an empty Regtest snapshot.
    showOnly("locked");
    $("lockMsg").textContent = "Regtest data cleared. Unlock to sync with the current chain.";
    show("lockMsg");
};

// ---------- receive ----------
async function loadSlots() {
    const r = await call("btc");
    $("slots").textContent = r.ok ? r.data.slots : "?";
}

$("doPrepare").onclick = async () => {
    setErr("recvErr", null);
    const b = $("doPrepare"); b.disabled = true; b.textContent = "Creating…";
    const r = await call("prepare");
    b.disabled = false; b.textContent = "Create slots";
    if (!r.ok) return setErr("recvErr", r.err);
    $("slots").textContent = r.data.slots;
    if (r.data.created) setErr("recvErr", `Created ${r.data.created} slots. Usable after 1 confirmation.`);
    await refreshBanner();
};

// The first invoice is gated on having exported a backup.
async function backupEverDone() {
    return !!(await chrome.storage.local.get("backupDoneAt")).backupDoneAt;
}
$("goBackup").onclick = () => document.querySelector('[data-view="backup"]').click();
$("anyway").onclick = async () => { show("noBackupWarn", false); await makeInvoice(); };

$("doInvoice").onclick = async () => {
    if (!(await backupEverDone())) { show("noBackupWarn", true); return; }
    await makeInvoice();
};

async function makeInvoice() {
    setErr("recvErr", null);
    const r = await call("receive", {});
    if (!r.ok) return setErr("recvErr", r.err);
    $("invoice").value = r.data.invoice;
    const exp = r.data.expirationTimestamp;
    $("invoiceExp").textContent = exp ? `Expires ${new Date(Number(exp) * 1000).toLocaleString()}` : "";
    show("invoiceBox");
    await loadSlots();
    await refreshBanner();          // a blind invoice consumes a slot: wallet state changed
}

$("copyInvoice").onclick = () => navigator.clipboard.writeText($("invoice").value);
$("copyAddr").onclick = () => navigator.clipboard.writeText($("btcAddr").textContent);

// ---------- bitcoin ----------
// Only the vanilla path is spendable as plain BTC; colored UTXOs are never touched.
let btcSpendable = null;

async function loadBtc() {
    const r = await call("btc");
    if (!r.ok) { $("btcBal").innerHTML = `<div class="err">${esc(r.err)}</div>`; return; }
    $("btcAddr").textContent = r.data.address;
    const { vanilla, colored } = r.data.balance;
    btcSpendable = String(vanilla.spendable);
    // `spendable` is confirmed plus unconfirmed, not a subset of `settled` — the two are
    // shown as its parts so the labels cannot be read the other way round.
    const pending = BigInt(vanilla.spendable) - BigInt(vanilla.settled);
    // `future` for the colored side: it is a total, not something to spend, so pending
    // slots belong in it. Without this row, creating slots looks like losing Bitcoin.
    $("btcBal").innerHTML = `<div class="row"><span>Available</span><b>${sats.toBtc(vanilla.spendable)} BTC</b></div>
        <div class="row sub"><span>Confirmed</span><span class="muted">${sats.toBtc(vanilla.settled)} BTC</span></div>
        ${pending > 0n ? `<div class="row sub"><span>Waiting to confirm</span>
            <span class="muted">${esc(sats.toBtc(pending.toString()))} BTC</span></div>` : ""}
        <div class="row"><span>In RGB UTXOs</span><span class="muted">${sats.toBtc(colored.future)} BTC</span></div>
        <p class="muted">RGB UTXOs carry the assets. Their Bitcoin is not spendable as plain BTC.
        ${pending > 0n ? "Creating slots waits for every input to confirm." : ""}</p>`;
}

// ---------- send ----------
for (const b of document.querySelectorAll("[data-send]")) {
    b.onclick = () => {
        for (const x of document.querySelectorAll("[data-send]")) x.classList.toggle("on", x === b);
        show("send-rgb", b.dataset.send === "rgb");
        show("send-btc", b.dataset.send === "btc");
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

function syncUnit() {
    const a = currentAsset();
    // Without precision the amount has to be entered in base units.
    $("sUnit").textContent = a
        ? (a.precision === null || a.precision === undefined
            ? " — precision unknown, enter base units"
            : ` — up to ${a.precision} decimals`)
        : "";
    const max = $("sMax");
    max.hidden = !a;
    if (a) max.textContent = `Max ${amountOf(sendableRaw(a).toString(), a.precision).text}`;
}

$("sMax").onclick = () => {
    const a = currentAsset();
    if (a) $("sAmount").value = amountOf(sendableRaw(a).toString(), a.precision).text;
};
$("sAsset").onchange = syncUnit;

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

$("doDecode").onclick = async () => {
    setErr("sendErr", null);
    $("decoded").textContent = "Reading…";
    const r = await call("decodeInvoice", { invoice: $("sInvoice").value });
    if (!r.ok) { $("decoded").textContent = ""; return setErr("sendErr", r.err); }
    const d = r.data.data;
    const bits = [`Network ${esc(d.network || "?")}`];
    bits.push(d.assetId ? `Asset ${esc(d.assetId)}` : "Any asset");
    // Preselect the asset the invoice names, before reading the requested amount:
    // the amount can only be shown in human units once the precision is known.
    if (d.assetId && assetsCache.some((x) => x.assetId === d.assetId)) { $("sAsset").value = d.assetId; syncUnit(); }
    const want = requestedAmount(d.assignment, currentAsset()?.precision);
    if (want) {
        bits.push(`Asks for ${esc(want.text)}${want.unknown ? " (base units)" : ""}`);
        // Prefill so the sent amount matches what was asked for; still editable.
        $("sAmount").value = want.text;
    }
    if (d.expirationTimestamp) bits.push(`Expires ${new Date(Number(d.expirationTimestamp) * 1000).toLocaleString()}`);
    if (d.transportEndpoints?.length) bits.push(`Consignment goes to ${esc(d.transportEndpoints[0])}`);
    $("decoded").innerHTML = bits.map((b) => `<div>· ${b}</div>`).join("")
        + r.data.warnings.map((w) => `<div class="err">${esc(w)}</div>`).join("");
};

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

$("doSendRgb").onclick = async () => {
    setErr("sendErr", null); $("sendOut").textContent = "";
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
    btn.disabled = false; btn.textContent = "Send";
    if (!r.ok) return setErr("sendErr", r.err);
    $("sendOut").innerHTML = `Broadcast <code>${esc(r.data.txid)}</code><br>
        <span class="muted">Settles once the recipient picks up the consignment.</span>`;
    $("sAmount").value = ""; $("sInvoice").value = ""; $("decoded").textContent = "";
    await loadHome();
    await refreshBanner();          // the wallet changed: the backup is now stale
};

$("doSendBtc").onclick = async () => {
    setErr("sendErr", null); $("sendOut").textContent = "";
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
    btn.disabled = false; btn.textContent = "Send";
    if (!r.ok) return setErr("sendErr", r.err);
    $("sendOut").innerHTML = `Broadcast <code>${esc(r.data.txid)}</code>`;
    $("bAmount").value = ""; syncBtcAmountHint();
    await loadBtc();
    await refreshBanner();
};

// ---------- activity ----------
const STATUS_TEXT = {
    WaitingCounterparty: "Waiting for pickup",
    WaitingConfirmations: "Confirming",
    Settled: "Settled",
    Failed: "Failed",
};

/**
 * How far along a pending transfer is. `null` means the indexer could not be asked, which
 * is different from zero and so says nothing rather than "no confirmations".
 */
function progressText(t, target) {
    if (t.confirmations == null) return "";
    const age = ago(t.updated_at ?? t.created_at);
    const tail = age ? ` \u00b7 ${age}` : "";
    if (t.confirmations === 0) return `In the mempool, no confirmations yet${tail}`;
    if (t.confirmations < target) return `${t.confirmations} of ${target} confirmations${tail}`;
    return `${t.confirmations} confirmations${tail}`;
}

async function loadHistory() {
    const r = await call("transfers");
    const box = $("histList");
    if (!r.ok) { box.innerHTML = `<div class="err">${esc(r.err)}</div>`; return; }
    const list = r.data.transfers;
    const target = r.data.target ?? 1;
    if (!list.length) { box.innerHTML = `<p class="muted">Nothing yet.</p>`; return; }
    box.innerHTML = list.map((t) => {
        const asset = assetsCache.find((x) => x.assetId === t.assetId);
        // An asset no longer held is not in the cache, so precision is unknown more often
        // here. Unknown precision is marked, as on the balance rows.
        const a = t.amount != null ? amountOf(t.amount, asset?.precision) : null;
        const amt = a ? a.text + (a.unknown ? " (base units)" : "") : "";
        const dir = String(t.kind || "").startsWith("Receive") ? "In" : t.kind === "Issuance" ? "Issued" : "Out";
        const stuck = t.status !== "Settled" && t.status !== "Failed" && t.batchTransferIdx != null;
        return `<div class="asset">
            <div class="top"><span class="tk">${esc(dir)} ${esc(amt)} ${esc(asset?.ticker || "")}</span>
                <span class="muted">${esc(STATUS_TEXT[t.status] || t.status || "")}</span></div>
            ${(() => { const p = progressText(t, target); return p ? `<div class="muted">${esc(p)}</div>` : ""; })()}
            ${t.txid ? `<div class="id">${esc(t.txid)}</div>` : ""}
            ${stuck ? `<div class="row" style="margin:6px 0 0"><span></span>
                <button data-fail="${esc(t.batchTransferIdx)}">Cancel</button></div>` : ""}
        </div>`;
    }).join("");
    for (const b of box.querySelectorAll("[data-fail]")) {
        b.onclick = async () => {
            b.disabled = true;
            const r = await call("failTransfer", { batchTransferIdx: b.dataset.fail });
            if (!r.ok) { b.disabled = false; b.textContent = r.err; return; }
            await loadHistory();
            await loadHome();
        };
    }
}

$("doHist").onclick = loadHistory;
$("doCleanup").onclick = async () => {
    const b = $("doCleanup"); b.disabled = true; b.textContent = "Clearing…";
    const r = await call("cleanup");
    b.disabled = false; b.textContent = "Clear expired invoices";
    $("histList").insertAdjacentHTML("afterbegin", r.ok
        ? `<p class="muted">${esc(r.data.slots)} free slots.</p>`
        : `<p class="err">${esc(r.err)}</p>`);
    await loadHistory();
};

// ---------- backup ----------
$("doBackup").onclick = async () => {
    const out = $("bkOut");
    out.textContent = "Packing…";
    const r = await call("backup", { password: $("bkPw").value });
    if (!r.ok) { out.innerHTML = `<span class="err">${esc(r.err)}</span>`; return; }
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
// Endpoints are per network, so the form shows the selected network's values.
let settingsSnapshot = null;

function fillEndpoints(network) {
    const saved = settingsSnapshot?.byNetwork?.[network] || {};
    const def = settingsSnapshot?.netDefaults?.[network] || {};
    $("stEsplora").value = saved.esploraUrl ?? def.esploraUrl ?? "";
    $("stProxy").value = saved.proxyUrl ?? def.proxyUrl ?? "";
}

async function loadSettingsForm() {
    const r = await call("settings");
    if (!r.ok) return;
    const s = settingsSnapshot = r.data;
    $("stNetwork").innerHTML = Object.entries(NETWORKS)
        .map(([k, v]) => `<option value="${esc(k)}" ${k === s.network ? "selected" : ""}>${esc(v.label)}</option>`).join("");
    fillEndpoints(s.network);
}

$("stNetwork").onchange = () => fillEndpoints($("stNetwork").value);

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
            proxyUrl: $("stProxy").value.trim(),
        },
    });
    if (!r.ok) { $("stMsg").textContent = r.err; return; }
    // A running wallet is still bound to the old endpoints, so lock it and let it reopen.
    if (r.data.needsRelock) { await call("lock"); showOnly("locked"); return; }
    $("stMsg").textContent = "Saved";
    if (lastScreen === "setup") setTimeout(() => showOnly("setup"), 600);
};

$("wipeOk").onchange = () => { $("doWipe").disabled = !$("wipeOk").checked; };
$("doWipe").onclick = async () => {
    const r = await call("wipe");
    if (!r.ok) { $("stMsg").textContent = r.err; return; }
    $("wipeOk").checked = false; $("doWipe").disabled = true;
    showOnly("setup");
};

$("doChangePw").onclick = async () => {
    const r = await call("changePassword", { oldPassword: $("cpOld").value, newPassword: $("cpNew").value });
    $("cpOld").value = $("cpNew").value = "";
    $("stMsg").textContent = r.ok ? "Password changed" : r.err;
};

route();
