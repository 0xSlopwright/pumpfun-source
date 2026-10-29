# liquidity -> sweep -> collect under transfer fee

## Problem

3rd #18 chained liquidity-first sweep/collect without a fee, and
3rd #5/#8/#11 pinned sweep/collect/trade legs under a transfer
fee separately, but nobody chained deposit/withdraw INTO sweep ->
collect under tf. The question is sharp because the fee withholds
at every hop: the deposit grosses up, the withdraw nets down,
the sweep nets down again, and the collect nets down a third
time -- while the pool buckets themselves accrue the same gross
fee accounting as the nofee chain, and the events keep reporting
pre-tf legs. This packet measures the full chain in both
directions, with loops, round trips, limit gates, and the
protocol bucket, in single VMs, one signed transaction per step,
on three program images (original, #424 control, #427 candidate).

## Fixture

The repository liquidity fixture: pool
`GseMAnNDvntR5uFePZ51yZBXzNSn7GdFPkfHwfr6d77J`, base vault
673,696,395,912,745, quote vault 122,946,690,720, LP supply
4,194,352,106,721, pool protocol_fees 2,488, creator_fees 123,394,
virtual_quote_reserves -125,882, disable_flags 0, clock slot 100 /
timestamp 1234567890. The quote mint carries a synthesized
Token-2022 transfer-fee extension (post-hoc, as in 3rd #5/#8:
the liquidity creation path cannot put a transfer fee on a quote
mint either); the mint, the user quote ATA, and the vault quote
ATA are converted by the liquidity harness `transferfee`
override to 178-byte Token-2022 accounts, whose withheld field
sits at offset 170 (not 174 -- see Limits). The protocol,
creator, buyback, and collect-destination ATAs are pre-created
Token-2022 ATAs (182 bytes, withheld at offset 174) funded at
the 182-byte rent (2,157,600 lamports), so every sweep and
collect costs only the 5,000 fee. A trade step funds the user
volume accumulator on the first trade of a VM (1,844,400
lamports, 137 bytes); later trades in the same VM reuse it and
cost 5,000 only.

Event layouts (offsets of the fields verify.py decodes; the
remaining event words are not individually checked):
- DepositEvent / WithdrawEvent, 264 bytes, disc `78f83d531f8e6b90` /
  `1609851aa02c47c0`: base leg @72, quote leg @80. The deposit
  event reports the NET vault receipt; the withdraw event
  reports the GROSS vault send -- opposite sides.
- BuyEvent (v2), 500 bytes, disc `67f4521f2cf57777`: curve @64,
  lp_bps @72, lp_fee @80, proto_bps @88, proto_fee @96, quote
  @104, user_quote_in @112 -- pre-tf curve amounts in every
  measured buy, not the grossed spend. SellEvent (v2), 449 bytes, disc
  `3e2f370aa503dc2a`: same slots, quote @104, user_out @112
  (pre-tf gross receipt).
- SweepPoolFeeEvent, 185 bytes, disc `82a42461e48287a5`:
  timestamp @8, recipient @112, amount @176 (GROSS), bucket
  @184 (0 protocol, 1 creator).
- CollectCoinCreatorFeeEvent, 120 bytes, disc
  `e8f5c2eeeada3a59`: timestamp @8, coin_creator @16, fee
  @48 (GROSS vault-ATA drain), vault ATA @56, token account
  @88.

Pool states below are (virtual_quote_reserves, protocol_fees,
creator_fees); lp_supply is 4,194,352,106,721 unless noted.

## Cases (14 cases, 51 steps per image, 153 receipts)

Family A -- tf liquidity anchors -> sweep -> collect (the seed
only; liquidity accrues nothing, with or without the fee):
- `a-dep9-tf100-swc-col`: dep-1e9 under tf100 (userquote
  -29,608,495 gross, vaultquote +29,312,410 net, vault
  withheld 296,085; base legs fee-blind), sweep creator nets
  122,160 (withheld 1,234, event gross 123,394), collect DEST
  nets 120,938 (withheld 1,222, event gross 122,160; vault ATA
  drains to 0 but keeps its 1,234 stranded).
- `a-dep9-tf5000-swc-col`: dep-1e9 under tf5000 (userquote
  -58,624,820 gross for the same 29,312,410 net, withheld
  29,312,410), sweep nets 61,697 (withheld 61,697), collect
  DEST nets 30,848 (withheld 30,849).
- `a-wd9-tf100-swc-col`: wd-1e9 under tf100 (userquote
  +29,019,284 net of the 29,312,409 gross send, withheld
  293,125), sweep 122,160, collect 120,938.
- `a-wd9-tf5000-swc-col`: wd-1e9 under tf5000 (userquote
  +14,656,204 net, withheld 14,656,205), sweep 61,697,
  collect 30,848.

Family B -- tf trade -> tf liquidity -> tf sweep -> tf collect
(the accrual survives the intervening tf liquidity step):
- `b-buy-tf100-dep-swc-col`: buy 10^10 under tf100 (spend
  1,866,375 grossed up from the nofee 1,847,796; vault nets
  1,839,310, withheld 18,579; buyback nets 8,401, withheld 85;
  pool (-139,844, 10,975, 128,869)), dep-1e9 (net 29,312,845,
  gross 29,608,935, vault withheld 18,579 -> 314,669), sweep
  creator nets 127,580 (withheld 1,289, event gross 128,869),
  collect DEST nets 126,304 (withheld 1,276).
- `b-sell-tf100-dep-swc-col`: sell 10^10 under tf100 (user
  nets 1,784,093 of the 1,802,115 gross receipt, withheld
  18,022; buyback 8,401; pool (-139,843, 10,974, 128,869)),
  dep-1e9 (net 29,311,975, gross 29,608,056, vault withheld
  296,081), sweep 127,580, collect 126,304.
- `b-buy-tf100-wd-swc-col`: buy, wd-1e9 (user nets 29,019,715
  of the 29,312,844 gross send, withheld 293,129; vault
  withheld stays 18,579), sweep 127,580, collect 126,304.

Family C -- tf liquidity -> tf trade -> tf sweep -> tf collect
(proportional tf liquidity is invisible to the tf trade):
- `c-dep-tf100-buy-swc-col`: dep-1e9, then buy 10^10 settles
  with the fresh tf buy legs (spend 1,866,375, vault net
  1,839,310, buyback 8,401; vault withheld 296,085 -> 314,664),
  sweep 127,580, collect 126,304.
- `c-wd-tf100-buy-swc-col`: wd-1e9, then buy: identical tf
  buy legs (user withheld 293,125 survives the trade;
  vault withheld 0 -> 18,579), sweep 127,580, collect 126,304.

Family D -- round trip, double collect, limit gates under tf:
- `d-dep-tf100-wd-swc-col`: dep-1e9, wd-1e9 (the vaults end
  +1 base / +1 quote, but the user's quote token amount ends
  -589,211 = 296,085 withheld in the vault ATA + 293,125
  withheld in the user ATA + the 1 rounding unit; user base
  ends -1; pool back to (-125,882, 2,488, 123,394)), sweep
  122,160, collect 120,938.
- `d-dep-tf100-swc-col-col`: dep, sweep, collect, second
  collect is a SILENT NO-OP (0 events, payer 5,000 only, DEST
  unchanged, withhelds unchanged).
- `d-dep-limit-net-tf100`: dep capped at the net spend
  (maxquote 29,312,410; max_base u64::MAX) -> 6004 ExceededSlippage, full
  rollback, 0 events; the following sweep still moves only
  the seed (122,160) and the collect still drains 120,938.
- `d-wd-limit-gross-tf100`: wd floored at the gross send
  (minquote 29,312,409; min_base 0) -> 6004, full rollback, 0 events;
  the following sweep/collect are the same seed values.

Family E -- protocol bucket under tf:
- `e-buy-tf100-dep-swp-swc-col`: buy, dep-1e9, protocol sweep
  nets 10,865 of the 10,975 bucket (withheld 110, event gross
  10,975), creator sweep 127,580, collect drains only the
  creator ATA (127,580; DEST nets 126,304). The collect leaves
  the protocol ATA's 10,865 untouched, as in the nofee chain
  (3rd #18); this case measures that one collect, not whether
  the protocol ATA is drainable by any other instruction.

## Result

- Deposit under tf grosses up the quote leg only: tf100 spends
  29,608,495 for a 29,312,410 net, tf5000 spends 58,624,820
  for the same net; the base leg and the LP minted (10^9)
  are fee-blind. The deposit event reports the net receipt,
  the withdraw event reports the gross send.
- Withdraw under tf nets down on the quote leg only: tf100
  pays 29,019,284 of 29,312,409, tf5000 pays 14,656,204; the
  base leg is fee-blind and the LP burned (10^9) is fee-blind.
- Liquidity accrued nothing in these cases: each measured
  liquidity-first sweep moves exactly the 123,394 seed, and
  each measured liquidity-first collect drains it net of two more
  withholdings (tf100: 122,160 -> 120,938; tf5000: 61,697 ->
  30,848). Each hop's withheld amount stays in the receiving
  ATA's withheld field (no harvest/withdraw-withheld step was run).
- A tf trade's accrual survives tf liquidity untouched:
  in the three measured buy/sell -> dep/wd -> sweep -> collect
  chains the creator sweep moves the
  full 128,869 bucket (net 127,580) and the collect delivers
  126,304 to DEST, even
  though the intervening dep/wd legs themselves gross up /
  net down with the fee (dep after buy: net 29,312,845 /
  gross 29,608,935; dep after sell: net 29,311,975 / gross
  29,608,056; wd after buy: net 29,019,715 / gross 29,312,844).
- A dep-1e9 or wd-1e9 before a tf buy left the measured buy
  token deltas, decoded BuyEvent fields (curve, fees, bps,
  quote, user_quote_in) and pool buckets equal to the fresh tf
  buy anchor. The LP supply (4,195,352,106,721 after dep-1e9,
  4,193,352,106,721 after wd-1e9), the vault balances and the
  withheld balances carried over from the liquidity step do
  differ; undecoded event words (e.g. reserves) were not
  compared.
- In every measured trade the buyback leg is transferred at
  face, not grossed up (3rd #9): buyback fee 8,486 nets 8,401 at tf100 (withheld
  85) while the vault leg grosses up to deliver its constant
  net 1,839,310. The decoded event fields report pre-tf curve
  amounts (buy uin 1,847,796 vs actual spend 1,866,375).
- Limit sides under tf, chained into sweep: a dep max_quote
  equal to the net receipt (29,312,410) fails 6004 while the
  gross spend is 29,608,495, consistent with the cap applying to
  the gross spend; a wd min_quote equal to the gross send
  (29,312,409) fails 6004 while the net receipt is 29,019,284,
  consistent with the floor applying to the net receipt (only
  these two limit values were measured); both fail with
  full rollback and the following seed sweep/collect are
  unaffected. Round trips compose: dep -> wd -> sweep ->
  collect still moves only the seed.
- In every measured transfer the sender's amount falls by the gross transfer
  while the recipient nets down (sweep: vault -123,394,
  creator ATA +122,160); the recipient's withheld, not the
  sender's, absorbs the fee. Lamports on the user/vault
  quote accounts move by the gross flow while token amounts
  net down -- the Token-2022 native-account divergence
  already noted in 3rd #15.

## Verify / provenance

From the repository root (no network, no private workspace):

    python3 -I -B research/amm-liquidity-sweep-collect-tf-chains-20261029/verify.py

verify.py needs only `solders` and the three program images
retained in the repository (`evidence/original/pump_amm/deployed.so`,
the #424 control `research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz`
and the #427 candidate `research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz`,
hashed after gzip decompression). It re-checks the recorded receipts;
it does not re-execute them. `producer.py` regenerated the receipts
against a private LiteSVM harness and workspace layout that is not
in this repository, so it documents how the receipts were made but
cannot be re-run from a fresh clone.

Overlap with earlier packets: the standalone dep/wd tf100/tf5000
legs (29,608,495 / 58,624,820 spend; 29,019,284 receipt) match
`research/amm-liquidity-transfer-fee-20261028`, and the standalone
tf sweep/collect amounts (122,160 / 120,938; 61,697 / 30,848; the
128,869 bucket) match `research/amm-sweep-collect-tf-chains-20261029`
and `research/amm-collect-token22-transfer-fee-20261029`. What this
packet adds is the chaining of those legs in one VM per case.

## Limits

- Offline LiteSVM reproduction on synthetic fixtures only; no
  claim about on-chain behavior beyond these measured
  transactions, no source change, no build, and no whole
  program equivalence claim.
- All amounts, error codes, and site lines are exact values
  for this fixture state, not claims about other pool states.
  Error site line numbers differ between the original and the
  rebuilt images; verify.py checks each image's recorded site
  line against that image's own logs and never compares site
  lines across images (2nd #36 lesson). The README cites
  error codes, which agree across images.
- The withheld-field offset depends on how the account was
  built: the liquidity harness `transferfee` override produces
  178-byte accounts with withheld at offset 170, while the
  packet's own `t22acct` helper produces 182-byte accounts
  with withheld at offset 174. verify.py reads each layout
  at its own offset; a reader that assumes one offset for
  both layouts will misread one side's withheld balance.
- The quote-mint transfer-fee extension is synthesized
  post-hoc (as in 3rd #5/#8); this pins handler transfer
  behavior, not a reachable mainnet state.
- Harness note: the Token-2022 buyback ATA is seeded at setup,
  not by the trade_transferfee full override on the first
  trade step: that override rebuilds the quote accounts from
  their first 165 bytes and zeroes their withheld extension,
  which would erase a prior dep/wd step's withheld. Trade
  steps here use only the light meta adjustment (token program
  -> Token-2022, buyback ATA -> the seeded ATA), so withheld
  accounting is exact across every chain.
- Transfer-fee variants of liquidity-first chains with a base
  transfer fee, and deposit/withdraw on cashback/mayhem pools
  under tf, were not chained here; the dual-fee liquidity legs
  were pinned in 2nd #19 and the mode gates in 2nd #44.
