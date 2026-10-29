# Whole-function tail try block, 2026-10-28

The requested whole-function tail try block was new. Earlier phase1 try syntax
covered only `validate_pool_v2`; phase3 syntax covered initialization prefixes or
an Account carrier. This phase compiles exactly two source controls. Neither
matches sell `0x4c750`, and both preserve every one of the 779 native matched
windows. The maintained Linux frontier remains 784/785; neither negative control
was promoted or built on Linux.

| Source control | Sell bytes | Native normalized/raw | Canonical graph | Result |
| --- | ---: | ---: | --- | --- |
| Entire cashback body is the tail `try { ... }`; existing `?` is local, ordinary guard returns stay ordinary, final `Ok(())` is removed | 8920 | 779/225 | 76 nodes; fails original 77-node bijection at original return-store block `0x960` | Rejected |
| Same tail try, with the existing four explicit guard returns and two `require!` guard returns propagated through the local try residual | 9040 | 779/225 | All 77 nodes, 1049 nonbranch instruction slots including registers, and 80/80 actual depth-two call-site identities pair; no polarity mismatch | Complete ELF is identical to the earlier owner/writable partial; no new effect |

The first image has SHA256
`5be12117d17d1e782834ad3c187c1f555172652b236f99724d5dfa48524d8151`.
The second repeats
`16d67698a423e6e5cfeb5d9c2906a708b9ee983b997b0395b14ad84f7db77163`.
The original target is still 9024 bytes. Equal sizes or graph attribution are
never counted as a window match.

## Observed machine effect

The first control still enters machine block placement with three pure output
pointer reload stubs: machine blocks 62/IR425, 71/IR487 and 82/IR543. It does not
preconsolidate the late return before residuals. Its 84 machine blocks become 82.
After placement there is a new reload-only block 16/IR104 that falls into the
return stores in block 17/IR104. The first missing-account error now reaches that
reload at relative `0x8e8`, then the stores/exit at `0x8f0`. The original error
reaches its stores/exit directly at `0x960`. This is a concrete graph difference,
not the requested late reload survivor with the original edges.

Routing all existing guards through the same local residual erases that effect:
the complete compiled ELF equals the earlier strong source partial. Therefore
these controls do not provide a source route to the desired block selection.
The exact winner rule remains the pinned LLVM selector established in phase3.

## Recheck and boundaries

```sh
python3 -I -B research/goal-swap-recovery-20261028/phase4/analyze_saved.py
python3 -I -B research/goal-swap-recovery-20261028/phase4/verify_saved.py
```

The first command uses the frozen, unchanged phase3 matcher/graph readers to
recount all 785 original windows and retain complete positive or failed maps.
The second verifies all 643 phase1/2 and 149 phase3 frozen file hashes, the source
line controls, the graph counts, the machine evidence and both restored 69-file
workspaces. The source remains 567 physical lines. `try_blocks` is enabled on the
existing first lib.rs line only for each compilation and is restored afterward.

No maintained Rust source, emitted IR, object or ELF was edited. Both builds
reuse the pinned native SDK and captured canonical source from the earlier
phases; launch arguments and complete compiler logs are retained per image.
The inherited three backend frame warnings remain. No new runtime replay or
whole-contract equivalence claim follows from these static negative controls.
