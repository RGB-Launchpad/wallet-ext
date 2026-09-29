// Key export: the recovery phrase is already held by the vault; this derives the wallet's
// Bitcoin private key from it so the export screen can show it as WIF.
//
// Paths follow BIP86: m/86'/<coin>'/0'/0/0 is this wallet's single Bitcoin address. The
// account that carries RGB assets derives from a different coin type entirely, so the key
// produced here can move the wallet's bitcoin and nothing else. Test vectors pin the
// derivation in test/keys.test.mjs.
//
// Everything here is deterministic arithmetic over WebCrypto primitives; no key material
// is stored or sent anywhere.

const P = 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn;
const N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
const GX = 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n;
const GY = 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n;

const HARDENED = 0x80000000;

const mod = (a, m) => ((a % m) + m) % m;

function powm(base, exp, m) {
    let r = 1n, b = mod(base, m), e = exp;
    while (e > 0n) { if (e & 1n) r = (r * b) % m; b = (b * b) % m; e >>= 1n; }
    return r;
}

const inv = (a, m) => powm(a, m - 2n, m);

/** Affine point addition on secp256k1; null is the point at infinity. */
function add(p, q) {
    if (!p) return q;
    if (!q) return p;
    if (p.x === q.x && mod(p.y + q.y, P) === 0n) return null;
    const slope = p.x === q.x
        ? mod(3n * p.x * p.x * inv(2n * p.y, P), P)
        : mod((q.y - p.y) * inv(mod(q.x - p.x, P), P), P);
    const x = mod(slope * slope - p.x - q.x, P);
    return { x, y: mod(slope * (p.x - x) - p.y, P) };
}

/** Scalar multiplication, double-and-add. One-shot use; speed is not a concern. */
function mul(k, point = { x: GX, y: GY }) {
    let acc = null, addend = point, n = mod(k, N);
    while (n > 0n) {
        if (n & 1n) acc = add(acc, addend);
        addend = add(addend, addend);
        n >>= 1n;
    }
    return acc;
}

const hexToBytes = (h) => Uint8Array.from(h.match(/../g).map((b) => parseInt(b, 16)));
const bytesToHex = (b) => [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
const bytesToBig = (b) => BigInt("0x" + (bytesToHex(b) || "0"));
const bigToBytes = (x) => hexToBytes(x.toString(16).padStart(64, "0"));

/** Compressed SEC serialization of a point. */
function serP(point) {
    const x = point.x.toString(16).padStart(64, "0");
    return hexToBytes((point.y & 1n ? "03" : "02") + x);
}

const hmac512 = async (key, data) => {
    const k = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
    return new Uint8Array(await crypto.subtle.sign("HMAC", k, data));
};

const concat = (...parts) => {
    const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
    let at = 0;
    for (const p of parts) { out.set(p, at); at += p.length; }
    return out;
};

const ser32 = (i) => Uint8Array.from([i >>> 24, (i >>> 16) & 255, (i >>> 8) & 255, i & 255]);

/** BIP39 seed: PBKDF2-HMAC-SHA512 over the NFKD phrase and the fixed salt. */
export async function seedFromMnemonic(mnemonic, passphrase = "") {
    const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(mnemonic.normalize("NFKD")), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
        { name: "PBKDF2", hash: "SHA-512", salt: new TextEncoder().encode(("mnemonic" + passphrase).normalize("NFKD")), iterations: 2048 },
        base, 512);
    return new Uint8Array(bits);
}

/** BIP32 master key from a seed. */
export async function masterFromSeed(seed) {
    const i = await hmac512(new TextEncoder().encode("Bitcoin seed"), seed);
    return { priv: bytesToBig(i.slice(0, 32)), chain: i.slice(32) };
}

/**
 * BIP32 CKDpriv. The parent's public key is derived here for the non-hardened step, which
 * is the only place the curve math enters. `index` arrives as a bitwise-or, which in JS is
 * a *signed* 32-bit result — coerced back to uint32 before the hardened test.
 */
export async function ckd(parent, index) {
    index = index >>> 0;
    const hardened = index >= HARDENED;
    const data = hardened
        ? concat(new Uint8Array([0]), bigToBytes(parent.priv), ser32(index))
        : concat(serP(mul(parent.priv)), ser32(index));
    const i = await hmac512(parent.chain, data);
    const il = bytesToBig(i.slice(0, 32));
    const priv = mod(il + parent.priv, N);
    if (il >= N || priv === 0n) throw new Error("Derivation produced an invalid key");
    return { priv, chain: i.slice(32) };
}

/** Derives the private key at a path of child numbers, hardened bit set where required. */
export async function derive(seed, path) {
    let node = await masterFromSeed(seed);
    for (const i of path) node = await ckd(node, i);
    return node.priv;
}

/**
 * The wallet's Bitcoin key. One address holds the balance and the change, so one key
 * covers it. `network` is the wallet's network name: only Mainnet takes coin type 0.
 */
export async function btcKey(mnemonic, network, passphrase = "") {
    const coin = network === "Mainnet" ? 0 : 1;
    const path = [86 | HARDENED, coin | HARDENED, 0 | HARDENED, 0, 0];
    const seed = await seedFromMnemonic(mnemonic, passphrase);
    const priv = await derive(seed, path);
    const wif = await toWif(priv, network);
    return { priv, wif, pathText: `m/86'/${coin}'/0'/0/0` };
}

const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function base58(bytes) {
    let n = bytesToBig(bytes), out = "";
    while (n > 0n) { out = B58[Number(n % 58n)] + out; n /= 58n; }
    for (const b of bytes) { if (b !== 0) break; out = "1" + out; }
    return out;
}

async function base58check(payload) {
    const sum = new Uint8Array(await crypto.subtle.digest("SHA-256", await crypto.subtle.digest("SHA-256", payload)));
    return base58(concat(payload, sum.slice(0, 4)));
}

/** Wallet Import Format: compressed, network byte in front. */
export function toWif(priv, network) {
    const prefix = network === "Mainnet" ? 0x80 : 0xef;
    return base58check(concat(Uint8Array.from([prefix]), bigToBytes(priv), Uint8Array.from([0x01])));
}

/** The x-only public key of a private key, as hex — the key the address commits to. */
export function xOnlyPubHex(priv) {
    return mul(priv).x.toString(16).padStart(64, "0");
}

const sha256 = async (bytes) => new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));

/** BIP340 tagged hash. */
async function tagged(tag, msg) {
    const t = await sha256(new TextEncoder().encode(tag));
    return sha256(concat(t, t, msg));
}

/**
 * The taproot output key of the address, as x-only hex: the internal key plus its BIP341
 * tweak. Comparing this against the address the wallet shows is what proves the exported
 * key controls that address and not some neighbouring derivation.
 */
export async function outputKeyHex(priv) {
    let p = mul(priv);
    // BIP340 lift_x resolves to the even-Y point.
    if (p.y & 1n) p = { x: p.x, y: mod(-p.y, P) };
    const tweak = bytesToBig(await tagged("TapTweak", bigToBytes(p.x)));
    const q = add(p, mul(tweak));
    return q.x.toString(16).padStart(64, "0");
}
