define hidden { i64, ptr } @_ZN14pump_recovered5trade3buy17h8ba47e197d5a9d68E(ptr noalias nocapture noundef readonly align 8 dereferenceable(40) %ctx, i64 noundef %amount, i64 noundef %max_sol_cost, i1 noundef zeroext %partial_fill) unnamed_addr #1 {
start:
  %_11.i64 = alloca [0 x i8], align 1
  %formatter.i65 = alloca [64 x i8], align 8
  %buf.i66 = alloca [24 x i8], align 8
  %formatter.i = alloca [64 x i8], align 8
  %buf.i = alloca [24 x i8], align 8
  %_131 = alloca [32 x i8], align 8
  %_122 = alloca [24 x i8], align 8
  %_118 = alloca [16 x i8], align 8
  %_108 = alloca [160 x i8], align 8
  %_103 = alloca [16 x i8], align 8
  %_94 = alloca [32 x i8], align 8
  %_88 = alloca [72 x i8], align 8
  %_81 = alloca [24 x i8], align 8
  %post = alloca [72 x i8], align 8
  %_74 = alloca [40 x i8], align 8
  %_66 = alloca [24 x i8], align 8
  %_59 = alloca [40 x i8], align 8
  %quote_fee = alloca [32 x i8], align 8
  %_48 = alloca [24 x i8], align 8
  %_47 = alloca [160 x i8], align 8
  %_34 = alloca [24 x i8], align 8
  %_33 = alloca [160 x i8], align 8
  %_22 = alloca [32 x i8], align 1
  %0 = getelementptr inbounds i8, ptr %ctx, i64 8
  %a = load ptr, ptr %0, align 8, !nonnull !2, !align !3, !noundef !2
  %1 = getelementptr inbounds i8, ptr %a, i64 40
  %_135 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %_8 = getelementptr inbounds i8, ptr %a, i64 112
  %_9 = getelementptr inbounds i8, ptr %a, i64 64
; call pump_recovered::trade_types::prepare_bonding_curve
  %2 = tail call { i64, ptr } @_ZN14pump_recovered11trade_types21prepare_bonding_curve17hab00d7632d2df5bfE(ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %_135, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_8, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_9) #28
  %3 = extractvalue { i64, ptr } %2, 0
  %4 = icmp eq i64 %3, 2
  br i1 %4, label %bb60, label %bb59

bb60:                                             ; preds = %start
  %_136 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %5 = getelementptr inbounds i8, ptr %_136, i64 161
  %6 = load i8, ptr %5, align 1, !range !374, !noundef !2
  %7 = getelementptr inbounds i8, ptr %_136, i64 163
  %8 = load i8, ptr %7, align 1, !range !374, !noundef !2
  %_15 = zext nneg i8 %8 to i64
; call pump_recovered::trade::validate_trade
  %9 = tail call { i64, ptr } @_ZN14pump_recovered5trade14validate_trade17h1dc92449ec47d24bE(i8 noundef %6, i64 noundef %_15, i64 noundef 0) #28
  %10 = extractvalue { i64, ptr } %9, 0
  %11 = icmp eq i64 %10, 2
  br i1 %11, label %bb62, label %bb61

bb59:                                             ; preds = %start
  %12 = extractvalue { i64, ptr } %2, 1
  br label %bb55

bb62:                                             ; preds = %bb60
  %_138 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %13 = getelementptr inbounds i8, ptr %_138, i64 88
  %real = load i64, ptr %13, align 8, !noundef !2
  %14 = getelementptr inbounds i8, ptr %_138, i64 162
  %15 = load i8, ptr %14, align 2, !range !374, !noundef !2
  %_20.not = icmp eq i8 %15, 0
  br i1 %_20.not, label %bb4, label %bb10

bb61:                                             ; preds = %bb60
  %16 = extractvalue { i64, ptr } %9, 1
  br label %bb55

bb4:                                              ; preds = %bb62
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_22)
  %_167 = load ptr, ptr %_9, align 8, !nonnull !2, !align !3, !noundef !2
  %_168 = load ptr, ptr %_167, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_22, ptr noundef nonnull align 1 dereferenceable(32) %_168, i64 32, i1 false)
  %_140 = load ptr, ptr %a, align 8, !nonnull !2, !align !3, !noundef !2
  %_170 = getelementptr inbounds i8, ptr %_140, i64 648
  %17 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_22, ptr noundef nonnull dereferenceable(32) %_170, i64 32)
  %18 = icmp ne i32 %17, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_22)
  %_23 = icmp ult i64 %real, %amount
  %or.cond54 = and i1 %_23, %18
  br i1 %or.cond54, label %bb7, label %bb10

