# Original portfolio-summary JSON workflow

This makes the selected **520669** portfolio-summary reader executable, including
its JSON projection/fallbacks, holdings/fresh request branches, cache keys and
refresh ordering. It uses a maintained dependency-free projection of the fixed
captured schemas. It is not a Zod implementation or a portfolio/PnL engine.

## Source and domain

The selected factory is SHA `335a22cb…` at UTF-16 `[15490,17487)` in
`910b5c033a62f9b1.js`. The other captured variant, SHA `cc2ff6fe…`, is recorded
explicitly and is not silently treated as globally interchangeable or qualified.
`contract.json` retains exact capture/factory hashes, URLs and UTF-16/UTF-8 AST
witnesses. All analysis is static: captured factories/libraries are never executed.

The used schema and route boundaries are followed before implementing projection:

- **402030** imports **593902**'s portfolio routes. Its response is a union with
  wallet option `w` first; `w` extends `b`, which extends plain object `l`.
  The reader picks seven fields and replaces their validators. **785036** leaves
  the response in the public-read definition, and **183184** is the route identity
  helper. No passthrough catchall is added to this base projection.
- Four actual same-chunk schema aliases lead to **599565**. The used number
  path is `u4 → ny → u0 → tQ`: no coercion/checks are supplied, and the actual
  `$ZodNumber` parser admits only finite numbers. **408162.B** returns empty
  parameters for an absent argument. Its `K` and `S` establish the pick-order and
  object predicate. Nullable/optional/catch wrappers, catch-result `iW` and the
  object projection parser are also retained as physical witnesses.
- **759257.j → 30181.K → 503630.R** selects the website
  `https://frontend-api-v3.pump.fun` origin. **898661** supplies contract request
  encoding/JSON decoding. A matching public developer API path does not establish
  interchangeable hosts, credentials, server auth or native behavior.

The supported projection domain is **decoded JSON response values**. Unknown
fields are removed and new projected values are returned. Original Zod issue
arrays, messages/error class, object descriptors, global memoizer configuration,
async parsing and exotic JavaScript inputs are unqualified. A non-object root
throws the explicitly local `SummaryResponseError` rather than pretending to
reproduce Zod's error identity. No original library version is installed or guessed.

## Projection

- Base output contains `pnl`, `realizedPnl`, `unrealizedPnl`, `percentage`,
  `totalBuySpend`, `tokenCount` and `totalValueUsd`. Pair legs are finite numbers
  or null; malformed/missing pairs become `{sol:null,usd:null}`. Negative numbers
  and zero are preserved. Numeric strings are not coerced.
- Enhanced output contains holdings, computedAt, solPriceUsd, nativeBalanceSol,
  reprice and cacheFresh. Missing/non-array holdings becomes null. Invalid
  holding rows are omitted; mint must be nonempty and amount/price finite.
  Chain defaults to the empty string. The source's invalid `valueUsd` fallback is
  **zero**, while marketCapUsd/invalid present markUsd become null. An absent
  mark stays omitted. These are original client presentation fallbacks, not
  newly established financial facts or server calculation rules.
- Invalid/missing reprice becomes null. An object reprice has nullable finite
  asOf and an unrepriced list that omits invalid rows. A reason must be a string
  but may be empty. CacheFresh is true only for an object cache whose fresh is
  strictly true. Raw cache and all unrelated fields are projected away.

The explicit finite guard matters for JSON numeric overflow (`1e400`). In this
reader the numeric schema rejects it and uses the declared fallback, unlike the
separate captured dust-floor getter's bare positive-number check. No shared
generic coercion policy is imposed across those distinct clients.

## Requests and refresh

`read({user,period,holdings=false,fresh=false})` leaves user/period untouched.
When both flags are falsy, it calls the constructor with **zero** arguments,
sends only `{user,period}`, and returns base projection. Otherwise it adds
truthy flags as numeric 1 and returns the base/enhanced projection merge. A fresh
read constructs with `{credentials:'include'}`; a holdings-only read passes one
explicit undefined constructor argument. The reader does not read/forward a
signal field, invent a default period or infer that include/fresh proves ownership.

`refresh(queryClient,user,period)` preserves this exact order:

1. Await the holdings+fresh read.
2. Construct `['portfolioSummary',user,period]`.
3. Await `cancelQueries({queryKey:key,exact:true})`.
4. Call `setQueryData(key,response)` and return undefined, without awaiting or
   returning the setter result.

Read or cancellation failure prevents the write; errors are not swallowed.
This is a recovered callback sequence, not a qualification of React Query's
concurrent lifecycle, global cache consistency or owner/session behavior.

```js
import { createPortfolioSummaryClient } from
  '../../packages/frontend/src/original-contracts/portfolio-summary/client.mjs';
const summary = createPortfolioSummaryClient({ createClient: explicitContractClient });
const value = await summary.read({ user: publicSubject, period: '1w' });
await summary.refresh(explicitQueryClient, publicSubject, '1w');
```

`local-http.mjs` is an optional explicitly selected one-attempt HTTP(S) adapter.
It supports scalar query values, observes constructor credentials/header choices
and decodes JSON. Its URL restrictions, scalar-only wire domain and local HTTP
errors are local policy. It does not implement original array encoding, retry/
timeout scheduling, contract-error wrapping, cookie jars, auth or a default host.

## Verify and limits

```sh
node app/scripts/original-portfolio-summary.mjs --check
node --test app/tests/original_source.test.mjs app/tests/original_portfolio_summary.test.mjs
```

Twelve new cases cover source/library/base-schema witnesses, all fixed projection
branches, omitted/invalid rows, exact constructor arity, raw query flags, signal
absence, read/cancel/write ordering, failure propagation and resealed finite-guard
mutation. Eleven shared source tests also run. Six real loopback HTTP responses
exercise plain/enhanced/fresh reads and negative responses using explicitly
synthetic payloads. Records retain exact method/path/query/selected headers/status/
body; only the ephemeral loopback origin is omitted. The immutable base lacks
the maintained modules; no baseline HTTP/native response is fabricated.

No production traffic, backend financial calculation, price/history provider,
canonical wallet links, session/owner proof, RPC/indexer, React UI integration,
original library-error equivalence or feature/native qualification credit is
introduced. Existing chart/mint/policy modules and all SDK/capture bytes remain
unchanged. Hash-bound logs and workflow receipts are in `validation/`; full
app/Next/browser aggregate validation remains shared work.
