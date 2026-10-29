import test from 'node:test';
import assert from 'node:assert/strict';
import { validateImage, validateDraft, ACCEPTED_IMAGE_TYPES, CREATE_LIMITS } from '../packages/frontend/src/app/create-coin-validation.ts';
for (const type of ACCEPTED_IMAGE_TYPES) test(`empty ${type} is rejected`,()=>{
  const image=new File([], 'empty', {type});
  assert.ok(validateImage(image));
  assert.ok(validateDraft({name:'Example',ticker:'EX',description:'',website:'',twitter:'',telegram:''},image).image);
});
test('non-empty size boundaries and MIME restrictions remain intact',()=>{
  assert.equal(validateImage(new File(['x'],'image',{type:'image/png'})),undefined);
  assert.equal(validateImage(new File([new Uint8Array(CREATE_LIMITS.imageBytes)],'image',{type:'image/png'})),undefined);
  assert.ok(validateImage(new File([new Uint8Array(CREATE_LIMITS.imageBytes+1)],'image',{type:'image/png'})));
  assert.ok(validateImage(new File(['x'],'image',{type:'text/plain'})));
});
