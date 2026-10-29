import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildApp } from './with-api-key.js';
import { buildApp as unkeyedApp } from '../src/app.js';
import { LeaderboardStore, type RawLeaderboardEntry } from '../src/leaderboard-store.js';
import { UserStore, SYNTHETIC_SEED, DATA_SOURCE } from '../src/users-store.js';
import { assertSchema, type SchemaRoot } from '../src/schema-validator.js';

const spec = JSON.parse(readFileSync(new URL('../../../contracts/developer.openapi.json', import.meta.url), 'utf8'));
const schema = spec.paths['/profiles/verified'].get.responses['200'].content['application/json'].schema;
const route = '/v1/profiles/verified';

function materialization() {
  const users = Array.from({ length: 12 }, (_, index) => ({
    ...structuredClone(SYNTHETIC_SEED[0]),
    userId: `leader-${index}`,
    address: `wallet-${index}`,
    canonical_svm_wallet: `wallet-${index}`,
    username: `Leader ${index}`,
    followers: index,
  }));
  const userStore = new UserStore(users, ['leader-1']);
  const daily: RawLeaderboardEntry[] = users.map((user, index) => ({
    userId: user.userId,
    walletAddress: user.address,
    pnlSol: 100 - index,
    pnlUsd: 100 - index,
    pnlPercent: index,
    realizedPnlSol: index,
    realizedPnlUsd: index,
    unrealizedPnlSol: 100 - 2 * index,
    unrealizedPnlUsd: 100 - 2 * index,
    buySpendSol: 10,
    lastRefreshedAtMs: 1759276800000,
    positions: [],
  })).reverse();
  const seed = { daily, weekly: daily.map(row => ({ ...row, pnlUsd: -row.pnlUsd })), monthly: [] };
  return { users, userStore, seed };
}

test('GET verified serves full daily leader profiles, including unverified leaders', async () => {
  const app = buildApp();
  try {
    const result = await app.inject(route);
    assert.equal(result.statusCode, 200);
    assert.equal(result.headers['x-reconstruction-data-source'], DATA_SOURCE);
    const profiles = result.json();
    assertSchema(profiles, schema, 'daily leader profiles', spec as SchemaRoot);
    assert.deepEqual(profiles.map((profile: { userId: string }) => profile.userId), ['user-002', 'user-001']);
    assert.deepEqual(profiles.map((profile: { isVerified: boolean }) => profile.isVerified), [false, true]);
    assert.ok(Object.hasOwn(profiles[0], 'generatedMedia'));
    assert.ok(!Object.hasOwn(profiles[0], 'pnlUsd'));
  } finally { await app.close(); }
});

test('leader selection uses the daily combined board, caps at ten and owns returned profiles', async () => {
  const { seed, userStore } = materialization();
  const leaderboardStore = new LeaderboardStore(seed, userStore);
  // A different app user store must not replace the leaderboard's own identity map.
  const app = buildApp([], { leaderboardStore, userStore: new UserStore([]) });
  try {
    const result = await app.inject(route);
    assert.equal(result.statusCode, 200);
    const profiles = result.json();
    assertSchema(profiles, schema, 'ten leaders', spec as SchemaRoot);
    assert.deepEqual(profiles.map((profile: { userId: string }) => profile.userId),
      Array.from({ length: 10 }, (_, index) => `leader-${index}`));
    assert.equal(profiles[0].username, 'Leader 0');
    assert.equal(profiles[0].walletAddress, 'wallet-0');
    assert.equal(profiles[1].isVerified, true);
    const projected = leaderboardStore.getDailyLeaderProfiles();
    projected[0].socials[0].username = 'mutated';
    const repeated = await app.inject(route);
    assert.notEqual(repeated.json()[0].socials[0].username, 'mutated');
  } finally { await app.close(); }
});

test('an empty daily board serves an empty profile list', async () => {
  const app = buildApp([], { leaderboardStore: new LeaderboardStore({ daily: [], weekly: [], monthly: [] }) });
  try {
    const result = await app.inject(route);
    assert.equal(result.statusCode, 200);
    assert.deepEqual(result.json(), []);
  } finally { await app.close(); }
});

test('unresolved or repeated selected profile identities remain explicitly unavailable', async () => {
  for (const mutation of ['null', 'missing', 'duplicate'] as const) {
    const { seed, userStore } = materialization();
    const first = seed.daily.find(row => row.userId === 'leader-0')!;
    first.userId = mutation === 'null' ? null : mutation === 'missing' ? 'not-in-users' : 'leader-1';
    const app = buildApp([], { leaderboardStore: new LeaderboardStore(seed, userStore) });
    try {
      const result = await app.inject(route);
      assert.equal(result.statusCode, 501);
      assert.equal(result.json().reason, 'DAILY_LEADER_PROFILES_UNAVAILABLE');
      assert.equal(result.headers['x-reconstruction-data-source'], undefined);
    } finally { await app.close(); }
  }
});

test('new GET keeps the developer key gate, duplicate-query policy and existing POST', async () => {
  const raw = unkeyedApp([]);
  const app = buildApp();
  try {
    assert.equal((await raw.inject(route)).statusCode, 401);
    const duplicate = await app.inject(`${route}?sort=a&%73ort=b`);
    assert.equal(duplicate.statusCode, 501);
    assert.equal(duplicate.json().error, 'DUPLICATE_QUERY_KEYS_UNIMPLEMENTED');
    const post = await app.inject({ method: 'POST', url: route, payload: { ids: ['user-001', 'user-002'] } });
    assert.equal(post.statusCode, 201);
    assert.deepEqual(post.json(), { 'user-001': true, 'user-002': false });
  } finally { await app.close(); await raw.close(); }
});
