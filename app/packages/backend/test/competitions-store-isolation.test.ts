import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CompetitionStore,
  type RawCompetition,
} from '../src/competitions-store.js';

const COMP_ID = '11111111-1111-4000-8000-000000000001';
const ENTRY_ID = '22222222-2222-4000-8000-000000000001';

function seedWithPositions(): RawCompetition[] {
  return [
    {
      id: COMP_ID,
      slug: 'isolation-arena',
      kind: 'person',
      title: 'Isolation Arena',
      description: 'Seed for store isolation',
      prizeCopy: 'Winner takes all',
      imageUrl: null,
      prizes: [{ rankFrom: 1, rankTo: 1, amount: '1000' }],
      registrationOpensAt: '2024-01-01T00:00:00.000Z',
      registrationClosesAt: '2024-02-01T00:00:00.000Z',
      startsAt: '2024-01-01T00:00:00.000Z',
      endsAt: '2024-02-01T00:00:00.000Z',
      minMembers: 1,
      maxMembers: 1,
      maxEntries: 10,
      phase: 'live',
      isFinal: false,
      joinable: true,
      entries: [
        {
          entryId: ENTRY_ID,
          participantId: 'nobody',
          registeredAt: '2024-01-01T00:00:00.000Z',
          struck: false,
          pnlUsd: 100,
          realizedPnlUsd: 60,
          unrealizedPnlUsd: 40,
          buySpendSol: 10,
          membersFresh: 0,
          lastRefreshedAtMs: 1000,
          positions: [
            {
              mint: 'mint-1',
              chainId: 101,
              symbol: 'ORIGINAL',
              name: 'Original',
              imageUri: null,
            },
          ],
        },
      ],
    },
  ];
}

test('seed changes cannot corrupt competition reads after construction', () => {
  const seed = seedWithPositions();
  const store = new CompetitionStore(seed);
  const original = structuredClone(store.getByIdOrSlug(COMP_ID));
  seed[0].title = 'Rewritten';
  seed[0].prizes[0].amount = '999999';
  seed[0].prizes.push({ rankFrom: 2, rankTo: 2, amount: '1' });
  seed[0].entries[0].positions![0].symbol = 'Rewritten';
  assert.deepEqual(store.getByIdOrSlug(COMP_ID), original);
});

test('mutating a returned view cannot corrupt later reads', () => {
  const store = new CompetitionStore(seedWithPositions());
  const first = store.getByIdOrSlug(COMP_ID)!;
  const original = structuredClone(first);
  first.competition.title = 'Rewritten';
  first.competition.prizes[0].amount = '999999';
  first.competition.prizes.push({ rankFrom: 2, rankTo: 2, amount: '1' });
  first.leaderboard.entries[0].topPositions[0].symbol = 'Injected';
  first.leaderboard.entries[0].topPositions.push({
    mint: 'mint-injected',
    chainId: 101,
    symbol: 'INJECTED',
    name: 'Injected',
    imageUri: null,
  });
  assert.deepEqual(store.getByIdOrSlug(COMP_ID), original);
});

test('stores built from the default seed do not share mutable competition rows', () => {
  const first = new CompetitionStore();
  const second = new CompetitionStore();
  const id = '11111111-1111-4000-8000-000000000002';
  const original = structuredClone(second.getByIdOrSlug(id));
  const row = first.getByIdOrSlug(id)!;
  row.competition.prizes.push({ rankFrom: 9, rankTo: 9, amount: '1' });
  row.leaderboard.entries[0].topPositions[0].symbol = 'Injected';
  assert.deepEqual(second.getByIdOrSlug(id), original);
});
