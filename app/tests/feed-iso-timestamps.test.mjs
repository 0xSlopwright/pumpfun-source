import test from 'node:test';
import assert from 'node:assert/strict';
import {validateLocalFeed} from '../packages/frontend/src/components/feed/feed-data.ts';
import {readFileSync} from 'node:fs';
const users=JSON.parse(readFileSync(new URL('../packages/backend/src/users-seed.json',import.meta.url),'utf8'));
const posts=JSON.parse(readFileSync(new URL('../packages/backend/src/posts-seed.json',import.meta.url),'utf8'));
const base=posts.find(p=>p.kind==='root'&&!p.deleted&&!p.hidden);
test('post dates must identify a real calendar instant with an explicit timezone',()=>{
  for (const createdAt of ['1','01/02/2024','2024-01-01T00:00:00','2024-02-30T00:00:00Z','2024-01-01T24:00:00Z']) assert.throws(()=>validateLocalFeed([{...base,createdAt}],users),/ISO timestamp/);
});
test('leap days, fractions and explicit offsets remain valid',()=>{
  for (const createdAt of ['2024-02-29T00:00:00Z','2024-01-01T00:00:00.123Z','2024-01-01T00:00:00+09:00']) assert.equal(validateLocalFeed([{...base,createdAt}],users).posts.length,1);
});
