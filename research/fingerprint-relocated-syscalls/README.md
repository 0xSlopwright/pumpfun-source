# Relocation-bound syscall sequence fingerprints

The archived fingerprint helper only records direct numeric syscall operands.
Known names bound by type-10 loader relocations disappear from its sequence.
Across the captured originals, 114 Pump, 83 AMM and 104 Mayhem recognized
syscall sites are therefore absent, leaving every sequence empty.

This successor wraps the accepted, reviewed-source-bound #933 decoder. It
adds known relocation-bound names in instruction order while retaining direct
numeric handling. A site recognized by both paths appears once. Relative
calls, non-call slots, wrong relocation types and unrecognized external symbols
are not promoted to known syscalls. The known-name set is the archived set;
this does not expand the syscall registry.

```sh
python research/fingerprint-relocated-syscalls/test_generate.py
python research/fingerprint-relocated-syscalls/generate.py --program mayhem --output work/mayhem-syscall-sequences
python work/mayhem-syscall-sequences/verify.py
python scripts/verify_evidence.py
python scripts/test_tooling.py
```

Use a fresh output directory. `validation.json` records real-corpus counts and
the complete Mayhem before/after regeneration. Opcode hashes, instruction
counts, raw bytes, CFGs and other packet outputs remain unchanged. The sequence
records static known call sites, not execution order along a feasible path or
proof that any syscall executed. No source or runtime equivalence is claimed.
