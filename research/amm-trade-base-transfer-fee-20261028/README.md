# trade_v2 base transfer fee: invisible to the trade, withheld in transfer

## Problem

Base transfer fees are not computed by trade_v2 either: the
program moves base through the token program, which withholds
the fee opaquely. The amounts are now pinned at runtime, with
a synthetic base transfer-fee extension added after the fact
(a base mint cannot carry one at creation).

## Cases

Ten fresh-VM triples (original / #424 control / #427
candidate), 30 signed executions on the repository's own trade
harness (`scripts/pump_amm_trade_v2_differential.py`). The
clock is slot 100, epoch 0. `producer.py` generated these receipts on the author's machine; as committed it expects a
checkout at `~/workspace/pumpfun-sparse` and the #424/#427 `candidate.so.gz` images gunzipped
into `~/workspace/slop-verify`, so it does not run from this packet unmodified.

| Case | User base | User quote | Vault base |
| --- | --- | --- | --- |
| trade-base-nofee | +10^10 | -1,847,796 | -10^10 |
| trade-base-tf100 | +9,900,000,000 | -1,847,796 | -10^10 |
| trade-base-tf5000 | +5,000,000,000 | -1,847,796 | -10^10 |
| trade-base-tf10000 | 0 | -1,847,796 | -10^10 |
| trade-base-tf100-limit-exact | +9,900,000,000 | -1,847,796 | -10^10 |
| trade-sell-base-nofee | -10^9 | +180,212 | +10^9 |
| trade-sell-base-tf100 | -10^9 | +180,212 | +990,000,000 |
| trade-sell-base-tf5000 | -10^9 | +180,212 | +500,000,000 |
| trade-sell-base-tf10000 | -10^9 | +180,212 | 0 |
| trade-sell-base-tf100-limit-exact | -10^9 | +180,212 | +990,000,000 |

Vault quote moves are identical in every case (buy gains
1,839,310, sell spends 181,061). All three images behave
identically in every case. `verify.py` rechecks every receipt
independently: signature validity, the user token and vault
deltas against the expected values, and agreement across
images. Receipts are stored as parts
(`runtime/raw-transactions-part1/2/3.jsonl.gz`) to stay under
GitHub's 25MB web-upload limit; `verify.py` reads them in
order.

## Result

- **Buy draws gross, user receives net**: the vault sends
  10^10 base and the user spends 1,847,796 quote in every
  case, but the user receives 9,900,000,000 at a 1% fee,
  5,000,000,000 at 50%, and 0 at 100%.
- **Sell spends gross, vault receives net**: the user spends
  10^9 base and gains 180,212 quote in every case, but the
  vault receives 990,000,000 at 1%, 500,000,000 at 50%, and 0
  at 100%.
- **Limits are fee-blind**: a buy limited at the exact quote
  spend and a sell limited at the exact quote receipt both
  succeed under a 1% base fee, because both limits are
  quote-side and the base fee never touches quote.
- **Same mechanism as liquidity**: base fees are withheld by
  the token program after the program's checks, on trade here,
  as on deposit and withdraw in the liquidity base transfer-fee
  packet.

## Limits

- No source change, no build, no whole-program identity claim. The images
  are the merged #424 and #427 artifacts; only the new runtime cases are
  added.
- The base fee extension is synthetic: a base mint cannot carry a
  transfer-fee extension at creation, so the extension was added to the
  fixture mint after the fact. The checks are pinned on the fixture pool
  only. No live transaction was submitted. All executions are offline
  LiteSVM replays with normally signed transactions.
