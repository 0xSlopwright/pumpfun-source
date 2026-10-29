define hidden { i64, ptr } @_ZN14pump_recovered14pump_recovered16buy_exact_sol_in17h49bc4356a9e68eb0E(ptr noalias nocapture noundef readonly align 8 dereferenceable(40) %ctx, i64 noundef %spendable_sol_in, i64 noundef %min_tokens_out, i1 noundef zeroext %track_volume, i1 noundef zeroext %partial_fill) unnamed_addr #1 {
start:
  %_11.i.i = alloca [0 x i8], align 1
  %formatter.i.i = alloca [64 x i8], align 8
  %buf.i.i = alloca [24 x i8], align 8
  %_789.i = alloca [24 x i8], align 8
  %_526.i = alloca [1 x i8], align 1
  %_522.i = alloca [32 x i8], align 8
  %_519.i = alloca [16 x i8], align 8
  %_516.i = alloca [48 x i8], align 8
  %_512.i = alloca [24 x i8], align 8
  %_504.i = alloca [24 x i8], align 8
  %ix38.i = alloca [80 x i8], align 8
  %_498.i = alloca [48 x i8], align 8
  %ix_data37.i = alloca [24 x i8], align 8
  %inner_data36.i = alloca [24 x i8], align 8
  %authority_info35.i = alloca [48 x i8], align 8
  %_491.i = alloca [24 x i8], align 8
  %_489.i = alloca [16 x i8], align 8
  %event34.i = alloca [136 x i8], align 8
  %_478.i = alloca [1 x i8], align 1
  %_474.i = alloca [32 x i8], align 8
  %_471.i = alloca [16 x i8], align 8
  %_468.i = alloca [48 x i8], align 8
  %_464.i = alloca [24 x i8], align 8
  %_456.i = alloca [24 x i8], align 8
  %ix.i = alloca [80 x i8], align 8
  %_448.i = alloca [48 x i8], align 8
  %ix_data.i = alloca [24 x i8], align 8
  %inner_data.i = alloca [24 x i8], align 8
  %authority_info.i = alloca [48 x i8], align 8
  %_439.i = alloca [24 x i8], align 8
  %_437.i = alloca [16 x i8], align 8
  %_405.i = alloca [32 x i8], align 1
  %_403.i = alloca [32 x i8], align 1
  %_402.i = alloca [32 x i8], align 1
  %event.i = alloca [424 x i8], align 8
  %_395.i = alloca [48 x i8], align 8
  %creator.i = alloca [32 x i8], align 1
  %_341.i = alloca [24 x i8], align 8
  %_339.i = alloca [24 x i8], align 8
  %_338.i = alloca [160 x i8], align 8
  %_329.i = alloca [48 x i8], align 8
  %mint.i = alloca [32 x i8], align 1
  %_317.i = alloca [32 x i8], align 1
  %quote_mint.i = alloca [32 x i8], align 1
  %_299.i = alloca [32 x i8], align 1
  %_295.i = alloca [1 x i8], align 1
  %_292.i = alloca [32 x i8], align 1
  %_289.i = alloca [48 x i8], align 8
  %_286.i = alloca [16 x i8], align 8
  %_240.i = alloca [160 x i8], align 8
  %_223.i = alloca [160 x i8], align 8
  %_210.i = alloca [160 x i8], align 8
  %_193.i = alloca [16 x i8], align 8
  %_191.i = alloca [32 x i8], align 1
  %_185.i = alloca [16 x i8], align 8
  %_177.i = alloca [24 x i8], align 8
  %_155.i = alloca [24 x i8], align 8
  %_141.i = alloca [160 x i8], align 8
  %_120.i = alloca [16 x i8], align 8
  %_118.i = alloca [32 x i8], align 1
  %_111.i = alloca [16 x i8], align 8
  %_100.i = alloca [160 x i8], align 8
  %_80.i = alloca [32 x i8], align 1
  %_76.i = alloca [32 x i8], align 1
  %_67.i = alloca [40 x i8], align 8
  %_55.i = alloca [160 x i8], align 8
  %_43.i = alloca [160 x i8], align 8
  %_33.i = alloca [24 x i8], align 8
  %_32.i = alloca [160 x i8], align 8
  %_25.i = alloca [16 x i8], align 8
  %buyback_fee_recipient.i = alloca [8 x i8], align 8
  %bonding_curve.i = alloca [8 x i8], align 8
  %fee_recipient.i = alloca [8 x i8], align 8
  tail call void @llvm.experimental.noalias.scope.decl(metadata !71818)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_512.i)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_498.i)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %inner_data36.i)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %authority_info35.i)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_464.i)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_448.i)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %inner_data.i)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %authority_info.i)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %creator.i)
  call void @llvm.lifetime.start.p0(i64 8, ptr nonnull %fee_recipient.i), !noalias !71818
  %0 = getelementptr inbounds i8, ptr %ctx, i64 8
  %_528.i = load ptr, ptr %0, align 8, !alias.scope !71818, !nonnull !2, !align !3, !noundef !2
  %1 = getelementptr inbounds i8, ptr %_528.i, i64 976
  store ptr %1, ptr %fee_recipient.i, align 8, !noalias !71818
  call void @llvm.lifetime.start.p0(i64 8, ptr nonnull %bonding_curve.i), !noalias !71818
  %2 = getelementptr inbounds i8, ptr %_528.i, i64 800
  store ptr %2, ptr %bonding_curve.i, align 8, !noalias !71818
  %associated_bonding_curve.i = getelementptr inbounds i8, ptr %_528.i, i64 272
  %associated_user.i = getelementptr inbounds i8, ptr %_528.i, i64 488
  %token_program.i = getelementptr inbounds i8, ptr %_528.i, i64 1000
  %_14.i = getelementptr inbounds i8, ptr %_528.i, i64 992
  %_15.i = getelementptr inbounds i8, ptr %_528.i, i64 984
; call pump_recovered::trade_types::prepare_bonding_curve
  %3 = tail call { i64, ptr } @_ZN14pump_recovered11trade_types21prepare_bonding_curve17h5c1479a4239fbcc2E(ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %2, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_14.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_15.i) #28, !noalias !71818
  %4 = extractvalue { i64, ptr } %3, 0
  %5 = icmp eq i64 %4, 2
  br i1 %5, label %bb191.i, label %bb190.i

bb191.i:                                          ; preds = %start
  %6 = getelementptr inbounds i8, ptr %_528.i, i64 968
  %_529.i = load ptr, ptr %6, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::legacy_sell::fee_recipient::validate_fee_recipient
  %7 = tail call { i64, ptr } @_ZN14pump_recovered11legacy_sell13fee_recipient22validate_fee_recipient17hb09b5b7fbefee5b8E(ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %1, ptr noalias noundef nonnull readonly align 8 dereferenceable(1088) %_529.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %2) #28, !noalias !71818
  %8 = extractvalue { i64, ptr } %7, 0
  %9 = icmp eq i64 %8, 2
  br i1 %9, label %bb193.i, label %bb192.i

bb190.i:                                          ; preds = %start
  %10 = extractvalue { i64, ptr } %3, 1
  br label %bb186.i

bb193.i:                                          ; preds = %bb191.i
  call void @llvm.lifetime.start.p0(i64 8, ptr nonnull %buyback_fee_recipient.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_25.i), !noalias !71818
  %11 = getelementptr inbounds i8, ptr %ctx, i64 16
  %_530.0.i = load ptr, ptr %11, align 8, !alias.scope !71818, !nonnull !2, !align !3, !noundef !2
  %12 = getelementptr inbounds i8, ptr %ctx, i64 24
  %_530.1.i = load i64, ptr %12, align 8, !alias.scope !71818, !noundef !2
  %_531.i = load ptr, ptr %6, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %_26.i = getelementptr inbounds i8, ptr %_531.i, i64 8
; call pump_recovered::legacy_sell::buyback_fee_recipient
  call void @_ZN14pump_recovered11legacy_sell21buyback_fee_recipient17hb69f1b86036b1a10E(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_25.i, ptr noalias noundef nonnull readonly align 8 %_530.0.i, i64 noundef %_530.1.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(1080) %_26.i, i64 noundef 1) #28, !noalias !71818
  %13 = load i64, ptr %_25.i, align 8, !range !318, !noalias !71818, !noundef !2
  %14 = icmp eq i64 %13, 2
  %15 = getelementptr inbounds i8, ptr %_25.i, i64 8
  %_575.i = load ptr, ptr %15, align 8, !noalias !71818, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_25.i), !noalias !71818
  br i1 %14, label %bb195.i, label %bb185.i

bb192.i:                                          ; preds = %bb191.i
  %16 = extractvalue { i64, ptr } %7, 1
  br label %bb186.i

bb195.i:                                          ; preds = %bb193.i
  store ptr %_575.i, ptr %buyback_fee_recipient.i, align 8, !noalias !71818
  %17 = getelementptr inbounds i8, ptr %_528.i, i64 961
  %18 = load i8, ptr %17, align 1, !range !374, !noalias !71818, !noundef !2
  %_29.not.i = icmp eq i8 %18, 0
  br i1 %_29.not.i, label %bb9.i, label %bb5.i

bb9.i:                                            ; preds = %bb195.i
  %_40.i = icmp eq i64 %min_tokens_out, 0
  br i1 %_40.i, label %bb10.i, label %bb11.i

bb5.i:                                            ; preds = %bb195.i
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_32.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_33.i), !noalias !71818
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_33.i, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_cdbdeba67b052fefbde5996b437aa24e) #28, !noalias !71818
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i.i), !noalias !71821
  store i64 0, ptr %buf.i.i, align 8, !noalias !71821
  %_9.sroa.4.0.buf.sroa_idx.i.i = getelementptr inbounds i8, ptr %buf.i.i, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i.i, align 8, !noalias !71821
  %_9.sroa.5.0.buf.sroa_idx.i.i = getelementptr inbounds i8, ptr %buf.i.i, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i.i, align 8, !noalias !71821
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i.i), !noalias !71821
  %19 = getelementptr inbounds i8, ptr %formatter.i.i, i64 52
  store i32 0, ptr %19, align 4, !noalias !71821
  %20 = getelementptr inbounds i8, ptr %formatter.i.i, i64 48
  store i32 32, ptr %20, align 8, !noalias !71821
  %21 = getelementptr inbounds i8, ptr %formatter.i.i, i64 56
  store i8 3, ptr %21, align 8, !noalias !71821
  store i64 0, ptr %formatter.i.i, align 8, !noalias !71821
  %22 = getelementptr inbounds i8, ptr %formatter.i.i, i64 16
  store i64 0, ptr %22, align 8, !noalias !71821
  %23 = getelementptr inbounds i8, ptr %formatter.i.i, i64 32
  store ptr %buf.i.i, ptr %23, align 8, !noalias !71821
  %24 = getelementptr inbounds i8, ptr %formatter.i.i, i64 40
  store ptr @vtable.4, ptr %24, align 8, !noalias !71821
; call <pump_recovered::PumpError as core::fmt::Display>::fmt
  %25 = call noundef zeroext i1 @"_ZN64_$LT$pump_recovered..PumpError$u20$as$u20$core..fmt..Display$GT$3fmt17hbf6a90ed7cf777ebE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_cdbdeba67b052fefbde5996b437aa24e, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i.i) #28, !noalias !71825
  br i1 %25, label %bb3.i.i, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit.i"

bb3.i.i:                                          ; preds = %bb5.i
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.5, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #29, !noalias !71821
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit.i": ; preds = %bb5.i
  %26 = getelementptr inbounds i8, ptr %_32.i, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %26, ptr noundef nonnull align 8 dereferenceable(24) %buf.i.i, i64 24, i1 false), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i.i), !noalias !71821
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i.i), !noalias !71821
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i.i), !noalias !71818
  %27 = getelementptr inbounds i8, ptr %_32.i, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %27, ptr noundef nonnull align 8 dereferenceable(24) %_33.i, i64 24, i1 false), !noalias !71818
  %28 = getelementptr inbounds i8, ptr %_32.i, i64 152
  store i32 6005, ptr %28, align 8, !noalias !71818
  store i64 0, ptr %_32.i, align 8, !noalias !71818
  %_36.sroa.4.0._32.sroa_idx.i = getelementptr inbounds i8, ptr %_32.i, i64 8
  store ptr @alloc_7c3e77a56d18f5cd9334be7ac5c38e2d, ptr %_36.sroa.4.0._32.sroa_idx.i, align 8, !noalias !71818
  %_36.sroa.4.sroa.4.0._36.sroa.4.0._32.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_32.i, i64 16
  store i64 24, ptr %_36.sroa.4.sroa.4.0._36.sroa.4.0._32.sroa_idx.sroa_idx.i, align 8, !noalias !71818
  %_36.sroa.4.sroa.5.0._36.sroa.4.0._32.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_32.i, i64 24
  store i32 53, ptr %_36.sroa.4.sroa.5.0._36.sroa.4.0._32.sroa_idx.sroa_idx.i, align 8, !noalias !71818
  %29 = getelementptr inbounds i8, ptr %_32.i, i64 80
  store i8 2, ptr %29, align 8, !noalias !71818
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_33.i), !noalias !71818
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %30 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_32.i) #28, !noalias !71818
  %_31.0.i = extractvalue { i64, ptr } %30, 0
  %_31.1.i = extractvalue { i64, ptr } %30, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_32.i), !noalias !71818
  br label %bb185.i

bb11.i:                                           ; preds = %bb9.i
  %_52.i = icmp eq i64 %spendable_sol_in, 0
  br i1 %_52.i, label %bb16.i, label %bb17.i

bb10.i:                                           ; preds = %bb9.i
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_43.i), !noalias !71818
  %31 = getelementptr inbounds i8, ptr %_43.i, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %31, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e3e143fb26e9bc2a81054057f78086ba) #28, !noalias !71818
  %32 = getelementptr inbounds i8, ptr %_43.i, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %32, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e3e143fb26e9bc2a81054057f78086ba) #28, !noalias !71818
  %33 = getelementptr inbounds i8, ptr %_43.i, i64 152
  store i32 6020, ptr %33, align 8, !noalias !71818
  store i64 0, ptr %_43.i, align 8, !noalias !71818
  %_47.sroa.4.0._43.sroa_idx.i = getelementptr inbounds i8, ptr %_43.i, i64 8
  store ptr @alloc_7c3e77a56d18f5cd9334be7ac5c38e2d, ptr %_47.sroa.4.0._43.sroa_idx.i, align 8, !noalias !71818
  %_47.sroa.4.sroa.4.0._47.sroa.4.0._43.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_43.i, i64 16
  store i64 24, ptr %_47.sroa.4.sroa.4.0._47.sroa.4.0._43.sroa_idx.sroa_idx.i, align 8, !noalias !71818
  %_47.sroa.4.sroa.5.0._47.sroa.4.0._43.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_43.i, i64 24
  store i32 57, ptr %_47.sroa.4.sroa.5.0._47.sroa.4.0._43.sroa_idx.sroa_idx.i, align 8, !noalias !71818
  %34 = getelementptr inbounds i8, ptr %_43.i, i64 80
  store i8 2, ptr %34, align 8, !noalias !71818
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %35 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_43.i) #28, !noalias !71818
  %_42.0.i = extractvalue { i64, ptr } %35, 0
  %_42.1.i = extractvalue { i64, ptr } %35, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_43.i), !noalias !71818
; call anchor_lang::error::Error::with_values
  %36 = tail call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h8504a53ddb496dcbE(i64 noundef %_42.0.i, ptr noundef %_42.1.i, i32 noundef 0) #28
  %_41.0.i = extractvalue { i64, ptr } %36, 0
  %_41.1.i = extractvalue { i64, ptr } %36, 1
  br label %bb185.i

bb17.i:                                           ; preds = %bb11.i
  call void @llvm.lifetime.start.p0(i64 40, ptr nonnull %_67.i), !noalias !71818
  %_532.i = load ptr, ptr %6, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %_70.i = getelementptr inbounds i8, ptr %_528.i, i64 144
  %_72.i = getelementptr inbounds i8, ptr %_528.i, i64 1032
  %37 = getelementptr inbounds i8, ptr %_528.i, i64 1008
  %_73.i = load ptr, ptr %37, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::legacy_sell::fee_cpi::trade_fees
  call void @_ZN14pump_recovered11legacy_sell7fee_cpi10trade_fees17h6e6f34546f12d627E(ptr noalias nocapture noundef nonnull sret([40 x i8]) align 8 dereferenceable(40) %_67.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(1088) %_532.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(168) %2, ptr noalias noundef nonnull readonly align 8 dereferenceable(128) %_70.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(144) %_528.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_72.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_73.i, i64 noundef %spendable_sol_in) #28, !noalias !71818
  %_579.i = load i64, ptr %_67.i, align 8, !range !389, !noalias !71818, !noundef !2
  %trunc.not.i = icmp eq i64 %_579.i, 0
  br i1 %trunc.not.i, label %bb200.i, label %bb199.i

