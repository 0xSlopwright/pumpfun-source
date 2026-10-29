# v2 buy_exact_quote_in small-amount bands

## Problem

The exact-in path was never walked at the bottom. Packet #30 mapped
the exact-in wall at the top (amount 10^12, u64::MAX balances),
packet #31 (1st run) covered trade 0/extremes, and packet #33 (2nd
run) mapped the bottom of the non-exact buy curve -- but no packet
pinned the exact-in estimate / quote / out ladder for small quote
inputs, the two distinct 6040 sites, the guard order, or the
transfer-fee shift of the ladder.

## Cases

All cases `buy_exact_quote_in_v2` (amount = quote in, limit = min
base out) on the same synthetic fixture as #33: single tier (0, lp
10 / protocol 111 / creator 0 bps), pool accrued fees zeroed,
virtual quote reserves 0, base mint supply 10^12, VB = 10^12,
VQ = 10^10, user base/quote 10^15, 3 images each. The quote mint
carries a Token-2022 transfer-fee extension in tf cases, so the
pool leg is grossed up and the buyback leg lands in a Token-2022
ATA.

- ex-limit0-amount0 / ex-amount0 / ex-limit0: guard order (limit
  0 -> 6001 even when amount is also 0; amount 0 with limit 1 ->
  6002).
- ex-estimate0 / ex-quote0 / ex-out0 (amounts 1 / 2 / 3): the
  three-step failure ladder below the first success.
- ex-first / ex-first-limit-exact / ex-first-limit-plus1 (amount
  4, limits 1 / 99 / 100): first success and limit inclusivity.
- ex-a5 (amount 5): the next rung (out 199).
- ex-proto-below / ex-proto-above (amounts 92 / 93): the
  protocol-fee ceiling step.
- ex-a99 / ex-a100 / ex-a100-limit-exact / ex-a100-limit-plus1
  (amounts 99 / 100, limits 1 / 9599 / 9600): buyback onset anchor
  and limit inclusivity at amount 100.
- ex-lp-below / ex-lp-above (amounts 1013 / 1014): the lp-fee
  ceiling step.
- ex-a1000 / ex-a10000: large-amount anchors (out 98699 /
  987899).
- ex-tf-available0 / ex-tf-estimate0 / ex-tf-quote0 (tf100
  amounts 1 / 2 / 3): the same ladder shifted by the fee, with
  the 6039 site moving to the available check for amount 1.
- ex-tf-first / ex-tf-a6 / ex-tf-a10 (tf100 amounts 5 / 6 / 10):
  first tf successes.
- ex-tf-a100 / ex-tf-a101 / ex-tf-a102: the tf plateau pair
  (100 and 101 identical) and the next rung (102).

## Result

Handler shape (instructions/swap/trade_v2.rs): limit is guarded
before amount; available = amount_after_fee(amount); estimate =
available * 10000 / (fee_bps + 10000) with fee_bps = 121 here;
fees are CEILING divisions on the estimate; required = estimate +
lp + protocol; quote = estimate - max(required - available, 0);
preview_total_quote recomputes the total from the estimate fees
and quote_final = estimate - max(preview - amount, 0); the fees
stay pinned to the estimate after the quote is adjusted down;
out = base_for_quote(quote_final) = floor(b * (quote_final - 1) /
(q + quote_final - 1)).

- Guard order: limit 0 gives 6001 ZeroBaseAmount even when amount
  is also 0; amount 0 with limit 1 gives 6002 ZeroQuoteAmount.
- Failure ladder: amount 1 gives estimate 0 -> 6039
  BuyNotEnoughQuoteTokensToCoverFees; amount 2 gives estimate 1
  with fees 1 + 1 > available 2, so quote 0 -> 6040
  BuySlippageBelowMinBaseAmountOut at the estimate_buy_quote
  site; amount 3 gives quote 1, so out 0 -> 6040 at the execute
  site. Same code, two distinct sites for 6040.
- First success: amount 4 gives out 99, spend 4, vault +4,
  buyback 0, event (out 99, max 4, quote 4, lp_bps 10, lp_fee 1,
  protocol_bps 111, protocol_fee 1, quote_with_lp 3,
  user_quote_in 2). Amount 5 gives out 199, spend 5, vault +5.
  Across the early rungs out rises by 100 per unit of quote_final
  (4 -> 99 with quote_final 2, 5 -> 199 with quote_final 3); the
  protocol step breaks the amount link (93 keeps quote_final 90,
  so out stays 8899).
