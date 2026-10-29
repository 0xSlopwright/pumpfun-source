# Independent remaining AMM audit: ea14

The selected combined candidate has **658/785 normalized original windows (83.8217%)**, **148/785 raw-identical windows (18.8535%)**, and **127 unmatched windows (16.1783%)**. Matching text covers **830,032/1,162,040 bytes (71.4289%)**; 332,008 text bytes remain unmatched. These are bounded measurement denominators, not an estimate of perfect reconstruction. Whole-ELF identity remains false.

Relative to the retained 9278 baseline, exactly two windows gain a strict normalized match and none are lost: prepare_pool at 0x58028 (3,552 bytes) and native calculate_fee at 0xf2d60 (368 bytes). Their actual direct callees also match: 9/9 and 2/2 respectively. The private native crate reconstructs an observed type/layout/call boundary; historical package provenance remains unknown.

The complete 127-row ledger is `remaining-audit.json`. Every original unmatched window appears once. **78 windows (82,088 bytes)** have at least one same-sized candidate with the same relocation pattern and differences confined to recognized typed Source line/length immediates. **49 windows (249,920 bytes)** retain other code or shape differences: eight same-sized candidates and 41 without a same-size/relocation candidate. A Source-only candidate is diagnostic, not proof of semantic ownership or full transitive equivalence. Recognized fields and competing candidates are included per row.

| Remaining domain | Windows | Bytes | Typed Source-only candidates | Other code / shape |
| --- | ---: | ---: | ---: | ---: |
| generated_account_validation | 3 | 9584 | 3 | 0 |
| instruction_error_closures | 35 | 18216 | 33 | 2 |
| liquidity_admin_incentive_business | 27 | 132208 | 7 | 20 |
| math_token_and_runtime_helpers | 20 | 20144 | 9 | 11 |
| state_methods_and_serialization | 18 | 29432 | 15 | 3 |
| swap_and_route_business | 24 | 122424 | 11 | 13 |

Source owner evidence is separate from a matching symbol name. `source-origins.json` binds selected source bytes and definitions for the two gains and three code-restored but Source-unmatched helpers. Original filenames come only from typed Source records. Unpadded quote_for_base differs at two Source stores; validate_protocol_fee_recipient and the value-copy fee caller each differ at one. No line padding is proposed.

## Highest-value code work

- The inverse-fee pair has the clearest local hypothesis. Original amount_before_fee at 0x74b80 copies three complete 64-bit payload words to a local 24-byte value. The selected code converts to packed 18-byte SPL representation, producing five different load/store instructions plus a Source line. Its original callee is the unmatched native inverse primitive at 0xf2ed0 (776 bytes). The math lane owns primitive reconstruction; this audit supplied caller ownership evidence.
- from_mint at 0x74128 (1,312 bytes) remains a contextual shape gap. Its upstream match uses a separately forced decoder boundary that was not imported. Decoder 0xf31d8 (664 bytes) still needs original-backed ownership and representation evidence.
- Deposit at 0x2fb38 retains the original 7,128-byte size and has six differing instructions, including Source coordinates and the retained two-load-order residual. Withdraw retains a body-size gap. Tested borrowed-context and provided-token-program corrections remain in source.
- Route closure 0x40100 has error6044 (NotEnoughRemainingAccounts), whereas the nearest same-shape current closure has error6023 (Overflow). This is not only line metadata. Its sole original caller is 0x3e878, where a byte-sized option discriminant2 selects the error path. Ownership must be traced before choosing a source edit.
- Major trade, route, creator, cashback, admin and incentive gaps are enumerated below. Exact-size heuristics do not justify source changes. Known incentive and CTO semantic fixes remain required even when their bodies do not gain exact windows.

## All 49 code and shape gaps