bb16.i:                                           ; preds = %bb11.i
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_55.i), !noalias !71818
  %38 = getelementptr inbounds i8, ptr %_55.i, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %38, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_73667b43dd614c93c329aef199c5ef8b) #28, !noalias !71818
  %39 = getelementptr inbounds i8, ptr %_55.i, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %39, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_73667b43dd614c93c329aef199c5ef8b) #28, !noalias !71818
  %40 = getelementptr inbounds i8, ptr %_55.i, i64 152
  store i32 6041, ptr %40, align 8, !noalias !71818
  store i64 0, ptr %_55.i, align 8, !noalias !71818
  %_59.sroa.4.0._55.sroa_idx.i = getelementptr inbounds i8, ptr %_55.i, i64 8
  store ptr @alloc_7c3e77a56d18f5cd9334be7ac5c38e2d, ptr %_59.sroa.4.0._55.sroa_idx.i, align 8, !noalias !71818
  %_59.sroa.4.sroa.4.0._59.sroa.4.0._55.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_55.i, i64 16
  store i64 24, ptr %_59.sroa.4.sroa.4.0._59.sroa.4.0._55.sroa_idx.sroa_idx.i, align 8, !noalias !71818
  %_59.sroa.4.sroa.5.0._59.sroa.4.0._55.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_55.i, i64 24
  store i32 59, ptr %_59.sroa.4.sroa.5.0._59.sroa.4.0._55.sroa_idx.sroa_idx.i, align 8, !noalias !71818
  %41 = getelementptr inbounds i8, ptr %_55.i, i64 80
  store i8 2, ptr %41, align 8, !noalias !71818
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %42 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_55.i) #28, !noalias !71818
  %_54.0.i = extractvalue { i64, ptr } %42, 0
  %_54.1.i = extractvalue { i64, ptr } %42, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_55.i), !noalias !71818
; call anchor_lang::error::Error::with_values
  %43 = tail call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h8504a53ddb496dcbE(i64 noundef %_54.0.i, ptr noundef %_54.1.i, i32 noundef 0) #28
  %_53.0.i = extractvalue { i64, ptr } %43, 0
  %_53.1.i = extractvalue { i64, ptr } %43, 1
  br label %bb185.i

bb200.i:                                          ; preds = %bb17.i
  %_580.sroa.6.0..sroa_idx.i = getelementptr inbounds i8, ptr %_67.i, i64 24
  %_580.sroa.6.0.copyload.i = load i64, ptr %_580.sroa.6.0..sroa_idx.i, align 8, !noalias !71818
  %_580.sroa.7.0..sroa_idx.i = getelementptr inbounds i8, ptr %_67.i, i64 32
  %_580.sroa.7.0.copyload.i = load i64, ptr %_580.sroa.7.0..sroa_idx.i, align 8, !noalias !71818
  call void @llvm.lifetime.end.p0(i64 40, ptr nonnull %_67.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_76.i), !noalias !71818
  %_583.i = load ptr, ptr %_15.i, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %_584.i = load ptr, ptr %_583.i, align 8, !noalias !71818, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_76.i, ptr noundef nonnull align 1 dereferenceable(32) %_584.i, i64 32, i1 false), !noalias !71818
  %_533.i = load ptr, ptr %6, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %_587.i = getelementptr inbounds i8, ptr %_533.i, i64 648
  %44 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_76.i, ptr noundef nonnull dereferenceable(32) %_587.i, i64 32), !noalias !71818
  %45 = icmp eq i32 %44, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_76.i), !noalias !71818
  %._580.sroa.6.0.copyload.i = select i1 %45, i64 0, i64 %_580.sroa.6.0.copyload.i
  %._580.sroa.7.0.copyload.i = select i1 %45, i64 0, i64 %_580.sroa.7.0.copyload.i
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_80.i), !noalias !71818
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_80.i, i8 0, i64 32, i1 false), !noalias !71818
  %_589.i = getelementptr inbounds i8, ptr %_528.i, i64 808
  %46 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_589.i, ptr noundef nonnull dereferenceable(32) %_80.i, i64 32), !noalias !71818
  %47 = icmp eq i32 %46, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_80.i), !noalias !71818
  %.._580.sroa.7.0.copyload184.i = select i1 %47, i64 0, i64 %._580.sroa.7.0.copyload.i
  %48 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %._580.sroa.6.0.copyload.i, i64 %.._580.sroa.7.0.copyload184.i)
  %_594.0.i = extractvalue { i64, i1 } %48, 0
  %_594.1.i = extractvalue { i64, i1 } %48, 1
  br i1 %_594.1.i, label %bb205.i, label %bb206.i

bb199.i:                                          ; preds = %bb17.i
  %49 = getelementptr inbounds i8, ptr %_67.i, i64 8
  %_581.0.i = load i64, ptr %49, align 8, !range !389, !noalias !71818, !noundef !2
  %50 = getelementptr inbounds i8, ptr %_67.i, i64 16
  %_581.1.i = load ptr, ptr %50, align 8, !noalias !71818, !noundef !2
  call void @llvm.lifetime.end.p0(i64 40, ptr nonnull %_67.i), !noalias !71818
  br label %bb185.i

bb206.i:                                          ; preds = %bb200.i
  %51 = icmp eq i64 %_594.0.i, 0
  br i1 %51, label %bb40.i, label %bb34.i

bb205.i:                                          ; preds = %bb200.i
; call pump_recovered::<impl core::convert::From<pump_recovered::PumpError> for anchor_lang::error::Error>::from
  %52 = tail call { i64, ptr } @"_ZN14pump_recovered108_$LT$impl$u20$core..convert..From$LT$pump_recovered..PumpError$GT$$u20$for$u20$anchor_lang..error..Error$GT$4from17he2863c13b6d46d53E"(i32 noundef 24) #28, !noalias !71818
  %_600.0.i = extractvalue { i64, ptr } %52, 0
  %_600.1.i = extractvalue { i64, ptr } %52, 1
  br label %bb185.i

bb34.i:                                           ; preds = %bb206.i
  %_90.i = zext i64 %spendable_sol_in to i128
  %53 = mul nuw nsw i128 %_90.i, 10000
  %_93.i = zext i64 %_594.0.i to i128
  %54 = add nuw nsw i128 %_93.i, 10000
  %_88.i = udiv i128 %53, %54
  %55 = trunc i128 %_88.i to i64
  %_96.i = icmp eq i64 %55, 0
  br i1 %_96.i, label %bb35.i, label %bb40.i

bb40.i:                                           ; preds = %bb34.i, %bb206.i
  %raw_quote.sroa.0.0293.i = phi i64 [ %55, %bb34.i ], [ %spendable_sol_in, %bb206.i ]
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_111.i), !noalias !71818
; call pump_recovered::legacy_sell::fee_math::fee
  call void @_ZN14pump_recovered11legacy_sell8fee_math3fee17h0423af5a0ab52bd3E(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_111.i, i64 noundef %raw_quote.sroa.0.0293.i, i64 noundef %._580.sroa.6.0.copyload.i) #28, !noalias !71818
  %56 = load i64, ptr %_111.i, align 8, !range !318, !noalias !71818, !noundef !2
  %57 = icmp eq i64 %56, 2
  %58 = getelementptr inbounds i8, ptr %_111.i, i64 8
  br i1 %57, label %bb210.i, label %bb209.i

bb35.i:                                           ; preds = %bb34.i
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_100.i), !noalias !71818
  %59 = getelementptr inbounds i8, ptr %_100.i, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %59, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_73667b43dd614c93c329aef199c5ef8b) #28, !noalias !71818
  %60 = getelementptr inbounds i8, ptr %_100.i, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %60, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_73667b43dd614c93c329aef199c5ef8b) #28, !noalias !71818
  %61 = getelementptr inbounds i8, ptr %_100.i, i64 152
  store i32 6041, ptr %61, align 8, !noalias !71818
  store i64 0, ptr %_100.i, align 8, !noalias !71818
  %_104.sroa.4.0._100.sroa_idx.i = getelementptr inbounds i8, ptr %_100.i, i64 8
  store ptr @alloc_7c3e77a56d18f5cd9334be7ac5c38e2d, ptr %_104.sroa.4.0._100.sroa_idx.i, align 8, !noalias !71818
  %_104.sroa.4.sroa.4.0._104.sroa.4.0._100.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_100.i, i64 16
  store i64 24, ptr %_104.sroa.4.sroa.4.0._104.sroa.4.0._100.sroa_idx.sroa_idx.i, align 8, !noalias !71818
  %_104.sroa.4.sroa.5.0._104.sroa.4.0._100.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_100.i, i64 24
  store i32 92, ptr %_104.sroa.4.sroa.5.0._104.sroa.4.0._100.sroa_idx.sroa_idx.i, align 8, !noalias !71818
  %62 = getelementptr inbounds i8, ptr %_100.i, i64 80
  store i8 2, ptr %62, align 8, !noalias !71818
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %63 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_100.i) #28, !noalias !71818
  %_99.0.i = extractvalue { i64, ptr } %63, 0
  %_99.1.i = extractvalue { i64, ptr } %63, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_100.i), !noalias !71818
; call anchor_lang::error::Error::with_values
  %64 = tail call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h8504a53ddb496dcbE(i64 noundef %_99.0.i, ptr noundef %_99.1.i, i32 noundef 0) #28
  %_98.0.i = extractvalue { i64, ptr } %64, 0
  %_98.1.i = extractvalue { i64, ptr } %64, 1
  br label %bb185.i

bb210.i:                                          ; preds = %bb40.i
  %_602.i = load i64, ptr %58, align 8, !noalias !71818, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_111.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_118.i), !noalias !71818
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_118.i, i8 0, i64 32, i1 false), !noalias !71818
  %65 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_589.i, ptr noundef nonnull dereferenceable(32) %_118.i, i64 32), !noalias !71818
  %.not.i = icmp eq i32 %65, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_118.i), !noalias !71818
  br i1 %.not.i, label %bb45.i, label %bb42.i

bb209.i:                                          ; preds = %bb40.i
  %_603.1.i = load ptr, ptr %58, align 8, !noalias !71818, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_111.i), !noalias !71818
  br label %bb185.i

bb42.i:                                           ; preds = %bb210.i
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_120.i), !noalias !71818
; call pump_recovered::legacy_sell::fee_math::fee
  call void @_ZN14pump_recovered11legacy_sell8fee_math3fee17h0423af5a0ab52bd3E(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_120.i, i64 noundef %raw_quote.sroa.0.0293.i, i64 noundef %._580.sroa.7.0.copyload.i) #28, !noalias !71818
  %66 = load i64, ptr %_120.i, align 8, !range !318, !noalias !71818, !noundef !2
  %67 = icmp eq i64 %66, 2
  %68 = getelementptr inbounds i8, ptr %_120.i, i64 8
  br i1 %67, label %bb214.i, label %bb213.i

bb45.i:                                           ; preds = %bb214.i, %bb210.i
  %creator_fee.sroa.0.0.i = phi i64 [ %_611.i, %bb214.i ], [ 0, %bb210.i ]
  %69 = tail call i64 @llvm.uadd.sat.i64(i64 %raw_quote.sroa.0.0293.i, i64 %_602.i)
  %70 = tail call i64 @llvm.uadd.sat.i64(i64 %69, i64 %creator_fee.sroa.0.0.i)
  %_129.i = icmp ugt i64 %70, %spendable_sol_in
  br i1 %_129.i, label %bb46.i, label %bb54.i

bb214.i:                                          ; preds = %bb42.i
  %_611.i = load i64, ptr %68, align 8, !noalias !71818, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_120.i), !noalias !71818
  br label %bb45.i

bb213.i:                                          ; preds = %bb42.i
  %_612.1.i = load ptr, ptr %68, align 8, !noalias !71818, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_120.i), !noalias !71818
  br label %bb185.i

bb46.i:                                           ; preds = %bb45.i
  %71 = tail call i64 @llvm.usub.sat.i64(i64 %70, i64 %spendable_sol_in)
  %_615.not.i = icmp ult i64 %raw_quote.sroa.0.0293.i, %71
  br i1 %_615.not.i, label %bb219.i, label %bb48.i

bb48.i:                                           ; preds = %bb46.i
  %_616.i = sub nuw i64 %raw_quote.sroa.0.0293.i, %71
  %_137.i = icmp eq i64 %_616.i, 0
  br i1 %_137.i, label %bb49.i, label %bb54.i

bb219.i:                                          ; preds = %bb46.i
; call pump_recovered::<impl core::convert::From<pump_recovered::PumpError> for anchor_lang::error::Error>::from
  %72 = tail call { i64, ptr } @"_ZN14pump_recovered108_$LT$impl$u20$core..convert..From$LT$pump_recovered..PumpError$GT$$u20$for$u20$anchor_lang..error..Error$GT$4from17he2863c13b6d46d53E"(i32 noundef 24) #28, !noalias !71818
  %_622.0.i = extractvalue { i64, ptr } %72, 0
  %_622.1.i = extractvalue { i64, ptr } %72, 1
  br label %bb185.i

bb54.i:                                           ; preds = %bb48.i, %bb45.i
  %quote.sroa.0.0296.i = phi i64 [ %_616.i, %bb48.i ], [ %raw_quote.sroa.0.0293.i, %bb45.i ]
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_155.i), !noalias !71818
; call pump_recovered::constant_product::tokens_for_quote
  call void @_ZN14pump_recovered16constant_product16tokens_for_quote17h4006f7aa0ff394deE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_155.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(160) %_589.i, i64 noundef %quote.sroa.0.0296.i) #28, !noalias !71818
  %_623.i = load i64, ptr %_155.i, align 8, !range !389, !noalias !71818, !noundef !2
  %trunc175.not.i = icmp eq i64 %_623.i, 0
  %73 = getelementptr inbounds i8, ptr %_155.i, i64 8
  %_62480176.i = load i64, ptr %73, align 8, !noalias !71818
  %.sroa_idx.i = getelementptr inbounds i8, ptr %_155.i, i64 16
  br i1 %trunc175.not.i, label %bb223.i, label %bb222.i

bb49.i:                                           ; preds = %bb48.i
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_141.i), !noalias !71818
  %74 = getelementptr inbounds i8, ptr %_141.i, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %74, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_004acfa89553cbafbb2b2f00006c54c3) #28, !noalias !71818
  %75 = getelementptr inbounds i8, ptr %_141.i, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %75, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_004acfa89553cbafbb2b2f00006c54c3) #28, !noalias !71818
  %76 = getelementptr inbounds i8, ptr %_141.i, i64 152
  store i32 6042, ptr %76, align 8, !noalias !71818
  store i64 0, ptr %_141.i, align 8, !noalias !71818
  %_145.sroa.4.0._141.sroa_idx.i = getelementptr inbounds i8, ptr %_141.i, i64 8
  store ptr @alloc_7c3e77a56d18f5cd9334be7ac5c38e2d, ptr %_145.sroa.4.0._141.sroa_idx.i, align 8, !noalias !71818
  %_145.sroa.4.sroa.4.0._145.sroa.4.0._141.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_141.i, i64 16
  store i64 24, ptr %_145.sroa.4.sroa.4.0._145.sroa.4.0._141.sroa_idx.sroa_idx.i, align 8, !noalias !71818
  %_145.sroa.4.sroa.5.0._145.sroa.4.0._141.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_141.i, i64 24
  store i32 110, ptr %_145.sroa.4.sroa.5.0._145.sroa.4.0._141.sroa_idx.sroa_idx.i, align 8, !noalias !71818
  %77 = getelementptr inbounds i8, ptr %_141.i, i64 80
  store i8 2, ptr %77, align 8, !noalias !71818
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %78 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_141.i) #28, !noalias !71818
  %_140.0.i = extractvalue { i64, ptr } %78, 0
  %_140.1.i = extractvalue { i64, ptr } %78, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_141.i), !noalias !71818
