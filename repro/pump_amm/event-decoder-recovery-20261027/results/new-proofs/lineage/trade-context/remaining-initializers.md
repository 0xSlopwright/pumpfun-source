# Remaining initializer organization evidence

Four of the seven bound initializer helpers are now verified in earlier packets: CreateConfig 0x82630/5896 and InitUser 0xd1290/7824 in amm-initializer-origin-20261027, then CreatePool 0x9e3b0/7352 and 0xa0068/7528 in amm-create-pool-module-20261027. These are normalized window gains, not historical source text or full-ELF proof.

TradeV2 initializer 0xbd3b0/8128 is the current private module candidate. Original source record is instructions/swap/trade_v2.rs:31; actual later helper diagnostics begin at 103. The candidate groups the real context, program marker and fee aliases/IDs ahead of existing quote/event helpers. It is not a published or verified gain until the complete measurement and focused suite pass.

LegacyBuy initializer 0xaf3b0/8128 records instructions/swap/buy.rs:133. Original executable windows 0x351a8/8104 and 0x37150/1376 contain buy.rs diagnostic lines44–121, before that derive; later windows contain lines317+. A faithful organization likely needs the early buy calculation helpers before the context. A long import header or unrelated event move chosen only to hit 133 is not supported by this evidence.

MultiHop initializer 0xb5a90/8128 records instructions/swap/multi_hop_swap.rs:68. Later executable diagnostics include 239,251–389,414 and onward. The original early module items are not yet identified. The current module's marker/AmmHop context/helpers are real items available for cohesive organization, but the exact arrangement at 68 has not been established.

The three remaining initializer bodies and relocation patterns previously agreed after masking only their typed Source filename-length and line stores; actual pairings were bound by matching parent call offsets. That limits the identified mismatch to these source-descriptor stores inside each helper, without proving data, transitive callees, historical source or whole-program behavior. No dummy declarations or blank padding are justified.
