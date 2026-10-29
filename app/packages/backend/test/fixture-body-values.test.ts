import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../src/app.js';

test('fixture admission rejects bodies that cannot be faithfully replayed as JSON', () => {
  const cyclic: unknown[] = []; cyclic.push(cyclic);
  for (const body of [1n, { value: Infinity }, JSON.parse('{"value":1e400}'), { value: undefined }, [undefined], new Array(1), cyclic, new Map([['a', 1]])]) {
    assert.throws(() => buildApp([{ method: 'GET', path: '/synthetic-body-values', status: 200, body, source: 'synthetic-test' }]), /body.*JSON/i);
  }
});

test('finite JSON bodies and explicit byte buffers remain replayable', async () => {
  for (const body of [{ value: [null, false, 0, 'text'] }, Buffer.from([0, 255])]) {
    const app = buildApp([{ method: 'GET', path: '/synthetic-body-values', status: 200, body, source: 'synthetic-test' }]);
    try {
      const result = await app.inject('/synthetic-body-values');
      assert.equal(result.statusCode, 200);
      if (Buffer.isBuffer(body)) assert.deepEqual(result.rawPayload, body);
      else assert.deepEqual(result.json(), body);
    } finally { await app.close(); }
  }
});
