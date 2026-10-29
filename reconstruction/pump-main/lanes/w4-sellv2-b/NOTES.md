# w4-sellv2-b (wave 4): sell_v2::execute 0x144508

Target `0x144508` `sell_v2::execute` (original 13,976 B), built as the outlined
`pump_recovered::pump_recovered::sell_v2` (`target_metric --sym 'pump_recovered::pump_recovered::sell_v2$'`).
Base: origin/main 630a0741 (1023 normalized / 277 raw), sell_v2 0.96294 / 13,968 B.

## Method: llc IR oracle

`scripts/capture.py` builds a scratch copy with `--emit=link,llvm-ir` (the .so differs in sha from a plain
fastbuild but has identical metrics). `scripts/irx.py <name> <edit.py>` applies an IR edit, runs the SDK
`llc -O3 -relocation-model=pic -mattr=+store-imm,+jmp-ext`, and diffs the sell_v2 symbol against the
original window with call/lddw immediates and branch offsets masked. On base IR llc reproduces the built
function exactly (1713 insns, 0 differing). `moves.py` (MOVES="after:blk:tgt;before:..;end:blk"),
`phiperm.py` (PERM over a block's phis), `scan.py`/`scan2.py` (parallel block-placement scans).

## Residual map on base (masked difflines 67)

| region (orig line) | what | IR fix found |
| --- | --- | --- |
| 581 / 1710 | shared Rc weak-decrement tail: tail merge keeps the admit-chain copy (mid) instead of the emit_cpi Err copy (last) | not yet (moving `exit.i115` gets the tail last but flips the jne) |
| 664-720 | whitelist fee tuple zero-mov / phi-copy registers | phi order (`_630`, cf, pf, pbps, cbps) in the fee join: 67 -> 51 |
| 851 | transfer_user_tokens argument load schedule | a+264 GEP defined in the entry block (fixed in source, see below) |
| 1062 | quote_mint snapshot copy (orig ascending) | memcpy -> 4 ascending i64 load/store pairs: -12 |
| 1453 | buyback `post_fee_amount(..)?` test: orig `jeq; ja` | IR-next block of the test must be neither Ok nor Err |

## Source result

| step | sell_v2 bytes / ratio | llc dist | official |
| --- | --- | --- | --- |
| main 630a0741 | 13,968 / 0.96294 | 67 | 1023 / 277 |
| fee tuple bound cf-first | 13,968 / 0.96761 | 51 | 1023 / 277, no gains/losses |
| + `let (base_token_program,base_mint)=(&a.base_token_program,&a.base_mint);` at the top (buy_handler idiom), used by transfer_user_tokens | 13,968 / 0.97578 | 23 | 1023 / 277, no gains/losses |

Mechanism: the four tuple fields become MIR-SROA locals `_785.._788` in tuple field order; rustc gives them
allocas in local order, and mem2reg's phis in the fee join follow that order. The original's register
assignment needs cf's phi before pf's, so the binding is
`let (cf,pf,protocol_fee_bps,creator_fee_bps)=if wl{(0,0,0,0)}else{let (pf,cf,..)=trade_fees(..)?;(cf,pf,..)};`
(nested `((cf,pf),(..))` is byte-identical). `(pf,pbps,cf,cbps)` gives 0.96352; deferred-init bindings and
the buy_v2/legacy spellings are much worse (see ledger).

Probably applies to buy_v2 handlers too (w3-buyhandler listed the same "zero-mov phi-copy order" residual).

Second step: the IR oracle showed the transfer_user_tokens schedule follows from where the
`&a.base_token_program` GEP is defined (call block vs entry block; the default pre-RA scheduler is
list-ilp, so IR order inside the block does not matter). The buy_handler's tuple binding keeps that GEP in
the entry block; a plain `let base_token_program=&a.base_token_program;` is byte-identical to before.
