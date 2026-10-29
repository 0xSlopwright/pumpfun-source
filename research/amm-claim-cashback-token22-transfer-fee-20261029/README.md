# claim_cashback under a matching Token-2022 transfer fee

## Problem

2nd-run #2 pinned `claim_cashback` without fees: the claim moves the
vault's entire balance, `claimed` increments by the moved amount
(checked, 6023 on overflow), the vault is ATA-bound while the
destination is not, and Token-2022 vaults claim fine. What #2 never
tested is a Token-2022 transfer fee on the quote mint: does the
claim still succeed, does the recipient receive the net amount with
the fee withheld into the destination's TransferFeeAmount extension,
does `claimed` count the gross or the net amount, does the event
report the gross or the net amount, and do caps and epoch schedules
behave like the sweep/collect/transfer packets (#20/#21/#22)?

## Cases

20 cases x 3 images (original / #424 control / #427 candidate) =
60 signed receipts, parts of 10. Vault amount is 100,000 unless
stated; the destination starts empty unless stated; the payer pays
5,000 in every case.

- `token-baseline`: Token program, no fee. Vault 100,000 -> 0, dest
  +100,000, claimed 13 -> 100,013, dest stays 165 bytes.
- `token22-nofee`: matching Token-2022 program, no fee extension.
  Dest +100,000, withheld 0, dest 182 bytes (extension area present).
- `token22-nofee-plain-dest`: no-fee Token-2022 destination needs
  no extension: plain 165-byte dest receives the full 100,000.
- `tf100` / `tf5000` / `tf10000`: dest +99,000 / +50,000 / 0,
  withheld 1,000 / 50,000 / 100,000, vault drained in all three,
  claimed 100,013 in all three. A 100% fee still succeeds with
  receipt 0 — the opposite of the trade paths' 100% errors
  (buy_exact 6039, non-exact buy 6023).
- `tf5000-max100`: withheld exactly 100, dest +99,900. Caps bind
  the withheld amount only.
- `tf100-amount1000`: dest +990, withheld 10, claimed 1,013.
- `tf100-amount1`: dest +0, withheld 1, claimed 13 -> 14. The
  1-unit fee is fully withheld (ceil).
- `tf100-amount0`: success, nothing moves, claimed unchanged at 13.
- `tf100-prewithheld`: existing dest (5,000, withheld 1,000) ->
  104,000 with withheld 2,000. Withheld accumulates.
- `tf100-dest-noext`: existing 165-byte destination with a fee
  fails with Token-2022 custom error 0xd
  (`InstructionErrorCustom(13)`), fully rolled back.
- `tf-epoch0` / `tf-epoch9` / `tf-epoch10` / `tf-epoch11`: older
  100bps / newer 5000bps schedule at epoch 10. Epochs 0 and 9 apply
  100bps (dest +99,000, withheld 1,000); epochs 10 and 11 apply
  5000bps (dest +50,000, withheld 50,000). The switch is exact at
  the newer epoch. The synthesized mint extension order is older
  first, newer last.
- `tf100-claimed-max`: claimed at u64::MAX with amount 100,000
  fails 6023 Overflow (original
  `token_incentives/claim.rs:228`, control/candidate
  `cashback.rs:36`), fully rolled back. `claimed` counts the gross
  amount, so the fee does not rescue the overflow.
- `tf100-claimed-maxm1-amount1`: claimed u64::MAX-1, amount 1 ->
  success, claimed u64::MAX, dest +0, withheld 1.
- `tf100-earned-max`: earned at u64::MAX does not gate anything:
  same result as `tf100`, event earned field u64::MAX.
- `prog-mismatch`: Token program meta with Token-2022-owned
  accounts fails 2023 `ConstraintAssociatedTokenTokenProgram`
  (AnchorError form, no thrown-in site).

## Result

- With a matching Token-2022 program, the claim always drains the
  vault fully; the recipient receives the net amount and the fee
  is withheld into the destination ATA at offset 174 (u64).
- `claimed` increments by the GROSS vault amount, and the event
  reports the GROSS amount too (event layout: discriminator 8 +
  user 32 + amount u64 @40 + timestamp u64 @48 + claimed u64 @56
  + earned u64 @64). Reading only events overstates delivery
  under any nonzero fee — the same gross-reporting pattern as the
  sweep (#20) and collect (#21) packets.
- The vault itself needs no extension: every fee case here uses a
  plain 165-byte Token-2022 vault. Only the destination needs
  extension space, and only when a fee is actually configured.
- All 3 images agree on every case. This packet pins behavior; it
  does not claim a divergence.

## Limits

Offline LiteSVM synthetic fixtures only. No source change, build,
or whole-program equivalence claim. The quote mint transfer-fee
extension and the Token-2022 vault/destination accounts are
post-hoc synthesized (handler transfer behavior pinned, not a
reachable mainnet state — a cashback vault is normally a wSOL ATA).
The 0xd failure is reported as observed, without claiming an
internal Token-2022 error variant name. Numbers are exact values
for this fixture's vault amount and fee settings.
