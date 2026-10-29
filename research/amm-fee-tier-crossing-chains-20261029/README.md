# research: v2 fee-tier crossing inside one trade chain, chained into sweep/collect

## Problem

`select_and_apply_v2` (programs/pump-amm/src/curve/fees.rs)
picks one fee table per trade from the pool's market cap:
`cap = base_mint_supply * effective_quote_reserves / vault_base`,
then `tier()` takes the last tier whose threshold is `<= cap`
(the boundary is inclusive, `>=`). Earlier packets measured the
selector in isolation but never its motion inside a sequence:

- 2nd #8 measured fee-table priority (stable vs exotic vs flat).
- 2nd #29 measured the boundary in isolation (fresh VM per
  case: cap exactly on a threshold selects that tier, the cap
  floors by integer division, mayhem substitutes 10^15 for the
  supply).
- No packet chained the crossing: a trade moves the reserves,
  so the cap moves with it, and the NEXT trade in the same
  sequence can pay a different tier -- and the creator bucket
  then mixes fees from two tiers before sweep/collect drains it.

Open questions this packet closes: does a buy chain cross UP a
threshold placed between two consecutive caps, and a sell chain
cross DOWN? Is the inclusive boundary still inclusive when the
cap lands exactly on the threshold mid-chain? Does a buy-sell
round trip cross up and then back down? Does the pool's
`creator_fee_bps` override mask the tier's creator leg across
the crossing? Does mayhem stay pinned to the top tier for the
whole chain? Does the crossing survive transfer fee and the
exact path? And does a mid-chain sweep reset the tier, or leave
it unchanged?

## Cases

