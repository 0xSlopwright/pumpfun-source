# Lane callgraph-census: call-graph and inlining-boundary census

Baseline: origin/main d2cb88d (`$BASE/unstripped.so`, sha256 04fdafc0..., 1019 normalized / 188 raw).
Tool: `census.py` in this directory (read-only; reuses the harness `score.py` masking, `win.py`, `coords.py`).
Outputs: `CENSUS.json` (full per-target data), `CENSUS-TABLES.md` (generated tables).

```bash
python3 reconstruction/pump-main/lanes/callgraph-census/census.py [--cand <unstripped.so>] \
  --json CENSUS.json --md CENSUS-TABLES.md [--only 0x5b3b0,...]
```

## Method

- Direct internal calls (`call` with src=1, imm != -1) in physical order; target = site + 8 + imm*8.
  Syscalls are counted separately.
- Callee identity = normalized body sha256 (exact score.py masking), refined 6 rounds Weisfeiler-Lehman
  style with the callees' identities (masking hides call targets, so e.g. `ToString::to_string<A>` and
  `<B>` would otherwise collide). The 16 unmatched windows are pinned to their README candidates.
  Every original callee of every target resolves (all are matched windows or one of the 16).
- Sequence alignment (difflib) of callee keys; multiset differences classified as:
  `orig-calls; we inline` (helper exists standalone in ours but this function does not call it),
  `we outline; no such function in original` (ours-only helper: the original inlined it everywhere),
  etc. Depth-2 evidence = the missing helper's own callees that show up as extra direct calls on the
  other side.
- Argument setup per aligned call: the last write to each of r1..r5 since the previous call,
  callee-saved registers folded to `rS`; `shape` also masks stack offsets.
- Error-message form per Anchor error site: `fmt` = direct `<PumpError as Display>::fmt` call
  (ToString inlined), `to_string` = outlined `ToString::to_string` call, attached to the next
  `Source{file,line}` coordinate.

## Headline results

| target | fn | calls orig/ours | callee multiset | verdict |
|---|---|---:|---|---|
| 0x14f4e0 | buy_exact_sol_in | 101/101 | equal, order equal, args equal | not a call-graph problem (2 swapped loads) |
| 0x80df8 | v3_buy_costs | 17/17 | equal | one `expect_failed` site moved (orig pos 4, ours pos 16) |
| 0x6cd78 | process_cashback_inner | 58/58 | to_string vs fmt at sell.rs:85 | error site placement/frequency |
| 0x83c00 | v3_execute_buy | 22/22 | equal, order equal | not a call-graph problem |
| 0x13f630 | buy_exact_quote_in_handler | 130/130 | equal, order equal | not a call-graph problem |
| 0x13b9b8 | buy_handler | 90/90 | equal | two closure calls moved |
| 0x144508 | sell_v2::execute | 80/80 | equal | one Clock::get moved by one position |
| 0x4c158 | create_token_account_v2 | 10/10 | equal, order equal | not a call-graph problem |
| 0x147ba0 | trade::buy | 29/29 | equal | one memcmp moved (orig pos 4, ours pos 2) |
| 0x14a8a8 | trade::sell | 47/47 | equal, order equal | not a call-graph problem |
| 0x1489f8 | trade::buy_exact_quote | 66/66 | equal | 8 calls reordered |
| 0x72810 | sweep::execute | 37/36 | orig +1 memcmp | one extra key compare in original |
| 0x1e7c0 | create_v2::execute | 125/126 | fmt/to_string flips, memcpy +1 | error-site frequency + one memcpy |
| 0x77940 | cashback::claim_v2 | 68/62 | **inline boundary differs** | see below |
| 0x5b3b0 | swap_hop | 107/94 | **inline boundary differs a lot** | see below |
| 0x22a10 | admin_cto::execute | 154/178 | **21 AccountInfo::clone inlined in orig** | see below |

Key negative result: for 10 of the 16 windows (all except 0x77940, 0x5b3b0, 0x22a10, 0x1e7c0,
0x6cd78, 0x72810) the direct-callee multiset is identical (depth-6 identities), and for 5 of
them the physical order is identical too. Their residuals are intra-function (block layout,
register allocation, stack slots, expression shape), not helper/inlining boundaries; adding or
removing `#[inline]` helpers there is unlikely to help.

## Per target

### 0x5b3b0 multi_hop_curve::swap_hop (ratio 0.158)

The inlining boundary is clearly different. The original:

