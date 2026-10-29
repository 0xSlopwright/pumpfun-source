# Original profile callout request and page planner

This independently reconstructed, side-effect-free client unit follows
**399346 → 735821.H → `GET /callout/list/{userId}`**. It exports usable request
and server-page planning functions from
`packages/frontend/src/lib/original-profile-callouts.mjs`. It creates no HTTP
endpoint, makes no request, resolves no identity and changes no visible UI.

The generated [source artifact](original-profile-callouts.json) binds the
implementation hash, original factory variants, verbatim callback/mapper/route
fragments, service origin, complete response/params declarations, query-field
declarations and the separate declared window transformation. Evidence ranges
include UTF-16 code units and UTF-8 bytes, original URL and SHA-256. Captured
JavaScript is parsed as data and never evaluated.

## Use and verify

```js
import { planProfileCallouts, profileCalloutsRequest, profileCalloutsPage,
  nextProfileCalloutsPage, flattenProfileCallouts } from
  './packages/frontend/src/lib/original-profile-callouts.mjs';

const subject = { userId: 'public-profile-subject', window: 'daily' };
const plan = planProfileCallouts(subject);
const request = profileCalloutsRequest(subject, undefined);
// request is data only. An explicitly supplied transport would send it.
const page = profileCalloutsPage({ callouts: [], nextPageToken: '' }, subject);
const next = nextProfileCalloutsPage(page, [page], undefined);
const rows = flattenProfileCallouts({ pages: [page] });
```

From `app/`:

```sh
node scripts/original-contracts/profile-callouts.mjs --check
node --test tests/original_profile_callouts.test.mjs
```

`--write` atomically regenerates the artifact after authenticating the reviewed
capture manifest, maintained inventory, actual factory registration, source
length and hash. A changed source, planner file or generated artifact fails
the reproducibility check. The producer does not refresh evidence or send
network requests.

## Recovered behavior

| Boundary | Behavior in the captured source |
| --- | --- |
| Defaults | limit 30, sortBy `TIMESTAMP`, sortOrder `DESC`, includeMembers false. Only undefined triggers defaults; values are not clamped or schema-parsed. |
| Cache identity | `['callouts', 'by-user', userId ?? null, limit, sortBy, sortOrder, includeMembers, window ?? null]`. Window spelling/case is retained. |
| Enablement | Enabled by default, and requires truthy userId. The query callback separately throws `userId is required` if explicitly invoked without it. |
| Query policy | Initial page parameter undefined; staleTime 60,000 ms, gcTime 300,000 ms, refetchOnWindowFocus false. These are configuration values, not a recreated cache scheduler. |
| Request | Every page resends userId, limit, sortBy, sortOrder, includeMembers and window. Falsey pageToken/includeMembers/window become undefined and are omitted by the shared serializer. AbortSignal identity is passed through. |
| Wire adaptation | thesis→note, likes→likeCount. hasLiked/hasReposted become viewer booleans only when boolean; null and absent are not changed into false. Other fields are retained. |
| Server page | Nullish callouts become an empty array. A truthy nextPageToken is retained only when the returned array length is at least limit. |
| Continuation | A next cursor equal to the previous page parameter stops continuation. |
| Page selection | First occurrence of each calloutId in served page/row order, without sorting or mutation. |

The request descriptor keeps userId as a parameter. The shared contract client
encodes the path parameter with `encodeURIComponent`, serializes the query and
returns `.json()` without parsing the response against its declaration. The
same source chain and origin (`https://frontend-api-v3.pump.fun`) were recovered
in [the Home-feed unit, PR686](https://github.com/lalalune/pumpfun-source/pull/686).
This unit adds the profile-specific caller, mapper, query configuration and
page selection, rather than claiming that transport recovery again.

Both original 735821 variants are retained by chunk context. The selected
profile HTTP hook throws `Failed to fetch callouts for user: <status>` on a
non-OK response. Its plain Error is distinct from the shared ContractError
envelope adapter. Cookie contents and server authorization policy remain
unknown; `credentials: include` is not proof of identity.

## Declaration and client boundaries

**957263** declares the profile route through `publicRead('content.read', …)`.
The response requires a string nextPageToken, including an empty string on the
last page. Recursive callout/quote DTOs, collectibles and tail-PnL histograms
close through **421504**, **983689** and the previously source-bound primitives.
The bounded offline schema checker performs acceptance checks, not Zod output
stripping or response parsing by the website.

The window field is a real declared pipeline: optional string → trim →
uppercase → empty string becomes undefined → optional enum
`DAILY|WEEKLY|MONTHLY|ALLTIME|LAST_ROUND`. The extractor checks this exact AST
pattern and retains its source. `parseDeclaredProfileWindow` reconstructs this
one pipeline with a local `{success,value}` result; it does not claim Zod's
exception or issue format. The captured request builder does not call it, so
`profileCalloutsRequest` leaves a value such as `' daily '` unchanged.

Other query fields use the bounded schema compiler. The whole query is not
presented as an ordinary transform-free JSON Schema: the window pipeline is
kept explicitly separate. Described keyed-host requirements and combinations
(such as MULTIPLE with includeMembers) are not promoted into structural
refinements absent from the captured schema.

There is a concrete source discrepancy: **399346** stops on a short returned
page even when its cursor is nonempty. **957263** explicitly describes short
hydrated pages and says to follow nextPageToken rather than array length.
Both facts are preserved and tested. No original execution or captured response
establishes which server cases occur or authorizes claiming a corrected server
pagination implementation here.

## Limits and provenance

The source-reader prerequisite belongs to the search-contract lane. The shared
bounded declaration extractor/validator was introduced with PR686; this unit
does not count either prerequisite as new profile recovery. The separately
owned full inventory expansion is unnecessary: every selected factory is in
the maintained index. Main has since adopted that expansion (#679 added factory
files and index entries only), so the frozen `inventorySha256` now pins the
expanded 5,947-variant index. Every index entry carrying a factory ID this
producer resolves is byte-identical before and after #679, and the artifact's
fragments, factories and declarations are unchanged. Raw capture bytes, SDK source, existing fixture/historical
pages, auth, native state and qualification ledgers remain unchanged.

Overlap was checked against [PR689](https://github.com/lalalune/pumpfun-source/pull/689)
at `9534a06c32f6cabfc07db8d7e8a3e1ac6a2a5a45`. That separate unit adds an opt-in
backend single-callout read model for `GET /v1/callout/:calloutId` and backend
schema projection. This unit implements no route, store, dataset or backend
validator and makes no claim about that single-callout behavior. PR684 owns
the related original search client and shared source-reader prerequisite;
its search hooks are not changed here.

The original hook also applies an optimistic own-user overlay through
**92245** and **116458** after selecting server pages. That stateful cache,
its TTL, account predicate and React/TanStack scheduling are outside these
functions. `flattenProfileCallouts` is the captured server-page selector,
not the complete final displayed profile list. No wallet assertion becomes
ownership; userId is only the query subject.

This is finite source-backed reconstruction with executable local examples,
not original backend source, API compatibility, a restored authenticated
profile, a differential execution of captured JavaScript or a complete profile
implementation. Ordering, cursor generation, ranking, moderation, permission
and persistence behavior on the server remain unknown.
