# Main Pump verified checkpoint — Round27

The maintained main contract matches **723 / 1,035 original function windows (69.9%)**, including **123 raw byte-equal bodies**. Those windows cover **886,312 / 1,792,208 original text bytes (49.5%)**. The closed direct-call subset contains 142 windows and excludes data references. Normalization masks specified call/address operands; it does not establish referenced data or whole-program identity. **Whole-ELF identity remains false.** These figures measure binary coverage, not the fraction of engineering work completed.

The captured-loader regression passes **44 suites / 10,468 cases** and **131 focused suites / 6,502 executions**, with **16,966 matching paired diagnostic-log cases**. These corpora overlap. Diagnostics exclude source coordinates and compute usage. Tests use captured upgradeable-loader dimensions in local VMs. The verifier requires serialized transaction bytes for every original/candidate result and rechecks signatures and instruction attribution. No current-chain acceptance is implied.

This checkpoint extends Round26 with the original 56-handler dispatcher order, the original update-global-authority function structure, full nested-pool key/owner diagnostic operands, legacy Sell cashback-account error order, and main CreateV2 gate precedence. The main-only source changes from PR264 are attributed in the recovery evidence and independently built/tested against the current source; unrelated program packets are not selected by this checkpoint.

The new matrix adds 158 comparison, cashback and creation-gate executions. Complete serialized transaction retention remains mandatory for every original/candidate result. Source and build provenance, unmatched bodies and complete data/relocation identity remain unfinished.

Every case's paired CPI invocation sequence is also audited, including failed transactions. One bounded queue schedules both corpora and keeps per-suite results for verified resumption; the preserved queue state records any retry history.

The direct import of the already-locked `spl-type-length-value` 0.7.0 trait changes only the main package's direct dependency declaration and imports. The 254 external lock records are unchanged. Its dependency graph was rebuilt without a cache, then both producer ELFs were reproduced through a new verified external-only cache. The producer target was absent during the final isolated main build. The package preserves those receipts and binaries; old-cache binary identity is not claimed.

Four independent fresh main compilations reproduce both final ELF hashes: the initial combined build, repeat, maintained source and archived source. No compiled main-Pump object is cached. Original executable bytes are never compiler inputs.

The loader optimization retains full actual ProgramData byte equality on every load while caching immutable expected images and hashes. Its earlier controlled benchmark and corruption controls remain applicable; full-suite timings depend on the workload and concurrent jobs.

```sh
python repro/pump/main-contract-round27-20261027/verify.py
python repro/pump/main-contract-round27-20261027/reproduce.py --registry-home ~/.cargo --output work/reproduce-main-round27
```

[Previous maintained checkpoint: Round26](../main-contract-round26-20261027/README.md). The remaining 312 function windows, validation paths, data, relocations and original build provenance are unresolved. [Parallel work queue](../../../research/main-pump-parallel-checkpoint-20261027/REMAINING-WORK.json).
