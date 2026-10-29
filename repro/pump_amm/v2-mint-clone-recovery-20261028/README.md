# PumpSwap V2 mint AccountInfo recovery

Candidate `dbb5dcfd1a1487e22d61ae68d22a9b74087b78a868a08ab974c7bdbb127f1500` matches **660/785 original function windows
(84.1%)**, including **159 raw-equal bodies**. **125 windows remain (15.9%)**.
Matched windows cover **831,376/1,162,040 executable bytes (71.5%)**;
**330,664 bytes remain (28.5%)**. The 660 normalized and 159 raw matches are unchanged from the prior checkpoint, with no losses. The changed handler bodies remain unmatched.
These percentages measure binary coverage, not engineering effort completed.
Whole ELF identity remains false.

## Recovered source and behavior

The three V2 handlers now create the original temporary quote-mint AccountInfo before fee decoding. The captured buy_v2, buy_exact_quote_in_v2 and sell_v2 handlers clone the account wrapper, pass that temporary to from_mint and drop its two Rc fields. The three-line recovery restores those ownership boundaries. The native decoder remains unchanged at 1,312 bytes. All three handlers remain unmatched; byte-count proximity is not treated as proof.

The isolated source/static packet checks all three original clone/decode call pairs, 870 trade cases and 174 mint-boundary cases. These are same-artifact receipts for the final dbb5 candidate and are reused without duplicate execution. Each mint mode includes 12 successes, 16 from_mint 6007 errors and 2 later transfer-fee 6023 errors, among its 58 cases. The temporary lives long enough for its borrow; no forced attributes or source padding are added.

The prior boost helper, cashback event-key, buyback module, staged CreatePool, incentive, creator and fee recoveries remain intact. Their history is described in the [H18 checkpoint](../boost-buyback-cashback-recovery-20261028/README.md).

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

The isolated strict first build is retained verbatim. A strict repeat against the same immutable source path and a private cache produces identical stripped and unstripped artifacts.
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

## Observed resource boundary

The canonical Token-2022 policy controls use an explicitly synthetic Pump CPI caller with normal signatures. Four of 24 cases exceed the captured original's default 200,000-unit compute budget while the reconstruction succeeds; the same four differences occur on the prior H16 checkpoint. At an explicit 1,400,000-unit budget, all 24 pairs agree on the checked logical results. The higher-budget result does not establish default-budget parity or public-network reachability. Both outcomes remain in the current proof packet.

The [current allocation proof](results/new-proofs/lineage/current-joint/allocation-proof/README.md) repeats 48 paired controls for this exact dbb5 candidate, with 96 verified signatures. Its executable account is 1,294,536 bytes and the original fixture allocation is 10,485,715 bytes. Agave's executable-account CPI translation accounts for 36,764 units of their caller cost gap; actual AMM execution differs by 14 units. Equal allocations produce zero paired mismatches. This remains a fixture loader-size explanation, not complete compute parity or live reachability.

The H18 raw results, allocation explanation and command-context clarification remain historical in [the H18 records](historical/H18-FACTS.md). The H19 raw policy observations and allocation controls above are newly bound to dbb5. An initial H19 order60 run failed fixture import before transactions; its corrected input-root run passes all 60 cases. Cwd is reproducible command metadata, not independently attested by transaction receipts.

## Upgradeable-loader account controls

The [separate upgradeable-loader proof](followup/upgradeable-loader/README.md)
loads each AMM into a fresh VM through the captured 36-byte Program data and
45-byte ProgramData header, preserving their owner and pointer. It verifies
24 matching policy pairs and 48 signatures; all four formerly budget-limited
original cases now succeed. Three invalid/missing ProgramData controls reject,
and four signed cache-selection controls distinguish a cached executable from
an explicitly reloaded one. The observer forbids loading the AMM through the
legacy add-program route.

This recovers the tested loader-account representation, not all historical
deployment state. Program-account lamports are a synthetic 1,000,000,000 and
the test Clock remains at slot 100; LiteSVM uses that slot for its cache rather
than the captured deployment slot. The original and candidate ProgramData
allocations remain distinct. The 14-unit AMM execution difference, deployment
lifecycle/slot semantics, broad compute parity and live reachability remain open.

An [independent loader review](followup/upgradeable-loader-review/README.md) also checks the signed controls, loaded images and cache-selection evidence.

## Remaining work

The [complete remaining-window review](remaining-audit/README.md) accounts for all
125 unmatched ranges. Of these, 80 have a candidate differing only in recognized
source-coordinate immediates; 45 retain other instruction or shape differences.
Neither classification is a complete source reconstruction. Calls, data,
relocations, historical build provenance, uncovered behavior and authentic
fixed-admin create_config success remain open.

```sh
python -B repro/pump_amm/v2-mint-clone-recovery-20261028/verify_saved.py
```

Add `--current-source` to bind maintained files. Before committing, run
`verify_index_coverage.py --repository <checkout> --verify-blobs` to verify every
result-manifest member in the Git index. The result manifest is
`fd4ba56a458aca4090376d75a02f26e4a62153834208189fe82aa59931a9bd8d`.
