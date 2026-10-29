import { test } from "node:test";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  writeFileSync,
  truncateSync,
  rmSync,
  existsSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadPositionsStore } from "../src/positions-store.js";
const empty = {
  schemaVersion: 1,
  dataSource: "local-materialized",
  observedAt: "2026-10-28T00:00:00Z",
  subjects: [],
  coins: [],
  callouts: [],
  updates: [],
};
test("startup loader validates a local file; malformed, oversized, non-UTF8 and nonregular imports fail", () => {
  const dir = mkdtempSync(join(tmpdir(), "positions-"));
  try {
    const file = join(dir, "positions.json");
    writeFileSync(file, JSON.stringify(empty));
    assert.equal(loadPositionsStore(file).dataSource, "local-materialized");
    writeFileSync(file, "{");
    assert.throws(() => loadPositionsStore(file));
    writeFileSync(file, Buffer.from([0xff]));
    assert.throws(() => loadPositionsStore(file));
    writeFileSync(file, "{}");
    truncateSync(file, 16 * 1024 * 1024 + 1);
    assert.throws(() => loadPositionsStore(file), /16 MiB/);
    assert.throws(() => loadPositionsStore(dir), /regular file/);
    assert.throws(() => loadPositionsStore(join(dir, "missing.json")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("invalid startup materialization fails before server.listen is invoked", () => {
  const dir = mkdtempSync(join(tmpdir(), "positions-startup-"));
  try {
    const source = join(dir, "bad.json"),
      marker = join(dir, "listen-reached"),
      preload = join(dir, "listen-check.mjs");
    writeFileSync(source, JSON.stringify({ ...empty, schemaVersion: 999 }));
    writeFileSync(
      preload,
      `import { Server } from 'node:net'; import { writeFileSync } from 'node:fs'; Server.prototype.listen = function () { writeFileSync(${JSON.stringify(marker)}, 'called'); throw new Error('LISTEN_REACHED'); };`,
    );
    assert.throws(
      () =>
        execFileSync(
          process.execPath,
          ["--import", "tsx", "--import", pathToFileURL(preload).href, "src/server.ts"],
          {
            cwd: fileURLToPath(new URL("../", import.meta.url)),
            env: {
              ...process.env,
              POSITIONS_FILE: source,
              FIXTURES_FILE: "",
              HOST: "127.0.0.1",
              PORT: "0",
            },
            stdio: "pipe",
            timeout: 10000,
          },
        ),
      (error: unknown) => {
        const result = error as { status?: number; stderr?: Buffer };
        assert.equal(result.status, 1);
        assert.match(
          String(result.stderr),
          /Invalid positions materialization/,
        );
        return true;
      },
    );
    assert.equal(existsSync(marker), false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
