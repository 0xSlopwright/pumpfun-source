import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { buildApp } from "../src/app.js";
import defaultSeed from "../src/home-feed-seed.json" with { type: "json" };
import {
  HOME_FEED_DATA_SOURCE,
  HOME_FEED_SEED_CANONICAL_SHA256,
  HomeFeedSeedError,
  HomeFeedStore,
  type HomeFeedFilters,
  type HomeFeedSeed,
  type HomeFeedSeedRecord,
} from "../src/home-feed-store.js";
import {
  assertSchema,
  type SchemaNode,
  type SchemaRoot,
} from "../src/schema-validator.js";
import { TEST_API_KEY } from "./with-api-key.js";

const ROUTE = "/services/frontend/home-feed";
const NEW_ROUTE = `${ROUTE}/new`;
const COUNT_ROUTE = `${NEW_ROUTE}/count`;
const EMPTY_FILTERS: HomeFeedFilters = { chains: [], assetClasses: [] };

const specPath = fileURLToPath(
  new URL("../../../contracts/developer.openapi.json", import.meta.url),
);
const spec = JSON.parse(readFileSync(specPath, "utf8")) as {
  paths: Record<
    string,
    Record<
      string,
      {
        responses?: Record<
          string,
          { content?: Record<string, { schema?: SchemaNode }> }
        >;
      }
    >
  >;
};
const specRoot = spec as unknown as SchemaRoot;

function responseSchema(path: string): SchemaNode {
  const schema =
    spec.paths[path]?.get?.responses?.["200"]?.content?.["application/json"]
      ?.schema;
  assert.ok(schema, `missing response schema for ${path}`);
  return schema;
}

function cloneSeed(): HomeFeedSeed {
  return structuredClone(defaultSeed) as HomeFeedSeed;
}

function visibleCalloutIds(body: {
  coins: Array<{ position: { callout: { calloutId: string } } }>;
}) {
  return body.coins.map((coin) => coin.position.callout.calloutId);
}

function record(
  index: number,
  createdAt: string,
  overrides: Partial<HomeFeedSeedRecord> = {},
): HomeFeedSeedRecord {
  const suffix = String(index).padStart(12, "0");
  return {
    ...(structuredClone(defaultSeed.records[0]) as HomeFeedSeedRecord),
    recordId: `test-record-${index}`,
    calloutId: `00000000-0000-4000-8000-${suffix}`,
    coinMint: `TEST_MINT_${index}`,
    coinName: `Test coin ${index}`,
    symbol: `T${index}`,
    createdAt,
    localRank: index + 1,
    authorId: `test-author-${index}`,
    authorName: `Test Author ${index}`,
    thesis: "Synthetic test-only callout",
    deleted: false,
    hidden: false,
    ...overrides,
  };
}

function storeFor(seed: HomeFeedSeed) {
  return new HomeFeedStore(seed, {
    verifyDefaultHash: false,
    dataSource: "synthetic-test-home-feed",
  });
}

test("default seed is hash-bound and validates before route registration", () => {
  assert.equal(
    createHash("sha256").update(JSON.stringify(defaultSeed)).digest("hex"),
    HOME_FEED_SEED_CANONICAL_SHA256,
  );
  const store = new HomeFeedStore();
  assert.equal(store.dataSource, HOME_FEED_DATA_SOURCE);
  assert.equal(store.snapshotRecords().length, 10);
});

test("registers all three local read routes with GET and automatic HEAD", async () => {
  const app = buildApp();
  try {
    for (const url of [ROUTE, NEW_ROUTE]) {
      const get = await app.inject({ method: "GET", url });
      assert.equal(get.statusCode, 200, url);
      assert.equal(
        get.headers["x-reconstruction-data-source"],
        HOME_FEED_DATA_SOURCE,
      );
      assert.equal(
        get.headers["x-reconstruction-compatibility"],
        "local-unqualified",
      );
      assert.equal(get.headers["cache-control"], "no-store");
      const head = await app.inject({ method: "HEAD", url });
      assert.equal(head.statusCode, 200, `${url} HEAD`);
      assert.equal(head.body, "");
    }
    const initial = (await app.inject(NEW_ROUTE)).json();
    const countHead = await app.inject({
      method: "HEAD",
      url: `${COUNT_ROUTE}?since=${encodeURIComponent(initial.headToken)}`,
    });
    assert.equal(countHead.statusCode, 200);
    assert.equal(countHead.body, "");
  } finally {
    await app.close();
  }
});

