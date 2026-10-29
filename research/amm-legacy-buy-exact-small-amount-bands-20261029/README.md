# Legacy buy_exact small-amount bands (exact)

## Problem

Packet #12 pinned legacy `buy_exact_quote_in` only at single
points: amount1 -> 6039, amount0 -> 6002, limit0 -> 6001, and the
floors at amount 10^7. The exact small-amount bands -- where the
6039 fee-coverage failure gives way to the 6040 slippage failure
and then to success, and how a quote transfer fee shifts those
edges -- were unbisected. This packet bisects them on the original
image and pins the boundary amounts on all 3 images (original /
#424 control / #427 candidate), nofee and under quote transfer
fees, so the band edges are exact numbers rather than intervals.

## Cases

All cases buy_exact on the shared v1/v2 fixture, limit 1 unless
stated, 3 images each. The quote mint carries a Token-2022
transfer-fee extension in tf cases, so the protocol/creator/buyback
legs land in Token-2022 ATAs; the base mint has no fee, so base
deltas are exact.

- nofee-amount1 / amount2: the 6039 band, both sides of its top.
- nofee-amount3 / amount4: the 6040 band, both sides of its top.
- nofee-amount5 / amount10 / amount100: first success and larger
  successes (base 5479 / 32877 / 526040, legs 1/1/0 throughout).
- tf100-amount2 / amount3: the shifted 6039 band.
- tf100-amount4 / amount5: the shifted 6040 band.
- tf100-amount6 / amount10 / amount100: first success and larger
  successes (base 5479 / 27397 / 520560, legs 0/0/0 throughout --
  the 1-unit legs are fully withheld by the 1% fee).
- tf5000-amount5: the 6039 band top under a 50% fee.
- tf5000-amount6 / amount9: the 6040 band, both sides of its top.
- tf5000-amount10: first success (base 5479, spend 8, legs 0/0/0).
- tf10000-amount1000: 6039 under a 100% fee (== #12 at 10^7).
- nofee-floor-exact / nofee-floor-plus1: amount 5, limit 5479
  succeeds, limit 5480 -> 6040.
- tf100-floor-exact / tf100-floor-plus1: amount 6, limit 5479
  succeeds, limit 5480 -> 6040.

## Result

- Nofee bands: amounts 1..2 -> 6039
  BuyNotEnoughQuoteTokensToCoverFees, 3..4 -> 6040
  BuySlippageBelowMinBaseAmountOut, >= 5 success.
- tf100 bands: amounts 2..3 -> 6039, 4..5 -> 6040, >= 6 success.
  The 1% fee shifts both edges by exactly +1 amount (the 6039
  edge moves from 2 to 3, the success edge from 5 to 6).
- tf5000 bands: amount 5 -> 6039 (amounts 1..5 all probed 6039 on
  the original image; only amount 5 is a receipt case), 6..9 ->
  6040, >= 10 success. The 50% fee widens the 6039 band to 5
  amounts and the 6040 band to 4 amounts.
- tf10000 at amount 1000 -> 6039, matching #12 at 10^7: a 100%
  fee leaves nothing to cover fees at any amount.
- Boundary successes pin the fee-eaten legs: nofee amount 5 gives
  base 5479, vault quote 3, legs 1/1/0; tf100 amount 6 gives the
  same base 5479 for spend 6 with legs 0/0/0; tf5000 amount 10
  gives base 5479 for spend 8 with legs 0/0/0. Spends under fees
  are below the nominal amount (tf5000 amount 10 spends 8), the
  same legacy behavior seen at 10^7 in #12.
- Floors at small amounts are net base_out based: nofee amount 5
  limit 5479 succeeds and 5480 -> 6040; tf100 amount 6 limit 5479
  succeeds and 5480 -> 6040.
- All 3 images agree on every case. Error cases roll back
  everything except the payer's 5,000 fee. Success cases charge
  the payer 1,849,400 (1,844,400 volume-accumulator rent + 5,000
  fee) and emit 1 BuyEvent.

Error sites (log paths as emitted by each image):

- nofee-amount1: original programs/pump-amm/src/instructions/swap/buy.rs:700. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..; control programs/pump-amm/src/instructions/swap/buy.rs:197. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..; candidate programs/pump-amm/src/instructions/swap/buy.rs:197. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..
- nofee-amount2: original AnchorError occurred. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..; control AnchorError occurred. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..; candidate AnchorError occurred. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..
- nofee-amount3: original programs/pump-amm/src/instructions/swap/buy.rs:733. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; control programs/pump-amm/src/instructions/swap/buy.rs:216. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; candidate programs/pump-amm/src/instructions/swap/buy.rs:216. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.
- nofee-amount4: original programs/pump-amm/src/instructions/swap/buy.rs:776. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; control programs/pump-amm/src/instructions/swap/buy.rs:270. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; candidate programs/pump-amm/src/instructions/swap/buy.rs:270. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.
- tf100-amount2: original programs/pump-amm/src/instructions/swap/buy.rs:700. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..; control programs/pump-amm/src/instructions/swap/buy.rs:197. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..; candidate programs/pump-amm/src/instructions/swap/buy.rs:197. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..
- tf100-amount3: original AnchorError occurred. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..; control AnchorError occurred. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..; candidate AnchorError occurred. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..
- tf100-amount4: original programs/pump-amm/src/instructions/swap/buy.rs:733. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; control programs/pump-amm/src/instructions/swap/buy.rs:216. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; candidate programs/pump-amm/src/instructions/swap/buy.rs:216. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.
- tf100-amount5: original programs/pump-amm/src/instructions/swap/buy.rs:776. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; control programs/pump-amm/src/instructions/swap/buy.rs:270. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; candidate programs/pump-amm/src/instructions/swap/buy.rs:270. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.
- tf5000-amount5: original AnchorError occurred. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..; control AnchorError occurred. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..; candidate AnchorError occurred. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..
- tf5000-amount6: original programs/pump-amm/src/instructions/swap/buy.rs:733. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; control programs/pump-amm/src/instructions/swap/buy.rs:216. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; candidate programs/pump-amm/src/instructions/swap/buy.rs:216. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.
- tf5000-amount9: original programs/pump-amm/src/instructions/swap/buy.rs:776. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; control programs/pump-amm/src/instructions/swap/buy.rs:270. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; candidate programs/pump-amm/src/instructions/swap/buy.rs:270. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.
- tf10000-amount1000: original programs/pump-amm/src/instructions/swap/buy.rs:646. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..; control programs/pump-amm/src/instructions/swap/buy.rs:156. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..; candidate programs/pump-amm/src/instructions/swap/buy.rs:156. Error Code: BuyNotEnoughQuoteTokensToCoverFees. Error Number: 6039. Error Message: buy: Not enough quote tokens to cover for fees..
- nofee-floor-plus1: original programs/pump-amm/src/instructions/swap/buy.rs:776. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; control programs/pump-amm/src/instructions/swap/buy.rs:270. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; candidate programs/pump-amm/src/instructions/swap/buy.rs:270. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.
- tf100-floor-plus1: original programs/pump-amm/src/instructions/swap/buy.rs:776. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; control programs/pump-amm/src/instructions/swap/buy.rs:270. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.; candidate programs/pump-amm/src/instructions/swap/buy.rs:270. Error Code: BuySlippageBelowMinBaseAmountOut. Error Number: 6040. Error Message: buy: slippage - would buy less tokens than expected min_base_amount_out.

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The thresholds are exact for this fixture's
curve state (virtual reserves and fee parameters as snapshotted);
they are not claimed for other pool states. The whitelist finding
from #12 is not revisited here. The tf override must go through
adapt_sell_helper (as in #12): the raw transfer-fee override leaves
the buy harness's remaining accounts unadapted and every tf case
then fails 6062 InvalidPoolV2, a harness artifact, not handler
behavior.
