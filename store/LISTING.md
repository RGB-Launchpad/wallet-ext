# Chrome Web Store listing copy

Paste-ready fields for the developer dashboard. Unlisted publication, team use.

## Name

RGB Wallet

## Short description (132 characters max)

Self-custodial wallet for RGB assets on Bitcoin. Keys and consignments stay on your device.

## Detailed description

RGB Wallet holds RGB assets on Bitcoin. Your recovery phrase, private keys and consignments
are generated and kept on your own device; nothing is sent to a server we control.

Features
- Create or import a 12 or 24 word recovery phrase, encrypted with a password on this device
- Receive RGB assets through blind invoices, with client-side validation of every consignment
- Send RGB assets and plain Bitcoin
- See how far a pending transfer has confirmed, not just that it is pending
- Encrypted backup and restore
- Sign in to supported sites with your wallet, one approval per signature
- Per-site authorization you can revoke, and a signing prompt that shows the whole message

The wallet never exposes a way for a page to sign an arbitrary transaction. A site can ask
for your address and for a message signature; it cannot ask the wallet to move anything.

Bitcoin transactions spend only the plain keychain, so UTXOs carrying RGB assets are never
touched.

Networks: Signet, Testnet4 and Regtest. Mainnet is not enabled.

The RGB engine is rgb-lib-wasm (MIT), bundled and built from source, not downloaded at run
time. It describes itself as beta software that has not been audited. Use small amounts.

## Category

**Productivity › Tools**. The dashboard shows PRODUCTIVITY as a group heading;
pick `Tools` under it. Not Developer Tools — the audience is asset holders, not developers.

## Single purpose

Manage RGB protocol assets on Bitcoin: hold keys and consignments locally, send and receive
assets, and sign messages for sites the user authorizes.

## Permission justifications

| Permission | Justification |
|---|---|
| `offscreen` | The wallet engine is a large WebAssembly module and must run outside the service worker, which Chrome evicts after 30 seconds of idle. |
| `storage` | Stores the encrypted recovery phrase, settings, authorized sites and the wallet's own state. |
| `unlimitedStorage` | RGB consignments are the only proof of asset ownership and grow with transfer history; eviction would make assets unrecoverable. |
| `tabs` | Notifies an open page when the user revokes that site's access, so the page stops acting as connected. |
| Host access to `mempool.space`, `proxy.rgblaunchpad.meme`, `regtest-indexer.rgblaunchpad.meme`, `regtest-proxy.rgblaunchpad.meme` | The default Bitcoin indexer and RGB consignment relay for each supported network. Nothing else is contacted unless the user configures it. |
| Content scripts on `rgblaunchpad.meme`, `127.0.0.1`, `localhost` | Exposes `window.rgb` so the platform, and a local copy of it during development, can request sign-in. A site sees nothing until the user approves it in the extension. |
| Optional host access | Requested only when the user configures a different indexer, proxy or platform endpoint. |

## Remote code

The dashboard asks this separately from the permissions and will not let the item through
without an answer. Select **"No, I am not using remote code"**, and justify:

> No remote code is used. The WebAssembly engine and every line of JavaScript are packaged
> inside the extension; nothing is fetched, evaluated or injected at run time. The extension
> makes network requests only to read Bitcoin chain data from an indexer and to relay RGB
> consignments. Both return data, never code.

Verifiable from the package: `unzip -l` lists all 35 files, and none of the scripts contain
a remote `import()`, an external `<script src>` or a call to `eval`.

## Data use disclosures

Tick **Financial and payment information**. Leave the other eight unticked.

🚨 **Do not tick nothing.** The default RGB proxy, `proxy.rgblaunchpad.meme`, is **our own
server**, and a consignment is the record of a transfer: asset, amounts, history. It reaches
us and rests there until the recipient collects it. That is financial information under this
form's own definition ("transactions … payment history"). The form certifies that these
answers match the privacy policy, so the two have to agree — `store/PRIVACY.md` now names the
proxy as ours rather than claiming we run no servers.

| Category | Tick | Why |
|---|---|---|
| Personally identifiable information | No | No names, emails, accounts |
| Health information | No | |
| **Financial and payment information** | **Yes** | Consignments reach the proxy we operate |
| Authentication information | No | The phrase and password never leave the device |
| Personal communications | No | |
| Location | No | No geolocation is requested or derived |
| Web history | No | The extension reads no browsing history |
| User activity | No | No analytics, telemetry or crash reporting |
| Website content | No | The content script exposes an API; it reads no page content |

All three certifications at the bottom are true and must be ticked: we do not sell or transfer
user data, do not use it for anything unrelated to the single purpose, and do not use it for
creditworthiness or lending.

## Graphic assets

| | |
|---|---|
| Screenshots | `store/screenshots/` — five at 1280x800, from `store/screenshots.mjs` |
| Small promo tile 440x280 | `store/promo/small-440x280.jpg` |
| Marquee promo tile 1400x560 | `store/promo/marquee-1400x560.jpg` |

Promo tiles are **optional** — they are only used if the listing is considered for featuring.
Both are written as JPEG by `store/promo.mjs`: the dashboard asks for "JPEG or 24-bit PNG
(no alpha)", and a PNG out of a headless browser carries an alpha channel whether or not
anything in it is transparent.

## Assets still needed

- [x] Screenshots — five at 1280x800 in `store/screenshots/`, generated by
      `store/screenshots.mjs` from the real popup against a stubbed `chrome`, so they cannot
      drift from the interface. Regenerate after any UI change:
      `python3 test/browser/serve.py & node store/screenshots.mjs store/screenshots`
- [x] Privacy policy URL — the repository is public, so it is already hosted:
      `https://github.com/RGB-Launchpad/wallet-ext/blob/main/store/PRIVACY.md`
- [ ] Support contact email in the dashboard and in PRIVACY.md — the placeholder is at
      `store/PRIVACY.md` line 57. It becomes a publicly listed address