test("serves the local routes over real loopback HTTP without authentication", async () => {
  const app = buildApp();
  try {
    const address = await app.listen({ host: "127.0.0.1", port: 0 });
    const response = await fetch(`${address}${ROUTE}?pageSize=1`);
    assert.equal(response.status, 200);
    assert.equal(
      response.headers.get("x-reconstruction-data-source"),
      HOME_FEED_DATA_SOURCE,
    );
    assert.equal(
      ((await response.json()) as { coins: unknown[] }).coins.length,
      1,
    );
  } finally {
    await app.close();
  }
});

test("keeps the separate developer operations behind their API-key and 501 boundary", async () => {
  const app = buildApp();
  try {
    const unauthenticated = await app.inject("/v1/home-feed");
    assert.equal(unauthenticated.statusCode, 401);
    const localDeveloper = await app.inject({
      method: "GET",
      url: "/v1/home-feed",
      headers: { authorization: `Bearer ${TEST_API_KEY}` },
    });
    assert.equal(localDeveloper.statusCode, 501);
    assert.equal(localDeveloper.json().error, "COMPATIBILITY_NOT_IMPLEMENTED");
  } finally {
    await app.close();
  }
});

test("rejects fixture registrations that would be shadowed by native feed routes", () => {
  for (const path of [ROUTE, NEW_ROUTE, COUNT_ROUTE]) {
    assert.throws(
      () =>
        buildApp([
          {
            method: "GET",
            path,
            status: 200,
            body: { fixture: true },
            source: "synthetic:test",
          },
        ]),
      /Reserved fixture route/,
    );
  }
});

test("ranked and chronological responses conform to the declared response schemas", async () => {
  const app = buildApp();
  try {
    const ranked = await app.inject(`${ROUTE}?pageSize=4`);
    const newest = await app.inject(`${NEW_ROUTE}?pageSize=4`);
    assert.equal(ranked.statusCode, 200);
    assert.equal(newest.statusCode, 200);
    assertSchema(
      ranked.json(),
      responseSchema("/home-feed"),
      "local ranked Home Feed",
      specRoot,
    );
    assertSchema(
      newest.json(),
      responseSchema("/home-feed/new"),
      "local chronological Home Feed",
      specRoot,
    );
  } finally {
    await app.close();
  }
});

test("ranked first pages are deterministic and use stable rank/timestamp/id ties", async () => {
  const app = buildApp();
  try {
    const first = await app.inject(`${ROUTE}?pageSize=8`);
    const repeated = await app.inject(`${ROUTE}?pageSize=8`);
    assert.equal(first.body, repeated.body);
    assert.deepEqual(visibleCalloutIds(first.json()), [
      "00000000-0000-4000-8000-000000000001",
      "00000000-0000-4000-8000-000000000002",
      "00000000-0000-4000-8000-000000000003",
      "00000000-0000-4000-8000-000000000004",
      "00000000-0000-4000-8000-000000000005",
      "00000000-0000-4000-8000-000000000006",
      "00000000-0000-4000-8000-000000000007",
      "00000000-0000-4000-8000-000000000008",
    ]);
  } finally {
    await app.close();
  }
});

test("ranked cursor pagination traverses every visible row exactly once", async () => {
  const app = buildApp();
  try {
    const ids: string[] = [];
    let token: string | undefined;
    do {
      const response = await app.inject(
        `${ROUTE}?pageSize=3${token ? `&pageToken=${encodeURIComponent(token)}` : ""}`,
      );
      assert.equal(response.statusCode, 200);
      const body = response.json();
      ids.push(...visibleCalloutIds(body));
      token = body.nextPageToken;
    } while (token);
    assert.equal(ids.length, 8);
    assert.equal(new Set(ids).size, 8);
  } finally {
    await app.close();
  }
});

test("ranked page-number mode is deterministic and terminal pages omit continuation", async () => {
  const app = buildApp();
  try {
    const page = await app.inject(`${ROUTE}?page=1&pageSize=3`);
    assert.deepEqual(visibleCalloutIds(page.json()), [
      "00000000-0000-4000-8000-000000000004",
      "00000000-0000-4000-8000-000000000005",
      "00000000-0000-4000-8000-000000000006",
    ]);
    const terminal = (await app.inject(`${ROUTE}?page=8&pageSize=3`)).json();
    assert.deepEqual(terminal, { coins: [] });
  } finally {
    await app.close();
  }
});

