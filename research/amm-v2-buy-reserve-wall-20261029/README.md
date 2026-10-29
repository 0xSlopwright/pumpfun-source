# v2 buy reserve wall

## Problem

`trade_v2` `execute_buy` prices an exact base-out through
`curve/constant_product.rs` `quote_for_base(amount, b, q)` =
`ceil(q * amount / (b - amount))`. 1st-run #31 covered trade
0/extremes and 2nd-run #29 covered fee-tier boundaries, but
neither walked the reserve wall itself: what exactly fails when
the requested base-out reaches, exceeds, or nearly reaches the
pool's base reserve, and whether the exact-in (`buy_exact`) and
sell paths share any wall at all.

## Cases

19 cases x 3 images (original / #424 control / #427 candidate) =
57 signed receipts, parts [10, 10, 10, 10, 10, 7].

Fixture: single fee tier (0, A = (lp 10, protocol 111, creator 0))
so the fee bps are constant; pool accrued protocol/creator fees
zeroed so available quote reserves equal raw vault quote; virtual
quote reserves 0; base mint supply 10^12. Buy cases use a user
quote balance of u64::MAX - 2,039,280 lamports (the most a native
wSOL account can hold above rent); sell cases use 10^15.

- Small-reserve ladder, VB = 3, VQ = 100: `buy-small-a1`,
  `buy-small-a2`, `buy-small-a3-eq`, `buy-small-a4-gt`.
- Full-size wall, VB = 10^12, VQ = 10^10: `buy-half`,
  `buy-boundary-succ`, `buy-boundary-plus1`, `buy-overflow-last`,
  `buy-trunc-first`, `buy-b-minus1`, `buy-b-eq`, `buy-b-plus1`.
- Exact-in, same pool: `buyexact-mid`, `buyexact-maxsucc`,
  `buyexact-above-balance`, `buyexact-max`.
- Sell, same pool: `sell-mid`, `sell-max-minus-vb`,
  `sell-max-wrap`.

## Result

All three images agree on every case. Every success funds the
user volume accumulator with exactly 1,844,400 lamports (137
bytes, payer key at [8:40]), so the payer delta is -1,849,400
(rent + 5,000 fee); every failure rolls back fully with payer
-5,000 only and 0 events.

### The wall is a ladder of four distinct failures

With VB = 10^12, VQ = 10^10, tiers (10, 111, 0):

- Last success: amount 999,999,999,451 = b - 549. Curve quote
  18,214,936,237,723,132,970, lp fee 18,214,936,237,723,133,
  protocol fee 202,185,792,238,726,776, total user spend
  18,435,336,966,199,582,879, vault quote
  +18,334,244,070,080,219,491, buyback
  +101,092,896,119,363,388 (= protocol fee x 5000 / 10000).
- Overflow window, exactly 6 amounts: 999,999,999,452 through
  999,999,999,457 give 6023 Overflow (original
  `instructions/swap/trade_v2.rs:241`, control/candidate
  `trade_v2.rs:101`). The curve quote still fits u64 here, but
  quote + lp + protocol + creator overflows the u64 total.
- First Truncation: 999,999,999,458 = b - 542 gives 6024
  Truncation (original `curve/constant_product.rs:24`,
  control/candidate `constant_product.rs:10`). The curve quote
  itself exceeds u64 from here on; b - 1 fails the same way.
- Amount == b: 6025 DivisionByZero (original
  `curve/fees.rs:21`, control/candidate `fees.rs:19`).
  `checked_sub(b, b)` yields 0 rather than failing, so the
  error comes from the `ceil_div` by zero, not from the
  reserves check.
- Amount > b: 6016 BuyMoreBaseAmountThanPoolReserves
  (original `curve/constant_product.rs:21`, control/candidate
  `constant_product.rs:8`). Only above the reserve does the
  subtraction itself underflow.

The small-reserve ladder shows the same wall in miniature
(VB = 3, VQ = 100): amount 1 -> curve quote 50, fees (1, 1),
total 52, buyback 0; amount 2 -> quote 200, fees (1, 3),
vault +203, buyback 1; amount 3 == b -> 6025; amount 4 > b
-> 6016. A mid anchor: amount 5 x 10^11 (b / 2) -> curve
quote exactly 10^10, fees (10,000,000, 111,000,000), total
10,121,000,000, vault +10,065,500,000, buyback 55,500,000.

### Exact-in has no wall

- `buyexact-mid` (quote in 10^12): out 989,980,408,287,
  vault quote +994,516,352,139, buyback +5,483,647,861,
  spend exactly 10^12.
- `buyexact-maxsucc` (quote in = user balance =
  u64::MAX - 2,039,280 = 18,446,744,073,707,512,335):
  succeeds with out exactly 999,999,999,451 = b - 549 -- the
  exact-in max spend and the exact-out max amount meet at the
  same base-out. Vault quote +18,345,588,625,027,464,224,
  buyback +101,155,448,680,048,111, spend exactly the amount.
- One unit above the balance (18,446,744,073,707,512,336):
  Token custom error 0x1, "insufficient funds" -- the user
  simply cannot cover it.
- Only amount = u64::MAX itself reaches the AMM's own 6023
  Overflow (original `trade_v2.rs:241`, control/candidate
  `trade_v2.rs:101`) before any transfer. So the exact-in
  failure mode flips twice: balance error, then -- at the very
  top -- AMM overflow.

### Sell has no wall either

- `sell-mid` (10^6 in): curve quote 9,999, lp fee 10,
  protocol fee 111, user +9,878, vault quote -9,933, buyback
  55. (Vault out = user out + buyback.)
- `sell-max-minus-vb` (u64::MAX - 10^12 in): succeeds with the
  vault base landing exactly on u64::MAX. Curve quote
  9,999,999,457 (just under VQ = 10^10), lp fee 10,000,000,
  protocol fee 110,999,994, user +9,878,999,463, vault quote
  -9,934,499,460, buyback 55,499,997.
- `sell-max-wrap` (u64::MAX in): succeeds in this fixture
  with the same curve quote and user receipt, but the vault
  base wraps to VB - 1 (delta -1, user base delta -u64::MAX).
  The curve saturates just under q; it never errors. The wrap
  is a property of the fixture token program, not of AMM curve
  math: a direct SPL Token transfer of u64::MAX into a 10^12
  balance in the same fixture reproduces the wrap (see
  Limits).

## Limits

Offline LiteSVM synthetic fixtures only. No source change,
build, or whole-program equivalence claim. The sell-max wrap
is reported as observed under this fixture's token program;
this packet does not claim mainnet SPL Token wraps (its
transfer arithmetic is outside the AMM code pinned here) --
what the packet pins about the AMM is that sell imposes no
size cap of its own: the curve quote saturates just under q
and the handler attempts the transfer. Error sites are cited
per image family (original deployed binary vs #424/#427
rebuilds). The u64::MAX-balance buy cases use a native wSOL
user quote account at lamports u64::MAX with data amount
u64::MAX - 2,039,280 (rent), the maximum consistent native
balance. Fee bps are the constant single tier above, not a
mainnet fee configuration.
