# Machine placement and the erased intrinsic hint

No window is gained. Four targeted ordinary Rust controls use actual
`core::intrinsics::{likely,unlikely}`, rather than the previous empty cold-fn
idiom. Two change the ATA-writable error guard; two explicitly gate the token
constructor's Result. Both polarities of each control produce identical outputs.
All four retain 779 native normalized matches and leave sell unmatched.
`intrinsic-results.json` retains the exact four results.

The two writable controls reproduce the 9,040-byte owner/writable partial's
complete `16d67698…` symbol image. The two constructor controls produce
`753aabd1…`; their explicit Result source changes shape but their hints still
have no distinct effect. These are warm-dependency root recompiles. There is no
new Linux build or runtime qualification, and maintained source is unchanged.

## The measured placement boundary

`ownerwrite-trace/compiler.log` captures immediately before and after LLVM
machine block placement. Its complete compiler output reproduces `16d67698…`,
so the logging is passive. The captured LLVM machine-block inventory falls from
84 to 82. Three pure `r6` reload/jump stubs become one:

- Before placement, `bb.63` / IR block432 has only predecessor `bb.27`.
- After placement, `bb.62` / IR block432 has six predecessors:
  `bb.61, bb.69, bb.55, bb.51, bb.82, bb.33`.
- That survivor reloads the saved result pointer from stack offset `-1304` and
  jumps to the common return stores. It corresponds to the physically early
  candidate block at relative `0x1cd8`; the original block is at`0x2330`.

The before-placement token-constructor branch is 50/50. The ATA-writable guard
is 37.5/62.5. Actual intrinsic calls did not change those machine probabilities.
`trace-summary.json` retains both complete block orders, the reload stubs,
predecessor lists and the relevant instruction blocks. LLVM machine blocks and
the earlier assembly-level 77-block canonical correspondence are distinct counts.

## Where the intrinsic information disappears

A passive capture immediately **before LowerExpectIntrinsicPass** contains the
ATA-writable hint:

```llvm
%562 = call i1 @llvm.expect.i1(i1 %561, i1 false)
%563 = zext i1 %562 to i8
store i8 %563, ptr %13, align 1
%564 = load i8, ptr %13, align 1, !range !7, !noundef !2
%565 = trunc i8 %564 to i1
br i1 %565, label %569, label %567
```

Thus the hint result reaches the branch through a local memory round trip.
Immediately **after LowerExpectIntrinsicPass**, both expect calls in the
function have disappeared and there is no `!prof` or `branch_weights` metadata.
The twelve later captured pre-SimplifyCFG snapshots also have none. The second
expect is attached to the checked-add overflow result; the first is the explicit
ATA-writable source control shown above.

Both early captures reproduce the exact same complete `16d67698…` compiler
output. This records a concrete lost-hint boundary before scalar promotion,
rather than merely assuming a failed source hint reached machine placement.
It does not prove that every possible source form loses metadata, identify the
original compiler's metadata, or license modifying emitted IR.

`build_trace.py`, `intrinsic_controls.py`, `build_early_trace.py` and
`build_pre_expect.py` retain the actual local commands. Source and lib files were
restored afterward. The pinned native SDK reports rustc 1.79.0-dev / LLVM 18.1.7;
its version output does not provide a commit hash. Three inherited frame-overwrite
diagnostics remain; compiler success is not a safety or behavior claim.

```sh
python3 -I -B research/goal-swap-recovery-20261028/phase2/verify_saved.py
```

The saved check remeasures all four images with the unchanged official matcher,
checks their rows/hashes, authenticates all three passive output identities, and
checks the exact pre-lowering use chain and absence of later profile metadata.
Next work should derive a source lifetime/control shape that makes the original
late reload stub survive merging, or a source form whose expectation remains
SSA through LowerExpect. No further spelling sweep was run after these four
controls.
