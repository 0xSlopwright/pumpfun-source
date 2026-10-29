import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import * as client from '../reconstruction/follow-counts/client.mjs';
import { ContractError, withContractErrorNormalization } from '../reconstruction/contract-http-errors/decode.mjs';
import { extractFollowCounts } from '../scripts/original-follow-counts.mjs';
import { openCorpus, sha256 } from '../scripts/original-contracts/source.mjs';
import { validateDeclared } from '../scripts/original-contracts/validate.mjs';
const root = fileURLToPath(new URL('..', import.meta.url));
const artifact = await extractFollowCounts(root); const corpus = await openCorpus(root);

test('two physical count variants and actual544191 consumer are bound without an active winner', () => {
  assert.equal(artifact.contexts.length, 2);
  assert.notEqual(artifact.contexts[0].factorySha256, artifact.contexts[1].factorySha256);
  assert.equal(artifact.bounty.actualImportingConsumer.module, 544191);
  assert.equal(artifact.bounty.actualImportingConsumer.export, 'f');
  assert.equal(artifact.bounty.flag.fallback, true);
  assert.match(artifact.limits.join(' '), /no arbitrary active runtime winner/);
});

test('artifact reproduces; every verbatim original range and runtime dependency is authenticated', async () => {
  assert.equal(await fs.readFile(path.join(root, 'reconstruction/follow-counts/contract.json'), 'utf8'), JSON.stringify(artifact, null, 2)+'\n');
  for (const x of artifact.fragments) {
    const source = await corpus.capture(x.source);
    assert.equal(sha256(source.bytes.subarray(...x.utf8)), x.sha256);
    if (x.text !== undefined) assert.equal(source.text.slice(...x.utf16), x.text);
  }
  for (const x of [artifact.implementation, ...artifact.runtimeDependencies]) assert.equal(sha256(await fs.readFile(path.join(root, x.path))), x.sha256);
});

test('changed actual gate-consumer bytes fail before extraction or artifact publication', async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'follow-count-source-')); t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const selected = artifact.factories.find((x) => x.id === 18107).source;
  for (const name of ['evidence/web/manifest.json', 'recovered/modules.json', ...artifact.contexts.map((x) => x.source), selected]) {
    const dest = path.join(dir, name); await fs.mkdir(path.dirname(dest), { recursive: true }); await fs.copyFile(path.join(root, name), dest);
  }
  const file = path.join(dir, selected); const bytes = await fs.readFile(file); bytes[5500] ^= 1; await fs.writeFile(file, bytes);
  await assert.rejects(extractFollowCounts(dir), /capture authentication failed/);
});

test('count requests choose the exact two GETs, preserve signal, and add no query/auth policy', async () => {
  const seen = []; const transport = async (...args) => { seen.push(args); return { count: 0 }; };
  const signal = new AbortController().signal;
  await client.requestFollowCount(transport, 'following', 'subject', signal);
  await client.requestFollowCount(transport, 'followers', 'other', signal);
  assert.deepEqual(seen, [
    ['GET /following/v3/following/count/{userId}', { params: { userId: 'subject' }, signal }],
    ['GET /following/v3/followers/count/{userId}', { params: { userId: 'other' }, signal }],
  ]);
});

test('ordinary query keeps source key, enablement, finite normalization and explicit focus policy', async () => {
  const signal = new AbortController().signal; let seen;
  const options = client.followCountQueryOptions(async (...args) => { seen = args; return { count: -2.5 }; }, 'subject', 'followers');
  assert.deepEqual(options.queryKey, ['follow-count', 'followers', 'subject']);
  assert.equal(options.enabled, true); assert.equal(options.staleTime, 60000); assert.equal(options.refetchOnWindowFocus, false);
  assert.equal(await options.queryFn({ signal }), -2.5); assert.equal(seen[1].signal, signal);
  const disabled = client.followCountQueryOptions(async () => ({ count: 1 }), null, 'following', false);
  assert.equal(disabled.enabled, false); assert.deepEqual(disabled.queryKey, ['follow-count', 'following', '']);
  assert.equal(await disabled.queryFn({}), 1); // No additional manual-call guard.
});

test('bare-number declaration and finite client normalization stay separate from nonnegative UI eligibility', () => {
  const doc = artifact.declarations; const response = doc['x-follow-count-routes'][artifact.operations[0]].response;
  for (const value of [0, 10, Number.MAX_SAFE_INTEGER, -1, 0.5, Number.MAX_SAFE_INTEGER + 1]) assert.equal(validateDeclared(doc, response, { count: value }).success, true);
  for (const value of ['10', NaN, Infinity, undefined]) assert.equal(validateDeclared(doc, response, { count: value }).success, false);
  for (const value of [-1, 0.5, Number.MAX_SAFE_INTEGER + 1]) assert.equal(client.readFiniteFollowCount({ count: value }), value);
  for (const value of [undefined, null, '', '10', NaN, Infinity]) assert.equal(client.readFiniteFollowCount({ count: value }), null);
  assert.throws(() => client.readFiniteFollowCount(null), TypeError);
  assert.equal(client.classifyBountyFollowers({ count: -1 }), 'unknown');
  const params = doc['x-follow-count-routes'][artifact.operations[0]].params;
  assert.equal(validateDeclared(doc, params, { userId: '' }).success, true);
});

