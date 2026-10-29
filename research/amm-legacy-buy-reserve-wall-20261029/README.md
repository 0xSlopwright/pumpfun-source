# Legacy buy (non-exact) reserve wall

## Problem

Packet #30 pinned the base-reserve wall for trade_v2
`execute_buy`: a 4-step failure ladder as exact base-out
approaches the pool's base reserves. The legacy `buy` handler
shares the same `quote_for_base` curve function but runs a
different fee path (Fees-program CPI `get_fees_with_quote_mint`,
lp 2 / protocol 93 / creator 30 bps, buyback split of the protocol
fee) and different total accounting, so whether its ladder has
the same shape, the same width, and the same transfer-fee shift
was unmeasured. This packet measures the legacy wall directly.

## Cases

All cases legacy `buy` on the shared v1/v2 fixture, 3 images each.
Pool base reserves b = 673,696,395,912,745 (vault base), raw vault
quote 122,946,690,720, effective q = 122,946,564,838 (raw quote
plus virtual reserves -125,882). The separate available-reserve
check subtracts accrued fees 125,882; effective curve reserves do
not subtract those fees again. Limit is u64::MAX
unless stated, so slippage never masks the wall; the user quote
account is funded to u64::MAX (lamports u64::MAX, token amount
u64::MAX - 2,039,280 rent), so balance never masks it either.
Success cases charge the payer 1,849,400 (1,844,400
volume-accumulator rent + 5,000 fee) and emit 1 BuyEvent;
error cases roll back everything except the payer's 5,000 fee
and emit 0 events.

