# research: pin admin authority rotation and global-config extension

## Problem

Three admin instructions were never pinned as state transitions:
`update_admin`, `set_boost_authority`, and
`update_creator_fee_config`. Earlier packets covered has_one
authorization checks (1st #23) and `update_fee_config` fee values
(1st #27), but not what a rotation actually writes, whether
rotations compose into chains, whether the new admin / new
authority keys are validated at all, or how the
`extend_global_config` realloc path behaves when the config
account is short. This packet pins all of that.

## Cases

37 cases, each run on 3 images (original / #424 control / #427
candidate), 129 signed receipts in 13 parts (12 parts of 10
plus a final part of 9; see `runtime/report.json.gz` for the
exact part list). Fresh LiteSVM per case per image. The config
fixture is the captured mainnet GlobalConfig snapshot with its
admin field set to the test payer; the payer is funded with
10^12 lamports and every transaction costs the usual 5,000 fee
unless a top-up applies.

`update_admin` (16 cases: 13 singles + 3 three-step chains):
rotate to outsider / program id / event authority / the config
key itself / self / an unfunded random key; outsider signer;
unsigned admin; readonly config; wrong config owner; truncated
config at 907 and 948 bytes; truncated config at 906 bytes;
rotate-then-disable chain; rotate-to-default brick chain;
rotate-out-and-back round-trip chain.

`set_boost_authority` (11 cases): to outsider / default /
unfunded; outsider signer; unsigned admin; readonly config;
wrong config owner; truncated config at 907 and 906 bytes;
truncated 948-byte config with only 100 lamports (top-up);
full 949-byte config with only 100 lamports (no top-up).

`update_creator_fee_config` (10 cases): configurable false with
max 0; true with max 10000; true with max u64::MAX; bool byte 2;
empty args; trailing arg byte; outsider signer; wrong config
owner; truncated config at 907 bytes; truncated 948-byte config
with only 100 lamports (top-up).

## Result

- `update_admin` writes only bytes 8..40 and emits an 80-byte
  UpdateAdminEvent (timestamp i64, old admin, new admin). Any
  key at all is accepted as the new admin -- program id, event
  authority, the config key itself, the current admin, and an
  unfunded random key all succeed -- because `new_admin` is a
  CHECK-only AccountInfo.
- Rotation chains compose. After rotating payer -> outsider,
  the old admin's `disable` fails 6005 InvalidAdmin while the
  new admin's `disable` succeeds (flags 0 -> 1, 53-byte
  DisableEvent). Rotating back restores the old admin
  (round-trip, flags 0 -> 2).
- Rotating to the default pubkey bricks admin control: nobody
  can sign as the default key, so later `disable` and
  `set_boost_authority` calls by the old admin both fail 6005.
- `set_boost_authority` writes only bytes 907..939 and emits a
  112-byte SetBoostAuthorityEvent (timestamp, admin, old, new).
  The new authority is likewise unvalidated: default and
  unfunded keys succeed.
- `update_creator_fee_config` writes only byte 940
  (configurable) and bytes 941..949 (max) and emits a 57-byte
  UpdateCreatorFeeConfigEvent. `max_configurable_creator_fee_bps`
  has NO upper bound: 10000 and u64::MAX both succeed, unlike
  the fee-basis-points setters which cap at 1000. A bool byte
  of 2, or missing args, fails 102
  InstructionDidNotDeserialize; a trailing arg byte is ignored
  and the write still succeeds.
- Error map (all with caused-by site lines, all fully rolled
  back, payer cost 5,000): outsider signer -> 6005 InvalidAdmin
  (caused by account: global_config); unsigned admin -> 3010
  AccountNotSigner (caused by account: admin); readonly config
  -> 2000 ConstraintMut (caused by account: global_config);
  wrong config owner -> 3007 AccountOwnedByWrongProgram
  (caused by account: global_config).
- Extension asymmetry (the sharpest pin):
  `extend_global_config` reallocs a short config to 949 bytes,
  but only for the plain `Account` instructions. At exactly
  907 bytes (the end of buyback_basis_points, data 899..907)
  `set_boost_authority` and `update_creator_fee_config`
  SUCCEED and realloc to 949 with a zero-filled tail, while
  `update_admin` FAILS with BorshIoError ("failed to write
  whole buffer", caused by account: global_config) -- but
  only at write-back: the handler itself runs, the
  UpdateAdminEvent CPI succeeds and the event log survives,
  and only then does the 949-byte struct fail to fit back
  into the short account, so the transaction fails and the
  state rolls back. The emitted event is a ghost: it records
  a rotation that never landed. The same ghost appears at
  948 bytes (one byte short). At 906 bytes or less all three
  instructions fail with InvalidAccountData before any
  handler runs (no event). The 907 boundary is exact: 906
  fails, 907 succeeds (for the `Account` instructions).
- Extension economics: when the short config is underfunded
  (100 lamports, 948 bytes), the top-up is exact: config
  lamports 100 -> 7,495,920 (= rent for 949 bytes: 890,880 +
  6,960 x 949) and the payer pays 7,500,820 (top-up 7,495,820
  + 5,000 fee) -- even for `set_boost_authority`, whose admin
  account is NOT marked mut. When the config is already 949
  bytes, no top-up happens even if it holds only 100
  lamports: the handler never checks rent on a full-size
  config.
- All 3 images agree on every case-step. This packet pins
  behavior; it does not claim a divergence.

## Limits

Offline LiteSVM synthetic fixtures only. No source change,
build, or whole-program equivalence claim. Event timestamps
are 0 (default LiteSVM clock). The ghost-event observation is
about log retention on failed transactions, not about any
on-chain event index: a failed transaction's logs are not
consensus-visible state, and only the rolled-back account
state is authoritative.

## Retained receipt counts

The raw `counts.vms` and per-receipt `vm` fields are execution/receipt ordinals. This packet covers 111 fixture/image scenarios and 129 signed executions, because its chained scenarios submit multiple transactions in the same VM. The producer and raw receipts remain unchanged; no separate count of runtime VM constructor calls is claimed.

The retained source fingerprints identify the historical AMM source archived at `repro/pump_amm/v2-mint-clone-recovery-20261028/results/canonical-source`. Verification reads that exact snapshot, including the former `cashback.rs`; each recorded hash stays mandatory. Runtime uses the three explicitly pinned historical executable images. This packet does not compile or qualify the current maintained AMM source.
