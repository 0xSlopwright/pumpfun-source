define hidden { i64, ptr } @_ZN14pump_recovered6buy_v226buy_exact_quote_in_handler17hde5f708821c5b249E(ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %ctx, i64 noundef %input, i64 noundef %limit, i1 noundef zeroext %partial) unnamed_addr #0 {
start:
  %_11.i293 = alloca [0 x i8], align 1
  %formatter.i294 = alloca [64 x i8], align 8
  %buf.i295 = alloca [24 x i8], align 8
  %formatter.i287 = alloca [64 x i8], align 8
  %buf.i288 = alloca [24 x i8], align 8
  %formatter.i = alloca [64 x i8], align 8
  %buf.i = alloca [24 x i8], align 8
  %_1113 = alloca [24 x i8], align 8
  %_675 = alloca [1 x i8], align 1
  %_671 = alloca [32 x i8], align 8
  %_668 = alloca [16 x i8], align 8
  %_665 = alloca [48 x i8], align 8
  %_661 = alloca [24 x i8], align 8
  %_653 = alloca [24 x i8], align 8
  %ix54 = alloca [80 x i8], align 8
  %_647 = alloca [48 x i8], align 8
  %ix_data53 = alloca [24 x i8], align 8
  %inner_data52 = alloca [24 x i8], align 8
  %authority_info51 = alloca [48 x i8], align 8
  %_640 = alloca [24 x i8], align 8
  %_638 = alloca [16 x i8], align 8
  %event = alloca [136 x i8], align 8
  %_627 = alloca [1 x i8], align 1
  %_623 = alloca [32 x i8], align 8
  %_620 = alloca [16 x i8], align 8
  %_617 = alloca [48 x i8], align 8
  %_613 = alloca [24 x i8], align 8
  %_605 = alloca [24 x i8], align 8
  %ix = alloca [80 x i8], align 8
  %_597 = alloca [48 x i8], align 8
  %ix_data = alloca [24 x i8], align 8
  %inner_data = alloca [24 x i8], align 8
  %authority_info = alloca [48 x i8], align 8
  %_588 = alloca [24 x i8], align 8
  %_586 = alloca [16 x i8], align 8
  %_575 = alloca [16 x i8], align 8
  %_556 = alloca [32 x i8], align 1
  %_549 = alloca [32 x i8], align 1
  %_548 = alloca [32 x i8], align 1
  %ev = alloca [424 x i8], align 8
  %_546 = alloca [32 x i8], align 1
  %_542 = alloca [48 x i8], align 8
  %_540 = alloca [24 x i8], align 8
  %_532 = alloca [48 x i8], align 8
  %quote_mint45 = alloca [32 x i8], align 1
  %creator = alloca [32 x i8], align 1
  %_473 = alloca [48 x i8], align 8
  %_451 = alloca [48 x i8], align 8
  %_443 = alloca [32 x i8], align 1
  %quote_mint36 = alloca [32 x i8], align 1
  %_427 = alloca [32 x i8], align 1
  %_423 = alloca [1 x i8], align 1
  %_420 = alloca [32 x i8], align 1
  %_417 = alloca [48 x i8], align 8
  %_414 = alloca [16 x i8], align 8
  %_392 = alloca [160 x i8], align 8
  %_370 = alloca [160 x i8], align 8
  %_361 = alloca [24 x i8], align 8
  %_353 = alloca [24 x i8], align 8
  %_339 = alloca [160 x i8], align 8
  %_321 = alloca [24 x i8], align 8
  %_309 = alloca [160 x i8], align 8
  %_301 = alloca [24 x i8], align 8
  %_297 = alloca [16 x i8], align 8
  %_295 = alloca [32 x i8], align 1
  %_290 = alloca [16 x i8], align 8
  %_283 = alloca [24 x i8], align 8
  %_260 = alloca [24 x i8], align 8
  %_246 = alloca [160 x i8], align 8
  %_225 = alloca [16 x i8], align 8
  %_223 = alloca [32 x i8], align 1
  %_217 = alloca [16 x i8], align 8
  %_206 = alloca [160 x i8], align 8
  %_190 = alloca [32 x i8], align 1
  %_177 = alloca [40 x i8], align 8
  %_170 = alloca [24 x i8], align 8
  %_165 = alloca [32 x i8], align 1
  %_149 = alloca [160 x i8], align 8
  %_142 = alloca [16 x i8], align 8
  %_132 = alloca [160 x i8], align 8
  %_130 = alloca [32 x i8], align 1
  %_126 = alloca [48 x i8], align 8
  %_124 = alloca [32 x i8], align 8
  %_115 = alloca [48 x i8], align 8
  %_103 = alloca [48 x i8], align 8
  %_92 = alloca [48 x i8], align 8
  %_66 = alloca [48 x i8], align 8
  %quote_token_program_info = alloca [48 x i8], align 8
  %quote_mint_info = alloca [48 x i8], align 8
  %quote_token_program = alloca [32 x i8], align 1
  %quote_mint = alloca [32 x i8], align 1
  %transfer_fee = alloca [32 x i8], align 8
  %_55 = alloca [32 x i8], align 1
  %_51 = alloca [32 x i8], align 1
  %_33 = alloca [24 x i8], align 8
  %_32 = alloca [160 x i8], align 8
  %_21 = alloca [24 x i8], align 8
  %_20 = alloca [160 x i8], align 8
  %_10 = alloca [24 x i8], align 8
  %_9 = alloca [160 x i8], align 8
  %buyback_fee_recipient = alloca [8 x i8], align 8
  %fee_recipient = alloca [8 x i8], align 8
  %0 = getelementptr inbounds i8, ptr %ctx, i64 8
  %a = load ptr, ptr %0, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 8, ptr nonnull %fee_recipient)
  %1 = getelementptr inbounds i8, ptr %a, i64 288
  store ptr %1, ptr %fee_recipient, align 8
  call void @llvm.lifetime.start.p0(i64 8, ptr nonnull %buyback_fee_recipient)
  %2 = getelementptr inbounds i8, ptr %a, i64 304
  store ptr %2, ptr %buyback_fee_recipient, align 8
  %3 = getelementptr inbounds i8, ptr %a, i64 320
  %_685 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %4 = getelementptr inbounds i8, ptr %_685, i64 161
  %5 = load i8, ptr %4, align 1, !range !374, !noundef !2
  %_7.not = icmp eq i8 %5, 0
  br i1 %_7.not, label %bb5, label %bb1

bb5:                                              ; preds = %start
  %_17 = icmp eq i64 %limit, 0
  br i1 %_17, label %bb6, label %bb7

bb1:                                              ; preds = %start
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_9)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_10)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17hece37d027ca7935cE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_10, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_cdbdeba67b052fefbde5996b437aa24e) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i293)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i), !noalias !4951
  store i64 0, ptr %buf.i, align 8, !noalias !4951
  %_9.sroa.4.0.buf.sroa_idx.i = getelementptr inbounds i8, ptr %buf.i, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i, align 8, !noalias !4951
  %_9.sroa.5.0.buf.sroa_idx.i = getelementptr inbounds i8, ptr %buf.i, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i, align 8, !noalias !4951
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i), !noalias !4951
  %6 = getelementptr inbounds i8, ptr %formatter.i, i64 52
  store i32 0, ptr %6, align 4, !noalias !4951
  %7 = getelementptr inbounds i8, ptr %formatter.i, i64 48
  store i32 32, ptr %7, align 8, !noalias !4951
  %8 = getelementptr inbounds i8, ptr %formatter.i, i64 56
  store i8 3, ptr %8, align 8, !noalias !4951
  store i64 0, ptr %formatter.i, align 8, !noalias !4951
  %9 = getelementptr inbounds i8, ptr %formatter.i, i64 16
  store i64 0, ptr %9, align 8, !noalias !4951
  %10 = getelementptr inbounds i8, ptr %formatter.i, i64 32
  store ptr %buf.i, ptr %10, align 8, !noalias !4951
  %11 = getelementptr inbounds i8, ptr %formatter.i, i64 40
  store ptr @vtable.4, ptr %11, align 8, !noalias !4951
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %12 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hde015761eb04e9b6E"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_cdbdeba67b052fefbde5996b437aa24e, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i) #28, !noalias !4955
  br i1 %12, label %bb3.i, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit"

bb3.i:                                            ; preds = %bb1
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i293, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !4951
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit": ; preds = %bb1
  %13 = getelementptr inbounds i8, ptr %_9, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %13, ptr noundef nonnull align 8 dereferenceable(24) %buf.i, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i), !noalias !4951
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i), !noalias !4951
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i293)
  %14 = getelementptr inbounds i8, ptr %_9, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %14, ptr noundef nonnull align 8 dereferenceable(24) %_10, i64 24, i1 false)
  %15 = getelementptr inbounds i8, ptr %_9, i64 152
  store i32 6005, ptr %15, align 8
  store i64 0, ptr %_9, align 8
  %_13.sroa.4.0._9.sroa_idx = getelementptr inbounds i8, ptr %_9, i64 8
  store ptr @alloc_408c4ea996ce47019dfee66e8868b559, ptr %_13.sroa.4.0._9.sroa_idx, align 8
  %_13.sroa.4.sroa.4.0._13.sroa.4.0._9.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_9, i64 16
  store i64 27, ptr %_13.sroa.4.sroa.4.0._13.sroa.4.0._9.sroa_idx.sroa_idx, align 8
  %_13.sroa.4.sroa.5.0._13.sroa.4.0._9.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_9, i64 24
  store i32 767, ptr %_13.sroa.4.sroa.5.0._13.sroa.4.0._9.sroa_idx.sroa_idx, align 8
  %16 = getelementptr inbounds i8, ptr %_9, i64 80
  store i8 2, ptr %16, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_10)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %17 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_9) #28
  %_8.0 = extractvalue { i64, ptr } %17, 0
  %_8.1 = extractvalue { i64, ptr } %17, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_9)
  br label %bb261

bb7:                                              ; preds = %bb5
  %_29 = icmp eq i64 %input, 0
  br i1 %_29, label %bb12, label %bb13

bb6:                                              ; preds = %bb5
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_20)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_21)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17hece37d027ca7935cE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_21, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e3e143fb26e9bc2a81054057f78086ba) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i293)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i288), !noalias !4956
  store i64 0, ptr %buf.i288, align 8, !noalias !4956
  %_9.sroa.4.0.buf.sroa_idx.i289 = getelementptr inbounds i8, ptr %buf.i288, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i289, align 8, !noalias !4956
  %_9.sroa.5.0.buf.sroa_idx.i290 = getelementptr inbounds i8, ptr %buf.i288, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i290, align 8, !noalias !4956
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i287), !noalias !4956
  %18 = getelementptr inbounds i8, ptr %formatter.i287, i64 52
  store i32 0, ptr %18, align 4, !noalias !4956
  %19 = getelementptr inbounds i8, ptr %formatter.i287, i64 48
  store i32 32, ptr %19, align 8, !noalias !4956
  %20 = getelementptr inbounds i8, ptr %formatter.i287, i64 56
  store i8 3, ptr %20, align 8, !noalias !4956
  store i64 0, ptr %formatter.i287, align 8, !noalias !4956
  %21 = getelementptr inbounds i8, ptr %formatter.i287, i64 16
  store i64 0, ptr %21, align 8, !noalias !4956
  %22 = getelementptr inbounds i8, ptr %formatter.i287, i64 32
  store ptr %buf.i288, ptr %22, align 8, !noalias !4956
  %23 = getelementptr inbounds i8, ptr %formatter.i287, i64 40
  store ptr @vtable.4, ptr %23, align 8, !noalias !4956
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %24 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hde015761eb04e9b6E"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e3e143fb26e9bc2a81054057f78086ba, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i287) #28, !noalias !4960
  br i1 %24, label %bb3.i291, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit292"

bb3.i291:                                         ; preds = %bb6
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i293, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !4956
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit292": ; preds = %bb6
  %25 = getelementptr inbounds i8, ptr %_20, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %25, ptr noundef nonnull align 8 dereferenceable(24) %buf.i288, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i287), !noalias !4956
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i288), !noalias !4956
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i293)
  %26 = getelementptr inbounds i8, ptr %_20, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %26, ptr noundef nonnull align 8 dereferenceable(24) %_21, i64 24, i1 false)
  %27 = getelementptr inbounds i8, ptr %_20, i64 152
  store i32 6020, ptr %27, align 8
  store i64 0, ptr %_20, align 8
  %_24.sroa.4.0._20.sroa_idx = getelementptr inbounds i8, ptr %_20, i64 8
  store ptr @alloc_408c4ea996ce47019dfee66e8868b559, ptr %_24.sroa.4.0._20.sroa_idx, align 8
  %_24.sroa.4.sroa.4.0._24.sroa.4.0._20.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_20, i64 16
  store i64 27, ptr %_24.sroa.4.sroa.4.0._24.sroa.4.0._20.sroa_idx.sroa_idx, align 8
  %_24.sroa.4.sroa.5.0._24.sroa.4.0._20.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_20, i64 24
  store i32 769, ptr %_24.sroa.4.sroa.5.0._24.sroa.4.0._20.sroa_idx.sroa_idx, align 8
  %28 = getelementptr inbounds i8, ptr %_20, i64 80
  store i8 2, ptr %28, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_21)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %29 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_20) #28
  %_19.0 = extractvalue { i64, ptr } %29, 0
  %_19.1 = extractvalue { i64, ptr } %29, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_20)
; call anchor_lang::error::Error::with_values
  %30 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h3a6a6e896bb0a944E(i64 noundef %_19.0, ptr noundef %_19.1, i32 noundef 0) #28
  %_18.0 = extractvalue { i64, ptr } %30, 0
  %_18.1 = extractvalue { i64, ptr } %30, 1
  br label %bb261

bb13:                                             ; preds = %bb7
  %31 = getelementptr inbounds i8, ptr %a, i64 240
  %_686 = load ptr, ptr %31, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::legacy_sell::fee_recipient::validate_fee_recipient
  %32 = tail call { i64, ptr } @_ZN14pump_recovered11legacy_sell13fee_recipient22validate_fee_recipient17hb90bf0e38986b8b3E(ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %1, ptr noalias noundef nonnull readonly align 8 dereferenceable(1088) %_686, ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %_685) #28
  %33 = extractvalue { i64, ptr } %32, 0
  %34 = icmp eq i64 %33, 2
  br i1 %34, label %bb267, label %bb266

bb12:                                             ; preds = %bb7
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_32)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_33)
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17hece37d027ca7935cE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_33, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_73667b43dd614c93c329aef199c5ef8b) #28
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i293)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i295), !noalias !4961
  store i64 0, ptr %buf.i295, align 8, !noalias !4961
  %_9.sroa.4.0.buf.sroa_idx.i296 = getelementptr inbounds i8, ptr %buf.i295, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i296, align 8, !noalias !4961
  %_9.sroa.5.0.buf.sroa_idx.i297 = getelementptr inbounds i8, ptr %buf.i295, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i297, align 8, !noalias !4961
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i294), !noalias !4961
  %35 = getelementptr inbounds i8, ptr %formatter.i294, i64 52
  store i32 0, ptr %35, align 4, !noalias !4961
  %36 = getelementptr inbounds i8, ptr %formatter.i294, i64 48
  store i32 32, ptr %36, align 8, !noalias !4961
  %37 = getelementptr inbounds i8, ptr %formatter.i294, i64 56
  store i8 3, ptr %37, align 8, !noalias !4961
  store i64 0, ptr %formatter.i294, align 8, !noalias !4961
  %38 = getelementptr inbounds i8, ptr %formatter.i294, i64 16
  store i64 0, ptr %38, align 8, !noalias !4961
  %39 = getelementptr inbounds i8, ptr %formatter.i294, i64 32
  store ptr %buf.i295, ptr %39, align 8, !noalias !4961
  %40 = getelementptr inbounds i8, ptr %formatter.i294, i64 40
  store ptr @vtable.4, ptr %40, align 8, !noalias !4961
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %41 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hde015761eb04e9b6E"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_73667b43dd614c93c329aef199c5ef8b, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i294) #28, !noalias !4965
  br i1 %41, label %bb3.i298, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit299"

bb3.i298:                                         ; preds = %bb12
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i293, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !4961
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit299": ; preds = %bb12
  %42 = getelementptr inbounds i8, ptr %_32, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %42, ptr noundef nonnull align 8 dereferenceable(24) %buf.i295, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i294), !noalias !4961
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i295), !noalias !4961
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i293)
  %43 = getelementptr inbounds i8, ptr %_32, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %43, ptr noundef nonnull align 8 dereferenceable(24) %_33, i64 24, i1 false)
  %44 = getelementptr inbounds i8, ptr %_32, i64 152
  store i32 6041, ptr %44, align 8
  store i64 0, ptr %_32, align 8
  %_36.sroa.4.0._32.sroa_idx = getelementptr inbounds i8, ptr %_32, i64 8
  store ptr @alloc_408c4ea996ce47019dfee66e8868b559, ptr %_36.sroa.4.0._32.sroa_idx, align 8
  %_36.sroa.4.sroa.4.0._36.sroa.4.0._32.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_32, i64 16
  store i64 27, ptr %_36.sroa.4.sroa.4.0._36.sroa.4.0._32.sroa_idx.sroa_idx, align 8
  %_36.sroa.4.sroa.5.0._36.sroa.4.0._32.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_32, i64 24
  store i32 771, ptr %_36.sroa.4.sroa.5.0._36.sroa.4.0._32.sroa_idx.sroa_idx, align 8
  %45 = getelementptr inbounds i8, ptr %_32, i64 80
  store i8 2, ptr %45, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_33)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %46 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_32) #28
  %_31.0 = extractvalue { i64, ptr } %46, 0
  %_31.1 = extractvalue { i64, ptr } %46, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_32)
; call anchor_lang::error::Error::with_values
  %47 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h3a6a6e896bb0a944E(i64 noundef %_31.0, ptr noundef %_31.1, i32 noundef 0) #28
  %_30.0 = extractvalue { i64, ptr } %47, 0
  %_30.1 = extractvalue { i64, ptr } %47, 1
  br label %bb261

bb267:                                            ; preds = %bb13
  %_688 = load ptr, ptr %31, align 8, !nonnull !2, !align !3, !noundef !2
  %_49 = getelementptr inbounds i8, ptr %_688, i64 8
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_51)
  %_849 = load ptr, ptr %2, align 8, !nonnull !2, !align !3, !noundef !2
  %_850 = load ptr, ptr %_849, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_51, ptr noundef nonnull align 1 dereferenceable(32) %_850, i64 32, i1 false)
; call pump_recovered::Global::validate_buyback_fee_recipient
  %48 = call { i64, ptr } @_ZN14pump_recovered6Global30validate_buyback_fee_recipient17hfe66b692425e9689E(ptr noalias noundef nonnull readonly align 8 dereferenceable(1080) %_49, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %_51) #28
  %49 = extractvalue { i64, ptr } %48, 0
  %50 = icmp eq i64 %49, 2
  br i1 %50, label %bb269, label %bb268

bb266:                                            ; preds = %bb13
  %51 = extractvalue { i64, ptr } %32, 1
  br label %bb261

bb269:                                            ; preds = %bb267
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_51)
  %_689 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_55)
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_55, i8 0, i64 32, i1 false)
  %_856 = getelementptr inbounds i8, ptr %_689, i64 40
  %52 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_856, ptr noundef nonnull dereferenceable(32) %_55, i64 32)
  %53 = icmp eq i32 %52, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_55)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %transfer_fee)
  br i1 %53, label %bb36, label %bb21

bb268:                                            ; preds = %bb267
  %54 = extractvalue { i64, ptr } %48, 1
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_51)
  br label %bb261

bb21:                                             ; preds = %bb269
  %55 = getelementptr inbounds i8, ptr %a, i64 256
  %_690 = load ptr, ptr %55, align 8, !nonnull !2, !align !3, !noundef !2
  %56 = getelementptr inbounds i8, ptr %_690, i64 88
  %_858 = load ptr, ptr %56, align 8, !nonnull !2, !align !3, !noundef !2
  %_859 = load ptr, ptr %_858, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %quote_mint, ptr noundef nonnull align 1 dereferenceable(32) %_859, i64 32, i1 false)
  %57 = getelementptr inbounds i8, ptr %a, i64 272
  %_59 = load ptr, ptr %57, align 8, !nonnull !2, !align !3, !noundef !2
  %_860 = load ptr, ptr %_59, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %quote_token_program, ptr noundef nonnull align 1 dereferenceable(32) %_860, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %quote_mint_info)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !4966)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !4969)
  %58 = getelementptr inbounds i8, ptr %_858, i64 8
  %_12.i = load ptr, ptr %58, align 8, !alias.scope !4969, !noalias !4966, !nonnull !2, !noundef !2
  %self.val.i.i = load i64, ptr %_12.i, align 8, !noalias !4971, !noundef !2
  %cond.i.i = icmp ne i64 %self.val.i.i, 0
  tail call void @llvm.assume(i1 %cond.i.i)
  %strong1.i.i = add i64 %self.val.i.i, 1
  store i64 %strong1.i.i, ptr %_12.i, align 8, !noalias !4971
  %_7.i.i = icmp eq i64 %strong1.i.i, 0
  br i1 %_7.i.i, label %bb4.i.i, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hc3c095df9218b8b6E.exit.i

bb4.i.i:                                          ; preds = %bb21
  tail call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hc3c095df9218b8b6E.exit.i: ; preds = %bb21
  %59 = getelementptr inbounds i8, ptr %_858, i64 16
  %_16.i = load ptr, ptr %59, align 8, !alias.scope !4969, !noalias !4966, !nonnull !2, !noundef !2
  %self.val.i1.i = load i64, ptr %_16.i, align 8, !noalias !4971, !noundef !2
  %cond.i2.i = icmp ne i64 %self.val.i1.i, 0
  tail call void @llvm.assume(i1 %cond.i2.i)
  %strong1.i3.i = add i64 %self.val.i1.i, 1
  store i64 %strong1.i3.i, ptr %_16.i, align 8, !noalias !4971
  %_7.i4.i = icmp eq i64 %strong1.i3.i, 0
  br i1 %_7.i4.i, label %bb4.i5.i, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E.exit"

