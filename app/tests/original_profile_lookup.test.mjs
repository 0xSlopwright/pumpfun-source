import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { once } from "node:events";
import {
  userKey,
  userAliases,
  UserFetchError,
  isUserMissing,
  isUserClientError,
  retryUserQuery,
  requireUserResponse,
  fetchUser,
  userExistence,
  userQueryOptions,
} from "../reconstruction/profile-lookup/client.mjs";
import { extractProfileLookup } from "../scripts/original-profile-lookup.mjs";
import { openCorpus, sha256 } from "../scripts/original-contracts/source.mjs";
import { validateDeclared } from "../scripts/original-contracts/validate.mjs";
import {
  ContractError,
  withContractErrorNormalization,
} from "../reconstruction/contract-http-errors/decode.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const artifact = await extractProfileLookup(root);
const corpus = await openCorpus(root);

test("all three registered user-client variants and four actual presentation callers are source-bound", () => {
  assert.equal(artifact.variants.length, 3);
  assert.equal(new Set(artifact.variants.map((x) => x.factory.sha256)).size, 3);
  assert.equal(artifact.consumers.length, 4);
  assert.equal(artifact.cache.viewerPartitioned, false);
  assert.equal(artifact.operation, "GET /users/{id}");
  for (const x of artifact.variants) {
    for (const name of [
      "fetch",
      "responseGuard",
      "error",
      "missing",
      "clientError",
      "retry",
      "existence",
      "callback",
      "policy",
      "key",
      "aliases",
      "config",
    ])
      assert.ok(x.fragments[name]);
    const f = artifact.fragments.find(
      (v) => `${v.source}:${v.utf16.join(":")}` === x.fragments.callback,
    );
    assert.match(f.text, /setQueryData/);
    assert.doesNotMatch(f.text, /signal/);
  }
});

