import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildApp, type Fixture } from '../src/app.js';

const fixture = (status: number): Fixture => ({
  method: 'GET', path: `/status-${status}`, status,
  body: { recorded: status }, source: 'synthetic:final-status',
});

test('fixture registration rejects informational statuses without a final response', () => {
  for (const status of [100, 101, 102, 103, 199]) {
    assert.throws(() => buildApp([fixture(status)]), /status must be an integer from 200 through 599/);
  }
});

test('final response status boundaries remain replayable', async () => {
  const app = buildApp([fixture(200), fixture(599)]);
  try {
    for (const status of [200, 599]) {
      const response = await app.inject(`/status-${status}`);
      assert.equal(response.statusCode, status);
      assert.deepEqual(response.json(), { recorded: status });
    }
  } finally { await app.close(); }
});
