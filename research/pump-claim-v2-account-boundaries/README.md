# Partial Pump claim-v2 source recovery

The four-line [Rust patch](source.patch) reconstructs original operations in
`cashback::claim_v2` at `0x77940`, using the maintained source promoted by #678.
Its 65 complete source inputs are archived, rather than replacing the maintained
selection with an experimental image.

The token path checks empty data before borrowing/deserializing it. The native
path reads Rent and the minimum balance before reading accumulator lamports,
without cloning the accumulator for that balance read. Both token-owner checks
retain the original account temporaries. Native user credit follows the
original getter, checked addition, mutable borrow, store and error conversions.

The comparison binds the real entry wrapper, all 45 immediate parser callees,
selected handler call sites and their branch operands. Five original call
boundaries are restored. Handler callee-body capacity improves from 60/68 to
65/68; this aggregate is separate from the checked branch witnesses.

**The function remains unequal:** original 8,832 bytes, parent 8,464, proposal
9,336. Two recipient-owner `AccountInfo::clone` occurrences and its `ToString`
occurrence still have different inlining. Counts remain **1019/1035 normalized,
188 raw**, with zero lost or gained windows. Complete call/data closure,
historical Rust spelling and whole-ELF identity remain unproved.

Validation retains three fresh source builds, including archived-source replay,
that reproduce both complete proposal ELF outputs. The captured-loader corpus
contains 44 suites / 10,468 pairs plus 126 extension pairs. Twenty-four focused
original/parent/proposal triples preserve complete observations, signatures and
ordered logs except compute-meter lines. The parent also passes these cases:
this is source-boundary recovery, not a new behavior correction. Token-2022 fee
cases withhold 50 and 5,000 units. The Tokenkeg counter-overflow case does not
establish payment-failure priority.

```sh
python3.12 -I -B research/pump-claim-v2-account-boundaries/verify.py
python3.12 -I -B research/pump-claim-v2-account-boundaries/mutation_controls.py
python3.12 -B research/pump-claim-v2-account-boundaries/rebuild.py \
  --sdk "$SDK_V144" --target-libraries "$LINUX_SBPF_LIBS" \
  --registry-home "$REGISTRY_CACHE" --output work/claim-v2-replay
```

The admitted build uses native macOS v1.44 tools and authenticated Linux v1.44
SBPF libraries. The original executable is a comparison/runtime input only.
Inherited Source-line layout is preserved. Open PRs were checked; #702 covers
AMM cashback fee behavior and has no overlapping Pump source change.
