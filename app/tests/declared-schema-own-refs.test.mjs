import test from 'node:test';
import assert from 'node:assert/strict';
import {validateDeclared} from '../scripts/original-contracts/validate.mjs';
test('declaration refs never resolve through inherited definition properties',()=>{
  for(const name of ['constructor','toString','__proto__']) assert.throws(()=>validateDeclared({$defs:{}},{$ref:'#/$defs/'+name},'anything'),/unresolved schema/);
  const document={$defs:{own:{type:'integer'}}};
  assert.equal(validateDeclared(document,{$ref:'#/$defs/own'},1).success,true);
  assert.equal(validateDeclared(document,{$ref:'#/$defs/own'},'wrong').success,false);
});
