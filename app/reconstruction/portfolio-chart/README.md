# Original portfolio-chart read client

The captured chart reader was inventoried but had no maintained callable workflow.
This unit recovers factory **58159**'s getter, cache keys, computing-response retry
predicate and minimal response-schema construction. It supplies a separate,
explicit one-attempt HTTP adapter so the reader can run against a local service.
It does not calculate a portfolio chart or install a chart in `/portfolio`.

## Source boundary

`contract.json` is regenerated from authenticated captures, AST registrations and
the complete 5,947-variant inventory. It retains URL, whole-capture hash, factory
hash and UTF-16/UTF-8 witnesses. All analysis is static; captured JavaScript is
never imported or evaluated.

- Reader **58159**, hash `a3d13f11…`, occurs at UTF-16 `[14618,15482)` in
  `910b5c033a62f9b1.js` (capture SHA-256 `987f1b8b…`). Its operation is
  `GET /portfolio-summary/chart`, with raw `{user,period}` query fields.
- Its used constructor **759257.j** passes through **30181.K** and resolves
  **503630.R** to `https://frontend-api-v3.pump.fun`. The observed credential
  option is `same-origin`; `WEB`/`web` headers and JSON Accept come from the HTTP
  wrapper. This website origin is distinct from the public developer API's
  `https://api.pump.fun/v1`; a matching path does not establish interchangeable
  hosts, API-key behavior, server auth or complete response schemas.
- **30181** also registers **812768.f**, the actual HTTPError class checked by
  the retry callback. **898661** encodes scalar queries, awaits JSON and applies
  contract-error normalization *after* the HTTP client's retry processing.
- The four schema imports forward to **599565**. Their identical-byte merged
  inventory variant has multiple origins in the same chunk. The verifier selects
  each actual registration by its literal ID, checks the physical range and
  confirms the shared hash; it never chooses an arbitrary first origin.
- **674121** uses `walletPrefix` for query invalidation. No chart-reading UI
  caller is established. The `/portfolio` scope binding describes the intended
  portfolio feature, not proven route-to-reader reachability.

The complete selected factory hashes are deliberately pinned. Changed captures
or semantics require renewed review, rather than silently regenerating acceptance.

## Preserved behavior

The getter constructs the client with `timeout:30000`, the same retry object and
an explicitly present `signal` field. It passes a fresh query object to the
operation, without validating/defaulting user or period. It synchronously calls
`responseSchema.parse(response)`, discards its result and returns the original
response unchanged. Transport and synchronous parser errors propagate unchanged.

Retry options are limit 3, method `get`, statuses 502/503, after-status 503 and
maximum Retry-After 15 seconds. The callback's return values are **undefined**
(defer to the retry framework) and **false** (stop), never `true`:

- An instance of the supplied HTTPError class with status 503 defers only when
  retryCount is at most 3 and `response.clone().json()` yields a non-null object
  with `status: "computing"`. Original-body consumption is preserved. JSON,
  cloning or consumed-body errors stop. The source uses `in`, so inherited
  `status` qualifies too.
- All other errors defer at retryCount at most 1 and stop afterwards. This is
  **not** an instruction to retry every error: the HTTP library still controls
  eligible methods/statuses, limits, delays, Retry-After and timeouts.

The schema builder calls the supplied Zod-shaped namespace for period
`1d|1w|1m|all` and an array of numeric `{time,value}` objects, then applies
top-level `passthrough()`. It does not add the developer API's richer chart
fields, sort points, coerce values or replace the response with parsed output.
Zod's original runtime, error issues, exotic-input behavior and version are
explicit dependencies, not independently reproduced by this unit.

## Use

```js
import {
  createPortfolioChartReader, portfolioChartResponseSchema,
} from '../../packages/frontend/src/original-contracts/portfolio-chart/reader.mjs';
import {
  localChartClient, LocalChartHTTPError,
} from '../../packages/frontend/src/original-contracts/portfolio-chart/local-http.mjs';

// Explicitly supply a reviewed schema implementation and destination.
const readChart = createPortfolioChartReader({
  createClient: localChartClient({ baseUrl: localServiceBaseUrl, fetchImplementation: fetch }),
  HTTPError: LocalChartHTTPError,
  responseSchema: portfolioChartResponseSchema(explicitZodNamespace),
});
const response = await readChart({ user: publicSubject, period: '1w', signal });
```

Alternatively supply the real contract-client constructor and its actual
HTTPError class. A reader instance shares one retry object across its calls.
Creating another reader creates another independent recovered-module instance.

`localChartClient` is **local design**: explicit HTTP(S) base URL, one GET, scalar
query encoding, observed headers, AbortSignal and JSON/empty-response decoding.
It intentionally does not emulate Ky retry/timeout scheduling, contract-error
normalization, browser cookie handling or auth hooks. It passes no credentials
from files/configuration, chooses no production default, and makes no request
until called. Its URL restrictions and LocalChartHTTPError are not original
server behavior. The tests' minimal numeric parser is an explicitly synthetic
port, not a claimed Zod implementation or original server response.

## Verify and limits

From the repository root:

```sh
node app/scripts/original-portfolio-chart.mjs --check
node --test app/tests/original_portfolio_chart.test.mjs
```

The 11 tests include real loopback GETs, headers/query encoding, original object
identity, parser/transport failures, cancellation, callback count boundaries,
malformed/consumed/clone-failing 503 bodies, actual alias ranges, stale metadata,
raw capture corruption and a resealed retry-guard mutation. The schema test uses
an inert constructor recorder; it never runs captured code. Workflow receipts
and exact source/command hashes are in `validation/`.

No production traffic, authenticated session, historical series, prices, linked
wallet discovery, holdings/PnL aggregation, backend route, React query hook,
automatic retry timing, UI behavior or visual parity is qualified. Existing
public Solana inventory and opt-in materialized balance/trade capabilities remain
separate. No native/qualified operation count or feature milestone is awarded.