; call anchor_lang::error::Error::with_values
  %79 = tail call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h8504a53ddb496dcbE(i64 noundef %_140.0.i, ptr noundef %_140.1.i, i32 noundef 0) #28
  %_139.0.i = extractvalue { i64, ptr } %79, 0
  %_139.1.i = extractvalue { i64, ptr } %79, 1
  br label %bb185.i

bb223.i:                                          ; preds = %bb54.i
  %_62481.i = load i64, ptr %.sroa_idx.i, align 8, !noalias !71818
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_155.i), !noalias !71818
  %_627.not.i = icmp eq i64 %_62481.i, 0
  br i1 %_627.not.i, label %bb225.i, label %bb224.i

bb222.i:                                          ; preds = %bb54.i
  %_625.1.i = load ptr, ptr %.sroa_idx.i, align 8, !noalias !71818, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_155.i), !noalias !71818
  br label %bb185.i

bb225.i:                                          ; preds = %bb223.i
  %80 = getelementptr inbounds i8, ptr %_528.i, i64 888
  %_168.i = load i64, ptr %80, align 8, !noalias !71818, !noundef !2
  %_167.i = icmp ugt i64 %_62480176.i, %_168.i
  %brmerge.not.i = and i1 %_167.i, %partial_fill
  br i1 %brmerge.not.i, label %bb57.i, label %bb71.i

bb224.i:                                          ; preds = %bb223.i
; call pump_recovered::<impl core::convert::From<pump_recovered::PumpError> for anchor_lang::error::Error>::from
  %81 = tail call { i64, ptr } @"_ZN14pump_recovered108_$LT$impl$u20$core..convert..From$LT$pump_recovered..PumpError$GT$$u20$for$u20$anchor_lang..error..Error$GT$4from17he2863c13b6d46d53E"(i32 noundef 25) #28, !noalias !71818
  %_635.0.i = extractvalue { i64, ptr } %81, 0
  %_635.1.i = extractvalue { i64, ptr } %81, 1
  br label %bb185.i

bb71.i:                                           ; preds = %bb225.i
  %_220.i = icmp ult i64 %_62480176.i, %min_tokens_out
  br i1 %_220.i, label %bb72.i, label %bb78.i

bb57.i:                                           ; preds = %bb225.i
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_177.i), !noalias !71818
; call pump_recovered::buy_quote
  call void @_ZN14pump_recovered9buy_quote17h1a65842e84ca67f6E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_177.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(160) %_589.i, i64 noundef %_168.i) #28, !noalias !71818
  %_636.i = load i64, ptr %_177.i, align 8, !range !389, !noalias !71818, !noundef !2
  %trunc177.not.i = icmp eq i64 %_636.i, 0
  %82 = getelementptr inbounds i8, ptr %_177.i, i64 8
  %_63790178.i = load i64, ptr %82, align 8, !noalias !71818
  %.sroa_idx91.i = getelementptr inbounds i8, ptr %_177.i, i64 16
  br i1 %trunc177.not.i, label %bb228.i, label %bb227.i

bb72.i:                                           ; preds = %bb71.i
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_223.i), !noalias !71818
  %83 = getelementptr inbounds i8, ptr %_223.i, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %83, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_004acfa89553cbafbb2b2f00006c54c3) #28, !noalias !71818
  %84 = getelementptr inbounds i8, ptr %_223.i, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %84, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_004acfa89553cbafbb2b2f00006c54c3) #28, !noalias !71818
  %85 = getelementptr inbounds i8, ptr %_223.i, i64 152
  store i32 6042, ptr %85, align 8, !noalias !71818
  store i64 0, ptr %_223.i, align 8, !noalias !71818
  %_227.sroa.4.0._223.sroa_idx.i = getelementptr inbounds i8, ptr %_223.i, i64 8
  store ptr @alloc_7c3e77a56d18f5cd9334be7ac5c38e2d, ptr %_227.sroa.4.0._223.sroa_idx.i, align 8, !noalias !71818
  %_227.sroa.4.sroa.4.0._227.sroa.4.0._223.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_223.i, i64 16
  store i64 24, ptr %_227.sroa.4.sroa.4.0._227.sroa.4.0._223.sroa_idx.sroa_idx.i, align 8, !noalias !71818
  %_227.sroa.4.sroa.5.0._227.sroa.4.0._223.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_223.i, i64 24
  store i32 143, ptr %_227.sroa.4.sroa.5.0._227.sroa.4.0._223.sroa_idx.sroa_idx.i, align 8, !noalias !71818
  %86 = getelementptr inbounds i8, ptr %_223.i, i64 80
  store i8 2, ptr %86, align 8, !noalias !71818
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %87 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_223.i) #28, !noalias !71818
  %_222.0.i = extractvalue { i64, ptr } %87, 0
  %_222.1.i = extractvalue { i64, ptr } %87, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_223.i), !noalias !71818
; call anchor_lang::error::Error::with_values
  %88 = tail call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h17a91ba7c0882e46E(i64 noundef %_222.0.i, ptr noundef %_222.1.i, i64 noundef %_62480176.i, i64 noundef %min_tokens_out) #28
  %_221.0.i = extractvalue { i64, ptr } %88, 0
  %_221.1.i = extractvalue { i64, ptr } %88, 1
  br label %bb185.i

bb78.i:                                           ; preds = %bb243.bb78_crit_edge.i, %bb71.i
  %_235.i = phi i64 [ %_168.i, %bb71.i ], [ %_235.pre.i, %bb243.bb78_crit_edge.i ]
  %_853.sroa.0.0.i = phi i64 [ %_62480176.i, %bb71.i ], [ %_168.i, %bb243.bb78_crit_edge.i ]
  %_854.sroa.0.0.i = phi i64 [ %quote.sroa.0.0296.i, %bb71.i ], [ %_63790178.i, %bb243.bb78_crit_edge.i ]
  %_855.sroa.0.0.i = phi i64 [ %_602.i, %bb71.i ], [ %_650.i, %bb243.bb78_crit_edge.i ]
  %_856.sroa.0.0.i = phi i64 [ %creator_fee.sroa.0.0.i, %bb71.i ], [ %creator_fee13.sroa.0.0.i, %bb243.bb78_crit_edge.i ]
  %_234.i = icmp ult i64 %_235.i, %_853.sroa.0.0.i
  br i1 %_234.i, label %bb79.i, label %bb84.i

bb228.i:                                          ; preds = %bb57.i
  %_63792.i = load i64, ptr %.sroa_idx91.i, align 8, !noalias !71818
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_177.i), !noalias !71818
  %_640.not.i = icmp eq i64 %_63792.i, 0
  br i1 %_640.not.i, label %bb230.i, label %bb229.i

bb227.i:                                          ; preds = %bb57.i
  %_638.1.i = load ptr, ptr %.sroa_idx91.i, align 8, !noalias !71818, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_177.i), !noalias !71818
  br label %bb185.i

bb230.i:                                          ; preds = %bb228.i
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_185.i), !noalias !71818
; call pump_recovered::legacy_sell::fee_math::fee
  call void @_ZN14pump_recovered11legacy_sell8fee_math3fee17h0423af5a0ab52bd3E(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_185.i, i64 noundef %_63790178.i, i64 noundef %._580.sroa.6.0.copyload.i) #28, !noalias !71818
  %89 = load i64, ptr %_185.i, align 8, !range !318, !noalias !71818, !noundef !2
  %90 = icmp eq i64 %89, 2
  %91 = getelementptr inbounds i8, ptr %_185.i, i64 8
  br i1 %90, label %bb233.i, label %bb232.i

bb229.i:                                          ; preds = %bb228.i
; call pump_recovered::<impl core::convert::From<pump_recovered::PumpError> for anchor_lang::error::Error>::from
  %92 = tail call { i64, ptr } @"_ZN14pump_recovered108_$LT$impl$u20$core..convert..From$LT$pump_recovered..PumpError$GT$$u20$for$u20$anchor_lang..error..Error$GT$4from17he2863c13b6d46d53E"(i32 noundef 25) #28, !noalias !71818
  %_648.0.i = extractvalue { i64, ptr } %92, 0
  %_648.1.i = extractvalue { i64, ptr } %92, 1
  br label %bb185.i

bb233.i:                                          ; preds = %bb230.i
  %_650.i = load i64, ptr %91, align 8, !noalias !71818, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_185.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_191.i), !noalias !71818
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_191.i, i8 0, i64 32, i1 false), !noalias !71818
  %93 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_589.i, ptr noundef nonnull dereferenceable(32) %_191.i, i64 32), !noalias !71818
  %.not179.i = icmp eq i32 %93, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_191.i), !noalias !71818
  br i1 %.not179.i, label %bb63.i, label %bb60.i

bb232.i:                                          ; preds = %bb230.i
  %_651.1.i = load ptr, ptr %91, align 8, !noalias !71818, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_185.i), !noalias !71818
  br label %bb185.i

bb60.i:                                           ; preds = %bb233.i
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_193.i), !noalias !71818
; call pump_recovered::legacy_sell::fee_math::fee
  call void @_ZN14pump_recovered11legacy_sell8fee_math3fee17h0423af5a0ab52bd3E(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_193.i, i64 noundef %_63790178.i, i64 noundef %._580.sroa.7.0.copyload.i) #28, !noalias !71818
  %94 = load i64, ptr %_193.i, align 8, !range !318, !noalias !71818, !noundef !2
  %95 = icmp eq i64 %94, 2
  %96 = getelementptr inbounds i8, ptr %_193.i, i64 8
  br i1 %95, label %bb237.i, label %bb236.i

bb63.i:                                           ; preds = %bb237.i, %bb233.i
  %creator_fee13.sroa.0.0.i = phi i64 [ %_659.i, %bb237.i ], [ 0, %bb233.i ]
  %97 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %_63790178.i, i64 %_650.i)
  %_666.1.i = extractvalue { i64, i1 } %97, 1
  br i1 %_666.1.i, label %bb173.i, label %bb240.i

bb237.i:                                          ; preds = %bb60.i
  %_659.i = load i64, ptr %96, align 8, !noalias !71818, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_193.i), !noalias !71818
  br label %bb63.i

bb236.i:                                          ; preds = %bb60.i
  %_660.1.i = load ptr, ptr %96, align 8, !noalias !71818, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_193.i), !noalias !71818
  br label %bb185.i

bb240.i:                                          ; preds = %bb63.i
  %_666.0.i = extractvalue { i64, i1 } %97, 0
  %98 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %_666.0.i, i64 %creator_fee13.sroa.0.0.i)
  %_674.0.i = extractvalue { i64, i1 } %98, 0
  %_674.1.i = extractvalue { i64, i1 } %98, 1
  br i1 %_674.1.i, label %bb173.i, label %bb243.i

bb243.i:                                          ; preds = %bb240.i
  %_207.i = icmp ugt i64 %_674.0.i, %spendable_sol_in
  br i1 %_207.i, label %bb64.i, label %bb243.bb78_crit_edge.i

bb243.bb78_crit_edge.i:                           ; preds = %bb243.i
  %_235.pre.i = load i64, ptr %80, align 8, !noalias !71818
  br label %bb78.i

bb64.i:                                           ; preds = %bb243.i
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_210.i), !noalias !71818
  %99 = getelementptr inbounds i8, ptr %_210.i, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %99, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_2e38410fced2c310c68bdf2d45d0c3bd) #28, !noalias !71818
  %100 = getelementptr inbounds i8, ptr %_210.i, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %100, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_2e38410fced2c310c68bdf2d45d0c3bd) #28, !noalias !71818
  %101 = getelementptr inbounds i8, ptr %_210.i, i64 152
  store i32 6002, ptr %101, align 8, !noalias !71818
  store i64 0, ptr %_210.i, align 8, !noalias !71818
  %_214.sroa.4.0._210.sroa_idx.i = getelementptr inbounds i8, ptr %_210.i, i64 8
  store ptr @alloc_7c3e77a56d18f5cd9334be7ac5c38e2d, ptr %_214.sroa.4.0._210.sroa_idx.i, align 8, !noalias !71818
  %_214.sroa.4.sroa.4.0._214.sroa.4.0._210.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_210.i, i64 16
  store i64 24, ptr %_214.sroa.4.sroa.4.0._214.sroa.4.0._210.sroa_idx.sroa_idx.i, align 8, !noalias !71818
  %_214.sroa.4.sroa.5.0._214.sroa.4.0._210.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_210.i, i64 24
  store i32 133, ptr %_214.sroa.4.sroa.5.0._214.sroa.4.0._210.sroa_idx.sroa_idx.i, align 8, !noalias !71818
  %102 = getelementptr inbounds i8, ptr %_210.i, i64 80
  store i8 2, ptr %102, align 8, !noalias !71818
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %103 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_210.i) #28, !noalias !71818
  %_209.0.i = extractvalue { i64, ptr } %103, 0
  %_209.1.i = extractvalue { i64, ptr } %103, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_210.i), !noalias !71818
; call anchor_lang::error::Error::with_values
  %104 = tail call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h17a91ba7c0882e46E(i64 noundef %_209.0.i, ptr noundef %_209.1.i, i64 noundef %spendable_sol_in, i64 noundef %_674.0.i) #28
  %_208.0.i = extractvalue { i64, ptr } %104, 0
  %_208.1.i = extractvalue { i64, ptr } %104, 1
  br label %bb185.i

bb84.i:                                           ; preds = %bb78.i
  %105 = getelementptr inbounds i8, ptr %_528.i, i64 872
  %_255.i = load i64, ptr %105, align 8, !noalias !71818, !noundef !2
  %_683.not.i = icmp ult i64 %_255.i, %_853.sroa.0.0.i
  br i1 %_683.not.i, label %bb250.i, label %bb249.i

bb79.i:                                           ; preds = %bb78.i
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_240.i), !noalias !71818
  %106 = getelementptr inbounds i8, ptr %_240.i, i64 32
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %106, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_9032913b93df2a93f8a032d18ba5abf9) #28, !noalias !71818
  %107 = getelementptr inbounds i8, ptr %_240.i, i64 56
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %107, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_9032913b93df2a93f8a032d18ba5abf9) #28, !noalias !71818
  %108 = getelementptr inbounds i8, ptr %_240.i, i64 152
  store i32 6021, ptr %108, align 8, !noalias !71818
  store i64 0, ptr %_240.i, align 8, !noalias !71818
  %_244.sroa.4.0._240.sroa_idx.i = getelementptr inbounds i8, ptr %_240.i, i64 8
  store ptr @alloc_7c3e77a56d18f5cd9334be7ac5c38e2d, ptr %_244.sroa.4.0._240.sroa_idx.i, align 8, !noalias !71818
  %_244.sroa.4.sroa.4.0._244.sroa.4.0._240.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_240.i, i64 16
  store i64 24, ptr %_244.sroa.4.sroa.4.0._244.sroa.4.0._240.sroa_idx.sroa_idx.i, align 8, !noalias !71818
  %_244.sroa.4.sroa.5.0._244.sroa.4.0._240.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_240.i, i64 24
  store i32 151, ptr %_244.sroa.4.sroa.5.0._244.sroa.4.0._240.sroa_idx.sroa_idx.i, align 8, !noalias !71818
  %109 = getelementptr inbounds i8, ptr %_240.i, i64 80
  store i8 2, ptr %109, align 8, !noalias !71818
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %110 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_240.i) #28, !noalias !71818
  %_239.0.i = extractvalue { i64, ptr } %110, 0
  %_239.1.i = extractvalue { i64, ptr } %110, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_240.i), !noalias !71818
  %_249.i = load i64, ptr %80, align 8, !noalias !71818, !noundef !2
; call anchor_lang::error::Error::with_values
  %111 = tail call fastcc { i64, ptr } @_ZN11anchor_lang5error5Error11with_values17h17a91ba7c0882e46E(i64 noundef %_239.0.i, ptr noundef %_239.1.i, i64 noundef %_249.i, i64 noundef %_853.sroa.0.0.i) #28
  %_238.0.i = extractvalue { i64, ptr } %111, 0
  %_238.1.i = extractvalue { i64, ptr } %111, 1
  br label %bb185.i

