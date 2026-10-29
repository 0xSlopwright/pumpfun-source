import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeUpstreamResponse } from '../packages/frontend/src/app/api/leaderboard/upstream.ts';
const parse = generatedAt => normalizeUpstreamResponse('creators',{entries:[],totalEarners:0,generatedAt},{page:1,competitionId:null});
test('leaderboard dates reject ambiguous and impossible instants', () => {
  for (const date of ['1','10/29/2026','2026-02-30T00:00:00Z','2025-02-29T00:00:00Z','2026-10-29T24:00:00Z']) assert.throws(() => parse(date),/ISO date/);
  for (const date of [null,'2024-02-29T12:34:56Z','2026-10-29T12:34:56.123456+05:30']) assert.equal(parse(date).generatedAt,date);
});
