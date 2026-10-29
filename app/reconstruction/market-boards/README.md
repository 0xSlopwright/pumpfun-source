# Captured Explore board request boundary

This reconstructs a distinct non-search discovery path: Explore's **movers** and
**trending** boards. It does not duplicate the resolver/coin-search operations in
[PR #684](https://github.com/lalalune/pumpfun-source/pull/684), the archived one-coin
Explore UI, or [PR #657](https://github.com/lalalune/pumpfun-source/pull/657)'s broad
static graph. No ranking engine or website backend endpoint is added.

## Original-backed findings

The retained `/explore` HTML directly references the selected script objects.
Its initial coin hook `379705` (`642cafc9…`, `dba17a…`) uses board helper `583448`
(`756b5cd5…`, `3740fc…`) for featured/movers and trending discovery. That helper
calls `50969.f`, which selects either `/api/indexer` or `503630.U`. The captured
`67734.f` predicate is always false, and `503630.U` returns
`https://advanced-indexer.pump.fun`.

**The board client does not use `frontend-api-v3.pump.fun`.** That host belongs to
other website contract-client calls; transferring it to the board path would be
incorrect. The captured hook uses direct `fetch` with `credentials: "include"`,
JSON Content-Type and an AbortSignal. It rejects non-OK responses, reads JSON,
and delegates to `503774.q`. It does not add the contract client's WEB/web headers
or JSON Accept header on this path.

[`../../contracts/market-board-bindings.json`](../../contracts/market-board-bindings.json)
binds four immutable source objects, ten selected factory identities, ten import
edges and fourteen exported expressions. It records exact object URLs, lengths,
SHA-256 values and UTF-16 half-open ranges. The verifier checks actual Babel AST
registrations, imports, exports, inventory origins and initial HTML script
references. It statically reads the origin and exported caps; it never evaluates
captured JavaScript. Human interpretation of the authenticated expressions is
still part of reconstruction, not proof of running backend behavior.

Selected initial-script provenance is **not an active runtime winner claim**.
Other indexed variants/lazy contexts remain possible; the global module cache is
not simulated. No complete graph or catalog completeness is claimed.

## Maintained adapter

`request.mjs` is a small, usable, no-network request planner. All actual network
access and any dataset remain the caller's responsibility. An absolute HTTP(S)
base URL is required; there is no default production destination:

```js
import { buildBoardRequest } from "./request.mjs";

const plan = buildBoardRequest(
  { board: "trending", limit: 300, chain: "solana", window: "4h" },
  { baseUrl: "http://127.0.0.1:3001" },
);
// plan.url ends in /boards/trending?...&limit=150&...&ranking=social&window=4h&hot=label
// No request is sent. No matching local backend endpoint is provided here.
```

Preserved client behavior:

- Default movers board; web tier/platform; TRENDING versus WEB surface.
- An upper cap of 150 (the Explore caller supplies 300), **not** server-side
  validation. Zero, negative/fractional numbers and `NaN` are not inventedly
  rejected by the encoder.
- Conditional user/session/device/country fields; zero offset/session timestamp
  retained; undefined optional fields omitted according to the source's checks.
- Fourteen ordered chain choices with source CAIP identifiers. All-chain and
  multi-chain selection use seven exact-true exposure flags. Explicit single
  chain selection is not exposure-filtered in the captured helper. An empty
  multi-selection intersection falls back to the single-chain/all choice.
- Trending's social ranking, one-hour default window and hot label. The separate
  window normalizer accepts `1h`, `4h`, `12h`, `24h`; the builder does **not** call
  it, so an explicitly supplied different window remains encoded.
- Optional followed-holder enrichment with cap 5.
- Shallow snapshot/delta predicates check only type and array presence. They are
  not DTO validators, data sanitizers or proof that entries/patches are valid.

Explicit **local adapter policies**, not captured server behavior: only movers
and trending are supported; an unsupported explicit single chain is rejected;
destination credentials, query and fragment are rejected. The original generic
builder is more permissive. The observed origin constant is informational only.
The adapter does not access cookies/storage, generate identities or timestamps,
obtain flags, create a fetch/AbortController, or perform network I/O. Callers must
supply deliberate options and an explicit destination. Browser RequestInit
credentials do not imply that Node supplies browser cookies.

## Unknown and intentionally omitted

No production request or authenticated state was observed for these boards.
Server ranking/filter logic, request validation, auth, errors, pagination,
response DTOs and realtime remain unqualified. `503774.q` consumes an entries
array, optional finite positive server timestamp and board context, then maps
entries in served order. Its clock-sensitive timestamp cache, coin/stat
normalization and response adapter are referenced but **not implemented here**.
The hook's cache, refetch lifecycle and full state machine are also omitted.

The output is a source-bound client contract and reusable encoding boundary,
not recovered original TypeScript, original backend source, a live market view,
a completed Explore feature or native compatibility credit. Global scope,
coverage and feature-progress ledgers are unchanged.

## Verification

From `app/`, with the unchanged pinned dependencies:

```sh
node scripts/verify-market-board-bindings.mjs --check
node --test tests/market_boards.test.mjs tests/market_board_bindings.test.mjs
```

`--write` intentionally regenerates only the derived contract after source
review. It does not refresh evidence. Tests include all 128 exposure flag
combinations, every selected chain/window, exact wire fields/defaults, explicit
local policies, no-network planning and raw/index/manifest/generated-data
mutation controls. Synthetic option values test local behavior only.
