# Lane v3costs-semantic-reorder: `trade::v3_buy_costs` (original 0x80df8, 2,120 B)

## Result so far

| Build | Bytes | win.py ratio | diff lines (-/+) | calls | normalized / raw |
| --- | ---: | ---: | ---: | ---: | --- |
| origin/main (d2cb88d, control rebuilt byte-identical) | 2,056 | 0.788 | 56 / 48 | 17 | 1019 / 188 |
| seq-split (sequential `protocol_fee_split`) | 2,136 | 0.896 | 25 / 27 | 17 | 1019 / 188 |
| seq-split-iflet (+ `if let` second, keeps `gross_up_quote` helper) | 2,128 | 0.914 | 21 / 22 | 17 | 1019 / 188 |
| **cost-second-if-port** (proposed source) | 2,136 | **0.916** | 20 / 22 | 17 | 1019 / 188 |

No gains, no losses. Collateral windows 0x83c00 (3,408 B, 0.733) and 0x147ba0 (3,800 B, 0.544) are unchanged.

## Mechanism

1. `let buyback=protocol_fee_split(..).0; let post_buyback=match post{..}` (two sequential inlined
   calls, each testing `is_mayhem` itself) reproduces the original's mayhem block at 0x81018, which
   sets buyback/post_buyback to 0 and *tests `post`* to build the `post.is_none()` flag (r3 -> r9)
   that the later `second` branch uses. Main's `if is_mayhem==0 {(..)} else {(0,0)}` precomputes
   r8=r9=0 before the branch and retests the pointer later.
2. `if let Some(p)=post {add3(..)?} else {0}` removes one jump.
3. Writing `pre_fee_amount(..)?` and `checked_sub(..).ok_or_else(gross_up_quote_error)?` directly
   in the body (instead of the inline `gross_up_quote` helper) keeps the pre-fee error and the
   gross-up error out of one IR phi, which restores the original's `ldxdw r1; ldxdw r2` order after
   the `gross_up_quote_error` call.

## Residual (all register allocation of the sret pointer)

* The original spills the sret pointer immediately at entry (0x80e08) and reloads it into r3 at
  each use (common error tail 0x814a8 and the Ok tail 0x815b8): it is spilled everywhere, unsplit.
* The candidate splits it: the spill moves after `and64 r3, 0xff`, and a reload into callee-saved
  r6 is hoisted before the net-overflow branch. Because of that, the pre-fee Err path needs a
  duplicate `ldxdw r2,[r10-0x110]; ja` block instead of reusing the shared one at 0x811e8.
* The line-375 error block loads word1 before word0 in the original; the candidate loads word0
  first (identical to its line-371 block).

Pre-RA MIR (diagnostic capture only) shows each error path still storing to the sret pointer in
its own block, so the greedy allocator's split/spill choice is what differs.

## Ledger attempt ids

* 4ef82d6fd3994617a7e57ccdbddf3516 seq-split
* 110f98554d1642ea9a8bee5385be8795 seq-split-iflet
* e22ca48debf745a0b213565c16a85219 cost-second-if-port
