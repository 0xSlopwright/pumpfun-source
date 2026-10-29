import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { once } from "node:events";
import {
  mutualFollowersKey,
  mutualFollowersQueryOptions,
  requireMutualFollowersOk,
} from "../reconstruction/mutual-followers/client.mjs";
import {
  ContractError,
  withContractErrorNormalization,
} from "../reconstruction/contract-http-errors/decode.mjs";
import { extractMutualFollowers } from "../scripts/original-mutual-followers.mjs";
import { openCorpus, sha256 } from "../scripts/original-contracts/source.mjs";
import { validateDeclared } from "../scripts/original-contracts/validate.mjs";
const root = fileURLToPath(new URL("..", import.meta.url));
const artifact = await extractMutualFollowers(root);
const corpus = await openCorpus(root);

test("actual366510 registration is separate from shared350989 mutation/list exports", () => {
  assert.equal(artifact.entry.module, 366510);
  assert.equal(artifact.entry.export, "z");
  const key = artifact.entry.sourceRanges.hook;
  const hook = artifact.fragments.find(
    (x) => `${x.source}:${x.utf16.join(":")}` === key,
  );
  assert.match(hook.text, /GET \/users\/\{id\}\/mutual-followers/);
  assert.doesNotMatch(hook.text, /POST |DELETE /);
  assert.match(artifact.limits.join(" "), /no importing UI caller/);
  assert.equal(
    Object.hasOwn(artifact.declarations["x-mutual-followers"], "scope"),
    false,
  );
});

test("artifact is deterministic and every original fragment/implementation hash is bound", async () => {
  assert.equal(
    await fs.readFile(
      path.join(root, "reconstruction/mutual-followers/contract.json"),
      "utf8",
    ),
    JSON.stringify(artifact, null, 2) + "\n",
  );
  for (const x of artifact.fragments) {
    const capture = await corpus.capture(x.source);
    assert.equal(sha256(capture.bytes.subarray(...x.utf8)), x.sha256);
    if (x.text !== undefined)
      assert.equal(capture.text.slice(...x.utf16), x.text);
  }
  assert.equal(
    sha256(await fs.readFile(path.join(root, artifact.implementation.path))),
    artifact.implementation.sha256,
  );
});

test("mutating actual selected capture fails before attribution/publication", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "mutual-source-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  for (const name of [
    "evidence/web/manifest.json",
    "recovered/modules.json",
    artifact.entry.source,
  ]) {
    const p = path.join(dir, name);
    await fs.mkdir(path.dirname(p), { recursive: true });
    await fs.copyFile(path.join(root, name), p);
  }
  const p = path.join(dir, artifact.entry.source);
  const b = await fs.readFile(p);
  b[22500] ^= 1;
  await fs.writeFile(p, b);
  await assert.rejects(
    extractMutualFollowers(dir),
    /capture authentication failed/,
  );
});

test("query options retain default first page, retry, exact signal and credential/error hook override", async () => {
  const seen = [];
  const value = { mutualFollowers: [], hasMore: true, totalCount: 25 };
  const options = mutualFollowersQueryOptions(
    async (...args) => {
      seen.push(args);
      return value;
    },
    { profileId: "subject" },
    "viewer",
  );
  assert.deepEqual(options.queryKey, [
    "mutual-followers",
    "subject",
    5,
    "viewer",
  ]);
  assert.equal(options.enabled, true);
  assert.equal(options.staleTime, 60000);
  assert.equal(options.retry, 1);
  assert.equal(seen.length, 0);
  const signal = new AbortController().signal;
  assert.equal(await options.queryFn({ signal }), value);
  const [operation, request] = seen[0];
  assert.equal(operation, "GET /users/{id}/mutual-followers");
  assert.deepEqual(request.params, { id: "subject" });
  assert.deepEqual(request.query, { limit: 5, offset: 0 });
  assert.equal(request.signal, signal);
  assert.equal(request.credentials, "include");
  assert.equal(request.throwHttpErrors, false);
  assert.deepEqual(request.hooks.afterResponse, [requireMutualFollowersOk]);
});

