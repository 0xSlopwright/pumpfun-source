# research: v2 cashback trade failures recovered by the legacy pipe, chained into sweep/collect/claim

## Problem

On a cashback pool, every v2 trade fails with 6079
CashbackCoinNotSupported, and on a both-flags pool the legacy pipe
fails too (6013, mayhem wins). Earlier packets pinned each half in
isolation but never chained them in one VM sequence:

- 3rd #22/#23 pinned v2 buy/sell on mode pools (nofee and tf):
  cashback v2 trades fail 6079, both-flags v2 trades fail 6079,
  mayhem v2 trades succeed with zero buyback.
- 3rd #13/#14/#15 pinned the cashback legacy pipe on its own:
  legacy buy/sell/buy-exact accrue to the cashback accumulator,
  claim pays them out, and sweep/collect drain the seed bucket,
  with the pipe total conserved (buy 128,869, sell 123,942).
- 2nd #44 pinned the trade mode gates alone, never chained a
  failure into a recovery.

Open questions this packet closes: after a v2 trade fails 6079,
does the very next legacy trade in the SAME sequence succeed with
exactly the legacy anchor legs, or does the failed attempt leave
state behind? Does a single claim after two failed-then-recovered
buys pay the combined accrual (10,951)? Does the recovery work
under tf100 with the same per-hop withholding gaps as the pure
legacy pipe? On a both-flags pool, does the sequence die at the
legacy step (6013) with only the seed bucket flowing? On a mayhem
pool, does a successful v2 trade followed by a failed legacy trade
still drain the v2 bucket through sweep/collect? And does claim
still pay in full when it runs AFTER sweep/collect instead of
before?

## Cases

