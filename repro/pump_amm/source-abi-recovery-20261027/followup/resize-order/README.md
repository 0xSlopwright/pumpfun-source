# Current640 sweep ordering counterexamples

Candidate e995d6a8 is intentionally retained unchanged. The original resizes a short pool before validating sweep recipients; the current candidate validates first. The160-case matrix produces8 mismatches:4 return the same recipient error with a different System-CPI trace, while4 with a low-balance payer return original System custom1 instead of candidate6013/2006. Four cases use an ordinary user-supplied zero recipient; the other four deliberately mutate recipient-related account state. This is offline, signed synthetic evidence, with no production action or reachable-global-state exploit claim.

The matrix covers all9 original helper caller regions via11 entrypoint/direction families. All raw logs, full message-account snapshots, transaction bytes, signatures and loaded-program digests are retained. `initial154/` preserves the first corpus and its exact producer; `expanded160/` adds six zero-recipient controls without overwriting it.

`verify.py` independently checks signatures, snapshots, full normalized results, exact producer-generated case rosters, actual direct System-CPI log nesting and all25 runtime input digests. It executes no VM. The order-only patch moves the existing resize block before the guards; it is not built or attributed to e995. The separate typed-resize representation proposal remains independent.
