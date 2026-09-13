// Vault encryption, run in Node: Web Crypto is the same API there.
import { test } from "node:test";
import assert from "node:assert/strict";
import { seal, unseal, rekey, VAULT } from "../lib/vault.js";

globalThis.btoa ??= (s) => Buffer.from(s, "binary").toString("base64");
globalThis.atob ??= (s) => Buffer.from(s, "base64").toString("binary");

// BIP39's own test vector (all-zero entropy). A valid twelve-word mnemonic with a correct
// checksum, so it exercises the real format — but the most recognisable test seed there is,
// which matters in a public wallet repository: nobody has to wonder whose phrase this is.
const M = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
// Long enough that the leak check below cannot match it inside base64 by chance.
const PW = "correct-horse-battery-staple";
// 1000 iterations: enough to exercise the code, fast enough for a dozen cases.
const FAST = { ...VAULT.KDF_DEFAULT, iterations: 1000 };

test("seals and unseals", async () => {
    const v = await seal(M, "pw", FAST);
    assert.equal(await unseal(v, "pw"), M);
});

test("the vault never contains the plaintext", async () => {
    const v = await seal(M, PW, FAST);
    const s = JSON.stringify(v);
    assert.ok(!s.includes("abandon"), "phrase leaked into the vault");
    assert.ok(!s.includes(PW), "password leaked into the vault");
});

test("a wrong password fails without saying why", async () => {
    const v = await seal(M, "pw", FAST);
    await assert.rejects(() => unseal(v, "pw2"), /Wrong password/);
});

test("salt and IV differ every time, so the same phrase never yields the same ciphertext", async () => {
    const a = await seal(M, "pw", FAST);
    const b = await seal(M, "pw", FAST);
    assert.notEqual(a.kdf.salt, b.kdf.salt);
    assert.notEqual(a.cipher.iv, b.cipher.iv);
    assert.notEqual(a.ct, b.ct);
});

test("KDF parameters travel with the ciphertext, so old vaults still open", async () => {
    const old = await seal(M, "pw", { name: "PBKDF2", hash: "SHA-256", iterations: 500 });
    assert.equal(old.kdf.iterations, 500);
    assert.equal(await unseal(old, "pw"), M);   // even after the default moved to 600k
});

test("flipping one ciphertext byte fails the authentication tag", async () => {
    const v = await seal(M, "pw", FAST);
    const raw = Buffer.from(v.ct, "base64");
    raw[0] ^= 0xff;
    v.ct = raw.toString("base64");
    await assert.rejects(() => unseal(v, "pw"), /Wrong password/);
});

test("after a password change the old password no longer opens it", async () => {
    const v = await seal(M, "old", FAST);
    const v2 = await rekey({ ...v }, "old", "new");
    assert.equal(await unseal(v2, "new"), M);
    await assert.rejects(() => unseal(v2, "old"), /Wrong password/);
});

test("empty phrase or password is rejected", async () => {
    await assert.rejects(() => seal("", "pw", FAST), /required/);
    await assert.rejects(() => seal(M, "", FAST), /required/);
});

test("an unknown vault version is rejected rather than guessed", async () => {
    const v = await seal(M, "pw", FAST);
    await assert.rejects(() => unseal({ ...v, v: 99 }, "pw"), /version/);
});
