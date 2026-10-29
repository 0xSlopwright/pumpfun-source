# w3-sweep: 0x72810 `sweep::execute`

Base: origin/main 6654999 (1022 normalized / 276 raw). Target: 7,832 B, 39 direct calls.

| metric | base (main) | now |
|---|---|---|
| ratio (target_metric) | 0.46947 | 0.46985 |
| cand bytes | 7688 | 7744 |
| direct calls (orig 39) | 38 | **39** |
| structural ratio (regs + stack offsets masked) | 0.8084 | 0.8096 |
| official normalized / raw | 1022 / 276 | 1022 / 276 |
| gains / losses | - | none / none |

## Mechanisms found

1. **The per-bucket quote==default memcmp is rustc MIR JumpThreading, not LLVM.** With the fee take
   written as its own `let amount = if creator {take} else {take}` after the vault/validate dispatch,
   the MIR JumpThreading pass (mir-opt-level 2) threads the later `switchInt(creator)` of
   `creator && native` back through the raw_eq call, `Default::default()` and the zero check to the
   take switch (within MAX_BACKTRACK=5, cost < 100), duplicating the memcmp chain per bucket. When the
   take sits inside the vault/validate if/else the `switchInt(creator)` is more than 5 blocks away and
   nothing is threaded (that is why the prior lane could not get 39 calls with single evaluation).
2. **SBF `analyzeBranch` cannot analyze conditional branches**, so MachineBlockPlacement force-chains
   every conditional-branch block with its next block in IR order when that block is a successor.
   The layout is therefore mostly fixed by rustc's LLVM block creation order (first reference while
   codegenning MIR in reverse postorder; RPO visits the first switch successor first).
3. `match creator as u8 {1 => vault, _ => validate}` gives `switchInt -> [1: creator, otherwise:
   protocol]`, so the creator path is codegenned first; take_c then glues to msg and take_p falls into
   memcmp_p as in the original. `if creator` / `if !creator` both give `[0: protocol, ..]` (bool Not
   is normalized), protocol first, and the msg block glues to take_p (ratio 0.398).

## Residuals (structural diff vs original)
- protocol-native edge is not threaded past the recipient clone (original has its own clone copy and
  jumps straight to the call with native=1/None/None); here it joins with a native flag spill.
- Rent block arrangement (Rent::get error From placement), token-path tail spills (+15 insns).
- Event construction (+37 insns around +0x1960).

## Tools (lane scratch, ~/.cache/pumpfun-reconstruction/lanes/w3-sweep/scripts)
oracle.py (one-function llc oracle, 0.1 s), mkone.py, blk.py/bwscan.py (block move / branch weight
scans), mbp.sh (post-placement block order), sdiff.py (structural diff), trial.sh, capture.py (+MIR).
