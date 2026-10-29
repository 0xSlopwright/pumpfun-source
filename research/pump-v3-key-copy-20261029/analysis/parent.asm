
/home/ahi200/pumpfun-work/20261029-pump-legacy-exact-sol/costs-parent/symbols.so:	file format elf64-sbf

Disassembly of section .text:

000000000009ecb8 <_ZN14pump_recovered5trade14v3_execute_buy17h0bbdfae6606c2cb2E>:
   81303:	mov64 r6, r5
   81304:	stxdw [r10 - 0x1e0], r4
   81305:	stxdw [r10 - 0x1d8], r3
   81306:	mov64 r8, r1
   81307:	stxdw [r10 - 0x1d0], r2
   81308:	ldxdw r9, [r2 + 0x28]
   81309:	ldxdw r7, [r6 - 0x1000]
   81310:	ldxdw r4, [r6 - 0xff8]
   81311:	stxdw [r10 - 0x1c8], r9
   81312:	add64 r9, 0x8
   81313:	mov64 r1, r10
   81314:	add64 r1, -0x120
   81315:	mov64 r2, r9
   81316:	mov64 r3, r7
   81317:	call 0x2738
   81318:	ldxdw r1, [r10 - 0x120]
   81319:	jne r1, 0x2, +0xb2 <LBB381_20>
   81320:	stxdw [r10 - 0x1e8], r8
   81321:	ldxdw r3, [r6 - 0xfe0]
   81322:	mov64 r2, 0x0
   81323:	jeq r3, 0x0, +0x1 <LBB381_3>
   81324:	ldxdw r2, [r3 + 0x20]

000000000009ed68 <LBB381_3>:
   81325:	mov64 r1, r7
   81326:	add64 r1, r2
   81327:	mov64 r2, 0x1
   81328:	jlt r1, r7, +0x1 <LBB381_5>
   81329:	mov64 r2, 0x0

000000000009ed90 <LBB381_5>:
   81330:	and64 r2, 0x1
   81331:	jne r2, 0x0, +0xaa <LBB381_22>
   81332:	stxdw [r10 - 0x200], r3
   81333:	ldxdw r7, [r6 - 0xfc8]
   81334:	ldxdw r2, [r6 - 0xfd0]
   81335:	stxdw [r10 - 0x210], r2
   81336:	ldxdw r2, [r6 - 0xfd8]
   81337:	stxdw [r10 - 0x208], r2
   81338:	ldxdw r2, [r6 - 0xfe8]
   81339:	stxdw [r10 - 0x1f0], r2
   81340:	ldxdw r2, [r6 - 0xff0]
   81341:	stxdw [r10 - 0x1f8], r2
   81342:	ldxdw r6, [r10 - 0x1d0]
   81343:	ldxdw r3, [r6 + 0x8]
   81344:	ldxb r2, [r3 + 0x30]
   81345:	ldxdw r8, [r3 + 0x58]
   81346:	ldxdw r4, [r6 + 0x48]
   81347:	ldxdw r3, [r6 + 0x30]
   81348:	ldxdw r0, [r8 + 0x0]
   81349:	ldxdw r5, [r0 + 0x18]
   81350:	stxdw [r10 - 0x28], r5
   81351:	ldxdw r5, [r0 + 0x10]
   81352:	stxdw [r10 - 0x30], r5
   81353:	ldxdw r5, [r0 + 0x8]
   81354:	stxdw [r10 - 0x38], r5
   81355:	ldxdw r5, [r0 + 0x0]
   81356:	stxdw [r10 - 0x40], r5
   81357:	lddw r5, 0x1b8b76
   81359:	stxdw [r10 - 0x110], r5
   81360:	mov64 r5, r10
   81361:	add64 r5, -0x40
   81362:	stxdw [r10 - 0x100], r5
   81363:	mov64 r5, r10
   81364:	add64 r5, -0x70
   81365:	stxdw [r10 - 0xf0], r5
   81366:	mov64 r5, r10
   81367:	add64 r5, -0x110
   81368:	stxdw [r10 - 0x58], r5
   81369:	ldxdw r5, [r10 - 0x1d8]
   81370:	stxb [r10 - 0x70], r5
   81371:	stdw [r10 - 0x108], 0xd
   81372:	stdw [r10 - 0xf8], 0x20
   81373:	stdw [r10 - 0xe8], 0x1
   81374:	stdw [r10 - 0x50], 0x3
   81375:	stxdw [r10 - 0xfe8], r1
   81376:	mov64 r1, r10
   81377:	add64 r1, -0x58
   81378:	stxdw [r10 - 0xfe0], r1
   81379:	stxdw [r10 - 0xff0], r8
   81380:	stxdw [r10 - 0xff8], r2
   81381:	ldxdw r1, [r10 - 0x1c8]
   81382:	stxdw [r10 - 0x1000], r1
   81383:	mov64 r2, r6
   81384:	add64 r2, 0x18
   81385:	mov64 r1, r10
   81386:	add64 r1, -0x130
   81387:	mov64 r5, r10
   81388:	stxdw [r10 - 0x1d8], r3
   81389:	mov64 r8, r4
   81390:	call -0xfc71
   81391:	ldxdw r1, [r10 - 0x130]
   81392:	jeq r1, 0x2, +0x1 <LBB381_7>
   81393:	ja +0xae <LBB381_29>

