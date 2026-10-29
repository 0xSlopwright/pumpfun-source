import test from 'node:test';
import assert from 'node:assert/strict';
import {buildApp} from './with-api-key.js';
test('post batches reject malformed IDs while preserving valid unknown UUIDs',async()=>{
  const app=buildApp();
  try {
    for (const id of ['not-a-uuid','00000000-0000-9000-8000-000000000001','00000000-0000-4000-7000-000000000001']) assert.equal((await app.inject(`/v1/posts?ids=${id}`)).statusCode,400);
    for (const id of ['00000000-0000-0000-0000-000000000000','ffffffff-ffff-ffff-ffff-ffffffffffff','12345678-1234-8234-ABCD-1234567890AB']) assert.equal((await app.inject(`/v1/posts?ids=${id}`)).statusCode,200);
    const valid='00000000-0000-4000-8000-000000000001';
    assert.equal((await app.inject(`/v1/posts?ids=${valid},malformed`)).statusCode,400);
    const response=await app.inject(`/v1/posts?ids=${valid},${valid}`);
    assert.equal(response.statusCode,200);assert.equal(response.json().posts.length,1);
  } finally {await app.close();}
});
