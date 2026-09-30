// How the provider reaches the page when another wallet extension is also installed.
//
// What this pins: `window.rgb` is a name several RGB wallets install, non-configurable, at
// document_start. Whoever runs second cannot have it. Losing the name silently is acceptable;
// throwing over it is not, and neither is becoming unreachable, so the provider is also
// installed under its own name and announced with an `rdns` that identifies this wallet.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { SITE } from "../config.js";

const source = readFileSync(new URL("../inject.js", import.meta.url), "utf8");

/** Runs inject.js against a fresh page, and collects what it announces. */
function run({ rgbTaken = false } = {}) {
    const announced = [];
    const handlers = new Map();
    const window = {
        addEventListener(type, cb) {
            if (!handlers.has(type)) handlers.set(type, new Set());
            handlers.get(type).add(cb);
        },
        dispatchEvent(ev) {
            if (ev.type === "rgb:announceProvider") announced.push(ev.detail);
            for (const cb of handlers.get(ev.type) || []) cb(ev);
            return true;
        },
        location: { origin: SITE.origin },
        postMessage() {},
    };
    if (rgbTaken) {
        const other = Object.freeze({ isOtherWallet: true });
        Object.defineProperty(window, "rgb", { value: other, writable: false, configurable: false });
    }
    const context = vm.createContext({
        window,
        crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000000" },
        CustomEvent: class {
            constructor(type, init) { this.type = type; this.detail = init?.detail; }
        },
    });
    vm.runInContext(source, context);
    return { window, announced, request: () => window.dispatchEvent({ type: "rgb:requestProvider" }) };
}

test("on a page where the name is free, the provider takes it", () => {
    const { window } = run();
    assert.equal(window.rgb.isRgbWallet, true);
    assert.equal(typeof window.rgb.signMessage, "function");
});

test("the provider is also installed under its own name", () => {
    const { window } = run();
    assert.equal(window.darkhorse, window.rgb);
});

test("another wallet holding `window.rgb` neither throws nor hides this one", () => {
    const { window } = run({ rgbTaken: true });
    assert.equal(window.rgb.isOtherWallet, true, "the wallet that got there first keeps the name");
    assert.equal(window.darkhorse.isRgbWallet, true, "this wallet is still reachable");
});

test("the wallet announces itself, with an rdns that names it", () => {
    for (const rgbTaken of [false, true]) {
        const { announced } = run({ rgbTaken });
        assert.equal(announced.length, 1);
        assert.equal(announced[0].info.rdns, "fun.dhorse.wallet");
        assert.equal(announced[0].info.name, "Darkhorse Wallet");
        assert.equal(announced[0].provider.isRgbWallet, true);
    }
});

// A page that loads after the extension has already announced has to be able to ask again,
// or it sees nothing and reports the wallet as not installed.
test("a request from the page is answered with another announcement", () => {
    const { announced, request } = run();
    request();
    request();
    assert.equal(announced.length, 3);
    assert.equal(announced[2].info.rdns, "fun.dhorse.wallet");
});

// Signing is the only thing the page may ask of the key. A general PSBT signature would let a
// page spend a UTXO carrying assets, which destroys them.
test("the announced provider offers no PSBT signing", () => {
    const { announced } = run();
    assert.equal(announced[0].provider.signPsbt, undefined);
});
