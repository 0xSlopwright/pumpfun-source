# Relocation-bound syscall pattern recognition

The archived pattern detectors require a direct numeric syscall encoding.
The retained originals instead bind named external calls through relocation
type 10. Consequently each program's `sol_invoke_signed_rust` call and two
`sol_memcpy_` calls are omitted: the generated CPI and memcpy counts are zero.

This source-hash-bound successor consults the unchanged ELF reader's relocation
symbol at actual call instructions. It adds those named forms, rejects relative
calls and unrelated relocations, and avoids double counting the existing direct
path. Setup-store counts and the legacy direct numeric handling remain as before.

```
python research/bytecode-relocated-syscall-patterns/test_generate.py
python research/bytecode-relocated-syscall-patterns/generate.py --output work/relocated-patterns
python work/relocated-patterns/verify.py
```

Every relevant original relocation is checked across Pump, AMM and Mayhem.
These are static named-call observations and heuristic serialization clues,
not proof that a CPI executed or an arbitrary store sequence serializes data.
The exact reviewed helper accepts LF/CRLF checkout forms, rejects other drift,
and remains unchanged. Historical reports and existing output directories are
preserved; no source-build, runtime-coverage or security claim is added.
