# Legacy sell under quote transfer-fee

## Problem

Run 1 #44 pinned only the nofee legacy sell baseline (sell 10^9 ->
+180,212 quote, vault -182,458), and #14 pinned v2 sell quote
transfer-fee. Neither pinned the legacy sell fee legs, the
vault/leg split under a quote transfer fee, the small-amount error
bands, or the sell-side whitelist path -- and legacy sell computes
its payouts differently from v2: it transfers the user leg, the net
protocol leg, the creator leg, and the buyback leg as four separate
pool-signed transfers, and it resolves the buyback accounts
unconditionally (legacy_sell.rs) with an index that depends on
whether creator_fee > 0. This packet pins the legacy sell numbers on
the shared fixture and records where they agree with v2 #14 and
where they do not.

## Cases

All cases sell base on the shared v1/v2 fixture, limit 0 unless
noted, 3 images each (original / #424 control / #427 candidate).
The quote mint carries a Token-2022 transfer-fee extension in tf
cases, so the protocol/creator/buyback legs land in Token-2022 ATAs;
the base mint has no fee, so base deltas are exact.

- nofee: baseline sell 10^9.
- tf100 / tf5000 / tf10000 / tf10001 / tf65535: quote fee at 1%,
  50%, 100%, 100.01%, 655.35% (maxfee u64max).
- tf10000-limit1: 100% fee with limit 1.
- tf100-max100: 1% fee with maxfee cap 100 (cap binding).
- amount0 / amount5000 / amount10000 / amount20000 / amount100000:
  small-amount bands.
- nofee-floor-exact / nofee-floor-plus1, tf100-floor-exact /
  tf100-floor-plus1: slippage floor at the exact net receipt and +1.
- tf100-limit0: 1% fee with limit 0 (accept-anything).
- whitelist: user == global_config.whitelist_pda (353..385 set to
  the payer) with the standard 3-account remaining layout
  (poolv2, owner, buyback).
- whitelist-trimmed / whitelist-tf100-trimmed: same whitelist with
  the poolv2 remaining account dropped (2-account layout).

## Result

User receipts agree with v2 #14 everywhere, but the vault/leg split
does not -- legacy sell keeps the vault outflow at the gross
(minus lp_fee) figure under every fee, and only the recipients'
nets move:

- nofee: user +180,212 (== v2 #14), vault -182,458 (v2: -181,061),
  legs protocol +849, creator +548, buyback +849. Gross curve
  quote is 182,495; lp_fee 37 stays in the vault, so vault out
  (182,458) = user total + net protocol + creator + buyback.
- tf100: user +178,409 (== v2 #14), vault still -182,458, legs
  840 / 542 / 840 = gross legs net of the ceiling transfer fee
  (849 -> 840, 548 -> 542). The vault outflow is tf-blind.
- tf5000: user +90,106 (== v2 #14), vault -182,458, legs
  424 / 274 / 424.
- tf10000: user 0, legs 0, vault still -182,458 (100% withheld).
  tf10000 with limit 1: 6004 ExceededSlippage -- the limit is on
  the net receipt (== v2 #14).
- tf10001 and tf65535: 6023 Overflow in utils/transfer_fee.rs.
- tf100-max100 (cap binding): user +180,112 (== v2 #14 cap) but
  legs stay 840 / 542 / 840 -- the 100 cap binds only on the user
  leg, whose fee (1,803) exceeds it, while leg fees (9 / 6 / 9)
  do not.
- small-amount bands: amount <= 5000 -> 6053
  BuybackFeeRecipientNotAuthorized (curve quote rounds to 0, so
  creator_fee == 0 and get_buyback_accounts reads remaining[0..1]
  = poolv2 + owner instead of owner + buyback); amount 6000..16000
  -> 6023 Overflow (fee subtraction underflows the tiny quote);
  amount >= 17000 succeeds, including amount 20000 with user
  receipt 0 (vault -2, proto 1, creator 1, buyback 0) and amount
  100000 with user 15, vault -17, proto 1, creator 1, buyback 0.
- floors are on the net receipt: the exact limit succeeds and +1
  fails 6004 ExceededSlippage, both nofee and tf100. limit 0
  succeeds (accept-anything, == v2 #31).
- amount0: 6001 ZeroBaseAmount.
- whitelist with the standard 3-account remaining layout: 6053
  BuybackFeeRecipientNotAuthorized -- zeroed fees again put the
  buyback index at 0 (same trap as the small-amount band, and as
  buy #12). Dropping poolv2 succeeds with zero fees: user
  +182,495 (the full gross quote, lp_fee 0), vault -182,495, all
  legs 0; tf100 trimmed: user +180,670 = 182,495 -
  ceil(182,495 * 100 / 10000), vault -182,495, legs 0. Sell
  remaining accounts start at meta 21, so poolv2 is m[21] here
  (buy #12 dropped m[23]).

All 3 images agree on every case. Error cases roll back everything
except the payer's 5,000 fee. Success cases also charge the payer
only 5,000 (legacy sell creates no volume accumulator, unlike buy).

Error sites (log paths as emitted by each image):

- tf10000-limit1: original programs/pump-amm/src/instructions/swap/sell.rs:189. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control programs/pump-amm/src/legacy_sell.rs:152. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate programs/pump-amm/src/legacy_sell.rs:152. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- tf10001: original programs/pump-amm/src/utils/transfer_fee.rs:57. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control AnchorError occurred. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate AnchorError occurred. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- tf65535: original programs/pump-amm/src/utils/transfer_fee.rs:57. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control AnchorError occurred. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate AnchorError occurred. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- amount0: original programs/pump-amm/src/instructions/swap/sell.rs:110. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.; control programs/pump-amm/src/legacy_sell.rs:100. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.; candidate programs/pump-amm/src/legacy_sell.rs:100. Error Code: ZeroBaseAmount. Error Number: 6001. Error Message: ZeroBaseAmount.
- amount5000: original programs/pump-amm/src/state/global_config.rs:326. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.; control programs/pump-amm/src/state/global_config.rs:43. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.; candidate programs/pump-amm/src/state/global_config.rs:43. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.
- amount10000: original programs/pump-amm/src/instructions/swap/sell.rs:179. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/legacy_sell.rs:150. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- nofee-floor-plus1: original programs/pump-amm/src/instructions/swap/sell.rs:189. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control programs/pump-amm/src/legacy_sell.rs:152. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate programs/pump-amm/src/legacy_sell.rs:152. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- tf100-floor-plus1: original programs/pump-amm/src/instructions/swap/sell.rs:189. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control programs/pump-amm/src/legacy_sell.rs:152. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate programs/pump-amm/src/legacy_sell.rs:152. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- whitelist: original programs/pump-amm/src/state/global_config.rs:326. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.; control programs/pump-amm/src/state/global_config.rs:43. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.; candidate programs/pump-amm/src/state/global_config.rs:43. Error Code: BuybackFeeRecipientNotAuthorized. Error Number: 6053. Error Message: Buyback fee recipient not authorized.

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The v2 comparison numbers are cited from the
prior packets #14 (v2 sell quote tf) and #44 (legacy sell nofee
baseline) on the same fixture and images, not re-measured here.
The whitelist finding is about the legacy handler's
remaining-account indexing, not about a deployed whitelist
configuration. The small-amount band edges are reported at the
tested points (6053 at <= 5000, 6023 at 6000..16000, success at
>= 17000); the exact integer thresholds between the tested points
were not bisected.
