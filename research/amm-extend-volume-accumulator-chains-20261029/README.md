# research: pin extend_account chained into the user volume accumulator lifecycle

## Problem

2nd #1 pinned extend_account in isolation (fresh VM per case,
synthetic program-owned accounts: target sizes, rent delta
(target-current)*6960, body preservation, no-op at/above target,
6027/2004/2000/3010/101 gates) and 3rd #1 pinned the close lifecycle
on 137-byte seeded accumulators, but no packet ever chained them:
what does an extended accumulator actually do afterwards -- does a
90-byte account extended to 137 keep its claimable fields, does its
close refund the extended rent or the seeded balance, does a
truncated 50-byte account's field layout survive the zero-filled
tail, and can a failed extend (missing account, unsigned user,
read-only target) be followed by a successful one in the same chain?

This packet answers all four with executed chains on the original,
control (#424), and candidate (#427) images, which agree on every
step. It pins behaviour; it does not claim a defect. Where a step
fails, the failure is the pinned behaviour (a gate that survives
into the chain), with full rollback and the chain recovering
afterwards where the case says so.

## Cases

Fixture (per case, fresh VM per image): global volume accumulator
(start 20, end 49, period 1, supplies 1000x30, volumes 100x30),
incentive mint, vault 10^9, user ATA 17, seeded user accumulator
(needs 1, unclaimed 500, claimed 700, volume 20, last 10, has 1,
cashback 55, cashback_claimed 13; the reward case seeds last 20).
The accumulator is seeded at a chosen byte length and lamport
balance so the extend rent math is observable. Fee payer is the
user unless a step says otherwise. 10 cases, 32 steps, 96 receipts
(32 x 3 images), 10 parts (9 x 10 + 6).

- x-extend90-claim-close: 90-byte account at its 90-byte
  rent-exempt 1,517,280 -> extend -> claim at now=10 -> close.
- x-extend90-close-claim-init-claim21: extend -> close -> claim
  (fails) -> re-init -> claim at now=21 (zero claim, stamps last).
- x-extend137-sync-close: at-target 137-byte account -> extend
  (no-op) -> sync at now=10 -> close.
- x-extend138-reward-claim-close: above-target 138-byte account,
  reward seed (last 20) -> extend (no-op) -> claim at now=21 ->
  close.
- x-extend50-claim-close: 50-byte truncated account at 10^9 ->
  extend -> claim at now=10 -> close.
- x-extend50-close: 50-byte truncated account -> extend -> close
  directly (close event reports the truncated layout).
- x-close-extend-init-extend: close -> extend on the missing
  account (fails) -> re-init -> extend on the fresh account
  (no-op).
- x-extend-unsigned-then-signed-close: extend with unsigned user
  (fails, fee payer PAYER) -> signed extend -> close.
- x-extend-readonly-then-signed-claim: extend with read-only
  target (fails) -> signed extend -> claim at now=10.
- x-extend-twice-close: extend -> extend again (no-op) -> close.

## Result

All 10 cases pass on all three images with byte-identical observed
surfaces (steps, errors, event counts, snapshots). Measured values:

- Extend 90 -> 137 preserves every field byte-for-byte and tops
  the balance up to the 137-byte rent-exempt 1,844,400 (payer
  -332,120 = 5,000 fee + 47*6960 rent delta), emitting one
  96-byte ExtendAccount event (disc 6161d7905d92167c, timestamp
  10, account, user, old size 90, new size 137). The extended
  account then claims, syncs, and closes exactly like a natively
  seeded 137-byte account: claim at now=10 pays the 500 unclaimed
  (vault 999,999,500, user ATA 517, claimed 500), close refunds
  1,839,400 (1,844,400 - 5,000) with a close event reporting the
  post-claim fields (unc 0, claimed 500, vol 20, last 10).
- Extend at target (137) and above target (138) are silent
  no-ops: 0 events, payer -5,000 only, fields and balance
  untouched; the following sync/claim/close chains run
  identically (sync resets claimed 700 -> 0, reward claim at
  now=21 pays 700 for claimed 1400, vol 0, last 21).
- Extend 50 -> 137 rewrites the truncated field layout: the
  50-byte account holds needs + full unclaimed (500) + only the
  low byte of claimed (700 = 0x02BC -> 188), and the zero-filled
  tail zeroes volume, last, has, cashback, cashback_claimed.
  The following claim at now=10 still pays the full 500
  (claimed 188 -> 500, needs 1 -> 0, has 0 -> 1) and the close
  after it refunds the extended balance. Closing directly after
  the extend reports the truncated layout in the close event
  (unc 500, claimed 188, vol 0, last 0).
- Extend of a missing account (after a close) fails 2004
  ConstraintOwner (caused by account: account), not 3012: the
  missing account's default owner fails the program-owner check
  before any existence check. Full rollback, fee payer -5,000.
  A re-init after it creates a fresh 137-byte account, and a
  further extend on that fresh account is a silent no-op.
- Extend with an unsigned user fails 3010 AccountNotSigner
  (caused by account: user), fee payer PAYER -5,000, account
  still 90 bytes; the signed extend right after it succeeds and
  the chain closes normally. Extend with a read-only target
  fails 2000 ConstraintMut (caused by account: account), same
  recovery (signed extend, then claim pays 500).
- Extend twice: the second extend is a silent no-op (0 events,
  -5,000), proving the first extend already reached target.
- Close refunds are balance-driven, not size-driven: a prefunded
  extended account (10^9 + 605,520 after a 50-byte extend) closes
  for 1,000,600,520, while a rent-exact extended account closes
  for 1,839,400. The close event always reports the live fields.

All 10 cases, 96 receipts, 10 parts: the original, control, and
candidate images agree on every step -- deltas, pool state,
accumulator state, decoded events, error codes, and rollback.

## Limits

- Only the user volume accumulator is extended in chains; pool,
  global config, and global volume accumulator extends were pinned
  in isolation in 2nd #1 and are not re-chained here.
- The cashback claim after an extend was not chained: the
  incentives-harness cashback key binding passes the accumulator
  itself as the wsol token account and fails 3007 before reaching
  program logic, so no cashback-after-extend behaviour is pinned
  here (the 3rd #2 cashback chains used the liquidity harness).
- Only the seeded field layout above is used; other unclaimed /
  claimed / volume combinations were not extended here.
- No source change, no build, and no whole-program equivalence
  is claimed: this packet pins executed behaviour on three
  images only.

## Reproduction

```
python3 verify.py
```

Expected output:

```
PASS: 10 cases, 96 receipts, 10 parts, 3 images agree (signatures, deltas, events, error codes/sites, rollback)
```
