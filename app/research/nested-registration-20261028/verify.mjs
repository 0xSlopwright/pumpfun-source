import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import { parse } from "@babel/parser";
import prettier from "prettier";

// Parse captured source as data. Never import or evaluate a captured factory.
const root = fileURLToPath(new URL("../../", import.meta.url));
const packet = fileURLToPath(new URL("./", import.meta.url));
const base = "6aa66f03c6e83e23f546be406b1eed158e15a507";
const banner =
  "// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.\n";
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const json = async (name) =>
  JSON.parse(await fs.readFile(path.join(root, name), "utf8"));
const git = (...args) =>
  execFileSync("git", args, {
    cwd: path.resolve(root, ".."),
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
const before = JSON.parse(git("show", `${base}:app/recovered/modules.json`));
const after = await json("recovered/modules.json");
const old = new Map(before.modules.map((module) => [module.sha256, module]));
const current = new Map(after.modules.map((module) => [module.sha256, module]));
assert.equal(old.size, 4915);
assert.equal(current.size, 5947);
assert.deepEqual(after.failures, []);

const manifest = await json("evidence/web/manifest.json");
const records = new Map(
  manifest.records.map((record) => [record.path, record]),
);
const sources = new Map();
async function source(name) {
  if (!sources.has(name)) {
    const bytes = await fs.readFile(path.join(root, name));
    const record = records.get(name);
    assert.ok(record, `Missing capture ${name}`);
    assert.equal(bytes.length, record.bytes, `Capture length changed: ${name}`);
    assert.equal(sha256(bytes), record.sha256, `Capture hash changed: ${name}`);
    sources.set(name, new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  }
  return sources.get(name);
}

const runtimeProof = await json(
  "research/nested-registration-20261028/RUNTIME-PROOF.json",
);
const runtimeText = await source(runtimeProof.source);
assert.equal(
  records.get(runtimeProof.source).sha256,
  runtimeProof.objectSha256,
);
assert.equal(records.get(runtimeProof.source).bytes, runtimeProof.bytes);
const { registrationFunction: runtimeFunction, installRange } = runtimeProof;
const runtimeFunctionText = runtimeText.slice(
  runtimeFunction.start,
  runtimeFunction.end,
);
assert.equal(runtimeFunctionText, runtimeFunction.source);
assert.equal(sha256(runtimeFunctionText), runtimeFunction.sha256);
assert.equal(
  runtimeText.slice(installRange.start, installRange.end),
  "globalThis.TURBOPACK={push:X}",
);

const oldFiles = new Map(
  git("ls-tree", "-r", base, "--", "app/recovered/modules")
    .trim()
    .split("\n")
    .map((line) => {
      const [, hash, name] = line.match(/^\d+ blob ([0-9a-f]+)\tapp\/(.*)$/);
      return [name, hash];
    }),
);
let retainedOrigins = 0;
for (const previous of old.values()) {
  const module = current.get(previous.sha256);
  assert.ok(module, `Lost factory ${previous.sha256}`);
  assert.equal(module.path, previous.path, "Existing canonical path changed");
  assert.deepEqual(
    module.ids.slice(0, previous.ids.length),
    previous.ids,
    "Existing IDs changed",
  );
  assert.deepEqual(
    module.origins.slice(0, previous.origins.length),
    previous.origins,
    "Existing origins changed",
  );
  retainedOrigins += previous.origins.length;
  const bytes = await fs.readFile(path.join(root, module.path));
  const gitHash = createHash("sha1")
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest("hex");
  assert.equal(
    gitHash,
    oldFiles.get(module.path),
    `Existing formatted bytes changed: ${module.path}`,
  );
}
assert.equal(retainedOrigins, 6108);

function canonical(node) {
  if (Array.isArray(node)) return node.map(canonical);
  if (!node || typeof node !== "object") return node;
  return Object.fromEntries(
    Object.entries(node)
      .filter(
        ([key]) =>
          ![
            "start",
            "end",
            "loc",
            "extra",
            "leadingComments",
            "trailingComments",
            "innerComments",
            "comments",
            "tokens",
            "errors",
          ].includes(key),
      )
      .map(([key, value]) => [key, canonical(value)]),
  );
}
const expression = (text) => {
  const program = parse(text, { sourceType: "unambiguous" }).program;
  assert.equal(
    program.body.length,
    1,
    "Factory file contains extra statements",
  );
  assert.equal(
    program.directives.length,
    0,
    "Factory file contains directives",
  );
  assert.equal(program.body[0].type, "ExpressionStatement");
  return canonical(program.body[0].expression);
};
const formatterDerivations = [];
let origins = 0;
for (const module of after.modules) {
  let first;
  for (const origin of module.origins) {
    const text = await source(origin.source);
    assert.ok(
      Number.isInteger(origin.start) &&
        Number.isInteger(origin.end) &&
        origin.start >= 0 &&
        origin.end > origin.start &&
        origin.end <= text.length,
    );
    const raw = text.slice(origin.start, origin.end);
    assert.equal(sha256(raw), module.sha256, `Wrong raw range: ${module.path}`);
    first ??= raw;
    origins++;
  }
  const formatted = await fs.readFile(path.join(root, module.path), "utf8");
  assert.ok(formatted.startsWith(banner));
  if (!isDeepStrictEqual(expression(`(${first});`), expression(formatted))) {
    // When the pinned formatter changes Babel shape, require complete
    // byte-for-byte re-derivation instead of accepting formatted-source drift.
    assert.equal(
      formatted,
      banner + (await prettier.format(`(${first});`, { parser: "babel" })),
    );
    formatterDerivations.push({
      path: module.path,
      sha256: module.sha256,
      alreadyInventoried: old.has(module.sha256),
    });
  }
}
assert.equal(origins, 7337);

function walk(node, visit) {
  if (!node || typeof node !== "object") return;
  visit(node);
  for (const [key, value] of Object.entries(node)) {
    if (["loc", "extra"].includes(key)) continue;
    if (Array.isArray(value)) value.forEach((child) => walk(child, visit));
    else if (value && typeof value === "object") walk(value, visit);
  }
}
function nestedEntries(array) {
  let start = 0;
  const result = [];
  if (array.elements[0]?.type === "ArrayExpression") {
    result.push(...nestedEntries(array.elements[0]));
    start++;
  }
  let ids = [];
  for (const item of array.elements.slice(start)) {
    if (["NumericLiteral", "StringLiteral"].includes(item?.type))
      ids.push(item.value);
    else if (
      ["ArrowFunctionExpression", "FunctionExpression"].includes(item?.type)
    ) {
      result.push({ ids, start: item.start, end: item.end });
      ids = [];
    } else ids = [];
  }
  return result;
}

const nested = [];
for (const record of manifest.records.filter(
  (record) =>
    record.status === 200 && new URL(record.url).pathname.endsWith(".js"),
)) {
  const text = await source(record.path);
  walk(parse(text, { sourceType: "unambiguous" }), (node) => {
    if (
      node.type !== "CallExpression" ||
      node.callee?.type !== "MemberExpression" ||
      node.callee.property?.name !== "push" ||
      node.arguments[0]?.type !== "ArrayExpression" ||
      !text.slice(node.callee.start, node.callee.end).includes("TURBOPACK")
    )
      return;
    const array = node.arguments[0];
    if (
      array.elements.length <= 2 ||
      array.elements[1]?.type !== "ArrayExpression"
    )
      return;
    nested.push({
      source: record.path,
      objectSha256: record.sha256,
      bytes: record.bytes,
      registration: { start: array.start, end: array.end },
      factories: nestedEntries(array.elements[1]).map((entry) => {
        const sha = sha256(text.slice(entry.start, entry.end));
        return {
          ids: entry.ids,
          sha256: sha,
          start: entry.start,
          end: entry.end,
          known: old.has(sha),
        };
      }),
    });
  });
}
assert.deepEqual(
  nested,
  await json("research/nested-registration-20261028/NESTED-OCCURRENCES.json"),
);
const expectedAdded = nested
  .flatMap((capture) =>
    capture.factories.map((factory) =>
      JSON.stringify([
        factory.sha256,
        capture.source,
        factory.start,
        factory.end,
      ]),
    ),
  )
  .sort();
const actualAdded = after.modules
  .flatMap((module) =>
    module.origins
      .slice(old.get(module.sha256)?.origins.length ?? 0)
      .map((origin) =>
        JSON.stringify([
          module.sha256,
          origin.source,
          origin.start,
          origin.end,
        ]),
      ),
  )
  .sort();
assert.deepEqual(actualAdded, expectedAdded);
assert.equal(nested.length, 89);
assert.equal(actualAdded.length, 1229);
assert.equal([...current.keys()].filter((hash) => !old.has(hash)).length, 1032);
assert.equal(
  git(
    "diff",
    "--name-only",
    base,
    "--",
    "app/evidence",
    "app/packages/sdk/src",
    "app/contracts/feature-progress.json",
    "app/contracts/developer-bindings.json",
    "app/contracts/coverage.json",
  ),
  "",
);

const result = {
  base,
  uniqueFactories: current.size,
  origins,
  retainedFactories: old.size,
  retainedOrigins,
  retainedPathsAndFormattedBytes: old.size,
  addedFactories: 1032,
  addedOrigins: actualAdded.length,
  affectedCaptures: nested.length,
  authenticatedScriptObjects: sources.size,
  astEquivalentFactories: after.modules.length - formatterDerivations.length,
  formatterDerivations,
  evidenceSdkAndFeatureLedgersUnchanged: true,
};
await fs.writeFile(
  path.join(packet, "VERIFY-RESULTS.json"),
  JSON.stringify(result, null, 2) + "\n",
);
console.log(JSON.stringify(result));
