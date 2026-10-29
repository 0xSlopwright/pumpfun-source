import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cp,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

async function workspace(run) {
  const root = await mkdtemp(join(tmpdir(), "auth-fixture-helper-"));
  const frontend = join(root, "frontend");
  await mkdir(join(frontend, "tests/auth-fixture"), { recursive: true });
  await mkdir(join(frontend, "src/app"), { recursive: true });
  const helper = join(frontend, "tests/with-auth-fixture.mjs");
  await cp(
    new URL(
      "../packages/frontend/tests/with-auth-fixture.mjs",
      import.meta.url,
    ),
    helper,
  );
  await writeFile(
    join(frontend, "tests/auth-fixture/page.tsx.in"),
    "// synthetic test-only page\n",
  );
  try {
    await run({
      frontend,
      helper,
      route: join(frontend, "src/app/auth-interface-test"),
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function invoke(helper, code, enabled = true) {
  const env = { ...process.env };
  delete env.AUTH_INTERFACE_TEST_MODE;
  if (enabled) env.AUTH_INTERFACE_TEST_MODE = "1";
  return spawnSync(process.execPath, [helper, process.execPath, "-e", code], {
    env,
    encoding: "utf8",
  });
}

test("auth fixture helper requires explicit mode and refuses existing routes", async () => {
  await workspace(async ({ helper, route }) => {
    const disabled = invoke(helper, "process.exit(0)", false);
    assert.notEqual(disabled.status, 0);
    assert.match(disabled.stderr, /explicit AUTH_INTERFACE_TEST_MODE/);
    await assert.rejects(lstat(route), { code: "ENOENT" });
    await mkdir(route);
    await writeFile(join(route, "page.tsx"), "owned by another task");
    const collision = invoke(helper, "process.exit(0)");
    assert.notEqual(collision.status, 0);
    assert.match(collision.stderr, /pre-existing/);
    assert.equal(
      await readFile(join(route, "page.tsx"), "utf8"),
      "owned by another task",
    );
  });
});

test("auth fixture is present for the child and removed after success or failure", async () => {
  for (const exitCode of [0, 3])
    await workspace(async ({ helper, route }) => {
      const result = invoke(
        helper,
        `const fs=require('node:fs');if(!fs.existsSync('src/app/auth-interface-test/page.tsx'))process.exit(9);process.exit(${exitCode})`,
      );
      assert.equal(result.status, exitCode, result.stderr);
      assert.match(
        result.stdout,
        /Removed temporary auth test route; fixture SHA-256/,
      );
      await assert.rejects(lstat(route), { code: "ENOENT" });
    });
});

test("changed fixture bytes are not silently deleted", async () => {
  await workspace(async ({ helper, route }) => {
    const result = invoke(
      helper,
      "require('node:fs').writeFileSync('src/app/auth-interface-test/page.tsx','unexpected edit')",
    );
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /refusing to delete changed bytes/);
    assert.equal(
      await readFile(join(route, "page.tsx"), "utf8"),
      "unexpected edit",
    );
  });
});
