# init/close_user_volume_accumulator at runtime

## Problem

`init_user_volume_accumulator` and `close_user_volume_accumulator`
are the pump-amm instructions that create and destroy a user's
volume accumulator PDA (seeds `["user_volume_accumulator", user]`).
Run 1 and 2nd-run packets #1-#9 never covered these two
instructions directly: only `claim_token_incentives` (#4) and
`extend_account` (#1) touched the accumulator account itself. How
much rent init charges, what init writes and rewrites, which
lengths deserialize, and what close returns were only implicit.

## Cases

All cases run on synthetic fixtures (accumulator PDA for the
user, funded payer/outsider) on a fresh VM per case per image
(original / #424 control / #427 candidate). Both instructions
take no arguments; their data is just the 8-byte Anchor
discriminator. The default accumulator fixture is discriminator +
user key + 97 `0x61` bytes (137 bytes), funded 10^9 lamports,
owned by the program (close/existing) or empty and unowned
(fresh init). `payer_delta` is after-minus-before for the
transaction fee payer (negative = charged).

| label | setup | result |
| --- | --- | --- |
| init-fresh | new account, prefund 0 | success: account 1,844,400 lamports, payer -1,849,400, data = discriminator + user + 97 zeros, 1 event |
| init-fresh-prefund1 | prefund 1 | success: account 1,844,400, payer -1,849,399 |
| init-fresh-prefund1m | prefund 10^6 | success: account 1,844,400, payer -849,400 |
| init-fresh-prefund1b | prefund 10^9 | success: account keeps 10^9 (no refund), payer -5,000 |
| init-fresh-user-outsider | user = outsider key | success: payer pays, user need not sign |
| init-fresh-user-default | user = default key | success |
| init-fresh-user-program | user = program key | success |
| init-existing | already-initialized 137-byte account | success, no-op: 10^9 kept, payer -5,000, data unchanged |
| init-existing-user-outsider | existing account storing outsider key | success: bytes 8..40 rewritten to payer, rest unchanged |
| init-existing-off41-max | existing, total_unclaimed = u64max | success: other fields preserved |
| init-pda | accumulator key replaced | 2006 ConstraintSeeds |
| init-readonly | accumulator read-only | PrivilegeEscalation (system CPI), payer -5,000 |
| init-payer-readonly | payer read-only, outsider fee payer | PrivilegeEscalation, outsider -10,000 (2 signers) |
| init-event | event authority replaced | 2006 ConstraintSeeds |
| init-program | program account replaced | MissingAccount, event line already emitted |
| init-existing-len0 | existing, 0 bytes | 3001 AccountDiscriminatorNotFound |
| init-existing-len8 | existing, 8 bytes | 3003 AccountDidNotDeserialize |
| init-existing-len90 | existing, 90 bytes | 2019 ConstraintSpace (Left: 137, Right: 90) |
| init-existing-len138 | existing, 138 bytes | 2019 ConstraintSpace (Left: 137, Right: 138) |
| init-existing-disc | existing, discriminator flipped | 3002 AccountDiscriminatorMismatch |
| close-base | 137-byte account, 10^9 | success: account removed, payer +999,995,000, 1 event |
| close-len90 | 90-byte account | success: same deltas |
| close-len138 | 138-byte account | success: same deltas |
| close-len0 | 0 bytes | 3001 AccountDiscriminatorNotFound |
| close-len8 | 8 bytes | 3003 AccountDidNotDeserialize |
| close-len89 | 89 bytes | 3003 AccountDidNotDeserialize |
| close-discriminator | discriminator flipped | 3002 AccountDiscriminatorMismatch |
| close-owner | owner = default | 3007 AccountOwnedByWrongProgram |
| close-pda | accumulator key replaced | 2006 ConstraintSeeds |
| close-readonly | accumulator read-only | 2000 ConstraintMut |
| close-unsigned | user unsigned, outsider fee payer | 3010 AccountNotSigner, outsider -5,000 |
| close-event | event authority replaced | 2006 ConstraintSeeds |
| close-program | program account replaced | MissingAccount, event line already emitted |
| close-stored-user | stored user = outsider | success: stored user not re-checked |
| close-off40-bool2 | needs_claim = 2 | 3003 AccountDidNotDeserialize |
| close-off73-bool2 | has_total_claimed_tokens = 2 | 3003 AccountDidNotDeserialize |
| close-off41-max | total_unclaimed = u64max | success: totals don't gate close |
| close-off82-max | total_cashback_claimed = u64max | success |
| close-lamports1 | account holds 1 lamport | success: payer -4,999 |
| close-lamports-rent | account holds 1,844,400 | success: payer +1,839,400 |

## Result

- Fresh init creates exactly the 137-byte account with 1,844,400
  lamports of rent (265 bytes x 6960 lamports per byte-year
  equivalent), paid by the payer on top of the 5000 fee. The
  payer tops up only the shortfall: prefund 1 costs 1,844,399
  plus fee, prefund 10^6 costs 844,400 plus fee, and an
  already rent-exempt prefund of 10^9 is kept in full -- init
  never refunds excess.
- The init handler writes only the `user` field. Fresh data is
  discriminator + user + 97 zero bytes. Re-init of an existing
  account rewrites bytes 8..40 to the user key and leaves every
  other byte untouched, including the `0x61` tail past the
  90-byte serialized body -- even a stored other-user key is
  overwritten, since the PDA seeds, not the stored field, bind
  the account.
- The user need not sign init: the user meta is read-only and
  non-signer, so init for an outsider, default, or program key
  succeeds with the payer paying.
- Re-init of an existing account is strict in two stages: it
  must deserialize (>= 90 bytes: below 8 bytes is 3001
  AccountDiscriminatorNotFound, 8..89 bytes is 3003
  AccountDidNotDeserialize, a flipped discriminator is 3002)
  AND be exactly 137 bytes (90/136/138 bytes fail 2019
  ConstraintSpace, Left: 137, Right: actual). Close is strict
  only about deserialization: it succeeds at 90, 137 and 138
  bytes alike, and only fails below 90 bytes (3001 under 8,
  3003 at 8..89).
- Close returns the FULL balance to the user (`close = user`):
  10^9 lamports becomes payer +999,995,000 after the 5000 fee,
  1 lamport becomes -4,999, rent-exempt 1,844,400 becomes
  +1,839,400, and the account is removed. The u64 totals only
  feed the emitted event: u64max totals close fine, while a
  bool field set to 2 fails deserialization (3003) -- Borsh
  bools accept only 0/1.
- The stored `user` field is not re-checked on either path:
  close of an account storing another user's key succeeds,
  because the PDA seeds bind the account to the closing user.
- Binding errors, as reported in the transaction logs:
  non-PDA accumulator or event authority fails 2006
  ConstraintSeeds; read-only accumulator on close fails 2000
  ConstraintMut, while read-only accumulator or payer on init
  fails at the system CPI with PrivilegeEscalation ("writable
  privilege escalated") -- the read-only-payer case still
  charges the 2-signer fee of 10000; unsigned user on close
  fails 3010 AccountNotSigner (fee payer outsider pays 5000);
  non-program owner on close fails 3007
  AccountOwnedByWrongProgram; a substituted program account
  fails MissingAccount ("An account required by the
  instruction is missing") on both instructions, with the
  event log line already emitted before the failure. Every
  error case rolls back all accounts except the fee payer's
  fee.
- All three images agree on every case's error, amounts, data
  and events: this packet pins behavior, it does not claim a
  divergence between images.

## Limits

Offline LiteSVM synthetic accounts only (payer/outsider keys
from fixed seeds, accumulator PDA for the fixture user). No
source change, build, or whole-program equivalence claim.
Inner instructions are not captured (the only CPI is the
system create-account on init). The close event's reported
totals are covered only through the account-removal and
payer-delta checks, not by decoding the event payload.
