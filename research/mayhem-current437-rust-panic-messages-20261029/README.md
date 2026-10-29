# Qualified437 counted Rust panic-message strings, descriptors and text sites

This packet counts **16 static literal strings totaling 385 `.rodata` bytes**, their **16 counted 16-byte descriptors totaling 256 `.data.rel.ro` bytes**, and **3 text sites** that load the pointer and length immediately before a call. All three kinds are checked on both the original and candidate images. This packet adds data evidence, not a function match.

The prior obligations are preserved: **437 normalized functions, 141 raw functions, 431 closed windows and 581 candidate pairs**, with **0 rejected pairs**. No binary patch and no whole-binary equivalence is claimed.

## Source

Only static bytes are read. Each string is bounded by the immediate length carried by its descriptor or its text site. A NUL byte, the following byte, and adjacent strings are not bounds. No binary middle table, no digit table and no `[...]` placeholder is claimed.

The 16-byte descriptors live in `.data.rel.ro`. The layout is `u32 low = 0`, `u32 high = pointer`, `u64 length`, with exactly one type-8 relocation at the record start whose symbol index is 0. The candidate copies carry different `.rodata` pointers but the same lengths and the same bytes.

The three text sites decode the bounded pair grammar only:

| Original PC | Candidate PC | Pointer original → candidate | Length | Length register |
| ---: | ---: | --- | ---: | ---: |
| 668896 | 602576 | 722420 → 702860 | 5 | r3 |
| 670360 | 604040 | 722442 → 702882 | 86 | r2 |
| 673896 | 607576 | 723376 → 703816 | 43 | r2 |

Each site is an `lddw` of a relocated `.rodata` pointer followed by a `mov` of the immediate length, with no relocation on the continuation, the length `mov`, or the surrounding words. The pointed-to bytes must equal the counterpart and the recorded text. The sites stop at the immediate pair; no callee, callback target, output or runtime effect is claimed.

## Coverage

The baseline is the prior programerror packet at **19,239 / 26,180** payload bytes (`.rodata` 12,783 / 18,396, `.data.rel.ro` 6,456 / 7,784).

These intervals were disjoint from that baseline. Payload coverage becomes **19,880 / 26,180 bytes (75.94%)**, leaving **6,300 unproved**. `.rodata` becomes **13,168 / 18,396** (+385). `.data.rel.ro` becomes **6,712 / 7,784** (+256). The 16 string intervals union to four spans and the 16 descriptor records union to eight spans (256 bytes). No relocation-table byte is credited.

The added `.rodata` union is `[722392, 722528) + [723279, 723373) + [723376, 723439) + [723663, 723755)`.

The added `.data.rel.ro` union is `[732440, 732456) + [732528, 732544) + [732648, 732696) + [732712, 732728) + [732744, 732760) + [732856, 732872) + [732904, 732952) + [732968, 733048)`.

## Still open

The complement of `coverage-delta.json` remains open: **6,300 payload bytes**. Leftover holes inside the previously open `[722392, 723755)` span remain: `722528–723279` (binary), `723373–723376`, and `723439–723663` (crumbs/digits). Beside these, `.rodata` gaps `[713022, 714341)` and `[709739, 710440)` are still open. The `.data.rel.ro` gaps are unchanged. Relocation and section layout are unchanged. None of the leftover binary or digit content is claimed here.

## Verification

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-rust-panic-messages-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-rust-panic-messages-20261029/test_verify.py
```

Tests mutate every selected string byte and every descriptor length/pointer field and every text-site length immediate; each mutation must be rejected. A following byte in an unselected gap is not absorbed. Inventory, symlink, FIFO, and resealed report and coverage edits are rejected.

## Exact intervals

Ends are exclusive. String pointers and descriptor offsets are original addresses unless labelled candidate. All 16 descriptors are 16 bytes.

### Strings

| # | Original interval | Length | Candidate pointer | Text |
| ---: | --- | ---: | ---: | --- |
| 1 | 722392–722420 | 28 | 702832 | `Hash table capacity overflow` |
| 2 | 722420–722425 | 5 | 702860 | `Error` |
| 3 | 722425–722442 | 17 | 702865 | `capacity overflow` |
| 4 | 722442–722528 | 86 | 702882 | `a formatting trait implementation returned an error when the underlying stream did not` |
| 5 | 723279–723307 | 28 | 703719 | `attempt to add with overflow` |
| 6 | 723307–723340 | 33 | 703747 | `attempt to subtract with overflow` |
| 7 | 723340–723373 | 33 | 703780 | `attempt to multiply with overflow` |
| 8 | 723376–723419 | 43 | 703816 | ``called `Option::unwrap()` on a `None` value`` |
| 9 | 723419–723437 | 18 | 703859 | ` but the index is ` |
| 10 | 723437–723439 | 2 | 703877 | `: ` |
| 11 | 723663–723677 | 14 | 704103 | `begin <= end (` |
| 12 | 723677–723678 | 1 | 704117 | `` ` `` |
| 13 | 723678–723689 | 11 | 704118 | `byte index ` |
| 14 | 723689–723727 | 38 | 704129 | ` is not a char boundary; it is inside ` |
| 15 | 723727–723733 | 6 | 704167 | ``) of ` `` |
| 16 | 723733–723755 | 22 | 704173 | `` is out of bounds of ` `` |

### Descriptors

| # | Original offset | Candidate offset | Pointer original → candidate | Length |
| ---: | ---: | ---: | --- | ---: |
| 1 | 732440 | 712880 | 722392 → 702832 | 28 |
| 2 | 732528 | 712968 | 722425 → 702865 | 17 |
| 3 | 732648 | 713088 | 723279 → 703719 | 28 |
| 4 | 732664 | 713104 | 723307 → 703747 | 33 |
| 5 | 732680 | 713120 | 723340 → 703780 | 33 |
| 6 | 732712 | 713152 | 723419 → 703859 | 18 |
| 7 | 732744 | 713184 | 723437 → 703877 | 2 |
| 8 | 732856 | 713296 | 723663 → 704103 | 14 |
| 9 | 732904 | 713344 | 723677 → 704117 | 1 |
| 10 | 732920 | 713360 | 723678 → 704118 | 11 |
| 11 | 732936 | 713376 | 723689 → 704129 | 38 |
| 12 | 732968 | 713408 | 723727 → 704167 | 6 |
| 13 | 732984 | 713424 | 723677 → 704117 | 1 |
| 14 | 733000 | 713440 | 723678 → 704118 | 11 |
| 15 | 733016 | 713456 | 723733 → 704173 | 22 |
| 16 | 733032 | 713472 | 723677 → 704117 | 1 |

### Text sites

| # | Original PC | Candidate PC | Pointer original → candidate | Length | Length register |
| ---: | ---: | ---: | --- | ---: | ---: |
| 1 | 668896 | 602576 | 722420 → 702860 | 5 | r3 |
| 2 | 670360 | 604040 | 722442 → 702882 | 86 | r2 |
| 3 | 673896 | 607576 | 723376 → 703816 | 43 | r2 |

provider=OpenCode (Zen) model=opencode/deepseek-v4.1-flash-free client=opencode CLI 1.19.5

Made via @slopdotcash
