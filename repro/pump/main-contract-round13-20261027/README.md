# Main Pump verified checkpoint — Round13

The maintained main contract matches **653 / 1,035 original function windows (63.1%)**, including **113 raw byte-equal bodies**. These windows cover **738,800 / 1,792,208 original text bytes (41.2%)**. Normalization masks specified call/address operands; it does not prove referenced callees or data match. The stricter closed-call subset contains 137 windows and excludes data references. **Whole-ELF identity remains false.** These are measured binary coverage figures, not estimates of engineering completion.

The captured-loader regression passes **44 suites / 10,468 cases** and **69 focused suites / 4,192 executions**, with **14,656 matching paired diagnostic-log cases**. The corpora overlap. Diagnostics exclude source coordinates and compute usage. Outer transactions are signed; execution uses the original captured upgradeable-loader account dimensions. Local VM results do not establish current-chain acceptance.

This checkpoint adds recovered account layouts, historical curve decoding, metadata integration, quote and incentive handling, migration and creator checks, V2/V3 error ordering, rent funding, and fee-event behavior to the prior checkpoint. Remaining business bodies, account-validation paths, data, relocations and original build provenance are unresolved.

Clean, dependency-cached, maintained-source and archived-source builds are checked against the same stripped and unstripped ELF hashes. Main Rust is always compiled anew; the optional cache contains only verified external libraries. Original executable bytes are never compiler inputs.

```sh
python repro/pump/main-contract-round13-20261027/verify.py
python repro/pump/main-contract-round13-20261027/reproduce.py --registry-home ~/.cargo --output work/reproduce-main-round13
```

The full regression and resumed focused report retain their build/source bindings. Thirteen completed focused suites were authenticated and reused after a loader-module bookkeeping failure; remaining suites ran through the public captured loader. The first failure and its resolution remain recorded separately. This did not change the candidate or its source.

[Previous maintained checkpoint: Round9](../main-contract-round9-20261027/README.md).
