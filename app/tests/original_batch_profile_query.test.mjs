import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { once } from "node:events";
import {
  batchProfileKey,
  retryBatchProfile,
  createBatchProfileQuery,
} from "../reconstruction/batch-profile-query/client.mjs";
import { UserFetchError } from "../reconstruction/profile-lookup/client.mjs";
import { extractBatchProfileQuery } from "../scripts/original-batch-profile-query.mjs";
import { openCorpus, sha256 } from "../scripts/original-contracts/source.mjs";
const root = fileURLToPath(new URL("..", import.meta.url)),
  artifact = await extractBatchProfileQuery(root),
  corpus = await openCorpus(root);

test("six576766 variants/seven origins, used strict read, USERS key and actual Home/Following caller are source-bound", () => {
  assert.equal(artifact.variants.length, 7);
  assert.equal(new Set(artifact.variants.map((x) => x.factory.sha256)).size, 6);
  assert.equal(artifact.consumers[0].id, 163807);
  assert.equal(artifact.prerequisite.pullRequest, 901);
  assert.equal(artifact.prerequisite.novelCredit, false);
  assert.equal(
    artifact.prerequisite.exactPublicHead,
    "b780d75d17fc1965ab21592d8e77d749e3cd4637",
  );
});

test("artifact/dependency hashes and every verbatim source range reproduce", async () => {
  assert.equal(
    await fs.readFile(
      path.join(root, "reconstruction/batch-profile-query/contract.json"),
      "utf8",
    ),
    JSON.stringify(artifact, null, 2) + "\n",
  );
  for (const fragment of artifact.fragments) {
    const c = await corpus.capture(fragment.source);
    assert.equal(sha256(c.bytes.subarray(...fragment.utf8)), fragment.sha256);
    assert.equal(c.text.slice(...fragment.utf16), fragment.text);
  }
  for (const x of [
    artifact.implementation,
    artifact.prerequisite.sourceArtifact,
    artifact.prerequisite.implementation,
    artifact.prerequisite.shared870,
  ])
    assert.equal(sha256(await fs.readFile(path.join(root, x.path))), x.sha256);
});

test("tampered strict-reader prerequisite capture fails before composing query behavior", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "batch-query-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const source = "evidence/web/objects/020facfab961bf67.js";
  for (const name of [
    "evidence/web/manifest.json",
    "recovered/modules.json",
    source,
  ]) {
    const target = path.join(dir, name);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(path.join(root, name), target);
  }
  const target = path.join(dir, source),
    bytes = await fs.readFile(target);
  bytes[100] ^= 1;
  await fs.writeFile(target, bytes);
  await assert.rejects(
    extractBatchProfileQuery(dir),
    /capture authentication failed/,
  );
});

test("query sorts a copy, retains duplicates, snapshots callback input and drops runtime signal", async () => {
  const seen = [],
    addresses = ["z", "a", "a"],
    input = { userAddresses: addresses };
  const api = createBatchProfileQuery({
    transport: async (...args) => {
      seen.push(args);
      return [];
    },
    now: () => 100000,
    report() {
      assert.fail();
    },
  });
  const q = api.queryOptions(input);
  assert.deepEqual(addresses, ["z", "a", "a"]);
  assert.deepEqual(q.queryKey, ["users", "a,a,z"]);
  assert.equal(q.enabled, true);
  assert.equal(q.retryOnMount, false);
  addresses[0] = "changed";
  const controller = new AbortController();
  controller.abort();
  assert.deepEqual(await q.queryFn({ signal: controller.signal }), []);
  assert.deepEqual(seen[0][1].body.addresses, ["a", "a", "z"]);
  assert.equal(Object.hasOwn(seen[0][1], "signal"), false);
  assert.equal(q.refetchOnMount === q.refetchOnWindowFocus, false);
});

test("caller query options override all defaults including function/key/enablement/refetch", async () => {
  const api = createBatchProfileQuery({
    transport() {
      assert.fail();
    },
    now() {
      assert.fail();
    },
    report() {
      assert.fail();
    },
  });
  const overrides = {
    enabled: true,
    queryFn: async () => "override",
    queryKey: ["caller"],
    retry: 9,
    retryOnMount: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  };
  const q = api.queryOptions({ userAddresses: [], queryOptions: overrides });
  for (const [key, value] of Object.entries(overrides))
    assert.equal(q[key], value);
  assert.equal(await q.queryFn(), "override");
});

