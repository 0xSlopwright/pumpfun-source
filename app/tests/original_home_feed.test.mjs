import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { extractHomeFeed } from '../scripts/original-contracts/home-feed.mjs';
import { openCorpus, sha256 } from '../scripts/original-contracts/source.mjs';
import { validateDeclared } from '../scripts/original-contracts/validate.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const artifact = await extractHomeFeed(root);
const corpus = await openCorpus(root);

test('published Home-feed artifact reproduces from authenticated frozen inputs', async () => {
  assert.equal(await fs.readFile(path.join(root, 'contracts/original-home-feed.json'), 'utf8'), `${JSON.stringify(artifact, null, 2)}\n`);
  assert.deepEqual(Object.keys(artifact.operations), ['GET /home-feed', 'GET /home-feed/new', 'GET /home-feed/new/count']);
});

test('both actual consumer variants bind functions and client imports, not only route strings', () => {
  for (const operation of artifact.scope) {
    const route = artifact.operations[operation];
    assert.equal(route.serviceOrigin, 'https://frontend-api-v3.pump.fun');
    assert.equal(route.consumers.length, 2);
    assert.notEqual(route.consumers[0].factory, route.consumers[1].factory);
    for (const consumer of route.consumers) {
      const fragment = artifact.fragments.find((entry) => `${entry.source}:${entry.utf16.join(':')}` === consumer.functionFragment);
      assert.ok(fragment.text.startsWith(`async function ${consumer.function}(`));
      assert.ok(fragment.text.includes(JSON.stringify(operation)));
      assert.ok(fragment.text.includes('credentials:"include"'));
      assert.ok(artifact.fragments.some((entry) => `${entry.source}:${entry.utf16.join(':')}` === consumer.clientImport));
    }
  }
});

test('each verbatim fragment and byte/code-unit boundary is independently bound to original capture', async () => {
  assert.ok(artifact.fragments.length > 70);
  for (const record of artifact.fragments) {
    const capture = await corpus.capture(record.source);
    const bytes = capture.bytes.subarray(...record.utf8);
    assert.equal(sha256(bytes), record.sha256);
    assert.equal(sha256(Buffer.from(capture.text.slice(...record.utf16))), record.sha256);
    if ('text' in record) assert.equal(record.text, bytes.toString('utf8'));
  }
});

test('keyed-host error declarations preserve status/code/data while count remains unwrapped', () => {
  const doc = artifact.declarations;
  const errors = doc['x-public-read-error-schemas'];
  assert.deepEqual(Object.keys(errors), ['400', '401', '403', '429']);
  assert.equal(validateDeclared(doc, errors[403], { error: 'API_SCOPE_FORBIDDEN', message: '', requiredScope: 'content.read' }).success, true);
  assert.equal(validateDeclared(doc, errors[403], { error: 'API_SCOPE_FORBIDDEN', message: '' }).success, false);
  assert.equal(validateDeclared(doc, errors[429], { error: 'API_KEY_RATE_LIMITED', message: '', retryAfterMs: 1, limit: 0, window: 'auth' }).success, true);
  assert.equal(validateDeclared(doc, errors[429], { error: 'API_KEY_RATE_LIMITED', message: '', retryAfterMs: -1, limit: 0, window: 'auth' }).success, false);
  assert.equal(artifact.operations['GET /home-feed'].declared.emittedCodes.length, 9);
  assert.deepEqual(artifact.operations['GET /home-feed/new/count'].declared.emittedCodes, []);
  assert.match(artifact.transport.nonOk, /plain Error/);
});

async function frozenCopy(t) {
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'original-home-feed-'));
  t.after(() => fs.rm(temporary, { recursive: true, force: true }));
  for (const relative of ['evidence/web/manifest.json', 'recovered/modules.json', 'evidence/web/objects/3740fc4e7a24596d.js']) {
    const target = path.join(temporary, relative);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(path.join(root, relative), target);
  }
  return temporary;
}

test('changed actual capture bytes fail closed before any extraction is published', async (t) => {
  const temporary = await frozenCopy(t);
  const target = path.join(temporary, 'evidence/web/objects/3740fc4e7a24596d.js');
  const bytes = await fs.readFile(target);
  bytes[1500] ^= 1;
  await fs.writeFile(target, bytes);
  await assert.rejects(extractHomeFeed(temporary), /capture authentication failed/);
});

test('changed real inventory provenance requires explicit frozen-input review', async (t) => {
  const temporary = await frozenCopy(t);
  const target = path.join(temporary, 'recovered/modules.json');
  const index = JSON.parse(await fs.readFile(target));
  const consumer = index.modules.find((entry) => entry.ids.includes(735821));
  consumer.origins[0].start++;
  await fs.writeFile(target, JSON.stringify(index));
  await assert.rejects(extractHomeFeed(temporary), /unreviewed frozen input: inventorySha256/);
});
