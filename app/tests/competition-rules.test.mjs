import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { normalizeUpstreamResponse } from "../packages/frontend/src/app/api/leaderboard/upstream.ts";
import { parseLeaderboardResponse } from "../packages/frontend/src/app/leaderboard/types.ts";
import {
  competitionRules,
  competitionRulesCopy as copy,
  COMPETITION_TERMS_URL,
} from "../packages/frontend/src/app/leaderboard/competition-rules-model.ts";

const supplied = {
  id: "synthetic-rules",
  slug: "synthetic-rules",
  kind: "group",
  title: "Synthetic rules fixture",
  description: "  Supplied scoring description  ",
  prizeCopy: " 1000 ",
  imageUrl: null,
  prizes: [
    { rankFrom: 1, rankTo: 1, amount: "1000" },
    { rankFrom: 3, rankTo: 5, amount: "10.5" },
  ],
  minMembers: 2,
  maxMembers: 10,
  maxEntries: 1000,
  entriesCount: 0,
  participants: 0,
  registrationOpensAt: "2026-10-01T00:00:00Z",
  registrationClosesAt: "2026-10-10T01:00:00Z",
  startsAt: "2026-10-11T00:00:00Z",
  endsAt: "2026-10-20T02:00:00Z",
  joinable: false,
  phase: "upcoming",
  isFinal: false,
  top: [],
  winners: [],
};

function normalize(value = supplied) {
  const data = normalizeUpstreamResponse(
    "competitions",
    { live: [], upcoming: [value], past: [] },
    { page: 1, competitionId: null },
  );
  assert.equal(data.kind, "competitions");
  const response = parseLeaderboardResponse({
    ok: true,
    data,
    source: {
      mode: "developer-api",
      label: "Pump developer API",
      fetchedAt: "synthetic",
    },
  });
  assert.equal(response.ok, true);
  return data.upcoming[0];
}

test("existing developer projection retains supplied rules facts without mutating them", () => {
  const before = structuredClone(supplied),
    result = normalize();
  assert.deepEqual(result.prizes, supplied.prizes);
  assert.equal(result.minMembers, 2);
  assert.equal(result.maxMembers, 10);
  result.prizes[0].amount = "changed output";
  assert.deepEqual(supplied, before);
});

test("group rules keep captured order, registration/end distinction and maximum paid rank", () => {
  const model = competitionRules(normalize());
  assert.equal(model.scoring, "Supplied scoring description");
  assert.equal(model.schedule.length, 2);
  assert.match(model.rules[0], /registration closes on Oct 10/);
  assert.match(model.rules[0], /every squad member/);
  assert.match(model.rules[4], /ends on Oct 20/);
  assert.equal(model.rules.length, 6);
  assert.equal(model.rules[1], copy.rule_manipulation);
  assert.equal(model.rules[2], copy.rule_profit_tracked);
  assert.match(model.rules[3], /at least 2 and no more than 10/);
  assert.equal(model.rules[5], copy.rule_squad_pro_rata);
  assert.deepEqual(model.prizes, [
    { label: "#1", amount: "$1,000" },
    { label: "#3 – #5", amount: "$10.50 each" },
  ]);
  assert.equal(model.paidRanks, "Top 5 get paid"); // max rank, not sum of tier lengths (4).
  assert.equal(model.prizeCopy, "$1,000");
  assert.equal(model.entryCap, "Limited to 1,000 entries.");
});

test("solo missing dates use undated rules, omit incomplete ranges and preserve exact web scoring fallback", () => {
  const result = normalize({
    ...supplied,
    kind: "person",
    minMembers: 1,
    maxMembers: 1,
    registrationClosesAt: null,
    endsAt: null,
    description: "  ",
    maxEntries: 1,
    prizes: [],
    prizeCopy: " ",
  });
  const model = competitionRules(result);
  assert.equal(model.rules.length, 4);
  assert.equal(model.rules[0], copy.rule_join_solo_undated);
  assert.equal(model.rules[3], copy.rule_winners_undated);
  assert.equal(model.scoring, copy.scoring_default);
  assert.match(model.scoring, /every position you hold at the start/); // not the other kolscan namespace.
  assert.deepEqual(model.schedule, []);
  assert.equal(model.entry, copy.entry_solo);
  assert.equal(model.entryCap, "Limited to 1 entry.");
  assert.equal(model.prizeCopy, null);
  assert.equal(model.paidRanks, null);
  assert.deepEqual(model.prizes, []);
});

