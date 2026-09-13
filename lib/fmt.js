// Amount formatting. Values stay strings or BigInt.

/** Base units to human units. `raw` is a string. */
export function fromRaw(raw, precision) {
    const neg = String(raw).startsWith("-");
    const s = String(raw).replace("-", "");
    const p = Number(precision);
    if (!Number.isInteger(p) || p < 0) return String(raw);   // unknown precision: show raw
    const pad = s.padStart(p + 1, "0");
    const int = pad.slice(0, pad.length - p);
    const frac = p ? pad.slice(pad.length - p).replace(/0+$/, "") : "";
    return (neg ? "-" : "") + (frac ? `${int}.${frac}` : int);
}

/** Human units to base units by string padding. */
export function toRaw(human, precision) {
    const p = Number(precision);
    const m = String(human).trim().match(/^(-?)(\d*)(?:\.(\d*))?$/);
    if (!m) throw new Error("Invalid amount");
    const [, sign, int = "0", frac = ""] = m;
    if (frac.length > p) throw new Error(`At most ${p} decimals`);
    return BigInt(sign + (int || "0") + frac.padEnd(p, "0")).toString();
}

/** sats to BTC and back. */
export const sats = {
    toBtc: (s) => fromRaw(s, 8),
    fromBtc: (b) => toRaw(b, 8),
};

/**
 * Formats for display. With unknown precision it returns the raw base-unit value and sets
 * `unknown`; callers must not substitute a default precision.
 */
export function amountOf(raw, precision) {
    return precision === null || precision === undefined
        ? { text: String(raw), unknown: true }
        : { text: fromRaw(raw, precision), unknown: false };
}

/**
 * Compact age of a unix-seconds timestamp, for telling "just sent" apart from "stuck".
 * Returns "" for a missing or future timestamp rather than guessing.
 */
export function ago(unixSeconds, now = Math.floor(Date.now() / 1000)) {
    if (unixSeconds == null) return "";      // Number(null) is 0, which would read as 1970
    const s = now - Number(unixSeconds);
    if (!Number.isFinite(s) || s < 0) return "";
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`;
    return `${Math.floor(s / 86400)}d`;
}
