import test from 'node:test';
import assert from 'node:assert/strict';
import {copyJson,readPreferenceSnapshot} from '../packages/frontend/src/lib/notification-state.ts';
test('array holes cannot bypass defensive JSON validation',()=>{
  assert.throws(()=>copyJson(new Array(1)),/JSON data/);
  const sparse=[1,2];delete sparse[1];assert.throws(()=>copyJson(sparse),/JSON data/);
  assert.throws(()=>readPreferenceSnapshot({chat:{future:[,]},social:{},coins:{}}),/JSON data/);
});
test('dense JSON arrays retain nulls, immutable copies and shared acyclic values',()=>{
  const shared={x:1};const input=[null,0,false,'',shared,shared];const copied=copyJson(input);
  assert.deepEqual(copied,input);assert.ok(Object.isFrozen(copied));
  assert.ok(Object.isFrozen(copied[4]));assert.notEqual(copied,input);
});
