# Main Pump verified checkpoint — Round31

The maintained main contract matches **730 / 1,035 original function windows (70.5%)**, including **137 raw byte-equal bodies**. Those windows cover **892,056 / 1,792,208 original text bytes (49.8%)**. The closed direct-call subset contains 145 windows and excludes data references. Normalization masks specified call/address operands; it does not establish referenced data or whole-program identity. **Whole-ELF identity remains false.** These figures measure binary coverage, not the fraction of engineering work completed.

The captured-loader regression passes **44 suites / 10,468 cases** and **137 focused suites / 6,703 executions**, with **17,167 matching paired diagnostic-log cases**. These corpora overlap. Diagnostics exclude source coordinates and compute usage. Tests use captured upgradeable-loader dimensions in local VMs. The verifier requires serialized transaction bytes for every original/candidate result and rechecks signatures and instruction attribution. No current-chain acceptance is implied.

This checkpoint recovers shared ATA admission behavior and the user-to-curve quote-payment boundaries. It restores selected token-program owner checks and ordered diagnostic operands, fixing 72 observed differences across 92 new cases. A further 56 cases confirm that this shared helper does not impose an extra token-authority check. Existing user-token authority checks remain in their callers.

Two real quote-payment bodies now match normalized original code, with all immediate internal callees accounted for. Four original windows match because each body has an additional normalized-identical original variant; the distinct caller/callee ABI of those alias windows is not independently established by this increment. The helpers now live in the original lib.rs physical file, while natural line/column differences remain unresolved.

The entrypoint2.2.1 graph and its independently qualified cache are unchanged. The source-specific linker order is rederived, and the complete corpus adds 148 signed cases.

Every case's paired CPI invocation sequence is also audited, including failed transactions. One bounded queue schedules both corpora and keeps per-suite results for verified resumption; the preserved queue state records any retry history.

The changed dependency graph was rebuilt with no cached artifacts through an ordinary physical-wrapper producer, then reproduced by a separately fresh cache consumer. Both matched hashes are retained, and the producer target was absent during independent consumer checks. Only verified external dependencies are reused; each main contract is freshly compiled.

Four independent fresh main compilations reproduce both final ELF hashes: the initial combined build, repeat, maintained source and archived source. No compiled main-Pump object is cached. Original executable bytes are never compiler inputs.

The loader optimization retains full actual ProgramData byte equality on every load while caching immutable expected images and hashes. Its earlier controlled benchmark and corruption controls remain applicable; full-suite timings depend on the workload and concurrent jobs.

```sh
python repro/pump/main-contract-round31-20261027/verify.py
python repro/pump/main-contract-round31-20261027/reproduce.py --registry-home ~/.cargo --output work/reproduce-main-round31
```

[Previous maintained checkpoint: Round30](../main-contract-round30-20261027/README.md). The remaining 305 function windows, validation paths, data, relocations and original build provenance are unresolved. [Parallel work queue](../../../research/main-pump-parallel-checkpoint-20261027/REMAINING-WORK.json).
