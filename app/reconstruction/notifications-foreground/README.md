# Original foreground notification workflow

This is a maintained, explicitly injected adapter for the captured **received-message handler**, not a notification backend or browser push implementation. The previous [inbox recovery](../notifications-inbox/README.md) deliberately excludes delivery confirmation and other message producers. This unit reconstructs their separate foreground routing/state behavior, and reuses the inbox unit's verified Hermes transport attribution without changing it.

The source chain is factory **32596**'s actual `onMessage` callback into its used `et` handler, **808142.F** for delivery confirmation, **26498** for DM target/admission, **404224** for active-room refcounts, **126965** for cache prefixes and **986274** for toast-context suppression. The handler's lazy import **976701** selects chunk `1wcrcydfivjkv.js`, which resolves **822173** to hash `682c89df…`; all five inventoried variants of that numeric ID remain recorded. The sensitive-content detector stays an explicit async port; it is not copied, executed or treated as an independently qualified implementation.

`contract.json` is regenerated from authenticated original captures and physical Turbopack registrations using the separately authored shared source helper. Semantic witnesses retain source hashes, complete factory hashes, URLs and both UTF-16/strict UTF-8 ranges. The extractor checks the complete selected handler/schema/helper syntax, derives the three duration literals, follows the actual incoming callback and records every selected factory's literal direct imports against every available inventory variant. This is bounded attribution, not a complete transitive dependency graph. Captured website JavaScript is never evaluated or imported.

## Recovered behavior

- Presentation uses nullish title/body/image/type fallbacks. DM avatar fallbacks instead use truthiness and prefer the enhanced icon. Explicit empty strings therefore matter.
- With a client and truthy `messageId`, `userId` and `timestamp`, delivery confirmation starts **before suppression** and is not awaited. It posts relative `notifications/confirm-delivery` through `/api/hermes`, with `platform: "web"`, `deliveryLocation: "in_app"` and a truthy optional device ID. Request JSON sets Content-Type; there is no JSON response shortcut or added JSON Accept header. The helper swallows request-Promise rejection. No server acknowledgement, ownership, persistence or delivery guarantee is established.
- DM recognition uses a `pump:` URL with hostname `dms`, plus optionally validated metadata. It differs from the inbox's subtype-based exclusion predicate. DM receipt invalidates `['dms','inbox']` and `['dms','messages']` in that order, even when the DM feature is disabled or a toast is suppressed.
- DM admission checks active rooms before the exact `/messages` route, then the **first matching cached entry**. A null mute deadline is indefinite; a parsed deadline must be strictly later than now. Equality, invalid dates and an earlier unmuted match allow the toast. Malformed cache shapes can throw; no fabricated empty cache is substituted.
- Admitted DMs await the injected detector, then provide the renderer with the redaction flag and original body. The adapter does not itself implement the captured row rendering/redaction. The route uses sender ID before conversation ID, while the toast ID prefers message ID before conversation ID; URL encoding is preserved.
- Non-DM suppression first checks the current `/coin/<raw mint>` **prefix**, using the top-level mint, then unvalidated generic JSON coin metadata, then the deeplink. The captured raw-mint URL lookup has no protocol check. These are recovered client conditions, not a new URL acceptance policy or token-page implementation.
- The generic input schema requires string `notificationSubtype` and boolean `showAsToast`, validates optional button/navigation/coin/metadata fields and strips unknown object keys. Invalid input and `showAsToast: false` fall back to a simple toast. They do not drop the message.
- Only `limit_order_filled` is suppressed while the captured toast-context counter is open. Active-room and toast-context registration both have reference counts and idempotent cleanup. The original DM/generic/simple duration values are 8/10/8 seconds. The handler does not deduplicate repeated IDs; renderer behavior is outside this unit.

## Use

Importing `client.mjs` attaches no browser listener, creates no device ID and makes no network request. An integration must explicitly supply the real application ports and a received payload:

```js
import {
  foregroundHandler,
  activeRoomRegistry,
  achievementToastContexts,
  deliveryClient,
} from "./client.mjs";

const rooms = activeRoomRegistry();
const contexts = achievementToastContexts();
const handle = foregroundHandler({
  hermesApi: deliveryClient({
    origin: localTestOrigin,
    transport: explicitFetch,
  }),
  queryClient,
  getDeviceId: explicitDeviceIdReader,
  isActiveRoom: rooms.has,
  isAchievementToastOpen: contexts.isOpen,
  loadSensitiveContentDetector: explicitAsyncDetectorLoader,
  showToast: explicitRenderer,
});
await handle({
  payload: receivedPayload,
  pathname: currentPath,
  isDirectMessagesEnabled: true,
});
```

`deliveryClient` is a small HTTP adapter for the explicit confirmation destination. Its HTTP(S)-only origin restriction is local design; the original ultimately uses a relative same-origin proxy. It does not emulate Ky retries, its 60-second timeout scheduling, HTTPError, auth hooks or response wrapping. `confirmDelivery` can also consume a supplied Ky-shaped `post` client. The handler models the inner used function only: the outer Firebase callback's separate inbox invalidation/user refresh and React effect lifecycle are not implemented here.

## Verify

From the repository root:

```sh
node app/scripts/original-notifications-foreground.mjs --check
node --test app/tests/original_source.test.mjs \
  app/tests/original_notifications_inbox.test.mjs \
  app/tests/original_notifications_foreground.test.mjs
python3 app/scripts/verify-evidence.py
```

Use `--write` instead of `--check` to regenerate only this derived JSON from retained captures. The existing inbox contract must independently verify first. A changed source requires adapter review/requalification; regeneration does not automatically establish behavior of a changed client version.

Tests send actual POSTs to an isolated loopback HTTP server, including delayed acknowledgement and HTTP failure. Synthetic received messages/cache state exercise suppression, fallbacks, invalid schema, error ordering, refcounts and cleanup. Resealed guard/schema/confirmation/cleanup mutations refresh the prerequisite's source anchors too, then must fail this unit's own semantic checks. A duration variant must be derived while its stale generated metadata fails. Raw corruption, missing chunk-selected variant and invented qualification claims fail closed. These are local synthetic workflow checks, not captured upstream responses.

## Limits and ownership

No browser permission, Firebase/ServiceWorker/device registration, browser storage, navigation, telemetry, push delivery, production request, native server route, server auth/persistence, notification UI or feature-completion credit is introduced. Existing dated configurations have Hermes disabled; current availability, ultimate proxy upstream and an active provider variant are unknown. The settings/topics/modal work in **#675**, settings contract in **#683** and inbox/watermark work in **#690** remain separate and unchanged. No raw capture, inventory, SDK, dependency lock, historical packet or paused local prototype is modified.
