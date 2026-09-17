# Installing RGB Wallet

This wallet is not on the Chrome Web Store yet, so it is installed from a folder on your own
machine. Chrome calls this an **unpacked extension**. It is a normal, built-in feature — no
developer tools, no command line, nothing to build.

Five minutes, and the only step people get wrong is step 2.

## Before you start

| | |
|---|---|
| Browser | Chrome, Edge or Brave, **version 116 or newer**. Check yours at `chrome://version` |
| Not supported | Firefox and Safari. The wallet runs its engine in an offscreen document, which those browsers do not have |
| Disk | About 15 MB for the unzipped folder |

## 1. Download

**[rgb-wallet.zip](https://github.com/RGB-Launchpad/wallet-ext/releases/latest/download/rgb-wallet.zip)** — always the newest release.

Optional, and worth doing for a wallet: every release publishes a `SHA256SUMS` file listing
the hash of that exact zip. Compare it with the file you received:

```sh
shasum -a 256 rgb-wallet.zip                  # macOS, Linux
certutil -hashfile rgb-wallet.zip SHA256      # Windows
```

If the two do not match, the file was changed somewhere between here and you. Delete it.

## 2. Unzip it somewhere permanent

**This is the step to get right.** The folder you unzip to *is* the installed extension.
Chrome reads it from disk every time it starts — it does not copy it anywhere. So:

- **Do not** leave it in `Downloads` if you ever clear that out
- **Do not** delete, rename or move the folder after loading it
- **Do not** unzip inside the zip viewer and load from there

Somewhere it will sit undisturbed is right — `~/Applications/rgb-wallet` on macOS,
`C:\Users\<you>\rgb-wallet` on Windows.

On Windows use **Extract All**, not double-click. Double-clicking only previews the archive.

When you are done you should have a folder that **directly contains `manifest.json`**:

```
rgb-wallet/
├── manifest.json     ← this must be at the top level of the folder you pick
├── popup.html
├── lib/
├── pkg/
└── ...
```

## 3. Turn on Developer mode

Open the extensions page:

| Chrome | `chrome://extensions` |
|---|---|
| Edge | `edge://extensions` |
| Brave | `brave://extensions` |

Turn on **Developer mode** — top right in Chrome and Brave, left sidebar in Edge.

## 4. Load unpacked

Click **Load unpacked** and select the folder from step 2 — the one that contains
`manifest.json`. Not the zip file, and not a folder above it.

RGB Wallet now appears in the list with a version number.

## 5. Pin it to the toolbar

New extensions hide behind the puzzle-piece icon. Click it, find RGB Wallet, and click the
pin so it stays visible.

## Updating

Download the new zip, unzip it **over the same folder**, then press **Reload** (the ↻ on the
extension's card). Your recovery phrase, settings and assets are untouched.

> ⚠️ Unzip over the *same* folder. Chrome identifies an unpacked extension by where it lives
> on disk, so loading it from a new location gives you a second, separate extension with its
> own empty storage. Nothing is lost from the old one, but the new one will look like a
> wallet you have never used. If you do need to move it, export a backup first, then import
> your recovery phrase and restore the backup in the new copy.

## Removing it

**Remove** on the extension's card deletes the wallet's stored data, including the encrypted
recovery phrase. Make sure you have your phrase written down and a backup exported first.
Deleting the folder without removing the extension leaves a broken entry behind.

## If something goes wrong

| What you see | What it means |
|---|---|
| *Manifest file is missing or unreadable* | The wrong folder was selected. Pick the one that has `manifest.json` directly inside it — usually one level down from what you chose |
| The extension is not in the toolbar | It is behind the puzzle-piece icon. Pin it (step 5) |
| Chrome warns about *developer mode extensions* on startup | Expected for anything not installed from the Web Store. It is not an error |
| After a restart the extension shows an error, or is gone | Its folder was moved, renamed or deleted. Put it back, or load it again from wherever it now lives |
| The wallet asks for your password every time the browser starts | By design. It stays unlocked until you lock it or close the browser; closing the browser erases the phrase from memory |
| *Indexer unreachable* | The wallet cannot reach the Bitcoin indexer for the selected network. Check Settings, and that you are on the network you meant to be on |
| A wallet with no assets, after an update | Almost always the folder moved. See the warning under [Updating](#updating) |

## Why it is not in the Web Store

Store review is a separate step from the software being ready, and publishing there is not a
prerequisite for using it. Loading an unpacked extension runs exactly the same code. When it is
published, the store version will install and update itself the usual way.
