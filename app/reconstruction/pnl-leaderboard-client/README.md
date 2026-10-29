# Original PnL leaderboard client workflow

This callable client recovers the website's request, raw score selector and
complete wallet-keyed query hook. The current `/leaderboard` page uses a separate
developer-API adapter documented in `packages/frontend/LEADERBOARD-EVIDENCE.md`;
this unit preserves the website client boundary for a future original-provider
integration. It adds no ranking backend or original UI/visual-parity claim.

## Original source and consumers

The captured factory with IDs **864024 / 416287**, SHA256
`cec3cfd574ec5ecefe30bc96c8d3c5242ccaa83d7fa2056a7708ac557e7220b9`,
exports the request, score selector and query hook. Both captured variants of
consumer **996005** import and call the hook and score selector. The contract
retains their distinct hashes and source ranges without selecting a global
runtime winner. It also follows the used client **759257.j**, its **503630.R**
origin configuration and the separate **154263** route declaration.

`contract.json` records every reviewed variant/origin, capture URL/hash/byte
length, UTF-16 and UTF-8 range, and 17 original AST witnesses. The source gate
parses strict original slices through the already maintained shared reader;
formatted factories and captured bundles are never executed. All three complete
request/selector/hook ASTs remain in `client.mjs`. Only the four runtime imports
and export registration become named capabilities. New variants fail closed.
Original private TypeScript names and source files are unknown. Material retains
its upstream authorship; these are analyst-named maintained adapters.

The recovered behavior is:

- `GET /pnl-leaderboard` receives `period`, `sort`, `limit`, the query's actual
  `AbortSignal`, `credentials: "include"` and the JSON content-type header.
  The retained response hook throws the original plain status error for a
  non-OK response. The request returns its injected client's result unchanged.
- The score selector chooses the realized, unrealized or combined field as-is.
  It does not calculate PnL, coerce values, sort rows or synthesize missing data.
- The complete 19-slot hook preserves the six-part query key, 60-second stale
  time, enabled/refetch defaults and memo identities. Its lowercased wallet key
  is a client cache partition, not authenticated identity.
- When the previous query belongs to another viewer, placeholder data is
  shallow-copied, `viewer` becomes an own `undefined` property, and copied entries
  lose `isViewer` and `viewerFollows`. Matching viewers retain the original data
  reference. Unknown fields are retained; this is not a general privacy filter.

## Usable transport and provider boundary

`fetch-transport.mjs` is explicitly local implementation, **not recovered client
framework or server internals**. An operator supplies an HTTP(S) base URL and
fetch capability. It only supports the recovered GET operation, forwards the
source's headers/credentials/signal, executes its response hook, and returns JSON.
It has no default production host, credential store or added response validator.
Original cookie issuance, authenticated visibility and server schemas remain
unqualified. Unknown server behavior is not implemented as a fake response.

```js
import { createPnlLeaderboardClient } from './client.mjs';
import { createPnlFetchTransport } from './fetch-transport.mjs';

// operatorBaseUrl is an explicitly supplied local/read-only adapter destination.
const transport = createPnlFetchTransport({ baseUrl: operatorBaseUrl, fetch });
const client = createPnlLeaderboardClient({ createClient: () => transport });
const board = await client.request({ period: 'weekly', sort: 'realized', limit: 20, signal });
```

Using `useLeaderboard` additionally requires the original-shaped memo-cache,
wallet and query capabilities named in the factory. The hook does not implement
React's compiler runtime, TanStack scheduling, wallet authority or server auth.
No replacement provider or query library is silently installed.

## Checks and limits

```sh
node scripts/original-pnl-leaderboard-client.mjs --check
node --test tests/original_pnl_leaderboard_client.test.mjs tests/original_source.test.mjs
```

The workflow tests execute the shipped request/query function and transport
against an isolated loopback HTTP server. They cover actual URL/header/query
serialization, response-order preservation, the original non-OK error before
JSON decoding, and real request aborts. Injected component-state tests cover
memo invalidation, wallet change/logout placeholders and input immutability.
Two negative source controls reject maintained-code and provenance-document
drift. All accounts/data are synthetic; no credentials, personal profiles,
production APIs, signing or trading are used.

These checks establish this recovered client workflow and the declared local
transport behavior. They do not qualify live response compatibility, original
query-library scheduling, original wallet/session authority, ranking formulas,
production deployment or responsive/visual parity. No feature-completion score
or native backend credit is advanced.
