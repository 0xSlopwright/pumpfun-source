# cashback legacy sell chained into sweep -> collect -> claim

## Problem

3rd #2 chained a cashback legacy sell into claim_cashback only
(the sell credits 548, the claim pays 548), and 3rd #4 chained a
non-cashback legacy buy into sweep -> collect (the buy's creator
leg lands in the vault ATA, so sweep + collect drain it). Nobody
chained the cashback sell through BOTH pipes in one VM. The
question is sharp because the cashback flag reroutes the sell's
creator leg: on a cashback pool the 548 goes to the user volume
accumulator's ATA as cashback earned, NOT to the creator vault
ATA. So a collect after a cashback sell should find nothing to
drain even though the sell paid a creator leg -- and in the
cashback cases measured here the swept pool accrual is the only
thing collect drained. The claim pipe is where the 548 lives,
and in the cases measured the two pipes together sum to the
non-cashback total. This packet chains all of it on three
program images (original, #424 control, #427 candidate).

## Fixture

The repository liquidity fixture: pool
`GseMAnNDvntR5uFePZ51yZBXzNSn7GdFPkfHwfr6d77J`, base vault
673,696,395,912,745, quote vault 122,946,690,720, LP supply
4,194,352,106,721, pool protocol_fees 2,488, creator_fees 123,394,
virtual_quote_reserves -125,882, disable_flags 0, clock slot 100 /
timestamp 1234567890. Cashback cases set pool byte 244
(is_cashback_coin) to 1; mayhem cases set pool byte 243
(is_mayhem_mode) to 1. The protocol and creator recipient ATAs
and the collect destination DEST are pre-created with 0 tokens,
so every sweep and collect costs only the 5,000 fee. Legacy sell
uses the `sell` instruction (21 keys + remaining) with arguments
(amount, minquote); the cashback remaining layout is
[accumulator ATA, accumulator PDA, pool-v2 PDA, buyback owner,
buyback dest]. The claim uses `claim_cashback` with keys
[payer, accumulator PDA, quote mint, token program, accumulator
ATA, user quote ATA, default, event authority, program].

Event layouts (offsets as read from the receipts; verify.py
decodes only the fields its expectations name):
- SellEvent (legacy, shares the v2 sell disc), 449 bytes, disc
  `3e2f370aa503dc2a`: curve @64, lp_fee @80, protocol_fee @96
  (GROSS: net protocol 849 + buyback 849 = 1,698 for sell 10^9),
  quote @104, user output @112, creator_bps @344, creator_fee
  @352, cashback_bps @360, cashback @368, buyback_fee @384.
- SweepPoolFeeEvent, 185 bytes, disc `82a42461e48287a5`:
  timestamp @8, recipient @112, amount @176, bucket @184 (0
  protocol, 1 creator).
- CollectCoinCreatorFeeEvent, 120 bytes, disc
  `e8f5c2eeeada3a59`: timestamp @8, coin_creator @16, fee
  @48, vault ATA @56, token account @88.
- ClaimCashbackEvent, 72 bytes, disc `e2d6f62107f293e5`:
  user @8..40, amount @40..48, timestamp @48..56,
  total_claimed @56..64, total_cashback_earned @64..72.

## Cases (15 cases, 41 steps per image, 123 receipts)

Family A -- non-cashback sell pipe anchors:
- `a-sell-collect`: sell 10^9 (user +180,212, vault base
  +10^9, vault quote -182,458, protocol 849, creator 548,
  buyback 849, pool unchanged), then collect drains exactly
  the sell's creator leg: 548 to DEST, vault ATA 0. No sweep
  needed.
- `a-sell-sweep-collect`: sell, sweep creator (123,394 to the
  vault ATA, pool creator 0), collect drains 548 + 123,394 =
  123,942 to DEST.
- `a-sell-collect-sweep-collect`: sell, collect 548, sweep
  creator 123,394, collect 123,394 -- both orders end DEST at
  123,942.

Family C -- cashback sell pipe (seeded accumulator: 137 bytes,
lamports 10^9, all fields zero; accumulator ATA 2,039,280
lamports, 0 tokens):
- `c-sell-collect-noop`: cashback sell 10^9 (legs identical
  to the anchor except creator vault ATA 0 and accumulator
  ATA +548; earned 0 -> 548; event creator_bps 0, creator_fee
  0, cashback_bps 30, cashback 548), then collect is a SILENT
  NO-OP (0 events, payer 5,000 only, DEST 0). The 548 is in
  the accumulator ATA, not the collect pipe.
- `c-sell-sweep-collect`: cashback sell, sweep creator
  123,394, collect drains exactly 123,394 -- not 123,942.
  The accumulator ATA still holds 548.
- `c-sell-sweep-collect-claim`: as above, then claim pays
  exactly 548 (accumulator ATA 548 -> 0, user quote +548,
  claimed 548, earned 548, accumulator ATA lamports back to
  2,039,280). Collect 123,394 + claim 548 = 123,942: the
  non-cashback total, conserved across pipes.
- `c-sell-claim-sweep-collect`: cashback sell, claim 548,
  sweep creator 123,394, collect 123,394 -- the same finals
  as the previous case with the pipes in the other order.
- `c-sell-sell-claim`: two cashback sells, then one claim.
  The second sell pays +180,211 / vault -182,457 (curve
  182,494, quote 182,457) with the same 849 / 548 / 849 legs;
  earned 548 -> 1,096, and the claim pays the full 1,096.
- `c-sell-fresh-chain`: cashback sell with a FRESH
  accumulator (volume + accumulator ATA created by the sell
  itself, payer -3,888,680 = fee 5,000 + accumulator rent
  1,844,400 + accumulator ATA rent 2,039,280; accumulator ATA
  lamports 2,039,828 = rent + 548), then sweep 123,394,
  collect 123,394, claim 548 -- the same chain as the seeded
  case, with creation costs only on the first step.
- `c-sell-limit-plus1`: cashback sell 10^9 with minquote
  180,213 -> 6004 ExceededSlippage, full rollback, 0 events.
- `c-sell-limit-exact`: minquote 180,212 -> success with the
  cashback anchor legs. The limit gate binds at the fresh
  price on a cashback pool too.

Family M -- mayhem sell fails, pipe intact:
- `m-sellfail-sweep-collect`: mayhem sell 10^9 -> 6013
  InvalidProtocolFeeRecipient, full rollback, 0 events (the
  protocol recipient is not on the reserved list), then
  sweep creator 123,394 and collect 123,394. The failed sell
  leaves every watched account except the fee payer unchanged
  (verify.py checks the rollback).
- `m-sellfail-sweep-proto-fail`: mayhem sell -> 6013, then
  the PROTOCOL SWEEP itself fails 6013 with full rollback,
  then creator sweep 123,394 and collect 123,394. The mayhem
  reserved-recipient gate binds the sweep handler, not just
  the trade handlers.
- `m-sweep-proto-mayhem`: protocol sweep alone on a mayhem
  pool -> 6013, full rollback. The gate is standalone: it
  does not need a preceding failed sell.
- `m-sweep-creator-mayhem-collect`: creator sweep alone on a
  mayhem pool moves 123,394 and collect drains 123,394. In the
  cases measured, the protocol-bucket sweep failed 6013 on a
  mayhem pool while the creator-bucket sweep succeeded.

## Result

- The cashback flag reroutes the legacy sell's creator leg out
  of the collect pipe and into the claim pipe: collect after
  a cashback sell is a silent no-op, collect after a
  non-cashback sell drains the leg directly, and in every
  case measured the two pipes together summed to the
  non-cashback total (123,942 for sell 10^9 + the pool's
  123,394 accrual).
- The two pipe orders measured, sell -> sweep -> collect ->
  claim and sell -> claim -> sweep -> collect, end at the
  same final watched-account state (DEST 123,394, user quote
  +548); other orders were not run.
- Earned accumulates across sells (548 -> 1,096) and a single
  claim pays the full accumulation; the second sell again
  leaves the creator vault ATA unchanged (delta 0).
- The mayhem reserved-recipient gate is not trade-only: a
  protocol sweep on a mayhem pool fails 6013 while a creator
  sweep succeeds and collects normally, with or without a
  preceding failed mayhem sell.

## Limits

- Offline LiteSVM reproduction on synthetic fixtures only; no
  claim about on-chain behavior beyond these measured
  transactions, no source change, no build, and no whole
  program equivalence claim.
- All amounts, error codes, and site lines are exact values
  for this fixture state, not claims about other pool states.
  Error site line numbers differ between the original and the
  rebuilt images; verify.py checks each image's recorded site
  line against that image's own logs and never compares site
  lines across images (2nd #36 lesson). The README cites
  error codes, which agree across images.
- The pool flag bytes (cashback 244, mayhem 243) are part of
  the recorded snapshots and the cross-image surface check,
  but the pool-state tuple asserted in the report covers only
  (virtual_quote_reserves, protocol_fees, creator_fees,
  lp_supply).
- The mayhem sweep gate is reported as observed handler
  behavior (protocol sweep fails 6013 on a mayhem pool,
  creator sweep succeeds); the packet does not name the
  internal validation path shared with the trade handlers.
- Cashback sell under a transfer fee, and cashback legacy buy
  chained into sweep/collect, were not executed here; the
  buy-side cashback chain is 3rd #2 (claim only) plus 2nd #47
  (accrual only).

## Verify and provenance

From the repository root:

    python3 -I -B research/amm-cashback-legacy-sell-sweep-collect-claim-20261029/verify.py

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
