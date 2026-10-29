# Main Pump verified checkpoint — Round30

The maintained main contract matches **726 / 1,035 original function windows (70.1%)**, including **137 raw byte-equal bodies**. Those windows cover **888,232 / 1,792,208 original text bytes (49.6%)**. The closed direct-call subset contains 145 windows and excludes data references. Normalization masks specified call/address operands; it does not establish referenced data or whole-program identity. **Whole-ELF identity remains false.** These figures measure binary coverage, not the fraction of engineering work completed.

The captured-loader regression passes **44 suites / 10,468 cases** and **135 focused suites / 6,555 executions**, with **17,019 matching paired diagnostic-log cases**. These corpora overlap. Diagnostics exclude source coordinates and compute usage. Tests use captured upgradeable-loader dimensions in local VMs. The verifier requires serialized transaction bytes for every original/candidate result and rechecks signatures and instruction attribution. No current-chain acceptance is implied.

This checkpoint recovers the native transfer-fee and inverse-fee helpers, including their 24-byte fee carrier, and the raw-equal six-account ATA cleanup helper. It preserves native extra-curve account handling and all instruction metadata. The only dependency change pins solana-program-entrypoint to 2.2.1; all 254 other package records are unchanged. That source version restores 17 original source-location bytes without fabricated line padding.

The qualified linker recipe is rederived from this exact source and dependency graph. Every original/candidate result still retains signed transaction bytes. The standalone verifier recomputes allocated-image translation from archived maps and the default-layout candidate; unallocated symbol data and some ELF header fields remain outside that proof.

Every case's paired CPI invocation sequence is also audited, including failed transactions. One bounded queue schedules both corpora and keeps per-suite results for verified resumption; the preserved queue state records any retry history.

The changed dependency graph was rebuilt with no cached artifacts through an ordinary physical-wrapper producer, then reproduced by a separately fresh cache consumer. Both matched hashes are retained, and the producer target was absent during independent consumer checks. Only verified external dependencies are reused; each main contract is freshly compiled.

Four independent fresh main compilations reproduce both final ELF hashes: the initial combined build, repeat, maintained source and archived source. No compiled main-Pump object is cached. Original executable bytes are never compiler inputs.

The loader optimization retains full actual ProgramData byte equality on every load while caching immutable expected images and hashes. Its earlier controlled benchmark and corruption controls remain applicable; full-suite timings depend on the workload and concurrent jobs.

```sh
python repro/pump/main-contract-round30-20261027/verify.py
python repro/pump/main-contract-round30-20261027/reproduce.py --registry-home ~/.cargo --output work/reproduce-main-round30
```

[Previous maintained checkpoint: Round29](../main-contract-round29-20261027/README.md). The remaining 309 function windows, validation paths, data, relocations and original build provenance are unresolved. [Parallel work queue](../../../research/main-pump-parallel-checkpoint-20261027/REMAINING-WORK.json).
