# Lane w3-buyexactquote-v3 (wave 3)

Target: `0x1489f8`, `trade::buy_exact_quote` (v3), original 7856 B (982 slots, 952 insns).
Base: origin/main 665499915 (1022 normalized / 276 raw). Base target: 7656 B, ratio 0.3129,
66/66 calls.

Approach: semantic reconstruction (callgraph census first, then the IR oracle).

## Tools (scripts/)

- `trial.py NAME EDITS.py`: copies `programs/pump`, applies `(old,new)` edits to `trade_v3.rs`,
  builds with `--emit=link,llvm-ir` (separate `SLOT` work dirs so three builds can run at once;
  a shared work dir makes parallel builds overwrite each other), scores with score.py, and
  prints the target metric, the llc-oracle diff and the buy_v3 and sell_v3 sibling metrics.
- `ir.py NAME EDIT.py`: llc oracle on rustc's optimized IR (SDK llc `-O3 -relocation-model=pic
  -mattr=+store-imm,+jmp-ext`). It reproduces the fastbuild function exactly. It reports raw
  diff slots and ratio, plus a "masked" ratio with registers, stack offsets and branch offsets masked.
- **opt oracle (new)**: `capture_raw.py SRC WORK OUT -C no-prepopulate-passes` gives rustc's
  pre-optimization IR. `opt -O3` (from `~/.cache/solana/v1.44/platform-tools/rust/lib/rustlib/aarch64-apple-darwin/bin/opt`,
  LLVM 18.1.7-rust-dev) followed by llc reproduces `buy_exact_quote` byte for byte (927/927 insns).
  `opt -O3 -print-changed -filter-print-funcs=SYM` together with `passes.py` splits the per-pass
  dumps, which shows which pass makes a given IR shape.
- `bbmap.py`: basic-block map (call names, error-line immediates, branch targets) for the original and a candidate.

## Findings

1. The error-site line order is the same as the original (881, 882, 891, 926, 1001, 993, 935, 971),
   and the 66 calls are the same multiset. The gap (-25 insns) is spread over the whole function:
   the v3_execute_buy argument tail (+14 in orig: post payload copied through two stack temps),
   the crossing guard (orig hoists usub.sat and uses a bitwise `can_cross & (available>first)`),
   a `can_cross` retest after the post merge (orig keeps it; ours is jump-threaded), and the
   v3_buy_costs blocks (+2 each).
2. **can_cross phi (fixed, c11).** The original keeps `can_cross` as a phi
   (`mov r4,0` before the mayhem test, `r4=(memcmp!=0)`), then `mov r1,r4; and64 r1,1; jne ok; jne partial,ok; error 926`.
   Ours had `or i1 memcmp_ne, partial_fill` (brmerge). The opt-pass dump shows that the threading
   is already in rustc's pre-optimization IR: **MIR JumpThreading** runs after the MIR inliner inlines the
   `#[inline(always)] v3_fee_exempt` (the mayhem arm stores the constant `false`). A helper without an
   inline attribute is not MIR-inlined (it is not a leaf, so it is not cross-crate-inlinable). LLVM inlines it later and keeps the phi.
   - c07: dropping `#[inline(always)]` from v3_fee_exempt keeps the phi, but with the *exempt*
     polarity (`jeq exempt,0`). The ratio falls to 0.265.
   - c09/c11: a non-inline helper that returns can_cross (`fn v3_can_cross(..)->bool{!v3_fee_exempt(..)}`)
     gives the original's polarity. The target goes from 7656 B / ratio 0.3129 / masked 0.7100 to
     **7664 B / 0.3287 / masked 0.7415**. buy_v3 and sell_v3 are unchanged (3680/0.8774, 6040/0.9871). Score is 1022/276, no losses.

## Attempts (ledger keys `0x1489f8-main-6654999-*-v1`)

| trial | mechanism | bytes | ratio | masked | result |
| --- | --- | ---: | ---: | ---: | --- |
| base | main 665499915 | 7656 | 0.3129 | 0.7100 | |
| x01 | (re-run) bitwise guard + precomputed rest | 7712 | 0.2725 | 0.6797 | rejected |
| c01 | `let exempt` local (buy_v3 idiom) | 7704 | 0.2292 | 0.5761 | rejected |
| c02 | `if !can_cross{require!(partial_fill)}` | 7656 | = base | | identical |
| c03 | `require!(partial_fill||can_cross)` | 7680 | 0.2901 | 0.7088 | rejected |
| c04 | `let amount` before require! | 7656 | = base | | identical |
| c05 | can_cross at top level (before tokens>real) | 7800 | 0.2667 | 0.7359 | rejected (memcmp hoisted) |
| c06 | inline `!(mayhem||key==wl)` | 7648 | 0.3078 | 0.7029 | rejected |
| c07 | v3_fee_exempt without inline attr | 7656 | 0.2650 | 0.6344 | phi kept, wrong polarity |
| c08 | `#[inline]` hint | 7656 | = base | | identical |
| c09 | non-inline `v3_can_cross` (direct) | 7664 | 0.3287 | 0.7415 | partial |
| c10 | c07 + exempt local | 7656 | 0.2650 | 0.6344 | = c07 |
| **c11** | non-inline `v3_can_cross{!v3_fee_exempt}` | 7664 | 0.3287 | 0.7415 | **kept** |
