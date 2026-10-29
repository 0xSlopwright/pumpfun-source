# w3-sweep: 0x72810 `sweep::execute`

Base: origin/main 6654999 (1022 normalized / 276 raw). Target: 7,832 B, 39 direct calls.

| metric | base (main) | r1 (a08) | r2 (a22) | now (a23) |
|---|---|---|---|---|
| ratio (target_metric) | 0.46947 | 0.46985 | 0.48150 | **0.49139** |
| cand bytes (orig 7832) | 7688 | 7744 | 7840 | 7824 |
| direct calls (orig 39) | 38 | 39 | 39 | 39 |
| structural ratio (regs + stack offsets masked) | 0.8084 | 0.8096 | 0.8723 | **0.8805** |
| official normalized / raw | 1022 / 276 | 1022 / 276 | 1022 / 282 | 1022 / 276 |
| gains / losses vs main | - | none / none | 6 incidental raw gains (call-distance at 7840 B) / none | none / none |
| unstripped sha256 | | b25e6708.. | eb96c799.. | b7005220e751980610ffc30b5b52cfe6bdbd1bff9d5b0ce52113aa7759fe1cc5 |

a23 = a22 with `admit_quote_accounts(a: &mut SweepFees)`: a `&mut` param (like execute's own `a`) makes
LLVM reload payer/system_program from the accounts struct for each admit (orig +0xdd0), instead of
caching them across the calls as it may for a noalias-readonly `&`.

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

4. **Rent top-up is a Result-returning helper** (`ensure_rent_exempt`, inline(always)): the original
   merges the `Rent::get` From error and the transfer Result in one phi before a single `?`
   (orig +0x1538 `jeq r1,2`), which inline `?`s do not give.
5. **`emit!(event); emit_cpi!(event)`** (both macros take `&event`) instead of `emit!(event.clone())`:
   the original builds the event once.
6. **Protocol-native threading = MIR JT through the recipient clone.** `match (creator,native)
   {(true,true)=>rent,(_,false)=>token,(false,true)=>{}}`: the explicit `(false,true)` arm gives the
   protocol-native edge its own (empty) MIR block, so MIR JT can thread the `if native {None}` Option
   switch back through the `to_account_info()` call (JT skips SwitchInt predecessors of multi-pred
   blocks, so `else if !native {token}` never threads). Verified in a synthetic MIR lab (jt/lab.py).
7. **Cold call sites**: after that threading the shared rent/token join's clone has pre-inline block
   frequency 1.5-1.7% of entry (< ColdCallSiteRelFreq 2%), so LLVM leaves it out of line (40 calls).
   The token admits in an inline(always) Result helper (`admit_quote_accounts`) merge the two admit
   errors, raising the join above 2%, and every clone is inlined (39 calls).

## Residuals (structural diff vs original)
- token helper region: arg spills (+8 at +0xde0), first-admit error branch shape (+0xf28).
- rent transfer block placed inline after lamports (orig places it after protocol-native, +0x14f0),
  Rent::get From placement.
- a few base_mint/quote_mint load orders, event bucket store order; stack frame offsets.

## Tools (lane scratch, ~/.cache/pumpfun-reconstruction/lanes/w3-sweep/scripts)
oracle.py (one-function llc oracle, 0.1 s), mkone.py, blk.py/bwscan.py (block move / branch weight
scans), mbp.sh (post-placement block order), sdiff.py (structural diff), trial.sh, capture.py (+MIR).
