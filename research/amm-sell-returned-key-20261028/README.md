# Recover the sell cashback recipient-key dataflow

The original sell cashback helper derives the recipient ATA address from the `Account<UserVolumeAccumulator>` returned by its checked constructor. The [checked-decoder control (#630)](https://github.com/lalalune/pumpfun-source/pull/630) instead derived that key from the saved input `AccountInfo`. This packet restores the original source expression, **`&user_volume_accumulator.key()` → `&accumulator.key()`**, on one line. The constructor's returned account refers to the same input, so no changed rejection or runtime behavior is claimed.

Coverage remains **784/785 normalized and 267 raw**, with **zero normalized or raw membership gains/losses**. Sell `0x4c750` remains **officially UNEQUAL**, and whole-ELF identity remains false. Maintained source and global coverage selection are untouched. This is a source/value-provenance recovery, not a new matched window.

## Original-backed value evidence

[key-provenance.json](key-provenance.json) binds the actual original/control/candidate instructions and checked constructor identities. In the original constructor, the incoming `AccountInfo` pointer is saved and then stored at return offset zero on success. The caller loads that returned pointer and obtains its key through offset zero. The previous source reloaded a saved input key pointer instead. The corrected candidate uses the original returned-account route. The audit checks the caller's return-buffer setup and confirms that the returned-pointer register remains intact before the key load; intervening SBF calls preserve that register.

The actual checked constructor matches through depth two in all images. All **80 actual sell call-site identities** continue to correspond exactly to original normalized bodies, relocation patterns and direct edges through depth two. A rooted, edge-labelled CFG comparison pairs **77 reachable canonical blocks** after inverse branch edge swaps and removal of unconditional-only forwarding/unique straight-line joins.

Under that diagnostic correspondence, all 77 blocks now have identical non-register opcode/displacement/immediate/relocation/callee sequences. The control retained two such sequence differences: stack-save scheduling and the key load route. The correction removes both. Every original normalized instruction value is retained in the full records.

This is not a relaxed acceptance rule. Strict normalized instruction bytes still differ in **120 non-branch slots**, plus branch/register/layout differences. A read-only physical-register constraint check rejects a single global renaming (149 conflicting constraints). Only 71/77 blocks admit a fixed local renaming; six require finer program-point/live-range reasoning. No register-value equivalence is proved or used to award a window. No register constraints, flags, attributes, compiler/layout sweep or output patch is introduced.

## Build and finite runtime qualification

Both complete source workspaces, the one-line [source.patch](source.patch), build receipts and all 785-window rows are archived. The file stays 567 lines. Inherited synthetic source positions and existing comment/blank layout remain; no new positioning device is added. Historical source provenance is not established.

The new build uses official native Linux v1.44 `sbpf-solana-solana`, locked offline dependencies and the retained physical registry-source wrapper. Both local crates are explicitly cleaned and freshly compiled with the manifest/release/target/offline options. Workspace source and official target libraries are checked unchanged. Dependency artifacts are reused; no SDK, registry or reference executable is altered. The inherited unrelated incentive stack-frame diagnostic remains in the compiler log. The packet records one new clean build; its portable archive-rebuild controller is provided without claiming a second new compiler run.

| Image | SHA-256 |
| --- | --- |
| Control stripped | `16d1b6f321e958025f5fef1f18d5d41167efe95b42f3dc091ee6d112027a588f` |
| Corrected stripped | `bda0a82482d6c6d09064109921e760e4a90a5a78f1e90c9ab4cf2a837527a10e` |
| Corrected symbols | `511808573f8b4a831789c90756ba3a3d45eff6ed97ca9dc731bf82a763499e71` |

The unchanged maintained legacy-sell suite runs **575 original/candidate pairs** through the genuine dispatcher and captured Token/ATA/Fees CPIs. The packet also retains the same 575 original/control pairs from #630, with identical recorded harness sources. All **2,300 outer transactions and 2,300 signatures** are independently decoded and verified again by `verify.py --signatures`. Both runs have zero state/error/event/inner-CPI/return-data/transaction mismatches and zero ordered log differences after excluding only runtime compute-meter lines. Cases include new/existing cashback, owners, incorrect discriminator, truncation, malformed bool, overflow, readonly/substituted accounts and transfer fees. Recorded input scripts and reference images remain unchanged.

These finite replays do not prove exhaustive behavior or whole-program identity. All accounts, balances and signers are isolated synthetic fixture inputs; no live transaction is sent. No fresh full 25-suite run is claimed.

## Recheck

```sh
python3 research/amm-sell-returned-key-20261028/verify.py --signatures
python3 research/amm-sell-returned-key-20261028/reproduce.py \
  --sdk /path/to/v1.44 --cargo-home /path/to/offline-cargo-home \
  --target-dir /path/to/disposable-target --out /path/to/new-output
```

`--source control` selects the archived #630 source. `verify.py` recomputes the complete official membership sets, local return/key chain, both full CFG/value records, physical-register constraints and signed replay bindings. `MANIFEST.json` seals every packet file. Score files remain original producer receipts; membership changes are recomputed directly between the two images.
