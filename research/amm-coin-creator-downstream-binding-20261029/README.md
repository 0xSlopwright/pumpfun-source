# research: coin-creator reassignment downstream binding

## Problem

2nd #9 pinned only the `set_coin_creator` /
`migrate_pool_coin_creator` setter gates: the first-creator rule,
the canonical-pool gate (6028), the PDA/owner checks, the
already-set no-op, and migrate's 6081 sweep gate. It never
chained a trade, a sweep, or a collect after a reassignment,
so the binding questions were open: after the pool's
`coin_creator` changes, which downstream instructions follow
the new creator, which still follow the old one, and which
refuse outright? This packet answers that by executing
set/sweep/migrate/collect/legacy-buy/legacy-sell/v2-buy chains
in single VMs, one signed transaction per step, on three
program images (original, #424 control, #427 candidate).

## Fixture

Shared fixture pool `GseMAnNDvntR5uFePZ51yZBXzNSn7GdFPkfHwfr6d77J`
(creator = pool-authority PDA
`9XDYTfQKwW8sHPqnFdUreMmtmffmkHVPGTNV2e3LKxNW`, protocol fees
2,488, creator fees 123,394, creator_fee_bps 0, can_edit 0,
holder 0). The "before" pool has `coin_creator` = all zeros;
the fixture's named creator is `5L5k7gtNLbeXdzpvNrFshg1E1id1ceUDfc6vPUTxp98q`
(vault PDA `4LFFCuf82nwijjNjbu8enNmfVa5hqBxBctgnuJ7ZNNMS`, ATA
`3E6RtRCxo7Yz64zi8aSmC9DtNKcaMp5rFUcBnJKsc2fg`). The set target
is `0x11…` (vault PDA `Gag9L2gntnWxsH4uB24Cs7rmKHgHexqVBHDmtv2443UA`,
ATA `4JBYKiuJ5mMFheTYUMj1jKVoSRYmRBaeh3HjbXexC1vo`); the default
creator's vault PDA is `8N3GDaZ2iwN65oxVatKTLPNooAVUJTbfiVJ1ahyqwjSk`
(ATA `Ei6iux5MMYG8JxCTr58goADqFTtMroL9TXJityF3fAQc`). The sharing
vault PDA is derived from the fee program's `sharing-config`
seeds. Legacy buys need a `global_volume_accumulator` account
(544 bytes); without it the buy fails 3012 AccountNotInitialized.
Collect uses native (wSOL) token accounts, so a collect vault
must be funded with amount + rent (2,039,280 lamports); funding
exactly rent leaves the vault 1,000 lamports short of rent after
a full drain and the transaction fails at the rent check
instead of succeeding.

## Cases (18 cases, 39 steps per image, 117 receipts)

Family A — set -> legacy buy (7 cases):
- `buy-before-set`: buy 10^10 with `coin_creator` still default
  and the trimmed remaining `[owner, dest]` (the creator-0
  window from 2nd #47): spend 1,842,321, vault quote +1,825,348,
  protocol 8,487, creator 0, buyback 8,486. The event still
  reports creator_bps 30 but creator_fee 0 — the leg is skipped
  entirely, not priced at zero through the vault.
- `set-then-buy`: set, then buy with the new vault PDA + ATA
  and the standard remaining: spend 1,847,796, vault +1,825,348,
  protocol 8,487, creator 5,475 to the NEW ATA, old creator ATA
  delta 0, buyback 8,486.
- `set-then-buy-uncreated-ata`: same buy with the new ATA
  absent: `init_if_needed` creates it (2,044,755 lamports =
  rent + 5,475), payer 3,888,680 instead of 1,849,400, deltas
  otherwise identical.
- `set-then-buy-old-vault`: set, then buy with the OLD (default)
  vault PDA: 2006 ConstraintSeeds, caused by account:
  coin_creator_vault_authority, full rollback, payer 5,000 only.
- `set-then-buy-new-vault-old-ata`: set, then buy with the new
  vault PDA but the OLD creator ATA: 2015 ConstraintTokenOwner,
  caused by account: coin_creator_vault_ata, full rollback.
- `set-unswept`: set with creator_fees 123,394 still accrued
  succeeds, coin_creator becomes `0x11…`, creator_fees unchanged.
  set has NO sweep gate — the opposite of migrate.
- `set-twice-then-buy`: a second set (different metadata) is a
  no-op — 0 events, "already set" log, coin_creator stays
  `0x11…` — and the following buy still routes the creator leg
  to the FIRST creator's vault ATA.

Family B — migrate (3 cases):
- `set-sweep-migrate-buy`: set, sweep 123,394 to the NEW ATA
  (pool creator 0, sweep event amount 123,394, bucket 1),
  migrate (coin_creator becomes the sharing PDA), then buy:
  spend 1,847,796, creator 5,475 to the SHARING vault ATA.
  The post-sweep buy anchors are byte-identical to the fresh
  anchors: sweeping converts the accrual into virtual quote
  reserves (`take_accrued_fees` adds the amount to vq), so the
  effective curve does not move.
- `set-then-sweep-old-vault`: set, then sweep with the OLD
  vault: 2006 ConstraintSeeds, thrown in sweep_fees.rs:113
  (original) / :43 (rebuilt), full rollback.
- `set-then-migrate-unswept`: set, then migrate without
  sweeping: 6081 CreatorFeesNotSwept, thrown in
  migrate_pool_coin_creator.rs:59 (original) / :6 (rebuilt).

Family C — collect keying (3 cases):
- `set-then-collect-old`: set, then collect with the OLD
  creator key: SUCCESS, 1,000 paid to the old creator's dest.
  collect does NOT read the pool's coin_creator at all — the
  caller supplies the keying.
- `sweep-migrate-collect-sharing`: sweep, migrate, then
  collect with the SHARING PDA as creator: 6048
  CreatorVaultMigratedToSharingConfig, thrown in
  collect_coin_creator_fee.rs:68 (original) / collect.rs:20
  (rebuilt), full rollback. The migrated vault can only be
  paid through the sharing path.
- `set-then-collect-new`: set, then collect with the NEW
  creator key: SUCCESS, 1,000 paid to the new creator's dest.

Family D — v2 accrual + sweep (3 cases):
- `v2buy-before-set`: v2 buy 10^6 before any set: spend 186,
  vault +185, buyback 1, event (quote 183, lp 1, protocol 2,
  creator_bps 30, creator_fee 0, buyback 1), pool protocol
  2,488 -> 2,489, pool creator unchanged at 123,394.
- `v2buy-after-set`: set, then v2 buy 10^10: spend 1,847,796,
  vault quote +1,839,310 (= spend minus buyback 8,486), event
  (quote 1,824,983, lp 365, protocol 16,973, creator 30/5,475,
  buyback 8,486), pool protocol 2,488 -> 10,975 (+8,487 net),
  pool creator 123,394 -> 128,869 (+5,475). v2 trades accrue
  the creator fee in the pool field; legacy trades instead
  transfer it straight to the recipient ATA and leave the pool
  fields untouched (legacy buy after set: pool fields stay
  2,488 / 123,394).
- `set-v2buy-sweep-migrate`: set, v2 buy 10^10 (as above),
  sweep 128,869 to the NEW ATA (pool creator 0), migrate
  (success, coin_creator becomes the sharing PDA).

Family S — legacy sell (2 cases):
- `set-then-sell`: set, then sell 10^9 with the new vault:
  user +180,212, vault base +10^9, vault quote -182,458,
  protocol 849, creator 548 to the NEW ATA, buyback 849,
  payer 5,000 — the 2nd #44 sell anchor otherwise unchanged,
  with only the creator leg re-routed. The SellEvent
  protocol_fee field (@96) reports gross 1,698, not net 849.
- `set-then-sell-old-vault`: set, then sell with the OLD
  vault PDA: 2006 ConstraintSeeds, caused by account:
  coin_creator_vault_authority, full rollback.

## Result

The binding rules, each verified on all three images:
1. Legacy buy/sell bind the creator vault to the CURRENT
   pool.coin_creator through a PDA seeds constraint: after a
   set, the old vault PDA fails 2006 and the old vault ATA
   fails 2015; only the new vault PDA + ATA routes the leg.
2. A pool with coin_creator == default charges no creator fee
   (spend 1,842,321 vs 1,847,796 after a set), while the event
   still reports the configured creator_bps 30 with fee 0.
3. set has no sweep gate; migrate requires creator_fees == 0
   (6081); the unblocker is sweep_creator_fee, which itself
   requires the CURRENT creator's vault PDA (old vault: 2006)
   and preserves the curve by converting the accrual into
   virtual quote reserves.
4. collect_coin_creator_fee is keyed by the caller, not the
   pool: it pays the old creator after a set and the new
   creator after a set, and refuses only the migrated sharing
   PDA itself (6048).
5. v2 trades accrue creator fees in pool.creator_fees
   (creator-agnostic pool field): before a set the event
   reports creator_bps 30 with fee 0 and the pool field does
   not move; after a set the same buy accrues 5,475, which a
   sweep then moves to the new vault ATA and zeroes,
   unblocking migrate.
6. A second set is a no-op ("already set", 0 events) and does
   not re-route any downstream leg.

## Limits

- Offline LiteSVM reproduction on a synthetic fixture only;
  no claim about on-chain behavior beyond these measured
  transactions, no source change, no build, and no whole
  program equivalence claim.
- All amounts, error codes, and site lines are exact values
  for this fixture state, not claims about other pool states.
  Error site line numbers differ between the original and the
  rebuilt images (e.g. sweep 2006 at :113 vs :43, migrate 6081
  at :59 vs :6, collect 6048 at collect_coin_creator_fee.rs:68
  vs collect.rs:20); verify.py checks each image's recorded
  site line against that image's own logs and never compares
  site lines across images.
- The sweep-to-virtual-reserves curve preservation is stated
  as observed deltas (post-sweep buy anchors identical to
  fresh anchors); the mechanism sentence cites the
  `take_accrued_fees` code in the sparse tree, not a measured
  intermediate.
- Collect vault funding (amount + rent) is a harness
  requirement for native token accounts, not a program rule
  being pinned.
- The collect 6048 case's "use pump:distribute_creator_fees
  instead" path is not executed here; only the refusal is
  pinned.


## Saved proof binding

The verifier reads the hash-equivalent committed historical #424/#427 image
archives. These images are not the AMM image selected at review (`86dbc2c6…`).
No raw captured loader record is present: the three image roles remain producer
declarations, authenticated against available image bytes, not execution attestation.
The retained producer, report and all 12 raw parts are byte-exact.

`fixture-bindings.json` records the reviewed 18 named family-specific chains and
39 steps, original serialized signed-wire hashes and 16 source WATCH roles. The
verifier binds all receipts to that finite set, checks account continuity between
steps, derives token deltas from their named accounts, identifies the payer from
the signed message, and checks actual event log discriminators/layouts. The one
new ATA's rent plus creator fee is also checked from its lamports. Unrecognized
expected fields are rejected. These joins strengthen saved evidence; they do not
establish a fresh VM replay, broad state-space coverage or current-image acceptance.

The producer uses the reusable harness; 117 counts signed executions/receipts,
not independently attested fresh VM constructions. Source and helper references
outside the retained producer were not captured as a separate execution inventory.
`python -B research/amm-coin-creator-downstream-binding-20261029/test_verify.py`
checks repinned proof mutations without a compiler or VM.

The binding file also retains the complete reviewed expected-step obligations:
every value and member of the original report's 39 step expectations. Dropping
a known token-delta or event-field assertion cannot weaken verification. These
are review-derived saved-proof constraints, copied from the unchanged report
and tied to its origin SHA256 and the unchanged producer. The origin hash is
provenance metadata, rather than a claim that reencoded test reports are captured
execution. The expected-step map, wire pins and WATCH roles are not runtime
receipts, loader records or cryptographic execution attestation. Two additional
coherent resealed controls omit a known token/event obligation and alter the
corresponding observed value; both must reject. All ten controls run offline.
