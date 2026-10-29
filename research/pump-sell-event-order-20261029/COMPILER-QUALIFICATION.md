# One cold compiler measurement and emitted-event attribution

The original-backed two-line source overlay was measured once after the exact
unmodified control reproduced both selected 673 ELF hashes. The measured code
now computes the event quote comparison and snapshots the actual user/mint keys
before `Clock::get`. This is a bounded compiler/static reconstruction result.
**No SellV2 VM execution, runtime acceptance, source promotion, or new function
match is claimed.**

The fixed measurement is run 40793772555, following control 40791064153. It uses
native macOS arm64 platform-tools v1.44 with authenticated Linux v1.44 SBPF target
libraries. The candidate uses an empty target and freshly compiles both
`pump-recovered` and nested `pump-token-ext`. The exact 65 primary source files,
66 compiled workspace files, locked/offline/release/target command, actual builder
adapter and library/registry bindings are retained in the separately sealed
artifact. Only `src/sell_v2.rs` changes from the frozen source, to overlay SHA
`f1f484c50a792c82fba414dff31b6bfc55f03cbec54d7115782c60ad5870b45d`.

## Artifact and portable dependency boundary

The unchanged raw outputs and full build evidence live in
[PR720](https://github.com/lalalune/pumpfun-source/pull/720), at:

`research/pump-current673-macos-qualification/evidence/sell-event-40793772555.zip`

This packet does not assume that PR is merged. `verify_measurement.py` accepts
`--artifact-zip /path/to/the/exact.zip`; a missing or wrong artifact fails closed.
The ZIP SHA is
`9db254ba1d516c88425f344e439291ff1d584d6937c5d748157eeea199c9c8bd`.
All 28 manifest entries, their exact file set, the original image and both compiler
ELFs are authenticated without extracting or modifying them. No ELF is duplicated
in this supplement.

| Output | SHA256 |
| --- | --- |
| Stripped | `844415f7d0615f0cfc1db695a5e0521dd9166802ae76286d46d8deb331989910` |
| Symbols | `3d7c549f16e854b866d72ad86347f6048c04e8f22115c56f2c8ef0f023a1ee53` |
| Full inventory gzip | `67ac2e4218b91091d450025df72d2c262130ef4d30985908aad7d567946e2468` |

The checker independently verifies the 65-input sole-file source difference,
actual 66-file compiled tar members against source-before/after hashes, actual
local-crate compilation log lines and the explicit locked/offline/release/SBPF
command. The control-proof record identifies the exact reproduced baseline.
It does not rerun a compiler or claim unique historical build provenance.

## Emitted values and call boundaries

The actual `sell_v2::execute` still starts at `0x86170`. Its size changes from the
baseline 14,104 to 14,128 bytes; the original is 13,976 bytes. The complete body
remains unequal. No alternative source spellings or compiler representations were
measured after this one result.

| Actual operation | Original | Baseline | Measured |
| --- | --- | --- | --- |
| Event quote comparison |`+0x29e8`|`+0x2a90`|`+0x2a68`|
| User key chain begins |`+0x2a00`|`+0x2aa0`|`+0x2a78`|
| Mint key chain begins |`+0x2a50`|`+0x2af0`|`+0x2ac8`|
| `Clock::get` |`+0x2ab8`|`+0x2a20`|`+0x2b30`|
| First event serialization |`+0x31e8`|`+0x3260`|`+0x3278`|

The full emitted instruction CFG proves that the comparison and all eight key-word
stores dominate the clock. Their precise stack snapshots flow into the actual
event's mint/user fields, and those event stores dominate its real serialization.
All paths between definitions and consumers are checked for direct overlapping
stack writes, including partial writes. There is no alternate internal CFG entry
into the comparison/key/Clock region. This is stronger than physical code ordering;
it remains a bounded direct-stack/intraprocedural attribution, not a universal
interprocedural alias or runtime proof.

All 80 actual outgoing calls now pair in original order with complete normalized
callee members, compared with 78/80 on the baseline because its event comparison
and clock calls were swapped. The actual incoming global SellV2 wrapper remains
a complete normalized member of original `0x1281a0` and calls this emitted function
at its unchanged offset `+0x210`. These call facts do not turn the parent into an
exact window or prove its argument/runtime semantics universally.

The complete 1,035-window inventory is rechecked against the actual original and
measured compiler bodies. Counts stay **1,019 normalized / 188 raw**, with no matched
membership gain or loss. Source diagnostic positions and the initial overlay are
unchanged. `measurement/delta.json` retains the independent official census delta;
`measurement/COMPILER-STATIC-PROOF.json` binds the complete static supplement.

## Verification

From a full checkout with the frozen baseline and PR720 artifact, run:

```sh
python3 research/pump-sell-event-order-20261029/verify_measurement.py
python3 research/pump-sell-event-order-20261029/test_measurement.py
```

Both accept `--artifact-zip`, `--baseline`, `--baseline-inventory`, and
`--source-manifest` for separate/sparse input locations. Missing inputs fail;
neither checker downloads evidence or executes a compiler/VM. The original ten
static mutation tests still pass, alongside eight new artifact/emitted-code tests
covering a changed ZIP, missing artifact, bypassed snapshots, wrong account or
consumer, a partial overwrite, and accidental use of the older clock-first image.
The required evidence and tooling gates also pass; commands, exact tool hashes and
outputs are retained in `measurement/VALIDATION.json`.

The old corrective/transfer-fee lane and all SellV2 VM execution stay stopped.
Canonical source and selected Pump outputs remain unchanged.
