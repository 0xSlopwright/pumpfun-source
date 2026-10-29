# Notification preference state and explicit local adapter

## Status and scope

This is a functional **local-design state machine**, intended for the existing
settings modal through an explicitly supplied adapter. It is not a second
settings page, a Hermes backend, an authenticated account, or native API
compatibility. Opt-in UI component source is provided alongside the controller. The settings owner
implemented the narrow modal insertion, and it passed independent source review.
The combined integration passes the full workspace production build and
TypeScript check. Browser/runtime interaction validation remains pending.

Default construction uses `unavailableNotificationAdapter`. It cannot read,
submit preferences, subscribe, request a browser permission, or send a message.
`tests/helpers/notification-test-adapter.ts` supplies explicit caller-seeded,
in-memory data solely to tests; there are no production defaults or runtime
fixture imports. The application must never select that adapter through a URL,
browser storage, or an implicit fallback. No network, browser storage, push,
authentication, wallet, transport, or persistence implementation is supplied.

## Observed client behavior

Repository baseline: `2fc654a20e9c7be2b9529f585942bb82c4c83ab2`.
The existing `contracts/settings-notifications.json` and `SETTINGS-EVIDENCE.md`
owned by the settings lane provide the wider source/origin binding. This module
uses the inert captured factory `917781-d1d7a6dcbad8`:

- URL: `https://pump.fun/_next/static/immutable/chunks/453pkffaelr06.js`
- Object: `evidence/web/objects/c9d58b1f7b1c6f01.js`
- Object SHA-256: `3ba814dbe58898df9247aaf00c218cb872a8c323d0f9cf25c620589f2b032678`
- UTF-16 code-unit range: `[10720, 24132)`
- Factory SHA-256: `d1d7a6dcbad811206039a166046faaf8bf8aa513b483cab9731c013ce5b29573`

The captured helper returns no submission without current settings. Otherwise
it constructs **only** `chat`, `social`, and `coins`, spreads current fields in
each group, and merges partial group changes. Unknown **group** fields survive.
Unknown **root** fields are not spread by this helper: they are retained in a
local read snapshot, but intentionally excluded from submission and the
successful cache value. Nine boolean controls and three topic names are bound.

The PUT mutation ignores the response body and updates the query cache with the
submitted object after success. Preference pending/loading flags disable the
preference controls. Topics have an independent pending/loading lock; no global
cross-category lock is inferred. Topic mutations supply `{topic}` to subscribe
or unsubscribe, ignore the response, and invalidate the topics query on success.
The captured topic selector applies Boolean truthiness to
`topicSubscriptions[topic]?.active`.

No captured JavaScript is imported or executed. These observations do not prove
server schemas, required fields, auth/cookies, status/error bodies, ownership,
idempotency, persistence, notification delivery, or production defaults.

## Explicit local decisions and differences

- Only deliberately injected `kind: "synthetic-test"` adapters are operable.
  Activation is captured at construction; unexpected runtime kinds fail closed.
  The discriminant is labeling/activation, not a security boundary: injected
  adapters are trusted code and must remain local/test-only.
- Unknown/missing/non-boolean values are **unavailable**, never false or the
  captured UI's `true` fallback. Minimal read guards require plain JSON and the
  three settings groups / `topicSubscriptions` object. Those guards are not a
  claim that the full server schema was recovered.
- Supported changes are the nine known boolean fields and three known topics;
  unknown fields already present inside groups are preserved, not edited.
- Immutable deep-copied snapshots prevent an adapter/caller mutating committed
  state. A successful write commits exactly the submitted snapshot. There is no
  optimistic update, so failure retains the previous committed data rather than
  fabricating success and rolling it back.
- Reads and writes are serialized within each category; settings and topics can
  progress independently. Repeated pending actions are ignored, not queued.
- A successful topic write reserves an immediate local re-read. Until it
  succeeds the old topic data is stale, not a newly observed subscription value.
  A refresh failure is separately visible and does not negate the write result.
- Failed refreshes retain old snapshots for diagnostics but mark them stale and
  block writes until an explicit successful read. Consumers must render stale
  values unavailable rather than current. Errors are local classifications,
  never invented Hermes status codes or exposed raw adapter messages.
- Reset/dispose invalidate pending completions. They cannot cancel an already
  invoked adapter's own effects, roll back an upstream write, or prove an owner
  identity. UI lifetime ownership must supply/reset/dispose the controller.

## Consumer interface

`createNotificationController(adapter?)` returns stable `getSnapshot` and
`subscribe` functions, compatible with a client external-store consumer. It also
provides `loadSettings`, `updateSettings`, `loadTopics`, `setTopic`, `reset`, and
`dispose`. Mutation methods return completed, failed, or ignored with a reason;
ignored unavailable/no-data/busy calls make no adapter request.
`preferenceControl(state, group, field)` and `topicControl(state, topic)` derive
controlled values with `available`, optional `value`, and `disabled`. They mask
stale/missing data as unavailable and enforce independent category locks.

Opt-in settings integration contract:

1. An optional explicitly injected `notificationAdapter` prop; no adapter keeps
   the existing evidence-only unavailable UI unchanged.