- Protocol step: amounts 92 / 93 move estimate 90 -> 91 and
  protocol 1 -> 2, but out stays 8899 and vault stays +92 while
  spend moves 92 -> 93 and buyback 0 -> 1 -- the step is
  invisible in out and vault, visible only in spend and buyback.
- Lp step: amounts 1013 / 1014 move estimate 1000 -> 1001 and
  lp 1 -> 2, but out stays 99899 and buyback stays 6 while spend
  moves 1013 -> 1014 and vault 1007 -> 1008.
- Limit inclusivity: amount 4 with limit 99 succeeds, limit 100
  gives 6040; amount 100 with limit 9599 succeeds, limit 9600
  gives 6040.
- Event semantics flip vs buy_v2: for buy_exact the BuyEvent
  quote_amount_in field (@64) reports the GROSS amount and the
  user_quote_amount_in field (@112) reports the NET curve quote
  (for buy_v2 @64 is the curve quote and @112 the total user
  quote). Pinned event fields: out @16, max @24, quote @64,
  lp_bps @72, lp_fee @80, protocol_bps @88, protocol_fee @96,
  quote_with_lp @104, user_quote_in @112.
- Transfer-fee overlay (tf100): amount 1 fails 6039 at the
  available check (available 0), not the estimate check -- same
  code as nofee amount 1, different site. Amount 2 fails 6039 at
  the estimate check, amount 3 fails 6040 at the quote-0 site.
  Amount 5 succeeds with out 99, gross spend 5, net vault +4.
  Amount 6 gives out 199, spend 6, vault +5; amount 10 gives out
  599 (vs nofee 699), spend 10, vault +9. Amounts 100 and 101
  give identical results (out 9499, spend 100, vault +98,
  buyback net 0 with gross 1 fully withheld) because both map to
  available 99, while amount 102 jumps to out 9599, spend 101,
  vault +99. Exact-in does not spend the full amount when the
  computed total is lower (amount 101 spends 100).
- All 3 images agree on every case. Error cases roll back
  everything except the payer's 5,000 fee. Success cases charge
  the payer 1,849,400 (1,844,400 volume-accumulator rent + 5,000
  fee) and emit 1 BuyEvent.

Error sites (log paths as emitted by each image):

- ex-limit0-amount0: original programs/pump-amm/src/instructions/swap/trade_v2.rs:752. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:471. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:471. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.
- ex-amount0: original programs/pump-amm/src/instructions/swap/trade_v2.rs:753. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:472. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:472. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.
- ex-limit0: original programs/pump-amm/src/instructions/swap/trade_v2.rs:752. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:471. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:471. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.
- ex-estimate0: original programs/pump-amm/src/instructions/swap/trade_v2.rs:328. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..; control programs/pump-amm/src/instructions/swap/trade_v2.rs:349. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:349. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..
- ex-quote0: original programs/pump-amm/src/instructions/swap/trade_v2.rs:346. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:356. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:356. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.
- ex-out0: original programs/pump-amm/src/instructions/swap/trade_v2.rs:816. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:494. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:494. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.
- ex-first-limit-plus1: original programs/pump-amm/src/instructions/swap/trade_v2.rs:816. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:494. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:494. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.
- ex-a100-limit-plus1: original programs/pump-amm/src/instructions/swap/trade_v2.rs:816. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:494. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:494. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.
- ex-tf-available0: original programs/pump-amm/src/instructions/swap/trade_v2.rs:770. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..; control programs/pump-amm/src/instructions/swap/trade_v2.rs:485. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:485. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..
- ex-tf-estimate0: original programs/pump-amm/src/instructions/swap/trade_v2.rs:328. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..; control programs/pump-amm/src/instructions/swap/trade_v2.rs:349. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:349. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..
- ex-tf-quote0: original programs/pump-amm/src/instructions/swap/trade_v2.rs:346. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:356. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:356. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.

## Limits

Offline LiteSVM synthetic fixture only (same fixture as #33,
clock slot 100). No source change, build, or whole-program
equivalence claim. The thresholds (4, 92/93, 1013/1014) and the
out values are exact for this fixture's curve state and fee
configuration; they are not claimed for other pool states. The
tf override goes through trade_transferfee (as in #33); the
buyback gross/net split under tf follows from the event
protocol_fee and buyback_bps 5000 (floor division), with the net
leg observed as the Token-2022 ATA amount delta.
