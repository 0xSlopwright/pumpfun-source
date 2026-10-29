import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { once } from "node:events";
import {
  USER_BATCH_LIMIT,
  parseUserBatchText,
  requireUserBatchResponse,
  fetchUsersBatch,
} from "../reconstruction/user-batch/client.mjs";
import {
  UserFetchError,
  isUserMissing,
  isUserClientError,
} from "../reconstruction/profile-lookup/client.mjs";
import { extractUserBatch } from "../scripts/original-user-batch.mjs";
import { openCorpus, sha256 } from "../scripts/original-contracts/source.mjs";
import { validateDeclared } from "../scripts/original-contracts/validate.mjs";
import {
  ContractError,
  withContractErrorNormalization,
} from "../reconstruction/contract-http-errors/decode.mjs";
const root = fileURLToPath(new URL("..", import.meta.url)),
  artifact = await extractUserBatch(root),
  corpus = await openCorpus(root);

test("actual strict544930 module and all eight caller origins bind independently of the lax782067 resolver", () => {
  assert.equal(artifact.entry.module, 544930);
  assert.equal(artifact.consumers.length, 8);
  assert.equal(
    new Set(
      artifact.consumers
        .filter((x) => x.module === 576766)
        .map((x) => x.factory.sha256),
    ).size,
    6,
  );
  assert.equal(
    artifact.prerequisite.publicHead,
    "e46c14ea3857da7ef6eecc9f7945622f5dbcfc39",
  );
  assert.equal(artifact.prerequisite.novelCredit, false);
  assert.equal(
    artifact.factories.some((x) => x.id === 782067),
    false,
  );
});

