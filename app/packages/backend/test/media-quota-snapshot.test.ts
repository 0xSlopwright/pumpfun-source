import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {LocalMediaStore} from '../src/local-media-store.js';
test('published quota configuration remains immutable after startup validation',async()=>{
  const directory=await mkdtemp(join(tmpdir(),'media-quotas-'));
  const store=await LocalMediaStore.open(directory,{maxImages:1});
  try{
    assert.equal(Reflect.set(store.limits,'maxImages',0),false);
    assert.equal(store.limits.maxImages,1);
    const image=await store.putImage(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aK1cAAAAASUVORK5CYII=','base64'),'image/png');
    assert.ok(image.id);
  }finally{await store.close();await rm(directory,{recursive:true,force:true});}
});
