# Main Pump verified checkpoint — Round24

The maintained main contract matches **720 / 1,035 original function windows (69.6%)**, including **123 raw byte-equal bodies**. Those windows cover **871,992 / 1,792,208 original text bytes (48.7%)**. The closed direct-call subset contains 142 windows and excludes data references. Normalization masks specified call/address operands; it does not establish referenced data or whole-program identity. **Whole-ELF identity remains false.** These figures measure binary coverage, not the fraction of engineering work completed.

The captured-loader regression passes **44 suites / 10,468 cases** and **119 focused suites / 6,209 executions**, with **16,673 matching paired diagnostic-log cases**. These corpora overlap. Diagnostics exclude source coordinates and compute usage. Tests use captured upgradeable-loader dimensions in local VMs. The verifier rechecks all retained serialized transaction signatures; some historical rows retain only logs and state, so their serialized-transaction evidence is incomplete. No current-chain acceptance is implied.

This checkpoint extends Round23 with the original shared quote-token CPI helper, three native payout specializations and the main-owned creation CPI interface. Actual V3, SellV2, Sweep and creation callers retain the original account order and transfer semantics. The package records exact-window deltas and the independently validated source deliveries.

Optional sharing-account behavior is covered by an additional 246-case matrix; its helper-body recovery remains unfinished. Matrix rows are executions, not a count of unique behavior: the evidence reports duplicate fixtures and overlap separately. The full source, data, relocation and build-layout reconstruction remains incomplete. New immutable creator-vault fixtures revealed 13 legacy and 12 V2 balance or failure-order discrepancies. This checkpoint restores the original full rent-minimum funding before creator payment and verifies those corrections with 63 legacy and 108 V2 cases. The initial candidate run was superseded before publication; its state and reason are retained. Subsequent probes found additional creator-Sweep and AdminCto rent differences; their repairs are separate pending work and are not claimed by this checkpoint.

Every case's paired CPI invocation sequence is also audited, including failed transactions. One bounded queue schedules both corpora and keeps per-suite results for verified resumption; the preserved queue state records any retry history.

The direct import of the already-locked `spl-type-length-value` 0.7.0 trait changes only the main package's direct dependency declaration and imports. The 254 external lock records are unchanged. Its dependency graph was rebuilt without a cache, then both producer ELFs were reproduced through a new verified external-only cache. The producer target was absent during the final isolated main build. The package preserves those receipts and binaries; old-cache binary identity is not claimed.

Four independent fresh main compilations reproduce both final ELF hashes: the initial combined build, repeat, maintained source and archived source. No compiled main-Pump object is cached. Original executable bytes are never compiler inputs.

The loader optimization retains full actual ProgramData byte equality on every load while caching immutable expected images and hashes. Its earlier controlled benchmark and corruption controls remain applicable; full-suite timings depend on the workload and concurrent jobs.

```sh
python repro/pump/main-contract-round24-20261027/verify.py
python repro/pump/main-contract-round24-20261027/reproduce.py --registry-home ~/.cargo --output work/reproduce-main-round24
```

[Previous maintained checkpoint: Round23](../main-contract-round23-20261027/README.md). The remaining 315 function windows, validation paths, data, relocations and original build provenance are unresolved. [Parallel work queue](../../../research/main-pump-parallel-checkpoint-20261027/REMAINING-WORK.json).
