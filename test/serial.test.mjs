import { test } from "node:test";
import assert from "node:assert/strict";
import { serialQueue } from "../lib/serial.js";

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

test("never runs two tasks at once, however they overlap", async () => {
    const q = serialQueue();
    let live = 0, peak = 0;
    const task = async () => {
        live += 1; peak = Math.max(peak, live);
        await wait(5);                 // an engine call holds the wallet across its awaits
        live -= 1;
    };
    await Promise.all([q(task), q(task), q(task), q(task)]);
    assert.equal(peak, 1);
});

test("keeps the order tasks arrived in", async () => {
    const q = serialQueue();
    const order = [];
    const task = (n, ms) => q(async () => { await wait(ms); order.push(n); });
    await Promise.all([task(1, 12), task(2, 1), task(3, 6)]);
    assert.deepEqual(order, [1, 2, 3]);
});

test("a failed task neither stalls the queue nor swallows its own error", async () => {
    const q = serialQueue();
    const failing = q(async () => { throw new Error("boom"); });
    await assert.rejects(failing, /boom/);
    assert.equal(await q(async () => "after"), "after");
});
