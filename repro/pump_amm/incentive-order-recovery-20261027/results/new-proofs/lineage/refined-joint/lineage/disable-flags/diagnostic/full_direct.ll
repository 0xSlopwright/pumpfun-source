; ModuleID = 'full_direct.b675adeabd8df545-cgu.0'
source_filename = "full_direct.b675adeabd8df545-cgu.0"
target datalayout = "e-m:e-p:64:64-i64:64-n32:64-S128"
target triple = "sbf"

%"solana_pubkey::Pubkey" = type { [32 x i8] }

@_ZN18pump_amm_recovered2ID17h808a92cd622e7a23E = external local_unnamed_addr global %"solana_pubkey::Pubkey"
@alloc_7a7952b5e0d15f2b72d0341cef6d4739 = private unnamed_addr constant <{ [17 x i8] }> <{ [17 x i8] c"__event_authority" }>, align 1

; full_direct::disable
; Function Attrs: nounwind
define hidden { i64, ptr } @_ZN11full_direct7disable17h5cd0bd10bd045391E(ptr noalias nocapture noundef readonly align 8 dereferenceable(40) %ctx, i1 noundef zeroext %disable_create_pool, i1 noundef zeroext %disable_deposit, i1 noundef zeroext %disable_withdraw, i1 noundef zeroext %disable_buy, i1 noundef zeroext %disable_sell) unnamed_addr #0 {
start:
  %_107 = alloca [24 x i8], align 8
  %_76 = alloca [1 x i8], align 1
  %_72 = alloca [32 x i8], align 8
  %_69 = alloca [16 x i8], align 8
  %_66 = alloca [48 x i8], align 8
  %_62 = alloca [24 x i8], align 8
  %_54 = alloca [24 x i8], align 8
  %_51 = alloca [32 x i8], align 1
  %ix = alloca [80 x i8], align 8
  %_38.sroa.0 = alloca [32 x i8], align 8
  %_34 = alloca [16 x i8], align 8
  %_28 = alloca [48 x i8], align 8
  %event.sroa.0 = alloca [32 x i8], align 8
  %0 = getelementptr inbounds i8, ptr %ctx, i64 8
  %_78 = load ptr, ptr %0, align 8, !nonnull !2, !align !3, !noundef !2
  %1 = getelementptr inbounds i8, ptr %_78, i64 8
  %_79 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %2 = getelementptr inbounds i8, ptr %_79, i64 944
  %_8 = load i8, ptr %2, align 8, !noundef !2
  %_7 = and i8 %_8, -2
  %_9 = zext i1 %disable_create_pool to i8
  %3 = or disjoint i8 %_7, %_9
  store i8 %3, ptr %2, align 8
  %_81 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %4 = getelementptr inbounds i8, ptr %_81, i64 944
  %_11 = load i8, ptr %4, align 8, !noundef !2
  %_10 = and i8 %_11, -3
  %_12 = select i1 %disable_deposit, i8 2, i8 0
  %5 = or disjoint i8 %_10, %_12
  store i8 %5, ptr %4, align 8
  %_83 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %6 = getelementptr inbounds i8, ptr %_83, i64 944
  %_15 = load i8, ptr %6, align 8, !noundef !2
  %_14 = and i8 %_15, -5
  %_16 = select i1 %disable_withdraw, i8 4, i8 0
  %7 = or disjoint i8 %_14, %_16
  store i8 %7, ptr %6, align 8
  %_85 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %8 = getelementptr inbounds i8, ptr %_85, i64 944
  %_19 = load i8, ptr %8, align 8, !noundef !2
  %_18 = and i8 %_19, -9
  %_20 = select i1 %disable_buy, i8 8, i8 0
  %9 = or disjoint i8 %_18, %_20
  store i8 %9, ptr %8, align 8
  %_87 = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  %10 = getelementptr inbounds i8, ptr %_87, i64 944
  %_23 = load i8, ptr %10, align 8, !noundef !2
  %_22 = and i8 %_23, -17
  %_24 = select i1 %disable_sell, i8 16, i8 0
  %11 = or disjoint i8 %_22, %_24
  store i8 %11, ptr %10, align 8
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %event.sroa.0)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_28)
; call solana_sysvar::clock::<impl solana_sysvar::Sysvar for solana_clock::Clock>::get
  call void @"_ZN13solana_sysvar5clock71_$LT$impl$u20$solana_sysvar..Sysvar$u20$for$u20$solana_clock..Clock$GT$3get17h0c5111a066f59c1cE"(ptr noalias nocapture noundef nonnull sret([48 x i8]) align 8 dereferenceable(48) %_28) #10
  %_101 = load i64, ptr %_28, align 8, !range !4, !noundef !2
  %trunc.not = icmp eq i64 %_101, 0
  br i1 %trunc.not, label %bb20, label %bb19

bb20:                                             ; preds = %start
  %_25 = zext i1 %disable_sell to i8
  %_21 = zext i1 %disable_buy to i8
  %_17 = zext i1 %disable_withdraw to i8
  %_13 = zext i1 %disable_deposit to i8
  %_102.sroa.8.0..sroa_idx = getelementptr inbounds i8, ptr %_28, i64 40
  %_102.sroa.8.0.copyload = load i64, ptr %_102.sroa.8.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_28)
  %_105 = load ptr, ptr %_78, align 8, !nonnull !2, !align !3, !noundef !2
  %_106 = load ptr, ptr %_105, align 8, !nonnull !2, !align !5, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %event.sroa.0, ptr noundef nonnull align 1 dereferenceable(32) %_106, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_34)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_38.sroa.0)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %_38.sroa.0, ptr noundef nonnull align 1 dereferenceable(32) %_106, i64 32, i1 false)
  %12 = tail call noundef dereferenceable_or_null(256) ptr @__rust_alloc(i64 noundef 256, i64 noundef 1) #10, !noalias !6
  %13 = icmp eq ptr %12, null
  br i1 %13, label %bb5.i, label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h0cb2a0b2c64be023E.exit"

bb5.i:                                            ; preds = %bb20
; call alloc::raw_vec::handle_error
  tail call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef 1, i64 256) #11, !noalias !12
  unreachable

"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h0cb2a0b2c64be023E.exit": ; preds = %bb20
  store i64 7501812686204829035, ptr %12, align 1, !noalias !13
  %dst.i.i.i.i.i.i = getelementptr inbounds i8, ptr %12, i64 8
  store i64 %_102.sroa.8.0.copyload, ptr %dst.i.i.i.i.i.i, align 1, !noalias !20
  %dst.i.i.i.i.i.i.i.i = getelementptr inbounds i8, ptr %12, i64 16
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %dst.i.i.i.i.i.i.i.i, ptr noundef nonnull align 8 dereferenceable(32) %_38.sroa.0, i64 32, i1 false), !noalias !32
  %dst.i.i.i.i12.i.i = getelementptr inbounds i8, ptr %12, i64 48
  store i8 %_9, ptr %dst.i.i.i.i12.i.i, align 1, !noalias !45
  %dst.i.i.i.i21.i.i = getelementptr inbounds i8, ptr %12, i64 49
  store i8 %_13, ptr %dst.i.i.i.i21.i.i, align 1, !noalias !54
  %dst.i.i.i.i30.i.i = getelementptr inbounds i8, ptr %12, i64 50
  store i8 %_17, ptr %dst.i.i.i.i30.i.i, align 1, !noalias !63
  %dst.i.i.i.i39.i.i = getelementptr inbounds i8, ptr %12, i64 51
  store i8 %_21, ptr %dst.i.i.i.i39.i.i, align 1, !noalias !72
  %dst.i.i.i.i48.i.i = getelementptr inbounds i8, ptr %12, i64 52
  store i8 %_25, ptr %dst.i.i.i.i48.i.i, align 1, !noalias !81
  store ptr %12, ptr %_34, align 8
  %14 = getelementptr inbounds i8, ptr %_34, i64 8
  store i64 53, ptr %14, align 8
