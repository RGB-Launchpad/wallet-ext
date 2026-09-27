// What the asset index may and may not do to what the wallet shows.

import { test } from "node:test";
import assert from "node:assert/strict";
import { describe } from "../lib/registry.js";

const ASSETS = [
    { contract_id: "rgb:aaa", ticker: "USDT", name: "Example Dollar", status: { issuer_signed: true, issuer_verified: true, listed_by: [{ publisher: "signet:x" }] } },
    { contract_id: "rgb:bbb", ticker: "usdt", name: "Lookalike", status: { listed_by: [{ publisher: "signet:x" }] } },
    { contract_id: "rgb:ccc", ticker: "RGBT", name: "Other", status: { issuer_signed: true, dispute: { state: "disputed" } } },
];

test("an index with nothing to say leaves the wallet as it was", () => {
    assert.equal(describe(null, "rgb:aaa", "USDT"), null);
});

test("an unregistered asset is neither trusted nor condemned", () => {
    const d = describe(ASSETS, "rgb:zzz", "NEW");
    assert.equal(d.registered, false);
    assert.equal(d.issuerSigned, false);
    assert.equal(d.issuerVerified, false);
    assert.deepEqual(d.sameTicker, []);
});

test("statuses stay separate: signed is not verified, verified is not reviewed", () => {
    const d = describe(ASSETS, "rgb:aaa", "USDT");
    assert.equal(d.issuerSigned, true);
    assert.equal(d.issuerVerified, true);
    assert.equal(d.issuerIdentified, false);
    assert.ok(!("verified" in d), "no single combined verdict");
});

test("a ticker clash is found whatever the case, and never lists the asset itself", () => {
    const d = describe(ASSETS, "rgb:aaa", "USDT");
    assert.deepEqual(d.sameTicker, ["rgb:bbb"]);
    const other = describe(ASSETS, "rgb:bbb", "usdt");
    assert.deepEqual(other.sameTicker, ["rgb:aaa"]);
});

test("an accepted complaint is carried through", () => {
    assert.equal(describe(ASSETS, "rgb:ccc", "RGBT").disputed, true);
    assert.equal(describe(ASSETS, "rgb:aaa", "USDT").disputed, false);
});
