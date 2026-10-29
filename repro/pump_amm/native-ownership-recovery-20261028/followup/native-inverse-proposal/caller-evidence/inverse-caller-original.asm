
/Users/shawwalters/Documents/Codex/2026-10-24/pumpfun-source/work/amm-upstream-native-fee-review-20261027/clean-components/inputs/original.so:	file format elf64-sbf

Disassembly of section .text:

0000000000000120 <.text>:
   74b80: bf 16 00 00 00 00 00 00      	mov64 r6, r1
   74b88: 79 21 00 00 00 00 00 00      	ldxdw r1, [r2 + 0x0]
   74b90: 55 01 02 00 00 00 00 00      	jne r1, 0x0, +0x2 <.text+0x74a88>
   74b98: 7b 36 08 00 00 00 00 00      	stxdw [r6 + 0x8], r3
   74ba0: 05 00 0f 00 00 00 00 00      	ja +0xf <.text+0x74b00>
   74ba8: 79 21 18 00 00 00 00 00      	ldxdw r1, [r2 + 0x18]
   74bb0: 7b 1a e8 fe 00 00 00 00      	stxdw [r10 - 0x118], r1
   74bb8: 79 21 10 00 00 00 00 00      	ldxdw r1, [r2 + 0x10]
   74bc0: 7b 1a e0 fe 00 00 00 00      	stxdw [r10 - 0x120], r1
   74bc8: 79 21 08 00 00 00 00 00      	ldxdw r1, [r2 + 0x8]
   74bd0: 7b 1a d8 fe 00 00 00 00      	stxdw [r10 - 0x128], r1
   74bd8: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   74be0: 07 01 00 00 c8 fe ff ff      	add64 r1, -0x138
   74be8: bf a2 00 00 00 00 00 00      	mov64 r2, r10
   74bf0: 07 02 00 00 d8 fe ff ff      	add64 r2, -0x128
   74bf8: 85 10 00 00 5a fc 00 00      	call 0xfc5a
   74c00: 79 a1 c8 fe 00 00 00 00      	ldxdw r1, [r10 - 0x138]
