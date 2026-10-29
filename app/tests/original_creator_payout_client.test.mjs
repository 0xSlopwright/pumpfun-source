import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { mkdtemp, mkdir, copyFile, readFile, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { creatorPayoutVariants, createCreatorPayoutModule } from '../reconstruction/creator-payout-client/client.mjs';
import { createPayoutFetchTransport } from '../reconstruction/creator-payout-client/fetch-transport.mjs';
import { verifyCreatorPayoutClient } from '../scripts/original-creator-payout-client.mjs';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const row = (rank, extra = {}) => ({ rank, wallets: [`synthetic-wallet-${rank}`], totalPaidUsdc: rank + 0.25, payoutCount: 1, ...extra });

function harness(variant, transport = async () => undefined) {
  let active = 'board';
  const caches = new Map();
  const options = {};
  const results = { board: {}, total: {} };
  const module = createCreatorPayoutModule({ variant,
    useMemoCache(size) {
      assert.equal(size, active === 'board' ? 12 : 5);
      if (!caches.has(active)) caches.set(active, Array(size).fill(Symbol.for('react.memo_cache_sentinel')));
      return caches.get(active);
    },
    useInfiniteQuery(value) { options.board = value; return results.board; },
    useQuery(value) { options.total = value; return results.total; },
    createClient: () => transport,
  });
  return { module, options, board(value = {}) { active = 'board'; assert.equal(module.useLeaderboard(value), results.board); return options.board; },
    total(value = {}) { active = 'total'; assert.equal(module.useOwnTotal(value), results.total); return options.total; } };
}

async function loopback(t, handle) {
  const server = createServer(handle);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(async () => { const closed = new Promise((resolve) => server.close(resolve)); server.closeAllConnections(); await closed; });
  return `http://127.0.0.1:${server.address().port}/local-read`;
}

test('all three source module variants and actual consumers are retained without choosing a global winner', async () => {
  const contract = await verifyCreatorPayoutClient();
  assert.equal(contract.variants.length, 3);
  assert.equal(contract.consumers.length, 3);
  assert.deepEqual(contract.variants.map((v) => v.factory.sha256), creatorPayoutVariants.map((v) => v.sha256));
  assert.ok(contract.variants.every((v) => v.factory.ids.join(',') === '80559,493270' && v.retainedAsts.length > 10));
  assert.throws(() => createCreatorPayoutModule({}), /Explicit reviewed/);
  assert.throws(() => createCreatorPayoutModule({ variant: 'unreviewed' }), /Explicit reviewed/);
});

test('complete-module source gate rejects helper logic drift in one variant', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'creator-payout-source-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const contract = JSON.parse(await readFile(path.join(APP, 'reconstruction/creator-payout-client/contract.json')));
  const inputs = new Set(['scripts/original-contracts/source.mjs', 'evidence/web/manifest.json', 'recovered/modules.json',
    ...contract.witnesses.map((w) => w.source)]);
  for (const name of inputs) { const target = path.join(root, name); await mkdir(path.dirname(target), { recursive: true }); await copyFile(path.join(APP, name), target); }
  for (const name of ['client.mjs', 'contract.json', ...contract.variants.map((v) => v.path)]) {
    const target = path.join(root, 'reconstruction/creator-payout-client', name);
    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(path.join(APP, 'reconstruction/creator-payout-client', name), target);
  }
  const target = path.join(root, 'reconstruction/creator-payout-client', contract.variants[0].path);
  const text = await readFile(target, 'utf8');
  assert.ok(text.includes('Math.min(500,'));
  await writeFile(target, text.replace('Math.min(500,', 'Math.min(501,'));
  await assert.rejects(verifyCreatorPayoutClient(root), /maintained AST differs/);
});

