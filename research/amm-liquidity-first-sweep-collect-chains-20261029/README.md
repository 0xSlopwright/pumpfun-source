# liquidity first, then sweep -> collect

## Problem

3rd #6 chained sweeps INTO deposit, withdraw, and legacy buy and
found them price-neutral, and 3rd #4 chained trades into sweep ->
collect. Neither chained LIQUIDITY FIRST into sweep -> collect:
deposit and withdraw move vaults and LP supply but accrue nothing
into the pool fee buckets, so the sweep after a deposit should
move exactly the seed buckets -- and a trade's accrual should
survive an intervening deposit or withdraw untouched into the
sweep and the collect. The reverse-order question matters because
3rd #3 pinned deposit/withdraw legs to AVAILABLE reserves (raw
vault quote minus accrued fees): after a trade accrues 128,869,
the deposit leg must move, yet the bucket itself must not. This
packet measures that order directly, in both directions, with
loops and round trips, in single VMs, one signed transaction
per step, on three program images (original, #424 control, #427
candidate).

## Fixture

The repository liquidity fixture: pool
`GseMAnNDvntR5uFePZ51yZBXzNSn7GdFPkfHwfr6d77J`, base vault
673,696,395,912,745, quote vault 122,946,690,720, LP supply
4,194,352,106,721, pool protocol_fees 2,488, creator_fees 123,394,
virtual_quote_reserves -125,882, disable_flags 0, clock slot 100 /
timestamp 1234567890. A sweep to a fresh ATA costs 2,044,280
(fee 5,000 + ATA rent 2,039,280); in the legacy variant the
recipient ATAs pre-exist with 0 tokens, so each sweep costs only
5,000. Deposit/withdraw steps cost 5,000; the first trade step in
a case costs 1,849,400 (volume rent 1,844,400 + fee 5,000). The
collect destination DEST is pre-created with 0 tokens.

Event layouts (the offsets verify.py decodes; other slots are not
checked):
- DepositEvent / WithdrawEvent, 264 bytes, disc `78f83d531f8e6b90` /
  `1609851aa02c47c0`: base leg @72, quote leg @80.
- SweepPoolFeeEvent, 185 bytes, disc `82a42461e48287a5`:
  timestamp @8, recipient @112, amount @176, bucket @184 (0
  protocol, 1 creator).
- CollectCoinCreatorFeeEvent, 120 bytes, disc `e8f5c2eeeada3a59`:
  timestamp @8, coin_creator @16, fee @48, vault ATA @56, token
  account @88.
- BuyEvent (v2), 500 bytes, disc `67f4521f2cf57777`; SellEvent
  (v2), 449 bytes, disc `3e2f370aa503dc2a`; legacy BuyEvent
  shares the v2 buy disc but is 497 bytes.

Pool states below are (virtual_quote_reserves, protocol_fees,
creator_fees); lp_supply is 4,194,352,106,721 unless noted.

## Cases (17 cases, 66 steps per image, 198 receipts)

Family A -- liquidity-first sweep/collect anchors (deposit and
withdraw accrue nothing):
- `a-dep9-swc-col`: dep-1e9 (-160,619,895,224 base /
  -29,312,410 quote, LP +10^9), sweep creator 123,394 (pool
  (-2,488, 2,488, 0), supply 4,195,352,106,721), collect drains
  exactly 123,394 to DEST.
- `a-dep12-swc-col`: dep-1e12 (-160,619,895,223,680 /
  -29,312,409,095, supply 5,194,352,106,721), sweep creator
  123,394, collect 123,394. Scale does not move the seed.
- `a-wd9-swc-col`: wd-1e9 (+160,619,895,223 / +29,312,409,
  supply 4,193,352,106,721), sweep creator 123,394, collect
  123,394.
- `a-wd12-swc-col`: wd-1e12 (+160,619,895,223,679 /
  +29,312,409,094, supply 3,194,352,106,721), sweep creator
  123,394, collect 123,394.

