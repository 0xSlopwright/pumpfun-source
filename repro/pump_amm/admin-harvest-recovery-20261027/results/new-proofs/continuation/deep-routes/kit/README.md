# Signed route boundary replay

328 cases:152 default-budget preflight/curve boundary cases,152 otherwise-identical cases prefixed with a signed ComputeBudget instruction requesting1,400,000 units, and24 corrected-budget two-/three-hop vault cases. The raised-budget cases complete the representative three-hop buy and sell.

`run.py --candidate CANDIDATE --output NEW --repo-root REPOSITORY` writes portable outputs. `verify.py::verify(directory,candidate)` authenticates saved data, including exact ComputeBudget program, instruction order and byte payload, all signatures, logs and complete nonexecutable account snapshots. The builtin ComputeBudget account is omitted from snapshots as executable; its instruction and all other loaded program digests are checked. All five imported fixture files and the seven imported harness modules are bound before/after. No VM limits are secretly overridden.
