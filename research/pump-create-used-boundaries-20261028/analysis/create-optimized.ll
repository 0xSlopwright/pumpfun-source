define hidden { i64, ptr } @_ZN14pump_recovered9create_v27execute17h3f7d08900031c023E(ptr noalias nocapture noundef readonly align 8 dereferenceable(40) %ctx, ptr noalias nocapture noundef align 8 dereferenceable(24) %name, ptr noalias nocapture noundef align 8 dereferenceable(24) %symbol, ptr noalias nocapture noundef align 8 dereferenceable(24) %uri, ptr noalias nocapture noundef readonly align 1 dereferenceable(32) %creator, i1 noundef zeroext %is_mayhem_mode, i1 noundef zeroext %is_cashback_enabled, i64 noundef %creator_fee_bps, i1 noundef zeroext %is_holder_reward) unnamed_addr #1 {
start:
  %_11.i113 = alloca [0 x i8], align 1
  %formatter.i114 = alloca [64 x i8], align 8
  %buf.i115 = alloca [24 x i8], align 8
  %formatter.i16.i = alloca [64 x i8], align 8
  %buf.i17.i = alloca [24 x i8], align 8
  %formatter.i9.i = alloca [64 x i8], align 8
  %buf.i10.i = alloca [24 x i8], align 8
  %formatter.i3.i = alloca [64 x i8], align 8
  %buf.i4.i = alloca [24 x i8], align 8
  %formatter.i.i = alloca [64 x i8], align 8
  %buf.i.i = alloca [24 x i8], align 8
  %_16.i = alloca [24 x i8], align 8
  %_15.i = alloca [48 x i8], align 8
  %_14.sroa.4.i = alloca [55 x i8], align 1
  %_8.i95 = alloca [24 x i8], align 8
  %_7.i96 = alloca [48 x i8], align 8
  %_6.sroa.4.i97 = alloca [55 x i8], align 1
  %values.i = alloca [16 x i8], align 8
  %formatter.i89 = alloca [64 x i8], align 8
  %buf.i90 = alloca [24 x i8], align 8
  %formatter.i82 = alloca [64 x i8], align 8
  %buf.i83 = alloca [24 x i8], align 8
  %formatter.i75 = alloca [64 x i8], align 8
  %buf.i76 = alloca [24 x i8], align 8
  %formatter.i68 = alloca [64 x i8], align 8
  %buf.i69 = alloca [24 x i8], align 8
  %formatter.i = alloca [64 x i8], align 8
  %buf.i = alloca [24 x i8], align 8
  %_34.i = alloca [160 x i8], align 8
  %_21.i = alloca [160 x i8], align 8
  %_8.i = alloca [160 x i8], align 8
  %_27.i.i = alloca [24 x i8], align 8
  %_19.i.i = alloca [24 x i8], align 8
  %_14.i.i = alloca [16 x i8], align 8
  %_5.i.i = alloca [32 x i8], align 1
  %0 = alloca [32 x i8], align 8
  %_204.i = alloca [24 x i8], align 8
  %_137.i = alloca [48 x i8], align 8
  %_136.i = alloca [288 x i8], align 8
  %_132.i = alloca [24 x i8], align 8
  %system.i = alloca [48 x i8], align 8
  %quote_info.i = alloca [48 x i8], align 8
  %authority.i = alloca [48 x i8], align 8
  %associated.i = alloca [48 x i8], align 8
  %payer.i = alloca [48 x i8], align 8
  %_125.i = alloca [32 x i8], align 1
  %_123.i = alloca [32 x i8], align 8
  %_121.i = alloca [32 x i8], align 1
  %_119.i = alloca [32 x i8], align 1
  %ix.i = alloca [80 x i8], align 8
  %_114.i = alloca [64 x i8], align 1
  %_106.i = alloca [160 x i8], align 8
  %_103.i = alloca [32 x i8], align 1
  %_101.i = alloca [32 x i8], align 1
  %expected.i = alloca [32 x i8], align 1
  %_95.i = alloca [32 x i8], align 8
  %_93.i = alloca [32 x i8], align 1
  %_89.i = alloca [64 x i8], align 1
  %_81.i = alloca [160 x i8], align 8
  %_78.i = alloca [32 x i8], align 1
  %_73.i.sroa.8 = alloca [16 x i8], align 1
  %_69.i = alloca [64 x i8], align 1
  %_61.i = alloca [160 x i8], align 8
  %_58.i = alloca [32 x i8], align 1
  %_53.i = alloca [32 x i8], align 1
  %_52.i = alloca [32 x i8], align 1
  %_49.i = alloca [32 x i8], align 1
  %_40.i = alloca [160 x i8], align 8
  %_30.i = alloca [160 x i8], align 8
  %_28.i = alloca [32 x i8], align 1
  %_26.i = alloca [32 x i8], align 1
  %_11.i = alloca [24 x i8], align 8
  %_10.i = alloca [160 x i8], align 8
  %val8.sroa.3 = alloca [16 x i8], align 8
  %_227 = alloca [1 x i8], align 1
  %_223 = alloca [32 x i8], align 8
  %_220 = alloca [16 x i8], align 8
  %_217 = alloca [48 x i8], align 8
  %_213 = alloca [24 x i8], align 8
  %_205 = alloca [24 x i8], align 8
  %ix = alloca [80 x i8], align 8
  %_197 = alloca [48 x i8], align 8
  %ix_data = alloca [24 x i8], align 8
  %inner_data = alloca [24 x i8], align 8
  %authority_info = alloca [48 x i8], align 8
  %_188 = alloca [24 x i8], align 8
  %_186 = alloca [16 x i8], align 8
  %_174 = alloca [24 x i8], align 8
  %_173 = alloca [24 x i8], align 8
  %_172 = alloca [24 x i8], align 8
  %_171 = alloca [328 x i8], align 8
  %event = alloca [328 x i8], align 8
  %_157 = alloca [24 x i8], align 8
  %_155 = alloca [24 x i8], align 8
  %_153 = alloca [24 x i8], align 8
  %_133 = alloca [32 x i8], align 1
  %_121 = alloca [160 x i8], align 8
  %_110 = alloca [160 x i8], align 8
  %_97 = alloca [160 x i8], align 8
  %_89 = alloca [32 x i8], align 1
  %_85.sroa.26 = alloca [16 x i8], align 8
  %quote_mint = alloca [32 x i8], align 8
  %_74 = alloca [24 x i8], align 8
  %_73 = alloca [160 x i8], align 8
  %_66 = alloca [64 x i8], align 1
  %_59 = alloca [24 x i8], align 8
  %_58 = alloca [160 x i8], align 8
  %_55 = alloca [32 x i8], align 1
  %_53 = alloca [32 x i8], align 1
  %_50 = alloca [32 x i8], align 8
  %_47 = alloca [33 x i8], align 1
  %_40 = alloca [24 x i8], align 8
  %_39 = alloca [160 x i8], align 8
  %creator1 = alloca [32 x i8], align 1
  %_28 = alloca [24 x i8], align 8
  %_27 = alloca [160 x i8], align 8
  %_16 = alloca [24 x i8], align 8
  %_15 = alloca [160 x i8], align 8
  br i1 %is_mayhem_mode, label %bb1, label %bb8

bb8:                                              ; preds = %bb1, %start
  br i1 %is_cashback_enabled, label %bb9, label %bb13

bb1:                                              ; preds = %start
  %1 = getelementptr inbounds i8, ptr %ctx, i64 8
  %_229 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %2 = getelementptr inbounds i8, ptr %_229, i64 248
  %_230 = load ptr, ptr %2, align 8, !nonnull !2, !align !3, !noundef !2
  %3 = getelementptr inbounds i8, ptr %_230, i64 1084
  %4 = load i8, ptr %3, align 4, !range !374, !noundef !2
  %_12.not = icmp eq i8 %4, 0
  br i1 %_12.not, label %bb2, label %bb8

bb2:                                              ; preds = %bb1
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_15)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_16)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_16, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_17ff8408cb8e527722e7af61db344e75) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i113)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i), !noalias !5968
  store i64 0, ptr %buf.i, align 8, !noalias !5968
  %_9.sroa.4.0.buf.sroa_idx.i = getelementptr inbounds i8, ptr %buf.i, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i, align 8, !noalias !5968
  %_9.sroa.5.0.buf.sroa_idx.i = getelementptr inbounds i8, ptr %buf.i, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i, align 8, !noalias !5968
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i), !noalias !5968
  %5 = getelementptr inbounds i8, ptr %formatter.i, i64 52
  store i32 0, ptr %5, align 4, !noalias !5968
  %6 = getelementptr inbounds i8, ptr %formatter.i, i64 48
  store i32 32, ptr %6, align 8, !noalias !5968
  %7 = getelementptr inbounds i8, ptr %formatter.i, i64 56
  store i8 3, ptr %7, align 8, !noalias !5968
  store i64 0, ptr %formatter.i, align 8, !noalias !5968
  %8 = getelementptr inbounds i8, ptr %formatter.i, i64 16
  store i64 0, ptr %8, align 8, !noalias !5968
  %9 = getelementptr inbounds i8, ptr %formatter.i, i64 32
  store ptr %buf.i, ptr %9, align 8, !noalias !5968
  %10 = getelementptr inbounds i8, ptr %formatter.i, i64 40
  store ptr @vtable.4, ptr %10, align 8, !noalias !5968
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %11 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hbf6a90ed7cf777ebE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_17ff8408cb8e527722e7af61db344e75, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i) #28, !noalias !5972
  br i1 %11, label %bb3.i66, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit"

bb3.i66:                                          ; preds = %bb2
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i113, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !5968
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit": ; preds = %bb2
  %12 = getelementptr inbounds i8, ptr %_15, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %12, ptr noundef nonnull align 8 dereferenceable(24) %buf.i, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i), !noalias !5968
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i), !noalias !5968
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i113)
  %13 = getelementptr inbounds i8, ptr %_15, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %13, ptr noundef nonnull align 8 dereferenceable(24) %_16, i64 24, i1 false)
  %14 = getelementptr inbounds i8, ptr %_15, i64 152
  store i32 6048, ptr %14, align 8
  store i64 0, ptr %_15, align 8
  %_19.sroa.4.0._15.sroa_idx = getelementptr inbounds i8, ptr %_15, i64 8
  store ptr @alloc_16d51f561de09534a0f1e393d54002ab, ptr %_19.sroa.4.0._15.sroa_idx, align 8
  %_19.sroa.4.sroa.4.0._19.sroa.4.0._15.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_15, i64 16
  store i64 30, ptr %_19.sroa.4.sroa.4.0._19.sroa.4.0._15.sroa_idx.sroa_idx, align 8
  %_19.sroa.4.sroa.5.0._19.sroa.4.0._15.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_15, i64 24
  store i32 709, ptr %_19.sroa.4.sroa.5.0._19.sroa.4.0._15.sroa_idx.sroa_idx, align 8
  %15 = getelementptr inbounds i8, ptr %_15, i64 80
  store i8 2, ptr %15, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_16)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %16 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_15) #28
  %_14.0 = extractvalue { i64, ptr } %16, 0
  %_14.1 = extractvalue { i64, ptr } %16, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_15)
  %_232 = load ptr, ptr %2, align 8, !nonnull !2, !align !3, !noundef !2
  %17 = getelementptr inbounds i8, ptr %_232, i64 1084
  %18 = load i8, ptr %17, align 4, !range !374, !noundef !2
  %_24 = icmp ne i8 %18, 0
; call anchor_lang::error::Error::with_values
  %19 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17he8c2a935fab70db2E(i64 noundef %_14.0, ptr noundef %_14.1, i1 noundef zeroext %_24, i1 noundef zeroext true) #28
  %_13.0 = extractvalue { i64, ptr } %19, 0
  %_13.1 = extractvalue { i64, ptr } %19, 1
  br label %bb99

bb13:                                             ; preds = %bb8
  br i1 %is_holder_reward, label %bb14, label %bb15

bb9:                                              ; preds = %bb8
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_27)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_28)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_28, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_b0b2a182f92294de465c6bd658b159d4) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i113)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i69), !noalias !5973
  store i64 0, ptr %buf.i69, align 8, !noalias !5973
  %_9.sroa.4.0.buf.sroa_idx.i70 = getelementptr inbounds i8, ptr %buf.i69, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i70, align 8, !noalias !5973
  %_9.sroa.5.0.buf.sroa_idx.i71 = getelementptr inbounds i8, ptr %buf.i69, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i71, align 8, !noalias !5973
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i68), !noalias !5973
  %20 = getelementptr inbounds i8, ptr %formatter.i68, i64 52
  store i32 0, ptr %20, align 4, !noalias !5973
  %21 = getelementptr inbounds i8, ptr %formatter.i68, i64 48
  store i32 32, ptr %21, align 8, !noalias !5973
  %22 = getelementptr inbounds i8, ptr %formatter.i68, i64 56
  store i8 3, ptr %22, align 8, !noalias !5973
  store i64 0, ptr %formatter.i68, align 8, !noalias !5973
  %23 = getelementptr inbounds i8, ptr %formatter.i68, i64 16
  store i64 0, ptr %23, align 8, !noalias !5973
  %24 = getelementptr inbounds i8, ptr %formatter.i68, i64 32
  store ptr %buf.i69, ptr %24, align 8, !noalias !5973
  %25 = getelementptr inbounds i8, ptr %formatter.i68, i64 40
  store ptr @vtable.4, ptr %25, align 8, !noalias !5973
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %26 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hbf6a90ed7cf777ebE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_b0b2a182f92294de465c6bd658b159d4, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i68) #28, !noalias !5977
  br i1 %26, label %bb3.i72, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit73"

bb3.i72:                                          ; preds = %bb9
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i113, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !5973
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit73": ; preds = %bb9
  %27 = getelementptr inbounds i8, ptr %_27, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %27, ptr noundef nonnull align 8 dereferenceable(24) %buf.i69, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i68), !noalias !5973
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i69), !noalias !5973
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i113)
  %28 = getelementptr inbounds i8, ptr %_27, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %28, ptr noundef nonnull align 8 dereferenceable(24) %_28, i64 24, i1 false)
  %29 = getelementptr inbounds i8, ptr %_27, i64 152
  store i32 6082, ptr %29, align 8
  store i64 0, ptr %_27, align 8
  %_31.sroa.4.0._27.sroa_idx = getelementptr inbounds i8, ptr %_27, i64 8
  store ptr @alloc_16d51f561de09534a0f1e393d54002ab, ptr %_31.sroa.4.0._27.sroa_idx, align 8
  %_31.sroa.4.sroa.4.0._31.sroa.4.0._27.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_27, i64 16
  store i64 30, ptr %_31.sroa.4.sroa.4.0._31.sroa.4.0._27.sroa_idx.sroa_idx, align 8
  %_31.sroa.4.sroa.5.0._31.sroa.4.0._27.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_27, i64 24
  store i32 716, ptr %_31.sroa.4.sroa.5.0._31.sroa.4.0._27.sroa_idx.sroa_idx, align 8
  %30 = getelementptr inbounds i8, ptr %_27, i64 80
  store i8 2, ptr %30, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_28)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %31 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_27) #28
  %_26.0 = extractvalue { i64, ptr } %31, 0
  %_26.1 = extractvalue { i64, ptr } %31, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_27)
  br label %bb99

bb15:                                             ; preds = %bb13
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %creator1, ptr noundef nonnull align 1 dereferenceable(32) %creator, i64 32, i1 false)
  br label %bb22

bb14:                                             ; preds = %bb13
  %32 = getelementptr inbounds i8, ptr %ctx, i64 8
  %_233 = load ptr, ptr %32, align 8, !nonnull !2, !align !3, !noundef !2
  %33 = getelementptr inbounds i8, ptr %_233, i64 248
  %_234 = load ptr, ptr %33, align 8, !nonnull !2, !align !3, !noundef !2
  %34 = getelementptr inbounds i8, ptr %_234, i64 1087
  %35 = load i8, ptr %34, align 1, !range !374, !noundef !2
  %_37.not = icmp eq i8 %35, 0
  br i1 %_37.not, label %bb16, label %bb20

bb22:                                             ; preds = %bb20, %bb15
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_55)
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_55, i8 0, i64 32, i1 false)
  %36 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %creator1, ptr noundef nonnull dereferenceable(32) %_55, i64 32)
  %37 = icmp eq i32 %36, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_55)
  br i1 %37, label %bb23, label %bb28

bb16:                                             ; preds = %bb14
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_39)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_40)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_40, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_f94f166953c814e4161e699857179a1e) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i113)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i76), !noalias !5978
  store i64 0, ptr %buf.i76, align 8, !noalias !5978
  %_9.sroa.4.0.buf.sroa_idx.i77 = getelementptr inbounds i8, ptr %buf.i76, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i77, align 8, !noalias !5978
  %_9.sroa.5.0.buf.sroa_idx.i78 = getelementptr inbounds i8, ptr %buf.i76, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i78, align 8, !noalias !5978
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i75), !noalias !5978
  %38 = getelementptr inbounds i8, ptr %formatter.i75, i64 52
  store i32 0, ptr %38, align 4, !noalias !5978
  %39 = getelementptr inbounds i8, ptr %formatter.i75, i64 48
  store i32 32, ptr %39, align 8, !noalias !5978
  %40 = getelementptr inbounds i8, ptr %formatter.i75, i64 56
  store i8 3, ptr %40, align 8, !noalias !5978
  store i64 0, ptr %formatter.i75, align 8, !noalias !5978
  %41 = getelementptr inbounds i8, ptr %formatter.i75, i64 16
  store i64 0, ptr %41, align 8, !noalias !5978
  %42 = getelementptr inbounds i8, ptr %formatter.i75, i64 32
  store ptr %buf.i76, ptr %42, align 8, !noalias !5978
  %43 = getelementptr inbounds i8, ptr %formatter.i75, i64 40
  store ptr @vtable.4, ptr %43, align 8, !noalias !5978
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %44 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hbf6a90ed7cf777ebE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_f94f166953c814e4161e699857179a1e, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i75) #28, !noalias !5982
  br i1 %44, label %bb3.i79, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit80"

