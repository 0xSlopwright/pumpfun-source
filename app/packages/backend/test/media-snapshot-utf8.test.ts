import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { LocalMediaStore } from '../src/local-media-store.js';
test('malformed snapshot UTF-8 cannot repair itself into a valid hashed record', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'media-utf8-'));
  try {
    const store = await LocalMediaStore.open(directory);
    const image = await store.putImage(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aK1cAAAAASUVORK5CYII=', 'base64'), 'image/png');
    await store.putMetadata({ imageId: image.id, name: 'Synthetic', symbol: 'TEST', description: '\uFFFD', showName: true });
    await store.close();
    const path = join(directory, 'media.json');
    const original = await readFile(path);
    const index = original.indexOf(Buffer.from('\uFFFD'));
    assert.ok(index >= 0);
    await writeFile(path, Buffer.concat([original.subarray(0, index), Buffer.from([255]), original.subarray(index + 3)]));
    await assert.rejects(LocalMediaStore.open(directory));
    await writeFile(path, original);
    const restored = await LocalMediaStore.open(directory);
    await restored.close();
  } finally { await rm(directory, { recursive: true, force: true }); }
});
