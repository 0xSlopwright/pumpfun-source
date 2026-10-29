# Buyback diagnostic parity: 24 signed cases

This focused replay checks full instruction logs after removing only compute
unit consumption lines and source path/line positions. It preserves errors,
state, events, comparison-value formatting and comparison order. Cases include
crossed duplicate groups, zero keys, seven/nine recipient counts, valid unique
and reversed recipients, and the basis-points guard's precedence.

The selected integration has zero differences. `baseline/` preserves the same
24-case replay against5c1e, with12 diagnostic differences. Each branch retains
48 signed original/candidate transactions; `verify.py` checks all96 signatures,
identical paired messages, producer/observer hashes, result differences and the
optional selected candidate file. The dependency/source inputs used by the
producer are hash-bound by `inputs.json`; no private key material is retained.
This is a focused saved replay proof, not a new full runtime replay or a claim
of whole-program equality. No private work/cache path is opened by verification.

The explicit baseline ELF is retained at `baseline/candidate.so`. This final
packet also pins the captured IDL and config snapshot used by the producer.