bb3.i79:                                          ; preds = %bb16
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i113, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !5978
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit80": ; preds = %bb16
  %45 = getelementptr inbounds i8, ptr %_39, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %45, ptr noundef nonnull align 8 dereferenceable(24) %buf.i76, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i75), !noalias !5978
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i76), !noalias !5978
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i113)
  %46 = getelementptr inbounds i8, ptr %_39, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %46, ptr noundef nonnull align 8 dereferenceable(24) %_40, i64 24, i1 false)
  %47 = getelementptr inbounds i8, ptr %_39, i64 152
  store i32 6084, ptr %47, align 8
  store i64 0, ptr %_39, align 8
  %_43.sroa.4.0._39.sroa_idx = getelementptr inbounds i8, ptr %_39, i64 8
  store ptr @alloc_16d51f561de09534a0f1e393d54002ab, ptr %_43.sroa.4.0._39.sroa_idx, align 8
  %_43.sroa.4.sroa.4.0._43.sroa.4.0._39.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_39, i64 16
  store i64 30, ptr %_43.sroa.4.sroa.4.0._43.sroa.4.0._39.sroa_idx.sroa_idx, align 8
  %_43.sroa.4.sroa.5.0._43.sroa.4.0._39.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_39, i64 24
  store i32 719, ptr %_43.sroa.4.sroa.5.0._43.sroa.4.0._39.sroa_idx.sroa_idx, align 8
  %48 = getelementptr inbounds i8, ptr %_39, i64 80
  store i8 2, ptr %48, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_40)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %49 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_39) #28
  %_38.0 = extractvalue { i64, ptr } %49, 0
  %_38.1 = extractvalue { i64, ptr } %49, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_39)
  br label %bb99

bb20:                                             ; preds = %bb14
  call void @llvm.lifetime.start.p0(i64 33, ptr nonnull %_47)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_50)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_53)
  %50 = getelementptr inbounds i8, ptr %_233, i64 88
  %_300 = load ptr, ptr %50, align 8, !nonnull !2, !align !3, !noundef !2
  %_301 = load ptr, ptr %_300, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_53, ptr noundef nonnull align 1 dereferenceable(32) %_301, i64 32, i1 false)
  store ptr @alloc_df68464402562fbf659e5577c3ed192b, ptr %_50, align 8
  %51 = getelementptr inbounds i8, ptr %_50, i64 8
  store i64 14, ptr %51, align 8
  %52 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_50, i64 0, i64 1
  store ptr %_53, ptr %52, align 8
  %53 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_50, i64 0, i64 1, i32 1
  store i64 32, ptr %53, align 8
; call solana_pubkey::Pubkey::find_program_address
  call void @_ZN13solana_pubkey6Pubkey20find_program_address17h57945082f260e69dE(ptr noalias nocapture noundef nonnull sret([33 x i8]) align 1 dereferenceable(33) %_47, ptr noalias noundef nonnull readonly align 8 %_50, i64 noundef 2, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) @_ZN14pump_recovered2ID17h8e245cf89cf2c06bE) #28
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %creator1, ptr noundef nonnull align 1 dereferenceable(32) %_47, i64 32, i1 false)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_53)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_50)
  call void @llvm.lifetime.end.p0(i64 33, ptr nonnull %_47)
  br label %bb22

bb28:                                             ; preds = %bb22
  %54 = getelementptr inbounds i8, ptr %ctx, i64 8
  %_236 = load ptr, ptr %54, align 8, !nonnull !2, !align !3, !noundef !2
  %55 = getelementptr inbounds i8, ptr %_236, i64 248
  %_237 = load ptr, ptr %55, align 8, !nonnull !2, !align !3, !noundef !2
  %56 = getelementptr inbounds i8, ptr %_237, i64 1083
  %57 = load i8, ptr %56, align 1, !range !374, !noundef !2
  %_70.not = icmp eq i8 %57, 0
  br i1 %_70.not, label %bb29, label %bb34

bb23:                                             ; preds = %bb22
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_58)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_59)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_59, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_0e3505805f4905816c1bd644811a7869) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i113)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i83), !noalias !5983
  store i64 0, ptr %buf.i83, align 8, !noalias !5983
  %_9.sroa.4.0.buf.sroa_idx.i84 = getelementptr inbounds i8, ptr %buf.i83, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i84, align 8, !noalias !5983
  %_9.sroa.5.0.buf.sroa_idx.i85 = getelementptr inbounds i8, ptr %buf.i83, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i85, align 8, !noalias !5983
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i82), !noalias !5983
  %58 = getelementptr inbounds i8, ptr %formatter.i82, i64 52
  store i32 0, ptr %58, align 4, !noalias !5983
  %59 = getelementptr inbounds i8, ptr %formatter.i82, i64 48
  store i32 32, ptr %59, align 8, !noalias !5983
  %60 = getelementptr inbounds i8, ptr %formatter.i82, i64 56
  store i8 3, ptr %60, align 8, !noalias !5983
  store i64 0, ptr %formatter.i82, align 8, !noalias !5983
  %61 = getelementptr inbounds i8, ptr %formatter.i82, i64 16
  store i64 0, ptr %61, align 8, !noalias !5983
  %62 = getelementptr inbounds i8, ptr %formatter.i82, i64 32
  store ptr %buf.i83, ptr %62, align 8, !noalias !5983
  %63 = getelementptr inbounds i8, ptr %formatter.i82, i64 40
  store ptr @vtable.4, ptr %63, align 8, !noalias !5983
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %64 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hbf6a90ed7cf777ebE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_0e3505805f4905816c1bd644811a7869, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i82) #28, !noalias !5987
  br i1 %64, label %bb3.i86, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit87"

bb3.i86:                                          ; preds = %bb23
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i113, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !5983
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit87": ; preds = %bb23
  %65 = getelementptr inbounds i8, ptr %_58, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %65, ptr noundef nonnull align 8 dereferenceable(24) %buf.i83, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i82), !noalias !5983
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i83), !noalias !5983
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i113)
  %66 = getelementptr inbounds i8, ptr %_58, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %66, ptr noundef nonnull align 8 dereferenceable(24) %_59, i64 24, i1 false)
  %67 = getelementptr inbounds i8, ptr %_58, i64 152
  store i32 6030, ptr %67, align 8
  store i64 0, ptr %_58, align 8
  %_62.sroa.4.0._58.sroa_idx = getelementptr inbounds i8, ptr %_58, i64 8
  store ptr @alloc_16d51f561de09534a0f1e393d54002ab, ptr %_62.sroa.4.0._58.sroa_idx, align 8
  %_62.sroa.4.sroa.4.0._62.sroa.4.0._58.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_58, i64 16
  store i64 30, ptr %_62.sroa.4.sroa.4.0._62.sroa.4.0._58.sroa_idx.sroa_idx, align 8
  %_62.sroa.4.sroa.5.0._62.sroa.4.0._58.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_58, i64 24
  store i32 732, ptr %_62.sroa.4.sroa.5.0._62.sroa.4.0._58.sroa_idx.sroa_idx, align 8
  %68 = getelementptr inbounds i8, ptr %_58, i64 80
  store i8 2, ptr %68, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_59)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %69 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_58) #28
  %_57.0 = extractvalue { i64, ptr } %69, 0
  %_57.1 = extractvalue { i64, ptr } %69, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_58)
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %_66)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_66, ptr noundef nonnull align 1 dereferenceable(32) %creator1, i64 32, i1 false)
  %70 = getelementptr inbounds i8, ptr %_66, i64 32
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %70, i8 0, i64 32, i1 false)
; call anchor_lang::error::Error::with_pubkeys
  %71 = call { i64, ptr } @_ZN11anchor_lang5error5Error12with_pubkeys17hca6dbbbe6a9a5da7E(i64 noundef %_57.0, ptr noundef %_57.1, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(64) %_66) #28
  %_56.0 = extractvalue { i64, ptr } %71, 0
  %_56.1 = extractvalue { i64, ptr } %71, 1
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %_66)
  br label %bb99

bb34:                                             ; preds = %bb28
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_85.sroa.26)
  call void @llvm.experimental.noalias.scope.decl(metadata !5988)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %system.i)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %quote_info.i)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %authority.i)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %associated.i)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %payer.i)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_73.i.sroa.8)
  %72 = getelementptr inbounds i8, ptr %ctx, i64 16
  %remaining.0.i = load ptr, ptr %72, align 8, !alias.scope !5988, !noalias !5991, !nonnull !2, !align !3, !noundef !2
  %73 = getelementptr inbounds i8, ptr %ctx, i64 24
  %remaining.1.i = load i64, ptr %73, align 8, !alias.scope !5988, !noalias !5991, !noundef !2
  %74 = icmp eq i64 %remaining.1.i, 0
  br i1 %74, label %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread220, label %bb2.i

bb2.i:                                            ; preds = %bb34
  %_7.i = icmp ult i64 %remaining.1.i, 3
  br i1 %_7.i, label %bb3.i, label %bb10.i

bb3.i:                                            ; preds = %bb2.i
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_10.i), !noalias !5993
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_11.i), !noalias !5993
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_11.i, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_7abef1d9605f2433edf33d364558b41c) #28, !noalias !5993
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i113)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i90), !noalias !5994
  store i64 0, ptr %buf.i90, align 8, !noalias !5994
  %_9.sroa.4.0.buf.sroa_idx.i91 = getelementptr inbounds i8, ptr %buf.i90, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i91, align 8, !noalias !5994
  %_9.sroa.5.0.buf.sroa_idx.i92 = getelementptr inbounds i8, ptr %buf.i90, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i92, align 8, !noalias !5994
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i89), !noalias !5994
  %75 = getelementptr inbounds i8, ptr %formatter.i89, i64 52
  store i32 0, ptr %75, align 4, !noalias !5994
  %76 = getelementptr inbounds i8, ptr %formatter.i89, i64 48
  store i32 32, ptr %76, align 8, !noalias !5994
  %77 = getelementptr inbounds i8, ptr %formatter.i89, i64 56
  store i8 3, ptr %77, align 8, !noalias !5994
  store i64 0, ptr %formatter.i89, align 8, !noalias !5994
  %78 = getelementptr inbounds i8, ptr %formatter.i89, i64 16
  store i64 0, ptr %78, align 8, !noalias !5994
  %79 = getelementptr inbounds i8, ptr %formatter.i89, i64 32
  store ptr %buf.i90, ptr %79, align 8, !noalias !5994
  %80 = getelementptr inbounds i8, ptr %formatter.i89, i64 40
  store ptr @vtable.4, ptr %80, align 8, !noalias !5994
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %81 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hbf6a90ed7cf777ebE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_7abef1d9605f2433edf33d364558b41c, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i89) #28, !noalias !5998
  br i1 %81, label %bb3.i93, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit94"

bb3.i93:                                          ; preds = %bb3.i
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i113, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !5994
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit94": ; preds = %bb3.i
  %82 = getelementptr inbounds i8, ptr %_10.i, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %82, ptr noundef nonnull align 8 dereferenceable(24) %buf.i90, i64 24, i1 false), !noalias !5993
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i89), !noalias !5994
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i90), !noalias !5994
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i113)
  %83 = getelementptr inbounds i8, ptr %_10.i, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %83, ptr noundef nonnull align 8 dereferenceable(24) %_11.i, i64 24, i1 false), !noalias !5993
  %84 = getelementptr inbounds i8, ptr %_10.i, i64 152
  store i32 6027, ptr %84, align 8, !noalias !5993
  store i64 0, ptr %_10.i, align 8, !noalias !5993
  %_14.sroa.4.0._10.sroa_idx.i = getelementptr inbounds i8, ptr %_10.i, i64 8
  store ptr @alloc_16d51f561de09534a0f1e393d54002ab, ptr %_14.sroa.4.0._10.sroa_idx.i, align 8, !noalias !5993
  %_14.sroa.4.sroa.4.0._14.sroa.4.0._10.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_10.i, i64 16
  store i64 30, ptr %_14.sroa.4.sroa.4.0._14.sroa.4.0._10.sroa_idx.sroa_idx.i, align 8, !noalias !5993
  %_14.sroa.4.sroa.5.0._14.sroa.4.0._10.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_10.i, i64 24
  store i32 198, ptr %_14.sroa.4.sroa.5.0._14.sroa.4.0._10.sroa_idx.sroa_idx.i, align 8, !noalias !5993
  %85 = getelementptr inbounds i8, ptr %_10.i, i64 80
  store i8 2, ptr %85, align 8, !noalias !5993
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_11.i), !noalias !5993
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %86 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_10.i) #28, !noalias !5993
  %_9.0.i = extractvalue { i64, ptr } %86, 0
  %_9.1.i = extractvalue { i64, ptr } %86, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_10.i), !noalias !5993
  call void @llvm.lifetime.start.p0(i64 55, ptr nonnull %_14.sroa.4.i)
  call void @llvm.lifetime.start.p0(i64 55, ptr nonnull %_6.sroa.4.i97)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %values.i)
  store i64 %remaining.1.i, ptr %values.i, align 8
  %87 = getelementptr inbounds i8, ptr %values.i, i64 8
  store i32 3, ptr %87, align 8
  %switch.i98 = icmp eq i64 %_9.0.i, 0
  br i1 %switch.i98, label %bb3.i101, label %bb2.i99

bb3.i101:                                         ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit94"
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_7.i96)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_8.i95)
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i113)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i.i), !noalias !5999
  store i64 0, ptr %buf.i.i, align 8, !noalias !5999
  %_9.sroa.4.0.buf.sroa_idx.i.i = getelementptr inbounds i8, ptr %buf.i.i, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i.i, align 8, !noalias !5999
  %_9.sroa.5.0.buf.sroa_idx.i.i = getelementptr inbounds i8, ptr %buf.i.i, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i.i, align 8, !noalias !5999
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i.i), !noalias !5999
  %88 = getelementptr inbounds i8, ptr %formatter.i.i, i64 52
  store i32 0, ptr %88, align 4, !noalias !5999
  %89 = getelementptr inbounds i8, ptr %formatter.i.i, i64 48
  store i32 32, ptr %89, align 8, !noalias !5999
  %90 = getelementptr inbounds i8, ptr %formatter.i.i, i64 56
  store i8 3, ptr %90, align 8, !noalias !5999
  store i64 0, ptr %formatter.i.i, align 8, !noalias !5999
  %91 = getelementptr inbounds i8, ptr %formatter.i.i, i64 16
  store i64 0, ptr %91, align 8, !noalias !5999
  %92 = getelementptr inbounds i8, ptr %formatter.i.i, i64 32
  store ptr %buf.i.i, ptr %92, align 8, !noalias !5999
  %93 = getelementptr inbounds i8, ptr %formatter.i.i, i64 40
  store ptr @vtable.4, ptr %93, align 8, !noalias !5999
; call core::fmt::num::imp::<impl core::fmt::Display for usize>::fmt
  %94 = call noundef zeroext i1 @"_ZN4core3fmt3num3imp54_$LT$impl$u20$core..fmt..Display$u20$for$u20$usize$GT$3fmt17h1fc8323720f2b108E"(ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %values.i, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i.i) #28, !noalias !6003
  br i1 %94, label %bb3.i.i, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha4795fc28f2d466fE.exit.i"

bb3.i.i:                                          ; preds = %bb3.i101
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i113, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !6003
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha4795fc28f2d466fE.exit.i": ; preds = %bb3.i101
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_8.i95, ptr noundef nonnull align 8 dereferenceable(24) %buf.i.i, i64 24, i1 false), !noalias !6004
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i.i), !noalias !5999
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i.i), !noalias !5999
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i113)
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i113)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i4.i), !noalias !6005
  store i64 0, ptr %buf.i4.i, align 8, !noalias !6005
  %_9.sroa.4.0.buf.sroa_idx.i5.i = getelementptr inbounds i8, ptr %buf.i4.i, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i5.i, align 8, !noalias !6005
  %_9.sroa.5.0.buf.sroa_idx.i6.i = getelementptr inbounds i8, ptr %buf.i4.i, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i6.i, align 8, !noalias !6005
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i3.i), !noalias !6005
  %95 = getelementptr inbounds i8, ptr %formatter.i3.i, i64 52
  store i32 0, ptr %95, align 4, !noalias !6005
  %96 = getelementptr inbounds i8, ptr %formatter.i3.i, i64 48
  store i32 32, ptr %96, align 8, !noalias !6005
  %97 = getelementptr inbounds i8, ptr %formatter.i3.i, i64 56
  store i8 3, ptr %97, align 8, !noalias !6005
  store i64 0, ptr %formatter.i3.i, align 8, !noalias !6005
  %98 = getelementptr inbounds i8, ptr %formatter.i3.i, i64 16
  store i64 0, ptr %98, align 8, !noalias !6005
  %99 = getelementptr inbounds i8, ptr %formatter.i3.i, i64 32
  store ptr %buf.i4.i, ptr %99, align 8, !noalias !6005
  %100 = getelementptr inbounds i8, ptr %formatter.i3.i, i64 40
  store ptr @vtable.4, ptr %100, align 8, !noalias !6005
; call core::fmt::num::imp::<impl core::fmt::Display for i32>::fmt
  %101 = call noundef zeroext i1 @"_ZN4core3fmt3num3imp52_$LT$impl$u20$core..fmt..Display$u20$for$u20$i32$GT$3fmt17hb00e11d2392487b4E"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) %87, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i3.i) #28, !noalias !6009
  br i1 %101, label %bb3.i7.i, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha2f9e29ff0cf2ac6E.exit.i"

