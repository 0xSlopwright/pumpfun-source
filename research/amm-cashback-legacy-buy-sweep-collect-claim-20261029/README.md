# cashback legacy buy chained into sweep -> collect -> claim

## Problem

3rd #13 chained the cashback legacy SELL through both pipes, and
2nd #47 pinned the cashback legacy BUY accrual only (the buy's
creator leg lands in the accumulator ATA as earned). Nobody
chained the cashback buy through sweep -> collect -> claim in
one VM. The question is sharp because the buy side differs from
the sell side structurally: a buy moves quote into the vaults
and base out to the user, creates the volume accumulator when
absent, and its creator leg is the one the cashback flag
reroutes. So a collect after a cashback buy should find nothing
to drain even though the buy paid a creator leg -- and in the
cashback cases measured here the swept pool accrual is the only
thing collect drained. The claim pipe is where the buy's creator
leg lives, and in the cases measured the two pipes together sum
to the non-cashback total. This packet chains all of it on three program images (original, #424 control, #427
candidate).

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
so every sweep and collect costs only the 5,000 fee. Legacy buy
uses the `buy` instruction (23 keys + remaining) with arguments
(amount, limit) plus a track byte 0; the cashback remaining
layout is [accumulator ATA, pool-v2 PDA, buyback owner, buyback
dest]. The claim uses `claim_cashback` with keys
[payer, accumulator PDA, quote mint, token program, accumulator
ATA, user quote ATA, default, event authority, program].

Event layouts (offsets as read from the receipts; verify.py
decodes only the fields its expectations name):
- BuyEvent (legacy buy and buy_exact share the v2 buy disc),
  497 bytes for buy / 512 bytes for buy_exact, disc
  `67f4521f2cf57777`: out @16, max @24, curve @64, lp_bps @72,
  lp_fee @80, protocol_bps @88, protocol_fee @96, quote @104,
  user_quote_in @112, creator_bps @344, creator_fee @352,
  track @360, cashback_bps @408 (buy) / @423 (exact),
  cashback @416 (buy) / @431 (exact), buyback_bps @424 (buy) /
  @439 (exact), buyback_fee @432 (buy) / @447 (exact).
- SweepPoolFeeEvent, 185 bytes, disc `82a42461e48287a5`:
  timestamp @8, recipient @112, amount @176, bucket @184 (0
  protocol, 1 creator).
- CollectCoinCreatorFeeEvent, 120 bytes, disc
  `e8f5c2eeeada3a59`: timestamp @8, coin_creator @16, fee
  @48, vault ATA @56, token account @88.
- ClaimCashbackEvent, 72 bytes, disc `e2d6f62107f293e5`:
  user @8..40, amount @40..48, timestamp @48..56,
  total_claimed @56..64, total_cashback_earned @64..72.

## Cases (16 cases, 46 steps per image, 138 receipts)

Family A -- non-cashback buy pipe anchors:
- `a-buy-collect`: buy 10^10 (user base +10^10, user quote
  -1,847,796, vault base -10^10, vault quote +1,825,348,
  protocol 8,487, creator 5,475, buyback 8,486, pool unchanged,
  volume accumulator created: payer -1,849,400 = fee 5,000 +
  accumulator rent 1,844,400), then collect drains exactly
  the buy's creator leg: 5,475 to DEST, vault ATA 0. No sweep
  needed.
- `a-buy-sweep-collect`: buy, sweep creator (123,394 to the
  vault ATA, pool creator 0), collect drains 5,475 + 123,394 =
  128,869 to DEST.
- `a-buy-collect-sweep-collect`: buy, collect 5,475, sweep
  creator 123,394, collect 123,394 -- both orders end DEST at
  128,869.
- `a-buyexact-collect`: buy_exact 10^7 (out 54,115,018,303,
  spend 10,000,000, vault quote +9,878,518, protocol 45,926,
  creator 29,630, buyback 45,926), then collect drains exactly
  29,630.
- `a-buyexact-sweep-collect`: buy_exact, sweep creator
  123,394, collect drains 29,630 + 123,394 = 153,024.

Family C -- cashback buy pipe (seeded accumulator: 137 bytes,
lamports 10^9, all fields zero; accumulator ATA 2,039,280
lamports, 0 tokens):
- `c-buy-collect-noop`: cashback buy 10^10 (legs identical
  to the anchor except creator vault ATA 0 and accumulator
  ATA +5,475; earned 0 -> 5,475; event creator_bps 0,
  creator_fee 0, cashback_bps 30, cashback 5,475), then
  collect is a SILENT NO-OP (0 events, payer 5,000 only,
  DEST 0). The 5,475 is in the accumulator ATA, not the
  collect pipe.
