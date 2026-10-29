import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
const { GET } = createRequire(import.meta.url)('../../frontend/src/app/api/leaderboard/route.ts');
test('duplicate decoded query keys and invalid filters fail without a network request', async () => {
  const previous = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('unexpected network'); };
  try {
    for (const query of ['category=traders&category=creators', 'page=1&%70age=2', 'period=daily&period=weekly', 'sort=combined&sort=bad', 'status=live&status=ended', 'id=one&id=two', 'category=traders&period=bad', 'category=traders&sort=bad', 'category=creators&period=bad', 'category=competitions&status=bad', 'category=competitions&id=%2Fbad']) {
      const response = await GET(new Request('http://localhost/api/leaderboard?' + query));
      assert.equal(response.status, 400, query);
      assert.equal(response.headers.get('cache-control'), 'no-store');
    }
    assert.equal(calls, 0);
  } finally { globalThis.fetch = previous; }
});