000000000009ef90 <LBB381_7>:
   81394:	stxdw [r10 - 0x220], r7
   81395:	ldxdw r1, [r6 + 0x40]
   81396:	stxdw [r10 - 0x218], r1
   81397:	ldxdw r1, [r1 + 0x0]
   81398:	ldxdw r2, [r1 + 0x18]
   81399:	stxdw [r10 - 0xf8], r2
   81400:	ldxdw r2, [r1 + 0x10]
   81401:	stxdw [r10 - 0x100], r2
   81402:	ldxdw r2, [r1 + 0x8]
   81403:	stxdw [r10 - 0x108], r2
   81404:	ldxdw r1, [r1 + 0x0]
   81405:	stxdw [r10 - 0x110], r1
   81406:	ldxdw r2, [r6 + 0x0]
   81407:	mov64 r1, r10
   81408:	add64 r1, -0x110
   81409:	mov64 r7, r2
   81410:	add64 r2, 0x288
   81411:	mov64 r3, 0x20
   81412:	call 0x22d36
   81413:	lsh64 r0, 0x20
   81414:	rsh64 r0, 0x20
   81415:	jeq r0, 0x0, +0x9b <LBB381_30>

000000000009f040 <LBB381_8>:
   81416:	ldxdw r6, [r6 + 0x58]
   81417:	stdw [r10 - 0xf8], 0x0
   81418:	stdw [r10 - 0x100], 0x0
   81419:	stdw [r10 - 0x108], 0x0
   81420:	stdw [r10 - 0x110], 0x0
   81421:	add64 r6, 0x8
   81422:	mov64 r2, r10
   81423:	add64 r2, -0x110
   81424:	mov64 r1, r6
   81425:	mov64 r3, 0x20
   81426:	call 0x22d28
   81427:	lsh64 r0, 0x20
   81428:	rsh64 r0, 0x20
   81429:	jeq r0, 0x0, +0x1 <LBB381_9>
   81430:	ja +0xa <LBB381_10>

000000000009f0b8 <LBB381_9>:
   81431:	ldxdw r1, [r10 - 0x218]
   81432:	ldxdw r1, [r1 + 0x0]
   81433:	ldxdw r2, [r1 + 0x0]
   81434:	ldxdw r3, [r1 + 0x8]
   81435:	ldxdw r4, [r1 + 0x10]
   81436:	ldxdw r1, [r1 + 0x18]
   81437:	stxdw [r6 + 0x18], r1
   81438:	stxdw [r6 + 0x10], r4
   81439:	stxdw [r6 + 0x8], r3
   81440:	stxdw [r6 + 0x0], r2

