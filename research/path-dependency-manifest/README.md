# In-repository Cargo path dependencies

`scripts/build_source_manifest.py` hashes the crate directory it is given.
`programs/pump-amm` depends on `native-transfer-fee` at
`../../crates/native-transfer-fee`, and that crate is outside the directory.
Changing `crates/native-transfer-fee/src/lib.rs` does not change the archived
manifest. The program calls `native_transfer_fee::supported_mint_data` and
`decode_transfer_fees`.

This entry point keeps the archived helper. It follows `dependencies` and
`build-dependencies` path entries that resolve inside the repository, then
hashes those crates with the same helper. `programs/pump`'s `pump-token-ext`
path stays inside the crate tree, so its manifest keys do not grow.

```
python3 research/path-dependency-manifest/test_manifest.py
```

Dev-dependencies are not followed. A path outside the repository is rejected.
This does not compile the crate or replace saved checkpoint manifests that
were produced by the archived helper.
