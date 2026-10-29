# Captured SBPF v0 special operand forms

The archived disassembler leaves register-indirect calls as raw opcodes, gives
unary negation an extra immediate operand, and interprets the big-endian mode
bit as a register-source selector. In the real captures this affects 360
indirect calls, 79 negations and eight big-endian conversions.

The [official SBPF disassembler](https://github.com/anza-xyz/sbpf/blob/232878a9effc3df9c8693bbb599eba794d1898c0/src/disassembler.rs#L314)
uses the immediate field as the callx register for this legacy version. NEG
has only its destination operand; endian conversion takes the immediate width.
This successor wraps the accepted relative-call decoder from PR #933, which
retains the reviewed root-source hash checks. The corrected special forms
apply only to ELF flags zero, as in all three originals. Other versions and
out-of-range callx register numbers keep the archived behavior.

```sh
python research/static-decoder-special-operands/test_generate.py
python research/static-decoder-special-operands/generate.py --program mayhem --output work/mayhem-special-operands
python work/mayhem-special-operands/verify.py
python scripts/verify_evidence.py
python scripts/test_tooling.py
```

Use a fresh output directory. `validation.json` binds the complete Mayhem
before/after regeneration and real-corpus counts. Original instruction bytes,
window summaries, direct-call classifications and CFGs remain unchanged.
An indirect call's target is unknown; no concrete target or new execution
coverage is claimed. Other archived decoder heuristics remain unchanged.
