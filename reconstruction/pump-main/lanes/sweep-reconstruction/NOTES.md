# sweep-reconstruction: 0x72810 `sweep::execute`

Target: original window 0x72810, 7,832 B, 39 direct calls (4 memcmp).
Base (main d2cb88d): 7,832 B, ratio 0.298, 38 calls (one quote-zero memcmp).

## Current source (this branch)

| metric | base | now |
|---|---|---|
| ratio (target_metric) | 0.298 | 0.43501 |
| cand bytes | 7832 | 7752 |
| direct calls (orig 39) | 38 | 39 |
| official normalized / raw | 1019 / 188 | 1019 / 188 |
| gains / losses | - | none / none |
| unstripped sha256 | - | be37fa6f56e5594c36e5d71ee890ba3c1087a9e1ac5170e5a001b0cfc16d3aac |

Mechanisms, stacked:
1. Shared quote_mint / quote_token_program `AccountInfo` clones across both
   `admit_associated_token_account` calls (attempt 661d4082546f4ea1b12d69ddc8bf7c34): token-path Rc
   inc/dec pattern matches the original.
2. Vault check / `validate_fee_recipient` and the fee take in one `if creator` if/else, a single
   shared `if amount==0 { msg!(.., creator as u8) }` (the original's msg reads the spilled `creator`
   argument, not per-branch constants), rent top-up guarded by `creator && quote_mint==default`, and
   `native` evaluated again for the token branch (attempt 6b88281d94964538b3aa08129cab23d0). The
   protocol-path memcmp now lands at the original's exact offset +0x6e0, and both memcmps exist.

## Map of the original (offsets in window)

- protocol: validate (+0x648) -> take protocol_fees [bc+0x80] (+0x668) -> zero? msg (+0x9d0) ->
  memcmp quote==0 (+0x6e0) -> token head (+0x700) or native-protocol transfer setup (+0x1358, own
  copy of recipient clone, threaded past the native/Option join).
- creator: vault check -> take creator_fee [bc+0x78] (+0x9b0, falls into msg) -> memcmp (+0x1200)
  -> token head (+0x700) or Rent top-up (+0x1270) -> join (+0x1550, native flag phi r5=0/1).
- msg and event both use the spilled `creator` arg ([r10-0x318]) as the bucket byte.

## Residuals

- The original evaluates `native` once per path (creator-native rent path joins with native=1);
  t21 re-runs the memcmp after rent. The per-bucket forms that evaluate once (t07, t24) reach
  39 calls and, with `let bucket=creator as u8` (t24), the exact 7,832 B size, but ratio ~0.42.
- msg block is placed after the token path in the per-bucket forms; the original places it right
  after the creator take block.
- Rent error `From` / native transfer order inside the Rent block differs.

## Rejected (ledger rows)
token-first if/else, native&&creator split, match (native,creator), const per-bucket msg,
protocol-first source order, polarity inversions of the amount check (all byte-identical),
bucket var in event, bucket var at top. See `log_attempt.py search --target 0x72810`.
