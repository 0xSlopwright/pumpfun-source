# Original bookmark-folder client workflow

This recovers the original folder-management interaction: list, create, rename and delete requests; viewer-keyed optimistic cache changes, rollback and invalidation; exported action wrappers; and the dialog's settled input/pending state. These are usable **injected client adapters**, with no default transport, auth provider, backend handler or product route. There is no production request, original-server response oracle, native compatibility or UI-completion claim.

## Source chain

The actual Explore caller **228998** imports hook **960107**, then lazy-loads **490258 → 796538 → 510021** for `ManageWatchlistDialog`. All four captured **510021** variants are checked, without inventing the active page winner. The hook's folder operations call **759257.j**, using **503630.R**'s declared `https://frontend-api-v3.pump.fun` origin and the **30181 / 898661** contract-client chain. **403206** declares the folder routes; **779106 → 92245** provides the viewer cache identity. **906032** supplies the `default` folder selector.

`contract.json` is regenerated from authenticated captured ASTs. It retains request options, declaration syntax, actual callback syntax, UTF-16 and UTF-8 witnesses, raw/factory hashes and all occurrences for representative same-byte factories. The source helper verifies original physical registrations and refuses ambiguous lookup without a selected origin. The extractor pins the reviewed factory set, checks actual import/lazy/re-export/prop-call edges and rejects new/missing dialog variants. No captured JavaScript is executed.

The source origin is a declared client binding, not a verified current service. The request port must implement the original contract-client-shaped operation/options interface. This unit does not create a proxy or silently use that production origin.

All four folder operations explicitly include credentials. The selected common client adds `x-pump-source: WEB` and `x-pump-platform: web` when absent; its other captured pre-request hook is empty. That selected hook does not add a bearer token. Cookie issuance, server authorization and headers supplied elsewhere remain unknown; this is not an anonymous-access conclusion. The injected request port owns this transport boundary.

## Preserved behavior

- **Requests:** list sends `GET /bookmarks` with an empty query, included credentials and JSON header. Create sends `{name}` and returns the parsed response without adding response-schema validation. Rename/delete discard parsed JSON and return the submitted identifier/name, rather than trusting a response to echo them. All four supply the original `throwHttpErrors:false` plus `afterResponse` checks; non-OK mutations throw their original messages. List throws `BookmarksHttpError` except for 304; an empty 304 body still fails `.map` rather than fabricating cached rows.
- **Declarations are separate:** the captured route metadata declares an ASCII letter/digit/space/underscore/hyphen name regex and UUID folder parameters. The selected contract client serializes requests and parses successful JSON; it does not validate successful bodies against those declarations. The adapter does not invent stronger validation or server acceptance.
- **Query:** the key is `["bookmarks", viewerKey]`, with five-minute stale time. The selected admission condition requires a requested query, non-null viewer and a finite decoded-JWT expiration after the sampled time. The query retries once except for this module's 401/403 error class. Viewer identity is trimmed user ID, then trimmed address, then null. Neither identity nor decoded-JWT presence authenticates an HTTP request.
- **Create:** cancel the selected folder query before taking its snapshot. Append a `temp-Date.now()` row; ISO creation time is a separate clock sample. Error restores a truthy previous snapshot. If the previous cache was undefined, the original callback does not remove the temporary row; this limitation is retained. Success invalidates the three selected viewer prefixes, rather than immediately replacing the temporary row with the response.
- **Rename/delete:** rename changes only the matching row's name. Delete cancels the exact folder query and host-selected coin-list keys, snapshots and clears those lists, then restores truthy snapshots on error. This unit does not reconstruct the coin-list selection/membership/card machinery; `coinListsFor` is an explicit host port. Completion invalidates only the captured viewer's `bookmarks`, `bookmarkedCoins` and `sidebarBookmarkedCoins` prefixes.
- **Exported actions:** check only decoded-JWT presence, then await the host mutation handle. Signed-out paths emit the source message and resolve. Rejected mutations are caught and also resolve with undefined. This is client behavior, not a successful write or authorization acknowledgement.
- **Dialog actions:** trim create/rename input, share a pending flag across operations, and clear input/edit state after a resolving callback. A directly rejecting callback is logged and leaves its input intact. Crucially, the actual exported action wrappers swallow rejection: **the composed dialog clears its create/rename input even when an underlying mutation failed and rolled back, or the signed-out guard denied it**. This behavior is preserved rather than improved. Closing clears editing only; create text and deletion confirmation remain. Default-name rows hide management controls as a presentation rule, not a server authorization guarantee.

