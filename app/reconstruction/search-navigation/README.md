# Captured identifier submission and navigation

The search wire packet decodes resolver verdicts, but the actual dialog's submit
and address-navigation decisions were not maintained. This recovers the used
Solana identifier handler and its form orchestration from SearchDialog 238128,
with explicit network, read-probe, UI and analytics capabilities.

```js
import { createSearchSubmit, createSolanaSearchNavigator,
  createSolanaGuards } from './navigation.mjs';

const shared = { controllerRef: { current: null }, pasteRef: { current: null } };
const navigateSolana = createSolanaSearchNavigator({
  ...shared, ...createSolanaGuards({ base58, PublicKey }),
  resolveIdentifier, getContractClient, probeKnownMint, probeSolanaMint,
  closeDialog, rememberTerm, trackMintPaste, trackWalletPaste, trackSearch,
  setLastClick, handleCoinClick, push,
});
const submit = createSearchSubmit({
  searchTerm, navigateSolana, navigateEvm, navigateHex, navigateNear,
  closeDialog, rememberTerm, push,
});
// Attach submit to the caller's form; every named dependency above is supplied
// by that caller. No network endpoint, probe, analytics or navigation defaults.
```

The actual `onSubmit` binding and awaited Solana call are checked against the
captured AST. Form submission prevents default, trims its captured input,
stops for an empty term, and tries Solana, EVM, long-hex and Near handlers in that
order. Only exact `true` or `"cancelled"` stops the chain. Otherwise it closes,
remembers the term and navigates to encoded `/explore?q=...`. The other-chain
handlers are explicit dependencies; this unit does not invent their behavior.

## Solana decisions

The handler aborts/clears an older operation before input admission. It preserves
the captured trimmed base58-text check and decoded 32-byte check. Its curve guard
is a mathematical `PublicKey.isOnCurve` wrapper, not account ownership,
authentication or evidence of an on-chain account. Decoder/library calls are
supplied by the caller and their failures retain the captured false fallback.

A definitive resolver coin uses the resolver mint. A definitive user selects a
profile directly; an external-wallet verdict additionally requires the curve
guard. An unrecognized definitive verdict does not silently become fallback.

Only the resolver's fallback verdict triggers `GET /coins-v3/{address}` with
the original params/query/signal, `throwHttpErrors:false`, tolerant JSON decoder
and status-observing `afterResponse` hook. A successful response with a mint
selects that mint. A successful response without one, or exactly 404, permits the
ordered read-probe ports. Other failed statuses stop. A truthy known-mint result
short circuits the on-chain probe; otherwise that probe and the curve guard
decide coin/profile/unresolved. These probes are not implemented or executed
against a service here. Both captured 464403 implementation variants remain
listed as opaque boundaries, with no active winner selected.

Signal and controller identity checks after successful resolver/read/probe awaits
return `"cancelled"` without clearing a newer controller. The read catch instead
distinguishes a DOMException AbortError from an ordinary Error merely named
AbortError. Other read failures return false even if a newer operation exists;
no broader cancellation guarantee is added. Capability errors outside that
catch retain their original propagation boundary.

On success the paste marker is consumed, the dialog closes and the term is
remembered. Paste/search/click callbacks then run in captured order. Coin click
callbacks share the same metadata object and navigate to `/coin/{mint}`; profile
navigation uses the captured encoded profile helper. These are navigation
boundaries only: excluded coin/detail pages are not implemented. Analytics
callbacks record nothing unless a caller supplies that behavior.

## Integration and proof

`getContractClient()` must return a callable operation client that honors the
supplied AbortSignal, parseJson and afterResponse hooks. Otherwise the handler's
status state cannot reflect a response. The existing resolver adapter from
merged PR684 can be supplied through `resolveIdentifier`; its transport remains
the caller's responsibility. No HTTP bridge chooses a production destination.

`PROVENANCE.json` binds the captured factory, complete handler and form-submit
ASTs, actual rendered form binding, imported IDs, shared ref initialization,
admission/route helper bodies, selected numeric constants and exact UTF-16/UTF-8
ranges to the raw objects. All available guard contexts and both opaque mint
probe variants are retained. Captured bundles are never evaluated. The lexical
comparator reuses earlier proof infrastructure; it is not a second recovery
claim. Underlying vendor/RPC/classification/analytics implementations remain
outside this unit.

From `/app`:

```sh
node scripts/verify-search-navigation.mjs --check
node --test tests/original_source.test.mjs tests/search_navigation.test.mjs
python3 scripts/verify-evidence.py
```

Tests run the actual maintained form submit through the navigator into a real
loopback resolver response and record its navigation callbacks. They also cover
fallback 200/404/503/invalid-JSON responses, ordered probe ports, abort/stale
completion, paste/click order, exact stop tokens, text fallback and source
mutation rejection. HTTP bridges and payloads are explicitly local test design,
not production fixtures or full Ky/request/schema compatibility. No live RPC,
wallet creation/signing, production navigation or analytics is performed.

No React/provider/effect lifecycle, other-chain navigation, backend endpoint,
current API compatibility, SDK/capture/lock changes, binary work or feature
milestone is claimed. Original shipped JavaScript retains its authorship;
descriptive names and capability interfaces are maintained local choices.
