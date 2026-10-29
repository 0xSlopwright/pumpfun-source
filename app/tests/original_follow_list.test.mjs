import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { planFollowList, normalizeFollowList, followListIdentity, initialFollowListPage,
  setFollowListPage, paginateFollowList } from '../packages/frontend/src/lib/original-follow-list.mjs';
import { extractFollowList } from '../scripts/original-contracts/follow-list.mjs';
import { openCorpus, sha256 } from '../scripts/original-contracts/source.mjs';
import { validateDeclared } from '../scripts/original-contracts/validate.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const artifact = await extractFollowList(root);
const corpus = await openCorpus(root);

test('actual export500056.Q is selected separately from shared mutation hook350989', () => {
  assert.equal(artifact.workflow.module, 500056);
  assert.equal(artifact.workflow.export, 'Q');
  const source = artifact.fragments.find((entry) => `${entry.source}:${entry.utf16.join(':')}` === artifact.workflow.source);
  assert.ok(source.text.includes('GET /following/v3/followers/search/{userId}'));
  assert.ok(!source.text.includes('POST '));
  assert.ok(!source.text.includes('DELETE '));
  assert.match(artifact.limits.join('\n'), /No importing UI caller is established/);
});

test('actual import, constructor, client getter and route-catalog edges close separately', () => {
  assert.deepEqual(artifact.transport.importEdges.map(({ from, to }) => [from, to]), [
    [500056, 759257], [759257, 30181], [759257, 503630], [30181, 402030], [402030, 898661], [402030, 972407],
  ]);
  const keys = new Set(artifact.fragments.map((x) => `${x.source}:${x.utf16.join(':')}`));
  for (const edge of artifact.transport.importEdges) assert.ok(keys.has(edge.witness));
  assert.ok(keys.has(artifact.workflow.queryCallback));
});

test('all selected complete index entries remain equal to the published pre-expansion cohort', async () => {
  const comparison = JSON.parse(await fs.readFile(path.join(root, 'contracts/original-follow-list-index-compatibility.json'), 'utf8'));
  assert.equal(comparison.before.variants, 4915); assert.equal(comparison.after.variants, 5947);
  assert.equal(comparison.after.sha256, corpus.anchors.inventorySha256);
  assert.equal(comparison.selected.length, 15);
  for (const row of comparison.selected) {
    const entries = corpus.index.modules.filter((entry) => entry.ids.includes(row.id));
    assert.deepEqual(entries, row.entries);
    assert.equal(sha256(Buffer.from(JSON.stringify(entries))), row.completeEntriesSha256);
  }
});

test('plain request plan fetches one bounded array, omits default sort and preserves signal', () => {
  const signal = new AbortController().signal;
  const plan = planFollowList('followers', 'subject', undefined, signal);
  assert.deepEqual(plan, { queryKey: ['follow-list', 'followers', 'subject', 'followers', ''], enabled: true,
    staleTime: 30000, refetchInterval: 60000, refetchIntervalInBackground: false, refetchOnWindowFocus: true,
    request: { operation: 'GET /following/v3/followers/{userId}', params: { userId: 'subject' }, query: { limit: 1000 }, signal } });
  assert.equal(planFollowList('following', 'subject', { sort: 'recent' }).request.operation, 'GET /following/v3/following/{userId}');
  assert.deepEqual(planFollowList('following', 'subject', { sort: 'recent' }).request.query, { limit: 1000, sort: 'recent' });
  assert.equal(Object.hasOwn(plan.request.query, 'offset'), false);
});

test('search uses presence rather than truthiness, and ignores sort in request', () => {
  for (const term of ['', null, '  a  ']) {
    const plan = planFollowList('followers', 'subject', { searchTerm: term, sort: 'recent' });
    assert.equal(plan.request.operation, 'GET /following/v3/followers/search/{userId}');
    assert.deepEqual(plan.request.query, { searchTerm: term, limit: 100 });
  }
  assert.equal(planFollowList('following', 'subject', { searchTerm: 'alice' }).request.operation, 'GET /following/v3/following/search/{userId}');
  assert.equal(planFollowList('followers', 'subject', { searchTerm: undefined }).request.operation, 'GET /following/v3/followers/{userId}');
});

test('source cache tuple collision is preserved without asserting TanStack hash behavior', () => {
  const plain = planFollowList('followers', 'subject');
  const empty = planFollowList('followers', 'subject', { searchTerm: '' });
  const nil = planFollowList('followers', 'subject', { searchTerm: null });
  assert.deepEqual(plain.queryKey, empty.queryKey);
  assert.deepEqual(plain.queryKey, nil.queryKey);
  assert.notEqual(plain.request.operation, empty.request.operation);
  assert.notDeepEqual(planFollowList('following', 'subject').queryKey, plain.queryKey);
});

test('enablement does not fabricate identity validation or a request guard', () => {
  assert.equal(planFollowList('followers', undefined).enabled, false);
  assert.equal(planFollowList('followers', '', { enabled: true }).enabled, false);
  assert.equal(planFollowList('followers', 'subject', { enabled: false }).enabled, false);
  assert.equal(planFollowList('followers', ' ').enabled, true);
  assert.equal(planFollowList('followers', undefined).request.params.userId, undefined);
  assert.equal(Object.hasOwn(planFollowList('followers', 'subject').request, 'credentials'), false);
  assert.equal(artifact.transport.effectiveCredentials, 'same-origin');
});

