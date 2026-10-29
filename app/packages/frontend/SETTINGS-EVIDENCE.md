# Settings and notification boundary

## Observed

This work is pinned to repository commit
`2fc654a20e9c7be2b9529f585942bb82c4c83ab2`. The machine-readable source and
operation binding is [`../../contracts/settings-notifications.json`](../../contracts/settings-notifications.json).
No captured factory is imported or executed by the reconstruction.

| Factory variant                              | Observed behavior                                                                                                                                                                                                                                                   |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `443032-9460ff6fdae4`                        | Settings is a modal over the current page, controlled by `settings` and optional `setting` query keys. Updates use history replacement; close removes both keys. The upstream host is feature-flag gated. This is not evidence for a `/settings` page.              |
| `532757-034384d1b986`                        | Section identifiers: trading, chart, feed, notifications, account, display, privacy, admin. The privileged admin section is deliberately not implemented.                                                                                                           |
| `124884-dfcb487f79e6`                        | Search, section tabs, close/done controls, optional setting focus, empty search, scrollable content, and a 720px maximum-width modal. Account/notification/admin visibility is gated upstream. Search normalization lowercases and removes Unicode combining marks. |
| `917781-d1d7a6dcbad8`                        | Browser-push, chat, social, coin and trending-topic groups. Nine preference fields and three topic names are read. Includes settings/topic queries and mutation call sites; defaults in this UI are not observed server or account values.                          |
| `944410-eb97d7584306`, `944410-6e0b85a81829` | Two captured client-hook variants gate Hermes client creation on `hermesNotificationsAvailable`. The import renaming differs; neither variant establishes a backend implementation.                                                                                 |
| `30181-fbae4e508e6c`                         | Hermes client uses same-origin `/api/hermes` and a 60-second timeout, without an explicit credentials option or bearer hook. Backend origin, authentication and errors are unknown.                                                                                 |
| `528798-af69e8c3ce32`                        | `WEB_HERMES_NOTIFICATIONS` gate and viewer-keyed query-cache namespaces.                                                                                                                                                                                            |
| `956718-00b703deb875`, `654506-faac91fe2207` | Hide-personal-information, language and confirm-external-links definitions; device/account scopes and a local-storage adapter. These preference adapters are not connected or exercised locally.                                                                    |

The binding records full SHA-256 hashes and original UTF-16 ranges/URLs from
`recovered/modules.json`. `tests/settings-contract.test.mjs` checks each binding
against that index and hashes each original captured range without executing it.

### Captured English text

The common English resources are embedded in retained `/live` HTML, not a
standalone locale JSON file. The translation binding pins
`evidence/web/objects/c45d40b52df03727`, 785,309 bytes, SHA-256
`aeff704c15d99482fe6e6347a92db0170dffeceb940a70e61dcc10002b006355`, captured
`2026-10-28T10:48:45.546100+00:00`. The single Flight push is read as JSON;
Flight row `c6` contains `locale: "en"` and the `resources` object.

This supplies exact tab names, settings/search titles, and the label/description
pairs for hide-personal-information, language and external-link confirmation.
It does **not** contain the lazy `web.notification_settings` or
`notifications.settings` namespaces. No complete translation catalogue or
notification-label identity is claimed. Contract tests hash the source, check
manifest provenance and compare each recorded string to the inert JSON data;
model tests bind the rendered general-setting definitions to those strings.

## Local design

`src/components/settings/settings-control.tsx` exports one `SettingsControl`,
mounted once in the live captured shell's sidebar footer (`components/shell/AppSidebar.tsx`,
styled as a footer entry above Support/Terminal so they keep their captured positions; no captured placement exists because the upstream host is flag-gated). It contains its own Suspense boundary, a launcher, and a native
dialog portalled to `document.body` after hydration. This avoids hiding the dialog
under a mobile navigation ancestor's `aria-hidden`/`inert` state. Modal background
scroll is locked temporarily, with the previous body overflow restored on close.
Escape keydown explicitly closes through the existing URL update, prevents the
input's default handling and stops propagation before shell/Live window listeners.
Relying only on native `cancel` left the modal open when a populated search input
consumed Escape. The native cancel handler remains as a fallback for cancellation
not initiated by that keydown. Both paths remove only the settings query keys.
The combined sidebar/settings/Live regression now presses Escape from the populated
search field; its history, focus and scroll-lock assertions remain intact.

