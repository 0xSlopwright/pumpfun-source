# Captured shell integration

The maintained root layout at upstream `f77117ea8827f2ff4a497a2a5360deba8608aeca` still imports `src/app/app-shell.tsx`. The captured components delivered by merged PR #529 (`9f240d13e7f67769f9bb9c0dd61e488b5095bf40`, merge `95f9fda50d03d3acffed968a0f33dc15e2d97e28`) and their CSS were unreachable from that entry point. This unit activates that existing implementation and supplies its search/mobile prerequisites. The legacy file remains available as a historical control.

## Evidence and boundaries

`SHELL-INTEGRATION-BINDINGS.json` pins the original HTML/CSS, physical JavaScript objects, UTF-16 factory ranges, factory hashes and generated asset hashes. Numeric module IDs are contextual labels, not globally unique identities. The five selected records were also checked against expanded inventory commit `7b52e2cfb780e246fe98c656122d95be769e17a3` (index SHA-256 `1d268ae7f2eb0f61eaaffd222269bf29d9ce06e9946372861721b2f159d868e2`): the same physical records remain present, and each selected ID still has one recorded variant. That inventory change is a separate unit; no inventory output is changed here.

- Sidebar: physical factory `721426`, provider `103547`; captured collapsed rail 3.5rem, expanded desktop 13rem, mobile sheet 18rem and breakpoint below 768px. The provider's observed setter changes React state. The former unused implementation's `sidebar_state` cookie read/write is unsupported by these sources and is removed before activation.
- Top bar and search entry: physical factory `400466`; search trigger, captured labels, hint and placement. The native dialog and encoded Explore navigation preserve maintained local behavior; upstream search results and authentication are not reconstructed.
- Bottom navigation: physical factory `29306`. Its captured closed-state icons and placement are used. Connecting More to the maintained accessible drawer is local design; it is not an assertion that the upstream open popup had this exact behavior.
- Captured SVGs, logomark, tokens and CSS are reused unchanged. Portfolio is a maintained local navigation addition using the existing Positions glyph.
- Keyboard focus containment/restoration, Escape/backdrop dismissal, main-content inertness and accessible names preserve maintained accessibility. The captured source establishes a mobile sheet, not every local event choice.
- Sign-in remains visibly disabled. Support, Terminal, mobile promotion, token detail, `$PUMP` and deferred Perps remain excluded/deferred. No wallet signing, external product, new API, prototype auth or native upload flow is introduced.

## Existing behavior and test adaptations

The existing 91 browser cases remain enabled. Three kinds of adaptations follow directly from the newly active captured markup:

1. Search opens from its captured trigger into a dialog, and Create opens its captured menu before the Create coin link. Route, encoded query/history, form validation, keyboard and mobile checks remain substantive.
2. Captured local logomarks are allowed; Explore still rejects every page-content image and any other image URL, and still checks for external requests.
3. Portfolio requires the captured Sign in control to be disabled instead of assuming no such button exists. Wallet/mutation and external-request checks remain.

Drawer locators distinguish the captured bottom navigation from its duplicate drawer route. Existing close, inertness, tab wrapping, focus restoration, active route, legal links, 404 and viewport checks are retained.

Rapid leaderboard query updates use the separately reviewed PR #663 dependency (`502033a57a38135753f55022c42380dd46ffa0ac`, initial cherry-pick `1652d4c32`, publication dependency `81ab7a2c0e86edd298c3374c7b6edb42f4124013`). This is not a shell recovery claim. Its failure was reproduced on the untouched control; the root worker already qualified the fix with all 91 browser cases.

## Safe original-reference rendering

`../../scripts/shell-parity.mjs` authenticates every served capture against the manifest. Every captured script is stripped; captured JavaScript is never served or executed. Babel only extracts literal `$RS`/`$RC` and stylesheet-gated `$RR` boundary calls from inert script text, ignoring strings and function bodies. A local nonce-bound helper waits for DOMContentLoaded and the named captured stylesheets, then places the retained DOM segments. The CSP blocks remote connections, frames and objects. Every reference screenshot now requires a visible `[data-app-shell]`; a blank reference aborts the run.

The previous regex renderer omitted `$RR("B:1","S:1",...)`, leaving the captured shell hidden. Those initial blank images and their pixel metrics are rejected and are not included in this packet. The same corrected harness is used for both the untouched control and integrated candidate, with identical viewport, masks, channel tolerance and explicit display branches.

Captured visitor consent/auth state is unknown. `overlay-closed-emulation` explicitly sets signed-out/accepted-display attributes; it is not evidence of an accepted-cookie captured session. The separate `ssr-overlay-present` case keeps the retained overlay visible. Local first-visit clickwrap remains unfinished. The clickwrap illustration and page bodies are masked equally; mobile-app promotion and app links are removed only from the reference because they are excluded by scope. No whole-page or 100% visual-equivalence claim follows from this bounded comparison.

## Reproduction

Pinned Node/pnpm and Chromium executable hashes, exact source hashes, reference asset hashes, masks, viewport dimensions, tolerance and all six image triplets are recorded in `visual/shell-integration-20261028/{control,candidate}/parity.json`.

From `app`, start the untouched control at port 3017 and candidate at port 3018 with `corepack pnpm --filter @pump-reconstruction/frontend dev --hostname 127.0.0.1 --port PORT`. Then run the same harness separately:

```sh
node scripts/shell-parity.mjs --local http://127.0.0.1:3017 --source /workspace/pump-app-shell-control/app/packages/frontend --out packages/frontend/visual/shell-integration-20261028/control --chrome /home/agent/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome
node scripts/shell-parity.mjs --local http://127.0.0.1:3018 --source /workspace/pump-app-shell/app/packages/frontend --out packages/frontend/visual/shell-integration-20261028/candidate --chrome /home/agent/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome
node --test tests/shell_integration.test.mjs
```

Control source: `6aa66f03c6e83e23f546be406b1eed158e15a507`; candidate adds the explicit #663 dependency and this integration. The app tree at pinned publication main is unchanged from that control.

Validation results and measured differences are recorded in `SHELL-INTEGRATION-VALIDATION.json`. Full app build/test/typecheck, all 91 standard-port browser cases, 698-object evidence verification, 8 progress tests, generated asset checks, and the 3 new source/reference tests pass. Root independently verified all 9 repository captures and 6 tooling tests on the exact tested source head. `visual/shell-integration-20261028/image-hashes.json` authenticates all 36 committed PNGs. Coverage/progress ledgers and qualification counts are unchanged.
