
work/amm-joint-independent-review-20261027/results/build/artifacts/unstripped.so:	file format elf64-sbf

Disassembly of section .text:

00000000000b43b0 <_ZN18pump_amm_recovered9__private8__global6buy_v217h4b18a41209120ebfE>:
   92278:	bf 57 00 00 00 00 00 00	mov64 r7, r5
   92279:	bf 49 00 00 00 00 00 00	mov64 r9, r4
   92280:	bf 38 00 00 00 00 00 00	mov64 r8, r3
   92281:	7b 2a 50 fe 00 00 00 00	stxdw [r10 - 0x1b0], r2
   92282:	bf 16 00 00 00 00 00 00	mov64 r6, r1
   92283:	18 01 00 00 ca 34 12 00 00 00 00 00 00 00 00 00	lddw r1, 0x1234ca
   92285:	b7 02 00 00 12 00 00 00	mov64 r2, 0x12
   92286:	85 10 00 00 ff ff ff ff	call -0x1
   92287:	79 71 08 f0 00 00 00 00	ldxdw r1, [r7 - 0xff8]
   92288:	a5 01 46 00 08 00 00 00	jlt r1, 0x8, +0x46 <LBB734_3>
   92289:	57 01 00 00 f8 ff ff ff	and64 r1, -0x8
   92290:	15 01 44 00 08 00 00 00	jeq r1, 0x8, +0x44 <LBB734_3>
   92291:	79 71 00 f0 00 00 00 00	ldxdw r1, [r7 - 0x1000]
   92292:	79 12 00 00 00 00 00 00	ldxdw r2, [r1 + 0x0]
   92293:	7b 2a 48 fe 00 00 00 00	stxdw [r10 - 0x1b8], r2
   92294:	79 11 08 00 00 00 00 00	ldxdw r1, [r1 + 0x8]
   92295:	7b 1a 40 fe 00 00 00 00	stxdw [r10 - 0x1c0], r1
   92296:	72 0a 8f fe ff 00 00 00	stb [r10 - 0x171], 0xff
   92297:	7b 9a 98 fe 00 00 00 00	stxdw [r10 - 0x168], r9
   92298:	7b 8a 90 fe 00 00 00 00	stxdw [r10 - 0x170], r8
   92299:	bf a1 00 00 00 00 00 00	mov64 r1, r10
   92300:	07 01 00 00 8e fe ff ff	add64 r1, -0x172
   92301:	7b 1a 08 f0 00 00 00 00	stxdw [r10 - 0xff8], r1
   92302:	bf a1 00 00 00 00 00 00	mov64 r1, r10
   92303:	07 01 00 00 50 ff ff ff	add64 r1, -0xb0
   92304:	bf a3 00 00 00 00 00 00	mov64 r3, r10
   92305:	07 03 00 00 90 fe ff ff	add64 r3, -0x170
   92306:	bf a5 00 00 00 00 00 00	mov64 r5, r10
   92307:	79 a2 50 fe 00 00 00 00	ldxdw r2, [r10 - 0x1b0]
   92308:	85 10 00 00 26 4c ff ff	call -0xb3da
   92309:	79 a8 58 ff 00 00 00 00	ldxdw r8, [r10 - 0xa8]
   92310:	79 a7 50 ff 00 00 00 00	ldxdw r7, [r10 - 0xb0]
   92311:	71 a9 fa ff 00 00 00 00	ldxb r9, [r10 - 0x6]
   92312:	15 09 41 00 02 00 00 00	jeq r9, 0x2, +0x41 <LBB734_16>
   92313:	bf a1 00 00 00 00 00 00	mov64 r1, r10
   92314:	07 01 00 00 b0 fe ff ff	add64 r1, -0x150
   92315:	bf a2 00 00 00 00 00 00	mov64 r2, r10
   92316:	07 02 00 00 60 ff ff ff	add64 r2, -0xa0
   92317:	b7 03 00 00 9a 00 00 00	mov64 r3, 0x9a
   92318:	85 10 00 00 33 d6 00 00	call 0xd633
   92319:	61 a1 fb ff 00 00 00 00	ldxw r1, [r10 - 0x5]
   92320:	63 1a 4b ff 00 00 00 00	stxw [r10 - 0xb5], r1
   92321:	71 a1 ff ff 00 00 00 00	ldxb r1, [r10 - 0x1]
   92322:	73 1a 4f ff 00 00 00 00	stxb [r10 - 0xb1], r1
   92323:	73 9a 4a ff 00 00 00 00	stxb [r10 - 0xb6], r9
   92324:	7b 8a a8 fe 00 00 00 00	stxdw [r10 - 0x158], r8
   92325:	7b 7a a0 fe 00 00 00 00	stxdw [r10 - 0x160], r7
   92326:	71 a3 8f fe 00 00 00 00	ldxb r3, [r10 - 0x171]
   92327:	bf a1 00 00 00 00 00 00	mov64 r1, r10
   92328:	07 01 00 00 78 fe ff ff	add64 r1, -0x188
   92329:	bf a2 00 00 00 00 00 00	mov64 r2, r10
   92330:	07 02 00 00 a0 fe ff ff	add64 r2, -0x160
   92331:	79 a4 48 fe 00 00 00 00	ldxdw r4, [r10 - 0x1b8]
   92332:	79 a5 40 fe 00 00 00 00	ldxdw r5, [r10 - 0x1c0]
   92333:	85 10 00 00 cf 2a ff ff	call -0xd531
   92334:	79 a7 78 fe 00 00 00 00	ldxdw r7, [r10 - 0x188]
