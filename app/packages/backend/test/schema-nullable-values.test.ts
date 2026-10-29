import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAgainstSchema } from '../src/schema-validator.js';

test('nullable does not bypass an enum that excludes null', () => {
 assert.notEqual(validateAgainstSchema(null,{type:'string',nullable:true,enum:['allowed']}).length,0);
 assert.deepEqual(validateAgainstSchema(null,{type:'string',nullable:true,enum:['allowed',null]}),[]);
});

test('nullable does not bypass a non-null const', () => {
 assert.notEqual(validateAgainstSchema(null,{type:'string',nullable:true,const:'allowed'}).length,0);
 assert.deepEqual(validateAgainstSchema(null,{nullable:true,const:null}),[]);
});

test('unrestricted nullable values and nullable wrappers remain supported', () => {
 assert.deepEqual(validateAgainstSchema(null,{type:'string',nullable:true}),[]);
 assert.deepEqual(validateAgainstSchema(null,{nullable:true,allOf:[{type:'object',required:['id']}]}),[]);
});
