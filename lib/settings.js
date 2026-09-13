// Settings shape: global keys plus `byNetwork[<network>]` for the endpoints.
// Pure functions, so they are testable outside the browser.
import { DEFAULTS, NETWORKS, PER_NETWORK } from "../config.js";

/** Defaults for one network, flattened. */
export function netDefaults(network) {
    const n = NETWORKS[network] || {};
    return { esploraUrl: n.esplora || "", proxyUrl: n.proxy || "" };
}

/**
 * Endpoints that used to be defaults and whose hosts no longer answer.
 *
 * 🚨 Saving the settings form writes whatever the fields hold, and they are prefilled with the
 * current defaults — so anyone who ever pressed Save has a copy of that day's default pinned in
 * storage, where a new default can never reach it. Dropping these is the only way an endpoint
 * default can be changed for an existing install. A value the user actually typed is left alone.
 */
const RETIRED = new Set([
    "rpcs://rgb-proxy.flatland.app/json-rpc",
    "rpcs://rgb-regtest-proxy.flatland.app/json-rpc",
    "https://rgb-regtest-indexer.flatland.app/regtest/api",
]);

/**
 * Moves endpoints stored in the old flat layout under the network they were configured for, and
 * drops pinned copies of retired defaults. Returns `{ raw, changed }`; the caller persists when
 * `changed` is true.
 */
export function migrate(stored) {
    const raw = { ...DEFAULTS, ...stored };
    let changed = false;

    if (!raw.byNetwork && PER_NETWORK.some((k) => raw[k])) {
        const moved = Object.fromEntries(PER_NETWORK.filter((k) => raw[k]).map((k) => [k, raw[k]]));
        for (const k of PER_NETWORK) delete raw[k];
        raw.byNetwork = { [raw.network]: moved };
        changed = true;
    }

    // Copied rather than edited in place: `raw` shares `byNetwork` with the caller's object.
    const byNetwork = {};
    for (const [net, saved] of Object.entries(raw.byNetwork || {})) {
        const kept = { ...saved };
        for (const k of PER_NETWORK) {
            if (RETIRED.has(kept[k])) { delete kept[k]; changed = true; }
        }
        byNetwork[net] = kept;
    }
    return { raw: { ...raw, byNetwork }, changed };
}

/** Effective settings for one network. */
export function resolve(raw, network = null) {
    const net = network || raw.network || DEFAULTS.network;
    const { byNetwork = {}, ...global } = raw;
    for (const k of PER_NETWORK) delete global[k];
    return { ...global, network: net, ...netDefaults(net), ...(byNetwork[net] || {}) };
}

/** Applies a settings update: endpoint keys go under the network, the rest stay global. */
export function apply(raw, incoming) {
    const net = incoming.network || raw.network;
    const perNet = {};
    const global = {};
    for (const [k, v] of Object.entries(incoming)) {
        if (PER_NETWORK.includes(k)) perNet[k] = v; else global[k] = v;
    }
    return { ...raw, ...global, network: net,
        byNetwork: { ...(raw.byNetwork || {}), [net]: { ...((raw.byNetwork || {})[net] || {}), ...perNet } } };
}
