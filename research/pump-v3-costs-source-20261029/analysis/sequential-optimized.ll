define internal fastcc void @_ZN14pump_recovered5trade12v3_buy_costs17h37aedf32529d983fE(ptr dead_on_unwind noalias nocapture noundef writable writeonly align 8 dereferenceable(32) %_0, i64 noundef %buyback_bps, i8 noundef %is_mayhem, ptr noalias nocapture noundef readonly align 8 dereferenceable(32) %quote_fee, i64 noundef %quote, i64 noundef %protocol_fee, i64 noundef %creator_fee, ptr noalias nocapture noundef readonly align 8 dereferenceable_or_null(64) %0) unnamed_addr #0 {
start:
  %_11.i.i31 = alloca [0 x i8], align 1
  %formatter.i.i32 = alloca [64 x i8], align 8
  %buf.i.i33 = alloca [24 x i8], align 8
  %_3.i34 = alloca [24 x i8], align 8
  %_2.i35 = alloca [160 x i8], align 8
  %formatter.i.i = alloca [64 x i8], align 8
  %buf.i.i = alloca [24 x i8], align 8
  %_3.i = alloca [24 x i8], align 8
  %_2.i = alloca [160 x i8], align 8
  %_4.i = alloca [16 x i8], align 8
  %_30 = alloca [16 x i8], align 8
  %_24 = alloca [16 x i8], align 8
  %_10.not = icmp eq i8 %is_mayhem, 0
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i.i31)
  br i1 %_10.not, label %bb3.i16, label %_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit30

bb3.i16:                                          ; preds = %start
  %_6.i17 = zext i64 %buyback_bps to i128
  %_7.i18 = zext i64 %protocol_fee to i128
  %1 = mul nuw i128 %_7.i18, %_6.i17
  %_15.i19 = icmp ugt i128 %1, 184467440737095516159999
  br i1 %_15.i19, label %bb5.i29, label %bb6.i20

bb6.i20:                                          ; preds = %bb3.i16
  %scaled.i21 = udiv i128 %1, 10000
  %_16.i22 = trunc i128 %scaled.i21 to i64
  %_21.not.i23 = icmp ugt i64 %_16.i22, %protocol_fee
  br i1 %_21.not.i23, label %bb8.i28, label %_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit30.thread

bb5.i29:                                          ; preds = %bb3.i16
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_32439d5d787bfd24f2fa4e3df982e7bc, i64 noundef 35, ptr noundef nonnull align 1 %_11.i.i31, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.f, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_b3944b4d357d1afa44dc73dabeb6bdd0) #29
  unreachable

bb8.i28:                                          ; preds = %bb6.i20
; call core::option::expect_failed
  tail call void @_ZN4core6option13expect_failed17h7e2cb204b05dab71E(ptr noalias noundef nonnull readonly align 1 @alloc_c53ee819a6028c03a31d0ed6681cb6a4, i64 noundef 38, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_8ba37cc28eaf1e56bec2db807e046a73) #29
  unreachable

_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit30: ; preds = %start
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i.i31)
  %2 = icmp eq ptr %0, null
  br i1 %2, label %bb6, label %bb4

_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit30.thread: ; preds = %bb6.i20
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i.i31)
  %3 = icmp eq ptr %0, null
  br i1 %3, label %bb6, label %bb3.i

bb4:                                              ; preds = %_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit30
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i.i31)
  br label %_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit

bb3.i:                                            ; preds = %_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit30.thread
  %_1547 = load i64, ptr %0, align 8, !noundef !2
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i.i31)
  %_7.i = zext i64 %_1547 to i128
  %4 = mul nuw i128 %_7.i, %_6.i17
  %_15.i = icmp ugt i128 %4, 184467440737095516159999
  br i1 %_15.i, label %bb5.i14, label %bb6.i11

bb6.i11:                                          ; preds = %bb3.i
  %scaled.i = udiv i128 %4, 10000
  %_16.i = trunc i128 %scaled.i to i64
  %_21.not.i = icmp ult i64 %_1547, %_16.i
  br i1 %_21.not.i, label %bb8.i13, label %_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit

bb5.i14:                                          ; preds = %bb3.i
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_32439d5d787bfd24f2fa4e3df982e7bc, i64 noundef 35, ptr noundef nonnull align 1 %_11.i.i31, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.f, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_b3944b4d357d1afa44dc73dabeb6bdd0) #29
  unreachable

