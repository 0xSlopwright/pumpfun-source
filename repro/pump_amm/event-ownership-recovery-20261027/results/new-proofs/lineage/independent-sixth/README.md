# Independent sixth-candidate review and227-input portable binding

This is a read-only review of candidate`be10ca1a530ef9c62be5c94a5183f339e5d7661dce588a9458767e20a5e488f6`. No compiler, runtime, shared cache or maintained source was changed. The separate reviewer owns the second strict build; the root task owns runtime acceptance.

An independent enumeration of all785 original windows confirms643 normalized and148 raw matches, up from642/129. The one new normalized window is original`0x118e0` (`is_native_or_usdc`,232 bytes). All19 raw gains are listed in`independent-measurement.json`; there are no normalized or raw losses. The quote helper's full normalized instructions and relocation pattern agree. All three actual64-byte comparison callees and all three32-byte mint constants agree, including the distinct Token-2022 native-mint key.

The portable source gate verifies51 canonical standalone inputs to52 compiled workspace inputs plus175 archived registry inputs:227 total. Rust bytes are unchanged by materialization. Nine package archives,166 archive members and nine Cargo metadata markers are verified. Actual sixth build metadata and the actual`a5565b…`logical-target builder are retained. The dependency gate additionally checks that the physical target derived from`strip_command[2]` is mounted at the recorded`CARGO_TARGET_DIR`. Metadata source-root checks remain intact.

Seven source negative controls reject changed canonical/current Rust, extra/missing workspace files, changed archived registry Rust and extra/missing external mappings. Two additional controls reject a missing target mount or a changed logical target. The current-source option remains available in`verify_source_binding.py`; saved verification does not assume the maintained checkout stays on this checkpoint.

The bounded call/data closure increases from585 to586 windows with the quote helper. All16 prior pointer observations still resolve through actual witnesses; no genuine recognized text/path mismatch appears. Twelve recognized source-coordinate differences remain. The earlier nine Unicode/UTF-8 arrays (2,518 bytes), fixed comparison ranges and both80-byte token-enum constants are rechecked at sixth-candidate addresses. This does not establish complete data, indirect-call or whole-ELF identity.

Run the independent saved verification from the repository root:

```sh
PYTHONDONTWRITEBYTECODE=1 work/test-env/bin/python -B work/amm-sixth-independent-review-20261027/verify.py --root "$PWD"
```

`results/canonical-source`, `results/source`, `verify_source_binding.py`, `workspace_recipe_v2.py` and`results/dependency-proof` are ready for a checkpoint export. They do not read private caches during verification. The baseline comparison uses the public immutable behavior-context checkpoint. The new source/dependency gate counts are narrowly updated; all historical files remain untouched.

## Portable export

The original c688527f packet remains unchanged. This export includes the exact verified fifth baseline under `baseline/candidate.so` and `baseline/unstripped.so`, so its independent recount does not require a published behavior-context checkpoint. The baseline lookup changes in the verifier, with its hashes asserted explicitly. An external-directory test also exposed three audit helpers that searched their own ancestors for the repository; the export now supplies their existing ROOT variable explicitly from --root before import. Their comparisons and constraints are unchanged. All source, dependency, target-mount and negative controls are retained. `original-manifest.json` authenticates the unchanged original inventory.
