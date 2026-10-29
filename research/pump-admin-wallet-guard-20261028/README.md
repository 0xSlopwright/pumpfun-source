# Restore admin wallet coin validation and one ATA boundary

The qualified acc5 reconstruction validates a non-native AMM creator vault after
creating the wallet ATA and collecting Pump fees. The captured original validates
that vault before those CPIs. A malformed AMM vault can therefore produce extra
CPIs, events and return data in acc5 before the transaction fails. A successful
frozen-vault case also invokes ATA creation twice instead of once.

The correction joins native and non-native wallet paths at one genuine coin
validation point, caches account presence before the CPIs, and creates the wallet
ATA once. Source-token frozen validation remains first for non-native quotes.
Native quotes retain their conditional source-token handling. AMM collection
still depends on the validated vault being present and unfrozen. The two exact
token-reader helpers remain unchanged. Only `src/creator/admin_cto.rs` changes;
its inherited 775-line source layout and existing Source positions are preserved.

Eighteen signed original/acc5/corrected comparisons cover native, Token and
Token-2022 quotes, malformed vaults, combined invalid destinations, frozen sources,
empty vaults and valid frozen vaults. Acc5 differs in eight cases; the correction
matches every structured field and ordered `Program log` / `Program data` message,
without Source normalization. All 108 signature fields verify independently.
The unchanged 363-case admin corpus and twelve shared-holder cases also pass
strict program-message checks.

The unchanged 44-suite captured-loader corpus passes all 10,468 pairs. Its
inherited standard diagnostic audit covers 10,464 log-bearing cases and excludes
Source-coordinate differences. The strict focused checks above do not normalize
Source coordinates. Independent replay verifies 18,343 broad serialized transaction
fields / 27,875 signature fields. Including focused receipts yields 19,159 fields
and 29,503 verified signature fields; repeated fields are not unique transactions.

The actual warm build freshly compiles both local crates with 18,301 registry
files, 373 reused dependency artifacts, the qualified SDK tools and 25 target
libraries unchanged. A separate genuinely empty-target portable build authenticates
254 locked archives and 4,176 resolved source files and repeats both complete ELFs:

| Artifact | SHA-256 |
| --- | --- |
| Stripped candidate | `73919ffc721f10f2f499a9eb0674f2eb0fdd2b2db769e01134680915ed9f9058` |
| Symbol-bearing compiler output | `526f4ed9c2508811a91766184c72e568cd9612a51992f1fb4e7f38016c614988` |

The whole-ELF image is still different from the original. Both exact function
memberships remain 1,019 normalized and 188 raw, with all sixteen Pump residual
windows retained as unmatched. This is a demonstrated behavior correction, not
an exact-window gain or historical source attribution.

The warm compiler receipt is preserved unchanged. Its 66-input compiled-workspace
archive is materialized literally for the maintained runtime harness. Two clearly
labelled runtime-binding envelopes hash-bind that actual receipt, archive and
adapter and prove the retained standalone65-to-workspace66 transformation. They
are not relabelled compiler receipts and use no old build record graft. The cold
build has its own genuine compiler records. Generated cold target/profile-SDK
directories are explicitly outside publication inventories.

```sh
python3 -O -B research/pump-admin-wallet-guard-20261028/verify.py --repo .
# After integration, also check this exact maintained admin file:
python3 -O -B research/pump-admin-wallet-guard-20261028/verify.py --repo . --check-canonical-admin
```

The component verifier checks its retained qualified65 source by default. A
later composed legacy/admin image must prove its own complete source and build;
`--check-canonical-admin` binds only the maintained admin file in that composition.
An explicit `--source-directory` performs a full65 input check for that directory.
The static verifier executes no compiler or VM. The retained signature verifier
under `tools/` requires solders and likewise executes no target. Saved receipts
are not cryptographic execution attestation, and finite local tests do not prove
all program behavior or deployed acceptance.
