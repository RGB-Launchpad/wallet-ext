// Every shipped file has to parse as an ES module, and every reference has to resolve.
//
// NOTE: `node --check <file>` is not enough. For a .js file without "type": "module" it
// parses in script goal and accepts modules Chrome refuses to load. The source has to be fed
// in with --input-type=module.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const files = [
    "sw.js", "offscreen.js", "popup.js", "approve.js", "content.js", "inject.js", "config.js",
    ...readdirSync(join(root, "lib")).filter((f) => f.endsWith(".js")).map((f) => `lib/${f}`),
];

function parses(file) {
    try {
        execFileSync(process.execPath, ["--input-type=module", "--check"],
            { input: readFileSync(join(root, file)), stdio: ["pipe", "pipe", "pipe"] });
        return null;
    } catch (e) {
        return String(e.stderr || e.message).split("\n").slice(0, 3).join(" ");
    }
}

for (const f of files) {
    test(`${f} parses as a module`, () => {
        const err = parses(f);
        assert.equal(err, null, `${f}: ${err}`);
    });
}

test("imports point at files that exist", () => {
    const missing = [];
    for (const f of files) {
        const src = readFileSync(join(root, f), "utf8");
        for (const m of src.matchAll(/from\s+"(\.[^"]+)"/g)) {
            const target = join(root, dirname(f), m[1]);
            try { readFileSync(target); } catch { missing.push(`${f} -> ${m[1]}`); }
        }
    }
    assert.deepEqual(missing, []);
});

test("manifest references files that exist", () => {
    const m = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));
    const refs = [m.background.service_worker, m.action.default_popup,
        ...Object.values(m.icons || {}), ...Object.values(m.action.default_icon || {}),
        ...m.content_scripts.flatMap((c) => c.js)];
    const missing = refs.filter((r) => { try { readFileSync(join(root, r)); return false; } catch { return true; } });
    assert.deepEqual(missing, []);
});
