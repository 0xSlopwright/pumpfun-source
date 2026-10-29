import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp, type Fixture } from '../src/app.js';
const fixture:Fixture={method:'GET',path:'/synthetic-dense',status:200,body:{ok:true},source:'synthetic-test'};
test('fixture registration rejects missing positions instead of silently lowering the fixture count',()=>{
 for(const entries of [new Array<Fixture>(1),[fixture,,{...fixture,path:'/synthetic-other'}],[fixture,undefined] as unknown as Fixture[]]){
  assert.throws(()=>buildApp(entries),/Invalid fixture registration/);
 }
});
test('dense fixture registration still exposes exactly its registered replay',async()=>{
 const app=buildApp([fixture]);
 try{const response=await app.inject('/synthetic-dense');assert.equal(response.statusCode,200);assert.deepEqual(response.json(),{ok:true});}
 finally{await app.close();}
});