| Original | Bytes | Domain | Nearest candidate evidence |
| --- | ---: | --- | --- |
| 0x2288 | 232 | math_token_and_runtime_helpers | 29 differing instructions; candidate identity is a hypothesis |
| 0xc5d0 | 1240 | math_token_and_runtime_helpers | No same-size and relocation candidate |
| 0xfb08 | 704 | math_token_and_runtime_helpers | No same-size and relocation candidate |
| 0x13458 | 2264 | math_token_and_runtime_helpers | No same-size and relocation candidate |
| 0x14088 | 1656 | math_token_and_runtime_helpers | No same-size and relocation candidate |
| 0x14920 | 6152 | liquidity_admin_incentive_business | No same-size and relocation candidate |
| 0x16128 | 3168 | liquidity_admin_incentive_business | No same-size and relocation candidate |
| 0x19138 | 9176 | liquidity_admin_incentive_business | No same-size and relocation candidate |
| 0x1c890 | 1344 | liquidity_admin_incentive_business | 51 differing instructions; candidate identity is a hypothesis |
| 0x1ef90 | 3912 | liquidity_admin_incentive_business | No same-size and relocation candidate |
| 0x1fed8 | 11688 | liquidity_admin_incentive_business | No same-size and relocation candidate |
| 0x22e88 | 4024 | liquidity_admin_incentive_business | 102 differing instructions; candidate identity is a hypothesis |
| 0x23e40 | 4504 | liquidity_admin_incentive_business | No same-size and relocation candidate |
| 0x24fd8 | 7632 | liquidity_admin_incentive_business | No same-size and relocation candidate |
| 0x26da8 | 8232 | liquidity_admin_incentive_business | No same-size and relocation candidate |
| 0x28dd0 | 11024 | liquidity_admin_incentive_business | No same-size and relocation candidate |
| 0x2ba60 | 10240 | liquidity_admin_incentive_business | No same-size and relocation candidate |
| 0x2e720 | 5144 | liquidity_admin_incentive_business | No same-size and relocation candidate |
| 0x2fb38 | 7128 | liquidity_admin_incentive_business | 6 differing instructions; candidate identity is a hypothesis |
| 0x32750 | 7200 | liquidity_admin_incentive_business | No same-size and relocation candidate |
| 0x351a8 | 8104 | liquidity_admin_incentive_business | No same-size and relocation candidate |
| 0x376b0 | 9936 | swap_and_route_business | No same-size and relocation candidate |
| 0x3a5a0 | 12936 | swap_and_route_business | No same-size and relocation candidate |
| 0x3dbc0 | 9536 | swap_and_route_business | No same-size and relocation candidate |
| 0x40100 | 520 | instruction_error_closures | 2 differing instructions; candidate identity is a hypothesis |
| 0x40a08 | 15512 | swap_and_route_business | No same-size and relocation candidate |
| 0x44ab0 | 536 | instruction_error_closures | 39 differing instructions; candidate identity is a hypothesis |
| 0x45940 | 16912 | swap_and_route_business | No same-size and relocation candidate |
| 0x49b50 | 9184 | swap_and_route_business | No same-size and relocation candidate |
| 0x4c750 | 9024 | swap_and_route_business | No same-size and relocation candidate |
| 0x50598 | 1808 | swap_and_route_business | No same-size and relocation candidate |
| 0x50f00 | 2016 | swap_and_route_business | No same-size and relocation candidate |
| 0x51d08 | 872 | swap_and_route_business | No same-size and relocation candidate |
| 0x53350 | 5840 | swap_and_route_business | No same-size and relocation candidate |
| 0x54a20 | 7112 | swap_and_route_business | No same-size and relocation candidate |
| 0x56710 | 5904 | swap_and_route_business | No same-size and relocation candidate |
| 0x5a570 | 4168 | liquidity_admin_incentive_business | No same-size and relocation candidate |
| 0x5b5b8 | 4056 | liquidity_admin_incentive_business | No same-size and relocation candidate |
| 0x5c590 | 2816 | liquidity_admin_incentive_business | No same-size and relocation candidate |
| 0x5dc20 | 2904 | liquidity_admin_incentive_business | No same-size and relocation candidate |
| 0x6d408 | 1816 | state_methods_and_serialization | No same-size and relocation candidate |
| 0x6db20 | 6312 | state_methods_and_serialization | No same-size and relocation candidate |
| 0x6f3c8 | 232 | state_methods_and_serialization | No same-size and relocation candidate |
| 0x73ef0 | 568 | math_token_and_runtime_helpers | No same-size and relocation candidate |
| 0x74128 | 1312 | math_token_and_runtime_helpers | No same-size and relocation candidate |
| 0x74b80 | 688 | math_token_and_runtime_helpers | 6 differing instructions; candidate identity is a hypothesis |
| 0xf28b8 | 1192 | math_token_and_runtime_helpers | 149 differing instructions; candidate identity is a hypothesis |
| 0xf2ed0 | 776 | math_token_and_runtime_helpers | No same-size and relocation candidate |
| 0xf31d8 | 664 | math_token_and_runtime_helpers | No same-size and relocation candidate |

## Reproduction and limits

`python -I -B verify.py` recomputes the complete census, gained/lost set, residual classification, typed Source fields, domain counts, matched callee hints and both gained roots' actual callees. It compares every window with the independently retained canonical measurement. API: `verify(root=None)`; paths derive from the script location.

The packet binds 57 selected workspace source files to the recorded 232-input build. The 175 external inputs and dependency cache are recorded by hash but their bytes are not independently re-audited here; the integration dependency proof owns that gate. No compiler or VM runs in this audit. The saved build result is provenance evidence, not a new build. Runtime acceptance belongs to the selected-candidate receipts.

Historical module names, all indirect targets, full data-reference closure, all possible runtime inputs and whole-program byte identity remain unproven. Upstream 732/733 candidates are comparison material only because the independently executed 732 incentive corpus reproduced128 regressions. No upstream runtime receipt is relabeled as selected-candidate execution.
