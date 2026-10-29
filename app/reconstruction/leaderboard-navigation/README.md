# Original leaderboard URL and landing-state workflow

The original leaderboard has coupled tab, period, shared URL-state and live-Cup
landing decisions. This reconstructs that used client chain as callable maintained
modules. It includes the actual enum/single-query queue path needed by those hooks,
so the workflow does not depend on a guessed URL-state implementation.

It does not mount a new product page, replace the existing independent local
categories or recover the entire Nuqs library, Next adapter, feature-flag service,
authentication or private backend.

## Original source and provenance

- **590407**: complete inline tab hook, allowed/default tab declarations and the
  actual page's requested/resolved tab expressions. Tabs are traders, squads,
  rewards and callouts; the default traders value is removed from the query.
- **747911**: complete period hook, enum declaration and link builder. Periods
  are daily, weekly, monthly and cup; the actual page consumes this hook.
- **869322**: complete live-Cup landing/timeframe hook; the trader board's actual
  caller uses daily/person/initialPeriod. Its list query disables polling via
  `isVisible: false`, without inventing a disabled initial query.
- **311282**: complete used parser builder, enum parser, single-query hook,
  parser-error wrapper, queue/snapshot/flush functions, Safari throttle
  initializer, pending state and cross-hook event bus. Unused array/number/date
  parsers and the multi-query hook are **not** adapted.
- **986071 / 706615 / 765115**: actual URL-key constants, live-kind predicate and
  vendor adapter/diagnostic edges are witnessed. The predicate and vendor
  providers remain injected capabilities rather than duplicated recovery.

`contract.json` binds raw object hashes, registration IDs, every selected inventory
entry/origin and exact UTF-16/UTF-8 witnesses. The strict generator verifies all
retained original ASTs and canonical maintained bytes. No captured bundle or
runtime factory is evaluated. Private original filenames/types and the active
runtime context remain unknown. Upstream material retains its authorship.

## Consumable capability boundary

```js
import { createLeaderboardNavigation } from './client.mjs';

// Keep one stable instance for one original URL-state module context.
const navigation = createLeaderboardNavigation({
  useMemoCache,
  react: { useRef, useState, useEffect, useCallback },
  useUrlAdapter, // searchParams, optional snapshot/rateLimitFactor, updateUrl
  useList, hasLiveCompetition,
  logDebug, logParseError, formatError, console,
  window, navigator, location, performance, setTimeout,
});
const { urlTab, setUrlTab } = navigation.useTab();
const { urlPeriod, setUrlPeriod } = navigation.usePeriod();
const { timeframe, landing, setTimeframe } =
  navigation.useLanding('daily', 'person', initialPeriod);
```

The caller supplies legitimate framework/router/query/browser capabilities when
integrating. Tests supply deterministic synthetic capabilities and a separate
local browser adapter. No actual user's profile, storage, cookies, credentials or
production URL is read. The vendor adapter/context and logging initialization
are not reconstructed or executed implicitly.

## Preserved decisions

- Query reads use the original parser and first URL value. Parser exceptions
  become null through the injected diagnostic. Enum parsing is case-sensitive;
  server parsing takes the first array value. Original setter serialization does
  not add enum validation, and the link builder retains literal interpolation.
- Setters emit shared-key state before a delayed URL flush. Updates coalesce into
  the same promise/Map, preserve other query values, and combine push/scroll/
  nonshallow options and transition functions. Standard default options remain
  replace/no-scroll/shallow.
- The used Safari throttle is50ms normally,120ms for detected Safari17+ and320ms
  for earlier/unparseable Safari. The adapter rate-limit factor is retained.
  Infinity resolves without flushing; a later finite update can drain the
  retained values. An adapter throw logs through the original boundary and
  rejects with the original **URLSearchParams value**, rather than a new Error.
- Same-key hooks synchronize through the shared event bus. External search-param
  changes reparse through an effect; cleanup unsubscribes the hook. This is not
  a reconstruction of every possible router or React scheduling behavior.
- The actual page resolves unavailable squads and desktop callouts to traders
  while retaining the stored URL choice. Live-Cup landing follows returned live
  buckets until a manual timeframe is selected; clearing it restores the current
  landing. These are unverified client UI decisions, not authorization or server
  scoring rules.

## Repeatable finite checks

```sh
node scripts/original-leaderboard-navigation.mjs --check
node --test tests/original_leaderboard_navigation.test.mjs \
  tests/original_leaderboard_navigation_browser.test.mjs tests/original_source.test.mjs
pnpm typecheck
pnpm verify:evidence
```

Deterministic tests cover source/provenance drift, batching, timing/options,
transitions, parser/default behavior, cross-hook updates, cleanup, failures,
external URL synchronization and landing decisions. Their hook driver is an
explicit test capability, not an asserted React/Next implementation.

The standalone Chromium test instead uses **actual React19.2.3 and its compiler
runtime**, real buttons, URLSearchParams and History APIs over a loopback server.
It checks tab/period changes, a second hook consumer, default-query removal,
unrelated keys/hash, external history/back, landing and fallback decisions. It
bundles only the maintained adapters and synthetic fixture with the existing
locked SDK toolchain's esbuild dependency; there is no SDK build, install, Next
server or captured-runtime execution. All requests are local GETs. The fixture
is not product UI, and its layout is not a visual-parity claim.

Exact tested source/tool/result bindings are in `validation.json`. Existing UI,
backend, SDK, captures, lockfile, feature ledger and completion counts remain
unchanged. Full app/browser compatibility, the actual Next adapter, private
backend/authentication, production behavior and visual parity remain unqualified.
