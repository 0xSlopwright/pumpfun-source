Run the parent README's authenticated preparation first. From that new runtime
directory, set the absolute paths to this packet, the accepted prior packet, and
the repository. Use new output paths; previous receipts are never overwritten.

```sh
CLOCK_PACKET=/absolute/path/to/research/pump-hop-clock-snapshot-20261029
ACCRUAL_PACKET=/absolute/path/to/research/pump-hop-accrual-boundary-20261029
PUMP_REPOSITORY=/absolute/path/to/pumpfun-source
mkdir work
python3 -B scripts/pump_with_captured_loader.py \
  --receipt work/create-loader.json \
  research/pump-final-composition-673-20261028/replay_create_current_clock.py \
  --anchor-directory "$ACCRUAL_PACKET/native-builds/control-40791064153" \
  --control-directory "$ACCRUAL_PACKET/native-builds/perhop-40792780769" \
  --candidate-directory "$CLOCK_PACKET/native-build" \
  --kind perhop-clock --output work/create14.json.gz > work/create14.log 2>&1
python3 -B research/pump-multi-hop-quote-admission/tools/focused.py \
  --parent "$ACCRUAL_PACKET/native-builds/perhop-40792780769/candidate.so" \
  --proposal "$CLOCK_PACKET/native-build/candidate.so" \
  --output work/hop13.json.gz > work/hop13.log 2>&1
python3 -B verify_current_clock_replays.py \
  --anchor-directory "$ACCRUAL_PACKET/native-builds/control-40791064153" \
  --control-directory "$ACCRUAL_PACKET/native-builds/perhop-40792780769" \
  --candidate-directory "$CLOCK_PACKET/native-build" \
  --kind perhop-clock --creation work/create14.json.gz --hop work/hop13.json.gz
python3 -B scripts/pump_with_captured_loader.py \
  --receipt work/counter-loader.json replay_counter12_current_clock.py \
  --repository "$PUMP_REPOSITORY" \
  --fixtures "$CLOCK_PACKET/qualification/counter-inputs" \
  --anchor-directory "$ACCRUAL_PACKET/native-builds/control-40791064153" \
  --control-directory "$ACCRUAL_PACKET/native-builds/perhop-40792780769" \
  --candidate-directory "$CLOCK_PACKET/native-build" \
  --output work/counter12.json.gz > work/counter12.log 2>&1
python3 -B scripts/pump_with_captured_loader.py \
  --receipt work/crossing-loader.json replay_guard8_native.py \
  --repository "$PUMP_REPOSITORY" \
  --fixtures "$PUMP_REPOSITORY/research/pump-multi-hop-crossing-guard-20261028" \
  --control-directory "$ACCRUAL_PACKET/native-builds/control-40791064153" \
  --perhop-directory "$ACCRUAL_PACKET/native-builds/perhop-40792780769" \
  --clock-directory "$CLOCK_PACKET/native-build" \
  --output work/crossing8.json.gz > work/crossing8.log 2>&1
```

The crossing report intentionally retains four images; its historical `control`
label means 199fd, `perhop` means current c0e29, and `clock` means candidate 0bc4.
The counter replay loads the already frozen MAX-counter prestates and introduces
no new mutations. Both preflights authenticate ordinary outer AMM / inner Pump
multi-hop selectors and actual user signatures before execution. No initializer,
Mayhem state change, filtered BuyV3 execution or signer/PDA/owner bypass is used.
