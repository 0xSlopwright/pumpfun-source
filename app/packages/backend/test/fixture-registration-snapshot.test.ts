import assert from 'node:assert/strict';
import test from 'node:test';
import { buildApp, type Fixture } from '../src/app.js';
test('registered replay body, status and headers cannot drift with caller mutations', async () => {
  const body = { values: [{ label: 'original' }] };
  const fixture: Fixture = { method: 'GET', path: '/synthetic-snapshot', query: { page: '1' }, status: 200, headers: { 'x-synthetic': 'original' }, body, source: 'synthetic-test' };
  const app = buildApp([fixture]);
  try {
    body.values[0].label = 'changed';
    fixture.status = 202;
    fixture.headers!['x-synthetic'] = 'changed';
    fixture.query!.page = '2';
    const result = await app.inject('/synthetic-snapshot?page=1');
    assert.equal(result.statusCode, 200);
    assert.equal(result.headers['x-synthetic'], 'original');
    assert.deepEqual(result.json(), { values: [{ label: 'original' }] });
  } finally { await app.close(); }
});

test('raw Buffer fixtures remain byte responses and are detached from the caller', async () => {
  const body = Buffer.from([0, 1, 255]);
  const app = buildApp([{ method: 'GET', path: '/synthetic-bytes', status: 200, headers: { 'content-type': 'application/octet-stream' }, body, source: 'synthetic-test' }]);
  try {
    body.fill(42);
    const result = await app.inject('/synthetic-bytes');
    assert.deepEqual(result.rawPayload, Buffer.from([0, 1, 255]));
    assert.equal(result.headers['content-type'], 'application/octet-stream');
  } finally { await app.close(); }
});
