import test from 'node:test';
import assert from 'node:assert/strict';
import { createCompetitionFetchTransport } from '../reconstruction/competition-client/fetch-transport.mjs';
import { createPayoutFetchTransport } from '../reconstruction/creator-payout-client/fetch-transport.mjs';
import { createPnlFetchTransport } from '../reconstruction/pnl-leaderboard-client/fetch-transport.mjs';
for (const [name, factory, operation] of [
  ['competition', createCompetitionFetchTransport, 'GET /competitions'],
  ['payout', createPayoutFetchTransport, 'GET /payouts'],
  ['pnl', createPnlFetchTransport, 'GET /pnl-leaderboard'],
]) {
  for (const stage of ['before dispatch', 'during fetch', 'during hook', 'during JSON']) {
    if (name === 'competition' && stage === 'during hook') continue;
    test(`${name} rejects cancellation ${stage} even when injected capabilities ignore it`, async () => {
      const controller = new AbortController();
      const reason = new Error('synthetic cancellation');
      let calls = 0;
      const transport = factory({baseUrl: 'http://local.invalid', fetch: async () => {
        calls++;
        if (stage === 'during fetch') controller.abort(reason);
        return {ok: true, json: async () => {
          if (stage === 'during JSON') controller.abort(reason);
          return {rows: []};
        }};
      }});
      if (stage === 'before dispatch') controller.abort(reason);
      await assert.rejects(transport(operation, {query: {}, signal: controller.signal,
        hooks: {afterResponse: [async () => {
          if (stage === 'during hook') controller.abort(reason);
        }]}}), error => error === reason);
      assert.equal(calls, stage === 'before dispatch' ? 0 : 1);
    });
  }
}
