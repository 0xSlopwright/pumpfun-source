# Original competition highlight data workflow

The captured Cup carousel joins trader/squad reels, squad rosters and generated
profile-media metadata before selecting its display items. This reconstructs that
**complete used client data workflow**, including its original pending-media Map
and microtask drain. It does not render the carousel, calculate server scores,
generate media or implement a private backend.

## Original evidence and boundaries

Factory **590407**, SHA
`3f494070c58a6d7f0f70279887ef648107935b765fe849de3e9ec100cec45dda`,
contains the actual `e3` carousel component and its nested data function. The source
generator retains that complete function plus its ten used helper/state
declarators (`eD/eK/eZ/eB/eQ/eW/eJ/eG/eH/eX`). The actual component invocation,
contract/query/key imports and exact UTF-16/UTF-8 witnesses are in `contract.json`.
It authenticates raw captures/registration ranges and the complete maintained
ASTs/canonical bytes. Captured bundles and factories are never evaluated.

The original **674801.S** Solana chain constant is retained; unrelated RPC helpers
are excluded. The actual **639287** highlights/entry/media query-key expressions
are witnessed and remain an injected key capability. PR850 separately provides
the complete original key object; this unit neither duplicates it nor requires
its unmerged files. Separate **139209** reel/roster route declarations are parsed
as evidence, not implemented as guessed server logic.

Names are analyst-facing; private original source paths/types and active runtime
context remain unknown. Upstream material retains its authorship.

## Consumable module instance

```js
import { createCompetitionHighlights } from './client.mjs';

// Keep one stable instance for one original module context. Supply actual query,
// key and contract providers at integration, with an explicitly scoped fetch.
const { useHighlights } = createCompetitionHighlights({
  useClientServerContract, useQueries, keys, fetch, queueMicrotask,
});
const items = useHighlights({ competitionId, entries });
```

`useQueries` is the original-shaped multi-query capability (935258.f), and
`useClientServerContract` is the existing 944410 context boundary. This adapter
adds no authentication, schema decoder, query cache/scheduler or retry policy.
All tests inject synthetic providers and use loopback HTTP only; no real cookies,
accounts, credentials or production services are read.

The injected fetch receives the original relative path
`/api/profiles/generated-media`, POST JSON `{ ids }`, and Content-Type header.
There is no production default or server media implementation here. The captured
media call supplies neither an abort signal nor an explicit credentials option;
those omissions are preserved. Reel/roster GETs forward the query provider's
signal. The host application must supply its legitimate original-shaped
transport/auth boundaries rather than treating test providers as authorization.

## Preserved workflow

- Ranked person entries require `rank > 0` and a wallet other than literal null;
  the first 10 are queried. The first 5 ranked squads receive reel and roster
  queries. Reels request limit10; all three plans retain 60-second stale times.
- A pending query yields undefined, while settled missing/error data becomes
  null. Each person/squad sequence stops before its first pending result; settled
  missing data does not block subsequent entries.
- Trader display chooses the first positive-PnL Solana reel token if its
  contribution reaches the original 10-percent threshold. The exact suppression
  and top-position fallback rules are retained, including negative total PnL.
  No server score, ranking, normalization or currency calculation is added.
- Squad display sorts a copy of the roster by its already-served PnL, matches
  member IDs to positive Solana token legs, retains the first tied best leg and
  shows at most two contributing members per squad. Input rosters are untouched.
- Media queries deduplicate wallets and retain a 30-minute stale time with retry
  false. Pending media hides an item; a nonempty string loop UID wins over the
  avatar image; missing/error data falls back to an image or omits the item.
- The module-local Map coalesces media promises into one microtask, resets before
  the first await and drains keys in batches of200. Missing response entries
  resolve null. A failed batch rejects only its waiters; later batches continue.
  New requests during an await schedule a separate drain. Module instances do
  not share this state.
- Final display items retain original trader-before-squad order and are capped
  at10 **after** media planning. This is client projection, not server ranking.

## Repeatable finite checks

```sh
node scripts/original-competition-highlights.mjs --check
node --test tests/original_competition_highlights.test.mjs tests/original_source.test.mjs
pnpm typecheck
pnpm verify:evidence
```

Focused tests bind the actual source/consumer, reject drift, execute the original
queryFns through a real loopback GET→GET→roster→media POST flow and check aborts,
pending ordering, thresholds/ties, source fields, input immutability, media
fallback,200-key chunking, duplicates, failures and reset-before-await behavior.
The deterministic query driver is explicitly a test capability, not a React or
TanStack emulator. Exact tested source/log bindings are in `validation.json`.

Existing UI/backend/SDK/captures/lockfile/feature ledger are unchanged. No visual
parity, private authentication, original backend/media-generation or production
API compatibility is claimed. No actual generated content or financial operation
is created; the POST receiver in tests returns synthetic metadata only.
