import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {PostStore} from '../src/posts-store.js';
test('post IDs cannot resolve to a different seed row than list traversal',()=>{
  const seed=JSON.parse(readFileSync(new URL('../src/posts-seed.json',import.meta.url),'utf8'));
  assert.doesNotThrow(()=>new PostStore(seed));seed.push({...seed[0],content:'Conflicting synthetic body'});
  assert.throws(()=>new PostStore(seed),/duplicate/i);
});
