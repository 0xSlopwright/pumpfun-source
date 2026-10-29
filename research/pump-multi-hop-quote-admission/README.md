# Multi-hop quote-fee and vault admission recovery

Partial source recovery of `multi_hop_curve::swap_hop`, original `0x5b3b0`, on the qualified maintained Pump frontier at `2fc654a2`. The single-file [Rust patch](source.patch) and complete 65-input archive preserve all 931 physical source lines. This research candidate does not replace the maintained checkpoint.

The original snapshots the quote transfer fee after the mayhem guard, before token-program selection and vault admission. The parent reads it later and repeatedly. The proposal restores that snapshot and four uses of the existing `post_fee_amount` function. It also restores the original admission boundaries: base ATA address first; full shared `buy_v2` admission for non-native quote vaults; address-only admission for native quote vaults. The small admission wrapper is inlined to retain the observed direct-call boundaries.

Two combined-input cases now return the original **6063 UnsupportedQuoteMint at `util/transfer_fee.rs:31`**, rather than the parent's earlier vault errors 2006 or 6010. Nearby valid-extension controls recover the original shared admission diagnostics at `buy_v2.rs:55/81`. A native-quote negative control verifies that its address gate remains required.

Thirteen fresh original/parent/proposal triples execute through the genuine captured AMM CPI and Pump's captured upgradeable loader. All 39 normally signed executions are retained. Proposal and original agree on errors, state, CPI, events, returns, transaction inputs and complete ordered logs after excluding only runtime compute-meter lines. Three successful Token-2022 routes cover zero fees and capped fees in both directions; the capped routes each withhold exactly 100 units. The no-extension case fails generated mint parsing before the helper and is an earlier-admission control, not snapshot coverage.

| Binary comparison | Parent | Proposal |
|---|---:|---:|
| Helper bytes; original is 18,584 | 24,872 | 19,536 |
| Injective normalized windows | 1,019 / 1,035 | 1,019 / 1,035 |
| Injective raw windows | 188 | 188 |

There are no normalized/raw capacity losses. Ten selected actual callee occurrences match original normalized bodies: fee reader, program selection, ATA address checks, shared admission and post-fee calculations. The census and selected call ordering are independently recomputed with the unchanged normalizer. **The whole helper remains unmatched; full call/data closure and whole-ELF identity remain false.** No new matched window is claimed.

The exact final image passes the unchanged 44-suite captured-loader corpus (10,468 pairs, 10,464 broad diagnostic-log cases) and the separate 126-case Token-2022 extension corpus. Broad diagnostics exclude Source coordinates; the focused triples preserve them. The 18,595 serialized transaction fields / 28,127 signature fields in the broad reports are independently reverified; these are neither unique-transaction nor total execution counts. All runtime state is local and synthetic, with captured dependencies; there is no live transaction submission.

The retained native-omission control is rejected by the focused comparison. It demonstrates why passing the broad corpus alone is insufficient. Source, actual compiler records, both ELF outputs, raw runtime observations and loader receipts remain sealed. Three fresh proposal compilations, including the archived-source replay below, reproduce both complete ELF outputs. The native Darwin v1.44 compiler uses the admitted Linux v1.44 SBPF libraries; this is not a Linux-host or historical-original toolchain claim. No executable patch, generated linker order or matcher change is used.

```sh
python -I -B research/pump-multi-hop-quote-admission/verify.py
python -I -B research/pump-multi-hop-quote-admission/test_controls.py
```

Use the repository's pinned `requirements.txt`. Shared compiler/profile checks and normalization tools are reused byte-for-byte from merged PR588 and authenticated by `parent-tools-sha256.json`.

```sh
python research/pump-multi-hop-quote-admission/rebuild.py \
  --sdk /path/to/native-v1.44/platform-tools \
  --target-libraries /path/to/linux-v1.44/rust/lib/rustlib/sbpf-solana-solana/lib \
  --registry-home /path/to/cargo-home --output work/pump-route-rebuild
```

The command authenticates the archived source, invokes the unchanged locked/offline repository builder and requires both complete output hashes to reproduce. `tools/focused.py --parent PATH --proposal PATH --output PATH` reruns the frozen focused fixture. Historical paths in raw receipts describe the actual runs and are not reproduction prerequisites.
