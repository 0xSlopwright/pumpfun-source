import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildApp, type Fixture } from '../src/app.js';

const fixture = (path: string, body: unknown, headers?: Record<string, string>): Fixture => ({
  method: 'GET', path, status: 200, body, headers, source: 'synthetic:json-scalar-default',
});

test('JSON scalar fixtures have JSON representations when Content-Type is omitted', async () => {
  const values = ['a "quoted" string', null, true, 42];
  const app = buildApp(values.map((body, i) => fixture(`/scalar-${i}`, body)));
  try {
    for (const [i, body] of values.entries()) {
      const response = await app.inject(`/scalar-${i}`);
      assert.equal(response.statusCode, 200);
      assert.match(response.headers['content-type'] ?? '', /^application\/json/);
      assert.equal(response.body, JSON.stringify(body));
      assert.deepEqual(response.json(), body);
    }
  } finally { await app.close(); }
});

test('explicit text content types retain plain string replay', async () => {
  const app = buildApp([fixture('/plain-text', 'recorded text', { 'Content-Type': 'text/plain' })]);
  try {
    const response = await app.inject('/plain-text');
    assert.match(response.headers['content-type'] ?? '', /^text\/plain/);
    assert.equal(response.body, 'recorded text');
  } finally { await app.close(); }
});
