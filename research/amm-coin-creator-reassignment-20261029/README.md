# Coin-creator reassignment: set_coin_creator + migrate_pool_coin_creator

## Problem

`set_coin_creator` and `migrate_pool_coin_creator` are the one
instruction family the first 50-packet run and 2nd-run packets #1-#8
never touched. Both reassign a pool's `coin_creator`, but through
different authorities: `set_coin_creator` reads it from a Metaplex
metadata account or a Pump bonding curve, while
`migrate_pool_coin_creator` copies the sharing-config PDA key itself.
Their gates, precedence rules, and account layouts are only implicit,
so they are pinned here at runtime.

## Setup

- Fixture pool `GseMAnNDvntR5uFePZ51yZBXzNSn7GdFPkfHwfr6d77J` (300
  bytes). Its creator already equals the pool-authority PDA
  `9XDYTfQKwW8sHPqnFdUreMmtmffmkHVPGTNV2e3LKxNW` (seeds
  `[b"pool-authority", base_mint]`, Pump program
  `6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P`), so the canonical-pool
  gate passes without mutation. Fixture `creator_fees` is zeroed for
  every case except `mig-unswept`.
- Metadata PDA `DmwqzAppxfZoXLB3CXRxMxMWTkG2DSWeMfup9JBg7Kzx` (seeds
  `[b"metadata", metadata_program, base_mint]`, metadata program
  `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`).
- Bonding-curve PDA `3MUkKMbuornHohtAtzrToSzqkj1gEEhQqYVz8sZnmQg1`
  (seeds `[b"bonding-curve", base_mint]`, Pump program).
- Sharing-config PDA `1XVkGUKWHkGEnvhwiHMtTgwjs1RkdjahTMnSwrqop5D`
  (seeds `[b"sharing-config", base_mint]`, Fees program
  `pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ`).
- Metadata layout used: key byte, update_authority, mint, name /
  symbol / uri strings, seller_fee_basis_points (u16), creators
  `Option<Vec<{address, verified, share}>>`, collection None, uses
  None, primary_sale_happened, is_mutable, edition_nonce None,
  token_standard None, collection_details None.
- Bonding-curve layout used (83 bytes): discriminator
  `(23, 183, 248, 55, 96, 216, 172, 96)`, five u64 reserves/supply,
  complete, creator @49..81, is_mayhem_mode @81, is_cashback_coin @82.
- SharingConfig layout used (from the pump_fees IDL): discriminator
  `(216, 74, 9, 0, 56, 140, 93, 75)`, bump @8, version @9, status @10
  (0 Paused, 1 Active), mint @11..43, admin @43..75, admin_revoked
  @75, shareholders vec @76 (each entry: address + u16 share_bps).
- 36 cases x 3 images (original / #424 control / #427 candidate) =
  108 signed receipts. Every case charges the payer exactly 5,000
  lamports (fee only, no rent movement).

## Cases

set_coin_creator (21): metaplex first-creator, bonding-curve fallback,
bonding-curve with a short metadata account (no collection_details),
already-set no-op, noncanonical pool creator, metadata wrong PDA,
metadata wrong owner, bonding-curve wrong PDA, bonding-curve wrong
owner, empty metadata, metadata key 0 / 1 / 2 / 9, empty creators vec,
read-only pool, flipped pool discriminator, trailing instruction
data, noncanonical pool + wrong metadata PDA (ordering), pool
truncated to 100 bytes, empty pool.

migrate_pool_coin_creator (15): success, success with Paused status,
success with admin_revoked=1, success with a non-empty shareholders
list, holder-reward pool, unswept creator_fees, wrong sharing mint,
wrong sharing admin, wrong sharing PDA, wrong sharing owner,
read-only pool, flipped pool discriminator, discriminator-only
sharing config, empty sharing config, bad mint + holder-reward pool
(ordering).

## Result

set_coin_creator:

- creators `[0x11, 0x22]` sets `coin_creator` to the FIRST creator
  (0x11), not the last, and emits one event. creators None falls
  back to the bonding-curve creator (0x33), also with one event. A
  metadata account without the trailing collection_details field
  still deserializes: trailing optional fields are leniently ignored.
- A pool whose `coin_creator` is already set succeeds as a no-op:
  state unchanged, zero events, log "Pool has coin_creator already
  set".
- A noncanonical pool creator fails 6028
  OnlyCanonicalPumpPoolsCanHaveCoinCreator (deployed log site
  `set_coin_creator.rs:63`).
- Wrong metadata / bonding-curve PDA keys fail 2006 ConstraintSeeds;
  wrong owners fail 3007 AccountOwnedByWrongProgram; a read-only pool
  fails 2000 ConstraintMut; a flipped pool discriminator fails
  InvalidAccountData (17179869184).
- The metadata key byte must be exactly 4 (MetadataV1): 0, 1, 2 and
  9 all fail BorshIoError DataTypeMismatch (64424509440) on
  metadata, and an empty metadata account fails the same way.
- creators `Some([])` does not error cleanly: `creators[0]` panics
  and the transaction fails ProgramFailedToComplete with no error
  site line.
- Trailing instruction data after the discriminator is ignored
  (success, same state and event).
- Account-deserialization checks run before the handler: a
  noncanonical pool combined with a wrong metadata PDA fails 2006,
  not 6028.
- A pool truncated to 100 bytes, and an empty pool, both fail
  InvalidAccountData (17179869184) -- the Pool deserializer reports
  any short data as InvalidAccountData, unlike SharingConfig's (see
  below).

