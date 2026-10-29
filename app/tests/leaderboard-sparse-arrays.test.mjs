import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeUpstreamResponse } from '../packages/frontend/src/app/api/leaderboard/upstream.ts';

function competition() {
  return {
    id: 'c1', slug: 'c1', kind: 'group', title: 'T', description: 'D',
    prizeCopy: 'P', phase: 'live', prizes: [], imageUrl: null,
    top: [], winners: [], minMembers: 1, maxMembers: 5,
    registrationOpensAt: null, registrationClosesAt: null,
    startsAt: '2026-10-29T00:00:00Z', endsAt: '2026-10-30T00:00:00Z',
    maxEntries: 10, entriesCount: 1, participants: 1, joinable: true, isFinal: false,
  };
}
const parse = (value) =>
  normalizeUpstreamResponse('competitions', value, { page: 1, competitionId: null });

test('leaderboard upstream arrays reject sparse arrays instead of returning holed results', () => {
  const holeAtStart = new Array(2);
  holeAtStart[1] = competition();
  assert.throws(
    () => parse({ upcoming: holeAtStart, live: [], past: [] }),
    /dense array/,
  );

  const holeAtEnd = [competition()];
  holeAtEnd.length = 2;
  assert.throws(
    () => parse({ upcoming: holeAtEnd, live: [], past: [] }),
    /dense array/,
  );

  const sparsePrizes = competition();
  sparsePrizes.prizes = new Array(1);
  assert.throws(
    () => parse({ upcoming: [sparsePrizes], live: [], past: [] }),
    /dense array/,
  );

  const sparseTop = competition();
  sparseTop.top = new Array(1);
  assert.throws(
    () => parse({ upcoming: [sparseTop], live: [], past: [] }),
    /dense array/,
  );
});

test('leaderboard upstream arrays still accept dense arrays', () => {
  const out = parse({ upcoming: [competition()], live: [], past: [] });
  assert.equal(out.upcoming.length, 1);
  assert.equal(out.upcoming[0].id, 'c1');
});
