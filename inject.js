// Runs in the page's main world and installs `window.rgb`.
// Holds no extension privileges and no keys; forwards requests to the content script.
(() => {
    const TAG = "rgb-ext";
    const pending = new Map();
    let seq = 0;
    const listeners = { accountChanged: new Set(), networkChanged: new Set(), disconnect: new Set() };

    window.addEventListener("message", (ev) => {
        // Only messages from this window carrying the marker; an iframe must not impersonate
        // the page.
        if (ev.source !== window || ev.data?.source !== TAG + ":res") return;
        const { id, result, error, event, payload } = ev.data;
        if (event) {
            for (const cb of listeners[event] || []) { try { cb(payload); } catch { /* the callback's own problem */ } }
            return;
        }
        const p = pending.get(id);
        if (!p) return;
        pending.delete(id);
        if (error) {
            const e = new Error(error.message || "Wallet error");
            e.code = error.code;
            p.reject(e);
        } else p.resolve(result);
    });

    const request = (method, params) => new Promise((resolve, reject) => {
        const id = `${Date.now()}-${++seq}`;
        pending.set(id, { resolve, reject });
        window.postMessage({ source: TAG, id, method, params }, window.location.origin);
    });

    const provider = {
        isRgbWallet: true,
        version: "0.3.0",
        connect: () => request("connect"),
        getAccount: () => request("getAccount"),
        signMessage: (message) => request("signMessage", { message }),
        // Peer-to-peer swaps. The page passes an offer id and the platform's API base; the
        // wallet fetches the offer itself, decides what it signs, and never takes a PSBT to
        // sign blindly.
        swapPrepare: (opts) => request("swapPrepare", opts || {}),
        swapSign: (opts) => request("swapSign", opts || {}),
        // Reserved; currently returns "not implemented".
        getInvoice: (opts) => request("getInvoice", opts || {}),
        on(event, cb) { listeners[event]?.add(cb); },
        removeListener(event, cb) { listeners[event]?.delete(cb); },
    };

    // Frozen and non-writable: page scripts must not replace the provider.
    Object.freeze(provider);
    Object.defineProperty(window, "rgb", { value: provider, writable: false, configurable: false });
})();