18 cases, 79 steps, 237 receipts (each step run on the original,
control (#424), and candidate (#427) images). All amounts are
token amounts unless noted. Pool state is
(virtual_quote_reserves i128, protocol_fees, creator_fees,
lp_supply). The fixture pool is (-125,882, 2,488, 123,394,
4,194,352,106,721), base mint supply 999,203,529,491,389, vault
base 673,696,395,912,745, vault quote 122,946,690,720, so the
starting cap is exactly 182,350,153,971. The two custom tiers
are A = (lp 10, protocol 111, creator 333) and B = (lp 20,
protocol 222, creator 444); the fee config is patched to
[(100, A), (T, B)] with T placed per case. Transfer fee is
applied to the quote mint only, via the
`transferfee(quote, bps, 2**64-1)` override.

Family A -- crossing up, down, and back (nofee):

- `a-buy-cross-swc-col`: T = cap0 + 3,000,000. buy1 (cap
  182,350,153,971) pays A: spend 1,907,838 (curve 1,824,983,
  lp 1,825, proto 20,258, buyback 10,129). buy2 (cap
  182,355,570,222) pays B: spend 1,950,236 (curve 1,825,037,
  lp 3,651, proto 40,516, buyback 20,258). Sweep drains the
  mixed bucket 265,198, collect pays 265,198.
- `a-buy-cross-exact-swc-col`: T set exactly to the post-buy1
  cap (182,355,570,222). buy2 still pays B (`>=` is inclusive
  mid-chain) with the same legs as above; sweep/collect drain
  265,198.
- `a-buy-nocross-swc-col`: T = cap0 + 10^12. Both buys pay A
  (spends 1,907,838 / 1,907,895); sweep/collect drain 244,940
  -- the control that the crossing is threshold placement,
  not trade count.
- `a-buy-cross-loop`: buy A, buy B, buy B (spend 1,950,295,
  curve 1,825,091, lp 3,651, proto 40,518); sweep/collect
  drain 346,233.
- `a-sell-cross-swc-col`: T = cap0 - 300,000. sell1 (cap
  182,350,153,971) pays B: receipt 169,975 (curve 182,495,
  lp 365, proto 4,052, buyback 2,026). sell2 (cap
  182,349,613,172) pays A: receipt 174,207 (curve 182,494,
  lp 183, proto 2,026, buyback 1,013). Sweep/collect drain
  137,575.
- `a-sell-cross-exact-swc-col`: T set exactly to the
  post-sell1 cap (182,349,613,172). sell2 still pays B
  (receipt 169,974) and only sell3 pays A (receipt 174,207);
  sweep/collect drain 145,678.
- `a-buy-sell-back-cross`: buy A, buy B, sell B (receipt
  1,699,837), sell B (receipt 1,699,787), sell A (receipt
  1,742,075) -- the third 10^10 sell drops the cap to
  182,350,172,925, back below T, and pays A again. The mixed
  bucket 488,031 sweeps/collects exactly.
- `a-buyx-cross-swc-col`: exact path crosses too. buyx1 pays
  A (out 52,412,084,027, lp 9,566, proto 106,180, buyback
  53,090), buyx2 pays B (out 51,266,288,076, lp 18,717,
  proto 207,749, buyback 103,874); sweep/collect drain
  857,430.
- `a-buyx-cross-loop`: buyx A, buyx B, buyx B (out
  51,258,477,837); sweep/collect drain 1,272,927.

Family B -- creator-fee override masks the tier creator leg:

- `b-override-cross-swc-col`: pool `creator_fee_bps` patched
  to 500. buy1 pays A on lp/proto (spend 1,938,316) and buy2
  pays B (spend 1,960,456) while the creator leg stays at
  500bps in both; sweep/collect drain 305,896.
- `b-override-sell-cross`: same override, sell1 pays B
  (receipt 168,953) and sell2 pays A (receipt 171,160);
  sweep/collect drain 141,644.

Family C -- mayhem chains stay in the top tier (cap far above the thresholds):

- `c-mayhem-top-tier-swc-col`: mayhem pool, buy1 and buy2
  both pay B with buyback 0 (spends 1,950,178 / 1,950,236,
  vault takes the full spend); sweep/collect drain 285,456.
- `c-mayhem-sell-top-tier`: mayhem sell1/sell2 both pay B
  with buyback 0 (receipts 169,975 / 169,974, vault pays the
  full receipt); sweep/collect drain 139,600.

Family D -- crossing under transfer fee (tf100):

- `d-tf-cross-swc-col`: buy1 pays A (gross spend 1,927,007,
  vault net 1,897,709, buyback net 10,027, vault withheld
  19,169), buy2 pays B (gross 1,969,731, vault net 1,929,978,
  buyback net 20,055, vault withheld 38,664). Events report
  the pre-tf figures, as in earlier tf packets. Sweep nets
  262,546 (gross 265,198, withheld 2,652), collect nets
  259,920 (destination withheld 2,626, vault withheld 2,652
  stranded).
- `d-tf-sell-cross`: sell1 pays B (net receipt 168,275,
  gross 169,975, buyback net 2,005), sell2 pays A (net
  172,464, gross 174,207, buyback net 1,002). Sweep nets
  136,199 (gross 137,575, withheld 1,376), collect nets
  134,837 (destination withheld 1,362).
- `d-tf-buyx-cross`: buyx1 pays A (out 51,888,004,321,
  user quote -9,999,470, vault net 9,847,441, withheld
  99,470), buyx2 pays B (out 50,753,750,277, vault net
  9,797,165, withheld 198,432). Sweep nets 841,588 (gross
  850,089, withheld 8,501), collect nets 833,172
  (destination withheld 8,416).

Family E -- sweep neutrality and the sell control:

- `e-sweep-mid-buy-stays-B`: buy A, buy B, sweep, buy B
  again (spend 1,950,295). The sweep relabels creator_fees
  into virtual_quote_reserves 1:1, so the effective quote
  (and the cap, 182,360,989,422) is unchanged by the sweep
  and the tier does not reset. The later collect drains
  only the swept 265,198 while the new accrual 81,035 stays
  in the pool.
- `e-sell-nocross-swc-col`: T = cap0 + 10^12. Both sells pay
  A (receipts 174,208 / 174,207); sweep/collect drain
  135,550.

## Result

- The tier is a function of the live cap, not of the trade
  count or the case: one buy moves the cap by ~5.4M (buy
  10^10) and one sell by ~0.54M (sell 10^9), so a threshold
  placed inside those moves flips the tier on the very next
  trade, up for buys and down for sells, and a buy-sell round
  trip flips it up and then back down.
- The inclusive boundary holds mid-chain: a cap exactly equal
  to the threshold still selects the upper tier, on both the
  buy side and the sell side; `verify.py` recomputes each
  trade's cap from the receipt's before-snapshot and checks it
  equals the threshold exactly.
- The mixed bucket is exact: sweep/collect drain precisely
  seed + tier-A creator fee + tier-B creator fee (buy cross
  265,198, sell cross 137,575, round trip 488,031), in every case here
  (no blended or recomputed amount).
- The creator-fee override is orthogonal to the tier: with
  pool `creator_fee_bps` = 500, the lp/proto legs still cross
  while the creator leg stays at 500bps in both tiers.
- Mayhem did not cross in either measured chain: the 10^15
  supply substitution lifts the starting cap to
  182,495,506,260 (about 145M above cap0, far above
  T = cap0 + 3,000,000), and the mayhem chains move it by at
  most ~5.4M, so every mayhem trade here paid B with buyback
  0. No case places a threshold near the mayhem cap, so this
  does not show that a mayhem pool cannot cross a tier.
- Transfer fee does not disturb the crossing: tf100 buy and
  sell trades cross at the same caps with the same tier bps;
  the tf100 exact path lands at slightly lower caps (the second buyx at 182,378,260,434 vs
  182,378,544,348) because withholding
  cuts the net quote, and still selects the same tiers. The
  sweep/collect legs show the usual per-hop withholding on top
  of the mixed bucket.
- A sweep is tier-neutral: it moves creator_fees into
  virtual_quote_reserves 1:1, leaving the effective quote,
  the cap, and therefore the tier exactly unchanged.
- All 18 cases show the same observed surface on the
  original, control (#424), and candidate (#427) images: step,
  error, event count, and the before/after account snapshots
  with fee-payer lamports zeroed; the decoded event fields match
  the same expected values on every image. No step in this
  packet fails, so error codes and rollback are not exercised,
  and raw event bytes are not compared across images.

## Verify and provenance

From the repository root:

    python3 -I -B research/amm-fee-tier-crossing-chains-20261029/verify.py

`verify.py` needs only `solders` plus files in the repository:
this packet, `evidence/original/pump_amm/deployed.so`, and the
two retained rebuilt images
`research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz`
(control, #424) and
`research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz`
(candidate, #427), whose decompressed sha256 values match the
`images` block of `runtime/report.json.gz`. It re-checks the
recorded receipts; it does not re-execute any transaction. It
checks:

- MANIFEST.json lists every packet file with a matching sha256.
- runtime/report.json.gz: 18 cases, 237 receipts, 24 parts
  (23x10 + 7), part sha256/byte counts match the part files.
- Every receipt transaction parses (solders) and all signatures
  verify.
- Every receipt's recorded before/after snapshots reproduce the
  report's expected values: fee-payer lamport deltas, the
  token-leg deltas, lamport deltas for the quote accounts,
  withheld balances where the report records them, pool state,
  volume
  accumulator state, and decoded event fields.
- Every watched token account not listed in a step's expected
  deltas moves by exactly 0 (this pins buyback 0 on mayhem
  trades), and every collect's destination withholding equals
  the creator-vault outflow minus the destination inflow.
- Live-cap tier model: before every trade it recomputes
  `cap = supply * (vault_quote + virtual_quote_reserves) //
  vault_base` from the receipt (supply = 999,203,529,491,389,
  or 10^15 on mayhem pools), picks the last patched tier whose
  threshold is `<=` cap, and requires the event's lp/protocol
  bps to match; in each `exact` case at least one trade's cap
  equals a threshold exactly and pays the tier at that
  threshold. The cap values quoted above are these recomputed
  caps; the program's own cap is not logged.
- The observed surface of every case (step, error, event
  count, snapshots with fee-payer lamports zeroed) is identical
  across the original, control, and candidate images.
- The three program images hash to the values recorded in the
  report.

`producer.py` is the script that generated the receipts and is
kept as a provenance record. It is not runnable as committed: it
hard-codes a private workspace layout (`~/workspace/pumpfun-sparse`
for the harness scripts and `~/workspace/slop-verify` for the
control/candidate `.so` files) and chdirs there on start.

## Limits

- The fee config is patched at setup to exactly two tiers
  [(100, A), (T, B)] with flat fees (25, 5, 0); the stable and
  exotic tables are not varied here because the fixture quote
  is the native mint, which routes to the fee tiers, and the
  quote mint cannot change mid-chain.
- The mayhem mode is exercised only by setting the fixture
  pool's `is_mayhem` byte; no mayhem-program flow is involved.
  The buyback-zero result is the observed zero buyback-ATA delta
  on those trades.
- The transfer-fee override applies to the quote mint only
  with max fee 2**64-1; the tf100 sweep/collect legs use the
  178-byte override accounts (withheld at offset 170) and the
  packet-created Token-2022 ATAs (182 bytes, offset 174).
- No source change is proposed: this packet pins behavior only.
