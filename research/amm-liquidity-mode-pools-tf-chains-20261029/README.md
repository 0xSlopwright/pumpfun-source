# research: pin deposit/withdraw on cashback and mayhem pools under a transfer fee into sweep -> collect

## Problem

3rd #22 chained liquidity on mode-flagged pools into sweep/collect with
no fee, and 3rd #19 chained plain-pool liquidity under a transfer fee
into sweep/collect. Neither combined the two, so four questions were
open:

1. On a mode-flagged pool under a transfer fee, does a deposit still
   gross up exactly like a plain pool, with the same withheld stacking?
2. Does the protocol sweep still split by mode once the fee pipes
   carry withheld balances?
3. Do the mayhem buyback-zero v2 trades still gross up on the full
   spend (rather than the plain-pool split legs) once a tf deposit
   precedes them?
4. Are the cashback legacy pipes (buy/sell -> claim -> sweep ->
   collect) untouched by a tf deposit, with withheld isolated per hop?

This packet answers all four with executed chains on the original,
control (#424), and candidate (#427) images, which agree on every
step. It pins behaviour; it does not claim a defect. Where a step
fails, the failure is the pinned behaviour (a gate that survives
liquidity under tf), with full rollback and the seed sweep/collect
still draining afterwards.

## Cases

Fixture pool (all cases): virtual_quote_reserves −125,882,
protocol_fees 2,488, creator_fees 123,394, lp_supply 4,194,352,106,721.
Deposit/withdraw size 1e9 LP; v2 and legacy trade size 1e10 base
(legacy sell 1e9 base). Transfer fee is a quote-mint
`transferfee(quote, bps, u64::MAX)` override; sweep/collect use
Token-2022 ATAs. 24 cases, 92 steps, 276 receipts (92 x 3 images),
28 parts (27 x 10 + 6).

- Family A (mode tf liquidity anchors): dep-1e9 and wd-1e9 on
  cashback, mayhem pools at tf100, plus dep-1e9 on a cashback pool
  at tf5000, each followed by creator sweep -> collect.
- Family B (protocol sweep split under tf): cashback pool
  dep -> protocol sweep -> collect; mayhem pool dep -> protocol
  sweep (fails) -> creator sweep -> collect.
- Family C (v2 gates under tf): cashback pool dep -> buy_v2
  (fails) -> sweep -> collect; both-flags pool dep -> buy_v2
  (fails) -> sweep -> collect; cashback pool wd -> sell_v2
  (fails) -> sweep -> collect.
- Family D (mayhem v2 trades under tf): dep -> buy_v2 -> sweep
  -> collect; dep -> sell_v2 -> sweep -> collect; fresh buy_v2
  -> sweep -> collect; fresh sell_v2 -> sweep -> collect;
  dep -> buy_v2 -> buy_v2 -> sweep -> collect;
  dep -> sell_v2 -> sell_v2 -> sweep -> collect.
- Family E (cashback legacy pipes under tf): dep -> legacy buy
  -> claim -> sweep -> collect; legacy buy -> dep -> claim ->
  sweep -> collect; dep -> legacy sell -> claim -> sweep ->
  collect.
- Family F (mayhem legacy-sell gate under tf): dep -> legacy
  sell (fails) -> sweep -> collect.
- Family G (limit gates on a mode pool under tf): cashback pool
  dep capped at the net 29,312,410 (fails) -> sweep -> collect;
  cashback pool wd floored at the gross 29,312,409 (fails) ->
  sweep -> collect.
- Family R (round trip and loop under tf): cashback pool
  dep -> wd -> sweep -> collect; mayhem pool dep -> buy_v2 ->
  sell_v2 -> sweep -> collect.

## Result

All 24 cases pass on all three images with byte-identical observed
surfaces (steps, errors, event counts, snapshots). Measured values:

- Mode-blind tf liquidity (family A): dep-1e9 settles with the
  plain-pool tf legs on cashback, mayhem, and both-flags pools
  alike: user base −160,619,895,224, user quote gross −29,608,495,
  vault quote net +29,312,410, vault withheld 296,085, LP +1e9,
  deposit event quote = net 29,312,410. Wd-1e9: user base
  +160,619,895,223, user quote net +29,019,284, vault quote gross
  −29,312,409, user withheld 293,125, withdraw event quote =
  gross 29,312,409. Neither accrues any fee bucket, and the
  following creator sweep moves exactly the 123,394 seed
  (net 122,160, withheld 1,234), drained by collect to 120,938
  (withheld 1,222). At tf5000 on a cashback pool: dep gross
  58,624,820, vault withheld 29,312,410; sweep nets 61,697
  (withheld 61,697), collect nets 30,848 (withheld 30,849).
- Protocol sweep still splits by mode under tf (family B): on a
  cashback pool it succeeds with gross 2,488, net 2,463,
  withheld 25, and the following collect is a silent no-op
  (0 events, payer fee 5,000 only). On a mayhem pool it fails
  6013 InvalidProtocolFeeRecipient (original site
  swap/mod.rs:164) with full rollback, yet the creator sweep
  after it still drains the seed (122,160 / 120,938).
- v2 gates survive tf liquidity (family C): dep -> buy_v2,
  wd -> sell_v2 on a cashback pool, and dep -> buy_v2 on a
  both-flags pool all fail 6079 CashbackCoinNotSupported
  (original site trade_v2.rs:103) with full rollback; the
  following sweep/collect still drain the seed. Both flags set:
  cashback wins (6079, not the mayhem path).
- Mayhem v2 trades gross up on the full spend under tf
  (family D): buy spends 1,866,461 -- not the plain-pool tf
  split spend 1,866,375 -- because buyback is 0, so the single
  vault leg grosses up the whole 1,847,796 (vault net
  +1,847,796, vault withheld 18,665 fresh / 314,750 after a
  dep). Sell nets 1,784,093 while the vault sends only the
  1,802,115 receipt (no buyback gross-up; user withheld
  18,022). Dep before either trade leaves every leg
  byte-identical to the fresh trade. A second buy spends
  1,866,518 (vault net 1,847,852, vault withheld 333,416)
  and a second sell nets 1,784,040 (vault −1,802,061, user
  withheld 36,043); the buckets drain to 133,001 / 131,670
  (buy loop) and 133,000 / 131,670 (sell loop). Events carry
  the pre-fee program amounts (buy curve 1,824,983, lp fee
  365, protocol fee 16,973, quote-with-lp 1,825,348,
  user-in 1,847,796), identical to the no-fee mayhem trades.
- Cashback legacy pipes are untouched by a tf deposit
  (family E): dep -> legacy buy spends 1,866,234, vault net
  +1,825,348, protocol ATA +8,402, buyback ATA +8,401,
  cashback ATA +5,420, earns 5,475; claim pays 5,365 net
  (withheld 55); sweep/collect drain 122,160 / 120,938.
  Legacy buy -> dep moves the post-buy deposit legs (base
  −160,617,511,066, quote gross −29,608,935, vault net
  +29,312,845, vault withheld 314,528) but not the buckets.
  Dep -> legacy sell pays 178,409 net (vault gross
  −182,458, protocol/buyback ATA +840 each, cashback ATA
  +542, earns 548); claim pays 536 net; sweep/collect drain
  the seed. Withheld stays isolated per hop: after
  dep -> legacy buy, vault 314,523, protocol/buyback 85
  each, cashback ATA 55.
- Mayhem legacy sell after a tf deposit (family F) fails
  6013 with full rollback; the following sweep/collect
  still drain the seed.
- Limit gates are net-vs-gross aware on a mode pool
  (family G): dep capped at the net 29,312,410 fails 6004
  ExceededSlippage (original site deposit.rs:100), wd
  floored at the gross 29,312,409 fails 6004 (original site
  withdraw.rs:107); both roll back fully and the seed
  sweep/collect after them are unaffected.
- Round trip and loop (family R): cashback dep -> wd under
  tf returns the seed pool exactly (base 1 + quote gross 1
  round-trip loss, as on plain pools) and the seed
  sweep/collect are intact. Mayhem dep -> buy -> sell under
  tf: the sell leg nets 1,784,147 (vs 1,784,093 fresh),
  vault −1,802,169, pool (−170,778, 36,434, 134,344), and
  the buckets drain to 133,000 / 131,670.

## Limits

- Only the tf100 and tf5000 points are measured; other fee
  rates, and maxfee caps below u64::MAX, were not chained here.
- Only the fixture pool state (seed buckets 2,488 / 123,394)
  is used; pools with non-seed buckets were not chained here.
- Legacy buy_exact under a tf deposit on a mode pool, and
  multi-hop trades on mode pools under tf, were not chained
  here.
- Error site line numbers are recorded per image in
  runtime/report.json.gz and are not compared across images,
  because the original and rebuilt sources differ in line
  numbers.

## Reproduction

- `python3 verify.py` (from this directory) re-checks the
  manifest, the report counts, every part hash/size/count,
  every transaction signature, every recorded delta, withheld
  balance, pool state, volume state, cashback earned/claimed
  fields, event fields, error code/site, rollback, and the
  3-image observed-surface agreement. It uses only the packet
  files plus the three program images.
- `producer.py` is the builder that generated the receipts;
  it asserts every expected value above per image before
  writing.
