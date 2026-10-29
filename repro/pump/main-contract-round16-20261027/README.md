# Main Pump verified checkpoint — Round16

The maintained main contract matches **670 / 1,035 original function windows (64.7%)**, including **114 raw byte-equal bodies**. Those windows cover **777,368 / 1,792,208 original text bytes (43.4%)**. The closed direct-call subset contains 138 windows and excludes data references. Normalization masks specified call/address operands; it does not establish referenced data or whole-program identity. **Whole-ELF identity remains false.** These figures measure binary coverage, not the fraction of engineering work completed.

The captured-loader regression passes **44 suites / 10,468 cases** and **78 focused suites / 4,584 executions**, with **15,048 matching paired diagnostic-log cases**. These corpora overlap. Diagnostics exclude source coordinates and compute usage. Transactions use normal signatures and captured upgradeable-loader dimensions in local VMs; no current-chain acceptance is implied.

This checkpoint extends Round13 with original rent preparation/order, creator-fee guards, exact minimum/quote-control/Sweep account parsers, an exact SharingConfig decoder, shared fee CPI/return handling, market-cap selection and checked quote arithmetic. Later creation, fee-waiver and additional accounting variants remain separate research until integrated and verified.

Clean, dependency-cached, maintained-source and archived-source builds reproduce both ELF hashes. Main Rust is always compiled anew. Original executable bytes are never compiler inputs. The optional cache contains verified external libraries only.

The loader optimization retains full actual ProgramData byte equality on every load while caching immutable expected images and hashes. A controlled benchmark measured3.51x lower loader time;1,036 complete per-case results and2,301 loader records matched the previous loader, and10 corruption controls were rejected. Full-suite timings are workload-dependent.

```sh
python repro/pump/main-contract-round16-20261027/verify.py
python repro/pump/main-contract-round16-20261027/reproduce.py --registry-home ~/.cargo --output work/reproduce-main-round16
```

[Previous maintained checkpoint: Round13](../main-contract-round13-20261027/README.md). Remaining business bodies, validation paths, data, relocations and original build provenance are unresolved.