- `c-buy-sweep-collect`: cashback buy, sweep creator
  123,394, collect drains exactly 123,394 -- not 128,869.
  The accumulator ATA still holds 5,475.
- `c-buy-sweep-collect-claim`: as above, then claim pays
  exactly 5,475 (accumulator ATA 5,475 -> 0, user quote +5,475,
  claimed 5,475, earned 5,475, accumulator ATA lamports back
  to 2,039,280). Collect 123,394 + claim 5,475 = 128,869: the
  non-cashback total, conserved across pipes.
- `c-buy-claim-sweep-collect`: cashback buy, claim 5,475,
  sweep creator 123,394, collect 123,394 -- the same finals
  as the previous case with the pipes in the other order.
- `c-buy-buy-claim`: two cashback buys, then one claim.
  The second buy pays spend 1,847,852 / vault +1,825,403
  (curve 1,825,037) with the same 8,487 / 8,486 protocol and
  buyback legs but a 5,476 creator leg on the moved curve;
  earned 5,475 -> 10,951, and the claim pays the full 10,951.
- `c-buy-fresh-chain`: cashback buy with a FRESH
  accumulator (volume + accumulator ATA created by the buy
  itself, payer -3,888,680 = fee 5,000 + accumulator rent
  1,844,400 + accumulator ATA rent 2,039,280; accumulator ATA
  lamports 2,044,755 = rent + 5,475), then sweep 123,394,
  collect 123,394, claim 5,475 -- the same chain as the seeded
  case, with creation costs only on the first step.
- `c-buy-limit-minus1`: cashback buy 10^10 with limit
  1,847,795 -> 6004 ExceededSlippage, full rollback,
  0 events.
- `c-buy-limit-exact`: limit 1,847,796 -> success with the
  cashback anchor legs. The limit gate binds at the fresh
  spend on a cashback pool too.
- `c-buyexact-sweep-collect-claim`: cashback buy_exact 10^7
  (out 54,115,018,303, vault quote +9,878,518, protocol
  45,926, accumulator ATA +29,630, buyback 45,926), sweep
  creator 123,394, collect 123,394, claim 29,630 -- total
  153,024, the non-cashback buy_exact total.
- `c-buy-sweep-proto-collect-noop`: cashback buy, sweep
  protocol 2,488, collect is still a SILENT NO-OP (DEST 0,
  accumulator ATA 5,475 intact). The protocol sweep does not
  feed the creator collect pipe.

Family M -- mayhem buy fails, pipe intact:
- `m-buyfail-sweep-collect`: mayhem buy 10^10 -> 6013
  InvalidProtocolFeeRecipient, full rollback, 0 events (the
  protocol recipient is not on the reserved list), then
  sweep creator 123,394 and collect 123,394. The failed buy
  leaves every watched account except the fee payer unchanged
  (verify.py checks the rollback).

## Result

- The cashback flag reroutes the legacy buy's creator leg out
  of the collect pipe and into the claim pipe: collect after
  a cashback buy is a silent no-op, collect after a
  non-cashback buy drains the leg directly, and in every
  case measured the two pipes together summed to the
  non-cashback total (128,869 for buy 10^10 + the pool's
  123,394 accrual; 153,024 for buy_exact 10^7).
- The two pipe orders measured, buy -> sweep -> collect ->
  claim and buy -> claim -> sweep -> collect, end at the
  same final watched-account state (DEST 123,394, user quote
  +5,475); other orders were not run.
- Earned accumulates across buys (5,475 -> 10,951, the second
  buy's leg growing to 5,476 on the moved curve) and a single
  claim pays the full accumulation; the second buy again
  leaves the creator vault ATA unchanged (delta 0).
- In the cases measured, a buy created the volume accumulator
  when absent (1,844,400 lamports, 137 bytes) on the
  non-cashback pool too; on the cashback pool with a fresh
  accumulator it additionally created the accumulator ATA
  (2,039,280 lamports).
- Sweeping the protocol bucket after a cashback buy left the
  following collect a silent no-op (DEST 0, accumulator ATA
  5,475 intact); in every collect measured, only the creator
  vault ATA was drained.
- On the mayhem pool measured, the buy failed 6013 with full
  rollback, and the following creator sweep and collect
  proceeded with the same amounts as without the failed buy.

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
- The buy event's interior u64 slots are pinned for buy and
  buy_exact alike (curve/lp/protocol/quote/user_quote_in/
  creator/cashback/buyback); the exact event's min-base-out
  slot is not separately asserted.
- Cashback buy under a transfer fee was not executed here;
  the buy-side cashback chain under tf is the remaining open
  seat (3rd #2 + 2nd #47 cover claim-only and accrual-only
  under tf).

## Verify and provenance

From the repository root:

    python3 -I -B research/amm-cashback-legacy-buy-sweep-collect-claim-20261029/verify.py

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
