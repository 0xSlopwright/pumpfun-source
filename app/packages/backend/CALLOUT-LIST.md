# Opt-in single-author callout lists

`GET /v1/callout/list/:userId` now uses the same optional `CalloutsStore` as
[single-callout reads](CALLOUTS.md). It serves public legacy spot-token records
from an operator-owned immutable materialization, not production Pump data.
There is no new default dataset, source adapter, persistence, credential
verification or financial calculation. Without `CALLOUTS_FILE` (or the
programmatic store option), the existing fixture/501 harness is unchanged.

## Evidence, not a recovered backend

Developer OpenAPI **0.294.0**, operation `get_callout_list_by_userId`, binds the
route to `content.read`. The developer binding ledger still marks the website
call origin unresolved; separate original-client research is not a runtime
website adapter here. The developer-key shape gate remains in place; it is not
a website session.

The retained objects and their full hashes, capture timestamp, factory hashes
and provenance checks are documented in `CALLOUTS.md`. Exact additional UTF-16
half-open ranges in those same objects establish this list operation:

- `2b47dd0b38a1608f.js`, factory **957263** `[53841,88580)`, operation binding
  `[74780,74840)`: `publicRead("content.read")`, list query/response contract.
- `3740fc4e7a24596d.js`, factory **735821** `[1201,8886)`, call literal
  `[3021,3049)`: client sends limit/sort/pageToken/window/includeMembers and
  defaults to **30 / TIMESTAMP / DESC / false**. Captured client defaults do
  **not** prove server defaults. Captured code is read/sliced/hashed, not run.

The separate original profile-callout request/page planner from #693 and website
home-feed adapter from #700/#707 are unchanged. This implements neither their
source adapters nor an upstream cursor format. The developer `/home-feed` and
other callout subresources remain outside this store.

## Supported local behavior

- `userId` must match an explicit canonical `authors[].authorId`. Posting-wallet
  aliases and identity resolution are not inferred. Known authors with no
  visible mappable rows return `{callouts: [], nextPageToken: ""}`. Unknown
  authors return explicit local **501 `CALLOUT_LIST_AUTHOR_UNAVAILABLE`**, not
  a claim that a production user is absent.
- Only that author's nonhidden, nondeleted, mappable rows appear. Existing
  visible author-update joins and separately supplied one-level quote
  projections are reused. Unavailable quote targets preserve `quotedCalloutId`
  while their embed is null. Counters are not recomputed from joined rows.
- The list's `user_uuid` is always **empty**, unlike the single read. Optional
  `author` contains canonical author identity, not the posting admin's wallet;
  it is omitted when no nonnull author name is supplied. No flat single-read
  author fields leak into the list. Viewer state stays null; unknown optional
  `viewCount` stays absent and real zero remains zero.
- `limit` accepts canonical positive decimal safe integers, maximum 9007199254740991. Omitted limit/sort use local **30 / TIMESTAMP / DESC** policy,
  aligned with the captured client. Both `ASC` and `DESC` are supported.
  `TIMESTAMP` orders supplied `createdAt` numbers; `MULTIPLE` orders supplied
  `multiple` numbers. Equal values use code-unit callout-ID order in the same
  direction. No multiple, price, ranking score or fallback timestamp is derived.
- `window` is trimmed and case-insensitive. Omitted, empty and `ALLTIME` select
  all local history. `DAILY`, `WEEKLY`, `MONTHLY` and `LAST_ROUND` return explicit
  **501 `CALLOUT_LIST_WINDOW_UNAVAILABLE`**; calendar, rolling and competition
  windows are not guessed.
- `includeMembers=false` selects only the named author, including a group's
  own rows. `true` is ignored for people, but groups return **501
  `CALLOUT_LIST_MEMBERS_UNAVAILABLE`** because no active-membership graph is
  available. `MULTIPLE` plus `includeMembers=true` returns **400** for every
  identity, as the declared contract requires.
- Unknown query keys return 501; repeated keys and malformed known values
  return 400. These strict query/error choices are local policy, not upstream
  error-payload compatibility. No viewer hints or arbitrary filters are accepted.

### Local continuation only

Tokens are versioned base64url envelopes containing a SHA-256 fingerprint of the
admitted immutable input, a fingerprint of the normalized author/query, and an
offset. They contain no raw rows, identities or financial facts. Token format,
ordering, tie-breaking and page-cut/filter order are **local choices**. These are
not signed or secret tokens, authentication, upstream keyset cursors or a
production pagination claim. A caller who constructs another otherwise valid
offset can skip public pages; this is not an authorization boundary.

All supplied data (including observation time and input ordering) binds the
snapshot; reimporting different data can invalidate a token. Resend the same
normalized query on every page, including `includeMembers`, even on a person.
Tokens from a different author, dataset, limit or sort are rejected with local
400 `CALLOUT_LIST_PAGE_TOKEN_INVALID`; malformed, noncanonical and out-of-range
positions are also rejected. Empty token starts a fresh list. The final token is
always `""`, never omitted. Filtering precedes page cutting locally; the
contract's potentially short hydration pages and original client length-based
termination discrepancy are **not reproduced**. Clients should follow the
returned token, not infer completion from array length.

### Optional supplied tail measurements

Existing schemaVersion 1 inputs remain accepted. A callout record can now supply
an optional `tailFacts` object containing any subset of the 16 documented list
tail fields (buyers, cohorts, PnL, ATH and histograms). Each supplied field must
conform to the exact list DTO; extra fields are rejected recursively. Finite
numbers are required, counts must be nonnegative safe integers, and ATH totals
cannot be negative. Supplied negative PnL is valid. All omitted tail fields become
**null (unavailable locally)**, never fabricated zero or empty histograms. The
single read remains unchanged and does not emit list-only fields.

This is structural admission, not proof of provenance or financial correctness.
There is no upstream attribution engine, horizon clock, bucket algorithm,
cohort calculation, histogram-sum reconciliation, ATH pricing or rounding
implementation. A materializer is responsible for supplying coherent public
measurements. No metric is recomputed, and null does not establish why a value
is unavailable in production. Inputs and all nested outputs are cloned.

## Validation and qualification limits

The regression suite covers exact response-schema conformance, group/actor
identity, visible rows/author updates/quotes, unknown-vs-zero measurements,
input/output isolation, ordering ties, continuation traversal/query/snapshot
binding, strict query handling, unsupported windows/member expansion, API-key
shape gate, no-adapter fixture behavior and configured-store precedence. Source
checks verify the exact factory ranges and operation literals, distinguish
client defaults from absent server defaults, and preserve unqualified counts.

Backend full-suite/build/typecheck results are recorded with the PR. These are
synthetic local checks, not captured native-response qualification. No full
frontend/workspace/evidence parity, production reads, authenticated account,
RPC, wallet/signing, mutation or deployment validation is claimed. The coverage
ledger adds only a partial local read-model slice; native/qualified operation
counts and feature-completion milestones remain unchanged.
