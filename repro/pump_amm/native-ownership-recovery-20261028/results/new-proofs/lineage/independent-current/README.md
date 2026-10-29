# Independent review of ea14

The selected candidate is `ea14ee8e5ea9a9b6695110fa141af77f378a21dcd36e159ae92279c9c6d6b593`; symbols are `3337604284a7c8a3a9f7014598547cceb0d8586d1b51cfa5c234014941af7399`. This independent packet recomputes the current candidate's code census, bounded dependency closure, source/build bindings and saved signed observations. It does not compile or execute an AMM transaction.

## Code and source

- 658 of 785 original function windows match under the retained normalization; 148 match raw bytes. Matched text is 830,032 of 1,162,040 bytes.
- Two new complete bodies match relative to 9278: `prepare_pool` at `0x58028` and native fee calculation at `0xf2d60`. No normalized or raw matches were lost. All 38 IDL dispatch wrappers match.
- 594 windows pass the bounded call/data closure checker; 587 also close their recorded source coordinates. These are bounded static results, not original-source or whole-ELF identity.
- The current remaining ledger has 127 windows: 78 have a same-size candidate differing only in typed source immediates; 49 have other code or shape differences. The ledger preserves those classifications rather than treating matching source labels as code recovery.
- The aggregate ten-component patch reproduces the current workspace from frozen 9278 sources. Version 3 of the canonical recipe preserves all Rust bytes and accounts for the explicit local fee crate: 56 canonical, 57 workspace, 175 registry and 232 total compiled inputs.
- The original 762 dependency artifact hashes are unchanged. Native-only priming added two identical rlib copies and one rmeta. Full build and strict repeat preserved all 765 artifacts and produced identical stripped/unstripped outputs. The actual rlib object, linked fee method and original method have the same 368-byte code with two raw-identical compiler-runtime callees. Historical identity of the new local package remains unknown.

`native-input-proof/` independently binds the real compiler invocation and the new artifacts. `dependency-proof/` preserves the earlier nine-archive proof intact and adds the versioned local-package extension. `remaining-proof/` retains the independent 127-window ledger, original-supported source origins, and actual callee checks for both new matches.

## Current signed observations

The copied primary receipts all name ea14 as the candidate: 17,462 core, 1,502 event/context, 254 sweep and 1,730 incentive cases. Their summed observations are 20,948 cases, 42,046 executions and 42,710 signature fields. These suites overlap. The verifier decodes and verifies signatures, checks loaded program hashes, and binds recorded errors, states, CPI data and available raw logs to their signed transactions.

The 1,730 incentive cases have zero mismatches. The prior 128 counterexamples remain an explicitly preserved baseline; the volume-accumulator source is identical to the accepted H11 conditional error-order correction.

Additional current CTO receipts cover 41 cases with zero mismatches and 144 verified signature fields: 10 synthetic direct AMM controls, 12 captured-Pump controls and 19 retained controls. The synthetic caller tests establish a downstream error-order result, not public-network reachability.

The native fee supplement has 216 cases and 648 verified signed executions. It retains 14 raw source-coordinate log differences. The independent check accepts only the two exact triples `UnsupportedQuoteMint` at original/control/current lines 32/31/30 and `Overflow` at 67/56/52 in `utils/transfer_fee.rs`; other semantic fields agree. Coverage is 96 decoder and 120 fee-arithmetic cases with bps through 10000 and bounded amounts. It does not claim coverage of larger bps or near-u64-maximum transaction amounts.

Seven mutation controls reject changed code, an incorrect actual callee, changed typed source data, or invalid event provenance. No whole-ELF equality is claimed. Run `python -I -B verify.py` to recompute all retained checks offline.
