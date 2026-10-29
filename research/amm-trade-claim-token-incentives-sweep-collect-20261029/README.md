# trades chained into claim_token_incentives, then sweep -> collect

## Problem

2nd #48 proved no trade path ever writes `current_sol_volume`
(`track_volume` is event-only), 2nd #4 pinned
`claim_token_incentives` rewards from externally seeded volume,
and 3rd #4/#10/#12 chained trades into sweep -> collect -- but
nobody chained a real trade INTO the token-incentive claim and
then into the fee pipes in one VM. The sharp questions: does a
fresh trade's volume accumulator feed the token claim at all,
does a seeded token claim change the fee buckets, does the
claim's reward math survive interleaved trades and sweeps, and
do the cashback and token-incentive claims share any field?
This packet answers all four in single VMs, one signed
transaction per step, on three program images (original, #424
control, #427 candidate).

## Fixture

The repository liquidity fixture: pool
`GseMAnNDvntR5uFePZ51yZBXzNSn7GdFPkfHwfr6d77J`, base vault
673,696,395,912,745, quote vault 122,946,690,720, LP supply
4,194,352,106,721, pool protocol_fees 2,488, creator_fees 123,394,
virtual_quote_reserves -125,882, disable_flags 0, clock slot 100.
Trade steps run at timestamp 1234567890; token-claim steps run
at timestamp 21 so the claim's day math is exercisable (global
accumulator start 20, end 49, period 1, supplies [1000]*30,
volumes [100]*30, incentive mint `GGfoM4FJeQ8CXTXhaWiekqRQAtYVDNAKHDdJAu8PrHtm`,
vault 10^9, user incentive ATA 17). A trade step funds the user
volume accumulator on the first trade of a VM (1,844,400
lamports, 137 bytes); later steps in the same VM reuse it and
cost 5,000 only. The collect destination DEST is pre-created
with 0 tokens.

Event layouts (offsets as read by verify.py from the raw
`Program data:` words; verify.py checks the fields it decodes,
not every byte of each event):
- BuyEvent (v2 buy, 500 bytes, disc `67f4521f2cf57777`): out
  @16, max @24, curve @64, lp_bps @72, lp_fee @80, proto_bps
  @88, proto_fee @96, quote @104, user_quote_in @112,
  creator_bps @344, creator_fee @352.
- SellEvent (v2 sell, 449 bytes, disc `3e2f370aa503dc2a`):
  out @16, max @24, curve @64, lp_bps @72, lp_fee @80,
  proto_bps @88, proto_fee @96, quote @104, user_out @112.
- BuyEvent (v2 buy_exact, 515 bytes, disc `67f4521f2cf57777`):
  same slots as the v2 buy event.
- BuyEvent (legacy buy, 497 bytes; legacy buy_exact, 512 bytes,
  is not exercised in this packet; disc
  `67f4521f2cf57777`): out @16, max @24, curve @64, lp_bps
  @72, lp_fee @80, proto_bps @88, proto_fee @96, quote @104,
  user_quote_in @112, creator_bps @344, creator_fee @352,
  track @360, cashback_bps @408 (buy) / @423 (exact),
  cashback @416 (buy) / @431 (exact), buyback_bps @424 (buy)
  / @439 (exact), buyback_fee @432 (buy) / @447 (exact).
- SellEvent (legacy sell, 449 bytes, disc `3e2f370aa503dc2a`):
  curve @64, lp_fee @80, protocol_fee @96, quote @104,
  user_out @112; cashback sell adds creator_bps @344,
  creator_fee @352, cashback_bps @360, cashback @368,
  buyback_fee @384.
- SweepPoolFeeEvent, 185 bytes, disc `82a42461e48287a5`:
  timestamp @8, recipient @112, amount @176 (GROSS), bucket
  @184 (0 protocol, 1 creator).
- CollectCoinCreatorFeeEvent, 120 bytes, disc
  `e8f5c2eeeada3a59`: timestamp @8, coin_creator @16, fee
  @48, vault ATA @56, token account @88.
- ClaimCashbackEvent, 72 bytes, disc `e2d6f62107f293e5`:
  user @8..40, amount @40..48, timestamp @48..56,
  total_claimed @56..64, total_cashback_earned @64..72.
