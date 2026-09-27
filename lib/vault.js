// Encrypted storage for the recovery phrase: PBKDF2-SHA256 (600k iterations) and AES-GCM,
// both from Web Crypto.
//
// The plaintext phrase is never written to storage, sent to the popup, or logged.
// KDF parameters are stored next to the ciphertext so old vaults stay readable when the
// defaults change.

const KDF_DEFAULT = { name: "PBKDF2", hash: "SHA-256", iterations: 600000 };
const VAULT_VERSION = 1;

const enc = new TextEncoder();
const dec = new TextDecoder();

const b64 = {
    from: (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))),
    to: (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0)),
};

async function deriveKey(password, kdf, salt) {
    if (kdf.name !== "PBKDF2") throw new Error(`Unsupported KDF: ${kdf.name}`);
    const base = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: kdf.iterations, hash: kdf.hash },
        base,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"],
    );
}

/** Encrypts the phrase into an object that can be persisted. */
export async function seal(mnemonic, password, kdf = KDF_DEFAULT) {
    if (!mnemonic || !password) throw new Error("Recovery phrase and password are required");
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, kdf, salt);
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(mnemonic));
    return {
        v: VAULT_VERSION,
        kdf: { ...kdf, salt: b64.from(salt) },
        cipher: { name: "AES-GCM", iv: b64.from(iv) },
        ct: b64.from(ct),
        createdAt: Date.now(),
    };
}

/** Decrypts. The AES-GCM tag detects a wrong password; there is no separate check value. */
export async function unseal(vault, password) {
    if (!vault || vault.v !== VAULT_VERSION) throw new Error("Unsupported vault version");
    const { salt, ...kdf } = vault.kdf;
    const key = await deriveKey(password, kdf, b64.to(salt));
    let pt;
    try {
        pt = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: b64.to(vault.cipher.iv) }, key, b64.to(vault.ct));
    } catch {
        // One error for both a wrong password and corrupt data.
        throw new Error("Wrong password");
    }
    return dec.decode(pt);
}

/** Reseals the phrase under a new password and the current KDF parameters. */
export async function rekey(vault, oldPassword, newPassword) {
    const mnemonic = await unseal(vault, oldPassword);
    try { return await seal(mnemonic, newPassword); }
    finally { /* the phrase is a local and becomes unreachable when this returns */ }
}

export const VAULT = { VERSION: VAULT_VERSION, KDF_DEFAULT };
