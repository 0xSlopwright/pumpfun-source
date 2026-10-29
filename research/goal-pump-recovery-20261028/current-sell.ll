define hidden { i64, ptr } @_ZN14pump_recovered5trade4sell17h3feba226d1168c0aE(ptr noalias nocapture noundef readonly align 8 dereferenceable(40) %ctx, i64 noundef %amount, i64 noundef %min_sol_output) unnamed_addr #1 {
start:
  %_11.i77 = alloca [0 x i8], align 1
  %_4.i84 = alloca [32 x i8], align 1
  %formatter.i78 = alloca [64 x i8], align 8
  %buf.i79 = alloca [24 x i8], align 8
  %formatter.i = alloca [64 x i8], align 8
  %buf.i = alloca [24 x i8], align 8
  %_39.i = alloca [1 x i8], align 1
  %_35.i = alloca [32 x i8], align 8
  %_32.i = alloca [16 x i8], align 8
  %_29.i = alloca [48 x i8], align 8
  %_25.i = alloca [24 x i8], align 8
  %_17.i = alloca [24 x i8], align 8
  %ix.i = alloca [80 x i8], align 8
  %_9.i = alloca [48 x i8], align 8
  %ix_data.i = alloca [24 x i8], align 8
  %inner_data.i = alloca [24 x i8], align 8
  %authority_info.i = alloca [48 x i8], align 8
  %_351 = alloca [24 x i8], align 8
  %_182 = alloca [24 x i8], align 8
  %_180 = alloca [16 x i8], align 8
  %_175 = alloca [48 x i8], align 8
  %_169 = alloca [16 x i8], align 8
  %_166 = alloca [32 x i8], align 1
  %_164 = alloca [32 x i8], align 1
  %event = alloca [424 x i8], align 8
  %_149 = alloca [48 x i8], align 8
  %_140 = alloca [16 x i8], align 8
  %quote_mint = alloca [32 x i8], align 1
  %_107 = alloca [32 x i8], align 1
  %_79 = alloca [160 x i8], align 8
  %_72 = alloca [16 x i8], align 8
  %_68 = alloca [16 x i8], align 8
  %_61 = alloca [40 x i8], align 8
  %fees = alloca [32 x i8], align 8
  %_53 = alloca [24 x i8], align 8
  %_45 = alloca [40 x i8], align 8
  %quote_fee = alloca [32 x i8], align 8
  %_34 = alloca [24 x i8], align 8
  %_33 = alloca [160 x i8], align 8
  %_21 = alloca [24 x i8], align 8
  %_20 = alloca [160 x i8], align 8
  %0 = getelementptr inbounds i8, ptr %ctx, i64 8
  %a = load ptr, ptr %0, align 8, !nonnull !2, !align !3, !noundef !2
  %1 = getelementptr inbounds i8, ptr %a, i64 40
  %_190 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %_7 = getelementptr inbounds i8, ptr %a, i64 112
  %_8 = getelementptr inbounds i8, ptr %a, i64 64
; call pump_recovered::trade_types::prepare_bonding_curve
  %2 = tail call { i64, ptr } @_ZN14pump_recovered11trade_types21prepare_bonding_curve17h5c1479a4239fbcc2E(ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %_190, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_7, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_8) #28
  %3 = extractvalue { i64, ptr } %2, 0
  %4 = icmp eq i64 %3, 2
  br i1 %4, label %bb63, label %bb62

bb63:                                             ; preds = %start
  %_191 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %5 = getelementptr inbounds i8, ptr %_191, i64 161
  %6 = load i8, ptr %5, align 1, !range !374, !noundef !2
  %7 = getelementptr inbounds i8, ptr %_191, i64 163
  %8 = load i8, ptr %7, align 1, !range !374, !noundef !2
  %_14 = zext nneg i8 %8 to i64
; call pump_recovered::trade::validate_trade
  %9 = tail call { i64, ptr } @_ZN14pump_recovered5trade14validate_trade17hb8d9376ec3e13d30E(i8 noundef %6, i64 noundef %_14, i64 noundef 0) #28
  %10 = extractvalue { i64, ptr } %9, 0
  %11 = icmp eq i64 %10, 2
  br i1 %11, label %bb65, label %bb64

bb62:                                             ; preds = %start
  %12 = extractvalue { i64, ptr } %2, 1
  br label %bb60

bb65:                                             ; preds = %bb63
  %_17 = icmp eq i64 %amount, 0
  br i1 %_17, label %bb4, label %bb9

bb64:                                             ; preds = %bb63
  %13 = extractvalue { i64, ptr } %9, 1
  br label %bb60

bb9:                                              ; preds = %bb65
  %14 = getelementptr inbounds i8, ptr %a, i64 72
  %_193 = load ptr, ptr %14, align 8, !nonnull !2, !align !3, !noundef !2
  %15 = getelementptr inbounds i8, ptr %_193, i64 104
  %_30 = load i64, ptr %15, align 8, !noundef !2
  %_29 = icmp ult i64 %_30, %amount
  br i1 %_29, label %bb10, label %bb15

bb4:                                              ; preds = %bb65
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_20)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_21)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_21, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e66071d94605838e7dc5950cdad7bb3a) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i77)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i), !noalias !14089
  store i64 0, ptr %buf.i, align 8, !noalias !14089
  %_9.sroa.4.0.buf.sroa_idx.i = getelementptr inbounds i8, ptr %buf.i, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i, align 8, !noalias !14089
  %_9.sroa.5.0.buf.sroa_idx.i = getelementptr inbounds i8, ptr %buf.i, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i, align 8, !noalias !14089
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i), !noalias !14089
  %16 = getelementptr inbounds i8, ptr %formatter.i, i64 52
  store i32 0, ptr %16, align 4, !noalias !14089
  %17 = getelementptr inbounds i8, ptr %formatter.i, i64 48
  store i32 32, ptr %17, align 8, !noalias !14089
  %18 = getelementptr inbounds i8, ptr %formatter.i, i64 56
  store i8 3, ptr %18, align 8, !noalias !14089
  store i64 0, ptr %formatter.i, align 8, !noalias !14089
  %19 = getelementptr inbounds i8, ptr %formatter.i, i64 16
  store i64 0, ptr %19, align 8, !noalias !14089
  %20 = getelementptr inbounds i8, ptr %formatter.i, i64 32
  store ptr %buf.i, ptr %20, align 8, !noalias !14089
  %21 = getelementptr inbounds i8, ptr %formatter.i, i64 40
  store ptr @vtable.4, ptr %21, align 8, !noalias !14089
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %22 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hbf6a90ed7cf777ebE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e66071d94605838e7dc5950cdad7bb3a, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i) #28, !noalias !14093
  br i1 %22, label %bb3.i, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit"

bb3.i:                                            ; preds = %bb4
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i77, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !14089
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit": ; preds = %bb4
  %23 = getelementptr inbounds i8, ptr %_20, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %23, ptr noundef nonnull align 8 dereferenceable(24) %buf.i, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i), !noalias !14089
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i), !noalias !14089
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i77)
  %24 = getelementptr inbounds i8, ptr %_20, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %24, ptr noundef nonnull align 8 dereferenceable(24) %_21, i64 24, i1 false)
  %25 = getelementptr inbounds i8, ptr %_20, i64 152
  store i32 6022, ptr %25, align 8
  store i64 0, ptr %_20, align 8
  %_24.sroa.4.0._20.sroa_idx = getelementptr inbounds i8, ptr %_20, i64 8
  store ptr @alloc_ca0d41d128411e4203bf8494233c0f69, ptr %_24.sroa.4.0._20.sroa_idx, align 8
  %_24.sroa.4.sroa.4.0._24.sroa.4.0._20.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_20, i64 16
  store i64 29, ptr %_24.sroa.4.sroa.4.0._24.sroa.4.0._20.sroa_idx.sroa_idx, align 8
  %_24.sroa.4.sroa.5.0._24.sroa.4.0._20.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_20, i64 24
  store i32 1126, ptr %_24.sroa.4.sroa.5.0._24.sroa.4.0._20.sroa_idx.sroa_idx, align 8
  %26 = getelementptr inbounds i8, ptr %_20, i64 80
  store i8 2, ptr %26, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_21)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %27 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_20) #28
  %_19.0 = extractvalue { i64, ptr } %27, 0
  %_19.1 = extractvalue { i64, ptr } %27, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_20)
