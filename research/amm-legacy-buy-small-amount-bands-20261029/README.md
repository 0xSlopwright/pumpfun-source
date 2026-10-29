# Legacy buy (non-exact) small-amount bands

## Problem

Packet #17 pinned the legacy `buy` spend plateau and the buyback
onset only as spot points (amounts 1, 5479, 5480, 586315, 586316),
and packets #15/#16 did the exact-threshold bisect job for the
legacy sell and buy_exact small bands. The non-exact buy curve
bottom -- where each fee leg steps, and how transfer fees shift
the buyback onset -- was never bisected to exact integers.

## Cases

All cases legacy `buy` (amount = base out, limit = max quote in)
on the shared v1/v2 fixture, 3 images each. The quote mint carries
a Token-2022 transfer-fee extension in tf cases, so the
protocol/creator/buyback legs land in Token-2022 ATAs; the base
mint has no fee, so base deltas are exact. Limit is 10^12 unless
stated. Each band is pinned as a last/first pair (bisect: the
lower amount has the old value, the next integer has the new one).

- nofee-q1-last / nofee-q2-first (5479 / 5480): the quote 1 -> 2
  step (anchor re-pinned from #17).
- nofee-q2-last / nofee-q3-first (10959 / 10960): the quote 2 -> 3
  step.
- nofee-bb1-last / nofee-bb1-first (586315 / 586316): the buyback
  0 -> 1 step (anchor from #17).
- nofee-bb2-last / nofee-bb2-first (1764427 / 1764428): the
  buyback 1 -> 2 step.
- nofee-creator1-last / nofee-creator2-first (1824702 / 1824703):
  the creator-fee 1 -> 2 step.
- nofee-lp1-last / nofee-lp2-first (27397933 / 27397934): the
  lp-fee 1 -> 2 step.
- tf100-plateau-last / tf100-plateau-first, tf5000-plateau-last /
  tf5000-plateau-first (5479 / 5480 under each fee): the plateau
  boundary under transfer fees.
- tf100-bbnet-last / tf100-bbnet-first, tf5000-bbnet-last /
  tf5000-bbnet-first (1764427 / 1764428 under each fee): the
  transfer-fee buyback-net onset.
- nofee-limit-exact-q3 / nofee-limit-minus1-q3 (amount 10960,
  limit 6 / 5): limit inclusivity at the quote-3 boundary.

## Result

Curve math, verified against every case: quote = ceil(q * amount /
(b - amount)); vault quote = quote + lp_fee; lp_fee = ceil(quote *
2 / 10000); protocol_fee = ceil(quote * 93 / 10000); creator_fee =
ceil(quote * 30 / 10000); buyback = floor(protocol_fee / 2); the
protocol ATA receives protocol_fee - buyback; user spend = vault
quote + net protocol + creator + buyback.

- Quote steps: 1 -> 2 at amount 5480 (vault 2 -> 3, spend 4 -> 5,
  legs 1/1/0 unchanged); 2 -> 3 at amount 10960 (vault 3 -> 4,
  spend 5 -> 6, legs unchanged).
- Buyback steps: 0 -> 1 at amount 586316 (quote 107 -> 108,
  protocol 1 -> 2, vault 108 -> 109, spend 110 -> 112); 1 -> 2 at
  amount 1764428 (quote 322 -> 323, protocol 3 -> 4, protocol net
  unchanged at 2, vault 323 -> 324, spend 327 -> 329).
- Creator step: 1 -> 2 at amount 1824703 (quote 333 -> 334, vault
  334 -> 335, spend 339 -> 341, protocol 4 = 2 + 2 and buyback 2
  unchanged across it).
- Lp step: 1 -> 2 at amount 27397934 (quote 5000 -> 5001, vault
  jumps 5001 -> 5003 because quote +1 and lp +1, spend jumps
  5063 -> 5066 because vault +2 and creator +1, protocol 47 =
  24 + 23 and buyback 23 unchanged).
- Transfer-fee plateau: the curve is unchanged by tf, so the
  plateau boundary is the same pair under fees -- tf100 spends
  5 / 6, tf5000 spends 6 / 8 at 5479 / 5480, with legs fully
  withheld at the bottom (0/0/0). Spend = gross pool + gross
  legs: tf100 5479 is gross pool ceil(2*10000/9900) = 3 plus
  legs 1+1+0 = 5; tf5000 5479 is gross pool 4 plus 2 = 6.
- Transfer-fee buyback-net onset: the same amounts 1764427 /
  1764428, but for a different reason than the nofee step.
  Nominal buyback 1 is fully withheld by any fee (ceil(1*100/
  10000) = 1, ceil(1*5000/10000) = 1), so net buyback first
  appears at nominal buyback 2, which withholds only 1 and nets
  1 -- under both tf100 (spend 331 / 333, legs 1/0/0 -> 1/0/1)
  and tf5000 (spend 650 / 653, legs 1/0/0 -> 1/0/1).
- Limit inclusivity at the quote-3 boundary: amount 10960 with
  limit 6 succeeds (spend exactly 6), limit 5 gives 6004
  ExceededSlippage.
- All 3 images agree on every case. Error cases roll back
  everything except the payer's 5,000 fee. Success cases charge
  the payer 1,849,400 (1,844,400 volume-accumulator rent + 5,000
  fee) and emit 1 BuyEvent.

Error sites (log paths as emitted by each image):

- nofee-limit-minus1-q3: original programs/pump-amm/src/instructions/swap/buy.rs:405. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control programs/pump-amm/src/instructions/swap/buy.rs:272. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate programs/pump-amm/src/instructions/swap/buy.rs:272. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The thresholds (5480, 10960, 586316, 1764428,
1824703, 27397934) are exact for this fixture's curve state and
fee configuration; they are not claimed for other pool states.
The tf override must go through adapt_sell_helper (as in
#12/#16/#17): the raw transfer-fee override leaves the buy
harness's remaining accounts unadapted and every tf case then
fails 6062 InvalidPoolV2, a harness artifact, not handler
behavior.
