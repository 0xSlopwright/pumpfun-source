# Lane v3trade-coordinates

Targets: V3 trade handlers in `programs/pump/src/trade_v3.rs`.

## Coordinate archaeology

`coords.py window` vs `coords.py fn` on baseline d2cb88d: every Source{file,line} site in all
three windows already sits on its original line (buy 801/802/842; sell 1126/1127/1148;
buy_exact_quote 881/882/891/926/1001/993/935/971). Line placement is not the residual; slot
offsets differ (code shape before each site), e.g. buy_v3 first site at slot 1208 vs 1144,
buy_exact_quote 891 at 1752 vs 2296.

## Trial t01: port `sell-inline-quote-options` (e38 packet) onto main

Mechanism: `TradeFees` passed by reference into `trade_event`/`v3_emit_buy` (instead of a
4-tuple), inline `if is_sol{None}else{Some(..)}` quote-account args at each payment call,
`init_volume_user` helper, `emit_sell_cpi` helper, `v3_buy_costs` unconditional
`protocol_fee_split` + inline `pre_fee_amount`. The multi_hop_curve_swap hunk was re-applied by
hand (main had split the `Clock::get()` timestamp out).

| window | before (d2cb88d) | after t01 |
|---|---|---|
| 0x14a8a8 sell | 6056 B, ratio 0.443 | 6040 B, ratio 0.950 |
| 0x147ba0 buy | 3800 B, ratio 0.544 | 3712 B, ratio 0.645 |
| 0x1489f8 buy_exact_quote | 7800 B, ratio 0.303 | 7656 B, ratio 0.313 |

Official: normalized 1019, raw 188, gains [], losses []. unstripped sha256
a64a2f8ad78f5d3e2aa71c577f2b57c6b46a1f7b54fde1340b58ba3ea47bb61b. Ledger a45227c77891401a8631b2571d4cc63b.
