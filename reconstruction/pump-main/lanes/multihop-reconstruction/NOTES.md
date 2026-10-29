# Lane multihop-reconstruction: 0x5b3b0 `multi_hop_curve::swap_hop`

Base: origin/main 016a11c7f (includes #1197 callgraph-census, which already carries the
`constant_product::tokens_for_quote` and `trade::sub3` helper calls first proposed by outside
contributor hongikAn in draft PR #1164 `codex/pump-multihop-token-quote`; that work is credited and
not redone here).

## Metrics

`exact` = win.py / target_metric ratio (normalized tokens, so register, stack-offset and jump
differences all count). `opregs` / `op` = the same difflib alignment over (opcode, regs byte) and
opcode only (`shape.py`): they track block order and instruction selection without the stack-frame
noise that dominates `exact` while the frame layout differs.

| build | bytes (orig 18,584) | calls (orig 107) | callee multiset diff | exact | opregs | op |
|---|---:|---:|---|---:|---:|---:|
| main 016a11c (t0) | 19,024 | 108 | clone 11 vs 10 | 0.2229 | 0.4645 | 0.5491 |
| t1 cap before trade_amount | 19,032 | 108 | clone 11 vs 10 | 0.2186 | 0.5702 | 0.6190 |
| t2 + early seeds, clone-free validate | 18,456 | 107 | **none** | 0.1461 | 0.5445 | 0.6828 |
| v546b + if/else-if `buy` at :546 | 18,504 | 107 | none | 0.1319 | 0.5968 | 0.6499 |
| v546btB + completion nested after TradeEvent (PR v1) | 18,360 | 107 | none | 0.1456 | 0.6436 | 0.7378 |
| w1 + post_out join, user key hoisted | 18,360 | 107 | none | 0.1456 | 0.6476 | 0.7396 |
| br1 + per-arm transfer/apply/payout | 18,336 | 107 | none | 0.1457 | 0.6555 | 0.7392 |
| **br3 + TradeFees as an arm-result element** (in source) | 18,376 | 107 | none | 0.0915 | **0.6574** | 0.7370 |

