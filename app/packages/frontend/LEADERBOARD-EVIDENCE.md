# Leaderboard and competitions evidence

As of 2026-10-28, `/leaderboard` is a contract-driven reconstruction. This
document separates first-party observations from declared developer API
behavior and from local UX decisions. Captured JavaScript was inspected only as
inert text.

## OBSERVED

- The captured website client resolves its client-server origin to
  `https://frontend-api-v3.pump.fun` in
  `recovered/modules/503630-df5a12d4b761.js` and exposes the same host as
  `CLIENT` in `recovered/modules/38279-8d71db5a2d47.js`.
- Captured call sites issue read-only calls for:
  - `GET /pnl-leaderboard` with `period`, `sort` and `limit`, using
    `credentials: "include"`
    (`recovered/modules/864024-cec3cfd574ec.js`).
  - `GET /payouts/leaderboard` with zero-based `page`, `pageSize: 50` and an
    optional payout `period` (`recovered/modules/80559-50adeb832d22.js`).
  - `GET /competitions` and `GET /competitions/{idOrSlug}` through the captured
    client-server contract (`recovered/modules/190069-08b047c2cccc.js`).
- `contracts/developer-bindings.json` binds eleven `leaderboards.read`
  operations to the captured public-read contract. It also records
  `GET /competitions/{id}/entries/{entryId}/positions` as observed but not
  declared; that undeclared operation is not used by this implementation.
- Bounded, credential-free qualification requests on 2026-10-28 returned
  Cloudflare HTML `403` from the website host:

  | Request | Status | Bytes | Body SHA-256 |
  | --- | ---: | ---: | --- |
  | `/pnl-leaderboard?period=daily&sort=combined&limit=2&positionsLimit=0` | 403 | 5,729 | `be7943cf487c414b7d4651f199d5193dddfd059e8116bef82b3f3477746f4ea5` |
  | `/competitions` | 403 | 5,440 | `6ad63a225923c682c3fbd2ae729022c2022de6a345dec726ebae1e7a447597d3` |
  | `/payouts/leaderboard?page=0&pageSize=2` | 403 | 5,587 | `270d4c24c1e0c3b02c1e0aec3d1e8fa2e0100600a117371426b404a83d8c023d` |

- The equivalent three developer-host requests returned JSON `401` with
  `API_KEY_REQUIRED`. No credential, browser impersonation or Cloudflare
  workaround was used.
- A normal in-app browser check could not be completed because the browser
  access host was unavailable. This is an environment limitation, not evidence
  of endpoint compatibility.

## DECLARED

`contracts/developer.openapi.json` declares `https://api.pump.fun/v1` with a
Bearer credential and the `leaderboards.read` scope.

The implemented surface uses four of the eleven bound reads:

| Operation | Declared filters and bounds used locally |
| --- | --- |
| `GET /pnl-leaderboard` | `period`: daily/weekly/monthly; `sort`: combined/realized/unrealized; `limit=100`; `positionsLimit=0` |
| `GET /payouts/leaderboard` | zero-based `page`; `pageSize=20`; optional `period`: 1d/1w/1m |
| `GET /competitions` | viewer-independent upcoming/live/past buckets; past is limited to the latest 50 by contract |
| `GET /competitions/{idOrSlug}` | `limit=100`; `positionsLimit=0`; anonymous API reads omit viewer-relative state |

The developer contract declares `400`, `401`, `403`, `429`, `503` and default
error boundaries. The local adapter maps these into explicit unavailable,
unauthorized, rate-limited, timeout, network and invalid-response states.

Required response fields are normalized into a smaller UI model. The runtime
validator checks rank, public identity, verified-badge hints, PnL components,
confirmed USDC payouts, competition phase, participant counts, dates and
competition entry metrics before any row renders.

## INFERRED

- The captured website and declared developer API share operation names and
  contract shapes, but they use different origins and credential boundaries.
  Similar names do not prove identical deployment behavior.
- The captured PnL endpoint has a bounded `limit` but no declared offset or
  cursor. The local trader interface fetches at most 100 rows and paginates that
  validated set in the browser; it does not claim server pagination.
- Website reads include session credentials. The developer host instead
  requires an API key. Viewer-relative fields are therefore not expected from
  this anonymous/read-only reconstruction.

## LOCAL DESIGN

- The server route accepts only enumerated category/filter values and builds
  URLs against the fixed `https://api.pump.fun` origin. It cannot proxy an
  arbitrary host or path.
- `PUMPFUN_DEVELOPER_API_KEY` enables the documented developer reads. Without
  it, the page remains usable for category/filter navigation but displays an
  explicit offline boundary and zero ranking rows.
- Requests are GET-only, uncached, abortable after eight seconds and capped at
  512 KiB. Invalid or oversized JSON is rejected.
- Client requests are cancelled and sequence-guarded so an older response
  cannot replace a newer period, sort or category selection.
- Search is a URL-backed, case-insensitive filter over the currently loaded
  public identity/title fields. It is labeled “Local filter only” because no
  general ranking-search parameter is declared for these operations.