bb4.i5.i:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hc3c095df9218b8b6E.exit.i
  tail call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E.exit": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hc3c095df9218b8b6E.exit.i
  %60 = getelementptr inbounds i8, ptr %_858, i64 24
  %_5.i = load ptr, ptr %60, align 8, !alias.scope !4969, !noalias !4966, !nonnull !2, !align !372, !noundef !2
  %61 = getelementptr inbounds i8, ptr %_858, i64 32
  %_6.i = load i64, ptr %61, align 8, !alias.scope !4969, !noalias !4966, !noundef !2
  %62 = getelementptr inbounds i8, ptr %_858, i64 40
  %63 = load i8, ptr %62, align 8, !range !374, !alias.scope !4969, !noalias !4966, !noundef !2
  %64 = getelementptr inbounds i8, ptr %_858, i64 41
  %65 = load i8, ptr %64, align 1, !range !374, !alias.scope !4969, !noalias !4966, !noundef !2
  %66 = getelementptr inbounds i8, ptr %_858, i64 42
  %67 = load i8, ptr %66, align 2, !range !374, !alias.scope !4969, !noalias !4966, !noundef !2
  store ptr %_859, ptr %quote_mint_info, align 8, !alias.scope !4966, !noalias !4969
  %68 = getelementptr inbounds i8, ptr %quote_mint_info, i64 8
  store ptr %_12.i, ptr %68, align 8, !alias.scope !4966, !noalias !4969
  %69 = getelementptr inbounds i8, ptr %quote_mint_info, i64 16
  store ptr %_16.i, ptr %69, align 8, !alias.scope !4966, !noalias !4969
  %70 = getelementptr inbounds i8, ptr %quote_mint_info, i64 24
  store ptr %_5.i, ptr %70, align 8, !alias.scope !4966, !noalias !4969
  %71 = getelementptr inbounds i8, ptr %quote_mint_info, i64 32
  store i64 %_6.i, ptr %71, align 8, !alias.scope !4966, !noalias !4969
  %72 = getelementptr inbounds i8, ptr %quote_mint_info, i64 40
  store i8 %63, ptr %72, align 8, !alias.scope !4966, !noalias !4969
  %73 = getelementptr inbounds i8, ptr %quote_mint_info, i64 41
  store i8 %65, ptr %73, align 1, !alias.scope !4966, !noalias !4969
  %74 = getelementptr inbounds i8, ptr %quote_mint_info, i64 42
  store i8 %67, ptr %74, align 2, !alias.scope !4966, !noalias !4969
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %quote_token_program_info)
  %_862 = load ptr, ptr %57, align 8, !nonnull !2, !align !3, !noundef !2
  tail call void @llvm.experimental.noalias.scope.decl(metadata !4972)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !4975)
  %_2.i300 = load ptr, ptr %_862, align 8, !alias.scope !4975, !noalias !4972, !nonnull !2, !align !372, !noundef !2
  %75 = getelementptr inbounds i8, ptr %_862, i64 8
  %_12.i301 = load ptr, ptr %75, align 8, !alias.scope !4975, !noalias !4972, !nonnull !2, !noundef !2
  %self.val.i.i302 = load i64, ptr %_12.i301, align 8, !noalias !4977, !noundef !2
  %cond.i.i303 = icmp ne i64 %self.val.i.i302, 0
  tail call void @llvm.assume(i1 %cond.i.i303)
  %strong1.i.i304 = add i64 %self.val.i.i302, 1
  store i64 %strong1.i.i304, ptr %_12.i301, align 8, !noalias !4977
  %_7.i.i305 = icmp eq i64 %strong1.i.i304, 0
  br i1 %_7.i.i305, label %bb4.i.i315, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hc3c095df9218b8b6E.exit.i306

bb4.i.i315:                                       ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E.exit"
  tail call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hc3c095df9218b8b6E.exit.i306: ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E.exit"
  %76 = getelementptr inbounds i8, ptr %_862, i64 16
  %_16.i307 = load ptr, ptr %76, align 8, !alias.scope !4975, !noalias !4972, !nonnull !2, !noundef !2
  %self.val.i1.i308 = load i64, ptr %_16.i307, align 8, !noalias !4977, !noundef !2
  %cond.i2.i309 = icmp ne i64 %self.val.i1.i308, 0
  tail call void @llvm.assume(i1 %cond.i2.i309)
  %strong1.i3.i310 = add i64 %self.val.i1.i308, 1
  store i64 %strong1.i3.i310, ptr %_16.i307, align 8, !noalias !4977
  %_7.i4.i311 = icmp eq i64 %strong1.i3.i310, 0
  br i1 %_7.i4.i311, label %bb4.i5.i314, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E.exit316"

bb4.i5.i314:                                      ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hc3c095df9218b8b6E.exit.i306
  tail call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E.exit316": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hc3c095df9218b8b6E.exit.i306
  %77 = getelementptr inbounds i8, ptr %_862, i64 24
  %_5.i312 = load ptr, ptr %77, align 8, !alias.scope !4975, !noalias !4972, !nonnull !2, !align !372, !noundef !2
  %78 = getelementptr inbounds i8, ptr %_862, i64 32
  %_6.i313 = load i64, ptr %78, align 8, !alias.scope !4975, !noalias !4972, !noundef !2
  %79 = getelementptr inbounds i8, ptr %_862, i64 40
  %80 = load i8, ptr %79, align 8, !range !374, !alias.scope !4975, !noalias !4972, !noundef !2
  %81 = getelementptr inbounds i8, ptr %_862, i64 41
  %82 = load i8, ptr %81, align 1, !range !374, !alias.scope !4975, !noalias !4972, !noundef !2
  %83 = getelementptr inbounds i8, ptr %_862, i64 42
  %84 = load i8, ptr %83, align 2, !range !374, !alias.scope !4975, !noalias !4972, !noundef !2
  store ptr %_2.i300, ptr %quote_token_program_info, align 8, !alias.scope !4972, !noalias !4975
  %85 = getelementptr inbounds i8, ptr %quote_token_program_info, i64 8
  store ptr %_12.i301, ptr %85, align 8, !alias.scope !4972, !noalias !4975
  %86 = getelementptr inbounds i8, ptr %quote_token_program_info, i64 16
  store ptr %_16.i307, ptr %86, align 8, !alias.scope !4972, !noalias !4975
  %87 = getelementptr inbounds i8, ptr %quote_token_program_info, i64 24
  store ptr %_5.i312, ptr %87, align 8, !alias.scope !4972, !noalias !4975
  %88 = getelementptr inbounds i8, ptr %quote_token_program_info, i64 32
  store i64 %_6.i313, ptr %88, align 8, !alias.scope !4972, !noalias !4975
  %89 = getelementptr inbounds i8, ptr %quote_token_program_info, i64 40
  store i8 %80, ptr %89, align 8, !alias.scope !4972, !noalias !4975
  %90 = getelementptr inbounds i8, ptr %quote_token_program_info, i64 41
  store i8 %82, ptr %90, align 1, !alias.scope !4972, !noalias !4975
  %91 = getelementptr inbounds i8, ptr %quote_token_program_info, i64 42
  store i8 %84, ptr %91, align 2, !alias.scope !4972, !noalias !4975
  %92 = getelementptr inbounds i8, ptr %a, i64 336
  %_64 = load ptr, ptr %92, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_66)
  %_692 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %_863 = load ptr, ptr %_692, align 8, !nonnull !2, !align !3, !noundef !2
  tail call void @llvm.experimental.noalias.scope.decl(metadata !4978)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !4981)
  %_2.i317 = load ptr, ptr %_863, align 8, !alias.scope !4981, !noalias !4978, !nonnull !2, !align !372, !noundef !2
  %93 = getelementptr inbounds i8, ptr %_863, i64 8
  %_12.i318 = load ptr, ptr %93, align 8, !alias.scope !4981, !noalias !4978, !nonnull !2, !noundef !2
  %self.val.i.i319 = load i64, ptr %_12.i318, align 8, !noalias !4983, !noundef !2
  %cond.i.i320 = icmp ne i64 %self.val.i.i319, 0
  tail call void @llvm.assume(i1 %cond.i.i320)
  %strong1.i.i321 = add i64 %self.val.i.i319, 1
  store i64 %strong1.i.i321, ptr %_12.i318, align 8, !noalias !4983
  %_7.i.i322 = icmp eq i64 %strong1.i.i321, 0
  br i1 %_7.i.i322, label %bb4.i.i332, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hc3c095df9218b8b6E.exit.i323

bb4.i.i332:                                       ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E.exit316"
  tail call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hc3c095df9218b8b6E.exit.i323: ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E.exit316"
  %94 = getelementptr inbounds i8, ptr %_863, i64 16
  %_16.i324 = load ptr, ptr %94, align 8, !alias.scope !4981, !noalias !4978, !nonnull !2, !noundef !2
  %self.val.i1.i325 = load i64, ptr %_16.i324, align 8, !noalias !4983, !noundef !2
  %cond.i2.i326 = icmp ne i64 %self.val.i1.i325, 0
  tail call void @llvm.assume(i1 %cond.i2.i326)
  %strong1.i3.i327 = add i64 %self.val.i1.i325, 1
  store i64 %strong1.i3.i327, ptr %_16.i324, align 8, !noalias !4983
  %_7.i4.i328 = icmp eq i64 %strong1.i3.i327, 0
  br i1 %_7.i4.i328, label %bb4.i5.i331, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E.exit333"

bb4.i5.i331:                                      ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hc3c095df9218b8b6E.exit.i323
  tail call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E.exit333": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hc3c095df9218b8b6E.exit.i323
  %95 = getelementptr inbounds i8, ptr %_863, i64 24
  %_5.i329 = load ptr, ptr %95, align 8, !alias.scope !4981, !noalias !4978, !nonnull !2, !align !372, !noundef !2
  %96 = getelementptr inbounds i8, ptr %_863, i64 32
  %_6.i330 = load i64, ptr %96, align 8, !alias.scope !4981, !noalias !4978, !noundef !2
  %97 = getelementptr inbounds i8, ptr %_863, i64 40
  %98 = load i8, ptr %97, align 8, !range !374, !alias.scope !4981, !noalias !4978, !noundef !2
  %99 = getelementptr inbounds i8, ptr %_863, i64 41
  %100 = load i8, ptr %99, align 1, !range !374, !alias.scope !4981, !noalias !4978, !noundef !2
  %101 = getelementptr inbounds i8, ptr %_863, i64 42
  %102 = load i8, ptr %101, align 2, !range !374, !alias.scope !4981, !noalias !4978, !noundef !2
  store ptr %_2.i317, ptr %_66, align 8, !alias.scope !4978, !noalias !4981
  %103 = getelementptr inbounds i8, ptr %_66, i64 8
  store ptr %_12.i318, ptr %103, align 8, !alias.scope !4978, !noalias !4981
  %104 = getelementptr inbounds i8, ptr %_66, i64 16
  store ptr %_16.i324, ptr %104, align 8, !alias.scope !4978, !noalias !4981
  %105 = getelementptr inbounds i8, ptr %_66, i64 24
  store ptr %_5.i329, ptr %105, align 8, !alias.scope !4978, !noalias !4981
  %106 = getelementptr inbounds i8, ptr %_66, i64 32
  store i64 %_6.i330, ptr %106, align 8, !alias.scope !4978, !noalias !4981
  %107 = getelementptr inbounds i8, ptr %_66, i64 40
  store i8 %98, ptr %107, align 8, !alias.scope !4978, !noalias !4981
  %108 = getelementptr inbounds i8, ptr %_66, i64 41
  store i8 %100, ptr %108, align 1, !alias.scope !4978, !noalias !4981
  %109 = getelementptr inbounds i8, ptr %_66, i64 42
  store i8 %102, ptr %109, align 2, !alias.scope !4978, !noalias !4981
  %110 = getelementptr inbounds i8, ptr %a, i64 344
  %_70 = load ptr, ptr %110, align 8, !nonnull !2, !align !3, !noundef !2
  %111 = getelementptr inbounds i8, ptr %a, i64 416
  %_71 = load ptr, ptr %111, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::buy_v2::admit_associated_token_account
  %112 = call { i64, ptr } @_ZN14pump_recovered6buy_v230admit_associated_token_account17he6675bb59fcf31d6E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_64, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_66, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_mint, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_token_program, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %quote_mint_info, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %quote_token_program_info, i1 noundef zeroext false, ptr noundef nonnull %_70, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_71) #28
  %113 = extractvalue { i64, ptr } %112, 0
  %114 = icmp eq i64 %113, 2
  %self1.val.i.i.i = load i64, ptr %_12.i318, align 8, !noundef !2
  %val.i.i.i = add i64 %self1.val.i.i.i, -1
  store i64 %val.i.i.i, ptr %_12.i318, align 8
  %115 = icmp eq i64 %val.i.i.i, 0
  br i1 %115, label %bb1.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i"

bb1.i.i.i:                                        ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E.exit333"
  %116 = getelementptr i8, ptr %_12.i318, i64 8
  %self2.val.i.i.i = load i64, ptr %116, align 8, !noundef !2
  %val6.i.i.i = add i64 %self2.val.i.i.i, -1
  store i64 %val6.i.i.i, ptr %116, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i": ; preds = %bb1.i.i.i, %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E.exit333"
  %self1.val.i.i2.i = load i64, ptr %_16.i324, align 8, !noundef !2
  %val.i.i3.i = add i64 %self1.val.i.i2.i, -1
  store i64 %val.i.i3.i, ptr %_16.i324, align 8
  %117 = icmp eq i64 %val.i.i3.i, 0
  br i1 %117, label %bb1.i.i4.i, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit"

bb1.i.i4.i:                                       ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i"
  %118 = getelementptr i8, ptr %_16.i324, i64 8
  %self2.val.i.i5.i = load i64, ptr %118, align 8, !noundef !2
  %val6.i.i6.i = add i64 %self2.val.i.i5.i, -1
  store i64 %val6.i.i6.i, ptr %118, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i", %bb1.i.i4.i
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_66)
  br i1 %114, label %bb276, label %bb257

bb36:                                             ; preds = %bb269
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_130)
  %119 = getelementptr inbounds i8, ptr %a, i64 256
  %_695 = load ptr, ptr %119, align 8, !nonnull !2, !align !3, !noundef !2
  %120 = getelementptr inbounds i8, ptr %_695, i64 88
  %_897 = load ptr, ptr %120, align 8, !nonnull !2, !align !3, !noundef !2
  %_898 = load ptr, ptr %_897, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_130, ptr noundef nonnull align 1 dereferenceable(32) %_898, i64 32, i1 false)
  %121 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_130, ptr noundef nonnull dereferenceable(32) @alloc_e953c1d75e6a4349f2dca6892c168ab2, i64 32)
  %122 = icmp eq i32 %121, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_130)
  br i1 %122, label %bb37, label %bb38

bb276:                                            ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit"
  %123 = getelementptr inbounds i8, ptr %a, i64 360
  %_75 = load ptr, ptr %123, align 8, !nonnull !2, !align !3, !noundef !2
  %_76 = load ptr, ptr %110, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::buy_v2::check_token_account
  %124 = call { i64, ptr } @_ZN14pump_recovered6buy_v219check_token_account17h29aac793862ee67aE(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_75, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_76, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_mint, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_token_program) #28
  %125 = extractvalue { i64, ptr } %124, 0
  %126 = icmp eq i64 %125, 2
  br i1 %126, label %bb278, label %bb257

bb278:                                            ; preds = %bb276
  %127 = getelementptr inbounds i8, ptr %a, i64 368
  %_80 = load ptr, ptr %127, align 8, !nonnull !2, !align !3, !noundef !2
  %_81 = getelementptr inbounds i8, ptr %a, i64 144
  %_85 = load ptr, ptr %110, align 8, !nonnull !2, !align !3, !noundef !2
  %_86 = load ptr, ptr %111, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::buy_v2::admit_associated_token_account
  %128 = call { i64, ptr } @_ZN14pump_recovered6buy_v230admit_associated_token_account17he6675bb59fcf31d6E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_80, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_81, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_mint, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_token_program, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %quote_mint_info, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %quote_token_program_info, i1 noundef zeroext true, ptr noundef nonnull %_85, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_86) #28
  %129 = extractvalue { i64, ptr } %128, 0
  %130 = icmp eq i64 %129, 2
  br i1 %130, label %bb280, label %bb257

bb280:                                            ; preds = %bb278
  %131 = getelementptr inbounds i8, ptr %a, i64 400
  %_90 = load ptr, ptr %131, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_92)
  %132 = getelementptr inbounds i8, ptr %a, i64 392
  %_693 = load ptr, ptr %132, align 8, !nonnull !2, !align !3, !noundef !2
  %_876 = load ptr, ptr %_693, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_92, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_876) #28
  %_96 = load ptr, ptr %110, align 8, !nonnull !2, !align !3, !noundef !2
  %_97 = load ptr, ptr %111, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::buy_v2::admit_associated_token_account
  %133 = call { i64, ptr } @_ZN14pump_recovered6buy_v230admit_associated_token_account17he6675bb59fcf31d6E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_90, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_92, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_mint, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_token_program, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %quote_mint_info, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %quote_token_program_info, i1 noundef zeroext true, ptr noundef nonnull %_96, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_97) #28
  %134 = extractvalue { i64, ptr } %133, 0
  %135 = icmp eq i64 %134, 2
  %136 = getelementptr inbounds i8, ptr %_92, i64 8
  %_92.val = load ptr, ptr %136, align 8, !nonnull !2, !noundef !2
  %137 = getelementptr inbounds i8, ptr %_92, i64 16
  %_92.val266 = load ptr, ptr %137, align 8
  %self1.val.i.i.i334 = load i64, ptr %_92.val, align 8, !noundef !2
  %val.i.i.i335 = add i64 %self1.val.i.i.i334, -1
  store i64 %val.i.i.i335, ptr %_92.val, align 8
  %138 = icmp eq i64 %val.i.i.i335, 0
  br i1 %138, label %bb1.i.i.i342, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i336"

bb1.i.i.i342:                                     ; preds = %bb280
  %139 = getelementptr i8, ptr %_92.val, i64 8
  %self2.val.i.i.i343 = load i64, ptr %139, align 8, !noundef !2
  %val6.i.i.i344 = add i64 %self2.val.i.i.i343, -1
  store i64 %val6.i.i.i344, ptr %139, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i336"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i336": ; preds = %bb1.i.i.i342, %bb280
  %140 = icmp ne ptr %_92.val266, null
  tail call void @llvm.assume(i1 %140)
  %self1.val.i.i2.i337 = load i64, ptr %_92.val266, align 8, !noundef !2
  %val.i.i3.i338 = add i64 %self1.val.i.i2.i337, -1
  store i64 %val.i.i3.i338, ptr %_92.val266, align 8
  %141 = icmp eq i64 %val.i.i3.i338, 0
  br i1 %141, label %bb1.i.i4.i339, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit345"

bb1.i.i4.i339:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i336"
  %142 = getelementptr i8, ptr %_92.val266, i64 8
  %self2.val.i.i5.i340 = load i64, ptr %142, align 8, !noundef !2
  %val6.i.i6.i341 = add i64 %self2.val.i.i5.i340, -1
  store i64 %val6.i.i6.i341, ptr %142, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit345"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit345": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i336", %bb1.i.i4.i339
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_92)
  br i1 %135, label %bb283, label %bb257

bb283:                                            ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit345"
  %143 = getelementptr inbounds i8, ptr %a, i64 296
  %_101 = load ptr, ptr %143, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_103)
  %_881 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_103, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_881) #28
  %_108 = load ptr, ptr %110, align 8, !nonnull !2, !align !3, !noundef !2
  %_109 = load ptr, ptr %111, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::buy_v2::admit_associated_token_account
  %144 = call { i64, ptr } @_ZN14pump_recovered6buy_v230admit_associated_token_account17he6675bb59fcf31d6E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_101, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_103, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_mint, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_token_program, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %quote_mint_info, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %quote_token_program_info, i1 noundef zeroext true, ptr noundef nonnull %_108, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_109) #28
  %145 = extractvalue { i64, ptr } %144, 0
  %146 = icmp eq i64 %145, 2
  %147 = getelementptr inbounds i8, ptr %_103, i64 8
  %_103.val = load ptr, ptr %147, align 8, !nonnull !2, !noundef !2
  %148 = getelementptr inbounds i8, ptr %_103, i64 16
  %_103.val265 = load ptr, ptr %148, align 8
  %self1.val.i.i.i346 = load i64, ptr %_103.val, align 8, !noundef !2
  %val.i.i.i347 = add i64 %self1.val.i.i.i346, -1
  store i64 %val.i.i.i347, ptr %_103.val, align 8
  %149 = icmp eq i64 %val.i.i.i347, 0
  br i1 %149, label %bb1.i.i.i354, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i348"

bb1.i.i.i354:                                     ; preds = %bb283
  %150 = getelementptr i8, ptr %_103.val, i64 8
  %self2.val.i.i.i355 = load i64, ptr %150, align 8, !noundef !2
  %val6.i.i.i356 = add i64 %self2.val.i.i.i355, -1
  store i64 %val6.i.i.i356, ptr %150, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i348"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i348": ; preds = %bb1.i.i.i354, %bb283
  %151 = icmp ne ptr %_103.val265, null
  tail call void @llvm.assume(i1 %151)
  %self1.val.i.i2.i349 = load i64, ptr %_103.val265, align 8, !noundef !2
  %val.i.i3.i350 = add i64 %self1.val.i.i2.i349, -1
  store i64 %val.i.i3.i350, ptr %_103.val265, align 8
  %152 = icmp eq i64 %val.i.i3.i350, 0
  br i1 %152, label %bb1.i.i4.i351, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit357"

bb1.i.i4.i351:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i348"
  %153 = getelementptr i8, ptr %_103.val265, i64 8
  %self2.val.i.i5.i352 = load i64, ptr %153, align 8, !noundef !2
  %val6.i.i6.i353 = add i64 %self2.val.i.i5.i352, -1
  store i64 %val6.i.i6.i353, ptr %153, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit357"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit357": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i348", %bb1.i.i4.i351
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_103)
  br i1 %146, label %bb286, label %bb257

bb286:                                            ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit357"
  %154 = getelementptr inbounds i8, ptr %a, i64 312
  %_113 = load ptr, ptr %154, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_115)
  %_886 = load ptr, ptr %2, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_115, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_886) #28
  %_120 = load ptr, ptr %110, align 8, !nonnull !2, !align !3, !noundef !2
  %_121 = load ptr, ptr %111, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::buy_v2::admit_associated_token_account
  %155 = call { i64, ptr } @_ZN14pump_recovered6buy_v230admit_associated_token_account17he6675bb59fcf31d6E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_113, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_115, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_mint, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %quote_token_program, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %quote_mint_info, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %quote_token_program_info, i1 noundef zeroext true, ptr noundef nonnull %_120, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_121) #28
  %156 = extractvalue { i64, ptr } %155, 0
  %157 = icmp eq i64 %156, 2
  %158 = getelementptr inbounds i8, ptr %_115, i64 8
  %_115.val = load ptr, ptr %158, align 8, !nonnull !2, !noundef !2
  %159 = getelementptr inbounds i8, ptr %_115, i64 16
  %_115.val264 = load ptr, ptr %159, align 8
  %self1.val.i.i.i358 = load i64, ptr %_115.val, align 8, !noundef !2
  %val.i.i.i359 = add i64 %self1.val.i.i.i358, -1
  store i64 %val.i.i.i359, ptr %_115.val, align 8
  %160 = icmp eq i64 %val.i.i.i359, 0
  br i1 %160, label %bb1.i.i.i366, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i360"

bb1.i.i.i366:                                     ; preds = %bb286
  %161 = getelementptr i8, ptr %_115.val, i64 8
  %self2.val.i.i.i367 = load i64, ptr %161, align 8, !noundef !2
  %val6.i.i.i368 = add i64 %self2.val.i.i.i367, -1
  store i64 %val6.i.i.i368, ptr %161, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i360"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i360": ; preds = %bb1.i.i.i366, %bb286
  %162 = icmp ne ptr %_115.val264, null
  tail call void @llvm.assume(i1 %162)
  %self1.val.i.i2.i361 = load i64, ptr %_115.val264, align 8, !noundef !2
  %val.i.i3.i362 = add i64 %self1.val.i.i2.i361, -1
  store i64 %val.i.i3.i362, ptr %_115.val264, align 8
  %163 = icmp eq i64 %val.i.i3.i362, 0
  br i1 %163, label %bb1.i.i4.i363, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit369"