for (const { sha256: variant } of creatorPayoutVariants) {
  const label = variant.slice(0, 12);

  test(`${label}: original normalization rejects malformed rows and preserves exact numeric/boolean/nullish semantics`, async () => {
    const raw = { entries: [null, false, {}, row(0), row(-1), row(Infinity), { rank: 1, wallets: [1, null] },
      row(0.5, { wallets: ['', 3, 'b'], userId: '', username: 9, profileImageUrl: null, isVerified: 'true',
        verifiedBadgeVisible: null, walletAddress: 7, isViewer: false, viewerFollows: null,
        totalPaidUsdc: -1.75, payoutCount: 1.5, extraServerField: 'not projected' }),
      row(2, { verifiedBadgeVisible: false, isVerified: true, totalPaidUsdc: NaN, payoutCount: Infinity })], totalEarners: Infinity };
    const before = structuredClone(raw);
    const state = harness(variant, async () => raw);
    const result = await state.module.requestLeaderboard({ page: 0 });
    assert.equal(result.totalEarners, 0);
    assert.equal(result.entries.length, 2);
    assert.deepEqual(result.entries[0], { rank: 0.5, userId: '', username: null, profileImageUrl: null,
      isVerified: false, verifiedBadgeVisible: true, wallets: ['', 'b'], walletAddress: null,
      isViewer: false, viewerFollows: null, totalPaidUsdc: -1.75, payoutCount: 1.5 });
    assert.equal(result.entries[1].totalPaidUsdc, 0);
    assert.equal(result.entries[1].payoutCount, 0);
    assert.equal(result.entries[1].verifiedBadgeVisible, false);
    assert.equal(result.entries[1].isViewer, undefined);
    assert.deepEqual(raw, before);
    assert.equal(state.module.rowKey(result.entries[0]), '');
    assert.equal(state.module.rowKey({ userId: null, wallets: ['wallet'], rank: 4 }), 'wallet');
    assert.equal(state.module.rowKey({ wallets: [], rank: 4 }), 'rank-4');
  });

  test(`${label}: request options, period omission and raw total normalization match the source`, async () => {
    const calls = [];
    const signal = new AbortController().signal;
    const state = harness(variant, async (...args) => { calls.push(args); return { entries: [], totalEarners: 7, totalPaidUsdc: -2.5 }; });
    await state.module.requestLeaderboard({ page: 2, signal });
    await state.module.requestLeaderboard({ page: 3, period: '1w', signal });
    assert.equal(await state.module.requestOwnTotal({ signal }), -2.5);
    assert.deepEqual(calls.map(([operation, options]) => [operation, options.query]), [
      ['GET /payouts/leaderboard', { page: 2, pageSize: 50, period: undefined }],
      ['GET /payouts/leaderboard', { page: 3, pageSize: 50, period: '1w' }],
      ['GET /payouts', { page: 0, pageSize: 1 }],
    ]);
    for (const [, options] of calls) {
      assert.equal(options.signal, signal);
      assert.equal(options.credentials, 'include');
      assert.deepEqual(options.headers, { 'Content-Type': 'application/json' });
    }
    const invalid = harness(variant, async () => ({ totalPaidUsdc: '2.5' }));
    assert.equal(await invalid.module.requestOwnTotal({}), 0);
    assert.deepEqual(await invalid.module.requestLeaderboard({}), { entries: [], totalEarners: 0 });
  });

  test(`${label}: paging uses normalized lengths, the 500 boundary and first-page totals without sorting/deduplicating`, () => {
    const state = harness(variant);
    const page = { entries: Array.from({ length: 50 }, (_, index) => row(index + 1)), totalEarners: 501 };
    assert.equal(state.module.nextPage({ lastPage: page, lastPageParam: 1, loadedEntries: 100 }), 2);
    assert.equal(state.module.nextPage({ lastPage: page, lastPageParam: 9, loadedEntries: 500 }), null);
    assert.equal(state.module.nextPage({ lastPage: { ...page, totalEarners: 100 }, lastPageParam: 1, loadedEntries: 100 }), null);
    assert.equal(state.module.nextPage({ lastPage: { ...page, entries: page.entries.slice(1) }, lastPageParam: 1, loadedEntries: 99 }), null);
    const options = state.board();
    assert.equal(options.getNextPageParam(page, [page, page], 1), 2);
    const duplicate = row(7);
    assert.deepEqual(options.select({ pages: [{ entries: [duplicate], totalEarners: 53 }, { entries: [duplicate, row(2)], totalEarners: 999 }] }),
      { entries: [duplicate, duplicate, row(2)], totalEarners: 53 });
    assert.deepEqual(options.select({ pages: [] }), { entries: [], totalEarners: 0 });
  });

  test(`${label}: module-specific 401 identity drives retry, focus and poll policies; multi-page polling is stopped`, () => {
    const state = harness(variant);
    const initial = state.board({ period: '1d', isLoggedIn: true, enabled: true, refetchIntervalMs: 1000 });
    assert.deepEqual(initial.queryKey, ['payout-leaderboard', '1d', true]);
    assert.equal(initial.initialPageParam, 0);
    assert.equal(initial.staleTime, 60000);
    assert.equal(initial.refetchIntervalInBackground, false);
    assert.equal(state.board({ period: '1d', isLoggedIn: true, enabled: true, refetchIntervalMs: 1000 }), initial);
    const unauthorized = new state.module.FetchError(401);
    assert.equal(unauthorized.name, 'PayoutLeaderboardFetchError');
    assert.equal(unauthorized.message, 'Payout leaderboard failed (401)');
    assert.equal(initial.retry(0, unauthorized), false);
    assert.equal(initial.refetchOnWindowFocus({ state: { error: unauthorized } }), false);
    assert.equal(initial.refetchInterval({ state: { error: unauthorized, data: { pages: [{}] } } }), false);
    assert.equal(initial.retry(0, new state.module.FetchError(503)), true);
    assert.equal(initial.retry(1, new Error()), false);
    assert.equal(initial.retry(0, Object.assign(new Error(), { status: 401 })), true);
    assert.equal(initial.refetchOnWindowFocus({ state: { error: null } }), true);
    assert.equal(initial.refetchInterval({ state: { error: null, data: { pages: [{}] } } }), 1000);
    assert.equal(initial.refetchInterval({ state: { error: null, data: { pages: [{}, {}] } } }), false);
    const anonymous = state.board({ refetchIntervalMs: undefined });
    assert.deepEqual(anonymous.queryKey, ['payout-leaderboard', 'all', false]);
    assert.equal(anonymous.enabled, undefined);
    assert.equal(anonymous.refetchInterval({ state: {} }), false);
    const total = state.total({ walletAddress: 'SyntheticViewer', enabled: true });
    assert.deepEqual(total.queryKey, ['rewards-payouts-total', 'SyntheticViewer']);
    assert.equal(total.enabled, true);
    assert.equal(total.staleTime, 3600000);
    assert.equal(total.retry, 1);
    assert.equal(state.total({ walletAddress: null, enabled: true }).enabled, false);
  });

  test(`${label}: the complete queryFn/request/normalizer/pager/selector flow executes over real loopback HTTP`, async (t) => {
    const requests = [];
    const baseUrl = await loopback(t, (request, response) => {
      const url = new URL(request.url, 'http://127.0.0.1');
      requests.push({ method: request.method, path: url.pathname, query: Object.fromEntries(url.searchParams), contentType: request.headers['content-type'] });
      response.writeHead(200, { 'Content-Type': 'application/json' });
      if (url.pathname.endsWith('/leaderboard')) {
        const first = url.searchParams.get('page') === '0';
        response.end(JSON.stringify({ entries: Array.from({ length: first ? 50 : 3 }, (_, i) => row(first ? i + 1 : i + 51)), totalEarners: 53 }));
      } else response.end(JSON.stringify({ totalPaidUsdc: 9.75 }));
    });
    const observed = [];
    const transport = createPayoutFetchTransport({ baseUrl, fetch: (request) => { observed.push(request); return fetch(request); } });
    const state = harness(variant, transport);
    const options = state.board({ period: 'all', isLoggedIn: false, enabled: true });
    const signal = new AbortController().signal;
    const first = await options.queryFn({ pageParam: options.initialPageParam, signal });
    const next = options.getNextPageParam(first, [first], 0);
    assert.equal(next, 1);
    const second = await options.queryFn({ pageParam: next, signal });
    assert.equal(options.getNextPageParam(second, [first, second], next), null);
    const selected = options.select({ pages: [first, second] });
    assert.equal(selected.entries.length, 53);
    assert.equal(selected.entries[52].rank, 53);
    assert.equal(selected.totalEarners, 53);
    assert.equal(await state.total({ walletAddress: 'SyntheticViewer', enabled: true }).queryFn({ signal }), 9.75);
    assert.deepEqual(requests, [
      { method: 'GET', path: '/local-read/payouts/leaderboard', query: { page: '0', pageSize: '50' }, contentType: 'application/json' },
      { method: 'GET', path: '/local-read/payouts/leaderboard', query: { page: '1', pageSize: '50' }, contentType: 'application/json' },
      { method: 'GET', path: '/local-read/payouts', query: { page: '0', pageSize: '1' }, contentType: 'application/json' },
    ]);
    assert.ok(observed.every((request) => request.credentials === 'include'));
  });

  test(`${label}: real 401 creates the retained class before decoding, and both read signals really abort`, async (t) => {
    let arrived;
    let rejectOwnTotal = true;
    let pendingRequest = new Promise((resolve) => { arrived = resolve; });
    const baseUrl = await loopback(t, (request, response) => {
      const url = new URL(request.url, 'http://127.0.0.1');
      if (url.searchParams.get('page') === '401') { response.writeHead(401); response.end('not JSON'); }
      else if (!url.pathname.endsWith('/leaderboard') && rejectOwnTotal) { response.writeHead(401); response.end('not JSON'); }
      else if (url.searchParams.get('page') === '0' && !url.pathname.endsWith('/leaderboard')) { arrived(); }
      else arrived();
    });
    const state = harness(variant, createPayoutFetchTransport({ baseUrl, fetch }));
    let actualError;
    await assert.rejects(state.module.requestLeaderboard({ page: 401 }), (error) => {
      actualError = error; return error instanceof state.module.FetchError && error.status === 401;
    });
    assert.equal(state.board().retry(0, actualError), false);
    await assert.rejects(state.module.requestOwnTotal({}), (error) =>
      !(error instanceof state.module.FetchError) && error.message === 'Payouts failed (401)');
    rejectOwnTotal = false;
    for (const operation of ['board', 'total']) {
      const controller = new AbortController();
      const result = operation === 'board' ? state.module.requestLeaderboard({ page: 0, signal: controller.signal }) : state.module.requestOwnTotal({ signal: controller.signal });
      const rejected = assert.rejects(result, (error) => error.name === 'AbortError');
      await pendingRequest;
      controller.abort();
      await rejected;
      pendingRequest = new Promise((resolve) => { arrived = resolve; });
    }
  });
}

test('local transport keeps the supplied origin, requires explicit capabilities and cannot send mutations', async () => {
  let actual;
  const transport = createPayoutFetchTransport({ baseUrl: 'http://127.0.0.1:12345//segment.invalid', fetch: async (request) => {
    actual = new URL(request.url); return Response.json({});
  } });
  await transport('GET /payouts', { query: {}, credentials: 'include' });
  assert.equal(actual.origin, 'http://127.0.0.1:12345');
  assert.equal(actual.pathname, '//segment.invalid/payouts');
  await assert.rejects(transport('POST /payouts', {}), /Unsupported/);
  assert.throws(() => createPayoutFetchTransport({ baseUrl: 'file:///tmp/data', fetch }), TypeError);
  assert.throws(() => createPayoutFetchTransport({ baseUrl: 'http://127.0.0.1/' }), /explicit fetch/);
});
