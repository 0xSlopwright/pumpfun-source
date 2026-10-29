# Dependency cut sets for the 64 normalized but non-closed windows

The frozen joint candidate is `c20007e860f47db1cc443344605afafe505d61bb4de6d61306fa164db3482544`. All **64 windows** already fail direct-call closure. Recognized data adds **zero further window-level exclusions** to this cohort. Their **66 candidate body alternatives** depend on **49 exact unmatched target pairs**, representing **48 original target windows**. The 585 count obtained when including source coordinates remains a separate, stricter metric.

[cutsets.json](cutsets.json) records every root, alternative body, direct edge, exact terminal callsite, shortest dependency path and cut set. Relocated data is tagged with recognized text/vtable/code-pointer roles when possible; unclassified relocation bytes, external symbols and register-indirect instructions remain explicit. These latter boundaries limit the model and are not asserted causes of the 64-window direct cut.

## How to read the ranking

A candidate body closes only if all actual callees close. A root may have more than one matching candidate body; establishing one complete alternative can suffice. `minimal_pair_cut_sets` preserves that AND/OR distinction. Original-target grouping merges aliases only for planning. Ranking hypothetically treats a missing pair as fully established and re-runs the greatest fixed point. Counts measure newly closed originals within this 64-window cohort; they do not count the recovered target itself, promise a source fix, or establish any binary identity. Counts overlap and must not be added.

| Exact target pair | Classification | Affected originals | Conditional closure of existing normalized originals |
|---|---|---:|---:|
| `0xd4f90->0x53090` | typed_source_line_only | 23 | 11 |
| `0xd44e0->0x51fb8` | typed_source_line_only | 14 | 4 |
| `0x59408->0x4b2c8` | body_or_boundary_gap | 4 | 2 |
| `0x6bf50->0x16628` | typed_source_line_only | 2 | 2 |
| `0x14920->0xdbae8` | body_or_boundary_gap | 3 | 1 |
| `0x19138->0xc2430` | body_or_boundary_gap | 3 | 1 |
| `0x1b510->0xe3550` | body_or_boundary_gap | 3 | 1 |
| `0x1b7c0->0xdd510` | body_or_boundary_gap | 3 | 1 |
| `0x1bb00->0xdd260` | body_or_boundary_gap | 3 | 1 |
| `0x1c890->0xe4a00` | body_or_boundary_gap | 3 | 1 |
| `0x1ef90->0x4a398` | body_or_boundary_gap | 3 | 1 |
| `0x1fed8->0xbf4b0` | body_or_boundary_gap | 3 | 1 |
| `0x22e88->0xd8ba0` | body_or_boundary_gap | 3 | 1 |
| `0x23e40->0xe22e8` | body_or_boundary_gap | 3 | 1 |
| `0x24fd8->0xd9b58` | body_or_boundary_gap | 3 | 1 |
| `0x26da8->0xdd850` | body_or_boundary_gap | 3 | 1 |
| `0x28dd0->0xdf810` | body_or_boundary_gap | 3 | 1 |
| `0x2ba60->0x47488` | body_or_boundary_gap | 3 | 1 |
| `0x2e720->0xd78e0` | body_or_boundary_gap | 3 | 1 |
| `0x2fb38->0x41e30` | body_or_boundary_gap | 3 | 1 |

The two largest targets are the previously identified source-line-only volume decoders. User `0xd4f90 -> 0x53090` touches 23 roots and conditionally closes **11 distinct originals**; Global `0xd44e0 -> 0x51fb8` touches 14 and conditionally closes **4**. The earlier preliminary 12 count for User double-counted two alternatives of `0x6528`; this ledger deduplicates original windows. These results justify authentic source-origin recovery, not inserted lines or fabricated declarations. Fourteen relevant terminal pairs differ only in typed source-line stores; all remain unresolved.

## Highest non-coordinate next target

`instructions::sweep_fees::execute`, original **0x59408 / 4,456 bytes**, current **0x4b2c8 / 4,600 bytes**, is the highest-ranked non-coordinate gap. Both original sweep wrappers call it at relative offset **440**: `0xe9d48` and `0xea178`; the corresponding current calls are `0xb6d10` and `0xb7140`. Closing that exact pair would conditionally close both wrapper windows (`0xe9b90`, `0xe9fc0`). It also lies on unresolved paths from `0xdbc98` and the entrypoint `0xee028`, which have additional blockers.

