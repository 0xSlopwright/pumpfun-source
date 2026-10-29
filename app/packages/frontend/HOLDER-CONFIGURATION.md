# Public holder-reward configuration read

The holder-rewards inspector now offers a separate **Read public configuration** action after deriving a PDA. It reads the published SDK's `Global` and mint-bound `bonding-curve` PDA pair, decodes the raw public account bytes with the unchanged SDK, and displays their stored flags and public authority/creator fields. Page load and PDA derivation do not request these accounts.

This is an independent public-chain read, not `GET /fees/holder-rewards` or recovered private server semantics. The Global flag is described by the SDK as a creation/conversion gate; it is not displayed as a general existing-coin payout switch. The curve flag is kept independent. No conjunction, eligibility, accrued/claimable amount, payout permission, signer or transaction-success result is calculated. Claim stays disabled. Additional per-quote/v2 curve addresses are not enumerated; absence at this specific SDK-derived PDA is not a claim that a mint has no other curve or reward participation.

## Source authority and older versions

Run `node scripts/holder-rewards-config/contract.mjs --check` from app. It checks five SDK source files byte-for-byte against the immutable npm4.3.1 archive, derives fixed-width field ranges/discriminators from the actual IDL, checks SDK size constants, and authenticates eight static method/PDA witnesses. It does not evaluate captured frontend JavaScript. The existing generic AST/UTF boundary primitives from #684 are reused, not re-credited. Original SDK sources and all original captures are unchanged.

`research/holder-rewards-config-20261029/SOURCE.json` binds SDK archive/source hashes and exact UTF-16/UTF-8 method fragments. The actual `OnlinePumpSdk.fetchCurveWithQuote` reads Global+curve in one `getMultipleAccountsInfo` call; its used distribution helper reads `isHolderReward`, and the creation/conversion guard sites establish the narrower Global flag meaning. This unit calls public account decoders, not those transaction builders.

| Field | Physical bytes (half-open, including discriminator) |
| --- | --- |
| Global claim authority | `[1054,1086)` |
| Global holder-reward creation/conversion flag | `[1086,1087)` |
| Curve creator | `[49,81)` |
| Curve holder-reward flag | `[124,125)` |

The published SDK zero-pads older Global/curve layouts. That default is useful for SDK calculations but does not prove that a field existed in a fetched account. This UI reports a missing physical field as **unknown**, even when the SDK returns false or the zero key. Fully present zero/false bytes remain observed zero/false values. It rejects noncanonical boolean bytes. These layout/field facts do not prove that the on-chain program would accept the whole account or execute an instruction.

## Used local read path

`HolderConfigurationPanel` → same-origin GET `/api/holder-rewards/configuration?mint=…` → actual exported Next GET wrapper → `handleHolderConfiguration` → `readLiveHolderConfiguration` → existing pinned HTTPS RPC factory → `getGenesisHash` + `getMultipleAccounts` → SDK decoder → physical-field projection.

The new GET wrapper deliberately forwards only Request; Next's route-context argument cannot replace the reader capability. The handler's injectable read port is for standalone tests; the production entry uses the real reader. There is no production fixture mode or data fallback.

The existing factory's **entire runtime body is byte-unchanged** from main03bc (body SHA-256 `49c42e491310e985a652dbfdcb553a9edfdbb58c16acd3005f63e7daafa41ab1`). The only changes to `portfolio/rpc.ts` export that existing factory and extend its TypeScript method union with read-only `getMultipleAccounts`. No hostname/DNS pinning, HTTPS, redirect, timeout, response-size, lossless JSON, RPC ID/error or old portfolio request logic changes. The producer checks this body hash. Server-owned `SOLANA_RPC_URL` and the existing public-only endpoint policy remain required; browsers cannot choose endpoint or method.

The server validates mainnet genesis, a two-account response with one context slot, exact Pump owner, non-executable account metadata, canonical bounded base64, physical size if supplied, correct discriminator, and the SDK's decoder result. Missing accounts are distinct nullable observations. Wrong owners/layouts fail the whole read. Account data is capped at64KiB. The SDK AccountInfo adapter accepts only safely representable nonnegative numeric lamports metadata; unsafe monetary metadata is an explicitly unsupported case, never rounded or displayed. Optional rentEpoch is not used. No balance is read from these data structures.

