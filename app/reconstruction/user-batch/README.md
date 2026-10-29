# Original strict batch-user read

This reconstructs **544930.u**, the captured strict `POST /users/batch` read
helper. It adds the request/response parser and concurrent 100-address chunk
behavior, with actual caller attribution and loopback HTTP tests. The separate
**782067** lax 50ms microbatch resolver is excluded; its empty-input, parser and
scheduling behavior must not be inferred from this helper.

## Exact prerequisite and source

This unit is stacked on **#870**, exact public commit
`e46c14ea3857da7ef6eecc9f7945622f5dbcfc39`. Its six original profile-lookup files
remain byte-for-byte unchanged and receive **zero new recovery credit**. The new
client imports `UserFetchError` from that existing implementation, preserving one
class identity across typed lookup/retry consumers. It neither duplicates the
class nor substitutes a synthetic test constructor. The PR diff can drop those
prerequisite files when #870 merges.

The strict helper is factory
`aa22afc498c4a8e70e5e26788ba7bb5875b179ec5441203f42a12cbb675cf0d9`
in `evidence/web/objects/020facfab961bf67.js`. Its actual imports link
`528600.M` and `759257.j`. The latter follows the existing
`503630.R/30181.K → 402030/898661` origin/catalog/JSON pipeline. The website
origin is `https://frontend-api-v3.pump.fun`, with no production transport created
by this adapter.

All **six 576766 variants / seven origins** invoke this helper, as does **795663**
in the same capture. Their surrounding query/cache/wallet-mapping behaviors are
not reimplemented here. Source records keep every caller origin distinct; they
do not select an active runtime winner or claim rendered reachability.

The existing **941660.usersRoutes** declaration wraps this POST as
`publicRead('profiles.read', ...)`, with at most 100 string addresses per body
and an array of user-row DTOs as response. This is a read declaration, not a new
mutation or authentication implementation. Shared source/schema/HTTP/error
recovery (#686/#691) and the prerequisite #870 are credited dependencies.

[contract.json](contract.json) binds original capture URLs/hashes, factory hashes,
UTF-16/UTF-8 ranges and verbatim fragments, the maintained adapter hash and the
exact prerequisite file hash. `scripts/original-user-batch.mjs` regenerates it
from authenticated AST. No captured JS is imported or evaluated.

## Executable behavior

`fetchUsersBatch(transport, {userAddresses, fetchOptions})` uses a required
website-client-shaped `(operation, options)` transport. An input of **0–100**
addresses sends one request, including an empty array. Larger inputs are sliced
in 100-address chunks and all requests start under `Promise.all`. Results flatten
in chunk order, regardless of completion order. Duplicate input addresses and
returned rows remain. A rejected chunk rejects the aggregate; sibling requests
are not implicitly cancelled.

The base options contain body `{addresses}` and a JSON Content-Type header.
**Caller fetchOptions spread next**, so they can replace body/headers and supply
signal, credentials, retry or other options. The helper then forces
`throwHttpErrors: false`, its strict `parseJson` and its sole response hook. It
does not invent credential or HTTP-retry defaults; absent overrides are delegated
to the supplied j-shaped transport.

The response hook checks status before reading a clone. Every non-OK status,
including **404**, throws shared `UserFetchError` with reason `http_error` and its
status. This differs from single-user lookup's 404 `not_found`; the shared class
does not erase that distinction. A cloned successful blank body throws
`empty_body` without a status, leaving the original response available to parse.

The strict parser distinguishes blank text, invalid JSON and invalid shape.
Bare arrays and objects containing a `users` array are accepted, without row
validation; other JSON shapes throw `invalid_shape`. This differs from the lax
782067 parser, which can return an empty array for an invalid shape. The shared
errors have no response property, so the existing error normalizer preserves
their identity. Other transport/body-read failures propagate.

## Verification and limits

From `app`:

```sh
node scripts/original-user-batch.mjs --check
node --test tests/original_user_batch.test.mjs tests/original_profile_lookup.test.mjs
```

The **12 novel domain tests** authenticate source/ranges/dependency identity,
reject a modified capture, distinguish parser/status failures, preserve option
precedence, verify empty/duplicate inputs, and check chunk order and rejection.
They also exercise three real loopback HTTP scenarios: 205 addresses across
concurrent chunks plus an empty read; typed status/blank/JSON/shape failures;
and exact cancellation. The inherited profile tests remain separate dependency
qualification. Test rows/addresses are local synthetic inputs, not captured
production users or compatibility fixtures.

The test transport is native fetch with response-hook/parseJson ordering, not
captured Ky, a query engine or browser cookies. A real host must supply those
capabilities. No production POST, server, mutation, session/auth provider,
surrounding wallet/query implementation, UI mount, ledger milestone or API
compatibility credit is included. The declarations are retained separately from
the raw parser. Full Next build/browser validation was not run on this head;
aggregate qualification remains separate. The validation receipt records exact
file hashes, commands and prerequisite attribution.
