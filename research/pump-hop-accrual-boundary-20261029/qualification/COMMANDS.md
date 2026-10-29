From the repository root, prepare a new authenticated workspace as described in
the parent README. Run the following **from that prepared workspace**. Replace
the two absolute build-directory arguments with this packet's retained native
control and candidate directories. Use new output paths for each execution.

```sh
mkdir work
python3 -B scripts/pump_with_captured_loader.py \
  --receipt work/create-loader.json \
  research/pump-final-composition-673-20261028/replay_create_native.py \
  --control-directory /absolute/path/to/native-builds/control-40791064153 \
  --candidate-directory /absolute/path/to/native-builds/perhop-40792780769 \
  --kind perhop --output work/create14.json.gz > work/create14.log 2>&1
python3 -B research/pump-multi-hop-quote-admission/tools/focused.py \
  --parent /absolute/path/to/native-builds/control-40791064153/candidate.so \
  --proposal /absolute/path/to/native-builds/perhop-40792780769/candidate.so \
  --output work/hop13.json.gz > work/hop13.log 2>&1
python3 -B verify_native_replays.py \
  --control-directory /absolute/path/to/native-builds/control-40791064153 \
  --candidate-directory /absolute/path/to/native-builds/perhop-40792780769 \
  --kind perhop --creation work/create14.json.gz --hop work/hop13.json.gz
```

For verification without execution, use the same final command with `--creation`
and `--hop` pointing to this packet's saved `qualification/reports/perhop-*`
reports. The exact retained native receipt and all actual source/image hashes
remain mandatory. No historical hash guard is disabled.

The unchanged control uses its own directory for both image arguments and
`--kind control`; its saved reports are retained separately. Constructor replay
is reserved for the separately frozen `8cf97e31…` proposal and its own actual
native artifact; this per-hop packet contains no constructor source change.