test("display preserves supplied tier order, literal prize text and is immutable", () => {
  const input = normalize({
    ...supplied,
    maxEntries: 0,
    prizes: [
      { rankFrom: 5, rankTo: 5, amount: "Synthetic prize" },
      { rankFrom: 1, rankTo: 1, amount: "-100" },
    ],
  });
  const before = structuredClone(input),
    first = competitionRules(input);
  assert.equal(first.prizes[0].label, "#5");
  assert.equal(first.prizes[0].amount, "Synthetic prize");
  assert.equal(first.prizes[1].amount, "-100");
  assert.equal(first.entryCap, null);
  first.rules.pop();
  first.prizes[0].amount = "changed";
  assert.deepEqual(input, before);
  assert.equal(competitionRules(input).rules.length, 6);
  assert.equal(
    COMPETITION_TERMS_URL,
    "https://pump.fun/docs/app-competition-terms",
  );
});

test("new projection remains bounded and rejects malformed prize fields at both boundaries", () => {
  for (const minMembers of [null, NaN, -1]) {
    assert.throws(() => normalize({ ...supplied, minMembers }));
    const competition = { ...normalize(), minMembers };
    assert.throws(() =>
      parseLeaderboardResponse({
        ok: true,
        data: {
          kind: "competitions",
          live: [competition],
          upcoming: [],
          past: [],
        },
        source: {
          mode: "developer-api",
          label: "Pump developer API",
          fetchedAt: "synthetic",
        },
      }),
    );
  }
  for (const prizes of [
    null,
    Array.from({ length: 101 }, () => supplied.prizes[0]),
    [{ rankFrom: NaN, rankTo: 1, amount: "0" }],
    [{ rankFrom: 1, rankTo: -1, amount: "0" }],
    [{ rankFrom: 1, rankTo: 1, amount: "a".repeat(201) }],
  ]) {
    assert.throws(() => normalize({ ...supplied, prizes }));
    const competition = { ...normalize(), prizes };
    assert.throws(() =>
      parseLeaderboardResponse({
        ok: true,
        data: {
          kind: "competitions",
          live: [competition],
          upcoming: [],
          past: [],
        },
        source: {
          mode: "developer-api",
          label: "Pump developer API",
          fetchedAt: "synthetic",
        },
      }),
    );
  }
});

test("all three original factories are authenticated inert bytes at UTF-16 ranges", () => {
  const cases = [
    [
      "2fe17dced92b840b.js",
      "287cecc2183a9c0bbed6f7a7e77edca9fbbae4d4a9615d786fac4cc613e4ede5",
      119,
      117418,
      "3f494070c58a6d7f0f70279887ef648107935b765fe849de3e9ec100cec45dda",
    ],
    [
      "4da7a3f4580c8707.js",
      "d3ac051dc8989b6c57dc72c1899117ccf12cfa274a91cb707ea2c53099de37f8",
      53319,
      53628,
      "74dab3f8ec1cc9a308907b35744d1dd5da64e505faceb68dc65174634fa56126",
    ],
    [
      "c3601a995a6b7f37.js",
      "5a81dfd01983381981d1f5da23564f6426bf9ff3ff55a1265d8badf02290d231",
      30963,
      31942,
      "e606b2e7f5ab2bfd5da0abb70db2de0560f01d4d131d156719d8623614219e74",
    ],
  ];
  for (const [name, whole, start, end, factory] of cases) {
    const raw = readFileSync(
      new URL(`../evidence/web/objects/${name}`, import.meta.url),
    );
    assert.equal(createHash("sha256").update(raw).digest("hex"), whole);
    assert.equal(
      createHash("sha256")
        .update(raw.toString("utf8").slice(start, end))
        .digest("hex"),
      factory,
    );
  }
});
