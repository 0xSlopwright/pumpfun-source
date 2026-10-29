import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
import {
  normalizeSummaryJSON,
  normalizeEnhancedSummaryJSON,
  SummaryResponseError,
} from "../packages/frontend/src/original-contracts/portfolio-summary/normalize.mjs";
import {
  createPortfolioSummaryClient,
  portfolioSummaryKeys,
} from "../packages/frontend/src/original-contracts/portfolio-summary/client.mjs";
import { localSummaryClient } from "../packages/frontend/src/original-contracts/portfolio-summary/local-http.mjs";
import {
  APP_ROOT,
  OUTPUT,
  verify,
  recover,
} from "../scripts/original-portfolio-summary.mjs";
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((a, b) => {
    resolve = a;
    reject = b;
  });
  return { promise, resolve, reject };
};
function harness(response = {}) {
  const constructors = [],
    calls = [];
  const client = createPortfolioSummaryClient({
    createClient: (...args) => {
      constructors.push(args);
      return (op, options) => {
        calls.push({ op, options });
        return typeof response === "function"
          ? response(op, options)
          : response;
      };
    },
  });
  return { client, constructors, calls };
}

test("source closes selected schemas, base projection, number/catch helpers and route aliases without qualifying other variant", async () => {
  const c = await verify();
  assert.equal(c.schemas.otherVariantBehaviorQualified, false);
  assert.equal(c.schemas.aliases.length, 4);
  assert.equal(
    c.schemas.usedLibrarySpine.find((x) => x.name === "tQ").sha256,
    "911922e2e3881bbed49bf7cd7b84409ee0b23c60a588956bf20c0c63ede864b1",
  );
  assert.equal(c.schemas.utils.used.length, 3);
  assert.equal(c.operation.signalReadOrForwarded, false);
  assert.deepEqual(c.refresh.order, [
    "await read holdings+fresh",
    "construct wallet/period key",
    "await cancelQueries exact:true",
    "setQueryData",
  ]);
  assert.deepEqual(c.qualifications, {
    nativeBackend: false,
    productionTraffic: false,
    uiIntegrated: false,
    featureCredit: false,
  });
});
test("summary JSON projection keeps finite numbers and negative/zero values; malformed legs become null without coercion", () => {
  const value = {
    pnl: { sol: 2, usd: -3, extra: "drop" },
    realizedPnl: { sol: "2", usd: Infinity },
    unrealizedPnl: [],
    percentage: null,
    totalBuySpend: { sol: 0, usd: -0 },
    tokenCount: "4",
    totalValueUsd: 12,
    unknown: "drop",
  };
  const result = normalizeSummaryJSON(value);
  assert.deepEqual(Object.keys(result), [
    "pnl",
    "realizedPnl",
    "unrealizedPnl",
    "percentage",
    "totalBuySpend",
    "tokenCount",
    "totalValueUsd",
  ]);
  assert.deepEqual(result.pnl, { sol: 2, usd: -3 });
  assert.deepEqual(result.realizedPnl, { sol: null, usd: null });
  assert.deepEqual(result.unrealizedPnl, { sol: null, usd: null });
  assert.deepEqual(result.percentage, { sol: null, usd: null });
  assert.equal(result.tokenCount, null);
  assert.equal(result.totalValueUsd, 12);
  assert.ok(Object.is(result.totalBuySpend.usd, -0));
  assert.equal(value.unknown, "drop");
  assert.notStrictEqual(result.pnl, value.pnl);
  assert.equal(normalizeSummaryJSON({}).totalValueUsd, null);
  for (const input of [null, [], 1, "", false])
    assert.throws(() => normalizeSummaryJSON(input), SummaryResponseError);
});
test("holdings omit invalid rows, use exact source zero/null defaults and preserve optional mark omission", () => {
  const input = {
    holdings: [
      {
        chain: 12,
        mint: " ",
        amount: -1,
        priceUsd: 0,
        valueUsd: "bad",
        marketCapUsd: "bad",
        extra: "drop",
      },
      {
        mint: "good",
        amount: 1,
        priceUsd: 2,
        valueUsd: 3,
        marketCapUsd: -5,
        markUsd: Infinity,
      },
      { mint: "", amount: 1, priceUsd: 2 },
      { mint: "badAmount", amount: "1", priceUsd: 2 },
      { mint: "badPrice", amount: 1, priceUsd: Infinity },
      null,
    ],
  };
  const value = normalizeEnhancedSummaryJSON(input);
  assert.deepEqual(value.holdings, [
    {
      chain: "",
      mint: " ",
      amount: -1,
      priceUsd: 0,
      valueUsd: 0,
      marketCapUsd: null,
    },
    {
      chain: "",
      mint: "good",
      amount: 1,
      priceUsd: 2,
      valueUsd: 3,
      marketCapUsd: -5,
      markUsd: null,
    },
  ]);
  assert.equal(Object.hasOwn(value.holdings[0], "markUsd"), false);
  assert.equal(input.holdings[0].extra, "drop");
  assert.equal(normalizeEnhancedSummaryJSON({}).holdings, null);
  assert.deepEqual(normalizeEnhancedSummaryJSON({ holdings: [] }).holdings, []);
  for (const holdings of [null, {}, "rows", 5])
    assert.equal(normalizeEnhancedSummaryJSON({ holdings }).holdings, null);
});
test("reprice normalizes row-wise, cache fresh is strict true and enhanced missing fields remain explicit", () => {
  const value = normalizeEnhancedSummaryJSON({
    computedAt: 0,
    solPriceUsd: "2",
    nativeBalanceSol: -0,
    reprice: {
      asOf: Infinity,
      unrepriced: [
        { chain: null, mint: "a", reason: "", extra: "drop" },
        { mint: "", reason: "x" },
        { mint: "b", reason: 3 },
      ],
    },
    cache: { fresh: true, extra: "drop" },
    extra: "drop",
  });
  assert.deepEqual(value.reprice, {
    asOf: null,
    unrepriced: [{ chain: "", mint: "a", reason: "" }],
  });
  assert.equal(value.computedAt, 0);
  assert.equal(value.solPriceUsd, null);
  assert.ok(Object.is(value.nativeBalanceSol, -0));
  assert.equal(value.cacheFresh, true);
  assert.equal(Object.hasOwn(value, "cache"), false);
  assert.equal(Object.hasOwn(value, "extra"), false);
  for (const cache of [null, [], {}, { fresh: 1 }, { fresh: "true" }])
    assert.equal(normalizeEnhancedSummaryJSON({ cache }).cacheFresh, false);
  assert.deepEqual(normalizeEnhancedSummaryJSON({ reprice: {} }).reprice, {
    asOf: null,
    unrepriced: [],
  });
  for (const reprice of [undefined, null, [], 2, "x"])
    assert.equal(normalizeEnhancedSummaryJSON({ reprice }).reprice, null);
});
test("plain GET constructs with zero arguments and returns only base projection without inferred signal/defaults", async () => {
  const h = harness({ pnl: { usd: 1 }, holdings: [], cache: { fresh: true } }),
    signal = new AbortController().signal;
  const result = await h.client.read({
    user: " owner ",
    period: "unvalidated",
    signal,
  });
  assert.deepEqual(h.constructors, [[]]);
  assert.deepEqual(h.calls, [
    {
      op: "GET /portfolio-summary",
      options: { query: { user: " owner ", period: "unvalidated" } },
    },
  ]);
  assert.equal(Object.hasOwn(result, "holdings"), false);
  assert.equal(result.pnl.usd, 1);
  assert.equal(Object.hasOwn(h.calls[0].options, "signal"), false);
});
test("holdings/fresh branches preserve constructor argument arity, include credentials and numeric truthy flags", async () => {
  for (const [flags, query, constructor] of [
    [{ holdings: true }, { holdings: 1 }, [undefined]],
    [{ fresh: true }, { fresh: 1 }, [{ credentials: "include" }]],
    [
      { holdings: true, fresh: true },
      { holdings: 1, fresh: 1 },
      [{ credentials: "include" }],
    ],
    [
      { holdings: {}, fresh: "yes" },
      { holdings: 1, fresh: 1 },
      [{ credentials: "include" }],
    ],
  ]) {
    const h = harness({ holdings: [], cache: { fresh: true } }),
      result = await h.client.read({ user: "a", period: "1w", ...flags });
    assert.deepEqual(h.constructors, [constructor]);
    assert.deepEqual(h.calls[0].options.query, {
      user: "a",
      period: "1w",
      ...query,
    });
    assert.deepEqual(result.holdings, []);
    assert.equal(result.cacheFresh, true);
  }
});
test("keys and missing arguments remain raw; read does not supply a period or user default", async () => {
  const h = harness();
  await h.client.read({});
  assert.deepEqual(h.calls[0].options.query, {
    user: undefined,
    period: undefined,
  });
  const user = {};
  assert.deepEqual(portfolioSummaryKeys.wallet(user, null), [
    "portfolioSummary",
    user,
    null,
  ]);
  assert.deepEqual(portfolioSummaryKeys.walletPrefix(undefined), [
    "portfolioSummary",
    undefined,
  ]);
  assert.notStrictEqual(
    portfolioSummaryKeys.walletPrefix("a"),
    portfolioSummaryKeys.walletPrefix("a"),
  );
});
test(
  "refresh awaits read then cancellation, writes exact key, and does not await or return setter result",
  { timeout: 5000 },
  async () => {
    const read = deferred(),
      cancel = deferred(),
      events = [];
    const h = harness(() => {
      events.push("request");
      return read.promise;
    });
    let stored;
    const pending = h.client.refresh(
      {
        cancelQueries: (options) => {
          events.push("cancel");
          assert.deepEqual(options, {
            queryKey: ["portfolioSummary", "a", "1w"],
            exact: true,
          });
          return cancel.promise;
        },
        setQueryData: (key, value) => {
          events.push("set");
          stored = { key, value };
          return new Promise(() => {});
        },
      },
      "a",
      "1w",
    );
    assert.deepEqual(events, ["request"]);
    assert.deepEqual(h.calls[0].options.query, {
      user: "a",
      period: "1w",
      holdings: 1,
      fresh: 1,
    });
    read.resolve({ pnl: { usd: 2 }, cache: { fresh: true } });
    await new Promise(setImmediate);
    assert.deepEqual(events, ["request", "cancel"]);
    cancel.resolve();
    assert.equal(await pending, undefined);
    assert.deepEqual(events, ["request", "cancel", "set"]);
    assert.deepEqual(stored.key, ["portfolioSummary", "a", "1w"]);
    assert.equal(stored.value.pnl.usd, 2);
    assert.equal(stored.value.cacheFresh, true);
  },
);
test("read/cancel/set failures propagate and stop each later cache operation", async () => {
  const sentinel = Error("failure"),
    events = [],
    bad = harness(() => {
      throw sentinel;
    });
  const cache = {
    cancelQueries: () => events.push("cancel"),
    setQueryData: () => events.push("set"),
  };
  await assert.rejects(
    bad.client.refresh(cache, "a", "1d"),
    (e) => e === sentinel,
  );
  assert.deepEqual(events, []);
  await assert.rejects(
    harness({}).client.refresh(
      {
        cancelQueries: () => {
          throw sentinel;
        },
        setQueryData: () => assert.fail(),
      },
      "a",
      "1d",
    ),
    (e) => e === sentinel,
  );
  await assert.rejects(
    harness({}).client.refresh(
      {
        cancelQueries: () => Promise.resolve(),
        setQueryData: () => {
          throw sentinel;
        },
      },
      "a",
      "1d",
    ),
    (e) => e === sentinel,
  );
});
test("real HTTP plain/enhanced/fresh reads, source numeric fallback, cache update and negative responses", async (t) => {
  const wire = [],
    server = createServer((req, res) => {
      const u = new URL(req.url, "http://localhost"),
        mode = u.pathname.split("/")[1];
      res.setHeader("content-type", "application/json");
      if (mode === "denied") {
        res.statusCode = 403;
        return res.end('{"error":"forbidden"}');
      }
      if (mode === "bad") return res.end("{");
      if (mode === "null") return res.end("null");
      if (mode === "enhanced")
        return res.end(
          '{"pnl":{"usd":3},"tokenCount":1e400,"holdings":[{"mint":"x","amount":1,"priceUsd":2,"valueUsd":1e400,"marketCapUsd":null}],"cache":{"fresh":true}}',
        );
      return res.end(
        '{"pnl":{"sol":1,"usd":2},"totalValueUsd":7,"cache":{"fresh":true},"ignored":"drop"}',
      );
    });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  const make = (mode) =>
    createPortfolioSummaryClient({
      createClient: localSummaryClient({
        baseUrl: `http://127.0.0.1:${server.address().port}/${mode}/`,
        fetchImplementation: async (url, init) => {
          const response = await fetch(url, init);
          wire.push({
            request: {
              method: init.method,
              pathAndQuery: url.pathname + url.search,
              credentials: init.credentials,
              headers: init.headers,
            },
            response: {
              status: response.status,
              body: await response.clone().text(),
            },
          });
          return response;
        },
      }),
    });
  assert.equal(
    (await make("normal").read({ user: " a/雪 ", period: "1w" })).totalValueUsd,
    7,
  );
  const enhanced = await make("enhanced").read({
    user: "a",
    period: "1d",
    holdings: true,
  });
  assert.equal(enhanced.tokenCount, null);
  assert.equal(enhanced.holdings[0].valueUsd, 0);
  assert.equal(enhanced.cacheFresh, true);
  const events = [];
  await make("normal").refresh(
    {
      cancelQueries: async () => events.push("cancel"),
      setQueryData: (key, value) => {
        events.push("set");
        assert.equal(value.totalValueUsd, 7);
      },
    },
    "a",
    "1w",
  );
  assert.deepEqual(events, ["cancel", "set"]);
  await assert.rejects(
    make("denied").read({ user: "a" }),
    /Local summary HTTP 403/,
  );
  await assert.rejects(make("bad").read({ user: "a" }), SyntaxError);
  await assert.rejects(make("null").read({ user: "a" }), SummaryResponseError);
  assert.equal(wire.length, 6);
  const first = new URL(wire[0].request.pathAndQuery, "http://localhost");
  assert.equal(first.searchParams.get("user"), " a/雪 ");
  assert.equal(first.searchParams.get("period"), "1w");
  assert.equal(wire[0].request.credentials, "same-origin");
  assert.equal(wire[2].request.credentials, "include");
  const fresh = new URL(wire[2].request.pathAndQuery, "http://localhost");
  assert.equal(fresh.searchParams.get("holdings"), "1");
  assert.equal(fresh.searchParams.get("fresh"), "1");
  assert.equal(wire[0].request.headers.authorization, undefined);
  if (process.env.PUMP_SUMMARY_WIRE_OUTPUT)
    await writeFile(
      process.env.PUMP_SUMMARY_WIRE_OUTPUT,
      JSON.stringify(
        {
          provenance:
            "synthetic isolated loopback HTTP; no original server/auth/price parity",
          normalization:
            "ephemeral origin omitted; exact method/path/query/selected headers/status/body retained",
          completedHTTPResponses: wire.length,
          wire,
        },
        null,
        2,
      ) + "\n",
    );
});
test("local adapter requires a destination and rejects unsupported operations/array query domain before transport", async () => {
  for (const baseUrl of [
    "",
    undefined,
    "file:///tmp/no",
    "https://example.invalid/?",
    "https://example.invalid/#",
    "https://name:password@example.invalid",
  ])
    assert.throws(
      () =>
        localSummaryClient({
          baseUrl,
          fetchImplementation: () => assert.fail(),
        }),
      TypeError,
    );
  const api = localSummaryClient({
    baseUrl: "http://localhost",
    fetchImplementation: () => assert.fail(),
  })();
  await assert.rejects(
    api("POST /portfolio-summary", { query: {} }),
    /Unsupported summary/,
  );
  await assert.rejects(
    api("GET /portfolio-summary", { query: { user: ["a"] } }),
    /must be scalar/,
  );
});
test("stale qualification, corrupt source and resealed finite-guard changes fail closed", async (t) => {
  const c = await verify(),
    root = await mkdtemp(path.join(os.tmpdir(), "pump-summary-source-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const file of new Set([
    OUTPUT,
    "recovered/modules.json",
    "evidence/web/manifest.json",
    ...c.factories.map((f) => f.source),
  ])) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await cp(path.join(APP_ROOT, file), path.join(root, file));
  }
  const metadata = JSON.parse(await readFile(path.join(root, OUTPUT)));
  metadata.qualifications.nativeBackend = true;
  await writeFile(path.join(root, OUTPUT), JSON.stringify(metadata));
  await assert.rejects(verify(root), /contract is stale/);
  const f = c.schemas.library,
    guard = c.schemas.usedLibrarySpine.find((x) => x.name === "tQ"),
    file = path.join(root, f.source),
    before = await readFile(file, "utf8"),
    after =
      before.slice(0, guard.utf16[0]) +
      before
        .slice(...guard.utf16)
        .replace("Number.isFinite(n)", "Number.isFinite(0)") +
      before.slice(guard.utf16[1]);
  assert.notEqual(after, before);
  await writeFile(file, after);
  await assert.rejects(recover(root), /authentication failed/);
  const hash = (x) => createHash("sha256").update(x).digest("hex"),
    mf = path.join(root, "evidence/web/manifest.json"),
    m = JSON.parse(await readFile(mf));
  m.records.find((x) => x.path === f.source).sha256 = hash(after);
  await writeFile(mf, JSON.stringify(m));
  const inf = path.join(root, "recovered/modules.json"),
    index = JSON.parse(await readFile(inf));
  index.modules.find((x) => x.ids.includes(599565)).sha256 = hash(
    after.slice(...f.utf16),
  );
  await writeFile(inf, JSON.stringify(index));
  await assert.rejects(
    recover(root),
    /review required for changed factory 599565/,
  );
});
