import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {formatBundles} from '../scripts/format-bundles.mjs';

test('duplicate source URLs fail before overwriting any formatting output', async t => {
  const root = await mkdtemp(path.join(tmpdir(),'format-duplicate-'));
  t.after(()=>rm(root,{recursive:true,force:true}));
  await mkdir(path.join(root,'evidence/web'),{recursive:true});
  await mkdir(path.join(root,'recovered/pretty'),{recursive:true});
  const records=[];
  for (const [index,source] of ['const first=1;', 'const second=2;'].entries()) {
    const file=`evidence/web/${index}.js`;
    await writeFile(path.join(root,file),source);
    records.push({url:'https://example.test/source.js',path:file,status:200,sha256:createHash('sha256').update(source).digest('hex')});
  }
  await writeFile(path.join(root,'evidence/web/manifest.json'),JSON.stringify({records}));
  const report=path.join(root,'recovered/pretty/manifest.json');
  await writeFile(report,'previous report');
  await assert.rejects(formatBundles(root),/Duplicate.*URL/i);
  assert.equal(await readFile(report,'utf8'),'previous report');
  // Distinct query identities still represent distinct sources, even at the same pathname.
  records[1].url+='?variant=2';
  await writeFile(path.join(root,'evidence/web/manifest.json'),JSON.stringify({records}));
  await formatBundles(root);
  const formatted=JSON.parse(await readFile(report,'utf8')).records;
  assert.equal(new Set(formatted.map(row=>row.output)).size,2);
});
