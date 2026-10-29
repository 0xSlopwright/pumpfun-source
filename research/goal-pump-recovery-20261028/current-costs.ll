define internal fastcc void @_ZN14pump_recovered5trade12v3_buy_costs17h7b9c6f53e4a86951E(ptr dead_on_unwind noalias nocapture noundef writable writeonly align 8 dereferenceable(32) %_0, i64 noundef %buyback_bps, i8 noundef %is_mayhem, ptr noalias nocapture noundef readonly align 8 dereferenceable(32) %quote_fee, i64 noundef %quote, i64 noundef %protocol_fee, i64 noundef %creator_fee, ptr noalias nocapture noundef readonly align 8 dereferenceable_or_null(64) %0) unnamed_addr #0 {
start:
  %_11.i.i28 = alloca [0 x i8], align 1
  %formatter.i.i29 = alloca [64 x i8], align 8
  %buf.i.i30 = alloca [24 x i8], align 8
  %_3.i31 = alloca [24 x i8], align 8
  %_2.i32 = alloca [160 x i8], align 8
  %formatter.i.i = alloca [64 x i8], align 8
  %buf.i.i = alloca [24 x i8], align 8
  %_3.i = alloca [24 x i8], align 8
  %_2.i = alloca [160 x i8], align 8
  %_45 = alloca [16 x i8], align 8
  %_30 = alloca [16 x i8], align 8
  %_24 = alloca [16 x i8], align 8
  %_10.not = icmp eq i8 %is_mayhem, 0
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i.i28)
  br i1 %_10.not, label %bb3.i13, label %_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit27

bb3.i13:                                          ; preds = %start
  %_6.i14 = zext i64 %buyback_bps to i128
  %_7.i15 = zext i64 %protocol_fee to i128
  %1 = mul nuw i128 %_7.i15, %_6.i14
  %_15.i16 = icmp ugt i128 %1, 184467440737095516159999
  br i1 %_15.i16, label %bb5.i26, label %bb6.i17

bb6.i17:                                          ; preds = %bb3.i13
  %scaled.i18 = udiv i128 %1, 10000
  %_16.i19 = trunc i128 %scaled.i18 to i64
  %_21.not.i20 = icmp ugt i64 %_16.i19, %protocol_fee
  br i1 %_21.not.i20, label %bb8.i25, label %_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit27.thread

bb5.i26:                                          ; preds = %bb3.i13
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_32439d5d787bfd24f2fa4e3df982e7bc, i64 noundef 35, ptr noundef nonnull align 1 %_11.i.i28, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.f, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_b3944b4d357d1afa44dc73dabeb6bdd0) #29
  unreachable

bb8.i25:                                          ; preds = %bb6.i17
; call core::option::expect_failed
  tail call void @_ZN4core6option13expect_failed17h7e2cb204b05dab71E(ptr noalias noundef nonnull readonly align 1 @alloc_c53ee819a6028c03a31d0ed6681cb6a4, i64 noundef 38, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_8ba37cc28eaf1e56bec2db807e046a73) #29
  unreachable

_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit27: ; preds = %start
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i.i28)
  %2 = icmp eq ptr %0, null
  br i1 %2, label %bb6, label %bb4

_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit27.thread: ; preds = %bb6.i17
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i.i28)
  %3 = icmp eq ptr %0, null
  br i1 %3, label %bb6, label %bb3.i

bb4:                                              ; preds = %_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit27
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i.i28)
  br label %_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit

bb3.i:                                            ; preds = %_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit27.thread
  %_1544 = load i64, ptr %0, align 8, !noundef !2
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i.i28)
  %_7.i = zext i64 %_1544 to i128
  %4 = mul nuw i128 %_7.i, %_6.i14
  %_15.i = icmp ugt i128 %4, 184467440737095516159999
  br i1 %_15.i, label %bb5.i, label %bb6.i

bb6.i:                                            ; preds = %bb3.i
  %scaled.i = udiv i128 %4, 10000
  %_16.i = trunc i128 %scaled.i to i64
  %_21.not.i = icmp ult i64 %_1544, %_16.i
  br i1 %_21.not.i, label %bb8.i, label %_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit

bb5.i:                                            ; preds = %bb3.i
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_32439d5d787bfd24f2fa4e3df982e7bc, i64 noundef 35, ptr noundef nonnull align 1 %_11.i.i28, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.f, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_b3944b4d357d1afa44dc73dabeb6bdd0) #29
  unreachable

