define hidden { i64, ptr } @_ZN14pump_recovered6buy_v211buy_handler17h4cbc564ad5f9f0a1E(ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %ctx, i64 noundef %0, i64 noundef %limit, i1 noundef zeroext %partial) unnamed_addr #0 {
start:
  %_11.i190 = alloca [0 x i8], align 1
  %formatter.i191 = alloca [64 x i8], align 8
  %buf.i192 = alloca [24 x i8], align 8
  %formatter.i184 = alloca [64 x i8], align 8
  %buf.i185 = alloca [24 x i8], align 8
  %formatter.i = alloca [64 x i8], align 8
  %buf.i = alloca [24 x i8], align 8
  %_841 = alloca [24 x i8], align 8
  %_488 = alloca [1 x i8], align 1
  %_484 = alloca [32 x i8], align 8
  %_481 = alloca [16 x i8], align 8
  %_478 = alloca [48 x i8], align 8
  %_474 = alloca [24 x i8], align 8
  %_466 = alloca [24 x i8], align 8
  %ix40 = alloca [80 x i8], align 8
  %_460 = alloca [48 x i8], align 8
  %ix_data39 = alloca [24 x i8], align 8
  %inner_data38 = alloca [24 x i8], align 8
  %authority_info37 = alloca [48 x i8], align 8
  %_453 = alloca [24 x i8], align 8
  %_451 = alloca [16 x i8], align 8
  %event = alloca [136 x i8], align 8
  %_440 = alloca [1 x i8], align 1
  %_436 = alloca [32 x i8], align 8
  %_433 = alloca [16 x i8], align 8
  %_430 = alloca [48 x i8], align 8
  %_426 = alloca [24 x i8], align 8
  %_418 = alloca [24 x i8], align 8
  %ix = alloca [80 x i8], align 8
  %_410 = alloca [48 x i8], align 8
  %ix_data = alloca [24 x i8], align 8
  %inner_data = alloca [24 x i8], align 8
  %authority_info = alloca [48 x i8], align 8
  %_401 = alloca [24 x i8], align 8
  %_399 = alloca [16 x i8], align 8
  %_387 = alloca [16 x i8], align 8
  %_370 = alloca [32 x i8], align 1
  %_363 = alloca [32 x i8], align 1
  %_362 = alloca [32 x i8], align 1
  %ev = alloca [424 x i8], align 8
  %_360 = alloca [32 x i8], align 1
  %_355 = alloca [48 x i8], align 8
  %_353 = alloca [24 x i8], align 8
  %_344 = alloca [48 x i8], align 8
  %quote_mint31 = alloca [32 x i8], align 1
  %creator = alloca [32 x i8], align 1
  %_283 = alloca [48 x i8], align 8
  %_270 = alloca [48 x i8], align 8
  %_255 = alloca [32 x i8], align 1
  %quote_mint22 = alloca [32 x i8], align 1
  %_239 = alloca [32 x i8], align 1
  %_235 = alloca [1 x i8], align 1
  %_232 = alloca [32 x i8], align 1
  %_229 = alloca [48 x i8], align 8
  %_226 = alloca [16 x i8], align 8
  %_194 = alloca [160 x i8], align 8
  %_172 = alloca [32 x i8], align 1
  %_170 = alloca [40 x i8], align 8
  %_160 = alloca [16 x i8], align 8
  %_152 = alloca [24 x i8], align 8
  %_140 = alloca [160 x i8], align 8
  %_138 = alloca [32 x i8], align 1
  %_134 = alloca [48 x i8], align 8
  %_132 = alloca [32 x i8], align 8
  %fee = alloca [32 x i8], align 8
  %_123 = alloca [48 x i8], align 8
  %_112 = alloca [48 x i8], align 8
  %_101 = alloca [48 x i8], align 8
  %_75 = alloca [48 x i8], align 8
  %token_program_info = alloca [48 x i8], align 8
  %mint_info = alloca [48 x i8], align 8
  %quote_token_program = alloca [32 x i8], align 1
  %quote_mint = alloca [32 x i8], align 1
  %_65 = alloca [32 x i8], align 1
  %_62 = alloca [32 x i8], align 1
  %_42 = alloca [24 x i8], align 8
  %_41 = alloca [160 x i8], align 8
  %_27 = alloca [24 x i8], align 8
  %_26 = alloca [160 x i8], align 8
  %_12 = alloca [24 x i8], align 8
  %_11 = alloca [160 x i8], align 8
  %buyback_fee_recipient = alloca [8 x i8], align 8
  %fee_recipient = alloca [8 x i8], align 8
  %1 = getelementptr inbounds i8, ptr %ctx, i64 8
  %a = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 8, ptr nonnull %fee_recipient)
  %2 = getelementptr inbounds i8, ptr %a, i64 288
  store ptr %2, ptr %fee_recipient, align 8
  call void @llvm.lifetime.start.p0(i64 8, ptr nonnull %buyback_fee_recipient)
  %3 = getelementptr inbounds i8, ptr %a, i64 304
  store ptr %3, ptr %buyback_fee_recipient, align 8
  %base_token_program = getelementptr inbounds i8, ptr %a, i64 264
  %base_mint = getelementptr inbounds i8, ptr %a, i64 248
  %4 = getelementptr inbounds i8, ptr %a, i64 320
  %_498 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %5 = getelementptr inbounds i8, ptr %_498, i64 161
  %6 = load i8, ptr %5, align 1, !range !374, !noundef !2
  %_9.not = icmp eq i8 %6, 0
  br i1 %_9.not, label %bb5, label %bb1

bb5:                                              ; preds = %start
  br i1 %partial, label %bb6, label %bb7

bb1:                                              ; preds = %start
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_11)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_12)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17hece37d027ca7935cE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_12, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_cdbdeba67b052fefbde5996b437aa24e) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i190)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i), !noalias !4873
  store i64 0, ptr %buf.i, align 8, !noalias !4873
  %_9.sroa.4.0.buf.sroa_idx.i = getelementptr inbounds i8, ptr %buf.i, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i, align 8, !noalias !4873
  %_9.sroa.5.0.buf.sroa_idx.i = getelementptr inbounds i8, ptr %buf.i, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i, align 8, !noalias !4873
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i), !noalias !4873
  %7 = getelementptr inbounds i8, ptr %formatter.i, i64 52
  store i32 0, ptr %7, align 4, !noalias !4873
  %8 = getelementptr inbounds i8, ptr %formatter.i, i64 48
  store i32 32, ptr %8, align 8, !noalias !4873
  %9 = getelementptr inbounds i8, ptr %formatter.i, i64 56
  store i8 3, ptr %9, align 8, !noalias !4873
  store i64 0, ptr %formatter.i, align 8, !noalias !4873
  %10 = getelementptr inbounds i8, ptr %formatter.i, i64 16
  store i64 0, ptr %10, align 8, !noalias !4873
  %11 = getelementptr inbounds i8, ptr %formatter.i, i64 32
  store ptr %buf.i, ptr %11, align 8, !noalias !4873
  %12 = getelementptr inbounds i8, ptr %formatter.i, i64 40
  store ptr @vtable.4, ptr %12, align 8, !noalias !4873
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %13 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hde015761eb04e9b6E"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_cdbdeba67b052fefbde5996b437aa24e, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i) #28, !noalias !4877
  br i1 %13, label %bb3.i, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit"

bb3.i:                                            ; preds = %bb1
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i190, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !4873
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit": ; preds = %bb1
  %14 = getelementptr inbounds i8, ptr %_11, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %14, ptr noundef nonnull align 8 dereferenceable(24) %buf.i, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i), !noalias !4873
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i), !noalias !4873
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i190)
  %15 = getelementptr inbounds i8, ptr %_11, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %15, ptr noundef nonnull align 8 dereferenceable(24) %_12, i64 24, i1 false)
  %16 = getelementptr inbounds i8, ptr %_11, i64 152
  store i32 6005, ptr %16, align 8
  store i64 0, ptr %_11, align 8
  %_15.sroa.4.0._11.sroa_idx = getelementptr inbounds i8, ptr %_11, i64 8
  store ptr @alloc_408c4ea996ce47019dfee66e8868b559, ptr %_15.sroa.4.0._11.sroa_idx, align 8
  %_15.sroa.4.sroa.4.0._15.sroa.4.0._11.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_11, i64 16
  store i64 27, ptr %_15.sroa.4.sroa.4.0._15.sroa.4.0._11.sroa_idx.sroa_idx, align 8
  %_15.sroa.4.sroa.5.0._15.sroa.4.0._11.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_11, i64 24
  store i32 345, ptr %_15.sroa.4.sroa.5.0._15.sroa.4.0._11.sroa_idx.sroa_idx, align 8
  %17 = getelementptr inbounds i8, ptr %_11, i64 80
  store i8 2, ptr %17, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_12)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %18 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_11) #28
  %_10.0 = extractvalue { i64, ptr } %18, 0
  %_10.1 = extractvalue { i64, ptr } %18, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_11)
  br label %bb181

bb7:                                              ; preds = %bb6, %bb5
  %input.sroa.0.0 = phi i64 [ %_0.sroa.0.0.sroa.speculated.i, %bb6 ], [ %0, %bb5 ]
  %_22 = icmp eq i64 %input.sroa.0.0, 0
  br i1 %_22, label %bb8, label %bb13

bb6:                                              ; preds = %bb5
  %19 = getelementptr inbounds i8, ptr %_498, i64 88
  %_21 = load i64, ptr %19, align 8, !noundef !2
  %_0.sroa.0.0.sroa.speculated.i = tail call noundef i64 @llvm.umin.i64(i64 %0, i64 %_21)
  br label %bb7

bb13:                                             ; preds = %bb7
  %20 = getelementptr inbounds i8, ptr %_498, i64 88
  %_37 = load i64, ptr %20, align 8, !noundef !2
  %_36 = icmp ult i64 %_37, %input.sroa.0.0
  br i1 %_36, label %bb14, label %bb19

bb8:                                              ; preds = %bb7
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_26)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_27)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17hece37d027ca7935cE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_27, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e3e143fb26e9bc2a81054057f78086ba) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i190)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i185), !noalias !4878
  store i64 0, ptr %buf.i185, align 8, !noalias !4878
  %_9.sroa.4.0.buf.sroa_idx.i186 = getelementptr inbounds i8, ptr %buf.i185, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i186, align 8, !noalias !4878
  %_9.sroa.5.0.buf.sroa_idx.i187 = getelementptr inbounds i8, ptr %buf.i185, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i187, align 8, !noalias !4878
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i184), !noalias !4878
  %21 = getelementptr inbounds i8, ptr %formatter.i184, i64 52
  store i32 0, ptr %21, align 4, !noalias !4878
  %22 = getelementptr inbounds i8, ptr %formatter.i184, i64 48
  store i32 32, ptr %22, align 8, !noalias !4878
  %23 = getelementptr inbounds i8, ptr %formatter.i184, i64 56
  store i8 3, ptr %23, align 8, !noalias !4878
  store i64 0, ptr %formatter.i184, align 8, !noalias !4878
  %24 = getelementptr inbounds i8, ptr %formatter.i184, i64 16
  store i64 0, ptr %24, align 8, !noalias !4878
  %25 = getelementptr inbounds i8, ptr %formatter.i184, i64 32
  store ptr %buf.i185, ptr %25, align 8, !noalias !4878
  %26 = getelementptr inbounds i8, ptr %formatter.i184, i64 40
  store ptr @vtable.4, ptr %26, align 8, !noalias !4878
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %27 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hde015761eb04e9b6E"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e3e143fb26e9bc2a81054057f78086ba, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i184) #28, !noalias !4882
  br i1 %27, label %bb3.i188, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit189"

bb3.i188:                                         ; preds = %bb8
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i190, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !4878
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit189": ; preds = %bb8
  %28 = getelementptr inbounds i8, ptr %_26, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %28, ptr noundef nonnull align 8 dereferenceable(24) %buf.i185, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i184), !noalias !4878
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i185), !noalias !4878
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i190)
  %29 = getelementptr inbounds i8, ptr %_26, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %29, ptr noundef nonnull align 8 dereferenceable(24) %_27, i64 24, i1 false)
  %30 = getelementptr inbounds i8, ptr %_26, i64 152
  store i32 6020, ptr %30, align 8
  store i64 0, ptr %_26, align 8
  %_30.sroa.4.0._26.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 8
  store ptr @alloc_408c4ea996ce47019dfee66e8868b559, ptr %_30.sroa.4.0._26.sroa_idx, align 8
  %_30.sroa.4.sroa.4.0._30.sroa.4.0._26.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 16
  store i64 27, ptr %_30.sroa.4.sroa.4.0._30.sroa.4.0._26.sroa_idx.sroa_idx, align 8
  %_30.sroa.4.sroa.5.0._30.sroa.4.0._26.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 24
  store i32 354, ptr %_30.sroa.4.sroa.5.0._30.sroa.4.0._26.sroa_idx.sroa_idx, align 8
  %31 = getelementptr inbounds i8, ptr %_26, i64 80
  store i8 2, ptr %31, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_27)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %32 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_26) #28
  %_25.0 = extractvalue { i64, ptr } %32, 0
  %_25.1 = extractvalue { i64, ptr } %32, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_26)
; call anchor_lang::error::Error::with_values
  %33 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h3a6a6e896bb0a944E(i64 noundef %_25.0, ptr noundef %_25.1, i32 noundef 0) #28
  %_24.0 = extractvalue { i64, ptr } %33, 0
  %_24.1 = extractvalue { i64, ptr } %33, 1
  br label %bb181

bb19:                                             ; preds = %bb13
  %34 = getelementptr inbounds i8, ptr %a, i64 240
  %_502 = load ptr, ptr %34, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::legacy_sell::fee_recipient::validate_fee_recipient
  %35 = tail call { i64, ptr } @_ZN14pump_recovered11legacy_sell13fee_recipient22validate_fee_recipient17hb90bf0e38986b8b3E(ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %2, ptr noalias noundef nonnull readonly align 8 dereferenceable(1088) %_502, ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %_498) #28
  %36 = extractvalue { i64, ptr } %35, 0
  %37 = icmp eq i64 %36, 2
  br i1 %37, label %bb192, label %bb191

bb14:                                             ; preds = %bb13
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_41)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_42)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17hece37d027ca7935cE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_42, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_9032913b93df2a93f8a032d18ba5abf9) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i190)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i192), !noalias !4883
  store i64 0, ptr %buf.i192, align 8, !noalias !4883
  %_9.sroa.4.0.buf.sroa_idx.i193 = getelementptr inbounds i8, ptr %buf.i192, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i193, align 8, !noalias !4883
  %_9.sroa.5.0.buf.sroa_idx.i194 = getelementptr inbounds i8, ptr %buf.i192, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i194, align 8, !noalias !4883
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i191), !noalias !4883
  %38 = getelementptr inbounds i8, ptr %formatter.i191, i64 52
  store i32 0, ptr %38, align 4, !noalias !4883
  %39 = getelementptr inbounds i8, ptr %formatter.i191, i64 48
  store i32 32, ptr %39, align 8, !noalias !4883
  %40 = getelementptr inbounds i8, ptr %formatter.i191, i64 56
  store i8 3, ptr %40, align 8, !noalias !4883
  store i64 0, ptr %formatter.i191, align 8, !noalias !4883
  %41 = getelementptr inbounds i8, ptr %formatter.i191, i64 16
  store i64 0, ptr %41, align 8, !noalias !4883
  %42 = getelementptr inbounds i8, ptr %formatter.i191, i64 32
  store ptr %buf.i192, ptr %42, align 8, !noalias !4883
  %43 = getelementptr inbounds i8, ptr %formatter.i191, i64 40
  store ptr @vtable.4, ptr %43, align 8, !noalias !4883
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %44 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hde015761eb04e9b6E"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_9032913b93df2a93f8a032d18ba5abf9, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i191) #28, !noalias !4887
  br i1 %44, label %bb3.i195, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit196"

bb3.i195:                                         ; preds = %bb14
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i190, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !4883
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit196": ; preds = %bb14
  %45 = getelementptr inbounds i8, ptr %_41, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %45, ptr noundef nonnull align 8 dereferenceable(24) %buf.i192, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i191), !noalias !4883
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i192), !noalias !4883
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i190)
  %46 = getelementptr inbounds i8, ptr %_41, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %46, ptr noundef nonnull align 8 dereferenceable(24) %_42, i64 24, i1 false)
  %47 = getelementptr inbounds i8, ptr %_41, i64 152
  store i32 6021, ptr %47, align 8
  store i64 0, ptr %_41, align 8
  %_45.sroa.4.0._41.sroa_idx = getelementptr inbounds i8, ptr %_41, i64 8
  store ptr @alloc_408c4ea996ce47019dfee66e8868b559, ptr %_45.sroa.4.0._41.sroa_idx, align 8
  %_45.sroa.4.sroa.4.0._45.sroa.4.0._41.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_41, i64 16
  store i64 27, ptr %_45.sroa.4.sroa.4.0._45.sroa.4.0._41.sroa_idx.sroa_idx, align 8
  %_45.sroa.4.sroa.5.0._45.sroa.4.0._41.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_41, i64 24
  store i32 356, ptr %_45.sroa.4.sroa.5.0._45.sroa.4.0._41.sroa_idx.sroa_idx, align 8
  %48 = getelementptr inbounds i8, ptr %_41, i64 80
  store i8 2, ptr %48, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_42)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %49 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_41) #28
  %_40.0 = extractvalue { i64, ptr } %49, 0
  %_40.1 = extractvalue { i64, ptr } %49, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_41)
  %_501 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %50 = getelementptr inbounds i8, ptr %_501, i64 88
  %_50 = load i64, ptr %50, align 8, !noundef !2