000000000009f108 <LBB381_10>:
   81441:	add64 r7, 0x8
   81442:	mov64 r1, r10
   81443:	add64 r1, -0x110
   81444:	mov64 r2, r9
   81445:	mov64 r3, r7
   81446:	ldxdw r4, [r10 - 0x1f8]
   81447:	ldxdw r5, [r10 - 0x1f0]
   81448:	call 0x28b2
   81449:	ldxdw r1, [r10 - 0x110]
   81450:	jne r1, 0x2, +0x10a <LBB381_43>
   81451:	ldxdw r6, [r10 - 0x108]
   81452:	mov64 r4, 0x0
   81453:	ldxdw r0, [r10 - 0x200]
   81454:	jeq r0, 0x0, +0x10 <LBB381_14>
   81455:	ldxdw r1, [r0 + 0x20]
   81456:	ldxdw r2, [r10 - 0x1c8]
   81457:	stxdw [r2 + 0x90], r1
   81458:	ldxdw r1, [r0 + 0x28]
   81459:	stxdw [r2 + 0x98], r1
   81460:	ldxdw r5, [r0 + 0x8]
   81461:	ldxdw r4, [r0 + 0x0]
   81462:	mov64 r1, r10
   81463:	add64 r1, -0x110
   81464:	mov64 r2, r9
   81465:	mov64 r3, r7
   81466:	call 0x28a0
   81467:	ldxdw r1, [r10 - 0x110]
   81468:	jeq r1, 0x2, +0x1 <LBB381_13>
   81469:	ja +0xf7 <LBB381_43>

000000000009f1f0 <LBB381_13>:
   81470:	ldxdw r4, [r10 - 0x108]

000000000009f1f8 <LBB381_14>:
   81471:	mov64 r9, r6
   81472:	add64 r9, r4
   81473:	mov64 r1, 0x1
   81474:	jlt r9, r6, +0x1 <LBB381_16>
   81475:	mov64 r1, 0x0

000000000009f220 <LBB381_16>:
   81476:	and64 r1, 0x1
   81477:	ldxdw r2, [r10 - 0x1e0]
   81478:	jne r1, 0x0, +0x86 <LBB381_35>
   81479:	stxdw [r10 - 0x1d8], r4
   81480:	ldxdw r8, [r10 - 0x1d0]
   81481:	ldxdw r7, [r8 + 0x70]
   81482:	jne r2, 0x0, +0x1 <LBB381_18>
   81483:	ja +0x8a <LBB381_37>

000000000009f260 <LBB381_18>:
   81484:	mov64 r1, r10
   81485:	add64 r1, -0x110
   81486:	ldxdw r2, [r10 - 0x208]
   81487:	ldxdw r3, [r10 - 0x210]
   81488:	call -0xa11
   81489:	ldxdw r1, [r10 - 0x110]
   81490:	jeq r1, 0x2, +0x1 <LBB381_19>
   81491:	ja +0xe1 <LBB381_43>

000000000009f2a0 <LBB381_19>:
   81492:	mov64 r1, 0x0
   81493:	ldxdw r2, [r10 - 0x108]
   81494:	stxdw [r10 - 0x208], r2
   81495:	mov64 r0, 0x0
   81496:	ldxdw r2, [r10 - 0x1e0]
   81497:	ja +0x7e <LBB381_38>

000000000009f2d0 <LBB381_20>:
   81498:	ldxdw r2, [r10 - 0x118]

000000000009f2d8 <LBB381_21>:
   81499:	stxdw [r8 + 0x8], r1
   81500:	stxdw [r8 + 0x10], r2
   81501:	ja +0x40 <LBB381_27>

