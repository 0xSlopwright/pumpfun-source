# Liquidity base transfer fee: invisible to the AMM, withheld in transfer

## Problem

Quote transfer fees are computed by the AMM itself (see the
liquidity quote transfer-fee packet), but base
transfer fees are not: the AMM transfers base through the
token program, which withholds the fee opaquely. The amounts
are now pinned at runtime on the as-is fixture pool, with a
synthetic base transfer-fee extension added after the fact (a
base mint cannot carry one at creation).

## Cases

Ten fresh-VM triples (original / #424 control / #427
candidate), 30 signed executions on the repository's own
liquidity harness (`scripts/pump_amm_liquidity_differential.py`).
The clock is slot 100, epoch 0. `producer.py` generated these receipts on the author's machine; as committed it expects a
checkout at `~/workspace/pumpfun-sparse` and the #424/#427 `candidate.so.gz` images gunzipped
into `~/workspace/slop-verify`, so it does not run from this packet unmodified.

| Case | User base | Vault base | LP |
| --- | --- | --- | --- |
| deposit-base-nofee | -160,619,895,224 | +160,619,895,224 | +10^9 |
| deposit-base-tf100 | -160,619,895,224 | +159,013,696,271 | +10^9 |
| deposit-base-tf5000 | -160,619,895,224 | +80,309,947,612 | +10^9 |
| deposit-base-tf10000 | -160,619,895,224 | 0 | +10^9 |
| deposit-base-tf100-maxbase-gross | -160,619,895,224 | +159,013,696,271 | +10^9 |
| withdraw-base-nofee | +160,619,895,223 | -160,619,895,223 | -10^9 |
| withdraw-base-tf100 | +159,013,696,270 | -160,619,895,223 | -10^9 |
| withdraw-base-tf5000 | +80,309,947,611 | -160,619,895,223 | -10^9 |
| withdraw-base-tf10000 | 0 | -160,619,895,223 | -10^9 |
| withdraw-base-tf100-minbase-gross | +159,013,696,270 | -160,619,895,223 | -10^9 |

Quote deltas are identical in every case (deposit spends
29,312,410, withdraw gains 29,312,409). All three images
behave identically in every case. `verify.py` rechecks every
receipt independently: signature validity, the user token, LP,
and vault deltas against the expected values, and agreement
across images. Receipts are stored as parts
(`runtime/raw-transactions-part1/2/3.jsonl.gz`) to stay under
GitHub's 25MB web-upload limit; `verify.py` reads them in
order.

## Result

- **Deposit spends gross, vault receives net**: the user
  spends 160,619,895,224 base and mints 10^9 LP in every case,
  but the vault receives 159,013,696,271 at a 1% fee,
  80,309,947,612 at 50%, and 0 at 100%.
- **Withdraw sends gross, user receives net**: the vault
  sends 160,619,895,223 and burns 10^9 LP in every case, but
  the user receives 159,013,696,270 at 1%, 80,309,947,611 at
  50%, and 0 at 100%.
- **Limits are fee-blind**: a deposit capped at the gross
  spend and a withdraw floored at the gross receipt both
  succeed under a 1% fee; the withdraw floor at gross succeeds
  while delivering only net, so it is not checked against the
  net delivery (gross+1 is not executed).
- **Contrast with quote fees (see the liquidity quote
  transfer-fee packet; no quote-fee case runs here)**: quote
  fees are computed by the AMM; base
  fees are withheld by the token program after the AMM's
  checks have already passed.

## Limits

- No source change, no build, no whole-program identity claim. The images
  are the merged #424 and #427 artifacts; only the new runtime cases are
  added.
- The base fee extension is synthetic: a base mint cannot carry a
  transfer-fee extension at creation, so the extension was added to the
  fixture mint after the fact. The checks are pinned on the fixture pool
  only. No live transaction was submitted. All executions are offline
  LiteSVM replays with normally signed transactions.
