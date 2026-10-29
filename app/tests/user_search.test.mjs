import assert from 'node:assert/strict';
import { test } from 'node:test';
import http from 'node:http';
import { once } from 'node:events';
import { readFile, writeFile, mkdtemp, mkdir, copyFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createUserSearchQuery, createUserSearchRequest, createUserSearchNextPage,
  isLabelledWallet, selectUserSearchPages } from '../reconstruction/user-search/query.mjs';
import { APP_ROOT, ADAPTER, PROOF, verifyUserSearch } from '../scripts/verify-user-search.mjs';
import { validateDeclared } from '../scripts/original-contracts/validate.mjs';

const proof = JSON.parse(await readFile(path.join(APP_ROOT, PROOF), 'utf8'));
const user = (userId, address) => ({ userId, address, username: null, profile_image: null, bio: null,
  followers: 0, following: 0, x_username: null });
const wallet = (address, label = 'synthetic label') => ({ ...user(undefined, address), wallet_label: label });

async function api(t, handler) {
  const requests = [];
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, 'http://local.invalid'); requests.push({ url, headers: request.headers });
    handler(url, response);
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => { server.closeAllConnections(); return new Promise((resolve) => server.close(resolve)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => async (operation, options) => {
    assert.equal(operation, 'GET /users/search-v2');
    const url = new URL('/users/search-v2', base);
    for (const [key, value] of Object.entries(options.query)) if (value !== undefined) url.searchParams.set(key, String(value));
    const response = await fetch(url, { signal: options.signal, headers: options.headers, credentials: options.credentials });
    for (const callback of options.hooks.afterResponse) await callback(url, options, response);
    return response.json();
  };
  return { client, requests };
}
const respond = (response, rows, status = 200) => { response.writeHead(status, { 'Content-Type': 'application/json' }); response.end(JSON.stringify(rows)); };

test('three actual hook contexts, consumer bindings, request and complete declared schemas reproduce', async () => {
  assert.deepEqual(await verifyUserSearch(), proof);
  for (const label of ['complete user-search request', 'selectUserSearchPages', 'next-page offset', 'query options']) {
    const values = proof.proofs.filter((item) => item.label === label);
    assert.equal(values.length, 3);
    assert.equal(new Set(values.map((item) => item.normalizedSha256)).size, 1);
  }
  assert.equal(proof.proofs.filter((item) => item.label === 'actual dialog user-search consumer').length, 1);
});

test('label presence and two-pass user/wallet merge preserve served order, precedence and raw references', () => {
  const first = user(' same ', 'A'), duplicate = user('same', 'B'), second = user('other', 'C');
  const missing = {}, otherMissing = {};
  const rows = [wallet('A'), first, wallet('B'), duplicate, wallet('B', 'second'), second, missing, otherMissing, wallet(undefined), wallet(undefined, 'duplicate')];
  const pages = [rows.slice(0, 4), rows.slice(4)];
  const before = structuredClone(pages);
  const selected = selectUserSearchPages({ pages });
  assert.deepEqual(selected, [first, second, missing, otherMissing, rows[2], rows[8]]);
  assert.equal(selected[0], first); assert.equal(selected[4], rows[2]);
  assert.deepEqual(pages, before);
  assert.equal(isLabelledWallet({ wallet_label: null }), true);
  assert.equal(isLabelledWallet({ wallet_label: false }), true);
  assert.equal(isLabelledWallet({ wallet_label: undefined }), false);
});

test('pagination counts non-wallet raw rows rather than deduplicated display rows', () => {
  const a = user('a', 'A'), w = wallet('W');
  const pages = [[a, a, w], [a, a, w]];
  assert.equal(selectUserSearchPages({ pages }).length, 2);
  const next = createUserSearchNextPage(2);
  assert.equal(next(pages[1], pages), 4);
  assert.equal(next([w, w], pages), undefined);
  assert.equal(next([a, w, w], pages), undefined);
  assert.equal(next(null, pages), undefined);
});

test('query callback -> real HTTP -> raw pages -> merge and next offset are usable together', async (t) => {
  const pages = {
    0: [user('a', 'A'), wallet('A'), user('b', 'B')],
    2: [user('b', 'B-other'), wallet('C'), user('c', 'D')],
    4: [wallet('C', 'duplicate'), wallet('Z')],
  };
  const local = await api(t, (url, response) => respond(response, pages[url.searchParams.get('offset')]));
  const value = createUserSearchQuery({ searchTerm: ' al ', debouncedTerm: 'al', pageSize: 2 }, local.client);
  assert.equal(value.queryOptions.enabled, true);
  const collected = []; let offset = value.queryOptions.initialPageParam;
  for (let i = 0; i < 3; i++) {
    const page = await value.queryOptions.queryFn({ pageParam: offset, signal: new AbortController().signal });
    collected.push(page); offset = value.queryOptions.getNextPageParam(page, collected);
  }
  assert.equal(offset, undefined);
  const selected = value.queryOptions.select({ pages: collected });
  assert.deepEqual(selected.map((row) => [row.userId, row.address]), [['a', 'A'], ['b', 'B'], ['c', 'D'], [undefined, 'C'], [undefined, 'Z']]);
  assert.deepEqual(local.requests.map((request) => Object.fromEntries(request.url.searchParams)), [0, 2, 4].map((offset) => ({
    offset: String(offset), limit: '2', includeLabelledWallets: 'true', searchTerm: 'al',
  })));
  assert.equal(local.requests.every((request) => request.headers['content-type'] === 'application/json'), true);
});

test('minimum/enablement and debounce flags use the supplied snapshot and original UTF-16 length', () => {
  const unused = () => { throw Error('options construction must not call transport'); };
  const value = createUserSearchQuery({ searchTerm: ' new ', debouncedTerm: 'old' }, unused);
  assert.deepEqual(value.queryOptions.queryKey, ['users', 'search-v2', 'old', 20]);
  assert.equal(value.queryOptions.enabled, true); assert.equal(value.isDebouncing, true);
  assert.equal(value.minSearchTermLength, 2); assert.equal(value.debounceMs, 500);
  assert.equal(value.queryOptions.staleTime, 30000); assert.equal(value.queryOptions.refetchOnWindowFocus, false);
  assert.equal(createUserSearchQuery({ searchTerm: 'a', debouncedTerm: 'a' }, unused).queryOptions.enabled, false);
  assert.equal(createUserSearchQuery({ searchTerm: '😀', debouncedTerm: '😀' }, unused).queryOptions.enabled, true);
  const disabled = createUserSearchQuery({ searchTerm: 'new', debouncedTerm: '', enabled: false }, unused);
  assert.equal(disabled.isSearchTermTooShort, false); assert.equal(disabled.isDebouncing, false); assert.equal(disabled.queryOptions.enabled, false);
  const zero = createUserSearchQuery({ searchTerm: '', debouncedTerm: '', enabled: 0, pageSize: null }, unused);
  assert.equal(zero.queryOptions.enabled, 0); assert.equal(zero.queryOptions.queryKey[3], null);
});

test('enabled is query-runtime input; manually calling a disabled callback still performs its original request', async () => {
  let calls = 0, observed;
  const value = createUserSearchQuery({ searchTerm: '', debouncedTerm: '', enabled: false }, () => async (route, options) => { calls++; observed = { route, options }; return []; });
  assert.equal(value.queryOptions.enabled, false);
  await value.queryOptions.queryFn({ pageParam: 0, signal: undefined });
  assert.equal(calls, 1); assert.equal(Object.hasOwn(observed.options.query, 'searchTerm'), true);
  assert.equal(observed.options.query.searchTerm, undefined); assert.equal(observed.options.query.includeLabelledWallets, true);
});

test('snapshot values stay captured, request containers stay fresh and client/errors/signals remain unbound', async () => {
  const observed = [], failure = Error('synthetic client failure'), controller = new AbortController();
  const snapshot = { searchTerm: 'before', debouncedTerm: 'before', pageSize: 7 };
  const value = createUserSearchQuery(snapshot, function () { assert.equal(this, undefined); return async (...args) => { observed.push(args); if (observed.length === 2) throw failure; return []; }; });
  snapshot.debouncedTerm = 'after'; snapshot.pageSize = 999;
  await value.queryOptions.queryFn({ pageParam: 7, signal: controller.signal });
  await assert.rejects(value.queryOptions.queryFn({ pageParam: 14, signal: controller.signal }), (error) => error === failure);
  assert.equal(observed[0][1].signal, controller.signal); assert.equal(observed[0][1].query.limit, 7);
  assert.equal(observed[0][1].query.searchTerm, 'before'); assert.notEqual(observed[0][1].query, observed[1][1].query);
});

test('real HTTP status hook throws the original plain error and pending fetch honors abort', async (t) => {
  let arrival;
  const arrived = new Promise((resolve) => { arrival = resolve; });
  const local = await api(t, (url, response) => { if (url.searchParams.get('searchTerm') === 'wait') arrival(); else respond(response, { error: 'synthetic failure' }, 503); });
  const request = createUserSearchRequest(local.client);
  await assert.rejects(request({ searchTerm: 'term', offset: 0, limit: 20 }), { name: 'Error', message: 'Failed to search users for the term: term' });
  const controller = new AbortController();
  const pending = request({ searchTerm: 'wait', offset: 0, limit: 20, signal: controller.signal });
  await arrived; controller.abort();
  await assert.rejects(pending, (error) => error.name === 'AbortError');
});

test('declared schemas are separate from wire/client guards and retain true optional/safe-integer bounds', () => {
  const doc = proof.declaredSchemas, query = doc.properties.query, response = doc.properties.response;
  assert.deepEqual(validateDeclared(doc, query, {}).issues, []);
  assert.deepEqual(validateDeclared(doc, query, { searchTerm: '', offset: -1, limit: 0, sort: 'custom', order: 'custom', includeLabelledWallets: true }).issues, []);
  assert.notDeepEqual(validateDeclared(doc, query, { offset: 1.5 }).issues, []);
  assert.notDeepEqual(validateDeclared(doc, query, { limit: Number.MAX_SAFE_INTEGER + 1 }).issues, []);
  assert.notDeepEqual(validateDeclared(doc, query, { includeLabelledWallets: null }).issues, []);
  assert.deepEqual(validateDeclared(doc, response, [user('a', 'A')]).issues, []);
  assert.deepEqual(doc.$defs['896727.userRow'].properties.wallet_label, { type: 'string', 'x-zod-optional': true });
  assert.deepEqual(validateDeclared(doc, response, [wallet('A')]).issues, []);
  assert.notDeepEqual(validateDeclared(doc, response, [wallet('A', null)]).issues, []);
  // The client classifies raw presence, independently of declared type checking.
  assert.equal(isLabelledWallet(wallet('A', null)), true);
  assert.deepEqual(selectUserSearchPages({ pages: [[wallet('A')]] }), [wallet('A')]);
});

async function changed(t, edit) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'user-search-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const files = new Set(['evidence/web/manifest.json', 'recovered/modules.json', ADAPTER,
    ...proof.proofs.map((entry) => entry.source), ...proof.schemaWitnesses.map((entry) => entry.source)]);
  for (const file of files) { await mkdir(path.dirname(path.join(root, file)), { recursive: true }); await copyFile(path.join(APP_ROOT, file), path.join(root, file)); }
  const file = path.join(root, ADAPTER); await writeFile(file, edit(await readFile(file, 'utf8'))); return root;
}
test('source proof rejects page/count/dedup/request/enablement/return-wiring mutations', async (t) => {
  for (const edit of [(text) => text.replace('users.length < pageSize', 'users.length <= pageSize'),
    (text) => text.replace('pages.flat().filter(isPaginationUser).length', 'pages.flat().length'),
    (text) => text.replace('if (identities.has(identity)) continue;', 'if (false) continue;'),
    (text) => text.replace('includeLabelledWallets: true', 'includeLabelledWallets: false'),
    (text) => text.replace('active && !isSearchTermTooShort', 'active'),
    (text) => text.replace('minSearchTermLength: 2, debounceMs: 500', 'minSearchTermLength: 3, debounceMs: 500')]) {
    await assert.rejects(verifyUserSearch(await changed(t, edit)), /AST differs|returned query\/meta wiring/);
  }
});
