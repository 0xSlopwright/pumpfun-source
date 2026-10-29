# Legacy buy (non-exact) quote transfer-fee math

## Problem

Packet #25 pinned legacy `buy` only at one no-fee point (10^10
base out spends 1,847,796). Packets #12/#13/#14 covered buy_exact
quote fees, sell quote fees, and the legacy base leg, but the
non-exact buy quote leg -- where the amount is base out and the
limit is max quote in -- was unpinned: how the pool leg is grossed
up, how the fee legs are withheld, where small amounts plateau,
what the limit must cover, and whether the whitelist trap from
#12/#13 also bites this third handler.

## Cases

All cases legacy `buy` on the shared v1/v2 fixture, 3 images each.
The quote mint carries a Token-2022 transfer-fee extension in tf
cases, so the protocol/creator/buyback legs land in Token-2022
ATAs; the base mint has no fee, so base deltas are exact. Limit is
10^12 unless stated.

- nofee-amount1 / amount5479 / amount5480: the spend plateau and
  its top edge (spend 4, vault 2, legs 1/1/0 below the edge).
- nofee-amount586315 / amount586316: the buyback onset (last
  buyback 0, first buyback 1).
- nofee-amount1e7 / amount1e9 / amount1e10: scaling anchors
  (spend 1,849 / 184,779 / 1,847,796).
- tf100 / tf5000 at amounts 1, 5479, 5480, 1e7, 1e9, 1e10: the
  same points under fees (vault leg grossed up, fee legs net).
- tf10000-amount1 / tf10000-amount1e10: 100% fee at both ends.
- tf100-max100 / tf5000-max100 / tf100-max10000 at amount 1e10:
  per-transfer fee caps.
- nofee-limit-minus1 / nofee-limit-exact, tf100-limit-minus1 /
  tf100-limit-exact, tf5000-limit-minus1 / tf5000-limit-exact:
  the limit rule at amount 1e10.
- amount0, limit0: the zero guards.
- whitelist-standard / whitelist-trimmed /
  whitelist-trimmed-tf100 at amount 1e10: user == whitelist_pda.

## Result

- Spend plateau: amounts 1..5479 spend exactly 4 nofee, 5 tf100,
  6 tf5000 (vault 2, legs 1/1/0 nofee, 0/0/0 under fees -- the
  1-unit legs are fully withheld by any fee). Amount 5480 spends
  5 / 6 / 8 (vault 3). The plateau top 5479 is an exact bisect
  (5479 spends 4, 5480 spends 5 nofee).
- Buyback onset: amount 586315 is the last buyback 0 (spend 110,
  vault 108, legs 1/1/0); 586316 is the first buyback 1 (spend
  112, vault 109, legs 1/1/1). Exact bisect.
- Large amounts: nofee 10^10 spends 1,847,796 (vault 1,825,348,
  legs 8487/5475/8486). tf100 spends 1,866,234 (vault unchanged
  1,825,348, legs 8402/5420/8401 = nominal minus ceiling
  withholding: 8,487-85, 5,475-55, 8,486-85). tf5000 spends
  3,673,144 (legs 4243/2737/4243 = nominal minus 4,244/2,738/
  4,243). The pool leg is grossed up -- tf100 gross pool
  1,843,786 = ceil(1,825,348 x 10000/9900), tf5000 gross pool
  3,650,696 = 1,825,348 x 2 -- while the fee legs are transferred
  at nominal value and the recipients receive net.
- Caps bind spend only through the pool leg: tf100-max100 and
  tf5000-max100 both spend nofee + 100 = 1,847,896 (pool-leg fee
  capped at 100). tf100 leg fees (85/55/85) are below the cap, so
  tf100-max100 leg receipts equal uncapped tf100; tf5000 leg
  receipts show capped withholding (8387/5375/8386 = nominal -
  100 each). tf100-max10000 spends nofee + 10,000 = 1,857,796.
