import test from 'node:test';
import assert from 'node:assert/strict';
import {buildInventory} from '../scripts/inventory.mjs';
import {createHash} from 'node:crypto';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
test('hash-matching but invalid UTF-8 cannot become recovered source',async(t)=>{
  const root=await mkdtemp(path.join(tmpdir(),'inventory-utf8-'));t.after(()=>rm(root,{recursive:true,force:true}));
  await mkdir(path.join(root,'evidence/web/objects'),{recursive:true});
  const bytes=Buffer.concat([Buffer.from('globalThis.TURBOPACK.push(["x",1,()=>{}]);/*'),Buffer.from([255]),Buffer.from('*/')]);
  await writeFile(path.join(root,'evidence/web/objects/source.js'),bytes);
  await writeFile(path.join(root,'evidence/web/manifest.json'),JSON.stringify({records:[{url:'https://example.test/source.js',status:200,path:'evidence/web/objects/source.js',sha256:createHash('sha256').update(bytes).digest('hex')}]}));
  await assert.rejects(buildInventory(root),/Unable to read inventory source/);
});

test('valid BOM bytes retain the original UTF-16 source coordinates',async(t)=>{
  const root=await mkdtemp(path.join(tmpdir(),'inventory-bom-'));t.after(()=>rm(root,{recursive:true,force:true}));
  await mkdir(path.join(root,'evidence/web/objects'),{recursive:true});
  const source='\uFEFFglobalThis.TURBOPACK.push(["x",1,()=>{}]);';
  const bytes=Buffer.from(source);
  await writeFile(path.join(root,'evidence/web/objects/source.js'),bytes);
  await writeFile(path.join(root,'evidence/web/manifest.json'),JSON.stringify({records:[{url:'https://example.test/source.js',status:200,path:'evidence/web/objects/source.js',sha256:createHash('sha256').update(bytes).digest('hex')}]}));
  const result=await buildInventory(root);const origin=result.report.modules[0].origins[0];
  assert.equal(source.slice(origin.start,origin.end),'()=>{}');
});