bb1.i.i4.i363:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i360"
  %164 = getelementptr i8, ptr %_115.val264, i64 8
  %self2.val.i.i5.i364 = load i64, ptr %164, align 8, !noundef !2
  %val6.i.i6.i365 = add i64 %self2.val.i.i5.i364, -1
  store i64 %val6.i.i6.i365, ptr %164, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit369"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit369": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i360", %bb1.i.i4.i363
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_115)
  br i1 %157, label %bb289, label %bb257

bb289:                                            ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit369"
  %self1.val.i.i.i370 = load i64, ptr %_12.i301, align 8, !noundef !2
  %val.i.i.i371 = add i64 %self1.val.i.i.i370, -1
  store i64 %val.i.i.i371, ptr %_12.i301, align 8
  %165 = icmp eq i64 %val.i.i.i371, 0
  br i1 %165, label %bb1.i.i.i378, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i372"

bb1.i.i.i378:                                     ; preds = %bb289
  %166 = getelementptr i8, ptr %_12.i301, i64 8
  %self2.val.i.i.i379 = load i64, ptr %166, align 8, !noundef !2
  %val6.i.i.i380 = add i64 %self2.val.i.i.i379, -1
  store i64 %val6.i.i.i380, ptr %166, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i372"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i372": ; preds = %bb1.i.i.i378, %bb289
  %self1.val.i.i2.i373 = load i64, ptr %_16.i307, align 8, !noundef !2
  %val.i.i3.i374 = add i64 %self1.val.i.i2.i373, -1
  store i64 %val.i.i3.i374, ptr %_16.i307, align 8
  %167 = icmp eq i64 %val.i.i3.i374, 0
  br i1 %167, label %bb1.i.i4.i375, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit381"

bb1.i.i4.i375:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i372"
  %168 = getelementptr i8, ptr %_16.i307, i64 8
  %self2.val.i.i5.i376 = load i64, ptr %168, align 8, !noundef !2
  %val6.i.i6.i377 = add i64 %self2.val.i.i5.i376, -1
  store i64 %val6.i.i6.i377, ptr %168, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit381"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit381": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i372", %bb1.i.i4.i375
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %quote_token_program_info)
  %self1.val.i.i.i382 = load i64, ptr %_12.i, align 8, !noundef !2
  %val.i.i.i383 = add i64 %self1.val.i.i.i382, -1
  store i64 %val.i.i.i383, ptr %_12.i, align 8
  %169 = icmp eq i64 %val.i.i.i383, 0
  br i1 %169, label %bb1.i.i.i390, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i384"

bb1.i.i.i390:                                     ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit381"
  %170 = getelementptr i8, ptr %_12.i, i64 8
  %self2.val.i.i.i391 = load i64, ptr %170, align 8, !noundef !2
  %val6.i.i.i392 = add i64 %self2.val.i.i.i391, -1
  store i64 %val6.i.i.i392, ptr %170, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i384"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i384": ; preds = %bb1.i.i.i390, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit381"
  %self1.val.i.i2.i385 = load i64, ptr %_16.i, align 8, !noundef !2
  %val.i.i3.i386 = add i64 %self1.val.i.i2.i385, -1
  store i64 %val.i.i3.i386, ptr %_16.i, align 8
  %171 = icmp eq i64 %val.i.i3.i386, 0
  br i1 %171, label %bb1.i.i4.i387, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit393"

bb1.i.i4.i387:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i384"
  %172 = getelementptr i8, ptr %_16.i, i64 8
  %self2.val.i.i5.i388 = load i64, ptr %172, align 8, !noundef !2
  %val6.i.i6.i389 = add i64 %self2.val.i.i5.i388, -1
  store i64 %val6.i.i6.i389, ptr %172, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit393"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit393": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i384", %bb1.i.i4.i387
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %quote_mint_info)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_124)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_126)
  %_694 = load ptr, ptr %55, align 8, !nonnull !2, !align !3, !noundef !2
  %173 = getelementptr inbounds i8, ptr %_694, i64 88
  %_891 = load ptr, ptr %173, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_126, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_891) #28
; call pump_recovered::transfer_fee_recovered::get_transfer_fee
  call void @_ZN14pump_recovered22transfer_fee_recovered16get_transfer_fee17h171b8dc5e676e915E(ptr noalias nocapture noundef nonnull sret([32 x i8]) align 8 dereferenceable(32) %_124, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_126) #28
  %174 = load i64, ptr %_124, align 8, !range !318, !noundef !2
  %175 = icmp eq i64 %174, 2
  %176 = getelementptr inbounds i8, ptr %_124, i64 8
  %_894.0 = load i64, ptr %176, align 8
  %177 = getelementptr inbounds i8, ptr %_124, i64 16
  %_894.1 = load ptr, ptr %177, align 8
  br i1 %175, label %bb291, label %bb292

bb292:                                            ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit393"
  %_893.sroa.7.0._124.sroa_idx = getelementptr inbounds i8, ptr %_124, i64 24
  %_893.sroa.7.0.copyload = load i64, ptr %_893.sroa.7.0._124.sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_124)
  store i64 %174, ptr %transfer_fee, align 8
  %val.sroa.2.0.transfer_fee.sroa_idx = getelementptr inbounds i8, ptr %transfer_fee, i64 8
  store i64 %_894.0, ptr %val.sroa.2.0.transfer_fee.sroa_idx, align 8
  %val.sroa.3.0.transfer_fee.sroa_idx = getelementptr inbounds i8, ptr %transfer_fee, i64 16
  store ptr %_894.1, ptr %val.sroa.3.0.transfer_fee.sroa_idx, align 8
  %val.sroa.4.0.transfer_fee.sroa_idx = getelementptr inbounds i8, ptr %transfer_fee, i64 24
  store i64 %_893.sroa.7.0.copyload, ptr %val.sroa.4.0.transfer_fee.sroa_idx, align 8
  %178 = getelementptr inbounds i8, ptr %_126, i64 8
  %_126.val258 = load ptr, ptr %178, align 8, !nonnull !2, !noundef !2
  %179 = getelementptr inbounds i8, ptr %_126, i64 16
  %_126.val259 = load ptr, ptr %179, align 8
  %self1.val.i.i.i394 = load i64, ptr %_126.val258, align 8, !noundef !2
  %val.i.i.i395 = add i64 %self1.val.i.i.i394, -1
  store i64 %val.i.i.i395, ptr %_126.val258, align 8
  %180 = icmp eq i64 %val.i.i.i395, 0
  br i1 %180, label %bb1.i.i.i402, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i396"

bb1.i.i.i402:                                     ; preds = %bb292
  %181 = getelementptr i8, ptr %_126.val258, i64 8
  %self2.val.i.i.i403 = load i64, ptr %181, align 8, !noundef !2
  %val6.i.i.i404 = add i64 %self2.val.i.i.i403, -1
  store i64 %val6.i.i.i404, ptr %181, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i396"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i396": ; preds = %bb1.i.i.i402, %bb292
  %182 = icmp ne ptr %_126.val259, null
  call void @llvm.assume(i1 %182)
  %self1.val.i.i2.i397 = load i64, ptr %_126.val259, align 8, !noundef !2
  %val.i.i3.i398 = add i64 %self1.val.i.i2.i397, -1
  store i64 %val.i.i3.i398, ptr %_126.val259, align 8
  %183 = icmp eq i64 %val.i.i3.i398, 0
  br i1 %183, label %bb1.i.i4.i399, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit405"

bb1.i.i4.i399:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i396"
  %184 = getelementptr i8, ptr %_126.val259, i64 8
  %self2.val.i.i5.i400 = load i64, ptr %184, align 8, !noundef !2
  %val6.i.i6.i401 = add i64 %self2.val.i.i5.i400, -1
  store i64 %val6.i.i6.i401, ptr %184, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit405"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit405": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i396", %bb1.i.i4.i399
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_126)
  br label %bb42

bb291:                                            ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit393"
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_124)
  %185 = getelementptr inbounds i8, ptr %_126, i64 8
  %_126.val = load ptr, ptr %185, align 8, !nonnull !2, !noundef !2
  %186 = getelementptr inbounds i8, ptr %_126, i64 16
  %_126.val257 = load ptr, ptr %186, align 8
  %self1.val.i.i.i406 = load i64, ptr %_126.val, align 8, !noundef !2
  %val.i.i.i407 = add i64 %self1.val.i.i.i406, -1
  store i64 %val.i.i.i407, ptr %_126.val, align 8
  %187 = icmp eq i64 %val.i.i.i407, 0
  br i1 %187, label %bb1.i.i.i414, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i408"

bb1.i.i.i414:                                     ; preds = %bb291
  %188 = getelementptr i8, ptr %_126.val, i64 8
  %self2.val.i.i.i415 = load i64, ptr %188, align 8, !noundef !2
  %val6.i.i.i416 = add i64 %self2.val.i.i.i415, -1
  store i64 %val6.i.i.i416, ptr %188, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i408"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i408": ; preds = %bb1.i.i.i414, %bb291
  %189 = icmp ne ptr %_126.val257, null
  call void @llvm.assume(i1 %189)
  %self1.val.i.i2.i409 = load i64, ptr %_126.val257, align 8, !noundef !2
  %val.i.i3.i410 = add i64 %self1.val.i.i2.i409, -1
  store i64 %val.i.i3.i410, ptr %_126.val257, align 8
  %190 = icmp eq i64 %val.i.i3.i410, 0
  br i1 %190, label %bb1.i.i4.i411, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit417"

bb1.i.i4.i411:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i408"
  %191 = getelementptr i8, ptr %_126.val257, i64 8
  %self2.val.i.i5.i412 = load i64, ptr %191, align 8, !noundef !2
  %val6.i.i6.i413 = add i64 %self2.val.i.i5.i412, -1
  store i64 %val6.i.i6.i413, ptr %191, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit417"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit417": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i408", %bb1.i.i4.i411
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_126)
  br label %bb260

bb42:                                             ; preds = %bb37, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit405"
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_142)
; call pump_recovered::transfer_fee_recovered::post_fee_amount
  call void @_ZN14pump_recovered22transfer_fee_recovered15post_fee_amount17heb3a7c4edb5d51ecE(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_142, ptr noalias noundef nonnull readonly align 8 dereferenceable(32) %transfer_fee, i64 noundef %input) #28
  %192 = load i64, ptr %_142, align 8, !range !318, !noundef !2
  %193 = icmp eq i64 %192, 2
  %194 = getelementptr inbounds i8, ptr %_142, i64 8
  br i1 %193, label %bb296, label %bb295

bb260:                                            ; preds = %bb119, %bb364, %bb366, %bb389, %bb391, %bb393, %bb229, %bb361, %bb380, %bb384, %bb387, %bb370, %bb373, %bb375, %bb354, %bb352, %bb112, %bb103, %bb357, %bb349, %bb336, %bb345, %bb342, %bb93, %bb340, %bb331, %bb333, %bb301, %bb299, %bb304, %bb309, %bb75, %bb323, %bb326, %bb328, %bb317, %bb313, %bb63, %bb44, %bb295, %bb38, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit441", %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit417"
  %_0.sroa.61.0 = phi ptr [ %_147.1, %bb44 ], [ %_903.1, %bb295 ], [ %_131.1, %bb38 ], [ %_894.1, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit417" ], [ %_0.sroa.61.1, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit441" ], [ %_925.1, %bb304 ], [ %_940.1, %bb309 ], [ %_204.1, %bb63 ], [ %_943.1, %bb313 ], [ %_951.1, %bb317 ], [ %_244.1, %bb75 ], [ %_961.1, %bb323 ], [ %_964.1, %bb326 ], [ %_970.1, %bb328 ], [ %_912.1, %bb299 ], [ %_918.1, %bb301 ], [ %_390.1, %bb119 ], [ %_0.sroa.61.15, %bb229 ], [ %403, %bb393 ], [ %389, %bb391 ], [ %381, %bb389 ], [ %370, %bb380 ], [ %361, %bb387 ], [ %353, %bb384 ], [ %345, %bb375 ], [ %344, %bb373 ], [ %337, %bb370 ], [ %327, %bb366 ], [ %324, %bb364 ], [ %_1040.1, %bb361 ], [ %_1008.1, %bb345 ], [ %_990.1, %bb336 ], [ %_337.1, %bb103 ], [ %_1034.1, %bb357 ], [ %_368.1, %bb112 ], [ %_1018.1, %bb349 ], [ %_1021.1, %bb352 ], [ %_1027.1, %bb354 ], [ %_1003.1, %bb342 ], [ %_307.1, %bb93 ], [ %_998.1, %bb340 ], [ %_977.1, %bb331 ], [ %_983.1, %bb333 ]
  %_0.sroa.0.0 = phi i64 [ %_147.0, %bb44 ], [ %192, %bb295 ], [ %_131.0, %bb38 ], [ %_894.0, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit417" ], [ %_0.sroa.0.1, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit441" ], [ %_925.0, %bb304 ], [ %_940.0, %bb309 ], [ %_204.0, %bb63 ], [ %230, %bb313 ], [ %241, %bb317 ], [ %_244.0, %bb75 ], [ %_961.0, %bb323 ], [ %_963123224, %bb326 ], [ %_970.0, %bb328 ], [ %_911108226, %bb299 ], [ %_918.0, %bb301 ], [ %_390.0, %bb119 ], [ %_0.sroa.0.15, %bb229 ], [ %395, %bb393 ], [ %387, %bb391 ], [ %376, %bb389 ], [ %367, %bb380 ], [ %359, %bb387 ], [ %349, %bb384 ], [ %342, %bb375 ], [ %335, %bb373 ], [ %329, %bb370 ], [ %322, %bb366 ], [ %300, %bb364 ], [ %_1040.0, %bb361 ], [ %_1007.0, %bb345 ], [ %279, %bb336 ], [ %_337.0, %bb103 ], [ %_1033.0, %bb357 ], [ %_368.0, %bb112 ], [ %_1018.0, %bb349 ], [ %_1020145232, %bb352 ], [ %_1027.0, %bb354 ], [ %_1002.0, %bb342 ], [ %_307.0, %bb93 ], [ %285, %bb340 ], [ %_976129228, %bb331 ], [ %_983.0, %bb333 ]
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %transfer_fee)
  br label %bb261

bb257:                                            ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit369", %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit357", %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit345", %bb278, %bb276, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit"
  %.pn = phi { i64, ptr } [ %112, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit" ], [ %124, %bb276 ], [ %128, %bb278 ], [ %133, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit345" ], [ %144, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit357" ], [ %155, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit369" ]
  %_0.sroa.0.1 = phi i64 [ %113, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit" ], [ %125, %bb276 ], [ %129, %bb278 ], [ %134, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit345" ], [ %145, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit357" ], [ %156, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit369" ]
  %_0.sroa.61.1 = extractvalue { i64, ptr } %.pn, 1
  %self1.val.i.i.i418 = load i64, ptr %_12.i301, align 8, !noundef !2
  %val.i.i.i419 = add i64 %self1.val.i.i.i418, -1
  store i64 %val.i.i.i419, ptr %_12.i301, align 8
  %195 = icmp eq i64 %val.i.i.i419, 0
  br i1 %195, label %bb1.i.i.i426, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i420"

bb1.i.i.i426:                                     ; preds = %bb257
  %196 = getelementptr i8, ptr %_12.i301, i64 8
  %self2.val.i.i.i427 = load i64, ptr %196, align 8, !noundef !2
  %val6.i.i.i428 = add i64 %self2.val.i.i.i427, -1
  store i64 %val6.i.i.i428, ptr %196, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i420"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i420": ; preds = %bb1.i.i.i426, %bb257
  %self1.val.i.i2.i421 = load i64, ptr %_16.i307, align 8, !noundef !2
  %val.i.i3.i422 = add i64 %self1.val.i.i2.i421, -1
  store i64 %val.i.i3.i422, ptr %_16.i307, align 8
  %197 = icmp eq i64 %val.i.i3.i422, 0
  br i1 %197, label %bb1.i.i4.i423, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit429"

bb1.i.i4.i423:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i420"
  %198 = getelementptr i8, ptr %_16.i307, i64 8
  %self2.val.i.i5.i424 = load i64, ptr %198, align 8, !noundef !2
  %val6.i.i6.i425 = add i64 %self2.val.i.i5.i424, -1
  store i64 %val6.i.i6.i425, ptr %198, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit429"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit429": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i420", %bb1.i.i4.i423
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %quote_token_program_info)
  %self1.val.i.i.i430 = load i64, ptr %_12.i, align 8, !noundef !2
  %val.i.i.i431 = add i64 %self1.val.i.i.i430, -1
  store i64 %val.i.i.i431, ptr %_12.i, align 8
  %199 = icmp eq i64 %val.i.i.i431, 0
  br i1 %199, label %bb1.i.i.i438, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i432"

bb1.i.i.i438:                                     ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit429"
  %200 = getelementptr i8, ptr %_12.i, i64 8
  %self2.val.i.i.i439 = load i64, ptr %200, align 8, !noundef !2
  %val6.i.i.i440 = add i64 %self2.val.i.i.i439, -1
  store i64 %val6.i.i.i440, ptr %200, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i432"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i432": ; preds = %bb1.i.i.i438, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit429"
  %self1.val.i.i2.i433 = load i64, ptr %_16.i, align 8, !noundef !2
  %val.i.i3.i434 = add i64 %self1.val.i.i2.i433, -1
  store i64 %val.i.i3.i434, ptr %_16.i, align 8
  %201 = icmp eq i64 %val.i.i3.i434, 0
  br i1 %201, label %bb1.i.i4.i435, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit441"

bb1.i.i4.i435:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i432"
  %202 = getelementptr i8, ptr %_16.i, i64 8
  %self2.val.i.i5.i436 = load i64, ptr %202, align 8, !noundef !2
  %val6.i.i6.i437 = add i64 %self2.val.i.i5.i436, -1
  store i64 %val6.i.i6.i437, ptr %202, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit441"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit441": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i432", %bb1.i.i4.i435
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %quote_mint_info)
  br label %bb260

bb38:                                             ; preds = %bb36
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_132)
  %203 = getelementptr inbounds i8, ptr %_132, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17hece37d027ca7935cE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %203, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_472c5e093ab64810a72f5ef4158854b7) #28
  %204 = getelementptr inbounds i8, ptr %_132, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %204, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_472c5e093ab64810a72f5ef4158854b7) #28
  %205 = getelementptr inbounds i8, ptr %_132, i64 152
  store i32 6063, ptr %205, align 8
  store i64 0, ptr %_132, align 8
  %_136.sroa.4.0._132.sroa_idx = getelementptr inbounds i8, ptr %_132, i64 8
  store ptr @alloc_408c4ea996ce47019dfee66e8868b559, ptr %_136.sroa.4.0._132.sroa_idx, align 8
  %_136.sroa.4.sroa.4.0._136.sroa.4.0._132.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_132, i64 16
  store i64 27, ptr %_136.sroa.4.sroa.4.0._136.sroa.4.0._132.sroa_idx.sroa_idx, align 8
  %_136.sroa.4.sroa.5.0._136.sroa.4.0._132.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_132, i64 24
  store i32 780, ptr %_136.sroa.4.sroa.5.0._136.sroa.4.0._132.sroa_idx.sroa_idx, align 8
  %206 = getelementptr inbounds i8, ptr %_132, i64 80
  store i8 2, ptr %206, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %207 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_132) #28
  %_131.0 = extractvalue { i64, ptr } %207, 0
  %_131.1 = extractvalue { i64, ptr } %207, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_132)
  br label %bb260

bb37:                                             ; preds = %bb36
  store i64 0, ptr %transfer_fee, align 8
  br label %bb42

bb296:                                            ; preds = %bb42
  %_902 = load i64, ptr %194, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_142)
  %_146 = icmp eq i64 %_902, 0
  br i1 %_146, label %bb44, label %bb49

bb295:                                            ; preds = %bb42
  %_903.1 = load ptr, ptr %194, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_142)
  br label %bb260

bb49:                                             ; preds = %bb296
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_165)
  %208 = getelementptr inbounds i8, ptr %a, i64 344
  %_906 = load ptr, ptr %208, align 8, !nonnull !2, !align !3, !noundef !2
  %_907 = load ptr, ptr %_906, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_165, ptr noundef nonnull align 1 dereferenceable(32) %_907, i64 32, i1 false)
  %_696 = load ptr, ptr %31, align 8, !nonnull !2, !align !3, !noundef !2
  %_909 = getelementptr inbounds i8, ptr %_696, i64 648
  %209 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_165, ptr noundef nonnull dereferenceable(32) %_909, i64 32)
  %210 = icmp eq i32 %209, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_165)
  br i1 %210, label %bb50, label %bb52

bb44:                                             ; preds = %bb296
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_149)
  %211 = getelementptr inbounds i8, ptr %_149, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17hece37d027ca7935cE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %211, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_73667b43dd614c93c329aef199c5ef8b) #28
  %212 = getelementptr inbounds i8, ptr %_149, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %212, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_73667b43dd614c93c329aef199c5ef8b) #28
  %213 = getelementptr inbounds i8, ptr %_149, i64 152
  store i32 6041, ptr %213, align 8
  store i64 0, ptr %_149, align 8
  %_153.sroa.4.0._149.sroa_idx = getelementptr inbounds i8, ptr %_149, i64 8
  store ptr @alloc_408c4ea996ce47019dfee66e8868b559, ptr %_153.sroa.4.0._149.sroa_idx, align 8
  %_153.sroa.4.sroa.4.0._153.sroa.4.0._149.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_149, i64 16
  store i64 27, ptr %_153.sroa.4.sroa.4.0._153.sroa.4.0._149.sroa_idx.sroa_idx, align 8
  %_153.sroa.4.sroa.5.0._153.sroa.4.0._149.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_149, i64 24
  store i32 873, ptr %_153.sroa.4.sroa.5.0._153.sroa.4.0._149.sroa_idx.sroa_idx, align 8
  %214 = getelementptr inbounds i8, ptr %_149, i64 80
  store i8 2, ptr %214, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %215 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_149) #28
  %_148.0 = extractvalue { i64, ptr } %215, 0
  %_148.1 = extractvalue { i64, ptr } %215, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_149)
; call anchor_lang::error::Error::with_values
  %216 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h3a6a6e896bb0a944E(i64 noundef %_148.0, ptr noundef %_148.1, i32 noundef 0) #28
  %_147.0 = extractvalue { i64, ptr } %216, 0
  %_147.1 = extractvalue { i64, ptr } %216, 1
  br label %bb260

