# claim_token_incentives under a matching Token-2022 transfer fee

## Problem

2nd-run #4 pinned `claim_token_incentives` without fees: the reward
conditions (prev_day < today, prev_day <= end_day, prev bucket
volume > 0, current volume > 0), the floor reward formula, the
reset, the zero-claim advance, and the panic paths. What #4 never
tested is a Token-2022 transfer fee on the incentive mint: does the
claim still succeed, does the recipient receive the net amount with
the fee withheld into the destination's TransferFeeAmount extension,
does `total_claimed_tokens` count the gross or the net amount, does
the event report the gross or the net amount, and do caps, epoch
schedules, and the missing-ATA creation path behave like the
sweep/collect/transfer/cashback packets (#20/#21/#22/#24)?

## Cases

21 cases x 3 images (original / #424 control / #427 candidate) =
63 signed receipts, parts of 10. The global accumulator fixture is
start 20, end 49, period 1, supplies [1000]*30, volumes [100]*30;
the user accumulator starts at needs 1, unclaimed 5, claimed 7,
volume 20, last 0, has_claimed 1 (unless stated); the vault holds
10^9, the destination holds 17 (unless stated); the payer pays
5,000 in every case except the missing-ATA creation case.

- `token-baseline`: Token program, no fee. Vault -5, dest +5,
  claimed 7 -> 5 (the pre-start reset zeroes 7 first), dest stays
  165 bytes.
- `token22-nofee`: matching Token-2022 program, no fee extension.
  Dest +5, withheld 0, dest 182 bytes (extension area present).
- `token22-nofee-plain-dest`: no-fee Token-2022 destination needs
  no extension: plain 165-byte dest receives the full 5.
- `tf100` / `tf5000` / `tf10000`: dest +4 / +2 / +0, withheld
  1 / 3 / 5, vault -5 in all three, claimed 5 in all three. A
  100% fee still succeeds with receipt 0 — the opposite of the
  trade paths' 100% errors (buy_exact 6039, non-exact buy 6023).
- `tf5000-max100`: unclaimed 100,000, withheld exactly 100, dest
  +99,900, claimed 100,000. Caps bind the withheld amount only.
- `tf100-amount1000`: dest +990, withheld 10, claimed 1,000.
- `tf100-amount1`: dest +0, withheld 1, claimed 1. The 1-unit fee
  is fully withheld (ceil).
- `tf100-amount0`: zero claim under a fee. Success, nothing
  moves, "No tokens to claim" log, claimed stays 7, last advances
  to 21, needs recomputed to 0, 0 events.
- `tf100-prewithheld`: existing dest (17, withheld 1,000) ->
  21 with withheld 1,001. Withheld accumulates.
- `tf100-dest-noext`: existing 165-byte destination with a fee
  fails with Token-2022 custom error 0xd
  (`InstructionErrorCustom(13)`), fully rolled back.
- `tf100-dest-underfunded-rent`: existing 182-byte destination
  funded at only the 165-byte rent (2,039,280) fails with 2005
  ConstraintRentExempt (caused by account: user_ata), because
  `init_if_needed` checks rent exemption and the 182-byte rent is
  2,157,600.
- `tf-epoch0` / `tf-epoch9` / `tf-epoch10` / `tf-epoch11`: older
  100bps / newer 5000bps schedule at epoch 10. Epochs 0 and 9 apply
  100bps (dest +4, withheld 1); epochs 10 and 11 apply 5000bps
  (dest +2, withheld 3). The switch is exact at the newer epoch.
  The synthesized mint extension order is older first, newer last.
- `tf100-reward-day`: now 21, last 20. Reward 200 accrues onto
  unclaimed 5 for a 205 claim: vault -205, dest +202, withheld 3,
  claimed 7 -> 212, volume 0, last 21, needs 0, event amount 205.
- `tf100-claimed-max`: claimed u64::MAX with a 5-token claim
  panics with ProgramFailedToComplete ("called `Option::unwrap()`
  on a `None` value"), fully rolled back — the gross-claimed
  increment panics under a fee exactly as without one.
- `tf100-missing-user-ata`: `init_if_needed` creates the ATA
  under a fee: payer 2,162,600, created ATA 182 bytes with
  2,157,600 lamports, dest +4, withheld 1, claimed 5.
- `prog-mismatch`: Token program meta with Token-2022-owned
  accounts fails with 2023 ConstraintAssociatedTokenTokenProgram
  (AnchorError form, no thrown-in site).

## Result

All 21 cases agree across the 3 images. The claim path composes
with a Token-2022 fee exactly like the sweep/collect/transfer/
cashback paths, with three instruction-specific pins: claimed and
the event both count the GROSS amount (so a 100% fee still grows
claimed by the full claim while the recipient gets 0), the
`init_if_needed` destination is rent-checked at its extended size
(2005 on an underfunded 182-byte ATA), and the zero claim stays a
silent no-op under a fee.

## Limits

Offline LiteSVM synthetic fixtures only. No source change, build,
or whole-program equivalence claim. The incentive mint fee
extension and the Token-2022 vault/destination accounts are
post-hoc synthesized (handler transfer behavior pinned, not a
reachable mainnet state — the incentive mint is normally a plain
token). The 0xd failure is reported as observed, without claiming
an internal Token-2022 error variant name. Numbers are exact
values for this fixture's accumulator state and fee settings and
are not claimed for other states.