; call anchor_lang::error::Error::with_values
  %51 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h98218df8cef8c4d0E(i64 noundef %_40.0, ptr noundef %_40.1, i64 noundef %_50, i64 noundef %input.sroa.0.0) #28
  %_39.0 = extractvalue { i64, ptr } %51, 0
  %_39.1 = extractvalue { i64, ptr } %51, 1
  br label %bb181

bb192:                                            ; preds = %bb19
  %_504 = load ptr, ptr %34, align 8, !nonnull !2, !align !3, !noundef !2
  %_60 = getelementptr inbounds i8, ptr %_504, i64 8
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_62)
  %_649 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %_650 = load ptr, ptr %_649, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_62, ptr noundef nonnull align 1 dereferenceable(32) %_650, i64 32, i1 false)
; call pump_recovered::Global::validate_buyback_fee_recipient
  %52 = call { i64, ptr } @_ZN14pump_recovered6Global30validate_buyback_fee_recipient17hfe66b692425e9689E(ptr noalias noundef nonnull readonly align 8 dereferenceable(1080) %_60, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %_62) #28
  %53 = extractvalue { i64, ptr } %52, 0
  %54 = icmp eq i64 %53, 2
  br i1 %54, label %bb194, label %bb193

bb191:                                            ; preds = %bb19
  %55 = extractvalue { i64, ptr } %35, 1
  br label %bb181

bb194:                                            ; preds = %bb192
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_62)
  %_505 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_65)
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_65, i8 0, i64 32, i1 false)
  %_656 = getelementptr inbounds i8, ptr %_505, i64 40
  %56 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_656, ptr noundef nonnull dereferenceable(32) %_65, i64 32)
  %57 = icmp eq i32 %56, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_65)
  br i1 %57, label %bb40.critedge, label %bb23

bb193:                                            ; preds = %bb192
  %58 = extractvalue { i64, ptr } %52, 1
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_62)
  br label %bb181

bb23:                                             ; preds = %bb194
  %59 = getelementptr inbounds i8, ptr %a, i64 256
  %_506 = load ptr, ptr %59, align 8, !nonnull !2, !align !3, !noundef !2
  %60 = getelementptr inbounds i8, ptr %_506, i64 88
  %_658 = load ptr, ptr %60, align 8, !nonnull !2, !align !3, !noundef !2
  %_659 = load ptr, ptr %_658, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %quote_mint, ptr noundef nonnull align 1 dereferenceable(32) %_659, i64 32, i1 false)
  %61 = getelementptr inbounds i8, ptr %a, i64 272
  %_68 = load ptr, ptr %61, align 8, !nonnull !2, !align !3, !noundef !2
  %_660 = load ptr, ptr %_68, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %quote_token_program, ptr noundef nonnull align 1 dereferenceable(32) %_660, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %mint_info)
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %mint_info, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_658) #28
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %token_program_info)
  %_662 = load ptr, ptr %61, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %token_program_info, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_662) #28
  %62 = getelementptr inbounds i8, ptr %a, i64 336
  %_73 = load ptr, ptr %62, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_75)
  %_508 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %_663 = load ptr, ptr %_508, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_75, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_663) #28
  %63 = getelementptr inbounds i8, ptr %a, i64 344
  %_79 = load ptr, ptr %63, align 8, !nonnull !2, !align !3, !noundef !2
  %64 = getelementptr inbounds i8, ptr %a, i64 416
  %_80 = load ptr, ptr %64, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::buy_v2::admit_associated_token_account
  %65 = call { i64, ptr } @_ZN14pump_recovered6buy_v230admit_associated_token_account17he6675bb59fcf31d6E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_73, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_75, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_mint, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_token_program, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %mint_info, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %token_program_info, i1 noundef zeroext false, ptr noundef nonnull %_79, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_80) #28
  %66 = extractvalue { i64, ptr } %65, 0
  %67 = icmp eq i64 %66, 2
  %68 = getelementptr inbounds i8, ptr %_75, i64 8
  %_75.val = load ptr, ptr %68, align 8, !nonnull !2, !noundef !2
  %69 = getelementptr inbounds i8, ptr %_75, i64 16
  %_75.val166 = load ptr, ptr %69, align 8
  %self1.val.i.i.i = load i64, ptr %_75.val, align 8, !noundef !2
  %val.i.i.i = add i64 %self1.val.i.i.i, -1
  store i64 %val.i.i.i, ptr %_75.val, align 8
  %70 = icmp eq i64 %val.i.i.i, 0
  br i1 %70, label %bb1.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i"

bb1.i.i.i:                                        ; preds = %bb23
  %71 = getelementptr i8, ptr %_75.val, i64 8
  %self2.val.i.i.i = load i64, ptr %71, align 8, !noundef !2
  %val6.i.i.i = add i64 %self2.val.i.i.i, -1
  store i64 %val6.i.i.i, ptr %71, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i": ; preds = %bb1.i.i.i, %bb23
  %72 = icmp ne ptr %_75.val166, null
  tail call void @llvm.assume(i1 %72)
  %self1.val.i.i2.i = load i64, ptr %_75.val166, align 8, !noundef !2
  %val.i.i3.i = add i64 %self1.val.i.i2.i, -1
  store i64 %val.i.i3.i, ptr %_75.val166, align 8
  %73 = icmp eq i64 %val.i.i3.i, 0
  br i1 %73, label %bb1.i.i4.i, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit"

bb1.i.i4.i:                                       ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i"
  %74 = getelementptr i8, ptr %_75.val166, i64 8
  %self2.val.i.i5.i = load i64, ptr %74, align 8, !noundef !2
  %val6.i.i6.i = add i64 %self2.val.i.i5.i, -1
  store i64 %val6.i.i6.i, ptr %74, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i", %bb1.i.i4.i
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_75)
  br i1 %67, label %bb201, label %bb178

bb201:                                            ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit"
  %75 = getelementptr inbounds i8, ptr %a, i64 360
  %_84 = load ptr, ptr %75, align 8, !nonnull !2, !align !3, !noundef !2
  %_85 = load ptr, ptr %63, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::buy_v2::check_token_account
  %76 = call { i64, ptr } @_ZN14pump_recovered6buy_v219check_token_account17h29aac793862ee67aE(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_84, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_85, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_mint, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_token_program) #28
  %77 = extractvalue { i64, ptr } %76, 0
  %78 = icmp eq i64 %77, 2
  br i1 %78, label %bb203, label %bb178

bb203:                                            ; preds = %bb201
  %79 = getelementptr inbounds i8, ptr %a, i64 368
  %_89 = load ptr, ptr %79, align 8, !nonnull !2, !align !3, !noundef !2
  %_90 = getelementptr inbounds i8, ptr %a, i64 144
  %_94 = load ptr, ptr %63, align 8, !nonnull !2, !align !3, !noundef !2
  %_95 = load ptr, ptr %64, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::buy_v2::admit_associated_token_account
  %80 = call { i64, ptr } @_ZN14pump_recovered6buy_v230admit_associated_token_account17he6675bb59fcf31d6E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_89, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_90, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_mint, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_token_program, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %mint_info, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %token_program_info, i1 noundef zeroext true, ptr noundef nonnull %_94, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_95) #28
  %81 = extractvalue { i64, ptr } %80, 0
  %82 = icmp eq i64 %81, 2
  br i1 %82, label %bb205, label %bb178

bb205:                                            ; preds = %bb203
  %83 = getelementptr inbounds i8, ptr %a, i64 400
  %_99 = load ptr, ptr %83, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_101)
  %84 = getelementptr inbounds i8, ptr %a, i64 392
  %_509 = load ptr, ptr %84, align 8, !nonnull !2, !align !3, !noundef !2
  %_676 = load ptr, ptr %_509, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_101, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_676) #28
  %_105 = load ptr, ptr %63, align 8, !nonnull !2, !align !3, !noundef !2
  %_106 = load ptr, ptr %64, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::buy_v2::admit_associated_token_account
  %85 = call { i64, ptr } @_ZN14pump_recovered6buy_v230admit_associated_token_account17he6675bb59fcf31d6E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_99, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_101, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_mint, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_token_program, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %mint_info, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %token_program_info, i1 noundef zeroext true, ptr noundef nonnull %_105, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_106) #28
  %86 = extractvalue { i64, ptr } %85, 0
  %87 = icmp eq i64 %86, 2
  %88 = getelementptr inbounds i8, ptr %_101, i64 8
  %_101.val = load ptr, ptr %88, align 8, !nonnull !2, !noundef !2
  %89 = getelementptr inbounds i8, ptr %_101, i64 16
  %_101.val165 = load ptr, ptr %89, align 8
  %self1.val.i.i.i197 = load i64, ptr %_101.val, align 8, !noundef !2
  %val.i.i.i198 = add i64 %self1.val.i.i.i197, -1
  store i64 %val.i.i.i198, ptr %_101.val, align 8
  %90 = icmp eq i64 %val.i.i.i198, 0
  br i1 %90, label %bb1.i.i.i205, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i199"

bb1.i.i.i205:                                     ; preds = %bb205
  %91 = getelementptr i8, ptr %_101.val, i64 8
  %self2.val.i.i.i206 = load i64, ptr %91, align 8, !noundef !2
  %val6.i.i.i207 = add i64 %self2.val.i.i.i206, -1
  store i64 %val6.i.i.i207, ptr %91, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i199"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i199": ; preds = %bb1.i.i.i205, %bb205
  %92 = icmp ne ptr %_101.val165, null
  tail call void @llvm.assume(i1 %92)
  %self1.val.i.i2.i200 = load i64, ptr %_101.val165, align 8, !noundef !2
  %val.i.i3.i201 = add i64 %self1.val.i.i2.i200, -1
  store i64 %val.i.i3.i201, ptr %_101.val165, align 8
  %93 = icmp eq i64 %val.i.i3.i201, 0
  br i1 %93, label %bb1.i.i4.i202, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit208"

bb1.i.i4.i202:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i199"
  %94 = getelementptr i8, ptr %_101.val165, i64 8
  %self2.val.i.i5.i203 = load i64, ptr %94, align 8, !noundef !2
  %val6.i.i6.i204 = add i64 %self2.val.i.i5.i203, -1
  store i64 %val6.i.i6.i204, ptr %94, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit208"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit208": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i199", %bb1.i.i4.i202
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_101)
  br i1 %87, label %bb208, label %bb178

bb208:                                            ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit208"
  %95 = getelementptr inbounds i8, ptr %a, i64 296
  %_110 = load ptr, ptr %95, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_112)
  %_681 = load ptr, ptr %2, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_112, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_681) #28
  %_116 = load ptr, ptr %63, align 8, !nonnull !2, !align !3, !noundef !2
  %_117 = load ptr, ptr %64, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::buy_v2::admit_associated_token_account
  %96 = call { i64, ptr } @_ZN14pump_recovered6buy_v230admit_associated_token_account17he6675bb59fcf31d6E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_110, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_112, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_mint, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_token_program, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %mint_info, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %token_program_info, i1 noundef zeroext true, ptr noundef nonnull %_116, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_117) #28
  %97 = extractvalue { i64, ptr } %96, 0
  %98 = icmp eq i64 %97, 2
  %99 = getelementptr inbounds i8, ptr %_112, i64 8
  %_112.val = load ptr, ptr %99, align 8, !nonnull !2, !noundef !2
  %100 = getelementptr inbounds i8, ptr %_112, i64 16
  %_112.val164 = load ptr, ptr %100, align 8
  %self1.val.i.i.i209 = load i64, ptr %_112.val, align 8, !noundef !2
  %val.i.i.i210 = add i64 %self1.val.i.i.i209, -1
  store i64 %val.i.i.i210, ptr %_112.val, align 8
  %101 = icmp eq i64 %val.i.i.i210, 0
  br i1 %101, label %bb1.i.i.i217, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i211"

bb1.i.i.i217:                                     ; preds = %bb208
  %102 = getelementptr i8, ptr %_112.val, i64 8
  %self2.val.i.i.i218 = load i64, ptr %102, align 8, !noundef !2
  %val6.i.i.i219 = add i64 %self2.val.i.i.i218, -1
  store i64 %val6.i.i.i219, ptr %102, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i211"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i211": ; preds = %bb1.i.i.i217, %bb208
  %103 = icmp ne ptr %_112.val164, null
  tail call void @llvm.assume(i1 %103)
  %self1.val.i.i2.i212 = load i64, ptr %_112.val164, align 8, !noundef !2
  %val.i.i3.i213 = add i64 %self1.val.i.i2.i212, -1
  store i64 %val.i.i3.i213, ptr %_112.val164, align 8
  %104 = icmp eq i64 %val.i.i3.i213, 0
  br i1 %104, label %bb1.i.i4.i214, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit220"

bb1.i.i4.i214:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i211"
  %105 = getelementptr i8, ptr %_112.val164, i64 8
  %self2.val.i.i5.i215 = load i64, ptr %105, align 8, !noundef !2
  %val6.i.i6.i216 = add i64 %self2.val.i.i5.i215, -1
  store i64 %val6.i.i6.i216, ptr %105, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit220"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit220": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i211", %bb1.i.i4.i214
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_112)
  br i1 %98, label %bb211, label %bb178

bb211:                                            ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit220"
  %106 = getelementptr inbounds i8, ptr %a, i64 312
  %_121 = load ptr, ptr %106, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_123)
  %_686 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_123, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_686) #28
  %_127 = load ptr, ptr %63, align 8, !nonnull !2, !align !3, !noundef !2
  %_128 = load ptr, ptr %64, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::buy_v2::admit_associated_token_account
  %107 = call { i64, ptr } @_ZN14pump_recovered6buy_v230admit_associated_token_account17he6675bb59fcf31d6E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_121, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_123, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_mint, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_token_program, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %mint_info, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %token_program_info, i1 noundef zeroext true, ptr noundef nonnull %_127, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_128) #28
  %108 = extractvalue { i64, ptr } %107, 0
  %109 = icmp eq i64 %108, 2
  %110 = getelementptr inbounds i8, ptr %_123, i64 8
  %_123.val = load ptr, ptr %110, align 8, !nonnull !2, !noundef !2
  %111 = getelementptr inbounds i8, ptr %_123, i64 16
  %_123.val163 = load ptr, ptr %111, align 8
  %self1.val.i.i.i221 = load i64, ptr %_123.val, align 8, !noundef !2
  %val.i.i.i222 = add i64 %self1.val.i.i.i221, -1
  store i64 %val.i.i.i222, ptr %_123.val, align 8
  %112 = icmp eq i64 %val.i.i.i222, 0
  br i1 %112, label %bb1.i.i.i229, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i223"

bb1.i.i.i229:                                     ; preds = %bb211
  %113 = getelementptr i8, ptr %_123.val, i64 8
  %self2.val.i.i.i230 = load i64, ptr %113, align 8, !noundef !2
  %val6.i.i.i231 = add i64 %self2.val.i.i.i230, -1
  store i64 %val6.i.i.i231, ptr %113, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i223"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i223": ; preds = %bb1.i.i.i229, %bb211
  %114 = icmp ne ptr %_123.val163, null
  tail call void @llvm.assume(i1 %114)
  %self1.val.i.i2.i224 = load i64, ptr %_123.val163, align 8, !noundef !2
  %val.i.i3.i225 = add i64 %self1.val.i.i2.i224, -1
  store i64 %val.i.i3.i225, ptr %_123.val163, align 8
  %115 = icmp eq i64 %val.i.i3.i225, 0
  br i1 %115, label %bb1.i.i4.i226, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit232"

bb1.i.i4.i226:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i223"
  %116 = getelementptr i8, ptr %_123.val163, i64 8
  %self2.val.i.i5.i227 = load i64, ptr %116, align 8, !noundef !2
  %val6.i.i6.i228 = add i64 %self2.val.i.i5.i227, -1
  store i64 %val6.i.i6.i228, ptr %116, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit232"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit232": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i223", %bb1.i.i4.i226
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_123)
  br i1 %109, label %bb214, label %bb178

bb214:                                            ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit232"
  %117 = getelementptr inbounds i8, ptr %token_program_info, i64 8
  %token_program_info.val161 = load ptr, ptr %117, align 8, !nonnull !2, !noundef !2
  %118 = getelementptr inbounds i8, ptr %token_program_info, i64 16
  %token_program_info.val162 = load ptr, ptr %118, align 8
  %self1.val.i.i.i233 = load i64, ptr %token_program_info.val161, align 8, !noundef !2
  %val.i.i.i234 = add i64 %self1.val.i.i.i233, -1
  store i64 %val.i.i.i234, ptr %token_program_info.val161, align 8
  %119 = icmp eq i64 %val.i.i.i234, 0
  br i1 %119, label %bb1.i.i.i241, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i235"

bb1.i.i.i241:                                     ; preds = %bb214
  %120 = getelementptr i8, ptr %token_program_info.val161, i64 8
  %self2.val.i.i.i242 = load i64, ptr %120, align 8, !noundef !2
  %val6.i.i.i243 = add i64 %self2.val.i.i.i242, -1
  store i64 %val6.i.i.i243, ptr %120, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i235"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i235": ; preds = %bb1.i.i.i241, %bb214
  %121 = icmp ne ptr %token_program_info.val162, null
  tail call void @llvm.assume(i1 %121)
  %self1.val.i.i2.i236 = load i64, ptr %token_program_info.val162, align 8, !noundef !2
  %val.i.i3.i237 = add i64 %self1.val.i.i2.i236, -1
  store i64 %val.i.i3.i237, ptr %token_program_info.val162, align 8
  %122 = icmp eq i64 %val.i.i3.i237, 0
  br i1 %122, label %bb1.i.i4.i238, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit244"