; call solana_program::log::sol_log_data
  call void @_ZN14solana_program3log12sol_log_data17h0e9d6cc0899543bbE(ptr noalias noundef nonnull readonly align 8 %_34, i64 noundef 1) #10
  call void @__rust_dealloc(ptr noundef nonnull %12, i64 noundef 256, i64 noundef 1) #10
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_38.sroa.0)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_34)
  %_40 = getelementptr inbounds i8, ptr %_78, i64 16
  call void @llvm.experimental.noalias.scope.decl(metadata !90)
  %_2.i = load ptr, ptr %_40, align 8, !alias.scope !90, !noalias !93, !nonnull !2, !align !5, !noundef !2
  %15 = getelementptr inbounds i8, ptr %_78, i64 24
  %_12.i = load ptr, ptr %15, align 8, !alias.scope !90, !noalias !93, !nonnull !2, !noundef !2
  %self.val.i.i = load i64, ptr %_12.i, align 8, !noalias !95, !noundef !2
  %cond.i.i = icmp ne i64 %self.val.i.i, 0
  call void @llvm.assume(i1 %cond.i.i)
  %strong1.i.i = add i64 %self.val.i.i, 1
  store i64 %strong1.i.i, ptr %_12.i, align 8, !noalias !95
  %_7.i.i = icmp eq i64 %strong1.i.i, 0
  br i1 %_7.i.i, label %bb4.i.i, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h6e32fedb2aff5696E.exit.i

bb4.i.i:                                          ; preds = %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h0cb2a0b2c64be023E.exit"
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h6e32fedb2aff5696E.exit.i: ; preds = %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h0cb2a0b2c64be023E.exit"
  %16 = getelementptr inbounds i8, ptr %_78, i64 32
  %_16.i = load ptr, ptr %16, align 8, !alias.scope !90, !noalias !93, !nonnull !2, !noundef !2
  %self.val.i1.i = load i64, ptr %_16.i, align 8, !noalias !95, !noundef !2
  %cond.i2.i = icmp ne i64 %self.val.i1.i, 0
  call void @llvm.assume(i1 %cond.i2.i)
  %strong1.i3.i = add i64 %self.val.i1.i, 1
  store i64 %strong1.i3.i, ptr %_16.i, align 8, !noalias !95
  %_7.i4.i = icmp eq i64 %strong1.i3.i, 0
  br i1 %_7.i4.i, label %bb4.i5.i, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit"

bb4.i5.i:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h6e32fedb2aff5696E.exit.i
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h6e32fedb2aff5696E.exit.i
  %17 = getelementptr inbounds i8, ptr %_78, i64 40
  %_5.i = load ptr, ptr %17, align 8, !alias.scope !90, !noalias !93, !nonnull !2, !align !5, !noundef !2
  %18 = getelementptr inbounds i8, ptr %_78, i64 48
  %_6.i = load i64, ptr %18, align 8, !alias.scope !90, !noalias !93, !noundef !2
  %19 = getelementptr inbounds i8, ptr %_78, i64 56
  %20 = load i8, ptr %19, align 8, !range !96, !alias.scope !90, !noalias !93, !noundef !2
  %21 = getelementptr inbounds i8, ptr %_78, i64 57
  %22 = load i8, ptr %21, align 1, !range !96, !alias.scope !90, !noalias !93, !noundef !2
  %23 = getelementptr inbounds i8, ptr %_78, i64 58
  %24 = load i8, ptr %23, align 2, !range !96, !alias.scope !90, !noalias !93, !noundef !2
  %25 = getelementptr inbounds i8, ptr %ctx, i64 32
  %authority_bump = load i8, ptr %25, align 8, !noundef !2
  %26 = call noundef dereferenceable_or_null(256) ptr @__rust_alloc(i64 noundef 256, i64 noundef 1) #10, !noalias !97
  %27 = icmp eq ptr %26, null
  br i1 %27, label %bb5.i29, label %bb5.i.i.i.i.i

bb5.i29:                                          ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit"
; call alloc::raw_vec::handle_error
  call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef 1, i64 256) #11, !noalias !103
  unreachable

bb5.i.i.i.i.i:                                    ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit"
  store i64 7501812686204829035, ptr %26, align 1, !noalias !104
  %dst.i.i.i.i.i.i22 = getelementptr inbounds i8, ptr %26, i64 8
  store i64 %_102.sroa.8.0.copyload, ptr %dst.i.i.i.i.i.i22, align 1, !noalias !111
  %dst.i.i.i.i.i.i.i.i23 = getelementptr inbounds i8, ptr %26, i64 16
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %dst.i.i.i.i.i.i.i.i23, ptr noundef nonnull align 8 dereferenceable(32) %event.sroa.0, i64 32, i1 false), !noalias !123
  %dst.i.i.i.i12.i.i24 = getelementptr inbounds i8, ptr %26, i64 48
  store i8 %_9, ptr %dst.i.i.i.i12.i.i24, align 1, !noalias !136
  %dst.i.i.i.i21.i.i25 = getelementptr inbounds i8, ptr %26, i64 49
  store i8 %_13, ptr %dst.i.i.i.i21.i.i25, align 1, !noalias !145
  %dst.i.i.i.i30.i.i26 = getelementptr inbounds i8, ptr %26, i64 50
  store i8 %_17, ptr %dst.i.i.i.i30.i.i26, align 1, !noalias !154
  %dst.i.i.i.i39.i.i27 = getelementptr inbounds i8, ptr %26, i64 51
  store i8 %_21, ptr %dst.i.i.i.i39.i.i27, align 1, !noalias !163
  %dst.i.i.i.i48.i.i28 = getelementptr inbounds i8, ptr %26, i64 52
  store i8 %_25, ptr %dst.i.i.i.i48.i.i28, align 1, !noalias !172
  %28 = call noundef dereferenceable_or_null(61) ptr @__rust_alloc(i64 noundef 61, i64 noundef 1) #10, !noalias !181
  %29 = icmp eq ptr %28, null
  br i1 %29, label %bb7.i.i, label %bb5.i.i.i.i.i.i.i.i

bb5.i.i.i.i.i.i.i.i:                              ; preds = %bb5.i.i.i.i.i
  store i64 2133240923048723940, ptr %28, align 1, !noalias !190
  %scevgep = getelementptr i8, ptr %28, i64 8
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(53) %scevgep, ptr noundef nonnull align 1 dereferenceable(53) %26, i64 53, i1 false), !noalias !207
  call void @__rust_dealloc(ptr noundef nonnull %26, i64 noundef 256, i64 noundef 1) #10, !noalias !211
  call void @llvm.lifetime.start.p0(i64 80, ptr nonnull %ix)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_51)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_51, ptr noundef nonnull align 1 dereferenceable(32) @_ZN18pump_amm_recovered2ID17h808a92cd622e7a23E, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_54)
  %30 = call noundef dereferenceable_or_null(34) ptr @__rust_alloc(i64 noundef 34, i64 noundef 1) #10
  %31 = icmp eq ptr %30, null
  br i1 %31, label %bb2.i, label %_ZN5alloc5alloc15exchange_malloc17h6cd8dd11b0e3424eE.exit

