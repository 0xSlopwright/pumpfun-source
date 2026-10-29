import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { once } from "node:events";
import {
  initialFollowReadState,
  followReadCallbacks,
  applyFollowReadEffect,
} from "../reconstruction/follow-read-state/client.mjs";
import { extractFollowReadState } from "../scripts/original-follow-read-state.mjs";
import { openCorpus, sha256 } from "../scripts/original-contracts/source.mjs";
import { validateDeclared } from "../scripts/original-contracts/validate.mjs";
const root = fileURLToPath(new URL("..", import.meta.url));
const artifact = await extractFollowReadState(root),
  corpus = await openCorpus(root);
function statePorts(options) {
  const state = initialFollowReadState(options),
    events = [];
  return {
    state,
    events,
    setters: {
      setFollowing(value) {
        events.push(["following", value]);
        state.isFollowing = value;
      },
      setFollowedBack(value) {
        events.push(["followedBack", value]);
        state.isFollowedBack = value;
      },
      setReady(value) {
        events.push(["ready", value]);
        state.isReady = value;
      },
    },
  };
}

test("actual350989 read callbacks, initial effect and five physical button/menu consumers bind original bytes", () => {
  assert.equal(artifact.operation, "GET /following/single/{id}");
  assert.equal(artifact.entry.module, 350989);
  assert.equal(artifact.entry.export, "f");
  assert.equal(artifact.consumers.length, 5);
  for (const key of [
    artifact.entry.ranges.forward,
    artifact.entry.ranges.reverse,
    artifact.entry.ranges.initialEffect,
  ]) {
    const x = artifact.fragments.find(
      (x) => `${x.source}:${x.utf16.join(":")}` === key,
    );
    assert.doesNotMatch(x.text, /POST |DELETE |aws-waf|captcha/i);
  }
});

test("artifact is deterministic; each verbatim byte/UTF16 range and adapter hash reauthenticates", async () => {
  assert.equal(
    await fs.readFile(
      path.join(root, "reconstruction/follow-read-state/contract.json"),
      "utf8",
    ),
    JSON.stringify(artifact, null, 2) + "\n",
  );
  for (const x of artifact.fragments) {
    const c = await corpus.capture(x.source);
    assert.equal(sha256(c.bytes.subarray(...x.utf8)), x.sha256);
    assert.equal(c.text.slice(...x.utf16), x.text);
  }
  assert.equal(
    sha256(await fs.readFile(path.join(root, artifact.implementation.path))),
    artifact.implementation.sha256,
  );
});

test("tampered original relationship source is rejected before deriving workflow", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "follow-read-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  for (const name of [
    "evidence/web/manifest.json",
    "recovered/modules.json",
    artifact.entry.factory.source,
  ]) {
    const target = path.join(dir, name);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(path.join(root, name), target);
  }
  const target = path.join(dir, artifact.entry.factory.source),
    bytes = await fs.readFile(target);
  bytes[30000] ^= 1;
  await fs.writeFile(target, bytes);
  await assert.rejects(
    extractFollowReadState(dir),
    /capture authentication failed/,
  );
});

test("initial following/followed-back flags use nullish fallback and readiness has a separate skip condition", () => {
  assert.deepEqual(initialFollowReadState(), {
    isFollowing: false,
    isFollowedBack: false,
    isReady: false,
  });
  assert.deepEqual(
    initialFollowReadState({
      initialIsFollowing: true,
      initialIsFollowedBack: true,
    }),
    { isFollowing: true, isFollowedBack: true, isReady: false },
  );
  assert.deepEqual(
    initialFollowReadState({
      skipInitialFetch: true,
      initialIsFollowing: false,
    }),
    { isFollowing: false, isFollowedBack: false, isReady: true },
  );
  assert.deepEqual(
    initialFollowReadState({
      skipInitialFetch: true,
      initialIsFollowedBack: true,
    }),
    { isFollowing: false, isFollowedBack: true, isReady: false },
  );
  assert.deepEqual(
    initialFollowReadState({
      skipInitialFetch: true,
      initialIsFollowing: null,
    }),
    { isFollowing: false, isFollowedBack: false, isReady: true },
  );
  assert.equal(
    initialFollowReadState({ initialIsFollowing: 0 }).isFollowing,
    0,
  );
});

