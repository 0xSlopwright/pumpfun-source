
evidence/original/pump_amm/deployed.so:	file format elf64-sbf

Disassembly of section .text:

0000000000000120 <.text>:
   2bde0: 77 02 00 00 20 00 00 00      	rsh64 r2, 0x20
   2bde8: 15 02 5f 00 00 00 00 00      	jeq r2, 0x0, +0x5f <.text+0x2bfc8>
   2bdf0: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   2bdf8: 07 01 00 00 d8 ff ff ff      	add64 r1, -0x28
   2be00: 18 02 00 00 7c bf 11 00 00 00 00 00 00 00 00 00      	lddw r2, 0x11bf7c
   2be10: 85 10 00 00 bc 92 00 00      	call 0x92bc
   2be18: 7a 0a a8 ff 00 00 00 00      	stdw [r10 - 0x58], 0x0
   2be20: 7a 0a a0 ff 01 00 00 00      	stdw [r10 - 0x60], 0x1
   2be28: 7a 0a 98 ff 00 00 00 00      	stdw [r10 - 0x68], 0x0
   2be30: 18 01 00 00 e0 21 12 00 00 00 00 00 00 00 00 00      	lddw r1, 0x1221e0
   2be40: 7b 1a 58 ff 00 00 00 00      	stxdw [r10 - 0xa8], r1
   2be48: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   2be50: 07 01 00 00 98 ff ff ff      	add64 r1, -0x68
   2be58: 7b 1a 50 ff 00 00 00 00      	stxdw [r10 - 0xb0], r1
   2be60: 72 0a 68 ff 03 00 00 00      	stb [r10 - 0x98], 0x3
   2be68: 7a 0a 60 ff 20 00 00 00      	stdw [r10 - 0xa0], 0x20
   2be70: 7a 0a 40 ff 00 00 00 00      	stdw [r10 - 0xc0], 0x0
   2be78: 7a 0a 30 ff 00 00 00 00      	stdw [r10 - 0xd0], 0x0
   2be80: bf a2 00 00 00 00 00 00      	mov64 r2, r10
   2be88: 07 02 00 00 30 ff ff ff      	add64 r2, -0xd0
   2be90: 18 01 00 00 7c bf 11 00 00 00 00 00 00 00 00 00      	lddw r1, 0x11bf7c
   2bea0: 85 10 00 00 9f 9d 00 00      	call 0x9d9f
   2bea8: 15 00 01 00 00 00 00 00      	jeq r0, 0x0, +0x1 <.text+0x2bd98>
   2beb0: 05 00 87 02 00 00 00 00      	ja +0x287 <.text+0x2d1d0>
   2beb8: 79 a1 a8 ff 00 00 00 00      	ldxdw r1, [r10 - 0x58]
   2bec0: 7b 1a b0 fd 00 00 00 00      	stxdw [r10 - 0x250], r1
   2bec8: 79 a1 a0 ff 00 00 00 00      	ldxdw r1, [r10 - 0x60]
   2bed0: 7b 1a a8 fd 00 00 00 00      	stxdw [r10 - 0x258], r1
   2bed8: 79 a1 98 ff 00 00 00 00      	ldxdw r1, [r10 - 0x68]
   2bee0: 7b 1a a0 fd 00 00 00 00      	stxdw [r10 - 0x260], r1
   2bee8: 79 a1 d8 ff 00 00 00 00      	ldxdw r1, [r10 - 0x28]
   2bef0: 7b 1a 88 fd 00 00 00 00      	stxdw [r10 - 0x278], r1
   2bef8: 79 a1 e0 ff 00 00 00 00      	ldxdw r1, [r10 - 0x20]
   2bf00: 7b 1a 90 fd 00 00 00 00      	stxdw [r10 - 0x270], r1
   2bf08: 79 a1 e8 ff 00 00 00 00      	ldxdw r1, [r10 - 0x18]
   2bf10: 7b 1a 98 fd 00 00 00 00      	stxdw [r10 - 0x268], r1
   2bf18: 18 01 00 00 84 cb 11 00 00 00 00 00 00 00 00 00      	lddw r1, 0x11cb84
   2bf28: 7b 1a 70 fd 00 00 00 00      	stxdw [r10 - 0x290], r1
   2bf30: 62 0a 00 fe 9a 17 00 00      	stw [r10 - 0x200], 0x179a
   2bf38: 72 0a b8 fd 02 00 00 00      	stb [r10 - 0x248], 0x2
   2bf40: 62 0a 80 fd b1 00 00 00      	stw [r10 - 0x280], 0xb1
   2bf48: 7a 0a 78 fd 31 00 00 00      	stdw [r10 - 0x288], 0x31
   2bf50: 7a 0a 68 fd 00 00 00 00      	stdw [r10 - 0x298], 0x0
   2bf58: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   2bf60: 07 01 00 00 98 fc ff ff      	add64 r1, -0x368
   2bf68: bf a2 00 00 00 00 00 00      	mov64 r2, r10
   2bf70: 07 02 00 00 68 fd ff ff      	add64 r2, -0x298
   2bf78: 85 10 00 00 07 ae 01 00      	call 0x1ae07
   2bf80: 79 a3 a0 fc 00 00 00 00      	ldxdw r3, [r10 - 0x360]
   2bf88: 79 a2 98 fc 00 00 00 00      	ldxdw r2, [r10 - 0x368]
   2bf90: bf a1 00 00 00 00 00 00      	mov64 r1, r10
