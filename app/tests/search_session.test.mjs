import assert from 'node:assert/strict';
import { test } from 'node:test';
import http from 'node:http';
import { EventEmitter, once } from 'node:events';
import { readFile, writeFile, mkdtemp, mkdir, copyFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createSearchCache, createSearchExecutor, createSearchSession, normalizeSearchCoins, normalizeSearchUri, FALLBACK_IMAGE } from '../reconstruction/search-session/session.mjs';
import { createCoinSearchPlanner } from '../reconstruction/search-planner/planner.mjs';
import { APP_ROOT, ADAPTER, PROOF, verifySession } from '../scripts/verify-search-session.mjs';

const proof = JSON.parse(await readFile(path.join(APP_ROOT, PROOF), 'utf8'));
const descriptor = (term = 'coin') => ({ kind: 'client', route: 'GET /coins/search-v2', query: { searchTerm: term } });
const render = (key = 'key', offset = 0, limit = 2, socialTerminal = false) => ({ requestKey: key, offset, limit, socialTerminal, ipfsPrefix: 'https://local.invalid/ipfs/' });
const send = (response, value, status = 200) => { response.writeHead(status, { 'Content-Type': 'application/json' }); response.end(JSON.stringify(value)); };

async function server(t, handler) {
  const requests = [], events = new EventEmitter();
  const listener = http.createServer((request, response) => {
    const entry = { request, response, url: new URL(request.url, 'http://local.invalid') };
    requests.push(entry); handler(entry, requests.length); events.emit('request');
  });
  listener.listen(0, '127.0.0.1'); await once(listener, 'listening');
  t.after(() => { listener.closeAllConnections(); return new Promise((resolve) => listener.close(resolve)); });
  return { requests, baseUrl: `http://127.0.0.1:${listener.address().port}`,
    async wait(count) { while (requests.length < count) await once(events, 'request'); } };
}

function session(local, extra = {}) {
  return createSearchSession({ baseUrl: local.baseUrl, cache: createSearchCache(), ...extra });
}

test('both complete original executor bodies, consumers, state ports and normalizers reproduce', async () => {
  assert.deepEqual(await verifySession(), proof);
  const executors = proof.proofs.filter((entry) => entry.label === 'complete shared executor');
  assert.equal(executors.length, 2);
  assert.equal(executors[0].normalizedSha256, executors[1].normalizedSha256);
  assert.notEqual(executors[0].sha256, executors[1].sha256);
  assert.equal(proof.consumerBindings.length, 2);
  assert.equal(proof.stateBindings.length, 18);
});

test('planner -> real HTTP -> captured normalization -> usable headless state', async (t) => {
  const local = await server(t, ({ response }) => send(response, [{ mint: 'synthetic-mint', created_at: 17,
    recommendation_id: 'rec', image_uri: 'https://example.invalid/image.png', metadata_uri: 'not-ipfs', ischarity: true }]));
  const state = session(local);
  const plan = createCoinSearchPlanner({ sort: 'charity', offset: 0, limit: 48, includeNsfw: false }, () => ({}))({ searchTerm: ' cat ' });
  const run = state.render(render('cat', 0, 48));
  const pending = run(plan.request, true, false);
  assert.equal(state.getState().loading, true);
  assert.equal(await pending, true);
  assert.deepEqual(state.getState(), { coins: [{ mint: 'synthetic-mint', created_at: 17, created_timestamp: 17,
    recommendation_id: 'rec', rec_id: 'rec', image_uri: 'https://example.invalid/image.png', metadata_uri: FALLBACK_IMAGE,
    ischarity: true, is_charity: true }], pageSize: 1, hasNextPage: null, loadedKey: 'cat', errorKey: null, loading: false, servedCoins: [] });
  assert.equal(local.requests[0].url.pathname, '/coins/search-v2');
  assert.equal(local.requests[0].url.searchParams.get('searchTerm'), ' cat ');
  assert.equal(local.requests[0].request.headers.accept, 'application/json');
  assert.equal(local.requests[0].request.headers['x-pump-source'], 'WEB');
});