test("two read callbacks swap target/viewer operands and preserve headers/error overrides without inventing auth options", async () => {
  const ports = statePorts(),
    seen = [];
  const input = { target: "target", viewerKey: "viewer" };
  const reads = followReadCallbacks(
    async (operation, options) => {
      seen.push([operation, options]);
      return { follow: { id: 1 } };
    },
    input,
    ports.setters,
  );
  input.target = "changed";
  input.viewerKey = "changed-viewer";
  await reads.fetchIsFollowing();
  await reads.fetchIsFollowedBack();
  assert.deepEqual(seen, [
    [
      "GET /following/single/{id}",
      {
        params: { id: "target" },
        query: { userId: "viewer" },
        headers: { "Content-Type": "application/json" },
        throwHttpErrors: false,
      },
    ],
    [
      "GET /following/single/{id}",
      {
        params: { id: "viewer" },
        query: { userId: "target" },
        headers: { "Content-Type": "application/json" },
        throwHttpErrors: false,
      },
    ],
  ]);
  assert.deepEqual(ports.events, [
    ["following", true],
    ["ready", true],
    ["followedBack", true],
  ]);
  for (const [, options] of seen)
    for (const key of ["credentials", "signal", "retry", "body", "hooks"])
      assert.equal(Object.hasOwn(options, key), false);
});

test("raw follow truthiness is used without schema parsing or status reconstruction", async () => {
  for (const [follow, expected] of [
    [null, false],
    [undefined, false],
    [false, false],
    [0, false],
    ["", false],
    [{}, true],
    [[], true],
    ["yes", true],
    [1, true],
  ]) {
    const ports = statePorts();
    const reads = followReadCallbacks(
      async () => ({ follow }),
      { target: "target", viewerKey: "viewer" },
      ports.setters,
    );
    await reads.fetchIsFollowing();
    await reads.fetchIsFollowedBack();
    assert.deepEqual(ports.state, {
      isFollowing: expected,
      isFollowedBack: expected,
      isReady: true,
    });
  }
});

test("missing target/viewer skips each direct callback without touching readiness", async () => {
  for (const input of [
    { target: "", viewerKey: "viewer" },
    { target: "target", viewerKey: null },
    { target: undefined, viewerKey: "viewer" },
  ]) {
    const ports = statePorts();
    const reads = followReadCallbacks(
      () => {
        assert.fail("request after guard");
      },
      input,
      ports.setters,
    );
    assert.equal(await reads.fetchIsFollowing(), undefined);
    assert.equal(await reads.fetchIsFollowedBack(), undefined);
    assert.deepEqual(ports.events, []);
  }
});

test("forward rejection preserves failure and marks ready; reciprocal rejection leaves readiness unchanged", async () => {
  const reason = Error("transport failed");
  const forward = statePorts(),
    reverse = statePorts();
  const transport = async () => {
    throw reason;
  };
  const input = { target: "target", viewerKey: "viewer" };
  await assert.rejects(
    followReadCallbacks(transport, input, forward.setters).fetchIsFollowing(),
    (e) => e === reason,
  );
  assert.deepEqual(forward.events, [["ready", true]]);
  await assert.rejects(
    followReadCallbacks(
      transport,
      input,
      reverse.setters,
    ).fetchIsFollowedBack(),
    (e) => e === reason,
  );
  assert.deepEqual(reverse.events, []);
  const nullResponse = statePorts();
  await assert.rejects(
    followReadCallbacks(
      async () => null,
      input,
      nullResponse.setters,
    ).fetchIsFollowing(),
    TypeError,
  );
  assert.deepEqual(nullResponse.events, [["ready", true]]);
});

test("setter errors retain the captured finally boundary", async () => {
  const followingError = Error("following setter"),
    readyError = Error("ready setter");
  let ready = false;
  const input = { target: "target", viewerKey: "viewer" };
  await assert.rejects(
    followReadCallbacks(async () => ({ follow: true }), input, {
      setFollowing() {
        throw followingError;
      },
      setReady() {
        ready = true;
      },
    }).fetchIsFollowing(),
    (e) => e === followingError,
  );
  assert.equal(ready, true);
  await assert.rejects(
    followReadCallbacks(
      async () => {
        throw followingError;
      },
      input,
      {
        setReady() {
          throw readyError;
        },
      },
    ).fetchIsFollowing(),
    (e) => e === readyError,
  );
});

