# trade -> sweep -> collect loops

## Problem

3rd #4 chained a single pass of the fee pipeline -- a v2 trade
accrues fees into the pool, sweep_creator_fee moves the creator
bucket to the creator vault ATA, collect_coin_creator_fee drains
it to the creator's token account -- and left the loop open. A
single pass cannot answer the sharp question: does the pipeline
reset cleanly for the next trade, or does the drained state move
the next trade's price? A sweep converts an accrual into virtual
quote reserves and a collect empties an ATA, so either step could
in principle reprice the next trade, and the pool's protocol
bucket keeps accruing across loops while only the creator bucket
is swept. This packet runs buy, sell, and buy_exact loops
(trade -> sweep -> collect -> trade -> sweep -> collect) in
single VMs, one signed transaction per step, on three program
images (original, #424 control, #427 candidate).

## Fixture

The repository liquidity fixture: pool
`GseMAnNDvntR5uFePZ51yZBXzNSn7GdFPkfHwfr6d77J`, base vault
673,696,395,912,745, quote vault 122,946,690,720, LP supply
4,194,352,106,721, pool protocol_fees 2,488, creator_fees 123,394,
virtual_quote_reserves -125,882, disable_flags 0, clock slot 100 /
timestamp 1234567890. The protocol and creator recipient ATAs
and the collect destination DEST are pre-created with 0 tokens,
so every sweep and collect costs only the 5,000 fee. A trade
step also creates the user volume accumulator on the first trade
of a VM (1,844,400 lamports, 137 bytes); later trades in the
same VM reuse it and cost 5,000 only.

Event layouts (offsets as read from the receipts; verify.py
decodes only the fields its expectations name):
- BuyEvent (v2), 500 bytes, disc `67f4521f2cf57777`: curve
  @64, lp_bps @72, lp_fee @80, protocol_bps @88, protocol_fee
  @96, quote_with_lp @104, user_quote_in @112.
- SellEvent (v2), 449 bytes, disc `3e2f370aa503dc2a`: curve
  @64, lp_bps @72, lp_fee @80, protocol_bps @88, protocol_fee
  @96, quote @104, user output @112.
- BuyExactEvent (v2), 515 bytes, disc `67f4521f2cf57777`:
  asserted by discriminator and length only here.
- SweepPoolFeeEvent, 185 bytes, disc `82a42461e48287a5`:
  timestamp @8, recipient @112, amount @176, bucket @184 (0
  protocol, 1 creator).
- CollectCoinCreatorFeeEvent, 120 bytes, disc
  `e8f5c2eeeada3a59`: timestamp @8, coin_creator @16, fee
  @48, vault ATA @56, token account @88.

## Cases (6 cases, 24 steps per image, 72 receipts)

Family A -- fresh anchors:
- `a-buy-1e10`: buy 10^10: spend 1,847,796, vault +1,839,310,
  buyback 8,486, pool (-139,844, 10,975, 128,869). Event:
  curve 1,824,983, lp 365, protocol gross 16,973, quote
  1,825,348, uin 1,847,796.
- `a-sell-1e10`: sell 10^10: user +1,802,115, vault
  -1,810,601, buyback 8,486, pool (-139,843, 10,974, 128,869).
  Event: curve 1,824,927, lp 365, protocol gross 16,972,
  quote 1,824,562, uout 1,802,115.
- `a-exact-1e7`: exact 10^7: out 54,115,018,303, spend
  10,000,000, vault +9,954,074, buyback 45,926, pool (-201,438,
  48,414, 153,024).

Family B -- buy loop (buy -> swc -> col -> buy -> swc -> col
-> swp -> col-noop):
- First buy, sweep, and collect match the anchor exactly (the
  first buy's raw event is byte-identical to `a-buy-1e10`'s):
  sweep moves 128,869 (pool cf 0, vq -10,975), collect drains
  128,869 to DEST, pool untouched by collect.
- Second buy costs 1,847,852 -- 56 MORE than the fresh anchor
  -- with vault +1,839,366 (vs +1,839,310) and the same
  buyback 8,486. Event: curve 1,825,037, lp 366, protocol
  gross 16,973, quote 1,825,403, uin 1,847,852. The first buy
  moved the curve, and neither the sweep nor the collect
  undoes that.
- Second sweep moves exactly 5,476 (the second buy's creator
  accrual), second collect drains exactly 5,476, pool pf
  19,462 (10,975 + 8,487) -- the protocol bucket accrued
  across both loops while only the creator bucket was swept.
- Protocol sweep moves 19,462 to the protocol ATA (pool
  (0, 0, 0)); the following collect is a silent no-op
  (0 events, payer 5,000 only), protocol ATA untouched --
  protocol sweep output is NOT collected by
  collect_coin_creator_fee (observed here after the creator
  side was already drained twice).

Family C -- sell loop (sell -> swc -> col -> sell -> swc ->
col -> col-noop):
- First sell, sweep (128,869), and collect (128,869) match
  the anchor exactly.
- Second sell pays 1,802,061 -- 54 LESS than the anchor --
  with vault -1,810,547 and the same buyback 8,486. Event:
  curve 1,824,873, lp 365, protocol gross 16,972, quote
  1,824,508, uout 1,802,061.
- Second sweep moves exactly 5,475, second collect drains
  exactly 5,475, pool pf 19,460. A third collect is a silent
  no-op (0 events).

Family D -- exact loop (exact -> swc -> col -> exact -> swc
-> col):
- First exact, sweep (153,024), and collect (153,024)
  match the anchor exactly.
- Second exact lands 54,106,324,497 -- 8,693,806 BELOW its
  anchor -- at the same 10,000,000 spend, with vault
  +9,954,074 and buyback 45,926 unchanged. Exact is the most
  curve-sensitive leg in the loop: the first exact moved
  54,115,018,303 base out of the vaults, so the second
  exact reprices hard while its spend and vault legs stay
  fixed.
- Second sweep moves exactly 29,630, second collect drains
  exactly 29,630, pool pf 94,340.

## Result

- Collect drains exactly what the sweep moved, and the pool
  is untouched by collect: every sweep amount in this packet
  (128,869, 5,476, 19,462, 5,475, 153,024, 29,630) is drained
  to the token by the following collect, and the creator
  vault ATA ends at 0 after every collect.
- The loop does NOT reset the price. Second-leg deltas vs
  fresh anchors: buy +56 spend, sell -54 payout, exact
  -8,693,806 out. The sweep/collect pair is price-neutral
  for a following trade (shown in 3rd #6/#7/#8/#9, not
  re-measured here), but it does not
  rewind the curve move the previous trade itself caused --
  the next trade prices off the moved vaults, not off the
  drained fee accounts.
- What DOES reset is the fee plumbing: every sweep moves
  exactly the current pool creator bucket and every collect
  drains exactly that sweep's output, at every loop
  iteration, on all three images.
- Protocol sweep output stays uncollectable after a full
  loop: the collect after the protocol sweep is a silent
  no-op, and a collect after a drained vault ATA is a
  silent no-op too (0 events, payer 5,000 only, every other
  watched account snapshot unchanged).

## Limits

- Offline LiteSVM reproduction on a synthetic fixture only; no
  claim about on-chain behavior beyond these measured
  transactions, no source change, no build, and no whole program
  equivalence claim.
- All amounts, error codes, and site lines are exact values for
  this fixture state, not claims about other pool states. Error
  site line numbers differ between the original and the rebuilt
  images; verify.py checks each image's recorded site line
  against that image's own logs and never compares site lines
  across images (2nd #36 lesson).
- The buy_exact event is asserted by discriminator and length
  only (515 bytes); its interior u64 slots are not decoded
  into named fields here, unlike the buy/sell events whose
  curve/lp/protocol/quote slots are pinned.
- The recipient ATAs and DEST are pre-created with 0 tokens
  (as in 3rd #4), so sweeps and collects cost 5,000 rather
  than the fresh-ATA 2,044,280; token legs are unaffected.
- Trades under a transfer fee inside the loop were not chained
  here; the sweep/collect legs under tf were pinned in 3rd
  #5 and the sweep -> v2 trade legs under tf in 3rd #9.

## Verify and provenance

From the repository root:

    python3 -I -B research/amm-trade-sweep-collect-loops-20261029/verify.py

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
