# Sixth pooled-literal read extents

This read-only packet binds the original PumpSwap ELF and sixth candidate `be10ca1a530ef9c62be5c94a5183f339e5d7661dce588a9458767e20a5e488f6`. It makes no Rust change, adds no matched window and does not establish whole-program or whole-data identity.

The prior source-shape audit had 280 observations whose candidate address lacked an exact `STT_OBJECT` start symbol. They cluster into 66 original addresses. An absent object-start symbol is not an unknown value or an allocation-size proof: many addresses are small strings, keys and enum discriminants pooled into adjacent data.

The new tracing establishes 248 of these observations as 55 paired ranges, with no unequal bytes. The range lengths are 4, 8, 16 and 32 bytes (784 summed range bytes). These are observed use extents, not necessarily complete original allocations. The direct-consumer group has 236 observations, including one explicitly bound `sol_log_` syscall. The indexed group proves 12 byte reads of the same 16-byte hexadecimal alphabet: the actual index is masked to 0–15 before the byte load. Sixteen named consumer bodies and all 153 of their immediate direct call targets have equal normalized instructions and relocation patterns. This is one-hop evidence, not unlimited transitive closure.

`input-observations.json` is the unchanged `unmapped_rows` list from the prior sealed origin audit. `slices.py` follows the reference through straight-line operations and unconditional jumps, and refuses unknown conditional branches. Named ABIs are corroborated by actual consumer instructions and source snapshots. Enum pointers are accepted only if they are neither copied nor stored before being replaced by a u32 load. `indexed.py` uses only same-basic-block value flow and bounds from an explicit positive mask. No arbitrary 64-byte comparison is accepted as an object extent.

`clusters.json` enumerates every exact-pointer relocation to those 66 original addresses: 286 total, including 285 code references and one data reference. Nineteen code references belong to ten original bodies with no equal-body candidate in the supplied sixth census. Those targets are six already-equal Pubkey constants, the four-byte `pool` literal and u32 errors 4101/3002; this scan found no additional opaque table used by those unmatched bodies. Interior-pointer arithmetic and non-relocated references are outside this enumeration.

Thirty-two observations remain outside these new rules. `remaining.json` preserves them individually: conditional boolean text, nested signer/PDA seed slices, five format records already handled by the earlier format schema, an IDL discriminator used through a partial-write loop, returned/error-format strings and indirect indentation writes. They are not reported as mismatches. This packet neither changes nor reclaims earlier complete array, StringError-vtable, Base58 or empty-format proofs.

The deliberate negative controls reject a changed final byte in every paired range, one-byte offsets where the data differs, and a different same-width literal. Positive controls retain repeated uses of the same actual pooled literal. The old arbitrary 64-byte snapshots disagree in 178/280 observations, including 156 newly bounded observations whose actual consumed ranges are equal. Those disagreements therefore cannot be reported as differences in the consumed value.

## Replay

From the repository, with no private cache required:

```sh
PYTHONDONTWRITEBYTECODE=1 work/test-env/bin/python -B work/amm-sixth-pooled-data-next-20261027/verify.py --root "$PWD"
```

A published or exported copy of this directory uses the same command with its own `verify.py` path. Defaults are `repro/pump_amm/quote-guard-recovery-20261027/results/build/{candidate.so,unstripped.so}`. Explicit `--candidate`, `--symbols`, and `--original` paths are accepted, and exact artifact hashes remain mandatory. Python API: `verify(root, candidate=None, symbols=None, original=None)`.

`test_portable.py` copies this packet outside the repository, verifies the public artifacts, then checks rejection of a changed saved result and changed source snapshot in temporary copies. Source snapshots corroborate types and interfaces; they do not establish that every local SDK source byte belongs to the original compiler. All writes are confined to temporary test directories, and no ELF is modified or executed.
