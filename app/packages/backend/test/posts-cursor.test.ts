import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { buildApp } from './with-api-key.js';
import { buildApp as buildUnauthenticatedApp } from '../src/app.js';
import {
  DATA_SOURCE,
  PostStore,
  SYNTHETIC_POSTS_SEED,
  decodeCursor,
  encodeCursor,
  type RawPost,
} from '../src/posts-store.js';

const root = SYNTHETIC_POSTS_SEED[0];
const tuple = (value: unknown): string => Buffer.from(JSON.stringify(value)).toString('base64url');
const valid = encodeCursor(root);
const invalidUtf8 = Buffer.concat([
  Buffer.from('["2024-01-01T00:00:00.000Z","'),
  Buffer.from([0xff]),
  Buffer.from('"]'),
]).toString('base64url');

const invalidCursors: Record<string, unknown> = {
  empty: '',
  'non-string array': [valid],
  'non-string null': null,
  'non-base64 alphabet': `${valid}!`,
  'leading whitespace': ` ${valid}`,
  'trailing whitespace': `${valid}\n`,
  padding: `${valid}=`,
  'non-canonical trailing bits': 'WyIiLCIiXR',
  'invalid UTF-8': invalidUtf8,
  'UTF-8 BOM before JSON': Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(JSON.stringify([root.createdAt, root.postId]))]).toString('base64url'),
  'non-JSON bytes': Buffer.from('not JSON').toString('base64url'),
  object: tuple({ createdAt: root.createdAt, postId: root.postId }),
  'missing timestamp': tuple([root.postId]),
  'extra element': tuple([root.createdAt, root.postId, 'extra']),
  'null timestamp': tuple([null, root.postId]),
  'numeric timestamp': tuple([1704067200000, root.postId]),
  'null id': tuple([root.createdAt, null]),
  'numeric id': tuple([root.createdAt, 1]),
  'unparseable timestamp': tuple(['not-a-date', root.postId]),
  'out-of-range timestamp': tuple(['999999999999-01-01T00:00:00Z', root.postId]),
  'infinite timestamp': tuple(['Infinity', root.postId]),
};

