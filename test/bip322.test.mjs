// BIP-322 construction, pinned by the official vectors from the BIP, with no library.
// The vectors cover the tag, the scriptPubKey and the transaction serialization.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildVirtualTxs, scriptPubKeyOf, decodeAddress, taggedHash, hex, BIP322_TAG }
    from "../lib/bip322.js";

// vector address from the BIP-322 spec (P2WPKH)
const ADDR = "bc1q9vza2e8x573nczrlzms0wvx3gsqjx7vavgkx0l";
const txid = (internal) => hex.to(internal.slice().reverse());

test("the tag is BIP0322-signed-message", () => {
    assert.equal(BIP322_TAG, "BIP0322-signed-message");
});

test("official vector: to_spend txid for the empty message", async () => {
    const { toSpendTxid } = await buildVirtualTxs(ADDR, "");
    assert.equal(txid(toSpendTxid), "c5680aa69bb8d860bf82d4e9cd3504b55dde018de765a91bb566283c545a99a7");
});

test("official vector: to_spend txid for \"Hello World\"", async () => {
    const { toSpendTxid } = await buildVirtualTxs(ADDR, "Hello World");
    assert.equal(txid(toSpendTxid), "b79d196740ad5217771c1098fc4a4b51e0535c32236c71f1ea4d61a2d603352b");
});

test("a P2WPKH address decodes to v0 and 20 bytes", () => {
    const d = decodeAddress(ADDR);
    assert.equal(d.version, 0);
    assert.equal(d.program.length, 20);
    assert.equal(hex.to(scriptPubKeyOf(ADDR)).slice(0, 4), "0014");
});

test("a P2TR address decodes to v1 and 32 bytes, scriptPubKey starts with 5120", () => {
    const tr = "bcrt1plqhzpzvndkcyqw3xj3f98r6kx2ev2p38l6wj82d7zx2c6cnvjcqqunnd4l";
    const d = decodeAddress(tr);
    assert.equal(d.version, 1);
    assert.equal(d.program.length, 32);
    assert.equal(hex.to(scriptPubKeyOf(tr)).slice(0, 4), "5120");
});

test("an address with a bad checksum is rejected", async () => {
    // last character changed
    const bad = "bcrt1plqhzpzvndkcyqw3xj3f98r6kx2ev2p38l6wj82d7zx2c6cnvjcqqunnd4m";
    assert.throws(() => decodeAddress(bad), /checksum/);
});

test("the v0 checksum constant must not validate a v1 address", () => {
    // A valid v1 address flipped to v0 (q): the checksum no longer matches.
    const tr = "bcrt1plqhzpzvndkcyqw3xj3f98r6kx2ev2p38l6wj82d7zx2c6cnvjcqqunnd4l";
    const tampered = tr.replace("bcrt1p", "bcrt1q");
    assert.throws(() => decodeAddress(tampered));
});

test("the message is hashed verbatim: one extra space is a different hash", async () => {
    const a = await taggedHash(BIP322_TAG, new TextEncoder().encode("hi"));
    const b = await taggedHash(BIP322_TAG, new TextEncoder().encode("hi "));
    assert.notEqual(hex.to(a), hex.to(b));
});

test("to_sign spends to_spend output 0 and has a single OP_RETURN output", async () => {
    const { toSign, toSpendTxid } = await buildVirtualTxs(ADDR, "x");
    const h = hex.to(toSign);
    assert.ok(h.startsWith("00000000" + "01" + hex.to(toSpendTxid) + "00000000"), "wrong prevout");
    assert.ok(h.endsWith("01" + "0000000000000000" + "01" + "6a" + "00000000"), "output is not a single OP_RETURN");
});
