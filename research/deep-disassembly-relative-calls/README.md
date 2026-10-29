# Relative-call decoding successor

The archived deep disassembler decodes the source nibble as
`(register_byte >> 4) & 0xf`, then compares it with `0x10`. A nibble cannot equal
16. Every original relative call is consequently emitted as `call_extern ?`,
with no `call_target`, and the generated internal-call totals become zero.

This successor hash-checks the complete original Python helper (the exact Git/LF
bytes or their CRLF checkout form), adapts only that
comparison in memory, and uses the unchanged generation workflow. Source 1
indicates a relative call here; relocation type 10 still identifies an external
placeholder and is excluded from the relative-call interpretation. No captured
program code is executed. Existing scripts, old generated packets and their
seals are unchanged, following the preservation convention in `scripts/README.md`.

```
python research/deep-disassembly-relative-calls/test_generate.py
python research/deep-disassembly-relative-calls/generate.py --program pump --output work/pump-deep-calls
python work/pump-deep-calls/verify.py
```

The original-corpus regression checks the target of every 10,591 Pump, 7,223 AMM
and 4,768 Mayhem relative call. Synthetic cases separately retain relocated
external calls and direct syscalls. New output directories must not exist.

This fixes static call records and their counts only. Other historical decoder
heuristics, program frontiers and uncertainty remain unchanged. It does not
recover source, rebuild an ELF, prove runtime parity or establish security.
