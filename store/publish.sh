#!/usr/bin/env bash
# Publishes this extension to its own repository, as a snapshot rather than as history.
#
#     store/publish.sh [--dry-run]
#
# Development stays in the monorepo; that repository is the one source of truth. This pushes
# the committed tree of this directory, so the published repository is a series of release
# snapshots, one commit per version.
#
# 🚨 History is deliberately not exported. The monorepo's commit messages name platform
# internals — a stuck withdrawal's txid, deploy paths, tunnel hostnames, vendor
# correspondence — none of which belongs in a repository handed to people who only need to
# install the wallet. `git subtree push` would carry all of it.
#
# ⚠️ The snapshot comes from HEAD, not the working tree: what gets published is what was
# committed and therefore what was tested. Uncommitted edits are refused, not silently
# shipped.
set -euo pipefail

cd "$(dirname "$0")/.."
PREFIX=$(git rev-parse --show-prefix)      # e.g. services/wallet-ext/
PREFIX=${PREFIX%/}
REMOTE="${WALLET_REMOTE:-git@flatlandapp:RGB-Launchpad/wallet-ext.git}"
DRY=""
[ "${1:-}" = "--dry-run" ] && DRY=1

VERSION=$(python3 -c "import json;print(json.load(open('manifest.json'))['version'])")
TAG="v$VERSION"

if [ -n "$(git status --porcelain -- .)" ]; then
    echo "Uncommitted changes. Commit first: HEAD is published, not the working tree." >&2
    git status --short -- . >&2
    exit 1
fi

echo "==> Tests"
node --test test/*.mjs >/dev/null

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

echo "==> Fetching $REMOTE"
if ! git clone --quiet "$REMOTE" "$work/repo" 2>/dev/null; then
    # An empty repository has nothing to clone.
    mkdir -p "$work/repo"
    git -C "$work/repo" init -q -b main
    git -C "$work/repo" remote add origin "$REMOTE"
fi

if git -C "$work/repo" rev-parse -q --verify "refs/tags/$TAG" >/dev/null 2>&1; then
    echo "$TAG is already published. Bump the version in manifest.json first." >&2
    exit 1
fi

echo "==> Snapshot of $PREFIX at HEAD"
# Everything except .git is replaced, so a file deleted here is deleted there too.
find "$work/repo" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
# 🚨 From the repository root, not from here: `git archive HEAD:some/path` run inside a
# subdirectory writes an *empty* archive and exits 0. Publishing would then wipe the remote.
git -C "$(git rev-parse --show-toplevel)" archive "HEAD:$PREFIX" | tar -x -C "$work/repo"

# The failure above is silent, so the result is checked rather than trusted.
[ -f "$work/repo/manifest.json" ] || { echo "The snapshot is empty: no manifest.json" >&2; exit 1; }
files=$(find "$work/repo" -type f -not -path "*/.git/*" | wc -l | tr -d ' ')
echo "    $files files"
[ "$files" -gt 25 ] || { echo "The snapshot has only $files files; refusing to publish" >&2; exit 1; }

git -C "$work/repo" add -A
# ⚠️ `diff --cached` against a repository with no commits reports "no changes", which on the
# very first publish would skip the commit and then fail resolving HEAD for the tag.
if git -C "$work/repo" rev-parse -q --verify HEAD >/dev/null 2>&1 \
   && git -C "$work/repo" diff --cached --quiet; then
    echo "==> Content matches the published tree; adding the tag only"
else
    git -C "$work/repo" commit -q -m "RGB Wallet $VERSION"
fi
# Cloning an empty repository leaves the branch name to local config, which may not be
# `main`; the push below names `main` explicitly.
git -C "$work/repo" branch -M main
git -C "$work/repo" tag -a "$TAG" -m "RGB Wallet $VERSION"

echo "==> About to publish"
git -C "$work/repo" --no-pager log --oneline -3
git -C "$work/repo" --no-pager show --stat --oneline HEAD | tail -20

if [ -n "$DRY" ]; then
    echo
    echo "(Dry run: nothing pushed. Run without --dry-run to push.)"
    exit 0
fi

echo "==> Pushing"
git -C "$work/repo" push -q origin main
git -C "$work/repo" push -q origin "$TAG"
echo "Done: $REMOTE  main + $TAG"
echo "Pushing $TAG triggers the release workflow, which packages the extension and publishes it on the Releases page."
