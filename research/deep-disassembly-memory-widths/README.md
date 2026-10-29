# Memory-width decoding successor

The archived decoder maps size bits `0x08`, `0x10` and `0x18` to doubleword,
halfword and byte. The actual encodings are halfword, byte and doubleword;
word (`0x00`) is already correct. For example opcode `0x79` is `ldxdw`, but
the existing report calls it `ldxb`. The same error affects immediate and
register stores.

The [SBPF opcode definitions](https://github.com/anza-xyz/sbpf/blob/main/src/ebpf.rs)
define these size modifiers and all twelve memory opcodes. The regression also
checks the raw instructions in the three retained original programs.

```
python research/deep-disassembly-memory-widths/test_generate.py
python research/deep-disassembly-memory-widths/generate.py --program mayhem --output work/mayhem-memory-widths
python work/mayhem-memory-widths/verify.py
```

This entry point verifies the exact reviewed helper in its LF or CRLF checkout
form, corrects only the width table in memory and refuses an existing output
directory. It preserves root scripts, historical reports and seals under the
`scripts/README.md` convention. Operands, raw bytes and all other decoder
heuristics remain unchanged; no runtime execution, source reconstruction,
binary-build acceptance or security assurance is claimed.
