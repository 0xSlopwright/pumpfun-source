# PumpSwap boost, buyback and cashback recovery

Candidate `01a038ead3614b09af8d9431d3253be2db9efc142ac17ced923d12ab6afe2609` matches **660/785 original function windows
(84.1%)**, including **159 raw-equal bodies**. **125 windows remain (15.9%)**.
Matched windows cover **831,376/1,162,040 executable bytes (71.5%)**;
**330,664 bytes remain (28.5%)**. The 660 normalized and 159 raw matches are unchanged from the prior checkpoint, with no losses. The changed handler bodies remain unmatched.
These percentages measure binary coverage, not engineering effort completed.
Whole ELF identity remains false.

## Recovered source and behavior

BoostBuyAndBurn now uses the original Pool eligibility helper before the trade and again when constructing its event, the common base-for-quote arithmetic helper, and the checked token-transfer helper. The actual calls and their argument origins are checked. The body remains 11,864 bytes versus the original 11,688, with two additional calls; full handler identity is not claimed.

ClaimCashback keeps the earlier user-key snapshot for transfer seeds, then reads the account's key for its event as the original does. The body grows from 4,032 to 4,040 bytes versus the original 4,056. Its remaining two unconditional-branch differences stay open.

The unchanged buyback-config handler body moves into the source module named by its original diagnostic. Its public API delegates without introducing a new call boundary. The original filename is recovered; source-line and frame-placement differences remain. No line padding or forced outlining attribute is added.

The prior staged CreatePool field stores, separate canonical policy branches, fee helpers, incentive guard and creator corrections remain intact.

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
The versioned workspace recipe binds **57 canonical inputs**, **58 workspace
inputs**, and **175 authenticated registry inputs**, for **233 compiled inputs**.
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

The [command-context correction](COMMAND-CONTEXT.md) records an informational
working-directory error and the boundary between saved verification and fresh replay.

## Observed resource boundary

The canonical Token-2022 policy controls use an explicitly synthetic Pump CPI caller with normal signatures. Four of 24 cases exceed the captured original's default 200,000-unit compute budget while the reconstruction succeeds; the same four differences occur on the prior H16 checkpoint. At an explicit 1,400,000-unit budget, all 24 pairs agree on the checked logical results. The higher-budget result does not establish default-budget parity or public-network reachability. Both outcomes remain in the current proof packet.

The [separate loader-allocation diagnostic](followup/loader-allocation/README.md)
explains these four raw fixture differences. LiteSVM loaded the original's
10,485,715-byte allocation and the candidate's 1,293,776 bytes into legacy-loader
executable accounts. The captured deployment instead has a 36-byte upgradeable
program account and separate ProgramData. The executable-account CPI charge
explains 36,767 of the 36,781-unit difference; the AMM execution differs by 14
units. With equal executable-account allocations, both sets of 24 paired controls
agree (96 verified signature fields). The larger allocation makes both programs
hit the limit in the same four cases. These diagnostics preserve the raw failures;
they do not prove broad compute parity, faithful upgradeable-loader replay or
network reachability.

## Remaining work

The [complete remaining-window review](remaining-audit/README.md) accounts for all
125 unmatched ranges. Of these, 80 have a candidate differing only in recognized
source-coordinate immediates; 45 retain other instruction or shape differences.
Neither classification is a complete source reconstruction. Calls, data,
relocations, historical build provenance, uncovered behavior and authentic
fixed-admin create_config success remain open.

```sh
python -B repro/pump_amm/boost-buyback-cashback-recovery-20261028/verify_saved.py
```

Add `--current-source` to bind maintained files. Before committing, run
`verify_index_coverage.py --repository <checkout> --verify-blobs` to verify every
result-manifest member in the Git index. The result manifest is
`0273de36b4d9386cf015cda32e9d045a10befa451083608a67adc6c2055641c4`.
