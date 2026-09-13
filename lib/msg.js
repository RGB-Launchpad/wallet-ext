// Messaging between popup, service worker and offscreen document.
// Replies are { ok, data } or { ok: false, err }.

export function ok(data) { return { ok: true, data }; }
export function err(e) { return { ok: false, err: String(e?.message || e) }; }

/** Popup side: send to the service worker. */
export async function call(cmd, args) {
    try {
        const r = await chrome.runtime.sendMessage({ to: "sw", cmd, args });
        if (!r) throw new Error("No response. The service worker may have restarted; try again.");
        return r;
    } catch (e) { return err(e); }
}

/** Register a listener that only handles messages addressed to `who`. */
export function listen(who, handlers) {
    chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
        if (msg?.to !== who) return;
        // hasOwn: prototype members such as "toString" must not resolve as commands.
        const fn = Object.hasOwn(handlers, msg.cmd) ? handlers[msg.cmd] : null;
        if (!fn) { sendResponse(err(`Unknown command ${msg.cmd}`)); return true; }
        Promise.resolve()
            .then(() => fn(msg.args || {}))
            .then((data) => sendResponse(ok(data)))
            .catch((e) => sendResponse(err(e)));
        return true;   // async response
    });
}

/** Converts BigInt to string; it cannot cross the message channel. */
export function plain(v) {
    return JSON.parse(JSON.stringify(v, (_k, x) => (typeof x === "bigint" ? x.toString() : x)));
}