; call anchor_lang::error::Error::with_values
  %28 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h8504a53ddb496dcbE(i64 noundef %_19.0, ptr noundef %_19.1, i32 noundef 0) #28
  %_18.0 = extractvalue { i64, ptr } %28, 0
  %_18.1 = extractvalue { i64, ptr } %28, 1
  br label %bb60

bb15:                                             ; preds = %bb9
  call void @llvm.lifetime.start.p0(i64 40, ptr nonnull %_45)
; call pump_recovered::trade::check_quote
  call fastcc void @_ZN14pump_recovered5trade11check_quote17h90fdc4a909bbb1eaE(ptr noalias nocapture noundef nonnull align 8 dereferenceable(40) %_45, ptr noalias noundef nonnull readonly align 8 dereferenceable(176) %a) #28
  %29 = getelementptr inbounds i8, ptr %_45, i64 8
  %30 = load i64, ptr %29, align 8, !range !318, !noundef !2
  %31 = icmp eq i64 %30, 2
  br i1 %31, label %bb68, label %bb69

bb10:                                             ; preds = %bb9
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_33)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_34)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_34, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_1f1600f67af89fc229573eafc1a3b5f5) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i77)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i79), !noalias !14094
  store i64 0, ptr %buf.i79, align 8, !noalias !14094
  %_9.sroa.4.0.buf.sroa_idx.i80 = getelementptr inbounds i8, ptr %buf.i79, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i80, align 8, !noalias !14094
  %_9.sroa.5.0.buf.sroa_idx.i81 = getelementptr inbounds i8, ptr %buf.i79, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i81, align 8, !noalias !14094
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i78), !noalias !14094
  %32 = getelementptr inbounds i8, ptr %formatter.i78, i64 52
  store i32 0, ptr %32, align 4, !noalias !14094
  %33 = getelementptr inbounds i8, ptr %formatter.i78, i64 48
  store i32 32, ptr %33, align 8, !noalias !14094
  %34 = getelementptr inbounds i8, ptr %formatter.i78, i64 56
  store i8 3, ptr %34, align 8, !noalias !14094
  store i64 0, ptr %formatter.i78, align 8, !noalias !14094
  %35 = getelementptr inbounds i8, ptr %formatter.i78, i64 16
  store i64 0, ptr %35, align 8, !noalias !14094
  %36 = getelementptr inbounds i8, ptr %formatter.i78, i64 32
  store ptr %buf.i79, ptr %36, align 8, !noalias !14094
  %37 = getelementptr inbounds i8, ptr %formatter.i78, i64 40
  store ptr @vtable.4, ptr %37, align 8, !noalias !14094
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %38 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hbf6a90ed7cf777ebE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_1f1600f67af89fc229573eafc1a3b5f5, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i78) #28, !noalias !14098
  br i1 %38, label %bb3.i82, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit83"

bb3.i82:                                          ; preds = %bb10
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i77, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !14094
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit83": ; preds = %bb10
  %39 = getelementptr inbounds i8, ptr %_33, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %39, ptr noundef nonnull align 8 dereferenceable(24) %buf.i79, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i78), !noalias !14094
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i79), !noalias !14094
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i77)
  %40 = getelementptr inbounds i8, ptr %_33, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %40, ptr noundef nonnull align 8 dereferenceable(24) %_34, i64 24, i1 false)
  %41 = getelementptr inbounds i8, ptr %_33, i64 152
  store i32 6023, ptr %41, align 8
  store i64 0, ptr %_33, align 8
  %_37.sroa.4.0._33.sroa_idx = getelementptr inbounds i8, ptr %_33, i64 8
  store ptr @alloc_ca0d41d128411e4203bf8494233c0f69, ptr %_37.sroa.4.0._33.sroa_idx, align 8
  %_37.sroa.4.sroa.4.0._37.sroa.4.0._33.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_33, i64 16
  store i64 29, ptr %_37.sroa.4.sroa.4.0._37.sroa.4.0._33.sroa_idx.sroa_idx, align 8
  %_37.sroa.4.sroa.5.0._37.sroa.4.0._33.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_33, i64 24
  store i32 1127, ptr %_37.sroa.4.sroa.5.0._37.sroa.4.0._33.sroa_idx.sroa_idx, align 8
  %42 = getelementptr inbounds i8, ptr %_33, i64 80
  store i8 2, ptr %42, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_34)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %43 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_33) #28
  %_32.0 = extractvalue { i64, ptr } %43, 0
  %_32.1 = extractvalue { i64, ptr } %43, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_33)
  %_194 = load ptr, ptr %14, align 8, !nonnull !2, !align !3, !noundef !2
  %44 = getelementptr inbounds i8, ptr %_194, i64 104
  %_42 = load i64, ptr %44, align 8, !noundef !2
; call anchor_lang::error::Error::with_values
  %45 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h17a91ba7c0882e46E(i64 noundef %_32.0, ptr noundef %_32.1, i64 noundef %_42, i64 noundef %amount) #28
  %_31.0 = extractvalue { i64, ptr } %45, 0
  %_31.1 = extractvalue { i64, ptr } %45, 1
  br label %bb60

bb69:                                             ; preds = %bb15
  %_251.sroa.0.0.copyload = load i8, ptr %_45, align 8
  %_251.sroa.7.0._45.sroa_idx = getelementptr inbounds i8, ptr %_45, i64 16
  %_251.sroa.7.0.copyload = load i64, ptr %_251.sroa.7.0._45.sroa_idx, align 8
  %_251.sroa.8.0._45.sroa_idx = getelementptr inbounds i8, ptr %_45, i64 24
  %_251.sroa.8.0.copyload = load ptr, ptr %_251.sroa.8.0._45.sroa_idx, align 8
  %_251.sroa.9.0._45.sroa_idx = getelementptr inbounds i8, ptr %_45, i64 32
  %_251.sroa.9.0.copyload = load i64, ptr %_251.sroa.9.0._45.sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 40, ptr nonnull %_45)
  %46 = and i8 %_251.sroa.0.0.copyload, 1
  %is_sol = icmp ne i8 %46, 0
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %quote_fee)
  store i64 %30, ptr %quote_fee, align 8
  %val20.sroa.2.0.quote_fee.sroa_idx = getelementptr inbounds i8, ptr %quote_fee, i64 8
  store i64 %_251.sroa.7.0.copyload, ptr %val20.sroa.2.0.quote_fee.sroa_idx, align 8
  %val20.sroa.3.0.quote_fee.sroa_idx = getelementptr inbounds i8, ptr %quote_fee, i64 16
  store ptr %_251.sroa.8.0.copyload, ptr %val20.sroa.3.0.quote_fee.sroa_idx, align 8
  %val20.sroa.4.0.quote_fee.sroa_idx = getelementptr inbounds i8, ptr %quote_fee, i64 24
  store i64 %_251.sroa.9.0.copyload, ptr %val20.sroa.4.0.quote_fee.sroa_idx, align 8
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_53)
  %_195 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %_54 = getelementptr inbounds i8, ptr %_195, i64 8
; call pump_recovered::<impl pump_recovered::trade_types::BondingCurve>::sell_quote
  call void @"_ZN14pump_recovered59_$LT$impl$u20$pump_recovered..trade_types..BondingCurve$GT$10sell_quote17h7de23588e2a9e429E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_53, ptr noalias noundef nonnull readonly align 8 dereferenceable(160) %_54, i64 noundef %amount) #28
  %_255 = load i64, ptr %_53, align 8, !range !389, !noundef !2
  %trunc.not = icmp eq i64 %_255, 0
  %47 = getelementptr inbounds i8, ptr %_53, i64 8
  %_2563165 = load i64, ptr %47, align 8
  %.sroa_idx = getelementptr inbounds i8, ptr %_53, i64 16
  br i1 %trunc.not, label %bb71, label %bb70

bb68:                                             ; preds = %bb15
  %48 = getelementptr inbounds i8, ptr %_45, i64 16
  %_252.0 = load i64, ptr %48, align 8, !range !389, !noundef !2
  %49 = getelementptr inbounds i8, ptr %_45, i64 24
  %_252.1 = load ptr, ptr %49, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 40, ptr nonnull %_45)
  br label %bb60

