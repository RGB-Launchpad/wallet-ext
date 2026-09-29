// Approval window: shows the request and returns the user's decision.
import { call } from "./lib/msg.js";
import { NETWORKS, OFFICIAL_ORIGINS } from "./config.js";
import * as motion from "./lib/motion.js";
import { t, setLang, applyI18n } from "./lib/i18n.js";

const $ = (id) => document.getElementById(id);
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const short = (s, head = 8, tail = 6) => { s = String(s || ""); return s.length > head + tail + 1 ? `${s.slice(0, head)}…${s.slice(-tail)}` : s; };

const ICON = {
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    open: '<svg viewBox="0 0 24 24"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>',
    next: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    swap: '<svg viewBox="0 0 24 24"><path d="M12 4v16M6 14l6 6 6-6"/></svg>',
    site: '<svg viewBox="0 0 24 24" style="width:26px;height:26px"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/></svg>',
};

const reqId = new URLSearchParams(location.search).get("req");

/** Who is asking: the full origin, never shortened, with its scheme made visible. */
function hero(origin, title) {
    let host = origin, https = false;
    try { const u = new URL(origin); host = u.host; https = u.protocol === "https:"; } catch { /* shown as given */ }
    // A letter only means something for a name. An address, or a host that starts with a digit,
    // gets the globe instead of a stray "1".
    const name = host.replace(/^www\./, "");
    const letter = /^[a-z]/i.test(name) ? name.charAt(0).toUpperCase() : null;
    const official = OFFICIAL_ORIGINS.includes(origin);
    return `<div class="req-hero">
        <span class="site-mark">${letter ? esc(letter) : ICON.site}</span>
        <span class="origin ${https ? "" : "plain"}">${https ? ICON.lock : ICON.open}${esc(origin)}</span>
        ${official ? `<span class="official">${ICON.check}${esc(t("Darkhorse's own site"))}</span>` : ""}
        <span class="req-display">${esc(title)}</span>
    </div>`;
}

/** Facts the wallet has checked or will check, and what happens next. */
const checks = (items) => `<div class="checks">${items.map(([kind, text]) =>
    `<div class="${kind === "next" ? "next" : ""}">${ICON[kind]}<span>${esc(text)}</span></div>`).join("")}</div>`;

const leg = (label, coin, amount, id) => `<div class="leg">${coin}
    <span class="col"><span class="fine">${label}</span><span class="num">${esc(amount)}</span></span>
    ${id ? `<code title="${esc(id)}">${esc(short(id, 10, 6))}</code>` : ""}</div>`;
const BTC = '<span class="coin btc" style="width:34px;height:34px;font-size:15px">₿</span>';
const RGB = '<span class="av" style="width:34px;height:34px;background:var(--color-card-soft);color:var(--color-ink-2)">R</span>';

/**
 * Both legs of the trade. Read here from the platform rather than from the page: the page
 * asked for this window, so it is not a source for what the window shows.
 */
async function offerCard(params, side) {
    let offer = null;
    try {
        const res = await fetch(`${params.apiBase.replace(/\/+$/, "")}/v1/p2p/offers/${encodeURIComponent(params.offerId)}`);
        if (res.ok) offer = await res.json();
    } catch { /* shown as unavailable below */ }
    if (!offer) return `<p class="err">${esc(t("The offer could not be read from {b}", { b: params.apiBase }))}</p>`;
    const sats = leg(side === "buy" ? t("You pay") : t("You receive"), BTC, `${offer.priceSats} sats`);
    const asset = leg(side === "buy" ? t("You receive") : t("You pay"), RGB, `${offer.amount}`, offer.assetId);
    const [top, bottom] = side === "buy" ? [sats, asset] : [asset, sats];
    return `<div class="card trade">${top}<div class="mid"><span>${ICON.swap}</span></div>${bottom}</div>`;
}

