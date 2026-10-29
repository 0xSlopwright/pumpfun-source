# Main Pump verified checkpoint — Round23

The maintained main contract matches **712 / 1,035 original function windows (68.8%)**, including **123 raw byte-equal bodies**. Those windows cover **852,944 / 1,792,208 original text bytes (47.6%)**. The closed direct-call subset contains 142 windows and excludes data references. Normalization masks specified call/address operands; it does not establish referenced data or whole-program identity. **Whole-ELF identity remains false.** These figures measure binary coverage, not the fraction of engineering work completed.

The captured-loader regression passes **44 suites / 10,468 cases** and **116 focused suites / 5,792 executions**, with **16,256 matching paired diagnostic-log cases**. These corpora overlap. Diagnostics exclude source coordinates and compute usage. Transactions use normal signatures and captured upgradeable-loader dimensions in local VMs; no current-chain acceptance is implied.

This checkpoint extends Round22 with the original native migration refund helper, quote validation before fee errors, and prefix decoding of oversized Token-2022 transfer-fee extensions. The native refund helper adds one exact normalized window. New signed cases cover quote error precedence, extension lengths, unknown and duplicate TLVs, terminators and malformed tails.

The fee arithmetic helpers use the original `util/fee.rs` path, and Sweep invokes the shared recipient validator at the recovered call boundary. These source-structure improvements pass the same signed checks but do not add complete matched windows. Exact source/line layout remains unfinished.

Every case's paired CPI invocation sequence is also audited, including failed transactions. One bounded queue schedules both corpora and keeps per-suite results for verified resumption; the preserved queue state records any retry history.

The direct import of the already-locked `spl-type-length-value` 0.7.0 trait changes only the main package's direct dependency declaration and imports. The 254 external lock records are unchanged. Its dependency graph was rebuilt without a cache, then both producer ELFs were reproduced through a new verified external-only cache. The producer target was absent during the final isolated main build. The package preserves those receipts and binaries; old-cache binary identity is not claimed.

Four independent fresh main compilations reproduce both final ELF hashes: the initial combined build, repeat, maintained source and archived source. No compiled main-Pump object is cached. Original executable bytes are never compiler inputs.

The loader optimization retains full actual ProgramData byte equality on every load while caching immutable expected images and hashes. Its earlier controlled benchmark and corruption controls remain applicable; full-suite timings depend on the workload and concurrent jobs.

```sh
python repro/pump/main-contract-round23-20261027/verify.py
python repro/pump/main-contract-round23-20261027/reproduce.py --registry-home ~/.cargo --output work/reproduce-main-round23
```

[Previous maintained checkpoint: Round22](../main-contract-round22-20261027/README.md). The remaining 323 function windows, validation paths, data, relocations and original build provenance are unresolved. [Parallel work queue](../../../research/main-pump-parallel-checkpoint-20261027/REMAINING-WORK.json).