bb8.i13:                                          ; preds = %bb6.i11
; call core::option::expect_failed
  tail call void @_ZN4core6option13expect_failed17h7e2cb204b05dab71E(ptr noalias noundef nonnull readonly align 1 @alloc_c53ee819a6028c03a31d0ed6681cb6a4, i64 noundef 38, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_8ba37cc28eaf1e56bec2db807e046a73) #29
  unreachable

_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit: ; preds = %bb6.i11, %bb4
  %_0.sroa.0.0.i274449 = phi i64 [ 0, %bb4 ], [ %_16.i22, %bb6.i11 ]
  %_0.sroa.0.0.i = phi i64 [ 0, %bb4 ], [ %_16.i, %bb6.i11 ]
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i.i31)
  br label %bb6

bb6:                                              ; preds = %_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit30.thread, %_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit30, %_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit
  %5 = phi i1 [ false, %_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit ], [ true, %_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit30 ], [ true, %_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit30.thread ]
  %_0.sroa.0.0.i2745 = phi i64 [ %_0.sroa.0.0.i274449, %_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit ], [ 0, %_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit30 ], [ %_16.i22, %_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit30.thread ]
  %post_buyback.sroa.0.0 = phi i64 [ %_0.sroa.0.0.i, %_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit ], [ 0, %_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit30 ], [ 0, %_ZN14pump_recovered18protocol_fee_split17h923384455872ed0aE.exit30.thread ]
  %6 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %_0.sroa.0.0.i2745, i64 %post_buyback.sroa.0.0)
  %_52.0 = extractvalue { i64, i1 } %6, 0
  %_52.1 = extractvalue { i64, i1 } %6, 1
  br i1 %_52.1, label %bb19, label %bb20

bb20:                                             ; preds = %bb6
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_24)
; call pump_recovered::trade::add3
  call fastcc void @_ZN14pump_recovered5trade4add317h402ddc407343e30dE(ptr noalias nocapture noundef nonnull align 8 dereferenceable(16) %_24, i64 noundef %quote, i64 noundef %protocol_fee, i64 noundef %creator_fee) #28
  %7 = load i64, ptr %_24, align 8, !range !318, !noundef !2
  %8 = icmp eq i64 %7, 2
  %9 = getelementptr inbounds i8, ptr %_24, i64 8
  br i1 %8, label %bb23, label %bb22

bb19:                                             ; preds = %bb6
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_2.i)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_3.i)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h7d9bfb605fd2f7ecE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_3.i, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e7ecca184d1801ae8ba4577ecc1a7822) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i.i31)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i.i), !noalias !13614
  store i64 0, ptr %buf.i.i, align 8, !noalias !13614
  %_9.sroa.4.0.buf.sroa_idx.i.i = getelementptr inbounds i8, ptr %buf.i.i, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i.i, align 8, !noalias !13614
  %_9.sroa.5.0.buf.sroa_idx.i.i = getelementptr inbounds i8, ptr %buf.i.i, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i.i, align 8, !noalias !13614
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i.i), !noalias !13614
  %10 = getelementptr inbounds i8, ptr %formatter.i.i, i64 52
  store i32 0, ptr %10, align 4, !noalias !13614
  %11 = getelementptr inbounds i8, ptr %formatter.i.i, i64 48
  store i32 32, ptr %11, align 8, !noalias !13614
  %12 = getelementptr inbounds i8, ptr %formatter.i.i, i64 56
  store i8 3, ptr %12, align 8, !noalias !13614
  store i64 0, ptr %formatter.i.i, align 8, !noalias !13614
  %13 = getelementptr inbounds i8, ptr %formatter.i.i, i64 16
  store i64 0, ptr %13, align 8, !noalias !13614
  %14 = getelementptr inbounds i8, ptr %formatter.i.i, i64 32
  store ptr %buf.i.i, ptr %14, align 8, !noalias !13614
  %15 = getelementptr inbounds i8, ptr %formatter.i.i, i64 40
  store ptr @vtable.4, ptr %15, align 8, !noalias !13614
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %16 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17h9a225151865f6947E"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e7ecca184d1801ae8ba4577ecc1a7822, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i.i) #28, !noalias !13618
  br i1 %16, label %bb3.i.i, label %"_ZN14pump_recovered5trade12v3_buy_costs28_$u7b$$u7b$closure$u7d$$u7d$17h8e8449331f7a213aE.exit"

