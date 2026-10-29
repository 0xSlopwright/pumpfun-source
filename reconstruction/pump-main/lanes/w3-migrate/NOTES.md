# Lane w3-migrate (wave 3)

Target: `0x4c158` `migrate_v2::create_token_account_v2` (8,368 B). Approach: IR differential, continued.
Base: origin/main 665499915 (1022 normalized / 276 raw).

## Oracles built this lane (tools/)

- `reduce.py` + `llcdiff.py` + `mx.py`: the emitted module reduced to the target body (other defines become
  declares, aliases dropped) compiles with SDK `llc -O3 -relocation-model=pic -mattr=+store-imm,+jmp-ext`
  in about 0.5 s and reproduces the official target bytes. `swapscan.py` tries every adjacent independent
  instruction swap in the target body (375 candidates in about 25 s, 8-way parallel).
- `pre.py` is a **middle-end oracle**. Build a scratch copy with `capflags.py ... -Cno-prepopulate-passes`
  to get rustc's pre-optimisation IR, then run SDK `clang --target=sbf -O3 -S -emit-llvm`, then reduce and llc.
  This reproduces the official target exactly (verified on base: ratio 1.0 against our build), in about 17 s.
  Use it to test attribute, MIR-shape and pass-order hypotheses that llc alone cannot answer.

## Findings

1. llc oracle on base IR: the original **re-loads `a.user` ([a+56]) and `a.system_program` ([a+64])**
   in the non-native infos array instead of reusing the meta-key loads. Those two reloads alone give a
   *full* match of the listing (1020/1020 instructions, 0 diff). Adding a mint reload makes it worse.
2. Middle-end oracle: two MIR loads are not enough; LLVM merges them while `a` is `noalias`. Two loads
   plus `a` without `noalias` gives a full match.
3. Mechanism: the original takes **`ctx:&Context<..MigrateV2>`** in a private fn. LLVM ArgumentPromotion
   (O3, internal linkage) rewrites it to `(ptr readonly %ctx.8.val, i8 %ctx.36.val)`, which is exactly
   `(a, bump)`. Our own `fund_quote_token_account_v2` shows the same promotion in our IR. The original
   caller loads bump from `[ctx+0x24]` right before the call. The promoted accounts pointer has no
   `noalias`, so heap and Rc stores may clobber `[a+56]`/`[a+64]` and the nn reloads stay. MIR keeps two loads
   because they are derefs of a `&mut` behind `&Context`. The native path loads go through `cta_signed`'s
   noalias scope and still merge, as in the original.
4. With an `&InterfaceAccount` mint, ArgPromotion also promotes mint to `[mint+88]`. That changes the
   caller (0x49888 lost). The original passes the Box pointer and the callee loads +0x58. Pre-IR oracle:
   v3 with mint lacking `noalias` (so not promotable past the entry Rc stores) is a full match, with or
   without readonly, dereferenceable or align.
5. `mint:&Box<InterfaceAccount>` gives the promoted Box pointer (no noalias), the same as the original
   interface. But each Box deref is a raw-pointer deref in MIR, so `mint.key()` and `mint.to_account_info()`
   load mint's info twice (v4, 0.563). A single `let mint_info:&AccountInfo=mint.as_ref().as_ref();` in
   the nn branch fixes the double load. Official result: 0.611 -> 0.911, 8,368 B (= original), 137
   slots, 1022/276, no gains or losses.

## Results (official fastbuild + score.py, base 665499915)

| Trial | Bytes | ratio | slots | normalized/raw | notes |
| --- | ---: | ---: | ---: | --- | --- |
| base | 8,400 | 0.6116 | - | 1022/276 | |
| v3 ctx param | 8,384 | 0.516 | - | 1021/276 | loses 0x49888 (mint promoted) |
| v4 ctx + &Box mint | 8,360 | 0.563 | - | - | mint info loaded twice |
| **v7 ctx + &Box mint + nn mint_info** | **8,368** | **0.9108** | **137** | **1022/276, no losses** | current branch |

## Remaining residual (v7)

The nn `mint_info` load sits at the start of the nn branch (before the meta vec allocation), so it gets a
long live range (r8). The original loads it at the meta position. The full-match pre-IR form has it there,
as a single MIR load merged by MIR GVN (an immutable `&InterfaceAccount` deref).
