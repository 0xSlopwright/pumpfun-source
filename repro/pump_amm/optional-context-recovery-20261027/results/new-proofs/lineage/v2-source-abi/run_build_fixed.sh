#!/bin/sh
set -eu
PYTHONDONTWRITEBYTECODE=1 exec work/test-env/bin/python -B work/amm-v2-context-abi-next-20261027/build_entrypoint.py \
 --source work/amm-v2-context-abi-next-20261027/source \
 --cargo-home work/amm-entrypoint-build-worker-20261027/cargo-home \
 --logical-cargo-home work/amm-pubkey-provenance-final-20261027/cargo-home \
 --sdk work/amm-linux-v144-20261027/sdk \
 --output work/amm-v2-context-abi-next-20261027/build-fixed \
 --target-cache work/amm-liquidity-continuation-20261027/target \
 --logical-target-cache /Users/shawwalters/Documents/Codex/2026-10-24/pumpfun-source/work/amm-liquidity-continuation-20261027/target