test('normalization preserves alias precedence, row mutation, HTTP fallback and exact URI rules', () => {
  const cid = 'Qm' + 'a'.repeat(44), prefix = 'https://local.invalid/ipfs/';
  assert.equal(normalizeSearchUri('ipfs://' + cid, prefix), prefix + cid);
  assert.equal(normalizeSearchUri('https://ipfs.io/ipfs/' + cid, prefix), prefix + cid);
  assert.equal(normalizeSearchUri('https://other.invalid/no-cid', prefix), FALLBACK_IMAGE);
  const row = { created_at: 1, created_timestamp: 2, recommendation_id: 'old', rec_id: 'keep', ischarity: true,
    is_charity: false, image_uri: 'HTTPS://example.invalid/a', metadata_uri: 'https://example.invalid/b' };
  assert.equal(normalizeSearchCoins([row], prefix, 'query')[0], row);
  assert.deepEqual(row, { created_at: 1, created_timestamp: 2, recommendation_id: 'old', rec_id: 'keep', ischarity: true,
    is_charity: false, image_uri: 'HTTPS://example.invalid/a', metadata_uri: FALLBACK_IMAGE, searchTerm: 'query' });
  assert.throws(() => normalizeSearchCoins(null, prefix), TypeError);
  assert.throws(() => normalizeSearchUri(3, prefix), TypeError);
});

test('local filtering slices filtered rows but preserves unfiltered page counts and completion timing', async (t) => {
  const local = await server(t, ({ response }) => send(response, [0, 1, 2, 3, 4].map((value) => ({ mint: String(value) }))));
  let clock = 100;
  const state = session(local, { now: () => clock });
  const completed = [];
  assert.equal(await state.render(render('page', 2, 2))(descriptor(), true, true, false,
    (rows) => { clock = 137; return rows.filter((coin) => coin.mint !== '1'); },
    (...args) => completed.push(args)), true);
  assert.deepEqual(state.getState().coins.map((coin) => coin.mint), ['3', '4']);
  assert.equal(state.getState().pageSize, 2);
  assert.equal(state.getState().hasNextPage, true);
  assert.deepEqual(completed, [[5, 37]]);
});

test('nonlocal filter count uses all normalized rows and does not invent hasNextPage', async (t) => {
  const local = await server(t, ({ response }) => send(response, [{ mint: 'a' }, { mint: 'b' }, { mint: 'c' }]));
  const state = session(local);
  await state.render(render())(descriptor(), true, false, false, (rows) => rows.slice(0, 1));
  assert.deepEqual(state.getState().coins, [{ mint: 'a' }]);
  assert.equal(state.getState().pageSize, 3);
  assert.equal(state.getState().hasNextPage, null);
});

test('cache hydration still refreshes over HTTP and retains the cached page after failed refresh', async (t) => {
  const local = await server(t, ({ response }, number) => { if (number === 1) send(response, [{ mint: 'cached' }]); });
  const cache = createSearchCache();
  const first = session(local, { cache }); await first.render(render('first'))(descriptor());
  const second = session(local, { cache });
  const pending = second.render(render('second'))(descriptor());
  assert.deepEqual(second.getState().coins, [{ mint: 'cached' }]);
  assert.equal(second.getState().loadedKey, 'second');
  assert.equal(second.getState().loading, false);
  await local.wait(2); send(local.requests[1].response, { error: 'synthetic failure' }, 503);
  assert.equal(await pending, false);
  assert.deepEqual(second.getState().coins, [{ mint: 'cached' }]);
  assert.equal(second.getState().errorKey, null);
  assert.equal(local.requests.length, 2);
});

test('TTL comparison is strictly greater than120000 and expired failures clear state', async (t) => {
  for (const age of [120000, 120001]) await t.test(String(age), async (t) => {
    let clock = 0;
    const local = await server(t, ({ response }, number) => send(response, number === 1 ? [{ mint: 'cached' }] : {}, number === 1 ? 200 : 503));
    const cache = createSearchCache({ now: () => clock });
    await session(local, { cache, now: () => clock }).render(render())(descriptor());
    clock = age;
    const state = session(local, { cache, now: () => clock });
    assert.equal(await state.render(render('next'))(descriptor()), false);
    assert.equal(state.getState().coins.length, age === 120000 ? 1 : 0);
    assert.equal(state.getState().errorKey, age === 120000 ? null : 'next');
  });
});

test('cache write refreshes insertion order, evicts at24 and overwrites storedAt', () => {
  const cache = createSearchCache({ now: () => 7 });
  for (let i = 0; i < 24; i++) cache.store(String(i), { coins: [], storedAt: -1 });
  cache.store('0', { coins: [] }); cache.store('24', { coins: [] });
  assert.equal(cache.entries.size, 24);
  assert.equal(cache.entries.has('1'), false);
  assert.equal(cache.entries.has('0'), true);
  assert.equal(cache.entries.get('0').storedAt, 7);
});

