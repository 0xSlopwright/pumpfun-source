/**
 * Integer pagination on the PnL board.
 *
 * contracts/developer.openapi.json declares limit and positionsLimit on
 * /pnl-leaderboard as integers, but the route previously truncated fractional
 * values and fell back to the default for non-numeric or non-finite values,
 * both with 200: limit=1.5 served one row, limit=abc served the default
 * board, positionsLimit=2.5 served two positions, and positionsLimit=abc
 * served the default three. Sibling of the posts-sub-resource pagination fix
 * (#902), which rejects the same coercion on /v1/posts sub-resources, and
 * the user-pagination fix (#865). Out-of-range safe integers keep the
 * existing store clamp behavior (limit ceiling 100, positionsLimit ceiling
 * 5, 0 = count-only).
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from './with-api-key.js';

const INVALID_LIMIT_VALUES = [
  '1.5',
  '-1.5',
  'NaN',
  'Infinity',
  '-Infinity',
  'abc',
  '',
  '9007199254740993',
];
const INVALID_POSITIONS_LIMIT_VALUES = [
  '2.5',
  '-2.5',
  'NaN',
  'Infinity',
  'abc',
  '',
  '9007199254740993',
];

describe('integer pagination on /v1/pnl-leaderboard', () => {
  test('non-integer limit is rejected before any board is served', async () => {
    const app = buildApp([]);
    try {
      for (const limit of INVALID_LIMIT_VALUES) {
        const res = await app.inject(
          `/v1/pnl-leaderboard?period=daily&limit=${encodeURIComponent(limit)}`,
        );
        assert.equal(res.statusCode, 400, `limit=${limit}`);
        assert.deepEqual(res.json(), {
          statusCode: 400,
          error: 'INVALID_LIMIT',
        });
      }
    } finally {
      await app.close();
    }
  });

  test('non-integer positionsLimit is rejected before any board is served', async () => {
    const app = buildApp([]);
    try {
      for (const positionsLimit of INVALID_POSITIONS_LIMIT_VALUES) {
        const res = await app.inject(
          `/v1/pnl-leaderboard?period=daily&positionsLimit=${encodeURIComponent(positionsLimit)}`,
        );
        assert.equal(res.statusCode, 400, `positionsLimit=${positionsLimit}`);
        assert.deepEqual(res.json(), {
          statusCode: 400,
          error: 'INVALID_POSITIONS_LIMIT',
        });
      }
    } finally {
      await app.close();
    }
  });

  test('valid integers and the existing clamp behavior are unchanged', async () => {
    const app = buildApp([]);
    try {
      const limited = await app.inject(
        '/v1/pnl-leaderboard?period=daily&limit=2',
      );
      assert.equal(limited.statusCode, 200);
      assert.equal(
        (limited.json() as { entries: unknown[] }).entries.length,
        2,
      );
      // A safe integer above the serving cap still clamps to 100, not 400.
      const capped = await app.inject(
        '/v1/pnl-leaderboard?period=daily&limit=500',
      );
      assert.equal(capped.statusCode, 200);
      // positionsLimit=0 still means count-only, as the store documents.
      const countOnly = await app.inject(
        '/v1/pnl-leaderboard?period=daily&limit=1&positionsLimit=0',
      );
      assert.equal(countOnly.statusCode, 200);
      assert.equal(
        (countOnly.json() as { entries: { topPositions: unknown[] }[] })
          .entries[0].topPositions.length,
        0,
      );
    } finally {
      await app.close();
    }
  });
});
