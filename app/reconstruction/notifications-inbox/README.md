# Original Hermes inbox client recovery

This unit recovers the inbox request, page projection and device-local unread model from retained public JavaScript. It adds a small maintained adapter with an explicitly supplied destination and transport. It adds no backend, notifications UI, production access, push delivery or compatibility milestone.

The actual client uses **GET `notifications/user?${URLSearchParams}`** through the independent Hermes client at `/api/hermes`. This relative/template input was absent from the unchanged historical 330-operation literal ledger. The effective browser path is `/api/hermes/notifications/user`. The ultimate proxy upstream and server authentication/ownership enforcement remain unknown. Browser credentials use the same-origin default; the JSON shortcut supplies `Accept: application/json`. No Authorization or pump-header hook is supplied by this client.

## Source and behavior

The verifier reads original capture bytes through the separately authored shared source helper, authenticates manifest/factory hashes, checks physical Turbopack registrations, and binds semantic expressions with UTF-16 and strict UTF-8 ranges. Every literal direct import, including side-effect imports, is resolved against all variants in the complete 5,947-variant inventory. Both Hermes provider variants remain separate. Captured factories are parsed as AST data and never evaluated/imported.

- **763956**, aliases **875384 / 986382**: actual query, options, cache key, page handling and watermark exports.
- **808142**: wire-to-item projection. `notificationId || messageId`, `timestamp || createdAt`, image/mint fallbacks and `genericV1.listNavigation` are preserved. This is a projection without a response validator; malformed data may throw.
- **26498**: direct-message exclusion using subtype, `/dms` navigation or `pump://dms` deeplink. Pages flatten without deduplication. Unread count covers loaded, visible items; it is not the server's total count.
- **402659**: actual topbar opening invokes the local writer. Reader scope is a trimmed wallet, whereas that writer receives the raw address argument. The adapter preserves this distinction.
- **484018 / 779106 / 92245**: query cache uses userId-first viewer identity and all four filters. This scope differs from the wallet-based unread scope.
- **30181 / both 944410 variants**: separate same-origin transport, 60-second configured timeout, runtime availability gate, JSON Accept/empty-body behavior. **668487** supplies the adjusted clock used for a default watermark; synchronization is not reproduced here.

The request includes, in order, truthy `lastEvaluatedKey`, `notificationType`, `priority`, `channel` and `mintAddress`. It uses URLSearchParams escaping and retains `?` with no parameters. The query forwards cancellation, starts with an undefined cursor and uses `hasMore ? lastEvaluatedKey : undefined`; neither count nor page length decides completion. It has a 5-second stale time, 60-second foreground refetch interval and window-focus refetch. The enabled gate combines feature flag, client, non-null viewer, and an optional enabled argument (undefined enables; null/false/zero do not).

After JSON decoding on a falsy cursor, the original calls `fetchUser()` before projection and does not await it. Ky returns an empty string for a 204/empty body, so this refresh still occurs before malformed-page projection throws. The adapter retains that order and empty-body behavior. It does not emulate Ky retries, timeout scheduling or HTTPError; errors remain errors and never become synthetic inbox data.

## Unread state is local

The source stores `pump.notifications.opened-at:<exact argument>` in localStorage. Null treats every loaded item as unread, including an invalid timestamp. With a non-null watermark, both timestamps must parse and the item must be strictly later; equality is read. Opening snapshots the prior value for highlighting, attempts the write, and notifies subscribers. Write failure is ignored and there is no current-watermark memory fallback. A recreated adapter reads persisted storage; wallet keys remain separate.

Original storage subscriptions notify on clear (`key === null`) or any matching prefix, including another wallet's key. Cleanup removes the subscriber. The model exposes this as injected `storageEvent(key)` and does not register browser/React listeners. It requires an already-adjusted clock function rather than substituting a server-time implementation.

No server mark-read request appears in this writer. Delivery confirmation, telemetry, navigation, Firebase/browser permission handling and other producers are outside this unit. Their absence here does not establish that the whole application lacks those operations.

## Use and verify

From `app/`:

```sh
node scripts/original-notifications-inbox.mjs --check
node --test tests/original_source.test.mjs tests/original_notifications_inbox.test.mjs
python3 scripts/verify-evidence.py
# Regenerate only the derived contract from retained capture bytes:
node scripts/original-notifications-inbox.mjs --write
```

`client.mjs` offers request plans, an injected-transport reader, projection, query keys/gates, cursor selection, visible-item/unread calculations and a storage-injected watermark model. There is no default origin/network implementation. A caller must supply a transport and user-refresh callback. Verify the generated JSON contract against source before consuming it. The HTTP(S)-only destination check is local adapter design, not an inferred original validator. `visibleInboxItems` takes query data with a `pages` field: a nullish data base is empty, but a present object with missing/null pages throws, preserving the original optional-chain boundary.

Tests use synthetic messages and a real loopback server to receive GET paths/headers, serve pages/errors/empty bodies, and exercise cancellation. They cover falsy filters, escaped cursors, malformed data, DM exclusion, duplicates, strict time comparisons, restart/isolation/storage errors, and source/generated metadata tampering. Semantic tampering is resealed in disposable copies so hashes alone cannot make an incorrect relationship pass. No test is an upstream response fixture or authenticated compatibility proof.

## Dependencies and limits

This branch depends on [inventory #679](https://github.com/lalalune/pumpfun-source/pull/679), source/index `7b52e2cfb780e246fe98c656122d95be769e17a3`, and shared source prerequisites `f6e469c3b`, `124f1194c`, `0a9a1f084` used by [auth #680](https://github.com/lalalune/pumpfun-source/pull/680) and [search #684](https://github.com/lalalune/pumpfun-source/pull/684). Those are separately authored prerequisites, not inbox discoveries. They can be pruned after merge. Existing graph files and progress scores are untouched.

[Settings #683](https://github.com/lalalune/pumpfun-source/pull/683) separately binds 12 dated configurations with `hermesNotificationsAvailable:false`; that head remains unchanged. This unit does not duplicate its settings operations or the settings/topics UI in [#675](https://github.com/lalalune/pumpfun-source/pull/675). No inbox response, current availability, active page variant winner, backend cookie/session behavior, server persistence or original private TypeScript/backend source is established.