test('new real HTTP request aborts its predecessor and only the latest writes state', async (t) => {
  const signals = [];
  const local = await server(t, ({ response, url }) => { if (url.searchParams.get('searchTerm') === 'new') send(response, [{ mint: 'new' }]); });
  const state = session(local, { fetchResponse: (url, init) => { signals.push(init.signal); return fetch(url, init); } });
  const old = state.render(render('old'))(descriptor('old')); await local.wait(1);
  const newer = state.render(render('new'))(descriptor('new'));
  assert.equal(await old, false);
  assert.equal(await newer, true);
  assert.equal(signals[0].aborted, true);
  assert.deepEqual(state.getState().coins, [{ mint: 'new' }]);
  assert.equal(state.getState().loading, false);
});

test('a noncooperative old HTTP response is normalized/filtered but cannot overwrite a newer page', async (t) => {
  const local = await server(t, () => {});
  const state = session(local, { fetchResponse: (url, { signal, ...init }) => fetch(url, init) });
  const seen = [];
  const old = state.render(render('old'))(descriptor('old'), true, false, false, (rows) => { seen.push(rows[0].mint); return rows; });
  await local.wait(1);
  const newer = state.render(render('new'))(descriptor('new')); await local.wait(2);
  send(local.requests[1].response, [{ mint: 'new' }]); assert.equal(await newer, true);
  send(local.requests[0].response, [{ mint: 'old', created_at: 5 }]); assert.equal(await old, false);
  assert.deepEqual(seen, ['old']);
  assert.deepEqual(state.getState().coins, [{ mint: 'new' }]);
  assert.equal(state.getState().loadedKey, 'new');
});

test('preserve-existing failure depends on the captured social-terminal loaded key condition', async (t) => {
  const local = await server(t, ({ response }) => send(response, {}, 503));
  for (const [socialTerminal, keep] of [[false, true], [true, false]]) {
    const state = session(local, { initialCoins: [{ mint: 'prior' }] });
    assert.equal(await state.render(render('changed', 0, 2, socialTerminal))(descriptor(), true, false, true), false);
    assert.equal(state.getState().coins.length, keep ? 1 : 0);
    assert.equal(state.getState().errorKey, keep ? null : 'changed');
  }
});

test('social-terminal background refresh preserves matching loaded keys and bypasses cached reads', async (t) => {
  const local = await server(t, ({ response }, number) => send(response, number === 1 ? [{ mint: 'loaded' }] : {}, number === 1 ? 200 : 503));
  const state = session(local);
  await state.render(render('same', 0, 2, true))(descriptor());
  assert.equal(await state.render(render('same', 0, 2, true))(descriptor(), true, false, true), false);
  assert.deepEqual(state.getState().coins, [{ mint: 'loaded' }]);
  assert.equal(state.getState().errorKey, null);
  assert.equal(await state.render(render('changed', 0, 2, true))(descriptor(), true, false, true), false);
  assert.deepEqual(state.getState().coins, []);
  assert.equal(state.getState().errorKey, 'changed');
});

test('filter/completion callback failures follow the captured error-state path', async (t) => {
  const local = await server(t, ({ response }) => send(response, [{ mint: 'row' }]));
  for (const failing of ['filter', 'completion']) {
    const state = session(local);
    const failure = () => { throw Error('synthetic callback failure'); };
    assert.equal(await state.render(render(failing))(descriptor(), true, false, false,
      failing === 'filter' ? failure : undefined, failing === 'completion' ? failure : undefined), false);
    assert.deepEqual(state.getState().coins, []);
    assert.equal(state.getState().errorKey, failing);
    assert.equal(state.getState().loading, false);
  }
});

test('null, invalid JSON and HTTP status failures return false and publish the requested error key', async (t) => {
  for (const mode of ['null', 'json', 'status']) await t.test(mode, async (t) => {
    const local = await server(t, ({ response }) => {
      if (mode === 'null') send(response, null);
      else if (mode === 'status') send(response, {}, 503);
      else { response.writeHead(200, { 'Content-Type': 'application/json' }); response.end('{invalid'); }
    });
    const state = session(local, { initialCoins: [{ mint: 'prior' }] });
    assert.equal(await state.render(render(mode))(descriptor()), false);
    assert.deepEqual(state.getState().coins, []); assert.equal(state.getState().errorKey, mode);
    assert.equal(state.getState().loading, false);
  });
});

