import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {LeaderboardStore} from '../src/leaderboard-store.js';
test('a wallet appears at most once in each leaderboard period',()=>{
  const seed=JSON.parse(readFileSync(new URL('../src/leaderboard-seed.json',import.meta.url),'utf8'));
  assert.doesNotThrow(()=>new LeaderboardStore(seed));seed.daily.push({...seed.daily[0]});
  assert.throws(()=>new LeaderboardStore(seed),/duplicate/i);
});