bb7.i.i:                                          ; preds = %bb5.i.i.i.i.i
; call alloc::raw_vec::handle_error
  call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef 1, i64 61) #11, !noalias !214
  unreachable

bb2.i:                                            ; preds = %bb5.i.i.i.i.i.i.i.i
; call alloc::alloc::handle_alloc_error
  call void @_ZN5alloc5alloc18handle_alloc_error17hdf8d5797c8d8bbffE(i64 noundef 1, i64 noundef 34) #11
  unreachable

_ZN5alloc5alloc15exchange_malloc17h6cd8dd11b0e3424eE.exit: ; preds = %bb5.i.i.i.i.i.i.i.i
  call void @llvm.memmove.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %30, ptr noundef nonnull align 1 dereferenceable(32) %_2.i, i64 32, i1 false)
  %_58.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %30, i64 32
  store i8 1, ptr %_58.sroa.4.0..sroa_idx, align 1
  %_58.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %30, i64 33
  store i8 0, ptr %_58.sroa.5.0..sroa_idx, align 1
  store i64 1, ptr %_54, align 8, !alias.scope !215, !noalias !218
  %32 = getelementptr inbounds i8, ptr %_54, i64 8
  store ptr %30, ptr %32, align 8, !alias.scope !215, !noalias !218
  %33 = getelementptr inbounds i8, ptr %_54, i64 16
  store i64 1, ptr %33, align 8, !alias.scope !215, !noalias !218
; call solana_instruction::Instruction::new_with_bytes
  call void @_ZN18solana_instruction11Instruction14new_with_bytes17h2a18064ce4a85141E(ptr noalias nocapture noundef nonnull sret([80 x i8]) align 8 dereferenceable(80) %ix, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %_51, ptr noalias noundef nonnull readonly align 1 %28, i64 noundef 61, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_54) #10
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_54)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_51)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_66)
  store ptr %_2.i, ptr %_66, align 8
  %authority_info.sroa.3.0._66.sroa_idx = getelementptr inbounds i8, ptr %_66, i64 8
  store ptr %_12.i, ptr %authority_info.sroa.3.0._66.sroa_idx, align 8
  %authority_info.sroa.4.0._66.sroa_idx = getelementptr inbounds i8, ptr %_66, i64 16
  store ptr %_16.i, ptr %authority_info.sroa.4.0._66.sroa_idx, align 8
  %authority_info.sroa.5.0._66.sroa_idx = getelementptr inbounds i8, ptr %_66, i64 24
  store ptr %_5.i, ptr %authority_info.sroa.5.0._66.sroa_idx, align 8
  %authority_info.sroa.6.0._66.sroa_idx = getelementptr inbounds i8, ptr %_66, i64 32
  store i64 %_6.i, ptr %authority_info.sroa.6.0._66.sroa_idx, align 8
  %authority_info.sroa.7.0._66.sroa_idx = getelementptr inbounds i8, ptr %_66, i64 40
  store i8 %20, ptr %authority_info.sroa.7.0._66.sroa_idx, align 8
  %authority_info.sroa.8.0._66.sroa_idx = getelementptr inbounds i8, ptr %_66, i64 41
  store i8 %22, ptr %authority_info.sroa.8.0._66.sroa_idx, align 1
  %authority_info.sroa.9.0._66.sroa_idx = getelementptr inbounds i8, ptr %_66, i64 42
  store i8 %24, ptr %authority_info.sroa.9.0._66.sroa_idx, align 2
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_69)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_72)
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %_76)
  store i8 %authority_bump, ptr %_76, align 1
  store ptr @alloc_7a7952b5e0d15f2b72d0341cef6d4739, ptr %_72, align 8
  %34 = getelementptr inbounds i8, ptr %_72, i64 8
  store i64 17, ptr %34, align 8
  %35 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_72, i64 0, i64 1
  store ptr %_76, ptr %35, align 8
  %36 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_72, i64 0, i64 1, i32 1
  store i64 1, ptr %36, align 8
  store ptr %_72, ptr %_69, align 8
  %37 = getelementptr inbounds i8, ptr %_69, i64 8
  store i64 2, ptr %37, align 8
; call solana_program::program::invoke_signed
  call void @_ZN14solana_program7program13invoke_signed17hcf4e7a0d8dc0ee99E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_62, ptr noalias noundef nonnull readonly align 8 dereferenceable(80) %ix, ptr noalias noundef nonnull readonly align 8 %_66, i64 noundef 1, ptr noalias noundef nonnull readonly align 8 %_69, i64 noundef 1) #10
  %38 = load i64, ptr %_62, align 8, !range !220, !noundef !2
  %39 = icmp eq i64 %38, -9223372036854775782
  br i1 %39, label %bb26, label %bb25

bb19:                                             ; preds = %start
  %40 = getelementptr inbounds i8, ptr %_28, i64 8
  %_103.sroa.0.0.copyload = load i64, ptr %40, align 8
  %_103.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_28, i64 16
  %_103.sroa.5.0.copyload = load i64, ptr %_103.sroa.5.0..sroa_idx, align 8
  %_103.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_28, i64 24
  %_103.sroa.6.0.copyload = load i64, ptr %_103.sroa.6.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_28)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_107)
  store i64 %_103.sroa.0.0.copyload, ptr %_107, align 8
  %residual.sroa.2.0._107.sroa_idx = getelementptr inbounds i8, ptr %_107, i64 8
  store i64 %_103.sroa.5.0.copyload, ptr %residual.sroa.2.0._107.sroa_idx, align 8
  %residual.sroa.3.0._107.sroa_idx = getelementptr inbounds i8, ptr %_107, i64 16
  store i64 %_103.sroa.6.0.copyload, ptr %residual.sroa.3.0._107.sroa_idx, align 8
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %41 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17h2734901f082d5dd2E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_107) #10
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_107)
  br label %bb17

bb26:                                             ; preds = %_ZN5alloc5alloc15exchange_malloc17h6cd8dd11b0e3424eE.exit
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_76)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_72)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_69)
  %self1.val.i.i.i.i = load i64, ptr %_12.i, align 8, !noundef !2
  %val.i.i.i.i = add i64 %self1.val.i.i.i.i, -1
  store i64 %val.i.i.i.i, ptr %_12.i, align 8
  %42 = icmp eq i64 %val.i.i.i.i, 0
  br i1 %42, label %bb1.i.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17ha2056616b455fb20E.exit.i.i"

bb1.i.i.i.i:                                      ; preds = %bb26
  %43 = getelementptr i8, ptr %_12.i, i64 8
  %self2.val.i.i.i.i = load i64, ptr %43, align 8, !noundef !2
  %val6.i.i.i.i = add i64 %self2.val.i.i.i.i, -1
  store i64 %val6.i.i.i.i, ptr %43, align 8
  %44 = icmp eq i64 %val6.i.i.i.i, 0
  br i1 %44, label %bb3.i.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17ha2056616b455fb20E.exit.i.i"

