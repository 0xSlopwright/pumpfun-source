# PumpSwap staged CreatePool initialization recovery

Candidate `4fb73d3c0303e1f065e6356d32e86ba7341f75b27b861571cd8b8c586e46af98` matches **660/785 original function windows
(84.1%)**, including **159 raw-equal bodies**. **125 windows remain (15.9%)**.
Matched windows cover **831,376/1,162,040 executable bytes (71.5%)**;
**330,664 bytes remain (28.5%)**. The 660 normalized and 159 raw matches are unchanged from the prior checkpoint, with no losses. The changed CreatePool body remains unmatched.
These percentages measure binary coverage, not engineering effort completed.
Whole ELF identity remains false.

## Recovered source and behavior

CreatePool now initializes the observed Pool fields in stages instead of constructing a complete temporary Pool value and copying it. The bump, index, keys and LP supply are stored before the creator-configuration guard. The canonical branch stores the creator, fee and editability fields; the noncanonical zero-configuration branch preserves their initialized zeros. The original early mode-flag stores and later minimum-liquidity guard order are retained. The reconstructed body is still 10,152 bytes versus the original 10,240 bytes, so this is not a complete handler match.

Canonical and noncanonical quote-mint validation now have separate calls with the observed true/false policy values. The preceding base-mint validation keeps its false policy. Call roles are matched by control flow, not the physical order of emitted blocks. This preserves the prior creator snapshot, fixed program-ID reference, incentive mint snapshot and native-fee recoveries.

The tested initialized-account and nonzero-data controls are rejected by the captured initialization paths. Two prefunded System-owned zero-length controls succeed through fresh allocation. Zero-field preservation is supported by account allocation and the 279-byte Borsh layout; it is not inferred from a Rust Default implementation.

Pool preparation retains both original size guards while removing an extra
helper boundary. Its complete normalized body and all nine actual direct
callee bodies match. A small `no_std` local crate owns the native transfer-fee
value and method; its complete 368-byte body and both arithmetic callees match.
No forced inline attribute or source-line padding was added. The original
crate name and historical source organization remain unauthenticated.

The fee wrapper copies its 24-byte native value before the call, as the original
does. The constant-product quote uses the observed wide subtraction, and mint
fee decoding obtains Clock after successful Token-2022 decoding. The protocol
recipient validator follows the observed byte-mode and early-return control
flow. Remaining typed source-coordinate differences are retained in the census.

ClaimCashback borrows the token-program account directly. Creator handlers move
into their observed source files, and migration takes its emitted creator key
from the sharing account. These changes improve source and storage evidence;
they do not establish complete private-handler equality.

AdminCtoPool now derives the canonical authority and holder addresses in the
observed order and enforces the original existing-holder immutability check.
The two prior synthetic direct-CPI error-order counterexamples are resolved;
all 41 current direct/captured/retained controls agree. The captured Pump
program rejects the problematic wrong-creator requests upstream, so the
historical discrepancy is not claimed to have been network reachable.

The H11 incentive guard remains unchanged. All 1,730 fresh boundary cases agree;
the 128 historical counterexamples remain preserved. Newer upstream research
with a higher window count reintroduced those errors and was not adopted as a whole.

## Validation and reproducibility

Two strict offline builds produce identical stripped and unstripped artifacts.
The versioned workspace recipe binds **56 canonical inputs**, **57 workspace
inputs**, and **175 authenticated registry inputs**, for **232 compiled inputs**.
All **762 existing framework artifacts** remain unchanged. The three local native artifacts are reused unchanged from the separately authenticated prior compilation. No native package is recompiled for this root-only change; all 765 artifacts stay unchanged through both strict contract builds. The native compiler invocation, dependency metadata,
source dependencies, object code and lock-graph change are separately checked.

All **17,462 core cases** pass, with 35,074 executions and 35,418 signature fields.
The 1,502 private-event cases, 254 sweep cases, 1,730 incentive cases, 41 CTO
controls and nine supplemental groups are separately verified. Counts overlap.
All 38 captured IDL dispatch wrappers match. A fresh 216-case native-fee replay
agrees on normalized diagnostics, errors and state; **14 cases retain different
source-line diagnostics**, recorded in the unchanged raw observations.

Independent analysis finds 595 windows in the recognized bounded call/data
closure, or 588 when source coordinates must also agree. This remains a bounded
analysis, not complete indirect-call or whole-program identity.

## Observed resource boundary

The canonical Token-2022 policy controls use an explicitly synthetic Pump CPI caller with normal signatures. Four of 24 cases exceed the captured original's default 200,000-unit compute budget while the reconstruction succeeds; the same four differences occur on the prior H16 checkpoint. At an explicit 1,400,000-unit budget, all 24 pairs agree on the checked logical results. The higher-budget result does not establish default-budget parity or public-network reachability. Both outcomes remain in the current proof packet.

## Remaining work

The [complete remaining-window review](remaining-audit/README.md) accounts for all
125 unmatched ranges. Of these, 80 have a candidate differing only in recognized
source-coordinate immediates; 45 retain other instruction or shape differences.
Neither classification is a complete source reconstruction. Calls, data,
relocations, historical build provenance, uncovered behavior and authentic
fixed-admin create_config success remain open.

```sh
python -B repro/pump_amm/create-pool-fields-recovery-20261028/verify_saved.py
```

Add `--current-source` to bind maintained files. Before committing, run
`verify_index_coverage.py --repository <checkout> --verify-blobs` to verify every
result-manifest member in the Git index. The result manifest is
`f837e4d8fbe5e359e9f2df2ae6c0d59abc9c0cf7ca0903aabbafdf15835258c0`.
