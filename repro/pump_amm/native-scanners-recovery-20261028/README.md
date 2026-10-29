# PumpSwap native scanner boundary recovery

Candidate `e33e6aace7d53008b3300364c07540f0cd7d1764196cd601554b08838b06e615` matches **660/785 original function windows
(84.1%)**, including **159 raw-equal bodies**. **125 windows remain (15.9%)**.
Matched windows cover **831,376/1,162,040 executable bytes (71.5%)**;
**330,664 bytes remain (28.5%)**. The new normalized gain is the public supported-mint wrapper at `0x73ef0` (568 bytes). There are no normalized or raw losses. The 159 raw matches are retained.
These percentages measure binary coverage, not engineering effort completed.
Whole ELF identity remains false.

## Recovered source and behavior

Two existing pure scanners move into the reconstructed native owner crate. The supported-mint wrapper now has its original 568-byte normalized body. Its called scanner remains 1,168 bytes versus the original 1,192, so full callee closure is not claimed. The mint fee wrapper is now the original 1,312-byte size and instruction layout except typed source-coordinate fields; its decoder remains 656 versus 664 bytes. The three-way decoder API matches the observed ABI, but its historical Rust spelling is not authenticated. No forced outlining attribute or padding was added.

The earlier native inverse-fee, fallible route error 6044, CTO, ClaimCashback and creator-ownership recoveries are retained.

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

Independent analysis finds 595 windows in the recognized bounded call/data
closure, or 588 when source coordinates must also agree. This remains a bounded
analysis, not complete indirect-call or whole-program identity.

## Remaining work

The [complete remaining-window review](remaining-audit/README.md) accounts for all
125 unmatched ranges. Of these, 80 have a candidate differing only in recognized
source-coordinate immediates; 45 retain other instruction or shape differences.
Neither classification is a complete source reconstruction. Calls, data,
relocations, historical build provenance, uncovered behavior and authentic
fixed-admin create_config success remain open.

```sh
python -B repro/pump_amm/native-scanners-recovery-20261028/verify_saved.py
```

Add `--current-source` to bind maintained files. Before committing, run
`verify_index_coverage.py --repository <checkout> --verify-blobs` to verify every
result-manifest member in the Git index. The result manifest is
`35c6a14026e52314058aed7627ccc895b9de8295cb7e658f36188c11a2eb0922`.

[Unselected follow-up evidence](followup/README.md) preserves current proposal limits and negative results without changing this checkpoint.
