// Service worker: routing, storage and the offscreen document's lifecycle.
//
// NOTE: storage is read and written only here. Offscreen documents support chrome.runtime
// only, so settings and the vault go in by message and a new vault comes back to be written.
//
// Holds no plaintext phrase and no wallet instance: this worker is evicted after 30s idle.
import { ok, err } from "./lib/msg.js";
import { DEFAULTS, NETWORKS, PER_NETWORK } from "./config.js";
import { migrate, resolve, apply, netDefaults } from "./lib/settings.js";
import { SNAPSHOT_DB, RESETTABLE, snapshotPrefix, deleteSnapshots } from "./lib/chain.js";

let creating = null;

// ---------- storage ----------
/** Reads settings and migrates the old flat layout. Persists when the migration ran. */
async function readRaw() {
    const { raw, changed } = migrate((await chrome.storage.local.get("settings")).settings);
    if (changed) await chrome.storage.local.set({ settings: raw });
    return raw;
}

async function getSettings(network = null) {
    return resolve(await readRaw(), network);
}
const getVault = async () => (await chrome.storage.local.get("vault")).vault || null;

// ---------- offscreen lifecycle ----------
async function offscreenExists() {
    const ctxs = await chrome.runtime.getContexts({ contextTypes: ["OFFSCREEN_DOCUMENT"] });
    return ctxs.length > 0;
}

async function ensureOffscreen() {
    if (await offscreenExists()) return;
    if (!creating) {
        creating = chrome.offscreen.createDocument({
            url: "offscreen.html",
            reasons: ["WORKERS"],
            justification: "RGB wallet: the wasm module is large and long-lived, so it cannot run in the service worker",
        });
    }
    try { await creating; } finally { creating = null; }
}

async function closeOffscreen() {
    if (await offscreenExists()) await chrome.offscreen.closeDocument();
    await chrome.storage.session.remove(["unlocked"]);
    // Tells any open view, so a wallet opened in a tab does not keep showing an unlocked
    // screen. Having no listener is the normal case, so the rejection is ignored.
    chrome.runtime.sendMessage({ to: "views", ev: "locked" }).catch(() => {});
}

/** Forwards a command to the wallet engine, retrying while the document registers its listener. */
async function toEngine(cmd, args) {
    await ensureOffscreen();
    let last;
    for (let i = 0; i < 10; i++) {
        try {
            const r = await chrome.runtime.sendMessage({ to: "offscreen", cmd, args });
            if (r) return r;
            last = "No response from the offscreen document";
        } catch (e) {
            last = String(e?.message || e);
            if (!/Receiving end does not exist|message port closed/i.test(last)) throw e;
        }
        await new Promise((res) => setTimeout(res, 100 + i * 100));
    }
    return err(last);
}

// The wallet stays unlocked until it is locked by hand or the browser closes; there is no
// idle timer. Closing the browser drops both the offscreen document and the session flag.
chrome.runtime.onInstalled.addListener(() => chrome.storage.session.remove(["unlocked"]));

// ---------- page provider ----------
const RGB_ERR = {
    rejected: { code: 4001, message: "User rejected" },
    unauthorized: { code: 4100, message: "Not authorized" },
    locked: { code: 4101, message: "Wallet is locked" },
    other: (m) => ({ code: 4900, message: String(m) }),
};

/**
 * A platform endpoint on the calling site, as an absolute URL, or `null`.
 *
 * Accepts a path or an absolute URL and resolves both against `origin`; anything landing on
 * another host is refused. NOTE: http passes only for localhost, so a site served over plain
 * http cannot have this wallet read an offer a network attacker can rewrite.
 */
function sameOriginBase(value, origin) {
    if (typeof value !== "string" || !value) return null;
    let url;
    try { url = new URL(value, origin); } catch { return null; }
    if (url.origin !== new URL(origin).origin) return null;
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol !== "https:" && !(url.protocol === "http:" && local)) return null;
    return url.toString().replace(/\/+$/, "");
}

