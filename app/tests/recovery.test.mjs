import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { formatBundles } from '../scripts/format-bundles.mjs';
import { spawnSync } from 'node:child_process';
const root=new URL('../',import.meta.url);

test('bundle formatting signals incomplete recovery while retaining per-source diagnostics',async()=>{
 for(const failure of ['malformed','missing']){
  const directory=await mkdtemp(path.join(tmpdir(),'pump-format-failure-'));
  try {
   await mkdir(path.join(directory,'evidence/web'),{recursive:true});
   await writeFile(path.join(directory,'evidence/web/good.js'),'const good = 1;');
   if(failure==='malformed')await writeFile(path.join(directory,'evidence/web/bad.js'),'const broken = ;');
   const records=['bad','good'].map(name=>({url:`https://example.invalid/${name}.js`,path:`evidence/web/${name}.js`,status:200,sha256:createHash('sha256').update(name==='good'?'const good = 1;':'const broken = ;').digest('hex')}));
   await writeFile(path.join(directory,'evidence/web/manifest.json'),JSON.stringify({records}));
   const entry=new URL('../scripts/format-bundles.mjs',import.meta.url).href;
   const result=spawnSync(process.execPath,['--input-type=module','-e',`import {formatBundles} from ${JSON.stringify(entry)}; await formatBundles(process.argv[1]);`,directory],{encoding:'utf8'});
   assert.ifError(result.error);
   assert.notEqual(result.status,0,`${failure} source incorrectly reported successful recovery`);
   const report=JSON.parse(await readFile(path.join(directory,'recovered/pretty/manifest.json'),'utf8'));
   assert.deepEqual(report.records.map(record=>record.status),['failed','formatted']);
   assert.ok(report.records[0].error);
   assert.match(await readFile(path.join(directory,report.records[1].output),'utf8'),/const good = 1;/);
  }finally{await rm(directory,{recursive:true,force:true});}
 }
});

test('formatting selects script paths and retains distinct query versions',async()=>{
 const directory=await mkdtemp(path.join(tmpdir(),'pump-format-query-'));
 try {
  await mkdir(path.join(directory,'evidence/web'),{recursive:true});
  const urls=['https://example.invalid/shared.js?v=1','https://example.invalid/shared.js?v=2#fragment','https://example.invalid/shared.js#fragment','https://example.invalid/page?next=shared.js'];
  const records=[];
  for(const [index,url] of urls.entries()){
   const source=index===3?'<!doctype html>':`const version = ${index};`;
   const sourcePath=`evidence/web/source-${index}`;
   await writeFile(path.join(directory,sourcePath),source);
   records.push({url,path:sourcePath,status:200,sha256:createHash('sha256').update(source).digest('hex')});
  }
  await writeFile(path.join(directory,'evidence/web/manifest.json'),JSON.stringify({records}));
  await formatBundles(directory);
  const report=JSON.parse(await readFile(path.join(directory,'recovered/pretty/manifest.json'),'utf8'));
  assert.deepEqual(report.records.map(record=>record.url),urls.slice(0,3));
  assert.equal(new Set(report.records.map(record=>record.output)).size,3);
  for(const [index,record] of report.records.entries())assert.match(await readFile(path.join(directory,record.output),'utf8'),new RegExp(`const version = ${index};`));
 }finally{await rm(directory,{recursive:true,force:true});}
});

test('formatting retains distinct bundles with the same basename',async()=>{
 const directory=await mkdtemp(path.join(tmpdir(),'pump-format-'));
 try {
  await mkdir(path.join(directory,'evidence/web'),{recursive:true});
  const records=[];
  for(const [index,url] of ['https://pump.fun/a/shared.js','https://pump.fun/b/shared.js'].entries()){
   const source=`const bundle${index}=${index};`;
   const sourcePath=`evidence/web/source-${index}.js`;
   await writeFile(path.join(directory,sourcePath),source);
   records.push({url,path:sourcePath,status:200,sha256:createHash('sha256').update(source).digest('hex')});
  }
  await writeFile(path.join(directory,'evidence/web/manifest.json'),JSON.stringify({records}));
  await formatBundles(directory);
  const report=JSON.parse(await readFile(path.join(directory,'recovered/pretty/manifest.json'),'utf8'));
  assert.equal(report.records.length,2);
  assert.equal(new Set(report.records.map(record=>record.output)).size,2);
  for(const [index,record] of report.records.entries()){
   assert.equal(record.status,'formatted');
   assert.match(await readFile(path.join(directory,record.output),'utf8'),new RegExp(`const bundle${index} = ${index};`));
  }
 } finally { await rm(directory,{recursive:true,force:true}); }
});
test('recovered factory provenance resolves to exact captured source ranges',()=>{
 const report=JSON.parse(readFileSync(new URL('recovered/modules.json',root),'utf8'));
 const sources=new Map();
 assert.equal(report.failures.length,0);
 for(const module of report.modules){
  for(const origin of module.origins){
   if(!sources.has(origin.source))sources.set(origin.source,readFileSync(new URL(origin.source,root),'utf8'));
   const factory=sources.get(origin.source).slice(origin.start,origin.end);
   assert.equal(createHash('sha256').update(factory).digest('hex'),module.sha256);
  }
 }
});
