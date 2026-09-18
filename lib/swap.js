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