bb1.i.i4.i238:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i235"
  %123 = getelementptr i8, ptr %token_program_info.val162, i64 8
  %self2.val.i.i5.i239 = load i64, ptr %123, align 8, !noundef !2
  %val6.i.i6.i240 = add i64 %self2.val.i.i5.i239, -1
  store i64 %val6.i.i6.i240, ptr %123, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit244"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit244": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i235", %bb1.i.i4.i238
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %token_program_info)
  %124 = getelementptr inbounds i8, ptr %mint_info, i64 8
  %mint_info.val159 = load ptr, ptr %124, align 8, !nonnull !2, !noundef !2
  %125 = getelementptr inbounds i8, ptr %mint_info, i64 16
  %mint_info.val160 = load ptr, ptr %125, align 8
  %self1.val.i.i.i245 = load i64, ptr %mint_info.val159, align 8, !noundef !2
  %val.i.i.i246 = add i64 %self1.val.i.i.i245, -1
  store i64 %val.i.i.i246, ptr %mint_info.val159, align 8
  %126 = icmp eq i64 %val.i.i.i246, 0
  br i1 %126, label %bb1.i.i.i253, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i247"

bb1.i.i.i253:                                     ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit244"
  %127 = getelementptr i8, ptr %mint_info.val159, i64 8
  %self2.val.i.i.i254 = load i64, ptr %127, align 8, !noundef !2
  %val6.i.i.i255 = add i64 %self2.val.i.i.i254, -1
  store i64 %val6.i.i.i255, ptr %127, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i247"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i247": ; preds = %bb1.i.i.i253, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit244"
  %128 = icmp ne ptr %mint_info.val160, null
  tail call void @llvm.assume(i1 %128)
  %self1.val.i.i2.i248 = load i64, ptr %mint_info.val160, align 8, !noundef !2
  %val.i.i3.i249 = add i64 %self1.val.i.i2.i248, -1
  store i64 %val.i.i3.i249, ptr %mint_info.val160, align 8
  %129 = icmp eq i64 %val.i.i3.i249, 0
  br i1 %129, label %bb1.i.i4.i250, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit256"

bb1.i.i4.i250:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i247"
  %130 = getelementptr i8, ptr %mint_info.val160, i64 8
  %self2.val.i.i5.i251 = load i64, ptr %130, align 8, !noundef !2
  %val6.i.i6.i252 = add i64 %self2.val.i.i5.i251, -1
  store i64 %val6.i.i6.i252, ptr %130, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit256"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit256": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i247", %bb1.i.i4.i250
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %mint_info)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %fee)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_132)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_134)
  %_510 = load ptr, ptr %59, align 8, !nonnull !2, !align !3, !noundef !2
  %131 = getelementptr inbounds i8, ptr %_510, i64 88
  %_691 = load ptr, ptr %131, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_134, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_691) #28
; call pump_recovered::transfer_fee_recovered::get_transfer_fee
  call void @_ZN14pump_recovered22transfer_fee_recovered16get_transfer_fee17h171b8dc5e676e915E(ptr noalias nocapture noundef nonnull sret([32 x i8]) align 8 dereferenceable(32) %_132, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_134) #28
  %132 = load i64, ptr %_132, align 8, !range !318, !noundef !2
  %133 = icmp eq i64 %132, 2
  %134 = getelementptr inbounds i8, ptr %_132, i64 8
  %_694.0 = load i64, ptr %134, align 8
  %135 = getelementptr inbounds i8, ptr %_132, i64 16
  %_694.1 = load ptr, ptr %135, align 8
  br i1 %133, label %bb216, label %bb217

bb178:                                            ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit232", %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit220", %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit208", %bb203, %bb201, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit"
  %.pn = phi { i64, ptr } [ %65, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit" ], [ %76, %bb201 ], [ %80, %bb203 ], [ %85, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit208" ], [ %96, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit220" ], [ %107, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit232" ]
  %_0.sroa.0.0 = phi i64 [ %66, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit" ], [ %77, %bb201 ], [ %81, %bb203 ], [ %86, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit208" ], [ %97, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit220" ], [ %108, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit232" ]
  %_0.sroa.43.0 = extractvalue { i64, ptr } %.pn, 1
  %136 = getelementptr inbounds i8, ptr %token_program_info, i64 8
  %token_program_info.val = load ptr, ptr %136, align 8, !nonnull !2, !noundef !2
  %137 = getelementptr inbounds i8, ptr %token_program_info, i64 16
  %token_program_info.val158 = load ptr, ptr %137, align 8
  %self1.val.i.i.i257 = load i64, ptr %token_program_info.val, align 8, !noundef !2
  %val.i.i.i258 = add i64 %self1.val.i.i.i257, -1
  store i64 %val.i.i.i258, ptr %token_program_info.val, align 8
  %138 = icmp eq i64 %val.i.i.i258, 0
  br i1 %138, label %bb1.i.i.i265, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i259"

bb1.i.i.i265:                                     ; preds = %bb178
  %139 = getelementptr i8, ptr %token_program_info.val, i64 8
  %self2.val.i.i.i266 = load i64, ptr %139, align 8, !noundef !2
  %val6.i.i.i267 = add i64 %self2.val.i.i.i266, -1
  store i64 %val6.i.i.i267, ptr %139, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i259"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i259": ; preds = %bb1.i.i.i265, %bb178
  %140 = icmp ne ptr %token_program_info.val158, null
  tail call void @llvm.assume(i1 %140)
  %self1.val.i.i2.i260 = load i64, ptr %token_program_info.val158, align 8, !noundef !2
  %val.i.i3.i261 = add i64 %self1.val.i.i2.i260, -1
  store i64 %val.i.i3.i261, ptr %token_program_info.val158, align 8
  %141 = icmp eq i64 %val.i.i3.i261, 0
  br i1 %141, label %bb1.i.i4.i262, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit268"

bb1.i.i4.i262:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i259"
  %142 = getelementptr i8, ptr %token_program_info.val158, i64 8
  %self2.val.i.i5.i263 = load i64, ptr %142, align 8, !noundef !2
  %val6.i.i6.i264 = add i64 %self2.val.i.i5.i263, -1
  store i64 %val6.i.i6.i264, ptr %142, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit268"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit268": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i259", %bb1.i.i4.i262
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %token_program_info)
  %143 = getelementptr inbounds i8, ptr %mint_info, i64 8
  %mint_info.val = load ptr, ptr %143, align 8, !nonnull !2, !noundef !2
  %144 = getelementptr inbounds i8, ptr %mint_info, i64 16
  %mint_info.val157 = load ptr, ptr %144, align 8
  %self1.val.i.i.i269 = load i64, ptr %mint_info.val, align 8, !noundef !2
  %val.i.i.i270 = add i64 %self1.val.i.i.i269, -1
  store i64 %val.i.i.i270, ptr %mint_info.val, align 8
  %145 = icmp eq i64 %val.i.i.i270, 0
  br i1 %145, label %bb1.i.i.i277, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i271"

bb1.i.i.i277:                                     ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit268"
  %146 = getelementptr i8, ptr %mint_info.val, i64 8
  %self2.val.i.i.i278 = load i64, ptr %146, align 8, !noundef !2
  %val6.i.i.i279 = add i64 %self2.val.i.i.i278, -1
  store i64 %val6.i.i.i279, ptr %146, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i271"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i271": ; preds = %bb1.i.i.i277, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit268"
  %147 = icmp ne ptr %mint_info.val157, null
  tail call void @llvm.assume(i1 %147)
  %self1.val.i.i2.i272 = load i64, ptr %mint_info.val157, align 8, !noundef !2
  %val.i.i3.i273 = add i64 %self1.val.i.i2.i272, -1
  store i64 %val.i.i3.i273, ptr %mint_info.val157, align 8
  %148 = icmp eq i64 %val.i.i3.i273, 0
  br i1 %148, label %bb1.i.i4.i274, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit280"

bb1.i.i4.i274:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i271"
  %149 = getelementptr i8, ptr %mint_info.val157, i64 8
  %self2.val.i.i5.i275 = load i64, ptr %149, align 8, !noundef !2
  %val6.i.i6.i276 = add i64 %self2.val.i.i5.i275, -1
  store i64 %val6.i.i6.i276, ptr %149, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit280"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit280": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i271", %bb1.i.i4.i274
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %mint_info)
  br label %bb181

bb181:                                            ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit", %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit189", %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit196", %bb191, %bb193, %bb173, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit280"
  %_0.sroa.43.1 = phi ptr [ %_10.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit" ], [ %_24.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit189" ], [ %_39.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit196" ], [ %_0.sroa.43.2, %bb173 ], [ %_0.sroa.43.0, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit280" ], [ %58, %bb193 ], [ %55, %bb191 ]
  %_0.sroa.0.1 = phi i64 [ %_10.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit" ], [ %_24.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit189" ], [ %_39.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit196" ], [ %_0.sroa.0.2, %bb173 ], [ %_0.sroa.0.0, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit280" ], [ %53, %bb193 ], [ %36, %bb191 ]
  call void @llvm.lifetime.end.p0(i64 8, ptr nonnull %buyback_fee_recipient)
  call void @llvm.lifetime.end.p0(i64 8, ptr nonnull %fee_recipient)
  br label %bb182

bb40.critedge:                                    ; preds = %bb194
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %fee)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_138)
  %150 = getelementptr inbounds i8, ptr %a, i64 256
  %_511 = load ptr, ptr %150, align 8, !nonnull !2, !align !3, !noundef !2
  %151 = getelementptr inbounds i8, ptr %_511, i64 88
  %_697 = load ptr, ptr %151, align 8, !nonnull !2, !align !3, !noundef !2
  %_698 = load ptr, ptr %_697, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_138, ptr noundef nonnull align 1 dereferenceable(32) %_698, i64 32, i1 false)
  %152 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_138, ptr noundef nonnull dereferenceable(32) @alloc_e953c1d75e6a4349f2dca6892c168ab2, i64 32)
  %153 = icmp eq i32 %152, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_138)
  br i1 %153, label %bb41, label %bb42

bb217:                                            ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit256"
  %_693.sroa.7.0._132.sroa_idx = getelementptr inbounds i8, ptr %_132, i64 24
  %_693.sroa.7.0.copyload = load i64, ptr %_693.sroa.7.0._132.sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_132)
  store i64 %132, ptr %fee, align 8
  %val.sroa.2.0.fee.sroa_idx = getelementptr inbounds i8, ptr %fee, i64 8
  store i64 %_694.0, ptr %val.sroa.2.0.fee.sroa_idx, align 8
  %val.sroa.3.0.fee.sroa_idx = getelementptr inbounds i8, ptr %fee, i64 16
  store ptr %_694.1, ptr %val.sroa.3.0.fee.sroa_idx, align 8
  %val.sroa.4.0.fee.sroa_idx = getelementptr inbounds i8, ptr %fee, i64 24
  store i64 %_693.sroa.7.0.copyload, ptr %val.sroa.4.0.fee.sroa_idx, align 8
  %154 = getelementptr inbounds i8, ptr %_134, i64 8
  %_134.val155 = load ptr, ptr %154, align 8, !nonnull !2, !noundef !2
  %155 = getelementptr inbounds i8, ptr %_134, i64 16
  %_134.val156 = load ptr, ptr %155, align 8
  %self1.val.i.i.i281 = load i64, ptr %_134.val155, align 8, !noundef !2
  %val.i.i.i282 = add i64 %self1.val.i.i.i281, -1
  store i64 %val.i.i.i282, ptr %_134.val155, align 8
  %156 = icmp eq i64 %val.i.i.i282, 0
  br i1 %156, label %bb1.i.i.i289, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i283"

bb1.i.i.i289:                                     ; preds = %bb217
  %157 = getelementptr i8, ptr %_134.val155, i64 8
  %self2.val.i.i.i290 = load i64, ptr %157, align 8, !noundef !2
  %val6.i.i.i291 = add i64 %self2.val.i.i.i290, -1
  store i64 %val6.i.i.i291, ptr %157, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i283"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i283": ; preds = %bb1.i.i.i289, %bb217
  %158 = icmp ne ptr %_134.val156, null
  call void @llvm.assume(i1 %158)
  %self1.val.i.i2.i284 = load i64, ptr %_134.val156, align 8, !noundef !2
  %val.i.i3.i285 = add i64 %self1.val.i.i2.i284, -1
  store i64 %val.i.i3.i285, ptr %_134.val156, align 8
  %159 = icmp eq i64 %val.i.i3.i285, 0
  br i1 %159, label %bb1.i.i4.i286, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit292"

bb1.i.i4.i286:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i283"
  %160 = getelementptr i8, ptr %_134.val156, i64 8
  %self2.val.i.i5.i287 = load i64, ptr %160, align 8, !noundef !2
  %val6.i.i6.i288 = add i64 %self2.val.i.i5.i287, -1
  store i64 %val6.i.i6.i288, ptr %160, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit292"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit292": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i283", %bb1.i.i4.i286
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_134)
  %_512.pre = load ptr, ptr %4, align 8
  br label %bb46

bb216:                                            ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit256"
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_132)
  %161 = getelementptr inbounds i8, ptr %_134, i64 8
  %_134.val = load ptr, ptr %161, align 8, !nonnull !2, !noundef !2
  %162 = getelementptr inbounds i8, ptr %_134, i64 16
  %_134.val154 = load ptr, ptr %162, align 8
  %self1.val.i.i.i293 = load i64, ptr %_134.val, align 8, !noundef !2
  %val.i.i.i294 = add i64 %self1.val.i.i.i293, -1
  store i64 %val.i.i.i294, ptr %_134.val, align 8
  %163 = icmp eq i64 %val.i.i.i294, 0
  br i1 %163, label %bb1.i.i.i301, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i295"

bb1.i.i.i301:                                     ; preds = %bb216
  %164 = getelementptr i8, ptr %_134.val, i64 8
  %self2.val.i.i.i302 = load i64, ptr %164, align 8, !noundef !2
  %val6.i.i.i303 = add i64 %self2.val.i.i.i302, -1
  store i64 %val6.i.i.i303, ptr %164, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i295"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i295": ; preds = %bb1.i.i.i301, %bb216
  %165 = icmp ne ptr %_134.val154, null
  call void @llvm.assume(i1 %165)
  %self1.val.i.i2.i296 = load i64, ptr %_134.val154, align 8, !noundef !2
  %val.i.i3.i297 = add i64 %self1.val.i.i2.i296, -1
  store i64 %val.i.i3.i297, ptr %_134.val154, align 8
  %166 = icmp eq i64 %val.i.i3.i297, 0
  br i1 %166, label %bb1.i.i4.i298, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit304"

bb1.i.i4.i298:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i295"
  %167 = getelementptr i8, ptr %_134.val154, i64 8
  %self2.val.i.i5.i299 = load i64, ptr %167, align 8, !noundef !2
  %val6.i.i6.i300 = add i64 %self2.val.i.i5.i299, -1
  store i64 %val6.i.i6.i300, ptr %167, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit304"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit304": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i295", %bb1.i.i4.i298
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_134)
  br label %bb173

bb46:                                             ; preds = %bb41, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit292"
  %_512 = phi ptr [ %_505, %bb41 ], [ %_512.pre, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit292" ]
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_152)
  %_153 = getelementptr inbounds i8, ptr %_512, i64 8
; call pump_recovered::buy_quote
  call void @_ZN14pump_recovered9buy_quote17h591318dda8fae065E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_152, ptr noalias noundef nonnull readonly align 8 dereferenceable(160) %_153, i64 noundef %input.sroa.0.0) #28
  %_701 = load i64, ptr %_152, align 8, !range !389, !noundef !2
  %trunc.not = icmp eq i64 %_701, 0
  %168 = getelementptr inbounds i8, ptr %_152, i64 8
  %_70275135 = load i64, ptr %168, align 8
  %.sroa_idx = getelementptr inbounds i8, ptr %_152, i64 16
  br i1 %trunc.not, label %bb221, label %bb220

bb173:                                            ; preds = %bb222, %bb220, %bb183, %bb165, %bb261, %bb259, %bb256, %bb252, %bb250, %bb268, %bb265, %bb271, %bb275, %bb277, %bb279, %bb159, %bb228, %bb231, %bb225, %bb42, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit304"
  %_0.sroa.43.2 = phi ptr [ %_0.sroa.43.9, %bb165 ], [ %_192.1, %bb183 ], [ %_0.sroa.43.7, %bb159 ], [ %292, %bb279 ], [ %278, %bb277 ], [ %270, %bb275 ], [ %259, %bb271 ], [ %250, %bb268 ], [ %242, %bb265 ], [ %233, %bb261 ], [ %232, %bb259 ], [ %225, %bb256 ], [ %215, %bb252 ], [ %212, %bb250 ], [ %_733.1, %bb231 ], [ %_722.1, %bb228 ], [ %_716.1, %bb225 ], [ %_139.1, %bb42 ], [ %_694.1, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit304" ], [ %_703.1, %bb220 ], [ %_709.1, %bb222 ]
  %_0.sroa.0.2 = phi i64 [ %_0.sroa.0.9, %bb165 ], [ %_192.0, %bb183 ], [ %_0.sroa.0.7, %bb159 ], [ %284, %bb279 ], [ %276, %bb277 ], [ %265, %bb275 ], [ %256, %bb271 ], [ %248, %bb268 ], [ %238, %bb265 ], [ %230, %bb261 ], [ %223, %bb259 ], [ %217, %bb256 ], [ %210, %bb252 ], [ %188, %bb250 ], [ %_732.sroa.0.0.copyload.pre, %bb231 ], [ %_722.0, %bb228 ], [ %174, %bb225 ], [ %_139.0, %bb42 ], [ %_694.0, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit304" ], [ %_70275135, %bb220 ], [ %_709.0, %bb222 ]
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %fee)
  br label %bb181

bb42:                                             ; preds = %bb40.critedge
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_140)
  %169 = getelementptr inbounds i8, ptr %_140, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17hece37d027ca7935cE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %169, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_472c5e093ab64810a72f5ef4158854b7) #28
  %170 = getelementptr inbounds i8, ptr %_140, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %170, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_472c5e093ab64810a72f5ef4158854b7) #28
  %171 = getelementptr inbounds i8, ptr %_140, i64 152
  store i32 6063, ptr %171, align 8
  store i64 0, ptr %_140, align 8
  %_144.sroa.4.0._140.sroa_idx = getelementptr inbounds i8, ptr %_140, i64 8
  store ptr @alloc_408c4ea996ce47019dfee66e8868b559, ptr %_144.sroa.4.0._140.sroa_idx, align 8
  %_144.sroa.4.sroa.4.0._144.sroa.4.0._140.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_140, i64 16
  store i64 27, ptr %_144.sroa.4.sroa.4.0._144.sroa.4.0._140.sroa_idx.sroa_idx, align 8
  %_144.sroa.4.sroa.5.0._144.sroa.4.0._140.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_140, i64 24
  store i32 369, ptr %_144.sroa.4.sroa.5.0._144.sroa.4.0._140.sroa_idx.sroa_idx, align 8
  %172 = getelementptr inbounds i8, ptr %_140, i64 80
  store i8 2, ptr %172, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %173 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_140) #28
  %_139.0 = extractvalue { i64, ptr } %173, 0
  %_139.1 = extractvalue { i64, ptr } %173, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_140)
  br label %bb173

