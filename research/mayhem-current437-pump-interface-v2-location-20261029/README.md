# Mayhem `pump_interface_v2.rs` panic Location records

This packet counts **two 24-byte `core::panic::Location`-shaped records** and the
**62-byte path literal** they point at: **110 new payload bytes**. Both the two
records and this copy of the path literal are uncredited in the merged qualified437
ledger. No code site, allocation extent or relocation-table byte is claimed.

## Claim

- Original path literal: `[708077, 708139)` = 61 path bytes plus one trailing NUL.
- Candidate path literal: `[688360, 688422)` = the same 62 bytes.
- Original records: `0xb1730` (591:25) and `0xb1748` (592:26), union
  `[726832, 726880)`.
- Candidate records: `0xaccd0` (591:25) and `0xacce8` (592:26), union
  `[707792, 707840)`.
- Each record is `(u32 low = 0, u32 pointer, u64 length = 62, u32 line, u32 column)`.
  Exactly one type-8 relocation with symbol index zero sits at the record start;
  the length, line and column halves are raw.

The 62-byte length is the immediate bound. It counts the 61 path bytes and the
NUL byte at offset 61; the NUL is inside the bound and is not used as a boundary.

## Deliberately excluded

The same file has two further original records at `0xb1700` (393:25) and
`0xb1718` (394:26), union `[726784, 726832)`. They are checked for presence and
for the same pointer/length/relocation invariants, but the candidate image has
no counterpart rows for them. They are **not counted**, and the coverage delta
is asserted not to intersect `[726784, 726832)`. These two rows remain open.

## Qualified relation

The two selected records are the rows that exist in both images for one owner,
the source path `programs/mayhem-program/src/instructions/pump_interface_v2.rs`.
Each selected record reproduces the same relocated pointer, the same immediate
length and the same `(line, column)` pair in both images; the candidate status
of the two excluded rows is recorded explicitly instead of being inferred.

## Coverage

The baseline is the sealed union of the merged qualified437 `coverage-delta.json`
files merged at `b19f4af32`, recomputed from path + SHA-256 rather than summed; `proof.py` reads the
pinned set and totals from `baseline/sources.json` and asserts the union equals
the declared totals instead of hardcoding them:
**24,109 / 26,180 payload bytes** (`.rodata` 16,869 / 18,396;
`.data.rel.ro` 7,240 / 7,784).

After this packet:

- payload: **24,219 / 26,180 bytes**;
- `.rodata`: **16,931 / 18,396** (+62);
- `.data.rel.ro`: **7,288 / 7,784** (+48: 16 mapped pointer bytes, 32 raw
  length/line/column bytes).

The new intervals are exactly `[708077, 708139)` and
`[726832, 726880)`. They are disjoint from merged #956, the eight merged
seed/string packets #1000/#1003/#1005/#1010/#1012/#1014/#1015/#1017, and the
excluded `[726784, 726832)` rows.

## Verification

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-pump-interface-v2-location-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-pump-interface-v2-location-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/test_tooling.py
```

Tests mutate every path byte, each selected record's low word, pointer, length,
line and column, the relocation type and symbol index, and a candidate row line.
They also assert that the two excluded rows are absent from the candidate and
from the coverage delta, that the following path byte and the following record
are not absorbed, and reject unlisted files, symlinks, FIFOs and resealed
observations/coverage/baseline/input edits.

## Limits

This proof is static. It does not establish that these records are reachable
panic sites, that they describe the current source, or any runtime behavior. It
does not claim a code site, any byte outside the two counted intervals, the two
excluded original-only rows, or a full location-table allocation. No binary
patch or whole-ELF identity is claimed.

provider=OpenCode model=opencode/deepseek-v4.1-flash-free client=opencode CLI 1.19.5

Made via @slopdotcash