bb52:                                             ; preds = %bb49
  call void @llvm.lifetime.start.p0(i64 40, ptr nonnull %_177)
  %_699 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %217 = getelementptr inbounds i8, ptr %a, i64 248
  %_700 = load ptr, ptr %217, align 8, !nonnull !2, !align !3, !noundef !2
  %_182 = getelementptr inbounds i8, ptr %a, i64 408
  %218 = getelementptr inbounds i8, ptr %a, i64 424
  %_183 = load ptr, ptr %218, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::legacy_sell::fee_cpi::trade_fees
  call void @_ZN14pump_recovered11legacy_sell7fee_cpi10trade_fees17h6438dad22c79caddE(ptr noalias nocapture noundef nonnull sret([40 x i8]) align 8 dereferenceable(40) %_177, ptr noalias noundef nonnull readonly align 8 dereferenceable(1088) %_696, ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %_699, ptr noalias noundef nonnull readonly align 8 dereferenceable(128) %_700, ptr noalias noundef nonnull readonly align 8 dereferenceable(144) %a, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_182, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_183, i64 noundef %_902) #28
  %_923 = load i64, ptr %_177, align 8, !range !389, !noundef !2
  %trunc.not = icmp eq i64 %_923, 0
  br i1 %trunc.not, label %bb305, label %bb304

bb50:                                             ; preds = %bb49
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_170)
  %_697 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %_171 = getelementptr inbounds i8, ptr %_697, i64 8
; call pump_recovered::constant_product::tokens_for_quote
  call void @_ZN14pump_recovered16constant_product16tokens_for_quote17h38635175d905086fE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_170, ptr noalias noundef nonnull readonly align 8 dereferenceable(160) %_171, i64 noundef %_902) #28
  %_910 = load i64, ptr %_170, align 8, !range !389, !noundef !2
  %trunc225.not = icmp eq i64 %_910, 0
  %219 = getelementptr inbounds i8, ptr %_170, i64 8
  %_911108226 = load i64, ptr %219, align 8
  %.sroa_idx = getelementptr inbounds i8, ptr %_170, i64 16
  br i1 %trunc225.not, label %bb300, label %bb299

bb305:                                            ; preds = %bb52
  %_924.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_177, i64 24
  %_924.sroa.6.0.copyload = load i64, ptr %_924.sroa.6.0..sroa_idx, align 8
  %_924.sroa.7.0..sroa_idx = getelementptr inbounds i8, ptr %_177, i64 32
  %_924.sroa.7.0.copyload = load i64, ptr %_924.sroa.7.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 40, ptr nonnull %_177)
  %_701 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_190)
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_190, i8 0, i64 32, i1 false)
  %_929 = getelementptr inbounds i8, ptr %_701, i64 8
  %220 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_929, ptr noundef nonnull dereferenceable(32) %_190, i64 32)
  %221 = icmp eq i32 %220, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_190)
  %._924.sroa.7.0.copyload = select i1 %221, i64 0, i64 %_924.sroa.7.0.copyload
  %222 = call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %_924.sroa.6.0.copyload, i64 %._924.sroa.7.0.copyload)
  %_934.0 = extractvalue { i64, i1 } %222, 0
  %_934.1 = extractvalue { i64, i1 } %222, 1
  br i1 %_934.1, label %bb309, label %bb310

bb304:                                            ; preds = %bb52
  %223 = getelementptr inbounds i8, ptr %_177, i64 8
  %_925.0 = load i64, ptr %223, align 8, !range !389, !noundef !2
  %224 = getelementptr inbounds i8, ptr %_177, i64 16
  %_925.1 = load ptr, ptr %224, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 40, ptr nonnull %_177)
  br label %bb260

bb310:                                            ; preds = %bb305
  %225 = icmp eq i64 %_934.0, 0
  br i1 %225, label %bb68, label %bb62

bb309:                                            ; preds = %bb305
; call pump_recovered::<impl core::convert::From<pump_recovered::PumpError> for anchor_lang::error::Error>::from
  %226 = call { i64, ptr } @"_ZN14pump_recovered108_$LT$impl$u20$core..convert..From$LT$pump_recovered..PumpError$GT$$u20$for$u20$anchor_lang..error..Error$GT$4from17h3a3c89f679f0b13dE"(i32 noundef 24) #28
  %_940.0 = extractvalue { i64, ptr } %226, 0
  %_940.1 = extractvalue { i64, ptr } %226, 1
  br label %bb260

bb62:                                             ; preds = %bb310
  %_196 = zext i64 %_902 to i128
  %227 = mul nuw nsw i128 %_196, 10000
  %_199 = zext i64 %_934.0 to i128
  %228 = add nuw nsw i128 %_199, 10000
  %_194 = udiv i128 %227, %228
  %229 = trunc i128 %_194 to i64
  %_202 = icmp eq i64 %229, 0
  br i1 %_202, label %bb63, label %bb68

bb68:                                             ; preds = %bb310, %bb62
  %raw_quote.sroa.0.0562 = phi i64 [ %229, %bb62 ], [ %_902, %bb310 ]
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_217)
; call pump_recovered::legacy_sell::fee_math::fee
  call void @_ZN14pump_recovered11legacy_sell8fee_math3fee17h1c5ec20835bdfb98E(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_217, i64 noundef %raw_quote.sroa.0.0562, i64 noundef %_924.sroa.6.0.copyload) #28
  %230 = load i64, ptr %_217, align 8, !range !318, !noundef !2
  %231 = icmp eq i64 %230, 2
  %232 = getelementptr inbounds i8, ptr %_217, i64 8
  br i1 %231, label %bb314, label %bb313

bb63:                                             ; preds = %bb62
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_206)
  %233 = getelementptr inbounds i8, ptr %_206, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17hece37d027ca7935cE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %233, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_73667b43dd614c93c329aef199c5ef8b) #28
  %234 = getelementptr inbounds i8, ptr %_206, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %234, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_73667b43dd614c93c329aef199c5ef8b) #28
  %235 = getelementptr inbounds i8, ptr %_206, i64 152
  store i32 6041, ptr %235, align 8
  store i64 0, ptr %_206, align 8
  %_210.sroa.4.0._206.sroa_idx = getelementptr inbounds i8, ptr %_206, i64 8
  store ptr @alloc_408c4ea996ce47019dfee66e8868b559, ptr %_210.sroa.4.0._206.sroa_idx, align 8
  %_210.sroa.4.sroa.4.0._210.sroa.4.0._206.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_206, i64 16
  store i64 27, ptr %_210.sroa.4.sroa.4.0._210.sroa.4.0._206.sroa_idx.sroa_idx, align 8
  %_210.sroa.4.sroa.5.0._210.sroa.4.0._206.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_206, i64 24
  store i32 907, ptr %_210.sroa.4.sroa.5.0._210.sroa.4.0._206.sroa_idx.sroa_idx, align 8
  %236 = getelementptr inbounds i8, ptr %_206, i64 80
  store i8 2, ptr %236, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %237 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_206) #28
  %_205.0 = extractvalue { i64, ptr } %237, 0
  %_205.1 = extractvalue { i64, ptr } %237, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_206)
; call anchor_lang::error::Error::with_values
  %238 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h3a6a6e896bb0a944E(i64 noundef %_205.0, ptr noundef %_205.1, i32 noundef 0) #28
  %_204.0 = extractvalue { i64, ptr } %238, 0
  %_204.1 = extractvalue { i64, ptr } %238, 1
  br label %bb260

bb314:                                            ; preds = %bb68
  %_942 = load i64, ptr %232, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_217)
  %_702 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_223)
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_223, i8 0, i64 32, i1 false)
  %_947 = getelementptr inbounds i8, ptr %_702, i64 8
  %239 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_947, ptr noundef nonnull dereferenceable(32) %_223, i64 32)
  %240 = icmp eq i32 %239, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_223)
  br i1 %240, label %bb73, label %bb71

bb313:                                            ; preds = %bb68
  %_943.1 = load ptr, ptr %232, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_217)
  br label %bb260

bb71:                                             ; preds = %bb314
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_225)
; call pump_recovered::legacy_sell::fee_math::fee
  call void @_ZN14pump_recovered11legacy_sell8fee_math3fee17h1c5ec20835bdfb98E(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_225, i64 noundef %raw_quote.sroa.0.0562, i64 noundef %_924.sroa.7.0.copyload) #28
  %241 = load i64, ptr %_225, align 8, !range !318, !noundef !2
  %242 = icmp eq i64 %241, 2
  %243 = getelementptr inbounds i8, ptr %_225, i64 8
  br i1 %242, label %bb318, label %bb317

bb318:                                            ; preds = %bb71
  %_950 = load i64, ptr %243, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_225)
  br label %bb73

bb317:                                            ; preds = %bb71
  %_951.1 = load ptr, ptr %243, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_225)
  br label %bb260

bb73:                                             ; preds = %bb314, %bb318
  %cf.sroa.0.0 = phi i64 [ %_950, %bb318 ], [ 0, %bb314 ]
  %244 = call i64 @llvm.uadd.sat.i64(i64 %raw_quote.sroa.0.0562, i64 %_942)
  %245 = call i64 @llvm.uadd.sat.i64(i64 %244, i64 %cf.sroa.0.0)
  %_234 = icmp ugt i64 %245, %_902
  br i1 %_234, label %bb74, label %bb81

bb81:                                             ; preds = %bb322, %bb73
  %quote.sroa.0.0 = phi i64 [ %_955, %bb322 ], [ %raw_quote.sroa.0.0562, %bb73 ]
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_260)
  %_703 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %_261 = getelementptr inbounds i8, ptr %_703, i64 8
; call pump_recovered::constant_product::tokens_for_quote
  call void @_ZN14pump_recovered16constant_product16tokens_for_quote17h38635175d905086fE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_260, ptr noalias noundef nonnull readonly align 8 dereferenceable(160) %_261, i64 noundef %quote.sroa.0.0) #28
  %_962 = load i64, ptr %_260, align 8, !range !389, !noundef !2
  %trunc223.not = icmp eq i64 %_962, 0
  %246 = getelementptr inbounds i8, ptr %_260, i64 8
  %_963123224 = load i64, ptr %246, align 8
  %.sroa_idx124 = getelementptr inbounds i8, ptr %_260, i64 16
  br i1 %trunc223.not, label %bb327, label %bb326

bb74:                                             ; preds = %bb73
  %247 = call i64 @llvm.usub.sat.i64(i64 %245, i64 %_902)
  %_954.not = icmp ult i64 %raw_quote.sroa.0.0562, %247
  br i1 %_954.not, label %bb323, label %bb322

bb323:                                            ; preds = %bb74
; call pump_recovered::<impl core::convert::From<pump_recovered::PumpError> for anchor_lang::error::Error>::from
  %248 = call { i64, ptr } @"_ZN14pump_recovered108_$LT$impl$u20$core..convert..From$LT$pump_recovered..PumpError$GT$$u20$for$u20$anchor_lang..error..Error$GT$4from17h3a3c89f679f0b13dE"(i32 noundef 24) #28
  %_961.0 = extractvalue { i64, ptr } %248, 0
  %_961.1 = extractvalue { i64, ptr } %248, 1
  br label %bb260

bb322:                                            ; preds = %bb74
  %_955 = sub nuw i64 %raw_quote.sroa.0.0562, %247
  %_242 = icmp eq i64 %_955, 0
  br i1 %_242, label %bb75, label %bb81

bb75:                                             ; preds = %bb322
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_246)
  %249 = getelementptr inbounds i8, ptr %_246, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17hece37d027ca7935cE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %249, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_004acfa89553cbafbb2b2f00006c54c3) #28
  %250 = getelementptr inbounds i8, ptr %_246, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %250, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_004acfa89553cbafbb2b2f00006c54c3) #28
  %251 = getelementptr inbounds i8, ptr %_246, i64 152
  store i32 6042, ptr %251, align 8
  store i64 0, ptr %_246, align 8
  %_250.sroa.4.0._246.sroa_idx = getelementptr inbounds i8, ptr %_246, i64 8
  store ptr @alloc_408c4ea996ce47019dfee66e8868b559, ptr %_250.sroa.4.0._246.sroa_idx, align 8
  %_250.sroa.4.sroa.4.0._250.sroa.4.0._246.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_246, i64 16
  store i64 27, ptr %_250.sroa.4.sroa.4.0._250.sroa.4.0._246.sroa_idx.sroa_idx, align 8
  %_250.sroa.4.sroa.5.0._250.sroa.4.0._246.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_246, i64 24
  store i32 921, ptr %_250.sroa.4.sroa.5.0._250.sroa.4.0._246.sroa_idx.sroa_idx, align 8
  %252 = getelementptr inbounds i8, ptr %_246, i64 80
  store i8 2, ptr %252, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %253 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_246) #28
  %_245.0 = extractvalue { i64, ptr } %253, 0
  %_245.1 = extractvalue { i64, ptr } %253, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_246)
; call anchor_lang::error::Error::with_values
  %254 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h3a6a6e896bb0a944E(i64 noundef %_245.0, ptr noundef %_245.1, i32 noundef 0) #28
  %_244.0 = extractvalue { i64, ptr } %254, 0
  %_244.1 = extractvalue { i64, ptr } %254, 1
  br label %bb260

bb327:                                            ; preds = %bb81
  %_963125 = load i64, ptr %.sroa_idx124, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_260)
  %_966.not = icmp eq i64 %_963125, 0
  br i1 %_966.not, label %bb83, label %bb328

bb326:                                            ; preds = %bb81
  %_964.1 = load ptr, ptr %.sroa_idx124, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_260)
  br label %bb260

bb328:                                            ; preds = %bb327
; call pump_recovered::buy_v2::buy_exact_quote_in_handler::{{closure}}
  %255 = call fastcc { i64, ptr } @"_ZN14pump_recovered6buy_v226buy_exact_quote_in_handler28_$u7b$$u7b$closure$u7d$$u7d$17h447594e91dcc6749E"() #28
  %_970.0 = extractvalue { i64, ptr } %255, 0
  %_970.1 = extractvalue { i64, ptr } %255, 1
  br label %bb260

bb83:                                             ; preds = %bb300, %bb327
  %_1199.sroa.0.0 = phi i64 [ %_924.sroa.6.0.copyload, %bb327 ], [ 0, %bb300 ]
  %_1200.sroa.0.0 = phi i64 [ %_924.sroa.7.0.copyload, %bb327 ], [ 0, %bb300 ]
  %_1201.sroa.0.0 = phi i64 [ %quote.sroa.0.0, %bb327 ], [ %_902, %bb300 ]
  %_1202.sroa.0.0 = phi i64 [ %_942, %bb327 ], [ 0, %bb300 ]
  %_1203.sroa.0.0 = phi i64 [ %cf.sroa.0.0, %bb327 ], [ 0, %bb300 ]
  %_1204.sroa.0.0 = phi i64 [ %_963123224, %bb327 ], [ %_911108226, %bb300 ]
  %_704 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %256 = getelementptr inbounds i8, ptr %_704, i64 88
  %_277 = load i64, ptr %256, align 8, !noundef !2
  %_276 = icmp ugt i64 %_1204.sroa.0.0, %_277
  %brmerge.not = and i1 %_276, %partial
  br i1 %brmerge.not, label %bb85, label %bb100

bb300:                                            ; preds = %bb50
  %_911109 = load i64, ptr %.sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_170)
  %_914.not = icmp eq i64 %_911109, 0
  br i1 %_914.not, label %bb83, label %bb301

bb299:                                            ; preds = %bb50
  %_912.1 = load ptr, ptr %.sroa_idx, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_170)
  br label %bb260

bb301:                                            ; preds = %bb300
; call pump_recovered::buy_v2::buy_exact_quote_in_handler::{{closure}}
  %257 = call fastcc { i64, ptr } @"_ZN14pump_recovered6buy_v226buy_exact_quote_in_handler28_$u7b$$u7b$closure$u7d$$u7d$17he0e92a3f1afb77abE"() #28
  %_918.0 = extractvalue { i64, ptr } %257, 0
  %_918.1 = extractvalue { i64, ptr } %257, 1
  br label %bb260

bb100:                                            ; preds = %bb83
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_321)
; call pump_recovered::buy_v2::buy_exact_quote_in_handler::{{closure}}
  call fastcc void @"_ZN14pump_recovered6buy_v226buy_exact_quote_in_handler28_$u7b$$u7b$closure$u7d$$u7d$17ha8e8800b6149bb57E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %_321, ptr %transfer_fee, i64 noundef %_1201.sroa.0.0, i64 noundef %_1202.sroa.0.0, i64 noundef %_1203.sroa.0.0) #28
  %_1006 = load i64, ptr %_321, align 8, !range !389, !noundef !2
  %trunc230.not = icmp eq i64 %_1006, 0
  %258 = getelementptr inbounds i8, ptr %_321, i64 8
  %_1007.0 = load i64, ptr %258, align 8, !noundef !2
  %259 = getelementptr inbounds i8, ptr %_321, i64 16
  br i1 %trunc230.not, label %bb346, label %bb345

bb85:                                             ; preds = %bb83
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_283)
  %_284 = getelementptr inbounds i8, ptr %_704, i64 8
; call pump_recovered::buy_quote
  call void @_ZN14pump_recovered9buy_quote17h591318dda8fae065E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_283, ptr noalias noundef nonnull readonly align 8 dereferenceable(160) %_284, i64 noundef %_277) #28
  %_975 = load i64, ptr %_283, align 8, !range !389, !noundef !2
  %trunc227.not = icmp eq i64 %_975, 0
  %260 = getelementptr inbounds i8, ptr %_283, i64 8
  %_976129228 = load i64, ptr %260, align 8
  %.sroa_idx130 = getelementptr inbounds i8, ptr %_283, i64 16
  br i1 %trunc227.not, label %bb332, label %bb331

bb346:                                            ; preds = %bb100
  %_1007.1 = load i64, ptr %259, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_321)
  %_327 = icmp ugt i64 %_1007.1, %input
  br i1 %_327, label %bb102, label %bb111

bb345:                                            ; preds = %bb100
  %_1008.1 = load ptr, ptr %259, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_321)
  br label %bb260

bb111:                                            ; preds = %bb358, %bb346
  %gross.sroa.0.0 = phi i64 [ %_1033.0, %bb358 ], [ %_1007.0, %bb346 ]
  %quote26.sroa.0.0 = phi i64 [ %_1012, %bb358 ], [ %_1201.sroa.0.0, %bb346 ]
  %amount.sroa.0.0 = phi i64 [ %_1020145232, %bb358 ], [ %_1204.sroa.0.0, %bb346 ]
  %_366 = icmp ult i64 %amount.sroa.0.0, %limit
  br i1 %_366, label %bb112, label %bb118

bb102:                                            ; preds = %bb346
  %261 = call i64 @llvm.usub.sat.i64(i64 %_1007.1, i64 %input)
  %_1011.not = icmp ult i64 %_1201.sroa.0.0, %261
  br i1 %_1011.not, label %bb349, label %bb348

bb349:                                            ; preds = %bb102
; call pump_recovered::<impl core::convert::From<pump_recovered::PumpError> for anchor_lang::error::Error>::from
  %262 = call { i64, ptr } @"_ZN14pump_recovered108_$LT$impl$u20$core..convert..From$LT$pump_recovered..PumpError$GT$$u20$for$u20$anchor_lang..error..Error$GT$4from17h3a3c89f679f0b13dE"(i32 noundef 41) #28
  %_1018.0 = extractvalue { i64, ptr } %262, 0
  %_1018.1 = extractvalue { i64, ptr } %262, 1
  br label %bb260

bb348:                                            ; preds = %bb102
  %_1012 = sub nuw i64 %_1201.sroa.0.0, %261
  %_335 = icmp eq i64 %_1012, 0
  br i1 %_335, label %bb103, label %bb104

bb104:                                            ; preds = %bb348
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_353)
  %_708 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %_354 = getelementptr inbounds i8, ptr %_708, i64 8
; call pump_recovered::constant_product::tokens_for_quote
  call void @_ZN14pump_recovered16constant_product16tokens_for_quote17h38635175d905086fE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_353, ptr noalias noundef nonnull readonly align 8 dereferenceable(160) %_354, i64 noundef %_1012) #28
  %_1019 = load i64, ptr %_353, align 8, !range !389, !noundef !2
  %trunc231.not = icmp eq i64 %_1019, 0
  %263 = getelementptr inbounds i8, ptr %_353, i64 8
  %_1020145232 = load i64, ptr %263, align 8
  %.sroa_idx146 = getelementptr inbounds i8, ptr %_353, i64 16
  br i1 %trunc231.not, label %bb353, label %bb352

bb103:                                            ; preds = %bb348
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_339)
  %264 = getelementptr inbounds i8, ptr %_339, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17hece37d027ca7935cE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %264, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_004acfa89553cbafbb2b2f00006c54c3) #28
  %265 = getelementptr inbounds i8, ptr %_339, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %265, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_004acfa89553cbafbb2b2f00006c54c3) #28
  %266 = getelementptr inbounds i8, ptr %_339, i64 152
  store i32 6042, ptr %266, align 8
  store i64 0, ptr %_339, align 8
  %_343.sroa.4.0._339.sroa_idx = getelementptr inbounds i8, ptr %_339, i64 8
  store ptr @alloc_408c4ea996ce47019dfee66e8868b559, ptr %_343.sroa.4.0._339.sroa_idx, align 8
  %_343.sroa.4.sroa.4.0._343.sroa.4.0._339.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_339, i64 16
  store i64 27, ptr %_343.sroa.4.sroa.4.0._343.sroa.4.0._339.sroa_idx.sroa_idx, align 8
  %_343.sroa.4.sroa.5.0._343.sroa.4.0._339.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_339, i64 24
  store i32 979, ptr %_343.sroa.4.sroa.5.0._343.sroa.4.0._339.sroa_idx.sroa_idx, align 8
  %267 = getelementptr inbounds i8, ptr %_339, i64 80
  store i8 2, ptr %267, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %268 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_339) #28
  %_338.0 = extractvalue { i64, ptr } %268, 0
  %_338.1 = extractvalue { i64, ptr } %268, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_339)
; call anchor_lang::error::Error::with_values
  %269 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h3a6a6e896bb0a944E(i64 noundef %_338.0, ptr noundef %_338.1, i32 noundef 0) #28
  %_337.0 = extractvalue { i64, ptr } %269, 0
  %_337.1 = extractvalue { i64, ptr } %269, 1
  br label %bb260

bb353:                                            ; preds = %bb104
  %_1020147 = load i64, ptr %.sroa_idx146, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_353)
  %_1023.not = icmp eq i64 %_1020147, 0
  br i1 %_1023.not, label %bb355, label %bb354

bb352:                                            ; preds = %bb104
  %_1021.1 = load ptr, ptr %.sroa_idx146, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_353)
  br label %bb260

bb355:                                            ; preds = %bb353
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_361)
; call pump_recovered::buy_v2::buy_exact_quote_in_handler::{{closure}}
  call fastcc void @"_ZN14pump_recovered6buy_v226buy_exact_quote_in_handler28_$u7b$$u7b$closure$u7d$$u7d$17ha8e8800b6149bb57E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %_361, ptr %transfer_fee, i64 noundef %_1012, i64 noundef %_1202.sroa.0.0, i64 noundef %_1203.sroa.0.0) #28
  %_1032 = load i64, ptr %_361, align 8, !range !389, !noundef !2
  %trunc233.not = icmp eq i64 %_1032, 0
  %270 = getelementptr inbounds i8, ptr %_361, i64 8
  %_1033.0 = load i64, ptr %270, align 8, !noundef !2
  br i1 %trunc233.not, label %bb358, label %bb357