bb3.i.i.i.i:                                      ; preds = %bb1.i.i.i.i
  call void @__rust_dealloc(ptr noundef nonnull %_12.i, i64 noundef 32, i64 noundef 8) #10
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17ha2056616b455fb20E.exit.i.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17ha2056616b455fb20E.exit.i.i": ; preds = %bb3.i.i.i.i, %bb1.i.i.i.i, %bb26
  %self1.val.i.i2.i.i = load i64, ptr %_16.i, align 8, !noundef !2
  %val.i.i3.i.i = add i64 %self1.val.i.i2.i.i, -1
  store i64 %val.i.i3.i.i, ptr %_16.i, align 8
  %45 = icmp eq i64 %val.i.i3.i.i, 0
  br i1 %45, label %bb1.i.i4.i.i, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17hb67d1cddccfa7fd1E.exit"

bb1.i.i4.i.i:                                     ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17ha2056616b455fb20E.exit.i.i"
  %46 = getelementptr i8, ptr %_16.i, i64 8
  %self2.val.i.i5.i.i = load i64, ptr %46, align 8, !noundef !2
  %val6.i.i6.i.i = add i64 %self2.val.i.i5.i.i, -1
  store i64 %val6.i.i6.i.i, ptr %46, align 8
  %47 = icmp eq i64 %val6.i.i6.i.i, 0
  br i1 %47, label %bb3.i.i7.i.i, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17hb67d1cddccfa7fd1E.exit"

bb3.i.i7.i.i:                                     ; preds = %bb1.i.i4.i.i
  call void @__rust_dealloc(ptr noundef nonnull %_16.i, i64 noundef 40, i64 noundef 8) #10
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17hb67d1cddccfa7fd1E.exit"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17hb67d1cddccfa7fd1E.exit": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17ha2056616b455fb20E.exit.i.i", %bb1.i.i4.i.i, %bb3.i.i7.i.i
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_66)
  call void @llvm.experimental.noalias.scope.decl(metadata !221)
  %_1.val.i = load i64, ptr %ix, align 8, !alias.scope !221, !noundef !2
  %48 = icmp eq i64 %_1.val.i, 0
  br i1 %48, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h938fae20bb74f0f2E.exit.i", label %bb2.i.i.i.i31

bb2.i.i.i.i31:                                    ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17hb67d1cddccfa7fd1E.exit"
  %49 = getelementptr inbounds i8, ptr %ix, i64 8
  %_1.val2.i = load ptr, ptr %49, align 8, !alias.scope !221, !nonnull !2, !noundef !2
  %size.i.i.i.i.i = mul nuw i64 %_1.val.i, 34
  call void @__rust_dealloc(ptr noundef nonnull %_1.val2.i, i64 noundef %size.i.i.i.i.i, i64 noundef 1) #10, !noalias !221
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h938fae20bb74f0f2E.exit.i"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h938fae20bb74f0f2E.exit.i": ; preds = %bb2.i.i.i.i31, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17hb67d1cddccfa7fd1E.exit"
  %50 = getelementptr inbounds i8, ptr %ix, i64 24
  %.val.i = load i64, ptr %50, align 8, !alias.scope !221, !noundef !2
  %51 = icmp eq i64 %.val.i, 0
  br i1 %51, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h531bcf60c50349c1E.exit", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h938fae20bb74f0f2E.exit.i"
  %52 = getelementptr inbounds i8, ptr %ix, i64 32
  %.val1.i = load ptr, ptr %52, align 8, !alias.scope !221, !nonnull !2, !noundef !2
  call void @__rust_dealloc(ptr noundef nonnull %.val1.i, i64 noundef %.val.i, i64 noundef 1) #10, !noalias !221
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h531bcf60c50349c1E.exit"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h531bcf60c50349c1E.exit": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h938fae20bb74f0f2E.exit.i", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix)
  call void @__rust_dealloc(ptr noundef nonnull %28, i64 noundef 61, i64 noundef 1) #10
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %event.sroa.0)
  br label %bb18

bb25:                                             ; preds = %_ZN5alloc5alloc15exchange_malloc17h6cd8dd11b0e3424eE.exit
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %53 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17h2734901f082d5dd2E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_62) #10
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_76)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_72)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_69)
  %_66.val = load ptr, ptr %authority_info.sroa.3.0._66.sroa_idx, align 8, !nonnull !2, !noundef !2
  %_66.val17 = load ptr, ptr %authority_info.sroa.4.0._66.sroa_idx, align 8
  %self1.val.i.i.i.i34 = load i64, ptr %_66.val, align 8, !noundef !2
  %val.i.i.i.i35 = add i64 %self1.val.i.i.i.i34, -1
  store i64 %val.i.i.i.i35, ptr %_66.val, align 8
  %54 = icmp eq i64 %val.i.i.i.i35, 0
  br i1 %54, label %bb1.i.i.i.i43, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17ha2056616b455fb20E.exit.i.i36"

bb1.i.i.i.i43:                                    ; preds = %bb25
  %55 = getelementptr i8, ptr %_66.val, i64 8
  %self2.val.i.i.i.i44 = load i64, ptr %55, align 8, !noundef !2
  %val6.i.i.i.i45 = add i64 %self2.val.i.i.i.i44, -1
  store i64 %val6.i.i.i.i45, ptr %55, align 8
  %56 = icmp eq i64 %val6.i.i.i.i45, 0
  br i1 %56, label %bb3.i.i.i.i46, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17ha2056616b455fb20E.exit.i.i36"

bb3.i.i.i.i46:                                    ; preds = %bb1.i.i.i.i43
  call void @__rust_dealloc(ptr noundef nonnull %_66.val, i64 noundef 32, i64 noundef 8) #10
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17ha2056616b455fb20E.exit.i.i36"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17ha2056616b455fb20E.exit.i.i36": ; preds = %bb3.i.i.i.i46, %bb1.i.i.i.i43, %bb25
  %57 = icmp ne ptr %_66.val17, null
  call void @llvm.assume(i1 %57)
  %self1.val.i.i2.i.i37 = load i64, ptr %_66.val17, align 8, !noundef !2
  %val.i.i3.i.i38 = add i64 %self1.val.i.i2.i.i37, -1
  store i64 %val.i.i3.i.i38, ptr %_66.val17, align 8
  %58 = icmp eq i64 %val.i.i3.i.i38, 0
  br i1 %58, label %bb1.i.i4.i.i39, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17hb67d1cddccfa7fd1E.exit47"

bb1.i.i4.i.i39:                                   ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17ha2056616b455fb20E.exit.i.i36"
  %59 = getelementptr i8, ptr %_66.val17, i64 8
  %self2.val.i.i5.i.i40 = load i64, ptr %59, align 8, !noundef !2
  %val6.i.i6.i.i41 = add i64 %self2.val.i.i5.i.i40, -1
  store i64 %val6.i.i6.i.i41, ptr %59, align 8
  %60 = icmp eq i64 %val6.i.i6.i.i41, 0
  br i1 %60, label %bb3.i.i7.i.i42, label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17hb67d1cddccfa7fd1E.exit47"

bb3.i.i7.i.i42:                                   ; preds = %bb1.i.i4.i.i39
  call void @__rust_dealloc(ptr noundef nonnull %_66.val17, i64 noundef 40, i64 noundef 8) #10
  br label %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17hb67d1cddccfa7fd1E.exit47"

"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17hb67d1cddccfa7fd1E.exit47": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17ha2056616b455fb20E.exit.i.i36", %bb1.i.i4.i.i39, %bb3.i.i7.i.i42
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_66)
  call void @llvm.experimental.noalias.scope.decl(metadata !224)
  %_1.val.i48 = load i64, ptr %ix, align 8, !alias.scope !224, !noundef !2
  %61 = icmp eq i64 %_1.val.i48, 0
  br i1 %61, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h938fae20bb74f0f2E.exit.i52", label %bb2.i.i.i.i49