const getSites = async () => (await chrome.storage.local.get("sites")).sites || {};
const isAuthorized = async (origin) => !!(await getSites())[origin];

async function unlocked() {
    const { unlocked: u } = await chrome.storage.session.get("unlocked");
    return (await offscreenExists()) && !!u;
}

const reqKey = (id) => `req:${id}`;
const getReq = async (id) => (await chrome.storage.session.get(reqKey(id)))[reqKey(id)] || null;
const setReq = (id, v) => chrome.storage.session.set({ [reqKey(id)]: v });

/**
 * Opens the approval window.
 * NOTE: request state goes to session storage, not memory. This worker is evicted after 30s
 * idle and a pending promise would go with it.
 */
async function openApproval(reqId) {
    await chrome.windows.create({
        url: chrome.runtime.getURL(`approve.html?req=${encodeURIComponent(reqId)}`),
        type: "popup", width: 420, height: 620,
    });
}

async function providerCall({ method, params }, origin) {
    if (!origin) return err("Missing request origin");

    if (method === "getAccount") {
        // No prompt. Returns null when not authorized or locked.
        if (!(await isAuthorized(origin)) || !(await unlocked())) return ok({ result: null });
        const r = await toEngine("identity", {});
        return r.ok ? ok({ result: r.data }) : ok({ result: null });
    }

    // A swap moves this wallet's sats or its asset, so it is approved like a signature, not like
    // a read. The approval window shows what the offer says, read from the platform itself.
    if (method === "swapPrepare" || method === "swapSign" || method === "swapColor" || method === "swapFinish") {
        if (!(await isAuthorized(origin))) return ok({ error: RGB_ERR.unauthorized, pending: false });
        if (!(await unlocked())) return ok({ error: RGB_ERR.locked, pending: false });
        if (typeof params?.offerId !== "string" || !params.offerId) {
            return ok({ error: RGB_ERR.other("offerId is required") });
        }
        // Resolved against the calling site, not taken as given. A page that could name the host
        // could point this wallet at an endpoint it also controls, and then "the wallet fetches
        // the offer itself" would check the page's own answer against the page's own PSBT.
        const apiBase = sameOriginBase(params?.apiBase, origin);
        if (!apiBase) {
            return ok({ error: RGB_ERR.other("apiBase must be a path or URL on this site") });
        }
        params = { ...params, apiBase };
        if ((method === "swapSign" || method === "swapFinish") && (typeof params?.psbt !== "string" || !params.psbt)) {
            return ok({ error: RGB_ERR.other("psbt is required") });
        }
        if (method === "swapColor" && (typeof params?.session !== "object" || !params.session)) {
            return ok({ error: RGB_ERR.other("session is required") });
        }
        const reqId = crypto.randomUUID();
        await setReq(reqId, { method, origin, params, status: "pending", createdAt: Date.now() });
        await openApproval(reqId);
        return ok({ pending: true, reqId });
    }

    if (method === "connect" || method === "signMessage") {
        if (method === "signMessage") {
            if (!(await isAuthorized(origin))) return ok({ error: RGB_ERR.unauthorized, pending: false });
            if (typeof params?.message !== "string" || !params.message) {
                return ok({ error: RGB_ERR.other("Message is required") });
            }
        }
        // No approval while locked; unlocking is a separate step from signing.
        if (!(await unlocked())) return ok({ error: RGB_ERR.locked });

        const reqId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        await setReq(reqId, { method, origin, params: params || {}, status: "pending", createdAt: Date.now() });
        await openApproval(reqId);
        return ok({ pending: true, reqId });
    }

    if (method === "getInvoice") {
        return ok({ error: RGB_ERR.other("getInvoice is not implemented yet") });
    }
    return ok({ error: RGB_ERR.other(`Unknown method ${method}`) });
}

