# multi-hop swaps reject Token-2022 mints

## Problem

On the two-pool route of the repository's multi-hop harness, with a mint mutated into a synthetic Token-2022 transfer-fee mint: the base-mint fixture fails IncorrectProgramId inside a Token-2022 TransferChecked CPI, and the quote-mint fixture fails 6027 AccountTypeNotSupported, in both directions. In the base fixture, pool 2's base-mint vault is still owned by the Token program. Single-pool trade_v2 was not executed here.

## Cases

Eight fresh-VM triples (original / #424 control / #427
candidate), 24 signed executions on the repository's own
multi-hop harness (`scripts/pump_amm_multi_hop_differential.py`,
two-pool route). The clock is slot 100, epoch 0. `producer.py` records how the receipts were generated, but it reads from the author's local paths (~/workspace/pumpfun-sparse, ~/workspace/slop-verify) and does not match the recorded instruction accounts, so it does not reproduce the receipts from the repository as committed. `verify.py` rechecks the stored receipts.

| Case | Result |
| --- | --- |
| multihop-token22-buy | No Token-2022 mutation (plain SPL Token control): buy spends 10^9 quote, second user gains 5,343,557,184,089 base |
| multihop-token22-buy-base-tf100 | IncorrectProgramId |
| multihop-token22-buy-quote-tf100 | 6027 AccountTypeNotSupported (original trade_v2.rs:138; control/candidate trade_v2.rs:70) |
| multihop-token22-buy-base-tf5000 | IncorrectProgramId |
| multihop-token22-sell | No Token-2022 mutation (plain SPL Token control): sell spends 10^9 base from the second user, gains 180,345 quote |
| multihop-token22-sell-base-tf100 | IncorrectProgramId |
| multihop-token22-sell-quote-tf100 | 6027 AccountTypeNotSupported (original trade_v2.rs:138; control/candidate trade_v2.rs:70) |
| multihop-token22-sell-base-tf5000 | IncorrectProgramId |

All three images return the same error or amounts in every case. The only log difference is the 6027 site line in the two quote cases (original trade_v2.rs:138, control and candidate trade_v2.rs:70).
`verify.py` rechecks every receipt independently: signature
validity, the second-user and quote deltas against the expected
values for the success cases, the error and log fragment for
the failures, rollback of every non-payer account, and
agreement across images. Receipts are stored as parts
(`runtime/raw-transactions-part1/2/3.jsonl.gz`) to stay under
GitHub's 25MB web-upload limit; `verify.py` reads them in
order.

## Result

- **Base fixture fails in a Token-2022 CPI**: with the base mint and pool-1 base vault mutated to Token-2022 while pool 2's base-mint vault stays Token-program owned, the handler invokes Token-2022 TransferChecked, which fails IncorrectProgramId, in both directions at 100 and 5000 bps. Whether a consistent all-Token-2022 fixture would succeed is not tested.
- **The quote fixture fails a key-equality check**: with the quote mint and quote accounts mutated to Token-2022, the handler fails 6027 AccountTypeNotSupported (Left: Tokenkeg..., Right: TokenzQd...) at trade_v2.rs:138 in the original and trade_v2.rs:70 in control and candidate, in both directions.
- **Not tested here**: single-pool trade_v2 with Token-2022 mints is not executed in this packet. Nothing here shows whether the multi-hop handler can route a fully consistent Token-2022 fixture.

## Limits

- No source change, no build, no whole-program identity claim. The images
  are the merged #424 and #427 artifacts; only the new runtime cases are
  added.
- The Token-2022 mint extension is synthetic: the fixture mint and the pool-1 user and vault accounts for it were mutated after the fact. Pool 2's base-mint vault (VQ2) was not converted and stays Token-program owned. The checks are pinned on the fixture pool
  only. No live transaction was submitted. All executions are offline
  LiteSVM replays with normally signed transactions.

Note: the `scope` and `classifications` strings inside `runtime/report.json.gz` were copied
from another packet's template and do not describe these cases; the receipts and the
Cases table above are authoritative.
