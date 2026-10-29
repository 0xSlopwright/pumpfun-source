# Constructor suffix scopes and exact reload origins, 2026-10-28

The three constructor-suffix controls produce no new sell match. Each preserves
all779 native matched windows. None retains the original77-node graph. The
qualified Linux frontier remains784/785 and sole open Swap window `0x4c750`.
No negative control is promoted, and no Linux build or runtime replay is added.

## Exact original reload origins

These refer to the strong owner/writable source and its retained pre-placement
machine snapshot, not the different syntactic/canonical graph node counts.
`reload-origins.json` retains the relevant machine blocks and eight complete
successor paths; `verify_saved.py` replays every edge and checks the actual calls.

| Pure reload stub | Result/cleanup origin |
| --- | --- |
| 63/IR432 | Source451 checked `Account<UserVolumeAccumulator>::try_from` error, via machine block27 |
| 72/IR499 | Source481 `InterfaceAccount<TokenAccount>::try_from_unchecked` error, via block68 |
| 83/IR549 | Source404 system transfer error via37; source415 allocate CPI ProgramError conversion and clone Rc cleanup via43→45; source420 assign counterpart via52→54; source504 final pool validation error via79→82, after accumulator exit succeeds |

Allocate/assign cleanup reaches83 when the decremented Rc strong count remains
nonzero; zero-count cleanup follows its separate drop path. Associated-token
create and accumulator exit errors use different error blocks with additional
loads; neither is the source of the second pure reload stub.

All three pure stubs contain the same `r6` stack-1304 reload and jump to common
exit5. Phase3 established the pinned LLVM rule: descending whole-tail candidates
83,72,63 are visited, and the last whole-block overwrite selects lowest-number63
because the common exit's physical predecessor is ineligible. Source-level
scope changes below do not preserve the graph while changing that selection.

## Bounded source controls

The earlier constructor matches bound a value and then continued outside the
match. This phase puts the entire remaining suffix inside the successful arm.
The unit forms return errors ordinarily and put final `Ok(())` outside the match.
All existing validation order and error Source rows remain fixed; there is no
Account-carrier try block or inserted Result gate.

| Control | Native normalized/raw | Sell bytes | Canonical nodes | Exact rejection |
| --- | ---: | ---: | ---: | --- |
| Checked Account tail match, suffix in Ok arm, direct tail Err arm |779/285|9016|78|Original common return-store node splits;80 actual callee identities retained |
| Checked Account unit-valued suffix match |779/225|9032|78|Original shared reload node splits;80 actual callee identities retained |
| InterfaceAccount unit-valued suffix match |779/225|8888|75|Graph merges two original nodes and has79 calls; one original `memcpy` is eliminated |

All three still bind the real already-matched caller to the actual cashback
body. Their full images are respectively:

- `decbacb951c2d7a2e2163d02e2144c41540368c687e5a887752c81e893683182`
- `de90032802a89a7b9d771b5902a1799771e31b2ab54eefba8414f1adc37bd6fa`
- `52a17c39a8a51f339d7f26604007e077be6f35016771f9dba87f20de621b2fa3`

The two checked-Account forms change the output register to `r7`, the output
pointer spill to-1368, and leave two whole reload stubs; the earlier one still
survives. The InterfaceAccount form leaves the earlier checked-Account-origin
`r6` reload as the lowest candidate and changes the spill to-1520. None meets the
required77-node,1049-slot,80-paired-call diagnostic boundary. The full failed maps
are retained rather than interpreting equal caller/callee counts as equivalence.

## Register-aware diagnostic correction

The prior detector was specifically a two-instruction `r6` reload plus jump.
Its absence does not prove absence of output-pointer reloads. The broad wording
in phase5's frozen README is superseded by this correction. The new passive
reader derives output registers from actual exit stores and includes fallthrough
reload blocks at any stack offset. It finds the whole-wrapper's `r7` reload at
79/IR547 and the whole-closure's at79/IR552, each already immediately before the
late return before placement and unchanged afterward. Their graph/caller failures
remain unchanged. Frozen earlier manifests and files are preserved.

## Recheck and handoff

```sh
python3 -I -B research/goal-swap-recovery-20261028/phase6/analyze_saved.py
python3 -I -B research/goal-swap-recovery-20261028/phase6/register_aware_reload.py
python3 -I -B research/goal-swap-recovery-20261028/phase6/callee_changes.py
python3 -I -B research/goal-swap-recovery-20261028/phase6/verify_saved.py
```

The unchanged matcher checks all785 original windows per image. Verification
also checks all643+149+25+15 older frozen files and both restored69-file temporary
workspaces. No maintained Rust, emitted IR, object or ELF is changed. The three
inherited backend frame warnings remain a distinct safety limitation.

The strongest source partial remains `../graph-partial-sell.rs`: same77 canonical
blocks,1049 nonbranch instruction slots including registers,80/80 actual depth-two
callee roles and zero polarity mismatch, but9040 bytes and the wrong surviving
reload/layout. Whole-tail try, full-function closure/helper and bounded constructor
suffix scopes are now measured; repeating those forms is not the next source
mechanism. Swap's last window remains open while work temporarily diversifies to
the unowned Pump migrate_v2 token-account helper.