bb2.i.i.i.i49:                                    ; preds = %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17hb67d1cddccfa7fd1E.exit47"
  %62 = getelementptr inbounds i8, ptr %ix, i64 8
  %_1.val2.i50 = load ptr, ptr %62, align 8, !alias.scope !224, !nonnull !2, !noundef !2
  %size.i.i.i.i.i51 = mul nuw i64 %_1.val.i48, 34
  call void @__rust_dealloc(ptr noundef nonnull %_1.val2.i50, i64 noundef %size.i.i.i.i.i51, i64 noundef 1) #10, !noalias !224
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h938fae20bb74f0f2E.exit.i52"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h938fae20bb74f0f2E.exit.i52": ; preds = %bb2.i.i.i.i49, %"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17hb67d1cddccfa7fd1E.exit47"
  %63 = getelementptr inbounds i8, ptr %ix, i64 24
  %.val.i53 = load i64, ptr %63, align 8, !alias.scope !224, !noundef !2
  %64 = icmp eq i64 %.val.i53, 0
  br i1 %64, label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h531bcf60c50349c1E.exit56", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i54"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i54": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h938fae20bb74f0f2E.exit.i52"
  %65 = getelementptr inbounds i8, ptr %ix, i64 32
  %.val1.i55 = load ptr, ptr %65, align 8, !alias.scope !224, !nonnull !2, !noundef !2
  call void @__rust_dealloc(ptr noundef nonnull %.val1.i55, i64 noundef %.val.i53, i64 noundef 1) #10, !noalias !224
  br label %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h531bcf60c50349c1E.exit56"

"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h531bcf60c50349c1E.exit56": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h938fae20bb74f0f2E.exit.i52", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i54"
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix)
  call void @__rust_dealloc(ptr noundef nonnull %28, i64 noundef 61, i64 noundef 1) #10
  br label %bb17

bb18:                                             ; preds = %bb17, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h531bcf60c50349c1E.exit"
  %_0.sroa.4.0 = phi ptr [ %_0.sroa.4.1, %bb17 ], [ undef, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h531bcf60c50349c1E.exit" ]
  %_0.sroa.0.0 = phi i64 [ %_0.sroa.0.1, %bb17 ], [ 2, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h531bcf60c50349c1E.exit" ]
  %66 = insertvalue { i64, ptr } poison, i64 %_0.sroa.0.0, 0
  %67 = insertvalue { i64, ptr } %66, ptr %_0.sroa.4.0, 1
  ret { i64, ptr } %67

bb17:                                             ; preds = %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h531bcf60c50349c1E.exit56", %bb19
  %.pn = phi { i64, ptr } [ %41, %bb19 ], [ %53, %"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h531bcf60c50349c1E.exit56" ]
  %_0.sroa.0.1 = extractvalue { i64, ptr } %.pn, 0
  %_0.sroa.4.1 = extractvalue { i64, ptr } %.pn, 1
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %event.sroa.0)
  br label %bb18
}

; <full_direct::DisableEvent as anchor_lang::Event>::data
; Function Attrs: nounwind
define hidden void @"_ZN64_$LT$full_direct..DisableEvent$u20$as$u20$anchor_lang..Event$GT$4data17h9f48d7d2414219f9E"(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([24 x i8]) align 8 dereferenceable(24) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %self) unnamed_addr #0 {
start:
  %0 = tail call noundef dereferenceable_or_null(256) ptr @__rust_alloc(i64 noundef 256, i64 noundef 1) #10, !noalias !227
  %1 = icmp eq ptr %0, null
  br i1 %1, label %bb5, label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E.exit"

"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E.exit": ; preds = %start
  store i64 7501812686204829035, ptr %0, align 1, !noalias !230
  tail call void @llvm.experimental.noalias.scope.decl(metadata !237)
  %2 = getelementptr inbounds i8, ptr %self, i64 32
  %_26.i = load i64, ptr %2, align 8, !alias.scope !237, !noalias !240, !noundef !2
  %dst.i.i.i.i.i = getelementptr inbounds i8, ptr %0, i64 8
  store i64 %_26.i, ptr %dst.i.i.i.i.i, align 1, !noalias !242
  %dst.i.i.i.i.i.i.i = getelementptr inbounds i8, ptr %0, i64 16
  tail call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %dst.i.i.i.i.i.i.i, ptr noundef nonnull align 8 dereferenceable(32) %self, i64 32, i1 false), !noalias !251
  %3 = getelementptr inbounds i8, ptr %self, i64 40
  %4 = load i8, ptr %3, align 8, !range !96, !alias.scope !237, !noalias !240, !noundef !2
  %dst.i.i.i.i12.i = getelementptr inbounds i8, ptr %0, i64 48
  store i8 %4, ptr %dst.i.i.i.i12.i, align 1, !noalias !264
  %5 = getelementptr inbounds i8, ptr %self, i64 41
  %6 = load i8, ptr %5, align 1, !range !96, !alias.scope !237, !noalias !240, !noundef !2
  %dst.i.i.i.i21.i = getelementptr inbounds i8, ptr %0, i64 49
  store i8 %6, ptr %dst.i.i.i.i21.i, align 1, !noalias !273
  %7 = getelementptr inbounds i8, ptr %self, i64 42
  %8 = load i8, ptr %7, align 2, !range !96, !alias.scope !237, !noalias !240, !noundef !2
  %dst.i.i.i.i30.i = getelementptr inbounds i8, ptr %0, i64 50
  store i8 %8, ptr %dst.i.i.i.i30.i, align 1, !noalias !282
  %9 = getelementptr inbounds i8, ptr %self, i64 43
  %10 = load i8, ptr %9, align 1, !range !96, !alias.scope !237, !noalias !240, !noundef !2
  %dst.i.i.i.i39.i = getelementptr inbounds i8, ptr %0, i64 51
  store i8 %10, ptr %dst.i.i.i.i39.i, align 1, !noalias !291
  %11 = getelementptr inbounds i8, ptr %self, i64 44
  %12 = load i8, ptr %11, align 4, !range !96, !alias.scope !237, !noalias !240, !noundef !2
  %dst.i.i.i.i48.i = getelementptr inbounds i8, ptr %0, i64 52
  store i8 %12, ptr %dst.i.i.i.i48.i, align 1, !noalias !300
  store i64 256, ptr %_0, align 8
  %data.sroa.4.0._0.sroa_idx = getelementptr inbounds i8, ptr %_0, i64 8
  store ptr %0, ptr %data.sroa.4.0._0.sroa_idx, align 8
  %data.sroa.5.0._0.sroa_idx = getelementptr inbounds i8, ptr %_0, i64 16
  store i64 53, ptr %data.sroa.5.0._0.sroa_idx, align 8
  ret void

bb5:                                              ; preds = %start
; call alloc::raw_vec::handle_error
  tail call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef 1, i64 256) #11
  unreachable
}

; Function Attrs: mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite)
declare void @llvm.memcpy.p0.p0.i64(ptr noalias nocapture writeonly, ptr noalias nocapture readonly, i64, i1 immarg) #1

; alloc::raw_vec::handle_error
; Function Attrs: cold noreturn nounwind
declare void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef, i64) unnamed_addr #2

; Function Attrs: mustprogress nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: write)
declare hidden void @llvm.assume(i1 noundef) #3

