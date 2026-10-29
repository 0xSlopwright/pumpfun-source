define hidden { i64, ptr } @_ZN14pump_recovered9admin_cto7execute17h3bd6d7f34f2e30d7E(ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %ctx, i8 noundef %0, i64 noundef %1, i64 %2, ptr noalias nocapture noundef readonly align 1 dereferenceable(33) %new) unnamed_addr #1 {
start:
  %_11.i342 = alloca [0 x i8], align 1
  %formatter.i343 = alloca [64 x i8], align 8
  %buf.i344 = alloca [24 x i8], align 8
  %formatter.i336 = alloca [64 x i8], align 8
  %buf.i337 = alloca [24 x i8], align 8
  %formatter.i329 = alloca [64 x i8], align 8
  %buf.i330 = alloca [24 x i8], align 8
  %formatter.i322 = alloca [64 x i8], align 8
  %buf.i323 = alloca [24 x i8], align 8
  %formatter.i = alloca [64 x i8], align 8
  %buf.i = alloca [24 x i8], align 8
  %_1057 = alloca [24 x i8], align 8
  %_983 = alloca [24 x i8], align 8
  %_623 = alloca [1 x i8], align 1
  %_619 = alloca [32 x i8], align 8
  %_616 = alloca [16 x i8], align 8
  %_613 = alloca [48 x i8], align 8
  %_609 = alloca [24 x i8], align 8
  %_601 = alloca [24 x i8], align 8
  %ix33 = alloca [80 x i8], align 8
  %_594 = alloca [48 x i8], align 8
  %ix_data32 = alloca [24 x i8], align 8
  %inner_data31 = alloca [24 x i8], align 8
  %authority_info30 = alloca [48 x i8], align 8
  %_586 = alloca [200 x i8], align 8
  %_584 = alloca [24 x i8], align 8
  %_582 = alloca [16 x i8], align 8
  %_566 = alloca [48 x i8], align 8
  %e28 = alloca [200 x i8], align 8
  %_559 = alloca [424 x i8], align 8
  %_556 = alloca [16 x i8], align 8
  %cpi_accounts26 = alloca [336 x i8], align 8
  %_529 = alloca [33 x i8], align 1
  %_528 = alloca [16 x i8], align 8
  %_525 = alloca [424 x i8], align 8
  %val21.sroa.6 = alloca [32 x i8], align 1
  %_498 = alloca [48 x i8], align 8
  %pb = alloca [1 x i8], align 1
  %_492 = alloca [472 x i8], align 8
  %cpi_accounts = alloca [384 x i8], align 8
  %_476 = alloca [1 x i8], align 1
  %_472 = alloca [32 x i8], align 8
  %_469 = alloca [16 x i8], align 8
  %_466 = alloca [48 x i8], align 8
  %_462 = alloca [24 x i8], align 8
  %_454 = alloca [24 x i8], align 8
  %ix = alloca [80 x i8], align 8
  %_447 = alloca [48 x i8], align 8
  %ix_data = alloca [24 x i8], align 8
  %inner_data = alloca [24 x i8], align 8
  %authority_info = alloca [48 x i8], align 8
  %_439 = alloca [80 x i8], align 8
  %_437 = alloca [24 x i8], align 8
  %_435 = alloca [16 x i8], align 8
  %_429 = alloca [48 x i8], align 8
  %e = alloca [80 x i8], align 8
  %val17.sroa.6 = alloca [24 x i8], align 8
  %_412 = alloca [48 x i8], align 8
  %_400 = alloca [288 x i8], align 8
  %_398 = alloca [376 x i8], align 8
  %_392 = alloca [16 x i8], align 8
  %_386 = alloca [16 x i8], align 8
  %_376 = alloca [32 x i8], align 1
  %_370 = alloca [16 x i8], align 8
  %_349 = alloca [288 x i8], align 8
  %_347 = alloca [376 x i8], align 8
  %_343 = alloca [16 x i8], align 8
  %_322 = alloca [48 x i8], align 8
  %bump = alloca [1 x i8], align 1
  %_310 = alloca [160 x i8], align 8
  %_305 = alloca [16 x i8], align 8
  %_300 = alloca [16 x i8], align 8
  %_291 = alloca [32 x i8], align 8
  %_290.sroa.5 = alloca [24 x i8], align 8
  %_289 = alloca [24 x i8], align 8
  %_286 = alloca [32 x i8], align 1
  %_259.sroa.16.sroa.11 = alloca [5 x i8], align 1
  %_259.sroa.17.sroa.11 = alloca [5 x i8], align 1
  %_259.sroa.18.sroa.11 = alloca [5 x i8], align 1
  %_259.sroa.19.sroa.11 = alloca [5 x i8], align 1
  %_259.sroa.20.sroa.11 = alloca [5 x i8], align 1
  %_259.sroa.21.sroa.11 = alloca [5 x i8], align 1
  %_259.sroa.22.sroa.11 = alloca [5 x i8], align 1
  %_257.sroa.11 = alloca [5 x i8], align 1
  %_256 = alloca [664 x i8], align 8
  %_244 = alloca [160 x i8], align 8
  %_239 = alloca [16 x i8], align 8
  %_234 = alloca [16 x i8], align 8
  %_230 = alloca [64 x i8], align 1
  %_223 = alloca [160 x i8], align 8
  %_220 = alloca [32 x i8], align 1
  %_216 = alloca [32 x i8], align 8
  %_213 = alloca [33 x i8], align 1
  %dest = alloca [32 x i8], align 1
  %_200 = alloca [32 x i8], align 1
  %_194 = alloca [16 x i8], align 8
  %_183 = alloca [160 x i8], align 8
  %_178 = alloca [32 x i8], align 1
  %_175 = alloca [32 x i8], align 1
  %_162 = alloca [160 x i8], align 8
  %_146 = alloca [160 x i8], align 8
  %_134 = alloca [160 x i8], align 8
  %_124 = alloca [160 x i8], align 8
  %_114 = alloca [160 x i8], align 8
  %_107 = alloca [32 x i8], align 1
  %_98 = alloca [160 x i8], align 8
  %_96 = alloca [32 x i8], align 1
  %_90 = alloca [64 x i8], align 1
  %_83 = alloca [24 x i8], align 8
  %_82 = alloca [160 x i8], align 8
  %_79 = alloca [32 x i8], align 1
  %target = alloca [32 x i8], align 1
  %_69 = alloca [24 x i8], align 8
  %_68 = alloca [160 x i8], align 8
  %_59 = alloca [24 x i8], align 8
  %_58 = alloca [160 x i8], align 8
  %_52 = alloca [32 x i8], align 8
  %_49 = alloca [33 x i8], align 1
  %holder_key = alloca [32 x i8], align 1
  %mint = alloca [32 x i8], align 1
  %old = alloca [32 x i8], align 1
  %_34 = alloca [160 x i8], align 8
  %_22 = alloca [24 x i8], align 8
  %_21 = alloca [160 x i8], align 8
  %_10 = alloca [24 x i8], align 8
  %_9 = alloca [160 x i8], align 8
  %3 = getelementptr inbounds i8, ptr %ctx, i64 8
  %_630 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %4 = getelementptr inbounds i8, ptr %_630, i64 56
  %_631 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %5 = getelementptr inbounds i8, ptr %_631, i64 112
  %old_fee = load i64, ptr %5, align 8, !noundef !2
  %6 = getelementptr inbounds i8, ptr %_631, i64 162
  %7 = load i8, ptr %6, align 2, !range !374, !noundef !2
  %_7.not = icmp eq i8 %7, 0
  br i1 %_7.not, label %bb5, label %bb1

bb5:                                              ; preds = %start
  %8 = getelementptr inbounds i8, ptr %_631, i64 165
  %9 = load i8, ptr %8, align 1, !range !374, !noundef !2
  %_17.not = icmp eq i8 %9, 0
  %10 = and i8 %0, -3
  %_0.sroa.0.0.off0.i.not = icmp eq i8 %10, 0
  br i1 %_17.not, label %bb12, label %bb6

bb1:                                              ; preds = %start
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_9)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_10)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_10, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_eb4f91695bc6f999067c65f428fcc4d8) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i342)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i), !noalias !6135
  store i64 0, ptr %buf.i, align 8, !noalias !6135
  %_9.sroa.4.0.buf.sroa_idx.i = getelementptr inbounds i8, ptr %buf.i, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i, align 8, !noalias !6135
  %_9.sroa.5.0.buf.sroa_idx.i = getelementptr inbounds i8, ptr %buf.i, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i, align 8, !noalias !6135
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i), !noalias !6135
  %11 = getelementptr inbounds i8, ptr %formatter.i, i64 52
  store i32 0, ptr %11, align 4, !noalias !6135
  %12 = getelementptr inbounds i8, ptr %formatter.i, i64 48
  store i32 32, ptr %12, align 8, !noalias !6135
  %13 = getelementptr inbounds i8, ptr %formatter.i, i64 56
  store i8 3, ptr %13, align 8, !noalias !6135
  store i64 0, ptr %formatter.i, align 8, !noalias !6135
  %14 = getelementptr inbounds i8, ptr %formatter.i, i64 16
  store i64 0, ptr %14, align 8, !noalias !6135
  %15 = getelementptr inbounds i8, ptr %formatter.i, i64 32
  store ptr %buf.i, ptr %15, align 8, !noalias !6135
  %16 = getelementptr inbounds i8, ptr %formatter.i, i64 40
  store ptr @vtable.4, ptr %16, align 8, !noalias !6135
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %17 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hbf6a90ed7cf777ebE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_eb4f91695bc6f999067c65f428fcc4d8, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i) #28, !noalias !6139
  br i1 %17, label %bb3.i, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit"

bb3.i:                                            ; preds = %bb1
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i342, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !6135
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit": ; preds = %bb1
  %18 = getelementptr inbounds i8, ptr %_9, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %18, ptr noundef nonnull align 8 dereferenceable(24) %buf.i, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i), !noalias !6135
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i), !noalias !6135
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i342)
  %19 = getelementptr inbounds i8, ptr %_9, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %19, ptr noundef nonnull align 8 dereferenceable(24) %_10, i64 24, i1 false)
  %20 = getelementptr inbounds i8, ptr %_9, i64 152
  store i32 6088, ptr %20, align 8
  store i64 0, ptr %_9, align 8
  %_13.sroa.4.0._9.sroa_idx = getelementptr inbounds i8, ptr %_9, i64 8
  store ptr @alloc_ebe040a358b3132776a16f34a7b7aa5b, ptr %_13.sroa.4.0._9.sroa_idx, align 8
  %_13.sroa.4.sroa.4.0._13.sroa.4.0._9.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_9, i64 16
  store i64 38, ptr %_13.sroa.4.sroa.4.0._13.sroa.4.0._9.sroa_idx.sroa_idx, align 8
  %_13.sroa.4.sroa.5.0._13.sroa.4.0._9.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_9, i64 24
  store i32 284, ptr %_13.sroa.4.sroa.5.0._13.sroa.4.0._9.sroa_idx.sroa_idx, align 8
  %21 = getelementptr inbounds i8, ptr %_9, i64 80
  store i8 2, ptr %21, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_10)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %22 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_9) #28
  %_8.0 = extractvalue { i64, ptr } %22, 0
  %_8.1 = extractvalue { i64, ptr } %22, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_9)
  br label %bb288

bb12:                                             ; preds = %bb5
  br i1 %_0.sroa.0.0.off0.i.not, label %bb21, label %bb15

bb6:                                              ; preds = %bb5
  br i1 %_0.sroa.0.0.off0.i.not, label %bb7, label %bb21

bb7:                                              ; preds = %bb6
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_21)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_22)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_22, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_8f95cb73e89711d65e95d13598508b19) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i342)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i323), !noalias !6140
  store i64 0, ptr %buf.i323, align 8, !noalias !6140
  %_9.sroa.4.0.buf.sroa_idx.i324 = getelementptr inbounds i8, ptr %buf.i323, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i324, align 8, !noalias !6140
  %_9.sroa.5.0.buf.sroa_idx.i325 = getelementptr inbounds i8, ptr %buf.i323, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i325, align 8, !noalias !6140
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i322), !noalias !6140
  %23 = getelementptr inbounds i8, ptr %formatter.i322, i64 52
  store i32 0, ptr %23, align 4, !noalias !6140
  %24 = getelementptr inbounds i8, ptr %formatter.i322, i64 48
  store i32 32, ptr %24, align 8, !noalias !6140
  %25 = getelementptr inbounds i8, ptr %formatter.i322, i64 56
  store i8 3, ptr %25, align 8, !noalias !6140
  store i64 0, ptr %formatter.i322, align 8, !noalias !6140
  %26 = getelementptr inbounds i8, ptr %formatter.i322, i64 16
  store i64 0, ptr %26, align 8, !noalias !6140
  %27 = getelementptr inbounds i8, ptr %formatter.i322, i64 32
  store ptr %buf.i323, ptr %27, align 8, !noalias !6140
  %28 = getelementptr inbounds i8, ptr %formatter.i322, i64 40
  store ptr @vtable.4, ptr %28, align 8, !noalias !6140
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %29 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hbf6a90ed7cf777ebE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_8f95cb73e89711d65e95d13598508b19, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i322) #28, !noalias !6144
  br i1 %29, label %bb3.i326, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit327"

bb3.i326:                                         ; preds = %bb7
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i342, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !6140
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit327": ; preds = %bb7
  %30 = getelementptr inbounds i8, ptr %_21, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %30, ptr noundef nonnull align 8 dereferenceable(24) %buf.i323, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i322), !noalias !6140
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i323), !noalias !6140
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i342)
  %31 = getelementptr inbounds i8, ptr %_21, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %31, ptr noundef nonnull align 8 dereferenceable(24) %_22, i64 24, i1 false)
  %32 = getelementptr inbounds i8, ptr %_21, i64 152
  store i32 6083, ptr %32, align 8
  store i64 0, ptr %_21, align 8
  %_25.sroa.4.0._21.sroa_idx = getelementptr inbounds i8, ptr %_21, i64 8
  store ptr @alloc_ebe040a358b3132776a16f34a7b7aa5b, ptr %_25.sroa.4.0._21.sroa_idx, align 8
  %_25.sroa.4.sroa.4.0._25.sroa.4.0._21.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_21, i64 16
  store i64 38, ptr %_25.sroa.4.sroa.4.0._25.sroa.4.0._21.sroa_idx.sroa_idx, align 8
  %_25.sroa.4.sroa.5.0._25.sroa.4.0._21.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_21, i64 24
  store i32 289, ptr %_25.sroa.4.sroa.5.0._25.sroa.4.0._21.sroa_idx.sroa_idx, align 8
  %33 = getelementptr inbounds i8, ptr %_21, i64 80
  store i8 2, ptr %33, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_22)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %34 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_21) #28
  %_20.0 = extractvalue { i64, ptr } %34, 0
  %_20.1 = extractvalue { i64, ptr } %34, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_21)
  br label %bb288

bb21:                                             ; preds = %bb6, %bb12, %bb15
  %35 = icmp eq i8 %0, 2
  br i1 %35, label %bb22, label %bb296

bb15:                                             ; preds = %bb12
  %36 = getelementptr inbounds i8, ptr %_630, i64 8
  %_639 = load ptr, ptr %36, align 8, !nonnull !2, !align !3, !noundef !2
  %37 = getelementptr inbounds i8, ptr %_639, i64 1087
  %38 = load i8, ptr %37, align 1, !range !374, !noundef !2
  %_32.not = icmp eq i8 %38, 0
  br i1 %_32.not, label %bb16, label %bb21

bb16:                                             ; preds = %bb15
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_34)
  %39 = getelementptr inbounds i8, ptr %_34, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %39, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_f94f166953c814e4161e699857179a1e) #28
  %40 = getelementptr inbounds i8, ptr %_34, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %40, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_f94f166953c814e4161e699857179a1e) #28
  %41 = getelementptr inbounds i8, ptr %_34, i64 152
  store i32 6084, ptr %41, align 8
  store i64 0, ptr %_34, align 8
  %_38.sroa.4.0._34.sroa_idx = getelementptr inbounds i8, ptr %_34, i64 8
  store ptr @alloc_ebe040a358b3132776a16f34a7b7aa5b, ptr %_38.sroa.4.0._34.sroa_idx, align 8
  %_38.sroa.4.sroa.4.0._38.sroa.4.0._34.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_34, i64 16
  store i64 38, ptr %_38.sroa.4.sroa.4.0._38.sroa.4.0._34.sroa_idx.sroa_idx, align 8
  %_38.sroa.4.sroa.5.0._38.sroa.4.0._34.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_34, i64 24
  store i32 296, ptr %_38.sroa.4.sroa.5.0._38.sroa.4.0._34.sroa_idx.sroa_idx, align 8
  %42 = getelementptr inbounds i8, ptr %_34, i64 80
  store i8 2, ptr %42, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %43 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_34) #28
  %_33.0 = extractvalue { i64, ptr } %43, 0
  %_33.1 = extractvalue { i64, ptr } %43, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_34)
  br label %bb288

bb296:                                            ; preds = %bb21
  %44 = and i8 %0, 1
  %_812.not = icmp eq i8 %44, 0
  %extract.t158 = icmp ne i8 %44, 0
  br i1 %_812.not, label %bb22, label %bb24

bb22:                                             ; preds = %bb21, %bb296
  %holder1.sroa.0.0.off0 = phi i1 [ %extract.t158, %bb296 ], [ false, %bb21 ]
  %45 = getelementptr inbounds i8, ptr %_631, i64 163
  %46 = load i8, ptr %45, align 1, !range !374, !noundef !2
  %extract.t = icmp ne i8 %46, 0
  br label %bb24

bb24:                                             ; preds = %bb296, %bb22
  %cashback.sroa.0.0.off0 = phi i1 [ %extract.t, %bb22 ], [ false, %bb296 ]
  %holder1.sroa.0.1.off0 = phi i1 [ %holder1.sroa.0.0.off0, %bb22 ], [ true, %bb296 ]
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %old)
  %47 = getelementptr inbounds i8, ptr %_630, i64 168
  %_813 = load ptr, ptr %47, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %old, ptr noundef nonnull align 1 dereferenceable(32) %_813, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %mint)
  %48 = getelementptr inbounds i8, ptr %_630, i64 16
  %_814 = load ptr, ptr %48, align 8, !nonnull !2, !align !3, !noundef !2
  %_815 = load ptr, ptr %_814, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %mint, ptr noundef nonnull align 1 dereferenceable(32) %_815, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 33, ptr nonnull %_49)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_52)
  store ptr @alloc_df68464402562fbf659e5577c3ed192b, ptr %_52, align 8
  %49 = getelementptr inbounds i8, ptr %_52, i64 8
  store i64 14, ptr %49, align 8
  %50 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_52, i64 0, i64 1
  store ptr %mint, ptr %50, align 8
  %51 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_52, i64 0, i64 1, i32 1
  store i64 32, ptr %51, align 8
; call solana_pubkey::Pubkey::find_program_address
  call void @_ZN13solana_pubkey6Pubkey20find_program_address17h57945082f260e69dE(ptr noalias nocapture noundef nonnull sret([33 x i8]) align 1 dereferenceable(33) %_49, ptr noalias noundef nonnull readonly align 8 %_52, i64 noundef 2, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) @_ZN14pump_recovered2ID17h8e245cf89cf2c06bE) #28
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %holder_key)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %holder_key, ptr noundef nonnull align 1 dereferenceable(32) %_49, i64 32, i1 false)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_52)
  call void @llvm.lifetime.end.p0(i64 33, ptr nonnull %_49)
  %52 = load i8, ptr %new, align 1, !range !374, !noundef !2
  %trunc.not.not = icmp eq i8 %52, 0
  br i1 %holder1.sroa.0.1.off0, label %bb26, label %bb31

bb26:                                             ; preds = %bb24
  br i1 %trunc.not.not, label %bb38, label %bb298

bb298:                                            ; preds = %bb26
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_58)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_59)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_59, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_b5f839a6bda937f2cae73e49fc88071f) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i342)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i330), !noalias !6145
  store i64 0, ptr %buf.i330, align 8, !noalias !6145
  %_9.sroa.4.0.buf.sroa_idx.i331 = getelementptr inbounds i8, ptr %buf.i330, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i331, align 8, !noalias !6145
  %_9.sroa.5.0.buf.sroa_idx.i332 = getelementptr inbounds i8, ptr %buf.i330, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i332, align 8, !noalias !6145
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i329), !noalias !6145
  %53 = getelementptr inbounds i8, ptr %formatter.i329, i64 52
  store i32 0, ptr %53, align 4, !noalias !6145
  %54 = getelementptr inbounds i8, ptr %formatter.i329, i64 48
  store i32 32, ptr %54, align 8, !noalias !6145
  %55 = getelementptr inbounds i8, ptr %formatter.i329, i64 56
  store i8 3, ptr %55, align 8, !noalias !6145
  store i64 0, ptr %formatter.i329, align 8, !noalias !6145
  %56 = getelementptr inbounds i8, ptr %formatter.i329, i64 16
  store i64 0, ptr %56, align 8, !noalias !6145
  %57 = getelementptr inbounds i8, ptr %formatter.i329, i64 32
  store ptr %buf.i330, ptr %57, align 8, !noalias !6145
  %58 = getelementptr inbounds i8, ptr %formatter.i329, i64 40
  store ptr @vtable.4, ptr %58, align 8, !noalias !6145
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %59 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hbf6a90ed7cf777ebE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_b5f839a6bda937f2cae73e49fc88071f, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i329) #28, !noalias !6149
  br i1 %59, label %bb3.i333, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit334"

bb3.i333:                                         ; preds = %bb298
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i342, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !6145
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit334": ; preds = %bb298
  %60 = getelementptr inbounds i8, ptr %_58, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %60, ptr noundef nonnull align 8 dereferenceable(24) %buf.i330, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i329), !noalias !6145
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i330), !noalias !6145
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i342)
  %61 = getelementptr inbounds i8, ptr %_58, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %61, ptr noundef nonnull align 8 dereferenceable(24) %_59, i64 24, i1 false)
  %62 = getelementptr inbounds i8, ptr %_58, i64 152
  store i32 6090, ptr %62, align 8
  store i64 0, ptr %_58, align 8
  %_62.sroa.4.0._58.sroa_idx = getelementptr inbounds i8, ptr %_58, i64 8
  store ptr @alloc_ebe040a358b3132776a16f34a7b7aa5b, ptr %_62.sroa.4.0._58.sroa_idx, align 8
  %_62.sroa.4.sroa.4.0._62.sroa.4.0._58.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_58, i64 16
  store i64 38, ptr %_62.sroa.4.sroa.4.0._62.sroa.4.0._58.sroa_idx.sroa_idx, align 8
  %_62.sroa.4.sroa.5.0._62.sroa.4.0._58.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_58, i64 24
  store i32 298, ptr %_62.sroa.4.sroa.5.0._62.sroa.4.0._58.sroa_idx.sroa_idx, align 8
  %63 = getelementptr inbounds i8, ptr %_58, i64 80
  store i8 2, ptr %63, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_59)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %64 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_58) #28
  %_57.0 = extractvalue { i64, ptr } %64, 0
  %_57.1 = extractvalue { i64, ptr } %64, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_58)
  br label %bb286

bb286:                                            ; preds = %bb272, %bb389, %bb48, %bb68, %bb74, %bb63, %bb58, %bb83, %bb326, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit348", %bb97, %bb268, %bb281, %bb376, %bb378, %bb387, %bb409, %bb335, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit341", %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit334"
  %_0.sroa.41.0 = phi ptr [ %_67.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit341" ], [ %_57.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit334" ], [ %_80.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit348" ], [ %_161.1, %bb83 ], [ %140, %bb326 ], [ %_113.1, %bb58 ], [ %_123.1, %bb63 ], [ %_145.1, %bb74 ], [ %_133.1, %bb68 ], [ %_97.1, %bb48 ], [ %_182.1, %bb97 ], [ %_859.1, %bb335 ], [ %_0.sroa.41.14, %bb281 ], [ %_0.sroa.41.13, %bb268 ], [ %_949.1, %bb376 ], [ %529, %bb409 ], [ %446, %bb387 ], [ %_954.1, %bb378 ], [ %_972.1, %bb389 ], [ %_0.sroa.41.6, %bb272 ]
  %_0.sroa.0.0 = phi i64 [ %_67.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit341" ], [ %_57.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit334" ], [ %_80.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit348" ], [ %_161.0, %bb83 ], [ %136, %bb326 ], [ %_113.0, %bb58 ], [ %_123.0, %bb63 ], [ %_145.0, %bb74 ], [ %_133.0, %bb68 ], [ %_97.0, %bb48 ], [ %_182.0, %bb97 ], [ %166, %bb335 ], [ %_0.sroa.0.14, %bb281 ], [ %_0.sroa.0.13, %bb268 ], [ %422, %bb376 ], [ %527, %bb409 ], [ %443, %bb387 ], [ %426, %bb378 ], [ %_972.0, %bb389 ], [ %_0.sroa.0.6, %bb272 ]
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %holder_key)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %mint)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %old)
  br label %bb288

bb31:                                             ; preds = %bb24
  br i1 %trunc.not.not, label %bb300, label %bb304

bb300:                                            ; preds = %bb31
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_68)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_69)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_69, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_1ba5e1e397ae92b788c97e688ac0b362) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i342)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i337), !noalias !6150
  store i64 0, ptr %buf.i337, align 8, !noalias !6150
  %_9.sroa.4.0.buf.sroa_idx.i338 = getelementptr inbounds i8, ptr %buf.i337, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i338, align 8, !noalias !6150
  %_9.sroa.5.0.buf.sroa_idx.i339 = getelementptr inbounds i8, ptr %buf.i337, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i339, align 8, !noalias !6150
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i336), !noalias !6150
  %65 = getelementptr inbounds i8, ptr %formatter.i336, i64 52
  store i32 0, ptr %65, align 4, !noalias !6150
  %66 = getelementptr inbounds i8, ptr %formatter.i336, i64 48
  store i32 32, ptr %66, align 8, !noalias !6150
  %67 = getelementptr inbounds i8, ptr %formatter.i336, i64 56
  store i8 3, ptr %67, align 8, !noalias !6150
  store i64 0, ptr %formatter.i336, align 8, !noalias !6150
  %68 = getelementptr inbounds i8, ptr %formatter.i336, i64 16
  store i64 0, ptr %68, align 8, !noalias !6150
  %69 = getelementptr inbounds i8, ptr %formatter.i336, i64 32
  store ptr %buf.i337, ptr %69, align 8, !noalias !6150
  %70 = getelementptr inbounds i8, ptr %formatter.i336, i64 40
  store ptr @vtable.4, ptr %70, align 8, !noalias !6150
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %71 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hbf6a90ed7cf777ebE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_1ba5e1e397ae92b788c97e688ac0b362, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i336) #28, !noalias !6154
  br i1 %71, label %bb3.i340, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit341"

bb3.i340:                                         ; preds = %bb300
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i342, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !6150
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit341": ; preds = %bb300
  %72 = getelementptr inbounds i8, ptr %_68, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %72, ptr noundef nonnull align 8 dereferenceable(24) %buf.i337, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i336), !noalias !6150
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i337), !noalias !6150
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i342)
  %73 = getelementptr inbounds i8, ptr %_68, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %73, ptr noundef nonnull align 8 dereferenceable(24) %_69, i64 24, i1 false)
  %74 = getelementptr inbounds i8, ptr %_68, i64 152
  store i32 6089, ptr %74, align 8
  store i64 0, ptr %_68, align 8
  %_72.sroa.4.0._68.sroa_idx = getelementptr inbounds i8, ptr %_68, i64 8
  store ptr @alloc_ebe040a358b3132776a16f34a7b7aa5b, ptr %_72.sroa.4.0._68.sroa_idx, align 8
  %_72.sroa.4.sroa.4.0._72.sroa.4.0._68.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_68, i64 16
  store i64 38, ptr %_72.sroa.4.sroa.4.0._72.sroa.4.0._68.sroa_idx.sroa_idx, align 8
  %_72.sroa.4.sroa.5.0._72.sroa.4.0._68.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_68, i64 24
  store i32 306, ptr %_72.sroa.4.sroa.5.0._72.sroa.4.0._68.sroa_idx.sroa_idx, align 8
  %75 = getelementptr inbounds i8, ptr %_68, i64 80
  store i8 2, ptr %75, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_69)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %76 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_68) #28
  %_67.0 = extractvalue { i64, ptr } %76, 0
  %_67.1 = extractvalue { i64, ptr } %76, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_68)
  br label %bb286

bb304:                                            ; preds = %bb31
  %77 = getelementptr inbounds i8, ptr %new, i64 1
  br label %bb38

bb38:                                             ; preds = %bb26, %bb304
  %holder_key.sink = phi ptr [ %77, %bb304 ], [ %holder_key, %bb26 ]
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %target, ptr noundef nonnull align 1 dereferenceable(32) %holder_key.sink, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_79)
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_79, i8 0, i64 32, i1 false)
  %78 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %target, ptr noundef nonnull dereferenceable(32) %_79, i64 32)
  %79 = icmp eq i32 %78, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_79)
  br i1 %79, label %bb39, label %bb44

bb44:                                             ; preds = %bb38
  br i1 %holder1.sroa.0.1.off0, label %bb53, label %bb45