bb250.i:                                          ; preds = %bb84.i
; call pump_recovered::<impl core::convert::From<pump_recovered::PumpError> for anchor_lang::error::Error>::from
  %112 = tail call { i64, ptr } @"_ZN14pump_recovered108_$LT$impl$u20$core..convert..From$LT$pump_recovered..PumpError$GT$$u20$for$u20$anchor_lang..error..Error$GT$4from17he2863c13b6d46d53E"(i32 noundef 24) #28, !noalias !71818
  %_690.0.i = extractvalue { i64, ptr } %112, 0
  %_690.1.i = extractvalue { i64, ptr } %112, 1
  br label %bb185.i

bb249.i:                                          ; preds = %bb84.i
  %_684.i = sub nuw i64 %_255.i, %_853.sroa.0.0.i
  store i64 %_684.i, ptr %105, align 8, !noalias !71818
  %113 = getelementptr inbounds i8, ptr %_528.i, i64 880
  %_264.i = load i64, ptr %113, align 8, !noalias !71818, !noundef !2
  %114 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %_264.i, i64 %_854.sroa.0.0.i)
  %_694.1.i = extractvalue { i64, i1 } %114, 1
  br i1 %_694.1.i, label %bb253.i, label %bb85.i

bb253.i:                                          ; preds = %bb249.i
; call pump_recovered::<impl core::convert::From<pump_recovered::PumpError> for anchor_lang::error::Error>::from
  %115 = tail call { i64, ptr } @"_ZN14pump_recovered108_$LT$impl$u20$core..convert..From$LT$pump_recovered..PumpError$GT$$u20$for$u20$anchor_lang..error..Error$GT$4from17he2863c13b6d46d53E"(i32 noundef 24) #28, !noalias !71818
  %_700.0.i = extractvalue { i64, ptr } %115, 0
  %_700.1.i = extractvalue { i64, ptr } %115, 1
  br label %bb185.i

bb85.i:                                           ; preds = %bb249.i
  %_694.0.i = extractvalue { i64, i1 } %114, 0
  store i64 %_694.0.i, ptr %113, align 8, !noalias !71818
  %_271.0.i = sub i64 %_235.i, %_853.sroa.0.0.i
  store i64 %_271.0.i, ptr %80, align 8, !noalias !71818
  %116 = getelementptr inbounds i8, ptr %_528.i, i64 896
  %_275.i = load i64, ptr %116, align 8, !noalias !71818, !noundef !2
  %117 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %_275.i, i64 %_854.sroa.0.0.i)
  %_704.1.i = extractvalue { i64, i1 } %117, 1
  br i1 %_704.1.i, label %bb257.i, label %bb258.i

bb258.i:                                          ; preds = %bb85.i
  %_704.0.i = extractvalue { i64, i1 } %117, 0
  store i64 %_704.0.i, ptr %116, align 8, !noalias !71818
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_286.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_289.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_292.i), !noalias !71818
  %118 = getelementptr inbounds i8, ptr %_528.i, i64 232
  %_711.i = load ptr, ptr %118, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %_712.i = load ptr, ptr %_711.i, align 8, !noalias !71818, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_292.i, ptr noundef nonnull align 1 dereferenceable(32) %_712.i, i64 32, i1 false), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %_295.i), !noalias !71818
  %119 = getelementptr inbounds i8, ptr %ctx, i64 33
  %_296.i = load i8, ptr %119, align 1, !alias.scope !71818, !noundef !2
  store i8 %_296.i, ptr %_295.i, align 1, !noalias !71818
  store ptr @alloc_65b7b62d1c393af7ea07c820158a5930, ptr %_289.i, align 8, !noalias !71818
  %120 = getelementptr inbounds i8, ptr %_289.i, i64 8
  store i64 13, ptr %120, align 8, !noalias !71818
  %121 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_289.i, i64 0, i64 1
  store ptr %_292.i, ptr %121, align 8, !noalias !71818
  %122 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_289.i, i64 0, i64 1, i32 1
  store i64 32, ptr %122, align 8, !noalias !71818
  %123 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_289.i, i64 0, i64 2
  store ptr %_295.i, ptr %123, align 8, !noalias !71818
  %124 = getelementptr inbounds [3 x { ptr, i64 }], ptr %_289.i, i64 0, i64 2, i32 1
  store i64 1, ptr %124, align 8, !noalias !71818
  store ptr %_289.i, ptr %_286.i, align 8, !noalias !71818
  %125 = getelementptr inbounds i8, ptr %_286.i, i64 8
  store i64 3, ptr %125, align 8, !noalias !71818
  %126 = getelementptr inbounds i8, ptr %_528.i, i64 192
  %_714.i = load i8, ptr %126, align 8, !noalias !71818, !noundef !2
; call pump_recovered::buy_v2::token_transfers::transfer_curve_tokens_ref
  %127 = call { i64, ptr } @_ZN14pump_recovered6buy_v215token_transfers25transfer_curve_tokens_ref17haf5fedd390ef0253E(ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %token_program.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(216) %associated_bonding_curve.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(216) %associated_user.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %bonding_curve.i, i8 noundef %_714.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_711.i, i64 noundef %_853.sroa.0.0.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(16) %_286.i) #28, !noalias !71818
  %128 = extractvalue { i64, ptr } %127, 0
  %129 = icmp eq i64 %128, 2
  br i1 %129, label %bb262.i, label %bb261.i

bb257.i:                                          ; preds = %bb85.i
; call pump_recovered::<impl core::convert::From<pump_recovered::PumpError> for anchor_lang::error::Error>::from
  %130 = tail call { i64, ptr } @"_ZN14pump_recovered108_$LT$impl$u20$core..convert..From$LT$pump_recovered..PumpError$GT$$u20$for$u20$anchor_lang..error..Error$GT$4from17he2863c13b6d46d53E"(i32 noundef 24) #28, !noalias !71818
  %_710.0.i = extractvalue { i64, ptr } %130, 0
  %_710.1.i = extractvalue { i64, ptr } %130, 1
  br label %bb185.i

bb262.i:                                          ; preds = %bb258.i
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_295.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_292.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_289.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_286.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_299.i), !noalias !71818
  %_720.i = load ptr, ptr %_15.i, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %_721.i = load ptr, ptr %_720.i, align 8, !noalias !71818, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_299.i, ptr noundef nonnull align 1 dereferenceable(32) %_721.i, i64 32, i1 false), !noalias !71818
  %_534.i = load ptr, ptr %6, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %_724.i = getelementptr inbounds i8, ptr %_534.i, i64 648
  %131 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_299.i, ptr noundef nonnull dereferenceable(32) %_724.i, i64 32), !noalias !71818
  %132 = icmp eq i32 %131, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_299.i), !noalias !71818
  br i1 %132, label %bb86.i, label %bb89.i

bb261.i:                                          ; preds = %bb258.i
  %133 = extractvalue { i64, ptr } %127, 1
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_295.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_292.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_289.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_286.i), !noalias !71818
  br label %bb185.i

bb86.i:                                           ; preds = %bb262.i
  %_725.i = getelementptr inbounds i8, ptr %_528.i, i64 304
; call anchor_lang::accounts::account::Account<T>::reload
  %134 = call fastcc { i64, ptr } @"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17hc3ece0ad994fcd5aE"(ptr noalias noundef nonnull align 8 dereferenceable(184) %_725.i) #28, !noalias !71818
  %135 = extractvalue { i64, ptr } %134, 0
  %136 = icmp eq i64 %135, 2
  br i1 %136, label %bb266.i, label %bb265.i

bb89.i:                                           ; preds = %bb271.i, %bb262.i
  %137 = getelementptr inbounds i8, ptr %_528.i, i64 1024
  %_535.i = load ptr, ptr %137, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_317.i), !noalias !71818
  call void @llvm.memset.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_317.i, i8 0, i64 32, i1 false), !noalias !71818
  %_740.i = getelementptr inbounds i8, ptr %_535.i, i64 8
  %138 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %_740.i, ptr noundef nonnull dereferenceable(32) %_317.i, i64 32), !noalias !71818
  %139 = icmp eq i32 %138, 0
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_317.i), !noalias !71818
  br i1 %139, label %bb90.i, label %bb92.i

bb266.i:                                          ; preds = %bb86.i
  %_729.i = getelementptr inbounds i8, ptr %_528.i, i64 520
; call anchor_lang::accounts::account::Account<T>::reload
  %140 = call fastcc { i64, ptr } @"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17hc3ece0ad994fcd5aE"(ptr noalias noundef nonnull align 8 dereferenceable(184) %_729.i) #28, !noalias !71818
  %141 = extractvalue { i64, ptr } %140, 0
  %142 = icmp eq i64 %141, 2
  br i1 %142, label %bb269.i, label %bb268.i

bb265.i:                                          ; preds = %bb86.i
  %143 = extractvalue { i64, ptr } %134, 1
  br label %bb185.i

bb269.i:                                          ; preds = %bb266.i
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %quote_mint.i), !noalias !71818
  %144 = getelementptr inbounds i8, ptr %_528.i, i64 840
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %quote_mint.i, ptr noundef nonnull align 8 dereferenceable(32) %144, i64 32, i1 false), !noalias !71818
  %145 = getelementptr inbounds i8, ptr %_528.i, i64 376
  %_312.i = load i64, ptr %145, align 8, !noalias !71818, !noundef !2
  %146 = getelementptr inbounds i8, ptr %_528.i, i64 592
  %_313.i = load i64, ptr %146, align 8, !noalias !71818, !noundef !2
; call pump_recovered::mayhem_virtual_params::<impl pump_recovered::trade_types::BondingCurve>::sync_virtual_quote_reserves
  %147 = call { i64, ptr } @"_ZN14pump_recovered21mayhem_virtual_params59_$LT$impl$u20$pump_recovered..trade_types..BondingCurve$GT$27sync_virtual_quote_reserves17h0072f1cf30dec0a0E"(ptr noalias noundef nonnull align 8 dereferenceable(160) %_589.i, i64 noundef %_312.i, i64 noundef %_313.i, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %quote_mint.i) #28, !noalias !71818
  %148 = extractvalue { i64, ptr } %147, 0
  %149 = icmp eq i64 %148, 2
  br i1 %149, label %bb271.i, label %bb270.i

bb268.i:                                          ; preds = %bb266.i
  %150 = extractvalue { i64, ptr } %140, 1
  br label %bb185.i

bb271.i:                                          ; preds = %bb269.i
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %quote_mint.i), !noalias !71818
  br label %bb89.i

bb270.i:                                          ; preds = %bb269.i
  %151 = extractvalue { i64, ptr } %147, 1
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %quote_mint.i), !noalias !71818
  br label %bb185.i

bb90.i:                                           ; preds = %bb89.i
  %_742.i = load ptr, ptr %_15.i, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %_743.i = load ptr, ptr %_742.i, align 8, !noalias !71818, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memmove.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %_740.i, ptr noundef nonnull align 1 dereferenceable(32) %_743.i, i64 32, i1 false), !noalias !71818
  br label %bb92.i

bb92.i:                                           ; preds = %bb90.i, %bb89.i
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %mint.i), !noalias !71818
  %_744.i = load ptr, ptr %118, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %_745.i = load ptr, ptr %_744.i, align 8, !noalias !71818, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %mint.i, ptr noundef nonnull align 1 dereferenceable(32) %_745.i, i64 32, i1 false), !noalias !71818
  %152 = icmp eq i64 %_856.sroa.0.0.i, 0
  br i1 %152, label %bb103.i, label %bb93.i

bb103.i:                                          ; preds = %bb282.i, %bb286.i, %bb92.i
  %cashback.sroa.0.0.off0.i = phi i1 [ false, %bb92.i ], [ true, %bb282.i ], [ false, %bb286.i ]
  %_362.i = load ptr, ptr %_14.i, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::user_quote_payments::transfer_native_curve
  %153 = call { i64, ptr } @_ZN14pump_recovered19user_quote_payments21transfer_native_curve17h0795153ef115b1e2E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_362.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_15.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %bonding_curve.i, i64 noundef %_854.sroa.0.0.i) #28, !noalias !71818
  %154 = extractvalue { i64, ptr } %153, 0
  %155 = icmp eq i64 %154, 2
  br i1 %155, label %bb290.i, label %bb169.i

bb93.i:                                           ; preds = %bb92.i
; call pump_recovered::legacy_sell::check_bonding_curve_v2
  %156 = call { i64, ptr } @_ZN14pump_recovered11legacy_sell22check_bonding_curve_v217h7059fb6919cd0ccbE(ptr noalias noundef nonnull readonly align 8 %_530.0.i, i64 noundef %_530.1.i, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %mint.i) #28, !noalias !71818
  %157 = extractvalue { i64, ptr } %156, 0
  %158 = icmp eq i64 %157, 2
  br i1 %158, label %bb275.i, label %bb169.i

bb275.i:                                          ; preds = %bb93.i
  %159 = getelementptr inbounds i8, ptr %_528.i, i64 963
  %160 = load i8, ptr %159, align 1, !range !374, !noalias !71818, !noundef !2
  %_325.not.i = icmp eq i8 %160, 0
  br i1 %_325.not.i, label %bb99.i, label %bb95.i

bb99.i:                                           ; preds = %bb275.i
  %_352.i = getelementptr inbounds i8, ptr %_528.i, i64 704
; call pump_recovered::legacy_buy::native_payments::ensure_rent_exempt
  %161 = call { i64, ptr } @_ZN14pump_recovered10legacy_buy15native_payments18ensure_rent_exempt17h2694562167e4cc15E(ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_14.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_15.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_352.i) #28, !noalias !71818
  %162 = extractvalue { i64, ptr } %161, 0
  %163 = icmp eq i64 %162, 2
  br i1 %163, label %bb286.i, label %bb169.i

bb95.i:                                           ; preds = %bb275.i
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_329.i), !noalias !71818
  %_537.i = load ptr, ptr %137, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %_750.i = load ptr, ptr %_537.i, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_329.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_750.i) #28, !noalias !71818
  %_330.i = load ptr, ptr %_14.i, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::user_quote_payments::transfer_native_owned
  %164 = call { i64, ptr } @_ZN14pump_recovered19user_quote_payments21transfer_native_owned17h62d3b39abf4c4877E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_330.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_15.i, ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_329.i, i64 noundef %_856.sroa.0.0.i) #28, !noalias !71818
  %165 = extractvalue { i64, ptr } %164, 0
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_329.i), !noalias !71818
  %166 = icmp eq i64 %165, 2
  br i1 %166, label %bb279.i, label %bb169.i

bb286.i:                                          ; preds = %bb99.i
  %_356.i = load ptr, ptr %_14.i, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::user_quote_payments::transfer_native_unchecked
  %167 = call { i64, ptr } @_ZN14pump_recovered19user_quote_payments25transfer_native_unchecked17h97f408f976ce1ff5E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_356.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_15.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_352.i, i64 noundef %_856.sroa.0.0.i) #28, !noalias !71818
  %168 = extractvalue { i64, ptr } %167, 0
  %169 = icmp eq i64 %168, 2
  br i1 %169, label %bb103.i, label %bb169.i

bb279.i:                                          ; preds = %bb95.i
  %_538.i = load ptr, ptr %137, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %170 = getelementptr inbounds i8, ptr %_538.i, i64 72
  %_336.i = load i64, ptr %170, align 8, !noalias !71818, !noundef !2
  %171 = call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %_336.i, i64 %_856.sroa.0.0.i)
  %_758.1.i = extractvalue { i64, i1 } %171, 1
  br i1 %_758.1.i, label %bb281.i, label %bb282.i

