# research: pin update_buyback_config setter semantics and downstream trade binding

## Problem

`update_buyback_config` (discriminator `fbe0ab92a01a71e9`, argument
`Option<u64>`, accounts admin signer + global_config + event_authority +
program + remaining recipients) is the admin setter behind the
buyback-fee split that every v2 trade packet pins (2nd #34: buyback =
floor(protocol x bbbps / 10000), and a panic when the floor exceeds
protocol at bb 10090). But the setter itself was never pinned: its
10000 cap, its recipient validation, its write range, its silence,
its truncation behaviour, and whether a setter change actually binds
the next trade were all unmeasured. The related `set_protocol_fee_
recipients` setter requires sorted recipients (1st #18); whether the
buyback setter shares that requirement was unknown. And 2nd #27
showed `update_admin` ghosting an event on a truncated config — this
setter's truncation behaviour needed its own check.

## Cases

34 cases x 3 images (original / #424 control / #427 candidate) = 123
receipts, stored as 13 parts (12 x 10 + 3), each part under 25MB.
Fresh VM per case per image. Payer lamport deltas in receipts are
before-minus-after (positive = paid).

### Family A — admin-only VM, synthetic GlobalConfig (27 cases)

Fixture: buyback_basis_points 5000 at bytes 899..907, buyback_fee_
recipients at 643..899 (8 x 32 bytes, from the config snapshot),
full config 949 bytes. The setter writes only 899..907 (bps) and/or
643..899 (recipients); every success is diff-checked to those ranges.

- `bb-none-noop`: None + no remaining = silent no-op (bytes unchanged,
  0 events, payer 5,000).
- `bb-set-0/1/7500/9999/10000`: Some(bps) writes 899..907 only.
- `bb-set-10001`, `bb-set-u64max`: 6056 BuybackBasisPointsOutOfRange
  (global_config.rs:306, "buyback_basis_points must be <= 10_000"),
  full rollback. **The setter caps at 10000, so 2nd #34's buyback
  panic (bb 10090, floor > protocol) is unreachable through this
  instruction and requires direct config manipulation.**
- `bb-recip-unsorted8`: 8 recipients in descending order **succeed**,
  written to 643..899 in exactly the input order — **no sorting
  requirement, the opposite of the protocol-fee recipient setter**.
- `bb-both-6000-new8`: Some(6000) + 8 new recipients in one call
  writes 643..907.
- `bb-recip-7`, `bb-recip-9`: 6057 WrongBuybackFeeRecipientsCount
  (update_buyback_config.rs:40, "exactly 8 remaining accounts (or
  none)").
- `bb-recip-default`: one zero recipient among 8 = 6054
  AllBuybackFeeRecipientsShouldBeNonZero (global_config.rs:347).
- `bb-recip-dup`: one duplicated recipient among 8 = 6055
  NotUniqueBuybackFeeRecipients (global_config.rs:357).
- `bb-bps6000-duprecip`: valid bps + duplicated recipients = 6055,
  bps rolled back to 5000 (atomicity).
- `bb-bps10001-duprecip`: invalid bps + duplicated recipients =
  6056 — **bps is checked before recipients**.
- `bb-outsider`: non-admin signer = 6005 InvalidAdmin (caused by
  account: global_config). `bb-unsigned`: 3010 AccountNotSigner.
  `bb-readonly`: 2000 ConstraintMut. `bb-wrongowner`: 3007
  AccountOwnedByWrongProgram. All full rollback, payer 5,000.
- `bb-args-empty`, `bb-args-tag2`: empty args / tag byte 2 = 102
  InstructionDidNotDeserialize. `bb-args-trailing`: one trailing byte
  is ignored, bps 6000 written.
- `bb-trunc-907`, `bb-trunc-948`: BorshIoError ("failed to write
  whole buffer", caused by account: global_config), full rollback,
  **0 events** — unlike 2nd #27's `update_admin` ghost event, this
  handler emits nothing at all, so there is nothing to ghost.
- `bb-trunc-906`: InvalidAccountData (custom deserialization needs
  899 bytes after the discriminator, 907 total); 906 is below the
  floor, so the handler never runs.
- `bb-trunc-907-recip`: truncated config + 8 recipients = same
  BorshIoError (the write-back fails before any recipient write
  lands).
- Every success in this family emits **0 events**, even though
  AdminGlobal carries #[event_cpi] — the handler never calls
  emit_cpi (same silent pattern as 2nd #28's toggles). The setter
  has no extend_global_config path, so a short config cannot be
  grown in place by this instruction.

### Family B — chained VM, setter then buy_v2 / sell_v2 (7 cases, 2 steps each)

Trade fixture: single tier (0, lp 10 / protocol 111 / creator 300
bps), pool creator_fee_bps 0, configurable 1, VB 10^12, VQ 10^10,
supply 10^12, buy 10^6 limit 10425, sell 10^6 limit 1. Step 0 is the
setter (silent, payer 5,000); step 1 is the trade. All chain numbers
below were asserted by the builder on all three images, not computed
and left unchecked.

- `chain-bps7500-buy`: buyback floor(112 x 7500/10000) = 84, vault
  +10341, pool state (vq -329, protocol 28, creator 301), BuyEvent
  (10001, 10, 11, 111, 112, 10012, 10425, 300, 301, 7500, 84, 0, 0, 301).
- `chain-bps10000-buy`: buyback 112 (full protocol), vault +10313,
  pool (-301, 0, 301).
- `chain-bps0-buy`: buyback 0, vault +10425, pool (-413, 112, 301).
- `chain-bps7500-sell`: buyback floor(111 x 7500/10000) = 83, user
  +9578, vault -9661, pool (-328, 28, 300), SellEvent (9999, 10, 10,
  111, 111, 9989, 9578, 300, 300, 7500, 83, 0, 0, 300).
- `chain-recip-new-buy`: recipients replaced by NEW8 (bytes
  [240..247] x 32) and the buyback paid to the NEWREC ATA ([240] x 32
  PDA) = buyback 56 at bps 5000, vault +10369, pool (-357, 56, 301).
- `chain-recip-old-buy`: recipients replaced by a set excluding the
  old recipients, then buying with the old buyback ATA = 6053
  BuybackFeeRecipientNotAuthorized, zero deltas, pool (0, 0, 0),
  payer 5,000 on the trade step, 0 events — **the setter change
  binds immediately and the old recipient set is dead**.
- `chain-both-buy`: Some(7500) + NEW8 in one call, then buying with
  the NEWREC ATA = buyback 84, vault +10341, pool (-329, 28, 301).
- Successful trade steps: payer 1,849,400 (volume accumulator
  1,844,400 lamports, 137 bytes, payer key at [8:40]), exactly 1
  event. BuyEvent offsets (64, 72, 80, 88, 96, 104, 112, 344, 352,
  427, 435, 468, 476, 484); SellEvent offsets (64, 72, 80, 88, 96,
  104, 112, 344, 352, 376, 384, 417, 425, 433).

## Result

- Setter semantics are fully pinned: cap 10000 (6056), recipient
  count exactly 8-or-none (6057), nonzero (6054), unique (6055),
  bps-before-recipients check order, unsorted recipients accepted
  in input order, silent on every path (0 events), no extend path,
  truncation floor 907 (906 = InvalidAccountData, 907..948 =
  BorshIoError with no ghost event).
- The setter binds the next trade exactly: bps changes move the
  buyback floor and the pool accruals by the 2nd #34 identity, and
  recipient replacement immediately authorizes the new set and
  deauthorizes the old one (6053).
- All 123 receipts agree across original / control / candidate:
  identical errors, observed values, and after-states. No image
  divergence was found in this packet.

## Limits

- Offline LiteSVM reproduction on synthetic fixtures only; no
  source change, no build, and no whole-program identity claim.
- Numbers, byte ranges, and error sites are exact for this fixture
  state only, not a claim about other pool or config states.
- Error sites are recorded by error name in verify.py; per-image
  line numbers are in the producer's run (rebuilt images may report
  different lines for the same error, the 2nd #36 precedent).
- The chain sell case (chain-bps7500-sell) was predicted from the
  2nd #34 identity and then verified by builder assertions on all
  three images; it is a measured result, not a bare calculation.
- The 907-byte truncation boundary is the custom-deserialization
  floor (899 bytes after the discriminator); it is not a claim
  about Anchor's generic account-size handling.
