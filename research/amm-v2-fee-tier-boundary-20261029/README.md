# PumpSwap v2 fee-tier boundary: exact-threshold inclusivity, market-cap floor, mayhem override

## Problem

Run 1 #8 measured fee-tier selection ORDER (last tier wins, duplicate
thresholds resolve to the last, the first-threshold short-circuit),
and 2nd-run #8 measured the priority BETWEEN fee tables (stable vs
exotic vs flat). Neither measured the boundary itself: whether a
market cap exactly ON a threshold selects that tier, whether the
cap's integer division floors across the boundary, or what the
mayhem supply substitution does to tier selection. The selector is
`curve/fees.rs` `tier()` plus `state/pool.rs` `market_cap()`:

```rust
fn tier(tiers, cap) {
    if cap < tiers[0].market_cap_lamports_threshold { tiers[0] }
    else { tiers.iter().rev().find(|t| cap >= t.threshold).unwrap_or(&tiers[0]) }
}
fn market_cap(supply, base_reserve, quote_reserve) {
    let supply = if self.is_mayhem_mode { 1_000_000_000_000_000 } else { supply };
    supply * quote_reserve / base_reserve   // floor division
}
```

## Cases

Twelve fresh-VM triples (original / #424 control / #427 candidate),
36 signed executions: `buy_v2` with 10^6 base out (limit u64::MAX)
and `sell_v2` with 10^6 base in (limit 1) on the repository's own
trade-v2 differential harness. The pool's virtual quote reserves are
zeroed and the vault balances set to round numbers, so the market
cap is exactly `supply * VQ / VB`. Tiers are A = (lp 10, protocol
111, creator 0) and B = (lp 20, protocol 222, creator 0). The clock
is slot 100, epoch 0. `producer.py` reproduces every receipt from
the repository files.

| Case | Tiers | Supply | VB | VQ | Mayhem | Cap | Selected | Spend / receipt |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| buy-below-first-99 | (100,A),(1000,B) | 99 | 10^9 | 10^9 | 0 | 99 | A | spend 1,013,116 |
| buy-at-first-100 | (100,A),(1000,B) | 100 | 10^9 | 10^9 | 0 | 100 | A | spend 1,013,116 |
| buy-below-second-999 | (100,A),(1000,B) | 999 | 10^9 | 10^9 | 0 | 999 | A | spend 1,013,116 |
| buy-at-second-1000 | (100,A),(1000,B) | 1000 | 10^9 | 10^9 | 0 | 1000 | B | spend 1,025,228 |
| buy-above-second-1001 | (100,A),(1000,B) | 1001 | 10^9 | 10^9 | 0 | 1001 | B | spend 1,025,228 |
| buy-floor-below | (100,A),(1000,B) | 1000 | 10^9+1 | 10^9 | 0 | 999 | A | spend 1,013,115 |
| buy-floor-exact | (100,A),(1000,B) | 1000 | 10^9 | 10^9 | 0 | 1000 | B | spend 1,025,228 |
| buy-mayhem-override | (100,A),(10^15,B) | 50 | 10^9 | 10^9 | 1 | 10^15 | B | spend 1,025,228, buyback 0 |
| buy-nonmayhem-same | (100,A),(10^15,B) | 50 | 10^9 | 10^9 | 0 | 50 | A | spend 1,013,116 |
| buy-supply-zero | (100,A),(1000,B) | 0 | 10^9 | 10^9 | 0 | 0 | A | spend 1,013,116 |
| sell-at-second-1000 | (100,A),(1000,B) | 1000 | 10^9 | 10^9 | 0 | 1000 | B | user +974,824 |
| sell-below-second-999 | (100,A),(1000,B) | 999 | 10^9 | 10^9 | 0 | 999 | A | user +986,912 |

Buy deltas (base out exactly 10^6, vault base exactly -10^6):
tier A spend 1,013,116 = vault +1,007,560 + buyback +5,556;
tier B spend 1,025,228 = vault +1,014,117 + buyback +11,111;
floor-below A spend 1,013,115 = vault +1,007,559 + buyback +5,556;
mayhem B spend 1,025,228 = vault +1,025,228 + buyback 0.
Sell deltas (base in exactly 10^6, vault base exactly +10^6):
tier B user +974,824, vault -985,913, buyback +11,089;
tier A user +986,912, vault -992,456, buyback +5,544.
In every case user spend/receipt equals vault delta plus buyback
delta exactly.

Every success emits exactly 1 event whose fixed-offset prefix pins
the tier directly (quote @64, lp_bps @72, lp_fee @80, protocol_bps
@88, protocol_fee @96): buy A (1001002, 10, 1002, 111, 11112);
buy B (1001002, 20, 2003, 222, 22223); floor-below A (1001001, 10,
1002, 111, 11112); sell A (999000, 10, 999, 111, 11089); sell B
(999000, 20, 1998, 222, 22178).

All three images behave identically in every case. `verify.py`
rechecks every receipt independently: signature validity, the fee
table tiers / pool vq / mayhem byte / vault balances / base supply
in the before snapshot, the recomputed market cap, the token
deltas, the event tier fields, the volume accumulator funding
(1,844,400 lamports, 137 bytes, payer key at [8:40]), the payer
delta (-1,849,400), and agreement across images. Receipts are
stored as parts (`runtime/raw-transactions-part1/2/3/4.jsonl.gz`)
to stay under GitHub's 25MB web-upload limit; `verify.py` reads
them in order.

## Result

- **The tier boundary is inclusive (`>=`).** With tiers [(100, A),
  (1000, B)], cap 999 pays tier A while cap 1000 pays tier B --
  one unit of supply flips the tier. Cap 100 pays A, cap 1001 pays
  B, cap 0 pays A.
- **The cap itself is floor-divided.** Supply 1000 with VB =
  10^9 + 1 gives cap floor(10^12 / 1000000001) = 999, so tier A
  pays again -- and the spend is 1,013,115, one less than the
  exact-999 case, because the larger base reserve also moves the
  curve quote by one (event quote 1001001 vs 1001002). The same
  supply with VB = 10^9 gives cap exactly 1000 and tier B.
- **Mayhem overrides the supply in the cap.** A mayhem pool with
  real supply 50 (real cap 50, tier A) pays tier B, because
  `market_cap` substitutes 10^15 for the supply (cap 10^15). The
  same tiers and supply on a non-mayhem pool pay tier A. Mayhem
  also zeroes the buyback split (`buyback_bps = 0` in mayhem
  mode), so the mayhem tier-B buy puts the full 1,025,228 into
  the vault with buyback 0, versus vault 1,014,117 + buyback
  11,111 off mayhem.
- **The selector is shared by buy and sell.** Sell at cap 1000
  pays tier B (user +974,824) while sell at cap 999 pays tier A
  (user +986,912).

## Limits

- No source change, no build, no whole-program identity claim. The
  images are the merged #424 and #427 artifacts; only the new
  runtime cases are added.
- The fee tables, vault balances, and supplies are synthetic
  boundary conditions, not mainnet fee configs: they isolate the
  selection rule, the same way the bps-overflow packets isolated
  theirs. No live transaction was submitted. All executions are
  offline LiteSVM replays with normally signed transactions.
