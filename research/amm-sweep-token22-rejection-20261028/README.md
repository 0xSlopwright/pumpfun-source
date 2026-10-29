# fee sweeps reject Token-2022 quote

## Problem

The protocol and creator fee sweeps, given the Token program,
cannot move Token-2022 quote fees (every case passes the legacy Token program; passing the Token-2022 program is not executed here):
the Token program is passed for the
vault transfer of a Token-2022-owned account and fail
IncorrectProgramId, at 1% and 50% fees alike, while the
recipient ATA is created by the program during execution.

## Cases

Six fresh-VM triples (original / #424 control / #427
candidate), 18 signed executions on the repository's own sweep
harness setup (`scripts/pump_amm_sweep_differential.py` account
layout, as-is pool with protocol fees 2,488 and creator fees
123,394). The clock is slot 100, epoch 0. `producer.py` generated these receipts on the author's machine; as committed it expects a
checkout at `~/workspace/pumpfun-sparse` and the #424/#427 `candidate.so.gz` images gunzipped
into `~/workspace/slop-verify`, so it does not run from this packet unmodified.

| Case | Result |
| --- | --- |
| sweep-token22-protocol-base | ATA +2,488, vault -2,488, protocol fees 0 |
| sweep-token22-protocol-quote-tf100 | IncorrectProgramId |
| sweep-token22-protocol-quote-tf5000 | IncorrectProgramId |
| sweep-token22-creator-base | ATA +123,394, vault -123,394, creator fees 0 |
| sweep-token22-creator-quote-tf100 | IncorrectProgramId |
| sweep-token22-creator-quote-tf5000 | IncorrectProgramId |

All three images behave identically in every case.
`verify.py` rechecks every receipt independently: signature
validity, the created ATA gain and vault spend against the
expected values for the success cases, the fee accumulator
left at zero, the error and log fragment for the failures,
rollback of every non-payer account, and agreement across
images. Receipts are stored as parts
(`runtime/raw-transactions-part1/2.jsonl.gz`) to stay under
GitHub's 25MB web-upload limit; `verify.py` reads them in
order.

## Result

- **Both sweeps fail on a Token-2022 quote mint**: the
  protocol sweep and the creator sweep each fail
  IncorrectProgramId at 1% and 50% fees alike.
- **The failure is the program id**: the Token program is passed
  for a transfer of a Token-2022-owned vault account and fails
  IncorrectProgramId. Every failing case has a fee extension; a
  Token-2022 mint without one is not executed here. The recipient ATA is
  created by the program during execution, so only the mint
  and vault were mutated to Token-2022.
- **Trade_v2 does not share the failure**: with the matching
  Token-2022 program account, trade_v2 withholds quote
  transfer fees normally (see the sell transfer-fee packet).
  The sweep handlers have no equivalent path.

## Limits

- No source change, no build, no whole-program identity claim. The images
  are the merged #424 and #427 artifacts; only the new runtime cases are
  added.
- The Token-2022 mint extension is synthetic: the fixture mint was
  mutated after the fact. The checks are pinned on the fixture pool
  only. No live transaction was submitted. All executions are offline
  LiteSVM replays with normally signed transactions.
