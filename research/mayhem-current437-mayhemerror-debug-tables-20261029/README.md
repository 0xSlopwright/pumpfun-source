# Qualified437 MayhemError Debug length and pointer tables

This packet credits the **twenty selected `MayhemError` Debug length-table entries and the matching twenty relocated pointer-table entries** that the prior names packet deliberately left open. It adds **160 `.rodata` length bytes** and **160 `.data.rel.ro` pointer bytes** (80 zero low words plus 80 mapped pointer words): **320 new payload bytes**.

The prior packet counted the twenty unit-variant Debug names themselves (335 bytes) and stated that the length table `[713112, 713272)` and pointer table `[727696, 727856)` remained unproved. This packet proves exactly those two tables for the same observed tags. It does not re-credit the names.

## Qualified relation

The selected owner is original O0098 `[196888, 197000)` (112 bytes) and candidate `[173568, 173680)`, symbol `_ZN66_$LT$mayhem_recovered..MayhemError$u20$as$u20$core..fmt..Debug$GT$3fmt17h68b586be249ea759E`. The prior relation remains **437 normalized functions, 141 raw functions, 431 closed windows and 581 candidate pairs**. This packet adds data evidence, not a function match.

The 112-byte body is rechecked by the prior verifier: it loads the `u32` tag, scales it by eight, loads a length-table base into r3 and a pointer-table base into r2, adds the scaled tag, loads the two `u64` entries, restores the formatter, and calls the shared `Formatter::write_str` helper. The two table bases are type-8 relocations with symbol index zero; the `lddw` continuation words are not instructions. The matched 48-byte writer helper is checked again and stops before its unresolved indirect callback.

## What is counted

For every observed tag `0..=19`:

- The **length slot** is `length_table_base + tag * 8`. It is an eight-byte `u64` in `.rodata`, has no relocation, is positive and at most 256, and equals both the archived variant identifier length and the candidate length.
- The **pointer slot** is `pointer_table_base + tag * 8`. It is an eight-byte `.data.rel.ro` entry with a zero low 32-bit word and a type-8, symbol-index-zero relocation at the slot. The high 32-bit word is the in-place pointer addend. The pointed-to `.rodata` bytes equal the archived variant identifier and the candidate bytes at the candidate pointer. Pointer addresses differ between images; only pointer correspondence is claimed.
- The **name bytes** are checked again for each entry but are **not** added to the coverage delta. They were already counted by the prior packet.

Only the selected slots are counted. The twenty length slots and twenty pointer slots happen to be contiguous in this image pair, but no full-array or allocation extent is inferred. No NUL, adjacent string, following byte or table-end byte supplies a bound. Relocation-table bytes are not credited.

## Source context

The sealed excerpt is the `#[error_code] pub enum MayhemError` definition from the archived `src/lib.rs`, with explicit discriminants `0..=19`. The Debug names are the Rust variant identifiers; the `#[msg(...)]` strings are not used as Debug-name evidence. `source-context/provenance.json` pins the archived tarball, the extracted `src/lib.rs` hash, the excerpt hash and the twenty variant rows.

This is an **observed mapping for this image pair**, not a promise that Rust or Anchor keeps this enum ABI or table layout stable.

## Coverage

Tested revision: `56380c48d` (current `upstream/main` when this packet was prepared). The packet was rebased onto that revision unchanged; all 23 baseline delta files are byte-identical to the versions sealed at `cf4455408`, and no Mayhem data packet changed in between.

The baseline is the sealed union of all 23 qualified437 `coverage-delta.json` files present at commit `cf4455408`: **23,514 / 26,180 payload bytes** (`.rodata` 16,562 / 18,396, `.data.rel.ro` 6,952 / 7,784). `baseline/qualified437-union.json` records every source delta path and SHA-256 and recomputes the union; it is not a sum of per-packet deltas.

After this packet:

- payload: **23,834 / 26,180 bytes (91.04%)**, leaving 2,346 bytes unproved;
- `.rodata`: **16,722 / 18,396 bytes**;
- `.data.rel.ro`: **7,112 / 7,784 bytes**.

The new `.rodata` interval is exactly `[713112, 713272)`. The new `.data.rel.ro` interval is exactly `[727696, 727856)`, split into 80 raw zero words and 80 mapped pointer words. No name interval is counted again.

## Exact intervals

Ends are exclusive. Length slots and pointer slots are eight bytes each. Original and candidate addresses are shown separately; the candidate tables are at `[693552, 693712)` and `[708136, 708296)`.

