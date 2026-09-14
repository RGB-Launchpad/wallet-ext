# RGB Wallet — Privacy Policy

Last updated: 2026-09-11

## Summary

RGB Wallet is a self-custodial wallet extension. Your recovery phrase, your private keys and
your password are generated and stored on your own device and are never transmitted anywhere.
There is no account to create with us.

We do operate one server the extension talks to: the RGB proxy that relays consignments. What
it receives, and why it cannot be avoided, is set out below.

## What the extension stores on your device

| Data | Where | Why |
|---|---|---|
| Recovery phrase, encrypted with your password | `chrome.storage.local` | To restore the wallet after locking or a browser restart |
| Wallet state: addresses, RGB consignments, transfer history | IndexedDB | RGB is client-side validated; without the consignments the assets cannot be proven |
| Settings: network, indexer and proxy endpoints, per network | `chrome.storage.local` | To keep your configuration between sessions |
| Sites you connected | `chrome.storage.local` | So each site is authorized separately and can be revoked |

The unencrypted recovery phrase exists only in memory while the wallet is unlocked. Locking the
wallet erases it.

## What leaves your device

The extension talks to the endpoints you configure. Nothing else.

| Endpoint | What is sent | Default | Operated by |
|---|---|---|---|
| Bitcoin indexer (Esplora) | Your addresses and transaction ids, to read balances and to broadcast | `mempool.space` on Signet and Testnet4 | A third party |
| RGB proxy | Consignment files and the recipient identifier each one is addressed to | `proxy.rgblaunchpad.meme` | **Us** |

**The RGB proxy is ours, and this is the one place your data reaches a server we run.** A
consignment is the record of an RGB transfer: it contains the asset, the amounts and the
transfer's history. The proxy is a store-and-forward relay — it performs no validation and
cannot read your keys, seed or password — but it necessarily receives that file and stores it
until the recipient collects it.

We do not analyse it, link it to a person, or share it. If you would rather it did not reach us
at all, set a different proxy in the extension's settings; the protocol works with any
compatible instance.

When you sign in to a site with the wallet, that site receives your identity address and a
signature. Which sites may ask is under your control and revocable in settings.

**Your recovery phrase, private keys and password are never transmitted anywhere.**

## What we collect

No analytics, no telemetry, no crash reporting, no advertising identifiers, no accounts and no
tracking of any kind. We never receive your recovery phrase, private keys or password.

The one exception is stated above and we would rather name it than bury it: consignments you
send or receive pass through, and rest on, the RGB proxy we operate. That is transfer data —
assets and amounts. We do not sell or transfer it to anyone, we do not use it for anything
beyond relaying it, and we do not use it to assess creditworthiness.

## Third parties

The default endpoints above are operated by third parties and have their own policies. You can
replace any of them in the extension's settings.

## Deleting your data

"Erase this wallet" in settings deletes the encrypted recovery phrase and all wallet state from
this device. Removing the extension from Chrome deletes the same data. Neither can be undone:
without a backup file, assets held in the wallet cannot be recovered.

## Contact

Questions, or a privacy request: open an issue at
https://github.com/RGB-Launchpad/wallet-ext/issues
