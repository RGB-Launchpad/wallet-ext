// The reset deletes snapshots by key prefix, so the prefix has to match the key rgb-lib writes
// and must never reach another network's snapshot.
import { test } from "node:test";
import assert from "node:assert/strict";
import { dataDirOf, snapshotPrefix, isChainMismatch, RESETTABLE } from "../lib/chain.js";

test("a network's prefix covers its own snapshot and no other network's", () => {
    // rgb-lib keys a snapshot by `<dataDir>/<master fingerprint>`.
    const regtest = `${dataDirOf("Regtest")}/1a2b3c4d`;
    const signet = `${dataDirOf("Signet")}/1a2b3c4d`;
    assert.ok(regtest.startsWith(snapshotPrefix("Regtest")));
    assert.ok(!signet.startsWith(snapshotPrefix("Regtest")));
});

test("recognises BDK's error for a replaced chain", () => {
    assert.ok(isChainMismatch("Failed bdk sync: introduced chain cannot connect with the original chain, try include height 5318"));
    assert.ok(!isChainMismatch("Indexer unreachable: timeout"));
    assert.ok(!isChainMismatch(undefined));
});

test("only Regtest can be reset", () => {
    assert.ok(RESETTABLE.has("Regtest"));
    assert.ok(!RESETTABLE.has("Signet"));
    assert.ok(!RESETTABLE.has("Testnet4"));
});
