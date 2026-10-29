import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";
import { PositionsStore, type PositionsDataset } from "../src/positions-store.js";

// A wire value may carry surrounding whitespace (`?mints=a, b` reaches the
// route as `a,%20b`). A mint never contains whitespace, so the padded spelling
// must select the same rows as the exact one, and must not defeat the
// `hlcore:` perp prefix check either.
const headers = { authorization: `Bearer pf_live_${"a".repeat(49)}` };
const now = "2026-10-28T00:00:00.000Z";

function dataset(): PositionsDataset {
  const position = (coinMint: string) => ({
    facts: {
      coinMint,
      chainId: 101,
      chain: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
      isExited: false,
      walletAddress: "synthetic-wallet-a",
      amountHeld: 5,
      pnlUsd: null,
      pnlPercentage: null,
      costBasisAmount: null,
      costBasisUsd: null,
      amountBoughtUsd: null,
      amountBought: null,
      tokenPriceUsd: null,
      updatedAt: now,
    },
  });
  return {
    schemaVersion: 1,
    dataSource: "synthetic",
    observedAt: now,
    subjects: [
      {
        kind: "person",
        id: "person-a",
        aliases: ["synthetic-wallet-a"],
        positions: [position("mint-a"), position("mint-b")],
      },
    ],
    coins: [],
    callouts: [],
    updates: [],
  };
}

const withApp = () => buildApp([], { positionsStore: new PositionsStore(dataset()) });
const get = (app: ReturnType<typeof buildApp>, mints: string) =>
  app.inject({
    method: "GET",
    url: `/v1/user-positions/person-a?updatesLimit=0&mints=${mints}`,
    headers,
  });

test("padded mint selections reach the same rows as exact ones", async (t) => {
  const app = withApp();
  t.after(() => app.close());
  const padded = await get(app, "%20mint-a");
  assert.equal(padded.statusCode, 200);
  assert.deepEqual(
    padded.json().positions.map((row: { coinMint: string }) => row.coinMint),
    ["mint-a"],
  );
  const mixed = await get(app, "mint-b,%20mint-a,%20mint-a");
  assert.equal(mixed.statusCode, 200);
  assert.deepEqual(
    mixed.json().positions.map((row: { coinMint: string }) => row.coinMint),
    ["mint-b", "mint-a"],
  );
});

test("a padded perp mint keeps the explicit deferred lane", async (t) => {
  const app = withApp();
  t.after(() => app.close());
  const response = await get(app, "%20hlcore:mainnet:BTC");
  assert.equal(response.statusCode, 501);
  assert.equal(response.json().reason, "PERPETUAL_POSITIONS_DEFERRED");
});

test("a whitespace-only selection stays an empty CSV, not an error", async (t) => {
  const app = withApp();
  t.after(() => app.close());
  const response = await get(app, "%20");
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), { positions: [] });
});
