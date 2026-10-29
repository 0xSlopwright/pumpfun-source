import test from 'node:test';
import assert from 'node:assert/strict';
import { userToProfile } from '../src/posts-store.js';
import { UserStore } from '../src/users-store.js';
test('profile projection does not invent creation and update timestamps', () => {
  const user = new UserStore().list({})[0];
  const profile = userToProfile(user, false);
  assert.equal(profile.createdAt, null);
  assert.equal(profile.updatedAt, null);
  assert.equal(profile.username, user.username);
  assert.equal(profile.userId, user.userId ?? user.address);
});
