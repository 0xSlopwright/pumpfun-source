# PumpSwap remaining-work audit, 27 October 2026

The selected candidate is `4e6a5617a7a8c3474ed7662f0188df4b1824c08253ebfb08212351ca5249da12` (event-ownership recovery). This audit reads its measurement, candidate, symbols and original capture. Every unmatched original window appears exactly once in the accompanying JSON. Latest main observed at the start of the audit was `450c11d7d71994e25fb02f649d6ac5bf9bf7035b`; this document does not claim that candidate had already been published there.

## Measured completion and remainder

| Measure | Recovered | Remaining |
|---|---:|---:|
| Normalized original instruction windows | 653 / 785 (83.1847%) | 132 / 785 (16.8153%) |
| Original executable bytes covered by normalized window matches | 818,944 / 1,162,040 (70.4747%) | 343,096 / 1,162,040 (29.5253%) |
| Raw-equal original bodies | 148 / 785 (18.8535%) | 637 / 785 (81.1465%) |
| Captured upstream IDL instruction wrappers | 38 / 38 (100%) | 0 / 38 |

Normalized window coverage is the appropriate headline progress indicator, with its denominator stated. It is not an estimate of effort remaining or perfect reconstruction. The 505 normalized-only windows still need absolute byte/layout closure. The complete ELF differs, its sections and relocations still need complete identity, and original source/compiler provenance remains open. Seven generated IDL-management wrappers and fallback paths are outside the 38-instruction-wrapper census.

The current independent direct-call/static audit closes 587 original windows under its bounded assumptions. Including recorded source coordinates reduces the bounded static set to 580. Neither number certifies all 653 body matches or full indirect/data closure. Passing the 17,462 core signed differential cases is strong finite behavioral evidence, not exhaustive behavior; authentic fixed-admin `create_config` success remains unexercised.

## Exhaustive work partition

These domains describe the location of the remaining work. They do not assert that the underlying defect is known or that every unmatched window has missing business logic.

| Domain | Windows | Original bytes |
|---|---:|---:|
| Math, token and runtime helpers | 23 | 24,656 |
| Liquidity, admin and incentive business | 29 | 138,784 |
| Instruction error closures | 35 | 18,216 |
| Swap and route business | 24 | 122,424 |
| State methods and serialization | 18 | 29,432 |
| Generated account validation | 3 | 9,584 |
| **Total** | **132** | **343,096** |

## Next work, in priority order

1. Finish the already-owned refined batch: Disable five-store/event ownership, InitBoost temporary lifetime, CreatePool checked minimum after pool initialization, and the natural AnchorSPL withheld-fee harvest helper. Their individual diagnostics are promising; only a combined strict repeat, target tests, recount and full acceptance can select them. Do not count expected gains early.
2. Reconstruct remaining large business-body shapes. Deposit (`0x2fb38`, 7,128 bytes) and Withdraw (`0x32750`, 7,200) retain 55/56 direct calls and transfer/mint/burn ordering, but their candidate bodies are 7,016/7,064 bytes. Inspect expression/temporary lifetimes and error construction around boosted reserve updates without changing the already-correct asymmetric narrowing rules. Legacy buy/sell, multi-hop curve/AMM routing, V2 execute handlers, creator transfer, sweep and incentive handlers are also open.
3. Keep independent helper recovery active: the natural multi-hop flags iterator (`0xfb08`), transfer-fee decoder ownership/Clock order, original fee representation and dependency provenance, and seven curve/fee functions whose instructions currently differ at source-coordinate stores. The flags iterator is owned by the math lane.
4. Recover source organization from evidence and close error/data references. A read-only same-size/same-relocation comparison finds 73 windows with 1–3 differing normalized instructions; this is only a diagnostic. Candidate alternatives can point to different error data or callees. Do not turn line-number fitting, explicit padding, forced inlining attributes or normalization of additional bytes into recovery evidence.
5. Close generated account validation, full referenced-data/relocation identity, raw layout, and complete ELF identity. Preserve negative controls and known scope limits. Current complete ELF length is 1,291,216 bytes versus 1,268,504 bytes for the original executable extent; matching total lengths alone would not prove identity.

The source-coordinate diagnostics offer no new selected patch. In particular, Deposit and Withdraw both already reuse the event for both emissions; removing another clone is not justified. Their existing transfer and arithmetic branches must not be homogenized solely to make source look similar.

## Window ledger

