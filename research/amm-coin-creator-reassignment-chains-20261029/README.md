# research: coin-creator reassignment chained into trades, sweeps, collects, and migration

## Problem

`set_coin_creator` and `migrate_pool_coin_creator` were pinned
before only as isolated setter calls (2nd #9) and downstream
bindings (2nd #49), never chained into the fee pipes. Two
questions were open. First, after a trade accrues a creator
bucket, does a reassignment reroute the unswept bucket to the
new creator, or does the old vault keep its claim? Second, what
does a trade do on a pool whose coin_creator was never set
(zero)? The zero case matters because `set_coin_creator` is a
no-op once a creator is set, so a zero-creator pool is the only
state where the setter can still fire -- and the fee pipes must
decide what a missing creator means.

## Cases

16 cases, 56 steps, 168 receipts (each step run on the original,
control (#424), and candidate (#427) images). All amounts are
token amounts unless noted. Pool state is
(virtual_quote_reserves i128, protocol_fees, creator_fees,
lp_supply). The fixture pool is (-125,882, 2,488, 123,394,
4,194,352,106,721). Transfer fee is applied to the quote mint
only, via the `transferfee(quote, bps, 2**64-1)` override.
Zero-creator cases zero pool bytes 211..243. The set cases use
a metaplex metadata account (first creator 0x11..11) or a
bonding-curve account (creator 0x33..33); the migrate cases use
a sharing-config account whose admin is the pool's current
coin_creator unless noted.

Family A -- zero-creator v2 trades skip the creator fee (nofee):

- `a-zero-buy-v2-fee-skipped`: buy_v2(10^10) spends 1,842,321
  (not the normal 1,847,796), vault nets 1,833,835 (not
  1,839,310), buyback 8,486, pool (-134,369, 10,975, 123,394)
  -- the creator bucket stays at the seed 123,394. The
  500-byte BuyEvent reports uin 1,842,321 (curve 1,824,983,
  lp 365, proto 16,973, qwlp 1,825,348).
- `a-zero-sell-v2-fee-skipped`: sell_v2(10^10) receipts
  1,807,590 (not 1,802,115), vault pays 1,816,076 (not
  1,810,601), buyback 8,486, pool (-134,368, 10,974, 123,394).
- `a-zero-buyx-v2-fee-skipped`: buy_exact_v2(10^7, 1) outs
  54,275,823,786 base (not 54,115,018,303) -- the skipped fee
  stays in the curve input, worth ~160M base at this slope --
  vault quote +9,953,938, buyback 46,062, pool (-171,945,
  48,551, 123,394). The 515-byte BuyEvent reports out
  54,275,823,786, quote_in 10,000,000, lp 1,982, proto 92,125,
  qwlp 9,907,875, uin 9,905,893.
- `a-zero-buy-sweep-collect-zero`: zero buy, then sweep to
  the zero-creator vault and collect to the zero-creator
  destination drain exactly the seed 123,394 each.
- `a-zero-legacy-buy-sell-rejected`: legacy buy and legacy
  sell on the zero-creator pool both fail 6053
  BuybackFeeRecipientNotAuthorized (global_config.rs:326)
  with full rollback -- the v2 tolerance does not extend to
  the legacy pipe.
- `a-zero-collect-dest-missing`: zero buy, zero-vault sweep
  123,394, then collect with no destination ATA fails 3012
  (caused by account coin_creator_token_account) with full
  rollback.

Family B -- set_coin_creator reroutes the bucket:

- `b-zero-buy-set-metaplex-sweep-routes-new`: zero buy, then
  set (metaplex first creator, 144-byte event disc
  966bc77b7ccf66e4) -- the OLD vault sweep fails 2006
  ConstraintSeeds (sweep_fees.rs:113), while the NEW vault
  sweep drains exactly the seed 123,394 and the new-dest
  collect pays 123,394.
- `b-zero-buy-set-buy-sweep-collect-new`: zero buy, set,
  second buy (spends 1,847,852, vaults 1,839,366, pool
  (-148,332, 19,462, 128,870)) -- the new vault sweep and
  collect drain the full 128,870 (seed + 5,476 second-buy
  accrual).
- `b-set-bonding-buy-sweep-collect`: set-bonding first
  (144-byte event disc f2e7eb664163bdd3), then buy, then
  bonding-curve vault sweep/collect drain 128,869.
- `b-set-already-set-buy-sweep-collect`: set on the normal
  (already-set) fixture pool is a silent no-op (0 events,
  creator unchanged); the following buy/sweep/collect drain
  128,869 as usual.

Family C -- migrate gates, chained:

- `c-buy-migrate-gate-sweep-collect-migrate`: buy, then
  migrate fails 6081 CreatorFeesNotSwept
  (migrate_pool_coin_creator.rs:59) with full rollback;
  after sweep 128,869 and collect 128,869, migrate succeeds
  (176-byte event disc aadd52c793a5f72e) and coin_creator
  becomes the sharing-config PDA.
- `c-migrate-then-trade-sweep-collect-blocked`: the full
  chain -- buy, sweep, collect, migrate, second buy (legs
  1,847,852 / 1,839,366, pool (-24,938, 19,462, 5,476)),
  protocol sweep 19,462 (pool (-5,476, 0, 5,476)), sharing
  -vault sweep 5,476 (pool (0, 0, 0)) -- then collect to the
  sharing destination fails 6048
  CreatorVaultMigratedToSharingConfig
  (collect_coin_creator_fee.rs:68) with full rollback. The
  bucket sits in the sharing vault ATA, reachable only via
  pump:distribute_creator_fees, while the protocol sweep
  still works after migration.
- `c-zero-buy-set-sweep-collect-migrate`: zero buy, set,
  new-vault sweep/collect 123,394, then migrate (sharing
  admin = new creator) succeeds.
- `c-buy-migrate-bad-admin-sweep-collect`: buy, then migrate
  with a sharing admin that is not the pool's coin_creator
  fails 6046 InvalidSharingConfigCoinCreator with full
  rollback; the following sweep/collect still drain 128,869
  to the original creator.

Family D -- zero-creator skip under tf100:

- `d-zero-buy-tf100-fee-skipped`: zero buy under tf100
  spends 1,860,845 (not the normal 1,866,375), vault nets
  1,833,835, buyback net 8,401 (withheld 85), vault withheld
  18,524, pool (-134,369, 10,975, 123,394). The BuyEvent
  still reports the pre-tf figures (uin 1,842,321, qwlp
  1,825,348) -- events are tf-blind, as in 3rd #31.
- `d-zero-buy-tf100-set-sweep-collect-new`: zero buy under
  tf100, set, then new-vault sweep 122,160 (withheld 1,234)
  and new-dest collect 120,938 (destination withheld 1,222,
  vault withheld 1,234 stranded) -- the usual per-hop
  withholding, applied to the rerouted bucket.

## Result

- A zero coin_creator makes v2 trades skip the creator fee
  leg entirely (buy -5,475 spend, sell +5,475 receipt,
  exact +160,805,483 out), while legacy trades on the same
  pool fail 6053. The v2/legacy asymmetry is the sharpest
  single observation in this packet: one pipe tolerates the
  missing creator by dropping its fee, the other rejects the
  trade.
- Reassignment reroutes, it does not strand: after a set,
  the old vault sweep is a seeds failure (2006) and the new
  vault drains the whole bucket, including accruals from
  trades made after the set.
- Migration is the one reassignment that strands: the
  migrate gate (6081) forces the bucket to zero first, and
  once migrated, pump-amm's own collect is closed (6048) --
  the sharing vault ATA can only be emptied by the pump
  program's distribute path. The protocol bucket is
  unaffected and still sweeps after migration.
- Set is idempotent in the other direction too: an
  already-set pool ignores a second set (0 events), so the
  rerouting above only ever happens once per pool.
- No original-vs-rebuilt divergence: all 16 cases agree
  across the original, control (#424), and candidate (#427)
  images (observed surface, error codes, rollback, events).
  Error sites are recorded per image in the report and are
  not compared across images, because original and rebuilt
  sources differ in line numbers.

## Verification

Run `python3 verify.py` from this directory. It checks, from the
packet files alone (plus the three program images):

- MANIFEST.json lists every packet file with a matching sha256.
- runtime/report.json.gz: 16 cases, 168 receipts, 17 parts
  (16x10 + 8), part sha256/byte counts match the part files.
- Every receipt transaction parses (solders) and all signatures
  verify.
- Every receipt's recorded before/after snapshots reproduce the
  report's expected values: fee-payer lamport deltas, the
  token-leg deltas, lamport deltas for the quote accounts
  (sweep moves lamports with the tokens, collect moves tokens
  only), withheld balances after each step, pool state, volume
  accumulator state, and decoded event fields.
- Failure steps roll back every watched account except the fee
  payer (fee 5,000) and carry the expected error code plus the
  recorded per-image site line in their logs.
- The observed surface of every case is identical across the
  original, control, and candidate images.
- The three program images hash to the values recorded in the
  report.

## Limits

- The legacy 6053 failure's internal trigger is recorded as
  observed behavior only: the deployed original's site line
  (global_config.rs:326) does not line up with the sparse
  checkout's copy of that file, so no mechanism is asserted
  for why the zero creator trips the buyback authorization
  check.
- The zero-creator legacy cases use the zero-creator vault
  keys; passing the original creator's vault keys fails
  earlier (2006/3007 account checks) and is not the measured
  path.
- The mayhem/cashback mode flags are not varied here: the
  zero-creator and reassignment chains run on the plain pool
  so the routing result is not confounded by a mode gate.
- The transfer-fee override applies to the quote mint only
  with max fee 2**64-1; the tf100 sweep/collect legs use the
  178-byte override accounts (withheld at offset 170) and the
  packet-created Token-2022 ATAs (182 bytes, offset 174).
- No source change is proposed: this packet pins behavior only.
