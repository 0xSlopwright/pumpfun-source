import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "@babel/parser";
import { inventory } from "../scripts/inventory.mjs";

const inventoryScript = fileURLToPath(
  new URL("../scripts/inventory.mjs", import.meta.url),
);

function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}

function bundle(factories, { prefix = "", literals = [] } = {}) {
  const entries = factories
    .flatMap(({ id, code }) => [JSON.stringify(id), code])
    .join(",\n");
  const expressions = literals.map((literal) => `${JSON.stringify(literal)};`);
  return `${prefix}globalThis.TURBOPACK.push([\n"synthetic",\n${entries}\n]);\n${expressions.join("\n")}\n`;
}

async function makeWorkspace(t, sources) {
  const root = await mkdtemp(path.join(tmpdir(), "pump-inventory-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "evidence/web/objects"), { recursive: true });
  const records = [];
  for (const [index, source] of sources.entries()) {
    const name = source.name ?? `source-${index}.js`;
    const relative = `evidence/web/objects/${name}`;
    if (source.contents !== undefined) {
      await writeFile(path.join(root, relative), source.contents);
    }
    records.push({
      url: source.url ?? `https://example.invalid/${name}`,
      path: relative,
      status: source.status ?? 200,
      sha256: source.sha256 ?? digest(source.contents ?? ""),
    });
  }
  await writeFile(
    path.join(root, "evidence/web/manifest.json"),
    JSON.stringify({ records }, null, 2) + "\n",
  );
  return root;
}

async function readJson(root, relative) {
  return JSON.parse(await readFile(path.join(root, relative), "utf8"));
}

async function refreshSourceDigest(root, relative) {
  const manifest = await readJson(root, "evidence/web/manifest.json");
  manifest.records.find((record) => record.path === relative).sha256 = digest(
    await readFile(path.join(root, relative)),
  );
  await writeFile(
    path.join(root, "evidence/web/manifest.json"),
    JSON.stringify(manifest),
  );
}

test("changed captured bytes cannot replace a verified inventory", async (t) => {
  const root = await makeWorkspace(t, [
    {
      contents: bundle([
        { id: 77, code: 'function value() { return "before"; }' },
      ]),
    },
  ]);
  await runInventory(root);
  const before = await snapshot(root);
  await writeFile(
    path.join(root, "evidence/web/objects/source-0.js"),
    bundle([{ id: 77, code: 'function value() { return "after!"; }' }]),
  );
  const result = runInventoryCli(root);
  assert.notEqual(
    result.status,
    0,
    "Accepted changed bytes under the retained capture digest",
  );
  assert.match(result.stderr, /SHA-256 mismatch/);
  assert.deepEqual(await snapshot(root), before);
  await assertNoStagingDirectories(root);
});

async function runInventory(root, options = {}) {
  return inventory(root, { log: () => {}, ...options });
}

test("query-bearing script URLs retain factories and full provenance", async (t) => {
  const root = await makeWorkspace(t, [
    {
      contents: bundle([
        { id: 77, code: 'function value() { return "retained"; }' },
      ]),
    },
  ]);
  assert.equal(runInventoryCli(root).status, 0);
  const before = await factoryFiles(root);
  for (const suffix of ["?v=2", "#fragment", "?v=2#fragment"]) {
    const manifest = await readJson(root, "evidence/web/manifest.json");
    const url = `https://example.invalid/source-0.js${suffix}`;
    manifest.records[0].url = url;
    await writeFile(
      path.join(root, "evidence/web/manifest.json"),
      JSON.stringify(manifest),
    );
    const result = runInventoryCli(root);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(
      await factoryFiles(root),
      before,
      `Dropped factories for ${url}`,
    );
    const report = await readJson(root, "recovered/modules.json");
    assert.equal(report.modules[0].origins[0].url, url);
  }
});

test("a non-script path with a .js query value is not parsed as JavaScript", async (t) => {
  const root = await makeWorkspace(t, [
    {
      url: "https://example.invalid/page?next=chunk.js",
      contents: "<!doctype html>",
    },
  ]);
  const result = runInventoryCli(root);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(await factoryFiles(root), []);
});

test("invalid query-bearing scripts fail without replacing the inventory", async (t) => {
  const root = await makeWorkspace(t, [
    { contents: bundle([{ id: 77, code: "() => 1" }]) },
  ]);
  await runInventory(root);
  const before = await snapshot(root);
  const manifest = await readJson(root, "evidence/web/manifest.json");
  manifest.records[0].url += "?v=2";
  const invalid = "const broken = ;";
  await writeFile(path.join(root, manifest.records[0].path), invalid);
  manifest.records[0].sha256 = digest(invalid);
  await writeFile(
    path.join(root, "evidence/web/manifest.json"),
    JSON.stringify(manifest),
  );
  const result = runInventoryCli(root);
  assert.notEqual(result.status, 0, "Invalid script was silently skipped");
  assert.match(result.stderr, /Inventory extraction failed/);
  assert.deepEqual(await snapshot(root), before);
});

function runInventoryCli(root) {
  return spawnSync(process.execPath, [inventoryScript, "--root", root], {
    encoding: "utf8",
  });
}

async function factoryFiles(root) {
  return (await readdir(path.join(root, "recovered/modules")))
    .filter((name) => name.endsWith(".js"))
    .sort();
}

async function snapshot(root) {
  const result = {};
  const reports = [
    "recovered/modules.json",
    "contracts/internal-operations.json",
    "evidence/web/dependency-paths.json",
  ];
  for (const relative of reports) {
    result[relative] = (await readFile(path.join(root, relative))).toString(
      "hex",
    );
  }
  for (const filename of await factoryFiles(root)) {
    const relative = `recovered/modules/${filename}`;
    result[relative] = (await readFile(path.join(root, relative))).toString(
      "hex",
    );
  }
  return result;
}

async function assertNoStagingDirectories(root) {
  assert.deepEqual(
    (await readdir(root)).filter((name) =>
      name.startsWith(".inventory-stage-"),
    ),
    [],
  );
}

test("generates a valid synthetic factory inventory", async (t) => {
  const source = bundle(
    [{ id: 101, code: 'function alpha() { return "alpha"; }' }],
    {
      prefix: 'throw new Error("Captured input must not execute");\n',
    },
  );
  const root = await makeWorkspace(t, [{ contents: source }]);
  const report = await runInventory(root);
  assert.equal(report.modules.length, 1);
  assert.deepEqual(report.failures, []);
  assert.deepEqual(report.modules[0].ids, [101]);
  assert.match(
    await readFile(path.join(root, report.modules[0].path), "utf8"),
    /^\/\/ Recovered Turbopack factory\./,
  );
});

test("retains multiple IDs and origins for one shared factory variant", async (t) => {
  const code = 'function shared() { return "same"; }';
  const root = await makeWorkspace(t, [
    { name: "one.js", contents: bundle([{ id: 201, code }]) },
    { name: "two.js", contents: bundle([{ id: 202, code }]) },
  ]);
  await runInventory(root);
  const report = await readJson(root, "recovered/modules.json");
  assert.equal(report.modules.length, 1);
  assert.deepEqual(report.modules[0].ids, [201, 202]);
  assert.equal(report.modules[0].origins.length, 2);
});

test("recovers a leading nested registration and retains the outer factories", async (t) => {
  const nested = 'function nested() { return "GET /nested"; }';
  const outer = 'function outer() { return "outer"; }';
  const source = `"😀"; throw Error("must not execute");
    globalThis.TURBOPACK.push(["synthetic", [201, 202, ${nested}], 203, ${outer}]);`;
  const root = await makeWorkspace(t, [{ contents: source }]);
  const report = await runInventory(root);
  assert.equal(report.modules.length, 2);
  assert.deepEqual(
    report.modules.map((module) => module.ids),
    [[203], [201, 202]],
  );
  for (const [index, code] of [outer, nested].entries()) {
    const module = report.modules[index];
    const { start, end } = module.origins[0];
    assert.equal(start, source.indexOf(code));
    assert.equal(source.slice(start, end), code);
    assert.equal(module.sha256, digest(code));
  }
  assert.equal(
    (await readJson(root, "contracts/internal-operations.json")).operations[0]
      .operation,
    "GET /nested",
  );
});

test("recurses only through the first registration slot at each depth", async (t) => {
  const source = `globalThis.TURBOPACK.push(["synthetic",
    [[301, () => "deep"], 302, () => "nested"], 303, () => "outer"]);`;
  const root = await makeWorkspace(t, [{ contents: source }]);
  const report = await runInventory(root);
  assert.deepEqual(
    report.modules.map((module) => module.ids),
    [[303], [301], [302]],
  );
});

test("an earlier nested alias preserves the existing flat path and origin order", async (t) => {
  const common = 'function shared() { return "same"; }';
  const root = await makeWorkspace(t, [
    {
      name: "earlier.js",
      contents: `globalThis.TURBOPACK.push(["synthetic", [701, ${common}], 702, () => 0]);`,
    },
    { name: "later.js", contents: bundle([{ id: 703, code: common }]) },
  ]);
  const report = await runInventory(root);
  const shared = report.modules.find(
    (module) => module.sha256 === digest(common),
  );
  assert.equal(
    shared.path,
    `recovered/modules/703-${digest(common).slice(0, 12)}.js`,
  );
  assert.deepEqual(shared.ids, [703, 701]);
  assert.deepEqual(
    shared.origins.map((origin) => origin.source),
    ["evidence/web/objects/later.js", "evidence/web/objects/earlier.js"],
  );
});

test("keeps nested aliases, origins and conflicting ID variants distinct", async (t) => {
  const common = 'function shared() { return "same"; }';
  const other = 'function changed() { return "different"; }';
  const root = await makeWorkspace(t, [
    { name: "flat.js", contents: bundle([{ id: 401, code: common }]) },
    {
      name: "nested.js",
      contents: `globalThis.TURBOPACK.push(["synthetic", [401, 402, ${common}, 401, ${other}], 403, () => 0]);`,
    },
  ]);
  const report = await runInventory(root);
  assert.equal(report.modules.length, 3);
  const shared = report.modules.find(
    (module) => module.sha256 === digest(common),
  );
  assert.deepEqual(shared.ids, [401, 402]);
  assert.equal(shared.origins.length, 2);
  assert.equal(
    report.modules.filter((module) => module.ids.includes(401)).length,
    2,
  );
});

test("does not treat runtime metadata or unrelated nested arrays as registrations", async (t) => {
  const source = `
    globalThis.TURBOPACK.push(["metadata", [501, () => "not a factory registration"]]);
    globalThis.TURBOPACK.push(["synthetic", 502, () => {
      const data = [503, () => "function body data"];
      return data;
    }, [504, () => "nonleading data"]]);
    const data = [505, () => "unregistered data"];
    other.push(["synthetic", [506, () => "different receiver"], 507, () => 0]);`;
  const root = await makeWorkspace(t, [{ contents: source }]);
  const report = await runInventory(root);
  assert.deepEqual(
    report.modules.map((module) => module.ids),
    [[502]],
  );
});

test("authenticates the captured nested achievements registration without executing it", async (t) => {
  const relative = "evidence/web/objects/af9a2670547bb6bb.js";
  const source = await readFile(
    new URL(`../${relative}`, import.meta.url),
    "utf8",
  );
  assert.equal(
    digest(source),
    "7f30748aebd39a40629e117e152c37d598a801d138642116c9b1fccf08c8ee39",
  );
  const root = await makeWorkspace(t, [
    { name: "captured.js", contents: source },
  ]);
  const report = await runInventory(root);
  assert.equal(report.modules.length, 14);
  const achievements = report.modules.find((module) =>
    module.ids.includes(456747),
  );
  assert.deepEqual(achievements.ids, [456747, 656246]);
  assert.equal(
    achievements.sha256,
    "89c0d9ad83a1fef8e32185695b92752b89680a6a772ef0b9c396d9b2cb1522f8",
  );
  assert.deepEqual(
    { start: achievements.origins[0].start, end: achievements.origins[0].end },
    { start: 12560, end: 13428 },
  );
  assert.match(
    source.slice(12560, 13428),
    /GET \/users\/\{address\}\/achievements/,
  );
});

test("captured Turbopack runtime registers its leading nested array recursively", async () => {
  const source = await readFile(
    new URL("../evidence/web/objects/f25d7686d048ae16.js", import.meta.url),
    "utf8",
  );
  assert.equal(
    digest(source),
    "b5f9b5199b99ab6c141f4540f0b7d0fe803c4ecf6956849ecb6e59d3d439272e",
  );
  const nodes = [];
  function visit(node) {
    if (!node || typeof node !== "object") return;
    nodes.push(node);
    for (const [key, value] of Object.entries(node)) {
      if (["loc", "extra"].includes(key)) continue;
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === "object") visit(value);
    }
  }
  visit(parse(source));
  const registration = nodes.find(
    (node) => node.type === "FunctionDeclaration" && node.id?.name === "X",
  );
  assert.deepEqual([registration.start, registration.end], [7978, 8812]);
  const recursive = nodes.find(
    (node) =>
      node.type === "FunctionExpression" &&
      node.id?.name === "e" &&
      node.params.map((param) => param.name).join(",") === "t,r,n,o",
  );
  assert.ok(
    recursive.start > registration.start && recursive.end < registration.end,
  );
  const loop = recursive.body.body.find((node) => node.type === "ForStatement");
  assert.equal(
    source.slice(loop.init.start, loop.init.end),
    "Array.isArray(i)&&(e(i,0,n,o),l++)",
  );
  assert.equal(
    source.slice(recursive.body.body[0].start, recursive.body.body[0].end),
    "let l=r,i=t[l];",
  );
  const invocation = nodes.find(
    (node) => node.type === "CallExpression" && node.callee === recursive,
  );
  assert.deepEqual(
    invocation.arguments.map((node) => source.slice(node.start, node.end)),
    ["t", "1", "E"],
  );
  const metadataBranch = nodes.find(
    (node) =>
      node.type === "ConditionalExpression" &&
      source.slice(node.test.start, node.test.end) === "2===t.length",
  );
  assert.equal(
    source.slice(
      metadataBranch.consequent.start,
      metadataBranch.consequent.end,
    ),
    "r=t[1]",
  );
  const installation = nodes.find(
    (node) =>
      node.type === "AssignmentExpression" &&
      source.slice(node.left.start, node.left.end) === "globalThis.TURBOPACK",
  );
  assert.equal(
    source.slice(installation.right.start, installation.right.end),
    "{push:X}",
  );
});

test("binds each factory SHA-256 to its exact captured source slice", async (t) => {
  const source = bundle([
    { id: 301, code: 'function provenance() { return "exact"; }' },
  ]);
  const root = await makeWorkspace(t, [{ contents: source }]);
  await runInventory(root);
  const report = await readJson(root, "recovered/modules.json");
  const module = report.modules[0];
  const origin = module.origins[0];
  const recovered = source.slice(origin.start, origin.end);
  assert.equal(digest(recovered), module.sha256);
  assert.equal(recovered, 'function provenance() { return "exact"; }');
});

test("records factory ranges as UTF-16 code-unit offsets", async (t) => {
  const prefix = '"😀";\n';
  const source = bundle(
    [{ id: 401, code: 'function unicodeRange() { return "ok"; }' }],
    { prefix },
  );
  const root = await makeWorkspace(t, [{ contents: source }]);
  await runInventory(root);
  const report = await readJson(root, "recovered/modules.json");
  const { start, end } = report.modules[0].origins[0];
  assert.equal(start, source.indexOf("function unicodeRange"));
  assert.equal(
    source.slice(start, end),
    'function unicodeRange() { return "ok"; }',
  );
  assert.ok(Buffer.byteLength(source.slice(0, start), "utf8") > start);
  assert.equal(
    report.rangeEncoding,
    "UTF-16 code-unit half-open offsets in UTF-8 decoded source",
  );
});

test("a parser failure exits nonzero without publishing reports", async (t) => {
  const root = await makeWorkspace(t, [
    {
      name: "valid.js",
      contents: bundle([
        { id: 501, code: "function valid() { return true; }" },
      ]),
    },
    { name: "malformed.js", contents: "globalThis.TURBOPACK.push([" },
  ]);
  const result = runInventoryCli(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /evidence\/web\/objects\/malformed\.js/);
  assert.doesNotMatch(result.stdout, /"modules"/);
  await assert.rejects(access(path.join(root, "recovered/modules.json")));
});

test("a missing captured source exits nonzero without publishing reports", async (t) => {
  const root = await makeWorkspace(t, [
    { name: "missing.js", contents: undefined },
  ]);
  const result = runInventoryCli(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /evidence\/web\/objects\/missing\.js/);
  assert.match(result.stderr, /ENOENT/);
  await assert.rejects(access(path.join(root, "recovered/modules.json")));
});

test("failed parsing preserves previous reports and factory files", async (t) => {
  const relative = "evidence/web/objects/source-0.js";
  const root = await makeWorkspace(t, [
    {
      contents: bundle([
        { id: 601, code: 'function stable() { return "stable"; }' },
      ]),
    },
  ]);
  await runInventory(root);
  const before = await snapshot(root);
  await writeFile(path.join(root, relative), "globalThis.TURBOPACK.push([");
  await refreshSourceDigest(root, relative);
  await assert.rejects(runInventory(root), /Inventory extraction failed/);
  assert.deepEqual(await snapshot(root), before);
  await assertNoStagingDirectories(root);
});

test("removes obsolete generator-owned factories after source removal", async (t) => {
  const relative = "evidence/web/objects/source-0.js";
  const first = { id: 701, code: 'function first() { return "first"; }' };
  const second = { id: 702, code: 'function second() { return "second"; }' };
  const root = await makeWorkspace(t, [{ contents: bundle([first, second]) }]);
  await runInventory(root);
  const initial = await factoryFiles(root);
  assert.equal(initial.length, 2);
  await writeFile(path.join(root, relative), bundle([first]));
  await refreshSourceDigest(root, relative);
  await runInventory(root);
  const current = await factoryFiles(root);
  assert.equal(current.length, 1);
  assert.ok(initial.includes(current[0]));
  assert.equal(
    (await readJson(root, "recovered/modules.json")).modules.length,
    1,
  );
});

test("replaces the obsolete hashed file when factory source changes", async (t) => {
  const relative = "evidence/web/objects/source-0.js";
  const root = await makeWorkspace(t, [
    {
      contents: bundle([
        { id: 801, code: 'function changed() { return "v1"; }' },
      ]),
    },
  ]);
  await runInventory(root);
  const [oldName] = await factoryFiles(root);
  await writeFile(
    path.join(root, relative),
    bundle([{ id: 801, code: 'function changed() { return "v2"; }' }]),
  );
  await refreshSourceDigest(root, relative);
  await runInventory(root);
  const [newName] = await factoryFiles(root);
  assert.notEqual(newName, oldName);
  assert.equal((await factoryFiles(root)).length, 1);
  await assert.rejects(access(path.join(root, "recovered/modules", oldName)));
});

test("preserves unknown files in the recovered modules directory", async (t) => {
  const root = await makeWorkspace(t, [
    {
      contents: bundle([
        { id: 901, code: 'function known() { return "known"; }' },
      ]),
    },
  ]);
  await mkdir(path.join(root, "recovered/modules"), { recursive: true });
  await writeFile(
    path.join(root, "recovered/modules/analyst-notes.txt"),
    "user-owned\n",
  );
  await runInventory(root);
  assert.equal(
    await readFile(
      path.join(root, "recovered/modules/analyst-notes.txt"),
      "utf8",
    ),
    "user-owned\n",
  );
});

test("does not collapse distinct factory variants sharing an ID", async (t) => {
  const root = await makeWorkspace(t, [
    {
      contents: bundle([
        { id: 1001, code: 'function variant() { return "one"; }' },
        { id: 1001, code: 'function variant() { return "two"; }' },
      ]),
    },
  ]);
  await runInventory(root);
  const report = await readJson(root, "recovered/modules.json");
  assert.equal(report.modules.length, 2);
  assert.equal(new Set(report.modules.map((module) => module.sha256)).size, 2);
  assert.equal(new Set(report.modules.map((module) => module.path)).size, 2);
});

test("unchanged inputs generate byte-identical outputs repeatedly", async (t) => {
  const root = await makeWorkspace(t, [
    {
      contents: bundle(
        [{ id: 1101, code: 'function repeatable() { return "same"; }' }],
        { literals: ["GET /repeatable"] },
      ),
    },
  ]);
  await runInventory(root);
  const first = await snapshot(root);
  await runInventory(root);
  assert.deepEqual(await snapshot(root), first);
  await assertNoStagingDirectories(root);
});

test("keeps static operation extraction and occurrences consistent", async (t) => {
  const source = bundle(
    [{ id: 1201, code: 'function operations() { return "GET /inside"; }' }],
    { literals: ["POST /alpha", "GET /zeta", "GET /zeta"] },
  );
  const root = await makeWorkspace(t, [{ contents: source }]);
  await runInventory(root);
  const report = await readJson(root, "contracts/internal-operations.json");
  assert.deepEqual(
    report.operations.map((entry) => entry.operation),
    ["GET /inside", "GET /zeta", "POST /alpha"],
  );
  assert.equal(report.occurrences.length, 4);
  for (const occurrence of report.occurrences) {
    assert.equal(
      JSON.parse(source.slice(occurrence.start, occurrence.end)),
      occurrence.operation,
    );
  }
});

test("keeps dependency path observations and offsets consistent", async (t) => {
  const dependency =
    "node_modules/.pnpm/react@19.2.3/node_modules/react/index.js";
  const source = bundle(
    [{ id: 1301, code: "function dependency() { return true; }" }],
    { literals: [dependency] },
  );
  const root = await makeWorkspace(t, [{ contents: source }]);
  await runInventory(root);
  const report = await readJson(root, "evidence/web/dependency-paths.json");
  assert.deepEqual(report, [
    {
      specifier: "react@19.2.3",
      source: "evidence/web/objects/source-0.js",
      offset: source.indexOf(dependency),
    },
  ]);
});

test("a formatting failure preserves every previous output", async (t) => {
  const relative = "evidence/web/objects/source-0.js";
  const root = await makeWorkspace(t, [
    {
      contents: bundle([
        { id: 1401, code: 'function format() { return "before"; }' },
      ]),
    },
  ]);
  await runInventory(root);
  const before = await snapshot(root);
  await writeFile(
    path.join(root, relative),
    bundle([{ id: 1401, code: 'function format() { return "after"; }' }]),
  );
  await refreshSourceDigest(root, relative);
  await assert.rejects(
    runInventory(root, {
      formatFactory: async () => {
        throw new Error("synthetic formatter failure");
      },
    }),
    /Unable to format recovered factory/,
  );
  assert.deepEqual(await snapshot(root), before);
  await assertNoStagingDirectories(root);
});

test("a publication failure rolls back every replaced output", async (t) => {
  const relative = "evidence/web/objects/source-0.js";
  const root = await makeWorkspace(t, [
    {
      contents: bundle([
        { id: 1501, code: 'function publish() { return "before"; }' },
      ]),
    },
  ]);
  await runInventory(root);
  const before = await snapshot(root);
  await writeFile(
    path.join(root, relative),
    bundle([{ id: 1501, code: 'function publish() { return "after"; }' }]),
  );
  await refreshSourceDigest(root, relative);
  await assert.rejects(
    runInventory(root, {
      beforePublish: ({ relative: target }) => {
        if (target === "recovered/modules.json") {
          throw new Error("synthetic publication failure");
        }
      },
    }),
    /previous outputs restored/,
  );
  assert.deepEqual(await snapshot(root), before);
  await assertNoStagingDirectories(root);
});

test("rejects a generated filename collision with an unrelated file", async (t) => {
  const code = 'function collision() { return "generated"; }';
  const root = await makeWorkspace(t, [
    { contents: bundle([{ id: 1601, code }]) },
  ]);
  const filename = `1601-${digest(code).slice(0, 12)}.js`;
  await mkdir(path.join(root, "recovered/modules"), { recursive: true });
  await writeFile(
    path.join(root, "recovered/modules", filename),
    "unrelated analyst content\n",
  );
  await assert.rejects(runInventory(root), /collides with an unrelated file/);
  assert.equal(
    await readFile(path.join(root, "recovered/modules", filename), "utf8"),
    "unrelated analyst content\n",
  );
  await assert.rejects(access(path.join(root, "recovered/modules.json")));
  await assertNoStagingDirectories(root);
});
