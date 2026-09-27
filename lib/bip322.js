// Construction side of BIP-322 simple signatures: address decoding, transaction
// serialization, PSBT v0 encoding and witness serialization. The only cryptography is
// SHA-256 from Web Crypto; the wallet produces the signature itself.
//
// Follows BIP-322 (simple) and BIP-174 (PSBT v0).

const enc = new TextEncoder();

const sha256 = async (bytes) => new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
const dsha256 = async (bytes) => sha256(await sha256(bytes));

export const hex = {
    to: (b) => [...b].map((x) => x.toString(16).padStart(2, "0")).join(""),
    from: (s) => Uint8Array.from(s.match(/.{1,2}/g).map((x) => parseInt(x, 16))),
};

export const b64 = {
    to: (b) => btoa(String.fromCharCode(...b)),
    from: (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0)),
};

const cat = (...arrs) => {
    const out = new Uint8Array(arrs.reduce((n, a) => n + a.length, 0));
    let o = 0;
    for (const a of arrs) { out.set(a, o); o += a.length; }
    return out;
};

/** Bitcoin compact size integer. */
function varint(n) {
    if (n < 0xfd) return new Uint8Array([n]);
    if (n <= 0xffff) return new Uint8Array([0xfd, n & 0xff, (n >> 8) & 0xff]);
    if (n <= 0xffffffff) return new Uint8Array([0xfe, n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >>> 24) & 0xff]);
    throw new Error("varint too large");
}
const u32le = (n) => new Uint8Array([n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >>> 24) & 0xff]);
const u64le = (v) => {
    const out = new Uint8Array(8);
    let n = BigInt(v);
    for (let i = 0; i < 8; i++) { out[i] = Number(n & 0xffn); n >>= 8n; }
    return out;
};
const withLen = (b) => cat(varint(b.length), b);

// ---------- bech32 / bech32m decoding ----------
// Needed to build the scriptPubKey from an address.
const CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

function polymod(values) {
    let chk = 1;
    for (const v of values) {
        const top = chk >> 25;
        chk = ((chk & 0x1ffffff) << 5) ^ v;
        for (let i = 0; i < 5; i++) if ((top >> i) & 1) chk ^= GEN[i];
    }
    return chk;
}
const hrpExpand = (hrp) => [...[...hrp].map((c) => c.charCodeAt(0) >> 5), 0, ...[...hrp].map((c) => c.charCodeAt(0) & 31)];

function convertBits(data, from, to, pad) {
    let acc = 0, bits = 0;
    const out = [];
    const maxv = (1 << to) - 1;
    for (const v of data) {
        if (v < 0 || v >> from) throw new Error("Invalid address data");
        acc = (acc << from) | v;
        bits += from;
        while (bits >= to) { bits -= to; out.push((acc >> bits) & maxv); }
    }
    if (pad) { if (bits) out.push((acc << (to - bits)) & maxv); }
    else if (bits >= from || ((acc << (to - bits)) & maxv)) throw new Error("Invalid address padding");
    return out;
}

/** Decodes a segwit address to { version, program }. v0 uses bech32, v1+ uses bech32m. */
export function decodeAddress(address) {
    const addr = String(address).trim();
    const lower = addr.toLowerCase();
    if (addr !== lower && addr !== addr.toUpperCase()) throw new Error("Mixed-case address");
    const pos = lower.lastIndexOf("1");
    if (pos < 1 || pos + 7 > lower.length) throw new Error("Not a bech32 address");
    const hrp = lower.slice(0, pos);
    const data = [];
    for (const c of lower.slice(pos + 1)) {
        const i = CHARSET.indexOf(c);
        if (i < 0) throw new Error("Invalid character in address");
        data.push(i);
    }
    const chk = polymod([...hrpExpand(hrp), ...data]);
    const version = data[0];
    // v0 uses bech32 (constant 1); v1+ uses bech32m (constant 0x2bc830a3)
    const want = version === 0 ? 1 : 0x2bc830a3;
    if (chk !== want) throw new Error("Bad address checksum");
    const program = new Uint8Array(convertBits(data.slice(1, -6), 5, 8, false));
    if (version > 16) throw new Error("Unknown witness version");
    if (program.length < 2 || program.length > 40) throw new Error("Bad witness program length");
    if (version === 0 && program.length !== 20 && program.length !== 32) throw new Error("Bad v0 program length");
    return { hrp, version, program };
}

/** Address to scriptPubKey. */
export function scriptPubKeyOf(address) {
    const { version, program } = decodeAddress(address);
    const op = version === 0 ? 0x00 : 0x50 + version;   // OP_0 / OP_1..OP_16
    return cat(new Uint8Array([op]), withLen(program));
}

