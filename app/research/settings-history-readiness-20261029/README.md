# Settings Back test: hydrate before native history setup

The mobile Settings Back test created a native history entry after observing server-rendered Live playback text, before the router necessarily hydrated. In the failing run, the initial entry had null router state. Back changed the browser URL but the router ignored that entry and the dialog stayed open. This was a **test setup race**, not evidence that the normal interactive Settings Back flow needed a product-code patch.

The change opens the real mobile sidebar and waits for its open attribute before seeding the extra history entry. It uses an existing application interaction, no sleep or private router assertion. Escape logic, Settings/sidebar/Live implementation, history semantics and unrelated URL handling are unchanged.

## Causal observations

Baseline: `31cea320be04121f25ebb2effb34ad54b5458a64`. Primary application source is unchanged. The diagnostic records native history calls, popped router state, URL, dialog/focus/sidebar state and RSC request timing on the actual local Next app.

| Seed order                                   | Initial/popped router marker | After Back                                                         |
| -------------------------------------------- | ---------------------------- | ------------------------------------------------------------------ |
| SSR playback visible, then native push       | null / null                  | URL returns to Live, Settings remains open                         |
| Actual sidebar interaction, then native push | true / true                  | Settings closes; launcher focus, sidebar and Live selection remain |

`initial-causal-trace.json` retains that observation; `initial-producer.mjs` is its unchanged historical producer with the original workspace/3027 paths. Its hash was recorded at packaging. Next 16.4.1's installed `app-router.js` handles null popstate by returning without a router traversal, consistent with this trace. The initial exact uninstrumented Back-only failure is retained in `before-back.log`.

The cause is timing dependent. Intercepting all local requests delayed scripts enough to mask the race; both orders passed in that exploratory probe. A later warm run of the separately portable, hash-bound producer also found both entries already initialized and both orders passed. `causal-trace.json` preserves that result rather than manufacturing a negative case. The portable producer requires the interactive path to pass but does not require the old order to fail on every run.

## Actual checks and limits

- The updated Back case passes, preserving the selected Live mint, playback, mobile sidebar, body-scroll ownership and launcher focus.
- The full 15-case Settings attempt reached **9 passes, 1 failure and 5 not run** under max-failures 1. The failure is the separate existing Escape/search/repeated-reopen case. Its entire test body is byte-identical to the baseline; its hash is recorded. No Escape fix is included.
- The remaining four desktop/tablet/mobile viewport cases pass. The unchanged final no-network/no-preference-write/no-permission case passes on its required port 3010; it hardcodes that origin, so its expectation was not loosened for the 3027 diagnostic.
- Unique coverage is **14 pass, 1 known separate failure**, not a whole-suite pass. Logs and checksums are retained in `verification.json`. All actual diagnostic cases reported zero page errors and external requests.

`verify-settings-history-readiness.mjs` authenticates saved logs/producers, the historical (`31cea320`) and qualified-head (`56bf3493`) source hashes via `git show`, plus these bounded results. It does not check the live worktree, so it keeps passing after later main changes; those changes are outside this receipt and need a fresh run. It does not rerun a browser or make the saved report an independent oracle. Historical producer and portable producer bindings are separate. The package makes no original-website, backend, visual-parity, full-app or security-equivalence claim.

## Repeat

Use the existing dependencies and start one owned Next server from `app/packages/frontend`, without changing the application configuration:

```sh
node node_modules/next/dist/bin/next dev --turbopack --hostname 127.0.0.1 --port 3027
```

From the repository root:

```sh
node app/tests/settings_history_readiness.browser.mjs \
  --base-url http://127.0.0.1:3027 \
  --baseline 31cea320be04121f25ebb2effb34ad54b5458a64 \
  --output app/research/settings-history-readiness-20261029/causal-trace.json
node app/scripts/verify-settings-history-readiness.mjs
```

The producer checks that application `src/` equals the supplied baseline before running. It binds the actually executed producer and four relevant files. Changes require a fresh run, not rewriting receipt hashes. The historical initial failure remains a separate frozen observation.

For the maintained suite, run the existing Playwright config on its normal port 3010:

```sh
cd app/packages/frontend
node node_modules/@playwright/test/cli.js test --config playwright.config.ts settings.spec.ts --max-failures=1
```

Qualification used a temporary config that changed only server ownership/base URL/output/trace settings, with the same tests and one worker. The boundary case used 3010 unchanged. The existing unrelated Escape failure remains reported. Next processes were stopped and temporary configuration/browser contexts/owned caches cleaned up. No dependency install or SDK/raw capture change occurred.
