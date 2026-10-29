import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import Fastify from "fastify";
import { registerLocalMediaRoutes } from "../src/local-media-routes.js";
import { LocalMediaStore, LOCAL_MEDIA_PREFIX as P } from "../src/local-media-store.js";

// RFC 9110 section 8.3.1 makes media type and subtype tokens case-insensitive.
// Synthetic image only; the local route never contacts an external service.
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aK1cAAAAASUVORK5CYII=",
  "base64",
);
const token = "synthetic-test-only-local-capability-123456789";
const headers = { authorization: `Bearer ${token}` };

test("case-equivalent image uploads deduplicate and survive restart with canonical MIME", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "local-media-mime-"));
  let store = await LocalMediaStore.open(directory, { maxImages: 1 });
  let app = Fastify();
  registerLocalMediaRoutes(app, { store, token });
  t.after(async () => {
    await app.close();
    await store.close();
    await rm(directory, { recursive: true, force: true });
  });
  let imageId = "";
  for (const contentType of ["Image/PNG", "IMAGE/png; charset=binary", "image/png"]) {
    const response = await app.inject({
      method: "POST", url: `${P}/images`,
      headers: { ...headers, "content-type": contentType }, payload: PNG,
    });
    assert.equal(response.statusCode, imageId ? 200 : 201, contentType);
    assert.equal(response.json().mime, "image/png");
    if (imageId) assert.equal(response.json().id, imageId);
    imageId = response.json().id;
  }
  const mismatch = await app.inject({
    method: "POST", url: `${P}/images`,
    headers: { ...headers, "content-type": "Image/GIF" }, payload: PNG,
  });
  assert.equal(mismatch.statusCode, 415);
  assert.equal(mismatch.json().code, "LOCAL_MEDIA_IMAGE_TYPE");
  const saved = await app.inject({
    method: "POST", url: `${P}/metadata`, headers,
    payload: { imageId, name: "Synthetic", symbol: "TEST", description: "", showName: true },
  });
  assert.equal(saved.statusCode, 201);
  const metadataUri = saved.json().metadataUri;
  await app.close();
  await store.close();
  store = await LocalMediaStore.open(directory, { maxImages: 1 });
  app = Fastify();
  registerLocalMediaRoutes(app, { store, token });
  const descriptor = await app.inject({ url: `${P}/images/${imageId}`, headers });
  assert.equal(descriptor.statusCode, 200);
  assert.equal(descriptor.json().mime, "image/png");
  const content = await app.inject({ url: descriptor.json().contentUri, headers });
  assert.equal(content.statusCode, 200);
  assert.deepEqual(content.rawPayload, PNG);
  const metadata = await app.inject({ url: metadataUri, headers });
  assert.equal(metadata.statusCode, 200);
  assert.equal(metadata.json().image, descriptor.json().contentUri);
});