## Explicit integration

```js
import {
  bookmarkFolderClient,
  folderQueryOptions,
  folderMutationOptions,
  folderActions,
  folderDialogWorkflow,
} from "./client.mjs";

const client = bookmarkFolderClient({ request: explicitContractClient });
const query = folderQueryOptions({
  requested: originalRequestedCondition,
  viewer: capturedViewerKey,
  decodedJwt: hostDecodedJwt,
  now: Date.now,
  client,
});
const options = folderMutationOptions({
  client,
  cache: hostQueryClient,
  viewer: capturedViewerKey,
  coinListsFor: hostSelectedCoinListKeys,
  now: Date.now,
  notify: hostSourceMessageRenderer,
});
// The host registers these options with its mutation framework, supplying
// create/rename/remove handles exposing mutateAsync. No scheduler is supplied.
const actions = folderActions({
  mutations: hostMutationHandles,
  getDecodedJwt: () => hostDecodedJwt,
  notify: hostSourceMessageRenderer,
});
const dialog = folderDialogWorkflow({
  ...actions,
  logError: console.error,
  onOpenChange: hostDialogOpenChange,
});
dialog.setCreateName(" My list ");
await dialog.create();
// A renderer uses getSnapshot/subscribe and the edit/delete action methods.
```

`notify` receives source translation keys plus optional descriptor data; rendering translation strings is a local port design. Cache and operation signatures preserve the selected callbacks, but TanStack/Ky retries, cancellation, auth/session transitions, React closure lifetimes and arbitrary observer reentrancy remain host responsibilities. The dialog observer API models settled interactions, not a full React component or its rendering schedule. Callers must supply their own proven session/transport; importing or constructing the adapter initiates no request or browser activity.

The exact list-query enable condition's `requested` input is computed by the original broader watchlist hook from its caller and chain settings. This unit does not implement those chain flags, placeholder default rows, item membership, multi-chain coin-card fetches, card sorting, terminal or individual-detail surfaces. It does not add a hidden account/owner override or a new backend contract.

## Repeatable checks

```sh
node app/scripts/original-bookmark-folders.mjs --check
node --test app/tests/original_bookmark_folders.test.mjs app/tests/original_source.test.mjs
python3 app/scripts/verify-evidence.py
python3 scripts/verify_evidence.py
python3 scripts/test_tooling.py
```

`--write` regenerates only the source-derived contract. Fourteen new tests and eleven shared-source tests pass. The tests cover query admission/retry, unvalidated response/async error behavior, two clock samples, optimistic order, truthy/absent rollback, viewer cache separation, selected list restoration, exported error swallowing, signed-out paths, pending/input state and default presentation. Missing variants, invented server/durability claims and a resealed source guard inversion fail closed.

The full interaction test uses a **real loopback HTTP server** with authored synthetic data, never a production request or captured server oracle. It follows actual operation/options/hooks through optimistic callbacks, exported actions and dialog state for list/create/rename/delete success and 503 rollback. It also exercises 401 and empty-304 listing behavior; non-JSON rename/delete response bodies are discarded. The request/cache test ports implement only the selected finite sequence, not the original entire networking or query frameworks. The server is shut down and temporary mutated corpus copies are removed.

No actual Settings/product-modal browser behavior, screenshots, full Next build, backend persistence or upstream availability is claimed by these Node interaction tests. Existing settings/privacy/notifications PRs remain separate. This unit changes no immutable captures, inventory, SDK, dependency/lock, shared shell, feature ledger or paused native prototype.
