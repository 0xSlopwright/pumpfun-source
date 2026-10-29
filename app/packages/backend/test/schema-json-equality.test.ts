import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAgainstSchema } from '../src/schema-validator.js';

test('const compares JSON objects structurally, independent of key order', () => {
 assert.deepEqual(validateAgainstSchema({b:[2,{ok:true}],a:1},{const:{a:1,b:[2,{ok:true}]}}),[]);
 assert.notEqual(validateAgainstSchema({a:2},{const:{a:1}}).length,0);
});

test('enum accepts an equal independently parsed JSON value', () => {
 const expected={tags:['a','b'],nested:{value:null}};
 assert.deepEqual(validateAgainstSchema(JSON.parse(JSON.stringify(expected)),{enum:[expected]}),[]);
 assert.notEqual(validateAgainstSchema({tags:['b','a'],nested:{value:null}},{enum:[expected]}).length,0);
});

test('JSON equality retains own-key, type, and numeric semantics', () => {
 assert.notEqual(validateAgainstSchema({a:1,b:2},{const:{a:1}}).length,0);
 assert.notEqual(validateAgainstSchema(['1'],{enum:[[1]]}).length,0);
 assert.deepEqual(validateAgainstSchema({value:-0},{const:{value:0}}),[]);
 assert.deepEqual(validateAgainstSchema(null,{enum:[null]}),[]);
});
