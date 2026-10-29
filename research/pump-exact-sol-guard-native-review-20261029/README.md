# Exact-SOL guard: one native negative trial

One ordinary native warm build applied only the audited branch-local quote-zero
guard to the qualified D037 Pump source. The build freshly compiled both local
crates while reusing its authenticated dependency cache. It took 16.938 seconds.

The full canonical census remains **1,019/1,035 normalized and 188 raw windows**,
with **no gains or losses**. The 13,224-byte exact-SOL target reproduces the
retained Linux guard's normalized body and still differs from the original in
four bytes at instruction slots 1003/1004: the original loads r3 from stack -1704,
then r1 from -1696; the trial reverses those two independent loads. This is a
negative source-fidelity result. No further variants were built.

Only `src/buy.rs` changes (`d4935c98…`); the other 64 primary source inputs retain
D037 bytes, including the creator-notice fix in `admin_cto.rs` (`3545aa72…`). The
65 primary inputs are bound to the actual 66 compiled workspace files and their
archive. The literal stripped output is `81e15c8bc42714d4ec98ad52d3b52d26b1b599871fbf13ce51082c389ac73c9a`;
symbols are `baef84858615fef8330e2675f08ff025175db94472bdcbe2cd12937a867634c1`.

All 168 original evidence members and their original sealed manifest are copied
byte-for-byte into `evidence/`. Actual receipts, logs, source archives, executed
tool copies and historical private locators retain their original bytes. The
recorded SDK/archive/source inventories are hash records; the SDK, target and
dependency cache are not included. No producer or recorded recipe is relabeled.
Absolute paths in those historical records are provenance data, and the saved
verifier never executes or follows their build commands.

From a complete repository checkout:

```sh
python -B research/pump-exact-sol-guard-native-review-20261029/verify_saved.py
```

An externally located packet can use `--repo-root /path/to/checkout`. Verification
authenticates the immutable inner manifest, the public D037 and upstream guard
packets, original ELF, canonical window list and public normalizer. It checks
source/build/tool joins, all output hashes, all 1,035 memberships and the exact
two-load difference. It requires normal Python and writes no files.

This checks retained evidence consistency. It performs no Cargo build, VM replay
or cold repeat, and supplies no execution attestation. This trial received no
runtime or full native qualification and is not a canonical promotion. The
original ELF was used only for post-build comparison, never as a compiler input.
Whole-target equality and contract completion remain false.