bb8.i:                                            ; preds = %bb6.i
; call core::option::expect_failed
  tail call void @_ZN4core6option13expect_failed17h7e2cb204b05dab71E(ptr noalias noundef nonnull readonly align 1 @alloc_c53ee819a6028c03a31d0ed6681cb6a4, i64 noundef 38, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_8ba37cc28eaf1e56bec2db807e046a73) #29
  unreachable

_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit: ; preds = %bb6.i, %bb4
  %_0.sroa.0.0.i244146 = phi i64 [ 0, %bb4 ], [ %_16.i19, %bb6.i ]
  %_0.sroa.0.0.i = phi i64 [ 0, %bb4 ], [ %_16.i, %bb6.i ]
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i.i28)
  br label %bb6

bb6:                                              ; preds = %_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit27.thread, %_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit27, %_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit
  %5 = phi i1 [ false, %_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit ], [ true, %_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit27 ], [ true, %_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit27.thread ]
  %_0.sroa.0.0.i2442 = phi i64 [ %_0.sroa.0.0.i244146, %_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit ], [ 0, %_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit27 ], [ %_16.i19, %_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit27.thread ]
  %post_buyback.sroa.0.0 = phi i64 [ %_0.sroa.0.0.i, %_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit ], [ 0, %_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit27 ], [ 0, %_ZN14pump_recovered18protocol_fee_split17hf6474d0ddc81b131E.exit27.thread ]
  %6 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %_0.sroa.0.0.i2442, i64 %post_buyback.sroa.0.0)
  %_58.0 = extractvalue { i64, i1 } %6, 0
  %_58.1 = extractvalue { i64, i1 } %6, 1
  br i1 %_58.1, label %bb20, label %bb21

bb21:                                             ; preds = %bb6
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_24)
; call pump_recovered::trade::add3
  call fastcc void @_ZN14pump_recovered5trade4add317hf9777a0be4559a3bE(ptr noalias nocapture noundef nonnull align 8 dereferenceable(16) %_24, i64 noundef %quote, i64 noundef %protocol_fee, i64 noundef %creator_fee) #28
  %7 = load i64, ptr %_24, align 8, !range !318, !noundef !2
  %8 = icmp eq i64 %7, 2
  %9 = getelementptr inbounds i8, ptr %_24, i64 8
  br i1 %8, label %bb24, label %bb23

bb20:                                             ; preds = %bb6
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_2.i)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_3.i)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_3.i, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e7ecca184d1801ae8ba4577ecc1a7822) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i.i28)
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
  %16 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hbf6a90ed7cf777ebE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e7ecca184d1801ae8ba4577ecc1a7822, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i.i) #28, !noalias !13618
  br i1 %16, label %bb3.i.i, label %"_ZN14pump_recovered5trade12v3_buy_costs28_$u7b$$u7b$closure$u7d$$u7d$17h60893dbbd01db6f1E.exit"

bb3.i.i:                                          ; preds = %bb20
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i.i28, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !13614
  unreachable

"_ZN14pump_recovered5trade12v3_buy_costs28_$u7b$$u7b$closure$u7d$$u7d$17h60893dbbd01db6f1E.exit": ; preds = %bb20
  %17 = getelementptr inbounds i8, ptr %_2.i, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %17, ptr noundef nonnull align 8 dereferenceable(24) %buf.i.i, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i.i), !noalias !13614
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i.i), !noalias !13614
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i.i28)
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
  %21 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_2.i) #28
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_2.i)
  %_60.0 = extractvalue { i64, ptr } %21, 0
  %_60.1 = extractvalue { i64, ptr } %21, 1
  %22 = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %_60.0, ptr %22, align 8
  %23 = getelementptr inbounds i8, ptr %_0, i64 16
  store ptr %_60.1, ptr %23, align 8
  br label %bb18

bb24:                                             ; preds = %bb21
  %_66 = load i64, ptr %9, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_24)
  br i1 %5, label %bb11, label %bb8

bb23:                                             ; preds = %bb21
  %_67.1 = load ptr, ptr %9, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_24)
  %24 = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %7, ptr %24, align 8
  %25 = getelementptr inbounds i8, ptr %_0, i64 16
  store ptr %_67.1, ptr %25, align 8
  br label %bb18

bb8:                                              ; preds = %bb24
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_30)
  %26 = getelementptr inbounds i8, ptr %0, i64 40
  %_31 = load i64, ptr %26, align 8, !noundef !2
  %_32 = load i64, ptr %0, align 8, !noundef !2
  %27 = getelementptr inbounds i8, ptr %0, i64 8
  %_33 = load i64, ptr %27, align 8, !noundef !2
