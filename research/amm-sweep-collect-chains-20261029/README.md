# sweep to collect chains: trade accrual to the creator's wallet

## Problem

Earlier packets pinned sweeps and collects only in isolation: the 1st
run's fee sweep packet measured single sweeps, the 1st run's collect
packet measured single collects, and 2nd #49 chained set -> sweep ->
migrate -> buy but never drained a vault ATA into a creator wallet.
No packet ever ran the full fee pipeline end to end, so the binding
questions were open: after a trade accrues fees in the pool, does a
sweep move exactly the accrued amount, does a collect drain exactly
the swept amount, what does a second sweep or a second collect do,
can a protocol sweep be collected, and does sweeping change the
price of the next trade? This packet answers all of that with
single-step anchors and multi-step chains, one signed transaction
per step, on three program images (original, #424 control, #427
candidate).

## Fixture

The repository liquidity fixture: pool
`GseMAnNDvntR5uFePZ51yZBXzNSn7GdFPkfHwfr6d77J`, base vault
673,696,395,912,745, quote vault 122,946,690,720, LP supply
4,194,352,106,721, pool protocol_fees 2,488, creator_fees 123,394,
virtual_quote_reserves -125,882 (so vq is exactly minus the total
accrual), user base/quote funded 10^15, disable_flags 0, clock slot
100 / timestamp 1234567890. The protocol sweep recipient is the
first sorted protocol recipient from the global config; the creator
sweep recipient is the creator-vault PDA for the pool's
coin_creator, and the collect destination is a token account owned
by that coin_creator. Fee payer is PAYER for every step: a first
trade step costs 1,849,400 (volume rent 1,844,400 + fee 5,000), later
steps cost 5,000, and a sweep to a fresh ATA costs 2,044,280 (fee
5,000 + ATA rent 2,039,280).

Event layouts (offsets as read from the receipts; verify.py decodes
only the discriminator, length, and the sweep timestamp / recipient /
amount / bucket, collect timestamp / creator / fee / vault ATA /
destination, and v2 buy/sell curve / fee / user fields -- the other
offsets below are informational):
- SweepPoolFeeEvent, 185 bytes, disc `82a42461e48287a5`
  (= sha256("event:SweepPoolFeeEvent")[:8]): timestamp @8, pool
  @16, base mint @48, quote mint @80, recipient @112, payer @144,
  amount @176, bucket @184 (0 protocol, 1 creator).
- CollectCoinCreatorFeeEvent, 120 bytes, disc `e8f5c2eeeada3a59`
  (= sha256("event:CollectCoinCreatorFeeEvent")[:8]): timestamp @8,
  coin_creator @16, fee @48, vault ATA @56, token account @88.
- BuyEvent (v2), 500 bytes, disc `67f4521f2cf57777`: curve @64,
  lp_bps @72, lp_fee @80, protocol_bps @88, protocol_fee @96,
  quote_with_lp @104, user_quote_in @112.
- SellEvent (v2), 449 bytes, disc `3e2f370aa503dc2a`: curve @64,
  lp_bps @72, lp_fee @80, protocol_bps @88, protocol_fee @96,
  quote @104, user_quote_out @112.
- Legacy BuyEvent, 497 bytes, same disc `67f4521f2cf57777` as the
  v2 event but 3 bytes shorter; only disc/len are asserted for it.

## Cases (19 cases, 43 steps per image, 129 receipts)

Family A -- sweep anchors, as-is fixture, recipient ATAs absent:
- `a-sweep-proto`: sweep_protocol_fee moves 2,488 to the protocol
  ATA (fresh ATA, payer 2,044,280, ATA lamports 2,039,280 + 2,488),
  vault quote -2,488, pool (vq -123,394, pf 0, cf 123,394), event
  (amount 2,488, bucket 0).
- `a-sweep-creator`: sweep_creator_fee moves 123,394 to the creator
  vault ATA (fresh ATA, payer 2,044,280), vault quote -123,394,
  pool (vq -2,488, pf 2,488, cf 0), event (amount 123,394, bucket 1).
- `a-sweep-both`: protocol then creator sweeps leave pool
  (vq 0, pf 0, cf 0) -- the fixture's vq offset is exactly the total
  accrual, so sweeping both buckets zeroes it.
- `a-sweep-proto-zero` / `a-sweep-creator-zero`: with the bucket
  patched to 0, the sweep is a silent no-op -- 0 events, payer
  5,000 only, pool unchanged, and the recipient ATA is NOT created
  (observed: the ATA stays absent; the early return is in the
  handler source).
- `a-sweep-proto-twice` / `a-sweep-creator-twice`: the second sweep
  of an emptied bucket is a silent no-op -- 0 events, payer 5,000,
  log "Nothing to sweep for fee bucket 0/1".
- `a-sweep-wrong-proto`: protocol sweep to a non-listed recipient
  fails 6013 InvalidProtocolFeeRecipient (swap/mod.rs:164),
  full rollback, payer 5,000.
- `a-sweep-wrong-creator`: creator sweep to a non-PDA recipient
  fails 2006 ConstraintSeeds (sweep_fees.rs:113), full rollback.

