# Fourth-wave transfer ABI and legacy specialization experiment

This is an unpromoted reconstruction packet. It does not select a checkpoint or establish whole-program byte identity. Its frozen source is a copy of the third-wave `a73c5a1b…` source plus the three recorded patches in `composition.json`: payout transfer helper, successful const-generic legacy specialization, and boost-authority guard. The negative scalar-specialization experiment and later InitBoost patch are excluded.

The candidate is `3fcae02128464717b29a0b3842fbba993d5d0befb4362c4094c8af8e32a8589d`. Two strict builds produced identical stripped and unstripped artifacts. Both retained all 226 input hashes and all 762 cached dependency artifacts. `build-input-binding.json` maps every recorded input to an archived file. The nine crates contain 166 authenticated archive files and nine Cargo metadata markers. These files and the recorded builder/SDK identities are checked without reopening private caches. The SDK archive is authenticated by retained digest/member evidence; the verifier does not reopen that external archive.

The fixed 785-window census has 642 normalized and 129 raw matches, with no normalized losses relative to a73c. The only new normalized window is original `0x6f898`, the 2,536-byte payout transfer helper. Its three actual direct callees match; the ATA helper's actual idempotent constructor is also checked. The boost guard has the original 1,464-byte size and relocation structure, and all eleven direct callees match. Its two source-line immediates differ (original 297/292 versus reconstructed 92/91); no masking or full-body equality is claimed for that guard.

The bounded data/call audit closes 585 original windows under its recognized static-reference schemas. It resolves all sixteen prior unbound pointer observations via actual alternative witnesses. Twenty-eight unequal text cross-pairings have equal alternatives; there are no remaining genuine unequal recognized text/path objects. Twelve source-coordinate descriptor observations remain, plus the two inline boost line stores mentioned above. This census is not a proof over every ELF data object or indirect call.

Focused acceptance is 372 cases and 768 verified signatures: ATA 60/120, resize 160/344, retained entrypoint/events/orders/curves 137/274, and boost guard 15/30. Reports compare captured original and candidate execution, including account state and logs with the respective documented source-coordinate/compute normalization. No live transaction is sent. The root task owns full-corpus acceptance and publication.

Verify offline from the repository root (no compilation or VM execution):

```sh
PYTHONDONTWRITEBYTECODE=1 work/test-env/bin/python -B work/amm-fourth-wave-build-worker-20261027/verify.py --root "$PWD"
```

The source-binding negative controls reject a missing input, extra input, changed Rust source and changed registry source. `recovery.patch` is the incremental five-file source patch against a73c; the three original patch hashes are retained separately. `prepare_packet.py` records the archival transformation and is not part of the compiled program. The build driver retains private path strings as historical provenance; offline verification uses the explicit archived input mapping instead.
