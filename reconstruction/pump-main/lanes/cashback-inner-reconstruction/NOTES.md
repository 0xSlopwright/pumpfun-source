# Lane cashback-inner-reconstruction

Target: original window `0x6cd78` (8,544 B), `legacy_sell::process_cashback_inner`
(`programs/pump/src/sell.rs:19`).

## Metrics (target_metric.py / score.py)

| build | cand bytes | ratio | callees in orig order | official normalized / raw | gains / losses |
| --- | ---: | ---: | --- | --- | --- |
| baseline d2cb88d | 8,816 | 0.7354 | no (line-85 error inlined, to_string inlined) | 1019 / 188 | - |
| this branch | 8,584 | 0.7611 | yes, all 58 | 1019 / 188 | none / none |

## Mechanism

1. The original calls `Account::try_from_unchecked`, not `try_from`, after `transfer_native`
   (callee window resolves to `try_from_unchecked`). Diagnostic ratio is unchanged by this alone.
2. The existing-account check is inline in the `else` branch, not a nested `check_existing`
   function. With the nested function LLVM inlines `ToString::to_string` at the line-85 site
   (the original keeps it as a call) and adds a Result re-test (`== 2`) after the helper's error
   merge, which the original does not have. `#[inline(always)]` on the helper fixes the
   `to_string` call but keeps the re-test.
3. With the check inlined, the else head was laid out first. Cause (found with diagnostic
   LLVM flags in an experiment copy only): BPF `analyzeBranch` cannot analyze conditional
   branches, so a block ending in a conditional branch that falls through is glued to its
   layout successor. In the inline version the empty error-return merge block that sat between
   the `data_is_empty` branch block and the else head is removed by early tail duplication, so
   the branch falls through into the else head. The original shows `jne r0,0,+1; ja else`,
   i.e. unglued. `-disable-early-taildup` reproduced the original order (ratio 0.7605).
4. A source change that achieves it: write the line-33 key check as
   `if key != expected { return err!(...) }` together with the `if len < 8 || disc != ... { return err!(...) }`
   discriminator check. All 58 callees then appear in original order.

## Remaining residuals

- 40 B (5 slots) larger. Stack frame has one extra 8-byte slot (offsets -0x1e0 vs -0x1d8 early in the frame).
- Register allocation and spills differ in the `CpiContext::new(system_program.clone(), Transfer{from: user.clone(), to: uva.clone()})`
  clone sequence (orig +0xc68..0xdb0), plus the first instruction (`mov r6, r2` vs `mov r7, r2`).

Ledger attempt ids: 92dba45b (try_from_unchecked), b02ee191/143f1c62 (inline else), b7fe3455 (inline(always)),
1adf199b (early-taildup diagnostic), ada66214 (this result); sweep rows for 0x6cd78 by lane cashback-inner-reconstruction.
