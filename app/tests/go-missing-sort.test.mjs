import test from 'node:test';
import assert from 'node:assert/strict';
import {queryArchivedBounties} from '../packages/frontend/src/app/go/go-data.ts';
const row = (taskId, fields={}) => ({taskId,creatorAddress:'local',title:'Example',bodyText:'Example',status:'PUBLISHED',phaseAtCapture:'OPEN',createdAt:'2026-01-01T00:00:00Z',submissionCount:0,rewardLegs:[],...fields});
const snapshot={capturedAt:'local',refreshedAt:'local',sourceUrl:'local',sha256:'local',bounties:[row('unknown'),row('low',{rewardTotalUsdAtCapture:1,expiresAt:'2026-01-01T00:00:00Z'}),row('high',{rewardTotalUsdAtCapture:2,expiresAt:'2026-02-01T00:00:00Z'})]};
for (const sort of ['rewardTotalUsd','expiresAt']) for (const order of ['asc','desc']) {
  test(`${sort} ${order} keeps unavailable values last`,()=>{
    const result=queryArchivedBounties(snapshot,{q:'',status:'ALL',sort,order});
    assert.deepEqual(result.items.map(r=>r.taskId),order==='asc'?['low','high','unknown']:['high','low','unknown']);
    assert.equal(snapshot.bounties[0].taskId,'unknown');
  });
}
