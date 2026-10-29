import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import path from 'node:path';
test('autocrlf checkout preserves hash-bound seed JSON bytes',async(t)=>{
  const root=await mkdtemp(path.join(tmpdir(),'seed-checkout-'));t.after(()=>rm(root,{recursive:true,force:true}));
  const source='app/packages/backend/src';await mkdir(path.join(root,source),{recursive:true});
  const policy=await readFile(new URL('../packages/backend/src/.gitattributes',import.meta.url));
  await writeFile(path.join(root,source,'.gitattributes'),policy);
  const body=Buffer.from('{\n  "synthetic": true\n}\n');
  for (const name of ['posts-seed.json','users-seed.json','home-feed-seed.json']) await writeFile(path.join(root,source,name),body);
  const git=(...args)=>execFileSync('git',['-c','core.autocrlf=true','-c','core.safecrlf=false',...args],{cwd:root,stdio:'pipe'});
  git('init','--quiet');git('add','.');git('checkout-index','--all','--force','--prefix=checkout/');
  for (const name of ['posts-seed.json','users-seed.json','home-feed-seed.json']) assert.deepEqual(await readFile(path.join(root,'checkout',source,name)),body);
});
