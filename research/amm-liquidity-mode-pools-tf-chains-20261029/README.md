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

This packet measures all four on executed chains on the original,
control (#424), and candidate (#427) images, which agree on every
step of these cases. Comparisons to plain-pool or no-fee runs cite
the merged packets that recorded them; those runs are not repeated
here. It pins behaviour; it does not claim a defect. Where a step
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

All 24 cases pass on all three images with identical observed
surfaces (steps, errors, event counts, and decoded before/after
account snapshots with fee-payer lamports zeroed). Measured values:

- tf liquidity on mode pools (family A, plus the dep steps of
  families B-F): dep-1e9 settles with the same legs on cashback,
  mayhem, and both-flags pools, and those legs equal the
  plain-pool tf100 legs recorded in
  `research/amm-liquidity-transfer-fee-20261028` and
  `research/amm-liquidity-sweep-collect-tf-chains-20261029`: user base −160,619,895,224, user quote gross −29,608,495,
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
- Protocol sweep outcome differs by mode under tf (family B): on a
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
  following sweep/collect still drain the seed. On the both-flags
  pool this buy_v2 fails with 6079 (the cashback gate), not the
  6013 seen on the mayhem-only pool's protocol sweep and legacy
  sell; buy_v2 is the only gate measured on the both-flags pool.
- Mayhem v2 trades gross up on the full spend under tf
  (family D): buy spends 1,866,461, vs the plain-pool tf100 spend
  1,866,375 recorded in
  `research/amm-liquidity-sweep-collect-tf-chains-20261029`
  (where buyback takes its own leg); here buyback is 0 and the
  single vault leg grosses up the whole 1,847,796 (vault net
  +1,847,796, vault withheld 18,665 fresh / 314,750 after a
  dep). Sell nets 1,784,093 while the vault sends only the
  1,802,115 receipt (no buyback leg; user withheld
  18,022). Dep before either trade gives the same token deltas,
  bucket accruals and decoded event fields as the fresh trade
  (vault withheld and LP supply differ by the dep's own amounts). A second buy spends
  1,866,518 (vault net 1,847,852, vault withheld 333,416)
  and a second sell nets 1,784,040 (vault −1,802,061, user
  withheld 36,043); the buckets drain to 133,001 / 131,670
  (buy loop) and 133,000 / 131,670 (sell loop). Events carry
  the pre-fee program amounts (buy curve 1,824,983, lp fee
  365, protocol fee 16,973, quote-with-lp 1,825,348,
  user-in 1,847,796), the same decoded fields as the no-fee
  mayhem buy/sell recorded in
  `research/amm-liquidity-mode-pools-sweep-collect-chains-20261029`.
- Cashback legacy pipes show the same legs with and without a
  preceding tf deposit (family E: the legacy buy legs below are
  equal in dep -> buy and buy -> dep): dep -> legacy buy spends 1,866,234, vault net
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
- Limit gates on a mode pool under tf (family G): a dep
  max-quote cap at the net 29,312,410 fails 6004
  ExceededSlippage (original site deposit.rs:100), and a wd
  min-quote floor at the gross 29,312,409 fails 6004 (original site
  withdraw.rs:107); both roll back fully and the seed
  sweep/collect after them are unaffected. Only these two
  limit values were measured; no passing limit was chained here.
- Round trip and loop (family R): cashback dep -> wd under
  tf returns the pool account to its seed state (the vaults keep
  base 1 and quote 1; the user's quote round trip costs 589,211
  = 296,085 + 293,125 withheld + 1, matching the plain-pool
  round trip in `research/amm-liquidity-sweep-collect-tf-chains-20261029`)
  and the seed sweep/collect are intact. Mayhem dep -> buy -> sell under
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

## Verify and provenance

From the repository root:

    python3 -I -B research/amm-liquidity-mode-pools-tf-chains-20261029/verify.py

`verify.py` needs only `solders` plus files in the repository: this
packet, `evidence/original/pump_amm/deployed.so`, and the two
retained rebuilt images
`research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz`
(control, #424) and
`research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz`
(candidate, #427), whose decompressed sha256 values match the
`images` block of `runtime/report.json.gz`. It re-checks the
manifest, report counts, part hashes, transaction signatures, the
recorded deltas, withheld balances, pool/volume/cashback state,
decoded event fields, error codes and per-image site lines,
rollback, silent no-op collects and the 3-image surface agreement
against the report's expected values; it does not re-execute any
transaction.

`producer.py` is the script that generated the receipts and is
kept as a provenance record. It is not runnable as committed: it
hard-codes a private workspace layout (`~/workspace/pumpfun-sparse`
for the harness scripts and `~/workspace/slop-verify` for the
control/candidate `.so` files) and chdirs there on start. Run in a
staged copy of that layout (solders 0.26.0), all of its per-image
assertions passed once the absent user volume accumulator in
mayhem cases (returned as a 0-lamport empty account by this
LiteSVM/solders version) was mapped back to `null`; the
regenerated transactions, logs, events and snapshots then matched
the committed receipts, the only content difference being the
`error` repr string of the 7 failing steps (21 receipts), which
this solders version prints with an extra `Custom(...)` wrapper.
The gzip part files differ in bytes because gzip headers carry a
timestamp. The producer's docstring keeps its original wording
("byte-for-byte", "byte-identical"); the Result section above is
the narrowed statement of what was measured.
