# Pump V3 buy-cost source recovery (partial)

Two Rust source-line changes move `v3_buy_costs` (original `0x80df8`, 2,120 bytes)
closer to the original. The narrow-normalized, sequence-aligned eight-byte-slot
edit count falls **70 -> 25**. All **17 direct calls now occur in original order**,
through ten complete normalized-equivalent direct callees. This is a partial body
improvement: the target is still unequal, and the complete-function census stays
**1,019/1,035 normalized and 183 raw in this local Linux cohort**.

## Source change

Apply `source.patch` to the maintained compiled workspace selected by
`research/pump-program-creator-notice-qualification-20261028`. Both full 66-file
input archives and the readable before/after `trade_v3.rs` are retained here.
Only lines 366 and 376 change; physical error lines 371, 375 and 382 are retained.

1. Compute first-leg and optional post-complete buyback sequentially through the
   existing mode-aware `protocol_fee_split`, instead of wrapping both in one
   outer mode branch. Its existing mayhem bypass is preserved. This restores the
   original post-presence discriminator lifetime and arithmetic register use.
2. Expand the two gross-up statements at this caller, retaining the existing
   `gross_up_quote_error` callback. Other callers and the shared helper are
   unchanged. This restores original pre-fee branching and error-result load order.

The patch contains no assembly, IR editing, compiler-flag sweep, or binary patch.
It does not promote a new canonical native selection or rewrite sealed evidence.

## Same-recipe comparison

| Image | Target bytes | Aligned differing slots | Normalized / raw windows |
| --- | ---: | ---: | ---: |
| Original | 2,120 | 0 | reference |
| Current source, Linux parent | 2,056 | 70 | 1,019 / 183 |
| Sequential mode handling | 2,136 | 30 | 1,019 / 183 |
| Direct gross-up, final | 2,144 | 25 | 1,019 / 183 |

The slot count uses `SequenceMatcher(autojunk=False)` on eight-byte chunks after
unchanged official narrow normalization. It is an alignment diagnostic, not a
positional byte count or a percentage of program completion. Calls and permitted
address operands are masked by that normalization; references are audited
separately. The 16 bounded data-reference sites also retain their original classes/content and now their original order; this is a one-hop audit, not recursive closure. Every parent's normalized and raw membership is preserved.

Both actual normal Cargo builds of the final source produce identical complete
symbol and stripped files. Each log contains one actual root compilation; inputs
are unchanged. Dependency targets are reused: this is not an empty-cache build.
The published native Mac selection has 188 raw windows; this Linux parent already
has 183. The five-body cohort difference predates the patch and is not concealed
as candidate regression or native-recipe identity.

The current qualified source archive was pinned at
`49d07973846893ac42df69ef9008a54b17f5b5bd`, and remained byte-identical at
`03bcf6a0b8162919a72b884869850abf342aa9d3` immediately before packaging.
Its SHA256 is `04e476628bd521dde0dc4eadc8c5692c380b9ea60ce417c9525e3f2fd3b7739e`.
The shared controller's old `scope` label and historical container source mount
mention Pump673; actual source input hashes in each launch receipt bind this
newer creator-notice workspace. They are preserved unedited.

## Local execution

Fresh original/parent/candidate triples cover 26 bounded fixtures: six cost
arithmetic boundaries and twenty V3 buyback/panic controls. All 78 executions
and signature fields are independently checked. Errors, accounts, CPI, events,
return values and ordered logs agree; only complete compute-consumption lines
are excluded. There are six distinct signed transaction wires because fixtures
also vary synthetic account state; 78 signatures are not 78 distinct transactions.

79 actual loader records include 78 executions and one fixture initialization.
Loaded ELF hashes, captured ProgramData headers/prefixes and zero allocation
tails are bound by the retained receipts. The initial directory-permission
failure happened before any VM execution, and is retained separately.
The two exact-quote post-complete controls end in Overflow; they are not proof
that the fit helper executed. No full broad regression suite is claimed.

| Loaded image | SHA256 |
| --- | --- |
| Original | `7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d` |
| Parent | `aa5b10d7e40bbb6a87d7055ca26aae85177d10dc00b9a55dc517aefa47624cf6` |
| Candidate and repeat | `1637670b9b589e39b16b6f7c246c5c659555e20f7963c4a7854a57320942c2d4` |

## Reproduction and retained commands

Run the portable stored-evidence verifier from the repository root:

```sh
python -B research/pump-v3-costs-source-20261029/verify.py --repo-root .
python -B research/pump-v3-costs-source-20261029/audit_refs.py --repo-root . --compare-retained
```

It recomputes source bindings, body metrics, complete census memberships, repeated
images, signed observations and captured-loader identities. It does not execute
the compiler or VM. Python 3.12 and `solders==0.27.1` are sufficient.

`build/*/launch.json` holds the exact executed Docker/Cargo argument arrays and
input/tool hashes. `controllers/local_build.py` retains the controller;
`build/*/build.log.gz` retains actual compiler output. The pinned image is
`solanafoundation/solana-verifiable-build@sha256:6c73adc767ee7ff212f2532d4695472b12f3d4ac20aea3db22b89d8c614dac50`.
Builds ran offline, with read-only source/SDK mounts, platform-tools v1.44 and the
qualified private dependency cache. Local paths in launch receipts must be
mapped to the supplied sources and an equivalently prepared SDK/cache to rebuild.
The retained normal build labels were `costs-parent`, `costs-sequential-mode`,
`costs-direct-gross` and `costs-direct-gross-repeat`.

`runtime/execution.json` holds the exact VM commands. The retained unchanged
producers and a path-only six-case adapter are under `runtime/inputs/`;
`controllers/run_runtime_triples.py` records orchestration. Runtime used the
historical captured loader whose exact bytes are retained, not an untested newer
allocation-cache implementation.

## Remaining mismatch and excluded hypotheses

The final target is 24 bytes longer: an extra jump after the second `add3`, and
an extra two-instruction pre-fee error tail. An early return-pointer reload splits
the later error path from the earlier one. Original code shares one payload-load
block and reloads the pointer near return. The qualified sequential-source LLVM
trace proves the emitted target is raw-equal to its normal build. Removing the
intermediate gross-up Result helped, but did not remove the remaining backend
register-allocation/tail-merging difference; the initial causal hypothesis was
therefore only partly supported.

Archived equivalent-expression probes were reviewed before this work. The older
mode-gated `Some` experiment used a different boolean/inlined-error cohort; it is
not relabeled as a new success. No further return-spelling sweep was run. The
next useful step is a qualified final-candidate ISel/register-allocation trace
that supports a source ownership/control-flow mechanism. This packet does not
claim recursive call/data closure, full function equality, whole ELF equality,
new matched windows, deployment safety, or original private source provenance.