bb354:                                            ; preds = %bb353
; call pump_recovered::buy_v2::buy_exact_quote_in_handler::{{closure}}
  %271 = call fastcc { i64, ptr } @"_ZN14pump_recovered6buy_v226buy_exact_quote_in_handler28_$u7b$$u7b$closure$u7d$$u7d$17h0b2c4f0e747e9f0aE"() #28
  %_1027.0 = extractvalue { i64, ptr } %271, 0
  %_1027.1 = extractvalue { i64, ptr } %271, 1
  br label %bb260

bb358:                                            ; preds = %bb355
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_361)
  br label %bb111

bb357:                                            ; preds = %bb355
  %272 = getelementptr inbounds i8, ptr %_361, i64 16
  %_1034.1 = load ptr, ptr %272, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_361)
  br label %bb260

bb112:                                            ; preds = %bb111
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_370)
  %273 = getelementptr inbounds i8, ptr %_370, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17hece37d027ca7935cE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %273, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_004acfa89553cbafbb2b2f00006c54c3) #28
  %274 = getelementptr inbounds i8, ptr %_370, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %274, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_004acfa89553cbafbb2b2f00006c54c3) #28
  %275 = getelementptr inbounds i8, ptr %_370, i64 152
  store i32 6042, ptr %275, align 8
  store i64 0, ptr %_370, align 8
  %_374.sroa.4.0._370.sroa_idx = getelementptr inbounds i8, ptr %_370, i64 8
  store ptr @alloc_408c4ea996ce47019dfee66e8868b559, ptr %_374.sroa.4.0._370.sroa_idx, align 8
  %_374.sroa.4.sroa.4.0._374.sroa.4.0._370.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_370, i64 16
  store i64 27, ptr %_374.sroa.4.sroa.4.0._374.sroa.4.0._370.sroa_idx.sroa_idx, align 8
  %_374.sroa.4.sroa.5.0._374.sroa.4.0._370.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_370, i64 24
  store i32 986, ptr %_374.sroa.4.sroa.5.0._374.sroa.4.0._370.sroa_idx.sroa_idx, align 8
  %276 = getelementptr inbounds i8, ptr %_370, i64 80
  store i8 2, ptr %276, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %277 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_370) #28
  %_369.0 = extractvalue { i64, ptr } %277, 0
  %_369.1 = extractvalue { i64, ptr } %277, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_370)
; call anchor_lang::error::Error::with_values
  %278 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h98218df8cef8c4d0E(i64 noundef %_369.0, ptr noundef %_369.1, i64 noundef %amount.sroa.0.0, i64 noundef %limit) #28
  %_368.0 = extractvalue { i64, ptr } %278, 0
  %_368.1 = extractvalue { i64, ptr } %278, 1
  br label %bb260

bb118:                                            ; preds = %bb343, %bb111
  %_1205.sroa.0.0 = phi i64 [ %amount.sroa.0.0, %bb111 ], [ %_277, %bb343 ]
  %_1206.sroa.0.0 = phi i64 [ %quote26.sroa.0.0, %bb111 ], [ %_976129228, %bb343 ]
  %_1207.sroa.0.0 = phi i64 [ %_1202.sroa.0.0, %bb111 ], [ %_989, %bb343 ]
  %_1208.sroa.0.0 = phi i64 [ %_1203.sroa.0.0, %bb111 ], [ %cf22.sroa.0.0, %bb343 ]
  %_1209.sroa.0.0 = phi i64 [ %gross.sroa.0.0, %bb111 ], [ %_1002.0, %bb343 ]
  %_1037.not = icmp ult i64 %_1209.sroa.0.0, %_1206.sroa.0.0
  br i1 %_1037.not, label %bb361, label %bb360

bb332:                                            ; preds = %bb85
  %_976131 = load i64, ptr %.sroa_idx130, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_283)
  %_979.not = icmp eq i64 %_976131, 0
  br i1 %_979.not, label %bb334, label %bb333

bb331:                                            ; preds = %bb85
  %_977.1 = load ptr, ptr %.sroa_idx130, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_283)
  br label %bb260

bb334:                                            ; preds = %bb332
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_290)
; call pump_recovered::legacy_sell::fee_math::fee
  call void @_ZN14pump_recovered11legacy_sell8fee_math3fee17h1c5ec20835bdfb98E(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_290, i64 noundef %_976129228, i64 noundef %_1199.sroa.0.0) #28
  %279 = load i64, ptr %_290, align 8, !range !318, !noundef !2
  %280 = icmp eq i64 %279, 2
  %281 = getelementptr inbounds i8, ptr %_290, i64 8
  br i1 %280, label %bb337, label %bb336

bb333:                                            ; preds = %bb332
; call pump_recovered::buy_v2::buy_exact_quote_in_handler::{{closure}}
  %282 = call fastcc { i64, ptr } @"_ZN14pump_recovered6buy_v226buy_exact_quote_in_handler28_$u7b$$u7b$closure$u7d$$u7d$17hd3af8e07a95b2b4dE"() #28
  %_983.0 = extractvalue { i64, ptr } %282, 0
  %_983.1 = extractvalue { i64, ptr } %282, 1
  br label %bb260

bb337:                                            ; preds = %bb334
  %_989 = load i64, ptr %281, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_290)
  %_707 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_295)
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_295, i8 0, i64 32, i1 false)
  %_994 = getelementptr inbounds i8, ptr %_707, i64 8
  %283 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_994, ptr noundef nonnull dereferenceable(32) %_295, i64 32)
  %284 = icmp eq i32 %283, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_295)
  br i1 %284, label %bb91, label %bb89

bb336:                                            ; preds = %bb334
  %_990.1 = load ptr, ptr %281, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_290)
  br label %bb260

bb89:                                             ; preds = %bb337
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_297)
; call pump_recovered::legacy_sell::fee_math::fee
  call void @_ZN14pump_recovered11legacy_sell8fee_math3fee17h1c5ec20835bdfb98E(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_297, i64 noundef %_976129228, i64 noundef %_1200.sroa.0.0) #28
  %285 = load i64, ptr %_297, align 8, !range !318, !noundef !2
  %286 = icmp eq i64 %285, 2
  %287 = getelementptr inbounds i8, ptr %_297, i64 8
  br i1 %286, label %bb341, label %bb340

bb341:                                            ; preds = %bb89
  %_997 = load i64, ptr %287, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_297)
  br label %bb91

bb340:                                            ; preds = %bb89
  %_998.1 = load ptr, ptr %287, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_297)
  br label %bb260

bb91:                                             ; preds = %bb337, %bb341
  %cf22.sroa.0.0 = phi i64 [ %_997, %bb341 ], [ 0, %bb337 ]
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_301)
; call pump_recovered::buy_v2::buy_exact_quote_in_handler::{{closure}}
  call fastcc void @"_ZN14pump_recovered6buy_v226buy_exact_quote_in_handler28_$u7b$$u7b$closure$u7d$$u7d$17ha8e8800b6149bb57E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %_301, ptr %transfer_fee, i64 noundef %_976129228, i64 noundef %_989, i64 noundef %cf22.sroa.0.0) #28
  %_1001 = load i64, ptr %_301, align 8, !range !389, !noundef !2
  %trunc229.not = icmp eq i64 %_1001, 0
  %288 = getelementptr inbounds i8, ptr %_301, i64 8
  %_1002.0 = load i64, ptr %288, align 8, !noundef !2
  %289 = getelementptr inbounds i8, ptr %_301, i64 16
  br i1 %trunc229.not, label %bb343, label %bb342

bb343:                                            ; preds = %bb91
  %_1002.1 = load i64, ptr %289, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_301)
  %_306 = icmp ugt i64 %_1002.1, %input
  br i1 %_306, label %bb93, label %bb118

bb342:                                            ; preds = %bb91
  %_1003.1 = load ptr, ptr %289, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_301)
  br label %bb260

bb93:                                             ; preds = %bb343
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_309)
  %290 = getelementptr inbounds i8, ptr %_309, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17hece37d027ca7935cE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %290, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_2e38410fced2c310c68bdf2d45d0c3bd) #28
  %291 = getelementptr inbounds i8, ptr %_309, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %291, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_2e38410fced2c310c68bdf2d45d0c3bd) #28
  %292 = getelementptr inbounds i8, ptr %_309, i64 152
  store i32 6002, ptr %292, align 8
  store i64 0, ptr %_309, align 8
  %_313.sroa.4.0._309.sroa_idx = getelementptr inbounds i8, ptr %_309, i64 8
  store ptr @alloc_408c4ea996ce47019dfee66e8868b559, ptr %_313.sroa.4.0._309.sroa_idx, align 8
  %_313.sroa.4.sroa.4.0._313.sroa.4.0._309.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_309, i64 16
  store i64 27, ptr %_313.sroa.4.sroa.4.0._313.sroa.4.0._309.sroa_idx.sroa_idx, align 8
  %_313.sroa.4.sroa.5.0._313.sroa.4.0._309.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_309, i64 24
  store i32 967, ptr %_313.sroa.4.sroa.5.0._313.sroa.4.0._309.sroa_idx.sroa_idx, align 8
  %293 = getelementptr inbounds i8, ptr %_309, i64 80
  store i8 2, ptr %293, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %294 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_309) #28
  %_308.0 = extractvalue { i64, ptr } %294, 0
  %_308.1 = extractvalue { i64, ptr } %294, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_309)
; call anchor_lang::error::Error::with_values
  %295 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h98218df8cef8c4d0E(i64 noundef %_308.0, ptr noundef %_308.1, i64 noundef %input, i64 noundef %_1002.1) #28
  %_307.0 = extractvalue { i64, ptr } %295, 0
  %_307.1 = extractvalue { i64, ptr } %295, 1
  br label %bb260

bb361:                                            ; preds = %bb118
; call pump_recovered::buy_v2::buy_exact_quote_in_handler::{{closure}}
  %296 = call fastcc { i64, ptr } @"_ZN14pump_recovered6buy_v226buy_exact_quote_in_handler28_$u7b$$u7b$closure$u7d$$u7d$17ha60d47b3546d4d63E"() #28
  %_1040.0 = extractvalue { i64, ptr } %296, 0
  %_1040.1 = extractvalue { i64, ptr } %296, 1
  br label %bb260

bb360:                                            ; preds = %bb118
  %_1038 = sub nuw i64 %_1209.sroa.0.0, %_1206.sroa.0.0
  %_709 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %297 = getelementptr inbounds i8, ptr %_709, i64 88
  %_389 = load i64, ptr %297, align 8, !noundef !2
  %_388 = icmp ult i64 %_389, %_1205.sroa.0.0
  br i1 %_388, label %bb119, label %bb124

bb124:                                            ; preds = %bb360
  %298 = getelementptr inbounds i8, ptr %_709, i64 8
; call pump_recovered::<impl pump_recovered::trade_types::BondingCurve>::apply_buy
  %299 = call { i64, ptr } @"_ZN14pump_recovered59_$LT$impl$u20$pump_recovered..trade_types..BondingCurve$GT$9apply_buy17h127c4a98cd9ea505E"(ptr noalias noundef nonnull align 8 dereferenceable(160) %298, i64 noundef %_1205.sroa.0.0, i64 noundef %_1206.sroa.0.0) #28
  %300 = extractvalue { i64, ptr } %299, 0
  %301 = icmp eq i64 %300, 2
  br i1 %301, label %bb365, label %bb364

bb119:                                            ; preds = %bb360
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_392)
  %302 = getelementptr inbounds i8, ptr %_392, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17hece37d027ca7935cE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %302, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_9032913b93df2a93f8a032d18ba5abf9) #28
  %303 = getelementptr inbounds i8, ptr %_392, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %303, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_9032913b93df2a93f8a032d18ba5abf9) #28
  %304 = getelementptr inbounds i8, ptr %_392, i64 152
  store i32 6021, ptr %304, align 8
  store i64 0, ptr %_392, align 8
  %_396.sroa.4.0._392.sroa_idx = getelementptr inbounds i8, ptr %_392, i64 8
  store ptr @alloc_408c4ea996ce47019dfee66e8868b559, ptr %_396.sroa.4.0._392.sroa_idx, align 8
  %_396.sroa.4.sroa.4.0._396.sroa.4.0._392.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_392, i64 16
  store i64 27, ptr %_396.sroa.4.sroa.4.0._396.sroa.4.0._392.sroa_idx.sroa_idx, align 8
  %_396.sroa.4.sroa.5.0._396.sroa.4.0._392.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_392, i64 24
  store i32 997, ptr %_396.sroa.4.sroa.5.0._396.sroa.4.0._392.sroa_idx.sroa_idx, align 8
  %305 = getelementptr inbounds i8, ptr %_392, i64 80
  store i8 2, ptr %305, align 8
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %306 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_392) #28
  %_391.0 = extractvalue { i64, ptr } %306, 0
  %_391.1 = extractvalue { i64, ptr } %306, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_392)
  %_710 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %307 = getelementptr inbounds i8, ptr %_710, i64 88
  %_401 = load i64, ptr %307, align 8, !noundef !2
; call anchor_lang::error::Error::with_values
  %308 = call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h98218df8cef8c4d0E(i64 noundef %_391.0, ptr noundef %_391.1, i64 noundef %_401, i64 noundef %_1205.sroa.0.0) #28
  %_390.0 = extractvalue { i64, ptr } %308, 0
  %_390.1 = extractvalue { i64, ptr } %308, 1
  br label %bb260

bb365:                                            ; preds = %bb124
  %_408 = getelementptr inbounds i8, ptr %a, i64 264
  %309 = getelementptr inbounds i8, ptr %a, i64 328
  %_712 = load ptr, ptr %309, align 8, !nonnull !2, !align !3, !noundef !2
  %310 = getelementptr inbounds i8, ptr %a, i64 352
  %_713 = load ptr, ptr %310, align 8, !nonnull !2, !align !3, !noundef !2
  %_714 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %311 = getelementptr inbounds i8, ptr %a, i64 248
  %_715 = load ptr, ptr %311, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_414)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_417)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_420)
  %312 = getelementptr inbounds i8, ptr %_715, i64 88
  %_1048 = load ptr, ptr %312, align 8, !nonnull !2, !align !3, !noundef !2
  %_1049 = load ptr, ptr %_1048, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_420, ptr noundef nonnull align 1 dereferenceable(32) %_1049, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %_423)
  %313 = getelementptr inbounds i8, ptr %ctx, i64 35
  %_424 = load i8, ptr %313, align 1, !noundef !2
  store i8 %_424, ptr %_423, align 1
  store ptr @alloc_65b7b62d1c393af7ea07c820158a5930, ptr %_417, align 8
  %314 = getelementptr inbounds i8, ptr %_417, i64 8
  store i64 13, ptr %314, align 8
  %315 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_417, i64 0, i64 1
  store ptr %_420, ptr %315, align 8
  %316 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_417, i64 0, i64 1, i32 1
  store i64 32, ptr %316, align 8
  %317 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_417, i64 0, i64 2
  store ptr %_423, ptr %317, align 8
  %318 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_417, i64 0, i64 2, i32 1
  store i64 1, ptr %318, align 8
  store ptr %_417, ptr %_414, align 8
  %319 = getelementptr inbounds i8, ptr %_414, i64 8
  store i64 3, ptr %319, align 8
  %320 = getelementptr i8, ptr %_715, i64 48
  %_715.val = load i8, ptr %320, align 8, !noundef !2
; call pump_recovered::buy_v2::token_transfers::transfer_curve_tokens
  %321 = call { i64, ptr } @_ZN14pump_recovered6buy_v215token_transfers21transfer_curve_tokens17hc402f5276e63c661E(ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_408, ptr noalias noundef nonnull readonly align 8 dereferenceable(216) %_712, ptr noalias noundef nonnull readonly align 8 dereferenceable(216) %_713, ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %_714, i8 noundef %_715.val, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1048, i64 noundef %_1205.sroa.0.0, ptr noalias noundef nonnull readonly align 8 dereferenceable(16) %_414) #28
  %322 = extractvalue { i64, ptr } %321, 0
  %323 = icmp eq i64 %322, 2
  br i1 %323, label %bb367, label %bb366

bb364:                                            ; preds = %bb124
  %324 = extractvalue { i64, ptr } %299, 1
  br label %bb260

bb367:                                            ; preds = %bb365
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_423)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_420)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_417)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_414)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_427)
  %_1055 = load ptr, ptr %208, align 8, !nonnull !2, !align !3, !noundef !2
  %_1056 = load ptr, ptr %_1055, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_427, ptr noundef nonnull align 1 dereferenceable(32) %_1056, i64 32, i1 false)
  %_717 = load ptr, ptr %31, align 8, !nonnull !2, !align !3, !noundef !2
  %_1059 = getelementptr inbounds i8, ptr %_717, i64 648
  %325 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_427, ptr noundef nonnull dereferenceable(32) %_1059, i64 32)
  %326 = icmp eq i32 %325, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_427)
  br i1 %326, label %bb127, label %bb130

bb366:                                            ; preds = %bb365
  %327 = extractvalue { i64, ptr } %321, 1
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_423)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_420)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_417)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_414)
  br label %bb260

bb127:                                            ; preds = %bb367
  %_718 = load ptr, ptr %309, align 8, !nonnull !2, !align !3, !noundef !2
  %_1060 = getelementptr inbounds i8, ptr %_718, i64 32
; call anchor_lang::accounts::account::Account<T>::reload
  %328 = call fastcc { i64, ptr } @"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h807a91e77d8dcc0bE"(ptr noalias noundef nonnull align 8 dereferenceable(184) %_1060) #28
  %329 = extractvalue { i64, ptr } %328, 0
  %330 = icmp eq i64 %329, 2
  br i1 %330, label %bb371, label %bb370

bb130:                                            ; preds = %bb367, %bb376
  %331 = getelementptr inbounds i8, ptr %a, i64 392
  %_724 = load ptr, ptr %331, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_443)
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_443, i8 0, i64 32, i1 false)
  %_1075 = getelementptr inbounds i8, ptr %_724, i64 8
  %332 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_1075, ptr noundef nonnull dereferenceable(32) %_443, i64 32)
  %333 = icmp eq i32 %332, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_443)
  br i1 %333, label %bb131, label %bb133

bb371:                                            ; preds = %bb127
  %_719 = load ptr, ptr %310, align 8, !nonnull !2, !align !3, !noundef !2
  %_1064 = getelementptr inbounds i8, ptr %_719, i64 32
; call anchor_lang::accounts::account::Account<T>::reload
  %334 = call fastcc { i64, ptr } @"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h807a91e77d8dcc0bE"(ptr noalias noundef nonnull align 8 dereferenceable(184) %_1064) #28
  %335 = extractvalue { i64, ptr } %334, 0
  %336 = icmp eq i64 %335, 2
  br i1 %336, label %bb374, label %bb373

bb370:                                            ; preds = %bb127
  %337 = extractvalue { i64, ptr } %328, 1
  br label %bb260

bb374:                                            ; preds = %bb371
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %quote_mint36)
  %_720 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %338 = getelementptr inbounds i8, ptr %_720, i64 40
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %quote_mint36, ptr noundef nonnull align 8 dereferenceable(32) %338, i64 32, i1 false)
  %_437 = getelementptr inbounds i8, ptr %_720, i64 8
  %_722 = load ptr, ptr %309, align 8, !nonnull !2, !align !3, !noundef !2
  %339 = getelementptr inbounds i8, ptr %_722, i64 104
  %_438 = load i64, ptr %339, align 8, !noundef !2
  %_723 = load ptr, ptr %310, align 8, !nonnull !2, !align !3, !noundef !2
  %340 = getelementptr inbounds i8, ptr %_723, i64 104
  %_439 = load i64, ptr %340, align 8, !noundef !2
; call pump_recovered::mayhem_virtual_params::<impl pump_recovered::trade_types::BondingCurve>::sync_virtual_quote_reserves
  %341 = call { i64, ptr } @"_ZN14pump_recovered21mayhem_virtual_params59_$LT$impl$u20$pump_recovered..trade_types..BondingCurve$GT$27sync_virtual_quote_reserves17h697b91a2a2b40556E"(ptr noalias noundef nonnull align 8 dereferenceable(160) %_437, i64 noundef %_438, i64 noundef %_439, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %quote_mint36) #28
  %342 = extractvalue { i64, ptr } %341, 0
  %343 = icmp eq i64 %342, 2
  br i1 %343, label %bb376, label %bb375

bb373:                                            ; preds = %bb371
  %344 = extractvalue { i64, ptr } %334, 1
  br label %bb260

bb376:                                            ; preds = %bb374
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %quote_mint36)
  br label %bb130

bb375:                                            ; preds = %bb374
  %345 = extractvalue { i64, ptr } %341, 1
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %quote_mint36)
  br label %bb260

bb131:                                            ; preds = %bb130
  %_1077 = load ptr, ptr %208, align 8, !nonnull !2, !align !3, !noundef !2
  %_1078 = load ptr, ptr %_1077, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memmove.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %_1075, ptr noundef nonnull align 1 dereferenceable(32) %_1078, i64 32, i1 false)
  br label %bb133

bb133:                                            ; preds = %bb130, %bb131
  %_445.not = icmp eq i64 %_1208.sroa.0.0, 0
  br i1 %_445.not, label %bb148, label %bb134

bb148:                                            ; preds = %bb145, %bb381, %bb133
  %_484 = getelementptr inbounds i8, ptr %a, i64 416
  %_1225 = load ptr, ptr %3, align 8, !nonnull !2, !noundef !2
  br i1 %53, label %bb151, label %bb150

bb134:                                            ; preds = %bb133
  %_726 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %346 = getelementptr inbounds i8, ptr %_726, i64 163
  %347 = load i8, ptr %346, align 1, !range !374, !noundef !2
  %_446.not = icmp eq i8 %347, 0
  %_465 = getelementptr inbounds i8, ptr %a, i64 416
  br i1 %_446.not, label %bb141, label %bb135

bb141:                                            ; preds = %bb134
  %_467 = getelementptr inbounds i8, ptr %a, i64 144
; call pump_native_payments::ensure_rent_exempt_v2
  %348 = call { i64, ptr } @_ZN20pump_native_payments21ensure_rent_exempt_v217h8954b1153ee55fbcE(i64 noundef 0, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_465, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %208, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_467) #28
  %349 = extractvalue { i64, ptr } %348, 0
  %350 = icmp eq i64 %349, 2
  br i1 %350, label %bb385, label %bb384

bb135:                                            ; preds = %bb134
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_451)
  %_727 = load ptr, ptr %331, align 8, !nonnull !2, !align !3, !noundef !2
  %_1079 = load ptr, ptr %_727, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_451, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1079) #28
  %_452 = getelementptr inbounds i8, ptr %a, i64 272
  %351 = getelementptr inbounds i8, ptr %a, i64 256
  %_728 = load ptr, ptr %351, align 8, !nonnull !2, !align !3, !noundef !2
  br i1 %53, label %bb138, label %bb137

