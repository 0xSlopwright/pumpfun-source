# Unsigned 64-bit immediate decoding

The archived deep disassembler reads the high LDDW word as signed, then shifts it
left without masking. Constants with bit 63 set become negative Python integers
and negative hexadecimal operands, losing the encoded unsigned 64-bit value.

This successor changes only that high-word read to unsigned, after authenticating
the reviewed LF or CRLF helper. Captures, original helpers and prior reports remain
unchanged. It does not change the independent archived call/operand heuristics.

Run from the repository root:

```
python research/deep-disassembly-unsigned-lddw/test_generate.py
python research/deep-disassembly-unsigned-lddw/generate.py --program pump --output <new-directory>
```

`validation.json` binds all nine original/dependency captures and gives one exact
raw witness per input. Every complete instruction is compared before and after;
only affected immediate values and their mnemonic text change. The independent
oracle reads the eight physical immediate bytes as one little-endian value.
Boundary controls cover both sign boundaries, all ones, and a negative low word.
The generated packet uses the existing verifier. These are static bit-decoding
results, not proof of an executed path, source reconstruction, or security review.
