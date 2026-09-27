// The QR encoder, pinned by the vectors that ship with it, and the geometry built on top.
//
// The vendored file is unmodified upstream, so what has to be checked here is that this copy
// still produces the upstream bytes, and that `lib/qr.js` reads the matrix correctly: a QR that
// encodes the wrong string looks exactly like one that encodes the right string.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// UMD: no `window`, so it takes the CommonJS branch. `module` is what it writes itself into.
const load = () => {
  const src = readFileSync(new URL("../vendor/qrcode-generator.js", import.meta.url), "utf8");
  const module = { exports: {} };
  new Function("module", "exports", src)(module, module.exports);
  return module.exports;
};

const qrcode = load();

test("the vendored encoder still produces the upstream image", () => {
  const source = "http://www.example.com/ążśźęćńół";
  const expected =
    "R0lGODdhSgBKAIAAAAAAAP///ywAAAAASgBKAAAC/4yPqcvtD6OctNqLs968+w+G4kiWZgKk6roa7ZEi" +
    "ccACco1TeE6r9997uXYsna0xmw0VLyXsyHBCpKijk9qEPh1UrrXYAy4Xu3FtLEmCr9pucP3NGofyN9pe" +
    "BZ7DE3W9Tqd15+fDlxZXiPVlltiGqDb3BpnHRzj4uNgnSHkjZCiZGbXpRVrlyQZINopE9Jc5CdtaeCj7" +
    "asvIWEvimet4oqkYKDZiCSrMWtobmcW8esfki2exN4XY2cj7aZQtehxIGHwR+41dDg3tdogLCm7N+ZTO" +
    "Oom+irqZGk//DF/vqDiv7cEpTMW4CZxVYSC5gghpOTt46dg4PGxE5aNUkeItje3Drm3zh9DewIytPl7L" +
    "uBCkHiImpbEjaAvlloTm+DVzJXNftZM89lAz5vLiOZs94YysqZNmtZ8/vQiFeJApmKUPu30qU6mhKola" +
    "1V0t6g2ZxqcaAK4biraE2axW004LyeNs1loGHfIkGY3uVLV7Ge4rSayvu7WAHQIGGMvn4KqqdLGd2S5x" +
    "KE2lit2dfIlswJVhU/5VSRmoyEbr9NbdKhqkq156l8GJCFQZ0aRWFcOWGtZ2aN2IN3LlvPv149Kg8UZq" +
    "i5ElP+JvkyXH+ns4MFnR/+0F/vEw6YDQk//6Dj68+PHky5s/jz69+vULCgAAOw==";
  // The upstream test passes the string as raw bytes, which is what `unescape(encodeURI(s))` is.
  const bytes = [...new TextEncoder().encode(source)].map((b) => String.fromCharCode(b)).join("");
  const qr = qrcode(-1, "M");
  qr.addData(bytes);
  qr.make();
  assert.equal(qr.createDataURL().replace("data:image/gif;base64,", ""), expected);
});

test("a byte-mode symbol is the size the version says", () => {
  // Version 2 at error correction M holds 26 bytes; 27 needs version 3.
  const side = (text) => {
    const qr = qrcode(0, "M");
    qr.addData(text, "Byte");
    qr.make();
    return qr.getModuleCount();
  };
  assert.equal(side("a".repeat(26)), 25); // version 2: 17 + 4 x 2
  assert.equal(side("a".repeat(27)), 29); // version 3
});

// `lib/qr.js` needs a DOM only for `renderQr`; `qrPath` is pure and is what carries the geometry.
test("the path has one square per dark module, inside the quiet zone", async () => {
  globalThis.qrcode = qrcode;
  const { qrPath } = await import("../lib/qr.js");
  const text = "bcrt1pppvwtdsk9k46Oqwm0dx7hj0fw467j3hp24e4kxlv6xha8Oax5hwqsatxdg";
  const out = qrPath(text);
  assert.ok(out, "an address encodes");

  const qr = qrcode(0, "M");
  qr.addData([...new TextEncoder().encode(text)].map((b) => String.fromCharCode(b)).join(""), "Byte");
  qr.make();
  const count = qr.getModuleCount();
  let dark = 0;
  for (let r = 0; r < count; r++) for (let c = 0; c < count; c++) if (qr.isDark(r, c)) dark++;

  assert.equal(out.side, count + 4, "two modules of quiet zone on each side");
  assert.equal(out.d.match(/M/g).length, dark, "one square per dark module");
  // The first dark module is the top-left finder, which starts at the quiet zone's corner.
  assert.ok(out.d.startsWith("M2 2h1v1h-1z"));
});

test("text that cannot be encoded returns null rather than an empty code", async () => {
  globalThis.qrcode = qrcode;
  const { qrPath } = await import("../lib/qr.js");
  assert.equal(qrPath(""), null);
  assert.equal(qrPath("a".repeat(5000)), null, "past the largest symbol");
  globalThis.qrcode = undefined;
  assert.equal(qrPath("abc"), null, "without the vendor script");
  globalThis.qrcode = qrcode;
});
