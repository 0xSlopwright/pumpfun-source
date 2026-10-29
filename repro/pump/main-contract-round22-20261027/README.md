# Main Pump verified checkpoint — Round22

The maintained main contract matches **711 / 1,035 original function windows (68.7%)**, including **123 raw byte-equal bodies**. Those windows cover **851,688 / 1,792,208 original text bytes (47.5%)**. The closed direct-call subset contains 142 windows and excludes data references. Normalization masks specified call/address operands; it does not establish referenced data or whole-program identity. **Whole-ELF identity remains false.** These figures measure binary coverage, not the fraction of engineering work completed.

The captured-loader regression passes **44 suites / 10,468 cases** and **112 focused suites / 5,725 executions**, with **16,189 matching paired diagnostic-log cases**. These corpora overlap. Diagnostics exclude source coordinates and compute usage. Transactions use normal signatures and captured upgradeable-loader dimensions in local VMs; no current-chain acceptance is implied.

This checkpoint extends Round21 with the original legacy/V2 payment and buyback-panic sequence, the V3 panic and cost-validation sequence, and genuine Anchor SPL Burn calls in both migration paths. The Burn wrapper and instruction-construction helper add two exact normalized bodies; the shared buyback split adds one. New signed cases exercise insufficient balances, overflows, omitted recipients and post-completion paths.

Physical source files are restored to ten literal handler paths observed in the original ELF, preserving their module names and source-body bytes. This improves source-path fidelity without padding or hard-coded source positions; some helpers still belong in different original files, and exact source/line layout remains unfinished.

Every case's paired CPI invocation sequence is also audited, including failed transactions. One bounded queue schedules both corpora and keeps per-suite results for verified resumption; the preserved queue state records any retry history.

The direct import of the already-locked `spl-type-length-value` 0.7.0 trait changes only the main package's direct dependency declaration and imports. The 254 external lock records are unchanged. Its dependency graph was rebuilt without a cache, then both producer ELFs were reproduced through a new verified external-only cache. The producer target was absent during the final isolated main build. The package preserves those receipts and binaries; old-cache binary identity is not claimed.

Four independent fresh main compilations reproduce both final ELF hashes: the initial combined build, repeat, maintained source and archived source. No compiled main-Pump object is cached. Original executable bytes are never compiler inputs.

The loader optimization retains full actual ProgramData byte equality on every load while caching immutable expected images and hashes. Its earlier controlled benchmark and corruption controls remain applicable; full-suite timings depend on the workload and concurrent jobs.

```sh
python repro/pump/main-contract-round22-20261027/verify.py
python repro/pump/main-contract-round22-20261027/reproduce.py --registry-home ~/.cargo --output work/reproduce-main-round22
```

[Previous maintained checkpoint: Round21](../main-contract-round21-20261027/README.md). The remaining 324 function windows, validation paths, data, relocations and original build provenance are unresolved. [Parallel work queue](../../../research/main-pump-parallel-checkpoint-20261027/REMAINING-WORK.json).
