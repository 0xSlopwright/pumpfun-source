import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LeaderboardStore } from '../src/leaderboard-store.js';
const fresh=()=>JSON.parse(readFileSync(new URL('../src/leaderboard-seed.json',import.meta.url),'utf8'));
const metrics=['pnlSol','pnlUsd','pnlPercent','realizedPnlSol','realizedPnlUsd','unrealizedPnlSol','unrealizedPnlUsd','buySpendSol','lastRefreshedAtMs'];
test('leaderboard seeds reject nonfinite measures before ranking or JSON serialization',()=>{
 for(const period of ['daily','weekly','monthly']) for(const metric of metrics) for(const value of [NaN,Infinity,-Infinity]){
  const seed=fresh();seed[period][0][metric]=value;
  assert.throws(()=>new LeaderboardStore(seed),/finite/i,`${period}.${metric}: ${value}`);
 }
});
test('finite losses, zero and fractional PnL retain their supplied values',()=>{
 const seed=fresh();seed.daily[0].pnlUsd=-1.25;seed.daily[0].pnlPercent=-100;seed.daily[0].pnlSol=0;
 const board=new LeaderboardStore(seed).getBoard({period:'daily'});
 const row=board.entries.find(r=>r.walletAddress===seed.daily[0].walletAddress)!;
 assert.equal(row.pnlUsd,-1.25);assert.equal(row.pnlPercent,-100);assert.equal(row.pnlSol,0);
});