bb41:                                             ; preds = %bb40.critedge
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %fee, i8 0, i64 32, i1 false)
  br label %bb46

bb221:                                            ; preds = %bb46
  %_70276 = load i64, ptr %.sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_152)
  %_705.not = icmp eq i64 %_70276, 0
  br i1 %_705.not, label %bb223, label %bb222

bb220:                                            ; preds = %bb46
  %_703.1 = load ptr, ptr %.sroa_idx, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_152)
  br label %bb173

bb223:                                            ; preds = %bb221
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_160)
; call pump_recovered::transfer_fee_recovered::pre_fee_amount
  call void @_ZN14pump_recovered22transfer_fee_recovered14pre_fee_amount17h7c2d682af7971a11E(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_160, ptr noalias noundef nonnull readonly align 8 dereferenceable(32) %fee, i64 noundef %_70275135) #28
  %174 = load i64, ptr %_160, align 8, !range !318, !noundef !2
  %175 = icmp eq i64 %174, 2
  %176 = getelementptr inbounds i8, ptr %_160, i64 8
  br i1 %175, label %bb226, label %bb225

bb222:                                            ; preds = %bb221
; call pump_recovered::buy_v2::buy_handler::{{closure}}
  %177 = call fastcc { i64, ptr } @"_ZN14pump_recovered6buy_v211buy_handler28_$u7b$$u7b$closure$u7d$$u7d$17h9b7fdaaedcede850E"() #28
  %_709.0 = extractvalue { i64, ptr } %177, 0
  %_709.1 = extractvalue { i64, ptr } %177, 1
  br label %bb173

bb226:                                            ; preds = %bb223
  %_715 = load i64, ptr %176, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_160)
  %_718.not = icmp ult i64 %_715, %_70275135
  br i1 %_718.not, label %bb228, label %bb227

bb225:                                            ; preds = %bb223
  %_716.1 = load ptr, ptr %176, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_160)
  br label %bb173

bb228:                                            ; preds = %bb226
; call pump_recovered::buy_v2::buy_handler::{{closure}}
  %178 = call fastcc { i64, ptr } @"_ZN14pump_recovered6buy_v211buy_handler28_$u7b$$u7b$closure$u7d$$u7d$17h0ee1e71ad659c923E"() #28
  %_722.0 = extractvalue { i64, ptr } %178, 0
  %_722.1 = extractvalue { i64, ptr } %178, 1
  br label %bb173

bb227:                                            ; preds = %bb226
  %_719 = sub nuw i64 %_715, %_70275135
  call void @llvm.lifetime.start.p0(i64 40, ptr nonnull %_170)
  %_513 = load ptr, ptr %34, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_172)
  %179 = getelementptr inbounds i8, ptr %a, i64 344
  %_727 = load ptr, ptr %179, align 8, !nonnull !2, !align !3, !noundef !2
  %_728 = load ptr, ptr %_727, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_172, ptr noundef nonnull align 1 dereferenceable(32) %_728, i64 32, i1 false)
  %_729 = getelementptr inbounds i8, ptr %_513, i64 648
  %180 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_729, ptr noundef nonnull dereferenceable(32) %_172, i64 32)
  %181 = icmp eq i32 %180, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_172)
  br i1 %181, label %bb232, label %bb50

bb50:                                             ; preds = %bb227
  %_515 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %_516 = load ptr, ptr %base_mint, align 8, !nonnull !2, !align !3, !noundef !2
  %_178 = getelementptr inbounds i8, ptr %a, i64 408
  %182 = getelementptr inbounds i8, ptr %a, i64 424
  %_179 = load ptr, ptr %182, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::legacy_sell::fee_cpi::trade_fees
  call void @_ZN14pump_recovered11legacy_sell7fee_cpi10trade_fees17h6438dad22c79caddE(ptr noalias nocapture noundef nonnull sret([40 x i8]) align 8 dereferenceable(40) %_170, ptr noalias noundef nonnull readonly align 8 dereferenceable(1088) %_513, ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %_515, ptr noalias noundef nonnull readonly align 8 dereferenceable(128) %_516, ptr noalias noundef nonnull readonly align 8 dereferenceable(144) %a, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_178, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_179, i64 noundef %_70275135) #28
  %_731 = load i64, ptr %_170, align 8, !range !389, !noundef !2
  %trunc136.not = icmp eq i64 %_731, 0
  %.phi.trans.insert = getelementptr inbounds i8, ptr %_170, i64 8
  %_732.sroa.0.0.copyload.pre = load i64, ptr %.phi.trans.insert, align 8
  %_732.sroa.6.0..sroa_idx.phi.trans.insert = getelementptr inbounds i8, ptr %_170, i64 16
  br i1 %trunc136.not, label %bb50.bb232_crit_edge, label %bb231

bb50.bb232_crit_edge:                             ; preds = %bb50
  %_732.sroa.6.0.copyload.pre = load i64, ptr %_732.sroa.6.0..sroa_idx.phi.trans.insert, align 8
  %_732.sroa.7.0..sroa_idx.phi.trans.insert = getelementptr inbounds i8, ptr %_170, i64 24
  %_732.sroa.7.0.copyload.pre = load i64, ptr %_732.sroa.7.0..sroa_idx.phi.trans.insert, align 8
  %_732.sroa.8.0..sroa_idx.phi.trans.insert = getelementptr inbounds i8, ptr %_170, i64 32
  %_732.sroa.8.0.copyload.pre = load i64, ptr %_732.sroa.8.0..sroa_idx.phi.trans.insert, align 8
  br label %bb232

bb232:                                            ; preds = %bb227, %bb50.bb232_crit_edge
  %_732.sroa.8.0.copyload = phi i64 [ %_732.sroa.8.0.copyload.pre, %bb50.bb232_crit_edge ], [ 0, %bb227 ]
  %_732.sroa.7.0.copyload = phi i64 [ %_732.sroa.7.0.copyload.pre, %bb50.bb232_crit_edge ], [ 0, %bb227 ]
  %_732.sroa.6.0.copyload = phi i64 [ %_732.sroa.6.0.copyload.pre, %bb50.bb232_crit_edge ], [ 0, %bb227 ]
  %_732.sroa.0.0.copyload = phi i64 [ %_732.sroa.0.0.copyload.pre, %bb50.bb232_crit_edge ], [ 0, %bb227 ]
  call void @llvm.lifetime.end.p0(i64 40, ptr nonnull %_170)
  %183 = call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %_715, i64 %_732.sroa.0.0.copyload)
  %_738.1 = extractvalue { i64, i1 } %183, 1
  br i1 %_738.1, label %bb234, label %bb235

bb231:                                            ; preds = %bb50
  %_733.1 = load ptr, ptr %_732.sroa.6.0..sroa_idx.phi.trans.insert, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 40, ptr nonnull %_170)
  br label %bb173

bb235:                                            ; preds = %bb232
  %_738.0 = extractvalue { i64, i1 } %183, 0
  %184 = call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %_738.0, i64 %_732.sroa.6.0.copyload)
  %_748.0 = extractvalue { i64, i1 } %184, 0
  %_748.1 = extractvalue { i64, i1 } %184, 1
  br i1 %_748.1, label %bb238, label %bb239

bb234:                                            ; preds = %bb232
; call pump_recovered::buy_v2::buy_handler::{{closure}}
  %185 = call fastcc { i64, ptr } @"_ZN14pump_recovered6buy_v211buy_handler28_$u7b$$u7b$closure$u7d$$u7d$17h7dc7804a29c28dc1E"() #28
  br label %bb165

bb239:                                            ; preds = %bb235
  %_181 = icmp ugt i64 %_748.0, %limit
  br i1 %_181, label %bb183, label %bb184

bb238:                                            ; preds = %bb235
; call pump_recovered::buy_v2::buy_handler::{{closure}}
  %186 = call fastcc { i64, ptr } @"_ZN14pump_recovered6buy_v211buy_handler28_$u7b$$u7b$closure$u7d$$u7d$17h2818ba5b0fe65e2bE"() #28
  br label %bb165

bb184:                                            ; preds = %bb239
  %_517 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %_215 = getelementptr inbounds i8, ptr %_517, i64 8
; call pump_recovered::<impl pump_recovered::trade_types::BondingCurve>::apply_buy
  %187 = call { i64, ptr } @"_ZN14pump_recovered59_$LT$impl$u20$pump_recovered..trade_types..BondingCurve$GT$9apply_buy17h127c4a98cd9ea505E"(ptr noalias noundef nonnull align 8 dereferenceable(160) %_215, i64 noundef %input.sroa.0.0, i64 noundef %_70275135) #28
  %188 = extractvalue { i64, ptr } %187, 0
  %189 = icmp eq i64 %188, 2
  br i1 %189, label %bb251, label %bb250

bb183:                                            ; preds = %bb239
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_194)
  %190 = getelementptr inbounds i8, ptr %_194, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17hece37d027ca7935cE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %190, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_2e38410fced2c310c68bdf2d45d0c3bd) #28
  %191 = getelementptr inbounds i8, ptr %_194, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %191, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_2e38410fced2c310c68bdf2d45d0c3bd) #28
  %192 = getelementptr inbounds i8, ptr %_194, i64 152
  store i32 6002, ptr %192, align 8
  store i64 0, ptr %_194, align 8
  %_198.sroa.4.0._194.sroa_idx = getelementptr inbounds i8, ptr %_194, i64 8
  store ptr @alloc_408c4ea996ce47019dfee66e8868b559, ptr %_198.sroa.4.0._194.sroa_idx, align 8
  %_198.sroa.4.sroa.4.0._198.sroa.4.0._194.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_194, i64 16
  store i64 27, ptr %_198.sroa.4.sroa.4.0._198.sroa.4.0._194.sroa_idx.sroa_idx, align 8
  %_198.sroa.4.sroa.5.0._198.sroa.4.0._194.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_194, i64 24
  store i32 494, ptr %_198.sroa.4.sroa.5.0._198.sroa.4.0._194.sroa_idx.sroa_idx, align 8
  %193 = getelementptr inbounds i8, ptr %_194, i64 80
  store i8 2, ptr %193, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %194 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_194) #28
  %195 = extractvalue { i64, ptr } %194, 0
  %196 = extractvalue { i64, ptr } %194, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_194)
; call anchor_lang::error::Error::with_values
  %197 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h98218df8cef8c4d0E(i64 noundef %195, ptr noundef %196, i64 noundef %limit, i64 noundef %_748.0) #28
  %_192.1 = extractvalue { i64, ptr } %197, 1
  %_192.0 = extractvalue { i64, ptr } %197, 0
  br label %bb173

bb251:                                            ; preds = %bb184
  %198 = getelementptr inbounds i8, ptr %a, i64 328
  %_518 = load ptr, ptr %198, align 8, !nonnull !2, !align !3, !noundef !2
  %199 = getelementptr inbounds i8, ptr %a, i64 352
  %_519 = load ptr, ptr %199, align 8, !nonnull !2, !align !3, !noundef !2
  %_520 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %_521 = load ptr, ptr %base_mint, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_226)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_229)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_232)
  %200 = getelementptr inbounds i8, ptr %_521, i64 88
  %_776 = load ptr, ptr %200, align 8, !nonnull !2, !align !3, !noundef !2
  %_777 = load ptr, ptr %_776, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_232, ptr noundef nonnull align 1 dereferenceable(32) %_777, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %_235)
  %201 = getelementptr inbounds i8, ptr %ctx, i64 35
  %_236 = load i8, ptr %201, align 1, !noundef !2
  store i8 %_236, ptr %_235, align 1
  store ptr @alloc_65b7b62d1c393af7ea07c820158a5930, ptr %_229, align 8
  %202 = getelementptr inbounds i8, ptr %_229, i64 8
  store i64 13, ptr %202, align 8
  %203 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_229, i64 0, i64 1
  store ptr %_232, ptr %203, align 8
  %204 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_229, i64 0, i64 1, i32 1
  store i64 32, ptr %204, align 8
  %205 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_229, i64 0, i64 2
  store ptr %_235, ptr %205, align 8
  %206 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_229, i64 0, i64 2, i32 1
  store i64 1, ptr %206, align 8
  store ptr %_229, ptr %_226, align 8
  %207 = getelementptr inbounds i8, ptr %_226, i64 8
  store i64 3, ptr %207, align 8
  %208 = getelementptr i8, ptr %_521, i64 48
  %_521.val = load i8, ptr %208, align 8, !noundef !2
; call pump_recovered::buy_v2::token_transfers::transfer_curve_tokens
  %209 = call { i64, ptr } @_ZN14pump_recovered6buy_v215token_transfers21transfer_curve_tokens17hc402f5276e63c661E(ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %base_token_program, ptr noalias noundef nonnull readonly align 8 dereferenceable(216) %_518, ptr noalias noundef nonnull readonly align 8 dereferenceable(216) %_519, ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %_520, i8 noundef %_521.val, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_776, i64 noundef %input.sroa.0.0, ptr noalias noundef nonnull readonly align 8 dereferenceable(16) %_226) #28
  %210 = extractvalue { i64, ptr } %209, 0
  %211 = icmp eq i64 %210, 2
  br i1 %211, label %bb253, label %bb252

bb250:                                            ; preds = %bb184
  %212 = extractvalue { i64, ptr } %187, 1
  br label %bb173

bb253:                                            ; preds = %bb251
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_235)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_232)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_229)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_226)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_239)
  %_783 = load ptr, ptr %179, align 8, !nonnull !2, !align !3, !noundef !2
  %_784 = load ptr, ptr %_783, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_239, ptr noundef nonnull align 1 dereferenceable(32) %_784, i64 32, i1 false)
  %_522 = load ptr, ptr %34, align 8, !nonnull !2, !align !3, !noundef !2
  %_787 = getelementptr inbounds i8, ptr %_522, i64 648
  %213 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_239, ptr noundef nonnull dereferenceable(32) %_787, i64 32)
  %214 = icmp eq i32 %213, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_239)
  br i1 %214, label %bb58, label %bb61

bb252:                                            ; preds = %bb251
  %215 = extractvalue { i64, ptr } %209, 1
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_235)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_232)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_229)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_226)
  br label %bb173

bb58:                                             ; preds = %bb253
  %_523 = load ptr, ptr %198, align 8, !nonnull !2, !align !3, !noundef !2
  %_788 = getelementptr inbounds i8, ptr %_523, i64 32
; call anchor_lang::accounts::account::Account<T>::reload
  %216 = call fastcc { i64, ptr } @"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h807a91e77d8dcc0bE"(ptr noalias noundef nonnull align 8 dereferenceable(184) %_788) #28
  %217 = extractvalue { i64, ptr } %216, 0
  %218 = icmp eq i64 %217, 2
  br i1 %218, label %bb257, label %bb256

bb61:                                             ; preds = %bb253, %bb262
  %219 = getelementptr inbounds i8, ptr %a, i64 392
  %_529 = load ptr, ptr %219, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_255)
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_255, i8 0, i64 32, i1 false)
  %_803 = getelementptr inbounds i8, ptr %_529, i64 8
  %220 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_803, ptr noundef nonnull dereferenceable(32) %_255, i64 32)
  %221 = icmp eq i32 %220, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_255)
  br i1 %221, label %bb62, label %bb64

bb257:                                            ; preds = %bb58
  %_524 = load ptr, ptr %199, align 8, !nonnull !2, !align !3, !noundef !2
  %_792 = getelementptr inbounds i8, ptr %_524, i64 32
; call anchor_lang::accounts::account::Account<T>::reload
  %222 = call fastcc { i64, ptr } @"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h807a91e77d8dcc0bE"(ptr noalias noundef nonnull align 8 dereferenceable(184) %_792) #28
  %223 = extractvalue { i64, ptr } %222, 0
  %224 = icmp eq i64 %223, 2
  br i1 %224, label %bb260, label %bb259

bb256:                                            ; preds = %bb58
  %225 = extractvalue { i64, ptr } %216, 1
  br label %bb173

bb260:                                            ; preds = %bb257
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %quote_mint22)
  %_525 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %226 = getelementptr inbounds i8, ptr %_525, i64 40
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %quote_mint22, ptr noundef nonnull align 8 dereferenceable(32) %226, i64 32, i1 false)
  %_249 = getelementptr inbounds i8, ptr %_525, i64 8
  %_527 = load ptr, ptr %198, align 8, !nonnull !2, !align !3, !noundef !2
  %227 = getelementptr inbounds i8, ptr %_527, i64 104
  %_250 = load i64, ptr %227, align 8, !noundef !2
  %_528 = load ptr, ptr %199, align 8, !nonnull !2, !align !3, !noundef !2
  %228 = getelementptr inbounds i8, ptr %_528, i64 104
  %_251 = load i64, ptr %228, align 8, !noundef !2
