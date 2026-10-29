import assert from 'node:assert/strict';
import { test } from 'node:test';
import { once } from 'node:events';
import { createRequire } from 'node:module';
import http from 'node:http';
import { readFile, writeFile, mkdtemp, mkdir, copyFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createSolanaSearchNavigator, createSearchSubmit, createSolanaGuards, normalizeSolanaInput, profileRoute } from '../reconstruction/search-navigation/navigation.mjs';
import { resolveIdentifierWith, buildSearchRequest } from '../reconstruction/search-client/request.mjs';
import { APP_ROOT, ADAPTER, PROOF, verifyNavigation } from '../scripts/verify-search-navigation.mjs';

const require = createRequire(new URL('../packages/frontend/package.json', import.meta.url));
const { PublicKey } = require('@solana/web3.js');
const vendor = createRequire(require.resolve('@solana/web3.js/package.json'));
const base58 = vendor('bs58');
const guards = createSolanaGuards({ base58, PublicKey });
const ADDRESS = '7bS1mH6MXbw1GnEkKTU6w5YLTywPkQ1w3YVZXWFupump';
const proof = JSON.parse(await readFile(path.join(APP_ROOT, PROOF), 'utf8'));
const reply = (response, value, status = 200) => { response.writeHead(status, { 'Content-Type': 'application/json' }); response.end(typeof value === 'string' ? value : JSON.stringify(value)); };

