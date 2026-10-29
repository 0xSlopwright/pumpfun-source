import assert from 'node:assert/strict';
import test from 'node:test';
import { decodeCursor } from '../src/posts-store.js';
const cursor = (id: string, date = '2026-10-29T00:00:00Z') => Buffer.from(JSON.stringify([date, id])).toString('base64url');
test('cursor tie-break identifiers reject control and lone surrogate strings', () => {
  for (const id of ['post\u0000id', 'post\n', '\u007f', '\ud800', '\udfff']) assert.equal(decodeCursor(cursor(id)), null, JSON.stringify(id));
});
test('synthetic identities, astral text and the null-time sentinel remain supported', () => {
  for (const id of ['', 'synthetic-post', 'post-😀']) assert.deepEqual(decodeCursor(cursor(id, '')), { createdAt: '', postId: id });
});

import { buildApp } from './with-api-key.js';
import { SYNTHETIC_POSTS_SEED } from '../src/posts-store.js';
test('malformed identity cursors return 400 through both keyset routes', async () => {
  const app = buildApp([]);
  try {
    for (const relation of ['replies', 'quotes']) {
      for (const id of ['post\u0000id', '\ud800']) {
        const response = await app.inject(`/v1/posts/${SYNTHETIC_POSTS_SEED[0].postId}/${relation}?cursor=${cursor(id)}`);
        assert.equal(response.statusCode, 400);
        assert.equal(response.json().error, 'INVALID_CURSOR');
      }
    }
  } finally { await app.close(); }
});
