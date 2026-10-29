import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { followListQueryOptions, paginateFollowList, setFollowListPage } from
  '../packages/frontend/src/lib/original-follow-list.mjs';

test('query options expose the actual callback/policy without an implicit transport or request', async () => {
  const calls = [];
  const options = followListQueryOptions(async (...args) => { calls.push(args); return []; }, 'followers', 'subject');
  assert.equal(calls.length, 0);
  assert.deepEqual(Object.keys(options), ['queryKey', 'enabled', 'queryFn', 'staleTime', 'refetchInterval',
    'refetchIntervalInBackground', 'refetchOnWindowFocus']);
  assert.equal(options.staleTime, 30000); assert.equal(options.refetchInterval, 60000);
  assert.equal(options.refetchIntervalInBackground, false); assert.equal(options.refetchOnWindowFocus, true);
  const signal = new AbortController().signal;
  assert.deepEqual(await options.queryFn({ signal }), []);
  assert.deepEqual(calls, [['GET /following/v3/followers/{userId}', { params: { userId: 'subject' }, query: { limit: 1000 }, signal }]]);
});

test('query callback captures option values and allocates fresh request containers per invocation', async () => {
  const input = { sort: 'recent', searchTerm: '  original  ' };
  const seen = [];
  const options = followListQueryOptions(async (operation, value) => {
    seen.push({ operation, userId: value.params.userId, query: { ...value.query } });
    value.params.userId = 'transport mutated'; value.query.limit = 1;
    return [{ user_id: 'legacy', userId: 'new', address: null, kind: null, extra: 7 }];
  }, 'following', 'subject', input);
  input.sort = 'followers'; input.searchTerm = 'changed';
  for (let i = 0; i < 2; i++) assert.deepEqual(await options.queryFn({}), [
    { user_id: 'legacy', userId: 'legacy', address: '', kind: 'person', extra: 7 },
  ]);
  assert.deepEqual(seen, Array(2).fill({ operation: 'GET /following/v3/following/search/{userId}',
    userId: 'subject', query: { searchTerm: '  original  ', limit: 100 } }));
  assert.deepEqual(options.queryKey, ['follow-list', 'following', 'subject', 'recent', '  original  ']);
});

test('enablement is query-runtime policy; manually invoked callback has no added subject guard', async () => {
  const seen = [];
  const options = followListQueryOptions(async (...args) => { seen.push(args); return { not: 'an array' }; }, 'followers', undefined, { enabled: false });
  assert.equal(options.enabled, false);
  assert.deepEqual(await options.queryFn({}), []);
  assert.equal(seen[0][1].params.userId, undefined);
});

test('transport failure and invalid row failure propagate without invented error conversion', async () => {
  const error = new Error('caller transport owns HTTP and retry behavior');
  const options = followListQueryOptions(async () => { throw error; }, 'following', 'subject');
  await assert.rejects(options.queryFn({}), (value) => value === error);
  const invalid = followListQueryOptions(async () => [null], 'followers', 'subject');
  await assert.rejects(invalid.queryFn({}), TypeError);
});

// This adapter is deliberately TEST LOCAL DESIGN. It demonstrates a real I/O
// capability passed into the reconstructed callback; it does not replace Ky,
// cookie/auth behavior, shared ContractError/retries, or an original backend.
function loopbackTransport(origin, failures = []) {
  return async (operation, { params, query, signal }) => {
    const [method, template] = operation.split(' ', 2);
    const url = new URL(template.replace('{userId}', encodeURIComponent(String(params.userId))), origin);
    for (const [key, value] of Object.entries(query)) if (value !== undefined) url.searchParams.set(key, String(value));
    const response = await fetch(url, { method, signal });
    if (!response.ok) {
      const error = Object.assign(new Error('local test adapter HTTP failure'), { response });
      failures.push(error); throw error;
    }
    return response.json();
  };
}

async function serverFor(t, handler) {
  const server = createServer(handler); server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(async () => { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); });
  return `http://127.0.0.1:${server.address().port}`;
}

test('real loopback GETs exercise all four reads, normalized served order, and local-only pages', async (t) => {
  const requests = [];
  const rows = Array.from({ length: 23 }, (_, i) => ({ user_id: `legacy${i}`, userId: `canonical${i}`,
    address: i === 0 ? null : `wallet${i}`, kind: null, extra: i }));
  const origin = await serverFor(t, (req, res) => {
    requests.push({ method: req.method, url: req.url, cookie: req.headers.cookie, authorization: req.headers.authorization });
    res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(rows));
  });
  const transport = loopbackTransport(origin);
  const cases = [['followers', undefined, '/following/v3/followers/a%2Fb%20%3F?limit=1000'],
    ['following', { sort: 'recent' }, '/following/v3/following/a%2Fb%20%3F?limit=1000&sort=recent'],
    ['followers', { searchTerm: '' }, '/following/v3/followers/search/a%2Fb%20%3F?searchTerm=&limit=100'],
    ['following', { searchTerm: ' A 😀 ', sort: 'recent' }, '/following/v3/following/search/a%2Fb%20%3F?searchTerm=+A+%F0%9F%98%80+&limit=100']];
  for (const [direction, input, expected] of cases) {
    const value = await followListQueryOptions(transport, direction, 'a/b ?', input).queryFn({ signal: new AbortController().signal });
    const page = paginateFollowList(value, 'a/b ?', input, setFollowListPage('a/b ?', 2, input));
    assert.deepEqual(page.displayed.map((x) => x.userId), Array.from({ length: 10 }, (_, i) => `legacy${i + 10}`));
    assert.equal(page.totalCount, 23); assert.equal(page.totalPages, 3); assert.equal(value[0].address, '');
    assert.equal(value[0].kind, 'person'); assert.equal(value[22].extra, 22);
    assert.equal(requests.at(-1).url, expected);
  }
  assert.equal(requests.length, 4); // Display page changes did not call transport.
  assert.ok(requests.every((x) => x.method === 'GET' && x.cookie === undefined && x.authorization === undefined));
});

test('real loopback non-OK error stays the injected transport error by identity', async (t) => {
  const origin = await serverFor(t, (_req, res) => { res.writeHead(503); res.end('controlled local failure'); });
  const failures = [];
  const options = followListQueryOptions(loopbackTransport(origin, failures), 'followers', 'subject');
  await assert.rejects(options.queryFn({}), (error) => error === failures[0] && error.response.status === 503);
  assert.equal(failures.length, 1); // Retry is not invented in this callback.
});

test('real loopback pending fetch accepts the exact caller AbortSignal and propagates cancellation', async (t) => {
  let received; const started = new Promise((resolve) => { received = resolve; });
  const origin = await serverFor(t, (_req, _res) => received());
  const controller = new AbortController(); const reason = new Error('owned local cancellation');
  const pending = followListQueryOptions(loopbackTransport(origin), 'following', 'subject').queryFn({ signal: controller.signal });
  await started; controller.abort(reason);
  await assert.rejects(pending, (error) => error === reason);
});