bb3.i.i:                                          ; preds = %bb19
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i.i31, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !13614
  unreachable

"_ZN14pump_recovered5trade12v3_buy_costs28_$u7b$$u7b$closure$u7d$$u7d$17h8e8449331f7a213aE.exit": ; preds = %bb19
  %17 = getelementptr inbounds i8, ptr %_2.i, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %17, ptr noundef nonnull align 8 dereferenceable(24) %buf.i.i, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i.i), !noalias !13614
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i.i), !noalias !13614
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i.i31)
  %18 = getelementptr inbounds i8, ptr %_2.i, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %18, ptr noundef nonnull align 8 dereferenceable(24) %_3.i, i64 24, i1 false)
  %19 = getelementptr inbounds i8, ptr %_2.i, i64 152
  store i32 6024, ptr %19, align 8
  store i64 0, ptr %_2.i, align 8
  %_6.sroa.4.0._2.sroa_idx.i = getelementptr inbounds i8, ptr %_2.i, i64 8
  store ptr @alloc_ca0d41d128411e4203bf8494233c0f69, ptr %_6.sroa.4.0._2.sroa_idx.i, align 8
  %_6.sroa.4.sroa.4.0._6.sroa.4.0._2.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_2.i, i64 16
  store i64 29, ptr %_6.sroa.4.sroa.4.0._6.sroa.4.0._2.sroa_idx.sroa_idx.i, align 8
  %_6.sroa.4.sroa.5.0._6.sroa.4.0._2.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_2.i, i64 24
  store i32 371, ptr %_6.sroa.4.sroa.5.0._6.sroa.4.0._2.sroa_idx.sroa_idx.i, align 8
  %20 = getelementptr inbounds i8, ptr %_2.i, i64 80
  store i8 2, ptr %20, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_3.i)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %21 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17hda5823d33356f5f0E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_2.i) #28
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_2.i)
  %_54.0 = extractvalue { i64, ptr } %21, 0
  %_54.1 = extractvalue { i64, ptr } %21, 1
  %22 = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %_54.0, ptr %22, align 8
  %23 = getelementptr inbounds i8, ptr %_0, i64 16
  store ptr %_54.1, ptr %23, align 8
  br label %bb17

bb23:                                             ; preds = %bb20
  %_60 = load i64, ptr %9, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_24)
  br i1 %5, label %bb11, label %bb9

bb22:                                             ; preds = %bb20
  %_61.1 = load ptr, ptr %9, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_24)
  %24 = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %7, ptr %24, align 8
  %25 = getelementptr inbounds i8, ptr %_0, i64 16
  store ptr %_61.1, ptr %25, align 8
  br label %bb17

bb9:                                              ; preds = %bb23
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_30)
  %26 = getelementptr inbounds i8, ptr %0, i64 40
  %_31 = load i64, ptr %26, align 8, !noundef !2
  %_32 = load i64, ptr %0, align 8, !noundef !2
  %27 = getelementptr inbounds i8, ptr %0, i64 8
  %_33 = load i64, ptr %27, align 8, !noundef !2
; call pump_recovered::trade::add3
  call fastcc void @_ZN14pump_recovered5trade4add317h402ddc407343e30dE(ptr noalias nocapture noundef nonnull align 8 dereferenceable(16) %_30, i64 noundef %_31, i64 noundef %_32, i64 noundef %_33) #28
  %28 = load i64, ptr %_30, align 8, !range !318, !noundef !2
  %29 = icmp eq i64 %28, 2
  %30 = getelementptr inbounds i8, ptr %_30, i64 8
  br i1 %29, label %bb25, label %bb24

bb11:                                             ; preds = %bb23, %bb25
  %second.sroa.0.0 = phi i64 [ %_65, %bb25 ], [ 0, %bb23 ]
  %31 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %_60, i64 %second.sroa.0.0)
  %_72.0 = extractvalue { i64, i1 } %31, 0
  %_72.1 = extractvalue { i64, i1 } %31, 1
  %_75.not = icmp ult i64 %_72.0, %_52.0
  %or.cond = or i1 %_72.1, %_75.not
  br i1 %or.cond, label %bb31, label %bb29

bb25:                                             ; preds = %bb9
  %_65 = load i64, ptr %30, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_30)
  br label %bb11

