# Original mute/unmute client and menu workflow

This provides an injected client workflow for the original callout/reply **mute action**: validated list reads, query options, optimistic mute/unmute callbacks, rollback, settled invalidation, wallet-prompt decisions and success/error messages. It does not add a product route, backend handler, auth/session provider, browser permission, live request or global feed policy. The ports make the selected client interaction usable without pretending to know the original server.

## Original evidence and dependencies

Actual comfortable-density callout/reply consumers **329657 / 204478** pass target/author props to **609488.f**. That factory also registers aliases **777997** (list query) and **561903** (filter utility). **609488 → 944410.useClientServerContract → 96224 / 30181.K** binds the request client. Both captured **944410** variants are checked. **820204** declares the three mute routes and the list response parsed by the original code. **779106 → 92245** supplies the viewer query key.

The contract reuses the existing, unchanged **settings-client recovery verifier** and its hash-bound 12 dated Flight configurations, rather than copying their extraction or credit. They bind `clientServerUrl` to `https://frontend-api-v3.pump.fun`; that is captured configuration, not current availability. Cookie issuance, server authorization, original server behavior and external credentials remain unknown. The injected `api` port owns the original configured client behavior, including inherited credential/header/error handling; the mute functions add no per-operation overrides.

`contract.json` records raw/factory hashes, actual import/caller/API/validator edges, selected callback syntax and strict UTF-16/UTF-8 witnesses. The source verifier authenticates physical registrations, retains both provider variants, checks the original list validator and binds the maintained configuration prerequisite. No captured JavaScript is evaluated or imported as application code. A changed reviewed factory or stale dependency requires renewed review.

## Recovered behavior

- `GET /mutes` forwards its AbortSignal, then validates `{userIds: string[]}` through the captured response schema. Order, duplicates and empty strings remain. Unknown object fields are stripped and the array is copied. The maintained finite JSON-shape parser rejects malformed input; it does **not** reproduce Zod's error class, paths, messages or arbitrary JavaScript-object semantics.
- `POST /mutes/{userId}` and `DELETE /mutes/{userId}` send the submitted parameter, await the original API port and discard the response. An API error propagates to the host mutation callbacks; an ignored successful body is not a new acknowledgement format.
- The list key is `["mutes", "list", viewerKey]`; query admission defaults on but requires non-null viewer scope. Query selection returns `userIds`, stale time is one minute, and signal forwarding remains intact. Viewer identity is a cache partition, not authentication.
- Both mutations cancel the selected query before snapshot/update. Missing cache remains missing. Mute prepends an ID only when absent; duplicate mute preserves the original cached object. Unmute removes all exact matches, including duplicates, and returns the same object when nothing changes. No address normalization or lowercasing is invented.
- Failure restores a truthy previous snapshot and reports the original feature/operation/user context through an explicit error port. **On settled success or failure**, invalidate the selected viewer's list prefix. Other viewer cache entries remain untouched in the finite tests; this is not a complete session-transition or concurrent-mutation proof.
- Menu targets use `author.userId || null`. No target means no item/action. Querying is requested while the menu is open with a target; the query's own viewer gate still applies. Missing wallet address prompts the existing wallet UI port and sends no mutation. A supplied address is only the original truthy client gate, not authenticated identity or server permission.
- The menu chooses mute/unmute from the settled list and uses mutation-handle callbacks for the captured success/error translation keys. Its toggle returns no promise/write acknowledgement. Success messaging retains the operation chosen before the optimistic cache change. Either handle's pending flag disables the rendered item; the original callback itself does not add a second pending guard. Trigger/content handlers stop propagation without inventing navigation behavior.

The exported **561903.D** helper preserves row-array identity when nothing is removed, retains unknown/falsey authors, and uses exact Set membership. **No incoming captured consumer is established in this unit.** The helper is provided separately; using it in an authored test or new renderer does not prove original global feed filtering, server-side hiding or block semantics. This explicit boundary is enforced by the saved contract.

## Explicit ports

```js
import {
  mutesClient,
  muteQueryOptions,
  muteMutationOptions,
  muteMenu,
} from "./client.mjs";

const client = mutesClient({ api: explicitConfiguredContractClient });
const query = muteQueryOptions({ client, viewer: capturedViewerKey, enabled });
const options = muteMutationOptions({
  client,
  viewer: capturedViewerKey,
  cache: hostQueryClient,
  reportError: explicitErrorReporter,
});
// Host registers options/query with its query framework. Mutation handles expose
// isPending and mutate(variables, { onSuccess, onError }); scheduling stays there.
const menu = muteMenu({
  author: { userId: selectedAuthorId, name: selectedAuthorName },
  getWalletAddress: () => hostAddress,
  getMutedIds: () => hostSelectedMuteIds,
  mute: hostMuteHandle,
  unmute: hostUnmuteHandle,
  showWallet: hostWalletUiPort,
  notify: hostTranslationMessagePort,
});
const state = menu.getState(); // visible / muted / disabled / label descriptor
if (state.visible && !state.disabled) menu.toggle();
```

The observer/label-descriptor API is authored integration, not the captured React component implementation or toast wire format. React closure lifetimes, rendering, framework retries, query/mutation scheduling and account transitions remain host responsibilities. No listener, browser state or request is installed by importing/constructing this adapter. Terminal density, report actions, block actions and individual detail surfaces are not reconstructed.

## Verify

```sh
node app/scripts/original-mutes-client.mjs --check
node --test app/tests/original_mutes_client.test.mjs app/tests/original_source.test.mjs
python3 app/scripts/verify-evidence.py
python3 scripts/verify_evidence.py
python3 scripts/test_tooling.py
```

`--write` regenerates only this source-derived contract. The maintained settings/configuration verifier runs on every recovery/check; its files and captured evidence remain unchanged. Thirteen new tests plus eleven shared-source tests pass. They cover response shape/unknown fields/sparse arrays, forwarded signals, query conditions, optimistic identity and order, absent caches, rollback/report/invalidation, viewer separation, missing-target/wallet gates, message selection, pending presentation and the standalone filter boundary.

A **real loopback HTTP** test follows list → validation/query cache → actual menu-selected mute/unmute → optimistic callbacks → response/error → rollback and settled invalidation/messages. It uses authored synthetic UUIDs/responses and an explicit finite request/mutation harness, not an original server oracle, authenticated wallet or clone of the whole query framework. A 503 unmute rolls back and emits the failure path; a subsequent success updates the selected list. The server is shut down afterward.

Mutation fixtures first reproduce the unchanged contract before tampering. Missing provider variants, a stale configuration prerequisite, invented global-filter claims and a wallet-gate change resealed through raw/index hashes fail closed. Temporary copies are removed, preserving every original capture. No coverage/operation count is awarded: these three routes were already inventoried; this unit adds missing client interaction, not new endpoints.

No product-browser/visual-parity, full Next build, backend persistence, current upstream availability or complete app/security compatibility result is claimed. No capture/index/SDK/dependency/lock/shared-shell/feature-ledger/native-prototype changes are included. Existing settings, device privacy, notifications and bookmark-folder units remain separate.
