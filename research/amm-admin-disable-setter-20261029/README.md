# PumpSwap admin `disable`: setter semantics and all five downstream gates

## Problem

Every earlier packet only ever PATCHED `disable_flags` directly into
the fixture: 1st-run trade-disable-flags pinned buy 6020 / sell 6021,
1st-run liquidity-disable-flags pinned deposit 6018 / withdraw 6019,
and 2nd-run #27 used `disable` once as a probe after an admin
rotation (flags 0 -> 1, 53-byte DisableEvent). Nobody pinned what
the `disable` instruction itself does: which byte it writes, whether
it preserves the high bits, how its five bools map to bits, its
event layout, its argument validation, its truncation boundary, its
authorization map, or a chained setter -> gated-instruction proof
for every one of the five gates. The create gate (6017) had never
been chained at all.

## Cases

26 cases across 3 historical images (original / #424 control / #427 candidate),
111 signed executions and receipts, independently verified by verify.py (PASS).
The producer constructs 78 VM instances: 63 fresh family-A VMs and 15 chained
family-B VMs. The retained `counts.vms` and per-receipt `vm` fields are receipt
sequence labels, not a count of distinct constructed VMs.

Family A (admin-only VM, 21 cases, 1 step each): the setter alone.
Family B (chained VMs, 5 cases): disable, then the gated
instruction, then the ungated sibling (create chain: disable,
failed create, re-enable, successful create).

| Case | Result |
| --- | --- |
| dis-all-false | flags 0 -> 0, event all false |
| dis-all-true | flags 0 -> 31, event all true |
| dis-create-only / deposit-only / withdraw-only / buy-only / sell-only | flags 1 / 2 / 4 / 8 / 16, only byte 56 differs |
| dis-preset224-false / dis-preset224-true | 224 -> 224 / 224 -> 255 (bits 5..7 preserved) |
| dis-preset31-false | 31 -> 0 |
| dis-bool2 | byte 2 in a bool -> 102 InstructionDidNotDeserialize, 0 events, rollback |
| dis-args-empty / dis-args-4bytes | 102, 0 events, rollback |
| dis-trailing | trailing byte ignored, flags 0 -> 1, event normal |
| dis-trunc-906 | InvalidAccountData before the handler, 0 events |
| dis-trunc-907 / dis-trunc-948 | BorshIoError("failed to write whole buffer"), state rolled back, DisableEvent left as a ghost in the log |
| dis-outsider | 6005 InvalidAdmin (caused by account: global_config) |
| dis-unsigned | 3010 AccountNotSigner (caused by account: admin) |
| dis-readonly | 2000 ConstraintMut (caused by account: global_config) |
| dis-wrongowner | 3007 AccountOwnedByWrongProgram (caused by account: global_config) |
| chain-buy-gate | disable buy -> buy_v2 10^6 fails 6020 DisabledBuy, sell_v2 10^6 succeeds at anchor deltas |
| chain-sell-gate | disable sell -> sell_v2 fails 6021 DisabledSell, buy_v2 succeeds at anchor deltas |
| chain-deposit-gate | disable deposit -> deposit 10^9 LP fails 6018 DisabledDeposit, withdraw 10^9 succeeds at anchor deltas |
| chain-withdraw-gate | disable withdraw -> withdraw fails 6019 DisabledWithdraw, deposit succeeds at anchor deltas |
| chain-create-gate | disable create -> create_pool fails 6017 DisabledCreatePool (no pool / LP mint / user LP created), re-enable -> create succeeds (init 1009, lp_out 909) |

## Result

- **Bit map, exactly**: create -> bit 0, deposit -> bit 1,
  withdraw -> bit 2, buy -> bit 3, sell -> bit 4, each written
  as `(flags & !bit) | (bool << shift)`. Only byte 56 of the
  949-byte config ever differs. Bits 5..7 are never touched:
  preset 224 survives an all-false call byte-identical and
  becomes 255 under an all-true call.
- **Event**: exactly 1 DisableEvent per successful call, 53
  bytes, discriminator 6bfdc14ce4ca1b68 =
  sha256("event:DisableEvent")[:8]: timestamp @8..16, admin
  (the signer) @16..48, five bools @48..53 echoing the
  instruction arguments. Family A runs on the default LiteSVM
  clock (timestamp 0); family B chains run at clock timestamp
  1234567890 and the event echoes that.
- **Arguments**: five Borsh bools. The tested invalid byte 2
  in the first bool, or fewer than five bytes (empty, 4 bytes),
  fails 102 InstructionDidNotDeserialize before any state
  change, with 0 events and full rollback. A trailing byte is
  ignored and the write succeeds.
- **Truncation boundary**: 906 bytes -> InvalidAccountData
  before the handler runs, 0 events. 907 and 948 bytes ->
  BorshIoError("failed to write whole buffer", caused by
  account: global_config) at write-back: the handler already
  ran, so the DisableEvent stays in the log as a ghost while
  the config itself rolls back — the #27 update_admin pattern,
  here for a different setter. The setter has no extend path.
- **Authorization** (the shared AdminGlobal map): outside
  signer 6005, unsigned admin 3010, read-only config 2000,
  wrong-owner config 3007, all fully rolled back, payer 5,000.
- **Downstream binding** (chained, per gate): disable buy ->
  buy_v2 6020 with full rollback and payer 5,000 only, while
  sell_v2 in the same VM still succeeds (user +9,878, vault
  quote -9,933, buyback +55, payer 1,849,400, 1 event, pool
  deltas (-56, +56, 0)); disable sell -> sell_v2 6021, buy_v2
  still succeeds (user base +10^6, user quote -10,124, vault
  quote +10,068, buyback +56, payer 1,849,400, event
  (10001, 10, 11, 111, 112, 10012, 10124)); disable deposit ->
  deposit 6018, withdraw still succeeds (user base
  +160,619,895,223, quote +29,312,439, LP -10^9, payer 5,000);
  disable withdraw -> withdraw 6019, deposit still succeeds
  (user base -160,619,895,224, quote -29,312,440, LP +10^9,
  payer 5,000); disable create -> create_pool 6017 with no
  pool / LP mint / user LP account created and both vaults
  unchanged, and after re-enabling, the same create succeeds
  (init_liq 1009, lp_out 909, payer 10,507,640, 1
  CreatePoolEvent) — the setter change binds to the very next
  instruction and its reversal restores the path.
- **Error sites** (original / rebuilt): buy 6020
  trade_v2.rs:660 / :429; sell 6021 :865 / :366; deposit 6018
  deposit.rs:56 / :5; withdraw 6019 withdraw.rs:57 / :5;
  create 6017 create_pool.rs:193 / :83. Codes and names agree
  across all 3 images, lines differ only (the #36 precedent,
  so verify checks the recorded per-image site line against
  that image's logs).
- All 3 images agree on every case-step.

## Limits

Offline LiteSVM synthetic fixtures only. No source change, build,
or whole-program equivalence claim. Numbers and byte ranges are
exact for this fixture state. The ghost event is a
failed-transaction log observation, not an on-chain index claim.
The deposit/withdraw quote deltas (29,312,440 / 29,312,439) are
the values measured in this packet's fixture; they differ by 30
/ 29 from the quote figure quoted in the 1st-run
liquidity-disable-flags README, whose fixture state is not
reproduced here — the packet asserts only its own measured
values. The `disable` instruction writes no other config byte
and performs no fee or rent accounting beyond the 5,000
transaction fee (setter steps) and the downstream instruction's
own costs.


## Retained proof integrity

The verifier pins the declared original/control/candidate hashes to authentic
repository artifacts, including the existing hash-equivalent compressed historical
control and candidate images. These two rebuilt images are historical controls;
this packet does not execute the AMM image selected at review
`86dbc2c64e81988dead173039b61fa01ba5f68a00fbb6f6dd49f2cda0afec37f`.
The raw receipts contain image-role declarations, not captured loader records or
cryptographic VM execution attestation. Image hash binding authenticates those
declarations and available artifacts; it cannot attest which code a prior VM loaded.
The retained producer loads the selected files through the pinned harness.

Signed instruction data, program and payer/config/admin roles are decoded and
bound to each case. The exact 26 case labels, families and fixture definitions,
three image roles, per-image steps and all 111 consumed receipts are checked.
Every instruction account's effective signer/writable privilege is checked,
including the explicit unsigned-admin and read-only-config cases and the fee
payer's implicit writable privilege. Pool, mint, token, volume and fee roles used
by the state checks are bound to their decoded downstream instruction positions.
Roles stay equal across the entire chain. Watched snapshot membership is exact:
family A watches config/payer; trade and liquidity chains watch all downstream
instruction keys; create watches its nine declared state/payer/config roles.
Setter steps retain those same chain accounts even though `disable` itself uses
only four instruction accounts. Chain step order and complete watched-account
continuity are checked between adjacent receipts. These checks establish saved
proof correspondence, without authenticating prior VM execution. The retained `clock` receipt metadata is a
producer annotation; family A's actual default-clock timestamp is established by
its emitted timestamp 0, while family B events contain 1234567890.
`python -B research/amm-admin-disable-setter-20261029/test_verify.py` exercises
repinned image, valid-wire substitution, chained-state, invalid-signature,
off-wire watched-pool and missing-gate membership negative controls
without a VM or compiler. Original producer and raw receipt bytes are unchanged.
