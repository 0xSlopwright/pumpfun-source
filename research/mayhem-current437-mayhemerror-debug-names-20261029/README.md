# Qualified437 MayhemError Debug counted unit-variant names

This packet counts **20 static MayhemError Debug unit-variant names totaling 335 bytes**, selected by `MayhemError as core::fmt::Debug` `fmt`. Original owner O0098 is `[196888, 197000)` = 112 bytes. The normalized candidate is `[173568, 173680)`, symbol `_ZN66_$LT$mayhem_recovered..MayhemError$u20$as$u20$core..fmt..Debug$GT$3fmt17h68b586be249ea759E`.

The prior data obligations are preserved. The relation remains **437 normalized functions, 141 raw functions, 431 closed windows and 581 candidate pairs**. This packet adds data evidence, not a function match. No whole-ELF or whole-binary equality is claimed.

## Source and shared grammar

The sealed `src/lib.rs` enum `MayhemError` has 20 variants with explicit discriminants 0 through 19; the Debug names are the Rust variant identifiers. Those tags describe the observed compiler layout, not a stable Rust enum ABI.

The Debug body is thin and identical for every tag; it does not use ProgramError's binary search or mov immediates:

1. `mov64 r4, r2` saves the formatter.
2. `ldxw r1, [r1+0]` loads the `u32` tag.
3. `lsh64 r1, 3` scales the tag by eight.
4. A type-8 `lddw r3, <length table>` loads base `713112` (candidate `693552`), then `add64 r3, r1`.
5. A type-8 `lddw r2, <pointer table>` loads base `727696` (candidate `708136`), then `add64 r2, r1`.
6. `ldxdw r2, [r2+0]` loads the name pointer. The in-place relocation addend carries the address in its high 32 bits, low 32 bits zero.
7. `ldxdw r3, [r3+0]` loads the `u64` name length from the length table. **This table value is the length evidence**, not a NUL and not a guessed bound.
8. `mov64 r1, r4` restores the formatter and calls the shared `Formatter::write_str` helper at original `682144` / candidate `615824`, then exits.

The interpreter checks every instruction in the 112-byte body, both type-8 relocations, both table entries, and rejects tags outside `0..=19`. Every tag visits all twelve instruction starts; the `lddw` continuation words at offsets 32 and 56 are not instructions. The matched 48-byte writer loads formatter data at `+0` and the callback table at `+8` while leaving r2 and r3 unchanged. Observation stops before the unresolved writer call at original `682176` / candidate `615856`. No callback target beyond the checked writer helper, output, allocator behavior, or runtime effect is claimed.

Only `.rodata` name bytes bounded by the length-table `u64` and a relocated pointer are counted. Length-table bytes `[713112, 713272)`, pointer-table bytes `[727696, 727856)`, and relocation-table bytes are not credited. A NUL, the following byte, and an adjacent string are not bounds. Pointer addresses differ between images; the counted bytes must equal the counterpart and the native variant identifier.

## Coverage

The baseline is the prior ProgramError Debug packet at **19,239 / 26,180** payload bytes (`.rodata` 12,783 / 18,396, `.data.rel.ro` 6,456 / 7,784).

These names were disjoint from that baseline. Payload coverage becomes **19,574 / 26,180 bytes (74.77%)**, leaving **6,606 unproved**. `.rodata` becomes **13,118 / 18,396**. `.data.rel.ro` stays **6,456 / 7,784**. The counted intervals union to `[710331, 710438)`, `[710488, 710504)` and `[710712, 710924)` = 107 + 16 + 212 = **335 bytes**. No relocation-table byte is credited.

## Still open

The complement of `coverage-delta.json` remains open: **6,606 payload bytes**. `[710712, 710924)` is now closed. The largest `.rodata` gaps are `[722392, 723755)`, `[713022, 714341)`, `[709739, 710331)`, `[719929, 720376)`, and `[708538, 708840)`. The length table `[713112, 713272)` stays open inside `[713022, 714341)`, and the pointer table `[727696, 727856)` stays open inside `.data.rel.ro` gap `[727696, 727880)`. Neither table is credited. Relocation and section layout are unchanged.

## Verification

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-mayhemerror-debug-names-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-mayhemerror-debug-names-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/test_tooling.py
```

Run the last command from `scripts/`, or with `PYTHONPATH=scripts`.

Tests mutate every selected name byte **and every length-table `u64` and pointer-table entry for the candidate owner**. A byte or pointer change keeps the normalized pair, then drops the owner and its dependents. A length-table change drops the owner pair. Tags -1 and 20 are rejected. The writer slot and callback register are exact. Inventory, symlink, FIFO, and resealed report, coverage, and excerpt edits are rejected.

## Exact intervals

Ends are exclusive. Candidate copies have the same lengths and bytes; only their `.rodata` addresses differ. Both tables are indexed by tag at `tag * 8`.

| Tag | Variant | Original interval | Candidate interval | Length |
| --- | --- | --- | --- | ---: |
| 0 | `TradingPaused` | 710331–710344 | 692704–692717 | 13 |
| 1 | `TradingActive` | 710344–710357 | 692717–692730 | 13 |
| 2 | `MathOverflow` | 710357–710369 | 692730–692742 | 12 |
| 3 | `SolReservesTooLow` | 710369–710386 | 692742–692759 | 17 |
| 4 | `MayhemModeEnded` | 710386–710401 | 692759–692774 | 15 |
| 5 | `MayhemModeNotEnded` | 710401–710419 | 692774–692792 | 18 |
| 6 | `OverallRiskExceeded` | 710419–710438 | 692792–692811 | 19 |
| 7 | `CoinRiskExceeded` | 710488–710504 | 691200–691216 | 16 |
| 8 | `PumpCpiFailed` | 710712–710725 | 692811–692824 | 13 |
| 9 | `PumpCpiMathOverflow` | 710725–710744 | 692824–692843 | 19 |
| 10 | `PumpSwapCpiFailed` | 710744–710761 | 692843–692860 | 17 |
| 11 | `PumpSwapCpiMathOverflow` | 710761–710784 | 692860–692883 | 23 |
| 12 | `PumpCpiSlippage` | 710784–710799 | 692883–692898 | 15 |
| 13 | `PumpSwapCpiSlippage` | 710799–710818 | 692898–692917 | 19 |
| 14 | `WithdrawRateLimit` | 710818–710835 | 692917–692934 | 17 |
| 15 | `TradeRateLimit` | 710835–710849 | 692934–692948 | 14 |
| 16 | `AccountTypeNotSupported` | 710849–710872 | 692948–692971 | 23 |
| 17 | `MaxFeeRecipientsExceeded` | 710872–710896 | 692971–692995 | 24 |
| 18 | `InvalidBump` | 710896–710907 | 692995–693006 | 11 |
| 19 | `SweepFeeRateLimit` | 710907–710924 | 693006–693023 | 17 |

provider=OpenCode model=opencode/deepseek-v4.1-flash-free client=opencode CLI 1.19.5

Made via @slopdotcash