bb39:                                             ; preds = %bb38
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_82)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_83)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_83, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_0e3505805f4905816c1bd644811a7869) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i342)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i344), !noalias !6155
  store i64 0, ptr %buf.i344, align 8, !noalias !6155
  %_9.sroa.4.0.buf.sroa_idx.i345 = getelementptr inbounds i8, ptr %buf.i344, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i345, align 8, !noalias !6155
  %_9.sroa.5.0.buf.sroa_idx.i346 = getelementptr inbounds i8, ptr %buf.i344, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i346, align 8, !noalias !6155
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i343), !noalias !6155
  %80 = getelementptr inbounds i8, ptr %formatter.i343, i64 52
  store i32 0, ptr %80, align 4, !noalias !6155
  %81 = getelementptr inbounds i8, ptr %formatter.i343, i64 48
  store i32 32, ptr %81, align 8, !noalias !6155
  %82 = getelementptr inbounds i8, ptr %formatter.i343, i64 56
  store i8 3, ptr %82, align 8, !noalias !6155
  store i64 0, ptr %formatter.i343, align 8, !noalias !6155
  %83 = getelementptr inbounds i8, ptr %formatter.i343, i64 16
  store i64 0, ptr %83, align 8, !noalias !6155
  %84 = getelementptr inbounds i8, ptr %formatter.i343, i64 32
  store ptr %buf.i344, ptr %84, align 8, !noalias !6155
  %85 = getelementptr inbounds i8, ptr %formatter.i343, i64 40
  store ptr @vtable.4, ptr %85, align 8, !noalias !6155
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %86 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hbf6a90ed7cf777ebE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_0e3505805f4905816c1bd644811a7869, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i343) #28, !noalias !6159
  br i1 %86, label %bb3.i347, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit348"

bb3.i347:                                         ; preds = %bb39
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i342, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !6155
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit348": ; preds = %bb39
  %87 = getelementptr inbounds i8, ptr %_82, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %87, ptr noundef nonnull align 8 dereferenceable(24) %buf.i344, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i343), !noalias !6155
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i344), !noalias !6155
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i342)
  %88 = getelementptr inbounds i8, ptr %_82, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %88, ptr noundef nonnull align 8 dereferenceable(24) %_83, i64 24, i1 false)
  %89 = getelementptr inbounds i8, ptr %_82, i64 152
  store i32 6030, ptr %89, align 8
  store i64 0, ptr %_82, align 8
  %_86.sroa.4.0._82.sroa_idx = getelementptr inbounds i8, ptr %_82, i64 8
  store ptr @alloc_ebe040a358b3132776a16f34a7b7aa5b, ptr %_86.sroa.4.0._82.sroa_idx, align 8
  %_86.sroa.4.sroa.4.0._86.sroa.4.0._82.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_82, i64 16
  store i64 38, ptr %_86.sroa.4.sroa.4.0._86.sroa.4.0._82.sroa_idx.sroa_idx, align 8
  %_86.sroa.4.sroa.5.0._86.sroa.4.0._82.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_82, i64 24
  store i32 307, ptr %_86.sroa.4.sroa.5.0._86.sroa.4.0._82.sroa_idx.sroa_idx, align 8
  %90 = getelementptr inbounds i8, ptr %_82, i64 80
  store i8 2, ptr %90, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_83)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %91 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_82) #28
  %_81.0 = extractvalue { i64, ptr } %91, 0
  %_81.1 = extractvalue { i64, ptr } %91, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_82)
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %_90)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_90, ptr noundef nonnull align 1 dereferenceable(32) %target, i64 32, i1 false)
  %92 = getelementptr inbounds i8, ptr %_90, i64 32
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %92, i8 0, i64 32, i1 false)
; call anchor_lang::error::Error::with_pubkeys
  %93 = call { i64, ptr } @_ZN11anchor_lang5error5Error12with_pubkeys17hca6dbbbe6a9a5da7E(i64 noundef %_81.0, ptr noundef %_81.1, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(64) %_90) #28
  %_80.0 = extractvalue { i64, ptr } %93, 0
  %_80.1 = extractvalue { i64, ptr } %93, 1
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %_90)
  br label %bb286

bb45:                                             ; preds = %bb44
  %94 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %target, ptr noundef nonnull dereferenceable(32) %holder_key, i64 32)
  %95 = icmp eq i32 %94, 0
  br i1 %95, label %bb48, label %bb46

bb53:                                             ; preds = %bb46, %bb44
  %switch196 = icmp eq i64 %1, 1
  %_658.pre = load ptr, ptr %4, align 8
  br i1 %switch196, label %bb313, label %bb79

bb46:                                             ; preds = %bb45
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_96)
  %96 = getelementptr inbounds i8, ptr %_630, i64 144
  %_827 = load ptr, ptr %96, align 8, !nonnull !2, !align !3, !noundef !2
  %_828 = load ptr, ptr %_827, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_96, ptr noundef nonnull align 1 dereferenceable(32) %_828, i64 32, i1 false)
  %97 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %target, ptr noundef nonnull dereferenceable(32) %_96, i64 32)
  %98 = icmp eq i32 %97, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_96)
  br i1 %98, label %bb48, label %bb53

bb48:                                             ; preds = %bb46, %bb45
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_98)
  %99 = getelementptr inbounds i8, ptr %_98, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %99, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_861c8964bbad6d9cede9df277e628fe9) #28
  %100 = getelementptr inbounds i8, ptr %_98, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %100, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_861c8964bbad6d9cede9df277e628fe9) #28
  %101 = getelementptr inbounds i8, ptr %_98, i64 152
  store i32 6019, ptr %101, align 8
  store i64 0, ptr %_98, align 8
  %_102.sroa.4.0._98.sroa_idx = getelementptr inbounds i8, ptr %_98, i64 8
  store ptr @alloc_ebe040a358b3132776a16f34a7b7aa5b, ptr %_102.sroa.4.0._98.sroa_idx, align 8
  %_102.sroa.4.sroa.4.0._102.sroa.4.0._98.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_98, i64 16
  store i64 38, ptr %_102.sroa.4.sroa.4.0._102.sroa.4.0._98.sroa_idx.sroa_idx, align 8
  %_102.sroa.4.sroa.5.0._102.sroa.4.0._98.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_98, i64 24
  store i32 312, ptr %_102.sroa.4.sroa.5.0._102.sroa.4.0._98.sroa_idx.sroa_idx, align 8
  %102 = getelementptr inbounds i8, ptr %_98, i64 80
  store i8 2, ptr %102, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %103 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_98) #28
  %_97.0 = extractvalue { i64, ptr } %103, 0
  %_97.1 = extractvalue { i64, ptr } %103, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_98)
  br label %bb286

bb313:                                            ; preds = %bb53
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_107)
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_107, i8 0, i64 32, i1 false)
  %_833 = getelementptr inbounds i8, ptr %_658.pre, i64 40
  %104 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_833, ptr noundef nonnull dereferenceable(32) %_107, i64 32)
  %105 = icmp eq i32 %104, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_107)
  br i1 %105, label %bb58, label %bb55

bb55:                                             ; preds = %bb313
  %106 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_833, ptr noundef nonnull dereferenceable(32) @alloc_e953c1d75e6a4349f2dca6892c168ab2, i64 32)
  %107 = icmp eq i32 %106, 0
  br i1 %107, label %bb58, label %bb56

bb56:                                             ; preds = %bb55
  %108 = getelementptr inbounds i8, ptr %_630, i64 8
  %_650 = load ptr, ptr %108, align 8, !nonnull !2, !align !3, !noundef !2
  %_13.i.i2.i.i.ptr = getelementptr inbounds i8, ptr %_650, i64 936
  %109 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_13.i.i2.i.i.ptr, ptr noundef nonnull dereferenceable(32) %_833, i64 32), !alias.scope !6160, !noalias !6167
  %110 = icmp eq i32 %109, 0
  br i1 %110, label %bb58, label %bb320

bb58:                                             ; preds = %bb56, %bb313, %bb55
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_114)
  %111 = getelementptr inbounds i8, ptr %_114, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %111, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e75cefee4bb91125af0ea8444b842ed0) #28
  %112 = getelementptr inbounds i8, ptr %_114, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %112, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e75cefee4bb91125af0ea8444b842ed0) #28
  %113 = getelementptr inbounds i8, ptr %_114, i64 152
  store i32 6091, ptr %113, align 8
  store i64 0, ptr %_114, align 8
  %_118.sroa.4.0._114.sroa_idx = getelementptr inbounds i8, ptr %_114, i64 8
  store ptr @alloc_ebe040a358b3132776a16f34a7b7aa5b, ptr %_118.sroa.4.0._114.sroa_idx, align 8
  %_118.sroa.4.sroa.4.0._118.sroa.4.0._114.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_114, i64 16
  store i64 38, ptr %_118.sroa.4.sroa.4.0._118.sroa.4.0._114.sroa_idx.sroa_idx, align 8
  %_118.sroa.4.sroa.5.0._118.sroa.4.0._114.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_114, i64 24
  store i32 326, ptr %_118.sroa.4.sroa.5.0._118.sroa.4.0._114.sroa_idx.sroa_idx, align 8
  %114 = getelementptr inbounds i8, ptr %_114, i64 80
  store i8 2, ptr %114, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %115 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_114) #28
  %_113.0 = extractvalue { i64, ptr } %115, 0
  %_113.1 = extractvalue { i64, ptr } %115, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_114)
  br label %bb286

bb320:                                            ; preds = %bb56
  br i1 %cashback.sroa.0.0.off0, label %bb63, label %bb323

bb63:                                             ; preds = %bb320
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_124)
  %116 = getelementptr inbounds i8, ptr %_124, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %116, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_835bb996f1795bf0338da0490417da62) #28
  %117 = getelementptr inbounds i8, ptr %_124, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %117, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_835bb996f1795bf0338da0490417da62) #28
  %118 = getelementptr inbounds i8, ptr %_124, i64 152
  store i32 6080, ptr %118, align 8
  store i64 0, ptr %_124, align 8
  %_128.sroa.4.0._124.sroa_idx = getelementptr inbounds i8, ptr %_124, i64 8
  store ptr @alloc_ebe040a358b3132776a16f34a7b7aa5b, ptr %_128.sroa.4.0._124.sroa_idx, align 8
  %_128.sroa.4.sroa.4.0._128.sroa.4.0._124.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_124, i64 16
  store i64 38, ptr %_128.sroa.4.sroa.4.0._128.sroa.4.0._124.sroa_idx.sroa_idx, align 8
  %_128.sroa.4.sroa.5.0._128.sroa.4.0._124.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_124, i64 24
  store i32 330, ptr %_128.sroa.4.sroa.5.0._128.sroa.4.0._124.sroa_idx.sroa_idx, align 8
  %119 = getelementptr inbounds i8, ptr %_124, i64 80
  store i8 2, ptr %119, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %120 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_124) #28
  %_123.0 = extractvalue { i64, ptr } %120, 0
  %_123.1 = extractvalue { i64, ptr } %120, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_124)
  br label %bb286

bb323:                                            ; preds = %bb320
  %121 = getelementptr inbounds i8, ptr %_650, i64 1086
  %122 = load i8, ptr %121, align 2, !range !374, !noundef !2
  %_132.not = icmp eq i8 %122, 0
  br i1 %_132.not, label %bb68, label %bb437

bb68:                                             ; preds = %bb323
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_134)
  %123 = getelementptr inbounds i8, ptr %_134, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %123, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_01eaaa187d2be542d4425f23ab284310) #28
  %124 = getelementptr inbounds i8, ptr %_134, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %124, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_01eaaa187d2be542d4425f23ab284310) #28
  %125 = getelementptr inbounds i8, ptr %_134, i64 152
  store i32 6077, ptr %125, align 8
  store i64 0, ptr %_134, align 8
  %_138.sroa.4.0._134.sroa_idx = getelementptr inbounds i8, ptr %_134, i64 8
  store ptr @alloc_ebe040a358b3132776a16f34a7b7aa5b, ptr %_138.sroa.4.0._134.sroa_idx, align 8
  %_138.sroa.4.sroa.4.0._138.sroa.4.0._134.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_134, i64 16
  store i64 38, ptr %_138.sroa.4.sroa.4.0._138.sroa.4.0._134.sroa_idx.sroa_idx, align 8
  %_138.sroa.4.sroa.5.0._138.sroa.4.0._134.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_134, i64 24
  store i32 334, ptr %_138.sroa.4.sroa.5.0._138.sroa.4.0._134.sroa_idx.sroa_idx, align 8
  %126 = getelementptr inbounds i8, ptr %_134, i64 80
  store i8 2, ptr %126, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %127 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_134) #28
  %_133.0 = extractvalue { i64, ptr } %127, 0
  %_133.1 = extractvalue { i64, ptr } %127, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_134)
  br label %bb286

bb437:                                            ; preds = %bb323
  %128 = icmp eq i64 %2, 0
  br i1 %128, label %bb74, label %bb72

bb74:                                             ; preds = %bb72, %bb437
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_146)
  %129 = getelementptr inbounds i8, ptr %_146, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %129, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_973adb9e8664e25d4750ddb14e0de56a) #28
  %130 = getelementptr inbounds i8, ptr %_146, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %130, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_973adb9e8664e25d4750ddb14e0de56a) #28
  %131 = getelementptr inbounds i8, ptr %_146, i64 152
  store i32 6078, ptr %131, align 8
  store i64 0, ptr %_146, align 8
  %_150.sroa.4.0._146.sroa_idx = getelementptr inbounds i8, ptr %_146, i64 8
  store ptr @alloc_ebe040a358b3132776a16f34a7b7aa5b, ptr %_150.sroa.4.0._146.sroa_idx, align 8
  %_150.sroa.4.sroa.4.0._150.sroa.4.0._146.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_146, i64 16
  store i64 38, ptr %_150.sroa.4.sroa.4.0._150.sroa.4.0._146.sroa_idx.sroa_idx, align 8
  %_150.sroa.4.sroa.5.0._150.sroa.4.0._146.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_146, i64 24
  store i32 338, ptr %_150.sroa.4.sroa.5.0._150.sroa.4.0._146.sroa_idx.sroa_idx, align 8
  %132 = getelementptr inbounds i8, ptr %_146, i64 80
  store i8 2, ptr %132, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %133 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_146) #28
  %_145.0 = extractvalue { i64, ptr } %133, 0
  %_145.1 = extractvalue { i64, ptr } %133, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_146)
  br label %bb286

bb72:                                             ; preds = %bb437
  %134 = getelementptr inbounds i8, ptr %_650, i64 1072
  %_144 = load i64, ptr %134, align 8, !noundef !2
  %_143 = icmp ult i64 %_144, %2
  br i1 %_143, label %bb74, label %bb79

bb79:                                             ; preds = %bb53, %bb72
  %_157 = getelementptr inbounds i8, ptr %_630, i64 48
; call pump_recovered::trade_types::prepare_bonding_curve
  %135 = call { i64, ptr } @_ZN14pump_recovered11trade_types21prepare_bonding_curve17h5c1479a4239fbcc2E(ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %_658.pre, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_157, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_630) #28
  %136 = extractvalue { i64, ptr } %135, 0
  %137 = icmp eq i64 %136, 2
  br i1 %137, label %bb327, label %bb326

bb327:                                            ; preds = %bb79
  %_662 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %138 = getelementptr inbounds i8, ptr %_662, i64 120
  %_160 = load i64, ptr %138, align 8, !noundef !2
  %139 = icmp eq i64 %_160, 0
  br i1 %139, label %bb82, label %bb83

bb326:                                            ; preds = %bb79
  %140 = extractvalue { i64, ptr } %135, 1
  br label %bb286

bb82:                                             ; preds = %bb327
  %141 = getelementptr inbounds i8, ptr %_630, i64 144
  %_172 = load ptr, ptr %141, align 8, !nonnull !2, !align !3, !noundef !2
  %142 = getelementptr inbounds i8, ptr %_172, i64 24
  %_841 = load ptr, ptr %142, align 8, !nonnull !2, !align !372, !noundef !2
  %143 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_841, ptr noundef nonnull dereferenceable(32) @_ZN14pump_recovered9pump_fees2ID17h48f30a480ea28979E, i64 32)
  %144 = icmp eq i32 %143, 0
  br i1 %144, label %bb87, label %bb91

bb83:                                             ; preds = %bb327
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_162)
  %145 = getelementptr inbounds i8, ptr %_162, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %145, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_8c4fa5903d7de618e7d31a64bef65c37) #28
  %146 = getelementptr inbounds i8, ptr %_162, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %146, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_8c4fa5903d7de618e7d31a64bef65c37) #28
  %147 = getelementptr inbounds i8, ptr %_162, i64 152
  store i32 6095, ptr %147, align 8
  store i64 0, ptr %_162, align 8
  %_166.sroa.4.0._162.sroa_idx = getelementptr inbounds i8, ptr %_162, i64 8
  store ptr @alloc_ebe040a358b3132776a16f34a7b7aa5b, ptr %_166.sroa.4.0._162.sroa_idx, align 8
  %_166.sroa.4.sroa.4.0._166.sroa.4.0._162.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_162, i64 16
  store i64 38, ptr %_166.sroa.4.sroa.4.0._166.sroa.4.0._162.sroa_idx.sroa_idx, align 8
  %_166.sroa.4.sroa.5.0._166.sroa.4.0._162.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_162, i64 24
  store i32 410, ptr %_166.sroa.4.sroa.5.0._166.sroa.4.0._162.sroa_idx.sroa_idx, align 8
  %148 = getelementptr inbounds i8, ptr %_162, i64 80
  store i8 2, ptr %148, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %149 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_162) #28
  %_161.0 = extractvalue { i64, ptr } %149, 0
  %_161.1 = extractvalue { i64, ptr } %149, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_162)
  br label %bb286

bb87:                                             ; preds = %bb82
; call solana_account_info::AccountInfo::data_is_empty
  %_173 = call noundef zeroext i1 @_ZN19solana_account_info11AccountInfo13data_is_empty17h4cbad3bc61143bcfE(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_172) #28
  br i1 %_173, label %bb91, label %bb89

bb89:                                             ; preds = %bb87
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_175)
  %_845 = load ptr, ptr %141, align 8, !nonnull !2, !align !3, !noundef !2
  %_846 = load ptr, ptr %_845, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_175, ptr noundef nonnull align 1 dereferenceable(32) %_846, i64 32, i1 false)
  %150 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %old, ptr noundef nonnull dereferenceable(32) %_175, i64 32)
  %151 = icmp eq i32 %150, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_175)
  br label %bb91

bb91:                                             ; preds = %bb82, %bb87, %bb89
  %shared.sroa.0.0.off0 = phi i1 [ %151, %bb89 ], [ false, %bb87 ], [ false, %bb82 ]
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_178)
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_178, i8 0, i64 32, i1 false)
  %152 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %old, ptr noundef nonnull dereferenceable(32) %_178, i64 32)
  %.not = icmp eq i32 %152, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_178)
  br i1 %.not, label %bb105, label %bb92

bb92:                                             ; preds = %bb91
  %153 = getelementptr inbounds i8, ptr %_630, i64 210
  %154 = load i8, ptr %153, align 2, !range !374, !noundef !2
  %_179.not = icmp eq i8 %154, 0
  br i1 %_179.not, label %bb93, label %bb105

bb93:                                             ; preds = %bb92
  %155 = getelementptr inbounds i8, ptr %_630, i64 192
  %_853 = load ptr, ptr %155, align 8, !nonnull !2, !align !372, !noundef !2
  %156 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_853, ptr noundef nonnull dereferenceable(32) @alloc_6ca8591423d98ecbd315de1d1a6fea68, i64 32)
  %157 = icmp eq i32 %156, 0
  br i1 %157, label %bb96, label %bb105

bb96:                                             ; preds = %bb93
  %158 = getelementptr inbounds i8, ptr %_630, i64 209
  %159 = load i8, ptr %158, align 1, !range !374, !noundef !2
  %_181.not = icmp eq i8 %159, 0
  br i1 %_181.not, label %bb97, label %bb102

bb97:                                             ; preds = %bb96
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_183)
  %160 = getelementptr inbounds i8, ptr %_183, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %160, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_ee8d284dcc9255c78333f4d983077741) #28
  %161 = getelementptr inbounds i8, ptr %_183, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %161, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_ee8d284dcc9255c78333f4d983077741) #28
  %162 = getelementptr inbounds i8, ptr %_183, i64 152
  store i32 6092, ptr %162, align 8
  store i64 0, ptr %_183, align 8
  %_187.sroa.4.0._183.sroa_idx = getelementptr inbounds i8, ptr %_183, i64 8
  store ptr @alloc_ebe040a358b3132776a16f34a7b7aa5b, ptr %_187.sroa.4.0._183.sroa_idx, align 8
  %_187.sroa.4.sroa.4.0._187.sroa.4.0._183.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_183, i64 16
  store i64 38, ptr %_187.sroa.4.sroa.4.0._187.sroa.4.0._183.sroa_idx.sroa_idx, align 8
  %_187.sroa.4.sroa.5.0._187.sroa.4.0._183.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_183, i64 24
  store i32 556, ptr %_187.sroa.4.sroa.5.0._187.sroa.4.0._183.sroa_idx.sroa_idx, align 8
  %163 = getelementptr inbounds i8, ptr %_183, i64 80
  store i8 2, ptr %163, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %164 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_183) #28
  %_182.0 = extractvalue { i64, ptr } %164, 0
  %_182.1 = extractvalue { i64, ptr } %164, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_183)
  br label %bb286

bb102:                                            ; preds = %bb96
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_194)
  %165 = getelementptr inbounds i8, ptr %_630, i64 64
  %_195 = load ptr, ptr %165, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::admin_cto::token_frozen
  call fastcc void @_ZN14pump_recovered9admin_cto12token_frozen17h1658d4a62a0640cfE(ptr noalias nocapture noundef nonnull align 8 dereferenceable(16) %_194, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_195) #28
  %166 = load i64, ptr %_194, align 8, !range !318, !noundef !2
  %167 = icmp eq i64 %166, 2
  %168 = getelementptr inbounds i8, ptr %_194, i64 8
  br i1 %167, label %bb336, label %bb335

bb105:                                            ; preds = %bb92, %bb91, %bb93, %bb336
  %wallet.sroa.0.0.shrunk675 = phi i1 [ false, %bb336 ], [ true, %bb92 ], [ true, %bb91 ], [ true, %bb93 ]
  %wallet_frozen.sroa.0.0.off0 = phi i1 [ %extract.t162, %bb336 ], [ false, %bb92 ], [ false, %bb91 ], [ false, %bb93 ]
  br i1 %shared.sroa.0.0.off0, label %bb119, label %bb106

bb336:                                            ; preds = %bb102
  %169 = load i8, ptr %168, align 8, !range !374, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_194)
  %extract.t162 = icmp ne i8 %169, 0
  br label %bb105

bb335:                                            ; preds = %bb102
  %_859.1 = load ptr, ptr %168, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_194)
  br label %bb286

bb106:                                            ; preds = %bb105
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_200)
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_200, i8 0, i64 32, i1 false)
  %170 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %old, ptr noundef nonnull dereferenceable(32) %_200, i64 32)
  %.not163 = icmp eq i32 %170, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_200)
  br i1 %.not163, label %bb185, label %bb107

bb107:                                            ; preds = %bb106
  %171 = getelementptr inbounds i8, ptr %_630, i64 210
  %172 = load i8, ptr %171, align 2, !range !374, !noundef !2
  %_201.not = icmp ne i8 %172, 0
  %brmerge = or i1 %wallet.sroa.0.0.shrunk675, %_201.not
  br i1 %brmerge, label %bb109, label %bb113

bb109:                                            ; preds = %bb107
  %alloc_84e4dd413cb0e2cff6ff4abdd65f9f92.alloc_39e806604c4c413eab24b47c5266f52c = select i1 %_201.not, ptr @alloc_39e806604c4c413eab24b47c5266f52c, ptr @alloc_84e4dd413cb0e2cff6ff4abdd65f9f92
  %. = select i1 %_201.not, i64 45, i64 61
  call void @sol_log_(ptr noundef nonnull %alloc_84e4dd413cb0e2cff6ff4abdd65f9f92.alloc_39e806604c4c413eab24b47c5266f52c, i64 noundef %.) #28
  br label %bb185

bb113:                                            ; preds = %bb107
  br i1 %wallet_frozen.sroa.0.0.off0, label %bb185.thread, label %bb185

bb185.thread:                                     ; preds = %bb113
  call void @sol_log_(ptr noundef nonnull @alloc_deddac2d627577b5c14e9bbeacabf74e, i64 noundef 62) #28
  br label %bb225

bb185:                                            ; preds = %bb113, %bb109, %bb106, %bb184, %bb119
  %swept.sroa.0.0 = phi i64 [ %swept.sroa.0.1, %bb184 ], [ 0, %bb119 ], [ 0, %bb106 ], [ 0, %bb109 ], [ 0, %bb113 ]
  %brmerge189 = or i1 %wallet.sroa.0.0.shrunk675, %wallet_frozen.sroa.0.0.off0
  br i1 %brmerge189, label %bb225, label %bb187

bb119:                                            ; preds = %bb105
  br i1 %holder1.sroa.0.1.off0, label %bb120, label %bb185

bb120:                                            ; preds = %bb119
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %dest)
  call void @llvm.lifetime.start.p0(i64 33, ptr nonnull %_213)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_216)
  store ptr @alloc_ed0c7b53f6fd188c408cb80c27c2e0f7, ptr %_216, align 8
  %173 = getelementptr inbounds i8, ptr %_216, i64 8
  store i64 13, ptr %173, align 8
  %174 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_216, i64 0, i64 1
  store ptr %holder_key, ptr %174, align 8
  %175 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_216, i64 0, i64 1, i32 1
  store i64 32, ptr %175, align 8
; call solana_pubkey::Pubkey::find_program_address
  call void @_ZN13solana_pubkey6Pubkey20find_program_address17h57945082f260e69dE(ptr noalias nocapture noundef nonnull sret([33 x i8]) align 1 dereferenceable(33) %_213, ptr noalias noundef nonnull readonly align 8 %_216, i64 noundef 2, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) @_ZN14pump_recovered2ID17h8e245cf89cf2c06bE) #28
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %dest, ptr noundef nonnull align 1 dereferenceable(32) %_213, i64 32, i1 false)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_216)
  call void @llvm.lifetime.end.p0(i64 33, ptr nonnull %_213)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_220)
  %176 = getelementptr inbounds i8, ptr %_630, i64 264
  %_876 = load ptr, ptr %176, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_220, ptr noundef nonnull align 1 dereferenceable(32) %_876, i64 32, i1 false)
  %177 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_220, ptr noundef nonnull dereferenceable(32) %dest, i64 32)
  %.not164 = icmp eq i32 %177, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_220)
  br i1 %.not164, label %bb127, label %bb122

bb127:                                            ; preds = %bb120
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_234)
  %178 = getelementptr inbounds i8, ptr %_630, i64 136
  %_235 = load ptr, ptr %178, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::admin_cto::token_frozen
  call fastcc void @_ZN14pump_recovered9admin_cto12token_frozen17h1658d4a62a0640cfE(ptr noalias nocapture noundef nonnull align 8 dereferenceable(16) %_234, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_235) #28
  %179 = load i64, ptr %_234, align 8, !range !318, !noundef !2
  %180 = icmp eq i64 %179, 2
  %181 = getelementptr inbounds i8, ptr %_234, i64 8
  br i1 %180, label %bb343, label %bb342

bb122:                                            ; preds = %bb120
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_223)
  %182 = getelementptr inbounds i8, ptr %_223, i64 32
; call anchor_lang::error::ErrorCode::name
  call void @_ZN11anchor_lang5error9ErrorCode4name17h4f8143ac990f2107E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %182, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_2f475e84d260dce0bf2e60beae6b9ec7) #28
  %183 = getelementptr inbounds i8, ptr %_223, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h4b386cbefe3ebd9eE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %183, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_2f475e84d260dce0bf2e60beae6b9ec7) #28
  %184 = getelementptr inbounds i8, ptr %_223, i64 152
  store i32 2006, ptr %184, align 8
  store i64 0, ptr %_223, align 8
  %_226.sroa.4.0._223.sroa_idx = getelementptr inbounds i8, ptr %_223, i64 8
  store ptr @alloc_ebe040a358b3132776a16f34a7b7aa5b, ptr %_226.sroa.4.0._223.sroa_idx, align 8
  %_226.sroa.4.sroa.4.0._226.sroa.4.0._223.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_223, i64 16
  store i64 38, ptr %_226.sroa.4.sroa.4.0._226.sroa.4.0._223.sroa_idx.sroa_idx, align 8
  %_226.sroa.4.sroa.5.0._226.sroa.4.0._223.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_223, i64 24
  store i32 648, ptr %_226.sroa.4.sroa.5.0._226.sroa.4.0._223.sroa_idx.sroa_idx, align 8
  %185 = getelementptr inbounds i8, ptr %_223, i64 80
  store i8 2, ptr %185, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %186 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_223) #28
  %_222.0 = extractvalue { i64, ptr } %186, 0
  %_222.1 = extractvalue { i64, ptr } %186, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_223)
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %_230)
  %_880 = load ptr, ptr %176, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_230, ptr noundef nonnull align 1 dereferenceable(32) %_880, i64 32, i1 false)
  %187 = getelementptr inbounds i8, ptr %_230, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %187, ptr noundef nonnull align 1 dereferenceable(32) %dest, i64 32, i1 false)
; call anchor_lang::error::Error::with_pubkeys
  %188 = call { i64, ptr } @_ZN11anchor_lang5error5Error12with_pubkeys17hca6dbbbe6a9a5da7E(i64 noundef %_222.0, ptr noundef %_222.1, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(64) %_230) #28
  %_221.0 = extractvalue { i64, ptr } %188, 0
  %_221.1 = extractvalue { i64, ptr } %188, 1
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %_230)
  br label %bb281

bb343:                                            ; preds = %bb127
  %189 = load i8, ptr %181, align 8, !range !374, !noundef !2
  %_882.not = icmp eq i8 %189, 0
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_234)
  br i1 %_882.not, label %bb137, label %bb129

bb342:                                            ; preds = %bb127
  %_883.1 = load ptr, ptr %181, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_234)
  br label %bb281

