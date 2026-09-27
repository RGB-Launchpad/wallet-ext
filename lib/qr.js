// A QR code as one SVG path, drawn at whatever size the caller renders it.
//
// The encoder is `vendor/qrcode-generator.js` (MIT, unmodified). It is UMD, so it is loaded as
// a classic script and reached through `globalThis.qrcode`; this module only turns the module
// matrix into geometry.
//
// NOTE: the text is encoded as UTF-8 bytes. `addData` takes a binary string, so a character
// above U+00FF has to be widened first or it is encoded as one byte and the scanner reads
// something else back. Invoices and addresses are ASCII, which is why this is easy to miss.
//
// NOTE: error correction M, the level a wallet address is normally printed at. A higher level
// buys damage tolerance nobody needs on a screen and costs modules, which at 150px makes the
// cells too small for some phone cameras.

const MARGIN = 2; // quiet zone, in modules. The spec asks for 4; 2 is what fits a 380px popup.

/** The encoder, or null when the vendor script has not loaded. */
function encoder() {
  return typeof globalThis.qrcode === "function" ? globalThis.qrcode : null;
}

/** UTF-8 bytes as a binary string, which is what `addData` expects. */
function utf8(text) {
  const bytes = new TextEncoder().encode(text);
  let out = "";
  for (const b of bytes) out += String.fromCharCode(b);
  return out;
}

/**
 * The matrix as an SVG path plus the side it is drawn on, in modules.
 *
 * Returns null when the text cannot be encoded: too long for the largest symbol, or the
 * vendor script missing. The caller shows the text on its own rather than an empty frame.
 */
export function qrPath(text) {
  const qrcode = encoder();
  if (!qrcode || !text) return null;
  let qr;
  try {
    qr = qrcode(0, "M"); // 0: pick the smallest version that fits
    qr.addData(utf8(text), "Byte");
    qr.make();
  } catch {
    return null;
  }
  const count = qr.getModuleCount();
  let d = "";
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!qr.isDark(r, c)) continue;
      d += `M${c + MARGIN} ${r + MARGIN}h1v1h-1z`;
    }
  }
  return { d, side: count + MARGIN * 2 };
}

/**
 * Draw `text` into `el`, or empty it when the text cannot be encoded.
 *
 * The svg is rebuilt rather than patched: an invoice is single use, so the code changes as a
 * whole every time.
 */
export function renderQr(el, text) {
  if (!el) return false;
  const qr = qrPath(text);
  el.textContent = "";
  if (!qr) return false;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${qr.side} ${qr.side}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "QR code");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", qr.d);
  svg.append(path);
  el.append(svg);
  return true;
}
