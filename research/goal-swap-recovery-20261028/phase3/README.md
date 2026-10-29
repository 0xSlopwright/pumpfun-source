# Exact reload-tail selection mechanism

PumpSwap remains **784/785** under its qualified Linux recipe. No source control
in this phase gains sell`0x4c750`; maintained source and its selection are unchanged.
The native source screens retain779 normalized windows. Saved checks are static,
not new runtime or independent clean-build qualification.

## Why the current early reload wins

The pinned LLVM implementation selects the **lowest-numbered eligible whole
block**, unless the layout predecessor can supply the common tail. It is not a
predecessor-iteration or frequency tie. In this case:

- The three identical whole reload blocks are63/IR432,72/IR499 and83/IR549.
- Their temporarily stripped tails contain only `r6 = [r10 -1304]`.
- After placement, identical whole blocks are profitable to merge when they
  lack fallthrough at either end. Each candidate lacks fallthrough to exit5.
- Candidate sorting uses hash then ascending block number; `SameTails` is scanned
  in descending order. The winner loop overwrites each whole-block choice, hence
  `83 →72 →63`. Exit5's actual layout predecessor13 is not a matching tail.
- Frequencies are combined after selection. The subsequent branch optimization
  renumbers blocks, followed by placement again.

This is replayed in `selector-proof.json`. The source is LLVM
`08aedd64bf3abe4f163407b7bcf680403b84b32d`, retained losslessly in `llvm/` with
URLs/hashes. See `BranchFolding.cpp` lines479,610,659,934,976 and1203;
`MachineBlockPlacement.cpp` line3431; `MachineBasicBlock.cpp` line969.
The existing v1.44 clang identifies that exact revision. This does not establish
the captured program's original source or compiler invocation.

## One distinguishing compiler diagnostic

The prior14 flag controls were inspected first (`prior-14-controls.json`). They
already include globally disabling tail merge; that was not repeated.

The new diagnostic disables **only placement-time folding** for the existing
owner/writable source partial. Its entire pre-placement machine snapshot agrees
with the enabled build. The first layout then retains all three reload stubs;
exit5's predecessor is13/IR156, ending in an `r8` load. Candidate63's next block
is62, candidate72's is67, and83 ends the function. None falls through to exit5.
This isolates the fallback rule above from the preferred-layout-predecessor rule.

The diagnostic has679 normalized /211 raw windows, losing100 normalized matches
and gaining none. It is rejected. Its79-node canonical graph exposes the two
unmerged reload nodes; it is not represented as the original77-node bijection.
Full785 rows and the failed/partial graph mapping are retained under
`no-placement-fold/`.

## Source controls derived from that mechanism

All successful source controls retain779 normalized windows with no gains/losses
against the native baseline; none matches sell. Each saves the actual incoming
caller binding, complete graph comparison or failure, and actual callee identities
through depth two. `summary.json` is the exact inventory.

| Source control | Result |
| --- | --- |
| Whole-body inline implementation + noinline original-signature wrapper |8920-byte sell; graph correspondence fails. No qualified original reload-selection shape retained. |
| Bind the final validation Result before `?` |Complete ELF repeats owner/writable partial`16d67698…`; same63/72/83 →63 selection. |
| Constructor reference temporary coercions |Same complete ELF and selection; erased by optimization. |
| Topup conditional returns Result before `?` |9024bytes,77-block topology, all1049 paired nonbranch/register slots and80callee identities equal. Two earlier predicate polarities differ; survivor remains IR432. |
| Typed try scope over the accumulator conditional |Survivor changes to IR263, but adds a unit-Result tag gate:79 canonical nodes. All80 actual callee identities remain. |
| Account-valued try scope |77nodes but failed correspondence; adds exactly one memcpy to81 calls. Rejected. |
| Labeled error-only capture carrying the constructor Result |The first attempt has a retained E0271 from a trailing semicolon. Its repaired tail expression retains77-block topology,80callee identities and zero polarity differences, but grows stack slots by96bytes and changes four register operands. |
| Prefix-only label with direct error return |9024bytes/80callee identities; splits the original common return-store path and fails the bijection. |
| Prefix-only label with `failure?` propagation |Complete ELF is identical to the direct-error-return form; no new effect. |

The try/labeled controls use the existing SDK's `try_blocks` feature. Their
original Source line positions stay fixed; the temporary feature attribute is
removed after compilation. No emitted IR, object or ELF is edited. The failed
source attempt remains under `labeled-error-only-join/`.

An earlier diagnostic searched for an exact stack offset-1304; the phase3 parser
also records pure `r6` reload stubs at any offset. In particular, the repaired
Account carrier has one IR551 stub before placement at offset-1400, explaining
why the earlier fixed-offset search omitted it. No absence claim is based on
that narrower search.

## Recheck and next boundary

```sh
python3 -I -B research/goal-swap-recovery-20261028/phase3/analyze_saved.py
```

`tools/` contains unmodified copies of the repository matcher and graph readers.
The command checks the captured-original hash, recomputes all785 rows per saved
compiler image, checks the existing rows, and writes full positive or failed
mappings. It never changes the normalization or accepts register/stack similarity
as a matched window. Failed bijections and unordered callee-multiset checks stay
separate from paired call-site evidence.

Both temporary69-file workspaces are restored to their canonical inputs. All
builds reuse dependencies and retain the inherited three backend frame warnings;
compiler success is not a broad safety claim.

The now-specific open source problem is to alter cleanup-block creation order
or make the original late block the eligible layout predecessor, while keeping
the existing Result storage, registers and shared return stores. Broad guard
spelling, generic hint and global flag sweeps have not produced that result.
