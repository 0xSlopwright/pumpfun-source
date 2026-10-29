import test from 'node:test';
import assert from 'node:assert/strict';
import {parseLeaderboardResponse} from '../packages/frontend/src/app/leaderboard/types.ts';
const source={mode:'developer-api',label:'Pump developer API',fetchedAt:'2026-10-29T00:00:00Z'};
const summary=()=>({id:'synthetic',slug:'synthetic',kind:'person',title:'Synthetic',description:'Offline fixture',prizeCopy:'',prizes:[],minMembers:0,maxMembers:0,registrationOpensAt:null,registrationClosesAt:null,startsAt:null,endsAt:null,maxEntries:1,entriesCount:0,participants:0,joinable:false,phase:'live',isFinal:false});
const entry=()=>({entryId:'e',participantId:'p',kind:'person',rank:1,pnlUsd:-1,realizedPnlUsd:-1,unrealizedPnlUsd:0,memberCount:1,membersFresh:1,struck:false,lastRefreshedAtMs:0,walletAddress:null,username:null,isVerified:false,verifiedBadgeVisible:false});
const response=()=>({ok:true,source,data:{kind:'competition-detail',competition:summary(),entries:[entry()],totalRanked:1,builtAtMs:0,isFinal:false}});
test('competition responses reject impossible counts and unknown discriminants while preserving losses',()=>{
  assert.doesNotThrow(()=>parseLeaderboardResponse(response()));
  for(const mutate of [r=>r.data.entries[0].rank=-1,r=>r.data.entries[0].memberCount=-1,r=>r.data.entries[0].membersFresh=-1,r=>r.data.entries[0].lastRefreshedAtMs=-1,r=>r.data.entries[0].kind='unknown',r=>r.data.competition.kind='unknown',r=>r.data.competition.phase='unknown',r=>r.data.competition.entriesCount=-1,r=>r.data.competition.maxEntries=-1,r=>r.data.competition.participants=-1,r=>r.data.totalRanked=-1,r=>r.data.builtAtMs=-1]){
    const value=response();mutate(value);assert.throws(()=>parseLeaderboardResponse(value),/invalid response/,mutate.toString());
  }
});
