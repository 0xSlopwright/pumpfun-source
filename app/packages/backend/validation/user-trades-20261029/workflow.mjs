/** Real loopback HTTP over clearly synthetic input; no upstream calls or mutations. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildApp } from "../../dist/app.js";
import { loadUserTradesStore } from "../../dist/user-trades-store.js";

const here = dirname(fileURLToPath(import.meta.url));
const output = process.argv[2];
const sourceHead = process.argv[3];
if (!output || !/^[a-f0-9]{40}$/.test(sourceHead ?? "")) throw new Error("Usage: node workflow.mjs <new-output.json> <source-commit>");
if (existsSync(output)) throw new Error("Refusing to overwrite an existing receipt");
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const file = resolve(here, "synthetic.json");
const headers = { authorization: `Bearer pf_live_${"A".repeat(49)}` }; // Explicit synthetic shape.
const sourceFiles = ["src/app.ts", "src/server.ts", "src/user-trades-store.ts", "src/user-trades-routes.ts"];
const backend = resolve(here, "../..");
const before = Object.fromEntries(sourceFiles.map(path => [path, hash(readFileSync(resolve(backend, path)))]));
let app = buildApp([], { userTradesStore: loadUserTradesStore(file) });
const observations = [];
async function request(origin, path, auth = true) {
  const response = await fetch(`${origin}${path}`, { headers: auth ? headers : {} });
  const row = { path, auth: auth ? "synthetic key shape, not a verified credential" : "absent", status: response.status,
    headers: Object.fromEntries([...response.headers].filter(([name]) => name.startsWith("x-reconstruction-"))), body: await response.json() };
  observations.push(row);
  return row;
}
try {
  let origin = await app.listen({ host: "127.0.0.1", port: 0 });
  const first = await request(origin, "/v1/user-trades/person-a?limit=2");
  assert.equal(first.status, 200);
  assert.deepEqual(first.body.trades.map(row => row.slotIndexId), ["3".padStart(26, "0"), "2".padStart(26, "0")]);
  assert.equal(first.body.trades[0].tx, first.body.trades[1].tx);
  assert.ok(first.body.trades.every(row => !Object.hasOwn(row, "kind")));
  assert.deepEqual(first.body.coins, [{ mint: "synthetic-mint", chainId: 1399811149, name: null, symbol: null, image: null }]);
  assert.equal((await request(origin, "/v1/user-trades/person-a?limit=2", false)).status, 401);
  assert.equal((await request(origin, "/v1/user-trades/person-a?limit=201")).status, 400);
  await app.close();
  app = buildApp([], { userTradesStore: loadUserTradesStore(file) });
  origin = await app.listen({ host: "127.0.0.1", port: 0 });
  const second = await request(origin, `/v1/user-trades/person-a?limit=2&cursor=${first.body.nextCursor}`);
  assert.equal(second.status, 200);
  assert.deepEqual(second.body.trades.map(row => row.slotIndexId), ["1".padStart(26, "0")]);
  assert.equal(second.body.nextCursor, null);
  const transfers = await request(origin, "/v1/user-trades/person-a?types=transfers");
  assert.equal(transfers.status, 200);
  assert.equal(transfers.body.trades[0].kind, "transfer");
  assert.equal(transfers.body.trades[0].amountUsd, null);
  assert.equal(transfers.body.trades[0].priceUsd, null);
  assert.equal(transfers.body.trades[0].amountSol, null);
  assert.equal(transfers.body.trades[0].baseAmount, 10);
  assert.equal((await request(origin, `/v1/user-trades/person-a?mint=another&cursor=${first.body.nextCursor}`)).status, 400);
  assert.deepEqual(Object.fromEntries(sourceFiles.map(path => [path, hash(readFileSync(resolve(backend, path)))])), before);
  const result = { status: "PASS", source_head: sourceHead, node: process.version, transport: "real HTTP on ephemeral loopback ports",
    synthetic_input_sha256: hash(readFileSync(file)), source_sha256: before,
    compiled_sha256: Object.fromEntries(["dist/app.js", "dist/user-trades-store.js", "dist/user-trades-routes.js"].map(path => [path, hash(readFileSync(resolve(backend, path)))])),
    observations, limits: "Opt-in materialized spot-history behavior only. No production data, external request, native API auth/scope compatibility, financial calculation, indexer, UI or milestone qualification." };
  mkdirSync(dirname(resolve(output)), { recursive: true });
  writeFileSync(output, JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify({ status: "PASS", HTTP_requests: observations.length, file_reload_restart: true, source_head: sourceHead }));
} finally { await app.close(); }
