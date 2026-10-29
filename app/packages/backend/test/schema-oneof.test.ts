import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAgainstSchema } from '../src/schema-validator.js';

test('oneOf requires exactly one successful branch', () => {
 const schema={oneOf:[{type:'number'},{type:'integer'}]};
 assert.notEqual(validateAgainstSchema(3,schema).length,0);
 assert.deepEqual(validateAgainstSchema(3.5,schema),[]);
 assert.notEqual(validateAgainstSchema('three',schema).length,0);
});

test('a matching oneOf branch does not skip sibling constraints', () => {
 assert.notEqual(validateAgainstSchema('x',{oneOf:[{type:'string'},{type:'number'}],minLength:2}).length,0);
 assert.deepEqual(validateAgainstSchema('xy',{oneOf:[{type:'string'},{type:'number'}],minLength:2}),[]);
 assert.notEqual(validateAgainstSchema({extra:true},{oneOf:[{type:'object'}],additionalProperties:false}).length,0);
});

test('anyOf still accepts overlapping successful branches', () => {
 assert.deepEqual(validateAgainstSchema(3,{anyOf:[{type:'number'},{type:'integer'}]}),[]);
});
