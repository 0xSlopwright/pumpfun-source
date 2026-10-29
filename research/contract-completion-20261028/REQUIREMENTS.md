# Full contract completion requirements — 28 October 2026

Active objective: pull latest main, merge contract-related PRs, and finish every contract until fully complete. The previous turn made concrete progress (complete residual audit, AMM raw-body recovery, and a reproduced Pump integration build with 10,468 passing cases), but did not complete this expanded objective.

Scope is all five reconstructed programs: Pump Main, PumpSwap, Fees, Mayhem, and Donation Relay. App/frontend/backend work is outside this contract goal.

Completion remains unproven until all of the following hold against current repository state:

1. Relevant open contract PRs have been reviewed at their exact head, their actual source/evidence changes checked, and valid changes merged. Failed, conflicting, or superseded changes need a concrete resolution; a queued CI state is not a passing check.
2. Each program has complete reconstructed source integrated into its maintained selection, with an explicit build entry point and pinned dependencies, tools, flags, local macro/path inputs, and layout rules. Research-only source does not complete maintained integration.
3. At least two independently fresh builds of each maintained selection reproduce its complete meaningful deployed ELF byte for byte. Compiler/output-byte patching, dummy match bodies, copied original code bytes, and broader comparison masks cannot earn credit. Allocation suffix handling must remain explicit. Target-derived linker layout is disclosed as a reconstructed build recipe, not claimed historical provenance.
4. Whole-file comparison covers every meaningful section, including code, referenced data, relocations and metadata. Function-window equality and section-size similarity cannot establish this requirement.
5. Candidate-specific signed offline runtime suites and relevant boundary/control cases pass on the final composed images using their exact dependency/loader identities. Evidence from another image does not transfer without an exact executable identity check. Byte identity is the primary reconstruction gate; finite tests retain their stated coverage limits.
6. Maintained manifests, verifiers, build documentation, progress tables and CI entry points refer to those exact integrated sources and artifacts, with no unresolved reconstruction or integration gap mislabeled complete.

Historical source spelling and the unique original build process may remain unknowable; report that uncertainty honestly. The goal is a reproducible, source-built reconstruction of the complete shipped contracts with verified integration, not an unsupported claim of unique historical source recovery.

No program is credited complete merely because its README reports 100% normalized windows. Completion must be established from the current owning sources and actual artifacts.
