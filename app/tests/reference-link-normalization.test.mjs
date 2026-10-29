import test from 'node:test';
import assert from 'node:assert/strict';
import {referenceLinkHref} from '../packages/frontend/src/app/docs/reference-data.ts';
test('reference local links cannot normalize into an unrelated origin',()=>{
  for(const path of ['/\\evil.example/fees','/\t/evil.example','/\n/evil.example','/\r/evil.example']) assert.throws(()=>referenceLinkHref(path),/reference link/i);
  assert.equal(referenceLinkHref('/docs/fees'),'/docs/fees');
  assert.equal(referenceLinkHref('/docs/unarchived'),'https://pump.fun/docs/unarchived');
});