bb71:                                             ; preds = %bb69
  %_25632 = load i64, ptr %.sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_53)
  %_259.not = icmp eq i64 %_25632, 0
  br i1 %_259.not, label %bb73, label %bb72

bb70:                                             ; preds = %bb69
  %_257.1 = load ptr, ptr %.sroa_idx, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_53)
  br label %bb59

bb73:                                             ; preds = %bb71
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %fees)
  call void @llvm.lifetime.start.p0(i64 40, ptr nonnull %_61)
; call pump_recovered::trade::v3_trade_fees
  call fastcc void @_ZN14pump_recovered5trade13v3_trade_fees17he28e7e835d19e21eE(ptr noalias nocapture noundef nonnull align 8 dereferenceable(40) %_61, ptr noalias noundef nonnull readonly align 8 dereferenceable(176) %a, i64 noundef %_2563165) #28
  %_268 = load i64, ptr %_61, align 8, !range !389, !noundef !2
  %trunc66.not = icmp eq i64 %_268, 0
  %50 = getelementptr inbounds i8, ptr %_61, i64 8
  %_269.sroa.0.0.copyload = load i64, ptr %50, align 8
  %_269.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_61, i64 16
  %_269.sroa.5.0.copyload = load ptr, ptr %_269.sroa.5.0..sroa_idx, align 8
  br i1 %trunc66.not, label %bb76, label %bb75

bb72:                                             ; preds = %bb71
; call pump_recovered::trade::sell::{{closure}}
  %51 = tail call fastcc { i64, ptr } @"_ZN14pump_recovered5trade4sell28_$u7b$$u7b$closure$u7d$$u7d$17hdfaa50658c4d71aaE"() #28
  %_263.0 = extractvalue { i64, ptr } %51, 0
  %_263.1 = extractvalue { i64, ptr } %51, 1
  br label %bb59

bb76:                                             ; preds = %bb73
  %_269.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_61, i64 24
  %val.sroa.3.0.fees.sroa_idx = getelementptr inbounds i8, ptr %fees, i64 16
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(16) %val.sroa.3.0.fees.sroa_idx, ptr noundef nonnull align 8 dereferenceable(16) %_269.sroa.6.0..sroa_idx, i64 16, i1 false)
  call void @llvm.lifetime.end.p0(i64 40, ptr nonnull %_61)
  store i64 %_269.sroa.0.0.copyload, ptr %fees, align 8
  %val.sroa.2.0.fees.sroa_idx = getelementptr inbounds i8, ptr %fees, i64 8
  store ptr %_269.sroa.5.0.copyload, ptr %val.sroa.2.0.fees.sroa_idx, align 8
  %creator_fee.cast = ptrtoint ptr %_269.sroa.5.0.copyload to i64
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_68)
; call pump_recovered::trade::sub3
  call fastcc void @_ZN14pump_recovered5trade4sub317he4ce99f8f0beb513E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(16) %_68, i64 noundef %_2563165, i64 noundef %_269.sroa.0.0.copyload, i64 noundef %creator_fee.cast) #28
  %52 = load i64, ptr %_68, align 8, !range !318, !noundef !2
  %53 = icmp eq i64 %52, 2
  %54 = getelementptr inbounds i8, ptr %_68, i64 8
  br i1 %53, label %bb78, label %bb77

bb75:                                             ; preds = %bb73
  call void @llvm.lifetime.end.p0(i64 40, ptr nonnull %_61)
  br label %bb57

bb78:                                             ; preds = %bb76
  %_274 = load i64, ptr %54, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_68)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_72)
; call pump_recovered::transfer_fee_recovered::post_fee_amount
  call void @_ZN14pump_recovered22transfer_fee_recovered15post_fee_amount17h1fdc8f54379b7e47E(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_72, ptr noalias noundef nonnull readonly align 8 dereferenceable(32) %quote_fee, i64 noundef %_274) #28
  %55 = load i64, ptr %_72, align 8, !range !318, !noundef !2
  %56 = icmp eq i64 %55, 2
  %57 = getelementptr inbounds i8, ptr %_72, i64 8
  br i1 %56, label %bb80, label %bb79

bb77:                                             ; preds = %bb76
  %_275.1 = load ptr, ptr %54, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_68)
  br label %bb57

bb80:                                             ; preds = %bb78
  %_279 = load i64, ptr %57, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_72)
  %_76 = icmp ult i64 %_279, %min_sol_output
  br i1 %_76, label %bb21, label %bb26

bb79:                                             ; preds = %bb78
  %_280.1 = load ptr, ptr %57, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_72)
  br label %bb57

bb26:                                             ; preds = %bb80
  %_283.not = icmp ult i64 %_274, %_279
  br i1 %_283.not, label %bb83, label %bb82

bb21:                                             ; preds = %bb80
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_79)
  %58 = getelementptr inbounds i8, ptr %_79, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %58, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_bc6c24833cc57d8ab679f3fbe0b0ac4a) #28
  %59 = getelementptr inbounds i8, ptr %_79, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %59, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_bc6c24833cc57d8ab679f3fbe0b0ac4a) #28
  %60 = getelementptr inbounds i8, ptr %_79, i64 152
  store i32 6003, ptr %60, align 8
  store i64 0, ptr %_79, align 8
  %_83.sroa.4.0._79.sroa_idx = getelementptr inbounds i8, ptr %_79, i64 8
  store ptr @alloc_ca0d41d128411e4203bf8494233c0f69, ptr %_83.sroa.4.0._79.sroa_idx, align 8
  %_83.sroa.4.sroa.4.0._83.sroa.4.0._79.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_79, i64 16
  store i64 29, ptr %_83.sroa.4.sroa.4.0._83.sroa.4.0._79.sroa_idx.sroa_idx, align 8
  %_83.sroa.4.sroa.5.0._83.sroa.4.0._79.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_79, i64 24
  store i32 1148, ptr %_83.sroa.4.sroa.5.0._83.sroa.4.0._79.sroa_idx.sroa_idx, align 8
  %61 = getelementptr inbounds i8, ptr %_79, i64 80
  store i8 2, ptr %61, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %62 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_79) #28
  %_78.0 = extractvalue { i64, ptr } %62, 0
  %_78.1 = extractvalue { i64, ptr } %62, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_79)
; call anchor_lang::error::Error::with_values
  %63 = tail call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h17a91ba7c0882e46E(i64 noundef %_78.0, ptr noundef %_78.1, i64 noundef %_279, i64 noundef %min_sol_output) #28
  %_77.0 = extractvalue { i64, ptr } %63, 0
  %_77.1 = extractvalue { i64, ptr } %63, 1
  br label %bb57

bb83:                                             ; preds = %bb26
; call pump_recovered::trade::sell::{{closure}}
  %64 = tail call fastcc { i64, ptr } @"_ZN14pump_recovered5trade4sell28_$u7b$$u7b$closure$u7d$$u7d$17h4de7fcc9e865135eE"() #28
  %_286.0 = extractvalue { i64, ptr } %64, 0
  %_286.1 = extractvalue { i64, ptr } %64, 1
  br label %bb57

bb82:                                             ; preds = %bb26
  %_284 = sub nuw i64 %_274, %_279
  %_196 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %_95 = getelementptr inbounds i8, ptr %_196, i64 8
; call pump_recovered::<impl pump_recovered::trade_types::BondingCurve>::apply_sell
  %65 = tail call { i64, ptr } @"_ZN14pump_recovered59_$LT$impl$u20$pump_recovered..trade_types..BondingCurve$GT$10apply_sell17ha7bc6e646cfaf499E"(ptr noalias noundef nonnull align 8 dereferenceable(160) %_95, i64 noundef %amount, i64 noundef %_2563165) #28
  %66 = extractvalue { i64, ptr } %65, 0
  %67 = icmp eq i64 %66, 2
  br i1 %67, label %bb86, label %bb85