; call pump_recovered::mayhem_virtual_params::<impl pump_recovered::trade_types::BondingCurve>::sync_virtual_quote_reserves
  %229 = call { i64, ptr } @"_ZN14pump_recovered21mayhem_virtual_params59_$LT$impl$u20$pump_recovered..trade_types..BondingCurve$GT$27sync_virtual_quote_reserves17h697b91a2a2b40556E"(ptr noalias noundef nonnull align 8 dereferenceable(160) %_249, i64 noundef %_250, i64 noundef %_251, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %quote_mint22) #28
  %230 = extractvalue { i64, ptr } %229, 0
  %231 = icmp eq i64 %230, 2
  br i1 %231, label %bb262, label %bb261

bb259:                                            ; preds = %bb257
  %232 = extractvalue { i64, ptr } %222, 1
  br label %bb173

bb262:                                            ; preds = %bb260
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %quote_mint22)
  br label %bb61

bb261:                                            ; preds = %bb260
  %233 = extractvalue { i64, ptr } %229, 1
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %quote_mint22)
  br label %bb173

bb62:                                             ; preds = %bb61
  %_805 = load ptr, ptr %179, align 8, !nonnull !2, !align !3, !noundef !2
  %_806 = load ptr, ptr %_805, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memmove.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %_803, ptr noundef nonnull align 1 dereferenceable(32) %_806, i64 32, i1 false)
  br label %bb64

bb64:                                             ; preds = %bb61, %bb62
  %_258.not = icmp eq i64 %_732.sroa.6.0.copyload, 0
  br i1 %_258.not, label %bb79, label %bb65

bb79:                                             ; preds = %bb70, %bb272, %bb64
  %_297 = getelementptr inbounds i8, ptr %a, i64 416
  %_936 = load ptr, ptr %4, align 8, !nonnull !2, !noundef !2
  %_300 = getelementptr inbounds i8, ptr %a, i64 272
  %234 = getelementptr inbounds i8, ptr %a, i64 256
  %_536 = load ptr, ptr %234, align 8, !nonnull !2, !align !3, !noundef !2
  br i1 %57, label %bb82, label %bb81

bb65:                                             ; preds = %bb64
  %_531 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %235 = getelementptr inbounds i8, ptr %_531, i64 163
  %236 = load i8, ptr %235, align 1, !range !374, !noundef !2
  %_259.not = icmp eq i8 %236, 0
  %_262 = getelementptr inbounds i8, ptr %a, i64 416
  br i1 %_259.not, label %bb66, label %bb72

bb66:                                             ; preds = %bb65
  %_264 = getelementptr inbounds i8, ptr %a, i64 144
; call pump_native_payments::ensure_rent_exempt_v2
  %237 = call { i64, ptr } @_ZN20pump_native_payments21ensure_rent_exempt_v217h8954b1153ee55fbcE(i64 noundef 0, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_262, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %179, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_264) #28
  %238 = extractvalue { i64, ptr } %237, 0
  %239 = icmp eq i64 %238, 2
  br i1 %239, label %bb266, label %bb265

bb72:                                             ; preds = %bb65
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_283)
  %_533 = load ptr, ptr %219, align 8, !nonnull !2, !align !3, !noundef !2
  %_815 = load ptr, ptr %_533, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_283, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_815) #28
  %_284 = getelementptr inbounds i8, ptr %a, i64 272
  %240 = getelementptr inbounds i8, ptr %a, i64 256
  %_534 = load ptr, ptr %240, align 8, !nonnull !2, !align !3, !noundef !2
  br i1 %57, label %bb75, label %bb74

bb266:                                            ; preds = %bb66
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_270)
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_270, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_264) #28
  %_272 = getelementptr inbounds i8, ptr %a, i64 272
  %241 = getelementptr inbounds i8, ptr %a, i64 256
  %_532 = load ptr, ptr %241, align 8, !nonnull !2, !align !3, !noundef !2
  br i1 %57, label %bb70, label %bb69

bb265:                                            ; preds = %bb66
  %242 = extractvalue { i64, ptr } %237, 1
  br label %bb173

bb69:                                             ; preds = %bb266
  %243 = getelementptr inbounds i8, ptr %a, i64 360
  %_275 = load ptr, ptr %243, align 8, !nonnull !2, !align !3, !noundef !2
  %244 = getelementptr inbounds i8, ptr %a, i64 368
  %_277 = load ptr, ptr %244, align 8, !nonnull !2, !align !3, !noundef !2
  br label %bb70

bb70:                                             ; preds = %bb266, %bb69
  %_274.sroa.0.0 = phi ptr [ %_275, %bb69 ], [ null, %bb266 ]
  %_276.sroa.0.0 = phi ptr [ %_277, %bb69 ], [ null, %bb266 ]
  %_262.val169 = load ptr, ptr %_262, align 8, !nonnull !2, !align !3, !noundef !2
  %245 = getelementptr i8, ptr %_532, i64 48
  %_532.val = load i8, ptr %245, align 8, !noundef !2
  %246 = getelementptr i8, ptr %_532, i64 88
  %_532.val170 = load ptr, ptr %246, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::user_quote_payments::transfer_from_user_owned
  %247 = call { i64, ptr } @_ZN14pump_recovered19user_quote_payments24transfer_from_user_owned17h029748c57774cd08E(i1 noundef zeroext %57, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_262.val169, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %179, ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_270, i64 noundef %_732.sroa.6.0.copyload, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_272, i8 noundef %_532.val, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_532.val170, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_274.sroa.0.0, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_276.sroa.0.0) #28
  %248 = extractvalue { i64, ptr } %247, 0
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_270)
  %249 = icmp eq i64 %248, 2
  br i1 %249, label %bb79, label %bb268

bb268:                                            ; preds = %bb70
  %250 = extractvalue { i64, ptr } %247, 1
  br label %bb173

bb74:                                             ; preds = %bb72
  %251 = getelementptr inbounds i8, ptr %a, i64 360
  %_287 = load ptr, ptr %251, align 8, !nonnull !2, !align !3, !noundef !2
  %252 = getelementptr inbounds i8, ptr %a, i64 400
  %_289 = load ptr, ptr %252, align 8, !nonnull !2, !align !3, !noundef !2
  br label %bb75

bb75:                                             ; preds = %bb72, %bb74
  %_286.sroa.0.0 = phi ptr [ %_287, %bb74 ], [ null, %bb72 ]
  %_288.sroa.0.0 = phi ptr [ %_289, %bb74 ], [ null, %bb72 ]
  %_262.val = load ptr, ptr %_262, align 8, !nonnull !2, !align !3, !noundef !2
  %253 = getelementptr i8, ptr %_534, i64 48
  %_534.val = load i8, ptr %253, align 8, !noundef !2
  %254 = getelementptr i8, ptr %_534, i64 88
  %_534.val168 = load ptr, ptr %254, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::user_quote_payments::transfer_from_user_owned
  %255 = call { i64, ptr } @_ZN14pump_recovered19user_quote_payments24transfer_from_user_owned17h029748c57774cd08E(i1 noundef zeroext %57, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_262.val, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %179, ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_283, i64 noundef %_732.sroa.6.0.copyload, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_284, i8 noundef %_534.val, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_534.val168, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_286.sroa.0.0, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_288.sroa.0.0) #28
  %256 = extractvalue { i64, ptr } %255, 0
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_283)
  %257 = icmp eq i64 %256, 2
  br i1 %257, label %bb272, label %bb271

bb272:                                            ; preds = %bb75
  %_535 = load ptr, ptr %219, align 8, !nonnull !2, !align !3, !noundef !2
  %_293 = getelementptr inbounds i8, ptr %_535, i64 8
; call pump_recovered::token_incentives::volume_accumulator::record_cashback_earned
  %258 = call { i64, ptr } @_ZN14pump_recovered16token_incentives18volume_accumulator22record_cashback_earned17h78393e8c270430dcE(ptr noalias noundef nonnull align 8 dereferenceable(104) %_293, i64 noundef %_732.sroa.6.0.copyload, i1 noundef zeroext %57) #28
  br label %bb79

bb271:                                            ; preds = %bb75
  %259 = extractvalue { i64, ptr } %255, 1
  br label %bb173

bb81:                                             ; preds = %bb79
  %260 = getelementptr inbounds i8, ptr %a, i64 360
  %_303 = load ptr, ptr %260, align 8, !nonnull !2, !align !3, !noundef !2
  %261 = getelementptr inbounds i8, ptr %a, i64 336
  %_305 = load ptr, ptr %261, align 8, !nonnull !2, !align !3, !noundef !2
  br label %bb82

bb82:                                             ; preds = %bb79, %bb81
  %_302.sroa.0.0 = phi ptr [ %_303, %bb81 ], [ null, %bb79 ]
  %_304.sroa.0.0 = phi ptr [ %_305, %bb81 ], [ null, %bb79 ]
  %_297.val = load ptr, ptr %_297, align 8, !nonnull !2, !align !3, !noundef !2
  %262 = getelementptr i8, ptr %_536, i64 48
  %_536.val = load i8, ptr %262, align 8, !noundef !2
  %263 = getelementptr i8, ptr %_536, i64 88
  %_536.val171 = load ptr, ptr %263, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::user_quote_payments::transfer_from_user
  %264 = call { i64, ptr } @_ZN14pump_recovered19user_quote_payments18transfer_from_user17h07b5836f55389456E(i1 noundef zeroext %57, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_297.val, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %179, ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %_936, i64 noundef %_715, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_300, i8 noundef %_536.val, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_536.val171, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_302.sroa.0.0, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_304.sroa.0.0) #28
  %265 = extractvalue { i64, ptr } %264, 0
  %266 = icmp eq i64 %265, 2
  br i1 %266, label %bb276, label %bb275

bb276:                                            ; preds = %bb82
  %_537 = load ptr, ptr %34, align 8, !nonnull !2, !align !3, !noundef !2
  %_310 = getelementptr inbounds i8, ptr %_537, i64 8
  %_538 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %267 = getelementptr inbounds i8, ptr %_538, i64 162
  %268 = load i8, ptr %267, align 2, !range !374, !noundef !2
  %_311 = icmp ne i8 %268, 0
; call pump_recovered::split_protocol_fee
  %269 = call { i64, i64 } @_ZN14pump_recovered18split_protocol_fee17hb40f256d491c00bfE(ptr noalias noundef nonnull readonly align 8 dereferenceable(1080) %_310, i64 noundef %_732.sroa.0.0.copyload, i1 noundef zeroext %_311) #28
  %_309.0 = extractvalue { i64, i64 } %269, 0
  %_309.1 = extractvalue { i64, i64 } %269, 1
  %_539 = load ptr, ptr %234, align 8, !nonnull !2, !align !3, !noundef !2
  br i1 %57, label %bb87, label %bb86

bb275:                                            ; preds = %bb82
  %270 = extractvalue { i64, ptr } %264, 1
  br label %bb173

bb86:                                             ; preds = %bb276
  %271 = getelementptr inbounds i8, ptr %a, i64 360
  %_320 = load ptr, ptr %271, align 8, !nonnull !2, !align !3, !noundef !2
  %272 = getelementptr inbounds i8, ptr %a, i64 296
  %_322 = load ptr, ptr %272, align 8, !nonnull !2, !align !3, !noundef !2
  br label %bb87

bb87:                                             ; preds = %bb276, %bb86
  %_319.sroa.0.0 = phi ptr [ %_320, %bb86 ], [ null, %bb276 ]
  %_321.sroa.0.0 = phi ptr [ %_322, %bb86 ], [ null, %bb276 ]
  %_297.val174 = load ptr, ptr %_297, align 8, !nonnull !2, !align !3, !noundef !2
  %273 = getelementptr i8, ptr %_539, i64 48
  %_539.val = load i8, ptr %273, align 8, !noundef !2
  %274 = getelementptr i8, ptr %_539, i64 88
  %_539.val175 = load ptr, ptr %274, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::user_quote_payments::transfer_from_user_recipient
  %275 = call { i64, ptr } @_ZN14pump_recovered19user_quote_payments28transfer_from_user_recipient17h418389050960fd82E(i1 noundef zeroext %57, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_297.val174, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %179, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %fee_recipient, i64 noundef %_309.1, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_300, i8 noundef %_539.val, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_539.val175, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_319.sroa.0.0, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_321.sroa.0.0) #28
  %276 = extractvalue { i64, ptr } %275, 0
  %277 = icmp eq i64 %276, 2
  br i1 %277, label %bb278, label %bb277

bb278:                                            ; preds = %bb87
  %_540 = load ptr, ptr %234, align 8, !nonnull !2, !align !3, !noundef !2
  br i1 %57, label %bb91, label %bb90

bb277:                                            ; preds = %bb87
  %278 = extractvalue { i64, ptr } %275, 1
  br label %bb173

bb90:                                             ; preds = %bb278
  %279 = getelementptr inbounds i8, ptr %a, i64 360
  %_332 = load ptr, ptr %279, align 8, !nonnull !2, !align !3, !noundef !2
  %280 = getelementptr inbounds i8, ptr %a, i64 312
  %_334 = load ptr, ptr %280, align 8, !nonnull !2, !align !3, !noundef !2
  br label %bb91

bb91:                                             ; preds = %bb278, %bb90
  %_331.sroa.0.0 = phi ptr [ %_332, %bb90 ], [ null, %bb278 ]
  %_333.sroa.0.0 = phi ptr [ %_334, %bb90 ], [ null, %bb278 ]
  %_297.val172 = load ptr, ptr %_297, align 8, !nonnull !2, !align !3, !noundef !2
  %281 = getelementptr i8, ptr %_540, i64 48
  %_540.val = load i8, ptr %281, align 8, !noundef !2
  %282 = getelementptr i8, ptr %_540, i64 88
  %_540.val173 = load ptr, ptr %282, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::user_quote_payments::transfer_from_user_recipient
  %283 = call { i64, ptr } @_ZN14pump_recovered19user_quote_payments28transfer_from_user_recipient17h418389050960fd82E(i1 noundef zeroext %57, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_297.val172, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %179, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %buyback_fee_recipient, i64 noundef %_309.0, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_300, i8 noundef %_540.val, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_540.val173, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_331.sroa.0.0, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_333.sroa.0.0) #28
  %284 = extractvalue { i64, ptr } %283, 0
  %285 = icmp eq i64 %284, 2
  br i1 %285, label %bb280, label %bb279

bb280:                                            ; preds = %bb91
  %_541 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %286 = getelementptr inbounds i8, ptr %_541, i64 8
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %creator, ptr noundef nonnull align 8 dereferenceable(32) %286, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %quote_mint31)
  %287 = getelementptr inbounds i8, ptr %_541, i64 40
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %quote_mint31, ptr noundef nonnull align 8 dereferenceable(32) %287, i64 32, i1 false)
  %288 = getelementptr inbounds i8, ptr %_541, i64 72
  %vb = load i64, ptr %288, align 8, !noundef !2
  %289 = getelementptr inbounds i8, ptr %_541, i64 80
  %vq = load i64, ptr %289, align 8, !noundef !2
  %290 = getelementptr inbounds i8, ptr %_541, i64 88
  %rb = load i64, ptr %290, align 8, !noundef !2
  %291 = getelementptr inbounds i8, ptr %_541, i64 96
  %rq = load i64, ptr %291, align 8, !noundef !2
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_344)
; call solana_sysvar::clock::<impl solana_sysvar::Sysvar for solana_clock::Clock>::get
  call void @"_ZN13solana_sysvar5clock71_$LT$impl$u20$solana_sysvar..Sysvar$u20$for$u20$solana_clock..Clock$GT$3get17hf864a57fc372ac1bE"(ptr noalias nocapture noundef nonnull sret([48 x i8]) align 8 dereferenceable(48) %_344) #28
  %_837 = load i64, ptr %_344, align 8, !range !389, !noundef !2
  %trunc137.not = icmp eq i64 %_837, 0
  br i1 %trunc137.not, label %bb282, label %bb281

bb279:                                            ; preds = %bb91
  %292 = extractvalue { i64, ptr } %283, 1
  br label %bb173

bb282:                                            ; preds = %bb280
  %_838.sroa.8.0..sroa_idx = getelementptr inbounds i8, ptr %_344, i64 40
  %_838.sroa.8.0.copyload = load i64, ptr %_838.sroa.8.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_344)
  %_547 = load ptr, ptr %219, align 8, !nonnull !2, !align !3, !noundef !2
  %293 = getelementptr inbounds i8, ptr %_547, i64 40
  %total_unclaimed_tokens = load i64, ptr %293, align 8, !noundef !2
  %294 = getelementptr inbounds i8, ptr %_547, i64 48
  %total_claimed_tokens = load i64, ptr %294, align 8, !noundef !2
  %295 = getelementptr inbounds i8, ptr %_547, i64 56
  %current_sol_volume = load i64, ptr %295, align 8, !noundef !2
  %296 = getelementptr inbounds i8, ptr %_547, i64 64
  %last_update_timestamp = load i64, ptr %296, align 8, !noundef !2
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_353)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_355)
  %297 = getelementptr inbounds i8, ptr %a, i64 376
  %_843 = load ptr, ptr %297, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_355, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_843) #28
; call pump_recovered::distribution::sharing_config_shareholders
  call void @_ZN14pump_recovered12distribution27sharing_config_shareholders17h0598193ba6e37d86E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_353, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_355) #28
  %298 = load i64, ptr %_353, align 8, !range !4888, !noundef !2
  %299 = getelementptr inbounds i8, ptr %_353, i64 8
  %_846.0 = load i64, ptr %299, align 8
  %300 = getelementptr inbounds i8, ptr %_353, i64 16
  %_846.1 = load ptr, ptr %300, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_353)
  switch i64 %298, label %bb289 [
    i64 -9223372036854775807, label %bb285
    i64 -9223372036854775808, label %bb287
  ]

