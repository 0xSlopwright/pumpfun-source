
evidence/original/pump_amm/deployed.so:	file format elf64-sbf

Disassembly of section .text:

0000000000000120 <.text>:
   1a850: 7a 0a 58 fe 00 00 00 00      	stdw [r10 - 0x1a8], 0x0
   1a858: 7a 0a 60 fe 00 00 00 00      	stdw [r10 - 0x1a0], 0x0
   1a860: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   1a868: 07 01 00 00 50 fc ff ff      	add64 r1, -0x3b0
   1a870: bf a4 00 00 00 00 00 00      	mov64 r4, r10
   1a878: 07 04 00 00 28 fe ff ff      	add64 r4, -0x1d8
   1a880: 85 10 00 00 29 d1 01 00      	call 0x1d129
   1a888: 79 a7 58 fc 00 00 00 00      	ldxdw r7, [r10 - 0x3a8]
   1a890: 79 a8 50 fc 00 00 00 00      	ldxdw r8, [r10 - 0x3b0]
   1a898: 79 a6 28 fc 00 00 00 00      	ldxdw r6, [r10 - 0x3d8]
   1a8a0: 05 00 cd ff 00 00 00 00      	ja -0x33 <.text+0x1a5f0>
   1a8a8: 79 a2 38 fe 00 00 00 00      	ldxdw r2, [r10 - 0x1c8]
   1a8b0: 7b 2a 38 fe 00 00 00 00      	stxdw [r10 - 0x1c8], r2
   1a8b8: 7b 3a 30 fe 00 00 00 00      	stxdw [r10 - 0x1d0], r3
   1a8c0: 7b 1a 28 fe 00 00 00 00      	stxdw [r10 - 0x1d8], r1
   1a8c8: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   1a8d0: 07 01 00 00 b0 fc ff ff      	add64 r1, -0x350
   1a8d8: bf a2 00 00 00 00 00 00      	mov64 r2, r10
   1a8e0: 07 02 00 00 28 fe ff ff      	add64 r2, -0x1d8
   1a8e8: 85 10 00 00 ea d0 01 00      	call 0x1d0ea
   1a8f0: 79 a7 b8 fc 00 00 00 00      	ldxdw r7, [r10 - 0x348]
   1a8f8: 79 a8 b0 fc 00 00 00 00      	ldxdw r8, [r10 - 0x350]
   1a900: 79 a6 28 fc 00 00 00 00      	ldxdw r6, [r10 - 0x3d8]
   1a908: 05 00 c0 ff 00 00 00 00      	ja -0x40 <.text+0x1a5f0>
   1a910: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   1a918: 07 01 00 00 a0 fc ff ff      	add64 r1, -0x360
   1a920: b7 02 00 00 d5 07 00 00      	mov64 r2, 0x7d5
   1a928: 85 10 00 00 a1 d6 01 00      	call 0x1d6a1
   1a930: 79 a7 a8 fc 00 00 00 00      	ldxdw r7, [r10 - 0x358]
   1a938: 79 a8 a0 fc 00 00 00 00      	ldxdw r8, [r10 - 0x360]
   1a940: 18 01 00 00 90 23 12 00 00 00 00 00 00 00 00 00      	lddw r1, 0x122390
   1a950: 7b 1a 28 fe 00 00 00 00      	stxdw [r10 - 0x1d8], r1
   1a958: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   1a960: 07 01 00 00 30 ff ff ff      	add64 r1, -0xd0
   1a968: 7b 1a 38 fe 00 00 00 00      	stxdw [r10 - 0x1c8], r1
   1a970: 18 01 00 00 38 94 11 00 00 00 00 00 00 00 00 00      	lddw r1, 0x119438
   1a980: 7b 1a 38 ff 00 00 00 00      	stxdw [r10 - 0xc8], r1
   1a988: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   1a990: 07 01 00 00 c8 ff ff ff      	add64 r1, -0x38
   1a998: 7b 1a 30 ff 00 00 00 00      	stxdw [r10 - 0xd0], r1
   1a9a0: 7a 0a 48 fe 00 00 00 00      	stdw [r10 - 0x1b8], 0x0
   1a9a8: 7a 0a 30 fe 02 00 00 00      	stdw [r10 - 0x1d0], 0x2
   1a9b0: 7a 0a 40 fe 01 00 00 00      	stdw [r10 - 0x1c0], 0x1
   1a9b8: bf a9 00 00 00 00 00 00      	mov64 r9, r10
   1a9c0: 07 09 00 00 10 fe ff ff      	add64 r9, -0x1f0
   1a9c8: bf a2 00 00 00 00 00 00      	mov64 r2, r10
   1a9d0: 07 02 00 00 28 fe ff ff      	add64 r2, -0x1d8
   1a9d8: bf 91 00 00 00 00 00 00      	mov64 r1, r9
   1a9e0: 85 10 00 00 b8 e0 ff ff      	call -0x1f48
   1a9e8: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   1a9f0: 07 01 00 00 90 fc ff ff      	add64 r1, -0x370
   1a9f8: bf 82 00 00 00 00 00 00      	mov64 r2, r8
   1aa00: bf 73 00 00 00 00 00 00      	mov64 r3, r7
   1aa08: bf 94 00 00 00 00 00 00      	mov64 r4, r9
   1aa10: 85 10 00 00 0e cf ff ff      	call -0x30f2
   1aa18: 79 a7 98 fc 00 00 00 00      	ldxdw r7, [r10 - 0x368]
   1aa20: 79 a8 90 fc 00 00 00 00      	ldxdw r8, [r10 - 0x370]
   1aa28: 79 a6 28 fc 00 00 00 00      	ldxdw r6, [r10 - 0x3d8]
   1aa30: 05 00 9b ff 00 00 00 00      	ja -0x65 <.text+0x1a5f0>
   1aa38: 79 a1 20 fc 00 00 00 00      	ldxdw r1, [r10 - 0x3e0]
   1aa40: 07 01 00 00 d0 02 00 00      	add64 r1, 0x2d0
   1aa48: 79 a9 58 ff 00 00 00 00      	ldxdw r9, [r10 - 0xa8]
   1aa50: 79 12 00 00 00 00 00 00      	ldxdw r2, [r1 + 0x0]
   1aa58: 7b 2a 28 fe 00 00 00 00      	stxdw [r10 - 0x1d8], r2
   1aa60: 79 12 08 00 00 00 00 00      	ldxdw r2, [r1 + 0x8]
   1aa68: 7b 2a 30 fe 00 00 00 00      	stxdw [r10 - 0x1d0], r2
   1aa70: 79 12 10 00 00 00 00 00      	ldxdw r2, [r1 + 0x10]
   1aa78: 7b 2a 38 fe 00 00 00 00      	stxdw [r10 - 0x1c8], r2
   1aa80: 79 11 18 00 00 00 00 00      	ldxdw r1, [r1 + 0x18]
   1aa88: 7b 1a 40 fe 00 00 00 00      	stxdw [r10 - 0x1c0], r1
   1aa90: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   1aa98: 07 01 00 00 48 fe ff ff      	add64 r1, -0x1b8
   1aaa0: 7b 1a 10 fc 00 00 00 00      	stxdw [r10 - 0x3f0], r1
   1aaa8: bf 82 00 00 00 00 00 00      	mov64 r2, r8
   1aab0: b7 03 00 00 e0 00 00 00      	mov64 r3, 0xe0
   1aab8: 85 10 00 00 bb fd 01 00      	call 0x1fdbb
   1aac0: 7b 9a 28 ff 00 00 00 00      	stxdw [r10 - 0xd8], r9
   1aac8: 18 01 00 00 00 00 00 00 00 00 00 00 03 00 00 00      	lddw r1, 0x300000000
   1aad8: 79 12 00 00 00 00 00 00      	ldxdw r2, [r1 + 0x0]
   1aae0: b7 03 00 00 00 00 00 00      	mov64 r3, 0x0
   1aae8: b7 04 00 00 01 00 00 00      	mov64 r4, 0x1
   1aaf0: bf 21 00 00 00 00 00 00      	mov64 r1, r2
   1aaf8: 07 01 00 00 00 ff ff ff      	add64 r1, -0x100
   1ab00: 2d 21 01 00 00 00 00 00      	jgt r1, r2, +0x1 <.text+0x1a9f0>
   1ab08: b7 04 00 00 00 00 00 00      	mov64 r4, 0x0
   1ab10: 55 04 01 00 00 00 00 00      	jne r4, 0x0, +0x1 <.text+0x1aa00>
   1ab18: bf 13 00 00 00 00 00 00      	mov64 r3, r1
   1ab20: 18 01 00 00 00 7f 00 00 00 00 00 00 03 00 00 00      	lddw r1, 0x300007f00
   1ab30: 15 02 01 00 00 00 00 00      	jeq r2, 0x0, +0x1 <.text+0x1aa20>
   1ab38: bf 31 00 00 00 00 00 00      	mov64 r1, r3
   1ab40: 18 02 00 00 07 00 00 00 00 00 00 00 03 00 00 00      	lddw r2, 0x300000007
   1ab50: 2d 21 01 00 00 00 00 00      	jgt r1, r2, +0x1 <.text+0x1aa40>
   1ab58: 05 00 48 00 00 00 00 00      	ja +0x48 <.text+0x1ac80>
   1ab60: 18 02 00 00 00 00 00 00 00 00 00 00 03 00 00 00      	lddw r2, 0x300000000
   1ab70: 7b 12 00 00 00 00 00 00      	stxdw [r2 + 0x0], r1
   1ab78: 7b 1a 38 ff 00 00 00 00      	stxdw [r10 - 0xc8], r1
   1ab80: 7a 0a 30 ff 00 01 00 00      	stdw [r10 - 0xd0], 0x100
   1ab88: 7b 91 08 00 00 00 00 00      	stxdw [r1 + 0x8], r9
   1ab90: 18 02 00 00 2b bc fa 12 00 00 00 00 dd 4b bb 5f      	lddw r2, 0x5fbb4bdd12fabc2b
