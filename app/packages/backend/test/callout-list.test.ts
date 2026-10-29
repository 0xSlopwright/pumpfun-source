import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildApp, type Fixture } from "../src/app.js";
import {
  CalloutsStore,
  type CalloutFacts,
  type CalloutsDataset,
} from "../src/callouts-store.js";
import {
  CalloutListError,
  encodeCalloutPage,
} from "../src/callout-list-query.js";
import { assertSchema } from "../src/schema-validator.js";
const headers = { authorization: `Bearer pf_live_${"a".repeat(49)}` };
const spec = JSON.parse(
  readFileSync(
    new URL("../../../contracts/developer.openapi.json", import.meta.url),
    "utf8",
  ),
);
const schema =
  spec.paths["/callout/list/{userId}"].get.responses[200].content[
    "application/json"
  ].schema;
const query = (text = "") => new URLSearchParams(text);
function facts(id: string, extra: Partial<CalloutFacts> = {}): CalloutFacts {
  return {
    calloutId: id,
    userId: "synthetic-wallet",
    coinMint: "synthetic-mint",
    marketCap: 100,
    calloutPrice: 0,
    calloutPriceUsd: 2,
    multiple: 1,
    createdAt: 0,
    maxPriceSol: 0,
    maxPriceUsd: 2,
    likes: 3,
    repostCount: 2,
    quoteCount: 1,
    updateCount: 20,
    commentCount: 4,
    replyCount: 24,
    maxMultiplier: null,
    maxMultiplierAt: null,
    mediaUrl: null,
    quotedCalloutId: null,
    ...extra,
  };
}
function dataset(): CalloutsDataset {
  const author = {
    authorId: "person",
    userName: "Synthetic author",
    profileImage: null,
    isVerified: false,
    verifiedBadgeVisible: false,
    accountKind: "person" as const,
    xUsername: null,
    xFollowerCount: 0,
  };
  return {
    schemaVersion: 1,
    dataSource: "synthetic",
    observedAt: "2026-10-29T00:00:00.000Z",
    authors: [
      author,
      { ...author, authorId: "squad", accountKind: "group" },
      { ...author, authorId: "empty" },
    ],
    callouts: [
      {
        calloutId: "a",
        authorId: "person",
        hidden: false,
        deleted: false,
        facts: facts("a", {
          createdAt: 10,
          multiple: 3,
          quotedCalloutId: "group",
        }),
      },
      {
        calloutId: "c",
        authorId: "person",
        hidden: false,
        deleted: false,
        facts: facts("c", { createdAt: 20, multiple: 2, viewCount: 0 }),
      },
      {
        calloutId: "b",
        authorId: "person",
        hidden: false,
        deleted: false,
        facts: facts("b", { createdAt: 20, multiple: 2 }),
      },
      {
        calloutId: "zero",
        authorId: "person",
        hidden: false,
        deleted: false,
        facts: facts("zero", { multiple: 0 }),
      },
      {
        calloutId: "hidden",
        authorId: "person",
        hidden: true,
        deleted: false,
        facts: facts("hidden"),
      },
      {
        calloutId: "deleted",
        authorId: "person",
        hidden: false,
        deleted: true,
        facts: facts("deleted"),
      },
      {
        calloutId: "unmappable",
        authorId: "person",
        hidden: false,
        deleted: false,
        facts: null,
      },
      {
        calloutId: "group",
        authorId: "squad",
        hidden: false,
        deleted: false,
        facts: facts("group", { userId: "synthetic-admin-wallet" }),
        quoteFacts: {
          calloutId: "group",
          calledOutAtMcap: 100,
          multiple: 1,
          thesis: null,
          mediaUrl: null,
          calloutTimestamp: null,
          likes: 0,
          updateCount: 0,
          commentCount: 0,
          replyCount: 0,
          maxMultiplier: null,
          maxMultiplierAt: null,
          calloutPrice: 2,
          repostCount: 0,
          quoteCount: 0,
          actingUserId: null,
          actingUser: null,
        },
      },
    ],
    updates: [
      {
        calloutId: "a",
        authorId: "person",
        hidden: false,
        deleted: false,
        body: {
          id: "visible",
          content: "public update",
          createdAt: null,
          likeCount: 0,
          mediaUrl: null,
          parentMessageId: null,
          repostCount: 0,
        },
      },
      {
        calloutId: "a",
        authorId: "squad",
        hidden: false,
        deleted: false,
        body: {
          id: "not-author",
          content: "not an author update",
          createdAt: null,
          likeCount: 0,
          mediaUrl: null,
          parentMessageId: null,
          repostCount: 0,
        },
      },
      {
        calloutId: "a",
        authorId: "person",
        hidden: true,
        deleted: false,
        body: {
          id: "hidden-update",
          content: "not public",
          createdAt: null,
          likeCount: 0,
          mediaUrl: null,
          parentMessageId: null,
          repostCount: 0,
        },
      },
    ],
  };
}
const ids = (store: CalloutsStore, qs = "") =>
  store.list("person", query(qs)).callouts.map((row) => row.calloutId);
