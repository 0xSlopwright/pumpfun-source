import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { request } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";
import { buildApp } from "../src/app.js";
import {
  LOCAL_MEDIA_PREFIX as P,
  LocalMediaStore,
} from "../src/local-media-store.js";

// Publicly recognizable synthetic values, never issued/operator credentials.
const TOKEN = "synthetic-test-only-local-capability-123456789";
const VALID = `Bearer ${TOKEN}`;
const OTHER = "Bearer synthetic-test-only-other-capability-987654321";
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aK1cAAAAASUVORK5CYII=",
  "base64",
);

async function setup(t: TestContext) {
  const directory = await mkdtemp(join(tmpdir(), "media-authorization-"));
  const store = await LocalMediaStore.open(directory);
  let app: ReturnType<typeof buildApp> | undefined;
  t.after(async () => {
    try {
      await app?.close();
    } finally {
      await store.close();
      await rm(directory, { recursive: true, force: true });
    }
  });
  const image = await store.putImage(PNG, "image/png");
  const draft = {
    imageId: image.id,
    name: "Synthetic initial metadata",
    symbol: "TEST",
    description: "No real upload or credential.",
    showName: true,
  };
  const metadata = await store.putMetadata(draft);
  app = buildApp([], { localMedia: { store, token: TOKEN } });
  await app.listen({ host: "127.0.0.1", port: 0 });
  const address = app.server.address();
  assert.ok(address && typeof address !== "string");
  const port = address.port;

  async function send(
    method: string,
    path: string,
    credentials: string[],
    payload?: unknown,
    extraHeaders: string[] = [],
  ) {
    const body = payload === undefined ? undefined : JSON.stringify(payload);
    return new Promise<{ status: number | undefined; body: string }>(
      (resolve, reject) => {
        const req = request(
          {
            host: "127.0.0.1",
            port,
            method,
            path,
            // A raw array preserves repeated field names through the real HTTP parser.
            headers: [
              "Host",
              "127.0.0.1",
              ...credentials.flatMap((value, index) => [
                index % 2 ? "aUtHoRiZaTiOn" : "Authorization",
                value,
              ]),
              ...extraHeaders,
              ...(body === undefined
                ? []
                : [
                    "Content-Type",
                    "application/json",
                    "Content-Length",
                    String(Buffer.byteLength(body)),
                  ]),
            ],
          },
          (response) => {
            let result = "";
            response.setEncoding("utf8");
            response.on("data", (chunk) => (result += chunk));
            response.on("error", reject);
            response.on("end", () =>
              resolve({ status: response.statusCode, body: result }),
            );
          },
        );
        req.setTimeout(5_000, () =>
          req.destroy(new Error("Local test timeout")),
        );
        req.on("error", reject);
        req.end(body);
      },
    );
  }
  return { directory, store, app, image, metadata, draft, send };
}

for (const [label, credentials] of [
  ["valid then wrong", [VALID, OTHER]],
  ["wrong then valid", [OTHER, VALID]],
  ["identical valid values", [VALID, VALID]],
  ["valid then empty", [VALID, ""]],
  ["empty then valid", ["", VALID]],
  ["three fields", [VALID, OTHER, VALID]],
] as const) {
  test(`raw duplicate Authorization is rejected before media handlers: ${label}`, async (t) => {
    const { directory, metadata, draft, send } = await setup(t);
    const before = await readFile(join(directory, "media.json"));
    const responses = [];
    for (const [method, path, payload] of [
      ["GET", `${P}/metadata/${metadata.id}/content`, undefined],
      ["HEAD", `${P}/metadata/${metadata.id}/content`, undefined],
      ["POST", `${P}/metadata`, { ...draft, name: "Must not be published" }],
      ["DELETE", `${P}/metadata/${metadata.id}`, undefined],
    ] as const) {
      const response = await send(method, path, [...credentials], payload);
      responses.push({ method, ...response });
    }
    for (const response of responses) {
      assert.equal(response.status, 401, response.method);
      if (response.method === "HEAD") assert.equal(response.body, "");
      else
        assert.deepEqual(JSON.parse(response.body), {
          code: "LOCAL_MEDIA_AUTH_REQUIRED",
        });
      assert.doesNotMatch(response.body, /Bearer|synthetic-test-only/);
    }
    assert.deepEqual(await readFile(join(directory, "media.json")), before);
  });
}

test("single raw capability remains usable for read/write/delete; unrelated developer key is not a capability source", async (t) => {
  const { metadata, draft, send } = await setup(t);
  assert.equal(
    (await send("GET", `${P}/metadata/${metadata.id}`, [VALID])).status,
    200,
  );
  const head = await send("HEAD", metadata.metadataUri, [VALID]);
  assert.equal(head.status, 200);
  assert.equal(head.body, "");
  const saved = await send("POST", `${P}/metadata`, [VALID], {
    ...draft,
    name: "Synthetic second metadata",
  });
  assert.equal(saved.status, 201);
  assert.equal(
    (
      await send("DELETE", `${P}/metadata/${JSON.parse(saved.body).id}`, [
        VALID,
      ])
    ).status,
    204,
  );
  const developer = `pf_live_${"A".repeat(49)}`;
  assert.equal(
    (
      await send("GET", metadata.metadataUri, [], undefined, [
        "X-API-Key",
        developer,
      ])
    ).status,
    401,
  );
  // X-API-Key is not an alternate source for this independent local capability.
  assert.equal(
    (
      await send("GET", metadata.metadataUri, [VALID], undefined, [
        "X-API-Key",
        developer,
      ])
    ).status,
    200,
  );
});

test("single capability does not relax Origin, direct-loopback or default-off guards", async (t) => {
  const { metadata, send, app } = await setup(t);
  assert.equal(
    (
      await send("GET", metadata.metadataUri, [VALID], undefined, [
        "Origin",
        "null",
      ])
    ).status,
    403,
  );
  assert.equal(
    (
      await app.inject({
        url: metadata.metadataUri,
        headers: { authorization: VALID },
        remoteAddress: "198.51.100.1",
      })
    ).statusCode,
    403,
  );
  const disabled = buildApp();
  t.after(() => disabled.close());
  assert.equal(
    (
      await disabled.inject({
        url: metadata.metadataUri,
        headers: { authorization: VALID },
      })
    ).statusCode,
    501,
  );
});