000000000009f2f0 <LBB381_22>:
   81502:	mov64 r1, r10
   81503:	add64 r1, -0x70
   81504:	lddw r2, 0x1b827c
   81506:	call 0x17113
   81507:	stdw [r10 - 0x48], 0x0
   81508:	stdw [r10 - 0x50], 0x1
   81509:	stdw [r10 - 0x58], 0x0
   81510:	lddw r1, 0x1bfb98
   81512:	stxdw [r10 - 0x18], r1
   81513:	mov64 r1, r10
   81514:	add64 r1, -0x58
   81515:	stxdw [r10 - 0x20], r1
   81516:	stb [r10 - 0x8], 0x3
   81517:	stdw [r10 - 0x10], 0x20
   81518:	stdw [r10 - 0x30], 0x0
   81519:	stdw [r10 - 0x40], 0x0
   81520:	mov64 r2, r10
   81521:	add64 r2, -0x40
   81522:	lddw r1, 0x1b827c
   81524:	call 0x17e62
   81525:	jeq r0, 0x0, +0xa <LBB381_24>
   81526:	mov64 r3, r10
   81527:	add64 r3, -0x110
   81528:	lddw r1, 0x1b8324
   81530:	mov64 r2, 0x37
   81531:	lddw r4, 0x1bfbc8
   81533:	lddw r5, 0x1bfbe8
   81535:	call 0x21faf

000000000009f400 <LBB381_24>:
   81536:	ldxdw r1, [r10 - 0x48]
   81537:	stxdw [r10 - 0xc8], r1
   81538:	ldxdw r1, [r10 - 0x50]
   81539:	stxdw [r10 - 0xd0], r1
   81540:	ldxdw r1, [r10 - 0x58]
   81541:	stxdw [r10 - 0xd8], r1
   81542:	ldxdw r1, [r10 - 0x70]
   81543:	stxdw [r10 - 0xf0], r1
   81544:	ldxdw r1, [r10 - 0x68]
   81545:	stxdw [r10 - 0xe8], r1
   81546:	ldxdw r1, [r10 - 0x60]
   81547:	stxdw [r10 - 0xe0], r1
   81548:	lddw r1, 0x1b95a2
   81550:	stxdw [r10 - 0x108], r1
   81551:	stw [r10 - 0x78], 0x1788
   81552:	stb [r10 - 0xc0], 0x2
   81553:	stw [r10 - 0xf8], 0x2b3
   81554:	stdw [r10 - 0x100], 0x1d
   81555:	stdw [r10 - 0x110], 0x0
   81556:	mov64 r1, r10
   81557:	add64 r1, -0x1c0
   81558:	mov64 r2, r10
   81559:	add64 r2, -0x110
   81560:	call 0x1fd39
   81561:	ldxdw r1, [r10 - 0x1c0]
   81562:	ldxdw r2, [r10 - 0x1b8]

000000000009f4d8 <LBB381_25>:
   81563:	ldxdw r8, [r10 - 0x1e8]

000000000009f4e0 <LBB381_26>:
   81564:	stxdw [r8 + 0x10], r2
   81565:	stxdw [r8 + 0x8], r1

000000000009f4f0 <LBB381_27>:
   81566:	stdw [r8 + 0x0], 0x1

000000000009f4f8 <LBB381_28>:
   81567:	exit

000000000009f500 <LBB381_29>:
   81568:	ldxdw r2, [r10 - 0x128]
   81569:	ldxdw r8, [r10 - 0x1e8]
   81570:	ja -0x48 <LBB381_21>

000000000009f518 <LBB381_30>:
   81571:	ldxdw r2, [r10 - 0x1d8]
   81572:	add64 r2, 0x20
   81573:	mov64 r1, r10
   81574:	add64 r1, -0x140
   81575:	call -0x12f42
   81576:	ldxdw r1, [r10 - 0x140]
   81577:	jeq r1, 0x2, +0x1 <LBB381_31>
   81578:	ja +0x1f <LBB381_34>

000000000009f558 <LBB381_31>:
   81579:	mov64 r2, r8
   81580:	add64 r2, 0x20
   81581:	mov64 r1, r10
   81582:	add64 r1, -0x150
   81583:	call -0x12f4a
   81584:	ldxdw r1, [r10 - 0x150]
   81585:	jeq r1, 0x2, +0x1 <LBB381_32>
   81586:	ja +0x20 <LBB381_36>

