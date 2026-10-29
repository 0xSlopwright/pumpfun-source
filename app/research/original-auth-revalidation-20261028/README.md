# Original client session revalidation and UI invalidation

This unit recovers one coherent captured client flow: factory174764's profile request/status triage and AuthProviders589428's consuming revalidation, local cleanup and UI projections. It makes that flow independently consumable through explicit injected ports. It implements no server session or authentication service.

The public TypeScript API is `packages/frontend/src/original-contracts/auth-revalidation/index.ts`. Callers explicitly select `evidence/web/objects/9bafadffbe6dc98b.js` and supply a client factory, cookie-clear operation, storage and invalidated-state setter. The same retained capture contains both selected factories and the actual174764 import/call. There is no global numeric-ID or cross-chunk variant choice.

## Request → verdict → UI decision

1. The original helper requests `GET /auth/my-profile` through its injected client with `credentials:"include"`, `Cache-Control:no-cache`, `throwHttpErrors:false` and an afterResponse hook. The hook records the response; its final captured status determines the verdict. Payload/error values retain identity and remain unknown.
2. A2xx status or304 gives `ok`; exactly401 gives `rejected`; missing response and other statuses give `inconclusive`. Request failures are retained rather than replacing an already captured response status. No payload schema, signature or session validity is inferred.
3. The actual provider callback maps only `rejected` to local cleanup and the control result `invalid`. It maps both `ok` and `inconclusive` to the control result `ok`. Those names are original UI control signals, not authorization decisions.
4. Cleanup clears the auth cookie, attempts removal of `decoded-jwt` and `moderator-storage`, then sets the invalidated flag true. Each storage failure is swallowed independently. Cookie, setter and client-factory failures propagate at their original boundaries; there is no invented transaction or rollback.
5. The captured UI projection hides claims after invalidation (`invalidated ? null : snapshot ?? null`). Its separate authReady flag is `authReady || !!snapshot || invalidated`; a true flag therefore does not establish authentication.

Tests cover complete injected-client flows for401 rejection, successful/forbidden/server-error responses, offline/missing-hook results and cleanup failures; exact status boundaries, response-hook ordering, raw payload/error identity, thrown status accessors and projection identity are preserved.

## Original source and adaptation

`PROVENANCE.json` authenticates the original complete successful capture, exact request function/export, actual provider import/call, storage helper, cleanup/revalidation callbacks and visible-claims/authReady expressions. It records all selected origins, URL, full-object hash, raw-slice SHA256, UTF-16 ranges and corresponding UTF-8 byte ranges. The immutable capture URL is `https://pump.fun/_next/static/immutable/chunks/1x1vr6gub7ts_.js`.

The selected request factory is174764/`23bc387a95434710efbfc32c36fada4e1d869debdd5b62b86e693ded868b0dbd`; the consumer is589428/`4d12898c1c6cd0bc4e8518537175ecf57e5edf14a6723c4c15f8aad0bf97a400`.

The reviewed static adapter removes the Turbopack registration and exports the original async request function. It injects the original consumer's external bindings, retains its exact storage helper/callback nodes, and exposes the two exact UI projection expressions as pure functions. It preserves identifiers, literals, operators, operation order and exception boundaries. Kernel internals remain source-adapted JavaScript, with typed declarations and a TypeScript facade; they are not claimed as original TypeScript. Whole adapted AST and canonical bytes are checked against a reconstruction from raw registration ASTs. Semantic-tamper controls change status policy, headers, cleanup keys, rejection decisions and projections, and are rejected.

No captured bundle, factory wrapper, runtime or generated string is evaluated during extraction or verification. Tests execute only the standalone adapted logic with synthetic ports, never actual cookies, user profiles, credentials, wallet signatures or production requests.

## Dependencies and limits

This is independent of PR680's reader and PR687's predicates. Cookie clearing is an explicit port; no reader variant or local transport is selected. The shared `source.mjs` and11 tests are unchanged prerequisites from search/contracts commitsf6e469c3b,124f1194c and0a9a1f084, separately credited. The nested inventory expansion is not included; selected exact entries are compared separately in INDEX-COMPATIBILITY.json.

The original client factory's transport/service-origin implementation, original server behavior, full React provider lifecycle, login/logout issuance and authenticated route/UI compatibility remain unrecovered. The shared AuthProviders dependency is relevant to included routes in `contracts/routes.json`, but no route execution, global feature milestone, backend authorization or visual parity is qualified here. No capture, SDK, dependency, global ledger, backend or served route is modified.

## Repeatable checks

From `app/`, with pnpm10.24.0:

```sh
node scripts/original-contracts/auth-revalidation/recover.mjs
node --experimental-strip-types --test tests/original_source.test.mjs tests/original_auth_revalidation.test.mjs
corepack pnpm build
corepack pnpm test
corepack pnpm typecheck
corepack pnpm verify:evidence
```

From the repository root, run `python3 scripts/verify_evidence.py` and `python3 scripts/test_tooling.py`. Focused tests are11 flow/adaptation cases plus11 shared source cases. Full gate results and exact source/log hashes are recorded in VALIDATION.json.

## Completed gates

The22 focused tests, full app build, aggregate typecheck,698-object app evidence verification,9 root capture checks and6 tooling checks pass. The full app test run passes230 backend tests,60 app Node tests and every focused/Python suite; browser tests finish89/91. Failures are the unchanged leaderboard weekly/realized URL-state race tracked in PR663 and Explore test150 waiting for the no-results state. The latter passes1/1 when isolated. Relevant implementation/test bytes equal maintained main and are hashed in VALIDATION.json; complete stdout from the failed aggregate remains saved. No fully green aggregate result is claimed.

## Inventory anchor update

`PROVENANCE.json` now binds `recovered/modules.json` sha256 `1d268ae7f2eb0f61eaaffd222269bf29d9ce06e9946372861721b2f159d868e2` (main after #679, which only added factory files and index entries) instead of `9631271006faa37ea6055a11be4ec1faf971b45e2c7cdb78fc08a6530e777a50`. Every cited factory and its complete index entry is byte-identical across both indexes, and `INDEX-COMPATIBILITY.json` is unchanged. The anchor was the only regenerated field (`recover.mjs --write`).
