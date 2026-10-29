# Eight negative CTO-order observations

This immutable packet retains eight original-AMM versus prior-candidate tests.
All eight enter AdminCtoPool through a synthetic local caller substituted for
Pump. The caller uses ordinary transaction signatures and invoke_signed PDA
rules; it does not bypass runtime checks. This is not captured-Pump or live-state
reachability evidence.

Five comparisons differ: three have extra system-transfer traces before failed
guards; two return insufficient-funds error1 instead of original guard errors
6075 and6069. None has an after-state difference. No mutation or vulnerability
claim is made. The original comparison program is the captured deployed AMM;
the explicit prior candidate is f5ef6ebbb2c4139a4d6e785b51a692f40ba53dc79a66b6834b2830d57868fa33.

Run `python -B verify.py --expected-seal MANIFEST_SHA256` in a Python environment
with solders. Verification is read-only and requires no repository or runtime
execution. It checks both AMM ELFs, the oracle ELF/source binding, exact inventory,
all16 signatures and raw-log hashes, matching transaction messages, the absence
of a top-level pool-authority signature, program identities, and all five saved
differences. Producer, observer and imported fixture snapshots are retained.

The oracle provenance records its direct compiler input and tool identity. Its
broader rlib inventory is explicitly a historical snapshot, not a claim that all
entries were linked or still match later caches. This packet does not rebuild
an ELF or establish whole-program equivalence.