bb24:                                             ; preds = %bb9
  %_66.1 = load ptr, ptr %30, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_30)
  %32 = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %28, ptr %32, align 8
  %33 = getelementptr inbounds i8, ptr %_0, i64 16
  store ptr %_66.1, ptr %33, align 8
  br label %bb17

bb29:                                             ; preds = %bb11
  %_76 = sub nuw i64 %_72.0, %_52.0
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_4.i), !noalias !13619
; call pump_recovered::transfer_fee_recovered::pre_fee_amount
  call void @_ZN14pump_recovered22transfer_fee_recovered14pre_fee_amount17h695d60f10584e38eE(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_4.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(32) %quote_fee, i64 noundef %_76) #28, !noalias !13623
  %34 = load i64, ptr %_4.i, align 8, !range !318, !noalias !13619, !noundef !2
  %35 = icmp eq i64 %34, 2
  %36 = getelementptr inbounds i8, ptr %_4.i, i64 8
  br i1 %35, label %bb6.i, label %bb5.i

bb6.i:                                            ; preds = %bb29
  %_14.i = load i64, ptr %36, align 8, !noalias !13619, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_4.i), !noalias !13619
  %_17.not.i = icmp ult i64 %_14.i, %_76
  br i1 %_17.not.i, label %bb8.i, label %bb34

bb5.i:                                            ; preds = %bb29
  %_15.1.i = load ptr, ptr %36, align 8, !noalias !13619, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_4.i), !noalias !13619
  br label %bb33

bb8.i:                                            ; preds = %bb6.i
; call pump_recovered::trade::gross_up_quote_error
  %37 = tail call { i64, ptr } @_ZN14pump_recovered5trade20gross_up_quote_error17he0e72e48c4ed17aaE() #28, !noalias !13623
  %_21.0.i = extractvalue { i64, ptr } %37, 0
  %_21.1.i = extractvalue { i64, ptr } %37, 1
  br label %bb33

bb31:                                             ; preds = %bb11
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_2.i35)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_3.i34)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h7d9bfb605fd2f7ecE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_3.i34, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e7ecca184d1801ae8ba4577ecc1a7822) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i.i31)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i.i33), !noalias !13624
  store i64 0, ptr %buf.i.i33, align 8, !noalias !13624
  %_9.sroa.4.0.buf.sroa_idx.i.i36 = getelementptr inbounds i8, ptr %buf.i.i33, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i.i36, align 8, !noalias !13624
  %_9.sroa.5.0.buf.sroa_idx.i.i37 = getelementptr inbounds i8, ptr %buf.i.i33, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i.i37, align 8, !noalias !13624
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i.i32), !noalias !13624
  %38 = getelementptr inbounds i8, ptr %formatter.i.i32, i64 52
  store i32 0, ptr %38, align 4, !noalias !13624
  %39 = getelementptr inbounds i8, ptr %formatter.i.i32, i64 48
  store i32 32, ptr %39, align 8, !noalias !13624
  %40 = getelementptr inbounds i8, ptr %formatter.i.i32, i64 56
  store i8 3, ptr %40, align 8, !noalias !13624
  store i64 0, ptr %formatter.i.i32, align 8, !noalias !13624
  %41 = getelementptr inbounds i8, ptr %formatter.i.i32, i64 16
  store i64 0, ptr %41, align 8, !noalias !13624
  %42 = getelementptr inbounds i8, ptr %formatter.i.i32, i64 32
  store ptr %buf.i.i33, ptr %42, align 8, !noalias !13624
  %43 = getelementptr inbounds i8, ptr %formatter.i.i32, i64 40
  store ptr @vtable.4, ptr %43, align 8, !noalias !13624
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %44 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17h9a225151865f6947E"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e7ecca184d1801ae8ba4577ecc1a7822, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i.i32) #28, !noalias !13628
  br i1 %44, label %bb3.i.i41, label %"_ZN14pump_recovered5trade12v3_buy_costs28_$u7b$$u7b$closure$u7d$$u7d$17hf1cabe6795e8ee11E.exit"

bb3.i.i41:                                        ; preds = %bb31
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i.i31, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !13624
  unreachable

