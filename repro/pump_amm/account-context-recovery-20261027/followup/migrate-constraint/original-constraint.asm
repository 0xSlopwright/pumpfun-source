
evidence/original/pump_amm/deployed.so:	file format elf64-sbf

Disassembly of section .text:

0000000000000120 <.text>:
   75489:	07 06 00 00 f0 fd ff ff	add64 r6, -0x210
   75490:	bf 61 00 00 00 00 00 00	mov64 r1, r6
   75491:	7b 8a b8 fa 00 00 00 00	stxdw [r10 - 0x548], r8
   75492:	bf 82 00 00 00 00 00 00	mov64 r2, r8
   75493:	85 10 00 00 36 30 ff ff	call -0xcfca
   75494:	bf 91 00 00 00 00 00 00	mov64 r1, r9
   75495:	bf 62 00 00 00 00 00 00	mov64 r2, r6
   75496:	b7 03 00 00 20 00 00 00	mov64 r3, 0x20
   75497:	85 10 00 00 32 0c 01 00	call 0x10c32
   75498:	67 00 00 00 20 00 00 00	lsh64 r0, 0x20
   75499:	77 00 00 00 20 00 00 00	rsh64 r0, 0x20
   75500:	79 a7 20 fb 00 00 00 00	ldxdw r7, [r10 - 0x4e0]
   75501:	79 a8 38 fb 00 00 00 00	ldxdw r8, [r10 - 0x4c8]
   75502:	15 00 25 00 00 00 00 00	jeq r0, 0x0, +0x25 <.text+0x93780>
   75503:	bf a1 00 00 00 00 00 00	mov64 r1, r10
   75504:	07 01 00 00 90 fc ff ff	add64 r1, -0x370
   75505:	b7 02 00 00 1c 00 00 00	mov64 r2, 0x1c
   75506:	85 10 00 00 42 ce ff ff	call -0x31be
   75507:	79 a3 98 fc 00 00 00 00	ldxdw r3, [r10 - 0x368]
   75508:	79 a2 90 fc 00 00 00 00	ldxdw r2, [r10 - 0x370]
   75509:	bf a1 00 00 00 00 00 00	mov64 r1, r10
   75510:	07 01 00 00 80 fc ff ff	add64 r1, -0x380
   75511:	18 04 00 00 8c bf 11 00 00 00 00 00 00 00 00 00	lddw r4, 0x11bf8c
   75513:	b7 05 00 00 04 00 00 00	mov64 r5, 0x4
   75514:	85 10 00 00 b4 dc fe ff	call -0x1234c
   75515:	79 a1 80 fc 00 00 00 00	ldxdw r1, [r10 - 0x380]
