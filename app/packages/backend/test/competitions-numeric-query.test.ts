import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from './with-api-key.js';

const competition='/v1/competitions/11111111-1111-4000-8000-000000000002';
for (const [path,keys] of [
 [competition,['limit','positionsLimit']],
 [competition+'/highlights',['limit','perMemberLimit']],
 [competition+'/entries/22222222-2222-4000-8000-000000000001/highlights',['limit']],
] as const) {
 test(`competition numeric parameters reject empty/nonfinite input: ${path}`,async()=>{
  const app=buildApp();
  try {
   for (const key of keys) for (const value of ['', ' ', 'abc', 'NaN', 'Infinity']) {
    const response=await app.inject(path+'?'+new URLSearchParams({[key]:value}));
    assert.equal(response.statusCode,400,`${key}=${value}`);
    assert.equal(response.json().error,'INVALID_QUERY');
   }
  } finally { await app.close(); }
 });
}
test('finite values retain existing competition clamping',async()=>{
 const app=buildApp();
 try {
  const response=await app.inject(competition+'?limit=0&positionsLimit=99');
  assert.equal(response.statusCode,200);
  assert.deepEqual(response.json().leaderboard.entries,[]);
 } finally { await app.close(); }
});
