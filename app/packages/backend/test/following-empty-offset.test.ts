import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from './with-api-key.js';

// Sibling of the posts/users empty-pagination fix: Number('') is 0, so an
// empty or whitespace-only offset must not silently read as offset 0.
// parseListPage is shared by the following list and search routes.
test('empty or whitespace-only pagination on following routes is rejected', async (t) => {
  const app = buildApp();
  t.after(() => app.close());
  const routes = [
    '/v1/following/v3/followers/user-001',
    '/v1/following/v3/following/user-001',
    '/v1/following/v3/followers/search/user-001?searchTerm=al',
    '/v1/following/v3/following/search/user-001?searchTerm=al',
  ];
  for (const route of routes) {
    const separator = route.includes('?') ? '&' : '?';
    for (const field of ['offset', 'limit']) {
      for (const value of ['', ' ']) {
        const response = await app.inject({
          method: 'GET',
          url: `${route}${separator}${field}=${encodeURIComponent(value)}`,
        });
        assert.equal(response.statusCode, 400, `${route} ${field}=${JSON.stringify(value)}`);
      }
    }
  }
});

test('explicit offset=0 on following routes still serves the first page', async (t) => {
  const app = buildApp();
  t.after(() => app.close());
  const response = await app.inject({
    method: 'GET',
    url: '/v1/following/v3/followers/user-001?offset=0',
  });
  assert.equal(response.statusCode, 200);
});
