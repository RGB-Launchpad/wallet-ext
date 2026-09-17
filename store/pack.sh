#!/usr/bin/env bash
# Build the upload zip for the Chrome Web Store.
# Ships only what the extension needs at runtime: no tests, no docs, no scratch files.
#
# LICENSE and NOTICE do ship: the bundled wasm engine is MIT, and MIT requires its notice to
# travel with every copy of the binary. INSTALL.md ships too — a zip forwarded to someone
# arrives without the repository link that would otherwise carry the instructions.
#
# Our own JS and CSS are minified and stripped of comments. Minified only, never obfuscated:
# the Chrome Web Store rejects obfuscated code. Each file is transformed on its own, not
# bundled, so the module graph and every path the manifest names stay as they are.
# pkg/ is generated upstream code and ships untouched.
set -euo pipefail
cd "$(dirname "$0")/.."

ESBUILD_VERSION=0.25.2
esbuild() {
    if [ -n "${ESBUILD:-}" ]; then "$ESBUILD" "$@"; else npx --yes "esbuild@$ESBUILD_VERSION" "$@"; fi
}

VERSION=$(python3 -c "import json;print(json.load(open('manifest.json'))['version'])")
OUT="$PWD/store/rgb-wallet-${VERSION}.zip"
rm -f "$OUT"

STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT

SOURCES=(config.js sw.js offscreen.js popup.js approve.js inject.js content.js lib/*.js popup.css)
esbuild "${SOURCES[@]}" --minify --legal-comments=none --target=chrome116 \
    --outbase=. --outdir="$STAGE" --log-level=warning

cp -R manifest.json offscreen.html popup.html approve.html icons pkg LICENSE NOTICE INSTALL.md "$STAGE/"

# A minified module that no longer parses would only fail inside someone's browser.
for f in "$STAGE"/*.js "$STAGE"/lib/*.js; do
    node --input-type=module --check < "$f" || { echo "does not parse: ${f#$STAGE/}" >&2; exit 1; }
done

( cd "$STAGE" && zip -r -q "$OUT" . -x '*.DS_Store' -x '*/.*' )

echo "$OUT  $(du -h "$OUT" | cut -f1)"
unzip -l "$OUT" | tail -1