bb3.i7.i:                                         ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha4795fc28f2d466fE.exit.i"
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i113, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !6009
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha2f9e29ff0cf2ac6E.exit.i": ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha4795fc28f2d466fE.exit.i"
  %102 = getelementptr inbounds i8, ptr %_7.i96, i64 24
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %102, ptr noundef nonnull align 8 dereferenceable(24) %buf.i4.i, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i3.i), !noalias !6005
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i4.i), !noalias !6005
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i113)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_7.i96, ptr noundef nonnull align 8 dereferenceable(24) %_8.i95, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_8.i95)
  %_6.sroa.4.8.sroa_idx.i = getelementptr inbounds i8, ptr %_6.sroa.4.i97, i64 7
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(48) %_6.sroa.4.8.sroa_idx.i, ptr noundef nonnull align 8 dereferenceable(48) %_7.i96, i64 48, i1 false)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_7.i96)
  %103 = icmp ne ptr %_9.1.i, null
  call void @llvm.assume(i1 %103)
  %104 = getelementptr inbounds i8, ptr %_9.1.i, i64 80
  %105 = load i8, ptr %104, align 8, !range !15, !alias.scope !6010, !noundef !2
  %cond.i.i = icmp eq i8 %105, 0
  br i1 %cond.i.i, label %bb2.i.i.i, label %_ZN11anchor_lang5error5Error11with_values17hb378b4750878c680E.exit

bb2.i.i.i:                                        ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha2f9e29ff0cf2ac6E.exit.i"
  %106 = getelementptr inbounds i8, ptr %_9.1.i, i64 88
  %_1.val.i.i.i.i.i = load i64, ptr %106, align 8, !alias.scope !6013, !noundef !2
  %107 = icmp eq i64 %_1.val.i.i.i.i.i, 0
  br i1 %107, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i": ; preds = %bb2.i.i.i
  %108 = getelementptr inbounds i8, ptr %_9.1.i, i64 96
  %_1.val1.i.i.i.i.i = load ptr, ptr %108, align 8, !alias.scope !6013
  %109 = icmp ne ptr %_1.val1.i.i.i.i.i, null
  call void @llvm.assume(i1 %109)
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i.i"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i", %bb2.i.i.i
  %110 = getelementptr inbounds i8, ptr %_9.1.i, i64 112
  %_1.val.i1.i.i.i.i = load i64, ptr %110, align 8, !alias.scope !6020, !noundef !2
  %111 = icmp eq i64 %_1.val.i1.i.i.i.i, 0
  br i1 %111, label %_ZN11anchor_lang5error5Error11with_values17hb378b4750878c680E.exit, label %_ZN11anchor_lang5error5Error11with_values17hb378b4750878c680E.exit.sink.split

bb2.i99:                                          ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit94"
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_15.i)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_16.i)
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i113)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i10.i), !noalias !6023
  store i64 0, ptr %buf.i10.i, align 8, !noalias !6023
  %_9.sroa.4.0.buf.sroa_idx.i11.i = getelementptr inbounds i8, ptr %buf.i10.i, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i11.i, align 8, !noalias !6023
  %_9.sroa.5.0.buf.sroa_idx.i12.i = getelementptr inbounds i8, ptr %buf.i10.i, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i12.i, align 8, !noalias !6023
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i9.i), !noalias !6023
  %112 = getelementptr inbounds i8, ptr %formatter.i9.i, i64 52
  store i32 0, ptr %112, align 4, !noalias !6023
  %113 = getelementptr inbounds i8, ptr %formatter.i9.i, i64 48
  store i32 32, ptr %113, align 8, !noalias !6023
  %114 = getelementptr inbounds i8, ptr %formatter.i9.i, i64 56
  store i8 3, ptr %114, align 8, !noalias !6023
  store i64 0, ptr %formatter.i9.i, align 8, !noalias !6023
  %115 = getelementptr inbounds i8, ptr %formatter.i9.i, i64 16
  store i64 0, ptr %115, align 8, !noalias !6023
  %116 = getelementptr inbounds i8, ptr %formatter.i9.i, i64 32
  store ptr %buf.i10.i, ptr %116, align 8, !noalias !6023
  %117 = getelementptr inbounds i8, ptr %formatter.i9.i, i64 40
  store ptr @vtable.4, ptr %117, align 8, !noalias !6023
; call core::fmt::num::imp::<impl core::fmt::Display for usize>::fmt
  %118 = call noundef zeroext i1 @"_ZN4core3fmt3num3imp54_$LT$impl$u20$core..fmt..Display$u20$for$u20$usize$GT$3fmt17h1fc8323720f2b108E"(ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %values.i, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i9.i) #28, !noalias !6027
  br i1 %118, label %bb3.i13.i, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha4795fc28f2d466fE.exit14.i"

bb3.i13.i:                                        ; preds = %bb2.i99
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i113, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !6027
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha4795fc28f2d466fE.exit14.i": ; preds = %bb2.i99
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_16.i, ptr noundef nonnull align 8 dereferenceable(24) %buf.i10.i, i64 24, i1 false), !noalias !6028
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i9.i), !noalias !6023
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i10.i), !noalias !6023
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i113)
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i113)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i17.i), !noalias !6029
  store i64 0, ptr %buf.i17.i, align 8, !noalias !6029
  %_9.sroa.4.0.buf.sroa_idx.i18.i = getelementptr inbounds i8, ptr %buf.i17.i, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i18.i, align 8, !noalias !6029
  %_9.sroa.5.0.buf.sroa_idx.i19.i = getelementptr inbounds i8, ptr %buf.i17.i, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i19.i, align 8, !noalias !6029
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i16.i), !noalias !6029
  %119 = getelementptr inbounds i8, ptr %formatter.i16.i, i64 52
  store i32 0, ptr %119, align 4, !noalias !6029
  %120 = getelementptr inbounds i8, ptr %formatter.i16.i, i64 48
  store i32 32, ptr %120, align 8, !noalias !6029
  %121 = getelementptr inbounds i8, ptr %formatter.i16.i, i64 56
  store i8 3, ptr %121, align 8, !noalias !6029
  store i64 0, ptr %formatter.i16.i, align 8, !noalias !6029
  %122 = getelementptr inbounds i8, ptr %formatter.i16.i, i64 16
  store i64 0, ptr %122, align 8, !noalias !6029
  %123 = getelementptr inbounds i8, ptr %formatter.i16.i, i64 32
  store ptr %buf.i17.i, ptr %123, align 8, !noalias !6029
  %124 = getelementptr inbounds i8, ptr %formatter.i16.i, i64 40
  store ptr @vtable.4, ptr %124, align 8, !noalias !6029
; call core::fmt::num::imp::<impl core::fmt::Display for i32>::fmt
  %125 = call noundef zeroext i1 @"_ZN4core3fmt3num3imp52_$LT$impl$u20$core..fmt..Display$u20$for$u20$i32$GT$3fmt17hb00e11d2392487b4E"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) %87, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i16.i) #28, !noalias !6033
  br i1 %125, label %bb3.i20.i, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha2f9e29ff0cf2ac6E.exit21.i"

bb3.i20.i:                                        ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha4795fc28f2d466fE.exit14.i"
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i113, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !6033
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha2f9e29ff0cf2ac6E.exit21.i": ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha4795fc28f2d466fE.exit14.i"
  %126 = getelementptr inbounds i8, ptr %_15.i, i64 24
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %126, ptr noundef nonnull align 8 dereferenceable(24) %buf.i17.i, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i16.i), !noalias !6029
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i17.i), !noalias !6029
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i113)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_15.i, ptr noundef nonnull align 8 dereferenceable(24) %_16.i, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_16.i)
  %_14.sroa.4.8.sroa_idx.i = getelementptr inbounds i8, ptr %_14.sroa.4.i, i64 7
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(48) %_14.sroa.4.8.sroa_idx.i, ptr noundef nonnull align 8 dereferenceable(48) %_15.i, i64 48, i1 false)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_15.i)
  %127 = icmp ne ptr %_9.1.i, null
  call void @llvm.assume(i1 %127)
  %128 = getelementptr inbounds i8, ptr %_9.1.i, i64 56
  %129 = load i8, ptr %128, align 8, !range !15, !alias.scope !6034, !noundef !2
  %cond.i22.i = icmp eq i8 %129, 0
  br i1 %cond.i22.i, label %bb2.i.i23.i, label %_ZN11anchor_lang5error5Error11with_values17hb378b4750878c680E.exit

bb2.i.i23.i:                                      ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha2f9e29ff0cf2ac6E.exit21.i"
  %130 = getelementptr inbounds i8, ptr %_9.1.i, i64 64
  %_1.val.i.i.i.i24.i = load i64, ptr %130, align 8, !alias.scope !6037, !noundef !2
  %131 = icmp eq i64 %_1.val.i.i.i.i24.i, 0
  br i1 %131, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i27.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i25.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i25.i": ; preds = %bb2.i.i23.i
  %132 = getelementptr inbounds i8, ptr %_9.1.i, i64 72
  %_1.val1.i.i.i.i26.i = load ptr, ptr %132, align 8, !alias.scope !6037
  %133 = icmp ne ptr %_1.val1.i.i.i.i26.i, null
  call void @llvm.assume(i1 %133)
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i27.i"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i27.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i25.i", %bb2.i.i23.i
  %134 = getelementptr inbounds i8, ptr %_9.1.i, i64 88
  %_1.val.i1.i.i.i28.i = load i64, ptr %134, align 8, !alias.scope !6044, !noundef !2
  %135 = icmp eq i64 %_1.val.i1.i.i.i28.i, 0
  br i1 %135, label %_ZN11anchor_lang5error5Error11with_values17hb378b4750878c680E.exit, label %_ZN11anchor_lang5error5Error11with_values17hb378b4750878c680E.exit.sink.split

_ZN11anchor_lang5error5Error11with_values17hb378b4750878c680E.exit.sink.split: ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i27.i", %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i.i"
  %.sink268 = phi i64 [ 120, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i.i" ], [ 96, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i27.i" ]
  %.sink265.ph = phi ptr [ %104, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i.i" ], [ %128, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i27.i" ]
  %.sink.ph = phi i64 [ 81, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i.i" ], [ 57, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i27.i" ]
  %_6.sroa.4.i97.sink.ph = phi ptr [ %_6.sroa.4.i97, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i.i" ], [ %_14.sroa.4.i, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i27.i" ]
  %136 = getelementptr inbounds i8, ptr %_9.1.i, i64 %.sink268
  %_1.val1.i3.i.i.i30.i = load ptr, ptr %136, align 8
  %137 = icmp ne ptr %_1.val1.i3.i.i.i30.i, null
  call void @llvm.assume(i1 %137)
  br label %_ZN11anchor_lang5error5Error11with_values17hb378b4750878c680E.exit

_ZN11anchor_lang5error5Error11with_values17hb378b4750878c680E.exit: ; preds = %_ZN11anchor_lang5error5Error11with_values17hb378b4750878c680E.exit.sink.split, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha2f9e29ff0cf2ac6E.exit21.i", %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i27.i", %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha2f9e29ff0cf2ac6E.exit.i", %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i.i"
  %.sink265 = phi ptr [ %104, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i.i" ], [ %104, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha2f9e29ff0cf2ac6E.exit.i" ], [ %128, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i27.i" ], [ %128, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha2f9e29ff0cf2ac6E.exit21.i" ], [ %.sink265.ph, %_ZN11anchor_lang5error5Error11with_values17hb378b4750878c680E.exit.sink.split ]
  %.sink = phi i64 [ 81, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i.i" ], [ 81, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha2f9e29ff0cf2ac6E.exit.i" ], [ 57, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i27.i" ], [ 57, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha2f9e29ff0cf2ac6E.exit21.i" ], [ %.sink.ph, %_ZN11anchor_lang5error5Error11with_values17hb378b4750878c680E.exit.sink.split ]
  %_6.sroa.4.i97.sink = phi ptr [ %_6.sroa.4.i97, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i.i" ], [ %_6.sroa.4.i97, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha2f9e29ff0cf2ac6E.exit.i" ], [ %_14.sroa.4.i, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i.i.i27.i" ], [ %_14.sroa.4.i, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17ha2f9e29ff0cf2ac6E.exit21.i" ], [ %_6.sroa.4.i97.sink.ph, %_ZN11anchor_lang5error5Error11with_values17hb378b4750878c680E.exit.sink.split ]
  store i8 0, ptr %.sink265, align 8
  %_5.sroa.4.0..sroa_idx.i = getelementptr inbounds i8, ptr %_9.1.i, i64 %.sink
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(55) %_5.sroa.4.0..sroa_idx.i, ptr noundef nonnull align 1 dereferenceable(55) %_6.sroa.4.i97.sink, i64 55, i1 false)
  call void @llvm.lifetime.end.p0(i64 55, ptr nonnull %_14.sroa.4.i)
  call void @llvm.lifetime.end.p0(i64 55, ptr nonnull %_6.sroa.4.i97)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %values.i)
  br label %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread

bb10.i:                                           ; preds = %bb2.i
  %ata.i = getelementptr inbounds [0 x %"solana_account_info::AccountInfo<'_>"], ptr %remaining.0.i, i64 0, i64 1
  %program.i = getelementptr inbounds [0 x %"solana_account_info::AccountInfo<'_>"], ptr %remaining.0.i, i64 0, i64 2
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_26.i), !noalias !5993
  %_157.i = load ptr, ptr %program.i, align 8, !noalias !5993, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_26.i, ptr noundef nonnull align 1 dereferenceable(32) %_157.i, i64 32, i1 false), !noalias !5993
  %138 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_26.i, ptr noundef nonnull dereferenceable(32) @alloc_dbbec7e9ccaadddef423de02c4aee690, i64 32), !noalias !5993
  %139 = icmp eq i32 %138, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_26.i), !noalias !5993
  br i1 %139, label %bb19.i, label %bb13.i

bb13.i:                                           ; preds = %bb10.i
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_28.i), !noalias !5993
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_28.i, ptr noundef nonnull align 1 dereferenceable(32) %_157.i, i64 32, i1 false), !noalias !5993
  %140 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_28.i, ptr noundef nonnull dereferenceable(32) @alloc_01e997627eb226f7f1f6c343aba6a79b, i64 32), !noalias !5993
  %141 = icmp eq i32 %140, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_28.i), !noalias !5993
  br i1 %141, label %bb19.i, label %bb15.i

bb15.i:                                           ; preds = %bb13.i
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_30.i), !noalias !5993
  %142 = getelementptr inbounds i8, ptr %_30.i, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %142, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_b7f057a700061b96879a1cf049d1c13f) #28, !noalias !5993
  %143 = getelementptr inbounds i8, ptr %_30.i, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %143, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_b7f057a700061b96879a1cf049d1c13f) #28, !noalias !5993
  %144 = getelementptr inbounds i8, ptr %_30.i, i64 152
  store i32 6064, ptr %144, align 8, !noalias !5993
  store i64 0, ptr %_30.i, align 8, !noalias !5993
  %_34.sroa.4.0._30.sroa_idx.i = getelementptr inbounds i8, ptr %_30.i, i64 8
  store ptr @alloc_16d51f561de09534a0f1e393d54002ab, ptr %_34.sroa.4.0._30.sroa_idx.i, align 8, !noalias !5993
  %_34.sroa.4.sroa.4.0._34.sroa.4.0._30.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_30.i, i64 16
  store i64 30, ptr %_34.sroa.4.sroa.4.0._34.sroa.4.0._30.sroa_idx.sroa_idx.i, align 8, !noalias !5993
  %_34.sroa.4.sroa.5.0._34.sroa.4.0._30.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_30.i, i64 24
  store i32 205, ptr %_34.sroa.4.sroa.5.0._34.sroa.4.0._30.sroa_idx.sroa_idx.i, align 8, !noalias !5993
  %145 = getelementptr inbounds i8, ptr %_30.i, i64 80
  store i8 2, ptr %145, align 8, !noalias !5993
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %146 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_30.i) #28, !noalias !5993
  %_29.0.i = extractvalue { i64, ptr } %146, 0
  %_29.1.i = extractvalue { i64, ptr } %146, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_30.i), !noalias !5993
  br label %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread

bb19.i:                                           ; preds = %bb13.i, %bb10.i
  %147 = getelementptr inbounds [0 x %"solana_account_info::AccountInfo<'_>"], ptr %remaining.0.i, i64 0, i64 2, i32 7
  %148 = load i8, ptr %147, align 2, !range !374, !noalias !5993, !noundef !2
  %_38.not.i = icmp eq i8 %148, 0
  br i1 %_38.not.i, label %bb21.i, label %bb20.i

bb21.i:                                           ; preds = %bb19.i
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_40.i), !noalias !5993
  %149 = getelementptr inbounds i8, ptr %_40.i, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %149, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_b7f057a700061b96879a1cf049d1c13f) #28, !noalias !5993
  %150 = getelementptr inbounds i8, ptr %_40.i, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %150, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_b7f057a700061b96879a1cf049d1c13f) #28, !noalias !5993
  %151 = getelementptr inbounds i8, ptr %_40.i, i64 152
  store i32 6064, ptr %151, align 8, !noalias !5993
  store i64 0, ptr %_40.i, align 8, !noalias !5993
  %_44.sroa.4.0._40.sroa_idx.i = getelementptr inbounds i8, ptr %_40.i, i64 8
  store ptr @alloc_16d51f561de09534a0f1e393d54002ab, ptr %_44.sroa.4.0._40.sroa_idx.i, align 8, !noalias !5993
  %_44.sroa.4.sroa.4.0._44.sroa.4.0._40.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_40.i, i64 16
  store i64 30, ptr %_44.sroa.4.sroa.4.0._44.sroa.4.0._40.sroa_idx.sroa_idx.i, align 8, !noalias !5993
  %_44.sroa.4.sroa.5.0._44.sroa.4.0._40.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_40.i, i64 24
  store i32 210, ptr %_44.sroa.4.sroa.5.0._44.sroa.4.0._40.sroa_idx.sroa_idx.i, align 8, !noalias !5993
  %152 = getelementptr inbounds i8, ptr %_40.i, i64 80
  store i8 2, ptr %152, align 8, !noalias !5993
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %153 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_40.i) #28, !noalias !5993
  %_39.0.i = extractvalue { i64, ptr } %153, 0
  %_39.1.i = extractvalue { i64, ptr } %153, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_40.i), !noalias !5993
  br label %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread

