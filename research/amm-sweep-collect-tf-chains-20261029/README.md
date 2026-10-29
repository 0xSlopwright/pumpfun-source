# sweep to collect chains under a transfer fee

## Problem

Earlier packets pinned the two hops only in isolation under a
transfer fee: 2nd #20 pinned single sweeps under tf (gross vault
spend, net recipient gain, withheld in the recipient extension,
gross event) and 2nd #21 pinned single collects under tf (vault
drains in full, net dest gain, withheld in the dest extension,
gross event). 3rd #4 pinned sweep -> collect chains, but only
under the plain Token program, and left "collect with a missing
vault ATA, and sweep/collect under transfer-fee mints" explicitly
unexecuted in its Limits. So the composition questions were open:
when a sweep already withholds once into the vault ATA, does the
following collect withhold a second time on the swept balance?
Does the vault ATA's own withheld balance survive the collect?
What does a collect do when the sweep delivered net zero, or when
the destination is missing or has no extension space? And does a
collect fail or no-op when the vault ATA does not exist at all?
This packet answers all of that with one signed transaction per
step, on three program images (original, #424 control, #427
candidate).

## Fixture

The repository liquidity fixture: pool
`GseMAnNDvntR5uFePZ51yZBXzNSn7GdFPkfHwfr6d77J`, base vault
673,696,395,912,745, quote vault 122,946,690,720, LP supply
4,194,352,106,721, pool protocol_fees 2,488, creator_fees 123,394,
virtual_quote_reserves -125,882, disable_flags 0, clock slot 100 /
timestamp 1234567890. The quote mint and the pool quote vault are
converted to Token-2022 ownership for the tf cases, with the
transfer-fee extension synthesized post-hoc on the mint (as in 2nd
#20 / #21) and a zero-withheld extension on the vault; the
recipient/destination ATAs are Token-2022-derived. The creator
sweep recipient is the creator-vault PDA for the pool's
coin_creator, and the collect destination is a token account owned
by that coin_creator. Fee payer is PAYER for every step: a sweep to
a fresh Token-2022 ATA costs 2,162,600 (fee 5,000 + ATA rent
2,157,600), a sweep to a pre-existing ATA costs 5,000, and every
collect costs 5,000 (the destination is always pre-created except
in the missing-destination case, because collect requires it to
exist -- see below).

Event layouts (offsets as read from the receipts; verify.py decodes
only the discriminator, length, sweep timestamp / recipient / amount /
bucket, and collect timestamp / creator / fee / vault ATA /
destination -- the other offsets below are informational):
- SweepPoolFeeEvent, 185 bytes, disc `82a42461e48287a5`:
  timestamp @8, pool @16, base mint @48, quote mint @80, recipient
  @112, payer @144, amount @176, bucket @184 (0 protocol,
  1 creator).
- CollectCoinCreatorFeeEvent, 120 bytes, disc `e8f5c2eeeada3a59`:
  timestamp @8, coin_creator @16, fee @48, vault ATA @56, token
  account @88.

## Cases (14 cases, 27 steps per image, 81 receipts)

Family A -- Token baseline anchor:
- `a-token-sweep-collect`: fixture sweep 123,394 to the creator
  vault ATA (fresh Token ATA, payer 2,044,280, pool cf 0,
  vq -2,488), then collect drains exactly 123,394 to the dest
  (payer 5,000, pool untouched).

Family T -- tf chains. Every chain case starts from the fixture
buckets (protocol 2,488 / creator 123,394) unless noted:
- `t-tf100`: sweep creator tf100 -> vault ATA net 122,160 /
  withheld 1,234 (event gross 123,394, pool cf 0, vq -2,488);
  collect -> dest net 120,938 / withheld 1,222 (event gross
  122,160). The vault ATA's own withheld 1,234 is NOT moved or
  cleared by the collect: after the drain it reads amount 0 /
  withheld 1,234. Double withholding is real, and the first hop's
  withheld balance is stranded in the vault ATA.
- `t-tf5000`: sweep net 61,697 / withheld 61,697; collect fee
  ceil(61,697 * 0.5) = 30,849, dest 30,848 / withheld 30,849;
  vault withheld stays 61,697.
- `t-tf10000`: sweep delivers net 0 / withheld 123,394; the
  collect is a silent no-op -- 0 events, log "No coin creator fee
  to collect", payer 5,000, dest unchanged (0 / 0), vault
  withheld untouched. A zero-amount vault ATA with a full
  withheld balance collects nothing and errors nothing.
- `t-tf100-max100`: sweep net 123,294 / withheld 100 (cap binds
  at the sweep); collect fee is capped at 100 again (dest
  123,194 / withheld 100) -- the maxfee cap binds at both hops.
- `t-prewithheld-vault`: vault ATA pre-existing at 5,000 /
  withheld 1,000; sweep tf100 lands 127,160 / 2,234 (payer
  5,000, no ATA creation); collect fee ceil(127,160 * 0.01) =
  1,272, dest 125,888 / withheld 1,272; vault withheld stays
  2,234.
- `t-prewithheld-dest`: dest pre-existing at 5,000 / withheld
  1,000; sweep then collect accumulates the dest to 125,938 /
  2,222.
- `t-accrual128869`: pool patched to the 3rd #4 v2-buy accrual
  state (protocol 10,975 / creator 128,869 / vq -139,844); sweep
  tf100 net 127,580 / withheld 1,289 (pool cf 0, vq -10,975);
  collect dest 126,304 / withheld 1,276.
- `t-twice`: sweep, collect, collect again -- the second collect
  is a silent no-op (0 events, "No coin creator fee"), dest
  withheld unchanged at 1,222.
- `t-proto-then-collect`: protocol sweep tf100 lands 2,463 /
  withheld 25 in the protocol ATA (pool pf 0); the collect is a
  silent no-op with the protocol ATA untouched -- protocol sweep
  output is NOT collectable, even under tf.
- `t-nodest`: sweep tf100, then collect with no destination
  account -> 3012 AccountNotInitialized (caused by account:
  coin_creator_token_account), full rollback, vault ATA keeps
  its swept 122,160 / 1,234. Collect requires the destination to
  exist even though it never creates it.
- `t-noext-dest`: sweep tf100, then collect to a 170-byte
  Token-2022 destination with no extension space -> Token-2022
  custom error 0xd, full rollback, vault ATA keeps 122,160 /
  1,234.

Family M -- missing vault ATA:
- `m-missing-vault-token`: collect with no vault ATA at all
  (Token program) -> 3012 AccountNotInitialized (caused by
  account: coin_creator_vault_ata), full rollback, payer 5,000.
- `m-missing-vault-tf`: same under tf100 -> identical 3012
  (caused by account: coin_creator_vault_ata). The vault ATA is
  deserialized before any amount check, unlike the empty-vault
  no-op: absence errors, emptiness does not.

## Result

- Withholding composes multiplicatively across the pipeline:
  gross 123,394 -> sweep net 122,160 (tf100) -> collect net
  120,938. Each hop's event reports its own hop's gross, so an
  event-only reader overstates both deliveries.
- A hop's withheld balance is stranded in its own account: the
  sweep's withheld stays in the vault ATA after the collect
  drains it, and only a withdraw-withheld path (not a pump-amm
  instruction) could ever move it.
- Zero is a no-op at both hops for different reasons: a zero
  sweep creates no ATA and emits no event (3rd #4), and a
  zero-amount collect (including the tf10000 case, where the
  vault holds only withheld fees) emits no event and errors
  nothing.
- Caps bind per hop, not per pipeline: maxfee 100 withholds 100
  at the sweep and 100 again at the collect.
- Collect's account requirements are strict (each failure was
  measured on its own; no case combines two missing accounts, so
  no check ordering is claimed): a missing vault ATA errors 3012 (vault account), a missing
  destination errors 3012 (token account), and a destination
  without extension space errors 0xd -- all with full rollback
  except the 5,000 payer fee.
- Sweep lamports follow the native vault: a sweep credits gross
  lamports into the recipient ATA (fresh ATA: rent + gross;
  pre-existing ATA: old lamports + gross), while a Token-2022
  collect between non-native accounts moves no lamports at all.

## Limits

- Offline LiteSVM reproduction on synthetic fixtures only; no
  claim about on-chain behavior beyond these measured
  transactions, no source change, no build, and no whole program
  equivalence claim.
- All amounts, error codes, and site lines are exact values for
  this fixture state, not claims about other pool states. Error
  site line numbers differ between the original and the rebuilt
  images; verify.py checks each image's recorded site line
  against that image's own logs and never compares site lines
  across images (2nd #36 lesson). The README cites error codes
  and caused-by accounts, which agree across images.
- The quote-mint transfer-fee extension and the Token-2022 vault
  conversion are synthesized post-hoc (as in 2nd #20 / #21):
  this pins handler transfer behavior, not a reachable mainnet
  state, since the legacy creation path cannot put a transfer fee
  on a quote mint.
- The stranded-withheld claim is stated as observed account
  state (vault ATA amount 0 / withheld unchanged after the
  collect); the withdraw-withheld path itself was not executed
  here.
- The t-accrual128869 pool state is a patch simulating the 3rd
  #4 v2-buy accrual, not a trade executed in this packet.

## Verify and provenance

From the repository root:

    python3 -I -B research/amm-sweep-collect-tf-chains-20261029/verify.py

`verify.py` needs only `solders` plus files in the repository: this
packet, `evidence/original/pump_amm/deployed.so`, and the two
retained rebuilt images
`research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz`
(control, #424) and
`research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz`
(candidate, #427), whose decompressed sha256 values match the
`images` block of `runtime/report.json.gz`. It re-checks the
recorded receipts against the report's expected values; it does
not re-execute any transaction.

`producer.py` is the script that generated the receipts and is
kept as a provenance record. It is not runnable as committed: it
hard-codes a private workspace layout (`~/workspace/pumpfun-sparse`
for the harness scripts and `~/workspace/slop-verify` for the
control/candidate `.so` files) and chdirs there on start.

