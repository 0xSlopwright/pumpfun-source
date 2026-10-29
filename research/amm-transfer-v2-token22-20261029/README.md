# transfer_creator_fees_to_pump_v2 moves non-native quotes under a matching Token-2022 program

## Problem

#49 showed `transfer_creator_fees_to_pump` and its v2 failing
with 2023 `ConstraintAssociatedTokenTokenProgram` on a
Token-2022 quote mint, and concluded the transfer handlers
have no equivalent of trade_v2's matching-program path. That
conclusion was about the program meta passed in, not about the
handlers: #49 passed the Token program for Token-2022 accounts.
This packet tests the mirror case — the matching Token-2022
program — and finds the v2 non-native path works, with the
usual transfer-fee arithmetic. It also pins what the v1 handler
and the native branch do instead, and why the fixture needed a
synthetic mint: the fixture quote mint is wSOL, so the v2
native branch is selected by mint key, not by program.

## Cases

20 fresh-VM triples (original / #424 control / #427 candidate),
60 signed executions. The vault holds 123,394 unless stated.
The non-native cases use a synthetic mint key (bytes `[7]*32`)
carrying the fixture mint data, because the fixture quote mint
is wSOL (`So11111111111111111111111111111111111111112`) and
would select the native branch. The v2 destination is the ATA
derived from `[pump_creator_vault, token_program, quote_mint]`
under the associated-token program; the vault is the ATA
derived from `[creator_vault_authority, token_program,
quote_mint]`.

| Case | Result |
| --- | --- |
| v2-nonnative-nofee | Vault -123,394, dest +123,394, withheld 0 |
| v2-nonnative-tf100 | Vault -123,394, dest +122,160, withheld 1,234 |
| v2-nonnative-tf5000 | Vault -123,394, dest +61,697, withheld 61,697 |
| v2-nonnative-tf10000 | Vault -123,394, dest 0, withheld 123,394 |
| v2-nonnative-tf5000max100 | Vault -123,394, dest +123,294, withheld 100 |
| v2-nonnative-tf100-destnone | Dest ATA created (payer 2,162,600), dest +122,160, withheld 1,234 |
| v2-nonnative-tf100-destfunds | Dest 5,000 -> 127,160, withheld 1,000 -> 2,234 |
| v2-nonnative-tf100-destnoext | Token-2022 custom error 0xd, full rollback |
| v2-nonnative-epoch0 / epoch9 | 100bps applies: dest +122,160, withheld 1,234 |
| v2-nonnative-epoch10 / epoch11 | 5000bps applies: dest +61,697, withheld 61,697 |
| v2-nonnative-tf100-small | Vault 1,000 -> 0, dest +990, withheld 10 |
| v2-nonnative-tf100-zero | Vault 0, dest 0, success |
| v2-nonnative-token-baseline | Plain Token path: vault -123,394, dest +123,394, 165 bytes |
| v2-nonnative-vaulttokenowned | 2023 ConstraintAssociatedTokenTokenProgram |
| v2-nonnative-desttokenderived | 2006 ConstraintSeeds |
| v1-synthetic-mint | 6007 UnsupportedQuoteMint |
| v1-wsol-token22vault | Token custom error 11, close fails on a funded vault |
| v2-wsol-token22vault | Token custom error 11, same native-branch close failure |

All three images behave identically in every case.
`verify.py` rechecks every receipt independently: signature
validity, the vault/destination deltas against the expected
values, the withheld amount at offset 174, the destination
length, the payer delta, the absence of emitted events, the
error code and log fragment for the failures, rollback of
every non-payer account, and agreement across images.
Receipts are stored as parts
(`runtime/raw-transactions-part1/2/3/4/5/6.jsonl.gz`) to stay
under GitHub's 25MB web-upload limit; `verify.py` reads them
in order.

## Result

- **The v2 non-native path works with the matching program.**
  With TOKEN22 passed for Token-2022 accounts, the vault
  drains in full and the destination gains the net amount.
  #49's 2023 is a program-meta mismatch, not a handler
  limitation — the same mirror pattern as #20 (sweep) and
  #21 (collect).
- **Fee arithmetic is the standard Token-2022 arithmetic:**
  tf100 withholds `ceil(123,394 x 100 / 10000) = 1,234`,
  tf5000 withholds 61,697, tf10000 withholds the full
  123,394 and still succeeds with zero delivery (the opposite
  of the trade paths' 100% errors). Caps bind the withheld
  amount only (tf5000-max100 withholds exactly 100).
- **A missing destination is created, not rejected.** When
  the destination ATA does not exist, the handler creates it
  (payer pays 2,162,600; the destination holds 2,157,600
  after the 5,000 fee) and then transfers with withholding.
  A pre-existing destination costs the payer only 5,000.
- **Withheld accumulates on pre-existing destinations**
  (5,000 -> 127,160 amount, 1,000 -> 2,234 withheld), and a
  destination without TransferFeeAmount extension space
  fails with Token-2022 custom error 0xd
  ("Invalid account state for operation"), with full
  rollback.
- **Epoch switching is exact:** with an older 100bps /
  newer 5000bps schedule at epoch 10, epochs 0 and 9 apply
  100bps and epochs 10 and 11 apply 5000bps. The synthesized
  mint extension order is older first, newer last.
- **No event is emitted.** The transfer logs contain no
  `Program data:` line in any case, success or failure.
- **v1 cannot do non-native quotes at all:** with a
  synthetic non-native mint it fails 6007
  `UnsupportedQuoteMint` (caused by account: `wsol_mint`),
  before any funds move.
- **The native branch is selected by mint key, not by
  program.** With the wSOL mint and a Token-2022 vault, both
  v1 and v2 take the native branch and fail with Token
  custom error 11 ("Non-native account can only be closed
  if its balance is zero") because the branch tries to
  close a funded non-native vault. A Token-2022 vault can
  therefore never pass through the native branch with a
  balance.
- **Mismatch map:** TOKEN22 program + Token-owned vault
  gives 2023 `ConstraintAssociatedTokenTokenProgram`; a
  Token-derived destination key passed as
  `pump_creator_vault_ata` gives 2006 `ConstraintSeeds`
  (caused by account: `pump_creator_vault_ata`).

## Limits

- No source change, no build, no whole-program identity
  claim. The images are the merged #424 and #427 artifacts;
  only the new runtime cases are added.
- The non-native quote mint is synthetic: the fixture mint
  data was copied onto a fresh key, and the vault/destination
  ATAs were derived from that key. The checks pin handler
  behavior on the fixture, not a reachable mainnet state
  (a real non-native quote mint would need a pool using it).
- The Token-program baseline sets vault/destination
  lamports to 10^9: at the standard 2,039,280-lamport rent
  level the harness rejects the Token transfer with
  `InsufficientFundsForRent` (a harness rent artifact;
  token deltas are unaffected). Token-2022 cases use the
  standard lamport levels.
- The 0xd failure is reported as observed, without
  inventing an internal Token-2022 error variant name.
  The 11 failure is the Token program's close error, quoted
  from the log.