bb86:                                             ; preds = %bb82
  %_99 = getelementptr inbounds i8, ptr %a, i64 24
  %_197 = load ptr, ptr %14, align 8, !nonnull !2, !align !3, !noundef !2
  %68 = getelementptr inbounds i8, ptr %a, i64 48
  %_198 = load ptr, ptr %68, align 8, !nonnull !2, !align !3, !noundef !2
  %_102 = load ptr, ptr %_8, align 8, !nonnull !2, !align !3, !noundef !2
  %69 = getelementptr inbounds i8, ptr %a, i64 8
  %_199 = load ptr, ptr %69, align 8, !nonnull !2, !align !3, !noundef !2
  %70 = getelementptr inbounds i8, ptr %_199, i64 48
  %_103 = load i8, ptr %70, align 8, !noundef !2
  %71 = getelementptr inbounds i8, ptr %_199, i64 88
  %_104 = load ptr, ptr %71, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::sell_v2::user_token_transfers::transfer_user_tokens
  %72 = tail call { i64, ptr } @_ZN14pump_recovered7sell_v220user_token_transfers20transfer_user_tokens17hf88cc75f9c8afcd7E(ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_99, ptr noalias noundef nonnull readonly align 8 dereferenceable(216) %_197, ptr noalias noundef nonnull readonly align 8 dereferenceable(216) %_198, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_102, i8 noundef %_103, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_104, i64 noundef %amount) #28
  %73 = extractvalue { i64, ptr } %72, 0
  %74 = icmp eq i64 %73, 2
  br i1 %74, label %bb88, label %bb87

bb85:                                             ; preds = %bb82
  %75 = extractvalue { i64, ptr } %65, 1
  br label %bb57

bb88:                                             ; preds = %bb86
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_107)
  %_299 = load ptr, ptr %_8, align 8, !nonnull !2, !align !3, !noundef !2
  %_300 = load ptr, ptr %_299, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_107, ptr noundef nonnull align 1 dereferenceable(32) %_300, i64 32, i1 false)
  %_200 = load ptr, ptr %a, align 8, !nonnull !2, !align !3, !noundef !2
  %_303 = getelementptr inbounds i8, ptr %_200, i64 648
  %76 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_107, ptr noundef nonnull dereferenceable(32) %_303, i64 32)
  %77 = icmp eq i32 %76, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_107)
  br i1 %77, label %bb29, label %bb32

bb87:                                             ; preds = %bb86
  %78 = extractvalue { i64, ptr } %72, 1
  br label %bb57

bb29:                                             ; preds = %bb88
  %_201 = load ptr, ptr %68, align 8, !nonnull !2, !align !3, !noundef !2
  %_304 = getelementptr inbounds i8, ptr %_201, i64 32
; call anchor_lang::accounts::account::Account<T>::reload
  %79 = tail call fastcc { i64, ptr } @"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17hc3ece0ad994fcd5aE"(ptr noalias noundef nonnull align 8 dereferenceable(184) %_304) #28
  %80 = extractvalue { i64, ptr } %79, 0
  %81 = icmp eq i64 %80, 2
  br i1 %81, label %bb92, label %bb91

bb32:                                             ; preds = %bb88, %bb97
  %_8.val = phi ptr [ %_299, %bb88 ], [ %_8.val.pre, %bb97 ]
  %82 = getelementptr inbounds i8, ptr %a, i64 88
  %_207 = load ptr, ptr %82, align 8, !nonnull !2, !align !3, !noundef !2
  %_123 = getelementptr inbounds i8, ptr %_207, i64 8
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_4.i84), !noalias !14099
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_4.i84, i8 0, i64 32, i1 false), !noalias !14099
  %83 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_123, ptr noundef nonnull dereferenceable(32) %_4.i84, i64 32)
  %84 = icmp eq i32 %83, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_4.i84), !noalias !14099
  br i1 %84, label %bb1.i, label %_ZN14pump_recovered5trade16init_volume_user17h33bb92a9d2b80dbfE.exit

bb1.i:                                            ; preds = %bb32
  %85 = icmp ne ptr %_8.val, null
  tail call void @llvm.assume(i1 %85)
  %_10.i = load ptr, ptr %_8.val, align 8, !noalias !14099, !nonnull !2, !align !372, !noundef !2
  tail call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %_123, ptr noundef nonnull align 1 dereferenceable(32) %_10.i, i64 32, i1 false)
  %_129.pre = load ptr, ptr %_8, align 8
  br label %_ZN14pump_recovered5trade16init_volume_user17h33bb92a9d2b80dbfE.exit

_ZN14pump_recovered5trade16init_volume_user17h33bb92a9d2b80dbfE.exit: ; preds = %bb32, %bb1.i
  %_129 = phi ptr [ %_8.val, %bb32 ], [ %_129.pre, %bb1.i ]
  %_370 = load ptr, ptr %69, align 8, !nonnull !2, !noundef !2
  %86 = getelementptr inbounds i8, ptr %_370, i64 88
  %_127 = load ptr, ptr %86, align 8, !nonnull !2, !align !3, !noundef !2
  %_371 = load ptr, ptr %1, align 8, !nonnull !2, !noundef !2
  %_130 = getelementptr inbounds i8, ptr %a, i64 32
  %87 = getelementptr inbounds i8, ptr %a, i64 16
  %_208 = load ptr, ptr %87, align 8, !nonnull !2, !align !3, !noundef !2
  %88 = getelementptr inbounds i8, ptr %_208, i64 48
  %_131 = load i8, ptr %88, align 8, !noundef !2
  %89 = getelementptr inbounds i8, ptr %_208, i64 88
  %_132 = load ptr, ptr %89, align 8, !nonnull !2, !align !3, !noundef !2
  br i1 %is_sol, label %bb36, label %bb35

bb92:                                             ; preds = %bb29
  %_202 = load ptr, ptr %14, align 8, !nonnull !2, !align !3, !noundef !2
  %_308 = getelementptr inbounds i8, ptr %_202, i64 32
; call anchor_lang::accounts::account::Account<T>::reload
  %90 = tail call fastcc { i64, ptr } @"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17hc3ece0ad994fcd5aE"(ptr noalias noundef nonnull align 8 dereferenceable(184) %_308) #28
  %91 = extractvalue { i64, ptr } %90, 0
  %92 = icmp eq i64 %91, 2
  br i1 %92, label %bb95, label %bb94

bb91:                                             ; preds = %bb29
  %93 = extractvalue { i64, ptr } %79, 1
  br label %bb57

bb95:                                             ; preds = %bb92
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %quote_mint)
  %_203 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %94 = getelementptr inbounds i8, ptr %_203, i64 40
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %quote_mint, ptr noundef nonnull align 8 dereferenceable(32) %94, i64 32, i1 false)
  %_117 = getelementptr inbounds i8, ptr %_203, i64 8
  %_205 = load ptr, ptr %68, align 8, !nonnull !2, !align !3, !noundef !2
  %95 = getelementptr inbounds i8, ptr %_205, i64 104
  %_118 = load i64, ptr %95, align 8, !noundef !2
  %_206 = load ptr, ptr %14, align 8, !nonnull !2, !align !3, !noundef !2
  %96 = getelementptr inbounds i8, ptr %_206, i64 104
  %_119 = load i64, ptr %96, align 8, !noundef !2
; call pump_recovered::mayhem_virtual_params::<impl pump_recovered::trade_types::BondingCurve>::sync_virtual_quote_reserves
  %97 = call { i64, ptr } @"_ZN14pump_recovered21mayhem_virtual_params59_$LT$impl$u20$pump_recovered..trade_types..BondingCurve$GT$27sync_virtual_quote_reserves17h0072f1cf30dec0a0E"(ptr noalias noundef nonnull align 8 dereferenceable(160) %_117, i64 noundef %_118, i64 noundef %_119, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %quote_mint) #28
  %98 = extractvalue { i64, ptr } %97, 0
  %99 = icmp eq i64 %98, 2
  br i1 %99, label %bb97, label %bb96

bb94:                                             ; preds = %bb92
  %100 = extractvalue { i64, ptr } %90, 1
  br label %bb57

bb97:                                             ; preds = %bb95
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %quote_mint)
  %_8.val.pre = load ptr, ptr %_8, align 8
  br label %bb32

bb96:                                             ; preds = %bb95
  %101 = extractvalue { i64, ptr } %97, 1
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %quote_mint)
  br label %bb57

bb35:                                             ; preds = %_ZN14pump_recovered5trade16init_volume_user17h33bb92a9d2b80dbfE.exit
  %102 = getelementptr inbounds i8, ptr %a, i64 56
  %_134 = load ptr, ptr %102, align 8, !nonnull !2, !align !3, !noundef !2
  %103 = getelementptr inbounds i8, ptr %a, i64 80
  %_136 = load ptr, ptr %103, align 8, !nonnull !2, !align !3, !noundef !2
  br label %bb36