bb20.i:                                           ; preds = %bb19.i
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_49.i), !noalias !5993
  %_162.i = load ptr, ptr %remaining.0.i, align 8, !noalias !5993, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_49.i, ptr noundef nonnull align 1 dereferenceable(32) %_162.i, i64 32, i1 false), !noalias !5993
  %154 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_49.i, ptr noundef nonnull dereferenceable(32) @alloc_e953c1d75e6a4349f2dca6892c168ab2, i64 32), !noalias !5993
  %155 = icmp eq i32 %154, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_49.i), !noalias !5993
  br i1 %155, label %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread220, label %bb26.i

bb26.i:                                           ; preds = %bb20.i
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_52.i), !noalias !5993
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_52.i, ptr noundef nonnull align 1 dereferenceable(32) %_162.i, i64 32, i1 false), !noalias !5993
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_53.i), !noalias !5993
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_53.i, i8 0, i64 32, i1 false), !noalias !5993
  %156 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_52.i, ptr noundef nonnull dereferenceable(32) %_53.i, i64 32), !noalias !5993
  %157 = icmp eq i32 %156, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_53.i), !noalias !5993
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_52.i), !noalias !5993
  br i1 %157, label %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread220, label %bb29.i

bb29.i:                                           ; preds = %bb26.i
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_58.i), !noalias !5993
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_58.i, ptr noundef nonnull align 1 dereferenceable(32) %_162.i, i64 32, i1 false), !noalias !5993
  %158 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_58.i, ptr noundef nonnull dereferenceable(32) @alloc_a3589b010e8c0a509a420d55bdd24119, i64 32), !noalias !5993
  %159 = icmp eq i32 %158, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_58.i), !noalias !5993
  br i1 %159, label %bb30.i, label %bb35.i

bb35.i:                                           ; preds = %bb29.i
  %_73.i.sroa.0.0.copyload208 = load i64, ptr %_162.i, align 1, !noalias !5993
  %_73.i.sroa.7.0._162.i.sroa_idx = getelementptr inbounds i8, ptr %_162.i, i64 8
  %_73.i.sroa.7.0.copyload211 = load ptr, ptr %_73.i.sroa.7.0._162.i.sroa_idx, align 1, !noalias !5993
  %_73.i.sroa.8.0._162.i.sroa_idx = getelementptr inbounds i8, ptr %_162.i, i64 16
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(16) %_73.i.sroa.8, ptr noundef nonnull align 1 dereferenceable(16) %_73.i.sroa.8.0._162.i.sroa_idx, i64 16, i1 false), !noalias !5993
  %_74.i = getelementptr inbounds i8, ptr %_237, i64 8
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %0), !noalias !5993
  store i64 %_73.i.sroa.0.0.copyload208, ptr %0, align 8, !noalias !5993
  %_73.i.sroa.7.0..sroa_idx = getelementptr inbounds i8, ptr %0, i64 8
  store ptr %_73.i.sroa.7.0.copyload211, ptr %_73.i.sroa.7.0..sroa_idx, align 8, !noalias !5993
  %_73.i.sroa.8.0..sroa_idx = getelementptr inbounds i8, ptr %0, i64 16
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(16) %_73.i.sroa.8.0..sroa_idx, ptr noundef nonnull align 1 dereferenceable(16) %_73.i.sroa.8.0._162.i.sroa_idx, i64 16, i1 false)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_5.i.i), !noalias !6047
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_5.i.i, i8 0, i64 32, i1 false), !noalias !6047
  %160 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %0, ptr noundef nonnull dereferenceable(32) %_5.i.i, i64 32), !noalias !6053
  %161 = icmp eq i32 %160, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_5.i.i), !noalias !6047
  br i1 %161, label %bb83.i, label %bb2.i.i

bb2.i.i:                                          ; preds = %bb35.i
  %162 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %0, ptr noundef nonnull dereferenceable(32) @alloc_e953c1d75e6a4349f2dca6892c168ab2, i64 32), !noalias !6053
  %163 = icmp eq i32 %162, 0
  br i1 %163, label %bb83.i, label %bb1.i.i.preheader

bb1.i.i.preheader:                                ; preds = %bb2.i.i
  %_13.i.i2.i.i.ptr = getelementptr inbounds i8, ptr %_237, i64 936
  %164 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_13.i.i2.i.i.ptr, ptr noundef nonnull dereferenceable(32) %0, i64 32), !alias.scope !6054, !noalias !6061
  %165 = icmp eq i32 %164, 0
  br i1 %165, label %bb83.i, label %bb7.i.i

bb7.i.i:                                          ; preds = %bb1.i.i.preheader
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_14.i.i), !noalias !6047
  %_3.i.not = icmp eq i64 %remaining.1.i, 3
  %_6.i = getelementptr inbounds %"solana_account_info::AccountInfo<'_>", ptr %remaining.0.i, i64 3
  %_0.sroa.0.0.i104 = select i1 %_3.i.not, ptr null, ptr %_6.i
; call pump_recovered::create_v2::nested_create::quote_control
  call fastcc void @_ZN14pump_recovered9create_v213nested_create13quote_control17h8622f7a6ba4058dfE(ptr noalias nocapture noundef nonnull align 8 dereferenceable(16) %_14.i.i, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_0.sroa.0.0.i104) #28, !noalias !6064
  %166 = load i64, ptr %_14.i.i, align 8, !range !318, !noalias !6047, !noundef !2
  %167 = icmp eq i64 %166, 2
  %168 = getelementptr inbounds i8, ptr %_14.i.i, i64 8
  %_36.i.i = load ptr, ptr %168, align 8, !noalias !6047, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_14.i.i), !noalias !6047
  br i1 %167, label %bb23.i.i, label %_ZN14pump_recovered9create_v219create_quote_config17hae803ecc2c3593d1E.exit.i

bb23.i.i:                                         ; preds = %bb7.i.i
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_19.i.i), !noalias !6047
; call pump_recovered::create_v2::nested_create::control_account
  call fastcc void @_ZN14pump_recovered9create_v213nested_create15control_account17h09c8b111c6081ad2E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %_19.i.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_36.i.i, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %0) #28, !noalias !6064
  %_40.i.i = load i64, ptr %_19.i.i, align 8, !range !389, !noalias !6047, !noundef !2
  %trunc.i.i.not = icmp eq i64 %_40.i.i, 0
  %169 = getelementptr inbounds i8, ptr %_19.i.i, i64 8
  %_41.0.i.i = load i64, ptr %169, align 8, !range !389, !noalias !6047, !noundef !2
  %170 = getelementptr inbounds i8, ptr %_19.i.i, i64 16
  br i1 %trunc.i.i.not, label %bb25.i.i, label %bb24.i.i

bb25.i.i:                                         ; preds = %bb23.i.i
  %_41.1.i.i = load i64, ptr %170, align 8, !noalias !6047
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_19.i.i), !noalias !6047
  %trunc9.i.i.not.not = icmp eq i64 %_41.0.i.i, 0
  br i1 %trunc9.i.i.not.not, label %bb11.i.i, label %bb83.i

bb24.i.i:                                         ; preds = %bb23.i.i
  %_42.1.i.i = load ptr, ptr %170, align 8, !noalias !6047, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_19.i.i), !noalias !6047
  br label %_ZN14pump_recovered9create_v219create_quote_config17hae803ecc2c3593d1E.exit.i

bb11.i.i:                                         ; preds = %bb25.i.i
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_27.i.i), !noalias !6047
; call pump_recovered::create_v2::nested_create::walk
  call fastcc void @_ZN14pump_recovered9create_v213nested_create4walk17h7c671763e7dea158E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %_27.i.i, ptr noalias noundef nonnull readonly align 8 %remaining.0.i, i64 noundef %remaining.1.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(1080) %_74.i) #28, !noalias !6064
  %_45.i.i = load i64, ptr %_27.i.i, align 8, !range !389, !noalias !6047, !noundef !2
  %trunc10.i.i.not = icmp eq i64 %_45.i.i, 0
  %171 = getelementptr inbounds i8, ptr %_27.i.i, i64 8
  %_46.0.i.i = load i64, ptr %171, align 8, !noalias !6047, !noundef !2
  %172 = getelementptr inbounds i8, ptr %_27.i.i, i64 16
  br i1 %trunc10.i.i.not, label %bb27.i.i, label %bb26.i.i

bb27.i.i:                                         ; preds = %bb11.i.i
  %_46.1.i.i = load i8, ptr %172, align 8, !noalias !6047, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_27.i.i), !noalias !6047
  br label %bb83.i

bb26.i.i:                                         ; preds = %bb11.i.i
  %_47.1.i.i = load ptr, ptr %172, align 8, !noalias !6047, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_27.i.i), !noalias !6047
  br label %_ZN14pump_recovered9create_v219create_quote_config17hae803ecc2c3593d1E.exit.i

_ZN14pump_recovered9create_v219create_quote_config17hae803ecc2c3593d1E.exit.i: ; preds = %bb7.i.i, %bb24.i.i, %bb26.i.i
  %_42.1.i.i.sink = phi ptr [ %_42.1.i.i, %bb24.i.i ], [ %_47.1.i.i, %bb26.i.i ], [ %_36.i.i, %bb7.i.i ]
  %_72.i.sroa.8.sroa.0.1 = phi i64 [ %_41.0.i.i, %bb24.i.i ], [ %_46.0.i.i, %bb26.i.i ], [ %166, %bb7.i.i ]
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %0), !noalias !5993
  br label %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread

bb30.i:                                           ; preds = %bb29.i
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_61.i), !noalias !5993
  %173 = getelementptr inbounds i8, ptr %_61.i, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %173, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_472c5e093ab64810a72f5ef4158854b7) #28, !noalias !5993
  %174 = getelementptr inbounds i8, ptr %_61.i, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %174, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_472c5e093ab64810a72f5ef4158854b7) #28, !noalias !5993
  %175 = getelementptr inbounds i8, ptr %_61.i, i64 152
  store i32 6063, ptr %175, align 8, !noalias !5993
  store i64 0, ptr %_61.i, align 8, !noalias !5993
  %_65.sroa.4.0._61.sroa_idx.i = getelementptr inbounds i8, ptr %_61.i, i64 8
  store ptr @alloc_16d51f561de09534a0f1e393d54002ab, ptr %_65.sroa.4.0._61.sroa_idx.i, align 8, !noalias !5993
  %_65.sroa.4.sroa.4.0._65.sroa.4.0._61.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_61.i, i64 16
  store i64 30, ptr %_65.sroa.4.sroa.4.0._65.sroa.4.0._61.sroa_idx.sroa_idx.i, align 8, !noalias !5993
  %_65.sroa.4.sroa.5.0._65.sroa.4.0._61.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_61.i, i64 24
  store i32 220, ptr %_65.sroa.4.sroa.5.0._65.sroa.4.0._61.sroa_idx.sroa_idx.i, align 8, !noalias !5993
  %176 = getelementptr inbounds i8, ptr %_61.i, i64 80
  store i8 2, ptr %176, align 8, !noalias !5993
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %177 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_61.i) #28, !noalias !5993
  %_60.0.i = extractvalue { i64, ptr } %177, 0
  %_60.1.i = extractvalue { i64, ptr } %177, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_61.i), !noalias !5993
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %_69.i), !noalias !5993
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_69.i, ptr noundef nonnull align 1 dereferenceable(32) %_162.i, i64 32, i1 false), !noalias !5993
  %178 = getelementptr inbounds i8, ptr %_69.i, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %178, ptr noundef nonnull align 1 dereferenceable(32) @alloc_a3589b010e8c0a509a420d55bdd24119, i64 32, i1 false), !noalias !5993
; call anchor_lang::error::Error::with_pubkeys
  %179 = call { i64, ptr } @_ZN11anchor_lang5error5Error12with_pubkeys17hca6dbbbe6a9a5da7E(i64 noundef %_60.0.i, ptr noundef %_60.1.i, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(64) %_69.i) #28
  %_59.0.i = extractvalue { i64, ptr } %179, 0
  %_59.1.i = extractvalue { i64, ptr } %179, 1
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %_69.i), !noalias !5993
  br label %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread

bb83.i:                                           ; preds = %bb27.i.i, %bb25.i.i, %bb2.i.i, %bb35.i, %bb1.i.i.preheader
  %_72.i.sroa.19.1.ph = phi i64 [ undef, %bb1.i.i.preheader ], [ undef, %bb35.i ], [ undef, %bb2.i.i ], [ %_41.1.i.i, %bb25.i.i ], [ %_46.0.i.i, %bb27.i.i ]
  %_72.i.sroa.8.sroa.0.1.ph = phi i8 [ 1, %bb1.i.i.preheader ], [ 1, %bb35.i ], [ 1, %bb2.i.i ], [ 2, %bb25.i.i ], [ 3, %bb27.i.i ]
  %_72.i.sroa.8.sroa.9.1.ph = phi i8 [ undef, %bb1.i.i.preheader ], [ undef, %bb35.i ], [ undef, %bb2.i.i ], [ undef, %bb25.i.i ], [ %_46.1.i.i, %bb27.i.i ]
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %0), !noalias !5993
  %180 = getelementptr inbounds i8, ptr %remaining.0.i, i64 24
  %_147.i = load ptr, ptr %180, align 8, !noalias !5993, !nonnull !2, !align !372, !noundef !2
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_78.i), !noalias !5993
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_78.i, ptr noundef nonnull align 1 dereferenceable(32) %_157.i, i64 32, i1 false), !noalias !5993
  %181 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_147.i, ptr noundef nonnull dereferenceable(32) %_78.i, i64 32), !noalias !5993
  %.not.i = icmp eq i32 %181, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_78.i), !noalias !5993
  br i1 %.not.i, label %bb43.i, label %bb38.i

bb43.i:                                           ; preds = %bb83.i
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_93.i), !noalias !5993
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_93.i, ptr noundef nonnull align 1 dereferenceable(32) %_157.i, i64 32, i1 false), !noalias !5993
  %182 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_93.i, ptr noundef nonnull dereferenceable(32) @alloc_01e997627eb226f7f1f6c343aba6a79b, i64 32), !noalias !5993
  %183 = icmp eq i32 %182, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_93.i), !noalias !5993
  br i1 %183, label %bb44.i, label %bb49.i

bb38.i:                                           ; preds = %bb83.i
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_81.i), !noalias !5993
  %184 = getelementptr inbounds i8, ptr %_81.i, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %184, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_472c5e093ab64810a72f5ef4158854b7) #28, !noalias !5993
  %185 = getelementptr inbounds i8, ptr %_81.i, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %185, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_472c5e093ab64810a72f5ef4158854b7) #28, !noalias !5993
  %186 = getelementptr inbounds i8, ptr %_81.i, i64 152
  store i32 6063, ptr %186, align 8, !noalias !5993
  store i64 0, ptr %_81.i, align 8, !noalias !5993
  %_85.sroa.4.0._81.sroa_idx.i = getelementptr inbounds i8, ptr %_81.i, i64 8
  store ptr @alloc_16d51f561de09534a0f1e393d54002ab, ptr %_85.sroa.4.0._81.sroa_idx.i, align 8, !noalias !5993
  %_85.sroa.4.sroa.4.0._85.sroa.4.0._81.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_81.i, i64 16
  store i64 30, ptr %_85.sroa.4.sroa.4.0._85.sroa.4.0._81.sroa_idx.sroa_idx.i, align 8, !noalias !5993
  %_85.sroa.4.sroa.5.0._85.sroa.4.0._81.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_81.i, i64 24
  store i32 243, ptr %_85.sroa.4.sroa.5.0._85.sroa.4.0._81.sroa_idx.sroa_idx.i, align 8, !noalias !5993
  %187 = getelementptr inbounds i8, ptr %_81.i, i64 80
  store i8 2, ptr %187, align 8, !noalias !5993
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %188 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_81.i) #28, !noalias !5993
  %_80.0.i = extractvalue { i64, ptr } %188, 0
  %_80.1.i = extractvalue { i64, ptr } %188, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_81.i), !noalias !5993
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %_89.i), !noalias !5993
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_89.i, ptr noundef nonnull align 1 dereferenceable(32) %_147.i, i64 32, i1 false), !noalias !5993
  %189 = getelementptr inbounds i8, ptr %_89.i, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %189, ptr noundef nonnull align 1 dereferenceable(32) %_157.i, i64 32, i1 false), !noalias !5993
; call anchor_lang::error::Error::with_pubkeys
  %190 = call { i64, ptr } @_ZN11anchor_lang5error5Error12with_pubkeys17hca6dbbbe6a9a5da7E(i64 noundef %_80.0.i, ptr noundef %_80.1.i, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(64) %_89.i) #28
  %_79.0.i = extractvalue { i64, ptr } %190, 0
  %_79.1.i = extractvalue { i64, ptr } %190, 1
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %_89.i), !noalias !5993
  br label %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread

bb44.i:                                           ; preds = %bb43.i
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_95.i), !noalias !5993
  store i64 %_73.i.sroa.0.0.copyload208, ptr %_95.i, align 8, !noalias !5993
  %_73.i.sroa.7.0._95.i.sroa_idx = getelementptr inbounds i8, ptr %_95.i, i64 8
  store ptr %_73.i.sroa.7.0.copyload211, ptr %_73.i.sroa.7.0._95.i.sroa_idx, align 8, !noalias !5993
  %_73.i.sroa.8.0._95.i.sroa_idx = getelementptr inbounds i8, ptr %_95.i, i64 16
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(16) %_73.i.sroa.8.0._95.i.sroa_idx, ptr noundef nonnull align 1 dereferenceable(16) %_73.i.sroa.8, i64 16, i1 false), !noalias !5993
  %191 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_95.i, ptr noundef nonnull dereferenceable(32) @alloc_d8c0a5dba5e722d6ee3b9565370a7c8b, i64 32), !noalias !5993
  %.not16.i = icmp eq i32 %191, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_95.i), !noalias !5993
  br i1 %.not16.i, label %bb49.i, label %bb45.i

