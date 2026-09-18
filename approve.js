// Approval window: shows the request and returns the user's decision.
import { call } from "./lib/msg.js";

const $ = (id) => document.getElementById(id);
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const reqId = new URLSearchParams(location.search).get("req");

(async () => {
    const r = await call("approvalGet", { reqId });
    if (!r.ok) { $("body").innerHTML = `<p class="err">${esc(r.err)}</p>`; return; }
    const { method, origin, params } = r.data;

    const who = `<p class="muted">Request from</p><p class="origin">${esc(origin)}</p>`;
    const acct = await call("identity");
    const addr = acct.ok ? `<p class="muted">Signing address</p><p class="origin">${esc(acct.data.address)}</p>` : "";

    if (method === "connect") {
        $("body").innerHTML = `<h2>Connect</h2>${who}
            <p class="muted">The site will see your identity address and can request signatures.</p>
            ${addr}
            <p class="warn">Connecting moves no assets and does not expose your keys.</p>`;
    } else if (method === "signMessage") {
        // The full message, never truncated.
        $("body").innerHTML = `<h2>Sign message</h2>${who}
            <div class="msg">${esc(params.message)}</div>
            ${addr}
            <p class="warn">Signing moves no assets. It proves you control the address above.</p>`;
    } else if (method === "swapColor" || method === "swapFinish") {
        let offer = null;
        try {
            const res = await fetch(`${params.apiBase.replace(/\/+$/, "")}/v1/p2p/offers/${encodeURIComponent(params.offerId)}`);
            if (res.ok) offer = await res.json();
        } catch { /* shown as unavailable below */ }
        const detail = offer
            ? `<div class="msg">Sell <b>${esc(offer.amount)}</b> of<br>${esc(offer.assetId)}<br>for <b>${esc(offer.priceSats)}</b> sats</div>`
            : `<p class="err">The offer could not be read from ${esc(params.apiBase)}</p>`;
        if (method === "swapColor") {
            $("body").innerHTML = `<h2>Prepare your sale</h2>${who}${detail}
                <p class="muted">Someone took your offer. This builds the transaction from your wallet and reserves the asset for it. Nothing is signed yet; the buyer signs next.</p>`;
        } else {
            $("body").innerHTML = `<h2>Sign and broadcast your sale</h2>${who}${detail}
                <p class="warn">The buyer has signed. Signing now completes the sale in one transaction: the asset leaves your wallet and the sats arrive together, or neither. Only the transaction your wallet prepared can be signed.</p>`;
        }
    } else if (method === "swapPrepare" || method === "swapSign") {
        // What the offer says, read here from the platform rather than from the page: the page
        // asked for this window, so it is not a source for what the window shows.
        let offer = null;
        try {
            const res = await fetch(`${params.apiBase.replace(/\/+$/, "")}/v1/p2p/offers/${encodeURIComponent(params.offerId)}`);
            if (res.ok) offer = await res.json();
        } catch { /* shown as unavailable below */ }
        const detail = offer
            ? `<div class="msg">Buy <b>${esc(offer.amount)}</b> of<br>${esc(offer.assetId)}<br>for <b>${esc(offer.priceSats)}</b> sats</div>`
            : `<p class="err">The offer could not be read from ${esc(params.apiBase)}</p>`;
        if (method === "swapPrepare") {
            $("body").innerHTML = `<h2>Prepare a swap</h2>${who}${detail}
                <p class="muted">This opens an invoice of your wallet and picks a UTXO to pay with. Nothing is signed and nothing moves yet.</p>`;
        } else {
            $("body").innerHTML = `<h2>Sign a swap</h2>${who}${detail}
                <p class="warn">Your sats and the asset change hands in one transaction: either both or neither. The wallet checks every output against the offer before signing, and refuses if anything differs. The seller signs after you and broadcasts it.</p>
                <p class="muted">Wait for one confirmation before treating the asset as received.</p>`;
        }
    } else {
        $("body").innerHTML = `<h2>Unknown request</h2>${who}<p class="err">${esc(method)}</p>`;
    }
    $("actions").hidden = false;
})();

async function decide(approve) {
    $("approve").disabled = $("reject").disabled = true;
    const r = await call("approvalDecide", { reqId, approve });
    if (!r.ok) {
        $("err").textContent = r.err;
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