// Explicit loopback bridge for these tests only. It exercises the controller's
// actual operation/options/data decisions, not the complete Ky transport.
async function localApi(t, handler) {
  const requests = [];
  const server = http.createServer((request, response) => {
    const value = { url: new URL(request.url, 'http://local.invalid'), request, response };
    requests.push(value); handler(value);
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => { server.closeAllConnections(); return new Promise((resolve) => server.close(resolve)); });
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const client = () => async (route, options) => {
    const wire = buildSearchRequest('GET /search/resolve', route === 'GET /search/resolve' ? options.query : {}, { baseUrl, signal: options.signal });
    if (route === 'GET /coins-v3/{address}') wire.url = new URL('coins-v3/' + encodeURIComponent(options.params.address), baseUrl + '/').href;
    else assert.equal(route, 'GET /search/resolve');
    const response = await fetch(wire.url, wire.init);
    for (const hook of options.hooks?.afterResponse ?? []) await hook(wire.url, options, response);
    if (!response.ok && options.throwHttpErrors !== false) throw Error(String(response.status));
    const text = await response.text(); return options.parseJson ? options.parseJson(text) : JSON.parse(text);
  };
  return { requests, client };
}

function ports(extra = {}) {
  const actions = [];
  const record = (name) => function (...args) { assert.equal(this, undefined); actions.push({ name, args }); };
  const value = { controllerRef: { current: null }, pasteRef: { current: null }, ...guards,
    resolveIdentifier: async () => ({ kind: 'fallback' }), getContractClient: () => async () => { throw Error('unexpected fallback read'); },
    probeKnownMint: async () => false, probeSolanaMint: async () => false,
    ...Object.fromEntries(['closeDialog', 'rememberTerm', 'trackMintPaste', 'trackWalletPaste', 'trackSearch', 'setLastClick', 'handleCoinClick', 'push'].map((name) => [name, record(name)])), ...extra };
  return { value, actions };
}

test('actual submit/navigator/admission/route bodies and both guard contexts reproduce from raw captures', async () => {
  assert.deepEqual(await verifyNavigation(), proof);
  assert.equal(proof.proofs.filter((item) => item.label === 'validAddress').length, 2);
  assert.equal(proof.proofs.filter((item) => item.label === 'walletProfile').length, 2);
  assert.equal(proof.proofs.filter((item) => item.label === 'actual rendered onSubmit binding').length, 1);
  assert.equal(proof.opaqueBoundaries.filter((item) => item.id === 464403).length, 2);
});

test('admission and route helpers preserve original trimming, decoding, exceptions and encoding', () => {
  assert.equal(normalizeSolanaInput(' ' + ADDRESS + ' '), ADDRESS);
  assert.equal(normalizeSolanaInput('O'.repeat(40)), null);
  assert.equal(guards.validAddress(ADDRESS), true);
  assert.equal(guards.validAddress('A'.repeat(32)), false);
  const failing = createSolanaGuards({ base58: { decode() { throw Error('decode'); } }, PublicKey: { isOnCurve() { throw Error('curve'); } } });
  assert.equal(failing.validAddress(ADDRESS), false); assert.equal(failing.walletProfile(ADDRESS), false);
  assert.equal(profileRoute(null), null); assert.equal(profileRoute({ userId: '  user/id ' }), '/profile/user%2Fid');
  assert.equal(profileRoute(' a/b '), '/profile/%20a%2Fb%20');
});

test('form submit -> navigator -> real resolver HTTP -> ordered navigation callbacks', async (t) => {
  const api = await localApi(t, ({ url, response }) => {
    assert.equal(url.pathname, '/search/resolve'); assert.equal(url.searchParams.get('identifiers'), ADDRESS);
    reply(response, { results: [{ definitive: true, kind: 'coin', coin: { mint: 'resolved-mint' } }] });
  });
  const run = ports({ pasteRef: { current: ADDRESS }, getContractClient: api.client,
    resolveIdentifier: (term, signal) => resolveIdentifierWith(term, api.client(), { signal }),
    probeKnownMint: async () => { throw Error('must not probe'); } });
  let prevented = false;
  const unused = async () => { throw Error('definitive Solana result must stop other handlers'); };
  const submit = createSearchSubmit({ searchTerm: ' ' + ADDRESS + ' ', navigateSolana: createSolanaSearchNavigator(run.value),
    navigateEvm: unused, navigateHex: unused, navigateNear: unused,
    closeDialog: run.value.closeDialog, rememberTerm: run.value.rememberTerm, push: run.value.push });
  assert.equal(await submit({ preventDefault() { prevented = true; } }), undefined);
  assert.equal(prevented, true);
  assert.deepEqual(run.actions.map((item) => item.name), ['closeDialog', 'rememberTerm', 'trackMintPaste', 'trackSearch', 'setLastClick', 'handleCoinClick', 'push']);
  assert.deepEqual(run.actions[3].args, [{ searchTerm: ADDRESS, searchType: 2 }]);
  assert.deepEqual(run.actions[4].args, ['resolved-mint', { itemPosition: 0, marketCap: 0, sourceScreen: 9, sourceElement: 71 }, ADDRESS]);
  assert.equal(run.actions[4].args[1], run.actions[5].args[1]);
  assert.deepEqual(run.actions.at(-1).args, ['/coin/resolved-mint']);
  assert.equal(run.value.pasteRef.current, null); assert.equal(run.value.controllerRef.current, null); assert.equal(api.requests.length, 1);
});

test('definitive user differs from external-wallet on-curve admission and never falls back', async () => {
  for (const [kind, wallet, success] of [['user', false, true], ['external_wallet', false, false], ['external_wallet', true, true]]) {
    const run = ports({ resolveIdentifier: async () => ({ kind }), walletProfile: () => wallet, pasteRef: { current: ADDRESS } });
    assert.equal(await createSolanaSearchNavigator(run.value)(ADDRESS), success);
    if (success) {
      assert.deepEqual(run.actions.map((item) => item.name), ['closeDialog', 'rememberTerm', 'trackWalletPaste', 'trackSearch', 'push']);
      assert.deepEqual(run.actions.at(-1).args, ['/profile/' + ADDRESS]);
      assert.equal(run.actions[3].args[0].searchType, 3);
    } else assert.deepEqual(run.actions, []);
  }
});

test('fallback HTTP status/body controls whether the ordered read-probe ports may run', async (t) => {
  for (const [status, body, expectedProbes, success] of [[200, { mint: 'fallback-mint' }, [], true], [404, {}, ['known', 'chain'], true],
    [503, {}, [], false], [200, 'invalid-json', ['known', 'chain'], true]]) await t.test(String(status) + JSON.stringify(body), async (t) => {
    const api = await localApi(t, ({ response }) => reply(response, body, status));
    const observed = [];
    const run = ports({ getContractClient: api.client,
      probeKnownMint: async () => { observed.push('known'); return false; }, probeSolanaMint: async () => { observed.push('chain'); return true; } });
    assert.equal(await createSolanaSearchNavigator(run.value)(ADDRESS), success);
    assert.deepEqual(observed, expectedProbes);
    assert.equal(api.requests[0].url.pathname, '/coins-v3/' + ADDRESS);
    if (success) assert.deepEqual(run.actions.at(-1).args, ['/coin/' + (body.mint ?? ADDRESS)]);
    else assert.deepEqual(run.actions, []);
  });
});

test('known-mint success short circuits the chain probe; negative reads may select an on-curve profile', async () => {
  for (const known of [true, false]) {
    const observed = [];
    const run = ports({ getContractClient: () => async (_, options) => { options.hooks.afterResponse[0](null, null, { ok: false, status: 404 }); return null; },
      probeKnownMint: async () => { observed.push('known'); return known; }, probeSolanaMint: async () => { observed.push('chain'); return false; }, walletProfile: () => true });
    assert.equal(await createSolanaSearchNavigator(run.value)(ADDRESS), true);
    assert.deepEqual(observed, known ? ['known'] : ['known', 'chain']);
    assert.deepEqual(run.actions.at(-1).args, [(known ? '/coin/' : '/profile/') + ADDRESS]);
  }
});

test('invalid input aborts an old operation before admission and sends nothing', async () => {
  const old = new AbortController();
  const run = ports({ controllerRef: { current: old }, resolveIdentifier: async () => { throw Error('must not resolve'); } });
  assert.equal(await createSolanaSearchNavigator(run.value)('ordinary text'), false);
  assert.equal(old.signal.aborted, true); assert.equal(run.value.controllerRef.current, null); assert.deepEqual(run.actions, []);
});

test('real pending resolver abort is cancelled and cannot clear the newer operation', async (t) => {
  let arrived;
  const pending = new Promise((resolve) => { arrived = resolve; });
  const api = await localApi(t, ({ url, response }) => { if (url.searchParams.get('identifiers') === ADDRESS) arrived(); else reply(response, {}); });
  const run = ports({ getContractClient: api.client, resolveIdentifier: (term, signal) => resolveIdentifierWith(term, api.client(), { signal }) });
  const old = createSolanaSearchNavigator(run.value)(ADDRESS); await pending;
  const next = new AbortController(); run.value.controllerRef.current.abort(); run.value.controllerRef.current = next;
  assert.equal(await old, 'cancelled');
  assert.equal(run.value.controllerRef.current, next); assert.deepEqual(run.actions, []);
});

test('stale read-probe results cannot navigate; DOM AbortError classification is preserved', async () => {
  let finish, started;
  const ready = new Promise((resolve) => { started = resolve; });
  const run = ports({ getContractClient: () => async (_, options) => { options.hooks.afterResponse[0](null, null, { ok: false, status: 404 }); return null; },
    probeKnownMint: () => { started(); return new Promise((resolve) => { finish = resolve; }); } });
  const pending = createSolanaSearchNavigator(run.value)(ADDRESS); await ready;
  const next = new AbortController(); run.value.controllerRef.current = next; finish(true);
  assert.equal(await pending, 'cancelled'); assert.equal(run.value.controllerRef.current, next); assert.deepEqual(run.actions, []);
  for (const [error, expected] of [[new DOMException('aborted', 'AbortError'), 'cancelled'], [Object.assign(Error('abort'), { name: 'AbortError' }), false]]) {
    const value = ports({ getContractClient: () => async () => { throw error; } });
    assert.equal(await createSolanaSearchNavigator(value.value)(ADDRESS), expected);
  }
});

test('form orchestration stops only on exact true/cancelled and otherwise reaches encoded Explore navigation', async () => {
  const events = [], prevent = { preventDefault() { events.push('prevent'); } };
  const snapshot = { searchTerm: ' a +é& ', navigateSolana: async () => { events.push('solana'); return 1; },
    navigateEvm: async () => { events.push('evm'); return false; }, navigateHex: async () => { events.push('hex'); return {}; },
    navigateNear: async () => { events.push('near'); return undefined; }, closeDialog: () => events.push('close'),
    rememberTerm: (term) => events.push(term), push: (url) => events.push(url) };
  const submit = createSearchSubmit(snapshot); snapshot.searchTerm = 'changed'; await submit(prevent);
  assert.deepEqual(events, ['prevent', 'solana', 'evm', 'hex', 'near', 'close', 'a +é&', '/explore?q=a%20%2B%C3%A9%26']);
  for (const result of [true, 'cancelled']) {
    const seen = [];
    await createSearchSubmit({ ...snapshot, navigateSolana: async () => result, navigateEvm: async () => seen.push('must not run') })(prevent);
    assert.deepEqual(seen, []);
  }
  let called = false; await createSearchSubmit({ searchTerm: ' ', navigateSolana: async () => { called = true; } })(prevent); assert.equal(called, false);
});

async function changedAdapter(t, edit) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'search-navigation-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const file of new Set(['evidence/web/manifest.json', 'recovered/modules.json', ADAPTER, ...proof.proofs.map((item) => item.source), ...proof.opaqueBoundaries.map((item) => item.source)])) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true }); await copyFile(path.join(APP_ROOT, file), path.join(root, file));
  }
  const file = path.join(root, ADAPTER); await writeFile(file, edit(await readFile(file, 'utf8'))); return root;
}
test('source proof rejects fallback status, freshness, navigation order, admission and enum mutations', async (t) => {
  for (const edit of [(text) => text.replace('404 !== status', '403 !== status'),
    (text) => text.replace('!controller.signal.aborted', 'true'),
    (text) => text.replace('setLastClick(mint, metadata, term), handleCoinClick(mint, metadata, term)', 'handleCoinClick(mint, metadata, term), setLastClick(mint, metadata, term)'),
    (text) => text.replace('text.length < 32', 'text.length < 31'),
    (text) => text.replace('SEARCH_INPUT: 71', 'SEARCH_INPUT: 72')]) {
    await assert.rejects(verifyNavigation(await changedAdapter(t, edit)), /AST differs|selected enum value/);
  }
});
