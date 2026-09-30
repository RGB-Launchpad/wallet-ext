/**
 * The platform's hostnames, in one place. Every default endpoint, `OFFICIAL_ORIGINS` and the
 * domain lists in manifest.json derive from this block; `store/gen-manifest.mjs` rewrites the
 * manifest from it. Changing the platform's domain changes this block and nothing else.
 */
export const SITE = {
    // The origin whose pages this extension marks as official.
    origin: "https://rgblaunchpad.meme",
    // The consignment relay, one instance per sandbox boundary. Written into every invoice the
    // user issues (the endpoint field).
    proxy: "proxy.rgblaunchpad.meme",
    regtestProxy: "regtest-proxy.rgblaunchpad.meme",
    // The sandbox chain's Esplora, reachable through a tunnel so testers need no local node.
    regtestIndexer: "regtest-indexer.rgblaunchpad.meme",
};

/** Hosts this extension may reach. Derived from `SITE`; see `store/gen-manifest.mjs`. */
export const HOST_PERMISSIONS = [
    "https://mempool.space/*",
    "https://blockstream.info/*",
    `${SITE.origin}/*`,
    `https://${SITE.proxy}/*`,
    `https://${SITE.regtestProxy}/*`,
    `https://${SITE.regtestIndexer}/*`,
];

/**
 * Pages the content scripts run on. Every page, so any RGB platform can discover the wallet
 * through the provider announcement; connecting and signing still go through the wallet's own
 * approval window, and only `OFFICIAL_ORIGINS` gets the official mark. Derived from `SITE`;
 * see `store/gen-manifest.mjs`.
 */
export const CONTENT_MATCHES = ["<all_urls>"];

// Networks and endpoint defaults.
export const NETWORKS = {
    // Real funds. `fee` replaces the test-network bidding below: overpaying there costs nothing,
    // here it costs the user. NOTE: the cap is what one slot can pay for: an RGB send of about
    // 154 vB pays its fee from colored UTXOs only, and 100 × 154 fits in `utxoSizeSat`.
    Mainnet: {
        label: "Mainnet",
        esplora: "https://mempool.space/api",
        // Asset identity. Read-only, and asked for the whole list rather than per asset, so it
        // never learns which contracts this wallet holds (lib/registry.js).
        registry: `${SITE.origin}/api/mainnet/public`,
        proxy: `rpcs://${SITE.proxy}/json-rpc`,
        fee: { safety: 1.25, min: 2, max: 100 },
    },
    Signet: {
        label: "Signet",
        // Esplora over HTTP: browsers have no TCP.
        esplora: "https://mempool.space/signet/api",
        registry: `${SITE.origin}/api/signet/public`,
        // Consignment relay. It sees recipient identifiers, so it is our own deployment.
        proxy: `rpcs://${SITE.proxy}/json-rpc`,
    },
    // NOTE: testnet4 addresses carry the same `tb1` prefix as Signet, so an address cannot tell
    // the two apart. Only the network setting and the invoice's network field do; a consignment
    // sent on the wrong one is lost.
    Testnet4: {
        label: "Testnet4",
        esplora: "https://mempool.space/testnet4/api",
        proxy: `rpcs://${SITE.proxy}/json-rpc`,
    },
    // The regtest sandbox runs on one machine and reaches everyone else through a tunnel,
    // so these are public hostnames, not localhost. Point them elsewhere in settings to run
    // against a sandbox of your own; saving asks for host access when the origin is new.
    Regtest: {
        label: "Regtest",
        esplora: `https://${SITE.regtestIndexer}/regtest/api`,
        proxy: `rpcs://${SITE.regtestProxy}/json-rpc`,
    },
    // A regtest chain of your own, on this machine.
    //
    // 🚨 `chain` is what rgb-lib is told, since it knows four networks and this is not one of
    // them. The name is what the wallet's local snapshot is keyed by, and that is the whole
    // point: two regtest chains are different chains, but both answer to "Regtest", so a
    // shared key would load one chain's wallet against the other and BDK would refuse to
    // sync. Keeping them apart is what makes it safe to have both configured at once.
    Local: {
        label: "Local",
        chain: "Regtest",
        esplora: "http://127.0.0.1:8094/regtest/api",
        proxy: "rpc://127.0.0.1:8787/json-rpc",
    },
};