test('normalizer preserves legacy alias precedence and nullish-only defaults', () => {
  const unknown = { privateUnknown: 'client data only' };
  const row = { user_id: '', userId: 'canonical', address: null, kind: null, username: null, ...unknown };
  assert.deepEqual(normalizeFollowList([row]), [{ user_id: '', userId: '', address: '', kind: 'person', username: null, ...unknown }]);
  assert.equal(row.userId, 'canonical');
  assert.deepEqual(normalizeFollowList([{ userId: 'canonical', address: '', kind: '' }]), [{ userId: 'canonical', address: '', kind: '' }]);
  assert.deepEqual(normalizeFollowList([{}]), [{ address: '', userId: null, kind: 'person' }]);
  assert.deepEqual(normalizeFollowList([{ user_id: null, userId: 'canonical' }]), [{ user_id: null, userId: 'canonical', address: '', kind: 'person' }]);
});

test('nonarrays become empty but invalid rows are not silently converted into schema-valid records', () => {
  for (const value of [null, undefined, {}, '', 0]) assert.deepEqual(normalizeFollowList(value), []);
  assert.throws(() => normalizeFollowList([null]), TypeError);
});

test('ten-row pagination uses only fetched rows and does not send more remote requests', () => {
  const all = normalizeFollowList(Array.from({ length: 23 }, (_, index) => ({ userId: `u${index}` })));
  assert.deepEqual(initialFollowListPage('subject'), { listKey: 'subject|followers|', page: 1 });
  const state = setFollowListPage('subject', 2);
  const page = paginateFollowList(all, 'subject', undefined, state);
  assert.equal(page.all, all);
  assert.deepEqual(page.displayed.map((row) => row.userId), Array.from({ length: 10 }, (_, index) => `u${index + 10}`));
  assert.equal(page.totalCount, 23);
  assert.equal(page.totalPages, 3);
  assert.equal(page.currentPage, 2);
});

test('page identity omits direction, resets on source key changes, and does not clamp shrinking data', () => {
  const state = setFollowListPage('subject', 4);
  assert.equal(followListIdentity('subject'), followListIdentity('subject', { searchTerm: '' }));
  assert.equal(followListIdentity('subject'), followListIdentity('subject', { searchTerm: null }));
  // No direction appears in this source identity; both request directions use it.
  assert.equal(planFollowList('followers', 'subject').queryKey[1], 'followers');
  assert.equal(planFollowList('following', 'subject').queryKey[1], 'following');
  const shrunk = paginateFollowList([{ userId: 'one' }], 'subject', undefined, state);
  assert.equal(shrunk.currentPage, 4);
  assert.equal(shrunk.totalPages, 1);
  assert.deepEqual(shrunk.displayed, []);
  assert.equal(paginateFollowList([], 'other', undefined, state).currentPage, 1);
  assert.equal(paginateFollowList([], 'subject', { sort: 'recent' }, state).currentPage, 1);
  assert.equal(paginateFollowList([], 'subject', { searchTerm: 'new' }, state).currentPage, 1);
  assert.equal(paginateFollowList([], 'subject').totalPages, 0);
});

test('plain/search schemas remain different, with exact bounds and safe offsets', () => {
  const doc = artifact.declarations;
  const routes = doc['x-follow-list-routes'];
  const plain = routes['GET /following/v3/followers/{userId}'];
  const search = routes['GET /following/v3/followers/search/{userId}'];
  assert.equal(validateDeclared(doc, plain.query, { limit: 1000, offset: Number.MAX_SAFE_INTEGER }).success, true);
  assert.equal(validateDeclared(doc, plain.query, { limit: 1001 }).success, false);
  assert.equal(validateDeclared(doc, plain.query, { offset: Number.MAX_SAFE_INTEGER + 1 }).success, false);
  assert.equal(validateDeclared(doc, search.query, { searchTerm: '😀'.repeat(50), limit: 100 }).success, true);
  assert.equal(validateDeclared(doc, search.query, { searchTerm: '😀'.repeat(51) }).success, false);
  assert.equal(validateDeclared(doc, search.query, { searchTerm: '', limit: 100 }).success, false);
  assert.equal(validateDeclared(doc, search.query, { searchTerm: null, limit: 100 }).success, false);
  assert.equal(validateDeclared(doc, plain.response, null).success, false);
  assert.equal(validateDeclared(doc, plain.response, []).success, true);
  assert.notDeepEqual(plain.response, search.response);
});

test('artifact reproduces and binds raw original fragments and independent implementation bytes', async () => {
  assert.equal(await fs.readFile(path.join(root, 'contracts/original-follow-list.json'), 'utf8'), `${JSON.stringify(artifact, null, 2)}\n`);
  for (const fragment of artifact.fragments) {
    const capture = await corpus.capture(fragment.source);
    assert.equal(sha256(capture.bytes.subarray(...fragment.utf8)), fragment.sha256);
    if ('text' in fragment) assert.equal(fragment.text, capture.text.slice(...fragment.utf16));
  }
  assert.equal(sha256(await fs.readFile(path.join(root, artifact.implementation.path))), artifact.implementation.sha256);
});

test('changed actual shared-factory capture fails before attribution or publishing', async (t) => {
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'original-follow-list-'));
  t.after(() => fs.rm(temporary, { recursive: true, force: true }));
  const capture = artifact.factories.find((entry) => entry.id === 500056).source;
  for (const relative of ['evidence/web/manifest.json', 'recovered/modules.json', capture]) {
    const target = path.join(temporary, relative);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(path.join(root, relative), target);
  }
  const target = path.join(temporary, capture);
  const bytes = await fs.readFile(target); bytes[22500] ^= 1; await fs.writeFile(target, bytes);
  await assert.rejects(extractFollowList(temporary), /capture authentication failed/);
});