bb36:                                             ; preds = %_ZN14pump_recovered5trade16init_volume_user17h33bb92a9d2b80dbfE.exit, %bb35
  %_133.sroa.0.0 = phi ptr [ %_134, %bb35 ], [ null, %_ZN14pump_recovered5trade16init_volume_user17h33bb92a9d2b80dbfE.exit ]
  %_135.sroa.0.0 = phi ptr [ %_136, %bb35 ], [ null, %_ZN14pump_recovered5trade16init_volume_user17h33bb92a9d2b80dbfE.exit ]
  %104 = getelementptr inbounds i8, ptr %ctx, i64 33
  %_137 = load i8, ptr %104, align 1, !noundef !2
; call pump_recovered::trade::quote_payments::transfer_to_user
  %105 = tail call { i64, ptr } @_ZN14pump_recovered5trade14quote_payments16transfer_to_user17h6ea1a9a2b025d65cE(i1 noundef zeroext %is_sol, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_127, ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %_371, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_129, i64 noundef %_274, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_130, i8 noundef %_131, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_132, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_133.sroa.0.0, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_135.sroa.0.0, i8 noundef %_137) #28
  %106 = extractvalue { i64, ptr } %105, 0
  %107 = icmp eq i64 %106, 2
  br i1 %107, label %bb99, label %bb98

bb99:                                             ; preds = %bb36
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_140)
  %_209 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %_141 = getelementptr inbounds i8, ptr %_209, i64 8
  %_210 = load ptr, ptr %a, align 8, !nonnull !2, !align !3, !noundef !2
  %_142 = getelementptr inbounds i8, ptr %_210, i64 8
; call pump_recovered::<impl pump_recovered::trade_types::BondingCurve>::accrue_fees
  call void @"_ZN14pump_recovered59_$LT$impl$u20$pump_recovered..trade_types..BondingCurve$GT$11accrue_fees17ha6a973ebbff6219bE"(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_140, ptr noalias noundef nonnull align 8 dereferenceable(160) %_141, ptr noalias noundef nonnull readonly align 8 dereferenceable(1080) %_142, i64 noundef %_269.sroa.0.0.copyload, i64 noundef %creator_fee.cast) #28
  %108 = load i64, ptr %_140, align 8, !range !318, !noundef !2
  %109 = icmp eq i64 %108, 2
  %110 = getelementptr inbounds i8, ptr %_140, i64 8
  br i1 %109, label %bb101, label %bb100

bb98:                                             ; preds = %bb36
  %111 = extractvalue { i64, ptr } %105, 1
  br label %bb57

bb101:                                            ; preds = %bb99
  %_326 = load i64, ptr %110, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_140)
  %_373 = load ptr, ptr %69, align 8, !nonnull !2, !noundef !2
  %112 = getelementptr inbounds i8, ptr %_373, i64 88
  %_147 = load ptr, ptr %112, align 8, !nonnull !2, !align !3, !noundef !2
  %_374 = load ptr, ptr %1, align 8, !nonnull !2, !noundef !2
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_149)
  %113 = getelementptr inbounds i8, ptr %a, i64 104
  %_332 = load ptr, ptr %113, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_149, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_332) #28
  %_211 = load ptr, ptr %87, align 8, !nonnull !2, !align !3, !noundef !2
  %114 = getelementptr inbounds i8, ptr %_211, i64 48
  %_151 = load i8, ptr %114, align 8, !noundef !2
  %115 = getelementptr inbounds i8, ptr %_211, i64 88
  %_152 = load ptr, ptr %115, align 8, !nonnull !2, !align !3, !noundef !2
  br i1 %is_sol, label %bb41, label %bb40

bb100:                                            ; preds = %bb99
  %_327.1 = load ptr, ptr %110, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_140)
  br label %bb57

bb40:                                             ; preds = %bb101
  %116 = getelementptr inbounds i8, ptr %a, i64 56
  %_154 = load ptr, ptr %116, align 8, !nonnull !2, !align !3, !noundef !2
  %_156 = load ptr, ptr %113, align 8, !nonnull !2, !align !3, !noundef !2
  br label %bb41

bb41:                                             ; preds = %bb101, %bb40
  %_153.sroa.0.0 = phi ptr [ %_154, %bb40 ], [ null, %bb101 ]
  %_155.sroa.0.0 = phi ptr [ %_156, %bb40 ], [ null, %bb101 ]
; call pump_recovered::trade::quote_payments::transfer_to_owned
  %117 = call { i64, ptr } @_ZN14pump_recovered5trade14quote_payments17transfer_to_owned17h94731864222abe09E(i1 noundef zeroext %is_sol, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_147, ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %_374, ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_149, i64 noundef %_326, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_130, i8 noundef %_151, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_152, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_153.sroa.0.0, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_155.sroa.0.0, i8 noundef %_137) #28
  %118 = extractvalue { i64, ptr } %117, 0
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_149)
  %119 = icmp eq i64 %118, 2
  br i1 %119, label %bb104, label %bb103

bb104:                                            ; preds = %bb41
  call void @llvm.lifetime.start.p0(i64 424, ptr nonnull %event)
  %_212 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %_160 = getelementptr inbounds i8, ptr %_212, i64 8
  %_213 = load ptr, ptr %a, align 8, !nonnull !2, !align !3, !noundef !2
  %_161 = getelementptr inbounds i8, ptr %_213, i64 8
  %_214 = load ptr, ptr %82, align 8, !nonnull !2, !align !3, !noundef !2
  %_162 = getelementptr inbounds i8, ptr %_214, i64 8
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_164)
  %_338 = load ptr, ptr %_8, align 8, !nonnull !2, !align !3, !noundef !2
  %_339 = load ptr, ptr %_338, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_164, ptr noundef nonnull align 1 dereferenceable(32) %_339, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_166)
  %_215 = load ptr, ptr %69, align 8, !nonnull !2, !align !3, !noundef !2
  %120 = getelementptr inbounds i8, ptr %_215, i64 88
  %_340 = load ptr, ptr %120, align 8, !nonnull !2, !align !3, !noundef !2
  %_341 = load ptr, ptr %_340, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_166, ptr noundef nonnull align 1 dereferenceable(32) %_341, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_169)
; call pump_recovered::transfer_fee_recovered::post_fee_amount
  call void @_ZN14pump_recovered22transfer_fee_recovered15post_fee_amount17h1fdc8f54379b7e47E(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_169, ptr noalias noundef nonnull readonly align 8 dereferenceable(32) %quote_fee, i64 noundef %_326) #28
  %121 = load i64, ptr %_169, align 8, !range !318, !noundef !2
  %122 = icmp eq i64 %121, 2
  %123 = getelementptr inbounds i8, ptr %_169, i64 8
  br i1 %122, label %bb106, label %bb105

bb103:                                            ; preds = %bb41
  %124 = extractvalue { i64, ptr } %117, 1
  br label %bb57

bb106:                                            ; preds = %bb104
  %_343 = load i64, ptr %123, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_169)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_175)
; call solana_sysvar::clock::<impl solana_sysvar::Sysvar for solana_clock::Clock>::get
  call void @"_ZN13solana_sysvar5clock71_$LT$impl$u20$solana_sysvar..Sysvar$u20$for$u20$solana_clock..Clock$GT$3get17hf864a57fc372ac1bE"(ptr noalias nocapture noundef nonnull sret([48 x i8]) align 8 dereferenceable(48) %_175) #28
  %_347 = load i64, ptr %_175, align 8, !range !389, !noundef !2
  %trunc67.not = icmp eq i64 %_347, 0
  br i1 %trunc67.not, label %bb108, label %bb107

bb105:                                            ; preds = %bb104
  %_344.1 = load ptr, ptr %123, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_169)
  br label %bb61

bb108:                                            ; preds = %bb106
  %_348.sroa.8.0..sroa_idx = getelementptr inbounds i8, ptr %_175, i64 40
  %_348.sroa.8.0.copyload = load i64, ptr %_348.sroa.8.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_175)
