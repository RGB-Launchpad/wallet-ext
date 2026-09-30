// Rewrites manifest.json's domain lists from the `SITE` block in config.js.
//
// A browser extension's host lists cannot read config at install time — they must be literal
// strings in manifest.json. This script keeps one source (config.js) and propagates it, so a
// platform domain switch edits config.js and runs this, never the manifest by hand.
// `store/pack.sh` runs it before every pack; `test/manifest-domains.test.mjs` fails when the
// manifest has drifted from what config.js says.
import { readFileSync, writeFileSync } from "node:fs";
import { HOST_PERMISSIONS, CONTENT_MATCHES } from "../config.js";

const path = new URL("../manifest.json", import.meta.url);
const manifest = JSON.parse(readFileSync(path, "utf8"));

manifest.host_permissions = [...HOST_PERMISSIONS];
for (const entry of manifest.content_scripts) entry.matches = [...CONTENT_MATCHES];

writeFileSync(path, JSON.stringify(manifest, null, 2) + "\n");
console.log("manifest.json host lists rewritten from config.js SITE");