bb7:                                              ; preds = %bb4
  %_24.0 = sub i64 %amount, %real
  br label %bb10

bb10:                                             ; preds = %bb4, %bb62, %bb7
  %excess.sroa.0.0 = phi i64 [ %_24.0, %bb7 ], [ 0, %bb62 ], [ 0, %bb4 ]
  %_26 = icmp ne i64 %excess.sroa.0.0, 0
  %_28 = icmp ule i64 %real, %amount
  %or.cond = and i1 %_28, %partial_fill
  %or.cond21 = or i1 %or.cond, %_26
  %real.amount = select i1 %or.cond21, i64 %real, i64 %amount
  %_29 = icmp eq i64 %real.amount, 0
  br i1 %_29, label %bb17, label %bb22

bb22:                                             ; preds = %bb10
  %_43 = icmp ult i64 %real, %real.amount
  br i1 %_43, label %bb23, label %bb24

bb17:                                             ; preds = %bb10
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_33)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_34)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h7d9bfb605fd2f7ecE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_34, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e3e143fb26e9bc2a81054057f78086ba) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i64)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i), !noalias !14041
  store i64 0, ptr %buf.i, align 8, !noalias !14041
  %_9.sroa.4.0.buf.sroa_idx.i = getelementptr inbounds i8, ptr %buf.i, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i, align 8, !noalias !14041
  %_9.sroa.5.0.buf.sroa_idx.i = getelementptr inbounds i8, ptr %buf.i, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i, align 8, !noalias !14041
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i), !noalias !14041
  %19 = getelementptr inbounds i8, ptr %formatter.i, i64 52
  store i32 0, ptr %19, align 4, !noalias !14041
  %20 = getelementptr inbounds i8, ptr %formatter.i, i64 48
  store i32 32, ptr %20, align 8, !noalias !14041
  %21 = getelementptr inbounds i8, ptr %formatter.i, i64 56
  store i8 3, ptr %21, align 8, !noalias !14041
  store i64 0, ptr %formatter.i, align 8, !noalias !14041
  %22 = getelementptr inbounds i8, ptr %formatter.i, i64 16
  store i64 0, ptr %22, align 8, !noalias !14041
  %23 = getelementptr inbounds i8, ptr %formatter.i, i64 32
  store ptr %buf.i, ptr %23, align 8, !noalias !14041
  %24 = getelementptr inbounds i8, ptr %formatter.i, i64 40
  store ptr @vtable.4, ptr %24, align 8, !noalias !14041
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %25 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17h9a225151865f6947E"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e3e143fb26e9bc2a81054057f78086ba, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i) #28, !noalias !14045
  br i1 %25, label %bb3.i, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h75a3281d0ad9241bE.exit"

bb3.i:                                            ; preds = %bb17
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i64, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !14041
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h75a3281d0ad9241bE.exit": ; preds = %bb17
  %26 = getelementptr inbounds i8, ptr %_33, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %26, ptr noundef nonnull align 8 dereferenceable(24) %buf.i, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i), !noalias !14041
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i), !noalias !14041
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i64)
  %27 = getelementptr inbounds i8, ptr %_33, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %27, ptr noundef nonnull align 8 dereferenceable(24) %_34, i64 24, i1 false)
  %28 = getelementptr inbounds i8, ptr %_33, i64 152
  store i32 6020, ptr %28, align 8
  store i64 0, ptr %_33, align 8
  %_37.sroa.4.0._33.sroa_idx = getelementptr inbounds i8, ptr %_33, i64 8
  store ptr @alloc_ca0d41d128411e4203bf8494233c0f69, ptr %_37.sroa.4.0._33.sroa_idx, align 8
  %_37.sroa.4.sroa.4.0._37.sroa.4.0._33.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_33, i64 16
  store i64 29, ptr %_37.sroa.4.sroa.4.0._37.sroa.4.0._33.sroa_idx.sroa_idx, align 8
  %_37.sroa.4.sroa.5.0._37.sroa.4.0._33.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_33, i64 24
  store i32 801, ptr %_37.sroa.4.sroa.5.0._37.sroa.4.0._33.sroa_idx.sroa_idx, align 8
  %29 = getelementptr inbounds i8, ptr %_33, i64 80
  store i8 2, ptr %29, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_34)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %30 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17hda5823d33356f5f0E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_33) #28
  %_32.0 = extractvalue { i64, ptr } %30, 0
  %_32.1 = extractvalue { i64, ptr } %30, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_33)
