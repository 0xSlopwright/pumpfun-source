# Main Pump verified checkpoint — Round18

The maintained main contract matches **693 / 1,035 original function windows (67.0%)**, including **118 raw byte-equal bodies**. Those windows cover **832,296 / 1,792,208 original text bytes (46.4%)**. The closed direct-call subset contains 140 windows and excludes data references. Normalization masks specified call/address operands; it does not establish referenced data or whole-program identity. **Whole-ELF identity remains false.** These figures measure binary coverage, not the fraction of engineering work completed.

The captured-loader regression passes **44 suites / 10,468 cases** and **94 focused suites / 5,258 executions**, with **15,722 matching paired diagnostic-log cases**. These corpora overlap. Diagnostics exclude source coordinates and compute usage. Transactions use normal signatures and captured upgradeable-loader dimensions in local VMs; no current-chain acceptance is implied.

This checkpoint extends Round16 with the recovered Create/CreateV2 account layouts, static metadata seed and metadata program type, optional boolean reader, and the actual Anchor SPL metadata CPI. The metadata CPI and twelve related serialization/drop bodies now match the original normalized windows. The ancestor decoder follows the observed shared, out-of-line validation boundary; its body remains unmatched.

The integrated trade changes restore fee-recipient selection, shared four-value fee accounting and checked ceiling division, fee-waiver behavior and reserve-crossing rules, V3 trade flag validation and post-curve quote rounding, and the order of V2 buy/sell destination-account creation. Focused cases preserve the previously failing transaction and diagnostic evidence for these corrections. Later isolated proposals are not included merely because their own limited tests pass.

A later focused probe identified a remaining SellV3 fee-selection difference when mint and stored supplies disagree, plus its zero-reserve error path. The separately staged correction is not part of this checkpoint.

Clean, dependency-cached, maintained-source and archived-source builds reproduce both ELF hashes. Main Rust is always compiled anew. Original executable bytes are never compiler inputs. The optional cache contains verified external libraries only.

The loader optimization retains full actual ProgramData byte equality on every load while caching immutable expected images and hashes. Its earlier controlled benchmark and corruption controls remain applicable; full-suite timings depend on the workload and concurrent jobs.

```sh
python repro/pump/main-contract-round18-20261027/verify.py
python repro/pump/main-contract-round18-20261027/reproduce.py --registry-home ~/.cargo --output work/reproduce-main-round18
```

[Previous maintained checkpoint: Round16](../main-contract-round16-20261027/README.md). The remaining 342 function windows, validation paths, data, relocations and original build provenance are unresolved. [Parallel work queue](../../../research/main-pump-parallel-checkpoint-20261027/REMAINING-WORK.json).