bb281:                                            ; preds = %bb280
  %301 = getelementptr inbounds i8, ptr %_344, i64 8
  %_839.sroa.0.0.copyload = load i64, ptr %301, align 8
  %_839.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_344, i64 16
  %_839.sroa.5.0.copyload = load i64, ptr %_839.sroa.5.0..sroa_idx, align 8
  %_839.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_344, i64 24
  %_839.sroa.6.0.copyload = load i64, ptr %_839.sroa.6.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_344)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_841)
  store i64 %_839.sroa.0.0.copyload, ptr %_841, align 8
  %residual32.sroa.2.0._841.sroa_idx = getelementptr inbounds i8, ptr %_841, i64 8
  store i64 %_839.sroa.5.0.copyload, ptr %residual32.sroa.2.0._841.sroa_idx, align 8
  %residual32.sroa.3.0._841.sroa_idx = getelementptr inbounds i8, ptr %_841, i64 16
  store i64 %_839.sroa.6.0.copyload, ptr %residual32.sroa.3.0._841.sroa_idx, align 8
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %302 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17ha4865197be4b9a2fE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_841) #28
  %_842.0 = extractvalue { i64, ptr } %302, 0
  %_842.1 = extractvalue { i64, ptr } %302, 1
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_841)
  br label %bb159

bb285:                                            ; preds = %bb282
  %303 = getelementptr inbounds i8, ptr %_355, i64 8
  %_355.val = load ptr, ptr %303, align 8, !nonnull !2, !noundef !2
  %304 = getelementptr inbounds i8, ptr %_355, i64 16
  %_355.val151 = load ptr, ptr %304, align 8
  %self1.val.i.i.i305 = load i64, ptr %_355.val, align 8, !noundef !2
  %val.i.i.i306 = add i64 %self1.val.i.i.i305, -1
  store i64 %val.i.i.i306, ptr %_355.val, align 8
  %305 = icmp eq i64 %val.i.i.i306, 0
  br i1 %305, label %bb1.i.i.i313, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i307"

bb1.i.i.i313:                                     ; preds = %bb285
  %306 = getelementptr i8, ptr %_355.val, i64 8
  %self2.val.i.i.i314 = load i64, ptr %306, align 8, !noundef !2
  %val6.i.i.i315 = add i64 %self2.val.i.i.i314, -1
  store i64 %val6.i.i.i315, ptr %306, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i307"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i307": ; preds = %bb1.i.i.i313, %bb285
  %307 = icmp ne ptr %_355.val151, null
  call void @llvm.assume(i1 %307)
  %self1.val.i.i2.i308 = load i64, ptr %_355.val151, align 8, !noundef !2
  %val.i.i3.i309 = add i64 %self1.val.i.i2.i308, -1
  store i64 %val.i.i3.i309, ptr %_355.val151, align 8
  %308 = icmp eq i64 %val.i.i3.i309, 0
  br i1 %308, label %bb1.i.i4.i310, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit316"

bb1.i.i4.i310:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i307"
  %309 = getelementptr i8, ptr %_355.val151, i64 8
  %self2.val.i.i5.i311 = load i64, ptr %309, align 8, !noundef !2
  %val6.i.i6.i312 = add i64 %self2.val.i.i5.i311, -1
  store i64 %val6.i.i6.i312, ptr %309, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit316"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit316": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i307", %bb1.i.i4.i310
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_355)
  br label %bb159

bb289:                                            ; preds = %bb282
  %310 = ptrtoint ptr %_846.1 to i64
  br label %bb287

bb287:                                            ; preds = %bb282, %bb289
  %shareholders.sroa.0.0 = phi i64 [ %298, %bb289 ], [ 0, %bb282 ]
  %shareholders.sroa.7.0 = phi i64 [ %_846.0, %bb289 ], [ 2, %bb282 ]
  %shareholders.sroa.10.0 = phi i64 [ %310, %bb289 ], [ 0, %bb282 ]
  %311 = getelementptr inbounds i8, ptr %_355, i64 8
  %_355.val152 = load ptr, ptr %311, align 8, !nonnull !2, !noundef !2
  %312 = getelementptr inbounds i8, ptr %_355, i64 16
  %_355.val153 = load ptr, ptr %312, align 8
  %self1.val.i.i.i317 = load i64, ptr %_355.val152, align 8, !noundef !2
  %val.i.i.i318 = add i64 %self1.val.i.i.i317, -1
  store i64 %val.i.i.i318, ptr %_355.val152, align 8
  %313 = icmp eq i64 %val.i.i.i318, 0
  br i1 %313, label %bb1.i.i.i325, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i319"

bb1.i.i.i325:                                     ; preds = %bb287
  %314 = getelementptr i8, ptr %_355.val152, i64 8
  %self2.val.i.i.i326 = load i64, ptr %314, align 8, !noundef !2
  %val6.i.i.i327 = add i64 %self2.val.i.i.i326, -1
  store i64 %val6.i.i.i327, ptr %314, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i319"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i319": ; preds = %bb1.i.i.i325, %bb287
  %315 = icmp ne ptr %_355.val153, null
  call void @llvm.assume(i1 %315)
  %self1.val.i.i2.i320 = load i64, ptr %_355.val153, align 8, !noundef !2
  %val.i.i3.i321 = add i64 %self1.val.i.i2.i320, -1
  store i64 %val.i.i3.i321, ptr %_355.val153, align 8
  %316 = icmp eq i64 %val.i.i3.i321, 0
  br i1 %316, label %bb1.i.i4.i322, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit328"

bb1.i.i4.i322:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i319"
  %317 = getelementptr i8, ptr %_355.val153, i64 8
  %self2.val.i.i5.i323 = load i64, ptr %317, align 8, !noundef !2
  %val6.i.i6.i324 = add i64 %self2.val.i.i5.i323, -1
  store i64 %val6.i.i6.i324, ptr %317, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit328"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit328": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i319", %bb1.i.i4.i322
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_355)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_360)
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_360, i8 0, i64 32, i1 false)
  %318 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %quote_mint31, ptr noundef nonnull dereferenceable(32) %_360, i64 32)
  %319 = icmp eq i32 %318, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_360)
  call void @llvm.lifetime.start.p0(i64 424, ptr nonnull %ev)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_362)
  %_854 = load ptr, ptr %179, align 8, !nonnull !2, !align !3, !noundef !2
  %_855 = load ptr, ptr %_854, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_362, ptr noundef nonnull align 1 dereferenceable(32) %_855, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_363)
  %_551 = load ptr, ptr %base_mint, align 8, !nonnull !2, !align !3, !noundef !2
  %320 = getelementptr inbounds i8, ptr %_551, i64 88
  %_856 = load ptr, ptr %320, align 8, !nonnull !2, !align !3, !noundef !2
  %_857 = load ptr, ptr %_856, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_363, ptr noundef nonnull align 1 dereferenceable(32) %_857, i64 32, i1 false)
  %_70275135. = select i1 %319, i64 %_70275135, i64 0
  %rq. = select i1 %319, i64 %rq, i64 0
  %vq. = select i1 %319, i64 %vq, i64 0
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_370)
  %_858 = load ptr, ptr %2, align 8, !nonnull !2, !align !3, !noundef !2
  %_859 = load ptr, ptr %_858, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_370, ptr noundef nonnull align 1 dereferenceable(32) %_859, i64 32, i1 false)
  %_552 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %321 = getelementptr inbounds i8, ptr %_552, i64 163
  %322 = load i8, ptr %321, align 1, !range !374, !noundef !2
  %_372.not = icmp eq i8 %322, 0
  %_371.sroa.0.0 = select i1 %_372.not, i64 %_732.sroa.8.0.copyload, i64 0
  %_373.sroa.0.0 = select i1 %_372.not, i64 %_732.sroa.6.0.copyload, i64 0
  %323 = getelementptr inbounds i8, ptr %_552, i64 165
  %324 = load i8, ptr %323, align 1, !range !374, !noundef !2
  %_376.not = icmp eq i8 %324, 0
  %_375.sroa.0.0 = select i1 %_376.not, i64 0, i64 %_732.sroa.8.0.copyload
  %_377.sroa.0.0 = select i1 %_376.not, i64 0, i64 %_732.sroa.6.0.copyload
  %325 = load i64, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !4889, !noundef !2
  %326 = icmp eq i64 %325, 0
  %327 = call i64 @llvm.usub.sat.i64(i64 %325, i64 3)
  %328 = select i1 %326, i64 12884934653, i64 %327
  %_15.i.i.i.i.i10.i.i = icmp ult i64 %328, 12884901896
  br i1 %_15.i.i.i.i.i10.i.i, label %bb3.i329, label %"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17h5877c2531c2f4030E.exit"

bb3.i329:                                         ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit328"
; call alloc::raw_vec::handle_error
  call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef 1, i64 3) #29, !noalias !4895
  unreachable

"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17h5877c2531c2f4030E.exit": ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit328"
  store i64 %328, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !4889
  %329 = inttoptr i64 %328 to ptr
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(3) %329, ptr noundef nonnull align 1 dereferenceable(3) @alloc_4aabaedbd62f6ec96f36599a97af2908, i64 3, i1 false), !noalias !4896
  %_556 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %330 = getelementptr inbounds i8, ptr %_556, i64 162
  %331 = load i8, ptr %330, align 2, !range !374, !noundef !2
  %332 = getelementptr inbounds i8, ptr %_556, i64 163
  %333 = load i8, ptr %332, align 1, !range !374, !noundef !2
  %_383.not = icmp eq i8 %333, 0
  %_382.sroa.0.0 = select i1 %_383.not, i64 0, i64 %_732.sroa.8.0.copyload
  %_384.sroa.0.0 = select i1 %_383.not, i64 0, i64 %_732.sroa.6.0.copyload
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_387)
; call pump_recovered::transfer_fee_recovered::post_fee_amount
  call void @_ZN14pump_recovered22transfer_fee_recovered15post_fee_amount17heb3a7c4edb5d51ecE(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_387, ptr noalias noundef nonnull readonly align 8 dereferenceable(32) %fee, i64 noundef %_309.0) #28
  %334 = load i64, ptr %_387, align 8, !range !318, !noundef !2
  %335 = icmp eq i64 %334, 2
  %336 = getelementptr inbounds i8, ptr %_387, i64 8
  br i1 %335, label %bb294, label %bb185

bb294:                                            ; preds = %"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17h5877c2531c2f4030E.exit"
  %_863 = load i64, ptr %336, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_387)
  %_559 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %337 = getelementptr inbounds i8, ptr %_559, i64 162
  %338 = load i8, ptr %337, align 2, !range !374, !noundef !2
  %_392.not = icmp eq i8 %338, 0
  br i1 %_392.not, label %bb119, label %bb120

bb119:                                            ; preds = %bb294
  %_560 = load ptr, ptr %34, align 8, !nonnull !2, !align !3, !noundef !2
  %339 = getelementptr inbounds i8, ptr %_560, i64 1056
  %340 = load i64, ptr %339, align 8, !noundef !2
  br label %bb120

bb120:                                            ; preds = %bb294, %bb119
  %_391.sroa.0.0 = phi i64 [ %340, %bb119 ], [ 0, %bb294 ]
  %341 = getelementptr inbounds i8, ptr %_559, i64 40
  %342 = getelementptr inbounds i8, ptr %ev, i64 328
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %342, ptr noundef nonnull align 8 dereferenceable(32) %341, i64 32, i1 false)
  %343 = getelementptr inbounds i8, ptr %_559, i64 120
  %_395 = load i64, ptr %343, align 8, !noundef !2
  %344 = getelementptr inbounds i8, ptr %ev, i64 48
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %344, ptr noundef nonnull align 1 dereferenceable(32) %_363, i64 32, i1 false)
  %345 = getelementptr inbounds i8, ptr %ev, i64 80
  store i64 %_70275135., ptr %345, align 8
  %346 = getelementptr inbounds i8, ptr %ev, i64 88
  store i64 %input.sroa.0.0, ptr %346, align 8
  %347 = getelementptr inbounds i8, ptr %ev, i64 416
  store i8 1, ptr %347, align 8
  %348 = getelementptr inbounds i8, ptr %ev, i64 96
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %348, ptr noundef nonnull align 1 dereferenceable(32) %_362, i64 32, i1 false)
  %349 = getelementptr inbounds i8, ptr %ev, i64 128
  store i64 %_838.sroa.8.0.copyload, ptr %349, align 8
  %350 = getelementptr inbounds i8, ptr %ev, i64 136
  store i64 %vq., ptr %350, align 8
  %351 = getelementptr inbounds i8, ptr %ev, i64 144
  store i64 %vb, ptr %351, align 8
  %352 = getelementptr inbounds i8, ptr %ev, i64 152
  store i64 %rq., ptr %352, align 8
  %353 = getelementptr inbounds i8, ptr %ev, i64 160
  store i64 %rb, ptr %353, align 8
  %354 = getelementptr inbounds i8, ptr %ev, i64 168
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %354, ptr noundef nonnull align 1 dereferenceable(32) %_370, i64 32, i1 false)
  %355 = getelementptr inbounds i8, ptr %ev, i64 200
  store i64 %_732.sroa.7.0.copyload, ptr %355, align 8
  %356 = getelementptr inbounds i8, ptr %ev, i64 208
  store i64 %_732.sroa.0.0.copyload, ptr %356, align 8
  %357 = getelementptr inbounds i8, ptr %ev, i64 216
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %357, ptr noundef nonnull align 1 dereferenceable(32) %creator, i64 32, i1 false)
  %358 = getelementptr inbounds i8, ptr %ev, i64 248
  store i64 %_371.sroa.0.0, ptr %358, align 8
  %359 = getelementptr inbounds i8, ptr %ev, i64 256
  store i64 %_373.sroa.0.0, ptr %359, align 8
  %360 = getelementptr inbounds i8, ptr %ev, i64 417
  store i8 0, ptr %360, align 1
  %361 = getelementptr inbounds i8, ptr %ev, i64 264
  store i64 %total_unclaimed_tokens, ptr %361, align 8
  %362 = getelementptr inbounds i8, ptr %ev, i64 272
  store i64 %total_claimed_tokens, ptr %362, align 8
  %363 = getelementptr inbounds i8, ptr %ev, i64 280
  store i64 %current_sol_volume, ptr %363, align 8
  %364 = getelementptr inbounds i8, ptr %ev, i64 288
  store i64 %last_update_timestamp, ptr %364, align 8
  store i64 3, ptr %ev, align 8
  %_379.sroa.6.0.ev.sroa_idx = getelementptr inbounds i8, ptr %ev, i64 8
  store ptr %329, ptr %_379.sroa.6.0.ev.sroa_idx, align 8
  %_379.sroa.7.0.ev.sroa_idx = getelementptr inbounds i8, ptr %ev, i64 16
  store i64 3, ptr %_379.sroa.7.0.ev.sroa_idx, align 8
  %365 = getelementptr inbounds i8, ptr %ev, i64 418
  store i8 %331, ptr %365, align 2
  %366 = getelementptr inbounds i8, ptr %ev, i64 296
  store i64 %_382.sroa.0.0, ptr %366, align 8
  %367 = getelementptr inbounds i8, ptr %ev, i64 304
  store i64 %_384.sroa.0.0, ptr %367, align 8
  %368 = getelementptr inbounds i8, ptr %ev, i64 312
  store i64 %_391.sroa.0.0, ptr %368, align 8
  %369 = getelementptr inbounds i8, ptr %ev, i64 320
  store i64 %_863, ptr %369, align 8
  %370 = getelementptr inbounds i8, ptr %ev, i64 24
  store i64 %shareholders.sroa.0.0, ptr %370, align 8
  %_393.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %ev, i64 32
  store i64 %shareholders.sroa.7.0, ptr %_393.sroa.4.0..sroa_idx, align 8
  %_393.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %ev, i64 40
  store i64 %shareholders.sroa.10.0, ptr %_393.sroa.5.0..sroa_idx, align 8
  %371 = getelementptr inbounds i8, ptr %ev, i64 360
  store i64 %_70275135, ptr %371, align 8
  %372 = getelementptr inbounds i8, ptr %ev, i64 368
  store i64 %vq, ptr %372, align 8
  %373 = getelementptr inbounds i8, ptr %ev, i64 376
  store i64 %rq, ptr %373, align 8
  %374 = getelementptr inbounds i8, ptr %ev, i64 384
  store i64 %_375.sroa.0.0, ptr %374, align 8
  %375 = getelementptr inbounds i8, ptr %ev, i64 392
  store i64 %_377.sroa.0.0, ptr %375, align 8
  %376 = getelementptr inbounds i8, ptr %ev, i64 400
  store i64 %_395, ptr %376, align 8
  %377 = getelementptr inbounds i8, ptr %ev, i64 408
  store i64 %_719, ptr %377, align 8
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_370)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_363)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_362)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_399)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_401)
; call <pump_recovered::TradeEvent as anchor_lang::Event>::data
  call void @"_ZN65_$LT$pump_recovered..TradeEvent$u20$as$u20$anchor_lang..Event$GT$4data17h7a38b5dd8a5f6b5dE"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_401, ptr noalias noundef nonnull readonly align 8 dereferenceable(424) %ev) #28
  %378 = getelementptr inbounds i8, ptr %_401, i64 8
  %_869 = load ptr, ptr %378, align 8, !nonnull !2, !noundef !2
  %379 = getelementptr inbounds i8, ptr %_401, i64 16
  %_868 = load i64, ptr %379, align 8, !noundef !2
  store ptr %_869, ptr %_399, align 8
  %380 = getelementptr inbounds i8, ptr %_399, i64 8
  store i64 %_868, ptr %380, align 8
