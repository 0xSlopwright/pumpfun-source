# Native fee decoding: Boost, legacy and MultiHop proof

This portable bundle contains 214 signed synthetic cases covering Boost harvesting, legacy buy/exact-quote/sell, MultiHop buy/sell, and parser-versus-zero/slippage failure order. The selected `5c1e8b18` baseline has 91 mismatches across these cases. Fixed `8d7d2af9` has zero. The original captured AMM and required token/fee/Pump programs, fixtures, producers and harness modules are included.

Install `requirements.txt` into Python, then verify the saved evidence:

```sh
python -B verify.py
```

Replay against any candidate ELF and verify every result:

```sh
python -B run.py --candidate /absolute/path/candidate.so --output /tmp/native-fee-run
python -B verify.py --candidate /absolute/path/candidate.so --reports /tmp/native-fee-run
```

The output directory must not exist and must be outside this immutable bundle. The default expectation is zero mismatches. To reproduce the known baseline, add `--baseline` to both commands; that mode requires the exact baseline hash and checks each known mismatch count rather than ignoring failures.

The wrapper verifies normal transaction signatures before forwarding unchanged transactions to LiteSVM. It captures every field of each non-executable message account before and after execution. Verification binds message bytes, signatures, loaded program identities, raw log hashes, full result fields, and snapshots. Only source-coordinate and compute-unit log differences are normalized. Original results and transaction messages must agree between baseline and fixed runs.

`historical/` retains the originally captured reports and receipts unchanged. `observations/` repeats the same cases with expanded observer account metadata; the verifier requires identical case results and signed messages between those captures. Historical absolute paths are provenance strings and are never opened. The new observer adds read-only account snapshots around the same forwarding call; producer and harness bytes are unchanged.

The fixes replace the old SPL parsing path with the recovered native decoder, reuse the decoded fee for Boost net calculation and harvesting decisions, and defer the legacy sell slippage guard until after fee parsing and net calculation. This is bounded functional evidence. It does not establish whole-program or byte-for-byte identity, and the original native helper outlining remains unresolved. The included source patches are review material, not a complete build kit.
