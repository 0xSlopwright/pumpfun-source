import test from 'node:test';
import assert from 'node:assert/strict';
import {buildApp} from './with-api-key.js';
test('user batch enforces the declared body value types',async()=>{
  const app=buildApp();
  try {
    for (const addresses of [[1],[null],[{}],[true],['valid-string',false]]) {
      const res=await app.inject({method:'POST',url:'/v1/users/batch',payload:{addresses}});
      assert.equal(res.statusCode,400);
    }
    for (const forceFetch of ['true',0,null,{}]) assert.equal((await app.inject({method:'POST',url:'/v1/users/batch',payload:{addresses:[],forceFetch}})).statusCode,400);
    for (const forceFetch of [undefined,true,false]) assert.equal((await app.inject({method:'POST',url:'/v1/users/batch',payload:{addresses:[],forceFetch}})).statusCode,201);
  } finally {await app.close();}
});