bb49.i:                                           ; preds = %bb45.i, %bb44.i, %bb43.i
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %expected.i), !noalias !5993
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_101.i), !noalias !5993
  %192 = getelementptr inbounds i8, ptr %_236, i64 232
  %_148.i = load ptr, ptr %192, align 8, !noalias !5993, !nonnull !2, !align !3, !noundef !2
  %_188.i = load ptr, ptr %_148.i, align 8, !noalias !5993, !nonnull !2, !align !3, !noundef !2
  %_189.i = load ptr, ptr %_188.i, align 8, !noalias !5993, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_101.i, ptr noundef nonnull align 1 dereferenceable(32) %_189.i, i64 32, i1 false), !noalias !5993
; call spl_associated_token_account_client::address::get_associated_token_address_with_program_id
  call void @_ZN35spl_associated_token_account_client7address44get_associated_token_address_with_program_id17ha02765ea535ac9e1E(ptr noalias nocapture noundef nonnull sret([32 x i8]) align 1 dereferenceable(32) %expected.i, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %_101.i, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %_162.i, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %_157.i) #28, !noalias !5993
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_101.i), !noalias !5993
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_103.i), !noalias !5993
  %_190.i = load ptr, ptr %ata.i, align 8, !noalias !5993, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_103.i, ptr noundef nonnull align 1 dereferenceable(32) %_190.i, i64 32, i1 false), !noalias !5993
  %193 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_103.i, ptr noundef nonnull dereferenceable(32) %expected.i, i64 32), !noalias !5993
  %.not17.i = icmp eq i32 %193, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_103.i), !noalias !5993
  br i1 %.not17.i, label %bb56.i, label %bb51.i

bb45.i:                                           ; preds = %bb44.i
; call pump_recovered::create_v2::check_quote_mint_extensions
  %194 = call fastcc { i64, ptr } @_ZN14pump_recovered9create_v227check_quote_mint_extensions17h1ab172e47c78d550E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %remaining.0.i) #28, !noalias !5993
  %195 = extractvalue { i64, ptr } %194, 0
  %196 = icmp eq i64 %195, 2
  br i1 %196, label %bb49.i, label %bb88.i

bb88.i:                                           ; preds = %bb45.i
  %197 = extractvalue { i64, ptr } %194, 1
  br label %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread

bb56.i:                                           ; preds = %bb49.i
  call void @llvm.lifetime.start.p0(i64 80, ptr nonnull %ix.i), !noalias !5993
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_119.i), !noalias !5993
  %198 = getelementptr inbounds i8, ptr %_236, i64 256
  %_194.i = load ptr, ptr %198, align 8, !noalias !5993, !nonnull !2, !align !3, !noundef !2
  %_195.i = load ptr, ptr %_194.i, align 8, !noalias !5993, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_119.i, ptr noundef nonnull align 1 dereferenceable(32) %_195.i, i64 32, i1 false), !noalias !5993
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_121.i), !noalias !5993
  %_149.i = load ptr, ptr %192, align 8, !noalias !5993, !nonnull !2, !align !3, !noundef !2
  %_196.i = load ptr, ptr %_149.i, align 8, !noalias !5993, !nonnull !2, !align !3, !noundef !2
  %_197.i = load ptr, ptr %_196.i, align 8, !noalias !5993, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_121.i, ptr noundef nonnull align 1 dereferenceable(32) %_197.i, i64 32, i1 false), !noalias !5993
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_123.i), !noalias !5993
  store i64 %_73.i.sroa.0.0.copyload208, ptr %_123.i, align 8, !noalias !5993
  %_73.i.sroa.7.0._123.i.sroa_idx = getelementptr inbounds i8, ptr %_123.i, i64 8
  store ptr %_73.i.sroa.7.0.copyload211, ptr %_73.i.sroa.7.0._123.i.sroa_idx, align 8, !noalias !5993
  %_73.i.sroa.8.0._123.i.sroa_idx = getelementptr inbounds i8, ptr %_123.i, i64 16
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(16) %_73.i.sroa.8.0._123.i.sroa_idx, ptr noundef nonnull align 1 dereferenceable(16) %_73.i.sroa.8, i64 16, i1 false), !noalias !5993
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_125.i), !noalias !5993
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_125.i, ptr noundef nonnull align 1 dereferenceable(32) %_157.i, i64 32, i1 false), !noalias !5993
; call spl_associated_token_account_client::instruction::create_associated_token_account
  call void @_ZN35spl_associated_token_account_client11instruction31create_associated_token_account17h709fed41ceb95c3bE(ptr noalias nocapture noundef nonnull sret([80 x i8]) align 8 dereferenceable(80) %ix.i, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %_119.i, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %_121.i, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %_123.i, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %_125.i) #28, !noalias !5993
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_125.i), !noalias !5993
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_123.i), !noalias !5993
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_121.i), !noalias !5993
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_119.i), !noalias !5993
  %_198.i = load ptr, ptr %198, align 8, !noalias !5993, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %payer.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_198.i) #28, !noalias !5993
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %associated.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %ata.i) #28, !noalias !5993
  %_150.i = load ptr, ptr %192, align 8, !noalias !5993, !nonnull !2, !align !3, !noundef !2
  %_199.i = load ptr, ptr %_150.i, align 8, !noalias !5993, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %authority.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_199.i) #28, !noalias !5993
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %quote_info.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %remaining.0.i) #28, !noalias !5993
  %199 = getelementptr inbounds i8, ptr %_236, i64 264
  %_200.i = load ptr, ptr %199, align 8, !noalias !5993, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %system.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_200.i) #28, !noalias !5993
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_132.i), !noalias !5993
  call void @llvm.lifetime.start.p0(i64 288, ptr nonnull %_136.i), !noalias !5993
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_137.i), !noalias !5993
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_137.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %program.i) #28, !noalias !5993
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %_136.i, ptr noundef nonnull align 8 dereferenceable(48) %payer.i, i64 48, i1 false), !noalias !5993
  %200 = getelementptr inbounds [6 x %"solana_account_info::AccountInfo<'_>"], ptr %_136.i, i64 0, i64 1
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %200, ptr noundef nonnull align 8 dereferenceable(48) %associated.i, i64 48, i1 false), !noalias !5993
  %201 = getelementptr inbounds [6 x %"solana_account_info::AccountInfo<'_>"], ptr %_136.i, i64 0, i64 2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %201, ptr noundef nonnull align 8 dereferenceable(48) %authority.i, i64 48, i1 false), !noalias !5993
  %202 = getelementptr inbounds [6 x %"solana_account_info::AccountInfo<'_>"], ptr %_136.i, i64 0, i64 3
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %202, ptr noundef nonnull align 8 dereferenceable(48) %quote_info.i, i64 48, i1 false), !noalias !5993
  %203 = getelementptr inbounds [6 x %"solana_account_info::AccountInfo<'_>"], ptr %_136.i, i64 0, i64 4
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %203, ptr noundef nonnull align 8 dereferenceable(48) %system.i, i64 48, i1 false), !noalias !5993
  %204 = getelementptr inbounds [6 x %"solana_account_info::AccountInfo<'_>"], ptr %_136.i, i64 0, i64 5
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %204, ptr noundef nonnull align 8 dereferenceable(48) %_137.i, i64 48, i1 false), !noalias !5993
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_137.i), !noalias !5993
; call solana_program::program::invoke
  call void @_ZN14solana_program7program6invoke17haf08bc5ab5ce16cdE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_132.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(80) %ix.i, ptr noalias noundef nonnull readonly align 8 %_136.i, i64 noundef 6) #28, !noalias !5993
  %205 = load i64, ptr %_132.i, align 8, !range !366, !noalias !5993, !noundef !2
  %206 = icmp eq i64 %205, -9223372036854775782
  br i1 %206, label %bb96.i, label %bb95.i

bb51.i:                                           ; preds = %bb49.i
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_106.i), !noalias !5993
  %207 = getelementptr inbounds i8, ptr %_106.i, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %207, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_3978b63fb96cd488af3e7f8e0944e743) #28, !noalias !5993
  %208 = getelementptr inbounds i8, ptr %_106.i, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %208, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_3978b63fb96cd488af3e7f8e0944e743) #28, !noalias !5993
  %209 = getelementptr inbounds i8, ptr %_106.i, i64 152
  store i32 6065, ptr %209, align 8, !noalias !5993
  store i64 0, ptr %_106.i, align 8, !noalias !5993
  %_110.sroa.4.0._106.sroa_idx.i = getelementptr inbounds i8, ptr %_106.i, i64 8
  store ptr @alloc_16d51f561de09534a0f1e393d54002ab, ptr %_110.sroa.4.0._106.sroa_idx.i, align 8, !noalias !5993
  %_110.sroa.4.sroa.4.0._110.sroa.4.0._106.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_106.i, i64 16
  store i64 30, ptr %_110.sroa.4.sroa.4.0._110.sroa.4.0._106.sroa_idx.sroa_idx.i, align 8, !noalias !5993
  %_110.sroa.4.sroa.5.0._110.sroa.4.0._106.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_106.i, i64 24
  store i32 258, ptr %_110.sroa.4.sroa.5.0._110.sroa.4.0._106.sroa_idx.sroa_idx.i, align 8, !noalias !5993
  %210 = getelementptr inbounds i8, ptr %_106.i, i64 80
  store i8 2, ptr %210, align 8, !noalias !5993
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %211 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_106.i) #28, !noalias !5993
  %_105.0.i = extractvalue { i64, ptr } %211, 0
  %_105.1.i = extractvalue { i64, ptr } %211, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_106.i), !noalias !5993
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %_114.i), !noalias !5993
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_114.i, ptr noundef nonnull align 1 dereferenceable(32) %_190.i, i64 32, i1 false), !noalias !5993
  %212 = getelementptr inbounds i8, ptr %_114.i, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %212, ptr noundef nonnull align 1 dereferenceable(32) %expected.i, i64 32, i1 false), !noalias !5993
; call anchor_lang::error::Error::with_pubkeys
  %213 = call { i64, ptr } @_ZN11anchor_lang5error5Error12with_pubkeys17hca6dbbbe6a9a5da7E(i64 noundef %_105.0.i, ptr noundef %_105.1.i, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(64) %_114.i) #28
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %_114.i), !noalias !5993
  br label %bb66.i

bb96.i:                                           ; preds = %bb56.i
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_132.i), !noalias !5993
; call core::ptr::drop_in_place<[solana_account_info::AccountInfo; 6]>
  call fastcc void @"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$6$u5d$$GT$17he3c1ee89ec1c3077E"(ptr noalias noundef nonnull align 8 dereferenceable(288) %_136.i) #28, !noalias !5993
  call void @llvm.lifetime.end.p0(i64 288, ptr nonnull %_136.i), !noalias !5993
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(16) %_85.sroa.26, ptr noundef nonnull align 1 dereferenceable(16) %_73.i.sroa.8, i64 16, i1 false), !noalias !5988
  %_1.val.i = load i64, ptr %ix.i, align 8, !alias.scope !6065, !noalias !5993, !noundef !2
  %214 = icmp eq i64 %_1.val.i, 0
  br i1 %214, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i", label %bb2.i.i.i.i

bb2.i.i.i.i:                                      ; preds = %bb96.i
  %215 = getelementptr inbounds i8, ptr %ix.i, i64 8
  %_1.val2.i = load ptr, ptr %215, align 8, !alias.scope !6065, !noalias !5993
  %216 = icmp ne ptr %_1.val2.i, null
  call void @llvm.assume(i1 %216), !noalias !5993
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i": ; preds = %bb2.i.i.i.i, %bb96.i
  %217 = getelementptr inbounds i8, ptr %ix.i, i64 24
  %.val.i = load i64, ptr %217, align 8, !alias.scope !6065, !noalias !5993, !noundef !2
  %218 = icmp eq i64 %.val.i, 0
  br i1 %218, label %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit, label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i"
  %219 = getelementptr inbounds i8, ptr %ix.i, i64 32
  %.val1.i = load ptr, ptr %219, align 8, !alias.scope !6065, !noalias !5993
  %220 = icmp ne ptr %.val1.i, null
  call void @llvm.assume(i1 %220), !noalias !5993
  br label %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit

bb95.i:                                           ; preds = %bb56.i
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_204.i), !noalias !5993
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_204.i, ptr noundef nonnull align 8 dereferenceable(24) %_132.i, i64 24, i1 false), !noalias !5993
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_132.i), !noalias !5993
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %221 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17ha4865197be4b9a2fE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_204.i) #28, !noalias !5993
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_204.i), !noalias !5993
; call core::ptr::drop_in_place<[solana_account_info::AccountInfo; 6]>
  call fastcc void @"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$6$u5d$$GT$17he3c1ee89ec1c3077E"(ptr noalias noundef nonnull align 8 dereferenceable(288) %_136.i) #28, !noalias !5993
  call void @llvm.lifetime.end.p0(i64 288, ptr nonnull %_136.i), !noalias !5993
  %_1.val.i105 = load i64, ptr %ix.i, align 8, !alias.scope !6068, !noalias !5993, !noundef !2
  %222 = icmp eq i64 %_1.val.i105, 0
  br i1 %222, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i108", label %bb2.i.i.i.i106

bb2.i.i.i.i106:                                   ; preds = %bb95.i
  %223 = getelementptr inbounds i8, ptr %ix.i, i64 8
  %_1.val2.i107 = load ptr, ptr %223, align 8, !alias.scope !6068, !noalias !5993
  %224 = icmp ne ptr %_1.val2.i107, null
  call void @llvm.assume(i1 %224), !noalias !5993
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i108"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i108": ; preds = %bb2.i.i.i.i106, %bb95.i
  %225 = getelementptr inbounds i8, ptr %ix.i, i64 24
  %.val.i109 = load i64, ptr %225, align 8, !alias.scope !6068, !noalias !5993, !noundef !2
  %226 = icmp eq i64 %.val.i109, 0
  br i1 %226, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit112", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i110"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i110": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i108"
  %227 = getelementptr inbounds i8, ptr %ix.i, i64 32
  %.val1.i111 = load ptr, ptr %227, align 8, !alias.scope !6068, !noalias !5993
  %228 = icmp ne ptr %.val1.i111, null
  call void @llvm.assume(i1 %228), !noalias !5993
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit112"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit112": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i108", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i110"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix.i), !noalias !5993
  br label %bb66.i

bb66.i:                                           ; preds = %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit112", %bb51.i
  %.pn = phi { i64, ptr } [ %221, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit112" ], [ %213, %bb51.i ]
  %_85.sroa.0.0 = extractvalue { i64, ptr } %.pn, 0
  %_85.sroa.16.0 = extractvalue { i64, ptr } %.pn, 1
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %expected.i), !noalias !5993
  br label %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread

_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread: ; preds = %_ZN14pump_recovered9create_v219create_quote_config17hae803ecc2c3593d1E.exit.i, %_ZN11anchor_lang5error5Error11with_values17hb378b4750878c680E.exit, %bb21.i, %bb30.i, %bb66.i, %bb88.i, %bb38.i, %bb15.i
  %_85.sroa.16.1.ph = phi ptr [ %_42.1.i.i.sink, %_ZN14pump_recovered9create_v219create_quote_config17hae803ecc2c3593d1E.exit.i ], [ %_29.1.i, %bb15.i ], [ %_79.1.i, %bb38.i ], [ %197, %bb88.i ], [ %_85.sroa.16.0, %bb66.i ], [ %_59.1.i, %bb30.i ], [ %_39.1.i, %bb21.i ], [ %_9.1.i, %_ZN11anchor_lang5error5Error11with_values17hb378b4750878c680E.exit ]
  %_85.sroa.0.1.ph = phi i64 [ %_72.i.sroa.8.sroa.0.1, %_ZN14pump_recovered9create_v219create_quote_config17hae803ecc2c3593d1E.exit.i ], [ %_29.0.i, %bb15.i ], [ %_79.0.i, %bb38.i ], [ %195, %bb88.i ], [ %_85.sroa.0.0, %bb66.i ], [ %_59.0.i, %bb30.i ], [ %_39.0.i, %bb21.i ], [ %_9.0.i, %_ZN11anchor_lang5error5Error11with_values17hb378b4750878c680E.exit ]
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %system.i)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %quote_info.i)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %authority.i)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %associated.i)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %payer.i)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_73.i.sroa.8)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_85.sroa.26)
  br label %bb99

_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread220: ; preds = %bb20.i, %bb26.i, %bb34
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 8 dereferenceable(16) %_85.sroa.26, i8 0, i64 16, i1 false), !noalias !5988
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %system.i)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %quote_info.i)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %authority.i)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %associated.i)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %payer.i)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_73.i.sroa.8)
  br label %bb111

_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit: ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i", %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix.i), !noalias !5993
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %expected.i), !noalias !5993
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %system.i)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %quote_info.i)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %authority.i)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %associated.i)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %payer.i)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_73.i.sroa.8)
  br label %bb111

