# Portable Cargo input locators for the exact Mayhem linker recipe

Actual Windows run 40766148667 compiled a fresh 42-command host macro and a fresh
163-command target from the 67 verified current source inputs. Its exact-output
gate rejected both ordinary files. Those rejected outputs and receipts remain
unchanged; this successor does not relabel them as accepted.

The old/current linker maps contain the same **1,253 input sections**, each with
identical size and alignment. All **550 named function symbols** have identical
normalized bodies and sizes. Across the complete 441-window source inventory,
all **4,768 direct-call edges** pair consistently, with no unknown targets. The
actual window census is **435 normalized / 86 raw-local**, reflecting changed
layout. All 804 corresponding data input sections agree after excluding their
actual recorded pointer relocations. Whole-file identity still fails.

The cause is concrete: 18 Cargo archive/member filename digests differ, while
the internal CGU identifiers, section names and mangled function names agree.
The old script embeds the prior filenames in 539 section selectors. They miss
the current files, so the linker appends orphan sections and resolves addresses
in a different layout. `diagnosis.json`, the retained observed linker map and
`complete-call-pairing.json` preserve these observations.

The derived `ordered-native.ld` replaces only those Cargo artifact filename
digests with file-locator wildcards. Internal CGU identities, section names,
selector ordering and every other script byte remain fixed. The verifier proves
all 539 changed selectors each match exactly one section in both the old and
actual new input sets. It rejects widened CGU identities or reordered sections.

`build_exact.py` uses the sealed source stager on the live canonical/proposal
bytes, records the explicit old/new script hashes, substitutes this script in an
owned recipe copy, and records all effective recipe hashes before compiling.
The old source/build packets are not edited. No ELF bytes are patched or masked.
Both complete-file hash expectations and the meaningful-original comparison stay
unchanged. A new actual Windows build and an independent repeat are required.

The separate `rebuild-canonical-mayhem-linker-locators.yml` workflow reuses the
verified fixed compiler installation and the fully authenticated offline crate
cache. It requires the complete native byte pin before compiling. The successor
driver retains its own hash and identifies the linker-recipe adaptation; once
canonical source is installed it invokes that maintained exact entry point.

No fresh output from this new linker recipe or canonical source promotion is
claimed by this packet. Four controls pass, including the complete two-map
selector proof and current-source staging.

```sh
python3 -O -B research/mayhem-linker-locators-20261028/verify.py
python3 -O -B research/mayhem-linker-locators-20261028/test_recipe.py
```
