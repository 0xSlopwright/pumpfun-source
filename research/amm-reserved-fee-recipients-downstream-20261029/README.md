# set_reserved_fee_recipients downstream binding

## Problem

The 1st run packet `research/amm-reserved-fee-recipients-20261028` pinned
only the setter's storage: exactly 8 recipients, replace-not-append,
7/0 recipients → 6044, unfunded → 2005, outsider signer 6005, unsigned
3010, readonly 2000, PDA 353..385, recipients 385..641. Its Limits
section stated explicitly that the whitelist fee-routing effect was
NOT probed and only storage was covered. This packet pins what the
setter DOES downstream, in three families:

- **S — setter edges the 1st packet did not cover** (9 remaining,
  zero recipient, duplicates, executable recipient, event layout and
  exact write ranges).
- **W — the whitelist fee-zero chain.** When
  `global_config.whitelist_pda == user.key()`, legacy buy
  (`instructions/swap/buy.rs:178`), legacy sell (`legacy_sell.rs:121`)
  and v2 (`trade.rs:52` `fees()`) force every fee bps to 0 *after* fee
  selection. Because `creator_fee` becomes 0, the buy/sell
  remaining-account window never advances (`next` stays 0), so the
  #47 creator-0 window shift reappears, now triggered by the
  whitelist instead of a zero creator fee. Multi-hop is the exception:
  it calls `select_and_apply_v2` directly and never `trade::fees`, so
  the tested multi-hop path does not apply whitelist fee zeroing.
- **M — the mayhem reserved chain.** Mayhem pools validate the
  protocol fee recipient against the RESERVED list
  (`instructions/swap/mod.rs` `validate_protocol_fee_recipient`), not
  the sorted protocol list. The tested setter call replaces that list rather than appending.

## Cases (34)

Family S — setter alone, signer = pool admin (PAYER), clock 1234567890:

- `s-set-8`: whitelist = PAYER, recipients R0..R7 (8 funded accounts).
  Config writes exactly: whitelist_pda 353..385 = PAYER,
  reserved_fee_recipient 385..417 = R0, reserved_fee_recipients
  418..642 = R1..R7. The mayhem_mode_enabled byte at 417 between the
  two recipient fields is untouched (fixture value 1). Event: exactly
  1, 272 bytes, disc `2bbcfa12dd4bbb5f`
  (= sha256("event:ReservedFeeRecipientsEvent")[:8]), timestamp
  1234567890, recipient R0, recipients R1..R7. Payer 5,000.
- `s-set-9`: 9 remaining accounts succeed; the 9th is ignored
  (`require_gte!`, not `==`). Config and event identical to `s-set-8`.
- `s-set-7`: 7 remaining → 6044 NotEnoughRemainingAccounts
  (set_reserved_fee_recipients.rs:40), full rollback, payer 5,000.
- `s-set-zero`: first recipient = default pubkey → 6011
  AllProtocolFeeRecipientsShouldBeNonZero (:60), rollback.
- `s-set-dup`: all 8 recipients identical → SUCCESS, both recipient fields filled with R0 while
  whitelist_pda remains PAYER. No sorted/unique check — the exact opposite
  of `update_fee_config`'s 6012 gate (2nd #43).
- `s-set-exec`: first recipient = an executable program account →
  2007 ConstraintExecutable (`caused by account:
  reserved_fee_recipients[0]`), rollback.
- `s-set-unfunded`: first recipient unfunded (0 lamports) → 2005
  ConstraintRentExempt (`caused by account:
  reserved_fee_recipients[0]`), rollback.

Family W — whitelist chain. Every chain case starts with the setter
(wl = PAYER, recipients R0..R7) and then trades. Standard remaining =
[pool-v2 PDA, buyback owner, buyback dest]; trimmed remaining =
[buyback owner, buyback dest]:

- `w-buy-empty`: buy 10^10, empty remaining → 6058
  BuybackFeeRecipientMissing (buy.rs:116). `get_buyback_accounts`
  always reads `remaining[index]` and `remaining[index+1]`, even when
  `buyback_fee == 0`.
- `w-buy-std`: buy 10^10, standard remaining → 6053
  BuybackFeeRecipientNotAuthorized (global_config.rs:326). With
  `creator_fee == 0`, `next` stays 0, so the buyback validator reads
  remaining[0] = the pool-v2 PDA, which is not a buyback recipient.