test("skip-initial effect reuses only defined flags and preserves raw null setter behavior", () => {
  const ports = statePorts(),
    starts = [];
  const reads = {
    fetchIsFollowing() {
      starts.push("forward");
    },
    fetchIsFollowedBack() {
      starts.push("reverse");
    },
  };
  applyFollowReadEffect(
    {
      target: "target",
      viewerKey: "viewer",
      options: {
        skipInitialFetch: true,
        initialIsFollowing: null,
        initialIsFollowedBack: false,
      },
    },
    reads,
    ports.setters,
  );
  assert.deepEqual(starts, []);
  assert.deepEqual(ports.events, [
    ["following", null],
    ["ready", true],
    ["followedBack", false],
  ]);
  assert.equal(ports.state.isFollowing, null);
  const empty = statePorts();
  applyFollowReadEffect(
    {
      target: "target",
      viewerKey: "viewer",
      options: { skipInitialFetch: true },
    },
    reads,
    empty.setters,
  );
  assert.deepEqual(empty.events, []);
});

test("matching last-action target suppresses skipped initialization; initial ref null is retained", () => {
  const reads = {
    fetchIsFollowing() {
      assert.fail();
    },
    fetchIsFollowedBack() {
      assert.fail();
    },
  };
  for (const input of [
    { target: "target", lastActionTarget: "target" },
    { target: null },
  ]) {
    const ports = statePorts();
    applyFollowReadEffect(
      {
        ...input,
        viewerKey: "viewer",
        options: {
          skipInitialFetch: true,
          initialIsFollowing: true,
          initialIsFollowedBack: true,
        },
      },
      reads,
      ports.setters,
    );
    assert.deepEqual(ports.events, []);
  }
});

test("ordinary effect starts forward then reverse without awaiting; no viewer sets ready only", () => {
  const ports = statePorts(),
    starts = [],
    never = new Promise(() => {});
  const reads = {
    fetchIsFollowing() {
      starts.push("forward");
      return never;
    },
    fetchIsFollowedBack() {
      starts.push("reverse");
      return never;
    },
  };
  assert.equal(
    applyFollowReadEffect(
      { target: "target", viewerKey: "viewer" },
      reads,
      ports.setters,
    ),
    undefined,
  );
  assert.deepEqual(starts, ["forward", "reverse"]);
  assert.deepEqual(ports.events, []);
  applyFollowReadEffect(
    { target: "target", viewerKey: null },
    reads,
    ports.setters,
  );
  assert.deepEqual(starts, ["forward", "reverse"]);
  assert.deepEqual(ports.events, [["ready", true]]);
});

test("effect with empty target and a viewer starts guarded callbacks, leaving readiness unchanged", async () => {
  const ports = statePorts(),
    pending = [];
  const reads = followReadCallbacks(
    () => {
      assert.fail("empty target transport");
    },
    { target: "", viewerKey: "viewer" },
    ports.setters,
  );
  applyFollowReadEffect(
    { target: "", viewerKey: "viewer" },
    {
      fetchIsFollowing() {
        pending.push(reads.fetchIsFollowing());
      },
      fetchIsFollowedBack() {
        pending.push(reads.fetchIsFollowedBack());
      },
    },
    ports.setters,
  );
  await Promise.all(pending);
  assert.equal(pending.length, 2);
  assert.deepEqual(ports.events, []);
});

test("no target-generation guard is invented; each callback retains its target/viewer snapshot", async () => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const ports = statePorts(),
    requests = [];
  const old = followReadCallbacks(
    async (_operation, options) => {
      requests.push(options);
      await gate;
      return { follow: true };
    },
    { target: "old", viewerKey: "viewer" },
    ports.setters,
  );
  const pending = old.fetchIsFollowing();
  await followReadCallbacks(
    async () => ({ follow: null }),
    { target: "new", viewerKey: "viewer" },
    ports.setters,
  ).fetchIsFollowing();
  assert.equal(ports.state.isFollowing, false);
  release();
  await pending;
  assert.equal(ports.state.isFollowing, true);
  assert.equal(requests[0].params.id, "old");
});