bb29:                                             ; preds = %bb28
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_73)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_74)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_74, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_10c47fca48632193e88591e682957392) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i113)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i115), !noalias !6071
  store i64 0, ptr %buf.i115, align 8, !noalias !6071
  %_9.sroa.4.0.buf.sroa_idx.i116 = getelementptr inbounds i8, ptr %buf.i115, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i116, align 8, !noalias !6071
  %_9.sroa.5.0.buf.sroa_idx.i117 = getelementptr inbounds i8, ptr %buf.i115, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i117, align 8, !noalias !6071
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i114), !noalias !6071
  %229 = getelementptr inbounds i8, ptr %formatter.i114, i64 52
  store i32 0, ptr %229, align 4, !noalias !6071
  %230 = getelementptr inbounds i8, ptr %formatter.i114, i64 48
  store i32 32, ptr %230, align 8, !noalias !6071
  %231 = getelementptr inbounds i8, ptr %formatter.i114, i64 56
  store i8 3, ptr %231, align 8, !noalias !6071
  store i64 0, ptr %formatter.i114, align 8, !noalias !6071
  %232 = getelementptr inbounds i8, ptr %formatter.i114, i64 16
  store i64 0, ptr %232, align 8, !noalias !6071
  %233 = getelementptr inbounds i8, ptr %formatter.i114, i64 32
  store ptr %buf.i115, ptr %233, align 8, !noalias !6071
  %234 = getelementptr inbounds i8, ptr %formatter.i114, i64 40
  store ptr @vtable.4, ptr %234, align 8, !noalias !6071
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %235 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hbf6a90ed7cf777ebE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_10c47fca48632193e88591e682957392, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i114) #28, !noalias !6075
  br i1 %235, label %bb3.i118, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit119"

bb3.i118:                                         ; preds = %bb29
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i113, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !6071
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit119": ; preds = %bb29
  %236 = getelementptr inbounds i8, ptr %_73, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %236, ptr noundef nonnull align 8 dereferenceable(24) %buf.i115, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i114), !noalias !6071
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i115), !noalias !6071
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i113)
  %237 = getelementptr inbounds i8, ptr %_73, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %237, ptr noundef nonnull align 8 dereferenceable(24) %_74, i64 24, i1 false)
  %238 = getelementptr inbounds i8, ptr %_73, i64 152
  store i32 6046, ptr %238, align 8
  store i64 0, ptr %_73, align 8
  %_77.sroa.4.0._73.sroa_idx = getelementptr inbounds i8, ptr %_73, i64 8
  store ptr @alloc_16d51f561de09534a0f1e393d54002ab, ptr %_77.sroa.4.0._73.sroa_idx, align 8
  %_77.sroa.4.sroa.4.0._77.sroa.4.0._73.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_73, i64 16
  store i64 30, ptr %_77.sroa.4.sroa.4.0._77.sroa.4.0._73.sroa_idx.sroa_idx, align 8
  %_77.sroa.4.sroa.5.0._77.sroa.4.0._73.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_73, i64 24
  store i32 738, ptr %_77.sroa.4.sroa.5.0._77.sroa.4.0._73.sroa_idx.sroa_idx, align 8
  %239 = getelementptr inbounds i8, ptr %_73, i64 80
  store i8 2, ptr %239, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_74)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %240 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_73) #28
  %_72.0 = extractvalue { i64, ptr } %240, 0
  %_72.1 = extractvalue { i64, ptr } %240, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_73)
  %_239 = load ptr, ptr %55, align 8, !nonnull !2, !align !3, !noundef !2
  %241 = getelementptr inbounds i8, ptr %_239, i64 1083
  %242 = load i8, ptr %241, align 1, !range !374, !noundef !2
  %_82 = icmp ne i8 %242, 0
; call anchor_lang::error::Error::with_values
  %243 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17he8c2a935fab70db2E(i64 noundef %_72.0, ptr noundef %_72.1, i1 noundef zeroext %_82, i1 noundef zeroext true) #28
  %_71.0 = extractvalue { i64, ptr } %243, 0
  %_71.1 = extractvalue { i64, ptr } %243, 1
  br label %bb99

bb111:                                            ; preds = %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit, %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread220
  %_85.sroa.0.1230 = phi i64 [ 0, %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread220 ], [ %_73.i.sroa.0.0.copyload208, %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit ]
  %_85.sroa.16.1229 = phi ptr [ null, %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread220 ], [ %_73.i.sroa.7.0.copyload211, %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit ]
  %_85.sroa.44.0228 = phi i64 [ undef, %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread220 ], [ %_72.i.sroa.19.1.ph, %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit ]
  %_85.sroa.27.sroa.0.1227 = phi i8 [ 0, %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread220 ], [ %_72.i.sroa.8.sroa.0.1.ph, %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit ]
  %_85.sroa.27.sroa.17.0226 = phi i8 [ undef, %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread220 ], [ %_72.i.sroa.8.sroa.9.1.ph, %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit ]
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(16) %val8.sroa.3, ptr noundef nonnull align 8 dereferenceable(16) %_85.sroa.26, i64 16, i1 false)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_85.sroa.26)
  store i64 %_85.sroa.0.1230, ptr %quote_mint, align 8
  %val8.sroa.2.0.quote_mint.sroa_idx = getelementptr inbounds i8, ptr %quote_mint, i64 8
  store ptr %_85.sroa.16.1229, ptr %val8.sroa.2.0.quote_mint.sroa_idx, align 8
  %val8.sroa.3.0.quote_mint.sroa_idx = getelementptr inbounds i8, ptr %quote_mint, i64 16
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(16) %val8.sroa.3.0.quote_mint.sroa_idx, ptr noundef nonnull align 8 dereferenceable(16) %val8.sroa.3, i64 16, i1 false)
  br i1 %is_mayhem_mode, label %bb37, label %bb47

bb47:                                             ; preds = %bb39, %bb38, %bb37, %bb111
  %_308.sroa.7.0.copyload.off = add nsw i8 %_85.sroa.27.sroa.0.1227, -2
  %switch = icmp ugt i8 %_308.sroa.7.0.copyload.off, 1
  %_106.not = icmp eq i64 %creator_fee_bps, 0
  %or.cond = or i1 %_106.not, %switch
  br i1 %or.cond, label %bb60, label %bb48

bb37:                                             ; preds = %bb111
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_89)
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_89, i8 0, i64 32, i1 false)
  %244 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %quote_mint, ptr noundef nonnull dereferenceable(32) %_89, i64 32)
  %.not = icmp eq i32 %244, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_89)
  br i1 %.not, label %bb47, label %bb38

bb38:                                             ; preds = %bb37
  %245 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %quote_mint, ptr noundef nonnull dereferenceable(32) @alloc_e953c1d75e6a4349f2dca6892c168ab2, i64 32)
  %.not33 = icmp eq i32 %245, 0
  br i1 %.not33, label %bb47, label %bb39

bb39:                                             ; preds = %bb38
  %_241 = load ptr, ptr %55, align 8, !nonnull !2, !align !3, !noundef !2
  %_13.i.i2.i.i122.ptr = getelementptr inbounds i8, ptr %_241, i64 936
  %246 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_13.i.i2.i.i122.ptr, ptr noundef nonnull dereferenceable(32) %quote_mint, i64 32), !alias.scope !6076
  %247 = icmp eq i32 %246, 0
  br i1 %247, label %bb47, label %bb41

bb41:                                             ; preds = %bb39
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_97)
  %248 = getelementptr inbounds i8, ptr %_97, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %248, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_f76a96604a454814dbba396bf7b74843) #28
  %249 = getelementptr inbounds i8, ptr %_97, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %249, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_f76a96604a454814dbba396bf7b74843) #28
  %250 = getelementptr inbounds i8, ptr %_97, i64 152
  store i32 6071, ptr %250, align 8
  store i64 0, ptr %_97, align 8
  %_101.sroa.4.0._97.sroa_idx = getelementptr inbounds i8, ptr %_97, i64 8
  store ptr @alloc_16d51f561de09534a0f1e393d54002ab, ptr %_101.sroa.4.0._97.sroa_idx, align 8
  %_101.sroa.4.sroa.4.0._101.sroa.4.0._97.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_97, i64 16
  store i64 30, ptr %_101.sroa.4.sroa.4.0._101.sroa.4.0._97.sroa_idx.sroa_idx, align 8
  %_101.sroa.4.sroa.5.0._101.sroa.4.0._97.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_97, i64 24
  store i32 758, ptr %_101.sroa.4.sroa.5.0._101.sroa.4.0._97.sroa_idx.sroa_idx, align 8
  %251 = getelementptr inbounds i8, ptr %_97, i64 80
  store i8 2, ptr %251, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %252 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_97) #28
  %_96.0 = extractvalue { i64, ptr } %252, 0
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_97)
  br label %bb95.thread244

bb48:                                             ; preds = %bb47
  %_243 = load ptr, ptr %55, align 8, !nonnull !2, !align !3, !noundef !2
  %253 = getelementptr inbounds i8, ptr %_243, i64 1086
  %254 = load i8, ptr %253, align 2, !range !374, !noundef !2
  %_108.not = icmp eq i8 %254, 0
  br i1 %_108.not, label %bb49, label %bb53

bb49:                                             ; preds = %bb48
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_110)
  %255 = getelementptr inbounds i8, ptr %_110, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %255, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_01eaaa187d2be542d4425f23ab284310) #28
  %256 = getelementptr inbounds i8, ptr %_110, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %256, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_01eaaa187d2be542d4425f23ab284310) #28
  %257 = getelementptr inbounds i8, ptr %_110, i64 152
  store i32 6077, ptr %257, align 8
  store i64 0, ptr %_110, align 8
  %_114.sroa.4.0._110.sroa_idx = getelementptr inbounds i8, ptr %_110, i64 8
  store ptr @alloc_16d51f561de09534a0f1e393d54002ab, ptr %_114.sroa.4.0._110.sroa_idx, align 8
  %_114.sroa.4.sroa.4.0._114.sroa.4.0._110.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_110, i64 16
  store i64 30, ptr %_114.sroa.4.sroa.4.0._114.sroa.4.0._110.sroa_idx.sroa_idx, align 8
  %_114.sroa.4.sroa.5.0._114.sroa.4.0._110.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_110, i64 24
  store i32 774, ptr %_114.sroa.4.sroa.5.0._114.sroa.4.0._110.sroa_idx.sroa_idx, align 8
  %258 = getelementptr inbounds i8, ptr %_110, i64 80
  store i8 2, ptr %258, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %259 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_110) #28
  %_109.0 = extractvalue { i64, ptr } %259, 0
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_110)
  br label %bb95.thread244

bb53:                                             ; preds = %bb48
  %260 = getelementptr inbounds i8, ptr %_243, i64 1072
  %_119 = load i64, ptr %260, align 8, !noundef !2
  %_118.not = icmp ult i64 %_119, %creator_fee_bps
  br i1 %_118.not, label %bb55, label %bb60

bb55:                                             ; preds = %bb53
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_121)
  %261 = getelementptr inbounds i8, ptr %_121, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %261, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_973adb9e8664e25d4750ddb14e0de56a) #28
  %262 = getelementptr inbounds i8, ptr %_121, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %262, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_973adb9e8664e25d4750ddb14e0de56a) #28
  %263 = getelementptr inbounds i8, ptr %_121, i64 152
  store i32 6078, ptr %263, align 8
  store i64 0, ptr %_121, align 8
  %_125.sroa.4.0._121.sroa_idx = getelementptr inbounds i8, ptr %_121, i64 8
  store ptr @alloc_16d51f561de09534a0f1e393d54002ab, ptr %_125.sroa.4.0._121.sroa_idx, align 8
  %_125.sroa.4.sroa.4.0._125.sroa.4.0._121.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_121, i64 16
  store i64 30, ptr %_125.sroa.4.sroa.4.0._125.sroa.4.0._121.sroa_idx.sroa_idx, align 8
  %_125.sroa.4.sroa.5.0._125.sroa.4.0._121.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_121, i64 24
  store i32 778, ptr %_125.sroa.4.sroa.5.0._125.sroa.4.0._121.sroa_idx.sroa_idx, align 8
  %264 = getelementptr inbounds i8, ptr %_121, i64 80
  store i8 2, ptr %264, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %265 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_121) #28
  %_120.0 = extractvalue { i64, ptr } %265, 0
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_121)
  br label %bb95.thread244

bb60:                                             ; preds = %bb47, %bb53
  %fee.sroa.0.0 = phi i64 [ 0, %bb47 ], [ %creator_fee_bps, %bb53 ]
  %266 = icmp eq i8 %_85.sroa.27.sroa.0.1227, 3
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_133)
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_133, i8 0, i64 32, i1 false)
  %267 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %quote_mint, ptr noundef nonnull dereferenceable(32) %_133, i64 32)
  %268 = icmp eq i32 %267, 0
  %_247.pre253 = load ptr, ptr %55, align 8
  br i1 %266, label %bb121, label %bb122

bb121:                                            ; preds = %bb60
  br i1 %268, label %bb61, label %bb147

bb122:                                            ; preds = %bb60
  br i1 %268, label %bb61, label %bb62

bb147:                                            ; preds = %bb121
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_133)
  br label %bb63

bb61:                                             ; preds = %bb122, %bb121
  %depth.sroa.0.0 = phi i8 [ %_85.sroa.27.sroa.17.0226, %bb121 ], [ 0, %bb122 ]
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_133)
  %269 = getelementptr inbounds i8, ptr %_247.pre253, i64 1008
  %270 = load i64, ptr %269, align 8, !noundef !2
  br label %bb63

bb62:                                             ; preds = %bb122
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_133)
  %switch46 = icmp ult i8 %_308.sroa.7.0.copyload.off, 2
  br i1 %switch46, label %bb63, label %bb125

bb125:                                            ; preds = %bb62
  %271 = getelementptr inbounds i8, ptr %_247.pre253, i64 1064
  %272 = load i64, ptr %271, align 8, !noundef !2
  br label %bb63

bb63:                                             ; preds = %bb62, %bb147, %bb61, %bb125
  %depth.sroa.0.3 = phi i8 [ %depth.sroa.0.0, %bb61 ], [ 0, %bb125 ], [ %_85.sroa.27.sroa.17.0226, %bb147 ], [ 0, %bb62 ]
  %virtual_quote_reserves.sroa.0.0 = phi i64 [ %270, %bb61 ], [ %272, %bb125 ], [ %_85.sroa.44.0228, %bb147 ], [ %_85.sroa.44.0228, %bb62 ]
  %273 = getelementptr inbounds i8, ptr %_247.pre253, i64 1000
  %_135 = load i64, ptr %273, align 8, !noundef !2
  %274 = getelementptr inbounds i8, ptr %_236, i64 232
  %_251 = load ptr, ptr %274, align 8, !nonnull !2, !align !3, !noundef !2
  %275 = getelementptr inbounds i8, ptr %_251, i64 72
  store i64 %_135, ptr %275, align 8
  %_252 = load ptr, ptr %274, align 8, !nonnull !2, !align !3, !noundef !2
  %276 = getelementptr inbounds i8, ptr %_252, i64 80
  store i64 %virtual_quote_reserves.sroa.0.0, ptr %276, align 8
  %_253 = load ptr, ptr %55, align 8, !nonnull !2, !align !3, !noundef !2
  %277 = getelementptr inbounds i8, ptr %_253, i64 1016
  %_137 = load i64, ptr %277, align 8, !noundef !2
  %_254 = load ptr, ptr %274, align 8, !nonnull !2, !align !3, !noundef !2
  %278 = getelementptr inbounds i8, ptr %_254, i64 88
  store i64 %_137, ptr %278, align 8
  %_255 = load ptr, ptr %55, align 8, !nonnull !2, !align !3, !noundef !2
  %279 = getelementptr inbounds i8, ptr %_255, i64 1024
  %_138 = load i64, ptr %279, align 8, !noundef !2
  %_256 = load ptr, ptr %274, align 8, !nonnull !2, !align !3, !noundef !2
  %280 = getelementptr inbounds i8, ptr %_256, i64 104
  store i64 %_138, ptr %280, align 8
  %_257 = load ptr, ptr %274, align 8, !nonnull !2, !align !3, !noundef !2
  %281 = getelementptr inbounds i8, ptr %_257, i64 8
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %281, ptr noundef nonnull align 1 dereferenceable(32) %creator1, i64 32, i1 false)
  %_258 = load ptr, ptr %274, align 8, !nonnull !2, !align !3, !noundef !2
  %282 = getelementptr inbounds i8, ptr %_258, i64 112
  store i64 %fee.sroa.0.0, ptr %282, align 8
  %_259 = load ptr, ptr %274, align 8, !nonnull !2, !align !3, !noundef !2
  %283 = getelementptr inbounds i8, ptr %_259, i64 165
  %284 = zext i1 %is_holder_reward to i8
  store i8 %284, ptr %283, align 1
  %_260 = load ptr, ptr %274, align 8, !nonnull !2, !align !3, !noundef !2
  %285 = getelementptr inbounds i8, ptr %_260, i64 40
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %285, ptr noundef nonnull align 8 dereferenceable(32) %quote_mint, i64 32, i1 false)
  %_261 = load ptr, ptr %274, align 8, !nonnull !2, !align !3, !noundef !2
  %286 = getelementptr inbounds i8, ptr %_261, i64 136
  store i64 %virtual_quote_reserves.sroa.0.0, ptr %286, align 8
  %_262 = load ptr, ptr %274, align 8, !nonnull !2, !align !3, !noundef !2
  %287 = getelementptr inbounds i8, ptr %_262, i64 160
  store i8 %depth.sroa.0.3, ptr %287, align 8
  %_263 = load ptr, ptr %274, align 8, !nonnull !2, !align !3, !noundef !2
  %288 = getelementptr inbounds i8, ptr %_263, i64 162
  %289 = zext i1 %is_mayhem_mode to i8
  store i8 %289, ptr %288, align 2
  call void @llvm.experimental.noalias.scope.decl(metadata !6083)
  call void @llvm.experimental.noalias.scope.decl(metadata !6086)
  call void @llvm.experimental.noalias.scope.decl(metadata !6088)
  %290 = getelementptr inbounds i8, ptr %name, i64 16
  %_5.i48 = load i64, ptr %290, align 8, !alias.scope !6083, !noalias !6090, !noundef !2
  %_4.i = icmp ugt i64 %_5.i48, 32
  br i1 %_4.i, label %bb1.i53, label %bb6.i

bb6.i:                                            ; preds = %bb63
  %291 = getelementptr inbounds i8, ptr %symbol, i64 16
  %_18.i = load i64, ptr %291, align 8, !alias.scope !6086, !noalias !6091, !noundef !2
  %_17.i = icmp ugt i64 %_18.i, 13
  br i1 %_17.i, label %bb7.i, label %bb12.i