- Trader pages and competition entry pages contain ten locally paginated rows.
  Creator payout pages preserve the declared server page semantics with a
  local page size of twenty. Competition list order is preserved within the
  declared status buckets.
- The UI does not implement registration, trading, signing, wallet connection,
  deposits, withdrawals or viewer authentication.

### Local live-read setup

Set a legitimately issued read credential only in the local process
environment, then run the frontend:

```sh
PUMPFUN_DEVELOPER_API_KEY=... pnpm --filter @pump-reconstruction/frontend dev
```

The key is read only on the server and is never serialized to the browser. The
Playwright configuration forces this variable to an empty value so browser
regressions remain reproducible and cannot contact production.

## UNKNOWN

- Live response compatibility is unqualified because no developer credential
  was available and the website host rejected bounded local requests.
- Production ranking formulas, data completeness and data freshness were not
  independently reproduced.
- The original public visual states at the tested viewport and interaction
  combinations were not captured. The responsive layout is a local
  reconstruction UX correction, not a pixel-parity claim.
- Competition registration eligibility, terms acceptance and viewer-relative
  entries are intentionally unimplemented.

## Verification boundary

`tests/leaderboard.spec.ts` uses fixtures whose names and identifiers are
explicitly synthetic. Those fixtures qualify browser behavior—navigation,
filtering, sorting, pagination, errors and accessibility—but are not evidence
of live API compatibility or real rankings. Runtime contract tests live in
`tests/leaderboard-contract.test.mjs`.

### PNL response-period contract regression

The checked-in developer OpenAPI **0.294.0** declares two distinct types:

- Request `GET /pnl-leaderboard?period=...`: `daily`, `weekly`, or `monthly`.
- Response `200` → `periodType`: numeric enum `0 | 1 | 2 | 3`.

The server adapter previously accepted request strings in the response field,
rejecting all four declared numeric values. The adapter now validates the numeric
response enum without coercion. Request periods are unchanged. It does not infer
which number maps to a request period, recalculate ranks/PnL, or reorder the board.

The regression tests derive valid response values from the checked-in schema,
validate their complete synthetic payloads using the existing schema validator,
and cover invalid request strings, numeric strings, out-of-range/fractional
numbers, null/missing/wrong-type values, and non-finite numbers. They also preserve
row order, ranks, signed/fractional PnL, nullable identity, period labels, timestamps,
and input immutability. Correcting the original synthetic tests to use the declared
response type exposes the prior failure before the parser fix.

`node --test tests/leaderboard-contract.test.mjs` passes all six tests after the
fix. These are local contract regressions, not a successful production response,
a native ranking implementation, or live compatibility qualification.

### Confirmed-payout top-500 pagination boundary

Factory 190491 and the pinned OpenAPI distinguish the capped served board from
the **uncapped** `totalEarners`. The Creator UI previously calculated pages from
the latter alone: 503 earners with page size 20 advertised 26 pages although only
25 can contain rows. Its empty branch also removed navigation, including when
a local filter matched nothing on an otherwise valid page.

The UI now derives the available count as `min(totalEarners, 500)`, preserves the
whole-board earner count, and labels the top-500 limit when relevant. Valid-page
navigation remains visible with an empty filter result. An out-of-range bookmarked
page is explicitly identified and offers a first-page recovery button instead of
silently relabeling its empty response. Trader and competition pagination do not
change. Creator pagination metadata must contain nonnegative/positive safe
integers and a page size1–200 before this calculation runs; these admission bounds
are local validation, not an upstream error-contract claim.

The new synthetic test passes 503 supplied earners through `PayoutsStore`, the
existing creator normalizer, and the page-count helper. A semantics-preserving
extraction of the original arithmetic failed with 26 rather than 25 pages; the
capped calculation passes. Other tests cover empty/below-cap/capped boards,
out-of-range pages, metadata rejection and input immutability. The **3 new pure
tests plus 6 existing adapter tests pass**, and full frontend JSX typecheck passes.
Run `node --test tests/creator-pagination.test.mjs tests/leaderboard-contract.test.mjs`
from `app`; the new `.test.mjs` file is included by the existing default test glob.
Strict checked-JavaScript test-source validation also passes.

Four added browser cases cover 390/1280px last-page limits, empty-filter navigation,
and out-of-range bookmark recovery/reload. All 13 leaderboard cases collect;
**browser execution remains unrun** in the blocked cloud environment. Their
explicit synthetic interceptors abort unexpected origins or HTTP mutations.
No browser launch/download retry, production request, credential acquisition or
SDK/wallet operation was performed. The amendment's frontend build is not claimed:
the known external advisory-fetch build block has not been bypassed or retried.
These results add no visual, native, full-application or compatibility qualification.

Maintainer review after merging current main: all 13 `tests/leaderboard.spec.ts`
cases, including the four new Creator pagination cases, passed in a local
headless-Chromium Playwright run against the Next dev server; backend 855/855,
`creator-pagination`/`leaderboard-contract` 9/9 and frontend `tsc --noEmit` also
passed. This supersedes the "browser execution remains unrun" note above for
those 13 cases only; no production build or visual qualification is added.