; call pump_recovered::multi_hop_curve::trade_event
  call void @_ZN14pump_recovered15multi_hop_curve11trade_event17h9a2d0db499b743a0E(ptr noalias nocapture noundef nonnull sret([424 x i8]) align 8 dereferenceable(424) %event, ptr noalias noundef nonnull readonly align 8 dereferenceable(160) %_160, ptr noalias noundef nonnull readonly align 8 dereferenceable(1080) %_161, ptr noalias noundef nonnull readonly align 8 dereferenceable(104) %_162, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %_164, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %_166, i1 noundef zeroext false, i64 noundef %amount, i64 noundef %_2563165, ptr noalias noundef nonnull readonly align 8 dereferenceable(32) %fees, i64 noundef %_343, i64 noundef %_284, ptr noalias noundef nonnull readonly align 1 @alloc_a8e2a7837cf47ea0175cf2cdf296029a, i64 noundef 4, i64 noundef %_348.sroa.8.0.copyload) #28
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_166)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_164)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_180)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_182)
; call <pump_recovered::TradeEvent as anchor_lang::Event>::data
  call void @"_ZN65_$LT$pump_recovered..TradeEvent$u20$as$u20$anchor_lang..Event$GT$4data17hefda510981ad5c98E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_182, ptr noalias noundef nonnull readonly align 8 dereferenceable(424) %event) #28
  %125 = getelementptr inbounds i8, ptr %_182, i64 8
  %_355 = load ptr, ptr %125, align 8, !nonnull !2, !noundef !2
  %126 = getelementptr inbounds i8, ptr %_182, i64 16
  %_354 = load i64, ptr %126, align 8, !noundef !2
  store ptr %_355, ptr %_180, align 8
  %127 = getelementptr inbounds i8, ptr %_180, i64 8
  store i64 %_354, ptr %127, align 8
; call solana_program::log::sol_log_data
  call void @_ZN14solana_program3log12sol_log_data17h1e024b73f122854fE(ptr noalias noundef nonnull readonly align 8 %_180, i64 noundef 1) #28
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_182)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_180)
  call void @llvm.experimental.noalias.scope.decl(metadata !14102)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_9.i)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %inner_data.i)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %authority_info.i)
  %_4.i = getelementptr inbounds i8, ptr %a, i64 128
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %authority_info.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_4.i) #28, !noalias !14105
  %128 = getelementptr inbounds i8, ptr %ctx, i64 36
  %authority_bump.i = load i8, ptr %128, align 4, !alias.scope !14102, !noalias !14107, !noundef !2
; call <pump_recovered::TradeEvent as anchor_lang::Event>::data
  call void @"_ZN65_$LT$pump_recovered..TradeEvent$u20$as$u20$anchor_lang..Event$GT$4data17hefda510981ad5c98E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %inner_data.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(424) %event) #28, !noalias !14102
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %ix_data.i), !noalias !14105
  %me.sroa.0.0.copyload.i = load i64, ptr %inner_data.i, align 8, !alias.scope !14108, !noalias !14111
  %me.sroa.4.0.self.sroa_idx.i = getelementptr inbounds i8, ptr %inner_data.i, i64 8
  %me.sroa.4.0.copyload.i = load ptr, ptr %me.sroa.4.0.self.sroa_idx.i, align 8, !alias.scope !14108, !noalias !14111, !nonnull !2, !noundef !2
  %me.sroa.5.0.self.sroa_idx.i = getelementptr inbounds i8, ptr %inner_data.i, i64 16
  %me.sroa.5.0.copyload.i = load i64, ptr %me.sroa.5.0.self.sroa_idx.i, align 8, !alias.scope !14108, !noalias !14111
  %_18.i = getelementptr inbounds i8, ptr %me.sroa.4.0.copyload.i, i64 %me.sroa.5.0.copyload.i
  %129 = getelementptr inbounds i8, ptr %_9.i, i64 32
  store ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, ptr %129, align 8, !noalias !14105
  %130 = getelementptr inbounds i8, ptr %_9.i, i64 40
  store ptr getelementptr inbounds (<{ [8 x i8] }>, ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, i64 1, i32 0, i64 0), ptr %130, align 8, !noalias !14105
  store ptr %me.sroa.4.0.copyload.i, ptr %_9.i, align 8, !noalias !14105
  %_51.i.sroa.4.0._9.i.sroa_idx = getelementptr inbounds i8, ptr %_9.i, i64 8
  store ptr %me.sroa.4.0.copyload.i, ptr %_51.i.sroa.4.0._9.i.sroa_idx, align 8, !noalias !14105
  %_51.i.sroa.5.0._9.i.sroa_idx = getelementptr inbounds i8, ptr %_9.i, i64 16
  store i64 %me.sroa.0.0.copyload.i, ptr %_51.i.sroa.5.0._9.i.sroa_idx, align 8, !noalias !14105
  %_51.i.sroa.6.0._9.i.sroa_idx = getelementptr inbounds i8, ptr %_9.i, i64 24
  store ptr %_18.i, ptr %_51.i.sroa.6.0._9.i.sroa_idx, align 8, !noalias !14105
; call <alloc::vec::Vec<T> as alloc::vec::spec_from_iter::SpecFromIter<T,I>>::from_iter
  call fastcc void @"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h05834ec09ece64f1E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %ix_data.i, ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_9.i) #28, !noalias !14102
  call void @llvm.lifetime.start.p0(i64 80, ptr nonnull %ix.i), !noalias !14105
  %131 = getelementptr inbounds i8, ptr %ix_data.i, i64 8
  %_54.i = load ptr, ptr %131, align 8, !nonnull !2, !noundef !2
  %132 = getelementptr inbounds i8, ptr %ix_data.i, i64 16
  %_53.i = load i64, ptr %132, align 8, !noalias !14105, !noundef !2
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_17.i), !noalias !14105
; call alloc::alloc::exchange_malloc
  %_19.i = call fastcc noundef ptr @_ZN5alloc5alloc15exchange_malloc17h6cd8dd11b0e3424eE(i64 noundef 34, i64 noundef 1) #28, !noalias !14102
  %_42.i = load ptr, ptr %authority_info.i, align 8, !noalias !14105, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memmove.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_19.i, ptr noundef nonnull align 1 dereferenceable(32) %_42.i, i64 32, i1 false)
  %_21.sroa.4.0..sroa_idx.i = getelementptr inbounds i8, ptr %_19.i, i64 32
  store i8 1, ptr %_21.sroa.4.0..sroa_idx.i, align 1, !noalias !14102
  %_21.sroa.5.0..sroa_idx.i = getelementptr inbounds i8, ptr %_19.i, i64 33
  store i8 0, ptr %_21.sroa.5.0..sroa_idx.i, align 1, !noalias !14102
  store i64 1, ptr %_17.i, align 8, !alias.scope !14113, !noalias !14116
  %133 = getelementptr inbounds i8, ptr %_17.i, i64 8
  store ptr %_19.i, ptr %133, align 8, !alias.scope !14113, !noalias !14116
  %134 = getelementptr inbounds i8, ptr %_17.i, i64 16
  store i64 1, ptr %134, align 8, !alias.scope !14113, !noalias !14116
; call solana_instruction::Instruction::new_with_bytes
  call void @_ZN18solana_instruction11Instruction14new_with_bytes17h836fab8fb6401158E(ptr noalias nocapture noundef nonnull sret([80 x i8]) align 8 dereferenceable(80) %ix.i, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) @_ZN14pump_recovered2ID17h8e245cf89cf2c06bE, ptr noalias noundef nonnull readonly align 1 %_54.i, i64 noundef %_53.i, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_17.i) #28, !noalias !14102
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_17.i), !noalias !14105
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_29.i), !noalias !14105
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %_29.i, ptr noundef nonnull align 8 dereferenceable(48) %authority_info.i, i64 48, i1 false), !noalias !14105
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_32.i), !noalias !14105
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_35.i), !noalias !14105
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %_39.i), !noalias !14105
  store i8 %authority_bump.i, ptr %_39.i, align 1, !noalias !14105
  store ptr @alloc_7a7952b5e0d15f2b72d0341cef6d4739, ptr %_35.i, align 8, !noalias !14105
  %135 = getelementptr inbounds i8, ptr %_35.i, i64 8
  store i64 17, ptr %135, align 8, !noalias !14105
  %136 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_35.i, i64 0, i64 1
  store ptr %_39.i, ptr %136, align 8, !noalias !14105
  %137 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_35.i, i64 0, i64 1, i32 1
  store i64 1, ptr %137, align 8, !noalias !14105
  store ptr %_35.i, ptr %_32.i, align 8, !noalias !14105
  %138 = getelementptr inbounds i8, ptr %_32.i, i64 8
  store i64 2, ptr %138, align 8, !noalias !14105
