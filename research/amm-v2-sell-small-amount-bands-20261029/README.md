# v2 sell small-amount bands

## Problem

2nd-run #30 pinned sell saturation at the top of the curve and
1st-run #31 covered trade zero/extremes, but neither walked the
bottom of the `sell_v2` curve: what happens when the curve quote
is 0, 1, 2, 3, or 4, where the ceiling fee schedule steps, and
whether a transfer fee moves the first positive net receipt.
The sell path is the only one where a tiny nonzero curve can
fail while both zero and larger curves succeed.

## Cases

27 cases x 3 images (original / #424 control / #427 candidate),
81 signed receipts, parts of 10 receipts (9 parts). Fixture:
single fee tier (threshold 0, lp 10 bps, protocol 111 bps,
creator 0 bps), pool accrued protocol/creator fees zeroed so
available quote equals raw vault quote, virtual quote reserves 0,
base mint supply 10^12, vault base 10^12, vault quote 10^10,
user base/quote 10^15. Sell curve:
`floor(10^10 * amount / (10^12 + amount))`.

- Zero curve (amounts 1, 100; limit 0): curve 0, lp/protocol
  fees ceil to 0, sell succeeds with receipt 0 — and still funds
  the volume accumulator (payer -1,849,400). Limit 1 on a
  zero-receipt sell gives 6004 ExceededSlippage.
- The curve-1 hole (amounts 101, 150, 200; limits 0 and 1):
  curve 1, lp_fee = ceil(1*10/10000) = 1, protocol_fee =
  ceil(1*111/10000) = 1, so `calculate_sell_quote` computes
  quote_without_lp = 1 - 1 = 0 and then 0 - creator(0) -
  protocol(1) underflows -> 6023 Overflow (original
  trade_v2.rs:385, control/candidate trade_v2.rs:187). The
  failure precedes the limit check: limit 0 and limit 1 both
  give 6023, fully rolled back, payer -5,000 only, 0 events.
- Recovery (amount 201; limit 0): curve 2, lp 1, protocol 1,
  quote_without_lp 1, receipt 1 - 1 = 0. Limit 1 gives 6004.
- First positive receipt (amount 301): curve 3, lp 1,
  protocol 1, receipt 1 (limit 1 succeeds, limit 2 gives 6004).
- Curve 4 (amount 500): receipt 2 (quote_without_lp 3 minus
  protocol 1).
- Protocol-fee ceiling steps, protocol = ceil(curve*111/10000):
  curve 90 -> 91 (amounts 9100/9101) steps protocol 1 -> 2;
  buyback = floor(protocol/2) steps 0 -> 1, so the receipt stays
  88 while the vault send grows 88 -> 89. Curve 180 -> 181
  (amounts 18100/18101) steps protocol 2 -> 3, but receipt
  (177), vault send (178) and buyback (1) are all unchanged —
  only the event fee fields move.
- Lp-fee ceiling step, lp = ceil(curve*10/10000): curve
  1000 -> 1001 (amounts 100100/100101) steps lp 1 -> 2, but
  receipt (987), vault send (993) and buyback (6) are all
  unchanged — only the event lp_fee field moves.
- Transfer-fee overlay (quote tf100): the 6023 hole is
  unchanged (amount 101 still gives 6023 — fee math precedes
  transfer-fee math), but the first positive NET receipt moves
  from amount 301 (nofee) to amount 500 (tf100): a gross total
  of 1 is withheld in full (net 0, vault -1; limit 1 gives
  6004), a gross total of 2 nets 1 (vault -2; limit 1
  succeeds). At the protocol step (amount 9101) tf100 nets 87
  against a gross send of 89 (user gross 88 withheld 1, buyback
  gross 1 withheld 1, buyback net 0).

## Result

All 27 cases agree across all 3 images. Every success case
emits exactly 1 event with fixed-offset fields (quote @64,
lp_bps @72, lp_fee @80, protocol_bps @88, protocol_fee @96),
funds the volume accumulator with 1,844,400 lamports (137 bytes,
payer key at [8:40]), and charges the payer 1,849,400
lamports. Every failure case rolls back fully (payer -5,000
only, 0 events) and carries its recorded AnchorError site line.
Error sites are cited per image family (original deployed
binary vs #424/#427 rebuilds): 6023 is trade_v2.rs:385
original / :187 rebuilt; 6004 is :906 original / :385
rebuilt.

## Limits

Offline LiteSVM synthetic fixtures only. No source change,
build, or whole-program equivalence claim. The band boundaries
are exact for this fixture's curve state and fee tier (single
tier lp 10 / protocol 111 / creator 0, VB 10^12, VQ 10^10), not
a claim about other pool states or mainnet fee settings. The
transfer-fee cases use a post-hoc synthesized quote-mint fee
extension (handler transfer behavior pinned, not a reachable
mainnet state for this fixture's quote mint).
