# Opt-in local confirmed-payout leaderboard

`GET /v1/payouts/leaderboard` now has an independently implemented, opt-in read
model for supplied payout facts. Without `payoutsStore` / `PAYOUTS_FILE`, the
existing explicit fixture replay or `501 COMPATIBILITY_NOT_IMPLEMENTED` remains.
No synthetic board is enabled by default. This does not implement payout
execution, authenticated payout history, transfers, claims, wallet ownership,
sessions, a production proxy, or a native-compatible payout service.

## Declared source, not recovered backend code

- Included surface: `contracts/routes.json` `/leaderboard`; developer operation
  `GET /payouts/leaderboard`, scope `leaderboards.read`, declared origin
  `https://api.pump.fun/v1`. Website service binding remains unresolved.
- OpenAPI 0.294.0: `contracts/developer.openapi.json`, SHA-256
  `ad2fdc2bbf0b86d92e01f539ca609fff8164fcc44556bb2691378a869f73ad73`.
  Its strict success schema is checked against real in-process local responses.
- `contracts/developer-bindings.json` binds the route to factory **190491**.
  Raw source `evidence/web/objects/2b47dd0b38a1608f.js` is 507,700 bytes,
  SHA-256 `e78d2f38b06f971847c18dd05457c75afc85208135f50d6e4022a5f197e8839d`.
  URL: `https://pump.fun/_next/static/immutable/chunks/2cr_aqnw2j4n5.js`.
  Retained manifest capture: `2026-10-28T10:48:45.546100+00:00`.
  UTF-16 range `[295433, 300163)` hashes to
  `36fb23be0c2cded3fa8b2c242b0ebf06a594381c34236e2341fa6408e635118d`.
  Tests read/hash this text; they never import or execute captured code.

The declared contract establishes confirmed-only totals descending, one-based
ranks consistent across pages, a cached top-500 serving cap, the uncapped
in-window distinct-earner count, sorted paid wallets, owning-user versus
bare-wallet profiles, optional `1d`/`1w`/`1m` periods, and omitted viewer fields
on the API host. The shared payout declaration describes six-decimal atomic
USDC converted to whole USDC. None of this recovers a database or payout engine.

The newer captured factory also names `resolvedAvatarDecoration`, absent from
OpenAPI 0.294.0's `additionalProperties: false` row schema. This developer route
deliberately follows the pinned OpenAPI and omits that newer field, along with
`isViewer` and `viewerFollows`. It does not silently broaden the schema.

## Explicit local input and policies

`PayoutsDataset` in `src/payouts-store.ts` is a **local schema**, not an upstream
database schema. A caller supplies a complete eligible fact inventory, current
wallet-to-user ownership/profile facts, an observation timestamp, a nullable
generation timestamp, and optional window cuts. The producer is responsible for
eligibility, completeness, payout-class selection, and authorized local data.
The read model does not infer reward/referral inclusion, discover identities,
verify transactions, fetch profiles, or accept ingestion through HTTP.

- Only `confirmed` facts count. All six other declared lifecycle states are
  excluded from totals, paid wallets, counts, last-paid time, and earner count.
  Unknown lifecycle states fail startup instead of being silently classified.
- Each payout has one unique local ID, exact wallet identifier, positive atomic
  amount string, status, and nullable `paidAt`. Confirmed facts require an exact
  millisecond UTC timestamp no later than `observedAt`; unknown timing cannot
  masquerade as an empty window. The timestamp is a supplied local fact, not an
  inferred upstream column. Four-digit years and canonical ISO strings are the
  supported local input domain.
- Owner mappings must be unambiguous. Confirmed payouts across mapped wallets
  aggregate into one supplied user; each unmapped wallet remains a bare earner.
  Ownership and a canonical Solana wallet are assertions by the producer, not
  cryptographic verification. Canonical wallets must occur in their owner's
  mapping; they need not have a payout in the selected period. Bare rows expose
  null profile/canonical-wallet fields, `isVerified: false`, and
  `verifiedBadgeVisible: true`. Unpaid mapped wallets are absent from `wallets`.
- Atomic amounts aggregate with `BigInt`. Every earner, including those outside
  the served cap, must fit `Number.MAX_SAFE_INTEGER` atoms and round-trip through
  the numeric response at six decimal places. Unrepresentable totals reject the
  dataset rather than silently rounding. This is a conservative local supported
  range, not a claim about upstream amount limits.
- Descending confirmed totals are declared. Equal totals use a **local** exact
  code-unit ordering of tagged `["user", userId]` / `["wallet", wallet]` keys;
  no upstream tiebreak is established. Paid wallets also use exact code-unit
  sorting, with no case folding or chain/address normalization.
