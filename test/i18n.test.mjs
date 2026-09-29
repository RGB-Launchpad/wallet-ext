// The translation table. What this pins: a Chinese string keeps the placeholders of its
// English key — a dropped `{n}` silently prints the literal brace name to the user — and
// every `data-i18n` key in the shipped markup has a translation to find.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// The ZH table lives as an object literal in lib/i18n.js; read it out rather than importing,
// because the module wants a DOM for its helpers.
const source = readFileSync(join(root, "lib/i18n.js"), "utf8");
const tableStart = source.indexOf("const ZH = {");
const tableEnd = source.indexOf("\n};", tableStart);
const body = source.slice(tableStart, tableEnd);

/** Every `"key": "value"` pair of the table, as written. */
function pairs() {
    const out = [];
    const re = /"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
    let m;
    while ((m = re.exec(body))) out.push([JSON.parse(`"${m[1]}"`), JSON.parse(`"${m[2]}"`)]);
    return out;
}

const holders = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

test("a translation keeps its key's placeholders", () => {
    for (const [key, zh] of pairs()) {
        assert.deepEqual(holders(zh), holders(key), `placeholders differ for: ${key}`);
    }
});

test("no key is translated twice", () => {
    const seen = new Map();
    for (const [key] of pairs()) {
        assert.ok(!seen.has(key), `duplicate key: ${key}`);
        seen.set(key, true);
    }
});

test("every data-i18n key in the markup has a translation", () => {
    const html = ["popup.html", "approve.html"]
        .map((f) => readFileSync(join(root, f), "utf8")).join("\n");
    const known = new Set(pairs().map(([k]) => k));
    const keys = [...html.matchAll(/data-i18n(?:-ph|-title)?="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(keys.length > 50, "the markup should be mostly translatable");
    for (const k of keys) assert.ok(known.has(k), `no translation for markup key: ${k}`);
});

test("the shipped markup files are the only ones carrying keys", () => {
    // Guards against a stray draft page picking up translations that never ship.
    const pages = readdirSync(root).filter((f) => f.endsWith(".html"));
    assert.deepEqual(pages.sort(), ["approve.html", "offscreen.html", "popup.html"]);
});
