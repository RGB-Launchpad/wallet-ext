# RGB Wallet (browser extension)

[![tests](https://github.com/RGB-Launchpad/wallet-ext/actions/workflows/test.yml/badge.svg)](https://github.com/RGB-Launchpad/wallet-ext/actions/workflows/test.yml)
[![release](https://img.shields.io/github/v/release/RGB-Launchpad/wallet-ext?label=release)](https://github.com/RGB-Launchpad/wallet-ext/releases/latest)
[![downloads](https://img.shields.io/github/downloads/RGB-Launchpad/wallet-ext/total?label=downloads)](https://github.com/RGB-Launchpad/wallet-ext/releases)
[![licence](https://img.shields.io/badge/licence-Apache--2.0-blue)](LICENSE)

A self-custodial wallet for RGB assets on Bitcoin. Keys and consignments stay on the device.

## Download

**[⬇ rgb-wallet.zip](https://github.com/RGB-Launchpad/wallet-ext/releases/latest/download/rgb-wallet.zip)** — always the newest release. No git, no build step.

1. Unzip it into a folder that will stay put — **not** one you clear out, and do not move it afterwards
2. Open `chrome://extensions` and turn on **Developer mode** (top right)
3. Click **Load unpacked** and pick the unzipped folder, the one containing `manifest.json`
4. Pin the wallet from the puzzle-piece icon in the toolbar

Chrome, Edge or Brave 116+. Not Firefox or Safari.

📖 **[Full installation guide](INSTALL.md)** — every step with what to expect, how to update
without losing your wallet, and what to do when something looks wrong. Start there if you
have not loaded an unpacked extension before.

To update: download again, unzip over **the same folder**, and press **Reload** on the
extension's card. Your recovery phrase and settings are not touched — but the folder has to
be the same one, see the guide.

Every version, with notes, is on the [releases page](https://github.com/RGB-Launchpad/wallet-ext/releases).

### Check what you downloaded

Anyone can copy this code, change it, and re-host the zip somewhere else. Each release
publishes a `SHA256SUMS` file and prints the same hashes in its notes, so the file you have
can be checked against the one this repository built:

```sh
shasum -a 256 rgb-wallet.zip                  # macOS, Linux
certutil -hashfile rgb-wallet.zip SHA256      # Windows
```

A wallet asks for your recovery phrase. Download it from this repository's releases page and
nowhere else.

## What is in the package

Our own code, minified, plus exactly one third-party binary:

| | |
|---|---|
| `pkg/` | The RGB engine — **[rgb-lib-wasm](https://github.com/UTEXO-Protocol/rgb-lib-wasm)**, MIT, built from commit `2610d4a` **with the additions listed in [The wasm engine](#the-wasm-engine)**, using the upstream's own `bindings/wasm/build.sh`. It is the WASM binding of [RGB-Tools/rgb-lib](https://github.com/RGB-Tools/rgb-lib) and carries the same authors |
| everything else | Ours: `lib/`, the popup, the service worker, the offscreen document, the content scripts. Each JS and CSS file is minified on its own by `store/pack.sh`; this repository holds the unminified source |

**No npm dependencies, no bundler.** Minification strips comments and whitespace and shortens
local names; it does not obfuscate. `unzip -l` lists every file in a release zip, and nothing is
fetched or built at install time.

⚠️ Upstream describes itself as **"Beta Software — under active development and has not been
audited."** That applies to the engine this wallet runs on. Signet and small amounts only;
mainnet is not offered.

## Install from a clone

Open `chrome://extensions`, enable Developer mode, Load unpacked, and select this directory.
Everything needed is checked in, including the wasm engine — there is nothing to build.

Releases are cut by tagging `v<version>` (`.github/workflows/release.yml`); the tag has to
match the version in `manifest.json` or the build stops.

Chrome 137 disabled the `--load-extension` switch by default, so the extension is loaded by
hand either way.

## What it does

| | |
|---|---|
| Home | One row per RGB asset: settled balance, with anything in flight as a signed delta. Bitcoin is the last row |
| Sync | Rescans the chain and revalidates consignments. Rate limited in the service worker, not in the popup: the popup's disabled button is thrown away when it closes |
| Notices | Warnings collapse behind a header icon. An item that leaves the wallet unusable — no indexer, no proxy — opens the strip itself; the backup reminder does not |
| Create / import phrase | 12 or 24 words, encrypted with a password on this device |
| Lock / unlock | Locking closes the offscreen document and erases the phrase. No idle timer: the wallet stays unlocked until locked by hand or until the browser closes |
| Receive | Create allocation slots, then a blind invoice. Sync picks up and validates consignments. Slots wait until every Bitcoin input is confirmed (constraint 10), so funding the wallet and creating slots are a block apart |
| Send RGB | Paste an invoice, inspect it (network, asset, expiry, endpoint), pick amount and fee |
| Bitcoin | Receive address, and the vanilla balance as Available with Confirmed and Waiting to confirm as its parts. A separate row shows how much Bitcoin sits in RGB UTXOs |
| Send Bitcoin | Spends the vanilla keychain only |
| Activity | Transfers with status. A pending one also shows its confirmation depth and age, from the indexer — rgb-lib's `Transfer` carries no such field. Fails expired invoices and stuck transfers |
| Backup / restore | Encrypted backup file. Restoring requires the same recovery phrase |
| Page provider | `window.rgb`: `connect()`, `getAccount()`, `signMessage()` (BIP-322 sign-in) |

Custodial platform balances are not shown; the platform's own site shows them. To move an
asset into the platform, get a deposit invoice there and paste it into Send.

Not implemented: `getInvoice()` and receive QR codes.

## Constraints

1. The plaintext recovery phrase exists only in the offscreen document's memory: never in
   storage, never sent to the popup, never logged. Only ciphertext crosses the message channel.
2. The wallet does not run in the service worker, which MV3 evicts after 30 seconds of idle.
   The worker routes messages and owns storage and the document lifecycle.
3. Contract metadata (ticker, name) is issuer-controlled and is escaped before rendering.
   The CSP blocks script execution, not fake content.
4. Amounts are BigInt or strings end to end; human units convert by string padding. A send
   fails rather than falling back to Number when the bindings reject BigInt past 2^53.
5. Unknown precision renders the raw base-unit value with a marker. A default of 8 would show
   a precision-9 asset ten times too large.
6. The page cannot sign an arbitrary PSBT. It calls `signMessage(string)`; the wallet builds
   the BIP-322 virtual transactions itself.
7. The identity address is pinned to vanilla index 0 (`reuseAddresses`), and `rotateAddress`
   is not exposed. A changing address is a different account to anything that signs users in.
8. Wallet state is per network. The IndexedDB key is `dataDir/<fingerprint>`, so the network
   is part of `dataDir`; a shared key loads the other chain's snapshot and BDK rejects it.
9. Offscreen documents support `chrome.runtime` only. There is no `chrome.storage` there.
10. Slots are built only from confirmed coins. rgb-lib's split transaction spends *every*
    vanilla input at once (`add_utxos(...).manually_selected_only()`) and the set cannot be
    filtered, so one replaceable parent puts the whole batch at risk — and an RGB allocation
    in a slot that disappears cannot be re-derived from the phrase. `vanilla.spendable`
    includes unconfirmed funds; it is not a subset of `settled`, whatever rgb-lib's doc
    comment on the shared `Balance` struct says.

    Each slot carries `utxoSizeSat` (20000) sats because an RGB send pays its fee only from
    colored UTXOs, never from the vanilla balance. When they run short rgb-lib reports
    "Insufficient allocations", which the wallet rewords. Create slots counts empty slots of
    that size, not spare room on UTXOs already holding assets, so a wallet with small slots
    still gets usable ones.
11. Fees are bid above the clearing rate, not estimated tightly. Esplora's `/fee-estimates`
    is unreliable on these chains — measured on signet it returned 0.1 sat/vB for a 6-block
    target while blocks were clearing at 4.07. `lib/fee.js` walks the mempool histogram
    instead, and a floor covers a queue that only looks quiet. Mainnet is not offered, so
    overpaying costs nothing while a stuck transfer costs a round of testing.

## rgb-lib wasm bindings

Conventions that differ from the Node bindings of the same library:

| | |
|---|---|
| Optional arguments | `undefined`. `null` deserializes as a serde unit value and is rejected |
| Array arguments | A real array; `null` is not accepted |
| Amounts | Return as `BigInt`, which `JSON.stringify` throws on; converted to strings before crossing the message channel |
| `listTransfers(filter, txid?)` | The first argument is an `AssetFilter`: `"any"`, `"noAsset"` or `{ id }`. Lower-case because the build enables `camel_case`, and `AssetFilter` is the only enum it renames. `Assignment`, `AssetSchema` and `BitcoinNetwork` stay PascalCase |
| `failTransfers(online, idx, ...)` | Without an index it fails only transfers waiting for the counterparty that have expired. One at "waiting for confirmations" needs its index |
| `getAssetBalance().spendable` | Can read 0 while an allocation is settled on a live UTXO. Sendability is a settled balance plus no unsettled transfers |
| `getAddress()` | Vanilla keychain. With `reuseAddresses` it returns the pinned index rather than a new address |

A dangling blind invoice holds an allocation slot until it expires, including the slot that
carries assets. Invoice lifetimes are short for that reason.

## Endpoints

| | Signet (default) | Testnet4 | Regtest |
|---|---|---|---|
| Indexer | `https://mempool.space/signet/api` | `https://mempool.space/testnet4/api` | `https://regtest-indexer.rgblaunchpad.meme/regtest/api` |
| RGB proxy | `rpcs://proxy.rgblaunchpad.meme/json-rpc` | `rpcs://proxy.rgblaunchpad.meme/json-rpc` | `rpcs://regtest-proxy.rgblaunchpad.meme/json-rpc` |

No default points at localhost: one machine runs the regtest sandbox and the rest reach it
through a tunnel. Endpoints outside `host_permissions` are requested when settings are saved.

Testnet4 addresses share the `tb1` prefix with Signet, so an address cannot tell them apart;
only the network setting and the invoice's network field do, and a consignment sent on the
wrong network is lost. Testnet3 is not offered; a wallet stored with it falls back to Signet.

Stored per network: configuring Signet does not overwrite Regtest.

A proxy is zero-validation store-and-forward. It cannot read keys, but it sees which recipient
identifier a consignment goes to, so the Signet default is our own deployment.

Creating a wallet needs no proxy; sending and receiving do.

## Page provider

```js
const { address } = await window.rgb.connect()                     // prompts on first use
const { signature } = await window.rgb.signMessage(serverMessage)  // prompts every time
```

- The origin comes from the Chrome sender, not from the page
- Authorization is per origin, revocable in settings, and the page receives `disconnect`
- No approval while locked; unlocking is a separate step from signing
- Approval state lives in session storage and the content script polls for the result, because
  the service worker is evicted while the approval window is open
- `publicKey` is the taproot x-only output key (32 bytes), not a 33-byte compressed key

`content_scripts.matches` covers `https://rgblaunchpad.meme/*`, `http://127.0.0.1/*` and
`http://localhost/*`. Match patterns ignore ports, so any local port works.

## Local test run

For the machine hosting the regtest sandbox. Everyone else just selects Regtest, which
already points at the tunnel.

An Esplora HTTP endpoint is required; browsers have no TCP, so electrs cannot be used. The
esplora image runs its own bitcoind and has to be peered with the chain the platform uses:

```sh
docker run -d --name rgb-esplora-sandbox --network rgb-sandbox_default -p 8095:80 \
  -e NO_PRECACHE=1 -e NO_ADDRESS_SEARCH=1 -e NO_REGTEST_MINING=1 \
  tests-esplora:latest /srv/explorer/run.sh bitcoin-regtest explorer

# from a checkout of github.com/RGB-Tools/rgb-sandbox
docker compose exec -T -u blits bitcoind bitcoin-cli -regtest addnode "rgb-esplora-sandbox:18444" add
docker exec rgb-esplora-sandbox cli addnode "bitcoind:18444" add
# wait until http://127.0.0.1:8095/regtest/api/blocks/tip/height matches the sandbox height
```

Both endpoints are already published through a tunnel, so only the machine hosting the
sandbox needs the steps above. Select Regtest in settings, save, and unlock again.

1. Bitcoin panel: copy the address, fund it, mine a block
2. Receive: create slots, create an invoice
3. Paste it into the platform's RGB withdrawal
4. Sync on Home

## Layout

| | |
|---|---|
| `manifest.json` | MV3. `wasm-unsafe-eval` in the CSP; `minimum_chrome_version` 116 for `getContexts` |
| `sw.js` | Service worker: routing, storage, offscreen lifecycle, page provider |
| `offscreen.js` | Wallet engine: the recovery phrase and the wasm instance |
| `popup.*` / `approve.*` | UI and the approval window |
| `inject.js` / `content.js` | `window.rgb` in the page's main world, bridged through the isolated world |
| `lib/vault.js` | Phrase encryption: PBKDF2-SHA256 and AES-GCM |
| `lib/bip322.js` | BIP-322 construction: address decoding, transaction and PSBT serialization |
| `lib/settings.js` | Settings shape: global keys plus per-network endpoints |
| `lib/fee.js` | What to bid, from the mempool histogram |
| `lib/slots.js` | Whether slots may be built yet |
| `lib/fmt.js` | Amount formatting |
| `lib/msg.js` | Message plumbing |
| `pkg/` | The wasm engine, built from source and tracked. See below |
| `store/` | Chrome Web Store listing copy, privacy policy, packaging script |

## The wasm engine

`pkg/` is checked in, all 13 MB of it, so that a clone runs and so that the zip a release
publishes is the same binary this repository was tested against. wasm-pack drops a
`.gitignore` containing `*` into its own output directory, which is what kept the engine out
before; `pkg/.gitignore` is now a comment and a rebuild that restores the `*` shows up in
`git status`.

Built from `github.com/UTEXO-Protocol/rgb-lib-wasm` at `2610d4a`, MIT, **with six additions**
for peer-to-peer swaps, as buyer (the seller builds the transaction and this wallet only adds its
own signature) and as seller (this wallet builds it, colours it and signs last):

| Addition | Why it is needed |
|---|---|
| `WasmWallet.invoiceSealScript(invoice)` | The script a witness invoice pays to. rgb-lib does not expose it, and a receiver cannot otherwise tell whether a transaction pays its own seal. |
| `WasmWallet.checkSwapPsbt(psbt, inputs, outputs, feeSats)` | Compares a PSBT with what this wallet agreed to, before signing. An expected script may be `null` to check the value only. It also refuses any input asking for a sighash other than ALL: such a signature stays valid over rewritten outputs, so the counterparty could redirect the sats afterwards and re-sign only its own input. |
| `WasmWallet.swapPsbtInputs(psbt)` | The outpoints a PSBT spends, to tell this wallet's input from the counterparty's. |
| `wallet.broadcastPsbt(online, finalizedPsbt)` | Broadcasts a transaction this wallet did not build. |
| `WasmWallet.buildSwapPsbt(inputs, outputs)` | Builds a swap's unsigned PSBT with an empty `OP_RETURN` at output 0 and each input's spent output filled in. A taproot signature commits to every input's amount and script. |
| `wallet.swapBegin(online, psbt, assetId, amount, recipientId, sealVout, sealSats, endpoints, minConfirmations)` | Colours a swap PSBT through the same path as `sendBegin`, taking the asset only from this wallet's inputs in it, and records it as a donation, so the stock `sendEnd` broadcasts it, posts the consignment and records the sale once both sides have signed. The sale is kept in this wallet's database like any send. |

One existing behaviour is corrected: an asset balance counted a witness receive waiting for
confirmations twice, once through the allocation already recorded on its output and once through
the amount requested, so `future` showed twice the incoming amount. It is now counted once.
Nothing else is changed. MIT permits the modification and
requires its notice to travel with the binary, which [NOTICE](NOTICE) does.

```sh
cd bindings/wasm && ./build.sh          # wasm-pack build --target web --out-dir pkg
cp -R pkg/. <this directory>/pkg/
```

⚠️ macOS clang cannot target wasm32, so the build runs in a container:

```sh
docker run --rm -v "$PWD":/work -w /work \
  -e CARGO_HOME=/work/.cargo-docker -e CARGO_TARGET_DIR=/work/target-docker \
  rust:1-bookworm bash -c '
    export PATH=/usr/local/cargo/bin:$PATH
    apt-get update -qq && apt-get install -y -qq clang
    rustup target add wasm32-unknown-unknown
    curl -sSfL https://rustwasm.github.io/wasm-pack/installer/init.sh | sh
    export PATH=/work/.cargo-docker/bin:$PATH
    cd bindings/wasm && wasm-pack build --target web --out-dir pkg'
```

⚠️ A login shell resets `PATH` and loses `rustup`; `bash -c` with `PATH` set explicitly is what
works. Do not pipe the build through `tail`: the container's exit code is then hidden and a
failed build looks like a successful one.

`camel_case` is already on: `bindings/wasm/Cargo.toml` enables it on the library dependency,
so no extra feature flag is needed. Rust 1.85+ with the `wasm32-unknown-unknown` target and
wasm-pack 0.14; ⚠️ macOS clang cannot target wasm32, so this is built in a container.

That commit pins RGB at `0.11.1-rc.10`, one release candidate behind the `rc.11`
(`rgb-lib 0.3.0-beta.7`) the platform runs. Transfers were measured across that gap in both
directions — asset, amount, ticker, name and precision all survive — rather than assumed.
The conclusion holds for this pair of release candidates only; it is not a general claim
about RGB version compatibility.

## Licence

[Apache-2.0](LICENSE), with third-party notices in [NOTICE](NOTICE). Both ship inside the
zip, because the bundled engine is MIT and MIT requires its notice to travel with the binary.

Apache-2.0 is permissive: use it, change it, build on it. What it does do, and the reason it
was chosen over a bare MIT, is set out in the licence itself — §6 grants **no rights to the
project's name or marks**, so a modified build cannot present itself as this one; §4(b)
requires changed files to **say they were changed**; and §§7–8 disclaim warranty and limit
liability.

None of that stops someone from forking this and shipping something harmful. It settles who
is answerable for it, and it denies them the name. Telling a genuine build from a tampered
one is what the checksum above is for.

## Tests

```sh
node --test test/*.mjs      # Node 22+. 76 tests: syntax and references 14, amounts 17,
                            # vault 9, BIP-322 9, settings 9, fees 10, slot gate 7
```

The BIP-322 group uses the official vectors from the BIP and needs no dependency.

The syntax group parses every shipped file as an ES module and checks that imports and
manifest references resolve. `node --check <file>` does not cover this: for a `.js` file
without `"type": "module"` it parses in script goal and accepts modules Chrome will not load.

Anything touching `chrome.*` or the offscreen document runs only in a browser.

`test/browser/` holds the checks that need a real browser. `run-identity.mjs` proves the
identity address survives an uninstall: it opens the wallet in three fresh browser contexts —
empty IndexedDB, same recovery phrase — and compares the addresses. `render-popup.mjs`
asserts on screens that need the extension APIs.

```sh
python3 test/browser/serve.py &      # .wasm needs the right MIME type
node test/browser/run-identity.mjs   # needs playwright; see the header for PLAYWRIGHT=
node test/browser/render-popup.mjs   # renders the popup against a stubbed chrome
```

`render-popup.mjs` installs the `chrome` stub before any page script runs, so popup.js
itself is what runs. It asserts and also writes a screenshot per case.
