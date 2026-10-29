# SearchDialog request planner

This recovers the synchronous coin-search planning logic shared by two retained
factory379705 candidates: the initial Explore script (`642cafc9…`) and the lazy
SearchDialog chunk (`350da5b7…`). It provides a usable planner without choosing
which factory is active in the original runtime.

This extends the merged [PR684](https://github.com/lalalune/pumpfun-source/pull/684),
which recovers query wire encoding and resolver handling but explicitly leaves
query-builder equivalence unqualified. The base revision
`43fb01c6f409ca370e89d4b0350486a92b1a5add` has that transport and no maintained
planner for these hook expressions. This unit is separate from
[PR695](https://github.com/lalalune/pumpfun-source/pull/695), which owns the
non-search Explore board transport to advanced-indexer. This module emits only
the two search request descriptors; it does not fetch or implement a backend.

## Use

```js
import { createCoinSearchPlanner, selectSearchSession } from './planner.mjs';

// These inputs come from the caller's already-decoded render/session snapshot.
const sessionId = selectSearchSession(cookieSessionValue, sessionProviderData);
const plan = createCoinSearchPlanner({
  sort: 'oldest_coins', offset: 48, limit: 48,
  includeNsfw: false, order: 'DESC', creator, sessionId,
  useUnrestrictedSearch: false, includePerps: true,
}, identityPort);

const result = plan({ searchTerm: ' cat ', useLocalFiltering: false });
// result.request = { kind:'client', route:'GET /coins/search-v2', query:... }
// The result also retains reportSearchSettled, settledSearchTerm and
// useLocalFiltering for a caller implementing the remaining hook behavior.
```

The descriptor feeds the existing explicit-destination encoder directly:

```js
import { buildSearchRequest } from '../search-client/request.mjs';

const request = result && buildSearchRequest(result.request.route,
  result.request.query, { baseUrl: 'http://127.0.0.1:3001' });
// The caller chooses whether/how to send request.url with request.init.
```

The factory captures input values once, as the original callback captures a
render's values. Later mutation of the caller's input object does not replace
the snapshot. Make a new planner for a new snapshot.

The planner preserves the observed rules:

- Blank or missing trimmed terms produce no descriptor and no identity call.
  A nonempty query retains the original, untrimmed term on the wire.
- Featured/charity/custom-pairs/live/calls/trending/stocks/majors map to
  `market_cap`; oldest maps to `created_timestamp`. Other values pass through.
- Oldest always requests ASC. Only newest preserves a truthy caller order;
  other sorts use DESC.
- Local filtering requests offset0 and limit100. Ordinary falsy offsets become
  0, while the settled-report condition still tests the original offset strictly
  against0. No additional server validation or clamping is invented.
- Creator, session and device fields are included only when truthy. Charity adds
  `isCharity`. `includePerps` is added only on the restricted search route.
- Settled-search metadata uses the trimmed term and the original first-page/local
  filtering condition. No analytics callback is executed.

`buildCoinSearchQuery` also exposes the underlying query helper with explicit
query arguments, snapshot and identity port. It retains own undefined fields
where the original helper creates them; the separate wire encoder may omit them.

## Identity/session boundary

`identityPort(sessionId)` is an explicit, **unbound** callback corresponding to
captured231824.f. There is no default implementation. The planner invokes it
once on a nonempty search, after the first trim check and before the later
settled-term trim. It immediately destructures `deviceId`; callback, getter and
invalid-result errors propagate unchanged.

The original helper does more than return a device field: it may default an
undefined session argument through192.d, call886813.$ (cookie/localStorage
lookup, synchronization or generation), and compute a timestamp through192.l
even though this query consumes only deviceId. The caller must supply any such
behavior it needs through the port. This unit does not read/write real cookies,
storage or provider state and does not generate an identity or session.

The original render selects `192.d() ?? sessionData?.pump_session_id`.
`selectSearchSession` preserves that nullish value selection over caller inputs;
it does not read the cookie or run SessionProvider293205. The nested provider's
actual registration is recorded as a boundary witness. Tracking session IDs do
not establish authentication.

## Source proof and checks

[PROVENANCE.json](PROVENANCE.json) records authenticated source objects, exact
UTF-16/UTF-8 expression ranges, hashes, free-binding roles and normalized AST
hashes. The verifier compares both source candidates with the maintained module:

- sort and order expressions;
- the complete query-helper body and argument defaults;
- the complete synchronous search-callback prefix before its first `await`;
- copied snapshot values, unbound capability wiring, descriptor return fields,
  enum declarations and nullish session selection.

Normalization changes lexical names, resolves the qualified imports, expands
object shorthand and recognizes `!0`/`!1`. Operators, literals, call order,
branches and values remain significant. Unknown bindings, changed constants,
extra top-level effects and source/adapter mismatches fail closed. Captured
factories and browser globals are never evaluated.

From `/app`:

```sh
node scripts/verify-search-planner.mjs --check
node scripts/original-search-contract.mjs --check
node --test tests/original_source.test.mjs tests/original_schema.test.mjs tests/original_search.test.mjs tests/search_planner.test.mjs tests/search_planner_workflow.test.mjs
python3 scripts/verify-evidence.py
```

Use `--write` only to regenerate provenance after reviewing a source change.
The focused tests cover actual source comparisons, descriptor/default behavior,
snapshot stability, unbound invocation order, propagated errors, nullish inputs
and adapter mutation controls, using synthetic in-memory values only.

The three workflow tests additionally pass actual planner output through the
maintained PR684 encoder to a loopback HTTP receiver. They check the exact GET
path/query and headers for raw Unicode/space-containing charity searches with
local-filter pagination, old/new render page offsets and unrestricted field
omission. Blank terms stop before identity or transport. Nonempty descriptors
still require an explicit destination. The receiver returns an inert synthetic
acknowledgment; it supplies no coin data, ranking or upstream response oracle.
Browser cookie delivery and production traffic are not exercised.

Validation on this unit: both source verifiers and all49 combined focused tests
pass; root nine-capture/six-tooling checks and the app698-object/npm/unchanged-SDK
integrity check pass. No frontend code, visual state, backend endpoint or
dependency changed. Aggregate typechecking was attempted with pinned
pnpm10.24.0; it stops in the unchanged backend because this partial workspace
lacks its `fastify` dependency/type declarations. The wrapper script also
encounters a different global child pnpm's symlink-state guard; directly running
the pinned recursive command reaches the missing-dependency failure. No install,
dependency change or package-manager policy relaxation was made. Full Next build
and aggregate app/browser suites are not claimed for this bounded source/planner
unit under the operator's existing-dependencies/disk limit.

Original shipped JavaScript retains its authorship; descriptive names are local.
No original TypeScript, complete React hook lifecycle, request execution, result
filtering/cache/pagination, analytics, active runtime variant, backend behavior
or live compatibility is claimed. No feature-progress milestone is awarded.
