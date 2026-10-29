import assert from "node:assert/strict";
import { test } from "node:test";
import {
  mkdtemp,
  mkdir,
  copyFile,
  readFile,
  writeFile,
  rm,
} from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { sha256 } from "../scripts/original-contracts/source.mjs";
import {
  APP_ROOT,
  CONTRACT_PATH,
  COMPATIBILITY_PATH,
  buildContractHttpErrors,
  verifyContractHttpErrors,
  compareInventory,
} from "../scripts/original-contract-http-errors.mjs";

const contract = await buildContractHttpErrors();
async function isolated(t) {
  const root = await mkdtemp(
    path.join(os.tmpdir(), "contract-http-error-source-"),
  );
  t.after(() => rm(root, { recursive: true, force: true }));
  const files = new Set([
    "evidence/web/manifest.json",
    "recovered/modules.json",
    "scripts/original-contracts/source.mjs",
    CONTRACT_PATH,
    COMPATIBILITY_PATH,
    ...contract.factories.map((factory) => factory.source),
  ]);
  for (const file of files) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await copyFile(path.join(APP_ROOT, file), path.join(root, file));
  }
  return root;
}

test("the decoder source contract reproduces without formatted factories or captured execution", async (t) => {
  const root = await isolated(t);
  assert.deepEqual(await verifyContractHttpErrors(root), contract);
  assert.equal(contract.factories.length, 8);
  assert.equal(contract.behavior.domainCodeRegistryLookup, false);
  assert.equal(contract.behavior.domainCodePattern.source, "^[A-Z][A-Z0-9_]+$");
  assert.deepEqual(
    contract.imports
      .filter((edge) => edge.from === 898661)
      .map((edge) => edge.to)
      .sort((a, b) => a - b),
    [4171, 233815, 402030, 858694],
  );
});

test("generated precedence tampering and shared-authenticator drift are rejected", async (t) => {
  const root = await isolated(t);
  const changed = structuredClone(contract);
  changed.behavior.dataPrecedence.reverse();
  await writeFile(
    path.join(root, CONTRACT_PATH),
    JSON.stringify(changed, null, 2) + "\n",
  );
  await assert.rejects(
    verifyContractHttpErrors(root),
    /differs from authenticated/,
  );
  await writeFile(
    path.join(root, "scripts/original-contracts/source.mjs"),
    "// changed source authenticator\n",
  );
  await assert.rejects(buildContractHttpErrors(root), /authenticator changed/);
});

test("raw capture mutation and invented factory ranges fail authentication", async (t) => {
  const root = await isolated(t);
  const source = contract.factories.find(
    (factory) => factory.id === 898661,
  ).source;
  const raw = await readFile(path.join(root, source));
  await writeFile(
    path.join(root, source),
    Buffer.concat([raw, Buffer.from(" ")]),
  );
  await assert.rejects(buildContractHttpErrors(root), /authentication failed/);
  await writeFile(path.join(root, source), raw);
  const indexPath = path.join(root, "recovered/modules.json");
  const index = JSON.parse(await readFile(indexPath));
  index.modules.find((module) => module.ids.includes(898661)).origins[0]
    .start++;
  await writeFile(indexPath, JSON.stringify(index));
  await assert.rejects(buildContractHttpErrors(root), /registration/);
});

async function appendManifested(root, source, suffix) {
  const bytes = Buffer.concat([
    await readFile(path.join(root, source)),
    Buffer.from(suffix),
  ]);
  await writeFile(path.join(root, source), bytes);
  const manifestPath = path.join(root, "evidence/web/manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath));
  const record = manifest.records.find((entry) => entry.path === source);
  record.bytes = bytes.length;
  record.sha256 = sha256(bytes);
  await writeFile(manifestPath, JSON.stringify(manifest));
}

test("an unindexed physical contender cannot hide behind a selected index entry", async (t) => {
  const root = await isolated(t);
  const source = contract.factories.find(
    (factory) => factory.id === 898661,
  ).source;
  await appendManifested(
    root,
    source,
    '\n(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["synthetic",[898661,e=>{}],9,e=>{}]);',
  );
  await assert.rejects(
    buildContractHttpErrors(root),
    /ambiguous physical context/,
  );
});

test("the real outer metadata branch does not invent another registered factory", async (t) => {
  const root = await isolated(t);
  const source = contract.factories.find(
    (factory) => factory.id === 898661,
  ).source;
  await appendManifested(
    root,
    source,
    '\n(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["synthetic metadata",[898661,e=>{}]]);',
  );
  const rebuilt = await buildContractHttpErrors(root);
  assert.deepEqual(rebuilt.behavior, contract.behavior);
  assert.notEqual(
    rebuilt.source.manifestSha256,
    contract.source.manifestSha256,
  );
});

test("unrelated index additions leave the unit stable; selected complete-entry changes do not", async (t) => {
  const root = await isolated(t);
  const indexPath = path.join(root, "recovered/modules.json");
  const index = JSON.parse(await readFile(indexPath));
  index.modules.push({
    ids: [99999999],
    sha256: "unrelated synthetic entry",
    origins: [],
  });
  await writeFile(indexPath, JSON.stringify(index));
  assert.deepEqual(await verifyContractHttpErrors(root), contract);
  const expandedPath = path.join(root, "expanded.json");
  await writeFile(expandedPath, JSON.stringify(index));
  assert.equal(
    (await compareInventory(expandedPath)).completeEntriesEqual,
    true,
  );
  index.modules
    .find((module) => module.ids.includes(525364))
    .origins.push({ source: "synthetic-unrelated-context" });
  await writeFile(expandedPath, JSON.stringify(index));
  await assert.rejects(
    compareInventory(expandedPath),
    /selected complete inventory entries changed/,
  );
});
