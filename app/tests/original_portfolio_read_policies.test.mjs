import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { mkdir, mkdtemp, cp, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
import {
  createPortfolioReadPolicies,
  dustFloorKey,
  spamMintsKey,
  hasSpamMint,
  addSpamMint,
  removeSpamMint,
} from "../packages/frontend/src/original-contracts/portfolio-read-policies/client.mjs";
import { localPortfolioPolicyClient } from "../packages/frontend/src/original-contracts/portfolio-read-policies/local-http.mjs";
import {
  verify,
  recover,
  APP_ROOT,
  OUTPUT,
} from "../scripts/original-portfolio-read-policies.mjs";
function harness(implementation = () => ({ dustFloorUsd: 12, positions: [] })) {
  const caches = new Map(),
    calls = [],
    queries = [];
  const client = createPortfolioReadPolicies({
    createClient: () => (op, options) => {
      calls.push({ op, options });
      return implementation(op, options);
    },
    memo: (size) => {
      if (!caches.has(size))
        caches.set(
          size,
          Array(size).fill(Symbol.for("react.memo_cache_sentinel")),
        );
      return caches.get(size);
    },
    useQuery: (options) => {
      queries.push(options);
      return options;
    },
  });
  return { client, calls, queries };
}
test("static source binds actual consumers and identical used normalizer across two unresolved factory variants", async () => {
  const c = await verify();
  assert.equal(c.dust.addressSent, false);
  assert.equal(c.dust.finiteCheck, false);
  assert.equal(c.dust.postSetterImplemented, false);
  assert.equal(c.normalizers.length, 2);
  assert.equal(
    c.normalizers[0].function.sha256,
    c.normalizers[1].function.sha256,
  );
  assert.notEqual(
    c.normalizers[0].factory.sha256,
    c.normalizers[1].factory.sha256,
  );
  assert.equal(c.consumers[1].dust.length, 1);
  assert.equal(c.consumers[1].spam.length, 1);
  assert.deepEqual(c.qualifications, {
    nativeBackend: false,
    productionTraffic: false,
    uiIntegrated: false,
    featureCredit: false,
  });
});
test("keys retain address; mint helpers lowercase only lowercase0x prefix and preserve no-change array identity", () => {
  assert.deepEqual(dustFloorKey(undefined), [
    "userPortfolioDustFloor",
    undefined,
  ]);
  assert.deepEqual(spamMintsKey(" x "), ["userPortfolioSpamMints", " x "]);
  const initial = ["0xab", "SolCase"];
  assert.equal(hasSpamMint(initial, "0xAB"), true);
  assert.equal(hasSpamMint(initial, "solcase"), false);
  assert.equal(hasSpamMint(undefined, undefined), false);
  assert.strictEqual(addSpamMint(initial, "0xAB"), initial);
  const next = addSpamMint(initial, "0XAB");
  assert.deepEqual(next, ["0xab", "SolCase", "0XAB"]);
  assert.strictEqual(removeSpamMint(initial, "missing"), initial);
  assert.deepEqual(removeSpamMint(initial, "0xAB"), ["SolCase"]);
  assert.equal(removeSpamMint(undefined, "0xab"), undefined);
  assert.deepEqual(initial, ["0xab", "SolCase"]);
  assert.deepEqual(addSpamMint(null, "sol"), ["sol"]);
});
test("dust getter forwards signal and include credentials, without address/query/body or a finite/dialog limit", async () => {
  for (const [value, result] of [
    [2, 2],
    [1e10, 1e10],
    [Infinity, Infinity],
    [0, null],
    [-1, null],
    [NaN, null],
    ["2", null],
    [null, null],
    [undefined, null],
  ]) {
    const h = harness(() => ({ dustFloorUsd: value })),
      signal = new AbortController().signal;
    assert.equal(
      await h.client.readDustFloor({ signal, address: "never-sent" }),
      result,
    );
    const call = h.calls[0];
    assert.equal(call.op, "GET /user-portfolio/dust-floor");
    assert.equal(call.options.credentials, "include");
    assert.equal(call.options.throwHttpErrors, false);
    assert.strictEqual(call.options.signal, signal);
    for (const key of ["params", "query", "body"])
      assert.equal(Object.hasOwn(call.options, key), false);
  }
});
test("dust query retains five-slot memoization, raw enabled semantics and stable callback across address changes", () => {
  const h = harness(),
    first = h.client.useDustFloor({ address: "a", enabled: undefined });
  assert.equal(first.enabled, undefined);
  assert.equal(first.staleTime, 60000);
  assert.strictEqual(
    h.client.useDustFloor({ address: "a", enabled: undefined }),
    first,
  );
  const disabled = h.client.useDustFloor({ address: "a", enabled: false });
  assert.notStrictEqual(disabled, first);
  assert.strictEqual(disabled.queryKey, first.queryKey);
  const second = h.client.useDustFloor({ address: "b", enabled: false });
  assert.notStrictEqual(second.queryKey, first.queryKey);
  assert.strictEqual(second.queryFn, first.queryFn);
  assert.equal(
    h.client.useDustFloor({ address: "", enabled: true }).enabled,
    false,
  );
  assert.equal(h.calls.length, 0, "query runtime alone decides when to fetch");
});
test("spam query retains eight-slot callback/key identity and exact fixed request parameters", async () => {
  const h = harness(() => ({
    positions: [
      { coinMint: "0xAb" },
      { coinMint: "0xab" },
      { coinMint: "zSol" },
      { coinMint: "ASol" },
      { coinMint: "0XAb" },
    ],
  }));
  const first = h.client.useSpamMints({ address: "a", enabled: true });
  assert.strictEqual(
    h.client.useSpamMints({ address: "a", enabled: true }),
    first,
  );
  assert.equal(first.staleTime, 30000);
  const signal = new AbortController().signal,
    rows = await first.queryFn({ signal });
  assert.deepEqual(rows, ["0XAb", "0xab", "ASol", "zSol"]);
  const call = h.calls[0];
  assert.deepEqual(call.options.params, { userId: "a" });
  assert.deepEqual(call.options.query, {
    filter: "open",
    spamOnly: true,
    sortBy: "POSITION_SIZE",
    page: 0,
    pageSize: 200,
  });
  assert.strictEqual(call.options.signal, signal);
  assert.equal(call.options.credentials, "include");
  assert.equal(call.options.throwHttpErrors, false);
  const disabled = h.client.useSpamMints({ address: "a", enabled: false });
  assert.strictEqual(disabled.queryFn, first.queryFn);
  assert.strictEqual(disabled.queryKey, first.queryKey);
  assert.strictEqual(disabled.select, first.select);
  const second = h.client.useSpamMints({ address: "b", enabled: false });
  assert.notStrictEqual(second.queryFn, first.queryFn);
  assert.notStrictEqual(second.queryKey, first.queryKey);
  const set = first.select(rows);
  assert.deepEqual([...set], rows);
  assert.notStrictEqual(first.select(rows), set);
});
test("manual spam query at absent address uses empty userId and does not replace absent enabled with true", async () => {
  const h = harness();
  const q = h.client.useSpamMints({ address: undefined, enabled: undefined });
  assert.equal(q.enabled, false);
  await q.queryFn({});
  assert.deepEqual(h.calls[0].options.params, { userId: "" });
  const other = h.client.useSpamMints({ address: "a", enabled: undefined });
  assert.equal(other.enabled, undefined);
});
test("retained old query callback keeps its original address after a later hook call", async () => {
  const h = harness(),
    old = h.client.useSpamMints({ address: "old", enabled: true }),
    next = h.client.useSpamMints({ address: "next", enabled: true });
  await next.queryFn({});
  await old.queryFn({});
  assert.deepEqual(
    h.calls.map((c) => c.options.params.userId),
    ["next", "old"],
  );
  assert.deepEqual(old.queryKey, ["userPortfolioSpamMints", "old"]);
  assert.deepEqual(next.queryKey, ["userPortfolioSpamMints", "next"]);
});
test("non-ok hooks retain their messages and do not turn rejection into empty/null success", async () => {
  const h = harness();
  await h.client.readDustFloor({});
  const dust = h.calls[0].options.hooks.afterResponse[0];
  assert.throws(() => dust(null, null, new Response("", { status: 401 })), {
    message: "Failed to fetch dust floor: 401",
  });
  assert.equal(dust(null, null, new Response("{}")), undefined);
  await h.client.useSpamMints({ address: "a", enabled: true }).queryFn({});
  const spam = h.calls[1].options.hooks.afterResponse[0];
  assert.throws(() => spam(null, null, new Response("", { status: 500 })), {
    message: "Failed to fetch spam positions: 500",
  });
  assert.equal(spam(null, null, new Response("{}")), undefined);
});
test("malformed response and transport failures propagate rather than being silently repaired", async () => {
  const sentinel = Error("transport"),
    h = harness(() => {
      throw sentinel;
    });
  await assert.rejects(h.client.readDustFloor({}), (e) => e === sentinel);
  await assert.rejects(
    h.client.useSpamMints({ address: "a", enabled: true }).queryFn({}),
    (e) => e === sentinel,
  );
  for (const response of [
    {},
    { positions: null },
    { positions: [{ coinMint: 123 }] },
  ]) {
    const b = harness(() => response);
    await assert.rejects(
      b.client.useSpamMints({ address: "a", enabled: true }).queryFn({}),
      TypeError,
    );
  }
  await assert.rejects(harness(() => null).client.readDustFloor({}), TypeError);
});
test("real loopback policy HTTP preserves no-address dust GET, numeric infinity quirk, spam query and rejection", async (t) => {
  const wire = [],
    server = createServer((req, res) => {
      const u = new URL(req.url, "http://localhost"),
        mode = u.pathname.split("/")[1];
      res.setHeader("content-type", "application/json");
      if (mode === "wait") return;
      if (mode === "denied") {
        res.statusCode = 401;
        return res.end('{"error":"auth-required"}');
      }
      if (mode === "spamDenied") {
        res.statusCode = 403;
        return res.end('{"error":"forbidden"}');
      }
      if (mode === "bad") return res.end("{");
      if (u.pathname.endsWith("dust-floor"))
        return res.end(
          mode === "infinity"
            ? '{"dustFloorUsd":1e400}'
            : '{"dustFloorUsd":25}',
        );
      return res.end(
        '{"positions":[{"coinMint":"0xAB"},{"coinMint":"0xab"},{"coinMint":"Sol"}]}',
      );
    });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  const make = (mode) => {
    const local = localPortfolioPolicyClient({
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
    });
    return createPortfolioReadPolicies({
      createClient: local,
      memo: (size) => Array(size).fill(Symbol()),
      useQuery: (options) => options,
    });
  };
  assert.equal(await make("normal").readDustFloor({}), 25);
  assert.equal(await make("infinity").readDustFloor({}), Infinity);
  await assert.rejects(
    make("denied").readDustFloor({}),
    /Failed to fetch dust floor: 401/,
  );
  assert.deepEqual(
    await make("normal")
      .useSpamMints({ address: "owner/雪", enabled: true })
      .queryFn({}),
    ["0xab", "Sol"],
  );
  await assert.rejects(
    make("spamDenied")
      .useSpamMints({ address: "a", enabled: true })
      .queryFn({}),
    /Failed to fetch spam positions: 403/,
  );
  await assert.rejects(make("bad").readDustFloor({}), SyntaxError);
  assert.equal(wire.length, 6);
  assert.equal(
    wire[0].request.pathAndQuery,
    "/normal/user-portfolio/dust-floor",
  );
  assert.equal(wire[0].request.credentials, "include");
  assert.equal(wire[0].request.headers.authorization, undefined);
  const request = new URL(wire[3].request.pathAndQuery, "http://localhost");
  assert.equal(request.searchParams.get("spamOnly"), "true");
  assert.equal(request.searchParams.get("pageSize"), "200");
  assert.ok(request.pathname.endsWith("owner%2F%E9%9B%AA"));
  const controller = new AbortController(),
    pending = make("wait").readDustFloor({ signal: controller.signal });
  controller.abort();
  await assert.rejects(pending, (e) => e.name === "AbortError");
  if (process.env.PUMP_POLICY_WIRE_OUTPUT)
    await writeFile(
      process.env.PUMP_POLICY_WIRE_OUTPUT,
      JSON.stringify(
        {
          provenance:
            "synthetic isolated loopback responses; no original server/auth qualification",
          normalization:
            "ephemeral loopback origin omitted; exact method/path/query/selected headers/status/body retained",
          completeHTTPResponses: wire.length,
          abortCheck: "AbortError; no response or server receipt inferred",
          wire,
        },
        null,
        2,
      ) + "\n",
    );
});
test("local destination is explicit and network mutations are rejected before transport", async () => {
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
        localPortfolioPolicyClient({
          baseUrl,
          fetchImplementation: () => assert.fail(),
        }),
      TypeError,
    );
  const client = localPortfolioPolicyClient({
    baseUrl: "http://localhost",
    fetchImplementation: () => assert.fail(),
  })();
  await assert.rejects(
    client("POST /user-portfolio/dust-floor", {}),
    /Unsupported read-only/,
  );
});
test("stale qualification, raw corruption and resealed positive-guard changes fail closed", async (t) => {
  const c = await verify(),
    root = await mkdtemp(path.join(os.tmpdir(), "pump-policy-source-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const paths = [
    OUTPUT,
    "recovered/modules.json",
    "evidence/web/manifest.json",
    ...c.factories.map((f) => f.source),
    ...c.normalizers.map((f) => f.factory.source),
  ];
  for (const file of new Set(paths)) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await cp(path.join(APP_ROOT, file), path.join(root, file));
  }
  const metadata = JSON.parse(await readFile(path.join(root, OUTPUT)));
  metadata.qualifications.nativeBackend = true;
  await writeFile(path.join(root, OUTPUT), JSON.stringify(metadata));
  await assert.rejects(verify(root), /contract is stale/);
  const f = c.factories[0],
    file = path.join(root, f.source),
    before = await readFile(file, "utf8"),
    after =
      before.slice(0, f.utf16[0]) +
      before.slice(...f.utf16).replace(")&&t>0?t:null", ")&&t<0?t:null") +
      before.slice(f.utf16[1]);
  assert.notEqual(after, before);
  await writeFile(file, after);
  await assert.rejects(recover(root), /authentication failed/);
  const hash = (x) => createHash("sha256").update(x).digest("hex"),
    mf = path.join(root, "evidence/web/manifest.json"),
    manifest = JSON.parse(await readFile(mf));
  manifest.records.find((x) => x.path === f.source).sha256 = hash(after);
  await writeFile(mf, JSON.stringify(manifest));
  const inf = path.join(root, "recovered/modules.json"),
    index = JSON.parse(await readFile(inf));
  index.modules.find((x) => x.ids.includes(261756)).sha256 = hash(
    after.slice(...f.utf16),
  );
  await writeFile(inf, JSON.stringify(index));
  await assert.rejects(
    recover(root),
    /review required for changed factory 261756/,
  );
});
