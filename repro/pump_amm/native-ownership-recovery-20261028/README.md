# PumpSwap native fee and source ownership recovery

Candidate `ea14ee8e5ea9a9b6695110fa141af77f378a21dcd36e159ae92279c9c6d6b593` matches **658/785 original function windows
(83.8%)**, including **148 raw-equal bodies**. **127 windows remain (16.2%)**.
Matched windows cover **830,032/1,162,040 executable bytes (71.4%)**;
**332,008 bytes remain (28.6%)**. The two gains are `prepare_pool` at `0x58028`
(3,552 bytes) and native `calculate_fee` at `0xf2d60` (368 bytes). There are no losses.
These percentages measure binary coverage, not engineering effort completed.
Whole ELF identity remains false.

## Recovered source and behavior

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
All **762 existing framework artifacts** remain unchanged. An isolated native
package build adds exactly three local artifacts; all 765 stay unchanged through
both strict contract builds. The native compiler invocation, dependency metadata,
source dependencies, object code and lock-graph change are separately checked.

All **17,462 core cases** pass, with 35,074 executions and 35,418 signature fields.
The 1,502 private-event cases, 254 sweep cases, 1,730 incentive cases, 41 CTO
controls and nine supplemental groups are separately verified. Counts overlap.
All 38 captured IDL dispatch wrappers match. A fresh 216-case native-fee replay
agrees on normalized diagnostics, errors and state; **14 cases retain different
source-line diagnostics**, recorded in the unchanged raw observations.

Independent analysis finds 594 windows in the recognized bounded call/data
closure, or 587 when source coordinates must also agree. This remains a bounded
analysis, not complete indirect-call or whole-program identity.

## Remaining work

The [complete remaining-window review](remaining-audit/README.md) accounts for all
127 unmatched ranges. Of these, 78 have a candidate differing only in recognized
source-coordinate immediates; 49 retain other instruction or shape differences.
Neither classification is a complete source reconstruction. Calls, data,
relocations, historical build provenance, uncovered behavior and authentic
fixed-admin create_config success remain open.

```sh
python -B repro/pump_amm/native-ownership-recovery-20261028/verify_saved.py
```

Add `--current-source` to bind maintained files. Before committing, run
`verify_index_coverage.py --repository <checkout> --verify-blobs` to verify every
result-manifest member in the Git index. The result manifest is
`5cc10d03fec88d0d06c84775bbc6c508b8142e7251cd5cad9ed0a19c56dbc511`.

[Retained follow-up evidence](followup/README.md) includes unselected inverse/route proposals and the independently reproduced upstream incentive regression. Run `python -B repro/pump_amm/native-ownership-recovery-20261028/followup/verify.py` to verify those packets with the negative baseline explicitly expecting 128 differences.
