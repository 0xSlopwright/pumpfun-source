# Lane admincto-reconstruction: 0x22a10 `admin_cto::execute`

Baseline: origin/main 16eecb1 (1020 normalized / 188 raw; built at `$OUT/out/base`).
Tools in this directory: `annotate.py` (event map: resolved callees, log literals, Source lines),
`cfg.py` (basic-block CFG with successors/predecessors and events) for the original window or a
candidate build.

## Assembly findings (original 27,400 B, 378 blocks)

1. Entry computes, before any validation: `holder-rewards` PDA from the mint, then
   `shared = bonding_curve.creator == sharing_config.key && sharing_config.owner == FEES && !sharing_config.data_is_empty()`
   (that operand order), then `global_quote(bonding_curve.quote_mint)` (default / native / whitelist[0]), then
   caches curve and global scalars.
2. Old-creator wallet handling (logs "is a program" / "not system-owned", writable check line 556,
   frozen log, collect + create_idempotent + collect_coin_creator_fee) runs BEFORE the shared holder
   sweep, and is gated on `!shared && !bonding_curve.is_holder_reward && old != default`.
3. Error sites 556, 648, 660, 719 are followed by an `Ok`-tag (`== 2`) check: the code containing
   them was a Result-returning body inlined into execute and propagated with `?`. Sites 284..410
   return directly.
4. Hot/cold: `<AccountInfo as Clone>::clone` (cost 60) inlines only at sites >= 2 % of entry
   frequency. In LLVM's `updateThreshold`, a cold call site calls `DisallowAllBonuses()`, which also
   removes the 15,000 last-call-to-static bonus, so a big single-use private helper or closure is
   inlined only when its call site is not cold. The caller's BFI is not recomputed while the
   inliner works through execute's call list, so blocks after an inlined helper keep the frequency
   they had before it was inlined.

## Trials (ledger lane `admincto-reconstruction`)

| trial | mechanism | bytes | calls | block_jaccard | insn_jaccard | win ratio |
|---|---|---:|---:|---:|---:|---:|
| base | origin/main 16eecb1 | 18,464 | 178 | 0.068 | 0.200 | 0.095 |
| t1 | hoist PDA/shared/global_quote; wallet section before sweep, original gate | 17,872 | 177 | 0.076 | 0.205 | 0.117 |
| t2 | + wallet and sweep as Result closures | 11,008 | 86 | | | 0.088 (closures outlined: cold sites) |
| t3 | + validations (284..338) in a Result closure at entry | 24,976 | 109 | 0.190 | 0.258 | 0.066 (1 loss: AdminCtoEvent::data inlined) |
| t4 | + wallet gate moved inside its closure (unconditional call) | 26,888 | **154 = orig** | 0.204 | 0.274 | 0.051 |

t4: the direct-callee multiset equals the original's (154 calls, 3 syscalls), the transfer and
sharing-config CPI clones are inlined as in the original, and the other 33 clone calls stay
outlined. Zero losses (1020/188). win.py's difflib ratio falls because the block layout differs;
block_jaccard and insn_jaccard (callgraph-census `blocksim.py`) both rise.
| t5 | + gate `collect_old` computed before prepare_bonding_curve | 24,576 | 163 | | | 0.103 (call order closer, sharing_config CPI goes cold) |
| t6 | + sweep / reset flags precomputed | 24,512 | 163 | | | 0.069 |

t5/t6 not kept: in the original the gate flags are computed before prepare, but here that pushes the
sharing_config CPI site below 2 % entry frequency. Next: tune what is computed early
so physical order matches without losing the hot CPI sites; replace closures with named helpers.

## Round 2 (base: merged main 60bdd8a, then abd766d with #1246 = t8 merged)

Pre-inline BFI of execute (`-print-bfi`, `-print-before=inline`, diagnostic build d5): every `?` tag
check on a Result is 50/50 and `require!(creator_fee==0)` is 37.5 %. t5 called the wallet closure
unconditionally (gate inside), so the post-wallet join was 0.047 of entry and the sharing_config CPI
site 0.0176 (< 2 %, cold, clones outlined). The original branches once on a precomputed gate
(`1c78: jne r6`) before the inlined wallet body, so its join keeps the 0.047 skip mass plus 0.023.

