/**
 * Runs tasks one at a time, in the order they arrive.
 *
 * NOTE: every rgb-lib binding takes a mutable borrow of the wallet for the whole call, and the
 * async ones (`sync`, sends) hold it across their awaits. A second command arriving mid-sync
 * panics inside rgb-lib with BorrowMutError — `[rgb-lib WASM panic] at lib.rs:425` — and a wasm
 * panic leaves the engine unusable until it is reopened. Callers cannot coordinate: the popup,
 * an approval window and a connected page all talk to the same engine.
 *
 * A rejected task must not stall the queue, so the tail swallows the outcome; the caller still
 * gets the original promise.
 */
export function serialQueue() {
    let tail = Promise.resolve();
    return (fn) => {
        const run = tail.then(fn);
        tail = run.then(() => {}, () => {});
        return run;
    };
}
