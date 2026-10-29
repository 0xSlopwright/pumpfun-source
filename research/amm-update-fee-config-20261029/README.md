# research: pin update_fee_config sorted-order gate, check order, atomicity, event, and legacy-sell binding

## Problem

`update_fee_config` (`programs/pump-amm/src/lib.rs:85`, AdminGlobal
context: admin signer, global_config, event_authority, program) writes
five fields at once -- lp fee (config bytes 40..48), protocol fee
(48..56), protocol fee recipients (57..313), coin creator fee
(313..321), and `admin_set_coin_creator_authority` (321..353) -- and
then emits `UpdateFeeConfigEvent`. The 1st-run packet #27 pinned only
the field values: each bps setter's 1000 cap, recipients nonzero,
and auth (6005/3010/2000). It never pinned whether the recipients
must be sorted, what beats what when several checks fail at once,
whether a failure rolls every field back, what the event actually
carries, what happens on a short config, or whether the new
recipient list actually drives the next trade.

The sorted-order question matters because the sibling setter
`update_buyback_config` (2nd-run packet #42) has the opposite rule:
its recipients are explicitly NOT sorted -- descending input succeeds
and lands in input order. If the protocol-fee recipients were the
same, the binary-search gate in `validate_protocol_fee_recipient`
(`instructions/swap/mod.rs`) would silently reject most of the list.
This packet pins the opposite rule, the check order, the event, the
truncation ghost, and the downstream binding that explains why the
rule exists.

## Cases

Family A (26 cases, admin-only VM, fixture lp 20 / protocol 5 /
creator 5 / sorted fixture recipients / fixture authority):

- `fc-base`: lp 30, protocol 40, 8 new sorted recipients, creator
  100, new authority -- success, exactly one event echoing the
  written values, diffs confined to 40..56, 57..313, 313..321,
  321..353.
- `fc-all-1000`: all three bps at exactly 1000 -- success (cap is
  inclusive).
- `fc-lp-1001`, `fc-proto-1001`, `fc-creator-1001`,
  `fc-lp-u64max`: each bps over 1000 fails 6000
  FeeBasisPointsExceedsMaximum, fully rolled back.
- `fc-recip-zero-first`, `fc-recip-zero-last`: a default key at
  either end fails 6011 AllProtocolFeeRecipientsShouldBeNonZero.
- `fc-recip-desc`, `fc-recip-dup`, `fc-recip-oneswap`: descending
  input, one duplicate, and one adjacent swap all fail 6012
  UnsortedNotUniqueProtocolFeeRecipients -- strictly ascending
  (`windows(2)` with `pair[0] < pair[1]`) is required.
- Check order (write order in lib.rs:85): `fc-lp1001-unsorted`
  fails 6000 (lp first); `fc-proto1001-unsorted` fails 6000
  (protocol before recipients); `fc-unsorted-creator1001` fails
  6012 (recipients before creator); `fc-zero-unsorted` fails 6011
  (nonzero before sorted, inside `set_protocol_fee_recipients`).
- `fc-trailing`: one trailing byte after a full payload is ignored
  and the write still succeeds.
- `fc-args-empty`, `fc-args-lp-only` (8 bytes), `fc-args-lp-proto`
  (16 bytes): all fail 102 InstructionDidNotDeserialize.
- `fc-trunc-907`, `fc-trunc-948`: BorshIoError ("failed to write
  whole buffer", caused by account: global_config), fully rolled
  back -- but the event CPI already succeeded, so the logs carry
  a GHOST event with the NEW values while the state still holds
  the fixture values (the #27 `update_admin` pattern).
- `fc-trunc-906`: InvalidAccountData before the handler runs, 0
  events. The custom deserializer needs 907 bytes.
- Auth: `fc-outsider` 6005 InvalidAdmin (caused by account:
  global_config), `fc-unsigned` 3010 AccountNotSigner (caused by
  account: admin), `fc-readonly` 2000 ConstraintMut,
  `fc-wrongowner` 3007 AccountOwnedByWrongProgram -- all fully
  rolled back, payer 5,000.

Family B (5 cases, each = update tx then legacy sell 10^9 tx in one
legacy-sell VM; legacy sell pays protocol 849 / creator 548 /
buyback 849, user +180,212, vault base +10^9, vault quote -182,458,
as in 2nd #13):

- `chain-newrec-sell`: update recipients to NEW8, sell with a NEW8
  member -- success. The member's ATA is created by init_if_needed
  (payer 2,044,280 = 2,039,280 rent + 5,000 fee), lands exactly 849
  (lamports 2,040,129, 165 bytes).
- `chain-newrec2-presell`: same with a pre-created member ATA --
  payer 5,000 only, still lands exactly 849.
- `chain-oldrec-sell`: update to NEW8, sell with the OLD fixture
  recipient -- 6013 InvalidProtocolFeeRecipient, zero deltas, pool
  unchanged, payer 5,000. The setter change binds the next trade
  immediately and invalidates the old set at once.
- `chain-fixture-sell`: update with the unchanged fixture list,
  sell with the old recipient -- success, protocol leg 849
  (control anchor).
- `chain-failedupdate-sell`: update with an unsorted list FAILS
  (6012) and the following sell with the old recipient still
  succeeds -- the failed setter left the config untouched across
  instructions.

## Result

- Recipients must be strictly ascending AND all nonzero, with
  nonzero checked before sorted. This is the exact opposite of
  `update_buyback_config` (#42), whose recipients land in input
  order. Family B executes only legacy sell, which accepts a member of the new sorted list and rejects the old recipient with 6013; legacy buy and sweep were not executed.
- Executed check-order pairs: lp before recipients, protocol before recipients, recipients before creator, and nonzero before sorted. lp vs protocol and the authority position are not pinned. The event is emitted before the config write-back (truncation ghost).
  Every failure is atomic: all five fields roll back together.
- Every success emits exactly one UpdateFeeConfigEvent (360 bytes,
  discriminator 5a1741233ef4bcd0 = sha256("event:UpdateFeeConfigEvent")[:8];
  timestamp 0 in family A under the default LiteSVM clock, 1234567890 in
  family B where the clock is set; the timestamp is not verified): admin (the signer)
  @16..48, lp @48, protocol @56, recipients @64..320, creator @320,
  authority @328..360 -- the event echoes the written values.
- Truncation is a ghost event, not a silent failure: at 907 or 948
  bytes the event is emitted and then the write-back fails, so the
  logs show a success-shaped event for a transaction that changed
  nothing. At 906 bytes there is no event at all. At the executed short lengths (906, 907, 948) update_fee_config alone
  never updates the config; extending it first (e.g. extend_account) was not exercised.
- The recipient binding is immediate and total: after one setter
  call, the new set is the only set a legacy sell accepts, and a
  failed setter call changes nothing for the next instruction.
- Error sites (original / rebuilt control and candidate; codes
  and names agree, lines differ -- the #36 precedent):
  6000 global_config.rs:220/:230/:243 (lp/protocol/creator) vs
  rebuilt :7/:13/:19; 6011 :256 vs :25; 6012 :263 vs :27; 6013
  swap/mod.rs:164 vs :23; 6005/3010/2000/3007 are caused-by
  account markers (global_config / admin / global_config /
  global_config); BorshIoError and InvalidAccountData are caused
  by account: global_config; 102 has no site marker.

## Limits

- The five `programs/pump-amm` sources recorded in `runtime/report.json.gz` (`lib.rs`,
  `instructions/admin/mod.rs`, `state/global_config.rs`, `instructions/swap/mod.rs`,
  `instructions/swap/sell.rs`) are the versions at commit `6589dcaa9`; later commits change them
  on main, so `inputs/` keeps those exact files and `verify.py` checks them there.

- `producer.py` regenerated these receipts on the author's machine: it hard-codes
  `~/workspace/pumpfun-sparse` and reads the control/candidate images from
  `~/workspace/slop-verify`, so it does not run from this packet unmodified. The control
  and candidate are the gunzipped in-repo #424/#427 artifacts
  (`research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz`,
  `research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz`); `verify.py`
  checks the recorded receipts and does not load the images.

- Offline LiteSVM reproduction on synthetic fixtures (original
  deployed image, #424 control, #427 candidate). No source change,
  no build, and no whole-program equivalence is claimed.
- Numbers (849/548/849 legs, 180,212 receipt, 2,039,280 rent) are
  exact for this fixture state, not claims about other pools.
- The bps fields have no downstream trade consumer in this source
  tree: legacy sell prices through the Fees-program CPI and
  trade_v2 through the FeeConfig tiers, so family B pins the
  recipients binding only; the bps values are pinned in family A
  as writes plus the event echo.
- `admin_set_coin_creator_authority` is pinned as a write range
  (321..353) plus the event echo only: no consumer of that field
  was found in the sparse source, so no downstream binding is
  claimed for it.
- The ghost event is a failed-transaction log observation, not a
  claim about on-chain event indexing.
- The IDL's `UpdateFeeConfigEvent` discriminator entry
  ([90, 23, 65, 35, 62, 244, 188, 208]) equals the emitted
  discriminator 5a1741233ef4bcd0 (= sha256("event:UpdateFeeConfigEvent")[:8]),
  which the receipts pin.
