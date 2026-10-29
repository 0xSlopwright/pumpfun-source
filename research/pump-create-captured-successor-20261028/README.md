# Selected-image create replay through the captured loader

This supplement reruns the unchanged 14 frozen PR616/651 cases against selected image `199fd7379b6881adefd9e54803f75902176c17bded1718bfc1c59b1cf5bc8473`, with the genuine captured upgradeable Pump loader installed before constructing LiteSVM instances. The earlier create-only report used the direct LiteSVM loading API; that report remains unchanged in its original packet. The broad44 and other focused captured-loader qualifications are independent.

All 42 normally signed original/control/selected executions pass. The selected image has zero structured or strict ordered Source/log differences; the old canonical control retains six diagnostic mismatches. The verifier independently checks all 84 signature fields and 42 actual captured Pump loads: 36-byte program account, 10,485,760-byte program-data allocation, exact ELF prefix, zero allocation tail and captured slot 458921441. No diagnostic coordinate is substituted or normalized. Source, actual compiler receipt and complete selected image hashes remain bound to the qualified final composition.

The executed controller, unchanged create adapter and loader wrapper bytes, actual command, observations and loader receipts are retained. This is a runtime supplement; no source, compiler output, function matcher or previous receipt is changed, and no exact-window gain is claimed.

```sh
python -B research/pump-create-captured-successor-20261028/verify.py
python -B research/pump-create-captured-successor-20261028/replay.py \
  --candidate /path/to/selected.so --output work/create-captured-replay
python -B research/pump-create-captured-successor-20261028/verify.py \
  --candidate /path/to/selected.so --runtime-directory work/create-captured-replay
```