- tf10000 gives 6023 Overflow at every amount, unlike buy_exact's
  6039: non-exact buy has no net > 0 pre-check, and the pool-leg
  gross-up amount_before_fee divides by (10000 - 10000).
- Limit is the full user spend, inclusive: nofee 1,847,796,
  tf100 1,866,234, tf5000 3,673,144, tf100-max100 1,847,896;
  minus 1 gives 6004 ExceededSlippage in every case. The check
  uses total = pool_quote + full (pre-split) protocol fee +
  creator fee, plus quote_transfer_fee = gross_pool - pool_quote;
  since the full protocol fee = net + buyback, total + fee =
  full spend exactly.
- amount0 -> 6001 ZeroBaseAmount, limit0 -> 6002 ZeroQuoteAmount.
- Whitelist: standard layout -> 6053
  BuybackFeeRecipientNotAuthorized, the same trap as #12/#13 on a
  third handler (fees zeroed, remaining-account index stuck at 0,
  poolv2 read as the buyback owner). Trimmed layout succeeds with
  fees 0: spend = curve 1,824,983, vault +1,824,983; tf100
  trimmed spends 1,843,418 = ceil(1,824,983 x 10000/9900), vault
  +1,824,983. The trimmed nofee case also reveals the curve
  itself: lp_fee = 1,825,348 - 1,824,983 = 365, full protocol fee
  = 8,487 + 8,486 = 16,973.
- All 3 images agree on every case. Error cases roll back
  everything except the payer's 5,000 fee. Success cases charge
  the payer 1,849,400 (1,844,400 volume-accumulator rent + 5,000
  fee) and emit 1 BuyEvent.

Error sites (log paths as emitted by each image):

- tf10000-amount1: original programs/pump-amm/src/utils/transfer_fee.rs:67. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/utils/transfer_fee.rs:35. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/utils/transfer_fee.rs:67. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- tf10000-amount1e10: original programs/pump-amm/src/utils/transfer_fee.rs:67. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/utils/transfer_fee.rs:35. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/utils/transfer_fee.rs:67. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- nofee-limit-minus1: original programs/pump-amm/src/instructions/swap/buy.rs:405. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control programs/pump-amm/src/instructions/swap/buy.rs:272. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate programs/pump-amm/src/instructions/swap/buy.rs:272. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- tf100-limit-minus1: original programs/pump-amm/src/instructions/swap/buy.rs:405. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control programs/pump-amm/src/instructions/swap/buy.rs:272. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate programs/pump-amm/src/instructions/swap/buy.rs:272. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- tf5000-limit-minus1: original programs/pump-amm/src/instructions/swap/buy.rs:405. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control programs/pump-amm/src/instructions/swap/buy.rs:272. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate programs/pump-amm/src/instructions/swap/buy.rs:272. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- amount0: original programs/pump-amm/src/instructions/swap/buy.rs:326. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.; control programs/pump-amm/src/instructions/swap/buy.rs:150. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.; candidate programs/pump-amm/src/instructions/swap/buy.rs:150. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.
- limit0: original programs/pump-amm/src/instructions/swap/buy.rs:327. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.; control programs/pump-amm/src/instructions/swap/buy.rs:151. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.; candidate programs/pump-amm/src/instructions/swap/buy.rs:151. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.
- whitelist-standard: original programs/pump-amm/src/state/global_config.rs:326. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.; control programs/pump-amm/src/state/global_config.rs:43. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.; candidate programs/pump-amm/src/state/global_config.rs:43. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The plateau top (5479), the buyback onset
(586316), and the fee splits are exact for this fixture's curve
state and fee configuration; they are not claimed for other pool
states. The tf override must go through adapt_sell_helper (as in
#12/#16): the raw transfer-fee override leaves the buy harness's
remaining accounts unadapted and every tf case then fails 6062
InvalidPoolV2, a harness artifact, not handler behavior.
