# Required artifact coverage for static analysis manifests

The five archived generators verify hashes only for names present in each
packet's manifest. Removing a required name can therefore disable that check.
On freshly generated real packets, the old verifiers accept a missing call
graph, dispatch table, shared-signature report or reconstruction plan after
its manifest entry is removed. The section verifier also accepts a replaced
relocation report when that entry is removed, because it checks only presence.

This supplemental guard requires the known artifact set for each packet type
and then verifies every declared hash, including optional additional files.
It rejects unsafe names and symlink payloads before reading their bytes. It
never executes a packet's `verify.py`. Original generators, their verifiers
and all historical packets remain intact.

```sh
python research/static-packet-manifest-coverage/test_check_manifest.py
python research/static-packet-manifest-coverage/check_manifest.py --kind disassembly --packet work/mayhem-disassembly
python scripts/verify_evidence.py
python scripts/test_tooling.py
```

Kinds are `windows`, `sections`, `disassembly`, `signatures` and `roadmap`.
Run the packet's original verifier separately when its generated source is
trusted, to retain its structural consistency checks. This guard adds manifest
coverage and does not replace those checks. Tests regenerate all five types
from actual captured originals, demonstrate the old acceptance on isolated
copies, and require the guard to reject each omission.

`validation.json` records the tested revision, generator hashes and outcomes.
An unsigned checksum manifest does not authenticate its author or prove the
analysis correct: coordinated changes to payloads and recorded hashes remain
outside this coverage check. Undeclared extra files are not verified. No
source equivalence, runtime behavior or reconstruction coverage is inferred.
