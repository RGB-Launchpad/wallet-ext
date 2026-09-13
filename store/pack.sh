#!/usr/bin/env bash
# Build the upload zip for the Chrome Web Store.
# Ships only what the extension needs at runtime: no tests, no docs, no scratch files.
#
# LICENSE and NOTICE do ship: the bundled wasm engine is MIT, and MIT requires its notice to
# travel with every copy of the binary. INSTALL.md ships too — a zip forwarded to someone
# arrives without the repository link that would otherwise carry the instructions.
set -euo pipefail
cd "$(dirname "$0")/.."

VERSION=$(python3 -c "import json;print(json.load(open('manifest.json'))['version'])")
OUT="store/rgb-wallet-${VERSION}.zip"
rm -f "$OUT"

zip -r -q "$OUT" \
    manifest.json config.js sw.js offscreen.html offscreen.js \
    popup.html popup.js popup.css approve.html approve.js \
    inject.js content.js lib icons pkg \
    LICENSE NOTICE INSTALL.md \
    -x '*.DS_Store' -x '*/.*'

echo "$OUT  $(du -h "$OUT" | cut -f1)"
unzip -l "$OUT" | tail -1