bb129:                                            ; preds = %bb343
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_239)
  %_240 = load ptr, ptr %178, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::admin_cto::token_raw_amount
  call fastcc void @_ZN14pump_recovered9admin_cto16token_raw_amount17h5c5bab1f81c4ceb2E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(16) %_239, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_240) #28
  %190 = load i64, ptr %_239, align 8, !range !318, !noundef !2
  %191 = icmp eq i64 %190, 2
  %192 = getelementptr inbounds i8, ptr %_239, i64 8
  br i1 %191, label %bb345, label %bb344

bb345:                                            ; preds = %bb129
  %_887 = load i64, ptr %192, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_239)
  %193 = icmp eq i64 %_887, 0
  br i1 %193, label %bb154, label %bb132

bb344:                                            ; preds = %bb129
  %_888.1 = load ptr, ptr %192, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_239)
  br label %bb281

bb132:                                            ; preds = %bb345
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_244)
  %194 = getelementptr inbounds i8, ptr %_244, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %194, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_cd7b816cab57a667caebec1ad637a70c) #28
  %195 = getelementptr inbounds i8, ptr %_244, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %195, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_cd7b816cab57a667caebec1ad637a70c) #28
  %196 = getelementptr inbounds i8, ptr %_244, i64 152
  store i32 6093, ptr %196, align 8
  store i64 0, ptr %_244, align 8
  %_248.sroa.4.0._244.sroa_idx = getelementptr inbounds i8, ptr %_244, i64 8
  store ptr @alloc_ebe040a358b3132776a16f34a7b7aa5b, ptr %_248.sroa.4.0._244.sroa_idx, align 8
  %_248.sroa.4.sroa.4.0._248.sroa.4.0._244.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_244, i64 16
  store i64 38, ptr %_248.sroa.4.sroa.4.0._248.sroa.4.0._244.sroa_idx.sroa_idx, align 8
  %_248.sroa.4.sroa.5.0._248.sroa.4.0._244.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_244, i64 24
  store i32 660, ptr %_248.sroa.4.sroa.5.0._248.sroa.4.0._244.sroa_idx.sroa_idx, align 8
  %197 = getelementptr inbounds i8, ptr %_244, i64 80
  store i8 2, ptr %197, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %198 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_244) #28
  %_243.0 = extractvalue { i64, ptr } %198, 0
  %_243.1 = extractvalue { i64, ptr } %198, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_244)
  br label %bb281

bb137:                                            ; preds = %bb343
  %_253 = load ptr, ptr %178, align 8, !nonnull !2, !align !3, !noundef !2
; call solana_account_info::AccountInfo::data_is_empty
  %_252 = call noundef zeroext i1 @_ZN19solana_account_info11AccountInfo13data_is_empty17h4cbad3bc61143bcfE(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_253) #28
  br i1 %_252, label %bb154, label %bb139

bb154:                                            ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit498, %bb345, %bb137
  %_691 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_286)
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_286, i8 0, i64 32, i1 false)
  %_899 = getelementptr inbounds i8, ptr %_691, i64 40
  %199 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_899, ptr noundef nonnull dereferenceable(32) %_286, i64 32)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_286)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_289)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_291)
; call solana_sysvar::rent::<impl solana_sysvar::Sysvar for solana_rent::Rent>::get
  call void @"_ZN13solana_sysvar4rent69_$LT$impl$u20$solana_sysvar..Sysvar$u20$for$u20$solana_rent..Rent$GT$3get17hd4b89a48ea901882E"(ptr noalias nocapture noundef nonnull sret([32 x i8]) align 8 dereferenceable(32) %_291) #28
  %_901 = load i64, ptr %_291, align 8, !range !389, !noundef !2
  %trunc165.not = icmp eq i64 %_901, 0
  br i1 %trunc165.not, label %bb352, label %bb351

bb139:                                            ; preds = %bb137
  call void @llvm.lifetime.start.p0(i64 664, ptr nonnull %_256)
  call void @llvm.lifetime.start.p0(i64 5, ptr nonnull %_257.sroa.11)
  %200 = getelementptr inbounds i8, ptr %_630, i64 88
  %_258 = load ptr, ptr %200, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6170)
  %_2.i300 = load ptr, ptr %_258, align 8, !alias.scope !6170, !noalias !6173, !nonnull !2, !align !372, !noundef !2
  %201 = getelementptr inbounds i8, ptr %_258, i64 8
  %_12.i301 = load ptr, ptr %201, align 8, !alias.scope !6170, !noalias !6173, !nonnull !2, !noundef !2
  %self.val.i = load i64, ptr %_12.i301, align 8, !noalias !6175, !noundef !2
  %cond.i = icmp ne i64 %self.val.i, 0
  call void @llvm.assume(i1 %cond.i), !noalias !6175
  %strong1.i = add i64 %self.val.i, 1
  store i64 %strong1.i, ptr %_12.i301, align 8, !noalias !6175
  %_7.i = icmp eq i64 %strong1.i, 0
  br i1 %_7.i, label %bb4.i, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit

bb4.i:                                            ; preds = %bb139
  call void @llvm.trap(), !noalias !6175
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit: ; preds = %bb139
  %202 = getelementptr inbounds i8, ptr %_258, i64 16
  %_16.i302 = load ptr, ptr %202, align 8, !alias.scope !6170, !noalias !6173, !nonnull !2, !noundef !2
  %self.val.i350 = load i64, ptr %_16.i302, align 8, !noalias !6175, !noundef !2
  %cond.i351 = icmp ne i64 %self.val.i350, 0
  call void @llvm.assume(i1 %cond.i351), !noalias !6175
  %strong1.i352 = add i64 %self.val.i350, 1
  store i64 %strong1.i352, ptr %_16.i302, align 8, !noalias !6175
  %_7.i353 = icmp eq i64 %strong1.i352, 0
  br i1 %_7.i353, label %bb4.i354, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit

bb4.i354:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit
  call void @llvm.trap(), !noalias !6175
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit
  %203 = getelementptr inbounds i8, ptr %_258, i64 24
  %_5.i303 = load ptr, ptr %203, align 8, !alias.scope !6170, !noalias !6173, !nonnull !2, !align !372, !noundef !2
  %204 = getelementptr inbounds i8, ptr %_258, i64 32
  %_6.i304 = load i64, ptr %204, align 8, !alias.scope !6170, !noalias !6173, !noundef !2
  %205 = getelementptr inbounds i8, ptr %_258, i64 40
  %206 = load i8, ptr %205, align 8, !range !374, !alias.scope !6170, !noalias !6173, !noundef !2
  %207 = getelementptr inbounds i8, ptr %_258, i64 41
  %208 = load i8, ptr %207, align 1, !range !374, !alias.scope !6170, !noalias !6173, !noundef !2
  %209 = getelementptr inbounds i8, ptr %_258, i64 42
  %210 = load i8, ptr %209, align 2, !range !374, !alias.scope !6170, !noalias !6173, !noundef !2
  call void @llvm.lifetime.start.p0(i64 5, ptr nonnull %_259.sroa.16.sroa.11)
  call void @llvm.lifetime.start.p0(i64 5, ptr nonnull %_259.sroa.17.sroa.11)
  call void @llvm.lifetime.start.p0(i64 5, ptr nonnull %_259.sroa.18.sroa.11)
  call void @llvm.lifetime.start.p0(i64 5, ptr nonnull %_259.sroa.19.sroa.11)
  call void @llvm.lifetime.start.p0(i64 5, ptr nonnull %_259.sroa.20.sroa.11)
  call void @llvm.lifetime.start.p0(i64 5, ptr nonnull %_259.sroa.21.sroa.11)
  call void @llvm.lifetime.start.p0(i64 5, ptr nonnull %_259.sroa.22.sroa.11)
  %_261 = load ptr, ptr %_630, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6176)
  %_2.i295 = load ptr, ptr %_261, align 8, !alias.scope !6176, !noalias !6179, !nonnull !2, !align !372, !noundef !2
  %211 = getelementptr inbounds i8, ptr %_261, i64 8
  %_12.i296 = load ptr, ptr %211, align 8, !alias.scope !6176, !noalias !6179, !nonnull !2, !noundef !2
  %self.val.i355 = load i64, ptr %_12.i296, align 8, !noalias !6181, !noundef !2
  %cond.i356 = icmp ne i64 %self.val.i355, 0
  call void @llvm.assume(i1 %cond.i356), !noalias !6181
  %strong1.i357 = add i64 %self.val.i355, 1
  store i64 %strong1.i357, ptr %_12.i296, align 8, !noalias !6181
  %_7.i358 = icmp eq i64 %strong1.i357, 0
  br i1 %_7.i358, label %bb4.i359, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit360

bb4.i359:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit
  call void @llvm.trap(), !noalias !6181
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit360: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit
  %212 = getelementptr inbounds i8, ptr %_261, i64 16
  %_16.i297 = load ptr, ptr %212, align 8, !alias.scope !6176, !noalias !6179, !nonnull !2, !noundef !2
  %self.val.i361 = load i64, ptr %_16.i297, align 8, !noalias !6181, !noundef !2
  %cond.i362 = icmp ne i64 %self.val.i361, 0
  call void @llvm.assume(i1 %cond.i362), !noalias !6181
  %strong1.i363 = add i64 %self.val.i361, 1
  store i64 %strong1.i363, ptr %_16.i297, align 8, !noalias !6181
  %_7.i364 = icmp eq i64 %strong1.i363, 0
  br i1 %_7.i364, label %bb4.i365, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit366

bb4.i365:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit360
  call void @llvm.trap(), !noalias !6181
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit366: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit360
  %213 = getelementptr inbounds i8, ptr %_261, i64 24
  %_5.i298 = load ptr, ptr %213, align 8, !alias.scope !6176, !noalias !6179, !nonnull !2, !align !372, !noundef !2
  %214 = getelementptr inbounds i8, ptr %_261, i64 32
  %_6.i299 = load i64, ptr %214, align 8, !alias.scope !6176, !noalias !6179, !noundef !2
  %215 = getelementptr inbounds i8, ptr %_261, i64 40
  %216 = load i8, ptr %215, align 8, !range !374, !alias.scope !6176, !noalias !6179, !noundef !2
  %217 = getelementptr inbounds i8, ptr %_261, i64 41
  %218 = load i8, ptr %217, align 1, !range !374, !alias.scope !6176, !noalias !6179, !noundef !2
  %219 = getelementptr inbounds i8, ptr %_261, i64 42
  %220 = load i8, ptr %219, align 2, !range !374, !alias.scope !6176, !noalias !6179, !noundef !2
  %221 = getelementptr inbounds i8, ptr %_630, i64 24
  %_1110 = load ptr, ptr %221, align 8, !nonnull !2, !noundef !2
  %222 = getelementptr inbounds i8, ptr %_1110, i64 88
  %_263 = load ptr, ptr %222, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6182)
  %_2.i290 = load ptr, ptr %_263, align 8, !alias.scope !6182, !noalias !6185, !nonnull !2, !align !372, !noundef !2
  %223 = getelementptr inbounds i8, ptr %_263, i64 8
  %_12.i291 = load ptr, ptr %223, align 8, !alias.scope !6182, !noalias !6185, !nonnull !2, !noundef !2
  %self.val.i367 = load i64, ptr %_12.i291, align 8, !noalias !6187, !noundef !2
  %cond.i368 = icmp ne i64 %self.val.i367, 0
  call void @llvm.assume(i1 %cond.i368), !noalias !6187
  %strong1.i369 = add i64 %self.val.i367, 1
  store i64 %strong1.i369, ptr %_12.i291, align 8, !noalias !6187
  %_7.i370 = icmp eq i64 %strong1.i369, 0
  br i1 %_7.i370, label %bb4.i371, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit372

bb4.i371:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit366
  call void @llvm.trap(), !noalias !6187
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit372: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit366
  %224 = getelementptr inbounds i8, ptr %_263, i64 16
  %_16.i292 = load ptr, ptr %224, align 8, !alias.scope !6182, !noalias !6185, !nonnull !2, !noundef !2
  %self.val.i373 = load i64, ptr %_16.i292, align 8, !noalias !6187, !noundef !2
  %cond.i374 = icmp ne i64 %self.val.i373, 0
  call void @llvm.assume(i1 %cond.i374), !noalias !6187
  %strong1.i375 = add i64 %self.val.i373, 1
  store i64 %strong1.i375, ptr %_16.i292, align 8, !noalias !6187
  %_7.i376 = icmp eq i64 %strong1.i375, 0
  br i1 %_7.i376, label %bb4.i377, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit378

bb4.i377:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit372
  call void @llvm.trap(), !noalias !6187
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit378: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit372
  %225 = getelementptr inbounds i8, ptr %_263, i64 24
  %_5.i293 = load ptr, ptr %225, align 8, !alias.scope !6182, !noalias !6185, !nonnull !2, !align !372, !noundef !2
  %226 = getelementptr inbounds i8, ptr %_263, i64 32
  %_6.i294 = load i64, ptr %226, align 8, !alias.scope !6182, !noalias !6185, !noundef !2
  %227 = getelementptr inbounds i8, ptr %_263, i64 40
  %228 = load i8, ptr %227, align 8, !range !374, !alias.scope !6182, !noalias !6185, !noundef !2
  %229 = getelementptr inbounds i8, ptr %_263, i64 41
  %230 = load i8, ptr %229, align 1, !range !374, !alias.scope !6182, !noalias !6185, !noundef !2
  %231 = getelementptr inbounds i8, ptr %_263, i64 42
  %232 = load i8, ptr %231, align 2, !range !374, !alias.scope !6182, !noalias !6185, !noundef !2
  %233 = getelementptr inbounds i8, ptr %_630, i64 32
  %_265 = load ptr, ptr %233, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6188)
  %_2.i285 = load ptr, ptr %_265, align 8, !alias.scope !6188, !noalias !6191, !nonnull !2, !align !372, !noundef !2
  %234 = getelementptr inbounds i8, ptr %_265, i64 8
  %_12.i286 = load ptr, ptr %234, align 8, !alias.scope !6188, !noalias !6191, !nonnull !2, !noundef !2
  %self.val.i379 = load i64, ptr %_12.i286, align 8, !noalias !6193, !noundef !2
  %cond.i380 = icmp ne i64 %self.val.i379, 0
  call void @llvm.assume(i1 %cond.i380), !noalias !6193
  %strong1.i381 = add i64 %self.val.i379, 1
  store i64 %strong1.i381, ptr %_12.i286, align 8, !noalias !6193
  %_7.i382 = icmp eq i64 %strong1.i381, 0
  br i1 %_7.i382, label %bb4.i383, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit384

bb4.i383:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit378
  call void @llvm.trap(), !noalias !6193
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit384: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit378
  %235 = getelementptr inbounds i8, ptr %_265, i64 16
  %_16.i287 = load ptr, ptr %235, align 8, !alias.scope !6188, !noalias !6191, !nonnull !2, !noundef !2
  %self.val.i385 = load i64, ptr %_16.i287, align 8, !noalias !6193, !noundef !2
  %cond.i386 = icmp ne i64 %self.val.i385, 0
  call void @llvm.assume(i1 %cond.i386), !noalias !6193
  %strong1.i387 = add i64 %self.val.i385, 1
  store i64 %strong1.i387, ptr %_16.i287, align 8, !noalias !6193
  %_7.i388 = icmp eq i64 %strong1.i387, 0
  br i1 %_7.i388, label %bb4.i389, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit390

bb4.i389:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit384
  call void @llvm.trap(), !noalias !6193
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit390: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit384
  %236 = getelementptr inbounds i8, ptr %_265, i64 24
  %_5.i288 = load ptr, ptr %236, align 8, !alias.scope !6188, !noalias !6191, !nonnull !2, !align !372, !noundef !2
  %237 = getelementptr inbounds i8, ptr %_265, i64 32
  %_6.i289 = load i64, ptr %237, align 8, !alias.scope !6188, !noalias !6191, !noundef !2
  %238 = getelementptr inbounds i8, ptr %_265, i64 40
  %239 = load i8, ptr %238, align 8, !range !374, !alias.scope !6188, !noalias !6191, !noundef !2
  %240 = getelementptr inbounds i8, ptr %_265, i64 41
  %241 = load i8, ptr %240, align 1, !range !374, !alias.scope !6188, !noalias !6191, !noundef !2
  %242 = getelementptr inbounds i8, ptr %_265, i64 42
  %243 = load i8, ptr %242, align 2, !range !374, !alias.scope !6188, !noalias !6191, !noundef !2
  %_267 = load ptr, ptr %_157, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6194)
  %_2.i280 = load ptr, ptr %_267, align 8, !alias.scope !6194, !noalias !6197, !nonnull !2, !align !372, !noundef !2
  %244 = getelementptr inbounds i8, ptr %_267, i64 8
  %_12.i281 = load ptr, ptr %244, align 8, !alias.scope !6194, !noalias !6197, !nonnull !2, !noundef !2
  %self.val.i391 = load i64, ptr %_12.i281, align 8, !noalias !6199, !noundef !2
  %cond.i392 = icmp ne i64 %self.val.i391, 0
  call void @llvm.assume(i1 %cond.i392), !noalias !6199
  %strong1.i393 = add i64 %self.val.i391, 1
  store i64 %strong1.i393, ptr %_12.i281, align 8, !noalias !6199
  %_7.i394 = icmp eq i64 %strong1.i393, 0
  br i1 %_7.i394, label %bb4.i395, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit396

bb4.i395:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit390
  call void @llvm.trap(), !noalias !6199
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit396: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit390
  %245 = getelementptr inbounds i8, ptr %_267, i64 16
  %_16.i282 = load ptr, ptr %245, align 8, !alias.scope !6194, !noalias !6197, !nonnull !2, !noundef !2
  %self.val.i397 = load i64, ptr %_16.i282, align 8, !noalias !6199, !noundef !2
  %cond.i398 = icmp ne i64 %self.val.i397, 0
  call void @llvm.assume(i1 %cond.i398), !noalias !6199
  %strong1.i399 = add i64 %self.val.i397, 1
  store i64 %strong1.i399, ptr %_16.i282, align 8, !noalias !6199
  %_7.i400 = icmp eq i64 %strong1.i399, 0
  br i1 %_7.i400, label %bb4.i401, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit402

bb4.i401:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit396
  call void @llvm.trap(), !noalias !6199
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit402: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit396
  %246 = getelementptr inbounds i8, ptr %_267, i64 24
  %_5.i283 = load ptr, ptr %246, align 8, !alias.scope !6194, !noalias !6197, !nonnull !2, !align !372, !noundef !2
  %247 = getelementptr inbounds i8, ptr %_267, i64 32
  %_6.i284 = load i64, ptr %247, align 8, !alias.scope !6194, !noalias !6197, !noundef !2
  %248 = getelementptr inbounds i8, ptr %_267, i64 40
  %249 = load i8, ptr %248, align 8, !range !374, !alias.scope !6194, !noalias !6197, !noundef !2
  %250 = getelementptr inbounds i8, ptr %_267, i64 41
  %251 = load i8, ptr %250, align 1, !range !374, !alias.scope !6194, !noalias !6197, !noundef !2
  %252 = getelementptr inbounds i8, ptr %_267, i64 42
  %253 = load i8, ptr %252, align 2, !range !374, !alias.scope !6194, !noalias !6197, !noundef !2
  %254 = getelementptr inbounds i8, ptr %_630, i64 40
  %_269 = load ptr, ptr %254, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6200)
  %_2.i275 = load ptr, ptr %_269, align 8, !alias.scope !6200, !noalias !6203, !nonnull !2, !align !372, !noundef !2
  %255 = getelementptr inbounds i8, ptr %_269, i64 8
  %_12.i276 = load ptr, ptr %255, align 8, !alias.scope !6200, !noalias !6203, !nonnull !2, !noundef !2
  %self.val.i403 = load i64, ptr %_12.i276, align 8, !noalias !6205, !noundef !2
  %cond.i404 = icmp ne i64 %self.val.i403, 0
  call void @llvm.assume(i1 %cond.i404), !noalias !6205
  %strong1.i405 = add i64 %self.val.i403, 1
  store i64 %strong1.i405, ptr %_12.i276, align 8, !noalias !6205
  %_7.i406 = icmp eq i64 %strong1.i405, 0
  br i1 %_7.i406, label %bb4.i407, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit408

bb4.i407:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit402
  call void @llvm.trap(), !noalias !6205
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit408: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit402
  %256 = getelementptr inbounds i8, ptr %_269, i64 16
  %_16.i277 = load ptr, ptr %256, align 8, !alias.scope !6200, !noalias !6203, !nonnull !2, !noundef !2
  %self.val.i409 = load i64, ptr %_16.i277, align 8, !noalias !6205, !noundef !2
  %cond.i410 = icmp ne i64 %self.val.i409, 0
  call void @llvm.assume(i1 %cond.i410), !noalias !6205
  %strong1.i411 = add i64 %self.val.i409, 1
  store i64 %strong1.i411, ptr %_16.i277, align 8, !noalias !6205
  %_7.i412 = icmp eq i64 %strong1.i411, 0
  br i1 %_7.i412, label %bb4.i413, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit414

bb4.i413:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit408
  call void @llvm.trap(), !noalias !6205
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit414: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit408
  %257 = getelementptr inbounds i8, ptr %_269, i64 24
  %_5.i278 = load ptr, ptr %257, align 8, !alias.scope !6200, !noalias !6203, !nonnull !2, !align !372, !noundef !2
  %258 = getelementptr inbounds i8, ptr %_269, i64 32
  %_6.i279 = load i64, ptr %258, align 8, !alias.scope !6200, !noalias !6203, !noundef !2
  %259 = getelementptr inbounds i8, ptr %_269, i64 40
  %260 = load i8, ptr %259, align 8, !range !374, !alias.scope !6200, !noalias !6203, !noundef !2
  %261 = getelementptr inbounds i8, ptr %_269, i64 41
  %262 = load i8, ptr %261, align 1, !range !374, !alias.scope !6200, !noalias !6203, !noundef !2
  %263 = getelementptr inbounds i8, ptr %_269, i64 42
  %264 = load i8, ptr %263, align 2, !range !374, !alias.scope !6200, !noalias !6203, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6206)
  %_2.i270 = load ptr, ptr %47, align 8, !alias.scope !6206, !noalias !6209, !nonnull !2, !align !372, !noundef !2
  %265 = getelementptr inbounds i8, ptr %_630, i64 176
  %_12.i271 = load ptr, ptr %265, align 8, !alias.scope !6206, !noalias !6209, !nonnull !2, !noundef !2
  %self.val.i415 = load i64, ptr %_12.i271, align 8, !noalias !6211, !noundef !2
  %cond.i416 = icmp ne i64 %self.val.i415, 0
  call void @llvm.assume(i1 %cond.i416), !noalias !6211
  %strong1.i417 = add i64 %self.val.i415, 1
  store i64 %strong1.i417, ptr %_12.i271, align 8, !noalias !6211
  %_7.i418 = icmp eq i64 %strong1.i417, 0
  br i1 %_7.i418, label %bb4.i419, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit420

bb4.i419:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit414
  call void @llvm.trap(), !noalias !6211
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit420: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit414
  %266 = getelementptr inbounds i8, ptr %_630, i64 184
  %_16.i272 = load ptr, ptr %266, align 8, !alias.scope !6206, !noalias !6209, !nonnull !2, !noundef !2
  %self.val.i421 = load i64, ptr %_16.i272, align 8, !noalias !6211, !noundef !2
  %cond.i422 = icmp ne i64 %self.val.i421, 0
  call void @llvm.assume(i1 %cond.i422), !noalias !6211
  %strong1.i423 = add i64 %self.val.i421, 1
  store i64 %strong1.i423, ptr %_16.i272, align 8, !noalias !6211
  %_7.i424 = icmp eq i64 %strong1.i423, 0
  br i1 %_7.i424, label %bb4.i425, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit426

bb4.i425:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit420
  call void @llvm.trap(), !noalias !6211
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit426: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit420
  %267 = getelementptr inbounds i8, ptr %_630, i64 192
  %_5.i273 = load ptr, ptr %267, align 8, !alias.scope !6206, !noalias !6209, !nonnull !2, !align !372, !noundef !2
  %268 = getelementptr inbounds i8, ptr %_630, i64 200
  %_6.i274 = load i64, ptr %268, align 8, !alias.scope !6206, !noalias !6209, !noundef !2
  %269 = getelementptr inbounds i8, ptr %_630, i64 208
  %270 = load i8, ptr %269, align 8, !range !374, !alias.scope !6206, !noalias !6209, !noundef !2
  %271 = getelementptr inbounds i8, ptr %_630, i64 209
  %272 = load i8, ptr %271, align 1, !range !374, !alias.scope !6206, !noalias !6209, !noundef !2
  %273 = getelementptr inbounds i8, ptr %_630, i64 210
  %274 = load i8, ptr %273, align 2, !range !374, !alias.scope !6206, !noalias !6209, !noundef !2
  %275 = getelementptr inbounds i8, ptr %_630, i64 128
  %_273 = load ptr, ptr %275, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6212)
  %_2.i265 = load ptr, ptr %_273, align 8, !alias.scope !6212, !noalias !6215, !nonnull !2, !align !372, !noundef !2
  %276 = getelementptr inbounds i8, ptr %_273, i64 8
  %_12.i266 = load ptr, ptr %276, align 8, !alias.scope !6212, !noalias !6215, !nonnull !2, !noundef !2
  %self.val.i427 = load i64, ptr %_12.i266, align 8, !noalias !6217, !noundef !2
  %cond.i428 = icmp ne i64 %self.val.i427, 0
  call void @llvm.assume(i1 %cond.i428), !noalias !6217
  %strong1.i429 = add i64 %self.val.i427, 1
  store i64 %strong1.i429, ptr %_12.i266, align 8, !noalias !6217
  %_7.i430 = icmp eq i64 %strong1.i429, 0
  br i1 %_7.i430, label %bb4.i431, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit432

bb4.i431:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit426
  call void @llvm.trap(), !noalias !6217
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit432: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit426
  %277 = getelementptr inbounds i8, ptr %_273, i64 16
  %_16.i267 = load ptr, ptr %277, align 8, !alias.scope !6212, !noalias !6215, !nonnull !2, !noundef !2
  %self.val.i433 = load i64, ptr %_16.i267, align 8, !noalias !6217, !noundef !2
  %cond.i434 = icmp ne i64 %self.val.i433, 0
  call void @llvm.assume(i1 %cond.i434), !noalias !6217
  %strong1.i435 = add i64 %self.val.i433, 1
  store i64 %strong1.i435, ptr %_16.i267, align 8, !noalias !6217
  %_7.i436 = icmp eq i64 %strong1.i435, 0
  br i1 %_7.i436, label %bb4.i437, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit438

bb4.i437:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit432
  call void @llvm.trap(), !noalias !6217
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit438: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit432
  %278 = getelementptr inbounds i8, ptr %_273, i64 24
  %_5.i268 = load ptr, ptr %278, align 8, !alias.scope !6212, !noalias !6215, !nonnull !2, !align !372, !noundef !2
  %279 = getelementptr inbounds i8, ptr %_273, i64 32
  %_6.i269 = load i64, ptr %279, align 8, !alias.scope !6212, !noalias !6215, !noundef !2
  %280 = getelementptr inbounds i8, ptr %_273, i64 40
  %281 = load i8, ptr %280, align 8, !range !374, !alias.scope !6212, !noalias !6215, !noundef !2
  %282 = getelementptr inbounds i8, ptr %_273, i64 41
  %283 = load i8, ptr %282, align 1, !range !374, !alias.scope !6212, !noalias !6215, !noundef !2
  %284 = getelementptr inbounds i8, ptr %_273, i64 42
  %285 = load i8, ptr %284, align 2, !range !374, !alias.scope !6212, !noalias !6215, !noundef !2
  %_275 = load ptr, ptr %178, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6218)
  %_2.i260 = load ptr, ptr %_275, align 8, !alias.scope !6218, !noalias !6221, !nonnull !2, !align !372, !noundef !2
  %286 = getelementptr inbounds i8, ptr %_275, i64 8
  %_12.i261 = load ptr, ptr %286, align 8, !alias.scope !6218, !noalias !6221, !nonnull !2, !noundef !2
  %self.val.i439 = load i64, ptr %_12.i261, align 8, !noalias !6223, !noundef !2
  %cond.i440 = icmp ne i64 %self.val.i439, 0
  call void @llvm.assume(i1 %cond.i440), !noalias !6223
  %strong1.i441 = add i64 %self.val.i439, 1
  store i64 %strong1.i441, ptr %_12.i261, align 8, !noalias !6223
  %_7.i442 = icmp eq i64 %strong1.i441, 0
  br i1 %_7.i442, label %bb4.i443, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit444

bb4.i443:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit438
  call void @llvm.trap(), !noalias !6223
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit444: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit438
  %287 = getelementptr inbounds i8, ptr %_275, i64 16
  %_16.i262 = load ptr, ptr %287, align 8, !alias.scope !6218, !noalias !6221, !nonnull !2, !noundef !2
  %self.val.i445 = load i64, ptr %_16.i262, align 8, !noalias !6223, !noundef !2
  %cond.i446 = icmp ne i64 %self.val.i445, 0
  call void @llvm.assume(i1 %cond.i446), !noalias !6223
  %strong1.i447 = add i64 %self.val.i445, 1
  store i64 %strong1.i447, ptr %_16.i262, align 8, !noalias !6223
  %_7.i448 = icmp eq i64 %strong1.i447, 0
  br i1 %_7.i448, label %bb4.i449, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit450

