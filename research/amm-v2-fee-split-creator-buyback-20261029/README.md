# v2 fee split: creator fee and buyback_bps sweep

## Problem

`trade_v2` splits every trade three ways (lp, protocol,
creator) and then splits the protocol fee again into a
buyback share and a pool accrual, in `curve/fees.rs`
`select_and_apply_v2`/`apply` and `state/pool.rs`
`accrue_fees`. Every earlier v2 trade packet used a tier
with creator bps 0 and the fixture `buyback_basis_points`
5000, so neither the creator-fee path nor the buyback
sweep was ever pinned: does the pool's `creator_fee_bps`
override the tier, does `creator_fee_configurable` gate
that override, does a default `coin_creator` zero the fee
while keeping the bps field, is there a max cap in the
trade path, is `is_holder_reward` state or event-only,
and is the buyback "cap" really a cap at 10000 or a floor
that only panics when it exceeds the protocol fee?

## Cases

19 cases x 3 images (original / #424 control / #427 candidate),
57 signed receipts, parts [10, 10, 10, 10, 10, 7].
Fixture: single tier (0, lp 10 / protocol 111 / creator 300
bps), pool accrued protocol/creator fees zeroed (available
quote = raw vault quote), virtual quote reserves 0, base
mint supply 10^12, VB = 10^12, VQ = 10^10, user base/quote
10^15. Buy amount 10^6 (quote 10001, lp 11, protocol 112);
sell amount 10^6 (curve 9999, lp 10, protocol 111).

## Result

- Creator-fee override: tier creator 300 with pool
  `creator_fee_bps` 0 gives creator fee 301 on the buy
  (spend 10425, vault +10369, buyback 56, pool protocol
  56, creator 301, vq -357). Pool `creator_fee_bps` 150
  with `creator_fee_configurable` set replaces the tier:
  creator fee 151, spend 10275, vault +10219, pool
  creator 151, vq -207. The same pool value with
  `creator_fee_configurable` cleared falls back to the
  tier: creator fee 301 again, spend 10425.
- Default coin_creator zeroes the fee, not the bps: with
  `coin_creator` set to the default pubkey, the buy event
  still reports creator_bps 300 but creator_fee 0, spend
  10124, vault +10068, pool creator 0, vq -56. The sell
  mirrors it: receipt 9878 (instead of 9578), vault -9933,
  pool creator 0, vq -56, event creator_bps 300 with
  creator_fee 0.
- No max cap in the trade path: pool `creator_fee_bps`
  10000 -- far above the admin_cto max of 300 -- is
  charged in full on the buy: creator fee 10001, spend
  20125, vault +20069, pool creator 10001, vq -10057.
- Holder reward is event-only: with `is_holder_reward`
  set, the buy event reports holder_rewards_bps 300 and
  holder_rewards 301 (the sell: 300 and 300) while all
  state deltas are identical to the non-holder case.
- Pool accrual identity (checked after every success):
  buyback = floor(protocol_fee * buyback_basis_points /
  10000), protocol_fees += protocol_fee - buyback,
  creator_fees += creator_fee, virtual_quote_reserves -=
  (protocol_fee - buyback + creator_fee). Buy at buyback
  0: buyback 0, vault +10425, pool protocol 112, vq -413.
  Buy at 4999: buyback 55, vault +10370, pool protocol
  57, vq -358. Buy at 9999: buyback 111, vault +10314,
  pool protocol 1, vq -302. Sell at buyback 0: receipt
  9578, vault -9578, pool protocol 111, vq -411. Sell
  at 10000: buyback 111, vault -9689, pool protocol 0,
  vq -300.
- The buyback split is a floor, not a cap: buyback 10000
  takes the whole protocol fee (buy: buyback 112, pool
  protocol 0, vq -301), and buyback 10001 behaves
  identically for protocol 112 (floor(112 * 10001 /
  10000) = 112), differing only in the event's
  buyback_bps field. The panic only fires when the
  floored buyback exceeds the protocol fee: buy protocol
  112 panics at buyback 10090 (floor 113 > 112), while
  sell protocol 111 does NOT panic at 10090 (floor 111,
  identical to the 10000 case) and panics at 10091
  (floor 112 > 111). Both panics are the same
  "buyback_fee never exceeds protocol_fee" expect, as
  ProgramFailedToComplete with full rollback and payer
  -5,000 only, 0 events -- but the rebuilt images report
  different sites: buy panics in
  instructions/swap/trade_v2.rs:122 (calculate_buy_result,
  before any transfer), sell panics in
  state/pool.rs:21 (accrue_fees, after the transfers);
  the original image reports both at
  state/global_config.rs:391.
- Every success case funds the user volume accumulator
  with 1,844,400 lamports (137 bytes, payer key [8:40]),
  payer -1,849,400; every failure case rolls back fully,
  payer -5,000 only, 0 events.
- Every success case emits exactly 1 event (buy 500
  bytes, sell 449 bytes); the pinned fields include
  creator_bps @344, creator_fee @352, buyback_bps /
  buyback_fee (buy @427/@435, sell @376/@384),
  holder_bps / holder_rewards (buy @468/@476, sell
  @417/@425), and creator_fee_unclaimed (buy @484, sell
  @433).
- All 3 images agree on every case.

## Limits

Offline LiteSVM synthetic fixtures only. No source change,
build, or whole-program equivalence claim. Split values are
exact for this fixture (single tier lp 10 / protocol 111 /
creator 300, VB 10^12, VQ 10^10, buy/sell amount 10^6), not
claims about other pool states or mainnet settings. The
panic thresholds (buy 10090, sell 10091) are exact for
protocol fees 112 and 111 respectively; other protocol
fees move the threshold because the check is on the
floored product, not on the bps value itself.
