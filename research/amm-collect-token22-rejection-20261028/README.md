# collect_coin_creator_fee rejects Token-2022 quote

## Problem

collect_coin_creator_fee, given the Token program, cannot move
Token-2022 quote fees (the Token-2022 program is not executed here):
its associated-token constraint requires the creator vault
and the destination to be associated under the Token program
passed in, so a Token-2022 quote mint fails 2023
ConstraintAssociatedTokenTokenProgram before any funds move, at
1%, 50% and 100% fees, and also when the vault and destination are
Token-2022-owned without a fee extension.

## Cases

Six fresh-VM triples (original / #424 control / #427
candidate), 18 signed executions on the repository's own
collect harness setup (`scripts/pump_amm_collect_differential.py`
account layout, creator vault 123,394). The clock is slot 100,
epoch 0. `producer.py` generated these receipts on the author's machine; as committed it expects a
checkout at `~/workspace/pumpfun-sparse` and the #424/#427 `candidate.so.gz` images gunzipped
into `~/workspace/slop-verify`, so it does not run from this packet unmodified.

| Case | Result |
| --- | --- |
| collect-token22-base | Vault -123,394, destination +123,394 |
| collect-token22-quote-tf100 | 2023 ConstraintAssociatedTokenTokenProgram |
| collect-token22-quote-tf5000 | 2023 ConstraintAssociatedTokenTokenProgram |
| collect-token22-quote-tf10000 | 2023 ConstraintAssociatedTokenTokenProgram |
| collect-token22-noext | 2023 ConstraintAssociatedTokenTokenProgram |
| collect-token22-vault-only-tf100 | 2023 ConstraintAssociatedTokenTokenProgram |

All three images behave identically in every case.
`verify.py` rechecks every receipt independently: signature
validity, the vault and destination deltas against the
expected values for the success case, the error and log
fragment for the failures, rollback of every non-payer
account, and agreement across images. Receipts are stored as
parts (`runtime/raw-transactions-part1/2.jsonl.gz`) to stay
under GitHub's 25MB web-upload limit; `verify.py` reads them
in order.

## Result

- **The program constraint binds, not the fee**: a
  Token-2022 quote mint fails 2023 at 1%, 50% and 100% fees
  alike, and a Token-2022-owned vault and destination with
  no fee extension at all fail the same 2023.
- **The vault alone triggers it**: a Token-2022 vault with
  a Token destination fails the same 2023, so the vault alone is
  enough to trigger it (no destination-only case is executed).
- **Trade_v2 does not share the failure**: with the matching
  Token-2022 program account, trade_v2 withholds quote
  transfer fees normally (see the sell transfer-fee packet).
  The collect handler has no equivalent path.

## Limits

- No source change, no build, no whole-program identity claim. The images
  are the merged #424 and #427 artifacts; only the new runtime cases are
  added.
- The Token-2022 mint extension is synthetic: the fixture mint was
  mutated after the fact. The checks are pinned on the fixture pool
  only. No live transaction was submitted. All executions are offline
  LiteSVM replays with normally signed transactions.
