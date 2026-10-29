# Mayhem slice-index literal shared by two descriptors

This packet counts **one 34-byte `.rodata` panic literal** and the **two 16-byte
`.data.rel.ro` descriptors** that both resolve to it: **66 new payload bytes**. The
literal and both descriptors are uncredited in the merged qualified437 ledger.
No code site, allocation extent or relocation-table byte is claimed.

## Claim

- Original literal: `[725222, 725256)` = `b" out of range for slice of length "`.
- Candidate literal: `[705662, 705696)`.
- Original descriptors: `0xb2fd0` and `0xb2ff0`, union `[733136, 733184)` with
  the unclaimed third entry `[733152, 733168)` in between.
- Candidate descriptors: `0xae368` and `0xae388`, union `[713576, 713624)` with
  the unclaimed third entry `[713592, 713608)` in between.
- Each descriptor is `u32 low = 0`, `u32 pointer`, `u64 length = 34`, with
  exactly one type-8 relocation at the record start; the length half is raw.
  Both descriptors point at the same literal and carry the same immediate length.

## Qualified relation

The literal is a member of the six-entry slice-index panic table:
`range start index ` (`0xb2fc0`, already merged), ` out of range for slice of
length ` (this packet, twice), `range end index ` (`0xb2fe0`, not counted),
`slice index starts at ` (`0xb3000`, already merged) and ` but ends at `
(`0xb3010`, not counted). This packet claims exactly the two descriptors that
share the 34-byte literal; the table's other entries remain untouched.

The immediate length is the bound; the literal has no NUL and is followed by
`slice index starts at ` at `725256`, which is not absorbed. The two claimed
descriptors are not adjacent, and the packet asserts that the intervening
`range end index ` record at `733152` is not in the coverage delta.

## Coverage

The baseline is the sealed union of the 34 merged qualified437
`coverage-delta.json` files present at `74909503c` (the 32 earlier deltas plus
#1046 and #1052), recomputed from path + SHA-256 rather than summed; `proof.py` reads the pinned set and totals from
`baseline/sources.json` and asserts the union equals the declared totals instead
of hardcoding them: **24,378 / 26,180 payload bytes** (`.rodata` 16,994 / 18,396;
`.data.rel.ro` 7,384 / 7,784).

After this packet:

- payload: **24,444 / 26,180 bytes**;
- `.rodata`: **17,028 / 18,396** (+34);
- `.data.rel.ro`: **7,416 / 7,784** (+32: 16 raw length bytes, 16 mapped pointer
  bytes).

The new intervals are exactly `[725222, 725256)`, `[733136, 733152)` and
`[733168, 733184)`. They are disjoint from merged #956,
#1000/#1003/#1005/#1010/#1012/#1014/#1015/#1017, and the unclaimed
`[733152, 733168)` neighbour.

## Verification

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-slice-panic-shared-descriptor-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-slice-panic-shared-descriptor-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/test_tooling.py
```

Tests mutate every literal byte, each descriptor's low word, pointer and length,
the candidate descriptor pointers, the relocation type and symbol index, and a
duplicate descriptor injected over the neighbour slot. They also check that the
following literal byte and the intervening `range end index ` record are not
absorbed, and reject unlisted files, symlinks, FIFOs and resealed
observations/coverage/baseline/input edits.

## Limits

This proof is static. It does not establish reachability, runtime behavior,
current source equivalence or a stable Rust table layout. It does not claim a
code site, any byte outside the three counted intervals, the other table
entries, or a full descriptor-table allocation. The two shared descriptors are
an observed mapping for this image pair only. No binary patch or whole-ELF
identity is claimed.

provider=OpenCode model=opencode/deepseek-v4.1-flash-free client=opencode CLI 1.19.5

Made via @slopdotcash
