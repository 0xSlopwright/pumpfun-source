# research: v2 fee-tier double crossing inside one trade chain, chained into sweep/collect

## Problem

`select_and_apply_v2` (programs/pump-amm/src/curve/fees.rs)
picks one fee table per trade from the pool's market cap:
`cap = base_mint_supply * effective_quote_reserves / vault_base`,
then `tier()` takes the last tier whose threshold is `<= cap`
(the boundary is inclusive, `>=`). 3rd #35 measured a single
crossing with two tiers, but never two crossings in one
sequence: with three tiers and two thresholds, a buy chain
should pay A, then B, then C as the live cap climbs, and a sell
chain should pay C, then B, then A as it falls -- and the
creator bucket then mixes fees from three tiers before
sweep/collect drains it.

Open questions this packet closes: does one buy chain cross
two thresholds in order (A -> B -> C), and one sell chain cross
them back down (C -> B -> A)? Is the inclusive boundary still
inclusive at the second threshold mid-chain? Does a buy-sell
round trip cross up twice and then back down twice? Does the
exact path cross both thresholds too, and does it need
different threshold placement (it moves the cap further per
trade)? Does the pool's `creator_fee_bps` override mask the
tier creator leg across all three tiers? Does mayhem stay
pinned to the top tier for the whole chain? Does the double
crossing survive transfer fee? And does a mid-chain sweep
leave the chain at the top tier, or reset it?

## Cases

