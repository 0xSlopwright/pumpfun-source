# Original creator-payout client workflow

This unit turns the complete captured **80559 / 493270** frontend modules into
callable, source-bound module instances. It recovers row normalization, read
requests, infinite paging, raw totals and the original typed-error/query policies.
Server payout calculation, confirmation/ranking rules, authentication and visual
parity remain unqualified. The existing page and backend are unchanged.

## Source and explicit variants

All three physical factory variants are retained separately:

| Original SHA prefix | Captured chunk context |
| --- | --- |
| `50adeb832d22` | `25v3kn0x93ikz.js` |
| `ff013c07164d` | `39mrtwuhv50wq.js` |
| `d99e0ef0c846` | `2wq32g770zyfq.js` |

`createCreatorPayoutModule` requires the full original factory SHA. There is no
default or global deployment-winner selection. Each construction represents one
original module instance; keep it stable for its query consumers because the
original error constructor is part of its retry policy.

The generator retains every non-import/export statement, complete error class,
helper, request function and both complete query hooks. Only runtime imports and
export registration become explicit named capabilities. The strict source gate
authenticates raw captures and actual registration ranges, then verifies the
complete maintained module ASTs and canonical bytes. Captured bundles, runtime
factories and route declarations are never executed.

`contract.json` retains all original variant/origin entries and exact UTF-16/UTF-8
witnesses. Two **66397** consumer variants and **590407** actually import and call
the leaderboard hook, total hook and row-key helper. The used **759257.j** client
factory is traced to **503630.R** origin configuration; separate **190491** route
declarations remain evidence, not invented server implementations. Original
private filenames/types and the active runtime winner remain unknown. Upstream
material retains its authorship; these are analyst-named adapters.

## Preserved behavior

- The board request uses `GET /payouts/leaderboard`, page size **50**, the supplied
  page/signal and `credentials: "include"`. Literal period `all` becomes an
  omitted query value; only `undefined` receives the original default.
- The exact original row projection drops nonobjects, nonpositive/nonfinite
  ranks and rows without string wallets. It retains finite signed/fractional
  numbers, strict/default badge rules and optional viewer fields. It does not
  infer extra DTO fields, sort rows or calculate payouts.
- Paging stops when the **normalized** last page has fewer than 50 entries or
  loaded entries reach `min(500, lastPage.totalEarners)`. It does not truncate an
  oversized server page. Selection concatenates pages without deduplication and
  retains the first page's total.
- Only this module instance's `FetchError` with numeric status **401** suppresses
  board retry, focus refetch and polling. Other errors receive the original
  one-retry predicate. Polling stops after multiple loaded pages; background
  polling is disabled. Query and memo behavior are otherwise left to the injected
  original-shaped providers.
- The total request uses `GET /payouts`, page 0/size 1 and the same signal/header/
  credentials boundary. It returns the original finite-number projection of
  `totalPaidUsdc`; its status error remains a plain `Error`. The total hook's
  wallet key/enable check is client state, not server authorization or a wallet
  parameter sent to this endpoint.

## Runnable local integration

```js
import { creatorPayoutVariants, createCreatorPayoutModule } from './client.mjs';
import { createPayoutFetchTransport } from './fetch-transport.mjs';

const transport = createPayoutFetchTransport({ baseUrl: operatorLocalReadUrl, fetch });
const module = createCreatorPayoutModule({
  variant: selectedCapturedFactorySha, // Choose the reviewed source context explicitly.
  createClient: () => transport,
});
const firstPage = await module.requestLeaderboard({ page: 0, period: 'all', signal });
```

The shipped fetch transport is explicitly **local design**, not the original
HTTP framework or server. It supports these two GET operations only, requires an
operator-supplied destination/fetch, keeps that origin, forwards the source's
headers/credentials/signal, executes its response hook and decodes JSON. It has
no production-host default, credential store or added response schema. Calling
the hooks additionally requires explicit memo/query capabilities; no new query
library or replacement auth provider is installed.

## Qualification

```sh
node scripts/original-creator-payout-client.mjs --check
node --test tests/original_creator_payout_client.test.mjs tests/original_source.test.mjs
```

Each original variant executes an actual loopback HTTP workflow through its
query function, request, normalization, pager and selector. Tests cover both read
routes, typed/plain 401 failures before JSON decoding, real aborts, response
ordering, normalization edge cases, error-constructor identity, memo keys, polling
and the 500 threshold. A negative source control rejects altered helper logic.
All rows/addresses are synthetic; no real credentials, personal payouts,
production requests, signing or trading are used.

These are bounded client/local-transport checks. They do not establish original
query-library scheduling, authenticated visibility, production response/schema
compatibility, backend internals, ranking formulas, a reconstructed UI or feature
completion credit.
