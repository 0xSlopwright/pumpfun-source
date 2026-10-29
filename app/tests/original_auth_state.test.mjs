import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createOriginalAuthStatePredicates, originalAuthStateSource } from '../packages/frontend/src/original-contracts/auth-state/index.ts';
import { recover, assertOriginalAdaptation } from '../scripts/original-contracts/auth-state/recover.mjs';

function fixture() {
  let now = 2000, reads = 0;
  const normalized = { source: 'synthetic unverified claims' };
  const inputs = [];
  const decoder = { S(value) { assert.equal(this, undefined); inputs.push(value); return normalized; } };
  const clock = { now() { reads++; return now; } };
  return { predicates: createOriginalAuthStatePredicates(originalAuthStateSource, decoder, clock),
    get reads() { return reads; }, set now(value) { now = value; }, normalized, inputs };
}
const input = (extra = {}) => ({ decodedJwt: { address: 'wallet', exp: 3 },
  privyAuthenticated: false, publicKeyAddress: 'wallet', ...extra });
const changed = (extra = {}) => ({ ...input(), previousPublicKeyAddress: 'previous', ...extra });

test('original predicate factory and actual same-capture AuthProviders caller authenticate', async () => {
  const proof = await recover();
  assert.equal(proof.factory.id, 553301);
  assert.equal(proof.consumer.factory.id, 589428);
  assert.equal(proof.consumer.expression, '(0,tw.K)({decodedJwt:I,privyAuthenticated:!1,publicKeyAddress:C})');
  assert.deepEqual(proof.witnesses.map((node) => node.label), ['decoder import683023', 'export U', 'export K', 'export O']);
  assert.ok(proof.origins.length > 0);
});

test('AST verification rejects changed expiry boundary, clock, guards, wallet comparison and added code', async () => {
  const original = await readFile(new URL('../packages/frontend/src/original-contracts/auth-state/kernel.mjs', import.meta.url), 'utf8');
  for (const modified of [original.replace('<=', '<'), original.replace('Date.now()', '0'),
    original.replace('!t &&', 't &&'), original.replace('e.address !== n', 'e.address === n'),
    original + '\nthrow new Error("extra");\n']) {
    assert.notEqual(modified, original);
    assert.throws(() => assertOriginalAdaptation(modified, original), /original AST/);
  }
});

test('explicit source context rejects missing, unrelated and inherited-key names', () => {
  for (const source of [undefined, '', '553301', 'toString', 'other-capture', 'evidence/web/objects/2e9c0799b2d037f0.js']) {
    assert.throws(() => createOriginalAuthStatePredicates(source, { S: (value) => value }, { now: () => 0 }), /Explicit supported/);
  }
});

test('normalization delegates unchanged value to injected decoder without a receiver or cloned result', () => {
  const f = fixture();
  const raw = { address: 'synthetic', exp: 4 };
  assert.equal(f.predicates.normalizeUnverifiedClaims(raw), f.normalized);
  assert.equal(f.inputs[0], raw);
  assert.equal(f.reads, 0);
  const failure = new Error('synthetic decoder failure');
  const p = createOriginalAuthStatePredicates(originalAuthStateSource, { S() { throw failure; } }, { now: () => 0 });
  assert.throws(() => p.normalizeUnverifiedClaims(null), (error) => error === failure);
});

test('K respects Privy state and absent wallet while retaining default clock evaluation', () => {
  const f = fixture();
  assert.equal(f.predicates.needsWalletReauthentication(input()), false);
  assert.equal(f.reads, 1);
  assert.equal(f.predicates.needsWalletReauthentication(input({ privyAuthenticated: true, decodedJwt: null })), false);
  assert.equal(f.reads, 2); // parameter default executes before the short-circuit guard
  for (const publicKeyAddress of [undefined, null, '']) {
    assert.equal(f.predicates.needsWalletReauthentication(input({ publicKeyAddress, decodedJwt: null })), false);
  }
  assert.equal(f.reads, 5);
});

