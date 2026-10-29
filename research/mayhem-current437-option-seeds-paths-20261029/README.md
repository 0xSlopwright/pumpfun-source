# Qualified437 Option/seed/path strings, descriptors and immediate sites

This packet counts **16 static `.rodata` strings totaling 592 bytes** that union exactly to `[709739, 710331)`, plus **7 counted 16-byte `.data.rel.ro` descriptors totaling 112 bytes**. The new payload is **704 bytes**. It also proves **2 mov64 text sites** and **8 path/seed sites** as proof sites only. All checks run on both the original and candidate images. This packet adds data evidence, not a function match.

The prior obligations are preserved: **437 normalized functions, 141 raw functions, 431 closed windows and 581 candidate pairs**, with **0 rejected pairs**. No binary patch, no whole-binary equivalence, and no NUL or adjacency bound is claimed.

## Source

Only static bytes are read. Each string is bounded by the immediate length carried by its descriptor or its text/seed site. A NUL byte, the following byte, and adjacent strings are not bounds. No relocation-table byte is credited.

The 16-byte descriptors live in `.data.rel.ro`. The layout is `u32 low = 0`, `u32 high = pointer`, `u64 length`, with exactly one type-8 relocation at the record start whose symbol index is 0. The candidate copies carry different `.rodata` pointers but the same lengths and the same referenced string bytes. Each descriptor credits its pointer field as 8 mapped bytes and its equal length field as 8 raw bytes; differing pointer bytes are not called raw equality.

The two mov sites decode `lddw` of a relocated `.rodata` pointer followed at `pc + 16` by a `mov` of the immediate length. The eight path/seed sites decode `lddw` of a relocated pointer and the immediate `stxdw` of that same register to the stack. Before any branch or overwrite, a store of the exact length must target the adjacent eight-byte stack field within the next 12 instructions. No relocation is present on the continuation, the length store, or the surrounding words. The sites stop at the pointer/length pair; no callee, callback target, output or runtime effect is claimed.

## Coverage

The baseline is the union of four merged deltas: rust-panic-messages, mayhemerror-debug-names, programerror-debug-copy and bounded-error-strings (#770). It is **20,747 / 26,180** payload bytes (`.rodata` 14,035 / 18,396, `.data.rel.ro` 6,712 / 7,784).

These intervals were disjoint from that baseline. Payload coverage becomes **21,451 / 26,180 bytes (81.94%)**, leaving **4,729 unproved**. `.rodata` becomes **14,627 / 18,396** (+592). `.data.rel.ro` becomes **6,824 / 7,784** (+112). The 16 string intervals union to the single span `[709739, 710331)`. The 7 descriptor records union to four spans totaling 112 bytes.

The added `.data.rel.ro` union is `[725792, 725824) + [725904, 725936) + [726056, 726072) + [727416, 727448)`.

## Still open

The leftover `[710438, 710440)` NUL bytes sit inside the originally named `[709739, 710440)` gap and are not claimed. The adjacent `[710331, 710438)` is already owned by the MayhemError Debug-names packet and is not claimed here. The remaining larger gaps elsewhere are unchanged except for this bite. Relocation and section layout are unchanged.

## Verification

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-option-seeds-paths-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-option-seeds-paths-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/test_tooling.py
```

Tests also reject broken pointer/store registers, stack-field offsets and text argument registers, and verify the mapped/raw descriptor split. Tests mutate every selected string byte and every descriptor length/pointer field, every mov length immediate, and every path/seed length `stxdw` immediate; each mutation must be rejected. A following byte in an unselected candidate gap is not absorbed. Inventory, symlink, FIFO, and resealed report and coverage edits are rejected.

## Exact intervals

Ends are exclusive. String pointers and descriptor offsets are original addresses unless labelled candidate. All 7 descriptors are 16 bytes.

### Strings

| # | Original interval | Length | Candidate pointer | Text |
| ---: | --- | ---: | ---: | --- |
| 1 | 709739–709770 | 31 | 690124 | `Invalid Option representation: ` |
| 2 | 709770–709801 | 31 | 690155 | `. The first byte must be 0 or 1` |
| 3 | 709801–709810 | 9 | 690327 | `sol-vault` |
| 4 | 709810–709827 | 17 | 690336 | `__event_authority` |
| 5 | 709827–709828 | 1 | 690353 | `\xfc` |
| 6 | 709828–709876 | 48 | 690279 | `programs/mayhem-program/src/instructions/burn.rs` |
| 7 | 709876–709919 | 43 | 690236 | ``called `Result::unwrap()` on an `Err` value`` |
| 8 | 709919–709949 | 30 | 690653 | `Account already has more than ` |
| 9 | 709949–709985 | 36 | 690683 | `Account already has the correct size` |
| 10 | 709985–710043 | 58 | 690595 | `programs/mayhem-program/src/instructions/extend_account.rs` |
| 11 | 710043–710101 | 58 | 690466 | `programs/mayhem-program/src/instructions/fee_recipients.rs` |
| 12 | 710101–710114 | 13 | 690524 | `fee-recipient` |
| 13 | 710114–710176 | 62 | 690404 | `programs/mayhem-program/src/instructions/pump_amm_interface.rs` |
| 14 | 710176–710234 | 58 | 690537 | `programs/mayhem-program/src/instructions/pump_interface.rs` |
| 15 | 710234–710295 | 61 | 690719 | `programs/mayhem-program/src/instructions/pump_interface_v2.rs` |
| 16 | 710295–710331 | 36 | 690200 | `programs/mayhem-program/src/state.rs` |

### Descriptors

| # | Original offset | Candidate offset | Pointer original → candidate | Length |
| ---: | ---: | ---: | --- | ---: |
| 1 | 725792 | 706232 | 709739 → 690124 | 31 |
| 2 | 725808 | 706248 | 709770 → 690155 | 31 |
| 3 | 727432 | 707936 | 709801 → 690327 | 9 |
| 4 | 725904 | 706872 | 709810 → 690336 | 17 |
| 5 | 727416 | 707976 | 709810 → 690336 | 17 |
| 6 | 725920 | 706888 | 709827 → 690353 | 1 |
| 7 | 726056 | 707760 | 709919 → 690653 | 30 |

### Mov64 text sites

| # | Original PC | Candidate PC | Pointer original → candidate | Length | Length register |
| ---: | ---: | ---: | --- | ---: | ---: |
| 1 | 60864 | 60864 | 709876 → 690236 | 43 | r2 |
| 2 | 61912 | 61912 | 709949 → 690683 | 36 | r2 |

### Path / seed sites

| # | Original PC | Candidate PC | Pointer original → candidate | Length | Candidate `stxdw` PC |
| ---: | ---: | ---: | --- | ---: | ---: |
| 1 | 56160 | 56160 | 709828 → 690279 | 48 | 56208 |
| 2 | 61760 | 61760 | 709985 → 690595 | 58 | 61808 |
| 3 | 65984 | 65984 | 710043 → 690466 | 58 | 66032 |
| 4 | 70752 | 70752 | 710101 → 690524 | 13 | 70808 |
| 5 | 95632 | 94912 | 710114 → 690404 | 62 | 94960 |
| 6 | 124536 | 114592 | 710176 → 690537 | 58 | 114640 |
| 7 | 155760 | 152888 | 710234 → 690719 | 61 | 152936 |
| 8 | 177736 | 156792 | 710295 → 690200 | 36 | 156840 |

provider=OpenCode model=opencode/deepseek-v4.1-flash-free client=opencode CLI 1.19.5

Made via @slopdotcash
