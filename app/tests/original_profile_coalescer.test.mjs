import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { once } from "node:events";
import {
  PROFILE_BATCH_ORIGIN,
  profileBatchKey,
  retryProfileBatch,
  indexProfiles,
  parseLaxProfileBatch,
  requireProfileBatchOk,
  createProfileBatchReader,
} from "../reconstruction/profile-coalescer/client.mjs";
import {
  UserFetchError,
  isUserMissing,
} from "../reconstruction/profile-lookup/client.mjs";
import { extractProfileCoalescer } from "../scripts/original-profile-coalescer.mjs";
import { openCorpus, sha256 } from "../scripts/original-contracts/source.mjs";
const root = fileURLToPath(new URL("..", import.meta.url)),
  artifact = await extractProfileCoalescer(root),
  corpus = await openCorpus(root);
function clockPort() {
  const scheduled = [];
  return {
    scheduled,
    schedule(fn, delay) {
      scheduled.push({ fn, delay });
      return 0;
    },
    flush() {
      const next = scheduled.shift();
      assert.ok(next);
      assert.equal(next.delay, 50);
      next.fn();
    },
  };
}
function cachePort(initial = []) {
  const data = new Map(initial),
    writes = [];
  return {
    data,
    writes,
    getQueryData(key) {
      return data.get(key[1]);
    },
    getQueryState(key) {
      return data.has(key[1]) ? { dataUpdatedAt: 1234 } : undefined;
    },
    setQueryData(key, update) {
      writes.push(key);
      data.set(key[1], update(data.get(key[1])));
    },
  };
}

test("all11 physical variants and seven actual caller variants are independently source-bound", () => {
  assert.equal(artifact.variants.length, 11);
  assert.equal(artifact.consumers.length, 7);
  assert.equal(
    artifact.consumers.filter((x) => x.module === 238128)[0].invocations.length,
    2,
  );
  assert.equal(
    artifact.consumers
      .filter((x) => x.module === 300983)
      .every((x) => x.invocations.length === 2),
    true,
  );
  assert.equal(artifact.prerequisite.novelCredit, false);
});

test("artifact, dependency, implementation and every original range reproduce without captured execution", async () => {
  assert.equal(
    await fs.readFile(
      path.join(root, "reconstruction/profile-coalescer/contract.json"),
      "utf8",
    ),
    JSON.stringify(artifact, null, 2) + "\n",
  );
  for (const fragment of artifact.fragments) {
    const c = await corpus.capture(fragment.source);
    assert.equal(sha256(c.bytes.subarray(...fragment.utf8)), fragment.sha256);
    assert.equal(c.text.slice(...fragment.utf16), fragment.text);
  }
  for (const input of [artifact.implementation, artifact.prerequisite])
    assert.equal(
      sha256(await fs.readFile(path.join(root, input.path))),
      input.sha256,
    );
});

test("selected coalescer capture mutation is rejected", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "profile-coalescer-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const source = artifact.variants[0].factory.source;
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
    extractProfileCoalescer(dir),
    /capture authentication failed/,
  );
});

test("lax parser keeps native JSON failures but maps invalid JSON shapes to empty, unlike strict544930", () => {
  assert.deepEqual(parseLaxProfileBatch('[null,{"unknown":true}]'), [
    null,
    { unknown: true },
  ]);
  assert.deepEqual(parseLaxProfileBatch('{"users":[1]}'), [1]);
  for (const text of ["null", "false", "{}", '{"users":null}', '"text"'])
    assert.deepEqual(parseLaxProfileBatch(text), []);
  for (const text of ["", " ", "not JSON"])
    assert.throws(() => parseLaxProfileBatch(text), SyntaxError);
});

test("HTTP hook uses real870 class with404 not_found and does not inspect successful blank bodies", () => {
  assert.throws(
    () =>
      requireProfileBatchOk(null, null, new Response("bad", { status: 404 })),
    (e) => e instanceof UserFetchError && isUserMissing(e) && e.status === 404,
  );
  assert.throws(
    () =>
      requireProfileBatchOk(null, null, new Response("bad", { status: 503 })),
    (e) =>
      e instanceof UserFetchError &&
      e.reason === "http_error" &&
      e.status === 503,
  );
  assert.equal(
    requireProfileBatchOk(null, null, {
      ok: true,
      clone() {
        assert.fail("no clone in this helper");
      },
    }),
    undefined,
  );
});