test("refetch predicates require error status and exact30s elapsed; typed4xx retry remains shared", () => {
  let time = 100000;
  const q = createBatchProfileQuery({ now: () => time }).queryOptions({
    userAddresses: ["a"],
  });
  for (const fn of [q.refetchOnMount, q.refetchOnWindowFocus]) {
    assert.equal(
      fn({ state: { status: "error", errorUpdatedAt: 70001 } }),
      false,
    );
    assert.equal(
      fn({ state: { status: "error", errorUpdatedAt: 70000 } }),
      true,
    );
    assert.equal(
      fn({ state: { status: "success", errorUpdatedAt: 0 } }),
      false,
    );
    assert.equal(
      fn({ state: { status: "error", errorUpdatedAt: NaN } }),
      false,
    );
    assert.throws(() => fn({}), TypeError);
  }
  for (const status of [400, 404, 499])
    assert.equal(retryBatchProfile(0, new UserFetchError({ status })), false);
  for (const error of [
    Error(),
    { status: 404 },
    new UserFetchError({ status: 503 }),
  ]) {
    assert.equal(retryBatchProfile(0, error), true);
    assert.equal(retryBatchProfile(1, error), false);
  }
  time = 69999;
  assert.equal(
    q.refetchOnMount({ state: { status: "error", errorUpdatedAt: 70000 } }),
    false,
  );
});

test("successful/no-error projection returns original identity and never reads fallback cache", () => {
  const api = createBatchProfileQuery({});
  const input = { userAddresses: ["a"] },
    cache = {
      getQueryData() {
        assert.fail();
      },
    };
  for (const error of [undefined, null, false, 0]) {
    const result = { error, data: undefined, isError: true };
    assert.equal(api.projectResult(input, cache, result), result);
  }
});

test("error fallback filters onlyundefined, retains order/duplicates/null/false and existing non-null data wins", () => {
  const api = createBatchProfileQuery({}),
    values = new Map([
      ["a", null],
      ["b", false],
      ["c", 0],
      ["d", ""],
      ["e", { cached: true }],
    ]),
    seen = [];
  const cache = {
      getQueryData(key) {
        seen.push(key);
        return values.get(key[1]);
      },
    },
    input = { userAddresses: ["missing", "e", "d", "c", "b", "a", "a"] },
    error = Error("failed");
  const result = {
      error,
      data: null,
      isError: true,
      status: "error",
      marker: 3,
    },
    projected = api.projectResult(input, cache, result);
  assert.notEqual(projected, result);
  assert.equal(projected.error, error);
  assert.equal(projected.isError, true);
  assert.equal(projected.marker, 3);
  assert.deepEqual(projected.data, [
    null,
    null,
    false,
    0,
    "",
    { cached: true },
  ]);
  seen.length = 0;
  const existing = [];
  assert.equal(
    api.projectResult(input, cache, { ...result, data: existing }).data,
    existing,
  );
  assert.equal(seen.length, 7);
});

test("raw comma key collisions and fallback split remain source quirks rather than invented canonicalization", () => {
  assert.deepEqual(batchProfileKey(["a,b"]), batchProfileKey(["a", "b"]));
  assert.deepEqual(batchProfileKey(["b", "a"]), ["users", "b,a"]);
  const api = createBatchProfileQuery({}),
    seen = [];
  const value = api.projectResult(
    { userAddresses: ["a,b"] },
    {
      getQueryData(key) {
        seen.push(key);
        return key[1];
      },
    },
    { error: true },
  );
  assert.deepEqual(seen, [
    ["user", "a"],
    ["user", "b"],
  ]);
  assert.deepEqual(value.data, ["a", "b"]);
  assert.deepEqual(
    api.projectResult(
      { userAddresses: [] },
      {
        getQueryData() {
          assert.fail();
        },
      },
      { error: true },
    ).data,
    [],
  );
});

test("module error reporter counts suppressed observations, resets on eligible report and shares across inputs", () => {
  let time = 31000;
  const reports = [],
    error = Error("failed");
  const api = createBatchProfileQuery({
    now: () => time,
    report: (value) => reports.push(value),
  });
  api.observeError({ userAddresses: ["b", "a"] }, { error });
  assert.deepEqual(reports[0], {
    error,
    feature: "profile",
    operation: "users-batch",
    context: { addressCount: 2 },
  });
  time = 32000;
  api.observeError({ userAddresses: ["other"] }, { error });
  time = 33000;
  api.observeError({ userAddresses: [] }, { error });
  assert.equal(reports.length, 1);
  time = 61000;
  api.observeError({ userAddresses: ["a,b"] }, { error });
  assert.deepEqual(reports[1].context, {
    addressCount: 2,
    suppressedReports: 2,
  });
  time = 91000;
  api.observeError({ userAddresses: [] }, { error });
  assert.deepEqual(reports[2].context, { addressCount: 0 });
});

test("initial zero counter, false errors and reporter exceptions keep their explicit effect-port boundaries", () => {
  let time = 0;
  const reports = [],
    api = createBatchProfileQuery({
      now: () => time,
      report: (value) => reports.push(value),
    });
  api.observeError({ userAddresses: [] }, { error: true });
  assert.equal(reports.length, 0);
  time = 30000;
  api.observeError({ userAddresses: [] }, { error: true });
  assert.deepEqual(reports[0].context, {
    addressCount: 0,
    suppressedReports: 1,
  });
  const quiet = createBatchProfileQuery({
    now() {
      assert.fail();
    },
    report() {
      assert.fail();
    },
  });
  quiet.observeError({ userAddresses: [] }, {});
  const reason = Error("reporter failed"),
    throwing = createBatchProfileQuery({
      now: () => 31000,
      report() {
        throw reason;
      },
    });
  assert.throws(
    () => throwing.observeError({ userAddresses: [] }, { error: true }),
    (e) => e === reason,
  );
});

