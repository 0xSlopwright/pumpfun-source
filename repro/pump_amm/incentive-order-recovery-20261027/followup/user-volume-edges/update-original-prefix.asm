
evidence/original/pump_amm/deployed.so:	file format elf64-sbf

Disassembly of section .text:

0000000000000120 <.text>:
   6d408: 79 20 00 02 00 00 00 00      	ldxdw r0, [r2 + 0x200]
   6d410: 79 37 38 00 00 00 00 00      	ldxdw r7, [r3 + 0x38]
   6d418: 7d 07 01 00 00 00 00 00      	jsge r7, r0, +0x1 <.text+0x6d308>
   6d420: cd 04 14 00 00 00 00 00      	jslt r4, r0, +0x14 <.text+0x6d3a8>
   6d428: 65 04 0a 00 ff ff ff ff      	jsgt r4, -0x1, +0xa <.text+0x6d360>
   6d430: bf a3 00 00 00 00 00 00      	mov64 r3, r10
   6d438: 07 03 00 00 ff ff ff ff      	add64 r3, -0x1
   6d440: 18 01 00 00 13 d0 11 00 00 00 00 00 00 00 00 00      	lddw r1, 0x11d013
   6d450: b7 02 00 00 0d 00 00 00      	mov64 r2, 0xd
   6d458: 18 04 00 00 b8 25 12 00 00 00 00 00 00 00 00 00      	lddw r4, 0x1225b8
   6d468: 18 05 00 00 40 27 12 00 00 00 00 00 00 00 00 00      	lddw r5, 0x122740
   6d478: 85 10 00 00 63 4b 01 00      	call 0x14b63
   6d480: 65 00 01 00 ff ff ff ff      	jsgt r0, -0x1, +0x1 <.text+0x6d370>
   6d488: 05 00 f4 ff 00 00 00 00      	ja -0xc <.text+0x6d310>
   6d490: b7 06 00 00 02 00 00 00      	mov64 r6, 0x2
   6d498: 7b 6a b0 fe 00 00 00 00      	stxdw [r10 - 0x150], r6
   6d4a0: ad 04 b2 00 00 00 00 00      	jlt r4, r0, +0xb2 <.text+0x6d918>
   6d4a8: 79 28 10 02 00 00 00 00      	ldxdw r8, [r2 + 0x210]
   6d4b0: 15 08 b0 00 00 00 00 00      	jeq r8, 0x0, +0xb0 <.text+0x6d918>
   6d4b8: 65 08 04 00 ff ff ff ff      	jsgt r8, -0x1, +0x4 <.text+0x6d3c0>
   6d4c0: 05 00 ed ff 00 00 00 00      	ja -0x13 <.text+0x6d310>
   6d4c8: 72 03 51 00 00 00 00 00      	stb [r3 + 0x51], 0x0
   6d4d0: 7a 03 28 00 00 00 00 00      	stdw [r3 + 0x28], 0x0
   6d4d8: 05 00 e9 ff 00 00 00 00      	ja -0x17 <.text+0x6d308>
   6d4e0: 65 07 01 00 ff ff ff ff      	jsgt r7, -0x1, +0x1 <.text+0x6d3d0>
   6d4e8: 05 00 e8 ff 00 00 00 00      	ja -0x18 <.text+0x6d310>
   6d4f0: bf 46 00 00 00 00 00 00      	mov64 r6, r4
   6d4f8: 1f 06 00 00 00 00 00 00      	sub64 r6, r0
   6d500: 3f 86 00 00 00 00 00 00      	div64 r6, r8
   6d508: ad 07 81 00 00 00 00 00      	jlt r7, r0, +0x81 <.text+0x6d7f8>
   6d510: 1f 07 00 00 00 00 00 00      	sub64 r7, r0
   6d518: 3f 87 00 00 00 00 00 00      	div64 r7, r8
   6d520: 7b 1a 98 fe 00 00 00 00      	stxdw [r10 - 0x168], r1
   6d528: bf 21 00 00 00 00 00 00      	mov64 r1, r2
   6d530: bf 39 00 00 00 00 00 00      	mov64 r9, r3
   6d538: 7b 4a 90 fe 00 00 00 00      	stxdw [r10 - 0x170], r4
   6d540: 7b 5a a0 fe 00 00 00 00      	stxdw [r10 - 0x160], r5
   6d548: 7b 2a a8 fe 00 00 00 00      	stxdw [r10 - 0x158], r2
   6d550: 85 10 00 00 ce 03 00 00      	call 0x3ce
   6d558: 79 a2 a8 fe 00 00 00 00      	ldxdw r2, [r10 - 0x158]
   6d560: 79 a5 a0 fe 00 00 00 00      	ldxdw r5, [r10 - 0x160]
   6d568: 79 a4 90 fe 00 00 00 00      	ldxdw r4, [r10 - 0x170]
   6d570: bf 93 00 00 00 00 00 00      	mov64 r3, r9
   6d578: 79 a1 98 fe 00 00 00 00      	ldxdw r1, [r10 - 0x168]
   6d580: 3d 67 72 00 00 00 00 00      	jge r7, r6, +0x72 <.text+0x6d7f8>
   6d588: 2d 07 71 00 00 00 00 00      	jgt r7, r0, +0x71 <.text+0x6d7f8>
   6d590: 25 07 a0 00 1d 00 00 00      	jgt r7, 0x1d, +0xa0 <.text+0x6d978>
   6d598: 67 07 00 00 03 00 00 00      	lsh64 r7, 0x3
   6d5a0: bf 28 00 00 00 00 00 00      	mov64 r8, r2
   6d5a8: 0f 78 00 00 00 00 00 00      	add64 r8, r7
   6d5b0: 79 87 10 01 00 00 00 00      	ldxdw r7, [r8 + 0x110]
   6d5b8: 15 07 6b 00 00 00 00 00      	jeq r7, 0x0, +0x6b <.text+0x6d7f8>
   6d5c0: 79 30 30 00 00 00 00 00      	ldxdw r0, [r3 + 0x30]
   6d5c8: 15 00 69 00 00 00 00 00      	jeq r0, 0x0, +0x69 <.text+0x6d7f8>
   6d5d0: 79 84 20 00 00 00 00 00      	ldxdw r4, [r8 + 0x20]
   6d5d8: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   6d5e0: 07 01 00 00 d8 fe ff ff      	add64 r1, -0x128
   6d5e8: bf 02 00 00 00 00 00 00      	mov64 r2, r0
   6d5f0: b7 03 00 00 00 00 00 00      	mov64 r3, 0x0
   6d5f8: b7 05 00 00 00 00 00 00      	mov64 r5, 0x0
   6d600: 85 10 00 00 45 5c 01 00      	call 0x15c45
   6d608: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   6d610: 07 01 00 00 c8 fe ff ff      	add64 r1, -0x138
   6d618: 79 a2 d8 fe 00 00 00 00      	ldxdw r2, [r10 - 0x128]
   6d620: 79 a3 e0 fe 00 00 00 00      	ldxdw r3, [r10 - 0x120]
   6d628: bf 74 00 00 00 00 00 00      	mov64 r4, r7
   6d630: b7 05 00 00 00 00 00 00      	mov64 r5, 0x0
   6d638: 85 10 00 00 96 59 01 00      	call 0x15996
   6d640: 79 a1 d0 fe 00 00 00 00      	ldxdw r1, [r10 - 0x130]
   6d648: 55 01 16 00 00 00 00 00      	jne r1, 0x0, +0x16 <.text+0x6d5e0>
   6d650: 79 a1 c8 fe 00 00 00 00      	ldxdw r1, [r10 - 0x138]
   6d658: bf 93 00 00 00 00 00 00      	mov64 r3, r9
   6d660: 79 32 20 00 00 00 00 00      	ldxdw r2, [r3 + 0x20]
   6d668: bf 20 00 00 00 00 00 00      	mov64 r0, r2
   6d670: 0f 10 00 00 00 00 00 00      	add64 r0, r1
   6d678: b7 07 00 00 01 00 00 00      	mov64 r7, 0x1
   6d680: ad 20 01 00 00 00 00 00      	jlt r0, r2, +0x1 <.text+0x6d570>
   6d688: b7 07 00 00 00 00 00 00      	mov64 r7, 0x0
   6d690: 57 07 00 00 01 00 00 00      	and64 r7, 0x1
   6d698: 79 a1 98 fe 00 00 00 00      	ldxdw r1, [r10 - 0x168]
   6d6a0: 79 a4 90 fe 00 00 00 00      	ldxdw r4, [r10 - 0x170]
   6d6a8: 79 a5 a0 fe 00 00 00 00      	ldxdw r5, [r10 - 0x160]
