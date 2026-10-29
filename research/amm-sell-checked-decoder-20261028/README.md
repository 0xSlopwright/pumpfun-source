# Restore the actual checked sell cashback decoder

The AMM sell cashback path must use `Account::<UserVolumeAccumulator>::try_from`, as the original program does. The [784-window control (#617)](https://github.com/lalalune/pumpfun-source/pull/617) instead used `try_from_unchecked`. This packet changes exactly that constructor on one source line. It restores the original actual call chain while preserving all **784/785 normalized and 267 raw memberships**, with zero normalized or raw gains/losses. Sell `0x4c750` remains **officially UNEQUAL**; whole-ELF identity is false. Maintained program source and global coverage selection are untouched.

## Why the window census did not expose the wrong edge

At sell offset `0x17a0`, the original calls a 1,024-byte `Account` constructor at `0x6528`. Its actual call at constructor offset `0x290` reaches the **728-byte checked** `UserVolumeAccumulator::try_deserialize`, which subsequently calls the 1,504-byte unchecked field decoder. The control instead calls a 1,024-byte `try_from_unchecked` constructor, whose actual `+0x290` call goes straight to the unchecked decoder.

All three constructor wrappers have identical complete normalized bytes and relocation patterns. A body-only lookup can therefore select the wrong generic instantiation. [edge-correction.json](edge-correction.json) resolves the actual targets and recursively binds complete normalized callee bodies, relocation patterns and direct outgoing edges through depth two. The corrected constructor corresponds exactly to the original at that depth. No callee target is unresolved.

A read-only rooted CFG comparison, adapted from the sibling Pump [attribution method](../pump-legacy-sell-boundary-20261028/README.md), pairs all 77 reachable canonical blocks after an inverse branch exchanges its edge roles. Every paired block has the same number of recorded non-branch instruction slots (including `lddw` continuations). Actual direct call identities improve **79/80 → 80/80** through depth two. The actual incoming 9,184-byte sell dispatcher body and its helper call at offset `0x13d0` match completely under official normalization and relocation patterns.

This graph diagnostic is not the acceptance normalizer. It retains every original normalized instruction value, register byte, relocation and actual callee identity. Its strict value comparison still fails. After the call correction, 75 of 77 paired blocks have the same operation sequence except register bytes; the other two retain a stack-save scheduling difference and a load through the returned account versus a cached key-pointer load. Register equivalence and exhaustive value semantics are not proved. The original 9,024-byte sell body remains unmatched under the unchanged official rule.

## Source, builds and finite replay evidence

[source.patch](source.patch) contains only `try_from_unchecked` → `try_from` in `instructions/swap/sell.rs`. Both complete source workspaces are archived. The file remains 567 lines; inherited synthetic source positions and comment/blank layout are retained, with no new positioning device. This does not establish historical source provenance.

The recorded official native Linux v1.44 build explicitly cleans and freshly compiles both local crates (`pump-amm-recovered`, `native-transfer-fee`) with the release/target/manifest/offline options. Dependencies are locked and offline; official SDK/registry/reference files are not changed. A separately exercised portable controller reproduces both candidate ELFs byte-for-byte. No binary edits, target-derived layout or changed comparison masks are used. The inherited unrelated incentive stack-frame diagnostic remains in the build log.

| Image | SHA-256 |
| --- | --- |
| Control stripped | `a775c319eefbb30c3134b46f452dc9c0286bb45c0eb65e96d0f73bb0f524ac68` |
| Corrected stripped | `16d1b6f321e958025f5fef1f18d5d41167efe95b42f3dc091ee6d112027a588f` |
| Corrected symbols | `16ad4ae76fdb5c95694236b5752922524720b54ae0a97f4dc66e5c3ae5837110` |

The unchanged maintained legacy-sell suite runs **575 original/control pairs and 575 original/corrected pairs** through the genuine dispatcher and captured Token/ATA/Fees CPIs. Each run contains 1,150 normally signed outer transactions; all **2,300 transactions and 2,300 signatures** are independently decoded and reverified by `verify.py --signatures`. The cases include new/existing cashback, accumulator owners, incorrect discriminator, lengths 0–137, malformed bool, overflow, readonly/substituted accounts and transfer fees. Both runs have zero state/error/event/inner-CPI/return-data/transaction mismatches and zero ordered log differences after excluding only runtime compute-meter lines. Recorded scripts and loaded reference images remain unchanged.

The control also passes these finite cases: the existing admission checks cover malformed inputs before the constructor in many cases. This packet claims restoration of the original actual decoder edge, not a newly observed rejection difference, exhaustive equivalence or a new matched window. All replay uses isolated synthetic accounts and test-owned signatures; no live transaction is sent. The complete 25-suite corpus is not rerun or claimed.

## Reproduce

```sh
python3 research/amm-sell-checked-decoder-20261028/verify.py --signatures
python3 research/amm-sell-checked-decoder-20261028/reproduce.py \
  --sdk /path/to/v1.44 --cargo-home /path/to/offline-cargo-home \
  --target-dir /path/to/disposable-target --out /path/to/new-output
```

Use `--source control` for the archived 784-window parent. The verifier recomputes the complete official census, actual constructor/incoming edges, both complete CFG attribution records, value/callee correspondence and signed runtime bindings. All packet files are sealed by `MANIFEST.json`. Build score files are original producer receipts; the control's historical gain field refers to its earlier union12 baseline, while this packet compares the two complete membership sets directly.