; call anchor_lang::error::Error::with_values
  %31 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17hae1391804d600943E(i64 noundef %_32.0, ptr noundef %_32.1, i32 noundef 0) #28
  %_31.0 = extractvalue { i64, ptr } %31, 0
  %_31.1 = extractvalue { i64, ptr } %31, 1
  br label %bb55

bb24:                                             ; preds = %bb22
  call void @llvm.lifetime.start.p0(i64 40, ptr nonnull %_59)
; call pump_recovered::trade::check_quote
  call fastcc void @_ZN14pump_recovered5trade11check_quote17h7ba34bca32cdc0bfE(ptr noalias nocapture noundef nonnull align 8 dereferenceable(40) %_59, ptr noalias noundef nonnull readonly align 8 dereferenceable(176) %a) #28
  %32 = getelementptr inbounds i8, ptr %_59, i64 8
  %33 = load i64, ptr %32, align 8, !range !318, !noundef !2
  %34 = icmp eq i64 %33, 2
  br i1 %34, label %bb66, label %bb67

bb23:                                             ; preds = %bb22
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_47)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_48)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h7d9bfb605fd2f7ecE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_48, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_9032913b93df2a93f8a032d18ba5abf9) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i64)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i66), !noalias !14046
  store i64 0, ptr %buf.i66, align 8, !noalias !14046
  %_9.sroa.4.0.buf.sroa_idx.i67 = getelementptr inbounds i8, ptr %buf.i66, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i67, align 8, !noalias !14046
  %_9.sroa.5.0.buf.sroa_idx.i68 = getelementptr inbounds i8, ptr %buf.i66, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i68, align 8, !noalias !14046
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i65), !noalias !14046
  %35 = getelementptr inbounds i8, ptr %formatter.i65, i64 52
  store i32 0, ptr %35, align 4, !noalias !14046
  %36 = getelementptr inbounds i8, ptr %formatter.i65, i64 48
  store i32 32, ptr %36, align 8, !noalias !14046
  %37 = getelementptr inbounds i8, ptr %formatter.i65, i64 56
  store i8 3, ptr %37, align 8, !noalias !14046
  store i64 0, ptr %formatter.i65, align 8, !noalias !14046
  %38 = getelementptr inbounds i8, ptr %formatter.i65, i64 16
  store i64 0, ptr %38, align 8, !noalias !14046
  %39 = getelementptr inbounds i8, ptr %formatter.i65, i64 32
  store ptr %buf.i66, ptr %39, align 8, !noalias !14046
  %40 = getelementptr inbounds i8, ptr %formatter.i65, i64 40
  store ptr @vtable.4, ptr %40, align 8, !noalias !14046
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %41 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17h9a225151865f6947E"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_9032913b93df2a93f8a032d18ba5abf9, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i65) #28, !noalias !14050
  br i1 %41, label %bb3.i69, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h75a3281d0ad9241bE.exit70"

bb3.i69:                                          ; preds = %bb23
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i64, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !14046
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h75a3281d0ad9241bE.exit70": ; preds = %bb23
  %42 = getelementptr inbounds i8, ptr %_47, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %42, ptr noundef nonnull align 8 dereferenceable(24) %buf.i66, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i65), !noalias !14046
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i66), !noalias !14046
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i64)
  %43 = getelementptr inbounds i8, ptr %_47, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %43, ptr noundef nonnull align 8 dereferenceable(24) %_48, i64 24, i1 false)
  %44 = getelementptr inbounds i8, ptr %_47, i64 152
  store i32 6021, ptr %44, align 8
  store i64 0, ptr %_47, align 8
  %_51.sroa.4.0._47.sroa_idx = getelementptr inbounds i8, ptr %_47, i64 8
  store ptr @alloc_ca0d41d128411e4203bf8494233c0f69, ptr %_51.sroa.4.0._47.sroa_idx, align 8
  %_51.sroa.4.sroa.4.0._51.sroa.4.0._47.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_47, i64 16
  store i64 29, ptr %_51.sroa.4.sroa.4.0._51.sroa.4.0._47.sroa_idx.sroa_idx, align 8
  %_51.sroa.4.sroa.5.0._51.sroa.4.0._47.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_47, i64 24
  store i32 802, ptr %_51.sroa.4.sroa.5.0._51.sroa.4.0._47.sroa_idx.sroa_idx, align 8
  %45 = getelementptr inbounds i8, ptr %_47, i64 80
  store i8 2, ptr %45, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_48)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %46 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17hda5823d33356f5f0E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_47) #28
  %_46.0 = extractvalue { i64, ptr } %46, 0
  %_46.1 = extractvalue { i64, ptr } %46, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_47)