// ---------- BIP-322 ----------
export const BIP322_TAG = "BIP0322-signed-message";
/**
 * tagged_hash(tag, msg) = SHA256(SHA256(tag) || SHA256(tag) || msg)
 *
 * NOTE: the tag is `BIP0322-signed-message`. A wrong tag changes every message hash and the
 * signature then verifies nowhere. Pinned by the official vectors in test/bip322.test.mjs.
 */
export async function taggedHash(tag, msg) {
    const t = await sha256(enc.encode(tag));
    return sha256(cat(t, t, msg));
}

function serializeTx({ inputs, outputs }) {
    const parts = [u32le(0), varint(inputs.length)];
    for (const i of inputs) parts.push(i.hash, u32le(i.index), withLen(i.script), u32le(i.sequence));
    parts.push(varint(outputs.length));
    for (const o of outputs) parts.push(u64le(o.value), withLen(o.script));
    parts.push(u32le(0));                                  // nLockTime
    return cat(...parts);
}

/** Builds the two BIP-322 virtual transactions. The message is hashed verbatim. */
export async function buildVirtualTxs(address, message) {
    const spk = scriptPubKeyOf(address);
    const msgHash = await taggedHash(BIP322_TAG, enc.encode(message));

    const toSpend = serializeTx({
        inputs: [{
            hash: new Uint8Array(32), index: 0xffffffff,
            script: cat(new Uint8Array([0x00]), withLen(msgHash)),   // OP_0 PUSH32 <hash>
            sequence: 0,
        }],
        outputs: [{ value: 0n, script: spk }],
    });
    const toSpendTxid = await dsha256(toSpend);            // internal byte order, used as-is in the PSBT

    const toSign = serializeTx({
        inputs: [{ hash: toSpendTxid, index: 0, script: new Uint8Array(0), sequence: 0 }],
        outputs: [{ value: 0n, script: new Uint8Array([0x6a]) }],    // OP_RETURN
    });
    return { toSpend, toSpendTxid, toSign, scriptPubKey: spk };
}

const kv = (key, val) => cat(withLen(key), withLen(val));

/**
 * Wraps to_sign in a PSBT v0. `witness_utxo` alone is enough for rgb-lib to sign it;
 * `extra` can carry taproot derivation fields (0x17 internal key, 0x16 tap bip32).
 */
export async function buildToSignPsbt(address, message, extra = []) {
    const { toSign, scriptPubKey } = await buildVirtualTxs(address, message);
    const global = cat(kv(new Uint8Array([0x00]), toSign));
    const witnessUtxo = cat(u64le(0n), withLen(scriptPubKey));
    const input = cat(kv(new Uint8Array([0x01]), witnessUtxo), ...extra.map(([k, v]) => kv(k, v)));
    const psbt = cat(
        new Uint8Array([0x70, 0x73, 0x62, 0x74, 0xff]),     // magic "psbt" + 0xff
        global, new Uint8Array([0x00]),
        input, new Uint8Array([0x00]),
        new Uint8Array([0x00]),                             // one output, no fields
    );
    return b64.to(psbt);
}

/** Reads the final witness (PSBT field 0x08) of input 0 from a signed PSBT. */
export function extractWitness(psbtB64) {
    const p = b64.from(psbtB64);
    let o = 5;                                              // skip the magic
    const readVarint = () => {
        const b = p[o++];
        if (b < 0xfd) return b;
        if (b === 0xfd) { const v = p[o] | (p[o + 1] << 8); o += 2; return v; }
        if (b === 0xfe) { const v = p[o] | (p[o + 1] << 8) | (p[o + 2] << 16) | (p[o + 3] << 24); o += 4; return v >>> 0; }
        throw new Error("Oversized varint in PSBT");
    };
    const skipMap = (onKV) => {
        for (;;) {
            const klen = readVarint();
            if (klen === 0) return;                         // separator
            const key = p.slice(o, o + klen); o += klen;
            const vlen = readVarint();
            const val = p.slice(o, o + vlen); o += vlen;
            onKV(key, val);
        }
    };
    skipMap(() => {});                                      // global map
    let witness = null;
    skipMap((key, val) => { if (key[0] === 0x08) witness = val; });   // input 0
    if (!witness) throw new Error("No final witness in the signed PSBT: the wallet did not sign this input");
    return witness;                                         // already a serialized witness stack
}

/** A BIP-322 signature is the serialized witness stack, base64 encoded. */
export function signatureFromWitness(witnessBytes) {
    return b64.to(witnessBytes);
}
