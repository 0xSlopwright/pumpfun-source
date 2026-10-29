# Main Pump verified checkpoint — Round47

The maintained main contract matches **823 / 1,035 original function windows (79.5%)**, including **203 raw byte-equal bodies**. Those windows cover **1,108,072 / 1,792,208 original text bytes (61.8%)**. The closed direct-call subset contains 151 windows and excludes data references. Normalization masks specified call/address operands; it does not establish referenced data or whole-program identity. **Whole-ELF identity remains false.** These metrics measure binary coverage, not engineering work completed.

The captured-loader regression passes **44 suites / 10,468 cases** and **167 focused suites / 7,677 executions**, with **18,141 matching paired diagnostic-log cases**. These corpora overlap. Paired diagnostics compare structured Anchor errors, panic payloads and comparison operands, excluding source coordinates and compute usage. The separate ordered raw-log audit covers every complete recorded main invocation and requires zero non-filename differences, retaining nested CPI, event and return logs. It reports 143 remaining source-filename mismatches explicitly. Every original/candidate result retains its serialized transaction bytes; signatures and main-instruction attribution are rechecked. The complete corpus contains 18,145 paired executions. No current-chain acceptance is implied.

This round restores the original-backed V2 and legacy buy, exact-input buy, and sell token-account reload and reserve-sync sequence. It retains the earlier source, fee-recipient precedence, cashback guard, ordinary-message and CPI-order corrections. Raw-log coverage remains bounded by the recorded inputs; source filenames are not silently normalized away.

This round adds 34 locally constructed synthetic normal-account inputs using captured templates (sell_v3_positive_sync (6), v3_buy_positive_sync (8), sell_v3_nonwhite_sync_controls (2), v2_positive_sync (12), legacy_positive_sync (6)) and retains all 18,111 paired cases from Round46, including the earlier signed fee-recipient, cashback and nonzero-volume SellV3 witnesses. The new fixtures preserve normal balances and token-account owners and authorities. Local VM execution demonstrates positive reserve-sync updates; historical reachability remains unproved. Every added input is replayed against the ordered final candidate in the full corpus. The earlier reversed stored-range scheduler case remains parser-admitted; its historical reachability is still unproved. The strengthened 308-case extension suite remains unchanged.

The selected compiler profile restores the five original TypeId bodies. Selected source changes are listed below and retain the earlier TradeEvent and scheduler corrections. Generated external-program interfaces remain compiler inputs for the main contract. All previously validated R38 corrections are retained. Source, runtime, layout and provenance claims retain their distinct evidence boundaries. The selected primary files are bound by the frozen integration plan:

- `src/buy.rs`
- `src/buy_v2.rs`
- `src/lib.rs`
- `src/sell_v2.rs`

Actual window changes against Round46 are +0 normalized and +0 raw. The entire previously matched normalized-window set is retained. This description is generated from final evidence and does not infer source correctness from a count gain.

The source-specific pure text recipe is preserved as `text-order.ld`. The final compiler recipe `ordered.ld` includes the bounded two-object `.data.rel.ro` ordering. The fixed Borsh Location and debug-argument table have 0/2 original-relative starts before and 2/2 after the selected data order. These are only the two checked objects, not a whole-data-layout metric. The proof independently finds their original owner bodies and LDDW references, verifies Location/table fields and methods, and accounts for every text/data byte, pointer, relocation, symbol and remaining file byte. There is no post-link editing, padding, or injected original code/data. The concrete original table type, complete allocation extents, remaining data layout remain unresolved. The five tracked TypeId constants now match; the complete original SDK and host recipe remain unproved.

The opt-in `linux-v1.44-sbpf` profile uses the pinned native macOS v1.44 compiler/host libraries with exactly25 SBPF target libraries from the official Linux x86_64 v1.44 archive. Per-build inventories prove that only that target-library directory changed. This is a reproducible hybrid recipe, not proof of the original SDK. Its separate external-only cache has an ordinary clean producer, fresh cached parity and producer-unavailable controls. Every main crate is compiled again; no compiled main-Pump object enters that cache.

Four final compilations reproduce both ELF hashes: initial, repeat, maintained-source and archived-source builds. Two separate identity compilations support the initial and archived data-order certificates. Archive reproduction actually builds a fresh identity from archived primary, derives a new certificate with pure `text-order.ld`, then compiles a fresh final and requires both expected ELF hashes. The original admitted certificate is preserved unchanged as provenance. The read-only verifier uses explicit bundled artifact paths; its local transformation replay is not represented as fresh admission.

```sh
python repro/pump/main-contract-round47-20261027/verify.py
python repro/pump/main-contract-round47-20261027/reproduce.py \
  --registry-home /path/to/qualified/cargo-home \
  --dependency-cache /path/to/qualified/external-cache \
  --sdk /path/to/native-macos-v1.44 \
  --target-library-directory /path/to/linux-v1.44/rust/lib/rustlib/sbpf-solana-solana/lib \
  --output work/reproduce-main-round47
```

The reproduction creates separate sibling identity and certificate paths; `--output` remains the final build directory. The native SDK and official target libraries are external, hash-bound inputs, not bundled or downloaded by the archive. A changed cache/profile context needs its own ordinary producer and parity proof. The original executable is used for evidence/comparison only, never as compiler or linker code/data input.

[Previous maintained checkpoint: Round46](../main-contract-round46-20261027/README.md). The remaining 212 function windows, validation paths, data, relocations and original build provenance remain open. [Parallel work queue](../../../research/main-pump-parallel-checkpoint-20261027/REMAINING-WORK.json).
