# Saved-evidence checks under optimized Python

`scripts/verify_evidence.py` expresses its integrity gates as assertions.
Python `-O`, `-OO` and `PYTHONOPTIMIZE` remove those assertions. On a copy of
the real nine-capture corpus, incorrect provenance hashes, payload lengths,
chain identifiers and deployment slots, and a removed capture manifest all
pass the optimized archived gate. Ordinary Python rejects those same copies.

This additive entrypoint loads the three reviewed helpers with explicit
`compile(..., optimize=0)`. It binds both the gate and its ELF-layout dependency;
retaining only the gate's assertions would leave dependent checks optimized
away. All helper hashes are checked before any helper executes. Only the two
reviewed dependency imports are replaced with bound module functions. No
global import module is replaced, no capture RPC is invoked, and original
scripts and evidence are preserved. Both reviewed LF/CRLF checkouts work;
other source drift fails closed.

```sh
python research/evidence-checks-optimized-python/test_verify.py
python -O research/evidence-checks-optimized-python/test_verify.py
python -OO research/evidence-checks-optimized-python/test_verify.py
python -O research/evidence-checks-optimized-python/verify.py
python scripts/verify_evidence.py
python scripts/test_tooling.py
```

`--evidence-root PATH` selects a repository-shaped root for checking copied
evidence; the default is this checkout. Tests copy the actual corpus, unlink
copied files before modification, restore them between cases and check all
three interpreter modes. Four regressions cover real positive and negative
cases, the dependent ELF gate, reviewed checkout forms and source drift.

The verification semantics are those of the pinned helpers. This preserves
their checks under optimization; it does not add new completeness guarantees,
validate source rebuilds, rerun captures, or establish runtime equivalence.