test("supports deterministic chain, asset-class and numeric-band filtering", async () => {
  const app = buildApp();
  try {
    const solana = (await app.inject(`${ROUTE}?chain=solana`)).json();
    assert.deepEqual(
      solana.coins.map((coin: { chain: string }) => coin.chain),
      ["solana", "solana", "solana", "solana"],
    );
    const merged = (await app.inject(`${ROUTE}?chains=base,ethereum`)).json();
    assert.ok(
      merged.coins.every((coin: { chain: string }) =>
        ["base", "ethereum"].includes(coin.chain),
      ),
    );
    const stock = (await app.inject(`${ROUTE}?assetClasses=stock`)).json();
    assert.equal(stock.coins.length, 1);
    assert.equal(stock.coins[0].coinMint, "LOCAL_EXAMPLE_MINT_003");
    const bounded = (
      await app.inject(`${ROUTE}?minMarketCapUsd=80000&maxMarketCapUsd=130000`)
    ).json();
    assert.deepEqual(
      bounded.coins.map((coin: { marketCap: number }) => coin.marketCap),
      [125000, 85000],
    );
  } finally {
    await app.close();
  }
});

test("validates ranked page boundaries and pagination-mode conflicts", async () => {
  const app = buildApp();
  try {
    assert.equal((await app.inject(`${ROUTE}?pageSize=1`)).statusCode, 200);
    assert.equal((await app.inject(`${ROUTE}?pageSize=200`)).statusCode, 200);
    for (const url of [
      `${ROUTE}?pageSize=0`,
      `${ROUTE}?pageSize=201`,
      `${ROUTE}?page=-1`,
      `${ROUTE}?page=1.5`,
    ]) {
      assert.equal((await app.inject(url)).statusCode, 400, url);
    }
    const first = (await app.inject(`${ROUTE}?pageSize=1`)).json();
    const conflict = await app.inject(
      `${ROUTE}?page=1&pageToken=${encodeURIComponent(first.nextPageToken)}`,
    );
    assert.equal(conflict.statusCode, 400);
    assert.equal(conflict.json().error, "PAGINATION_MODE_CONFLICT");
  } finally {
    await app.close();
  }
});

test("rejects malformed, repeated, unknown and contradictory queries", async () => {
  const app = buildApp();
  try {
    const cases = [
      [`${ROUTE}?pageSize=NaN`, "INVALID_INTEGER"],
      [`${ROUTE}?pageSize=Infinity`, "INVALID_INTEGER"],
      [`${ROUTE}?forceRefresh=1`, "INVALID_BOOLEAN"],
      [`${ROUTE}?pageSize=2&pageSize=3`, "DUPLICATE_QUERY_PARAMETER"],
      [`${ROUTE}?unknown=true`, "UNKNOWN_QUERY_PARAMETER"],
      [`${ROUTE}?chain=solana&chains=solana,base`, "CHAIN_FILTER_CONFLICT"],
      [`${ROUTE}?chains=solana,solana`, "INVALID_QUERY_LIST"],
      [`${ROUTE}?chain=solana%2Cbase`, "INVALID_CHAIN"],
      [`${ROUTE}?assetClasses=coin,unknown`, "INVALID_QUERY_LIST"],
      [`${ROUTE}?minMarketCapUsd=10&maxMarketCapUsd=9`, "CONTRADICTORY_BOUNDS"],
      [`${ROUTE}?minCostBasisUsd=-1`, "INVALID_NUMBER"],
      [`${ROUTE}?platform=web`, "INVALID_PLATFORM"],
      [`${ROUTE}?pageToken=${"x".repeat(257)}`, "CURSOR_TOO_LONG"],
    ] as const;
    for (const [url, expected] of cases) {
      const response = await app.inject(url);
      assert.equal(response.statusCode, 400, url);
      assert.equal(response.json().error, expected, url);
    }
  } finally {
    await app.close();
  }
});

