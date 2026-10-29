# Qualified437 ProgramError Debug counted unit-variant names

This packet counts **25 static unit-variant Debug names totaling 494 bytes**, selected by `ProgramError as core::fmt::Debug` `fmt`. Original owner O0052 is `[38832, 39952)` = 1,120 bytes. The symbol is `_ZN71_$LT$solana_program_error..ProgramError$u20$as$u20$core..fmt..Debug$GT$3fmt17h6c1b6a595146bf75E`. Both active candidate owners, `38832` and `552232`, carry the same path offsets and counted bytes but different `.rodata` pointers. Both call writer `615824`.

The prior data obligations are preserved. The relation remains **437 normalized functions, 141 raw functions, 431 closed windows and 581 candidate pairs**. This packet adds data evidence, not a function match.

## Source and bounded paths

The packaged `solana-program-error` 3.0.1 archive is checked against the qualified437 source archive's Cargo.lock checksum. Its native `ProgramError` enum has 26 variants and derives `Debug`; there is no hand-written `Debug` implementation. The proof checks the saved-image paths for observed tags 1 through 25 and associates them with variants `InvalidArgument` through `IncorrectAuthority`, in the same order as the enum after `Custom`. These tags describe the observed compiler layout and are not a stable Rust enum ABI claim.

The `Custom(tag 0)` path is excluded. Its instructions at owner offsets 616 through 704 and its referenced data are not counted. The `TryFromIntError` name `[709224, 709239)` and the bare `"Custom"` literal `[709239, 709245)` are also excluded. The counted intervals union to the single contiguous span `[709245, 709739)`.

The interpreter admits only the unit-path grammar: the enum-tag load, binary-search jumps on the tag, the formatter-argument move, one relocated `.rodata` pointer load, one immediate length, jumps, and the shared direct `Formatter::write_str` call. Tags 3, 6, 23 and 25 share the length move at owner offset 968 with immediate 18. The original writer call target is `682144` at owner offset 976, with the shared exit at 984.

The matched 48-byte `Formatter::write_str` helper loads the formatter data and callback table while leaving r2 (string pointer) and r3 (length) unchanged. Its exact instructions and callback slot/register are checked. Observation stops before the unresolved writer call at original `682176` / candidate `615856`. No callback target beyond the checked writer helper, output, allocator behavior, or runtime effect is claimed.

Every selected interval lies inside `.rodata`, contains no relocation, and is bounded by its immediate length. A NUL, the following byte, and an adjacent string are not bounds. Pointer addresses may differ between the two candidate owners; the counted bytes must equal the counterpart and the native variant name. The untraced offsets are the `Custom` path and the final exit. No binary patch or whole-binary equivalence is claimed.

## Coverage

The baseline is the prior MayhemError Display packet at **18,745 / 26,180** payload bytes (`.rodata` 12,289 / 18,396, `.data.rel.ro` 6,456 / 7,784).

These names were disjoint from that baseline. Payload coverage becomes **19,239 / 26,180 bytes (73.49%)**, leaving **6,941 unproved**. `.rodata` becomes **12,783 / 18,396**. `.data.rel.ro` stays **6,456 / 7,784**. The 25 counted intervals union to `[709245, 709739)` = 494 bytes. No relocation-table byte is credited.

## Still open

The complement of `coverage-delta.json` remains open: **6,941 payload bytes**. The largest `.rodata` gaps include `[722392, 723755)`, `[713022, 714341)`, and `[709739, 710440)`. Beside these strings, `[710712, 710924)` and `[711407, 711412)` are still open, as is the excluded `TryFromIntError` / `"Custom"` span `[709224, 709245)`. The `.data.rel.ro` gaps are unchanged. Relocation and section layout are unchanged.

## Verification

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-programerror-debug-names-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-programerror-debug-names-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/verify_evidence.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/test_tooling.py
```

Run the last command from `scripts/`, or with `PYTHONPATH=scripts`.

Tests mutate every selected name byte and every length and pointer immediate for both candidate owners. A payload or pointer change keeps the normalized pair, then drops the owner and its dependents. A length change drops the normalized window. The excluded tag 0 and the excluded `TryFromIntError` / `"Custom"` bytes are not absorbed. The following byte is not absorbed. Tag 0 and tag 26 are rejected. The writer slot and the shared length move are exact. Inventory, symlink, FIFO, and resealed report, coverage, and excerpt edits are rejected.

## Exact intervals

Ends are exclusive. Pointer and length offsets are relative to each owner start. The candidate copies have the same lengths, offsets and bytes; only their `.rodata` addresses differ.

| Tag | Variant | Original interval | Length | Pointer / length offsets |
| --- | --- | --- | ---: | --- |
| 1 | `InvalidArgument` | 709245–709260 | 15 | 192 / 208 |
| 2 | `InvalidInstructionData` | 709260–709282 | 22 | 992 / 1008 |
| 3 | `InvalidAccountData` | 709282–709300 | 18 | 744 / 968 |
| 4 | `AccountDataTooSmall` | 709300–709319 | 19 | 400 / 416 |
| 5 | `InsufficientFunds` | 709319–709336 | 17 | 1056 / 1072 |
| 6 | `IncorrectProgramId` | 709336–709354 | 18 | 560 / 968 |
| 7 | `MissingRequiredSignature` | 709354–709378 | 24 | 296 / 312 |
| 8 | `AccountAlreadyInitialized` | 709378–709403 | 25 | 800 / 816 |
| 9 | `UninitializedAccount` | 709403–709423 | 20 | 56 / 72 |
| 10 | `NotEnoughAccountKeys` | 709423–709443 | 20 | 864 / 880 |
| 11 | `AccountBorrowFailed` | 709443–709462 | 19 | 488 / 504 |
| 12 | `MaxSeedLengthExceeded` | 709462–709483 | 21 | 920 / 936 |
| 13 | `InvalidSeeds` | 709483–709495 | 12 | 712 / 728 |
| 14 | `BorshIoError` | 709495–709507 | 12 | 248 / 264 |
| 15 | `AccountNotRentExempt` | 709507–709527 | 20 | 1024 / 1040 |
| 16 | `UnsupportedSysvar` | 709527–709544 | 17 | 768 / 784 |
| 17 | `IllegalOwner` | 709544–709556 | 12 | 448 / 464 |
| 18 | `MaxAccountsDataAllocationsExceeded` | 709556–709590 | 34 | 1088 / 1104 |
| 19 | `InvalidRealloc` | 709590–709604 | 14 | 584 / 600 |
| 20 | `MaxInstructionTraceLengthExceeded` | 709604–709637 | 33 | 344 / 360 |
| 21 | `BuiltinProgramsMustConsumeComputeUnits` | 709637–709675 | 38 | 832 / 848 |
| 22 | `InvalidAccountOwner` | 709675–709694 | 19 | 128 / 144 |
| 23 | `ArithmeticOverflow` | 709694–709712 | 18 | 896 / 968 |
| 24 | `Immutable` | 709712–709721 | 9 | 528 / 544 |
| 25 | `IncorrectAuthority` | 709721–709739 | 18 | 952 / 968 |

provider=OpenCode (Zen) model=opencode/glm-5.3-flash-free client=opencode CLI 1.19.5

Made via @slopdotcash
