# V3 buy-cost overflow recovery

Partial recovery of `trade::v3_buy_costs`, original address `0x80df8`, on the existing [L38 source-only candidate](../claude-pump-integration-20261027/r37-layout-38/README.md). `source.patch` changes only `src/trade_v3.rs`; `sources/primary.tar.gz` contains all 65 actual Rust build inputs. This research candidate does not replace the maintained checkpoint.

The final overlap check includes upstream `4a6c726a` and its newer L41/semantic-union packets: their cost function is still identical to L38. This packet qualifies the isolated L38-based correction; it does not claim those newer frontiers' inherited gains or their integration with this change.

The original checks combined buybacks at Source line 371, then checks the combined per-leg costs and subtracts buybacks at line 375. L38 delegates these operations to shared helpers, producing line 390 instead. The recovered source restores the checked operations and their error construction sites. Six fresh signed transaction triples demonstrate the original, parent and proposal behavior, including both error sites, an earlier overflow, and successful crossing/non-crossing controls. Full focused logs agree after excluding only runtime compute-usage lines; the raw compute reports remain retained.

The mode parameter uses the original's observed byte-width test. An explicitly outlined 520-byte error callback preserves the already-matched original window at `0x81640`; its Rust name and public visibility are reconstruction choices. All 17 emitted direct-callee occurrences match original normalized bodies with the same multiplicities, and the seven arithmetic calls retain their order. The complete callsite order differs.

| Evidence | Parent | Proposal |
|---|---:|---:|
| Cost helper size; original is 2,120 bytes | 1,160 | 2,056 |
| Source sites for the two focused overflows | 390 / 390 | 371 / 375 |
| Injective normalized full-function matches | 1,018 / 1,035 | 1,018 / 1,035 |
| Injective raw full-function matches | 168 | 168 |

**The cost helper remains unmatched, and whole-ELF identity remains false.** The normalizer is unchanged: it masks internal call displacements and section-address loads. Callee-body equality is normalized, not raw or transitive call-graph identity. The binary comparison independently checks full function capacities and records the remaining differences.

Validation against the unchanged captured original passed all 44 maintained suites (10,468 pairs), the separate Token-2022 extension suite (126 pairs), and six focused triples. These use local synthetic state and captured dependencies. The broad corpus's diagnostic audit excludes Source coordinates; the focused comparison preserves them. Loader receipts bind the exact ELF bytes to captured upgradeable-program accounts. Four fresh proposal compilations, including the repository CLI and the command below, reproduce both complete output files exactly. The original executable is used only for post-build comparison and local execution; no generated text/data ordering or executable patch is applied.

Verify retained evidence, including signature checks, without an SDK or VM execution:

```sh
python -I -B research/pump-v3-buy-cost-overflow/verify.py
python -I -B research/pump-v3-buy-cost-overflow/test_controls.py
```

Python dependencies are pinned in the repository's `requirements.txt`. To rebuild, supply the admitted native macOS v1.44 SDK, Linux v1.44 SBPF target libraries, and the 254 locked Cargo archives. The existing `linux-v1.44-sbpf` profile checks their hashes and prepares a private SDK. `--workspace-layout` only stages the Cargo workspace.

```sh
python research/pump-v3-buy-cost-overflow/rebuild.py \
  --sdk /path/to/native-v1.44/platform-tools \
  --target-libraries /path/to/linux-v1.44/rust/lib/rustlib/sbpf-solana-solana/lib \
  --registry-home /path/to/cargo-home \
  --output work/pump-v3-buy-cost-rebuild
```

The rebuild script extracts and verifies the archived source, invokes the unchanged repository builder with offline dependency resolution, and requires both complete ELF hashes to reproduce. Fresh runtime replay is available through `tools/focused_costs.py --parent PATH --proposal PATH --output PATH`; the full runner commands and physical paths remain in the retained receipts. Historical local paths describe those runs and are not reproduction prerequisites.
