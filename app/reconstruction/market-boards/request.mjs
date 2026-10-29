/**
 * Maintained reconstruction of the captured board request boundary.
 * No captured code is evaluated; no transport, cookie store, or default destination.
 * See README.md and contracts/market-board-bindings.json for provenance/limits.
 */
export const OBSERVED_BOARD_ORIGIN = "https://advanced-indexer.pump.fun";
export const BOARD_LIMIT = 150;
export const BOARD_WINDOWS = Object.freeze(["1h", "4h", "12h", "24h"]);
export const BOARD_CHAINS = Object.freeze([
  "solana",
  "robinhood",
  "base",
  "bsc",
  "ethereum",
  "arc",
  "megaeth",
  "xlayer",
  "monad",
  "polygon",
  "arbitrum",
  "near",
  "ton",
  "starknet",
]);
const gatedChains = new Set([
  "megaeth",
  "xlayer",
  "ton",
  "polygon",
  "near",
  "starknet",
  "arbitrum",
]);
const wireChains = Object.freeze({
  solana: "solana",
  robinhood: "eip155:4663",
  base: "eip155:8453",
  bsc: "eip155:56",
  ethereum: "eip155:1",
  arc: "eip155:5042",
  megaeth: "eip155:4326",
  xlayer: "eip155:196",
  monad: "eip155:143",
  polygon: "eip155:137",
  arbitrum: "eip155:42161",
  near: "near:mainnet",
  ton: "ton:-239",
  starknet: "starknet:SN_MAIN",
});

export function isBoardWindow(value) {
  return typeof value === "string" && BOARD_WINDOWS.includes(value);
}
export function normalizeBoardWindow(value) {
  return isBoardWindow(value) ? value : "1h";
}
// The captured predicates are intentionally shallow, not response-schema validation.
export function isBoardSnapshot(value) {
  return (
    !!value &&
    typeof value === "object" &&
    value.type === "snapshot" &&
    Array.isArray(value.entries)
  );
}
export function isBoardDelta(value) {
  return (
    !!value &&
    typeof value === "object" &&
    value.type === "delta" &&
    Array.isArray(value.patches)
  );
}

function boardChains({ chain = "all", chains, exposure }) {
  const available = BOARD_CHAINS.filter(
    (item) => !gatedChains.has(item) || exposure?.[item] === true,
  );
  const selected = chains?.length
    ? available.filter((item) => chains.includes(item))
    : [];
  // Explicit single-chain selection is not exposure-filtered in the captured helper.
  if (selected.length)
    return selected.map((item) => wireChains[item]).join(",");
  if (chain !== "all") {
    if (!Object.hasOwn(wireChains, chain))
      throw new TypeError("Unsupported board chain");
    return wireChains[chain];
  }
  return available.map((item) => wireChains[item]).join(",");
}

/** Encode the two reconstructed board families; this is not server validation. */
export function buildBoardPath(options) {
  const board = options.board ?? "movers";
  if (board !== "movers" && board !== "trending")
    throw new TypeError("Unsupported board");
  const query = new URLSearchParams({
    tier: "web",
    surface: options.board === "trending" ? "TRENDING" : "WEB",
    platform: "WEB",
    limit: String(Math.min(options.limit, BOARD_LIMIT)),
  });
  for (const [field, wire] of [
    ["userId", "userId"],
    ["pumpUserId", "pumpUserId"],
    ["sessionId", "session_id"],
    ["deviceId", "device_id"],
  ]) {
    if (options[field]) query.append(wire, options[field]);
  }
  if (options.sessionStartTimestampMs !== undefined)
    query.append(
      "session_start_timestamp_ms",
      String(options.sessionStartTimestampMs),
    );
  if (options.country) query.append("country", options.country);
  query.append("chains", boardChains(options));
  if (options.offset !== undefined)
    query.append("offset", String(options.offset));
  if (board === "trending") {
    query.append("ranking", "social");
    // The separate normalizer is not called here by the original builder.
    query.append(
      "window",
      options.window === undefined ? "1h" : options.window,
    );
    query.append("hot", "label");
  }
  if (options.includeFollowedHolders) {
    query.append("includeFollowedHolders", "true");
    query.append("followedHoldersLimit", "5");
  }
  return `/boards/${board}?${query.toString()}`;
}

/**
 * Return a plan only. A destination must be supplied; no fetch is performed.
 * Reject URL credentials/query/fragment as a local adapter policy, not upstream behavior.
 */
export function buildBoardRequest(options, { baseUrl, signal } = {}) {
  if (typeof baseUrl !== "string" || !baseUrl)
    throw new TypeError("An explicit board destination is required");
  const base = new URL(baseUrl);
  if (
    !["http:", "https:"].includes(base.protocol) ||
    base.username ||
    base.password ||
    // URL.search/hash omit bare delimiters, while href retains them.
    // Appending the board path after either would change its URL component.
    base.href.includes("?") ||
    base.href.includes("#")
  ) {
    throw new TypeError("Board destination must be a plain HTTP(S) base URL");
  }
  const url = base.href.replace(/\/$/, "") + buildBoardPath(options);
  return {
    url,
    init: {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...(signal === undefined ? {} : { signal }),
    },
  };
}
