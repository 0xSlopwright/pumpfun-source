import test from 'node:test';
import assert from 'node:assert/strict';
import {buildApp} from './with-api-key.js';
import {UserStore} from '../src/users-store.js';
test('batch and hydrated search omit rename timestamps while single and labelled reads retain them', async () => {
  const users=new UserStore().list({});
  users[0].wallet_label='';users[0].last_username_update_timestamp=123;
  users[1].wallet_label='Synthetic label';users[1].last_username_update_timestamp=456;
  const app=buildApp([], {userStore:new UserStore(users)});
  try {
    const batch=await app.inject({method:'POST',url:'/v1/users/batch',payload:{addresses:[users[0].address,users[1].address]}});
    assert.equal(batch.statusCode,201);
    assert.equal(batch.json().length,2);
    assert.ok(batch.json().every((u:object)=>!Object.hasOwn(u,'last_username_update_timestamp')));
    const search=await app.inject({url:'/v1/users/search-v2?includeLabelledWallets=true'});
    assert.equal(search.statusCode,200);
    assert.equal(Object.hasOwn(search.json().find((u:any)=>u.address===users[0].address),'last_username_update_timestamp'),false);
    assert.equal(search.json().find((u:any)=>u.address===users[1].address).last_username_update_timestamp,456);
    const single=await app.inject({url:`/v1/users/${users[0].address}`});
    assert.equal(single.json().last_username_update_timestamp,123);
  } finally {await app.close();}
});
