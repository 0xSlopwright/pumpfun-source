# Legacy buy_exact_quote_in under quote transfer-fee

## Problem

Run 1 #25 pinned only the nofee baseline of legacy `buy_exact_quote_in`
(base 54,115,018,303 for 10^7 quote, identical to v2), #12 pinned v2
buy_exact quote transfer-fee, #46 pinned v2 buy_exact base transfer-fee,
and #31 pinned v2 buy_exact zeros. None of them pinned the legacy exact
path's quote-fee math, its fee split, or the whitelist zero-fee path --
and the legacy path computes fees differently from v2: legacy
`buy.rs` estimates `available*10000/(total_bps+10000)`, takes
`curve = min(available - lp - protocol - creator, estimate)`, and
grosses up only the pool leg via `amount_before_fee(curve + lp_fee)`,
while v2 `trade_v2.rs` runs `estimate_buy_quote` plus
`preview_total_quote`. This packet pins the legacy exact numbers on
the shared fixture and records where they agree with v2 and where
they do not.

## Cases

All cases use amount 10^7 quote unless noted, limit 1 unless noted,
on the shared v1/v2 fixture, 3 images each (original / #424 control /
#427 candidate). The quote mint carries a Token-2022 transfer-fee
extension in tf cases, so the protocol/creator/buyback legs land in
Token-2022 ATAs; the base mint has no fee, so base deltas are exact.

- nofee: baseline.
- tf100 / tf5000 / tf10000 / tf10001 / tf65535: quote fee at 1%,
  50%, 100%, 100.01%, 655.35% (maxfee u64max).
- tf100-max100: 1% fee with maxfee cap 100 (cap binding).
- amount0 / limit0 / amount1: zero and unit-amount edges.
- nofee-floor-exact / nofee-floor-plus1, tf100-floor-exact /
  tf100-floor-plus1: slippage floor at the exact base_out and +1.
- whitelist: user == global_config.whitelist_pda (353..385 set to
  the payer) with the standard 3-account remaining layout.
- whitelist-trimmed / whitelist-tf100-trimmed: same whitelist with
  the poolv2 remaining account dropped (2-account layout).

## Result

Base delivery agrees with v2 everywhere, but the quote split does
not -- legacy exact takes more total quote fees than v2 exact on the
same fixture:

- nofee: base +54,115,018,303 (== v2), spent 10,000,000, vault quote
  +9,878,518 (v2: +9,954,074, delta 75,556), fee legs protocol
  +45,926, creator +29,630, buyback +45,926 (total 121,482 vs v2's
  implied 45,926). Same base delivery, different quote split.
- tf100: base +53,573,907,921 (== v2 #12), spent 9,998,786 (v2:
  9,999,541, delta 755), vault +9,779,732, legs 45,012 / 29,040 /
  45,012.
- tf5000: base +27,058,593,160 (== v2 #12), spent 9,939,259 (v2:
  9,977,037, delta 37,778), vault +4,939,259, legs 11,481 / 7,407 /
  11,481.
- tf10000: 6039 BuyNotEnoughQuoteTokensToCoverFees (== v2 #12).
  tf10001 and tf65535: 6023 Overflow in utils/transfer_fee.rs
  (== v2 #12's overflow site).
- tf100-max100 (cap binding): base +54,114,475,911 (== v2 #12 cap),
  spent 10,000,000, vault +9,878,419, legs 45,826 / 29,530 / 45,825.
- amount0: 6002 ZeroQuoteAmount; limit0: 6001 ZeroBaseAmount
  (== v2 #31). amount1: 6039 -- the unit is eaten by fee estimation.
- floors are on the net base_out: the exact base_out limit succeeds
  and +1 fails 6040 BuySlippageBelowMinBaseAmountOut, both nofee and
  tf100.
- whitelist with the standard 3-account remaining layout: 6053
  BuybackFeeRecipientNotAuthorized. Cause: zeroed fees make
  creator_fee == 0, so the remaining-account index stays at 0 and
  get_buyback_accounts reads poolv2+owner instead of owner+buyback.
  Dropping poolv2 succeeds with zero fees: nofee base
  +54,791,407,798, vault +10,000,000, all legs 0; tf100 base
  +54,243,537,781, vault +9,900,000, all legs 0. v2 trade has no
  whitelist path at all (no whitelist reference in trade_v2.rs).

All 3 images agree on every case. Error cases roll back everything
except the payer's 5,000 fee. Success cases charge the payer
1,849,400 lamports (1,844,400 volume-accumulator rent + 5,000 fee).

Error sites (original : control/candidate line in the AnchorError
log line): 6039 at buy.rs:646/:156 for tf10000 (available == 0) but
buy.rs:700/:197 for amount1 (curve eaten by fee estimation) -- two
distinct 6039 sites; 6023 at transfer_fee.rs:57/:28 (control) with
candidate also :57; 6002 at buy.rs:638/:148; 6001 at buy.rs:636/:147;
6040 at buy.rs:776/:270; 6053 at global_config.rs:326/:43.

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The v2 comparison numbers are cited from the
prior packets #12 (quote tf) and #46 (nofee vault quote) on the same
fixture and images, not re-measured here. The whitelist finding is
about the legacy handler's remaining-account indexing, not about a
deployed whitelist configuration.
