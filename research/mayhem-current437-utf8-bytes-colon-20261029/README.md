# Mayhem utf8-error ` bytes: ` string and descriptor

This packet counts **one 8-byte `.rodata` Rust core utf8-error literal** and its
**16-byte `.data.rel.ro` descriptor**: **24 new payload bytes**. The string and
descriptor are both uncredited in the merged qualified437 ledger. No code site,
allocation extent or relocation-table byte is claimed.

## Claim

- Original string: `[707176, 707184)` = `b" bytes: "`.
- Candidate string: `[689544, 689552)`.
- Original descriptor: `[726072, 726088)`; candidate: `[707776, 707792)`.
- Descriptor layout: `u32 low = 0`, `u32 high = pointer`, `u64 length = 8`.
- Exactly one type-8 relocation with symbol index zero at the descriptor start;
  the length half has no relocation.
- The descriptor pointer resolves to the string bytes in both images.

The descriptor's immediate length is the bound; no NUL, following byte or
adjacent string is used. The neighbouring literals start outside the interval
and are not absorbed.

## Coverage

The baseline is the sealed union of the merged qualified437
`coverage-delta.json` files, recomputed from path + SHA-256 rather than summed;
`proof.py` reads the pinned set and totals from `baseline/sources.json` and
asserts the union equals the declared totals instead of hardcoding them:
**23,834 / 26,180 payload bytes** (`.rodata` 16,722 / 18,396;
`.data.rel.ro` 7,112 / 7,784).

After this packet:

- payload: **23,858 / 26,180 bytes**;
- `.rodata`: **16,730 / 18,396** (+8);
- `.data.rel.ro`: **7,128 / 7,784** (+16: 8 raw length bytes, 8 mapped pointer
  bytes).

The new intervals are exactly `[707176, 707184)` and `[726072, 726088)`. They
are disjoint from merged #956 and open #1000/#1003/#1005/#1010.

## Verification

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-utf8-bytes-colon-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-utf8-bytes-colon-20261029/test_verify.py
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
