# Original exported mutual-followers reader

This independently maintained adapter reconstructs the actual registered
`366510.z` read workflow: viewer-partitioned query options, a credentialed
first-page request, raw JSON and the non-OK response hook. It is executable
with an explicit website-client-shaped transport. It installs no HTTP service,
authentication, graph calculation, query runtime or mounted UI.

No importing UI caller is established in the retained captures. The entry
boundary is the exported client itself; no route reachability or observed
rendered workflow is claimed. Original source remains attributed to its
authors; names here are analyst-maintained. Captured code is only parsed as
inert AST, never imported or evaluated.

## Source chain and declarations

The shared factory registers `350989`, `802331`, `500056` and `366510` in
`evidence/web/objects/eb0b23ee6feb7543.js`, URL
`https://pump.fun/_next/static/immutable/chunks/163nqh7l1hxim.js`, source SHA256
`8ff9a060d8b1c540a04bb505094eb61ce0c2b2c5d83579af3e3976bf49a16d54`.
The selected factory hash is
`32ecd36e6cb92106cf0cdde6c7382658933cbdb728d3a88d6a07a8ac0bd3d4fc`.
The producer selects the actual `366510` registration and `z` export,
separately from the list and mutation hooks in that shared factory.

The request invokes imported `759257.j`, through `30181.K` and the
`402030` contract catalog/client to `898661`. The actual catalog includes
`941660.usersRoutes`; its bare declaration contains
`GET /users/{id}/mutual-followers`. The observed origin is the
`503630.R` literal `https://frontend-api-v3.pump.fun`.
Shared source/schema/transport and HTTP-error recovery belong to PR684,
PR686 and PR691; this unit does not claim those again.

[contract.json](contract.json) retains exact original URL, source/factory
hashes, UTF-16 and UTF-8 ranges, verbatim selected expressions, used imports,
and the implementation hash. Params/query/response declarations close through
`890664.normalizedProfile` and existing bounded schema primitives.

The route declaration has **no publicRead wrapper**. No developer scope,
graph.read permission or backend authorization is inferred. The schema admits
an arbitrary string id, optional positive safe-integer limit, optional
nonnegative safe-integer offset, and a response containing mutualFollowers,
hasMore and numeric totalCount. The offset description says the cc RPC rejects
past 10k; there is no such maximum predicate in the declaration. The client
always sends offset 0. Ranking and whole-set count descriptions remain
declarations, not implemented or observed server behavior.

## Integration

```js
import { mutualFollowersQueryOptions } from './client.mjs';

function makeOptions(websiteClient, profileId, viewerCacheKey) {
  return mutualFollowersQueryOptions(
    websiteClient,
    { profileId },
    viewerCacheKey,
  );
}
// options.queryFn({signal}) invokes the supplied client with the captured
// operation and options. No destination or browser session is supplied here.
```

The transport must honor the website-client-shaped operation/options and
response hooks and return its JSON result. There is no default fetch or
production destination. Query scheduling, retries, caching and hashing remain
with the caller's runtime.

The viewer cache key is an external input standing at the original
`779106.f('mutual-followers')` boundary. It is **not** an authenticated
principal or a client assertion of ownership; it is never forwarded as a
query/header/body field. A caller must not use it as backend authority.
RequestInit include credentials does not prove that Node supplies browser
cookies, that a user is signed in, or that a server would authorize a request.

## Preserved behavior

- Raw query key: `['mutual-followers', profileId??'', limit, viewer??'']`.
  Default limit 5 applies only when undefined. No trim/casing/id validation,
  client limit clamp or synthetic viewer is added.
- Enablement: default-enabled option and truthy profile/viewer. A manually
  invoked callback still invokes transport; no extra guard is invented.
- staleTime 60000, retry 1. No explicit focus/refetch option is added. This
  exposes runtime policy, not an implemented retry/scheduling engine.
- Fixed request: params id, query `{limit,offset:0}`, include credentials,
  exact AbortSignal, throwHttpErrors false, and the actual afterResponse hook.
  Request/hook containers are fresh per invocation; scalar inputs are captured.
- On a non-OK response the hook throws plain Error with
  `Failed to fetch mutual followers: <status>`. It does not attach response,
  consume the body or inspect JSON. The shared PR691 normalizer therefore
  preserves that Error rather than manufacturing ContractError.
- Success returns raw JSON. It does not validate/rename rows, strip fields,
  recompute totalCount, use hasMore to fetch another page, sort or deduplicate.
  The declaration's DTO is separate from this callback's runtime behavior.

The source does not reconstruct a full mutual graph: it issues one bounded
first-page request. Server ranking, viewer resolution/auth, graph intersection,
count generation, persistence and production responses remain unknown. Raw
client-field retention is not a privacy-safe backend response projection.

## Checks and boundaries

From `app/`, with existing pinned dependencies:

```sh
node scripts/original-mutual-followers.mjs --check
node --test tests/original_mutual_followers.test.mjs
```

`--write` authenticates fixed original manifest/index/registration bytes and
the actual callback, signal/credential/error hook and declaration chain before
atomically replacing the derived contract. It never refreshes captures.

Fourteen domain tests cover artifact/range/implementation integrity and actual
capture tampering, raw viewer-key/default/enablement behavior, fresh request
containers, pass-through JSON, declared-schema versus client behavior, and the
plain-error hook. Real loopback HTTP exercises first-page wire/options and raw
server-total/hasMore fields, non-OK invalid-JSON handling through the existing
PR691 decoder, and pending-fetch cancellation.

Loopback transport, payloads and parser controls are explicitly local test
design, not captured production replies, auth, browser-cookie behavior or a
Ky/Zod replacement. TanStack timing/hash behavior, complete network coverage,
UI mounting and visual parity are not qualified. No TSX/CSS or screenshot is
changed. Full app build/browser aggregate remains coordinator-owned and is
not claimed on this head.

This unit is independent of PR767's list/search/local-page workflow and
PR816's counts/cache/bounty projection; it imports neither implementation.
There is no API/native/feature-completion credit or ledger edit. No mutation,
live production call, wallet operation, SDK/Rust/source-capture change or
deployment occurs.