test('K requires matching string address and finite numeric exp, without permissions or address validation', () => {
  const f = fixture();
  for (const decodedJwt of [null, undefined, {}, { address: 1, exp: 3 },
    { address: 'wallet' }, { address: 'wallet', exp: '3' }, { address: 'wallet', exp: NaN },
    { address: 'wallet', exp: Infinity }, { address: 'wallet', exp: -Infinity }, { address: 'other', exp: 3 }]) {
    assert.equal(f.predicates.needsWalletReauthentication(input({ decodedJwt })), true);
  }
  assert.equal(f.predicates.needsWalletReauthentication(input({ decodedJwt: { address: 'wallet', exp: 3, roles: ['admin'], permissions: [] } })), false);
  assert.equal(f.predicates.needsWalletReauthentication(input({ publicKeyAddress: 'not-base58', decodedJwt: { address: 'not-base58', exp: 3 } })), false);
});

test('K expiry uses seconds times1000, inclusive boundary, fractional values and original finite-overflow behavior', () => {
  const { predicates: p } = fixture();
  for (const [exp, nowMs, expected] of [[2, 1999, false], [2, 2000, true], [2, 2001, true],
    [2.5, 2499, false], [2.5, 2500, true], [0, 0, true], [-1, 0, true],
    [Number.MAX_VALUE, Number.MAX_VALUE, false], [2, NaN, false], [2, Infinity, true], [2, -Infinity, false]]) {
    assert.equal(p.needsWalletReauthentication(input({ decodedJwt: { address: 'wallet', exp }, nowMs })), expected,
      `exp=${exp}, nowMs=${nowMs}`);
  }
});

test('K explicit nowMs overrides injected clock, while undefined defaults and errors propagate', () => {
  const f = fixture();
  f.now = 4000;
  assert.equal(f.predicates.needsWalletReauthentication(input({ nowMs: 0 })), false);
  assert.equal(f.reads, 0);
  assert.equal(f.predicates.needsWalletReauthentication(input({ nowMs: undefined })), true);
  assert.equal(f.reads, 1);
  const failure = new Error('synthetic clock failure');
  const p = createOriginalAuthStatePredicates(originalAuthStateSource, { S: (value) => value }, { now() { throw failure; } });
  assert.throws(() => p.needsWalletReauthentication(input({ privyAuthenticated: true })), (error) => error === failure);
  assert.equal(p.needsWalletReauthentication(input({ nowMs: 0 })), false);
});

test('O flags an actual change away from claim address, independent of expiry and clock', () => {
  const f = fixture();
  assert.equal(f.predicates.walletChangedAwayFromClaims(changed()), false); // current matches claims
  assert.equal(f.predicates.walletChangedAwayFromClaims(changed({ publicKeyAddress: 'new' })), true);
  assert.equal(f.predicates.walletChangedAwayFromClaims(changed({ publicKeyAddress: 'new', decodedJwt: { address: 'wallet', exp: -Infinity } })), true);
  assert.equal(f.predicates.walletChangedAwayFromClaims(changed({ publicKeyAddress: 'new', decodedJwt: { address: 'wallet' } })), true);
  assert.equal(f.predicates.walletChangedAwayFromClaims(changed({ publicKeyAddress: 'new', previousPublicKeyAddress: undefined })), true);
  assert.equal(f.reads, 0);
});

test('O suppresses Privy, missing claims/current wallet, nonstring address and unchanged wallet', () => {
  const { predicates: p } = fixture();
  for (const extra of [{ privyAuthenticated: true }, { decodedJwt: null }, { decodedJwt: undefined },
    { decodedJwt: { address: 123 } }, { publicKeyAddress: '' }, { publicKeyAddress: null },
    { publicKeyAddress: undefined }, { publicKeyAddress: 'previous' }]) {
    assert.equal(p.walletChangedAwayFromClaims(changed({ publicKeyAddress: 'new', ...extra })), false);
  }
});
