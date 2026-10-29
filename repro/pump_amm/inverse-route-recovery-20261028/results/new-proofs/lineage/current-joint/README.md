# Inverse-fee and fallible route composition

Candidate98ed250d3999e79b55683daa574b984fb7f650dc9eef0e3256671d0612b49fc3 combines two original-backed source components on ea14: a native inverse-fee method with a24-byte by-value caller, and a fallible extraction of the route direction option returning NotEnoughRemainingAccounts. Three source files change; no line padding or forced inline attribute is added.

The unchanged comparison model measures659/785normalized and159/785raw windows. Only0xf2ed0 (776bytes) gains a normalized match, none are lost. Eleven already-normalized runtime windows gain raw identity due to layout; raw identity remains a per-window claim. All38IDLwrappers match. Whole-ELF identity remains false.

The changed native dependency was rebuilt in a private clone of the previous cache: exactly three native artifacts were replaced, all762framework artifacts stayed unchanged. The root then built and strictly repeated with all765dependency artifacts fixed and all232source inputs unchanged. The two complete stripped/unstripped ELF outputs reproduce byte-for-byte. This is repeatability of the reconstructed program, not identity with the original.

Fresh saved execution covers core17462, incentive1730, private-event1502, sweep254, native216 and CTO41 suite-cases. Suites overlap. The native216 matrix preserves14 raw Source-coordinate log differences and has zero differences after declared compute/source normalization. All other listed gates pass their existing full-state/signature validators. No runtime receipt is inherited as a run of this artifact.

`python -I -B verify.py` verifies manifest coverage, source/input bindings, native-prime cache preservation, exact repeat bytes, census records, and every listed saved runtime gate. No compiler or VM is started. The independent H14 review separately recomputes static identities and validates source/callee origins.

Limits: no full original build provenance, complete transitive pointer closure, or whole-program equivalence claim. The route option spelling is inferred from original state/branch/error evidence. The new native method is a source reconstruction, not an authenticated historical crate. Successful fixed-admin create_config on the current executable remains unvalidated; an authentic2025signed transaction is a different older payload and is kept in a separate RPC/replay packet.

The complete13 current acceptance statuses and full2,811-case retained-extra receipts are included. The larger fresh supplemental-group payloads stay in the worker conventional directories and are re-audited by the root checkpoint; see omissions.json. The packet does not relabel omitted or prior-candidate observations.
