// Amount conversion.
import { test } from "node:test";
import assert from "node:assert/strict";
import { fromRaw, toRaw, sats, amountOf, ago } from "../lib/fmt.js";

test("base units to human units", () => {
    assert.equal(fromRaw("100000000", 8), "1");
    assert.equal(fromRaw("123456789", 8), "1.23456789");
    assert.equal(fromRaw("1", 8), "0.00000001");
    assert.equal(fromRaw("0", 8), "0");
    assert.equal(fromRaw("1000", 0), "1000");       // precision 0
    assert.equal(fromRaw("1500000000", 9), "1.5");  // a precision-9 asset must not be read as 8
});

test("trailing zeros are dropped, the integer part is not", () => {
    assert.equal(fromRaw("1200000000", 8), "12");
    assert.equal(fromRaw("100000000000", 8), "1000");
});

test("human units to base units, strings only, never a float", () => {
    assert.equal(toRaw("1", 8), "100000000");
    assert.equal(toRaw("0.00000001", 8), "1");
    assert.equal(toRaw("1.5", 9), "1500000000");
    assert.equal(toRaw(".5", 8), "50000000");
    assert.equal(toRaw("1000", 0), "1000");
});

test("large amounts keep full precision where Number would not", () => {
    // 1e9 * 1e8 = 1e17, past 2^53
    assert.equal(toRaw("1000000000", 8), "100000000000000000");
    assert.equal(fromRaw("100000000000000000", 8), "1000000000");
    // a round trip through a float changes the value
    assert.notEqual(String(Number("100000000000000000") + 1), "100000000000000001");
});

test("too many decimals is an error, never a silent truncation", () => {
    assert.throws(() => toRaw("0.123456789", 8), /At most 8 decimals/);
    assert.throws(() => toRaw("0.1", 0), /At most 0 decimals/);
    assert.throws(() => toRaw("abc", 8), /Invalid amount/);
});

test("real custodial balances keep full precision", () => {
    // Real balances, all past 2^53 (9.007e15), where Number silently changes the value.
    assert.equal(fromRaw("14223796893956079", 8), "142237968.93956079");
    assert.equal(fromRaw("54296160877513711", 8), "542961608.77513711");
    assert.equal(fromRaw("28366762177650429", 8), "283667621.77650429");
    assert.equal(fromRaw("8950527990742079", 8), "89505279.90742079");
    // the last digits are wrong once it becomes a float
    assert.notEqual(String(Number("14223796893956079")), "14223796893956079");
});

test("sats and BTC", () => {
    assert.equal(sats.toBtc("100000000"), "1");
    assert.equal(sats.toBtc("1"), "0.00000001");
    assert.equal(sats.fromBtc("0.001"), "100000");
});

// The Bitcoin send form accepts BTC and converts here before anything reaches the engine.
// A dropped digit is a wrong amount, so over-precision must be refused, not truncated.
test("BTC input over 8 decimals is refused, never rounded", () => {
    assert.throws(() => sats.fromBtc("0.000000001"), /At most 8 decimals/);
    assert.throws(() => sats.fromBtc("1.234567891"), /At most 8 decimals/);
    // exactly 8 is fine
    assert.equal(sats.fromBtc("0.00000001"), "1");
});

test("BTC input rejects anything that is not a plain decimal", () => {
    for (const bad of ["abc", "1e-3", "0x10", "1,5", "1.2.3"]) {
        assert.throws(() => sats.fromBtc(bad), /Invalid amount/, `should reject ${JSON.stringify(bad)}`);
    }
});

// NOTE: toBtc does not validate; it pads whatever it is given. Callers that feed it user
// input must check first. Pinned so nobody assumes it is safe to call directly.
test("toBtc does not validate its input", () => {
    assert.equal(sats.toBtc("1.5"), "0.000001.5");      // not a number at all
    assert.equal(sats.toBtc("abc"), "0.00000abc");
    assert.equal(sats.toBtc("-5"), "-0.00000005");      // sign survives
});

// Blank input converts to "0" instead of throwing, so the caller has to trim and reject
// empty before converting. Pinned so that guard is not removed as redundant.
test("blank BTC input converts to zero, so the caller must reject it first", () => {
    assert.equal(sats.fromBtc(""), "0");
    assert.equal(sats.fromBtc(" "), "0");
    assert.equal(sats.fromBtc("0."), "0");
});

// fromBtc itself is sign-agnostic; the caller is what keeps a negative out of a send.
// Pinned here so the guard in popup.js is not quietly dropped later.
test("a negative BTC amount converts but is not a valid send amount", () => {
    assert.equal(sats.fromBtc("-1"), "-100000000");
    assert.equal(/^\d+$/.test(sats.fromBtc("-1")), false);
});

test("round trip holds at amounts that break floats", () => {
    for (const s of ["1", "546", "100000", "2100000000000000", "89505279907420"]) {
        assert.equal(sats.fromBtc(sats.toBtc(s)), s);
    }
});

test("unknown precision shows the raw value and is flagged, never defaulted to 8", () => {
    const unknown = amountOf("123456789", null);
    assert.equal(unknown.unknown, true);
    assert.equal(unknown.text, "123456789");        // not "1.23456789"
    const known = amountOf("123456789", 8);
    assert.equal(known.unknown, false);
    assert.equal(known.text, "1.23456789");
    assert.equal(amountOf("1", undefined).unknown, true);
});

test("negative amounts (reversal entries) are correct too", () => {
    assert.equal(fromRaw("-100000000", 8), "-1");
    assert.equal(toRaw("-1.5", 8), "-150000000");
});

test("ago reports a compact age, so a pending transfer reads as fresh or stale", () => {
    const now = 1_000_000;
    assert.equal(ago(now - 5, now), "5s");
    assert.equal(ago(now - 59, now), "59s");
    assert.equal(ago(now - 60, now), "1m");
    assert.equal(ago(now - 12 * 60, now), "12m");
    assert.equal(ago(now - 3600, now), "1h");
    assert.equal(ago(now - 26 * 3600, now), "1d");
});

test("ago says nothing rather than guessing on a missing or future timestamp", () => {
    const now = 1_000_000;
    assert.equal(ago(undefined, now), "");
    assert.equal(ago(null, now), "");
    assert.equal(ago(now + 30, now), "");
});
