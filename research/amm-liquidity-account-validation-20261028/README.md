# Liquidity account validation: ten wrong-account substitutions rejected

## Problem

Deposit takes the pool, global config, base/quote/LP mints and the two pool vaults as accounts. This packet substitutes a wrong account for each of them on deposit, plus an unsigned user and a read-only pool, and substitutes a wrong quote vault on withdraw. Every substitution fails and rolls back every account except the payer's 5000-lamport fee, on the as-is fixture pool. Trade instructions are not executed here.

## Cases

Eleven fresh-VM triples (original / #424 control / #427
candidate), 33 signed executions on the repository's own
liquidity harness (`scripts/pump_amm_liquidity_differential.py`).
The clock is slot 100, epoch 0. `producer.py` generated these receipts on the author's machine; as committed it expects a
checkout at `~/workspace/pumpfun-sparse` and the #424/#427 `candidate.so.gz` images gunzipped
into `~/workspace/slop-verify`, so it does not run from this packet unmodified.

| Case | Result |
| --- | --- |
| liq-base | deposit 10^9: spends 160,619,895,224 base and 29,312,410 quote, gains 10^9 LP |
| liq-wrong-pool | 3007 AccountOwnedByWrongProgram (pool) |
| liq-wrong-config | 3007 AccountOwnedByWrongProgram (global_config) |
| liq-wrong-base-mint | 6008 InvalidBaseMint (pool) |
| liq-wrong-quote-mint | 6009 InvalidQuoteMint (pool) |
| liq-wrong-lp-mint | 6010 InvalidLpMint (pool) |
| liq-wrong-vaultbase | 6014 InvalidPoolBaseTokenAccount (pool) |
| liq-wrong-vaultquote | 6015 InvalidPoolQuoteTokenAccount (pool) |
| liq-unsigned | 3010 AccountNotSigner (user) |
| liq-readonly-pool | 2000 ConstraintMut (pool) |
| liq-withdraw-wrong-vaultquote | 6015 InvalidPoolQuoteTokenAccount (pool) |

All three images behave identically in every case. `verify.py`
rechecks every receipt independently: signature validity, the
user token and LP deltas against the recorded observed amounts (the expected amounts are asserted only by `producer.py`), the error
code and log fragment, the recorded error site (all are
`caused by account` constraint errors with no file line),
rollback on failures, and agreement across images. Receipts are
stored as parts (`runtime/raw-transactions-part1/2/3/4.jsonl.gz`)
to stay under GitHub's 25MB web-upload limit; `verify.py` reads
them in order.

## Result

- **Ownership is checked**: substituting a non-program-owned account for the pool or
  global config fails 3007 AccountOwnedByWrongProgram on that account (deposit only).
  The order of this check relative to the mint and vault checks is not tested.
- **Mint checks cover all three mints**: a wrong base mint
  fails 6008, a wrong quote mint fails 6009, and a wrong LP
  mint fails 6010, all reported against the pool account.
- **Vault checks**: a wrong base vault fails 6014 on deposit (not tested on withdraw),
  and a wrong quote vault fails 6015 on both deposit and withdraw.
- **Signer and mutability are enforced**: an unsigned user
  fails 3010 and a read-only pool fails 2000.
- **Trade checks are not executed here**: this packet runs only deposit and withdraw,
  so it makes no runtime comparison with the trade instructions' account checks.

## Limits

- No source change, no build, no whole-program identity claim. The images
  are the merged #424 and #427 artifacts; only the new runtime cases are
  added.
- The checks are pinned on the fixture pool only. No live
  transaction was submitted. All executions are offline LiteSVM replays
  with normally signed transactions.

Note: the `scope` and `classifications` strings inside `runtime/report.json.gz` were copied
from another packet's template and do not describe these cases; the receipts and the
Cases table above are authoritative.
