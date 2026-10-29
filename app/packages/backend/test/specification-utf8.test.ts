import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildApp, readSpecificationText } from "../src/app.js";

const specPath = fileURLToPath(
  new URL("../../../contracts/developer.openapi.json", import.meta.url),
);

test("specification loader returns the checked-in file text exactly", () => {
  assert.equal(
    readSpecificationText(specPath),
    readFileSync(specPath, "utf8"),
  );
});

test("malformed UTF-8 in the specification fails instead of serving altered text", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "specification-utf8-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const bytes = Buffer.from(readFileSync(specPath));
  // Corrupt one byte inside a string value, as in the reproduction: a lossy
  // "utf8" read replaces 0xff with U+FFFD, the JSON still parses, and the
  // app would serve the altered text while reporting a hash of it.
  const index = bytes.indexOf(Buffer.from("developer"));
  assert.notEqual(index, -1);
  bytes[index] = 0xff;
  const file = join(dir, "developer.openapi.json");
  writeFileSync(file, bytes);
  assert.throws(
    () => readSpecificationText(file),
    (error: unknown) => {
      assert.ok(error instanceof TypeError);
      assert.match(String(error), /not valid/);
      return true;
    },
  );
});

test("served specification and status hash match the loader output", async (t) => {
  const app = buildApp([]);
  t.after(() => app.close());
  const specification = readSpecificationText(specPath);
  const openapi = await app.inject("/__reconstruction/openapi.json");
  assert.equal(openapi.statusCode, 200);
  assert.equal(openapi.body, specification);
  const status = await app.inject("/__reconstruction/status");
  assert.equal(status.statusCode, 200);
  assert.equal(
    status.json().specificationSha256,
    createHash("sha256").update(specification).digest("hex"),
  );
});
