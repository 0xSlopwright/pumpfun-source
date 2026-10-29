# Maintained PumpSwap / AMM reconstruction

The selected source and [explicit build recipe](../../research/amm-layout-closure-20261028/README.md)
produce 784/785 raw-identical physical windows. Sell cashback at original0x4c750
is the sole unmatched9,024-byte function. Every other meaningful ELF byte agrees
literally, including all data and headers;21 differing relocation offsets also
belong inside sell. Whole meaningful ELF identity remains false.

Two actual source builds reproduce stripped 86dbc2c64e81988dead173039b61fa01ba5f68a00fbb6f6dd49f2cda0afec37f
and symbol 7271aaf8afe13b6c8f13a6cf0e9534896a66650dda13a2aa1b32e41edd46426d.
The second starts with entirely empty host and target build directories. The
builder authenticates 68 standalone inputs,69 workspace inputs,257 registry
packages and 8,180 source files. Its disclosed linker script orders real compiler
sections; no source/object/output bytes are patched. The original executable is
absent from the build container. Historical source/build provenance is unproven.

Fresh 25-suite execution passes17,462 strict paired cases and 35,418 verified
signature fields. Fresh loader controls cover 48 equal-allocation pairs,
24 captured-upgradeable pairs and 148 verified signature fields. Only compute
meter lines are excluded from ordered log comparisons. Three backend frame
diagnostics remain in each build; the diagnosed wrapper and its callees are literal
original bodies, and broad frame safety is not claimed.

```sh
python3 -O -B scripts/verify_current_checkpoint.py pump_amm
mkdir -p work/new-amm-target
python3 -B research/amm-layout-closure-20261028/build.py --repo . \
  --sdk /absolute/path/to/linux-v1.44-sdk \
  --cargo-home /absolute/path/to/authenticated-cargo-home \
  --target-dir work/new-amm-target --output work/new-amm --clean-all
```

The compiler emits1,268,504 meaningful bytes. The captured9,217,211-byte zero
allocation suffix is checked separately and is never appended to compiler output.
Earlier r31 and r13 selections remain immutable historical evidence under
`repro/pump_amm/canonical-frontier-20261028/`.

The [prior maintained README](../../research/contract-completion-20261028/amm-readme-before-closure.md) is retained as historical documentation.
