# Trade under Token-2022 transfer fees on both mints at once

## Problem

Earlier packets measured a Token-2022 transfer fee on one side at a
time: quote-side fees gross up the buy spend and withhold the sell
receipt (run 1 #14/#12, 2nd #6 for the buyback leg), and base-side
fees net down what the user receives (run 1 #43). Nothing pinned
what happens when both mints are taxed in the same trade: whether
the two legs compose independently, which amount the payout and
the limit checks are computed from, and whether the per-leg caps
bind separately. This packet answers that with fresh signed
executions on the repository's own trade harness.

## Cases

22 cases x 3 images (original / #424 control / #427 candidate),
66 signed executions, on `buy_v2`, `sell_v2`, and
`buy_exact_quote_in_v2` with Token-2022 mints carrying a transfer
fee on the base side, the quote side, or both. The clock is slot
100, epoch 0. `producer.py` reproduces every receipt from the
repository files.

| Case | Result |
| --- | --- |
| buy-notf | user +10^10, spends 1,847,796, vault -10^10 / +1,839,310, buyback +8,486 |
| sell-notf | user +180,212, vault +10^9 / -181,061, buyback +849 |
| exact-notf | user +54,115,018,303, spends 10,000,000, vault -54,115,018,303 / +9,954,074, buyback +45,926 |
| buy-b100-q100 | user +9,900,000,000, spends 1,866,375, vault -10^10 / +1,839,310, buyback22 +8,401 |
| buy-b5000-q5000 | user +5,000,000,000, spends 3,687,106, buyback22 +4,243 |
| buy-b10000-q100 | user 0, spends 1,866,375, vault still debited the gross 10^10 |
| buy-b100-q10000 | 6023 Overflow (quote gross-up divides by zero) |
| buy-b100-q100-limit-nofee | max_quote 1,847,796 fails 6004 ExceededSlippage |
| buy-b100-q100-limit-gross | max_quote 1,866,375 succeeds (inclusive on the grossed spend) |
| buy-caps | 100 caps at 50% + 50%: user +9,999,999,900, spends 1,847,896, buyback22 +8,386 |
| sell-b100-q100 | user +178,409, vault +990,000,000 (net) / -181,061 (gross payout), buyback22 +840 |
| sell-b5000-q5000 | user +90,106, vault +500,000,000 / -181,061, buyback22 +424 |
| sell-b10000-q100 | user +178,409, vault +0 base yet still pays the gross 181,061 |
| sell-b100-q10000-limit1 | 6004 ExceededSlippage (net receipt 0 below limit 1) |
| sell-b100-q10000-limit0 | user 0, buyback22 0, vault still pays the gross 181,061 |
| sell-b100-q100-limit-net | min_quote 178,409 succeeds (inclusive on the net receipt) |
| sell-caps | 100 caps at 50% + 50%: user +180,112, vault +999,999,900, buyback22 +749 |
| exact-b100-q100 | user +53,038,168,841, spends 9,999,541, vault -53,573,907,921 / +9,854,533, buyback22 +45,012 |
| exact-b10000-q100 | user 0, vault still debited the gross 53,573,907,921 |
| exact-b100-q10000 | 6039 BuyNotEnoughQuoteTokensToCoverFees (available is 0) |
| exact-caps | 100 caps at 50% + 50%: user +54,114,475,811, spends the full 10,000,000, vault +9,953,975, buyback22 +45,825 |
| buy-b100-q100-unsigned | 3010 AccountNotSigner |

All three images behave identically in every case. `verify.py`
rechecks every receipt independently: signature validity, the user
token deltas against the expected values, the error code and log
fragment, the recorded error site, rollback on the failure, and
agreement of amounts across images. Receipts are stored as parts
(`runtime/raw-transactions-part1..7.jsonl.gz`) to stay under
GitHub's 25MB web-upload limit; `verify.py` reads them in order.

## Result

- **The two legs compose independently**: the quote leg grosses up
  the buy spend (or withholds the sell receipt) exactly as in the
  quote-only packets, and the base leg withholds the user's base
  receipt exactly as in the base-only packet, while the vaults move
  the gross amounts on both sides.
- **The sell payout is computed from the gross amount in, not
  from what the vault receives**: at base 1% the vault keeps only
  990,000,000 of the 10^9 base in, yet pays the full 181,061
  quote payout; at base 100% the vault keeps 0 base and still
  pays 181,061.
- **Limit bases are asymmetric**: the buy limit is checked against
  the grossed spend (the no-fee spend fails, the grossed spend
  passes), while the sell limit is checked against the net receipt
  (the exact net receipt passes, 0 fails against limit 1 but
  passes against limit 0).
- **Per-leg caps bind separately**: a 100 cap on each leg at 50%
  withholds at most 100 on each side (buy spends no-fee + 100 and
  receives gross - 100; exact spends the full amount because the
  quote cap binds the available computation first).
- **100% fees split by path**: buy fails 6023 (gross-up divide by
  zero) and buy_exact fails 6039 (available is 0), while sell with
  limit 0 succeeds with user 0.

## Limits

- No source change, no build, no whole-program identity claim. The
  images are the merged #424 and #427 artifacts; only the new
  runtime cases are added.
- The composition is pinned on this fixture's fee configuration
  only; other fee configurations could diverge. No live transaction
  was submitted. All executions are offline LiteSVM replays with
  normally signed transactions.
- The buyback recipient under a quote fee is the Token-2022 ATA
  (buyback22); the plain-Token buyback ATA is untouched in fee
  cases, which is why its delta reads 0 there.