bb282.i:                                          ; preds = %bb279.i
  %_758.0.i = extractvalue { i64, i1 } %171, 0
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_338.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_339.i), !noalias !71818
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_339.i, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e7ecca184d1801ae8ba4577ecc1a7822) #28, !noalias !71818
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_341.i), !noalias !71818
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %_341.i, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e7ecca184d1801ae8ba4577ecc1a7822) #28, !noalias !71818
  %172 = getelementptr inbounds i8, ptr %_338.i, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %172, ptr noundef nonnull align 8 dereferenceable(24) %_339.i, i64 24, i1 false), !noalias !71818
  %173 = getelementptr inbounds i8, ptr %_338.i, i64 152
  store i32 6024, ptr %173, align 8, !noalias !71818
  %174 = getelementptr inbounds i8, ptr %_338.i, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %174, ptr noundef nonnull align 8 dereferenceable(24) %_341.i, i64 24, i1 false), !noalias !71818
  store i64 0, ptr %_338.i, align 8, !noalias !71818
  %_342.sroa.8.0._338.sroa_idx.i = getelementptr inbounds i8, ptr %_338.i, i64 8
  store ptr @alloc_7c3e77a56d18f5cd9334be7ac5c38e2d, ptr %_342.sroa.8.0._338.sroa_idx.i, align 8, !noalias !71818
  %_342.sroa.8.sroa.8.0._342.sroa.8.0._338.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_338.i, i64 16
  store i64 24, ptr %_342.sroa.8.sroa.8.0._342.sroa.8.0._338.sroa_idx.sroa_idx.i, align 8, !noalias !71818
  %_342.sroa.8.sroa.10.0._342.sroa.8.0._338.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_338.i, i64 24
  store i32 232, ptr %_342.sroa.8.sroa.10.0._342.sroa.8.0._338.sroa_idx.sroa_idx.i, align 8, !noalias !71818
  %175 = getelementptr inbounds i8, ptr %_338.i, i64 80
  store i8 2, ptr %175, align 8, !noalias !71818
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_341.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_339.i), !noalias !71818
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %176 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_338.i) #28, !noalias !71818
  %177 = extractvalue { i64, ptr } %176, 0
  %178 = extractvalue { i64, ptr } %176, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_338.i), !noalias !71818
; call core::ptr::drop_in_place<anchor_lang::error::Error>
  call fastcc void @"_ZN4core3ptr46drop_in_place$LT$anchor_lang..error..Error$GT$17ha40a84cd5ee73fdeE"(i64 %177, ptr %178) #28
  %_539.i = load ptr, ptr %137, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %179 = getelementptr inbounds i8, ptr %_539.i, i64 72
  store i64 %_758.0.i, ptr %179, align 8, !noalias !71818
  br label %bb103.i

bb281.i:                                          ; preds = %bb279.i
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_338.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_339.i), !noalias !71818
; call pump_recovered::PumpError::name
  call void @_ZN14pump_recovered9PumpError4name17h61022c7ff53288d0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_339.i, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e7ecca184d1801ae8ba4577ecc1a7822) #28, !noalias !71818
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_341.i), !noalias !71818
; call <T as alloc::string::ToString>::to_string
  call fastcc void @"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %_341.i, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_e7ecca184d1801ae8ba4577ecc1a7822) #28, !noalias !71818
  %180 = getelementptr inbounds i8, ptr %_338.i, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %180, ptr noundef nonnull align 8 dereferenceable(24) %_339.i, i64 24, i1 false), !noalias !71818
  %181 = getelementptr inbounds i8, ptr %_338.i, i64 152
  store i32 6024, ptr %181, align 8, !noalias !71818
  %182 = getelementptr inbounds i8, ptr %_338.i, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %182, ptr noundef nonnull align 8 dereferenceable(24) %_341.i, i64 24, i1 false), !noalias !71818
  store i64 0, ptr %_338.i, align 8, !noalias !71818
  %_342.sroa.8.0._338.sroa_idx110.i = getelementptr inbounds i8, ptr %_338.i, i64 8
  store ptr @alloc_7c3e77a56d18f5cd9334be7ac5c38e2d, ptr %_342.sroa.8.0._338.sroa_idx110.i, align 8, !noalias !71818
  %_342.sroa.8.sroa.8.0._342.sroa.8.0._338.sroa_idx110.sroa_idx.i = getelementptr inbounds i8, ptr %_338.i, i64 16
  store i64 24, ptr %_342.sroa.8.sroa.8.0._342.sroa.8.0._338.sroa_idx110.sroa_idx.i, align 8, !noalias !71818
  %_342.sroa.8.sroa.10.0._342.sroa.8.0._338.sroa_idx110.sroa_idx.i = getelementptr inbounds i8, ptr %_338.i, i64 24
  store i32 232, ptr %_342.sroa.8.sroa.10.0._342.sroa.8.0._338.sroa_idx110.sroa_idx.i, align 8, !noalias !71818
  %183 = getelementptr inbounds i8, ptr %_338.i, i64 80
  store i8 2, ptr %183, align 8, !noalias !71818
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_341.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_339.i), !noalias !71818
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %184 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17h4ec711440ff80a00E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_338.i) #28, !noalias !71818
  %185 = extractvalue { i64, ptr } %184, 0
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_338.i), !noalias !71818
  br label %bb169.i

bb290.i:                                          ; preds = %bb103.i
  %_540.i = load ptr, ptr %6, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %_369.i = getelementptr inbounds i8, ptr %_540.i, i64 8
  %186 = getelementptr inbounds i8, ptr %_528.i, i64 962
  %187 = load i8, ptr %186, align 2, !range !374, !noalias !71818, !noundef !2
  %_370.i = icmp ne i8 %187, 0
; call pump_recovered::split_protocol_fee
  %188 = call { i64, i64 } @_ZN14pump_recovered18split_protocol_fee17hbfb5cf9863d98b6eE(ptr noalias noundef nonnull readonly align 8 dereferenceable(1080) %_369.i, i64 noundef %_855.sroa.0.0.i, i1 noundef zeroext %_370.i) #28, !noalias !71818
  %_368.0.i = extractvalue { i64, i64 } %188, 0
  %_368.1.i = extractvalue { i64, i64 } %188, 1
  %189 = icmp eq i64 %_368.0.i, 0
  br i1 %189, label %bb108.i, label %bb106.i

bb108.i:                                          ; preds = %bb106.i, %bb290.i
  %_380.i = load ptr, ptr %_14.i, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::user_quote_payments::transfer_native_curve
  %190 = call { i64, ptr } @_ZN14pump_recovered19user_quote_payments21transfer_native_curve17h0795153ef115b1e2E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_380.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_15.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %fee_recipient.i, i64 noundef %_368.1.i) #28, !noalias !71818
  %191 = extractvalue { i64, ptr } %190, 0
  %192 = icmp eq i64 %191, 2
  br i1 %192, label %bb294.i, label %bb169.i

bb106.i:                                          ; preds = %bb290.i
  %_374.i = load ptr, ptr %_14.i, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
; call pump_recovered::user_quote_payments::transfer_native_curve_unchecked
  %193 = call { i64, ptr } @_ZN14pump_recovered19user_quote_payments31transfer_native_curve_unchecked17hd397fca1f639b838E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_374.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %_15.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %buyback_fee_recipient.i, i64 noundef %_368.0.i) #28, !noalias !71818
  %194 = extractvalue { i64, ptr } %193, 0
  %195 = icmp eq i64 %194, 2
  br i1 %195, label %bb108.i, label %bb169.i

bb294.i:                                          ; preds = %bb108.i
  %virtual_token_reserves.i = load i64, ptr %105, align 8, !noalias !71818, !noundef !2
  %virtual_quote_reserves.i = load i64, ptr %113, align 8, !noalias !71818, !noundef !2
  %real_token_reserves.i = load i64, ptr %80, align 8, !noalias !71818, !noundef !2
  %real_quote_reserves.i = load i64, ptr %116, align 8, !noalias !71818, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %creator.i, ptr noundef nonnull align 8 dereferenceable(32) %_589.i, i64 32, i1 false), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_395.i), !noalias !71818
; call solana_sysvar::clock::<impl solana_sysvar::Sysvar for solana_clock::Clock>::get
  call void @"_ZN13solana_sysvar5clock71_$LT$impl$u20$solana_sysvar..Sysvar$u20$for$u20$solana_clock..Clock$GT$3get17hf864a57fc372ac1bE"(ptr noalias nocapture noundef nonnull sret([48 x i8]) align 8 dereferenceable(48) %_395.i) #28, !noalias !71818
  %_785.i = load i64, ptr %_395.i, align 8, !range !389, !noalias !71818, !noundef !2
  %trunc181.not.i = icmp eq i64 %_785.i, 0
  br i1 %trunc181.not.i, label %bb296.i, label %bb295.i

bb296.i:                                          ; preds = %bb294.i
  %_786.sroa.8.0..sroa_idx.i = getelementptr inbounds i8, ptr %_395.i, i64 40
  %_786.sroa.8.0.copyload.i = load i64, ptr %_786.sroa.8.0..sroa_idx.i, align 8, !noalias !71818
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_395.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 424, ptr nonnull %event.i), !noalias !71818
  %_541.i = load ptr, ptr %137, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %196 = getelementptr inbounds i8, ptr %_541.i, i64 40
  %_398.i = load i64, ptr %196, align 8, !noalias !71818, !noundef !2
  %197 = getelementptr inbounds i8, ptr %_541.i, i64 48
  %_399.i = load i64, ptr %197, align 8, !noalias !71818, !noundef !2
  %198 = getelementptr inbounds i8, ptr %_541.i, i64 56
  %_400.i = load i64, ptr %198, align 8, !noalias !71818, !noundef !2
  %199 = getelementptr inbounds i8, ptr %_541.i, i64 64
  %_401.i = load i64, ptr %199, align 8, !noalias !71818, !noundef !2
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_402.i)
  %_791.i = load ptr, ptr %_15.i, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %_792.i = load ptr, ptr %_791.i, align 8, !noalias !71818, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_402.i, ptr noundef nonnull align 1 dereferenceable(32) %_792.i, i64 32, i1 false), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_403.i)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_403.i, ptr noundef nonnull align 1 dereferenceable(32) %mint.i, i64 32, i1 false), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_405.i)
  %_793.i = load ptr, ptr %1, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %_794.i = load ptr, ptr %_793.i, align 8, !noalias !71818, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_405.i, ptr noundef nonnull align 1 dereferenceable(32) %_794.i, i64 32, i1 false), !noalias !71818
  %.._580.sroa.7.0.copyload.i = select i1 %cashback.sroa.0.0.off0.i, i64 0, i64 %._580.sroa.7.0.copyload.i
  %_409.sroa.0.0.i = select i1 %cashback.sroa.0.0.off0.i, i64 0, i64 %_856.sroa.0.0.i
  %200 = getelementptr inbounds i8, ptr %_528.i, i64 965
  %201 = load i8, ptr %200, align 1, !range !374, !noalias !71818, !noundef !2
  %_413.not.i = icmp eq i8 %201, 0
  %_412.sroa.0.0.i = select i1 %_413.not.i, i64 0, i64 %._580.sroa.7.0.copyload.i
  %_415.sroa.0.0.i = select i1 %_413.not.i, i64 0, i64 %_856.sroa.0.0.i
  %202 = load i64, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !71826, !noundef !2
  %203 = icmp eq i64 %202, 0
  %204 = call i64 @llvm.usub.sat.i64(i64 %202, i64 16)
  %205 = select i1 %203, i64 12884934640, i64 %204
  %_15.i.i.i.i.i10.i.i.i = icmp ult i64 %205, 12884901896
  br i1 %_15.i.i.i.i.i10.i.i.i, label %bb3.i203.i, label %"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17hbd34bb5d92c59f68E.exit.i"

bb3.i203.i:                                       ; preds = %bb296.i
; call alloc::raw_vec::handle_error
  call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef 1, i64 16) #29, !noalias !71832
  unreachable

"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17hbd34bb5d92c59f68E.exit.i": ; preds = %bb296.i
  store i64 %205, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !71826
  %206 = inttoptr i64 %205 to ptr
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(16) %206, ptr noundef nonnull align 1 dereferenceable(16) @alloc_550d7884d781858aa06fd1f9f6baa933, i64 16, i1 false), !noalias !71833
  %207 = load i8, ptr %186, align 2, !range !374, !noalias !71818, !noundef !2
  %_422.sroa.0.0.i = select i1 %cashback.sroa.0.0.off0.i, i64 %._580.sroa.7.0.copyload.i, i64 0
  %_424.sroa.0.0.i = select i1 %cashback.sroa.0.0.off0.i, i64 %_856.sroa.0.0.i, i64 0
  %_427.not.i = icmp eq i8 %207, 0
  br i1 %_427.not.i, label %bb130.i, label %bb131.i

bb295.i:                                          ; preds = %bb294.i
  %208 = getelementptr inbounds i8, ptr %_395.i, i64 8
  %_787.sroa.0.0.copyload.i = load i64, ptr %208, align 8, !noalias !71818
  %_787.sroa.5.0..sroa_idx.i = getelementptr inbounds i8, ptr %_395.i, i64 16
  %_787.sroa.5.0.copyload.i = load i64, ptr %_787.sroa.5.0..sroa_idx.i, align 8, !noalias !71818
  %_787.sroa.6.0..sroa_idx.i = getelementptr inbounds i8, ptr %_395.i, i64 24
  %_787.sroa.6.0.copyload.i = load i64, ptr %_787.sroa.6.0..sroa_idx.i, align 8, !noalias !71818
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_395.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_789.i), !noalias !71818
  store i64 %_787.sroa.0.0.copyload.i, ptr %_789.i, align 8, !noalias !71818
  %residual32.sroa.2.0._789.sroa_idx.i = getelementptr inbounds i8, ptr %_789.i, i64 8
  store i64 %_787.sroa.5.0.copyload.i, ptr %residual32.sroa.2.0._789.sroa_idx.i, align 8, !noalias !71818
  %residual32.sroa.3.0._789.sroa_idx.i = getelementptr inbounds i8, ptr %_789.i, i64 16
  store i64 %_787.sroa.6.0.copyload.i, ptr %residual32.sroa.3.0._789.sroa_idx.i, align 8, !noalias !71818
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %209 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17ha4865197be4b9a2fE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_789.i) #28, !noalias !71818
  %_790.0.i = extractvalue { i64, ptr } %209, 0
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_789.i), !noalias !71818
  br label %bb169.i

bb130.i:                                          ; preds = %"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17hbd34bb5d92c59f68E.exit.i"
  %_545.i = load ptr, ptr %6, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %210 = getelementptr inbounds i8, ptr %_545.i, i64 1056
  %211 = load i64, ptr %210, align 8, !noalias !71818, !noundef !2
  br label %bb131.i

