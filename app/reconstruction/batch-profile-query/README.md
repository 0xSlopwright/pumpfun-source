# Original batch-profile query, fallback and error effect

This reconstructs **576766.f** around the strict batch reader: sorted query
requests/options, error-only individual-profile fallback, 30-second refetch
predicates and a module-scoped error-report effect port. It does not implement
TanStack or mount the surrounding Home/Following UI.

## Exact dependencies and source

The parent is **#901 public commit
`b780d75d17fc1965ab21592d8e77d749e3cd4637`**, which itself retains exact **#870
`e46c14ea3857da7ef6eecc9f7945622f5dbcfc39`**. Their twelve files remain unchanged
and receive **zero new recovery credit**. The new adapter calls the actual
maintained strict reader and shared typed-error/user-key helpers. It does not
duplicate their parser or error class. Dependency files can leave this PR's diff
as those prerequisites merge.

The producer retains all **six physical 576766 variants / seven origins**. It
binds the actual `544930.u` call, `528600.r` typed-error predicate,
`448341.B` user key and `38279.Q.USERS` key function. The latter is exactly
`['users', addresses.join(',')]`. An actual **163807** Home/Following component
invokes this query and consumes its profile rows; that call is attributed
without reconstructing the feed renderer or selecting a runtime variant.

The complete request/origin/catalog/declared profiles.read chain remains in
#901's authenticated artifact. The producer regenerates and compares that
artifact before composing this one, instead of copying its DTO schemas and
claiming another operation. Shared #686/#691 source/HTTP/error tools remain
credited dependencies. No captured JS is evaluated.

[contract.json](contract.json) retains URLs/hashes, original UTF-16/UTF-8 ranges,
verbatim query/effect/fallback fragments, adapter hash and exact dependency-file
hashes. `scripts/original-batch-profile-query.mjs` rebuilds it from authenticated
AST; formatted factory files are not executable inputs.

## Query and result boundaries

`createBatchProfileQuery({transport, now, report})` represents one original
module context, including its two report counters. The transport is passed to
the existing strict reader. Clock and report functions are required host ports,
with no default telemetry or network implementation.

`queryOptions({userAddresses, queryOptions})` copies and sorts addresses using
the host `localeCompare`, keeps duplicates, and builds the captured comma-joined
key. Default enablement is nonempty input; retryOnMount is false. Mount and
window-focus refetch predicates require `query.state.status === 'error'` and
`now - errorUpdatedAt >= 30000`. The retry callback blocks typed 4xx and otherwise
allows count<1. **Caller queryOptions spread last**, including key/function,
enablement and refetch overrides.

The callback snapshots the sorted addresses and calls the strict reader with
only userAddresses. It does not forward the query runtime's signal. HTTP
chunking, status classification and parsing remain the real #901 behavior.

`projectResult(input, queryClient, result)` returns the exact original result
when error is falsy. With a truthy error, it reads single-user cache keys using
the source's joined-then-split identifier list. It filters **only undefined**;
null, false, zero, empty strings and duplicates survive. These cache reads still
occur when result.data is present. Final data is `result.data ?? fallback`, so
an existing empty array wins. Error/status and all other result fields remain.

Raw comma collisions and fallback splitting are preserved. For example,
`['a,b']` and `['a','b']` produce the same key, and the former's fallback reads
separate a/b keys. This records source behavior, not an improved canonicalization
or a claim about valid production identifiers.

## Error-effect port

The host calls `observeError(input, result)` at the captured effect dependency
boundary (error, errorUpdatedAt and derived identifier list). This port does not
schedule effects or infer when React will run them. A falsy error returns without
clock/report activity. The source counters start at zero. Observations less than
30 seconds after the prior report increment a suppressed count and send nothing;
an eligible observation resets the counters and invokes the supplied reporter.

Payload preserves error identity, feature `profile`, operation `users-batch`,
derived addressCount and positive suppressedReports. It does not include the
identifiers. Counters are shared by queries in the same module instance; a new
instance represents a separate source context. Reporter exceptions propagate.
No telemetry is sent by this package or its tests; the test reporter collects
local values only.

## Verification and limits

From `app`:

```sh
node scripts/original-batch-profile-query.mjs --check
node --test tests/original_batch_profile_query.test.mjs \
  tests/original_user_batch.test.mjs tests/original_profile_lookup.test.mjs
```

Fourteen novel tests authenticate source/dependencies and exercise option
overrides, refetch thresholds, typed retry identity, projection/fallback quirks
and reporting counters. Three loopback HTTP scenarios compose the actual strict
reader with sorted duplicate requests, typed failure/cache fallback/report data,
and 101-address 100/1 chunking plus an empty manual read. Test data is synthetic
local input, not captured production or compatibility fixtures.

TanStack hashing/query/effect scheduling, host locale behavior, React memo slots
and browser sessions remain outside the unit. No server, mutation, auth/provider,
production request, telemetry transmission, UI mount, ledger milestone or API
compatibility qualification is included. Full Next build/browser validation was
not run on this head; aggregate qualification is separate. Exact commands,
tested-file hashes and prerequisite blob witnesses are in the validation receipt.
