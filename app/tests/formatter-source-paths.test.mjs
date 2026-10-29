import test from 'node:test';
import assert from 'node:assert/strict';
import {formatBundles} from '../scripts/format-bundles.mjs';
import {createHash} from 'node:crypto';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
test('formatter refuses traversal and absolute manifest source paths',async()=>{
  const temporary=await mkdtemp(path.join(tmpdir(),'formatter-paths-'));const root=path.join(temporary,'app');
  try{
    await mkdir(path.join(root,'evidence/web'),{recursive:true});const outside=path.join(temporary,'outside.js');const source='const synthetic=1;';await writeFile(outside,source);
    for(const sourcePath of ['../outside.js',outside]){
      await writeFile(path.join(root,'evidence/web/manifest.json'),JSON.stringify({records:[{url:'https://example.invalid/source.js',status:200,path:sourcePath,sha256:createHash('sha256').update(source).digest('hex')}]}));
      await assert.rejects(formatBundles(root),/formatting failed/);
      const report=JSON.parse(await readFile(path.join(root,'recovered/pretty/manifest.json'),'utf8'));
      assert.match(report.records[0].error,/Unsafe source path/);
    }
  }finally{await rm(temporary,{recursive:true,force:true});}
});
