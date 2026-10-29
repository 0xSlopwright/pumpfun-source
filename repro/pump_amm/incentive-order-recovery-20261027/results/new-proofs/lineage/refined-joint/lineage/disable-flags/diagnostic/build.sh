#!/bin/sh
set -eu
# Absolute paths: diagnostic source directory, existing target cache, SDK root.
probe_dir="$1"
probe_target="$2"
probe_sdk="$3"
probe_file="${4:-allocator_variants.rs}"
probe_output="${5:-allocator_variants.o}"
podman run --rm --pull=never --platform=linux/amd64 --network=none --cpus=2 --memory=1g \
  --entrypoint=/usr/bin/env \
  -v "$probe_dir:/diagnostic:rw" -v "$probe_target:/target:ro" -v "$probe_sdk:/sdk:ro" \
  -w /diagnostic -e LD_LIBRARY_PATH=/sdk/rust/lib:/sdk/llvm/lib \
  docker.io/solanafoundation/solana-verifiable-build@sha256:6c73adc767ee7ff212f2532d4695472b12f3d4ac20aea3db22b89d8c614dac50 \
  /sdk/rust/bin/rustc --edition=2021 --crate-type=lib --target=sbpf-solana-solana \
  -C opt-level=3 -C panic=abort -C overflow-checks=on -C codegen-units=1 \
  -L dependency=/target/sbpf-solana-solana/release/deps -L dependency=/target/release/deps \
  --extern anchor_lang=/target/sbpf-solana-solana/release/deps/libanchor_lang-c26e3b3b316f08d7.rlib \
  --extern anchor_spl=/target/sbpf-solana-solana/release/deps/libanchor_spl-5ddaec3bc388b793.rlib \
  --extern pump_amm_recovered=/target/sbpf-solana-solana/release/deps/libpump_amm_recovered.rlib \
  --emit=obj,llvm-ir "$probe_file" -o "$probe_output"