function error(
  store: CalloutsStore,
  qs: string,
  status: number,
  reason?: string,
  user = "person",
) {
  assert.throws(
    () => store.list(user, query(qs)),
    (e: unknown) =>
      e instanceof CalloutListError &&
      e.status === status &&
      (!reason || e.reason === reason),
  );
}

test("public single-author list projects the exact wire schema, not the single-read identity layout", () => {
  const store = new CalloutsStore(dataset());
  const result = store.list("person");
  assertSchema(result, schema, "list", spec);
  assert.deepEqual(ids(store), ["c", "b", "a", "zero"]);
  assert.equal(result.nextPageToken, "");
  const a = result.callouts.find((row) => row.calloutId === "a")!;
  assert.deepEqual(a.author, {
    userId: "person",
    userName: "Synthetic author",
    profileImage: null,
    accountKind: "person",
  });
  assert.equal(a.userId, "synthetic-wallet");
  assert.equal(a.user_uuid, "");
  assert.equal(Object.hasOwn(a, "userName"), false);
  assert.equal(Object.hasOwn(a, "viewCount"), false);
  assert.equal(result.callouts[0].viewCount, 0);
  assert.deepEqual(
    a.updates.map((row) => row.id),
    ["visible"],
  );
  assert.equal(a.updateCount, 20);
  assert.equal(a.hasLiked, null);
  assert.equal(a.hasReposted, null);
  assert.equal(a.quotedCalloutId, "group");
  assert.equal(a.quotedCallout!.userId, "squad");
  assert.equal(a.quotedCallout!.walletAddress, "synthetic-admin-wallet");
  assert.equal(a.quotedCallout!.callout.quotedCallout, null);
  for (const [key, value] of Object.entries(a))
    if (key.startsWith("tail")) assert.equal(value, null);
  assert.equal(
    Object.keys(a).filter((key) => key.startsWith("tail")).length,
    16,
  );
  assert.equal(store.get("a").callout!.user_uuid, "person");
  assert.equal(Object.hasOwn(store.get("a").callout!, "tailBuyers"), false);
});
for (const [qs, expected] of [
  ["sortBy=TIMESTAMP&sortOrder=ASC", ["zero", "a", "b", "c"]],
  ["sortBy=MULTIPLE&sortOrder=DESC", ["a", "c", "b", "zero"]],
  ["sortBy=MULTIPLE&sortOrder=ASC", ["zero", "b", "c", "a"]],
] as const)
  test(`local deterministic ordering: ${qs}`, () =>
    assert.deepEqual(ids(new CalloutsStore(dataset()), qs), expected));

test("full-history aliases and ignored person includeMembers keep their documented narrow semantics", () => {
  const store = new CalloutsStore(dataset());
  for (const qs of [
    "window=",
    "window=%20aLlTiMe%20",
    "includeMembers=false",
    "includeMembers=true",
  ])
    assert.deepEqual(ids(store, qs), ids(store));
  assert.deepEqual(store.list("empty"), { callouts: [], nextPageToken: "" });
  assert.equal(store.list("squad").callouts[0].author!.accountKind, "group");
  assert.equal(
    store.list("squad").callouts[0].userId,
    "synthetic-admin-wallet",
  );
  error(store, "", 501, "CALLOUT_LIST_AUTHOR_UNAVAILABLE", "synthetic-wallet");
});
for (const window of ["daily", "weekly", "MONTHLY", " LAST_round "])
  test(`unknown time computation stays 501: ${window}`, () =>
    error(
      new CalloutsStore(dataset()),
      `window=${encodeURIComponent(window)}`,
      501,
      "CALLOUT_LIST_WINDOW_UNAVAILABLE",
    ));
