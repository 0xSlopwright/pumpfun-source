# claim_cashback at runtime

## Problem

`claim_cashback` is the pump-amm instruction that pays out a
user's accumulated cashback. Run 1 never covered this
instruction, and its behavior is only specified implicitly: how
much is moved, what the claimed counter does at the u64 edge,
whether the earned figure or the stored user field gates anything,
which token accounts are accepted, and which checks fire before
any transfer happens.

## Cases

All cases run on synthetic user-volume-accumulator fixtures
(accumulator PDA for the claiming user, funded vault token
account, empty destination token account) on a fresh VM per case
per image (original / #424 control / #427 candidate). The
instruction takes no arguments; its data is just the 8-byte
Anchor discriminator. The default fixture is vault 1000,
earned 11, claimed 13.

| label | setup | vault -> dest | claimed after | result |
| --- | --- | --- | --- | --- |
| base | vault 1000 | 1000 -> 0, dest +1000 | 1013 | success |
| amount-0 | vault 0 | 0 -> 0, dest +0 | 13 | success, no movement |
| amount-1e12 | vault 10^12 | 10^12 -> 0, dest +10^12 | 1,000,000,000,013 | success |
| claimed-maxm1-amount1 | claimed u64max-1, vault 1 | 1 -> 0, dest +1 | u64max | success, exact edge |
| claimed-max-amount1 | claimed u64max, vault 1 | 1 -> 1, dest +0 | u64max | 6023 Overflow, rollback |
| claimed-max-amount0 | claimed u64max, vault 0 | 0 -> 0, dest +0 | u64max | success, adding 0 |
| earned-max | earned u64max | 1000 -> 0, dest +1000 | 1013 | success, earned ignored |
| token22 | Token-2022 vault | 1000 -> 0, dest +1000 | 1013 | success |
| non-native-base | base-mint vault | 1000 -> 0, dest +1000 | 1013 | success |
| stored-other-user | accumulator stores another user | 1000 -> 0, dest +1000 | 1013 | success, stored user ignored |
| acc-len-89 | accumulator data 89 bytes | 1000 -> 1000, dest +0 | (unreadable) | 3003 AccountDidNotDeserialize |
| acc-len-90 | accumulator data 90 bytes | 1000 -> 0, dest +1000 | 1013 | success, 90 is enough |
| readonly-vault | vault read-only | 1000 -> 1000, dest +0 | 13 | 2000 ConstraintMut |
| wrong-acc | accumulator key replaced | 1000 -> 1000, dest +0 | 13 | 2006 ConstraintSeeds |
| wrong-vault | vault key replaced | 1000 -> 1000, dest +0 | 13 | 2009 ConstraintAssociated |
| wrong-dest | destination key replaced | 1000 -> 0, substituted +1000 | 1013 | success, dest not ATA-bound |

## Result

- The claim moves the ENTIRE vault balance, not a requested
  amount: there is no amount argument, and the vault always ends
  at 0 on success. `total_cashback_claimed` increases by exactly
  the moved amount, checked: claimed u64max with vault 1 fails
  6023 Overflow and rolls everything back, while claimed
  u64max-1 with vault 1 lands exactly on u64max and claimed
  u64max with vault 0 succeeds (adding 0).
- `cashback_earned` never gates the transfer (earned 0 and earned
  u64max behave identically); it is only reported in the emitted
  event. Likewise the stored `user` field inside the accumulator
  is not re-checked: an accumulator storing another user's key
  still claims fine, because the PDA seeds bind the account to
  the claiming user, not to the stored field.
- The accumulator deserializes at 90 bytes or more (89 fails
  3003, 90 succeeds), even though `extend_account` grows it to
  137 bytes: 90 is the serialized body size
  (8 discriminator + 32 user + 50 packed fields).
- Account binding is asymmetric: the vault IS associated-token
  bound (a substituted vault key fails 2009), but the
  destination is NOT: any token account with the matching mint
  and user authority accepts the claim, so a substituted
  destination key still receives the full amount.
- Token-2022 vaults and base-mint (non-native) vaults claim
  exactly like the default quote-mint SPL vault.
- Error sites, as reported in the transaction logs: the 6023
  Overflow is thrown in
  `instructions/token_incentives/claim.rs:228` on the original
  image and in `cashback.rs:36` on the control and candidate
  images (the recovered source places the handler in
  `cashback.rs`); 3003, 2000, 2006 and 2009 are `caused by
  account` errors (accumulator, vault token account,
  accumulator, vault token account respectively). Every error
  case rolls back all accounts except the payer's 5000-lamport
  fee.
- All three images agree on every case's error, amounts and
  claimed counter: this packet pins behavior, it does not claim
  a divergence between images. The only per-image difference is
  the logged file path of the 6023 site above.

## Limits

- Offline LiteSVM replay on synthetic fixtures only; no mainnet
  state, no source change, no build, and no whole-program
  equivalence claim.
- The vault and destination token accounts are pre-funded
  synthetically (vault rent included in its lamports); rent
  exemption of freshly created token accounts is not covered.
- The program account itself is executable and is excluded from
  snapshots; snapshots cover the user, accumulator, mint, token
  program, vault, destination, system and event accounts plus
  the fee payer.
