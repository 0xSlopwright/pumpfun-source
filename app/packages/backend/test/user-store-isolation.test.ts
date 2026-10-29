import test from 'node:test';
import assert from 'node:assert/strict';
import {UserStore} from '../src/users-store.js';
test('seed changes cannot corrupt user indexes after construction',()=>{
  const seed=new UserStore().list({});const original=structuredClone(seed[0]);
  const store=new UserStore(seed);seed[0].address='changed';seed[0].username='changed';
  assert.deepEqual(store.getById(original.address),original);
});
test('all public read projections leave stored rows and nested badges unchanged',()=>{
  const seed=new UserStore().list({});seed[0].group_badges=[{group_id:'g',username:'group',profile_image_url:null,role:'member'}];
  const store=new UserStore(seed);const original=structuredClone(seed[0]);
  for (const row of [store.getById(original.address)!,store.list({})[0],store.search({includeLabelledWallets:true})[0],store.batch([original.address])[0],store.getOverview(original.address)!.profile]) {
    row.username='changed';row.group_badges![0].role='changed';
    assert.deepEqual(store.getById(original.address),original);
  }
});
