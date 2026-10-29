# Portable AMM transfer-fee decoder proof

This packet preserves 58 signed synthetic Token-2022 mint cases across three candidate binaries. The published `5cd7879a` checkpoint has 20 mismatches against the captured original; the first parser fix `767345f7` and integrated candidate `5c1e8b18` each have zero. Original results, transaction messages, and input account snapshots are identical across all three comparisons.

The verifier independently checks 348 Ed25519 signature records, transaction hashes, loaded program hashes, complete returned fields, full logs, and every field of every non-executable transaction account before and after execution. The preserved comparator excludes only source-coordinate and compute-unit log differences. Executable contents are bound by their hashes rather than compared as mutable account state. The synthetic fixtures do not establish live-chain acceptance or whole-program equivalence.

## Verify saved evidence

Use Python with the version in `requirements.txt` installed, then run:

```sh
python -B verify_packet.py
```

The verifier reads only files inside this packet and does not execute SBF. `manifest.json` binds the exact inventory, including the verifier, unchanged producer, required harness modules, fixture snapshots, dependency binaries, and three candidate ELFs. The captured original is also included so replay needs no repository checkout. Historical absolute paths inside receipts are provenance data; the verifier never opens them.

## Replay offline

```sh
python -B run_replay.py --candidate integrated --output /tmp/amm-tlv-replay
```

The output directory must not exist and must be outside this packet. Use `--candidate all` to replay the published, first-fix, and integrated comparisons. The runner uses only the included runtime tree, verifies every fresh signature and result, and compares the complete fresh case results with the saved evidence. No RPC or chain operation is used.

`source/` contains the scoped before/fixed/integrated transfer-fee module and patch for review. It is not a claim that this small packet can rebuild the full AMM program. Original source organization, the separate 664-byte helper boundary, and the native 24-byte arithmetic-copy ABI remain unresolved.
