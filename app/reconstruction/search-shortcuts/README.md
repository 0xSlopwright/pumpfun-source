# Mounted original search shortcuts in the maintained shell

The maintained global search listener recognized only Cmd/Ctrl+K, accepted
extra modifiers, and always opened rather than toggled. The captured mounted
SearchDialog238128 uses an exact pressed-key-set matcher for Meta+K,
Control+K and `/`, followed by the actual search-open toggle callback.

This unit restores that used matcher as `search-shortcuts.mjs` inside the
frontend search directory and installs it through the real SearchDialog effect.
Bare `/` opens search from non-editor focus and prevents the typed slash.
Bare text keys are ignored in inputs, textareas and contenteditable targets.
Modified matching shortcuts are deliberately allowed there. Extra modifiers
do not match: Ctrl+Shift+K, for example, does not open search. Keys lowercase
without trimming or introducing modifier aliases.

The local callback toggles the native dialog; closing this way clears its
local query and returns focus through native close behavior. Its URL remains
unchanged. The original close callback also aborts requests and resets other
state. This eager local dialog has no corresponding request/filter state, and
that broader lifecycle is not claimed reconstructed here. Existing shell
buttons, ordinary form submission and the separate Escape fix remain separate.

Two original phases must not be conflated. Factory400466 initially installs
a permissive Cmd/Ctrl+K-or-slash fallback that excludes all editors. Its flag
starts false and is set by the lazy child's onMounted callback, removing that
listener. The mounted child uses the different exact-set matcher described
above. Applying the fallback's editor exclusion permanently would incorrectly
disable modified shortcuts. The maintained dialog is eagerly mounted, so this
unit uses the mounted behavior and does not invent a lazy-module runtime.

`verify-search-shortcuts.mjs` authenticates actual registrations for 238128,
400466 and 617614 against original capture bytes. It compares the complete
matcher/normalizer ASTs using the unchanged planner alpha comparator. The used
configuration, listener installation/cleanup, actual React effect assignment
and consumer, toggle, open-state selectors and mounted handoff are all bound
with source URLs, SHA-256 hashes and UTF-16/UTF-8 ranges. The actual frontend
import, constructor, keys/callbacks and effect listener edges are checked too.
Captured JavaScript is never evaluated or imported. Descriptive names and the
TypeScript declaration are local reconstruction interfaces, not original paths
or types. Original code retains its authorship.

On unchanged main e38a8b97, the mounted baseline fails the bare-slash product
regression at the missing dialog. The max-failures1 run stops there: the other
two new cases were not run on the base. The candidate passes all three and
the existing query/history/clear/empty and keyboard-traversal cases, five total.
The tests observe installation of the real public open listener before their
physical key actions. They do not claim pre-hydration input readiness or mock
keyboard delivery. The body/editor target, prevented text insertion, modifier
rejection, toggle/reset, focus and unchanged URL are checked in the actual app.

Nineteen focused source/kernel tests also pass, including four source/UI
mutation controls. They preserve modified-editor admission, callback order and
receiver, errors, actual binding references and malformed-target behavior.
The maintained caller fingerprint covers its actual normalized effect rather
than unrelated rendering. A positive static check applies the real separate
PR886 Escape render handler and preserves this proof; it does not claim a
combined browser run. Historical full UI/screenshot receipts remain unchanged.
Temporary fixture hard links fall back to copies across filesystem boundaries;
captured files remain read-only. Next typegen and frontend TypeScript pass.
Required root 9-capture/6-tooling and app 698-object/npm/unchanged-SDK checks pass.

## Clear-navigation merge compatibility

The later #918 merge added a `pendingClear` popstate listener to the same
maintained effect. The checker previously rejected that new free variable,
even though the mounted matcher and its captured evidence were unchanged.
It now binds the actual component-local React `useRef(false)` as a maintained
UI role. The complete effect, including the popstate reset and cleanup, remains
in the caller fingerprint; unknown free variables still fail closed. Only that
fingerprint changes in `PROVENANCE.json`. The planner comparator, captured
proofs, matcher and mounted component are unchanged.

The static-only binding regression checks the merged caller, rejects an
incorrect ref initializer/import and an unmapped free variable, and confirms
that a known-role reset mutation changes the fingerprint. Together with the
existing matcher/source tests this qualifies the checker integration, not a
new browser run or expanded original clear-navigation compatibility. The
historical browser receipts above remain historical and are not regenerated.

Run from `app`:

```sh
node scripts/verify-search-shortcuts.mjs --check
node --test tests/search_shortcut_bindings.test.mjs tests/search_shortcuts.test.mjs tests/original_source.test.mjs
```

Run from `app/packages/frontend`:

```sh
corepack pnpm exec playwright test tests/search-shortcuts.spec.ts tests/shell.spec.ts --grep 'bare slash|Ctrl-K toggles|search encodes queries|keyboard traversal reaches' --max-failures=1
corepack pnpm exec next typegen
corepack pnpm exec tsc --noEmit
```

The recorded browser run used the normal config with its webServer disabled
against an already running owned 127.0.0.1:3010 dev server, workers1/retries0.
The ordinary command starts its own server. That server is now stopped.
Fresh matching-action desktop1280×800 and mobile375×812 controls show the
baseline closed after `/` versus the candidate open with the retained query.
They are maintained local references, not original-site visual parity.
`VALIDATION.json` binds those raw observations, screenshots and UI/test bytes.

No API, production data, authentication, feature milestone, captured artifact,
SDK/dependency, binary or shared framework helper is changed. Profile batching,
the async coin-search executor, query caching, module warmup, full React/compiler
lifecycle, other browser engines/input methods and aggregate app build/browser
qualification remain separate. This adds an actual shell shortcut workflow;
it does not establish complete SearchDialog or backend compatibility.
