# v2 trades under transfer fee after sweep

## Problem

3rd #8 closed the sweep dimension for deposit, withdraw, and
legacy sell under a quote transfer fee, and left one gap in its
Limits: "v2 trades under tf after a sweep were not chained here
(3rd #4 + 2nd #7 cover the two halves separately)". This packet
chains them: sweep_protocol_fee and sweep_creator_fee, then
buy_v2, sell_v2, and buy_exact_quote_in_v2, in single VMs, one
signed transaction per step, on three program images (original,
#424 control, #427 candidate), under quote transfer fees of 100
and 5000 bps. The question is sharp because a sweep moves quote
tokens under the fee (withholding on the recipient ATAs) AND
converts the accrual into virtual quote reserves, so a
downstream v2 trade could have broken in three places: the
sweep's withholding leaking into the trade leg, the vq shift
moving the curve price, or the limit gates changing sides
under tf.

## Fixture

Shared fixture pool `GseMAnNDvntR5uFePZ51yZBXzNSn7GdFPkfHwfr6d77J`
(base vault 673,696,395,912,745, quote vault 122,946,690,720,
virtual quote reserves -125,882, protocol fees 2,488, creator
fees 123,394, fee tiers lp 2 / protocol 93 / creator 30 bps,
buyback 5000 bps). The quote mint carries a synthesized
transfer-fee extension (100 or 5000 bps, maxfee u64::MAX) as in
3rd #8; the vault, user, and fee-recipient accounts are
Token-2022 ATAs. Sweep recipients are pre-created Token-2022
ATAs (2,157,600 lamports, 182 bytes). Every case starts from
the same fixture state; each case runs in a fresh VM per image.

## Cases (24 cases, 60 steps per image, 180 receipts)

Family A — tf anchors, no sweep (6 cases, one trade each):
- `a-buy-tf100`: buy 10^6: spend 189, vault +186 (withheld 2),
  buyback ATA net 0 (fee 1 fully withheld), pool vq -2 /
  protocol +1 / creator +1. Event: curve 183, lp 2/1, protocol
  93/2, quote_with_lp 184, user_quote_in 187.
- `a-sell-tf100`: sell 10^6: user +176 (withheld 2), vault
  -179, buyback net 0 (withheld 1). Event: curve 182, lp 2/1,
  protocol 93/2, quote 181, uout 178 (gross receipt).
- `a-exact-tf100`: exact 10^7: out 53,573,907,921, spend
  9,999,541, vault +9,854,533 (withheld 99,541), buyback
  +45,012 (withheld 455), pool vq -74,801 / protocol +45,467 /
  creator +29,334.
- `a-buy-tf5000`: buy 10^6: spend 373, vault +186 (withheld
  186), buyback net 0 (withheld 1). Same decoded event
  fields as tf100 (the raw event differs in one trailing
  word).
- `a-sell-tf5000`: sell 10^6: user +89 (withheld 89), vault
  -179, buyback net 0 (withheld 1). Same decoded event fields as
  tf100 (the raw event differs in one trailing word).
- `a-exact-tf5000`: exact 10^7: out 27,058,593,160, spend
  9,977,037, vault +4,977,037 (withheld 4,977,037), buyback
  +11,481 (withheld 11,482), pool vq -37,778 / protocol
  +22,963 / creator +14,815.

Family S — sweeps -> v2 trades, tf100 (6 cases):
- `s-both-buy-tf100`, `s-both-sell-tf100`,
  `s-both-exact-tf100`: both sweeps (proto 2,463 net /
  withheld 25, creator 122,160 net / withheld 1,234, pool
  vq 0 / fees 0), then the trade. Every token delta, pool
  delta, and decoded event field equals the matching Family A
  anchor's (for the exact trade, only the event discriminator
  and length are checked). The raw event bytes are NOT
  byte-identical: the pool quote reserve word @56 and several
  trailing words record the post-sweep pool state.
- `s-proto-buy-tf100`: proto-only sweep, then buy 10^6:
  token and pool deltas equal to the anchor's (creator fees
  123,394 stay accrued); the raw event differs from the
  anchor's at word @56 and @440.
- `s-creat-buy-tf100`: creator-only sweep, then buy 10^6:
  token and pool deltas equal to the anchor's (protocol fees
  2,488 stay accrued); the raw event differs from the
  anchor's at words @56, @440 and @480.
- `s-chain-tf100`: both sweeps, then buy, sell, exact in one
  VM. The buy matches its anchor; the sell matches its anchor
  with payer -5,000 (volume accumulator already funded, still
  1,844,400 lamports / 137 bytes); the exact lands 1 below its
  standalone anchor (out 53,573,907,920, because the prior
  buy+sell drift the vault quote by +7 and vq by -4) while
  spend, vault leg, buyback leg, and pool deltas match.
  Withheld accumulates across the chain (vault 2 -> 2 ->
  99,543; buyback ATA 1 -> 2 -> 457).

Family S5 — both sweeps -> v2 trades, tf5000 (3 cases):
- `s-both-buy-tf5000`, `s-both-sell-tf5000`,
  `s-both-exact-tf5000`: every delta and decoded event field
  equal to the matching Family A tf5000 anchor's (raw event
  bytes differ in the same words as at tf100).