bb1.i53:                                          ; preds = %bb63
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_8.i), !noalias !6092
  %292 = getelementptr inbounds i8, ptr %_8.i, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %292, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_576b45ec2f88fc1b160b0731788b05b1) #28, !noalias !6092
  %293 = getelementptr inbounds i8, ptr %_8.i, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %293, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_576b45ec2f88fc1b160b0731788b05b1) #28, !noalias !6092
  %294 = getelementptr inbounds i8, ptr %_8.i, i64 152
  store i32 6043, ptr %294, align 8, !noalias !6092
  store i64 0, ptr %_8.i, align 8, !noalias !6092
  %_12.sroa.4.0._8.sroa_idx.i = getelementptr inbounds i8, ptr %_8.i, i64 8
  store ptr @alloc_16d51f561de09534a0f1e393d54002ab, ptr %_12.sroa.4.0._8.sroa_idx.i, align 8, !noalias !6092
  %_12.sroa.4.sroa.4.0._12.sroa.4.0._8.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_8.i, i64 16
  store i64 30, ptr %_12.sroa.4.sroa.4.0._12.sroa.4.0._8.sroa_idx.sroa_idx.i, align 8, !noalias !6092
  %_12.sroa.4.sroa.5.0._12.sroa.4.0._8.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_8.i, i64 24
  store i32 541, ptr %_12.sroa.4.sroa.5.0._12.sroa.4.0._8.sroa_idx.sroa_idx.i, align 8, !noalias !6092
  %295 = getelementptr inbounds i8, ptr %_8.i, i64 80
  store i8 2, ptr %295, align 8, !noalias !6092
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %296 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_8.i) #28, !noalias !6092
  %_7.0.i = extractvalue { i64, ptr } %296, 0
  %_7.1.i = extractvalue { i64, ptr } %296, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_8.i), !noalias !6092
; call anchor_lang::error::Error::with_values
  %297 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17ha6df42326d4a37a2E(i64 noundef %_7.0.i, ptr noundef %_7.1.i, i64 noundef 32, i64 noundef %_5.i48) #28
  br label %_ZN14pump_recovered9create_v224validate_create_metadata17h8057cb4026b20769E.exit

bb12.i:                                           ; preds = %bb6.i
  %298 = getelementptr inbounds i8, ptr %uri, i64 16
  %_31.i49 = load i64, ptr %298, align 8, !alias.scope !6088, !noalias !6093, !noundef !2
  %_30.i50 = icmp ugt i64 %_31.i49, 200
  br i1 %_30.i50, label %bb13.i52, label %bb130

bb7.i:                                            ; preds = %bb6.i
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_21.i), !noalias !6092
  %299 = getelementptr inbounds i8, ptr %_21.i, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %299, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_022a7224973e9ad3ccb65a26923fb420) #28, !noalias !6092
  %300 = getelementptr inbounds i8, ptr %_21.i, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %300, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_022a7224973e9ad3ccb65a26923fb420) #28, !noalias !6092
  %301 = getelementptr inbounds i8, ptr %_21.i, i64 152
  store i32 6044, ptr %301, align 8, !noalias !6092
  store i64 0, ptr %_21.i, align 8, !noalias !6092
  %_25.sroa.4.0._21.sroa_idx.i = getelementptr inbounds i8, ptr %_21.i, i64 8
  store ptr @alloc_16d51f561de09534a0f1e393d54002ab, ptr %_25.sroa.4.0._21.sroa_idx.i, align 8, !noalias !6092
  %_25.sroa.4.sroa.4.0._25.sroa.4.0._21.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_21.i, i64 16
  store i64 30, ptr %_25.sroa.4.sroa.4.0._25.sroa.4.0._21.sroa_idx.sroa_idx.i, align 8, !noalias !6092
  %_25.sroa.4.sroa.5.0._25.sroa.4.0._21.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_21.i, i64 24
  store i32 547, ptr %_25.sroa.4.sroa.5.0._25.sroa.4.0._21.sroa_idx.sroa_idx.i, align 8, !noalias !6092
  %302 = getelementptr inbounds i8, ptr %_21.i, i64 80
  store i8 2, ptr %302, align 8, !noalias !6092
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %303 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_21.i) #28, !noalias !6092
  %_20.0.i = extractvalue { i64, ptr } %303, 0
  %_20.1.i = extractvalue { i64, ptr } %303, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_21.i), !noalias !6092
; call anchor_lang::error::Error::with_values
  %304 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17ha6df42326d4a37a2E(i64 noundef %_20.0.i, ptr noundef %_20.1.i, i64 noundef 13, i64 noundef %_18.i) #28
  br label %_ZN14pump_recovered9create_v224validate_create_metadata17h8057cb4026b20769E.exit

bb13.i52:                                         ; preds = %bb12.i
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_34.i), !noalias !6092
  %305 = getelementptr inbounds i8, ptr %_34.i, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %305, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_98fb01e586ad980c5471b8ec107fefb9) #28, !noalias !6092
  %306 = getelementptr inbounds i8, ptr %_34.i, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %306, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_98fb01e586ad980c5471b8ec107fefb9) #28, !noalias !6092
  %307 = getelementptr inbounds i8, ptr %_34.i, i64 152
  store i32 6045, ptr %307, align 8, !noalias !6092
  store i64 0, ptr %_34.i, align 8, !noalias !6092
  %_38.sroa.4.0._34.sroa_idx.i = getelementptr inbounds i8, ptr %_34.i, i64 8
  store ptr @alloc_16d51f561de09534a0f1e393d54002ab, ptr %_38.sroa.4.0._34.sroa_idx.i, align 8, !noalias !6092
  %_38.sroa.4.sroa.4.0._38.sroa.4.0._34.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_34.i, i64 16
  store i64 30, ptr %_38.sroa.4.sroa.4.0._38.sroa.4.0._34.sroa_idx.sroa_idx.i, align 8, !noalias !6092
  %_38.sroa.4.sroa.5.0._38.sroa.4.0._34.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_34.i, i64 24
  store i32 553, ptr %_38.sroa.4.sroa.5.0._38.sroa.4.0._34.sroa_idx.sroa_idx.i, align 8, !noalias !6092
  %308 = getelementptr inbounds i8, ptr %_34.i, i64 80
  store i8 2, ptr %308, align 8, !noalias !6092
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %309 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_34.i) #28, !noalias !6092
  %_33.0.i = extractvalue { i64, ptr } %309, 0
  %_33.1.i = extractvalue { i64, ptr } %309, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_34.i), !noalias !6092
; call anchor_lang::error::Error::with_values
  %310 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17ha6df42326d4a37a2E(i64 noundef %_33.0.i, ptr noundef %_33.1.i, i64 noundef 200, i64 noundef %_31.i49) #28
  br label %_ZN14pump_recovered9create_v224validate_create_metadata17h8057cb4026b20769E.exit

_ZN14pump_recovered9create_v224validate_create_metadata17h8057cb4026b20769E.exit: ; preds = %bb1.i53, %bb7.i, %bb13.i52
  %.pn249 = phi { i64, ptr } [ %297, %bb1.i53 ], [ %304, %bb7.i ], [ %310, %bb13.i52 ]
  %_0.sroa.0.0.i = extractvalue { i64, ptr } %.pn249, 0
  %311 = icmp eq i64 %_0.sroa.0.0.i, 2
  br i1 %311, label %bb130, label %bb95.thread244

bb130:                                            ; preds = %bb12.i, %_ZN14pump_recovered9create_v224validate_create_metadata17h8057cb4026b20769E.exit
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_153)
; call <alloc::string::String as core::clone::Clone>::clone
  call void @"_ZN60_$LT$alloc..string..String$u20$as$u20$core..clone..Clone$GT$5clone17h415f8832ba4c6f63E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_153, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) %name) #28
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_155)
; call <alloc::string::String as core::clone::Clone>::clone
  call void @"_ZN60_$LT$alloc..string..String$u20$as$u20$core..clone..Clone$GT$5clone17h415f8832ba4c6f63E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_155, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) %symbol) #28
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_157)
; call <alloc::string::String as core::clone::Clone>::clone
  call void @"_ZN60_$LT$alloc..string..String$u20$as$u20$core..clone..Clone$GT$5clone17h415f8832ba4c6f63E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_157, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) %uri) #28
  %312 = getelementptr inbounds i8, ptr %ctx, i64 32
  %ctx.val62 = load i8, ptr %312, align 8, !noundef !2
; call pump_recovered::create_v2::initialize_metadata
  %313 = call fastcc { i64, ptr } @_ZN14pump_recovered9create_v219initialize_metadata17hb2b6b65fb3fa3a6cE(ptr nonnull %_236, i8 %ctx.val62, ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %_153, ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %_155, ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %_157) #28
  %314 = extractvalue { i64, ptr } %313, 0
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_157)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_155)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_153)
  %315 = icmp eq i64 %314, 2
  br i1 %315, label %bb132, label %bb95.thread244

bb132:                                            ; preds = %bb130
  br i1 %is_mayhem_mode, label %bb69, label %bb71

bb71:                                             ; preds = %bb69, %bb132
; call pump_recovered::create_v2::mint_supply
  %316 = call fastcc { i64, ptr } @_ZN14pump_recovered9create_v211mint_supply17h50b334df6f7729b0E(ptr nonnull %_236, i8 %ctx.val62, i1 noundef zeroext %is_mayhem_mode) #28
  %317 = extractvalue { i64, ptr } %316, 0
  %318 = icmp eq i64 %317, 2
  br i1 %318, label %bb136, label %bb95.thread244

bb69:                                             ; preds = %bb132
; call pump_recovered::create_v2::initialize_mayhem
  %319 = call { i64, ptr } @_ZN14pump_recovered9create_v217initialize_mayhem17h216fe3ea549d6e8fE(ptr noalias noundef nonnull readonly align 8 dereferenceable(40) %ctx) #28
  %320 = extractvalue { i64, ptr } %319, 0
  %321 = icmp eq i64 %320, 2
  br i1 %321, label %bb71, label %bb95.thread244

bb136:                                            ; preds = %bb71
  call void @llvm.lifetime.start.p0(i64 328, ptr nonnull %event)
  call void @llvm.lifetime.start.p0(i64 328, ptr nonnull %_171)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_172)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_172, ptr noundef nonnull align 8 dereferenceable(24) %name, i64 24, i1 false)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_173)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_173, ptr noundef nonnull align 8 dereferenceable(24) %symbol, i64 24, i1 false)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_174)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_174, ptr noundef nonnull align 8 dereferenceable(24) %uri, i64 24, i1 false)
  %_177 = getelementptr inbounds i8, ptr %_236, i64 256
  %_267 = load ptr, ptr %274, align 8, !nonnull !2, !align !3, !noundef !2
  %_179 = getelementptr inbounds i8, ptr %_236, i64 272
  %322 = getelementptr i8, ptr %_236, i64 88
  %_264.val = load ptr, ptr %322, align 8, !nonnull !2, !align !3, !noundef !2
  %_177.val = load ptr, ptr %_177, align 8, !nonnull !2, !align !3, !noundef !2
  %_179.val = load ptr, ptr %_179, align 8
; call pump_recovered::create_v2::create_event
  call fastcc void @_ZN14pump_recovered9create_v212create_event17hfba94798f2741227E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(328) %_171, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_172, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_173, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_174, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %creator1, ptr nonnull %_264.val, ptr nonnull %_177.val, ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %_267, ptr %_179.val, i1 noundef zeroext %is_mayhem_mode, i64 noundef %fee.sroa.0.0) #28
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_174)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_173)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_172)
  %323 = load i64, ptr %_171, align 8, !range !423, !noundef !2
  %324 = icmp eq i64 %323, -9223372036854775808
  %325 = getelementptr inbounds i8, ptr %_171, i64 8
  %_343.0 = load i64, ptr %325, align 8
  %326 = getelementptr inbounds i8, ptr %_171, i64 16
  %_343.1 = load ptr, ptr %326, align 8
  br i1 %324, label %bb137, label %bb138

bb138:                                            ; preds = %bb136
  %_342.sroa.7.0._171.sroa_idx = getelementptr inbounds i8, ptr %_171, i64 24
  %val.sroa.6.0.event.sroa_idx = getelementptr inbounds i8, ptr %event, i64 24
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(304) %val.sroa.6.0.event.sroa_idx, ptr noundef nonnull align 8 dereferenceable(304) %_342.sroa.7.0._171.sroa_idx, i64 304, i1 false)
  call void @llvm.lifetime.end.p0(i64 328, ptr nonnull %_171)
  store i64 %323, ptr %event, align 8
  %val.sroa.4.0.event.sroa_idx = getelementptr inbounds i8, ptr %event, i64 8
  store i64 %_343.0, ptr %val.sroa.4.0.event.sroa_idx, align 8
  %val.sroa.5.0.event.sroa_idx = getelementptr inbounds i8, ptr %event, i64 16
  store ptr %_343.1, ptr %val.sroa.5.0.event.sroa_idx, align 8
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_186)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_188)
; call <pump_recovered::CreateEvent as anchor_lang::Event>::data
  call void @"_ZN66_$LT$pump_recovered..CreateEvent$u20$as$u20$anchor_lang..Event$GT$4data17h394bda51c0e7f5b4E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_188, ptr noalias noundef nonnull readonly align 8 dereferenceable(328) %event) #28
  %327 = getelementptr inbounds i8, ptr %_188, i64 8
  %_348 = load ptr, ptr %327, align 8, !nonnull !2, !noundef !2
  %328 = getelementptr inbounds i8, ptr %_188, i64 16
  %_347 = load i64, ptr %328, align 8, !noundef !2
  store ptr %_348, ptr %_186, align 8
  %329 = getelementptr inbounds i8, ptr %_186, i64 8
  store i64 %_347, ptr %329, align 8
; call solana_program::log::sol_log_data
  call void @_ZN14solana_program3log12sol_log_data17h1e024b73f122854fE(ptr noalias noundef nonnull readonly align 8 %_186, i64 noundef 1) #28
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_188)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_186)
  %_191 = getelementptr inbounds i8, ptr %_236, i64 128
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %authority_info, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_191) #28
  %330 = getelementptr inbounds i8, ptr %ctx, i64 38
  %authority_bump = load i8, ptr %330, align 2, !noundef !2
; call <pump_recovered::CreateEvent as anchor_lang::Event>::data
  call void @"_ZN66_$LT$pump_recovered..CreateEvent$u20$as$u20$anchor_lang..Event$GT$4data17h394bda51c0e7f5b4E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %inner_data, ptr noalias noundef nonnull readonly align 8 dereferenceable(328) %event) #28
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %ix_data)
  %me.sroa.0.0.copyload.i = load i64, ptr %inner_data, align 8, !alias.scope !6094, !noalias !6097
  %me.sroa.4.0.self.sroa_idx.i = getelementptr inbounds i8, ptr %inner_data, i64 8
  %me.sroa.4.0.copyload.i = load ptr, ptr %me.sroa.4.0.self.sroa_idx.i, align 8, !alias.scope !6094, !noalias !6097, !nonnull !2, !noundef !2
  %me.sroa.5.0.self.sroa_idx.i = getelementptr inbounds i8, ptr %inner_data, i64 16
  %me.sroa.5.0.copyload.i = load i64, ptr %me.sroa.5.0.self.sroa_idx.i, align 8, !alias.scope !6094, !noalias !6097
  %_18.i127 = getelementptr inbounds i8, ptr %me.sroa.4.0.copyload.i, i64 %me.sroa.5.0.copyload.i
  %331 = getelementptr inbounds i8, ptr %_197, i64 32
  store ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, ptr %331, align 8
  %332 = getelementptr inbounds i8, ptr %_197, i64 40
  store ptr getelementptr inbounds (<{ [8 x i8] }>, ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, i64 1, i32 0, i64 0), ptr %332, align 8
  store ptr %me.sroa.4.0.copyload.i, ptr %_197, align 8
  %_358.sroa.4.0._197.sroa_idx = getelementptr inbounds i8, ptr %_197, i64 8
  store ptr %me.sroa.4.0.copyload.i, ptr %_358.sroa.4.0._197.sroa_idx, align 8
  %_358.sroa.5.0._197.sroa_idx = getelementptr inbounds i8, ptr %_197, i64 16
  store i64 %me.sroa.0.0.copyload.i, ptr %_358.sroa.5.0._197.sroa_idx, align 8
  %_358.sroa.6.0._197.sroa_idx = getelementptr inbounds i8, ptr %_197, i64 24
  store ptr %_18.i127, ptr %_358.sroa.6.0._197.sroa_idx, align 8
; call <alloc::vec::Vec<T> as alloc::vec::spec_from_iter::SpecFromIter<T,I>>::from_iter
  call fastcc void @"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h05834ec09ece64f1E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %ix_data, ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_197) #28
  call void @llvm.lifetime.start.p0(i64 80, ptr nonnull %ix)
  %333 = getelementptr inbounds i8, ptr %ix_data, i64 8
  %_361 = load ptr, ptr %333, align 8, !nonnull !2, !noundef !2
  %334 = getelementptr inbounds i8, ptr %ix_data, i64 16
  %_360 = load i64, ptr %334, align 8, !noundef !2
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_205)
; call alloc::alloc::exchange_malloc
  %_207 = call fastcc noundef ptr @_ZN5alloc5alloc15exchange_malloc17h6cd8dd11b0e3424eE(i64 noundef 34, i64 noundef 1) #28
  %_270 = load ptr, ptr %authority_info, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memmove.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_207, ptr noundef nonnull align 1 dereferenceable(32) %_270, i64 32, i1 false)
  %_209.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_207, i64 32
  store i8 1, ptr %_209.sroa.4.0..sroa_idx, align 1
  %_209.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_207, i64 33
  store i8 0, ptr %_209.sroa.5.0..sroa_idx, align 1
  store i64 1, ptr %_205, align 8, !alias.scope !6099, !noalias !6102
  %335 = getelementptr inbounds i8, ptr %_205, i64 8
  store ptr %_207, ptr %335, align 8, !alias.scope !6099, !noalias !6102
  %336 = getelementptr inbounds i8, ptr %_205, i64 16
  store i64 1, ptr %336, align 8, !alias.scope !6099, !noalias !6102
