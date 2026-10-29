import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildApp, type Fixture } from '../src/app.js';

const fixture = (headers: Record<string, string>): Fixture => ({
  method: 'GET', path: '/recorded-headers', status: 200,
  body: { recorded: true }, source: 'synthetic:header-collision', headers,
});

test('case-insensitive header collisions fail before replay silently drops a value', () => {
  for (const headers of [
    { 'X-Recorded': 'first', 'x-recorded': 'second' },
    { 'Content-Type': 'application/json', 'content-type': 'text/plain' },
  ]) {
    assert.throws(() => buildApp([fixture(headers)]), /duplicate case-insensitive HTTP field names/);
  }
});

test('distinct header names retain their values regardless of case', async () => {
  const app = buildApp([fixture({ 'X-Recorded': 'first', 'x-recorded-id': 'second' })]);
  try {
    const response = await app.inject('/recorded-headers');
    assert.equal(response.statusCode, 200);
    assert.equal(response.headers['x-recorded'], 'first');
    assert.equal(response.headers['x-recorded-id'], 'second');
  } finally { await app.close(); }
});
