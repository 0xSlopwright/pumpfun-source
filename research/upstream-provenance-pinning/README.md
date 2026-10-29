# Upstream provenance pinning

`scripts/verify_evidence.py` re-hashes the three upstream IDLs against
`evidence/upstream/provenance.json`. The document that defines the expected
digests is not hashed by anything, and two of the six files in
`evidence/upstream/` are never read.

On a sealed copy the current gate still exits 0 after each of these:

- delete `evidence/upstream/pump_fees.json` together with its `file_sha256`
  entry;
- replace the `pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ` program id inside
  `pump_fees.json` and rewrite its recorded digest to match;
- drop `docs/instructions/COIN_CREATION.md` from `tree.txt` and write `[]` to
  `official-repositories.json`.

The first two are one edit apart from a silently substituted public interface;
the third removes the recorded upstream listing that `docs/SCOPE.md` relies on
for Mayhem. `evidence/upstream/tree.txt` and
`evidence/upstream/official-repositories.json` have no reader at all.

This gate pins the six upstream files, the documented repository and commit,
the published program addresses and instruction counts, and binds
`evidence/interface-inventory.json` and `docs/SCOPE.md` to those bytes.

```
python3 research/upstream-provenance-pinning/test_verify.py
python3 research/upstream-provenance-pinning/verify.py
```

`verify.py` reports the pinned counts:

```
files: 6
digests: 6
provenance_fields: 5
tree_entries: 35
repositories: 5
idls: 3
inventory_entries: 3
scope_addresses: 3
```

`test_verify.py` runs nine tests: one baseline check that the current
evidence matches every pin, and eight mutation controls on sealed copies.
Three of the controls confirm that the archived gate accepts the mutations
above (two of them also assert this gate rejects the deletion and the
substitution); the rest assert that this gate rejects the tree listing and
repository inventory mutations, an added upstream file, a rewritten
provenance commit, a rewritten `docs/SCOPE.md` address, and an interface
inventory that no longer matches the pinned IDLs.
The repository tree is never modified.

This does not re-fetch `pump-public-docs` or prove the saved bytes came from
commit `639b87fb45c3adeffa6f7c4a1bf0cb85e392bf22`; it only makes the saved
bytes impossible to swap without editing a second, reviewed file. The pinned
digests are a dated statement: a deliberate upstream evidence update must
change them in that same reviewed change. `scripts/verify_evidence.py` and
`.github/workflows/verify.yml` are unchanged, no captured account byte is
re-read, and no source rebuild or security sign-off is claimed.
