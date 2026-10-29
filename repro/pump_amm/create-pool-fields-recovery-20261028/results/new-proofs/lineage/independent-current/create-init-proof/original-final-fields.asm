
evidence/original/pump_amm/deployed.so:	file format elf64-sbf

Disassembly of section .text:

0000000000000120 <.text>:
   2d710: 79 a2 98 fb 00 00 00 00      	ldxdw r2, [r10 - 0x468]
   2d718: 79 71 18 00 00 00 00 00      	ldxdw r1, [r7 + 0x18]
   2d720: 79 11 58 00 00 00 00 00      	ldxdw r1, [r1 + 0x58]
   2d728: 79 11 00 00 00 00 00 00      	ldxdw r1, [r1 + 0x0]
   2d730: 79 14 18 00 00 00 00 00      	ldxdw r4, [r1 + 0x18]
   2d738: 7b 4a 80 fd 00 00 00 00      	stxdw [r10 - 0x280], r4
   2d740: 79 14 10 00 00 00 00 00      	ldxdw r4, [r1 + 0x10]
   2d748: 7b 4a 78 fd 00 00 00 00      	stxdw [r10 - 0x288], r4
   2d750: 79 14 08 00 00 00 00 00      	ldxdw r4, [r1 + 0x8]
   2d758: 7b 4a 70 fd 00 00 00 00      	stxdw [r10 - 0x290], r4
   2d760: 79 11 00 00 00 00 00 00      	ldxdw r1, [r1 + 0x0]
   2d768: 7b 1a 68 fd 00 00 00 00      	stxdw [r10 - 0x298], r1
   2d770: 79 71 20 00 00 00 00 00      	ldxdw r1, [r7 + 0x20]
   2d778: 79 11 58 00 00 00 00 00      	ldxdw r1, [r1 + 0x58]
   2d780: 79 11 00 00 00 00 00 00      	ldxdw r1, [r1 + 0x0]
   2d788: 79 14 18 00 00 00 00 00      	ldxdw r4, [r1 + 0x18]
   2d790: 7b 4a a0 fd 00 00 00 00      	stxdw [r10 - 0x260], r4
   2d798: 79 14 10 00 00 00 00 00      	ldxdw r4, [r1 + 0x10]
   2d7a0: 7b 4a 98 fd 00 00 00 00      	stxdw [r10 - 0x268], r4
   2d7a8: 79 14 08 00 00 00 00 00      	ldxdw r4, [r1 + 0x8]
   2d7b0: 7b 4a 90 fd 00 00 00 00      	stxdw [r10 - 0x270], r4
   2d7b8: 79 11 00 00 00 00 00 00      	ldxdw r1, [r1 + 0x0]
   2d7c0: 7b 1a 88 fd 00 00 00 00      	stxdw [r10 - 0x278], r1
   2d7c8: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   2d7d0: 07 01 00 00 88 fb ff ff      	add64 r1, -0x478
   2d7d8: bf a4 00 00 00 00 00 00      	mov64 r4, r10
   2d7e0: 07 04 00 00 68 fd ff ff      	add64 r4, -0x298
   2d7e8: 85 10 00 00 3c ab 01 00      	call 0x1ab3c
   2d7f0: 79 a2 90 fb 00 00 00 00      	ldxdw r2, [r10 - 0x470]
   2d7f8: 79 a1 88 fb 00 00 00 00      	ldxdw r1, [r10 - 0x478]
   2d800: 05 00 8b ff 00 00 00 00      	ja -0x75 <.text+0x2d340>
   2d808: 79 a2 30 fc 00 00 00 00      	ldxdw r2, [r10 - 0x3d0]
   2d810: 05 00 89 ff 00 00 00 00      	ja -0x77 <.text+0x2d340>
   2d818: 79 a2 20 fc 00 00 00 00      	ldxdw r2, [r10 - 0x3e0]
   2d820: 05 00 87 ff 00 00 00 00      	ja -0x79 <.text+0x2d340>
   2d828: 79 a2 10 fc 00 00 00 00      	ldxdw r2, [r10 - 0x3f0]
   2d830: 05 00 85 ff 00 00 00 00      	ja -0x7b <.text+0x2d340>
   2d838: 79 a2 00 fc 00 00 00 00      	ldxdw r2, [r10 - 0x400]
   2d840: 05 00 83 ff 00 00 00 00      	ja -0x7d <.text+0x2d340>
   2d848: 79 a2 70 fd 00 00 00 00      	ldxdw r2, [r10 - 0x290]
   2d850: 05 00 81 ff 00 00 00 00      	ja -0x7f <.text+0x2d340>
   2d858: 79 71 00 00 00 00 00 00      	ldxdw r1, [r7 + 0x0]
   2d860: 79 a3 e0 fa 00 00 00 00      	ldxdw r3, [r10 - 0x520]
   2d868: 79 32 18 00 00 00 00 00      	ldxdw r2, [r3 + 0x18]
   2d870: 7b 21 e0 00 00 00 00 00      	stxdw [r1 + 0xe0], r2
   2d878: 79 32 10 00 00 00 00 00      	ldxdw r2, [r3 + 0x10]
   2d880: 7b 21 d8 00 00 00 00 00      	stxdw [r1 + 0xd8], r2
   2d888: 79 32 08 00 00 00 00 00      	ldxdw r2, [r3 + 0x8]
   2d890: 7b 21 d0 00 00 00 00 00      	stxdw [r1 + 0xd0], r2
   2d898: 79 32 00 00 00 00 00 00      	ldxdw r2, [r3 + 0x0]
   2d8a0: 7b 21 c8 00 00 00 00 00      	stxdw [r1 + 0xc8], r2
   2d8a8: 79 71 00 00 00 00 00 00      	ldxdw r1, [r7 + 0x0]
   2d8b0: 79 a2 d0 fa 00 00 00 00      	ldxdw r2, [r10 - 0x530]
   2d8b8: 7b 21 00 01 00 00 00 00      	stxdw [r1 + 0x100], r2
   2d8c0: 79 71 00 00 00 00 00 00      	ldxdw r1, [r7 + 0x0]
   2d8c8: 79 a2 d8 fa 00 00 00 00      	ldxdw r2, [r10 - 0x528]
   2d8d0: 73 21 1d 01 00 00 00 00      	stxb [r1 + 0x11d], r2
   2d8d8: 79 a2 c8 fa 00 00 00 00      	ldxdw r2, [r10 - 0x538]
   2d8e0: 79 71 00 00 00 00 00 00      	ldxdw r1, [r7 + 0x0]
   2d8e8: 73 21 1e 01 00 00 00 00      	stxb [r1 + 0x11e], r2
   2d8f0: 25 00 06 00 63 00 00 00      	jgt r0, 0x63, +0x6 <.text+0x2d808>
   2d8f8: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   2d900: 07 01 00 00 d8 fb ff ff      	add64 r1, -0x428
   2d908: 85 10 00 00 2a 01 00 00      	call 0x12a
   2d910: 79 a2 e0 fb 00 00 00 00      	ldxdw r2, [r10 - 0x420]
   2d918: 79 a1 d8 fb 00 00 00 00      	ldxdw r1, [r10 - 0x428]
   2d920: 05 00 67 ff 00 00 00 00      	ja -0x99 <.text+0x2d340>
   2d928: 79 74 40 00 00 00 00 00      	ldxdw r4, [r7 + 0x40]
   2d930: 79 73 28 00 00 00 00 00      	ldxdw r3, [r7 + 0x28]
   2d938: 79 71 00 00 00 00 00 00      	ldxdw r1, [r7 + 0x0]
   2d940: 7b 1a 08 f0 00 00 00 00      	stxdw [r10 - 0xff8], r1
   2d948: 7b 0a d8 fa 00 00 00 00      	stxdw [r10 - 0x528], r0
   2d950: bf 06 00 00 00 00 00 00      	mov64 r6, r0
   2d958: 07 06 00 00 9c ff ff ff      	add64 r6, -0x64
   2d960: 7b 6a 00 f0 00 00 00 00      	stxdw [r10 - 0x1000], r6
   2d968: bf 72 00 00 00 00 00 00      	mov64 r2, r7
   2d970: 07 02 00 00 60 00 00 00      	add64 r2, 0x60
   2d978: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   2d980: 07 01 00 00 c8 fb ff ff      	add64 r1, -0x438
   2d988: bf a5 00 00 00 00 00 00      	mov64 r5, r10
   2d990: 85 10 00 00 f0 8a 00 00      	call 0x8af0
   2d998: 79 a1 c8 fb 00 00 00 00      	ldxdw r1, [r10 - 0x438]
   2d9a0: 55 01 13 00 02 00 00 00      	jne r1, 0x2, +0x13 <.text+0x2d920>
   2d9a8: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   2d9b0: 07 01 00 00 30 ff ff ff      	add64 r1, -0xd0
   2d9b8: 85 10 00 00 8f b2 01 00      	call 0x1b28f
   2d9c0: 79 a1 30 ff 00 00 00 00      	ldxdw r1, [r10 - 0xd0]
   2d9c8: 15 01 10 00 00 00 00 00      	jeq r1, 0x0, +0x10 <.text+0x2d930>
   2d9d0: 79 a1 38 ff 00 00 00 00      	ldxdw r1, [r10 - 0xc8]
   2d9d8: 79 a2 40 ff 00 00 00 00      	ldxdw r2, [r10 - 0xc0]
   2d9e0: 79 a3 48 ff 00 00 00 00      	ldxdw r3, [r10 - 0xb8]
   2d9e8: 7b 3a 40 ff 00 00 00 00      	stxdw [r10 - 0xc0], r3
   2d9f0: 7b 2a 38 ff 00 00 00 00      	stxdw [r10 - 0xc8], r2
   2d9f8: 7b 1a 30 ff 00 00 00 00      	stxdw [r10 - 0xd0], r1
   2da00: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   2da08: 07 01 00 00 b8 fb ff ff      	add64 r1, -0x448
   2da10: bf a2 00 00 00 00 00 00      	mov64 r2, r10
   2da18: 07 02 00 00 30 ff ff ff      	add64 r2, -0xd0
   2da20: 85 10 00 00 c3 aa 01 00      	call 0x1aac3
   2da28: 79 a2 c0 fb 00 00 00 00      	ldxdw r2, [r10 - 0x440]
   2da30: 79 a1 b8 fb 00 00 00 00      	ldxdw r1, [r10 - 0x448]
   2da38: 05 00 44 ff 00 00 00 00      	ja -0xbc <.text+0x2d340>
   2da40: 79 a2 d0 fb 00 00 00 00      	ldxdw r2, [r10 - 0x430]
   2da48: 05 00 42 ff 00 00 00 00      	ja -0xbe <.text+0x2d340>
   2da50: 79 a2 58 ff 00 00 00 00      	ldxdw r2, [r10 - 0xa8]
   2da58: 79 74 00 00 00 00 00 00      	ldxdw r4, [r7 + 0x0]
   2da60: 79 41 00 00 00 00 00 00      	ldxdw r1, [r4 + 0x0]
   2da68: 79 11 00 00 00 00 00 00      	ldxdw r1, [r1 + 0x0]
   2da70: 79 13 18 00 00 00 00 00      	ldxdw r3, [r1 + 0x18]
   2da78: 7b 3a e0 fd 00 00 00 00      	stxdw [r10 - 0x220], r3
   2da80: 79 13 10 00 00 00 00 00      	ldxdw r3, [r1 + 0x10]
   2da88: 7b 3a d8 fd 00 00 00 00      	stxdw [r10 - 0x228], r3
   2da90: 79 13 08 00 00 00 00 00      	ldxdw r3, [r1 + 0x8]
   2da98: 7b 3a d0 fd 00 00 00 00      	stxdw [r10 - 0x230], r3
   2daa0: 79 11 00 00 00 00 00 00      	ldxdw r1, [r1 + 0x0]
   2daa8: 7b 1a c8 fd 00 00 00 00      	stxdw [r10 - 0x238], r1
   2dab0: 79 71 28 00 00 00 00 00      	ldxdw r1, [r7 + 0x28]
   2dab8: 79 11 58 00 00 00 00 00      	ldxdw r1, [r1 + 0x58]
   2dac0: 79 11 00 00 00 00 00 00      	ldxdw r1, [r1 + 0x0]
   2dac8: 79 13 18 00 00 00 00 00      	ldxdw r3, [r1 + 0x18]
   2dad0: 7b 3a 00 fe 00 00 00 00      	stxdw [r10 - 0x200], r3
   2dad8: 79 13 10 00 00 00 00 00      	ldxdw r3, [r1 + 0x10]
   2dae0: 7b 3a f8 fd 00 00 00 00      	stxdw [r10 - 0x208], r3
   2dae8: 79 13 08 00 00 00 00 00      	ldxdw r3, [r1 + 0x8]
   2daf0: 7b 3a f0 fd 00 00 00 00      	stxdw [r10 - 0x210], r3
   2daf8: 79 11 00 00 00 00 00 00      	ldxdw r1, [r1 + 0x0]
   2db00: 7b 1a e8 fd 00 00 00 00      	stxdw [r10 - 0x218], r1
   2db08: 79 71 30 00 00 00 00 00      	ldxdw r1, [r7 + 0x30]
   2db10: 79 11 20 00 00 00 00 00      	ldxdw r1, [r1 + 0x20]
   2db18: 79 11 00 00 00 00 00 00      	ldxdw r1, [r1 + 0x0]
   2db20: 79 13 18 00 00 00 00 00      	ldxdw r3, [r1 + 0x18]
   2db28: 7b 3a 20 fe 00 00 00 00      	stxdw [r10 - 0x1e0], r3
   2db30: 79 13 10 00 00 00 00 00      	ldxdw r3, [r1 + 0x10]
   2db38: 7b 3a 18 fe 00 00 00 00      	stxdw [r10 - 0x1e8], r3
   2db40: 79 13 08 00 00 00 00 00      	ldxdw r3, [r1 + 0x8]
   2db48: 7b 3a 10 fe 00 00 00 00      	stxdw [r10 - 0x1f0], r3
   2db50: 79 11 00 00 00 00 00 00      	ldxdw r1, [r1 + 0x0]
   2db58: 7b 1a 08 fe 00 00 00 00      	stxdw [r10 - 0x1f8], r1
   2db60: 79 71 38 00 00 00 00 00      	ldxdw r1, [r7 + 0x38]
   2db68: 79 11 20 00 00 00 00 00      	ldxdw r1, [r1 + 0x20]
   2db70: 79 11 00 00 00 00 00 00      	ldxdw r1, [r1 + 0x0]
   2db78: 79 13 18 00 00 00 00 00      	ldxdw r3, [r1 + 0x18]
   2db80: 7b 3a 40 fe 00 00 00 00      	stxdw [r10 - 0x1c0], r3
   2db88: 79 13 10 00 00 00 00 00      	ldxdw r3, [r1 + 0x10]
