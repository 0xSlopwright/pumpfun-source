import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildMayhemQuery,
  MayhemDataError,
  mayhemStateParameter,
  normalizeMayhemFilter,
  normalizeMayhemSort,
  parseMayhemResponse,
  sortMayhemCoins,
  type MayhemCoin,
} from "../packages/frontend/src/app/mayhem/mayhem-data.ts";

const coins: MayhemCoin[] = [
  {
    mint: "mint-a",
    name: "A",
    symbol: "AA",
    state: "active",
    mode: "auto",
    createdTimestamp: 100,
    lastTradeTimestamp: 900,
    marketCapUsd: 10,
    volumeUsd24h: 20,
  },
  {
    mint: "mint-b",
    name: "B",
    symbol: "BB",
    state: "paused",
    mode: "manual",
    createdTimestamp: 300,
    lastTradeTimestamp: 100,
    marketCapUsd: 30,
    volumeUsd24h: 10,
  },
  { mint: "mint-c", name: "C", symbol: "CC", createdTimestamp: 300 },
];

test("maps the four captured Mayhem filters exactly", () => {
  assert.equal(mayhemStateParameter("all"), undefined);
  assert.equal(mayhemStateParameter("active"), "active");
  assert.equal(mayhemStateParameter("paused"), "paused");
  assert.equal(mayhemStateParameter("ended"), "completed");
  assert.equal(normalizeMayhemFilter("invented"), "all");
  assert.equal(normalizeMayhemSort("invented"), "lastTraded");
});

test("builds the bounded captured read-only query", () => {
  assert.equal(
    buildMayhemQuery({ filter: "all" }).toString(),
    "limit=60&offset=0&includeNsfw=false",
  );
  assert.equal(
    buildMayhemQuery({ filter: "ended", limit: 1, offset: 1000 }).toString(),
    "limit=1&offset=1000&includeNsfw=false&mayhemState=completed",
  );
  for (const arguments_ of [
    { filter: "all" as const, limit: 61 },
    { filter: "all" as const, limit: 0 },
    { filter: "all" as const, offset: 1001 },
    { filter: "all" as const, offset: -1 },
  ]) {
    assert.throws(() => buildMayhemQuery(arguments_), MayhemDataError);
  }
});

test("validates identity, enums, numbers and duplicate mints", () => {
  const parsed = parseMayhemResponse({ source: "synthetic-test", coins });
  assert.equal(parsed.coins.length, 3);
  for (const invalid of [
    null,
    { source: "live", coins },
    {
      source: "synthetic-test",
      coins: [{ name: "Missing mint", symbol: "X" }],
    },
    {
      source: "synthetic-test",
      coins: [{ mint: "m", name: "N", symbol: "S", marketCapUsd: Number.NaN }],
    },
    {
      source: "synthetic-test",
      coins: [{ mint: "m", name: "N", symbol: "S", state: "ended" }],
    },
    {
      source: "synthetic-test",
      coins: [
        { mint: "m", name: "N", symbol: "S" },
        { mint: "m", name: "Other", symbol: "O" },
      ],
    },
  ]) {
    assert.throws(() => parseMayhemResponse(invalid), MayhemDataError);
  }
});

test("implements all captured client sorting modes with stable missing-value ties", () => {
  assert.deepEqual(
    sortMayhemCoins(coins, "lastTraded").map((coin) => coin.mint),
    ["mint-a", "mint-b", "mint-c"],
  );
  assert.deepEqual(
    sortMayhemCoins(coins, "volume").map((coin) => coin.mint),
    ["mint-a", "mint-b", "mint-c"],
  );
  assert.deepEqual(
    sortMayhemCoins(coins, "mcap").map((coin) => coin.mint),
    ["mint-b", "mint-a", "mint-c"],
  );
  assert.deepEqual(
    sortMayhemCoins(coins, "newest").map((coin) => coin.mint),
    ["mint-b", "mint-c", "mint-a"],
  );
});
