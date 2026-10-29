import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadPositionsStore } from "../src/positions-store.js";

const cwd = fileURLToPath(new URL("../", import.meta.url));
const empty = {
  schemaVersion: 1,
  dataSource: "local-materialized",
  observedAt: "2026-10-28T00:00:00Z",
  subjects: [],
  coins: [],
  callouts: [],
  updates: [],
};

// POSIX FIFOs without a writer; Windows named-pipe behavior is not claimed.
// Ordinary-file and descriptor controls below still run on Windows.
function child(source: string[], path: string) {
  const result = spawnSync(
    process.execPath,
    [
      "--import",
      "tsx",
      "--input-type=module",
      "--eval",
      source.join("\n"),
      path,
    ],
    {
      cwd,
      encoding: "utf8",
      timeout: 5000,
      killSignal: "SIGKILL",
      maxBuffer: 64 * 1024,
    },
  );
  assert.notEqual(
    (result.error as NodeJS.ErrnoException | undefined)?.code,
    "ETIMEDOUT",
    "regular-file admission must not wait for a FIFO writer",
  );
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

test(
  "positions rejects a readerless FIFO before reading, rather than hanging startup",
  { skip: process.platform === "win32" },
  () => {
    const directory = fs.mkdtempSync(join(tmpdir(), "positions-fifo-"));
    try {
      const path = join(directory, "positions.fifo");
      execFileSync("mkfifo", [path], { timeout: 1000 });
      child(
        [
          "import assert from 'node:assert/strict';",
          "import { loadPositionsStore } from './src/positions-store.ts';",
          "assert.throws(() => loadPositionsStore(process.argv[1]), /must be a regular file/);",
        ],
        path,
      );
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  },
);

test(
  "media rejects a readerless FIFO and releases its ownership lock after failure",
  { skip: process.platform === "win32" },
  () => {
    const directory = fs.mkdtempSync(join(tmpdir(), "media-fifo-"));
    try {
      const path = join(directory, "media.json");
      execFileSync("mkfifo", [path], { timeout: 1000 });
      child(
        [
          "import assert from 'node:assert/strict';",
          "import { existsSync, unlinkSync } from 'node:fs';",
          "import promises from 'node:fs/promises';",
          "import { syncBuiltinESMExports } from 'node:module';",
          "import { join } from 'node:path';",
          "import { LocalMediaStore } from './src/local-media-store.ts';",
          "const opened = []; const originalOpen = promises.open;",
          "promises.open = async (...args) => { const file = await originalOpen(...args); opened.push(file); return file; };",
          "syncBuiltinESMExports();",
          "const directory = process.argv[1];",
          "await assert.rejects(LocalMediaStore.open(directory), /Invalid local media snapshot/);",
          "assert.equal(opened.length, 2);",
          "assert.ok(opened.every((file) => file.fd === -1), 'snapshot and owner descriptors must close');",
          "assert.equal(existsSync(join(directory, '.media-owner')), false);",
          "unlinkSync(join(directory, 'media.json'));",
          "const store = await LocalMediaStore.open(directory);",
          "await store.close();",
          "assert.ok(opened.every((file) => file.fd === -1));",
          "assert.equal(existsSync(join(directory, '.media-owner')), false);",
          "promises.open = originalOpen; syncBuiltinESMExports();",
        ],
        directory,
      );
      assert.equal(fs.existsSync(join(directory, ".media-owner")), false);
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  },
);

test("positions closes the descriptor for valid JSON, malformed JSON, invalid UTF-8 and nonregular files", (t) => {
  const directory = fs.mkdtempSync(join(tmpdir(), "positions-descriptor-"));
  const path = join(directory, "positions.json");
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
        assert.equal(loadPositionsStore(path).dataSource, "local-materialized");
      else assert.throws(() => loadPositionsStore(path));
      assert.equal(closed.length, 1);
      assert.throws(() => fs.fstatSync(closed[0]), { code: "EBADF" });
    }
    closed.length = 0;
    assert.throws(() => loadPositionsStore(directory));
    // Some platforms reject a directory at open rather than after fstat.
    assert.ok(closed.length <= 1);
    for (const fd of closed)
      assert.throws(() => fs.fstatSync(fd), { code: "EBADF" });
  } finally {
    close.mock.restore();
    syncBuiltinESMExports();
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