The shared bool-selector Context boundary is already supported by the original and must be retained. Both helper bodies have 31 internal calls. The first post-PDA memcmp is at +544 original versus +624 current, so creator PDA-result ownership and adjacent error-value lifetimes are a concrete next read-only investigation. The offset difference does not establish a fix. [sweep-body-review.json](sweep-body-review.json) retains the exact calls and diagnostic matching instruction blocks. No new source edits, builds or VM executions were performed.

## Complete root inventory

| Original window | Bytes | Body alternatives | Smallest exact-pair cut |
|---|---:|---:|---:|
| `0x30e0` | 352 | 1 | 1 |
| `0x6168` | 960 | 1 | 1 |
| `0x6528` | 1024 | 2 | 1 |
| `0x10498` | 184 | 1 | 1 |
| `0x10608` | 184 | 2 | 1 |
| `0x12310` | 144 | 1 | 1 |
| `0x14700` | 544 | 1 | 1 |
| `0x16d88` | 3032 | 1 | 4 |
| `0x1d8a0` | 2912 | 1 | 4 |
| `0x3d828` | 168 | 1 | 1 |
| `0x40890` | 376 | 1 | 1 |
| `0x4fac0` | 224 | 1 | 2 |
| `0x4fba0` | 888 | 1 | 1 |
| `0x52c58` | 1784 | 1 | 1 |
| `0x565e8` | 296 | 1 | 2 |
| `0x6c248` | 224 | 1 | 1 |
| `0x7d780` | 7616 | 1 | 1 |
| `0xaafd8` | 17368 | 1 | 2 |
| `0xb3668` | 9256 | 1 | 1 |
| `0xb5a90` | 8128 | 1 | 1 |
| `0xba720` | 11408 | 1 | 1 |
| `0xbd3b0` | 8128 | 1 | 1 |
| `0xc8588` | 10344 | 1 | 2 |
| `0xcc658` | 7648 | 1 | 1 |
| `0xce7f8` | 4056 | 1 | 1 |
| `0xcfa98` | 6136 | 1 | 1 |
| `0xd1290` | 7824 | 1 | 1 |
| `0xd3120` | 5056 | 1 | 2 |
| `0xdbc98` | 6104 | 1 | 37 |
| `0xe0bf8` | 2320 | 1 | 4 |
| `0xe2230` | 2296 | 1 | 4 |
| `0xe31a0` | 3064 | 1 | 1 |
| `0xe3d98` | 1072 | 1 | 1 |
| `0xe4738` | 1328 | 1 | 1 |
| `0xe4c68` | 1552 | 1 | 1 |
| `0xe5278` | 1336 | 1 | 1 |
| `0xe57b0` | 1336 | 1 | 1 |
| `0xe5ce8` | 1488 | 1 | 2 |
| `0xe62b8` | 1112 | 1 | 3 |
| `0xe6710` | 1416 | 1 | 1 |
| `0xe6c98` | 1056 | 1 | 2 |
| `0xe70b8` | 1424 | 1 | 3 |
| `0xe7648` | 1856 | 1 | 3 |
| `0xe7d88` | 1856 | 1 | 3 |
| `0xe84c8` | 1568 | 1 | 1 |
| `0xe8ae8` | 1064 | 1 | 2 |
| `0xe8f10` | 1064 | 1 | 2 |
| `0xe9338` | 1064 | 1 | 2 |
| `0xe9760` | 1072 | 1 | 2 |
| `0xe9b90` | 1072 | 1 | 1 |
| `0xe9fc0` | 1072 | 1 | 1 |
| `0xea3f0` | 1272 | 1 | 1 |
| `0xea8e8` | 648 | 1 | 1 |
| `0xeab70` | 1152 | 1 | 1 |
| `0xeaff0` | 2072 | 1 | 1 |
| `0xeb808` | 1624 | 1 | 1 |
| `0xebe60` | 976 | 1 | 1 |
| `0xec230` | 656 | 1 | 1 |
| `0xec4c0` | 632 | 1 | 1 |
| `0xec738` | 1152 | 1 | 1 |
| `0xecbb8` | 1624 | 1 | 1 |
| `0xed210` | 1104 | 1 | 2 |
| `0xed660` | 1640 | 1 | 1 |
| `0xee028` | 440 | 1 | 37 |

## Verification

`verify(root=None)` or `python -B verify.py --root <repo>` re-derives all body/edge pairs, recognized descriptors and bounded closure from the frozen ELF bytes, recalculates every dependency cut and ranking, and checks six negative controls. Packet paths resolve relative to this file; no private source or active build directory is opened. The input lineage records the previous independent packet seal. Whole-program indirect targets, external provider identity, all possible data layouts, runtime behavior and whole-ELF byte identity remain outside this proof.
