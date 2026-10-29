import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createOriginalUiSessionReader, originalAuthSourceContexts } from '../packages/frontend/src/original-contracts/auth/index.ts';
import { recover, assertAdapted } from '../scripts/original-contracts/auth/recover.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const claims = (address = 'synthetic-wallet', extra = {}) => ({ address, exp: 123, iat: 3, ...extra });
// Deliberately NOT a signature: this reader decodes UI claims, not authorization.
const token = (payload) => `synthetic.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.unverified`;
function events() {
  const handlers = new Map();
  let adds = 0, removes = 0;
  return {
    addEventListener(type, callback) {
      adds++;
      if (!handlers.has(type)) handlers.set(type, new Set());
      handlers.get(type).add(callback);
    },
    removeEventListener(type, callback) { removes++; handlers.get(type)?.delete(callback); },
    fire(type) { for (const callback of handlers.get(type) ?? []) callback(); },
    count(type) { return handlers.get(type)?.size ?? 0; },
    get adds() { return adds; }, get removes() { return removes; },
  };
}
function browserFixture() {
  const window = events(), document = events();
  const writes = [], reads = [];
  let cookie = '', stored = null, failStorage = false, failCookie = false, decodes = 0;
  Object.defineProperty(document, 'cookie', {
    get() { reads.push('cookie'); if (failCookie) throw new Error('synthetic cookie denial'); return cookie; },
    set(value) { writes.push(value); },
  });
  const browser = { window, document, location: { hostname: 'ui.example.invalid' },
    Date: { now: () => 9999999999999 },
    localStorage: { getItem(key) { reads.push(key); if (failStorage) throw new Error('synthetic storage denial'); return stored; } },
    atob(value) { decodes++; return atob(value); },
  };
  return { browser, window, document, writes, reads,
    set cookie(value) { cookie = value; }, set stored(value) { stored = value; },
    set failStorage(value) { failStorage = value; }, set failCookie(value) { failCookie = value; },
    get decodes() { return decodes; } };
}
function readerFor(source, fixture) {
  return createOriginalUiSessionReader(source, fixture.browser, {
    useSyncExternalStore(subscribe, snapshot, serverSnapshot) {
      assert.equal(typeof subscribe, 'function');
      assert.equal(serverSnapshot(), null);
      return snapshot();
    },
  });
}

test('all six source-adapted variants and consumer witnesses authenticate against original raw AST', async () => {
  const receipt = await recover();
  assert.equal(receipt.contexts.length, 3);
  assert.equal(receipt.contexts.flatMap((entry) => entry.variants).length, 6);
  assert.ok(receipt.consumer.witnesses.some((entry) => entry.label === 'AuthProviders export'));
  for (const context of receipt.contexts) {
    assert.ok(originalAuthSourceContexts.includes(context.source));
    for (const variant of context.variants) assert.ok(variant.origins.length > 0);
  }
});

test('AST verification rejects changed expiry, cookie names, fallback ordering, decode and added code', async () => {
  const reader = await readFile(path.join(root, 'packages/frontend/src/original-contracts/auth/kernels/reader-b7990dc05987.mjs'), 'utf8');
  const decoder = await readFile(path.join(root, 'packages/frontend/src/original-contracts/auth/kernels/decoder-d48cce6d6408.mjs'), 'utf8');
  for (const changed of [reader.replace('return !1;', 'return !0;'), reader.replace('"auth_token"', '"other"'),
    reader.replace('i ?? d', 'd ?? i'), `${reader}\nthrow new Error('injected');`]) {
    assert.notEqual(changed, reader);
    assert.throws(() => assertAdapted(changed, reader, 'negative control'), /AST differs/);
  }
  const changed = decoder.replace('3 !==', '2 !==');
  assert.notEqual(changed, decoder);
  assert.throws(() => assertAdapted(changed, decoder, 'decode negative'), /AST differs/);
});

