# Captured search request session

The merged search planner and wire contract stop before asynchronous request
execution. This unit recovers the shared request executor used by both retained
SearchDialog coin-hook candidates and makes it usable through a headless search
session with an explicit HTTP destination and shared cache.

The original operation and its actual awaited search consumers are authenticated
in factory 379705 from `dba17a249156c6ff.js` (initial Explore 642cafc9…) and
`767cc801e3f88f8b.js` (lazy SearchDialog 350da5b7…). Both complete executor ASTs
match the maintained operation after lexical renaming, qualified capability
mapping and boolean spelling normalization. No active runtime variant is chosen.
The immutable captured JavaScript is parsed and never evaluated.

## Use

```js
import { createCoinSearchPlanner } from '../search-planner/planner.mjs';
import { createSearchCache, createSearchSession } from './session.mjs';

const cache = createSearchCache(); // Share this among relevant session instances.
const session = createSearchSession({
  baseUrl: 'http://127.0.0.1:3001', // Caller-selected; there is no production default.
  cache,
});
const plan = createCoinSearchPlanner({
  sort: 'market_cap', offset: 0, limit: 48, includeNsfw: false,
}, () => ({}))({ searchTerm: 'cat' });

// Commit a render/input snapshot explicitly. requestKey is caller-provided;
// this unit does not reconstruct the owning hook's entire render-key builder.
const execute = session.render({
  requestKey: 'search:cat:first-page', offset: 0, limit: 48,
  ipfsPrefix: 'https://example.invalid/ipfs/',
});
if (plan) await execute(plan.request, false, plan.useLocalFiltering, false,
  undefined, (unfilteredCount, elapsedMs) => {
    // Optional caller-owned completion handling; no analytics are sent.
  });
const { coins, loading, pageSize, hasNextPage, loadedKey, errorKey } = session.getState();
session.abort();
```

The public session accepts only the two captured coin-search client descriptors.
It rejects board/list and other routes before transport. The complete shared
executor retains its original board/list branches behind explicit ports; those
are tested as dependency boundaries. This does not add a board query planner,
ranking engine, board parser or a replacement for the separately merged Explore
board work.

## Original-backed behavior

- Cache keys use the original `JSON.stringify([route, query])` insertion order,
  followed by either `full` or the local-filter offset/limit. A stored entry is
  expired only when its age is strictly greater than 120,000 ms. Writes refresh
  insertion order and evict the oldest entry when size exceeds 24.
- A cache hit hydrates rows/count/has-next state and still issues a refresh.
  It suppresses the loading transition and preserves those cached rows if that
  refresh fails. Preserve-existing requests bypass cache reads.
- Every request increments a sequence ref and aborts the prior controller.
  A response is decoded, normalized and filtered before the sequence check.
  Only the current request publishes state/cache/completion updates.
- Local filtering slices filtered rows using the captured offset/limit. Page
  size and has-next use the unfiltered normalized rows. Nonlocal requests keep
  the full filtered result but still count unfiltered rows and set has-next null.
- Abort/stale errors preserve state. Other failures preserve state only through
  the actual preserve-existing/social-terminal key condition or a cache hit;
  otherwise rows, count and served rows clear, and the requested error key is
  published. A current request always clears loading in `finally`.
- The captured `finally` unconditionally clears the shared controller ref,
  including after a stale request. This quirk is retained and tested; no stronger
  cancellation guarantee is invented.

The coin response reader 997887.l is an identity function, not a schema parser.
The captured 493025.f normalization mutates rows: it fills missing timestamp and
recommendation aliases, rewrites URI fields through 426091.r, preserves an HTTP
image when the URI helper falls back, sets an optional search term and fills the
charity alias. Explicit existing values are retained. The fallback URI and both
regular expressions are bound to captured source. Unsupported response types
can throw during normalization and follow the same executor failure path.

## Boundaries

`createSearchExecutor` is the source-backed operation with explicit state/ref,
clock, contract-client, fetch and parser ports. Its source proof preserves
declaration kinds, statements, operators, literals, branches, receiver behavior,
callback order and return values. It records actual imported IDs, both awaited
search calls, seven `useState` setter bindings per candidate and request/abort
counter initialization.

`createSearchSession` is a local headless adapter with synchronous state setters.
Calling `render()` explicitly updates request/loaded-key refs and captures a new
offset/limit/prefix/social-terminal snapshot. This is not React scheduling,
effect/debounce behavior or a complete SearchDialog component. Filtering and
completion callbacks are supplied by the caller; the original domain predicates
and analytics/provider lifecycle are not fabricated here. `initialCoins` is a
caller-provided local starting value, not a captured server response.

The small HTTP bridge uses the existing source-backed search wire encoder and
an explicit base URL. It performs one GET, runs the executor's supplied status
hook and decodes JSON. It does not reproduce Ky retry/error wrapping or browser
cookie delivery. Raw response shape, server ranking, authorization and live API
compatibility remain unqualified. The session provides no backend endpoint,
production proxy, wallet action or default production network target.

Use the same clock for a cache and its sessions when supplying a custom clock.
The captured cache is module-wide; the explicit cache argument makes that sharing
visible instead of silently allocating a different cache for each session.

## Proof and tests

From `/app`:

```sh
node scripts/verify-search-session.mjs --check
node --test tests/original_source.test.mjs tests/search_session.test.mjs
python3 scripts/verify-evidence.py
```

[PROVENANCE.json](PROVENANCE.json) binds raw URLs/hashes, strict UTF-8/UTF-16
ranges, expression hashes, normalized AST hashes, actual consumers and state
bindings. `--write` regenerates it only after deliberate source review.

Tests use real loopback HTTP responses for planner-to-state success, raw row
normalization, pagination, cache hydration/failed refresh, exact TTL edges,
HTTP/null/invalid-JSON failures, abort and out-of-order responses. A deliberately
noncooperative injected fetch capability demonstrates the stale-state guard even
when cancellation cannot prevent an old response. Other tests check cache
eviction, explicit shared branch ports, controller cleanup, destination/route
admission and source/adapter mutation rejection. Loopback payloads are synthetic;
they are not upstream response fixtures or an API compatibility oracle.

No original captures, SDK, dependencies, frontend UI, backend routes, progress
milestones or previous packets change. No new native/binary work is included.
Original shipped JavaScript retains its authorship; descriptive names are local.
