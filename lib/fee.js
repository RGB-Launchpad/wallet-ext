// Fee bidding maths. Pure, so it is testable outside the browser; the fetch that feeds it
// lives in offscreen.js.
import { FEE } from "../config.js";

/**
 * Rate that clears the front of the mempool: walk the histogram down until one block is
 * full. Esplora returns `fee_histogram` as `[[sat/vB, vsize], …]`, highest rate first.
 *
 * Returns 0 when the whole queue fits in one block — nothing has to be outbid, so the
 * floor in `bid` decides.
 */
export function clearingRate(histogram, fee = FEE) {
    let vsize = 0;
    for (const [rate, size] of histogram || []) {
        vsize += size;
        if (vsize >= fee.blockVsize) return rate;
    }
    return 0;
}

/**
 * What to bid, in sat/vB, from whatever rate signals were collected.
 *
 * The floor does the real work. Measured on signet 2026-09-11: esplora's own estimate said
 * 0.1 sat/vB for a 6-block target while blocks were clearing at 4.07, which is how a
 * platform withdrawal ended up sitting in the mempool. Non-numbers are dropped rather than
 * poisoning the maximum, so a missing signal costs nothing. `fee` is the network's bidding
 * parameters, from `feeFor` in config.js.
 */
export function bid(rates, fee = FEE) {
    const usable = (rates || []).filter((n) => Number.isFinite(n) && n > 0);
    const top = Math.max(0, ...usable);
    return Math.min(fee.max, Math.max(fee.min, Math.ceil(top * fee.safety)));
}
