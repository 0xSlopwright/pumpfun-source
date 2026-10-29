# Lane w4-swaphop (wave 4): 0x5b3b0 `multi_hop_curve::swap_hop`

Base: origin/main 630a074 (1023 normalized / 277 raw). Approach: stack-frame layout census
(llc `-stop-after=prologepilog` + `fimap.py` from w3-swaphop), then source spellings.

## Current head (T4b)

| build | bytes (orig 18,584) | win ratio | opregs | op | segdist opregs / exact | aligned calls | official |
|---|---:|---:|---:|---:|---:|---:|---|
| main 630a074 | 18,328 | 0.3584 | 0.6821 | 0.7693 | 1049 / 1659 | 98 | 1023 / 277 |
| T2 `a: &mut` | 18,344 | 0.3618 | 0.6893 | 0.7689 | 1023 / 1652 | 98 | 1023 / 276 |
| T3b T2 + mint-first + trade_event fresh mint | 18,432 | 0.3987 | 0.6867 | 0.7723 | 1032 / 1647 | 98 | 1023 / 276 |
| T4a T3b + post nested in completion block | 18,440 | 0.4421 | **0.7375** | **0.8152** | **835** / 1485 | **101** | 1023 / 276 |
| **T4b T4a + post by value** | 18,496 | **0.5698** | 0.7149 | 0.7819 | 909 / **1256** | 100 | 1023 / 276 |

T4b unstripped sha256 f224fb7e1c6798994207a3d99094544d0d9d7e30581ae906597df41cacf71fb2.
Callee multiset exact (107/107, msdiff 0). Frame census: every frame object from 0x30 through
the 424-byte trade event at 0x6d0 now sits at the original offset (fimap delta 0 for all 26).

## Mechanisms (all from the original's frame/loads)

1. **`a: &mut MultiHopCurve`** (execute: `mut ctx`, `let a = &mut *ctx.accounts`; the three
   `route_event!` calls pass `&*a`). The original reloads `a.user`'s key pointer at every use
   (trade_event 0x3168, CompleteEvent 0x3920, post event 0x3e88: `[a+0x18] -> [+0] -> copy`).
   Ours, with `a: &`, had one MIR local `_935` (MIR GVN treats derefs through `&` as stable) and
   copied from it three times. Through `&mut` the place is not stable, so each `a.user.key()`
   is a fresh load. This is the root cause w3-swaphop chased (user GVN fold): it is not a spelling
   at the use sites but the reference kind of `a`.
2. **CompleteEvent initializers mint first** (`{mint, user, bonding_curve, timestamp, quote_mint}`,
   the order buy.rs/buy_v2/trade_v3 already use): the original loads `[h+0x58]` before the user.
3. **trade_event gets `&h.base_mint.key()`** (fresh 32-byte copy at -0x340, orig 0x31b8), not
   the seeds' `mint_key` pointer.
4. **Post event nested inside the completion block** (w3's peL1 split `if completed` undone).
   The original's 136-byte CompleteEvent has its own slot 0x498: it is live across the post
   event, so StackColoring cannot merge it into `_503`/`post_event`. With `a: &mut`, nesting no
   longer folds the post user key into the CompleteEvent temp.
5. **Post by value** (`if let Some(post)=post_fill`, `&post`): the original passes a fresh
   64-byte PostComplete copy at -0x380; SROA splits `post_fill` into the 16-byte pieces the
   original has at 0x700/0x710.

## Raw 0xa868 is a span-size artifact (applies to every lane)

Every swap_hop size change "loses" raw 0xa868. That window is a 24-byte `<&T as Debug>::fmt`
thunk; in main the instance at 0xa7b0 calls 0x1a24f8 with imm 0x32fa7, equal to the original's,
so it matches raw only because the total text size between the two equals the original's.
swap_hop (0x63f88) lies inside that span, so any net size change in it, including reaching
the original's 18,584 B, breaks the coincidence. Other wave-4 lanes (w4-buyexactquote-v3, w4-createv2,
w3-raw-layout) hit the same loss. This needs a coordinator decision: as specified, the
zero-loss rule blocks every size-changing improvement to any function inside the span.

## Remaining residuals (T4b)
- fees (32 B) ours 0x710 vs orig 0x730, post_fill pieces ours 0x720/0x730 vs orig 0x700/0x710:
  in the original, post_fill's MIR local is created after fees. T5 (post_fill as a tuple element
  of the arm result) = 18,624 B, ratio 0.568, segdist 917/1247 (mixed).
- Block placement: orig@0x2078 (143 vs 56) / 0x26f8 (13 vs 98): the original places the buy
  over-reserves path (user copy, mayhem 599 test) right after the sell arm's
  transfer_quote_out/692 block; ours places it after the 589 closure.
- 16-byte region 0x770.. shifted -48 (ours 0x7f8 vs orig 0x828).

Ledger ids: 658ccd87 (T1a), 2cff5c98 (T1c), d54e6036 (T1b), fd0ddd62 (T2), 660c14cb (T3b),
fd1c95b8 (T3), 5381e84e (T4a), d31762c3 (T4b).