"_ZN14pump_recovered5trade12v3_buy_costs28_$u7b$$u7b$closure$u7d$$u7d$17hf1cabe6795e8ee11E.exit": ; preds = %bb31
  %45 = getelementptr inbounds i8, ptr %_2.i35, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %45, ptr noundef nonnull align 8 dereferenceable(24) %buf.i.i33, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i.i32), !noalias !13624
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i.i33), !noalias !13624
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i.i31)
  %46 = getelementptr inbounds i8, ptr %_2.i35, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %46, ptr noundef nonnull align 8 dereferenceable(24) %_3.i34, i64 24, i1 false)
  %47 = getelementptr inbounds i8, ptr %_2.i35, i64 152
  store i32 6024, ptr %47, align 8
  store i64 0, ptr %_2.i35, align 8
  %_6.sroa.4.0._2.sroa_idx.i38 = getelementptr inbounds i8, ptr %_2.i35, i64 8
  store ptr @alloc_ca0d41d128411e4203bf8494233c0f69, ptr %_6.sroa.4.0._2.sroa_idx.i38, align 8
  %_6.sroa.4.sroa.4.0._6.sroa.4.0._2.sroa_idx.sroa_idx.i39 = getelementptr inbounds i8, ptr %_2.i35, i64 16
  store i64 29, ptr %_6.sroa.4.sroa.4.0._6.sroa.4.0._2.sroa_idx.sroa_idx.i39, align 8
  %_6.sroa.4.sroa.5.0._6.sroa.4.0._2.sroa_idx.sroa_idx.i40 = getelementptr inbounds i8, ptr %_2.i35, i64 24
  store i32 375, ptr %_6.sroa.4.sroa.5.0._6.sroa.4.0._2.sroa_idx.sroa_idx.i40, align 8
  %48 = getelementptr inbounds i8, ptr %_2.i35, i64 80
  store i8 2, ptr %48, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_3.i34)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %49 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17hda5823d33356f5f0E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_2.i35) #28
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_2.i35)
  %_78.0 = extractvalue { i64, ptr } %49, 0
  %_78.1 = extractvalue { i64, ptr } %49, 1
  %50 = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %_78.0, ptr %50, align 8
  %51 = getelementptr inbounds i8, ptr %_0, i64 16
  store ptr %_78.1, ptr %51, align 8
  br label %bb17

bb34:                                             ; preds = %bb6.i
  %_18.i = sub nuw i64 %_14.i, %_76
  %52 = getelementptr inbounds i8, ptr %_0, i64 8
  %_47.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_0, i64 16
  store i64 %_14.i, ptr %52, align 8
  store i64 %_52.0, ptr %_47.sroa.4.0..sroa_idx, align 8
  %_47.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_0, i64 24
  store i64 %_18.i, ptr %_47.sroa.5.0..sroa_idx, align 8
  br label %bb17

bb33:                                             ; preds = %bb8.i, %bb5.i
  %_45.sroa.11.0.ph.in = phi ptr [ %_15.1.i, %bb5.i ], [ %_21.1.i, %bb8.i ]
  %_45.sroa.7.0.ph = phi i64 [ %34, %bb5.i ], [ %_21.0.i, %bb8.i ]
  %53 = getelementptr inbounds i8, ptr %_0, i64 8
  %_47.sroa.4.0..sroa_idx55 = getelementptr inbounds i8, ptr %_0, i64 16
  store i64 %_45.sroa.7.0.ph, ptr %53, align 8
  store ptr %_45.sroa.11.0.ph.in, ptr %_47.sroa.4.0..sroa_idx55, align 8
  br label %bb17

bb17:                                             ; preds = %"_ZN14pump_recovered5trade12v3_buy_costs28_$u7b$$u7b$closure$u7d$$u7d$17h8e8449331f7a213aE.exit", %bb22, %bb33, %"_ZN14pump_recovered5trade12v3_buy_costs28_$u7b$$u7b$closure$u7d$$u7d$17hf1cabe6795e8ee11E.exit", %bb24, %bb34
  %.sink = phi i64 [ 1, %"_ZN14pump_recovered5trade12v3_buy_costs28_$u7b$$u7b$closure$u7d$$u7d$17h8e8449331f7a213aE.exit" ], [ 1, %bb22 ], [ 1, %bb33 ], [ 1, %"_ZN14pump_recovered5trade12v3_buy_costs28_$u7b$$u7b$closure$u7d$$u7d$17hf1cabe6795e8ee11E.exit" ], [ 1, %bb24 ], [ 0, %bb34 ]
  store i64 %.sink, ptr %_0, align 8
  ret void
}
