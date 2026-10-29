import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import http from "node:http";
import { once } from "node:events";
import {
  ContractError,
  domainCode,
  isContractError,
  normalizeContractHttpError,
  withContractErrorNormalization,
} from "../reconstruction/contract-http-errors/decode.mjs";

const route = "GET /users/{address}";
// Controlled parser results test the decoder boundary; these are not a Zod
// implementation or a production-response acceptance claim.
function parsers({
  declared = { success: false },
  generic = { success: false },
  known = true,
} = {}) {
  const calls = [];
  const contract = {};
  return {
    calls,
    contracts: known ? { [route]: contract } : {},
    routeErrorSchema(value, status) {
      calls.push(["schema", value, status]);
      assert.equal(value, contract);
      return {
        safeParse(body) {
          calls.push(["declared", body]);
          return declared;
        },
      };
    },
    contractErrorBody: {
      safeParse(body) {
        calls.push(["generic", body]);
        return generic;
      },
    },
  };
}

function httpError(text, status = 401) {
  const response = {
    status,
    reads: 0,
    async text() {
      assert.equal(this, response);
      this.reads++;
      return text;
    },
  };
  return Object.assign(new Error("synthetic HTTP failure"), { response });
}

test("non-HTTP errors keep their original identity through the actual catch wrapper", async () => {
  for (const value of [
    null,
    undefined,
    false,
    "failure",
    new Error("hook"),
    new TypeError("network"),
    new DOMException("aborted", "AbortError"),
    {},
    { response: null },
    { response: { status: "401", text() {} } },
    { response: { status: 401 } },
    { response: () => {} },
  ]) {
    assert.equal(await normalizeContractHttpError(route, value), undefined);
    let caught = Symbol("not caught");
    try {
      await withContractErrorNormalization(route, () => {
        throw value;
      });
    } catch (error) {
      caught = error;
    }
    assert.equal(caught, value);
  }
});

test("JSON objects, scalars, arrays and malformed/empty text retain their raw bodies", async () => {
  for (const [text, expected] of [
    [
      '{"statusCode":401,"message":"denied"}',
      { statusCode: 401, message: "denied" },
    ],
    ["null", null],
    ["42", 42],
    ["false", false],
    ['"text"', "text"],
    ["[1,2]", [1, 2]],
    ["not JSON", "not JSON"],
    ["", ""],
  ]) {
    const error = httpError(text);
    const result = await normalizeContractHttpError(route, error, parsers());
    assert.ok(result instanceof ContractError);
    assert.deepEqual(result.body, expected);
    assert.deepEqual(result.data, { statusCode: 401 });
    assert.equal(result.cause, error);
    assert.equal(error.response.reads, 1);
  }
});

test("route data wins, but the generic parser still runs; raw body is independent", async () => {
  const declaredData = { declared: true };
  const genericData = { generic: true };
  const dependencies = parsers({
    declared: { success: true, data: declaredData },
    generic: { success: true, data: genericData },
  });
  const result = await normalizeContractHttpError(
    route,
    httpError('{"message":"raw"}'),
    dependencies,
  );
  assert.equal(result.data, declaredData);
  assert.deepEqual(result.body, { message: "raw" });
  assert.deepEqual(
    dependencies.calls.map(([kind]) => kind),
    ["schema", "declared", "generic"],
  );
  assert.equal(dependencies.calls[1][1], result.body);
  assert.equal(dependencies.calls[2][1], result.body);
  assert.equal(result.serverMessage, "raw");
});

test("generic data is the second fallback and an unknown route skips only its resolver", async () => {
  for (const known of [true, false]) {
    const data = { generic: true };
    const dependencies = parsers({ known, generic: { success: true, data } });
    const result = await normalizeContractHttpError(
      route,
      httpError("{}"),
      dependencies,
    );
    assert.equal(result.data, data);
    assert.deepEqual(
      dependencies.calls.map(([kind]) => kind),
      known ? ["schema", "declared", "generic"] : ["generic"],
    );
  }
});

test("true, false and absent declared schemas are not invoked", async () => {
  for (const schema of [true, false, undefined, null]) {
    const dependencies = parsers();
    dependencies.routeErrorSchema = () => schema;
    const result = await normalizeContractHttpError(
      route,
      httpError("{}"),
      dependencies,
    );
    assert.deepEqual(result.data, { statusCode: 401 });
    assert.deepEqual(
      dependencies.calls.map(([kind]) => kind),
      ["generic"],
    );
  }
});

test("server message uses raw string or string-only array joining regardless of schema success", async () => {
  for (const [message, expected] of [
    ["denied", "denied"],
    [["a", 1, null, "b", false], "a; b"],
    [[], ""],
    [[1, false], ""],
    [null, undefined],
    [5, undefined],
    [{ value: "x" }, undefined],
  ]) {
    const result = await normalizeContractHttpError(
      route,
      httpError(JSON.stringify({ message })),
      parsers(),
    );
    assert.equal(result.serverMessage, expected);
    assert.deepEqual(result.data, { statusCode: 401 });
  }
});

test("body-read failures become an undefined raw body, including an already consumed Response", async () => {
  const consumed = new Response("body", { status: 401 });
  await consumed.text();
  for (const response of [
    consumed,
    {
      status: 401,
      async text() {
        throw new DOMException("aborted", "AbortError");
      },
    },
  ]) {
    const cause = Object.assign(new Error("HTTP"), { response });
    const result = await normalizeContractHttpError(route, cause, parsers());
    assert.equal(result.body, undefined);
    assert.equal(result.serverMessage, undefined);
    assert.equal(result.cause, cause);
    assert.deepEqual(result.data, { statusCode: 401 });
  }
});

