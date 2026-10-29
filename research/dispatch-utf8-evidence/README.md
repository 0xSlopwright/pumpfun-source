# Locale-independent dispatch evidence reads

The archived dispatch tool reads UTF-8 IDLs and fallback binary-analysis JSON
with the host's default text encoding. On the tested Windows CP936 locale,
the real Pump IDL fails with `UnicodeDecodeError` at byte 56970 before dispatch
recovery can run.

This reviewed-source-bound successor changes only those two reads to explicit
UTF-8. Its CLI writes a new UTF-8 result file rather than overwriting archived
`evidence/dispatch-map.json`. Both reviewed LF and CRLF checkouts work; other
source drift is rejected. Address scanning and attribution stay unchanged.

```sh
python research/dispatch-utf8-evidence/test_recover.py
python -X utf8=0 research/dispatch-utf8-evidence/recover.py --output work/dispatch-utf8.json
python scripts/verify_evidence.py
python scripts/test_tooling.py
```

The output parent must exist and the file must be new. Omitting `--program`
processes the four originals listed in `repro/programs.json`. Tests compare all
real dispatch records with the archived UTF-8 baseline under a CP936-default
reader and verify unchanged binary hashes. `validation.json` also records the
actual Windows command reproduction and before/after output binding.

This is a text-decoding correction. Discriminator matches and wrapper-call
observations retain the original tool's limits; they do not prove complete
handler recovery, runtime execution or source equivalence.