test("group members require an adapter; MULTIPLE+members is always invalid even for people and unknown IDs", () => {
  const store = new CalloutsStore(dataset());
  error(
    store,
    "includeMembers=true",
    501,
    "CALLOUT_LIST_MEMBERS_UNAVAILABLE",
    "squad",
  );
  for (const user of ["person", "squad", "unknown"])
    error(
      store,
      "sortBy=MULTIPLE&includeMembers=true",
      400,
      "CALLOUT_LIST_MEMBERS_MULTIPLE_UNSUPPORTED",
      user,
    );
});
for (const qs of [
  "limit=0",
  "limit=-1",
  "limit=1.5",
  "limit=1e2",
  "limit=+1",
  "limit=01",
  "limit=",
  "limit=9007199254740992",
  "limit=Infinity",
  "sortBy=timestamp",
  "sortBy=",
  "sortOrder=desc",
  "includeMembers=1",
  "includeMembers=",
  "includeMembers=TRUE",
  "window=yearly",
  "limit=1&limit=2",
  "window=alltime&window=",
  "sortBy=TIMESTAMP&sortBy=MULTIPLE",
  "sortOrder=ASC&sortOrder=DESC",
  "includeMembers=false&includeMembers=true",
  "pageToken=&pageToken=",
])
  test(`malformed/ambiguous list query rejected: ${qs}`, () =>
    error(new CalloutsStore(dataset()), qs, 400));
for (const key of ["viewer", "user_uuid", "offset", "__proto__", "toString"])
  test(`unsupported list query fails closed: ${key}`, () =>
    error(new CalloutsStore(dataset()), `${key}=x`, 501));

