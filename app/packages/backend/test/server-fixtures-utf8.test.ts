import { test } from "node:test";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function setup(t: { after: (fn: () => void) => void }) {
  const dir = mkdtempSync(join(tmpdir(), "server-fixtures-utf8-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const marker = join(dir, "listen-reached");
  const preload = join(dir, "listen-check.mjs");
  writeFileSync(
    preload,
    `import { Server } from 'node:net'; import { writeFileSync } from 'node:fs'; Server.prototype.listen = function () { writeFileSync(${JSON.stringify(marker)}, 'called'); throw new Error('LISTEN_REACHED'); };`,
  );
  const spawn = (fixturesFile: string) =>
    execFileSync(
      process.execPath,
      ["--import", "tsx", "--import", preload, "src/server.ts"],
      {
        cwd: fileURLToPath(new URL("../", import.meta.url)),
        env: {
          ...process.env,
          HOST: "127.0.0.1",
          PORT: "0",
          FIXTURES_FILE: fixturesFile,
        },
        stdio: "pipe",
        timeout: 15000,
      },
    );
  return { dir, marker, spawn };
}

test("malformed UTF-8 in FIXTURES_FILE fails startup before listen", (t) => {
  const { dir, marker, spawn } = setup(t);
  const file = join(dir, "bad-fixtures.json");
  const prefix = Buffer.from(
    '[{"method":"GET","path":"/synthetic-utf8","status":200,"body":{"label":"a',
  );
  const suffix = Buffer.from('b"},"source":"synthetic-test"}]');
  // A lossy "utf8" read would replace 0xff with U+FFFD and serve the altered
  // fixture; the fatal decoder must reject startup instead.
  writeFileSync(file, Buffer.concat([prefix, Buffer.from([0xff]), suffix]));
  assert.throws(
    () => spawn(file),
    (error: unknown) => {
      const result = error as { status?: number; stderr?: Buffer };
      assert.equal(result.status, 1);
      assert.match(String(result.stderr), /not valid/);
      return true;
    },
  );
  assert.equal(existsSync(marker), false);
});

test("valid UTF-8 fixtures still reach listen", (t) => {
  const { dir, marker, spawn } = setup(t);
  const file = join(dir, "good-fixtures.json");
  writeFileSync(
    file,
    '[{"method":"GET","path":"/synthetic-utf8","status":200,"body":{"label":"ab"},"source":"synthetic-test"}]',
  );
  assert.throws(
    () => spawn(file),
    (error: unknown) => {
      const result = error as { status?: number; stderr?: Buffer };
      assert.match(String(result.stderr), /LISTEN_REACHED/);
      return true;
    },
  );
  assert.equal(existsSync(marker), true);
});
