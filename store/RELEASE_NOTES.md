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

**What is in the zip.** 36 files, all of them listed by `unzip -l`. Everything except `pkg/` is
our own code, minified file by file; `pkg/` is the RGB engine:
[rgb-lib-wasm](https://github.com/UTEXO-Protocol/rgb-lib-wasm) (MIT), built from commit
`2610d4a` unmodified with the upstream's own `bindings/wasm/build.sh`. No npm dependencies,
no bundler, nothing fetched at install time. The repository README has the
steps to rebuild that binary yourself.

⚠️ That engine describes itself as *"Beta Software — under active development and has not
been audited."* Mainnet is offered; keep amounts small.
