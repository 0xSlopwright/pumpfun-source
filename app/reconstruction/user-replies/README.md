# Original user-reply read, context mapping and keyset pages

This reconstructs the exported read/normalization workflow in captured modules
**287129** and **546803**. The shared factory is stored under filename 236315,
but **236315 itself is a separate mutation-hook registration**. Its mutation,
retry and optimistic-cache behavior is excluded.

The new maintained adapter provides the actual reply-list request, a page
result, reply/parent/callout normalization, a parent-first context preview and
infinite-query options. Previously these behaviors were available only inside
an inert recovered factory. It requires an explicitly injected website-client
transport; it supplies no server, production transport or cookie session.

## Source and reachability

The read and query registrations share factory hash
`75ce27324808ccd2b5cba5c591747c4c99cfdf42bc43ebdf06b5253c54a29ecb` in
`evidence/web/objects/84bc29ea82bc5a21.js`.

| Registration/export | Reconstructed boundary                                                     |
| ------------------- | -------------------------------------------------------------------------- |
| 287129.v            | `GET /callout/replies/list/{userId}`, default limit 30, mapped page result |
| 287129.j/m          | Reply-row and callout-context mapping                                      |
| 287129.g            | Parent-first reply-context preview, including tombstones                   |
| 546803.r            | Query callback/options, cursor continuation and ordered page flattening    |

Actual captured **349919** invokes `287129.g` for its reply-row preview. Actual
**16503** invokes `287129.j`/`m` in feed-entry mapping. These are bounded static
consumer bindings, not a rendered route or a UI mount. **No importing UI caller
for 546803 was found in the retained inventory.** Its registered query export is
therefore the explicit entry boundary, without an invented profile-tab caller.

The request traces through `759257.j → 503630.R/30181.K → 402030/898661`, with
actual catalog inclusion from **957263.calloutRoutes**. The website service URL
is `https://frontend-api-v3.pump.fun`; this adapter makes no default request to it.
The existing declaration wraps the operation with `publicRead('content.read')`
and closes through 13 DTO definitions. It declares optional filter
`ALL|REPLIES|QUOTES`; **this particular captured client does not send filter**.

Shared source/schema/transport recovery, including #686/#691, and that existing
operation declaration are credited dependencies. The new work is the executable
request/page/normalization behavior. No operation or ledger credit is added.

[contract.json](contract.json) binds the original capture URLs/hashes, factory
hashes, UTF-16/UTF-8 ranges and verbatim read fragments, the maintained adapter
hash and complete bounded declarations. `scripts/original-user-replies.mjs`
rebuilds it from authenticated AST. Original JS is never evaluated; shared
mutation code is not included in the attributed read fragments.

## Request and page behavior

`fetchUserReplies(transport, input)` calls the required `(operation, options)`
transport. Input accepts userId, limit (default 30 only when undefined), beforeId,
includeMembers (default false) and signal. Falsy cursors/member values become
undefined query values, and truthy member mode is repeated on every page.
Credentials are explicitly `include`, the captured JSON Content-Type header is
sent, and the exact signal is forwarded. Authentication is not inferred from
that credential setting.

The response hook replaces **404** with a fresh native 200 JSON Response
containing `{replies: []}` before normal JSON parsing. Thus a malformed original
404 body can become an empty page. Other non-OK statuses throw a plain Error with
the status; it has no response property for the shared error decoder to wrap.
Malformed successful JSON and transport/abort failures propagate. A host
transport must implement response-hook replacement and the shared error order;
those behaviors are not a generic fetch guarantee.

After the request, `replies ?? []` supplies only a nullish fallback. Non-array
values and invalid row shapes retain their source failures. Rows preserve wire
order and duplicates. `nextBeforeId` comes from the last **raw** row's reply ID;
`hasMore` is `rawRows.length >= limit`. Continuation requires both hasMore and a
truthy cursor; there is no synthesized total, cursor validation or last-page
deduplication.

The query options preserve
`['callouts', 'user-replies', userId ?? null, limit, includeMembers]`, a truthy
userId plus default enablement, undefined initial page parameter, 60s stale time,
300s GC time and disabled window-focus refetch. The callback guards missing IDs,
forwards pageParam/signal, and page selection concatenates rows in order. A
viewer key is not part of the captured key. TanStack hashing/scheduling and
React Compiler memo-slot reuse remain external.

## Mapping details

Reply user identity prefers a trimmed wallet, then cc user ID, then empty string;
the cc ID is also retained separately when truthy. Content and reply avatar are
not trimmed; username and wallet are. Nullish count/liked/media fields become
0/false/null without coercing other raw values. Reply timestamps use finite
Date.parse or zero, retaining negative finite timestamps. The nested-callout
timestamp instead becomes null unless positive. The host JS date parser is
used; no extra date grammar is invented.

The outer callout context trims author fields and thesis. A parent is a tombstone
only when its raw marker is exactly true, in which case its mapped reply is null.
Root-message presence uses `!= null`, so even an empty string is considered
nested. Context previews prioritize a parent, including a deleted parent, over
the callout. A deleted parent does not silently fall back to an available
callout's author/text.

## Validation and limits

From `app`:

```sh
node scripts/original-user-replies.mjs --check
node --test tests/original_user_replies.test.mjs
```

Tests authenticate source/ranges and reject capture tampering; exercise identity,
timestamp, tombstone and context normalization; preserve cursor/count/key quirks;
and distinguish runtime raw behavior from declarations. Three loopback HTTP
scenarios exercise two cursor pages through the actual callback/options/mapper,
404 replacement plus status/JSON failures, and exact cancellation propagation.
Test rows are hand-authored local inputs, not captured production replies or
compatibility fixtures. Native fetch/Response is a test capability, not captured
Ky or a browser cookie jar.

No server, mutation, auth/provider, UI mount, production request, ledger milestone
or API compatibility qualification is included. Missing query UI reachability
remains open. Full Next build/browser validation was not run on this head;
aggregate checks remain separate. Exact tested file hashes and commands are in
the validation receipt.