/** Carries out an approved request, or records the rejection. */
async function decide({ reqId, approve }) {
    const req = await getReq(reqId);
    if (!req) return err("Request not found or expired");
    if (req.status !== "pending") return ok({ status: req.status });

    if (!approve) {
        await setReq(reqId, { ...req, status: "error", error: RGB_ERR.rejected });
        return ok({ status: "error" });
    }
    if (!(await unlocked())) {
        await setReq(reqId, { ...req, status: "error", error: RGB_ERR.locked });
        return ok({ status: "error" });
    }

    if (req.method === "connect") {
        const r = await toEngine("identity", {});
        if (!r.ok) { await setReq(reqId, { ...req, status: "error", error: RGB_ERR.other(r.err) }); return ok({ status: "error" }); }
        const sites = await getSites();
        sites[req.origin] = { grantedAt: Date.now() };
        await chrome.storage.local.set({ sites });
        await setReq(reqId, { ...req, status: "done", result: r.data });
        return ok({ status: "done" });
    }

    if (["swapPrepare", "swapSign", "swapColor", "swapFinish"].includes(req.method)) {
        const r = await toEngine(req.method, req.params);
        if (!r.ok) { await setReq(reqId, { ...req, status: "error", error: RGB_ERR.other(r.err) }); return ok({ status: "error" }); }
        await setReq(reqId, { ...req, status: "done", result: r.data });
        return ok({ status: "done" });
    }

    if (req.method === "signMessage") {
        const r = await toEngine("signMessage", { message: req.params.message });
        if (!r.ok) { await setReq(reqId, { ...req, status: "error", error: RGB_ERR.other(r.err) }); return ok({ status: "error" }); }
        await setReq(reqId, { ...req, status: "done", result: r.data });
        return ok({ status: "done" });
    }
    await setReq(reqId, { ...req, status: "error", error: RGB_ERR.other("Unknown method") });
    return ok({ status: "error" });
}

/** Revokes a site and notifies its open pages. */
async function revokeSite(origin) {
    const sites = await getSites();
    delete sites[origin];
    await chrome.storage.local.set({ sites });
    try {
        const tabs = await chrome.tabs.query({ url: `${origin}/*` });
        for (const t of tabs) {
            chrome.tabs.sendMessage(t.id, { to: "page", event: "disconnect" }).catch(() => {});
        }
    } catch { /* no open page for that origin */ }
    return ok({ revoked: origin });
}

// ---------- routing ----------
// Handled here, without starting the offscreen document.
const LOCAL_ONLY = {
    async hasVault() { return ok({ hasVault: !!(await getVault()) }); },

    // Provider entry point. The origin comes from the Chrome sender, not from the page.
    async provider(args) { return await providerCall(args, args.__origin); },
    async providerResult({ reqId }) {
        const r = await getReq(reqId);
        if (!r) return ok({ status: "error", error: RGB_ERR.other("Request not found") });
        return ok({ status: r.status, result: r.result, error: r.error });
    },
    async approvalGet({ reqId }) {
        const r = await getReq(reqId);
        if (!r) return err("Request not found or expired");
        return ok({ method: r.method, origin: r.origin, params: r.params, status: r.status });
    },
    async approvalDecide(args) { return await decide(args); },
    async sites() { return ok({ sites: await getSites() }); },

    async revokeSite({ origin }) { return await revokeSite(origin); },

    async isUnlocked() {
        // Both conditions: the document exists and it unlocked. Any command creates the
        // document, so its presence alone means nothing.
        const { unlocked } = await chrome.storage.session.get("unlocked");
        return ok({ unlocked: (await offscreenExists()) && !!unlocked });
    },

    async settings() {
        const raw = await readRaw();
        // `byNetwork` and the per-network defaults go along so the settings form can show
        // what the *other* network is configured with when the user switches the dropdown.
        return ok({ ...(await getSettings()), byNetwork: raw.byNetwork,
            netDefaults: Object.fromEntries(Object.keys(NETWORKS).map((n) => [n, netDefaults(n)])) });
    },

    async saveSettings({ settings }) {
        await chrome.storage.local.set({ settings: apply(await readRaw(), settings) });
        // A running wallet is bound to the old endpoints; the UI relocks it.
        return ok({ changed: true, needsRelock: await offscreenExists() });
    },

    async lock() {
        await closeOffscreen();                       // erases the phrase from memory
        return ok({ locked: true });
    },

    /**
     * Deletes the current network's local wallet data so it syncs again from the indexer's
     * chain. For when that chain was replaced. The vault stays; the wallet unlocks again.
     */
    async resetChain() {
        const { network } = await getSettings();
        if (!RESETTABLE.has(network)) return err(`${network} data cannot be reset: it holds the assets`);
        await closeOffscreen();          // a running engine would write its snapshot back
        const removed = await deleteSnapshots(snapshotPrefix(network));
        return ok({ network, removed });
    },

    /** Erases the vault and all wallet state. Settings are kept. */
    async wipe() {
        await closeOffscreen();
        await chrome.storage.local.remove(["vault", "backupDoneAt"]);
        await new Promise((res) => {
            const req = indexedDB.deleteDatabase(SNAPSHOT_DB);
            req.onsuccess = req.onerror = req.onblocked = () => res();
        });
        return ok({ wiped: true });
    },
};

