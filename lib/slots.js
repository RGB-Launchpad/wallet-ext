// Allocation slot rules: whether the wallet may create slots, how many, and what a failed send
// means. Pure, so it is testable outside the browser; balances and UTXOs come from offscreen.js.
import { DEFAULTS, LIMITS } from "../config.js";

/**
 * What creating `count` slots costs at `rate` sat/vB: the sats parked in the slots themselves
 * plus the fee for the transaction that splits them out.
 */
export function slotCost(rate, count = DEFAULTS.utxoNum) {
    const need = BigInt(count) * BigInt(DEFAULTS.utxoSizeSat)
        + BigInt(rate) * BigInt(LIMITS.prepareVsize);
    const floor = BigInt(LIMITS.minSatToPrepare);
    return need > floor ? need : floor;
}

/**
 * Reason the wallet must not create slots yet, or null when it may.
 *
 * NOTE: an unconfirmed input blocks the whole batch, not part of it. rgb-lib's split
 * transaction takes every vanilla input at once (`add_utxos(inputs).manually_selected_only()`)
 * and the set cannot be filtered through its API, so one replaceable parent puts every slot in
 * the batch at risk — and an RGB allocation received into a slot that disappears cannot be
 * re-derived from the recovery phrase.
 */
export function slotBlocker({ settled, spendable }, rate, count = DEFAULTS.utxoNum) {
    const confirmed = BigInt(settled);
    const pending = BigInt(spendable) - confirmed;
    if (pending > 0n) {
        return `Waiting for ${pending} sats to confirm. Slots are built from every Bitcoin `
            + `input at once, so one unconfirmed input would put all of them at risk.`;
    }
    const cost = slotCost(rate, count);
    if (confirmed < cost) {
        return `Not enough Bitcoin to create slots: needs about ${cost} sats at ${rate} sat/vB, `
            + `the wallet has ${confirmed}. Fund its Bitcoin address.`;
    }
    return null;
}

/**
 * Empty colored UTXOs large enough to pay for being spent: colorable, broadcast, no
 * allocations, no pending blind receive, and at least `DEFAULTS.utxoSizeSat` in them.
 *
 * NOTE: an RGB send pays its fee only from colored UTXOs, never from the vanilla balance. When
 * the UTXO holding the asset cannot cover the fee, rgb-lib adds empty colored UTXOs as inputs,
 * largest first. Slots that are empty but small add almost nothing at a normal fee rate, so
 * they do not count here.
 */
export function usableEmptySlots(unspents) {
    return (unspents || []).filter((u) =>
        u.utxo?.colorable
        && u.utxo.exists !== false
        && (u.rgbAllocations || []).length === 0
        && Number(u.pendingBlinded || 0) === 0
        && BigInt(String(u.utxo.btcAmount ?? 0)) >= BigInt(DEFAULTS.utxoSizeSat),
    ).length;
}

/**
 * How many slots to create so that `DEFAULTS.utxoNum` usable empty ones exist.
 *
 * NOTE: counting spare room on UTXOs that already hold assets would report slots as
 * available while every send from those UTXOs fails on fees.
 */
export function slotsToCreate(unspents) {
    return Math.max(0, DEFAULTS.utxoNum - usableEmptySlots(unspents));
}

/**
 * Turns rgb-lib's "Insufficient allocations" on a send into what it means for this wallet;
 * any other message passes through unchanged.
 *
 * NOTE: rgb-lib raises it when the colored inputs cannot pay the fee and no empty colored
 * UTXO is left to add, as long as the vanilla balance is above 2000 sats. A wallet full of
 * plain bitcoin therefore sees a message about allocations when the shortfall is sats in its
 * slots.
 */
export function explainSendError(message, rate) {
    const text = String(message ?? "");
    if (!/insufficient allocations/i.test(text)) return text;
    return `The UTXOs holding this asset cannot pay the fee at ${rate} sat/vB, and no empty `
        + `slot is left to add. Create slots on the Receive screen, or lower the fee rate.`;
}
