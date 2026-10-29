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

Ledger: t1 `b9763c4eb3c9476bb82b7ee32b35a9c3`.