bb4.i449:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit444
  call void @llvm.trap(), !noalias !6223
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit450: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit444
  %288 = getelementptr inbounds i8, ptr %_275, i64 24
  %_5.i263 = load ptr, ptr %288, align 8, !alias.scope !6218, !noalias !6221, !nonnull !2, !align !372, !noundef !2
  %289 = getelementptr inbounds i8, ptr %_275, i64 32
  %_6.i264 = load i64, ptr %289, align 8, !alias.scope !6218, !noalias !6221, !noundef !2
  %290 = getelementptr inbounds i8, ptr %_275, i64 40
  %291 = load i8, ptr %290, align 8, !range !374, !alias.scope !6218, !noalias !6221, !noundef !2
  %292 = getelementptr inbounds i8, ptr %_275, i64 41
  %293 = load i8, ptr %292, align 1, !range !374, !alias.scope !6218, !noalias !6221, !noundef !2
  %294 = getelementptr inbounds i8, ptr %_275, i64 42
  %295 = load i8, ptr %294, align 2, !range !374, !alias.scope !6218, !noalias !6221, !noundef !2
  %_277 = getelementptr inbounds i8, ptr %_630, i64 216
  call void @llvm.experimental.noalias.scope.decl(metadata !6224)
  %_2.i255 = load ptr, ptr %_277, align 8, !alias.scope !6224, !noalias !6227, !nonnull !2, !align !372, !noundef !2
  %296 = getelementptr inbounds i8, ptr %_630, i64 224
  %_12.i256 = load ptr, ptr %296, align 8, !alias.scope !6224, !noalias !6227, !nonnull !2, !noundef !2
  %self.val.i451 = load i64, ptr %_12.i256, align 8, !noalias !6229, !noundef !2
  %cond.i452 = icmp ne i64 %self.val.i451, 0
  call void @llvm.assume(i1 %cond.i452), !noalias !6229
  %strong1.i453 = add i64 %self.val.i451, 1
  store i64 %strong1.i453, ptr %_12.i256, align 8, !noalias !6229
  %_7.i454 = icmp eq i64 %strong1.i453, 0
  br i1 %_7.i454, label %bb4.i455, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit456

bb4.i455:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit450
  call void @llvm.trap(), !noalias !6229
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit456: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit450
  %297 = getelementptr inbounds i8, ptr %_630, i64 232
  %_16.i257 = load ptr, ptr %297, align 8, !alias.scope !6224, !noalias !6227, !nonnull !2, !noundef !2
  %self.val.i457 = load i64, ptr %_16.i257, align 8, !noalias !6229, !noundef !2
  %cond.i458 = icmp ne i64 %self.val.i457, 0
  call void @llvm.assume(i1 %cond.i458), !noalias !6229
  %strong1.i459 = add i64 %self.val.i457, 1
  store i64 %strong1.i459, ptr %_16.i257, align 8, !noalias !6229
  %_7.i460 = icmp eq i64 %strong1.i459, 0
  br i1 %_7.i460, label %bb4.i461, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit462

bb4.i461:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit456
  call void @llvm.trap(), !noalias !6229
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit462: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit456
  %298 = getelementptr inbounds i8, ptr %_630, i64 240
  %_5.i258 = load ptr, ptr %298, align 8, !alias.scope !6224, !noalias !6227, !nonnull !2, !align !372, !noundef !2
  %299 = getelementptr inbounds i8, ptr %_630, i64 248
  %_6.i259 = load i64, ptr %299, align 8, !alias.scope !6224, !noalias !6227, !noundef !2
  %300 = getelementptr inbounds i8, ptr %_630, i64 256
  %301 = load i8, ptr %300, align 8, !range !374, !alias.scope !6224, !noalias !6227, !noundef !2
  %302 = getelementptr inbounds i8, ptr %_630, i64 257
  %303 = load i8, ptr %302, align 1, !range !374, !alias.scope !6224, !noalias !6227, !noundef !2
  %304 = getelementptr inbounds i8, ptr %_630, i64 258
  %305 = load i8, ptr %304, align 2, !range !374, !alias.scope !6224, !noalias !6227, !noundef !2
  %306 = getelementptr inbounds i8, ptr %_630, i64 72
  %_279 = load ptr, ptr %306, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6230)
  %_2.i250 = load ptr, ptr %_279, align 8, !alias.scope !6230, !noalias !6233, !nonnull !2, !align !372, !noundef !2
  %307 = getelementptr inbounds i8, ptr %_279, i64 8
  %_12.i251 = load ptr, ptr %307, align 8, !alias.scope !6230, !noalias !6233, !nonnull !2, !noundef !2
  %self.val.i463 = load i64, ptr %_12.i251, align 8, !noalias !6235, !noundef !2
  %cond.i464 = icmp ne i64 %self.val.i463, 0
  call void @llvm.assume(i1 %cond.i464), !noalias !6235
  %strong1.i465 = add i64 %self.val.i463, 1
  store i64 %strong1.i465, ptr %_12.i251, align 8, !noalias !6235
  %_7.i466 = icmp eq i64 %strong1.i465, 0
  br i1 %_7.i466, label %bb4.i467, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit468

bb4.i467:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit462
  call void @llvm.trap(), !noalias !6235
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit468: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit462
  %308 = getelementptr inbounds i8, ptr %_279, i64 16
  %_16.i252 = load ptr, ptr %308, align 8, !alias.scope !6230, !noalias !6233, !nonnull !2, !noundef !2
  %self.val.i469 = load i64, ptr %_16.i252, align 8, !noalias !6235, !noundef !2
  %cond.i470 = icmp ne i64 %self.val.i469, 0
  call void @llvm.assume(i1 %cond.i470), !noalias !6235
  %strong1.i471 = add i64 %self.val.i469, 1
  store i64 %strong1.i471, ptr %_16.i252, align 8, !noalias !6235
  %_7.i472 = icmp eq i64 %strong1.i471, 0
  br i1 %_7.i472, label %bb4.i473, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit474

bb4.i473:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit468
  call void @llvm.trap(), !noalias !6235
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit474: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit468
  %309 = getelementptr inbounds i8, ptr %_279, i64 24
  %_5.i253 = load ptr, ptr %309, align 8, !alias.scope !6230, !noalias !6233, !nonnull !2, !align !372, !noundef !2
  %310 = getelementptr inbounds i8, ptr %_279, i64 32
  %_6.i254 = load i64, ptr %310, align 8, !alias.scope !6230, !noalias !6233, !noundef !2
  %311 = getelementptr inbounds i8, ptr %_279, i64 40
  %312 = load i8, ptr %311, align 8, !range !374, !alias.scope !6230, !noalias !6233, !noundef !2
  %313 = getelementptr inbounds i8, ptr %_279, i64 41
  %314 = load i8, ptr %313, align 1, !range !374, !alias.scope !6230, !noalias !6233, !noundef !2
  %315 = getelementptr inbounds i8, ptr %_279, i64 42
  %316 = load i8, ptr %315, align 2, !range !374, !alias.scope !6230, !noalias !6233, !noundef !2
  %317 = getelementptr inbounds i8, ptr %_630, i64 120
  %_281 = load ptr, ptr %317, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6236)
  %_2.i245 = load ptr, ptr %_281, align 8, !alias.scope !6236, !noalias !6239, !nonnull !2, !align !372, !noundef !2
  %318 = getelementptr inbounds i8, ptr %_281, i64 8
  %_12.i246 = load ptr, ptr %318, align 8, !alias.scope !6236, !noalias !6239, !nonnull !2, !noundef !2
  %self.val.i475 = load i64, ptr %_12.i246, align 8, !noalias !6241, !noundef !2
  %cond.i476 = icmp ne i64 %self.val.i475, 0
  call void @llvm.assume(i1 %cond.i476), !noalias !6241
  %strong1.i477 = add i64 %self.val.i475, 1
  store i64 %strong1.i477, ptr %_12.i246, align 8, !noalias !6241
  %_7.i478 = icmp eq i64 %strong1.i477, 0
  br i1 %_7.i478, label %bb4.i479, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit480

bb4.i479:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit474
  call void @llvm.trap(), !noalias !6241
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit480: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit474
  %319 = getelementptr inbounds i8, ptr %_281, i64 16
  %_16.i247 = load ptr, ptr %319, align 8, !alias.scope !6236, !noalias !6239, !nonnull !2, !noundef !2
  %self.val.i481 = load i64, ptr %_16.i247, align 8, !noalias !6241, !noundef !2
  %cond.i482 = icmp ne i64 %self.val.i481, 0
  call void @llvm.assume(i1 %cond.i482), !noalias !6241
  %strong1.i483 = add i64 %self.val.i481, 1
  store i64 %strong1.i483, ptr %_16.i247, align 8, !noalias !6241
  %_7.i484 = icmp eq i64 %strong1.i483, 0
  br i1 %_7.i484, label %bb4.i485, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit486

bb4.i485:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit480
  call void @llvm.trap(), !noalias !6241
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit486: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit480
  %320 = getelementptr inbounds i8, ptr %_281, i64 24
  %_5.i248 = load ptr, ptr %320, align 8, !alias.scope !6236, !noalias !6239, !nonnull !2, !align !372, !noundef !2
  %321 = getelementptr inbounds i8, ptr %_281, i64 32
  %_6.i249 = load i64, ptr %321, align 8, !alias.scope !6236, !noalias !6239, !noundef !2
  %322 = getelementptr inbounds i8, ptr %_281, i64 40
  %323 = load i8, ptr %322, align 8, !range !374, !alias.scope !6236, !noalias !6239, !noundef !2
  %324 = getelementptr inbounds i8, ptr %_281, i64 41
  %325 = load i8, ptr %324, align 1, !range !374, !alias.scope !6236, !noalias !6239, !noundef !2
  %326 = getelementptr inbounds i8, ptr %_281, i64 42
  %327 = load i8, ptr %326, align 2, !range !374, !alias.scope !6236, !noalias !6239, !noundef !2
  %_283 = load ptr, ptr %200, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6242)
  %_2.i240 = load ptr, ptr %_283, align 8, !alias.scope !6242, !noalias !6245, !nonnull !2, !align !372, !noundef !2
  %328 = getelementptr inbounds i8, ptr %_283, i64 8
  %_12.i241 = load ptr, ptr %328, align 8, !alias.scope !6242, !noalias !6245, !nonnull !2, !noundef !2
  %self.val.i487 = load i64, ptr %_12.i241, align 8, !noalias !6247, !noundef !2
  %cond.i488 = icmp ne i64 %self.val.i487, 0
  call void @llvm.assume(i1 %cond.i488), !noalias !6247
  %strong1.i489 = add i64 %self.val.i487, 1
  store i64 %strong1.i489, ptr %_12.i241, align 8, !noalias !6247
  %_7.i490 = icmp eq i64 %strong1.i489, 0
  br i1 %_7.i490, label %bb4.i491, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit492

bb4.i491:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit486
  call void @llvm.trap(), !noalias !6247
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit492: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit486
  %329 = getelementptr inbounds i8, ptr %_283, i64 16
  %_16.i242 = load ptr, ptr %329, align 8, !alias.scope !6242, !noalias !6245, !nonnull !2, !noundef !2
  %self.val.i493 = load i64, ptr %_16.i242, align 8, !noalias !6247, !noundef !2
  %cond.i494 = icmp ne i64 %self.val.i493, 0
  call void @llvm.assume(i1 %cond.i494), !noalias !6247
  %strong1.i495 = add i64 %self.val.i493, 1
  store i64 %strong1.i495, ptr %_16.i242, align 8, !noalias !6247
  %_7.i496 = icmp eq i64 %strong1.i495, 0
  br i1 %_7.i496, label %bb4.i497, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit498

bb4.i497:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit492
  call void @llvm.trap(), !noalias !6247
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit498: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit492
  %330 = getelementptr inbounds i8, ptr %_283, i64 24
  %_5.i243 = load ptr, ptr %330, align 8, !alias.scope !6242, !noalias !6245, !nonnull !2, !align !372, !noundef !2
  %331 = getelementptr inbounds i8, ptr %_283, i64 32
  %_6.i244 = load i64, ptr %331, align 8, !alias.scope !6242, !noalias !6245, !noundef !2
  %332 = getelementptr inbounds i8, ptr %_283, i64 40
  %333 = load i8, ptr %332, align 8, !range !374, !alias.scope !6242, !noalias !6245, !noundef !2
  %334 = getelementptr inbounds i8, ptr %_283, i64 41
  %335 = load i8, ptr %334, align 1, !range !374, !alias.scope !6242, !noalias !6245, !noundef !2
  %336 = getelementptr inbounds i8, ptr %_283, i64 42
  %337 = load i8, ptr %336, align 2, !range !374, !alias.scope !6242, !noalias !6245, !noundef !2
  %338 = getelementptr inbounds i8, ptr %_256, i64 72
  store ptr %_2.i295, ptr %338, align 8
  %_259.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 80
  store ptr %_12.i296, ptr %_259.sroa.4.0..sroa_idx, align 8
  %_259.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 88
  store ptr %_16.i297, ptr %_259.sroa.5.0..sroa_idx, align 8
  %_259.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 96
  store ptr %_5.i298, ptr %_259.sroa.6.0..sroa_idx, align 8
  %_259.sroa.7.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 104
  store i64 %_6.i299, ptr %_259.sroa.7.0..sroa_idx, align 8
  %_259.sroa.8.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 112
  store i8 %216, ptr %_259.sroa.8.0..sroa_idx, align 8
  %_259.sroa.9.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 113
  store i8 %218, ptr %_259.sroa.9.0..sroa_idx, align 1
  %_259.sroa.10.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 114
  store i8 %220, ptr %_259.sroa.10.0..sroa_idx, align 2
  %_259.sroa.12.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 120
  store ptr %_2.i290, ptr %_259.sroa.12.0..sroa_idx, align 8
  %_259.sroa.12.sroa.4.0._259.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 128
  store ptr %_12.i291, ptr %_259.sroa.12.sroa.4.0._259.sroa.12.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.12.sroa.5.0._259.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 136
  store ptr %_16.i292, ptr %_259.sroa.12.sroa.5.0._259.sroa.12.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.12.sroa.6.0._259.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 144
  store ptr %_5.i293, ptr %_259.sroa.12.sroa.6.0._259.sroa.12.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.12.sroa.7.0._259.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 152
  store i64 %_6.i294, ptr %_259.sroa.12.sroa.7.0._259.sroa.12.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.12.sroa.8.0._259.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 160
  store i8 %228, ptr %_259.sroa.12.sroa.8.0._259.sroa.12.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.12.sroa.9.0._259.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 161
  store i8 %230, ptr %_259.sroa.12.sroa.9.0._259.sroa.12.0..sroa_idx.sroa_idx, align 1
  %_259.sroa.12.sroa.10.0._259.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 162
  store i8 %232, ptr %_259.sroa.12.sroa.10.0._259.sroa.12.0..sroa_idx.sroa_idx, align 2
  %_259.sroa.13.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 168
  store ptr %_2.i285, ptr %_259.sroa.13.0..sroa_idx, align 8
  %_259.sroa.13.sroa.4.0._259.sroa.13.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 176
  store ptr %_12.i286, ptr %_259.sroa.13.sroa.4.0._259.sroa.13.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.13.sroa.5.0._259.sroa.13.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 184
  store ptr %_16.i287, ptr %_259.sroa.13.sroa.5.0._259.sroa.13.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.13.sroa.6.0._259.sroa.13.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 192
  store ptr %_5.i288, ptr %_259.sroa.13.sroa.6.0._259.sroa.13.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.13.sroa.7.0._259.sroa.13.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 200
  store i64 %_6.i289, ptr %_259.sroa.13.sroa.7.0._259.sroa.13.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.13.sroa.8.0._259.sroa.13.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 208
  store i8 %239, ptr %_259.sroa.13.sroa.8.0._259.sroa.13.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.13.sroa.9.0._259.sroa.13.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 209
  store i8 %241, ptr %_259.sroa.13.sroa.9.0._259.sroa.13.0..sroa_idx.sroa_idx, align 1
  %_259.sroa.13.sroa.10.0._259.sroa.13.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 210
  store i8 %243, ptr %_259.sroa.13.sroa.10.0._259.sroa.13.0..sroa_idx.sroa_idx, align 2
  %_259.sroa.14.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 216
  store ptr %_2.i280, ptr %_259.sroa.14.0..sroa_idx, align 8
  %_259.sroa.14.sroa.4.0._259.sroa.14.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 224
  store ptr %_12.i281, ptr %_259.sroa.14.sroa.4.0._259.sroa.14.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.14.sroa.5.0._259.sroa.14.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 232
  store ptr %_16.i282, ptr %_259.sroa.14.sroa.5.0._259.sroa.14.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.14.sroa.6.0._259.sroa.14.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 240
  store ptr %_5.i283, ptr %_259.sroa.14.sroa.6.0._259.sroa.14.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.14.sroa.7.0._259.sroa.14.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 248
  store i64 %_6.i284, ptr %_259.sroa.14.sroa.7.0._259.sroa.14.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.14.sroa.8.0._259.sroa.14.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 256
  store i8 %249, ptr %_259.sroa.14.sroa.8.0._259.sroa.14.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.14.sroa.9.0._259.sroa.14.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 257
  store i8 %251, ptr %_259.sroa.14.sroa.9.0._259.sroa.14.0..sroa_idx.sroa_idx, align 1
  %_259.sroa.14.sroa.10.0._259.sroa.14.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 258
  store i8 %253, ptr %_259.sroa.14.sroa.10.0._259.sroa.14.0..sroa_idx.sroa_idx, align 2
  %_259.sroa.15.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 264
  store ptr %_2.i275, ptr %_259.sroa.15.0..sroa_idx, align 8
  %_259.sroa.15.sroa.4.0._259.sroa.15.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 272
  store ptr %_12.i276, ptr %_259.sroa.15.sroa.4.0._259.sroa.15.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.15.sroa.5.0._259.sroa.15.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 280
  store ptr %_16.i277, ptr %_259.sroa.15.sroa.5.0._259.sroa.15.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.15.sroa.6.0._259.sroa.15.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 288
  store ptr %_5.i278, ptr %_259.sroa.15.sroa.6.0._259.sroa.15.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.15.sroa.7.0._259.sroa.15.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 296
  store i64 %_6.i279, ptr %_259.sroa.15.sroa.7.0._259.sroa.15.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.15.sroa.8.0._259.sroa.15.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 304
  store i8 %260, ptr %_259.sroa.15.sroa.8.0._259.sroa.15.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.15.sroa.9.0._259.sroa.15.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 305
  store i8 %262, ptr %_259.sroa.15.sroa.9.0._259.sroa.15.0..sroa_idx.sroa_idx, align 1
  %_259.sroa.15.sroa.10.0._259.sroa.15.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 306
  store i8 %264, ptr %_259.sroa.15.sroa.10.0._259.sroa.15.0..sroa_idx.sroa_idx, align 2
  %_259.sroa.16.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 312
  store ptr %_2.i270, ptr %_259.sroa.16.0..sroa_idx, align 8
  %_259.sroa.16.sroa.4.0._259.sroa.16.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 320
  store ptr %_12.i271, ptr %_259.sroa.16.sroa.4.0._259.sroa.16.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.16.sroa.5.0._259.sroa.16.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 328
  store ptr %_16.i272, ptr %_259.sroa.16.sroa.5.0._259.sroa.16.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.16.sroa.6.0._259.sroa.16.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 336
  store ptr %_5.i273, ptr %_259.sroa.16.sroa.6.0._259.sroa.16.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.16.sroa.7.0._259.sroa.16.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 344
  store i64 %_6.i274, ptr %_259.sroa.16.sroa.7.0._259.sroa.16.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.16.sroa.8.0._259.sroa.16.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 352
  store i8 %270, ptr %_259.sroa.16.sroa.8.0._259.sroa.16.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.16.sroa.9.0._259.sroa.16.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 353
  store i8 %272, ptr %_259.sroa.16.sroa.9.0._259.sroa.16.0..sroa_idx.sroa_idx, align 1
  %_259.sroa.16.sroa.10.0._259.sroa.16.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 354
  store i8 %274, ptr %_259.sroa.16.sroa.10.0._259.sroa.16.0..sroa_idx.sroa_idx, align 2
  %_259.sroa.16.sroa.11.0._259.sroa.16.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 355
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(5) %_259.sroa.16.sroa.11.0._259.sroa.16.0..sroa_idx.sroa_idx, ptr noundef nonnull align 1 dereferenceable(5) %_259.sroa.16.sroa.11, i64 5, i1 false)
  %_259.sroa.17.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 360
  store ptr %_2.i265, ptr %_259.sroa.17.0..sroa_idx, align 8
  %_259.sroa.17.sroa.4.0._259.sroa.17.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 368
  store ptr %_12.i266, ptr %_259.sroa.17.sroa.4.0._259.sroa.17.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.17.sroa.5.0._259.sroa.17.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 376
  store ptr %_16.i267, ptr %_259.sroa.17.sroa.5.0._259.sroa.17.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.17.sroa.6.0._259.sroa.17.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 384
  store ptr %_5.i268, ptr %_259.sroa.17.sroa.6.0._259.sroa.17.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.17.sroa.7.0._259.sroa.17.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 392
  store i64 %_6.i269, ptr %_259.sroa.17.sroa.7.0._259.sroa.17.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.17.sroa.8.0._259.sroa.17.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 400
  store i8 %281, ptr %_259.sroa.17.sroa.8.0._259.sroa.17.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.17.sroa.9.0._259.sroa.17.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 401
  store i8 %283, ptr %_259.sroa.17.sroa.9.0._259.sroa.17.0..sroa_idx.sroa_idx, align 1
  %_259.sroa.17.sroa.10.0._259.sroa.17.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 402
  store i8 %285, ptr %_259.sroa.17.sroa.10.0._259.sroa.17.0..sroa_idx.sroa_idx, align 2
  %_259.sroa.17.sroa.11.0._259.sroa.17.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 403
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(5) %_259.sroa.17.sroa.11.0._259.sroa.17.0..sroa_idx.sroa_idx, ptr noundef nonnull align 1 dereferenceable(5) %_259.sroa.17.sroa.11, i64 5, i1 false)
  %_259.sroa.18.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 408
  store ptr %_2.i260, ptr %_259.sroa.18.0..sroa_idx, align 8
  %_259.sroa.18.sroa.4.0._259.sroa.18.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 416
  store ptr %_12.i261, ptr %_259.sroa.18.sroa.4.0._259.sroa.18.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.18.sroa.5.0._259.sroa.18.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 424
  store ptr %_16.i262, ptr %_259.sroa.18.sroa.5.0._259.sroa.18.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.18.sroa.6.0._259.sroa.18.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 432
  store ptr %_5.i263, ptr %_259.sroa.18.sroa.6.0._259.sroa.18.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.18.sroa.7.0._259.sroa.18.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 440
  store i64 %_6.i264, ptr %_259.sroa.18.sroa.7.0._259.sroa.18.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.18.sroa.8.0._259.sroa.18.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 448
  store i8 %291, ptr %_259.sroa.18.sroa.8.0._259.sroa.18.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.18.sroa.9.0._259.sroa.18.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 449
  store i8 %293, ptr %_259.sroa.18.sroa.9.0._259.sroa.18.0..sroa_idx.sroa_idx, align 1
  %_259.sroa.18.sroa.10.0._259.sroa.18.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 450
  store i8 %295, ptr %_259.sroa.18.sroa.10.0._259.sroa.18.0..sroa_idx.sroa_idx, align 2
  %_259.sroa.18.sroa.11.0._259.sroa.18.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 451
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(5) %_259.sroa.18.sroa.11.0._259.sroa.18.0..sroa_idx.sroa_idx, ptr noundef nonnull align 1 dereferenceable(5) %_259.sroa.18.sroa.11, i64 5, i1 false)
  %_259.sroa.19.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 456
  store ptr %_2.i255, ptr %_259.sroa.19.0..sroa_idx, align 8
  %_259.sroa.19.sroa.4.0._259.sroa.19.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 464
  store ptr %_12.i256, ptr %_259.sroa.19.sroa.4.0._259.sroa.19.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.19.sroa.5.0._259.sroa.19.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 472
  store ptr %_16.i257, ptr %_259.sroa.19.sroa.5.0._259.sroa.19.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.19.sroa.6.0._259.sroa.19.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 480
  store ptr %_5.i258, ptr %_259.sroa.19.sroa.6.0._259.sroa.19.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.19.sroa.7.0._259.sroa.19.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 488
  store i64 %_6.i259, ptr %_259.sroa.19.sroa.7.0._259.sroa.19.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.19.sroa.8.0._259.sroa.19.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 496
  store i8 %301, ptr %_259.sroa.19.sroa.8.0._259.sroa.19.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.19.sroa.9.0._259.sroa.19.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 497
  store i8 %303, ptr %_259.sroa.19.sroa.9.0._259.sroa.19.0..sroa_idx.sroa_idx, align 1
  %_259.sroa.19.sroa.10.0._259.sroa.19.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 498
  store i8 %305, ptr %_259.sroa.19.sroa.10.0._259.sroa.19.0..sroa_idx.sroa_idx, align 2
  %_259.sroa.19.sroa.11.0._259.sroa.19.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 499
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(5) %_259.sroa.19.sroa.11.0._259.sroa.19.0..sroa_idx.sroa_idx, ptr noundef nonnull align 1 dereferenceable(5) %_259.sroa.19.sroa.11, i64 5, i1 false)
  %_259.sroa.20.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 504
  store ptr %_2.i250, ptr %_259.sroa.20.0..sroa_idx, align 8
  %_259.sroa.20.sroa.4.0._259.sroa.20.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 512
  store ptr %_12.i251, ptr %_259.sroa.20.sroa.4.0._259.sroa.20.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.20.sroa.5.0._259.sroa.20.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 520
  store ptr %_16.i252, ptr %_259.sroa.20.sroa.5.0._259.sroa.20.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.20.sroa.6.0._259.sroa.20.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 528
  store ptr %_5.i253, ptr %_259.sroa.20.sroa.6.0._259.sroa.20.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.20.sroa.7.0._259.sroa.20.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 536
  store i64 %_6.i254, ptr %_259.sroa.20.sroa.7.0._259.sroa.20.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.20.sroa.8.0._259.sroa.20.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 544
  store i8 %312, ptr %_259.sroa.20.sroa.8.0._259.sroa.20.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.20.sroa.9.0._259.sroa.20.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 545
  store i8 %314, ptr %_259.sroa.20.sroa.9.0._259.sroa.20.0..sroa_idx.sroa_idx, align 1
  %_259.sroa.20.sroa.10.0._259.sroa.20.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 546
  store i8 %316, ptr %_259.sroa.20.sroa.10.0._259.sroa.20.0..sroa_idx.sroa_idx, align 2
  %_259.sroa.20.sroa.11.0._259.sroa.20.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 547
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(5) %_259.sroa.20.sroa.11.0._259.sroa.20.0..sroa_idx.sroa_idx, ptr noundef nonnull align 1 dereferenceable(5) %_259.sroa.20.sroa.11, i64 5, i1 false)
  %_259.sroa.21.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 552
  store ptr %_2.i245, ptr %_259.sroa.21.0..sroa_idx, align 8
  %_259.sroa.21.sroa.4.0._259.sroa.21.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 560
  store ptr %_12.i246, ptr %_259.sroa.21.sroa.4.0._259.sroa.21.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.21.sroa.5.0._259.sroa.21.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 568
  store ptr %_16.i247, ptr %_259.sroa.21.sroa.5.0._259.sroa.21.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.21.sroa.6.0._259.sroa.21.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 576
  store ptr %_5.i248, ptr %_259.sroa.21.sroa.6.0._259.sroa.21.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.21.sroa.7.0._259.sroa.21.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 584
  store i64 %_6.i249, ptr %_259.sroa.21.sroa.7.0._259.sroa.21.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.21.sroa.8.0._259.sroa.21.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 592
  store i8 %323, ptr %_259.sroa.21.sroa.8.0._259.sroa.21.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.21.sroa.9.0._259.sroa.21.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 593
  store i8 %325, ptr %_259.sroa.21.sroa.9.0._259.sroa.21.0..sroa_idx.sroa_idx, align 1
  %_259.sroa.21.sroa.10.0._259.sroa.21.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 594
  store i8 %327, ptr %_259.sroa.21.sroa.10.0._259.sroa.21.0..sroa_idx.sroa_idx, align 2
  %_259.sroa.21.sroa.11.0._259.sroa.21.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 595
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(5) %_259.sroa.21.sroa.11.0._259.sroa.21.0..sroa_idx.sroa_idx, ptr noundef nonnull align 1 dereferenceable(5) %_259.sroa.21.sroa.11, i64 5, i1 false)
  %_259.sroa.22.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 600
  store ptr %_2.i240, ptr %_259.sroa.22.0..sroa_idx, align 8
  %_259.sroa.22.sroa.4.0._259.sroa.22.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 608
  store ptr %_12.i241, ptr %_259.sroa.22.sroa.4.0._259.sroa.22.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.22.sroa.5.0._259.sroa.22.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 616
  store ptr %_16.i242, ptr %_259.sroa.22.sroa.5.0._259.sroa.22.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.22.sroa.6.0._259.sroa.22.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 624
  store ptr %_5.i243, ptr %_259.sroa.22.sroa.6.0._259.sroa.22.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.22.sroa.7.0._259.sroa.22.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 632
  store i64 %_6.i244, ptr %_259.sroa.22.sroa.7.0._259.sroa.22.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.22.sroa.8.0._259.sroa.22.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 640
  store i8 %333, ptr %_259.sroa.22.sroa.8.0._259.sroa.22.0..sroa_idx.sroa_idx, align 8
  %_259.sroa.22.sroa.9.0._259.sroa.22.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 641
  store i8 %335, ptr %_259.sroa.22.sroa.9.0._259.sroa.22.0..sroa_idx.sroa_idx, align 1
  %_259.sroa.22.sroa.10.0._259.sroa.22.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 642
  store i8 %337, ptr %_259.sroa.22.sroa.10.0._259.sroa.22.0..sroa_idx.sroa_idx, align 2
  %_259.sroa.22.sroa.11.0._259.sroa.22.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 643
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(5) %_259.sroa.22.sroa.11.0._259.sroa.22.0..sroa_idx.sroa_idx, ptr noundef nonnull align 1 dereferenceable(5) %_259.sroa.22.sroa.11, i64 5, i1 false)
  store i64 0, ptr %_256, align 8
  %_892.sroa.4.0._256.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 8
  store ptr inttoptr (i64 8 to ptr), ptr %_892.sroa.4.0._256.sroa_idx, align 8
  %_892.sroa.5.0._256.sroa_idx = getelementptr inbounds i8, ptr %_256, i64 16
  store i64 0, ptr %_892.sroa.5.0._256.sroa_idx, align 8
  %339 = getelementptr inbounds i8, ptr %_256, i64 24
  store ptr %_2.i300, ptr %339, align 8
  %_257.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 32
  store ptr %_12.i301, ptr %_257.sroa.4.0..sroa_idx, align 8
  %_257.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 40
  store ptr %_16.i302, ptr %_257.sroa.5.0..sroa_idx, align 8
  %_257.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 48
  store ptr %_5.i303, ptr %_257.sroa.6.0..sroa_idx, align 8
  %_257.sroa.7.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 56
  store i64 %_6.i304, ptr %_257.sroa.7.0..sroa_idx, align 8
  %_257.sroa.8.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 64
  store i8 %206, ptr %_257.sroa.8.0..sroa_idx, align 8
  %_257.sroa.9.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 65
  store i8 %208, ptr %_257.sroa.9.0..sroa_idx, align 1
  %_257.sroa.10.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 66
  store i8 %210, ptr %_257.sroa.10.0..sroa_idx, align 2
  %_257.sroa.11.0..sroa_idx = getelementptr inbounds i8, ptr %_256, i64 67
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(5) %_257.sroa.11.0..sroa_idx, ptr noundef nonnull align 1 dereferenceable(5) %_257.sroa.11, i64 5, i1 false)
  %340 = getelementptr inbounds i8, ptr %_256, i64 648
  store ptr inttoptr (i64 8 to ptr), ptr %340, align 8
  %341 = getelementptr inbounds i8, ptr %_256, i64 656
  store i64 0, ptr %341, align 8
  call void @llvm.lifetime.end.p0(i64 5, ptr nonnull %_259.sroa.16.sroa.11)
  call void @llvm.lifetime.end.p0(i64 5, ptr nonnull %_259.sroa.17.sroa.11)
  call void @llvm.lifetime.end.p0(i64 5, ptr nonnull %_259.sroa.18.sroa.11)
  call void @llvm.lifetime.end.p0(i64 5, ptr nonnull %_259.sroa.19.sroa.11)
  call void @llvm.lifetime.end.p0(i64 5, ptr nonnull %_259.sroa.20.sroa.11)
  call void @llvm.lifetime.end.p0(i64 5, ptr nonnull %_259.sroa.21.sroa.11)
  call void @llvm.lifetime.end.p0(i64 5, ptr nonnull %_259.sroa.22.sroa.11)
  call void @llvm.lifetime.end.p0(i64 5, ptr nonnull %_257.sroa.11)