test("directH deduplicates/filters truthy identifiers, skips empty and supplies only captured request options", async () => {
  const seen = [],
    clock = clockPort();
  const reader = createProfileBatchReader({
    schedule: clock.schedule,
    createClient:
      (config) =>
      async (...args) => {
        seen.push([config, ...args]);
        return [];
      },
  });
  assert.deepEqual(
    await reader.fetchBatch("https://explicit.invalid", [
      "a",
      "a",
      "",
      null,
      undefined,
      false,
      "b",
    ]),
    [],
  );
  assert.deepEqual(seen[0], [
    { clientServerUrl: "https://explicit.invalid" },
    "POST /users/batch",
    {
      body: { addresses: ["a", "b"] },
      credentials: "same-origin",
      hooks: { afterResponse: [requireProfileBatchOk] },
      parseJson: parseLaxProfileBatch,
    },
  ]);
  assert.deepEqual(await reader.fetchBatch("ignored", []), []);
  assert.equal(seen.length, 1);
  assert.equal(clock.scheduled.length, 0);
  await reader.fetchBatch(
    "https://explicit.invalid",
    Array.from({ length: 101 }, (_, i) => `a${i}`),
  );
  assert.equal(seen.length, 2);
  assert.equal(seen[1][2].body.addresses.length, 101);
});

test("address/userId map is last-row-wins, excludes username and skips null rows", () => {
  const first = { address: "wallet", userId: "cc", username: "name" },
    second = { address: "other", userId: "wallet" };
  const by = indexProfiles([null, first, second]);
  assert.equal(by.get("wallet"), second);
  assert.equal(by.get("cc"), first);
  assert.equal(by.get("other"), second);
  assert.equal(by.has("name"), false);
});

test("duplicate waiters share one50ms request, all resolve and aliases preserve existing non-null values", async () => {
  const clock = clockPort(),
    cache = cachePort([["name", { prior: true }]]),
    calls = [],
    user = { address: "wallet", userId: "cc", username: "name" };
  const reader = createProfileBatchReader({
    schedule: clock.schedule,
    createClient: (config) => async (_op, opts) => {
      calls.push([config, opts]);
      return [user];
    },
  });
  const first = reader.queryOptions(cache, { address: "wallet" }).queryFn(),
    second = reader.queryOptions(cache, { address: "wallet" }).queryFn();
  assert.equal(calls.length, 0);
  assert.equal(clock.scheduled.length, 1);
  clock.flush();
  assert.deepEqual(await Promise.all([first, second]), [user, user]);
  assert.deepEqual(calls[0][1].body.addresses, ["wallet"]);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0].clientServerUrl, PROFILE_BATCH_ORIGIN);
  assert.equal(cache.data.get("wallet"), user);
  assert.equal(cache.data.get("cc"), user);
  assert.deepEqual(cache.data.get("name"), { prior: true });
  assert.equal(cache.writes.length, 6);
});

test("missing identifier resolves null without cache writes; UUID address still hydrates its own user key", async () => {
  const uuid = "00000000-0000-0000-0000-000000000000",
    user = { address: uuid, userId: "cc", username: "name" },
    clock = clockPort(),
    cache = cachePort();
  const reader = createProfileBatchReader({
    schedule: clock.schedule,
    createClient: () => async () => [user],
  });
  const a = reader.queryOptions(cache, { address: "missing" }).queryFn(),
    b = reader.queryOptions(cache, { address: uuid }).queryFn();
  clock.flush();
  assert.equal(await a, null);
  assert.equal(await b, user);
  assert.deepEqual(cache.writes, [["user", uuid]]);
});

