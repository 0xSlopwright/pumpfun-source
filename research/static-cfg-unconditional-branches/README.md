# Unconditional branch CFG correction

The archived decoder renders a jump as `ja +N (target)`, but its CFG builder
compares the full mnemonic with the exact string `ja`. The comparison always
fails: every unconditional jump is labelled conditional and receives a
fabricated fallthrough edge.

This entry point builds on the accepted relative-call successor from PR #933
and selects conditionality from the decoded opcode. Opcode `0x05` has only its
jump target; conditional branches retain both target and fallthrough, and exits
retain their return edge. Root scripts and earlier output packets are unchanged.

```
python research/static-cfg-unconditional-branches/test_generate.py
python research/static-cfg-unconditional-branches/generate.py --program mayhem --output work/mayhem-cfg
python work/mayhem-cfg/verify.py
```

The real-original regression covers all 7,187 Pump, 4,976 AMM and 2,270 Mayhem
unconditional jumps. This is a static CFG correction, not an execution trace,
source reconstruction, complete instruction-decoder qualification or security
review. Existing output directories are rejected to preserve prior evidence.
