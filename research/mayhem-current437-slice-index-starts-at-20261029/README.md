# Mayhem `slice index starts at ` string and descriptor

This packet counts **one 22-byte `.rodata` Rust core slice-order panic format
piece** and its **16-byte `.data.rel.ro` descriptor**: **38 new payload bytes**.
The string and descriptor are both uncredited in the merged qualified437 ledger.
No code site, allocation extent or relocation-table byte is claimed.

## Claim

- Original string: `[725256, 725278)` = `b"slice index starts at "`.
- Candidate string: `[705696, 705718)`.
- Original descriptor: `[733184, 733200)`; candidate: `[713624, 713640)`.
- Descriptor layout: `u32 low = 0`, `u32 high = pointer`, `u64 length = 22`.
- Exactly one type-8 relocation with symbol index zero at the descriptor start;
  the length half has no relocation.
- The descriptor pointer resolves to the string bytes in both images.

The descriptor's immediate length is the bound; no NUL, following byte or
adjacent string is used. The next literal, ` but ends at `, begins at `725278`
and is not absorbed.

## Coverage

The baseline is the sealed union of the merged qualified437
`coverage-delta.json` files, recomputed from path + SHA-256 rather than summed;
`proof.py` reads the pinned set and totals from `baseline/sources.json` and
asserts the union equals the declared totals instead of hardcoding them:
**23,834 / 26,180 payload bytes** (`.rodata` 16,722 / 18,396;
`.data.rel.ro` 7,112 / 7,784).

After this packet:

- payload: **23,872 / 26,180 bytes**;
- `.rodata`: **16,744 / 18,396** (+22);
- `.data.rel.ro`: **7,128 / 7,784** (+16: 8 raw length bytes, 8 mapped pointer
  bytes).

The new intervals are exactly `[725256, 725278)` and `[733184, 733200)`. They
are disjoint from merged #956 and open #1000/#1003/#1005/#1010/#1012/#1014.

## Verification

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-slice-index-starts-at-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-slice-index-starts-at-20261029/test_verify.py
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