bb385:                                            ; preds = %bb141
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_473)
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_473, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_467) #28
  %_475 = getelementptr inbounds i8, ptr %a, i64 272
  %352 = getelementptr inbounds i8, ptr %a, i64 256
  %_730 = load ptr, ptr %352, align 8, !nonnull !2, !align !3, !noundef !2
  br i1 %53, label %bb145, label %bb144

bb384:                                            ; preds = %bb141
  %353 = extractvalue { i64, ptr } %348, 1
  br label %bb260

bb144:                                            ; preds = %bb385
  %354 = getelementptr inbounds i8, ptr %a, i64 360
  %_478 = load ptr, ptr %354, align 8, !nonnull !2, !align !3, !noundef !2
  %355 = getelementptr inbounds i8, ptr %a, i64 368
  %_480 = load ptr, ptr %355, align 8, !nonnull !2, !align !3, !noundef !2
  br label %bb145

bb145:                                            ; preds = %bb385, %bb144
  %_477.sroa.0.0 = phi ptr [ %_478, %bb144 ], [ null, %bb385 ]
  %_479.sroa.0.0 = phi ptr [ %_480, %bb144 ], [ null, %bb385 ]
  %_465.val270 = load ptr, ptr %_465, align 8, !nonnull !2, !align !3, !noundef !2
  %356 = getelementptr i8, ptr %_730, i64 48
  %_730.val = load i8, ptr %356, align 8, !noundef !2
  %357 = getelementptr i8, ptr %_730, i64 88
  %_730.val271 = load ptr, ptr %357, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::user_quote_payments::transfer_from_user_owned
  %358 = call { i64, ptr } @_ZN14pump_recovered19user_quote_payments24transfer_from_user_owned17h029748c57774cd08E(i1 noundef zeroext %53, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_465.val270, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %208, ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_473, i64 noundef %_1208.sroa.0.0, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_475, i8 noundef %_730.val, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_730.val271, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_477.sroa.0.0, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_479.sroa.0.0) #28
  %359 = extractvalue { i64, ptr } %358, 0
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_473)
  %360 = icmp eq i64 %359, 2
  br i1 %360, label %bb148, label %bb387

bb387:                                            ; preds = %bb145
  %361 = extractvalue { i64, ptr } %358, 1
  br label %bb260

bb137:                                            ; preds = %bb135
  %362 = getelementptr inbounds i8, ptr %a, i64 360
  %_455 = load ptr, ptr %362, align 8, !nonnull !2, !align !3, !noundef !2
  %363 = getelementptr inbounds i8, ptr %a, i64 400
  %_457 = load ptr, ptr %363, align 8, !nonnull !2, !align !3, !noundef !2
  br label %bb138

bb138:                                            ; preds = %bb135, %bb137
  %_454.sroa.0.0 = phi ptr [ %_455, %bb137 ], [ null, %bb135 ]
  %_456.sroa.0.0 = phi ptr [ %_457, %bb137 ], [ null, %bb135 ]
  %_465.val = load ptr, ptr %_465, align 8, !nonnull !2, !align !3, !noundef !2
  %364 = getelementptr i8, ptr %_728, i64 48
  %_728.val = load i8, ptr %364, align 8, !noundef !2
  %365 = getelementptr i8, ptr %_728, i64 88
  %_728.val269 = load ptr, ptr %365, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::user_quote_payments::transfer_from_user_owned
  %366 = call { i64, ptr } @_ZN14pump_recovered19user_quote_payments24transfer_from_user_owned17h029748c57774cd08E(i1 noundef zeroext %53, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_465.val, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %208, ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_451, i64 noundef %_1208.sroa.0.0, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_452, i8 noundef %_728.val, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_728.val269, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_454.sroa.0.0, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_456.sroa.0.0) #28
  %367 = extractvalue { i64, ptr } %366, 0
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_451)
  %368 = icmp eq i64 %367, 2
  br i1 %368, label %bb381, label %bb380

bb381:                                            ; preds = %bb138
  %_729 = load ptr, ptr %331, align 8, !nonnull !2, !align !3, !noundef !2
  %_461 = getelementptr inbounds i8, ptr %_729, i64 8
; call pump_recovered::token_incentives::volume_accumulator::record_cashback_earned
  %369 = call { i64, ptr } @_ZN14pump_recovered16token_incentives18volume_accumulator22record_cashback_earned17h78393e8c270430dcE(ptr noalias noundef nonnull align 8 dereferenceable(104) %_461, i64 noundef %_1208.sroa.0.0, i1 noundef zeroext %53) #28
  br label %bb148

bb380:                                            ; preds = %bb138
  %370 = extractvalue { i64, ptr } %366, 1
  br label %bb260

bb150:                                            ; preds = %bb148
  %371 = getelementptr inbounds i8, ptr %a, i64 360
  %_491 = load ptr, ptr %371, align 8, !nonnull !2, !align !3, !noundef !2
  %372 = getelementptr inbounds i8, ptr %a, i64 336
  %_493 = load ptr, ptr %372, align 8, !nonnull !2, !align !3, !noundef !2
  br label %bb151

bb151:                                            ; preds = %bb148, %bb150
  %_487.sroa.0.0 = phi i64 [ %_1209.sroa.0.0, %bb150 ], [ %_1206.sroa.0.0, %bb148 ]
  %_490.sroa.0.0 = phi ptr [ %_491, %bb150 ], [ null, %bb148 ]
  %_492.sroa.0.0 = phi ptr [ %_493, %bb150 ], [ null, %bb148 ]
  %_489.sroa.0.0.in = getelementptr inbounds i8, ptr %a, i64 256
  %_489.sroa.0.0 = load ptr, ptr %_489.sroa.0.0.in, align 8, !nonnull !2, !align !3, !noundef !2
  %_488.sroa.0.0 = getelementptr inbounds i8, ptr %a, i64 272
  %_484.val = load ptr, ptr %_484, align 8, !nonnull !2, !align !3, !noundef !2
  %373 = getelementptr i8, ptr %_489.sroa.0.0, i64 48
  %_489.sroa.0.0.val = load i8, ptr %373, align 8, !noundef !2
  %374 = getelementptr i8, ptr %_489.sroa.0.0, i64 88
  %_489.sroa.0.0.val272 = load ptr, ptr %374, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::user_quote_payments::transfer_from_user
  %375 = call { i64, ptr } @_ZN14pump_recovered19user_quote_payments18transfer_from_user17h07b5836f55389456E(i1 noundef zeroext %53, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_484.val, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %208, ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %_1225, i64 noundef %_487.sroa.0.0, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_488.sroa.0.0, i8 noundef %_489.sroa.0.0.val, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_489.sroa.0.0.val272, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_490.sroa.0.0, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_492.sroa.0.0) #28
  %376 = extractvalue { i64, ptr } %375, 0
  %377 = icmp eq i64 %376, 2
  br i1 %377, label %bb390, label %bb389

bb390:                                            ; preds = %bb151
  %_732 = load ptr, ptr %31, align 8, !nonnull !2, !align !3, !noundef !2
  %_498 = getelementptr inbounds i8, ptr %_732, i64 8
  %_733 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %378 = getelementptr inbounds i8, ptr %_733, i64 162
  %379 = load i8, ptr %378, align 2, !range !374, !noundef !2
  %_499 = icmp ne i8 %379, 0
; call pump_recovered::split_protocol_fee
  %380 = call { i64, i64 } @_ZN14pump_recovered18split_protocol_fee17hb40f256d491c00bfE(ptr noalias noundef nonnull readonly align 8 dereferenceable(1080) %_498, i64 noundef %_1207.sroa.0.0, i1 noundef zeroext %_499) #28
  %_497.0 = extractvalue { i64, i64 } %380, 0
  %_497.1 = extractvalue { i64, i64 } %380, 1
  %_734 = load ptr, ptr %_489.sroa.0.0.in, align 8, !nonnull !2, !align !3, !noundef !2
  br i1 %53, label %bb156, label %bb155

bb389:                                            ; preds = %bb151
  %381 = extractvalue { i64, ptr } %375, 1
  br label %bb260

bb155:                                            ; preds = %bb390
  %382 = getelementptr inbounds i8, ptr %a, i64 360
  %_508 = load ptr, ptr %382, align 8, !nonnull !2, !align !3, !noundef !2
  %383 = getelementptr inbounds i8, ptr %a, i64 296
  %_510 = load ptr, ptr %383, align 8, !nonnull !2, !align !3, !noundef !2
  br label %bb156

bb156:                                            ; preds = %bb390, %bb155
  %_507.sroa.0.0 = phi ptr [ %_508, %bb155 ], [ null, %bb390 ]
  %_509.sroa.0.0 = phi ptr [ %_510, %bb155 ], [ null, %bb390 ]
  %_484.val275 = load ptr, ptr %_484, align 8, !nonnull !2, !align !3, !noundef !2
  %384 = getelementptr i8, ptr %_734, i64 48
  %_734.val = load i8, ptr %384, align 8, !noundef !2
  %385 = getelementptr i8, ptr %_734, i64 88
  %_734.val276 = load ptr, ptr %385, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::user_quote_payments::transfer_from_user_recipient
  %386 = call { i64, ptr } @_ZN14pump_recovered19user_quote_payments28transfer_from_user_recipient17h418389050960fd82E(i1 noundef zeroext %53, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_484.val275, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %208, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %fee_recipient, i64 noundef %_497.1, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_488.sroa.0.0, i8 noundef %_734.val, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_734.val276, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_507.sroa.0.0, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_509.sroa.0.0) #28
  %387 = extractvalue { i64, ptr } %386, 0
  %388 = icmp eq i64 %387, 2
  br i1 %388, label %bb392, label %bb391

bb392:                                            ; preds = %bb156
  %_735 = load ptr, ptr %_489.sroa.0.0.in, align 8, !nonnull !2, !align !3, !noundef !2
  br i1 %53, label %bb160, label %bb159

bb391:                                            ; preds = %bb156
  %389 = extractvalue { i64, ptr } %386, 1
  br label %bb260

bb159:                                            ; preds = %bb392
  %390 = getelementptr inbounds i8, ptr %a, i64 360
  %_520 = load ptr, ptr %390, align 8, !nonnull !2, !align !3, !noundef !2
  %391 = getelementptr inbounds i8, ptr %a, i64 312
  %_522 = load ptr, ptr %391, align 8, !nonnull !2, !align !3, !noundef !2
  br label %bb160

bb160:                                            ; preds = %bb392, %bb159
  %_519.sroa.0.0 = phi ptr [ %_520, %bb159 ], [ null, %bb392 ]
  %_521.sroa.0.0 = phi ptr [ %_522, %bb159 ], [ null, %bb392 ]
  %_484.val273 = load ptr, ptr %_484, align 8, !nonnull !2, !align !3, !noundef !2
  %392 = getelementptr i8, ptr %_735, i64 48
  %_735.val = load i8, ptr %392, align 8, !noundef !2
  %393 = getelementptr i8, ptr %_735, i64 88
  %_735.val274 = load ptr, ptr %393, align 8, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::user_quote_payments::transfer_from_user_recipient
  %394 = call { i64, ptr } @_ZN14pump_recovered19user_quote_payments28transfer_from_user_recipient17h418389050960fd82E(i1 noundef zeroext %53, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_484.val273, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %208, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %buyback_fee_recipient, i64 noundef %_497.0, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_488.sroa.0.0, i8 noundef %_735.val, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_735.val274, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_519.sroa.0.0, ptr noalias noundef readonly align 8 dereferenceable_or_null(48) %_521.sroa.0.0) #28
  %395 = extractvalue { i64, ptr } %394, 0
  %396 = icmp eq i64 %395, 2
  br i1 %396, label %bb394, label %bb393

bb394:                                            ; preds = %bb160
  %_736 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %397 = getelementptr inbounds i8, ptr %_736, i64 8
  %398 = getelementptr inbounds i8, ptr %_736, i64 72
  %virtual_token_reserves = load i64, ptr %398, align 8, !noundef !2
  %399 = getelementptr inbounds i8, ptr %_736, i64 80
  %virtual_quote_reserves = load i64, ptr %399, align 8, !noundef !2
  %400 = getelementptr inbounds i8, ptr %_736, i64 88
  %real_token_reserves = load i64, ptr %400, align 8, !noundef !2
  %401 = getelementptr inbounds i8, ptr %_736, i64 96
  %real_quote_reserves = load i64, ptr %401, align 8, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %creator, ptr noundef nonnull align 8 dereferenceable(32) %397, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %quote_mint45)
  %402 = getelementptr inbounds i8, ptr %_736, i64 40
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %quote_mint45, ptr noundef nonnull align 8 dereferenceable(32) %402, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_532)
; call solana_sysvar::clock::<impl solana_sysvar::Sysvar for solana_clock::Clock>::get
  call void @"_ZN13solana_sysvar5clock71_$LT$impl$u20$solana_sysvar..Sysvar$u20$for$u20$solana_clock..Clock$GT$3get17hf864a57fc372ac1bE"(ptr noalias nocapture noundef nonnull sret([48 x i8]) align 8 dereferenceable(48) %_532) #28
  %_1109 = load i64, ptr %_532, align 8, !range !389, !noundef !2
  %trunc234.not = icmp eq i64 %_1109, 0
  br i1 %trunc234.not, label %bb396, label %bb395

bb393:                                            ; preds = %bb160
  %403 = extractvalue { i64, ptr } %394, 1
  br label %bb260

bb396:                                            ; preds = %bb394
  %_1110.sroa.8.0..sroa_idx = getelementptr inbounds i8, ptr %_532, i64 40
  %_1110.sroa.8.0.copyload = load i64, ptr %_1110.sroa.8.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_532)
  %_742 = load ptr, ptr %331, align 8, !nonnull !2, !align !3, !noundef !2
  %404 = getelementptr inbounds i8, ptr %_742, i64 40
  %total_unclaimed_tokens = load i64, ptr %404, align 8, !noundef !2
  %405 = getelementptr inbounds i8, ptr %_742, i64 48
  %total_claimed_tokens = load i64, ptr %405, align 8, !noundef !2
  %406 = getelementptr inbounds i8, ptr %_742, i64 56
  %current_sol_volume = load i64, ptr %406, align 8, !noundef !2
  %407 = getelementptr inbounds i8, ptr %_742, i64 64
  %last_update_timestamp = load i64, ptr %407, align 8, !noundef !2
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_540)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_542)
  %408 = getelementptr inbounds i8, ptr %a, i64 376
  %_1115 = load ptr, ptr %408, align 8, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_542, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_1115) #28
; call pump_recovered::distribution::sharing_config_shareholders
  call void @_ZN14pump_recovered12distribution27sharing_config_shareholders17h0598193ba6e37d86E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_540, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_542) #28
  %409 = load i64, ptr %_540, align 8, !range !4888, !noundef !2
  %410 = getelementptr inbounds i8, ptr %_540, i64 8
  %_1118.0 = load i64, ptr %410, align 8
  %411 = getelementptr inbounds i8, ptr %_540, i64 16
  %_1118.1 = load ptr, ptr %411, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_540)
  switch i64 %409, label %bb403 [
    i64 -9223372036854775807, label %bb399
    i64 -9223372036854775808, label %bb401
  ]

bb395:                                            ; preds = %bb394
  %412 = getelementptr inbounds i8, ptr %_532, i64 8
  %_1111.sroa.0.0.copyload = load i64, ptr %412, align 8
  %_1111.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_532, i64 16
  %_1111.sroa.5.0.copyload = load i64, ptr %_1111.sroa.5.0..sroa_idx, align 8
  %_1111.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_532, i64 24
  %_1111.sroa.6.0.copyload = load i64, ptr %_1111.sroa.6.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_532)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_1113)
  store i64 %_1111.sroa.0.0.copyload, ptr %_1113, align 8
  %residual46.sroa.2.0._1113.sroa_idx = getelementptr inbounds i8, ptr %_1113, i64 8
  store i64 %_1111.sroa.5.0.copyload, ptr %residual46.sroa.2.0._1113.sroa_idx, align 8
  %residual46.sroa.3.0._1113.sroa_idx = getelementptr inbounds i8, ptr %_1113, i64 16
  store i64 %_1111.sroa.6.0.copyload, ptr %residual46.sroa.3.0._1113.sroa_idx, align 8
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %413 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17ha4865197be4b9a2fE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_1113) #28
  %_1114.0 = extractvalue { i64, ptr } %413, 0
  %_1114.1 = extractvalue { i64, ptr } %413, 1
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_1113)
  br label %bb229

bb399:                                            ; preds = %bb396
  %414 = getelementptr inbounds i8, ptr %_542, i64 8
  %_542.val = load ptr, ptr %414, align 8, !nonnull !2, !noundef !2
  %415 = getelementptr inbounds i8, ptr %_542, i64 16
  %_542.val252 = load ptr, ptr %415, align 8
  %self1.val.i.i.i442 = load i64, ptr %_542.val, align 8, !noundef !2
  %val.i.i.i443 = add i64 %self1.val.i.i.i442, -1
  store i64 %val.i.i.i443, ptr %_542.val, align 8
  %416 = icmp eq i64 %val.i.i.i443, 0
  br i1 %416, label %bb1.i.i.i450, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i444"

bb1.i.i.i450:                                     ; preds = %bb399
  %417 = getelementptr i8, ptr %_542.val, i64 8
  %self2.val.i.i.i451 = load i64, ptr %417, align 8, !noundef !2
  %val6.i.i.i452 = add i64 %self2.val.i.i.i451, -1
  store i64 %val6.i.i.i452, ptr %417, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i444"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i444": ; preds = %bb1.i.i.i450, %bb399
  %418 = icmp ne ptr %_542.val252, null
  call void @llvm.assume(i1 %418)
  %self1.val.i.i2.i445 = load i64, ptr %_542.val252, align 8, !noundef !2
  %val.i.i3.i446 = add i64 %self1.val.i.i2.i445, -1
  store i64 %val.i.i3.i446, ptr %_542.val252, align 8
  %419 = icmp eq i64 %val.i.i3.i446, 0
  br i1 %419, label %bb1.i.i4.i447, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit453"

bb1.i.i4.i447:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i444"
  %420 = getelementptr i8, ptr %_542.val252, i64 8
  %self2.val.i.i5.i448 = load i64, ptr %420, align 8, !noundef !2
  %val6.i.i6.i449 = add i64 %self2.val.i.i5.i448, -1
  store i64 %val6.i.i6.i449, ptr %420, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit453"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit453": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i444", %bb1.i.i4.i447
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_542)
  br label %bb229

bb403:                                            ; preds = %bb396
  %421 = ptrtoint ptr %_1118.1 to i64
  %422 = inttoptr i64 %_1118.0 to ptr
  br label %bb401

bb401:                                            ; preds = %bb396, %bb403
  %shareholders.sroa.0.0 = phi i64 [ %409, %bb403 ], [ 0, %bb396 ]
  %shareholders.sroa.6.0 = phi ptr [ %422, %bb403 ], [ inttoptr (i64 2 to ptr), %bb396 ]
  %shareholders.sroa.7.0 = phi i64 [ %421, %bb403 ], [ 0, %bb396 ]
  %423 = getelementptr inbounds i8, ptr %_542, i64 8
  %_542.val253 = load ptr, ptr %423, align 8, !nonnull !2, !noundef !2
  %424 = getelementptr inbounds i8, ptr %_542, i64 16
  %_542.val254 = load ptr, ptr %424, align 8
  %self1.val.i.i.i454 = load i64, ptr %_542.val253, align 8, !noundef !2
  %val.i.i.i455 = add i64 %self1.val.i.i.i454, -1
  store i64 %val.i.i.i455, ptr %_542.val253, align 8
  %425 = icmp eq i64 %val.i.i.i455, 0
  br i1 %425, label %bb1.i.i.i462, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i456"

bb1.i.i.i462:                                     ; preds = %bb401
  %426 = getelementptr i8, ptr %_542.val253, i64 8
  %self2.val.i.i.i463 = load i64, ptr %426, align 8, !noundef !2
  %val6.i.i.i464 = add i64 %self2.val.i.i.i463, -1
  store i64 %val6.i.i.i464, ptr %426, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i456"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i456": ; preds = %bb1.i.i.i462, %bb401
  %427 = icmp ne ptr %_542.val254, null
  call void @llvm.assume(i1 %427)
  %self1.val.i.i2.i457 = load i64, ptr %_542.val254, align 8, !noundef !2
  %val.i.i3.i458 = add i64 %self1.val.i.i2.i457, -1
  store i64 %val.i.i3.i458, ptr %_542.val254, align 8
  %428 = icmp eq i64 %val.i.i3.i458, 0
  br i1 %428, label %bb1.i.i4.i459, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit465"

bb1.i.i4.i459:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i456"
  %429 = getelementptr i8, ptr %_542.val254, i64 8
  %self2.val.i.i5.i460 = load i64, ptr %429, align 8, !noundef !2
  %val6.i.i6.i461 = add i64 %self2.val.i.i5.i460, -1
  store i64 %val6.i.i6.i461, ptr %429, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit465"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit465": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i456", %bb1.i.i4.i459
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_542)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_546)
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_546, i8 0, i64 32, i1 false)
  %430 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %quote_mint45, ptr noundef nonnull dereferenceable(32) %_546, i64 32)
  %431 = icmp eq i32 %430, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_546)
  call void @llvm.lifetime.start.p0(i64 424, ptr nonnull %ev)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_548)
  %_1126 = load ptr, ptr %208, align 8, !nonnull !2, !align !3, !noundef !2
  %_1127 = load ptr, ptr %_1126, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_548, ptr noundef nonnull align 1 dereferenceable(32) %_1127, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_549)
  %_746 = load ptr, ptr %311, align 8, !nonnull !2, !align !3, !noundef !2
  %432 = getelementptr inbounds i8, ptr %_746, i64 88
  %_1128 = load ptr, ptr %432, align 8, !nonnull !2, !align !3, !noundef !2
  %_1129 = load ptr, ptr %_1128, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_549, ptr noundef nonnull align 1 dereferenceable(32) %_1129, i64 32, i1 false)
  %_1206.sroa.0.0. = select i1 %431, i64 %_1206.sroa.0.0, i64 0
  %virtual_quote_reserves. = select i1 %431, i64 %virtual_quote_reserves, i64 0
  %real_quote_reserves. = select i1 %431, i64 %real_quote_reserves, i64 0
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_556)
  %_1130 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %_1131 = load ptr, ptr %_1130, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_556, ptr noundef nonnull align 1 dereferenceable(32) %_1131, i64 32, i1 false)
  %_747 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %433 = getelementptr inbounds i8, ptr %_747, i64 165
  %434 = load i8, ptr %433, align 1, !range !374, !noundef !2
  %_559.not = icmp eq i8 %434, 0
  %_558.sroa.0.0 = select i1 %_559.not, i64 0, i64 %_1200.sroa.0.0
  %_560.sroa.0.0 = select i1 %_559.not, i64 0, i64 %_1208.sroa.0.0
  %435 = getelementptr inbounds i8, ptr %_747, i64 163
  %436 = load i8, ptr %435, align 1, !range !374, !noundef !2
  %_563.not = icmp eq i8 %436, 0
  %_562.sroa.0.0 = select i1 %_563.not, i64 %_1200.sroa.0.0, i64 0
  %_564.sroa.0.0 = select i1 %_563.not, i64 %_1208.sroa.0.0, i64 0
  %437 = load i64, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !4984, !noundef !2
  %438 = icmp eq i64 %437, 0
  %439 = call i64 @llvm.usub.sat.i64(i64 %437, i64 18)
  %440 = select i1 %438, i64 12884934638, i64 %439
  %_15.i.i.i.i.i10.i.i = icmp ult i64 %440, 12884901896
  br i1 %_15.i.i.i.i.i10.i.i, label %bb3.i467, label %"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17h5877c2531c2f4030E.exit"

