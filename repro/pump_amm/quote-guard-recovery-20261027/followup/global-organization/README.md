# GlobalConfig structure control

This read-only control is bound to sixth `be10ca1a…`. It does not propose a source move or coordinate fitting. The current type declaration remains in `state.rs`, with methods in `state/global_config.rs`.

Nine methods have unique high-confidence original counterparts. Eight differ only at 13 Anchor `Source` line stores; the ninth, `split_buyback`, has identical normalized instructions. The filename payload `programs/pump-amm/src/state/global_config.rs`, its length, stack-field placement, every other instruction and relocation pattern agree. All 130 immediate direct calls across the nine pairs have equal full target bodies and relocation patterns. The five custom GlobalConfig deserialization bodies are already exact normalized matches, including the 899/932/941 layout readers.

The near-alias negative rejects mapping `set_lp_fee_basis_points` to `set_protocol_fee_basis_points`: their equal-sized bodies write different field offsets at instruction offset 24. The source line mismatch cannot justify treating those bodies as aliases. This negative does not mutate either ELF.

The audit finds no declaration/module correction supported by these bodies. Original declaration location and ordering of absent source remain unknown. The saved source files are context from the frozen sixth workspace; their contents do not establish the original line numbers. `same-size-map.json` is the diagnostic candidate search, while `organization.json` records only the verified correspondences.

Run `python -B verify.py --root REPOSITORY`; optional `--candidate` and `--symbols` override public sixth paths but retain exact hash checks. No build, private cache or network is required.