- `w-buy-trim`: buy 10^10, trimmed remaining → SUCCESS, settles at
  curve only: spend 1,824,983, vault quote +1,824,983, protocol /
  creator / buyback legs all 0. Event: curve 1,824,983, lp/protocol/
  creator bps and fees all 0, buyback_bps 5000, buyback_fee 0.
  Payer 1,849,400 (volume rent 1,844,400 + fee 5,000).
- `w-buyexact-std`: buy_exact 10^7, standard remaining → 6053.
- `w-buyexact-trim`: buy_exact 10^7, trimmed remaining → SUCCESS:
  out 54,791,407,798, spend 10,000,000, vault +10,000,000, all fee
  legs 0. (BuyEvent for buy_exact reports the GROSS amount at @64
  and the net curve at @112; both are 10,000,000 here. Its
  `ix_name` is 18 bytes vs 3 for `buy`, so buyback fields sit at
  @439/@447 instead of @424/@432.)
- `w-sell-std`: sell 10^9, standard remaining → 6053.
- `w-sell-empty`: sell 10^9, empty remaining → 6058.
- `w-sell-trim`: sell 10^9, trimmed remaining → SUCCESS: user
  +182,495, vault quote −182,495, vault base +10^9, all fee legs 0,
  payer 5,000 (legacy sell creates no volume account).
- `w-v2buy`: v2 buy 10^6 → SUCCESS, spend 183 (quote 183, all fees
  0, vault +183, pool fees/vq unchanged). Non-whitelist anchor
  `a-v2buy` spends 187 (quote 183, lp 1, protocol 2, buyback 1,
  vault +186, pool protocol +1 / creator +1, vq −2).
- `w-v2sell`: v2 sell 10^6 → SUCCESS, user +182 (curve 182, all
  fees 0, vault −182). Anchor `a-v2sell`: user +178 (curve 182,
  lp 1, protocol 2, buyback 1, vault −179).
- `w-mhbuy` / `w-mhsell`: 1-hop multi-hop buy/sell have the same recorded settlement deltas and listed event fields as
  the non-whitelist anchors `a-mhbuy` /
  `a-mhsell` (buy: out 5,368,809,031,467, buyback +4,592,593;
  sell: user +180,212, vault −181,061, buyback +849). The whitelist
  is ignored because multi-hop never consults `trade::fees`.
- `w-nonwl-buy`: setter points the whitelist at an unrelated key,
  then PAYER buys with standard remaining → full fees (spend
  1,847,796, protocol 8,487, creator 5,475, buyback 8,486). The gate
  is the `whitelist_pda` FIELD, not the signer.
- `w-outsider-buy`: setter points the whitelist at OUTSIDER, then
  OUTSIDER buys with trimmed remaining → curve-only (spend
  1,824,983). Field-based proof, second half.