test("source/adapter/dependency hashes and every original range reproduce", async () => {
  assert.equal(
    await fs.readFile(
      path.join(root, "reconstruction/user-batch/contract.json"),
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

test("changed original strict batch capture fails authentication", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "strict-batch-"));
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
  bytes[100] ^= 1;
  await fs.writeFile(target, bytes);
  await assert.rejects(extractUserBatch(dir), /capture authentication failed/);
});

test("strict parser accepts bare/wrapped arrays without row validation and distinguishes all malformed shapes", () => {
  assert.deepEqual(parseUserBatchText('[null,4,{"unknown":true}]'), [
    null,
    4,
    { unknown: true },
  ]);
  assert.deepEqual(
    parseUserBatchText('{"users":[{"address":"a"}],"extra":true}'),
    [{ address: "a" }],
  );
  for (const [text, reason] of [
    ["", "empty_body"],
    [" \uFEFF\n", "empty_body"],
    ["not JSON", "invalid_json"],
    ["null", "invalid_shape"],
    ["false", "invalid_shape"],
    ["{}", "invalid_shape"],
    ['{"users":{}}', "invalid_shape"],
  ])
    assert.throws(
      () => parseUserBatchText(text),
      (e) =>
        e instanceof UserFetchError &&
        e.reason === reason &&
        e.status === undefined,
    );
  assert.throws(() => parseUserBatchText(null), TypeError);
});

test("status failures share870 error identity but404 is http_error, not the single-user not_found classification", async () => {
  await assert.rejects(
    requireUserBatchResponse(
      null,
      null,
      new Response("not JSON", { status: 404 }),
    ),
    (e) =>
      e instanceof UserFetchError &&
      e.reason === "http_error" &&
      e.status === 404 &&
      isUserClientError(e) &&
      !isUserMissing(e) &&
      !Object.hasOwn(e, "response"),
  );
  const response = new Response("[]");
  await requireUserBatchResponse(null, null, response);
  assert.equal(response.bodyUsed, false);
  assert.deepEqual(await response.json(), []);
  await assert.rejects(
    requireUserBatchResponse(null, null, new Response(" \n")),
    (e) => e instanceof UserFetchError && e.reason === "empty_body",
  );
});

test("<=100 including empty arrays issues one read, preserves duplicates/input reference and caller option precedence", async () => {
  const seen = [],
    addresses = ["same", "same"],
    signal = new AbortController().signal;
  const fetchOptions = {
    body: { addresses: ["override"] },
    headers: { "x-caller": "yes" },
    credentials: "omit",
    signal,
    retry: 9,
    throwHttpErrors: true,
    parseJson() {
      assert.fail("caller parser replaced");
    },
    hooks: { afterResponse: [() => assert.fail("caller hook replaced")] },
  };
  const transport = async (...args) => {
    seen.push(args);
    return [];
  };
  await fetchUsersBatch(transport, { userAddresses: addresses });
  assert.equal(seen[0][1].body.addresses, addresses);
  assert.deepEqual(seen[0][1].headers, { "Content-Type": "application/json" });
  await fetchUsersBatch(transport, { userAddresses: addresses, fetchOptions });
  const [operation, opts] = seen[1];
  assert.equal(operation, "POST /users/batch");
  assert.equal(opts.body, fetchOptions.body);
  assert.equal(opts.headers, fetchOptions.headers);
  assert.equal(opts.signal, signal);
  assert.equal(opts.credentials, "omit");
  assert.equal(opts.retry, 9);
  assert.equal(opts.throwHttpErrors, false);
  assert.equal(opts.parseJson, parseUserBatchText);
  assert.deepEqual(opts.hooks, { afterResponse: [requireUserBatchResponse] });
  await fetchUsersBatch(transport, { userAddresses: [] });
  assert.deepEqual(seen[2][1].body.addresses, []);
  assert.equal(Object.hasOwn(seen[0][1], "credentials"), false);
  assert.equal(USER_BATCH_LIMIT, 100);
});

test("large input starts all100-sized chunks immediately and returns chunk order despite out-of-order completion", async () => {
  const input = Array.from({ length: 205 }, (_, i) => `a${i}`),
    calls = [],
    finish = [];
  input[100] = input[0];
  const pending = fetchUsersBatch(
    async (_op, opts) => {
      calls.push(opts);
      return new Promise((resolve) => finish.push(resolve));
    },
    { userAddresses: input },
  );
  assert.deepEqual(
    calls.map((x) => x.body.addresses.length),
    [100, 100, 5],
  );
  assert.deepEqual(
    calls.flatMap((x) => x.body.addresses),
    input,
  );
  finish[2](["third"]);
  finish[1](["second"]);
  finish[0](["first"]);
  assert.deepEqual(await pending, ["first", "second", "third"]);
});

test("chunk rejection preserves identity without inventing sibling cancellation", async () => {
  const reason = Error("one chunk failed"),
    calls = [],
    controllers = [];
  const input = Array.from({ length: 101 }, (_, i) => `a${i}`);
  const pending = fetchUsersBatch(
    (_op, opts) => {
      calls.push(opts);
      return new Promise((resolve, reject) =>
        controllers.push({ resolve, reject }),
      );
    },
    { userAddresses: input },
  );
  const check = assert.rejects(pending, (e) => e === reason);
  controllers[0].reject(reason);
  await check;
  assert.equal(calls.length, 2);
  assert.equal(Object.hasOwn(calls[1], "signal"), false);
  controllers[1].resolve([]);
});

// Test-only j-shaped capability: native loopback HTTP plus the captured hook and
// parseJson ordering. It is not the Ky runtime or a production transport.
function loopbackTransport(origin, seen) {
  return async (operation, opts) =>
    withContractErrorNormalization(
      operation,
      async () => {
        assert.equal(operation, "POST /users/batch");
        seen.push(opts);
        const request = new Request(`${origin}/users/batch`, {
          method: "POST",
          headers: opts.headers,
          body: JSON.stringify(opts.body),
          signal: opts.signal,
          credentials: opts.credentials,
        });
        const response = await fetch(request);
        for (const hook of opts.hooks.afterResponse)
          await hook(request, opts, response);
        return opts.parseJson(await response.text());
      },
      {
        contracts: {},
        routeErrorSchema: () => undefined,
        contractErrorBody: { safeParse: () => ({ success: false }) },
      },
    );
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
  let value = "";
  for await (const part of req) value += part;
  return JSON.parse(value);
}

test("real HTTP:205 addresses arrive in three concurrent POST reads and flatten original chunk order; empty array is sent", async (t) => {
  const requests = [],
    seen = [];
  let completed = 0;
  const origin = await serverFor(t, async (req, res) => {
    assert.equal(req.method, "POST");
    assert.equal(req.url, "/users/batch");
    const body = await bodyOf(req);
    requests.push({ req, res, body });
    if (body.addresses.length === 0) {
      res.end("[]");
      return;
    }
    if (++completed === 3)
      for (const { res, body } of [...requests].reverse())
        res.end(
          JSON.stringify({
            users: body.addresses.map((address) => ({ address })),
          }),
        );
  });
  const addresses = Array.from({ length: 205 }, (_, i) => `addr${i}`);
  addresses[100] = addresses[0];
  const result = await fetchUsersBatch(loopbackTransport(origin, seen), {
    userAddresses: addresses,
  });
  assert.deepEqual(
    result.map((x) => x.address),
    addresses,
  );
  assert.deepEqual(
    requests.map((x) => x.body.addresses.length).sort((a, b) => a - b),
    [5, 100, 100],
  );
  assert.equal(
    requests.every(
      (x) =>
        x.req.headers["content-type"] === "application/json" &&
        x.req.headers.authorization === undefined,
    ),
    true,
  );
  assert.deepEqual(
    await fetchUsersBatch(loopbackTransport(origin, seen), {
      userAddresses: [],
    }),
    [],
  );
  assert.deepEqual(requests.at(-1).body, { addresses: [] });
});

test("real HTTP: status/blank/invalidJSON/invalidShape retain shared typed reasons and bypass ContractError", async (t) => {
  const origin = await serverFor(t, async (req, res) => {
    const id = (await bodyOf(req)).addresses[0];
    const [status, text] = {
      missing: [404, "not JSON"],
      unavailable: [503, "not JSON"],
      blank: [200, " \n"],
      invalid: [200, "not JSON"],
      shape: [200, '{"users":{}}'],
    }[id];
    res.writeHead(status);
    res.end(text);
  });
  const transport = loopbackTransport(origin, []);
  for (const [id, reason, status] of [
    ["missing", "http_error", 404],
    ["unavailable", "http_error", 503],
    ["blank", "empty_body", undefined],
    ["invalid", "invalid_json", undefined],
    ["shape", "invalid_shape", undefined],
  ])
    await assert.rejects(
      fetchUsersBatch(transport, { userAddresses: [id] }),
      (e) =>
        e instanceof UserFetchError &&
        !(e instanceof ContractError) &&
        e.reason === reason &&
        e.status === status,
    );
});

test("real HTTP: explicit fetchOptions signal reaches the request and cancellation preserves exact reason", async (t) => {
  let reached;
  const ready = new Promise((resolve) => {
    reached = resolve;
  });
  const origin = await serverFor(t, async (req) => {
      await bodyOf(req);
      reached();
    }),
    seen = [],
    controller = new AbortController(),
    reason = Error("cancel local batch");
  const pending = assert.rejects(
    fetchUsersBatch(loopbackTransport(origin, seen), {
      userAddresses: ["slow"],
      fetchOptions: { signal: controller.signal, credentials: "omit" },
    }),
    (e) => e === reason,
  );
  await ready;
  controller.abort(reason);
  await pending;
  assert.equal(seen[0].signal, controller.signal);
  assert.equal(seen[0].credentials, "omit");
});

test("declared public read limits each body to100 strings but strict client parser still passes raw row arrays", () => {
  const doc = artifact.declarations,
    route = doc["x-user-batch"];
  assert.equal(route.scope, "profiles.read");
  assert.equal(
    validateDeclared(doc, route.body, { addresses: [] }).success,
    true,
  );
  assert.equal(
    validateDeclared(doc, route.body, { addresses: Array(101).fill("a") })
      .success,
    false,
  );
  assert.equal(
    validateDeclared(doc, route.body, { addresses: [1] }).success,
    false,
  );
  assert.equal(validateDeclared(doc, route.response, [null]).success, false);
  assert.deepEqual(parseUserBatchText("[null]"), [null]);
});