; call anchor_lang::error::Error::with_values
  %47 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17hec02dda8e8b7ec0eE(i64 noundef %_46.0, ptr noundef %_46.1, i64 noundef %real, i64 noundef %real.amount) #28
  %_45.0 = extractvalue { i64, ptr } %47, 0
  %_45.1 = extractvalue { i64, ptr } %47, 1
  br label %bb55

bb67:                                             ; preds = %bb24
  %_172.sroa.0.0.copyload = load i8, ptr %_59, align 8
  %_172.sroa.7.0._59.sroa_idx = getelementptr inbounds i8, ptr %_59, i64 16
  %_172.sroa.7.0.copyload = load i64, ptr %_172.sroa.7.0._59.sroa_idx, align 8
  %_172.sroa.8.0._59.sroa_idx = getelementptr inbounds i8, ptr %_59, i64 24
  %_172.sroa.8.0.copyload = load ptr, ptr %_172.sroa.8.0._59.sroa_idx, align 8
  %_172.sroa.9.0._59.sroa_idx = getelementptr inbounds i8, ptr %_59, i64 32
  %_172.sroa.9.0.copyload = load i64, ptr %_172.sroa.9.0._59.sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 40, ptr nonnull %_59)
  %48 = and i8 %_172.sroa.0.0.copyload, 1
  %is_sol = icmp ne i8 %48, 0
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %quote_fee)
  store i64 %33, ptr %quote_fee, align 8
  %val13.sroa.2.0.quote_fee.sroa_idx = getelementptr inbounds i8, ptr %quote_fee, i64 8
  store i64 %_172.sroa.7.0.copyload, ptr %val13.sroa.2.0.quote_fee.sroa_idx, align 8
  %val13.sroa.3.0.quote_fee.sroa_idx = getelementptr inbounds i8, ptr %quote_fee, i64 16
  store ptr %_172.sroa.8.0.copyload, ptr %val13.sroa.3.0.quote_fee.sroa_idx, align 8
  %val13.sroa.4.0.quote_fee.sroa_idx = getelementptr inbounds i8, ptr %quote_fee, i64 24
  store i64 %_172.sroa.9.0.copyload, ptr %val13.sroa.4.0.quote_fee.sroa_idx, align 8
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_66)
  %_141 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %_67 = getelementptr inbounds i8, ptr %_141, i64 8
; call pump_recovered::buy_quote
  call void @_ZN14pump_recovered9buy_quote17h6a4fdc4dd25a0d38E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_66, ptr noalias noundef nonnull readonly align 8 dereferenceable(160) %_67, i64 noundef %real.amount) #28
  %_176 = load i64, ptr %_66, align 8, !range !402, !noundef !2
  %trunc.not = icmp eq i64 %_176, 0
  %49 = getelementptr inbounds i8, ptr %_66, i64 8
  %_1773446 = load i64, ptr %49, align 8
  %.sroa_idx = getelementptr inbounds i8, ptr %_66, i64 16
  br i1 %trunc.not, label %bb69, label %bb68

bb66:                                             ; preds = %bb24
  %50 = getelementptr inbounds i8, ptr %_59, i64 16
  %_173.0 = load i64, ptr %50, align 8, !range !402, !noundef !2
  %51 = getelementptr inbounds i8, ptr %_59, i64 24
  %_173.1 = load ptr, ptr %51, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 40, ptr nonnull %_59)
  br label %bb55

bb69:                                             ; preds = %bb67
  %_17735 = load i64, ptr %.sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_66)
  %_180.not = icmp eq i64 %_17735, 0
  br i1 %_180.not, label %bb71, label %bb70

bb68:                                             ; preds = %bb67
  %_178.1 = load ptr, ptr %.sroa_idx, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_66)
  br label %bb53

bb71:                                             ; preds = %bb69
  call void @llvm.lifetime.start.p0(i64 40, ptr nonnull %_74)
