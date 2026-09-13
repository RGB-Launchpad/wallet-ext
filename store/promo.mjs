// Chrome Web Store promo tiles.
//
//     node store/promo.mjs [outDir]
//
// 440x280 "small" and 1400x560 "marquee". Written as JPEG on purpose: the dashboard wants
// "JPEG or 24-bit PNG (no alpha)", and a PNG from a headless browser carries an alpha
// channel whether or not anything is transparent. JPEG cannot have one.
//
// The wallet icon is inlined from icons/icon.svg rather than linked, so the page needs no
// network access and the tile cannot render with a missing image.
import { readFileSync } from "node:fs";

let chromium;
try { ({ chromium } = await import(process.env.PLAYWRIGHT || "playwright")); }
catch { console.error("playwright not found: npm i playwright, or set PLAYWRIGHT=<path to index.mjs>"); process.exit(2); }

const OUT = process.argv[2] || "store/promo";
const ICON = readFileSync(new URL("../icons/icon.svg", import.meta.url), "utf8");

const tile = (w, h, { icon, title, sub, gap, iconSize, titleSize, subSize }) => `
<!doctype html><meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  body { margin:0; width:${w}px; height:${h}px; display:flex; align-items:center;
         justify-content:center; gap:${gap}px; overflow:hidden;
         background:linear-gradient(135deg,#11131a 0%,#1b2030 48%,#141826 100%);
         font:400 16px/1.4 -apple-system, system-ui, "Helvetica Neue", sans-serif;
         color:#f3f5f8; }
  /* A soft highlight behind the mark so the tile does not read as a flat rectangle. */
  body::before { content:""; position:absolute; width:${h * 1.5}px; height:${h * 1.5}px;
                 border-radius:50%; left:-${h * 0.35}px; top:-${h * 0.5}px;
                 background:radial-gradient(circle,rgba(120,150,255,.20) 0%,rgba(120,150,255,0) 68%); }
  .mark { width:${iconSize}px; height:${iconSize}px; flex:none; position:relative;
          border-radius:${Math.round(iconSize * 0.22)}px; background:#fff; padding:${Math.round(iconSize * 0.1)}px;
          box-shadow:0 10px 30px rgba(0,0,0,.34); display:grid; place-items:center; }
  .mark svg { width:100%; height:100%; display:block; }
  .copy { position:relative; max-width:${Math.round(w * 0.56)}px; }
  .t { font-size:${titleSize}px; font-weight:650; letter-spacing:-0.02em; line-height:1.12; }
  .s { margin-top:${Math.round(subSize * 0.55)}px; font-size:${subSize}px; color:#aeb6c6;
       line-height:1.42; }
</style>
<div class="mark">${icon}</div>
<div class="copy"><div class="t">${title}</div><div class="s">${sub}</div></div>
`;

const TILES = [
    { name: "small-440x280", w: 440, h: 280,
      opts: { icon: ICON, title: "RGB Wallet", sub: "RGB assets on Bitcoin.<br>Keys stay on your device.",
              gap: 22, iconSize: 96, titleSize: 30, subSize: 14 } },
    { name: "marquee-1400x560", w: 1400, h: 560,
      opts: { icon: ICON, title: "RGB Wallet",
              sub: "Self-custodial RGB assets on Bitcoin. Your recovery phrase, keys and "
                 + "consignments are generated and kept on your own device.",
              gap: 64, iconSize: 232, titleSize: 78, subSize: 27 } },
];

const b = await chromium.launch();
for (const t of TILES) {
    const ctx = await b.newContext({ viewport: { width: t.w, height: t.h }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.setContent(tile(t.w, t.h, t.opts));
    await p.waitForTimeout(250);
    await p.screenshot({ path: `${OUT}/${t.name}.jpg`, type: "jpeg", quality: 92 });
    console.log(`  ${t.name}.jpg  ${t.w}x${t.h}`);
    await ctx.close();
}
await b.close();