; call solana_program::program::invoke_signed
  call void @_ZN14solana_program7program13invoke_signed17h01c3b84bc1fc491eE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_25.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(80) %ix.i, ptr noalias noundef nonnull readonly align 8 %_29.i, i64 noundef 1, ptr noalias noundef nonnull readonly align 8 %_32.i, i64 noundef 1) #28
  %139 = load i64, ptr %_25.i, align 8, !range !366, !noundef !2
  %140 = icmp eq i64 %139, -9223372036854775782
  br i1 %140, label %bb18.i, label %bb17.i

bb18.i:                                           ; preds = %bb108
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_39.i), !noalias !14105
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_35.i), !noalias !14105
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_32.i), !noalias !14105
  %141 = getelementptr inbounds i8, ptr %_29.i, i64 8
  %_29.i.val = load ptr, ptr %141, align 8, !nonnull !2, !noundef !2
  %142 = getelementptr inbounds i8, ptr %_29.i, i64 16
  %_29.i.val74 = load ptr, ptr %142, align 8
  %self1.val.i.i.i.i = load i64, ptr %_29.i.val, align 8, !noundef !2
  %val.i.i.i.i = add i64 %self1.val.i.i.i.i, -1
  store i64 %val.i.i.i.i, ptr %_29.i.val, align 8
  %143 = icmp eq i64 %val.i.i.i.i, 0
  br i1 %143, label %bb1.i.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i"

bb1.i.i.i.i:                                      ; preds = %bb18.i
  %144 = getelementptr i8, ptr %_29.i.val, i64 8
  %self2.val.i.i.i.i = load i64, ptr %144, align 8, !noundef !2
  %val6.i.i.i.i = add i64 %self2.val.i.i.i.i, -1
  store i64 %val6.i.i.i.i, ptr %144, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i": ; preds = %bb1.i.i.i.i, %bb18.i
  %145 = icmp ne ptr %_29.i.val74, null
  call void @llvm.assume(i1 %145)
  %self1.val.i.i2.i.i = load i64, ptr %_29.i.val74, align 8, !noundef !2
  %val.i.i3.i.i = add i64 %self1.val.i.i2.i.i, -1
  store i64 %val.i.i3.i.i, ptr %_29.i.val74, align 8
  %146 = icmp eq i64 %val.i.i3.i.i, 0
  br i1 %146, label %bb1.i.i4.i.i, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit"

bb1.i.i4.i.i:                                     ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i"
  %147 = getelementptr i8, ptr %_29.i.val74, i64 8
  %self2.val.i.i5.i.i = load i64, ptr %147, align 8, !noundef !2
  %val6.i.i6.i.i = add i64 %self2.val.i.i5.i.i, -1
  store i64 %val6.i.i6.i.i, ptr %147, align 8
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i", %bb1.i.i4.i.i
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_29.i), !noalias !14105
  %_1.val.i = load i64, ptr %ix.i, align 8, !alias.scope !14118, !noalias !14102, !noundef !2
  %148 = icmp eq i64 %_1.val.i, 0
  br i1 %148, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i", label %bb2.i.i.i.i

bb2.i.i.i.i:                                      ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit"
  %149 = getelementptr inbounds i8, ptr %ix.i, i64 8
  %_1.val2.i = load ptr, ptr %149, align 8, !alias.scope !14118, !noalias !14102
  %150 = icmp ne ptr %_1.val2.i, null
  call void @llvm.assume(i1 %150), !noalias !14102
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i": ; preds = %bb2.i.i.i.i, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit"
  %151 = getelementptr inbounds i8, ptr %ix.i, i64 24
  %.val.i = load i64, ptr %151, align 8, !alias.scope !14118, !noalias !14102, !noundef !2
  %152 = icmp eq i64 %.val.i, 0
  br i1 %152, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i"
  %153 = getelementptr inbounds i8, ptr %ix.i, i64 32
  %.val1.i = load ptr, ptr %153, align 8, !alias.scope !14118, !noalias !14102
  %154 = icmp ne ptr %.val1.i, null
  call void @llvm.assume(i1 %154), !noalias !14102
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix.i), !noalias !14105
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data.i), !noalias !14105
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_9.i)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %inner_data.i)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %authority_info.i)
  br label %bb111

bb17.i:                                           ; preds = %bb108
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %155 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17ha4865197be4b9a2fE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_25.i) #28
  %_59.0.i = extractvalue { i64, ptr } %155, 0
  %_59.1.i = extractvalue { i64, ptr } %155, 1
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_39.i), !noalias !14105
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_35.i), !noalias !14105
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_32.i), !noalias !14105
  %156 = getelementptr inbounds i8, ptr %_29.i, i64 8
  %_29.i.val75 = load ptr, ptr %156, align 8, !nonnull !2, !noundef !2
  %157 = getelementptr inbounds i8, ptr %_29.i, i64 16
  %_29.i.val76 = load ptr, ptr %157, align 8
  %self1.val.i.i.i.i88 = load i64, ptr %_29.i.val75, align 8, !noundef !2
  %val.i.i.i.i89 = add i64 %self1.val.i.i.i.i88, -1
  store i64 %val.i.i.i.i89, ptr %_29.i.val75, align 8
  %158 = icmp eq i64 %val.i.i.i.i89, 0
  br i1 %158, label %bb1.i.i.i.i96, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i90"

bb1.i.i.i.i96:                                    ; preds = %bb17.i
  %159 = getelementptr i8, ptr %_29.i.val75, i64 8
  %self2.val.i.i.i.i97 = load i64, ptr %159, align 8, !noundef !2
  %val6.i.i.i.i98 = add i64 %self2.val.i.i.i.i97, -1
  store i64 %val6.i.i.i.i98, ptr %159, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i90"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i90": ; preds = %bb1.i.i.i.i96, %bb17.i
  %160 = icmp ne ptr %_29.i.val76, null
  call void @llvm.assume(i1 %160)
  %self1.val.i.i2.i.i91 = load i64, ptr %_29.i.val76, align 8, !noundef !2
  %val.i.i3.i.i92 = add i64 %self1.val.i.i2.i.i91, -1
  store i64 %val.i.i3.i.i92, ptr %_29.i.val76, align 8
  %161 = icmp eq i64 %val.i.i3.i.i92, 0
  br i1 %161, label %bb1.i.i4.i.i93, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit99"

bb1.i.i4.i.i93:                                   ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i90"
  %162 = getelementptr i8, ptr %_29.i.val76, i64 8
  %self2.val.i.i5.i.i94 = load i64, ptr %162, align 8, !noundef !2
  %val6.i.i6.i.i95 = add i64 %self2.val.i.i5.i.i94, -1
  store i64 %val6.i.i6.i.i95, ptr %162, align 8
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit99"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit99": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i90", %bb1.i.i4.i.i93
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_29.i), !noalias !14105
  %_1.val.i100 = load i64, ptr %ix.i, align 8, !alias.scope !14121, !noalias !14102, !noundef !2
  %163 = icmp eq i64 %_1.val.i100, 0
  br i1 %163, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i103", label %bb2.i.i.i.i101

bb2.i.i.i.i101:                                   ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit99"
  %164 = getelementptr inbounds i8, ptr %ix.i, i64 8
  %_1.val2.i102 = load ptr, ptr %164, align 8, !alias.scope !14121, !noalias !14102
  %165 = icmp ne ptr %_1.val2.i102, null
  call void @llvm.assume(i1 %165), !noalias !14102
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i103"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i103": ; preds = %bb2.i.i.i.i101, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit99"
  %166 = getelementptr inbounds i8, ptr %ix.i, i64 24
  %.val.i104 = load i64, ptr %166, align 8, !alias.scope !14121, !noalias !14102, !noundef !2
  %167 = icmp eq i64 %.val.i104, 0
  br i1 %167, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit107", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i105"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i105": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i103"
  %168 = getelementptr inbounds i8, ptr %ix.i, i64 32
  %.val1.i106 = load ptr, ptr %168, align 8, !alias.scope !14121, !noalias !14102
  %169 = icmp ne ptr %.val1.i106, null
  call void @llvm.assume(i1 %169), !noalias !14102
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit107"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit107": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i103", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i105"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix.i), !noalias !14105
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data.i), !noalias !14105
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_9.i)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %inner_data.i)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %authority_info.i)
  %170 = icmp eq i64 %_59.0.i, 2
  br i1 %170, label %bb111, label %bb110

