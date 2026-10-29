# Lane w4-sellv2-a: sell_v2::execute (0x144508), IR-oracle-first

Base: origin/main 630a074 (1023 normalized / 277 raw). Target symbol in builds:
`pump_recovered::pump_recovered::sell_v2` (`--sym 'pump_recovered::pump_recovered::sell_v2$'`).

## Oracle
- `scripts/cap2.py` builds a scratch copy with `--emit llvm-ir` (and optional `-print-before=annotation2metadata`
  for rustc's raw block order). SDK `llc -O3 -relocation-model=pic -mattr=+store-imm,+jmp-ext` on the captured
  module reproduces the built sell_v2 exactly (1713 insns).
- `scripts/irx.py NAME edit.py` applies an IR edit and diffs against the original window; `scripts/dd.py` gives a
  masked diff (branch offsets masked) with hunks; `scripts/bf.py after:<label>` brute-forces single-block moves;
  `scripts/rep.py` has block/phi edit helpers.

## Base residual (masked diff 50 slots, 14 hunks) in five regions and their IR-level fixes
| Region | Original vs ours | IR edit that fixes it |
| --- | --- | --- |
| A | shared Rc weak-decrement tail kept at function end (ours keeps the mid copy) | emit_cpi invoke `From<ProgramError>` error chain (bb268.i..exit206) placed anywhere before the admit `?` cleanup chain bb158.i |
| B | zero/phi register assignment after the whitelist/trade_fees join (0x145a60) | cf phi before pf phi in the jump-threaded join (bb208) |
| C | transfer_user_tokens argument load schedule (mint loads last in original) | not found yet (IR load permutations, local GEPs: no effect) |
| D | quote_mint snapshot copy ascending in original | the 32-byte memcpy as 4 ascending i64 load/store pairs |
| E | `jeq r3,2,+1; ja` at the buyback post_fee_amount `?` | any surviving block between the post_fee call block and bb264 at ISel |

## Source results
| Trial | Change | ratio | bytes | masked |
| --- | --- | ---: | ---: | ---: |
| base | - | 0.96294 | 13968 | 50 |
| b6 (adopted) | `let (cf,pf,..)=if w{(0,0,0,0)}else{let (pf,cf,p,c)=trade_fees(..)?;(cf,pf,p,c)}` | 0.96761 | 13968 | 42 |

Mechanism for B: JumpThreading keeps the join's phi order, which comes from execute's SROA/mem2reg of the MIR SRoA
field locals of the if-expression tuple (field index order). Making the tuple's field 0 be cf puts the cf phi first.

Rejected: `if native{..}else{admits}` (A unchanged), `checked_sub(cf)` first (worse), `let fees=..;let (..)=fees`
(identical), `Ok((0,0,0,0))..}?` spelling (much worse), whitelisted bool binding (identical), ix_name via
`to_string()` / `String::from` (identical).
