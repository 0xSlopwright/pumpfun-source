# Register-form account discriminator compares

The archived account-validation detector counts an `ldxdw` from offset 0
only when the next instruction is immediate `jeq` or `jne` (`0x15`, `0x55`).
Register `jeq` and `jne` (`0x1d`, `0x5d`) are the same comparison with a
register operand. Pump file offset `0xd6a8` is `79610000000000005d17040000000000`:
`ldxdw r1, [r6+0]` followed by `jne r7, r1`. The archived window count is 0.

```
python3 research/account-discriminator-compares/test_generate.py
```

The successor checks the archived helper and adds those two opcodes to the
existing next-instruction test. The `end - 16` window cutoff is unchanged.
These rows are the same heuristic as the immediate compares already listed,
not proved Anchor account discriminators.

```
python3 scripts/verify_evidence.py
python3 scripts/test_tooling.py
```
