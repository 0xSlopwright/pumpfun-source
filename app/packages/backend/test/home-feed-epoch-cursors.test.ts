import test from 'node:test';
import assert from 'node:assert/strict';
import seed from '../src/home-feed-seed.json' with { type: 'json' };
import { HomeFeedStore } from '../src/home-feed-store.js';

test('every admitted canonical timestamp can round-trip through feed cursors', () => {
  for (const createdAt of ['1969-12-31T23:59:59.000Z', '1970-01-01T00:00:00.000Z']) {
    const data = structuredClone(seed);
    data.observedAt = '1970-01-01T00:00:01.000Z';
    data.records = data.records.slice(0, 2).map(row => ({ ...row, createdAt, deleted: false, hidden: false }));
    const store = new HomeFeedStore(data);
    const filters = { chains: [], assetClasses: [] };
    const ranked = store.ranked({ filters, page: 0, pageSize: 1 });
    assert.ok(ranked.nextPageToken);
    assert.equal(store.ranked({ filters, page: 0, pageSize: 1, pageToken: ranked.nextPageToken }).coins.length, 1);
    const newest = store.newest({ filters, pageSize: 1 });
    assert.ok(newest.nextPageToken);
    assert.equal(store.newest({ filters, pageSize: 1, pageToken: newest.nextPageToken }).coins.length, 1);
    assert.equal(store.countNew({ filters, since: newest.headToken! }).newCount, 0);
  }
});