; call pump_recovered::trade::add3
  call fastcc void @_ZN14pump_recovered5trade4add317hf9777a0be4559a3bE(ptr noalias nocapture noundef nonnull align 8 dereferenceable(16) %_30, i64 noundef %_31, i64 noundef %_32, i64 noundef %_33) #28
  %28 = load i64, ptr %_30, align 8, !range !318, !noundef !2
  %29 = icmp eq i64 %28, 2
  %30 = getelementptr inbounds i8, ptr %_30, i64 8
  br i1 %29, label %bb26, label %bb25

bb26:                                             ; preds = %bb8
  %_71 = load i64, ptr %30, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_30)
  br label %bb11

bb25:                                             ; preds = %bb8
  %_72.1 = load ptr, ptr %30, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_30)
  %31 = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %28, ptr %31, align 8
  %32 = getelementptr inbounds i8, ptr %_0, i64 16
  store ptr %_72.1, ptr %32, align 8
  br label %bb18

bb11:                                             ; preds = %bb24, %bb26
  %second.sroa.0.0 = phi i64 [ %_71, %bb26 ], [ 0, %bb24 ]
  %33 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %_66, i64 %second.sroa.0.0)
  %_78.0 = extractvalue { i64, i1 } %33, 0
  %_78.1 = extractvalue { i64, i1 } %33, 1
  %_81.not = icmp ult i64 %_78.0, %_58.0
  %or.cond = or i1 %_78.1, %_81.not
  br i1 %or.cond, label %bb32, label %bb30

bb30:                                             ; preds = %bb11
  %_82 = sub nuw i64 %_78.0, %_58.0
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_45)
; call pump_recovered::transfer_fee_recovered::pre_fee_amount
  call void @_ZN14pump_recovered22transfer_fee_recovered14pre_fee_amount17h75bcf01e06f77a1dE(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_45, ptr noalias noundef nonnull readonly align 8 dereferenceable(32) %quote_fee, i64 noundef %_82) #28
  %34 = load i64, ptr %_45, align 8, !range !318, !noundef !2
  %35 = icmp eq i64 %34, 2
  %36 = getelementptr inbounds i8, ptr %_45, i64 8
  br i1 %35, label %bb35, label %bb34

bb32:                                             ; preds = %bb11
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_2.i32)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_3.i31)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_3.i31, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e7ecca184d1801ae8ba4577ecc1a7822) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i.i28)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i.i30), !noalias !13619
  store i64 0, ptr %buf.i.i30, align 8, !noalias !13619
  %_9.sroa.4.0.buf.sroa_idx.i.i33 = getelementptr inbounds i8, ptr %buf.i.i30, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i.i33, align 8, !noalias !13619
  %_9.sroa.5.0.buf.sroa_idx.i.i34 = getelementptr inbounds i8, ptr %buf.i.i30, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i.i34, align 8, !noalias !13619
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i.i29), !noalias !13619
  %37 = getelementptr inbounds i8, ptr %formatter.i.i29, i64 52
  store i32 0, ptr %37, align 4, !noalias !13619
  %38 = getelementptr inbounds i8, ptr %formatter.i.i29, i64 48
  store i32 32, ptr %38, align 8, !noalias !13619
  %39 = getelementptr inbounds i8, ptr %formatter.i.i29, i64 56
  store i8 3, ptr %39, align 8, !noalias !13619
  store i64 0, ptr %formatter.i.i29, align 8, !noalias !13619
  %40 = getelementptr inbounds i8, ptr %formatter.i.i29, i64 16
  store i64 0, ptr %40, align 8, !noalias !13619
  %41 = getelementptr inbounds i8, ptr %formatter.i.i29, i64 32
  store ptr %buf.i.i30, ptr %41, align 8, !noalias !13619
  %42 = getelementptr inbounds i8, ptr %formatter.i.i29, i64 40
  store ptr @vtable.4, ptr %42, align 8, !noalias !13619
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %43 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hbf6a90ed7cf777ebE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e7ecca184d1801ae8ba4577ecc1a7822, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i.i29) #28, !noalias !13623
  br i1 %43, label %bb3.i.i38, label %"_ZN14pump_recovered5trade12v3_buy_costs28_$u7b$$u7b$closure$u7d$$u7d$17h5bcc5784b2938b24E.exit"

bb3.i.i38:                                        ; preds = %bb32
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i.i28, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !13619
  unreachable

