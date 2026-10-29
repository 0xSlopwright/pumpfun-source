import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../src/app.js';
import { PostStore, SYNTHETIC_POSTS_SEED } from '../src/posts-store.js';

test('unservable repost parents are unavailable through every post subresource', async () => {
  const target = structuredClone(SYNTHETIC_POSTS_SEED[0]);
  target.postId = '00000000-0000-4000-8000-000000000081';
  target.deleted = false; target.hidden = false;
  const repost = { ...target, postId: '00000000-0000-4000-8000-000000000082', kind: 'repost' as const, repostedPostId: target.postId };
  for (const state of ['missing', 'hidden', 'deleted'] as const) {
    const rows = state === 'missing' ? [repost] : [repost, { ...target, hidden: state === 'hidden', deleted: state === 'deleted' }];
    const app = buildApp([], { postStore: new PostStore(rows) });
    try {
      for (const suffix of ['', '/replies', '/quotes', '/likers', '/reposters']) {
        const result = await app.inject({url: `/v1/posts/${repost.postId}${suffix}`, headers: {authorization: `Bearer pf_live_${'a'.repeat(49)}`}});
        assert.equal(result.statusCode, 404, `${state}: ${suffix}`);
      }
    } finally { await app.close(); }
  }
});