function localTransport(origin, observations) {
  return async (operation, opts) => {
    assert.equal(operation, "POST /users/batch");
    observations.push(opts);
    const response = await fetch(`${origin}/users/batch`, {
      method: "POST",
      headers: opts.headers,
      body: JSON.stringify(opts.body),
    });
    for (const hook of opts.hooks.afterResponse)
      await hook(null, opts, response);
    return opts.parseJson(await response.text());
  };
}
async function serverFor(t, handler) {
  const server = createServer(handler);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  return `http://127.0.0.1:${server.address().port}`;
}
async function bodyOf(req) {
  let text = "";
  for await (const part of req) text += part;
  return JSON.parse(text);
}

test("real HTTP: actual query callback uses strict reader, sorted duplicate addresses and raw successful result", async (t) => {
  const requests = [],
    observed = [],
    rows = [{ address: "a" }, { address: "b" }];
  const origin = await serverFor(t, async (req, res) => {
    requests.push(await bodyOf(req));
    res.end(JSON.stringify({ users: rows }));
  });
  const api = createBatchProfileQuery({
      transport: localTransport(origin, observed),
      now: () => 100000,
      report() {
        assert.fail();
      },
    }),
    q = api.queryOptions({ userAddresses: ["b", "a", "a"] });
  const controller = new AbortController();
  controller.abort();
  assert.deepEqual(await q.queryFn({ signal: controller.signal }), rows);
  assert.deepEqual(requests, [{ addresses: ["a", "a", "b"] }]);
  assert.equal(Object.hasOwn(observed[0], "signal"), false);
  const result = { data: rows };
  assert.equal(
    api.projectResult({ userAddresses: ["b", "a"] }, {}, result),
    result,
  );
});

test("real HTTP: typed503 failure composes cache fallback/report context and delayed refetch predicate", async (t) => {
  const origin = await serverFor(t, async (req, res) => {
      await bodyOf(req);
      res.writeHead(503);
      res.end("not JSON");
    }),
    reports = [];
  let time = 100000;
  const api = createBatchProfileQuery({
      transport: localTransport(origin, []),
      now: () => time,
      report: (value) => reports.push(value),
    }),
    input = { userAddresses: ["b", "a"] },
    q = api.queryOptions(input);
  let error;
  try {
    await q.queryFn();
    assert.fail();
  } catch (value) {
    error = value;
  }
  assert.ok(error instanceof UserFetchError);
  assert.equal(error.status, 503);
  const result = { data: undefined, error, isError: true },
    cache = {
      getQueryData(key) {
        return key[1] === "a" ? { address: "a", cached: true } : undefined;
      },
    };
  assert.deepEqual(api.projectResult(input, cache, result).data, [
    { address: "a", cached: true },
  ]);
  api.observeError(input, result);
  assert.equal(reports[0].error, error);
  assert.equal(
    q.refetchOnWindowFocus({
      state: { status: "error", errorUpdatedAt: 100000 },
    }),
    false,
  );
  time += 30000;
  assert.equal(
    q.refetchOnWindowFocus({
      state: { status: "error", errorUpdatedAt: 100000 },
    }),
    true,
  );
});

test("real HTTP: sorted101-address callback delegates100/1 chunking in original request order and empty manual call still reads", async (t) => {
  const requests = [],
    pending = [];
  const origin = await serverFor(t, async (req, res) => {
    const body = await bodyOf(req);
    requests.push(body);
    if (!body.addresses.length) {
      res.end("[]");
      return;
    }
    pending.push({ body, res });
    if (pending.length === 2)
      for (const item of [...pending].reverse())
        item.res.end(
          JSON.stringify(item.body.addresses.map((address) => ({ address }))),
        );
  });
  const input = Array.from({ length: 101 }, (_, i) => `a${100 - i}`),
    expected = [...input].sort((a, b) => a.localeCompare(b));
  const api = createBatchProfileQuery({
    transport: localTransport(origin, []),
    now: Date.now,
    report() {
      assert.fail();
    },
  });
  assert.deepEqual(
    (await api.queryOptions({ userAddresses: input }).queryFn()).map(
      (x) => x.address,
    ),
    expected,
  );
  assert.deepEqual(
    requests.map((x) => x.addresses.length).sort((a, b) => a - b),
    [1, 100],
  );
  const empty = api.queryOptions({ userAddresses: [] });
  assert.equal(empty.enabled, false);
  assert.deepEqual(await empty.queryFn(), []);
  assert.deepEqual(requests.at(-1), { addresses: [] });
});