test("artifact is reproducible and every verbatim range and maintained adapter is authenticated", async () => {
  assert.equal(
    await fs.readFile(
      path.join(root, "reconstruction/profile-lookup/contract.json"),
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

test("changed selected capture fails closed before attributing the first client", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "profile-source-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  for (const name of [
    "evidence/web/manifest.json",
    "recovered/modules.json",
    artifact.variants[0].factory.source,
  ]) {
    const target = path.join(dir, name);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(path.join(root, name), target);
  }
  const target = path.join(dir, artifact.variants[0].factory.source);
  const b = await fs.readFile(target);
  b[17000] ^= 1;
  await fs.writeFile(target, b);
  await assert.rejects(
    extractProfileLookup(dir),
    /capture authentication failed/,
  );
});

test("typed error default reasons, names and optional status retain the captured distinctions", () => {
  for (const [input, reason] of [
    [undefined, "unknown"],
    [{ status: 404 }, "not_found"],
    [{ status: 403 }, "http_error"],
    [{ status: null }, "http_error"],
    [{ reason: "empty_body", status: 404 }, "empty_body"],
    [{ reason: "" }, ""],
  ]) {
    const error = new UserFetchError(input);
    assert.ok(error instanceof Error);
    assert.equal(error.name, "UserFetchError");
    assert.equal(error.message, "Failed to fetch user");
    assert.equal(error.reason, reason);
    assert.equal(error.status, input?.status);
    assert.equal(Object.hasOwn(error, "response"), false);
    assert.equal(Object.hasOwn(error, "cause"), false);
  }
  assert.equal(isUserMissing({ reason: "not_found" }), false);
  assert.equal(
    isUserMissing(new UserFetchError({ status: 404, reason: "other" })),
    false,
  );
  assert.equal(
    isUserMissing(new UserFetchError({ reason: "not_found" })),
    true,
  );
});

test("retry stops only typed 4xx failures, retains exact failureCount<3 and comparison coercion", () => {
  for (const status of [400, 401, 404, 499]) {
    const error = new UserFetchError({ status });
    assert.equal(isUserClientError(error), true);
    for (const count of [0, 1, 2, 3])
      assert.equal(retryUserQuery(count, error), false);
  }
  for (const error of [
    new UserFetchError({ status: 500 }),
    new UserFetchError({ reason: "empty_body" }),
    Error("network"),
    { status: 404 },
  ])
    for (const count of [0, 1, 2, 3, 4])
      assert.equal(retryUserQuery(count, error), count < 3);
  assert.equal(isUserClientError(new UserFetchError({ status: "404" })), true);
  assert.equal(retryUserQuery("2", Error()), true);
});

test("direct fetch overrides params, credentials fallback, retry and hooks but forwards other fetch options", async () => {
  const input = {
    userIdentifier: undefined,
    clientServerUrl: "https://example.invalid/explicit",
    fetchOptions: {
      params: { id: "asserted-other" },
      credentials: null,
      retry: 99,
      hooks: {
        afterResponse: [
          () => {
            throw Error("replaced");
          },
        ],
      },
      headers: { "x-test": "yes" },
      signal: new AbortController().signal,
    },
  };
  const seen = [];
  const raw = { fieldNotDeclaredInUserDTO: true };
  const ctor =
    (config) =>
    async (...args) => {
      seen.push([config, ...args]);
      return raw;
    };
  assert.equal(await fetchUser(ctor, input), raw);
  const [config, operation, options] = seen[0];
  assert.deepEqual(config, { clientServerUrl: input.clientServerUrl });
  assert.equal(operation, "GET /users/{id}");
  assert.deepEqual(options.params, { id: undefined });
  assert.equal(options.credentials, "same-origin");
  assert.equal(options.retry, 0);
  assert.deepEqual(options.hooks, { afterResponse: [requireUserResponse] });
  assert.equal(options.headers, input.fetchOptions.headers);
  assert.equal(options.signal, input.fetchOptions.signal);
  assert.equal(input.fetchOptions.retry, 99);
  for (const credentials of ["include", "omit", ""]) {
    await fetchUser(ctor, {
      userIdentifier: "id",
      fetchOptions: { credentials },
    });
    assert.equal(seen.at(-1)[2].credentials, credentials);
  }
});

test("SyntaxError is converted while other failures retain exact identity", async () => {
  for (const error of [
    new SyntaxError("bad JSON"),
    new UserFetchError({ status: 404 }),
    Error("network"),
    { external: "failure" },
  ]) {
    await assert.rejects(
      fetchUser(
        () => async () => {
          throw error;
        },
        {},
      ),
      (got) => {
        if (error instanceof SyntaxError)
          return (
            got instanceof UserFetchError &&
            got.reason === "invalid_json" &&
            got.status === undefined
          );
        return got === error;
      },
    );
  }
  await assert.rejects(
    fetchUser(() => {
      throw new SyntaxError("constructor");
    }, {}),
    (got) => got instanceof UserFetchError && got.reason === "invalid_json",
  );
});

test("existence is a three-state projection of the typed failure, not a boolean or DTO check", async () => {
  const input = { userIdentifier: "id" };
  assert.equal(await userExistence(() => async () => null, input), "exists");
  assert.equal(await userExistence(() => async () => ({}), input), "exists");
  for (const error of [
    new UserFetchError({ status: 404 }),
    new UserFetchError({ reason: "not_found" }),
  ])
    assert.equal(
      await userExistence(
        () => async () => {
          throw error;
        },
        input,
      ),
      "missing",
    );
  for (const error of [
    new UserFetchError({ status: 401 }),
    new SyntaxError(),
    Error(),
    { status: 404 },
  ])
    assert.equal(
      await userExistence(
        () => async () => {
          throw error;
        },
        input,
      ),
      "unknown",
    );
});

test("native Response clone check preserves the original JSON body and rejects blank success bodies", async () => {
  const response = new Response('{"username":"alice"}');
  await requireUserResponse(null, null, response);
  assert.equal(response.bodyUsed, false);
  assert.deepEqual(await response.json(), { username: "alice" });
  for (const body of ["", " \n\t\u00a0"])
    await assert.rejects(
      requireUserResponse(null, null, new Response(body)),
      (e) =>
        e instanceof UserFetchError &&
        e.reason === "empty_body" &&
        e.status === undefined,
    );
  // An unsuccessful response must not read its body before the status error.
  await assert.rejects(
    requireUserResponse(null, null, {
      ok: false,
      status: 404,
      clone() {
        throw Error("must not read");
      },
    }),
    (e) => isUserMissing(e) && e.status === 404,
  );
});

test("alias selection keeps order/duplicates, filters requested and falsy values, suppresses UUID-shaped addresses", () => {
  assert.deepEqual(
    userAliases(
      { userId: "id", address: "wallet", username: "name" },
      "wallet",
    ),
    ["id", "name"],
  );
  assert.deepEqual(
    userAliases({ userId: "same", address: "same", username: "same" }, "other"),
    ["same", "same", "same"],
  );
  assert.deepEqual(
    userAliases(
      {
        userId: "id",
        address: "00000000-0000-0000-0000-000000000000",
        username: "name",
      },
      "other",
    ),
    [],
  );
  assert.deepEqual(
    userAliases(
      {
        userId: "id",
        address: "ABCDEFAB-ABCD-ABCD-ABCD-ABCDEFABCDEF",
        username: "name",
      },
      "other",
    ),
    [],
  );
  assert.deepEqual(
    userAliases({ userId: 0, address: "", username: false }, "other"),
    [],
  );
  assert.deepEqual(
    userAliases(
      {
        userId: "id",
        address: " 00000000-0000-0000-0000-000000000000 ",
        username: "name",
      },
      "other",
    ),
    ["id", " 00000000-0000-0000-0000-000000000000 ", "name"],
  );
  assert.throws(() => userAliases(null, "id"), TypeError);
});

test("query defaults retain raw user identifier and no origin/viewer partition", () => {
  assert.deepEqual(userKey(undefined), ["user", undefined]);
  assert.deepEqual(userKey(null), ["user", null]);
  assert.deepEqual(userKey(""), ["user", ""]);
  assert.deepEqual(userKey("MixedCase"), ["user", "MixedCase"]);
  const ctor = () => {
    throw Error("must not run during planning");
  };
  const cache = {};
  for (const [id, enabled, expected] of [
    ["id", undefined, true],
    ["id", null, true],
    ["id", false, false],
    ["", true, false],
    [undefined, true, false],
  ]) {
    const options = userQueryOptions(ctor, cache, {
      userIdentifier: id,
      enabled,
    });
    assert.equal(options.enabled, expected);
    assert.deepEqual(options.queryKey, userKey(id));
    assert.equal(options.refetchOnMount, false);
    assert.equal(options.refetchOnWindowFocus, false);
    assert.equal(options.retry, retryUserQuery);
    assert.equal(Object.hasOwn(options, "staleTime"), false);
  }
  assert.deepEqual(
    userQueryOptions(ctor, cache, {
      userIdentifier: "id",
      clientServerUrl: "A",
    }).queryKey,
    userQueryOptions(ctor, cache, {
      userIdentifier: "id",
      clientServerUrl: "B",
    }).queryKey,
  );
});

test("caller query options override every default, including query function and enablement", async () => {
  const override = {
    enabled: true,
    queryKey: ["override"],
    retry: 9,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    queryFn: async () => "override",
    staleTime: 300000,
  };
  const options = userQueryOptions(
    () => {
      throw Error("original query must not execute");
    },
    {},
    { userIdentifier: "", enabled: false, queryOptions: override },
  );
  for (const [key, value] of Object.entries(override))
    assert.equal(options[key], value);
  assert.equal(await options.queryFn(), "override");
});

test("query callback snapshots URL/id, drops runtime signal and warms only nullish aliases", async () => {
  const user = { userId: "id", address: "wallet", username: "name" };
  const input = {
    userIdentifier: "requested",
    clientServerUrl: "https://old.invalid",
  };
  const values = new Map([
    ["id", null],
    ["wallet", undefined],
    ["name", { prior: true }],
  ]);
  const writes = [],
    requests = [];
  const options = userQueryOptions(
    (config) => async (route, request) => {
      requests.push([config, route, request]);
      return user;
    },
    {
      setQueryData(key, update) {
        writes.push(key);
        values.set(key[1], update(values.get(key[1])));
      },
    },
    input,
  );
  input.userIdentifier = "changed";
  input.clientServerUrl = "https://new.invalid";
  const controller = new AbortController();
  controller.abort();
  assert.equal(await options.queryFn({ signal: controller.signal }), user);
  assert.equal(requests[0][0].clientServerUrl, "https://old.invalid");
  assert.deepEqual(requests[0][2].params, { id: "requested" });
  assert.equal(Object.hasOwn(requests[0][2], "signal"), false);
  assert.deepEqual(writes, [
    ["user", "id"],
    ["user", "wallet"],
    ["user", "name"],
  ]);
  assert.equal(values.get("id"), user);
  assert.equal(values.get("wallet"), user);
  assert.deepEqual(values.get("name"), { prior: true });
  for (const existing of [false, 0, ""]) {
    const q = userQueryOptions(
      () => async () => user,
      {
        setQueryData(_key, update) {
          assert.equal(update(existing), existing);
        },
      },
      { userIdentifier: "requested" },
    );
    await q.queryFn();
  }
});

test("failed read never writes aliases; duplicate aliases are not deduplicated; cache failure propagates", async () => {
  const failed = new UserFetchError({ status: 404 });
  const options = userQueryOptions(
    () => async () => {
      throw failed;
    },
    {
      setQueryData() {
        assert.fail("write after failure");
      },
    },
    { userIdentifier: "id" },
  );
  await assert.rejects(options.queryFn(), (e) => e === failed);
  const keys = [];
  await userQueryOptions(
    () => async () => ({ userId: "same", address: "same", username: "same" }),
    {
      setQueryData(key) {
        keys.push(key);
      },
    },
    { userIdentifier: "other" },
  ).queryFn();
  assert.equal(keys.length, 3);
  const cacheError = Error("cache failed");
  await assert.rejects(
    userQueryOptions(
      () => async () => ({ userId: "id" }),
      {
        setQueryData() {
          throw cacheError;
        },
      },
      { userIdentifier: "other" },
    ).queryFn(),
    (e) => e === cacheError,
  );
  await assert.rejects(
    userQueryOptions(
      () => async () => null,
      {},
      { userIdentifier: "other" },
    ).queryFn(),
    TypeError,
  );
});

// Test-only HTTP capability: exercises the maintained adapter over real TCP,
// native fetch/Response and the prior error decoder. It is not captured Ky.
function loopbackClient(observations) {
  return ({ clientServerUrl }) =>
    async (operation, options) =>
      withContractErrorNormalization(
        operation,
        async () => {
          assert.equal(operation, "GET /users/{id}");
          const { params, retry, hooks, ...fetchOptions } = options;
          assert.equal(retry, 0);
          const url = `${clientServerUrl}/users/${encodeURIComponent(String(params.id))}`;
          observations.push({ url, ...options });
          const request = new Request(url, { ...fetchOptions, method: "GET" });
          const response = await fetch(request);
          for (const hook of hooks.afterResponse)
            await hook(request, options, response);
          if (!response.ok)
            throw Object.assign(Error("unhandled HTTP error"), { response });
          return response.json();
        },
        {
          contracts: {},
          routeErrorSchema: () => undefined,
          contractErrorBody: { safeParse: () => ({ success: false }) },
        },
      );
}
async function httpFixture(t, handler) {
  const server = createServer(handler);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  return `http://127.0.0.1:${server.address().port}`;
}

test("real HTTP: encoded identifier, raw success and alias hydration; clone leaves JSON consumable", async (t) => {
  const user = {
    userId: "public-id",
    address: "wallet",
    username: "alice",
    outsideDTO: true,
  };
  const paths = [],
    observations = [],
    cache = new Map();
  const clientServerUrl = await httpFixture(t, (req, res) => {
    paths.push(req.url);
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(user));
  });
  const q = userQueryOptions(
    loopbackClient(observations),
    {
      setQueryData(key, update) {
        cache.set(key[1], update(cache.get(key[1])));
      },
    },
    { clientServerUrl, userIdentifier: "alice/slash ?" },
  );
  assert.deepEqual(await q.queryFn(), user);
  assert.deepEqual(paths, ["/users/alice%2Fslash%20%3F"]);
  assert.deepEqual([...cache.keys()], ["public-id", "wallet", "alice"]);
  assert.equal(observations[0].credentials, "same-origin");
  assert.equal(observations[0].signal, undefined);
});