; call solana_program::log::sol_log_data
  call void @_ZN14solana_program3log12sol_log_data17h1e024b73f122854fE(ptr noalias noundef nonnull readonly align 8 %_399, i64 noundef 1) #28
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_401)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_399)
  %_404 = getelementptr inbounds i8, ptr %a, i64 192
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %authority_info, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_404) #28
  %381 = getelementptr inbounds i8, ptr %ctx, i64 44
  %authority_bump = load i8, ptr %381, align 4, !noundef !2
; call <pump_recovered::TradeEvent as anchor_lang::Event>::data
  call void @"_ZN65_$LT$pump_recovered..TradeEvent$u20$as$u20$anchor_lang..Event$GT$4data17h7a38b5dd8a5f6b5dE"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %inner_data, ptr noalias noundef nonnull readonly align 8 dereferenceable(424) %ev) #28
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %ix_data)
  %me.sroa.0.0.copyload.i = load i64, ptr %inner_data, align 8, !alias.scope !4897, !noalias !4900
  %me.sroa.4.0.self.sroa_idx.i = getelementptr inbounds i8, ptr %inner_data, i64 8
  %me.sroa.4.0.copyload.i = load ptr, ptr %me.sroa.4.0.self.sroa_idx.i, align 8, !alias.scope !4897, !noalias !4900, !nonnull !2, !noundef !2
  %me.sroa.5.0.self.sroa_idx.i = getelementptr inbounds i8, ptr %inner_data, i64 16
  %me.sroa.5.0.copyload.i = load i64, ptr %me.sroa.5.0.self.sroa_idx.i, align 8, !alias.scope !4897, !noalias !4900
  %_18.i = getelementptr inbounds i8, ptr %me.sroa.4.0.copyload.i, i64 %me.sroa.5.0.copyload.i
  %382 = getelementptr inbounds i8, ptr %_410, i64 32
  store ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, ptr %382, align 8
  %383 = getelementptr inbounds i8, ptr %_410, i64 40
  store ptr getelementptr inbounds (<{ [8 x i8] }>, ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, i64 1, i32 0, i64 0), ptr %383, align 8
  store ptr %me.sroa.4.0.copyload.i, ptr %_410, align 8
  %_879.sroa.4.0._410.sroa_idx = getelementptr inbounds i8, ptr %_410, i64 8
  store ptr %me.sroa.4.0.copyload.i, ptr %_879.sroa.4.0._410.sroa_idx, align 8
  %_879.sroa.5.0._410.sroa_idx = getelementptr inbounds i8, ptr %_410, i64 16
  store i64 %me.sroa.0.0.copyload.i, ptr %_879.sroa.5.0._410.sroa_idx, align 8
  %_879.sroa.6.0._410.sroa_idx = getelementptr inbounds i8, ptr %_410, i64 24
  store ptr %_18.i, ptr %_879.sroa.6.0._410.sroa_idx, align 8
; call <alloc::vec::Vec<T> as alloc::vec::spec_from_iter::SpecFromIter<T,I>>::from_iter
  call fastcc void @"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h0206225007577adeE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %ix_data, ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_410) #28
  call void @llvm.lifetime.start.p0(i64 80, ptr nonnull %ix)
  %384 = getelementptr inbounds i8, ptr %ix_data, i64 8
  %_882 = load ptr, ptr %384, align 8, !nonnull !2, !noundef !2
  %385 = getelementptr inbounds i8, ptr %ix_data, i64 16
  %_881 = load i64, ptr %385, align 8, !noundef !2
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_418)
; call alloc::alloc::exchange_malloc
  %_420 = call fastcc noundef ptr @_ZN5alloc5alloc15exchange_malloc17h6cd8dd11b0e3424eE(i64 noundef 34, i64 noundef 1) #28
  %_563 = load ptr, ptr %authority_info, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memmove.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_420, ptr noundef nonnull align 1 dereferenceable(32) %_563, i64 32, i1 false)
  %_422.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_420, i64 32
  store i8 1, ptr %_422.sroa.4.0..sroa_idx, align 1
  %_422.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_420, i64 33
  store i8 0, ptr %_422.sroa.5.0..sroa_idx, align 1
  store i64 1, ptr %_418, align 8, !alias.scope !4902, !noalias !4905
  %386 = getelementptr inbounds i8, ptr %_418, i64 8
  store ptr %_420, ptr %386, align 8, !alias.scope !4902, !noalias !4905
  %387 = getelementptr inbounds i8, ptr %_418, i64 16
  store i64 1, ptr %387, align 8, !alias.scope !4902, !noalias !4905
; call solana_instruction::Instruction::new_with_bytes
  call void @_ZN18solana_instruction11Instruction14new_with_bytes17h836fab8fb6401158E(ptr noalias nocapture noundef nonnull sret([80 x i8]) align 8 dereferenceable(80) %ix, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) @_ZN14pump_recovered2ID17h1dbc648cb2b8dc7eE, ptr noalias noundef nonnull readonly align 1 %_882, i64 noundef %_881, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_418) #28
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_418)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_430)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %_430, ptr noundef nonnull align 8 dereferenceable(48) %authority_info, i64 48, i1 false)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_433)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_436)
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %_440)
  store i8 %authority_bump, ptr %_440, align 1
  store ptr @alloc_7a7952b5e0d15f2b72d0341cef6d4739, ptr %_436, align 8
  %388 = getelementptr inbounds i8, ptr %_436, i64 8
  store i64 17, ptr %388, align 8
  %389 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_436, i64 0, i64 1
  store ptr %_440, ptr %389, align 8
  %390 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_436, i64 0, i64 1, i32 1
  store i64 1, ptr %390, align 8
  store ptr %_436, ptr %_433, align 8
  %391 = getelementptr inbounds i8, ptr %_433, i64 8
  store i64 2, ptr %391, align 8
; call solana_program::program::invoke_signed
  call void @_ZN14solana_program7program13invoke_signed17h01c3b84bc1fc491eE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_426, ptr noalias noundef nonnull readonly align 8 dereferenceable(80) %ix, ptr noalias noundef nonnull readonly align 8 %_430, i64 noundef 1, ptr noalias noundef nonnull readonly align 8 %_433, i64 noundef 1) #28
  %392 = load i64, ptr %_426, align 8, !range !366, !noundef !2
  %393 = icmp eq i64 %392, -9223372036854775782
  br i1 %393, label %bb299, label %bb298

bb299:                                            ; preds = %bb120
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_440)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_436)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_433)
  %394 = getelementptr inbounds i8, ptr %_430, i64 8
  %_430.val181 = load ptr, ptr %394, align 8, !nonnull !2, !noundef !2
  %395 = getelementptr inbounds i8, ptr %_430, i64 16
  %_430.val182 = load ptr, ptr %395, align 8
  %self1.val.i.i.i.i = load i64, ptr %_430.val181, align 8, !noundef !2
  %val.i.i.i.i = add i64 %self1.val.i.i.i.i, -1
  store i64 %val.i.i.i.i, ptr %_430.val181, align 8
  %396 = icmp eq i64 %val.i.i.i.i, 0
  br i1 %396, label %bb1.i.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i"

bb1.i.i.i.i:                                      ; preds = %bb299
  %397 = getelementptr i8, ptr %_430.val181, i64 8
  %self2.val.i.i.i.i = load i64, ptr %397, align 8, !noundef !2
  %val6.i.i.i.i = add i64 %self2.val.i.i.i.i, -1
  store i64 %val6.i.i.i.i, ptr %397, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i": ; preds = %bb1.i.i.i.i, %bb299
  %398 = icmp ne ptr %_430.val182, null
  call void @llvm.assume(i1 %398)
  %self1.val.i.i2.i.i = load i64, ptr %_430.val182, align 8, !noundef !2
  %val.i.i3.i.i = add i64 %self1.val.i.i2.i.i, -1
  store i64 %val.i.i3.i.i, ptr %_430.val182, align 8
  %399 = icmp eq i64 %val.i.i3.i.i, 0
  br i1 %399, label %bb1.i.i4.i.i, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit"

bb1.i.i4.i.i:                                     ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i"
  %400 = getelementptr i8, ptr %_430.val182, i64 8
  %self2.val.i.i5.i.i = load i64, ptr %400, align 8, !noundef !2
  %val6.i.i6.i.i = add i64 %self2.val.i.i5.i.i, -1
  store i64 %val6.i.i6.i.i, ptr %400, align 8
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i", %bb1.i.i4.i.i
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_430)
  %_1.val.i330 = load i64, ptr %ix, align 8, !alias.scope !4907, !noundef !2
  %401 = icmp eq i64 %_1.val.i330, 0
  br i1 %401, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i", label %bb2.i.i.i.i

bb2.i.i.i.i:                                      ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit"
  %402 = getelementptr inbounds i8, ptr %ix, i64 8
  %_1.val2.i = load ptr, ptr %402, align 8, !alias.scope !4907
  %403 = icmp ne ptr %_1.val2.i, null
  call void @llvm.assume(i1 %403)
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i": ; preds = %bb2.i.i.i.i, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit"
  %404 = getelementptr inbounds i8, ptr %ix, i64 24
  %.val.i = load i64, ptr %404, align 8, !alias.scope !4907, !noundef !2
  %405 = icmp eq i64 %.val.i, 0
  br i1 %405, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i331"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i331": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i"
  %406 = getelementptr inbounds i8, ptr %ix, i64 32
  %.val1.i = load ptr, ptr %406, align 8, !alias.scope !4907
  %407 = icmp ne ptr %.val1.i, null
  call void @llvm.assume(i1 %407)
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i331"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data)
  %_564 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %408 = getelementptr inbounds i8, ptr %_564, i64 88
  %_442 = load i64, ptr %408, align 8, !noundef !2
  %409 = icmp eq i64 %_442, 0
  br i1 %409, label %bb132, label %bb145

bb298:                                            ; preds = %bb120
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %410 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17ha4865197be4b9a2fE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_426) #28
  %_887.0 = extractvalue { i64, ptr } %410, 0
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_440)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_436)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_433)
  %411 = getelementptr inbounds i8, ptr %_430, i64 8
  %_430.val = load ptr, ptr %411, align 8, !nonnull !2, !noundef !2
  %412 = getelementptr inbounds i8, ptr %_430, i64 16
  %_430.val177 = load ptr, ptr %412, align 8
  %self1.val.i.i.i.i334 = load i64, ptr %_430.val, align 8, !noundef !2
  %val.i.i.i.i335 = add i64 %self1.val.i.i.i.i334, -1
  store i64 %val.i.i.i.i335, ptr %_430.val, align 8
  %413 = icmp eq i64 %val.i.i.i.i335, 0
  br i1 %413, label %bb1.i.i.i.i342, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i336"

bb1.i.i.i.i342:                                   ; preds = %bb298
  %414 = getelementptr i8, ptr %_430.val, i64 8
  %self2.val.i.i.i.i343 = load i64, ptr %414, align 8, !noundef !2
  %val6.i.i.i.i344 = add i64 %self2.val.i.i.i.i343, -1
  store i64 %val6.i.i.i.i344, ptr %414, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i336"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i336": ; preds = %bb1.i.i.i.i342, %bb298
  %415 = icmp ne ptr %_430.val177, null
  call void @llvm.assume(i1 %415)
  %self1.val.i.i2.i.i337 = load i64, ptr %_430.val177, align 8, !noundef !2
  %val.i.i3.i.i338 = add i64 %self1.val.i.i2.i.i337, -1
  store i64 %val.i.i3.i.i338, ptr %_430.val177, align 8
  %416 = icmp eq i64 %val.i.i3.i.i338, 0
  br i1 %416, label %bb1.i.i4.i.i339, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit345"

bb1.i.i4.i.i339:                                  ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i336"
  %417 = getelementptr i8, ptr %_430.val177, i64 8
  %self2.val.i.i5.i.i340 = load i64, ptr %417, align 8, !noundef !2
  %val6.i.i6.i.i341 = add i64 %self2.val.i.i5.i.i340, -1
  store i64 %val6.i.i6.i.i341, ptr %417, align 8
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit345"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit345": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i336", %bb1.i.i4.i.i339
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_430)
  %_1.val.i346 = load i64, ptr %ix, align 8, !alias.scope !4910, !noundef !2
  %418 = icmp eq i64 %_1.val.i346, 0
  br i1 %418, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i349", label %bb2.i.i.i.i347

bb2.i.i.i.i347:                                   ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit345"
  %419 = getelementptr inbounds i8, ptr %ix, i64 8
  %_1.val2.i348 = load ptr, ptr %419, align 8, !alias.scope !4910
  %420 = icmp ne ptr %_1.val2.i348, null
  call void @llvm.assume(i1 %420)
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i349"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i349": ; preds = %bb2.i.i.i.i347, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit345"
  %421 = getelementptr inbounds i8, ptr %ix, i64 24
  %.val.i350 = load i64, ptr %421, align 8, !alias.scope !4910, !noundef !2
  %422 = icmp eq i64 %.val.i350, 0
  br i1 %422, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit353", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i351"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i351": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i349"
  %423 = getelementptr inbounds i8, ptr %ix, i64 32
  %.val1.i352 = load ptr, ptr %423, align 8, !alias.scope !4910
  %424 = icmp ne ptr %.val1.i352, null
  call void @llvm.assume(i1 %424)
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit353"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit353": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i349", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i351"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data)
  br label %bb154

bb132:                                            ; preds = %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit"
  %425 = getelementptr inbounds i8, ptr %_564, i64 161
  store i8 1, ptr %425, align 1
  call void @llvm.lifetime.start.p0(i64 136, ptr nonnull %event)
  %_566 = load ptr, ptr %base_mint, align 8, !nonnull !2, !align !3, !noundef !2
  %426 = getelementptr inbounds i8, ptr %_566, i64 88
  %_892 = load ptr, ptr %426, align 8, !nonnull !2, !align !3, !noundef !2
  %_893 = load ptr, ptr %_892, align 8, !nonnull !2, !align !372, !noundef !2
  %427 = getelementptr inbounds i8, ptr %event, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %427, ptr noundef nonnull align 1 dereferenceable(32) %_893, i64 32, i1 false)
  %_894 = load ptr, ptr %179, align 8, !nonnull !2, !align !3, !noundef !2
  %_895 = load ptr, ptr %_894, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %event, ptr noundef nonnull align 1 dereferenceable(32) %_895, i64 32, i1 false)
  %_567 = load ptr, ptr %4, align 8, !nonnull !2, !align !3, !noundef !2
  %_896 = load ptr, ptr %_567, align 8, !nonnull !2, !align !3, !noundef !2
  %_897 = load ptr, ptr %_896, align 8, !nonnull !2, !align !372, !noundef !2
  %428 = getelementptr inbounds i8, ptr %event, i64 64
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %428, ptr noundef nonnull align 1 dereferenceable(32) %_897, i64 32, i1 false)
  %429 = getelementptr inbounds i8, ptr %_567, i64 40
  %430 = getelementptr inbounds i8, ptr %event, i64 96
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %430, ptr noundef nonnull align 8 dereferenceable(32) %429, i64 32, i1 false)
  %431 = getelementptr inbounds i8, ptr %event, i64 128
  store i64 %_838.sroa.8.0.copyload, ptr %431, align 8
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_451)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_453)
; call <pump_recovered::trade_types::CompleteEvent as anchor_lang::Event>::data
  call void @"_ZN81_$LT$pump_recovered..trade_types..CompleteEvent$u20$as$u20$anchor_lang..Event$GT$4data17h38908a6b4286bca9E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_453, ptr noalias noundef nonnull readonly align 8 dereferenceable(136) %event) #28
  %432 = getelementptr inbounds i8, ptr %_453, i64 8
  %_900 = load ptr, ptr %432, align 8, !nonnull !2, !noundef !2
  %433 = getelementptr inbounds i8, ptr %_453, i64 16
  %_899 = load i64, ptr %433, align 8, !noundef !2
  store ptr %_900, ptr %_451, align 8
  %434 = getelementptr inbounds i8, ptr %_451, i64 8
  store i64 %_899, ptr %434, align 8
; call solana_program::log::sol_log_data
  call void @_ZN14solana_program3log12sol_log_data17h1e024b73f122854fE(ptr noalias noundef nonnull readonly align 8 %_451, i64 noundef 1) #28
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_453)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_451)
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %authority_info37, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_404) #28
; call <pump_recovered::trade_types::CompleteEvent as anchor_lang::Event>::data
  call void @"_ZN81_$LT$pump_recovered..trade_types..CompleteEvent$u20$as$u20$anchor_lang..Event$GT$4data17h38908a6b4286bca9E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %inner_data38, ptr noalias noundef nonnull readonly align 8 dereferenceable(136) %event) #28
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %ix_data39)
  %me.sroa.0.0.copyload.i358 = load i64, ptr %inner_data38, align 8, !alias.scope !4913, !noalias !4916
  %me.sroa.4.0.self.sroa_idx.i359 = getelementptr inbounds i8, ptr %inner_data38, i64 8
  %me.sroa.4.0.copyload.i360 = load ptr, ptr %me.sroa.4.0.self.sroa_idx.i359, align 8, !alias.scope !4913, !noalias !4916, !nonnull !2, !noundef !2
  %me.sroa.5.0.self.sroa_idx.i361 = getelementptr inbounds i8, ptr %inner_data38, i64 16
  %me.sroa.5.0.copyload.i362 = load i64, ptr %me.sroa.5.0.self.sroa_idx.i361, align 8, !alias.scope !4913, !noalias !4916
  %_18.i363 = getelementptr inbounds i8, ptr %me.sroa.4.0.copyload.i360, i64 %me.sroa.5.0.copyload.i362
  %435 = getelementptr inbounds i8, ptr %_460, i64 32
  store ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, ptr %435, align 8
  %436 = getelementptr inbounds i8, ptr %_460, i64 40
  store ptr getelementptr inbounds (<{ [8 x i8] }>, ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, i64 1, i32 0, i64 0), ptr %436, align 8
  store ptr %me.sroa.4.0.copyload.i360, ptr %_460, align 8
  %_910.sroa.4.0._460.sroa_idx = getelementptr inbounds i8, ptr %_460, i64 8
  store ptr %me.sroa.4.0.copyload.i360, ptr %_910.sroa.4.0._460.sroa_idx, align 8
  %_910.sroa.5.0._460.sroa_idx = getelementptr inbounds i8, ptr %_460, i64 16
  store i64 %me.sroa.0.0.copyload.i358, ptr %_910.sroa.5.0._460.sroa_idx, align 8
  %_910.sroa.6.0._460.sroa_idx = getelementptr inbounds i8, ptr %_460, i64 24
  store ptr %_18.i363, ptr %_910.sroa.6.0._460.sroa_idx, align 8
