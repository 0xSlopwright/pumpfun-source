# Live detail readiness regression

A direct visit to `/live?page=4&stream=FIRST_MINT` exposed archived detail before
its passive effect installed the global Escape listener. Pressing Escape during
that visible-but-inactive interval left `stream` in the URL and did not restore
focus. This reproduces the preserved aggregate failure on d3faa690.

An instrumented real-browser probe on the unchanged component observed zero
Live Escape listeners when the panel first entered the DOM. The first Escape
was unhandled; after listener registration, a physical keyboard Escape dismissed
the same selection and focused search. The maintained regression dispatches
Escape synchronously at the first detail DOM exposure, making the race
deterministic instead of increasing a timeout.

The panel now shows the user-facing status **Loading archived details…** until
its dismissal effect is ready. Selected and invalid details then become visible
with working controls. The ordinary empty-selection panel remains server
rendered. No snapshot, URL contract, playback or modal-ownership rule changes.

The new regression fails on the original component at the URL assertion and
passes with the fix. All 14 Live browser tests pass, including the originally
failing direct visit, off-page/blank focus fallback, pagination/history, modal
ownership and prevented Escape. Frontend typecheck, 15 Live snapshot tests,
9 root captures, 6 tooling tests and 698-object/npm/SDK integrity checks pass.

Repeat after the documented workspace setup, with port 3010 free:

```sh
cd app/packages/frontend
corepack pnpm exec playwright test tests/live.spec.ts
corepack pnpm exec tsc --noEmit --incremental false
```

[VALIDATION.json](VALIDATION.json) pins tested source/test bytes, the original
probe, baseline-negative/candidate-positive results and the preserved initial
partial-dependency failure. The desktop/mobile before/after PNGs show the same
direct selected URL with local client scripts withheld, preserving CSS and the
preference bootstrap. They compare the preview state, not full original visual
parity. Normal hydrated controls and required viewports pass the browser suite.

The initial broad attempt encountered a missing SDK dependency in the isolated
workspace after `/create` navigation; its output is preserved and excluded from
the successful proof. Existing dependency files were shared read-only; no
install, lockfile or policy change was made. Full application aggregate results,
production playback/API compatibility and feature milestone credit are not
claimed by this fix.