test("real HTTP: typed non-OK beats invalid JSON; blank, invalid JSON and null remain distinct", async (t) => {
  const observations = [],
    requests = [];
  const cases = {
    missing: [404, "not-json", "not_found", 404, "missing"],
    denied: [403, "not-json", "http_error", 403, "unknown"],
    unavailable: [503, "not-json", "http_error", 503, "unknown"],
    blank: [200, " \n\t", "empty_body", undefined, "unknown"],
    empty204: [204, "", "empty_body", undefined, "unknown"],
    invalid: [200, "not-json", "invalid_json", undefined, "unknown"],
  };
  const clientServerUrl = await httpFixture(t, (req, res) => {
    requests.push(req.url);
    const [status, body] = cases[req.url.split("/").at(-1)] ?? [200, "null"];
    res.writeHead(status, { "content-type": "application/json" });
    res.end(body);
  });
  const ctor = loopbackClient(observations);
  for (const [
    userIdentifier,
    [, , reason, status, existence],
  ] of Object.entries(cases)) {
    const input = { clientServerUrl, userIdentifier };
    await assert.rejects(
      fetchUser(ctor, input),
      (e) =>
        e instanceof UserFetchError &&
        !(e instanceof ContractError) &&
        e.reason === reason &&
        e.status === status,
    );
    assert.equal(await userExistence(ctor, input), existence);
  }
  assert.equal(
    await fetchUser(ctor, { clientServerUrl, userIdentifier: "null" }),
    null,
  );
  assert.equal(
    await userExistence(ctor, { clientServerUrl, userIdentifier: "null" }),
    "exists",
  );
  assert.equal(requests.length, 14);
});