- **Inlines `emit!` + `emit_cpi!` three times** (TradeEvent, CompleteEvent, PostCompleteBuyEvent):
  it calls `<E as Event>::data` twice per event, `sol_log_data` x3, `Vec::from_iter` x3
  (the macro's `disc.into_iter().map(|b| *b).chain(inner).collect()`), `exchange_malloc` x3
  (`vec![AccountMeta]`), `Instruction::new_with_bytes` x3, `invoke_signed` x3 and
  `From<ProgramError>` +3 (the macro's `.map_err(Error::from)?`). Ours outlines the hand-written
  generic `route_event` (3 monomorphs, none exist in the original) with an `Instruction {..}` literal
  and `extend_from_slice`. Implication: replace `route_event(..)` by the literal `emit!`/`emit_cpi!`
  expansion (anchor-attribute-event 0.31.2), inline in swap_hop.
- Calls `trade::sub3` x2 where ours has `sub(sub(x,pf)?,cf)?` (multi_hop_curve.rs:580 and :679)
  through the ours-only helpers `multi_hop_curve::sub` (x5), `add` (x2), `div` (x2).
- Calls `buy_fee_market_cap` (ours: inline `div(supply*vqr, vtr)` at :572; note the original
  helper picks `token_total_supply` in mayhem mode).
- Calls `constant_product::tokens_for_quote` (ours: inline `div(effective*vtr, vqr+effective)` at :589).
- Calls `trade::post_complete_buy_event` (ours: struct literal with `sub`/`add` at :789-794).
- Calls `trade::quote_payments::transfer_native` once more (ours: the ours-only `move_lamports`
  at :762, last-hop native sell payout).
- `__multi3` x2 in ours disappears in the original (it lives inside `buy_fee_market_cap`).

### 0x77940 cashback::claim_v2 (ratio 0.167)

- Ours outlines `anchor_lang::Lamports::add_lamports` (single caller; no such function exists
  anywhere in the original). Its depth-2 callees (`lamports`, `try_borrow_mut_lamports`,
  `From<ProgramError>`) are exactly the original's surplus. Implication: the original either wrote the
  lamport credit by hand or `add_lamports` was inlined (e.g. called on a different receiver type).
- Original calls `AccountInfo::data_is_empty` once (before `try_borrow_data`, physical pos 9) where
  ours uses `data.is_empty()` on the borrowed slice.
- Original order: token-account branch (data_is_empty, try_borrow_data, deserialize) physically before
  the native `Rent::get`/`minimum_balance`/`lamports`; `AccountInfo::clone` +2.

### 0x22a10 admin_cto::execute (ratio 0.095, orig 27,400 B vs ours 18,464 B)

- The 21 surplus `AccountInfo::clone` calls in ours (54 vs 33) are exactly the clones the original
  **inlines**: 42 inline Rc strong-count increments in two call-free regions, 13 clones at
  0x26a8..0x33f8 (just before `pump_amm::cpi::transfer_creator_fees_to_pump_v2`, 12 accounts + program)
  and 8 clones at 0x3da8..0x45d0 (just before `pump_fees::cpi::admin_cto_sharing_config`, 7 accounts
  + program). These account for most of the 8.9 KB size gap. The third CPI (`admin_cto_pool`) keeps
  outlined clones in both builds.
- Physical order differs too: the original calls transfer_creator_fees_to_pump_v2 (pos 67) and
  admin_cto_sharing_config (pos 70) before admin_cto_pool (pos 82) and then the collect/create_idempotent
  path; ours places transfer_creator_fees_to_pump_v2 near the end (pos 157).
- Implication: the two CPIs with inlined clones were probably compiled in their own small function
  (LLVM inlines `Clone::clone` bottom-up into the small helper, then the helper into execute), or built
  through a path whose clone is MIR-inlined. Test: move each CPI into a separate non-`inline(never)` fn.

### 0x1e7c0 create_v2::execute, 0x6cd78 process_cashback_inner, 0x22a10 (error-message form)

The fmt/to_string differences are per-site LLVM decisions on the same `From<PumpError>`
expansion (no macro-form correlation: `require!` sites show both forms). Without a profile LLVM treats
a call site as cold when its block frequency is under 2 % of entry and drops the threshold, so an
`fmt` (ToString inlined) site in the original that is `to_string` in ours sits under less conditional
nesting in the original. Flips (orig/ours): create_v2.rs:205, :210, :541 fmt/to_string; sell.rs:85
to_string in orig. These are block-frequency hints for the reconstruction lanes, not helper-boundary fixes.

### 0x72810 sweep::execute

Same size (7,832 B) but ratio 0.298. Original has one more `memcmp` (pos 12, 0x6e0, near sweep_fees.rs:123)
and `format_inner`, `admit_associated_token_account`, `From<ProgramError>` at earlier positions.

### Equal-multiset targets

0x14f4e0, 0x83c00, 0x13f630, 0x4c158, 0x14a8a8: identical direct-call sequences.
0x80df8 (`expect_failed` placement), 0x13b9b8 (two closures), 0x144508 (Clock::get), 0x147ba0
(memcmp), 0x1489f8 (8 reordered calls): reorder only. Recurring argument-setup pattern in the buy/sell
v2 handlers: the original re-loads `ldxdw r3, [r3 + 0]` (a pointer read through a reference) at
`transfer_from_user*` call sites where ours passes a callee-saved register or `[rS + 0x1a0]`, and
uses frame offsets 0x20 lower (`-0x4c0` vs `-0x4a0`) for the shared admit/check locals.

## Trials

See the ledger (`--lane callgraph-census`) and the table below (filled as trials land).

| trial | target | mechanism | result |
|---|---|---|---|
