# Original countdown display in competition cards

Competition cards previously showed only an absolute end date. They now render
the complete captured countdown display where the documented DTO supports the
original phase/time mapping. This is an editable React component used by the
existing product, with a narrow local label/type adapter.

## Original component and supported mapping

The generator preserves the complete **590407.ee** countdown component,
**590407.Y** digit component, Date.now initializer and used **706615.v/H** helpers.
The original **eL** hero calls `H(competition)` and renders `ee({ target })` only
when a target exists. Separate **139209** DTO fields and all exact raw-source
UTF-16/UTF-8 witnesses are retained in `contract.json`.

The existing `CompetitionSummary` exposes the same `phase`, `startsAt` and `endsAt`
string/nullable fields. The local wrapper passes them unchanged into the actual
selector:

| Served phase | Original target |
| --- | --- |
| live | `endsAt`, label kind ends |
| upcoming / registration | `startsAt`, label kind starts |
| ended / unknown | no countdown |
| relevant date null or nonfinite Date.parse | no countdown |

A loading/missing DTO also renders nothing. An expired live target displays four
zero values; it does **not** infer a new phase, finalize scores or stop the server's
competition. The component retains the original floor/clamp and day/hour/minute/
second projection, initial Date.now, 1000ms effect and clearInterval cleanup.

`packages/frontend/src/components/leaderboard/original-countdown.mjs` is the full
source-adapted display, not a small model wrapper. Its original memo logic, JSX
runtime calls, DOM structure and utility classes remain intact. The generator
checks complete retained ASTs and canonical bytes against authenticated captures;
no captured runtime factory or route schema is executed. The existing pinned
React19.2.3 compiler runtime supplies the observed memo-cache boundary. The local
`.d.mts` bridge describes public adapter props; it does not claim original TS types.
Upstream material retains its authorship; names/source paths are analyst names.

The local `CompetitionCountdown.tsx` binds actual React/clock capabilities and
explicit English labels to the captured translation keys. Those label strings
are a local adapter, not recovered translation-tenant/locale identity. The
existing `CompetitionCards` changes only by an import and one child. Tailwind
adds the exact generated `.mjs` path so its used classes compile; no broad source
scan or global style rewrite is added. No rank, price, auth or scoring semantics
are invented.

## Before/after and lifecycle evidence

`reference/leaderboard-client.base.tsx` is the hash-bound **maintained local main**
file at `d3ed4863f8a52bb8dabdeea338aa11367297377c`. It is not an upstream screenshot
or a claim about original website source identity.

The standalone browser producer extracts and renders the actual `CompetitionCards`
function, its actual date/number formatters and current product CSS for both the
frozen base and changed source. The boundary replacing Next Link is an explicit
local anchor; the actual Next/router/full-page build is not inferred from it.
It uses real React19.2.3/compiler hooks, Chromium, real interval effects and a
controlled synthetic clock. No Next process or dependency install is needed.

The identical eight DTOs cover live, upcoming, registration, expired-live, ended,
unknown, missing and invalid dates. The base has zero countdowns/timers. The
changed product has exactly four supported displays; live time advances each
second, expired values remain zero and clearing cards cleans every interval.
Both 1280px desktop and375px mobile fit without horizontal overflow. A loading
state renders no cards or timers. Actual React SSR also retains labels/digit
markup without scheduling an effect.

The four [before/after images](visual/README.md) show those controlled **local
product** states. The native countdown is now visible in cards; no authenticated
upstream screenshot/visual equivalence or percentage credit is claimed.

```sh
node scripts/original-competition-countdown.mjs --check
node --test tests/original_competition_countdown.test.mjs \
  tests/original_competition_countdown_browser.test.mjs tests/original_source.test.mjs
pnpm typecheck
pnpm verify:evidence
```

The finite result is17 focused passes: five source/selector/SSR checks, one actual
product browser workflow across four viewport/variant combinations and eleven
unchanged shared-source checks. `validation.json` binds tested code, tools, logs
and screenshots. Full Next/product-browser and repository common gates are
coordinator-owned and remain explicitly pending until independently qualified.

All fixture inputs are synthetic and all browser requests are local GETs. Existing
APIs/backend/SDK/captures/lockfile/feature ledger and completion counts are
unchanged. No production service, actual user account/cookies, transaction or
media generation is used. No complete original frontend/backend, private auth,
server phase calculation, original translation provider or visual parity claim.
