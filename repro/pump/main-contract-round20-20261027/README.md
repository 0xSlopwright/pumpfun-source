# Main Pump verified checkpoint — Round20

The maintained main contract matches **705 / 1,035 original function windows (68.1%)**, including **120 raw byte-equal bodies**. Those windows cover **845,272 / 1,792,208 original text bytes (47.2%)**. The closed direct-call subset contains 142 windows and excludes data references. Normalization masks specified call/address operands; it does not establish referenced data or whole-program identity. **Whole-ELF identity remains false.** These figures measure binary coverage, not the fraction of engineering work completed.

The captured-loader regression passes **44 suites / 10,468 cases** and **96 focused suites / 5,278 executions**, with **15,742 matching paired diagnostic-log cases**. These corpora overlap. Diagnostics exclude source coordinates and compute usage. Transactions use normal signatures and captured upgradeable-loader dimensions in local VMs; no current-chain acceptance is implied.

This checkpoint extends Round18 with the actual Token-2022 metadata initializer, metadata-authority update and typed packed-length calculation used by CreateV2. Their original helper bodies and serialization helpers now match. A recovered V2 base-token transfer helper also matches its original 2,128-byte body, including the original clone order and single signer group.

SellV3 now uses the recovered checked market-cap helper: ordinary tokens use mint supply, and the zero-reserve error follows the original path. Twenty focused cases cover supply disagreements and the zero-reserve boundary, fixing six observed counterexamples. Earlier Round18 behavior and all existing corpora are revalidated on this exact composition. Later isolated proposals remain separate research.

A later high-buyback-rate probe still differs in BuyV2 panic text and payment order. Its separate correction is under validation and is not included here.

Four independent fresh compilations of main Rust reproduce both ELF hashes: the initial build, a repeat, maintained source and archived source. They use hash-verified external libraries whose unchanged dependency graph was rebuilt without a cache at Round18; that fully clean baseline receipt is retained here. No compiled main-Pump object is cached. Original executable bytes are never compiler inputs.

The loader optimization retains full actual ProgramData byte equality on every load while caching immutable expected images and hashes. Its earlier controlled benchmark and corruption controls remain applicable; full-suite timings depend on the workload and concurrent jobs.

```sh
python repro/pump/main-contract-round20-20261027/verify.py
python repro/pump/main-contract-round20-20261027/reproduce.py --registry-home ~/.cargo --output work/reproduce-main-round20
```

[Previous maintained checkpoint: Round18](../main-contract-round18-20261027/README.md). The remaining 330 function windows, validation paths, data, relocations and original build provenance are unresolved. [Parallel work queue](../../../research/main-pump-parallel-checkpoint-20261027/REMAINING-WORK.json).
