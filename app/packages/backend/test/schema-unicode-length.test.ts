import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAgainstSchema } from '../src/schema-validator.js';

test('maxLength counts a supplementary Unicode character once', () => {
 assert.deepEqual(validateAgainstSchema('\u{1f680}',{type:'string',maxLength:1}),[]);
 assert.deepEqual(validateAgainstSchema('\u{1f680}a',{type:'string',maxLength:2}),[]);
});

test('minLength does not count surrogate halves as separate characters', () => {
 assert.notEqual(validateAgainstSchema('\u{1f680}',{type:'string',minLength:2}).length,0);
});

test('length counts code points without collapsing combining sequences', () => {
 assert.deepEqual(validateAgainstSchema('e\u0301',{type:'string',minLength:2,maxLength:2}),[]);
 assert.notEqual(validateAgainstSchema('e\u0301',{type:'string',maxLength:1}).length,0);
 assert.deepEqual(validateAgainstSchema('abc',{type:'string',minLength:3,maxLength:3}),[]);
});
