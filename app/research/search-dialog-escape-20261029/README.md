# Escape dismisses a populated global search dialog

On main `e38a8b97a18d33417e364487eb69f8ed74aff19e`, open global search,
enter text and press Escape. Chromium clears the native search input and leaves
the modal open. A second Escape closes it. Both desktop (1280×800) and mobile
viewport (375×812) regressions fail at the first dismissal assertion.

The event probe records the cause: the first key generates input/search events
with an empty value, but no dialog cancel. The dialog is still open. The second
key generates cancel and closes it. Changing only the filled input's DOM type
to text in a causal control restores first-key cancellation. That control is
diagnostic, not the implementation.

The eight-line fix handles Escape on the dialog, prevents the native input
clear, stops propagation and calls the native dialog close method. It preserves
the draft, restores focus through native close behavior and leaves the URL and
ordinary form submission unchanged. Other keys and native cancellation remain
available. It does not change Settings, Live, shell events or the search API.

The same two regressions pass with the fix, including exact URL preservation
(query, repeated tag and hash), trigger focus, reopening with the draft intact,
and repeated dismissal. The affected browser run also passes the existing
query/history/clear/empty and keyboard traversal cases: four cases total.
`next typegen && tsc --noEmit` passes without a full build. Required root
9-capture/6-tooling and app 698-object/npm/unchanged-SDK checks pass.

Run from `app/packages/frontend`:

```sh
corepack pnpm exec playwright test tests/search-dialog.spec.ts tests/shell.spec.ts --grep 'populated global search|search encodes queries|keyboard traversal reaches'
corepack pnpm exec next typegen
corepack pnpm exec tsc --noEmit
```

The normal config starts its own isolated local server. The recorded run used
the same config with webServer disabled against an already running owned dev
server on 127.0.0.1:3010; retries remained zero and workers one. The new product
tests use the actual shell button, input and physical key, with no event mocks,
extra delays or timeout changes.

`baseline-probe.json` and `candidate-probe.json` retain actual ordered events,
open/value state and exact URLs. The causal observer wraps addEventListener
only to note when the actual pump:open-search listener is installed, then opens
through the real shell button, fills the field, sends Escape, observes one
animation frame and records state. It records second-Escape and type=text
controls separately. An initial cold probe clicked before that listener existed;
its timeout is preserved privately and excluded from the Escape proof. This
fix does not claim initial hydration readiness.

Four PNGs show the same page/input/key at each viewport before and after the
fix. The maintained baseline is the reference: these are local UI observations,
not original-site visual parity. The expected visible difference is an open,
cleared dialog before versus the closed dialog and focused trigger after.
`VALIDATION.json` binds source/test bytes and every checked-in observation.

No captured JavaScript was executed, and no production request, signing,
dependency, SDK, backend, feature-progress milestone or binary work is included.
The original search request/query reconstruction stays separate. Full app build,
aggregate browser suites, other browser engines and exhaustive input-method
behavior remain unqualified.
