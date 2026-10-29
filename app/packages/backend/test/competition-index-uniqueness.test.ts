import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {CompetitionStore} from '../src/competitions-store.js';
test('competition indexes reject duplicate IDs and case-insensitive slug collisions',()=>{
  const seed=()=>JSON.parse(readFileSync(new URL('../src/competitions-seed.json',import.meta.url),'utf8'));
  const ids=seed();ids[1].id=ids[0].id;assert.throws(()=>new CompetitionStore(ids),/duplicate/i);
  const slugs=seed();slugs[1].slug=slugs[0].slug.toUpperCase();assert.throws(()=>new CompetitionStore(slugs),/duplicate/i);
  assert.doesNotThrow(()=>new CompetitionStore(seed()));
});