- Periods use supplied **local `[startAt, endAt)` cuts**, bounded by `observedAt`.
  No wall clock or guessed rolling-month duration is used. A valid requested
  period without cuts returns `501` with `PAYOUT_WINDOW_UNAVAILABLE`, never the
  all-time board. Absent `period` selects the complete supplied all-time inventory.
  Window durations, timestamp selection, and boundary equivalence to production
  are unqualified; producers must not label arbitrary cuts as verified upstream
  rolling periods.
- Rank and top-500 cap apply after aggregation/window filtering and before page
  slicing. `totalEarners` counts the whole selected board. Page defaults **0/50**
  and canonical nonnegative decimal query syntax are local policies; page sizes
  1–200 and the optional period set follow OpenAPI. Distant valid pages return an
  empty `entries` array without overflowing page arithmetic. Duplicate/unknown
  query keys and invalid values receive local `400 INVALID_QUERY`.
- `generatedAt` is preserved, never fabricated or refreshed on request. This
  immutable snapshot does not promise the declared production ~60-second cache
  freshness. Responses identify their data source and observation timestamp and
  explicitly set `X-Reconstruction-Compatibility: unqualified`.

The existing developer API-key **shape-only compatibility gate** still runs
before this route. It does not verify credentials, checksums, scopes,
revocation, rate limits or ownership. No new credential path is added. The
website alias, `/v1/payouts` history and mutations remain unimplemented.

## Optional startup configuration

Set server-only `PAYOUTS_FILE` to an explicit local UTF-8 JSON file, or inject
`new PayoutsStore(dataset)` into `buildApp([], { payoutsStore })`. The file loader
opens only a regular non-symlink file, reads at most 16 MiB, validates before
serving, and closes its descriptor in `finally`. It performs no writes/reloads
or network access. Limits are 10,000 owners, 200 mapped wallets per owner, and
100,000 payout facts. The constructed board owns its data; callers cannot mutate
it through input or returned objects. No dependency or lockfile change is needed.

Minimal deliberately empty **synthetic** inventory (not a production fixture):

```json
{
  "schemaVersion": 1,
  "dataSource": "synthetic",
  "observedAt": "2026-10-29T00:00:00.000Z",
  "generatedAt": null,
  "owners": [],
  "payouts": [],
  "windows": {}
}
```

## Verification and remaining limits

Based on main `33826889ce55aa32c34f3edf9c3601201cb3329e`; affected backend and
contract inputs were authenticated against that Git tree. Before the change,
Fastify `inject` returned `501` for the documented route. With explicit synthetic
facts, the new native handler returns a schema-checked `200`; without them it
still returns `501` or the explicit fixture.

From `app/packages/backend`:

```sh
node --import tsx --test test/payouts.test.ts
node --import tsx --test test/*.test.ts
./node_modules/.bin/tsc --noEmit
./node_modules/.bin/tsc -p tsconfig.json
./node_modules/.bin/tsc --noEmit --strict --target ES2022 --module NodeNext \
  --moduleResolution NodeNext --esModuleInterop --resolveJsonModule \
  --skipLibCheck --types node test/payouts.test.ts
```

Results: **14/14 focused tests**, **602/602 backend tests**, backend build,
strict source typecheck, and focused test-source typecheck pass. The focused
suite covers lifecycle exclusions, multi-wallet/bare profiles, precision,
window edges/reranking, missing windows, ties, >500 earners, global ranks,
strict queries, gate/default/replay boundaries, immutable ownership, malformed
inputs and bounded file handling. All requests use in-process `Fastify.inject`
and synthetic identifiers; no listener or external service is required.

The ordinary `tsx` CLI was unavailable because its IPC socket is denied in this
cloud environment; Node's supported `--import tsx` loader ran the same tests
without that CLI listener. No sandbox setting was weakened. This is not an
aggregate application/browser/evidence-gate pass, nor a production differential
test. No backend compatibility count, feature milestone, native payout parity,
security guarantee, or Slop workflow completion is claimed.

The same payout work unit also corrects the existing Creator UI's page-count
boundary: it preserves the whole-board count but offers at most the top500 rows,
keeps navigation with empty local filters, and exposes recovery for out-of-range
bookmarks. Three new pure frontend cases plus six existing adapter cases pass;
full frontend JSX typecheck passes. Thirteen leaderboard browser cases collect
(four new); they were not executed by the author, and a later maintainer review
ran all 13 on the merged tree (pass). The current frontend build is not qualified.
See `../frontend/LEADERBOARD-EVIDENCE.md` for the red/green arithmetic reproduction,
unchanged trader/competition boundary and the cloud verification limitations.
