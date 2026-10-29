import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../src/app.js';

test('205 Reset Content fixtures send zero content instead of a JSON null literal', async () => {
  const app = buildApp([{method:'GET', path:'/synthetic-reset', status:205, body:null, source:'synthetic-test'}]);
  try {
    const response = await app.inject('/synthetic-reset');
    assert.equal(response.statusCode, 205);
    assert.equal(response.payload, '');
  } finally { await app.close(); }
});

test('205 fixtures reject a content body during admission', () => {
  assert.throws(() => buildApp([{method:'GET', path:'/synthetic-reset', status:205, body:{value:1}, source:'synthetic-test'}]), /205.*cannot carry a body/);
});
