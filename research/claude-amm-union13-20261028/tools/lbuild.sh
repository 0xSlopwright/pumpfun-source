#!/bin/bash
# lbuild.sh SRC_WORKSPACE OUT_DIR : authenticated Linux v1.44 recipe of research/amm-fee-value-call-recovery
# (same image digest, mount points, env, cargo command), via podman. Writes OUT/{symbols.so,candidate.so,build.log,rows.json}
set -euo pipefail
SRC=$(cd "$1" && pwd); OUT=$2; mkdir -p "$OUT"; OUT=$(cd "$OUT" && pwd)
LIN=$HOME/amm100-run/lanes/mg-A-int/lin
W=/Users/shawwalters/Documents/Codex/2026-10-24/pumpfun-source/work
SRCM=$W/amm-swap-accounts-final-20261027/source
SDKM=$W/amm-linux-v144-20261027/sdk
CHM=$W/amm-pubkey-provenance-final-20261027/cargo-home
TGM=$W/amm-workspace-current-20261027/target
IMG=solanafoundation/solana-verifiable-build@sha256:6c73adc767ee7ff212f2532d4695472b12f3d4ac20aea3db22b89d8c614dac50
[ -d $LIN/cargo-home ] || cp -c -R $CHM $LIN/cargo-home
[ -d $LIN/target ] || cp -c -R $TGM $LIN/target
ST=$LIN/stage; rm -rf $ST; mkdir -p $ST
cp -c -R "$SRC/Cargo.toml" "$SRC/Cargo.lock" "$SRC/crates" "$SRC/programs" $ST/
find $ST -name target -prune -o -name '.DS_Store' -print | xargs rm -f
find $ST -type f -exec touch {} +   # newer than any previous fingerprint: path crates always rebuild
COMMON=(--rm --platform linux/amd64 --network none --entrypoint=/usr/bin/env
  -v $ST:$SRCM:ro -v $SDKM:$SDKM:ro -v $LIN/cargo-home:$CHM:rw -v $LIN/target:$TGM:rw -v $OUT:/out:rw -w $SRCM
  -e CARGO_HOME=$CHM -e CARGO_TARGET_DIR=$TGM -e RUSTC=$SDKM/rust/bin/rustc -e RUSTDOC=$SDKM/rust/bin/rustdoc
  -e CC=$SDKM/llvm/bin/clang -e AR=$SDKM/llvm/bin/llvm-ar -e LD_LIBRARY_PATH=$SDKM/rust/lib:$SDKM/llvm/lib
  -e "CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS= -Zremap-cwd-prefix=" -e CARGO_BUILD_JOBS=${JOBS:-4})
t0=$(date +%s)
podman run "${COMMON[@]}" $IMG -u RUSTFLAGS -u CARGO_ENCODED_RUSTFLAGS $SDKM/rust/bin/cargo build --release --target sbpf-solana-solana \
  --manifest-path $SRCM/Cargo.toml --locked --offline --verbose > "$OUT/build.log" 2>&1 || { tail -30 "$OUT/build.log"; echo LINUX_BUILD_FAILED; exit 1; }
podman run "${COMMON[@]}" $IMG $SDKM/llvm/bin/llvm-objcopy --strip-all $TGM/sbpf-solana-solana/release/pump_amm_recovered.so /out/candidate.so
cp $LIN/target/sbpf-solana-solana/release/pump_amm_recovered.so "$OUT/symbols.so"
echo "linux build $(( $(date +%s)-t0 ))s root_invocations=$(grep -c 'Running `.*--crate-name pump_amm_recovered ' "$OUT/build.log")"
shasum -a 256 "$OUT/symbols.so" "$OUT/candidate.so" | awk '{print $1}' | tr '\n' ' '; echo
python3 -I -B $HOME/amm100-run/shared/tools/measure.py "$OUT/symbols.so" --json "$OUT/rows.json" | python3 -I -B -c "import json,sys; d=json.load(sys.stdin); print('normalized',d['normalized'],'raw',d['raw'])"
