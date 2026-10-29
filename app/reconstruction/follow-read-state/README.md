# Original reciprocal follow reads and initial state

This reconstructs the used initial/read portions of captured **350989.f**:
forward and reciprocal `GET /following/single/{id}` callbacks, initial flags and
the initial/skip-fetch effect decision. They were previously present only inside
an inert recovered hook bundled with mutation behavior. The maintained adapter
contains only reads; follow/unfollow actions, CAPTCHA, analytics, mutation cache
updates and post-mutation reconciliation remain outside it.

## Original source closure

The entry is the actual **350989.f** registration in
`evidence/web/objects/eb0b23ee6feb7543.js`, factory hash
`32ecd36e6cb92106cf0cdde6c7382658933cbdb728d3a88d6a07a8ac0bd3d4fc`.
The same factory also registers the distinct list and mutual-query modules
recovered in #767/#854; those workflows are not reimplemented here.

Actual consumers **31802**, **950766**, **392089** and two physical **229937**
variants invoke this hook and destructure its returned state/action callbacks.
For example, 31802 can hide the button until `isReady`, and 950766 uses
`isLoggedIn && !isReady` in its pending state. These are source-backed consumers,
not a claim that this unit mounts or renders the original buttons or author menu.
The reciprocal request is started by the hook even when a consumer does not use
the `isFollowedBack` result.

The trace continues through **759257.j → 30181.K → 402030/898661**, including the
actual catalog membership and JSON-return boundary. `503630.R` supplies the
website service origin `https://frontend-api-v3.pump.fun`. The callbacks do not
override the shared GET credential/retry/timeout defaults. This common transport
and the existing **972407** `publicRead('graph.read', ...)` route declaration are
credited prior reconstruction, including #686/#691, rather than new API coverage.

The captured viewer-key resolver **779106 → 92245** selects a trimmed user ID,
then trimmed address, then null, from an external identity store. Here the host
supplies that key explicitly. A key used in a query parameter is not evidence of
a real session, principal ownership or backend authorization.

[contract.json](contract.json) retains exact source URLs/hashes, factory hashes,
UTF-16/UTF-8 ranges and verbatim fragments, plus the maintained adapter hash and
bounded route declarations. `scripts/original-follow-read-state.mjs` reconstructs
the artifact from authenticated original AST. No original factory is executed,
and no physical variant is arbitrarily selected as the running UI.

## Executable behavior

`initialFollowReadState(options)` returns the three initial flags. Following and
followed-back use `?? false`; readiness is initially true only when
`skipInitialFetch` is truthy and `initialIsFollowing !== undefined`. Defined false
therefore differs from absent. A null initial flag starts as false but is still
considered defined by the effect, which later passes the raw null to its setter.

`followReadCallbacks(transport, {target, viewerKey}, setters)` captures the two
request values and returns async `fetchIsFollowing`/`fetchIsFollowedBack` methods.
The required transport accepts `(operation, options)` and returns raw JSON; the
setters are `setFollowing`, `setFollowedBack` and `setReady`.

| Callback              | Path `id`  | Query `userId` | State update                                            |
| --------------------- | ---------- | -------------- | ------------------------------------------------------- |
| `fetchIsFollowing`    | target     | viewer key     | `setFollowing(!!follow)`; `setReady(true)` in `finally` |
| `fetchIsFollowedBack` | viewer key | target         | `setFollowedBack(!!follow)`; no readiness change        |

Both guard against missing/falsy target or viewer, send the captured
`Content-Type: application/json` header and set `throwHttpErrors: false`.
Neither adds a signal or schema parser. A valid JSON body is consumed even on a
non-OK HTTP status: absent/null `follow` becomes false; an object, array or other
truthy value becomes true. JSON/network/destructuring failures propagate. An
attempted forward read marks ready even after a failure; a guarded no-op does
not. Reverse failures leave readiness unchanged. The declared nullable follow
row is retained as a declaration, not enforced by these callbacks.

`applyFollowReadEffect(input, reads, setters)` reconstructs the synchronous effect
decision. Input contains target, viewer key, options and an optional opaque
`lastActionTarget` (initial ref value null). It neither performs a mutation nor
changes that marker. In skip mode, a matching marker suppresses updates;
otherwise only defined initial flags are reused, and only a defined following
flag sets ready. In normal mode, a viewer key starts forward then reverse;
without a viewer, it sets ready immediately.

The effect ports are synchronous **start functions**. As in the source, the
effect does not await or aggregate either async read. A host must explicitly
observe rejections; this unit does not invent an error UI or a `Promise.all`
completion/readiness rule. React dependency scheduling, effect lifecycle and
cleanup remain outside the adapter. There is no cancellation or target-generation
check; a late callback retains its original target/viewer and can still update
the supplied setters. These source quirks are preserved, not presented as a
recommendation or a confirmed backend defect.

## Validation

From `app`:

```sh
node scripts/original-follow-read-state.mjs --check
node --test tests/original_follow_read_state.test.mjs
```

The domain suite authenticates source ranges, rejects a tampered capture, and
checks all initial/skip/guard cases, operand reversal, raw truthiness, error and
setter propagation, callback snapshots, late responses and non-awaiting effect
ports. Three real loopback HTTP scenarios exercise encoded path/query operands,
concurrent reads with a delayed reverse response, non-OK valid JSON and malformed
JSON with asymmetric readiness updates. Every test server is loopback-only; the
test transport is native fetch, not captured Ky or a browser cookie jar.

No production request, mutation, auth provider, server, UI mount, ledger change
or native/API compatibility qualification is included. Source consumers do not
establish full rendered route reachability. Full Next build/browser validation
was not run on this head; aggregate validation remains separate. See the
checked-in validation receipt for exact tested file hashes and commands.