test('post pagination is bound to the documented developer read contract, not a website endpoint', () => {
  const specification = JSON.parse(readFileSync(new URL('../../../contracts/developer.openapi.json', import.meta.url), 'utf8'));
  assert.equal(specification.servers[0].url, 'https://api.pump.fun/v1');
  assert.deepEqual(specification.components.schemas.Shared_47a8d5353d95.properties.createdAt, {
    nullable: true, description: 'ISO 8601', type: 'string',
  });
  for (const relation of ['replies', 'quotes']) {
    const operation = specification.paths[`/posts/{postId}/${relation}`].get;
    assert.equal(operation['x-api-scope'], 'content.read');
    const cursor = operation.parameters.find((parameter: { name: string }) => parameter.name === 'cursor');
    assert.equal(cursor.schema.type, 'string');
    assert.match(cursor.schema.description, /previous response's nextCursor/);
    assert.match(operation.description, /newest first.*keyset-paginated/);
  }
});

test('every existing seed cursor preserves its encoded bytes and round-trips', () => {
  for (const post of SYNTHETIC_POSTS_SEED) {
    const expected = tuple([post.createdAt ?? '', post.postId]);
    assert.equal(encodeCursor(post), expected);
    assert.deepEqual(decodeCursor(expected), { createdAt: post.createdAt ?? '', postId: post.postId });
  }
});

test('cursor decoding preserves null-time sentinel and ISO offset/precision variants', () => {
  for (const createdAt of [null, '2024-01-01T00:00:00Z', '2024-01-01T01:30:00+01:30', '2024-01-01T00:00:00.123456Z']) {
    const item = { createdAt, postId: 'local-post' };
    assert.deepEqual(decodeCursor(encodeCursor(item)), { createdAt: createdAt ?? '', postId: item.postId });
  }
  for (const postId of ['', 'local-☃-🐱']) {
    const item = { createdAt: root.createdAt, postId };
    assert.deepEqual(decodeCursor(encodeCursor(item)), item);
  }
});

for (const [name, cursor] of Object.entries(invalidCursors)) {
  test(`cursor decoder rejects ${name}`, () => {
    assert.equal(decodeCursor(cursor), null);
  });
}

for (const relation of ['replies', 'quotes'] as const) {
  test(`${relation} rejects malformed cursors instead of successful empty/reset pages`, async () => {
    const app = buildApp([]);
    try {
      for (const [name, cursor] of Object.entries(invalidCursors)) {
        if (typeof cursor !== 'string') continue;
        const response = await app.inject(`/v1/posts/${root.postId}/${relation}?cursor=${encodeURIComponent(cursor)}`);
        assert.equal(response.statusCode, 400, name);
        assert.equal(response.json().error, 'INVALID_CURSOR', name);
        assert.equal(response.json().statusCode, 400, name);
        assert.equal(response.headers['x-reconstruction-data-source'], undefined, name);
      }
      // A repeated cursor is a duplicate query key, not a malformed cursor value:
      // the shared duplicate-key boundary (users, following, replay harness)
      // runs before cursor decoding, so it reports 501, still a rejection.
      const repeated = await app.inject(`/v1/posts/${root.postId}/${relation}?cursor=${valid}&cursor=${valid}`);
      assert.equal(repeated.statusCode, 501);
      assert.equal(repeated.json().error, 'DUPLICATE_QUERY_KEYS_UNIMPLEMENTED');
    } finally {
      await app.close();
    }
  });

  test(`${relation} keeps unknown-post and API-key failure precedence`, async () => {
    const app = buildApp([]);
    const unauthenticated = buildUnauthenticatedApp([]);
    try {
      const missing = await app.inject(`/v1/posts/missing/${relation}?cursor=invalid`);
      assert.equal(missing.statusCode, 404);
      const unauthenticatedResponse = await unauthenticated.inject(`/v1/posts/${root.postId}/${relation}?cursor=invalid`);
      assert.equal(unauthenticatedResponse.statusCode, 401);
      assert.equal(unauthenticatedResponse.json().error, 'API_KEY_REQUIRED');
    } finally {
      await Promise.all([app.close(), unauthenticated.close()]);
    }
  });

  test(`${relation} continuation visits every visible row once at equal and null timestamps`, async () => {
    const dates = [
      '2024-01-02T00:00:00.000Z',
      '2024-01-02T01:00:00+01:00',
      '2024-01-02T00:00:00.000Z',
      '2024-01-01T00:00:00.000Z',
      null,
      null,
      '1969-12-31T23:59:59.000Z',
    ];
    const rows: RawPost[] = dates.map((createdAt, index) => ({
      ...root,
      postId: `local-${index}`,
      kind: relation === 'replies' ? 'reply' : 'quote',
      parentPostId: relation === 'replies' ? root.postId : null,
      quotedPostId: relation === 'quotes' ? root.postId : null,
      rootPostId: root.postId,
      createdAt,
      deleted: false,
      hidden: false,
    }));
    const deleted = { ...rows[0], postId: 'deleted-child', deleted: true };
    const hidden = { ...rows[0], postId: 'hidden-child', hidden: true };
    const app = buildApp([], { postStore: new PostStore([root, ...rows, deleted, hidden]) });
    try {
      const all = await app.inject(`/v1/posts/${root.postId}/${relation}`);
      assert.equal(all.statusCode, 200);
      const expected = ['local-2', 'local-1', 'local-0', 'local-3', 'local-5', 'local-4', 'local-6'];
      assert.deepEqual(all.json()[relation].map((post: { postId: string }) => post.postId), expected);

      for (const limit of [1, 2, 3, rows.length]) {
        let cursor: string | null = null;
        const visited: string[] = [];
        const cursors = new Set<string>();
        do {
          const url: string = `/v1/posts/${root.postId}/${relation}?limit=${limit}${cursor === null ? '' : `&cursor=${encodeURIComponent(cursor)}`}`;
          const response = await app.inject(url);
          assert.equal(response.statusCode, 200);
          assert.equal(response.headers['x-reconstruction-data-source'], DATA_SOURCE);
          const page = response.json();
          visited.push(...page[relation].map((post: { postId: string }) => post.postId));
          cursor = page.nextCursor;
          if (cursor !== null) {
            assert.equal(cursors.has(cursor), false, 'cursor must make progress');
            assert.deepEqual(decodeCursor(cursor), {
              createdAt: page[relation].at(-1).createdAt ?? '',
              postId: page[relation].at(-1).postId,
            });
            cursors.add(cursor);
          }
          assert.ok(cursors.size <= rows.length, 'pagination must terminate');
        } while (cursor !== null);
        assert.deepEqual(visited, expected, `limit ${limit} must neither omit nor duplicate rows`);
      }
    } finally {
      await app.close();
    }
  });
}
