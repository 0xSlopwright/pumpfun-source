import test from 'node:test';
import assert from 'node:assert/strict';
import { FollowingStore } from '../src/following-store.js';
import { UserStore } from '../src/users-store.js';
test('wallet-only follow rows preserve usable identity in both directions', () => {
 const rows=new UserStore().list({}).slice(0,2);
 rows[0].address='wallet-only'; delete rows[0].userId;
 rows[1].address='target-wallet'; rows[1].userId='target-user';
 const store=new FollowingStore(new UserStore(rows),[
  {follower_id:'wallet-only',following_id:'target-user',timestamp:1},
  {follower_id:'target-user',following_id:'wallet-only',timestamp:2},
 ]);
 for(const result of [store.followersOf('target-user'),store.followingOf('target-user')]){
  assert.equal(result[0].userId,'wallet-only');
  assert.equal(result[0].user_id,'wallet-only');
 }
 assert.equal(store.followersOf('wallet-only')[0].userId,'target-user');
});
