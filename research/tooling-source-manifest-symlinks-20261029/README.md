# Symlinked compiler inputs in the source manifest

`scripts/build_source_manifest.py` walks a crate with `Path.rglob`, accepts every
`p.is_file()` result, and returns only `path -> sha256`. `is_file()` follows
symlinks, so a symlinked `.rs` file inside the crate is reported under its
in-repo path while its bytes come from outside the repository. A later copy
step would compile those external bytes under the local source name, and the
manifest would not reveal the substitution.

`build_supported_sbpf_candidate.py` already rejects symlinked sources explicitly.
The archived helper does not, and `pump_build_verified.py` calls it directly
before copying the recorded paths.

```sh
python3 -B research/tooling-source-manifest-symlinks-20261029/test_verify.py
python3 -B research/tooling-source-manifest-symlinks-20261029/verify.py --repo .
python3 -B scripts/verify_evidence.py
python3 -B scripts/test_tooling.py
```

## Result

The real `programs/pump` manifest has 65 entries and no symlinks; the strict
wrapper returns exactly the archived manifest. On a detached temporary crate,
the archived helper accepts `crate/src/lib.rs -> ../outside.rs` and records the
external hash under the in-repo key. The strict wrapper raises
`symlinked compiler input`. An extra-input directory containing a symlinked
asset is also rejected.

The archived script, the real source tree and all reports remain unchanged.

## Method and limits

The reviewed helper (LF or CRLF form) is loaded and hash-checked. The wrapper
checks every reported file and every supplied extra-input file for symlinks and
for a resolved path outside the repository, then compares the real-repository
result with the archived result. `observations.json.gz` records the 65 files and
the empty symlink set; `coverage-delta.json` records only those totals.

This is an admission check for local compiler inputs. It does not build the
crate, prove that the recorded files are the historical source, validate Cargo
feature resolution, or claim whole-program equality. It does not modify the
frozen script, and the archived helper's behavior on symlinks is preserved for
existing evidence.
