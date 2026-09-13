// Local wallet snapshots, and what to do when the chain under them was replaced.
//
// rgb-lib-wasm keeps one snapshot per wallet in IndexedDB `rgb_lib_wallet` / `snapshots`,
// keyed by its data directory: `<dataDir>/<master fingerprint>`. A snapshot holds everything
// the device knows about that wallet on that network: the BDK chain, the RGB stock and the
// received consignments.

export const SNAPSHOT_DB = "rgb_lib_wallet";
export const SNAPSHOT_STORE = "snapshots";

/** The data directory handed to rgb-lib. The network has to be part of the key. */
export const dataDirOf = (network) => `:memory:/${network}`;

/** Every snapshot key of one network starts with this. */
export const snapshotPrefix = (network) => `${dataDirOf(network)}/`;

// Only Regtest can be reset. That chain is our own and gets rebuilt, after which nothing in
// its snapshot is worth keeping. On Signet the snapshot holds the consignments that *are*
// the assets, so deleting it loses them.
export const RESETTABLE = new Set(["Regtest"]);

/**
 * BDK's error when the indexer's chain lacks the blocks the wallet remembers, e.g.
 * "Failed bdk sync: introduced chain cannot connect with the original chain, try include height 5318".
 */
export const isChainMismatch = (message) =>
    /cannot connect with the original chain/i.test(String(message ?? ""));

/**
 * Deletes the snapshots whose key starts with `prefix`. Resolves to how many went.
 * NOTE: nothing may hold the wallet open meanwhile; a running engine writes its snapshot back.
 */
export function deleteSnapshots(prefix) {
    return new Promise((resolve, reject) => {
        let fresh = false;
        const open = indexedDB.open(SNAPSHOT_DB);
        // NOTE: an upgrade here means the database does not exist yet, so there is nothing to
        // delete. Letting it complete would create version 1 without the store, and rgb-lib,
        // opening at that same version, would never add it.
        open.onupgradeneeded = () => { fresh = true; open.transaction.abort(); };
        open.onerror = () => (fresh ? resolve(0) : reject(open.error));
        open.onsuccess = () => {
            const db = open.result;
            if (!db.objectStoreNames.contains(SNAPSHOT_STORE)) { db.close(); resolve(0); return; }
            const tx = db.transaction(SNAPSHOT_STORE, "readwrite");
            const store = tx.objectStore(SNAPSHOT_STORE);
            const range = IDBKeyRange.bound(prefix, prefix + "\uffff");
            let n = 0;
            const count = store.count(range);
            count.onsuccess = () => { n = count.result; store.delete(range); };
            tx.oncomplete = () => { db.close(); resolve(n); };
            tx.onerror = tx.onabort = () => { db.close(); reject(tx.error || new Error("Could not delete the local chain data")); };
        };
    });
}