bb3.i467:                                         ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit465"
; call alloc::raw_vec::handle_error
  call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef 1, i64 18) #29, !noalias !4990
  unreachable

"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17h5877c2531c2f4030E.exit": ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit465"
  store i64 %440, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !4984
  %441 = inttoptr i64 %440 to ptr
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(18) %441, ptr noundef nonnull align 1 dereferenceable(18) @alloc_435cd7fec56ec5d48bfe9f58bddc4b9c, i64 18, i1 false), !noalias !4991
  %_751 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %442 = getelementptr inbounds i8, ptr %_751, i64 162
  %443 = load i8, ptr %442, align 2, !range !374, !noundef !2
  %444 = getelementptr inbounds i8, ptr %_751, i64 163
  %445 = load i8, ptr %444, align 1, !range !374, !noundef !2
  %_570.not = icmp eq i8 %445, 0
  %_569.sroa.0.0 = select i1 %_570.not, i64 0, i64 %_1200.sroa.0.0
  %_571.sroa.0.0 = select i1 %_570.not, i64 0, i64 %_1208.sroa.0.0
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_575)
; call pump_recovered::transfer_fee_recovered::post_fee_amount
  call void @_ZN14pump_recovered22transfer_fee_recovered15post_fee_amount17heb3a7c4edb5d51ecE(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_575, ptr noalias noundef nonnull readonly align 8 dereferenceable(32) %transfer_fee, i64 noundef %_497.0) #28
  %446 = load i64, ptr %_575, align 8, !range !318, !noundef !2
  %447 = icmp eq i64 %446, 2
  %448 = getelementptr inbounds i8, ptr %_575, i64 8
  br i1 %447, label %bb408, label %bb407

bb408:                                            ; preds = %"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17h5877c2531c2f4030E.exit"
  %_1135 = load i64, ptr %448, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_575)
  %_754 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %449 = getelementptr inbounds i8, ptr %_754, i64 162
  %450 = load i8, ptr %449, align 2, !range !374, !noundef !2
  %_580.not = icmp eq i8 %450, 0
  br i1 %_580.not, label %bb188, label %bb189

bb407:                                            ; preds = %"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17h5877c2531c2f4030E.exit"
  %_1136.1 = load ptr, ptr %448, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_575)
  %451 = icmp eq i64 %shareholders.sroa.0.0, 0
  br i1 %451, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit", label %bb2.i.i.i

bb2.i.i.i:                                        ; preds = %bb407
  %452 = icmp ne ptr %shareholders.sroa.6.0, null
  call void @llvm.assume(i1 %452)
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit": ; preds = %bb407, %bb2.i.i.i
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_556)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_549)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_548)
  br label %bb226

bb188:                                            ; preds = %bb408
  %_755 = load ptr, ptr %31, align 8, !nonnull !2, !align !3, !noundef !2
  %453 = getelementptr inbounds i8, ptr %_755, i64 1056
  %454 = load i64, ptr %453, align 8, !noundef !2
  br label %bb189

bb189:                                            ; preds = %bb408, %bb188
  %_579.sroa.0.0 = phi i64 [ %454, %bb188 ], [ 0, %bb408 ]
  %455 = getelementptr inbounds i8, ptr %ev, i64 328
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %455, ptr noundef nonnull align 1 dereferenceable(32) %quote_mint45, i64 32, i1 false)
  %456 = getelementptr inbounds i8, ptr %_754, i64 120
  %_582 = load i64, ptr %456, align 8, !noundef !2
  %457 = getelementptr inbounds i8, ptr %ev, i64 48
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %457, ptr noundef nonnull align 1 dereferenceable(32) %_549, i64 32, i1 false)
  %458 = getelementptr inbounds i8, ptr %ev, i64 80
  store i64 %_1206.sroa.0.0., ptr %458, align 8
  %459 = getelementptr inbounds i8, ptr %ev, i64 88
  store i64 %_1205.sroa.0.0, ptr %459, align 8
  %460 = getelementptr inbounds i8, ptr %ev, i64 416
  store i8 1, ptr %460, align 8
  %461 = getelementptr inbounds i8, ptr %ev, i64 96
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %461, ptr noundef nonnull align 1 dereferenceable(32) %_548, i64 32, i1 false)
  %462 = getelementptr inbounds i8, ptr %ev, i64 128
  store i64 %_1110.sroa.8.0.copyload, ptr %462, align 8
  %463 = getelementptr inbounds i8, ptr %ev, i64 136
  store i64 %virtual_quote_reserves., ptr %463, align 8
  %464 = getelementptr inbounds i8, ptr %ev, i64 144
  store i64 %virtual_token_reserves, ptr %464, align 8
  %465 = getelementptr inbounds i8, ptr %ev, i64 152
  store i64 %real_quote_reserves., ptr %465, align 8
  %466 = getelementptr inbounds i8, ptr %ev, i64 160
  store i64 %real_token_reserves, ptr %466, align 8
  %467 = getelementptr inbounds i8, ptr %ev, i64 168
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %467, ptr noundef nonnull align 1 dereferenceable(32) %_556, i64 32, i1 false)
  %468 = getelementptr inbounds i8, ptr %ev, i64 200
  store i64 %_1199.sroa.0.0, ptr %468, align 8
  %469 = getelementptr inbounds i8, ptr %ev, i64 208
  store i64 %_1207.sroa.0.0, ptr %469, align 8
  %470 = getelementptr inbounds i8, ptr %ev, i64 216
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %470, ptr noundef nonnull align 1 dereferenceable(32) %creator, i64 32, i1 false)
  %471 = getelementptr inbounds i8, ptr %ev, i64 248
  store i64 %_562.sroa.0.0, ptr %471, align 8
  %472 = getelementptr inbounds i8, ptr %ev, i64 256
  store i64 %_564.sroa.0.0, ptr %472, align 8
  %473 = getelementptr inbounds i8, ptr %ev, i64 417
  store i8 0, ptr %473, align 1
  %474 = getelementptr inbounds i8, ptr %ev, i64 264
  store i64 %total_unclaimed_tokens, ptr %474, align 8
  %475 = getelementptr inbounds i8, ptr %ev, i64 272
  store i64 %total_claimed_tokens, ptr %475, align 8
  %476 = getelementptr inbounds i8, ptr %ev, i64 280
  store i64 %current_sol_volume, ptr %476, align 8
  %477 = getelementptr inbounds i8, ptr %ev, i64 288
  store i64 %last_update_timestamp, ptr %477, align 8
  store i64 18, ptr %ev, align 8
  %_566.sroa.6.0.ev.sroa_idx = getelementptr inbounds i8, ptr %ev, i64 8
  store ptr %441, ptr %_566.sroa.6.0.ev.sroa_idx, align 8
  %_566.sroa.7.0.ev.sroa_idx = getelementptr inbounds i8, ptr %ev, i64 16
  store i64 18, ptr %_566.sroa.7.0.ev.sroa_idx, align 8
  %478 = getelementptr inbounds i8, ptr %ev, i64 418
  store i8 %443, ptr %478, align 2
  %479 = getelementptr inbounds i8, ptr %ev, i64 296
  store i64 %_569.sroa.0.0, ptr %479, align 8
  %480 = getelementptr inbounds i8, ptr %ev, i64 304
  store i64 %_571.sroa.0.0, ptr %480, align 8
  %481 = getelementptr inbounds i8, ptr %ev, i64 312
  store i64 %_579.sroa.0.0, ptr %481, align 8
  %482 = getelementptr inbounds i8, ptr %ev, i64 320
  store i64 %_1135, ptr %482, align 8
  %483 = getelementptr inbounds i8, ptr %ev, i64 24
  store i64 %shareholders.sroa.0.0, ptr %483, align 8
  %_573.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %ev, i64 32
  store ptr %shareholders.sroa.6.0, ptr %_573.sroa.6.0..sroa_idx, align 8
  %_573.sroa.8.0..sroa_idx = getelementptr inbounds i8, ptr %ev, i64 40
  store i64 %shareholders.sroa.7.0, ptr %_573.sroa.8.0..sroa_idx, align 8
  %484 = getelementptr inbounds i8, ptr %ev, i64 360
  store i64 %_1206.sroa.0.0, ptr %484, align 8
  %485 = getelementptr inbounds i8, ptr %ev, i64 368
  store i64 %virtual_quote_reserves, ptr %485, align 8
  %486 = getelementptr inbounds i8, ptr %ev, i64 376
  store i64 %real_quote_reserves, ptr %486, align 8
  %487 = getelementptr inbounds i8, ptr %ev, i64 384
  store i64 %_558.sroa.0.0, ptr %487, align 8
  %488 = getelementptr inbounds i8, ptr %ev, i64 392
  store i64 %_560.sroa.0.0, ptr %488, align 8
  %489 = getelementptr inbounds i8, ptr %ev, i64 400
  store i64 %_582, ptr %489, align 8
  %490 = getelementptr inbounds i8, ptr %ev, i64 408
  store i64 %_1038, ptr %490, align 8
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_556)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_549)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_548)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_586)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_588)
; call <pump_recovered::TradeEvent as anchor_lang::Event>::data
  call void @"_ZN65_$LT$pump_recovered..TradeEvent$u20$as$u20$anchor_lang..Event$GT$4data17h7a38b5dd8a5f6b5dE"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_588, ptr noalias noundef nonnull readonly align 8 dereferenceable(424) %ev) #28
  %491 = getelementptr inbounds i8, ptr %_588, i64 8
  %_1141 = load ptr, ptr %491, align 8, !nonnull !2, !noundef !2
  %492 = getelementptr inbounds i8, ptr %_588, i64 16
  %_1140 = load i64, ptr %492, align 8, !noundef !2
  store ptr %_1141, ptr %_586, align 8
  %493 = getelementptr inbounds i8, ptr %_586, i64 8
  store i64 %_1140, ptr %493, align 8
; call solana_program::log::sol_log_data
  call void @_ZN14solana_program3log12sol_log_data17h1e024b73f122854fE(ptr noalias noundef nonnull readonly align 8 %_586, i64 noundef 1) #28
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_588)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_586)
  %_591 = getelementptr inbounds i8, ptr %a, i64 192
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %authority_info, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_591) #28
  %494 = getelementptr inbounds i8, ptr %ctx, i64 44
  %authority_bump = load i8, ptr %494, align 4, !noundef !2
; call <pump_recovered::TradeEvent as anchor_lang::Event>::data
  call void @"_ZN65_$LT$pump_recovered..TradeEvent$u20$as$u20$anchor_lang..Event$GT$4data17h7a38b5dd8a5f6b5dE"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %inner_data, ptr noalias noundef nonnull readonly align 8 dereferenceable(424) %ev) #28
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %ix_data)
  %me.sroa.0.0.copyload.i = load i64, ptr %inner_data, align 8, !alias.scope !4992, !noalias !4995
  %me.sroa.4.0.self.sroa_idx.i = getelementptr inbounds i8, ptr %inner_data, i64 8
  %me.sroa.4.0.copyload.i = load ptr, ptr %me.sroa.4.0.self.sroa_idx.i, align 8, !alias.scope !4992, !noalias !4995, !nonnull !2, !noundef !2
  %me.sroa.5.0.self.sroa_idx.i = getelementptr inbounds i8, ptr %inner_data, i64 16
  %me.sroa.5.0.copyload.i = load i64, ptr %me.sroa.5.0.self.sroa_idx.i, align 8, !alias.scope !4992, !noalias !4995
  %_18.i = getelementptr inbounds i8, ptr %me.sroa.4.0.copyload.i, i64 %me.sroa.5.0.copyload.i
  %495 = getelementptr inbounds i8, ptr %_597, i64 32
  store ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, ptr %495, align 8
  %496 = getelementptr inbounds i8, ptr %_597, i64 40
  store ptr getelementptr inbounds (<{ [8 x i8] }>, ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, i64 1, i32 0, i64 0), ptr %496, align 8
  store ptr %me.sroa.4.0.copyload.i, ptr %_597, align 8
  %_1151.sroa.4.0._597.sroa_idx = getelementptr inbounds i8, ptr %_597, i64 8
  store ptr %me.sroa.4.0.copyload.i, ptr %_1151.sroa.4.0._597.sroa_idx, align 8
  %_1151.sroa.5.0._597.sroa_idx = getelementptr inbounds i8, ptr %_597, i64 16
  store i64 %me.sroa.0.0.copyload.i, ptr %_1151.sroa.5.0._597.sroa_idx, align 8
  %_1151.sroa.6.0._597.sroa_idx = getelementptr inbounds i8, ptr %_597, i64 24
  store ptr %_18.i, ptr %_1151.sroa.6.0._597.sroa_idx, align 8
; call <alloc::vec::Vec<T> as alloc::vec::spec_from_iter::SpecFromIter<T,I>>::from_iter
  call fastcc void @"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h0206225007577adeE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %ix_data, ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_597) #28
  call void @llvm.lifetime.start.p0(i64 80, ptr nonnull %ix)
  %497 = getelementptr inbounds i8, ptr %ix_data, i64 8
  %_1154 = load ptr, ptr %497, align 8, !nonnull !2, !noundef !2
  %498 = getelementptr inbounds i8, ptr %ix_data, i64 16
  %_1153 = load i64, ptr %498, align 8, !noundef !2
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_605)
; call alloc::alloc::exchange_malloc
  %_607 = call fastcc noundef ptr @_ZN5alloc5alloc15exchange_malloc17h6cd8dd11b0e3424eE(i64 noundef 34, i64 noundef 1) #28
  %_757 = load ptr, ptr %authority_info, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memmove.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_607, ptr noundef nonnull align 1 dereferenceable(32) %_757, i64 32, i1 false)
  %_609.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_607, i64 32
  store i8 1, ptr %_609.sroa.4.0..sroa_idx, align 1
  %_609.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_607, i64 33
  store i8 0, ptr %_609.sroa.5.0..sroa_idx, align 1
  store i64 1, ptr %_605, align 8, !alias.scope !4997, !noalias !5000
  %499 = getelementptr inbounds i8, ptr %_605, i64 8
  store ptr %_607, ptr %499, align 8, !alias.scope !4997, !noalias !5000
  %500 = getelementptr inbounds i8, ptr %_605, i64 16
  store i64 1, ptr %500, align 8, !alias.scope !4997, !noalias !5000
; call solana_instruction::Instruction::new_with_bytes
  call void @_ZN18solana_instruction11Instruction14new_with_bytes17h836fab8fb6401158E(ptr noalias nocapture noundef nonnull sret([80 x i8]) align 8 dereferenceable(80) %ix, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) @_ZN14pump_recovered2ID17h1dbc648cb2b8dc7eE, ptr noalias noundef nonnull readonly align 1 %_1154, i64 noundef %_1153, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_605) #28
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_605)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_617)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %_617, ptr noundef nonnull align 8 dereferenceable(48) %authority_info, i64 48, i1 false)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_620)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_623)
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %_627)
  store i8 %authority_bump, ptr %_627, align 1
  store ptr @alloc_7a7952b5e0d15f2b72d0341cef6d4739, ptr %_623, align 8
  %501 = getelementptr inbounds i8, ptr %_623, i64 8
  store i64 17, ptr %501, align 8
  %502 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_623, i64 0, i64 1
  store ptr %_627, ptr %502, align 8
  %503 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_623, i64 0, i64 1, i32 1
  store i64 1, ptr %503, align 8
  store ptr %_623, ptr %_620, align 8
  %504 = getelementptr inbounds i8, ptr %_620, i64 8
  store i64 2, ptr %504, align 8
; call solana_program::program::invoke_signed
  call void @_ZN14solana_program7program13invoke_signed17h01c3b84bc1fc491eE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_613, ptr noalias noundef nonnull readonly align 8 dereferenceable(80) %ix, ptr noalias noundef nonnull readonly align 8 %_617, i64 noundef 1, ptr noalias noundef nonnull readonly align 8 %_620, i64 noundef 1) #28
  %505 = load i64, ptr %_613, align 8, !range !366, !noundef !2
  %506 = icmp eq i64 %505, -9223372036854775782
  br i1 %506, label %bb413, label %bb412

bb413:                                            ; preds = %bb189
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_627)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_623)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_620)
  %507 = getelementptr inbounds i8, ptr %_617, i64 8
  %_617.val282 = load ptr, ptr %507, align 8, !nonnull !2, !noundef !2
  %508 = getelementptr inbounds i8, ptr %_617, i64 16
  %_617.val283 = load ptr, ptr %508, align 8
  %self1.val.i.i.i.i = load i64, ptr %_617.val282, align 8, !noundef !2
  %val.i.i.i.i = add i64 %self1.val.i.i.i.i, -1
  store i64 %val.i.i.i.i, ptr %_617.val282, align 8
  %509 = icmp eq i64 %val.i.i.i.i, 0
  br i1 %509, label %bb1.i.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i"

bb1.i.i.i.i:                                      ; preds = %bb413
  %510 = getelementptr i8, ptr %_617.val282, i64 8
  %self2.val.i.i.i.i = load i64, ptr %510, align 8, !noundef !2
  %val6.i.i.i.i = add i64 %self2.val.i.i.i.i, -1
  store i64 %val6.i.i.i.i, ptr %510, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i": ; preds = %bb1.i.i.i.i, %bb413
  %511 = icmp ne ptr %_617.val283, null
  call void @llvm.assume(i1 %511)
  %self1.val.i.i2.i.i = load i64, ptr %_617.val283, align 8, !noundef !2
  %val.i.i3.i.i = add i64 %self1.val.i.i2.i.i, -1
  store i64 %val.i.i3.i.i, ptr %_617.val283, align 8
  %512 = icmp eq i64 %val.i.i3.i.i, 0
  br i1 %512, label %bb1.i.i4.i.i, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit"

bb1.i.i4.i.i:                                     ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i"
  %513 = getelementptr i8, ptr %_617.val283, i64 8
  %self2.val.i.i5.i.i = load i64, ptr %513, align 8, !noundef !2
  %val6.i.i6.i.i = add i64 %self2.val.i.i5.i.i, -1
  store i64 %val6.i.i6.i.i, ptr %513, align 8
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i", %bb1.i.i4.i.i
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_617)
  %_1.val.i468 = load i64, ptr %ix, align 8, !alias.scope !5002, !noundef !2
  %514 = icmp eq i64 %_1.val.i468, 0
  br i1 %514, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i", label %bb2.i.i.i.i

bb2.i.i.i.i:                                      ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit"
  %515 = getelementptr inbounds i8, ptr %ix, i64 8
  %_1.val2.i = load ptr, ptr %515, align 8, !alias.scope !5002
  %516 = icmp ne ptr %_1.val2.i, null
  call void @llvm.assume(i1 %516)
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i": ; preds = %bb2.i.i.i.i, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit"
  %517 = getelementptr inbounds i8, ptr %ix, i64 24
  %.val.i = load i64, ptr %517, align 8, !alias.scope !5002, !noundef !2
  %518 = icmp eq i64 %.val.i, 0
  br i1 %518, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i469"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i469": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i"
  %519 = getelementptr inbounds i8, ptr %ix, i64 32
  %.val1.i = load ptr, ptr %519, align 8, !alias.scope !5002
  %520 = icmp ne ptr %.val1.i, null
  call void @llvm.assume(i1 %520)
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i469"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data)
  %_758 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %521 = getelementptr inbounds i8, ptr %_758, i64 88
  %_629 = load i64, ptr %521, align 8, !noundef !2
  %522 = icmp eq i64 %_629, 0
  br i1 %522, label %bb201, label %bb214

bb412:                                            ; preds = %bb189
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %523 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17ha4865197be4b9a2fE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_613) #28
  %_1159.0 = extractvalue { i64, ptr } %523, 0
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_627)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_623)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_620)
  %524 = getelementptr inbounds i8, ptr %_617, i64 8
  %_617.val = load ptr, ptr %524, align 8, !nonnull !2, !noundef !2
  %525 = getelementptr inbounds i8, ptr %_617, i64 16
  %_617.val278 = load ptr, ptr %525, align 8
  %self1.val.i.i.i.i472 = load i64, ptr %_617.val, align 8, !noundef !2
  %val.i.i.i.i473 = add i64 %self1.val.i.i.i.i472, -1
  store i64 %val.i.i.i.i473, ptr %_617.val, align 8
  %526 = icmp eq i64 %val.i.i.i.i473, 0
  br i1 %526, label %bb1.i.i.i.i480, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i474"

bb1.i.i.i.i480:                                   ; preds = %bb412
  %527 = getelementptr i8, ptr %_617.val, i64 8
  %self2.val.i.i.i.i481 = load i64, ptr %527, align 8, !noundef !2
  %val6.i.i.i.i482 = add i64 %self2.val.i.i.i.i481, -1
  store i64 %val6.i.i.i.i482, ptr %527, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i474"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i474": ; preds = %bb1.i.i.i.i480, %bb412
  %528 = icmp ne ptr %_617.val278, null
  call void @llvm.assume(i1 %528)
  %self1.val.i.i2.i.i475 = load i64, ptr %_617.val278, align 8, !noundef !2
  %val.i.i3.i.i476 = add i64 %self1.val.i.i2.i.i475, -1
  store i64 %val.i.i3.i.i476, ptr %_617.val278, align 8
  %529 = icmp eq i64 %val.i.i3.i.i476, 0
  br i1 %529, label %bb1.i.i4.i.i477, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit483"

bb1.i.i4.i.i477:                                  ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i474"
  %530 = getelementptr i8, ptr %_617.val278, i64 8
  %self2.val.i.i5.i.i478 = load i64, ptr %530, align 8, !noundef !2
  %val6.i.i6.i.i479 = add i64 %self2.val.i.i5.i.i478, -1
  store i64 %val6.i.i6.i.i479, ptr %530, align 8
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit483"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit483": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i474", %bb1.i.i4.i.i477
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_617)
  %_1.val.i484 = load i64, ptr %ix, align 8, !alias.scope !5005, !noundef !2
  %531 = icmp eq i64 %_1.val.i484, 0
  br i1 %531, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i487", label %bb2.i.i.i.i485