test("rejects unsupported personalization while retaining vestigial/local controls", async () => {
  const app = buildApp();
  try {
    for (const url of [
      `${ROUTE}?userId=someone`,
      `${ROUTE}?includeFollowedHolders=true`,
      `${ROUTE}?session_id=session`,
      `${ROUTE}?platform=APP`,
    ]) {
      const response = await app.inject(url);
      assert.equal(response.statusCode, 501, url);
      assert.equal(response.json().error, "PERSONALIZED_FEED_UNAVAILABLE");
    }
    assert.equal(
      (
        await app.inject(
          `${ROUTE}?includeFollowedHolders=false&followedHoldersLimit=999&recsys=true&forceRefresh=true&platform=WEB`,
        )
      ).statusCode,
      200,
    );
  } finally {
    await app.close();
  }
});

test("chronological feed is newest-first, tie-stable and bounded to the injected 24-hour window", async () => {
  const app = buildApp();
  try {
    const response = await app.inject(`${NEW_ROUTE}?pageSize=50`);
    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.deepEqual(visibleCalloutIds(body), [
      "00000000-0000-4000-8000-000000000001",
      "00000000-0000-4000-8000-000000000002",
      "00000000-0000-4000-8000-000000000003",
      "00000000-0000-4000-8000-000000000004",
      "00000000-0000-4000-8000-000000000005",
      "00000000-0000-4000-8000-000000000006",
      "00000000-0000-4000-8000-000000000007",
    ]);
    assert.equal(body.nextPageToken, undefined);
    assert.equal(body.liveSubject, "local.reconstruction.realtime-unavailable");
    assert.equal(typeof body.headToken, "string");
  } finally {
    await app.close();
  }
});

test("chronological keyset pagination has no duplicate or skipped equal-timestamp rows", async () => {
  const app = buildApp();
  try {
    const ids: string[] = [];
    let token: string | undefined;
    let pageIndex = 0;
    do {
      const response = await app.inject(
        `${NEW_ROUTE}?pageSize=2${token ? `&pageToken=${encodeURIComponent(token)}` : ""}`,
      );
      assert.equal(response.statusCode, 200);
      const body = response.json();
      ids.push(...visibleCalloutIds(body));
      assert.equal(
        pageIndex === 0 ? typeof body.headToken : body.headToken,
        pageIndex === 0 ? "string" : null,
      );
      token = body.nextPageToken;
      pageIndex += 1;
    } while (token);
    assert.equal(ids.length, 7);
    assert.equal(new Set(ids).size, 7);
    assert.deepEqual(ids.slice(2, 4), [
      "00000000-0000-4000-8000-000000000003",
      "00000000-0000-4000-8000-000000000004",
    ]);
  } finally {
    await app.close();
  }
});

test("chronological page size accepts 1 and 50 and rejects 0 and 51", async () => {
  const app = buildApp();
  try {
    assert.equal((await app.inject(`${NEW_ROUTE}?pageSize=1`)).statusCode, 200);
    assert.equal(
      (await app.inject(`${NEW_ROUTE}?pageSize=50`)).statusCode,
      200,
    );
    assert.equal((await app.inject(`${NEW_ROUTE}?pageSize=0`)).statusCode, 400);
    assert.equal(
      (await app.inject(`${NEW_ROUTE}?pageSize=51`)).statusCode,
      400,
    );
  } finally {
    await app.close();
  }
});

test("rejects tampered, wrong-operation, foreign-dataset and cross-filter cursors", async () => {
  const app = buildApp();
  try {
    const firstNew = (await app.inject(`${NEW_ROUTE}?pageSize=1`)).json();
    const tampered = `${firstNew.nextPageToken.slice(0, -1)}${
      firstNew.nextPageToken.endsWith("A") ? "B" : "A"
    }`;
    for (const url of [
      `${NEW_ROUTE}?pageToken=${encodeURIComponent(tampered)}`,
      `${ROUTE}?pageToken=${encodeURIComponent(firstNew.nextPageToken)}`,
      `${NEW_ROUTE}?chain=solana&pageToken=${encodeURIComponent(firstNew.nextPageToken)}`,
    ]) {
      const response = await app.inject(url);
      assert.equal(response.statusCode, 400, url);
      assert.equal(response.json().error, "INVALID_CURSOR");
    }

    const foreignSeed = cloneSeed();
    foreignSeed.datasetId = "another-synthetic-dataset";
    const foreignApp = buildApp([], { homeFeedStore: storeFor(foreignSeed) });
    try {
      const response = await foreignApp.inject(
        `${NEW_ROUTE}?pageToken=${encodeURIComponent(firstNew.nextPageToken)}`,
      );
      assert.equal(response.statusCode, 400);
      assert.equal(response.json().error, "INVALID_CURSOR");
    } finally {
      await foreignApp.close();
    }
  } finally {
    await app.close();
  }
});

