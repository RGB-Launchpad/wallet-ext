// manifest.json carries literal host strings, config.js is their source. This test is the
// clamp: edit config.js and forget to run `node store/gen-manifest.mjs`, and the suite says so
// instead of shipping a zip whose permissions disagree with its defaults.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { HOST_PERMISSIONS, CONTENT_MATCHES, OFFICIAL_ORIGINS, SITE } from "../config.js";

const manifest = JSON.parse(readFileSync(new URL("../manifest.json", import.meta.url), "utf8"));

test("manifest host_permissions match config.js", () => {
    assert.deepEqual(manifest.host_permissions, HOST_PERMISSIONS);
});

test("manifest content_scripts matches match config.js", () => {
    for (const entry of manifest.content_scripts) {
        assert.deepEqual(entry.matches, CONTENT_MATCHES);
    }
});

test("the official origin is the one site entry content scripts cover", () => {
    assert.deepEqual(OFFICIAL_ORIGINS, [SITE.origin]);
    assert.ok(CONTENT_MATCHES.includes(`${SITE.origin}/*`));
});
