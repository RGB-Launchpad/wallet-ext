// Allocation slot rules: when slots may be created, how many, and how a failed send is
// reported.
import { test } from "node:test";
import assert from "node:assert/strict";
import { slotBlocker, slotCost, usableEmptySlots, slotsToCreate, explainSendError } from "../lib/slots.js";
import { DEFAULTS, LIMITS } from "../config.js";

const SIZE = DEFAULTS.utxoSizeSat;
const principal = BigInt(DEFAULTS.utxoNum) * BigInt(SIZE);

/** A UTXO as `listUnspents` returns it. */
const utxo = ({ sats = SIZE, colorable = true, exists = true, allocations = 0, pending = 0 } = {}) => ({
    utxo: { outpoint: { txid: "00", vout: 0 }, btcAmount: String(sats), colorable, exists },
    rgbAllocations: Array.from({ length: allocations }, () => ({ assetId: "rgb:x", settled: true })),
    pendingBlinded: pending,
});

// ---- cost and blocker ----

test("the cost covers the slots themselves plus the fee at that rate", () => {
    assert.equal(slotCost(100n), principal + 100n * BigInt(LIMITS.prepareVsize));
});

test("the cost scales with the number of slots asked for", () => {
    assert.equal(slotCost(30n, 1), BigInt(SIZE) + 30n * BigInt(LIMITS.prepareVsize));
});

test("the cost never drops below the absolute floor", () => {
    assert.ok(slotCost(1n, 1) >= BigInt(LIMITS.minSatToPrepare));
});

test("a fully confirmed, well funded wallet is allowed through", () => {
    assert.equal(slotBlocker({ settled: "10000000", spendable: "10000000" }, 30n), null);
});

test("any unconfirmed input blocks the batch, however small", () => {
    const r = slotBlocker({ settled: "10000000", spendable: "10000001" }, 30n);
    assert.match(r, /1 sats to confirm/);
});

test("unconfirmed is reported before insufficient funds: it is the actionable one", () => {
    const r = slotBlocker({ settled: "0", spendable: "500000" }, 30n);
    assert.match(r, /to confirm/);
    assert.doesNotMatch(r, /Fund its Bitcoin address/);
});

test("confirmed but short says how much is needed and at what rate", () => {
    const r = slotBlocker({ settled: "1000", spendable: "1000" }, 30n);
    assert.match(r, new RegExp(String(slotCost(30n))));
    assert.match(r, /30 sat\/vB/);
});

test("a higher fee rate raises the bar", () => {
    const exact = slotCost(1n);
    const bal = { settled: String(exact), spendable: String(exact) };
    assert.equal(slotBlocker(bal, 1n), null);
    assert.match(slotBlocker(bal, 300n), /Not enough/);
});

// ---- which slots count ----

test("a slot must carry enough sats to pay for being spent", () => {
    // Each slot has to hold more than one send at the fee floor costs: ~154 vB at 30 sat/vB.
    assert.ok(SIZE > 154 * 30, `utxoSizeSat ${SIZE} cannot pay a send at the fee floor`);
});

test("small empty slots do not count, so a wallet built with them gets new ones", () => {
    // The asset on one small slot, two small empty slots beside it: every send fails on fees.
    const wallet = [utxo({ sats: 2000, allocations: 1 }), utxo({ sats: 2000 }), utxo({ sats: 2000 })];
    assert.equal(usableEmptySlots(wallet), 0);
    assert.equal(slotsToCreate(wallet), DEFAULTS.utxoNum);
});

test("room on a UTXO that already holds an asset is not an empty slot", () => {
    assert.equal(usableEmptySlots([utxo({ allocations: 1 })]), 0);
});

test("enough usable empty slots means nothing to create", () => {
    const wallet = Array.from({ length: DEFAULTS.utxoNum }, () => utxo());
    assert.equal(slotsToCreate(wallet), 0);
});

test("only the shortfall is created", () => {
    assert.equal(slotsToCreate([utxo(), utxo({ allocations: 1 })]), DEFAULTS.utxoNum - 1);
});

test("vanilla, unbroadcast and pending-receive UTXOs are not empty slots", () => {
    assert.equal(usableEmptySlots([
        utxo({ colorable: false }), utxo({ exists: false }), utxo({ pending: 1 }),
    ]), 0);
});

test("sat amounts are read whether the bindings hand back a string or a BigInt", () => {
    const big = utxo(); big.utxo.btcAmount = BigInt(SIZE);
    assert.equal(usableEmptySlots([big, utxo()]), 2);
});

// ---- send errors ----

test("rgb-lib's allocation error on a send names the real shortfall and the rate", () => {
    const r = explainSendError("Insufficient allocations", 30n);
    assert.match(r, /cannot pay the fee at 30 sat\/vB/);
    assert.match(r, /Create slots/);
});

test("any other send error passes through unchanged", () => {
    assert.equal(explainSendError("Invalid invoice", 30n), "Invalid invoice");
});
