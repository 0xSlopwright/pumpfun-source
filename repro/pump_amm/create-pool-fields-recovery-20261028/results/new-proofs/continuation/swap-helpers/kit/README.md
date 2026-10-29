# Selected AMM helper replay kit

Runs five unchanged signed producers: fee context (72), buyback validator (120), cashback guard (24), pool-v2 lookup (48), and buy-result sums (51). Total: 315 original/candidate pairs and 630 signatures. This does not replay the separate 582-case accrual/reserve-cap packet.

```sh
work/test-env/bin/python -B work/amm-selected-helper-replay-kit-20261027/run.py \
  --candidate /absolute/path/to/candidate.so \
  --output /absolute/path/to/new-output \
  --expected-sha256 CANDIDATE_SHA256
```

The output path must not exist. `--repo-root` can select the repository explicitly. Four suites run concurrently by default (`--jobs 1` through `5`). All execution is local using synthetic fixture state and test signers. No chain access or transactions are broadcast.

The driver stages byte-for-byte producer copies in a temporary direct child of `work/`, retaining the original relative-root convention. It checks the captured original/dependencies, seven imported harness modules, five fixtures and the cleaner before and after execution. Copies of all nonbinary inputs, the producers and observer are included in every output. No compiler cache is accessed.

```sh
work/test-env/bin/python -B /absolute/path/to/output/verify.py \
  --directory /absolute/path/to/output --candidate /absolute/path/to/candidate.so
```

The saved verifier is also callable as `verify(directory, candidate)`. It needs Python and `solders`, but no repository-relative imports. It recomputes full result differences, verifies every transaction signature and original/candidate message/prestate equality, binds raw logs and actual program hashes to observed receipts, checks full nonexecutable account snapshots, and verifies producer/observer/input inventories. Only compute log lines and logged source coordinates are normalized by the preserved cleaner. Saved verification does not execute a runtime. `--allow-mismatches` is available on both commands for diagnostic candidates; it still checks all evidence and reports every mismatch.

`kit.json` records immutable producer provenance and case-roster hashes. This kit does not claim whole-program byte identity, authentic chain-state acceptance, or complete instruction coverage.

Version 2 adds the two import-time Pump fixtures (`pump.json` and the curve trade snapshot) to the before/after hash checks. Producer, observer, runtime behavior and verifier code are unchanged from version1. The version1 artifacts are preserved.