; call pump_recovered::pump_amm::cpi::transfer_creator_fees_to_pump_v2
  %342 = call { i64, ptr } @_ZN14pump_recovered8pump_amm3cpi32transfer_creator_fees_to_pump_v217he7f9c8783c313da6E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(664) %_256) #28
  %343 = extractvalue { i64, ptr } %342, 0
  call void @llvm.lifetime.end.p0(i64 664, ptr nonnull %_256)
  %344 = icmp eq i64 %343, 2
  br i1 %344, label %bb154, label %bb347

bb347:                                            ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit498
  %345 = extractvalue { i64, ptr } %342, 1
  br label %bb281

bb352:                                            ; preds = %bb154
  %346 = icmp eq i32 %199, 0
  %347 = getelementptr inbounds i8, ptr %_291, i64 8
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_290.sroa.5, ptr noundef nonnull align 8 dereferenceable(24) %347, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_291)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_289, ptr noundef nonnull align 8 dereferenceable(24) %_290.sroa.5, i64 24, i1 false)
; call solana_rent::Rent::minimum_balance
  %rent = call noundef i64 @_ZN11solana_rent4Rent15minimum_balance17h06f7367e702730e1E(ptr noalias noundef nonnull readonly align 8 dereferenceable(24) %_289, i64 noundef 0) #28
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_289)
  br i1 %346, label %bb157, label %bb159

bb351:                                            ; preds = %bb154
  %348 = getelementptr inbounds i8, ptr %_291, i64 8
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_290.sroa.5, ptr noundef nonnull align 8 dereferenceable(24) %348, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_291)
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %349 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17ha4865197be4b9a2fE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_290.sroa.5) #28
  %_906.0 = extractvalue { i64, ptr } %349, 0
  %_906.1 = extractvalue { i64, ptr } %349, 1
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_289)
  br label %bb281

bb159:                                            ; preds = %bb352
  %350 = getelementptr inbounds i8, ptr %_630, i64 72
  %_298 = load ptr, ptr %350, align 8, !nonnull !2, !align !3, !noundef !2
; call solana_account_info::AccountInfo::data_is_empty
  %_297 = call noundef zeroext i1 @_ZN19solana_account_info11AccountInfo13data_is_empty17h4cbad3bc61143bcfE(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_298) #28
  br i1 %_297, label %bb171, label %bb162

bb157:                                            ; preds = %bb352
  %_296 = getelementptr inbounds i8, ptr %_630, i64 216
; call solana_account_info::AccountInfo::lamports
  %_295 = call noundef i64 @_ZN19solana_account_info11AccountInfo8lamports17h0ca2b04e77f2c7d8E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_296) #28
  %351 = call i64 @llvm.usub.sat.i64(i64 %_295, i64 %rent)
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %bump)
  %352 = getelementptr inbounds i8, ptr %ctx, i64 35
  %353 = load i8, ptr %352, align 1, !noundef !2
  store i8 %353, ptr %bump, align 1
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_322)
  store ptr @alloc_ed0c7b53f6fd188c408cb80c27c2e0f7, ptr %_322, align 8
  %354 = getelementptr inbounds i8, ptr %_322, i64 8
  store i64 13, ptr %354, align 8
  %355 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_322, i64 0, i64 1
  store ptr %old, ptr %355, align 8
  %356 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_322, i64 0, i64 1, i32 1
  store i64 32, ptr %356, align 8
  %357 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_322, i64 0, i64 2
  store ptr %bump, ptr %357, align 8
  %358 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_322, i64 0, i64 2, i32 1
  store i64 1, ptr %358, align 8
  %.not167.not = icmp ugt i64 %_295, %rent
  br i1 %.not167.not, label %bb438, label %bb184

bb162:                                            ; preds = %bb159
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_300)
  %_301 = load ptr, ptr %350, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::admin_cto::token_raw_amount
  call fastcc void @_ZN14pump_recovered9admin_cto16token_raw_amount17h5c5bab1f81c4ceb2E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(16) %_300, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_301) #28
  %359 = load i64, ptr %_300, align 8, !range !318, !noundef !2
  %360 = icmp eq i64 %359, 2
  %361 = getelementptr inbounds i8, ptr %_300, i64 8
  br i1 %360, label %bb356, label %bb355

bb356:                                            ; preds = %bb162
  %_908 = load i64, ptr %361, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_300)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_305)
  %_306 = load ptr, ptr %350, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::admin_cto::token_frozen
  call fastcc void @_ZN14pump_recovered9admin_cto12token_frozen17h1658d4a62a0640cfE(ptr noalias nocapture noundef nonnull align 8 dereferenceable(16) %_305, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_306) #28
  %362 = load i64, ptr %_305, align 8, !range !318, !noundef !2
  %363 = icmp eq i64 %362, 2
  %364 = getelementptr inbounds i8, ptr %_305, i64 8
  br i1 %363, label %bb358, label %bb357

bb355:                                            ; preds = %bb162
  %_909.1 = load ptr, ptr %361, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_300)
  br label %bb281

bb358:                                            ; preds = %bb356
  %365 = load i8, ptr %364, align 8, !range !374, !noundef !2
  %_913.not = icmp eq i8 %365, 0
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_305)
  %366 = icmp eq i64 %_908, 0
  %or.cond = or i1 %366, %_913.not
  br i1 %or.cond, label %bb171, label %bb166

bb357:                                            ; preds = %bb356
  %_914.1 = load ptr, ptr %364, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_305)
  br label %bb281

bb166:                                            ; preds = %bb358
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_310)
  %367 = getelementptr inbounds i8, ptr %_310, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %367, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_cd7b816cab57a667caebec1ad637a70c) #28
  %368 = getelementptr inbounds i8, ptr %_310, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %368, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_cd7b816cab57a667caebec1ad637a70c) #28
  %369 = getelementptr inbounds i8, ptr %_310, i64 152
  store i32 6093, ptr %369, align 8
  store i64 0, ptr %_310, align 8
  %_314.sroa.4.0._310.sroa_idx = getelementptr inbounds i8, ptr %_310, i64 8
  store ptr @alloc_ebe040a358b3132776a16f34a7b7aa5b, ptr %_314.sroa.4.0._310.sroa_idx, align 8
  %_314.sroa.4.sroa.4.0._314.sroa.4.0._310.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_310, i64 16
  store i64 38, ptr %_314.sroa.4.sroa.4.0._314.sroa.4.0._310.sroa_idx.sroa_idx, align 8
  %_314.sroa.4.sroa.5.0._314.sroa.4.0._310.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_310, i64 24
  store i32 719, ptr %_314.sroa.4.sroa.5.0._314.sroa.4.0._310.sroa_idx.sroa_idx, align 8
  %370 = getelementptr inbounds i8, ptr %_310, i64 80
  store i8 2, ptr %370, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %371 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_310) #28
  %_309.0 = extractvalue { i64, ptr } %371, 0
  %_309.1 = extractvalue { i64, ptr } %371, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_310)
  br label %bb281

bb171:                                            ; preds = %bb358, %bb159
  %amount.sroa.0.0 = phi i64 [ 0, %bb159 ], [ %_908, %bb358 ]
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %bump)
  %372 = getelementptr inbounds i8, ptr %ctx, i64 35
  %373 = load i8, ptr %372, align 1, !noundef !2
  store i8 %373, ptr %bump, align 1
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_322)
  store ptr @alloc_ed0c7b53f6fd188c408cb80c27c2e0f7, ptr %_322, align 8
  %374 = getelementptr inbounds i8, ptr %_322, i64 8
  store i64 13, ptr %374, align 8
  %375 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_322, i64 0, i64 1
  store ptr %old, ptr %375, align 8
  %376 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_322, i64 0, i64 1, i32 1
  store i64 32, ptr %376, align 8
  %377 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_322, i64 0, i64 2
  store ptr %bump, ptr %377, align 8
  %378 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_322, i64 0, i64 2, i32 1
  store i64 1, ptr %378, align 8
  %.not166 = icmp eq i64 %amount.sroa.0.0, 0
  br i1 %.not166, label %bb184, label %bb176

bb176:                                            ; preds = %bb171
  call void @llvm.lifetime.start.p0(i64 376, ptr nonnull %_347)
  %379 = getelementptr inbounds i8, ptr %_630, i64 40
  %_926 = load ptr, ptr %379, align 8, !nonnull !2, !align !3, !noundef !2
  %380 = getelementptr inbounds i8, ptr %_347, i64 24
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %380, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_926) #28
  call void @llvm.lifetime.start.p0(i64 288, ptr nonnull %_349)
  %_927 = load ptr, ptr %_630, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_349, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_927) #28
  %381 = getelementptr inbounds i8, ptr %_630, i64 80
  %_928 = load ptr, ptr %381, align 8, !nonnull !2, !align !3, !noundef !2
  %382 = getelementptr inbounds i8, ptr %_349, i64 48
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %382, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_928) #28
  %383 = getelementptr inbounds i8, ptr %_349, i64 96
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %383, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %176) #28
  %384 = getelementptr inbounds i8, ptr %_630, i64 24
  %_707 = load ptr, ptr %384, align 8, !nonnull !2, !align !3, !noundef !2
  %385 = getelementptr inbounds i8, ptr %_707, i64 88
  %_929 = load ptr, ptr %385, align 8, !nonnull !2, !align !3, !noundef !2
  %386 = getelementptr inbounds i8, ptr %_349, i64 144
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %386, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_929) #28
  %_930 = load ptr, ptr %_157, align 8, !nonnull !2, !align !3, !noundef !2
  %387 = getelementptr inbounds i8, ptr %_349, i64 192
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %387, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_930) #28
  %388 = getelementptr inbounds i8, ptr %_630, i64 32
  %_931 = load ptr, ptr %388, align 8, !nonnull !2, !align !3, !noundef !2
  %389 = getelementptr inbounds i8, ptr %_349, i64 240
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %389, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_931) #28
  %390 = getelementptr inbounds i8, ptr %_347, i64 72
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(288) %390, ptr noundef nonnull align 8 dereferenceable(288) %_349, i64 288, i1 false)
  store i64 0, ptr %_347, align 8
  %_932.sroa.4.0._347.sroa_idx = getelementptr inbounds i8, ptr %_347, i64 8
  store ptr inttoptr (i64 8 to ptr), ptr %_932.sroa.4.0._347.sroa_idx, align 8
  %_932.sroa.5.0._347.sroa_idx = getelementptr inbounds i8, ptr %_347, i64 16
  store i64 0, ptr %_932.sroa.5.0._347.sroa_idx, align 8
  %391 = getelementptr inbounds i8, ptr %_347, i64 360
  store ptr inttoptr (i64 8 to ptr), ptr %391, align 8
  %392 = getelementptr inbounds i8, ptr %_347, i64 368
  store i64 0, ptr %392, align 8
  call void @llvm.lifetime.end.p0(i64 288, ptr nonnull %_349)
; call anchor_spl::associated_token::create_idempotent
  %393 = call { i64, ptr } @_ZN10anchor_spl16associated_token17create_idempotent17h6d66b04320e05cf1E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(376) %_347) #28
  %394 = extractvalue { i64, ptr } %393, 0
  call void @llvm.lifetime.end.p0(i64 376, ptr nonnull %_347)
  %395 = icmp eq i64 %394, 2
  br i1 %395, label %bb178, label %bb275

bb178:                                            ; preds = %bb176
  %_365 = getelementptr inbounds i8, ptr %_630, i64 216
  %_715 = load ptr, ptr %384, align 8, !nonnull !2, !align !3, !noundef !2
  %396 = getelementptr inbounds i8, ptr %_715, i64 48
  %_366 = load i8, ptr %396, align 8, !noundef !2
  %397 = getelementptr inbounds i8, ptr %_715, i64 88
  %_367 = load ptr, ptr %397, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_370)
  store ptr %_322, ptr %_370, align 8
  %398 = getelementptr inbounds i8, ptr %_370, i64 8
  store i64 3, ptr %398, align 8
; call pump_recovered::collect_v2::transfer_vault_tokens
  %399 = call { i64, ptr } @_ZN14pump_recovered10collect_v221transfer_vault_tokens17h2ece254518fc977aE(ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %388, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %350, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %381, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_365, i8 noundef %_366, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_367, i64 noundef %amount.sroa.0.0, ptr noalias noundef nonnull readonly align 8 dereferenceable(16) %_370) #28
  %400 = extractvalue { i64, ptr } %399, 0
  %401 = icmp eq i64 %400, 2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_370)
  br i1 %401, label %bb184, label %bb275

bb275:                                            ; preds = %bb361, %bb438, %bb178, %bb176
  %.pn = phi { i64, ptr } [ %393, %bb176 ], [ %399, %bb178 ], [ %402, %bb438 ], [ %406, %bb361 ]
  %_0.sroa.0.4 = phi i64 [ %394, %bb176 ], [ %400, %bb178 ], [ %403, %bb438 ], [ %407, %bb361 ]
  %_0.sroa.41.4 = extractvalue { i64, ptr } %.pn, 1
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_322)
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %bump)
  br label %bb281

bb438:                                            ; preds = %bb157
; call pump_recovered::legacy_buy::native_payments::ensure_rent_exempt
  %402 = call { i64, ptr } @_ZN14pump_recovered10legacy_buy15native_payments18ensure_rent_exempt17h2694562167e4cc15E(ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_157, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_630, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %176) #28
  %403 = extractvalue { i64, ptr } %402, 0
  %404 = icmp eq i64 %403, 2
  br i1 %404, label %bb361, label %bb275

bb184:                                            ; preds = %bb361, %bb178, %bb171, %bb157
  %swept.sroa.0.1 = phi i64 [ 0, %bb157 ], [ 0, %bb171 ], [ %amount.sroa.0.0, %bb178 ], [ %351, %bb361 ]
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_322)
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %bump)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %dest)
  br label %bb185

bb361:                                            ; preds = %bb438
  %_337 = load ptr, ptr %_157, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_343)
  store ptr %_322, ptr %_343, align 8
  %405 = getelementptr inbounds i8, ptr %_343, i64 8
  store i64 3, ptr %405, align 8
; call pump_recovered::collect_v2::transfer_native
  %406 = call fastcc { i64, ptr } @_ZN14pump_recovered10collect_v215transfer_native17h08619059ffc3c295E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_337, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_296, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %176, i64 noundef %351, ptr noalias noundef nonnull readonly align 8 %_343) #28
  %407 = extractvalue { i64, ptr } %406, 0
  %408 = icmp eq i64 %407, 2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_343)
  br i1 %408, label %bb184, label %bb275

bb225:                                            ; preds = %bb185.thread, %bb222, %bb220, %bb185
  %swept.sroa.0.0690 = phi i64 [ 0, %bb185.thread ], [ %swept.sroa.0.0, %bb222 ], [ %swept.sroa.0.0, %bb220 ], [ %swept.sroa.0.0, %bb185 ]
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %pb)
  %409 = getelementptr inbounds i8, ptr %ctx, i64 39
  %_495 = load i8, ptr %409, align 1, !noundef !2
  store i8 %_495, ptr %pb, align 1
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_498)
  store ptr @alloc_837d2dfc2ca6132d7e624d246f381ca4, ptr %_498, align 8
  %410 = getelementptr inbounds i8, ptr %_498, i64 8
  store i64 14, ptr %410, align 8
  %411 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_498, i64 0, i64 1
  store ptr %mint, ptr %411, align 8
  %412 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_498, i64 0, i64 1, i32 1
  store i64 32, ptr %412, align 8
  %413 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_498, i64 0, i64 2
  store ptr %pb, ptr %413, align 8
  %414 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_498, i64 0, i64 2, i32 1
  store i64 1, ptr %414, align 8
  br i1 %shared.sroa.0.0.off0, label %bb226, label %bb241

bb187:                                            ; preds = %bb185
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_376)
  %415 = getelementptr inbounds i8, ptr %_630, i64 24
  %_718 = load ptr, ptr %415, align 8, !nonnull !2, !align !3, !noundef !2
  %416 = getelementptr inbounds i8, ptr %_718, i64 88
  %_943 = load ptr, ptr %416, align 8, !nonnull !2, !align !3, !noundef !2
  %_944 = load ptr, ptr %_943, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_376, ptr noundef nonnull align 1 dereferenceable(32) %_944, i64 32, i1 false)
  %417 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_376, ptr noundef nonnull dereferenceable(32) @alloc_e953c1d75e6a4349f2dca6892c168ab2, i64 32)
  %418 = icmp ne i32 %417, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_376)
  %419 = getelementptr inbounds i8, ptr %_630, i64 136
  %_379 = load ptr, ptr %419, align 8, !nonnull !2, !align !3, !noundef !2
; call solana_account_info::AccountInfo::data_is_empty
  %_378 = call noundef zeroext i1 @_ZN19solana_account_info11AccountInfo13data_is_empty17h4cbad3bc61143bcfE(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_379) #28
  br i1 %418, label %bb189, label %bb195.thread

bb189:                                            ; preds = %bb187
  %420 = getelementptr inbounds i8, ptr %_630, i64 72
  %_382 = load ptr, ptr %420, align 8, !nonnull !2, !align !3, !noundef !2
; call solana_account_info::AccountInfo::data_is_empty
  %_381 = call noundef zeroext i1 @_ZN19solana_account_info11AccountInfo13data_is_empty17h4cbad3bc61143bcfE(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_382) #28
  %421 = xor i1 %_381, true
  br i1 %_381, label %bb195, label %bb192

bb192:                                            ; preds = %bb189
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_386)
  %_387 = load ptr, ptr %420, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::admin_cto::token_frozen
  call fastcc void @_ZN14pump_recovered9admin_cto12token_frozen17h1658d4a62a0640cfE(ptr noalias nocapture noundef nonnull align 8 dereferenceable(16) %_386, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_387) #28
  %422 = load i64, ptr %_386, align 8, !range !318, !noundef !2
  %423 = icmp eq i64 %422, 2
  %424 = getelementptr inbounds i8, ptr %_386, i64 8
  br i1 %423, label %bb377, label %bb376

bb377:                                            ; preds = %bb192
  %425 = load i8, ptr %424, align 8, !range !374, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_386)
  %extract.t171 = icmp ne i8 %425, 0
  br label %bb195

bb376:                                            ; preds = %bb192
  %_949.1 = load ptr, ptr %424, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_386)
  br label %bb286

bb195:                                            ; preds = %bb189, %bb377
  %source_frozen.sroa.0.0.off0 = phi i1 [ %extract.t171, %bb377 ], [ false, %bb189 ]
  br i1 %_378, label %bb200, label %bb196

bb195.thread:                                     ; preds = %bb187
  br i1 %_378, label %bb205, label %bb196

bb196:                                            ; preds = %bb195.thread, %bb195
  %source_frozen.sroa.0.0.off0684 = phi i1 [ false, %bb195.thread ], [ %source_frozen.sroa.0.0.off0, %bb195 ]
  %source_present.sroa.0.1.off0681 = phi i1 [ false, %bb195.thread ], [ %421, %bb195 ]
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_392)
  %_393 = load ptr, ptr %419, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::admin_cto::token_frozen
  call fastcc void @_ZN14pump_recovered9admin_cto12token_frozen17h1658d4a62a0640cfE(ptr noalias nocapture noundef nonnull align 8 dereferenceable(16) %_392, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_393) #28
  %426 = load i64, ptr %_392, align 8, !range !318, !noundef !2
  %427 = icmp eq i64 %426, 2
  %428 = getelementptr inbounds i8, ptr %_392, i64 8
  br i1 %427, label %bb379, label %bb378

bb200:                                            ; preds = %bb195, %bb379
  %source_frozen.sroa.0.0.off0683 = phi i1 [ %source_frozen.sroa.0.0.off0684, %bb379 ], [ %source_frozen.sroa.0.0.off0, %bb195 ]
  %source_present.sroa.0.1.off0680 = phi i1 [ %source_present.sroa.0.1.off0681, %bb379 ], [ %421, %bb195 ]
  %coin_frozen.sroa.0.0.off0 = phi i1 [ %extract.t177, %bb379 ], [ false, %bb195 ]
  call void @llvm.lifetime.start.p0(i64 376, ptr nonnull %_398)
  %429 = getelementptr inbounds i8, ptr %_630, i64 40
  %_957 = load ptr, ptr %429, align 8, !nonnull !2, !align !3, !noundef !2
  %430 = getelementptr inbounds i8, ptr %_398, i64 24
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %430, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_957) #28
  call void @llvm.lifetime.start.p0(i64 288, ptr nonnull %_400)
  %_958 = load ptr, ptr %_630, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_400, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_958) #28
  %431 = getelementptr inbounds i8, ptr %_630, i64 64
  %_959 = load ptr, ptr %431, align 8, !nonnull !2, !align !3, !noundef !2
  %432 = getelementptr inbounds i8, ptr %_400, i64 48
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %432, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_959) #28
  %433 = getelementptr inbounds i8, ptr %_400, i64 96
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %433, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %47) #28
  %_728 = load ptr, ptr %415, align 8, !nonnull !2, !align !3, !noundef !2
  %434 = getelementptr inbounds i8, ptr %_728, i64 88
  %_960 = load ptr, ptr %434, align 8, !nonnull !2, !align !3, !noundef !2
  %435 = getelementptr inbounds i8, ptr %_400, i64 144
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %435, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_960) #28
  %_961 = load ptr, ptr %_157, align 8, !nonnull !2, !align !3, !noundef !2
  %436 = getelementptr inbounds i8, ptr %_400, i64 192
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %436, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_961) #28
  %437 = getelementptr inbounds i8, ptr %_630, i64 32
  %_962 = load ptr, ptr %437, align 8, !nonnull !2, !align !3, !noundef !2
  %438 = getelementptr inbounds i8, ptr %_400, i64 240
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %438, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_962) #28
  %439 = getelementptr inbounds i8, ptr %_398, i64 72
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(288) %439, ptr noundef nonnull align 8 dereferenceable(288) %_400, i64 288, i1 false)
  store i64 0, ptr %_398, align 8
  %_963.sroa.4.0._398.sroa_idx = getelementptr inbounds i8, ptr %_398, i64 8
  store ptr inttoptr (i64 8 to ptr), ptr %_963.sroa.4.0._398.sroa_idx, align 8
  %_963.sroa.5.0._398.sroa_idx = getelementptr inbounds i8, ptr %_398, i64 16
  store i64 0, ptr %_963.sroa.5.0._398.sroa_idx, align 8
  %440 = getelementptr inbounds i8, ptr %_398, i64 360
  store ptr inttoptr (i64 8 to ptr), ptr %440, align 8
  %441 = getelementptr inbounds i8, ptr %_398, i64 368
  store i64 0, ptr %441, align 8
  call void @llvm.lifetime.end.p0(i64 288, ptr nonnull %_400)
; call anchor_spl::associated_token::create_idempotent
  %442 = call { i64, ptr } @_ZN10anchor_spl16associated_token17create_idempotent17h6d66b04320e05cf1E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(376) %_398) #28
  %443 = extractvalue { i64, ptr } %442, 0
  call void @llvm.lifetime.end.p0(i64 376, ptr nonnull %_398)
  %444 = icmp eq i64 %443, 2
  br i1 %444, label %bb388, label %bb387

bb379:                                            ; preds = %bb196
  %445 = load i8, ptr %428, align 8, !range !374, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_392)
  %extract.t177 = icmp ne i8 %445, 0
  br label %bb200

bb378:                                            ; preds = %bb196
  %_954.1 = load ptr, ptr %428, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_392)
  br label %bb286

bb388:                                            ; preds = %bb200
  %source_present.sroa.0.1.off0.not = xor i1 %source_present.sroa.0.1.off0680, true
  %brmerge190 = or i1 %source_frozen.sroa.0.0.off0683, %source_present.sroa.0.1.off0.not
  %or.cond193 = and i1 %418, %brmerge190
  br i1 %or.cond193, label %bb220, label %bb205

bb387:                                            ; preds = %bb200
  %446 = extractvalue { i64, ptr } %442, 1
  br label %bb286

bb205:                                            ; preds = %bb195.thread, %bb388
  %coin_frozen.sroa.0.2.off0 = phi i1 [ %coin_frozen.sroa.0.0.off0, %bb388 ], [ false, %bb195.thread ]
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_412)
  %447 = getelementptr inbounds i8, ptr %_630, i64 64
  %_414 = load ptr, ptr %447, align 8, !nonnull !2, !align !3, !noundef !2
  %_415 = getelementptr inbounds i8, ptr %_630, i64 216
  %448 = getelementptr inbounds i8, ptr %ctx, i64 35
  %_416 = load i8, ptr %448, align 1, !noundef !2
  %449 = getelementptr inbounds i8, ptr %_630, i64 72
  %_417 = load ptr, ptr %449, align 8, !nonnull !2, !align !3, !noundef !2
  %_736 = load ptr, ptr %415, align 8, !nonnull !2, !align !3, !noundef !2
  %450 = getelementptr inbounds i8, ptr %_736, i64 48
  %_418 = load i8, ptr %450, align 8, !noundef !2
  %451 = getelementptr inbounds i8, ptr %_736, i64 88
  %_419 = load ptr, ptr %451, align 8, !nonnull !2, !align !3, !noundef !2
  %_420 = getelementptr inbounds i8, ptr %_630, i64 32
  %_421 = load ptr, ptr %_157, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::collect_v2::collect
  call void @_ZN14pump_recovered10collect_v27collect17h916e78b8aa6ecf86E(ptr noalias nocapture noundef nonnull sret([48 x i8]) align 8 dereferenceable(48) %_412, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %47, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_414, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_415, i8 noundef %_416, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_417, i8 noundef %_418, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_419, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_420, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_421) #28
  %452 = load i64, ptr %_412, align 8, !range !318, !noundef !2
  %453 = icmp eq i64 %452, 2
  %454 = getelementptr inbounds i8, ptr %_412, i64 8
  %_972.0 = load i64, ptr %454, align 8
  %455 = getelementptr inbounds i8, ptr %_412, i64 16
  %_972.1 = load ptr, ptr %455, align 8
  br i1 %453, label %bb389, label %bb390

bb220:                                            ; preds = %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit", %bb390, %bb388
  %coin_frozen.sroa.0.3.off0 = phi i1 [ %coin_frozen.sroa.0.0.off0, %bb388 ], [ %coin_frozen.sroa.0.2.off0, %bb390 ], [ %coin_frozen.sroa.0.2.off0, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit" ]
  %brmerge191 = or i1 %_378, %coin_frozen.sroa.0.3.off0
  br i1 %brmerge191, label %bb225, label %bb222

bb390:                                            ; preds = %bb205
  %_971.sroa.7.0._412.sroa_idx = getelementptr inbounds i8, ptr %_412, i64 24
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %val17.sroa.6, ptr noundef nonnull align 8 dereferenceable(24) %_971.sroa.7.0._412.sroa_idx, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_412)
  %switch199 = icmp eq i64 %452, 1
  br i1 %switch199, label %bb207, label %bb220

bb389:                                            ; preds = %bb205
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_412)
  br label %bb286

bb207:                                            ; preds = %bb390
  call void @llvm.lifetime.start.p0(i64 80, ptr nonnull %e)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_429)
