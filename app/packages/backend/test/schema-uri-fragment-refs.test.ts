import test from 'node:test';
import assert from 'node:assert/strict';
import {validateAgainstSchema} from '../src/schema-validator.js';
test('local URI-fragment refs decode percent escapes before JSON Pointer tokens',()=>{
  const root={components:{schemas:{'spaced name':{type:'string'},'a/b':{type:'integer'},'~1':{type:'boolean'}}}};
  for(const [ref,value] of [['#/components/schemas/spaced%20name','valid'],['#%2Fcomponents%2Fschemas%2Fspaced%20name','valid'],['#/components/schemas/a%7E1b',3],['#/components/schemas/~01',true]] as const) assert.deepEqual(validateAgainstSchema(value,{$ref:ref},'$',root),[]);
  assert.ok(validateAgainstSchema(3,{$ref:'#/components/schemas/spaced%20name'},'$',root).length);
  for(const ref of ['#/components/schemas/%GG','#/components/schemas/bad~2']) assert.ok(validateAgainstSchema('x',{$ref:ref},'$',root).length);
});
