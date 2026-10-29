# Qualified multi-hop accrual source correction

The single Rust delta from selected composition673 replaces used inline fee
accounting with the two original `BondingCurve::accrue_fees` calls. Post-fill
base/quote fields are stored before the second call, as in the captured original.
The source65, actual compiler inputs66, compiler records and runtime observations
are retained separately. Historical private Rust spelling remains unknown.

This corrects a bounded observable diagnostic. With the token curve's creator-fee
counter set to `u64::MAX`, original buy and sell report Overflow at `lib.rs:2554`;
selected199f reports `multi_hop_curve_swap.rs:64`. The new image matches the
original. A sell fixture with both native protocol and token creator counters at
MAX gives the same correction before the later native leg. All watched state and
return/error/CPI/event observations agree; the previous image differs only in
these three ordered Source diagnostics. These are synthetic preexisting-state
witnesses, with no claim that their states are reachable on mainnet.

The ten primary fixture triples remain unchanged in `runtime/counter`. Two
separate token protocol-MAX success controls are retained too: the token leg's
flag2 disables protocol fees. Native MAX controls fail earlier at the reserved-fee
sum, `lib.rs:2562`, and establish no `accrue_fees` overflow at `lib.rs:2550`.
The independent auditor verifies 12 fixtures / 36 executions and signature fields,
36 actual loader observations, exact counter-only mutations, rollback and strict
ordered logs. These use two distinct serialized transaction wires across
different starting states. Actual producer bytes and their original input paths
are preserved; an explicit prefix map authenticates the retained input copies.

Two actual source builds produce the same complete files:

- Stripped: `c0e29e2d41c30e854f3548b37e87798d516e4e0e7769f40b7d8d16e31429795f`.
- Symbols: `dd73afe77d90d289e9383ee1aa12cdb26608752eb1a1f8b3a4135c0af786cb17`.

The primary run forces both local crates fresh while explicitly reusing unchanged
external dependencies. The independent portable run compiles into an absent
target in 57.538 seconds and authenticates 254 locked registry archives. The
portable builder is byte-identical to the prior qualified controller; its new
input JSON pins these actual source and ELF expectations. The native macOS 1.44
tools and official Linux 1.44 SBPF libraries are unchanged. Ordinary compiler and
linker output followed by ordinary stripping produces each image. Actual records
retain their executed source-path prefixes; the retained workspace archives prove
the explicit standalone65-to-workspace66 transform. No old receipt is relabelled
as a new compilation. The generated target and profile SDK are excluded from the
publication inventory and remain available locally.

All 1,035 original windows are recomputed. The new image retains exactly the
previous **1,019 normalized / 188 raw** memberships: zero gains and zero losses.
The residual per-hop function is still unequal: original 18,584 bytes, previous
19,536, new18,536. The complete normalized accrual helper body occurs at two real
calls in the original and new caller, versus zero in the previous caller.
Direct callee occurrences are original 107 / previous 109 / new 98; each also has
one imported abort and no indirect calls. Complete-callee capacity changes 73→75.
Physical call-sequence differences are diagnostics, not proof of CFG equivalence;
the first moved validator occurrence does not establish a semantic discrepancy.
Whole-function, whole-ELF identity and complete call/data closure remain unproved.

Fresh validation on this exact image includes all 44 suites / 10,468 pairs, strict
whole ordered logs with only complete compute-meter lines excluded, 18,343
serialized transaction fields and 27,875 verified signature fields. The six focused
families retain 106 strict case records / 318 outcome executions / 465 signature
fields, plus 284 legacy pairs / 568 signature fields and 126 extension pairs / 252
signature fields. The direct creation replay and its separate captured-loader
supplement remain distinct; the latter has 14 cases / 42 executions / 84 signature
fields and 42 actual captured Pump loads. No Source-coordinate substitution is
used. These finite corpora do not establish whole-program equivalence.

```sh
python3 -B research/pump-multihop-accrual-qualification-20261028/verify.py
python3 -O -B research/pump-multihop-accrual-qualification-20261028/integrity_controls.py
```

The verifier executes no compiler, VM or network request. It authenticates both
literal ELF files, current-source selection when requested with
`--source-directory`, actual compiled archives and immutable compiler records,
all memberships, raw runtime fields, signatures and loader allocations. Five
isolated controls reject source drift, archive/source grafting, literal ELF drift,
Source-log changes and a changed loader-allocation digest after its execution
receipt is resealed. Saved records are evidence, not cryptographic execution
attestation. Canonical source, selectors and Git publication are owned by the
integration task; this packet does not claim their promotion or goal completion.