test("new-count requires a pinned head cursor and returns a stable zero count", async () => {
  const app = buildApp();
  try {
    for (const url of [
      COUNT_ROUTE,
      `${COUNT_ROUTE}?since=`,
      `${COUNT_ROUTE}?since=invalid`,
    ]) {
      const response = await app.inject(url);
      assert.equal(response.statusCode, 400, url);
    }
    const head = (await app.inject(NEW_ROUTE)).json().headToken;
    const first = await app.inject(
      `${COUNT_ROUTE}?since=${encodeURIComponent(head)}`,
    );
    const repeated = await app.inject(
      `${COUNT_ROUTE}?since=${encodeURIComponent(head)}`,
    );
    assert.equal(first.statusCode, 200);
    assert.equal(first.body, repeated.body);
    assert.deepEqual(first.json(), {
      newCount: 0,
      capped: false,
      headToken: head,
    });
  } finally {
    await app.close();
  }
});

test("new-count detects one and multiple records without advancing the caller's since", () => {
  const currentSeed = cloneSeed();
  const oneOld = cloneSeed();
  oneOld.records = oneOld.records.filter(
    (entry) => entry.calloutId !== currentSeed.records[0].calloutId,
  );
  const oneSince = storeFor(oneOld).newest({
    filters: EMPTY_FILTERS,
    pageSize: 25,
  }).headToken!;
  const current = storeFor(currentSeed);
  const one = current.countNew({ filters: EMPTY_FILTERS, since: oneSince });
  assert.equal(one.newCount, 1);
  assert.equal(one.capped, false);
  assert.notEqual(one.headToken, oneSince);
  assert.deepEqual(
    current.countNew({ filters: EMPTY_FILTERS, since: oneSince }),
    one,
  );

  const threeOld = cloneSeed();
  const removed = new Set(
    currentSeed.records.slice(0, 3).map((entry) => entry.calloutId),
  );
  threeOld.records = threeOld.records.filter(
    (entry) => !removed.has(entry.calloutId),
  );
  const threeSince = storeFor(threeOld).newest({
    filters: EMPTY_FILTERS,
    pageSize: 25,
  }).headToken!;
  assert.equal(
    current.countNew({ filters: EMPTY_FILTERS, since: threeSince }).newCount,
    3,
  );
});

test("new-count applies filter context and rejects a cursor swapped between filters", () => {
  const currentSeed = cloneSeed();
  const oldSeed = cloneSeed();
  oldSeed.records = oldSeed.records.filter(
    (entry) => entry.calloutId !== currentSeed.records[0].calloutId,
  );
  const solanaFilters: HomeFeedFilters = {
    chains: ["solana"],
    assetClasses: [],
  };
  const since = storeFor(oldSeed).newest({
    filters: solanaFilters,
    pageSize: 25,
  }).headToken!;
  const current = storeFor(currentSeed);
  assert.equal(current.countNew({ filters: solanaFilters, since }).newCount, 1);
  assert.throws(
    () => current.countNew({ filters: EMPTY_FILTERS, since }),
    /filter context/,
  );
});

test("new-count implements an explicit 25-row local memo cap", () => {
  const observedAt = "2026-10-28T12:00:00.000Z";
  const oldSeed: HomeFeedSeed = {
    datasetId: "synthetic-count-cap",
    observedAt,
    records: [record(90, "2026-10-28T10:00:00.000Z")],
  };
  const currentSeed: HomeFeedSeed = {
    ...oldSeed,
    records: [
      ...Array.from({ length: 30 }, (_, index) =>
        record(
          index + 1,
          new Date(Date.parse(observedAt) - (index + 1) * 60_000).toISOString(),
        ),
      ),
      ...oldSeed.records,
    ],
  };
  const since = storeFor(oldSeed).newest({
    filters: EMPTY_FILTERS,
    pageSize: 25,
  }).headToken!;
  assert.deepEqual(
    storeFor(currentSeed).countNew({ filters: EMPTY_FILTERS, since }),
    {
      newCount: 25,
      capped: true,
      headToken: storeFor(currentSeed).newest({
        filters: EMPTY_FILTERS,
        pageSize: 25,
      }).headToken,
    },
  );
});