test('consumed count property is read in original order rather than silently snapshotted', () => {
  const values = [3, 4, 5]; let reads = 0;
  assert.equal(client.readFiniteFollowCount({ get count() { return values[reads++]; } }), 5); assert.equal(reads, 3);
});

test('local cache updater clamps only numeric data and preserves source delta coercion', () => {
  assert.equal(client.updateFollowCount(1, -5), 0); assert.equal(client.updateFollowCount(9, 1), 10);
  assert.equal(client.updateFollowCount(1, '2'), 12); // JS addition then Math.max.
  assert.ok(Number.isNaN(client.updateFollowCount(NaN, 1))); assert.equal(client.updateFollowCount(Infinity, 1), Infinity);
  const object = {}; for (const value of [undefined, null, '2', object]) assert.equal(client.updateFollowCount(value, 1), value);
});

test('cache capability changes only the requested type/user key without a server mutation', () => {
  const store = new Map([[JSON.stringify(client.followCountKey('followers', 'a')), 9],
    [JSON.stringify(client.followCountKey('followers', 'b')), 7], [JSON.stringify(client.followCountKey('following', 'a')), 5]]);
  const queryClient = { setQueryData(key, update) { store.set(JSON.stringify(key), update(store.get(JSON.stringify(key)))); } };
  client.applyFollowCountDelta({ queryClient, type: 'followers', userId: 'a', delta: 1 });
  assert.equal(store.get(JSON.stringify(client.followCountKey('followers', 'a'))), 10);
  assert.equal(store.get(JSON.stringify(client.followCountKey('followers', 'b'))), 7);
  assert.equal(store.get(JSON.stringify(client.followCountKey('following', 'a'))), 5);
});

test('bounty reader swallows only the maintained ContractError class, reusing prior691 runtime', async () => {
  const contract = new ContractError('route', 503, {}, { statusCode: 503 });
  assert.equal(await client.readBountyFollowerCount(async () => { throw contract; }, 'subject'), null);
  const ordinary = new Error('network'); await assert.rejects(client.readBountyFollowerCount(async () => { throw ordinary; }, 'subject'), (x) => x === ordinary);
  await assert.rejects(client.readBountyFollowerCount(async () => { throw { name: 'ContractError' }; }, 'subject'), (x) => x.name === 'ContractError' && !(x instanceof ContractError));
});

test('bounty callback keeps distinct key, omits focus override, and drops context AbortSignal', async () => {
  const seen = []; const options = client.bountyFollowerCountQueryOptions(async (...args) => { seen.push(args); return { count: 10 }; }, 'subject');
  assert.deepEqual(options.queryKey, ['follow', 'followersCount', 'subject']); assert.equal(options.staleTime, 60000);
  assert.equal(Object.hasOwn(options, 'refetchOnWindowFocus'), false);
  const signal = new AbortController().signal; assert.equal(await options.queryFn({ signal }), 10);
  assert.equal(seen[0][1].signal, undefined); assert.equal(Object.hasOwn(seen[0][1], 'signal'), true);
  assert.deepEqual(client.bountyFollowerGateQueryOptions(async () => ({}), false, 'subject').queryKey, ['follow', 'followersCount', null]);
});

test('source UI projection keeps unknown distinct from ineligible and feature enablement from viewer presence', () => {
  for (const flag of [false, true]) for (const viewer of [null, 'subject']) for (const count of [undefined, null, -1, NaN, Infinity, 0, 9, 10, 11]) for (const loading of [false, true]) {
    const value = client.projectBountyFollowerGate(flag, viewer, { data: count, isLoading: loading });
    const active = flag && !!viewer; const c = active ? count ?? null : null;
    const expected = !flag || typeof c !== 'number' || !Number.isFinite(c) || c < 0 ? 'unknown' : c >= 10 ? 'eligible' : 'ineligible';
    assert.deepEqual(value, { enabled: flag, eligibility: expected, isBlocked: flag && expected === 'ineligible', followersCount: c, minFollowers: 10, isLoading: active && loading });
  }
});

