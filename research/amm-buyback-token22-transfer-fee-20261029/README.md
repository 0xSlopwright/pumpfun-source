# buyback leg of trade_v2 / buy_exact under a Token-2022 quote transfer fee

## Problem

Run 1 packet #14 (sell transfer fee) and #12 (buy-exact transfer fee)
measured only the user's receipt, never the buyback recipient delta,
and run 1 packet #18 measured buyback authorization only against the
plain Token program. What happens to the buyback leg itself when the
quote mint is a Token-2022 mint with a transfer fee was never
receipted: does the buy side gross the user up for both legs, does
the sell side withhold per leg, does a capped fee bind on both legs,
what does a 100% fee do on each path, and which authorization error
fires when the buyback ATA belongs to the wrong program, owner, or
mint? This packet pins all of that at runtime.

Setup: the fixture pool's quote mint is re-issued as a Token-2022
mint with the stated transfer fee (bps, max), the quote token
program meta is swapped to Token-2022, and the buyback recipient is
replaced by the Token-2022 associated token account (ATA) of the
same authorized owner. The plain-Token buyback ATA stays in the VM
untouched in fee cases, so its delta is 0 there.

## Cases

18 cases x 3 images (original / #424 control / #427 candidate),
54 signed receipts, parts of 10 ([10, 10, 10, 10, 10, 4]).

Buy (buy_v2, 10^10 base out, limit u64max):
- `buy-notf`: no fee — success.
- `buy-tf100`: quote fee 1% — success.
- `buy-tf5000`: quote fee 50% — success.
- `buy-tf5000-max100`: quote fee 50% with a 100 cap — success.
- `buy-tf10000`: quote fee 100% — 6023.

Sell (sell_v2, 10^9 base in):
- `sell-notf`: no fee, limit 1 — success.
- `sell-tf100`: quote fee 1%, limit 1 — success.
- `sell-tf5000`: quote fee 50%, limit 1 — success.
- `sell-tf5000-max100`: quote fee 50% with a 100 cap, limit 1 — success.
- `sell-tf10000-limit0`: quote fee 100%, limit 0 — success with
  zero receipts.

Buy-exact (buy_exact_quote_in_v2, 10^9 quote in, limit 1):
- `buyexact-notf`: no fee — success.
- `buyexact-tf100`: quote fee 1% — success.
- `buyexact-tf10000`: quote fee 100% — 6039.

Authorization under a Token-2022 quote program:
- `buy-tf100-token-ata`: quote fee 1% but the buyback ATA is still
  the plain-Token one — 6027.
- `buy-tf100-wrong-owner`: quote fee 1%, Token-2022 ATA of an
  unauthorized owner — 6053.
- `buy-tf100-wrong-mint`: quote fee 1%, Token-2022 ATA of the
  authorized owner but for the base mint — 6009.
- `sell-tf100-token-ata`: sell path, plain-Token buyback ATA — 6027.
- `buy-unsigned-tf100`: quote fee 1%, user does not sign — 3010
  (fee paid by OUTSIDER).

## Result

Buy leg (vault quote receipt is exactly 1,839,310 in every buy case;
the buy side grosses the user up so the vault is never short):
- no fee: user −1,847,796, buyback +8,486.
- 1%: user −1,866,375 (= 1,857,889 vault gross-up + 8,486 buyback
  gross), buyback +8,401 (85 withheld).
- 50%: user −3,687,106 (= 3,678,620 vault gross-up + 8,486),
  buyback +4,243 (half).
- 50% with a 100 cap: user −1,847,896 (= vault 1,839,310 +
  buyback net 8,386 + 100 + 100 capped withholding), buyback
  +8,386 (100 withheld, cap binds).
- 100%: Overflow 6023 at utils/transfer_fee.rs:67 (original and
  candidate) / :35 (control) — the gross-up (amount_before_fee)
  divides by zero before any transfer.

Sell leg (vault quote payout is exactly −181,061 in every sell case;
the sell side withholds per outbound leg while the vault pays gross):
- no fee: user +180,212, buyback +849.
- 1%: user +178,409 (1,803 withheld), buyback +840 (9 withheld).
- 50%: user +90,106, buyback +424 (425 withheld).
- 50% with a 100 cap: user +180,112, buyback +749 (100 withheld
  each, cap binds on both legs).
- 100% with limit 0: user 0, buyback 0 — the whole payout is
  withheld while the vault is still debited the gross 181,061.

Buy-exact leg (the available amount is computed first, so the user
spends less than the input under a fee):
- no fee: user −1,000,000,000, vault +995,407,407, buyback
  +4,592,593, base out 5,368,809,031,467.
- 1%: user −999,954,075, vault +985,453,333, buyback +4,501,200,
  base out 5,315,544,542,190.
- 100%: available is 0, so 6039 BuyNotEnoughQuoteTokensToCoverFees
  at instructions/swap/trade_v2.rs:770 (original) / :485 (control
  and candidate).

Authorization under a Token-2022 quote program (the check binds the
recipient to the quote token program actually passed in):
- plain-Token buyback ATA: 6027 AccountTypeNotSupported at
  instructions/swap/trade_v2.rs:138 (original) / :70 (control and
  candidate), buy and sell alike.
- Token-2022 ATA of an unauthorized owner: 6053
  BuybackFeeRecipientNotAuthorized at state/global_config.rs:336
  (original) / :47 (control and candidate).
- Token-2022 ATA of the authorized owner but for the base mint:
  6009 InvalidQuoteMint at instructions/swap/trade_v2.rs:146
  (original) / :75 (control and candidate).
- unsigned user: 3010 AccountNotSigner ("caused by account: user").

Volume and fees: every success funds the user volume accumulator
with exactly 1,844,400 lamports (137 bytes, payer key at [8:40]),
so the payer delta is −1,849,400 (rent + 5,000 fee). Every error
rolls back everything except the payer's 5,000 fee (the unsigned
case is paid by OUTSIDER). All three images agree on every case:
this packet pins behavior, it does not claim a divergence.

## Limits

Offline LiteSVM synthetic accounts only (Token-2022 quote mint is
synthesized after pool creation, mirroring run 1 #42's method; the
fixture pool was created with a plain-Token quote). No source
change, build, or whole-program equivalence claim. Line numbers
are log-based and differ between the original/candidate images and
the #424 control image. The withheld amounts are not tracked to a
withheld-fee account; only the vault, user, and buyback deltas are
pinned. Zero-balance targets and the Pump-program CPI path are not
covered.
