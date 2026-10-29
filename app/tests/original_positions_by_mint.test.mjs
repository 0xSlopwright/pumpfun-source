import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
import {
  MAX_POSITION_QUOTE,
  isPositionQuoteOutlier,
  normalizePositionRows,
  createMintPositionReader,
  mintPositionMap,
  lookupMintPosition,
  positionLookupKey,
} from "../packages/frontend/src/original-contracts/positions-by-mint/reader.mjs";
import { localMintPositionClient } from "../packages/frontend/src/original-contracts/positions-by-mint/local-http.mjs";
import {
  APP_ROOT,
  OUTPUT,
  verify,
  recover,
} from "../scripts/original-positions-by-mint.mjs";
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((a, b) => {
    resolve = a;
    reject = b;
  });
  return { promise, resolve, reject };
};

test("source binds complete reader, actual consumed normalizer, threshold and chain namespaces", async () => {
  const c = await verify();
  assert.equal(c.normalization.threshold, MAX_POSITION_QUOTE);
  assert.equal(MAX_POSITION_QUOTE, 1e13);
  assert.equal(c.operation.timeoutMs, 8000);
  assert.equal(c.operation.constructorCalledPerChunk, true);
  assert.equal(c.actualConsumer.availableFactoryVariants.length, 2);
  assert.deepEqual(c.qualifications, {
    nativeBackend: false,
    productionTraffic: false,
    uiIntegrated: false,
    featureCredit: false,
  });
});

test("quote guard is strict numeric finite/magnitude admission, not coercion or price math", () => {
  for (const value of [NaN, Infinity, -Infinity, 1e13 + 1, -1e13 - 1])
    assert.equal(isPositionQuoteOutlier(value), true);
  for (const value of [
    undefined,
    null,
    0,
    -1e13,
    1e13,
    "100000000000001",
    true,
    {},
  ])
    assert.equal(isPositionQuoteOutlier(value), false);
  const rows = [
    {
      coinMint: "a",
      valueUsd: 1e13,
      pnlUsd: -1e13,
      coin: { marketCapUsd: 1e13 },
    },
    { valueUsd: "1e99", pnlUsd: null },
  ];
  const result = normalizePositionRows(rows);
  assert.notStrictEqual(result, rows);
  assert.strictEqual(result[0], rows[0]);
  assert.strictEqual(result[1], rows[1]);
});

test("rejected value/PnL clear precisely the served fields without mutating source or inventing zero", () => {
  for (const field of ["valueUsd", "pnlUsd"])
    for (const bad of [NaN, Infinity, -Infinity, 1e14, -1e14]) {
      const row = {
        coinMint: "a",
        valueUsd: 10,
        pnlUsd: 3,
        tokenPriceUsd: 2,
        pnlPercentage: 30,
        costBasisUsd: 7,
        coin: { marketCapUsd: 100, name: "keep" },
        [field]: bad,
      };
      const [next] = normalizePositionRows([row]);
      assert.notStrictEqual(next, row);
      assert.equal(next.valueUsd, undefined);
      assert.ok(Object.hasOwn(next, "valueUsd"));
      assert.equal(next.tokenPriceUsd, undefined);
      assert.equal(next.pnlUsd, null);
      assert.equal(next.pnlPercentage, null);
      assert.equal(next.servedQuoteRejected, true);
      assert.deepEqual(next.coin, { marketCapUsd: null, name: "keep" });
      assert.equal(next.costBasisUsd, 7);
      assert.equal(row.coin.marketCapUsd, 100);
      assert.equal(row[field], bad);
    }
  const [next] = normalizePositionRows([{ valueUsd: Infinity, coin: null }]);
  assert.equal(next.coin, null);
});

test("coin-only rejection retains row quote/PnL and flags while cloning only the needed boundary", () => {
  const coin = { marketCapUsd: Infinity, name: "unchanged" },
    row = { coin, valueUsd: 0, pnlUsd: 0, tokenPriceUsd: 1, other: { id: 1 } };
  const [next] = normalizePositionRows([row]);
  assert.notStrictEqual(next, row);
  assert.notStrictEqual(next.coin, coin);
  assert.equal(next.coin.marketCapUsd, null);
  assert.equal(next.valueUsd, 0);
  assert.equal(next.pnlUsd, 0);
  assert.equal(next.tokenPriceUsd, 1);
  assert.strictEqual(next.other, row.other);
  assert.equal(Object.hasOwn(next, "servedQuoteRejected"), false);
  assert.equal(coin.marketCapUsd, Infinity);
});

