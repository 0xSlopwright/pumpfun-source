
/mnt/c/Users/ahi20/Documents/ChatGPT/pumpfun-source/evidence/original/pump/deployed.so:	file format elf64-sbf

Disassembly of section .text:

0000000000000120 <.text>:
   67456:	mov64 r6, r5
   67457:	stxdw [r10 - 0x1e0], r4
   67458:	stxdw [r10 - 0x1d8], r3
   67459:	mov64 r8, r1
   67460:	stxdw [r10 - 0x1d0], r2
   67461:	ldxdw r9, [r2 + 0x28]
   67462:	ldxdw r7, [r6 - 0x1000]
   67463:	ldxdw r4, [r6 - 0xff8]
   67464:	stxdw [r10 - 0x1c8], r9
   67465:	add64 r9, 0x8
   67466:	mov64 r1, r10
   67467:	add64 r1, -0x120
   67468:	mov64 r2, r9
   67469:	mov64 r3, r7
   67470:	call 0x39ef
   67471:	ldxdw r1, [r10 - 0x120]
   67472:	jne r1, 0x2, +0xb3 <.text+0x84100>
   67473:	stxdw [r10 - 0x1e8], r8
   67474:	ldxdw r3, [r6 - 0xfe0]
   67475:	mov64 r2, 0x0
   67476:	jeq r3, 0x0, +0x1 <.text+0x83b90>
   67477:	ldxdw r2, [r3 + 0x20]
   67478:	mov64 r1, r7
   67479:	add64 r1, r2
   67480:	mov64 r2, 0x1
   67481:	jlt r1, r7, +0x1 <.text+0x83bb8>
   67482:	mov64 r2, 0x0
   67483:	and64 r2, 0x1
   67484:	jne r2, 0x0, +0xab <.text+0x84120>
   67485:	stxdw [r10 - 0x208], r3
   67486:	ldxdw r3, [r10 - 0x1d0]
   67487:	mov64 r2, r3
   67488:	add64 r2, 0x18
   67489:	ldxdw r4, [r6 - 0xfc8]
   67490:	stxdw [r10 - 0x1f0], r4
   67491:	ldxdw r4, [r6 - 0xfd0]
   67492:	stxdw [r10 - 0x220], r4
   67493:	ldxdw r4, [r6 - 0xfd8]
   67494:	stxdw [r10 - 0x218], r4
   67495:	ldxdw r4, [r6 - 0xfe8]
   67496:	stxdw [r10 - 0x1f8], r4
   67497:	ldxdw r4, [r6 - 0xff0]
   67498:	stxdw [r10 - 0x200], r4
   67499:	mov64 r6, r3
   67500:	ldxdw r8, [r6 + 0x30]
   67501:	ldxdw r7, [r6 + 0x48]
   67502:	ldxdw r4, [r6 + 0x8]
   67503:	ldxdw r3, [r4 + 0x58]
   67504:	ldxdw r5, [r3 + 0x0]
   67505:	ldxdw r0, [r5 + 0x18]
   67506:	stxdw [r10 - 0x28], r0
   67507:	ldxdw r0, [r5 + 0x10]
   67508:	stxdw [r10 - 0x30], r0
   67509:	ldxdw r0, [r5 + 0x8]
   67510:	stxdw [r10 - 0x38], r0
   67511:	ldxdw r5, [r5 + 0x0]
   67512:	stxdw [r10 - 0x40], r5
   67513:	lddw r5, 0x1b683a
   67515:	stxdw [r10 - 0x110], r5
   67516:	mov64 r5, r10
   67517:	add64 r5, -0x40
   67518:	stxdw [r10 - 0x100], r5
   67519:	mov64 r5, r10
   67520:	add64 r5, -0x70
   67521:	stxdw [r10 - 0xf0], r5
   67522:	mov64 r5, r10
   67523:	add64 r5, -0x110
   67524:	stxdw [r10 - 0x58], r5
   67525:	ldxdw r5, [r10 - 0x1d8]
   67526:	stxb [r10 - 0x70], r5
   67527:	stdw [r10 - 0x108], 0xd
   67528:	stdw [r10 - 0xf8], 0x20
   67529:	stdw [r10 - 0xe8], 0x1
   67530:	stdw [r10 - 0x50], 0x3
   67531:	ldxb r4, [r4 + 0x30]
   67532:	stxdw [r10 - 0xfe8], r1
   67533:	mov64 r1, r10
   67534:	add64 r1, -0x58
   67535:	stxdw [r10 - 0xfe0], r1
   67536:	stxdw [r10 - 0xff0], r3
   67537:	stxdw [r10 - 0xff8], r4
   67538:	ldxdw r1, [r10 - 0x1c8]
   67539:	stxdw [r10 - 0x1000], r1
   67540:	mov64 r1, r10
   67541:	add64 r1, -0x130
   67542:	mov64 r5, r10
   67543:	stxdw [r10 - 0x1d8], r8
   67544:	mov64 r3, r8
   67545:	stxdw [r10 - 0x210], r7
   67546:	mov64 r4, r7
   67547:	call 0x16dd
   67548:	ldxdw r1, [r10 - 0x130]
   67549:	jeq r1, 0x2, +0x1 <.text+0x83dd8>
   67550:	ja +0xab <.text+0x84330>
   67551:	ldxdw r1, [r10 - 0x1f0]
   67552:	ldxdw r1, [r6 + 0x40]
   67553:	stxdw [r10 - 0x228], r1
   67554:	ldxdw r1, [r1 + 0x0]
   67555:	ldxdw r2, [r1 + 0x18]
   67556:	stxdw [r10 - 0xf8], r2
   67557:	ldxdw r2, [r1 + 0x10]
   67558:	stxdw [r10 - 0x100], r2
   67559:	ldxdw r2, [r1 + 0x8]
   67560:	stxdw [r10 - 0x108], r2
   67561:	ldxdw r1, [r1 + 0x0]
   67562:	stxdw [r10 - 0x110], r1
   67563:	ldxdw r2, [r6 + 0x0]
   67564:	mov64 r1, r10
   67565:	add64 r1, -0x110
   67566:	mov64 r7, r2
   67567:	add64 r2, 0x288
   67568:	mov64 r3, 0x20
   67569:	call 0x25edd
   67570:	lsh64 r0, 0x20
   67571:	rsh64 r0, 0x20
   67572:	jeq r0, 0x0, +0x98 <.text+0x84348>
   67573:	ldxdw r6, [r6 + 0x58]
   67574:	stdw [r10 - 0xf8], 0x0
   67575:	stdw [r10 - 0x100], 0x0
   67576:	stdw [r10 - 0x108], 0x0
   67577:	stdw [r10 - 0x110], 0x0
   67578:	add64 r6, 0x8
   67579:	mov64 r2, r10
   67580:	add64 r2, -0x110
   67581:	mov64 r1, r6
   67582:	mov64 r3, 0x20
   67583:	call 0x25ecf
   67584:	lsh64 r0, 0x20
   67585:	rsh64 r0, 0x20
   67586:	jne r0, 0x0, +0xa <.text+0x83f48>
   67587:	ldxdw r1, [r10 - 0x228]
   67588:	ldxdw r1, [r1 + 0x0]
   67589:	ldxdw r2, [r1 + 0x18]
   67590:	stxdw [r6 + 0x18], r2
   67591:	ldxdw r2, [r1 + 0x10]
   67592:	stxdw [r6 + 0x10], r2
   67593:	ldxdw r2, [r1 + 0x8]
   67594:	stxdw [r6 + 0x8], r2
   67595:	ldxdw r1, [r1 + 0x0]
   67596:	stxdw [r6 + 0x0], r1
   67597:	add64 r7, 0x8
   67598:	mov64 r1, r10
   67599:	add64 r1, -0x110
   67600:	mov64 r2, r9
   67601:	mov64 r3, r7
   67602:	ldxdw r4, [r10 - 0x200]
   67603:	ldxdw r5, [r10 - 0x1f8]
   67604:	call 0x3b66
   67605:	ldxdw r1, [r10 - 0x110]
   67606:	jeq r1, 0x2, +0x1 <.text+0x83fa0>
   67607:	ja +0x10a <.text+0x847f0>
   67608:	ldxdw r6, [r10 - 0x108]
   67609:	mov64 r2, 0x0
   67610:	ldxdw r4, [r10 - 0x208]
   67611:	jeq r4, 0x0, +0x10 <.text+0x84040>
   67612:	ldxdw r1, [r4 + 0x20]
   67613:	ldxdw r2, [r10 - 0x1c8]
   67614:	stxdw [r2 + 0x90], r1
   67615:	ldxdw r1, [r4 + 0x28]
   67616:	stxdw [r2 + 0x98], r1
   67617:	ldxdw r5, [r4 + 0x8]
   67618:	ldxdw r4, [r4 + 0x0]
   67619:	mov64 r1, r10
   67620:	add64 r1, -0x110
   67621:	mov64 r2, r9
   67622:	mov64 r3, r7
   67623:	call 0x3b53
   67624:	ldxdw r1, [r10 - 0x110]
   67625:	jeq r1, 0x2, +0x1 <.text+0x84038>
   67626:	ja +0xf7 <.text+0x847f0>
   67627:	ldxdw r2, [r10 - 0x108]
   67628:	mov64 r9, r6
   67629:	add64 r9, r2
   67630:	mov64 r1, 0x1
   67631:	jlt r9, r6, +0x1 <.text+0x84068>
   67632:	mov64 r1, 0x0
   67633:	and64 r1, 0x1
   67634:	jne r1, 0x0, +0x85 <.text+0x844a0>
   67635:	stxdw [r10 - 0x1d8], r2
   67636:	ldxdw r1, [r10 - 0x1e0]
   67637:	jne r1, 0x0, +0x1 <.text+0x84098>
   67638:	ja +0x8a <.text+0x844e8>
   67639:	mov64 r1, r10
   67640:	add64 r1, -0x110
   67641:	ldxdw r2, [r10 - 0x218]
   67642:	ldxdw r3, [r10 - 0x220]
   67643:	call -0x533
   67644:	ldxdw r1, [r10 - 0x110]
   67645:	ldxdw r8, [r10 - 0x1d0]
   67646:	jeq r1, 0x2, +0x1 <.text+0x840e0>
   67647:	ja +0xe2 <.text+0x847f0>
   67648:	mov64 r1, 0x0
   67649:	ldxdw r6, [r10 - 0x108]
   67650:	mov64 r2, 0x0
   67651:	ja +0x81 <.text+0x84508>
   67652:	ldxdw r2, [r10 - 0x118]
   67653:	stxdw [r8 + 0x8], r1
   67654:	stxdw [r8 + 0x10], r2
   67655:	ja +0x40 <.text+0x84320>
   67656:	mov64 r1, r10
   67657:	add64 r1, -0x70
   67658:	lddw r2, 0x1b5efc
   67660:	call 0x1a623
   67661:	stdw [r10 - 0x48], 0x0
   67662:	stdw [r10 - 0x50], 0x1
   67663:	stdw [r10 - 0x58], 0x0
   67664:	lddw r1, 0x1bd838
   67666:	stxdw [r10 - 0x18], r1
   67667:	mov64 r1, r10
   67668:	add64 r1, -0x58
   67669:	stxdw [r10 - 0x20], r1
   67670:	stb [r10 - 0x8], 0x3
   67671:	stdw [r10 - 0x10], 0x20
   67672:	stdw [r10 - 0x30], 0x0
   67673:	stdw [r10 - 0x40], 0x0
   67674:	mov64 r2, r10
   67675:	add64 r2, -0x40
   67676:	lddw r1, 0x1b5efc
   67678:	call 0x1b372
   67679:	jeq r0, 0x0, +0xa <.text+0x84230>
   67680:	mov64 r3, r10
   67681:	add64 r3, -0x110
   67682:	lddw r1, 0x1b5fa4
   67684:	mov64 r2, 0x37
   67685:	lddw r4, 0x1bd868
   67687:	lddw r5, 0x1bd888
   67689:	call 0x25159
   67690:	ldxdw r1, [r10 - 0x48]
   67691:	stxdw [r10 - 0xc8], r1
   67692:	ldxdw r1, [r10 - 0x50]
   67693:	stxdw [r10 - 0xd0], r1
   67694:	ldxdw r1, [r10 - 0x58]
   67695:	stxdw [r10 - 0xd8], r1
   67696:	ldxdw r1, [r10 - 0x70]
   67697:	stxdw [r10 - 0xf0], r1
   67698:	ldxdw r1, [r10 - 0x68]
   67699:	stxdw [r10 - 0xe8], r1
   67700:	ldxdw r1, [r10 - 0x60]
   67701:	stxdw [r10 - 0xe0], r1
   67702:	lddw r1, 0x1b723b
   67704:	stxdw [r10 - 0x108], r1
   67705:	stw [r10 - 0x78], 0x1788
   67706:	stb [r10 - 0xc0], 0x2
   67707:	stw [r10 - 0xf8], 0x2b3
   67708:	stdw [r10 - 0x100], 0x1d
   67709:	stdw [r10 - 0x110], 0x0
   67710:	mov64 r1, r10
   67711:	add64 r1, -0x1c0
   67712:	mov64 r2, r10
   67713:	add64 r2, -0x110
   67714:	call 0x22ee3
   67715:	ldxdw r1, [r10 - 0x1c0]
   67716:	ldxdw r2, [r10 - 0x1b8]
   67717:	ldxdw r8, [r10 - 0x1e8]
   67718:	stxdw [r8 + 0x10], r2
   67719:	stxdw [r8 + 0x8], r1
   67720:	stdw [r8 + 0x0], 0x1
   67721:	exit
   67722:	ldxdw r2, [r10 - 0x128]
   67723:	ldxdw r8, [r10 - 0x1e8]
   67724:	ja -0x48 <.text+0x84108>
   67725:	ldxdw r8, [r10 - 0x1d8]
   67726:	mov64 r2, r8
   67727:	add64 r2, 0x20
   67728:	mov64 r1, r10
   67729:	add64 r1, -0x140
   67730:	call -0xf981
   67731:	ldxdw r1, [r10 - 0x140]
   67732:	jeq r1, 0x2, +0x1 <.text+0x84390>
   67733:	ja +0x1f <.text+0x84488>
   67734:	ldxdw r2, [r10 - 0x210]
   67735:	add64 r2, 0x20
   67736:	mov64 r1, r10
   67737:	add64 r1, -0x150
   67738:	call -0xf989
   67739:	ldxdw r1, [r10 - 0x150]
   67740:	jeq r1, 0x2, +0x1 <.text+0x843d0>
   67741:	ja +0x20 <.text+0x844d0>
   67742:	ldxdw r2, [r10 - 0x1c8]
   67743:	ldxdw r1, [r2 + 0x40]
   67744:	stxdw [r10 - 0xf8], r1
   67745:	ldxdw r1, [r2 + 0x38]
   67746:	stxdw [r10 - 0x100], r1
   67747:	ldxdw r1, [r2 + 0x30]
   67748:	stxdw [r10 - 0x108], r1
   67749:	ldxdw r1, [r2 + 0x28]
   67750:	stxdw [r10 - 0x110], r1
   67751:	ldxdw r3, [r8 + 0x68]
   67752:	ldxdw r1, [r10 - 0x210]
   67753:	ldxdw r4, [r1 + 0x68]
   67754:	mov64 r1, r10
   67755:	add64 r1, -0x160
   67756:	mov64 r5, r10
   67757:	add64 r5, -0x110
   67758:	mov64 r2, r9
   67759:	call 0x3bce
   67760:	ldxdw r1, [r10 - 0x160]
   67761:	jeq r1, 0x2, -0xbd <.text+0x83e88>
   67762:	ldxdw r2, [r10 - 0x158]
   67763:	ldxdw r8, [r10 - 0x1e8]
   67764:	ja -0x70 <.text+0x84108>
   67765:	ldxdw r2, [r10 - 0x138]
   67766:	ldxdw r8, [r10 - 0x1e8]
   67767:	ja -0x73 <.text+0x84108>
   67768:	mov64 r1, r10
   67769:	add64 r1, -0x1b0
   67770:	call 0x73
   67771:	ldxdw r1, [r10 - 0x1b0]
   67772:	ldxdw r2, [r10 - 0x1a8]
   67773:	ja -0x39 <.text+0x84308>
   67774:	ldxdw r2, [r10 - 0x148]
   67775:	ldxdw r8, [r10 - 0x1e8]
   67776:	ja -0x7c <.text+0x84108>
   67777:	ldxdw r8, [r10 - 0x1d0]
   67778:	ldxdw r1, [r8 + 0x50]
   67779:	ldxdw r2, [r8 + 0x38]
   67780:	ldxdw r6, [r10 - 0x218]
   67781:	mov64 r7, r8
   67782:	add64 r7, 0x20
   67783:	mov64 r4, r8
   67784:	add64 r4, 0x40
   67785:	ldxdw r3, [r8 + 0x70]
   67786:	ldxdw r0, [r8 + 0x10]
   67787:	ldxb r5, [r0 + 0x30]
   67788:	stxdw [r10 - 0x1d0], r0
   67789:	ldxdw r0, [r0 + 0x58]
   67790:	stxdw [r10 - 0xfd8], r1
   67791:	stxdw [r10 - 0xfd0], r2
   67792:	stxdw [r10 - 0xfe0], r0
   67793:	stxdw [r10 - 0xfe8], r5
   67794:	stxdw [r10 - 0xff0], r7
   67795:	stxdw [r10 - 0xff8], r6
   67796:	ldxdw r1, [r10 - 0x1c8]
   67797:	stxdw [r10 - 0x1000], r1
   67798:	mov64 r1, r10
   67799:	add64 r1, -0x170
   67800:	mov64 r5, r10
   67801:	ldxdw r6, [r10 - 0x1e0]
   67802:	mov64 r2, r6
   67803:	call 0x264a
   67804:	ldxdw r1, [r10 - 0x170]
   67805:	jne r1, 0x2, +0x14 <.text+0x84670>
   67806:	mov64 r4, r8
   67807:	add64 r4, 0x68
   67808:	jne r6, 0x0, +0x1 <.text+0x845f0>
   67809:	ja +0x12 <.text+0x84680>
   67810:	ldxdw r2, [r4 + 0x0]
   67811:	mov64 r6, r10
   67812:	add64 r6, -0x110
   67813:	mov64 r1, r6
   67814:	call -0xe758
   67815:	mov64 r1, r10
   67816:	add64 r1, -0x190
   67817:	ldxdw r2, [r10 - 0x1c8]
   67818:	mov64 r3, r6
   67819:	mov64 r4, r9
   67820:	call 0x23ca
   67821:	ldxdw r1, [r10 - 0x190]
   67822:	jeq r1, 0x2, +0x17 <.text+0x84710>
   67823:	ldxdw r2, [r10 - 0x188]
   67824:	ldxdw r8, [r10 - 0x1e8]
   67825:	ja -0xad <.text+0x84108>
   67826:	ldxdw r2, [r10 - 0x168]
   67827:	ja -0x6f <.text+0x84308>
   67828:	ldxdw r2, [r10 - 0x1d0]
   67829:	ldxb r1, [r2 + 0x30]
   67830:	ldxdw r2, [r2 + 0x58]
   67831:	stxdw [r10 - 0xff0], r2
   67832:	stxdw [r10 - 0xfe8], r9
   67833:	stxdw [r10 - 0xff8], r1
   67834:	ldxdw r1, [r10 - 0x228]
   67835:	stxdw [r10 - 0x1000], r1
   67836:	add64 r8, 0x50
   67837:	mov64 r1, r10
   67838:	add64 r1, -0x180
   67839:	mov64 r5, r10
   67840:	mov64 r2, r7
   67841:	mov64 r3, r8
   67842:	call 0x1c01
   67843:	ldxdw r1, [r10 - 0x180]
   67844:	jeq r1, 0x2, +0x1 <.text+0x84710>
   67845:	ja +0x1e <.text+0x84800>
   67846:	mov64 r1, r10
   67847:	add64 r1, -0x110
   67848:	ldxdw r7, [r10 - 0x1f0]
   67849:	mov64 r2, r7
   67850:	mov64 r3, r9
   67851:	call 0x2110
   67852:	ldxdw r1, [r10 - 0x110]
   67853:	jeq r1, 0x2, +0x1 <.text+0x84758>
   67854:	ja +0x13 <.text+0x847f0>
   67855:	ldxdw r6, [r10 - 0x108]
   67856:	mov64 r1, r10
   67857:	add64 r1, -0x110
   67858:	mov64 r2, r7
   67859:	ldxdw r3, [r10 - 0x1d8]
   67860:	call 0x2107
   67861:	ldxdw r1, [r10 - 0x110]
   67862:	ldxdw r8, [r10 - 0x1e8]
   67863:	jeq r1, 0x2, +0x1 <.text+0x847a8>
   67864:	ja +0xe <.text+0x84818>
   67865:	ldxdw r1, [r10 - 0x108]
   67866:	jlt r6, r1, +0x1 <.text+0x847c0>
   67867:	ja +0xd <.text+0x84828>
   67868:	mov64 r1, r10
   67869:	add64 r1, -0x1a0
   67870:	call 0x50
   67871:	ldxdw r1, [r10 - 0x1a0]
   67872:	ldxdw r2, [r10 - 0x198]
   67873:	ja -0x9c <.text+0x84310>
   67874:	ldxdw r2, [r10 - 0x108]
   67875:	ja -0x9f <.text+0x84308>
   67876:	ldxdw r2, [r10 - 0x178]
   67877:	ldxdw r8, [r10 - 0x1e8]
   67878:	ja -0xe2 <.text+0x84108>
   67879:	ldxdw r2, [r10 - 0x108]
   67880:	ja -0xa3 <.text+0x84310>
   67881:	stxdw [r8 + 0x10], r1
   67882:	sub64 r6, r1
   67883:	stxdw [r8 + 0x8], r6
   67884:	stdw [r8 + 0x0], 0x0
   67885:	ja -0xa5 <.text+0x84328>
