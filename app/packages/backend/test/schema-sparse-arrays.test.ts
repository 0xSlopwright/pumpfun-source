import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAgainstSchema } from '../src/schema-validator.js';

test('array item validation visits missing indices instead of silently accepting holes', () => {
  const sparse = new Array(2); sparse[1] = 'valid';
  const issues = validateAgainstSchema(sparse, { type: 'array', items: { type: 'string' } });
  assert.equal(issues.length, 1);
  assert.equal(issues[0].path, '$[0]');
  assert.deepEqual(validateAgainstSchema(['a', 'b'], { type: 'array', items: { type: 'string' } }), []);
});

test('sparse arrays cannot impersonate an enum or const array', () => {
  for (const schema of [{ enum: [['expected']] }, { const: ['expected'] }]) {
    assert.notDeepEqual(validateAgainstSchema(new Array(1), schema), []);
    assert.deepEqual(validateAgainstSchema(['expected'], schema), []);
  }
});
