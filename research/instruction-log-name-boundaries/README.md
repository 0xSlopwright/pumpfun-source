# Instruction-log name boundaries

`scripts/analyze.py` keeps every letter and digit after `Instruction: `.
Where the next rodata fragment is concatenated, the published name is not
an IDL instruction. Pump file offset `0x1b66f0` is the bytes
`Instruction: BuyCreateV2Disabled`; the archived name is
`BuyCreateV2Disabled`, while the IDL name is `Buy`. The same pass publishes
a 2,618-character `SetQuoteControlMintReserves...` string. Its IDL name is
`SetQuoteControlMintReserves`.

This entry point keeps the archived helper and `evidence/binary-analysis.json`
unchanged. It chooses the longest PascalCase name from that program's IDL,
plus the seven standard Anchor IDL instructions that are present in the
captures, and checks the chosen name against the bytes at every site.

```
python3 -I -B research/instruction-log-name-boundaries/test_recover.py
```

Mayhem's 25 archived names are already bounded by `Instruction:` or a
non-identifier. No Mayhem IDL is in `evidence/upstream`, so those names are
not reassigned. A corrected name is a label for the captured log prefix, not
a claim that every following branch was executed.
