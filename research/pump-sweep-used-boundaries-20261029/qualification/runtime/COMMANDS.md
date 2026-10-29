# Exact Sweep qualification handoff

This directory retains the qualification work for PR 713. The source overlay
remains exactly 15dbbd46; proposed-image results are now retained alongside the earlier controls. Use the unchanged
maintained producer and existing synthetic signers through captured loader
accounts. Never send these transactions to a network.

Frozen controller `replay.py` SHA256:
`c2e4822b7237002ea280b8ddffea412d47b899d30c7bcdaea307db2585a1b734`.
Manifest `FIXTURES-v2.json` SHA256:
`049f33948de451a10c915d2e79c04bff8210b33d82a42ed812a1ab1803481c88`.
It binds 19 maintained fixture/loader/data inputs. Maintained 504 definition-list
hash: `49652628a488f32455a6d06be9ee2abd7a874cefcd821e9a022dbf156478575e`.
Separate 7 rent-definition hash:
`39f83abd839f013e710fbe68bf252e5148545fb92d8a2200ed21283c34332a02`.
Each case has its own canonical JSON hash in the manifest. Solders 0.27.1,
Python 3.12, with signature verification enabled. All input hashes are checked
before and after execution; actual serialized transactions are independently
reverified and must be byte-identical across paired images.

The strict comparison retains all error text, states, return data, inner CPIs,
metadata fields other than the compute counter, serialized transactions and
ordered complete logs, including every Source coordinate. Only complete runtime
compute-meter lines matching the maintained `pump_strict_ordered_logs.UNITS`
regex are removed. No fixture receipt is transferred to the new image.

## Completed original/canonical controls

```sh
cd /workspace/pumpfun-source-workers/pump-lifecycle
python3 -B work/pump-lifecycle/sweep-runtime-673/replay.py \
  --repo /workspace/pump-binary-sweep-proposal \
  --manifest work/pump-lifecycle/sweep-runtime-673/FIXTURES-v2.json \
  --groups rent-boundaries \
  --candidate /workspace/pump-binary-current-1285/pump/candidate.so \
  --output work/pump-lifecycle/sweep-runtime-673/baseline-rent-v2
python3 -B work/pump-lifecycle/sweep-runtime-673/replay.py \
  --repo /workspace/pump-binary-sweep-proposal \
  --manifest work/pump-lifecycle/sweep-runtime-673/FIXTURES-v2.json \
  --groups maintained \
  --candidate /workspace/pump-binary-current-1285/pump/candidate.so \
  --output work/pump-lifecycle/sweep-runtime-673/baseline-maintained504
```

These output directories already exist and the controller refuses overwrites.
The seven rent pairs pass with 14 actual signed executions/signature fields and
21 captured program loads. All 504 maintained pairs pass with 1,008 actual signed
executions, 1,020 signature fields and 1,512 captured loads. They are two separate
fresh runs, not proposed-image qualifications or new coverage credits.

`RENT-WITNESS.json` decodes the real original/canonical CPI:
recipient 1 lamport → full 890880 System Transfer → recipient 903226 after 12345
fee sweep. At 890879 lamports the original still pays the full 890880, rather than
1 lamport. At/above the minimum there is no stipend; creator zero-fee/below-rent
and protocol/below-rent controls have no stipend. Canonical matches all seven.
This confirms the proposal argument boundary, not an observable new fix.

The first v1 controller run executed seven pairs but its final strict-log walker
also visited a nested signing-metadata dictionary named original/candidate and
correctly failed for lack of logs. That run, its initial manifest and source
are retained. V2 stores signing metadata as labelled list records; the seven
pairs were freshly executed again. No failed receipt is claimed as a pass.

## New image when available

First authenticate the CI build receipt, native-toolchain unchanged control,
complete workspace source hashes and exact overlay 15dbbd46. Candidate strip and
symbols must be the actual linked outputs, not rebuilt or patched locally.
The qualifying source changes only Sweep from frozen composition 673. Use the
actual artifact paths below; shell variables are merely explicit selectors.

```sh
cd /workspace/pumpfun-source-workers/pump-lifecycle
PUMP_SWEEP_STRIP=/absolute/path/to/actual-ci-candidate.so
PUMP_SWEEP_SYMBOLS=/absolute/path/to/actual-ci-symbols.so
python3 -B work/pump-lifecycle/sweep-runtime-673/qualify_census.py \
  --repo /workspace/pump-binary-sweep-proposal \
  --symbols "$PUMP_SWEEP_SYMBOLS" \
  --baseline /workspace/pump-binary-current-1285/pump/inventory.json.gz \
  --output work/pump-lifecycle/sweep-runtime-673/proposal-full 1035.json.gz
python3 -B work/pump-lifecycle/sweep-runtime-673/replay.py \
  --repo /workspace/pump-binary-sweep-proposal \
  --manifest work/pump-lifecycle/sweep-runtime-673/FIXTURES-v2.json \
  --groups rent-boundaries \
  --candidate "$PUMP_SWEEP_STRIP" \
  --control /workspace/pump-binary-current-1285/pump/candidate.so \
  --output work/pump-lifecycle/sweep-runtime-673/proposal-rent
python3 -B work/pump-lifecycle/sweep-runtime-673/replay.py \
  --repo /workspace/pump-binary-sweep-proposal \
  --manifest work/pump-lifecycle/sweep-runtime-673/FIXTURES-v2.json \
  --groups maintained \
  --candidate "$PUMP_SWEEP_STRIP" \
  --control /workspace/pump-binary-current-1285/pump/candidate.so \
  --output work/pump-lifecycle/sweep-runtime-673/proposal-maintained504
```

Both replays freshly execute original/canonical/proposal triples from identical
fixture definitions and transactions. Outputs retain complete raw metadata,
signatures and loader observations; all differences are retained and cause a
failure. The original, canonical and proposed image hashes remain distinct.
The census uses the unchanged published composition 673 tool (SHA804b8810…),
with explicit repository root and safe private output. Its original full 1035
control reproduces 1019 normalized/188 raw, zero gains/losses. It rejects any
normalized membership loss; raw gains/losses are separately reported.

Before promoting 713, additionally audit actual Sweep caller/callee edges,
arguments, state order and Source/data pointees against the original. Record
remaining mismatch explicitly; a normalized match cannot establish masked
callee/data identities alone. No stopped token-incentive/crossing domain or
compiler/spelling/flag variant is part of this controller.
