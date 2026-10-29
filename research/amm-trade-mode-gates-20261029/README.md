# Trade mode gates: cashback and mayhem pool flags across v2, multi-hop, and legacy sell

## Problem

Every pool carries two mode flags -- is_mayhem_mode (byte 243)
and is_cashback_coin (byte 244) -- but the three trade paths
do not treat them the same, and no earlier packet pinned the
matrix: v2 trades, multi-hop swaps, and legacy sells each
check (or skip) these flags at different points, and the
deployed program and the reconstruction disagree on one
whole axis of it. The flags were only ever patched as
background state before (mayhem tier selection in #29,
cashback-claim indifference in #28, mayhem reserved-recipient
validation in #43's binding); the trade-path gates themselves
were unpinned.

## Cases

49 cases x 3 images (original / #424 control /
#427 candidate), 147 signed receipts, parts
[10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 7]. Three families, each on its
own harness with a fresh VM per case per image.

Family A -- trade_v2, single tier (0, lp 10 / protocol 111 /
creator 0 bps), VB 10^12, VQ 10^10, supply 10^12, accrued 0,
vq 0 (the #33/#38 fixture):
- v2-buy-anchor / v2-sell-anchor / v2-buyexact-anchor: the
  non-flag baselines (buy 10^6 spends 10124, vault +10068,
  buyback 56; sell 10^6 pays 9878, vault -9933, buyback 55;
  buy_exact 10000 outs 987899, vault +9945, buyback 55).
- v2-buy-cashback / v2-sell-cashback /
  v2-buyexact-cashback: all three handlers fail 6079
  CashbackCoinNotSupported, payer -5,000 only, 0 events,
  pool bytes unchanged, no volume accumulator.
- v2-buy-cashback-disable / v2-sell-cashback-disable:
  disable_flags beats cashback (6020 / 6021).
- v2-buy-cashback-amount0 / v2-buy-cashback-limit0:
  cashback beats the zero guards (6079, not 6001/6002).
- v2-buy-badbb / v2-buy-cashback-badbb: cashback beats
  buyback-recipient validation (a non-token buyback account
  alone fails 6027; with cashback it fails 6079).
- v2-buy-mayhem / v2-sell-mayhem / v2-buyexact-mayhem:
  mayhem pools trade fine with buyback forced to 0 -- same
  spend/receipt as the anchors, different vault/pool split
  (buy vault +10124, pool protocol +112, vq -112; sell vault
  -9878, pool protocol +111, vq -111; buy_exact vault
  +10000, pool protocol +110, vq -110).
- v2-buy-both / v2-sell-both: both flags set, 6079
  (cashback first).

Family B -- multi_hop_swap, 3 AMM hops (tail pool
quote<->base -> POOL2 base<->BASE2 -> P3 BASE2<->BASE3;
#5 anchors: buy 10^9 lands 5,315,084,721,958 in U3, buyback
+4,607,153; sell 10^9 lands 180,345, buyback +846):
- mh-buy-anchor / mh-sell-anchor: the baselines.
- mh-buy-cb-main / -p2 / -p3 / -all and mh-sell-cb-p3 /
  -p2 / -main / -all: the cashback matrix -- see the
  divergence pin below.
- mh-buy-mh-main / -p2 / -p3 and mh-sell-mh-p3 / -p2 /
  -main: mayhem at every hop, all images agree (6080,
  0/1/2 prior-hop events for hop 1/2/3 failures).
- mh-buy-both-main / -p2 / -p3 and mh-sell-both-p3 / -p2 /
  -main: both flags -- at an enforced hop 6079 wins, at an
  ignored hop only 6080 fires (original); rebuilt images
  always fail 6079 at the first failing hop.
- mh-buy-cb-disable / mh-sell-cb-disable: disable beats
  mode (6020 / 6021). mh-buy-cb-amount0: the amount guard
  beats the hop checks (6002). mh-buy-mh-noncanon /
  mh-sell-mh-noncanon: canonical beats mode (6078).

Family C -- legacy sell (#13 fixture, sell 10^9):
- ls-anchor: user +180,212, vault -182,458, legs
  protocol 849 / creator 548 / buyback 849 (ATA deltas; the
  SellEvent protocol_fee field itself reports the gross 1698
  = net 849 + buyback 849).
- ls-cashback-present / ls-cashback-fresh: the cashback
  remaining layout [accumulator ATA, accumulator PDA,
  pool-v2, buyback owner, buyback dest] SUCCEEDS -- same
  token deltas except the creator leg is 0 and the 548
  lands in the accumulator's ATA as cashback (event
  creator_fee 0 / cashback 548 / cashback_bps 30,
  accumulator cashback_earned +548). Pre-created
  accumulator: payer -5,000 only. Fresh accumulator + ATA:
  payer -3,888,680 (5,000 fee + 1,844,400 accumulator rent
  + 2,039,280 ATA rent; the ATA is native, so its lamports
  land at 2,039,280 + 548).
- ls-cashback-std-remaining: standard 3-account remaining
  on a cashback pool fails 6060
  InvalidCashbackAccumulator.
- ls-mayhem: a mayhem pool fails 6013
  InvalidProtocolFeeRecipient -- mayhem pools validate
  the protocol recipient against the RESERVED list, and
  the fixture recipient is not reserved.

## Result

- v2 rejects cashback pools outright. buy_v2, sell_v2 and
  buy_exact_quote_in_v2 all fail 6079 in the handler's cashback check. On all three images the volume-accumulator init CPI runs before the 6079 and is rolled back. No token transfer or event is logged before the error. -- payer -5,000
  only, 0 events, pool unchanged. On buy_v2, disable_flags beats cashback (also seen on sell_v2), and cashback beats amount=0, limit=0 and a bad buyback recipient (6079). The amount/limit/recipient orderings were not executed on sell_v2 or buy_exact_quote_in_v2, and no non-cashback zero-guard control ran: disable wins over cashback, cashback wins
  over amount/limit zero guards and over recipient
  validation.
- v2 trades mayhem pools with buyback forced to 0. Pricing
  is unchanged (same tier, same spend/receipt as the
  anchors); only the split moves: the buyback leg goes to
  the vault instead, and the pool accrues the full protocol
  fee (buy: vault +10124 vs +10068, pool protocol +112 vs
  +56; sell: vault -9878 vs -9933, pool protocol +111 vs
  +56; buy_exact: vault +10000 vs +9945, pool protocol
  +110 vs +55).
- DIVERGENCE -- multi-hop cashback enforcement differs between the deployed program and the #424 control / #427 candidate images (current main source already gates it on the creator-fee hop; not rebuilt here).
  Rebuilt images enforce 6079 at EVERY hop, before mayhem:
  the first failing hop fails with 0/1/2 prior-hop events.
  The ORIGINAL image enforces 6079 only at the
  CREATOR-FEE hop: on buys the creator fee is paid at the
  last hop, on sells at the first hop, and in this route
  that hop is P3 in both directions -- so original buys
  ignore cashback on the tail pool and POOL2 (both succeed
  with anchor-identical deltas) and fail only at P3, and
  original sells ignore cashback on POOL2 and the tail pool
  and fail only at P3. Both-flags cells confirm the order:
  at an enforced hop the original fails 6079, at an
  ignored hop it fails 6080 (mayhem only). Mayhem
  enforcement does NOT diverge: 6080 fires at every hop
  on all three images.
- Multi-hop order pins: disable beats cashback (all images via mh-sell-cb-disable at P3; buy cell rebuilt-only), amount=0 beats tail-pool cashback (rebuilt images only; the original ignores that flag on buys), and canonical beats mayhem (6078 before 6080, all images). 6078 vs 6079 and disable/amount vs mayhem were not executed.
- Legacy sell is the odd one out: it ACCEPTS cashback
  pools and diverts the creator fee into the cashback
  accumulator (548 to the accumulator ATA, creator leg 0,
  event cashback 548), while v2 rejects cashback pools with 6079 and multi-hop rejects them at every hop on the rebuilt images, but only at the creator-fee hop (P3 here) on the original. On a mayhem pool with the fixture's non-reserved protocol recipient it fails 6013. Per source (swap/mod.rs:159-164), mayhem pools validate against the reserved recipients, but a reserved-recipient mayhem sell was not executed
- Every v2 and multi-hop success funds the volume accumulator with 1,844,400 lamports (137 bytes, payer key [8:40]). Legacy sells fund none, except ls-cashback-fresh, which creates the cashback user_volume_accumulator (1,844,400) and its ATA (2,039,280) (payer -5,000, or
  -3,888,680 when the cashback accumulator + ATA are
  created fresh). Every failure rolls back fully except
  the payer fee; multi-hop failures retain the completed
  hops' events in the logs (0/1/2 by failing hop).

Error sites (original / rebuilt):

- v2-buy-cashback: original programs/pump-amm/src/instructions/swap/trade_v2.rs:103. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:59. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:59. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- v2-sell-cashback: original programs/pump-amm/src/instructions/swap/trade_v2.rs:103. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:59. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:59. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- v2-buyexact-cashback: original programs/pump-amm/src/instructions/swap/trade_v2.rs:103. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:59. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:59. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- v2-buy-cashback-disable: original programs/pump-amm/src/instructions/swap/trade_v2.rs:660. Error Code: DisabledBuy. Error Number: 6020. Error Message: DisabledBuy.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:429. Error Code: DisabledBuy. Error Number: 6020. Error Message: DisabledBuy.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:429. Error Code: DisabledBuy. Error Number: 6020. Error Message: DisabledBuy.
- v2-sell-cashback-disable: original programs/pump-amm/src/instructions/swap/trade_v2.rs:865. Error Code: DisabledSell. Error Number: 6021. Error Message: DisabledSell.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:366. Error Code: DisabledSell. Error Number: 6021. Error Message: DisabledSell.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:366. Error Code: DisabledSell. Error Number: 6021. Error Message: DisabledSell.
- v2-buy-cashback-amount0: original programs/pump-amm/src/instructions/swap/trade_v2.rs:103. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:59. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:59. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- v2-buy-cashback-limit0: original programs/pump-amm/src/instructions/swap/trade_v2.rs:103. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:59. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:59. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- v2-buy-badbb: original programs/pump-amm/src/instructions/swap/trade_v2.rs:138. Error Code: AccountTypeNotSupported. Error Number: 6027. Error Message: AccountTypeNotSupported.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:70. Error Code: AccountTypeNotSupported. Error Number: 6027. Error Message: AccountTypeNotSupported.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:70. Error Code: AccountTypeNotSupported. Error Number: 6027. Error Message: AccountTypeNotSupported.
- v2-buy-cashback-badbb: original programs/pump-amm/src/instructions/swap/trade_v2.rs:103. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:59. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:59. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- v2-buy-both: original programs/pump-amm/src/instructions/swap/trade_v2.rs:103. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:59. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:59. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- v2-sell-both: original programs/pump-amm/src/instructions/swap/trade_v2.rs:103. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/trade_v2.rs:59. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/trade_v2.rs:59. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- mh-buy-cb-main: original ; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- mh-buy-cb-p2: original ; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- mh-buy-cb-p3: original programs/pump-amm/src/instructions/swap/trade_v2.rs:120. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- mh-buy-cb-all: original programs/pump-amm/src/instructions/swap/trade_v2.rs:120. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- mh-sell-cb-p3: original programs/pump-amm/src/instructions/swap/trade_v2.rs:120. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- mh-sell-cb-p2: original ; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- mh-sell-cb-main: original ; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- mh-sell-cb-all: original programs/pump-amm/src/instructions/swap/trade_v2.rs:120. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- mh-buy-mh-main: original programs/pump-amm/src/instructions/swap/trade_v2.rs:124. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:504. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:504. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.
- mh-buy-mh-p2: original programs/pump-amm/src/instructions/swap/trade_v2.rs:124. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:504. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:504. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.
- mh-buy-mh-p3: original programs/pump-amm/src/instructions/swap/trade_v2.rs:124. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:504. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:504. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.
- mh-sell-mh-p3: original programs/pump-amm/src/instructions/swap/trade_v2.rs:124. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:504. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:504. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.
- mh-sell-mh-p2: original programs/pump-amm/src/instructions/swap/trade_v2.rs:124. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:504. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:504. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.
- mh-sell-mh-main: original programs/pump-amm/src/instructions/swap/trade_v2.rs:124. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:504. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:504. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.
- mh-buy-both-main: original programs/pump-amm/src/instructions/swap/trade_v2.rs:124. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- mh-buy-both-p2: original programs/pump-amm/src/instructions/swap/trade_v2.rs:124. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- mh-buy-both-p3: original programs/pump-amm/src/instructions/swap/trade_v2.rs:120. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- mh-sell-both-p3: original programs/pump-amm/src/instructions/swap/trade_v2.rs:120. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- mh-sell-both-p2: original programs/pump-amm/src/instructions/swap/trade_v2.rs:124. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- mh-sell-both-main: original programs/pump-amm/src/instructions/swap/trade_v2.rs:124. Error Code: MayhemPoolNotSupported. Error Number: 6080. Error Message: v2 trades do not support mayhem-mode pools; use the v1 instructions.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:500. Error Code: CashbackCoinNotSupported. Error Number: 6079. Error Message: v2 trades do not support cashback coins; use the v1 instructions.
- mh-buy-cb-disable: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:469. Error Code: DisabledBuy. Error Number: 6020. Error Message: DisabledBuy.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:489. Error Code: DisabledBuy. Error Number: 6020. Error Message: DisabledBuy.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:489. Error Code: DisabledBuy. Error Number: 6020. Error Message: DisabledBuy.
- mh-sell-cb-disable: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:474. Error Code: DisabledSell. Error Number: 6021. Error Message: DisabledSell.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:489. Error Code: DisabledSell. Error Number: 6021. Error Message: DisabledSell.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:489. Error Code: DisabledSell. Error Number: 6021. Error Message: DisabledSell.
- mh-buy-cb-amount0: original programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:273. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:266. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:266. Error Code: ZeroQuoteAmount. Error Number: 6002. Error Message: ZeroQuoteAmount.
- mh-buy-mh-noncanon: original programs/pump-amm/src/instructions/swap/trade_v2.rs:119. Error Code: OnlyPumpPools. Error Number: 6078. Error Message: Only canonical pump pools are supported by this instruction.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:499. Error Code: OnlyPumpPools. Error Number: 6078. Error Message: Only canonical pump pools are supported by this instruction.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:499. Error Code: OnlyPumpPools. Error Number: 6078. Error Message: Only canonical pump pools are supported by this instruction.
- mh-sell-mh-noncanon: original programs/pump-amm/src/instructions/swap/trade_v2.rs:119. Error Code: OnlyPumpPools. Error Number: 6078. Error Message: Only canonical pump pools are supported by this instruction.; control programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:499. Error Code: OnlyPumpPools. Error Number: 6078. Error Message: Only canonical pump pools are supported by this instruction.; candidate programs/pump-amm/src/instructions/swap/multi_hop_swap.rs:499. Error Code: OnlyPumpPools. Error Number: 6078. Error Message: Only canonical pump pools are supported by this instruction.
- ls-cashback-std-remaining: original programs/pump-amm/src/instructions/swap/sell.rs:392. Error Code: InvalidCashbackAccumulator. Error Number: 6060. Error Message: Cashback user_volume_accumulator account is invalid.; control programs/pump-amm/src/legacy_sell.rs:356. Error Code: InvalidCashbackAccumulator. Error Number: 6060. Error Message: Cashback user_volume_accumulator account is invalid.; candidate programs/pump-amm/src/legacy_sell.rs:356. Error Code: InvalidCashbackAccumulator. Error Number: 6060. Error Message: Cashback user_volume_accumulator account is invalid.
- ls-mayhem: original programs/pump-amm/src/instructions/swap/mod.rs:164. Error Code: InvalidProtocolFeeRecipient. Error Number: 6013. Error Message: InvalidProtocolFeeRecipient.; control programs/pump-amm/src/instructions/swap/mod.rs:23. Error Code: InvalidProtocolFeeRecipient. Error Number: 6013. Error Message: InvalidProtocolFeeRecipient.; candidate programs/pump-amm/src/instructions/swap/mod.rs:23. Error Code: InvalidProtocolFeeRecipient. Error Number: 6013. Error Message: InvalidProtocolFeeRecipient.

## Limits

- `producer.py` regenerated these receipts on the author's machine: it hard-codes
  `~/workspace/pumpfun-sparse` and reads the control/candidate images from
  `~/workspace/slop-verify`, so it does not run from this packet unmodified. The control
  and candidate are the gunzipped in-repo #424/#427 artifacts
  (`research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz`,
  `research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz`); `verify.py`
  checks the recorded receipts and does not load the images.

Offline LiteSVM synthetic fixtures only. No source change,
build, or whole-program equivalence claim. The creator-fee-hop
rule for the original image is the observed gate pattern
(buy-last / sell-first, P3 in this route), stated as the
failing-hop pattern rather than as original-source text,
which is not in this tree. Flag bytes, amounts, and event
offsets are exact for these fixtures, not claims about
other pool states or mainnet settings. Legacy buy on
cashback pools (which needs its own remaining-account
layout) is not covered here; only legacy sell is.
