/** Opt-in temporary test route. Never overwrite or delete an unrelated route. */
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import {
  lstat,
  mkdir,
  readFile,
  realpath,
  rmdir,
  unlink,
  writeFile,
} from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

if (process.env.AUTH_INTERFACE_TEST_MODE !== "1") {
  throw new Error(
    "Temporary auth fixture requires explicit AUTH_INTERFACE_TEST_MODE=1 in an isolated test checkout",
  );
}
const [command, ...args] = process.argv.slice(2);
if (!command)
  throw new Error(
    "Pass the existing local test command after with-auth-fixture.mjs",
  );
const frontend = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const app = join(frontend, "src/app");
if ((await realpath(app)) !== app)
  throw new Error("Test app directory cannot be symlinked");
const directory = join(app, "auth-interface-test");
const target = join(directory, "page.tsx");
try {
  await lstat(directory);
  throw new Error(
    "Refusing to overwrite pre-existing auth-interface-test route",
  );
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const bytes = await readFile(
  new URL("auth-fixture/page.tsx.in", import.meta.url),
);
const hash = (value) => createHash("sha256").update(value).digest("hex");
const expected = hash(bytes);
await mkdir(directory);
let wrote = false;
try {
  await writeFile(target, bytes, { flag: "wx" });
  wrote = true;
  if (hash(await readFile(target)) !== expected)
    throw new Error("Test fixture write verification failed");
  const child = spawn(command, args, {
    cwd: frontend,
    stdio: "inherit",
    env: process.env,
  });
  const forward = (signal) => child.kill(signal);
  process.on("SIGINT", forward);
  process.on("SIGTERM", forward);
  try {
    process.exitCode = await new Promise((resolveStatus, reject) => {
      child.once("error", reject);
      child.once("exit", (code, signal) =>
        resolveStatus(code ?? (signal ? 1 : 0)),
      );
    });
  } finally {
    process.off("SIGINT", forward);
    process.off("SIGTERM", forward);
  }
} finally {
  if (wrote) {
    if (hash(await readFile(target)) !== expected) {
      throw new Error(
        "Test fixture changed during execution; refusing to delete changed bytes",
      );
    }
    await unlink(target);
  }
  await rmdir(directory);
  try {
    await lstat(directory);
    throw new Error("Temporary auth fixture cleanup failed");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  console.log(`Removed temporary auth test route; fixture SHA-256 ${expected}`);
}
