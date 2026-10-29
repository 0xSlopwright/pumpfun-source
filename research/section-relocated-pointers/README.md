# Relocated pointers in the data-layout scan

`R_BPF_64_RELATIVE` stores the target address in the high 32 bits of an
8-byte addend. The archived layout scan compares that whole qword with
`.text` and the section being scanned, so the addend never matches. Pump
`.data.rel.ro` at `0x1bd710` is `00000000f0591b00` and points at `.rodata`
`0x1b59f0`. The archived pointer list does not contain it. The section
reports 1 pointer; 590 relocated slots are missing.

```
python3 research/section-relocated-pointers/test_generate.py
```

The successor checks the archived helper and, for a type-8 slot that is not
an `lddw`, tests the high half. Pointers into another section are kept.
The 200-row display cap and the struct-size expression are unchanged.

`validation.json` is a hand-written record; `test_generate.py` recomputes its
helper hashes, before/after pointer counts and witness row and fails on drift.

```
python3 scripts/verify_evidence.py
python3 scripts/test_tooling.py
```
