// Which output a swap pays from.
import { test } from "node:test";
import assert from "node:assert/strict";
import { pickSwapInput } from "../lib/swap.js";

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
