import test from 'node:test';import assert from 'node:assert/strict';import {UserStore,type User} from '../src/users-store.js';
const user=(address:string,userId:string):User=>({address,userId,username:userId,profile_image:null,bio:null,followers:0,following:0,x_username:null});
test('user identity indexes reject ambiguity and do not index absent wallets',()=>{
  for(const rows of [[user('wallet','a'),user('wallet','b')],[user('a','same'),user('b','same')],[user('wallet','a'),user('b','wallet')]])assert.throws(()=>new UserStore(rows),/ambiguous|duplicate/i);
  const store=new UserStore([user('same','same'),user('','one'),user('','two')]);
  assert.equal(store.getById('same')?.userId,'same');assert.equal(store.getById(''),undefined);assert.equal(store.getById('one')?.userId,'one');assert.equal(store.getById('two')?.userId,'two');
});
