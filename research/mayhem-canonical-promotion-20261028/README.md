# Maintained Mayhem source qualification

This packet promotes the 67 exact raw compiler inputs into the maintained Mayhem
crate, together with the actually executed exact builder and its README. The
previous 15-file maintained tree is retained separately under `prior-source/`.
`selection.json` binds the new 69-file inventory and the 67-file compiler
projection. The old sealed research packets remain unchanged.

Two independent GitHub-hosted Windows runs build both the historical host macro
and current target in absent target directories. Each records 42 host crate
commands and 163 target-Cargo commands. Both complete symbol-bearing files and
ordinary stripped files repeat literally:

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `symbols.so` | 907,776 | `7b15bb1e5c7c9c53041322fa64d4a420906fffd96ff97a55d70d627bcb854960` |
| `candidate.so` | 775,416 | `9af9e3b1cbc9d89340af4d9d46e4c88d3dc2fc67e0090f9370047d97532ff09d` |

The stripped file equals every meaningful original ELF byte. The captured
777,408-byte allocation has a separate 1,992-byte zero suffix. That suffix is
never appended to a compiler output.

The published source directory still contained an older unused prototype
entrypoint. Both runs explicitly invoked the new linker-locator builder, whose
bytes are installed as `programs/mayhem/build_exact.py`. The verifier stages the
live maintained source through that builder, compares all 67 raw inputs and every
effective controller input with both actual source archives and mappings, and
checks the observed prototype entrypoint hash separately. The README and new
entrypoint do not enter the compiled source projection.

The exact recipe uses Windows v1.54 SDK, pinned Linux target sysroot, 215
authenticated registry archives, fixed VS Build Tools 17.14.40, the original
selected 53 MSVC payload members, and Windows Kit 10.0.26100.0. All 8,491 native
files reproduce the reviewed SHA-256
`24e416c49991394bda6374439d05d8f004144a6e5c93492fc5541a78c472a36e`
before and after each build. The installer catalog's declared digest differs
from the observed admitted catalog encoding; this caveat is retained. Exact
compiler payload, full native inventory, SDK and vendor checks do not infer a
fully authenticated historical catalog chain.

The predecessor run 40766148667 compiled successfully but failed complete ELF
identity because literal Cargo archive filename digests no longer matched linker
selectors. Its rejected receipts remain rejected. The reviewed successor changes
only 539 filename-digest selectors across 18 object locators; CGU names, section
identities and order remain fixed. Neither source bytes nor output bytes are
edited to obtain acceptance. The two new runs compile this explicit successor
recipe afresh.

Fresh local runtime receipts bind the first actual hosted image to a real
upgradeable-loader deployment using normally signed transactions. The VM returns
the entire captured allocation literally. The unchanged 21-suite retained corpus
then runs on that loader-produced payload and the genuine captured original,
with every normally signed submission retained. A separate direct-load control
records the shorter ELF's own-program-account allocation difference explicitly.
All complete saved original/candidate observation objects match literally,
including raw logs and own-program snapshots where recorded. There is no
comparison mask in this new verification. The 9,592 fixture cases include three
two-step burn sequences: together they yield 9,595 paired transaction comparisons,
19,190 normally signed submissions and 38,192 signature fields. The loader and
direct allocation controls bring the independently rechecked totals to 20,056
transactions and 39,062 signature fields. Admin suites retain their pre-existing
zero-history VM setting; signatures are never disabled.

The unchanged legacy fixture reports preserve incidental `source_sha256` fields
from the old 15-file maintained tree present during execution. Those snapshots
are retained, not rewritten or credited as compiler-input proof. The new runtime
controller binds the actual hosted image to the real-loader payload and fresh
executions; the two actual Windows archives independently prove its 67 compiled
inputs. Finite harness observation fields and coverage limits remain explicit.

```sh
python3 -O -B research/mayhem-canonical-promotion-20261028/verify.py --repo .
python3 -O -B research/mayhem-canonical-promotion-20261028/test_verify.py
# Requires the recorded solders runtime package; executes no target:
python3 -B research/mayhem-canonical-promotion-20261028/verify_signatures.py
```

The static verifier checks both artifact ZIP digests against retained GitHub
artifact metadata, their complete inner inventories, compiler/source/SDK/native
receipts, ordinary stripping, whole ELF equality and loader/runtime bindings. It
executes no compiler, VM, subprocess, network request or Git mutation. Saved
receipts are not cryptographic execution attestation. The separate signature
verifier checks every retained raw transaction cryptographically.

The old historical source spelling, original dependency composition and private
build host remain unknown. This is a reproducible reconstruction, not an
attribution of those historical facts. Local finite tests do not establish a
security audit, deployed state or live transaction acceptance.
