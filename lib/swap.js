// Peer-to-peer swap rules that need no engine. Pure, so they are testable outside the browser.

/**
 * The vanilla output a swap pays from: the smallest unspent one holding more than `need` sats,
 * as `{ outpoint: "txid:vout", sats }`, or `null`.
 *
 * `outputs` is what `listUnspentsVanilla` returns: BDK `LocalOutput`s, not rgb-lib `Unspent`s.
 * The vanilla keychain never holds an allocation, so nothing here can carry an asset; a colored
 * input would be spent without a state transition for what it carries, destroying it.
 */
export function pickSwapInput(outputs, need) {
    const want = BigInt(need);
    const pick = (outputs || [])
        .filter((o) => !o.is_spent && typeof o.outpoint === "string")
        .map((o) => ({ outpoint: o.outpoint, sats: BigInt(String(o.txout?.value ?? 0)) }))
        .filter((o) => o.sats > want)
        .sort((a, b) => (a.sats < b.sats ? -1 : a.sats > b.sats ? 1 : 0))[0];
    return pick ? { outpoint: pick.outpoint, sats: String(pick.sats) } : null;
}

/**
 * The colored UTXO a sale colours from: the one holding the least of `assetId` that still covers
 * `amount`, settled only, as `{ outpoint: "txid:vout", sats }`, or `null`.
 *
 * `unspents` is what `listUnspents` returns (rgb-lib `Unspent`s). One UTXO is used: what it holds
 * beyond `amount` goes back to this wallet as change on another UTXO.
 */
export function pickSellerInput(unspents, assetId, amount) {
    const want = BigInt(amount);
    const held = (u) => (u.rgbAllocations || [])
        .filter((a) => a.assetId === assetId && a.settled && a.assignment?.Fungible !== undefined)
        .reduce((s, a) => s + BigInt(String(a.assignment.Fungible)), 0n);
    const pick = (unspents || [])
        .filter((u) => u.utxo?.colorable && u.utxo.exists !== false)
        .map((u) => ({ u, held: held(u) }))
        .filter((x) => x.held >= want)
        .sort((a, b) => (a.held < b.held ? -1 : a.held > b.held ? 1 : 0))[0];
    if (!pick) return null;
    const o = pick.u.utxo.outpoint;
    return { outpoint: `${o.txid}:${o.vout}`, sats: String(pick.u.utxo.btcAmount) };
}

/** What a seller receives: the price plus what its colored input holds beyond the seal. */
export function sellerPayout(priceSats, sellerInputSats, sealSats) {
    const extra = BigInt(sellerInputSats) - BigInt(sealSats);
    if (extra < 0n) throw new Error(`The colored input holds ${sellerInputSats} sats, the seal needs ${sealSats}`);
    return BigInt(priceSats) + extra;
}

/**
 * What of `assetId` this wallet can sell: the settled total, and the most one offer can ask
 * (`max`), which is the largest settled holding on a single UTXO, since a sale colours from one.
 */
export function sellable(unspents, assetId) {
    let total = 0n, max = 0n;
    for (const u of unspents || []) {
        if (!u.utxo?.colorable || u.utxo.exists === false) continue;
        const held = (u.rgbAllocations || [])
            .filter((a) => a.assetId === assetId && a.settled && a.assignment?.Fungible !== undefined)
            .reduce((s, a) => s + BigInt(String(a.assignment.Fungible)), 0n);
        total += held;
        if (held > max) max = held;
    }
    return { total: String(total), max: String(max) };
}