- `a-v2buy`, `a-v2sell`, `a-mhbuy`, `a-mhsell`: non-whitelist
  anchors re-measured in this builder (values above; the mh anchors
  match 2nd #48).

Family M — mayhem reserved chain. Pool byte 243 = 1 (is_mayhem_mode).
Setter cases use whitelist = an unrelated key so the whitelist does
not mask the reserved gate:

- `m-buy-noset`: mayhem buy, protocol recipient = fixture PROTOCOL
  (not reserved) → 6013 InvalidProtocolFeeRecipient
  (swap/mod.rs:164).
- `m-buy-res0`: mayhem buy, protocol recipient = fixture reserved
  member res0, NO setter call → SUCCESS: spend 1,847,796, vault
  +1,825,348, protocol 16,973 into res0's ATA, creator 5,475,
  buyback 0 (mayhem forces buyback_bps 0, so net protocol = gross).
  The gate reads the list as it stands.
- `m-buy-res0-replaced`: setter replaces the list with
  [PROTOCOL, R1..R7], then res0 buys → 6013. Replacement, not append:
  old members are immediately invalidated.
- `m-buy-protocol-set`: setter installs PROTOCOL, then mayhem buy →
  SUCCESS with the same numbers as `m-buy-res0`, protocol 16,973
  into PROTOCOL's ATA, buyback 0.
- `m-sell-protocol-set`: setter installs PROTOCOL, then mayhem sell
  → SUCCESS: user +180,212, vault −182,458, protocol gross 1,698
  into PROTOCOL's ATA (SellEvent reports the gross at @96),
  creator 548, buyback 0.
- `m-sell-noset`: mayhem sell, non-reserved recipient → 6013.
- `m-wl-buy-trim`: mayhem pool + whitelist = PAYER + reserved
  PROTOCOL, trimmed remaining → SUCCESS curve-only (spend
  1,824,983, all legs 0, buyback_bps 0). Whitelist and reserved
  combine.
- `m-wl-buy-std`: same but standard remaining → 6053. The window
  shift applies on mayhem pools too.
- `m-nonmayhem-reserved`: non-mayhem buy after the setter installs
  PROTOCOL → full fees (spend 1,847,796, buyback 8,486). The
  reserved list gates mayhem pools ONLY; it does not touch the
  sorted protocol-list path.

## Result

- Setter: 9 remaining OK (9th ignored), 7 → 6044, zero → 6011,
  duplicates OK, executable → 2007, unfunded → 2005. Writes are
  exactly 353..385 / 385..417 / 418..642 with byte 417 untouched;
  event 272 bytes, disc `2bbcfa12dd4bbb5f`.
- Whitelist zero-fee is real and field-based (PAYER full fees vs
  OUTSIDER curve-only under opposite whitelist values), but for
  legacy buy/sell it comes with the remaining-account trap: standard
  remaining fails 6053, empty fails 6058, only trimmed succeeds.
  v2 zeroes out cleanly; the tested multi-hop cases retain their non-whitelist fees.
- Mayhem reserved gate: 6013 without a listed recipient, success
  with one, immediate invalidation on replacement, and no effect on
  non-mayhem trades.

## Limits

- Offline LiteSVM reproduction on synthetic fixtures only. No source
  change, no SBPF build, no whole-program equivalence claim. Numbers
  are exact for this fixture state (pool base vault
  673,696,395,912,745, quote vault 122,946,690,720, fixture fees
  lp 2 / protocol 93 / creator 30 bps, buyback 5000 bps), not claims
  about other pool states.
- Error sites are per-image: the original and rebuilt sources differ
  in line numbers, so `verify.py` checks each image's recorded site
  line against that image's own logs and never compares sites across
  images (2nd #36 lesson). The README cites original-image sites.
- The 6053/6058 trap is a handler-ordering observation: fee zeroing
  happens after fee selection (buy.rs whitelist block), so
  `creator_fee == 0` leaves `next` at 0 while `get_buyback_accounts`
  still validates unconditionally. No claim is made about on-chain
  indexers or about any path not executed here (deposit/withdraw/
  boost have no whitelist reference in this tree and were not
  chained).
- Multi-hop fee values in `w-mhbuy`/`a-mhbuy` are the single hop
  event's fields (@64 amount, @72 lp_bps, @80 lp_fee, @88
  protocol_bps, @96 protocol_fee, @104, @112), recorded verbatim;
  user-level deltas are asserted separately.


## Retained proof integrity at review

The saved verifier now decodes and verifies every signed wire, binds its program,
payer, instruction data, named and remaining account positions and effective
signer/writable privileges to each retained case. It checks the exact 34 case
definitions and all 162 ordered image/step receipts once, uses the same wire
across image roles, and requires complete watched-state continuity between each
setter and trade. It checks every declared token and lamport delta, event
discriminator/length, and the exact sixteen watched keys. The fixed watched set
also contains fixture accounts not passed by a particular instruction; those are
retained for state comparison, without claiming they were instruction accounts.
The review pins the recorded initial watched snapshots explicitly. These new
review-derived pins preserve this finite fixture and are not producer execution
receipts or original runtime dependency hashes.

Original/control/candidate bind to the authentic original, historical #424 and
historical #427 images. The latter two use their existing hash-equivalent
compressed repository artifacts. This packet does not execute the selected AMM
image `86dbc2c64e81988dead173039b61fa01ba5f68a00fbb6f6dd49f2cda0afec37f`.
Image declarations are not captured loader records or cryptographic VM execution
attestation. The report records only these three image hashes; it does not pin
the author's harness/dependency sources or the dependency code loaded by that
prior VM. The retained producer and raw report/parts remain byte-exact. The
producer uses the reusable resettable harness unless its fresh-VM environment
switch is enabled; construction counts and that environment are not recorded.

The setter's remaining recipient accounts are not included in its sixteen-account
watch list. Their keys/privileges and error outcomes are bound, while funding and
executable prestates are supported by the retained setup source, rather than
complete saved account snapshots. No new VM run or build is claimed.

Run `python3 -B research/amm-reserved-fee-recipients-downstream-20261029/verify.py`
and `python3 -B research/amm-reserved-fee-recipients-downstream-20261029/test_verify.py`.
Both reject optimized Python. The eight resealed controls check valid wrong
remaining-layout wires, broken chain continuity, off-wire pool state, wrong token
deltas, wrong event discriminators, invalid signatures, missing case membership
and image declarations. The checks establish saved-proof correspondence only.
