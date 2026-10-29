# Frozen 651 public instruction wrapper census

This read-only packet binds candidate `97bd5553c199cd24fb2d07034c365527bee5b138bf5dd7a0aa3099186aad2643` and its exact unstripped symbol ELF. It contains the captured 38-instruction PumpSwap IDL roster, a byte/relocation census, and a reproducible verifier. It changes no source or executable.

All 38 IDL instructions map one-to-one to an original instruction-log wrapper and a reconstructed `__private::__global` symbol. **36/38** have equal complete normalized instruction windows and equal relocation patterns. Both remaining wrappers, `sweep_creator_fee` and `sweep_protocol_fee`, are 1,072 bytes in the original and 984 bytes in this candidate. None of the 38 windows is raw-byte identical, because addresses and call displacements differ.

The original mapping decodes only each function's straight-line constant-register prefix through its first call, requiring a `sol_log_` relocation and an exact `Instruction: ...` string. The candidate name must correspond exactly to the IDL instruction, and its first log must agree. Original function boundaries come from the independent direct-call/relocation entry inventory; candidate extents come from the unstripped ELF symbols. The report preserves names, addresses, lengths, normalized hashes, relocation offsets/types/symbols and direct call targets for all 38 rows.

Seven generated IDL-management wrappers are listed but excluded. The entrypoint dispatcher, parser bodies, business handlers and all other code are excluded. A matched wrapper does **not** establish equality of its callees, actual relocated targets, account semantics, runtime behavior, transitive closure or the whole ELF. No count in this packet increases the selected checkpoint's 651/785 census.

Four in-memory negative controls reject a changed instruction byte, changed relocation type, a different wrapper alias, and a shifted address outside the independent function-entry inventory. No binary file is modified. A same-size prefix shift may preserve an instruction log, so entry validation is a separate required check.

Run with the public H8 artifacts:

```sh
python3 -B verify.py --root /absolute/repository
```

Or use exact frozen artifacts explicitly:

```sh
python3 -B verify.py --root /absolute/repository --candidate /absolute/candidate.so --symbols /absolute/unstripped.so
```

Python API: `verify(root, candidate=None, symbols=None)`. Defaults use `repro/pump_amm/optional-context-recovery-20261027/results/build/{candidate.so,unstripped.so}`. The original must be available at `evidence/original/pump_amm/deployed.so` under `root`. All three ELF hashes are mandatory; no private work path is used by the verifier. `test_portable.py` verifies a temporary copy from outside the repository and removes the temporary copy afterward.
