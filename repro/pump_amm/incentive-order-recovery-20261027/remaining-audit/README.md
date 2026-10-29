# Independent remaining-window audit

Candidate `c20007e860f47db1cc443344605afafe505d61bb4de6d61306fa164db3482544` retains **656/785 normalized windows (83.5669%)**, **148 raw windows (18.8535%)**, and **826,112/1,162,040 matching normalized text bytes (71.0915%)**. The remaining **129 windows (16.4331%)** cover **335,928 text bytes (28.9085%)**. These are explicit binary-window metrics, not a whole-project completion percentage.

Every unmatched original window appears exactly once in [remaining-audit.json](remaining-audit.json). Domain assignments route future work; nearest same-size/relocation alternatives are diagnostic and are not equivalence proofs. Seventy-four windows have a same-size, same-relocation alternative within one to three differing normalized instructions.

| Domain | Windows | Original text bytes |
|---|---:|---:|
| math_token_and_runtime_helpers | 21 | 20,512 |
| liquidity_admin_incentive_business | 28 | 135,760 |
| instruction_error_closures | 35 | 18,216 |
| swap_and_route_business | 24 | 122,424 |
| state_methods_and_serialization | 18 | 29,432 |
| generated_account_validation | 3 | 9,584 |

The 21 math/token/runtime rows carry an additional `current_identity` record. That record supersedes historical source hints, especially **0x2288 = `anchor_lang::error::Error::with_account_name<String>`**, whose attribute-free owned-String micro-object is exact while the caller/link boundary remains open. This corroborates the admin-state evidence; it does not close the original window. The linked source map is sealed in [identity-map/link.json](../results/new-proofs/lineage/independent-range/identity-map/link.json).