"_ZN14pump_recovered5trade12v3_buy_costs28_$u7b$$u7b$closure$u7d$$u7d$17h5bcc5784b2938b24E.exit": ; preds = %bb32
  %44 = getelementptr inbounds i8, ptr %_2.i32, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %44, ptr noundef nonnull align 8 dereferenceable(24) %buf.i.i30, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i.i29), !noalias !13619
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i.i30), !noalias !13619
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i.i28)
  %45 = getelementptr inbounds i8, ptr %_2.i32, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %45, ptr noundef nonnull align 8 dereferenceable(24) %_3.i31, i64 24, i1 false)
  %46 = getelementptr inbounds i8, ptr %_2.i32, i64 152
  store i32 6024, ptr %46, align 8
  store i64 0, ptr %_2.i32, align 8
  %_6.sroa.4.0._2.sroa_idx.i35 = getelementptr inbounds i8, ptr %_2.i32, i64 8
  store ptr @alloc_ca0d41d128411e4203bf8494233c0f69, ptr %_6.sroa.4.0._2.sroa_idx.i35, align 8
  %_6.sroa.4.sroa.4.0._6.sroa.4.0._2.sroa_idx.sroa_idx.i36 = getelementptr inbounds i8, ptr %_2.i32, i64 16
  store i64 29, ptr %_6.sroa.4.sroa.4.0._6.sroa.4.0._2.sroa_idx.sroa_idx.i36, align 8
  %_6.sroa.4.sroa.5.0._6.sroa.4.0._2.sroa_idx.sroa_idx.i37 = getelementptr inbounds i8, ptr %_2.i32, i64 24
  store i32 375, ptr %_6.sroa.4.sroa.5.0._6.sroa.4.0._2.sroa_idx.sroa_idx.i37, align 8
  %47 = getelementptr inbounds i8, ptr %_2.i32, i64 80
  store i8 2, ptr %47, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_3.i31)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %48 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_2.i32) #28
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_2.i32)
  %_84.0 = extractvalue { i64, ptr } %48, 0
  %_84.1 = extractvalue { i64, ptr } %48, 1
  %49 = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %_84.0, ptr %49, align 8
  %50 = getelementptr inbounds i8, ptr %_0, i64 16
  store ptr %_84.1, ptr %50, align 8
  br label %bb18

bb35:                                             ; preds = %bb30
  %_90 = load i64, ptr %36, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_45)
  %_93.not = icmp ult i64 %_90, %_82
  br i1 %_93.not, label %bb37, label %bb36

bb34:                                             ; preds = %bb30
  %_91.1 = load ptr, ptr %36, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_45)
  %51 = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %34, ptr %51, align 8
  %52 = getelementptr inbounds i8, ptr %_0, i64 16
  store ptr %_91.1, ptr %52, align 8
  br label %bb18

bb37:                                             ; preds = %bb35
; call pump_recovered::trade::gross_up_quote_error
  %53 = tail call { i64, ptr } @_ZN14pump_recovered5trade20gross_up_quote_error17had74303d52555448E() #28
  %_97.0 = extractvalue { i64, ptr } %53, 0
  %_97.1 = extractvalue { i64, ptr } %53, 1
  %54 = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %_97.0, ptr %54, align 8
  %55 = getelementptr inbounds i8, ptr %_0, i64 16
  store ptr %_97.1, ptr %55, align 8
  br label %bb18

bb36:                                             ; preds = %bb35
  %_94 = sub nuw i64 %_90, %_82
  %56 = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %_90, ptr %56, align 8
  %_53.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_0, i64 16
  store i64 %_58.0, ptr %_53.sroa.4.0..sroa_idx, align 8
  %_53.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_0, i64 24
  store i64 %_94, ptr %_53.sroa.5.0..sroa_idx, align 8
  br label %bb18

bb18:                                             ; preds = %"_ZN14pump_recovered5trade12v3_buy_costs28_$u7b$$u7b$closure$u7d$$u7d$17h60893dbbd01db6f1E.exit", %bb23, %"_ZN14pump_recovered5trade12v3_buy_costs28_$u7b$$u7b$closure$u7d$$u7d$17h5bcc5784b2938b24E.exit", %bb34, %bb37, %bb25, %bb36
  %.sink = phi i64 [ 1, %"_ZN14pump_recovered5trade12v3_buy_costs28_$u7b$$u7b$closure$u7d$$u7d$17h60893dbbd01db6f1E.exit" ], [ 1, %bb23 ], [ 1, %"_ZN14pump_recovered5trade12v3_buy_costs28_$u7b$$u7b$closure$u7d$$u7d$17h5bcc5784b2938b24E.exit" ], [ 1, %bb34 ], [ 1, %bb37 ], [ 1, %bb25 ], [ 0, %bb36 ]
  store i64 %.sink, ptr %_0, align 8
  ret void
}