| trial | mechanism | bytes | calls | blocks | win ratio | callseq |
|---|---|---:|---:|---:|---:|---:|
| t7 | `collect_old` before prepare; `if collect_old { wallet()? }` (one precomputed gate) | 27,440 | 154 | 370 | 0.152 | 0.667 |
| t8 | sweep body in original shape (native = quote_mint==native_mint at sweep start; `!empty && token_frozen`; seeds before the native branch; Rent::get then minimum_balance then lamports; raw_amount, frozen, `if frozen {require 719} else if amount>0 {create; transfer}`) | 27,176 | 154 | **378 = orig** | 0.167 | 0.778 |
| t9 | `sharing_update: Option<Option<Pubkey>>` computed after validation (event's `sharing_config_reset` is `tag != 2` in the original); `target=old` for shared&&!holder fixed before prepare | 27,064 | 154 | 374 | 0.183 | 0.778 |
| t10 | old creator/fee read from the curve right before the update; event reads new_creator, fee bps, holder and cashback flags back from the curve (as the original's event block does) | 27,160 | 154 | 371 | **0.193** | 0.778 |

All zero losses (1020/188). t7 and t8 were merged in #1246. Ledger ids: t7 44d5741f, d5 62ab6da8,
t8 eeff1b3e, t9 fe58b274, t10 43a05a3d.

### Round 2, part 2 (base main abd766d = t8 merged; PR #1291)

| trial | mechanism | bytes | win ratio | block_j | sorted | result |
|---|---|---:|---:|---:|---:|---|
| t11 | AdminCtoEvent built once, `emit!(e); emit_cpi!(e)` (original calls Event::data twice on one struct; Clock->data span 0x240 = orig) | 26,680 | 0.2007 | 0.212 | 0.180 | kept |
| t12 | validation split: holder path (298, then fee checks) vs non-holder (306 let-else, 307 zero, 312 memcmps), fee checks under `if let Some(f)` (matches orig CFG 0730/0900/0c08) | 27,240 | 0.098 | 0.202 | 0.153 | raw 190 by address luck; not kept |
| t13/t16 | + `holder.unwrap_or(false)` first (orig `and r8,1`); nesting 296 under else is byte-identical | 26,856 | 0.099 | 0.199 | | not kept |
| t14 | `CtoState` struct literal at entry (orig 0x420 block stores a 46-byte aggregate: creator, max fee, 6 bools in rustc layout; its creator field is memcmp'd so every store survives) | 27,152 | 0.118 | **0.233** | 0.188 | alternative line |
| t15 | t14 + t12 | 27,376 | 0.111 | 0.211 | | 4 syscalls, rejected |
| t17 | t14 with validation as nested `fn validate(&CtoState, ..)` | 27,072 | 0.150 | 0.223 | 0.191 | alternative line |
| t18/t19 | CollectCreatorFeeEvent emitted by reference (event block 142 -> 123 insns, orig 126) | 26,616 (t19) | **0.2009** (t19) / 0.150 (t18) | 0.212 / 0.223 | 0.181 / 0.196 | t19 kept |
| t20 | t18 with global_quote evaluated inside the struct literal | 27,024 | 0.107 | 0.213 | | rejected |

Hot/cold map of validation error sites (`hc.py`: an error block that calls `to_string` is cold, an inlined
Display::fmt is hot). Original: 284 289 296 298 306 326 410 556 648 hot; 307 312 330 334 338 660 719 cold.
t19 differs at 307 (hot) and 326 (cold); t12-line at 307 and 312 (hot). Remarks with line tables show a
two-level decision: a to_string site judged cold inside the validation closure is re-judged when the
closure is inlined into execute (307/312/326 then come out hot at threshold 325). The closure-level
frequencies of 307/312/326 sit at 0.017-0.023 of entry, right at the 2 % line, so equivalent
spellings flip them.