bb2.i.i.i.i485:                                   ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit483"
  %532 = getelementptr inbounds i8, ptr %ix, i64 8
  %_1.val2.i486 = load ptr, ptr %532, align 8, !alias.scope !5005
  %533 = icmp ne ptr %_1.val2.i486, null
  call void @llvm.assume(i1 %533)
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i487"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i487": ; preds = %bb2.i.i.i.i485, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit483"
  %534 = getelementptr inbounds i8, ptr %ix, i64 24
  %.val.i488 = load i64, ptr %534, align 8, !alias.scope !5005, !noundef !2
  %535 = icmp eq i64 %.val.i488, 0
  br i1 %535, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit491", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i489"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i489": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i487"
  %536 = getelementptr inbounds i8, ptr %ix, i64 32
  %.val1.i490 = load ptr, ptr %536, align 8, !alias.scope !5005
  %537 = icmp ne ptr %.val1.i490, null
  call void @llvm.assume(i1 %537)
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit491"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit491": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i487", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i489"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data)
  br label %bb223

bb201:                                            ; preds = %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit"
  %538 = getelementptr inbounds i8, ptr %_758, i64 161
  store i8 1, ptr %538, align 1
  call void @llvm.lifetime.start.p0(i64 136, ptr nonnull %event)
  %_760 = load ptr, ptr %311, align 8, !nonnull !2, !align !3, !noundef !2
  %539 = getelementptr inbounds i8, ptr %_760, i64 88
  %_1164 = load ptr, ptr %539, align 8, !nonnull !2, !align !3, !noundef !2
  %_1165 = load ptr, ptr %_1164, align 8, !nonnull !2, !align !372, !noundef !2
  %540 = getelementptr inbounds i8, ptr %event, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %540, ptr noundef nonnull align 1 dereferenceable(32) %_1165, i64 32, i1 false)
  %_1166 = load ptr, ptr %208, align 8, !nonnull !2, !align !3, !noundef !2
  %_1167 = load ptr, ptr %_1166, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %event, ptr noundef nonnull align 1 dereferenceable(32) %_1167, i64 32, i1 false)
  %_761 = load ptr, ptr %3, align 8, !nonnull !2, !align !3, !noundef !2
  %_1168 = load ptr, ptr %_761, align 8, !nonnull !2, !align !3, !noundef !2
  %_1169 = load ptr, ptr %_1168, align 8, !nonnull !2, !align !372, !noundef !2
  %541 = getelementptr inbounds i8, ptr %event, i64 64
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %541, ptr noundef nonnull align 1 dereferenceable(32) %_1169, i64 32, i1 false)
  %542 = getelementptr inbounds i8, ptr %_761, i64 40
  %543 = getelementptr inbounds i8, ptr %event, i64 96
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %543, ptr noundef nonnull align 8 dereferenceable(32) %542, i64 32, i1 false)
  %544 = getelementptr inbounds i8, ptr %event, i64 128
  store i64 %_1110.sroa.8.0.copyload, ptr %544, align 8
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_638)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_640)
; call <pump_recovered::trade_types::CompleteEvent as anchor_lang::Event>::data
  call void @"_ZN81_$LT$pump_recovered..trade_types..CompleteEvent$u20$as$u20$anchor_lang..Event$GT$4data17h38908a6b4286bca9E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_640, ptr noalias noundef nonnull readonly align 8 dereferenceable(136) %event) #28
  %545 = getelementptr inbounds i8, ptr %_640, i64 8
  %_1172 = load ptr, ptr %545, align 8, !nonnull !2, !noundef !2
  %546 = getelementptr inbounds i8, ptr %_640, i64 16
  %_1171 = load i64, ptr %546, align 8, !noundef !2
  store ptr %_1172, ptr %_638, align 8
  %547 = getelementptr inbounds i8, ptr %_638, i64 8
  store i64 %_1171, ptr %547, align 8
; call solana_program::log::sol_log_data
  call void @_ZN14solana_program3log12sol_log_data17h1e024b73f122854fE(ptr noalias noundef nonnull readonly align 8 %_638, i64 noundef 1) #28
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_640)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_638)
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %authority_info51, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_591) #28
; call <pump_recovered::trade_types::CompleteEvent as anchor_lang::Event>::data
  call void @"_ZN81_$LT$pump_recovered..trade_types..CompleteEvent$u20$as$u20$anchor_lang..Event$GT$4data17h38908a6b4286bca9E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %inner_data52, ptr noalias noundef nonnull readonly align 8 dereferenceable(136) %event) #28
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %ix_data53)
  %me.sroa.0.0.copyload.i496 = load i64, ptr %inner_data52, align 8, !alias.scope !5008, !noalias !5011
  %me.sroa.4.0.self.sroa_idx.i497 = getelementptr inbounds i8, ptr %inner_data52, i64 8
  %me.sroa.4.0.copyload.i498 = load ptr, ptr %me.sroa.4.0.self.sroa_idx.i497, align 8, !alias.scope !5008, !noalias !5011, !nonnull !2, !noundef !2
  %me.sroa.5.0.self.sroa_idx.i499 = getelementptr inbounds i8, ptr %inner_data52, i64 16
  %me.sroa.5.0.copyload.i500 = load i64, ptr %me.sroa.5.0.self.sroa_idx.i499, align 8, !alias.scope !5008, !noalias !5011
  %_18.i501 = getelementptr inbounds i8, ptr %me.sroa.4.0.copyload.i498, i64 %me.sroa.5.0.copyload.i500
  %548 = getelementptr inbounds i8, ptr %_647, i64 32
  store ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, ptr %548, align 8
  %549 = getelementptr inbounds i8, ptr %_647, i64 40
  store ptr getelementptr inbounds (<{ [8 x i8] }>, ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, i64 1, i32 0, i64 0), ptr %549, align 8
  store ptr %me.sroa.4.0.copyload.i498, ptr %_647, align 8
  %_1182.sroa.4.0._647.sroa_idx = getelementptr inbounds i8, ptr %_647, i64 8
  store ptr %me.sroa.4.0.copyload.i498, ptr %_1182.sroa.4.0._647.sroa_idx, align 8
  %_1182.sroa.5.0._647.sroa_idx = getelementptr inbounds i8, ptr %_647, i64 16
  store i64 %me.sroa.0.0.copyload.i496, ptr %_1182.sroa.5.0._647.sroa_idx, align 8
  %_1182.sroa.6.0._647.sroa_idx = getelementptr inbounds i8, ptr %_647, i64 24
  store ptr %_18.i501, ptr %_1182.sroa.6.0._647.sroa_idx, align 8
; call <alloc::vec::Vec<T> as alloc::vec::spec_from_iter::SpecFromIter<T,I>>::from_iter
  call fastcc void @"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h0206225007577adeE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %ix_data53, ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_647) #28
  call void @llvm.lifetime.start.p0(i64 80, ptr nonnull %ix54)
  %550 = getelementptr inbounds i8, ptr %ix_data53, i64 8
  %_1185 = load ptr, ptr %550, align 8, !nonnull !2, !noundef !2
  %551 = getelementptr inbounds i8, ptr %ix_data53, i64 16
  %_1184 = load i64, ptr %551, align 8, !noundef !2
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_653)
; call alloc::alloc::exchange_malloc
  %_655 = call fastcc noundef ptr @_ZN5alloc5alloc15exchange_malloc17h6cd8dd11b0e3424eE(i64 noundef 34, i64 noundef 1) #28
  %_763 = load ptr, ptr %authority_info51, align 8, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memmove.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_655, ptr noundef nonnull align 1 dereferenceable(32) %_763, i64 32, i1 false)
  %_657.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_655, i64 32
  store i8 1, ptr %_657.sroa.4.0..sroa_idx, align 1
  %_657.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_655, i64 33
  store i8 0, ptr %_657.sroa.5.0..sroa_idx, align 1
  store i64 1, ptr %_653, align 8, !alias.scope !5013, !noalias !5016
  %552 = getelementptr inbounds i8, ptr %_653, i64 8
  store ptr %_655, ptr %552, align 8, !alias.scope !5013, !noalias !5016
  %553 = getelementptr inbounds i8, ptr %_653, i64 16
  store i64 1, ptr %553, align 8, !alias.scope !5013, !noalias !5016
; call solana_instruction::Instruction::new_with_bytes
  call void @_ZN18solana_instruction11Instruction14new_with_bytes17h836fab8fb6401158E(ptr noalias nocapture noundef nonnull sret([80 x i8]) align 8 dereferenceable(80) %ix54, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) @_ZN14pump_recovered2ID17h1dbc648cb2b8dc7eE, ptr noalias noundef nonnull readonly align 1 %_1185, i64 noundef %_1184, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_653) #28
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_653)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_665)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %_665, ptr noundef nonnull align 8 dereferenceable(48) %authority_info51, i64 48, i1 false)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_668)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_671)
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %_675)
  store i8 %authority_bump, ptr %_675, align 1
  store ptr @alloc_7a7952b5e0d15f2b72d0341cef6d4739, ptr %_671, align 8
  %554 = getelementptr inbounds i8, ptr %_671, i64 8
  store i64 17, ptr %554, align 8
  %555 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_671, i64 0, i64 1
  store ptr %_675, ptr %555, align 8
  %556 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_671, i64 0, i64 1, i32 1
  store i64 1, ptr %556, align 8
  store ptr %_671, ptr %_668, align 8
  %557 = getelementptr inbounds i8, ptr %_668, i64 8
  store i64 2, ptr %557, align 8
; call solana_program::program::invoke_signed
  call void @_ZN14solana_program7program13invoke_signed17h01c3b84bc1fc491eE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_661, ptr noalias noundef nonnull readonly align 8 dereferenceable(80) %ix54, ptr noalias noundef nonnull readonly align 8 %_665, i64 noundef 1, ptr noalias noundef nonnull readonly align 8 %_668, i64 noundef 1) #28
  %558 = load i64, ptr %_661, align 8, !range !366, !noundef !2
  %559 = icmp eq i64 %558, -9223372036854775782
  br i1 %559, label %bb419, label %bb418

bb419:                                            ; preds = %bb201
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_675)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_671)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_668)
  %560 = getelementptr inbounds i8, ptr %_665, i64 8
  %_665.val280 = load ptr, ptr %560, align 8, !nonnull !2, !noundef !2
  %561 = getelementptr inbounds i8, ptr %_665, i64 16
  %_665.val281 = load ptr, ptr %561, align 8
  %self1.val.i.i.i.i502 = load i64, ptr %_665.val280, align 8, !noundef !2
  %val.i.i.i.i503 = add i64 %self1.val.i.i.i.i502, -1
  store i64 %val.i.i.i.i503, ptr %_665.val280, align 8
  %562 = icmp eq i64 %val.i.i.i.i503, 0
  br i1 %562, label %bb1.i.i.i.i510, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i504"

bb1.i.i.i.i510:                                   ; preds = %bb419
  %563 = getelementptr i8, ptr %_665.val280, i64 8
  %self2.val.i.i.i.i511 = load i64, ptr %563, align 8, !noundef !2
  %val6.i.i.i.i512 = add i64 %self2.val.i.i.i.i511, -1
  store i64 %val6.i.i.i.i512, ptr %563, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i504"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i504": ; preds = %bb1.i.i.i.i510, %bb419
  %564 = icmp ne ptr %_665.val281, null
  call void @llvm.assume(i1 %564)
  %self1.val.i.i2.i.i505 = load i64, ptr %_665.val281, align 8, !noundef !2
  %val.i.i3.i.i506 = add i64 %self1.val.i.i2.i.i505, -1
  store i64 %val.i.i3.i.i506, ptr %_665.val281, align 8
  %565 = icmp eq i64 %val.i.i3.i.i506, 0
  br i1 %565, label %bb1.i.i4.i.i507, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit513"

bb1.i.i4.i.i507:                                  ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i504"
  %566 = getelementptr i8, ptr %_665.val281, i64 8
  %self2.val.i.i5.i.i508 = load i64, ptr %566, align 8, !noundef !2
  %val6.i.i6.i.i509 = add i64 %self2.val.i.i5.i.i508, -1
  store i64 %val6.i.i6.i.i509, ptr %566, align 8
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit513"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit513": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i504", %bb1.i.i4.i.i507
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_665)
  %_1.val.i514 = load i64, ptr %ix54, align 8, !alias.scope !5018, !noundef !2
  %567 = icmp eq i64 %_1.val.i514, 0
  br i1 %567, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i517", label %bb2.i.i.i.i515

bb2.i.i.i.i515:                                   ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit513"
  %568 = getelementptr inbounds i8, ptr %ix54, i64 8
  %_1.val2.i516 = load ptr, ptr %568, align 8, !alias.scope !5018
  %569 = icmp ne ptr %_1.val2.i516, null
  call void @llvm.assume(i1 %569)
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i517"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i517": ; preds = %bb2.i.i.i.i515, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit513"
  %570 = getelementptr inbounds i8, ptr %ix54, i64 24
  %.val.i518 = load i64, ptr %570, align 8, !alias.scope !5018, !noundef !2
  %571 = icmp eq i64 %.val.i518, 0
  br i1 %571, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit521", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i519"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i519": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i517"
  %572 = getelementptr inbounds i8, ptr %ix54, i64 32
  %.val1.i520 = load ptr, ptr %572, align 8, !alias.scope !5018
  %573 = icmp ne ptr %.val1.i520, null
  call void @llvm.assume(i1 %573)
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit521"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit521": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i517", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i519"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix54)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data53)
  call void @llvm.lifetime.end.p0(i64 136, ptr nonnull %event)
  %_764.pre = load ptr, ptr %3, align 8
  br label %bb214

bb418:                                            ; preds = %bb201
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %574 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17ha4865197be4b9a2fE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_661) #28
  %_1190.0 = extractvalue { i64, ptr } %574, 0
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_675)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_671)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_668)
  %575 = getelementptr inbounds i8, ptr %_665, i64 8
  %_665.val = load ptr, ptr %575, align 8, !nonnull !2, !noundef !2
  %576 = getelementptr inbounds i8, ptr %_665, i64 16
  %_665.val279 = load ptr, ptr %576, align 8
  %self1.val.i.i.i.i524 = load i64, ptr %_665.val, align 8, !noundef !2
  %val.i.i.i.i525 = add i64 %self1.val.i.i.i.i524, -1
  store i64 %val.i.i.i.i525, ptr %_665.val, align 8
  %577 = icmp eq i64 %val.i.i.i.i525, 0
  br i1 %577, label %bb1.i.i.i.i532, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i526"

bb1.i.i.i.i532:                                   ; preds = %bb418
  %578 = getelementptr i8, ptr %_665.val, i64 8
  %self2.val.i.i.i.i533 = load i64, ptr %578, align 8, !noundef !2
  %val6.i.i.i.i534 = add i64 %self2.val.i.i.i.i533, -1
  store i64 %val6.i.i.i.i534, ptr %578, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i526"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i526": ; preds = %bb1.i.i.i.i532, %bb418
  %579 = icmp ne ptr %_665.val279, null
  call void @llvm.assume(i1 %579)
  %self1.val.i.i2.i.i527 = load i64, ptr %_665.val279, align 8, !noundef !2
  %val.i.i3.i.i528 = add i64 %self1.val.i.i2.i.i527, -1
  store i64 %val.i.i3.i.i528, ptr %_665.val279, align 8
  %580 = icmp eq i64 %val.i.i3.i.i528, 0
  br i1 %580, label %bb1.i.i4.i.i529, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit535"

bb1.i.i4.i.i529:                                  ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i526"
  %581 = getelementptr i8, ptr %_665.val279, i64 8
  %self2.val.i.i5.i.i530 = load i64, ptr %581, align 8, !noundef !2
  %val6.i.i6.i.i531 = add i64 %self2.val.i.i5.i.i530, -1
  store i64 %val6.i.i6.i.i531, ptr %581, align 8
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit535"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit535": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h9032be8ddd5f681aE.exit.i.i526", %bb1.i.i4.i.i529
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_665)
  %_1.val.i536 = load i64, ptr %ix54, align 8, !alias.scope !5021, !noundef !2
  %582 = icmp eq i64 %_1.val.i536, 0
  br i1 %582, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i539", label %bb2.i.i.i.i537

bb2.i.i.i.i537:                                   ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit535"
  %583 = getelementptr inbounds i8, ptr %ix54, i64 8
  %_1.val2.i538 = load ptr, ptr %583, align 8, !alias.scope !5021
  %584 = icmp ne ptr %_1.val2.i538, null
  call void @llvm.assume(i1 %584)
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i539"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i539": ; preds = %bb2.i.i.i.i537, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h6ea6c74eb0a88200E.exit535"
  %585 = getelementptr inbounds i8, ptr %ix54, i64 24
  %.val.i540 = load i64, ptr %585, align 8, !alias.scope !5021, !noundef !2
  %586 = icmp eq i64 %.val.i540, 0
  br i1 %586, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit543", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i541"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i541": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i539"
  %587 = getelementptr inbounds i8, ptr %ix54, i64 32
  %.val1.i542 = load ptr, ptr %587, align 8, !alias.scope !5021
  %588 = icmp ne ptr %.val1.i542, null
  call void @llvm.assume(i1 %588)
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit543"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit543": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17hf8dc40592dbfbf41E.exit.i539", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i541"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix54)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data53)
  call void @llvm.lifetime.end.p0(i64 136, ptr nonnull %event)
  br label %bb223

bb214:                                            ; preds = %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit", %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit521"
  %_764 = phi ptr [ %_758, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit" ], [ %_764.pre, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit521" ]
; call pump_recovered::trade_types::prepare_bonding_curve
  %589 = call { i64, ptr } @_ZN14pump_recovered11trade_types21prepare_bonding_curve17h024332b28e0bbc3bE(ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %_764, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_484, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %208) #28
  %590 = extractvalue { i64, ptr } %589, 0
  %591 = icmp eq i64 %590, 2
  br i1 %591, label %bb422, label %bb223

bb223:                                            ; preds = %bb214, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit491", %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit543"
  %.pn235 = phi { i64, ptr } [ %574, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit543" ], [ %523, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit491" ], [ %589, %bb214 ]
  %_0.sroa.0.11 = phi i64 [ %_1190.0, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit543" ], [ %_1159.0, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h912630b66746abf7E.exit491" ], [ %590, %bb214 ]
  %_0.sroa.61.11 = extractvalue { i64, ptr } %.pn235, 1
  %_1.val.i.i = load i64, ptr %ev, align 8, !alias.scope !5024, !noundef !2
  %592 = icmp eq i64 %_1.val.i.i, 0
  br i1 %592, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i": ; preds = %bb223
  %_1.val1.i.i = load ptr, ptr %_566.sroa.6.0.ev.sroa_idx, align 8, !alias.scope !5024
  %593 = icmp ne ptr %_1.val1.i.i, null
  call void @llvm.assume(i1 %593)
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i", %bb223
  %.val.i546 = load i64, ptr %483, align 8, !alias.scope !5029, !noundef !2
  %594 = icmp eq i64 %.val.i546, 0
  br i1 %594, label %bb226, label %bb2.i.i.i.i547

bb2.i.i.i.i547:                                   ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i"
  %.val1.i548 = load ptr, ptr %_573.sroa.6.0..sroa_idx, align 8, !alias.scope !5029
  %595 = icmp ne ptr %.val1.i548, null
  call void @llvm.assume(i1 %595)
  br label %bb226

bb422:                                            ; preds = %bb214
  %_1.val.i.i549 = load i64, ptr %ev, align 8, !alias.scope !5030, !noundef !2
  %596 = icmp eq i64 %_1.val.i.i549, 0
  br i1 %596, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i552", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i550"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i550": ; preds = %bb422
  %_1.val1.i.i551 = load ptr, ptr %_566.sroa.6.0.ev.sroa_idx, align 8, !alias.scope !5030
  %597 = icmp ne ptr %_1.val1.i.i551, null
  call void @llvm.assume(i1 %597)
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i552"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i552": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i550", %bb422
  %.val.i553 = load i64, ptr %483, align 8, !alias.scope !5035, !noundef !2
  %598 = icmp eq i64 %.val.i553, 0
  br i1 %598, label %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h47e2d478d6cd050eE.exit556", label %bb2.i.i.i.i554

bb2.i.i.i.i554:                                   ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i552"
  %.val1.i555 = load ptr, ptr %_573.sroa.6.0..sroa_idx, align 8, !alias.scope !5035
  %599 = icmp ne ptr %.val1.i555, null
  call void @llvm.assume(i1 %599)
  br label %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h47e2d478d6cd050eE.exit556"

"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h47e2d478d6cd050eE.exit556": ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i552", %bb2.i.i.i.i554
  call void @llvm.lifetime.end.p0(i64 424, ptr nonnull %ev)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %quote_mint45)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %transfer_fee)
  call void @llvm.lifetime.end.p0(i64 8, ptr nonnull %buyback_fee_recipient)
  call void @llvm.lifetime.end.p0(i64 8, ptr nonnull %fee_recipient)
  br label %bb262

bb262:                                            ; preds = %bb261, %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h47e2d478d6cd050eE.exit556"
  %_0.sroa.61.12 = phi ptr [ %_0.sroa.61.19, %bb261 ], [ undef, %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h47e2d478d6cd050eE.exit556" ]
  %_0.sroa.0.12 = phi i64 [ %_0.sroa.0.19, %bb261 ], [ 2, %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h47e2d478d6cd050eE.exit556" ]
  %600 = insertvalue { i64, ptr } poison, i64 %_0.sroa.0.12, 0
  %601 = insertvalue { i64, ptr } %600, ptr %_0.sroa.61.12, 1
  ret { i64, ptr } %601

bb226:                                            ; preds = %bb2.i.i.i.i547, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i", %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit"
  %_0.sroa.61.13 = phi ptr [ %_1136.1, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit" ], [ %_0.sroa.61.11, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i" ], [ %_0.sroa.61.11, %bb2.i.i.i.i547 ]
  %_0.sroa.0.13 = phi i64 [ %446, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit" ], [ %_0.sroa.0.11, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h3bf634b539630f18E.exit.i" ], [ %_0.sroa.0.11, %bb2.i.i.i.i547 ]
  call void @llvm.lifetime.end.p0(i64 424, ptr nonnull %ev)
  br label %bb229

bb229:                                            ; preds = %bb226, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit453", %bb395
  %_0.sroa.61.15 = phi ptr [ %_1114.1, %bb395 ], [ %_1118.1, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit453" ], [ %_0.sroa.61.13, %bb226 ]
  %_0.sroa.0.15 = phi i64 [ %_1114.0, %bb395 ], [ %_1118.0, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17haf54546531afe684E.exit453" ], [ %_0.sroa.0.13, %bb226 ]
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %quote_mint45)
  br label %bb260

bb261:                                            ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit", %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit292", %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit299", %bb266, %bb268, %bb260
  %_0.sroa.61.19 = phi ptr [ %_8.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit" ], [ %_18.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit292" ], [ %_30.1, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit299" ], [ %_0.sroa.61.0, %bb260 ], [ %54, %bb268 ], [ %51, %bb266 ]
  %_0.sroa.0.19 = phi i64 [ %_8.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit" ], [ %_18.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit292" ], [ %_30.0, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hacc948faba62d151E.exit299" ], [ %_0.sroa.0.0, %bb260 ], [ %49, %bb268 ], [ %33, %bb266 ]
  call void @llvm.lifetime.end.p0(i64 8, ptr nonnull %buyback_fee_recipient)
  call void @llvm.lifetime.end.p0(i64 8, ptr nonnull %fee_recipient)
  br label %bb262
}
