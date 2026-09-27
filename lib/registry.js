// Asset identity from an RGBMap index: what a ticker does not tell you.
//
// 🚨 The wallet asks for the whole asset list of a network, never for the assets it holds.
// Asking per asset would tell the index which contracts this user owns; fetching the list
// and matching locally tells it nothing beyond "someone opened a wallet". The list is
// cached, so an index sees at most one request per network per cache period.
//
// Nothing here decides whether an asset is safe. It carries the index's separate statuses
// through, and the ticker clash that the wallet has to show either way.

const CACHE_MS = 6 * 60 * 60 * 1000;
const MAX_ASSETS = 5000;

const memory = new Map();

const key = (url, network) => `registry:${network}:${url}`;

/**
 * The asset list for one network, cached.
 *
 * Returns `null` when no index is configured or it cannot be reached: an index that is down
 * must leave the wallet exactly as it was, never blocking or blanking the asset list.
 */
export async function assetList(registryUrl, network) {
    if (!registryUrl) return null;
    const cacheKey = key(registryUrl, network);

    const held = memory.get(cacheKey);
    if (held && Date.now() - held.at < CACHE_MS) return held.assets;

    const stored = await chrome.storage.local.get(cacheKey).catch(() => ({}));
    const cached = stored?.[cacheKey];
    if (cached && Date.now() - cached.at < CACHE_MS) {
        memory.set(cacheKey, cached);
        return cached.assets;
    }

    try {
        const url = `${registryUrl.replace(/\/+$/, "")}/v1/assets?network=${encodeURIComponent(network.toLowerCase())}`;
        const res = await fetch(url, { headers: { accept: "application/json" } });
        if (!res.ok) throw new Error(`${res.status}`);
        const body = await res.json();
        const assets = (body.assets || []).slice(0, MAX_ASSETS);
        const entry = { at: Date.now(), assets };
        memory.set(cacheKey, entry);
        await chrome.storage.local.set({ [cacheKey]: entry }).catch(() => {});
        return assets;
    } catch {
        // Stale is better than nothing: the identity of an asset does not change often, and a
        // warning that disappears when a server is down is worse than one that is a day old.
        return cached?.assets ?? null;
    }
}

/**
 * What the index says about one contract id, plus whether its ticker is used by others.
 *
 * `null` means the index had nothing to say. An asset nobody registered is not "suspicious"
 * and not "fine": the wallet shows the contract id and says it is unregistered.
 */
export function describe(assets, assetId, ticker) {
    if (!assets) return null;
    const found = assets.find((a) => a.contract_id === assetId) || null;
    const clash = (ticker ? assets.filter((a) => (a.ticker || "").toLowerCase() === ticker.toLowerCase() && a.contract_id !== assetId) : []).map(
        (a) => a.contract_id,
    );
    const status = found?.status || {};
    const listed = (status.listed_by || []).length > 0;

    return {
        registered: Boolean(found),
        name: found?.name ?? null,
        ticker: found?.ticker ?? null,
        // Each of these stands on its own; the wallet never merges them into one word.
        issuerSigned: Boolean(status.issuer_signed),
        issuerVerified: Boolean(status.issuer_verified),
        issuerIdentified: Boolean(status.issuer_identified),
        listed,
        disputed: Boolean(status.dispute),
        sameTicker: clash,
    };
}