The JSON contains exact original extents, source hints and nearest diagnostic candidate alternatives. `Near` is the smallest differing-instruction count among same-sized candidate functions with the same relocation sites/types. A dash means no such candidate body exists. It does not match call targets or referenced data and is never counted as a recovered window.

| Original start | Bytes | Domain | Near | Source/candidate hint |
|---|---:|---|---:|---|
| `0x2288` | 232 | Math, token and runtime helpers | 29 | _ZN4core3ptr176drop_in_place$LT$core..result..Result$LT$core..option..Option$LT$mpl_token_metadata..generated..types..collection_details..CollectionDetails$GT$$C$std..io..error..Error$GT$$GT$ |
| `0xc5d0` | 1,240 | Math, token and runtime helpers | — | Unresolved identity |
| `0xfb08` | 704 | Math, token and runtime helpers | — | Unresolved identity |
| `0x119c8` | 1,192 | Math, token and runtime helpers | — | Unresolved identity |
| `0x11e70` | 1,184 | Math, token and runtime helpers | 2 | curve/constant_product.rs:45, curve/constant_product.rs:47 |
| `0x123a0` | 1,184 | Math, token and runtime helpers | 2 | curve/constant_product.rs:85, curve/constant_product.rs:87 |
| `0x12840` | 712 | Math, token and runtime helpers | 1 | curve/constant_product.rs:112 |
| `0x12b08` | 1,672 | Math, token and runtime helpers | 2 | curve/fees.rs:19, curve/fees.rs:17, curve/fees.rs:21 |
| `0x13190` | 712 | Math, token and runtime helpers | 1 | curve/fees.rs:32 |
| `0x13458` | 2,264 | Math, token and runtime helpers | — | Unresolved identity |
| `0x13d30` | 856 | Math, token and runtime helpers | 1 | curve/fees.rs:160 |
| `0x14088` | 1,656 | Math, token and runtime helpers | — | _ZN18pump_amm_recovered5curve4fees19select_and_apply_v2 |
| `0x14920` | 6,152 | Liquidity, admin and incentive business | — | Unresolved identity |
| `0x16128` | 3,168 | Liquidity, admin and incentive business | — | Unresolved identity |
| `0x17960` | 3,024 | Liquidity, admin and incentive business | — | _ZN18pump_amm_recovered18pump_amm_recovered7disable |
| `0x19138` | 9,176 | Liquidity, admin and incentive business | — | Unresolved identity |
| `0x1b510` | 688 | Liquidity, admin and incentive business | 2 | instructions/admin/toggle_cashback_enabled.rs:21 |
| `0x1b7c0` | 832 | Liquidity, admin and incentive business | 2 | instructions/admin/toggle_boost.rs:14 |
| `0x1bb00` | 688 | Liquidity, admin and incentive business | 2 | instructions/admin/toggle_mayhem_mode.rs:17 |
| `0x1c890` | 1,344 | Liquidity, admin and incentive business | 51 | _ZN18pump_amm_recovered18pump_amm_recovered21update_buyback_config |
| `0x1ecd8` | 696 | Liquidity, admin and incentive business | 1 | _ZN18pump_amm_recovered12instructions5boost32calculate_virtual_quote_reserves |
| `0x1ef90` | 3,912 | Liquidity, admin and incentive business | — | _ZN18pump_amm_recovered18pump_amm_recovered10init_boost |
| `0x1fed8` | 11,688 | Liquidity, admin and incentive business | — | _ZN18pump_amm_recovered18pump_amm_recovered18boost_buy_and_burn |
| `0x22c80` | 520 | Instruction error closures | 2 | instructions/boost.rs:258 |
| `0x22e88` | 4,024 | Liquidity, admin and incentive business | 102 | _ZN18pump_amm_recovered18pump_amm_recovered24collect_coin_creator_fee |
| `0x23e40` | 4,504 | Liquidity, admin and incentive business | — | Unresolved identity |
| `0x24fd8` | 7,632 | Liquidity, admin and incentive business | — | Unresolved identity |
| `0x26da8` | 8,232 | Liquidity, admin and incentive business | — | _ZN18pump_amm_recovered18pump_amm_recovered29transfer_creator_fees_to_pump |
| `0x28dd0` | 11,024 | Liquidity, admin and incentive business | — | _ZN18pump_amm_recovered18pump_amm_recovered32transfer_creator_fees_to_pump_v2 |
| `0x2ba60` | 10,240 | Liquidity, admin and incentive business | — | Unresolved identity |
| `0x2e260` | 520 | Instruction error closures | 3 | _ZN18pump_amm_recovered10boost_burn7execute28_$u7b$$u7b$closure$u7d$$u7d$ |
| `0x2e468` | 696 | Liquidity, admin and incentive business | 1 | instructions/create_pool.rs:339 |
| `0x2e720` | 5,144 | Liquidity, admin and incentive business | — | Unresolved identity |
| `0x2fb38` | 7,128 | Liquidity, admin and incentive business | — | _ZN18pump_amm_recovered18pump_amm_recovered7deposit |
| `0x31710` | 520 | Instruction error closures | 1 | instructions/liquidity/deposit.rs:91 |
| `0x31918` | 520 | Instruction error closures | 1 | instructions/liquidity/deposit.rs:99 |
| `0x31b20` | 520 | Instruction error closures | 1 | instructions/liquidity/deposit.rs:143 |
| `0x31d28` | 520 | Instruction error closures | 1 | instructions/liquidity/deposit.rs:152 |
| `0x31f30` | 520 | Instruction error closures | 1 | instructions/liquidity/deposit.rs:154 |
| `0x32138` | 520 | Instruction error closures | 1 | instructions/liquidity/deposit.rs:156 |
| `0x32340` | 520 | Instruction error closures | 1 | instructions/liquidity/deposit.rs:160 |
| `0x32548` | 520 | Instruction error closures | 1 | instructions/liquidity/deposit.rs:162 |
| `0x32750` | 7,200 | Liquidity, admin and incentive business | — | _ZN18pump_amm_recovered18pump_amm_recovered8withdraw |
| `0x34370` | 520 | Instruction error closures | 1 | instructions/liquidity/withdraw.rs:98 |
| `0x34578` | 520 | Instruction error closures | 1 | instructions/liquidity/withdraw.rs:106 |
| `0x34780` | 520 | Instruction error closures | 1 | instructions/liquidity/withdraw.rs:150 |
| `0x34988` | 520 | Instruction error closures | 1 | instructions/liquidity/withdraw.rs:160 |
| `0x34b90` | 520 | Instruction error closures | 1 | instructions/liquidity/withdraw.rs:162 |
| `0x34d98` | 520 | Instruction error closures | 1 | instructions/liquidity/withdraw.rs:166 |
| `0x34fa0` | 520 | Instruction error closures | 1 | instructions/liquidity/withdraw.rs:170 |
| `0x351a8` | 8,104 | Liquidity, admin and incentive business | — | Unresolved identity |
| `0x37150` | 1,376 | Swap and route business | 4 | instructions/swap/buy.rs:116, instructions/swap/buy.rs:121 |
| `0x376b0` | 9,936 | Swap and route business | — | Unresolved identity |
| `0x39d80` | 520 | Instruction error closures | 1 | instructions/swap/buy.rs:387 |
| `0x39f88` | 520 | Instruction error closures | 2 | instructions/swap/buy.rs:391 |
| `0x3a190` | 520 | Instruction error closures | 2 | instructions/swap/buy.rs:395 |
| `0x3a398` | 520 | Instruction error closures | 1 | instructions/swap/buy.rs:404 |
| `0x3a5a0` | 12,936 | Swap and route business | — | Unresolved identity |
| `0x3d8d0` | 752 | Swap and route business | 1 | _ZN18pump_amm_recovered12instructions4swap14multi_hop_swap12is_curve_hop |
| `0x3dbc0` | 9,536 | Swap and route business | — | _ZN18pump_amm_recovered18pump_amm_recovered14multi_hop_swap |
| `0x40100` | 520 | Instruction error closures | 2 | _ZN18pump_amm_recovered12instructions4swap14multi_hop_swap7amm_hop28_$u7b$$u7b$closure$u7d$$u7d$ |
| `0x40308` | 1,416 | Swap and route business | 1 | _ZN18pump_amm_recovered12instructions4swap14multi_hop_swap11program_for |
| `0x40a08` | 15,512 | Swap and route business | — | Unresolved identity |
| `0x446a0` | 520 | Instruction error closures | 1 | instructions/swap/multi_hop_swap.rs:579 |
| `0x448a8` | 520 | Instruction error closures | 1 | instructions/swap/multi_hop_swap.rs:586 |
| `0x44ab0` | 536 | Instruction error closures | 39 | _ZN18pump_amm_recovered12instructions4swap14multi_hop_swap14apply_hop_fees |
| `0x44cc8` | 520 | Instruction error closures | 1 | instructions/swap/multi_hop_swap.rs:636 |
| `0x44ed0` | 520 | Instruction error closures | 1 | instructions/swap/multi_hop_swap.rs:671 |
| `0x450d8` | 520 | Instruction error closures | 1 | instructions/swap/multi_hop_swap.rs:718 |
| `0x452e0` | 1,256 | Swap and route business | 1 | _ZN18pump_amm_recovered12instructions4swap14multi_hop_swap14vault_for_mint |
| `0x45940` | 16,912 | Swap and route business | — | Unresolved identity |
| `0x49b50` | 9,184 | Swap and route business | — | _ZN18pump_amm_recovered18pump_amm_recovered4sell |
| `0x4bf30` | 520 | Instruction error closures | 2 | instructions/swap/sell.rs:167 |
| `0x4c138` | 520 | Instruction error closures | 2 | instructions/swap/sell.rs:179 |
| `0x4c340` | 520 | Instruction error closures | 2 | instructions/swap/sell.rs:183 |
| `0x4c548` | 520 | Instruction error closures | 2 | instructions/swap/sell.rs:196 |
| `0x4c750` | 9,024 | Swap and route business | — | Unresolved identity |
| `0x4ea90` | 1,320 | Swap and route business | 2 | _ZN18pump_amm_recovered12instructions4swap4sell16validate_pool_v2 |
| `0x4efb8` | 544 | Swap and route business | 1 | _ZN18pump_amm_recovered12instructions4swap8trade_v222validate_cashback_coin |
| `0x4f1d8` | 2,280 | Swap and route business | 2 | _ZN18pump_amm_recovered12instructions4swap8trade_v230validate_buyback_token_account |
| `0x4ff18` | 1,664 | Swap and route business | 3 | _ZN18pump_amm_recovered12instructions4swap8trade_v211total_quote |
| `0x50598` | 1,808 | Swap and route business | — | _ZN18pump_amm_recovered12instructions4swap8trade_v220calculate_buy_result |
| `0x50ca8` | 600 | Swap and route business | 1 | instructions/swap/trade_v2.rs:302 |
| `0x50f00` | 2,016 | Swap and route business | — | Unresolved identity |
| `0x516e0` | 1,576 | Swap and route business | 3 | instructions/swap/trade_v2.rs:376, instructions/swap/trade_v2.rs:377, instructions/swap/trade_v2.rs:385 |
| `0x51d08` | 872 | Swap and route business | — | Unresolved identity |
| `0x52070` | 3,048 | Swap and route business | 1 | _ZN18pump_amm_recovered12instructions4swap8trade_v216create_buy_event |
| `0x53350` | 5,840 | Swap and route business | — | Unresolved identity |
| `0x54a20` | 7,112 | Swap and route business | — | Unresolved identity |
| `0x56710` | 5,904 | Swap and route business | — | Unresolved identity |
| `0x57e20` | 520 | Instruction error closures | 1 | instructions/swap/trade_v2.rs:913 |
| `0x58028` | 3,552 | Liquidity, admin and incentive business | — | Unresolved identity |
| `0x58e08` | 1,536 | Liquidity, admin and incentive business | — | Unresolved identity |
| `0x59408` | 4,456 | Liquidity, admin and incentive business | — | Unresolved identity |
| `0x5a570` | 4,168 | Liquidity, admin and incentive business | — | _ZN18pump_amm_recovered18pump_amm_recovered22claim_token_incentives |
| `0x5b5b8` | 4,056 | Liquidity, admin and incentive business | — | Unresolved identity |
| `0x5c590` | 2,816 | Liquidity, admin and incentive business | — | _ZN18pump_amm_recovered18pump_amm_recovered29close_user_volume_accumulator |
| `0x5dc20` | 2,904 | Liquidity, admin and incentive business | — | _ZN18pump_amm_recovered18pump_amm_recovered28sync_user_volume_accumulator |
| `0x61630` | 616 | State methods and serialization | 1 | state/global_config.rs:220 |
| `0x61898` | 616 | State methods and serialization | 1 | state/global_config.rs:230 |
| `0x61b00` | 616 | State methods and serialization | 1 | state/global_config.rs:243 |
| `0x61d68` | 2,336 | State methods and serialization | 2 | state/global_config.rs:256, state/global_config.rs:263 |
| `0x62688` | 1,464 | State methods and serialization | 2 | _ZN18pump_amm_recovered5state13global_config57_$LT$impl$u20$pump_amm_recovered..state..GlobalConfig$GT$24validate_boost_authority |
| `0x62c40` | 552 | State methods and serialization | 1 | _ZN18pump_amm_recovered5state13global_config57_$LT$impl$u20$pump_amm_recovered..state..GlobalConfig$GT$24set_buyback_basis_points |
| `0x62e68` | 2,320 | State methods and serialization | 3 | state/global_config.rs:336, state/global_config.rs:321, state/global_config.rs:326 |
| `0x63778` | 5,472 | State methods and serialization | 2 | _ZN18pump_amm_recovered5state13global_config57_$LT$impl$u20$pump_amm_recovered..state..GlobalConfig$GT$26set_buyback_fee_recipients |
| `0x6b780` | 744 | State methods and serialization | 1 | state/pool.rs:386 |
| `0x6ba68` | 616 | State methods and serialization | 1 | _ZN18pump_amm_recovered5state4pool49_$LT$impl$u20$pump_amm_recovered..state..Pool$GT$18total_accrued_fees |
| `0x6bcd0` | 640 | State methods and serialization | 1 | state/pool.rs:417 |
| `0x6bf50` | 760 | State methods and serialization | 1 | _ZN18pump_amm_recovered5state4pool49_$LT$impl$u20$pump_amm_recovered..state..Pool$GT$28total_virtual_quote_reserves |
| `0x6c328` | 1,088 | State methods and serialization | 2 | state/pool.rs:439, state/pool.rs:440 |
| `0x6c768` | 2,496 | State methods and serialization | 4 | state/pool.rs:462, state/pool.rs:458, state/pool.rs:465, state/pool.rs:469 |
| `0x6d128` | 736 | State methods and serialization | 1 | _ZN18pump_amm_recovered5state4pool49_$LT$impl$u20$pump_amm_recovered..state..Pool$GT$17take_accrued_fees |
| `0x6d408` | 1,816 | State methods and serialization | — | Unresolved identity |
| `0x6db20` | 6,312 | State methods and serialization | — | Unresolved identity |
| `0x6f3c8` | 232 | State methods and serialization | — | Unresolved identity |
| `0x73ef0` | 568 | Math, token and runtime helpers | — | Unresolved identity |
| `0x74128` | 1,312 | Math, token and runtime helpers | — | Unresolved identity |
| `0x74648` | 696 | Math, token and runtime helpers | 6 | _ZN18pump_amm_recovered5utils12transfer_fee13calculate_fee |
| `0x74900` | 640 | Math, token and runtime helpers | 1 | utils/transfer_fee.rs:57 |
| `0x74b80` | 688 | Math, token and runtime helpers | 6 | _ZN18pump_amm_recovered5utils12transfer_fee17amount_before_fee |
| `0x74e30` | 1,480 | Math, token and runtime helpers | — | Unresolved identity |
| `0xaf3b0` | 8,128 | Generated account validation | 2 | instructions/swap/buy.rs:133 |
| `0xb3460` | 520 | Instruction error closures | 2 | instructions/swap/buy.rs:409 |
| `0xb92c8` | 520 | Instruction error closures | 1 | instructions/swap/multi_hop_swap.rs:941 |
| `0xd44e0` | 728 | Generated account validation | 1 | state/volume_accumulator.rs:8 |
| `0xd4f90` | 728 | Generated account validation | 1 | state/volume_accumulator.rs:25 |
| `0xf28b8` | 1,192 | Math, token and runtime helpers | 149 | _ZN85_$LT$solana_program_error..ProgramError$u20$as$u20$core..convert..From$LT$u64$GT$$GT$4from |
| `0xf2d60` | 368 | Math, token and runtime helpers | 46 | _ZN11anchor_lang8accounts5boxed87_$LT$impl$u20$anchor_lang..Accounts$LT$B$GT$$u20$for$u20$alloc..boxed..Box$LT$T$GT$$GT$12try_accounts |
| `0xf2ed0` | 776 | Math, token and runtime helpers | — | Unresolved identity |
| `0xf31d8` | 664 | Math, token and runtime helpers | — | Unresolved identity |
| `0xf6eb0` | 2,664 | Math, token and runtime helpers | — | Unresolved identity |

## Verification

```sh
python3 -B work/amm-remaining-audit-latest-20261027/verify.py \
  --measurement repro/pump_amm/event-ownership-recovery-20261027/results/measurement.json.gz
```

This verifies accounting against the sealed measurement, not a new runtime execution or a fresh build. The read-only diagnostic generator is `audit.py`; it additionally reads the actual original/candidate ELF and candidate symbols from the event-quote coordinator. No canonical source files, Git refs or external state were changed by this audit.
