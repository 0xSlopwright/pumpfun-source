
evidence/original/pump_amm/deployed.so:	file format elf64-sbf

Disassembly of section .text:

0000000000000120 <.text>:
   6d690: 57 07 00 00 01 00 00 00      	and64 r7, 0x1
   6d698: 79 a1 98 fe 00 00 00 00      	ldxdw r1, [r10 - 0x168]
   6d6a0: 79 a4 90 fe 00 00 00 00      	ldxdw r4, [r10 - 0x170]
   6d6a8: 79 a5 a0 fe 00 00 00 00      	ldxdw r5, [r10 - 0x160]
   6d6b0: 79 a2 a8 fe 00 00 00 00      	ldxdw r2, [r10 - 0x158]
   6d6b8: 55 07 86 00 00 00 00 00      	jne r7, 0x0, +0x86 <.text+0x6d9d0>
   6d6c0: b7 07 00 00 01 00 00 00      	mov64 r7, 0x1
   6d6c8: 55 00 01 00 00 00 00 00      	jne r0, 0x0, +0x1 <.text+0x6d5b8>
   6d6d0: b7 07 00 00 00 00 00 00      	mov64 r7, 0x0
   6d6d8: 7b 03 20 00 00 00 00 00      	stxdw [r3 + 0x20], r0
   6d6e0: 7b 43 38 00 00 00 00 00      	stxdw [r3 + 0x38], r4
   6d6e8: 73 73 50 00 00 00 00 00      	stxb [r3 + 0x50], r7
   6d6f0: 7a 03 30 00 00 00 00 00      	stdw [r3 + 0x30], 0x0
   6d6f8: 05 00 43 00 00 00 00 00      	ja +0x43 <.text+0x6d7f8>
   6d700: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   6d708: 07 01 00 00 88 ff ff ff      	add64 r1, -0x78
   6d710: 18 02 00 00 7c c0 11 00 00 00 00 00 00 00 00 00      	lddw r2, 0x11c07c
   6d720: 85 10 00 00 9a 0f 00 00      	call 0xf9a
   6d728: 7a 0a b0 ff 00 00 00 00      	stdw [r10 - 0x50], 0x0
   6d730: 7a 0a a8 ff 01 00 00 00      	stdw [r10 - 0x58], 0x1
   6d738: 7a 0a a0 ff 00 00 00 00      	stdw [r10 - 0x60], 0x0
   6d740: 18 01 00 00 e0 21 12 00 00 00 00 00 00 00 00 00      	lddw r1, 0x1221e0
   6d750: 7b 1a e0 ff 00 00 00 00      	stxdw [r10 - 0x20], r1
   6d758: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   6d760: 07 01 00 00 a0 ff ff ff      	add64 r1, -0x60
   6d768: 7b 1a d8 ff 00 00 00 00      	stxdw [r10 - 0x28], r1
   6d770: 72 0a f0 ff 03 00 00 00      	stb [r10 - 0x10], 0x3
   6d778: 7a 0a e8 ff 20 00 00 00      	stdw [r10 - 0x18], 0x20
   6d780: 7a 0a c8 ff 00 00 00 00      	stdw [r10 - 0x38], 0x0
   6d788: 7a 0a b8 ff 00 00 00 00      	stdw [r10 - 0x48], 0x0
   6d790: bf a2 00 00 00 00 00 00      	mov64 r2, r10
   6d798: 07 02 00 00 b8 ff ff ff      	add64 r2, -0x48
   6d7a0: 18 01 00 00 7c c0 11 00 00 00 00 00 00 00 00 00      	lddw r1, 0x11c07c
   6d7b0: 85 10 00 00 7d 1a 00 00      	call 0x1a7d
   6d7b8: 15 00 0a 00 00 00 00 00      	jeq r0, 0x0, +0xa <.text+0x6d6f0>
   6d7c0: bf a3 00 00 00 00 00 00      	mov64 r3, r10
   6d7c8: 07 03 00 00 ff ff ff ff      	add64 r3, -0x1
   6d7d0: 18 01 00 00 fa c0 11 00 00 00 00 00 00 00 00 00      	lddw r1, 0x11c0fa
   6d7e0: b7 02 00 00 37 00 00 00      	mov64 r2, 0x37
   6d7e8: 18 04 00 00 10 22 12 00 00 00 00 00 00 00 00 00      	lddw r4, 0x122210
   6d7f8: 18 05 00 00 30 22 12 00 00 00 00 00 00 00 00 00      	lddw r5, 0x122230
   6d808: 85 10 00 00 f1 4a 01 00      	call 0x14af1
   6d810: 79 a1 b0 ff 00 00 00 00      	ldxdw r1, [r10 - 0x50]
   6d818: 7b 1a 30 ff 00 00 00 00      	stxdw [r10 - 0xd0], r1
   6d820: 79 a1 a8 ff 00 00 00 00      	ldxdw r1, [r10 - 0x58]
   6d828: 7b 1a 28 ff 00 00 00 00      	stxdw [r10 - 0xd8], r1
   6d830: 79 a1 a0 ff 00 00 00 00      	ldxdw r1, [r10 - 0x60]
   6d838: 7b 1a 20 ff 00 00 00 00      	stxdw [r10 - 0xe0], r1
   6d840: 79 a1 88 ff 00 00 00 00      	ldxdw r1, [r10 - 0x78]
   6d848: 7b 1a 08 ff 00 00 00 00      	stxdw [r10 - 0xf8], r1
   6d850: 79 a1 90 ff 00 00 00 00      	ldxdw r1, [r10 - 0x70]
   6d858: 7b 1a 10 ff 00 00 00 00      	stxdw [r10 - 0xf0], r1
   6d860: 79 a1 98 ff 00 00 00 00      	ldxdw r1, [r10 - 0x68]
   6d868: 7b 1a 18 ff 00 00 00 00      	stxdw [r10 - 0xe8], r1
   6d870: 18 01 00 00 5e cf 11 00 00 00 00 00 00 00 00 00      	lddw r1, 0x11cf5e
   6d880: 7b 1a f0 fe 00 00 00 00      	stxdw [r10 - 0x110], r1
   6d888: 62 0a 80 ff 88 17 00 00      	stw [r10 - 0x80], 0x1788
   6d890: 72 0a 38 ff 02 00 00 00      	stb [r10 - 0xc8], 0x2
   6d898: 62 0a 00 ff 68 00 00 00      	stw [r10 - 0x100], 0x68