000000000009f598 <LBB381_32>:
   81587:	ldxdw r2, [r10 - 0x1c8]
   81588:	ldxdw r1, [r2 + 0x40]
   81589:	stxdw [r10 - 0xf8], r1
   81590:	ldxdw r1, [r2 + 0x38]
   81591:	stxdw [r10 - 0x100], r1
   81592:	ldxdw r1, [r2 + 0x30]
   81593:	stxdw [r10 - 0x108], r1
   81594:	ldxdw r1, [r2 + 0x28]
   81595:	stxdw [r10 - 0x110], r1
   81596:	ldxdw r1, [r10 - 0x1d8]
   81597:	ldxdw r3, [r1 + 0x68]
   81598:	ldxdw r4, [r8 + 0x68]
   81599:	mov64 r1, r10
   81600:	add64 r1, -0x160
   81601:	mov64 r5, r10
   81602:	add64 r5, -0x110
   81603:	mov64 r2, r9
   81604:	call 0x13cf
   81605:	ldxdw r1, [r10 - 0x160]
   81606:	jeq r1, 0x2, -0xbf <LBB381_8>
   81607:	ldxdw r2, [r10 - 0x158]
   81608:	ldxdw r8, [r10 - 0x1e8]
   81609:	ja -0x6f <LBB381_21>

000000000009f650 <LBB381_34>:
   81610:	ldxdw r2, [r10 - 0x138]
   81611:	ldxdw r8, [r10 - 0x1e8]
   81612:	ja -0x72 <LBB381_21>

000000000009f668 <LBB381_35>:
   81613:	mov64 r1, r10
   81614:	add64 r1, -0x1b0
   81615:	call 0x71
   81616:	ldxdw r1, [r10 - 0x1b0]
   81617:	ldxdw r2, [r10 - 0x1a8]
   81618:	ja -0x38 <LBB381_25>

000000000009f698 <LBB381_36>:
   81619:	ldxdw r2, [r10 - 0x148]
   81620:	ldxdw r8, [r10 - 0x1e8]
   81621:	ja -0x7b <LBB381_21>

000000000009f6b0 <LBB381_37>:
   81622:	ldxdw r0, [r8 + 0x38]
   81623:	ldxdw r1, [r8 + 0x50]

000000000009f6c0 <LBB381_38>:
   81624:	mov64 r4, r8
   81625:	add64 r4, 0x40
   81626:	ldxdw r5, [r8 + 0x10]
   81627:	ldxb r3, [r5 + 0x30]
   81628:	stxdw [r10 - 0x1e0], r5
   81629:	ldxdw r5, [r5 + 0x58]
   81630:	stxdw [r10 - 0xfd8], r1
   81631:	stxdw [r10 - 0xfd0], r0
   81632:	stxdw [r10 - 0xfe0], r5
   81633:	stxdw [r10 - 0xfe8], r3
   81634:	ldxdw r1, [r10 - 0x208]
   81635:	stxdw [r10 - 0xff8], r1
   81636:	ldxdw r1, [r10 - 0x1c8]
   81637:	stxdw [r10 - 0x1000], r1
   81638:	mov64 r6, r8
   81639:	add64 r6, 0x20
   81640:	stxdw [r10 - 0xff0], r6
   81641:	mov64 r1, r10
   81642:	add64 r1, -0x170
   81643:	mov64 r5, r10
   81644:	mov64 r3, r7
   81645:	mov64 r7, r2
   81646:	call 0x2b00
   81647:	ldxdw r1, [r10 - 0x170]
   81648:	jne r1, 0x2, +0x14 <LBB381_42>
   81649:	mov64 r4, r8
   81650:	add64 r4, 0x68
   81651:	jne r7, 0x0, +0x1 <LBB381_40>
   81652:	ja +0x12 <LBB381_44>

