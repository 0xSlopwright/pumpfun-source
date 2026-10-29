# AMM mint and create-mode order proof

The 656 signed cases cover deposit/withdraw malformed-mint collisions, extended payout mints, direct create mode/argument/mint collisions, and canonical create through saved signed Pump migrations. The baseline a4b978ee has 166 differences, all in create mode-gate precedence or missing boolean comparison diagnostics. The corrected 61a78b88 has zero differences.

`run.py --candidate /absolute/program.so --output /absolute/new-directory` executes every case against the captured original and the candidate. `verify.py` checks the saved baseline/fixed proof; `verify.py --candidate ... --reports ...` authenticates a new replay. Verification covers signatures, complete non-executable pre/post message accounts, program hashes, every returned field, and raw log hashes. Only existing source-coordinate and compute-consumption log lines are normalized for comparison.

The fix changes only create.rs: requested mayhem and cashback are validated, using equality diagnostics, before disabled/amount/mint checks. Account initialization remains in the unchanged Anchor context. Fixtures are synthetic except the preserved signed migration message; no live chain action occurs. This is bounded behavioral proof, not whole-ELF equality.
