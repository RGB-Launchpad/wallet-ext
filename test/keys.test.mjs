// Key export derivation. What this pins: the Bitcoin key shown for export is the BIP86
// key of the wallet's single address, checked against the BIP32 and BIP86 official test
// vectors, and its WIF against the standard vector. A wrong derivation here would hand
// the user a key that controls nothing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { seedFromMnemonic, masterFromSeed, derive, btcKey, toWif, xOnlyPubHex, outputKeyHex } from "../lib/keys.js";

// BIP86 test vectors, mnemonic and keys as published there.
const MNEMONIC = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
const HARD = 0x80000000;
const PATH_86_0 = [86 | HARD, 0 | HARD, 0 | HARD, 0, 0];

test("the BIP39 seed matches the published vector", async () => {
    const seed = await seedFromMnemonic(MNEMONIC);
    assert.equal(
        [...seed].map((b) => b.toString(16).padStart(2, "0")).join(""),
        "5eb00bbddcf069084889a8ab9155568165f5c453ccb85e70811aaed6f6da5fc19a5ac40b389cd370d086206dec8aa6c43daea6690f20ad3d8d48b2d2ce9e38e4",
    );
});

const hex = (n) => n.toString(16).padStart(64, "0");

test("the master key matches the BIP86 root xprv", async () => {
    const seed = await seedFromMnemonic(MNEMONIC);
    const { priv } = await masterFromSeed(seed);
    assert.equal(hex(priv), "1837c1be8e2995ec11cda2b066151be2cfb48adf9e47b151d46adab3a21cdf67");
});

test("m/86'/0'/0' matches the BIP86 account xprv", async () => {
    const seed = await seedFromMnemonic(MNEMONIC);
    const priv = await derive(seed, [86 | HARD, 0 | HARD, 0 | HARD]);
    assert.equal(hex(priv), "9043214d33a3c162a9a825d26b2a1c381455a72306ed17857f55ea65b7dd20da");
});

test("the first receiving key matches BIP86 vector 1", async () => {
    const seed = await seedFromMnemonic(MNEMONIC);
    const priv = await derive(seed, PATH_86_0);
    assert.equal(hex(priv), "41f41d69260df4cf277826a9b65a3717e4eeddbeedf637f212ca096576479361");
    // The internal key the taproot address commits to.
    assert.equal(xOnlyPubHex(priv), "cc8a4bc64d897bddc5fbc2f670f7a8ba0b386779106cf1223c6fc5d7cd6fc115");
    // The tweaked output key — what the address script actually holds.
    assert.equal(await outputKeyHex(priv), "a60869f0dbcf1dc659c9cecbaf8050135ea9e8cdc487053f1dc6880949dc684c");
});

test("the second receiving key matches BIP86 vector 2", async () => {
    const seed = await seedFromMnemonic(MNEMONIC);
    const priv = await derive(seed, [86 | HARD, 0 | HARD, 0 | HARD, 0, 1]);
    assert.equal(xOnlyPubHex(priv), "83dfe85a3151d2517290da461fe2815591ef69f2b18a2ce63f01697a8b313145");
});

test("WIF matches the standard vector", async () => {
    const wif = await toWif(0x0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1dn, "Mainnet");
    assert.equal(wif, "KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvP98617");
});

test("mainnet takes coin type 0, every other network coin type 1", async () => {
    const main = await btcKey(MNEMONIC, "Mainnet");
    assert.equal(main.pathText, "m/86'/0'/0'/0/0");
    assert.equal(hex(main.priv), "41f41d69260df4cf277826a9b65a3717e4eeddbeedf637f212ca096576479361");
    // WIF network bytes: 0x80 mainnet, 0xEF otherwise.
    assert.ok(/^[KL]/.test(main.wif), "mainnet WIF starts with K or L");
    const signet = await btcKey(MNEMONIC, "Signet");
    assert.equal(signet.pathText, "m/86'/1'/0'/0/0");
    assert.ok(signet.wif.startsWith("c"), "testnet-family WIF starts with c");
    assert.notEqual(hex(signet.priv), hex(main.priv));
});

test("the passphrase moves the key, as BIP39 says it must", async () => {
    const a = await btcKey(MNEMONIC, "Mainnet");
    const b = await btcKey(MNEMONIC, "Mainnet", "TREZOR");
    assert.notEqual(hex(a.priv), hex(b.priv));
});
