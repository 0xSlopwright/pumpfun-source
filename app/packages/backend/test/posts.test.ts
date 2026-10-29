/**
 * Comprehensive tests for native /posts operations.
 *
 * Verifies contract conformance (against developer.openapi.json with assertSchema),
 * deterministic in-memory data, request order preservation, omission of unknown/hidden/deleted IDs,
 * keyset reply and quote pagination, offset liker and reposter pagination, route ordering,
 * error handling, and regressions.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildApp } from './with-api-key.js';
import { assertSchema, type SchemaNode, type SchemaRoot } from '../src/schema-validator.js';
import { SYNTHETIC_HEADER } from '../src/users-routes.js';
import { DATA_SOURCE } from '../src/users-store.js';
import { PostStore, SYNTHETIC_POSTS_SEED, type RawPost } from '../src/posts-store.js';

interface OpenApiDocument {
  paths: Record<string, Record<string, {
    responses?: Record<string, { content?: Record<string, { schema?: SchemaNode }> }>;
  }>>;
  components?: { schemas?: Record<string, SchemaNode> };
}

const SPEC_PATH = fileURLToPath(new URL('../../../contracts/developer.openapi.json', import.meta.url));
const spec = JSON.parse(readFileSync(SPEC_PATH, 'utf8')) as OpenApiDocument;
const specRoot = spec as unknown as SchemaRoot;

function documentedSchema(path: string, method: string, status: number): SchemaNode {
  const schema = spec.paths[path]?.[method.toLowerCase()]?.responses?.[String(status)]?.content?.['application/json']?.schema;
  assert.ok(schema, `No documented schema for ${method.toUpperCase()} ${path} ${status}`);
  return schema;
}

const errorSchema = spec.components?.schemas?.Error as SchemaNode;
assert.ok(errorSchema, 'components.schemas.Error must exist');

const POST_1 = '00000000-0000-4000-8000-000000000001';
const POST_2 = '00000000-0000-4000-8000-000000000002';
const POST_3 = '00000000-0000-4000-8000-000000000003';
const REPLY_1 = '00000000-0000-4000-8000-000000000010';
const QUOTE_1 = '00000000-0000-4000-8000-000000000020';
const REPOST_1 = '00000000-0000-4000-8000-000000000030';
const DELETED_POST = '00000000-0000-4000-8000-000000000099';
const HIDDEN_POST = '00000000-0000-4000-8000-000000000098';
const UNKNOWN_POST = '00000000-0000-4000-8000-000000000999';

describe('GET /v1/posts', () => {
  test('returns 200 with posts matching published schema and synthetic header', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject({
        method: 'GET',
        url: `/v1/posts?ids=${POST_1},${POST_2}`,
      });
      assert.equal(res.statusCode, 200);
      assert.equal(res.headers[SYNTHETIC_HEADER.toLowerCase()], DATA_SOURCE);

      const json = res.json();
      assert.deepEqual(Object.keys(json), ['posts']);
      assertSchema(json, documentedSchema('/posts', 'get', 200), 'GET /posts', specRoot);
      assert.equal(json.posts.length, 2);
    } finally {
      await app.close();
    }
  });

  test('preserves request order', async () => {
    const app = buildApp([]);
    try {
      // Query POST_2 then POST_1
      const res1 = await app.inject(`/v1/posts?ids=${POST_2},${POST_1}`);
      assert.equal(res1.statusCode, 200);
      const json1 = res1.json();
      assert.equal(json1.posts[0].postId, POST_2);
      assert.equal(json1.posts[1].postId, POST_1);

      // Query POST_1 then POST_2
      const res2 = await app.inject(`/v1/posts?ids=${POST_1},${POST_2}`);
      assert.equal(res2.statusCode, 200);
      const json2 = res2.json();
      assert.equal(json2.posts[0].postId, POST_1);
      assert.equal(json2.posts[1].postId, POST_2);
    } finally {
      await app.close();
    }
  });

  test('omits unknown, hidden, and deleted ids leaving no placeholder', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts?ids=${POST_1},${UNKNOWN_POST},${DELETED_POST},${HIDDEN_POST},${POST_2}`);
      assert.equal(res.statusCode, 200);
      const json = res.json();
      assert.equal(json.posts.length, 2);
      assert.equal(json.posts[0].postId, POST_1);
      assert.equal(json.posts[1].postId, POST_2);
      assertSchema(json, documentedSchema('/posts', 'get', 200), 'GET /posts omission', specRoot);
    } finally {
      await app.close();
    }
  });

  test('duplicates collapse to first occurrence preserving order', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts?ids=${POST_2},${POST_1},${POST_2},${POST_3},${POST_1}`);
      assert.equal(res.statusCode, 200);
      const json = res.json();
      assert.equal(json.posts.length, 3);
      assert.equal(json.posts[0].postId, POST_2);
      assert.equal(json.posts[1].postId, POST_1);
      assert.equal(json.posts[2].postId, POST_3);
    } finally {
      await app.close();
    }
  });

  test('supports multiple query parameters as well as comma-separated', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts?ids=${POST_1}&ids=${POST_2}`);
      assert.equal(res.statusCode, 200);
      const json = res.json();
      assert.equal(json.posts.length, 2);
      assert.equal(json.posts[0].postId, POST_1);
      assert.equal(json.posts[1].postId, POST_2);
    } finally {
      await app.close();
    }
  });

  test('missing or empty ids returns 400', async () => {
    const app = buildApp([]);
    try {
      const missing = await app.inject('/v1/posts');
      assert.equal(missing.statusCode, 400);
      assertSchema(missing.json(), errorSchema, '400 missing ids', specRoot);

      const empty = await app.inject('/v1/posts?ids=');
      assert.equal(empty.statusCode, 400);
      assertSchema(empty.json(), errorSchema, '400 empty ids', specRoot);
    } finally {
      await app.close();
    }
  });

  test('more than 100 ids returns 400 (contract maxItems)', async () => {
    const app = buildApp([]);
    try {
      const ids = Array.from({ length: 101 }, (_, i) => `00000000-0000-4000-8000-${String(i).padStart(12, '0')}`).join(',');
      const res = await app.inject(`/v1/posts?ids=${ids}`);
      assert.equal(res.statusCode, 400);
      assertSchema(res.json(), errorSchema, '400 too many ids', specRoot);
    } finally {
      await app.close();
    }
  });

  test('boundary: exactly 100 ids is accepted', async () => {
    const app = buildApp([]);
    try {
      const ids = Array.from({ length: 100 }, (_, i) => `00000000-0000-4000-8000-${String(i).padStart(12, '0')}`).join(',');
      const res = await app.inject(`/v1/posts?ids=${ids}`);
      assert.equal(res.statusCode, 200);
      const json = res.json();
      assertSchema(json, documentedSchema('/posts', 'get', 200), 'GET /posts 100 ids', specRoot);
    } finally {
      await app.close();
    }
  });
});

describe('GET /v1/posts/:postId', () => {
  test('returns 200 with { post } matching schema', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${POST_1}`);
      assert.equal(res.statusCode, 200);
      assert.equal(res.headers[SYNTHETIC_HEADER.toLowerCase()], DATA_SOURCE);

      const json = res.json();
      assert.deepEqual(Object.keys(json), ['post']);
      assertSchema(json, documentedSchema('/posts/{postId}', 'get', 200), 'GET /posts/:postId', specRoot);

      const post = json.post;
      assert.equal(post.postId, POST_1);
      assert.equal(post.kind, 'root');
      assert.equal(post.deleted, false);
      assert.equal(post.author.userId, 'user-001');
      assert.equal(post.author.username, 'alice_pump');
      assert.equal(post.author.isVerified, true);
      assert.equal(post.author.verifiedBadgeVisible, true);
      assert.equal(post.parent, null);
      assert.equal(post.quoted, null);
      assert.equal(post.reposted, null);
    } finally {
      await app.close();
    }
  });

  test('unknown postId returns 404 (documented assumption)', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${UNKNOWN_POST}`);
      assert.equal(res.statusCode, 404);
      assertSchema(res.json(), errorSchema, '404 unknown post', specRoot);
    } finally {
      await app.close();
    }
  });

  test('deleted post returns 404 (documented assumption per spec description)', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${DELETED_POST}`);
      assert.equal(res.statusCode, 404);
      assertSchema(res.json(), errorSchema, '404 deleted post', specRoot);
    } finally {
      await app.close();
    }
  });

  test('hidden post returns 404 (documented assumption per spec description)', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${HIDDEN_POST}`);
      assert.equal(res.statusCode, 404);
      assertSchema(res.json(), errorSchema, '404 hidden post', specRoot);
    } finally {
      await app.close();
    }
  });

  test('one-level embeds: reply has parent embedded with depth stopping at level 1', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${REPLY_1}`);
      assert.equal(res.statusCode, 200);
      const json = res.json();
      assertSchema(json, documentedSchema('/posts/{postId}', 'get', 200), 'reply embed', specRoot);

      assert.equal(json.post.kind, 'reply');
      assert.equal(json.post.parentPostId, POST_1);
      assert.ok(json.post.parent);
      assert.equal(json.post.parent.postId, POST_1);
      // Nested parent must stop at level 1 (parent is null)
      assert.equal(json.post.parent.parent, null);
      assert.equal(json.post.parent.quoted, null);
      assert.equal(json.post.parent.reposted, null);
    } finally {
      await app.close();
    }
  });

  test('one-level embeds: quote has quoted post embedded', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${QUOTE_1}`);
      assert.equal(res.statusCode, 200);
      const json = res.json();
      assertSchema(json, documentedSchema('/posts/{postId}', 'get', 200), 'quote embed', specRoot);

      assert.equal(json.post.kind, 'quote');
      assert.equal(json.post.quotedPostId, POST_1);
      assert.ok(json.post.quoted);
      assert.equal(json.post.quoted.postId, POST_1);
      assert.equal(json.post.quoted.parent, null);
    } finally {
      await app.close();
    }
  });

  test('one-level embeds: repost has reposted post embedded and hasLiked=false, hasReposted=false', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${REPOST_1}`);
      assert.equal(res.statusCode, 200);
      const json = res.json();
      assertSchema(json, documentedSchema('/posts/{postId}', 'get', 200), 'repost embed', specRoot);

      assert.equal(json.post.kind, 'repost');
      assert.equal(json.post.repostedPostId, POST_1);
      assert.ok(json.post.reposted);
      assert.equal(json.post.reposted.postId, POST_1);
      // On repost rows, hasLiked and hasReposted are always false per contract note
      assert.equal(json.post.hasLiked, false);
      assert.equal(json.post.hasReposted, false);
    } finally {
      await app.close();
    }
  });
});

describe('reposts of unavailable targets', () => {
  // Contract: `reposted` is "always present on a served repost", unlike `quoted`, which is
  // "null when the target is hidden or deleted". A repost whose target is unknown, deleted or
  // hidden therefore cannot be served.
  const REPOST_OF_DELETED = '00000000-0000-4000-8000-000000000031';
  const REPOST_OF_HIDDEN = '00000000-0000-4000-8000-000000000032';
  const REPOST_OF_UNKNOWN = '00000000-0000-4000-8000-000000000033';

  function repostOf(postId: string, target: string, createdAt: string): RawPost {
    const base = SYNTHETIC_POSTS_SEED.find(p => p.postId === REPOST_1);
    assert.ok(base);
    return { ...structuredClone(base), postId, repostedPostId: target, createdAt };
  }

  function appWithUnavailableTargets() {
    const seed = [
      ...structuredClone(SYNTHETIC_POSTS_SEED),
      repostOf(REPOST_OF_DELETED, DELETED_POST, '2024-01-04T11:00:00.000Z'),
      repostOf(REPOST_OF_HIDDEN, HIDDEN_POST, '2024-01-04T12:00:00.000Z'),
      repostOf(REPOST_OF_UNKNOWN, UNKNOWN_POST, '2024-01-04T13:00:00.000Z'),
    ];
    return buildApp([], { postStore: new PostStore(seed) });
  }

  test('GET /v1/posts/:postId returns 404 for a repost whose target is unavailable', async () => {
    const app = appWithUnavailableTargets();
    try {
      for (const id of [REPOST_OF_DELETED, REPOST_OF_HIDDEN, REPOST_OF_UNKNOWN]) {
        const res = await app.inject(`/v1/posts/${id}`);
        assert.equal(res.statusCode, 404, `repost ${id}`);
        assertSchema(res.json(), errorSchema, `404 repost ${id}`, specRoot);
        assert.equal(res.json().error, 'NOT_FOUND');
      }
      const live = await app.inject(`/v1/posts/${REPOST_1}`);
      assert.equal(live.statusCode, 200);
      assert.equal(live.json().post.reposted.postId, POST_1);
    } finally {
      await app.close();
    }
  });

  test('GET /v1/posts omits reposts whose target is unavailable', async () => {
    const app = appWithUnavailableTargets();
    try {
      const ids = [REPOST_OF_DELETED, REPOST_1, REPOST_OF_HIDDEN, REPOST_OF_UNKNOWN].join(',');
      const res = await app.inject(`/v1/posts?ids=${ids}`);
      assert.equal(res.statusCode, 200);
      const json = res.json();
      assertSchema(json, documentedSchema('/posts', 'get', 200), 'GET /posts reposts', specRoot);
      assert.deepEqual(json.posts.map((p: { postId: string }) => p.postId), [REPOST_1]);
      assert.equal(json.posts[0].reposted.postId, POST_1);
    } finally {
      await app.close();
    }
  });
});

describe('GET /v1/posts/:postId/replies', () => {
  test('returns 200 with replies and nextCursor matching schema', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${POST_1}/replies`);
      assert.equal(res.statusCode, 200);
      assert.equal(res.headers[SYNTHETIC_HEADER.toLowerCase()], DATA_SOURCE);

      const json = res.json();
      assert.deepEqual(Object.keys(json), ['replies', 'nextCursor']);
      assertSchema(json, documentedSchema('/posts/{postId}/replies', 'get', 200), 'GET replies', specRoot);
    } finally {
      await app.close();
    }
  });

  test('keyset pagination: page 1 returns nextCursor, page 2 follows, final page returns null', async () => {
    const app = buildApp([]);
    try {
      // Post 1 has 5 live replies: 14, 13, 12, 11, 10 (newest first).
      // Page 1: limit 2
      const page1Res = await app.inject(`/v1/posts/${POST_1}/replies?limit=2`);
      assert.equal(page1Res.statusCode, 200);
      const page1 = page1Res.json();
      assert.equal(page1.replies.length, 2);
      assert.ok(page1.nextCursor !== null, 'first page must return nextCursor when more rows exist');
      assert.equal(typeof page1.nextCursor, 'string');
      assertSchema(page1, documentedSchema('/posts/{postId}/replies', 'get', 200), 'page 1', specRoot);

      // Page 2: with cursor from page 1
      const page2Res = await app.inject(`/v1/posts/${POST_1}/replies?limit=2&cursor=${encodeURIComponent(page1.nextCursor)}`);
      assert.equal(page2Res.statusCode, 200);
      const page2 = page2Res.json();
      assert.equal(page2.replies.length, 2);
      assert.ok(page2.nextCursor !== null, 'second page must return nextCursor when 1 row remains');
      assertSchema(page2, documentedSchema('/posts/{postId}/replies', 'get', 200), 'page 2', specRoot);

      // Page 3: with cursor from page 2
      const page3Res = await app.inject(`/v1/posts/${POST_1}/replies?limit=2&cursor=${encodeURIComponent(page2.nextCursor)}`);
      assert.equal(page3Res.statusCode, 200);
      const page3 = page3Res.json();
      assert.equal(page3.replies.length, 1);
      assert.equal(page3.nextCursor, null, 'final page nextCursor must be null at end of list');
      assertSchema(page3, documentedSchema('/posts/{postId}/replies', 'get', 200), 'page 3', specRoot);

      // Verify overall order is strictly newest first and all 5 unique replies were fetched
      const allIds = [
        ...page1.replies.map((r: any) => r.postId),
        ...page2.replies.map((r: any) => r.postId),
        ...page3.replies.map((r: any) => r.postId),
      ];
      assert.deepEqual(allIds, [
        '00000000-0000-4000-8000-000000000014',
        '00000000-0000-4000-8000-000000000013',
        '00000000-0000-4000-8000-000000000012',
        '00000000-0000-4000-8000-000000000011',
        '00000000-0000-4000-8000-000000000010',
      ]);
    } finally {
      await app.close();
    }
  });

  test('deleted reply is omitted from live replies', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${POST_1}/replies?limit=50`);
      assert.equal(res.statusCode, 200);
      const json = res.json();
      const ids = json.replies.map((r: any) => r.postId);
      assert.ok(!ids.includes('00000000-0000-4000-8000-000000000019'), 'deleted reply must not be included');
    } finally {
      await app.close();
    }
  });

  test('invalid cursor returns 400 INVALID_CURSOR', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${POST_1}/replies?cursor=not-a-valid-cursor`);
      assert.equal(res.statusCode, 400);
      assertSchema(res.json(), errorSchema, '400 invalid cursor', specRoot);
    } finally {
      await app.close();
    }
  });

  test('unknown postId returns 404', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${UNKNOWN_POST}/replies`);
      assert.equal(res.statusCode, 404);
      assertSchema(res.json(), errorSchema, '404 unknown post replies', specRoot);
    } finally {
      await app.close();
    }
  });

  test('deleted or hidden postId returns 404', async () => {
    const app = buildApp([]);
    try {
      const deletedRes = await app.inject(`/v1/posts/${DELETED_POST}/replies`);
      assert.equal(deletedRes.statusCode, 404);
      const hiddenRes = await app.inject(`/v1/posts/${HIDDEN_POST}/replies`);
      assert.equal(hiddenRes.statusCode, 404);
    } finally {
      await app.close();
    }
  });

  test('route ordering: /v1/posts/:postId/replies is not captured by /v1/posts/:postId', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${POST_1}/replies`);
      assert.equal(res.statusCode, 200);
      const json = res.json();
      assert.ok('replies' in json, 'Must return replies object, not single post');
    } finally {
      await app.close();
    }
  });
});

describe('GET /v1/posts/:postId/quotes', () => {
  test('returns 200 with { quotes, nextCursor } matching published schema', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${POST_1}/quotes`);
      assert.equal(res.statusCode, 200);
      assert.equal(res.headers[SYNTHETIC_HEADER.toLowerCase()], DATA_SOURCE);

      const json = res.json();
      assert.deepEqual(Object.keys(json), ['quotes', 'nextCursor']);
      assertSchema(json, documentedSchema('/posts/{postId}/quotes', 'get', 200), 'GET quotes', specRoot);
    } finally {
      await app.close();
    }
  });

  test('keyset pagination: newest first, nextCursor on first page, null on final page', async () => {
    const app = buildApp([]);
    try {
      // Post 1 has 3 quotes: 22, 21, 20
      const page1Res = await app.inject(`/v1/posts/${POST_1}/quotes?limit=2`);
      assert.equal(page1Res.statusCode, 200);
      const page1 = page1Res.json();
      assert.equal(page1.quotes.length, 2);
      assert.ok(page1.nextCursor !== null);
      assert.equal(page1.quotes[0].postId, '00000000-0000-4000-8000-000000000022');
      assert.equal(page1.quotes[1].postId, '00000000-0000-4000-8000-000000000021');

      const page2Res = await app.inject(`/v1/posts/${POST_1}/quotes?limit=2&cursor=${encodeURIComponent(page1.nextCursor)}`);
      assert.equal(page2Res.statusCode, 200);
      const page2 = page2Res.json();
      assert.equal(page2.quotes.length, 1);
      assert.equal(page2.nextCursor, null);
      assert.equal(page2.quotes[0].postId, '00000000-0000-4000-8000-000000000020');
    } finally {
      await app.close();
    }
  });

  test('unknown postId returns 404', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${UNKNOWN_POST}/quotes`);
      assert.equal(res.statusCode, 404);
      assertSchema(res.json(), errorSchema, '404 quotes', specRoot);
    } finally {
      await app.close();
    }
  });

  test('route ordering: /v1/posts/:postId/quotes is not captured by /v1/posts/:postId', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${POST_1}/quotes`);
      assert.equal(res.statusCode, 200);
      const json = res.json();
      assert.ok('quotes' in json, 'Must return quotes object, not single post');
    } finally {
      await app.close();
    }
  });
});

describe('GET /v1/posts/:postId/likers', () => {
  test('returns 200 with { likers, hasMore } conforming to schema', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${POST_1}/likers`);
      assert.equal(res.statusCode, 200);
      assert.equal(res.headers[SYNTHETIC_HEADER.toLowerCase()], DATA_SOURCE);

      const json = res.json();
      assert.deepEqual(Object.keys(json), ['likers', 'hasMore']);
      assertSchema(json, documentedSchema('/posts/{postId}/likers', 'get', 200), 'GET likers', specRoot);
    } finally {
      await app.close();
    }
  });

  test('liker profile satisfies required keys and additionalProperties: false', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${POST_1}/likers?limit=1`);
      assert.equal(res.statusCode, 200);
      const json = res.json();
      assert.equal(json.likers.length, 1);
      const liker = json.likers[0];
      assert.equal(typeof liker.userId, 'string');
      assert.equal(typeof liker.username, 'string');
      assert.equal(typeof liker.bio, 'string');
      assert.equal(typeof liker.profileImageUrl, 'string');
      assert.equal(typeof liker.headerImageUrl, 'string');
      assert.equal(typeof liker.followerCount, 'number');
      assert.equal(typeof liker.followingCount, 'number');
      assert.equal(typeof liker.isVerified, 'boolean');
      assert.equal(typeof liker.verifiedBadgeVisible, 'boolean');
      assert.equal(typeof liker.kind, 'string');
      assert.equal(typeof liker.memberCount, 'number');
      assert.ok(Array.isArray(liker.socials));
      assert.ok(Array.isArray(liker.groupBadges));
    } finally {
      await app.close();
    }
  });

  test('offset pagination and boundaries with hasMore', async () => {
    const app = buildApp([]);
    try {
      // Post 1 has 5 likers in seed
      // Page 1: offset=0, limit=2 -> 2 items, hasMore=true
      const p1 = await app.inject(`/v1/posts/${POST_1}/likers?limit=2&offset=0`);
      assert.equal(p1.statusCode, 200);
      const j1 = p1.json();
      assert.equal(j1.likers.length, 2);
      assert.equal(j1.hasMore, true);

      // Page 2: offset=2, limit=2 -> 2 items, hasMore=true
      const p2 = await app.inject(`/v1/posts/${POST_1}/likers?limit=2&offset=2`);
      assert.equal(p2.statusCode, 200);
      const j2 = p2.json();
      assert.equal(j2.likers.length, 2);
      assert.equal(j2.hasMore, true);

      // Page 3: offset=4, limit=2 -> 1 item, hasMore=false
      const p3 = await app.inject(`/v1/posts/${POST_1}/likers?limit=2&offset=4`);
      assert.equal(p3.statusCode, 200);
      const j3 = p3.json();
      assert.equal(j3.likers.length, 1);
      assert.equal(j3.hasMore, false);

      // Past end: offset=10 -> 0 items, hasMore=false
      const past = await app.inject(`/v1/posts/${POST_1}/likers?limit=2&offset=10`);
      assert.equal(past.statusCode, 200);
      const jpast = past.json();
      assert.equal(jpast.likers.length, 0);
      assert.equal(jpast.hasMore, false);
    } finally {
      await app.close();
    }
  });

  test('negative offset clamps to 0 (documented assumption)', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${POST_1}/likers?limit=2&offset=-5`);
      assert.equal(res.statusCode, 200);
      const json = res.json();
      assert.equal(json.likers.length, 2);
      assert.equal(json.hasMore, true);
    } finally {
      await app.close();
    }
  });

  test('unknown postId returns 404', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${UNKNOWN_POST}/likers`);
      assert.equal(res.statusCode, 404);
      assertSchema(res.json(), errorSchema, '404 likers', specRoot);
    } finally {
      await app.close();
    }
  });

  test('route ordering: /v1/posts/:postId/likers is not captured by /v1/posts/:postId', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${POST_1}/likers`);
      assert.equal(res.statusCode, 200);
      const json = res.json();
      assert.ok('likers' in json, 'Must return likers object, not single post');
    } finally {
      await app.close();
    }
  });
});

describe('GET /v1/posts/:postId/reposters', () => {
  test('returns 200 with { reposters, hasMore } conforming to schema', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${POST_1}/reposters`);
      assert.equal(res.statusCode, 200);
      assert.equal(res.headers[SYNTHETIC_HEADER.toLowerCase()], DATA_SOURCE);

      const json = res.json();
      assert.deepEqual(Object.keys(json), ['reposters', 'hasMore']);
      assertSchema(json, documentedSchema('/posts/{postId}/reposters', 'get', 200), 'GET reposters', specRoot);
    } finally {
      await app.close();
    }
  });

  test('offset pagination with hasMore on reposters', async () => {
    const app = buildApp([]);
    try {
      // Post 1 has 3 reposters in seed
      const p1 = await app.inject(`/v1/posts/${POST_1}/reposters?limit=2&offset=0`);
      assert.equal(p1.statusCode, 200);
      const j1 = p1.json();
      assert.equal(j1.reposters.length, 2);
      assert.equal(j1.hasMore, true);

      const p2 = await app.inject(`/v1/posts/${POST_1}/reposters?limit=2&offset=2`);
      assert.equal(p2.statusCode, 200);
      const j2 = p2.json();
      assert.equal(j2.reposters.length, 1);
      assert.equal(j2.hasMore, false);
    } finally {
      await app.close();
    }
  });

  test('unknown postId returns 404', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${UNKNOWN_POST}/reposters`);
      assert.equal(res.statusCode, 404);
      assertSchema(res.json(), errorSchema, '404 reposters', specRoot);
    } finally {
      await app.close();
    }
  });

  test('route ordering: /v1/posts/:postId/reposters is not captured by /v1/posts/:postId', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject(`/v1/posts/${POST_1}/reposters`);
      assert.equal(res.statusCode, 200);
      const json = res.json();
      assert.ok('reposters' in json, 'Must return reposters object, not single post');
    } finally {
      await app.close();
    }
  });
});

describe('regression: users, fixtures, and health unchanged', () => {
  test('/v1/users still functions natively', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject('/v1/users?limit=2');
      assert.equal(res.statusCode, 200);
      assert.equal(res.headers[SYNTHETIC_HEADER.toLowerCase()], DATA_SOURCE);
      const json = res.json();
      assert.equal(json.length, 2);
    } finally {
      await app.close();
    }
  });

  test('/v1/users/:id still functions natively', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject('/v1/users/user-001');
      assert.equal(res.statusCode, 200);
      const json = res.json();
      assert.equal(json.userId, 'user-001');
    } finally {
      await app.close();
    }
  });

  test('/health still returns 200 ok', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject('/health');
      assert.equal(res.statusCode, 200);
      assert.deepEqual(res.json(), { status: 'ok', mode: 'reconstruction', compatibility: 'unqualified' });
    } finally {
      await app.close();
    }
  });

  test('unimplemented routes still return 501 COMPATIBILITY_NOT_IMPLEMENTED', async () => {
    const app = buildApp([]);
    try {
      const res = await app.inject('/v1/coins/some-mint');
      assert.equal(res.statusCode, 501);
      assert.equal(res.json().error, 'COMPATIBILITY_NOT_IMPLEMENTED');
    } finally {
      await app.close();
    }
  });
});
