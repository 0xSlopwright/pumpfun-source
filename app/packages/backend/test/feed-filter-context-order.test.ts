import test from 'node:test';
import assert from 'node:assert/strict';
import {HomeFeedStore, type HomeFeedFilters} from '../src/home-feed-store.js';
test('equivalent filter sets retain a valid page cursor regardless of URL order',()=>{
  const store=new HomeFeedStore();
  const chains=[...new Set(store.snapshotRecords().map(r=>r.chain))];
  const filters:HomeFeedFilters={chains,assetClasses:['coin','stock','perp','pack']};
  const first=store.ranked({filters,page:0,pageSize:1});
  assert.ok(first.nextPageToken);
  const normal=store.ranked({filters,page:1,pageSize:1,pageToken:first.nextPageToken});
  const reversed={chains:[...chains].reverse(),assetClasses:[...filters.assetClasses].reverse()};
  assert.deepEqual(store.ranked({filters:reversed,page:1,pageSize:1,pageToken:first.nextPageToken}),normal);
  assert.deepEqual(filters.chains,chains);
  assert.throws(()=>store.ranked({filters:{...filters,minCostBasisUsd:1},page:1,pageSize:1,pageToken:first.nextPageToken}));
});