14 cases, 70 steps, 210 receipts (each step run on the original,
control (#424), and candidate (#427) images). All amounts are
token amounts unless noted. Pool state is
(virtual_quote_reserves i128, protocol_fees, creator_fees,
lp_supply). The fixture pool is (-125,882, 2,488, 123,394,
4,194,352,106,721). Transfer fee is applied to the quote mint
only, via the `transferfee(quote, bps, 2**64-1)` override.
The cashback fixture pre-creates a 137-byte volume accumulator
(10^9 lamports) and a Token-2022 cashback ATA with 0 balance;
a mayhem v2 trade creates the accumulator (1,844,400 lamports,
137 bytes, payer user) instead.

Family A -- cashback pool, nofee: v2 failure, legacy recovery,
claim, sweep, collect:

- `a-cb-v2buy-fail-legacybuy-claim-swc-col`: buy_v2(10^10)
  fails 6079 with full rollback (pool, buckets, accumulator
  untouched, payer -5,000 only, 0 events). The legacy buy that
  follows spends exactly the 3rd #14 anchor: user quote
  -1,847,796, vault quote +1,825,348, protocol ATA +8,487,
  buyback ATA +8,486, cashback ATA +5,475, earned 5,475, pool
  unchanged. Claim pays 5,475 in full (claimed 5,475, earned
  5,475), sweep moves the seed 123,394, collect pays 123,394.
  Pipe total 128,869 conserved.
- `a-cb-v2sell-fail-legacysell-claim-swc-col`: sell_v2(10^10)
  fails 6079, then legacy sell(10^9, 0) receives 180,212
  (vault -182,458, protocol/buyback +849 each, cashback +548,
  earned 548). Claim pays 548, sweep/collect drain 123,394.
  Pipe total 123,942 conserved.
- `a-cb-v2buyx-fail-legacybuyx-claim-swc-col`: buy_exact_v2
  (10^7, 1) fails 6079, then legacy buy_exact_quote_in(10^7, 1)
  outs 54,115,018,303 base (vault quote +9,878,518, protocol/
  buyback +45,926 each, cashback +29,630, earned 29,630).
  Claim pays 29,630, sweep/collect drain 123,394.
- `a-cb-v2buy-fail-v2sell-fail-legacybuy-claim-swc-col`: two
  consecutive v2 failures (buy then sell, both 6079, both fully
  rolled back) followed by one legacy buy with the same anchor
  legs as the single-failure case -- failures accumulate no
  state. Claim 5,475, sweep/collect 123,394.

Family B -- both-flags pool, nofee: the sequence dies at the
legacy step:

- `b-both-v2buy-fail-legacybuy-fail-swc-col`: v2 buy fails 6079
  (cashback wins the v2 gate), legacy buy fails 6013
  InvalidProtocolFeeRecipient (mayhem wins the legacy gate,
  original site swap/mod.rs:164), both fully rolled back.
  Sweep/collect still drain exactly the seed 123,394 -- the
  failures leave no accrual behind.
- `b-both-v2sell-fail-legacysell-fail-swc-col`: same for the
  sell side: v2 sell 6079, legacy sell 6013, seed sweep/collect
  123,394.

Family C -- cashback pool under tf100: recovery with per-hop
withholding gaps:

- `c-cb-v2buy-fail-legacybuy-claim-swc-col-tf100`: v2 buy fails
  6079, legacy buy spends 1,866,234 gross (vault net +1,825,348,
  protocol net +8,402 / withheld 85, buyback net +8,401 /
  withheld 85, cashback net +5,420 / withheld 55, earned gross
  5,475). Claim pays 5,420 gross to the user (net receipt
  5,365, withheld 55); claimed 5,420 vs earned 5,475 leaves the
  same permanent 55 gap as the pure legacy tf pipe (3rd #15).
  Sweep 123,394 -> 122,160 (withheld 1,234), collect
  122,160 -> 120,938 (withheld 1,222, vault withheld 1,234
  stranded).
- `c-cb-v2sell-fail-legacysell-claim-swc-col-tf100`: v2 sell
  fails 6079, legacy sell receives 178,409 net (gross 180,212,
  withheld 1,803; protocol/buyback net 840 / withheld 9,
  cashback net 542 / withheld 6, earned gross 548). Claim pays
  542 gross (net 536, withheld 6); claimed 542 vs earned 548,
  gap 6 permanent. Sweep/collect 122,160 / 120,938.
- `c-cb-v2buyx-fail-legacybuyx-claim-swc-col-tf100`: v2 exact
  fails 6079, legacy exact outs 53,573,907,921 base (user quote
  -9,998,786, vault quote net +9,779,732 / withheld 98,786,
  protocol/buyback net +45,012 / withheld 455, cashback net
  +29,040 / withheld 294, earned gross 29,334). Claim pays
  29,040 gross (net 28,749, withheld 291); claimed 29,040 vs
  earned 29,334, gap 294. Sweep/collect 122,160 / 120,938.

Family D -- mayhem pool, nofee: v2 succeeds, legacy fails, the
v2 bucket still flows:

- `d-mayhem-v2buy-legacysell-fail-swc-col`: v2 buy(10^10)
  succeeds (spend 1,847,796, vault +1,847,796, buyback 0, pool
  (-148,330, 19,461, 128,869), volume accumulator created
  1,844,400 lamports). Legacy sell then fails 6013 with full
  rollback. Sweep moves the full v2 bucket 128,869, collect
  pays 128,869.
- `d-mayhem-v2sell-legacybuy-fail-swc-col`: v2 sell(10^10)
  succeeds (receipt 1,802,115, vault -1,802,115 only, buyback 0,
  pool (-148,329, 19,460, 128,869)). Legacy buy then fails 6013.
  Sweep/collect drain 128,869.

Family E -- loop, deposit-first, and claim-last orderings:

- `e-cb-v2buy-fail-legacybuy-loop-claim-swc-col`: fail -> buy
  -> fail -> buy -> one claim -> sweep -> collect. The second
  legacy buy spends 1,847,852 (curve drift, +56 over the first)
  and accrues 5,476; the single claim pays the combined 10,951
  (claimed 10,951, earned 10,951). Sweep/collect drain 123,394.
- `e-cb-dep-v2buy-fail-legacybuy-claim-swc-col-tf100`: deposit
  10^9 first (base -160,619,895,224, quote gross -29,608,495,
  vault net +29,312,410, withheld 296,085), then v2 buy fails
  6079, then legacy buy recovers with the same tf100 legs as
  family C (spend 1,866,234, cashback net 5,420, earned 5,475;
  vault withheld 314,523 = deposit 296,085 + buy 18,438).
  Claim 5,420 gross (net 5,365), sweep/collect 122,160 /
  120,938.
- `e-cb-v2buy-fail-legacybuy-swc-col-claim-last`: fail -> buy
  -> sweep -> collect -> claim. Claim still pays the full
  5,475 after the bucket has already been swept and collected:
  the cashback pipe and the sweep/collect pipe are independent,
  and claim order does not matter.

## Result

- A failed v2 trade leaves no observable state: pool buckets,
  accumulator fields, and token balances are byte-identical
  before and after every 6079/6013 failure, and the following
  legacy trade reproduces its standalone anchor legs exactly
  (buy 1,847,796 / sell 180,212 / exact 54,115,018,303 nofee;
  buy 1,866,234 / sell 178,409 net / exact 53,573,907,921 tf100).
- The cashback pipe total is conserved through the failure:
  buy chains total 128,869 (claim 5,475 + collect 123,394),
  sell chains total 123,942 (claim 548 + collect 123,394),
  exact chains total 153,024 (claim 29,630 + collect
  123,394), matching the standalone legacy exact pipe
  (3rd #14/#15).
- Under tf100 the recovery inherits the pure legacy pipe's
  permanent gaps exactly: claim gross vs earned gaps of 55
  (buy), 6 (sell), 294 (exact), plus the stranded sweep/collect
  withheld (1,234 + 1,222). The failed v2 attempt adds no
  additional withholding.
- Gate precedence flips between the two pipes on the same pool:
  both-flags v2 fails 6079 (cashback wins) while both-flags
  legacy fails 6013 (mayhem wins). On a mayhem pool the v2
  bucket (128,869) flows through sweep/collect even though the
  legacy pipe is gated.
- No original-vs-rebuilt divergence: all 14 cases agree across
  the original, control (#424), and candidate (#427) images
  (observed surface, error codes, rollback, events). Error
  sites are recorded per image in the report and are not
  compared across images, because original and rebuilt sources
  differ in line numbers.

## Saved-receipt verification

From the repository root:

```sh
python3 -B research/amm-v2fail-legacy-chains-20261029/verify.py
```

The defaults use the retained original image and the compressed candidate images
from `amm-multi-hop-group-slice-recovery` (#424 control) and
`amm-transfer-fee-diagnostic-recovery` (#427 candidate). To use images elsewhere,
pass `--original /path/to/original.so --control /path/to/control.so --candidate
/path/to/candidate.so`; each option accepts raw or gzip-compressed bytes. All
three image hashes must still match the report.

This command checks stored receipts, signatures and snapshots; it does not execute
the transactions again. `producer.py` is the retained historical producer and
keeps its original workspace paths and harness imports. Its introductory scenario
summary is inherited from the preceding v2-exact packet; its `CASES` table and
this report describe the fourteen failed-v2/legacy-recovery chains measured here.

It checks, from the packet files alone (plus the three program images):

- MANIFEST.json lists every packet file with a matching sha256.
- runtime/report.json.gz: 14 cases, 210 receipts, 21 parts
  (21x10), part sha256/byte counts match the part files.
- Every receipt transaction parses (solders) and all signatures
  verify.
- Every receipt's recorded before/after snapshots reproduce the
  report's expected values: fee-payer lamport deltas, the
  token-leg deltas, lamport deltas for the quote accounts,
  withheld balances after each step, pool state, volume
  accumulator state, cashback earned/claimed fields, and decoded
  event fields.
- Failure steps roll back every watched account except the fee
  payer (fee 5,000) and carry the expected error code plus the
  recorded per-image site line in their logs.
- The observed surface of every case is identical across the
  original, control, and candidate images.
- The three program images hash to the values recorded in the
  report.

## Limits

- The transfer-fee override applies to the quote mint only and
  reconstructs quote accounts as 178-byte override accounts
  (withheld at offset 170); accounts created by the packet
  itself (Token-2022 ATAs) are 182 bytes with withheld at
  offset 174. Each account is read at its own offset.
- The cashback fixture pre-creates the volume accumulator and
  the Token-2022 cashback ATA; a fresh-accumulator creation
  chain (as in 3rd #2/#14) is not re-run here.
- The both-flags legacy sell failure (6013) was measured, not
  assumed from the buy side: it passed on all three images.
- No source change is proposed: this packet pins behavior only.
  The v2-vs-legacy precedence flip (6079 vs 6013 on the same
  both-flags pool) is recorded as observed behavior, not as a
  claimed defect, because both gates are explicit checks in
  their respective handlers.