test("batching filters truthy inputs, exact-deduplicates, starts200-row chunks together and flattens input order", async () => {
  const calls = [],
    pending = [],
    reader = createMintPositionReader({
      createClient: () => (operation, options) => {
        const job = deferred();
        calls.push({ operation, options });
        pending.push(job);
        return job.promise;
      },
    });
  const mints = Array.from({ length: 401 }, (_, i) => `mint${i}`),
    promise = reader.readMany({
      userId: "owner",
      mints: [null, "", false, ...mints, "mint0", "MINT0"],
    });
  assert.equal(calls.length, 3);
  assert.deepEqual(
    calls.map((x) => x.options.query.mints.length),
    [200, 200, 2],
  );
  assert.equal(calls[2].options.query.mints[1], "MINT0");
  assert.equal(calls[0].options.timeout, 8000);
  assert.equal(calls[0].options.query.updatesLimit, 0);
  assert.equal(calls[0].operation, "GET /user-positions/{userId}");
  assert.deepEqual(calls[0].options.params, { userId: "owner" });
  pending[2].resolve({ positions: [{ coinMint: "last" }] });
  pending[0].resolve({ positions: [{ coinMint: "first" }] });
  pending[1].resolve({ positions: [{ coinMint: "middle" }] });
  assert.deepEqual(
    (await promise).map((x) => x.coinMint),
    ["first", "middle", "last"],
  );
  assert.equal(mints.length, 401);
});

test("empty requests do not construct a client and nullish positions fall back, without guessed type recovery", async () => {
  const none = createMintPositionReader({ createClient: () => assert.fail() });
  assert.deepEqual(
    await none.readMany({ userId: "u", mints: [null, "", false, 0] }),
    [],
  );
  for (const response of [{}, { positions: null }]) {
    const reader = createMintPositionReader({
      createClient: () => () => Promise.resolve(response),
    });
    assert.deepEqual(await reader.readMany({ userId: "u", mints: ["a"] }), []);
  }
  const bad = createMintPositionReader({
    createClient: () => () => Promise.resolve({ positions: {} }),
  });
  await assert.rejects(bad.readMany({ userId: "u", mints: ["a"] }), TypeError);
});

test("404 hook replaces response, non-ok hook throws original status message, success returns undefined", async () => {
  let hook;
  const reader = createMintPositionReader({
    createClient: () => (_op, options) => {
      hook = options.hooks.afterResponse[0];
      return { positions: [] };
    },
  });
  await reader.readMany({ userId: "u", mints: ["a"] });
  const original = new Response('{"ignored":true}', { status: 404 });
  const replacement = await hook(null, null, original);
  assert.equal(original.bodyUsed, false);
  assert.equal(replacement.status, 200);
  assert.deepEqual(await replacement.json(), { positions: [] });
  assert.throws(
    () =>
      hook(
        null,
        null,
        new Response("", { status: 403, statusText: "Forbidden" }),
      ),
    { message: "user-positions request failed: 403 Forbidden" },
  );
  assert.equal(hook(null, null, new Response("{}")), undefined);
});

test("failed chunk rejects unchanged without canceling sibling work or swallowing the failure", async () => {
  const jobs = [],
    sentinel = Error("chunk failure");
  const reader = createMintPositionReader({
    createClient: () => () => {
      const p = deferred();
      jobs.push(p);
      return p.promise;
    },
  });
  const pending = reader.readMany({
    userId: "u",
    mints: Array.from({ length: 201 }, (_, i) => String(i)),
  });
  assert.equal(jobs.length, 2);
  jobs[0].reject(sentinel);
  await assert.rejects(pending, (e) => e === sentinel);
  jobs[1].resolve({ positions: [] });
});

test("single lookup is first match; map is last match; namespaced key preserves raw mint case", async () => {
  const first = { coinMint: "AbC", id: 1 },
    last = { coinMint: "abc", id: 2 },
    reader = createMintPositionReader({
      createClient: () => () => ({ positions: [first, last, { id: 3 }] }),
    });
  assert.strictEqual(await reader.readOne({ userId: "u", mint: "ABC" }), first);
  assert.equal(await reader.readOne({ userId: "u", mint: "absent" }), null);
  const map = mintPositionMap([first, last, { coinMint: "", id: 3 }]);
  assert.equal(map.size, 1);
  assert.strictEqual(lookupMintPosition(map, "ABC"), last);
  assert.equal(lookupMintPosition(map, ""), undefined);
  for (const chain of ["ton:-239", "starknet:SN_MAIN", "near:mainnet"])
    assert.equal(positionLookupKey("AbC", chain), `${chain}:AbC`);
  for (const chain of [null, undefined, 1, "eip155:1", "solana"])
    assert.equal(positionLookupKey("AbC", chain), "AbC");
});

