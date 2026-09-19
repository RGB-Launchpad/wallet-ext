// Fee bidding. The bug this guards against: a quiet-looking network produced a 1 sat/vB bid
// while blocks were clearing at 4, and the transaction never confirmed.
import { test } from "node:test";
import assert from "node:assert/strict";
import { clearingRate, bid } from "../lib/fee.js";
import { FEE, DEFAULTS, feeFor } from "../config.js";

const B = FEE.blockVsize;

test("an empty mempool needs nothing outbid", () => {
    assert.equal(clearingRate([]), 0);
    assert.equal(clearingRate(undefined), 0);
});

test("a queue smaller than one block needs nothing outbid", () => {
    assert.equal(clearingRate([[12, 60_000], [3, 70_000], [1.2, 52_000]]), 0);
});

test("a queue deeper than one block returns the band that fills it", () => {
    // 400k + 400k + 400k: the block is full partway through the third band.
    assert.equal(clearingRate([[50, 400_000], [20, 400_000], [7, 400_000], [1, 400_000]]), 7);
});

test("the band that exactly reaches one block is the one that counts", () => {
    assert.equal(clearingRate([[50, B / 2], [9, B / 2], [1, B]]), 9);
});

test("a bid never goes below the floor, however quiet the network looks", () => {
    // The real signet reading from 2026-09-11: estimate 0.1, queue fits in a block.
    assert.equal(bid([0, 0.1]), FEE.min);
    assert.equal(bid([]), FEE.min);
    assert.ok(FEE.min > 4.07, "the floor must clear what signet blocks were taking that day");
});

test("a busy queue lifts the bid above the floor", () => {
    assert.equal(bid([30]), Math.min(FEE.max, 30 * FEE.safety));
});

test("a spam burst cannot price the wallet out of sending", () => {
    assert.equal(bid([100_000]), FEE.max);
});

test("missing signals are dropped, not treated as zero-or-NaN", () => {
    assert.equal(bid([NaN, undefined, null, 30]), Math.min(FEE.max, 30 * FEE.safety));
    assert.equal(bid([NaN]), FEE.min);
});

test("the bid is a whole number: rgb-lib takes an integer rate", () => {
    const b = bid([4.07]);
    assert.equal(b, Math.round(b));
});

// Mainnet spends real coins, so it bids near the market instead of three times over it.
const MAIN = feeFor("Mainnet");

test("mainnet bids near the clearing rate, not the test-network floor", () => {
    assert.equal(bid([1, 1.5], MAIN), MAIN.min);
    assert.ok(MAIN.min < FEE.min);
    assert.equal(bid([10], MAIN), Math.ceil(10 * MAIN.safety));
    assert.equal(bid([100_000], MAIN), MAIN.max);
});

test("mainnet's cap is payable from one slot: an RGB send pays its fee from colored UTXOs only", () => {
    assert.ok(MAIN.max * 154 <= DEFAULTS.utxoSizeSat);
});

test("a network without overrides bids like before", () => {
    assert.deepEqual(feeFor("Signet"), FEE);
    assert.deepEqual(feeFor("NoSuchNet"), FEE);
});
