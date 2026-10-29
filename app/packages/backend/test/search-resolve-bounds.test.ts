import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from './with-api-key.js';
import { UserStore, type User } from '../src/users-store.js';

// The declared `items.maxLength` is a JSON Schema string bound, so it counts
// Unicode code points rather than UTF-16 units. The repository's shared schema
// validator (`schema-validator.ts`) and the sibling `maxLength: 64` check in
// `users-routes.ts` both count code points; this route must agree.
const personId = '11111111-1111-4111-8111-111111111111';
const person: User = {
  userId: personId, address: '11111111111111111111111111111112',
  username: 'local-person', profile_image: null, bio: null,
  followers: 0, following: 0, x_username: null, is_pump_user: false,
  last_active_at: '2026-01-01T00:00:00Z', last_username_update_timestamp: 1,
};

function appWithAccount() {
  return buildApp([], { userStore: new UserStore([person]) });
}

test('the 128-character bound counts code points, not UTF-16 units', async () => {
  const app = appWithAccount();
  try {
    // 128 code points, 192 UTF-16 units: in bounds, so the unsupported shape
    // reaches the resolver and answers 501 instead of a 400 length error.
    const astral = '\u{1F600}'.repeat(64) + 'x'.repeat(64);
    assert.equal(astral.length, 192);
    assert.equal([...astral].length, 128);
    const accepted = await app.inject('/v1/search/resolve?identifiers=' + astral);
    assert.equal(accepted.statusCode, 501);
    assert.equal(accepted.json().reason, 'SEARCH_RESOLVE_IDENTIFIER_UNAVAILABLE');

    // 129 code points (258 units) stay out of bounds.
    const tooLong = '\u{1F600}'.repeat(129);
    const rejected = await app.inject('/v1/search/resolve?identifiers=' + tooLong);
    assert.equal(rejected.statusCode, 400);
    assert.equal(rejected.json().error, 'INVALID_QUERY');

    // The count bound is independent of the string bound.
    const six = Array(6).fill(personId).join(',');
    assert.equal((await app.inject('/v1/search/resolve?identifiers=' + six)).statusCode, 400);
  } finally {
    await app.close();
  }
});
