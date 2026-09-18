/* tslint:disable */
/* eslint-disable */

/**
 * An RGB invoice parsed from a string. Exposes structured invoice data to JavaScript.
 */
export class WasmInvoice {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Return the parsed invoice data as a JS object.
     */
    invoiceData(): any;
    /**
     * Return the original invoice string.
     */
    invoiceString(): string;
    /**
     * Parse an RGB invoice string. Throws if the string is not a valid RGB invoice.
     */
    constructor(invoice_string: string);
}

export class WasmWallet {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create an encrypted backup of the wallet state. Returns backup bytes as Uint8Array.
     */
    backup(password: string): Uint8Array;
    /**
     * Check if the wallet needs a backup. Returns true if modified since last backup.
     */
    backupInfo(): boolean;
    /**
     * Blind an UTXO to receive RGB assets. Returns ReceiveData as a JS object.
     *
     * `assignment_js` is a JS object like `{ "Fungible": 100 }` or `"NonFungible"` or `"Any"`.
     * `transport_endpoints_js` is a JS array of endpoint strings.
     */
    blindReceive(asset_id: string | null | undefined, assignment_js: any, duration_seconds: number | null | undefined, transport_endpoints_js: any, min_confirmations: number): any;
    /**
     * Broadcast a finalized PSBT. Returns the transaction id.
     *
     * For a transaction this wallet did not build, which is the swap case.
     */
    broadcastPsbt(online_js: any, finalized_psbt: string): Promise<string>;
    /**
     * Build a swap's unsigned PSBT: `inputs` as `[{ outpoint, sats, script }]`, `outputs` as
     * `[{ script, sats }]` in order. An empty OP_RETURN is put at output 0, as `swapBegin` needs.
     */
    static buildSwapPsbt(inputs_js: any, outputs_js: any): string;
    /**
     * Check a swap PSBT against what this wallet agreed to, before signing it.
     *
     * `inputs` is an array of `"txid:vout"`, `outputs` an array of `{ script, sats }` in order,
     * index 0 being the RGB commitment output.
     *
     * 🚨 Call this **before** signing. A signature covers every output, so a rewritten output
     * discovered afterwards is already authorised.
     */
    static checkSwapPsbt(psbt: string, inputs_js: any, outputs_js: any, fee_sats: bigint): void;
    /**
     * Configure VSS (cloud) backup for this wallet.
     *
     * `signing_key_hex` is the 32-byte secret key as a hex string (64 hex chars).
     *
     * **Security note:** The signing key crosses the JS/WASM boundary as a string. It will
     * exist in V8's string pool and cannot be zeroed from Rust. Callers should avoid storing
     * the key in JS longer than necessary (e.g., don't keep it in a global variable).
     */
    configureVssBackup(server_url: string, store_id: string, signing_key_hex: string): void;
    /**
     * Create a new RGB wallet with IndexedDB state restoration.
     *
     * Like `new()`, but asynchronously checks IndexedDB for a previously saved
     * snapshot and restores it, so wallet state survives page refreshes.
     */
    static create(wallet_data_json: string): Promise<WasmWallet>;
    /**
     * Create UTXOs (begin): prepare a PSBT to create new UTXOs for RGB allocations.
     * Returns the unsigned PSBT string.
     */
    createUtxosBegin(online_js: any, up_to: boolean, num: number | null | undefined, size: number | null | undefined, fee_rate: bigint, skip_sync: boolean): Promise<string>;
    /**
     * Create UTXOs (end): broadcast a signed PSBT to create new UTXOs.
     * Returns the number of created UTXOs.
     */
    createUtxosEnd(online_js: any, signed_psbt: string, skip_sync: boolean): Promise<number>;
    /**
     * Delete failed transfers. Returns true if any were deleted.
     */
    deleteTransfers(batch_transfer_idx: number | null | undefined, no_asset_only: boolean): boolean;
    /**
     * Disable VSS (cloud) backup.
     */
    disableVssBackup(): void;
    /**
     * Drain all wallet funds (begin): prepare a PSBT. Returns the unsigned PSBT string.
     */
    drainToBegin(online_js: any, address: string, destroy_assets: boolean, fee_rate: bigint): Promise<string>;
    /**
     * Drain all wallet funds (end): broadcast a signed PSBT. Returns the txid string.
     */
    drainToEnd(online_js: any, signed_psbt: string): Promise<string>;
    /**
     * Fail pending transfers. Returns true if any transfers were failed.
     */
    failTransfers(online_js: any, batch_transfer_idx: number | null | undefined, no_asset_only: boolean, skip_sync: boolean): Promise<boolean>;
    /**
     * Finalize a signed PSBT (base64-encoded). Returns the finalized PSBT string.
     */
    finalizePsbt(signed_psbt: string): string;
    /**
     * Durably persist current wallet state to IndexedDB.
     */
    flush(): Promise<void>;
    /**
     * Run a BIP44 stop-gap full scan against the indexer.
     *
     * Rebuilds a thin BDK state (no revealed SPKs) after a restore, recovering the BTC balance
     * when an incremental `sync` cannot.
     */
    fullScan(online_js: any): Promise<void>;
    /**
     * Return a new Bitcoin address from the vanilla wallet.
     */
    getAddress(): string;
    /**
     * Return the balance for a specific asset.
     */
    getAssetBalance(asset_id: string): any;
    /**
     * Return metadata for a specific asset (name, ticker, precision, supply, etc.).
     */
    getAssetMetadata(asset_id: string): any;
    /**
     * Return the BTC balance. Always skips sync on wasm32.
     */
    getBtcBalance(): any;
    /**
     * Get fee estimation for a target number of blocks.
     */
    getFeeEstimation(online_js: any, blocks: number): Promise<number>;
    /**
     * Return the WalletData as a JS object.
     */
    getWalletData(): any;
    /**
     * Go online: connect to an indexer. Returns Online data as a JS object.
     */
    goOnline(skip_consistency_check: boolean, indexer_url: string): Promise<any>;
    /**
     * Inflate an IFA asset (begin): prepare a PSBT. Returns the unsigned PSBT string.
     *
     * `inflation_amounts_js` is a JS array of u64 values.
     */
    inflateBegin(online_js: any, asset_id: string, inflation_amounts_js: any, fee_rate: bigint, min_confirmations: number): Promise<string>;
    /**
     * Inflate an IFA asset (end): broadcast a signed PSBT. Returns an OperationResult JS object.
     */
    inflateEnd(online_js: any, signed_psbt: string): Promise<any>;
    /**
     * The script a witness invoice pays to, hex-encoded.
     *
     * A receiver needs it to check that a swap transaction really pays its own seal: rgb-lib does
     * not expose the script, and the invoice's recipient id is not one.
     */
    static invoiceSealScript(invoice: string): string;
    /**
     * Issue a new IFA (Inflatable Fungible Asset).
     *
     * `amounts_js` is a JS array of u64 values.
     * `inflation_amounts_js` is a JS array of u64 values for inflation allowances.
     */
    issueAssetIfa(ticker: string, name: string, precision: number, amounts_js: any, inflation_amounts_js: any, reject_list_url?: string | null): any;
    /**
     * Issue a new NIA (Non-Inflatable Asset).
     *
     * `amounts_js` is a JS array of u64 values.
     */
    issueAssetNia(ticker: string, name: string, precision: number, amounts_js: any): any;
    /**
     * List known RGB assets. Pass a JS array of schema strings to filter, or empty for all.
     */
    listAssets(filter_asset_schemas_js: any): any;
    /**
     * List Bitcoin transactions. Always skips sync on wasm32.
     */
    listTransactions(): any;
    /**
     * List RGB transfers matching an asset filter ("Any", "NoAsset" or {"Id": "<asset_id>"}),
     * optionally restricted to the transfers of an on-chain txid.
     */
    listTransfers(filter_js: any, txid?: string | null): any;
    /**
     * List unspent outputs. Always skips sync on wasm32.
     */
    listUnspents(settled_only: boolean): any;
    /**
     * List vanilla (non-colored) unspent outputs. Returns a JS array of LocalOutput objects.
     */
    listUnspentsVanilla(online_js: any, min_confirmations: number, skip_sync: boolean): Promise<any>;
    /**
     * Create a new RGB wallet from a JSON-encoded WalletData.
     */
    constructor(wallet_data_json: string);
    /**
     * Refresh pending transfers. Returns a RefreshResult JS object.
     *
     * `filter_js` is a JS array of RefreshFilter objects (or empty array for all).
     */
    refresh(online_js: any, asset_id: string | null | undefined, filter_js: any, skip_sync: boolean): Promise<any>;
    /**
     * Restore wallet state from an encrypted backup.
     */
    restoreBackup(backup_bytes: Uint8Array, password: string): void;
    /**
     * Rotate the pinned address for the given keychain.
     * keychain: 0 = External (colored), 1 = Internal (vanilla)
     */
    rotateAddress(keychain: number): string;
    /**
     * Send RGB assets (begin): prepare a PSBT. Returns the unsigned PSBT string.
     *
     * `recipient_map_js` is a JS object mapping asset IDs to arrays of Recipient objects.
     */
    sendBegin(online_js: any, recipient_map_js: any, donation: boolean, fee_rate: bigint, min_confirmations: number, lock_time?: number | null): Promise<string>;
    /**
     * Send BTC (begin): prepare a PSBT. Returns the unsigned PSBT string.
     */
    sendBtcBegin(online_js: any, address: string, amount: bigint, fee_rate: bigint, skip_sync: boolean): Promise<string>;
    /**
     * Send BTC (end): broadcast a signed PSBT. Returns the txid string.
     */
    sendBtcEnd(online_js: any, signed_psbt: string, skip_sync: boolean): Promise<string>;
    /**
     * Send RGB assets (end): broadcast a signed PSBT. Returns an OperationResult JS object.
     */
    sendEnd(online_js: any, signed_psbt: string, skip_sync: boolean): Promise<any>;
    /**
     * Sign a PSBT (base64-encoded). Returns the signed PSBT string.
     */
    signPsbt(unsigned_psbt: string): string;
    /**
     * The seller's half of a peer-to-peer swap on a PSBT built by the caller: colours it through
     * the same path as `sendBegin`, recorded as a donation, and returns it unsigned. Output 0
     * must be an OP_RETURN placeholder; `sealVout` is the output paying the buyer's witness seal.
     * Once both sides have signed, `sendEnd` broadcasts, posts the consignment and records it.
     */
    swapBegin(online_js: any, psbt: string, asset_id: string, amount: bigint, recipient_id: string, seal_vout: number, seal_amount_sat: bigint, transport_endpoints_js: any, min_confirmations: number): Promise<string>;
    /**
     * The outpoints a PSBT spends, as `"txid:vout"`.
     */
    static swapPsbtInputs(psbt: string): any;
    /**
     * Sync the wallet with the indexer.
     *
     * Incremental: re-queries only already-revealed SPKs. Use `fullScan` to recover a thin
     * restored state.
     */
    sync(online_js: any): Promise<void>;
    /**
     * Upload an encrypted backup to the configured VSS server. Returns the server version.
     */
    vssBackup(): Promise<any>;
    /**
     * Query VSS backup status. Returns { backup_exists, server_version, backup_required }.
     */
    vssBackupInfo(): Promise<any>;
    /**
     * Download and restore wallet state from VSS server.
     */
    vssRestoreBackup(): Promise<void>;
    /**
     * Create an address to receive RGB assets via witness TX. Returns ReceiveData as a JS object.
     */
    witnessReceive(asset_id: string | null | undefined, assignment_js: any, duration_seconds: number | null | undefined, transport_endpoints_js: any, min_confirmations: number): any;
}