test("default 30 is local client-aligned policy; explicit maximum safe limit is accepted", () => {
  const data = dataset();
  data.callouts = Array.from({ length: 35 }, (_, i) => ({
    calloutId: `id-${i}`,
    authorId: "person",
    hidden: false,
    deleted: false,
    facts: facts(`id-${i}`, { createdAt: i }),
  }));
  data.updates = [];
  const store = new CalloutsStore(data);
  assert.equal(store.list("person").callouts.length, 30);
  assert.ok(store.list("person").nextPageToken);
  assert.equal(
    store.list("person", query("limit=9007199254740991")).callouts.length,
    35,
  );
});
for (const sortBy of ["TIMESTAMP", "MULTIPLE"])
  for (const sortOrder of ["ASC", "DESC"])
    test(`pagination traverses ties once ${sortBy}/${sortOrder}`, () => {
      const store = new CalloutsStore(dataset());
      const qs = query(`limit=1&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      const result: string[] = [];
      do {
        const page = store.list("person", qs);
        assertSchema(page, schema, "page", spec);
        result.push(...page.callouts.map((row) => row.calloutId));
        qs.set("pageToken", page.nextPageToken);
        assert.ok(result.length <= 4);
      } while (qs.get("pageToken"));
      assert.deepEqual(
        result,
        ids(store, `sortBy=${sortBy}&sortOrder=${sortOrder}`),
      );
    });
test("local tokens bind the immutable input and normalized query, never an actor or live server cursor", () => {
  const data = dataset();
  const store = new CalloutsStore(data);
  const first = store.list("person", query("limit=1"));
  const token = first.nextPageToken;
  assert.equal(
    new CalloutsStore(data).list("person", query(`limit=1&pageToken=${token}`))
      .callouts[0].calloutId,
    "b",
  );
  assert.equal(
    store.list(
      "person",
      query(
        `limit=1&sortBy=TIMESTAMP&sortOrder=DESC&window=alltime&includeMembers=false&pageToken=${token}`,
      ),
    ).callouts[0].calloutId,
    "b",
  );
  for (const qs of [
    "limit=2",
    "limit=1&sortBy=MULTIPLE",
    "limit=1&sortOrder=ASC",
    "limit=1&includeMembers=true",
  ])
    error(
      store,
      `${qs}&pageToken=${token}`,
      400,
      "CALLOUT_LIST_PAGE_TOKEN_INVALID",
    );
  error(
    store,
    `limit=1&pageToken=${token}`,
    400,
    "CALLOUT_LIST_PAGE_TOKEN_INVALID",
    "squad",
  );
  data.observedAt = "2026-10-29T01:00:00.000Z";
  error(
    new CalloutsStore(data),
    `limit=1&pageToken=${token}`,
    400,
    "CALLOUT_LIST_PAGE_TOKEN_INVALID",
  );
  data.observedAt = "2026-10-29T00:00:00.000Z";
  data.callouts[0].facts!.multiple = 99;
  error(
    new CalloutsStore(data),
    `limit=1&pageToken=${token}`,
    400,
    "CALLOUT_LIST_PAGE_TOKEN_INVALID",
  );
});
for (const token of [
  "original-upstream-token",
  "!",
  "a".repeat(257),
  Buffer.from("{}").toString("base64url"),
  Buffer.from("[1]").toString("base64url"),
])
  test(`foreign/malformed token rejected: ${token.slice(0, 24)}`, () =>
    error(new CalloutsStore(dataset()), `pageToken=${token}`, 400));
test("invalid offsets, noncanonical encoding and version changes are rejected", () => {
  const store = new CalloutsStore(dataset());
  const token = store.list("person", query("limit=2")).nextPageToken;
  const [version, snapshot, scope] = JSON.parse(
    Buffer.from(token, "base64url").toString(),
  );
  assert.equal(version, 1);
  for (const offset of [-1, 0, 1, 4, 20, 1.5, Number.MAX_SAFE_INTEGER + 1])
    error(
      store,
      `limit=2&pageToken=${encodeCalloutPage(snapshot, scope, offset)}`,
      400,
    );
  for (const body of [
    [2, snapshot, scope, 2],
    [1, snapshot, scope, "2"],
    [1, snapshot, scope, 2, 0],
  ])
    error(
      store,
      `limit=2&pageToken=${Buffer.from(JSON.stringify(body)).toString("base64url")}`,
      400,
    );
  error(store, `limit=2&pageToken=${encodeURIComponent(token + "=")}`, 400);
});

test("supplied tail facts retain negative PnL, real zero, unknowns and nested objects without recomputation", () => {
  const data = dataset();
  data.callouts[0].tailFacts = {
    tailBuyers: 2,
    tailCohort1h: 2,
    tailPnl1hUsd: -7,
    tailAth1hUsd: 0,
    tailPnlHist1h: {
      callouts: 1,
      buckets: [{ min: null, max: 0, tailers: 2, pnlUsd: -7 }],
    },
  };
  const store = new CalloutsStore(data);
  const row = store
    .list("person")
    .callouts.find((row) => row.calloutId === "a")!;
  assertSchema(store.list("person"), schema, "with tail facts", spec);
  assert.equal(row.tailPnl1hUsd, -7);
  assert.equal(row.tailAth1hUsd, 0);
  assert.equal(row.tailCohort4h, null);
  assert.deepEqual(row.tailPnlHist1h, data.callouts[0].tailFacts.tailPnlHist1h);
  row.tailPnlHist1h!.buckets[0].tailers = 500;
  row.updates[0].content = "mutation";
  row.quotedCallout!.userName = "mutation";
  row.author!.userName = "mutation";
  data.callouts[0].tailFacts.tailBuyers = 99;
  const again = store
    .list("person")
    .callouts.find((row) => row.calloutId === "a")!;
  assert.equal(again.tailBuyers, 2);
  assert.equal(again.tailPnlHist1h!.buckets[0].tailers, 2);
  assert.equal(again.updates[0].content, "public update");
  assert.equal(again.quotedCallout!.userName, "Synthetic author");
  assert.equal(again.author!.userName, "Synthetic author");
});
for (const tailFacts of [
  null,
  { userName: "private" },
  { tailBuyers: -1 },
  { tailCohort1h: 1.5 },
  { tailAth1hUsd: -1 },
  { tailPnl1hUsd: Infinity },
  {
    tailPnlHist1h: {
      callouts: 1,
      buckets: [{ min: null, max: null, tailers: -1, pnlUsd: 0 }],
    },
  },
  JSON.parse(
    '{"tailPnlHist1h":{"callouts":1,"buckets":[],"toString":"private"}}',
  ),
])
  test(`invalid list-only materialization rejected: ${JSON.stringify(tailFacts)}`, () => {
    const data = dataset() as any;
    data.callouts[0].tailFacts = tailFacts;
    assert.throws(() => new CalloutsStore(data));
  });
test("optional unresolved author name is omitted, quoted target visibility does not erase its ID", () => {
  const data = dataset();
  data.authors[0].userName = null;
  data.callouts.find((row) => row.calloutId === "group")!.hidden = true;
  const result = new CalloutsStore(data).list("person");
  assertSchema(result, schema, "partial knowledge", spec);
  const a = result.callouts.find((row) => row.calloutId === "a")!;
  assert.equal(Object.hasOwn(a, "author"), false);
  assert.equal(a.quotedCalloutId, "group");
  assert.equal(a.quotedCallout, null);
});

test("list route preserves opt-in fixture behavior and developer-key shape gate", async () => {
  const fixture: Fixture = {
    method: "GET",
    path: "/v1/callout/list/person",
    status: 200,
    body: { fixture: true },
    source: "synthetic fixture",
  };
  const disabled = buildApp([fixture]);
  const enabled = buildApp([fixture], {
    calloutsStore: new CalloutsStore(dataset()),
  });
  try {
    assert.deepEqual(
      (await disabled.inject({ url: fixture.path, headers })).json(),
      fixture.body,
    );
    assert.equal(
      (await disabled.inject({ url: "/v1/callout/list/empty", headers }))
        .statusCode,
      501,
    );
    for (const auth of [{}, { authorization: "Bearer malformed" }])
      assert.equal(
        (await enabled.inject({ url: fixture.path, headers: auth })).statusCode,
        401,
      );
    const response = await enabled.inject({ url: fixture.path, headers });
    assert.equal(response.statusCode, 200);
    assertSchema(response.json(), schema, "HTTP", spec);
    assert.equal(response.headers["x-reconstruction-data-source"], "synthetic");
    assert.equal(
      response.headers["x-reconstruction-observed-at"],
      dataset().observedAt,
    );
    assert.equal(
      response.headers["x-reconstruction-compatibility"],
      "unqualified",
    );
    const head = await enabled.inject({
      method: "HEAD",
      url: fixture.path,
      headers,
    });
    assert.equal(head.statusCode, 200);
    assert.equal(head.body, "");
    for (const [qs, status, reason] of [
      ["window=alltime?ignored", 400, "CALLOUT_LIST_QUERY_INVALID"],
      ["limit=1?limit=3", 400, "CALLOUT_LIST_QUERY_INVALID"],
      ["limit=0", 400, "CALLOUT_LIST_QUERY_INVALID"],
      ["window=daily", 501, "CALLOUT_LIST_WINDOW_UNAVAILABLE"],
      ["limit=1&limit=2", 400, "CALLOUT_LIST_QUERY_INVALID"],
    ] as const) {
      const response = await enabled.inject({
        url: `${fixture.path}?${qs}`,
        headers,
      });
      assert.equal(response.statusCode, status);
      assert.equal(response.json().reason, reason);
    }
    assert.equal(
      (
        await enabled.inject({
          url: "/v1/callout/list/squad?includeMembers=true",
          headers,
        })
      ).statusCode,
      501,
    );
    assert.equal(
      (await enabled.inject({ url: "/v1/callout/list/unknown", headers }))
        .statusCode,
      501,
    );
    assert.equal(
      (await enabled.inject({ method: "POST", url: fixture.path, headers }))
        .statusCode,
      501,
    );
    assert.equal(
      (await enabled.inject({ url: "/v1/callout/a/quotes", headers }))
        .statusCode,
      501,
    );
    assert.equal(
      (await enabled.inject({ url: "/v1/callout/a", headers })).statusCode,
      200,
    );
  } finally {
    await disabled.close();
    await enabled.close();
  }
});
