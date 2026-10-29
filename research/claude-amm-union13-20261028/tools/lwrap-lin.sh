#!/bin/bash
# mg-A-raw: rust-lld wrapper for the Linux container build (root crate only, via `cargo rustc -- -C linker=`).
# Saves link inputs to /lwout (objects, version script, rustc's default.ld, args) and, when /lw/ordered.ld exists,
# links with it instead of rustc's default script. Everything else is forwarded unchanged.
set -e
SDKM=/Users/shawwalters/Documents/Codex/2026-10-24/pumpfun-source/work/amm-linux-v144-20261027/sdk
REAL=$SDKM/rust/lib/rustlib/x86_64-unknown-linux-gnu/bin/rust-lld
D=/lwout; mkdir -p "$D/in"
args=("$@"); keep=("$@")
for ((i=0; i<${#args[@]}; i++)); do
  a="${args[i]}"
  if [[ "$a" == --version-script=* ]]; then cp "${a#--version-script=}" "$D/in/version-script.list"; args[i]="--version-script=/lwout/in/version-script.list"
  elif [[ "$a" == --script=* ]]; then cp "${a#--script=}" "$D/in/default.ld"; args[i]="--script=/lwout/in/default.ld"; [ -f /lw/ordered.ld ] && keep[i]="--script=/lw/ordered.ld"
  elif [[ "$a" == "-T" || "$a" == "--script" ]]; then cp "${args[i+1]}" "$D/in/default.ld"; args[i+1]="/lwout/in/default.ld"; [ -f /lw/ordered.ld ] && keep[i+1]="/lw/ordered.ld"
  elif [[ "$a" == *.o && -f "$a" ]]; then n=$(basename "$a"); cp "$a" "$D/in/$n"; args[i]="/lwout/in/$n"
  fi
done
printf '%s\n' "$@" > "$D/incoming-args.txt"
printf '%s\n' "${args[@]}" > "$D/args.txt"
[ -f /lw/ordered.ld ] && cp /lw/ordered.ld "$D/in/ordered.ld"
exec "$REAL" "${keep[@]}" -Map="$D/link.map"
