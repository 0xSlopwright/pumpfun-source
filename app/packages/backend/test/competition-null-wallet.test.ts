import test from 'node:test';
import assert from 'node:assert/strict';
import seed from '../src/competitions-seed.json' with {type:'json'};
import { CompetitionStore, type RawCompetition } from '../src/competitions-store.js';
test('explicit null wallet survives member and highlight projections', () => {
  const comp = structuredClone(seed.find(c => c.kind === 'group')) as unknown as RawCompetition;
  assert.ok(comp);
  const entry = comp.entries.find(e => e.members?.length && e.highlightTokens?.some(t => t.members.length))!;
  assert.ok(entry);
  for (const m of entry.members!) m.walletAddress = null;
  for (const t of entry.highlightTokens!) for (const m of t.members) { m.walletAddress=null; m.pnlUsd=1; }
  entry.struck = false;
  const store = new CompetitionStore([comp]);
  assert.ok(store.getEntryDetail(comp.id, entry.entryId)!.members.every(m => m.walletAddress === null));
  assert.ok(store.getEntryHighlights(comp.id, entry.entryId)!.tokens.flatMap(t => t.members).every(m => m.walletAddress === null));
  const rows = store.getCompetitionHighlights(comp.id)!.rows.filter(r => r.entryId === entry.entryId);
  assert.ok(rows.length);
  assert.ok(rows.every(r => r.walletAddress === null));
});
