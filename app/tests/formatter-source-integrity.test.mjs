import test from 'node:test';
import assert from 'node:assert/strict';
import {formatBundles} from '../scripts/format-bundles.mjs';
import {createHash} from 'node:crypto';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
test('changed valid JavaScript cannot be published under a retained capture digest',async(t)=>{
  const root=await mkdtemp(path.join(tmpdir(),'format-integrity-'));t.after(()=>rm(root,{recursive:true,force:true}));
  await mkdir(path.join(root,'evidence/web'),{recursive:true});
  await writeFile(path.join(root,'evidence/web/source.js'),'const changed = 2;');
  await writeFile(path.join(root,'evidence/web/manifest.json'),JSON.stringify({records:[{url:'https://example.test/source.js',status:200,path:'evidence/web/source.js',sha256:createHash('sha256').update('const original = 1;').digest('hex')}]}));
  await assert.rejects(formatBundles(root),/formatting failed/);
  const report=JSON.parse(await readFile(path.join(root,'recovered/pretty/manifest.json'),'utf8'));
  assert.equal(report.records[0].status,'failed');assert.match(report.records[0].error,/SHA-256 mismatch/);
});