bb131.i:                                          ; preds = %bb130.i, %"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17hbd34bb5d92c59f68E.exit.i"
  %_426.sroa.0.0.i = phi i64 [ %211, %bb130.i ], [ 0, %"_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17hbd34bb5d92c59f68E.exit.i" ]
  %212 = getelementptr inbounds i8, ptr %_528.i, i64 840
  %213 = getelementptr inbounds i8, ptr %event.i, i64 328
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %213, ptr noundef nonnull align 8 dereferenceable(32) %212, i64 32, i1 false), !noalias !71818
  %214 = getelementptr inbounds i8, ptr %_528.i, i64 920
  %_432.i = load i64, ptr %214, align 8, !noalias !71818, !noundef !2
  %215 = getelementptr inbounds i8, ptr %event.i, i64 48
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %215, ptr noundef nonnull align 1 dereferenceable(32) %_403.i, i64 32, i1 false), !noalias !71818
  %216 = getelementptr inbounds i8, ptr %event.i, i64 80
  store i64 %_854.sroa.0.0.i, ptr %216, align 8, !noalias !71818
  %217 = getelementptr inbounds i8, ptr %event.i, i64 88
  store i64 %_853.sroa.0.0.i, ptr %217, align 8, !noalias !71818
  %218 = getelementptr inbounds i8, ptr %event.i, i64 416
  store i8 1, ptr %218, align 8, !noalias !71818
  %219 = getelementptr inbounds i8, ptr %event.i, i64 96
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %219, ptr noundef nonnull align 1 dereferenceable(32) %_402.i, i64 32, i1 false), !noalias !71818
  %220 = getelementptr inbounds i8, ptr %event.i, i64 128
  store i64 %_786.sroa.8.0.copyload.i, ptr %220, align 8, !noalias !71818
  %221 = getelementptr inbounds i8, ptr %event.i, i64 136
  store i64 %virtual_quote_reserves.i, ptr %221, align 8, !noalias !71818
  %222 = getelementptr inbounds i8, ptr %event.i, i64 144
  store i64 %virtual_token_reserves.i, ptr %222, align 8, !noalias !71818
  %223 = getelementptr inbounds i8, ptr %event.i, i64 152
  store i64 %real_quote_reserves.i, ptr %223, align 8, !noalias !71818
  %224 = getelementptr inbounds i8, ptr %event.i, i64 160
  store i64 %real_token_reserves.i, ptr %224, align 8, !noalias !71818
  %225 = getelementptr inbounds i8, ptr %event.i, i64 168
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %225, ptr noundef nonnull align 1 dereferenceable(32) %_405.i, i64 32, i1 false), !noalias !71818
  %226 = getelementptr inbounds i8, ptr %event.i, i64 200
  store i64 %._580.sroa.6.0.copyload.i, ptr %226, align 8, !noalias !71818
  %227 = getelementptr inbounds i8, ptr %event.i, i64 208
  store i64 %_855.sroa.0.0.i, ptr %227, align 8, !noalias !71818
  %228 = getelementptr inbounds i8, ptr %event.i, i64 216
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %228, ptr noundef nonnull align 1 dereferenceable(32) %creator.i, i64 32, i1 false), !noalias !71818
  %229 = getelementptr inbounds i8, ptr %event.i, i64 248
  store i64 %.._580.sroa.7.0.copyload.i, ptr %229, align 8, !noalias !71818
  %230 = getelementptr inbounds i8, ptr %event.i, i64 256
  store i64 %_409.sroa.0.0.i, ptr %230, align 8, !noalias !71818
  %231 = getelementptr inbounds i8, ptr %event.i, i64 417
  %232 = zext i1 %track_volume to i8
  store i8 %232, ptr %231, align 1, !noalias !71818
  %233 = getelementptr inbounds i8, ptr %event.i, i64 264
  store i64 %_398.i, ptr %233, align 8, !noalias !71818
  %234 = getelementptr inbounds i8, ptr %event.i, i64 272
  store i64 %_399.i, ptr %234, align 8, !noalias !71818
  %235 = getelementptr inbounds i8, ptr %event.i, i64 280
  store i64 %_400.i, ptr %235, align 8, !noalias !71818
  %236 = getelementptr inbounds i8, ptr %event.i, i64 288
  store i64 %_401.i, ptr %236, align 8, !noalias !71818
  store i64 16, ptr %event.i, align 8, !noalias !71818
  %_418.sroa.4.0.event.sroa_idx.i = getelementptr inbounds i8, ptr %event.i, i64 8
  store ptr %206, ptr %_418.sroa.4.0.event.sroa_idx.i, align 8, !noalias !71818
  %_418.sroa.5.0.event.sroa_idx.i = getelementptr inbounds i8, ptr %event.i, i64 16
  store i64 16, ptr %_418.sroa.5.0.event.sroa_idx.i, align 8, !noalias !71818
  %237 = getelementptr inbounds i8, ptr %event.i, i64 418
  store i8 %207, ptr %237, align 2, !noalias !71818
  %238 = getelementptr inbounds i8, ptr %event.i, i64 296
  store i64 %_422.sroa.0.0.i, ptr %238, align 8, !noalias !71818
  %239 = getelementptr inbounds i8, ptr %event.i, i64 304
  store i64 %_424.sroa.0.0.i, ptr %239, align 8, !noalias !71818
  %240 = getelementptr inbounds i8, ptr %event.i, i64 312
  store i64 %_426.sroa.0.0.i, ptr %240, align 8, !noalias !71818
  %241 = getelementptr inbounds i8, ptr %event.i, i64 320
  store i64 %_368.0.i, ptr %241, align 8, !noalias !71818
  %242 = getelementptr inbounds i8, ptr %event.i, i64 24
  store i64 0, ptr %242, align 8, !noalias !71818
  %_429.sroa.4.0..sroa_idx.i = getelementptr inbounds i8, ptr %event.i, i64 32
  store ptr inttoptr (i64 2 to ptr), ptr %_429.sroa.4.0..sroa_idx.i, align 8, !noalias !71818
  %_429.sroa.5.0..sroa_idx.i = getelementptr inbounds i8, ptr %event.i, i64 40
  store i64 0, ptr %_429.sroa.5.0..sroa_idx.i, align 8, !noalias !71818
  %243 = getelementptr inbounds i8, ptr %event.i, i64 360
  store i64 %_854.sroa.0.0.i, ptr %243, align 8, !noalias !71818
  %244 = getelementptr inbounds i8, ptr %event.i, i64 368
  store i64 %virtual_quote_reserves.i, ptr %244, align 8, !noalias !71818
  %245 = getelementptr inbounds i8, ptr %event.i, i64 376
  store i64 %real_quote_reserves.i, ptr %245, align 8, !noalias !71818
  %246 = getelementptr inbounds i8, ptr %event.i, i64 384
  store i64 %_412.sroa.0.0.i, ptr %246, align 8, !noalias !71818
  %247 = getelementptr inbounds i8, ptr %event.i, i64 392
  store i64 %_415.sroa.0.0.i, ptr %247, align 8, !noalias !71818
  %248 = getelementptr inbounds i8, ptr %event.i, i64 400
  store i64 %_432.i, ptr %248, align 8, !noalias !71818
  %249 = getelementptr inbounds i8, ptr %event.i, i64 408
  store i64 0, ptr %249, align 8, !noalias !71818
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_405.i)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_403.i)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_402.i)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_437.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_439.i), !noalias !71818
; call <pump_recovered::TradeEvent as anchor_lang::Event>::data
  call void @"_ZN65_$LT$pump_recovered..TradeEvent$u20$as$u20$anchor_lang..Event$GT$4data17hefda510981ad5c98E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_439.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(424) %event.i) #28, !noalias !71818
  %250 = getelementptr inbounds i8, ptr %_439.i, i64 8
  %_799.i = load ptr, ptr %250, align 8, !noalias !71818, !nonnull !2, !noundef !2
  %251 = getelementptr inbounds i8, ptr %_439.i, i64 16
  %_798.i = load i64, ptr %251, align 8, !noalias !71818, !noundef !2
  store ptr %_799.i, ptr %_437.i, align 8, !noalias !71818
  %252 = getelementptr inbounds i8, ptr %_437.i, i64 8
  store i64 %_798.i, ptr %252, align 8, !noalias !71818
; call solana_program::log::sol_log_data
  call void @_ZN14solana_program3log12sol_log_data17h1e024b73f122854fE(ptr noalias noundef nonnull readonly align 8 %_437.i, i64 noundef 1) #28, !noalias !71818
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_439.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_437.i), !noalias !71818
  %_442.i = getelementptr inbounds i8, ptr %_528.i, i64 752
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %authority_info.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_442.i) #28, !noalias !71818
  %253 = getelementptr inbounds i8, ptr %ctx, i64 35
  %authority_bump.i = load i8, ptr %253, align 1, !alias.scope !71818, !noundef !2
; call <pump_recovered::TradeEvent as anchor_lang::Event>::data
  call void @"_ZN65_$LT$pump_recovered..TradeEvent$u20$as$u20$anchor_lang..Event$GT$4data17hefda510981ad5c98E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %inner_data.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(424) %event.i) #28, !noalias !71818
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %ix_data.i), !noalias !71818
  %me.sroa.0.0.copyload.i.i = load i64, ptr %inner_data.i, align 8, !alias.scope !71834, !noalias !71837
  %me.sroa.4.0.self.sroa_idx.i.i = getelementptr inbounds i8, ptr %inner_data.i, i64 8
  %me.sroa.4.0.copyload.i.i = load ptr, ptr %me.sroa.4.0.self.sroa_idx.i.i, align 8, !alias.scope !71834, !noalias !71837, !nonnull !2, !noundef !2
  %me.sroa.5.0.self.sroa_idx.i.i = getelementptr inbounds i8, ptr %inner_data.i, i64 16
  %me.sroa.5.0.copyload.i.i = load i64, ptr %me.sroa.5.0.self.sroa_idx.i.i, align 8, !alias.scope !71834, !noalias !71837
  %_18.i.i = getelementptr inbounds i8, ptr %me.sroa.4.0.copyload.i.i, i64 %me.sroa.5.0.copyload.i.i
  %254 = getelementptr inbounds i8, ptr %_448.i, i64 32
  store ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, ptr %254, align 8, !noalias !71818
  %255 = getelementptr inbounds i8, ptr %_448.i, i64 40
  store ptr getelementptr inbounds (<{ [8 x i8] }>, ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, i64 1, i32 0, i64 0), ptr %255, align 8, !noalias !71818
  store ptr %me.sroa.4.0.copyload.i.i, ptr %_448.i, align 8, !noalias !71818
  %_809.sroa.4.0._448.sroa_idx.i = getelementptr inbounds i8, ptr %_448.i, i64 8
  store ptr %me.sroa.4.0.copyload.i.i, ptr %_809.sroa.4.0._448.sroa_idx.i, align 8, !noalias !71818
  %_809.sroa.5.0._448.sroa_idx.i = getelementptr inbounds i8, ptr %_448.i, i64 16
  store i64 %me.sroa.0.0.copyload.i.i, ptr %_809.sroa.5.0._448.sroa_idx.i, align 8, !noalias !71818
  %_809.sroa.6.0._448.sroa_idx.i = getelementptr inbounds i8, ptr %_448.i, i64 24
  store ptr %_18.i.i, ptr %_809.sroa.6.0._448.sroa_idx.i, align 8, !noalias !71818
; call <alloc::vec::Vec<T> as alloc::vec::spec_from_iter::SpecFromIter<T,I>>::from_iter
  call fastcc void @"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h05834ec09ece64f1E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %ix_data.i, ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_448.i) #28, !noalias !71818
  call void @llvm.lifetime.start.p0(i64 80, ptr nonnull %ix.i), !noalias !71818
  %256 = getelementptr inbounds i8, ptr %ix_data.i, i64 8
  %_812.i = load ptr, ptr %256, align 8, !noalias !71818, !nonnull !2, !noundef !2
  %257 = getelementptr inbounds i8, ptr %ix_data.i, i64 16
  %_811.i = load i64, ptr %257, align 8, !noalias !71818, !noundef !2
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_456.i), !noalias !71818
; call alloc::alloc::exchange_malloc
  %_458.i = call fastcc noundef ptr @_ZN5alloc5alloc15exchange_malloc17h6cd8dd11b0e3424eE(i64 noundef 34, i64 noundef 1) #28, !noalias !71818
  %_546.i = load ptr, ptr %authority_info.i, align 8, !noalias !71818, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memmove.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_458.i, ptr noundef nonnull align 1 dereferenceable(32) %_546.i, i64 32, i1 false), !noalias !71818
  %_460.sroa.4.0..sroa_idx.i = getelementptr inbounds i8, ptr %_458.i, i64 32
  store i8 1, ptr %_460.sroa.4.0..sroa_idx.i, align 1, !noalias !71818
  %_460.sroa.5.0..sroa_idx.i = getelementptr inbounds i8, ptr %_458.i, i64 33
  store i8 0, ptr %_460.sroa.5.0..sroa_idx.i, align 1, !noalias !71818
  store i64 1, ptr %_456.i, align 8, !alias.scope !71839, !noalias !71842
  %258 = getelementptr inbounds i8, ptr %_456.i, i64 8
  store ptr %_458.i, ptr %258, align 8, !alias.scope !71839, !noalias !71842
  %259 = getelementptr inbounds i8, ptr %_456.i, i64 16
  store i64 1, ptr %259, align 8, !alias.scope !71839, !noalias !71842
; call solana_instruction::Instruction::new_with_bytes
  call void @_ZN18solana_instruction11Instruction14new_with_bytes17h836fab8fb6401158E(ptr noalias nocapture noundef nonnull sret([80 x i8]) align 8 dereferenceable(80) %ix.i, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) @_ZN14pump_recovered2ID17h8e245cf89cf2c06bE, ptr noalias noundef nonnull readonly align 1 %_812.i, i64 noundef %_811.i, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_456.i) #28, !noalias !71818
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_456.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_468.i), !noalias !71818
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %_468.i, ptr noundef nonnull align 8 dereferenceable(48) %authority_info.i, i64 48, i1 false), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_471.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_474.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %_478.i), !noalias !71818
  store i8 %authority_bump.i, ptr %_478.i, align 1, !noalias !71818
  store ptr @alloc_7a7952b5e0d15f2b72d0341cef6d4739, ptr %_474.i, align 8, !noalias !71818
  %260 = getelementptr inbounds i8, ptr %_474.i, i64 8
  store i64 17, ptr %260, align 8, !noalias !71818
  %261 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_474.i, i64 0, i64 1
  store ptr %_478.i, ptr %261, align 8, !noalias !71818
  %262 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_474.i, i64 0, i64 1, i32 1
  store i64 1, ptr %262, align 8, !noalias !71818
  store ptr %_474.i, ptr %_471.i, align 8, !noalias !71818
  %263 = getelementptr inbounds i8, ptr %_471.i, i64 8
  store i64 2, ptr %263, align 8, !noalias !71818
; call solana_program::program::invoke_signed
  call void @_ZN14solana_program7program13invoke_signed17h01c3b84bc1fc491eE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_464.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(80) %ix.i, ptr noalias noundef nonnull readonly align 8 %_468.i, i64 noundef 1, ptr noalias noundef nonnull readonly align 8 %_471.i, i64 noundef 1) #28, !noalias !71818
  %264 = load i64, ptr %_464.i, align 8, !range !366, !noalias !71818, !noundef !2
  %265 = icmp eq i64 %264, -9223372036854775782
  br i1 %265, label %bb303.i, label %bb302.i

bb303.i:                                          ; preds = %bb131.i
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_478.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_474.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_471.i), !noalias !71818
  %266 = getelementptr inbounds i8, ptr %_468.i, i64 8
  %_468.val201.i = load ptr, ptr %266, align 8, !noalias !71818, !nonnull !2, !noundef !2
  %267 = getelementptr inbounds i8, ptr %_468.i, i64 16
  %_468.val202.i = load ptr, ptr %267, align 8, !noalias !71818
  %self1.val.i.i.i.i.i = load i64, ptr %_468.val201.i, align 8, !noalias !71818, !noundef !2
  %val.i.i.i.i.i = add i64 %self1.val.i.i.i.i.i, -1
  store i64 %val.i.i.i.i.i, ptr %_468.val201.i, align 8, !noalias !71818
  %268 = icmp eq i64 %val.i.i.i.i.i, 0
  br i1 %268, label %bb1.i.i.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i.i"

bb1.i.i.i.i.i:                                    ; preds = %bb303.i
  %269 = getelementptr i8, ptr %_468.val201.i, i64 8
  %self2.val.i.i.i.i.i = load i64, ptr %269, align 8, !noalias !71818, !noundef !2
  %val6.i.i.i.i.i = add i64 %self2.val.i.i.i.i.i, -1
  store i64 %val6.i.i.i.i.i, ptr %269, align 8, !noalias !71818
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i.i": ; preds = %bb1.i.i.i.i.i, %bb303.i
  %270 = icmp ne ptr %_468.val202.i, null
  call void @llvm.assume(i1 %270)
  %self1.val.i.i2.i.i.i = load i64, ptr %_468.val202.i, align 8, !noalias !71818, !noundef !2
  %val.i.i3.i.i.i = add i64 %self1.val.i.i2.i.i.i, -1
  store i64 %val.i.i3.i.i.i, ptr %_468.val202.i, align 8, !noalias !71818
  %271 = icmp eq i64 %val.i.i3.i.i.i, 0
  br i1 %271, label %bb1.i.i4.i.i.i, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit.i"

bb1.i.i4.i.i.i:                                   ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i.i"
  %272 = getelementptr i8, ptr %_468.val202.i, i64 8
  %self2.val.i.i5.i.i.i = load i64, ptr %272, align 8, !noalias !71818, !noundef !2
  %val6.i.i6.i.i.i = add i64 %self2.val.i.i5.i.i.i, -1
  store i64 %val6.i.i6.i.i.i, ptr %272, align 8, !noalias !71818
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit.i"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit.i": ; preds = %bb1.i.i4.i.i.i, %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i.i"
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_468.i), !noalias !71818
  %_1.val.i.i = load i64, ptr %ix.i, align 8, !alias.scope !71844, !noalias !71818, !noundef !2
  %273 = icmp eq i64 %_1.val.i.i, 0
  br i1 %273, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i.i", label %bb2.i.i.i.i.i