; <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
; Function Attrs: nounwind
declare { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17h2734901f082d5dd2E"(ptr noalias nocapture noundef readonly align 8 dereferenceable(24)) unnamed_addr #0

; Function Attrs: cold noreturn nounwind memory(inaccessiblemem: write)
declare hidden void @llvm.trap() #4

; alloc::alloc::handle_alloc_error
; Function Attrs: cold noreturn nounwind
declare void @_ZN5alloc5alloc18handle_alloc_error17hdf8d5797c8d8bbffE(i64 noundef, i64 noundef) unnamed_addr #2

; Function Attrs: nounwind allockind("alloc,uninitialized,aligned") allocsize(0)
declare noalias noundef ptr @__rust_alloc(i64 noundef, i64 allocalign noundef) unnamed_addr #5

; Function Attrs: nounwind allockind("free")
declare void @__rust_dealloc(ptr allocptr noundef, i64 noundef, i64 noundef) unnamed_addr #6

; solana_sysvar::clock::<impl solana_sysvar::Sysvar for solana_clock::Clock>::get
; Function Attrs: nounwind
declare void @"_ZN13solana_sysvar5clock71_$LT$impl$u20$solana_sysvar..Sysvar$u20$for$u20$solana_clock..Clock$GT$3get17h0c5111a066f59c1cE"(ptr dead_on_unwind noalias nocapture noundef writable sret([48 x i8]) align 8 dereferenceable(48)) unnamed_addr #0

; solana_program::log::sol_log_data
; Function Attrs: nounwind
declare void @_ZN14solana_program3log12sol_log_data17h0e9d6cc0899543bbE(ptr noalias noundef nonnull readonly align 8, i64 noundef) unnamed_addr #0

; solana_instruction::Instruction::new_with_bytes
; Function Attrs: nounwind
declare void @_ZN18solana_instruction11Instruction14new_with_bytes17h2a18064ce4a85141E(ptr dead_on_unwind noalias nocapture noundef writable sret([80 x i8]) align 8 dereferenceable(80), ptr noalias nocapture noundef readonly align 1 dereferenceable(32), ptr noalias noundef nonnull readonly align 1, i64 noundef, ptr noalias nocapture noundef readonly align 8 dereferenceable(24)) unnamed_addr #0

; solana_program::program::invoke_signed
; Function Attrs: nounwind
declare void @_ZN14solana_program7program13invoke_signed17hcf4e7a0d8dc0ee99E(ptr dead_on_unwind noalias nocapture noundef writable sret([24 x i8]) align 8 dereferenceable(24), ptr noalias noundef readonly align 8 dereferenceable(80), ptr noalias noundef nonnull readonly align 8, i64 noundef, ptr noalias noundef nonnull readonly align 8, i64 noundef) unnamed_addr #0

; Function Attrs: mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite)
declare void @llvm.lifetime.start.p0(i64 immarg, ptr nocapture) #7

; Function Attrs: mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite)
declare void @llvm.lifetime.end.p0(i64 immarg, ptr nocapture) #7

; Function Attrs: nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: readwrite)
declare void @llvm.experimental.noalias.scope.decl(metadata) #8

; Function Attrs: nocallback nofree nounwind willreturn memory(argmem: readwrite)
declare void @llvm.memmove.p0.p0.i64(ptr nocapture writeonly, ptr nocapture readonly, i64, i1 immarg) #9

