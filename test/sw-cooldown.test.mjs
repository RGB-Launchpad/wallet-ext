// The sync rate limit, exercised through the service worker's own message handler.
//
// This is the only place the limit is enforced: the popup's disabled button is cosmetic and
// is thrown away when the popup closes. Nothing else covers sw.js, so the `chrome` API it
// needs is stubbed here and the handler is driven directly.
import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULTS } from "../config.js";

// Captured when sw.js registers its listener at import time.
let handler = null;
const session = new Map();
const local = new Map();
let engineCalls = 0;

globalThis.indexedDB = { deleteDatabase: () => ({}) };
globalThis.chrome = {
    runtime: {
        onMessage: { addListener: (fn) => { handler = fn; } },
        onInstalled: { addListener: () => {} },
        getContexts: async () => [{}],                    // pretend the engine is up
        sendMessage: async (m) => {
            if (m.to !== "offscreen") return undefined;
            engineCalls += 1;
            return { ok: true, data: { ms: 7, changed: {} } };
        },
        getURL: (p) => p,
    },
    storage: {
        local: { get: async (k) => (local.has(k) ? { [k]: local.get(k) } : {}),
                 set: async (o) => { for (const [k, v] of Object.entries(o)) local.set(k, v); },
                 remove: async () => {} },
        session: { get: async (k) => (session.has(k) ? { [k]: session.get(k) } : {}),
                   set: async (o) => { for (const [k, v] of Object.entries(o)) session.set(k, v); },
                   remove: async () => {} },
    },
    offscreen: { createDocument: async () => {}, closeDocument: async () => {} },
    windows: { create: async () => {} },
    tabs: { query: async () => [], sendMessage: async () => {} },
};

await import("../sw.js");

/** Sends a command the way the popup does and resolves with the reply. */
const send = (cmd, args = {}) =>
    new Promise((res) => { handler({ to: "sw", cmd, args }, {}, res); });

test("the worker registered a message handler", () => {
    assert.equal(typeof handler, "function");
});

test("the first sync runs, and an immediate second one does not reach the engine", async () => {
    engineCalls = 0;
    const first = await send("refresh");
    assert.equal(first.ok, true);
    assert.equal(first.data.cooledDown, undefined, "the first call must not be rate limited");
    assert.equal(engineCalls, 1);

    const second = await send("refresh");
    assert.equal(second.ok, true);
    assert.equal(second.data.cooledDown, true);
    assert.ok(second.data.waitMs > 0 && second.data.waitMs <= DEFAULTS.refreshCooldownMs);
    assert.equal(engineCalls, 1, "the engine must not be reached a second time");
});

test("hammering it stays at one engine call", async () => {
    engineCalls = 0;
    session.clear();
    await send("refresh");
    const rest = await Promise.all(Array.from({ length: 20 }, () => send("refresh")));
    assert.equal(engineCalls, 1);
    assert.ok(rest.every((r) => r.data.cooledDown === true));
});

test("the window reopens once the cooldown has passed", async () => {
    engineCalls = 0;
    session.clear();
    await send("refresh");
    // Backdate the stamp rather than sleeping for the real window.
    session.set("lastRefreshAt", Date.now() - DEFAULTS.refreshCooldownMs - 1);
    const again = await send("refresh");
    assert.equal(again.data.cooledDown, undefined);
    assert.equal(engineCalls, 2);
});

test("the reply carries the window, so the popup needs no copy of the constant", async () => {
    session.clear();
    const r = await send("refresh");
    assert.equal(r.data.cooldownMs, DEFAULTS.refreshCooldownMs);
});
