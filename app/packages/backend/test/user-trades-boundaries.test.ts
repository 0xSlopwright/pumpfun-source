import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { UserTradesStore, type UserTradesDataset } from "../src/user-trades-store.js";

function dataset(): UserTradesDataset {
  return {
    schemaVersion: 1, dataSource: "synthetic", observedAt: "2026-10-29T00:00:00Z",
    users: [], wallets: [{ address: "synthetic-wallet", chainId: 101, userId: null }],
    rows: [{ kind: "trade", facts: {
      tx: "synthetic-tx", isBuy: true, timestamp: null, amountUsd: null,
      baseAmount: null, priceUsd: null, mint: "synthetic-mint", chainId: 101,
      walletAddress: "synthetic-wallet", userId: null,
      slotIndexId: "00000000000000000000000001", amountSol: null,
    } }], coins: [], traders: [],
  };
}
test("a missing coin lookup omits enrichment without dropping the trade", () => {
  const page = new UserTradesStore(dataset()).page("synthetic-wallet")!;
  assert.equal(page.trades.length, 1);
  assert.deepEqual(page.coins, []);
});
test("another chain's card does not fabricate metadata for a lookup miss", () => {
  const data = dataset();
  data.coins.push({ mint: "synthetic-mint", chainId: 8453, name: "Other chain", symbol: null, image: null });
  const page = new UserTradesStore(data).page("synthetic-wallet")!;
  assert.equal(page.trades[0].chainId, 101);
  assert.deepEqual(page.coins, []);
});
test("a supplied exact-identity card may still have independently null attributes", () => {
  const data = dataset();
  const coin = { mint: "synthetic-mint", chainId: 101, name: null, symbol: null, image: null };
  data.coins.push(coin);
  assert.deepEqual(new UserTradesStore(data).page("synthetic-wallet")!.coins, [coin]);
});
test("FIFO startup input is rejected without waiting for a writer", { skip: process.platform === "win32" }, () => {
  const dir = mkdtempSync(join(tmpdir(), "user-trades-fifo-"));
  try {
    const fifo = join(dir, "facts.fifo"); execFileSync("mkfifo", [fifo]);
    const loader = new URL("../src/user-trades-store.ts", import.meta.url).href;
    assert.throws(() => execFileSync(process.execPath,
      ["--import", "tsx", "--input-type=module", "--eval",
        `import { loadUserTradesStore } from ${JSON.stringify(loader)}; loadUserTradesStore(${JSON.stringify(fifo)});`],
      { cwd: fileURLToPath(new URL("../", import.meta.url)), stdio: "pipe", timeout: 2000 }),
      (error: unknown) => {
        const result = error as { status?: number; stderr?: Buffer; code?: string };
        assert.notEqual(result.code, "ETIMEDOUT");
        assert.equal(result.status, 1);
        assert.match(String(result.stderr), /must be a regular file/);
        return true;
      });
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
