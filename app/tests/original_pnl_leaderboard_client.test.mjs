import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { mkdtemp, mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPnlLeaderboardClient } from '../reconstruction/pnl-leaderboard-client/client.mjs';
import { createPnlFetchTransport } from '../reconstruction/pnl-leaderboard-client/fetch-transport.mjs';
import { verifyPnlLeaderboardClient } from '../scripts/original-pnl-leaderboard-client.mjs';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// One injected component instance. This records the original hook's actual
// options; it does not implement React, TanStack scheduling or authentication.
function harness({ address, transport = async () => undefined } = {}) {
  let wallet = address;
  const cache = Array(19).fill(Symbol.for('react.memo_cache_sentinel'));
  const calls = [];
  const result = { injectedQueryResult: true };
  const client = createPnlLeaderboardClient({
    useMemoCache(size) { assert.equal(size, 19); return cache; },
    useWallet() { return { address: wallet }; },
    useQuery(options) { calls.push(options); return result; },
    createClient: () => transport,
  });
  return { client, calls, result, wallet(value) { wallet = value; },
    render(options = {}) { assert.equal(client.useLeaderboard(options), result); return calls.at(-1); } };
}

async function server(t, handle) {
  const http = createServer(handle);
  http.listen(0, '127.0.0.1');
  await once(http, 'listening');
  t.after(async () => {
    const closed = new Promise((resolve) => http.close(resolve));
    http.closeAllConnections();
    await closed;
  });
  return `http://127.0.0.1:${http.address().port}/local-read`;
}

test('complete original request, score and query hook ASTs bind to all reviewed variants and actual consumers', async () => {
  const contract = await verifyPnlLeaderboardClient();
  assert.equal(contract.factory.sha256, 'cec3cfd574ec5ecefe30bc96c8d3c5242ccaa83d7fa2056a7708ac557e7220b9');
  assert.deepEqual(contract.factory.ids, [864024, 416287]);
  assert.equal(contract.consumers.length, 2);
  assert.equal(new Set(contract.consumers.map((row) => row.sha256)).size, 2);
  assert.equal(contract.adapter.retainedAsts.length, 3);
  assert.equal(contract.source.selectedIndexEntries.length, 6);
  assert.ok(contract.witnesses.every((row) => row.sourceSha256 && row.sha256 && row.utf16 && row.utf8));
});

test('source gate rejects maintained hook drift and independently rejects provenance-document drift', async (t) => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'pnl-source-gate-'));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const contract = JSON.parse(await readFile(path.join(APP, 'reconstruction/pnl-leaderboard-client/contract.json')));
  const unchanged = new Set(['scripts/original-contracts/source.mjs', 'evidence/web/manifest.json', 'recovered/modules.json',
    ...contract.witnesses.map((row) => row.source)]);
  for (const name of unchanged) {
    const destination = path.join(temporary, name);
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(path.join(APP, name), destination);
  }
  const directory = path.join(temporary, 'reconstruction/pnl-leaderboard-client');
  await mkdir(directory, { recursive: true });
  const original = await readFile(path.join(APP, contract.adapter.path), 'utf8');
  const document = JSON.stringify(contract, null, 2) + '\n';
  await writeFile(path.join(directory, 'contract.json'), document);
  assert.ok(original.includes('staleTime: 6e4'));
  await writeFile(path.join(directory, 'client.mjs'), original.replace('staleTime: 6e4', 'staleTime: 6e5'));
  await assert.rejects(verifyPnlLeaderboardClient(temporary), /AST differs/);
  await writeFile(path.join(directory, 'client.mjs'), original);
  const changed = structuredClone(contract);
  changed.behavior.staleTimeMs = 600000;
  await writeFile(path.join(directory, 'contract.json'), JSON.stringify(changed, null, 2) + '\n');
  await assert.rejects(verifyPnlLeaderboardClient(temporary), /source contract differs/);
});

test('request forwards the complete original boundary and returns the injected client value unchanged', async () => {
  const signal = new AbortController().signal;
  const response = { entries: [], unknownServerField: { untouched: true } };
  const calls = [];
  let factories = 0;
  const client = createPnlLeaderboardClient({ createClient() { factories++; return async (...args) => { calls.push(args); return response; }; } });
  assert.equal(await client.request({ period: 'weekly', sort: 'realized', limit: 17, signal }), response);
  assert.equal(await client.request({}), response);
  assert.equal(factories, 2);
  const [operation, options] = calls[0];
  assert.equal(operation, 'GET /pnl-leaderboard');
  assert.deepEqual(options.query, { period: 'weekly', sort: 'realized', limit: 17 });
  assert.equal(options.credentials, 'include');
  assert.deepEqual(options.headers, { 'Content-Type': 'application/json' });
  assert.equal(options.signal, signal);
  assert.deepEqual(calls[1][1].query, { period: undefined, sort: undefined, limit: undefined });
  assert.equal(options.hooks.afterResponse.length, 1);
  assert.equal(options.hooks.afterResponse[0](null, null, { ok: true, status: 201 }), undefined);
  assert.throws(() => options.hooks.afterResponse[0](null, null, { ok: false, status: 403 }),
    { name: 'Error', message: 'Failed to fetch pnl leaderboard: 403' });
});

