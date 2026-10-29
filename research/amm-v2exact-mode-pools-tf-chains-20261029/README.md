# research: v2 exact trades on mode pools under transfer fee, chained into sweep/collect

## Problem

`buy_exact_quote_in_v2` (disc `c2ab1c46684d5b2f`) is the v2 exact
path: the user names a gross quote budget and a minimum base output,
and the program spends the budget (minus the transfer fee) against
the curve. Three earlier packets pinned nearby ground but left this
path open:

- 3rd #22/#23 pinned v2 `buy`/`sell` on cashback/mayhem/both pools,
  nofee and under tf: cashback wins both-flags with 6079, mayhem
  v2 trades move the full amount to the vault with zero buyback.
- 3rd #24 pinned the LEGACY `buy_exact_quote_in` on mode pools
  under tf: a deposit moves the exact out by +1,015, the limit
  gates are 6040/6001, tf10000 fails 6039, and mayhem wins
  both-flags with 6013 -- the opposite precedence from v2
  buy/sell.
- 3rd #9 pinned v2 trades after a sweep under tf on plain pools,
  but never chained a sweep BETWEEN two v2 trades, and never ran
  the v2 exact path on a mode pool at all.

Open questions this packet closes: does the v2 exact path inherit
the v2 buy/sell precedence (cashback wins, 6079) or the legacy
exact precedence (mayhem wins, 6013)? Does a deposit move the v2
exact out by the same +1,015? Are the v2 exact limit gates the
same 6040/6001 pair, at which sites? Does tf10000 fail the same
way (6039)? Is a mid-chain sweep price-neutral for the NEXT v2
trade under tf, the way a pre-trade sweep is? And does the
protocol-sweep 6013 gate still fire on a mayhem pool after a v2
exact accrual?

## Cases

