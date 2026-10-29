# AMM sell: identify the Rust cleanup behind the empty LLVM block

The forwarding block identified in [the preceding IR-order packet](../amm-sell-ir-order-20261029/README.md)
comes from cleanup of the current reconstruction's `data_is_empty()` condition.
It does not contain the borrow error conversion. This narrows the source search
without recovering the unmatched sell body or identifying historical source.

The final Rust MIR has `_52: bool`, assigned by
`AccountInfo::data_is_empty(_20)`. Its `bb85` contains only
`StorageDead(_52); goto -> bb86`. The borrow call uses the same account `_20`;
its result `_125` flows through `bb42` to the actual Ok payload in `bb121` or
Err payload in `bb120`.

A separate LLVM trace retaining names connects those labels to the prior
observation. Before the first SimplifyCFG pass, the order is `bb37` (borrow),
`bb85` (only `br label %bb86`), then `bb121` (success). After that pass `bb85`
is gone and success follows the borrow block immediately. `analysis.json`
retains the exact captured blocks and byte offsets. Labels are local to these
captures; this is not an inferred mapping between arbitrary builds.

## Five root compilations and their limits

All five runs copy the parent's dependency build and compile the root once.
They use the same 69 workspace inputs, except for the two explicit one-line
source controls. Error-source lines stay fixed. These are warm-dependency root
recompiles, not five empty-target builds. No target, VM or transaction is run.

| Run | Result |
| --- | --- |
| 10: borrow the temporary guard (`let data = &...try_borrow_data()?`) | Complete ELF equals baseline; rejected as an explanation |
| 11: MIR capture with a qualified function filter | Compiler succeeds but captures **zero files**; failed capture retained, not used as MIR evidence |
| 12: capture with `cashback` filter and a shorter output directory | Complete ELF equals baseline; 3,112 files recorded, including 104 snapshots of the sell helper |
| 13: full LLVM trace plus `-Zfewer-names=no` | Full ELF differs; qualification below |
| 14: name the emptiness result before the existing `if/else` | Complete ELF equals baseline; rejected as an explanation |

Run 13's output is
`9700b485d6a535d120b3ba9b97b30e7cced2f25ad921d7f584b859452e7987e0`.
Every section's contents agree with the baseline except `.symtab` and `.strtab`.
In particular, `.text`, data, dynamic tables and relocations agree literally;
the entire 9,024-byte sell body is raw-equal at the same address. The complete
files have different sizes and metadata and are **not byte-identical outputs**.
The baseline remains
`65a7df192ae10e25cef9789cf28b40ed1b21e2c7c6ef46446ced47355056189c`.
No stripping, normalization or allocation padding is used to establish these
section and body comparisons.

Thus the new source controls add no match. The selected layout recipe still has
784/785 raw windows, while this default-layout baseline has 784 normalized / 398
raw windows. The original sell branch and whole meaningful ELF remain unequal.
No source, selected recipe or acceptance gate changes here. All five raw stderr
logs retain the three existing frame-overwrite diagnostics; compiler success
does not establish safety or behavior equivalence.

## Evidence and offline replay

```sh
python -I -B research/amm-sell-mir-cleanup-20261029/verify.py
python -I -B research/amm-sell-mir-cleanup-20261029/test_analyze.py
```

The stdlib verifier authenticates this packet and the unchanged
`amm-sell-compiler-boundary-20261029` parent, reconstructs each source delta,
checks exact command/environment deltas, and verifies raw log/output identities.
It replays the MIR/LLVM relationship and compares every ELF section. Mutation
tests reject a different dead local, a different condition producer, real work
in the supposed empty block, a wrong success edge and changed code bytes.

All 104 sell-helper MIR snapshots are included losslessly in `mir/`. The other
3,008 captured files are outside this finding: their hashes remain in the full
run-12 receipt, but their contents are not included or verified by this packet.
The full named LLVM capture and all five stderr/stdout logs are included as gzip
storage, preserving their raw bytes. Baseline output and source archives are
reused from the sealed parent; the unequal named output is included here.

Five exact Rust source files at recorded SDK revision
`08b7341888ab480dfaaa0698300cbbbbb2d75b53` are retained with verified Git blobs.
They document MIR filtering, the default optimized MIR level 2, and that
`DeduplicateBlocks` and `MultipleReturnTerminators` require level 4. Disabling
those already-inactive passes was therefore not tested. These are recorded
compiler-source links, not an independent compiler rebuild or historical
attribution. The post-run executable hash check is explicitly retrospective.

`controllers/` preserves the actual local drivers, including the zero-capture
attempt. Their absolute local SDK/cache paths are archival execution records,
not a portable rebuild interface. The verifier needs no SDK, network or runtime.
The shared baseline source remains unchanged at publication base
`43fb01c6f409ca370e89d4b0350486a92b1a5add`.
