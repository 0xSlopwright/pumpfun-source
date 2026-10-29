# Correlated boolean copy bounds

This read-only packet closes the four `true`-literal references left by `229e6396…`, against the same immutable sixth candidate `be10ca1a…`. It does not alter or replace the earlier packet and does not change source or executable bytes.

All four references reach `memcpy` with exactly four bytes. Three bounded trace regions begin at real length-selection blocks: original `Error::with_values` offsets 16, 360 and 1000. The analysis records zero/nonzero facts only for unchanged input symbols and propagates those facts through register moves. Other conditions remain unconstrained. Each region stops at its first `memcpy`; there is no assumed memory effect or register-preservation model across that copy.

The allocation-failure paths cannot rejoin a copy. An independently checked 12-function call graph has 11 non-returning nodes, proved by a least fixed point over actual branches/calls terminating in the `abort` external. All paired graph nodes have matching normalized bodies and relocation patterns. A returning `memcpy` fails this non-return test. The graph includes a normal log helper which is deliberately not marked non-returning.

A negative run with input-symbol correlations disabled produces eight spurious five-byte paths for `true`. The correlated analysis rejects them. Shifted literal pointers and a changed terminal byte also fail. This demonstrates why treating independent conditional branches as interchangeable was insufficient.

Together with the two prior pooled-use packets, all 280 supplied observations now have a bounded/classified explanation. The claims differ by kind: direct reads, argument slices, returned slices and an existing empty-format schema. This is not proof of every original containing allocation, every possible static reference, or whole-ELF identity.

Run `python -B verify.py --root REPOSITORY`; `--candidate` and `--symbols` allow explicit paths with fixed artifact hashes. API: `verify(root, candidate=None, symbols=None)`. Defaults refer to the preserved public sixth checkpoint. No private cache, compiler or runtime execution is needed.
