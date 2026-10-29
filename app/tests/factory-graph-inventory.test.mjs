import assert from 'node:assert/strict';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { publishGraph, verifyGraph } from '../scripts/factory-graph/core.mjs';
import { fixture } from './factory-graph-fixture.mjs';

test('graph verifier rejects removed report entries and duplicate manifest entries', async () => {
  const root=await fixture();const options={routes:['/'],targetLines:4,maximumLines:100};
  try {
    await publishGraph(root,'research/graph',options);
    const path=join(root,'research/graph/MANIFEST.json');const original=JSON.parse(await readFile(path,'utf8'));
    const omitted=structuredClone(original);const removed=omitted.files.pop();
    await rm(join(root,'research/graph',removed.path));await writeFile(path,JSON.stringify(omitted));
    await assert.rejects(verifyGraph(root,'research/graph',options),/inventory/);
    await publishGraph(root,'research/graph',options);
    const duplicate=structuredClone(original);duplicate.files.push(duplicate.files[0]);await writeFile(path,JSON.stringify(duplicate));
    await assert.rejects(verifyGraph(root,'research/graph',options),/duplicate|inventory/);
  } finally { await rm(root,{recursive:true,force:true}); }
});
