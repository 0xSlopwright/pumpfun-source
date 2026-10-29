import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root));
const json = (path) => JSON.parse(read(path));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const packet = json("contracts/create-video-bindings.json");
function verify(binding) {
  const manifest = json("evidence/web/manifest.json");
  const modules = json("recovered/modules.json").modules;
  assert.equal(binding.route, "/create");
  assert.equal(binding.capturedAt, manifest.captured_at);
  assert.equal(binding.userAgent, manifest.user_agent);
  assert.equal(binding.productionOperationsImplemented, 0);
  assert.equal(binding.productionOperationsQualified, 0);
  assert.equal(binding.browserQualified, false);
  const sources = new Map();
  for (const object of binding.objects) {
    const record = manifest.records.find((item) => item.path === object.path);
    for (const key of ["path", "url", "bytes", "sha256", "status"])
      assert.deepEqual(object[key], record[key]);
    const bytes = read(object.path);
    assert.equal(bytes.length, object.bytes);
    assert.equal(hash(bytes), object.sha256);
    sources.set(object.path, bytes.toString("utf8"));
  }
  const scripts = new Set(
    [
      ...sources
        .get(binding.routeObject)
        .matchAll(/<script[^>]+src="([^"]+)"/g),
    ].map((match) => match[1]),
  );
  const factories = new Map();
  for (const factory of binding.factories) {
    const { origin } = factory;
    assert.ok(scripts.has(new URL(origin.url).pathname));
    const matches = modules.filter(
      (item) =>
        item.sha256 === factory.sha256 &&
        JSON.stringify(item.ids) === JSON.stringify(factory.ids),
    );
    assert.equal(matches.length, 1);
    assert.ok(
      matches[0].origins.some(
        (item) => JSON.stringify(item) === JSON.stringify(origin),
      ),
    );
    assert.ok(factory.ids.includes(factory.id));
    const candidates = modules.flatMap((item) =>
      item.ids.includes(factory.id)
        ? item.origins
            .filter((o) => scripts.has(new URL(o.url).pathname))
            .map((o) => `${item.sha256}:${o.source}:${o.start}:${o.end}`)
        : [],
    );
    assert.deepEqual(
      new Set(candidates),
      new Set([
        `${factory.sha256}:${origin.source}:${origin.start}:${origin.end}`,
      ]),
    );
    const body = sources.get(origin.source).slice(origin.start, origin.end); // UTF-16 indices, not byte offsets.
    assert.equal(hash(body), factory.sha256);
    factories.set(factory.id, body);
  }
  for (const [source, target] of binding.importEdges)
    assert.match(factories.get(source), new RegExp(`\\.[ir]\\(${target}\\)`));
  assert.equal(factories.size, 4);
  for (const text of ['"video/*":[".mp4",".webm"]', "VIDEO:1e7"])
    assert.ok(factories.get(586090).includes(text));
  for (const text of [
    "e/(t+1)*(r+1)",
    'toDataURL("image/jpeg",.8)',
    "URL.revokeObjectURL(n)",
    "a.onseeked=",
  ])
    assert.ok(factories.get(807757).includes(text));
  for (const text of [
    "await (0,eY.b)(e,3)",
    "E(m),j(m[0])",
    "GET /videos/get-signed-url",
  ])
    assert.ok(factories.get(734638).includes(text));
  assert.ok(factories.get(778435).includes("No image hash provided"));
  assert.deepEqual(binding.observed.extensions, [".mp4", ".webm"]);
}
test("video factories are authenticated to complete route objects and import context without execution", () =>
  verify(packet));
test("changed object, factory range, route context and invented qualification are rejected", () => {
  for (const mutate of [
    (x) => (x.objects[0].sha256 = "0".repeat(64)),
    (x) => x.factories[0].origin.start++,
    (x) => (x.factories[2].origin.url = "https://example.invalid/unrelated.js"),
    (x) => (x.importEdges[0] = [586090, 734638]),
    (x) => (x.browserQualified = true),
  ]) {
    const copy = structuredClone(packet);
    mutate(copy);
    assert.throws(() => verify(copy));
  }
});
