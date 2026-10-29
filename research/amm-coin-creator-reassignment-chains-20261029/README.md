# research: coin-creator reassignment chained into trades, sweeps, collects, and migration

## Problem

`set_coin_creator` and `migrate_pool_coin_creator` were pinned
first as isolated setter calls (2nd #9,
`research/amm-coin-creator-reassignment-20261029`) and then as
downstream bindings (2nd #49,
`research/amm-coin-creator-downstream-binding-20261029`), which
already chained set/sweep/migrate/collect with legacy buy/sell
and v2 buy: set -> buy routing, old-vault 2006, migrate 6081,
collect 6048 after migrate, and the zero-creator v2/legacy buy
skipping the creator leg. This packet extends those chains to
cases 2nd #49 did not run: zero-creator sell_v2 and
buy_exact_v2, sweep/collect of the zero-creator vault, the
bonding-curve set path, the full post-migrate chain (second
buy, protocol sweep, sharing-vault sweep, then collect), the
6046 bad-admin migrate inside a chain, and the zero-creator
and rerouted bucket under a 100 bps quote transfer fee. Two
questions frame it. First, after a trade accrues a creator
bucket, does a reassignment reroute the unswept pool bucket to
the new creator, or does the old vault keep its claim? Second,
what do the v2 trades do on a pool whose coin_creator was
never set (zero)? The zero case matters because `set_coin_creator` is a
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

The "not the normal ..." comparison figures are the creator-set
fixture values: buy 1,847,796 / 1,839,310 is re-measured here
(first buy of `b-set-already-set-buy-sweep-collect`); the sell
(1,802,115 / 1,810,601), buy_exact (54,115,018,303) and tf100
buy (1,866,375) figures are quoted from earlier merged AMM
packets and are not re-measured or checked by verify.py.

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
  54,275,823,786 base (not 54,115,018,303) -- 160,805,483 more base;
  consistent with the skipped creator fee staying in the curve
  input (the mechanism is not separately measured) --
  vault quote +9,953,938, buyback 46,062, pool (-171,945,
  48,551, 123,394). The 515-byte BuyEvent reports out
  54,275,823,786, quote_in 10,000,000, lp 1,982, proto 92,125,
  qwlp 9,907,875, uin 9,905,893.
- `a-zero-buy-sweep-collect-zero`: zero buy, then sweep to
  the zero-creator vault and collect to the zero-creator
  destination drain exactly the seed 123,394 each.
- `a-zero-legacy-buy-sell-rejected`: legacy buy and legacy
  sell on the zero-creator pool, passed the standard
  three-entry remaining accounts `[pool-v2, buyback owner,
  buyback ATA]`, both fail 6053
  BuybackFeeRecipientNotAuthorized (global_config.rs:326)
  with full rollback. This is specific to that account list:
  2nd #49 (`buy-before-set`) shows a legacy buy on a
  zero-creator pool SUCCEEDS (spend 1,842,321, creator leg
  skipped) when the trimmed remaining `[buyback owner,
  buyback ATA]` is passed. The trimmed list is not run here.
- `a-zero-collect-dest-missing`: zero buy, zero-vault sweep
  123,394, then collect with no destination ATA fails 3012
  (caused by account coin_creator_token_account) with full
  rollback.

Family B -- set_coin_creator reroutes the bucket:

- `b-zero-buy-set-metaplex-sweep-routes-new`: zero buy, then
  set (metaplex first creator, 144-byte event disc
  966bc77b7ccf66e4; pool coin_creator 0 -> 0x11..11) -- the
  OLD (zero-creator) vault sweep fails 2006
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
  (already-set) fixture pool is a silent no-op (0 events, every
  watched account except the fee payer unchanged, including
  the pool's coin_creator bytes); the following
  buy/sweep/collect drain 128,869 as usual.

Family C -- migrate gates, chained:

- `c-buy-migrate-gate-sweep-collect-migrate`: buy, then
  migrate fails 6081 CreatorFeesNotSwept
  (migrate_pool_coin_creator.rs:59) with full rollback;
  after sweep 128,869 and collect 128,869, migrate succeeds
  (176-byte event disc aadd52c793a5f72e) and the pool's
  coin_creator becomes the event's new value (the sharing-config
  PDA; the PDA derivation itself is not re-checked by verify.py).
