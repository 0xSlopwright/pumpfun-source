# Original 50ms profile coalescer and cache-backed query

This reconstructs **782067.H/T/V/J**: its lax direct profile read, pending-waiter
coalescer, address/user-ID index and cache-backed query options. These used
behaviors previously lived only in inert recovered factories. The new adapter
requires explicit HTTP, timer and cache capabilities; it does not create a query
engine, production transport or session.

## Source and prerequisite

All **11 physical 782067 variants / 11 origins** are retained separately in
[contract.json](contract.json). The producer authenticates their actual exports,
HTTP constructor, fixed query URL, 50ms timer, 100-key flush loop, alias imports,
query defaults and verbatim resolver/read/index fragments. It also binds seven
actual caller variants: three **779897** variants call T; **238128** calls T twice;
three **300983** variants call H and V. These import/call bindings do not select
an active runtime winner or establish rendered UI parity. Search dialog behavior
and its other query hooks remain outside this unit.

The exact prerequisite is **#870 public commit
`e46c14ea3857da7ef6eecc9f7945622f5dbcfc39`**, retained unchanged in the prerequisite ancestry. Its six files
are unchanged and receive zero new recovery credit. The implementation uses its
real `UserFetchError`, user key and alias helper, preserving shared type/cache
identity. The strict **544930/#901** reader is neither copied nor called here;
the two captured clients have different parsers, status classifications and
empty-input behavior.

H calls **30181.K → 402030/898661** with an explicit server URL. T resolves
through its fixed `https://frontend-api-v3.pump.fun` URL. The catalog's existing
`publicRead('profiles.read')` batch declaration is retained separately. Shared
source/schema/HTTP/error tooling (#686/#691) and #870 are credited dependencies,
not new API coverage. `scripts/original-profile-coalescer.mjs` reconstructs the
source-bound artifact from authenticated AST; no captured JS is evaluated.

## Executable module boundary

`createProfileBatchReader({createClient, schedule})` creates one reader instance
representing one original module context. A host must reuse it to share that
context's pending queue. `createClient({clientServerUrl})` returns the required
operation/options HTTP function; `schedule(callback, delayMs)` is the supplied
timer primitive. There is no default network capability or timer engine.

The returned `fetchBatch(serverUrl, identifiers)` corresponds to H. It removes
duplicates and falsy identifiers, returns an empty array without HTTP when none
remain, and otherwise sends `POST /users/batch` with credentials `same-origin`.
H itself does not chunk or enforce the declared 100-address maximum; the
coalesced flush below supplies its own 100-key batches.
It supplies the source's response hook and parseJson override. A non-OK status
throws shared UserFetchError: 404 is `not_found`, others `http_error`. Successful
blank bodies are not inspected by that hook; native JSON parsing can fail.
The lax parser accepts a bare array or wrapped users array, returns an empty
array for other valid JSON shapes, and preserves native SyntaxError for malformed
JSON. It does not validate user-row DTOs.

`indexProfiles(rows)` corresponds to V. It indexes truthy address and userId,
in that order for each row, with later rows winning collisions. Username is not
an index key. `profileBatchKey(value)` corresponds to J's raw
`['user-profile-batch', value]` construction.

## Queue and query behavior

`reader.queryOptions(queryClient, {address, enabled})` corresponds to T. Its async
callback queues `address ?? ''` in the per-origin resolver. The first pending key
schedules a **50ms** flush. Duplicate keys retain all waiters but share a request.
The flush clears its timer marker and swaps in a new pending Map **before**
issuing requests, so reads arriving during HTTP enter a separate window.

Each flush partitions unique queued keys into **100-key** requests. Chunks settle
independently: each indexes its own returned profiles and resolves every waiter
to the matching address/userId or null; a chunk failure rejects only that
chunk's waiters with the same error. No sibling cancellation, all-chunk barrier,
additional retry or cross-window result cache is invented.

A successful query warms truthy `[profile.address, ...userAliases(profile,
profile.address)]` keys with `current ?? profile`. Existing values, including
false/zero/empty string, survive. A UUID-shaped address still warms its **own**
key even though the shared alias helper suppresses the other aliases. Missing
profiles return null without hydration.

Query options preserve the raw address key (`address ?? ''`), default enablement,
300s stale time, user-cache initialData and dataUpdatedAt, and retry only while
count<1 with typed 4xx blocked. The callback takes no query signal and adds no
cancellation or target-generation guard. TanStack hashing/scheduling, React
Compiler memo-slot reuse, effect lifecycle and browser cookies remain external.

## Validation and limits

From `app`:

```sh
node scripts/original-profile-coalescer.mjs --check
node --test tests/original_profile_coalescer.test.mjs \
  tests/original_profile_lookup.test.mjs
```

Sixteen novel domain tests authenticate source/ranges/dependency and reject a
changed capture. Controlled timer ports verify the exact delay, duplicate
waiters, queue snapshots, independent 100/1 chunks, missing/index collisions,
alias updates and initial query cache behavior. Three real loopback HTTP
scenarios verify real-timer coalescing, JSON-error fan-out versus invalid-shape
null, and typed 404 fan-out. The native test transport redirects only its own
injected capability to loopback; no request reaches the captured service URL.
Rows are local test inputs, not production records or compatibility fixtures.

No server, auth/provider, production POST, mutation, UI mount, feature-ledger
milestone or API compatibility qualification is included. Full Next
build/browser validation was not run on this head; aggregate qualification
remains separate. The receipt records exact file hashes, prerequisite blobs,
commands and test counts.
