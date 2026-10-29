# Pump Fees — canonical exact reconstruction

The maintained Rust source reproduces all 873,256 meaningful bytes of the captured
Fees ELF, including all 585 raw function windows. The separate 75,688-byte zero
loader-allocation tail is not emitted by the compiler.

The canonical-path build freshly compiled both local crates after explicit cleaning
and reproduced the complete qualified compiler output and ordinary stripped image.
Its input mapping, SDK/library/registry checks, compiler logs and outputs are retained
in `research/all-contract-completion-20261028/fees-built/canonical-01`.

Use the explicit reconstructed build recipe:

```sh
python3 -B programs/pump-fees/build_exact.py \
  --sdk /inputs/platform-tools-v1.44-linux \
  --registry /inputs/cargo/registry \
  --objcopy /inputs/platform-tools-v1.52/llvm/bin/llvm-objcopy \
  --output work/fees-exact-fresh
```

The controller uses a cached pinned Linux container image with networking disabled.
It maps the canonical Rust, IDL, math and vendored macro bytes into the qualified
workspace layout. The two Cargo manifest/path adaptations are explicit: the local
math dependency is staged at the qualified sibling location, and the macro is
mounted at its recorded out-of-workspace locator. `exact/ordered.ld` provides the
reconstructed input-section order. LLD resolves code/data references normally; no
captured ELF is a build input and no ELF bytes are patched.

The root workspace's Cargo manifest/lock resolve this crate, its local math crate
and the same vendored macro. Ordinary Cargo resolution consumes canonical bytes;
the explicit controller additionally preserves the paths, flags and linker order
required for exact binary reproduction.

Verify current maintained source and its saved exact build without compiling:

```sh
python3 -O -B research/all-contract-completion-20261028/verify_current_fees.py
```

The 17,331-case research validation summary is bound to this same exact candidate.
No runtime suite is rerun by the current-source verifier. The source/build recipe is
a reproducible reconstruction; unique historical source spelling and historical
build provenance are not claimed. The previous partial canonical source and sealed
research packets remain preserved in the completion packet and their original paths.
