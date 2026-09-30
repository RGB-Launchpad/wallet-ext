// The mark that says a request comes from Darkhorse's own site.
//
// What this pins: the mark is decided by exact origin, from a list inside the extension, so a
// look-alike domain cannot earn it and a page cannot ask for it. A wrong mark here is worse
// than no mark: it would teach people to trust a copy of the site.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { OFFICIAL_ORIGINS, SITE } from "../config.js";

const manifest = JSON.parse(readFileSync(new URL("../manifest.json", import.meta.url), "utf8"));

test("the official origin is the site, by exact match", () => {
    assert.deepEqual(OFFICIAL_ORIGINS, [SITE.origin]);
    const host = new URL(SITE.origin).hostname;
    // Built from the real name so the list keeps its point through a domain switch.
    for (const impostor of [
        `https://${host}.evil.com`,   // the name as a prefix of another domain
        `https://evil.com/${host}`,   // the name in a path
        `https://${host.split(".")[0]}.example`, // the name under another tld
        `http://${host}`,             // no tls
        `https://www.${host}`,        // a host the extension does not inject into
        `https://sub.${host}`,
    ]) {
        assert.ok(!OFFICIAL_ORIGINS.includes(impostor), `${impostor} must not be marked official`);
    }
});

// A site that can reach `window.rgb` but carries no mark reads as a warning, so the two lists
// have to agree: every marked origin is one the content script actually runs on.
test("every official origin can reach the provider", () => {
    const matches = manifest.content_scripts.flatMap((c) => c.matches);
    for (const origin of OFFICIAL_ORIGINS) {
        assert.ok(matches.includes(`${origin}/*`),
            `${origin} is marked official but content_scripts does not cover it`);
    }
});