test('source context is explicit; unknown, omitted and inherited-object keys cannot select a variant', () => {
  const f = browserFixture();
  for (const source of [undefined, '', '350741', 'toString', '__proto__', 'unknown-capture']) {
    assert.throws(() => readerFor(source, f), /Explicit supported/);
  }
});

for (const source of originalAuthSourceContexts) {
  test(`${source}: claim normalization preserves the original permissive UI schema`, () => {
    const reader = readerFor(source, browserFixture());
    for (const invalid of [null, false, '', 1, {}, { address: 1, exp: 1 }, { address: 'x', exp: '1' },
      { address: 'x', exp: Infinity }, { address: 'x', exp: NaN }]) {
      assert.equal(reader.normalizeUnverifiedClaims(invalid), null);
    }
    assert.deepEqual(reader.normalizeUnverifiedClaims({ address: '', exp: -1, roles: [4, null], permissions: ['read'], userId: 'id' }),
      { address: '', exp: -1, iat: 0, roles: [4, null], permissions: ['read'], userId: 'id' });
    assert.deepEqual(reader.normalizeUnverifiedClaims({ address: 'x', exp: 0, roles: 'admin', permissions: ['ok', 2], userId: '', iat: Infinity }),
      { address: 'x', exp: 0, iat: 0, roles: [] });
    assert.equal(reader.capturedExpiryPredicate(claims()), false);
    assert.equal(reader.capturedExpiryPredicate(null, -1), false);
  });

  test(`${source}: token decoding is unverified, base64url-aware and rejects malformed input`, () => {
    const reader = readerFor(source, browserFixture());
    const payload = claims('ascii-wallet');
    assert.deepEqual(reader.decodeUnverifiedToken(token(payload)), { ...payload, roles: [] });
    for (const invalid of [null, undefined, '', 12, {}, 'a.b', 'a..c', 'a.b.c.d', 'a.%%%.c',
      `a.${Buffer.from('not-json').toString('base64url')}.c`, token({ address: 'x' })]) {
      assert.equal(reader.decodeUnverifiedToken(invalid), null);
    }
    // Original atob produces a binary string, with no extra UTF-8 decoding step.
    const unicode = reader.decodeUnverifiedToken(token(claims('é')));
    assert.equal(unicode.address, 'Ã©');
    const f = browserFixture();
    let base64Argument;
    f.browser.atob = (value) => { base64Argument = value; return JSON.stringify(claims('conversion')); };
    assert.equal(readerFor(source, f).decodeUnverifiedToken('header.__--.signature').address, 'conversion');
    assert.equal(base64Argument, '//++');
  });

  test(`${source}: cookie precedence, fallback and snapshot identity follow changed raw inputs only`, () => {
    const f = browserFixture(), reader = readerFor(source, f);
    f.stored = JSON.stringify(claims('storage'));
    assert.equal(reader.getUnverifiedSnapshot().address, 'storage');
    const stored = reader.getUnverifiedSnapshot();
    assert.equal(reader.getUnverifiedSnapshot(), stored);
    f.cookie = `irrelevant=1; auth_token=${token(claims('cookie'))}; trailing=2`;
    const cookie = reader.getUnverifiedSnapshot();
    assert.equal(cookie.address, 'cookie');
    assert.equal(reader.getUnverifiedSnapshot(), cookie);
    assert.equal(reader.useUnverifiedSnapshot(), cookie);
    assert.equal(f.decodes, 1);
    f.stored = JSON.stringify(claims('new-storage'));
    assert.equal(reader.getUnverifiedSnapshot().address, 'cookie');
    assert.notEqual(reader.getUnverifiedSnapshot(), cookie); // both inputs participate in invalidation
    assert.equal(f.decodes, 2);
    f.cookie = 'auth_token=broken';
    assert.equal(reader.getUnverifiedSnapshot().address, 'new-storage');
    f.cookie = 'auth_token=; auth_token=ignored';
    assert.equal(reader.getUnverifiedSnapshot().address, 'new-storage');
    f.stored = 'invalid-json';
    assert.equal(reader.getUnverifiedSnapshot(), null);
    assert.equal(reader.getUnverifiedSnapshot(), null);
  });

  test(`${source}: past exp remains visible and cookie values preserve equals signs`, () => {
    const f = browserFixture(), reader = readerFor(source, f);
    f.cookie = `auth_token=${token(claims('past', { exp: -1 }))}`;
    assert.equal(reader.getUnverifiedSnapshot().exp, -1);
    const encoded = Buffer.from(JSON.stringify(claims('padded'))).toString('base64');
    f.cookie = `auth_token=a.${encoded}.c`;
    assert.equal(reader.getUnverifiedSnapshot().address, 'padded');
  });

  test(`${source}: SSR, denied storage and cookie exceptions retain captured boundaries`, () => {
    const f = browserFixture(), reader = readerFor(source, f);
    f.failCookie = true;
    assert.equal(reader.getServerSnapshot(), null);
    assert.deepEqual(f.reads, []);
    assert.throws(() => reader.getUnverifiedSnapshot(), /synthetic cookie denial/);
    f.failCookie = false; f.failStorage = true;
    f.cookie = `auth_token=${token(claims())}`;
    assert.equal(reader.getUnverifiedSnapshot().address, 'synthetic-wallet');
    const noBrowser = createOriginalUiSessionReader(source, { Date: { now: () => 0 }, atob },
      { useSyncExternalStore: (_subscribe, _getSnapshot, getServerSnapshot) => getServerSnapshot() });
    assert.equal(noBrowser.getUnverifiedSnapshot(), null);
    assert.equal(noBrowser.useUnverifiedSnapshot(), null);
    assert.doesNotThrow(() => noBrowser.clearAuthCookie());
  });

  test(`${source}: focus/storage/visibility listeners share one lifecycle and notify without scheduling`, () => {
    const f = browserFixture(), reader = readerFor(source, f);
    let first = 0, second = 0;
    const unsubscribe1 = reader.subscribe(() => first++);
    const unsubscribe2 = reader.subscribe(() => second++);
    assert.equal(f.window.adds, 2); assert.equal(f.document.adds, 1);
    for (const type of ['focus', 'storage']) f.window.fire(type);
    f.document.fire('visibilitychange'); reader.notify();
    assert.deepEqual([first, second], [4, 4]);
    unsubscribe1();
    f.window.fire('focus');
    assert.deepEqual([first, second], [4, 5]);
    assert.equal(f.window.removes, 0);
    unsubscribe2();
    assert.equal(f.window.count('focus'), 0); assert.equal(f.window.count('storage'), 0);
    assert.equal(f.document.count('visibilitychange'), 0);
    assert.equal(f.window.removes, 2); assert.equal(f.document.removes, 1);
    f.window.fire('focus'); reader.notify();
    assert.deepEqual([first, second], [4, 5]);
    const unsubscribe3 = reader.subscribe(() => first++);
    assert.equal(f.window.adds, 4);
    unsubscribe3();
  });

  test(`${source}: clear-cookie writes captured host/parent-domain variants and not storage`, () => {
    const f = browserFixture(), reader = readerFor(source, f);
    let notices = 0;
    const unsubscribe = reader.subscribe(() => notices++);
    reader.clearAuthCookie();
    const base = 'auth_token=; Max-Age=0; Path=/; SameSite=Lax';
    assert.deepEqual(f.writes, [base, `${base}; Domain=ui.example.invalid`, `${base}; Domain=.ui.example.invalid`,
      `${base}; Domain=example.invalid`, `${base}; Domain=.example.invalid`]);
    assert.equal(notices, 1); assert.deepEqual(f.reads, []);
    unsubscribe();
    f.browser.location.hostname = 'localhost'; f.writes.length = 0;
    reader.clearAuthCookie();
    assert.deepEqual(f.writes, [base]);
  });
}
