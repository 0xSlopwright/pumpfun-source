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

## Result: sell_v2 normalized match (0x144508)

Head of this branch: sell_v2 13,976 B, ratio 1.0, `normalized_equal: true`. Official score vs main 630a074:
1024 normalized (+0x144508), 276 raw, raw loss 0xa868 (see below). Unstripped sha256
ba1e45621b7efc9115b225a77f8349b7d3a10ff310b8fea448ad04bd4371be2b.

Four source changes, in commit order:
1. B: fee tuple bound cf-first (this lane; found in parallel by w4-sellv2-b).
2. C: `let (base_token_program,base_mint)=(&a.base_token_program,&a.base_mint);` up front (w4-sellv2-b).
3. A+E: `shareholders` listed after `buyback_fee`/`buyback_fee_basis_points` in the TradeEvent literal
   (w4-sellv2-b's held-back t11).
4. D (new here): `let is_sol=is_native_quote(quote_mint);` with a plain helper
   `fn is_native_quote(quote_mint:Pubkey)->bool{quote_mint==Pubkey::default()}`.
   Mechanism: the IR oracle needs no `lifetime.start(quote_mint)` between the creator and quote_mint snapshot
   memcpys. In MIR, GVN strips the StorageLive/StorageDead of SSA locals it reuses (that is why `creator` has
   none), but a borrowed local keeps them, and `quote_mint==..` borrows it. Passing `quote_mint` by value to a
   helper that the MIR inliner does not inline (no `#[inline]`) removes the borrow from execute's MIR, so the
   markers go, and LLVM still inlines the helper (calls stay 80/80). `#[inline]` (MIR-inlined) gives 0.856;
   a `&Pubkey` helper changes nothing.

Raw loss 0xa868: a 3-insn `<&T as Debug>::fmt` thunk. Its raw match on main is a coincidence: the candidate
thunk sits 0xb8 B before the original's address and its call target 0xb8 B before too, because the size
errors of the unmatched windows in between (create_v2 +56, admin_cto +16, swap_hop -256, sweep -8,
v3_buy_costs +16, v3_execute_buy +8, buy_handler +32, buy_exact_quote_in +32, buy_v3 +8, buy_exact_quote -80,
sell_v2 -8) added up to -0xb8. Fixing sell_v2's size makes the sum -0xb0, so the call displacement moves by one
slot. It comes back when the other windows reach their sizes (w4-buyhandler hit the same thunk).

## Source results
| Trial | Change | ratio | bytes | masked |
| --- | --- | ---: | ---: | ---: |
| base | - | 0.96294 | 13968 | 50 |
| g11 (head) | b6 + C + shareholders after buyback + `is_native_quote(quote_mint)` | 1.0 | 13976 | 0 |
| t11 | b6 + C + shareholders after buyback | 0.9965 | 13976 | 8 |
| t9 | b6 + C (base binding) | 0.97578 | 13968 | 16 |
| b6 (adopted) | `let (cf,pf,..)=if w{(0,0,0,0)}else{let (pf,cf,p,c)=trade_fees(..)?;(cf,pf,p,c)}` | 0.96761 | 13968 | 42 |

Mechanism for B: JumpThreading keeps the join's phi order, which comes from execute's SROA/mem2reg of the MIR SRoA
field locals of the if-expression tuple (field index order). Making the tuple's field 0 be cf puts the cf phi first.

Rejected: `if native{..}else{admits}` (A unchanged), `checked_sub(cf)` first (worse), `let fees=..;let (..)=fees`
(identical), `Ok((0,0,0,0))..}?` spelling (much worse), whitelisted bool binding (identical), ix_name via
`to_string()` / `String::from` (identical).

Region D spellings rejected on the way (ledger): deferred `let quote_mint;`/`let creator;` in every order,
tuple/array snapshot locals and destructures, `is_sol={let q=quote_mint;..}`, unused duplicate copies for GVN
reuse, ev.quote_mint from the local, `Pubkey::default()==quote_mint`, `.clone()`: all keep the marker or flip
the creator/quote_mint alloca order (allocas are emitted in reverse MIR local order, and locals are renumbered
by first occurrence).
