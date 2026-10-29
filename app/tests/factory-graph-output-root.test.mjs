import assert from 'node:assert/strict';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { publishGraph, verifyGraph } from '../scripts/factory-graph/core.mjs';
import { fixture } from './factory-graph-fixture.mjs';

test('graph publishing refuses to replace its own input corpus root', async () => {
  const root=await fixture();
  try {
    const original=await readFile(join(root,'recovered/modules.json'),'utf8');
    await assert.rejects(publishGraph(root,'.',{routes:['/'],targetLines:4,maximumLines:100,onPublishStage(){throw new Error('unexpected publication');}}),/output.*root/);
    assert.equal(await readFile(join(root,'recovered/modules.json'),'utf8'),original);
  } finally { await rm(root,{recursive:true,force:true}); }
});
