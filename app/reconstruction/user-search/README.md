# Original user-search query and page selection

The captured SearchDialog calls `600775.N({ searchTerm })`. Its maintained
executable counterpart was missing: query construction, the users/search-v2
request, raw-page pagination and user/labelled-wallet selection. This unit
recovers those operations behind an explicit contract-client capability. It
does not install a service destination or a React hook.

```js
import { createUserSearchQuery } from './query.mjs';

// The caller owns transport and the debounce runtime. This is one render's
// snapshot; construct another snapshot when the inputs change.
const search = createUserSearchQuery({
  searchTerm: ' alice ', debouncedTerm: 'alice', pageSize: 20,
}, getContractClient);
const options = search.queryOptions;
// Pass options to a compatible query runtime, or explicitly call queryFn,
// collect its raw pages, apply select, and use getNextPageParam.
```

The adapter preserves the source's distinct page and display rules. It counts
all raw non-wallet rows for offsets, before display deduplication. A last page
with fewer such rows than the page size stops pagination, including a page
containing only labelled wallets. Display selection keeps the first user for
each truthy trimmed userId/address identity, then appends wallets whose address
was not retained. Both passes preserve served order and original row references.
Rows without a truthy identity are retained. A skipped duplicate user does not
reserve its other address against the wallet pass.

The query key includes the debounced term and page size. Defaults apply only
to undefined inputs. The minimum term length is two JavaScript UTF-16 code
units; the declared route schema has no corresponding minimum. The captured
hook requests a 500 ms debounce, 30-second stale time and no window-focus
refetch. This module supplies those values and preserves enablement/debouncing
expressions, but requires the caller to supply the current debounced value.
`enabled` is an option for the query runtime: manually calling a disabled or
short-term callback still performs the original request.

The callback forwards the page offset, limit, exact AbortSignal,
`includeLabelledWallets: true`, include credentials and JSON Content-Type to
`GET /users/search-v2`. Its non-OK response hook throws the captured plain
Error before response parsing. The required `getContractClient` port must
honor the contract-client API and afterResponse hooks and return raw JSON.
No default HTTP origin, authentication mechanism or cookie handling is added.
The loopback bridge in tests is local design, not a substitute Ky client.

`PROVENANCE.json` binds the maintained bytes to all three physical 600775
contexts in `ecf7ec803bfb3020`, `9535b69d76e2a69b` and `767cc801e3f88f8b`, plus
the actual 238128 dialog import/call. The producer compares complete request,
selection, identity and pagination ASTs, query snapshot expressions, options
and the actual debounce/query-runtime consumers. Lexical alpha comparison
retains scope, declarations, operators, branches, calls and order; imported
capability names and boolean spellings normalize. This comparator reuses
earlier search proof infrastructure and is not a separate recovery claim.
All source witnesses include authenticated raw-capture hashes, URLs and both
UTF-16 and UTF-8 ranges. No captured bundle is evaluated or imported.

The source-selected website catalog 402030 actually imports and spreads
941660.usersRoutes. The complete route declaration uses
`publicRead('profiles.read', ...)`, with optional query fields and an array of
896727.userRow responses. Its full reached declarations are retained, including
optional string `wallet_label`. The raw client tests presence rather than
validating that type; a null label is classified as a wallet even though the
declaration rejects it. Neither the parser nor the adapter silently repairs
that distinction. Numeric-ID variants remain explicit, and these source
contexts do not establish an active runtime winner. `profiles.read` is
declaration metadata, not proof of live server authorization.

Run from `app`:

```sh
node scripts/verify-user-search.mjs --check
node --test tests/original_source.test.mjs tests/original_schema.test.mjs tests/original_search.test.mjs tests/search_planner.test.mjs tests/search_planner_workflow.test.mjs tests/user_search.test.mjs
python3 scripts/verify-evidence.py
```

The tests compose the actual maintained callback with real loopback HTTP,
raw pages, display selection and next offsets. They cover non-OK errors,
pending-fetch abort, references/order, snapshots, falsey/default inputs,
declared schema bounds and six source mutations. Payloads are synthetic local
inputs, not upstream response fixtures. Shared source/schema/wire and the
earlier coin-search planner remain unchanged prerequisites. Existing backend
search, query-runtime cache/scheduling, React compiler memoization, UI mount,
complete SearchDialog, production API compatibility, live auth and full app
build/browser qualification are outside this unit. No feature milestone is
awarded. Original shipped code retains its authorship; names/interfaces here
are descriptive reconstruction choices.
