// Networks and endpoint defaults. Mainnet is not offered.
export const NETWORKS = {
    Signet: {
        label: "Signet",
        // Esplora over HTTP: browsers have no TCP.
        esplora: "https://mempool.space/signet/api",
        // Consignment relay. It sees recipient identifiers, so it is our own deployment.
        proxy: "rpcs://proxy.rgblaunchpad.meme/json-rpc",
    },
    // `Testnet` is testnet3 in rgb-lib's BitcoinNetwork enum. Its addresses use the same
    // `tb1` prefix as Signet, so the network label is the only thing telling them apart.
    Testnet: {
        label: "Testnet",
        esplora: "https://mempool.space/testnet/api",
        proxy: "rpcs://proxy.rgblaunchpad.meme/json-rpc",
    },
    // The regtest sandbox runs on one machine and reaches everyone else through a tunnel,
    // so these are public hostnames, not localhost. Point them elsewhere in settings to run
    // against a sandbox of your own; saving asks for host access when the origin is new.
    Regtest: {
        label: "Regtest",
        esplora: "https://regtest-indexer.rgblaunchpad.meme/regtest/api",
        proxy: "rpcs://regtest-proxy.rgblaunchpad.meme/json-rpc",
    },
};

// Endpoint keys, stored under `byNetwork[<network>]`.
export const PER_NETWORK = ["esploraUrl", "proxyUrl"];

export const DEFAULTS = {
    network: "Signet",
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

// Fee bidding. Mainnet is not offered, so every network here spends worthless coins, while a
// transaction that misses the block costs a round of testing. Bid above the clearing rate,
// not the least that might work.
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

export const LIMITS = {
    // Absolute floor for creating slots. The real requirement is computed per attempt,
    // since the fee rate moves: a static number goes stale the moment the network gets busy.
    minSatToPrepare: 20000,
    // Rough vsize of a create-slots transaction, for working out what the fee will cost.
    // One input, `utxoNum` outputs plus change, taproot throughout.
    prepareVsize: 350,
};