; call <alloc::vec::Vec<T> as alloc::vec::spec_from_iter::SpecFromIter<T,I>>::from_iter
  call fastcc void @"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h0206225007577adeE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %ix_data39, ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_460) #28
  call void @llvm.lifetime.start.p0(i64 80, ptr nonnull %ix40)
  %437 = getelementptr inbounds i8, ptr %ix_data39, i64 8
  %_913 = load ptr, ptr %437, align 8, !nonnull !2, !noundef !2
  %438 = getelementptr inbounds i8, ptr %ix_data39, i64 16
  %_912 = load i64, ptr %438, align 8, !noundef !2
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_466)
; call alloc::alloc::exchange_malloc
  %_468 = call fastcc noundef ptr @_ZN5alloc5alloc15exchange_malloc17h6cd8dd11b0e3424eE(i64 noundef 34, i64 noundef 1) #28
  %_569 = load ptr, ptr %authority_info37, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memmove.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_468, ptr noundef nonnull align 1 dereferenceable(32) %_569, i64 32, i1 false)
  %_470.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_468, i64 32
  store i8 1, ptr %_470.sroa.4.0..sroa_idx, align 1
  %_470.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_468, i64 33
  store i8 0, ptr %_470.sroa.5.0..sroa_idx, align 1
  store i64 1, ptr %_466, align 8, !alias.scope !4918, !noalias !4921
  %439 = getelementptr inbounds i8, ptr %_466, i64 8
  store ptr %_468, ptr %439, align 8, !alias.scope !4918, !noalias !4921
  %440 = getelementptr inbounds i8, ptr %_466, i64 16
  store i64 1, ptr %440, align 8, !alias.scope !4918, !noalias !4921
; call solana_instruction::Instruction::new_with_bytes
  call void @_ZN18solana_instruction11Instruction14new_with_bytes17h836fab8fb6401158E(ptr noalias nocapture noundef nonnull sret([80 x i8]) align 8 dereferenceable(80) %ix40, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) @_ZN14pump_recovered2ID17h1dbc648cb2b8dc7eE, ptr noalias noundef nonnull readonly align 1 %_913, i64 noundef %_912, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_466) #28
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_466)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_478)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %_478, ptr noundef nonnull align 8 dereferenceable(48) %authority_info37, i64 48, i1 false)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_481)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_484)
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %_488)
  store i8 %authority_bump, ptr %_488, align 1
  store ptr @alloc_7a7952b5e0d15f2b72d0341cef6d4739, ptr %_484, align 8
  %441 = getelementptr inbounds i8, ptr %_484, i64 8
  store i64 17, ptr %441, align 8
  %442 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_484, i64 0, i64 1
  store ptr %_488, ptr %442, align 8
  %443 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_484, i64 0, i64 1, i32 1
  store i64 1, ptr %443, align 8
  store ptr %_484, ptr %_481, align 8
  %444 = getelementptr inbounds i8, ptr %_481, i64 8
  store i64 2, ptr %444, align 8
; call solana_program::program::invoke_signed
  call void @_ZN14solana_program7program13invoke_signed17h01c3b84bc1fc491eE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_474, ptr noalias noundef nonnull readonly align 8 dereferenceable(80) %ix40, ptr noalias noundef nonnull readonly align 8 %_478, i64 noundef 1, ptr noalias noundef nonnull readonly align 8 %_481, i64 noundef 1) #28
  %445 = load i64, ptr %_474, align 8, !range !366, !noundef !2
  %446 = icmp eq i64 %445, -9223372036854775782
  br i1 %446, label %bb305, label %bb304

bb305:                                            ; preds = %bb132
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_488)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_484)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_481)
  %447 = getelementptr inbounds i8, ptr %_478, i64 8
  %_478.val179 = load ptr, ptr %447, align 8, !nonnull !2, !noundef !2
  %448 = getelementptr inbounds i8, ptr %_478, i64 16
  %_478.val180 = load ptr, ptr %448, align 8
  %self1.val.i.i.i.i364 = load i64, ptr %_478.val179, align 8, !noundef !2
  %val.i.i.i.i365 = add i64 %self1.val.i.i.i.i364, -1
  store i64 %val.i.i.i.i365, ptr %_478.val179, align 8
  %449 = icmp eq i64 %val.i.i.i.i365, 0
  br i1 %449, label %bb1.i.i.i.i372, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i366"

bb1.i.i.i.i372:                                   ; preds = %bb305
  %450 = getelementptr i8, ptr %_478.val179, i64 8
  %self2.val.i.i.i.i373 = load i64, ptr %450, align 8, !noundef !2
  %val6.i.i.i.i374 = add i64 %self2.val.i.i.i.i373, -1
  store i64 %val6.i.i.i.i374, ptr %450, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i366"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i366": ; preds = %bb1.i.i.i.i372, %bb305
  %451 = icmp ne ptr %_478.val180, null
  call void @llvm.assume(i1 %451)
  %self1.val.i.i2.i.i367 = load i64, ptr %_478.val180, align 8, !noundef !2
  %val.i.i3.i.i368 = add i64 %self1.val.i.i2.i.i367, -1
  store i64 %val.i.i3.i.i368, ptr %_478.val180, align 8
  %452 = icmp eq i64 %val.i.i3.i.i368, 0
  br i1 %452, label %bb1.i.i4.i.i369, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit375"

bb1.i.i4.i.i369:                                  ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i366"
  %453 = getelementptr i8, ptr %_478.val180, i64 8
  %self2.val.i.i5.i.i370 = load i64, ptr %453, align 8, !noundef !2
  %val6.i.i6.i.i371 = add i64 %self2.val.i.i5.i.i370, -1
  store i64 %val6.i.i6.i.i371, ptr %453, align 8
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit375"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit375": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i366", %bb1.i.i4.i.i369
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_478)
  %_1.val.i376 = load i64, ptr %ix40, align 8, !alias.scope !4923, !noundef !2
  %454 = icmp eq i64 %_1.val.i376, 0
  br i1 %454, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i379", label %bb2.i.i.i.i377

bb2.i.i.i.i377:                                   ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit375"
  %455 = getelementptr inbounds i8, ptr %ix40, i64 8
  %_1.val2.i378 = load ptr, ptr %455, align 8, !alias.scope !4923
  %456 = icmp ne ptr %_1.val2.i378, null
  call void @llvm.assume(i1 %456)
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i379"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i379": ; preds = %bb2.i.i.i.i377, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit375"
  %457 = getelementptr inbounds i8, ptr %ix40, i64 24
  %.val.i380 = load i64, ptr %457, align 8, !alias.scope !4923, !noundef !2
  %458 = icmp eq i64 %.val.i380, 0
  br i1 %458, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit383", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i381"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i381": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i379"
  %459 = getelementptr inbounds i8, ptr %ix40, i64 32
  %.val1.i382 = load ptr, ptr %459, align 8, !alias.scope !4923
  %460 = icmp ne ptr %.val1.i382, null
  call void @llvm.assume(i1 %460)
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit383"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit383": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i379", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i381"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix40)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data39)
  call void @llvm.lifetime.end.p0(i64 136, ptr nonnull %event)
  %_570.pre = load ptr, ptr %4, align 8
  br label %bb145

bb304:                                            ; preds = %bb132
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %461 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17ha4865197be4b9a2fE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_474) #28
  %_918.0 = extractvalue { i64, ptr } %461, 0
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_488)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_484)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_481)
  %462 = getelementptr inbounds i8, ptr %_478, i64 8
  %_478.val = load ptr, ptr %462, align 8, !nonnull !2, !noundef !2
  %463 = getelementptr inbounds i8, ptr %_478, i64 16
  %_478.val178 = load ptr, ptr %463, align 8
  %self1.val.i.i.i.i386 = load i64, ptr %_478.val, align 8, !noundef !2
  %val.i.i.i.i387 = add i64 %self1.val.i.i.i.i386, -1
  store i64 %val.i.i.i.i387, ptr %_478.val, align 8
  %464 = icmp eq i64 %val.i.i.i.i387, 0
  br i1 %464, label %bb1.i.i.i.i394, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i388"

bb1.i.i.i.i394:                                   ; preds = %bb304
  %465 = getelementptr i8, ptr %_478.val, i64 8
  %self2.val.i.i.i.i395 = load i64, ptr %465, align 8, !noundef !2
  %val6.i.i.i.i396 = add i64 %self2.val.i.i.i.i395, -1
  store i64 %val6.i.i.i.i396, ptr %465, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i388"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i388": ; preds = %bb1.i.i.i.i394, %bb304
  %466 = icmp ne ptr %_478.val178, null
  call void @llvm.assume(i1 %466)
  %self1.val.i.i2.i.i389 = load i64, ptr %_478.val178, align 8, !noundef !2
  %val.i.i3.i.i390 = add i64 %self1.val.i.i2.i.i389, -1
  store i64 %val.i.i3.i.i390, ptr %_478.val178, align 8
  %467 = icmp eq i64 %val.i.i3.i.i390, 0
  br i1 %467, label %bb1.i.i4.i.i391, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit397"

bb1.i.i4.i.i391:                                  ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i388"
  %468 = getelementptr i8, ptr %_478.val178, i64 8
  %self2.val.i.i5.i.i392 = load i64, ptr %468, align 8, !noundef !2
  %val6.i.i6.i.i393 = add i64 %self2.val.i.i5.i.i392, -1
  store i64 %val6.i.i6.i.i393, ptr %468, align 8
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit397"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit397": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i388", %bb1.i.i4.i.i391
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_478)
  %_1.val.i398 = load i64, ptr %ix40, align 8, !alias.scope !4926, !noundef !2
  %469 = icmp eq i64 %_1.val.i398, 0
  br i1 %469, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i401", label %bb2.i.i.i.i399

bb2.i.i.i.i399:                                   ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit397"
  %470 = getelementptr inbounds i8, ptr %ix40, i64 8
  %_1.val2.i400 = load ptr, ptr %470, align 8, !alias.scope !4926
  %471 = icmp ne ptr %_1.val2.i400, null
  call void @llvm.assume(i1 %471)
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i401"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i401": ; preds = %bb2.i.i.i.i399, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit397"
  %472 = getelementptr inbounds i8, ptr %ix40, i64 24
  %.val.i402 = load i64, ptr %472, align 8, !alias.scope !4926, !noundef !2
  %473 = icmp eq i64 %.val.i402, 0
  br i1 %473, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit405", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i403"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i403": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i401"
  %474 = getelementptr inbounds i8, ptr %ix40, i64 32
  %.val1.i404 = load ptr, ptr %474, align 8, !alias.scope !4926
  %475 = icmp ne ptr %.val1.i404, null
  call void @llvm.assume(i1 %475)
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit405"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit405": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i401", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i403"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix40)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data39)
  call void @llvm.lifetime.end.p0(i64 136, ptr nonnull %event)
  br label %bb154

bb145:                                            ; preds = %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit", %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit383"
  %_570 = phi ptr [ %_564, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit" ], [ %_570.pre, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit383" ]
; call pump_recovered::trade_types::prepare_bonding_curve
  %476 = call { i64, ptr } @_ZN14pump_recovered11trade_types21prepare_bonding_curve17h024332b28e0bbc3bE(ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %_570, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_297, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %179) #28
  %477 = extractvalue { i64, ptr } %476, 0
  %478 = icmp eq i64 %477, 2
  br i1 %478, label %bb308, label %bb154

bb154:                                            ; preds = %bb145, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit353", %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit405"
  %.pn138 = phi { i64, ptr } [ %461, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit405" ], [ %410, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit353" ], [ %476, %bb145 ]
  %_0.sroa.0.3 = phi i64 [ %_918.0, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit405" ], [ %_887.0, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit353" ], [ %477, %bb145 ]
  %_0.sroa.43.3 = extractvalue { i64, ptr } %.pn138, 1
  %_1.val.i.i = load i64, ptr %ev, align 8, !alias.scope !4929, !noundef !2
  %479 = icmp eq i64 %_1.val.i.i, 0
  br i1 %479, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i": ; preds = %bb154
  %_1.val1.i.i = load ptr, ptr %_379.sroa.6.0.ev.sroa_idx, align 8, !alias.scope !4929
  %480 = icmp ne ptr %_1.val1.i.i, null
  call void @llvm.assume(i1 %480)
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i", %bb154
  %.val.i408 = load i64, ptr %370, align 8, !alias.scope !4934, !noundef !2
  %481 = icmp eq i64 %.val.i408, 0
  br i1 %481, label %bb156.thread, label %bb2.i.i.i.i409

bb2.i.i.i.i409:                                   ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i"
  %.val1.i410 = load ptr, ptr %_393.sroa.4.0..sroa_idx, align 8, !alias.scope !4934
  %482 = icmp ne ptr %.val1.i410, null
  call void @llvm.assume(i1 %482)
  br label %bb156.thread

bb308:                                            ; preds = %bb145
  %_1.val.i.i411 = load i64, ptr %ev, align 8, !alias.scope !4935, !noundef !2
  %483 = icmp eq i64 %_1.val.i.i411, 0
  br i1 %483, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i414", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i412"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i412": ; preds = %bb308
  %_1.val1.i.i413 = load ptr, ptr %_379.sroa.6.0.ev.sroa_idx, align 8, !alias.scope !4935
  %484 = icmp ne ptr %_1.val1.i.i413, null
  call void @llvm.assume(i1 %484)
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i414"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i414": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i412", %bb308
  %.val.i415 = load i64, ptr %370, align 8, !alias.scope !4940, !noundef !2
  %485 = icmp eq i64 %.val.i415, 0
  br i1 %485, label %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h47e2d478d6cd050eE.exit418", label %bb2.i.i.i.i416

bb2.i.i.i.i416:                                   ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i414"
  %.val1.i417 = load ptr, ptr %_393.sroa.4.0..sroa_idx, align 8, !alias.scope !4940
  %486 = icmp ne ptr %.val1.i417, null
  call void @llvm.assume(i1 %486)
  br label %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h47e2d478d6cd050eE.exit418"

"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h47e2d478d6cd050eE.exit418": ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i414", %bb2.i.i.i.i416
  call void @llvm.lifetime.end.p0(i64 424, ptr nonnull %ev)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %quote_mint31)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %fee)
  call void @llvm.lifetime.end.p0(i64 8, ptr nonnull %buyback_fee_recipient)
  call void @llvm.lifetime.end.p0(i64 8, ptr nonnull %fee_recipient)
  br label %bb182

bb182:                                            ; preds = %bb181, %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h47e2d478d6cd050eE.exit418"
  %_0.sroa.43.4 = phi ptr [ %_0.sroa.43.1, %bb181 ], [ undef, %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h47e2d478d6cd050eE.exit418" ]
  %_0.sroa.0.4 = phi i64 [ %_0.sroa.0.1, %bb181 ], [ 2, %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h47e2d478d6cd050eE.exit418" ]
  %487 = insertvalue { i64, ptr } poison, i64 %_0.sroa.0.4, 0
  %488 = insertvalue { i64, ptr } %487, ptr %_0.sroa.43.4, 1
  ret { i64, ptr } %488

bb156.thread:                                     ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i", %bb2.i.i.i.i409
  call void @llvm.lifetime.end.p0(i64 424, ptr nonnull %ev)
  br label %bb159

bb185:                                            ; preds = %"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17h5877c2531c2f4030E.exit"
  %_864.1 = load ptr, ptr %336, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_387)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_370)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_363)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_362)
  call void @llvm.lifetime.end.p0(i64 424, ptr nonnull %ev)
  %489 = icmp eq i64 %shareholders.sroa.0.0, 0
  br i1 %489, label %bb159, label %bb2.i.i.i

bb2.i.i.i:                                        ; preds = %bb185
  %490 = icmp ne i64 %shareholders.sroa.7.0, 0
  call void @llvm.assume(i1 %490)
  br label %bb159

bb159:                                            ; preds = %bb2.i.i.i, %bb185, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit316", %bb156.thread, %bb281
  %_0.sroa.43.7 = phi ptr [ %_842.1, %bb281 ], [ %_846.1, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit316" ], [ %_0.sroa.43.3, %bb156.thread ], [ %_864.1, %bb185 ], [ %_864.1, %bb2.i.i.i ]
  %_0.sroa.0.7 = phi i64 [ %_842.0, %bb281 ], [ %_846.0, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit316" ], [ %_0.sroa.0.3, %bb156.thread ], [ %334, %bb185 ], [ %334, %bb2.i.i.i ]
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %quote_mint31)
  br label %bb173

bb165:                                            ; preds = %bb234, %bb238
  %.pn139 = phi { i64, ptr } [ %185, %bb234 ], [ %186, %bb238 ]
  %_0.sroa.0.9 = extractvalue { i64, ptr } %.pn139, 0
  %_0.sroa.43.9 = extractvalue { i64, ptr } %.pn139, 1
  br label %bb173
}
