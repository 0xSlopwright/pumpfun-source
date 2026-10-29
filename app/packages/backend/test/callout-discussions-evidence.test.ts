import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const root = new URL("../../../", import.meta.url);
const hash = (value: string | Buffer) =>
  createHash("sha256").update(value).digest("hex");
const contractPath = "evidence/web/objects/2b47dd0b38a1608f.js",
  clientPath = "evidence/web/objects/84bc29ea82bc5a21.js";
test("discussion contract and DTO retain complete-object and exact UTF-16 provenance", () => {
  const bytes = readFileSync(new URL(contractPath, root));
  assert.equal(bytes.length, 507700);
  assert.equal(
    hash(bytes),
    "e78d2f38b06f971847c18dd05457c75afc85208135f50d6e4022a5f197e8839d",
  );
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  assert.equal(
    hash(text.slice(53841, 88580)),
    "9bf6001fe60fa67d0d941c7cac3f6d8b1b5eda390213e998bb00867c3ea0ba93",
  );
  assert.equal(
    hash(text.slice(434218, 446195)),
    "9e63d9f98b410e0c7334bd1c07e7ea72f9bd1b95710ea69dae45e4c253b0368a",
  );
  assert.equal(
    text.slice(83087, 83153),
    '"GET /callout/{calloutId}/replies":(0,s.publicRead)("content.read"',
  );
  assert.equal(
    text.slice(80661, 80731),
    '"GET /callout/replies/{replyId}/chain":(0,s.publicRead)("content.read"',
  );
  assert.ok(
    text
      .slice(53841, 88580)
      .includes(
        "Hydrate up to N newest preview children per row; cc caps at 10",
      ),
  );
  assert.ok(
    text
      .slice(434218, 446195)
      .includes(
        "Placeholder for a deleted/hidden reply — only id, linkage and counts are set",
      ),
  );
  assert.ok(
    text
      .slice(434218, 446195)
      .includes("The callout author's earliest live direct child"),
  );
});
test("captured reply reader is hashed only; its excluded coin-community UI is not implemented", () => {
  const bytes = readFileSync(new URL(clientPath, root));
  assert.equal(bytes.length, 30850);
  assert.equal(
    hash(bytes),
    "e43cd74332acc827da95e824c3d2c1cf01392c42a17d8ae19ebfe41c3bd7d163",
  );
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  assert.equal(
    hash(text.slice(24052, 26508)),
    "c59bcb8e29907440b02c9f1e0f99d041a685fc9c97a40219bd8eae802615fd64",
  );
  assert.equal(text.slice(24917, 24951), '"GET /callout/{calloutId}/replies"');
  assert.ok(
    text
      .slice(24052, 26508)
      .includes(
        'query:{limit:200,filter:"all"===l?"ALL":"AUTHOR_ONLY",parentReplyId:a||void 0}',
      ),
  );
  const manifest = JSON.parse(
    readFileSync(new URL("evidence/web/manifest.json", root), "utf8"),
  );
  const record = manifest.records.find(
    (row: { path: string }) => row.path === clientPath,
  );
  assert.equal(
    record.url,
    "https://pump.fun/_next/static/immutable/chunks/39qv0xx4r245r.js",
  );
  assert.equal(record.sha256, hash(bytes));
  assert.equal(record.bytes, bytes.length);
  // Captured JavaScript is never imported, evaluated or run in a VM.
});
test("discussion operations remain partial and unqualified in authoritative ledgers", () => {
  const spec = JSON.parse(
    readFileSync(new URL("contracts/developer.openapi.json", root), "utf8"),
  );
  const bindings = JSON.parse(
    readFileSync(new URL("contracts/developer-bindings.json", root), "utf8"),
  );
  const coverage = JSON.parse(
    readFileSync(new URL("contracts/coverage.json", root), "utf8"),
  );
  assert.equal(spec.info.version, "0.294.0");
  for (const path of [
    "/callout/{calloutId}/replies",
    "/callout/replies/{replyId}/chain",
  ]) {
    const binding = bindings.bindings.find(
      (row: { operation: string }) => row.operation === "GET " + path,
    );
    assert.equal(binding.scope, "content.read");
    assert.equal(binding.productScope, "included");
    assert.equal(binding.implemented, false);
    assert.equal(binding.qualified, false);
    assert.ok(
      coverage.localReadModels.calloutDiscussions.operations.includes(
        "GET " + path,
      ),
    );
  }
  assert.equal(coverage.developerApi.implementedNatively, 0);
  assert.equal(coverage.developerApi.qualified, 0);
  assert.equal(
    coverage.localReadModels.calloutDiscussions.defaultEnabled,
    false,
  );
  assert.equal(coverage.localReadModels.calloutDiscussions.qualified, false);
});
