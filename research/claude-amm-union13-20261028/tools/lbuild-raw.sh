#!/bin/bash
# lbuild-raw.sh SRC_WS OUT [ORDERED_LD] : mg-A-int lbuild.sh recipe (same pinned image, mounts, env, flags) except the
# root crate is built with `cargo rustc -p pump-amm-recovered --lib ... -- -C linker=/lw/lwrap-lin.sh`, which saves the
# link inputs (OUT/link) and, if ORDERED_LD is given, links with it instead of rustc's default script.
# Own cargo-home/target under lanes/mg-A-raw/lin. Runs under the shared AMM slot lock.
# Writes OUT/{symbols.so,candidate.so,build.log,rows.json,link/{args.txt,incoming-args.txt,in/,link.map,rlib/}}
set -euo pipefail
SRC=$(cd "$1" && pwd); OUT=$2; mkdir -p "$OUT"; OUT=$(cd "$OUT" && pwd); LDS=${3:-}
[ -n "$LDS" ] && LDS=$(cd "$(dirname "$LDS")" && pwd)/$(basename "$LDS")
L=/Users/shawwalters/amm100-run/lanes/mg-A-int; LIN=$L/linraw
W=/Users/shawwalters/Documents/Codex/2026-10-24/pumpfun-source/work
SRCM=$W/amm-swap-accounts-final-20261027/source
SDKM=$W/amm-linux-v144-20261027/sdk
CHM=$W/amm-pubkey-provenance-final-20261027/cargo-home
TGM=$W/amm-workspace-current-20261027/target
IMG=solanafoundation/solana-verifiable-build@sha256:6c73adc767ee7ff212f2532d4695472b12f3d4ac20aea3db22b89d8c614dac50
[ -d $LIN/cargo-home ] || cp -c -R $HOME/amm100-run/lanes/mg-A-int/lin/cargo-home $LIN/cargo-home
[ -d $LIN/target ] || cp -c -R $HOME/amm100-run/lanes/mg-A-int/lin/target $LIN/target
ST=$LIN/stage; rm -rf $ST; mkdir -p $ST
cp -c -R "$SRC/Cargo.toml" "$SRC/Cargo.lock" "$SRC/crates" "$SRC/programs" $ST/
find $ST -name target -prune -o -name '.DS_Store' -print | xargs rm -f
find $ST -type f -exec touch {} +   # newer than any previous fingerprint: path crates always rebuild
LW=$LIN/lw; rm -rf $LW; mkdir -p $LW; cp $L/tools/raw/lwrap-lin.sh $LW/
if [ -n "$LDS" ]; then cp "$LDS" $LW/ordered.ld; fi
rm -rf "$OUT/link"; mkdir -p "$OUT/link"
rm -f $LIN/target/sbpf-solana-solana/release/pump_amm_recovered.so $LIN/target/sbpf-solana-solana/release/deps/pump_amm_recovered.so
COMMON=(--rm --platform linux/amd64 --network none --entrypoint=/usr/bin/env
  -v $ST:$SRCM:ro -v $SDKM:$SDKM:ro -v $LIN/cargo-home:$CHM:rw -v $LIN/target:$TGM:rw -v $OUT:/out:rw
  -v $LW:/lw:ro -v $OUT/link:/lwout:rw -w $SRCM
  -e CARGO_HOME=$CHM -e CARGO_TARGET_DIR=$TGM -e RUSTC=$SDKM/rust/bin/rustc -e RUSTDOC=$SDKM/rust/bin/rustdoc
  -e CC=$SDKM/llvm/bin/clang -e AR=$SDKM/llvm/bin/llvm-ar -e LD_LIBRARY_PATH=$SDKM/rust/lib:$SDKM/llvm/lib
  -e "CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS= -Zremap-cwd-prefix=" -e CARGO_BUILD_JOBS=${JOBS:-4})
t0=$(date +%s)
python3 -I $HOME/amm100-run/shared/tools/slot.py 6 -- podman run "${COMMON[@]}" $IMG -u RUSTFLAGS -u CARGO_ENCODED_RUSTFLAGS \
  $SDKM/rust/bin/cargo rustc -p pump-amm-recovered --lib --release --target sbpf-solana-solana \
  --manifest-path $SRCM/Cargo.toml --locked --offline --verbose -- -C linker=/lw/lwrap-lin.sh > "$OUT/build.log" 2>&1 || { tail -30 "$OUT/build.log"; echo LINUX_BUILD_FAILED; exit 1; }
podman run "${COMMON[@]}" $IMG $SDKM/llvm/bin/llvm-objcopy --strip-all $TGM/sbpf-solana-solana/release/pump_amm_recovered.so /out/candidate.so
cp $LIN/target/sbpf-solana-solana/release/pump_amm_recovered.so "$OUT/symbols.so"
# host-side APFS clones of every rlib the link used (link-only replays stay valid after later builds)
mkdir -p "$OUT/link/rlib"
grep -E '\.rlib$' "$OUT/link/args.txt" | while read -r p; do h=${p/#$TGM/$LIN/target}; cp -c "$h" "$OUT/link/rlib/" 2>/dev/null || cp "$h" "$OUT/link/rlib/"; done
echo "linux build $(( $(date +%s)-t0 ))s root_invocations=$(grep -c 'Running `.*--crate-name pump_amm_recovered ' "$OUT/build.log") warn_stack=$(grep -c 'Stack offset' "$OUT/build.log" || true)"
shasum -a 256 "$OUT/symbols.so" "$OUT/candidate.so" | awk '{print substr($1,1,16)}' | tr '\n' ' '; echo
MEASURE_FRONTIER=${MEASURE_FRONTIER:-/nonexistent-frontier.json} python3 -I -B $HOME/amm100-run/shared/tools/measure.py "$OUT/symbols.so" --json "$OUT/rows.json"
