# PumpSwap inverse fee and route recovery

Candidate `98ed250d3999e79b55683daa574b984fb7f650dc9eef0e3256671d0612b49fc3` matches **659/785 original function windows
(83.9%)**, including **159 raw-equal bodies**. **126 windows remain (16.1%)**.
Matched windows cover **830,808/1,162,040 executable bytes (71.5%)**;
**331,232 bytes remain (28.5%)**. The new normalized gain is the native inverse-fee method at `0xf2ed0` (776 bytes). Eleven already-normalized windows additionally match raw bytes. There are no normalized or raw losses.
These percentages measure binary coverage, not engineering effort completed.
Whole ELF identity remains false.

## Recovered source and behavior

The native inverse-fee method follows the original checked arithmetic. The route
helper uses the original fallible `NotEnoughRemainingAccounts` (6044) return when its optional sell leg is missing, instead of unwrap. This checkpoint retains the earlier
CTO, ClaimCashback, creator-ownership and native forward-fee recovery below.

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
126 unmatched ranges. Of these, 79 have a candidate differing only in recognized
source-coordinate immediates; 47 retain other instruction or shape differences.
Neither classification is a complete source reconstruction. Calls, data,
relocations, historical build provenance, uncovered behavior and authentic
fixed-admin create_config success remain open.

```sh
python -B repro/pump_amm/inverse-route-recovery-20261028/verify_saved.py
```

Add `--current-source` to bind maintained files. Before committing, run
`verify_index_coverage.py --repository <checkout> --verify-blobs` to verify every
result-manifest member in the Git index. The result manifest is
`617b08b3a86165ef3f7144f7cd7bf646112b3333c56161a61c93da985018e955`.
