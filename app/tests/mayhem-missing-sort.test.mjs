import test from 'node:test';
import assert from 'node:assert/strict';
import {sortMayhemCoins} from '../packages/frontend/src/app/mayhem/mayhem-data.ts';
test('missing metric values do not tie with observed zero values',()=>{
  const coins=[{mint:'missing',name:'Missing',symbol:'M'},{mint:'zero',name:'Zero',symbol:'Z',volumeUsd24h:0,marketCapUsd:0,createdTimestamp:0},{mint:'positive',name:'Positive',symbol:'P',volumeUsd24h:1,marketCapUsd:1,createdTimestamp:1}];
  for (const sort of ['volume','mcap','newest']) assert.deepEqual(sortMayhemCoins(coins,sort).map(c=>c.mint),['positive','zero','missing']);
  assert.deepEqual(coins.map(c=>c.mint),['missing','zero','positive']);
  assert.deepEqual(sortMayhemCoins(coins,'lastTraded'),coins);
});
