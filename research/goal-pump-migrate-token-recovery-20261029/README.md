# Pump migration token-account helper, 2026-10-29

No new Pump window is recovered. All four source controls retain the full
1019/1035 normalized and188 raw baseline, but original `0x4c158` remains unequal.
The original helper is8368 bytes; the canonical helper at `0x5f438` is8424.
No maintained source is changed and no candidate is promoted.

## Baseline and isolation

The crate is extracted directly from Git `e38a8b97a:programs/pump`, with67 pinned
source inputs. A fresh native identity build and a passive compiler-trace build
both reproduce the entire reference pair exactly:

- unstripped `0f50faa8c325104dc77898ed84866dec2ad1eec475b6abba72c475cf7bf9bab6`
- stripped `d0377d7cef5b7378063f8bfabac5dc9c08d29eeaaaaa14022d36909688ff5e1b`

An initial copy of `work/latest-main` included four unrelated dirty files and
produced different complete images while keeping this helper and all baseline
memberships. It is retained explicitly as a failed preflight under
`noncanonical-source/` and `noncanonical-baseline/`, then replaced before controls.
It is never called canonical evidence. The immutable Git archive and both current
source/staged workspaces are retained. Shared source was neither reset nor edited.

## What actually differs

The original/current helper has ten direct defined callees in identical physical
order, with every actual depth-two identity equal. These include invoke/invoke_signed,
the six/seven AccountInfo array drop routines and two ProgramError-to-Anchor-Error
conversions. The inlined Rc clone/abort regions are also visible in both. No
extra type-admission or decoder path is observed in this helper.

All four incoming calls from the already matched `migrate_v2::execute` caller
(original `0x49888`) bind to this actual helper. Their complete caller normalized
bytes and twenty argument-setup slots immediately preceding each call are equal.
`baseline/arguments.json` retains the actual targets and every compared setup slot.
The passive LLVM signature has the same seven logical source formals and returns
an aggregate. Machine lowering introduces the output-storage pointer carried in
r1 at entry. The extra stack argument labels in that report are explicitly an
inference from source formal order and observed entry loads, rather than recovered
original variable names.

The raw syntactic graphs have137 original /138 current machine blocks; reduced
graphs have112/113 nodes. The diagnostic map pairs101 nodes before original common
return `0x2098` reaches both candidate shared reload `0x2058` and return stores
`0x20d0`. Other mapped instruction/register/stack differences remain too; the extra
join is not claimed to be the only byte difference.

The exact passive compiler trace shows this shared reload already **before**
block placement: non-native invoke success/drop6 block131 and converted-error/drop6
block132 join block133/IR587, which reloads r8 from stack-744. Native success135 and
error136 already carry r8 directly to the stores in134. Placement moves these blocks
without changing its137-block machine inventory. This is a storage/cleanup-flow
boundary, unlike Swap's competing tail-reload survivor rule.

At entry, the original uses r9 for the token-program clone and spills output r1
between its two Rc increments. The canonical image first preserves output r1 inr9,
uses another register for the token-program reference, and adds spills. This
motivated a direct test of the actual Clone source boundary.

## Bounded controls

The earlier eight H3/visibility/result controls in
`../goal-pump-create-recovery-20261028/` were read first and not repeated.

| Source control | Helper bytes | Reduced nodes | Direct callees | Result |
| --- | ---: | ---: | ---: | --- |
| Explicit safe first AccountInfo clone, matching all installed derive(Clone) fields and Rc increment order |8424|113|10|Entire ELF equals baseline; source boundary is erased |
| Each native/non-native branch returns its mapped CPI Result directly |8280|111|9|Compiler coalesces two six-account array cleanup calls into one; graph/callee roles fail |
| Name the existing non-native Instruction and six AccountInfos as real locals before invoke? |8424|113|10|Callees and prior memberships remain, but shared-reload graph failure and entry spills remain |
| Native branch returns its mapped Result early; non-native original invoke? stays |8360|112|10|Same unordered identities, but physical call order differs and two original return nodes merge into one candidate node |

The controls change only physical rows416;418/420/422;420; and418 respectively.
`CLONE-BASIS.json` binds the exact installed AccountInfo2.3.0 declaration. No
unsafe expansion, dummy state, numeric padding, signature change or emitted-byte
editing is used. Full1035-row censuses and failed maps are retained per probe.
The middle two complete unstripped hashes are
`7d80a195dfe2c05c35ca18535ef97a80aeb0d29bd87e46c04d32dfb199c14142` and
`50d57f7c04aa83bd18bbf7e404f57fca927647b735131572af52ee9a9ef16c89`.
The final native-early-return control is
`36906378e89e56b77f4b9e64db443a3da8e9052b9c3396c5911c70fd20ca50e0`.
Matching the112-node count does not repair its failed bijection:original node
`0x1f90` and common stores `0x2098` both reach candidate `0x2090`.

## Recheck and remaining mechanism

```sh
python3 -I -B research/goal-pump-migrate-token-recovery-20261029/verify_saved.py
```

The unchanged official scorer and graph readers are authenticated by `INPUTS.json`.
Verification recounts all1035 windows per saved canonical image, recomputes the
full positive/failed maps, checks the four rooted incoming calls and exact passive
machine evidence, and verifies both own source/staged workspaces are restored.
All builds have zero backend stack-overflow diagnostics. The builder's inherited
`runtime_valid` field means that diagnostic check; there were **zero** new runtime
executions, so it is not runtime acceptance or broad behavioral equivalence.

The exact callee-multiset audit corrects an initial count-based interpretation:
the direct branch-Result form coalesces **drop6** from two actual calls to one.
Both ProgramError conversions remain. `CALLEE-ROLE-DELTA.json` and verification
record the actual identities rather than inferring a missing call from count.

The still-open source question is how the original preserves the output-pointer
live range across the non-native cleanup while keeping both actual error
conversions and the same full call/argument roles. Simple first Clone expansion,
shared tail Results, this CPI-local lifetime control and the native early-return
control do not resolve it. No
extra admission behavior is indicated by the current comparison. Swap's selector
state remains sealed in `../goal-swap-recovery-20261028/phase6/` and its sole window
also remains open.
