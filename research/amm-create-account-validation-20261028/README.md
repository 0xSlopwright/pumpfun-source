# create_pool account validation: wrong accounts fail and roll back

## Problem

create_pool derives the pool address from seeds and checks its
accounts. Seed, config and signer failures happen before any
allocation; mint and vault failures happen after the pool, LP
mint and ATAs are created, and are rolled back. The checks are now pinned
at runtime, including two cases where the failure surfaces
outside program logic.

## Cases

Nine fresh-VM triples (original / #424 control / #427
candidate), 27 signed executions on the repository's own
create harness (`scripts/pump_amm_create_differential.py`). The
clock is slot 100, epoch 0. `producer.py` generated these receipts on the author's machine; as committed it expects a
checkout at `~/workspace/pumpfun-sparse` and the #424/#427 `candidate.so.gz` images gunzipped
into `~/workspace/slop-verify`, so it does not run from this packet unmodified.

| Case | Result |
| --- | --- |
| create-base | vaults store 10^9 base and 10^9 quote |
| create-wrong-pool | 2006 ConstraintSeeds (pool) |
| create-wrong-config | 3007 AccountOwnedByWrongProgram (global_config) |
| create-same-mint | 6022 SameMint at create_pool.rs:217 |
| create-wrong-vaultbase | 2015 ConstraintTokenOwner (pool_base_token_account) |
| create-wrong-vaultquote | 2014 ConstraintTokenMint (pool_quote_token_account) |
| create-unsigned | 3010 AccountNotSigner (creator) |
| create-readonly-pool | PrivilegeEscalation, "writable privilege escalated" |
| create-twice | System Allocate "already in use" (custom 0x0) |

All three images behave identically in every case. `verify.py`
rechecks every receipt independently: signature validity, the
vault balances against the expected values, the error code and
log fragment, the recorded error site (the same-mint check at
`create_pool.rs:217` original vs `:101` control/candidate; the
rest are `caused by account` constraint errors, and the
readonly-pool and duplicate cases have no program error site),
rollback on failures, and agreement across images. Receipts are
stored as parts (`runtime/raw-transactions-part1/2/3.jsonl.gz`)
to stay under GitHub's 25MB web-upload limit; `verify.py` reads
them in order.

## Result

- **The pool address is seed-checked**: a pool key that is
  not the derived PDA fails 2006 ConstraintSeeds, not an
  ownership check, because the PDA derivation runs first.
- **Config ownership is checked**: a global config owned by
  the wrong program fails 3007.
- **Vault checks are token-constraint checks**: a base vault
  that is not pool-owned fails 2015 ConstraintTokenOwner,
  while a quote vault whose mint is not the quote fails 2014
  ConstraintTokenMint — the mint check fires before any
  association check.
- **Two failures live outside program logic**: a read-only
  pool fails PrivilegeEscalation because the program allocates
  the account, and a duplicate pool fails at System Allocate
  with "already in use" before program logic runs.

## Limits

- No source change, no build, no whole-program identity claim. The images
  are the merged #424 and #427 artifacts; only the new runtime cases are
  added.
- The checks are pinned on the fixture pool only. No live
  transaction was submitted. All executions are offline LiteSVM replays
  with normally signed transactions.
