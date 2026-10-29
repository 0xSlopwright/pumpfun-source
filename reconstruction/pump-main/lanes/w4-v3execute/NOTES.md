# Lane w4-v3execute (wave 4)

Target: `0x83c00` `trade::v3_execute_buy` (programs/pump/src/trade_v3.rs), original 3,440 B.
Base: origin/main 630a074 (1023 normalized / 277 raw); 0x83c00 at 3,448 B, ratio 0.97278, 22/22 calls.

## Result

| | bytes | ratio | slots_diff | official | gains | losses | raw losses |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
| base 630a074 | 3,448 | 0.97278 | - | 1023 / 277 | - | - | - |
| this lane (final1) | 3,440 | 1.0 (normalized_equal) | 0 | 1024 / 276 | 0x83c00 | none | 0xa868 |

Unstripped sha256 3db4b4a59be200e00040b1d20b6f7b03874667541d3f30327730b68d50e8dc5b,
candidate.so sha256 a82bd684cb3a1fe1b987b2bb1595e90d19af6736d45d5f43ac1ec826081859a8.

Source change: the quote payment becomes a block with two statement lets.

```rust
{
    let user_quote_in=if is_sol{add(pool_quote,total_buyback)?}else{pool_quote};
    let (user_quote,curve_quote)=if is_sol{(None,None)}else{let curve_quote=Some(..curve..);(Some(..user..),curve_quote)};
    user_quote_payments::transfer_from_user(..,user_quote_in,..,user_quote,curve_quote)?;
}
```

The block takes 5 lines instead of 1, so `layout-pad(40)` becomes `layout-pad(36)` and line 767
(the `checked_sub` error site) keeps its line. Behavior is the same: `add()` still runs only
when `is_sol`.

### The raw loss 0xa868 is call-span drift

0xa868 is a 24-byte `<&T as Debug>::fmt` thunk (`ldxdw; call; exit`). Seven identical-code
functions are candidates for it. In the base build, one of them (at cand 0xa7b0) matched raw
only because its call distance to `<AccountInfo as Debug>::fmt` (0x1a24f8) equalled the
original 0x32fa7 slots. That held only because the +8 B surplus in v3_execute_buy cancelled
size errors in other unmatched windows between the two addresses. They sum to -8 B, and
sweep::execute alone is 7824 B against 7832. Fixing the target to its exact size moves the
distance by one slot. Other wave-4 lanes report the same drift (w4-sweep, w4-createv2,
w4-buyexactquote-v3 ledger rows). Nothing in this function can avoid it. It comes back once
the remaining unmatched windows in the span reach their original sizes.

## Mechanism

1. IR oracle (`scripts/perm.py`): on the base IR (which already has the shared add/transfer
   error sink from w3 t16), all 5,040 layouts of the 7 blocks bb18,bb16,bb19,bb65,bb64,bb67,bb66
   go through llc. 20 give 0 differing instructions (`perm_exact_layouts.txt`), and all of them
   have `nonsol(bb18) < add(bb16)`, with `add, transfer-call, transfer-ok` contiguous. With one
   `if` whose sol arm holds `add()?`, rustc's lazy block creation cannot produce that layout. The add `?`
   switch is codegenned between the join's creation and the join's codegen, so its Ok and Err
   blocks always land between the call block and its Ok block.
2. With two statement-level `if is_sol` (amount first, then options), MIR JumpThreading (mir-opt-level 2)
   threads the second switch into the first one's arms (`scripts/mirsum.py`). The transfer call
   block is then created late, and its Ok block follows it directly (v2: adjacency, 3448 B).
   The two error exits then share a drop node with the later pay_out/post_fee errors,
   so SimplifyCFG does not sink their stores.
3. Wrapping the statements in a block `{...}` scopes the lets. The add-err and transfer-err exits
   now share a drop-tree node that no later error reaches, so SimplifyCFG sinks their `_0` stores
   into one phi block. Both IR conditions hold: 0 diff, 3440 B.
   The `match <amount if> { amt => { options let; transfer? } }` form (v5) produces the same binary.
   Options let before amount let (v6) loses adjacency (0.9728).

## Trials (ledger attempt ids in the shared ledger, lane w4-v3execute)

perm oracle 794430cf; u1 (w3 t25 repro) 16a59962; v1 b6927ca6; v2 d50de81f; v3 2bf3d334;
v4 (3-line, unbalanced: 9 normalized losses from line shift) 460370ea; v5 7a5a5d16; v6 ecd213d6;
v4s/v5s single line 89b06554; final1 (5 lines + pad 36) e9594413.
