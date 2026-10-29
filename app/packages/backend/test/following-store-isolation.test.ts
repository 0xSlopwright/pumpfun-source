import assert from 'node:assert/strict';
import test from 'node:test';
import { FollowingStore } from '../src/following-store.js';
import { UserStore } from '../src/users-store.js';
test('caller-owned follow edges cannot change registered graph counts or pages', () => {
  const edges = [{ follower_id: 'a', following_id: 'b', timestamp: 1 }];
  const graph = new FollowingStore(new UserStore([]), edges);
  edges[0].following_id = 'c';
  edges.push({ follower_id: 'a', following_id: 'b', timestamp: 2 });
  assert.equal(graph.countFollowers('b'), 1);
  assert.equal(graph.countFollowers('c'), 0);
  assert.deepEqual(graph.relationship('b', 'a'), { following_id: 'b', user_id: 'a', timestamp: 1 });
});
test('search rows do not expose mutable UserStore state', () => {
  const users = new UserStore([{ userId: 'a', address: 'synthetic-a', username: 'alice', profile_image: null, bio: null, followers: 0, following: 0, x_username: null, group_badges: [{ group_id: 'g', username: 'synthetic', profile_image_url: null, role: 'member' }] }]);
  const graph = new FollowingStore(users, [{ follower_id: 'a', following_id: 'b', timestamp: 1 }]);
  const first = graph.searchFollowers('b', 'alice');
  assert.equal(first.length, 1);
  first[0].group_badges![0].role = 'changed';
  assert.equal(users.getById('a')?.group_badges?.[0].role, 'member');
  first[0].username = 'changed';
  assert.equal(graph.searchFollowers('b', 'alice')[0].username, 'alice');
  assert.equal(users.getById('a')?.username, 'alice');
});