| Tag | Variant | Length | Original length slot | Candidate length slot | Original pointer slot | Candidate pointer slot | Original name interval | Candidate name interval |
| ---: | --- | ---: | --- | --- | --- | --- | --- | --- |
| 0 | `TradingPaused` | 13 | 713112–713120 | 693552–693560 | 727696–727704 | 708136–708144 | 710331–710344 | 692704–692717 |
| 1 | `TradingActive` | 13 | 713120–713128 | 693560–693568 | 727704–727712 | 708144–708152 | 710344–710357 | 692717–692730 |
| 2 | `MathOverflow` | 12 | 713128–713136 | 693568–693576 | 727712–727720 | 708152–708160 | 710357–710369 | 692730–692742 |
| 3 | `SolReservesTooLow` | 17 | 713136–713144 | 693576–693584 | 727720–727728 | 708160–708168 | 710369–710386 | 692742–692759 |
| 4 | `MayhemModeEnded` | 15 | 713144–713152 | 693584–693592 | 727728–727736 | 708168–708176 | 710386–710401 | 692759–692774 |
| 5 | `MayhemModeNotEnded` | 18 | 713152–713160 | 693592–693600 | 727736–727744 | 708176–708184 | 710401–710419 | 692774–692792 |
| 6 | `OverallRiskExceeded` | 19 | 713160–713168 | 693600–693608 | 727744–727752 | 708184–708192 | 710419–710438 | 692792–692811 |
| 7 | `CoinRiskExceeded` | 16 | 713168–713176 | 693608–693616 | 727752–727760 | 708192–708200 | 710488–710504 | 691200–691216 |
| 8 | `PumpCpiFailed` | 13 | 713176–713184 | 693616–693624 | 727760–727768 | 708200–708208 | 710712–710725 | 692811–692824 |
| 9 | `PumpCpiMathOverflow` | 19 | 713184–713192 | 693624–693632 | 727768–727776 | 708208–708216 | 710725–710744 | 692824–692843 |
| 10 | `PumpSwapCpiFailed` | 17 | 713192–713200 | 693632–693640 | 727776–727784 | 708216–708224 | 710744–710761 | 692843–692860 |
| 11 | `PumpSwapCpiMathOverflow` | 23 | 713200–713208 | 693640–693648 | 727784–727792 | 708224–708232 | 710761–710784 | 692860–692883 |
| 12 | `PumpCpiSlippage` | 15 | 713208–713216 | 693648–693656 | 727792–727800 | 708232–708240 | 710784–710799 | 692883–692898 |
| 13 | `PumpSwapCpiSlippage` | 19 | 713216–713224 | 693656–693664 | 727800–727808 | 708240–708248 | 710799–710818 | 692898–692917 |
| 14 | `WithdrawRateLimit` | 17 | 713224–713232 | 693664–693672 | 727808–727816 | 708248–708256 | 710818–710835 | 692917–692934 |
| 15 | `TradeRateLimit` | 14 | 713232–713240 | 693672–693680 | 727816–727824 | 708256–708264 | 710835–710849 | 692934–692948 |
| 16 | `AccountTypeNotSupported` | 23 | 713240–713248 | 693680–693688 | 727824–727832 | 708264–708272 | 710849–710872 | 692948–692971 |
| 17 | `MaxFeeRecipientsExceeded` | 24 | 713248–713256 | 693688–693696 | 727832–727840 | 708272–708280 | 710872–710896 | 692971–692995 |
| 18 | `InvalidBump` | 11 | 713256–713264 | 693696–693704 | 727840–727848 | 708280–708288 | 710896–710907 | 692995–693006 |
| 19 | `SweepFeeRateLimit` | 17 | 713264–713272 | 693704–693712 | 727848–727856 | 708288–708296 | 710907–710924 | 693006–693023 |

## Limits

This proof is static. It does not establish runtime formatting, reachability from an instruction, allocator behavior, output bytes, a stable Rust enum ABI, a full table allocation, or whole-ELF identity. It says nothing about table entries outside the selected tags. The writer proof stops before the unresolved `Formatter::write_str` callback.

## Verification

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-mayhemerror-debug-tables-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-mayhemerror-debug-tables-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/test_tooling.py
```

Tests mutate every length entry, every pointer entry, every pointer low zero word, and every selected name byte; check following-byte and table-end non-credit; remove or change pointer relocations; add a relocation to a length slot; reject tags outside `0..=19`; recompute the sealed baseline union; and reject packet inventory, symlink, FIFO, resealed report, coverage, baseline, excerpt and provenance edits.

provider=OpenCode model=opencode/deepseek-v4.1-flash-free client=opencode CLI 1.19.5

Made via @slopdotcash
