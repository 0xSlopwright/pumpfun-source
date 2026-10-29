# Lane w4-buyv3 (wave 4): `trade::buy` (buy_v3) at 0x147ba0

Base: origin/main 630a07412 (1023 normalized / 277 raw). buy_v3 on base: 3680 B (original 3672 B), ratio 0.87739, 79 differing slots on the llc oracle.

## Result so far
| state | bytes | ratio | oracle slots | official |
|---|---:|---:|---:|---|
| base 630a07412 | 3680 | 0.87739 | 79 | 1023 / 277 |
| t03: fee-exempt test as a `v3_cross_ok` helper, `curve.is_mayhem_mode==false && *user!=global.whitelist_pda`, guard `amount>real && can_cross` | 3680 | **0.88414** | **72** | 1023 / 277, 0 losses |

## Mechanism (tools/rpo.py)
rustc creates LLVM blocks in first-reference order while it codegens MIR blocks in reverse postorder.
The postorder DFS visits successors last-first. A 2-target switchInt creates its case-0 target before `otherwise`; a switch with more targets creates `otherwise` first.
`rpo.py` rebuilds the CFG from rustc's unoptimized IR (`-C no-prepopulate-passes`) and reproduces the raw block order exactly. With `flip:BB` you can ask what a reversed switch would do.

Oracle findings (llc on the optimized IR, `tools/scan.py` moves one block to every position):
1. The umin block (bb8) must follow the partial_fill test (bb7), and the crossing block (bb6) must sit anywhere outside bb7..bb11. In MIR terms, the DFS has to reach the crossing chain from the memcmp path *before* bb7, which means the jump-threaded `exempt`/`can_cross` test must have the crossing block as its last successor. A `can_cross` spelled with `==false` on the mayhem flag does this (t03, t08, t14, t17). The `!x`, `if`, `match` and `!(a||b)` spellings do not (t02, t05, t06, t07, t15): MIR folds the `Not` away.
2. Side effect of (1): the mayhem switch also flips, so the mayhem-true block (`lifetime.end` of the key copy) now precedes memcmp. The oracle wants it after memcmp (`bb59>bb58`, worth 72 -> 51 together with 3). Under a 2-target switch this conflicts with (1), because creation order and DFS order are tied to the same target order. One way out is a forwarder block that MIR keeps and LLVM deletes.
3. The v3_buy_costs Err block (bb79) must come after the last error chain (bb84 / bb86) with ret last: 72 -> 51 on t03 IR, and 21 together with 2. A plain `?` creates it at the call's switch, so it is always early; making it empty (hoisting the +16 load) is worse (157 slots). The original most likely has the Err code in a block that is created late.

## Trials (all scored with score.py against the 630a07412 baseline)
| id | change | buy B | ratio | slots | losses |
|---|---|---:|---:|---:|---|
| t02 | helper `!mayhem && user!=wl` | 3680 | 0.87739 | 79 | 0 |
| t03 | helper `mayhem==false && user!=wl` | 3680 | 0.88414 | 72 | 0 |
| t04 | t02 with `can_cross && amount>real` | 3688 | 0.8764 | 80 | raw 0xa868 |
| t05 | `if mayhem {false} else {user!=wl}` | 3680 | 0.87739 | 79 | 0 |
| t06 | `!(mayhem || user==wl)` | 3680 | 0.87739 | 79 | 0 |
| t07 | `match mayhem {true=>false,false=>..}` | 3680 | 0.87739 | 79 | 0 |
| t08 | `mayhem!=true && user!=wl` | 3680 | 0.88414 | 72 | 0 |
| t09 | `!mayhem && (user==wl)==false` | 3680 | 0.87739 | 79 | 0 |
| t10 | `(mayhem || user==wl)==false` | 3680 | 0.87739 | 79 | 0 |
| t12 | base exempt + `exempt==false` guard | 3688 | 0.8764 | 80 | raw 0xa868 |
| t13 | exempt `mayhem==true || ..` | 3680 | 0.87739 | 79 | 0 |
| t14 | `if mayhem==false {user!=wl} else {false}` | 3680 | 0.88414 | 72 | 0 |
| t15 | `!(mayhem==true || user==wl)` | 3680 | 0.87739 | 79 | 0 |
| t16 | t13 + `exempt==false` guard | 3688 | 0.8764 | 80 | raw 0xa868 |
| t17 | `mayhem==false && !(user==wl)` | 3680 | 0.88414 | 72 | 0 |