; call pump_recovered::trade::v3_trade_fees
  call fastcc void @_ZN14pump_recovered5trade13v3_trade_fees17h66a6e5be48546043E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(40) %_74, ptr noalias noundef nonnull readonly align 8 dereferenceable(176) %a, i64 noundef %_1773446) #28
  %_189 = load i64, ptr %_74, align 8, !range !402, !noundef !2
  %trunc47.not = icmp eq i64 %_189, 0
  %52 = getelementptr inbounds i8, ptr %_74, i64 8
  %_190.sroa.0.0.copyload = load i64, ptr %52, align 8
  %_190.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_74, i64 16
  br i1 %trunc47.not, label %bb74, label %bb73

bb70:                                             ; preds = %bb69
; call pump_recovered::trade::buy::{{closure}}
  %53 = tail call fastcc { i64, ptr } @"_ZN14pump_recovered5trade3buy28_$u7b$$u7b$closure$u7d$$u7d$17h46a7856d78a37d34E"() #28
  %_184.0 = extractvalue { i64, ptr } %53, 0
  %_184.1 = extractvalue { i64, ptr } %53, 1
  br label %bb53

bb74:                                             ; preds = %bb71
  %_190.sroa.5.0.copyload = load i64, ptr %_190.sroa.5.0..sroa_idx, align 8
  %_190.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_74, i64 24
  %_190.sroa.6.0.copyload = load i64, ptr %_190.sroa.6.0..sroa_idx, align 8
  %_190.sroa.7.0..sroa_idx = getelementptr inbounds i8, ptr %_74, i64 32
  %_190.sroa.7.0.copyload = load i64, ptr %_190.sroa.7.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 40, ptr nonnull %_74)
  call void @llvm.lifetime.start.p0(i64 72, ptr nonnull %post)
  br i1 %_26, label %bb32, label %bb36

bb73:                                             ; preds = %bb71
  %_191.1 = load ptr, ptr %_190.sroa.5.0..sroa_idx, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 40, ptr nonnull %_74)
  br label %bb53

bb32:                                             ; preds = %bb74
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_81)
  %_142 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %54 = getelementptr inbounds i8, ptr %_142, i64 96
  %_82 = load i64, ptr %54, align 8, !noundef !2
  %_143 = load ptr, ptr %a, align 8, !nonnull !2, !align !3, !noundef !2
  %55 = getelementptr inbounds i8, ptr %_143, i64 1040
  %_83 = load i64, ptr %55, align 8, !noundef !2
  %56 = getelementptr inbounds i8, ptr %a, i64 48
  %_144 = load ptr, ptr %56, align 8, !nonnull !2, !align !3, !noundef !2
  %57 = getelementptr inbounds i8, ptr %_144, i64 104
  %_84 = load i64, ptr %57, align 8, !noundef !2
; call pump_recovered::trade::v3_pool_before
  call fastcc void @_ZN14pump_recovered5trade14v3_pool_before17h7c3ca188e00fa618E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %_81, i64 noundef %_82, i64 noundef %_83, i64 noundef %_84, i1 noundef zeroext %is_sol, i64 noundef %real, i64 noundef %_1773446) #28
  %_194 = load i64, ptr %_81, align 8, !range !402, !noundef !2
  %trunc48.not = icmp eq i64 %_194, 0
  %58 = getelementptr inbounds i8, ptr %_81, i64 8
  %_195.0 = load i64, ptr %58, align 8, !noundef !2
  %59 = getelementptr inbounds i8, ptr %_81, i64 16
  br i1 %trunc48.not, label %bb76, label %bb75

bb36:                                             ; preds = %bb74, %bb78
  %storemerge = phi i64 [ 1, %bb78 ], [ 0, %bb74 ]
  store i64 %storemerge, ptr %post, align 8
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_94)
  %_145 = load ptr, ptr %a, align 8, !nonnull !2, !align !3, !noundef !2
  %60 = getelementptr inbounds i8, ptr %_145, i64 1056
  %_95 = load i64, ptr %60, align 8, !noundef !2
  %_146 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %61 = getelementptr inbounds i8, ptr %_146, i64 162
  %62 = load i8, ptr %61, align 2, !range !374, !noundef !2
  %_205 = getelementptr inbounds i8, ptr %post, i64 8
  %_99.sroa.0.0 = select i1 %_26, ptr %_205, ptr null
