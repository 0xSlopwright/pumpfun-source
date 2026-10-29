
/Users/shawwalters/Documents/Codex/2026-10-24/pumpfun-source/work/amm-upstream-native-fee-review-20261027/artifacts/candidate-candidate.so:	file format elf64-sbf

Disassembly of section .text:

0000000000000120 <.text>:
   2a3a0: bf 16 00 00 00 00 00 00      	mov64 r6, r1
   2a3a8: 79 21 00 00 00 00 00 00      	ldxdw r1, [r2 + 0x0]
   2a3b0: 55 01 02 00 00 00 00 00      	jne r1, 0x0, +0x2 <.text+0x2a2a8>
   2a3b8: 7b 36 08 00 00 00 00 00      	stxdw [r6 + 0x8], r3
   2a3c0: 05 00 0f 00 00 00 00 00      	ja +0xf <.text+0x2a320>
   2a3c8: 79 21 08 00 00 00 00 00      	ldxdw r1, [r2 + 0x8]
   2a3d0: 79 24 10 00 00 00 00 00      	ldxdw r4, [r2 + 0x10]
   2a3d8: 69 22 18 00 00 00 00 00      	ldxh r2, [r2 + 0x18]
   2a3e0: 6b 2a e8 fe 00 00 00 00      	stxh [r10 - 0x118], r2
   2a3e8: 7b 4a e0 fe 00 00 00 00      	stxdw [r10 - 0x120], r4
   2a3f0: 7b 1a d8 fe 00 00 00 00      	stxdw [r10 - 0x128], r1
   2a3f8: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   2a400: 07 01 00 00 c8 fe ff ff      	add64 r1, -0x138
   2a408: bf a2 00 00 00 00 00 00      	mov64 r2, r10
   2a410: 07 02 00 00 d8 fe ff ff      	add64 r2, -0x128
   2a418: 85 10 00 00 2a b7 01 00      	call 0x1b72a
   2a420: 79 a1 c8 fe 00 00 00 00      	ldxdw r1, [r10 - 0x138]
