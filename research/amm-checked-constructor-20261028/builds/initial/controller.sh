#!/bin/bash
set -euo pipefail
P=$(cd "$(dirname "$0")" && pwd)
OUT=$P/$1; mkdir -p "$OUT"
python3 -I -B "$P/snapshot.py" "$OUT"
LIN=$P/linux; mkdir -p "$LIN"
W=/Users/shawwalters/Documents/Codex/2026-10-24/pumpfun-source/work
SRCM=$W/amm-swap-accounts-final-20261027/source
SDKM=$W/amm-linux-v144-20261027/sdk
CHM=$W/amm-pubkey-provenance-final-20261027/cargo-home
TGM=$W/amm-workspace-current-20261027/target
IMG=solanafoundation/solana-verifiable-build@sha256:6c73adc767ee7ff212f2532d4695472b12f3d4ac20aea3db22b89d8c614dac50
if [ ! -d "$LIN/cargo-home" ]; then cp -c -R /Users/shawwalters/amm100-run/lanes/mg-A-int/lin/cargo-home "$LIN/cargo-home"; fi
if [ ! -d "$LIN/target" ]; then cp -c -R /Users/shawwalters/amm100-run/lanes/mg-A-int/lin/target "$LIN/target"; fi
COMMON=(--rm --platform linux/amd64 --network none --entrypoint=/usr/bin/env -v "$P/src:$SRCM:ro" -v "$SDKM:$SDKM:ro" -v "$LIN/cargo-home:$CHM:rw" -v "$LIN/target:$TGM:rw" -v "$OUT:/out:rw" -w "$SRCM" -e "CARGO_HOME=$CHM" -e "CARGO_TARGET_DIR=$TGM" -e "RUSTC=$SDKM/rust/bin/rustc" -e "RUSTDOC=$SDKM/rust/bin/rustdoc" -e "CC=$SDKM/llvm/bin/clang" -e "AR=$SDKM/llvm/bin/llvm-ar" -e "LD_LIBRARY_PATH=$SDKM/rust/lib:$SDKM/llvm/lib" -e "CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS= -Zremap-cwd-prefix=" -e CARGO_BUILD_JOBS=3)
podman run "${COMMON[@]}" "$IMG" -u RUSTFLAGS -u CARGO_ENCODED_RUSTFLAGS "$SDKM/rust/bin/cargo" build --release --target sbpf-solana-solana --manifest-path "$SRCM/Cargo.toml" --locked --offline --verbose > "$OUT/build.log" 2>&1
podman run "${COMMON[@]}" "$IMG" "$SDKM/llvm/bin/llvm-objcopy" --strip-all "$TGM/sbpf-solana-solana/release/pump_amm_recovered.so" /out/candidate.so
cp "$LIN/target/sbpf-solana-solana/release/pump_amm_recovered.so" "$OUT/symbols.so"
python3 -I -B /Users/shawwalters/amm100-run/shared/tools/measure.py "$OUT/symbols.so" --json "$OUT/rows.json" > "$OUT/summary.json"
cat "$OUT/summary.json"
