# Lane w4-createv2 (wave 4)

Target: `0x1e7c0` `pump_recovered::create_v2::execute` (original 15,576 B, 125 direct calls).
Base: origin/main 630a074 (1023 normalized / 277 raw); target 0.75114, 15,632 B, 125 calls.

## Result

| Build | Bytes | Ratio | Calls | Official | Notes |
| --- | ---: | ---: | ---: | --- | --- |
| base 630a074 | 15,632 | 0.75114 | 125 | 1023/277 | x27 form |
| r1nc (R1 rep: `Option<u64>` reserves, `Nested(u8)`) | 15,528 | 0.50862 | 125 | 1023/276 | raw loses 0xa868 |
| s1 = r1nc + `let initial_virtual_quote_reserves=global.…;` before the test | 15,544 | 0.54281 | 125 | 1023/276 | source form of the w3 "sel" IR edit |
| **t3 = s1 + curve init moved into `fn init_curve(...)` taking `quote_mint: Pubkey` by value** | **15,600** | **0.80355** | 125 | 1023/276 | frame layout = original; raw loses 0xa868 (layout) |

## Mechanisms

1. **sel (eager default, select)**: binding `global.initial_virtual_quote_reserves` to a local *before* the
   `quote_mint == Pubkey::default()` test puts its load ahead of the `Pubkey::default()` memset, so InstCombine
   can no longer sink it into the empty `None` arm; SimplifyCFG then forms `select isNone, ivqr, r`
   (no `sink.split` block), which BPF lowers to the original diamond.
2. **swap (quote_mint at the top frame slot, compared in place)**: the w3 oracle needed the compared/stored
   32 B Pubkey alloca *above* every execute-local alloca, with the user local `quote_mint` reduced to a dead
   24 B tail. That is exactly what a by-value `Pubkey` argument to a function that the MIR inliner refuses
   (too big: the whole curve initialisation) but LLVM inlines (single call site) produces: rustc creates the
   indirect-argument copy during codegen, so its alloca is emitted at the start of the entry block (after the
   LLVM-inlined `.i` allocas, before all MIR-local allocas); after LLVM inlining the callee compares that copy
   in place and stores it into the curve. In the caller `quote_mint` is no longer borrowed, so it is SROA'd to
   `_83.sroa.12` (the original's untouched 24 B object at -0x4d8). Frame now equals the original through -0x508.
3. Remaining diff is register assignment (orig keeps is_holder_reward in r6/ctx in r7, global ptr spilled at
   -0x720, depth as `jlt tag,3; mov r9,r5`) and the curve-store schedule.

## Raw-layout caveat

`0xa868` (`<&T as Debug>::fmt`, 24 B) is a raw match only because the net size of all functions between it
(0xa7b0 in the build) and its callee (0x1a24f8) equals the original distance. execute lies in between, and
base is +56 B over the original, compensated elsewhere. Any change of execute's size (including reaching the
original size) flips this raw membership; it is a layout coincidence, not a code regression.

## Tools

`scripts/`: `build.sh` (fastbuild + IR/MIR capture via `capmir.py`, score, target metric), `mk.py` (apply an
edit file to a crate copy), `trial.sh`, `ir.py` (slim IR -> llc oracle, 0.2 s), `ren.py` (renames numbered
SSA values so IR edits can move instructions), `an.sh` (frame + register/offset maps), `rec.sh` (ledger).
`ed/`: source edits (`r1nc.py`, `s1.py`, `t3.py`) and IR edits (`ir_sel*.py`, `ir_bc.py`).
