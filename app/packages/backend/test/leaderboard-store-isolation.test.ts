import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LeaderboardStore,
  type RawLeaderboardEntry,
} from '../src/leaderboard-store.js';

function seedWithPosition(): {
  daily: RawLeaderboardEntry[];
  weekly: RawLeaderboardEntry[];
  monthly: RawLeaderboardEntry[];
} {
  const entry: RawLeaderboardEntry = {
    userId: null,
    walletAddress: 'wallet-1',
    pnlSol: 10,
    pnlUsd: 100,
    pnlPercent: 5,
    realizedPnlSol: 6,
    realizedPnlUsd: 60,
    unrealizedPnlSol: 4,
    unrealizedPnlUsd: 40,
    buySpendSol: 2,
    lastRefreshedAtMs: 1000,
    positions: [
      { mint: 'mint-1', chainId: 101, symbol: 'ORIGINAL', name: 'Original', imageUri: null },
    ],
  };
  return { daily: [entry], weekly: [], monthly: [] };
}

test('seed changes cannot corrupt leaderboard reads after construction', () => {
  const seed = seedWithPosition();
  const store = new LeaderboardStore(seed);
  const original = store.getBoard({ period: 'daily' });
  seed.daily[0].pnlUsd = 999999;
  seed.daily[0].positions[0].symbol = 'Rewritten';
  seed.daily[0].positions.push({
    mint: 'mint-2',
    chainId: 101,
    symbol: 'INJECTED',
    name: 'Injected',
    imageUri: null,
  });
  assert.deepEqual(store.getBoard({ period: 'daily' }), original);
});

test('returned top positions cannot corrupt later leaderboard reads', () => {
  const store = new LeaderboardStore(seedWithPosition());
  const original = store.getBoard({ period: 'daily' });
  const view = store.getBoard({ period: 'daily' });
  view.entries[0].topPositions[0].symbol = 'Rewritten';
  view.entries[0].topPositions.push({
    mint: 'mint-2',
    chainId: 101,
    symbol: 'INJECTED',
    name: 'Injected',
    imageUri: null,
  });
  assert.deepEqual(store.getBoard({ period: 'daily' }), original);
});

test('stores built from one seed do not leak position edits to each other', () => {
  const seed = seedWithPosition();
  const first = new LeaderboardStore(seed);
  const second = new LeaderboardStore(seed);
  const original = second.getBoard({ period: 'daily' });
  first.getBoard({ period: 'daily' }).entries[0].topPositions[0].symbol = 'Rewritten';
  assert.deepEqual(second.getBoard({ period: 'daily' }), original);
});
