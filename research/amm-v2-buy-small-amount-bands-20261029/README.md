# v2 buy small-amount bands

## Problem

`buy_v2` prices a base output through
`curve/constant_product.rs` `quote_for_base(amount, b, q) =
ceil(q * amount / (b - amount))`, then `curve/fees.rs` `fee()`
applies CEILING division to the lp and protocol fees, then
`instructions/swap/trade_v2.rs` `calculate_buy_result` totals
quote + lp + protocol + creator and splits protocol into
buyback = floor(protocol * 5000 / 10000). The large-amount
packets mapped the top of this curve (2nd-run #30: the buy
reserve wall; 1st-run #31: trade 0/extremes) and 2nd-run #32
mapped the bottom of the *sell* curve, but no packet walked
the bottom of the buy curve: the quote plateau widths, the
fee-ceiling steps, the buyback floor steps, the limit
inclusivity, and the transfer-fee gross-up shift.

## Cases

21 cases x 3 images (original / #424 control / #427 candidate),
63 signed receipts, parts [10, 10, 10, 10, 10, 10, 3].
Fixture: single tier (0, lp 10 / protocol 111 / creator 0 bps),
pool accrued protocol/creator fees zeroed (available quote =
raw vault quote), virtual quote reserves 0, base mint supply
10^12, VB = 10^12, VQ = 10^10, user base/quote 10^15.

## Result

- Quote plateau: amounts 1..99 all give quote 1 (spend 3:
  quote 1 + lp 1 + protocol 1, buyback 0, vault +3); amounts
  100..199 all give quote 2 (spend 4); amount 200 gives quote
  3 (spend 5). The edges are exact: 99 -> 100 flips quote
  1 -> 2, 199 -> 200 flips quote 2 -> 3.
- Protocol-fee ceiling steps move the buyback split: quote 90
  (amount 8999) gives protocol 1, spend 92, buyback 0, vault
  +92; quote 91 (amount 9000) gives protocol 2, spend 94,
  buyback 1, vault +93 -- spend grows by 2 while the vault
  grows by 1, the extra unit going to buyback. Quote 180
  (amount 17999) gives protocol 2, spend 183, buyback 1,
  vault +182; quote 181 (amount 18000) gives protocol 3,
  spend 185, buyback still 1, vault +184 -- buyback only
  steps on even protocol values (floor(protocol/2)), so the
  2 -> 3 step moves spend and vault by 2 with buyback
  unchanged.
- Lp-fee ceiling step: quote 1000 (amount 99999) gives lp 1,
  spend 1013, buyback 6, vault +1007; quote 1001 (amount
  100000) gives lp 2, spend 1015, buyback 6, vault +1009 --
  the lp step adds exactly 1 to spend and vault with buyback
  unchanged.
- Mid anchor: amount 50000 gives quote 501, spend 508,
  buyback 3, vault +505.
- Zero guards and limit inclusivity: amount 0 gives 6001
  ZeroBaseAmount (original trade_v2.rs:671, rebuilt :431);
  limit 0 gives 6002 ZeroQuoteAmount (original :672,
  rebuilt :432); limit exactly spend succeeds while limit
  spend-1 gives 6004 ExceededSlippage (original :706,
  rebuilt :448), at the bottom (amount 100, limit 3) and at
  the lp step (amount 100000, limit 1014).
- No failing small amount: unlike the sell curve's curve-1
  hole (#32), every buy amount >= 1 succeeds, because
  `calculate_buy_result` only adds (quote + lp + protocol +
  creator) and buyback never exceeds protocol/2.
- Transfer-fee overlay (quote tf100): the pool leg is
  grossed up (`pool_quote_amount_in = amount_before_fee(net)`)
  while the event still reports the pre-gross-up
  `user_quote_amount_in`. Amount 1: spend 4 (gross) against
  vault +3, buyback 0. Amount 100: spend 5, vault +4.
  Amount 9000: spend 95, vault +93, buyback gross 1 withheld
  in full (net 0) -- the buyback step is invisible net.
  Amount 100000: spend 1026, vault +1009, buyback net 5
  (gross 6 withheld 1). Limit 3 on amount 1 under tf100 gives
  6004, because the limit check runs on the grossed total
  (4).
- Every success case funds the user volume accumulator with
  1,844,400 lamports (137 bytes, payer key [8:40]), payer
  -1,849,400; every failure case rolls back fully, payer
  -5,000 only, 0 events.
- Every success case emits exactly 1 event; the pinned
  prefix is quote @64, lp_bps @72, lp_fee @80, protocol_bps
  @88, protocol_fee @96, quote_with_lp_fee @104,
  user_quote_amount_in @112.
- All 3 images agree on every case.

## Limits

Offline LiteSVM synthetic fixtures only. No source change,
build, or whole-program equivalence claim. Band boundaries
are exact for this fixture (single tier lp 10 / protocol 111
/ creator 0, VB 10^12, VQ 10^10), not claims about other pool
states or mainnet settings. Transfer-fee cases use a
post-hoc synthesized quote-mint fee extension.