test("profile/limit/viewer partition raw keys; viewer is never asserted to the HTTP server", async () => {
  const seen = [];
  const transport = async (...a) => {
    seen.push(a);
    return null;
  };
  const a = mutualFollowersQueryOptions(
    transport,
    { profileId: "same", limit: 7 },
    "viewerA",
  );
  const b = mutualFollowersQueryOptions(
    transport,
    { profileId: "same", limit: 7 },
    "viewerB",
  );
  assert.notDeepEqual(a.queryKey, b.queryKey);
  await a.queryFn({});
  await b.queryFn({});
  assert.deepEqual(seen[0], seen[1]);
  assert.equal(Object.hasOwn(seen[0][1].query, "viewer"), false);
  assert.equal(Object.hasOwn(seen[0][1], "headers"), false);
  assert.equal(Object.hasOwn(seen[0][1], "body"), false);
  assert.notDeepEqual(
    mutualFollowersKey({ profileId: "p", limit: 5, viewer: "v" }),
    mutualFollowersKey({ profileId: "q", limit: 5, viewer: "v" }),
  );
});

test("enablement is separate from manual callback and nullish key/subject fallbacks", async () => {
  let request;
  const transport = async (_op, v) => {
    request = v;
    return {};
  };
  for (const input of [{}, { profileId: "p", enabled: false }])
    assert.equal(
      mutualFollowersQueryOptions(transport, input, undefined).enabled,
      false,
    );
  const options = mutualFollowersQueryOptions(transport, {}, undefined);
  assert.deepEqual(options.queryKey, ["mutual-followers", "", 5, ""]);
  await options.queryFn({});
  assert.deepEqual(request.params, { id: "" });
  assert.equal(
    mutualFollowersQueryOptions(transport, { profileId: " " }, " ").enabled,
    true,
  );
  assert.equal(
    mutualFollowersQueryOptions(
      transport,
      { profileId: "p", enabled: null },
      "v",
    ).enabled,
    null,
  );
});

test("explicit invalid limits are forwarded, independently from declared integer/min constraints", async () => {
  const doc = artifact.declarations;
  const spec = doc["x-mutual-followers"];
  for (const limit of [null, 0, -1, 1.5]) {
    let request;
    const options = mutualFollowersQueryOptions(
      async (_o, v) => {
        request = v;
        return [];
      },
      { profileId: "p", limit },
      "v",
    );
    await options.queryFn({});
    assert.equal(request.query.limit, limit);
    assert.equal(
      validateDeclared(doc, spec.query, { limit, offset: 0 }).success,
      false,
    );
  }
  assert.equal(
    validateDeclared(doc, spec.query, { limit: 5, offset: 10001 }).success,
    true,
  ); // 10k rejection is description only.
  assert.equal(
    validateDeclared(doc, spec.query, { offset: Number.MAX_SAFE_INTEGER + 1 })
      .success,
    false,
  );
  assert.equal(validateDeclared(doc, spec.params, { id: "" }).success, true);
});

test("callback captures scalar options and creates fresh request/hook containers each time", async () => {
  const input = { profileId: "original", limit: 8 };
  const seen = [];
  const options = mutualFollowersQueryOptions(
    async (_o, v) => {
      seen.push({
        id: v.params.id,
        limit: v.query.limit,
        hooks: v.hooks.afterResponse.length,
      });
      v.params.id = "changed";
      v.query.limit = 1;
      v.hooks.afterResponse.pop();
      return {};
    },
    input,
    "viewer",
  );
  input.profileId = "late";
  input.limit = 99;
  await options.queryFn({});
  await options.queryFn({});
  assert.deepEqual(seen, [
    { id: "original", limit: 8, hooks: 1 },
    { id: "original", limit: 8, hooks: 1 },
  ]);
});

test("raw JSON response is not normalized, deduplicated, validated or paginated further", async () => {
  let calls = 0;
  const raw = {
    mutualFollowers: [{ unknown: "unvalidated" }],
    hasMore: true,
    totalCount: 42,
    extra: "retained",
  };
  const options = mutualFollowersQueryOptions(
    async () => {
      calls++;
      return raw;
    },
    { profileId: "p" },
    "v",
  );
  assert.equal(await options.queryFn({}), raw);
  assert.equal(calls, 1);
  assert.equal(
    validateDeclared(
      artifact.declarations,
      artifact.declarations["x-mutual-followers"].response,
      raw,
    ).success,
    false,
  );
  assert.equal(
    await mutualFollowersQueryOptions(
      async () => null,
      { profileId: "p" },
      "v",
    ).queryFn({}),
    null,
  );
});