bb2.i.i.i.i.i:                                    ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit.i"
  %274 = getelementptr inbounds i8, ptr %ix.i, i64 8
  %_1.val2.i.i = load ptr, ptr %274, align 8, !alias.scope !71844, !noalias !71818
  %275 = icmp ne ptr %_1.val2.i.i, null
  call void @llvm.assume(i1 %275)
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i.i"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i.i": ; preds = %bb2.i.i.i.i.i, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit.i"
  %276 = getelementptr inbounds i8, ptr %ix.i, i64 24
  %.val.i.i = load i64, ptr %276, align 8, !alias.scope !71844, !noalias !71818, !noundef !2
  %277 = icmp eq i64 %.val.i.i, 0
  br i1 %277, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i.i"
  %278 = getelementptr inbounds i8, ptr %ix.i, i64 32
  %.val1.i.i = load ptr, ptr %278, align 8, !alias.scope !71844, !noalias !71818
  %279 = icmp ne ptr %.val1.i.i, null
  call void @llvm.assume(i1 %279)
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit.i"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i", %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i.i"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data.i), !noalias !71818
  %_480.i = load i64, ptr %80, align 8, !noalias !71818, !noundef !2
  %280 = icmp eq i64 %_480.i, 0
  br i1 %280, label %bb143.i, label %bb156.i

bb302.i:                                          ; preds = %bb131.i
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %281 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17ha4865197be4b9a2fE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_464.i) #28, !noalias !71818
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_478.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_474.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_471.i), !noalias !71818
  %282 = getelementptr inbounds i8, ptr %_468.i, i64 8
  %_468.val.i = load ptr, ptr %282, align 8, !noalias !71818, !nonnull !2, !noundef !2
  %283 = getelementptr inbounds i8, ptr %_468.i, i64 16
  %_468.val197.i = load ptr, ptr %283, align 8, !noalias !71818
  %self1.val.i.i.i.i206.i = load i64, ptr %_468.val.i, align 8, !noalias !71818, !noundef !2
  %val.i.i.i.i207.i = add i64 %self1.val.i.i.i.i206.i, -1
  store i64 %val.i.i.i.i207.i, ptr %_468.val.i, align 8, !noalias !71818
  %284 = icmp eq i64 %val.i.i.i.i207.i, 0
  br i1 %284, label %bb1.i.i.i.i214.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i208.i"

bb1.i.i.i.i214.i:                                 ; preds = %bb302.i
  %285 = getelementptr i8, ptr %_468.val.i, i64 8
  %self2.val.i.i.i.i215.i = load i64, ptr %285, align 8, !noalias !71818, !noundef !2
  %val6.i.i.i.i216.i = add i64 %self2.val.i.i.i.i215.i, -1
  store i64 %val6.i.i.i.i216.i, ptr %285, align 8, !noalias !71818
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i208.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i208.i": ; preds = %bb1.i.i.i.i214.i, %bb302.i
  %286 = icmp ne ptr %_468.val197.i, null
  call void @llvm.assume(i1 %286)
  %self1.val.i.i2.i.i209.i = load i64, ptr %_468.val197.i, align 8, !noalias !71818, !noundef !2
  %val.i.i3.i.i210.i = add i64 %self1.val.i.i2.i.i209.i, -1
  store i64 %val.i.i3.i.i210.i, ptr %_468.val197.i, align 8, !noalias !71818
  %287 = icmp eq i64 %val.i.i3.i.i210.i, 0
  br i1 %287, label %bb1.i.i4.i.i211.i, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit217.i"

bb1.i.i4.i.i211.i:                                ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i208.i"
  %288 = getelementptr i8, ptr %_468.val197.i, i64 8
  %self2.val.i.i5.i.i212.i = load i64, ptr %288, align 8, !noalias !71818, !noundef !2
  %val6.i.i6.i.i213.i = add i64 %self2.val.i.i5.i.i212.i, -1
  store i64 %val6.i.i6.i.i213.i, ptr %288, align 8, !noalias !71818
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit217.i"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit217.i": ; preds = %bb1.i.i4.i.i211.i, %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i208.i"
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_468.i), !noalias !71818
  %_1.val.i218.i = load i64, ptr %ix.i, align 8, !alias.scope !71847, !noalias !71818, !noundef !2
  %289 = icmp eq i64 %_1.val.i218.i, 0
  br i1 %289, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i221.i", label %bb2.i.i.i.i219.i

bb2.i.i.i.i219.i:                                 ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit217.i"
  %290 = getelementptr inbounds i8, ptr %ix.i, i64 8
  %_1.val2.i220.i = load ptr, ptr %290, align 8, !alias.scope !71847, !noalias !71818
  %291 = icmp ne ptr %_1.val2.i220.i, null
  call void @llvm.assume(i1 %291)
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i221.i"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i221.i": ; preds = %bb2.i.i.i.i219.i, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit217.i"
  %292 = getelementptr inbounds i8, ptr %ix.i, i64 24
  %.val.i222.i = load i64, ptr %292, align 8, !alias.scope !71847, !noalias !71818, !noundef !2
  %293 = icmp eq i64 %.val.i222.i, 0
  br i1 %293, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit225.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i223.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i223.i": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i221.i"
  %294 = getelementptr inbounds i8, ptr %ix.i, i64 32
  %.val1.i224.i = load ptr, ptr %294, align 8, !alias.scope !71847, !noalias !71818
  %295 = icmp ne ptr %.val1.i224.i, null
  call void @llvm.assume(i1 %295)
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit225.i"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit225.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i223.i", %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i221.i"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data.i), !noalias !71818
  br label %bb164.i

bb143.i:                                          ; preds = %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit.i"
  store i8 1, ptr %17, align 1, !noalias !71818
  call void @llvm.lifetime.start.p0(i64 136, ptr nonnull %event34.i), !noalias !71818
  %296 = getelementptr inbounds i8, ptr %event34.i, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %296, ptr noundef nonnull align 1 dereferenceable(32) %mint.i, i64 32, i1 false), !noalias !71818
  %_822.i = load ptr, ptr %_15.i, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %_823.i = load ptr, ptr %_822.i, align 8, !noalias !71818, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %event34.i, ptr noundef nonnull align 1 dereferenceable(32) %_823.i, i64 32, i1 false), !noalias !71818
  %_824.i = load ptr, ptr %2, align 8, !noalias !71818, !nonnull !2, !align !3, !noundef !2
  %_825.i = load ptr, ptr %_824.i, align 8, !noalias !71818, !nonnull !2, !align !372, !noundef !2
  %297 = getelementptr inbounds i8, ptr %event34.i, i64 64
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %297, ptr noundef nonnull align 1 dereferenceable(32) %_825.i, i64 32, i1 false), !noalias !71818
  %298 = getelementptr inbounds i8, ptr %event34.i, i64 96
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %298, ptr noundef nonnull align 8 dereferenceable(32) %212, i64 32, i1 false), !noalias !71818
  %299 = getelementptr inbounds i8, ptr %event34.i, i64 128
  store i64 %_786.sroa.8.0.copyload.i, ptr %299, align 8, !noalias !71818
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_489.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_491.i), !noalias !71818
; call <pump_recovered::trade_types::CompleteEvent as anchor_lang::Event>::data
  call void @"_ZN81_$LT$pump_recovered..trade_types..CompleteEvent$u20$as$u20$anchor_lang..Event$GT$4data17h582ffa9b1add2426E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_491.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(136) %event34.i) #28, !noalias !71818
  %300 = getelementptr inbounds i8, ptr %_491.i, i64 8
  %_828.i = load ptr, ptr %300, align 8, !noalias !71818, !nonnull !2, !noundef !2
  %301 = getelementptr inbounds i8, ptr %_491.i, i64 16
  %_827.i = load i64, ptr %301, align 8, !noalias !71818, !noundef !2
  store ptr %_828.i, ptr %_489.i, align 8, !noalias !71818
  %302 = getelementptr inbounds i8, ptr %_489.i, i64 8
  store i64 %_827.i, ptr %302, align 8, !noalias !71818
; call solana_program::log::sol_log_data
  call void @_ZN14solana_program3log12sol_log_data17h1e024b73f122854fE(ptr noalias noundef nonnull readonly align 8 %_489.i, i64 noundef 1) #28, !noalias !71818
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_491.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_489.i), !noalias !71818
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h759150bcde62cc00E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %authority_info35.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_442.i) #28, !noalias !71818
; call <pump_recovered::trade_types::CompleteEvent as anchor_lang::Event>::data
  call void @"_ZN81_$LT$pump_recovered..trade_types..CompleteEvent$u20$as$u20$anchor_lang..Event$GT$4data17h582ffa9b1add2426E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %inner_data36.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(136) %event34.i) #28, !noalias !71818
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %ix_data37.i), !noalias !71818
  %me.sroa.0.0.copyload.i230.i = load i64, ptr %inner_data36.i, align 8, !alias.scope !71850, !noalias !71853
  %me.sroa.4.0.self.sroa_idx.i231.i = getelementptr inbounds i8, ptr %inner_data36.i, i64 8
  %me.sroa.4.0.copyload.i232.i = load ptr, ptr %me.sroa.4.0.self.sroa_idx.i231.i, align 8, !alias.scope !71850, !noalias !71853, !nonnull !2, !noundef !2
  %me.sroa.5.0.self.sroa_idx.i233.i = getelementptr inbounds i8, ptr %inner_data36.i, i64 16
  %me.sroa.5.0.copyload.i234.i = load i64, ptr %me.sroa.5.0.self.sroa_idx.i233.i, align 8, !alias.scope !71850, !noalias !71853
  %_18.i235.i = getelementptr inbounds i8, ptr %me.sroa.4.0.copyload.i232.i, i64 %me.sroa.5.0.copyload.i234.i
  %303 = getelementptr inbounds i8, ptr %_498.i, i64 32
  store ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, ptr %303, align 8, !noalias !71818
  %304 = getelementptr inbounds i8, ptr %_498.i, i64 40
  store ptr getelementptr inbounds (<{ [8 x i8] }>, ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, i64 1, i32 0, i64 0), ptr %304, align 8, !noalias !71818
  store ptr %me.sroa.4.0.copyload.i232.i, ptr %_498.i, align 8, !noalias !71818
  %_838.sroa.4.0._498.sroa_idx.i = getelementptr inbounds i8, ptr %_498.i, i64 8
  store ptr %me.sroa.4.0.copyload.i232.i, ptr %_838.sroa.4.0._498.sroa_idx.i, align 8, !noalias !71818
  %_838.sroa.5.0._498.sroa_idx.i = getelementptr inbounds i8, ptr %_498.i, i64 16
  store i64 %me.sroa.0.0.copyload.i230.i, ptr %_838.sroa.5.0._498.sroa_idx.i, align 8, !noalias !71818
  %_838.sroa.6.0._498.sroa_idx.i = getelementptr inbounds i8, ptr %_498.i, i64 24
  store ptr %_18.i235.i, ptr %_838.sroa.6.0._498.sroa_idx.i, align 8, !noalias !71818
; call <alloc::vec::Vec<T> as alloc::vec::spec_from_iter::SpecFromIter<T,I>>::from_iter
  call fastcc void @"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h05834ec09ece64f1E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %ix_data37.i, ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_498.i) #28, !noalias !71818
  call void @llvm.lifetime.start.p0(i64 80, ptr nonnull %ix38.i), !noalias !71818
  %305 = getelementptr inbounds i8, ptr %ix_data37.i, i64 8
  %_841.i = load ptr, ptr %305, align 8, !noalias !71818, !nonnull !2, !noundef !2
  %306 = getelementptr inbounds i8, ptr %ix_data37.i, i64 16
  %_840.i = load i64, ptr %306, align 8, !noalias !71818, !noundef !2
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_504.i), !noalias !71818
; call alloc::alloc::exchange_malloc
  %_506.i = call fastcc noundef ptr @_ZN5alloc5alloc15exchange_malloc17h6cd8dd11b0e3424eE(i64 noundef 34, i64 noundef 1) #28, !noalias !71818
  %_547.i = load ptr, ptr %authority_info35.i, align 8, !noalias !71818, !nonnull !2, !align !372, !noundef !2
  call void @llvm.memmove.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_506.i, ptr noundef nonnull align 1 dereferenceable(32) %_547.i, i64 32, i1 false), !noalias !71818
  %_508.sroa.4.0..sroa_idx.i = getelementptr inbounds i8, ptr %_506.i, i64 32
  store i8 1, ptr %_508.sroa.4.0..sroa_idx.i, align 1, !noalias !71818
  %_508.sroa.5.0..sroa_idx.i = getelementptr inbounds i8, ptr %_506.i, i64 33
  store i8 0, ptr %_508.sroa.5.0..sroa_idx.i, align 1, !noalias !71818
  store i64 1, ptr %_504.i, align 8, !alias.scope !71855, !noalias !71858
  %307 = getelementptr inbounds i8, ptr %_504.i, i64 8
  store ptr %_506.i, ptr %307, align 8, !alias.scope !71855, !noalias !71858
  %308 = getelementptr inbounds i8, ptr %_504.i, i64 16
  store i64 1, ptr %308, align 8, !alias.scope !71855, !noalias !71858
; call solana_instruction::Instruction::new_with_bytes
  call void @_ZN18solana_instruction11Instruction14new_with_bytes17h836fab8fb6401158E(ptr noalias nocapture noundef nonnull sret([80 x i8]) align 8 dereferenceable(80) %ix38.i, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) @_ZN14pump_recovered2ID17h8e245cf89cf2c06bE, ptr noalias noundef nonnull readonly align 1 %_841.i, i64 noundef %_840.i, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_504.i) #28, !noalias !71818
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_504.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_516.i), !noalias !71818
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %_516.i, ptr noundef nonnull align 8 dereferenceable(48) %authority_info35.i, i64 48, i1 false), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_519.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_522.i), !noalias !71818
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %_526.i), !noalias !71818
  store i8 %authority_bump.i, ptr %_526.i, align 1, !noalias !71818
  store ptr @alloc_7a7952b5e0d15f2b72d0341cef6d4739, ptr %_522.i, align 8, !noalias !71818
  %309 = getelementptr inbounds i8, ptr %_522.i, i64 8
  store i64 17, ptr %309, align 8, !noalias !71818
  %310 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_522.i, i64 0, i64 1
  store ptr %_526.i, ptr %310, align 8, !noalias !71818
  %311 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_522.i, i64 0, i64 1, i32 1
  store i64 1, ptr %311, align 8, !noalias !71818
  store ptr %_522.i, ptr %_519.i, align 8, !noalias !71818
  %312 = getelementptr inbounds i8, ptr %_519.i, i64 8
  store i64 2, ptr %312, align 8, !noalias !71818
; call solana_program::program::invoke_signed
  call void @_ZN14solana_program7program13invoke_signed17h01c3b84bc1fc491eE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_512.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(80) %ix38.i, ptr noalias noundef nonnull readonly align 8 %_516.i, i64 noundef 1, ptr noalias noundef nonnull readonly align 8 %_519.i, i64 noundef 1) #28, !noalias !71818
  %313 = load i64, ptr %_512.i, align 8, !range !366, !noalias !71818, !noundef !2
  %314 = icmp eq i64 %313, -9223372036854775782
  br i1 %314, label %bb309.i, label %bb308.i

bb309.i:                                          ; preds = %bb143.i
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_526.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_522.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_519.i), !noalias !71818
  %315 = getelementptr inbounds i8, ptr %_516.i, i64 8
  %_516.val199.i = load ptr, ptr %315, align 8, !noalias !71818, !nonnull !2, !noundef !2
  %316 = getelementptr inbounds i8, ptr %_516.i, i64 16
  %_516.val200.i = load ptr, ptr %316, align 8, !noalias !71818
  %self1.val.i.i.i.i236.i = load i64, ptr %_516.val199.i, align 8, !noalias !71818, !noundef !2
  %val.i.i.i.i237.i = add i64 %self1.val.i.i.i.i236.i, -1
  store i64 %val.i.i.i.i237.i, ptr %_516.val199.i, align 8, !noalias !71818
  %317 = icmp eq i64 %val.i.i.i.i237.i, 0
  br i1 %317, label %bb1.i.i.i.i244.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i238.i"

bb1.i.i.i.i244.i:                                 ; preds = %bb309.i
  %318 = getelementptr i8, ptr %_516.val199.i, i64 8
  %self2.val.i.i.i.i245.i = load i64, ptr %318, align 8, !noalias !71818, !noundef !2
  %val6.i.i.i.i246.i = add i64 %self2.val.i.i.i.i245.i, -1
  store i64 %val6.i.i.i.i246.i, ptr %318, align 8, !noalias !71818
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i238.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i238.i": ; preds = %bb1.i.i.i.i244.i, %bb309.i
  %319 = icmp ne ptr %_516.val200.i, null
  call void @llvm.assume(i1 %319)
  %self1.val.i.i2.i.i239.i = load i64, ptr %_516.val200.i, align 8, !noalias !71818, !noundef !2
  %val.i.i3.i.i240.i = add i64 %self1.val.i.i2.i.i239.i, -1
  store i64 %val.i.i3.i.i240.i, ptr %_516.val200.i, align 8, !noalias !71818
  %320 = icmp eq i64 %val.i.i3.i.i240.i, 0
  br i1 %320, label %bb1.i.i4.i.i241.i, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit247.i"

