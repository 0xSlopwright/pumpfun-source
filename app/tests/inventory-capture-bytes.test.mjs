import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {buildInventory} from '../scripts/inventory.mjs';
test('inventory refuses inconsistent declared sizes even when the digest matches',async()=>{
  const root=await mkdtemp(path.join(tmpdir(),'inventory-byte-count-'));
  try {
    const source='globalThis.TURBOPACK.push(["synthetic",1,(e)=>{e.s(["value",0,1]);}]);';
    await mkdir(path.join(root,'evidence/web/objects'),{recursive:true});await writeFile(path.join(root,'evidence/web/objects/source.js'),source);
    const record={url:'https://example.invalid/source.js',status:200,path:'evidence/web/objects/source.js',sha256:createHash('sha256').update(source).digest('hex')};
    for(const bytes of [source.length+1,-1,true]){
      await writeFile(path.join(root,'evidence/web/manifest.json'),JSON.stringify({records:[{...record,bytes}]}));
      await assert.rejects(buildInventory(root),/byte count/);
    }
    await writeFile(path.join(root,'evidence/web/manifest.json'),JSON.stringify({records:[{...record,bytes:Buffer.byteLength(source)}]}));
    await assert.doesNotReject(buildInventory(root));
  } finally {await rm(root,{recursive:true,force:true});}
});
