# Lane brute-force-grammar (AMM sell swarm, wave 2)

Approach: combinatorial grammar of line-preserving micro-spellings over `fn cashback`
(`grammar.py`: sites -> alternatives; every error macro stays on its line, checked by
`grammar.check`), driven by `search.py` (singles / list / beam) through `harness/try_sell.py`.

## Key finding: Difference 1 (borrow test) is fixed by the owner check spelling

Line 444 `require!(*user_volume_accumulator.owner == crate::ID, E);` ->
`if *user_volume_accumulator.owner != crate::ID { return err!(PumpAmmError::InvalidCashbackAccumulator); }`
(also `owner != &crate::ID`) reproduces the original borrow test bit-for-bit at the original
offsets: `jeq r2,r3,+1 ; ja +201 -> 0x1358`. The whole window then matches structurally up to
sell+0x1ae8; only Difference 2 (ATA data_is_empty / try_from_unchecked block placement) remains,
and the window is 9032 bytes (+8), which shifts rodata so align_distance reads 186.

`require!(!(a != b))`, `if !(a == b)`, `require!(a.eq(b))`, `require!(a == b)` all keep JNE: it is
the `!=` (`PartialEq::ne`) spelling - the MIR SwitchInt target order of the owner test - that
changes the creation order of later blocks.

`best_sell.rs` = pristine + that one line.
