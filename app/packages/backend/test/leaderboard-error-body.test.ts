import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';
const { GET } = createRequire(import.meta.url)('../../frontend/src/app/api/leaderboard/route.ts');

test('leaderboard HTTP failures cancel unused bodies and preserve their mapped errors', async (t) => {
  const previousKey = process.env.PUMPFUN_DEVELOPER_API_KEY;
  process.env.PUMPFUN_DEVELOPER_API_KEY = 'synthetic-local-test-key';
  t.after(() => {
    if (previousKey === undefined) delete process.env.PUMPFUN_DEVELOPER_API_KEY;
    else process.env.PUMPFUN_DEVELOPER_API_KEY = previousKey;
  });
  let upstream: Response;
  t.mock.method(globalThis, 'fetch', async () => upstream);
  for (const [status, expectedStatus, code] of [
    [401, 503, 'DATA_SOURCE_UNAUTHORIZED'],
    [403, 503, 'DATA_SOURCE_UNAUTHORIZED'],
    [429, 429, 'RATE_LIMITED'],
    [503, 503, 'UPSTREAM_FAILURE'],
    [500, 502, 'UPSTREAM_FAILURE'],
  ] as const) {
    let cancelled = false;
    let reads = 0;
    upstream = new Response(new ReadableStream({
      pull() { reads++; },
      cancel() { cancelled = true; },
    }, { highWaterMark: 0 }), { status });
    const response = await GET(new Request('http://localhost/api/leaderboard'));
    assert.equal(response.status, expectedStatus, String(status));
    assert.equal((await response.json()).error.code, code);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(cancelled, true, `${status} body must be released before returning`);
    assert.equal(reads, 0, 'discarded error bodies must not be parsed');
  }

  upstream = new Response(new ReadableStream({
    cancel() { throw new Error('synthetic cleanup failure'); },
  }), { status: 429 });
  const cleanupFailure = await GET(new Request('http://localhost/api/leaderboard'));
  assert.equal(cleanupFailure.status, 429);
  assert.equal((await cleanupFailure.json()).error.code, 'RATE_LIMITED');

  upstream = new Response(null, { status: 401 });
  assert.equal((await GET(new Request('http://localhost/api/leaderboard'))).status, 503);

  upstream = Response.json({ entries: [], periodType: 0, periodLabel: 'Daily', windowStartSec: 0 });
  const success = await GET(new Request('http://localhost/api/leaderboard'));
  assert.equal(success.status, 200);
  assert.equal((await success.json()).ok, true);
});
