# Captured settings and presence client contracts

The original settings client contains two operations missing from the 330-operation literal ledger: **GET and PUT `v1/user-preferences/settings`**. Its relative inputs do not start with `/`. This recovery binds them to the actual Hermes client factory, producing the machine-readable [settings-client-recovery.json](settings-client-recovery.json). It adds no backend, UI, proxy, authenticated capture or compatibility claim, and leaves the historical ledger and raw captures untouched.

Run from `app/`:

```sh
node scripts/settings-client-contract.mjs --check
node --test tests/settings-client-contract.test.mjs
# Explicitly regenerate the declarative artifact from unchanged captured inputs:
node scripts/settings-client-contract.mjs --write
```

This PR is stacked on [inventory PR #679](https://github.com/lalalune/pumpfun-source/pull/679), source/index commit `7b52e2cfb780e246fe98c656122d95be769e17a3` (published head `b5922dc3b5d454ebb10c51763997e0afd5ffd4c9`). That dependency is separately authored and reviewed; only this verifier, its tests and these two contract documents belong to this settings unit. Its source dependency supplies: **5,947 variants / 7,337 origins**, catalog SHA-256 `1d268ae7f2eb0f61eaaffd222269bf29d9ce06e9946372861721b2f159d868e2`. The extractor resolves every literal direct import in this bounded slice against all variants in that complete index. It does not build or replace a whole-application source graph. All direct imports in this slice resolve; both 944410 variants are retained, and their Hermes provider behavior agrees. No page-specific choice between those two variants is asserted.

[Related PR #675](https://github.com/lalalune/pumpfun-source/pull/675) independently reconstructs the settings modal and records overlapping Hermes operation bindings. This unit adds source-bound generation, semantic tamper checks, all-variant resolution, dated provider configurations and the presence declaration/client boundary. Its two-operation count is relative to the unchanged historical 330-operation ledger; it does not claim priority or additional operation credit over #675. It changes none of that PR's UI or files.

## Recovered request and state behavior

| Source                          | Bound behavior                                                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 917781 `d1d7a6dc…`              | GET/PUT call sites, nine controls, load/mutation gates, update merge and mutation-success cache                                      |
| 944410 `eb97d758…`, `6e0b85a8…` | Both `useHermesApiClient` variants call 30181 export `p` only when runtime `hermesNotificationsAvailable` is truthy                  |
| 30181 `fbae4e50…`               | Independent Ky client with `prefixUrl: "/api/hermes"`, timeout 60,000 ms; no Authorization/pump-header hooks or credentials override |
| 528798/484018, 779106, 92245    | Feature flag, settings cache key and viewer selection: trimmed userId first, then trimmed wallet address, then null                  |
| 96224, 894228                   | Newly resolved provider and its actual runtime configuration `.parse` schema                                                         |
| 85509, 402030, 898661           | Presence route declarations, contract aggregation and generic contract-client behavior                                               |

The effective browser path is `/api/hermes/v1/user-preferences/settings`, on the current page's origin. Its ultimate server-side upstream and authentication enforcement remain unknown. Browser `Request` credentials therefore use the same-origin default; this is a transport option finding, not proof of a server session model. The adjacent client-server client explicitly uses `credentials: include` and `x-pump-source: WEB` / `x-pump-platform: web`; those options must not be attributed to Hermes.

GET calls bare Ky `.json()` with **no response schema validation**. PUT awaits the HTTP request, ignores the response body, returns the submitted object and places that object in the viewer-scoped settings cache on success. It does not cache a parsed PUT response. The captured Ky defaults include retry limit two and eligible methods/status codes; the artifact records those options, not an emulator of the entire Retry-After/cancellation state machine. HTTP errors remain enabled. Hermes does not use the generic `ContractError` wrapper described below.

The update path runs only when loaded data is truthy. It creates exactly three groups, spreading each existing group before its partial patch: `chat`, `social`, `coins`. Unknown fields inside existing groups survive; additional top-level groups are not copied. No complete request/response schema is inferred from these controls.

- Chat: `allowGroupNotifications`, `allowChatRequestNotifications`.
- Social: `allowDmMessageNotifications`, `allowFollowerNotifications`, `allowNewCoinNotifications`, `allowCoinWatcherNotifications`.
- Coins: `allowPriceSpikeNotifications`, `allowLiveStreamNotifications`, `allowCalloutNotifications`.

All nine displayed values use `?? true`. These are **UI fallbacks, not observed server defaults**. False, zero and empty string are not replaced by the fallback. Optional chaining covers the response base only: a non-null response missing its nested group can still throw rather than being validated or repaired. The source query gate requires the feature flag, a client and a non-null viewer scope. Per-mutation `onError` is absent here; global query-client behavior remains outside this bounded recovery.

## Actual captured configuration and presence boundary

The extractor reads inert `self.__next_f.push` string literals from the captured HTML using Babel. It parses the relevant Flight JSON/import records, resolves the provider export-name reference and respects UTF-8 byte lengths of text records, including multiline/Unicode text that can resemble record headers. It never evaluates scripts, executes a captured factory, or contacts any service.

All **12 captured provider configurations** in the manifest dated **2026-10-28T10:48:45.546100+00:00** bind module 96224's `ApiClientsConfigProvider` to `clientServerUrl=https://frontend-api-v3.pump.fun` and **`hermesNotificationsAvailable=false`**. Consequently the Hermes query is disabled by these captured configurations, independently of its feature flag. These dated observations do not establish current availability. The output records each URL, object hash and Flight import/value record. It publishes no bearer-token value.

The configuration provider actually parses its config through schema 894228, including a required URL-valued `clientServerUrl` and optional boolean `hermesNotificationsAvailable`. This runtime **configuration** validator must not be confused with a settings **response** validator.

Presence GET/PATCH were already in the 330 ledger. Factory 85509 declares an owner-only response with required boolean `sharesLastActive`, and a partial PATCH with that boolean optional. Its descriptions say default true, omitted fields preserve stored values, false erases the current last-active stamp and true resumes on the next request. Those are captured declarations; no owner-state response or mutation was observed. The generic contract client returns `.json()` without validating the successful response against that declaration. Its separate error path attempts JSON text decoding, applies a route error schema or generic error-body schema when possible, and wraps a `ContractError` with a status-only fallback. Operation-specific presence error codes are not established.

The provider configuration and client-server factory support a **dated presence service-origin binding** to `https://frontend-api-v3.pump.fun`. No concrete presence settings hook invocation or runtime request was found in this bounded slice. No new presence operation or live compatibility credit is claimed.

## Verification and limits

The verifier recomputes the artifact directly from original, hash-bound capture bytes and exact UTF-16 factory ranges, independently of the pretty recovered source files. Every selected module's direct import records all catalog variants. Critical client/import identities, gates, merge ordering, JSON body mode, return value and mutation-cache handler are checked structurally. Formatting or editing a generated artifact cannot substitute for those bindings.

The tests cover both provider variants; all nine nullish controls; viewer/cache separation; update preservation; exact AST source ranges; dated provider configuration; Flight Unicode/byte-length boundaries; raw corruption; omitted variants; and **resealed** default, timeout, PUT body-mode, cache-value, query-gate, GET decoder and SSR availability tampering. They also reject an artifact that invents response validation. Synthetic tampering happens only in disposable test copies. No original capture is changed.

This is usable source-backed contract data, not an executable replacement transport. No local HTTP adapter, native backend, UI completion, authenticated compatibility, upstream availability, original private backend source or visual parity is asserted. Feature scores and existing under-review graph files are unchanged. Common repository build/test/evidence checks are coordinated separately by the integration owner.