test("real HTTP: direct fetch forwards cancellation and explicit credentials, query callback has no implicit cancellation", async (t) => {
  let notify;
  const reached = new Promise((resolve) => {
    notify = resolve;
  });
  const observations = [];
  const clientServerUrl = await httpFixture(t, (_req, _res) => notify());
  const controller = new AbortController(),
    reason = Error("operator cancelled local test");
  const pending = fetchUser(loopbackClient(observations), {
    clientServerUrl,
    userIdentifier: "slow",
    fetchOptions: { signal: controller.signal, credentials: "omit" },
  });
  const rejection = assert.rejects(pending, (e) => e === reason);
  await reached;
  controller.abort(reason);
  await rejection;
  assert.equal(observations[0].signal, controller.signal);
  assert.equal(observations[0].credentials, "omit");
});

test("declared params/user DTO are retained as declarations rather than runtime parsing", async () => {
  const doc = artifact.declarations,
    route = doc["x-profile-lookup"];
  assert.equal(route.scope, "profiles.read");
  assert.equal(validateDeclared(doc, route.params, { id: "" }).success, true);
  assert.equal(validateDeclared(doc, route.params, { id: 1 }).success, false);
  assert.equal(
    validateDeclared(doc, route.response, { outsideDTO: true }).success,
    false,
  );
  const raw = { outsideDTO: true };
  assert.equal(
    await fetchUser(() => async () => raw, { userIdentifier: "id" }),
    raw,
  );
});
