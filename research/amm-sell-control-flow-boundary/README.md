# Remaining maintained AMM Sell control-flow boundary

The maintained r31 Sell cashback helper has **no remaining register-operand
differences under a complete 77-block structural correspondence**. Its 1,049
paired non-branch instruction slots retain identical normalized bytes, including
registers, and identical relocation descriptors. This narrows the current
9,024-byte recovery target to branch arrangement and an actual decoder-call
boundary; it does **not** make the official function window equal.

The official census is still **784/785 normalized, 394 raw**. Sell at original
`0x4c750` remains **UNEQUAL**. No source, compiler output, selected checkpoint,
matcher, or global count is changed. There are no new builds or runtime replays.

## What is new and what was already recovered

The earlier [PR645 packet](../amm-sell-returned-key-20261028/README.md) restored
the returned-account key expression but retained 120 register-different slots.
The newer [maintained r31 source](../../repro/pump_amm/canonical-frontier-20261028/README.md)
already includes both `&accumulator.key()` and
`authority: accumulator.to_account_info()`. This audit gives that **existing**
source/build credit for eliminating the register differences. It does not
reclaim those source changes as a new recovery.

The new result is an independently regenerated, complete current-artifact block
and instruction correspondence, with the remaining call discrepancy kept visible.
The prior #645 artifact is also rechecked: 120 register differences and all 80
paired depth-two call identities remain, demonstrating that its claims describe
a different image. Counts and receipts from those images are not combined.

| Observation | Captured original | Maintained r31 |
| --- | ---: | ---: |
| Helper start | `0x4c750` | `0x4c4e8` |
| Function bytes | 9,024 | 9,024 |
| Syntactic machine blocks | 94 | 93 |
| Unconditional jumps | 35 | 35 |
| Empty forwarding blocks removed for attribution | 17 | 16 |
| Canonical reachable blocks | 77 | 77 |
| Paired non-branch slots, including 53 `lddw` continuation slots | 1,049 | 1,049 |
| Register-different paired slots | — | 0 |
| Original-equal actual depth-two call identities | — | 79 / 80 |

The one predicate-polarity change is at relative `0xd00`: the original uses
`JEQ r2,r3` followed by a forwarding jump; the candidate uses `JNE r2,r3` with
the edge roles exchanged. Other differences move blocks and alter jump
displacements/forwarding. Every canonical conditional operand, immediate,
edge role and successor is compared; this is not a bag-of-instructions score.
The [block map](block-map.tsv) records all 77 pairs. The lossless
`report.json.gz` retains each original and candidate normalized value, machine
terminator, forwarding record, mapped edge and actual immediate call target.

## The decoder edge stays unresolved

The real original legacy-sell caller at `0x49b50` matches the complete
9,184-byte candidate caller at `0x498e8`. Its call at relative `0x13d0`
uniquely selects the compared helper. A disconnected symbol lookalike is not
accepted.

At helper-relative `0x17a0` / `0x1798`, the original calls constructor `0x6528`
and the maintained candidate calls `0x3a10`. Their complete **1,024-byte
normalized bodies and relocation patterns are equal**, but their actual calls
at constructor-relative `0x290` select different decoders:

| Image | Actual decoder | Bytes |
| --- | --- | ---: |
| Original | `0xd4f90`, checked deserializer | 728 |
| Maintained candidate | `0xd3ea8`, `try_deserialize_unchecked` | 1,504 |

This is the decoder distinction already recovered in
[PR630](https://github.com/lalalune/pumpfun-source/pull/630), now explicitly
located in the current maintained selection. The archived current source at
`sell.rs:451` still invokes `Account::try_from_unchecked`. The artifact and
source are reported as they exist; this packet does not silently substitute
#630's checked constructor or claim a newly discovered runtime rejection.

A future source experiment should retain the current parsed-account ownership,
restore the qualified checked-constructor selection, and investigate branch
placement around the account-borrow result and ATA creation. It must freshly
build/replay the composition and retain the strict window acceptance criterion.

## Verify

```sh
python3 -B research/amm-sell-control-flow-boundary/verify.py
python3 -B research/amm-sell-control-flow-boundary/test_audit.py
```

Only the Python standard library is required. Eight repository inputs are
SHA-256-bound before the historical reader/graph tools are imported. The
selected stripped image's complete text and relocation table must agree with
its symbol-bearing companion. The current source expressions are extracted
from the immutable qualified source archive. Packet membership, compressed
report, readable summary and TSV are independently checked.

Fifteen tests pass: the positive current/historical controls, ten real ELF
mutation controls, and four graph/metadata controls. These deliberately bypass
the outer input hash gate to exercise the parser, incoming-call binding, branch
bijection, exact values and actual nested callee checks. One ELF control
repairs the nested decoder edge and must invalidate the stale 79/80 report.
The remaining mutations change registers, opcodes, store offsets, wide
immediates, branch operands/polarity/targets, callers, callees or graph contents.
Python `-O` is rejected because the pinned historical graph tools use assertions.
The full verifier and all tests also pass in an isolated 18-file tree containing
only this packet and its eight declared external inputs. No SDK, Cargo cache,
untracked work directory or third-party Python package is needed.

## Limits and overlap

This is structural decompilation evidence, **not** a register-renaming acceptance
rule, whole-function semantic proof or recovered historical source spelling.
The syntactic graph includes fallthrough after calls without modeling which
calls abort. Static pointed-to data, indirect calls, recursive call closure,
whole-ELF equality and exhaustive behavior are unproved. The report keeps the
one mismatched direct-call chain separate from equal normalized instructions.

Work began at upstream `6aa66f03c6e83e23f546be406b1eed158e15a507`. Open and closed
PRs were searched, including the #617 buy recovery, #630 checked decoder,
#645 returned key and #652 maintained promotion. The only open PRs at the initial
check were unrelated frontend work. `pr-review.json` retains the bounded search
results and final overlap check; this is not a claim to have reviewed every
historical PR in the repository. Only this directory and a dedicated workflow
are added.
