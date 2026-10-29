# PumpSwap transfer ABI and entrypoint recovery

Candidate `3fcae02128464717b29a0b3842fbba993d5d0befb4362c4094c8af8e32a8589d` matches **642/785 normalized original windows
(81.8%)**, including **129 raw-equal bodies**. Matched text covers
**804,472/1,162,040 bytes (69.2%)**. It gains two normalized windows and one
raw-equal body, with no losses from the published 640-window checkpoint.
**143 windows remain; whole ELF identity is false.** These figures measure
bounded binary recovery, not overall engineering completion.

The shared ATA-creation helper matches all **2,904 normalized bytes**, both real
callees and the nested 40-byte idempotent instruction constructor. The shared
buyback payout helper matches all **2,536 normalized bytes** and its actual
callee bodies. Sweep uses the already matching 2,672-byte signed pool-transfer
helper. All call-boundary claims retain complete bodies and relocation patterns.

Pool preparation now uses the typed account ABI supported by the original
callers, restoring the observed repeated account-header loads. Sweeps prepare
and fund the pool before validating the recipient. This fixes all eight
differences in the prior 160-case resize-order follow-up. The fresh matrix has
zero mismatches and 344 verified signatures; the original negative packet stays
in the previous checkpoint.

Legacy buys call the existing available/effective reserve methods and retain
the original late event-value reads. Their const specialization restores the
original wrapper size, but wrapper and handler bytes are still not identical.
The shared boost-authority guard restores its original call boundary; two
source-line stores remain different, so its full-body equality is not claimed.

The authenticated `solana-program-entrypoint` 2.2.1 archive restores all 17
entrypoint source descriptors and a raw-equal deserializer body. The nine-root
proof checks **166 archive members**, **9 Cargo markers**, the exact lockfile,
real offline Cargo metadata and the logical/private cache mapping. The recipe
binds **50 canonical**, **51 workspace** and **175 registry inputs**: **226
recorded inputs** total. This evidence does not uniquely identify the historical
lockfile, compiler or transitive source provenance.

Two strict offline Linux v1.44 builds produce identical stripped and unstripped
artifacts. All **762 cached dependency artifacts** remain unchanged across
both builds. Existing incentive-wrapper compiler stack warnings remain in the
logs; matching those wrappers is not a general stack-safety proof.

The candidate passes all **17,462 corpus cases**, **35,074 executions**, **35,418
verified signature fields** and **17,537 identical signed-message pairs**.
All retained supplemental suites were rerun. Further evidence includes 60 ATA
edge cases, 160 resize-order cases, 137 event/entrypoint cases, 15 boost cases
and the separately verified [1,514-case legacy matrix](followup/legacy-replay/README.md). Counts overlap. Some
inherited CPI probes use synthetic dependencies and are labeled separately;
comparators state their source-coordinate and compute-log normalization.

A separate [reserved-account follow-up](followup/reserved-accounts/REPORT.md) has **11 differences in 21 signed cases** on this checkpoint. The captured AMM rejects executable and non-rent-exempt recipients and reports per-index validation order; this candidate omits those checks and differs on short-list comparison logs. A minimal correction passes the next private build but is not selected here.

The bounded static/call audit reaches **585 windows**. Twelve recognized
descriptor-coordinate differences and two additional boost source-line stores
remain. Unclassified static data, complete code/call/relocation identity,
historical provenance, exhaustive behavior and authentic fixed-admin
`create_config` success remain open. See the [remaining-window partition](remaining-work.json).

```sh
python -B repro/pump_amm/transfer-abi-recovery-20261027/verify_saved.py
```

Add `--current-source` to bind maintained AMM sources. Result manifest:
`5ef281a0d6cf4dc23ca651f11d763cec0ebf6a3cd52e863898cb4867ffe662c6`.