test("real HTTP batches, quote rejection,404 replacement, missing fields,403 failure and malformed JSON", async (t) => {
  const wire = [],
    requests = [];
  const server = createServer((req, res) => {
    const url = new URL(req.url, "http://localhost"),
      owner = decodeURIComponent(url.pathname.split("/").at(-1));
    requests.push(req.url);
    res.setHeader("content-type", "application/json");
    if (owner === "missing") {
      res.statusCode = 404;
      return res.end('{"code":"not-found"}');
    }
    if (owner === "denied") {
      res.statusCode = 403;
      return res.end('{"code":"forbidden"}');
    }
    if (owner === "empty") return res.end("{}");
    if (owner === "malformed") return res.end("{");
    const mints = url.searchParams.get("mints").split(",");
    return res.end(
      JSON.stringify({
        positions: mints.map((coinMint, i) => ({
          coinMint,
          valueUsd: i ? 1 : 1e14,
          pnlUsd: 0,
          coin: { marketCapUsd: 100 },
        })),
      }),
    );
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  const client = localMintPositionClient({
      baseUrl: `http://127.0.0.1:${server.address().port}/api/`,
      fetchImplementation: async (url, init) => {
        const response = await fetch(url, init);
        wire.push({
          request: {
            method: init.method,
            pathAndQuery: url.pathname + url.search,
            headers: init.headers,
          },
          response: {
            status: response.status,
            contentType: response.headers.get("content-type"),
            body: await response.clone().text(),
          },
        });
        return response;
      },
    }),
    reader = createMintPositionReader({ createClient: client });
  const mints = Array.from({ length: 201 }, (_, i) => `mint${i}`),
    rows = await reader.readMany({
      userId: "a/ +雪",
      mints: [...mints, "mint0"],
    });
  assert.equal(rows.length, 201);
  assert.equal(rows[0].servedQuoteRejected, true);
  assert.equal(rows[0].valueUsd, undefined);
  assert.equal(rows[199].valueUsd, 1);
  const query = new URL(requests[0], "http://localhost");
  assert.equal(query.searchParams.get("mints").split(",").length, 200);
  assert.equal(query.searchParams.get("updatesLimit"), "0");
  assert.ok(query.pathname.includes("a%2F%20%2B%E9%9B%AA"));
  assert.deepEqual(
    await reader.readMany({ userId: "missing", mints: ["a"] }),
    [],
  );
  assert.deepEqual(
    await reader.readMany({ userId: "empty", mints: ["a"] }),
    [],
  );
  await assert.rejects(
    reader.readMany({ userId: "denied", mints: ["a"] }),
    /user-positions request failed: 403 Forbidden/,
  );
  await assert.rejects(
    reader.readMany({ userId: "malformed", mints: ["a"] }),
    SyntaxError,
  );
  assert.equal(wire.length, 6);
  assert.equal(wire[0].request.headers.accept, "application/json");
  if (process.env.PUMP_POSITIONS_WIRE_OUTPUT)
    await writeFile(
      process.env.PUMP_POSITIONS_WIRE_OUTPUT,
      JSON.stringify(
        {
          provenance:
            "synthetic real loopback HTTP; no production response parity",
          normalization:
            "ephemeral loopback origin omitted; exact method/path/query/selected headers/status/body retained",
          completedHTTPResponses: wire.length,
          wire,
        },
        null,
        2,
      ) + "\n",
    );
});

test("explicit local destination and comma-array rejection fail before networking", async () => {
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
        localMintPositionClient({
          baseUrl,
          fetchImplementation: () => assert.fail(),
        }),
      TypeError,
    );
  const reader = createMintPositionReader({
    createClient: localMintPositionClient({
      baseUrl: "http://localhost",
      fetchImplementation: () => assert.fail(),
    }),
  });
  await assert.rejects(
    reader.readMany({ userId: "u", mints: ["comma,mint"] }),
    /Comma inside mint/,
  );
});

test("metadata qualification, corrupt source and resealed threshold change fail closed", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "pump-mint-source-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const c = await verify();
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
  const threshold = c.factories.find((f) => f.id === 26077),
    file = path.join(root, threshold.source),
    before = await readFile(file, "utf8"),
    after =
      before.slice(0, threshold.utf16[0]) +
      before.slice(...threshold.utf16).replace('"N",0,1e13', '"N",0,1e12') +
      before.slice(threshold.utf16[1]);
  assert.notEqual(before, after);
  await writeFile(file, after);
  await assert.rejects(recover(root), /authentication failed/);
  const hash = (value) => createHash("sha256").update(value).digest("hex"),
    mf = path.join(root, "evidence/web/manifest.json"),
    m = JSON.parse(await readFile(mf));
  m.records.find((r) => r.path === threshold.source).sha256 = hash(after);
  await writeFile(mf, JSON.stringify(m));
  const inf = path.join(root, "recovered/modules.json"),
    index = JSON.parse(await readFile(inf));
  index.modules.find((r) => r.ids.includes(26077)).sha256 = hash(
    after.slice(...threshold.utf16),
  );
  await writeFile(inf, JSON.stringify(index));
  await assert.rejects(
    recover(root),
    /review required for changed factory 26077/,
  );
});
