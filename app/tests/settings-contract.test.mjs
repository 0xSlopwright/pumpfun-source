import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) =>
  JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const contract = read("contracts/settings-notifications.json");
const index = read("recovered/modules.json");

test("settings source bindings exactly match the immutable recovery index", () => {
  assert.equal(contract.schemaVersion, 1);
  assert.equal(contract.sources.length, 10);
  for (const source of contract.sources) {
    assert.deepEqual(
      index.modules.find((item) => item.path === source.path),
      source,
    );
    for (const origin of source.origins) {
      const captured = fs.readFileSync(path.join(root, origin.source), "utf8");
      const factory = captured.slice(origin.start, origin.end);
      assert.equal(
        createHash("sha256").update(factory).digest("hex"),
        source.sha256,
      );
    }
  }
});

test("Hermes route binding separates client observations from native compatibility", () => {
  assert.equal(contract.client.prefix, "/api/hermes");
  assert.equal(contract.client.timeoutMs, 60_000);
  assert.equal(contract.client.serverOrigin, "unknown");
  assert.equal(contract.operations.length, 5);
  assert.equal(
    new Set(contract.operations.map((op) => `${op.method} ${op.path}`)).size,
    5,
  );
  for (const operation of contract.operations) {
    assert.ok(operation.path.startsWith("/api/hermes/v1/"));
    assert.equal(operation.implementedNatively, false);
    assert.equal(operation.qualified, false);
    assert.equal(operation.observedResponse, false);
  }
  assert.equal(contract.readPreferenceFields.length, 9);
  assert.deepEqual(contract.topicNames, [
    "trending",
    "trending_searches",
    "quiet_trending_searches",
  ]);
});

test("general settings text is bound to the exact captured English Flight resources", () => {
  const catalogue = contract.translationCatalogue;
  const bytes = fs.readFileSync(path.join(root, catalogue.source));
  assert.equal(bytes.byteLength, catalogue.bytes);
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    catalogue.sha256,
  );
  const manifest = read("evidence/web/manifest.json");
  assert.equal(manifest.captured_at, catalogue.capturedAt);
  const record = manifest.records.filter((item) => item.url === catalogue.url);
  assert.equal(record.length, 1);
  assert.equal(record[0].path, catalogue.source);
  assert.equal(record[0].sha256, catalogue.sha256);
  const pushes = [
    ...bytes
      .toString("utf8")
      .matchAll(/<script>self\.__next_f\.push\(([\s\S]*?)\)<\/script>/gu),
  ];
  assert.equal(pushes.length, 1);
  const push = JSON.parse(pushes[0][1]);
  const rows = push[1]
    .split("\n")
    .filter((row) => row.startsWith(`${catalogue.flightRow}:`));
  assert.equal(rows.length, 1);
  const row = JSON.parse(rows[0].slice(catalogue.flightRow.length + 1));
  assert.equal(row.locale, catalogue.locale);
  const resources = catalogue.resourcePath.reduce(
    (value, key) => value[key],
    row,
  );
  for (const [key, expected] of Object.entries(catalogue.strings)) {
    assert.equal(
      key.split(".").reduce((value, part) => value[part], resources),
      expected,
      key,
    );
  }
  // The retained common catalogue does not qualify lazy notification wording.
  assert.equal(resources.web.notification_settings, undefined);
  assert.equal(resources.notifications?.settings, undefined);
});