test('public session requires a shared cache and explicit destination and rejects board/list routing', () => {
  assert.throws(() => createSearchSession({ baseUrl: 'http://127.0.0.1' }), /shared search cache/);
  assert.throws(() => createSearchSession({ cache: createSearchCache() }), /explicit baseUrl/);
  const state = createSearchSession({ baseUrl: 'http://127.0.0.1', cache: createSearchCache(), fetchResponse: () => { throw Error('network must not run'); } });
  const run = state.render(render());
  for (const request of [{ kind: 'board' }, { kind: 'list' }, { kind: 'client', route: 'GET /coins' }]) assert.throws(() => run(request), /two captured coin-search descriptors/);
});

function ports(extra = {}) {
  const state = {}, entries = new Map(), events = [];
  const result = { entries, store: (key, value) => entries.set(key, value), requestKeyRef: { current: 'key' },
    loadedKeyRef: { current: null }, sequenceRef: { current: 0 }, abortRef: { current: null }, emptyCoins: [], now: () => 0,
    getContractClient: () => async () => [], fetchResponse: async () => ({ ok: true, json: async () => [] }), parseBoard: (value) => value,
    ...Object.fromEntries(['Coins', 'PageSize', 'HasNextPage', 'LoadedKey', 'ErrorKey', 'Loading', 'ServedCoins'].map((name) =>
      ['set' + name, (value) => { state[name] = value; events.push([name, value]); }])), ...extra };
  return { result, state, events };
}

test('shared list/board branches use explicit transport/parser ports without widening public search routes', async () => {
  for (const kind of ['list', 'board']) {
    const captured = []; const raw = { rows: [{ mint: 'row' }] };
    const test = ports({ fetchResponse: async (...args) => { captured.push(args); return { ok: true, json: async () => raw }; }, parseBoard: (value) => value.rows });
    const run = createSearchExecutor(render(), test.result);
    assert.equal(await run({ kind, url: 'synthetic-explicit-url', board: 'trending', cache: 'no-store', parse: (value) => value.rows }), true);
    assert.deepEqual(test.state.Coins, [{ mint: 'row' }]);
    assert.equal(captured[0][1].credentials, 'include');
    assert.equal(captured[0][1].cache, kind === 'list' ? 'no-store' : undefined);
    assert.equal(test.state.ServedCoins, kind === 'board' ? raw.rows : test.result.emptyCoins);
  }
});

test('finally clears the shared controller even for stale completion, preserving the captured operation', async () => {
  let finish;
  const test = ports({ getContractClient: () => () => new Promise((resolve) => { finish = resolve; }) });
  const pending = createSearchExecutor(render(), test.result)(descriptor());
  const newer = new AbortController(); test.result.sequenceRef.current += 1; test.result.abortRef.current = newer;
  finish([]); assert.equal(await pending, false);
  assert.equal(test.result.abortRef.current, null);
  assert.equal(newer.signal.aborted, false);
  assert.equal(test.state.Loading, true);
});

async function changedAdapter(t, change) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'search-session-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const files = new Set(['evidence/web/manifest.json', 'recovered/modules.json', ADAPTER,
    ...proof.proofs.map((entry) => entry.source), ...proof.consumerBindings.map((entry) => entry.source)]);
  for (const file of files) { await mkdir(path.dirname(path.join(root, file)), { recursive: true }); await copyFile(path.join(APP_ROOT, file), path.join(root, file)); }
  const target = path.join(root, ADAPTER); await writeFile(target, change(await readFile(target, 'utf8')));
  return root;
}

test('source verifier rejects TTL, race, callback ordering, normalization and port-wiring changes', async (t) => {
  for (const change of [
    (text) => text.replace('> 120000', '>= 120000'),
    (text) => text.replace('current = sequence === sequenceRef.current', 'current = true'),
    (text) => text.replace('onSuccess?.(normalized.length, now() - started)', 'onSuccess?.(filtered.length, now() - started)'),
    (text) => text.replace('abortRef.current = null', 'abortRef.current = controller'),
    (text) => text.replace('coin.created_timestamp = coin.created_at', 'coin.created_timestamp = 0'),
    (text) => text.replace('{ offset, limit, ipfsPrefix, socialTerminal },', '{ offset: wrongOffset, limit, ipfsPrefix, socialTerminal },'),
  ]) await assert.rejects(verifySession(await changedAdapter(t, change)), /AST differs|capability wiring/);
});