Supported local interactions are query-open, section selection, search/clear and
empty results, tab-key/arrow-key navigation, an exact known focus target,
Close/Escape/Done/backdrop dismissal and URL history replacement. Close drops all
occurrences of the two owned query keys and preserves unrelated repeated query
values and the fragment. Invalid/duplicate section values fail closed; invalid,
duplicate or cross-section focus targets are ignored. These malformed-input
policies are defensive local choices, not asserted upstream parity.

The launcher opens Notifications as the bounded implemented panel rather than
claiming the upstream default section. Seven public section names are retained;
trading/chart/feed report that their controls are not reconstructed. Account,
display and privacy expose only the three specifically mapped definitions, with
their adapters unavailable. Notification labels remain visible as a read-only
local reference regardless of upstream feature flags. The three general settings
and tab names use the exact English strings bound above. Notification wording and
local unavailable-state explanations remain analyst descriptions, not recovered
translation text.
Search includes these mapped notification definitions as a local convenience;
full upstream settings-search coverage is not claimed.

The default shared-shell entrypoint keeps every preference or subscription
value **unavailable**, not unchecked/off. It does not render a switch that could
be mistaken for actual account state. No account or browser adapter is supplied.
It never reads or writes local/session storage, fetches account preferences,
subscribes, calls Notification/Push/ServiceWorker permission APIs, changes cookies,
sends messages, connects a wallet or signs anything.

An optional client-to-client `notificationAdapter` prop enables explicitly
injected `synthetic-test` adapters only. A stable provider above the search and
section branches presents known local boolean values, pending/error states and
explicit retry. Its persistent **Synthetic local data — not account settings**
label distinguishes these values from production. Unknown or stale values and
browser-push controls remain unavailable. Close and changes to the adapter or
explicit `notificationSessionKey` ownership token invalidate pending state;
effect cleanup uses reset rather than terminal disposal for StrictMode replay.
The shell supplies neither prop, no URL/storage flag enables them, and test
fixtures are outside product imports. These local state mechanics and their
limitations are documented in [`NOTIFICATION-STATE.md`](NOTIFICATION-STATE.md).

## Backend contract boundary

The static bindings identify five website client operations beneath
`/api/hermes/v1`: GET and PUT `user-preferences/settings`, GET
`topic-subscriptions`, and POST `topic-subscriptions/subscribe` and
`topic-subscriptions/unsubscribe`. The PUT client merges current chat/social/coins
objects and partial changes and only submits when current data exists. Mutation
response bodies are ignored; cache updates/invalidation are observed client
behavior, not proof of server persistence.

These paths are not the existing 29 broad settings candidates and do not change
that unreviewed denominator. There are **zero new native handlers, fixture
responses or qualified operations**. Server schemas, error/status/auth/ownership
contracts, idempotency, ordering and production behavior remain unknown. No
synthetic success response or production proxy has been introduced. The existing
compatibility harness's unknown-operation 501 behavior is unchanged.

## Validation

- Passed: nine pure URL/search/model tests via
  `node --experimental-strip-types --test tests/settings_model.test.ts`, also
  run through the integrated `test:settings` script using pinned pnpm 10.24.0.
  The aggregate test command now includes this script.
- Passed: three source-binding/contract tests via
  `node --test tests/settings-contract.test.mjs`, including hashes of all ten
  captured factory ranges.
- Passed: 27 local notification state/action tests, independently rerun through
  the existing backend's Node/tsx loader. `test:notifications` invokes this suite
  from the aggregate test command. These prove local mechanics, not API parity.