test("response hook leaves successful body readable and throws exact plain status error before parsing", async () => {
  const ok = new Response('{"ok":true}', { status: 200 });
  assert.equal(requireMutualFollowersOk(null, null, ok), undefined);
  assert.equal(ok.bodyUsed, false);
  for (const response of [
    new Response("not json", { status: 503 }),
    Response.error(),
  ]) {
    assert.throws(
      () => requireMutualFollowersOk(null, null, response),
      (error) =>
        error.message ===
          `Failed to fetch mutual followers: ${response.status}` &&
        error.name === "Error" &&
        !(error instanceof ContractError) &&
        !("response" in error),
    );
    assert.equal(response.bodyUsed, false);
  }
});

test("ordinary/network errors pass through callback by identity", async () => {
  const error = new Error("controlled network failure");
  await assert.rejects(
    mutualFollowersQueryOptions(
      async () => {
        throw error;
      },
      { profileId: "p" },
      "v",
    ).queryFn({}),
    (x) => x === error,
  );
});

async function serverFor(t, handler) {
  const server = createServer(handler);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  });
  return `http://127.0.0.1:${server.address().port}`;
}
// Explicit loopback adapter, not a Ky/auth implementation. Executes the actual
// exported response hook on a native Response before JSON and composes691.
function localTransport(origin, trace = []) {
  return async (operation, options) =>
    withContractErrorNormalization(
      operation,
      async () => {
        const url = new URL(
          operation
            .slice(4)
            .replace("{id}", encodeURIComponent(String(options.params.id))),
          origin,
        );
        for (const [k, v] of Object.entries(options.query))
          if (v !== undefined) url.searchParams.set(k, String(v));
        const request = new Request(url, {
          credentials: options.credentials,
          signal: options.signal,
        });
        const response = await fetch(request);
        trace.push({ request, options, response });
        for (const hook of options.hooks.afterResponse)
          await hook(request, options, response.clone(), { retryCount: 0 });
        return response.json();
      },
      {
        contracts: {},
        routeErrorSchema: () => {
          throw Error("unexpected schema lookup");
        },
        contractErrorBody: {
          safeParse: () => {
            throw Error("plain-hook error must not reach decoder");
          },
        },
      },
    );
}

test("real loopback reader preserves first-page wire, server total/hasMore and unknown fields", async (t) => {
  const requests = [];
  const payload = {
    mutualFollowers: [],
    hasMore: true,
    totalCount: 23,
    extra: "controlled",
  };
  const origin = await serverFor(t, (req, res) => {
    requests.push({
      url: req.url,
      cookie: req.headers.cookie,
      auth: req.headers.authorization,
    });
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(payload));
  });
  const trace = [];
  const options = mutualFollowersQueryOptions(
    localTransport(origin, trace),
    { profileId: "a/b ?" },
    "cache-viewer",
  );
  assert.deepEqual(await options.queryFn({}), payload);
  assert.equal(trace[0].request.credentials, "include");
  assert.deepEqual(requests, [
    {
      url: "/users/a%2Fb%20%3F/mutual-followers?limit=5&offset=0",
      cookie: undefined,
      auth: undefined,
    },
  ]);
});

test("real non-OK response becomes plain hook Error, not ContractError or invalid-JSON error", async (t) => {
  const origin = await serverFor(t, (_req, res) => {
    res.writeHead(503);
    res.end("{invalid json");
  });
  await assert.rejects(
    mutualFollowersQueryOptions(
      localTransport(origin),
      { profileId: "p" },
      "v",
    ).queryFn({}),
    (error) =>
      error.message === "Failed to fetch mutual followers: 503" &&
      !(error instanceof ContractError) &&
      !(error instanceof SyntaxError),
  );
});

test("real pending loopback fetch forwards cancellation and retains the caller reason", async (t) => {
  let started;
  const received = new Promise((resolve) => {
    started = resolve;
  });
  const origin = await serverFor(t, (_req, _res) => started());
  const controller = new AbortController();
  const reason = new Error("controlled cancellation");
  const pending = mutualFollowersQueryOptions(
    localTransport(origin),
    { profileId: "p" },
    "v",
  ).queryFn({ signal: controller.signal });
  await received;
  controller.abort(reason);
  await assert.rejects(pending, (error) => error === reason);
});
