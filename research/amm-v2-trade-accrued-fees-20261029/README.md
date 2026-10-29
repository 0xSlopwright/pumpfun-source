# v2 trades with nonzero accrued fees

## Problem

Every earlier v2 trade packet zeroed the pool's accrued
protocol/creator fees, so available quote (raw vault quote minus
accrued) always equalled the raw vault quote and the sell side's
real-reserve gate never bound. Nothing pinned whether pricing
follows the effective reserve or the available reserve, whether
the sell gate is inclusive, what happens when accrued equals or
exceeds the raw vault, whether the accrued split matters, or
whether a negative virtual reserve breaks pricing before the
curve runs.

## Cases

22 cases x 3 images (original / #424 control / #427 candidate),
66 signed receipts, parts [10, 10, 10, 10, 10, 10, 6]. Fixture
otherwise identical to #33: single tier (0, lp 10 / protocol 111
/ creator 0 bps), virtual quote reserves 0 except the two
vq-overflow cases, base mint supply 10^12, VB = 10^12,
VQ = 10^10, user base/quote 10^15. No transfer-fee cases: this
packet isolates the accrued-fee geometry (tf overlays were
already pinned for buy in #33, sell in #32, buy_exact in #36).

- buy-anchor-accrued0 / buy-accrued-small /
  buy-accrued-eq-raw (buy 10^6, accrued 0 / 2488+123394 /
  10^10+0): identical pricing (spend 10124, vault +10068,
  buyback 56); only the pool's post-trade fee fields move.
- buy-accrued-eq-raw-limit-exact / -limit-below (limits 10124 /
  10123): limit semantics unchanged under accrued.
- buy-accrued-over-raw (accrued 10^10+1): 6023 at the liquidity
  check, before any curve math.
- buy-accrued-sum-overflow (protocol u64::MAX + creator 1):
  6023 in total_accrued_fees, before the subtraction.
- buy-vq-neg-overflow (virtual -(VQ+1)): 6023 in
  effective_quote_reserves.
- sell-anchor-accrued0 / sell-accrued-small (sell 10^6):
  identical payout (user +9878, vault -9933, buyback 55).
- sell-accrued-eq-raw-amt1 / -amt101 / -amt1m (accrued 10^10):
  the real = 0 line -- amount 1 succeeds with receipt 0, amount
  101 fails 6023 in calculate_sell_quote, amount 10^6 fails 6063.
- sell-real5000-below / -boundary-ok / -boundary-err (real
  5000, amounts 500000 / 500700 / 500701): the inclusive gate --
  quote_without_lp exactly 5000 succeeds, 5001 fails 6063.
- sell-real5000-split (accrued 5,000,000,000 / 4,999,995,000):
  byte-identical deltas to the all-protocol accrual; only the
  total gates.
- sell-accrued-over-raw / sell-vq-neg-overflow: the same 6023
  sites through the sell path.
- buyexact-accrued-eq-raw-ok / -limit-above /
  -over-raw (amount 10000): buy_exact follows the buy side --
  succeeds with accrued == raw (out 987899), limit 987900 fails
  6040, accrued > raw fails 6023.

## Result

- Pricing is accrued-blind. buy_v2, sell_v2 and
  buy_exact_quote_in_v2 all price off the effective quote
  reserve (raw vault quote + virtual quote reserves). Buy 10^6
  is quote 10001 + lp 11 + protocol 112 = spend 10124, vault
  +10068, buyback 56, pool vq -56, at accrued 0, at
  2488/123394 (pool protocol 2544 after), and at accrued ==
  raw 10^10 (pool protocol 10000000056 after). Sell 10^6 is
  curve 9999 - lp 10 - protocol 111 = user +9878, vault -9933,
  buyback 55, at accrued 0 and at 2488/123394. At accrued ==
  raw, sell 10^6 fails 6063 at the real-reserve gate.
- The sell gate is real-only and inclusive. calculate_sell_quote
  requires real_quote_reserves >= quote_without_lp_fee, else
  6063 InsufficientRealQuoteReserves. With real = 5000, sell
  500700 (curve 5006, lp 6, quote_without_lp exactly 5000)
  succeeds (user +4944, vault -4972, buyback 28) and sell
  500701 (curve 5007, lp 6, quote_without_lp 5001) fails 6063.
  Amounts 500625..500700 all give the same payout (curve/lp/
  protocol plateau), so the boundary is a single amount, not a
  band.
- Accrued == raw splits buy from sell. Buys only check that
  available does not underflow, so buy 10^6 and buy_exact 10000
  succeed unchanged (buy_exact out 987899, vault +9945,
  buyback 55). Sells collapse to the real = 0 line: amount 1
  succeeds with receipt 0 (curve 0, fees 0, base still moves
  -1/+1, volume funded, event emitted); amount 101 fails 6023
  Overflow in calculate_sell_quote -- the real check 0 >= 0
  passes, then 0 - protocol 1 underflows (the same curve-1 hole
  as #32, reached through a different gate); amount 10^6 fails
  6063.
- Accrued > raw fails everything at the liquidity check.
  available_quote_reserves checked_sub gives 6023 Overflow
  (state/pool.rs) before any curve math, for buy, sell and
  buy_exact alike. An accrued sum overflowing u64 (protocol
  u64::MAX + creator 1) fails 6023 even earlier, in
  total_accrued_fees -- the sum is checked before the
  subtraction, so the failure does not depend on the raw vault
  at all.
- Only the accrued total matters. Sell 500000 with accrued
  split (5,000,000,000 / 4,999,995,000) gives byte-identical
  token deltas (user +4938, vault -4966, buyback 28, event
  curve 4999 / lp 5 / protocol 56) to the same sale with
  all-protocol accrued (9,999,995,000 / 0); the post-trade pool
  fields differ only by the new accrual (protocol +28,
  creator +0 in both).
- Negative virtual reserves break pricing first. Virtual quote
  reserves of -(VQ+1) make the effective reserve negative, so
  buy and sell both fail 6023 Overflow in
  effective_quote_reserves (u64 try_from), before the curve.
- Limit semantics are unchanged under accrued. Buy limit
  exactly 10124 succeeds, 10123 fails 6004 ExceededSlippage.
  Buy_exact limit exactly 987899 succeeds, 987900 fails 6040
  BuySlippageBelowMinBaseAmountOut.
- Every success case funds the user volume accumulator with
  1,844,400 lamports (137 bytes, payer key [8:40]), payer
  -1,849,400. Every failure case rolls back fully, payer
  -5,000 only, 0 events, pool bytes unchanged.
- All 3 images agree on every case.

Error sites (original / rebuilt):

- buy-accrued-eq-raw-limit-below: original programs/pump-amm/src/instructions/swap/trade_v2.rs:706. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:448. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:448. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- buy-accrued-over-raw: original programs/pump-amm/src/state/pool.rs:417. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/state/pool.rs:64. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/state/pool.rs:64. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- buy-accrued-sum-overflow: original programs/pump-amm/src/state/pool.rs:408. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/state/pool.rs:57. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/state/pool.rs:57. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- buy-vq-neg-overflow: original programs/pump-amm/src/state/pool.rs:440. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/state/pool.rs:48. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/state/pool.rs:48. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- sell-accrued-eq-raw-amt101: original programs/pump-amm/src/instructions/swap/trade_v2.rs:385. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:187. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:187. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- sell-accrued-eq-raw-amt1m: original programs/pump-amm/src/instructions/swap/trade_v2.rs:377. Error Code: InsufficientRealQuoteReserves. Error Number: 6063. Error Message: BOOST: sell output exceeds the real quote vault. effective = real + virtual is pricing-only; payout is capped at real_vault, so quote min(out, real_vault).; control programs/pump-amm/src/instructions/swap/trade_v2.rs:183. Error Code: InsufficientRealQuoteReserves. Error Number: 6063. Error Message: BOOST: sell output exceeds the real quote vault. effective = real + virtual is pricing-only; payout is capped at real_vault, so quote min(out, real_vault).; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:183. Error Code: InsufficientRealQuoteReserves. Error Number: 6063. Error Message: BOOST: sell output exceeds the real quote vault. effective = real + virtual is pricing-only; payout is capped at real_vault, so quote min(out, real_vault).
- sell-real5000-boundary-err: original programs/pump-amm/src/instructions/swap/trade_v2.rs:377. Error Code: InsufficientRealQuoteReserves. Error Number: 6063. Error Message: BOOST: sell output exceeds the real quote vault. effective = real + virtual is pricing-only; payout is capped at real_vault, so quote min(out, real_vault).; control programs/pump-amm/src/instructions/swap/trade_v2.rs:183. Error Code: InsufficientRealQuoteReserves. Error Number: 6063. Error Message: BOOST: sell output exceeds the real quote vault. effective = real + virtual is pricing-only; payout is capped at real_vault, so quote min(out, real_vault).; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:183. Error Code: InsufficientRealQuoteReserves. Error Number: 6063. Error Message: BOOST: sell output exceeds the real quote vault. effective = real + virtual is pricing-only; payout is capped at real_vault, so quote min(out, real_vault).
- sell-accrued-over-raw: original programs/pump-amm/src/state/pool.rs:417. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/state/pool.rs:64. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/state/pool.rs:64. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- sell-vq-neg-overflow: original programs/pump-amm/src/state/pool.rs:440. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/state/pool.rs:48. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/state/pool.rs:48. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- buyexact-accrued-eq-raw-limit-above: original programs/pump-amm/src/instructions/swap/trade_v2.rs:816. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:494. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:494. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.
- buyexact-accrued-over-raw: original programs/pump-amm/src/state/pool.rs:417. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/state/pool.rs:64. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/state/pool.rs:64. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.

## Limits

Offline LiteSVM synthetic fixtures only. No source change,
build, or whole-program equivalence claim. Accrued values,
boundaries (500700/500701) and amounts are exact for this
fixture (single tier lp 10 / protocol 111 / creator 0,
VB 10^12, VQ 10^10), not claims about other pool states or
mainnet settings. Accrued fees above the raw vault and negative
virtual reserves are synthetic pool states used to pin the
gate order, not claims about reachable mainnet states.

The retained producer's generated README template contains the superseded phrase "at all three accrual levels" for sell 10^6. Its execution logic and raw receipts are unchanged: the accrued-equals-raw case fails 6063. The corrected result above distinguishes unchanged pricing inputs from the real-reserve payout gate.
