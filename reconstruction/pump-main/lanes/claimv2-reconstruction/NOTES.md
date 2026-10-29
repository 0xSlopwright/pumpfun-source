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
| **t6-GE** | G + `a.user.add_lamports(amount)?` | 8,904 | 0.36389 | **68+2, all 70 calls equal to the original in order** | 1019/188 |

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
GE `1f28944501184011b2aaa4871182a842`.