2. A stable controller per injected adapter/view, with external-store snapshots;
   load after the explicit local panel mounts and reset at effect cleanup/close.
   A terminal `dispose` is for an abandoned instance, not a memoized instance
   reused by React StrictMode effect replay; create a fresh instance if disposed.
3. Persistent **Synthetic local data — not account settings** labeling whenever
   any synthetic value/control is shown. No runtime test fixture import.
4. Known boolean controls only; missing/malformed/stale values show unavailable.
   Disable settings controls during settings loading/pending and topic controls
   during topic loading/pending. Never enable the browser-push control.
5. Visible local load/write errors and explicit retry, with failed writes leaving
   the last committed state intact. Closing/reopening never invents persistence.

This is one coherent settings feature contribution, not a standalone native
service or a separate compatibility milestone. Coverage/progress ledgers must
remain unqualified; the settings owner/root owns integration ledger changes.

## Validation

Pinned TypeScript 5.9.3 source-only strict no-emit check and strict compilation of
source/tests followed by `node --test` pass. All 27 focused tests also pass via
the pinned `node --import tsx --test` loader in the ordinary sandbox. The suite
covers all nine
field merges, missing data, unknown-field retention, independent locks,
response-body disregard, failure/retry, invalidation/refresh, stale generations,
reset/dispose, malformed input, and immutable snapshots.

The ordinary `tsx --test` CLI was unavailable because this environment does not
support its IPC setup. Both strict compile-to-JavaScript plus Node's runner and
the documented `node --import tsx --test` loader pass without that CLI feature.
No permission, package policy, lockfile, or environment setting was changed.

After the frontend dependency age gate elapsed, the combined integration passed
root `pnpm build` and `pnpm typecheck` with frozen pinned dependencies. This
includes SDK/backend builds, Next 16.4.1 Turbopack compilation, full frontend
JSX/test typechecking, and generation of all 15 static pages. The initial run
identified import-resolution defects; extensionless imports fixed those without
resolver aliases or TypeScript configuration changes, and both commands passed
on the corrected source. The 27 focused tests were rerun successfully as well.

No browser test, screenshot parity, full workspace test suite, full evidence
verification, production request, or authenticated behavior is claimed here.
Build/typecheck results do not establish interactive UI correctness.

## Opt-in component source

`src/components/settings/notification-settings.tsx` exports:

- `NotificationSettingsProvider({ adapter?, open, sessionKey?, children })`:
  mount above section/search/filter branches. It owns one controller per adapter
  identity and explicit local session token, resets on close/effect cleanup,
  loads independent categories when open, and retains retry requests above rows.
  `notification-actions.ts` copies the last accepted intent; ignored pending
  actions cannot overwrite it, and lifecycle cleanup clears it.
- `NotificationSettingsModeLabel({ fallback })`: replaces the existing mode
  label with the persistent synthetic-local label only when active.
- `NotificationSettingsStatus({ descriptionId, fallback })`: keeps the existing
  notice unchanged by default; synthetic mode preserves the description target
  and exposes loading/error/retry states with a local-only explanation.
- `NotificationSettingControl({ settingId, label, fallback })`: renders a
  controlled, named switch only for a known available preference/topic. All
  unknown/stale values and browser-push retain the exact supplied unavailable
  fallback. There is no optimistic visual success.

The adapter is a **client-to-client injection** and must not be serialized from
a Server Component. `sessionKey` is a caller-owned local identity/lifetime token,
not detection of a real authenticated account. A stable adapter identity must
be retained across ordinary parent renders; changing it intentionally creates a
new controller. The external store follows React's [stable snapshot
contract](https://react.dev/reference/react/useSyncExternalStore); effect cleanup
uses reset so [StrictMode effect replay](https://react.dev/reference/react/StrictMode)
can safely set up the same instance again.

The pinned Next 16.4.1 client-directive/CSS-module guides were read before TSX
implementation. The new component uses a scoped CSS module and captured theme
variables. It does not import the test adapter or any fixture. Browser validation
must cover StrictMode mount/replay, independent pending/error/retry behavior,
search/section preservation, close/reopen, session changes, unknown values, and
stale completions. Static parse checks are not a substitute for these checks.

## Browser regression fixture (authored; not yet run)

`tests/notification-settings.fixture.tsx` is a separate test-only React entry
point, never a route or application import. The companion
`tests/notification-settings.spec.ts` bundles it using the existing lockfile's
`tsx` → `esbuild` dependency, serves bytes only from a test-owned loopback HTTP
server, and rejects unexpected external requests, page errors, storage writes,
permission prompts, and service-worker registration. No dependency or lockfile
change is required.

Run from `packages/frontend` after the frozen workspace install and pinned
Chromium are available:

```sh
pnpm exec playwright test --config playwright.notification.config.ts
```

Pinned Playwright 1.64.1 successfully collects all seven cases; collection does
not execute the fixture, browser, React runtime, or hooks. Seven cases cover the
unchanged unavailable default, explicit StrictMode
activation, disabled push/missing values, filtering without controller remount,
independent pending categories, write failure/retry, post-mutation refresh
failure, close/session changes with late completion, and 360px/1280px fixture
layout. The fixture captures local screenshots; they do not establish original
modal parity. This suite is also discoverable by the normal frontend Playwright
configuration after main-app startup. Its separate configuration does not start
Next or create a production-visible route.
