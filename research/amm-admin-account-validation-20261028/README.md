# Admin account validation: config ownership and shape checked, address not bound

## Problem

The disable, toggle_mayhem_mode and update_admin instructions
validate the config account itself; this packet does not exercise the
admin-signer check. The checks are now pinned
at runtime, including one case where the check passes that a
reader might expect to fail.

## Cases

Nine fresh-VM triples (original / #424 control / #427
candidate), 27 signed executions on the repository's own admin
harness (`scripts/pump_amm_admin_differential.py`). The clock
is slot 100, epoch 0. `producer.py` records how the receipts were produced; as committed it
hard-codes `~/workspace/pumpfun-sparse` and reads the control and
candidate images from `~/workspace/slop-verify`, so it does not rerun
from this checkout. `verify.py` rechecks the committed receipts against
the repository inputs.

| Case | Result |
| --- | --- |
| admin-base | disable [0,0,0,1,0]: flags 0 to 8 |
| admin-wrong-owner | 3007 AccountOwnedByWrongProgram (global_config) |
| admin-noncanonical | disable succeeds: flags 8 on the noncanonical account |
| admin-wrong-event | 2006 ConstraintSeeds (event_authority) |
| admin-missing-program | MissingAccount at the event self-CPI (`Unknown program`), after `Instruction: Disable` and the event data are logged; no `caused by account` site line |
| admin-bad-discriminator | InvalidAccountData (17179869184) |
| admin-truncated | InvalidAccountData (17179869184) |
| admin-mayhem-wrong-owner | 3007 AccountOwnedByWrongProgram (global_config) |
| admin-update-admin-wrong-owner | 3007 AccountOwnedByWrongProgram (global_config) |

All three images behave identically in every case. `verify.py`
rechecks every receipt independently: signature validity, the
config change against the expected value (reading the config
account as the second transaction account, which covers the
noncanonical key), the error code and log fragment, the
recorded error site (the owner and seed checks are
`caused by account` constraint errors; the discriminator and
truncation cases log `ProgramError caused by account`; the
missing-program case has no `thrown in` or `caused by account` site line), rollback on
failures, and agreement across images. Receipts are stored as
parts (`runtime/raw-transactions-part1/2/3.jsonl.gz`) to stay
under GitHub's 25MB web-upload limit; `verify.py` reads them in
order.

## Result

- **Config ownership is checked on the three admin instructions tested**:
  a config owned by the System program fails 3007 on
  global_config for disable, toggle_mayhem_mode, and update_admin.
  The other admin instructions in the IDL are not exercised.
- **The config address is NOT bound**: a noncanonical config
  key holding valid GlobalConfig data with the admin disables
  successfully. In these receipts disable checks the config's owner and
  data shape, not its address; no case here varies the admin field.
- **The event account is seed-checked**: a wrong event
  account fails 2006 ConstraintSeeds on event_authority.
- **Config shape is validated**: a flipped discriminator or a
  56-byte truncated config fails InvalidAccountData at
  global_config deserialization (`ProgramError caused by account:
  global_config`).
- **A substituted `program` account fails at the event self-CPI**:
  with an existing System-owned key in the `program` slot, account
  validation passes, the handler logs `Instruction: Disable` and the
  event data, then the self-CPI fails `Unknown program` and the
  transaction returns MissingAccount, rolled back except the payer's
  5000 fee.

## Limits

- No source change, no build, no whole-program identity claim. The images
  are the merged #424 and #427 artifacts; only the new runtime cases are
  added.
- The checks are pinned on the fixture config only. No live
  transaction was submitted. All executions are offline LiteSVM replays
  with normally signed transactions.

Note: the `scope` and `classifications` strings inside `runtime/report.json.gz` were copied
from another packet's template and do not describe these cases; the receipts and the
Cases table above are authoritative.
