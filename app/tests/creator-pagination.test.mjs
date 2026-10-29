import test from "node:test";
import assert from "node:assert/strict";
import { PayoutsStore } from "../packages/backend/src/payouts-store.ts";
import { normalizeUpstreamResponse } from "../packages/frontend/src/app/api/leaderboard/upstream.ts";
import { creatorPagination } from "../packages/frontend/src/app/leaderboard/creator-pagination.ts";
import { parseLeaderboardResponse } from "../packages/frontend/src/app/leaderboard/types.ts";

test("503 confirmed earners produce only 25 available 20-row pages, without changing the whole-board count", () => {
  const store = new PayoutsStore({
    schemaVersion: 1,
    dataSource: "synthetic",
    observedAt: "2026-10-29T00:00:00.000Z",
    generatedAt: null,
    owners: [],
    windows: {},
    payouts: Array.from({ length: 503 }, (_, i) => ({
      id: `synthetic-payout-${i}`,
      wallet: `synthetic-wallet-${i}`,
      amountAtomic: String(1000 - i),
      status: "confirmed",
      paidAt: "2026-10-28T00:00:00.000Z",
    })),
  });
  const raw = store.leaderboard({ page: 24, pageSize: 20 });
  assert.equal(raw.entries.at(-1)?.rank, 500);
  assert.equal(raw.totalEarners, 503);
  const data = normalizeUpstreamResponse("creators", raw, {
    page: 25,
    competitionId: null,
  });
  assert.equal(data.kind, "creators");
  if (data.kind !== "creators") throw new Error("unexpected kind");
  assert.deepEqual(creatorPagination(data), {
    availableEarners: 500,
    totalPages: 25,
    outOfRange: false,
  });
  assert.equal(data.totalEarners, 503);
});

test("board caps do not change below 500 and empty boards still have one navigable local page", () => {
  for (const [totalEarners, pageSize, totalPages] of [
    [0, 20, 1],
    [1, 20, 1],
    [43, 20, 3],
    [499, 20, 25],
    [500, 20, 25],
    [503, 20, 25],
    [503, 200, 3],
    [503, 1, 500],
  ]) {
    const input = { totalEarners, pageSize, page: totalPages };
    const copy = { ...input };
    assert.deepEqual(creatorPagination(input), {
      availableEarners: Math.min(totalEarners, 500),
      totalPages,
      outOfRange: false,
    });
    assert.equal(
      creatorPagination({ ...input, page: totalPages + 1 }).outOfRange,
      true,
    );
    assert.deepEqual(input, copy);
  }
});

test("malformed pagination metadata is rejected before the client calculates pages", () => {
  const response = {
    ok: true,
    source: {
      mode: "developer-api",
      // Fixed adapter discriminator in this synthetic-only test envelope.
      label: "Pump developer API",
      fetchedAt: "2026-10-29T00:00:00.000Z",
    },
    data: {
      kind: "creators",
      entries: [],
      totalEarners: 503,
      generatedAt: null,
      page: 1,
      pageSize: 20,
    },
  };
  assert.notEqual(parseLeaderboardResponse(response), null);
  for (const [field, values] of Object.entries({
    totalEarners: [-1, 0.5, Infinity, Number.MAX_SAFE_INTEGER + 1],
    page: [0, -1, 1.5, Infinity],
    pageSize: [0, -1, 0.5, 201, Infinity],
  })) {
    for (const value of values)
      assert.throws(
        () =>
          parseLeaderboardResponse({
            ...response,
            data: { ...response.data, [field]: value },
          }),
        /invalid response/,
        `${field}=${value}`,
      );
  }
});