; call pump_recovered::trade::v3_buy_costs
  call fastcc void @_ZN14pump_recovered5trade12v3_buy_costs17h37aedf32529d983fE(ptr noalias nocapture noundef nonnull align 8 dereferenceable(32) %_94, i64 noundef %_95, i8 noundef %62, ptr noalias noundef nonnull readonly align 8 dereferenceable(32) %quote_fee, i64 noundef %_1773446, i64 noundef %_190.sroa.0.0.copyload, i64 noundef %_190.sroa.5.0.copyload, ptr noalias noundef readonly align 8 dereferenceable_or_null(64) %_99.sroa.0.0) #28
  %_206 = load i64, ptr %_94, align 8, !range !402, !noundef !2
  %trunc51.not = icmp eq i64 %_206, 0
  %63 = getelementptr inbounds i8, ptr %_94, i64 8
  %_207.sroa.0.0.copyload = load i64, ptr %63, align 8
  %_207.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_94, i64 16
  br i1 %trunc51.not, label %bb83, label %bb82

bb76:                                             ; preds = %bb32
  %_195.1 = load i64, ptr %59, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_81)
  call void @llvm.lifetime.start.p0(i64 72, ptr nonnull %_88)
; call pump_recovered::trade::v3_post_complete
  call fastcc void @_ZN14pump_recovered5trade16v3_post_complete17hb07622faae973dfdE(ptr noalias nocapture noundef nonnull align 8 dereferenceable(72) %_88, ptr noalias noundef nonnull readonly align 8 dereferenceable(176) %a, i64 noundef %_195.0, i64 noundef %_195.1, i64 noundef %excess.sroa.0.0) #28
  %_199 = load i64, ptr %_88, align 8, !range !402, !noundef !2
  %trunc49.not = icmp eq i64 %_199, 0
  %64 = getelementptr inbounds i8, ptr %_88, i64 8
  %_200.sroa.0.0.copyload = load i64, ptr %64, align 8
  %_200.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_88, i64 16
  %_200.sroa.5.0.copyload = load ptr, ptr %_200.sroa.5.0..sroa_idx, align 8
  br i1 %trunc49.not, label %bb78, label %bb77

bb75:                                             ; preds = %bb32
  %_196.1 = load ptr, ptr %59, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_81)
  br label %bb50

bb78:                                             ; preds = %bb76
  %_200.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_88, i64 24
  %val.sroa.3.0..sroa_idx = getelementptr inbounds i8, ptr %post, i64 24
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %val.sroa.3.0..sroa_idx, ptr noundef nonnull align 8 dereferenceable(48) %_200.sroa.6.0..sroa_idx, i64 48, i1 false)
  call void @llvm.lifetime.end.p0(i64 72, ptr nonnull %_88)
  %65 = getelementptr inbounds i8, ptr %post, i64 8
  store i64 %_200.sroa.0.0.copyload, ptr %65, align 8
  %val.sroa.2.0..sroa_idx = getelementptr inbounds i8, ptr %post, i64 16
  store ptr %_200.sroa.5.0.copyload, ptr %val.sroa.2.0..sroa_idx, align 8
  br label %bb36

bb77:                                             ; preds = %bb76
  call void @llvm.lifetime.end.p0(i64 72, ptr nonnull %_88)
  br label %bb50

bb83:                                             ; preds = %bb36
  %_207.sroa.5.0.copyload = load i64, ptr %_207.sroa.5.0..sroa_idx, align 8
  %_207.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_94, i64 24
  %_207.sroa.6.0.copyload = load i64, ptr %_207.sroa.6.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_94)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_103)
; call pump_recovered::trade::add
  call fastcc void @_ZN14pump_recovered5trade3add17hbf8392893e136084E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(16) %_103, i64 noundef %_207.sroa.0.0.copyload, i64 noundef %_207.sroa.5.0.copyload) #28
  %66 = load i64, ptr %_103, align 8, !range !318, !noundef !2
  %67 = icmp eq i64 %66, 2
  %68 = getelementptr inbounds i8, ptr %_103, i64 8
  br i1 %67, label %bb85, label %bb84

bb82:                                             ; preds = %bb36
  %_208.1 = load ptr, ptr %_207.sroa.5.0..sroa_idx, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_94)
  br label %bb50

bb85:                                             ; preds = %bb83
  %_212 = load i64, ptr %68, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_103)
  %_101 = icmp ugt i64 %_212, %max_sol_cost
  br i1 %_101, label %bb56, label %bb57

bb84:                                             ; preds = %bb83
  %_213.1 = load ptr, ptr %68, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_103)
  br label %bb50

