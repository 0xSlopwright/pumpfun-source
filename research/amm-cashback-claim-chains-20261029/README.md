# cashback accrual -> claim payout chains

## Problem

2nd #2 pinned `claim_cashback` in isolation (full-balance payout,
the u64 claimed edge, earned ignored, stored user ignored, vault
ATA-bound, destination not ATA-bound) and 2nd #47 pinned legacy buy
cashback accrual in isolation (the creator leg diverted to the
accumulator ATA, `cashback_earned` += gross creator fee), but no
packet ever chained them: does a claim after a buy pay exactly
what the buy accredited, does earned keep growing across claims
while claimed catches up, does a second buy accredit the same
amount as the first once the curve moved, does a transfer-fee buy
leave a permanent gap between earned and claimable, and does an
overflowing claim stay blocked forever? This packet answers that
with multi-step chains, one signed transaction per step, on three
program images (original, #424 control, #427 candidate).

## Fixture

Per case, fresh VM per image: the legacy buy/sell fixture (pool
`GseMAnNDvntR5uFePZ51yZBXzNSn7GdFPkfHwfr6d77J` with
`is_cashback_coin` set, fee table lp 2 / protocol 93 / creator 30
bps, buyback 5000 bps, clock 1234567890), user = PAYER, fee payer
= PAYER for every step. The user volume accumulator is seeded or
fresh per case; its ATA (uvata) is present or fresh per case.
Payer deltas are exactly -5,000 except account-creation steps
(fresh accumulator rent 1,844,400, fresh ATA rent 2,039,280).

Event layouts (the fields listed are the ones verify.py decodes and
checks; the claim event is decoded in full, the buy events only at
the offsets named):
- ClaimCashbackEvent, 72 bytes, disc = sha256(
  "event:ClaimCashbackEvent")[:8]: user @8..40, amount @40..48,
  timestamp @48..56, total_claimed @56..64 (this is
  `total_cashback_claimed`, not the incentives `total_claimed`
  field), total_cashback_earned @64..72.
- BuyEvent, 497 bytes: cashback fee @416, user quote in @112.
- BuyExactEvent, 512 bytes: cashback fee @431.

## Cases (15 cases, 40 steps per image, 120 receipts)

Family F — fresh lifecycle (accumulator and ATA both absent):
- `f-fresh-buy-claim`: buy 10^10 creates the accumulator (all
  fields zero except earned 5,475, 1,844,400 lamports, 137 bytes)
  and the uvata (5,475 tokens, 2,044,755 lamports = rent +
  5,475); payer -3,888,680. The claim then pays the full 5,475
  (claimed 0 -> 5,475, earned unchanged) and uvata lamports
  return to exactly rent (2,039,280).
- `f-fresh-buy-claim-zero`: same, plus a second claim: it pays
  0 but still emits exactly one ClaimCashbackEvent (amount 0,
  claimed unchanged). Unlike `claim_token_incentives`, whose zero
  claim emits nothing (2nd #10 / 3rd #1), a zero cashback claim
  is an event, not a no-op.

Family B — seeded buy chains (earned 1,000, uvata 1,000):
- `b-seeded-buy-claim`: buy credits 5,475 (earned 1,000 ->
  6,475, uvata 1,000 -> 6,475, spend 1,847,796); claim pays 6,475
  (claimed 6,475 = earned).
- `b-buy-claim-buy-claim`: the SECOND identical buy credits
  5,476, not 5,475 (the first buy moved the curve), spends
  1,847,852, and the second claim pays 5,476 (claimed 11,951 =
  earned again).
- `b-buy-claim-buy-claim-zero`: plus a third claim paying 0
  with one amount-0 event.
- `b-present-uva-fresh-uvata-buy-claim`: accumulator
  pre-existing, ATA absent: buy payer -2,044,280 (ATA rent +
  fee only, no accumulator rent), earned 5,475; claim pays 5,475.
- `b-small-buy-claim`: buy 10^6 credits 1 (spend 187); claim
  pays 1.
- `b-buy-one-claim`: buy 1 credits 1 (spend 4); claim pays 1.

Family E — buy_exact chain (earned 1,000, uvata 1,000):
- `e-buyexact-claim`: buy_exact 10^7 credits 29,630 (earned
  1,000 -> 30,630, uvata 1,000 -> 30,630, spend exactly
  10,000,000); claim pays 30,630.

Family S — sell chains (earned 0, uvata 0):
- `s-sell-claim`: sell 10^9 credits 548 (earned 0 -> 548,
  user +180,212); claim pays 548.
- `s-sell-buy-claim`: the buy after the sell credits 5,475
  again (earned 548 -> 6,023) but spends 1,847,790, 6 less than
  a fresh buy -- the sell moved the curve the other way.
  Claim pays 6,023.

Family C — creator-0 buy chain (earned 2,000, uvata 2,000,
creator-0 fee table, trimmed remaining):
- `c-creator0-buy-claim`: buy 10^10 spends 1,842,321 and
  credits nothing (earned and uvata unchanged at 2,000); the
  claim then pays only the pre-seeded 2,000. The claim is
  independent of the buy's creator fee: it pays the ATA
  balance, whatever its source.

Family O — overflow chain (claimed = u64max - 100, uvata 1,000):
- `o-buy-claim-overflow`: buy credits 5,475 (uvata 1,000 ->
  6,475); the claim then fails 6023 Overflow with full
  rollback (uvata stays 6,475, claimed stays u64max - 100);
  a second identical claim fails 6023 again. The 6,475 tokens
  are claimable in principle but permanently blocked while
  claimed sits at the edge. In the repository source
  (programs/pump-amm/src/instructions/token_incentives/claim.rs)
  the transfer precedes the checked add; the receipts show only
  the observable result, a full rollback rather than a partial
  payout.

Family T — transfer-fee chains (quote tf100, TOKEN22 ATA):
- `t-tf-buy-claim`: tf buy credits earned += 5,475 (gross)
  but uvata22 nets 5,420 with 55 withheld (lamports 2,157,600
  -> 2,163,075 = base + gross). The claim pays 5,420
  (claimed 5,420, earned 5,475 -- a permanent gap of 55), and
  the claim transfer itself withholds another 55, so the user
  nets only 5,365 while the event reports amount 5,420.
- `t-tf-buy-claim-buy-claim`: second round credits earned
  10,951 and uvata22 5,421 (withheld 110); second claim pays
  5,421 (claimed 10,841, earned 10,951, gap 110), user nets
  5,366 vs event 5,421, userquote withheld 110. Withheld
  tokens are never claimable: earned permanently overstates
  claimable by the cumulative withheld.

## Result

- A claim pays the accumulator ATA balance in full, never the
  earned-minus-claimed delta: after every buy/sell accrual the
  claim drains the ATA to 0 and claimed catches up to earned
  exactly (in every successful non-overflow chain here) -- except
  under transfer fees, where the gap equals
  the cumulative withheld and never closes.
- Earned is cumulative and never reset by a claim; claimed is
  the running payout total. The claim event's total_claimed is
  the cashback claimed counter, and total_earned is the
  cumulative accrual; the two meet after every successful
  claim (non-fee case).
- Identical trades do not accredit identically: the second buy
  after a buy credits 5,476 (curve moved one way), while a buy
  after a sell credits 5,475 but spends 6 less than fresh
  (curve moved the other way).
- A zero cashback claim still emits its event; an overflowing
  cashback claim rolls back in full and stays blocked on
  retry.
- Under transfer fees the claim event amount is the vault
  payout (gross of the claim transfer's own withholding), not
  the user's net receipt: the user nets event-minus-withheld,
  and the withheld sits in the destination's withheld field.

## Limits

- Offline LiteSVM reproduction on synthetic fixtures only; no
  claim about on-chain behavior beyond these measured
  transactions, no source change, no build, and no whole
  program equivalence claim.
- All amounts, error codes, and site lines are exact values
  for this fixture state, not claims about other pool states.
  Error site line numbers differ between the original and the
  rebuilt images (claim 6023 at
  token_incentives/claim.rs:228 original vs cashback.rs:36
  rebuilt); verify.py checks each image's recorded site line
  against that image's own logs and never compares site lines
  across images.
- The sell event is asserted by count only (1 per successful
  sell); its fields are not decoded in this packet.
- Deposit/withdraw/boost paths do not touch cashback_earned in
  this tree and were not chained here.

## Verify and provenance

From the repository root:

    python3 -I -B research/amm-cashback-claim-chains-20261029/verify.py

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

