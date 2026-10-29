# collect_coin_creator_fee under a matching Token-2022 transfer fee

## Problem

The #47 packet (`amm-collect-token22-rejection-20261028`) showed that
`collect_coin_creator_fee` fails with 2023
`ConstraintAssociatedTokenTokenProgram` when the quote mint and the
vault/destination are Token-2022 accounts but the Token program is
passed as `quote_token_program`. That left open whether the failure
is a limit of the collect handler itself or only a program-meta
mismatch: the handler takes `quote_token_program` as an
`Interface<TokenInterface>`, so passing the matching Token-2022
program should let the collect move Token-2022 quote fees, with the
fee withheld into the destination's `TransferFeeAmount` extension.
This packet pins that mirror case, plus the fee schedule switch,
the no-extension failure, withheld accumulation, the empty-vault
behavior, and the full mismatch map.

## Cases

19 cases x 3 images (original / #424 control / #427 candidate) =
57 signed receipts, stored as 6 parts (10 x 5 + 7). All cases use
the fixture pool's real coin creator: the creator vault holds
123,394 (the recorded creator-fee balance) unless the case is a
zero-vault case. The payer pays only the 5,000 fee in every case
(the destination is always pre-created; collect never creates it).

- `collect-token-baseline`: Token program, Token vault/destination.
- `collect-t22-nofee`: Token-2022 program, Token-2022 mint without a
  fee extension, plain 165-byte destination.
- `collect-t22-nofee-extdest`: same, with a 182-byte destination
  carrying a zero-withheld extension.
- `collect-tf100` / `collect-tf5000` / `collect-tf10000`: Token-2022
  mint with a transfer-fee extension (maxfee u64::MAX), 182-byte
  destination.
- `collect-tf5000-max100`: same at 50% with maxfee 100.
- `collect-tf100-noext-dest`: 1% fee but a plain 165-byte
  destination with no extension space.
- `collect-tf100-pre-withheld`: 1% fee, destination pre-existing
  with amount 5,000 and withheld 1,000.
- `collect-epoch0` / `collect-epoch9` / `collect-epoch10` /
  `collect-epoch11`: older 100bps / newer 5000bps schedule pair with
  the newer schedule starting at epoch 10, run at each epoch.
- `collect-zero-extdest` / `collect-zero-plaindest`: empty vault
  with an existing destination (182-byte / 165-byte).
- `collect-zero-nodest`: empty vault with no destination account.
- `collect-mismatch-all-token`: Token-2022 program but Token vault
  and destination at Token-derived addresses.
- `collect-mismatch-dest-token`: Token-2022 vault, but a Token
  destination placed at the Token-2022-derived address.
- `collect-mismatch-vault-token`: Token vault at the Token-derived
  address, Token-2022 destination at the Token-2022-derived address.

## Result

All 19 cases agree across all 3 images.

- The mirror works: with the matching Token-2022 program, the
  collect succeeds. The vault drains in full (-123,394 to 0) in
  every success case, and the destination gains the net amount:
  no-fee 123,394 (plain or extension destination alike); tf100
  122,160 with withheld 1,234; tf5000 61,697 with withheld 61,697;
  tf10000 0 with withheld 123,394. So #47's 2023 is a program-meta
  mismatch, not a collect limit — the same pattern as #20's sweep
  finding for #48.
- The event reports the gross amount: `CollectCoinCreatorFeeEvent`
  carries fee 123,394 even when the net delivery is 122,160,
  61,697, or 0. Reading only the event overstates the delivery.
- A 100% fee succeeds with zero delivery, unlike the trade paths
  (buy_exact 6039, non-exact buy 6023): the whole amount is
  withheld into the destination's extension.
- Caps bind the withheld amount only: tf5000-max100 withholds
  exactly 100, delivering 123,294.
- The schedule switches exactly at the newer epoch: epochs 0 and 9
  apply the older 100bps (delivery 122,160, withheld 1,234);
  epochs 10 and 11 apply the newer 5000bps (delivery 61,697,
  withheld 61,697). The synthesized extension stores the older
  schedule first and the newer schedule second.
- A destination without extension space fails: tf100 with a plain
  165-byte destination fails with Token-2022 custom error 0xd
  (`InstructionErrorCustom(13)`), with full rollback except the
  payer fee. The vault needs no extension: a plain vault with an
  extension destination succeeds.
- Withheld fees accumulate on a pre-existing destination: amount
  5,000 + 122,160 = 127,160, withheld 1,000 + 1,234 = 2,234.
- An empty vault is a silent no-op: no event is emitted, the
  destination is unchanged, and only the 5,000 payer fee is
  charged — for both 182-byte and 165-byte destinations. But the
  destination must still exist: with no destination account the
  call fails with 3012 `AccountNotInitialized` (caused by account:
  `coin_creator_token_account`), because the handler deserializes
  the destination before checking the vault amount.
- The mismatch map is symmetric with #47: Token-2022 program +
  Token vault/destination gives 2023
  `ConstraintAssociatedTokenTokenProgram` (the vault ATA
  constraint); a Token destination at a Token-2022-derived address
  gives 2021 `ConstraintTokenTokenProgram` (the destination's
  `token::token_program` constraint); a Token vault at a
  Token-derived address gives 2023 (the vault ATA constraint).

## Limits

Offline LiteSVM synthetic fixtures only. No source change, build,
or whole-program equivalence claim. The quote-mint transfer-fee
extension and the Token-2022 vault/destination accounts are
synthesized after the fact (as in #20): this pins handler transfer
behavior, not a reachable mainnet state, since the legacy creation
path cannot put a transfer fee on a quote mint. Amounts, caps, and
the epoch switch point are exact values for this fixture's vault
balance and fee settings and are not claimed for other states.
The 0xd failure is reported as the observed Token-2022 custom
error value; no internal Token-2022 error variant name is claimed.
