## Summary

Counts 16 static `.rodata` strings (592 bytes) that union exactly to `[709739, 710331)`, 7 counted 16-byte `.data.rel.ro` descriptors (112 bytes), and proves 2 mov64 text sites plus 8 path/seed sites on the qualified437 images. Each descriptor is `u32 low = 0`, `u32 high = pointer`, `u64 length` with one type-8 relocation at the record start (symbol index 0). Each mov site is a relocated `.rodata` `lddw` followed at `pc + 16` by an immediate-length `mov`. Each path/seed site stores the relocated pointer register to the stack, then stores its exact length in the adjacent eight-byte field before any branch or overwrite. All strings, descriptors and sites are checked on both images; the candidate pointers differ but the referenced bytes and lengths match. Descriptor pointer fields contribute 56 mapped bytes; equal length fields contribute 56 raw bytes.

These intervals were disjoint from the four merged deltas, including #770. The relation stays **437 normalized / 141 raw / 431 closed windows / 581 pairs** with **0 rejected pairs**. No binary middle table, digit table, NUL or adjacency bound is claimed, and no relocation-table byte is credited. Path/seed and mov immediates are proof sites, not payload.

Package: `research/mayhem-current437-option-seeds-paths-20261029/`.

## Evidence

| Input | SHA-256 |
| --- | --- |
| `evidence/original/mayhem/deployed.so` | `a87fa9f866272514e6acb852b668c4a08aeb173d56c883039991d114d1199bdb` |
| `research/mayhem-current437-composition-20261028/builds/first/candidate.so.gz` | `b0f6fdb4ac9d241f75401429b8c84c3769155035a2446ece8d9975714683baf9` |
| `research/mayhem-current437-rust-panic-messages-20261029/coverage-delta.json` | `839174494ffefa29fab70b027aea1b2672777ea5efd69ad194cf9c7c8eaef5e4` |
| `research/mayhem-current437-mayhemerror-debug-names-20261029/coverage-delta.json` | `e36281cc8703789ef01fbdd127181d10075c1c2f786fedec3621dad3f4b3d77a` |
| `research/mayhem-current437-programerror-debug-copy-20261029/coverage-delta.json` | `2922e4eb065a5db22ad5299ee34a192567e0a6205c4859c23905dfb2bae38cb2` |
| `research/mayhem-current437-bounded-error-strings-20261029/coverage-delta.json` | `e7cae6dd26e406a43d34d428a5ea8ee87c8e2ec3d4fc852d183d06b98eaa722e` |

Payload coverage moves from **20,747** to **21,451 / 26,180** (81.94%), leaving **4,729 unproved**. `.rodata` moves from **14,035** to **14,627 / 18,396** (+592). `.data.rel.ro` moves from **6,712** to **6,824 / 7,784** (+112). The added `.rodata` interval is `[709739, 710331)`. The 7 descriptors union to four spans totaling 112 bytes: `[725792, 725824) + [725904, 725936) + [726056, 726072) + [727416, 727448)`.

## Still open

`4,729` payload bytes remain. The leftover `[710438, 710440)` NUL bytes inside the originally named gap are not claimed, and the adjacent `[710331, 710438)` is already owned by the MayhemError Debug-names packet. The remaining larger gaps elsewhere are unchanged except for this bite. Relocation and section layout are unchanged.

## Test plan

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-option-seeds-paths-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-option-seeds-paths-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/test_tooling.py
```

Tests flip every selected string byte, every descriptor length and pointer field, every mov length immediate, and every path/seed `stxdw` length immediate; each must be rejected. A following byte in an unselected candidate gap is not absorbed. Inventory, symlink, FIFO, and resealed report and coverage edits are rejected.

provider=OpenCode model=opencode/deepseek-v4.1-flash-free client=opencode CLI 1.19.5

Made via @slopdotcash

The verifier also rejects broken pointer/store registers and stack-field offsets, binds the r1/r2 text arguments, and checks descriptor raw/mapped classification. Fourteen tests pass, and an independent ELF decoder rederived all payloads, descriptors, sites and the byte union. No code-window gain or runtime claim.
