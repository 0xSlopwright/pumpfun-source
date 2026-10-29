/**
 * Integer pagination on the posts sub-resources.
 *
 * contracts/developer.openapi.json declares limit/offset as integers, but
 * the posts sub-resources previously truncated fractional values and fell
 * back to the default for non-numeric or non-finite values, both with 200:
 * limit=1.5 served one row, limit=abc served the default page, offset=2.5
 * skipped two likers, and offset=abc served from the start. Sibling of the
 * user-pagination fix (#865), which rejects the same coercion on /v1/users.
 * Out-of-range safe integers keep the existing clamp behavior.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from './with-api-key.js';

const POST_1 = '00000000-0000-4000-8000-000000000001';

// '' and whitespace: Number('') === 0, so an empty value must not read as 0.
const INVALID_LIMIT_VALUES = ['', ' ', '1.5', '-1.5', 'NaN', 'Infinity', '-Infinity', 'abc', '9007199254740993'];
const INVALID_OFFSET_VALUES = ['', ' ', '2.5', '-2.5', 'NaN', 'Infinity', 'abc', '9007199254740993'];

describe('integer pagination on posts sub-resources', () => {
  test('non-integer limit is rejected on replies and quotes before any page is served', async () => {
    const app = buildApp([]);
    try {
      for (const relation of ['replies', 'quotes']) {
        for (const limit of INVALID_LIMIT_VALUES) {
          const res = await app.inject(`/v1/posts/${POST_1}/${relation}?limit=${encodeURIComponent(limit)}`);
          assert.equal(res.statusCode, 400, `${relation} limit=${limit}`);
          assert.deepEqual(res.json(), { statusCode: 400, error: 'INVALID_LIMIT' });
        }
      }
    } finally {
      await app.close();
    }
  });

  test('non-integer limit and offset are rejected on likers and reposters', async () => {
    const app = buildApp([]);
    try {
      for (const relation of ['likers', 'reposters']) {
        for (const limit of INVALID_LIMIT_VALUES) {
          const res = await app.inject(`/v1/posts/${POST_1}/${relation}?limit=${encodeURIComponent(limit)}`);
          assert.equal(res.statusCode, 400, `${relation} limit=${limit}`);
          assert.deepEqual(res.json(), { statusCode: 400, error: 'INVALID_LIMIT' });
        }
        for (const offset of INVALID_OFFSET_VALUES) {
          const res = await app.inject(`/v1/posts/${POST_1}/${relation}?limit=2&offset=${encodeURIComponent(offset)}`);
          assert.equal(res.statusCode, 400, `${relation} offset=${offset}`);
          assert.deepEqual(res.json(), { statusCode: 400, error: 'INVALID_OFFSET' });
        }
      }
    } finally {
      await app.close();
    }
  });

  test('valid integers and the existing clamp behavior are unchanged', async () => {
    const app = buildApp([]);
    try {
      const replies = await app.inject(`/v1/posts/${POST_1}/replies?limit=2`);
      assert.equal(replies.statusCode, 200);
      // A safe integer above the serving cap still clamps to 200, not 400.
      const capped = await app.inject(`/v1/posts/${POST_1}/replies?limit=500`);
      assert.equal(capped.statusCode, 200);
      const likers = await app.inject(`/v1/posts/${POST_1}/likers?limit=2&offset=-5`);
      assert.equal(likers.statusCode, 200);
      assert.equal(likers.json().likers.length, 2);
    } finally {
      await app.close();
    }
  });
});
