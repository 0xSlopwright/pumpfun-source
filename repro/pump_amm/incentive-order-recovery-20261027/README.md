# PumpSwap incentive ordering and liquidity structure recovery

Candidate `c20007e860f47db1cc443344605afafe505d61bb4de6d61306fa164db3482544` retains **656/785 normalized windows (83.6%)**,
including **148 raw-equal bodies**. Matched windows cover **826,112/1,162,040
original text bytes (71.1%)**. **129 windows remain (16.4%)**, comprising
**335,928 text bytes (28.9%)**. There are no new whole-window matches or losses.
Whole ELF identity remains false. These are binary-coverage measurements,
not estimates of engineering effort remaining.

## Incentive boundary correction

The prior candidate returned error 6035 in 128 synthetic schedule cases where
the original instead failed while evaluating the stored time range. The original
skips its finished-range guard when the current timestamp is before the stored
start. This checkpoint restores that condition; it does not move the range
calculation before the guard on every path.

All **1,730 signed state/clock boundary cases now agree**, including those 128
counterexamples. The original baseline and its 3,460 transactions / 3,462 signature
fields remain in the [prior negative packet](../admin-harvest-recovery-20261027/followup/incentive-range-order/README.md).
The cases use deliberately synthetic state and clocks; they do not establish
present network reachability.

## Source-structure recovery

Deposit and Withdraw retain a borrowed Context through their business handlers,
read the supplied token-program key when selecting a transfer program, and use
the observed reserve-load order. Both retain their transfer and arithmetic
behavior. Deposit now has the original 7,128-byte size and all 55 direct-call
positions, but four source-coordinate stores and two scheduled loads still
prevent a complete match. Withdraw retains a 24-byte body gap.

Legacy Buy implementation now resides in the observed instructions/swap/buy.rs
module. A compatibility re-export remains in legacy_buy.rs. This corrects the
observed filename for a previously mismatched source record; original line
positions remain unresolved. No padding or added inline attributes are used, and window matching retains
its existing normalization. All 38 captured upstream-IDL instruction
wrappers remain matched; generated IDL-management wrappers and fallback paths
remain a separate scope.

## Verification and remaining work

Two strict offline builds agree. The recipe binds **51 canonical inputs**,
**52 workspace inputs**, **175 registry inputs**, **227 total**, across nine
authenticated dependency roots. **762 cached dependency artifacts remain
unchanged**. The original historical source/toolchain provenance is unresolved.

All **17,462 core cases**, **35,074 executions** and **35,418 signature fields**
pass. Fresh incentive, liquidity, legacy, and retained supplemental matrices
are separately bound to this exact candidate. The counts overlap and must not
be summed as unique scenarios. The saved verifier rechecks artifacts, source,
signatures, original/candidate logs, normalized results and recorded state; it
does not execute a new VM.

See the [remaining-window partition](remaining-work.json) and the
[independent remaining-work audit](remaining-audit/README.md). Unmatched code,
complete data/call/relocation identity, provenance, exhaustive behavior, and
authentic fixed-admin create_config success remain open.

```sh
python -B repro/pump_amm/incentive-order-recovery-20261027/verify_saved.py
```

Use `--current-source` to bind maintained AMM files. Result manifest:
`6c06d070fe0d68ae3df5d48637c0cd28a314d2f134107ec56cafa9ba812fde35`.

The [follow-up evidence](followup/README.md) records the remaining call-closure blockers and rejected ownership/conversion variants.