bb107:                                            ; preds = %bb106
  %171 = getelementptr inbounds i8, ptr %_175, i64 8
  %_349.sroa.0.0.copyload = load i64, ptr %171, align 8
  %_349.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_175, i64 16
  %_349.sroa.5.0.copyload = load i64, ptr %_349.sroa.5.0..sroa_idx, align 8
  %_349.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_175, i64 24
  %_349.sroa.6.0.copyload = load i64, ptr %_349.sroa.6.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_175)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_351)
  store i64 %_349.sroa.0.0.copyload, ptr %_351, align 8
  %residual18.sroa.2.0._351.sroa_idx = getelementptr inbounds i8, ptr %_351, i64 8
  store i64 %_349.sroa.5.0.copyload, ptr %residual18.sroa.2.0._351.sroa_idx, align 8
  %residual18.sroa.3.0._351.sroa_idx = getelementptr inbounds i8, ptr %_351, i64 16
  store i64 %_349.sroa.6.0.copyload, ptr %residual18.sroa.3.0._351.sroa_idx, align 8
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %172 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17ha4865197be4b9a2fE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_351) #28
  %_352.0 = extractvalue { i64, ptr } %172, 0
  %_352.1 = extractvalue { i64, ptr } %172, 1
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_351)
  br label %bb61

bb111:                                            ; preds = %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit", %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit107"
  %_1.val.i.i = load i64, ptr %event, align 8, !alias.scope !14124, !noundef !2
  %173 = icmp eq i64 %_1.val.i.i, 0
  br i1 %173, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i": ; preds = %bb111
  %174 = getelementptr inbounds i8, ptr %event, i64 8
  %_1.val1.i.i = load ptr, ptr %174, align 8, !alias.scope !14124
  %175 = icmp ne ptr %_1.val1.i.i, null
  call void @llvm.assume(i1 %175)
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i", %bb111
  %176 = getelementptr inbounds i8, ptr %event, i64 24
  %.val.i110 = load i64, ptr %176, align 8, !alias.scope !14129, !noundef !2
  %177 = icmp eq i64 %.val.i110, 0
  br i1 %177, label %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h9dae8b4f052b6b2eE.exit", label %bb2.i.i.i.i111

bb2.i.i.i.i111:                                   ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i"
  %178 = getelementptr inbounds i8, ptr %event, i64 32
  %.val1.i112 = load ptr, ptr %178, align 8, !alias.scope !14129
  %179 = icmp ne ptr %.val1.i112, null
  call void @llvm.assume(i1 %179)
  br label %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h9dae8b4f052b6b2eE.exit"

"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h9dae8b4f052b6b2eE.exit": ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i", %bb2.i.i.i.i111
  call void @llvm.lifetime.end.p0(i64 424, ptr nonnull %event)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %fees)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %quote_fee)
  br label %bb60

bb110:                                            ; preds = %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit107"
  %_1.val.i.i113 = load i64, ptr %event, align 8, !alias.scope !14130, !noundef !2
  %180 = icmp eq i64 %_1.val.i.i113, 0
  br i1 %180, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i116", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i114"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i114": ; preds = %bb110
  %181 = getelementptr inbounds i8, ptr %event, i64 8
  %_1.val1.i.i115 = load ptr, ptr %181, align 8, !alias.scope !14130
  %182 = icmp ne ptr %_1.val1.i.i115, null
  call void @llvm.assume(i1 %182)
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i116"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i116": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i114", %bb110
  %183 = getelementptr inbounds i8, ptr %event, i64 24
  %.val.i117 = load i64, ptr %183, align 8, !alias.scope !14135, !noundef !2
  %184 = icmp eq i64 %.val.i117, 0
  br i1 %184, label %bb51, label %bb2.i.i.i.i118

bb2.i.i.i.i118:                                   ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i116"
  %185 = getelementptr inbounds i8, ptr %event, i64 32
  %.val1.i119 = load ptr, ptr %185, align 8, !alias.scope !14135
  %186 = icmp ne ptr %.val1.i119, null
  call void @llvm.assume(i1 %186)
  br label %bb51

bb60:                                             ; preds = %bb62, %bb64, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit", %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit83", %bb68, %bb59, %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h9dae8b4f052b6b2eE.exit"
  %_0.sroa.25.0 = phi ptr [ %_18.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit" ], [ %_31.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit83" ], [ %_252.1, %bb68 ], [ %_0.sroa.25.4, %bb59 ], [ undef, %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h9dae8b4f052b6b2eE.exit" ], [ %13, %bb64 ], [ %12, %bb62 ]
  %_0.sroa.0.0 = phi i64 [ %_18.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit" ], [ %_31.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit83" ], [ %_252.0, %bb68 ], [ %_0.sroa.0.4, %bb59 ], [ 2, %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h9dae8b4f052b6b2eE.exit" ], [ %10, %bb64 ], [ %3, %bb62 ]
  %187 = insertvalue { i64, ptr } poison, i64 %_0.sroa.0.0, 0
  %188 = insertvalue { i64, ptr } %187, ptr %_0.sroa.25.0, 1
  ret { i64, ptr } %188

bb51:                                             ; preds = %bb2.i.i.i.i118, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i116", %bb61
  %_0.sroa.25.1 = phi ptr [ %_0.sroa.25.2, %bb61 ], [ %_59.1.i, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i116" ], [ %_59.1.i, %bb2.i.i.i.i118 ]
  %_0.sroa.0.1 = phi i64 [ %_0.sroa.0.2, %bb61 ], [ %_59.0.i, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i116" ], [ %_59.0.i, %bb2.i.i.i.i118 ]
  call void @llvm.lifetime.end.p0(i64 424, ptr nonnull %event)
  br label %bb57

bb61:                                             ; preds = %bb105, %bb107
  %_0.sroa.25.2 = phi ptr [ %_352.1, %bb107 ], [ %_344.1, %bb105 ]
  %_0.sroa.0.2 = phi i64 [ %_352.0, %bb107 ], [ %121, %bb105 ]
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_166)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_164)
  br label %bb51

bb57:                                             ; preds = %bb77, %bb96, %bb94, %bb91, %bb51, %bb103, %bb100, %bb83, %bb98, %bb87, %bb85, %bb79, %bb21, %bb75
  %_0.sroa.25.3 = phi ptr [ %_269.sroa.5.0.copyload, %bb75 ], [ %_77.1, %bb21 ], [ %_0.sroa.25.1, %bb51 ], [ %124, %bb103 ], [ %_327.1, %bb100 ], [ %111, %bb98 ], [ %101, %bb96 ], [ %100, %bb94 ], [ %93, %bb91 ], [ %78, %bb87 ], [ %75, %bb85 ], [ %_286.1, %bb83 ], [ %_280.1, %bb79 ], [ %_275.1, %bb77 ]
  %_0.sroa.0.3 = phi i64 [ %_269.sroa.0.0.copyload, %bb75 ], [ %_77.0, %bb21 ], [ %_0.sroa.0.1, %bb51 ], [ %118, %bb103 ], [ %108, %bb100 ], [ %106, %bb98 ], [ %98, %bb96 ], [ %91, %bb94 ], [ %80, %bb91 ], [ %73, %bb87 ], [ %66, %bb85 ], [ %_286.0, %bb83 ], [ %55, %bb79 ], [ %52, %bb77 ]
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %fees)
  br label %bb59

bb59:                                             ; preds = %bb72, %bb70, %bb57
  %_0.sroa.25.4 = phi ptr [ %_0.sroa.25.3, %bb57 ], [ %_257.1, %bb70 ], [ %_263.1, %bb72 ]
  %_0.sroa.0.4 = phi i64 [ %_0.sroa.0.3, %bb57 ], [ %_2563165, %bb70 ], [ %_263.0, %bb72 ]
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %quote_fee)
  br label %bb60
}
