// Chrome Web Store promo tiles.
//
//     node store/promo.mjs [outDir]
//
// 440x280 "small" and 1400x560 "marquee". Written as JPEG on purpose: the dashboard wants
// "JPEG or 24-bit PNG (no alpha)", and a PNG from a headless browser carries an alpha
// channel whether or not anything is transparent. JPEG cannot have one.
//
// The logo, the illustration and the fonts are inlined as data URLs, so the page needs no
// network access and a tile cannot render with a missing image or a fallback face.
import { readFileSync } from "node:fs";

let chromium;
try { ({ chromium } = await import(process.env.PLAYWRIGHT || "playwright")); }
catch { console.error("playwright not found: npm i playwright, or set PLAYWRIGHT=<path to index.mjs>"); process.exit(2); }

const OUT = process.argv[2] || "store/promo";
const data = (path, type) => `data:${type};base64,${readFileSync(new URL(`../${path}`, import.meta.url)).toString("base64")}`;
// The palette comes from popup.css, so a token change cannot leave the tiles behind.
const TOKENS = Object.fromEntries(
  [...readFileSync(new URL("../popup.css", import.meta.url), "utf8")
    .matchAll(/(--color-[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]),
);
const c = (name) => {
  const v = TOKENS[name];
  if (!v) throw new Error(`popup.css has no ${name}`);
  return v;
};
const LOGO = data("img/logo.webp", "image/webp");
const ART = data("img/lab.webp", "image/webp");
const ARCHIVO = data("fonts/archivo.woff2", "font/woff2");
const MONO = data("fonts/jetbrains-mono.woff2", "font/woff2");
const PLEX = data("fonts/plex-400.woff2", "font/woff2");

const tile = (w, h, { sub, logo, word, tag, subSize, pad }) => `
<!doctype html><meta charset="utf-8">
<style>
  @font-face { font-family: "Archivo"; src: url(${ARCHIVO}) format("woff2"); font-weight: 100 900; font-stretch: 62% 125%; }
  @font-face { font-family: "JetBrains Mono"; src: url(${MONO}) format("woff2"); font-weight: 100 800; }
  @font-face { font-family: "IBM Plex Sans"; src: url(${PLEX}) format("woff2"); font-weight: 400; }
  * { box-sizing: border-box; }
  body { margin:0; width:${w}px; height:${h}px; overflow:hidden; position:relative; color:${c('--color-ink')};
         background:
           linear-gradient(90deg, ${c('--color-paper')} 0%, rgba(7,11,22,.96) 38%, rgba(7,11,22,.55) 62%, rgba(7,11,22,.1) 100%),
           url(${ART}) right bottom / auto 100% no-repeat, ${c('--color-paper')};
         font:400 16px/1.4 "IBM Plex Sans", sans-serif; }
  .copy { position:absolute; left:${pad}px; top:50%; transform:translateY(-50%);
          display:flex; flex-direction:column; align-items:flex-start; gap:${Math.round(logo * 0.22)}px; }
  .logo { width:${logo}px; height:${logo}px; border-radius:${Math.round(logo * 0.28)}px; display:block;
          box-shadow:0 0 0 1px rgba(56,214,255,.35), 0 0 ${Math.round(logo * 0.45)}px rgba(56,214,255,.25); }
  .word { font-family:"Archivo"; font-stretch:125%; font-weight:900; font-size:${word}px; line-height:1; letter-spacing:.01em; }
  .tag { font-family:"JetBrains Mono"; font-weight:500; font-size:${tag}px; letter-spacing:.32em; color:${c('--color-brand')};
         margin-top:${Math.round(tag * 0.5)}px; }
  .s { font-size:${subSize}px; color:${c('--color-ink-2')}; line-height:1.45; max-width:${Math.round(w * 0.5)}px; }
</style>
<div class="copy">
  <img class="logo" src="${LOGO}" alt="">
  <div><div class="word">DARKHORSE</div><div class="tag">WALLET</div></div>
  <div class="s">${sub}</div>
</div>
`;

const TILES = [
    { name: "small-440x280", w: 440, h: 280,
      opts: { sub: "RGB assets on Bitcoin.<br>Keys stay on your device.",
              logo: 56, word: 30, tag: 11, subSize: 14, pad: 28 } },
    { name: "marquee-1400x560", w: 1400, h: 560,
      opts: { sub: "Self-custodial RGB assets on Bitcoin. Your recovery phrase, keys and "
                 + "consignments are generated and kept on your own device.",
              logo: 120, word: 76, tag: 22, subSize: 26, pad: 96 } },
];

const b = await chromium.launch();
for (const t of TILES) {
    const ctx = await b.newContext({ viewport: { width: t.w, height: t.h }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.setContent(tile(t.w, t.h, t.opts));
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(250);
    await p.screenshot({ path: `${OUT}/${t.name}.jpg`, type: "jpeg", quality: 92 });
    console.log(`  ${t.name}.jpg  ${t.w}x${t.h}`);
    await ctx.close();
}
await b.close();