// Test-only j-shaped capability: validates actual TCP requests, native JSON and
// the explicit throwHttpErrors:false boundary, not Ky retries/browser cookies.
function loopbackTransport(origin, seen) {
  return async (operation, options) => {
    assert.equal(operation, "GET /following/single/{id}");
    assert.equal(options.throwHttpErrors, false);
    const url = new URL(
      `${origin}/following/single/${encodeURIComponent(String(options.params.id))}`,
    );
    url.searchParams.set("userId", String(options.query.userId));
    const response = await fetch(url, { headers: options.headers });
    seen.push({ url: url.href, status: response.status });
    return response.json();
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

test("real HTTP: effect starts reciprocal encoded GETs; forward readiness does not await the reverse", async (t) => {
  const paths = [],
    headers = [],
    observed = [],
    pending = [],
    ports = statePorts();
  let releaseReverse, markReverse;
  const reverseReached = new Promise((resolve) => {
    markReverse = resolve;
  });
  const origin = await serverFor(t, (req, res) => {
    paths.push(req.url);
    headers.push(req.headers);
    if (req.url.startsWith("/following/single/viewer")) {
      releaseReverse = () => res.end('{"follow":null}');
      markReverse();
    } else res.end('{"follow":{"id":1}}');
  });
  const input = { target: "target/slash ?", viewerKey: "viewer" };
  const reads = followReadCallbacks(
    loopbackTransport(origin, observed),
    input,
    ports.setters,
  );
  applyFollowReadEffect(
    input,
    {
      fetchIsFollowing() {
        pending.push(reads.fetchIsFollowing());
      },
      fetchIsFollowedBack() {
        pending.push(reads.fetchIsFollowedBack());
      },
    },
    ports.setters,
  );
  assert.equal(pending.length, 2);
  await reverseReached;
  await pending[0];
  assert.equal(ports.state.isReady, true);
  assert.deepEqual(ports.events, [
    ["following", true],
    ["ready", true],
  ]);
  releaseReverse();
  await pending[1];
  assert.deepEqual(
    new Set(paths),
    new Set([
      "/following/single/target%2Fslash%20%3F?userId=viewer",
      "/following/single/viewer?userId=target%2Fslash+%3F",
    ]),
  );
  assert.equal(
    headers.every(
      (h) =>
        h["content-type"] === "application/json" &&
        h.authorization === undefined,
    ),
    true,
  );
  assert.deepEqual(ports.events.at(-1), ["followedBack", false]);
});

test("real HTTP: non-OK JSON is still consumed and follow truthiness wins over status", async (t) => {
  const origin = await serverFor(t, (req, res) => {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(
      req.url.startsWith("/following/single/viewer")
        ? '{"follow":{"nonSchema":true}}'
        : '{"error":"not found"}',
    );
  });
  const seen = [],
    ports = statePorts();
  const reads = followReadCallbacks(
    loopbackTransport(origin, seen),
    { target: "target", viewerKey: "viewer" },
    ports.setters,
  );
  await reads.fetchIsFollowing();
  await reads.fetchIsFollowedBack();
  assert.deepEqual(ports.state, {
    isFollowing: false,
    isFollowedBack: true,
    isReady: true,
  });
  assert.deepEqual(
    seen.map((x) => x.status),
    [404, 404],
  );
});

test("real HTTP: malformed JSON propagates with forward/reverse readiness asymmetry", async (t) => {
  const origin = await serverFor(t, (_req, res) => {
    res.writeHead(503);
    res.end("not JSON");
  });
  const input = { target: "target", viewerKey: "viewer" },
    forward = statePorts(),
    reverse = statePorts(),
    seen = [];
  await assert.rejects(
    followReadCallbacks(
      loopbackTransport(origin, seen),
      input,
      forward.setters,
    ).fetchIsFollowing(),
    SyntaxError,
  );
  await assert.rejects(
    followReadCallbacks(
      loopbackTransport(origin, seen),
      input,
      reverse.setters,
    ).fetchIsFollowedBack(),
    SyntaxError,
  );
  assert.deepEqual(forward.events, [["ready", true]]);
  assert.deepEqual(reverse.events, []);
});

test("declared graph params/query/response stay separate from raw truthiness consumption", () => {
  const doc = artifact.declarations,
    route = doc["x-follow-read"];
  assert.equal(route.scope, "graph.read");
  assert.equal(validateDeclared(doc, route.params, { id: "" }).success, true);
  assert.equal(
    validateDeclared(doc, route.query, { userId: 5 }).success,
    false,
  );
  assert.equal(
    validateDeclared(doc, route.response, { follow: null }).success,
    true,
  );
  assert.equal(
    validateDeclared(doc, route.response, { follow: true }).success,
    false,
  );
  assert.equal(
    validateDeclared(doc, route.response, { error: "not found" }).success,
    false,
  );
});
