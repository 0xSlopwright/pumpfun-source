import test from 'node:test';
import assert from 'node:assert/strict';
import { PostStore, SYNTHETIC_POSTS_SEED } from '../src/posts-store.js';
import { UserStore, SYNTHETIC_SEED, type User } from '../src/users-store.js';

for (const method of ['getLikers','getReposters'] as const) {
 test(`${method} paginates available profiles, excluding unresolved identities`,()=>{
  const users=structuredClone(SYNTHETIC_SEED.slice(0,2)) as User[];
  const ids=users.map(user=>user.userId ?? user.address);
  const raw=structuredClone(SYNTHETIC_POSTS_SEED.find(post=>!post.deleted&&!post.hidden)!);
  raw.postId='relation-parent';
  raw.likers=raw.reposters=['missing-first',...ids,'missing-last'];
  const store=new PostStore([raw],new UserStore(users,[]));
  for (const offset of [0,1,2]) {
   const response=store[method](raw.postId,{offset,limit:1})!;
   const rows='likers' in response ? response.likers : response.reposters;
   assert.deepEqual(rows.map(row=>row.userId),ids.slice(offset,offset+1));
   assert.equal(response.hasMore,offset===0);
  }
 });
}
