# Mayhem index-out-of-bounds panic string and descriptor

This packet counts **one 32-byte `.rodata` Rust core panic literal** and its
**16-byte `.data.rel.ro` descriptor**: **48 new payload bytes**. The string and
descriptor are both uncredited in the merged qualified437 ledger. No code site,
allocation extent or relocation-table byte is claimed.

## Claim

- Original string: `[708936, 708968)` = `b"index out of bounds: the len is "`.
- Candidate string: `[689216, 689248)`.
- Original descriptor: `[732696, 732712)`; candidate: `[713136, 713152)`.
- Descriptor layout: `u32 low = 0`, `u32 high = pointer`, `u64 length = 32`.
- Exactly one type-8 relocation with symbol index zero at the descriptor start;
  the length half has no relocation.
- The descriptor pointer resolves to the string bytes in both images.

The descriptor's immediate length is the bound; no NUL, following byte or
adjacent string is used.

## Coverage

The baseline is the sealed union of the 24 merged qualified437
`coverage-delta.json` files, recomputed from path + SHA-256 rather than summed:
**23,834 / 26,180 payload bytes** (`.rodata` 16,722 / 18,396;
`.data.rel.ro` 7,112 / 7,784).

After this packet:

- payload: **23,882 / 26,180 bytes (91.23%)**;
- `.rodata`: **16,754 / 18,396** (+32);
- `.data.rel.ro`: **7,128 / 7,784** (+16: 8 raw length bytes, 8 mapped pointer
  bytes).

The new intervals are exactly `[708936, 708968)` and `[732696, 732712)`. They
are disjoint from merged #956 and open #1000/#1003.

## Verification

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-index-oob-len-string-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-index-oob-len-string-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/test_tooling.py
```

Tests mutate every string byte; the descriptor low word, pointer and length;
the relocation type and symbol index; and a candidate pointer mismatch. They
also check that the following byte is not absorbed, and reject unlisted files,
symlinks, FIFOs, resealed observations/coverage/baseline/input edits.

## Limits

This proof is static. It does not establish runtime panic formatting,
reachability, allocator behavior, output bytes or a stable Rust layout. It does
not claim a code site, any byte outside the two intervals, or a full
descriptor-table allocation. NUL and adjacent strings are not bounds. No binary
patch or whole-ELF identity is claimed.

provider=OpenCode model=opencode/deepseek-v4.1-flash-free client=opencode CLI 1.19.5

Made via @slopdotcash
