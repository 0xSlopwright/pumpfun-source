# Shared buyback operation and original panic provenance

V3 buys calculated their buyback split in a duplicate `trade::v3_buyback_split`.
Its panic records pointed to `trade_v3.rs:82:10` and `:84:10`, while the deployed
program points to `lib.rs:1936:45` and `:1939:14`. The existing real
`protocol_fee_split` occupies those original sites. This packet makes costs
use that shared operation and restores four observed diagnostic-log mismatches.

The two-file [source patch](source.patch) changes the shared helper's first
input to scalar basis points, updates its two existing root callers, and uses
it for the two costs splits. The original exact `fit_post_complete` body
requires that scalar boundary: propagating a `Global` reference added a load
and lost that window, so that intermediate was rejected. The accepted source
keeps costs arithmetic, boolean semantics, evaluation order, fit and all seven
actual cost-call sites unchanged. No attributes, padding, binary changes or
synthetic `Global` were added. Existing Source positioning and the now-unused
duplicate source declaration are inherited; no match is claimed from dead code.

The frozen control is the complete PR569 `semantic-03` source, bound by the
included native build receipt. Its 67 hashes match the actual control inputs.
The new branch starts from upstream main `9cf9991b5a7f44abec0d3c4efd49c6cd3f6555a9`.
This is a scoped source/data recovery against that frozen control, not a new
integration selection or global frontier.

Both local crates were forced clean with release, `sbpf-solana-solana`, the
workspace manifest and offline options, then actually compiled with the fixed
v1.44 native SDK. All source hashes stayed unchanged. The complete source,
compiler commands, log, tool/dependency hashes and ELF files are included.

- Unstripped ELF: `d774221dfdbdf384e14da2ae63a33386ec0868e88ae2bd810fba06561759aa0b`.
- Stripped ELF: `96e5f2fd0091cd5869d6498b7fa1cd268f490cec00e110278b2a018d8f24a70a`.
- Same native cohort: **1019/1035 normalized, 183 raw**, zero gains and zero losses.
- Costs, all seven actual call sites, and the existing shared-operation users
  retain their control normalized bodies. Fit remains the original exact 1112 bytes.
- The actual panic call operands resolve to both original file/line/column records.
- **20 signed local captured-loader cases pass** for state, errors, CPI, events,
  return data and ordered logs excluding only anchored compute-consumption lines.
  The control has four panic-log mismatches; the candidate has none. Cases include
  13 successes, five original panics and two post-complete-setup Overflow controls.

`0x80df8` remains unmatched: original 2120 bytes, candidate 1648. The two
post-complete setup controls fail Overflow and do not prove executed fit
coverage; fit is qualified statically. This finite proof does not establish
whole-ELF identity, complete program equivalence, security acceptance or
deployment readiness. No stopped BuyV3 crossing or token-owner work is resumed.

Run the packet verifier from the repository root:

```sh
python3 research/pump-shared-buyback-panic-20261028/verify.py
```

Replay the runtime with the same captured loader and original dependencies:

```sh
python3 scripts/pump_with_captured_loader.py --receipt /tmp/costs-loader.json \
  research/pump-shared-buyback-panic-20261028/runtime/producer.py \
  --repo-root "$PWD" \
  --candidate research/pump-shared-buyback-panic-20261028/candidate.so \
  --control research/pump-shared-buyback-panic-20261028/control/unstripped.so \
  --output /tmp/costs-runtime.json.gz
```

The tested loader source is preserved as `runtime/captured-loader-snapshot.py`
(SHA256 `8d51ba5feab9e74f67fb80f5827222308d45a36022151bc77ad076c401f65067`),
and the loader receipt binds the captured account files and every ELF load.
For exact replay, use that snapshot at `scripts/pump_captured_loader.py` in an
isolated checkout if its current hash differs. The producer's two fixture
dependencies match the branch-base main blobs and are also hash-bound.

For a fresh build in the documented `/workspace` toolchain environment, copy
`source` to a new private stage's `source` directory and copy the immutable
external target seed to its `target` directory. Run `build-controller.py` with
that stage's absolute path. The controller cleans both local crates, preserves
commands and inputs, and copies the linked ELF before stripping. It never
writes the shared SDK, registry or seed. The control workspace can be recreated
from the candidate source by replacing its two changed files with
`control/source-files/{lib.rs,trade_v3.rs}`; all 67 hashes are verified.

The parent integration handles common repository checks and broader suites;
those results are separate from this packet's 20 cases.
`git diff --check` reports inherited whitespace in the byte-bound source
snapshots and standard unified-patch context lines; those inputs are preserved.