Family B -- trade -> liquidity -> sweep -> collect (the accrual
survives the intervening liquidity step untouched):
- `b-buy-dep9-swc-col`: buy 10^10 (spend 1,847,796, pool
  (-139,844, 10,975, 128,869)), dep-1e9 with legs
  -160,617,511,066 / -29,312,845 -- NOT the fresh legs
  (-160,619,895,224 / -29,312,410), because available reserves
  moved -- then sweep creator 128,869, collect 128,869.
- `b-buy-wd9-swc-col`: buy, wd-1e9 (+160,617,511,065 /
  +29,312,844, the 3rd #3 post-buy legs), sweep 128,869,
  collect 128,869.
- `b-sell-dep9-swc-col`: sell 10^10 (receipt 1,802,115, pool
  (-139,843, 10,974, 128,869)), dep-1e9 (-160,622,279,383 /
  -29,311,975), sweep 128,869, collect 128,869.
- `b-lbuy-dep9-swc-col` (legacy variant): legacy buy 10^10
  (spend 1,847,796, vault +1,825,348, protocol ATA +8,487,
  creator ATA +5,475, pool fields UNCHANGED (-125,882, 2,488,
  123,394)), dep-1e9 (-160,617,511,066 / -29,312,845), sweep
  creator 123,394 (pool (-2,488, 2,488, 0)), collect drains
  128,869 = the 123,394 seed PLUS the 5,475 direct legacy leg.
  In this case the collect drained the whole creator vault ATA
  balance, i.e. both the swept seed and the direct leg, even
  though the pool fields never held the leg.

Family C -- liquidity -> trade -> sweep -> collect (in these
cases the prior deposit/withdraw did not change the trade's
token legs or fee accrual):
- `c-dep9-buy-swc-col`: dep-1e9, then buy 10^10 settles with
  the same token deltas, decoded event amounts and pool fee
  fields as the fresh buy in `b-buy-dep9-swc-col` (spend 1,847,796, vault
  +1,839,310, buyback 8,486, pool (-139,844, 10,975, 128,869)),
  sweep 128,869, collect 128,869.
- `c-wd9-buy-swc-col`: wd-1e9, then buy: same token deltas and
  decoded event amounts as the fresh buy, sweep 128,869, collect 128,869.
- `c-dep9-sell-swc-col`: dep-1e9, then sell 10^10: same token
  deltas and decoded event amounts as the fresh sell in
  `b-sell-dep9-swc-col` (receipt 1,802,115, pool (-139,843,
  10,974, 128,869)), sweep 128,869, collect 128,869.
- `c-dep9-buy-buy-swc-col`: dep-1e9, buy, second buy (spend
  1,847,852, curve 1,825,037, pool (-153,807, 19,462, 134,345)),
  sweep 134,345, collect 134,345. The second buy accrued 5,476
  to creator_fees (134,345 - 128,869) and 8,487 to protocol_fees
  (19,462 - 10,975); the comparison with the sweep-free trade loop
  in 3rd #10 is not re-checked by this packet's verify.py.

Family D -- round trips and double collect:
- `d-dep9-swc-col-wd9`: dep-1e9, sweep 123,394, collect
  123,394, wd-1e9 returns the fresh withdraw legs exactly
  (+160,619,895,223 / +29,312,409), pool (-2,488, 2,488, 0).
- `d-dep9-wd9-swc-col`: dep-1e9, wd-1e9 (round trip nets -1
  base / -1 quote, pool back to (-125,882, 2,488, 123,394)),
  sweep 123,394, collect 123,394. The round trip leaves the
  seed intact.
- `d-dep9-swc-col-col`: dep-1e9, sweep 123,394, collect
  123,394, second collect is a SILENT NO-OP (0 events, payer
  5,000 only, DEST unchanged).

Family E -- protocol bucket in liquidity-first order:
- `e-buy-dep9-swp-swc-col`: buy, dep-1e9, protocol sweep
  10,975 (pool (-128,869, 0, 128,869)), creator sweep 128,869
  (pool (0, 0, 0)), collect drains only the creator 128,869.
  The collect did not move the 10,975 in the protocol ATA, as
  observed in 3rd #4; this packet does not test any other way of
  withdrawing it.
- `e-buy-dep9-swp-colnoop` (creator vault ATA pre-created
  empty): buy, dep-1e9, protocol sweep 10,975, collect is a
  SILENT NO-OP (0 events, DEST 0, protocol ATA intact).
  In this case collect did not touch the protocol ATA, and with
  no creator sweep the empty creator vault ATA had nothing to
  drain.

## Result

- In every measured case, deposit and withdraw (10^9 and 10^12
  LP) accrued nothing into either pool fee bucket: each
  liquidity-first sweep moved exactly the 123,394 seed, and each
  liquidity-first collect drained exactly 123,394. Within these
  cases only trades changed the buckets.
- A trade's accrual survived an intervening deposit or
  withdraw untouched: in the measured buy/sell -> dep/wd ->
  sweep -> collect cases the sweep moved and the collect drained
  the full 128,869, even though the
  intervening deposit/withdraw legs themselves move with the
  trade (dep after buy: base 160,617,511,066, quote
  29,312,845; dep after sell: base 160,622,279,383, quote
  29,311,975).
- A dep-1e9 or wd-1e9 before a buy or a sell left the trade's
  token deltas, decoded fee/amount event fields and pool fee
  accrual equal to the fresh trade's. The raw trade events are
  NOT byte-identical: the user base/quote balance words (@32,
  @40) and the pool base/quote reserve words (@48, @56) differ
  because the deposit/withdraw moved those balances. The pool
  lp_supply also differs (4,195,352,106,721 after dep-1e9,
  4,193,352,106,721 after wd-1e9). This is measured at one
  trade size (10^10) on one fixture, not a general curve
  property.
- In the legacy case, legacy buy -> dep -> sweep -> collect
  drained 128,869 even though the pool fields never held the
  5,475 direct leg: the sweep moved the 123,394 seed and the
  collect drained the whole creator vault ATA balance.
- Round trips compose with the fee pipes: dep -> sweep ->
  collect -> wd returned the fresh withdraw legs (equal
  base/quote event legs; the raw event's reserve and supply words
  differ), and dep -> wd -> sweep -> collect still moved only the
  seed.
  A second collect after a full drain, and a collect after a
  protocol-only sweep, are both silent no-ops.

## Limits

- Offline LiteSVM reproduction on synthetic fixtures only; no
  claim about on-chain behavior beyond these measured
  transactions, no source change, no build, and no whole
  program equivalence claim.
- All amounts are exact values for this fixture state, not
  claims about other pool states. No step in this packet fails,
  so verify.py's generic error-code, rollback and per-image
  site-line checks are vacuous here.
- Collect event interior slots past the fee/vault/dest fields
  are not decoded here; the event is asserted by discriminator
  and length plus the named slots above.
- Transfer-fee variants of liquidity-first chains were not
  chained here; the tf dimension for sweep chains was pinned
  in 3rd #5/#8/#9/#11 and the tf dimension for liquidity in
  2nd #19.
- Deposit/withdraw with disabled flags, and deposit/withdraw
  on cashback/mayhem pools, were not chained here; the
  disable-flag gates were pinned in 2nd #46 and the mode
  gates in 2nd #44.

## Verify / provenance

Run from the repository root:

    python3 -I -B research/amm-liquidity-first-sweep-collect-chains-20261029/verify.py

verify.py needs `solders` and reads only the packet files plus the
three program images retained in the repository
(`evidence/original/pump_amm/deployed.so`, and the gzip
`candidate.so.gz` artifacts of
`research/amm-multi-hop-group-slice-recovery` (#424 control) and
`research/amm-transfer-fee-diagnostic-recovery` (#427 candidate),
hashed decompressed). It re-checks recorded receipts; it does not
re-execute them. producer.py, which generated the receipts, depends
on a private LiteSVM workspace layout (`~/workspace/...`) that is
not in this repository, so the receipts cannot be regenerated from
the repository alone.
