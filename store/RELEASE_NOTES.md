Download the zip below, unzip it into a folder **that will stay put**, then in Chrome open
`chrome://extensions`, turn on Developer mode, and choose **Load unpacked** — select the
unzipped folder. Full walkthrough:
[INSTALL.md](https://github.com/RGB-Launchpad/wallet-ext/blob/main/INSTALL.md).

**Updating:** unzip the new version over **the same folder** and press Reload on the
extension's card. The wallet keeps its data. ⚠️ It has to be the same folder — Chrome
identifies an unpacked extension by where it lives on disk, so loading it from a new
location gives you a second extension with empty storage.

**After funding the wallet, wait for one confirmation before creating allocation slots.** The
button reports what it is waiting for. Slots are built from every Bitcoin input at once, so
an unconfirmed one would put the whole batch at risk.

Chrome 137 disabled the `--load-extension` switch, so the extension is loaded by hand.

---

**What is in the zip.** 55 files, all of them listed by `unzip -l`. Everything except `pkg/` is
our own code, minified file by file; `pkg/` is the RGB engine:
[rgb-lib-wasm](https://github.com/UTEXO-Protocol/rgb-lib-wasm) (MIT), the WebAssembly bindings
of [rgb-lib](https://github.com/RGB-Tools/rgb-lib) maintained by UTEXO, built from commit
`2610d4a` with the six additions and one correction the repository README lists, using the
upstream's own `bindings/wasm/build.sh`. No npm dependencies, no bundler, nothing fetched at
install time. The README has the steps to rebuild that binary yourself.

⚠️ That engine describes itself as *"Beta Software — under active development and has not
been audited."* Mainnet is offered; keep amounts small.

---

**What is new in 0.16.0.** The wallet opens on Mainnet by default. Settings apply on the
spot — switching the network or an endpoint no longer locks the wallet. The indexer field
offers presets with a live latency light, and refuses an address that does not answer like
an Esplora API. The asset index takes part in saving like every other endpoint. The
recovery phrase and the Bitcoin private key can be shown and copied from Export, behind the
wallet password; the RGB side of Export carries the encrypted backup. The interface
speaks English or Chinese. Creating or unlocking a wallet reports its stages instead of one
waiting button. The settings icon is a gear again.

**What is new in 0.16.1.** An indexer you type joins the list: it is measured with the
rest, picked from the list like the rest, and kept after the wallet reopens. A saved entry
can be removed from the list. Only a change to the network or the engine endpoints
rebuilds the wallet; language and list edits no longer do.
