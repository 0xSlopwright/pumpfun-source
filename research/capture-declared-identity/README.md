# Declared capture identity

`scripts/verify_evidence.py` hashes the saved account bytes and checks the
loader fields those bytes contain. It never reads `program`, `owner`, or
`commitment` from `capture.json`. Replacing Pump's declared program id with
`11111111111111111111111111111111` still exits 0.

The addresses checked here are the ones in `docs/SCOPE.md`. Upgradeable
captures must name `BPFLoaderUpgradeab1e11111111111111111111111` and every
capture must say `finalized`. Associated Token remains the legacy loader.

```
python3 research/capture-declared-identity/test_verify.py
python3 research/capture-declared-identity/verify.py
```

This does not re-fetch accounts or replace the byte verifier. A matching
declaration does not prove the bytes were read from that address.