- anchor-amount1 / anchor-amount1e10: the low anchors (spend 4 /
  1,847,796, matching #17).
- wall-last-success: amount b-4,546,278 = 673,696,391,366,467,
  the largest amount that succeeds.
- wall-first-overflow / wall-mid-overflow / wall-last-overflow:
  the Overflow window's first, middle, and last amounts
  (b-4,546,277, b-4,518,214, b-4,490,151).
- wall-first-truncation / wall-trunc-b-minus1: the first amount
  whose curve itself exceeds u64 (b-4,490,150) and b-1.
- wall-div0-b: amount exactly b.
- wall-reserves-b-plus1 / wall-reserves-max: amounts above b.
- wall-limit-minus1 / wall-limit-exact: the last-success amount
  with limit spend-1 (fails) and limit exactly spend (succeeds).
- tf100-wall-last-success / tf100-wall-first-overflow: the wall
  under a 100bps quote transfer fee (legs in Token-2022 ATAs).

## Result

- Wall ladder (nofee), all 3 images identical: last success
  b-4,546,278; then an Overflow window exactly 56,127 amounts
  wide (b-4,546,277 .. b-4,490,151, first/middle/last all 6023);
  then Truncation from b-4,490,150 through b-1; then amount == b
  gives 6025 DivisionByZero; then amount > b gives 6016
  BuyMoreBaseAmountThanPoolReserves (b+1 and u64::MAX alike).
  The window is far wider than v2's 6 amounts (#30): the legacy
  fee total is only 125 bps, so total = curve + fees crosses
  u64::MAX long before the curve itself does.
- Why each step fails: below the window, curve + lp + protocol +
  creator still fits u64. Inside the window the curve fits but
  the fee-inclusive total does not (6023). Past the window the
  curve itself exceeds u64 (6024 Truncation). At amount == b the
  `checked_sub(b, b)` yields 0 without failing and the following
  `ceil_div` divides by zero (6025) -- a division error, not a
  reserve check. Only above b does the subtraction itself
  underflow (6016).
- The 6023 site migrates earlier as amount grows: at window start
  the final add overflows (original buy.rs:395, rebuild :255),
  mid-window an earlier add (rebuild :252), at window end the
  earliest add (original :387, rebuild :249) -- as the curve
  grows, earlier partial sums cross u64::MAX first. Under tf100
  the 6023 lands on the limit check instead (original :409,
  rebuild :274), where total + transfer_fee is summed.
- Last-success math (nofee), event-decoded and delta-checked:
  curve 18,219,003,998,933,624,041, lp fee 3,643,800,799,786,725
  (2 bps), protocol fee 169,436,737,190,082,704 (93 bps, split
  net 84,718,368,595,041,352 + buyback 84,718,368,595,041,352 at
  buyback_bps 5000), creator fee 54,657,011,996,800,873
  (30 bps); pool_quote (curve + lp) 18,222,647,799,733,410,766;
  total user spend 18,446,741,548,920,294,343. The event's
  user_quote_in field equals the total exactly.
- The wall is limit-masked: the last-success amount with limit
  spend-1 (18,446,741,548,920,294,342) fails 6004
  ExceededSlippage; with limit exactly spend it succeeds with
  deltas identical to wall-last-success.
- Transfer fee shifts the wall earlier: tf100 last success is
  b-4,591,642 = 673,696,391,321,103, i.e. 45,364 amounts earlier
  than nofee, and the very next amount already gives 6023. The
  gross-up is the cause: net pool_quote 18,042,613,685,495,939,752
  is grossed to 18,224,862,308,581,757,326 (transfer fee
  182,248,623,085,817,574), so the fee-inclusive gross total
  crosses u64::MAX sooner. tf100 last-success math: curve
  18,039,005,884,319,075,936, lp fee 3,607,801,176,863,816,
  nominal protocol fee 167,762,754,724,167,407 (net protocol
  83,042,563,588,462,866 + buyback 83,042,563,588,462,865 after
  per-leg 1% withholding), nominal creator fee
  54,117,017,652,957,228 (net 53,575,847,476,427,655). The event's
  user_quote_in field (18,264,493,457,873,064,387) is the
  pre-gross-up total; actual user spend is that plus the
  transfer fee (18,446,742,080,958,881,961).
- All 3 images agree on every case.

Error sites (log paths as emitted by each image):

- wall-first-overflow: original programs/pump-amm/src/instructions/swap/buy.rs:395. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/instructions/swap/buy.rs:255. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/instructions/swap/buy.rs:255. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- wall-mid-overflow: original programs/pump-amm/src/instructions/swap/buy.rs:395. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/instructions/swap/buy.rs:252. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/instructions/swap/buy.rs:252. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- wall-last-overflow: original programs/pump-amm/src/instructions/swap/buy.rs:387. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/instructions/swap/buy.rs:249. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/instructions/swap/buy.rs:249. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.
- wall-first-truncation: original programs/pump-amm/src/curve/constant_product.rs:24. Error Code: Truncation. Error Number: 6024. Error Message: Truncation.; control programs/pump-amm/src/curve/constant_product.rs:10. Error Code: Truncation. Error Number: 6024. Error Message: Truncation.; candidate programs/pump-amm/src/curve/constant_product.rs:10. Error Code: Truncation. Error Number: 6024. Error Message: Truncation.
- wall-trunc-b-minus1: original programs/pump-amm/src/curve/constant_product.rs:24. Error Code: Truncation. Error Number: 6024. Error Message: Truncation.; control programs/pump-amm/src/curve/constant_product.rs:10. Error Code: Truncation. Error Number: 6024. Error Message: Truncation.; candidate programs/pump-amm/src/curve/constant_product.rs:10. Error Code: Truncation. Error Number: 6024. Error Message: Truncation.
- wall-div0-b: original programs/pump-amm/src/curve/fees.rs:21. Error Code: DivisionByZero. Error Number: 6025. Error Message: DivisionByZero.; control programs/pump-amm/src/curve/fees.rs:19. Error Code: DivisionByZero. Error Number: 6025. Error Message: DivisionByZero.; candidate programs/pump-amm/src/curve/fees.rs:19. Error Code: DivisionByZero. Error Number: 6025. Error Message: DivisionByZero.
- wall-reserves-b-plus1: original programs/pump-amm/src/curve/constant_product.rs:21. Error Code: BuyMoreBaseAmountThanPoolReserves. Error Number: 6016. Error Message: BuyMoreBaseAmountThanPoolReserves.; control programs/pump-amm/src/curve/constant_product.rs:8. Error Code: BuyMoreBaseAmountThanPoolReserves. Error Number: 6016. Error Message: BuyMoreBaseAmountThanPoolReserves.; candidate programs/pump-amm/src/curve/constant_product.rs:8. Error Code: BuyMoreBaseAmountThanPoolReserves. Error Number: 6016. Error Message: BuyMoreBaseAmountThanPoolReserves.
- wall-reserves-max: original programs/pump-amm/src/curve/constant_product.rs:21. Error Code: BuyMoreBaseAmountThanPoolReserves. Error Number: 6016. Error Message: BuyMoreBaseAmountThanPoolReserves.; control programs/pump-amm/src/curve/constant_product.rs:8. Error Code: BuyMoreBaseAmountThanPoolReserves. Error Number: 6016. Error Message: BuyMoreBaseAmountThanPoolReserves.; candidate programs/pump-amm/src/curve/constant_product.rs:8. Error Code: BuyMoreBaseAmountThanPoolReserves. Error Number: 6016. Error Message: BuyMoreBaseAmountThanPoolReserves.
- wall-limit-minus1: original programs/pump-amm/src/instructions/swap/buy.rs:405. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; control programs/pump-amm/src/instructions/swap/buy.rs:272. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.; candidate programs/pump-amm/src/instructions/swap/buy.rs:272. Error Code: ExceededSlippage. Error Number: 6004. Error Message: ExceededSlippage.
- tf100-wall-first-overflow: original programs/pump-amm/src/instructions/swap/buy.rs:409. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; control programs/pump-amm/src/instructions/swap/buy.rs:274. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.; candidate programs/pump-amm/src/instructions/swap/buy.rs:274. Error Code: Overflow. Error Number: 6023. Error Message: Overflow.

## Limits

Offline LiteSVM synthetic fixture only (shared v1/v2 fixture,
clock slot 100). No source change, build, or whole-program
equivalence claim. The wall amounts (b-4,546,278, the 56,127-wide
Overflow window, b-4,490,150) are exact for this fixture's curve
state and fee configuration; they are not claimed for other pool
states. The tf override must go through adapt_sell_helper (as in
#12/#16/#17): the tf override rekeys userquote to a TOKEN22-owned
account, so a big-balance override must preserve the TOKEN22
owner and extension bytes and only rewrite lamports and the
amount field -- overwriting the account with a TOKEN-owned one
gives IncorrectProgramId, a harness artifact, not handler
behavior.

The retained producer's narrative header and generated README template contain the earlier effective-quote value 122,946,438,956. That prose double-subtracts accrued fees. The producer logic and raw receipts are unchanged; their curve quotes and wall boundaries use 122,946,564,838, as independently rederived from the recorded pool and vault snapshots.
