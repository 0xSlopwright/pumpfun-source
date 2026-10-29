## Summary

Counts 16 static Rust panic-message strings (385 `.rodata` bytes), their 16 counted 16-byte descriptors (256 `.data.rel.ro` bytes), and 3 bounded text sites on the qualified437 images. Each descriptor is `u32 low = 0`, `u32 high = pointer`, `u64 length` with one type-8 relocation at the record start (symbol index 0). Each text site is a relocated `.rodata` `lddw` followed by an immediate-length `mov`. All strings and descriptors are checked on both images; the candidate pointers differ but the counted bytes and lengths match.

These intervals were disjoint from the prior programerror packet. The relation stays **437 normalized / 141 raw / 431 closed windows / 581 pairs** with **0 rejected pairs**. No binary middle table, digit table, `[...]` placeholder, NUL or adjacency bound is claimed, and no relocation-table bytes are credited.

Package: `research/mayhem-current437-rust-panic-messages-20261029/`.

Upstream review diff, against `lalalune/pumpfun-source` `main`:

https://github.com/lalalune/pumpfun-source/compare/main...harrywu666:pumpfun-source:opencode/mayhem-data-rust-panic-messages-20261029?expand=1

## Evidence

| Input | SHA-256 |
| --- | --- |
| `evidence/original/mayhem/deployed.so` | `a87fa9f866272514e6acb852b668c4a08aeb173d56c883039991d114d1199bdb` |
| `research/mayhem-current437-composition-20261028/builds/first/symbols.so.gz` | `9c8c50857bfe8b80ebf08ebb50c905c6582676cb8e572d39f45de8647f62fbae` |
| `research/mayhem-current437-programerror-debug-names-20261029/coverage-delta.json` | `4963685017de2ef8a6b38afdbc1f3bc5e1bdc3682fbf8738cc6524cacd8d42fa` |

Payload coverage moves from **19,239** to **19,880 / 26,180** (75.94%), leaving **6,300 unproved**. `.rodata` moves from **12,783** to **13,168 / 18,396** (+385). `.data.rel.ro` moves from **6,456** to **6,712 / 7,784** (+256). The added `.rodata` union is `[722392, 722528) + [723279, 723373) + [723376, 723439) + [723663, 723755)`. The 16 descriptors union to eight 16-byte spans totaling 256 bytes.

## Still open

`6,300` payload bytes remain. Leftover holes inside the previously open `[722392, 723755)` span remain: `722528–723279` (binary), `723373–723376`, and `723439–723663` (crumbs/digits). `.rodata` gaps `[713022, 714341)` and `[709739, 710440)` are still open. The `.data.rel.ro` gaps, relocation and section layout are unchanged.

## Test plan

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-rust-panic-messages-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-rust-panic-messages-20261029/test_verify.py
```

Tests flip every selected string byte, every descriptor length and pointer field, and every text-site length immediate; each must be rejected. A following byte in an unselected gap is not absorbed. Inventory, symlink, FIFO, and resealed report and coverage edits are rejected.

provider=OpenCode (Zen) model=opencode/deepseek-v4.1-flash-free client=opencode CLI 1.19.5

Made via @slopdotcash
