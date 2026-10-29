import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const root = new URL("../../../", import.meta.url);
const hash = (value: string | Buffer) =>
  createHash("sha256").update(value).digest("hex");

test("the documented API-host batch operation binds the complete physical captured contract", () => {
  const path = "evidence/web/objects/2b47dd0b38a1608f.js";
  const expected =
    "e78d2f38b06f971847c18dd05457c75afc85208135f50d6e4022a5f197e8839d";
  const bytes = readFileSync(new URL(path, root));
  assert.equal(bytes.length, 507700);
  assert.equal(hash(bytes), expected);
  const source = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  const factory = source.slice(316171, 331650);
  assert.equal(
    hash(factory),
    "6a7a4b49fb31f0fa88c3201071ba62759646dfe5674f966e2c47b104b0529ccb",
  );
  const modules = JSON.parse(
    readFileSync(new URL("recovered/modules.json", root), "utf8"),
  );
  assert.ok(
    modules.modules.some(
      (row: any) =>
        row.ids.includes(593902) &&
        row.sha256 === hash(factory) &&
        row.origins.some(
          (origin: any) =>
            origin.source === path &&
            origin.start === 316171 &&
            origin.end === 331650,
        ),
    ),
  );
  const spec = JSON.parse(
    readFileSync(new URL("contracts/developer.openapi.json", root), "utf8"),
  );
  const operation = spec.paths["/portfolio-summary/balances"].post;
  assert.equal(operation.operationId, "post_portfolio_summary_balances");
  assert.equal(operation["x-api-scope"], "positions.read");
  assert.equal(spec.servers[0].url, "https://api.pump.fun/v1");
  assert.deepEqual(operation.security, [{ bearer: [] }]);
  assert.equal(
    operation.requestBody.content["application/json"].schema.properties.wallets
      .minItems,
    1,
  );
  assert.equal(
    operation.requestBody.content["application/json"].schema.properties.wallets
      .maxItems,
    50,
  );
  assert.ok(
    factory.includes(
      '"POST /portfolio-summary/balances":(0,s.publicRead)("positions.read"',
    ),
  );
  assert.ok(
    factory.includes("Every requested wallet is a key; null = the read failed"),
  );
  assert.ok(
    factory.includes("ignored for every other wallet, and on the API host"),
  );
  assert.ok(factory.includes("so always null on the API host"));
  const bindings = JSON.parse(
    readFileSync(new URL("contracts/developer-bindings.json", root), "utf8"),
  );
  const bound = bindings.bindings.find(
    (row: any) => row.operation === "POST /portfolio-summary/balances",
  );
  assert.equal(bound.origin.declared, spec.servers[0].url);
  assert.equal(bound.origin.websiteCallOrigin, "unresolved");
  assert.equal(bound.evidence.contract.sha256, expected);
  assert.deepEqual(
    [bound.evidence.contract.start, bound.evidence.contract.end],
    [329163, 329231],
  );
  assert.deepEqual(bound.evidence.clientCallSites, []);
  // Static decoding/slicing/hashing only. No captured code is evaluated.
});
