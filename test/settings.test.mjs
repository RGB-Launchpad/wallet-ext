// Endpoints are per network and must survive switching between them.
import { test } from "node:test";
import assert from "node:assert/strict";
import { migrate, resolve, apply, netDefaults } from "../lib/settings.js";
import { NETWORKS } from "../config.js";

test("a fresh install resolves to that network's defaults", () => {
    const { raw } = migrate(undefined);
    const s = resolve(raw, "Regtest");
    assert.equal(s.network, "Regtest");
    assert.equal(s.esploraUrl, netDefaults("Regtest").esploraUrl);
    assert.equal(s.proxyUrl, netDefaults("Regtest").proxyUrl);
});

test("endpoints saved for one network do not reach the other", () => {
    let { raw } = migrate(undefined);
    raw = apply(raw, { network: "Signet", proxyUrl: "rpcs://mine.example/json-rpc", esploraUrl: "https://e.example/api" });
    raw = apply(raw, { network: "Regtest", proxyUrl: "rpc://127.0.0.1:3000/json-rpc" });

    assert.equal(resolve(raw, "Signet").proxyUrl, "rpcs://mine.example/json-rpc");
    assert.equal(resolve(raw, "Regtest").proxyUrl, "rpc://127.0.0.1:3000/json-rpc");
    // The Signet indexer is untouched by the Regtest save.
    assert.equal(resolve(raw, "Signet").esploraUrl, "https://e.example/api");
    assert.equal(resolve(raw, "Regtest").esploraUrl, netDefaults("Regtest").esploraUrl);
});

test("switching back and forth keeps both sides", () => {
    let { raw } = migrate(undefined);
    raw = apply(raw, { network: "Signet", proxyUrl: "rpcs://mine.example/json-rpc" });
    raw = apply(raw, { network: "Regtest", proxyUrl: "rpc://127.0.0.1:3000/json-rpc" });
    raw = apply(raw, { network: "Signet" });                 // switch back, no edits
    assert.equal(raw.network, "Signet");
    assert.equal(resolve(raw).proxyUrl, "rpcs://mine.example/json-rpc");
    assert.equal(resolve(raw, "Regtest").proxyUrl, "rpc://127.0.0.1:3000/json-rpc");
});

test("anything that is not an endpoint stays global", () => {
    let { raw } = migrate(undefined);
    // Any key outside PER_NETWORK.
    raw = apply(raw, { network: "Signet", someGlobalPreference: 30 });
    assert.equal(resolve(raw, "Regtest").someGlobalPreference, 30);
});

test("the old flat layout migrates into the network it was configured for", () => {
    const stored = { network: "Regtest", proxyUrl: "rpc://127.0.0.1:3000/json-rpc",
        esploraUrl: "http://127.0.0.1:8095/regtest/api", someGlobalPreference: 15 };
    const { raw, changed } = migrate(stored);
    assert.equal(changed, true);
    assert.equal(raw.byNetwork.Regtest.esploraUrl, "http://127.0.0.1:8095/regtest/api");
    assert.equal(resolve(raw, "Regtest").proxyUrl, "rpc://127.0.0.1:3000/json-rpc");
    // Not leaked onto the other network; the global key is kept.
    assert.equal(resolve(raw, "Signet").proxyUrl, netDefaults("Signet").proxyUrl);
    assert.equal(raw.someGlobalPreference, 15);
    // The flat keys are gone.
    assert.equal(raw.proxyUrl, undefined);
});

test("migration runs once", () => {
    const { raw } = migrate({ network: "Signet", esploraUrl: "https://a.example/api" });
    const second = migrate(raw);
    assert.equal(second.changed, false);
    assert.deepEqual(second.raw.byNetwork, raw.byNetwork);
});

test("a pinned copy of a retired default gives way to the current one", () => {
    // What storage looks like for anyone who pressed Save while the old hosts were the defaults.
    const stored = { network: "Signet", byNetwork: {
        Signet: { proxyUrl: "rpcs://rgb-proxy.flatland.app/json-rpc" },
        Regtest: { proxyUrl: "rpcs://rgb-regtest-proxy.flatland.app/json-rpc",
            esploraUrl: "https://rgb-regtest-indexer.flatland.app/regtest/api" },
    } };
    const { raw, changed } = migrate(stored);
    assert.equal(changed, true);
    assert.equal(resolve(raw, "Signet").proxyUrl, netDefaults("Signet").proxyUrl);
    assert.equal(resolve(raw, "Regtest").proxyUrl, netDefaults("Regtest").proxyUrl);
    assert.equal(resolve(raw, "Regtest").esploraUrl, netDefaults("Regtest").esploraUrl);
    // The caller's object is not edited underneath it.
    assert.equal(stored.byNetwork.Signet.proxyUrl, "rpcs://rgb-proxy.flatland.app/json-rpc");
    // Idempotent: nothing left to drop on the next start-up.
    assert.equal(migrate(raw).changed, false);
});

test("an endpoint the user chose is never dropped as retired", () => {
    const stored = { network: "Signet", byNetwork: { Signet: { proxyUrl: "rpcs://mine.example/json-rpc" } } };
    const { raw, changed } = migrate(stored);
    assert.equal(changed, false);
    assert.equal(resolve(raw, "Signet").proxyUrl, "rpcs://mine.example/json-rpc");
});

test("an empty string is a real value, not a fallback to the default", () => {
    let { raw } = migrate(undefined);
    raw = apply(raw, { network: "Signet", proxyUrl: "" });
    assert.equal(resolve(raw, "Signet").proxyUrl, "");
});

test("every network has the endpoints the resolver needs", () => {
    for (const [name, n] of Object.entries(NETWORKS)) {
        assert.ok(n.label, `${name} has no label`);
        const d = netDefaults(name);
        assert.match(d.esploraUrl, /^https?:\/\//, `${name} indexer`);
        assert.match(d.proxyUrl, /^rpcs?:\/\//, `${name} proxy`);
    }
});

test("endpoints stay isolated across every configured network", () => {
    let { raw } = migrate(undefined);
    const names = Object.keys(NETWORKS);
    for (const n of names) raw = apply(raw, { network: n, esploraUrl: `https://${n}.example/api` });
    for (const n of names) assert.equal(resolve(raw, n).esploraUrl, `https://${n}.example/api`);
});
