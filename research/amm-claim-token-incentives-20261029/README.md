# claim_token_incentives, pinned at runtime

## Problem

`claim_token_incentives` is the claim side of the token-incentive
system. Run 1 never covered it, 2nd-run #2 covered the sibling
`claim_cashback`, and 2nd-run #3 covered the admin updater — but the
claim-side rules (when a reward accrues, what the reset does, what a
zero claim changes, and where the overflow and index panics sit) were
only implicit in the recovered source. This packet pins them at
runtime, with signed receipts on three images.

## Method

Synthetic fixtures under LiteSVM, fresh VM per case per image:
original deployed binary (`evidence/original/pump_amm/deployed.so`),
#424 control, #427 candidate. Default fixture: start 20, end 49,
period 1, supplies `[1000]*30`, volumes `[100]*30`, unclaimed 5,
claimed 7, current volume 20, last update 0, needs_claim 1,
has_total_claimed_tokens 1, vault 10^9, user ATA 17, clock slot 100.
`producer.py` builds the receipts; `verify.py` re-checks them
independently (signatures, amounts, error codes and sites, rollback,
three-image agreement). Receipts are stored as 10-receipt parts to
stay under GitHub's 25MB web-upload limit.

## Result

40 cases x 3 images = 120 signed receipts, all three images agree
on every case. This is a behavior pin, not a divergence claim.

### Reward

- A reward accrues only when previous_day < today,
  previous_day <= end_day, `sol_volumes[previous_day] > 0`, and
  `current_sol_volume > 0`. Reward =
  `volume * total_token_supply[previous_day] /
  sol_volumes[previous_day]`, integer floor: 20 * 1000 / 100 = 200
  (reward-day: claimed 7 + 205 = 212, volume 0, needs 0, vault
  999999795, user ATA 222); 3 * 1000 / 7 = 428 (reward-floor:
  claimed 440, vault 999999567, user ATA 450).
- The reward accrues even after `end_time` when previous_day is
  still <= end_day (after-end-reward, now 60: claimed 212), and not
  when previous_day is past end_day (prev-after-end, last 50:
  claimed 12), when previous_day equals today (same-day: claimed
  12), or when the previous bucket volume is zero
  (zero-prev-volume: claimed 12).
- Period 0 skips the whole update block (period-0: claimed 12,
  volume kept 20, last still stamped 21 by the transfer path).
  Period 10 works the same way (period-10-reward: claimed 212).

### Reset, zero claim, transfer path

- Reset: now < start and last < start zeroes `total_claimed` and
  clears `has_total_claimed_tokens` (base-before-start: claimed
  7 -> 0, then the 5-token claim lands as 5, needs 1, last 10).
  Last >= start skips the reset (reset-skip, last 25: claimed 12).
- The stored user field is overwritten with the caller's key even
  when it held another key (stored-other-user: claimed 5).
- Zero claim: amount 0 logs "No tokens to claim" and succeeds with
  no transfer, but still advances `last_update_timestamp` to 21
  and recomputes `needs_claim` (zero-claim: claimed stays 7,
  needs 0, vault/user unchanged).
- The transfer path always stamps `last_update_timestamp` to now
  and sets `needs_claim = current_sol_volume > 0` afterwards, so
  after-end and same-day claims also move last to now.

### Panics (ProgramFailedToComplete, full rollback except the 5000 fee)

- `sol_volumes[today]` with today >= 30 indexes out of bounds
  (volume_accumulator.rs:391:43, "the len is 30 but the index is
  30"), whether or not a reward was computed first
  (today-oob-reward and today-oob-noreward, both now 50, end 100).
- Stored end < start panics "end_time should be bigger than
  start_time" (:387:14, end-inverted).
- Unclaimed checked_add panics "Unexpected overflow" (:109:14,
  unclaimed-overflow, unclaimed u64::MAX + 200).
- Total_claimed checked_add unwrap panics "called
  `Option::unwrap()` on a `None` value" (:137:14,
  claimed-overflow, claimed u64::MAX + 5).

### Errors (all roll back except the payer's 5000 fee)

- Reward overflow: Truncation 6024 (volume u64::MAX, supply
  u64::MAX, bucket volume 1).
- Stored foreign mint: InvalidIncentiveMint 6038 (has_one on the
  global volume accumulator).
- Vault short (4 < 5): Token program custom error 1 (insufficient
  funds).
- Missing vault / user accumulator / global accumulator: 3012
  AccountNotInitialized.
- Unsigned payer: 3010 AccountNotSigner (fee paid by OUTSIDER).
- Readonly accumulator / user ATA / vault: 2000 ConstraintMut.
- Wrong user key: 2015 ConstraintTokenOwner (user ATA authority
  mismatch).
- Wrong accumulator key: 2006 ConstraintSeeds.
- 89-byte user accumulator / 543-byte global accumulator: 3003
  AccountDidNotDeserialize (the struct floors are 90 and 544).
- 164-byte token accounts and 81-byte mint: InvalidAccountData
  (token/mint deserialization, not Anchor 3003).

### Accounts

- A missing user ATA is created by init_if_needed: payer delta
  2044280 = 5000 fee + 2039280 rent, then the 5-token claim lands
  in it (missing-user-ata).
- Token-2022 program accounts work (token22-reward: claimed 212,
  same as the SPL-token case).

## Limits

Offline LiteSVM synthetic accounts only. No source change, build,
or whole-program equivalence claim. Line numbers are log-based
from the deployed binary, which differ from the checked-out
source layout. Zero-balance targets are not included, and program
accounts are executable so they are excluded from snapshots.

Made via @slopdotcash
