# Original DM realtime cache-refresh workflow

This reconstructs a separate, used client workflow: the shell's realtime DM signal subscriber and its cache-refresh state. It supplies an explicit-port session adapter and a reproducible contract derived from retained original factories. It does not implement a NATS broker, token minting, authenticated session, wire protocol, notification UI or native backend.

The complete captured incoming chain is **400466**'s conditional shell mount → lazy **543301** → chunk `3sy33-ehp6vax.js` → namespace reexport **12404** → **754054.DmRealtimeSignalSubscriber** → **754054.useDmRealtimeSignals** → **573525**'s event subscription. **283087** supplies the per-user-auth readiness gate; **126965** supplies the viewer-partitioned cache prefixes. Both available **985526** variants agree on the `CORE` enum. **292686** supplies the actual peer-message channel value. Original code is parsed as AST data, never executed or imported as runtime implementation.

The existing [foreground presentation/delivery handler](../notifications-foreground/README.md), [Hermes inbox/watermark](../notifications-inbox/README.md) and settings modal are separate workflows. This unit does not repeat their implementation or establish an actual caller for the retained DM preference/read-mutation helpers.

## Recovered state and ordering

- The outer subscriber is enabled by the original DM feature flag plus a truthy address. The hook resolves a **user ID** independently of its **cache viewer scope**. These are distinct injected inputs; the adapter does not infer authentication or substitute one identity for the other.
- Subject `dm.user.<resolved user ID>` subscribes to `CORE` when enabled, the user ID is non-null, and the per-user-auth gate is ready. Connection status does not itself gate subscription. Readiness is `!NATS_PER_USER_AUTH || externalStoreReady`; no token or auth flow is reproduced.
- The event schema requires string `type`, `messageId` and `conversationId`, with optional string `senderId` and `createdAt`. Unknown fields are stripped; only `type === "dm_message"` proceeds. Empty strings remain strings; no extra UUID/owner validator is invented.
- A mounted hook remembers up to **500 IDs in insertion order**. A duplicate is ignored without renewing its position. At capacity, the oldest ID is removed before adding a new one. Defined non-self senders trigger the injected peer-message callback before cache invalidation, with the captured channel value `1`; no telemetry service is supplied.
- The first unique signal immediately invalidates the viewer's DM inbox, then messages. Unique events during the one-second window set a pending flag. Expiry performs one trailing refresh only when pending; trailing refresh alone does not start another cooldown. Duplicate/invalid signals do not set pending.
- The first ready connection does not refresh. Once a ready connection has been seen, a later ready disconnection marks a pending reconnect. Reconnection schedules one refresh after `5000 * Math.random()` milliseconds. Changes to readiness, connection or the viewer invalidator cancel/re-evaluate that timer; cancellation retains the pending flag.
- A visible `visibilitychange` refreshes while enabled with a resolved user. This gate is deliberately weaker than subscription readiness. Attaching the listener does not itself refresh.
- The subscription uses a stable dispatcher and latest callback reference. A callback/viewer change alone does not resubscribe an unchanged subject. The original cleanup unsubscribes only with a truthy ID and stored type; the adapter preserves that condition rather than guessing a numeric-ID contract.

## Lifetimes are explicit

One `dmRealtimeSession` instance corresponds to one mounted original hook. `configure` models changed inputs; `dispose` models unmount. Seen IDs, connection-history flags and the pending event window survive input changes. In particular, a trailing window retains the viewer invalidator captured by its **first event**, even if the hook subsequently receives another viewer or is disabled. A new mounted instance starts a new lifetime. This is recovered source behavior, not a recommendation or a claim about how often the original parent remounts.

Disposal clears both outstanding timers, removes the visibility listener and runs the original subscription cleanup. The local adapter rejects reconfiguration after disposal. The query client and integration ports are fixed for an instance; recreating the adapter is required if those ports change. React/TanStack scheduling, opaque provider behavior and all possible concurrent delivery/unmount interleavings remain outside this bounded model.

## Explicit integration

Importing the module performs no action. The integration must supply a decoded-event source, cache client, visibility source, identity/gate state and optional timer/random implementations:

```js
import { dmRealtimeSession, perUserAuthReady } from "./client.mjs";

const session = dmRealtimeSession({
  queryClient,
  subscribe: brokerPort.subscribe,
  unsubscribe: brokerPort.unsubscribe,
  visibilityTarget: document,
  visibilityState: () => document.visibilityState,
  onPeerMessage: explicitPeerMessageSink,
  onSubscriptionError: explicitErrorSink,
  initial: {
    enabled: originalDmFlag && Boolean(address),
    userId: resolvedUserId,
    viewer: resolvedCacheScope,
    authReady: perUserAuthReady({
      flag: perUserAuthFlag,
      ready: externalReady,
    }),
    connected: coreConnected,
  },
});
// Update only from the integration's observed original-derived state:
session.configure({ connected: nextCoreConnected });
// Component/service unmount:
session.dispose();
```

`brokerPort` follows the captured call shape `subscribe(type, subject, callback, undefined, {coalesce:false})`, returning a subscription ID, and `unsubscribe(type,id)`. It is an explicit boundary, not an implementation or qualification of upstream NATS/transport/auth. Defaults are disabled local-adapter initialization, not an inferred original server default. No active page/provider winner or current service availability is asserted.

## Reproduce

```sh
node app/scripts/original-dm-realtime.mjs --check
node --test app/tests/original_source.test.mjs app/tests/original_dm_realtime.test.mjs
python3 app/scripts/verify-evidence.py
```

`--write` regenerates only `contract.json` from authenticated captures. The extractor binds actual incoming use, complete selected hook/schema/helper syntax, direct imports and both enum variants. Capacity and both timer values are derived; exported timer values must equal the literals actually used. A changed source requires adapter review/requalification; regeneration alone does not qualify another version.

Tests dispatch synthetic decoded signals through an actual local `EventTarget` subscription, apply actual visibility events, and run both an actual timer workflow and deterministic timer schedules. They cover burst/trailing behavior, FIFO eviction, duplicate IDs, separate identity/cache scopes, reconnect cancellation/jitter, visibility/auth gates, stale pending lifetimes, subscription/callback failures and cleanup. Resealed guard/dedup/ref/loader mutations must fail semantic checks after their byte hashes are updated; capacity/timer variants must be derived while stale metadata fails. Raw corruption, missing enum variants and invented server qualification fail closed.

These are local client-state checks, not captured upstream wire messages, authenticated server observations or proof of delivery/replay/losslessness. No production requests, credentials, SDK/lock changes, raw-capture edits, native compatibility, UI/visual parity or feature-ledger credit are involved.