- ClaimTokenIncentivesEvent, 104 bytes, disc
  `4facf631cd5bcee8` (sha256("event:ClaimTokenIncentivesEvent");
  `1004471ccc01281b` is the claim_token_incentives instruction
  discriminator, not the event's): user @8..40, mint @40..72, amount
  @72, timestamp @80, total_claimed_tokens @88,
  current_sol_volume @96.

Pool states below are (virtual_quote_reserves, protocol_fees,
creator_fees); lp_supply is 4,194,352,106,721 throughout and is
asserted on every step. User volume accumulator fields below
are (needs_claim, total_unclaimed, total_claimed,
current_sol_volume, last_update_timestamp,
has_total_claimed_tokens, cashback_earned,
total_cashback_claimed).

## Cases (16 cases, 69 steps per image, 207 receipts)

Family A -- fresh v2 trade -> token claim (zero) -> sweep ->
collect (the trade creates a zeroed accumulator, so the token
claim has nothing to pay):
- `a-v2buy-tclaim-swc-col`: buy_v2 10^10 (spend 1,847,796,
  pool (-139,844, 10,975, 128,869), fresh accumulator, payer
  -1,849,400), token claim: 0 events, log "No tokens to
  claim", payer -5,000, last 0 -> 21, all else zero; sweep
  creator 128,869 (pool (-10,975, 10,975, 0)); collect drains
  128,869 to DEST.
- `a-v2buy-tclaim-tclaim-swc-col`: a second token claim is
  still a zero claim (volume 0, unclaimed 0, last stays 21);
  sweep/collect unchanged.
- `a-v2sell-tclaim-swc-col`: sell_v2 10^10 (receipt
  1,802,115, pool (-139,843, 10,974, 128,869), fresh
  accumulator), token claim zero (last 0 -> 21), sweep
  128,869 (pool (-10,974, 10,974, 0)), collect 128,869.
- `a-vexact-tclaim-swc-col`: buy_exact_v2 10^7 (out
  54,115,018,303, spend 10,000,000, pool (-201,438, 48,414,
  153,024), fresh accumulator), token claim zero, sweep
  153,024 (pool (-48,414, 48,414, 0)), collect 153,024.

Family B -- seeded token claim, order independence (seeded
accumulator: needs 1, unclaimed 111, claimed 222, volume
333,444, last 20, has 1, earned 555, cb_claimed 666):
- `b-tclaim-v2buy-swc-col`: token claim first: reward
  333,444 * 1000 / 100 = 3,334,440, amount 111 + 3,334,440 =
  3,334,551, claimed 222 -> 3,334,773, volume -> 0, last ->
  21, needs -> 0, earned/cb_claimed untouched (555/666);
  vault 10^9 -> 996,665,449, user incentive ATA 17 ->
  3,334,568. Then v2 buy (accumulator snapshot unchanged),
  sweep 128,869, collect 128,869.
- `b-v2buy-tclaim-swc-col`: trade first, then the identical
  token claim (same amount, same finals), then sweep/collect.
- `b-v2buy-swc-col-tclaim`: trade, sweep, collect, then the
  identical token claim -- in these cases the trade, sweep
  and collect steps leave the accumulator and the global
  accumulator snapshots unchanged.
- `b-tclaim-tclaim-v2buy-swc-col`: claim, then a second
  claim (zero: volume 0, unclaimed 0, last stays 21), then
  trade, sweep, collect -- all finals identical.

Family C -- cashback cross-pipe (cashback pool, pre-created
accumulator and uvata; token claim touches no cashback field):
- `c-cbbuy-tclaim-cbclaim-swc-col`: cashback buy 10^10
  (earned 5,475, uvata 5,475, uvata lamports 2,044,755),
  token claim zero (earned stays 5,475, last 0 -> 21),
  cashback claim pays 5,475 (cb_claimed 5,475, uvata
  lamports back to 2,039,280, last stays 21 -- the cashback
  claim does not stamp last_update_timestamp), sweep
  123,394, collect 123,394. Total: 5,475 + 123,394 =
  128,869, the non-cashback total, conserved.
- `c-cbbuy-cbclaim-tclaim-swc-col`: cashback claim first,
  then the token claim zero (cb_claimed stays 5,475, last
  0 -> 21), then sweep/collect -- same finals.
- `c-cbsell-tclaim-cbclaim-swc-col`: cashback sell 10^9
  (earned 548, uvata lamports 2,039,828), token claim zero
  (earned stays 548), cashback claim pays 548, sweep
  123,394, collect 123,394. Total: 548 + 123,394 = 123,942.

Family D -- failure isolation (the failed claim rolls back
fully; the following pipes still drain in full):
- `d-tclaim-nogva-v2buy-swc-col`: token claim with the
  global accumulator missing -> 3012 AccountNotInitialized
  (site: global_volume_accumulator), full rollback, payer
  -5,000; then v2 buy, sweep 128,869, collect 128,869.
- `d-tclaim-shortvault-v2buy-swc-col`: seeded unclaimed
  111 with vault 5 -> Token program custom error 1
  (insufficient funds), full rollback, payer -5,000; then
  v2 buy, sweep 128,869, collect 128,869.
- `d-tclaim-missingata-v2buy-swc-col`: seeded unclaimed
  111 with the user incentive ATA missing -> init_if_needed
  creates it (payer -2,044,280 = fee 5,000 + rent
  2,039,280), claim pays 111 (claimed 222 -> 333, user ATA
  111, last 20 -> 21); then v2 buy, sweep 128,869, collect
  128,869.

Family E -- legacy chains (legacy trades also leave the token
claim untouched):
- `e-lsell-tclaim-swc-col`: legacy sell 10^9 (receipt
  180,212, pool fields unchanged, creator ATA +548,
  protocol ATA +849, buyback +849; pre-seeded zeroed
  accumulator), token claim zero (last 0 -> 21), sweep
  123,394, collect 123,942 = seed + direct leg.
- `e-lbuy-tclaim-swc-col`: legacy buy 10^10 (spend
  1,847,796, fresh accumulator), token claim zero, sweep
  123,394, collect 128,869 = seed + direct leg 5,475.

## Result

- A fresh trade feeds the token claim nothing: the trade
  creates a zeroed accumulator (volume 0, unclaimed 0), so
  the following token claim is a zero claim that only stamps
  last_update_timestamp (0 -> 21) and pays nothing, on the
  five trade paths measured (v2 buy, v2 sell, v2 exact,
  legacy buy, legacy sell; the legacy sell case uses a
  pre-seeded zeroed accumulator). This is the chained confirmation of 2nd #48's
  event-only track_volume finding.
- In the measured orderings the token pipe and the fee pipes
  do not interact: a seeded token claim pays the same amount
  (3,334,551) whether it runs before the trade, between the
  trade and the sweep, or after the collect, and in this
  packet no trade, sweep or collect step changed a
  pre-existing accumulator snapshot, the global accumulator,
  or the incentive ATAs. The one second token claim measured
  after a paying claim (`b-tclaim-tclaim-v2buy-swc-col`) is a
  zero claim.
- In the measured cases the two claims touch disjoint fields:
  the token claim (paying in Family B, zero in Family C) did
  not move cashback_earned or total_cashback_claimed, and the
  cashback claim did not move total_unclaimed, total_claimed,
  current_sol_volume, or needs_claim -- though in Family C
  those token fields are all 0, so this is only shown at zero.
  The cashback claim did not stamp last_update_timestamp,
  while the token claim did. In `c-cbbuy-*` the cashback claim
  plus the collect (5,475 + 123,394) equals the 128,869 the
  non-cashback v2 buy cases collect; in `c-cbsell-*`
  548 + 123,394 equals the 123,942 collected in
  `e-lsell-tclaim-swc-col`.
- Failure isolation for the two failing token claims
  measured (3012 missing global accumulator, Token custom 1
  short vault): each rolls back every watched account except
  the fee payer, and the following trade -> sweep -> collect
  still drains the full bucket (no fee-pipe failure was
  chained here); a missing
  user incentive ATA is created by init_if_needed and the
  claim lands.
- The global volume accumulator snapshot is unchanged
  before/after every step in this packet (checked by
  verify.py). Which other instructions write it is not
  measured here.

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
- The incentive mint, global accumulator supplies/volumes,
  and user accumulator seeds are synthesized post-hoc (as in
  2nd #4); this pins handler behavior, not a reachable
  mainnet state.
- Token-claim steps run at clock timestamp 21 (global
  accumulator start 20, end 49, period 1) so the reward-day
  math is exercisable; trade steps run at timestamp
  1234567890. Timestamps are part of the asserted events.
- Transfer-fee variants of these chains, and token claims on
  cashback/mayhem pools beyond the legacy cashback cases
  here, were not chained; the tf dimension for sweep chains
  was pinned in 3rd #5/#8/#9/#11/#15/#19 and the mode gates
  in 2nd #44.

## Verify / provenance

From the repository root:

    python3 -I -B research/amm-trade-claim-token-incentives-sweep-collect-20261029/verify.py

verify.py needs `solders` and the three program images retained in
the repository (`evidence/original/pump_amm/deployed.so` plus the
gzip `candidate.so.gz` artifacts under
`research/amm-multi-hop-group-slice-recovery/artifacts/` (#424
control) and `research/amm-transfer-fee-diagnostic-recovery/artifacts/`
(#427 candidate), hashed decompressed). It re-checks the recorded
receipts; it does not re-execute them. producer.py, which generated
the receipts with LiteSVM, depends on a private `~/workspace` layout
and is kept for provenance only.