bb1.i.i4.i.i241.i:                                ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i238.i"
  %321 = getelementptr i8, ptr %_516.val200.i, i64 8
  %self2.val.i.i5.i.i242.i = load i64, ptr %321, align 8, !noalias !71818, !noundef !2
  %val6.i.i6.i.i243.i = add i64 %self2.val.i.i5.i.i242.i, -1
  store i64 %val6.i.i6.i.i243.i, ptr %321, align 8, !noalias !71818
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit247.i"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit247.i": ; preds = %bb1.i.i4.i.i241.i, %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i238.i"
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_516.i), !noalias !71818
  %_1.val.i248.i = load i64, ptr %ix38.i, align 8, !alias.scope !71860, !noalias !71818, !noundef !2
  %322 = icmp eq i64 %_1.val.i248.i, 0
  br i1 %322, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i251.i", label %bb2.i.i.i.i249.i

bb2.i.i.i.i249.i:                                 ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit247.i"
  %323 = getelementptr inbounds i8, ptr %ix38.i, i64 8
  %_1.val2.i250.i = load ptr, ptr %323, align 8, !alias.scope !71860, !noalias !71818
  %324 = icmp ne ptr %_1.val2.i250.i, null
  call void @llvm.assume(i1 %324)
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i251.i"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i251.i": ; preds = %bb2.i.i.i.i249.i, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit247.i"
  %325 = getelementptr inbounds i8, ptr %ix38.i, i64 24
  %.val.i252.i = load i64, ptr %325, align 8, !alias.scope !71860, !noalias !71818, !noundef !2
  %326 = icmp eq i64 %.val.i252.i, 0
  br i1 %326, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit255.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i253.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i253.i": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i251.i"
  %327 = getelementptr inbounds i8, ptr %ix38.i, i64 32
  %.val1.i254.i = load ptr, ptr %327, align 8, !alias.scope !71860, !noalias !71818
  %328 = icmp ne ptr %.val1.i254.i, null
  call void @llvm.assume(i1 %328)
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit255.i"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit255.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i253.i", %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i251.i"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix38.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data37.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 136, ptr nonnull %event34.i), !noalias !71818
  br label %bb156.i

bb308.i:                                          ; preds = %bb143.i
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %329 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17ha4865197be4b9a2fE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_512.i) #28, !noalias !71818
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_526.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_522.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_519.i), !noalias !71818
  %330 = getelementptr inbounds i8, ptr %_516.i, i64 8
  %_516.val.i = load ptr, ptr %330, align 8, !noalias !71818, !nonnull !2, !noundef !2
  %331 = getelementptr inbounds i8, ptr %_516.i, i64 16
  %_516.val198.i = load ptr, ptr %331, align 8, !noalias !71818
  %self1.val.i.i.i.i258.i = load i64, ptr %_516.val.i, align 8, !noalias !71818, !noundef !2
  %val.i.i.i.i259.i = add i64 %self1.val.i.i.i.i258.i, -1
  store i64 %val.i.i.i.i259.i, ptr %_516.val.i, align 8, !noalias !71818
  %332 = icmp eq i64 %val.i.i.i.i259.i, 0
  br i1 %332, label %bb1.i.i.i.i266.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i260.i"

bb1.i.i.i.i266.i:                                 ; preds = %bb308.i
  %333 = getelementptr i8, ptr %_516.val.i, i64 8
  %self2.val.i.i.i.i267.i = load i64, ptr %333, align 8, !noalias !71818, !noundef !2
  %val6.i.i.i.i268.i = add i64 %self2.val.i.i.i.i267.i, -1
  store i64 %val6.i.i.i.i268.i, ptr %333, align 8, !noalias !71818
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i260.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i260.i": ; preds = %bb1.i.i.i.i266.i, %bb308.i
  %334 = icmp ne ptr %_516.val198.i, null
  call void @llvm.assume(i1 %334)
  %self1.val.i.i2.i.i261.i = load i64, ptr %_516.val198.i, align 8, !noalias !71818, !noundef !2
  %val.i.i3.i.i262.i = add i64 %self1.val.i.i2.i.i261.i, -1
  store i64 %val.i.i3.i.i262.i, ptr %_516.val198.i, align 8, !noalias !71818
  %335 = icmp eq i64 %val.i.i3.i.i262.i, 0
  br i1 %335, label %bb1.i.i4.i.i263.i, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit269.i"

bb1.i.i4.i.i263.i:                                ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i260.i"
  %336 = getelementptr i8, ptr %_516.val198.i, i64 8
  %self2.val.i.i5.i.i264.i = load i64, ptr %336, align 8, !noalias !71818, !noundef !2
  %val6.i.i6.i.i265.i = add i64 %self2.val.i.i5.i.i264.i, -1
  store i64 %val6.i.i6.i.i265.i, ptr %336, align 8, !noalias !71818
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit269.i"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit269.i": ; preds = %bb1.i.i4.i.i263.i, %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h78933b33a7933ef9E.exit.i.i260.i"
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_516.i), !noalias !71818
  %_1.val.i270.i = load i64, ptr %ix38.i, align 8, !alias.scope !71863, !noalias !71818, !noundef !2
  %337 = icmp eq i64 %_1.val.i270.i, 0
  br i1 %337, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i273.i", label %bb2.i.i.i.i271.i

bb2.i.i.i.i271.i:                                 ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit269.i"
  %338 = getelementptr inbounds i8, ptr %ix38.i, i64 8
  %_1.val2.i272.i = load ptr, ptr %338, align 8, !alias.scope !71863, !noalias !71818
  %339 = icmp ne ptr %_1.val2.i272.i, null
  call void @llvm.assume(i1 %339)
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i273.i"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i273.i": ; preds = %bb2.i.i.i.i271.i, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17h907ee5ac84b0815bE.exit269.i"
  %340 = getelementptr inbounds i8, ptr %ix38.i, i64 24
  %.val.i274.i = load i64, ptr %340, align 8, !alias.scope !71863, !noalias !71818, !noundef !2
  %341 = icmp eq i64 %.val.i274.i, 0
  br i1 %341, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit277.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i275.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i275.i": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i273.i"
  %342 = getelementptr inbounds i8, ptr %ix38.i, i64 32
  %.val1.i276.i = load ptr, ptr %342, align 8, !alias.scope !71863, !noalias !71818
  %343 = icmp ne ptr %.val1.i276.i, null
  call void @llvm.assume(i1 %343)
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit277.i"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit277.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i275.i", %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h57f29fa0325d9f10E.exit.i273.i"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix38.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data37.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 136, ptr nonnull %event34.i), !noalias !71818
  br label %bb164.i

bb156.i:                                          ; preds = %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit255.i", %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit.i"
  %_1.val.i.i.i = load i64, ptr %event.i, align 8, !alias.scope !71866, !noalias !71818, !noundef !2
  %344 = icmp eq i64 %_1.val.i.i.i, 0
  br i1 %344, label %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h9dae8b4f052b6b2eE.exit.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i": ; preds = %bb156.i
  %_1.val1.i.i.i = load ptr, ptr %_418.sroa.4.0.event.sroa_idx.i, align 8, !alias.scope !71866, !noalias !71818
  %345 = icmp ne ptr %_1.val1.i.i.i, null
  call void @llvm.assume(i1 %345)
  br label %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h9dae8b4f052b6b2eE.exit.i"

"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h9dae8b4f052b6b2eE.exit.i": ; preds = %bb156.i, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i"
  call void @llvm.lifetime.end.p0(i64 424, ptr nonnull %event.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %mint.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 8, ptr nonnull %buyback_fee_recipient.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 8, ptr nonnull %bonding_curve.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 8, ptr nonnull %fee_recipient.i), !noalias !71818
  br label %_ZN14pump_recovered10legacy_buy16buy_exact_sol_in17h72ae36cf36913665E.exit

bb164.i:                                          ; preds = %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit277.i", %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit225.i"
  %.pn182.i = phi { i64, ptr } [ %329, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit277.i" ], [ %281, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h3ecb6a9b9e1b11acE.exit225.i" ]
  %_0.sroa.0.3.i = extractvalue { i64, ptr } %.pn182.i, 0
  %_1.val.i.i283.i = load i64, ptr %event.i, align 8, !alias.scope !71871, !noalias !71818, !noundef !2
  %346 = icmp eq i64 %_1.val.i.i283.i, 0
  br i1 %346, label %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h9dae8b4f052b6b2eE.exit290.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i284.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i284.i": ; preds = %bb164.i
  %_1.val1.i.i285.i = load ptr, ptr %_418.sroa.4.0.event.sroa_idx.i, align 8, !alias.scope !71871, !noalias !71818
  %347 = icmp ne ptr %_1.val1.i.i285.i, null
  call void @llvm.assume(i1 %347)
  br label %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h9dae8b4f052b6b2eE.exit290.i"

"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h9dae8b4f052b6b2eE.exit290.i": ; preds = %bb164.i, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i284.i"
  call void @llvm.lifetime.end.p0(i64 424, ptr nonnull %event.i), !noalias !71818
  br label %bb169.i

bb169.i:                                          ; preds = %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h9dae8b4f052b6b2eE.exit290.i", %bb295.i, %bb106.i, %bb108.i, %bb281.i, %bb286.i, %bb95.i, %bb99.i, %bb93.i, %bb103.i
  %.pn297.i = phi { i64, ptr } [ %209, %bb295.i ], [ %.pn182.i, %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h9dae8b4f052b6b2eE.exit290.i" ], [ %184, %bb281.i ], [ %156, %bb93.i ], [ %161, %bb99.i ], [ %167, %bb286.i ], [ %164, %bb95.i ], [ %153, %bb103.i ], [ %193, %bb106.i ], [ %190, %bb108.i ]
  %_0.sroa.0.5.i = phi i64 [ %_790.0.i, %bb295.i ], [ %_0.sroa.0.3.i, %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h9dae8b4f052b6b2eE.exit290.i" ], [ %185, %bb281.i ], [ %157, %bb93.i ], [ %162, %bb99.i ], [ %168, %bb286.i ], [ %165, %bb95.i ], [ %154, %bb103.i ], [ %194, %bb106.i ], [ %191, %bb108.i ]
  %_0.sroa.44.5.i = extractvalue { i64, ptr } %.pn297.i, 1
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %mint.i), !noalias !71818
  br label %bb185.i

bb173.i:                                          ; preds = %bb240.i, %bb63.i
; call pump_recovered::<impl core::convert::From<pump_recovered::PumpError> for anchor_lang::error::Error>::from
  %348 = tail call { i64, ptr } @"_ZN14pump_recovered108_$LT$impl$u20$core..convert..From$LT$pump_recovered..PumpError$GT$$u20$for$u20$anchor_lang..error..Error$GT$4from17he2863c13b6d46d53E"(i32 noundef 24) #28, !noalias !71818
  %_0.sroa.0.6.i = extractvalue { i64, ptr } %348, 0
  %_0.sroa.44.6.i = extractvalue { i64, ptr } %348, 1
  br label %bb185.i

bb185.i:                                          ; preds = %bb173.i, %bb169.i, %bb270.i, %bb268.i, %bb265.i, %bb261.i, %bb257.i, %bb253.i, %bb250.i, %bb79.i, %bb64.i, %bb236.i, %bb232.i, %bb229.i, %bb227.i, %bb72.i, %bb224.i, %bb222.i, %bb49.i, %bb219.i, %bb213.i, %bb209.i, %bb35.i, %bb205.i, %bb199.i, %bb16.i, %bb10.i, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit.i", %bb193.i
  %_0.sroa.44.13.i = phi ptr [ %_31.1.i, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit.i" ], [ %_41.1.i, %bb10.i ], [ %_53.1.i, %bb16.i ], [ %_581.1.i, %bb199.i ], [ %_575.i, %bb193.i ], [ %_600.1.i, %bb205.i ], [ %_98.1.i, %bb35.i ], [ %_603.1.i, %bb209.i ], [ %_612.1.i, %bb213.i ], [ %_139.1.i, %bb49.i ], [ %_622.1.i, %bb219.i ], [ %_221.1.i, %bb72.i ], [ %_651.1.i, %bb232.i ], [ %_238.1.i, %bb79.i ], [ %_700.1.i, %bb253.i ], [ %_710.1.i, %bb257.i ], [ %_0.sroa.44.5.i, %bb169.i ], [ %151, %bb270.i ], [ %150, %bb268.i ], [ %143, %bb265.i ], [ %133, %bb261.i ], [ %_690.1.i, %bb250.i ], [ %_0.sroa.44.6.i, %bb173.i ], [ %_208.1.i, %bb64.i ], [ %_660.1.i, %bb236.i ], [ %_638.1.i, %bb227.i ], [ %_648.1.i, %bb229.i ], [ %_625.1.i, %bb222.i ], [ %_635.1.i, %bb224.i ]
  %_0.sroa.0.13.i = phi i64 [ %_31.0.i, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1551814bef63e52cE.exit.i" ], [ %_41.0.i, %bb10.i ], [ %_53.0.i, %bb16.i ], [ %_581.0.i, %bb199.i ], [ %13, %bb193.i ], [ %_600.0.i, %bb205.i ], [ %_98.0.i, %bb35.i ], [ %56, %bb209.i ], [ %66, %bb213.i ], [ %_139.0.i, %bb49.i ], [ %_622.0.i, %bb219.i ], [ %_221.0.i, %bb72.i ], [ %89, %bb232.i ], [ %_238.0.i, %bb79.i ], [ %_700.0.i, %bb253.i ], [ %_710.0.i, %bb257.i ], [ %_0.sroa.0.5.i, %bb169.i ], [ %148, %bb270.i ], [ %141, %bb268.i ], [ %135, %bb265.i ], [ %128, %bb261.i ], [ %_690.0.i, %bb250.i ], [ %_0.sroa.0.6.i, %bb173.i ], [ %_208.0.i, %bb64.i ], [ %94, %bb236.i ], [ %_63790178.i, %bb227.i ], [ %_648.0.i, %bb229.i ], [ %_62480176.i, %bb222.i ], [ %_635.0.i, %bb224.i ]
  call void @llvm.lifetime.end.p0(i64 8, ptr nonnull %buyback_fee_recipient.i), !noalias !71818
  br label %bb186.i

bb186.i:                                          ; preds = %bb185.i, %bb192.i, %bb190.i
  %_0.sroa.44.14.i = phi ptr [ %_0.sroa.44.13.i, %bb185.i ], [ %16, %bb192.i ], [ %10, %bb190.i ]
  %_0.sroa.0.14.i = phi i64 [ %_0.sroa.0.13.i, %bb185.i ], [ %8, %bb192.i ], [ %4, %bb190.i ]
  call void @llvm.lifetime.end.p0(i64 8, ptr nonnull %bonding_curve.i), !noalias !71818
  call void @llvm.lifetime.end.p0(i64 8, ptr nonnull %fee_recipient.i), !noalias !71818
  br label %_ZN14pump_recovered10legacy_buy16buy_exact_sol_in17h72ae36cf36913665E.exit

_ZN14pump_recovered10legacy_buy16buy_exact_sol_in17h72ae36cf36913665E.exit: ; preds = %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h9dae8b4f052b6b2eE.exit.i", %bb186.i
  %_0.sroa.44.4.i = phi ptr [ %_0.sroa.44.14.i, %bb186.i ], [ undef, %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h9dae8b4f052b6b2eE.exit.i" ]
  %_0.sroa.0.4.i = phi i64 [ %_0.sroa.0.14.i, %bb186.i ], [ 2, %"_ZN4core3ptr47drop_in_place$LT$pump_recovered..TradeEvent$GT$17h9dae8b4f052b6b2eE.exit.i" ]
  %349 = insertvalue { i64, ptr } poison, i64 %_0.sroa.0.4.i, 0
  %350 = insertvalue { i64, ptr } %349, ptr %_0.sroa.44.4.i, 1
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_512.i)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_498.i)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %inner_data36.i)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %authority_info35.i)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_464.i)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_448.i)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %inner_data.i)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %authority_info.i)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %creator.i)
  ret { i64, ptr } %350
}
