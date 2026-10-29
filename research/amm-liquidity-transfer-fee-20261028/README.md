# PumpSwap liquidity transfer fee: deposit grosses up, withdraw nets down

## Problem

Deposit and withdraw move quote through the transfer-fee
wrappers, but the direction of the fee math differs: deposit
must gross the spend up, withdraw nets the receipt down. The
amounts, overflow at 10000 and 10001 bps, and the slippage interactions
are now pinned at runtime on the as-is fixture pool.

## Cases

Ten fresh-VM triples (original / #424 control / #427 candidate),
30 signed executions on the repository's own liquidity harness
(`scripts/pump_amm_liquidity_differential.py`). The clock is slot
100, epoch 0. `producer.py` generated these receipts on the author's machine; as committed it expects a
checkout at `~/workspace/pumpfun-sparse` and the #424/#427 `candidate.so.gz` images gunzipped
into `~/workspace/slop-verify`, so it does not run from this packet unmodified.

| Case | Result |
| --- | --- |
| deposit-nofee | base spent 160,619,895,224, quote spent 29,312,410, LP +10^9 |
| deposit-tf100 | base spent 160,619,895,224, quote spent 29,608,495, LP +10^9 |
| deposit-tf5000 | base spent 160,619,895,224, quote spent 58,624,820, LP +10^9 |
| deposit-tf10000 | 6023 Overflow, rollback |
| deposit-tf10001 | 6023 Overflow, rollback |
| deposit-tf100-max-nofee | 6004 ExceededSlippage, rollback |
| withdraw-nofee | base gained 160,619,895,223, quote gained 29,312,409, LP -10^9 |
| withdraw-tf100 | base gained 160,619,895,223, quote gained 29,019,284, LP -10^9 |
| withdraw-tf10000 | base gained 160,619,895,223, quote gained 0, LP -10^9 |
| withdraw-tf100-min-nofee | 6004 ExceededSlippage, rollback |

All three images behave identically in every case. `verify.py`
rechecks every receipt independently: signature validity, the
user token and LP deltas recomputed from account data against the recorded observed values, the error
code and log fragment, the recorded error site (6023 at
`transfer_fee.rs:67` original/candidate vs `:35` control; 6004
at `deposit.rs:100` vs `:23` and `withdraw.rs:107` vs `:24`),
rollback on failures, and agreement across images. Receipts are
stored as parts (`runtime/raw-transactions-part1/2/3.jsonl.gz`)
to stay under GitHub's 25MB web-upload limit; `verify.py` reads
them in order.

## Result

- **Deposit grosses up**: a 1% fee adds 296,085 to the quote
  spend, a 50% fee exactly doubles it, and 10000 and 10001 bps fees
  fail 6023 Overflow at `transfer_fee.rs:67` (original/candidate;
  `:35` on control); the receipts do not show the arithmetic.
- **Withdraw nets down**: a 1% fee removes 293,125 from the
  receipt, a 100% fee leaves 0, and the LP still burns in full.
- **Slippage is fee-aware**: a deposit cap at the no-fee spend
  and a withdraw minimum at the no-fee receipt both fail, because
  the check runs against the grossed/net amount, not the curve
  amount.
- **Base is untouched**: the fee applies to quote only, so base
  deltas are identical with and without the fee.

## Limits

- No source change, no build, no whole-program identity claim. The images
  are the merged #424 and #427 artifacts; only the new runtime cases are
  added.
- The fee math is pinned on the as-is fixture pool only. No live
  transaction was submitted. All executions are offline LiteSVM replays
  with normally signed transactions.
