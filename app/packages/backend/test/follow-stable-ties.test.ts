import test from 'node:test';
import assert from 'node:assert/strict';
import {FollowingStore} from '../src/following-store.js';
import {UserStore} from '../src/users-store.js';
test('equal usernames and missing userIds tie-break by wallet regardless of seed order',()=>{
  const users=new UserStore().list({}).slice(0,3);
  users[0].address='wallet-b';users[1].address='wallet-a';users[2].address='target';
  for (const user of users){delete user.userId;user.username='same';user.followers=1;}
  const edges=[{follower_id:'wallet-b',following_id:'target',timestamp:1},{follower_id:'wallet-a',following_id:'target',timestamp:1}];
  const make=(rows:typeof edges)=>new FollowingStore(new UserStore(users),rows);
  for (const sort of ['followers','recent'] as const) {
    assert.deepEqual(make(edges).followersOf('target',{sort}).map(u=>u.address),['wallet-a','wallet-b']);
    assert.deepEqual(make([...edges].reverse()).followersOf('target',{sort}).map(u=>u.address),['wallet-a','wallet-b']);
  }
});
