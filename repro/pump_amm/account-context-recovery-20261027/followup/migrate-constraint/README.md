# Selected 623 artifact: known Migrate constraint divergence

This is negative evidence for selected candidate `badc94982f2ae20adc2a6be7fd22bba9d900c289de7c3b9e7475847af960ca7d`. It does not contain or select a corrected candidate.

The original `MigratePoolCoinCreator` account parser calls the 192-byte pool-authority PDA helper at `0x93728`, compares the result with `pool.creator`, and reports custom error 6028 before the sharing-account constraints. The reconstructed source omits this constraint. Assembly excerpts retain the original call and helper.

The 24 fixtures include canonical controls and noncanonical creators at correctly derived AMM pool addresses, with readonly, sharing mint/admin, holder, and truncated-sharing combinations. There are **12 divergences: three wrong successes with actual account-data changes, and nine wrong errors** (6045, 6046 or 6074 instead of 6028). Exactly three after-state snapshots differ. The remaining 12 cases agree. Fixtures are synthetic local states; this is not evidence of live exploitation.

`verify.py` runs offline with Python and solders. It authenticates the exact packet inventory and source/fixture snapshots, verifies all 48 transaction signatures and raw log hashes, binds the selected candidate and original ELF hashes, and recomputes the claimed differences. Pass `--candidate /path/to/selected.so` to rehash an external selected artifact and `--expected-seal HASH` to pin the manifest. No RPC or CPI program substitution is used.
