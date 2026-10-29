# research: pin Token-2022 withdraw-withheld recovery of stranded transfer-fee balances chained after pump-amm sweep/collect

## Problem

3rd #5 pinned that each sweep/collect hop under a transfer fee
strands its withheld balance in its own account (vault ATA 1,234
after a tf100 sweep, dest ATA 1,222 after the collect) and noted
only a withdraw-withheld path (not a pump-amm instruction) could
ever move it -- but that path was never executed. 3rd #19 then
showed the same stranding across deposit, withdraw, and trade
legs. Four questions were open:

1. Does one WithdrawWithheldTokensFromAccounts call recover the
   exact stranded balances, and what does it leave behind?
2. Does the harvest -> WithdrawWithheldTokensFromMint route
   recover the same balances, and what gates each hop?
3. Which authority and mint-binding checks actually fire, and
   which malformed inputs are silently tolerated?
4. Do the trade, deposit, withdraw, and protocol-sweep legs all
   recover through the same call?

This packet answers all four with executed chains on the
original, control (#424), and candidate (#427) images, which
agree on every step. It pins behaviour; it does not claim a
defect. The withdraw/harvest instructions run in the Token-2022
program, so the pump-amm image is irrelevant to those steps
themselves -- but the stranded balances they recover are
produced by pump-amm sweep/collect/trade/liquidity steps, and
the full chains execute identically on all three images. The
mint's withdraw_withheld_authority is synthesized to the fee
payer at setup (see Limits); prior packets zeroed it, which is
exactly why their withheld was stranded.

## Cases

Fixture pool (all cases): virtual_quote_reserves −125,882,
protocol_fees 2,488, creator_fees 123,394, lp_supply
4,194,352,106,721. Transfer fee is a quote-mint
`transferfee(quote, bps, u64::MAX)` override with the
withdraw_withheld_authority patched to the fee payer, except
the two zero-authority cases where it stays zeroed. Sweep and
collect use Token-2022 ATAs. The recovery destination is a
fresh Token-2022 ATA unless a case says otherwise. 20 cases,
62 steps, 186 receipts (62 x 3 images), 19 parts (18 x 10 + 6).

- Family A (seed recovery): sweep -> collect -> withdraw
  [vault ATA, dest ATA]; same with the vault ATA itself as
  destination; same at tf5000.
- Family B (authority gates): withdraw signed by a wrong
  signer (fails) -> correct signer recovers; zero-authority
  mint (fails); zero-authority mint with harvest (harvest
  succeeds, withdraw-from-mint fails); fee payer != authority
  with the authority not signing (fails) -> correct signer
  recovers.
- Family C (harvest route): sweep -> collect -> harvest ->
  withdraw-from-mint; withdraw-from-mint on a zero mint
  balance (no prior chain).
- Family D (idempotency): withdraw twice; withdraw with zero
  sources; withdraw with a duplicated source.
- Family E (tolerance): withdraw with an extension-less
  source, then recover the remaining source; withdraw with a
  wrong-mint source (withheld 999).
- Family F (destination mint binding): withdraw to a
  wrong-mint Token-2022 destination (fails); withdraw to a
  Token-program-owned destination (fails).
- Family G (trade/liquidity/protocol legs): buy -> sweep ->
  collect -> withdraw [vault, buyback ATA, vault ATA, dest];
  deposit -> withdraw [vault]; withdraw -> withdraw [user];
  protocol sweep -> withdraw [protocol ATA].

## Result

All 20 cases pass on all three images with byte-identical
observed surfaces (steps, errors, event counts, snapshots).
Measured values:

- Seed recovery (family A): sweep -> collect strands 1,234
  (vault ATA) + 1,222 (dest ATA); one withdraw recovers
  exactly 2,456 into a fresh ATA, both sources' withheld -> 0,
  both sources' amounts otherwise untouched (vault ATA 0, dest
  120,938), no lamports moved (payer fee 5,000 only). With the
  vault ATA itself as destination it credits to 2,456
  (0 + 1,234 + 1,222). At tf5000 the same chain recovers
  61,697 + 30,849 = 92,546.
