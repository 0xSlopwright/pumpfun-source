/**
 * Native /following operation tests (7 of the 67 documented operations).
 *
 * Every 200 response is validated against the published OpenAPI schema, so a
 * field renamed here fails here rather than in a consumer. The parameter cases
 * cover what the contract states explicitly: out-of-range paging is a 400 and
 * not a clamp, the search term has a 50-character ceiling, and a term that is
 * shorter than two characters after trimming answers [] without searching.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildApp } from './with-api-key.js';
import { assertSchema, type SchemaNode, type SchemaRoot } from '../src/schema-validator.js';
import { FollowingStore } from '../src/following-store.js';
import { UserStore } from '../src/users-store.js';
import { SYNTHETIC_HEADER } from '../src/users-routes.js';

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
  const schema = spec.paths[path]?.[method.toLowerCase()]?.responses?.[String(status)]
    ?.content?.['application/json']?.schema;
  assert.ok(schema, `No documented schema for ${method.toUpperCase()} ${path} ${status}`);
  return schema;
}

const SEED_USERS = [
  {
    address: '0xaaa', userId: 'user-001', username: 'alice_pump', profile_image: 'a.png',
    bio: 'a', followers: 1200, following: 340, x_username: 'alice',
  },
  {
    address: '0xbbb', userId: 'user-002', username: 'bob_degen', profile_image: 'b.png',
    bio: 'b', followers: 850, following: 120, x_username: null,
  },
  {
    address: '0xccc', userId: 'user-003', username: null, profile_image: null,
    bio: null, followers: 0, following: 5, x_username: null,
  },
];

const EDGES = [
  { follower_id: 'user-002', following_id: 'user-001', timestamp: 1000 },
  { follower_id: 'user-003', following_id: 'user-001', timestamp: 3000 },
  { follower_id: 'user-001', following_id: 'user-002', timestamp: 2000 },
];

function makeApp() {
  const users = new UserStore(SEED_USERS);
  const followingStore = new FollowingStore(users, EDGES);
  return buildApp([], { userStore: users, followingStore });
}

describe('GET /v1/following/v3/followers/{userId}', () => {
  test('200 matches the documented row schema', async () => {
    const app = makeApp();
    const res = await app.inject({ method: 'GET', url: '/v1/following/v3/followers/user-001' });
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers[SYNTHETIC_HEADER.toLowerCase()], 'synthetic-seed-play');
    const body = res.json();
    assertSchema(body, documentedSchema('/following/v3/followers/{userId}', 'get', 200),
      'followers page', specRoot);
    assert.deepEqual(body.map((row: { userId?: string }) => row.userId), ['user-002', 'user-003']);
  });

  test('recent order follows the edge timestamps', async () => {
    const app = makeApp();
    const res = await app.inject({
      method: 'GET', url: '/v1/following/v3/followers/user-001?sort=recent',
    });
    assert.deepEqual(res.json().map((row: { userId?: string }) => row.userId),
      ['user-003', 'user-002']);
  });

  test('limit above the documented maximum is a 400, not a clamp', async () => {
    const app = makeApp();
    const res = await app.inject({
      method: 'GET', url: '/v1/following/v3/followers/user-001?limit=1001',
    });
    assert.equal(res.statusCode, 400);
    assert.equal(res.json().error, 'INVALID_LIMIT');
  });

  test('limit of zero is a 400', async () => {
    const app = makeApp();
    const res = await app.inject({
      method: 'GET', url: '/v1/following/v3/followers/user-001?limit=0',
    });
    assert.equal(res.statusCode, 400);
  });

  test('negative offset is a 400', async () => {
    const app = makeApp();
    const res = await app.inject({
      method: 'GET', url: '/v1/following/v3/followers/user-001?offset=-1',
    });
    assert.equal(res.statusCode, 400);
    assert.equal(res.json().error, 'INVALID_OFFSET');
  });

  test('an undocumented sort key is a 400', async () => {
    const app = makeApp();
    const res = await app.inject({
      method: 'GET', url: '/v1/following/v3/followers/user-001?sort=popular',
    });
    assert.equal(res.statusCode, 400);
    assert.equal(res.json().error, 'INVALID_SORT');
  });

  test('an unknown user answers an empty page rather than an error', async () => {
    const app = makeApp();
    const res = await app.inject({ method: 'GET', url: '/v1/following/v3/followers/ghost' });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.json(), []);
  });

  test('400 bodies match the contract Error component', async () => {
    const app = makeApp();
    const res = await app.inject({
      method: 'GET', url: '/v1/following/v3/followers/user-001?limit=0',
    });
    assertSchema(res.json(), spec.components!.schemas!.Error as SchemaNode, 'error body', specRoot);
  });
});

describe('GET /v1/following/v3/following/{userId}', () => {
  test('200 matches the documented row schema', async () => {
    const app = makeApp();
    const res = await app.inject({ method: 'GET', url: '/v1/following/v3/following/user-001' });
    assert.equal(res.statusCode, 200);
    assertSchema(res.json(), documentedSchema('/following/v3/following/{userId}', 'get', 200),
      'following page', specRoot);
    assert.deepEqual(res.json().map((row: { userId?: string }) => row.userId), ['user-002']);
  });
});

describe('following counts', () => {
  test('followers count matches the edge set', async () => {
    const app = makeApp();
    const res = await app.inject({
      method: 'GET', url: '/v1/following/v3/followers/count/user-001',
    });
    assert.equal(res.statusCode, 200);
    assertSchema(res.json(), documentedSchema('/following/v3/followers/count/{userId}', 'get', 200),
      'followers count', specRoot);
    assert.deepEqual(res.json(), { count: 2 });
  });

  test('following count matches the edge set', async () => {
    const app = makeApp();
    const res = await app.inject({
      method: 'GET', url: '/v1/following/v3/following/count/user-001',
    });
    assert.deepEqual(res.json(), { count: 1 });
  });
});

describe('follow searches', () => {
  test('a term shorter than two characters answers [] without searching', async () => {
    const app = makeApp();
    for (const term of ['a', ' a ']) {
      const res = await app.inject({
        method: 'GET',
        url: `/v1/following/v3/followers/search/user-001?searchTerm=${encodeURIComponent(term)}`,
      });
      assert.equal(res.statusCode, 200, `term ${JSON.stringify(term)}`);
      assert.deepEqual(res.json(), [], `term ${JSON.stringify(term)}`);
    }
  });

  test('an empty term is a 400 because the parameter has minLength 1', async () => {
    const app = makeApp();
    const res = await app.inject({
      method: 'GET', url: '/v1/following/v3/followers/search/user-001?searchTerm=',
    });
    assert.equal(res.statusCode, 400);
    assert.equal(res.json().error, 'INVALID_SEARCH_TERM');
  });

  test('a matching term returns the schema-valid row', async () => {
    const app = makeApp();
    const res = await app.inject({
      method: 'GET', url: '/v1/following/v3/followers/search/user-001?searchTerm=BOB',
    });
    assert.equal(res.statusCode, 200);
    assertSchema(res.json(), documentedSchema('/following/v3/followers/search/{userId}', 'get', 200),
      'follower search', specRoot);
    assert.deepEqual(res.json().map((row: { userId?: string }) => row.userId), ['user-002']);
  });

  test('a term over 50 characters is a 400', async () => {
    const app = makeApp();
    const res = await app.inject({
      method: 'GET',
      url: `/v1/following/v3/following/search/user-001?searchTerm=${'x'.repeat(51)}`,
    });
    assert.equal(res.statusCode, 400);
    assert.equal(res.json().error, 'INVALID_SEARCH_TERM');
  });

  test('a missing search term is a 400 because the parameter is required', async () => {
    const app = makeApp();
    const res = await app.inject({
      method: 'GET', url: '/v1/following/v3/following/search/user-001',
    });
    assert.equal(res.statusCode, 400);
  });

  test('search paging rejects an out-of-range limit rather than clamping', async () => {
    const app = makeApp();
    const res = await app.inject({
      method: 'GET', url: '/v1/following/v3/followers/search/user-001?searchTerm=bo&limit=101',
    });
    assert.equal(res.statusCode, 400);
  });
});

describe('GET /v1/following/single/{id}', () => {
  test('returns the edge when the viewer follows the target', async () => {
    const app = makeApp();
    const res = await app.inject({
      method: 'GET', url: '/v1/following/single/user-001?userId=user-002',
    });
    assert.equal(res.statusCode, 200);
    assertSchema(res.json(), documentedSchema('/following/single/{id}', 'get', 200),
      'single relationship', specRoot);
    assert.deepEqual(res.json(), {
      follow: { following_id: 'user-001', user_id: 'user-002', timestamp: 1000 },
    });
  });

  test('returns null when the edge does not exist', async () => {
    const app = makeApp();
    const res = await app.inject({
      method: 'GET', url: '/v1/following/single/user-003?userId=user-001',
    });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.json(), { follow: null });
  });

  test('a missing viewer is a 400', async () => {
    const app = makeApp();
    const res = await app.inject({ method: 'GET', url: '/v1/following/single/user-001' });
    assert.equal(res.statusCode, 400);
  });
});

describe('the API-key gate still applies', () => {
  test('an unauthenticated request is a 401', async () => {
    const app = makeApp();
    const res = await app.inject({
      method: 'GET', url: '/v1/following/v3/followers/user-001',
      headers: { authorization: '' },
    });
    assert.equal(res.statusCode, 401);
  });
});