bb57:                                             ; preds = %bb85
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_122)
  %69 = getelementptr inbounds i8, ptr %ctx, i64 33
  %_123 = load i8, ptr %69, align 1, !noundef !2
; call pump_recovered::trade::v3_execute_buy
  call fastcc void @_ZN14pump_recovered5trade14v3_execute_buy17h0bbdfae6606c2cb2E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %_122, ptr noalias noundef nonnull align 8 dereferenceable(176) %a, i8 noundef %_123, i1 noundef zeroext %is_sol, i64 noundef %real.amount, i64 noundef %_1773446, i64 noundef %_190.sroa.0.0.copyload, i64 noundef %_190.sroa.5.0.copyload, ptr noalias noundef readonly align 8 dereferenceable_or_null(64) %_99.sroa.0.0, i64 noundef %_207.sroa.0.0.copyload, i64 noundef %_207.sroa.5.0.copyload, ptr noalias noundef nonnull readonly align 8 dereferenceable(32) %quote_fee) #28
  %_221 = load i64, ptr %_122, align 8, !range !402, !noundef !2
  %trunc53.not = icmp eq i64 %_221, 0
  %70 = getelementptr inbounds i8, ptr %_122, i64 8
  %_222.0 = load i64, ptr %70, align 8, !noundef !2
  %71 = getelementptr inbounds i8, ptr %_122, i64 16
  br i1 %trunc53.not, label %bb90, label %bb89

bb56:                                             ; preds = %bb85
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_108)
  %72 = getelementptr inbounds i8, ptr %_108, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h7d9bfb605fd2f7ecE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %72, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_2e38410fced2c310c68bdf2d45d0c3bd) #28
  %73 = getelementptr inbounds i8, ptr %_108, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h75a3281d0ad9241bE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %73, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_2e38410fced2c310c68bdf2d45d0c3bd) #28
  %74 = getelementptr inbounds i8, ptr %_108, i64 152
  store i32 6002, ptr %74, align 8
  store i64 0, ptr %_108, align 8
  %_112.sroa.4.0._108.sroa_idx = getelementptr inbounds i8, ptr %_108, i64 8
  store ptr @alloc_ca0d41d128411e4203bf8494233c0f69, ptr %_112.sroa.4.0._108.sroa_idx, align 8
  %_112.sroa.4.sroa.4.0._112.sroa.4.0._108.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_108, i64 16
  store i64 29, ptr %_112.sroa.4.sroa.4.0._112.sroa.4.0._108.sroa_idx.sroa_idx, align 8
  %_112.sroa.4.sroa.5.0._112.sroa.4.0._108.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_108, i64 24
  store i32 842, ptr %_112.sroa.4.sroa.5.0._112.sroa.4.0._108.sroa_idx.sroa_idx, align 8
  %75 = getelementptr inbounds i8, ptr %_108, i64 80
  store i8 2, ptr %75, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %76 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17hda5823d33356f5f0E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_108) #28
  %77 = extractvalue { i64, ptr } %76, 0
  %78 = extractvalue { i64, ptr } %76, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_108)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_118)
; call pump_recovered::trade::add
  call fastcc void @_ZN14pump_recovered5trade3add17hbf8392893e136084E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(16) %_118, i64 noundef %_207.sroa.0.0.copyload, i64 noundef %_207.sroa.5.0.copyload) #28
  %79 = load i64, ptr %_118, align 8, !range !318, !noundef !2
  %80 = icmp eq i64 %79, 2
  %81 = getelementptr inbounds i8, ptr %_118, i64 8
  br i1 %80, label %bb88, label %bb87

bb90:                                             ; preds = %bb57
  %_222.1 = load i64, ptr %71, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_122)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_131)
  store i64 %_190.sroa.0.0.copyload, ptr %_131, align 8
  %82 = getelementptr inbounds i8, ptr %_131, i64 8
  store i64 %_190.sroa.5.0.copyload, ptr %82, align 8
  %83 = getelementptr inbounds i8, ptr %_131, i64 16
  store i64 %_190.sroa.6.0.copyload, ptr %83, align 8
  %84 = getelementptr inbounds i8, ptr %_131, i64 24
  store i64 %_190.sroa.7.0.copyload, ptr %84, align 8
  %85 = getelementptr inbounds i8, ptr %ctx, i64 36
  %ctx.val63 = load i8, ptr %85, align 4
