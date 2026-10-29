import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from './with-api-key.js';

const LABELLED = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';

test('search-v2 rejects non-boolean includeLabelledWallets values', async () => {
  const app = buildApp();
  try {
    for (const value of ['banana', 'TRUE', 'yes', '2', '']) {
      const res = await app.inject(
        `/v1/users/search-v2?includeLabelledWallets=${encodeURIComponent(value)}`,
      );
      assert.equal(res.statusCode, 400, `value ${JSON.stringify(value)}`);
      assert.equal(res.json().error, 'INVALID_QUERY');
    }
  } finally {
    await app.close();
  }
});

test('search-v2 keeps the true/1/false/0 includeLabelledWallets spellings', async () => {
  const app = buildApp();
  try {
    const rows = async (value: string) => {
      const res = await app.inject(
        `/v1/users/search-v2?includeLabelledWallets=${value}`,
      );
      assert.equal(res.statusCode, 200, `value ${value}`);
      return res.json() as Record<string, unknown>[];
    };
    for (const value of ['true', '1']) {
      assert.ok(
        (await rows(value)).some((u) => u.address === LABELLED),
        `${value} includes the labelled wallet`,
      );
    }
    for (const value of ['false', '0']) {
      assert.ok(
        !(await rows(value)).some((u) => u.address === LABELLED),
        `${value} excludes the labelled wallet`,
      );
    }
  } finally {
    await app.close();
  }
});
