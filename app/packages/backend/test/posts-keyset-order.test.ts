import test from 'node:test';
import assert from 'node:assert/strict';
import { PostStore, SYNTHETIC_POSTS_SEED } from '../src/posts-store.js';

for (const method of ['getReplies', 'getQuotes'] as const) {
  test(`${method} does not lose distinct collating-equivalent post IDs`, () => {
    const template = structuredClone(SYNTHETIC_POSTS_SEED[0]);
    const parent = { ...template, postId: 'parent', kind: 'root' as const, deleted: false, hidden: false };
    const ids = ['\u00e9', 'e\u0301', 'z'];
    const children = ids.map(postId => ({ ...parent, postId, kind: method === 'getQuotes' ? 'quote' as const : 'reply' as const,
      parentPostId: method === 'getReplies' ? parent.postId : null,
      quotedPostId: method === 'getQuotes' ? parent.postId : null }));
    const store = new PostStore([parent, ...children]);
    const seen: string[] = [];
    let cursor: string | undefined;
    for (let i = 0; i < ids.length + 1; i++) {
      const page = store[method](parent.postId, { limit: 1, cursor })!;
      seen.push(...('replies' in page ? page.replies : page.quotes).map(post => post.postId));
      if (!page.nextCursor) break;
      cursor = page.nextCursor;
    }
    assert.deepEqual([...seen].sort(), [...ids].sort());
    assert.equal(new Set(seen).size, ids.length);
  });
}
