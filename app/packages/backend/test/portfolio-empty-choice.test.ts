import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../src/app.js';
import { PositionsStore } from '../src/positions-store.js';

test('portfolio enum defaults apply only to omitted query parameters', async () => {
  const store = new PositionsStore({schemaVersion:1, dataSource:'synthetic', observedAt:'2026-10-29T00:00:00.000Z', subjects:[{kind:'person', id:'empty', aliases:[], positions:[]}], coins:[], callouts:[], updates:[]});
  const app = buildApp([], {positionsStore:store});
  const headers = {authorization:`Bearer pf_live_${'a'.repeat(49)}`};
  try {
    for (const field of ['filter', 'sortBy']) for (const value of ['', '%20']) {
      const response = await app.inject({url:`/v1/user-portfolio/empty?${field}=${value}`, headers});
      assert.equal(response.statusCode, 400, `${field}=${value}`);
    }
    for (const query of ['', '?filter=all&sortBy=recency']) {
      assert.equal((await app.inject({url:`/v1/user-portfolio/empty${query}`,headers})).statusCode, 200);
    }
  } finally { await app.close(); }
});