(async () => {
    const [r, st] = await Promise.all([call("approvalGet", { reqId }), call("settings")]);
    if (st.ok) setLang(st.data.lang || "en");
    applyI18n();
    if (st.ok) {
        const label = NETWORKS[st.data.network]?.label || st.data.network;
        $("net").querySelector("span").textContent = label;
        $("net").classList.toggle("main", st.data.network === "Mainnet");
        $("net").hidden = !label;
    }
    if (!r.ok) { $("body").innerHTML = `<p class="err">${esc(r.err)}</p>`; return; }
    const { method, origin, params } = r.data;

    const acct = await call("identity");
    const addr = acct.ok
        ? `<div class="kv"><div class="r"><span>${esc(t("Signing address"))}</span><code title="${esc(acct.data.address)}">${esc(short(acct.data.address))}</code></div></div>`
        : "";
    let html, action;

    if (method === "connect") {
        action = t("Connect");
        html = `${hero(origin, t("Connect"))}
            <p class="fine center">${esc(t("The site will see your identity address and can request signatures. Every signature still needs your approval here."))}</p>
            ${addr}
            ${checks([["check", t("Connecting moves no assets and does not expose your keys.")]])}`;
    } else if (method === "signMessage") {
        action = t("Sign");
        // The full message, never truncated.
        html = `${hero(origin, t("Signature request"))}
            <div class="fld"><span class="eyebrow">${esc(t("Message"))}</span><div class="msg">${esc(params.message)}</div></div>
            ${addr}
            ${checks([["check", t("Moves no assets. Proves you control the address above.")]])}`;
    } else if (method === "swapPrepare") {
        action = t("Prepare");
        html = `${hero(origin, t("Prepare a swap"))}${await offerCard(params, "buy")}
            <p class="fine">${esc(t("This opens an invoice of your wallet and picks a UTXO to pay with. Nothing is signed and nothing moves yet."))}</p>`;
    } else if (method === "swapSign") {
        action = t("Sign swap");
        html = `${hero(origin, t("Sign swap"))}${await offerCard(params, "buy")}
            ${checks([
                ["check", t("Your sats and the asset change hands in one transaction: both or neither.")],
                ["check", t("The wallet checks every output against the offer before signing, and refuses if anything differs.")],
                ["next", t("The seller signs after you and broadcasts it.")],
                ["next", t("Wait for one confirmation before treating the asset as received.")],
            ])}`;
    } else if (method === "swapColor") {
        action = t("Prepare sale");
        html = `${hero(origin, t("Prepare your sale"))}${await offerCard(params, "sell")}
            <p class="fine">${esc(t("Someone took your offer. This builds the transaction from your wallet and reserves the asset for it. Nothing is signed yet; the buyer signs next."))}</p>`;
    } else if (method === "swapFinish") {
        action = t("Sign and broadcast");
        html = `${hero(origin, t("Sign and broadcast your sale"))}${await offerCard(params, "sell")}
            ${checks([
                ["check", t("The buyer has signed.")],
                ["check", t("The asset leaves your wallet and the sats arrive in the same transaction, or neither happens.")],
                ["check", t("Only the transaction your wallet prepared can be signed.")],
            ])}`;
    } else {
        action = t("Approve");
        html = `${hero(origin, t("Unknown request"))}<p class="err">${esc(method)}</p>`;
    }
    $("body").innerHTML = html;
    $("approve").textContent = action;
    $("actions").hidden = false;
    motion.rise($("body").children);
    motion.rise($("body").querySelectorAll(".checks > div"), { delay: 200 });
    motion.enter($("actions"));
})();

async function decide(approve) {
    $("approve").disabled = $("reject").disabled = true;
    const r = await call("approvalDecide", { reqId, approve });
    if (!r.ok) {
        $("err").textContent = t(String(r.err));
        $("err").hidden = false;
        $("approve").disabled = $("reject").disabled = false;
        return;
    }
    window.close();
}
$("approve").onclick = () => decide(true);
$("reject").onclick = () => decide(false);
// Closing the window counts as a rejection.
window.addEventListener("beforeunload", () => { call("approvalDecide", { reqId, approve: false }); });