migrate_pool_coin_creator:

- Success sets `pool.coin_creator` to the sharing-config PDA key
  itself (`1XVkGUKWHkGEnvhwiHMtTgwjs1RkdjahTMnSwrqop5D`) with one
  event. A Paused status, admin_revoked=1, and a non-empty
  shareholders list are all ignored (success unchanged) -- the
  handler reads only mint and admin.
- A holder-reward pool fails 6074 HolderRewardCreatorImmutable
  (deployed log site `migrate_pool_coin_creator.rs:52`); unswept
  creator_fees fail 6081 CreatorFeesNotSwept (`:59`).
- Sharing mint != pool base fails 6045 InvalidSharingConfigBaseMint;
  sharing admin != pool coin_creator fails 6046
  InvalidSharingConfigCoinCreator; wrong PDA key fails 2006; wrong
  owner fails 3007; read-only pool fails 2000; flipped pool
  discriminator fails InvalidAccountData.
- A discriminator-only sharing config fails 3003
  AccountDidNotDeserialize; an empty one fails 3001
  AccountDiscriminatorNotFound -- the SharingConfig deserializer
  distinguishes truncated from empty, where the Pool deserializer
  does not.
- Constraint checks run before the handler: bad mint combined with a
  holder-reward pool fails 6045, not 6074.

All three images agree on every case: error strings, pool state
after, event logs, and error sites (up to line numbers, which differ
between the original and the rebuilt images). This packet pins
behavior; it does not claim a divergence.

## Limits

- Offline LiteSVM synthetic accounts only. No source change, build,
  or whole-program equivalence claim.
- The deployed log paths (`programs/pump-amm/src/...:63`, `:52`,
  `:59`) come from the deployed binary's build, not from the sparse
  reconstruction in this repo (whose `set_coin_creator.rs` is 17
  lines); line numbers are cited as observed from the deployed
  binary.
- `admin_cto_pool` is NOT covered here. It takes the pool-authority
  PDA as a Signer account, so no directly signed transaction can
  pass LiteSVM signature verification: every direct call fails
  SignatureFailure before the program runs, and the PDA signature is
  only producible by a Pump CPI. It is therefore not packetizable
  under the signed-receipt standard and is recorded as a negative
  result, not a case.
- The metadata and bonding-curve accounts are synthesized from the
  public Metaplex and Pump layouts (key byte 4, 83-byte curve); the
  success cases confirm the deployed binary accepts exactly these
  layouts, but no real mainnet metadata or curve account is replayed.
- The already-set no-op path returns before reading creators, but
  Anchor still deserializes the metadata account first: an
  already-set pool with an invalid metadata account would fail at
  deserialization, not succeed. That combination is not a case here.

Made via @slopdotcash

The saved receipts authenticate the exact prior Pump IDL retained at `inputs/pump.json`. The maintained-source promotion changed the live file, so the verifier binds this historical schema separately. The producer only hashes that IDL as report metadata; its fixture construction uses the frozen byte layouts and the unchanged AMM instruction IDL. No current-source claim is made for the retained schema.
