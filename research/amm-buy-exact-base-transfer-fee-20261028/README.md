# buy_exact_quote_in_v2 base transfer fee: the slippage floor is fee-blind

## Problem

buy_exact_quote_in_v2 with a base transfer fee delivers the
net base while the vault sends the gross base output, and its
slippage floor (min_base_amount_out) is checked against the
gross computed output, not the net delivery: a floor set to
the gross exact value succeeds while the user receives only
the net amount.

## Cases

Eight fresh-VM triples (original / #424 control / #427
candidate), 24 signed executions on the repository's own trade
harness (`scripts/pump_amm_trade_v2_differential.py`, instruction
buy_exact_quote_in_v2, quote input 10^7). The clock is slot
100, epoch 0. `producer.py` generated these receipts on the author's machine; as committed it expects a
checkout at `~/workspace/pumpfun-sparse` and the #424/#427 `candidate.so.gz` images gunzipped
into `~/workspace/slop-verify`, so it does not run from this packet unmodified.

| Case | User base | User quote | Vault base |
| --- | --- | --- | --- |
| buy-exact-base-nofee | +54,115,018,303 | -10,000,000 | -54,115,018,303 |
| buy-exact-base-tf100 | +53,573,868,119 | -10,000,000 | -54,115,018,303 |
| buy-exact-base-tf5000 | +27,057,509,151 | -10,000,000 | -54,115,018,303 |
| buy-exact-base-tf10000 | 0 | -10,000,000 | -54,115,018,303 |
| buy-exact-base-tf100-limit-gross-exact | +53,573,868,119 | -10,000,000 | -54,115,018,303 |
| buy-exact-base-tf100-limit-net-exact | +53,573,868,119 | -10,000,000 | -54,115,018,303 |
| buy-exact-base-nofee-limit-plus1 | 6040 BuySlippageBelowMinBaseAmountOut | | |
| buy-exact-base-tf100-limit-plus1 | 6040 BuySlippageBelowMinBaseAmountOut | | |

Vault quote gains are 9,954,074 in every success case. All
three images behave identically in every case. `verify.py`
rechecks every receipt independently: signature validity, the
user token and vault deltas against the expected values for
the success cases, the error and log fragment for the
failures, rollback of every non-payer account, and agreement
across images. Receipts are stored as parts
(`runtime/raw-transactions-part1/2/3.jsonl.gz`) to stay under
GitHub's 25MB web-upload limit; `verify.py` reads them in
order.

## Result

- **Buy-exact draws gross, user receives net**: the vault
  sends 54,115,018,303 base and the user spends 10,000,000
  quote in every success case, but the user receives
  53,573,868,119 at a 1% fee, 27,057,509,151 at 50%, and 0 at
  100%.
- **The slippage floor binds on gross, not net**: with a 1%
  base fee, a floor set to the gross exact value
  (54,115,018,303) succeeds while delivering only
  53,573,868,119 net, and a floor set to the net exact value
  succeeds identically. The floor fails only at gross+1, with
  6040 BuySlippageBelowMinBaseAmountOut (original at
  trade_v2.rs:816, control and candidate at :494), in both the
  no-fee and the 1% fee cases.
- **Same mechanism as buy_v2 (see the trade base transfer-fee
  packet; no buy_v2 case runs here)**: the handler computes the
  base output, checks the floor against that gross figure,
  and only then does the token program withhold the fee on
  transfer.

## Limits

- No source change, no build, no whole-program identity claim. The images
  are the merged #424 and #427 artifacts; only the new runtime cases are
  added.
- The base fee extension is synthetic: a base mint cannot carry a
  transfer-fee extension at creation, so the extension was added to the
  fixture mint after the fact. The checks are pinned on the fixture pool
  only. No live transaction was submitted. All executions are offline
  LiteSVM replays with normally signed transactions.