test('transport rejection is preserved by identity; the source client adds no error normalizer', async () => {
  const failure = new Error('injected transport failed');
  const { client } = harness({ transport: async () => { throw failure; } });
  await assert.rejects(client.request({}), (error) => error === failure);
});

test('raw score selection preserves signed/fractional values without sorting, coercion or fallback', () => {
  const { client } = harness();
  const row = Object.freeze({ realizedPnlUsd: -1.25, unrealizedPnlUsd: 0, pnlUsd: 8.5 });
  assert.equal(client.score(row, 'realized'), -1.25);
  assert.equal(client.score(row, 'unrealized'), 0);
  assert.equal(client.score(row, 'combined'), 8.5);
  assert.equal(client.score(row, undefined), 8.5);
  assert.equal(client.score({}, 'realized'), undefined);
  assert.equal(client.score({ realizedPnlUsd: 'uncoerced' }, 'realized'), 'uncoerced');
  assert.throws(() => client.score(null, 'combined'), TypeError);
});

test('original query defaults, wallet key and memo identities survive unchanged renders', () => {
  const state = harness({ address: 'TeStViewerA' });
  const first = state.render({ period: 'daily', sort: 'combined', limit: 50 });
  assert.deepEqual(first.queryKey, ['pnl-leaderboard', 'board', 'daily', 'combined', 50, 'testviewera']);
  assert.equal(first.enabled, true);
  assert.equal(first.staleTime, 60000);
  assert.equal(first.refetchInterval, false);
  assert.equal(state.render({ period: 'daily', sort: 'combined', limit: 50 }), first);
  state.wallet('TESTVIEWERA');
  assert.equal(state.render({ period: 'daily', sort: 'combined', limit: 50 }), first);
  state.wallet('DifferentViewer');
  const other = state.render({ period: 'daily', sort: 'combined', limit: 50 });
  assert.notEqual(other, first);
  assert.notEqual(other.queryKey, first.queryKey);
  assert.notEqual(other.placeholderData, first.placeholderData);
  assert.equal(other.queryFn, first.queryFn); // Wallet is a cache partition, not a request parameter.
  state.wallet(null);
  assert.equal(state.render({ period: 'daily', sort: 'combined', limit: 50 }).queryKey.at(-1), null);
});

test('only captured memo dependencies invalidate query functions/options; falsy defaults are not coerced', () => {
  const state = harness();
  const first = state.render({ period: 'daily', sort: 'combined', limit: 50 });
  assert.equal(first.queryKey.at(-1), null);
  const changed = state.render({ period: 'weekly', sort: 'realized', limit: 9, enabled: false, refetchIntervalMs: 0 });
  assert.notEqual(changed.queryFn, first.queryFn);
  assert.equal(changed.placeholderData, first.placeholderData);
  assert.equal(changed.enabled, false);
  assert.equal(changed.refetchInterval, 0);
  assert.equal(state.render({ enabled: null, refetchIntervalMs: null }).enabled, null);
  assert.equal(state.render({ enabled: 0 }).enabled, 0);
});

test('cross-wallet and logout placeholder paths remove only captured viewer fields without mutating prior data', () => {
  const state = harness({ address: 'ViewerB' });
  const options = state.render({ period: 'daily', sort: 'combined', limit: 50 });
  const entry = Object.freeze({ wallet: 'synthetic-row', isViewer: true, viewerFollows: true, rank: 1, unrelated: 'retained' });
  const prior = Object.freeze({ viewer: Object.freeze({ rank: 8 }), entries: Object.freeze([entry]), total: 2 });
  const same = { queryKey: ['other', 'viewerb'] };
  assert.equal(options.placeholderData(prior, same), prior);
  const hidden = options.placeholderData(prior, { queryKey: ['other', 'viewera'] });
  assert.notEqual(hidden, prior);
  assert.ok(Object.hasOwn(hidden, 'viewer'));
  assert.equal(hidden.viewer, undefined);
  assert.notEqual(hidden.entries[0], entry);
  assert.deepEqual(hidden.entries, [{ wallet: 'synthetic-row', rank: 1, unrelated: 'retained' }]);
  assert.equal(entry.isViewer, true);
  state.wallet(undefined);
  assert.deepEqual(state.render({}).placeholderData(prior, same), hidden);
  for (const value of [undefined, null, false, 0, '']) assert.equal(options.placeholderData(value, same), undefined);
  assert.throws(() => options.placeholderData(prior, {}), TypeError);
  assert.throws(() => options.placeholderData({ viewer: true }, { queryKey: ['viewera'] }), TypeError);
});

