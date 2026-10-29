# admin_update_token_incentives, pinned at runtime

## Problem

`admin_update_token_incentives` (the admin updater for the global
volume accumulator: start/end time, seconds-per-day, day index, and
per-day token supply) was never covered by the first 50-packet run,
and the sibling claim packet (2nd #2) covers only the claim side.
The updater's validation order, zero-argument skipping, day-bucket
arithmetic, and panic paths are only implicit in
`programs/pump-amm/src/state/volume_accumulator.rs`
(`update_token_incentives`), so they need to be pinned at runtime.

## Cases

32 cases x 3 images (original / #424 control / #427 candidate) =
96 signed receipts. The fixture accumulator starts at
start=20, end=49, period=1, supplies all 1000, volumes all 100,
mint = 0xe2 x32, clock `now` = 10 unless a case overrides it.
All cases use the `pump_amm_incentives_differential` harness
(`admin_update_token_incentives` instruction).

Success cases (15):

- `base-reset`: new 30/59/1, day 0, supply 1000. Start changes
  20 -> 30, so both arrays reset to zero first; then
  supplies[0] = 1000, volumes all 0.
- `same-start-day5`: new 20/49/1, day 5, supply 2000. Start
  unchanged, so no reset: supplies[5] = 2000, rest 1000,
  volumes all 100.
- `range-boundary-day29`: new 30/59/1, day 29, supply 2000.
  29 = period*30 - 1 - (59 - 30) is the largest allowed range,
  so it succeeds: supplies[29] = 2000 after reset.
- `zero-skip`: new start 0 (end 59, period 2), day 0,
  supply 2000. The time block is skipped entirely, yet period
  becomes 2 and supplies[0] = 2000; start/end stay 20/49.
- `zero-both`: new 0/0/2, day 3, supply 2000. Same skip:
  period 2, supplies[3] = 2000, start/end unchanged.
- `period-0-supply-0`: new 0/0/0, supply 0. Succeeds and stores
  period 0; the supply block is skipped, so no `end_day()` call
  happens.
- `zero-volumes`: now 25, new 20/49/1, supply 0. now > start, so
  sol_volumes[current+1..=end] = volumes[6..29] are zeroed while
  volumes[0..5] stay 100 (current = (25-20)/1 = 5, end = 29).
- `fill-range`: new 0/0/1, day 30, supply 2000. day_number >= 30
  fills the whole current..=end range: all supplies 2000.
- `fill-from-current`: now 25, new 0/0/1, day 30, supply 2000.
  Fills supplies[5..29] = 2000; supplies[0..4] stay 1000.
- `supply-0-reset`: new 30/59/1, supply 0. Start change resets
  both arrays to zero and the supply block is skipped, so all
  supplies stay 0.
- `end-zero-only`: new 30/0/1, day 0, supply 2000. end == 0
  alone also skips the time block: start/end stay 20/49,
  supplies[0] = 2000.
- `missing-ata`: default new 30/59/1 with the global incentive
  token account missing. `init_if_needed` creates it: payer
  delta 2044280 = 5000 fee + 2039280 rent, created account
  holds 0 tokens owned by the accumulator PDA.
- `wrong-mint-stored`: stored mint replaced by a foreign key,
  new 0/0/1, supply 0. Succeeds and the stored mint becomes the
  call's mint (0xe2 x32) unconditionally.
- `token22`: Token-2022 program accounts, new 0/0/1, day 0,
  supply 2000. Succeeds; supplies[0] = 2000.
- `gva-len-544`: accumulator truncated to exactly 544 bytes
  (the struct size: 8 + 24 + 32 + 480). Succeeds, writes
  supplies[0] = 2000, and the account stays 544 bytes.

Error cases (17), all rolling back everything except the 5000
fee (the unsigned case is paid by OUTSIDER, not PAYER):

- `start-past` 6030 StartTimeInThePast (original
  volume_accumulator.rs:313; control/candidate :41):
  new start 5 <= now 10.
- `end-past` 6031 EndTimeInThePast (:327 / :46): new 30/5.
- `end-before-start` 6032 EndTimeBeforeStartTime (:329 / :47):
  new 30/30.
- `range-too-large` 6033 TimeRangeTooLarge (:331 / :48):
  new 30/60/1, since 29 < 60 - 30.
- `negative-period` 6033 TimeRangeTooLarge (:331 / :48):
  new 30/59/-1, since -31 < 29.
- `period-0-supply` ProgramFailedToComplete, panic
  "end_time should be bigger than start_time" (:387:14 /
  :84:14): period 0 with supply > 0 reaches `end_day()`,
  whose checked division by zero returns None.
- `stored-inverted` same panic (:387:14 / :84:14): stored
  start 49, end 20, zero args (time block skipped), supply > 0.
- `period-overflow` ProgramFailedToComplete, panic
  "Unexpected overflow" (:334:18 / :48:59): period 2^63-1,
  since period*30 overflows i64.
- `day-after-end` 6036 DayIndexAfterEndIndex (:263 / :72):
  period 2 gives end_day 14, day 15 is past it.
- `day-in-active` 6037 DayInActiveRange (:292 / :73): now 25
  gives current day 5, day 0 is already active.
- `finished-range` 6035 SupplyUpdateForFinishedRange
  (:251 / :62): now 60 > end 49 with supply > 0.
- `end-before-current-day` 6034 EndTimeBeforeCurrentDay
  (:352 / :56): now 25, new 20/26/10 gives current day 0 and
  end day 0, so end is not after current.
- `wrong-admin` 6005 InvalidAdmin (caused by account:
  global_config): config admin field replaced by a foreign key.
- `unsigned-admin` 3010 AccountNotSigner (caused by account:
  admin): the admin meta is unsigned; the fee payer becomes
  OUTSIDER.
- `readonly-gva` 2000 ConstraintMut (caused by account:
  global_volume_accumulator).
- `missing-gva` 3012 AccountNotInitialized (caused by account:
  global_volume_accumulator).
- `gva-len-543` 3003 AccountDidNotDeserialize (caused by
  account: global_volume_accumulator): 543 bytes is one short
  of the struct size.

## Result

All 32 cases agree across the original, #424 control, and #427
candidate images. This packet pins behavior; it does not claim a
divergence. Error codes are the Anchor codes (6000 + enum index);
error sites are recorded per image in the report because the
recovered sources log different line numbers than the deployed
binary (e.g. 6030 at :313 original vs :41 control/candidate).

## Limits

Offline LiteSVM synthetic accounts only (accumulator PDA,
fixture global config with admin = PAYER, funded 10^9 lamports,
fee 5000 per transaction). No source change, build, or
whole-program equivalence claim. Line numbers are log-based:
the checked-out `volume_accumulator.rs` layout differs from the
deployed binary's log paths, so only the original image's
numbers match the checked-out file. The clock is synthetic
(`now` per case, default 10). Claim-side behavior
(`claim_token_incentives`) is not covered here.
