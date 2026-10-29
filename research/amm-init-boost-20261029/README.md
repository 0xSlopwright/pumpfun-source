# init_boost at runtime

## Problem

`init_boost` is the pump-amm instruction that initializes a pool's
boost: it moves quote from the pool quote vault into the boost
vault (an associated token account owned by the `boost_vault` PDA
for the pool) and sets the pool's `virtual_quote_reserves` to the
moved amount. Run 1 and 2nd-run packets #1-#10 never covered
`init_boost` directly: #50 covered `boost_buy_and_burn` and #28
covered `toggle_boost` / `set_boost_authority`, but not the boost
initialization itself. Two questions were only implicit: can a
direct signed call ever run the transfer, and what exactly does
the transfer move when it does run?

## Cases

All cases run on synthetic fixtures on a fresh VM per case per
image (original / #424 control / #427 candidate). Direct cases use
the create-state pool (287 bytes, virtual_quote_reserves 0) or the
trade-fixture pool (300 bytes, virtual_quote_reserves -125,882);
the two pool lengths are both accepted by the has_one bindings and
the virtual-reserves offset 245..261 is valid in both. Migration
cases replay saved signed Pump `migrate_v2` transactions: the
canonical shape (`migration` row) and a second shape
(`missing_boost` row) that carries no boost remaining accounts.
`payer_delta` is after-minus-before for the transaction fee payer
(negative = charged). The pool quote input `q` is the pool quote
balance the migration itself establishes (84,990,359,062 in this
fixture), read from the disabled control case's pool quote vault.

| label | setup | result |
| --- | --- | --- |
| direct-create-baseline | create pool, vault missing | success: vault created 2,039,280 lamports, amount 0, payer -2,044,280, pool/vaults unchanged, no event |
| direct-fixture-baseline | fixture pool (vq -125,882), vault missing | success: same as create baseline |
| direct-vq-positive | pool vq 10^9 | success: vault created, no transfer, no event |
| direct-boost-disabled | global boost_enabled 0 | success: vault created anyway (init_if_needed runs before the handler gate) |
| direct-boost-disabled-vq0 | boost_enabled 0, vq 0 | success: vault created |
| direct-big-vaults | vaultbase/vaultquote 10^12, vq 0 | success: vault created, vault amounts untouched, no transfer |
| direct-vault-exists-empty | vault pre-created, amount 0 | success: vault byte-identical, payer -5,000 |
| direct-vault-exists-funded | vault pre-created, amount 10^9 | success: vault byte-identical, payer -5,000 |
| direct-vault-wrong-mint | vault mint = base mint | 2014 ConstraintTokenMint (boost_vault), payer -5,000, rollback |
| direct-vault-wrong-owner | vault owner = outsider | 2015 ConstraintTokenOwner (boost_vault), payer -5,000, rollback |
| direct-pool-base-field | pool base field = outsider | 6008 InvalidBaseMint (pool), payer -5,000, vault not created |
| direct-pool-quote-field | pool quote field = outsider | 6009 InvalidQuoteMint (pool), payer -5,000, vault not created |
| direct-pool-vaultbase-field | pool vaultbase field = outsider | 6014 InvalidPoolBaseTokenAccount (pool), payer -5,000, vault not created |
| direct-pool-vaultquote-field | pool vaultquote field = outsider | 6015 InvalidPoolQuoteTokenAccount (pool), payer -5,000, vault not created |
| direct-pool-readonly | pool read-only | 2000 ConstraintMut (pool), payer -5,000, vault not created |
| direct-config-substitute | config key = 0x59 key (copy) | 2006 ConstraintSeeds (global_config), payer -5,000, vault not created |
| direct-pool-substitute | pool key = 0x59 key (copy) | 2006 ConstraintSeeds (boost_vault_authority: the authority PDA derives from the pool key), payer -5,000, vault not created |
| direct-authority-substitute | authority key = 0x59 key | MissingAccount, payer -5,000, vault not created |
| direct-vault-substitute | vault key = 0x59 key | MissingAccount, payer -5,000, vault not created |
| direct-pool-size-0 | pool truncated to 0 bytes | InvalidAccountData (17179869184, pool), payer -5,000, vault not created |
| direct-pool-size-100 | pool truncated to 100 bytes | InvalidAccountData (pool), payer -5,000, vault not created |
| direct-pool-size-286 | pool truncated to 286 bytes | BorshIoError ("failed to write whole buffer", 64424509440, pool), payer -5,000, vault not created |
| direct-pool-disc-flip | pool discriminator first byte 0xf1 -> 0xff | InvalidAccountData (pool), payer -5,000, vault not created |
| direct-quote-token22 | quote mint owned by Token-2022 | IncorrectProgramId (vault ATA is created through the Token program), payer -5,000, vault not created |
| direct-separate-payer | fee payer outsider signs, creator payer signs | success: vault created, creator -2,039,280 (rent only), outsider -10,000 (2 signatures), no event |
| direct-unsigned-creator | fee payer outsider signs, creator meta non-signer | 3010 AccountNotSigner (creator), outsider -5,000, vault not created |
| mig-boost-disabled | canonical migration, boost_enabled 0 | success: pool vq 0, vault created 2,039,280 / amount 0, quote vault 84,990,359,062, 2 events, fee payer -2,044,280 |
| mig-enabled-baseline | canonical migration, boost_enabled 1, curve base 206,900,000,000,000 | success: moves 17,584,505,289, pool vq 17,584,505,289, vault 17,586,544,569 / 17,584,505,289, quote vault 67,405,853,773, 3 events, fee payer -2,044,280 |
| mig-enabled-curvebase-1 | curve base 1 | success, no transfer: amount 0, vq 0, vault 2,039,280 / 0, quote vault unchanged, 2 events |
| mig-enabled-curvebase-100 | curve base 100 | success, no transfer: amount 0, same as base 1 |
| mig-enabled-curvebase-1b | curve base 10^9 | success: moves 84,990, vault 2,124,270 / 84,990, quote vault 84,990,274,072, 3 events |
| mig-enabled-curvebase-1t | curve base 10^12 | success: moves 84,990,359, vault 87,029,639 / 84,990,359, quote vault 84,905,368,703, 3 events |
| mig-enabled-curvebase-1e15m1 | curve base 10^15-1 | success: moves 84,990,359,061, quote vault left at 1, 3 events |
| mig-enabled-curvebase-1e15 | curve base 10^15 | success, no transfer: amount equals quote exactly, vq 0, vault 2,039,280 / 0, quote vault unchanged, 2 events |
| mig-enabled-curvebase-u64max | curve base 2^64-1 | success, no transfer: amount 1,567,795,402,349,395 exceeds quote, vq 0, vault 2,039,280 / 0, quote vault unchanged, 2 events |
| mig-missing-boost-enabled | missing_boost migration shape, boost_enabled 1 | 6027 NotEnoughRemainingAccounts (thrown in programs/pump/src/migrate_v2.rs:658), no pool created, fee payer -5,000, rollback |

## Result

- Direct `init_boost` never transfers and never sets
  `virtual_quote_reserves`: the transfer path requires
  `creator == pool-authority PDA`, and a PDA cannot sign a direct
  transaction. Every direct case succeeds with pool, vaultbase and
  vaultquote data byte-identical and no event line, whatever the
  pool's virtual reserves (0, 10^9, fixture -125,882) or the global
  `boost_enabled` flag (0 or 1).
- What direct `init_boost` does do, unconditionally, is create the
  boost vault ATA (`init_if_needed`, payer = creator): a missing
  vault appears at 2,039,280 lamports with amount 0, mint = quote,
  owner = `boost_vault` PDA, and the creator pays exactly
  2,039,280 + 5,000 fee. A pre-existing vault (empty or funded) is
  left byte-identical and only the 5,000 fee is charged. With a
  separate fee payer, the rent still comes from the creator
  (-2,039,280) and the fee from the outsider (-5,000 per signature,
  2 signatures = -10,000).
- The only reachable caller of the transfer path is the Pump
  `migrate_v2` CPI: Pump always invokes `init_boost` during
  migrate, and the AMM gates on `boost_enabled`. With
  `boost_enabled = 1` the transfer moves exactly
  `floor(bonding_curve_base * q / 10^15)` from the pool quote
  vault into the boost vault, and pool `virtual_quote_reserves`
  is set to exactly that amount; the boost vault's lamports are
  exactly 2,039,280 + amount, and the migration fee payer is
  charged exactly 2,044,280 in every successful migration case.
  The transfer is skipped (vault created but amount 0, vq 0,
  quote vault untouched, no InitBoostEvent) when the amount is 0
  (curve base 1 or 100) or >= q (curve base 10^15 gives exactly q,
  10^15+1 and u64max give more). The pool base vault always
  receives the full bonding-curve base balance, independent of
  boost.
- A second saved migration shape (`missing_boost`) that carries no
  boost remaining accounts fails in Pump itself with 6027
  NotEnoughRemainingAccounts when boost is enabled, and the whole
  migration rolls back except the fee payer's 5,000 fee.
- All three images (original / #424 control / #427 candidate)
  agree on every case: this packet pins behavior, it does not
  claim a divergence.

## Limits

Offline LiteSVM synthetic accounts only. Direct cases use the
create-state pool (287 bytes) and the trade-fixture pool (300
bytes); the length difference between fixtures is recorded, not
interpreted as a version claim. Migration cases replay two saved
signed transactions; the `q` used by the transfer formula is the
pool quote balance the canonical migration establishes in this
fixture, read from the disabled control case, not derived from the
bonding-curve account data. The transfer path's
`calculate_virtual_quote_reserves` division is exercised only
through the migration amounts listed above. No source change,
build, or whole-program equivalence claim is made. The direct
transfer path's unreachability follows from the handler's
`creator == pool-authority PDA` check plus the fact that a PDA
cannot sign a direct transaction; no CPI caller other than Pump
`migrate_v2` is covered.
