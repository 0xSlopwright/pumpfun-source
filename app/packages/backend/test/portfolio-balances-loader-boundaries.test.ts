import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadPortfolioBalancesStore } from "../src/portfolio-balances-store.js";

const empty = {
  schemaVersion: 1,
  dataSource: "local-materialized",
  observedAt: "2026-10-28T00:00:00Z",
  wallets: [],
};

test(
  "balance materialization rejects a readerless FIFO without waiting for a writer",
  { skip: process.platform === "win32" },
  () => {
    const directory = fs.mkdtempSync(join(tmpdir(), "balances-fifo-"));
    try {
      const path = join(directory, "balances.fifo");
      execFileSync("mkfifo", [path], { timeout: 1000 });
      const result = spawnSync(
        process.execPath,
        [
          "--import",
          "tsx",
          "--input-type=module",
          "--eval",
          [
            "import assert from 'node:assert/strict';",
            "import { loadPortfolioBalancesStore } from './src/portfolio-balances-store.ts';",
            "assert.throws(() => loadPortfolioBalancesStore(process.argv[1]), /source must be a regular file/);",
          ].join("\n"),
          path,
        ],
        {
          cwd: fileURLToPath(new URL("../", import.meta.url)),
          encoding: "utf8",
          timeout: 5000,
          killSignal: "SIGKILL",
          maxBuffer: 64 * 1024,
        },
      );
      assert.notEqual(
        (result.error as NodeJS.ErrnoException | undefined)?.code,
        "ETIMEDOUT",
        "file-type rejection must not wait for a FIFO writer",
      );
      assert.ifError(result.error);
      assert.equal(result.status, 0, result.stderr || result.stdout);
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  },
);

test("balance loader closes descriptors for ordinary success, JSON/UTF-8 errors and nonregular input", (t) => {
  const directory = fs.mkdtempSync(join(tmpdir(), "balances-descriptor-"));
  const path = join(directory, "balances.json");
  const originalClose = fs.closeSync;
  const closed: number[] = [];
  const close = t.mock.method(fs, "closeSync", (fd: number) => {
    closed.push(fd);
    originalClose(fd);
  });
  syncBuiltinESMExports();
  try {
    for (const [source, succeeds] of [
      [JSON.stringify(empty), true],
      ["{", false],
      [Buffer.from([0xff]), false],
    ] as const) {
      fs.writeFileSync(path, source);
      closed.length = 0;
      if (succeeds)
        assert.equal(
          loadPortfolioBalancesStore(path).dataSource,
          "local-materialized",
        );
      else assert.throws(() => loadPortfolioBalancesStore(path));
      assert.equal(closed.length, 1);
      assert.throws(() => fs.fstatSync(closed[0]), { code: "EBADF" });
    }
    closed.length = 0;
    assert.throws(() => loadPortfolioBalancesStore(directory));
    // A platform may reject a directory at open, before acquiring a descriptor.
    assert.ok(closed.length <= 1);
    for (const fd of closed)
      assert.throws(() => fs.fstatSync(fd), { code: "EBADF" });
  } finally {
    close.mock.restore();
    syncBuiltinESMExports();
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

// Preserve this loader's existing symlink-following policy. Unlike the media
// snapshot loader, this correction does not add O_NOFOLLOW. POSIX FIFO/symlink
// controls skip Windows; Windows named-pipe behavior is not qualified here.
test(
  "a symlink to an ordinary balance materialization remains accepted",
  { skip: process.platform === "win32" },
  () => {
    const directory = fs.mkdtempSync(join(tmpdir(), "balances-symlink-"));
    try {
      const path = join(directory, "balances.json");
      const link = join(directory, "balances-link.json");
      fs.writeFileSync(path, JSON.stringify(empty));
      fs.symlinkSync(path, link);
      assert.equal(
        loadPortfolioBalancesStore(link).dataSource,
        "local-materialized",
      );
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  },
);
