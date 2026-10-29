
evidence/original/pump_amm/deployed.so:	file format elf64-sbf

Disassembly of section .text:

0000000000000120 <.text>:
   2ba60: bf 59 00 00 00 00 00 00      	mov64 r9, r5
   2ba68: 7b 4a f8 fa 00 00 00 00      	stxdw [r10 - 0x508], r4
   2ba70: 7b 3a f0 fa 00 00 00 00      	stxdw [r10 - 0x510], r3
   2ba78: bf 28 00 00 00 00 00 00      	mov64 r8, r2
   2ba80: 7b 1a 00 fb 00 00 00 00      	stxdw [r10 - 0x500], r1
   2ba88: 79 87 08 00 00 00 00 00      	ldxdw r7, [r8 + 0x8]
   2ba90: 79 71 10 00 00 00 00 00      	ldxdw r1, [r7 + 0x10]
   2ba98: 79 11 00 00 00 00 00 00      	ldxdw r1, [r1 + 0x0]
   2baa0: 79 12 18 00 00 00 00 00      	ldxdw r2, [r1 + 0x18]
   2baa8: 7b 2a c0 fc 00 00 00 00      	stxdw [r10 - 0x340], r2
   2bab0: 79 12 10 00 00 00 00 00      	ldxdw r2, [r1 + 0x10]
   2bab8: 7b 2a b8 fc 00 00 00 00      	stxdw [r10 - 0x348], r2
   2bac0: 79 12 08 00 00 00 00 00      	ldxdw r2, [r1 + 0x8]
   2bac8: 7b 2a b0 fc 00 00 00 00      	stxdw [r10 - 0x350], r2
   2bad0: 79 11 00 00 00 00 00 00      	ldxdw r1, [r1 + 0x0]
   2bad8: 7b 1a a8 fc 00 00 00 00      	stxdw [r10 - 0x358], r1
   2bae0: 79 71 18 00 00 00 00 00      	ldxdw r1, [r7 + 0x18]
   2bae8: 79 11 58 00 00 00 00 00      	ldxdw r1, [r1 + 0x58]
   2baf0: 79 11 00 00 00 00 00 00      	ldxdw r1, [r1 + 0x0]
   2baf8: 79 12 18 00 00 00 00 00      	ldxdw r2, [r1 + 0x18]
   2bb00: 7b 2a b0 ff 00 00 00 00      	stxdw [r10 - 0x50], r2
   2bb08: 79 12 10 00 00 00 00 00      	ldxdw r2, [r1 + 0x10]
   2bb10: 7b 2a a8 ff 00 00 00 00      	stxdw [r10 - 0x58], r2
   2bb18: 79 12 08 00 00 00 00 00      	ldxdw r2, [r1 + 0x8]
   2bb20: 7b 2a a0 ff 00 00 00 00      	stxdw [r10 - 0x60], r2
   2bb28: 79 11 00 00 00 00 00 00      	ldxdw r1, [r1 + 0x0]
   2bb30: 7b 1a 98 ff 00 00 00 00      	stxdw [r10 - 0x68], r1
   2bb38: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   2bb40: 07 01 00 00 98 ff ff ff      	add64 r1, -0x68
   2bb48: 7b 1a 40 ff 00 00 00 00      	stxdw [r10 - 0xc0], r1
   2bb50: 18 01 00 00 5b cb 11 00 00 00 00 00 00 00 00 00      	lddw r1, 0x11cb5b
   2bb60: 7b 1a 30 ff 00 00 00 00      	stxdw [r10 - 0xd0], r1
   2bb68: 7a 0a 48 ff 20 00 00 00      	stdw [r10 - 0xb8], 0x20
   2bb70: 7a 0a 38 ff 0e 00 00 00      	stdw [r10 - 0xc8], 0xe
   2bb78: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   2bb80: 07 01 00 00 68 fd ff ff      	add64 r1, -0x298
   2bb88: bf a2 00 00 00 00 00 00      	mov64 r2, r10
   2bb90: 07 02 00 00 30 ff ff ff      	add64 r2, -0xd0
   2bb98: b7 03 00 00 02 00 00 00      	mov64 r3, 0x2
   2bba0: 18 04 00 00 5e e5 11 00 00 00 00 00 00 00 00 00      	lddw r4, 0x11e55e
   2bbb0: 85 10 00 00 96 c4 01 00      	call 0x1c496
   2bbb8: 79 a1 80 fd 00 00 00 00      	ldxdw r1, [r10 - 0x280]
   2bbc0: 7b 1a f0 ff 00 00 00 00      	stxdw [r10 - 0x10], r1
   2bbc8: 79 a1 78 fd 00 00 00 00      	ldxdw r1, [r10 - 0x288]
   2bbd0: 7b 1a e8 ff 00 00 00 00      	stxdw [r10 - 0x18], r1
   2bbd8: 79 a1 70 fd 00 00 00 00      	ldxdw r1, [r10 - 0x290]
   2bbe0: 7b 1a e0 ff 00 00 00 00      	stxdw [r10 - 0x20], r1
   2bbe8: 79 a1 68 fd 00 00 00 00      	ldxdw r1, [r10 - 0x298]
   2bbf0: 7b 1a d8 ff 00 00 00 00      	stxdw [r10 - 0x28], r1
   2bbf8: bf a1 00 00 00 00 00 00      	mov64 r1, r10
   2bc00: 07 01 00 00 a8 fc ff ff      	add64 r1, -0x358
   2bc08: bf a2 00 00 00 00 00 00      	mov64 r2, r10
   2bc10: 07 02 00 00 d8 ff ff ff      	add64 r2, -0x28
   2bc18: b7 03 00 00 20 00 00 00      	mov64 r3, 0x20
   2bc20: 85 10 00 00 97 db 01 00      	call 0x1db97
   2bc28: bf 06 00 00 00 00 00 00      	mov64 r6, r0
   2bc30: 79 95 30 f0 00 00 00 00      	ldxdw r5, [r9 - 0xfd0]
   2bc38: 79 90 28 f0 00 00 00 00      	ldxdw r0, [r9 - 0xfd8]
   2bc40: 79 92 20 f0 00 00 00 00      	ldxdw r2, [r9 - 0xfe0]
   2bc48: 79 91 18 f0 00 00 00 00      	ldxdw r1, [r9 - 0xfe8]
