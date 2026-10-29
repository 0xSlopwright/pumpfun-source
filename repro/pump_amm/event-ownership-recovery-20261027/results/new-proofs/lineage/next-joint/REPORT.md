# Optional-field, creator and V2 Context recovery

Candidate `97bd5553c199cd24fb2d07034c365527bee5b138bf5dd7a0aa3099186aad2643` composes three source changes onto the selected H7 candidate `0881a95d`: non-consuming short OptionalU64 decoding, typed creator payout/CPI result propagation, and the refined public V2 module/Context layout. The original component and V2-only layer evidence remain separate; no excluded legacy arithmetic or event-input experiment is included.

The candidate matches **651/785 normalized windows**, **148 raw windows**, and **816,800 original text bytes**, with no losses. Four complete wrappers are gained relative to H7: CreatePool (`0xe31a0`, 3,064 bytes) and the three V2 wrappers (`0xe8ae8`, `0xe8f10`, `0xe9338`, each 1,064 bytes). The 40-byte Context and preview layout are restored. Actual operand checks verify 25 exact immediate targets, six text descriptors and two formatter code pointers; four business-handler callees remain unequal. Full ELF identity is false.

Two strict builds produce identical stripped and unstripped artifacts. Both bind 227 source inputs and 762 unchanged dependency artifacts. The direct parent-to-next source patch is `recovery.patch`; the earlier V2-only layer is preserved in `v2-layer.patch` and its composition record.

Current signed runtime evidence includes 17,462 core cases, 65 V2 event/context/executor cases, 572 optional-bool cases, 375 creator/rent cases, 19 CTO cases, 1,616 legacy cases, and all 264 OptionalU64 short-tail cases. These intentionally overlap. There are 40,896 transaction executions and 41,278 verified signature fields across the stored runs. All compared results pass, including normalized full logs in the short-tail matrix. The 123 counterexamples on H7—91 different errors and 32 rejected original successes—are all fixed; their original outputs and sealed negative packet are preserved.

The rent matrix includes synthetic high-Rent values and does not assert a default-network-Rent discrepancy. The OptionalU64 guarantee is the instruction entrypoint's slice behavior; arbitrary custom Read implementations and historical source text remain unproved. No live-chain transaction was submitted, and no exhaustive or recursive whole-program equivalence is claimed.

`python3 -B packet/verify_packet.py` verifies the sealed source, two builds, static operands, and saved signed observations offline, then emits one JSON result.
