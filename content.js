// Isolated-world bridge between the page and the service worker.
// The page is untrusted input; the origin is taken from the Chrome sender, not from the page.
const TAG = "rgb-ext";
const reply = (id, payload) => window.postMessage({ source: TAG + ":res", id, ...payload }, window.location.origin);

window.addEventListener("message", async (ev) => {
    if (ev.source !== window || ev.data?.source !== TAG) return;
    const { id, method, params } = ev.data;
    if (!id || !method) return;
    try {
        const r = await chrome.runtime.sendMessage({ to: "sw", cmd: "provider", args: { method, params } });
        if (!r?.ok) { reply(id, { error: r?.error || { code: 4900, message: r?.err || "No response from wallet" } }); return; }
        // A refusal the worker decided on the spot (bad parameters, locked, not authorized) rides
        // inside a successful envelope. Without this the page resolves with `undefined` and the
        // reason is lost, which reads as a bug in the page rather than a refusal by the wallet.
        if (r.data?.error) { reply(id, { error: r.data.error }); return; }

        // Approval requests: the service worker opened the window; poll for the result.
        // Polling rather than a long-lived callback, because the worker is evicted after 30s
        // idle. Request state lives in session storage and survives that.
        if (r.data?.pending) {
            const deadline = Date.now() + 120_000;
            for (;;) {
                await new Promise((res) => setTimeout(res, 400));
                const q = await chrome.runtime.sendMessage({ to: "sw", cmd: "providerResult", args: { reqId: r.data.reqId } });
                if (q?.ok && q.data?.status === "done") { reply(id, { result: q.data.result }); return; }
                if (q?.ok && q.data?.status === "error") { reply(id, { error: q.data.error }); return; }
                if (Date.now() > deadline) { reply(id, { error: { code: 4900, message: "Approval timed out" } }); return; }
            }
        }
        reply(id, { result: r.data.result });
    } catch (e) {
        reply(id, { error: { code: 4900, message: String(e?.message || e) } });
    }
});

// Sent by the service worker when a site is revoked.
chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.to === "page" && msg.event) {
        window.postMessage({ source: TAG + ":res", event: msg.event, payload: msg.payload }, window.location.origin);
    }
});
