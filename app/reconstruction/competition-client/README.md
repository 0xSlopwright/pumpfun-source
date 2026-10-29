# Original competition read workflow

The captured Cup view requests competition buckets, selects the first matching
kind, then requests that competition's detail. This unit makes that used client
chain callable without executing captured bundles. It preserves the complete
list/detail hooks, original bucket selectors, query keys and both foreground
subscription variants. It adds no server ranking, registration, terms acceptance,
private authentication or mounted UI.

## Original source and caller evidence

| Source factory | Recovered boundary |
| --- | --- |
| 359516 / `59b1004bf7c8` | Complete 14-slot list hook |
| 961415 / `b3c4dc7eca96` | Complete 17-slot detail hook; unrelated co-registered 626540 portfolio export excluded |
| 85324 / `0024317d4e63`, `67966a7a877f` | Both complete focus/visibility modules and four exports |
| 639287 / `4ed887ef8ddc` | Complete competition key object; keys alone implement no mutations |
| 706615 / `e606b2e7f5ab` | Complete `y` bucket selector and `g` live-kind predicate |

The strict generator binds the original raw captures, registration IDs and
UTF-16/UTF-8 slices. It verifies maintained ASTs and canonical bytes, and retains
every selected inventory entry/origin in `contract.json`. Actual **590407** calls
both hooks and selects a competition by kind; **869322** calls the list hook with
`isVisible: false` and the live-kind predicate when choosing a Cup landing tab.
These are actual used call edges, not a claim that the whole original page is
mounted here. Private original filenames/types and the active deployment winner
remain unknown. Upstream material retains its authorship.

The **779106.f → 92245.$** viewer-key and **944410 → 96224 / 30181.K** contract-client
provider boundaries are preserved as explicit injected capabilities. The original
HTTP constructor uses configured `clientServerUrl`, `credentials: "include"` and
WEB source/platform headers. Its complete Ky behavior, schema validation,
HTTP-error normalization, retries, session handling and private server are not
reimplemented. Separate **139209** read-route declarations are parsed as evidence,
never executed. No deployment or production request is made.

## Callable client

```js
import { createCompetitionClient } from './client.mjs';

// Construct once for this source context. Use genuine application providers when
// integrating; tests inject deterministic browser/query capabilities instead.
const client = createCompetitionClient({
  foregroundVariant: '0024317d4e63db1b1791329f7416024563bc11858041efaa1e185556e58baae1',
  document, window, useSyncExternalStore,
  useMemoCache, useQuery, useClientServerContract, useViewerKey,
});
const list = client.useList({ isVisible: true });
const chosen = client.selectCompetition(list.data, 'person');
const detail = client.useDetail({ idOrSlug: chosen?.id ?? null, isVisible: true });
```

The full original foreground SHA must be explicit; there is no guessed global
variant or runtime winner. React/query providers retain hook scheduling and cache
ownership. The injected `useViewerKey('competitions')` is an unverified client
cache/display identity, never a backend authorization decision.

Preserved decisions:

- List key: `['competitions', 'list', viewerKey]`, stale time 15 seconds and
  foreground interval 60 seconds. `isVisible: false` stops polling without
  disabling the initial query. No extra error/retry policy is added.
- Detail key: `['competitions', 'detail', idOrSlug ?? '', viewerKey]`, stale time
  5 seconds and foreground interval 15 seconds. **Only literal `null` disables**
  the hook; undefined and an empty string still enable it. Disabled projection
  hides data/loading but retains error/refetch fields. Parameters and signal are
  forwarded exactly to the injected original-shaped contract provider.
- Bucket selection uses the first matching kind in live, then upcoming, then
  past. It does not sort, rank, repair malformed DTOs or calculate PnL.
- Focused snapshots require visible document **and** focus. Visibility-only
  snapshots ignore focus. Subscriptions preserve visibilitychange/focus/blur and
  cleanup; SSR snapshots return false without accessing document/window.
- The interval helper creates no timers. It retains the original numeric and
  truthiness expression, including zero, negative values, NaN and Infinity.
  The real query provider owns scheduling; tests do not claim to emulate it.

## Explicit local transport and finite qualification

`createCompetitionFetchTransport({ baseUrl, fetch })` is local test/integration
plumbing for the two GETs only. It has no production default, credentials store or
schema/ranking policy. It forwards an abort signal, uses include credentials and
WEB headers, encodes the detail identifier, preserves the supplied origin and
rejects dot-segment IDs instead of silently normalizing them. Non-OK responses
throw a named **local** error; this is not the original contract error decoder.
Original hooks also accept a genuine contract provider directly and preserve its
rejection identity.

```sh
node scripts/original-competition-client.mjs --check
node --test tests/original_competition_client.test.mjs tests/original_source.test.mjs
pnpm typecheck
pnpm verify:evidence
```

The finite tests use synthetic browser state and loopback HTTP only: source-drift
rejection, both variants, SSR, focus/blur/visibility/cleanup, memo identity,
null-disable behavior, viewer-key separation, real list→select→detail requests,
raw payload ordering, failure propagation, aborts and GET/origin restrictions.
No real user cookies, keys or private profiles are read. Existing pages/backend,
SDK, captures, lockfile and completion ledger remain unchanged. Full app/browser,
visual parity and production API compatibility are not claimed. Exact tested
source and command-log bindings are retained in `validation.json`.
