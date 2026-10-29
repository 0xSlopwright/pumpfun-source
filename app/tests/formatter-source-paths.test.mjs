import test from 'node:test';
import assert from 'node:assert/strict';
import {formatBundles} from '../scripts/format-bundles.mjs';
import {createHash} from 'node:crypto';
import {mkdtemp,mkdir,writeFile,readFile,rm,symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
test('formatter refuses traversal, absolute and symlinked manifest source paths',async()=>{
  const temporary=await mkdtemp(path.join(tmpdir(),'formatter-paths-'));const root=path.join(temporary,'app');
  try{
    await mkdir(path.join(root,'evidence/web'),{recursive:true});const outside=path.join(temporary,'outside.js');const source='const synthetic=1;';await writeFile(outside,source);
    await mkdir(path.join(root,'evidence/web/objects'),{recursive:true});await symlink(outside,path.join(root,'evidence/web/objects/linked.js'));
    for(const sourcePath of ['../outside.js',outside,'evidence/web/objects/linked.js']){
      await writeFile(path.join(root,'evidence/web/manifest.json'),JSON.stringify({records:[{url:'https://example.invalid/source.js',status:200,path:sourcePath,sha256:createHash('sha256').update(source).digest('hex')}]}));
      await assert.rejects(formatBundles(root),/formatting failed/);
      const report=JSON.parse(await readFile(path.join(root,'recovered/pretty/manifest.json'),'utf8'));
      assert.match(report.records[0].error,/Unsafe source path/);
    }
  }finally{await rm(temporary,{recursive:true,force:true});}
});
