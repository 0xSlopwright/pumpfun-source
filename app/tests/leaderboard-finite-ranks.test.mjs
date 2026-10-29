import test from 'node:test';
import assert from 'node:assert/strict';
import {parseLeaderboardResponse} from '../packages/frontend/src/app/leaderboard/types.ts';
const source={mode:'developer-api',label:'Pump developer API',fetchedAt:'2026-10-29T00:00:00Z'};
const trader={rank:1,walletAddress:'local',username:null,userId:null,xUsername:null,isVerified:false,verifiedBadgeVisible:false,pnlUsd:0,pnlPercent:0,realizedPnlUsd:0,unrealizedPnlUsd:0,buySpendSol:0,positionsCount:0,lastRefreshedAtMs:0};
const creator={rank:1,userId:null,username:null,walletAddress:null,wallets:['local'],isVerified:false,verifiedBadgeVisible:false,totalPaidUsdc:0,payoutCount:0,lastPaidAt:null};
for (const kind of ['traders','creators']) test(`${kind} cannot display invalid ranks`,()=>{
  const row=kind==='traders'?trader:creator;
  const data=kind==='traders'?{kind,periodLabel:'Daily',windowStartSec:0}:{kind,totalEarners:1,generatedAt:null,page:1,pageSize:20};
  assert.doesNotThrow(()=>parseLeaderboardResponse({ok:true,source,data:{...data,entries:[row]}}));
  for (const rank of [NaN,Infinity,-Infinity,-1]) assert.throws(()=>parseLeaderboardResponse({ok:true,source,data:{...data,entries:[{...row,rank}]}}),/invalid response/);
});