attributes #0 = { nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #1 = { mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite) }
attributes #2 = { cold noreturn nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #3 = { mustprogress nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: write) }
attributes #4 = { cold noreturn nounwind memory(inaccessiblemem: write) }
attributes #5 = { nounwind allockind("alloc,uninitialized,aligned") allocsize(0) "alloc-family"="__rust_alloc" "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #6 = { nounwind allockind("free") "alloc-family"="__rust_alloc" "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #7 = { mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite) }
attributes #8 = { nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: readwrite) }
attributes #9 = { nocallback nofree nounwind willreturn memory(argmem: readwrite) }
attributes #10 = { nounwind }
attributes #11 = { noreturn nounwind }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 8, !"PIC Level", i32 2}
!1 = !{!"rustc version 1.79.0-dev"}
!2 = !{}
!3 = !{i64 8}
!4 = !{i64 0, i64 2}
!5 = !{i64 1}
!6 = !{!7, !9, !11}
!7 = distinct !{!7, !8, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h62cdf6516e1d9be9E: %_0"}
!8 = distinct !{!8, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h62cdf6516e1d9be9E"}
!9 = distinct !{!9, !10, !"_ZN64_$LT$full_direct..DisableEvent$u20$as$u20$anchor_lang..Event$GT$4data17h9f48d7d2414219f9E: %_0"}
!10 = distinct !{!10, !"_ZN64_$LT$full_direct..DisableEvent$u20$as$u20$anchor_lang..Event$GT$4data17h9f48d7d2414219f9E"}
!11 = distinct !{!11, !10, !"_ZN64_$LT$full_direct..DisableEvent$u20$as$u20$anchor_lang..Event$GT$4data17h9f48d7d2414219f9E: %self"}
!12 = !{!9, !11}
!13 = !{!14, !16, !18, !9, !11}
!14 = distinct !{!14, !15, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!15 = distinct !{!15, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!16 = distinct !{!16, !17, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!17 = distinct !{!17, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!18 = distinct !{!18, !19, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!19 = distinct !{!19, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!20 = !{!21, !23, !25, !27, !29, !31, !9, !11}
!21 = distinct !{!21, !22, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!22 = distinct !{!22, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!23 = distinct !{!23, !24, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!24 = distinct !{!24, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!25 = distinct !{!25, !26, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!26 = distinct !{!26, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!27 = distinct !{!27, !28, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!28 = distinct !{!28, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!29 = distinct !{!29, !30, !"_ZN72_$LT$full_direct..DisableEvent$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17h840e6a3ebbbb2173E: %self"}
!30 = distinct !{!30, !"_ZN72_$LT$full_direct..DisableEvent$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17h840e6a3ebbbb2173E"}
!31 = distinct !{!31, !30, !"_ZN72_$LT$full_direct..DisableEvent$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17h840e6a3ebbbb2173E: %writer"}
!32 = !{!33, !35, !37, !39, !41, !43, !31, !9}
!33 = distinct !{!33, !34, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!34 = distinct !{!34, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!35 = distinct !{!35, !36, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!36 = distinct !{!36, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!37 = distinct !{!37, !38, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!38 = distinct !{!38, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!39 = distinct !{!39, !40, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!40 = distinct !{!40, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!41 = distinct !{!41, !42, !"_ZN69_$LT$$u5b$T$u3b$$u20$N$u5d$$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17hc595aadfd717d22bE: %writer"}
!42 = distinct !{!42, !"_ZN69_$LT$$u5b$T$u3b$$u20$N$u5d$$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17hc595aadfd717d22bE"}
!43 = distinct !{!43, !44, !"_ZN68_$LT$solana_pubkey..Pubkey$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17h93b8c3303e532ebaE: %writer"}
!44 = distinct !{!44, !"_ZN68_$LT$solana_pubkey..Pubkey$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17h93b8c3303e532ebaE"}
!45 = !{!46, !48, !50, !52, !29, !31, !9, !11}
!46 = distinct !{!46, !47, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!47 = distinct !{!47, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!48 = distinct !{!48, !49, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!49 = distinct !{!49, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!50 = distinct !{!50, !51, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!51 = distinct !{!51, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!52 = distinct !{!52, !53, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!53 = distinct !{!53, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!54 = !{!55, !57, !59, !61, !29, !31, !9, !11}
!55 = distinct !{!55, !56, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!56 = distinct !{!56, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!57 = distinct !{!57, !58, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!58 = distinct !{!58, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!59 = distinct !{!59, !60, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!60 = distinct !{!60, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!61 = distinct !{!61, !62, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!62 = distinct !{!62, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!63 = !{!64, !66, !68, !70, !29, !31, !9, !11}
!64 = distinct !{!64, !65, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!65 = distinct !{!65, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!66 = distinct !{!66, !67, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!67 = distinct !{!67, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!68 = distinct !{!68, !69, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!69 = distinct !{!69, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!70 = distinct !{!70, !71, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!71 = distinct !{!71, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!72 = !{!73, !75, !77, !79, !29, !31, !9, !11}
!73 = distinct !{!73, !74, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!74 = distinct !{!74, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!75 = distinct !{!75, !76, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!76 = distinct !{!76, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!77 = distinct !{!77, !78, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!78 = distinct !{!78, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!79 = distinct !{!79, !80, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!80 = distinct !{!80, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!81 = !{!82, !84, !86, !88, !29, !31, !9, !11}
!82 = distinct !{!82, !83, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!83 = distinct !{!83, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!84 = distinct !{!84, !85, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!85 = distinct !{!85, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!86 = distinct !{!86, !87, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!87 = distinct !{!87, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!88 = distinct !{!88, !89, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!89 = distinct !{!89, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!90 = !{!91}
!91 = distinct !{!91, !92, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!92 = distinct !{!92, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!93 = !{!94}
!94 = distinct !{!94, !92, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!95 = !{!94, !91}
!96 = !{i8 0, i8 2}
!97 = !{!98, !100, !102}
!98 = distinct !{!98, !99, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h62cdf6516e1d9be9E: %_0"}
!99 = distinct !{!99, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h62cdf6516e1d9be9E"}
!100 = distinct !{!100, !101, !"_ZN64_$LT$full_direct..DisableEvent$u20$as$u20$anchor_lang..Event$GT$4data17h9f48d7d2414219f9E: %_0"}
!101 = distinct !{!101, !"_ZN64_$LT$full_direct..DisableEvent$u20$as$u20$anchor_lang..Event$GT$4data17h9f48d7d2414219f9E"}
!102 = distinct !{!102, !101, !"_ZN64_$LT$full_direct..DisableEvent$u20$as$u20$anchor_lang..Event$GT$4data17h9f48d7d2414219f9E: %self"}
!103 = !{!100, !102}
!104 = !{!105, !107, !109, !100, !102}
!105 = distinct !{!105, !106, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!106 = distinct !{!106, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!107 = distinct !{!107, !108, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!108 = distinct !{!108, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!109 = distinct !{!109, !110, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!110 = distinct !{!110, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!111 = !{!112, !114, !116, !118, !120, !122, !100, !102}
!112 = distinct !{!112, !113, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!113 = distinct !{!113, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!114 = distinct !{!114, !115, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!115 = distinct !{!115, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!116 = distinct !{!116, !117, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!117 = distinct !{!117, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!118 = distinct !{!118, !119, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!119 = distinct !{!119, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!120 = distinct !{!120, !121, !"_ZN72_$LT$full_direct..DisableEvent$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17h840e6a3ebbbb2173E: %self"}
!121 = distinct !{!121, !"_ZN72_$LT$full_direct..DisableEvent$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17h840e6a3ebbbb2173E"}
!122 = distinct !{!122, !121, !"_ZN72_$LT$full_direct..DisableEvent$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17h840e6a3ebbbb2173E: %writer"}
!123 = !{!124, !126, !128, !130, !132, !134, !122, !100}
!124 = distinct !{!124, !125, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!125 = distinct !{!125, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!126 = distinct !{!126, !127, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!127 = distinct !{!127, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!128 = distinct !{!128, !129, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!129 = distinct !{!129, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!130 = distinct !{!130, !131, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!131 = distinct !{!131, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!132 = distinct !{!132, !133, !"_ZN69_$LT$$u5b$T$u3b$$u20$N$u5d$$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17hc595aadfd717d22bE: %writer"}
!133 = distinct !{!133, !"_ZN69_$LT$$u5b$T$u3b$$u20$N$u5d$$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17hc595aadfd717d22bE"}
!134 = distinct !{!134, !135, !"_ZN68_$LT$solana_pubkey..Pubkey$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17h93b8c3303e532ebaE: %writer"}
!135 = distinct !{!135, !"_ZN68_$LT$solana_pubkey..Pubkey$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17h93b8c3303e532ebaE"}
!136 = !{!137, !139, !141, !143, !120, !122, !100, !102}
!137 = distinct !{!137, !138, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!138 = distinct !{!138, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!139 = distinct !{!139, !140, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!140 = distinct !{!140, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!141 = distinct !{!141, !142, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!142 = distinct !{!142, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!143 = distinct !{!143, !144, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!144 = distinct !{!144, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!145 = !{!146, !148, !150, !152, !120, !122, !100, !102}
!146 = distinct !{!146, !147, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!147 = distinct !{!147, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!148 = distinct !{!148, !149, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!149 = distinct !{!149, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!150 = distinct !{!150, !151, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!151 = distinct !{!151, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!152 = distinct !{!152, !153, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!153 = distinct !{!153, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!154 = !{!155, !157, !159, !161, !120, !122, !100, !102}
!155 = distinct !{!155, !156, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!156 = distinct !{!156, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!157 = distinct !{!157, !158, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!158 = distinct !{!158, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!159 = distinct !{!159, !160, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!160 = distinct !{!160, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!161 = distinct !{!161, !162, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!162 = distinct !{!162, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!163 = !{!164, !166, !168, !170, !120, !122, !100, !102}
!164 = distinct !{!164, !165, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!165 = distinct !{!165, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!166 = distinct !{!166, !167, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!167 = distinct !{!167, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!168 = distinct !{!168, !169, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!169 = distinct !{!169, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!170 = distinct !{!170, !171, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!171 = distinct !{!171, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!172 = !{!173, !175, !177, !179, !120, !122, !100, !102}
!173 = distinct !{!173, !174, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!174 = distinct !{!174, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!175 = distinct !{!175, !176, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!176 = distinct !{!176, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!177 = distinct !{!177, !178, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!178 = distinct !{!178, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!179 = distinct !{!179, !180, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!180 = distinct !{!180, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!181 = !{!182, !184, !186, !187, !189}
!182 = distinct !{!182, !183, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h62cdf6516e1d9be9E: %_0"}
!183 = distinct !{!183, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h62cdf6516e1d9be9E"}
!184 = distinct !{!184, !185, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17hed5934792d663ff0E: %_0"}
!185 = distinct !{!185, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17hed5934792d663ff0E"}
!186 = distinct !{!186, !185, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17hed5934792d663ff0E: %iterator"}
!187 = distinct !{!187, !188, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h9c34f0ba55704f58E: %_0"}
!188 = distinct !{!188, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h9c34f0ba55704f58E"}
!189 = distinct !{!189, !188, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h9c34f0ba55704f58E: %iterator"}
!190 = !{!191, !193, !195, !197, !198, !200, !201, !203, !204, !206, !184, !186, !187, !189}
!191 = distinct !{!191, !192, !"_ZN91_$LT$core..slice..iter..Iter$LT$T$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17hef33fbd52f0cf39dE: argument 0"}
!192 = distinct !{!192, !"_ZN91_$LT$core..slice..iter..Iter$LT$T$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17hef33fbd52f0cf39dE"}
!193 = distinct !{!193, !194, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h57bc5df72c806a72E: %g"}
!194 = distinct !{!194, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h57bc5df72c806a72E"}
!195 = distinct !{!195, !196, !"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17ha9efa2d49d76ccdcE: %self"}
!196 = distinct !{!196, !"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17ha9efa2d49d76ccdcE"}
!197 = distinct !{!197, !196, !"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17ha9efa2d49d76ccdcE: %f"}
!198 = distinct !{!198, !199, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h3a5f8700989cd6bdE: %self"}
!199 = distinct !{!199, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h3a5f8700989cd6bdE"}
!200 = distinct !{!200, !199, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h3a5f8700989cd6bdE: %f"}
!201 = distinct !{!201, !202, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h84142fa0cc2be211E: %self"}
!202 = distinct !{!202, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h84142fa0cc2be211E"}
!203 = distinct !{!203, !202, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h84142fa0cc2be211E: %iterator"}
!204 = distinct !{!204, !205, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17ha54fc54bd9000929E: %self"}
!205 = distinct !{!205, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17ha54fc54bd9000929E"}
!206 = distinct !{!206, !205, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17ha54fc54bd9000929E: %iterator"}
!207 = !{!208, !210, !195, !197, !198, !200, !201, !203, !204, !206, !184, !186, !187, !189}
!208 = distinct !{!208, !209, !"_ZN4core4iter6traits8iterator8Iterator4fold17hbe1cdb84f2b09c12E: %self"}
!209 = distinct !{!209, !"_ZN4core4iter6traits8iterator8Iterator4fold17hbe1cdb84f2b09c12E"}
!210 = distinct !{!210, !209, !"_ZN4core4iter6traits8iterator8Iterator4fold17hbe1cdb84f2b09c12E: %f"}
!211 = !{!212, !208, !210, !195, !197, !198, !200, !201, !203, !204, !206, !184, !186, !187, !189}
!212 = distinct !{!212, !213, !"_ZN86_$LT$alloc..vec..into_iter..IntoIter$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h143ee912705a59e0E: %self"}
!213 = distinct !{!213, !"_ZN86_$LT$alloc..vec..into_iter..IntoIter$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h143ee912705a59e0E"}
!214 = !{!184, !186, !187, !189}
!215 = !{!216}
!216 = distinct !{!216, !217, !"_ZN5alloc5slice4hack8into_vec17hd98fdd0e7abbdea8E: %_0"}
!217 = distinct !{!217, !"_ZN5alloc5slice4hack8into_vec17hd98fdd0e7abbdea8E"}
!218 = !{!219}
!219 = distinct !{!219, !217, !"_ZN5alloc5slice4hack8into_vec17hd98fdd0e7abbdea8E: %b.0"}
!220 = !{i64 0, i64 -9223372036854775781}
!221 = !{!222}
!222 = distinct !{!222, !223, !"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h531bcf60c50349c1E: %_1"}
!223 = distinct !{!223, !"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h531bcf60c50349c1E"}
!224 = !{!225}
!225 = distinct !{!225, !226, !"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h531bcf60c50349c1E: %_1"}
!226 = distinct !{!226, !"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h531bcf60c50349c1E"}
!227 = !{!228}
!228 = distinct !{!228, !229, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h62cdf6516e1d9be9E: %_0"}
!229 = distinct !{!229, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h62cdf6516e1d9be9E"}
!230 = !{!231, !233, !235}
!231 = distinct !{!231, !232, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!232 = distinct !{!232, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!233 = distinct !{!233, !234, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!234 = distinct !{!234, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!235 = distinct !{!235, !236, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!236 = distinct !{!236, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!237 = !{!238}
!238 = distinct !{!238, !239, !"_ZN72_$LT$full_direct..DisableEvent$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17h840e6a3ebbbb2173E: %self"}
!239 = distinct !{!239, !"_ZN72_$LT$full_direct..DisableEvent$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17h840e6a3ebbbb2173E"}
!240 = !{!241}
!241 = distinct !{!241, !239, !"_ZN72_$LT$full_direct..DisableEvent$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17h840e6a3ebbbb2173E: %writer"}
!242 = !{!243, !245, !247, !249, !238, !241}
!243 = distinct !{!243, !244, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!244 = distinct !{!244, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!245 = distinct !{!245, !246, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!246 = distinct !{!246, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!247 = distinct !{!247, !248, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!248 = distinct !{!248, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!249 = distinct !{!249, !250, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!250 = distinct !{!250, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!251 = !{!252, !254, !256, !258, !260, !262, !241}
!252 = distinct !{!252, !253, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!253 = distinct !{!253, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!254 = distinct !{!254, !255, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!255 = distinct !{!255, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!256 = distinct !{!256, !257, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!257 = distinct !{!257, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!258 = distinct !{!258, !259, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!259 = distinct !{!259, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!260 = distinct !{!260, !261, !"_ZN69_$LT$$u5b$T$u3b$$u20$N$u5d$$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17hc595aadfd717d22bE: %writer"}
!261 = distinct !{!261, !"_ZN69_$LT$$u5b$T$u3b$$u20$N$u5d$$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17hc595aadfd717d22bE"}
!262 = distinct !{!262, !263, !"_ZN68_$LT$solana_pubkey..Pubkey$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17h93b8c3303e532ebaE: %writer"}
!263 = distinct !{!263, !"_ZN68_$LT$solana_pubkey..Pubkey$u20$as$u20$borsh..ser..BorshSerialize$GT$9serialize17h93b8c3303e532ebaE"}
!264 = !{!265, !267, !269, !271, !238, !241}
!265 = distinct !{!265, !266, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!266 = distinct !{!266, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!267 = distinct !{!267, !268, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!268 = distinct !{!268, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!269 = distinct !{!269, !270, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!270 = distinct !{!270, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!271 = distinct !{!271, !272, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!272 = distinct !{!272, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!273 = !{!274, !276, !278, !280, !238, !241}
!274 = distinct !{!274, !275, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!275 = distinct !{!275, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!276 = distinct !{!276, !277, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!277 = distinct !{!277, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!278 = distinct !{!278, !279, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!279 = distinct !{!279, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!280 = distinct !{!280, !281, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!281 = distinct !{!281, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!282 = !{!283, !285, !287, !289, !238, !241}
!283 = distinct !{!283, !284, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!284 = distinct !{!284, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!285 = distinct !{!285, !286, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!286 = distinct !{!286, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!287 = distinct !{!287, !288, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!288 = distinct !{!288, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!289 = distinct !{!289, !290, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!290 = distinct !{!290, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!291 = !{!292, !294, !296, !298, !238, !241}
!292 = distinct !{!292, !293, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!293 = distinct !{!293, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!294 = distinct !{!294, !295, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!295 = distinct !{!295, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!296 = distinct !{!296, !297, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!297 = distinct !{!297, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!298 = distinct !{!298, !299, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!299 = distinct !{!299, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
!300 = !{!301, !303, !305, !307, !238, !241}
!301 = distinct !{!301, !302, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE: %self"}
!302 = distinct !{!302, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h5b6225c9087b6d8eE"}
!303 = distinct !{!303, !304, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE: %self"}
!304 = distinct !{!304, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h232e1557a351718aE"}
!305 = distinct !{!305, !306, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E: %self"}
!306 = distinct !{!306, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4dd54f2976f8b215E"}
!307 = distinct !{!307, !308, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E: %self"}
!308 = distinct !{!308, !"_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h653a8b4b57fee4d7E"}