; call solana_sysvar::clock::<impl solana_sysvar::Sysvar for solana_clock::Clock>::get
  call void @"_ZN13solana_sysvar5clock71_$LT$impl$u20$solana_sysvar..Sysvar$u20$for$u20$solana_clock..Clock$GT$3get17hf864a57fc372ac1bE"(ptr noalias nocapture noundef nonnull sret([48 x i8]) align 8 dereferenceable(48) %_429) #28
  %_975 = load i64, ptr %_429, align 8, !range !389, !noundef !2
  %trunc178.not = icmp eq i64 %_975, 0
  br i1 %trunc178.not, label %bb392, label %bb391

bb392:                                            ; preds = %bb207
  %_976.sroa.8.0..sroa_idx = getelementptr inbounds i8, ptr %_429, i64 40
  %_976.sroa.8.0.copyload = load i64, ptr %_976.sroa.8.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_429)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %e, ptr noundef nonnull align 1 dereferenceable(32) %old, i64 32, i1 false)
  %456 = getelementptr inbounds i8, ptr %e, i64 64
  store i64 %_976.sroa.8.0.copyload, ptr %456, align 8
  %457 = getelementptr inbounds i8, ptr %e, i64 72
  store i64 %_972.0, ptr %457, align 8
  %458 = getelementptr inbounds i8, ptr %e, i64 32
  store ptr %_972.1, ptr %458, align 8
  %quote_mint.sroa.2.0..sroa_idx = getelementptr inbounds i8, ptr %e, i64 40
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %quote_mint.sroa.2.0..sroa_idx, ptr noundef nonnull align 8 dereferenceable(24) %val17.sroa.6, i64 24, i1 false)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_435)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_437)
  call void @llvm.lifetime.start.p0(i64 80, ptr nonnull %_439)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %_439, ptr noundef nonnull align 1 dereferenceable(32) %old, i64 32, i1 false)
  %459 = getelementptr inbounds i8, ptr %_439, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %459, ptr noundef nonnull align 8 dereferenceable(32) %458, i64 32, i1 false)
  %460 = getelementptr inbounds i8, ptr %_439, i64 64
  store i64 %_976.sroa.8.0.copyload, ptr %460, align 8
  %461 = getelementptr inbounds i8, ptr %_439, i64 72
  store i64 %_972.0, ptr %461, align 8
; call <pump_recovered::CollectCreatorFeeEvent as anchor_lang::Event>::data
  call void @"_ZN77_$LT$pump_recovered..CollectCreatorFeeEvent$u20$as$u20$anchor_lang..Event$GT$4data17h385d805d76c61c69E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_437, ptr noalias noundef nonnull readonly align 8 dereferenceable(80) %_439) #28
  %462 = getelementptr inbounds i8, ptr %_437, i64 8
  %_987 = load ptr, ptr %462, align 8, !nonnull !2, !noundef !2
  %463 = getelementptr inbounds i8, ptr %_437, i64 16
  %_986 = load i64, ptr %463, align 8, !noundef !2
  store ptr %_987, ptr %_435, align 8
  %464 = getelementptr inbounds i8, ptr %_435, i64 8
  store i64 %_986, ptr %464, align 8
; call solana_program::log::sol_log_data
  call void @_ZN14solana_program3log12sol_log_data17h1e024b73f122854fE(ptr noalias noundef nonnull readonly align 8 %_435, i64 noundef 1) #28
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %_439)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_437)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_435)
  %_441 = getelementptr inbounds i8, ptr %_630, i64 312
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %authority_info, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_441) #28
  %465 = getelementptr inbounds i8, ptr %ctx, i64 46
  %authority_bump = load i8, ptr %465, align 2, !noundef !2
; call <pump_recovered::CollectCreatorFeeEvent as anchor_lang::Event>::data
  call void @"_ZN77_$LT$pump_recovered..CollectCreatorFeeEvent$u20$as$u20$anchor_lang..Event$GT$4data17h385d805d76c61c69E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %inner_data, ptr noalias noundef nonnull readonly align 8 dereferenceable(80) %e) #28
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %ix_data)
  %me.sroa.0.0.copyload.i = load i64, ptr %inner_data, align 8, !alias.scope !6248, !noalias !6251
  %me.sroa.4.0.self.sroa_idx.i = getelementptr inbounds i8, ptr %inner_data, i64 8
  %me.sroa.4.0.copyload.i = load ptr, ptr %me.sroa.4.0.self.sroa_idx.i, align 8, !alias.scope !6248, !noalias !6251, !nonnull !2, !noundef !2
  %me.sroa.5.0.self.sroa_idx.i = getelementptr inbounds i8, ptr %inner_data, i64 16
  %me.sroa.5.0.copyload.i = load i64, ptr %me.sroa.5.0.self.sroa_idx.i, align 8, !alias.scope !6248, !noalias !6251
  %_18.i = getelementptr inbounds i8, ptr %me.sroa.4.0.copyload.i, i64 %me.sroa.5.0.copyload.i
  %466 = getelementptr inbounds i8, ptr %_447, i64 32
  store ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, ptr %466, align 8
  %467 = getelementptr inbounds i8, ptr %_447, i64 40
  store ptr getelementptr inbounds (<{ [8 x i8] }>, ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, i64 1, i32 0, i64 0), ptr %467, align 8
  store ptr %me.sroa.4.0.copyload.i, ptr %_447, align 8
  %_997.sroa.4.0._447.sroa_idx = getelementptr inbounds i8, ptr %_447, i64 8
  store ptr %me.sroa.4.0.copyload.i, ptr %_997.sroa.4.0._447.sroa_idx, align 8
  %_997.sroa.5.0._447.sroa_idx = getelementptr inbounds i8, ptr %_447, i64 16
  store i64 %me.sroa.0.0.copyload.i, ptr %_997.sroa.5.0._447.sroa_idx, align 8
  %_997.sroa.6.0._447.sroa_idx = getelementptr inbounds i8, ptr %_447, i64 24
  store ptr %_18.i, ptr %_997.sroa.6.0._447.sroa_idx, align 8
; call <alloc::vec::Vec<T> as alloc::vec::spec_from_iter::SpecFromIter<T,I>>::from_iter
  call fastcc void @"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h05834ec09ece64f1E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %ix_data, ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_447) #28
  call void @llvm.lifetime.start.p0(i64 80, ptr nonnull %ix)
  %468 = getelementptr inbounds i8, ptr %ix_data, i64 8
  %_1000 = load ptr, ptr %468, align 8, !nonnull !2, !noundef !2
  %469 = getelementptr inbounds i8, ptr %ix_data, i64 16
  %_999 = load i64, ptr %469, align 8, !noundef !2
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_454)
; call alloc::alloc::exchange_malloc
  %_456 = call fastcc noundef ptr @_ZN5alloc5alloc15exchange_malloc17h6cd8dd11b0e3424eE(i64 noundef 34, i64 noundef 1) #28
  %_741 = load ptr, ptr %authority_info, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memmove.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_456, ptr noundef nonnull align 1 dereferenceable(32) %_741, i64 32, i1 false)
  %_458.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_456, i64 32
  store i8 1, ptr %_458.sroa.4.0..sroa_idx, align 1
  %_458.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_456, i64 33
  store i8 0, ptr %_458.sroa.5.0..sroa_idx, align 1
  store i64 1, ptr %_454, align 8, !alias.scope !6253, !noalias !6256
  %470 = getelementptr inbounds i8, ptr %_454, i64 8
  store ptr %_456, ptr %470, align 8, !alias.scope !6253, !noalias !6256
  %471 = getelementptr inbounds i8, ptr %_454, i64 16
  store i64 1, ptr %471, align 8, !alias.scope !6253, !noalias !6256
; call solana_instruction::Instruction::new_with_bytes
  call void @_ZN18solana_instruction11Instruction14new_with_bytes17h836fab8fb6401158E(ptr noalias nocapture noundef nonnull sret([80 x i8]) align 8 dereferenceable(80) %ix, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) @_ZN14pump_recovered2ID17h8e245cf89cf2c06bE, ptr noalias noundef nonnull readonly align 1 %_1000, i64 noundef %_999, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_454) #28
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_454)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_466)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %_466, ptr noundef nonnull align 8 dereferenceable(48) %authority_info, i64 48, i1 false)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_469)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_472)
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %_476)
  store i8 %authority_bump, ptr %_476, align 1
  store ptr @alloc_7a7952b5e0d15f2b72d0341cef6d4739, ptr %_472, align 8
  %472 = getelementptr inbounds i8, ptr %_472, i64 8
  store i64 17, ptr %472, align 8
  %473 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_472, i64 0, i64 1
  store ptr %_476, ptr %473, align 8
  %474 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_472, i64 0, i64 1, i32 1
  store i64 1, ptr %474, align 8
  store ptr %_472, ptr %_469, align 8
  %475 = getelementptr inbounds i8, ptr %_469, i64 8
  store i64 2, ptr %475, align 8
; call solana_program::program::invoke_signed
  call void @_ZN14solana_program7program13invoke_signed17h01c3b84bc1fc491eE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_462, ptr noalias noundef nonnull readonly align 8 dereferenceable(80) %ix, ptr noalias noundef nonnull readonly align 8 %_466, i64 noundef 1, ptr noalias noundef nonnull readonly align 8 %_469, i64 noundef 1) #28
  %476 = load i64, ptr %_462, align 8, !range !366, !noundef !2
  %477 = icmp eq i64 %476, -9223372036854775782
  br i1 %477, label %bb398, label %bb397

bb391:                                            ; preds = %bb207
  %478 = getelementptr inbounds i8, ptr %_429, i64 8
  %_977.sroa.0.0.copyload = load i64, ptr %478, align 8
  %_977.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_429, i64 16
  %_977.sroa.5.0.copyload = load i64, ptr %_977.sroa.5.0..sroa_idx, align 8
  %_977.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_429, i64 24
  %_977.sroa.6.0.copyload = load i64, ptr %_977.sroa.6.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_429)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_983)
  store i64 %_977.sroa.0.0.copyload, ptr %_983, align 8
  %residual18.sroa.2.0._983.sroa_idx = getelementptr inbounds i8, ptr %_983, i64 8
  store i64 %_977.sroa.5.0.copyload, ptr %residual18.sroa.2.0._983.sroa_idx, align 8
  %residual18.sroa.3.0._983.sroa_idx = getelementptr inbounds i8, ptr %_983, i64 16
  store i64 %_977.sroa.6.0.copyload, ptr %residual18.sroa.3.0._983.sroa_idx, align 8
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %479 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17ha4865197be4b9a2fE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_983) #28
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_983)
  br label %bb272

bb398:                                            ; preds = %bb392
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_476)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_472)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_469)
  %480 = getelementptr inbounds i8, ptr %_466, i64 8
  %_466.val317 = load ptr, ptr %480, align 8, !nonnull !2, !noundef !2
  %481 = getelementptr inbounds i8, ptr %_466, i64 16
  %_466.val318 = load ptr, ptr %481, align 8
  %self1.val.i.i.i.i = load i64, ptr %_466.val317, align 8, !noundef !2
  %val.i.i.i.i = add i64 %self1.val.i.i.i.i, -1
  store i64 %val.i.i.i.i, ptr %_466.val317, align 8
  %482 = icmp eq i64 %val.i.i.i.i, 0
  br i1 %482, label %bb1.i.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i"

bb1.i.i.i.i:                                      ; preds = %bb398
  %483 = getelementptr i8, ptr %_466.val317, i64 8
  %self2.val.i.i.i.i = load i64, ptr %483, align 8, !noundef !2
  %val6.i.i.i.i = add i64 %self2.val.i.i.i.i, -1
  store i64 %val6.i.i.i.i, ptr %483, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i": ; preds = %bb1.i.i.i.i, %bb398
  %484 = icmp ne ptr %_466.val318, null
  call void @llvm.assume(i1 %484)
  %self1.val.i.i2.i.i = load i64, ptr %_466.val318, align 8, !noundef !2
  %val.i.i3.i.i = add i64 %self1.val.i.i2.i.i, -1
  store i64 %val.i.i3.i.i, ptr %_466.val318, align 8
  %485 = icmp eq i64 %val.i.i3.i.i, 0
  br i1 %485, label %bb1.i.i4.i.i, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit"

bb1.i.i4.i.i:                                     ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i"
  %486 = getelementptr i8, ptr %_466.val318, i64 8
  %self2.val.i.i5.i.i = load i64, ptr %486, align 8, !noundef !2
  %val6.i.i6.i.i = add i64 %self2.val.i.i5.i.i, -1
  store i64 %val6.i.i6.i.i, ptr %486, align 8
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i", %bb1.i.i4.i.i
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_466)
  %_1.val.i = load i64, ptr %ix, align 8, !alias.scope !6258, !noundef !2
  %487 = icmp eq i64 %_1.val.i, 0
  br i1 %487, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i", label %bb2.i.i.i.i

bb2.i.i.i.i:                                      ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit"
  %488 = getelementptr inbounds i8, ptr %ix, i64 8
  %_1.val2.i = load ptr, ptr %488, align 8, !alias.scope !6258
  %489 = icmp ne ptr %_1.val2.i, null
  call void @llvm.assume(i1 %489)
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i": ; preds = %bb2.i.i.i.i, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit"
  %490 = getelementptr inbounds i8, ptr %ix, i64 24
  %.val.i = load i64, ptr %490, align 8, !alias.scope !6258, !noundef !2
  %491 = icmp eq i64 %.val.i, 0
  br i1 %491, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i"
  %492 = getelementptr inbounds i8, ptr %ix, i64 32
  %.val1.i = load ptr, ptr %492, align 8, !alias.scope !6258
  %493 = icmp ne ptr %.val1.i, null
  call void @llvm.assume(i1 %493)
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data)
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %e)
  br label %bb220

bb397:                                            ; preds = %bb392
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %494 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17ha4865197be4b9a2fE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_462) #28
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_476)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_472)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_469)
  %495 = getelementptr inbounds i8, ptr %_466, i64 8
  %_466.val = load ptr, ptr %495, align 8, !nonnull !2, !noundef !2
  %496 = getelementptr inbounds i8, ptr %_466, i64 16
  %_466.val316 = load ptr, ptr %496, align 8
  %self1.val.i.i.i.i501 = load i64, ptr %_466.val, align 8, !noundef !2
  %val.i.i.i.i502 = add i64 %self1.val.i.i.i.i501, -1
  store i64 %val.i.i.i.i502, ptr %_466.val, align 8
  %497 = icmp eq i64 %val.i.i.i.i502, 0
  br i1 %497, label %bb1.i.i.i.i509, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i503"

bb1.i.i.i.i509:                                   ; preds = %bb397
  %498 = getelementptr i8, ptr %_466.val, i64 8
  %self2.val.i.i.i.i510 = load i64, ptr %498, align 8, !noundef !2
  %val6.i.i.i.i511 = add i64 %self2.val.i.i.i.i510, -1
  store i64 %val6.i.i.i.i511, ptr %498, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i503"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i503": ; preds = %bb1.i.i.i.i509, %bb397
  %499 = icmp ne ptr %_466.val316, null
  call void @llvm.assume(i1 %499)
  %self1.val.i.i2.i.i504 = load i64, ptr %_466.val316, align 8, !noundef !2
  %val.i.i3.i.i505 = add i64 %self1.val.i.i2.i.i504, -1
  store i64 %val.i.i3.i.i505, ptr %_466.val316, align 8
  %500 = icmp eq i64 %val.i.i3.i.i505, 0
  br i1 %500, label %bb1.i.i4.i.i506, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit512"

bb1.i.i4.i.i506:                                  ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i503"
  %501 = getelementptr i8, ptr %_466.val316, i64 8
  %self2.val.i.i5.i.i507 = load i64, ptr %501, align 8, !noundef !2
  %val6.i.i6.i.i508 = add i64 %self2.val.i.i5.i.i507, -1
  store i64 %val6.i.i6.i.i508, ptr %501, align 8
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit512"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit512": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i503", %bb1.i.i4.i.i506
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_466)
  %_1.val.i513 = load i64, ptr %ix, align 8, !alias.scope !6261, !noundef !2
  %502 = icmp eq i64 %_1.val.i513, 0
  br i1 %502, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i516", label %bb2.i.i.i.i514

bb2.i.i.i.i514:                                   ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit512"
  %503 = getelementptr inbounds i8, ptr %ix, i64 8
  %_1.val2.i515 = load ptr, ptr %503, align 8, !alias.scope !6261
  %504 = icmp ne ptr %_1.val2.i515, null
  call void @llvm.assume(i1 %504)
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i516"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i516": ; preds = %bb2.i.i.i.i514, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit512"
  %505 = getelementptr inbounds i8, ptr %ix, i64 24
  %.val.i517 = load i64, ptr %505, align 8, !alias.scope !6261, !noundef !2
  %506 = icmp eq i64 %.val.i517, 0
  br i1 %506, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit520", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i518"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i518": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i516"
  %507 = getelementptr inbounds i8, ptr %ix, i64 32
  %.val1.i519 = load ptr, ptr %507, align 8, !alias.scope !6261
  %508 = icmp ne ptr %.val1.i519, null
  call void @llvm.assume(i1 %508)
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit520"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit520": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i516", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i518"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data)
  br label %bb272

bb272:                                            ; preds = %bb391, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit520"
  %.pn179 = phi { i64, ptr } [ %479, %bb391 ], [ %494, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit520" ]
  %_0.sroa.0.6 = extractvalue { i64, ptr } %.pn179, 0
  %_0.sroa.41.6 = extractvalue { i64, ptr } %.pn179, 1
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %e)
  br label %bb286

bb222:                                            ; preds = %bb220
  %509 = getelementptr inbounds i8, ptr %_630, i64 88
  %_1010 = load ptr, ptr %509, align 8, !nonnull !2, !align !3, !noundef !2
  %510 = getelementptr inbounds i8, ptr %_492, i64 24
  call void @llvm.lifetime.start.p0(i64 472, ptr nonnull %_492)
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %510, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1010) #28
  %_744 = load ptr, ptr %415, align 8, !nonnull !2, !align !3, !noundef !2
  %511 = getelementptr inbounds i8, ptr %_744, i64 88
  %_1011 = load ptr, ptr %511, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %cpi_accounts, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1011) #28
  %512 = getelementptr inbounds i8, ptr %_630, i64 32
  %_1012 = load ptr, ptr %512, align 8, !nonnull !2, !align !3, !noundef !2
  %513 = getelementptr inbounds i8, ptr %cpi_accounts, i64 48
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %513, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1012) #28
  %514 = getelementptr inbounds i8, ptr %cpi_accounts, i64 96
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %514, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %47) #28
  %515 = getelementptr inbounds i8, ptr %_630, i64 128
  %_1013 = load ptr, ptr %515, align 8, !nonnull !2, !align !3, !noundef !2
  %516 = getelementptr inbounds i8, ptr %cpi_accounts, i64 144
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %516, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1013) #28
  %_1014 = load ptr, ptr %419, align 8, !nonnull !2, !align !3, !noundef !2
  %517 = getelementptr inbounds i8, ptr %cpi_accounts, i64 192
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %517, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1014) #28
  %518 = getelementptr inbounds i8, ptr %_630, i64 64
  %_1015 = load ptr, ptr %518, align 8, !nonnull !2, !align !3, !noundef !2
  %519 = getelementptr inbounds i8, ptr %cpi_accounts, i64 240
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %519, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1015) #28
  %520 = getelementptr inbounds i8, ptr %_630, i64 120
  %_1016 = load ptr, ptr %520, align 8, !nonnull !2, !align !3, !noundef !2
  %521 = getelementptr inbounds i8, ptr %cpi_accounts, i64 288
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %521, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1016) #28
  %_1017 = load ptr, ptr %509, align 8, !nonnull !2, !align !3, !noundef !2
  %522 = getelementptr inbounds i8, ptr %cpi_accounts, i64 336
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %522, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1017) #28
  %523 = getelementptr inbounds i8, ptr %_492, i64 72
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(384) %523, ptr noundef nonnull align 8 dereferenceable(384) %cpi_accounts, i64 384, i1 false)
  store i64 0, ptr %_492, align 8
  %_1018.sroa.4.0._492.sroa_idx = getelementptr inbounds i8, ptr %_492, i64 8
  store ptr inttoptr (i64 8 to ptr), ptr %_1018.sroa.4.0._492.sroa_idx, align 8
  %_1018.sroa.5.0._492.sroa_idx = getelementptr inbounds i8, ptr %_492, i64 16
  store i64 0, ptr %_1018.sroa.5.0._492.sroa_idx, align 8
  %524 = getelementptr inbounds i8, ptr %_492, i64 456
  store ptr inttoptr (i64 8 to ptr), ptr %524, align 8
  %525 = getelementptr inbounds i8, ptr %_492, i64 464
  store i64 0, ptr %525, align 8
; call pump_recovered::pump_amm::cpi::collect_coin_creator_fee
  %526 = call { i64, ptr } @_ZN14pump_recovered8pump_amm3cpi24collect_coin_creator_fee17h3c275eaedaa4ba35E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(472) %_492) #28
  %527 = extractvalue { i64, ptr } %526, 0
  call void @llvm.lifetime.end.p0(i64 472, ptr nonnull %_492)
  %528 = icmp eq i64 %527, 2
  br i1 %528, label %bb225, label %bb409

bb409:                                            ; preds = %bb222
  %529 = extractvalue { i64, ptr } %526, 1
  br label %bb286

bb241:                                            ; preds = %bb240, %bb225
  %_761 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %530 = getelementptr inbounds i8, ptr %_761, i64 8
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %530, ptr noundef nonnull align 1 dereferenceable(32) %target, i64 32, i1 false)
  %_762 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %531 = getelementptr inbounds i8, ptr %_762, i64 165
  %532 = zext i1 %holder1.sroa.0.1.off0 to i8
  store i8 %532, ptr %531, align 1
  %_763 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %533 = getelementptr inbounds i8, ptr %_763, i64 163
  %534 = zext i1 %cashback.sroa.0.0.off0 to i8
  store i8 %534, ptr %533, align 1
  br i1 %switch196, label %bb242, label %bb243

bb226:                                            ; preds = %bb225
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %val21.sroa.6)
  br i1 %holder1.sroa.0.1.off0, label %bb229, label %bb228

bb228:                                            ; preds = %bb226
  %val21.sroa.0.0.copyload = load i8, ptr %new, align 1
  %val21.sroa.6.0.new.sroa_idx = getelementptr inbounds i8, ptr %new, i64 1
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %val21.sroa.6, ptr noundef nonnull align 1 dereferenceable(32) %val21.sroa.6.0.new.sroa_idx, i64 32, i1 false)
  br label %bb229

bb229:                                            ; preds = %bb226, %bb228
  %val21.sroa.0.0 = phi i8 [ %val21.sroa.0.0.copyload, %bb228 ], [ 0, %bb226 ]
  %535 = getelementptr inbounds i8, ptr %_630, i64 152
  %_507 = load ptr, ptr %535, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6264)
  %_2.i235 = load ptr, ptr %_507, align 8, !alias.scope !6264, !noalias !6267, !nonnull !2, !align !372, !noundef !2
  %536 = getelementptr inbounds i8, ptr %_507, i64 8
  %_12.i236 = load ptr, ptr %536, align 8, !alias.scope !6264, !noalias !6267, !nonnull !2, !noundef !2
  %self.val.i523 = load i64, ptr %_12.i236, align 8, !noalias !6269, !noundef !2
  %cond.i524 = icmp ne i64 %self.val.i523, 0
  call void @llvm.assume(i1 %cond.i524), !noalias !6269
  %strong1.i525 = add i64 %self.val.i523, 1
  store i64 %strong1.i525, ptr %_12.i236, align 8, !noalias !6269
  %_7.i526 = icmp eq i64 %strong1.i525, 0
  br i1 %_7.i526, label %bb4.i527, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit528

bb4.i527:                                         ; preds = %bb229
  call void @llvm.trap(), !noalias !6269
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit528: ; preds = %bb229
  %537 = getelementptr inbounds i8, ptr %_507, i64 16
  %_16.i237 = load ptr, ptr %537, align 8, !alias.scope !6264, !noalias !6267, !nonnull !2, !noundef !2
  %self.val.i529 = load i64, ptr %_16.i237, align 8, !noalias !6269, !noundef !2
  %cond.i530 = icmp ne i64 %self.val.i529, 0
  call void @llvm.assume(i1 %cond.i530), !noalias !6269
  %strong1.i531 = add i64 %self.val.i529, 1
  store i64 %strong1.i531, ptr %_16.i237, align 8, !noalias !6269
  %_7.i532 = icmp eq i64 %strong1.i531, 0
  br i1 %_7.i532, label %bb4.i533, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit534

bb4.i533:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit528
  call void @llvm.trap(), !noalias !6269
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit534: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit528
  %538 = getelementptr inbounds i8, ptr %_507, i64 24
  %_5.i238 = load ptr, ptr %538, align 8, !alias.scope !6264, !noalias !6267, !nonnull !2, !align !372, !noundef !2
  %539 = getelementptr inbounds i8, ptr %_507, i64 32
  %_6.i239 = load i64, ptr %539, align 8, !alias.scope !6264, !noalias !6267, !noundef !2
  %540 = getelementptr inbounds i8, ptr %_507, i64 40
  %541 = load i8, ptr %540, align 8, !range !374, !alias.scope !6264, !noalias !6267, !noundef !2
  %542 = getelementptr inbounds i8, ptr %_507, i64 41
  %543 = load i8, ptr %542, align 1, !range !374, !alias.scope !6264, !noalias !6267, !noundef !2
  %544 = getelementptr inbounds i8, ptr %_507, i64 42
  %545 = load i8, ptr %544, align 2, !range !374, !alias.scope !6264, !noalias !6267, !noundef !2
  %546 = getelementptr inbounds i8, ptr %_630, i64 104
  %_510 = load ptr, ptr %546, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6270)
  %_2.i230 = load ptr, ptr %_510, align 8, !alias.scope !6270, !noalias !6273, !nonnull !2, !align !372, !noundef !2
  %547 = getelementptr inbounds i8, ptr %_510, i64 8
  %_12.i231 = load ptr, ptr %547, align 8, !alias.scope !6270, !noalias !6273, !nonnull !2, !noundef !2
  %self.val.i535 = load i64, ptr %_12.i231, align 8, !noalias !6275, !noundef !2
  %cond.i536 = icmp ne i64 %self.val.i535, 0
  call void @llvm.assume(i1 %cond.i536), !noalias !6275
  %strong1.i537 = add i64 %self.val.i535, 1
  store i64 %strong1.i537, ptr %_12.i231, align 8, !noalias !6275
  %_7.i538 = icmp eq i64 %strong1.i537, 0
  br i1 %_7.i538, label %bb4.i539, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit540

bb4.i539:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit534
  call void @llvm.trap(), !noalias !6275
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit540: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit534
  %548 = getelementptr inbounds i8, ptr %_510, i64 16
  %_16.i232 = load ptr, ptr %548, align 8, !alias.scope !6270, !noalias !6273, !nonnull !2, !noundef !2
  %self.val.i541 = load i64, ptr %_16.i232, align 8, !noalias !6275, !noundef !2
  %cond.i542 = icmp ne i64 %self.val.i541, 0
  call void @llvm.assume(i1 %cond.i542), !noalias !6275
  %strong1.i543 = add i64 %self.val.i541, 1
  store i64 %strong1.i543, ptr %_16.i232, align 8, !noalias !6275
  %_7.i544 = icmp eq i64 %strong1.i543, 0
  br i1 %_7.i544, label %bb4.i545, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit546

bb4.i545:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit540
  call void @llvm.trap(), !noalias !6275
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit546: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit540
  %549 = getelementptr inbounds i8, ptr %_510, i64 24
  %_5.i233 = load ptr, ptr %549, align 8, !alias.scope !6270, !noalias !6273, !nonnull !2, !align !372, !noundef !2
  %550 = getelementptr inbounds i8, ptr %_510, i64 32
  %_6.i234 = load i64, ptr %550, align 8, !alias.scope !6270, !noalias !6273, !noundef !2
  %551 = getelementptr inbounds i8, ptr %_510, i64 40
  %552 = load i8, ptr %551, align 8, !range !374, !alias.scope !6270, !noalias !6273, !noundef !2
  %553 = getelementptr inbounds i8, ptr %_510, i64 41
  %554 = load i8, ptr %553, align 1, !range !374, !alias.scope !6270, !noalias !6273, !noundef !2
  %555 = getelementptr inbounds i8, ptr %_510, i64 42
  %556 = load i8, ptr %555, align 2, !range !374, !alias.scope !6270, !noalias !6273, !noundef !2
  %_512 = load ptr, ptr %_630, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6276)
  %_2.i225 = load ptr, ptr %_512, align 8, !alias.scope !6276, !noalias !6279, !nonnull !2, !align !372, !noundef !2
  %557 = getelementptr inbounds i8, ptr %_512, i64 8
  %_12.i226 = load ptr, ptr %557, align 8, !alias.scope !6276, !noalias !6279, !nonnull !2, !noundef !2
  %self.val.i547 = load i64, ptr %_12.i226, align 8, !noalias !6281, !noundef !2
  %cond.i548 = icmp ne i64 %self.val.i547, 0
  call void @llvm.assume(i1 %cond.i548), !noalias !6281
  %strong1.i549 = add i64 %self.val.i547, 1
  store i64 %strong1.i549, ptr %_12.i226, align 8, !noalias !6281
  %_7.i550 = icmp eq i64 %strong1.i549, 0
  br i1 %_7.i550, label %bb4.i551, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit552

bb4.i551:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit546
  call void @llvm.trap(), !noalias !6281
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit552: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit546
  %558 = getelementptr inbounds i8, ptr %_512, i64 16
  %_16.i227 = load ptr, ptr %558, align 8, !alias.scope !6276, !noalias !6279, !nonnull !2, !noundef !2
  %self.val.i553 = load i64, ptr %_16.i227, align 8, !noalias !6281, !noundef !2
  %cond.i554 = icmp ne i64 %self.val.i553, 0
  call void @llvm.assume(i1 %cond.i554), !noalias !6281
  %strong1.i555 = add i64 %self.val.i553, 1
  store i64 %strong1.i555, ptr %_16.i227, align 8, !noalias !6281
  %_7.i556 = icmp eq i64 %strong1.i555, 0
  br i1 %_7.i556, label %bb4.i557, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit558

