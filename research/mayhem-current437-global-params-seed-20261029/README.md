# Mayhem `global-params` seed string and descriptor

This packet counts **one 13-byte `.rodata` seed literal** and its **16-byte
`.data.rel.ro` descriptor**: **29 new payload bytes**. The prior
Option/seed/path packet stopped at `[709739, 710331)` and did not claim this
outside seed. No name, code site, allocation extent or relocation-table byte is
credited.

## Claim

- Original string: `[711426, 711439)` = `b"global-params"`.
- Candidate string: `[690956, 690969)`.
- Original descriptor: `[727376, 727392)`; candidate: `[707904, 707920)`.
- Descriptor layout: `u32 low = 0`, `u32 high = pointer`, `u64 length = 13`.
- Exactly one type-8 relocation with symbol index zero at the descriptor start;
  the length half has no relocation.
- The descriptor pointer resolves to the string bytes in both images.

The string is the Anchor seed declared at
`src/instructions/fee_recipients.rs:84` in the archived source tarball:

```rust
#[account(mut, seeds = [b"global-params"], bump)]
pub global_params: Account<'info, GlobalParams>,
```

`source-context/provenance.json` pins the archive, member, line, excerpt hash
and seed. This is static source context, not a rebuilt or patched tree.

## Coverage

The baseline is the sealed union of the 24 merged qualified437
`coverage-delta.json` files, recomputed from path + SHA-256 rather than summed:
**23,834 / 26,180 payload bytes** (`.rodata` 16,722 / 18,396;
`.data.rel.ro` 7,112 / 7,784).

After this packet:

- payload: **23,863 / 26,180 bytes (91.15%)**;
- `.rodata`: **16,735 / 18,396** (+13);
- `.data.rel.ro`: **7,128 / 7,784** (+16: 8 raw length bytes, 8 mapped pointer
  bytes).

The new intervals are exactly `[711426, 711439)` and `[727376, 727392)`. They are disjoint from merged #956 `[713112, 713272)` and `[727696, 727856)`.

## Verification

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-global-params-seed-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-global-params-seed-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/test_tooling.py
```

Tests mutate every string byte; the descriptor low word, pointer and length;
the relocation type and symbol index; and a candidate pointer mismatch. They
also check that the following byte is not absorbed, and reject unlisted files,
symlinks, FIFOs, resealed observations/coverage/baseline/input edits.

## Limits

This proof is static. It does not establish runtime seed use, account
derivation, instruction reachability, allocator behavior or a stable Anchor
ABI. It does not claim any code site, any byte outside the two intervals, or a
full descriptor-table allocation. NUL and adjacent strings are not bounds. No
binary patch or whole-ELF identity is claimed.

provider=OpenCode model=opencode/deepseek-v4.1-flash-free client=opencode CLI 1.19.5

Made via @slopdotcash
