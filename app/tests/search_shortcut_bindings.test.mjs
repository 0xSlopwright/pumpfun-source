import assert from 'node:assert/strict';
import { test } from 'node:test';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { APP_ROOT, KERNEL, UI, PROOF, verifySearchShortcuts } from '../scripts/verify-search-shortcuts.mjs';

// Static parser-only controls: do not import the UI, matcher or captured factories.
async function changedUi(t, change) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'shortcut-binding-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const proof = JSON.parse(await readFile(path.join(APP_ROOT, PROOF), 'utf8'));
  const files = new Set(['evidence/web/manifest.json', 'recovered/modules.json',
    ...proof.proofs.map((entry) => entry.source), KERNEL, UI]);
  for (const file of files) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await copyFile(path.join(APP_ROOT, file), path.join(root, file));
  }
  const file = path.join(root, UI), before = await readFile(file, 'utf8'), after = change(before);
  assert.notEqual(after, before, 'mutation must change the actual UI input');
  await writeFile(file, after);
  return root;
}

test('the merged clear-navigation ref binds without changing captured shortcut evidence', async () => {
  const actual = await verifySearchShortcuts();
  assert.deepEqual(actual, JSON.parse(await readFile(path.join(APP_ROOT, PROOF), 'utf8')));
});

test('the maintained clear ref must come from the actual React useRef(false) binding', async (t) => {
  for (const change of [
    (text) => text.replace('const pendingClear = useRef(false);', 'const pendingClear = useRef(true);'),
    (text) => text.replace('useEffect, useRef, useState', 'useEffect, useRef as alternateRef, useState'),
  ]) {
    await assert.rejects(verifySearchShortcuts(await changedUi(t, change)), /UI clear ref/);
  }
});

test('unmapped free variables in the merged effect still fail closed', async (t) => {
  const root = await changedUi(t, (text) => text.replace(
    'const onPopState = () => {\n      pendingClear.current = false;',
    'const onPopState = () => {\n      unrelatedClear.current = false;'));
  await assert.rejects(verifySearchShortcuts(root), /unresolved planner bindings: unrelatedClear/);
});

test('known clear-ref mutations still change the complete caller fingerprint', async (t) => {
  const saved = JSON.parse(await readFile(path.join(APP_ROOT, PROOF), 'utf8'));
  const root = await changedUi(t, (text) => text.replace(
    'const onPopState = () => {\n      pendingClear.current = false;',
    'const onPopState = () => {\n      pendingClear.current = true;'));
  const actual = await verifySearchShortcuts(root);
  assert.notEqual(actual.uiBindingSha256, saved.uiBindingSha256);
  assert.deepEqual({ ...actual, uiBindingSha256: saved.uiBindingSha256 }, saved);
});