000000000009f7a8 <LBB381_40>:
   81653:	ldxdw r2, [r4 + 0x0]
   81654:	mov64 r6, r10
   81655:	add64 r6, -0x110
   81656:	mov64 r1, r6
   81657:	call -0x11d17
   81658:	mov64 r1, r10
   81659:	add64 r1, -0x190
   81660:	ldxdw r2, [r10 - 0x1c8]
   81661:	mov64 r3, r6
   81662:	mov64 r4, r9
   81663:	call 0xdfc
   81664:	ldxdw r1, [r10 - 0x190]
   81665:	jeq r1, 0x2, +0x17 <LBB381_45>
   81666:	ldxdw r2, [r10 - 0x188]
   81667:	ldxdw r8, [r10 - 0x1e8]
   81668:	ja -0xaa <LBB381_21>

000000000009f828 <LBB381_42>:
   81669:	ldxdw r2, [r10 - 0x168]
   81670:	ja -0x6c <LBB381_25>

000000000009f838 <LBB381_44>:
   81671:	ldxdw r2, [r10 - 0x1e0]
   81672:	ldxb r1, [r2 + 0x30]
   81673:	ldxdw r2, [r2 + 0x58]
   81674:	stxdw [r10 - 0xff0], r2
   81675:	stxdw [r10 - 0xfe8], r9
   81676:	stxdw [r10 - 0xff8], r1
   81677:	ldxdw r1, [r10 - 0x218]
   81678:	stxdw [r10 - 0x1000], r1
   81679:	add64 r8, 0x50
   81680:	mov64 r1, r10
   81681:	add64 r1, -0x180
   81682:	mov64 r5, r10
   81683:	mov64 r2, r6
   81684:	mov64 r3, r8
   81685:	call -0xcb45
   81686:	ldxdw r1, [r10 - 0x180]
   81687:	jeq r1, 0x2, +0x1 <LBB381_45>
   81688:	ja +0x1e <LBB381_50>

000000000009f8c8 <LBB381_45>:
   81689:	mov64 r1, r10
   81690:	add64 r1, -0x110
   81691:	ldxdw r7, [r10 - 0x220]
   81692:	mov64 r2, r7
   81693:	mov64 r3, r9
   81694:	call 0x12cf
   81695:	ldxdw r1, [r10 - 0x110]
   81696:	jeq r1, 0x2, +0x1 <LBB381_46>
   81697:	ja +0x13 <LBB381_43>

000000000009f910 <LBB381_46>:
   81698:	ldxdw r6, [r10 - 0x108]
   81699:	mov64 r1, r10
   81700:	add64 r1, -0x110
   81701:	mov64 r2, r7
   81702:	ldxdw r3, [r10 - 0x1d8]
   81703:	call 0x12c6
   81704:	ldxdw r1, [r10 - 0x110]
   81705:	ldxdw r8, [r10 - 0x1e8]
   81706:	jeq r1, 0x2, +0x1 <LBB381_47>
   81707:	ja +0xe <LBB381_51>

000000000009f960 <LBB381_47>:
   81708:	ldxdw r1, [r10 - 0x108]
   81709:	jlt r6, r1, +0x1 <LBB381_48>
   81710:	ja +0xd <LBB381_52>

000000000009f978 <LBB381_48>:
   81711:	mov64 r1, r10
   81712:	add64 r1, -0x1a0
   81713:	call 0x50
   81714:	ldxdw r1, [r10 - 0x1a0]
   81715:	ldxdw r2, [r10 - 0x198]
   81716:	ja -0x99 <LBB381_26>

000000000009f9a8 <LBB381_43>:
   81717:	ldxdw r2, [r10 - 0x108]
   81718:	ja -0x9c <LBB381_25>

000000000009f9b8 <LBB381_50>:
   81719:	ldxdw r2, [r10 - 0x178]
   81720:	ldxdw r8, [r10 - 0x1e8]
   81721:	ja -0xdf <LBB381_21>

000000000009f9d0 <LBB381_51>:
   81722:	ldxdw r2, [r10 - 0x108]
   81723:	ja -0xa0 <LBB381_26>

000000000009f9e0 <LBB381_52>:
   81724:	stxdw [r8 + 0x10], r1
   81725:	sub64 r6, r1
   81726:	stxdw [r8 + 0x8], r6
   81727:	stdw [r8 + 0x0], 0x0
   81728:	ja -0xa2 <LBB381_28>
