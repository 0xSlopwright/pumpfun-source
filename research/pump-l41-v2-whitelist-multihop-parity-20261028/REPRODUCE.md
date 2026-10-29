# Reproduce the L41 composition

Run all commands from the repository root. No command contacts RPC, submits a
transaction, or uses the deployed ELF as compiler input.

## Verify retained evidence

```sh
python3 -I -B research/pump-l41-v2-whitelist-multihop-parity-20261028/verify.py
python3 -I -B research/pump-l41-v2-whitelist-multihop-parity-20261028/test_negative_controls.py
```

The verifier needs only the checkout's frozen original, function inventory,
comparison helpers, L41 packet, and this packet. It rejects missing or extra
files and symlinks.

## Materialize source

```sh
packet=research/pump-l41-v2-whitelist-multihop-parity-20261028
parent=research/claude-pump-integration-20261027/r37-layout-41/source/programs/pump
output=work/pump-l41-v2-whitelist-multihop-reproduction/source/programs/pump
mkdir -p "$(dirname "$output")"
cp -R "$parent" "$output"
gzip -dc "$packet/source.patch.gz" | \
  patch -p1 -d work/pump-l41-v2-whitelist-multihop-reproduction/source
```

Confirm the three resulting source files equal `proposed/programs/pump/src/`.

## Build

Supply the authenticated v1.44 SDK, offline Cargo registry, and the directory
containing the exact Linux-v1.44 SBPF target libraries. The packet receipts
record every admitted hash.

```sh
python3 scripts/pump_build_verified.py \
  --source-directory "$output" \
  --sdk /path/to/v1.44/platform-tools \
  --registry-home /path/to/offline/cargo-home \
  --output work/pump-l41-v2-whitelist-multihop-reproduction/build-1 \
  --target-library-profile linux-v1.44-sbpf \
  --target-library-directory /path/to/linux-v1.44/sbpf-solana-solana/lib \
  --workspace-layout
```

Repeat into `build-2`. The expected final hashes are:

- stripped: `47b5968f571e3d983ead2ff7545adcebb0e79b395566483c54a6f7594cb7c2e4`
- unstripped: `f61b4a398509cb2f21f5435e263488c2fda7e793fe38e87ad8b6746f2c4c0741`

The absolute paths in the retained historical receipts describe the local
execution that produced them. They are provenance records, not reproduction
requirements; equivalent authenticated paths may be supplied explicitly.

## Focused V2 replay

With `solders==0.27.1` available from an authenticated offline environment:

```sh
python3 research/pump-v2-whitelist-sync-20261028/qualify.py \
  --repo . \
  --baseline research/claude-pump-integration-20261027/r37-layout-41/candidate.so \
  --candidate work/pump-l41-v2-whitelist-multihop-reproduction/build-1/candidate.so \
  --output work/pump-l41-v2-whitelist-multihop-reproduction/v2-focused.json.gz
```

Expected: 18 cases, six control mismatches, zero candidate mismatches, and 54
verified outer signatures.

## Complete captured-loader corpus

Use the exact staged source path from the candidate build receipt:

```sh
python3 scripts/pump_validate_parallel.py \
  --candidate work/pump-l41-v2-whitelist-multihop-reproduction/build-1/candidate.so \
  --source-directory work/pump-l41-v2-whitelist-multihop-reproduction/build-1/source/programs/pump \
  --build-comparison work/pump-l41-v2-whitelist-multihop-reproduction/build-1/build-comparison.json \
  --output work/pump-l41-v2-whitelist-multihop-reproduction/full.json.gz \
  --workers 4 \
  --captured-loader
```

Expected: 44 suites, 10,468 cases, 10,464 paired-log cases, zero structured
and ordered-log mismatches.
