# Original profile lookup, typed failures and cache aliases

This reconstructs the used read/query boundaries of captured modules **528600**
and **448341**. It provides an executable adapter for profile reads, existence
checks and query-cache hydration. Previously these behaviors were available only
inside inert recovered factories. No captured JavaScript is imported or evaluated.

The bounded source trace includes all three retained client variants and four
actual **154121.f** profile-presentation callers. Those callers invoke
**528600.U** when an address is present, the presentation is enabled, and no user
was supplied. The returned profile feeds their display-name/avatar/X-username
fallback logic. This unit recovers their lookup dependency; it does not mount or
reconstruct the presentation component or its other verification/image helpers.

## Source and service boundary

| Source                                                                        | Role                                                                                |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 528600 in `d048caae282716b0.js`, `7128bd47b219d222.js`, `27a1ee00eb5909ec.js` | Three physical request/error/query variants, retaining separate provenance          |
| 448341 in those same factories                                                | Raw `['user', identifier]` key and alias selection                                  |
| 136354 in those same captures                                                 | `UserConfigProvider`/`useUserConfig`; receives a URL, with no URL default           |
| 786480 in `1e479323ffe53c14.js`                                               | Case-insensitive UUID-shaped-address predicate used to suppress alias hydration     |
| 154121 in four captured variants                                              | Actual configured-lookup callers                                                    |
| 589428 in `9bafadffbe6dc98b.js` → 503630.R                                    | One actual application-provider context supplies `https://frontend-api-v3.pump.fun` |
| 30181.K → 402030 → 898661                                                     | Existing shared HTTP constructor, route catalog and JSON/error pipeline             |
| 941660 → 896727.userRow                                                       | Existing `publicRead('profiles.read', ...)` declaration for `GET /users/{id}`       |

All filenames above are below `evidence/web/objects/`. [contract.json](contract.json)
retains capture URLs/hashes, factory hashes, UTF-16 and UTF-8 ranges, verbatim
fragments, the maintained adapter hash and the bounded declarative response.
`scripts/original-profile-lookup.mjs` rebuilds that artifact from authenticated
original AST, not the formatted recovered files. It checks actual registrations,
imports and calls. No active runtime winner is selected among physical variants.

The common constructor/transport and declaration tooling are dependencies from
the maintained reconstruction, including #686/#691. Their previous recovery is
not new work here. The declaration already belongs to the developer contract
ledger; this unit adds no operation, feature milestone or compatibility credit.

## Executable boundary

The caller must supply `createClient({clientServerUrl})`, returning an async
`(operation, options) => rawJson` function compatible with the captured K client.
The query form also requires a cache exposing `setQueryData(key, updater)`.
There is no implicit URL, production transport, cookie jar or auth provider.

```js
import { fetchUser, userExistence, userQueryOptions } from "./client.mjs";

// createClient and queryClient are explicit capabilities supplied by the host.
const profile = await fetchUser(createClient, {
  clientServerUrl,
  userIdentifier,
  fetchOptions: { signal },
});
const state = await userExistence(createClient, {
  clientServerUrl,
  userIdentifier,
}); // 'exists', 'missing', or 'unknown'
const options = userQueryOptions(createClient, queryClient, {
  clientServerUrl,
  userIdentifier,
});
```

`fetchUser` spreads `fetchOptions` first, then replaces `params` with the raw
identifier, selects `fetchOptions.credentials ?? 'same-origin'`, forces HTTP
`retry: 0`, and replaces response hooks with its own guard. Other supplied
options, including a direct `signal`, survive. The credential fallback overrides
K's base `include` setting. Neither credential string establishes authorization.

The async guard checks status before reading a body. Any non-OK response throws
`UserFetchError`, with reason `not_found` only for status 404 and `http_error`
otherwise. A successful response whose cloned text trims to an empty string
throws `empty_body` without a status. The original response stays available for
JSON decoding. A `SyntaxError` thrown anywhere in the request try block becomes
`invalid_json`; other thrown values retain their identity. The error has no
`response` property, so the prior #691 normalizer preserves it. There is no
invented cause or copied error body.

The existence helper returns `missing` only for the typed not-found predicate,
`unknown` for all other failures, and `exists` for any successful raw result,
including JSON `null`. It is not a profile-schema check. The query callback still
accesses returned profile fields; a null success consequently fails there rather
than becoming an empty profile.

## Query and alias behavior

The default key is exactly `['user', userIdentifier]`; it includes neither a
viewer nor the service URL. Undefined, null and empty identifiers are retained
as distinct raw values here. This records the captured key construction, not
TanStack hashing behavior or a privacy guarantee.

Default enablement is `(enabled ?? true) && !!userIdentifier`; mount/window-focus
refetch are false. The retry callback stops typed 400–499 failures and otherwise
returns `failureCount < 3`. **Caller `queryOptions` spread last**, so they can
override enablement, key, retry, query function and any other default. No stale
time is invented.

The query callback captures URL and identifier, fetches the raw user, then warms
aliases in `userId`, `address`, `username` order. It keeps truthy values unequal
to the requested identifier and retains duplicates. A UUID-shaped address
suppresses all aliases; this predicate is not a wallet-validity check. Each
update is `current ?? fetchedUser`, preserving existing objects, false, zero
and empty strings. Cache-write failures propagate. The callback does not take
the query runtime's signal; direct fetch cancellation and query cancellation
are deliberately distinct.

## Verification and limits

From `app`:

```sh
node scripts/original-profile-lookup.mjs --check
node --test tests/original_profile_lookup.test.mjs
node --test tests/original_source.test.mjs tests/original_schema.test.mjs \
  tests/original_contract_http_errors.test.mjs \
  tests/original_contract_http_error_source.test.mjs
```

The focused suite checks source/range/hash binding and capture tampering, all
error/existence categories, option precedence, callback snapshots, ordered and
duplicate aliases, nullish cache updates, and declaration-versus-client behavior.
Three isolated loopback HTTP scenarios exercise encoded path parameters, real
native Response cloning/JSON parsing, 404/403/503, empty 200/204 bodies, malformed
JSON, raw null success and direct cancellation. The test capability executes
hooks before JSON and uses the maintained error decoder; it is not a Ky engine,
query scheduler, browser cookie jar or production response fixture.

No production request, server implementation, mutation, wallet/auth provider,
frontend mount or ledger change is included. React Compiler memo-slot reuse,
TanStack scheduling/hashing, browser sessions, full route reachability and
backend authorization/data remain outside this unit. A successful typecheck or
finite loopback run does not establish rendered parity or API compatibility.
Full Next build/browser validation belongs to the shared aggregate run and is
not claimed on this PR head.
