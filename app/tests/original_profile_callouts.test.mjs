import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { planProfileCallouts, profileCalloutsRequest, mapProfileCallout,
  mapProfileCalloutsResponse, profileCalloutsPage, nextProfileCalloutsPage,
  flattenProfileCallouts, parseDeclaredProfileWindow } from '../packages/frontend/src/lib/original-profile-callouts.mjs';
import { extractProfileCallouts } from '../scripts/original-contracts/profile-callouts.mjs';
import { validateDeclared } from '../scripts/original-contracts/validate.mjs';
import { openCorpus, sha256 } from '../scripts/original-contracts/source.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const artifact = await extractProfileCallouts(root);
const corpus = await openCorpus(root);

test('original defaults and full cache-key tuple remain explicit', () => {
  assert.deepEqual(planProfileCallouts({ userId: 'subject' }), {
    enabled: true, queryKey: ['callouts', 'by-user', 'subject', 30, 'TIMESTAMP', 'DESC', false, null],
    initialPageParam: undefined, staleTime: 60000, gcTime: 300000, refetchOnWindowFocus: false,
  });
  assert.deepEqual(artifact.planner.cachePolicy, { staleTime: 60000, gcTime: 300000, refetchOnWindowFocus: false });
  assert.notDeepEqual(planProfileCallouts({ userId: 'subject', window: 'daily' }).queryKey,
    planProfileCallouts({ userId: 'subject', window: 'DAILY' }).queryKey);
});

test('query enablement is separate from a manually invoked request guard', () => {
  assert.equal(planProfileCallouts({}).enabled, false);
  assert.equal(planProfileCallouts({ userId: '', enabled: true }).enabled, false);
  assert.equal(planProfileCallouts({ userId: 'subject', enabled: false }).enabled, false);
  assert.throws(() => profileCalloutsRequest({}, undefined), /^Error: userId is required$/);
  // The subject is neither trimmed nor treated as an authenticated principal.
  assert.equal(planProfileCallouts({ userId: ' ' }).enabled, true);
  assert.equal(profileCalloutsRequest({ userId: 'subject', enabled: false }).params.userId, 'subject');
});

test('request planner resends filters and preserves source falsey omission and signal identity', () => {
  const signal = new AbortController().signal;
  const options = { userId: 'user/a b', limit: 7, sortBy: 'MULTIPLE', sortOrder: 'ASC', includeMembers: true, window: ' daily ' };
  const request = profileCalloutsRequest(options, 'opaque-cursor', signal);
  assert.deepEqual(request, { operation: 'GET /callout/list/{userId}', params: { userId: 'user/a b' },
    query: { limit: 7, sortBy: 'MULTIPLE', sortOrder: 'ASC', pageToken: 'opaque-cursor', includeMembers: true, window: ' daily ' },
    credentials: 'include', headers: { 'Content-Type': 'application/json' }, signal });
  const empty = profileCalloutsRequest({ userId: 'subject', includeMembers: false, window: '' }, '');
  assert.equal(empty.query.pageToken, undefined);
  assert.equal(empty.query.window, undefined);
  assert.equal(empty.query.includeMembers, undefined);
  assert.equal(request.params.userId, options.userId); // Encoding belongs to the shared transport.
});

test('client planning does not silently become declared-schema validation', () => {
  const request = profileCalloutsRequest({ userId: 'subject', limit: 0, sortBy: 'OTHER' });
  assert.equal(request.query.limit, 0);
  assert.equal(request.query.sortBy, 'OTHER');
  const fields = artifact.declarations['x-profile-query-fields'];
  assert.equal(validateDeclared(artifact.declarations, fields.limit, 0).success, false);
  assert.equal(validateDeclared(artifact.declarations, fields.sortBy, 'OTHER').success, false);
});

test('declared window transform is independently reconstructed and is not applied to requests', () => {
  for (const input of [undefined, '', ' \t\n']) assert.deepEqual(parseDeclaredProfileWindow(input), { success: true, value: undefined });
  assert.deepEqual(parseDeclaredProfileWindow(' daily '), { success: true, value: 'DAILY' });
  assert.deepEqual(parseDeclaredProfileWindow('last_round'), { success: true, value: 'LAST_ROUND' });
  assert.deepEqual(parseDeclaredProfileWindow('alltime'), { success: true, value: 'ALLTIME' });
  for (const input of [null, 0, false, 'yearly', []]) assert.deepEqual(parseDeclaredProfileWindow(input), { success: false });
  const declaration = artifact.declarations['x-declared-window'];
  for (const value of declaration.output.enum) assert.deepEqual(parseDeclaredProfileWindow(value.toLowerCase()), { success: true, value });
  assert.equal(declaration.appliedByWebsiteRequestBuilder, false);
  assert.equal(profileCalloutsRequest({ userId: 'subject', window: ' daily ' }).query.window, ' daily ');
});

