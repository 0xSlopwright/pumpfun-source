# Main Pump verified checkpoint — Round39

The maintained main contract matches **806 / 1,035 original function windows (77.9%)**, including **197 raw byte-equal bodies**. Those windows cover **1,070,312 / 1,792,208 original text bytes (59.7%)**. The closed direct-call subset contains 146 windows and excludes data references. Normalization masks specified call/address operands; it does not establish referenced data or whole-program identity. **Whole-ELF identity remains false.** These metrics measure binary coverage, not engineering work completed.

The captured-loader regression passes **44 suites / 10,468 cases** and **160 focused suites / 7,641 executions**, with **18,105 matching paired diagnostic-log cases**. These corpora overlap. Diagnostics exclude source coordinates and compute usage. Every original/candidate result retains its serialized transaction bytes; signatures and main-instruction attribution are rechecked. The complete corpus contains 18,109 paired executions. No current-chain acceptance is implied.

This round adds 1 distinct signed nonzero-volume SellV3 input. The earlier reversed stored-range scheduler case remains parser-admitted; its historical reachability is still unproved. The strengthened 308-case extension suite remains unchanged.

Selected source changes integrate independently verified main-contract source recovery and the original shared TradeEvent construction. The SellV3 event now preserves nonzero user-volume fields. Generated external-program interfaces remain compiler inputs for the main contract. All previously validated R38 corrections are retained. Source, runtime, layout and provenance claims retain their distinct evidence boundaries. The selected primary files are bound by the frozen integration plan:

- `Cargo.toml`
- `idls/pump_amm.json`
- `src/buy.rs`
- `src/buy_v2.rs`
- `src/cashback.rs`
- `src/create.rs`
- `src/create_v2.rs`
- `src/creator/admin_cto.rs`
- `src/creator/collect_creator_fee.rs`
- `src/curve_quote_payments.rs`
- `src/distribution.rs`
- `src/fee_cpi.rs`
- `src/global_init.rs`
- `src/legacy_native_payments.rs`
- `src/lib.rs`
- `src/mayhem_virtual_params.rs`
- `src/migrate.rs`
- `src/migrate_v2.rs`
- `src/migration_native_payments.rs`
- `src/multi_hop_curve_swap.rs`
- `src/sell.rs`
- `src/sell_v2.rs`
- `src/set_params.rs`
- `src/token_incentives/claim_token_incentives.rs`
- `src/token_incentives/init_user_volume_accumulator.rs`
- `src/token_incentives/mod.rs`
- `src/trade_types.rs`
- `src/trade_v3.rs`
- `src/util/account_name.rs`
- `src/util/constant_product.rs`
- `src/util/fee.rs`
- `src/util/transfer_fee.rs`
- `src/v2_native_payments.rs`
- `src/v2_token_transfers.rs`

Actual window changes against Round38 are +62 normalized and +22 raw. The entire previously matched normalized-window set is retained. This description is generated from final evidence and does not infer source correctness from a count gain.

The source-specific pure text recipe is preserved as `text-order.ld`. The final compiler recipe `ordered.ld` includes the bounded two-object `.data.rel.ro` ordering. The fixed Borsh Location and debug-argument table have 0/2 original-relative starts before and 2/2 after the selected data order. These are only the two checked objects, not a whole-data-layout metric. The proof independently finds their original owner bodies and LDDW references, verifies Location/table fields and methods, and accounts for every text/data byte, pointer, relocation, symbol and remaining file byte. There is no post-link editing, padding, or injected original code/data. The concrete original table type, complete allocation extents, remaining data layout and the five tracked TypeId constants remain unresolved.

The opt-in `linux-v1.44-sbf` profile uses the pinned native macOS v1.44 compiler/host libraries with exactly25 SBF target libraries from the official Linux x86_64 v1.44 archive. Per-build inventories prove that only that target-library directory changed. This is a reproducible hybrid recipe, not proof of the original SDK. Its separate external-only cache has an ordinary clean producer, fresh cached parity and producer-unavailable controls. Every main crate is compiled again; no compiled main-Pump object enters that cache.

Four final compilations reproduce both ELF hashes: initial, repeat, maintained-source and archived-source builds. Two separate identity compilations support the initial and archived data-order certificates. Archive reproduction actually builds a fresh identity from archived primary, derives a new certificate with pure `text-order.ld`, then compiles a fresh final and requires both expected ELF hashes. The original admitted certificate is preserved unchanged as provenance. The read-only verifier uses explicit bundled artifact paths; its local transformation replay is not represented as fresh admission.

```sh
python repro/pump/main-contract-round39-20261027/verify.py
python repro/pump/main-contract-round39-20261027/reproduce.py \
  --registry-home /path/to/qualified/cargo-home \
  --dependency-cache /path/to/qualified/external-cache \
  --sdk /path/to/native-macos-v1.44 \
  --target-library-directory /path/to/linux-v1.44/rust/lib/rustlib/sbf-solana-solana/lib \
  --output work/reproduce-main-round39
```

The reproduction creates separate sibling identity and certificate paths; `--output` remains the final build directory. The native SDK and official target libraries are external, hash-bound inputs, not bundled or downloaded by the archive. A changed cache/profile context needs its own ordinary producer and parity proof. The original executable is used for evidence/comparison only, never as compiler or linker code/data input.

[Previous maintained checkpoint: Round38](../main-contract-round38-20261027/README.md). The remaining 229 function windows, validation paths, data, relocations and original build provenance remain open. [Parallel work queue](../../../research/main-pump-parallel-checkpoint-20261027/REMAINING-WORK.json).