15 cases, 51 steps, 153 receipts (each step run on the original,
control (#424), and candidate (#427) images). All amounts are
token amounts unless noted. Pool state is
(virtual_quote_reserves i128, protocol_fees, creator_fees,
lp_supply). The fixture pool is (-125,882, 2,488, 123,394,
4,194,352,106,721). Transfer fee is applied to the quote mint
only, via the `transferfee(quote, bps, 2**64-1)` override.

Family A -- mayhem v2 exact anchors under tf, into sweep/collect:

- `a-mayhem-buyx-tf100-swc-col`: buyx(10^7, 1) -> sweep -> collect.
  Exact spends exactly the 10^7 budget: user base +53,573,907,921,
  vault quote net +9,900,000, withheld 100,000, pool (-246,150,
  93,422, 152,728). The BuyEvent is 515 bytes (disc
  67f4521f2cf57777, same as v2 buy): quote_in 10,000,000, lp 1,956,
  proto 90,934, qwlp 9,779,732, uin 9,777,776. Sweep moves 152,728
  -> 151,200 (withheld 1,528); collect pays 149,688 (withheld
  1,512). Volume accumulator created (1,844,400 lamports, 137
  bytes, payer user).
- `a-mayhem-buyx-tf5000-swc-col`: same at tf5000. Exact outs
  27,058,593,160, vault quote net +5,000,000, withheld 5,000,000,
  pool (-186,623, 48,414, 138,209). Sweep 138,209 -> 69,104
  (withheld 69,105); collect 34,552 (withheld 34,552).
- `a-mayhem-buyx-tf100-buyx-swc-col`: exact loop. Second exact
  outs 53,565,387,102 (first exact out minus 8,520,819), pool
  (-366,418, 184,356, 182,062), sweep 182,062 -> 180,241
  (withheld 1,821), collect 178,438 (withheld 1,803).

Family B -- v2 exact / sell gates on cashback and both-flags pools:

- `b-cb-buyx-tf100-fail-swc-col`: cashback buyx fails 6079
  CashbackCoinNotSupported (trade_v2.rs:103, original site) with
  full rollback; seed sweep/collect still drain 122,160 /
  120,938.
- `b-both-buyx-tf100-fail-swc-col`: both-flags buyx ALSO fails
  6079 -- cashback wins the v2 exact path, the opposite of the
  legacy exact path where mayhem wins with 6013 (3rd #24).
- `b-both-sell-tf100-fail-swc-col`: both-flags sell_v2 also fails
  6079; seed sweep/collect drain normally.

Family C -- mid-chain sweep neutrality under tf (mayhem):

- `c-mayhem-buy-swc-buy-tf100-col`: buy -> sweep -> buy -> collect.
  The second buy spends 1,866,518 and vaults 1,847,852 -- exactly
  the buy -> buy loop's second-buy legs (3rd #23) -- with pool
  pf 36,434 and a fresh creator accrual of 5,476. The sweep only
  converts the first accrual into vq: pool vq is -19,461 after
  the sweep and -41,910 after the second buy, the same -22,449
  second-buy vq delta as the unswept loop. Collect drains the
  swept 127,580 -> 126,304.
- `c-mayhem-sell-swc-sell-tf100-col`: sell -> sweep -> sell ->
  collect. The second sell nets 1,784,040 -- exactly the sell ->
  sell loop's second-sell receipt -- pool (-41,907, 36,432,
  5,475), collect 127,580 -> 126,304.
- `c-mayhem-buyx-sell-tf100-swc-col`: exact -> sell cross. Sell
  nets 1,784,376 (vault -1,802,401), pool (-268,601, 110,397,
  158,204), sweep 158,204 -> 156,621, collect 155,054.

Family D -- deposit move, limit gates, tf10000:

- `d-mayhem-dep-buyx-tf100-swc-col`: deposit first, then exact.
  Exact outs 53,573,908,936 -- the fresh out plus exactly 1,015,
  the same move as the legacy exact path (3rd #24). Proportional
  liquidity is NOT invisible to the v2 exact path either. Vault
  quote withheld after the exact is 396,085 (296,085 deposit
  plus 100,000 exact). Sweep/collect drain 152,728 -> 151,200
  -> 149,688.
- `d-mayhem-buyx-limit-exact-tf100-swc-col`: limit = exact out
  succeeds with the Family A legs.
- `d-mayhem-buyx-limit-plus1-tf100-fail-swc-col`: limit = out+1
  fails 6040 BuySlippageBelowMinBaseAmountOut (trade_v2.rs:816,
  original site) with full rollback; seed sweep/collect drain.
- `d-mayhem-buyx-limit-zero-tf100-fail-swc-col`: limit 0 fails
  6001 ZeroBaseAmount (trade_v2.rs:752, original site) with full
  rollback; seed sweep/collect drain.
- `d-mayhem-buyx-tf10000-fail-swc-col`: at tf10000 the mayhem
  exact fails 6039 BuyNotEnoughQuoteTokensToCoverFees
  (trade_v2.rs:770, original site) with full rollback. The
  following seed sweep nets 0 (all 123,394 withheld; lamports
  still move the gross 123,394) and the collect is a silent
  no-op (0 events, payer 5,000 only).

Family E -- protocol sweep gate after an exact accrual:

- `e-mayhem-buyx-tf100-swp-fail-swc-col`: exact accrual, then a
  protocol sweep fails 6013 InvalidProtocolFeeRecipient
  (swap/mod.rs:164, original site) with full rollback; the
  creator sweep/collect after it still drain the exact bucket
  152,728 -> 151,200 -> 149,688.

## Result

All 15 cases pass on all three images with identical observed
surfaces (control == candidate == original on every step; no
original-vs-rebuilt divergence in this packet):

- V2 exact on a mayhem pool under tf100 spends the budget exactly
  (vault nets 9,900,000 of 10,000,000) and outs 53,573,907,921 --
  byte-identical to the legacy exact fresh tf100 out -- with a
  515-byte BuyEvent whose slots decode as quote_in / lp_bps /
  lp_fee / proto_bps / proto_fee / qwlp / uin.
- Cashback wins the v2 exact path: both-flags buyx fails 6079,
  not 6013. The v2 exact precedence matches v2 buy/sell and
  contradicts the legacy exact precedence. A reimplementation
  that gates v2 exact by the legacy rule (mayhem first) would
  report 6013 on this both-flags fixture instead of the observed
  6079.
- A deposit moves the v2 exact out by exactly +1,015, the same
  as legacy exact: any model that treats proportional liquidity
  as invisible to exact-out pricing is wrong for both exact
  paths.
- The v2 exact limit gates are sharp at the boundary: exact out
  succeeds, out+1 fails 6040, 0 fails 6001, each with full
  rollback and a recoverable seed sweep/collect afterwards.
- Mid-chain sweep is price-neutral for the next v2 trade under
  tf: the second trade's legs are byte-identical to the
  unswept loop's second trade; the sweep only relabels the
  first accrual from creator_fees to virtual_quote_reserves.
- At tf10000 the v2 exact fails 6039 (not the buy path's 6023
  Overflow), and the sweep/collect chain after it degrades to
  net-0 sweep plus silent no-op collect -- the withheld 123,394
  stays isolated in the creator ATA.
- The protocol-sweep 6013 gate fires on a mayhem pool after a
  v2 exact accrual, exactly as after v2 buy/sell accruals.

## Limits

- The mayhem mode is exercised through the fixture pool's
  `is_mayhem` flag; the mayhem program itself is not in the
  sparse checkout, so the gate's internal rationale is not
  asserted here -- only the observed error code and rollback.
- Error-site line numbers are recorded per image in the
  report's `error_sites` and checked per image only; original
  and rebuilt sources differ in line numbers.
- The transfer-fee override is applied to the quote mint with
  max fee 2**64-1; the tf10000 sweep/collect degradation is
  specific to that configuration.
- `verify.py` re-checks every receipt independently: signatures,
  payer/token/lamport deltas, withheld balances, pool state,
  volume accumulator state, cashback fields, decoded event
  fields, error codes and per-image sites, rollback, and
  three-image surface agreement.

## Saved-receipt verification

From the repository root:

```sh
python3 -B research/amm-v2exact-mode-pools-tf-chains-20261029/verify.py
```

The defaults use the retained original image and the compressed candidate images
from `amm-multi-hop-group-slice-recovery` (#424 control) and
`amm-transfer-fee-diagnostic-recovery` (#427 candidate). To use images elsewhere,
pass `--original /path/to/original.so --control /path/to/control.so --candidate
/path/to/candidate.so`; each option accepts raw or gzip-compressed bytes. All
three image hashes must still match the report.

This command checks stored receipts, signatures and snapshots; it does not execute
the transactions again. `producer.py` is the retained historical producer and
keeps its original workspace paths and harness imports. These are observations
from fixed synthetic fixtures, with no source change, rebuild or whole-program
equivalence claim.