Family L — limit gates post-sweep, tf100 (9 cases):
- `l-buy-limit189`: buy limit exactly the gross spend 189:
  success. `l-buy-limit188`: 6004. `l-buy-limit187`: 6004
  -- the nofee spend itself fails, proving the buy limit is
  checked against the grossed spend, not the curve spend.
- `l-sell-limit176`: sell limit exactly the net receipt 176:
  success. `l-sell-limit177`: 6004. `l-sell-limit178`: 6004
  -- the gross receipt itself fails, proving the sell limit
  is net-side.
- `l-exact-limit-out`: exact limit exactly the tf out
  53,573,907,921: success. `l-exact-limit-outplus1`: 6040
  BuySlippageBelowMinBaseAmountOut. `l-exact-limit-nofeeout`:
  the nofee out 54,115,018,303 as limit: 6040.
- Every failure rolls back everything except the payer's
  5,000 fee, with 0 events.

## Result

The binding rules, each observed on all three images
(items marked as inference are readings of those observations):
1. Sweep -> v2 trades under tf are neutral: at tf100 and
   tf5000, buy/sell/exact after either or both sweeps settle
   with the same legs and decoded event fields as the
   no-sweep anchors. The sweep's withholding
   stays confined to the sweep steps and the vq shift does not
   move these trades.
2. The v2 buy under quote tf splits into two user transfers:
   the vault leg is grossed up to deliver a constant net 186
   (tf100: 188 gross, withheld 2; tf5000: 372 gross, withheld
   186), while the buyback leg is transferred at face, NOT
   grossed up (fee 1 nets 0 at both rates, fully withheld).
   The sell payout is gross-side too (vault -179 = 178 payout
   + 1 buyback; user nets 176 at tf100, 89 at tf5000 after
   ceiling withholding).
3. The buy_exact vault-leg gross (net + withheld) is the same
   9,954,074 at tf100 and tf5000 (the nofee value is quoted
   from earlier packets, not measured here); only the net/withheld
   split moves. Total exact spend = vault leg + buyback leg
   (9,999,541 at tf100, 9,977,037 at tf5000). The exact out
   falls with tf (nofee 54,115,018,303, quoted, ->
   53,573,907,921 -> 27,058,593,160).
4. Limit sides post-sweep under tf100: buy limit is
   gross-spend-side, sell limit is net-receipt-side, exact
   limit is out-side; nofee anchors copied as limits fail
   (buy 187 -> 6004, exact nofee out -> 6040).
5. Events report pre-tf curve amounts, never the grossed
   spend: the buy event's user_quote_in is 187 at both tf
   rates while the user actually pays 189 (tf100) and 373
   (tf5000); the sell event's uout is the gross 178 while
   the user nets 176 (tf100) and 89 (tf5000).

## Limits

- Offline LiteSVM reproduction on synthetic fixtures only. No
  source change, no SBPF build, no whole-program equivalence
  claim. Numbers are exact for this fixture state, not claims
  about other pool states.
- Error sites are per-image: the original and rebuilt sources
  differ in line numbers, so `verify.py` checks each image's
  recorded site line against that image's own logs and never
  compares sites across images (2nd #36 lesson). The README
  cites error codes, which agree across images.
- The quote-mint transfer-fee extension is synthesized
  post-hoc (as in 3rd #8); this pins handler transfer
  behavior, not a reachable mainnet state.
- The exact event is asserted by discriminator and length
  only (515 bytes); its interior u64 slots are not decoded
  into named fields here, unlike the buy/sell events whose
  curve/lp/protocol/quote slots are pinned.
- The first v2 step of each VM applies the trade transfer-fee
  override, which re-seeds the Token-2022 buyback ATA from
  the fixture buyback ATA; later steps in the same VM use a
  light override (meta swap only) so the buyback ATA balance
  accumulates across chained trades. The chain exact out
  being 1 below its standalone anchor is the measured
  consequence of the prior legs' state drift, not a rounding
  claim about exact in general.
- The buyback-leg-at-face reading (fee 1 nets 0) is stated
  from the observed split (vault leg grossed to a constant
  net, buyback leg exactly 1 at both rates); the program's
  internal transfer ordering is not separately instrumented.

## Verify and provenance

From the repository root:

    python3 -I -B research/amm-v2-trades-tf-after-sweep-20261029/verify.py

`verify.py` needs only `solders` plus files in the repository: this
packet, `evidence/original/pump_amm/deployed.so`, and the two
retained rebuilt images
`research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz`
(control, #424) and
`research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz`
(candidate, #427), whose decompressed sha256 values match the
`images` block of `runtime/report.json.gz`. It re-checks the
recorded receipts against the report's expected values; it does
not re-execute any transaction.

`producer.py` is the script that generated the receipts and is
kept as a provenance record. It is not runnable as committed: it
hard-codes a private workspace layout (`~/workspace/pumpfun-sparse`
for the harness scripts and `~/workspace/slop-verify` for the
control/candidate `.so` files) and chdirs there on start.
