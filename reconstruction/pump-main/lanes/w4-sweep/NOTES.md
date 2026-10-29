# w4-sweep: 0x72810 `sweep::execute`

Base: origin/main 630a074 (1023 normalized / 277 raw). Target: 7,832 B, 39 direct calls.

| metric | base (main, a23) | a37 (w3 near-match) | p1 (this PR) |
|---|---|---|---|
| ratio (target_metric) | 0.49139 | 0.78830 | **0.82199** |
| structural ratio (regs + stack masked, llc oracle) | 0.8805 | 0.8926 | **0.9403** |
| cand bytes (orig 7832) | 7824 | 7528 | 7768 |
| direct calls (orig 39) | 39 | 40 | **39** |
| stack operands at original offset | ~50 | 370 | **398 / 403** |
| official normalized / raw | 1023 / 277 | 1023 / 276 | 1023 / 276 |
| gains / losses | - | raw 0xa868 | raw 0xa868 (call-span drift, see below) |
| unstripped sha256 | 5d661a63.. | d010211c.. | cc82d04c55efda15d3f5df34b54307cd49183e408d34466597d8246b06a8ed69 |

## Mechanism

a37 (token code and quote keys inline in execute, so the frame matches) had 40 calls because
the shared rent/token join's `AccountInfo::clone` had pre-inline block frequency 1.469% of
entry (< ColdCallSiteRelFreq 2%), so it stayed out of line.

- Merging the two admit errors inside execute (`match admit1 {Ok=>admit2,Err(e)=>Err(e)}?`,
  `admit1.and_then(|()| admit2)?`) does not help: MIR JumpThreading threads the `Err` constant
  through the merge, so the pre-inline CFG still has two independent halvings (0.01469).
- p1 keeps `quote_mint`, `quote_token_program`, `quote_mint_info`, `quote_token_program_info`
  as execute locals (their allocas stay mid-frame in MIR-local order), and moves only the two
  `admit_associated_token_account` calls into an `#[inline(always)]` helper taking them by
  reference. The helper is too big for the MIR inliner, so it is LLVM-AlwaysInlined: its Result
  return is a phi that the later `?` re-splits 50/50, and the join's frequency becomes 0.02337
  (>= 2%). The join clone is inlined: 39 calls. Its only new allocas are the by-value Pubkey
  copies, which colour onto the original's slots.
- With the second admit as the helper's tail expression (or `let r=admit1(..);r?;`), the
  bonding-curve `to_account_info()` temporary is dropped before the first admit's error branch,
  as in the original (+0xe88..+0xf20). With `admit2?; Ok(())` the drop is duplicated per edge
  (0.747).

## Raw membership 0xa868

0xa868 (`<&T as Debug>::fmt`, 24 B) is a raw match only through call displacement: its tail call
crosses sweep::execute, and it matches raw only when sweep is exactly 7824 B (base). Any sweep size
change (a37 7528, h1 7864, p1 7768, and the original's own 7832) loses it until the other +8 B
drift in that span is fixed.

## Residuals (p1, structural diff vs original)
1. Admit branch polarity: original first admit `jeq r1,2,+1; ja err`, second `jne r1,2,err`;
   p1 has them the other way round.
2. Rent::get error: original places the `From<ProgramError>` block after the protocol-native
   clone (+0x14b0, reached by `jne r1,0` at +0x12c8, Rent copied to -0xd0 first); p1 calls From
   right after Rent::get.
3. Some field load orders (+0x10/+0x58/+0x30) at the join and in the protocol-native copy.

IR block-move scans (blk.py) on p1 give at most 5 fewer structural lines; the residuals are not
block order alone.
