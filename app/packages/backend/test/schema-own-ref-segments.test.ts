import test from 'node:test';
import assert from 'node:assert/strict';
import {validateAgainstSchema as validate} from '../src/schema-validator.js';
test('inherited pointer segments are unresolved rather than silently accepted',()=>{
  for (const ref of ['#/__proto__','#/components/__proto__']) {
    const issues=validate('anything',{$ref:ref},'$',{components:{}});
    assert.equal(issues.length,1);assert.match(issues[0].message,/unresolved/);
  }
  const root={components:Object.create({schemas:{Item:{type:'number'}}})};
  assert.match(validate('invalid',{$ref:'#/components/schemas/Item'},'$',root)[0].message,/unresolved/);
});
test('own prototype-named and escaped JSON keys still resolve normally',()=>{
  const root=JSON.parse('{"__proto__":{"type":"number"},"a/b":{"~key":{"type":"string"}}}');
  assert.equal(validate(1,{$ref:'#/__proto__'},'$',root).length,0);
  assert.equal(validate('ok',{$ref:'#/a~1b/~0key'},'$',root).length,0);
  assert.notEqual(validate(2,{$ref:'#/a~1b/~0key'},'$',root).length,0);
});
