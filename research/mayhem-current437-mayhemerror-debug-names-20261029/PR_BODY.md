## Summary

Counts the 20 `MayhemError` Debug unit-variant names on the qualified437 images. Original owner O0098 is `[196888, 197000)`; the normalized candidate is `[173568, 173680)`. The Debug body is shared by every tag: load the `u32` tag, scale by eight, index a relocated length table and pointer table, load the name pointer plus the table `u64` length, then call the shared `Formatter::write_str` helper. The 335 bytes were uncovered after the prior ProgramError Debug packet.

Package: `research/mayhem-current437-mayhemerror-debug-names-20261029/`.

## Evidence

| Input | SHA-256 |
| --- | --- |
| `evidence/original/mayhem/deployed.so` | `a87fa9f866272514e6acb852b668c4a08aeb173d56c883039991d114d1199bdb` |
| `research/mayhem-current437-composition-20261028/builds/first/symbols.so.gz` | `9c8c50857bfe8b80ebf08ebb50c905c6582676cb8e572d39f45de8647f62fbae` |
| `source-context/mayhem-error.rs` | `6399682f46db04af18d691dbcc2d7c78cca760d4f44f4de4cf12cb4820c823e9` |

The relation stays **437 normalized / 141 raw / 431 closed windows / 581 pairs**. Payload coverage moves from **19,239** to **19,574 / 26,180**. `.rodata` moves from **12,783** to **13,118 / 18,396**. `.data.rel.ro` stays **6,456 / 7,784**. No relocation-table bytes are added.

The length evidence is the `u64` in the length table at `713112 + tag*8` (candidate `693552 + tag*8`), not a mov immediate and not a NUL. Pointers come from the type-8 addend high 32 bits in the pointer table at `727696 + tag*8` (candidate `708136 + tag*8`). The counted intervals union to `[710331, 710438)`, `[710488, 710504)` and `[710712, 710924)` = 335 bytes. Length-table, pointer-table, and relocation-table bytes are not credited.

The reader stops before the unresolved writer call at `682176` / `615856`. It does not name the callback target beyond the checked `Formatter::write_str` helper, and it does not claim output or runtime behavior. Tags outside `0..=19` are rejected. No binary patch or whole-binary equivalence is claimed.

## Still open

`6,606` payload bytes remain. `[710712, 710924)` is now closed. The largest `.rodata` gaps are `[722392, 723755)`, `[713022, 714341)`, `[709739, 710331)`, `[719929, 720376)`, and `[708538, 708840)`. The length table `[713112, 713272)` and pointer table `[727696, 727856)` stay open and are not credited. Relocation and section layout are unchanged.

## Test plan

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-mayhemerror-debug-names-20261029/verify.py --repo .
PYTHONDONTWRITEBYTECODE=1 python3 -B research/mayhem-current437-mayhemerror-debug-names-20261029/test_verify.py
PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/verify_evidence.py
cd scripts && PYTHONDONTWRITEBYTECODE=1 python3 -B test_tooling.py
```

provider=OpenCode model=opencode/deepseek-v4.1-flash-free client=opencode CLI 1.19.5

Made via @slopdotcash