bb4.i557:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit552
  call void @llvm.trap(), !noalias !6281
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit558: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit552
  %559 = getelementptr inbounds i8, ptr %_512, i64 24
  %_5.i228 = load ptr, ptr %559, align 8, !alias.scope !6276, !noalias !6279, !nonnull !2, !align !372, !noundef !2
  %560 = getelementptr inbounds i8, ptr %_512, i64 32
  %_6.i229 = load i64, ptr %560, align 8, !alias.scope !6276, !noalias !6279, !noundef !2
  %561 = getelementptr inbounds i8, ptr %_512, i64 40
  %562 = load i8, ptr %561, align 8, !range !374, !alias.scope !6276, !noalias !6279, !noundef !2
  %563 = getelementptr inbounds i8, ptr %_512, i64 41
  %564 = load i8, ptr %563, align 1, !range !374, !alias.scope !6276, !noalias !6279, !noundef !2
  %565 = getelementptr inbounds i8, ptr %_512, i64 42
  %566 = load i8, ptr %565, align 2, !range !374, !alias.scope !6276, !noalias !6279, !noundef !2
  %567 = getelementptr inbounds i8, ptr %_630, i64 8
  %_1113 = load ptr, ptr %567, align 8, !nonnull !2, !noundef !2
  %_514 = load ptr, ptr %_1113, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6282)
  %_2.i220 = load ptr, ptr %_514, align 8, !alias.scope !6282, !noalias !6285, !nonnull !2, !align !372, !noundef !2
  %568 = getelementptr inbounds i8, ptr %_514, i64 8
  %_12.i221 = load ptr, ptr %568, align 8, !alias.scope !6282, !noalias !6285, !nonnull !2, !noundef !2
  %self.val.i559 = load i64, ptr %_12.i221, align 8, !noalias !6287, !noundef !2
  %cond.i560 = icmp ne i64 %self.val.i559, 0
  call void @llvm.assume(i1 %cond.i560), !noalias !6287
  %strong1.i561 = add i64 %self.val.i559, 1
  store i64 %strong1.i561, ptr %_12.i221, align 8, !noalias !6287
  %_7.i562 = icmp eq i64 %strong1.i561, 0
  br i1 %_7.i562, label %bb4.i563, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit564

bb4.i563:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit558
  call void @llvm.trap(), !noalias !6287
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit564: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit558
  %569 = getelementptr inbounds i8, ptr %_514, i64 16
  %_16.i222 = load ptr, ptr %569, align 8, !alias.scope !6282, !noalias !6285, !nonnull !2, !noundef !2
  %self.val.i565 = load i64, ptr %_16.i222, align 8, !noalias !6287, !noundef !2
  %cond.i566 = icmp ne i64 %self.val.i565, 0
  call void @llvm.assume(i1 %cond.i566), !noalias !6287
  %strong1.i567 = add i64 %self.val.i565, 1
  store i64 %strong1.i567, ptr %_16.i222, align 8, !noalias !6287
  %_7.i568 = icmp eq i64 %strong1.i567, 0
  br i1 %_7.i568, label %bb4.i569, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit570

bb4.i569:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit564
  call void @llvm.trap(), !noalias !6287
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit570: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit564
  %570 = getelementptr inbounds i8, ptr %_514, i64 24
  %_5.i223 = load ptr, ptr %570, align 8, !alias.scope !6282, !noalias !6285, !nonnull !2, !align !372, !noundef !2
  %571 = getelementptr inbounds i8, ptr %_514, i64 32
  %_6.i224 = load i64, ptr %571, align 8, !alias.scope !6282, !noalias !6285, !noundef !2
  %572 = getelementptr inbounds i8, ptr %_514, i64 40
  %573 = load i8, ptr %572, align 8, !range !374, !alias.scope !6282, !noalias !6285, !noundef !2
  %574 = getelementptr inbounds i8, ptr %_514, i64 41
  %575 = load i8, ptr %574, align 1, !range !374, !alias.scope !6282, !noalias !6285, !noundef !2
  %576 = getelementptr inbounds i8, ptr %_514, i64 42
  %577 = load i8, ptr %576, align 2, !range !374, !alias.scope !6282, !noalias !6285, !noundef !2
  %_516 = load ptr, ptr %48, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6288)
  %_2.i215 = load ptr, ptr %_516, align 8, !alias.scope !6288, !noalias !6291, !nonnull !2, !align !372, !noundef !2
  %578 = getelementptr inbounds i8, ptr %_516, i64 8
  %_12.i216 = load ptr, ptr %578, align 8, !alias.scope !6288, !noalias !6291, !nonnull !2, !noundef !2
  %self.val.i571 = load i64, ptr %_12.i216, align 8, !noalias !6293, !noundef !2
  %cond.i572 = icmp ne i64 %self.val.i571, 0
  call void @llvm.assume(i1 %cond.i572), !noalias !6293
  %strong1.i573 = add i64 %self.val.i571, 1
  store i64 %strong1.i573, ptr %_12.i216, align 8, !noalias !6293
  %_7.i574 = icmp eq i64 %strong1.i573, 0
  br i1 %_7.i574, label %bb4.i575, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit576

bb4.i575:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit570
  call void @llvm.trap(), !noalias !6293
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit576: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit570
  %579 = getelementptr inbounds i8, ptr %_516, i64 16
  %_16.i217 = load ptr, ptr %579, align 8, !alias.scope !6288, !noalias !6291, !nonnull !2, !noundef !2
  %self.val.i577 = load i64, ptr %_16.i217, align 8, !noalias !6293, !noundef !2
  %cond.i578 = icmp ne i64 %self.val.i577, 0
  call void @llvm.assume(i1 %cond.i578), !noalias !6293
  %strong1.i579 = add i64 %self.val.i577, 1
  store i64 %strong1.i579, ptr %_16.i217, align 8, !noalias !6293
  %_7.i580 = icmp eq i64 %strong1.i579, 0
  br i1 %_7.i580, label %bb4.i581, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit582

bb4.i581:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit576
  call void @llvm.trap(), !noalias !6293
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit582: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit576
  %580 = getelementptr inbounds i8, ptr %_516, i64 24
  %_5.i218 = load ptr, ptr %580, align 8, !alias.scope !6288, !noalias !6291, !nonnull !2, !align !372, !noundef !2
  %581 = getelementptr inbounds i8, ptr %_516, i64 32
  %_6.i219 = load i64, ptr %581, align 8, !alias.scope !6288, !noalias !6291, !noundef !2
  %582 = getelementptr inbounds i8, ptr %_516, i64 40
  %583 = load i8, ptr %582, align 8, !range !374, !alias.scope !6288, !noalias !6291, !noundef !2
  %584 = getelementptr inbounds i8, ptr %_516, i64 41
  %585 = load i8, ptr %584, align 1, !range !374, !alias.scope !6288, !noalias !6291, !noundef !2
  %586 = getelementptr inbounds i8, ptr %_516, i64 42
  %587 = load i8, ptr %586, align 2, !range !374, !alias.scope !6288, !noalias !6291, !noundef !2
  %_518 = load ptr, ptr %141, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6294)
  %_2.i210 = load ptr, ptr %_518, align 8, !alias.scope !6294, !noalias !6297, !nonnull !2, !align !372, !noundef !2
  %588 = getelementptr inbounds i8, ptr %_518, i64 8
  %_12.i211 = load ptr, ptr %588, align 8, !alias.scope !6294, !noalias !6297, !nonnull !2, !noundef !2
  %self.val.i583 = load i64, ptr %_12.i211, align 8, !noalias !6299, !noundef !2
  %cond.i584 = icmp ne i64 %self.val.i583, 0
  call void @llvm.assume(i1 %cond.i584), !noalias !6299
  %strong1.i585 = add i64 %self.val.i583, 1
  store i64 %strong1.i585, ptr %_12.i211, align 8, !noalias !6299
  %_7.i586 = icmp eq i64 %strong1.i585, 0
  br i1 %_7.i586, label %bb4.i587, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit588

bb4.i587:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit582
  call void @llvm.trap(), !noalias !6299
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit588: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit582
  %589 = getelementptr inbounds i8, ptr %_518, i64 16
  %_16.i212 = load ptr, ptr %589, align 8, !alias.scope !6294, !noalias !6297, !nonnull !2, !noundef !2
  %self.val.i589 = load i64, ptr %_16.i212, align 8, !noalias !6299, !noundef !2
  %cond.i590 = icmp ne i64 %self.val.i589, 0
  call void @llvm.assume(i1 %cond.i590), !noalias !6299
  %strong1.i591 = add i64 %self.val.i589, 1
  store i64 %strong1.i591, ptr %_16.i212, align 8, !noalias !6299
  %_7.i592 = icmp eq i64 %strong1.i591, 0
  br i1 %_7.i592, label %bb4.i593, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit594

bb4.i593:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit588
  call void @llvm.trap(), !noalias !6299
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit594: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit588
  %590 = getelementptr inbounds i8, ptr %_518, i64 24
  %_5.i213 = load ptr, ptr %590, align 8, !alias.scope !6294, !noalias !6297, !nonnull !2, !align !372, !noundef !2
  %591 = getelementptr inbounds i8, ptr %_518, i64 32
  %_6.i214 = load i64, ptr %591, align 8, !alias.scope !6294, !noalias !6297, !noundef !2
  %592 = getelementptr inbounds i8, ptr %_518, i64 40
  %593 = load i8, ptr %592, align 8, !range !374, !alias.scope !6294, !noalias !6297, !noundef !2
  %594 = getelementptr inbounds i8, ptr %_518, i64 41
  %595 = load i8, ptr %594, align 1, !range !374, !alias.scope !6294, !noalias !6297, !noundef !2
  %596 = getelementptr inbounds i8, ptr %_518, i64 42
  %597 = load i8, ptr %596, align 2, !range !374, !alias.scope !6294, !noalias !6297, !noundef !2
  %598 = getelementptr inbounds i8, ptr %_630, i64 160
  %_520 = load ptr, ptr %598, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6300)
  %_2.i205 = load ptr, ptr %_520, align 8, !alias.scope !6300, !noalias !6303, !nonnull !2, !align !372, !noundef !2
  %599 = getelementptr inbounds i8, ptr %_520, i64 8
  %_12.i206 = load ptr, ptr %599, align 8, !alias.scope !6300, !noalias !6303, !nonnull !2, !noundef !2
  %self.val.i595 = load i64, ptr %_12.i206, align 8, !noalias !6305, !noundef !2
  %cond.i596 = icmp ne i64 %self.val.i595, 0
  call void @llvm.assume(i1 %cond.i596), !noalias !6305
  %strong1.i597 = add i64 %self.val.i595, 1
  store i64 %strong1.i597, ptr %_12.i206, align 8, !noalias !6305
  %_7.i598 = icmp eq i64 %strong1.i597, 0
  br i1 %_7.i598, label %bb4.i599, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit600

bb4.i599:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit594
  call void @llvm.trap(), !noalias !6305
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit600: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit594
  %600 = getelementptr inbounds i8, ptr %_520, i64 16
  %_16.i207 = load ptr, ptr %600, align 8, !alias.scope !6300, !noalias !6303, !nonnull !2, !noundef !2
  %self.val.i601 = load i64, ptr %_16.i207, align 8, !noalias !6305, !noundef !2
  %cond.i602 = icmp ne i64 %self.val.i601, 0
  call void @llvm.assume(i1 %cond.i602), !noalias !6305
  %strong1.i603 = add i64 %self.val.i601, 1
  store i64 %strong1.i603, ptr %_16.i207, align 8, !noalias !6305
  %_7.i604 = icmp eq i64 %strong1.i603, 0
  br i1 %_7.i604, label %bb4.i605, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit606

bb4.i605:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit600
  call void @llvm.trap(), !noalias !6305
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit606: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit600
  %601 = getelementptr inbounds i8, ptr %_520, i64 24
  %_5.i208 = load ptr, ptr %601, align 8, !alias.scope !6300, !noalias !6303, !nonnull !2, !align !372, !noundef !2
  %602 = getelementptr inbounds i8, ptr %_520, i64 32
  %_6.i209 = load i64, ptr %602, align 8, !alias.scope !6300, !noalias !6303, !noundef !2
  %603 = getelementptr inbounds i8, ptr %_520, i64 40
  %604 = load i8, ptr %603, align 8, !range !374, !alias.scope !6300, !noalias !6303, !noundef !2
  %605 = getelementptr inbounds i8, ptr %_520, i64 41
  %606 = load i8, ptr %605, align 1, !range !374, !alias.scope !6300, !noalias !6303, !noundef !2
  %607 = getelementptr inbounds i8, ptr %_520, i64 42
  %608 = load i8, ptr %607, align 2, !range !374, !alias.scope !6300, !noalias !6303, !noundef !2
  %_522 = load ptr, ptr %535, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !6306)
  %_2.i = load ptr, ptr %_522, align 8, !alias.scope !6306, !noalias !6309, !nonnull !2, !align !372, !noundef !2
  %609 = getelementptr inbounds i8, ptr %_522, i64 8
  %_12.i = load ptr, ptr %609, align 8, !alias.scope !6306, !noalias !6309, !nonnull !2, !noundef !2
  %self.val.i607 = load i64, ptr %_12.i, align 8, !noalias !6311, !noundef !2
  %cond.i608 = icmp ne i64 %self.val.i607, 0
  call void @llvm.assume(i1 %cond.i608), !noalias !6311
  %strong1.i609 = add i64 %self.val.i607, 1
  store i64 %strong1.i609, ptr %_12.i, align 8, !noalias !6311
  %_7.i610 = icmp eq i64 %strong1.i609, 0
  br i1 %_7.i610, label %bb4.i611, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit612

bb4.i611:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit606
  call void @llvm.trap(), !noalias !6311
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit612: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit606
  %610 = getelementptr inbounds i8, ptr %_522, i64 16
  %_16.i = load ptr, ptr %610, align 8, !alias.scope !6306, !noalias !6309, !nonnull !2, !noundef !2
  %self.val.i613 = load i64, ptr %_16.i, align 8, !noalias !6311, !noundef !2
  %cond.i614 = icmp ne i64 %self.val.i613, 0
  call void @llvm.assume(i1 %cond.i614), !noalias !6311
  %strong1.i615 = add i64 %self.val.i613, 1
  store i64 %strong1.i615, ptr %_16.i, align 8, !noalias !6311
  %_7.i616 = icmp eq i64 %strong1.i615, 0
  br i1 %_7.i616, label %bb4.i617, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit618

bb4.i617:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit612
  call void @llvm.trap(), !noalias !6311
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit618: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h485e41ed5d8892acE.exit612
  %611 = getelementptr inbounds i8, ptr %_522, i64 24
  %_5.i = load ptr, ptr %611, align 8, !alias.scope !6306, !noalias !6309, !nonnull !2, !align !372, !noundef !2
  %612 = getelementptr inbounds i8, ptr %_522, i64 32
  %_6.i = load i64, ptr %612, align 8, !alias.scope !6306, !noalias !6309, !noundef !2
  %613 = getelementptr inbounds i8, ptr %_522, i64 40
  %614 = load i8, ptr %613, align 8, !range !374, !alias.scope !6306, !noalias !6309, !noundef !2
  %615 = getelementptr inbounds i8, ptr %_522, i64 41
  %616 = load i8, ptr %615, align 1, !range !374, !alias.scope !6306, !noalias !6309, !noundef !2
  %617 = getelementptr inbounds i8, ptr %_522, i64 42
  %618 = load i8, ptr %617, align 2, !range !374, !alias.scope !6306, !noalias !6309, !noundef !2
  call void @llvm.lifetime.start.p0(i64 424, ptr nonnull %_525)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_528)
  store ptr %_498, ptr %_528, align 8
  %619 = getelementptr inbounds i8, ptr %_528, i64 8
  store i64 3, ptr %619, align 8
  %620 = getelementptr inbounds i8, ptr %_525, i64 72
  store ptr %_2.i230, ptr %620, align 8
  %cpi_accounts23.sroa.2.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 80
  store ptr %_12.i231, ptr %cpi_accounts23.sroa.2.0..sroa_idx, align 8
  %cpi_accounts23.sroa.3.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 88
  store ptr %_16.i232, ptr %cpi_accounts23.sroa.3.0..sroa_idx, align 8
  %cpi_accounts23.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 96
  store ptr %_5.i233, ptr %cpi_accounts23.sroa.4.0..sroa_idx, align 8
  %cpi_accounts23.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 104
  store i64 %_6.i234, ptr %cpi_accounts23.sroa.5.0..sroa_idx, align 8
  %cpi_accounts23.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 112
  store i8 %552, ptr %cpi_accounts23.sroa.6.0..sroa_idx, align 8
  %cpi_accounts23.sroa.7.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 113
  store i8 %554, ptr %cpi_accounts23.sroa.7.0..sroa_idx, align 1
  %cpi_accounts23.sroa.8.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 114
  store i8 %556, ptr %cpi_accounts23.sroa.8.0..sroa_idx, align 2
  %cpi_accounts23.sroa.10.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 120
  store ptr %_2.i225, ptr %cpi_accounts23.sroa.10.0..sroa_idx, align 8
  %cpi_accounts23.sroa.10.sroa.2.0.cpi_accounts23.sroa.10.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 128
  store ptr %_12.i226, ptr %cpi_accounts23.sroa.10.sroa.2.0.cpi_accounts23.sroa.10.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.10.sroa.3.0.cpi_accounts23.sroa.10.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 136
  store ptr %_16.i227, ptr %cpi_accounts23.sroa.10.sroa.3.0.cpi_accounts23.sroa.10.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.10.sroa.4.0.cpi_accounts23.sroa.10.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 144
  store ptr %_5.i228, ptr %cpi_accounts23.sroa.10.sroa.4.0.cpi_accounts23.sroa.10.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.10.sroa.5.0.cpi_accounts23.sroa.10.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 152
  store i64 %_6.i229, ptr %cpi_accounts23.sroa.10.sroa.5.0.cpi_accounts23.sroa.10.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.10.sroa.6.0.cpi_accounts23.sroa.10.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 160
  store i8 %562, ptr %cpi_accounts23.sroa.10.sroa.6.0.cpi_accounts23.sroa.10.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.10.sroa.7.0.cpi_accounts23.sroa.10.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 161
  store i8 %564, ptr %cpi_accounts23.sroa.10.sroa.7.0.cpi_accounts23.sroa.10.0..sroa_idx.sroa_idx, align 1
  %cpi_accounts23.sroa.10.sroa.8.0.cpi_accounts23.sroa.10.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 162
  store i8 %566, ptr %cpi_accounts23.sroa.10.sroa.8.0.cpi_accounts23.sroa.10.0..sroa_idx.sroa_idx, align 2
  %cpi_accounts23.sroa.11.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 168
  store ptr %_2.i220, ptr %cpi_accounts23.sroa.11.0..sroa_idx, align 8
  %cpi_accounts23.sroa.11.sroa.2.0.cpi_accounts23.sroa.11.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 176
  store ptr %_12.i221, ptr %cpi_accounts23.sroa.11.sroa.2.0.cpi_accounts23.sroa.11.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.11.sroa.3.0.cpi_accounts23.sroa.11.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 184
  store ptr %_16.i222, ptr %cpi_accounts23.sroa.11.sroa.3.0.cpi_accounts23.sroa.11.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.11.sroa.4.0.cpi_accounts23.sroa.11.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 192
  store ptr %_5.i223, ptr %cpi_accounts23.sroa.11.sroa.4.0.cpi_accounts23.sroa.11.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.11.sroa.5.0.cpi_accounts23.sroa.11.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 200
  store i64 %_6.i224, ptr %cpi_accounts23.sroa.11.sroa.5.0.cpi_accounts23.sroa.11.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.11.sroa.6.0.cpi_accounts23.sroa.11.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 208
  store i8 %573, ptr %cpi_accounts23.sroa.11.sroa.6.0.cpi_accounts23.sroa.11.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.11.sroa.7.0.cpi_accounts23.sroa.11.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 209
  store i8 %575, ptr %cpi_accounts23.sroa.11.sroa.7.0.cpi_accounts23.sroa.11.0..sroa_idx.sroa_idx, align 1
  %cpi_accounts23.sroa.11.sroa.8.0.cpi_accounts23.sroa.11.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 210
  store i8 %577, ptr %cpi_accounts23.sroa.11.sroa.8.0.cpi_accounts23.sroa.11.0..sroa_idx.sroa_idx, align 2
  %cpi_accounts23.sroa.12.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 216
  store ptr %_2.i215, ptr %cpi_accounts23.sroa.12.0..sroa_idx, align 8
  %cpi_accounts23.sroa.12.sroa.2.0.cpi_accounts23.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 224
  store ptr %_12.i216, ptr %cpi_accounts23.sroa.12.sroa.2.0.cpi_accounts23.sroa.12.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.12.sroa.3.0.cpi_accounts23.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 232
  store ptr %_16.i217, ptr %cpi_accounts23.sroa.12.sroa.3.0.cpi_accounts23.sroa.12.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.12.sroa.4.0.cpi_accounts23.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 240
  store ptr %_5.i218, ptr %cpi_accounts23.sroa.12.sroa.4.0.cpi_accounts23.sroa.12.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.12.sroa.5.0.cpi_accounts23.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 248
  store i64 %_6.i219, ptr %cpi_accounts23.sroa.12.sroa.5.0.cpi_accounts23.sroa.12.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.12.sroa.6.0.cpi_accounts23.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 256
  store i8 %583, ptr %cpi_accounts23.sroa.12.sroa.6.0.cpi_accounts23.sroa.12.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.12.sroa.7.0.cpi_accounts23.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 257
  store i8 %585, ptr %cpi_accounts23.sroa.12.sroa.7.0.cpi_accounts23.sroa.12.0..sroa_idx.sroa_idx, align 1
  %cpi_accounts23.sroa.12.sroa.8.0.cpi_accounts23.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 258
  store i8 %587, ptr %cpi_accounts23.sroa.12.sroa.8.0.cpi_accounts23.sroa.12.0..sroa_idx.sroa_idx, align 2
  %cpi_accounts23.sroa.13.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 264
  store ptr %_2.i210, ptr %cpi_accounts23.sroa.13.0..sroa_idx, align 8
  %cpi_accounts23.sroa.13.sroa.2.0.cpi_accounts23.sroa.13.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 272
  store ptr %_12.i211, ptr %cpi_accounts23.sroa.13.sroa.2.0.cpi_accounts23.sroa.13.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.13.sroa.3.0.cpi_accounts23.sroa.13.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 280
  store ptr %_16.i212, ptr %cpi_accounts23.sroa.13.sroa.3.0.cpi_accounts23.sroa.13.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.13.sroa.4.0.cpi_accounts23.sroa.13.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 288
  store ptr %_5.i213, ptr %cpi_accounts23.sroa.13.sroa.4.0.cpi_accounts23.sroa.13.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.13.sroa.5.0.cpi_accounts23.sroa.13.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 296
  store i64 %_6.i214, ptr %cpi_accounts23.sroa.13.sroa.5.0.cpi_accounts23.sroa.13.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.13.sroa.6.0.cpi_accounts23.sroa.13.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 304
  store i8 %593, ptr %cpi_accounts23.sroa.13.sroa.6.0.cpi_accounts23.sroa.13.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.13.sroa.7.0.cpi_accounts23.sroa.13.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 305
  store i8 %595, ptr %cpi_accounts23.sroa.13.sroa.7.0.cpi_accounts23.sroa.13.0..sroa_idx.sroa_idx, align 1
  %cpi_accounts23.sroa.13.sroa.8.0.cpi_accounts23.sroa.13.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 306
  store i8 %597, ptr %cpi_accounts23.sroa.13.sroa.8.0.cpi_accounts23.sroa.13.0..sroa_idx.sroa_idx, align 2
  %cpi_accounts23.sroa.14.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 312
  store ptr %_2.i205, ptr %cpi_accounts23.sroa.14.0..sroa_idx, align 8
  %cpi_accounts23.sroa.14.sroa.2.0.cpi_accounts23.sroa.14.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 320
  store ptr %_12.i206, ptr %cpi_accounts23.sroa.14.sroa.2.0.cpi_accounts23.sroa.14.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.14.sroa.3.0.cpi_accounts23.sroa.14.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 328
  store ptr %_16.i207, ptr %cpi_accounts23.sroa.14.sroa.3.0.cpi_accounts23.sroa.14.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.14.sroa.4.0.cpi_accounts23.sroa.14.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 336
  store ptr %_5.i208, ptr %cpi_accounts23.sroa.14.sroa.4.0.cpi_accounts23.sroa.14.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.14.sroa.5.0.cpi_accounts23.sroa.14.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 344
  store i64 %_6.i209, ptr %cpi_accounts23.sroa.14.sroa.5.0.cpi_accounts23.sroa.14.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.14.sroa.6.0.cpi_accounts23.sroa.14.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 352
  store i8 %604, ptr %cpi_accounts23.sroa.14.sroa.6.0.cpi_accounts23.sroa.14.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.14.sroa.7.0.cpi_accounts23.sroa.14.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 353
  store i8 %606, ptr %cpi_accounts23.sroa.14.sroa.7.0.cpi_accounts23.sroa.14.0..sroa_idx.sroa_idx, align 1
  %cpi_accounts23.sroa.14.sroa.8.0.cpi_accounts23.sroa.14.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 354
  store i8 %608, ptr %cpi_accounts23.sroa.14.sroa.8.0.cpi_accounts23.sroa.14.0..sroa_idx.sroa_idx, align 2
  %cpi_accounts23.sroa.15.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 360
  store ptr %_2.i, ptr %cpi_accounts23.sroa.15.0..sroa_idx, align 8
  %cpi_accounts23.sroa.15.sroa.2.0.cpi_accounts23.sroa.15.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 368
  store ptr %_12.i, ptr %cpi_accounts23.sroa.15.sroa.2.0.cpi_accounts23.sroa.15.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.15.sroa.3.0.cpi_accounts23.sroa.15.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 376
  store ptr %_16.i, ptr %cpi_accounts23.sroa.15.sroa.3.0.cpi_accounts23.sroa.15.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.15.sroa.4.0.cpi_accounts23.sroa.15.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 384
  store ptr %_5.i, ptr %cpi_accounts23.sroa.15.sroa.4.0.cpi_accounts23.sroa.15.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.15.sroa.5.0.cpi_accounts23.sroa.15.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 392
  store i64 %_6.i, ptr %cpi_accounts23.sroa.15.sroa.5.0.cpi_accounts23.sroa.15.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.15.sroa.6.0.cpi_accounts23.sroa.15.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 400
  store i8 %614, ptr %cpi_accounts23.sroa.15.sroa.6.0.cpi_accounts23.sroa.15.0..sroa_idx.sroa_idx, align 8
  %cpi_accounts23.sroa.15.sroa.7.0.cpi_accounts23.sroa.15.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 401
  store i8 %616, ptr %cpi_accounts23.sroa.15.sroa.7.0.cpi_accounts23.sroa.15.0..sroa_idx.sroa_idx, align 1
  %cpi_accounts23.sroa.15.sroa.8.0.cpi_accounts23.sroa.15.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 402
  store i8 %618, ptr %cpi_accounts23.sroa.15.sroa.8.0.cpi_accounts23.sroa.15.0..sroa_idx.sroa_idx, align 2
  store i64 0, ptr %_525, align 8
  %_1026.sroa.4.0._525.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 8
  store ptr inttoptr (i64 8 to ptr), ptr %_1026.sroa.4.0._525.sroa_idx, align 8
  %_1026.sroa.5.0._525.sroa_idx = getelementptr inbounds i8, ptr %_525, i64 16
  store i64 0, ptr %_1026.sroa.5.0._525.sroa_idx, align 8
  %621 = getelementptr inbounds i8, ptr %_525, i64 24
  store ptr %_2.i235, ptr %621, align 8
  %cpi_program22.sroa.2.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 32
  store ptr %_12.i236, ptr %cpi_program22.sroa.2.0..sroa_idx, align 8
  %cpi_program22.sroa.3.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 40
  store ptr %_16.i237, ptr %cpi_program22.sroa.3.0..sroa_idx, align 8
  %cpi_program22.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 48
  store ptr %_5.i238, ptr %cpi_program22.sroa.4.0..sroa_idx, align 8
  %cpi_program22.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 56
  store i64 %_6.i239, ptr %cpi_program22.sroa.5.0..sroa_idx, align 8
  %cpi_program22.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 64
  store i8 %541, ptr %cpi_program22.sroa.6.0..sroa_idx, align 8
  %cpi_program22.sroa.7.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 65
  store i8 %543, ptr %cpi_program22.sroa.7.0..sroa_idx, align 1
  %cpi_program22.sroa.8.0..sroa_idx = getelementptr inbounds i8, ptr %_525, i64 66
  store i8 %545, ptr %cpi_program22.sroa.8.0..sroa_idx, align 2
  %622 = getelementptr inbounds i8, ptr %_525, i64 408
  store ptr %_528, ptr %622, align 8
  %623 = getelementptr inbounds i8, ptr %_525, i64 416
  store i64 1, ptr %623, align 8
  call void @llvm.lifetime.start.p0(i64 33, ptr nonnull %_529)
  store i8 %val21.sroa.0.0, ptr %_529, align 1
  %val21.sroa.6.0._529.sroa_idx = getelementptr inbounds i8, ptr %_529, i64 1
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %val21.sroa.6.0._529.sroa_idx, ptr noundef nonnull align 1 dereferenceable(32) %val21.sroa.6, i64 32, i1 false)
; call pump_recovered::pump_fees::cpi::admin_cto_sharing_config
  %624 = call { i64, ptr } @_ZN14pump_recovered9pump_fees3cpi24admin_cto_sharing_config17hb339d2894fd16ae6E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(424) %_525, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(33) %_529) #28
  %625 = extractvalue { i64, ptr } %624, 0
  call void @llvm.lifetime.end.p0(i64 33, ptr nonnull %_529)
  call void @llvm.lifetime.end.p0(i64 424, ptr nonnull %_525)
  %626 = icmp eq i64 %625, 2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_528)
  br i1 %626, label %bb412, label %bb411

