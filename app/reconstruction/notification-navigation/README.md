# Original notification row activation

This fills the navigation boundary deliberately left outside the [inbox/watermark recovery](../notifications-inbox/README.md). It reconstructs a used row-click workflow and destination resolver as a maintained, explicitly injected adapter. It does not add a notification page, router, telemetry service, destination application, backend or production request.

The actual topbar caller **402659** renders **763956.f** rows with item/surface/unread inputs. The captured row callback tracks the click, calls **808142.m**, calls **208912.n** with the notification-center entry value **8**, and then calls the actual `useRouter().push` result. **808142.m → 692159.H** supplies route resolution; **146695**, **399861** and **646908** supply the profile, achievement and NEAR-prefix helper boundaries. **292686** binds the actual entry enum. Captured factories are parsed as AST data, never executed/imported.

`contract.json` is derived from authenticated raw capture/factory bytes and physical registrations. The extractor checks complete selected helper syntax, actual used callback ordering, actual imported IDs/router hook, the topbar mount, every semantic expression range and all selected factories' available direct import variants in the 5,947-variant inventory. This is not a complete transitive graph or an active page/build selection.

## Preserved decisions

- Item navigation is selected with `item.navigation ?? item.genericV1?.listNavigation`. The resolver then uses a **truthy** structured navigation value before all deeplink fallbacks. An empty object remains selected and can produce an undefined destination; a falsy non-null item navigation does not select the generic fallback. No new response validator or repaired destination is invented.
- Structured routes preserve the captured coin/profile/achievement/trending/community/GO/DM mappings. Parameters use `encodeURIComponent`. Generic route parameters replace only the first matching `[key]`, in object-entry order; unused params do not become a query string.
- `pump://coin/` has the captured legacy rewrite. The parser requires exact `pump:` protocol and preserves each hostname's segment/query behavior. Encoded path segments are not decoded before the formatter encodes them, so double-encoding is observable. Achievements receive `?reveal=1`; a valid `near:mainnet:` account prefix is removed only for the captured account regex.
- Slash-relative strings pass through unchanged. A lowercase `http` prefix is parsed by `URL`, then only pathname+search is returned; origin/fragment are dropped. Other or malformed fallbacks return `/`. These are recovered conditions, not a new URL-security policy or a claim that arbitrary destinations are safe.
- Activation order is click sink → resolve → navigation marker → router. The callback does not forward the router's return value. Exceptions stop subsequent effects; there is no retry or invented fallback.
- The used DM marker resolves against the supplied origin, removes **one** trailing slash, and records only another exact `/messages` path or `/messages/…` path. It reads current pathname only for those targets, and the clock only for eligible writes. The original writer has no separate origin check. The marker record contains pathname, entry point and `Date.now()` time.

The pending-state read/consume/expiry helpers remain outside this unit: their source exists, but no downstream reader is established here. The adapter supplies an explicit `recordEntry` port rather than inventing a read consumer or claiming persistence. Toast activation in the separate foreground workflow has distinct callbacks/entry values and is **not** wired or qualified by this row unit.

## Use

```js
import { activateNotification, dmNavigationMarker } from "./client.mjs";

const markNavigation = dmNavigationMarker({
  location: explicitLocation,
  recordEntry: explicitPendingEntryWriter,
});
activateNotification({
  item: projectedInboxItem,
  surface: "topbar",
  trackClick: explicitClickSink,
  markNavigation,
  router: explicitRouter,
});
```

There is no implicit `window`, listener, network, telemetry, storage, auth state or router installation. `notificationHref`, `navigationIntent`, `pumpLinkIntent`, `hrefForIntent` and `resolveNotificationHref` expose the same bounded decisions for explicit callers. Their malformed-input behavior is not a new public server schema or a full reproduction of Next/browser navigation internals.

## Verification

```sh
node app/scripts/original-notification-navigation.mjs --check
node --test app/tests/original_notification_navigation.test.mjs \
  app/tests/original_source.test.mjs app/tests/original_notifications_inbox.test.mjs
python3 app/scripts/verify-evidence.py
```

`--write` regenerates only the derived contract. Any changed source requires adapter review/requalification. Tests cover special and generic routes, encoded segments, nullish/truthy priority, missing/malformed navigation, relative/absolute fallbacks, marker conditions and exception ordering. Resealed callback/helper/enum/caller mutations must fail source relationships; raw corruption, an omitted actual helper and invented reader/security claims fail closed.

The composition test uses an actual isolated loopback inbox GET, the **unchanged** inbox projection and `visibleInboxItems` filter, then activation/marker/router ports. A DM-classified row is filtered before activation; it is not bypassed to manufacture a successful workflow. Synthetic visible profile and relative-message rows exercise their respective destinations and conditional marker. These are synthetic local client checks, not upstream notification responses or authenticated compatibility evidence.

Coin/detail, achievement, GO, community and message destinations stay navigation boundaries. No excluded page implementation, UI/visual-parity claim, backend compatibility, feature-score credit, dependency/SDK/lock/raw-capture change, shared-shell edit or paused native prototype is included. Original server behavior, current service availability, opaque router/telemetry implementations and exhaustive interleavings remain unknown.
