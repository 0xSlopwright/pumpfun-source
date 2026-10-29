import assert from "node:assert/strict";
import test from "node:test";
import {
  BOARD_CHAINS,
  BOARD_LIMIT,
  BOARD_WINDOWS,
  OBSERVED_BOARD_ORIGIN,
  buildBoardPath,
  buildBoardRequest,
  isBoardDelta,
  isBoardSnapshot,
  isBoardWindow,
  normalizeBoardWindow,
} from "../reconstruction/market-boards/request.mjs";
const query = (options) =>
  new URL(buildBoardPath(options), "http://127.0.0.1").searchParams;

test("movers default preserves captured cap, ordered defaults and non-gated chains", () => {
  assert.equal(BOARD_LIMIT, 150);
  assert.equal(
    buildBoardPath({ limit: 300 }),
    "/boards/movers?tier=web&surface=WEB&platform=WEB&limit=150&chains=solana%2Ceip155%3A4663%2Ceip155%3A8453%2Ceip155%3A56%2Ceip155%3A1%2Ceip155%3A5042%2Ceip155%3A143",
  );
  assert.equal(query({ limit: 48 }).get("limit"), "48");
  assert.equal(OBSERVED_BOARD_ORIGIN, "https://advanced-indexer.pump.fun");
});
test("trending adds social ranking, one-hour window and hot label", () => {
  assert.equal(
    buildBoardPath({ board: "trending", limit: 10, chain: "solana" }),
    "/boards/trending?tier=web&surface=TRENDING&platform=WEB&limit=10&chains=solana&ranking=social&window=1h&hot=label",
  );
  for (const window of BOARD_WINDOWS)
    assert.equal(
      query({ board: "trending", limit: 10, window }).get("window"),
      window,
    );
  assert.equal(
    query({ board: "movers", limit: 10, window: "4h" }).has("window"),
    false,
  );
});
test("the separate window normalizer is not silently applied by the URL builder", () => {
  for (const value of [undefined, null, "", "2h", 1, {}, ["1h"]]) {
    assert.equal(isBoardWindow(value), false);
    assert.equal(normalizeBoardWindow(value), "1h");
  }
  for (const value of BOARD_WINDOWS) {
    assert.equal(isBoardWindow(value), true);
    assert.equal(normalizeBoardWindow(value), value);
  }
  assert.equal(
    query({ board: "trending", limit: 3, window: "2h" }).get("window"),
    "2h",
  );
  assert.equal(
    query({ board: "trending", limit: 3, window: null }).get("window"),
    "null",
  );
});
test("optional scalar fields keep original truthiness versus undefined distinctions", () => {
  const options = {
    limit: 1,
    userId: "user /&",
    pumpUserId: "pump",
    sessionId: "session",
    deviceId: "device",
    sessionStartTimestampMs: 0,
    country: "US",
    offset: 0,
    includeFollowedHolders: true,
  };
  const before = structuredClone(options);
  const q = query(options);
  assert.equal(q.get("userId"), "user /&");
  assert.equal(q.get("pumpUserId"), "pump");
  assert.equal(q.get("session_id"), "session");
  assert.equal(q.get("device_id"), "device");
  assert.equal(q.get("session_start_timestamp_ms"), "0");
  assert.equal(q.get("country"), "US");
  assert.equal(q.get("offset"), "0");
  assert.equal(q.get("includeFollowedHolders"), "true");
  assert.equal(q.get("followedHoldersLimit"), "5");
  assert.deepEqual(options, before);
  const empty = query({
    limit: 1,
    userId: "",
    pumpUserId: "",
    sessionId: "",
    deviceId: "",
    country: "",
    includeFollowedHolders: false,
  });
  for (const field of [
    "userId",
    "pumpUserId",
    "session_id",
    "device_id",
    "country",
    "offset",
    "includeFollowedHolders",
    "followedHoldersLimit",
  ])
    assert.equal(empty.has(field), false);
  assert.equal(query({ limit: 1, offset: null }).get("offset"), "null");
});
test("limit encoding is an upper clamp, not invented server validation", () => {
  for (const [limit, encoded] of [
    [0, "0"],
    [-1, "-1"],
    [1.5, "1.5"],
    [Infinity, "150"],
    [NaN, "NaN"],
    [undefined, "NaN"],
  ])
    assert.equal(query({ limit }).get("limit"), encoded);
});
test("exposure flags gate all-chain discovery with exact true semantics", () => {
  const gated = [
    "megaeth",
    "xlayer",
    "ton",
    "polygon",
    "near",
    "starknet",
    "arbitrum",
  ];
  const wires = {
    megaeth: "eip155:4326",
    xlayer: "eip155:196",
    ton: "ton:-239",
    polygon: "eip155:137",
    near: "near:mainnet",
    starknet: "starknet:SN_MAIN",
    arbitrum: "eip155:42161",
  };
  for (let mask = 0; mask < 128; mask++) {
    const exposure = Object.fromEntries(
      gated.map((chain, index) => [chain, Boolean(mask & (1 << index))]),
    );
    const values = query({ limit: 1, exposure }).get("chains").split(",");
    assert.equal(
      values.length,
      7 + gated.filter((chain) => exposure[chain]).length,
    );
    for (const chain of gated)
      assert.equal(values.includes(wires[chain]), exposure[chain]);
  }
  assert.equal(
    query({ limit: 1, exposure: { near: 1, ton: "true" } }).get("chains"),
    query({ limit: 1 }).get("chains"),
  );
});
test("explicit chain sets intersect in canonical order, ignoring duplicates and unknowns", () => {
  assert.equal(
    query({ limit: 1, chains: ["base", "solana", "base", "unknown"] }).get(
      "chains",
    ),
    "solana,eip155:8453",
  );
  assert.equal(
    query({ limit: 1, chain: "ethereum", chains: ["near"] }).get("chains"),
    "eip155:1",
  );
  assert.equal(
    query({ limit: 1, chains: ["near"], exposure: { near: true } }).get(
      "chains",
    ),
    "near:mainnet",
  );
  assert.equal(
    query({ limit: 1, chains: [] }).get("chains"),
    query({ limit: 1 }).get("chains"),
  );
  assert.equal(
    query({ limit: 1, chains: ["near"] }).get("chains"),
    query({ limit: 1 }).get("chains"),
  );
});
test("explicit single chain is not silently exposure-filtered", () => {
  const expected = [
    "solana",
    "eip155:4663",
    "eip155:8453",
    "eip155:56",
    "eip155:1",
    "eip155:5042",
    "eip155:4326",
    "eip155:196",
    "eip155:143",
    "eip155:137",
    "eip155:42161",
    "near:mainnet",
    "ton:-239",
    "starknet:SN_MAIN",
  ];
  for (const [index, chain] of BOARD_CHAINS.entries())
    assert.equal(query({ limit: 1, chain }).get("chains"), expected[index]);
});
test("local adapter bounds support to the declared two boards and known single chains", () => {
  for (const board of ["../other", "other", "__proto__", ""])
    assert.throws(
      () => buildBoardPath({ limit: 1, board }),
      /Unsupported board/,
    );
  for (const chain of ["unknown", "__proto__", "constructor", ""])
    assert.throws(
      () => buildBoardPath({ limit: 1, chain }),
      /Unsupported board chain/,
    );
});
test("request planner has no implicit origin, transport, cookies, storage or signal creation", () => {
  const original = globalThis.fetch;
  globalThis.fetch = () => {
    throw new Error("network must not be called");
  };
  try {
    assert.throws(
      () => buildBoardRequest({ limit: 1 }),
      /explicit board destination/,
    );
    const controller = new AbortController();
    const plan = buildBoardRequest(
      { limit: 1 },
      {
        baseUrl: "http://127.0.0.1:3001/api/indexer/",
        signal: controller.signal,
      },
    );
    assert.ok(
      plan.url.startsWith("http://127.0.0.1:3001/api/indexer/boards/movers?"),
    );
    assert.deepEqual(plan.init, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    });
    controller.abort();
    assert.equal(plan.init.signal.aborted, true);
    assert.equal(
      "signal" in
        buildBoardRequest({ limit: 1 }, { baseUrl: "https://example.invalid" })
          .init,
      false,
    );
  } finally {
    globalThis.fetch = original;
  }
});
test("destination restrictions are explicit local policy", () => {
  for (const baseUrl of [
    "/api/indexer",
    "ftp://example.invalid",
    "https://u:p@example.invalid",
    "https://example.invalid?x=1",
    "https://example.invalid#fragment",
    "https://example.invalid?",
    "https://example.invalid#",
    "https://example.invalid?#",
    "https://example.invalid/api/indexer?",
    "https://example.invalid/api/indexer#",
    "https://example.invalid/api/indexer?#",
  ])
    assert.throws(() => buildBoardRequest({ limit: 1 }, { baseUrl }));
});
test("snapshot and delta predicates remain shallow structural guards", () => {
  assert.equal(
    isBoardSnapshot({ type: "snapshot", entries: [null, 3, {}] }),
    true,
  );
  assert.equal(isBoardDelta({ type: "delta", patches: [null] }), true);
  for (const value of [
    null,
    undefined,
    false,
    1,
    "snapshot",
    {},
    { type: "snapshot", entries: {} },
    { type: "delta", entries: [] },
  ])
    assert.equal(isBoardSnapshot(value), false);
  for (const value of [
    null,
    undefined,
    false,
    1,
    {},
    { type: "delta", patches: {} },
    { type: "snapshot", patches: [] },
  ])
    assert.equal(isBoardDelta(value), false);
});
