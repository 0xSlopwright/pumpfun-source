# InitBoost temporary AccountInfo and signer-seed trial

This unselected contextual trial changes only `instructions/boost.rs` from frozen `4e6a5617…`. The transfer now clones the quote-token program AccountInfo as a temporary and constructs the nested signer seeds inline after the pool AccountInfo temporary. Both temporaries drop immediately after the transfer, before the reserve update/reload. Guard order and event fields are unchanged.

The original clone sources are accounts field 72 (quote-token program) and field 0 (pool). The original transfer receives the cloned program object and authority object, then drops both before reload. An earlier proposed long-lived-local interpretation was rejected after examining that success path. Its direct object is retained as a negative control; it is not the patch in this packet.

The contextual candidate is `e9cdacc2f4cb8eaa22aef2f27bd68e9af61134de7b0b62970de1b9adc58ce4c0`. It retains **653 normalized / 148 raw windows with no gains or losses**. InitBoost grows from 3,224 to 3,888 bytes; the original is 3,912. All 19 direct calls remain. The first four have exact original offsets; the next 14 calls are 24 bytes earlier, and the final error conversion is 16 bytes earlier. Eighteen callee occurrences match complete normalized bodies and relocation patterns; the 696-byte arithmetic helper retains its known source-origin difference.

The remaining 24 bytes reflect actual register/stack instruction differences and remain open. Size proximity alone is not an identity result. The direct-object full-handler baseline did not calibrate to its linked counterpart, so those object sizes are diagnostic negatives rather than predictions of linked identity.

The one strict contextual build binds 227 inputs and leaves all 762 recorded dependency artifacts unchanged. All 13 retained, signature-verified Pump migration controls pass with complete compared logs and snapshots: 26 signatures, 11 original successes, 11 InitBoost invocations and six emitted InitBoost events. The local compiled source is bound here; external dependency archives remain governed by the separate nine-root checkpoint proof.

Run `python3 -B verify.py --root /absolute/repository`, or import `verify(root)`. Candidate, symbols, baseline, source, direct objects and signed receipts are bundled; the exact original ELF is read from the repository. No build or runtime transaction occurs during verification.

To replay the thirteen cases on another candidate, use `run13.py --repo-root /absolute/repository --candidate /absolute/candidate.so --output /new/output`. The runner materializes the frozen sources at the required script depth and preserves the original program hashes and normal signature checks. This is a bounded offline test, not a live transaction.
