import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createOriginalAuthRevalidation, originalAuthRevalidationSource } from '../packages/frontend/src/original-contracts/auth-revalidation/index.ts';
import { recover, assertOriginalAdaptation } from '../scripts/original-contracts/auth-revalidation/recover.mjs';

function fixture(client) {
  const events = [];
  let invalidated = false;
  const flow = createOriginalAuthRevalidation(originalAuthRevalidationSource, {
    getClient() { assert.equal(this, undefined); events.push('get-client'); return client; },
    clearAuthCookie() { assert.equal(this, undefined); events.push('clear-cookie'); },
    storage: { removeItem(key) { events.push(`remove:${key}`); } },
    setInvalidated(value) { events.push(`invalidated:${value}`); invalidated = value; },
  });
  return { flow, events, get invalidated() { return invalidated; } };
}
function responseClient(status, payload = { synthetic: true }) {
  return async (operation, options) => { options.hooks.afterResponse[0](null, null, { status }); return payload; };
}

test('original request and consumer callbacks/projections authenticate against raw captured AST', async () => {
  const evidence = await recover();
  assert.equal(evidence.request.factory.id, 174764);
  assert.equal(evidence.consumer.factory.id, 589428);
  assert.equal(evidence.consumer.witnesses.length, 8);
  assert.equal(evidence.outputs.length, 2);
  assert.ok(evidence.request.origins.length > 0);
});

test('AST proof rejects status policy, request headers, cleanup order and visible-state changes', async () => {
  const request = await readFile(new URL('../packages/frontend/src/original-contracts/auth-revalidation/request.mjs', import.meta.url), 'utf8');
  const consumer = await readFile(new URL('../packages/frontend/src/original-contracts/auth-revalidation/consumer.mjs', import.meta.url), 'utf8');
  for (const changed of [request.replace('401 ===', '403 ==='), request.replace('no-cache', 'max-age=1'),
    request.replace('"include"', '"omit"'), request + '\nthrow new Error("extra");']) {
    assert.notEqual(changed, request); assert.throws(() => assertOriginalAdaptation(changed, request), /original AST/);
  }
  for (const changed of [consumer.replace('"decoded-jwt"', '"other-key"'), consumer.replace('"rejected" !==', '"rejected" ==='),
    consumer.replace('_ ? null', '_ ? b')]) {
    assert.notEqual(changed, consumer); assert.throws(() => assertOriginalAdaptation(changed, consumer), /original AST/);
  }
});

test('source context is explicit and unrelated source/ID inputs are rejected', () => {
  for (const source of [undefined, '', '174764', 'toString', 'other-capture']) {
    assert.throws(() => createOriginalAuthRevalidation(source, {}), /Explicit supported/);
  }
});

test('request carries exact observed operation/options and response-hook status without parsing payload', async () => {
  const payload = { arbitrarySyntheticPayload: ['kept', 'unknown'] };
  const client = async function (operation, options) {
    assert.equal(this, undefined);
    assert.equal(operation, 'GET /auth/my-profile');
    assert.deepEqual(Object.keys(options), ['credentials', 'headers', 'throwHttpErrors', 'hooks']);
    assert.equal(options.credentials, 'include'); assert.equal(options.throwHttpErrors, false);
    assert.deepEqual(options.headers, { 'Cache-Control': 'no-cache' });
    assert.equal(options.hooks.afterResponse.length, 1);
    options.hooks.afterResponse[0]({}, {}, { status: 200 });
    return payload;
  };
  const f = fixture(client);
  const result = await f.flow.requestSession(client);
  assert.equal(result.verdict, 'ok'); assert.equal(result.status, 200);
  assert.equal(result.payload, payload); assert.equal(result.error, undefined);
  assert.deepEqual(f.events, []);
  // Also execute the injected factory/consumer path to exercise the complete request boundary.
  assert.equal(await f.flow.revalidateUiSession(), 'ok');
  assert.deepEqual(f.events, ['get-client']);
});

test('status triage preserves exact 2xx/304/401 boundaries and inconclusive remainder', async () => {
  const f = fixture(responseClient(200));
  for (const [status, verdict] of [[199, 'inconclusive'], [200, 'ok'], [204, 'ok'], [299, 'ok'],
    [300, 'inconclusive'], [304, 'ok'], [400, 'inconclusive'], [401, 'rejected'], [403, 'inconclusive'],
    [500, 'inconclusive'], [0, 'inconclusive'], [NaN, 'inconclusive'], ['200', 'ok'], ['401', 'inconclusive']]) {
    const outcome = await f.flow.requestSession(responseClient(status));
    assert.equal(outcome.verdict, verdict, String(status)); assert.equal(outcome.status, status);
  }
});

