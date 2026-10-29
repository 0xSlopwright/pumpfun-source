# Checked sell accumulator constructor

This separately sealed follow-up binds one source-line correction to the sealed r31 AMM frontier. The original sell cashback helper calls Anchor's checked `Account<UserVolumeAccumulator>::try_from`; r31 called `try_from_unchecked`. The recovered parsed accumulator key and create authority remain as in r31. `source.patch` is the entire difference between the 68 canonical inputs. Canonical source and the historical r31 packet remain unchanged during qualification.

The actual initial Linux v1.44 build and an independent source-forced repeat through the published r31 builder reproduce complete stripped ELF `b6f62738ea983e3acde0dfe1d24027af1355199807745d733c75c88a044e4d73` and symbols ELF `fd78dd8a0238985c2b32a79e6733a6adb415b757d95c6d97aa275c2256043629`. The repeat retains executed controller snapshots, before/after source hashes, registry inventory, SDK inventory and compiler log. Its warm owned target was source-forced by the published builder; this follow-up does not claim a second empty-target build. The r31 empty-target receipts remain intact in the historical base.

The complete stripped ELF differs from r31 in exactly two bytes: the CALL immediate at `0x4dc80`, changing actual target `0x3a10` (unchecked) to `0x6178` (checked). The original corresponding checked constructor is `0x6528`. All 80 actual direct sell callees and their direct descendants through depth two now agree in complete normalized bodies and relocation patterns. All 77 canonicalized control-flow blocks have identical registers and instructions; block layout differs. These diagnostics never award the sell window or change strict matching rules. Official census remains 784/785 normalized and 394 raw with identical membership.

The fresh 25-suite corpus has 17,462 cases, 35,074 transactions, 35,418 signature fields and 17,537 identical signed-message pairs. Complete stored observations agree after removing only compute-meter log lines. Error source coordinates and account bytes remain exact. The retained independent auditor can cryptographically recheck every unique signed transaction.

The focused producer executes 21 original/r31/checked triples (63 signed transactions). The sole two-byte binary difference adds exactly 11 compute units in 19 cases with a valid header, covering new/existing accumulators, correct-discriminator truncations, malformed booleans and valid lengths. This deterministic compute delta witnesses execution of the changed constructor call using identical signed inputs and equal program allocation; it is not a PC trace. Bad discriminator and length seven reject with 6060 at the preceding explicit guard and show no constructor delta. Complete observations agree across every triple under the same compute-meter-only exclusion.

Verify archived evidence:

```sh
python3 -I -B -O research/amm-checked-constructor-20261028/verify.py --saved-only
```

Add `--signatures` with a Python containing solders for cryptographic checks. The default additionally requires current canonical inputs to equal this exact proposal. Before promotion, `--source-root research/amm-checked-constructor-20261028/work/canonical` binds the separately staged proposal. Historical base verification is explicitly historical; the current-source check is separate. `test_verify.py` rejects resealed false source, call-depth and execution-witness claims under Python optimization.

`reproduce.py --output NEW --sdk SDK --cargo-home CACHE --target-dir OWNED_TARGET` extracts the archived proposal and invokes the exact published r31 builder. Coordinate target/cache ownership. Re-execute `runtime/probe_focused.py` with explicit `--candidate`, `--control`, `--runtime-root` and `--output` through the base corpus's captured `observe_suite.py`. Use absolute output and sidecar paths because the frozen legacy harness changes working directory. The control must be the exact r31 image. No source, IR, object or ELF bytes are patched during candidate production. Whole-ELF equality and sell block placement remain open.