test("flush snapshots/reset queue before HTTP; a second window for same identifier cannot consume first waiters", async () => {
  const clock = clockPort(),
    cache = cachePort(),
    resolvers = [];
  const reader = createProfileBatchReader({
    schedule: clock.schedule,
    createClient: () => () => new Promise((resolve) => resolvers.push(resolve)),
  });
  const first = reader.queryOptions(cache, { address: "same" }).queryFn();
  clock.flush();
  const second = reader.queryOptions(cache, { address: "same" }).queryFn();
  assert.equal(clock.scheduled.length, 1);
  clock.flush();
  const newUser = { address: "same", version: "new" },
    oldUser = { address: "same", version: "old" };
  resolvers[1]([newUser]);
  assert.equal(await second, newUser);
  resolvers[0]([oldUser]);
  assert.equal(await first, oldUser);
  assert.equal(cache.data.get("same"), newUser);
});

test("101 keys form independent100/1 chunks; one failure rejects only its own waiters", async () => {
  const clock = clockPort(),
    cache = cachePort(),
    error = Error("first chunk failed"),
    requests = [];
  const reader = createProfileBatchReader({
    schedule: clock.schedule,
    createClient: () => async (_op, opts) => {
      requests.push(opts);
      if (opts.body.addresses.length === 100) throw error;
      return [{ address: "a100" }];
    },
  });
  const pending = Array.from({ length: 101 }, (_, i) =>
    reader.queryOptions(cache, { address: `a${i}` }).queryFn(),
  );
  const settled = Promise.allSettled(pending);
  assert.equal(clock.scheduled.length, 1);
  clock.flush();
  const outcomes = await settled;
  assert.deepEqual(
    requests.map((x) => x.body.addresses.length),
    [100, 1],
  );
  assert.equal(
    outcomes
      .slice(0, 100)
      .every((x) => x.status === "rejected" && x.reason === error),
    true,
  );
  assert.equal(outcomes[100].status, "fulfilled");
  assert.deepEqual(outcomes[100].value, { address: "a100" });
});

test("query key/initial data/timestamp/retry preserve raw address and signal-free callback boundaries", async () => {
  const clock = clockPort(),
    user = { address: "wallet" },
    cache = cachePort([["wallet", user]]),
    seen = [];
  const reader = createProfileBatchReader({
    schedule: clock.schedule,
    createClient: () => async (_op, opts) => {
      seen.push(opts);
      return [];
    },
  });
  const q = reader.queryOptions(cache, { address: "wallet" });
  assert.deepEqual(q.queryKey, ["user-profile-batch", "wallet"]);
  assert.equal(q.initialData(), user);
  assert.equal(q.initialDataUpdatedAt(), 1234);
  assert.equal(q.staleTime, 300000);
  assert.equal(q.retry, retryProfileBatch);
  assert.deepEqual(profileBatchKey(undefined), [
    "user-profile-batch",
    undefined,
  ]);
  const empty = reader.queryOptions(cache, {});
  assert.deepEqual(empty.queryKey, ["user-profile-batch", ""]);
  assert.equal(empty.enabled, false);
  assert.equal(empty.initialData(), undefined);
  assert.equal(
    reader.queryOptions(cache, { address: "wallet", enabled: null }).enabled,
    null,
  );
  const controller = new AbortController();
  controller.abort();
  const pending = q.queryFn({ signal: controller.signal });
  clock.flush();
  assert.equal(await pending, null);
  assert.equal(Object.hasOwn(seen[0], "signal"), false);
  for (const error of [
    new UserFetchError({ status: 404 }),
    new UserFetchError({ status: 401 }),
  ])
    assert.equal(retryProfileBatch(0, error), false);
  for (const error of [
    new UserFetchError({ status: 500 }),
    new SyntaxError(),
    { status: 404 },
  ]) {
    assert.equal(retryProfileBatch(0, error), true);
    assert.equal(retryProfileBatch(1, error), false);
  }
});

