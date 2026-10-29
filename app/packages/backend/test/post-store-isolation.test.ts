import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PostStore,
  SYNTHETIC_POSTS_SEED,
  type RawPost,
} from '../src/posts-store.js';

function seedWithMention(): RawPost[] {
  const seed = structuredClone(SYNTHETIC_POSTS_SEED.slice(0, 3)) as RawPost[];
  seed[0].mentions = [
    { userId: 'mentioned-user', username: 'mentioned', walletAddress: null },
  ];
  return seed;
}

test('seed changes cannot corrupt post reads after construction', () => {
  const seed = seedWithMention();
  const store = new PostStore(seed);
  const original = structuredClone(store.getLivePost(seed[0].postId));
  seed[0].likeCount = 999999;
  seed[0].deleted = true;
  seed[0].mentions = [];
  assert.deepEqual(store.getLivePost(seed[0].postId), original);
});

test('mutating a returned post cannot corrupt later reads', () => {
  const seed = seedWithMention();
  const store = new PostStore(seed);
  const first = store.getLivePost(seed[0].postId)!;
  const original = structuredClone(first);
  first.likeCount = 999999;
  first.mentions.push({
    userId: 'injected',
    username: 'injected',
    walletAddress: null,
  });
  first.mentions[0].username = 'rewritten';
  assert.deepEqual(store.getLivePost(seed[0].postId), original);
});

test('stores built from the default seed do not share mutable post rows', () => {
  const first = new PostStore();
  const second = new PostStore();
  const id = SYNTHETIC_POSTS_SEED[0].postId;
  const original = structuredClone(second.getLivePost(id));
  const row = first.getLivePost(id)!;
  row.mentions.push({
    userId: 'injected',
    username: 'injected',
    walletAddress: null,
  });
  assert.deepEqual(second.getLivePost(id), original);
});
