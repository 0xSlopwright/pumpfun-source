import test from 'node:test';
import assert from 'node:assert/strict';
import { LeaderboardStore } from '../src/leaderboard-store.js';
import seed from '../src/leaderboard-seed.json' with { type: 'json' };

// The synthetic windows anchor on the documented 2025-10-01T00:00:00Z, which
// keeps them coherent with the seed rows' September 2025 refresh times.
const ANCHOR_SEC = Date.parse('2025-10-01T00:00:00Z') / 1000;
const SPANS = [['daily', 86_400], ['weekly', 604_800], ['monthly', 2_592_000]] as const;

test('each deterministic board uses the documented 2025-10-01 anchor', () => {
  assert.equal(ANCHOR_SEC, 1_759_276_800);
  const store = new LeaderboardStore();
  for (const [period, span] of SPANS) {
    assert.equal(store.getBoard({ period }).windowStartSec, Math.floor(ANCHOR_SEC / span) * span, period);
  }
});

test('seed rows were refreshed within 31 days before the anchor', () => {
  for (const [period] of SPANS) {
    for (const row of (seed as Record<string, Array<{ lastRefreshedAtMs: number }>>)[period]) {
      const ageSec = ANCHOR_SEC - row.lastRefreshedAtMs / 1000;
      assert.ok(ageSec >= 0 && ageSec <= 31 * 86_400, `${period} row refreshed ${ageSec}s before anchor`);
    }
  }
});
