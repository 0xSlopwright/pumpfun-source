# Archived first-visit screen

This unit completes the previously unreachable first-visit screen on the captured shell from PR #685, pinned to `3688c5abe1d138d8bff49d2ee7784b5c9cd7fc5d`. It reconstructs browser state and UI behavior from retained source. It does not establish current legal policy, consent authority, backend acceptance, authentication or wallet state. The screen identifies itself as an archived interface saving a local browser preference.

## Physical source

`CLICKWRAP-BINDINGS.json` authenticates raw object hashes and exact UTF-16 ranges. The source was recovered by the separately owned nested-registration inventory (#679, index commit `7b52e2cfb780e246fe98c656122d95be769e17a3`); the old inventory omitted these factories. No inventory, capture or SDK bytes are changed. Numeric IDs below refer to those exact physical origins.

| Factory         | Physical object / range             | Observed role                                                                              |
| --------------- | ----------------------------------- | ------------------------------------------------------------------------------------------ |
| 683826          | `777a07b2ab86ec0c.js`, 13399..20313 | `DialogClickwrap`: snapshots, events, storage, migration, focus/inert lifecycle and markup |
| 4327            | `b677d332af92b7f5.js`, 2225..3177   | Cookie/legacy keys, route predicate, accepted event and pre-paint observer cleanup         |
| 875429          | `b677d332af92b7f5.js`, 14383..15239 | Acceptance-date key and ISO timestamp floor at captured revision `2026-10-17`              |
| 223021 / 395136 | `337439e6bd8e9380.js`, 16734..17655 | `/c`, `/coin-share` and the original address-profile regex                                 |

The retained root HTML (`b713215f09b03c14`, SHA-256 `5c54a668997394767a338ff5efe132ba3400bd5e1c4b6bb16c9c075b6a389409`) supplies exact English copy, links, DOM/classes, pre-paint predicates and migration. Captured scripts and bundles are only parsed as inert text; none is executed. The pre-paint helpers are independently written local code implementing those predicates.

## State and original quirks

1. On a fresh in-scope visit, neither a cookie nor legacy storage value is assumed. The overlay shows and the shell becomes inert. Existing exact `clickwrap_accepted=true` or any non-null `show-how-it-works` value hides it. In particular, the legacy strings `false`, empty string and `null` still count as present; this is the captured client's behavior, not a new consent policy.
2. Existing legacy presence migrates only the cookie. It does not manufacture or refresh the acceptance date. The captured server pre-paint code also handles this migration.
3. Continue invokes the common acceptance routine. **Backdrop Dismiss and Escape invoke the same routine**, rather than merely closing without persistence. The original Dismiss analytics branch and Continue analytics branch differ, but converge at the same state/storage operation. No analytics service is started here.
4. That routine first closes the component instance, writes `clickwrap_accepted=true; path=/; max-age=31536000; samesite=lax`, then attempts `show-how-it-works=true` and `user-tos-accepted-date=<ISO max(now, 2026-10-17)>` in one guarded block. It notifies same-page subscribers and emits the observed `pump:clickwrap-accepted` event even when local storage fails. A cookie setter exception stops later persistence/notification, as in the source. This archived revision floor is recorded source evidence, not a claim that it is today's legal revision.
5. Storage events refresh the snapshot. A later cross-tab legacy write hides an open overlay; cookie migration occurs on the subsequent mount, rather than being invented as a new storage-event write.
6. Exact excluded prefixes and address-profile forms suppress the screen. Terms and Privacy links navigate to the maintained archived reference pages without accepting; Back returns to the first-visit screen if no flag exists. Prefix lookalikes do not inherit exclusion.
7. While open, the source focuses the panel, locks root scrolling, watches for shell replacement/removal of inertness and redirects focus from shell descendants. Cleanup disconnects the observer, restores overflow and prior focus, and removes shell inertness.

The pre-paint state and delayed-shell observer work before React hydration. Expected root attributes and shell inertness are the two narrowly declared hydration differences; the rest of the UI remains subject to normal hydration checks.

## Deliberate local boundaries

- A visible notice identifies this as an archived local interface. The historical legal wording is preserved as evidence, not represented as a new current policy. No server receives the preference.
- The captured cover image was not retained. Its aspect box remains a local placeholder; no replacement artwork or remote URL is claimed as original.
- Tab wraps inside the modal and its panel can scroll within a short viewport. These are disclosed local accessibility additions; the captured focus-redirect/inert behavior alone does not prove those exact safeguards.
- `usePathname` provides maintained client navigation updates in place of the captured runtime's route-subscription plumbing.
- Original analytics and unavailable image preloading are omitted. No analytics compatibility, original backend, current policy, authentication or 100% visual parity is claimed.
- Sign-in #682, settings #675, original session reader #680 and shared search #684 are separate work. This unit changes none of their modules.

## Test state and browser proof

The existing 91 page tests now declare an explicit already-closed **local test fixture** cookie. Their content, URL, keyboard, no-wallet/mutation/external-request and excluded-route assertions are retained. This fixture does not assert a captured visitor had accepted. All 15 new consent tests explicitly override it with empty cookies/storage, then establish each state through a real action or named test setup.

The new browser cases exercise initial focus/inertness without inferred acceptance, Continue/reload, actual backdrop click, actual Escape, event count, Tab wrapping, both legal links and Back, a separately seeded cookie, legacy `false` migration with no invented date, cross-tab storage, blocked storage, inert repair, hydration scripts blocked, 320/375/768/1440 widths and no external/mutating requests or console errors.

The first focused run passed 14/15; its Escape case sent the key before hydration focused the modal. The test now waits for the actual focused panel before sending the key, and the complete 15-case rerun passes. No product event behavior was changed to satisfy that timing correction.

`tests/clickwrap_state.test.ts` has 17 state/order/error/path cases. `tests/clickwrap_source.test.mjs` authenticates physical inputs, original call convergence and SSR migration, and runs that typed model in the normal application aggregate. Strict test types and the full workspace typecheck pass.

## Visual method and reproducibility

The same safe reference renderer from #685 is used for control and candidate: captured scripts are stripped, hash-checked local assets are served under nonce-CSP restrictions, the independently written DOM placement helper awaits DOMContentLoaded/retained stylesheets, and a visible shell is required. The recorded SSR overlay remains the reference for a fresh visit; an overlay-closed **display emulation** is separately labeled. Original visitor consent/auth state is unknown.

This unit adds `Network.clearBrowserCookies` before every capture. CDP targets share a browser cookie jar; an earlier explicitly accepted display case must not leak into the later fresh-visit case. Each run also starts a new browser profile. The old #685 source did not implement local consent and its unclosed-overlay limitation was correctly recorded; its packet stays unchanged.

At identical 1440x900 and 390x844 viewports, page bodies and unavailable illustration are masked equally. The local archive notice, short-viewport scrolling and other differences remain local changes; these comparisons qualify a bounded render, not a whole route or current legal workflow. Reports include actual source/harness/browser/reference hashes and PNG byte hashes.

From `app`, run:

```sh
node --experimental-strip-types --test tests/clickwrap_state.test.ts
node --test tests/clickwrap_source.test.mjs
pnpm --filter @pump-reconstruction/frontend exec playwright test tests/clickwrap.spec.ts
pnpm build && pnpm test && pnpm typecheck && pnpm verify:evidence
pnpm check:progress
```

`CLICKWRAP-VALIDATION.json` records completed and pending gates honestly. Shared coverage/progress milestones are unchanged.