| Original | Bytes | Domain | Current identity when independently mapped |
|---|---:|---|---|
| `0x2288` | 232 | math_token_and_runtime_helpers | anchor_lang::error::Error::with_account_name<String> |
| `0xc5d0` | 1240 | math_token_and_runtime_helpers | BorshSerialize for [Pubkey;7] into Vec<u8> |
| `0xfb08` | 704 | math_token_and_runtime_helpers | Vec<u8>::from_iter for curve-hop Range::map fee flags |
| `0x119c8` | 1192 | math_token_and_runtime_helpers | constant-product quote required for exact base output |
| `0x11e70` | 1184 | math_token_and_runtime_helpers | constant-product quote for gross base input |
| `0x123a0` | 1184 | math_token_and_runtime_helpers | same constant-product formula used by inverse/exact-quote path |
| `0x12840` | 712 | math_token_and_runtime_helpers | liquidity floor ratio |
| `0x12b08` | 1672 | math_token_and_runtime_helpers | checked u128 ceil division |
| `0x13190` | 712 | math_token_and_runtime_helpers | AMM basis-point fee helper |
| `0x13458` | 2264 | math_token_and_runtime_helpers | legacy external fee CPI selector and application |
| `0x13d30` | 856 | math_token_and_runtime_helpers | fee tier selection |
| `0x14088` | 1656 | math_token_and_runtime_helpers | V2 in-program fee selector and application |
| `0x14920` | 6152 | liquidity_admin_incentive_business |  |
| `0x16128` | 3168 | liquidity_admin_incentive_business |  |
| `0x19138` | 9176 | liquidity_admin_incentive_business |  |
| `0x1b510` | 688 | liquidity_admin_incentive_business |  |
| `0x1b7c0` | 832 | liquidity_admin_incentive_business |  |
| `0x1bb00` | 688 | liquidity_admin_incentive_business |  |
| `0x1c890` | 1344 | liquidity_admin_incentive_business |  |
| `0x1ecd8` | 696 | liquidity_admin_incentive_business |  |
| `0x1ef90` | 3912 | liquidity_admin_incentive_business |  |
| `0x1fed8` | 11688 | liquidity_admin_incentive_business |  |
| `0x22c80` | 520 | instruction_error_closures |  |
| `0x22e88` | 4024 | liquidity_admin_incentive_business |  |
| `0x23e40` | 4504 | liquidity_admin_incentive_business |  |
| `0x24fd8` | 7632 | liquidity_admin_incentive_business |  |
| `0x26da8` | 8232 | liquidity_admin_incentive_business |  |
| `0x28dd0` | 11024 | liquidity_admin_incentive_business |  |
| `0x2ba60` | 10240 | liquidity_admin_incentive_business |  |
| `0x2e260` | 520 | instruction_error_closures |  |
| `0x2e468` | 696 | liquidity_admin_incentive_business |  |
| `0x2e720` | 5144 | liquidity_admin_incentive_business |  |
| `0x2fb38` | 7128 | liquidity_admin_incentive_business |  |
| `0x31710` | 520 | instruction_error_closures |  |
| `0x31918` | 520 | instruction_error_closures |  |
| `0x31b20` | 520 | instruction_error_closures |  |
| `0x31d28` | 520 | instruction_error_closures |  |
| `0x31f30` | 520 | instruction_error_closures |  |
| `0x32138` | 520 | instruction_error_closures |  |
| `0x32340` | 520 | instruction_error_closures |  |
| `0x32548` | 520 | instruction_error_closures |  |
| `0x32750` | 7200 | liquidity_admin_incentive_business |  |
| `0x34370` | 520 | instruction_error_closures |  |
| `0x34578` | 520 | instruction_error_closures |  |
| `0x34780` | 520 | instruction_error_closures |  |
| `0x34988` | 520 | instruction_error_closures |  |
| `0x34b90` | 520 | instruction_error_closures |  |
| `0x34d98` | 520 | instruction_error_closures |  |
| `0x34fa0` | 520 | instruction_error_closures |  |
| `0x351a8` | 8104 | liquidity_admin_incentive_business |  |
| `0x37150` | 1376 | swap_and_route_business |  |
| `0x376b0` | 9936 | swap_and_route_business |  |
| `0x39d80` | 520 | instruction_error_closures |  |
| `0x39f88` | 520 | instruction_error_closures |  |
| `0x3a190` | 520 | instruction_error_closures |  |
| `0x3a398` | 520 | instruction_error_closures |  |
| `0x3a5a0` | 12936 | swap_and_route_business |  |
| `0x3d8d0` | 752 | swap_and_route_business |  |
| `0x3dbc0` | 9536 | swap_and_route_business |  |
| `0x40100` | 520 | instruction_error_closures |  |
| `0x40308` | 1416 | swap_and_route_business |  |
| `0x40a08` | 15512 | swap_and_route_business |  |
| `0x446a0` | 520 | instruction_error_closures |  |
| `0x448a8` | 520 | instruction_error_closures |  |
| `0x44ab0` | 536 | instruction_error_closures |  |
| `0x44cc8` | 520 | instruction_error_closures |  |
| `0x44ed0` | 520 | instruction_error_closures |  |
| `0x450d8` | 520 | instruction_error_closures |  |
| `0x452e0` | 1256 | swap_and_route_business |  |
| `0x45940` | 16912 | swap_and_route_business |  |
| `0x49b50` | 9184 | swap_and_route_business |  |
| `0x4bf30` | 520 | instruction_error_closures |  |
| `0x4c138` | 520 | instruction_error_closures |  |
| `0x4c340` | 520 | instruction_error_closures |  |
| `0x4c548` | 520 | instruction_error_closures |  |
| `0x4c750` | 9024 | swap_and_route_business |  |
| `0x4ea90` | 1320 | swap_and_route_business |  |
| `0x4efb8` | 544 | swap_and_route_business |  |
| `0x4f1d8` | 2280 | swap_and_route_business |  |
| `0x4ff18` | 1664 | swap_and_route_business |  |
| `0x50598` | 1808 | swap_and_route_business |  |
| `0x50ca8` | 600 | swap_and_route_business |  |
| `0x50f00` | 2016 | swap_and_route_business |  |
| `0x516e0` | 1576 | swap_and_route_business |  |
| `0x51d08` | 872 | swap_and_route_business |  |
| `0x52070` | 3048 | swap_and_route_business |  |
| `0x53350` | 5840 | swap_and_route_business |  |
| `0x54a20` | 7112 | swap_and_route_business |  |
| `0x56710` | 5904 | swap_and_route_business |  |
| `0x57e20` | 520 | instruction_error_closures |  |
| `0x58028` | 3552 | liquidity_admin_incentive_business |  |
| `0x58e08` | 1536 | liquidity_admin_incentive_business |  |
| `0x59408` | 4456 | liquidity_admin_incentive_business |  |
| `0x5a570` | 4168 | liquidity_admin_incentive_business |  |
| `0x5b5b8` | 4056 | liquidity_admin_incentive_business |  |
| `0x5c590` | 2816 | liquidity_admin_incentive_business |  |
| `0x5dc20` | 2904 | liquidity_admin_incentive_business |  |
| `0x61630` | 616 | state_methods_and_serialization |  |
| `0x61898` | 616 | state_methods_and_serialization |  |
| `0x61b00` | 616 | state_methods_and_serialization |  |
| `0x61d68` | 2336 | state_methods_and_serialization |  |
| `0x62688` | 1464 | state_methods_and_serialization |  |
| `0x62c40` | 552 | state_methods_and_serialization |  |
| `0x62e68` | 2320 | state_methods_and_serialization |  |
| `0x63778` | 5472 | state_methods_and_serialization |  |
| `0x6b780` | 744 | state_methods_and_serialization |  |
| `0x6ba68` | 616 | state_methods_and_serialization |  |
| `0x6bcd0` | 640 | state_methods_and_serialization |  |
| `0x6bf50` | 760 | state_methods_and_serialization |  |
| `0x6c328` | 1088 | state_methods_and_serialization |  |
| `0x6c768` | 2496 | state_methods_and_serialization |  |
| `0x6d128` | 736 | state_methods_and_serialization |  |
| `0x6d408` | 1816 | state_methods_and_serialization |  |
| `0x6db20` | 6312 | state_methods_and_serialization |  |
| `0x6f3c8` | 232 | state_methods_and_serialization |  |
| `0x73ef0` | 568 | math_token_and_runtime_helpers | supported-mint AccountInfo wrapper |
| `0x74128` | 1312 | math_token_and_runtime_helpers | mint transfer-fee loader and epoch selector |
| `0x74648` | 696 | math_token_and_runtime_helpers | optional native transfer-fee calculation wrapper |
| `0x74900` | 640 | math_token_and_runtime_helpers | gross amount minus transfer fee |
| `0x74b80` | 688 | math_token_and_runtime_helpers | optional native pre-fee gross amount wrapper |
| `0xaf3b0` | 8128 | generated_account_validation |  |
| `0xb3460` | 520 | instruction_error_closures |  |
| `0xb92c8` | 520 | instruction_error_closures |  |
| `0xd44e0` | 728 | generated_account_validation |  |
| `0xd4f90` | 728 | generated_account_validation |  |
| `0xf28b8` | 1192 | math_token_and_runtime_helpers | supported Token2022 mint TLV policy scanner |
| `0xf2d60` | 368 | math_token_and_runtime_helpers | native24-byte transfer-fee calculate_fee |
| `0xf2ed0` | 776 | math_token_and_runtime_helpers | native24-byte transfer-fee calculate_pre_fee_amount |
| `0xf31d8` | 664 | math_token_and_runtime_helpers | owned optional older/newer native fee-pair TLV decoder |
