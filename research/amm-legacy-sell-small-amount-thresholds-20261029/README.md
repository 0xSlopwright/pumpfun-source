# Legacy sell small-amount thresholds (exact)

## Problem

Packet #13 pinned the legacy sell small-amount bands only at tested
points: 6053 at amount <= 5000, 6023 at 6000..16000, success at
>= 17000. The exact integer thresholds between those points were
explicitly left unbisected. This packet bisects them on the original
image and pins the boundary amounts on all 3 images (original /
#424 control / #427 candidate), nofee and under a 1% quote transfer
fee, so the band edges are exact numbers rather than intervals.

## Cases

All cases sell base on the shared v1/v2 fixture, limit 0, 3 images
each. The quote mint carries a Token-2022 transfer-fee extension in
tf100 cases, so the protocol/creator/buyback legs land in Token-2022
ATAs; the base mint has no fee, so base deltas are exact.

- amount5000 / amount10000 / amount20000 / amount100000: anchors
  carried over from #13 (6053 / 6023 / receipt 0 / receipt 15).
- amount5479 / amount5480: the 6053 -> 6023 edge, both sides.
- amount16438 / amount16439: the 6023 -> success edge, both sides.
- amount21918 / amount21919: the zero -> positive user receipt
  edge, both sides.
- tf100-amount5479 / tf100-amount5480 / tf100-amount16438 /
  tf100-amount16439 / tf100-amount21919: the same edges under a 1%
  quote transfer fee.

## Result

- 6053 -> 6023 boundary: amount 5479 is the last 6053
  BuybackFeeRecipientNotAuthorized, amount 5480 the first 6023
  Overflow. The boundary is fee-blind: tf100 gives the same codes
  at 5479 and 5480 (the band is driven by the curve quote and the
  fee-subtraction underflow, both computed before any transfer fee
  is withheld from the legs).
- 6023 -> success boundary: amount 16438 is the last 6023,
  amount 16439 the first success, with user receipt 0, vault -2,
  proto 1, creator 1, buyback 0. Also fee-blind: tf100 at 16438 is
  6023 and at 16439 a success with receipt 0 and legs 0 / 0 / 0 --
  the 1-unit leg fees are fully withheld by the 1% fee
  (ceil(1 * 100 / 10000) = 1).
- Zero -> positive receipt boundary (nofee): amount 21918 is the
  last success with user receipt 0 (vault -2, proto 1, creator 1,
  buyback 0), amount 21919 the first with a positive receipt
  (user +1, vault -3, proto 1, creator 1, buyback 0). This boundary
  is NOT fee-blind: under tf100, amount 21919 still receipts 0
  (the single unit is withheld as fee), legs 0 / 0 / 0, vault -3.
- Anchors agree with #13 exactly: 5000 -> 6053, 10000 -> 6023,
  20000 -> receipt 0 with vault -2, 100000 -> user 15, vault -17,
  proto 1, creator 1, buyback 0.
- All 3 images agree on every case. Error cases roll back
  everything except the payer's 5,000 fee. Success cases also
  charge the payer only 5,000 (legacy sell creates no volume
  accumulator, unlike buy).

Error sites (log paths as emitted by each image):

- amount5000: original programs/pump-amm/src/state/global_config.rs:326. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.; control programs/pump-amm/src/state/global_config.rs:43. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.; candidate programs/pump-amm/src/state/global_config.rs:43. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.
- amount5479: original programs/pump-amm/src/state/global_config.rs:326. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.; control programs/pump-amm/src/state/global_config.rs:43. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.; candidate programs/pump-amm/src/state/global_config.rs:43. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.
- amount5480: original programs/pump-amm/src/instructions/swap/sell.rs:179. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- amount10000: original programs/pump-amm/src/instructions/swap/sell.rs:179. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- amount16438: original programs/pump-amm/src/instructions/swap/sell.rs:183. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- tf100-amount5479: original programs/pump-amm/src/state/global_config.rs:326. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.; control programs/pump-amm/src/state/global_config.rs:43. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.; candidate programs/pump-amm/src/state/global_config.rs:43. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.
- tf100-amount5480: original programs/pump-amm/src/instructions/swap/sell.rs:179. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- tf100-amount16438: original programs/pump-amm/src/instructions/swap/sell.rs:183. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The thresholds are exact for this fixture's
curve state (virtual reserves and fee parameters as snapshotted);
they are not claimed for other pool states. The whitelist finding
from #12/#13 is not revisited here.
