# Authentic eight-package dependency proof

This self-contained saved-evidence bundle contains the eight unchanged published `.crate` archives, their recorded crates.io index entries/checksums, all 161 regular archive files copied from the actual active Cargo source directories, and eight actual Cargo `.cargo-ok` metadata files. There were no `.cargo-checksum.json` files in these active source directories. The metadata is preserved and hashed as cache metadata, never described as archive content.

`verify.py` needs only Python 3.11+. It checks each archive digest against its index record and the selected Cargo.lock, compares every archive member with its active-source copy, checks all eight metadata files, proves only the eight recorded packages changed in the lock, and confirms the manifest change only removes the prior local Pubkey patch. It binds all 169 active registry inputs plus all 41 application inputs to the actual strict build record, verifies unchanged dependency artifact hashes, and validates the executed builder/supporting-file hashes and recorded SDK identities. It never opens the historical absolute work paths preserved inside the records.

Run after relocating the bundle with the checkpoint source and build record:

```sh
python dependency-proof/verify.py --source source --build-record build/build-comparison.json
```

The SDK archive itself is not duplicated here (490,710,349 bytes). Its retained SHA-256, public release evidence, three authenticated SBPF sysroot member hashes and complete recorded target-library hashes are included. The already-published `repro/pump_amm/sbpf-target-recovery-20261027` independently preserves the target investigation. This verifier checks the saved binding to those SDK identities; it does not claim to reopen the SDK archive during saved verification.

`builder-executed.py` is the exact executed adapter, preserved for audit with both imports and its base builder. Its original absolute input paths remain historical evidence. A portable re-execution wrapper must supply current source/cache/SDK paths; the parent checkpoint owns that wrapper and repeat checks. No source names, crate versions, diagnostics or machine instructions were rewritten.