test("module instances isolate queues, and empty manually-called query resolves null without HTTP", async () => {
  const clocks = [clockPort(), clockPort()],
    cache = cachePort(),
    calls = [];
  const readers = clocks.map((clock) =>
    createProfileBatchReader({
      schedule: clock.schedule,
      createClient: () => async (_op, opts) => {
        calls.push(opts);
        return [];
      },
    }),
  );
  const a = readers[0].queryOptions(cache, { address: "a" }).queryFn(),
    b = readers[1].queryOptions(cache, { address: "b" }).queryFn();
  clocks[0].flush();
  assert.equal(await a, null);
  assert.equal(calls.length, 1);
  assert.equal(clocks[1].scheduled.length, 1);
  clocks[1].flush();
  assert.equal(await b, null);
  const empty = readers[0].queryOptions(cache, {}).queryFn();
  clocks[0].flush();
  assert.equal(await empty, null);
  assert.equal(calls.length, 2);
});

function localClient(origin, seen) {
  return (config) => async (operation, opts) => {
    seen.push([config, operation, opts]);
    assert.equal(operation, "POST /users/batch");
    const response = await fetch(`${origin}/users/batch`, {
      method: "POST",
      body: JSON.stringify(opts.body),
      headers: { "Content-Type": "application/json" },
      credentials: opts.credentials,
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
  for await (const data of req) text += data;
  return JSON.parse(text);
}

test("real HTTP and real timer: duplicate wallet/cc waiters coalesce into one read and warm cache aliases", async (t) => {
  const requests = [],
    seen = [],
    timers = [],
    profile = { address: "wallet", userId: "cc", username: "name" };
  const origin = await serverFor(t, async (req, res) => {
    requests.push(await bodyOf(req));
    res.end(JSON.stringify({ users: [profile] }));
  });
  const reader = createProfileBatchReader({
      createClient: localClient(origin, seen),
      schedule(fn, delay) {
        timers.push(delay);
        return setTimeout(fn, delay);
      },
    }),
    cache = cachePort();
  const pending = ["wallet", "wallet", "cc"].map((address) =>
    reader.queryOptions(cache, { address }).queryFn(),
  );
  const values = await Promise.all(pending);
  assert.deepEqual(values, [profile, profile, profile]);
  assert.deepEqual(requests, [{ addresses: ["wallet", "cc"] }]);
  assert.deepEqual(timers, [50]);
  assert.equal(seen[0][0].clientServerUrl, PROFILE_BATCH_ORIGIN);
  assert.equal(seen[0][2].credentials, "same-origin");
  assert.deepEqual(cache.data.get("name"), profile);
});

test("real HTTP: native JSON failure fans out by identity while invalid shape resolves missing profiles", async (t) => {
  let count = 0;
  const origin = await serverFor(t, async (req, res) => {
      await bodyOf(req);
      res.end(++count === 1 ? "not JSON" : '{"unknown":true}');
    }),
    clock = clockPort(),
    cache = cachePort();
  const reader = createProfileBatchReader({
    createClient: localClient(origin, []),
    schedule: clock.schedule,
  });
  const first = reader.queryOptions(cache, { address: "same" }).queryFn(),
    second = reader.queryOptions(cache, { address: "same" }).queryFn();
  const errors = Promise.allSettled([first, second]);
  clock.flush();
  const results = await errors;
  assert.equal(results[0].status, "rejected");
  assert.ok(results[0].reason instanceof SyntaxError);
  assert.equal(results[1].reason, results[0].reason);
  const next = reader.queryOptions(cache, { address: "same" }).queryFn();
  clock.flush();
  assert.equal(await next, null);
});

test("real HTTP: non-OK404 typed failure is preserved for every queued waiter", async (t) => {
  const origin = await serverFor(t, async (req, res) => {
      await bodyOf(req);
      res.writeHead(404);
      res.end("not JSON");
    }),
    clock = clockPort(),
    cache = cachePort();
  const reader = createProfileBatchReader({
    createClient: localClient(origin, []),
    schedule: clock.schedule,
  });
  const results = Promise.allSettled([
    reader.queryOptions(cache, { address: "a" }).queryFn(),
    reader.queryOptions(cache, { address: "b" }).queryFn(),
  ]);
  clock.flush();
  const values = await results;
  assert.equal(values[0].status, "rejected");
  assert.ok(values[0].reason instanceof UserFetchError);
  assert.equal(isUserMissing(values[0].reason), true);
  assert.equal(values[1].reason, values[0].reason);
  assert.equal(cache.writes.length, 0);
});
