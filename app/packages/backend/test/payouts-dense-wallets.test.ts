import test from 'node:test';
import assert from 'node:assert/strict';
import { PayoutsStore } from '../src/payouts-store.js';

test('payout owners cannot admit a missing wallet through a sparse array', () => {
  const data = {
    schemaVersion: 1, dataSource: 'synthetic', observedAt: '2026-10-29T00:00:00.000Z', generatedAt: null,
    owners: [{ userId: 'synthetic-owner', wallets: new Array(1), username: null, profileImageUrl: null,
      isVerified: false, verifiedBadgeVisible: false, twitterId: null, walletAddress: null }],
    payouts: [], windows: {},
  };
  assert.throws(() => new PayoutsStore(data), /Invalid local payouts dataset/);
  data.owners[0].wallets = ['synthetic-wallet'];
  assert.deepEqual(new PayoutsStore(data).leaderboard(), { entries: [], totalEarners: 0, generatedAt: null });
});
