# Lane claimv2-reconstruction

Target: original `0x77940` (8,832 B) = `token_incentives::claim_token_incentives::cashback::claim_v2`
(claim_token_incentives.rs:256). Not `migrate_v2::execute` (that is the matched 0x49888).

## Original structure (from `win.py orig 0x77940`, call targets resolved through score.json windows)

Error sites (`coords.py window 0x77940`): 305 (InvalidQuoteTokenProgram, 0x17b0), 310
(AccountTypeNotSupported, 0x177a), 342 (InvalidCashbackRecipient, 0x17bc), 333
(AccountTypeNotSupported); lines already matched the source.

Physical order of the original:

1. `Clock::get`, `quote_mint.key() == native_mint::ID` (memcmp).
2. Token branch first: two memcmps for token / token-2022 program (305, inline `to_string`);
   inline `AccountInfo` clone of `quote_mint` and owner memcmp (310, error path re-clones
   inline, i.e. `require_keys_eq!(*a.quote_mint.to_account_info().owner, ...)`);
   `associated_user_volume_accumulator.data_is_empty()` (AccountInfo call) -> 0, else
   `try_borrow_data` + `TokenAccount::try_deserialize`.
3. Native branch: `Rent::get`, inline clone + `data_len` + `minimum_balance`, then
   `lamports()` on the borrowed `&AccountInfo` (no clone) -> `get_lamports().saturating_sub(min)`.
   This is the same spelling as the v1 `claim`.
4. `amount == 0` is jump-threaded into each branch (shared `msg!` block).
5. Native `sub_lamports` inline; token payout checks (333 with an *outlined*
   `AccountInfo::clone` of `associated_quote_user`, `TokenAccount` decode, 342); `msg!`;
   native `add_lamports` inline (user = accounts+0xa8); `record_cashback_claim`; emit/emit_cpi;
   333 error (re-clones via outlined call); mint decode and `transfer_checked` (5 outlined clones).

## Trials

| trial | change | bytes | ratio | calls (orig 68+2) | official |
| --- | --- | ---: | ---: | --- | --- |
| base (d2cb88d) | - | 8,464 | 0.16706 | 62+2 | 1019/188 |
| t1-tokenfirst | token-first amount, `data_is_empty`, v1-style native rent, `to_account_info().owner` at 310/333 | 9,008 | 0.21729 | 63+2 | 1019/188, no gains/losses |

| t2-A | t1 + `if !native {token} else {native}` payout | 9,008 | 0.21729 | identical bytes to t1 | - |
| t2-B | t1 + manual user credit | 9,336 | 0.22525 | 66+2 | 1019/188 |
| t3-C | B + separate `if !native {333; recipient; 342}` before payout | 9,336 | 0.38510 | 66+2 | 1019/188 |
| t4-E | C with `add_lamports` | 9,008 | 0.38003 | 63+2 | 1019/188 |
| t4-F | C with `*associated_quote_user.owner` (no clone) | 8,824 | 0.40225 | 66+2 | 1019/188 |
| t5-G | zero check + 333/342 + mint/transfer on the token path, native has own zero check | 8,880 | 0.35508 | 68+2 | 1019/188 |
| t5-GF | G without clone at 333 | 8,584 | 0.20958 | 66+2 | 1019/188 |
| t6-GE | G + `a.user.add_lamports(amount)?` | 8,904 | 0.36389 | **68+2, all 70 calls equal to the original in order** | 1019/188 |
| **t7-H** | GE + `emit!(event)` (no clone; original builds the event once) | **8,808** | 0.36968 | 68+2, all 70 equal | 1019/188 |
| t8-I1/I2 | H + early `let user=&a.user;` | byte-identical to H | | | |
| t9-S1 | seeds inline in the call with `a.user.key()` | 8,800 | 0.35487 | 70 equal | 1019/188 |
| t9-S2 | `let user`; seeds inline in the call | 8,808 | 0.35938 | 70 equal | 1019/188 |
| **t9-S3** | `let user`; `let signer_seeds:&[&[&[u8]]]=&[&[..,user.as_ref(),&[bump]]]` | 8,808 | **0.37716** | 70 equal | 1019/188 |

### Residual after H (frame layout)

Opcode-only alignment (registers/offsets ignored) is 0.965; what remains is mostly stack-frame
offsets and register assignment. Frame objects (diagnostic `-print-before=prologepilog`/
`stack-coloring` dumps with `-Zfewer-names=no`, never proposed) show the candidate has the same
19 16-byte result slots and 6 spill slots as the original, and the same 280 B CpiContext,
192 B TransferChecked and 176 B recipient objects, but one extra 24 B object (frame 24 B deeper)
and a different top-of-frame order: original = bump(1) / user Pubkey(32) / outer seeds(16) /
inner seeds(48) / 24 / 48 / 24 / emit_cpi authority clone(48) / 192 / 280 / 176; candidate =
1 / 16 / 24 / 48 / 24 / 48 / 24 / 192 / 280 / 48 (seeds) / 32 (user) / 176. Frame index order is
reverse MIR local order (rustc inserts allocas at the entry top), so the original's seed
temporaries are created later in MIR than ours, or merged differently by stack coloring.

### Key mechanism: cold call sites

LLVM inline remarks (diagnostic copy build with `-C remark=inline`, flags never proposed):
`AccountInfo::clone` / `ToString::to_string` are inlined into `claim_v2` at threshold 325 on
warm sites and rejected at threshold 45 (`inline-cold-callsite-threshold`) on sites BFI
considers cold. The original's outlined clone at the 333 check and outlined `to_string` at
333/342 therefore mean those sites were cold, i.e. on the token path *before* any merge with
the native path. With a merged `amount` phi (t1..F) the 333 site is warm and the clone inlines.
Moving the token zero check and recipient validation onto the token path itself (t5-G) makes
the call sequence match. With that structure `add_lamports` also inlines (cost -14805,
threshold 250), so no outlined `Lamports::add_lamports` exists, as in the original.

Ledger: t1 `b9763c4eb3c9476bb82b7ee32b35a9c3`, A `cad6be18425a4cacb69d0e69ce3259d8`,
B `779096c7f3b0432e929e016dd92e723f`, C `51d54a58e53f4f4c83b2246fba46ff50`,
E `db86f2033bf14ee591c00a43d8142935`, F `131cbbe400594e6095f65d97d77cbfdc`,
G `16727f0ccb3d42f5b338762bfcc1cdad`, GF `ee182e841db741a0ada558adbe3168df`,
GE `1f28944501184011b2aaa4871182a842`, H `c04c00cdc28642d69b27648eed1d6479`, I `f25b14f092604998af3217262beb56be`, S1 `06216a76436f4ff591721bc57a1f02f2`, S2 `975fd093210e4909877edfb9a5ae634a`, S3 `09c26efb4c444d56a6d491a1f7c68db1`.

Frame note: the original's top-of-frame 1/32/16 B objects are the `emit_cpi!` event-authority seed temporaries (bump array, inner `[&[u8];2]`, outer slice); the user Pubkey of the transfer seeds is merged by stack coloring into that 32 B slot in the original, while in the candidate the emit_cpi 32 B slot is absorbed by a larger slot and `user` keeps its own slot.
