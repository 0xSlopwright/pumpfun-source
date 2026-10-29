import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { buildApp } from "../src/app.js";
import {
  LocalMediaStore,
  LOCAL_MEDIA_PREFIX as P,
} from "../src/local-media-store.js";
import { startWithLocalMedia } from "../src/local-media-runtime.js";

const TOKEN = "synthetic-runtime-only-local-capability-12345";
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aK1cAAAAASUVORK5CYII=",
  "base64",
);
async function directory(t: TestContext) {
  const root = await mkdtemp(join(tmpdir(), "local-media-runtime-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

test("absent local configuration leaves the actual application disabled", async (t) => {
  const app = await startWithLocalMedia({}, async (localMedia) => {
    assert.equal(localMedia, undefined);
    return buildApp([], { localMedia });
  });
  t.after(() => app.close());
  assert.equal((await app.inject({ url: "/health" })).statusCode, 200);
  assert.equal(
    (await app.inject({ method: "POST", url: `${P}/images`, payload: {} }))
      .statusCode,
    501,
  );
});

test("partial/invalid capability or nonliteral loopback host fails before directory creation", async (t) => {
  const root = await directory(t);
  const path = join(root, "not-created");
  let invoked = 0;
  const invalid = [
    { LOCAL_MEDIA_DIRECTORY: path },
    { LOCAL_MEDIA_TOKEN: TOKEN },
    { LOCAL_MEDIA_DIRECTORY: path, LOCAL_MEDIA_TOKEN: "" },
    { LOCAL_MEDIA_DIRECTORY: " ", LOCAL_MEDIA_TOKEN: TOKEN },
    { LOCAL_MEDIA_DIRECTORY: path, LOCAL_MEDIA_TOKEN: "short" },
    ...[
      "0.0.0.0",
      "::",
      "localhost",
      "127.0.0.1.example",
      "203.0.113.4",
      "",
    ].map((HOST) => ({
      HOST,
      LOCAL_MEDIA_DIRECTORY: path,
      LOCAL_MEDIA_TOKEN: TOKEN,
    })),
  ];
  for (const environment of invalid) {
    await assert.rejects(
      startWithLocalMedia(environment, async () => {
        invoked++;
      }),
    );
  }
  assert.equal(invoked, 0);
  assert.deepEqual(await readdir(root), []);
});

test("actual buildApp opt-in serves synthetic bytes, retains unrelated routes, and releases ownership at shutdown", async (t) => {
  const path = await directory(t);
  const environment = {
    LOCAL_MEDIA_DIRECTORY: path,
    LOCAL_MEDIA_TOKEN: TOKEN,
    HOST: "127.0.0.1",
  };
  const fixture = {
    method: "GET",
    path: "/services/test/example",
    status: 200,
    body: { retained: true },
    source: "synthetic-test",
  };
  const app = await startWithLocalMedia(environment, async (localMedia) =>
    buildApp([fixture], { localMedia }),
  );
  t.after(() => app.close());
  const headers = {
    authorization: `Bearer ${TOKEN}`,
    "content-type": "image/png",
  };
  const response = await app.inject({
    method: "POST",
    url: `${P}/images`,
    headers,
    payload: PNG,
  });
  assert.equal(response.statusCode, 201);
  assert.deepEqual(
    (await app.inject({ url: fixture.path })).json(),
    fixture.body,
  );
  assert.equal(
    (await app.inject({ url: response.json().contentUri })).statusCode,
    401,
  );
  await assert.rejects(LocalMediaStore.open(path), { code: "EEXIST" });
  await app.close();
  const reopened = await LocalMediaStore.open(path);
  assert.deepEqual(reopened.getImage(response.json().id).content, PNG);
  await reopened.close();
});

test("build/registration/ready startup failures release only the opened store", async (t) => {
  const root = await directory(t);
  for (const failure of ["build", "register", "ready"]) {
    const path = join(root, failure);
    const error = new Error(`synthetic ${failure} failure`);
    await assert.rejects(
      startWithLocalMedia(
        { LOCAL_MEDIA_DIRECTORY: path, LOCAL_MEDIA_TOKEN: TOKEN },
        async (localMedia) => {
          assert.ok(localMedia);
          if (failure === "build")
            return buildApp(
              [
                {
                  method: "POST",
                  path: "/invalid-fixture",
                  status: 200,
                  body: {},
                  source: "synthetic",
                },
              ],
              { localMedia },
            );
          const app = buildApp([], { localMedia });
          t.after(() => app.close());
          if (failure === "register") throw error;
          app.register(async () => {
            throw error;
          });
          try {
            await app.ready();
          } catch (cause) {
            await app.close();
            throw cause;
          }
          return app;
        },
      ),
    );
    const reopened = await LocalMediaStore.open(path);
    await reopened.close();
  }
});

test("synthetic listen rejection is cleaned up without opening a network socket", async (t) => {
  const path = await directory(t);
  const failed = new Error("synthetic listen rejection");
  await assert.rejects(
    startWithLocalMedia(
      { LOCAL_MEDIA_DIRECTORY: path, LOCAL_MEDIA_TOKEN: TOKEN, HOST: "::1" },
      async (localMedia) => {
        const app = buildApp([], { localMedia });
        // Exercise the server's failure ordering without enabling a real service/token.
        const listen = async () => {
          throw failed;
        };
        try {
          await listen();
        } catch (error) {
          await app.close();
          throw error;
        }
        return app;
      },
    ),
    (error) => error === failed,
  );
  const reopened = await LocalMediaStore.open(path);
  await reopened.close();
});

test("a competing owner's lock is preserved and startup callback is not invoked", async (t) => {
  const path = await directory(t);
  const owner = await LocalMediaStore.open(path);
  t.after(() => owner.close());
  const before = await readFile(join(path, ".media-owner"));
  let invoked = false;
  await assert.rejects(
    startWithLocalMedia(
      { LOCAL_MEDIA_DIRECTORY: path, LOCAL_MEDIA_TOKEN: TOKEN },
      async () => {
        invoked = true;
      },
    ),
    { code: "EEXIST" },
  );
  assert.equal(invoked, false);
  assert.deepEqual(await readFile(join(path, ".media-owner")), before);
  await owner.close();
});

test("startup cleanup failures are reported instead of hiding lost ownership", async (t) => {
  const path = await directory(t);
  const startupError = new Error("synthetic startup failure");
  await assert.rejects(
    startWithLocalMedia(
      { LOCAL_MEDIA_DIRECTORY: path, LOCAL_MEDIA_TOKEN: TOKEN },
      async () => {
        // Deliberately replace our own synthetic lock with a directory to force close failure.
        await rm(join(path, ".media-owner"));
        await mkdir(join(path, ".media-owner"));
        throw startupError;
      },
    ),
    (error) =>
      error instanceof AggregateError &&
      error.errors[0] === startupError &&
      error.errors.length === 2,
  );
});

test("snapshot corruption fails before app construction and releases bootstrap ownership", async (t) => {
  const path = await directory(t);
  await writeFile(join(path, "media.json"), "invalid JSON");
  let invoked = false;
  await assert.rejects(
    startWithLocalMedia(
      { LOCAL_MEDIA_DIRECTORY: path, LOCAL_MEDIA_TOKEN: TOKEN },
      async () => {
        invoked = true;
      },
    ),
  );
  assert.equal(invoked, false);
  assert.deepEqual(await readdir(path), ["media.json"]);
});