- Authority gates (family B): a wrong signer fails Token-2022
  custom error 4 with full rollback, and the correct signer
  right after it recovers the full 2,456. A zero-authority
  mint fails custom error 29 with full rollback -- this is the
  boundary of 3rd #5's "stranded" claim: with the authority
  unset, no signer can recover. Harvest on a zero-authority
  mint still succeeds (2,456 into the mint's withheld_amount,
  accounts -> 0) but the following withdraw-from-mint fails
  custom error 29, so the mint balance stays stranded too.
  When the fee payer is not the authority and the authority
  does not sign, the transaction fails MissingRequiredSignature
  with full rollback; the correct signer then recovers.
- Harvest route (family C): harvest moves 2,456 into the
  mint's withheld_amount (accounts -> 0), withdraw-from-mint
  moves it to the destination (mint -> 0, destination
  2,456). Withdraw-from-mint on a zero mint balance succeeds
  with 0 moved (payer fee 5,000 only).
- Idempotency (family D): a second withdraw after a full
  recovery succeeds with 0 moved; a withdraw with zero
  sources succeeds with 0 moved and the stranded balances
  intact; a duplicated source is counted once (2,456, not
  3,690).
- Tolerance (family E): an extension-less source is silently
  skipped -- withdraw [vault ATA, plain 165-byte account]
  recovers only the vault ATA's 1,234 with no error, and a
  following withdraw recovers the dest's 1,222. A wrong-mint
  source (base-mint Token-2022 account, withheld 999) is
  likewise skipped with no error: only the vault ATA's 1,234
  moves and the wrong-mint account keeps its 999. Sources are
  filtered, not validated.
- Destination mint binding (family F): the destination's mint
  IS enforced -- a wrong-mint Token-2022 destination fails
  custom error 3 with full rollback, and a Token-program-owned
  destination fails IncorrectProgramId with full rollback.
  The asymmetry is sharp: sources are skipped on mismatch,
  the destination errors on it.
- Trade/liquidity/protocol legs (family G): buy -> sweep ->
  collect -> withdraw recovers 18,579 (vault) + 85 (buyback
  ATA) + 1,289 (vault ATA) + 1,276 (dest) = 21,229 in one call.
  Deposit -> withdraw recovers the vault's 296,085.
  Withdraw -> withdraw recovers the user's 293,125. Protocol
  sweep -> withdraw recovers 25 from the protocol ATA even
  though the protocol net itself is not collectible (3rd #4):
  the 25 was never collectible through pump-amm, but it is
  recoverable through withdraw-withheld.
- Sweep lamports follow the gross: the seed sweep credits
  +123,394 lamports to the recipient ATA (vault -123,394);
  the bucket sweep +128,869; the protocol sweep +2,488.
  Collect and withdraw move no lamports at all.

All 20 cases, 186 receipts, 19 parts: the original, control,
and candidate images agree on every step -- deltas, withheld
balances, mint withheld_amount, pool state, accumulator state,
decoded events, error codes, and rollback.

## Limits

- The quote mint's withdraw_withheld_authority is synthesized
  to the fee payer at setup (mint bytes 202..234 patched after
  the transfer-fee override, which zeroes both authorities).
  This pins handler behaviour given a controlled authority; it
  does not claim any on-chain mint has that authority set.
  The zero-authority cases pin the unrecoverable boundary.
- Only the quote mint carries a transfer fee here; base-mint
  fee accounts appear only as the wrong-mint tolerance/binding
  probes, not as a second fee pipeline.
- Only the fee rates tf100 and tf5000 are chained; maxfee caps
  below u64::MAX were not combined with recovery here.
- The Token-2022 error names are not asserted: only the
  observed codes are pinned (custom 4, custom 29, custom 3,
  MissingRequiredSignature, IncorrectProgramId).
- No source change, no build, and no whole-program equivalence
  is claimed: this packet pins executed behaviour on three
  images only.

## Reproduction

```
python3 verify.py
```

Expected output:

```
PASS: 20 cases, 186 receipts, 19 parts, 3 images agree (signatures, deltas, withheld, events, error codes, rollback)
```
