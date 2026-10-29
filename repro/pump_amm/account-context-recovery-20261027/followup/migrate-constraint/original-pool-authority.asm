
evidence/original/pump_amm/deployed.so:	file format elf64-sbf

Disassembly of section .text:

0000000000000120 <.text>:
   22300:	bf 16 00 00 00 00 00 00	mov64 r6, r1
   22301:	7b 2a c8 ff 00 00 00 00	stxdw [r10 - 0x38], r2
   22302:	18 01 00 00 5b cb 11 00 00 00 00 00 00 00 00 00	lddw r1, 0x11cb5b
   22304:	7b 1a b8 ff 00 00 00 00	stxdw [r10 - 0x48], r1
   22305:	7a 0a d0 ff 20 00 00 00	stdw [r10 - 0x30], 0x20
   22306:	7a 0a c0 ff 0e 00 00 00	stdw [r10 - 0x40], 0xe
   22307:	bf a1 00 00 00 00 00 00	mov64 r1, r10
   22308:	07 01 00 00 df ff ff ff	add64 r1, -0x21
   22309:	bf a2 00 00 00 00 00 00	mov64 r2, r10
   22310:	07 02 00 00 b8 ff ff ff	add64 r2, -0x48
   22311:	b7 03 00 00 02 00 00 00	mov64 r3, 0x2
   22312:	18 04 00 00 5e e5 11 00 00 00 00 00 00 00 00 00	lddw r4, 0x11e55e
   22314:	85 10 00 00 e2 c4 01 00	call 0x1c4e2
   22315:	79 a1 f7 ff 00 00 00 00	ldxdw r1, [r10 - 0x9]
   22316:	7b 16 18 00 00 00 00 00	stxdw [r6 + 0x18], r1
   22317:	79 a1 ef ff 00 00 00 00	ldxdw r1, [r10 - 0x11]
   22318:	7b 16 10 00 00 00 00 00	stxdw [r6 + 0x10], r1
   22319:	79 a1 e7 ff 00 00 00 00	ldxdw r1, [r10 - 0x19]
   22320:	7b 16 08 00 00 00 00 00	stxdw [r6 + 0x8], r1
   22321:	79 a1 df ff 00 00 00 00	ldxdw r1, [r10 - 0x21]
   22322:	7b 16 00 00 00 00 00 00	stxdw [r6 + 0x0], r1
   22323:	95 00 00 00 00 00 00 00	exit