test('original queryFn drives the shipped transport through real loopback HTTP and preserves response ordering', async (t) => {
  const wire = [];
  const body = { entries: [{ rank: 7, pnlUsd: -1.25 }, { rank: 2, pnlUsd: 8.5 }], viewer: { rank: 7 }, unknown: 'retained' };
  const baseUrl = await server(t, (request, response) => {
    wire.push({ method: request.method, url: request.url, contentType: request.headers['content-type'] });
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(body));
  });
  let observed;
  const transport = createPnlFetchTransport({ baseUrl, fetch: async (request) => {
    observed = request;
    return fetch(request);
  } });
  const state = harness({ address: 'ViewerA', transport });
  const options = state.render({ period: 'weekly', sort: 'realized', limit: 17 });
  const signal = new AbortController().signal;
  const result = await options.queryFn({ signal });
  assert.deepEqual(result, body);
  assert.deepEqual(wire, [{ method: 'GET', url: '/local-read/pnl-leaderboard?period=weekly&sort=realized&limit=17', contentType: 'application/json' }]);
  assert.equal(observed.credentials, 'include');
  assert.equal(observed.signal.aborted, false);
  assert.equal(state.client.score(result.entries[0], 'combined'), -1.25);
});

test('real HTTP non-OK response reaches the retained original status error before JSON decoding', async (t) => {
  const baseUrl = await server(t, (_request, response) => { response.writeHead(503); response.end('not JSON'); });
  const transport = createPnlFetchTransport({ baseUrl, fetch });
  const { client } = harness({ transport });
  await assert.rejects(client.request({ period: 'daily', sort: 'combined', limit: 1 }),
    { name: 'Error', message: 'Failed to fetch pnl leaderboard: 503' });
});

test('real abort propagates through the captured queryFn and fetch without replacement error', async (t) => {
  let arrived;
  const ready = new Promise((resolve) => { arrived = resolve; });
  const baseUrl = await server(t, (_request, _response) => arrived());
  const transport = createPnlFetchTransport({ baseUrl, fetch });
  const state = harness({ transport });
  const controller = new AbortController();
  const pending = state.render({ period: 'daily', sort: 'combined', limit: 1 }).queryFn({ signal: controller.signal });
  const rejected = assert.rejects(pending, (error) => error.name === 'AbortError');
  await ready;
  controller.abort();
  await rejected;
});

test('the local transport has explicit configuration, one GET operation and no invented response validator', async (t) => {
  for (const baseUrl of ['file:///tmp/data', 'https://operator:example@example.invalid/', 'https://example.invalid/?query=1', 'https://example.invalid/#fragment']) {
    assert.throws(() => createPnlFetchTransport({ baseUrl, fetch }), TypeError);
  }
  assert.throws(() => createPnlFetchTransport({ baseUrl: 'http://127.0.0.1/' }), /explicit fetch/);
  const baseUrl = await server(t, (_request, response) => { response.writeHead(200); response.end('broken JSON'); });
  const transport = createPnlFetchTransport({ baseUrl, fetch });
  await assert.rejects(transport('POST /pnl-leaderboard', {}), /Unsupported/);
  const { client } = harness({ transport });
  await assert.rejects(client.request({}), SyntaxError);
});

test('a double-slash base path remains on the explicitly supplied origin', async () => {
  let actual;
  const transport = createPnlFetchTransport({
    baseUrl: 'http://127.0.0.1:12345//path-segment.invalid/prefix',
    fetch: async (request) => { actual = new URL(request.url); return Response.json({ entries: [] }); },
  });
  const { client } = harness({ transport });
  assert.deepEqual(await client.request({ period: 'daily', sort: 'combined', limit: 1 }), { entries: [] });
  assert.equal(actual.origin, 'http://127.0.0.1:12345');
  assert.equal(actual.pathname, '//path-segment.invalid/prefix/pnl-leaderboard');
});
