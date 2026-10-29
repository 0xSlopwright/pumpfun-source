# Original display-session restore workflow

This unit recovers the actual589428 display-session restore function and effect caller together with same-capture594435 pending-logout state. The typed API in `packages/frontend/src/original-contracts/auth-display-restore/index.ts` requires explicit storage, reader, decoder, client builder, abort controller, timer and logger capabilities. There are no ambient browser reads, real profile requests or implicit transports.

The original workflow is retained:

- A module-instance one-attempt guard is set before checking the existing reader, decoded-jwt storage or pending logout. Failed/skipped attempts are not automatically retried within that instance.
- If the guards permit recovery, an8-second timer aborts the injected controller while the client requests `GET /auth/my-profile` with credentials/include, no-cache and its signal.
- The response passes through the injected original S-normalizer boundary. Invalid data or a logout that starts during the request suppresses restoration. A concurrently restored reader returns true without overwriting storage.
- Otherwise the function serializes decoded claims, writes decoded-jwt, notifies the reader and emits the captured informational log, in that order. Request/normalization/write/notification/log failures return false; partial state is not rolled back. Finally clears the timer.
- Abort is a signal to the client, not a guaranteed hard deadline: a client that ignores abort can still resolve and restore. Reader/controller failures before the original try block propagate. These are observed source semantics, not changes or security guarantees.

Pending logout initializes from the injected storage, latches an in-memory flag, reads/marks it and preserves the exported consume operation. Storage exceptions are swallowed at the original boundaries. A failed persistent removal can make later consumption observe the flag again. The actual provider's logout marks this state; restoration checks it before and after the request. The consume export is preserved without a caller/reachability claim in this consumer.

The state belongs to one explicit adapted module instance. Create one instance for a corresponding runtime lifetime; the adapter supplies no global singleton or arbitrary variant selection. Ports structurally allow composition with the separately recovered reader/normalizer, without a dependency on PR680. The full React provider, actual transport/client-server origin, server authentication and login/logout implementation remain unresolved. These are **unverified UI display claims**, not authorization.

## Source authentication

Both factories occur in `evidence/web/objects/9bafadffbe6dc98b.js`, URL `https://pump.fun/_next/static/immutable/chunks/1x1vr6gub7ts_.js`:

- Provider589428:4d12898c1c6cd0bc4e8518537175ecf57e5edf14a6723c4c15f8aad0bf97a400.
- Pending state594435:b0d04ecd2aaa0755744a65c059b73905c135ffea314511d44102db5c99b79cdf.

PROVENANCE.json binds complete captured-object hashes, every selected origin, exact raw statements, actual effect/call, dependency imports and pending-logout mark to URLs, UTF-16/UTF-8 ranges and raw-slice hashes. The static adapter retains original declaration/export expression nodes, replaces runtime dependencies with parameters and returns the original operations. Whole generated ASTs and canonical bytes are compared to an original-backed transform. Timer, once-guard, request-operation, pending-state and added-code tampering fail verification. Captured bundles/factory wrappers are never evaluated during extraction or verification.

The decoder/client-builder/reader dependencies remain injected boundaries; no cross-chunk variant is selected. INDEX-COMPATIBILITY.json compares complete selected entries against the independently expanded inventory. A different594435 variant is explicitly unselected. The inventory expansion is omitted. The unchanged two-file source helper and11 tests originate from search/contracts commitsf6e469c3b,124f1194c and0a9a1f084; they are credited prerequisites, not new auth work.

This supports the shared original AuthProviders dependency of included routes in `contracts/routes.json`. It does not advance authenticated-route, visual or backend compatibility milestones, and does not overlap PR682's sign-in presentation. No captured evidence, SDK, dependency lock, served route, backend or global ledger is changed.

## Checks

From `app/` with pnpm10.24.0:

```sh
node scripts/original-contracts/auth-display-restore/recover.mjs
node --experimental-strip-types --test tests/original_source.test.mjs tests/original_auth_display_restore.test.mjs
corepack pnpm build
corepack pnpm test
corepack pnpm typecheck
corepack pnpm verify:evidence
```

Root checks are `python3 scripts/verify_evidence.py` and `python3 scripts/test_tooling.py`. Current focused coverage is13 workflow/adaptation tests plus11 shared source tests, with deterministic fake client/storage/clock/controller capabilities. Tests do not use actual cookies, profiles, credentials, browser storage or production services. Full app gates remain pending until their recorded results are available; no green aggregate or visual-parity claim is made while pending.

## Inventory anchor update

`PROVENANCE.json` now binds `recovered/modules.json` sha256 `1d268ae7f2eb0f61eaaffd222269bf29d9ce06e9946372861721b2f159d868e2` (main after #679, which only added factory files and index entries) instead of `9631271006faa37ea6055a11be4ec1faf971b45e2c7cdb78fc08a6530e777a50`. Every cited factory and its complete index entry is byte-identical across both indexes, and `INDEX-COMPATIBILITY.json` is unchanged. The anchor was the only regenerated field (`recover.mjs --write`).
