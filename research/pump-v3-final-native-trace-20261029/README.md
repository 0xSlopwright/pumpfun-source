# Final native V3 costs compiler trace

This packet retains two actual warm native builds of PR831's final two-line source change over D037. The ordinary build and a root-crate-only passive compiler-print build produce byte identical complete stripped and symbol ELFs. That qualifies the 392 saved compiler snapshots for this exact final candidate. The full census remains **1,019/1,035 normalized and 188/1,035 raw**, with no gained or lost memberships. This is partial compiler research: no new complete-window match, runtime qualification, cold build, canonical selection, or promotion.

The final native `v3_buy_costs` is 2,144 bytes and matches the authenticated PR831 Linux final body under the existing narrow CALL/LDDW normalization. The original comparison window is 2,120 bytes; sequence alignment diagnoses 25 changed eight-byte slots. All 17 direct calls retain the original order and 10 complete normalized callee classes. All 16 bounded data references retain the original order and classes. This is a one-hop operand audit, with bounded string, Source-location and vtable checks, not recursive closure or whole-ELF identity to the original.

The second-add JEQ/JMP pair is already observable at machine snapshot 276. Greedy allocation (334→335) first spills the return pointer; later control-flow optimization (358→359) forms the split pre-fee error tail. The original supplies final machine bytes, not compiler IR. These observations do not prove a unique original source spelling or a further Rust proposal. The prior sequential 2,136-byte trace concerns a different intermediate and qualified only its target bytes; its whole images differ. Details remain in [the retained findings](evidence/analysis/TRACE-FINDINGS.md).

## Saved verification

From the repository root, with normal Python:

```sh
python3 research/pump-v3-final-native-trace-20261029/verify_saved.py --repo-root .
python3 research/pump-v3-final-native-trace-20261029/test_saved.py -v
```

Both entry points reject `-O` before imports or validation. The reader writes only stdout unless an explicit `--report` path outside this sealed packet is supplied. It authenticates the outer seal, all 295 original evidence members and the unchanged inner manifest; rederives source65→actual archived66 joins, literal receipt/tool/flag associations, whole-output equality, the full census, final target and operand joins, and saved stage/log associations. It runs no build recipe, SDK tool, runtime producer or VM. Original program bytes are comparison inputs only.

The five controls exercise coherent unrelated-source substitution, receipt-consistent unequal passive output, count-preserving membership substitution, an actual saved call operand redirected to a valid wrong callee, and a log/snapshot-consistent removed Greedy spill. They use temporary data copies and call individual semantic checks past the immutable envelopes, so a changed hash alone cannot satisfy the intended rejection. No mutated artifact is executed.

## Input custody and portability

`evidence/` preserves the 295 members and inner manifest (`05be7ced…e02e5`) byte for byte. The two actual receipts, source archives, outputs, raw compiler log, precompiler path failure and analysis records are unchanged. The approved plan metadata is retained under `inputs/approved-plan/`; its 76-member view resolves source bytes through D037 and the actual native archive, and tool-reader bytes through the retained executed tools. SDK, Cargo registry and target trees are excluded. Their recorded hash inventories remain provenance, including the original audit's contemporaneous rehash result; this portable reader does not independently reopen those private trees or attest compiler execution cryptographically. Absolute locators in literal receipts, logs and old helper sources are historical provenance, never live input paths.

Native custody used PR831 head `1887bc8b066c67b557ff27b66a31d9efb2eee4e1`, whose manifest was `ef8ba48f…ce039`. Its exact manifest and verifier are retained under `inputs/historical-pr831/` and are **not executed**. PR896's corrected public packet has manifest `ffc786b8…05ff0c`: 78 original members, including all input/source/artifact bytes, are unchanged; `verify.py` and the manifest changed, and three proof files were added. The reader checks both views and uses the unchanged public tools and artifact bytes. Actual native receipts retain their historical hashes and locators; they are not relabeled to the corrected verifier.

The only executable adaptation of a retained reader is two explicit path substitutions in `evidence/audit_native_refs.py`, mapping its historical PR831 packet and native ELF locators to published relative inputs. Its logic and on-disk bytes are unchanged. Required published parents are `research/pump-program-creator-notice-qualification-20261028`, corrected `research/pump-v3-costs-source-20261029`, `evidence/original/pump/deployed.so`, and the pinned selected-window TSV under `repro/reconstruction-status-2026-10-26/`. No private `work/`, SDK, target or cache path is required.

Exactly two native builds were used; one failed path lookup occurred before any compiler or clean invocation. The two-build allowance is exhausted. This wrapper performs zero new builds, VM executions or cold qualifications.
