# PumpSwap guard, route and data recovery

Candidate `e97b3900800d4378486d9b1f7df040e6b7a57d34b31a9470a5f5eb3a9d2fb24b` matches **638/785 normalized original
windows (81.3%)**, including **128 raw-equal bodies**. It adds **15** matching
windows with none lost from the 623-window checkpoint. Matched text is
**782,776/1,162,040 bytes (67.4%)**. **147 windows remain; whole ELF identity
is false.** These percentages measure binary-window coverage, not total work
completion.

## Behavior recovered

MigratePoolCoinCreator now checks that the pool has the canonical Pump creator
before validating sharing configuration. The previous selected candidate
differed in 12/24 cases: three incorrect successes changed account data and
nine returned the wrong error. All 24 cases now agree with the captured AMM.

MultiHop now classifies the next hop before invoking a run of Pump curves.
The preserved baseline returned the eventual error only after extra CPIs and
events in 12/56 cases. All 56 now match, including normalized diagnostics,
inner instructions, return data and full recorded account states.

The route executor retains each hop's output mint and uses a recovered vault
selector. The complete 352-byte vector-growth body now matches. The selector's
1,256-byte shape, real call targets and bounds descriptors are checked; its
source-origin fields remain different.

## Code and data evidence

Both 192-byte PDA helpers match complete normalized bodies, their real seed
and program-ID bytes, and their actual Pubkey callees. Account-layout recovery
adds exact Migrate/SetCoinCreator and ExtendAccount parser/wrapper bodies.
The SweepFees parser now uses the captured constant associated-token program.

The CreateConfig, InitUserVolumeAccumulator and two CreatePool initializer
helpers also match. The source uses coherent modules and genuine imports;
the chosen formatting and local size constant do not establish historical
source-text identity. The self-transfer validator matches after its used
imports are made explicit.

GlobalVolumeAccumulator and UserVolumeAccumulator declarations now produce
the original descriptor file paths in state/volume_accumulator.rs. Their
field-declaration bytes are preserved. **Line/column values remain unequal**;
this change does not claim complete static-data identity.

## Verification

Two strict offline Linux v1.44 builds reproduce this artifact. The explicit
recipe binds **48 canonical inputs**, **49 workspace inputs** and **169
authenticated registry inputs**: **218 total**, with **732 dependency artifacts
unchanged**. The separate repository Fees workspace is preserved.

Fresh replay passes **17,462 corpus cases**, **35,074 executions**, **35,418
signature fields** and **17,537 identical signed-message pairs**. All retained
supplemental suites were rerun. Additional current-candidate suites include
327 creator cases, 24 migration cases, 56 route-guard cases, 80 vault cases and
1,805 incentive/accumulator cases.

A further **328-case** route packet has **656 verified signatures**, **42
successful original transactions**, and **zero budget-exhausted cases**.
Both three-hop buy and sell finish successfully. These probes use ordinary
signed ComputeBudget instructions; the sell fixture also corrects its
buyback token account's mint. Its completion is not attributed solely to
the larger compute budget.

Counts overlap and are not a unique coverage total. The inherited eight
creator-order fixtures explicitly substitute a synthetic Pump CPI caller;
their scope is separate from probes using captured dependencies. Each packet
states its source-coordinate and compute-log normalization.

The inherited incentive-wrapper compiler warnings remain documented against
the matching original wrapper. This is not a general proof of stack safety
or of the historical runtime.

## Remaining work

A [separately sealed nine-case follow-up](followup/protocol-recipient/README.md)
still has six differences for malformed, unsorted normal recipient arrays.
The captured contract rejects the selected recipient via binary search; this
candidate still uses a linear membership check in those legacy paths. Current
setters enforce sorted arrays, so this is malformed-state parity evidence, not
a claim of a reachable-state exploit. The shared validator is being recovered
in the next source batch.

The [remaining-window partition](remaining-work.json) assigns every unmatched
window once. Complete code/data/call identity, historical toolchain and
lockfile provenance, exhaustive behavior, and authentic fixed-admin
create_config success remain open.

```sh
python -B repro/pump_amm/guard-data-recovery-20261027/verify_saved.py
```

Add `--current-source` to check maintained AMM sources. The result seal is
`81432da5731d0bf13e55637db32939489fb373033d62d0f2020a29000583e7c1`.
