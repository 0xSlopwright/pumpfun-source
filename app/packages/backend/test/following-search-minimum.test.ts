import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildApp } from './with-api-key.js';
import { FollowingStore } from '../src/following-store.js';
import { UserStore } from '../src/users-store.js';

for (const side of ['followers', 'following']) {
  test(`${side} search applies the trimmed character minimum before case folding`, async (t) => {
    const users = new UserStore([
      { address: 'local-istanbul', userId: 'istanbul', username: '\u0130stanbul',
        profile_image: null, bio: null, followers: 1, following: 1, x_username: null },
      { address: 'local-emoji', userId: 'emoji', username: '\u{1f600}trader',
        profile_image: null, bio: null, followers: 1, following: 1, x_username: null },
    ]);
    const followingStore = new FollowingStore(users, ['istanbul', 'emoji'].flatMap(id => [
      { follower_id: id, following_id: 'owner', timestamp: 1 },
      { follower_id: 'owner', following_id: id, timestamp: 1 },
    ]));
    const app = buildApp([], { userStore: users, followingStore });
    t.after(() => app.close());
    for (const term of ['\u0130', ' \u0130 ', '\u{1f600}', ' \u{1f600} ']) {
      const response = await app.inject(
        `/v1/following/v3/${side}/search/owner?searchTerm=${encodeURIComponent(term)}`,
      );
      assert.equal(response.statusCode, 200);
      assert.deepEqual(response.json(), [], JSON.stringify(term));
    }
    for (const [term, id] of [[' \u0130s ', 'istanbul'], ['\u{1f600}t', 'emoji']]) {
      const response = await app.inject(
        `/v1/following/v3/${side}/search/owner?searchTerm=${encodeURIComponent(term)}`,
      );
      assert.equal(response.statusCode, 200);
      assert.deepEqual(response.json().map((user: { userId: string }) => user.userId), [id]);
    }
  });
}
