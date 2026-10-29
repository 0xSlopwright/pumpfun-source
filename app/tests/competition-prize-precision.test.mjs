import test from 'node:test';import assert from 'node:assert/strict';
import {competitionRules} from '../packages/frontend/src/app/leaderboard/competition-rules-model.ts';
const comp=amount=>({kind:'person',title:'Synthetic',description:'',prizeCopy:amount,prizes:[],minMembers:0,maxMembers:0,registrationOpensAt:null,registrationClosesAt:null,startsAt:null,endsAt:null,maxEntries:0});
test('prize display rounds decimal strings without losing their integer precision',()=>{
  assert.equal(competitionRules(comp('9007199254740993')).prizeCopy,'$9,007,199,254,740,993');
  assert.equal(competitionRules(comp('9007199254740993.125')).prizeCopy,'$9,007,199,254,740,993.13');
  assert.equal(competitionRules(comp('9.999')).prizeCopy,'$10.00');
  assert.equal(competitionRules(comp('100.000')).prizeCopy,'$100');
});