Family B -- v2 pipeline:
- `b-v2buy-sweep-creator-collect`: buy 10^10 (spend 1,847,796,
  vault +1,839,310, buyback 8,486, pool vq -139,844 / pf 10,975 /
  cf 128,869), then sweep_creator_fee moves exactly 128,869
  (fresh ATA, payer 2,044,280, pool cf 0, vq -10,975), then
  collect_coin_creator_fee drains exactly 128,869 to the creator
  dest (payer 5,000, pool untouched).
- `b-v2buy-sweep-creator-collect-twice`: the second collect is a
  silent no-op -- 0 events, payer 5,000, log "No coin creator fee
  to collect".
- `b-v2buy-sweep-proto-collect-empty`: buy, sweep_protocol_fee
  10,975 (fresh ATA), then collect is a silent no-op -- the
  creator vault ATA holds 0 and the protocol ATA's 10,975 is
  untouched. Protocol sweep output is NOT collectable through
  collect_coin_creator_fee.
- `b-v2buy-sweep-proto-buy-sweep-proto`: buy, sweep protocol
  10,975 (fresh ATA, payer 2,044,280), buy 10^6 (spend 187, pool
  vq -128,871 / pf 1 / cf 128,870), sweep protocol again -- the
  existing ATA costs only the 5,000 fee and receives exactly 1
  (pool pf 0, vq -128,870).
- `b-v2sell-sweep-creator-collect`: sell 10^10 (user +1,802,115,
  vault -1,810,601, buyback 8,486, pool vq -139,843 / pf 10,974 /
  cf 128,869), sweep creator 128,869 (pool cf 0, vq -10,974),
  collect 128,869.

Family C -- sweeping does not move trade prices (the raw trade
events are NOT byte-identical to the anchors: the pool quote
reserve word @56 and some trailing words record the post-sweep
pool state):
- `c-sweep-both-buy`: both sweeps, then buy 10^10 settles
  identical to the fresh anchor in every measured leg and decoded
  event field (spend 1,847,796, vault +1,839,310, buyback 8,486,
  same curve / fees / user-in) with pool
  (vq -13,962, pf 8,487, cf 5,475) -- the accruals restart from 0
  but the trade itself does not move.
- `c-sweep-creator-buy`: creator sweep, then buy 10^10 is
  identical to the anchor in legs and decoded event fields, pool (vq -16,450, pf 10,975,
  cf 5,475).
- `c-sweep-proto-sell`: protocol sweep, then sell 10^10 is
  identical to the fresh anchor in legs and decoded event fields
  (user +1,802,115, vault -1,810,601, buyback 8,486), pool
  (vq -137,355, pf 8,486, cf 128,869).

Family D -- legacy routing contrast (protocol/creator ATAs
pre-created, as in the legacy differential):
- `d-legacybuy-sweep-creator-collect`: legacy buy 10^10 (spend
  1,847,796, vault +1,825,348, protocol ATA +8,487, creator ATA
  +5,475, buyback 8,486) leaves pool fees UNCHANGED (2,488 /
  123,394) -- the legacy legs transfer straight to the ATAs and
  never touch the pool fields. A following sweep_creator_fee
  still moves the full 123,394 (creator ATA 5,475 -> 128,869,
  pool cf 0), and a collect then drains all 128,869.
- `d-legacybuy-collect-sweep-creator-collect`: legacy buy, collect
  drains the 5,475 legacy leg directly (pool still 2,488 /
  123,394), sweep creator moves 123,394, collect drains 123,394
  -- dest ends at 128,869 through two collects, proving the
  legacy leg feeds collect directly while only the pool accrual
  feeds the sweep.

## Result

- A sweep moves exactly the pool bucket (protocol or creator) to
  the recipient ATA and adds the same amount to virtual quote
  reserves, so the effective reserve (raw vault quote + vq) never
  moves -- which is why swept and unswept trades price identically.
- Zero and repeat sweeps/collects are silent no-ops (0 events,
  payer 5,000 only); a zero sweep does not even create the
  recipient ATA.
- Collect drains exactly the creator vault ATA balance and nothing
  else: it cannot reach protocol sweep output, and it leaves the
  pool fields untouched.
- Legacy trades bypass the pool accrual fields entirely (their
  legs land directly in the ATAs), while v2 trades accrue in the
  pool fields and only become collectable after a sweep. The two
  paths compose: legacy leg + swept accrual = 5,475 + 123,394 =
  128,869 collected in either order.

## Limits

- Offline LiteSVM reproduction on a synthetic fixture only; no
  claim about on-chain behavior beyond these measured
  transactions, no source change, no build, and no whole program
  equivalence claim.
- All amounts, error codes, and site lines are exact values for
  this fixture state, not claims about other pool states. Error
  site line numbers differ between the original and the rebuilt
  images; verify.py checks each image's recorded site line against
  that image's own logs and never compares site lines across
  images (2nd #36 lesson). The README cites original-image sites.
- The legacy buy event is asserted on disc/len only (497 bytes vs
  the v2 event's 500); its token deltas and pool invariance carry
  the legacy-routing claim.
- Collect with a missing vault ATA, and sweep/collect under
  transfer-fee mints, were not executed here.

## Verify and provenance

From the repository root:

    python3 -I -B research/amm-sweep-collect-chains-20261029/verify.py

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