bb412:                                            ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit618
  br i1 %holder1.sroa.0.1.off0, label %bb240, label %bb239

bb411:                                            ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hbf2f50dabd5a1ea9E.exit618
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %val21.sroa.6)
  br label %bb268

bb239:                                            ; preds = %bb412
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %target, ptr noundef nonnull align 1 dereferenceable(32) %old, i64 32, i1 false)
  br label %bb240

bb240:                                            ; preds = %bb239, %bb412
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %val21.sroa.6)
  br label %bb241

bb242:                                            ; preds = %bb241
  %_764 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %627 = getelementptr inbounds i8, ptr %_764, i64 112
  store i64 %2, ptr %627, align 8
  br label %bb243

bb243:                                            ; preds = %bb241, %bb242
  %_765 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %628 = getelementptr inbounds i8, ptr %_765, i64 164
  store i8 0, ptr %628, align 4
  %629 = getelementptr inbounds i8, ptr %_630, i64 112
  %_541 = load ptr, ptr %629, align 8, !nonnull !2, !align !3, !noundef !2
  %630 = getelementptr inbounds i8, ptr %_541, i64 24
  %_1031 = load ptr, ptr %630, align 8, !nonnull !2, !align !372, !noundef !2
  %631 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_1031, ptr noundef nonnull dereferenceable(32) @_ZN14pump_recovered8pump_amm2ID17h273c877549d15150E, i64 32)
  %632 = icmp eq i32 %631, 0
  br i1 %632, label %bb244, label %bb249

bb244:                                            ; preds = %bb243
; call solana_account_info::AccountInfo::data_is_empty
  %_542 = call noundef zeroext i1 @_ZN19solana_account_info11AccountInfo13data_is_empty17h4cbad3bc61143bcfE(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_541) #28
  br i1 %_542, label %bb249, label %bb247

bb249:                                            ; preds = %bb243, %bb244
  call void @sol_log_(ptr noundef nonnull @alloc_f1e0cbbc2b934c2f02dd0c84a052221d, i64 noundef 48) #28
  br label %bb250

bb247:                                            ; preds = %bb244
  %633 = getelementptr inbounds i8, ptr %_630, i64 88
  %_1035 = load ptr, ptr %633, align 8, !nonnull !2, !align !3, !noundef !2
  %634 = getelementptr inbounds i8, ptr %_559, i64 24
  call void @llvm.lifetime.start.p0(i64 424, ptr nonnull %_559)
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %634, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1035) #28
  %_1036 = load ptr, ptr %_630, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %cpi_accounts26, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1036) #28
  %635 = getelementptr inbounds i8, ptr %_630, i64 96
  %_1037 = load ptr, ptr %635, align 8, !nonnull !2, !align !3, !noundef !2
  %636 = getelementptr inbounds i8, ptr %cpi_accounts26, i64 48
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %636, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1037) #28
  %_1038 = load ptr, ptr %629, align 8, !nonnull !2, !align !3, !noundef !2
  %637 = getelementptr inbounds i8, ptr %cpi_accounts26, i64 96
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %637, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1038) #28
  %638 = getelementptr inbounds i8, ptr %_630, i64 104
  %_1039 = load ptr, ptr %638, align 8, !nonnull !2, !align !3, !noundef !2
  %639 = getelementptr inbounds i8, ptr %cpi_accounts26, i64 144
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %639, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1039) #28
  %_1040 = load ptr, ptr %_157, align 8, !nonnull !2, !align !3, !noundef !2
  %640 = getelementptr inbounds i8, ptr %cpi_accounts26, i64 192
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %640, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1040) #28
  %641 = getelementptr inbounds i8, ptr %_630, i64 120
  %_1041 = load ptr, ptr %641, align 8, !nonnull !2, !align !3, !noundef !2
  %642 = getelementptr inbounds i8, ptr %cpi_accounts26, i64 240
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %642, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1041) #28
  %_1042 = load ptr, ptr %633, align 8, !nonnull !2, !align !3, !noundef !2
  %643 = getelementptr inbounds i8, ptr %cpi_accounts26, i64 288
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %643, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1042) #28
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_556)
  store ptr %_498, ptr %_556, align 8
  %644 = getelementptr inbounds i8, ptr %_556, i64 8
  store i64 3, ptr %644, align 8
  %645 = getelementptr inbounds i8, ptr %_559, i64 72
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(336) %645, ptr noundef nonnull align 8 dereferenceable(336) %cpi_accounts26, i64 336, i1 false)
  store i64 0, ptr %_559, align 8
  %_1043.sroa.4.0._559.sroa_idx = getelementptr inbounds i8, ptr %_559, i64 8
  store ptr inttoptr (i64 8 to ptr), ptr %_1043.sroa.4.0._559.sroa_idx, align 8
  %_1043.sroa.5.0._559.sroa_idx = getelementptr inbounds i8, ptr %_559, i64 16
  store i64 0, ptr %_1043.sroa.5.0._559.sroa_idx, align 8
  %646 = getelementptr inbounds i8, ptr %_559, i64 408
  store ptr %_556, ptr %646, align 8
  %647 = getelementptr inbounds i8, ptr %_559, i64 416
  store i64 1, ptr %647, align 8
; call pump_recovered::pump_amm::cpi::admin_cto_pool
  %648 = call { i64, ptr } @_ZN14pump_recovered8pump_amm3cpi14admin_cto_pool17h6db7cfeb87b39219E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(424) %_559, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %target, i1 noundef zeroext %holder1.sroa.0.1.off0, i64 noundef %1, i64 %2) #28
  %649 = extractvalue { i64, ptr } %648, 0
  call void @llvm.lifetime.end.p0(i64 424, ptr nonnull %_559)
  %650 = icmp eq i64 %649, 2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_556)
  br i1 %650, label %bb250, label %bb268

bb250:                                            ; preds = %bb247, %bb249
  %pool_updated.sroa.0.1.off0 = phi i1 [ false, %bb249 ], [ true, %bb247 ]
  call void @llvm.lifetime.start.p0(i64 200, ptr nonnull %e28)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_566)
; call solana_sysvar::clock::<impl solana_sysvar::Sysvar for solana_clock::Clock>::get
  call void @"_ZN13solana_sysvar5clock71_$LT$impl$u20$solana_sysvar..Sysvar$u20$for$u20$solana_clock..Clock$GT$3get17hf864a57fc372ac1bE"(ptr noalias nocapture noundef nonnull sret([48 x i8]) align 8 dereferenceable(48) %_566) #28
  %_1051 = load i64, ptr %_566, align 8, !range !389, !noundef !2
  %trunc184.not = icmp eq i64 %_1051, 0
  br i1 %trunc184.not, label %bb426, label %bb425

bb426:                                            ; preds = %bb250
  %_1052.sroa.8.0..sroa_idx = getelementptr inbounds i8, ptr %_566, i64 40
  %_1052.sroa.8.0.copyload = load i64, ptr %_1052.sroa.8.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_566)
  %_1055 = load ptr, ptr %_630, align 8, !nonnull !2, !align !3, !noundef !2
  %_1056 = load ptr, ptr %_1055, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %e28, ptr noundef nonnull align 1 dereferenceable(32) %_1056, i64 32, i1 false)
  %651 = getelementptr inbounds i8, ptr %e28, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %651, ptr noundef nonnull align 1 dereferenceable(32) %mint, i64 32, i1 false)
  %_778 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %_1059 = load ptr, ptr %_778, align 8, !nonnull !2, !align !3, !noundef !2
  %_1060 = load ptr, ptr %_1059, align 8, !nonnull !2, !align !372, !noundef !2
  %652 = getelementptr inbounds i8, ptr %e28, i64 64
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %652, ptr noundef nonnull align 1 dereferenceable(32) %_1060, i64 32, i1 false)
  %653 = getelementptr inbounds i8, ptr %e28, i64 96
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %653, ptr noundef nonnull align 1 dereferenceable(32) %old, i64 32, i1 false)
  %654 = getelementptr inbounds i8, ptr %e28, i64 128
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %654, ptr noundef nonnull align 1 dereferenceable(32) %target, i64 32, i1 false)
  %switch204 = icmp eq i64 %1, 0
  %_575.sroa.0.0 = select i1 %switch204, i64 %old_fee, i64 %2
  %655 = getelementptr inbounds i8, ptr %e28, i64 160
  store i64 %_1052.sroa.8.0.copyload, ptr %655, align 8
  %656 = getelementptr inbounds i8, ptr %e28, i64 192
  store i8 %532, ptr %656, align 8
  %657 = getelementptr inbounds i8, ptr %e28, i64 193
  store i8 %534, ptr %657, align 1
  %658 = getelementptr inbounds i8, ptr %e28, i64 168
  store i64 %old_fee, ptr %658, align 8
  %659 = getelementptr inbounds i8, ptr %e28, i64 176
  store i64 %_575.sroa.0.0, ptr %659, align 8
  %660 = getelementptr inbounds i8, ptr %e28, i64 194
  %661 = zext i1 %shared.sroa.0.0.off0 to i8
  store i8 %661, ptr %660, align 2
  %662 = getelementptr inbounds i8, ptr %e28, i64 184
  store i64 %swept.sroa.0.0690, ptr %662, align 8
  %663 = getelementptr inbounds i8, ptr %e28, i64 195
  %664 = zext i1 %pool_updated.sroa.0.1.off0 to i8
  store i8 %664, ptr %663, align 1
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_582)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_584)
  call void @llvm.lifetime.start.p0(i64 200, ptr nonnull %_586)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %_586, ptr noundef nonnull align 1 dereferenceable(32) %_1056, i64 32, i1 false)
  %665 = getelementptr inbounds i8, ptr %_586, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %665, ptr noundef nonnull align 1 dereferenceable(32) %mint, i64 32, i1 false)
  %666 = getelementptr inbounds i8, ptr %_586, i64 64
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %666, ptr noundef nonnull align 1 dereferenceable(32) %_1060, i64 32, i1 false)
  %667 = getelementptr inbounds i8, ptr %_586, i64 96
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %667, ptr noundef nonnull align 1 dereferenceable(32) %old, i64 32, i1 false)
  %668 = getelementptr inbounds i8, ptr %_586, i64 128
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %668, ptr noundef nonnull align 1 dereferenceable(32) %target, i64 32, i1 false)
  %669 = getelementptr inbounds i8, ptr %_586, i64 160
  store i64 %_1052.sroa.8.0.copyload, ptr %669, align 8
  %670 = getelementptr inbounds i8, ptr %_586, i64 192
  store i8 %532, ptr %670, align 8
  %671 = getelementptr inbounds i8, ptr %_586, i64 193
  store i8 %534, ptr %671, align 1
  %672 = getelementptr inbounds i8, ptr %_586, i64 168
  store i64 %old_fee, ptr %672, align 8
  %673 = getelementptr inbounds i8, ptr %_586, i64 176
  store i64 %_575.sroa.0.0, ptr %673, align 8
  %674 = getelementptr inbounds i8, ptr %_586, i64 194
  store i8 %661, ptr %674, align 2
  %675 = getelementptr inbounds i8, ptr %_586, i64 184
  store i64 %swept.sroa.0.0690, ptr %675, align 8
  %676 = getelementptr inbounds i8, ptr %_586, i64 195
  store i8 %664, ptr %676, align 1
; call <pump_recovered::admin_cto::AdminCtoEvent as anchor_lang::Event>::data
  call void @"_ZN79_$LT$pump_recovered..admin_cto..AdminCtoEvent$u20$as$u20$anchor_lang..Event$GT$4data17h2de1473225a7d978E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_584, ptr noalias noundef nonnull readonly align 8 dereferenceable(200) %_586) #28
  %677 = getelementptr inbounds i8, ptr %_584, i64 8
  %_1077 = load ptr, ptr %677, align 8, !nonnull !2, !noundef !2
  %678 = getelementptr inbounds i8, ptr %_584, i64 16
  %_1076 = load i64, ptr %678, align 8, !noundef !2
  store ptr %_1077, ptr %_582, align 8
  %679 = getelementptr inbounds i8, ptr %_582, i64 8
  store i64 %_1076, ptr %679, align 8
; call solana_program::log::sol_log_data
  call void @_ZN14solana_program3log12sol_log_data17h1e024b73f122854fE(ptr noalias noundef nonnull readonly align 8 %_582, i64 noundef 1) #28
  call void @llvm.lifetime.end.p0(i64 200, ptr nonnull %_586)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_584)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_582)
  %_588 = getelementptr inbounds i8, ptr %_630, i64 312
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %authority_info30, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_588) #28
  %680 = getelementptr inbounds i8, ptr %ctx, i64 46
  %authority_bump52 = load i8, ptr %680, align 2, !noundef !2
; call <pump_recovered::admin_cto::AdminCtoEvent as anchor_lang::Event>::data
  call void @"_ZN79_$LT$pump_recovered..admin_cto..AdminCtoEvent$u20$as$u20$anchor_lang..Event$GT$4data17h2de1473225a7d978E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %inner_data31, ptr noalias noundef nonnull readonly align 8 dereferenceable(200) %e28) #28
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %ix_data32)
  %me.sroa.0.0.copyload.i621 = load i64, ptr %inner_data31, align 8, !alias.scope !6312, !noalias !6315
  %me.sroa.4.0.self.sroa_idx.i622 = getelementptr inbounds i8, ptr %inner_data31, i64 8
  %me.sroa.4.0.copyload.i623 = load ptr, ptr %me.sroa.4.0.self.sroa_idx.i622, align 8, !alias.scope !6312, !noalias !6315, !nonnull !2, !noundef !2
  %me.sroa.5.0.self.sroa_idx.i624 = getelementptr inbounds i8, ptr %inner_data31, i64 16
  %me.sroa.5.0.copyload.i625 = load i64, ptr %me.sroa.5.0.self.sroa_idx.i624, align 8, !alias.scope !6312, !noalias !6315
  %_18.i626 = getelementptr inbounds i8, ptr %me.sroa.4.0.copyload.i623, i64 %me.sroa.5.0.copyload.i625
  %681 = getelementptr inbounds i8, ptr %_594, i64 32
  store ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, ptr %681, align 8
  %682 = getelementptr inbounds i8, ptr %_594, i64 40
  store ptr getelementptr inbounds (<{ [8 x i8] }>, ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, i64 1, i32 0, i64 0), ptr %682, align 8
  store ptr %me.sroa.4.0.copyload.i623, ptr %_594, align 8
  %_1087.sroa.4.0._594.sroa_idx = getelementptr inbounds i8, ptr %_594, i64 8
  store ptr %me.sroa.4.0.copyload.i623, ptr %_1087.sroa.4.0._594.sroa_idx, align 8
  %_1087.sroa.5.0._594.sroa_idx = getelementptr inbounds i8, ptr %_594, i64 16
  store i64 %me.sroa.0.0.copyload.i621, ptr %_1087.sroa.5.0._594.sroa_idx, align 8
  %_1087.sroa.6.0._594.sroa_idx = getelementptr inbounds i8, ptr %_594, i64 24
  store ptr %_18.i626, ptr %_1087.sroa.6.0._594.sroa_idx, align 8
; call <alloc::vec::Vec<T> as alloc::vec::spec_from_iter::SpecFromIter<T,I>>::from_iter
  call fastcc void @"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h05834ec09ece64f1E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %ix_data32, ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_594) #28
  call void @llvm.lifetime.start.p0(i64 80, ptr nonnull %ix33)
  %683 = getelementptr inbounds i8, ptr %ix_data32, i64 8
  %_1090 = load ptr, ptr %683, align 8, !nonnull !2, !noundef !2
  %684 = getelementptr inbounds i8, ptr %ix_data32, i64 16
  %_1089 = load i64, ptr %684, align 8, !noundef !2
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_601)
; call alloc::alloc::exchange_malloc
  %_603 = call fastcc noundef ptr @_ZN5alloc5alloc15exchange_malloc17h6cd8dd11b0e3424eE(i64 noundef 34, i64 noundef 1) #28
  %_780 = load ptr, ptr %authority_info30, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memmove.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_603, ptr noundef nonnull align 1 dereferenceable(32) %_780, i64 32, i1 false)
  %_605.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_603, i64 32
  store i8 1, ptr %_605.sroa.4.0..sroa_idx, align 1
  %_605.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_603, i64 33
  store i8 0, ptr %_605.sroa.5.0..sroa_idx, align 1
  store i64 1, ptr %_601, align 8, !alias.scope !6317, !noalias !6320
  %685 = getelementptr inbounds i8, ptr %_601, i64 8
  store ptr %_603, ptr %685, align 8, !alias.scope !6317, !noalias !6320
  %686 = getelementptr inbounds i8, ptr %_601, i64 16
  store i64 1, ptr %686, align 8, !alias.scope !6317, !noalias !6320
; call solana_instruction::Instruction::new_with_bytes
  call void @_ZN18solana_instruction11Instruction14new_with_bytes17h836fab8fb6401158E(ptr noalias nocapture noundef nonnull sret([80 x i8]) align 8 dereferenceable(80) %ix33, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) @_ZN14pump_recovered2ID17h8e245cf89cf2c06bE, ptr noalias noundef nonnull readonly align 1 %_1090, i64 noundef %_1089, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_601) #28
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_601)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_613)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %_613, ptr noundef nonnull align 8 dereferenceable(48) %authority_info30, i64 48, i1 false)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_616)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_619)
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %_623)
  store i8 %authority_bump52, ptr %_623, align 1
  store ptr @alloc_7a7952b5e0d15f2b72d0341cef6d4739, ptr %_619, align 8
  %687 = getelementptr inbounds i8, ptr %_619, i64 8
  store i64 17, ptr %687, align 8
  %688 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_619, i64 0, i64 1
  store ptr %_623, ptr %688, align 8
  %689 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_619, i64 0, i64 1, i32 1
  store i64 1, ptr %689, align 8
  store ptr %_619, ptr %_616, align 8
  %690 = getelementptr inbounds i8, ptr %_616, i64 8
  store i64 2, ptr %690, align 8
; call solana_program::program::invoke_signed
  call void @_ZN14solana_program7program13invoke_signed17h01c3b84bc1fc491eE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_609, ptr noalias noundef nonnull readonly align 8 dereferenceable(80) %ix33, ptr noalias noundef nonnull readonly align 8 %_613, i64 noundef 1, ptr noalias noundef nonnull readonly align 8 %_616, i64 noundef 1) #28
  %691 = load i64, ptr %_609, align 8, !range !366, !noundef !2
  %692 = icmp eq i64 %691, -9223372036854775782
  br i1 %692, label %bb435, label %bb434

bb425:                                            ; preds = %bb250
  %693 = getelementptr inbounds i8, ptr %_566, i64 8
  %_1053.sroa.0.0.copyload = load i64, ptr %693, align 8
  %_1053.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_566, i64 16
  %_1053.sroa.5.0.copyload = load i64, ptr %_1053.sroa.5.0..sroa_idx, align 8
  %_1053.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_566, i64 24
  %_1053.sroa.6.0.copyload = load i64, ptr %_1053.sroa.6.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_566)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_1057)
  store i64 %_1053.sroa.0.0.copyload, ptr %_1057, align 8
  %residual29.sroa.2.0._1057.sroa_idx = getelementptr inbounds i8, ptr %_1057, i64 8
  store i64 %_1053.sroa.5.0.copyload, ptr %residual29.sroa.2.0._1057.sroa_idx, align 8
  %residual29.sroa.3.0._1057.sroa_idx = getelementptr inbounds i8, ptr %_1057, i64 16
  store i64 %_1053.sroa.6.0.copyload, ptr %residual29.sroa.3.0._1057.sroa_idx, align 8
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %694 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17ha4865197be4b9a2fE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_1057) #28
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_1057)
  br label %bb266

bb435:                                            ; preds = %bb426
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_623)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_619)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_616)
  %695 = getelementptr inbounds i8, ptr %_613, i64 8
  %_613.val314 = load ptr, ptr %695, align 8, !nonnull !2, !noundef !2
  %696 = getelementptr inbounds i8, ptr %_613, i64 16
  %_613.val315 = load ptr, ptr %696, align 8
  %self1.val.i.i.i.i627 = load i64, ptr %_613.val314, align 8, !noundef !2
  %val.i.i.i.i628 = add i64 %self1.val.i.i.i.i627, -1
  store i64 %val.i.i.i.i628, ptr %_613.val314, align 8
  %697 = icmp eq i64 %val.i.i.i.i628, 0
  br i1 %697, label %bb1.i.i.i.i635, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i629"

bb1.i.i.i.i635:                                   ; preds = %bb435
  %698 = getelementptr i8, ptr %_613.val314, i64 8
  %self2.val.i.i.i.i636 = load i64, ptr %698, align 8, !noundef !2
  %val6.i.i.i.i637 = add i64 %self2.val.i.i.i.i636, -1
  store i64 %val6.i.i.i.i637, ptr %698, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i629"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i629": ; preds = %bb1.i.i.i.i635, %bb435
  %699 = icmp ne ptr %_613.val315, null
  call void @llvm.assume(i1 %699)
  %self1.val.i.i2.i.i630 = load i64, ptr %_613.val315, align 8, !noundef !2
  %val.i.i3.i.i631 = add i64 %self1.val.i.i2.i.i630, -1
  store i64 %val.i.i3.i.i631, ptr %_613.val315, align 8
  %700 = icmp eq i64 %val.i.i3.i.i631, 0
  br i1 %700, label %bb1.i.i4.i.i632, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit638"

bb1.i.i4.i.i632:                                  ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i629"
  %701 = getelementptr i8, ptr %_613.val315, i64 8
  %self2.val.i.i5.i.i633 = load i64, ptr %701, align 8, !noundef !2
  %val6.i.i6.i.i634 = add i64 %self2.val.i.i5.i.i633, -1
  store i64 %val6.i.i6.i.i634, ptr %701, align 8
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit638"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit638": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i629", %bb1.i.i4.i.i632
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_613)
  %_1.val.i639 = load i64, ptr %ix33, align 8, !alias.scope !6322, !noundef !2
  %702 = icmp eq i64 %_1.val.i639, 0
  br i1 %702, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i642", label %bb2.i.i.i.i640

bb2.i.i.i.i640:                                   ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit638"
  %703 = getelementptr inbounds i8, ptr %ix33, i64 8
  %_1.val2.i641 = load ptr, ptr %703, align 8, !alias.scope !6322
  %704 = icmp ne ptr %_1.val2.i641, null
  call void @llvm.assume(i1 %704)
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i642"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i642": ; preds = %bb2.i.i.i.i640, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit638"
  %705 = getelementptr inbounds i8, ptr %ix33, i64 24
  %.val.i643 = load i64, ptr %705, align 8, !alias.scope !6322, !noundef !2
  %706 = icmp eq i64 %.val.i643, 0
  br i1 %706, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit646", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i644"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i644": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i642"
  %707 = getelementptr inbounds i8, ptr %ix33, i64 32
  %.val1.i645 = load ptr, ptr %707, align 8, !alias.scope !6322
  %708 = icmp ne ptr %.val1.i645, null
  call void @llvm.assume(i1 %708)
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit646"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit646": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i642", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i644"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix33)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data32)
  call void @llvm.lifetime.end.p0(i64 200, ptr nonnull %e28)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_498)
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %pb)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %holder_key)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %mint)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %old)
  br label %bb288

bb434:                                            ; preds = %bb426
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %709 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17ha4865197be4b9a2fE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_609) #28
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_623)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_619)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_616)
  %710 = getelementptr inbounds i8, ptr %_613, i64 8
  %_613.val = load ptr, ptr %710, align 8, !nonnull !2, !noundef !2
  %711 = getelementptr inbounds i8, ptr %_613, i64 16
  %_613.val313 = load ptr, ptr %711, align 8
  %self1.val.i.i.i.i649 = load i64, ptr %_613.val, align 8, !noundef !2
  %val.i.i.i.i650 = add i64 %self1.val.i.i.i.i649, -1
  store i64 %val.i.i.i.i650, ptr %_613.val, align 8
  %712 = icmp eq i64 %val.i.i.i.i650, 0
  br i1 %712, label %bb1.i.i.i.i657, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i651"

bb1.i.i.i.i657:                                   ; preds = %bb434
  %713 = getelementptr i8, ptr %_613.val, i64 8
  %self2.val.i.i.i.i658 = load i64, ptr %713, align 8, !noundef !2
  %val6.i.i.i.i659 = add i64 %self2.val.i.i.i.i658, -1
  store i64 %val6.i.i.i.i659, ptr %713, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i651"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i651": ; preds = %bb1.i.i.i.i657, %bb434
  %714 = icmp ne ptr %_613.val313, null
  call void @llvm.assume(i1 %714)
  %self1.val.i.i2.i.i652 = load i64, ptr %_613.val313, align 8, !noundef !2
  %val.i.i3.i.i653 = add i64 %self1.val.i.i2.i.i652, -1
  store i64 %val.i.i3.i.i653, ptr %_613.val313, align 8
  %715 = icmp eq i64 %val.i.i3.i.i653, 0
  br i1 %715, label %bb1.i.i4.i.i654, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit660"

bb1.i.i4.i.i654:                                  ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i651"
  %716 = getelementptr i8, ptr %_613.val313, i64 8
  %self2.val.i.i5.i.i655 = load i64, ptr %716, align 8, !noundef !2
  %val6.i.i6.i.i656 = add i64 %self2.val.i.i5.i.i655, -1
  store i64 %val6.i.i6.i.i656, ptr %716, align 8
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit660"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit660": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i651", %bb1.i.i4.i.i654
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_613)
  %_1.val.i661 = load i64, ptr %ix33, align 8, !alias.scope !6325, !noundef !2
  %717 = icmp eq i64 %_1.val.i661, 0
  br i1 %717, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i664", label %bb2.i.i.i.i662

bb2.i.i.i.i662:                                   ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit660"
  %718 = getelementptr inbounds i8, ptr %ix33, i64 8
  %_1.val2.i663 = load ptr, ptr %718, align 8, !alias.scope !6325
  %719 = icmp ne ptr %_1.val2.i663, null
  call void @llvm.assume(i1 %719)
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i664"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i664": ; preds = %bb2.i.i.i.i662, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit660"
  %720 = getelementptr inbounds i8, ptr %ix33, i64 24
  %.val.i665 = load i64, ptr %720, align 8, !alias.scope !6325, !noundef !2
  %721 = icmp eq i64 %.val.i665, 0
  br i1 %721, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit668", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i666"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i666": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i664"
  %722 = getelementptr inbounds i8, ptr %ix33, i64 32
  %.val1.i667 = load ptr, ptr %722, align 8, !alias.scope !6325
  %723 = icmp ne ptr %.val1.i667, null
  call void @llvm.assume(i1 %723)
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit668"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit668": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i664", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i666"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix33)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data32)
  br label %bb266

bb288:                                            ; preds = %bb16, %bb286, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit327", %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit", %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit646"
  %_0.sroa.41.10 = phi ptr [ %_8.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit" ], [ %_20.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit327" ], [ %_0.sroa.41.0, %bb286 ], [ undef, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit646" ], [ %_33.1, %bb16 ]
  %_0.sroa.0.10 = phi i64 [ %_8.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit" ], [ %_20.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit327" ], [ %_0.sroa.0.0, %bb286 ], [ 2, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit646" ], [ %_33.0, %bb16 ]
  %724 = insertvalue { i64, ptr } poison, i64 %_0.sroa.0.10, 0
  %725 = insertvalue { i64, ptr } %724, ptr %_0.sroa.41.10, 1
  ret { i64, ptr } %725

bb266:                                            ; preds = %bb425, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit668"
  %.pn185 = phi { i64, ptr } [ %694, %bb425 ], [ %709, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit668" ]
  %_0.sroa.0.11 = extractvalue { i64, ptr } %.pn185, 0
  call void @llvm.lifetime.end.p0(i64 200, ptr nonnull %e28)
  br label %bb268

bb268:                                            ; preds = %bb266, %bb247, %bb411
  %.pn185.pn.pn = phi { i64, ptr } [ %624, %bb411 ], [ %.pn185, %bb266 ], [ %648, %bb247 ]
  %_0.sroa.0.13 = phi i64 [ %625, %bb411 ], [ %_0.sroa.0.11, %bb266 ], [ %649, %bb247 ]
  %_0.sroa.41.13 = extractvalue { i64, ptr } %.pn185.pn.pn, 1
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_498)
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %pb)
  br label %bb286

bb281:                                            ; preds = %bb275, %bb166, %bb357, %bb355, %bb132, %bb344, %bb347, %bb351, %bb342, %bb122
  %_0.sroa.41.14 = phi ptr [ %_221.1, %bb122 ], [ %_906.1, %bb351 ], [ %345, %bb347 ], [ %_243.1, %bb132 ], [ %_888.1, %bb344 ], [ %_883.1, %bb342 ], [ %_0.sroa.41.4, %bb275 ], [ %_309.1, %bb166 ], [ %_914.1, %bb357 ], [ %_909.1, %bb355 ]
  %_0.sroa.0.14 = phi i64 [ %_221.0, %bb122 ], [ %_906.0, %bb351 ], [ %343, %bb347 ], [ %_243.0, %bb132 ], [ %190, %bb344 ], [ %179, %bb342 ], [ %_0.sroa.0.4, %bb275 ], [ %_309.0, %bb166 ], [ %362, %bb357 ], [ %359, %bb355 ]
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %dest)
  br label %bb286
}
