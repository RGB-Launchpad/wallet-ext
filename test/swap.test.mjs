// Which output a swap pays from.
import { test } from "node:test";
import assert from "node:assert/strict";
import { pickSwapInput, pickSellerInput, sellerPayout, sellable } from "../lib/swap.js";

/** An output as `listUnspentsVanilla` returns it, trimmed to what matters (shape seen on regtest). */
const out = (vout, sats, { spent = false, bigint = false } = {}) => ({
    outpoint: `8fbd3bfa4fd0935d73dc1098bde5b6f9fcd2d669faf8da897345d7ebf52fbbc8:${vout}`,
    txout: { value: bigint ? BigInt(sats) : String(sats), script_pubkey: "5120" + "a4".repeat(32) },
    keychain: "Internal",
    is_spent: spent,
});

test("picks the smallest output that covers the need", () => {
    const r = pickSwapInput([out(0, 200000), out(1, 70000), out(2, 50000)], 60000);
    assert.deepEqual(r, { outpoint: out(1, 0).outpoint, sats: "70000" });
});

test("an output holding exactly the need leaves nothing for change and is skipped", () => {
    assert.equal(pickSwapInput([out(0, 60000)], 60000), null);
});

test("spent outputs are skipped", () => {
    assert.equal(pickSwapInput([out(0, 200000, { spent: true })], 1000), null);
});

test("a BigInt value from the engine is read the same as a string", () => {
    assert.equal(pickSwapInput([out(0, 200000, { bigint: true })], 1000).sats, "200000");
});

test("an empty or missing list yields null rather than throwing", () => {
    assert.equal(pickSwapInput([], 1), null);
    assert.equal(pickSwapInput(undefined, 1), null);
});


/** An unspent as `listUnspents` returns it. */
const colored = (vout, sats, allocations) => ({
    utxo: { outpoint: { txid: "ab".repeat(32), vout }, btcAmount: String(sats), colorable: true, exists: true },
    rgbAllocations: allocations,
});
const alloc = (assetId, n, settled = true) => ({ assetId, assignment: { Fungible: String(n) }, settled });

test("the seller colours from the smallest holding that covers the amount", () => {
    const u = [
        colored(0, 20000, [alloc("rgb:a", 1000)]),
        colored(1, 20000, [alloc("rgb:a", 300)]),
        colored(2, 20000, [alloc("rgb:a", 50)]),
    ];
    assert.deepEqual(pickSellerInput(u, "rgb:a", 200), { outpoint: `${"ab".repeat(32)}:1`, sats: "20000" });
});

test("unsettled, other assets and too little are not picked", () => {
    const u = [
        colored(0, 20000, [alloc("rgb:a", 1000, false)]),
        colored(1, 20000, [alloc("rgb:b", 1000)]),
        colored(2, 20000, [alloc("rgb:a", 10)]),
    ];
    assert.equal(pickSellerInput(u, "rgb:a", 200), null);
});

test("the seller is paid the price plus its input beyond the seal", () => {
    assert.equal(sellerPayout(110352, 20000, 1000), 129352n);
    assert.equal(sellerPayout(110352, 1000, 1000), 110352n);
    assert.throws(() => sellerPayout(1, 500, 1000));
});

test("what can be sold: the settled total, and the largest single holding as the most one offer can ask", () => {
    const u = [
        colored(0, 20000, [alloc("rgb:a", 300)]),
        colored(1, 20000, [alloc("rgb:a", 700), alloc("rgb:b", 5)]),
        colored(2, 20000, [alloc("rgb:a", 900, false)]),
    ];
    assert.deepEqual(sellable(u, "rgb:a"), { total: "1000", max: "700" });
    assert.deepEqual(sellable([], "rgb:a"), { total: "0", max: "0" });
});
