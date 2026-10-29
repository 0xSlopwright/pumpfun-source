# legacy buy and sell reject Token-2022 mints

## Problem

Given the Token program, the legacy buy and sell handlers fail for a
Token-2022 base or quote mint (every case passes the legacy Token program; passing the Token-2022 program is not executed here), while
trade_v2 withholds base and quote transfer fees normally when
given the matching Token-2022 program account.

## Cases

Eight fresh-VM triples (original / #424 control / #427
candidate), 24 signed executions on the repository's own legacy
harness (`scripts/pump_amm_legacy_buy_differential.py` and
`scripts/pump_amm_legacy_sell_differential.py`). The clock is
slot 100, epoch 0. `producer.py` generated these receipts on the author's machine; as committed it expects a
checkout at `~/workspace/pumpfun-sparse` and the #424/#427 `candidate.so.gz` images gunzipped
into `~/workspace/slop-verify`, so it does not run from this packet unmodified.

| Case | Result |
| --- | --- |
| legacy-token22-base | Buy gains 10^10 base, spends 1,847,796 quote; vault draws 10^10 base, gains 1,825,348 quote |
| legacy-token22-base-tf100 | InvalidAccountData |
| legacy-token22-quote-tf100 | InvalidAccountData |
| legacy-token22-base-tf5000 | InvalidAccountData |
| legacy-token22-sell-base | Sell spends 10^9 base, gains 180,212 quote; vault gains 10^9 base, draws 182,458 quote |
| legacy-token22-sell-base-tf100 | InvalidAccountData |
| legacy-token22-sell-quote-tf100 | InvalidAccountData |
| legacy-token22-sell-base-tf5000 | InvalidAccountData |

All three images behave identically in every case.
`verify.py` rechecks every receipt independently: signature
validity, the user token and vault deltas against the expected
values for the success cases, the error and log fragment for
the failures, rollback of every non-payer account, and
agreement across images. Receipts are stored as parts
(`runtime/raw-transactions-part1/2/3.jsonl.gz`) to stay under
GitHub's 25MB web-upload limit; `verify.py` reads them in
order.

## Result

- **Token-2022 mints fail in legacy, in both directions**:
  a legacy buy or sell given the Token program fails
  InvalidAccountData with a Token-2022 base mint (1% and 50%
  fees) or a Token-2022 quote mint (1% fee only).
- **The Token program itself rejects first**: the logs show
  the Token program failing with "invalid account data for
  instruction" before the AMM fails, because the legacy
  handlers pass the Token program for a transfer of a
  Token-2022-owned account.
- **trade_v2 does not share the failure**: with the matching
  Token-2022 program account, trade_v2 withholds base and
  quote transfer fees normally (see the trade base and quote
  transfer-fee packets). The legacy handlers have no
  equivalent path.
- **Legacy quote vault deltas**: the legacy buy adds 1,825,348
  to the quote vault and the legacy sell draws 182,458, pinned
  here. No v2 instruction runs in this packet; the v2 figures
  (1,839,310 and 181,061) come from the trade base transfer-fee
  packet.

## Limits

- No source change, no build, no whole-program identity claim. The images
  are the merged #424 and #427 artifacts; only the new runtime cases are
  added.
- The Token-2022 mint extension is synthetic: the fixture mint was
  mutated after the fact. The checks are pinned on the fixture pool
  only. No live transaction was submitted. All executions are offline
  LiteSVM replays with normally signed transactions.
