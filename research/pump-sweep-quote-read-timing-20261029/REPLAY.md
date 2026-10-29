# Frozen historical 673 replay

This reuses merged 713's exact producer SHA256
`c2e4822b7237002ea280b8ddffea412d47b899d30c7bcdaea307db2585a1b734` and fixture
manifest SHA256 `049f33948de451a10c915d2e79c04bff8210b33d82a42ed812a1ab1803481c88`.
The 504 definitions hash to `49652628a488f32455a6d06be9ee2abd7a874cefcd821e9a022dbf156478575e`;
the seven rent definitions to `39f83abd839f013e710fbe68bf252e5148545fb92d8a2200ed21283c34332a02`.
They use existing synthetic signers locally. No wallet/network transaction or
stopped handler is involved. All Source and ordered log text remains literal;
only complete standard compute-meter lines/the metadata compute counter differ.

Actual execution used the byte-identical producer from the worker's earlier
staging directory. Its absolute paths and commands are retained in the raw
reports; no old reports were re-bound. The portable equivalent is:

```sh
PUMP_SWEEP_REPO=/absolute/path/to/pumpfun-source
PUMP_SWEEP_CONTROL=/path/to/actual-673-199fd-candidate.so
PUMP_SWEEP_LATE=/path/to/actual-40796286687-candidate.so
python3 -B "$PUMP_SWEEP_REPO/research/pump-sweep-used-boundaries-20261029/qualification/runtime/replay.py" \
  --repo "$PUMP_SWEEP_REPO" \
  --manifest "$PUMP_SWEEP_REPO/research/pump-sweep-used-boundaries-20261029/qualification/runtime/FIXTURES-v2.json" \
  --groups rent-boundaries --candidate "$PUMP_SWEEP_LATE" --control "$PUMP_SWEEP_CONTROL" \
  --output /new/output/sweep-late-rent
python3 -B "$PUMP_SWEEP_REPO/research/pump-sweep-used-boundaries-20261029/qualification/runtime/replay.py" \
  --repo "$PUMP_SWEEP_REPO" \
  --manifest "$PUMP_SWEEP_REPO/research/pump-sweep-used-boundaries-20261029/qualification/runtime/FIXTURES-v2.json" \
  --groups maintained --candidate "$PUMP_SWEEP_LATE" --control "$PUMP_SWEEP_CONTROL" \
  --output /new/output/sweep-late-maintained504
```

The control must hash to `199fd7379b6881adefd9e54803f75902176c17bded1718bfc1c59b1cf5bc8473`.
The late-read runtime output is `4e0e96a2b32b175cf576655063499f2d53974bcaa3a6280e6b9886f1805fa151`.
The native archived source/caller/calculations are frozen 1285/673; later maintained
734/current composition needs a separate actual build and replay. No full 44-suite
or current-main runtime claim follows from these 511 triples.
