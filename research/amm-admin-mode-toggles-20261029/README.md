# Admin mode toggles: state transitions, same-state asymmetry, and downstream gates

## Problem

`toggle_mayhem_mode`, `toggle_boost`, and `toggle_cashback_enabled`
were never pinned as state transitions. The three handlers look
symmetric — each flips one GlobalConfig byte — but they differ in
ways that matter: two of them reject same-state writes, one does
not; one of them has an extra authority gate; none of them emits
an event; and the flags they write gate `create_pool` modes but do
not gate `claim_cashback` at all.

## Cases

35 cases x 3 images (original / #424 control / #427 candidate),
120 signed receipts, parts of 10 receipts each
(`runtime/raw-transactions-part1..12.jsonl.gz`), independently
verified by `verify.py` (PASS). The GlobalConfig fixture is the
imported-lab config snapshot with admin set to the payer keypair:
mayhem byte 417 = 1, cashback byte 642 = 1, boost byte 939 = 1,
boost authority bytes 907..939 non-default. Every case uses a fresh
VM per image; every failing case rolls back fully with payer cost
exactly 5,000.

### Toggles (29 cases, 34 steps)

- `mayhem-off`: byte 417 1 -> 0, success, 0 events.
- `mayhem-on-from-off`: preset 417 = 0, toggle true -> 1, success.
- `mayhem-same-on` / `mayhem-same-off`: 6043 MayhemModeInDesiredState
  (original `toggle_mayhem_mode.rs:17`, rebuilt `lib.rs:212`),
  rollback.
- `mayhem-outsider`: 6005 InvalidAdmin. `mayhem-unsigned`: 3010
  AccountNotSigner. `mayhem-readonly`: 2000 ConstraintMut.
  `mayhem-wrong-owner`: 3007 AccountOwnedByWrongProgram.
  `mayhem-bool2` / `mayhem-noarg`: 102
  InstructionDidNotDeserialize.
- `cashback-off`: byte 642 1 -> 0, success, 0 events.
- `cashback-on-from-off`: preset 642 = 0, toggle true -> 1, success.
- `cashback-same-on` / `cashback-same-off`: 6051
  CashbackNotInDesiredState (original
  `toggle_cashback_enabled.rs:21`, rebuilt `lib.rs:228`), rollback.
- `cashback-outsider`: 6005. `cashback-unsigned`: 3010.
- `boost-off`: byte 939 1 -> 0, success, 0 events.
- `boost-on-from-off`: preset 939 = 0, toggle true -> 1, success.
- `boost-same-on` / `boost-same-off`: SUCCESS — byte unchanged,
  payer 5,000, 0 events. There is no `require_neq` on the boost
  flag, unlike the mayhem and cashback flags. This asymmetry is
  the sharpest pin of the packet.
- `boost-default-auth-off` / `boost-default-auth-same-on`: with
  authority bytes 907..939 all zero, either direction fails 6005
  InvalidAdmin (original `toggle_boost.rs:14`, rebuilt `lib.rs:218`)
  before any write; byte 939 stays 1.
- `boost-outsider`: 6005. `boost-unsigned`: 3010.
  `boost-readonly`: 2000 ConstraintMut.
- Chains: `chain-mayhem-off-on`, `chain-cashback-off-on`,
  `chain-boost-off-on` (off then on, both succeed), and
  `chain-boost-samestate` (on -> on, off, off -> off — all three
  succeed, proving the missing same-state check is not a
  one-transaction artifact).

### Downstream create_pool gates (5 cases, create harness)

Same payer as creator (non-canonical creator key):

- `create-mayhem-off`: config mayhem 0, `is_mayhem_mode` true ->
  6041 MayhemModeDisabled (original `create_pool.rs:171`,
  rebuilt `:73`).
- `create-mayhem-on-noncanon`: config mayhem 1, `is_mayhem_mode`
  true -> 6042 OnlyPumpPoolsMayhemMode (original `:177`, rebuilt
  `:74`).
- `create-cashback-off`: config cashback 0, `is_cashback_coin`
  true -> 6049 CashbackNotEnabled (original `:183`, rebuilt `:78`).
- `create-cashback-on-noncanon`: config cashback 1,
  `is_cashback_coin` true -> 6050 OnlyPumpPoolsCashback (original
  `:189`, rebuilt `:79`).
- `create-both-off`: both flags 0 with both modes requested ->
  6041 first (mayhem is checked before cashback in `create_pool`).

### Claim flag independence (1 case)

- `claim-cashback-disabled`: with a DISABLED config (byte 642 = 0)
  present in the VM, the base claim still succeeds — vault
  1000 -> 0, dest +1000, claimed 13 -> 1013, event present, payer
  5,000, config byte stays 0. The flag gates creation only, never
  claims: the `claim_cashback` account list contains no
  `global_config` at all.

## Result

- Toggles are silent: all successful toggles emit 0 events, even
  though `AdminGlobal` carries `#[event_cpi]` — the mayhem and
  cashback handlers never call `emit_cpi`, and `toggle_boost`
  uses `AdminGlobalNoEvent`.
- Same-state writes: mayhem 6043, cashback 6051, boost succeeds.
- Boost authority gate: default authority -> 6005 in either
  direction, before any write.
- Shared auth map: outsider 6005, unsigned 3010, readonly 2000,
  wrong-owner 3007, bad/missing bool arg 102.
- Create gates fire in source order (mayhem before cashback) and
  distinguish "mode disabled" (6041/6049) from "non-canonical
  creator" (6042/6050).
- Claim ignores the cashback flag entirely.
- All 3 images agree on every case-step.

## Limits

Offline LiteSVM synthetic fixtures only. No source change, build,
or whole-program equivalence claim. Error sites are quoted per
image family (original deployed binary vs #424/#427 rebuilds);
the rebuilt toggle handlers live in `lib.rs` while the original
binary reports per-instruction files. Receipt snapshots cover
non-executable accounts only (the program account itself is
excluded: its size and lamports differ between the original
10,485,715-byte binary and the 1,291,424-byte rebuilds).

## Retained receipt counts

The raw `counts.vms` and per-receipt `vm` fields are execution/receipt ordinals. This packet covers 105 fixture/image scenarios and 120 signed executions, because its chained scenarios submit multiple transactions in the same VM. The producer and raw receipts remain unchanged; no separate count of runtime VM constructor calls is claimed.

The retained source fingerprints identify the historical AMM source archived at `repro/pump_amm/v2-mint-clone-recovery-20261028/results/canonical-source`. Verification reads that exact snapshot, including the former `cashback.rs`; each recorded hash stays mandatory. Runtime uses the three explicitly pinned historical executable images. This packet does not compile or qualify the current maintained AMM source.
