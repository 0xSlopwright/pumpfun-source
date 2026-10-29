import assert from 'node:assert/strict';
import { once } from 'node:events';
import http from 'node:http';
import { test } from 'node:test';
import { createCoinSearchPlanner, selectSearchSession } from '../reconstruction/search-planner/planner.mjs';
import { buildSearchRequest } from '../reconstruction/search-client/request.mjs';

// This server is an inert local receiver, not a replacement backend. It proves
// planner -> maintained source-backed wire encoder -> actual HTTP request only.
async function receiver(t) {
  const received = [];
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, 'http://local.invalid');
    received.push({ method: request.method, path: url.pathname,
      query: Object.fromEntries(url.searchParams), headers: request.headers });
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ received: true }));
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => { server.closeAllConnections(); return new Promise((resolve) => server.close(resolve)); });
  return { received, baseUrl: `http://127.0.0.1:${server.address().port}` };
}

test('captured charity/local-filter planning reaches the maintained search wire with raw Unicode input', async (t) => {
  const local = await receiver(t);
  const identityCalls = [];
  const sessionId = selectSearchSession(null, { pump_session_id: 'synthetic-session' });
  const plan = createCoinSearchPlanner({ sort: 'charity', offset: 96, limit: 48,
    includeNsfw: false, order: 'ASC', creator: 'synthetic-creator', sessionId,
    includePerps: true }, function (session) {
    assert.equal(this, undefined);
    identityCalls.push(session);
    return { deviceId: 'synthetic-device' };
  });
  const result = plan({ searchTerm: '  🐈 é +&?  ', useLocalFiltering: true });
  assert.deepEqual(identityCalls, ['synthetic-session']);
  assert.equal(result.settledSearchTerm, '🐈 é +&?');
  assert.equal(result.reportSearchSettled, true);
  const wire = buildSearchRequest(result.request.route, result.request.query, { baseUrl: local.baseUrl });
  assert.equal(wire.init.credentials, 'include');
  assert.deepEqual(await (await fetch(wire.url, wire.init)).json(), { received: true });
  assert.deepEqual(local.received.map(({ method, path, query }) => ({ method, path, query })), [{
    method: 'GET', path: '/coins/search-v2', query: {
      offset: '0', limit: '100', sort: 'market_cap', includeNsfw: 'false', order: 'DESC',
      searchTerm: '  🐈 é +&?  ', deviceId: 'synthetic-device', sessionId: 'synthetic-session',
      creator: 'synthetic-creator', isCharity: 'true', includePerps: 'true',
    },
  }]);
  assert.equal(local.received[0].headers.accept, 'application/json');
  assert.equal(local.received[0].headers['content-type'], 'application/json');
  assert.equal(local.received[0].headers['x-pump-source'], 'WEB');
  assert.equal(local.received[0].headers['x-pump-platform'], 'web');
});

test('new render snapshots preserve page offsets, oldest order and unrestricted route field omission on the wire', async (t) => {
  const local = await receiver(t);
  const snapshot = { sort: 'oldest_coins', offset: 48, limit: 48, includeNsfw: true,
    order: 'DESC', sessionId: '', includePerps: true, useUnrestrictedSearch: true };
  const oldRender = createCoinSearchPlanner(snapshot, () => ({}));
  snapshot.offset = 96;
  const newRender = createCoinSearchPlanner(snapshot, () => ({}));
  for (const plan of [oldRender, newRender]) {
    const result = plan({ searchTerm: 'coin' });
    assert.equal(result.reportSearchSettled, false);
    assert.equal(Object.hasOwn(result.request.query, 'includePerps'), false);
    const wire = buildSearchRequest(result.request.route, result.request.query, { baseUrl: local.baseUrl });
    await (await fetch(wire.url, wire.init)).json();
  }
  assert.deepEqual(local.received.map(({ path, query }) => ({ path, query })), [48, 96].map((offset) => ({
    path: '/coins/search-unrestricted', query: { offset: String(offset), limit: '48',
      sort: 'created_timestamp', includeNsfw: 'true', order: 'ASC', searchTerm: 'coin' },
  })));
});

test('blank inputs stop before identity and transport; nonempty planning still requires an explicit destination', () => {
  let identities = 0;
  let sends = 0;
  const plan = createCoinSearchPlanner({ offset: 0 }, () => { identities++; return {}; });
  const send = (result) => { if (result) { sends++; return buildSearchRequest(result.request.route, result.request.query); } };
  for (const searchTerm of [undefined, null, '', ' \n\t']) send(plan({ searchTerm }));
  assert.equal(identities, 0);
  assert.equal(sends, 0);
  assert.throws(() => send(plan({ searchTerm: 'coin' })), /explicit baseUrl/);
  assert.equal(identities, 1);
  assert.equal(sends, 1);
});
