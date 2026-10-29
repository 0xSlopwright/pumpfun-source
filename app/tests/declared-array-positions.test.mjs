import test from 'node:test';
import assert from 'node:assert/strict';
import {validateDeclared} from '../scripts/original-contracts/validate.mjs';
test('every array position is validated against its declared element rule',()=>{
  const rule={type:'array',items:{type:'string'}};
  const sparse=['first','second'];delete sparse[1];
  assert.equal(validateDeclared({},rule,sparse).success,false);
  assert.equal(validateDeclared({},rule,['first',undefined]).success,false);
  assert.equal(validateDeclared({},rule,['first','second']).success,true);
  assert.equal(validateDeclared({},{...rule,items:{type:'string','x-zod-optional':true}},sparse).success,true);
});
