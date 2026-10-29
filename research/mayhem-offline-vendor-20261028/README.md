# Exact offline registry transport for the Mayhem Windows build

Run 40763323916 passed the reviewed native byte pin and both pinned SDK extraction
stages, then stopped before source compilation with HTTP 403 during concurrent
registry archive preparation. The traceback did not retain the exact failing
request URL. This is not evidence of a general registry outage.

Inspecting authenticated `Cargo.toml` metadata inside all 215 original archives
demonstrates three URL-construction errors in the sealed preparer's greedy
directory regex:

| Crate name | Exact version |
| --- | --- |
| `toml_datetime` | `1.1.2+spec-1.1.0` |
| `toml_edit` | `0.25.17+spec-1.1.0` |
| `toml_parser` | `1.1.5+spec-1.1.0` |

The old inferred crate-name URL segment incorrectly included the version prefix
before the final hyphen. Both incorrect and correct URL forms are recorded in
`inputs.json`; none is attributed to the exact concurrent failure without evidence.

This successor bundles the **215 original, unmodified `.crate` archives** in
`registry-archives.tar.gz`. Each whole archive SHA-256 agrees with the pre-existing
vendor pins. Their actual package names and versions are read from authenticated
Cargo manifests. Archive bytes, including packaged licenses and notices, remain
unchanged. The bundle is 16,367,780 bytes with SHA-256
`d1f4a413e30478bd21abb90bc7b9eee1a18fd99fc6f50e59f33ee348f019107c`.

`prepare.py` verifies the full current native byte inventory first. It seeds and
rechecks all 215 cache files before calling the sealed preparation function.
Registry transport is explicitly cache-only: a missing or changed archive fails
without an HTTP request. The old malformed inferred URL strings therefore cannot
trigger a fallback. SDK transport, extraction, vendor checksum-map reconstruction,
source staging, host/target compiler recipes and exact ELF checks remain those of
the sealed controllers.

`run.py` is an explicit successor of the sealed current-source Windows driver.
Its only operational changes are the preparer path and the proposal source
locator needed by the new packet directory. Added receipt fields identify this
transport adapter and the parent driver hash. The verifier checks that exact
derivation, and each actual run retains its own code hash and cache-seed receipt.
All older source/evidence packets and workflows remain untouched.

The dedicated `rebuild-canonical-mayhem-offline-vendor.yml` workflow installs the
same verified fixed MSVC cohort and invokes this successor. The reviewed native
pin `24e416c49991394bda6374439d05d8f004144a6e5c93492fc5541a78c472a36e`
can be supplied only if the entire current MSVC/Windows Kit inventory still matches;
the adapter enforces that before preparation or compilation.

No new source compilation, exact output or canonical promotion is claimed by
this transport proposal. Three local controls pass, including all 215 actual
archive/name/version checks, resealed false inner hashes and forbidden network
fallback with a `+spec` URL.

```sh
python3 -O -B research/mayhem-offline-vendor-20261028/test_prepare.py
python3 -O -B research/mayhem-offline-vendor-20261028/verify.py
```
