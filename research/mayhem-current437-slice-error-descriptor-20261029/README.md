# Mayhem slice-error string and descriptor

This packet counts **one 16-byte `.rodata` Rust core slice-error string** and its
**16-byte `.data.rel.ro` descriptor**: **32 new payload bytes**. The prior
format-record packet credited the immediately preceding descriptor
`[732872, 732888)` but not this next record. No code site, allocation extent or
relocation-table byte is claimed.

## Claim

- Original string: `[710472, 710488)` = `b") when slicing \`"`.
- Candidate string: `[691184, 691200)`.
- Original descriptor: `[732888, 732904)`; candidate: `[713328, 713344)`.
- Descriptor layout: `u32 low = 0`, `u32 high = pointer`, `u64 length = 16`.
- Exactly one type-8 relocation with symbol index zero at the descriptor start;
  the length half has no relocation.
- The descriptor pointer resolves to the string bytes in both images.

The string is bounded by the descriptor's immediate length, not by a NUL,
the following `CoinRiskExceeded` bytes or an adjacent string.

## Coverage

The baseline is the sealed union of the 24 merged qualified437
`coverage-delta.json` files, recomputed from path + SHA-256 rather than summed:
**23,834 / 26,180 payload bytes** (`.rodata` 16,722 / 18,396;
`.data.rel.ro` 7,112 / 7,784).

After this packet:

- payload: **23,866 / 26,180 bytes (91.16%)**;
- `.rodata`: **16,738 / 18,396** (+16);
- `.data.rel.ro`: **7,128 / 7,784** (+16: 8 raw length bytes, 8 mapped pointer
  bytes).

The new intervals are exactly `[710472, 710488)` and `[732888, 732904)`. They
are disjoint from merged #956 `[713112, 713272)` / `[727696, 727856)` and from
open #1000 `[711426, 711439)` / `[727376, 727392)`.

## Verification

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-slice-error-descriptor-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-slice-error-descriptor-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/test_tooling.py
```

Tests mutate every string byte; the descriptor low word, pointer and length;
the relocation type and symbol index; and a candidate pointer mismatch. They
also check that the following byte is not absorbed, and reject unlisted files,
symlinks, FIFOs, resealed observations/coverage/baseline/input edits.

## Limits

This proof is static. It does not establish runtime formatting, reachability,
allocator behavior, output bytes or a stable Rust layout. It does not claim a
code site, any byte outside the two intervals, or a full descriptor-table
allocation. NUL and adjacent strings are not bounds. No binary patch or
whole-ELF identity is claimed.

provider=OpenCode model=opencode/deepseek-v4.1-flash-free client=opencode CLI 1.19.5

Made via @slopdotcash