test("schema and accessor exceptions retain their observed propagation boundary", async () => {
  const failure = new Error("parser failure");
  for (const patch of [
    {
      routeErrorSchema() {
        throw failure;
      },
    },
    {
      routeErrorSchema() {
        return {
          safeParse() {
            throw failure;
          },
        };
      },
    },
    {
      contractErrorBody: {
        safeParse() {
          throw failure;
        },
      },
    },
  ]) {
    await assert.rejects(
      normalizeContractHttpError(route, httpError("{}"), {
        ...parsers({ declared: { success: true, data: {} } }),
        ...patch,
      }),
      (error) => error === failure,
    );
  }
  await assert.rejects(
    normalizeContractHttpError(
      route,
      {
        get response() {
          throw failure;
        },
      },
      parsers(),
    ),
    (error) => error === failure,
  );
});

test("status reads preserve validation, schema, constructor and fallback evaluation order", async () => {
  let count = 400;
  const response = {
    get status() {
      return ++count;
    },
    async text() {
      return "{}";
    },
  };
  const dependencies = parsers();
  const result = await normalizeContractHttpError(
    route,
    { response },
    dependencies,
  );
  assert.equal(dependencies.calls[0][2], 402);
  assert.equal(result.status, 403);
  assert.deepEqual(result.data, { statusCode: 404 });
  assert.equal(count, 404);
});

test("domain codes use the captured pattern rather than registry membership", () => {
  for (const code of ["API_KEY_REQUIRED", "FUTURE_CODE_901", "AB", "A_"])
    assert.equal(domainCode({ error: code }), code);
  for (const value of [
    null,
    undefined,
    "API_KEY_REQUIRED",
    { error: "A" },
    { error: "Bad Request" },
    { error: "lowercase" },
    { error: "_A" },
    { error: "A-B" },
    { error: 1 },
  ])
    assert.equal(domainCode(value), null);
  const cause = new Error("cause");
  const error = new ContractError(
    route,
    401,
    { error: "FUTURE_CODE_901" },
    {},
    "message",
    cause,
  );
  assert.equal(error.message, `${route} responded 401 FUTURE_CODE_901`);
  assert.equal(error.name, "ContractError");
  assert.equal(error.code, "FUTURE_CODE_901");
  assert.equal(error.cause, cause);
  assert.equal(error.is(401), true);
  assert.equal(error.is("401"), false);
  assert.equal(isContractError(error), true);
  assert.equal(isContractError(error, route), true);
  assert.equal(isContractError(error, "GET /other"), false);
  assert.equal(isContractError({ name: "ContractError", route }), false);
  let reads = 0;
  const changing = new ContractError(route, 401, {
    get error() {
      return ++reads === 1 ? "FIRST_CODE" : "SECOND_CODE";
    },
  });
  assert.equal(changing.message, `${route} responded 401 FIRST_CODE`);
  assert.equal(changing.code, "SECOND_CODE");
  assert.equal(reads, 2);
});

test("the request wrapper returns successful values and normalizes synchronous HTTP throws", async () => {
  const value = { success: true };
  assert.equal(
    await withContractErrorNormalization(route, () => value, parsers()),
    value,
  );
  const cause = httpError('{"error":"API_KEY_REQUIRED"}');
  await assert.rejects(
    withContractErrorNormalization(
      route,
      () => {
        throw cause;
      },
      parsers(),
    ),
    (error) =>
      error instanceof ContractError &&
      error.cause === cause &&
      error.code === "API_KEY_REQUIRED",
  );
});

test("an existing captured public 401 body retains observed code/message/body fields", async () => {
  const raw = await readFile(
    new URL("../evidence/web/objects/1837f7894abd389a", import.meta.url),
  );
  assert.equal(raw.length, 173);
  assert.equal(
    createHash("sha256").update(raw).digest("hex"),
    "4e76f9c8e01de54c5661ea45d451c88db8959e46fa621a221f66e01ee93cf915",
  );
  const body = JSON.parse(raw);
  const cause = { response: new Response(raw, { status: 401 }) };
  const result = await normalizeContractHttpError(route, cause, parsers());
  assert.equal(result.code, "API_KEY_REQUIRED");
  assert.equal(result.serverMessage, body.message);
  assert.deepEqual(result.body, body);
  // Parser failure is intentional in this test; the decoder's raw-body path is
  // exercised without claiming an independently reconstructed Zod acceptance.
  assert.deepEqual(result.data, { statusCode: 401 });
});

test("a real local HTTP response passes through body decoding and the catch adapter", async (t) => {
  const server = http.createServer((_request, response) => {
    response.writeHead(429, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({ error: "FUTURE_LIMIT", message: ["wait", "later"] }),
    );
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    server.closeAllConnections();
    return new Promise((resolve) => server.close(resolve));
  });
  const request = async () => {
    const response = await fetch(`http://127.0.0.1:${server.address().port}`);
    throw Object.assign(new Error("synthetic transport HTTP wrapper"), {
      response,
    });
  };
  await assert.rejects(
    withContractErrorNormalization(route, request, parsers()),
    (error) =>
      error instanceof ContractError &&
      error.status === 429 &&
      error.code === "FUTURE_LIMIT" &&
      error.serverMessage === "wait; later" &&
      error.cause.response instanceof Response,
  );
});
