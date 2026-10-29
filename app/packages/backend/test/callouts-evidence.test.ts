import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
const root = new URL("../../../", import.meta.url);
const hash = (bytes: string | Buffer) =>
  createHash("sha256").update(bytes).digest("hex");
const records = [
  {
    file: "evidence/web/objects/2b47dd0b38a1608f.js",
    bytes: 507700,
    hash: "e78d2f38b06f971847c18dd05457c75afc85208135f50d6e4022a5f197e8839d",
    start: 53841,
    end: 88580,
    factory: "9bf6001fe60fa67d0d941c7cac3f6d8b1b5eda390213e998bb00867c3ea0ba93",
  },
  {
    file: "evidence/web/objects/3740fc4e7a24596d.js",
    bytes: 67649,
    hash: "7400496d0194dea1be93f3640e73b3131f7e18d3e3d14fffb1ed117578795295",
    start: 1201,
    end: 8886,
    factory: "bd59c4bee5702bebd7d5a2b91640d9ed9c3170493c0809861e33f4c926744f3d",
  },
];
for (const record of records)
  test(`callout provenance: complete object and exact UTF-16 factory range ${record.file}`, () => {
    const bytes = readFileSync(new URL(record.file, root));
    assert.equal(bytes.length, record.bytes);
    assert.equal(hash(bytes), record.hash);
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    assert.equal(hash(text.slice(record.start, record.end)), record.factory);
    // Captured JavaScript is decoded, sliced and hashed only; never imported or evaluated.
  });
test("single-callout contract binding and coverage claims remain exact and unqualified", () => {
  const spec = JSON.parse(
    readFileSync(new URL("contracts/developer.openapi.json", root), "utf8"),
  );
  const bindings = JSON.parse(
    readFileSync(new URL("contracts/developer-bindings.json", root), "utf8"),
  );
  const coverage = JSON.parse(
    readFileSync(new URL("contracts/coverage.json", root), "utf8"),
  );
  const operation = "GET /callout/{calloutId}";
  assert.equal(spec.info.version, "0.294.0");
  assert.equal(
    spec.paths["/callout/{calloutId}"].get["x-api-scope"],
    "content.read",
  );
  const binding = bindings.bindings.find(
    (row: { operation: string }) => row.operation === operation,
  );
  assert.equal(binding.scope, "content.read");
  assert.equal(binding.origin.websiteCallOrigin, "unresolved");
  assert.equal(binding.implemented, false);
  assert.equal(binding.qualified, false);
  assert.equal(coverage.developerApi.implementedNatively, 0);
  assert.equal(coverage.developerApi.qualified, 0);
  const text = readFileSync(new URL(records[0].file, root), "utf8");
  assert.equal(
    text.slice(88274, 88332),
    '"GET /callout/{calloutId}":(0,s.publicRead)("content.read"',
  );
  const client = readFileSync(new URL(records[1].file, root), "utf8");
  assert.equal(client.slice(3530, 3556), '"GET /callout/{calloutId}"');
});

test("callout-list binding, client policy and response knowledge are source-bound without qualification", () => {
  const spec = JSON.parse(
    readFileSync(new URL("contracts/developer.openapi.json", root), "utf8"),
  );
  const bindings = JSON.parse(
    readFileSync(new URL("contracts/developer-bindings.json", root), "utf8"),
  );
  const coverage = JSON.parse(
    readFileSync(new URL("contracts/coverage.json", root), "utf8"),
  );
  const operation = "GET /callout/list/{userId}";
  const binding = bindings.bindings.find(
    (row: { operation: string }) => row.operation === operation,
  );
  assert.equal(binding.scope, "content.read");
  assert.equal(binding.origin.websiteCallOrigin, "unresolved");
  assert.equal(binding.implemented, false);
  assert.equal(binding.qualified, false);
  assert.equal(coverage.developerApi.implementedNatively, 0);
  assert.equal(coverage.developerApi.qualified, 0);
  assert.ok(coverage.localReadModels.callouts.operations.includes(operation));
  const contract = readFileSync(new URL(records[0].file, root), "utf8");
  assert.equal(
    contract.slice(74780, 74840),
    '"GET /callout/list/{userId}":(0,s.publicRead)("content.read"',
  );
  const client = readFileSync(new URL(records[1].file, root), "utf8");
  assert.equal(client.slice(3021, 3049), '"GET /callout/list/{userId}"');
  const factory = client.slice(records[1].start, records[1].end);
  assert.ok(
    factory.includes(
      'limit:i=30,sortBy:n="TIMESTAMP",sortOrder:r="DESC",pageToken:l,includeMembers:s=!1,window:o',
    ),
  );
  assert.ok(
    factory.includes(
      "pageToken:l||void 0,includeMembers:s||void 0,window:o||void 0",
    ),
  );
  const route = spec.paths["/callout/list/{userId}"].get;
  assert.equal(route["x-api-scope"], "content.read");
  assert.equal(
    route.parameters.find((p: { name: string }) => p.name === "limit").schema
      .default,
    undefined,
  );
  const response = route.responses[200].content["application/json"].schema;
  assert.deepEqual(response.required, ["callouts", "nextPageToken"]);
  assert.match(
    response.properties.nextPageToken.description,
    /Empty string on the last page/,
  );
  assert.match(
    response.properties.callouts.items.properties.user_uuid.description,
    /always empty on the list read/,
  );
  assert.match(
    response.properties.callouts.description,
    /page on nextPageToken, not on array length/,
  );
});