test("validates seed identity, authors, chains, timestamps and visibility", () => {
  const mutations: Array<[string, (seed: HomeFeedSeed) => void, RegExp]> = [
    [
      "duplicate record identity",
      (seed) => {
        seed.records[1].recordId = seed.records[0].recordId;
      },
      /duplicate recordId/,
    ],
    [
      "missing author",
      (seed) => {
        seed.records[0].authorId = "";
      },
      /authorId/,
    ],
    [
      "invalid chain",
      (seed) => {
        seed.records[0].chain = "not-a-chain" as HomeFeedSeedRecord["chain"];
      },
      /unsupported chain/,
    ],
    [
      "future timestamp",
      (seed) => {
        seed.records[0].createdAt = "2026-10-29T12:00:00.000Z";
      },
      /newer than the observation/,
    ],
  ];
  for (const [label, mutate, expected] of mutations) {
    const seed = cloneSeed();
    mutate(seed);
    assert.throws(() => storeFor(seed), expected, label);
  }
  const store = new HomeFeedStore();
  const ids = visibleCalloutIds(
    store.ranked({ filters: EMPTY_FILTERS, page: 0, pageSize: 200 }),
  );
  assert.ok(!ids.includes("00000000-0000-4000-8000-000000000009"));
  assert.ok(!ids.includes("00000000-0000-4000-8000-000000000010"));
});

test("store reads and projections cannot mutate the source dataset", () => {
  const seed = cloneSeed();
  const store = storeFor(seed);
  seed.records[0].coinName = "mutated after construction";
  const snapshot = store.snapshotRecords();
  snapshot[0].coinName = "mutated snapshot";
  const first = store.ranked({ filters: EMPTY_FILTERS, page: 0, pageSize: 1 });
  first.coins[0].coinName = "mutated response";
  assert.equal(
    store.ranked({ filters: EMPTY_FILTERS, page: 0, pageSize: 1 }).coins[0]
      .coinName,
    "Local Example Alpha",
  );
});

test("local responses expose no private, media, recommendation or realtime service data", async () => {
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = (async () => {
    fetchCalls += 1;
    throw new Error("unexpected network request");
  }) as typeof fetch;
  const app = buildApp();
  try {
    for (const url of [ROUTE, NEW_ROUTE]) {
      const response = await app.inject(url);
      assert.equal(response.statusCode, 200);
      const serialized = response.body;
      assert.doesNotMatch(serialized, /https?:\/\//u);
      assert.doesNotMatch(
        serialized,
        /recommendationId|recommendationRank|private|cookie|credential/iu,
      );
    }
    assert.equal(fetchCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
    await app.close();
  }
});

test("existing posts and unknown-route behavior remain intact", async () => {
  const app = buildApp();
  try {
    const post = await app.inject({
      method: "GET",
      url: "/v1/posts?ids=00000000-0000-4000-8000-000000000001",
      headers: { authorization: `Bearer ${TEST_API_KEY}` },
    });
    assert.equal(post.statusCode, 200);
    assert.equal(post.json().posts.length, 1);
    const unknown = await app.inject("/services/frontend/home-feed/unknown");
    assert.equal(unknown.statusCode, 501);
    assert.equal(unknown.json().error, "COMPATIBILITY_NOT_IMPLEMENTED");
  } finally {
    await app.close();
  }
});

test("empty query names cannot mask unknown Home Feed parameters", async (t) => {
  const app = buildApp();
  try {
    const head = (await app.inject(NEW_ROUTE)).json().headToken;
    for (const route of [ROUTE, NEW_ROUTE, COUNT_ROUTE]) {
      await t.test(route, async () => {
        const prefix =
          route === COUNT_ROUTE ? `since=${encodeURIComponent(head)}&` : "";
        assert.equal((await app.inject(`${route}?${prefix}`)).statusCode, 200);
        for (const query of [
          "=ignored",
          "=ignored&unknown=true",
          "unknown=true&=ignored",
        ]) {
          const url = `${route}?${prefix}${query}`;
          const response = await app.inject(url);
          assert.equal(response.statusCode, 400, url);
          assert.equal(response.json().error, "UNKNOWN_QUERY_PARAMETER", url);
        }
      });
    }
  } finally {
    await app.close();
  }
});
