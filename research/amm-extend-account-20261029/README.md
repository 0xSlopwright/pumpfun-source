# extend_account at runtime

## Problem

`extend_account` is the pump-amm instruction that grows a truncated
program-owned account to its full size, funding the rent delta from
the calling user. Run 1 never covered this instruction, and its
behavior is only specified implicitly: which account types are
recognized, what the exact target sizes are, what the rent delta is,
and which checks fire before any realloc happens.

## Cases

All cases run on synthetic program-owned accounts (target key
`0x5b` repeated 32 times) funded with 10^9 lamports, on a fresh VM
per case per image (original / #424 control / #427 candidate).
The instruction takes no arguments; its data is just the 8-byte
Anchor discriminator.

| label | account kind | size before -> after | lamports after | result |
| --- | --- | --- | --- | --- |
| pool-truncated-8 | Pool | 8 -> 301 | 1,002,039,280 | extended |
| pool-truncated-300 | Pool | 300 -> 301 | 1,000,006,960 | extended |
| pool-at-target | Pool | 301 -> 301 | 1,000,000,000 | no-op success |
| pool-above-target | Pool | 302 -> 302 | 1,000,000,000 | no-op success |
| config-truncated-100 | GlobalConfig | 100 -> 949 | 1,005,909,040 | extended |
| config-at-target | GlobalConfig | 949 -> 949 | 1,000,000,000 | no-op success |
| useracc-truncated-50 | UserVolumeAccumulator | 50 -> 137 | 1,000,605,520 | extended |
| globalvol-truncated-100 | GlobalVolumeAccumulator | 100 -> 600 | 1,003,480,000 | extended |
| globalvol-at-target | GlobalVolumeAccumulator | 600 -> 600 | 1,000,000,000 | no-op success |
| feeconfig-unknown | FeeConfig | 100 -> 100 | 1,000,000,000 | 6027 AccountTypeNotSupported |
| sharing-unknown | SharingConfig | 100 -> 100 | 1,000,000,000 | 6027 AccountTypeNotSupported |
| pool-short-7 | Pool | 7 -> 7 | 1,000,000,000 | 6027 AccountTypeNotSupported |
| pool-empty-0 | Pool | 0 -> 0 | 1,000,000,000 | 6027 AccountTypeNotSupported |
| pool-owner-token | Pool (TOKEN-owned) | 100 -> 100 | 1,000,000,000 | 2004 ConstraintOwner |
| pool-readonly | Pool (read-only) | 100 -> 100 | 1,000,000,000 | 2000 ConstraintMut |
| pool-unsigned | Pool (unsigned user) | 8 -> 8 | 1,000,000,000 | 3010 AccountNotSigner |
| pool-payload-4 | Pool (4-byte instruction data) | 8 -> 8 | 1,000,000,000 | 101 InstructionFallbackNotFound |
| pool-body-preserved | Pool, body `ff` x16 at offset 8 | 50 -> 301 | 1,001,746,960 | extended, body kept, tail zero |

## Result

- Four discriminators extend, each to one target size: Pool -> 301, GlobalConfig -> 949, UserVolumeAccumulator ->
  137, GlobalVolumeAccumulator -> 600. FeeConfig and SharingConfig discriminators are rejected with 6027
  (BondingCurve and other discriminators are not executed here), as is any
  account data shorter than 8 bytes (the discriminator cannot be
  read).
- The rent delta is exactly `(target - current) * 6960` lamports,
  paid by the user: Pool 8 -> 301 costs 2,039,280; 300 -> 301 costs
  6,960; GlobalConfig 100 -> 949 costs 5,909,040;
  UserVolumeAccumulator 50 -> 137 costs 605,520;
  GlobalVolumeAccumulator 100 -> 600 costs 3,480,000. The
  transaction fee (5000 lamports) is separate.
- An account already at or above its target succeeds with no size
  or lamport change.
- Realloc preserves the existing body bytes and zero-fills the new
  tail (pool-body-preserved: bytes 8..24 stay `ff`, bytes 24..301
  are zero).
- Error sites, as reported in the transaction logs: 6027 for short
  data is thrown in `extend_account.rs:91`, 6027 for an unrecognized
  discriminator in `extend_account.rs:114`; 2004, 2000 and 3010 are
  `caused by account` errors (account, account, user
  respectively); 101 has the generic `AnchorError occurred.` form
  with no site. Every error case rolls back all accounts except
  the payer's 5000-lamport fee.
- All three images agree on every case: this packet pins behavior,
  it does not claim a divergence between images.

## Limits

- `producer.py` generated these receipts on the author's machine; as
  committed it expects a checkout at `~/workspace/pumpfun-sparse` and
  the #424/#427 images in `~/workspace/slop-verify`, so it does not run
  from this packet unmodified. `verify.py` reads the same two images
  from their repository packets.
- Offline LiteSVM replay on synthetic accounts only; no mainnet
  state, no source change, no build, and no whole-program
  equivalence claim.
- The sparse checkout's `extend.rs` layout differs from the
  deployed binary's logged path (`instructions/extend_account.rs`),
  so the line numbers above are log-reported only.
- Targets are funded with 10^9 lamports; zero-balance targets are
  not covered. The program account itself is executable and is
  excluded from snapshots; snapshots cover the target, the user
  and the event authority accounts.
