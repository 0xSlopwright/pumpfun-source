# Legacy sell: first positive net receipt under transfer fee

## Problem

Packet #15 bisected the legacy sell small-amount bands only for the
nofee case (6053 -> 6023 at 5479/5480, 6023 -> success at 16438/16439,
zero -> positive gross receipt at 21918/21919) and showed only that a
1% quote transfer fee delays the first positive net receipt past
21919. Where that first positive net receipt actually lands, how it
moves with the fee rate, whether a fee cap moves it, and whether the
error bands themselves move under a fee were all unmeasured.

## Cases

All cases sell base on the shared v1/v2 fixture, limit 0, 3 images
each. The quote mint carries a Token-2022 transfer-fee extension in
tf cases, so the protocol/creator/buyback legs land in Token-2022
ATAs; the base mint has no fee, so base deltas are exact.

- amount21918 / 21919 / 27397 / 27398 / 32877 / 32878 / 38357 / 38358
  / 43836 / 43837 / 71234 / 71235: the nofee gross-receipt ladder,
  re-pinned (receipt 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 9, 10).
- tf100-amount27397 / 27398 and tf5000-amount27397 / 27398: first
  positive net at gross 2.
- tf5001-amount32877 / 32878: first positive net at gross 3.
- tf6667-amount38357 / 38358: first positive net at gross 4.
- tf8000-amount43836 / 43837: first positive net at gross 5.
- tf9000-amount71234 / 71235: first positive net at gross 10.
- tf100max0-amount21918 / 21919: cap 0 restores the nofee boundary.
- tf100max1-amount27397 / 27398: cap 1 does not move the tf100
  boundary.
- tf100-amount71235 / tf5000-amount71235: mid-ladder anchors
  (gross 10 nets 9 / 5).
- tf5000-amount5479 / 5480 / 16438 / 16439 and
  tf10000-amount5479 / 5480 / 16438 / 16439 / 100000: the error
  bands under fee, plus tf10000 never paying a positive net.

## Result

- The vault always moves the GROSS total, fee-blind: vault delta is
  -(gross user receipt + 2) in every case (legs gross 1/1/0), e.g.
  tf9000 at 71235 moves vault -12 exactly like nofee at 71235.
- Each recipient nets gross minus ceil(gross * bps / 10000) in the executed cases (the user's withheld deltas in TransferFeeAmount match exactly). maxfee=0 removes all withholding. maxfee=1 never binds at the executed amounts. A 1-unit gross leg
  is fully withheld at any nonzero bps (ceil(1 * bps / 10000) = 1),
  so legs net 0/0/0 in every tf case here.
- The user's first positive net receipt lands at the first amount
  whose gross receipt G satisfies ceil(G * bps / 10000) = G - 1:
  bps 100 and 5000 -> G = 2 (amount 27398); bps 5001 -> G = 3
  (32878, since gross 2 withholds ceil(2 * 5001 / 10000) = 2);
  bps 6667 -> G = 4 (38358, since gross 3 withholds 3); bps 8000
  -> G = 5 (43837, since gross 4 withholds 4); bps 9000 -> G = 10
  (71235, since gross 9 withholds 9 and gross 10 withholds 9).
  At each probed pair the tf boundary falls on the same adjacent amounts as the nofee gross steps 1->2 (27397/27398), 2->3 (32877/32878), 3->4 (38357/38358), 4->5 (43836/43837) and 9->10 (71234/71235). The gross 5->9 steps are not probed.
- Cap 0 restores the nofee boundary exactly: tf100max0 at 21918
  nets 0 with legs 1/1/0, at 21919 nets 1 with legs 1/1/0 -- no
  withholding at all. Cap 1 does not move the tf100 boundary:
  tf100max1 at 27397 nets 0, at 27398 nets 1, legs 0/0/0 -- the
  gross-1 unit was already fully withheld uncapped.
- Mid-ladder anchors confirm the same rule above the first step:
  gross 10 nets 9 under tf100 (withheld 1) and 5 under tf5000
  (withheld 5), vault -12 in both, legs 0/0/0.
- The error bands are fee-blind: tf5000 and tf10000 give the same
  6053 at 5479, 6023 at 5480 and 16438, and success at 16439 as
  nofee. In every error receipt the program fails before any Token-2022 TransferChecked is invoked (6053 at original global_config.rs:326, 6023 at sell.rs:179/183), so no transfer fee is ever applied in these cases. The underlying cause of the bands is not isolated here.
- tf10000 pays no positive net receipt at either executed success amount: 16439 (gross 0) and 100000 (user nets 0, gross 15 fully withheld, vault -17, legs 0/0/0). That 10000 bps withholds every gross amount follows from the ceiling rule and is not exhaustively executed.
- All 3 images agree on every case. Error cases roll back
  everything except the payer's 5,000 fee. Success cases also charge the payer only 5,000 lamports (no account creation is observed in these sell receipts).

Error sites (log paths as emitted by each image):

- tf5000-amount5479: original programs/pump-amm/src/state/global_config.rs:326. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.; control programs/pump-amm/src/state/global_config.rs:43. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.; candidate programs/pump-amm/src/state/global_config.rs:43. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.
- tf5000-amount5480: original programs/pump-amm/src/instructions/swap/sell.rs:179. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- tf5000-amount16438: original programs/pump-amm/src/instructions/swap/sell.rs:183. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- tf10000-amount5479: original programs/pump-amm/src/state/global_config.rs:326. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.; control programs/pump-amm/src/state/global_config.rs:43. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.; candidate programs/pump-amm/src/state/global_config.rs:43. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.
- tf10000-amount5480: original programs/pump-amm/src/instructions/swap/sell.rs:179. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- tf10000-amount16438: original programs/pump-amm/src/instructions/swap/sell.rs:183. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.

## Limits

- `producer.py` regenerated these receipts on the author's machine: it hard-codes
  `~/workspace/pumpfun-sparse` and reads the control/candidate images from
  `~/workspace/slop-verify`, so it does not run from this packet unmodified. The control
  and candidate are the gunzipped in-repo #424/#427 artifacts
  (`research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz`,
  `research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz`), which
  `verify.py` reads directly.

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The thresholds are exact for this fixture's
curve state (virtual reserves and fee parameters as snapshotted);
they are not claimed for other pool states. The bps -> gross-level
rule is pinned at the probed representatives (100, 5000, 5001,
6667, 8000, 9000), not at every bps value; the formula
net = gross - ceil(gross * bps / 10000) is the Token-2022
withholding rule as observed in the receipts. The whitelist finding
from #12/#13 is not revisited here.