test('wire mapper retains unknown fields and distinguishes absent/null/false viewer fields', () => {
  const row = { calloutId: 'id', thesis: '', likes: 0, hasLiked: false, hasReposted: null, perp: null, future: { x: 1 } };
  const mapped = mapProfileCallout(row);
  assert.deepEqual(mapped, { calloutId: 'id', future: row.future, perp: null, note: '', likeCount: 0, likedByViewer: false });
  assert.equal(Object.hasOwn(mapped, 'repostedByViewer'), false);
  assert.deepEqual(mapProfileCallout({ calloutId: 'id' }), { calloutId: 'id' });
  assert.deepEqual(mapProfileCallout({ thesis: null, likes: null, hasLiked: null }), { note: null, likeCount: null });
  assert.equal(row.hasLiked, false);
});

test('response adaptation keeps empty and null cursors distinct from omission', () => {
  assert.deepEqual(mapProfileCalloutsResponse({ callouts: null }), { callouts: [] });
  assert.deepEqual(mapProfileCalloutsResponse({ callouts: [], nextPageToken: '' }), { callouts: [], nextPageToken: '' });
  assert.deepEqual(mapProfileCalloutsResponse({ nextPageToken: null }), { callouts: [], nextPageToken: null });
  assert.throws(() => mapProfileCalloutsResponse({ callouts: {} }), TypeError);
});

test('original client short-page cursor behavior and repeated-cursor guard are preserved', () => {
  const full = profileCalloutsPage({ callouts: Array(30).fill({}), nextPageToken: 'next' }, { userId: 'subject' });
  const short = profileCalloutsPage({ callouts: Array(29).fill({}), nextPageToken: 'next' }, { userId: 'subject' });
  assert.equal(full.next, 'next');
  assert.equal(short.next, undefined);
  assert.equal(nextProfileCalloutsPage(full, [], 'previous'), 'next');
  assert.equal(nextProfileCalloutsPage(full, [], 'next'), undefined);
  assert.equal(nextProfileCalloutsPage({ next: '' }, [], undefined), undefined);
  assert.match(artifact.discrepancy.declaration, /rather than array length/);
});

test('server-page selector preserves first occurrence and served order without sorting', () => {
  const first = { calloutId: 'z', value: 1 };
  const second = { calloutId: 'a', value: 2 };
  const third = { calloutId: 'm', value: 3 };
  const data = { pages: [{ callouts: [first, second] }, { callouts: [{ calloutId: 'z', value: 9 }, third] }] };
  const rows = flattenProfileCallouts(data);
  assert.deepEqual(rows, [first, second, third]);
  assert.equal(rows[0], first);
  assert.equal(data.pages[1].callouts[0].value, 9);
});

test('complete declared response requires cursor and preserves nested DTO rules', () => {
  const doc = artifact.declarations;
  const response = doc['x-profile-response'];
  assert.equal(validateDeclared(doc, response, { callouts: [], nextPageToken: '' }).success, true);
  assert.equal(validateDeclared(doc, response, { callouts: [] }).success, false);
  assert.equal(validateDeclared(doc, response, { callouts: [], nextPageToken: null }).success, false);
  assert.ok(doc.$defs['421504.tailPnlHistogram']);
});

test('artifact is deterministic and every fragment is bound to raw captured bytes', async () => {
  assert.equal(await fs.readFile(path.join(root, 'contracts/original-profile-callouts.json'), 'utf8'), `${JSON.stringify(artifact, null, 2)}\n`);
  assert.equal(artifact.consumers.length, 2);
  for (const fragment of artifact.fragments) {
    const capture = await corpus.capture(fragment.source);
    assert.equal(sha256(capture.bytes.subarray(...fragment.utf8)), fragment.sha256);
    if ('text' in fragment) assert.equal(capture.text.slice(...fragment.utf16), fragment.text);
  }
  assert.equal(sha256(await fs.readFile(path.join(root, artifact.implementation.path))), artifact.implementation.sha256);
});

test('changed actual planner capture is rejected before source extraction', async (t) => {
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'original-profile-plan-'));
  t.after(() => fs.rm(temporary, { recursive: true, force: true }));
  const selected = artifact.factories.find((factory) => factory.id === 399346).source;
  for (const relative of ['evidence/web/manifest.json', 'recovered/modules.json', selected]) {
    const target = path.join(temporary, relative);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(path.join(root, relative), target);
  }
  const target = path.join(temporary, selected);
  const bytes = await fs.readFile(target); bytes[7500] ^= 1; await fs.writeFile(target, bytes);
  await assert.rejects(extractProfileCallouts(temporary), /capture authentication failed/);
});