Official score of every build: normalized 1020 / raw 188 vs the d2cb88d baseline (gain 0x14f4e0
is main's), losses none. In-source build (br3) unstripped sha256
`8c4483af3d99afaa20a761fbb841a854caeac5c283aa93765081a2014d772702`.

The exact ratio falls because the stack frame shifted (every `[r10 - X]` differs); the call
sequence, error-site order, closure order and block order are all much closer.

## Evidence (original disassembly, offsets from 0x5b3b0)

Callee sequence with each callee's own Source lines resolved (`origlines.py`, `calls.py`):
closures in original physical order are 571, 673, 692, 589, 744, 624, 736.

1. `fee_config.to_account_info().data_len()` and `buy_fee_market_cap` (0x16f0, 0x17b0) run before
   the buy-only `post_fee_amount(&quote_fee, amount)` (0x18e8): ours computed trade_amount first.
2. 0x1590..0x1700: a temporary `base_mint` AccountInfo clone, then the `[b"bonding-curve", key, &bump]`
   seed slice is written from `clone.key` (lddw "bonding-curve", len 0xd, len 0x20, len 1, bump byte),
   then the clone is dropped, all before the fee_config clone + data_len. So
   `let mint_key = h.base_mint.to_account_info().key; let bump = ..; let seeds = ..;` sits right after
   the :546 check (this is the callgraph-census t6 idea, now placed where the original has it).
3. `validate_buyback_fee_recipient_account` (0x11f8) gets r3 = `a.buyback_fee_recipient` AccountInfo
   pointer, r4 = 0, quote mint = 32-byte copy of `h.quote_mint.key()`, token program = 32-byte copy of
   the key of the `token_program_for` result (`[r10-0xac8]` is that AccountInfo's key pointer). No clones.
4. :546: first memcmp equal -> happy path; second memcmp equal -> happy path; the error block is the
   fallthrough. An `if .. {true} else if .. {false} else {return err!}` chain reproduces that.
5. Tail: after the TradeEvent CPI the original re-reads the curve's `real_token_reserves` (0x36e0,
   `ldxdw [curve+0x58]`, no `buy` test), and only in that branch stores `complete = 1` (0x38c0),
   emits CompleteEvent, then tests `post_fill` (0x3df8: None jumps to the HopOutput block). So the
   post-complete emission is nested inside the completion branch and the complete flag is written
   after the TradeEvent. (TradeEvent does not read `complete`.)

6. Buy arm (orig 0x2848, 0x2b58, 0x2c30): no `capped = min(..)`; the over-reserves arm yields
   `real_token_reserves` plus `post.base_out` (0 when `complete_fill` returns None, and 0 on the
   base <= reserves path) into one join doing `checked_add` (the :624 closure). `a.user.key()` and the
   global pointer are loaded before the mayhem test (0x22c0), so the memcmp block is 9 insns.
7. Each arm ends with its own transfer, apply and payout, then the join computes the transfer-fee
   difference (`r8 - [a70]` sell, `[a78] - r9` buy) and stores post_fill = None on the sell side.
8. The accrue_fees join copies a 64-byte aggregate whose first 32 bytes are
   `TradeFees{pf, cf, p_bps, c_bps}` (accrue_fees r4/r5 come from it) and trade_event's `fees`
   pointer is that copy (-0x730): the arms return a TradeFees value.

## Trials (ledger dedupe keys `0x5b3b0-main-016a11c-<key>-v1`)

| trial | key | result |
|---|---|---|
| t1 | hoist-cap-before-trade-amount | aligned calls 86 -> 93; partial (07bee23e) |
| t2 | early-seeds-clone-key-and-validate-quote-program-key | callee multiset identical; partial (654711e5) |
| v546a | discontinuous-check-if-not-buy-err | byte-identical to t2 (a161a826) |
| v546b | discontinuous-check-if-else-chain-let-buy | :546 error fallthrough as orig (61c3693b) |
| v546c | discontinuous-check-base-first-require | both memcmps unconditional, not orig (e4000a5b) |
| v546btA | completion-nested-after-trade-event-precomputed-bool | little change (20170f7e) |
| v546btB | completion-nested-after-trade-event-fresh-reserves-check | **kept** (e99be158) |
| v546ctB | completion-nested-on-base-first-require | exact 0.2115 but op 0.709 (979c910a) |
| ck1 | admit-vaults-single-curve-key-binding | admit region aligns insn-for-insn but native require_ata block moves and 43 insns of cleanup merge: 18,016 B; not kept (82610c19) |
| ck2/ck3 | admit-vaults-native-first-branch | byte-identical to their bases (e3ceca87) |
| mid1 | buy-post-out-join-checked-add-624 | opregs 0.6467 (1bb84685) |
| w1 | whitelist-check-user-key-hoisted | memcmp block 9 insns as orig, kept (14fadab4) |
| w2/w3 | whitelist-check-operands-swapped / negated-or | no change / identical (f6d2b86c, 5515fca6) |
| br1 | per-branch-transfer-apply-payout | opregs 0.6555, kept (91047878) |
| br2 | post-fill-as-branch-tuple-element | 18,616 B but op 0.687; not kept (d0950ac5) |
| br3 | trade-fees-struct-in-branch-tuple | opregs 0.6574, 590/599 sites separate, kept (1e4eab9e) |
| br3b | complete-fill-fees-bps-into-tuple | no gain, changes semantics (0a245ba2) |

## Remaining large regions (opregs alignment, v546btB)

- Buy-arm block placement: orig lays the buy chain (589 test, base==0, base>reserves, mayhem,
  err599) between the sell `transfer_quote_out` and the accrue join, and makes `complete_fill` the
  fallthrough of the whitelist memcmp; ours lets the sell chain fall into accrue_fees and the memcmp
  fall into err599.
- The orig 64-byte arm-result copy at the accrue join (ours copies less: SROA splits the tuple).
- post_complete_buy_event call block placed before the HopOutput block in orig, after the
  `From<ProgramError>` error block in ours.
- admit_vaults: orig copies the curve key once and reuses it (see ck1), but binding it moves the
  native `require_ata` block; the right spelling is still open.

## Round 2 (rebased on main b8d494168)

New metric `seg.py`: align the orig/candidate call sequences by callee name, then sum the
(opcode, regs) and (masked-jump, full-operand) edit distances of the instruction segments
between consecutive aligned calls. It is local, so it does not flip with global difflib
alignment, and it falls monotonically along the round-1 chain (t1 1447, v546b 1334, v546btB 1224,
w1 1177, br1 1147, br3 1132). Lower is better.

| build | bytes | exact | opregs | op | aligned calls | segdist opregs / exact |
|---|---:|---:|---:|---:|---:|---:|
| r0 = br3 rebased | 18,376 | 0.0915 | 0.6574 | 0.7370 | 100 | 1132 / 1886 |
| ar1 named ArmResult destructured | identical swap_hop | | | | | |
| ar2 ArmResult kept whole, field access | 18,384 | 0.1455 | 0.6494 | 0.7259 | 100 | 1140 / 1888 |
| wl1 two requires on line 599 | 18,624 | 0.0909 | 0.6534 | 0.7343 | 100 (110 calls) | 1186 / 1934 |
| wl2 if/else-if return err 599 | 18,560 | 0.0911 | 0.6519 | 0.7320 | 100 (110 calls) | |
| te1 trade_event mint = &h.base_mint.key() | 18,464 | 0.0904 | 0.6550 | 0.6918 | 100 | 1151 / 1893 |
| te2 te1 + Complete/Post events | 18,488 | 0.1802 | 0.6532 | 0.6909 | 100 | 1152 / 1904 |
| **mac1 emit expansion as `macro_rules! route_event!`** (in source) | 18,328 | **0.2435** | **0.6913** | **0.7684** | **101** | **991 / 1728** |

| pe1 mac1 + post event: post by value, mint = h.base_mint.key() | 18,376 | 0.1873 | 0.7040 | 0.7788 | 101 | 964 / 1716 |
| pe2 mac1 + post event: post by value | 18,352 | 0.2112 | 0.7001 | 0.7745 | 101 | 973 / 1687 |
| pe3 mac1 + post event mint = h.base_mint.key() | 18,352 | 0.1839 | 0.6953 | 0.7727 | 101 | 982 / 1735 |
| **pf1 mac1 + deferred `let post_fill;`, None on each no-post path** (in source) | 18,272 | 0.2148 | **0.7233** | **0.8071** | 101 | **903 / 1628** |
| pf2 sell checked_sub moved after payout | LOSS (1019 normalized) | | | | | |
| pfpe1 / pfpe2 pf1 + pe1 / pe2 | identical to pe1 / pe2 | | | | | |
| tp1 pf1 + trade_event mint = &h.base_mint.key() | 18,368 | 0.2142 | 0.7218 | 0.8071 | 101 | 917 / 1628 |
| tp2 pf1 + CompleteEvent mint = h.base_mint.key() | 18,296 | 0.1860 | 0.7276 | 0.8096 | 101 | 868 / 1648 (mixed) |

te2 shows why `exact` alone misleads: it doubles while every structural metric gets worse.

### mac1 mechanism
Ours had `#[inline(always)] fn route_event<E>(..) -> Result<()>` holding the literal
emit!/emit_cpi! expansion, called as `route_event(..)?`. After inlining, the Ok and Err paths
of `invoke_signed(..).map_err(Error::from)?` both ran the `authority_info` drop and met in one
block that re-tested the Result (`jne r1, 2`) before the caller's `?`. The original tests the
invoke result once, right after the call (orig 0x3d70), with separate drop sequences per path,
the way it comes out when the `?` returns from swap_hop itself. A `macro_rules! route_event!`
with the same statements does that. The post_complete_buy_event call moves to the original
position, and the stack frame offsets go from +248/+264 to mostly +8/+24 against the original.

### IR oracle (tools in this directory)
`capir.py` builds a scratch crate copy with `--emit=link,llvm-ir -Zfewer-names` (code unchanged,
same sha), `extract.py` cuts swap_hop out of the module (other functions become declarations,
aliases dropped), and `llc -O3 -mtriple=sbf -mattr=+store-imm,+jmp-ext` on that reproduces the
build's swap_hop exactly in about 0.5 s. `reorder.py` moves IR blocks (`X>Y`), inverts branches
(`inv:B`) or sets weights (`prof:B:t,f`), then scores with `qcmp.py`/`seg.py`.
Result: about 1,000 of the 2,640 single block moves in the buy arm (764..953 after 557..1010; sweep stopped early), plus
inversions and weights on the whitelist/mayhem/reserve branches (841, 857, 821, 813). None of
them improves the call-order alignment (best opregs +0.003, calls never above 100). The
remaining buy-arm placement (mayhem test falling through into the 599 error, memcmp block
after the buy transfer_input) does not come from IR block order or the weights of those
branches.

### pf1 mechanism
The original stores the post-fill flag = 0 at the sell join after the last-hop
`transfer_quote_out` (orig 0x2450) and on the two buy no-post paths (0x2848, 0x2c30). It does not
store it as an initial `None` that LLVM sinks to before the payout test. Declaring
`let post_fill;` and assigning `None` at the end of the sell arm and in both buy no-post branches
(and `Some(post)` in the complete_fill branch) reproduces that. complete_fill now sits in the
original call order (only memcmp and the 736 closure stay swapped). The win.py ratio falls
0.2435 -> 0.2148 because the frame shifts, but every structural metric improves a lot.
Post-event variants (pe*): the original passes post_complete_buy_event a fresh 64-byte
PostComplete copy and fresh user/mint/curve/quote_mint key copies. Moving `post` by value is
locally closer, but it cancels pf1 (identical bytes), so it is not kept.

Ledger ids (round 2): 25aa56c1 (ar1), 84f78eee (ar2), 58559371 (wl1), eadf629d (wl2),
b510e5e4 (te1), 5f606a0f (te2), ea3a9c59 (mac1), 50c5e0d3 (pe1), c13f84f0 (pe2),
100a2ede (pe3), dae56098 (pf1), c09e362e (pf2), 1cb4e2af (pfpe1), d1e9b08f (pfpe2), 2d921715 (tp1), 5fd20a97 (tp2).

## Tools (in this directory; run with the swarm `$TOOLS/harness` path as first argument)

`calls.py` (call list with callee Source lines), `origlines.py`, `cmp.py` (aligned orig/ours call
table), `shape.py` (exact/opregs/op ratios), `regions.py` (large unmatched regions), `rdiff.py`
(instruction diff of two ranges, immediates masked), `dis.py`, `trial.sh`, `var.py` (variant crates).
