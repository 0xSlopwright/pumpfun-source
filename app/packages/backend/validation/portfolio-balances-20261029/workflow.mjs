/** Synthetic data, real loopback HTTP; no provider or production request. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildApp } from "../../dist/app.js";
import { loadPortfolioBalancesStore } from "../../dist/portfolio-balances-store.js";

const here = dirname(fileURLToPath(import.meta.url));
const output = process.argv[2], sourceHead = process.argv[3];
if (!output || !/^[a-f0-9]{40}$/.test(sourceHead ?? "") || existsSync(output)) throw new Error("Usage: node workflow.mjs <new-output.json> <source-head>");
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const A = "1".repeat(32), B = "2".repeat(32), C = "3".repeat(32), missing = "4".repeat(32);
const dir = mkdtempSync(join(tmpdir(), "pump-balance-workflow-"));
const file = join(dir, "balances.json"); copyFileSync(resolve(here, "synthetic.json"), file);
const observations = [];
let app = buildApp([], { portfolioBalancesStore: loadPortfolioBalancesStore(file) });
async function request(origin, body, authenticated = true) {
  const response = await fetch(`${origin}/v1/portfolio-summary/balances`, { method: "POST",
    headers: { "content-type": "application/json", ...(authenticated ? { authorization: `Bearer pf_live_${"A".repeat(49)}` } : {}) }, body: JSON.stringify(body) });
  const row = { method: "POST", path: "/v1/portfolio-summary/balances", input: body,
    authentication: authenticated ? "synthetic shape, not a verified credential" : "absent",
    status: response.status, headers: Object.fromEntries([...response.headers].filter(([key]) => key.startsWith("x-reconstruction-"))), body: await response.json() };
  observations.push(row); return row;
}
try {
  let origin = await app.listen({ host: "127.0.0.1", port: 0 });
  const first = await request(origin, { wallets: [A] });
  assert.equal(first.status, 200); assert.equal(first.body.wallets[A].totalValueUsd, 12.5);
  const batch = await request(origin, { wallets: [A, C, missing, B, A], fresh: true, holdings: true });
  assert.equal(batch.status, 200); assert.deepEqual(Object.keys(batch.body.wallets), [A, C, missing, B]);
  assert.equal(batch.body.wallets[C], null); assert.equal(batch.body.wallets[missing], null);
  assert.equal(batch.body.wallets[A].nativeBalanceSol, 0); assert.equal(batch.body.wallets[A].solPriceUsd, null);
  assert.equal(batch.body.wallets[B].totalValueUsd, null); assert.equal(batch.body.wallets[B].solPriceUsd, 100);
  for (const row of Object.values(batch.body.wallets)) if (row !== null) { assert.equal(row.perpCashUsd, null); assert.equal(Object.hasOwn(row, "holdings"), false); }
  assert.equal((await request(origin, { wallets: [A] }, false)).status, 401);
  assert.equal((await request(origin, { wallets: Array(51).fill(A) })).status, 400);
  const changed = JSON.parse(readFileSync(file, "utf8")); changed.observedAt = "2026-01-02T00:00:00Z"; changed.wallets[0].balance.totalValueUsd = 99;
  writeFileSync(file, JSON.stringify(changed));
  const fresh = await request(origin, { wallets: [A], fresh: true, holdings: true });
  assert.equal(fresh.body.wallets[A].totalValueUsd, 12.5); assert.equal(fresh.headers["x-reconstruction-observed-at"], "2026-01-01T00:00:00Z");
  await app.close();
  app = buildApp([], { portfolioBalancesStore: loadPortfolioBalancesStore(file) });
  origin = await app.listen({ host: "127.0.0.1", port: 0 });
  const restarted = await request(origin, { wallets: [A], fresh: true, holdings: true });
  assert.equal(restarted.body.wallets[A].totalValueUsd, 99); assert.equal(restarted.headers["x-reconstruction-observed-at"], changed.observedAt);
  const backend = resolve(here, "../..");
  const receipt = { status: "PASS", source_head: sourceHead, source_tree: "989da3646c3e9ae4b7d4b8060cea37611afb6115", node: process.version,
    synthetic_input_sha256: hash(readFileSync(resolve(here, "synthetic.json"))),
    source_sha256: Object.fromEntries(["src/app.ts", "src/server.ts", "src/portfolio-balances-store.ts", "src/portfolio-balances-routes.ts"].map(path => [path, hash(readFileSync(resolve(backend, path)))])),
    compiled_sha256: Object.fromEntries(["dist/app.js", "dist/portfolio-balances-store.js", "dist/portfolio-balances-routes.js"].map(path => [path, hash(readFileSync(resolve(backend, path)))])),
    observations, limits: "Explicit local aggregate facts only. No original backend source, production provider/RPC, valuation, owner capability, API authentication/scope parity, indexer or feature-milestone qualification." };
  mkdirSync(dirname(resolve(output)), { recursive: true }); writeFileSync(output, JSON.stringify(receipt, null, 2) + "\n");
  console.log(JSON.stringify({ status: "PASS", real_HTTP_requests: observations.length, explicit_restart: true, API_host_fresh_ignored: true, source_head: sourceHead }));
} finally { await app.close(); rmSync(dir, { recursive: true, force: true }); }
