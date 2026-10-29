# Original follow-count query and consumed bounty gate

This independently maintained client reconstructs two count reads and the
actual retained consumer that turns a follower count into bounty UI state.
It exposes executable query options, a local cache update and a state
projection. It installs no transport, auth/flag provider, endpoint, server
authorization decision or UI mount.

The original JavaScript remains attributed to its original authors. Captured
factories are parsed as inert AST, never imported or evaluated. Original
TypeScript, file paths and server implementation remain unknown.

## Source and used boundary

`633113` is retained in two physical source variants, both explicitly bound:

| Capture object | Factory hash | Role |
| --- | --- | --- |
| `eb0b23ee6feb7543.js` | `9036b9b6...` | count request/key/query/cache updater |
| `95be9180237024f4.js` | `382fda1d...` | separately retained count variant |

Both expose `H` (read), `D`/`q` (followers/following queries), `h` (cache key)
and `U` (local optimistic count update). They invoke `759257.j` for:

- `GET /following/v3/followers/count/{userId}`
- `GET /following/v3/following/count/{userId}`

The complete original URL/hash/UTF-16/UTF-8 ranges and verbatim expressions are
in [contract.json](contract.json). No active runtime winner is selected, and
the different factory hashes are never relabeled as raw-identical source.

The actual `18107` consumer invokes `633113.H('followers', userId)`, catches
only the contract-error predicate from `402030`, and supplies a different
query key from `38279.Q.PUMP_FOLLOWERS_COUNT`. Its co-registered `635666`
exports the default10 classifier and messages. The actual importing UI
consumer is **544191.f**: it calls `18107.z`, destructures
isBlocked/followersCount/minFollowers and chooses a notice or null.
`532688` is another registration in that shared factory and is an attachment
lazyloader; it is not relabeled as the gate consumer.

`18107.z` reads `BOUNTY_PUMP_FOLLOWER_GATE` with a true fallback and obtains a
viewer key from `779106.f('bounty-follower-gate')`. This unit records those
provider boundaries. A caller must deliberately supply the flag and viewer
key; no signed-in identity, wallet ownership or LaunchDarkly state is invented.
The registration/import/dataflow proof does not establish initial route
reachability, an observed rendered workflow, or original visual parity.

The service declaration is the retained
`https://frontend-api-v3.pump.fun` literal. `759257.j` contributes same-origin
credentials over the shared HTTP constructor's include default; neither count
reader overrides that option. Lower-level transport/path/query/JSON semantics
were recovered in PR684/686. The existing PR691 error decoder is reused as a
runtime dependency and hash-bound, without duplicate decoder recovery credit.

## Use with explicit capabilities

```js
import { followCountQueryOptions, bountyFollowerGateQueryOptions,
  projectBountyFollowerGate, applyFollowCountDelta } from './client.mjs';

function queries(transport, publicSubject, viewerKey, flagEnabled) {
  return {
    followers: followCountQueryOptions(transport, publicSubject, 'followers'),
    bounty: bountyFollowerGateQueryOptions(transport, flagEnabled, viewerKey),
  };
}
// transport(operation,{params,signal}) returns the website-client-shaped JSON.
// No destination or network operation is selected until the caller supplies it
// and invokes queryFn. The consumer owns its query runtime and data lifecycle.
const view = projectBountyFollowerGate(true, 'explicit-key', {
  data: 9, isLoading: false,
});
// {enabled:true,eligibility:'ineligible',isBlocked:true,
//  followersCount:9,minFollowers:10,isLoading:false}
```

The query result supplied to the projection must belong to its returned key.
The module does not create a cache, React/TanStack scheduler, fetch, cookies,
session or feature-flag client. Public query subjects are not ownership proof.

## Preserved differences and quirks

| Boundary | Retained behavior |
| --- | --- |
| Ordinary count key | `['follow-count',type,userId??'']`; truthy-subject/default-enabled policy. The callback has no extra manual-call guard. |
| Ordinary query | staleTime60000, explicit refetchOnWindowFocusfalse, exact AbortSignal forwarding. |
| Count extraction | `typeof count==='number' && Number.isFinite(count)`; otherwise null. Missing payload itself still throws on property access. Original repeated count reads remain repeated. |
| Declaration | `params:{userId:string}`, `response:{count:number}`. No minimum string length, integer, nonnegative or safe-integer constraint is invented. |
| Local cache update | For numeric cached data use `Math.max(0,cached+delta)`; other data retains identity. No finite check or extra delta validation is added. Keys remain partitioned by type/user. |
| Bounty key | `['follow','followersCount',userId??null]`, distinct from ordinary counts. |
| Bounty query | staleTime60000; no explicit focus override. Its callback ignores query context and does **not** forward an AbortSignal. |
| Bounty errors | Actual maintained ContractError becomes null; other errors retain identity. A same-named ordinary object is not that class. |
| UI projection | Feature flag and viewer presence decide whether count/loading are used. Invalid/non-finite/negative count means unknown; finite0..9 means ineligible;10+ eligible. Only ineligible blocks. Enabled reports flag state even without a viewer. |

The count declaration and ordinary client both permit negative or fractional
finite numbers; the bounty UI separately treats negative counts as unknown.
These are preserved predicates, not observed production count values. The
source's error-to-unknown/unblocked UI state is not a server authorization
policy or a claim that any action would be accepted.

The original exported message helpers are also retained, including singular1
and the positive-number-only minimum fallback. They are formatters, not count
or server validators. No stronger validation is substituted.

`applyFollowCountDelta` invokes only an explicit query-cache capability. It
does not follow/unfollow anyone or send a server mutation. The surrounding
follow/unfollow workflow, invalidation lifecycle and authenticated actions are
outside this unit.

## Verification

From `app/`, with the existing pinned dependencies:

```sh
node scripts/original-follow-counts.mjs --check
node --test tests/original_follow_counts.test.mjs
```

`--write` reauthenticates the fixed manifest/index, each exact registration,
selected raw sources, used imports/exports and bounded schema expressions
before atomically replacing the derived contract. It never refreshes captures.
Tests authenticate every verbatim source range, implementation/dependency
hash, both count contexts and the actual544191 consumer; changed original
bytes in a temporary copy fail closed.

Seventeen domain tests cover finite/declaration/UI predicates, 72 projection
combinations, request/enablement/keys/policy, local cache isolation, coercion
quirks, actual ContractError class behavior and the absent bounty signal/focus
override. Real loopback HTTP reads exercise request→count→gate projection,
the maintained PR691 error decoder, pending-fetch cancellation and the
source's dropped-signal behavior. Loopback transport, JSON and parser controls
are explicitly local test design, not captured production replies or a Zod,
Ky, server, authentication or browser-cookie compatibility claim.

No TSX/CSS/route or screenshot is changed. Full build/browser aggregate remains
coordinator-owned; this packet claims only its recorded scoped checks. No new
API operation, milestone status, native implementation, compatibility or
completion score is credited. The GO contract milestone only gains a pointer
to this additional bounded source evidence.

PR767's follow-list workflow is related but not a prerequisite: it implements
four list/search reads and local row paging, while this independent unit
implements counts/cache and their retained bounty-state consumer. No
follow-list implementation is duplicated. Existing backend graph/profile
models, paused work, SDK/Rust sources, captures and qualification counts remain
unchanged.