/**
 * Check whether the provided URL points to a valid RGB proxy server.
 */
export function checkProxyUrl(proxy_url: string): Promise<void>;

export function generateKeys(network: string): any;

export function init(): void;

export function restoreKeys(network: string, mnemonic: string): any;

/**
 * Validate an RGB consignment using witness data bundled in the consignment (offchain).
 *
 * Works before the witness transaction is broadcast. Takes the raw consignment
 * bytes (strict-encoded, not base64), the witness transaction ID, and the Bitcoin network.
 *
 * Returns a JS object: `{ valid: boolean, warnings?: string[], error?: string, details?: string }`
 */
export function validateConsignmentOffchain(consignment_bytes: Uint8Array, txid: string, network: string): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_wasminvoice_free: (a: number, b: number) => void;
    readonly __wbg_wasmwallet_free: (a: number, b: number) => void;
    readonly checkProxyUrl: (a: number, b: number) => any;
    readonly generateKeys: (a: number, b: number) => [number, number, number];
    readonly restoreKeys: (a: number, b: number, c: number, d: number) => [number, number, number];
    readonly validateConsignmentOffchain: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number];
    readonly wasminvoice_invoiceData: (a: number) => [number, number, number];
    readonly wasminvoice_invoiceString: (a: number) => [number, number];
    readonly wasminvoice_new: (a: number, b: number) => [number, number, number];
    readonly wasmwallet_backup: (a: number, b: number, c: number) => [number, number, number, number];
    readonly wasmwallet_backupInfo: (a: number) => [number, number, number];
    readonly wasmwallet_blindReceive: (a: number, b: number, c: number, d: any, e: number, f: any, g: number) => [number, number, number];
    readonly wasmwallet_broadcastPsbt: (a: number, b: any, c: number, d: number) => any;
    readonly wasmwallet_buildSwapPsbt: (a: any, b: any) => [number, number, number, number];
    readonly wasmwallet_checkSwapPsbt: (a: number, b: number, c: any, d: any, e: bigint) => [number, number];
    readonly wasmwallet_configureVssBackup: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number];
    readonly wasmwallet_create: (a: number, b: number) => any;
    readonly wasmwallet_createUtxosBegin: (a: number, b: any, c: number, d: number, e: number, f: bigint, g: number) => any;
    readonly wasmwallet_createUtxosEnd: (a: number, b: any, c: number, d: number, e: number) => any;
    readonly wasmwallet_deleteTransfers: (a: number, b: number, c: number) => [number, number, number];
    readonly wasmwallet_disableVssBackup: (a: number) => void;
    readonly wasmwallet_drainToBegin: (a: number, b: any, c: number, d: number, e: number, f: bigint) => any;
    readonly wasmwallet_drainToEnd: (a: number, b: any, c: number, d: number) => any;
    readonly wasmwallet_failTransfers: (a: number, b: any, c: number, d: number, e: number) => any;
    readonly wasmwallet_finalizePsbt: (a: number, b: number, c: number) => [number, number, number, number];
    readonly wasmwallet_flush: (a: number) => any;
    readonly wasmwallet_fullScan: (a: number, b: any) => any;
    readonly wasmwallet_getAddress: (a: number) => [number, number, number, number];
    readonly wasmwallet_getAssetBalance: (a: number, b: number, c: number) => [number, number, number];
    readonly wasmwallet_getAssetMetadata: (a: number, b: number, c: number) => [number, number, number];
    readonly wasmwallet_getBtcBalance: (a: number) => [number, number, number];
    readonly wasmwallet_getFeeEstimation: (a: number, b: any, c: number) => any;
    readonly wasmwallet_getWalletData: (a: number) => [number, number, number];
    readonly wasmwallet_goOnline: (a: number, b: number, c: number, d: number) => any;
    readonly wasmwallet_inflateBegin: (a: number, b: any, c: number, d: number, e: any, f: bigint, g: number) => any;
    readonly wasmwallet_inflateEnd: (a: number, b: any, c: number, d: number) => any;
    readonly wasmwallet_invoiceSealScript: (a: number, b: number) => [number, number, number, number];
    readonly wasmwallet_issueAssetIfa: (a: number, b: number, c: number, d: number, e: number, f: number, g: any, h: any, i: number, j: number) => [number, number, number];
    readonly wasmwallet_issueAssetNia: (a: number, b: number, c: number, d: number, e: number, f: number, g: any) => [number, number, number];
    readonly wasmwallet_listAssets: (a: number, b: any) => [number, number, number];
    readonly wasmwallet_listTransactions: (a: number) => [number, number, number];
    readonly wasmwallet_listTransfers: (a: number, b: any, c: number, d: number) => [number, number, number];
    readonly wasmwallet_listUnspents: (a: number, b: number) => [number, number, number];
    readonly wasmwallet_listUnspentsVanilla: (a: number, b: any, c: number, d: number) => any;
    readonly wasmwallet_new: (a: number, b: number) => [number, number, number];
    readonly wasmwallet_refresh: (a: number, b: any, c: number, d: number, e: any, f: number) => any;
    readonly wasmwallet_restoreBackup: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly wasmwallet_rotateAddress: (a: number, b: number) => [number, number, number, number];
    readonly wasmwallet_sendBegin: (a: number, b: any, c: any, d: number, e: bigint, f: number, g: number) => any;
    readonly wasmwallet_sendBtcBegin: (a: number, b: any, c: number, d: number, e: bigint, f: bigint, g: number) => any;
    readonly wasmwallet_sendBtcEnd: (a: number, b: any, c: number, d: number, e: number) => any;
    readonly wasmwallet_sendEnd: (a: number, b: any, c: number, d: number, e: number) => any;
    readonly wasmwallet_signPsbt: (a: number, b: number, c: number) => [number, number, number, number];
    readonly wasmwallet_swapBegin: (a: number, b: any, c: number, d: number, e: number, f: number, g: bigint, h: number, i: number, j: number, k: bigint, l: any, m: number) => any;
    readonly wasmwallet_swapPsbtInputs: (a: number, b: number) => [number, number, number];
    readonly wasmwallet_sync: (a: number, b: any) => any;
    readonly wasmwallet_vssBackup: (a: number) => any;
    readonly wasmwallet_vssBackupInfo: (a: number) => any;
    readonly wasmwallet_vssRestoreBackup: (a: number) => any;
    readonly wasmwallet_witnessReceive: (a: number, b: number, c: number, d: any, e: number, f: any, g: number) => [number, number, number];
    readonly init: () => void;
    readonly rustsecp256k1_v0_10_0_default_error_callback_fn: (a: number, b: number) => void;
    readonly rustsecp256k1_v0_10_0_default_illegal_callback_fn: (a: number, b: number) => void;
    readonly rustsecp256k1_v0_10_0_context_destroy: (a: number) => void;
    readonly rustsecp256k1_v0_10_0_context_create: (a: number) => number;
    readonly wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke___wasm_bindgen_fbfb77f5f81cea49___JsValue__core_ed718c3d60ebd546___result__Result_____wasm_bindgen_fbfb77f5f81cea49___JsError___true_: (a: number, b: number, c: any) => [number, number];
    readonly wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke___js_sys_c84eb9a3aa788e7b___Function_fn_wasm_bindgen_fbfb77f5f81cea49___JsValue_____wasm_bindgen_fbfb77f5f81cea49___sys__Undefined___js_sys_c84eb9a3aa788e7b___Function_fn_wasm_bindgen_fbfb77f5f81cea49___JsValue_____wasm_bindgen_fbfb77f5f81cea49___sys__Undefined_______true_: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke___web_sys_a631e2897884c5f1___features__gen_Event__Event______true_: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke___web_sys_a631e2897884c5f1___features__gen_IdbVersionChangeEvent__IdbVersionChangeEvent______true_: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke_______true_: (a: number, b: number) => void;
    readonly wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke_______true__1_: (a: number, b: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_destroy_closure: (a: number, b: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