// Commands that read from storage or produce something to persist.
async function withStorage(cmd, args) {
    const settings = await getSettings();

    if (cmd === "create") {
        if (await getVault()) return err("A wallet already exists. Erase it in settings first.");
        const r = await toEngine("create", { ...args, settings });
        if (!r.ok) return r;
        const { vault, ...rest } = r.data;
        await chrome.storage.local.set({ vault });    // ciphertext only
        await chrome.storage.session.set({ unlocked: true });
        return ok(rest);
    }

    if (cmd === "unlock") {
        const vault = await getVault();
        if (!vault) return err("No wallet yet");
        const r = await toEngine("unlock", { ...args, vault, settings });
        if (r.ok) await chrome.storage.session.set({ unlocked: true });
        return r;
    }

    if (cmd === "changePassword") {
        const vault = await getVault();
        if (!vault) return err("No wallet yet");
        const r = await toEngine("changePassword", { ...args, vault });
        if (!r.ok) return r;
        await chrome.storage.local.set({ vault: r.data.vault });
        return ok({ changed: true });
    }

    if (cmd === "refresh") {
        // The popup disables its own Sync button while a sync runs, but closing and
        // reopening the popup throws that away. The real gate lives here: session storage
        // outlives the popup and survives this worker being evicted.
        const { lastRefreshAt = 0 } = await chrome.storage.session.get("lastRefreshAt");
        const waitMs = DEFAULTS.refreshCooldownMs - (Date.now() - lastRefreshAt);
        if (waitMs > 0) return ok({ cooledDown: true, waitMs });

        const r = await toEngine(cmd, { ...args, settings });
        // Stamped whether or not it succeeded: a failed sync still reached the indexer, and
        // an exception that skips the stamp would be a way around the limit.
        await chrome.storage.session.set({ lastRefreshAt: Date.now() });
        // The window travels with the reply so the popup needs no copy of the constant.
        return r.ok ? ok({ ...r.data, cooldownMs: DEFAULTS.refreshCooldownMs }) : r;
    }

    // Everything else only needs the settings passed along.
    return await toEngine(cmd, { ...args, settings });
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.to !== "sw") return;
    (async () => {
        try {
            // hasOwn: prototype members such as "toString" must not resolve as commands.
            const local = Object.hasOwn(LOCAL_ONLY, msg.cmd) ? LOCAL_ONLY[msg.cmd] : null;
            if (local) {
                const args = { ...(msg.args || {}) };
                // From the Chrome sender, not from the page.
                if (msg.cmd === "provider") args.__origin = _sender?.origin || (_sender?.url ? new URL(_sender.url).origin : null);
                return await local(args);
            }
            return await withStorage(msg.cmd, msg.args || {});
        } catch (e) {
            return err(e);
        }
    })().then(sendResponse);
    return true;   // async response
});