; call pump_recovered::trade::v3_emit_buy
  %86 = call fastcc { i64, ptr } @_ZN14pump_recovered5trade11v3_emit_buy17hc4cc59ea1db67b18E(ptr nonnull %a, i8 %ctx.val63, i64 noundef %real.amount, i64 noundef %_1773446, ptr noalias noundef nonnull readonly align 8 dereferenceable(32) %_131, i64 noundef %_222.0, i64 noundef %_207.sroa.6.0.copyload, ptr noalias noundef nonnull readonly align 1 @alloc_4aabaedbd62f6ec96f36599a97af2908, i64 noundef 3, ptr noalias noundef nonnull readonly align 8 dereferenceable(72) %post, i64 noundef %_222.1) #28
  %87 = extractvalue { i64, ptr } %86, 0
  %88 = extractvalue { i64, ptr } %86, 1
  call void @llvm.lifetime.end.p0(i64 72, ptr nonnull %post)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %quote_fee)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_131)
  br label %bb55

bb89:                                             ; preds = %bb57
  %_223.1 = load ptr, ptr %71, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_122)
  br label %bb50

bb55:                                             ; preds = %bb53, %bb66, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h75a3281d0ad9241bE.exit70", %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h75a3281d0ad9241bE.exit", %bb59, %bb61, %bb90
  %_0.sroa.17.0 = phi ptr [ %88, %bb90 ], [ %16, %bb61 ], [ %12, %bb59 ], [ %_31.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h75a3281d0ad9241bE.exit" ], [ %_45.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h75a3281d0ad9241bE.exit70" ], [ %_173.1, %bb66 ], [ %_0.sroa.17.3, %bb53 ]
  %_0.sroa.0.0 = phi i64 [ %87, %bb90 ], [ %10, %bb61 ], [ %3, %bb59 ], [ %_31.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h75a3281d0ad9241bE.exit" ], [ %_45.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h75a3281d0ad9241bE.exit70" ], [ %_173.0, %bb66 ], [ %_0.sroa.0.3, %bb53 ]
  %89 = insertvalue { i64, ptr } poison, i64 %_0.sroa.0.0, 0
  %90 = insertvalue { i64, ptr } %89, ptr %_0.sroa.17.0, 1
  ret { i64, ptr } %90

bb88:                                             ; preds = %bb56
  %_217 = load i64, ptr %81, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_118)
; call anchor_lang::error::Error::with_values
  %91 = tail call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17hec02dda8e8b7ec0eE(i64 noundef %77, ptr noundef %78, i64 noundef %max_sol_cost, i64 noundef %_217) #28
  %_106.0 = extractvalue { i64, ptr } %91, 0
  %_106.1 = extractvalue { i64, ptr } %91, 1
  br label %bb50

bb87:                                             ; preds = %bb56
  %_218.1 = load ptr, ptr %81, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_118)
; call core::ptr::drop_in_place<anchor_lang::error::Error>
  tail call fastcc void @"_ZN4core3ptr46drop_in_place$LT$anchor_lang..error..Error$GT$17h61844c86cbe49496E"(i64 %77, ptr %78) #28
  br label %bb50

bb50:                                             ; preds = %bb88, %bb87, %bb77, %bb75, %bb84, %bb89, %bb82
  %_0.sroa.17.2 = phi ptr [ %_196.1, %bb75 ], [ %_200.sroa.5.0.copyload, %bb77 ], [ %_208.1, %bb82 ], [ %_223.1, %bb89 ], [ %_213.1, %bb84 ], [ %_106.1, %bb88 ], [ %_218.1, %bb87 ]
  %_0.sroa.0.2 = phi i64 [ %_195.0, %bb75 ], [ %_200.sroa.0.0.copyload, %bb77 ], [ %_207.sroa.0.0.copyload, %bb82 ], [ %_222.0, %bb89 ], [ %66, %bb84 ], [ %_106.0, %bb88 ], [ %79, %bb87 ]
  call void @llvm.lifetime.end.p0(i64 72, ptr nonnull %post)
  br label %bb53

bb53:                                             ; preds = %bb70, %bb68, %bb50, %bb73
  %_0.sroa.17.3 = phi ptr [ %_191.1, %bb73 ], [ %_0.sroa.17.2, %bb50 ], [ %_178.1, %bb68 ], [ %_184.1, %bb70 ]
  %_0.sroa.0.3 = phi i64 [ %_190.sroa.0.0.copyload, %bb73 ], [ %_0.sroa.0.2, %bb50 ], [ %_1773446, %bb68 ], [ %_184.0, %bb70 ]
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %quote_fee)
  br label %bb55
}
