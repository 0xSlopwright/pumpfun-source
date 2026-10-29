# Mayhem maintained-source Windows build proposal

This is a new build route awaiting execution. `programs/mayhem` is unchanged.
The existing three Windows build chains remain historical research evidence;
they are not receipts for this proposed maintained-source installation.

`mayhem-proposal/source/` contains the 67 exact, decompressed source inputs of
`research/mayhem-fresh-host-20261028/controller/source-inputs.json`, plus a new
`build_exact.py`. The wrapper stages these live bytes into a copy of that packet's
fresh-host controller, records every mapping and controller hash, and invokes its
original host and target builders. The old packet is never modified. Metadata
and path remapping, explicit linker ordering and ordinary stripping remain
recorded compiler operations. There is no ELF byte patching or allocation padding.

The dedicated `.github/workflows/rebuild-canonical-mayhem.yml` can be dispatched
after review and publication. It checks out exact LF/CRLF bytes and uses Windows
2025 with Python 3.13.7. This runner label is a locator; acceptance depends on the
actual byte inventories below.

1. Dispatch with an empty `native_inputs_sha256`. If the exact qualified native
   tools are present, the preflight writes their complete MSVC and Windows Kit
   byte inventory and its SHA-256 to the uploaded `inputs/native-inputs.json`.
   This first run deliberately fails before downloading or compiling. If the
   exact tools are absent, `inputs/msvc-candidates.json` identifies the available
   tools and the run fails without substitution.
2. Review the recorded inventory and dispatch with its full SHA-256. This pin
   must match before the SDK/vendor preparation or compiler invocation. A changed
   hosted image must be reviewed through a new preflight. No cached compiler or
   proc macro output is downloaded or restored.
3. The controller builds the historical-source host macro in a new target
   directory (42 crate commands), then builds the 67 current target inputs in a
   separate new target directory (163 Cargo crate commands). It validates both
   exact ELF hashes and compares every meaningful original byte. It rechecks the
   full native byte inventories after compilation.
4. The artifact includes this run's qualification, source maps and source
   archives, full native inventories, preparation receipt, compiler logs and
   launch records, fresh macro DLL and binding, wrapper/linker records, and both
   ELF outputs. Failed runs retain their own failure evidence. A manifest binds
   every retained artifact file. Source promotion remains a separate review
   after a successful actual run.

The native cohort is MSVC **14.44.35207**, Windows Kit **10.0.26100.0**. The
qualified executable hashes are:

| File | SHA-256 |
| --- | --- |
| `cl.exe` | `88c8344236a27a6e727e0a8edc49aaa2690bdc7a9464b9d18cc7abe70a9f1c0d` |
| `link.exe` | `ca11e6c45debd34bf652dfe984c5360a531a005ed78bf72852330c9c2590cf0d` |
| Windows platform-tools v1.54 archive | `98e731bc4db8b55b4dc07229639bf0c91f76cc5117dcd7f31d9633a8943b96e9` |
| Linux platform-tools v1.54 archive | `fcc41631c7f77561bf5412218bf297501dccf0305ea280f338f0ace2aab9f31e` |

The sealed packet pins all 2,639 Windows SDK component files, the 27 selected
Linux target sysroot files, 215 registry archive/checksum maps, historical macro
source and ten supplemental crate archives. The older evidence pins cl/link and
the Windows Kit version, but does not provide a full historical Windows Kit file
inventory. This new route additionally requires the complete native input tree
pin before compiling; it does not invent an unknown historical tree hash.

The target must produce these ordinary files:

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `symbols.so` | 907,776 | `7b15bb1e5c7c9c53041322fa64d4a420906fffd96ff97a55d70d627bcb854960` |
| `candidate-v154-strip.so` | 775,416 | `9af9e3b1cbc9d89340af4d9d46e4c88d3dc2fc67e0090f9370047d97532ff09d` |

The original allocation is 777,408 bytes. The separate 1,992-byte zero tail must
remain absent from compiler output. The build executes no target transactions.
This proves a reconstructed source recipe if successful; it does not establish
the spelling or toolchain provenance of the historical private source.

Local checks completed on macOS: 67-source staging, all 215 registry archives
reconstructed byte-for-byte into their pinned checksum-map form, and five
controls covering changed/extra current Rust input, bad SDK hash, unsafe archive
paths and bounded evidence retention. These checks execute no Windows compiler.

```sh
python3 -O -B research/all-contract-completion-20261028/test_mayhem_proposal.py
python3 -B research/all-contract-completion-20261028/mayhem-proposal/source/build_exact.py \
  --repo . --stage-only --output work/mayhem-proposal-stage-NEW
```

After a successful hosted build, promotion can copy this source proposal into
`programs/mayhem`, repeat current-source staging verification, and install a
selection that binds the actual Windows run, ordinary ELF paths and source
inventory. The exact builder chooses `programs/mayhem/build_exact.py` when that
canonical entry point exists. Global source scanners, selected status and CI
must then be advanced together by the integration owner.