test('missing response hook gives inconclusive despite returned payload and repeated hook uses final response', async () => {
  const f = fixture(responseClient(200));
  const payload = { synthetic: 1 };
  const missing = await f.flow.requestSession(async () => payload);
  assert.deepEqual(missing, { verdict: 'inconclusive', status: null, payload, error: undefined });
  const last = await f.flow.requestSession(async (_operation, options) => {
    options.hooks.afterResponse[0](null, null, { status: 200 });
    options.hooks.afterResponse[0](null, null, { status: 401 });return payload;
  });
  assert.equal(last.verdict, 'rejected'); assert.equal(last.status, 401);
});

test('transport errors stay inconclusive without a response and preserve response status when already captured', async () => {
  const f = fixture(responseClient(200)), error = new Error('synthetic transport failure');
  const missing = await f.flow.requestSession(() => { throw error; });
  assert.deepEqual(missing, { verdict: 'inconclusive', status: null, payload: undefined, error });
  const rejected = await f.flow.requestSession(async (_operation, options) => {
    options.hooks.afterResponse[0](null, null, { status: 401 });throw error;
  });
  assert.deepEqual(rejected, { verdict: 'rejected', status: 401, payload: undefined, error });
  const hostileResponse = Object.defineProperty({}, 'status', { get() { throw error; } });
  await assert.rejects(f.flow.requestSession(async (_operation, options) => {
    options.hooks.afterResponse[0](null, null, hostileResponse);return null;
  }), (value) => value === error); // original status inspection is outside the request try/catch
});

test('only rejected verdict clears cookie/storage/visible UI state in original operation order', async () => {
  const f = fixture(responseClient(401));
  const claims = { address: 'synthetic', exp: 1 };
  assert.equal(f.flow.visibleUnverifiedClaims(f.invalidated, claims), claims);
  assert.equal(await f.flow.revalidateUiSession(), 'invalid');
  assert.deepEqual(f.events, ['get-client', 'clear-cookie', 'remove:decoded-jwt', 'remove:moderator-storage', 'invalidated:true']);
  assert.equal(f.invalidated, true);
  assert.equal(f.flow.visibleUnverifiedClaims(f.invalidated, claims), null);
  assert.equal(f.flow.capturedAuthReadyFlag(false, claims, f.invalidated), true);
});

test('ok, forbidden, server errors and transport-inconclusive verdicts retain UI claims and return ok', async () => {
  for (const client of [responseClient(200), responseClient(304), responseClient(403), responseClient(500),
    async () => { throw new Error('synthetic offline'); }, async () => ({ synthetic: 1 })]) {
    const f = fixture(client);
    assert.equal(await f.flow.revalidateUiSession(), 'ok');
    assert.deepEqual(f.events, ['get-client']);assert.equal(f.invalidated, false);
  }
});

test('storage denial is swallowed per removal, while cookie, setter and client-factory failures propagate', async () => {
  const events = [], error = new Error('synthetic port denial');
  const base = { getClient: () => responseClient(401), clearAuthCookie: () => events.push('cookie'),
    storage: { removeItem(key) { events.push(key); throw error; } }, setInvalidated: () => events.push('invalidated') };
  const flow = createOriginalAuthRevalidation(originalAuthRevalidationSource, base);
  assert.equal(await flow.revalidateUiSession(), 'invalid');
  assert.deepEqual(events, ['cookie', 'decoded-jwt', 'moderator-storage', 'invalidated']);
  events.length = 0;
  const noStorage = createOriginalAuthRevalidation(originalAuthRevalidationSource, { ...base, storage: undefined });
  assert.equal(await noStorage.revalidateUiSession(), 'invalid');assert.deepEqual(events, ['cookie', 'invalidated']);
  const cookieDenied = createOriginalAuthRevalidation(originalAuthRevalidationSource, { ...base, clearAuthCookie() { throw error; } });
  await assert.rejects(cookieDenied.revalidateUiSession(), (value) => value === error);
  const setterDenied = createOriginalAuthRevalidation(originalAuthRevalidationSource, { ...base, setInvalidated() { throw error; } });
  await assert.rejects(setterDenied.revalidateUiSession(), (value) => value === error);
  const factoryDenied = createOriginalAuthRevalidation(originalAuthRevalidationSource, { ...base, getClient() { throw error; } });
  await assert.rejects(factoryDenied.revalidateUiSession(), (value) => value === error);
});

test('UI projection preserves raw identity/nullish behavior and original authReady boolean expression', () => {
  const { flow } = fixture(responseClient(200));
  const object = { synthetic: true };
  assert.equal(flow.visibleUnverifiedClaims(false, object), object);
  assert.equal(flow.visibleUnverifiedClaims(false, undefined), null);
  assert.equal(flow.visibleUnverifiedClaims(false, null), null);
  assert.equal(flow.visibleUnverifiedClaims(true, object), null);
  assert.equal(flow.visibleUnverifiedClaims(false, 0), 0);
  for (const [ready, snapshot, invalidated, expected] of [[false, null, false, false], [true, null, false, true],
    [false, object, false, true], [false, null, true, true]]) {
    assert.equal(flow.capturedAuthReadyFlag(ready, snapshot, invalidated), expected);
  }
});