/** The network rgb-lib is told about. Differs from the wallet's own name only for `Local`. */
export const chainOf = (network) => NETWORKS[network]?.chain || network;

// Endpoint keys, stored under `byNetwork[<network>]`.
/**
 * The site this wallet ships as Darkhorse's own, matched exactly against a request's origin.
 *
 * 🚨 The mark says "this is the origin the extension was built with", nothing about whether a
 * site is safe. A copy of the site at another domain simply does not match; it must never be
 * possible for a page to claim the mark for itself, which is why this list is here and not
 * anything the page sends. Content scripts run on every page (see `CONTENT_MATCHES`), so any
 * other platform can connect — it just shows up unmarked, which is the mark doing its job.
 * `store/gen-manifest.mjs` and `test/manifest-domains.test.mjs` hold the two lists together.
 */
export const OFFICIAL_ORIGINS = [SITE.origin];

export const PER_NETWORK = ["esploraUrl", "proxyUrl", "registryUrl", "esploraExtras"];

/**
 * Offered indexers per network, instead of an address the user has to go and find.
 * Probing `/blocks/tip/height` both measures latency and proves the endpoint is an Esplora
 * API — that request is the one every Esplora server answers with a bare block height.
 */
export const INDEXERS = {
    Mainnet: [
        { label: "mempool.space", url: "https://mempool.space/api" },
        { label: "blockstream.info", url: "https://blockstream.info/api" },
    ],
    Signet: [
        { label: "mempool.space", url: "https://mempool.space/signet/api" },
        { label: "blockstream.info", url: "https://blockstream.info/signet/api" },
    ],
    Testnet4: [
        { label: "mempool.space", url: "https://mempool.space/testnet4/api" },
    ],
    Regtest: [],
    Local: [],
};

export const DEFAULTS = {
    network: "Mainnet",
    // Interface language: "en" or "zh".
    lang: "en",
    minConfirmations: 1,
    invoiceMinutes: 60,
    // Empty colored UTXOs to keep available, and the sats each one carries.
    // NOTE: an RGB send pays its fee only from colored UTXOs, never from the vanilla balance.
    // A slot that cannot pay for being spent at the fee floor makes every send from it fail
    // with "Insufficient allocations".
    utxoNum: 3,
    utxoSizeSat: 20000,
    // Shortest gap between syncs. One sync is a full chain scan plus client-side validation
    // of every consignment, so held-down or repeated clicks cost the indexer and the proxy
    // real work — and the indexer is usually someone else's free service.
    refreshCooldownMs: 5000,
};

// Fee bidding on the test networks, where coins are worthless while a transaction that misses
// the block costs a round of testing: bid well above the clearing rate, not the least that
// might work. A network's own `fee` overrides these keys.
export const FEE = {
    // Multiplier on what the front of the mempool is currently clearing at.
    safety: 3,
    // Floor, and the value that does the real work. Measured on signet 2026-09-11: blocks
    // were clearing at 4.07 sat/vB while esplora's own estimate said 0.1 — a platform
    // withdrawal sat in the mempool for that reason. The deepest band in that day's queue
    // was 12, so this clears the whole of it. At ~200 vB a transfer that is 6000 sats.
    min: 30,
    // Cap, so a spam burst cannot price the wallet out of sending at all.
    max: 500,
    // One block's worth of transactions, for walking the mempool histogram.
    blockVsize: 1_000_000,
};

/** Fee bidding for one network: `FEE` with the network's overrides. */
export const feeFor = (network) => ({ ...FEE, ...(NETWORKS[network]?.fee || {}) });

export const LIMITS = {
    // Absolute floor for creating slots. The real requirement is computed per attempt,
    // since the fee rate moves: a static number goes stale the moment the network gets busy.
    minSatToPrepare: 20000,
    // Rough vsize of a create-slots transaction, for working out what the fee will cost.
    // One input, `utxoNum` outputs plus change, taproot throughout.
    prepareVsize: 350,
};