test('classifiers and original message formatting do not invent extra threshold validation', () => {
  assert.equal(client.classifyBountyFollowers({ count: 9 }), 'ineligible'); assert.equal(client.classifyBountyFollowers({ count: 10 }), 'eligible');
  assert.equal(client.classifyBountyFollowers({ count: 0, threshold: null }), 'eligible');
  assert.equal(client.bountyFollowerShortMessage(1), 'You need at least 1 follower to do this');
  assert.equal(client.bountyFollowerShortMessage(0), 'You need at least 10 followers to do this');
  assert.equal(client.bountyFollowerRequirementMessage({ currentFollowers: 1 }), 'Bounties need at least 10 followers on your pump.fun profile. You have 1 follower right now.');
  assert.match(client.bountyFollowerRequirementMessage({ minFollowers: Infinity, currentFollowers: NaN }), /Infinity.*NaN followers/);
});

async function serverFor(t, handler) {
  const server = createServer(handler); server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(async () => { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); });
  return `http://127.0.0.1:${server.address().port}`;
}
// Explicit TEST transport/parser controls. No inferred Ky/browser cookie or
// captured Zod parser implementation. Existing691 adapter handles realResponse.
function localTransport(origin) {
  return async (operation, { params, signal }) => withContractErrorNormalization(operation, async () => {
    const url = new URL(operation.slice(4).replace('{userId}', encodeURIComponent(String(params.userId))), origin);
    const response = await fetch(url, { signal }); if (!response.ok) throw { response };
    return response.json();
  }, { contracts: {}, routeErrorSchema: () => undefined, contractErrorBody: { safeParse: () => ({ success: false }) } });
}

test('real loopback count reads feed actual UI state projection and local key-partitioned updates', async (t) => {
  const seen = []; const origin = await serverFor(t, (req, res) => { seen.push(req.url); res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify({ count: req.url.includes('/following/count/') ? 12 : 9 })); });
  const transport = localTransport(origin);
  assert.equal(await client.followCountQueryOptions(transport, 'a/b', 'following').queryFn({}), 12);
  const ordinary = client.followCountQueryOptions(transport, 'viewer', 'followers');
  const ordinaryCount = await ordinary.queryFn({});
  const options = client.bountyFollowerGateQueryOptions(transport, true, 'viewer'); const count = await options.queryFn({});
  assert.equal(count, 9); assert.equal(client.projectBountyFollowerGate(true, 'viewer', { data: count, isLoading: false }).isBlocked, true);
  const cache = new Map([[JSON.stringify(ordinary.queryKey), ordinaryCount], [JSON.stringify(options.queryKey), count]]);
  const queryClient = { setQueryData(key, update) { cache.set(JSON.stringify(key), update(cache.get(JSON.stringify(key)))); } };
  client.applyFollowCountDelta({ queryClient, type: 'followers', userId: 'viewer', delta: 1 });
  assert.equal(cache.get(JSON.stringify(ordinary.queryKey)), 10);
  assert.equal(cache.get(JSON.stringify(options.queryKey)), 9); // Distinct source cache key is not silently updated.
  assert.deepEqual(seen, ['/following/v3/following/count/a%2Fb', '/following/v3/followers/count/viewer', '/following/v3/followers/count/viewer']);
});

test('real loopback HTTP failure is normalized by existing691 and becomes unknown only in bounty reader', async (t) => {
  const origin = await serverFor(t, (_req, res) => { res.writeHead(503, { 'content-type': 'application/json' }); res.end('{"error":"CONTROLLED_LOCAL_FAILURE"}'); });
  const transport = localTransport(origin);
  await assert.rejects(client.followCountQueryOptions(transport, 'subject', 'followers').queryFn({}), (x) => x instanceof ContractError && x.status === 503);
  const count = await client.bountyFollowerCountQueryOptions(transport, 'subject').queryFn({}); assert.equal(count, null);
  const state = client.projectBountyFollowerGate(true, 'subject', { data: count, isLoading: false }); assert.equal(state.eligibility, 'unknown'); assert.equal(state.isBlocked, false);
});

test('real loopback ordinary query forwards pending-fetch cancellation without error coercion', async (t) => {
  let received; const started = new Promise((resolve) => { received = resolve; });
  const origin = await serverFor(t, (_req, _res) => received()); const controller = new AbortController(); const reason = new Error('owned cancellation');
  const pending = client.followCountQueryOptions(localTransport(origin), 'subject', 'followers').queryFn({ signal: controller.signal });
  await started; controller.abort(reason); await assert.rejects(pending, (x) => x === reason);
});

test('real loopback bounty callback still reads when its unused query context signal is already aborted', async (t) => {
  let requests = 0; const origin = await serverFor(t, (_req, res) => { requests++; res.writeHead(200, { 'content-type': 'application/json' }); res.end('{"count":10}'); });
  const controller = new AbortController(); controller.abort(new Error('unused context'));
  assert.equal(await client.bountyFollowerCountQueryOptions(localTransport(origin), 'subject').queryFn({ signal: controller.signal }), 10);
  assert.equal(requests, 1);
});
