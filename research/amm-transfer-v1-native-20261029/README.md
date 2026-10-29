# transfer_creator_fees_to_pump (v1) moves native wSOL fees as lamports only

## Problem

#22 pinned the v1 handler only for its failure modes: a
synthetic mint gives 6007 `UnsupportedQuoteMint`, and a
Token-2022 vault on the native branch fails the close with
Token custom error 11. The v1 native success path itself —
what actually moves, what the minimum gate measures, and what
happens to the vault ATA — was unmeasured. This packet pins
it with 19 fresh-VM triples (original / #424 control / #427
candidate), 60 signed executions.

## Cases

The fixture quote mint is wSOL, which selects the v1 native
branch. The vault is the ATA derived from
`[creator_vault_authority, Token, wSOL]`; the pump vault is
the PDA derived from `[creator-vault, coin_creator]` under
the Pump program. Rent is `rent(n) = 890,880 + 6,960*n`
lamports, so `rent(165) = 2,039,280` and
`rent(0) = 890,880`. The gate is
`minimum = rent(165) + max(rent(pump_vault.data_len) -
pump_vault.lamports, 0)`.

| Case | Result |
| --- | --- |
| v1-base-success | Vault 2,044,280 -> recreated 2,039,280 amount 0; authority 10^9 -> 0; pump +1,000,005,000 |
| v1-below-min | Vault 2,039,279 < minimum 2,039,280: silent no-op, log message only |
| v1-exact-min | Vault exactly 2,039,280: success, pump +10^9 |
| v1-deficit-absent-below | Pump vault absent (deficit 890,880), vault 2,930,159 < minimum 2,930,160: no-op |
| v1-deficit-absent-exact | Vault exactly 2,930,160: success, pump vault created at 1,000,890,880 |
| v1-deficit-data100-below | Pump vault 100 lamports + 100 bytes (deficit 1,586,780), vault 3,626,059 < minimum 3,626,060: no-op |
| v1-deficit-data100-exact | Vault exactly 3,626,060: success, pump 100 -> 1,001,586,880, data preserved |
| v1-partial-below | Pump vault 500,000 (deficit 390,880), vault 2,430,159 < minimum 2,430,160: no-op |
| v1-partial-exact | Vault exactly 2,430,160: success, pump 500,000 -> 1,000,890,880 |
| v1-auth-rich-vault-below | Vault 100,000 with authority at 10^9: still no-op — available counts the vault ATA only |
| v1-amount-discarded | Vault amount 10^9 with exactly minimum lamports and no authority: pump unchanged, vault recreated empty |
| v1-amount0 | Vault amount 0, lamports 5,000,000: success, pump +1,002,960,720 |
| v1-repeat-call | Two calls: first transfers 1,002,960,720, second transfers 0, pump and vault unchanged by the second |
| v1-huge | Vault 10^9 lamports, no authority: pump +997,960,720 (vault minus ATA rent) |
| v1-err-synth-mint | 6007 UnsupportedQuoteMint (caused by account: wsol_mint) |
| v1-err-wrong-pump | 2006 ConstraintSeeds (caused by account: pump_creator_vault) |
| v1-err-wrong-auth | 2006 ConstraintSeeds (caused by account: coin_creator_vault_authority) |
| v1-err-vault-missing | 3012 AccountNotInitialized (caused by account: coin_creator_vault_ata) |
| v1-err-tokprog22 | 2023 ConstraintAssociatedTokenTokenProgram (Token vault + Token-2022 program meta) |

## Result

- The handler moves lamports only, never token amounts. It
  closes the creator vault wSOL ATA (lamports go to the
  `creator_vault` PDA authority), recreates that same ATA
  empty (2,039,280 lamports, amount 0, 165 bytes), then
  transfers ALL authority lamports to the pump creator vault.
  The authority ends at zero in every success case, and the
  pump vault gains exactly `authority + vault_lamports -
  2,039,280`.
- The gate is a lamport minimum, not an amount minimum:
  below it the handler returns `Ok` silently — only the log
  line `Available fees (X) below minimum transfer amount
  (Y):` marks the no-op — and nothing changes except the
  payer's 5,000 fee. The boundary is exact in all four
  minimum shapes tested (funded pump vault, absent pump
  vault, 100-byte pump vault, partially funded pump vault).
- Available counts only the vault ATA's lamports: a vault at
  100,000 lamports stays a no-op even with the authority
  holding 10^9.
- The vault's token amount is irrelevant: amount 10^9 with
  exactly minimum lamports moves zero lamports to the pump
  vault, and amount 0 moves the full lamport balance minus
  ATA rent.
- The recreated ATA makes the handler re-runnable: a second
  call closes the empty ATA, recreates it, and transfers 0.
  The second call still costs the payer 5,000.
- No event is emitted in any case (0 `Program data:` lines,
  success or failure).
- All 3 images agree on every case.

## Limits

Offline LiteSVM synthetic fixtures only. No source change,
build, or whole-program equivalence claim. The pump vault's
data length is varied synthetically to pin the deficit term;
a real pump creator vault PDA is a system account whose data
length is whatever the Pump program left there. The
`v1-err-tokprog22` 2023 failure is program-level (the
associated-token program constraint) and carries no
`caused by account` site in its log. All lamport figures are
exact values for these fixtures, not claims about other
states.

## Retained receipt qualifications

The final validation sentence in the retained raw report scope says `2009`; the actual case, signed receipts and verifier show `2023 ConstraintAssociatedTokenTokenProgram`. The raw report and producer are preserved.

The retained `counts.vms` value and per-receipt `vm` field are execution/receipt ordinals. This packet has 57 fixture/image VM scenarios and 60 executions: the repeat-call scenario submits two transactions in the same VM for each image. The 60 signed receipt/signature-field count remains correct.
