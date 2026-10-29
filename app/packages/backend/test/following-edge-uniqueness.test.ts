import test from 'node:test';import assert from 'node:assert/strict';import {FollowingStore} from '../src/following-store.js';import {UserStore} from '../src/users-store.js';
test('a directed follow relation cannot occur twice in the seed',()=>{
  const edge={follower_id:'a',following_id:'b',timestamp:1};
  assert.throws(()=>new FollowingStore(new UserStore([]),[edge,{...edge,timestamp:2}]),/duplicate/i);
  assert.doesNotThrow(()=>new FollowingStore(new UserStore([]),[edge,{follower_id:'b',following_id:'a',timestamp:2}]));
});
