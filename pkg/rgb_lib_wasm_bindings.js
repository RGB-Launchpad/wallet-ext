/* @ts-self-types="./rgb_lib_wasm_bindings.d.ts" */

/**
 * An RGB invoice parsed from a string. Exposes structured invoice data to JavaScript.
 */
export class WasmInvoice {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmInvoiceFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasminvoice_free(ptr, 0);
    }
    /**
     * Return the parsed invoice data as a JS object.
     * @returns {any}
     */
    invoiceData() {
        const ret = wasm.wasminvoice_invoiceData(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Return the original invoice string.
     * @returns {string}
     */
    invoiceString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.wasminvoice_invoiceString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Parse an RGB invoice string. Throws if the string is not a valid RGB invoice.
     * @param {string} invoice_string
     */
    constructor(invoice_string) {
        const ptr0 = passStringToWasm0(invoice_string, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasminvoice_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        WasmInvoiceFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}
if (Symbol.dispose) WasmInvoice.prototype[Symbol.dispose] = WasmInvoice.prototype.free;

export class WasmWallet {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmWallet.prototype);
        obj.__wbg_ptr = ptr;
        WasmWalletFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmWalletFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmwallet_free(ptr, 0);
    }
    /**
     * Create an encrypted backup of the wallet state. Returns backup bytes as Uint8Array.
     * @param {string} password
     * @returns {Uint8Array}
     */
    backup(password) {
        const ptr0 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_backup(this.__wbg_ptr, ptr0, len0);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v2;
    }
    /**
     * Check if the wallet needs a backup. Returns true if modified since last backup.
     * @returns {boolean}
     */
    backupInfo() {
        const ret = wasm.wasmwallet_backupInfo(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
    }
    /**
     * Blind an UTXO to receive RGB assets. Returns ReceiveData as a JS object.
     *
     * `assignment_js` is a JS object like `{ "Fungible": 100 }` or `"NonFungible"` or `"Any"`.
     * `transport_endpoints_js` is a JS array of endpoint strings.
     * @param {string | null | undefined} asset_id
     * @param {any} assignment_js
     * @param {number | null | undefined} duration_seconds
     * @param {any} transport_endpoints_js
     * @param {number} min_confirmations
     * @returns {any}
     */
    blindReceive(asset_id, assignment_js, duration_seconds, transport_endpoints_js, min_confirmations) {
        var ptr0 = isLikeNone(asset_id) ? 0 : passStringToWasm0(asset_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_blindReceive(this.__wbg_ptr, ptr0, len0, assignment_js, isLikeNone(duration_seconds) ? 0x100000001 : (duration_seconds) >>> 0, transport_endpoints_js, min_confirmations);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Broadcast a finalized PSBT. Returns the transaction id.
     *
     * For a transaction this wallet did not build, which is the swap case.
     * @param {any} online_js
     * @param {string} finalized_psbt
     * @returns {Promise<string>}
     */
    broadcastPsbt(online_js, finalized_psbt) {
        const ptr0 = passStringToWasm0(finalized_psbt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_broadcastPsbt(this.__wbg_ptr, online_js, ptr0, len0);
        return ret;
    }
    /**
     * Check a swap PSBT against what this wallet agreed to, before signing it.
     *
     * `inputs` is an array of `"txid:vout"`, `outputs` an array of `{ script, sats }` in order,
     * index 0 being the RGB commitment output.
     *
     * 🚨 Call this **before** signing. A signature covers every output, so a rewritten output
     * discovered afterwards is already authorised.
     * @param {string} psbt
     * @param {any} inputs_js
     * @param {any} outputs_js
     * @param {bigint} fee_sats
     */
    static checkSwapPsbt(psbt, inputs_js, outputs_js, fee_sats) {
        const ptr0 = passStringToWasm0(psbt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_checkSwapPsbt(ptr0, len0, inputs_js, outputs_js, fee_sats);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Configure VSS (cloud) backup for this wallet.
     *
     * `signing_key_hex` is the 32-byte secret key as a hex string (64 hex chars).
     *
     * **Security note:** The signing key crosses the JS/WASM boundary as a string. It will
     * exist in V8's string pool and cannot be zeroed from Rust. Callers should avoid storing
     * the key in JS longer than necessary (e.g., don't keep it in a global variable).
     * @param {string} server_url
     * @param {string} store_id
     * @param {string} signing_key_hex
     */
    configureVssBackup(server_url, store_id, signing_key_hex) {
        const ptr0 = passStringToWasm0(server_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(store_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(signing_key_hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_configureVssBackup(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Create a new RGB wallet with IndexedDB state restoration.
     *
     * Like `new()`, but asynchronously checks IndexedDB for a previously saved
     * snapshot and restores it, so wallet state survives page refreshes.
     * @param {string} wallet_data_json
     * @returns {Promise<WasmWallet>}
     */
    static create(wallet_data_json) {
        const ptr0 = passStringToWasm0(wallet_data_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_create(ptr0, len0);
        return ret;
    }
    /**
     * Create UTXOs (begin): prepare a PSBT to create new UTXOs for RGB allocations.
     * Returns the unsigned PSBT string.
     * @param {any} online_js
     * @param {boolean} up_to
     * @param {number | null | undefined} num
     * @param {number | null | undefined} size
     * @param {bigint} fee_rate
     * @param {boolean} skip_sync
     * @returns {Promise<string>}
     */
    createUtxosBegin(online_js, up_to, num, size, fee_rate, skip_sync) {
        const ret = wasm.wasmwallet_createUtxosBegin(this.__wbg_ptr, online_js, up_to, isLikeNone(num) ? 0xFFFFFF : num, isLikeNone(size) ? 0x100000001 : (size) >>> 0, fee_rate, skip_sync);
        return ret;
    }
    /**
     * Create UTXOs (end): broadcast a signed PSBT to create new UTXOs.
     * Returns the number of created UTXOs.
     * @param {any} online_js
     * @param {string} signed_psbt
     * @param {boolean} skip_sync
     * @returns {Promise<number>}
     */
    createUtxosEnd(online_js, signed_psbt, skip_sync) {
        const ptr0 = passStringToWasm0(signed_psbt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_createUtxosEnd(this.__wbg_ptr, online_js, ptr0, len0, skip_sync);
        return ret;
    }
    /**
     * Delete failed transfers. Returns true if any were deleted.
     * @param {number | null | undefined} batch_transfer_idx
     * @param {boolean} no_asset_only
     * @returns {boolean}
     */
    deleteTransfers(batch_transfer_idx, no_asset_only) {
        const ret = wasm.wasmwallet_deleteTransfers(this.__wbg_ptr, isLikeNone(batch_transfer_idx) ? 0x100000001 : (batch_transfer_idx) >> 0, no_asset_only);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
    }
    /**
     * Disable VSS (cloud) backup.
     */
    disableVssBackup() {
        wasm.wasmwallet_disableVssBackup(this.__wbg_ptr);
    }
    /**
     * Drain all wallet funds (begin): prepare a PSBT. Returns the unsigned PSBT string.
     * @param {any} online_js
     * @param {string} address
     * @param {boolean} destroy_assets
     * @param {bigint} fee_rate
     * @returns {Promise<string>}
     */
    drainToBegin(online_js, address, destroy_assets, fee_rate) {
        const ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_drainToBegin(this.__wbg_ptr, online_js, ptr0, len0, destroy_assets, fee_rate);
        return ret;
    }
    /**
     * Drain all wallet funds (end): broadcast a signed PSBT. Returns the txid string.
     * @param {any} online_js
     * @param {string} signed_psbt
     * @returns {Promise<string>}
     */
    drainToEnd(online_js, signed_psbt) {
        const ptr0 = passStringToWasm0(signed_psbt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_drainToEnd(this.__wbg_ptr, online_js, ptr0, len0);
        return ret;
    }
    /**
     * Fail pending transfers. Returns true if any transfers were failed.
     * @param {any} online_js
     * @param {number | null | undefined} batch_transfer_idx
     * @param {boolean} no_asset_only
     * @param {boolean} skip_sync
     * @returns {Promise<boolean>}
     */
    failTransfers(online_js, batch_transfer_idx, no_asset_only, skip_sync) {
        const ret = wasm.wasmwallet_failTransfers(this.__wbg_ptr, online_js, isLikeNone(batch_transfer_idx) ? 0x100000001 : (batch_transfer_idx) >> 0, no_asset_only, skip_sync);
        return ret;
    }
    /**
     * Finalize a signed PSBT (base64-encoded). Returns the finalized PSBT string.
     * @param {string} signed_psbt
     * @returns {string}
     */
    finalizePsbt(signed_psbt) {
        let deferred3_0;
        let deferred3_1;
        try {
            const ptr0 = passStringToWasm0(signed_psbt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.wasmwallet_finalizePsbt(this.__wbg_ptr, ptr0, len0);
            var ptr2 = ret[0];
            var len2 = ret[1];
            if (ret[3]) {
                ptr2 = 0; len2 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * Durably persist current wallet state to IndexedDB.
     * @returns {Promise<void>}
     */
    flush() {
        const ret = wasm.wasmwallet_flush(this.__wbg_ptr);
        return ret;
    }
    /**
     * Run a BIP44 stop-gap full scan against the indexer.
     *
     * Rebuilds a thin BDK state (no revealed SPKs) after a restore, recovering the BTC balance
     * when an incremental `sync` cannot.
     * @param {any} online_js
     * @returns {Promise<void>}
     */
    fullScan(online_js) {
        const ret = wasm.wasmwallet_fullScan(this.__wbg_ptr, online_js);
        return ret;
    }
    /**
     * Return a new Bitcoin address from the vanilla wallet.
     * @returns {string}
     */
    getAddress() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.wasmwallet_getAddress(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Return the balance for a specific asset.
     * @param {string} asset_id
     * @returns {any}
     */
    getAssetBalance(asset_id) {
        const ptr0 = passStringToWasm0(asset_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_getAssetBalance(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Return metadata for a specific asset (name, ticker, precision, supply, etc.).
     * @param {string} asset_id
     * @returns {any}
     */
    getAssetMetadata(asset_id) {
        const ptr0 = passStringToWasm0(asset_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_getAssetMetadata(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Return the BTC balance. Always skips sync on wasm32.
     * @returns {any}
     */
    getBtcBalance() {
        const ret = wasm.wasmwallet_getBtcBalance(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Get fee estimation for a target number of blocks.
     * @param {any} online_js
     * @param {number} blocks
     * @returns {Promise<number>}
     */
    getFeeEstimation(online_js, blocks) {
        const ret = wasm.wasmwallet_getFeeEstimation(this.__wbg_ptr, online_js, blocks);
        return ret;
    }
    /**
     * Return the WalletData as a JS object.
     * @returns {any}
     */
    getWalletData() {
        const ret = wasm.wasmwallet_getWalletData(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Go online: connect to an indexer. Returns Online data as a JS object.
     * @param {boolean} skip_consistency_check
     * @param {string} indexer_url
     * @returns {Promise<any>}
     */
    goOnline(skip_consistency_check, indexer_url) {
        const ptr0 = passStringToWasm0(indexer_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_goOnline(this.__wbg_ptr, skip_consistency_check, ptr0, len0);
        return ret;
    }
    /**
     * Inflate an IFA asset (begin): prepare a PSBT. Returns the unsigned PSBT string.
     *
     * `inflation_amounts_js` is a JS array of u64 values.
     * @param {any} online_js
     * @param {string} asset_id
     * @param {any} inflation_amounts_js
     * @param {bigint} fee_rate
     * @param {number} min_confirmations
     * @returns {Promise<string>}
     */
    inflateBegin(online_js, asset_id, inflation_amounts_js, fee_rate, min_confirmations) {
        const ptr0 = passStringToWasm0(asset_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_inflateBegin(this.__wbg_ptr, online_js, ptr0, len0, inflation_amounts_js, fee_rate, min_confirmations);
        return ret;
    }
    /**
     * Inflate an IFA asset (end): broadcast a signed PSBT. Returns an OperationResult JS object.
     * @param {any} online_js
     * @param {string} signed_psbt
     * @returns {Promise<any>}
     */
    inflateEnd(online_js, signed_psbt) {
        const ptr0 = passStringToWasm0(signed_psbt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_inflateEnd(this.__wbg_ptr, online_js, ptr0, len0);
        return ret;
    }
    /**
     * The script a witness invoice pays to, hex-encoded.
     *
     * A receiver needs it to check that a swap transaction really pays its own seal: rgb-lib does
     * not expose the script, and the invoice's recipient id is not one.
     * @param {string} invoice
     * @returns {string}
     */
    static invoiceSealScript(invoice) {
        let deferred3_0;
        let deferred3_1;
        try {
            const ptr0 = passStringToWasm0(invoice, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.wasmwallet_invoiceSealScript(ptr0, len0);
            var ptr2 = ret[0];
            var len2 = ret[1];
            if (ret[3]) {
                ptr2 = 0; len2 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * Issue a new IFA (Inflatable Fungible Asset).
     *
     * `amounts_js` is a JS array of u64 values.
     * `inflation_amounts_js` is a JS array of u64 values for inflation allowances.
     * @param {string} ticker
     * @param {string} name
     * @param {number} precision
     * @param {any} amounts_js
     * @param {any} inflation_amounts_js
     * @param {string | null} [reject_list_url]
     * @returns {any}
     */
    issueAssetIfa(ticker, name, precision, amounts_js, inflation_amounts_js, reject_list_url) {
        const ptr0 = passStringToWasm0(ticker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(reject_list_url) ? 0 : passStringToWasm0(reject_list_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_issueAssetIfa(this.__wbg_ptr, ptr0, len0, ptr1, len1, precision, amounts_js, inflation_amounts_js, ptr2, len2);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Issue a new NIA (Non-Inflatable Asset).
     *
     * `amounts_js` is a JS array of u64 values.
     * @param {string} ticker
     * @param {string} name
     * @param {number} precision
     * @param {any} amounts_js
     * @returns {any}
     */
    issueAssetNia(ticker, name, precision, amounts_js) {
        const ptr0 = passStringToWasm0(ticker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_issueAssetNia(this.__wbg_ptr, ptr0, len0, ptr1, len1, precision, amounts_js);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * List known RGB assets. Pass a JS array of schema strings to filter, or empty for all.
     * @param {any} filter_asset_schemas_js
     * @returns {any}
     */
    listAssets(filter_asset_schemas_js) {
        const ret = wasm.wasmwallet_listAssets(this.__wbg_ptr, filter_asset_schemas_js);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * List Bitcoin transactions. Always skips sync on wasm32.
     * @returns {any}
     */
    listTransactions() {
        const ret = wasm.wasmwallet_listTransactions(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * List RGB transfers matching an asset filter ("Any", "NoAsset" or {"Id": "<asset_id>"}),
     * optionally restricted to the transfers of an on-chain txid.
     * @param {any} filter_js
     * @param {string | null} [txid]
     * @returns {any}
     */
    listTransfers(filter_js, txid) {
        var ptr0 = isLikeNone(txid) ? 0 : passStringToWasm0(txid, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_listTransfers(this.__wbg_ptr, filter_js, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * List unspent outputs. Always skips sync on wasm32.
     * @param {boolean} settled_only
     * @returns {any}
     */
    listUnspents(settled_only) {
        const ret = wasm.wasmwallet_listUnspents(this.__wbg_ptr, settled_only);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * List vanilla (non-colored) unspent outputs. Returns a JS array of LocalOutput objects.
     * @param {any} online_js
     * @param {number} min_confirmations
     * @param {boolean} skip_sync
     * @returns {Promise<any>}
     */
    listUnspentsVanilla(online_js, min_confirmations, skip_sync) {
        const ret = wasm.wasmwallet_listUnspentsVanilla(this.__wbg_ptr, online_js, min_confirmations, skip_sync);
        return ret;
    }
    /**
     * Create a new RGB wallet from a JSON-encoded WalletData.
     * @param {string} wallet_data_json
     */
    constructor(wallet_data_json) {
        const ptr0 = passStringToWasm0(wallet_data_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        WasmWalletFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Refresh pending transfers. Returns a RefreshResult JS object.
     *
     * `filter_js` is a JS array of RefreshFilter objects (or empty array for all).
     * @param {any} online_js
     * @param {string | null | undefined} asset_id
     * @param {any} filter_js
     * @param {boolean} skip_sync
     * @returns {Promise<any>}
     */
    refresh(online_js, asset_id, filter_js, skip_sync) {
        var ptr0 = isLikeNone(asset_id) ? 0 : passStringToWasm0(asset_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_refresh(this.__wbg_ptr, online_js, ptr0, len0, filter_js, skip_sync);
        return ret;
    }
    /**
     * Restore wallet state from an encrypted backup.
     * @param {Uint8Array} backup_bytes
     * @param {string} password
     */
    restoreBackup(backup_bytes, password) {
        const ptr0 = passArray8ToWasm0(backup_bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_restoreBackup(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Rotate the pinned address for the given keychain.
     * keychain: 0 = External (colored), 1 = Internal (vanilla)
     * @param {number} keychain
     * @returns {string}
     */
    rotateAddress(keychain) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.wasmwallet_rotateAddress(this.__wbg_ptr, keychain);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Send RGB assets (begin): prepare a PSBT. Returns the unsigned PSBT string.
     *
     * `recipient_map_js` is a JS object mapping asset IDs to arrays of Recipient objects.
     * @param {any} online_js
     * @param {any} recipient_map_js
     * @param {boolean} donation
     * @param {bigint} fee_rate
     * @param {number} min_confirmations
     * @param {number | null} [lock_time]
     * @returns {Promise<string>}
     */
    sendBegin(online_js, recipient_map_js, donation, fee_rate, min_confirmations, lock_time) {
        const ret = wasm.wasmwallet_sendBegin(this.__wbg_ptr, online_js, recipient_map_js, donation, fee_rate, min_confirmations, isLikeNone(lock_time) ? 0x100000001 : (lock_time) >>> 0);
        return ret;
    }
    /**
     * Send BTC (begin): prepare a PSBT. Returns the unsigned PSBT string.
     * @param {any} online_js
     * @param {string} address
     * @param {bigint} amount
     * @param {bigint} fee_rate
     * @param {boolean} skip_sync
     * @returns {Promise<string>}
     */
    sendBtcBegin(online_js, address, amount, fee_rate, skip_sync) {
        const ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_sendBtcBegin(this.__wbg_ptr, online_js, ptr0, len0, amount, fee_rate, skip_sync);
        return ret;
    }
    /**
     * Send BTC (end): broadcast a signed PSBT. Returns the txid string.
     * @param {any} online_js
     * @param {string} signed_psbt
     * @param {boolean} skip_sync
     * @returns {Promise<string>}
     */
    sendBtcEnd(online_js, signed_psbt, skip_sync) {
        const ptr0 = passStringToWasm0(signed_psbt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_sendBtcEnd(this.__wbg_ptr, online_js, ptr0, len0, skip_sync);
        return ret;
    }
    /**
     * Send RGB assets (end): broadcast a signed PSBT. Returns an OperationResult JS object.
     * @param {any} online_js
     * @param {string} signed_psbt
     * @param {boolean} skip_sync
     * @returns {Promise<any>}
     */
    sendEnd(online_js, signed_psbt, skip_sync) {
        const ptr0 = passStringToWasm0(signed_psbt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_sendEnd(this.__wbg_ptr, online_js, ptr0, len0, skip_sync);
        return ret;
    }
    /**
     * Sign a PSBT (base64-encoded). Returns the signed PSBT string.
     * @param {string} unsigned_psbt
     * @returns {string}
     */
    signPsbt(unsigned_psbt) {
        let deferred3_0;
        let deferred3_1;
        try {
            const ptr0 = passStringToWasm0(unsigned_psbt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.wasmwallet_signPsbt(this.__wbg_ptr, ptr0, len0);
            var ptr2 = ret[0];
            var len2 = ret[1];
            if (ret[3]) {
                ptr2 = 0; len2 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * The outpoints a PSBT spends, as `"txid:vout"`.
     * @param {string} psbt
     * @returns {any}
     */
    static swapPsbtInputs(psbt) {
        const ptr0 = passStringToWasm0(psbt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_swapPsbtInputs(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Sync the wallet with the indexer.
     *
     * Incremental: re-queries only already-revealed SPKs. Use `fullScan` to recover a thin
     * restored state.
     * @param {any} online_js
     * @returns {Promise<void>}
     */
    sync(online_js) {
        const ret = wasm.wasmwallet_sync(this.__wbg_ptr, online_js);
        return ret;
    }
    /**
     * Upload an encrypted backup to the configured VSS server. Returns the server version.
     * @returns {Promise<any>}
     */
    vssBackup() {
        const ret = wasm.wasmwallet_vssBackup(this.__wbg_ptr);
        return ret;
    }
    /**
     * Query VSS backup status. Returns { backup_exists, server_version, backup_required }.
     * @returns {Promise<any>}
     */
    vssBackupInfo() {
        const ret = wasm.wasmwallet_vssBackupInfo(this.__wbg_ptr);
        return ret;
    }
    /**
     * Download and restore wallet state from VSS server.
     * @returns {Promise<void>}
     */
    vssRestoreBackup() {
        const ret = wasm.wasmwallet_vssRestoreBackup(this.__wbg_ptr);
        return ret;
    }
    /**
     * Create an address to receive RGB assets via witness TX. Returns ReceiveData as a JS object.
     * @param {string | null | undefined} asset_id
     * @param {any} assignment_js
     * @param {number | null | undefined} duration_seconds
     * @param {any} transport_endpoints_js
     * @param {number} min_confirmations
     * @returns {any}
     */
    witnessReceive(asset_id, assignment_js, duration_seconds, transport_endpoints_js, min_confirmations) {
        var ptr0 = isLikeNone(asset_id) ? 0 : passStringToWasm0(asset_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmwallet_witnessReceive(this.__wbg_ptr, ptr0, len0, assignment_js, isLikeNone(duration_seconds) ? 0x100000001 : (duration_seconds) >>> 0, transport_endpoints_js, min_confirmations);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}
if (Symbol.dispose) WasmWallet.prototype[Symbol.dispose] = WasmWallet.prototype.free;

/**
 * Check whether the provided URL points to a valid RGB proxy server.
 * @param {string} proxy_url
 * @returns {Promise<void>}
 */
export function checkProxyUrl(proxy_url) {
    const ptr0 = passStringToWasm0(proxy_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.checkProxyUrl(ptr0, len0);
    return ret;
}

/**
 * @param {string} network
 * @returns {any}
 */
export function generateKeys(network) {
    const ptr0 = passStringToWasm0(network, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.generateKeys(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

export function init() {
    wasm.init();
}

/**
 * @param {string} network
 * @param {string} mnemonic
 * @returns {any}
 */
export function restoreKeys(network, mnemonic) {
    const ptr0 = passStringToWasm0(network, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(mnemonic, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.restoreKeys(ptr0, len0, ptr1, len1);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Validate an RGB consignment using witness data bundled in the consignment (offchain).
 *
 * Works before the witness transaction is broadcast. Takes the raw consignment
 * bytes (strict-encoded, not base64), the witness transaction ID, and the Bitcoin network.
 *
 * Returns a JS object: `{ valid: boolean, warnings?: string[], error?: string, details?: string }`
 * @param {Uint8Array} consignment_bytes
 * @param {string} txid
 * @param {string} network
 * @returns {any}
 */
export function validateConsignmentOffchain(consignment_bytes, txid, network) {
    const ptr0 = passArray8ToWasm0(consignment_bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(txid, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(network, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.validateConsignmentOffchain(ptr0, len0, ptr1, len1, ptr2, len2);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg_Error_2e59b1b37a9a34c3: function(arg0, arg1) {
            const ret = Error(getStringFromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_Number_e6ffdb596c888833: function(arg0) {
            const ret = Number(arg0);
            return ret;
        },
        __wbg_String_8564e559799eccda: function(arg0, arg1) {
            const ret = String(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_bigint_get_as_i64_2c5082002e4826e2: function(arg0, arg1) {
            const v = arg1;
            const ret = typeof(v) === 'bigint' ? v : undefined;
            getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
        },
        __wbg___wbindgen_boolean_get_a86c216575a75c30: function(arg0) {
            const v = arg0;
            const ret = typeof(v) === 'boolean' ? v : undefined;
            return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
        },
        __wbg___wbindgen_debug_string_dd5d2d07ce9e6c57: function(arg0, arg1) {
            const ret = debugString(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_in_4bd7a57e54337366: function(arg0, arg1) {
            const ret = arg0 in arg1;
            return ret;
        },
        __wbg___wbindgen_is_bigint_6c98f7e945dacdde: function(arg0) {
            const ret = typeof(arg0) === 'bigint';
            return ret;
        },
        __wbg___wbindgen_is_function_49868bde5eb1e745: function(arg0) {
            const ret = typeof(arg0) === 'function';
            return ret;
        },
        __wbg___wbindgen_is_null_344c8750a8525473: function(arg0) {
            const ret = arg0 === null;
            return ret;
        },
        __wbg___wbindgen_is_object_40c5a80572e8f9d3: function(arg0) {
            const val = arg0;
            const ret = typeof(val) === 'object' && val !== null;
            return ret;
        },
        __wbg___wbindgen_is_string_b29b5c5a8065ba1a: function(arg0) {
            const ret = typeof(arg0) === 'string';
            return ret;
        },
        __wbg___wbindgen_is_undefined_c0cca72b82b86f4d: function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        },
        __wbg___wbindgen_jsval_eq_7d430e744a913d26: function(arg0, arg1) {
            const ret = arg0 === arg1;
            return ret;
        },
        __wbg___wbindgen_jsval_loose_eq_3a72ae764d46d944: function(arg0, arg1) {
            const ret = arg0 == arg1;
            return ret;
        },
        __wbg___wbindgen_number_get_7579aab02a8a620c: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'number' ? obj : undefined;
            getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
        },
        __wbg___wbindgen_string_get_914df97fcfa788f2: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_throw_81fc77679af83bc6: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg__wbg_cb_unref_3c3b4f651835fbcb: function(arg0) {
            arg0._wbg_cb_unref();
        },
        __wbg_abort_5ee4083ce26e0b01: function(arg0) {
            arg0.abort();
        },
        __wbg_abort_7a67cb8f9383baa1: function(arg0, arg1) {
            arg0.abort(arg1);
        },
        __wbg_append_4aa39f0c1ef8161e: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            arg0.append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        }, arguments); },
        __wbg_append_59da1e75d76c3126: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.append(getStringFromWasm0(arg1, arg2), arg3, getStringFromWasm0(arg4, arg5));
        }, arguments); },
        __wbg_append_c015600138ae60bb: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            arg0.append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        }, arguments); },
        __wbg_arrayBuffer_dae084a298aa5fe0: function() { return handleError(function (arg0) {
            const ret = arg0.arrayBuffer();
            return ret;
        }, arguments); },
        __wbg_call_7f2987183bb62793: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.call(arg1);
            return ret;
        }, arguments); },
        __wbg_call_d578befcc3145dee: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.call(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_clearTimeout_2256f1e7b94ef517: function(arg0) {
            const ret = clearTimeout(arg0);
            return ret;
        },
        __wbg_clearTimeout_6b8d9a38b9263d65: function(arg0) {
            const ret = clearTimeout(arg0);
            return ret;
        },
        __wbg_close_040c0e5be6c74f11: function(arg0) {
            arg0.close();
        },
        __wbg_createIndex_3b7d978a2177a0cf: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = arg0.createIndex(getStringFromWasm0(arg1, arg2), arg3, arg4);
            return ret;
        }, arguments); },
        __wbg_createObjectStore_6e567b25160be2fa: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.createObjectStore(getStringFromWasm0(arg1, arg2), arg3);
            return ret;
        }, arguments); },
        __wbg_crypto_38df2bab126b63dc: function(arg0) {
            const ret = arg0.crypto;
            return ret;
        },
        __wbg_deleteIndex_af52038711dd78b2: function() { return handleError(function (arg0, arg1, arg2) {
            arg0.deleteIndex(getStringFromWasm0(arg1, arg2));
        }, arguments); },
        __wbg_deleteObjectStore_42c1e82fe6d8a028: function() { return handleError(function (arg0, arg1, arg2) {
            arg0.deleteObjectStore(getStringFromWasm0(arg1, arg2));
        }, arguments); },
        __wbg_done_547d467e97529006: function(arg0) {
            const ret = arg0.done;
            return ret;
        },
        __wbg_entries_616b1a459b85be0b: function(arg0) {
            const ret = Object.entries(arg0);
            return ret;
        },
        __wbg_entries_69f235654ec4ccc6: function(arg0) {
            const ret = arg0.entries();
            return ret;
        },
        __wbg_error_38bec0a78dd8ded8: function(arg0) {
            console.error(arg0);
        },
        __wbg_error_58469b8474e13592: function() { return handleError(function (arg0) {
            const ret = arg0.error;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_error_ad2c52bad651cd14: function(arg0, arg1) {
            console.error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_error_c57846662bf0e748: function(arg0) {
            const ret = arg0.error;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_fetch_1a731e18c5e21884: function(arg0, arg1) {
            const ret = arg0.fetch(arg1);
            return ret;
        },
        __wbg_fetch_43b2f110608a59ff: function(arg0) {
            const ret = fetch(arg0);
            return ret;
        },
        __wbg_fetch_8d9b732df7467c44: function(arg0) {
            const ret = fetch(arg0);
            return ret;
        },
        __wbg_fetch_9dad4fe911207b37: function(arg0) {
            const ret = fetch(arg0);
            return ret;
        },
        __wbg_getRandomValues_3f44b700395062e5: function() { return handleError(function (arg0, arg1) {
            globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
        }, arguments); },
        __wbg_getRandomValues_c44a50d8cfdaebeb: function() { return handleError(function (arg0, arg1) {
            arg0.getRandomValues(arg1);
        }, arguments); },
        __wbg_getTime_f6ac312467f7cf09: function(arg0) {
            const ret = arg0.getTime();
            return ret;
        },
        __wbg_get_4848e350b40afc16: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        },
        __wbg_get_560cb483e5c0133e: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.get(arg1);
            return ret;
        }, arguments); },
        __wbg_get_dba5fa38b6597b3f: function(arg0, arg1, arg2) {
            const ret = arg1[arg2 >>> 0];
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_get_ed0642c4b9d31ddf: function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.get(arg0, arg1);
            return ret;
        }, arguments); },
        __wbg_get_f96702c6245e4ef9: function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.get(arg0, arg1);
            return ret;
        }, arguments); },
        __wbg_get_unchecked_7d7babe32e9e6a54: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        },
        __wbg_get_with_ref_key_6412cf3094599694: function(arg0, arg1) {
            const ret = arg0[arg1];
            return ret;
        },
        __wbg_has_3ec5c22db2e5237a: function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.has(arg0, arg1);
            return ret;
        }, arguments); },
        __wbg_headers_e08dcb5aa09b9a63: function(arg0) {
            const ret = arg0.headers;
            return ret;
        },
        __wbg_indexNames_82c4167bffa4c333: function(arg0) {
            const ret = arg0.indexNames;
            return ret;
        },
        __wbg_index_ce5a38731ba42f0d: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.index(getStringFromWasm0(arg1, arg2));
            return ret;
        }, arguments); },
        __wbg_instanceof_ArrayBuffer_ff7c1337a5e3b33a: function(arg0) {
            let result;
            try {
                result = arg0 instanceof ArrayBuffer;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Error_e3390d6805733dad: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Error;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_IdbDatabase_0af111edb4be95f4: function(arg0) {
            let result;
            try {
                result = arg0 instanceof IDBDatabase;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_IdbFactory_7c303c3d8528cef3: function(arg0) {
            let result;
            try {
                result = arg0 instanceof IDBFactory;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_IdbOpenDbRequest_92df356941adf31e: function(arg0) {
            let result;
            try {
                result = arg0 instanceof IDBOpenDBRequest;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_IdbRequest_fc5918c726448f04: function(arg0) {
            let result;
            try {
                result = arg0 instanceof IDBRequest;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_IdbTransaction_de69712ce07dde97: function(arg0) {
            let result;
            try {
                result = arg0 instanceof IDBTransaction;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Map_a10a2795ef4bfe97: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Map;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Response_06795eab66cc4036: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Response;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Uint8Array_4b8da683deb25d72: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Uint8Array;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_isArray_db61795ad004c139: function(arg0) {
            const ret = Array.isArray(arg0);
            return ret;
        },
        __wbg_isSafeInteger_ea83862ba994770c: function(arg0) {
            const ret = Number.isSafeInteger(arg0);
            return ret;
        },
        __wbg_iterator_de403ef31815a3e6: function() {
            const ret = Symbol.iterator;
            return ret;
        },
        __wbg_keyPath_137bba25d08d22b9: function() { return handleError(function (arg0) {
            const ret = arg0.keyPath;
            return ret;
        }, arguments); },
        __wbg_length_0c32cb8543c8e4c8: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_length_3804262ff442a7a3: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_length_6e821edde497a532: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_message_7367f8c7d0fa1589: function(arg0) {
            const ret = arg0.message;
            return ret;
        },
        __wbg_msCrypto_bd5a034af96bcba6: function(arg0) {
            const ret = arg0.msCrypto;
            return ret;
        },
        __wbg_multiEntry_9d4ec9fa9fa5a9d5: function(arg0) {
            const ret = arg0.multiEntry;
            return ret;
        },
        __wbg_name_cb583806cac84fe0: function(arg0) {
            const ret = arg0.name;
            return ret;
        },
        __wbg_new_0_bfa2ef4bc447daa2: function() {
            const ret = new Date();
            return ret;
        },
        __wbg_new_0fec9fb02d03a383: function() { return handleError(function (arg0, arg1) {
            const ret = new URL(getStringFromWasm0(arg0, arg1));
            return ret;
        }, arguments); },
        __wbg_new_3a112826a89cb962: function() { return handleError(function () {
            const ret = new Headers();
            return ret;
        }, arguments); },
        __wbg_new_4f9fafbb3909af72: function() {
            const ret = new Object();
            return ret;
        },
        __wbg_new_56a7f7f78a9437aa: function() { return handleError(function () {
            const ret = new FormData();
            return ret;
        }, arguments); },
        __wbg_new_7681c4155808e30a: function() { return handleError(function () {
            const ret = new URLSearchParams();
            return ret;
        }, arguments); },
        __wbg_new_99cabae501c0a8a0: function() {
            const ret = new Map();
            return ret;
        },
        __wbg_new_9abbf7148481485e: function() { return handleError(function () {
            const ret = new AbortController();
            return ret;
        }, arguments); },
        __wbg_new_a560378ea1240b14: function(arg0) {
            const ret = new Uint8Array(arg0);
            return ret;
        },
        __wbg_new_f3c9df4f38f3f798: function() {
            const ret = new Array();
            return ret;
        },
        __wbg_new_from_slice_2580ff33d0d10520: function(arg0, arg1) {
            const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_new_typed_14d7cc391ce53d2c: function(arg0, arg1) {
            try {
                var state0 = {a: arg0, b: arg1};
                var cb0 = (arg0, arg1) => {
                    const a = state0.a;
                    state0.a = 0;
                    try {
                        return wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke___js_sys_c84eb9a3aa788e7b___Function_fn_wasm_bindgen_fbfb77f5f81cea49___JsValue_____wasm_bindgen_fbfb77f5f81cea49___sys__Undefined___js_sys_c84eb9a3aa788e7b___Function_fn_wasm_bindgen_fbfb77f5f81cea49___JsValue_____wasm_bindgen_fbfb77f5f81cea49___sys__Undefined_______true_(a, state0.b, arg0, arg1);
                    } finally {
                        state0.a = a;
                    }
                };
                const ret = new Promise(cb0);
                return ret;
            } finally {
                state0.a = 0;
            }
        },
        __wbg_new_with_length_9cedd08484b73942: function(arg0) {
            const ret = new Uint8Array(arg0 >>> 0);
            return ret;
        },
        __wbg_new_with_str_9dca18ad543fe832: function() { return handleError(function (arg0, arg1) {
            const ret = new Request(getStringFromWasm0(arg0, arg1));
            return ret;
        }, arguments); },
        __wbg_new_with_str_and_init_f663b6d334baa878: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = new Request(getStringFromWasm0(arg0, arg1), arg2);
            return ret;
        }, arguments); },
        __wbg_new_with_u8_array_sequence_2ae9f5628c4df63c: function() { return handleError(function (arg0) {
            const ret = new Blob(arg0);
            return ret;
        }, arguments); },
        __wbg_next_01132ed6134b8ef5: function(arg0) {
            const ret = arg0.next;
            return ret;
        },
        __wbg_next_b3713ec761a9dbfd: function() { return handleError(function (arg0) {
            const ret = arg0.next();
            return ret;
        }, arguments); },
        __wbg_node_84ea875411254db1: function(arg0) {
            const ret = arg0.node;
            return ret;
        },
        __wbg_now_2c44418ca0623664: function(arg0) {
            const ret = arg0.now();
            return ret;
        },
        __wbg_now_88621c9c9a4f3ffc: function() {
            const ret = Date.now();
            return ret;
        },
        __wbg_objectStoreNames_990d8e55c661828b: function(arg0) {
            const ret = arg0.objectStoreNames;
            return ret;
        },
        __wbg_objectStore_3d4cade4416cd432: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.objectStore(getStringFromWasm0(arg1, arg2));
            return ret;
        }, arguments); },
        __wbg_open_254d9b392262d9ef: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.open(getStringFromWasm0(arg1, arg2));
            return ret;
        }, arguments); },
        __wbg_open_ac04ec9d75d0eeaf: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.open(getStringFromWasm0(arg1, arg2), arg3 >>> 0);
            return ret;
        }, arguments); },
        __wbg_process_44c7a14e11e9f69e: function(arg0) {
            const ret = arg0.process;
            return ret;
        },
        __wbg_prototypesetcall_3e05eb9545565046: function(arg0, arg1, arg2) {
            Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
        },
        __wbg_push_6bdbc990be5ac37b: function(arg0, arg1) {
            const ret = arg0.push(arg1);
            return ret;
        },
        __wbg_put_015a7e88e46a2502: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.put(arg1);
            return ret;
        }, arguments); },
        __wbg_put_4485a4012273f7ef: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.put(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_queueMicrotask_abaf92f0bd4e80a4: function(arg0) {
            const ret = arg0.queueMicrotask;
            return ret;
        },
        __wbg_queueMicrotask_df5a6dac26d818f3: function(arg0) {
            queueMicrotask(arg0);
        },
        __wbg_randomFillSync_6c25eac9869eb53c: function() { return handleError(function (arg0, arg1) {
            arg0.randomFillSync(arg1);
        }, arguments); },
        __wbg_require_b4edbdcf3e2a1ef0: function() { return handleError(function () {
            const ret = module.require;
            return ret;
        }, arguments); },
        __wbg_resolve_0a79de24e9d2267b: function(arg0) {
            const ret = Promise.resolve(arg0);
            return ret;
        },
        __wbg_result_452c1006fc727317: function() { return handleError(function (arg0) {
            const ret = arg0.result;
            return ret;
        }, arguments); },
        __wbg_search_bd3fc2fcfcfc32a2: function(arg0, arg1) {
            const ret = arg1.search;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_setTimeout_b188b3bcc8977c7d: function(arg0, arg1) {
            const ret = setTimeout(arg0, arg1);
            return ret;
        },
        __wbg_setTimeout_f757f00851f76c42: function(arg0, arg1) {
            const ret = setTimeout(arg0, arg1);
            return ret;
        },
        __wbg_set_08463b1df38a7e29: function(arg0, arg1, arg2) {
            const ret = arg0.set(arg1, arg2);
            return ret;
        },
        __wbg_set_6be42768c690e380: function(arg0, arg1, arg2) {
            arg0[arg1] = arg2;
        },
        __wbg_set_6c60b2e8ad0e9383: function(arg0, arg1, arg2) {
            arg0[arg1 >>> 0] = arg2;
        },
        __wbg_set_auto_increment_37227907cc70bd30: function(arg0, arg1) {
            arg0.autoIncrement = arg1 !== 0;
        },
        __wbg_set_body_a304d09cb50cefbe: function(arg0, arg1) {
            arg0.body = arg1;
        },
        __wbg_set_cache_cc687e2b96e9608c: function(arg0, arg1) {
            arg0.cache = __wbindgen_enum_RequestCache[arg1];
        },
        __wbg_set_credentials_7693e63055f5e838: function(arg0, arg1) {
            arg0.credentials = __wbindgen_enum_RequestCredentials[arg1];
        },
        __wbg_set_headers_6ab1105e542834e2: function(arg0, arg1) {
            arg0.headers = arg1;
        },
        __wbg_set_key_path_6edd6ee0e8d75af3: function(arg0, arg1) {
            arg0.keyPath = arg1;
        },
        __wbg_set_method_1971272fe557e972: function(arg0, arg1, arg2) {
            arg0.method = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_mode_d1b643087602281a: function(arg0, arg1) {
            arg0.mode = __wbindgen_enum_RequestMode[arg1];
        },
        __wbg_set_multi_entry_791aace5b9c7b692: function(arg0, arg1) {
            arg0.multiEntry = arg1 !== 0;
        },
        __wbg_set_name_87619993a0cec565: function(arg0, arg1, arg2) {
            arg0.name = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_onabort_6b6df7a41aa97c23: function(arg0, arg1) {
            arg0.onabort = arg1;
        },
        __wbg_set_oncomplete_20fb27150b4ee0d4: function(arg0, arg1) {
            arg0.oncomplete = arg1;
        },
        __wbg_set_onerror_2b7dfa4e6dea4159: function(arg0, arg1) {
            arg0.onerror = arg1;
        },
        __wbg_set_onerror_3c4b5087146b11b6: function(arg0, arg1) {
            arg0.onerror = arg1;
        },
        __wbg_set_onsuccess_f7e5b5cbed5008b1: function(arg0, arg1) {
            arg0.onsuccess = arg1;
        },
        __wbg_set_onupgradeneeded_d7e8e03a1999bf5d: function(arg0, arg1) {
            arg0.onupgradeneeded = arg1;
        },
        __wbg_set_onversionchange_f7822a34e73e2769: function(arg0, arg1) {
            arg0.onversionchange = arg1;
        },
        __wbg_set_search_527da9642b10495d: function(arg0, arg1, arg2) {
            arg0.search = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_signal_8564a226c5c6853c: function(arg0, arg1) {
            arg0.signal = arg1;
        },
        __wbg_set_unique_e8b9acd5c7c23d7a: function(arg0, arg1) {
            arg0.unique = arg1 !== 0;
        },
        __wbg_signal_9172c3282bfba2f5: function(arg0) {
            const ret = arg0.signal;
            return ret;
        },
        __wbg_static_accessor_GLOBAL_THIS_a1248013d790bf5f: function() {
            const ret = typeof globalThis === 'undefined' ? null : globalThis;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_GLOBAL_f2e0f995a21329ff: function() {
            const ret = typeof global === 'undefined' ? null : global;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_SELF_24f78b6d23f286ea: function() {
            const ret = typeof self === 'undefined' ? null : self;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_WINDOW_59fd959c540fe405: function() {
            const ret = typeof window === 'undefined' ? null : window;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_status_44ecb0ac1da253f4: function(arg0) {
            const ret = arg0.status;
            return ret;
        },
        __wbg_stringify_a2c39d991e1bf91d: function() { return handleError(function (arg0) {
            const ret = JSON.stringify(arg0);
            return ret;
        }, arguments); },
        __wbg_subarray_0f98d3fb634508ad: function(arg0, arg1, arg2) {
            const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
            return ret;
        },
        __wbg_target_732d56b173b7e87c: function(arg0) {
            const ret = arg0.target;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_text_43bdfba45e602cf9: function() { return handleError(function (arg0) {
            const ret = arg0.text();
            return ret;
        }, arguments); },
        __wbg_then_00eed3ac0b8e82cb: function(arg0, arg1, arg2) {
            const ret = arg0.then(arg1, arg2);
            return ret;
        },
        __wbg_then_a0c8db0381c8994c: function(arg0, arg1) {
            const ret = arg0.then(arg1);
            return ret;
        },
        __wbg_toString_6bb93e4c281b55a5: function(arg0) {
            const ret = arg0.toString();
            return ret;
        },
        __wbg_toString_891d991e862e1d44: function(arg0) {
            const ret = arg0.toString();
            return ret;
        },
        __wbg_transaction_904b9a3920efb0b5: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.transaction(arg1, __wbindgen_enum_IdbTransactionMode[arg2]);
            return ret;
        }, arguments); },
        __wbg_transaction_9c41d998bb80d12a: function(arg0) {
            const ret = arg0.transaction;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_unique_ae0d9cc0f38a6784: function(arg0) {
            const ret = arg0.unique;
            return ret;
        },
        __wbg_url_95d8a83d33709572: function(arg0, arg1) {
            const ret = arg1.url;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_url_fa6a0c3c3dd41ac6: function(arg0, arg1) {
            const ret = arg1.url;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_value_7f6052747ccf940f: function(arg0) {
            const ret = arg0.value;
            return ret;
        },
        __wbg_versions_276b2795b1c6a219: function(arg0) {
            const ret = arg0.versions;
            return ret;
        },
        __wbg_wasmwallet_new: function(arg0) {
            const ret = WasmWallet.__wrap(arg0);
            return ret;
        },
        __wbindgen_cast_0000000000000001: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [Externref], shim_idx: 3290, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke___wasm_bindgen_fbfb77f5f81cea49___JsValue__core_ed718c3d60ebd546___result__Result_____wasm_bindgen_fbfb77f5f81cea49___JsError___true_);
            return ret;
        },
        __wbindgen_cast_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("Event")], shim_idx: 1810, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke___web_sys_a631e2897884c5f1___features__gen_Event__Event______true_);
            return ret;
        },
        __wbindgen_cast_0000000000000003: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("IDBVersionChangeEvent")], shim_idx: 1316, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke___web_sys_a631e2897884c5f1___features__gen_IdbVersionChangeEvent__IdbVersionChangeEvent______true_);
            return ret;
        },
        __wbindgen_cast_0000000000000004: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [], shim_idx: 1592, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke_______true_);
            return ret;
        },
        __wbindgen_cast_0000000000000005: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [], shim_idx: 1756, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke_______true__1_);
            return ret;
        },
        __wbindgen_cast_0000000000000006: function(arg0) {
            // Cast intrinsic for `F64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_cast_0000000000000007: function(arg0) {
            // Cast intrinsic for `I64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_cast_0000000000000008: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(U8)) -> NamedExternref("Uint8Array")`.
            const ret = getArrayU8FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_cast_0000000000000009: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_cast_000000000000000a: function(arg0) {
            // Cast intrinsic for `U64 -> Externref`.
            const ret = BigInt.asUintN(64, arg0);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./rgb_lib_wasm_bindings_bg.js": import0,
    };
}

function wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke_______true_(arg0, arg1) {
    wasm.wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke_______true_(arg0, arg1);
}

function wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke_______true__1_(arg0, arg1) {
    wasm.wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke_______true__1_(arg0, arg1);
}

function wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke___web_sys_a631e2897884c5f1___features__gen_Event__Event______true_(arg0, arg1, arg2) {
    wasm.wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke___web_sys_a631e2897884c5f1___features__gen_Event__Event______true_(arg0, arg1, arg2);
}

function wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke___web_sys_a631e2897884c5f1___features__gen_IdbVersionChangeEvent__IdbVersionChangeEvent______true_(arg0, arg1, arg2) {
    wasm.wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke___web_sys_a631e2897884c5f1___features__gen_IdbVersionChangeEvent__IdbVersionChangeEvent______true_(arg0, arg1, arg2);
}

function wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke___wasm_bindgen_fbfb77f5f81cea49___JsValue__core_ed718c3d60ebd546___result__Result_____wasm_bindgen_fbfb77f5f81cea49___JsError___true_(arg0, arg1, arg2) {
    const ret = wasm.wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke___wasm_bindgen_fbfb77f5f81cea49___JsValue__core_ed718c3d60ebd546___result__Result_____wasm_bindgen_fbfb77f5f81cea49___JsError___true_(arg0, arg1, arg2);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke___js_sys_c84eb9a3aa788e7b___Function_fn_wasm_bindgen_fbfb77f5f81cea49___JsValue_____wasm_bindgen_fbfb77f5f81cea49___sys__Undefined___js_sys_c84eb9a3aa788e7b___Function_fn_wasm_bindgen_fbfb77f5f81cea49___JsValue_____wasm_bindgen_fbfb77f5f81cea49___sys__Undefined_______true_(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen_fbfb77f5f81cea49___convert__closures_____invoke___js_sys_c84eb9a3aa788e7b___Function_fn_wasm_bindgen_fbfb77f5f81cea49___JsValue_____wasm_bindgen_fbfb77f5f81cea49___sys__Undefined___js_sys_c84eb9a3aa788e7b___Function_fn_wasm_bindgen_fbfb77f5f81cea49___JsValue_____wasm_bindgen_fbfb77f5f81cea49___sys__Undefined_______true_(arg0, arg1, arg2, arg3);
}


const __wbindgen_enum_IdbTransactionMode = ["readonly", "readwrite", "versionchange", "readwriteflush", "cleanup"];


const __wbindgen_enum_RequestCache = ["default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached"];


const __wbindgen_enum_RequestCredentials = ["omit", "same-origin", "include"];


const __wbindgen_enum_RequestMode = ["same-origin", "no-cors", "cors", "navigate"];
const WasmInvoiceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasminvoice_free(ptr >>> 0, 1));
const WasmWalletFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmwallet_free(ptr >>> 0, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => wasm.__wbindgen_destroy_closure(state.a, state.b));

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function makeMutClosure(arg0, arg1, f) {
    const state = { a: arg0, b: arg1, cnt: 1 };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            wasm.__wbindgen_destroy_closure(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasm;
function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('rgb_lib_wasm_bindings_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
