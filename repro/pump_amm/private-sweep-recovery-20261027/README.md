# PumpSwap private-event and sweep source recovery

Candidate `9278a52ae4fd93bb6159a72fa625f121394902a93f701d86931a7ec3778055fb` retains **656/785 normalized windows (83.6%)**,
including **148 raw-equal bodies**. Matched windows cover **826,112/1,162,040
original text bytes (71.1%)**. **129 windows remain (16.4%)**, comprising
**335,928 text bytes (28.9%)**. There are no new whole-window matches or losses.
Whole ELF identity remains false. These are binary-coverage measurements,
not estimates of engineering effort remaining.

## Source changes and their limits

Four private event sites now reuse the event object for the ordinary emission
and event CPI: ClaimCashback and the three creator-reassignment events. The
first-Pubkey serialization reads reuse the same storage, matching the original
local witnesses. This does not establish equality of every serialized-memory
access or a complete match for the enclosing private handlers.

SetCoinCreator re-evaluates the canonical PDA for the error's right-hand pubkey
after the initial key comparison fails. It has 25 direct calls, but its 7,688-byte
body still differs from the 7,632-byte original. No complete private-body or
full-callee match is claimed.

Sweep retains a snapshot of the recipient key for both validation and the event,
and takes the event quote mint from Pool. Its 4,456-byte size and all 31 direct-call
positions agree with the original. Two typed source-line fields remain different,
and four direct callees remain outside the established closure. Those differences
remain visible in the complete window census; no padding or forced outlining is used.

## Preserved incentive correction

H11 corrected the finished-range guard so it is skipped before the stored start
time. Its 128 pre-fix synthetic counterexamples remain preserved in the
[negative packet](../admin-harvest-recovery-20261027/followup/incentive-range-order/README.md).
This checkpoint does not reopen that gap: `volume_accumulator.rs` is byte-identical
to H11, and all **1,730 fresh signed boundary cases agree** on this candidate.
The H11 proof is explicitly retained as baseline evidence; current execution
receipts and the H12 independent review separately bind the new binary.

## Validation and remaining work

Two strict offline builds agree. The recipe binds **51 canonical inputs**,
**52 workspace inputs**, **175 registry inputs**, **227 total**, across nine
authenticated dependency roots. **762 cached dependency artifacts remain
unchanged**. Historical source/toolchain provenance remains unresolved.

All **17,462 core cases**, **35,074 executions** and **35,418 signature fields**
pass. Fresh private-event controls cover **1,502 cases / 3,322 signature fields**;
the sweep matrix covers **254 cases / 508 signature fields**. Fresh incentive,
admin, legacy, liquidity and retained supplemental suites are separately bound.
The suites overlap and must not be summed as unique scenarios. All 38 captured
upstream-IDL instruction wrappers remain matched; generated IDL/fallback paths
remain separate.

The saved verifier rechecks artifacts, source, signatures, original/candidate
logs, normalized results and recorded state without executing a new VM.
See the [remaining-window partition](remaining-work.json) and
[independent remaining-work audit](remaining-audit/README.md). Unmatched code,
complete data/call/relocation identity, provenance, exhaustive behavior, and
authentic fixed-admin create_config success remain open.

```sh
python -B repro/pump_amm/private-sweep-recovery-20261027/verify_saved.py
```

Use `--current-source` to bind maintained AMM files. Before committing a staged
publication, `verify_index_coverage.py --repository <checkout> --verify-blobs`
checks every result-manifest member, including ignored files, against the Git
index. The result manifest is `85ad7cea40032e01c1beb84e10dae30514170d78ec27baf4b192be51afa6295e`.

The [materialization review](followup/materialization-proof/README.md) validates omitting unreferenced historical lineage copies while retaining complete current proof dependencies. Historical packets remain in their archived checkpoints.
