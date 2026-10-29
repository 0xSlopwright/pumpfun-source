# References to interior printable rodata addresses

The disassembly report only matches pointers equal to the beginning of an
extracted printable run. Rust's adjacent strings and suffix references often
point inside a run. Type-8 relocated references to those actual addresses are
therefore missing from window records: 2,331 Pump, 1,611 AMM and 859 Mayhem sites.

This reviewed-source-bound successor adds a bounded lookup for an interior
address only when the site has a type-8 relocation and at least four printable
bytes remain. Direct run-start behavior is unchanged. The original run dump,
its counts and accepted #933 relative-call correction are preserved; original
helpers and prior packets remain intact. Other source drift fails closed.

```sh
python research/disassembly-interior-string-references/test_generate.py
python research/disassembly-interior-string-references/generate.py --program mayhem --output work/mayhem-interior-strings
python work/mayhem-interior-strings/verify.py
python scripts/verify_evidence.py
python scripts/test_tooling.py
```

Use a fresh output directory. Tests compare every actual relocated rodata
reference with bytes scanned independently from its target address, and cover
short suffixes, outside addresses and unbound/non-data sites. `validation.json`
binds complete Mayhem regeneration and all original-corpus counts.

These are static printable suffixes, capped to the existing 120-character
display. Without source-level lengths they can include adjacent literals;
they are not proven Rust string boundaries, executed error paths, recovered
source or runtime-equivalence evidence.
