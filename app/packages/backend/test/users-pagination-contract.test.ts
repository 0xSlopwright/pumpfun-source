import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { buildApp } from '../src/app.js';
import { UserStore, type User } from '../src/users-store.js';
import { TEST_API_KEY } from './with-api-key.js';

const contract = JSON.parse(readFileSync(new URL('../../../contracts/developer.openapi.json', import.meta.url), 'utf8'));
const routes = ['/v1/users', '/v1/users/search-v2'];
const row: User = { address: 'synthetic-pagination-address', userId: 'synthetic-pagination-user',
  username: 'synthetic pagination', profile_image: null, bio: null, followers: 0, following: 0, x_username: null };
const headers = { authorization: `Bearer ${TEST_API_KEY}` };

test('both user pagination declarations permit exactly the safe-integer range without a positive minimum', () => {
  for (const route of routes) for (const name of ['offset', 'limit']) {
    const parameter = contract.paths[route.slice(3)].get.parameters.find((entry: { name: string }) => entry.name === name);
    assert.equal(parameter.required, false);
    assert.deepEqual(parameter.schema, { type: 'integer', minimum: Number.MIN_SAFE_INTEGER, maximum: Number.MAX_SAFE_INTEGER });
  }
});

test('no user or posts pagination declaration allows an empty value', () => {
  for (const [path, item] of Object.entries(contract.paths as Record<string, { get?: { parameters?: { name: string; allowEmptyValue?: boolean }[] } }>)) {
    if (!path.startsWith('/users') && !path.startsWith('/posts/')) continue;
    for (const parameter of item.get?.parameters ?? []) {
      if (parameter.name === 'offset' || parameter.name === 'limit') {
        assert.notEqual(parameter.allowEmptyValue, true, `${path} ${parameter.name}`);
      }
    }
  }
});

test('real HTTP user list/search rejects empty, fractional, nonfinite and unsafe pagination before reading the store', async (t) => {
  const store = new UserStore([row]);
  let reads = 0;
  const list = store.list.bind(store), search = store.search.bind(store);
  store.list = (...args) => { reads++; return list(...args); };
  store.search = (...args) => { reads++; return search(...args); };
  const app = buildApp([], { userStore: store });
  t.after(() => app.close());
  const base = await app.listen({ port: 0, host: '127.0.0.1' });
  for (const route of routes) for (const field of ['offset', 'limit']) {
    // '' and whitespace: Number('') === 0, so an empty value must not read as 0.
    for (const value of ['', ' ', '1.5', '-1.5', 'NaN', 'Infinity', '-Infinity', 'not-a-number',
      String(Number.MAX_SAFE_INTEGER + 1), String(Number.MIN_SAFE_INTEGER - 1)]) {
      const response = await fetch(`${base}${route}?${new URLSearchParams({ [field]: value })}`, { headers });
      assert.equal(response.status, 400, `${route} ${field}=${value}`);
      assert.deepEqual(await response.json(), { statusCode: 400, error: 'INVALID_QUERY' });
      assert.equal(response.headers.has('x-reconstruction-data-source'), false);
    }
  }
  assert.equal(reads, 0);
});

test('valid boundaries and negative-clamping assumptions retain existing user-read behavior', async (t) => {
  const app = buildApp([], { userStore: new UserStore([row]) });
  t.after(() => app.close());
  for (const route of routes) {
    for (const query of ['', '?offset=0&limit=1', `?offset=${Number.MIN_SAFE_INTEGER}&limit=${Number.MAX_SAFE_INTEGER}`]) {
      const response = await app.inject({ url: route + query, headers });
      assert.equal(response.statusCode, 200);
      assert.equal(response.json().length, 1);
      assert.equal(response.json()[0].address, row.address);
      assert.equal(response.headers['x-reconstruction-data-source'], 'synthetic-seed-play');
    }
    for (const query of [`?offset=${Number.MAX_SAFE_INTEGER}`, `?limit=${Number.MIN_SAFE_INTEGER}`, '?limit=0']) {
      const response = await app.inject({ url: route + query, headers });
      assert.equal(response.statusCode, 200);
      assert.deepEqual(response.json(), []);
    }
  }
});

test('existing auth and duplicate-query gates keep precedence over pagination validation', async (t) => {
  const app = buildApp([], { userStore: new UserStore([row]) });
  t.after(() => app.close());
  for (const route of routes) {
    const anonymous = await app.inject(route + '?limit=1.5');
    assert.equal(anonymous.statusCode, 401);
    assert.equal(anonymous.json().error, 'API_KEY_REQUIRED');
    const malformed = await app.inject({ url: route + '?limit=1.5', headers: { authorization: 'Bearer synthetic-malformed' } });
    assert.equal(malformed.statusCode, 401);
    assert.equal(malformed.json().error, 'API_KEY_INVALID');
    const duplicate = await app.inject({ url: route + '?offset=1.5&%6fffset=2', headers });
    assert.equal(duplicate.statusCode, 501);
    assert.equal(duplicate.json().error, 'DUPLICATE_QUERY_KEYS_UNIMPLEMENTED');
  }
});