17 cases, 92 steps, 276 receipts (each step run on the original,
control (#424), and candidate (#427) images). All amounts are
token amounts unless noted. Pool state is
(virtual_quote_reserves i128, protocol_fees, creator_fees,
lp_supply). The fixture pool is (-125,882, 2,488, 123,394,
4,194,352,106,721), base mint supply 999,203,529,491,389, vault
base 673,696,395,912,745, vault quote 122,946,690,720, so the
starting cap is exactly 182,350,153,971. The three custom tiers
are A = (lp 10, protocol 111, creator 333), B = (lp 20,
protocol 222, creator 444), C = (lp 30, protocol 333, creator
555); the fee config is patched to [(100, A), (T1, B), (T2, C)]
with T1, T2 placed per case. Transfer fee is applied to the
quote mint only, via the `transferfee(quote, bps, 2**64-1)`
override.

Family A -- double crossing up, down, and back (nofee):

- `a-buy-double-cross-swc-col`: T1 = cap0 + 3,000,000,
  T2 = cap0 + 10,000,000. buy1 pays A (spend 1,907,838),
  buy2 pays B (spend 1,950,236), buy3 pays C (spend
  1,992,636). Sweep drains the three-tier mixed bucket
  366,491, collect pays 366,491.
- `a-buy-double-cross-exact-swc-col`: T2 set exactly to the
  post-buy2 cap (182,360,989,422). buy3 still pays C (`>=`
  is inclusive at the second threshold too); sweep/collect
  drain 366,491.
- `a-buy-double-cross-loop`: buy A, buy B, buy C, buy C
  (fourth spend 1,992,695); sweep/collect drain 467,787.
- `a-sell-double-cross-swc-col`: T1 = cap0 - 10,500,000,
  T2 = cap0 - 300,000. sell1 pays C (receipt 1,657,397),
  sell2 pays B (receipt 1,699,685), sell3 pays A (receipt
  1,741,971). Sweep/collect drain 366,470.
- `a-sell-double-cross-exact-swc-col`: T1 set exactly to the
  post-sell2 cap (182,339,341,145). sell3 still pays B
  (receipt 1,699,636) and only sell4 pays A (receipt
  1,741,920); sweep/collect drain 447,490.
- `a-buy-sell-full-round-trip`: buy A, buy B, buy C, then
  sell C (receipt 1,657,545), sell C (receipt 1,657,496),
  sell B (receipt 1,699,787), sell A (receipt 1,742,075)
  -- up twice and back down twice in one sequence. The
  mixed bucket 710,875 sweeps/collects exactly.
- `a-buyx-double-cross-swc-col`: exact path crosses both
  thresholds, but needs T2 = cap0 + 30,000,000 because one
  exact trade moves the cap further than one buy. buyx1
  pays A (out 52,412,084,027), buyx2 pays B (out
  51,266,288,076), buyx3 pays C (out 50,169,356,101);
  sweep/collect drain 1,365,765.

Family B -- creator-fee override masks the tier creator leg:

- `b-override-buy-double-cross`: pool `creator_fee_bps`
  patched to 500. buy1 pays A on lp/proto (spend 1,938,316),
  buy2 pays B (spend 1,960,456), buy3 pays C (spend
  1,982,598) while the creator leg stays at 500bps in all
  three; sweep/collect drain 397,151.
- `b-override-sell-double-cross`: same override, sell1 pays
  C (receipt 1,667,434), sell2 pays B (receipt 1,689,466),
  sell3 pays A (receipt 1,711,497); sweep/collect drain
  397,126.

Family C -- mayhem pins the top tier for the whole chain:

- `c-mayhem-top-tier`: mayhem pool, buy1/buy2/buy3 all pay C
  with buyback 0 (spends 1,992,517 / 1,992,577 / 1,992,636,
  vault takes the full spend); sweep/collect drain 427,264.
- `c-mayhem-sell-top-tier`: mayhem sell1/sell2/sell3 all pay
  C with buyback 0 (receipts 1,657,397 / 1,657,348 /
  1,657,299, vault pays the full receipt); sweep/collect
  drain 427,237.

Family D -- double crossing under transfer fee (tf100):

- `d-tf-buy-double-cross`: buy1 pays A (gross spend
  1,927,007), buy2 pays B (gross 1,969,731), buy3 pays C
  (gross 2,012,457). Events report the pre-tf figures, as
  in earlier tf packets. Sweep nets 362,826 (gross 366,491,
  withheld 3,665), collect nets 359,197 (destination
  withheld 3,629).
- `d-tf-sell-double-cross`: sell1 pays C (net receipt
  1,640,823), sell2 pays B (net 1,682,688), sell3 pays A
  (net 1,724,551). Sweep nets 362,805 (gross 366,470),
  collect nets 359,176.
- `d-tf-buyx-double-cross`: buyx1 pays A (out
  51,888,004,321), buyx2 pays B (out 50,753,750,277), buyx3
  pays C (out 49,667,851,691). Sweep nets 1,339,807 (gross
  1,353,341), collect nets 1,326,408.

Family E -- sweep neutrality and the no-cross controls:

- `e-sweep-mid-stays-C`: buy A, buy B, buy C, sweep, buy C
  again (spend 1,992,695). The sweep relabels creator_fees
  into virtual_quote_reserves 1:1, so the effective quote
  (and the cap, and the tier) is unchanged by the sweep.
  The later collect drains only the swept 366,491 while
  the new accrual 101,296 stays in the pool.
- `e-buy-nocross`: T1, T2 placed at cap0 + 10^12 and
  cap0 + 2*10^12. All three buys pay A (spends 1,907,838 /
  1,907,895 / 1,907,952); sweep/collect drain 305,716 --
  the control that the double crossing is threshold
  placement, not trade count.
- `e-sell-nocross`: same far thresholds. All three sells pay
  A (receipts 1,742,074 / 1,742,022 / 1,741,971);
  sweep/collect drain 305,701.

## Result

- The tier is a function of the live cap at each trade, not
  of the trade count: one buy chain crosses two thresholds
  in order (A -> B -> C), one sell chain crosses them back
  down (C -> B -> A), and a buy-sell round trip crosses up
  twice and back down twice (C, C, B, A on the sell leg --
  the second sell stays in C because the cap has not yet
  fallen below T2).
- The inclusive boundary holds at the second threshold
  mid-chain, on both sides: a cap exactly equal to T2 still
  selects C on the buy side, and a cap exactly equal to T1
  still selects B on the sell side.
- The three-tier mixed bucket is exact: sweep/collect drain
  precisely seed + tier-A creator fee + tier-B creator fee +
  tier-C creator fee (buy 366,491, sell 366,470, round trip
  710,875), never a blended or recomputed amount.
- The exact path crosses both thresholds too, but its
  per-trade cap move is larger, so the second threshold
  must sit further out (cap0 + 30,000,000 instead of
  cap0 + 10,000,000) for the middle trade to land in B
  rather than jumping straight to C.
- The creator-fee override is orthogonal to the tier across
  all three tiers: with pool `creator_fee_bps` = 500, the
  lp/proto legs still cross twice while the creator leg
  stays at 500bps in A, B, and C.
- Mayhem never crosses down: the 10^15 supply substitution
  keeps the cap above both thresholds, so mayhem trades pay
  the top tier C for the whole chain with buyback 0.
- Transfer fee does not disturb the double crossing: tf100
  trades cross at the same caps with the same tier bps, and
  the sweep/collect legs show the usual per-hop withholding
  on top of the mixed bucket.
- A sweep is tier-neutral at the top too: it moves
  creator_fees into virtual_quote_reserves 1:1, leaving the
  effective quote, the cap, and therefore tier C exactly
  unchanged.
- No original-vs-rebuilt divergence: all 17 cases agree
  across the original, control (#424), and candidate (#427)
  images (observed surface, error codes, rollback, events).
  Error sites are recorded per image in the report and are
  not compared across images, because original and rebuilt
  sources differ in line numbers.

## Verification

Run `python3 verify.py` from this directory. It checks, from the
packet files alone (plus the three program images):

- MANIFEST.json lists every packet file with a matching sha256.
- runtime/report.json.gz: 17 cases, 276 receipts, 28 parts
  (27x10 + 6), part sha256/byte counts match the part files.
- Every receipt transaction parses (solders) and all signatures
  verify.
- Every receipt's recorded before/after snapshots reproduce the
  report's expected values: fee-payer lamport deltas, the
  token-leg deltas, lamport deltas for the quote accounts,
  withheld balances after each step, pool state, volume
  accumulator state, and decoded event fields.
- The observed surface of every case is identical across the
  original, control, and candidate images.
- The three program images hash to the values recorded in the
  report.

## Limits

- The fee config is patched at setup to exactly three tiers
  [(100, A), (T1, B), (T2, C)] with flat fees (25, 5, 0); the
  stable and exotic tables are not varied here because the
  fixture quote is the native mint, which routes to the fee
  tiers, and the quote mint cannot change mid-chain.
- The mayhem mode is exercised through the fixture pool's
  `is_mayhem` flag; the mayhem program itself is not in the
  sparse checkout, so the mayhem buyback-zero result is
  recorded as observed behavior only.
- The transfer-fee override applies to the quote mint only
  with max fee 2**64-1; the tf100 sweep/collect legs use the
  178-byte override accounts (withheld at offset 170) and the
  packet-created Token-2022 ATAs (182 bytes, offset 174).
- No source change is proposed: this packet pins behavior only.