- Passed: Prettier 3.6.2 formatting for new TypeScript, TSX, CSS and JSON.
- Authored, **not run**: `tests/settings.spec.ts` (frontend Playwright suite).
  It covers malformed queries, deep links, close/history, search/empty states,
  keyboard/focus behavior, four desktop/mobile widths, storage preservation and
  blocked permission/service-worker hooks. Tests must be run after shell integration.
- Passed in the combined settings/auth/Live validation tree: full root
  `pnpm build` (SDK, backend and Next 16.4.1 Turbopack, including JSX type analysis
  and 15 static pages) and `pnpm typecheck` for all three packages. The first
  integrated build exposed browser imports that named nonexistent `.js` files;
  the frontend fixture typecheck also exposed `.ts` imports in its test helper.
  Five import literals across three notification files were changed to the
  frontend's extensionless convention; the full checks and all 27 notification
  tests passed afterward. No runtime logic, dependency or lockfile changed.
- The frozen frontend installation ran only after the package minimum-release-age
  cutoff elapsed on 2026-10-28. No policy was relaxed.
- **Not run**: browser runtime/screenshots, aggregate test command and aggregate
  evidence verification for this combined feature. Build/typecheck success is
  not browser behavior or original-reference parity.
- Pinned Next 16.4.1 bundled URL-hook, CSS-module and client-component docs were
  read from an integrity-verified official npm archive extracted as documentation
  only. No dependency-install restriction was bypassed for that read-only step.

Original authenticated screenshots were not supplied. No screenshot comparison,
pixel parity, live settings success, full settings source completion or native
notification compatibility is claimed. All completion milestones depending on
those results must remain pending.

## Escape follow-up

An isolated browser run against the earlier combined settings/auth/Live candidate
reported a repeatable failure in `Escape and repeated reopening clear local search
and do not add history entries`: Escape from a populated search input left Settings
open. Its local correction was not published with PR #675. The current source at
`521266e9f8d98af5f71c55850a4b4db7fe68ee52` still contains the same native-cancel-only
handler. This follow-up independently makes keydown dismissal explicit; it does not
claim identity with the unavailable earlier patch or transfer that run's browser
results to the current captured shell.

The scrolling regression first completes an open/close interaction before changing
`body.style.overflow`, rather than mutating server-rendered attributes before
hydration. No timing delay, global listener, notification adapter or shared-shell
change is introduced.

Validation on that snapshot plus this three-file follow-up (build and typecheck
were also rerun after refreshing backend sources to
`20c2c8af785cfd3f1ab8c841e9e5eb029e5967d2`; frontend and dependency files were unchanged):

- Passed: full `pnpm build` (SDK, backend, Next 16.4.1,
  static page generation 16/16),
  `pnpm typecheck` for all three packages, and all 39 focused settings model,
  source-contract and notification state/action tests.
- Passed: the repository-root `scripts/test_tooling.py` synthetic comparator
  tests (6/6); its inspected source and imports match the upstream Git blobs.
- Blocked: repository-root `scripts/verify_evidence.py` exits at the missing
  `evidence/upstream/pump.json` input in the bounded local checkout. No binary
  or captured-bundle execution was attempted.
- Passed: formatting and collection of all 15 settings Playwright cases.
- Maintainer review (merged onto main `a91e9571`): all 15 `tests/settings.spec.ts`
  Playwright cases passed against the current shell (Next dev server, headless
  Chromium). With the previous `settings-control.tsx` restored, the
  `Escape dismisses settings without closing the mobile sidebar or Live selection`
  case fails at `expect(dialog).not.toBeVisible()`, confirming the regression
  exercises this fix.
- Blocked by the partial local evidence checkout: `python3 scripts/verify-evidence.py`
  reports missing manifest-referenced capture objects; `progress.py --check` first reports missing
  `packages/frontend/visual/portfolio-live-20261028/live-verification.json`.
  These are not passing evidence/progress gates, and the aggregate test command
  has not run on this follow-up.

Dependencies were reused from the pinned cache with the frozen lockfile, offline
mode, scripts disabled and the existing minimum-release-age policy unchanged.
No feature milestone, full workspace qualification or visual parity is implied.
