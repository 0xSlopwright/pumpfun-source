# Signed compare branches in error patterns

The archived error-pattern detector recognizes equality, unsigned ordering,
and signed greater-than branches. It does not recognize `jslt` (`0xc5`,
`0xcd`) or `jsle` (`0xd5`, `0xdd`). Pump file offset `0x2af38` is
`c504a80000000000`, a signed less-than branch whose target moves immediate
96. The archived scan does not report it.

```
python3 research/bytecode-signed-compare-errors/test_generate.py
```

The successor checks the archived helper and adds those four opcodes to the
existing conditional-move test. The early window cutoff is unchanged. These
rows are the same heuristic as the opcodes already listed, not proved error
returns.