- `c-migrate-then-trade-sweep-collect-blocked`: the full
  chain -- buy, sweep, collect, migrate, second buy (legs
  1,847,852 / 1,839,366, pool (-24,938, 19,462, 5,476)),
  protocol sweep 19,462 (pool (-5,476, 0, 5,476)), sharing
  -vault sweep 5,476 (pool (0, 0, 0)) -- then collect to the
  sharing destination fails 6048
  CreatorVaultMigratedToSharingConfig
  (collect_coin_creator_fee.rs:68) with full rollback. The
  5,476 bucket is left in the sharing vault ATA at the end of
  the case; the pump:distribute_creator_fees path that is meant
  to pay it out is not executed here. The protocol sweep still
  works after migration.
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
  and new-dest collect 120,938 (destination withheld 1,222;
  the sweep's 1,234 stays withheld in the new vault ATA, no
  harvest is run) -- per-hop withholding, applied to the
  rerouted bucket.

## Result

- On this fixture, a zero coin_creator makes the measured v2
  trades skip the creator fee leg (buy -5,475 spend, sell
  +5,475 receipt, buy_exact +160,805,483 out versus the
  creator-set figures above). Legacy buy/sell with the
  standard three-entry remaining accounts fail 6053 on the
  same pool; 2nd #49 shows the legacy buy succeeds with the
  trimmed remaining list, so this is an account-list
  requirement, not a blanket legacy rejection.
- In the measured set chains the unswept pool creator_fees
  bucket follows the new creator: after a set, the old
  (zero-creator) vault sweep fails 2006 and the new vault
  sweep drains the whole bucket, including accruals from
  trades made after the set.
- Migration: the migrate gate (6081) requires the bucket to
  be swept first, and after migration collect keyed by the
  sharing PDA fails 6048, so in `c-migrate-then-trade-...` the
  post-migrate accrual (5,476) ends the case in the sharing
  vault ATA. The pump distribute path is not run, so no claim
  is made about how that ATA is emptied. The protocol bucket
  still sweeps after migration.
- An already-set pool ignores a second set (0 events, no
  account change), matching 2nd #9 and 2nd #49; in these
  cases set fires only from a zero coin_creator.
- No original-vs-rebuilt divergence in the measured surface:
  all 16 cases agree
  across the original, control (#424), and candidate (#427)
  images (observed surface, error codes, rollback, events).
  Error sites are recorded per image in the report and are
  not compared across images, because original and rebuilt
  sources differ in line numbers.

## Verification

Run from the repository root:

    python3 -I -B research/amm-coin-creator-reassignment-chains-20261029/verify.py

It checks, from the packet files alone plus the three program
images retained in the repository
(`evidence/original/pump_amm/deployed.so`, and the gzip-compressed
#424 control `research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz`
and #427 candidate `research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz`,
hashed after decompression):

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
- The silent no-op set leaves every watched account except the
  fee payer unchanged; every successful set moves the pool's
  coin_creator (bytes 211..243) from zero to the event's
  creator, and every successful migrate from the event's old
  value to its new value.
- The three program images hash to the values recorded in the
  report.

Provenance: `producer.py` regenerates the receipts but depends on
a private workspace layout (`~/workspace/pumpfun-sparse` harness
scripts and `~/workspace/slop-verify` images; it `chdir`s there
at import), so it is not runnable from this repository as-is.
verify.py does not depend on it. The comparison figures quoted
from other packets are not checked by verify.py.

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