; call solana_instruction::Instruction::new_with_bytes
  call void @_ZN18solana_instruction11Instruction14new_with_bytes17h836fab8fb6401158E(ptr noalias nocapture noundef nonnull sret([80 x i8]) align 8 dereferenceable(80) %ix, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) @_ZN14pump_recovered2ID17h8e245cf89cf2c06bE, ptr noalias noundef nonnull readonly align 1 %_361, i64 noundef %_360, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_205) #28
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_205)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_217)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %_217, ptr noundef nonnull align 8 dereferenceable(48) %authority_info, i64 48, i1 false)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_220)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_223)
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %_227)
  store i8 %authority_bump, ptr %_227, align 1
  store ptr @alloc_7a7952b5e0d15f2b72d0341cef6d4739, ptr %_223, align 8
  %337 = getelementptr inbounds i8, ptr %_223, i64 8
  store i64 17, ptr %337, align 8
  %338 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_223, i64 0, i64 1
  store ptr %_227, ptr %338, align 8
  %339 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_223, i64 0, i64 1, i32 1
  store i64 1, ptr %339, align 8
  store ptr %_223, ptr %_220, align 8
  %340 = getelementptr inbounds i8, ptr %_220, i64 8
  store i64 2, ptr %340, align 8
; call solana_program::program::invoke_signed
  call void @_ZN14solana_program7program13invoke_signed17h01c3b84bc1fc491eE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_213, ptr noalias noundef nonnull readonly align 8 dereferenceable(80) %ix, ptr noalias noundef nonnull readonly align 8 %_217, i64 noundef 1, ptr noalias noundef nonnull readonly align 8 %_220, i64 noundef 1) #28
  %341 = load i64, ptr %_213, align 8, !range !366, !noundef !2
  %342 = icmp eq i64 %341, -9223372036854775782
  br i1 %342, label %bb143, label %bb142

bb137:                                            ; preds = %bb136
  call void @llvm.lifetime.end.p0(i64 328, ptr nonnull %_171)
  br label %bb95

bb143:                                            ; preds = %bb138
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_227)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_223)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_220)
  %343 = getelementptr inbounds i8, ptr %_217, i64 8
  %_217.val60 = load ptr, ptr %343, align 8, !nonnull !2, !noundef !2
  %344 = getelementptr inbounds i8, ptr %_217, i64 16
  %_217.val61 = load ptr, ptr %344, align 8
  %self1.val.i.i.i.i = load i64, ptr %_217.val60, align 8, !noundef !2
  %val.i.i.i.i = add i64 %self1.val.i.i.i.i, -1
  store i64 %val.i.i.i.i, ptr %_217.val60, align 8
  %345 = icmp eq i64 %val.i.i.i.i, 0
  br i1 %345, label %bb1.i.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i"

bb1.i.i.i.i:                                      ; preds = %bb143
  %346 = getelementptr i8, ptr %_217.val60, i64 8
  %self2.val.i.i.i.i = load i64, ptr %346, align 8, !noundef !2
  %val6.i.i.i.i = add i64 %self2.val.i.i.i.i, -1
  store i64 %val6.i.i.i.i, ptr %346, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i": ; preds = %bb1.i.i.i.i, %bb143
  %347 = icmp ne ptr %_217.val61, null
  call void @llvm.assume(i1 %347)
  %self1.val.i.i2.i.i = load i64, ptr %_217.val61, align 8, !noundef !2
  %val.i.i3.i.i = add i64 %self1.val.i.i2.i.i, -1
  store i64 %val.i.i3.i.i, ptr %_217.val61, align 8
  %348 = icmp eq i64 %val.i.i3.i.i, 0
  br i1 %348, label %bb1.i.i4.i.i, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit"

bb1.i.i4.i.i:                                     ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i"
  %349 = getelementptr i8, ptr %_217.val61, i64 8
  %self2.val.i.i5.i.i = load i64, ptr %349, align 8, !noundef !2
  %val6.i.i6.i.i = add i64 %self2.val.i.i5.i.i, -1
  store i64 %val6.i.i6.i.i, ptr %349, align 8
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i", %bb1.i.i4.i.i
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_217)
  %_1.val.i128 = load i64, ptr %ix, align 8, !alias.scope !6104, !noundef !2
  %350 = icmp eq i64 %_1.val.i128, 0
  br i1 %350, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i131", label %bb2.i.i.i.i129

bb2.i.i.i.i129:                                   ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit"
  %351 = getelementptr inbounds i8, ptr %ix, i64 8
  %_1.val2.i130 = load ptr, ptr %351, align 8, !alias.scope !6104
  %352 = icmp ne ptr %_1.val2.i130, null
  call void @llvm.assume(i1 %352)
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i131"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i131": ; preds = %bb2.i.i.i.i129, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit"
  %353 = getelementptr inbounds i8, ptr %ix, i64 24
  %.val.i132 = load i64, ptr %353, align 8, !alias.scope !6104, !noundef !2
  %354 = icmp eq i64 %.val.i132, 0
  br i1 %354, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit135", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i133"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i133": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i131"
  %355 = getelementptr inbounds i8, ptr %ix, i64 32
  %.val1.i134 = load ptr, ptr %355, align 8, !alias.scope !6104
  %356 = icmp ne ptr %.val1.i134, null
  call void @llvm.assume(i1 %356)
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit135"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit135": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i131", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i133"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data)
  %357 = icmp eq i64 %323, 0
  br i1 %357, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i": ; preds = %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit135"
  %358 = icmp ne i64 %_343.0, 0
  call void @llvm.assume(i1 %358)
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i", %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit135"
  %_1.val.i1.i = load i64, ptr %val.sroa.6.0.event.sroa_idx, align 8, !alias.scope !6107, !noundef !2
  %359 = icmp eq i64 %_1.val.i1.i, 0
  br i1 %359, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit4.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i2.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i2.i": ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i"
  %360 = getelementptr inbounds i8, ptr %event, i64 32
  %_1.val1.i3.i = load ptr, ptr %360, align 8, !alias.scope !6107
  %361 = icmp ne ptr %_1.val1.i3.i, null
  call void @llvm.assume(i1 %361)
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit4.i"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit4.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i2.i", %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i"
  %362 = getelementptr inbounds i8, ptr %event, i64 48
  %_1.val.i5.i = load i64, ptr %362, align 8, !alias.scope !6112, !noundef !2
  %363 = icmp eq i64 %_1.val.i5.i, 0
  br i1 %363, label %"_ZN4core3ptr48drop_in_place$LT$pump_recovered..CreateEvent$GT$17hed2049d344f88e84E.exit", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i6.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i6.i": ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit4.i"
  %364 = getelementptr inbounds i8, ptr %event, i64 56
  %_1.val1.i7.i = load ptr, ptr %364, align 8, !alias.scope !6112
  %365 = icmp ne ptr %_1.val1.i7.i, null
  call void @llvm.assume(i1 %365)
  br label %"_ZN4core3ptr48drop_in_place$LT$pump_recovered..CreateEvent$GT$17hed2049d344f88e84E.exit"

"_ZN4core3ptr48drop_in_place$LT$pump_recovered..CreateEvent$GT$17hed2049d344f88e84E.exit": ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit4.i", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i6.i"
  call void @llvm.lifetime.end.p0(i64 328, ptr nonnull %event)
  br label %bb98

bb142:                                            ; preds = %bb138
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %366 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17ha4865197be4b9a2fE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_213) #28
  %_366.0 = extractvalue { i64, ptr } %366, 0
  %_366.1 = extractvalue { i64, ptr } %366, 1
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_227)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_223)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_220)
  %367 = getelementptr inbounds i8, ptr %_217, i64 8
  %_217.val = load ptr, ptr %367, align 8, !nonnull !2, !noundef !2
  %368 = getelementptr inbounds i8, ptr %_217, i64 16
  %_217.val59 = load ptr, ptr %368, align 8
  %self1.val.i.i.i.i138 = load i64, ptr %_217.val, align 8, !noundef !2
  %val.i.i.i.i139 = add i64 %self1.val.i.i.i.i138, -1
  store i64 %val.i.i.i.i139, ptr %_217.val, align 8
  %369 = icmp eq i64 %val.i.i.i.i139, 0
  br i1 %369, label %bb1.i.i.i.i146, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i140"

bb1.i.i.i.i146:                                   ; preds = %bb142
  %370 = getelementptr i8, ptr %_217.val, i64 8
  %self2.val.i.i.i.i147 = load i64, ptr %370, align 8, !noundef !2
  %val6.i.i.i.i148 = add i64 %self2.val.i.i.i.i147, -1
  store i64 %val6.i.i.i.i148, ptr %370, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i140"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i140": ; preds = %bb1.i.i.i.i146, %bb142
  %371 = icmp ne ptr %_217.val59, null
  call void @llvm.assume(i1 %371)
  %self1.val.i.i2.i.i141 = load i64, ptr %_217.val59, align 8, !noundef !2
  %val.i.i3.i.i142 = add i64 %self1.val.i.i2.i.i141, -1
  store i64 %val.i.i3.i.i142, ptr %_217.val59, align 8
  %372 = icmp eq i64 %val.i.i3.i.i142, 0
  br i1 %372, label %bb1.i.i4.i.i143, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit149"

bb1.i.i4.i.i143:                                  ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i140"
  %373 = getelementptr i8, ptr %_217.val59, i64 8
  %self2.val.i.i5.i.i144 = load i64, ptr %373, align 8, !noundef !2
  %val6.i.i6.i.i145 = add i64 %self2.val.i.i5.i.i144, -1
  store i64 %val6.i.i6.i.i145, ptr %373, align 8
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit149"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit149": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i140", %bb1.i.i4.i.i143
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_217)
  %_1.val.i150 = load i64, ptr %ix, align 8, !alias.scope !6115, !noundef !2
  %374 = icmp eq i64 %_1.val.i150, 0
  br i1 %374, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i153", label %bb2.i.i.i.i151

bb2.i.i.i.i151:                                   ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit149"
  %375 = getelementptr inbounds i8, ptr %ix, i64 8
  %_1.val2.i152 = load ptr, ptr %375, align 8, !alias.scope !6115
  %376 = icmp ne ptr %_1.val2.i152, null
  call void @llvm.assume(i1 %376)
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i153"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i153": ; preds = %bb2.i.i.i.i151, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit149"
  %377 = getelementptr inbounds i8, ptr %ix, i64 24
  %.val.i154 = load i64, ptr %377, align 8, !alias.scope !6115, !noundef !2
  %378 = icmp eq i64 %.val.i154, 0
  br i1 %378, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit157", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i155"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i155": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i153"
  %379 = getelementptr inbounds i8, ptr %ix, i64 32
  %.val1.i156 = load ptr, ptr %379, align 8, !alias.scope !6115
  %380 = icmp ne ptr %.val1.i156, null
  call void @llvm.assume(i1 %380)
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit157"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit157": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i153", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i155"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data)
  %381 = icmp eq i64 %323, 0
  br i1 %381, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i163", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i161"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i161": ; preds = %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit157"
  %382 = icmp ne i64 %_343.0, 0
  call void @llvm.assume(i1 %382)
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i163"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i163": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i161", %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit157"
  %_1.val.i1.i164 = load i64, ptr %val.sroa.6.0.event.sroa_idx, align 8, !alias.scope !6118, !noundef !2
  %383 = icmp eq i64 %_1.val.i1.i164, 0
  br i1 %383, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit4.i167", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i2.i165"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i2.i165": ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i163"
  %384 = getelementptr inbounds i8, ptr %event, i64 32
  %_1.val1.i3.i166 = load ptr, ptr %384, align 8, !alias.scope !6118
  %385 = icmp ne ptr %_1.val1.i3.i166, null
  call void @llvm.assume(i1 %385)
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit4.i167"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit4.i167": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i2.i165", %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit.i163"
  %386 = getelementptr inbounds i8, ptr %event, i64 48
  %_1.val.i5.i168 = load i64, ptr %386, align 8, !alias.scope !6123, !noundef !2
  %387 = icmp eq i64 %_1.val.i5.i168, 0
  br i1 %387, label %bb95, label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i6.i169"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i6.i169": ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit4.i167"
  %388 = getelementptr inbounds i8, ptr %event, i64 56
  %_1.val1.i7.i170 = load ptr, ptr %388, align 8, !alias.scope !6123
  %389 = icmp ne ptr %_1.val1.i7.i170, null
  call void @llvm.assume(i1 %389)
  br label %bb95

bb98:                                             ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i179", %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit177", %bb95, %"_ZN4core3ptr48drop_in_place$LT$pump_recovered..CreateEvent$GT$17hed2049d344f88e84E.exit"
  %_0.sroa.17.3 = phi ptr [ undef, %"_ZN4core3ptr48drop_in_place$LT$pump_recovered..CreateEvent$GT$17hed2049d344f88e84E.exit" ], [ %_0.sroa.17.4, %bb95 ], [ %_0.sroa.17.6236, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit177" ], [ %_0.sroa.17.6236, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i179" ]
  %_0.sroa.0.3 = phi i64 [ 2, %"_ZN4core3ptr48drop_in_place$LT$pump_recovered..CreateEvent$GT$17hed2049d344f88e84E.exit" ], [ %_0.sroa.0.4, %bb95 ], [ %_0.sroa.0.6237, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit177" ], [ %_0.sroa.0.6237, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i179" ]
  %390 = insertvalue { i64, ptr } poison, i64 %_0.sroa.0.3, 0
  %391 = insertvalue { i64, ptr } %390, ptr %_0.sroa.17.3, 1
  ret { i64, ptr } %391

bb95.thread244:                                   ; preds = %bb71, %bb69, %bb130, %bb41, %bb55, %bb49, %_ZN14pump_recovered9create_v224validate_create_metadata17h8057cb4026b20769E.exit
  %.pn249.pn = phi { i64, ptr } [ %.pn249, %_ZN14pump_recovered9create_v224validate_create_metadata17h8057cb4026b20769E.exit ], [ %259, %bb49 ], [ %265, %bb55 ], [ %252, %bb41 ], [ %313, %bb130 ], [ %319, %bb69 ], [ %316, %bb71 ]
  %_0.sroa.0.1.ph = phi i64 [ %_0.sroa.0.0.i, %_ZN14pump_recovered9create_v224validate_create_metadata17h8057cb4026b20769E.exit ], [ %_109.0, %bb49 ], [ %_120.0, %bb55 ], [ %_96.0, %bb41 ], [ %314, %bb130 ], [ %320, %bb69 ], [ %317, %bb71 ]
  %_0.sroa.17.1.ph = extractvalue { i64, ptr } %.pn249.pn, 1
  br label %bb99

bb95:                                             ; preds = %bb137, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit4.i167", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i6.i169"
  %_0.sroa.17.4 = phi ptr [ %_343.1, %bb137 ], [ %_366.1, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit4.i167" ], [ %_366.1, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i6.i169" ]
  %_0.sroa.0.4 = phi i64 [ %_343.0, %bb137 ], [ %_366.0, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit4.i167" ], [ %_366.0, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i6.i169" ]
  call void @llvm.lifetime.end.p0(i64 328, ptr nonnull %event)
  br label %bb98

bb99:                                             ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit80", %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit119", %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit87", %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit73", %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit", %bb95.thread244
  %_0.sroa.0.6237 = phi i64 [ %_0.sroa.0.1.ph, %bb95.thread244 ], [ %_26.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit73" ], [ %_13.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit" ], [ %_38.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit80" ], [ %_85.sroa.0.1.ph, %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread ], [ %_71.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit119" ], [ %_56.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit87" ]
  %_0.sroa.17.6236 = phi ptr [ %_0.sroa.17.1.ph, %bb95.thread244 ], [ %_26.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit73" ], [ %_13.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit" ], [ %_38.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit80" ], [ %_85.sroa.16.1.ph, %_ZN14pump_recovered9create_v225initialize_quote_accounts17h55a29af9768e49fcE.exit.thread ], [ %_71.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit119" ], [ %_56.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit87" ]
  %_1.val.i172 = load i64, ptr %uri, align 8, !alias.scope !6126, !noundef !2
  %392 = icmp eq i64 %_1.val.i172, 0
  br i1 %392, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i173"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i173": ; preds = %bb99
  %393 = getelementptr inbounds i8, ptr %uri, i64 8
  %_1.val1.i = load ptr, ptr %393, align 8, !alias.scope !6126
  %394 = icmp ne ptr %_1.val1.i, null
  call void @llvm.assume(i1 %394)
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit": ; preds = %bb99, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i173"
  %_1.val.i174 = load i64, ptr %symbol, align 8, !alias.scope !6129, !noundef !2
  %395 = icmp eq i64 %_1.val.i174, 0
  br i1 %395, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit177", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i175"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i175": ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit"
  %396 = getelementptr inbounds i8, ptr %symbol, i64 8
  %_1.val1.i176 = load ptr, ptr %396, align 8, !alias.scope !6129
  %397 = icmp ne ptr %_1.val1.i176, null
  call void @llvm.assume(i1 %397)
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit177"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit177": ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i175"
  %_1.val.i178 = load i64, ptr %name, align 8, !alias.scope !6132, !noundef !2
  %398 = icmp eq i64 %_1.val.i178, 0
  br i1 %398, label %bb98, label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i179"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i179": ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h36d8e4095db7ad83E.exit177"
  %399 = getelementptr inbounds i8, ptr %name, i64 8
  %_1.val1.i180 = load ptr, ptr %399, align 8, !alias.scope !6132
  %400 = icmp ne ptr %_1.val1.i180, null
  call void @llvm.assume(i1 %400)
  br label %bb98
}
