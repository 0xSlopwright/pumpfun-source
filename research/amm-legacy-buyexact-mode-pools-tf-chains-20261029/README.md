# research: pin legacy buy_exact on cashback and mayhem pools under a transfer fee into claim -> sweep -> collect

## Problem

3rd #23 chained deposit/withdraw on mode-flagged pools under a
transfer fee into sweep/collect and covered the legacy buy/sell
pipes, but it explicitly left one seat unchained: legacy
buy_exact_quote_in under a tf deposit on a mode pool. That seat
matters because the exact path is not a small variant of buy:

1. Its quote-in is a gross budget, not a base amount: under tf the
   user pays less than the nofee case (3rd #15), and the exact
   budget interacts with the fee pipes differently from buy.
2. Its limit is a minimum base out, enforced by a different gate
   than buy's limit (6040 vs 6004), and its limit 0 fails on a
   different gate again (6001 ZeroBaseAmount).
3. At tf10000 it fails on yet another gate (6039
   BuyNotEnoughQuoteTokensToCoverFees) instead of the buy path's
   6023 Overflow.
4. On mode pools, the legacy exact path may report a different
   error from the v2 buy path, which reported 6079 on both-flags
   pools in earlier packets: what legacy exact reports on a
   both-flags pool under this fixture was open.

This packet answers all four for the measured cases with executed
chains on the original, control (#424), and candidate (#427)
images, which agree on every recorded step. It pins behaviour; it does not claim a defect. Where a step
fails, the failure is the pinned behaviour (a gate that survives
liquidity under tf), with full rollback and the seed sweep/collect
still draining afterwards.

## Cases

Fixture pool (all cases): virtual_quote_reserves −125,882,
protocol_fees 2,488, creator_fees 123,394, lp_supply 4,194,352,106,721.
Legacy buy_exact size is quote-in 1e7 with limit 1 unless a case
says otherwise; deposit size 1e9 LP. Transfer fee is a quote-mint
`transferfee(quote, bps, u64::MAX)` override; sweep/collect use
Token-2022 ATAs. 17 cases, 69 steps, 207 receipts (69 x 3 images),
21 parts (20 x 10 + 7).

- Family A (cashback exact pipes): dep -> exact -> claim -> sweep
  -> collect at tf100; fresh exact -> claim -> sweep -> collect
  at tf100; dep -> exact -> claim -> sweep -> collect at tf5000;
  fresh exact -> claim -> sweep -> collect with no fee.
- Family B (exact limit gates): dep -> exact with limit equal to
  the exact out (succeeds) -> sweep -> collect; dep -> exact with
  limit out+1 (fails 6040) -> sweep -> collect; dep -> exact with
  limit out-1 (succeeds) -> sweep -> collect; fresh exact with
  limit 0 (fails 6001) -> sweep -> collect.
- Family C (exact -> deposit order): fresh exact -> dep -> claim
  -> sweep -> collect at tf100.
- Family D (exact loop): dep -> exact -> exact -> claim -> sweep
  -> collect at tf100.
- Family E (mayhem exact gate): fresh exact (fails 6013) -> sweep
  -> collect at tf100; dep -> exact (fails 6013) -> sweep ->
  collect at tf100; fresh exact (fails 6013) -> sweep -> collect
  at tf5000.
- Family F (both-flags exact gate): dep -> exact (fails 6013) ->
  sweep -> collect at tf100; fresh exact (fails 6013) -> sweep ->
  collect at tf100.
- Family G (tf10000 exact): fresh exact (fails 6039) -> sweep
  (nets 0, all 123,394 withheld) -> collect (silent no-op).
- Family H (mayhem exact + protocol sweep): dep -> exact (fails
  6013) -> protocol sweep (fails 6013) -> creator sweep ->
  collect at tf100.

## Result

In this fixture the deposit moved the exact out. On a cashback
pool at tf100, a deposit of 1e9 LP followed by exact (1e7, limit 1)
outs 53,573,908,936 base, against 53,573,907,921 for the fresh
exact -- a +1,015 move. The decoded fee/amount fields are equal
between the two: curve 10,000,000, lp fee 1,956, protocol fee
90,934, quote 9,779,732, user out 9,777,776, cashback 29,334
(30 bps), buyback 45,012 (5,000 bps), 512-byte BuyEvent. The raw
events are not identical: besides the out word (offset 16), the
words at offsets 32, 40, 48 and 56 differ (999,839,380,104,776 vs
1,000,000,000,000,000; 999,999,970,391,505 vs
1,000,000,000,000,000; 673,857,015,807,969 vs
673,696,395,912,745; 122,976,003,130 vs 122,946,690,720), i.e. the
balance/reserve words the deposit moved. The buy path's deposit
neutrality reported in 3rd #6/#8 was not re-run here. The deposit legs
themselves are the usual tf100 ones: user base −160,619,895,224,
user quote gross −29,608,495, vault quote net +29,312,410,
vault withheld 296,085, LP +1e9.

The exact pipes conserve through claim -> sweep -> collect. At
tf100 after dep -> exact, the user volume accumulator earns
29,334; claim pays 29,040 gross / 28,749 net (withheld 291) and
leaves the accumulator at [29,334 earned, 29,040 claimed]; the
seed creator sweep drains 122,160 (withheld 1,234) and collect
pays 120,938 (withheld 1,222). At tf5000 after dep -> exact, the
exact outs 27,058,593,419, spends 9,939,259, vault net 4,939,259,
vault withheld 34,251,669, protocol/buyback +11,481 each
(withheld 11,482), cashback +7,407 (withheld 7,408), earned
14,815; claim pays 7,407 gross / 3,703 net (withheld 3,704),
sweep nets 61,697, collect pays 30,848. With no fee, the fresh
exact outs 54,115,018,303, spends 10,000,000, vault 9,878,518,
protocol/buyback 45,926, cashback 29,630, earned 29,630, claim
pays the full 29,630, sweep/collect move the seed 123,394 /
123,394.

The exact limit gate is sharp at the measured points. Limit equal
to the dep exact out (53,573,908,936) succeeds; limit out+1 fails
6040 BuySlippageBelowMinBaseAmountOut (buy.rs:776) with full
rollback; limit out-1 succeeds with the same out. Limit 0 (fresh
exact, tf100) fails 6001 ZeroBaseAmount (buy.rs:636) with full
rollback. In both failing limit cases the seed sweep/collect still
drain afterwards (122,160 / 120,938 at tf100).

In the exact -> dep order, the deposit legs differ from the
dep -> exact chain's deposit. Fresh exact -> dep at
tf100 moves base 160,607,122,356 / quote gross 29,610,850 /
vault net 29,314,741 (vault withheld 394,895 after both steps);
the buckets and the earned 29,334 are untouched, and the claim
afterwards still pays 29,040 gross / 28,749 net. The loop's
second exact at tf100 outs 53,565,390,148, which is 8,518,788
less than the first, consistent with the first exact having
drained base from the pool. Earned stacks to 58,668 and a single
claim pays 58,080 gross / 57,499 net (withheld 581); the seed
sweep/collect still drain 122,160 / 120,938.

Mayhem-flagged pools rejected the exact path when given the
standard protocol fee recipient. The mayhem and both modes only
set pool byte 243 (producer.py `setup_vm`, about lines 185-198);
the transactions pass the standard protocol fee recipient from the
global config, and no case supplies a mayhem fee recipient. With
that setup, on a mayhem pool legacy exact fails 6013
InvalidProtocolFeeRecipient (swap/mod.rs:164) fresh, after a dep,
and at tf5000, each time with full rollback; the seed
sweep/collect still drain afterwards (122,160 / 120,938 at
tf100, 61,697 / 30,848 at tf5000). On a both-flags pool the exact
also fails 6013, so on this path the recipient check fired before
any cashback gate; the v2 buy path on both-flags pools reported
6079 in 2nd #44 and 3rd #22/#23 (not re-run here). This is what
was observed with the standard protocol fee recipient; it does not
show which flag takes precedence when a mayhem fee recipient is
supplied. The protocol sweep on a mayhem
pool after a failed exact also fails 6013, while the creator
sweep/collect still drain the seed.

At tf10000 the exact budget cannot cover the fees. Fresh exact
on a cashback pool at tf10000 fails 6039
BuyNotEnoughQuoteTokensToCoverFees (buy.rs:646) with full
rollback (the buy path at tf10000 was reported as 6023 Overflow
in earlier packets; it was not re-run here). The following seed
sweep nets 0 (all 123,394 withheld into the creator ATA) and the
collect is a silent no-op (no error, 0 events; every watched
account except the fee payer unchanged, payer fee 5,000).

All 17 cases, 207 receipts, 21 parts: the original, control, and
candidate images agree on every recorded step -- step, error,
event count and the before/after snapshots of the watched
accounts (fee-payer lamports zeroed) are equal across images, and
each image matches the expected deltas, withheld balances, pool
state, accumulator state, decoded event fields, error codes and
rollback. Error site lines are checked per image only, since
original and rebuilt sources differ in line numbers.

## Limits

- The exact size is fixed at quote-in 1e7 (limit 1) for the
  anchor cases; the limit sweep covers only exact-out, out+1,
  out-1, and 0. A finer limit bisection was not run.
- Only cashback, mayhem, and both-flags pools are covered; the
  plain-pool exact path was pinned in 3rd #15 (nofee/tf) and is
  not re-run here.
- The tf10000 chain covers only the fresh exact; a tf10000 exact
  after a deposit was not run.
- The mayhem exact gate is pinned at the instruction level
  (6013 at swap/mod.rs:164) with the standard protocol fee
  recipient only; no case supplies a mayhem fee recipient, and
  the mayhem source is not in this sparse checkout, so no
  source-level cause or flag precedence is claimed.
- No source change, no build, and no whole-program equivalence
  is claimed: this packet pins executed behaviour on three
  images only.

## Verify / provenance

From the repository root:

```
python3 -I -B research/amm-legacy-buyexact-mode-pools-tf-chains-20261029/verify.py
```

Expected output:

```
PASS: 17 cases, 207 receipts, 21 parts, 3 images agree (signatures, deltas, withheld, events, error codes/sites, rollback, silent no-op collect)
```

verify.py hashes the three program images retained in the
repository: `evidence/original/pump_amm/deployed.so`, and the #424
control and #427 candidate images stored as
`research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz`
and
`research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz`
(hashed after gzip decompression). It re-checks the committed
receipts; it does not re-execute them. Event checks cover the
decoded fields named in each step's expectation, not every raw
event word.

producer.py is included for provenance only and is not runnable as
committed: it imports harness modules from, and chdirs into, a
private `~/workspace/pumpfun-sparse` layout and reads images from
`~/workspace/slop-verify`.