The browser omits credentials, uses no-store, validates mint/PDA/program/field-presence relationships and shows generic provider failures. It aborts/invalidates on edit, clear and unmount; a20-second client deadline is local policy. Configuration records share one RPC response slot; they are not an atomic snapshot with any separate balance request. No value is persisted or treated as authenticated account ownership.

## Validation and limits

From app:

```sh
node scripts/holder-rewards-config/contract.mjs --check
node --test tests/holder_configuration.test.mjs
pnpm --filter @pump-reconstruction/backend exec tsx --test ../../tests/portfolio_rpc.test.ts
pnpm --filter @pump-reconstruction/frontend exec tsc --noEmit --incremental false
pnpm --filter @pump-reconstruction/frontend exec playwright test tests/holder-rewards.spec.ts tests/holder-configuration.spec.ts
```

Nine new groups cover actual SDK decoding, independent flags, legacy absent bytes versus present false, nullable accounts, owner/discriminator/base64/boolean/metadata guards, wrong cluster, cancellation, strict client identity/presence and a real loopback HTTP client→actual handler→SDK-read pipeline. Inputs are synthetic public-account byte fixtures, not current production observations. The SDK padding behavior is checked directly as the independent default-value oracle. Existing RPC behavior is also rechecked.

At runtime revision `0726144070ac55ca438faaedc3123bb0554e3fa8`, all16 actual Next product cases pass: seven regular configuration cases, one production-entrypoint configuration guard, and eight existing inspector regressions. They cover explicit-only reads/no credentials, independent flags, old/missing fields, retry/privacy/identity, stale edits, and320/1440px containment. The entrypoint guard runs with the existing SOLANA_RPC_URL empty and a test-runner-only HOLDER_CONFIG_TEST_NO_RPC=1; the product reads no test flag and returns its normal503 configuration error. The producer,19 focused/RPC groups, frontend TypeScript,698 app evidence checks, progress and eight progress tests also pass at this revision. Raw commands/results and inspected local screenshots are retained in `visual/holder-configuration-20261029/`. Independent SDK/backend/Next production build, recursive typecheck,698 app evidence/npm/SDK checks and progress pass on the same runtime revision; the root logs are retained alongside the browser receipts; full original visual/API or live-chain parity is not claimed. A configured public provider may be unavailable. There are no live financial transactions, wallet signing, private auth, SDK/source/capture edits, or native/qualified developer API-count increases.

This branch starts fresh at main03bc, without duplicating #815's changes. #815 independently adds public PDA holdings. Its strict whole-RPC-file witness will need the explicit new source hash `823566f700301553707e3bf4033a65add468e6cd67a9c10a593b6ad369ca70b2` on integration of this intentional exported capability; its historical raw proof remains unchanged. The unchanged actual factory-body proof and existing RPC tests protect pre-existing behavior. No old evidence check is silently relaxed.

## Actual server integration correction

The production-entrypoint guard exposed a500 before any RPC: Turbopack bundled the SDK root's agent-payments dependency, whose default Anchor import is unavailable in Anchor's ESM entry. The same pinned SDK works through native Node require (used by the standalone SDK tests). Next16's documented `serverExternalPackages` option explicitly supports Route Handlers and native Node require; the frontend config externalizes the offending installed `@pump-fun/agent-payments-sdk` dependency on the server. The first SDK-root target did not prevent workspace SDK bundling and its failed compiled-route guard is retained; the dependency-level correction follows the actual remaining import trace. Browser `/swap` usage, SDK source/build/export bytes, dependency patches and lockfile are unchanged. This is a single observed integration correction, not a bundle-setting sweep. All raw failure logs and the latest failed trace are retained. The corrected dependency boundary passed the actual compiled-route guard and all16 cases. The retained trace belongs specifically to failed revision0c0c69; the earlier6d4425 raw500 log is retained, but its trace was overwritten by the runner before copying. The initial test-loader import.meta failure is separate from both actual integration500s.
