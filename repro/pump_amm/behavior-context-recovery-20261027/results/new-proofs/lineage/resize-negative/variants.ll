; ModuleID = 'variants.6784270bd5c3c745-cgu.0'
source_filename = "variants.6784270bd5c3c745-cgu.0"
target datalayout = "e-m:e-p:64:64-i64:64-n32:64-S128"
target triple = "sbf"

; variants::baseline
; Function Attrs: nounwind
define hidden { i64, ptr } @_ZN8variants8baseline17hea41397199525678E(ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %pool, ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %system_program, ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %payer) unnamed_addr #0 {
start:
  %_49.i = alloca [24 x i8], align 8
  %_32.i = alloca [48 x i8], align 8
  %_30.i = alloca [24 x i8], align 8
  %_23.i = alloca [184 x i8], align 8
  %_19.i = alloca [48 x i8], align 8
  %_14.i = alloca [32 x i8], align 8
  %_13.sroa.5.i = alloca [24 x i8], align 8
  %_12.i3 = alloca [24 x i8], align 8
  %_8.i = alloca [48 x i8], align 8
  %_7 = alloca [48 x i8], align 8
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_7)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !2)
  %_2.i = load ptr, ptr %pool, align 8, !noalias !5, !nonnull !5, !align !6, !noundef !5
  %0 = getelementptr inbounds i8, ptr %pool, i64 8
  %_12.i = load ptr, ptr %0, align 8, !noalias !5, !nonnull !5, !noundef !5
  %self.val.i.i = load i64, ptr %_12.i, align 8, !noalias !7, !noundef !5
  %cond.i.i = icmp ne i64 %self.val.i.i, 0
  tail call void @llvm.assume(i1 %cond.i.i)
  %strong1.i.i = add i64 %self.val.i.i, 1
  store i64 %strong1.i.i, ptr %_12.i, align 8, !noalias !7
  %_7.i.i = icmp eq i64 %strong1.i.i, 0
  br i1 %_7.i.i, label %bb4.i.i, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i

bb4.i.i:                                          ; preds = %start
  tail call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i: ; preds = %start
  %1 = getelementptr inbounds i8, ptr %pool, i64 16
  %_16.i = load ptr, ptr %1, align 8, !noalias !5, !nonnull !5, !noundef !5
  %self.val.i1.i = load i64, ptr %_16.i, align 8, !noalias !7, !noundef !5
  %cond.i2.i = icmp ne i64 %self.val.i1.i, 0
  tail call void @llvm.assume(i1 %cond.i2.i)
  %strong1.i3.i = add i64 %self.val.i1.i, 1
  store i64 %strong1.i3.i, ptr %_16.i, align 8, !noalias !7
  %_7.i4.i = icmp eq i64 %strong1.i3.i, 0
  br i1 %_7.i4.i, label %bb4.i5.i, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit"

bb4.i5.i:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i
  tail call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i
  %2 = getelementptr inbounds i8, ptr %pool, i64 24
  %_5.i = load ptr, ptr %2, align 8, !noalias !5, !nonnull !5, !align !6, !noundef !5
  %3 = getelementptr inbounds i8, ptr %pool, i64 32
  %_6.i = load i64, ptr %3, align 8, !noalias !5, !noundef !5
  %4 = getelementptr inbounds i8, ptr %pool, i64 40
  %5 = load i8, ptr %4, align 8, !range !9, !noalias !5, !noundef !5
  %6 = getelementptr inbounds i8, ptr %pool, i64 41
  %7 = load i8, ptr %6, align 1, !range !9, !noalias !5, !noundef !5
  %8 = getelementptr inbounds i8, ptr %pool, i64 42
  %9 = load i8, ptr %8, align 2, !range !9, !noalias !5, !noundef !5
  store ptr %_2.i, ptr %_7, align 8, !alias.scope !2, !noalias !10
  %10 = getelementptr inbounds i8, ptr %_7, i64 8
  store ptr %_12.i, ptr %10, align 8, !alias.scope !2, !noalias !10
  %11 = getelementptr inbounds i8, ptr %_7, i64 16
  store ptr %_16.i, ptr %11, align 8, !alias.scope !2, !noalias !10
  %12 = getelementptr inbounds i8, ptr %_7, i64 24
  store ptr %_5.i, ptr %12, align 8, !alias.scope !2, !noalias !10
  %13 = getelementptr inbounds i8, ptr %_7, i64 32
  store i64 %_6.i, ptr %13, align 8, !alias.scope !2, !noalias !10
  %14 = getelementptr inbounds i8, ptr %_7, i64 40
  store i8 %5, ptr %14, align 8, !alias.scope !2, !noalias !10
  %15 = getelementptr inbounds i8, ptr %_7, i64 41
  store i8 %7, ptr %15, align 1, !alias.scope !2, !noalias !10
  %16 = getelementptr inbounds i8, ptr %_7, i64 42
  store i8 %9, ptr %16, align 2, !alias.scope !2, !noalias !10
; call solana_account_info::AccountInfo::data_len
  %_5 = call noundef i64 @_ZN19solana_account_info11AccountInfo8data_len17hab41f5a7fca37a40E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_7) #11
  %_4 = icmp ult i64 %_5, 287
  %_7.val = load ptr, ptr %10, align 8, !nonnull !5, !noundef !5
  %_7.val2 = load ptr, ptr %11, align 8
  %self1.val.i.i.i = load i64, ptr %_7.val, align 8, !noundef !5
  %val.i.i.i = add i64 %self1.val.i.i.i, -1
  store i64 %val.i.i.i, ptr %_7.val, align 8
  %17 = icmp eq i64 %val.i.i.i, 0
  br i1 %17, label %bb1.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i"

bb1.i.i.i:                                        ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit"
  %18 = getelementptr i8, ptr %_7.val, i64 8
  %self2.val.i.i.i = load i64, ptr %18, align 8, !noundef !5
  %val6.i.i.i = add i64 %self2.val.i.i.i, -1
  store i64 %val6.i.i.i, ptr %18, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i": ; preds = %bb1.i.i.i, %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit"
  %19 = icmp ne ptr %_7.val2, null
  call void @llvm.assume(i1 %19)
  %self1.val.i.i2.i = load i64, ptr %_7.val2, align 8, !noundef !5
  %val.i.i3.i = add i64 %self1.val.i.i2.i, -1
  store i64 %val.i.i3.i, ptr %_7.val2, align 8
  %20 = icmp eq i64 %val.i.i3.i, 0
  br i1 %20, label %bb1.i.i4.i, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit"

bb1.i.i4.i:                                       ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i"
  %21 = getelementptr i8, ptr %_7.val2, i64 8
  %self2.val.i.i5.i = load i64, ptr %21, align 8, !noundef !5
  %val6.i.i6.i = add i64 %self2.val.i.i5.i, -1
  store i64 %val6.i.i6.i, ptr %21, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i", %bb1.i.i4.i
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_7)
  br i1 %_4, label %bb2, label %bb9

bb2:                                              ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit"
  call void @llvm.experimental.noalias.scope.decl(metadata !11)
  call void @llvm.experimental.noalias.scope.decl(metadata !14)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_13.sroa.5.i)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_8.i), !noalias !16
  call void @llvm.experimental.noalias.scope.decl(metadata !18)
  %self.val.i.i.i = load i64, ptr %_12.i, align 8, !noalias !21, !noundef !5
  %cond.i.i.i = icmp ne i64 %self.val.i.i.i, 0
  call void @llvm.assume(i1 %cond.i.i.i)
  %strong1.i.i.i = add i64 %self.val.i.i.i, 1
  store i64 %strong1.i.i.i, ptr %_12.i, align 8, !noalias !21
  %_7.i.i.i = icmp eq i64 %strong1.i.i.i, 0
  br i1 %_7.i.i.i, label %bb4.i.i.i, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i.i

bb4.i.i.i:                                        ; preds = %bb2
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i.i: ; preds = %bb2
  %self.val.i1.i.i = load i64, ptr %_16.i, align 8, !noalias !21, !noundef !5
  %cond.i2.i.i = icmp ne i64 %self.val.i1.i.i, 0
  call void @llvm.assume(i1 %cond.i2.i.i)
  %strong1.i3.i.i = add i64 %self.val.i1.i.i, 1
  store i64 %strong1.i3.i.i, ptr %_16.i, align 8, !noalias !21
  %_7.i4.i.i = icmp eq i64 %strong1.i3.i.i, 0
  br i1 %_7.i4.i.i, label %bb4.i5.i.i, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit.i"

bb4.i5.i.i:                                       ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i.i
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit.i": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i.i
  store ptr %_2.i, ptr %_8.i, align 8, !alias.scope !18, !noalias !23
  %22 = getelementptr inbounds i8, ptr %_8.i, i64 8
  store ptr %_12.i, ptr %22, align 8, !alias.scope !18, !noalias !23
  %23 = getelementptr inbounds i8, ptr %_8.i, i64 16
  store ptr %_16.i, ptr %23, align 8, !alias.scope !18, !noalias !23
  %24 = getelementptr inbounds i8, ptr %_8.i, i64 24
  store ptr %_5.i, ptr %24, align 8, !alias.scope !18, !noalias !23
  %25 = getelementptr inbounds i8, ptr %_8.i, i64 32
  store i64 %_6.i, ptr %25, align 8, !alias.scope !18, !noalias !23
  %26 = getelementptr inbounds i8, ptr %_8.i, i64 40
  store i8 %5, ptr %26, align 8, !alias.scope !18, !noalias !23
  %27 = getelementptr inbounds i8, ptr %_8.i, i64 41
  store i8 %7, ptr %27, align 1, !alias.scope !18, !noalias !23
  %28 = getelementptr inbounds i8, ptr %_8.i, i64 42
  store i8 %9, ptr %28, align 2, !alias.scope !18, !noalias !23
; call solana_account_info::AccountInfo::data_len
  %_6.i4 = call noundef i64 @_ZN19solana_account_info11AccountInfo8data_len17hab41f5a7fca37a40E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_8.i) #11, !noalias !16
  %_5.i5 = icmp ult i64 %_6.i4, 287
  %_8.val.i = load ptr, ptr %22, align 8, !noalias !16, !nonnull !5, !noundef !5
  %_8.val9.i = load ptr, ptr %23, align 8, !noalias !16
  %self1.val.i.i.i.i = load i64, ptr %_8.val.i, align 8, !noalias !16, !noundef !5
  %val.i.i.i.i = add i64 %self1.val.i.i.i.i, -1
  store i64 %val.i.i.i.i, ptr %_8.val.i, align 8, !noalias !16
  %29 = icmp eq i64 %val.i.i.i.i, 0
  br i1 %29, label %bb1.i.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i.i"

bb1.i.i.i.i:                                      ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit.i"
  %30 = getelementptr i8, ptr %_8.val.i, i64 8
  %self2.val.i.i.i.i = load i64, ptr %30, align 8, !noalias !16, !noundef !5
  %val6.i.i.i.i = add i64 %self2.val.i.i.i.i, -1
  store i64 %val6.i.i.i.i, ptr %30, align 8, !noalias !16
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i.i": ; preds = %bb1.i.i.i.i, %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit.i"
  %31 = icmp ne ptr %_8.val9.i, null
  call void @llvm.assume(i1 %31)
  %self1.val.i.i2.i.i = load i64, ptr %_8.val9.i, align 8, !noalias !16, !noundef !5
  %val.i.i3.i.i = add i64 %self1.val.i.i2.i.i, -1
  store i64 %val.i.i3.i.i, ptr %_8.val9.i, align 8, !noalias !16
  %32 = icmp eq i64 %val.i.i3.i.i, 0
  br i1 %32, label %bb1.i.i4.i.i, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit.i"

bb1.i.i4.i.i:                                     ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i.i"
  %33 = getelementptr i8, ptr %_8.val9.i, i64 8
  %self2.val.i.i5.i.i = load i64, ptr %33, align 8, !noalias !16, !noundef !5
  %val6.i.i6.i.i = add i64 %self2.val.i.i5.i.i, -1
  store i64 %val6.i.i6.i.i, ptr %33, align 8, !noalias !16
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit.i"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit.i": ; preds = %bb1.i.i4.i.i, %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i.i"
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_8.i), !noalias !16
  br i1 %_5.i5, label %bb2.i, label %_ZN8variants14inner_baseline17hd0a84941d87bea94E.exit.thread

bb2.i:                                            ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit.i"
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_12.i3), !noalias !16
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_14.i), !noalias !16
; call solana_sysvar::rent::<impl solana_sysvar::Sysvar for solana_rent::Rent>::get
  call void @"_ZN13solana_sysvar4rent69_$LT$impl$u20$solana_sysvar..Sysvar$u20$for$u20$solana_rent..Rent$GT$3get17h451d81047c683abdE"(ptr noalias nocapture noundef nonnull sret([32 x i8]) align 8 dereferenceable(32) %_14.i) #11, !noalias !16
  %_34.i = load i64, ptr %_14.i, align 8, !range !24, !noalias !16, !noundef !5
  %trunc.not.i = icmp eq i64 %_34.i, 0
  %34 = getelementptr inbounds i8, ptr %_14.i, i64 8
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_13.sroa.5.i, ptr noundef nonnull align 8 dereferenceable(24) %34, i64 24, i1 false), !noalias !16
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_14.i), !noalias !16
  br i1 %trunc.not.i, label %bb22.i, label %bb21.i

bb22.i:                                           ; preds = %bb2.i
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_12.i3, ptr noundef nonnull align 8 dereferenceable(24) %_13.sroa.5.i, i64 24, i1 false), !noalias !16
; call solana_rent::Rent::minimum_balance
  %_10.i = call noundef i64 @_ZN11solana_rent4Rent15minimum_balance17had8abba6b93c5f14E(ptr noalias noundef nonnull readonly align 8 dereferenceable(24) %_12.i3, i64 noundef 287) #11, !noalias !16
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_19.i), !noalias !16
  call void @llvm.experimental.noalias.scope.decl(metadata !25)
  %self.val.i.i12.i = load i64, ptr %_12.i, align 8, !noalias !28, !noundef !5
  %cond.i.i13.i = icmp ne i64 %self.val.i.i12.i, 0
  call void @llvm.assume(i1 %cond.i.i13.i)
  %strong1.i.i14.i = add i64 %self.val.i.i12.i, 1
  store i64 %strong1.i.i14.i, ptr %_12.i, align 8, !noalias !28
  %_7.i.i15.i = icmp eq i64 %strong1.i.i14.i, 0
  br i1 %_7.i.i15.i, label %bb4.i.i25.i, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i16.i

bb4.i.i25.i:                                      ; preds = %bb22.i
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i16.i: ; preds = %bb22.i
  %self.val.i1.i18.i = load i64, ptr %_16.i, align 8, !noalias !28, !noundef !5
  %cond.i2.i19.i = icmp ne i64 %self.val.i1.i18.i, 0
  call void @llvm.assume(i1 %cond.i2.i19.i)
  %strong1.i3.i20.i = add i64 %self.val.i1.i18.i, 1
  store i64 %strong1.i3.i20.i, ptr %_16.i, align 8, !noalias !28
  %_7.i4.i21.i = icmp eq i64 %strong1.i3.i20.i, 0
  br i1 %_7.i4.i21.i, label %bb4.i5.i24.i, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit26.i"

bb4.i5.i24.i:                                     ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i16.i
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit26.i": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i16.i
  store ptr %_2.i, ptr %_19.i, align 8, !alias.scope !25, !noalias !30
  %35 = getelementptr inbounds i8, ptr %_19.i, i64 8
  store ptr %_12.i, ptr %35, align 8, !alias.scope !25, !noalias !30
  %36 = getelementptr inbounds i8, ptr %_19.i, i64 16
  store ptr %_16.i, ptr %36, align 8, !alias.scope !25, !noalias !30
  %37 = getelementptr inbounds i8, ptr %_19.i, i64 24
  store ptr %_5.i, ptr %37, align 8, !alias.scope !25, !noalias !30
  %38 = getelementptr inbounds i8, ptr %_19.i, i64 32
  store i64 %_6.i, ptr %38, align 8, !alias.scope !25, !noalias !30
  %39 = getelementptr inbounds i8, ptr %_19.i, i64 40
  store i8 %5, ptr %39, align 8, !alias.scope !25, !noalias !30
  %40 = getelementptr inbounds i8, ptr %_19.i, i64 41
  store i8 %7, ptr %40, align 1, !alias.scope !25, !noalias !30
  %41 = getelementptr inbounds i8, ptr %_19.i, i64 42
  store i8 %9, ptr %41, align 2, !alias.scope !25, !noalias !30
; call solana_account_info::AccountInfo::lamports
  %_17.i = call noundef i64 @_ZN19solana_account_info11AccountInfo8lamports17h3208c65b27977111E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_19.i) #11, !noalias !16
  %_19.val.i = load ptr, ptr %35, align 8, !noalias !16, !nonnull !5, !noundef !5
  %_19.val8.i = load ptr, ptr %36, align 8, !noalias !16
  %self1.val.i.i.i27.i = load i64, ptr %_19.val.i, align 8, !noalias !16, !noundef !5
  %val.i.i.i28.i = add i64 %self1.val.i.i.i27.i, -1
  store i64 %val.i.i.i28.i, ptr %_19.val.i, align 8, !noalias !16
  %42 = icmp eq i64 %val.i.i.i28.i, 0
  br i1 %42, label %bb1.i.i.i35.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i29.i"

bb1.i.i.i35.i:                                    ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit26.i"
  %43 = getelementptr i8, ptr %_19.val.i, i64 8
  %self2.val.i.i.i36.i = load i64, ptr %43, align 8, !noalias !16, !noundef !5
  %val6.i.i.i37.i = add i64 %self2.val.i.i.i36.i, -1
  store i64 %val6.i.i.i37.i, ptr %43, align 8, !noalias !16
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i29.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i29.i": ; preds = %bb1.i.i.i35.i, %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit26.i"
  %44 = icmp ne ptr %_19.val8.i, null
  call void @llvm.assume(i1 %44)
  %self1.val.i.i2.i30.i = load i64, ptr %_19.val8.i, align 8, !noalias !16, !noundef !5
  %val.i.i3.i31.i = add i64 %self1.val.i.i2.i30.i, -1
  store i64 %val.i.i3.i31.i, ptr %_19.val8.i, align 8, !noalias !16
  %45 = icmp eq i64 %val.i.i3.i31.i, 0
  br i1 %45, label %bb1.i.i4.i32.i, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit38.i"

bb1.i.i4.i32.i:                                   ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i29.i"
  %46 = getelementptr i8, ptr %_19.val8.i, i64 8
  %self2.val.i.i5.i33.i = load i64, ptr %46, align 8, !noalias !16, !noundef !5
  %val6.i.i6.i34.i = add i64 %self2.val.i.i5.i33.i, -1
  store i64 %val6.i.i6.i34.i, ptr %46, align 8, !noalias !16
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit38.i"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit38.i": ; preds = %bb1.i.i4.i32.i, %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i29.i"
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_19.i), !noalias !16
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_12.i3), !noalias !16
  %_20.not.not.i = icmp ugt i64 %_10.i, %_17.i
  br i1 %_20.not.not.i, label %bb9.i, label %bb11.i

bb21.i:                                           ; preds = %bb2.i
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %47 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17heba0ebbdde914d9aE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_13.sroa.5.i) #11, !noalias !16
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_12.i3), !noalias !16
  br label %_ZN8variants14inner_baseline17hd0a84941d87bea94E.exit

bb11.i:                                           ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit106.i", %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit38.i"
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_30.i), !noalias !16
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_32.i), !noalias !16
  call void @llvm.experimental.noalias.scope.decl(metadata !31)
  %self.val.i.i41.i = load i64, ptr %_12.i, align 8, !noalias !34, !noundef !5
  %cond.i.i42.i = icmp ne i64 %self.val.i.i41.i, 0
  call void @llvm.assume(i1 %cond.i.i42.i)
  %strong1.i.i43.i = add i64 %self.val.i.i41.i, 1
  store i64 %strong1.i.i43.i, ptr %_12.i, align 8, !noalias !34
  %_7.i.i44.i = icmp eq i64 %strong1.i.i43.i, 0
  br i1 %_7.i.i44.i, label %bb4.i.i54.i, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i45.i

bb4.i.i54.i:                                      ; preds = %bb11.i
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i45.i: ; preds = %bb11.i
  %self.val.i1.i47.i = load i64, ptr %_16.i, align 8, !noalias !34, !noundef !5
  %cond.i2.i48.i = icmp ne i64 %self.val.i1.i47.i, 0
  call void @llvm.assume(i1 %cond.i2.i48.i)
  %strong1.i3.i49.i = add i64 %self.val.i1.i47.i, 1
  store i64 %strong1.i3.i49.i, ptr %_16.i, align 8, !noalias !34
  %_7.i4.i50.i = icmp eq i64 %strong1.i3.i49.i, 0
  br i1 %_7.i4.i50.i, label %bb4.i5.i53.i, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit55.i"

bb4.i5.i53.i:                                     ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i45.i
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit55.i": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i45.i
  store ptr %_2.i, ptr %_32.i, align 8, !alias.scope !31, !noalias !36
  %48 = getelementptr inbounds i8, ptr %_32.i, i64 8
  store ptr %_12.i, ptr %48, align 8, !alias.scope !31, !noalias !36
  %49 = getelementptr inbounds i8, ptr %_32.i, i64 16
  store ptr %_16.i, ptr %49, align 8, !alias.scope !31, !noalias !36
  %50 = getelementptr inbounds i8, ptr %_32.i, i64 24
  store ptr %_5.i, ptr %50, align 8, !alias.scope !31, !noalias !36
  %51 = getelementptr inbounds i8, ptr %_32.i, i64 32
  store i64 %_6.i, ptr %51, align 8, !alias.scope !31, !noalias !36
  %52 = getelementptr inbounds i8, ptr %_32.i, i64 40
  store i8 %5, ptr %52, align 8, !alias.scope !31, !noalias !36
  %53 = getelementptr inbounds i8, ptr %_32.i, i64 41
  store i8 %7, ptr %53, align 1, !alias.scope !31, !noalias !36
  %54 = getelementptr inbounds i8, ptr %_32.i, i64 42
  store i8 %9, ptr %54, align 2, !alias.scope !31, !noalias !36
; call solana_account_info::AccountInfo::realloc
  call void @_ZN19solana_account_info11AccountInfo7realloc17ha4197952dec82defE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_30.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_32.i, i64 noundef 287, i1 noundef zeroext false) #11, !noalias !16
  %55 = load i64, ptr %_30.i, align 8, !range !37, !noalias !16, !noundef !5
  %56 = icmp eq i64 %55, -9223372036854775782
  br i1 %56, label %bb33.i, label %bb32.i

bb9.i:                                            ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit38.i"
  %57 = call i64 @llvm.usub.sat.i64(i64 %_10.i, i64 %_17.i)
  call void @llvm.lifetime.start.p0(i64 184, ptr nonnull %_23.i), !noalias !16
  call void @llvm.experimental.noalias.scope.decl(metadata !38)
  %_2.i56.i = load ptr, ptr %system_program, align 8, !alias.scope !41, !noalias !42, !nonnull !5, !align !6, !noundef !5
  %58 = getelementptr inbounds i8, ptr %system_program, i64 8
  %_12.i57.i = load ptr, ptr %58, align 8, !alias.scope !41, !noalias !42, !nonnull !5, !noundef !5
  %self.val.i.i58.i = load i64, ptr %_12.i57.i, align 8, !noalias !44, !noundef !5
  %cond.i.i59.i = icmp ne i64 %self.val.i.i58.i, 0
  call void @llvm.assume(i1 %cond.i.i59.i)
  %strong1.i.i60.i = add i64 %self.val.i.i58.i, 1
  store i64 %strong1.i.i60.i, ptr %_12.i57.i, align 8, !noalias !44
  %_7.i.i61.i = icmp eq i64 %strong1.i.i60.i, 0
  br i1 %_7.i.i61.i, label %bb4.i.i71.i, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i62.i

bb4.i.i71.i:                                      ; preds = %bb9.i
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i62.i: ; preds = %bb9.i
  %59 = getelementptr inbounds i8, ptr %system_program, i64 16
  %_16.i63.i = load ptr, ptr %59, align 8, !alias.scope !41, !noalias !42, !nonnull !5, !noundef !5
  %self.val.i1.i64.i = load i64, ptr %_16.i63.i, align 8, !noalias !44, !noundef !5
  %cond.i2.i65.i = icmp ne i64 %self.val.i1.i64.i, 0
  call void @llvm.assume(i1 %cond.i2.i65.i)
  %strong1.i3.i66.i = add i64 %self.val.i1.i64.i, 1
  store i64 %strong1.i3.i66.i, ptr %_16.i63.i, align 8, !noalias !44
  %_7.i4.i67.i = icmp eq i64 %strong1.i3.i66.i, 0
  br i1 %_7.i4.i67.i, label %bb4.i5.i70.i, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit72.i"

bb4.i5.i70.i:                                     ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i62.i
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit72.i": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i62.i
  %60 = getelementptr inbounds i8, ptr %system_program, i64 24
  %_5.i68.i = load ptr, ptr %60, align 8, !alias.scope !41, !noalias !42, !nonnull !5, !align !6, !noundef !5
  %61 = getelementptr inbounds i8, ptr %system_program, i64 32
  %_6.i69.i = load i64, ptr %61, align 8, !alias.scope !41, !noalias !42, !noundef !5
  %62 = getelementptr inbounds i8, ptr %system_program, i64 40
  %63 = load i8, ptr %62, align 8, !range !9, !alias.scope !41, !noalias !42, !noundef !5
  %64 = getelementptr inbounds i8, ptr %system_program, i64 41
  %65 = load i8, ptr %64, align 1, !range !9, !alias.scope !41, !noalias !42, !noundef !5
  %66 = getelementptr inbounds i8, ptr %system_program, i64 42
  %67 = load i8, ptr %66, align 2, !range !9, !alias.scope !41, !noalias !42, !noundef !5
  call void @llvm.experimental.noalias.scope.decl(metadata !45)
  %_2.i73.i = load ptr, ptr %payer, align 8, !alias.scope !48, !noalias !49, !nonnull !5, !align !6, !noundef !5
  %68 = getelementptr inbounds i8, ptr %payer, i64 8
  %_12.i74.i = load ptr, ptr %68, align 8, !alias.scope !48, !noalias !49, !nonnull !5, !noundef !5
  %self.val.i.i75.i = load i64, ptr %_12.i74.i, align 8, !noalias !51, !noundef !5
  %cond.i.i76.i = icmp ne i64 %self.val.i.i75.i, 0
  call void @llvm.assume(i1 %cond.i.i76.i)
  %strong1.i.i77.i = add i64 %self.val.i.i75.i, 1
  store i64 %strong1.i.i77.i, ptr %_12.i74.i, align 8, !noalias !51
  %_7.i.i78.i = icmp eq i64 %strong1.i.i77.i, 0
  br i1 %_7.i.i78.i, label %bb4.i.i88.i, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i79.i

bb4.i.i88.i:                                      ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit72.i"
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i79.i: ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit72.i"
  %69 = getelementptr inbounds i8, ptr %payer, i64 16
  %_16.i80.i = load ptr, ptr %69, align 8, !alias.scope !48, !noalias !49, !nonnull !5, !noundef !5
  %self.val.i1.i81.i = load i64, ptr %_16.i80.i, align 8, !noalias !51, !noundef !5
  %cond.i2.i82.i = icmp ne i64 %self.val.i1.i81.i, 0
  call void @llvm.assume(i1 %cond.i2.i82.i)
  %strong1.i3.i83.i = add i64 %self.val.i1.i81.i, 1
  store i64 %strong1.i3.i83.i, ptr %_16.i80.i, align 8, !noalias !51
  %_7.i4.i84.i = icmp eq i64 %strong1.i3.i83.i, 0
  br i1 %_7.i4.i84.i, label %bb4.i5.i87.i, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit89.i"

bb4.i5.i87.i:                                     ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i79.i
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit89.i": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i79.i
  %70 = getelementptr inbounds i8, ptr %payer, i64 24
  %_5.i85.i = load ptr, ptr %70, align 8, !alias.scope !48, !noalias !49, !nonnull !5, !align !6, !noundef !5
  %71 = getelementptr inbounds i8, ptr %payer, i64 32
  %_6.i86.i = load i64, ptr %71, align 8, !alias.scope !48, !noalias !49, !noundef !5
  %72 = getelementptr inbounds i8, ptr %payer, i64 40
  %73 = load i8, ptr %72, align 8, !range !9, !alias.scope !48, !noalias !49, !noundef !5
  %74 = getelementptr inbounds i8, ptr %payer, i64 41
  %75 = load i8, ptr %74, align 1, !range !9, !alias.scope !48, !noalias !49, !noundef !5
  %76 = getelementptr inbounds i8, ptr %payer, i64 42
  %77 = load i8, ptr %76, align 2, !range !9, !alias.scope !48, !noalias !49, !noundef !5
  %self.val.i.i92.i = load i64, ptr %_12.i, align 8, !noalias !52, !noundef !5
  %cond.i.i93.i = icmp ne i64 %self.val.i.i92.i, 0
  call void @llvm.assume(i1 %cond.i.i93.i)
  %strong1.i.i94.i = add i64 %self.val.i.i92.i, 1
  store i64 %strong1.i.i94.i, ptr %_12.i, align 8, !noalias !52
  %_7.i.i95.i = icmp eq i64 %strong1.i.i94.i, 0
  br i1 %_7.i.i95.i, label %bb4.i.i105.i, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i96.i

bb4.i.i105.i:                                     ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit89.i"
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i96.i: ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit89.i"
  %self.val.i1.i98.i = load i64, ptr %_16.i, align 8, !noalias !52, !noundef !5
  %cond.i2.i99.i = icmp ne i64 %self.val.i1.i98.i, 0
  call void @llvm.assume(i1 %cond.i2.i99.i)
  %strong1.i3.i100.i = add i64 %self.val.i1.i98.i, 1
  store i64 %strong1.i3.i100.i, ptr %_16.i, align 8, !noalias !52
  %_7.i4.i101.i = icmp eq i64 %strong1.i3.i100.i, 0
  br i1 %_7.i4.i101.i, label %bb4.i5.i104.i, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit106.i"

bb4.i5.i104.i:                                    ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i96.i
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit106.i": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i96.i
  %78 = getelementptr inbounds i8, ptr %_23.i, i64 72
  store ptr %_2.i73.i, ptr %78, align 8, !noalias !16
  %_25.sroa.4.0..sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 80
  store ptr %_12.i74.i, ptr %_25.sroa.4.0..sroa_idx.i, align 8, !noalias !16
  %_25.sroa.5.0..sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 88
  store ptr %_16.i80.i, ptr %_25.sroa.5.0..sroa_idx.i, align 8, !noalias !16
  %_25.sroa.6.0..sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 96
  store ptr %_5.i85.i, ptr %_25.sroa.6.0..sroa_idx.i, align 8, !noalias !16
  %_25.sroa.7.0..sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 104
  store i64 %_6.i86.i, ptr %_25.sroa.7.0..sroa_idx.i, align 8, !noalias !16
  %_25.sroa.8.0..sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 112
  store i8 %73, ptr %_25.sroa.8.0..sroa_idx.i, align 8, !noalias !16
  %_25.sroa.9.0..sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 113
  store i8 %75, ptr %_25.sroa.9.0..sroa_idx.i, align 1, !noalias !16
  %_25.sroa.10.0..sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 114
  store i8 %77, ptr %_25.sroa.10.0..sroa_idx.i, align 2, !noalias !16
  %_25.sroa.12.0..sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 120
  store ptr %_2.i, ptr %_25.sroa.12.0..sroa_idx.i, align 8, !noalias !16
  %_25.sroa.12.sroa.4.0._25.sroa.12.0..sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 128
  store ptr %_12.i, ptr %_25.sroa.12.sroa.4.0._25.sroa.12.0..sroa_idx.sroa_idx.i, align 8, !noalias !16
  %_25.sroa.12.sroa.5.0._25.sroa.12.0..sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 136
  store ptr %_16.i, ptr %_25.sroa.12.sroa.5.0._25.sroa.12.0..sroa_idx.sroa_idx.i, align 8, !noalias !16
  %_25.sroa.12.sroa.6.0._25.sroa.12.0..sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 144
  store ptr %_5.i, ptr %_25.sroa.12.sroa.6.0._25.sroa.12.0..sroa_idx.sroa_idx.i, align 8, !noalias !16
  %_25.sroa.12.sroa.7.0._25.sroa.12.0..sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 152
  store i64 %_6.i, ptr %_25.sroa.12.sroa.7.0._25.sroa.12.0..sroa_idx.sroa_idx.i, align 8, !noalias !16
  %_25.sroa.12.sroa.8.0._25.sroa.12.0..sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 160
  store i8 %5, ptr %_25.sroa.12.sroa.8.0._25.sroa.12.0..sroa_idx.sroa_idx.i, align 8, !noalias !16
  %_25.sroa.12.sroa.9.0._25.sroa.12.0..sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 161
  store i8 %7, ptr %_25.sroa.12.sroa.9.0._25.sroa.12.0..sroa_idx.sroa_idx.i, align 1, !noalias !16
  %_25.sroa.12.sroa.10.0._25.sroa.12.0..sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 162
  store i8 %9, ptr %_25.sroa.12.sroa.10.0._25.sroa.12.0..sroa_idx.sroa_idx.i, align 2, !noalias !16
  store i64 0, ptr %_23.i, align 8, !noalias !16
  %_40.sroa.4.0._23.sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 8
  store ptr inttoptr (i64 8 to ptr), ptr %_40.sroa.4.0._23.sroa_idx.i, align 8, !noalias !16
  %_40.sroa.5.0._23.sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 16
  store i64 0, ptr %_40.sroa.5.0._23.sroa_idx.i, align 8, !noalias !16
  %79 = getelementptr inbounds i8, ptr %_23.i, i64 24
  store ptr %_2.i56.i, ptr %79, align 8, !noalias !16
  %_24.sroa.4.0..sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 32
  store ptr %_12.i57.i, ptr %_24.sroa.4.0..sroa_idx.i, align 8, !noalias !16
  %_24.sroa.5.0..sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 40
  store ptr %_16.i63.i, ptr %_24.sroa.5.0..sroa_idx.i, align 8, !noalias !16
  %_24.sroa.6.0..sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 48
  store ptr %_5.i68.i, ptr %_24.sroa.6.0..sroa_idx.i, align 8, !noalias !16
  %_24.sroa.7.0..sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 56
  store i64 %_6.i69.i, ptr %_24.sroa.7.0..sroa_idx.i, align 8, !noalias !16
  %_24.sroa.8.0..sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 64
  store i8 %63, ptr %_24.sroa.8.0..sroa_idx.i, align 8, !noalias !16
  %_24.sroa.9.0..sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 65
  store i8 %65, ptr %_24.sroa.9.0..sroa_idx.i, align 1, !noalias !16
  %_24.sroa.10.0..sroa_idx.i = getelementptr inbounds i8, ptr %_23.i, i64 66
  store i8 %67, ptr %_24.sroa.10.0..sroa_idx.i, align 2, !noalias !16
  %80 = getelementptr inbounds i8, ptr %_23.i, i64 168
  store ptr inttoptr (i64 8 to ptr), ptr %80, align 8, !noalias !16
  %81 = getelementptr inbounds i8, ptr %_23.i, i64 176
  store i64 0, ptr %81, align 8, !noalias !16
; call anchor_lang::system_program::transfer
  %82 = call { i64, ptr } @_ZN11anchor_lang14system_program8transfer17h1c9302c6a5a1797fE(ptr noalias nocapture noundef nonnull align 8 dereferenceable(184) %_23.i, i64 noundef %57) #11, !noalias !16
  %83 = extractvalue { i64, ptr } %82, 0
  call void @llvm.lifetime.end.p0(i64 184, ptr nonnull %_23.i), !noalias !16
  %84 = icmp eq i64 %83, 2
  br i1 %84, label %bb11.i, label %_ZN8variants14inner_baseline17hd0a84941d87bea94E.exit.thread8

_ZN8variants14inner_baseline17hd0a84941d87bea94E.exit.thread8: ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit106.i"
  %85 = extractvalue { i64, ptr } %82, 1
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_13.sroa.5.i)
  br label %bb9

bb33.i:                                           ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit55.i"
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_30.i), !noalias !16
  %self1.val.i.i.i107.i = load i64, ptr %_12.i, align 8, !noalias !16, !noundef !5
  %val.i.i.i108.i = add i64 %self1.val.i.i.i107.i, -1
  store i64 %val.i.i.i108.i, ptr %_12.i, align 8, !noalias !16
  %86 = icmp eq i64 %val.i.i.i108.i, 0
  br i1 %86, label %bb1.i.i.i115.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i109.i"

bb1.i.i.i115.i:                                   ; preds = %bb33.i
  %87 = getelementptr i8, ptr %_12.i, i64 8
  %self2.val.i.i.i116.i = load i64, ptr %87, align 8, !noalias !16, !noundef !5
  %val6.i.i.i117.i = add i64 %self2.val.i.i.i116.i, -1
  store i64 %val6.i.i.i117.i, ptr %87, align 8, !noalias !16
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i109.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i109.i": ; preds = %bb1.i.i.i115.i, %bb33.i
  %self1.val.i.i2.i110.i = load i64, ptr %_16.i, align 8, !noalias !16, !noundef !5
  %val.i.i3.i111.i = add i64 %self1.val.i.i2.i110.i, -1
  store i64 %val.i.i3.i111.i, ptr %_16.i, align 8, !noalias !16
  %88 = icmp eq i64 %val.i.i3.i111.i, 0
  br i1 %88, label %bb1.i.i4.i112.i, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit118.i"

bb1.i.i4.i112.i:                                  ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i109.i"
  %89 = getelementptr i8, ptr %_16.i, i64 8
  %self2.val.i.i5.i113.i = load i64, ptr %89, align 8, !noalias !16, !noundef !5
  %val6.i.i6.i114.i = add i64 %self2.val.i.i5.i113.i, -1
  store i64 %val6.i.i6.i114.i, ptr %89, align 8, !noalias !16
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit118.i"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit118.i": ; preds = %bb1.i.i4.i112.i, %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i109.i"
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_32.i), !noalias !16
  br label %_ZN8variants14inner_baseline17hd0a84941d87bea94E.exit.thread

bb32.i:                                           ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit55.i"
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_49.i), !noalias !16
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_49.i, ptr noundef nonnull align 8 dereferenceable(24) %_30.i, i64 24, i1 false), !noalias !16
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_30.i), !noalias !16
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %90 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17heba0ebbdde914d9aE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_49.i) #11, !noalias !16
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_49.i), !noalias !16
  %_32.val.i = load ptr, ptr %48, align 8, !noalias !16, !nonnull !5, !noundef !5
  %_32.val5.i = load ptr, ptr %49, align 8, !noalias !16
  %self1.val.i.i.i119.i = load i64, ptr %_32.val.i, align 8, !noalias !16, !noundef !5
  %val.i.i.i120.i = add i64 %self1.val.i.i.i119.i, -1
  store i64 %val.i.i.i120.i, ptr %_32.val.i, align 8, !noalias !16
  %91 = icmp eq i64 %val.i.i.i120.i, 0
  br i1 %91, label %bb1.i.i.i127.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i121.i"

bb1.i.i.i127.i:                                   ; preds = %bb32.i
  %92 = getelementptr i8, ptr %_32.val.i, i64 8
  %self2.val.i.i.i128.i = load i64, ptr %92, align 8, !noalias !16, !noundef !5
  %val6.i.i.i129.i = add i64 %self2.val.i.i.i128.i, -1
  store i64 %val6.i.i.i129.i, ptr %92, align 8, !noalias !16
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i121.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i121.i": ; preds = %bb1.i.i.i127.i, %bb32.i
  %93 = icmp ne ptr %_32.val5.i, null
  call void @llvm.assume(i1 %93)
  %self1.val.i.i2.i122.i = load i64, ptr %_32.val5.i, align 8, !noalias !16, !noundef !5
  %val.i.i3.i123.i = add i64 %self1.val.i.i2.i122.i, -1
  store i64 %val.i.i3.i123.i, ptr %_32.val5.i, align 8, !noalias !16
  %94 = icmp eq i64 %val.i.i3.i123.i, 0
  br i1 %94, label %bb1.i.i4.i124.i, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit130.i"

bb1.i.i4.i124.i:                                  ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i121.i"
  %95 = getelementptr i8, ptr %_32.val5.i, i64 8
  %self2.val.i.i5.i125.i = load i64, ptr %95, align 8, !noalias !16, !noundef !5
  %val6.i.i6.i126.i = add i64 %self2.val.i.i5.i125.i, -1
  store i64 %val6.i.i6.i126.i, ptr %95, align 8, !noalias !16
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit130.i"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit130.i": ; preds = %bb1.i.i4.i124.i, %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i121.i"
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_32.i), !noalias !16
  br label %_ZN8variants14inner_baseline17hd0a84941d87bea94E.exit

_ZN8variants14inner_baseline17hd0a84941d87bea94E.exit.thread: ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit.i", %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit118.i"
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_13.sroa.5.i)
  br label %bb9

_ZN8variants14inner_baseline17hd0a84941d87bea94E.exit: ; preds = %bb21.i, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit130.i"
  %.pn = phi { i64, ptr } [ %47, %bb21.i ], [ %90, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit130.i" ]
  %_0.sroa.0.0.i = extractvalue { i64, ptr } %.pn, 0
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_13.sroa.5.i)
  %96 = icmp eq i64 %_0.sroa.0.0.i, 2
  br i1 %96, label %bb9, label %bb11

bb11:                                             ; preds = %_ZN8variants14inner_baseline17hd0a84941d87bea94E.exit
  %_0.sroa.5.0.i = extractvalue { i64, ptr } %.pn, 1
  br label %bb9

bb9:                                              ; preds = %_ZN8variants14inner_baseline17hd0a84941d87bea94E.exit.thread8, %_ZN8variants14inner_baseline17hd0a84941d87bea94E.exit.thread, %_ZN8variants14inner_baseline17hd0a84941d87bea94E.exit, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit", %bb11
  %_0.sroa.3.0 = phi ptr [ undef, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit" ], [ undef, %_ZN8variants14inner_baseline17hd0a84941d87bea94E.exit ], [ undef, %_ZN8variants14inner_baseline17hd0a84941d87bea94E.exit.thread ], [ %85, %_ZN8variants14inner_baseline17hd0a84941d87bea94E.exit.thread8 ], [ %_0.sroa.5.0.i, %bb11 ]
  %_0.sroa.0.0 = phi i64 [ 2, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit" ], [ 2, %_ZN8variants14inner_baseline17hd0a84941d87bea94E.exit ], [ 2, %_ZN8variants14inner_baseline17hd0a84941d87bea94E.exit.thread ], [ %83, %_ZN8variants14inner_baseline17hd0a84941d87bea94E.exit.thread8 ], [ %_0.sroa.0.0.i, %bb11 ]
  %97 = insertvalue { i64, ptr } poison, i64 %_0.sroa.0.0, 0
  %98 = insertvalue { i64, ptr } %97, ptr %_0.sroa.3.0, 1
  ret { i64, ptr } %98
}

; variants::direct_nested
; Function Attrs: nounwind
define hidden { i64, ptr } @_ZN8variants13direct_nested17h174fa3f918d99aa6E(ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %pool, ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %system_program, ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %payer) unnamed_addr #0 {
start:
  %_52 = alloca [24 x i8], align 8
  %_35 = alloca [48 x i8], align 8
  %_33 = alloca [24 x i8], align 8
  %_26 = alloca [184 x i8], align 8
  %_22 = alloca [48 x i8], align 8
  %_17 = alloca [32 x i8], align 8
  %_16.sroa.5 = alloca [24 x i8], align 8
  %_15 = alloca [24 x i8], align 8
  %_11 = alloca [48 x i8], align 8
  %_7 = alloca [48 x i8], align 8
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_7)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !56)
  %_2.i = load ptr, ptr %pool, align 8, !noalias !5, !nonnull !5, !align !6, !noundef !5
  %0 = getelementptr inbounds i8, ptr %pool, i64 8
  %_12.i = load ptr, ptr %0, align 8, !noalias !5, !nonnull !5, !noundef !5
  %self.val.i.i = load i64, ptr %_12.i, align 8, !noalias !59, !noundef !5
  %cond.i.i = icmp ne i64 %self.val.i.i, 0
  tail call void @llvm.assume(i1 %cond.i.i)
  %strong1.i.i = add i64 %self.val.i.i, 1
  store i64 %strong1.i.i, ptr %_12.i, align 8, !noalias !59
  %_7.i.i = icmp eq i64 %strong1.i.i, 0
  br i1 %_7.i.i, label %bb4.i.i, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i

bb4.i.i:                                          ; preds = %start
  tail call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i: ; preds = %start
  %1 = getelementptr inbounds i8, ptr %pool, i64 16
  %_16.i = load ptr, ptr %1, align 8, !noalias !5, !nonnull !5, !noundef !5
  %self.val.i1.i = load i64, ptr %_16.i, align 8, !noalias !59, !noundef !5
  %cond.i2.i = icmp ne i64 %self.val.i1.i, 0
  tail call void @llvm.assume(i1 %cond.i2.i)
  %strong1.i3.i = add i64 %self.val.i1.i, 1
  store i64 %strong1.i3.i, ptr %_16.i, align 8, !noalias !59
  %_7.i4.i = icmp eq i64 %strong1.i3.i, 0
  br i1 %_7.i4.i, label %bb4.i5.i, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit"

bb4.i5.i:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i
  tail call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i
  %2 = getelementptr inbounds i8, ptr %pool, i64 24
  %_5.i = load ptr, ptr %2, align 8, !noalias !5, !nonnull !5, !align !6, !noundef !5
  %3 = getelementptr inbounds i8, ptr %pool, i64 32
  %_6.i = load i64, ptr %3, align 8, !noalias !5, !noundef !5
  %4 = getelementptr inbounds i8, ptr %pool, i64 40
  %5 = load i8, ptr %4, align 8, !range !9, !noalias !5, !noundef !5
  %6 = getelementptr inbounds i8, ptr %pool, i64 41
  %7 = load i8, ptr %6, align 1, !range !9, !noalias !5, !noundef !5
  %8 = getelementptr inbounds i8, ptr %pool, i64 42
  %9 = load i8, ptr %8, align 2, !range !9, !noalias !5, !noundef !5
  store ptr %_2.i, ptr %_7, align 8, !alias.scope !56, !noalias !61
  %10 = getelementptr inbounds i8, ptr %_7, i64 8
  store ptr %_12.i, ptr %10, align 8, !alias.scope !56, !noalias !61
  %11 = getelementptr inbounds i8, ptr %_7, i64 16
  store ptr %_16.i, ptr %11, align 8, !alias.scope !56, !noalias !61
  %12 = getelementptr inbounds i8, ptr %_7, i64 24
  store ptr %_5.i, ptr %12, align 8, !alias.scope !56, !noalias !61
  %13 = getelementptr inbounds i8, ptr %_7, i64 32
  store i64 %_6.i, ptr %13, align 8, !alias.scope !56, !noalias !61
  %14 = getelementptr inbounds i8, ptr %_7, i64 40
  store i8 %5, ptr %14, align 8, !alias.scope !56, !noalias !61
  %15 = getelementptr inbounds i8, ptr %_7, i64 41
  store i8 %7, ptr %15, align 1, !alias.scope !56, !noalias !61
  %16 = getelementptr inbounds i8, ptr %_7, i64 42
  store i8 %9, ptr %16, align 2, !alias.scope !56, !noalias !61
; call solana_account_info::AccountInfo::data_len
  %_5 = call noundef i64 @_ZN19solana_account_info11AccountInfo8data_len17hab41f5a7fca37a40E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_7) #11
  %_4 = icmp ult i64 %_5, 287
  %_7.val = load ptr, ptr %10, align 8, !nonnull !5, !noundef !5
  %_7.val10 = load ptr, ptr %11, align 8
  %self1.val.i.i.i = load i64, ptr %_7.val, align 8, !noundef !5
  %val.i.i.i = add i64 %self1.val.i.i.i, -1
  store i64 %val.i.i.i, ptr %_7.val, align 8
  %17 = icmp eq i64 %val.i.i.i, 0
  br i1 %17, label %bb1.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i"

bb1.i.i.i:                                        ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit"
  %18 = getelementptr i8, ptr %_7.val, i64 8
  %self2.val.i.i.i = load i64, ptr %18, align 8, !noundef !5
  %val6.i.i.i = add i64 %self2.val.i.i.i, -1
  store i64 %val6.i.i.i, ptr %18, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i": ; preds = %bb1.i.i.i, %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit"
  %19 = icmp ne ptr %_7.val10, null
  call void @llvm.assume(i1 %19)
  %self1.val.i.i2.i = load i64, ptr %_7.val10, align 8, !noundef !5
  %val.i.i3.i = add i64 %self1.val.i.i2.i, -1
  store i64 %val.i.i3.i, ptr %_7.val10, align 8
  %20 = icmp eq i64 %val.i.i3.i, 0
  br i1 %20, label %bb1.i.i4.i, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit"

bb1.i.i4.i:                                       ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i"
  %21 = getelementptr i8, ptr %_7.val10, i64 8
  %self2.val.i.i5.i = load i64, ptr %21, align 8, !noundef !5
  %val6.i.i6.i = add i64 %self2.val.i.i5.i, -1
  store i64 %val6.i.i6.i, ptr %21, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i", %bb1.i.i4.i
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_7)
  br i1 %_4, label %bb2, label %bb25

bb2:                                              ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit"
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_11)
  call void @llvm.experimental.noalias.scope.decl(metadata !62)
  %self.val.i.i13 = load i64, ptr %_12.i, align 8, !noalias !65, !noundef !5
  %cond.i.i14 = icmp ne i64 %self.val.i.i13, 0
  call void @llvm.assume(i1 %cond.i.i14)
  %strong1.i.i15 = add i64 %self.val.i.i13, 1
  store i64 %strong1.i.i15, ptr %_12.i, align 8, !noalias !65
  %_7.i.i16 = icmp eq i64 %strong1.i.i15, 0
  br i1 %_7.i.i16, label %bb4.i.i26, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i17

bb4.i.i26:                                        ; preds = %bb2
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i17: ; preds = %bb2
  %self.val.i1.i19 = load i64, ptr %_16.i, align 8, !noalias !65, !noundef !5
  %cond.i2.i20 = icmp ne i64 %self.val.i1.i19, 0
  call void @llvm.assume(i1 %cond.i2.i20)
  %strong1.i3.i21 = add i64 %self.val.i1.i19, 1
  store i64 %strong1.i3.i21, ptr %_16.i, align 8, !noalias !65
  %_7.i4.i22 = icmp eq i64 %strong1.i3.i21, 0
  br i1 %_7.i4.i22, label %bb4.i5.i25, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit27"

bb4.i5.i25:                                       ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i17
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit27": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i17
  store ptr %_2.i, ptr %_11, align 8, !alias.scope !62, !noalias !67
  %22 = getelementptr inbounds i8, ptr %_11, i64 8
  store ptr %_12.i, ptr %22, align 8, !alias.scope !62, !noalias !67
  %23 = getelementptr inbounds i8, ptr %_11, i64 16
  store ptr %_16.i, ptr %23, align 8, !alias.scope !62, !noalias !67
  %24 = getelementptr inbounds i8, ptr %_11, i64 24
  store ptr %_5.i, ptr %24, align 8, !alias.scope !62, !noalias !67
  %25 = getelementptr inbounds i8, ptr %_11, i64 32
  store i64 %_6.i, ptr %25, align 8, !alias.scope !62, !noalias !67
  %26 = getelementptr inbounds i8, ptr %_11, i64 40
  store i8 %5, ptr %26, align 8, !alias.scope !62, !noalias !67
  %27 = getelementptr inbounds i8, ptr %_11, i64 41
  store i8 %7, ptr %27, align 1, !alias.scope !62, !noalias !67
  %28 = getelementptr inbounds i8, ptr %_11, i64 42
  store i8 %9, ptr %28, align 2, !alias.scope !62, !noalias !67
; call solana_account_info::AccountInfo::data_len
  %_9 = call noundef i64 @_ZN19solana_account_info11AccountInfo8data_len17hab41f5a7fca37a40E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_11) #11
  %_8 = icmp ult i64 %_9, 287
  %_11.val = load ptr, ptr %22, align 8, !nonnull !5, !noundef !5
  %_11.val9 = load ptr, ptr %23, align 8
  %self1.val.i.i.i28 = load i64, ptr %_11.val, align 8, !noundef !5
  %val.i.i.i29 = add i64 %self1.val.i.i.i28, -1
  store i64 %val.i.i.i29, ptr %_11.val, align 8
  %29 = icmp eq i64 %val.i.i.i29, 0
  br i1 %29, label %bb1.i.i.i36, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i30"

bb1.i.i.i36:                                      ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit27"
  %30 = getelementptr i8, ptr %_11.val, i64 8
  %self2.val.i.i.i37 = load i64, ptr %30, align 8, !noundef !5
  %val6.i.i.i38 = add i64 %self2.val.i.i.i37, -1
  store i64 %val6.i.i.i38, ptr %30, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i30"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i30": ; preds = %bb1.i.i.i36, %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit27"
  %31 = icmp ne ptr %_11.val9, null
  call void @llvm.assume(i1 %31)
  %self1.val.i.i2.i31 = load i64, ptr %_11.val9, align 8, !noundef !5
  %val.i.i3.i32 = add i64 %self1.val.i.i2.i31, -1
  store i64 %val.i.i3.i32, ptr %_11.val9, align 8
  %32 = icmp eq i64 %val.i.i3.i32, 0
  br i1 %32, label %bb1.i.i4.i33, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit39"

bb1.i.i4.i33:                                     ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i30"
  %33 = getelementptr i8, ptr %_11.val9, i64 8
  %self2.val.i.i5.i34 = load i64, ptr %33, align 8, !noundef !5
  %val6.i.i6.i35 = add i64 %self2.val.i.i5.i34, -1
  store i64 %val6.i.i6.i35, ptr %33, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit39"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit39": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i30", %bb1.i.i4.i33
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_11)
  br i1 %_8, label %bb5, label %bb25

bb5:                                              ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit39"
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_15)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_17)
; call solana_sysvar::rent::<impl solana_sysvar::Sysvar for solana_rent::Rent>::get
  call void @"_ZN13solana_sysvar4rent69_$LT$impl$u20$solana_sysvar..Sysvar$u20$for$u20$solana_rent..Rent$GT$3get17h451d81047c683abdE"(ptr noalias nocapture noundef nonnull sret([32 x i8]) align 8 dereferenceable(32) %_17) #11
  %_37 = load i64, ptr %_17, align 8, !range !24, !noundef !5
  %trunc.not = icmp eq i64 %_37, 0
  %34 = getelementptr inbounds i8, ptr %_17, i64 8
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_16.sroa.5, ptr noundef nonnull align 8 dereferenceable(24) %34, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_17)
  br i1 %trunc.not, label %bb29, label %bb28

bb29:                                             ; preds = %bb5
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_15, ptr noundef nonnull align 8 dereferenceable(24) %_16.sroa.5, i64 24, i1 false)
; call solana_rent::Rent::minimum_balance
  %_13 = call noundef i64 @_ZN11solana_rent4Rent15minimum_balance17had8abba6b93c5f14E(ptr noalias noundef nonnull readonly align 8 dereferenceable(24) %_15, i64 noundef 287) #11
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_22)
  call void @llvm.experimental.noalias.scope.decl(metadata !68)
  %self.val.i.i42 = load i64, ptr %_12.i, align 8, !noalias !71, !noundef !5
  %cond.i.i43 = icmp ne i64 %self.val.i.i42, 0
  call void @llvm.assume(i1 %cond.i.i43)
  %strong1.i.i44 = add i64 %self.val.i.i42, 1
  store i64 %strong1.i.i44, ptr %_12.i, align 8, !noalias !71
  %_7.i.i45 = icmp eq i64 %strong1.i.i44, 0
  br i1 %_7.i.i45, label %bb4.i.i55, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i46

bb4.i.i55:                                        ; preds = %bb29
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i46: ; preds = %bb29
  %self.val.i1.i48 = load i64, ptr %_16.i, align 8, !noalias !71, !noundef !5
  %cond.i2.i49 = icmp ne i64 %self.val.i1.i48, 0
  call void @llvm.assume(i1 %cond.i2.i49)
  %strong1.i3.i50 = add i64 %self.val.i1.i48, 1
  store i64 %strong1.i3.i50, ptr %_16.i, align 8, !noalias !71
  %_7.i4.i51 = icmp eq i64 %strong1.i3.i50, 0
  br i1 %_7.i4.i51, label %bb4.i5.i54, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit56"

bb4.i5.i54:                                       ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i46
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit56": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i46
  store ptr %_2.i, ptr %_22, align 8, !alias.scope !68, !noalias !73
  %35 = getelementptr inbounds i8, ptr %_22, i64 8
  store ptr %_12.i, ptr %35, align 8, !alias.scope !68, !noalias !73
  %36 = getelementptr inbounds i8, ptr %_22, i64 16
  store ptr %_16.i, ptr %36, align 8, !alias.scope !68, !noalias !73
  %37 = getelementptr inbounds i8, ptr %_22, i64 24
  store ptr %_5.i, ptr %37, align 8, !alias.scope !68, !noalias !73
  %38 = getelementptr inbounds i8, ptr %_22, i64 32
  store i64 %_6.i, ptr %38, align 8, !alias.scope !68, !noalias !73
  %39 = getelementptr inbounds i8, ptr %_22, i64 40
  store i8 %5, ptr %39, align 8, !alias.scope !68, !noalias !73
  %40 = getelementptr inbounds i8, ptr %_22, i64 41
  store i8 %7, ptr %40, align 1, !alias.scope !68, !noalias !73
  %41 = getelementptr inbounds i8, ptr %_22, i64 42
  store i8 %9, ptr %41, align 2, !alias.scope !68, !noalias !73
; call solana_account_info::AccountInfo::lamports
  %_20 = call noundef i64 @_ZN19solana_account_info11AccountInfo8lamports17h3208c65b27977111E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_22) #11
  %_22.val = load ptr, ptr %35, align 8, !nonnull !5, !noundef !5
  %_22.val8 = load ptr, ptr %36, align 8
  %self1.val.i.i.i57 = load i64, ptr %_22.val, align 8, !noundef !5
  %val.i.i.i58 = add i64 %self1.val.i.i.i57, -1
  store i64 %val.i.i.i58, ptr %_22.val, align 8
  %42 = icmp eq i64 %val.i.i.i58, 0
  br i1 %42, label %bb1.i.i.i65, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i59"

bb1.i.i.i65:                                      ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit56"
  %43 = getelementptr i8, ptr %_22.val, i64 8
  %self2.val.i.i.i66 = load i64, ptr %43, align 8, !noundef !5
  %val6.i.i.i67 = add i64 %self2.val.i.i.i66, -1
  store i64 %val6.i.i.i67, ptr %43, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i59"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i59": ; preds = %bb1.i.i.i65, %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit56"
  %44 = icmp ne ptr %_22.val8, null
  call void @llvm.assume(i1 %44)
  %self1.val.i.i2.i60 = load i64, ptr %_22.val8, align 8, !noundef !5
  %val.i.i3.i61 = add i64 %self1.val.i.i2.i60, -1
  store i64 %val.i.i3.i61, ptr %_22.val8, align 8
  %45 = icmp eq i64 %val.i.i3.i61, 0
  br i1 %45, label %bb1.i.i4.i62, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit68"

bb1.i.i4.i62:                                     ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i59"
  %46 = getelementptr i8, ptr %_22.val8, i64 8
  %self2.val.i.i5.i63 = load i64, ptr %46, align 8, !noundef !5
  %val6.i.i6.i64 = add i64 %self2.val.i.i5.i63, -1
  store i64 %val6.i.i6.i64, ptr %46, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit68"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit68": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i59", %bb1.i.i4.i62
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_22)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_15)
  %_23.not.not = icmp ugt i64 %_13, %_20
  br i1 %_23.not.not, label %bb12, label %bb14

bb28:                                             ; preds = %bb5
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %47 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17heba0ebbdde914d9aE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_16.sroa.5) #11
  %_42.0 = extractvalue { i64, ptr } %47, 0
  %_42.1 = extractvalue { i64, ptr } %47, 1
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_15)
  br label %bb25

bb14:                                             ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit136", %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit68"
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_33)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_35)
  call void @llvm.experimental.noalias.scope.decl(metadata !74)
  %self.val.i.i71 = load i64, ptr %_12.i, align 8, !noalias !77, !noundef !5
  %cond.i.i72 = icmp ne i64 %self.val.i.i71, 0
  call void @llvm.assume(i1 %cond.i.i72)
  %strong1.i.i73 = add i64 %self.val.i.i71, 1
  store i64 %strong1.i.i73, ptr %_12.i, align 8, !noalias !77
  %_7.i.i74 = icmp eq i64 %strong1.i.i73, 0
  br i1 %_7.i.i74, label %bb4.i.i84, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i75

bb4.i.i84:                                        ; preds = %bb14
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i75: ; preds = %bb14
  %self.val.i1.i77 = load i64, ptr %_16.i, align 8, !noalias !77, !noundef !5
  %cond.i2.i78 = icmp ne i64 %self.val.i1.i77, 0
  call void @llvm.assume(i1 %cond.i2.i78)
  %strong1.i3.i79 = add i64 %self.val.i1.i77, 1
  store i64 %strong1.i3.i79, ptr %_16.i, align 8, !noalias !77
  %_7.i4.i80 = icmp eq i64 %strong1.i3.i79, 0
  br i1 %_7.i4.i80, label %bb4.i5.i83, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit85"

bb4.i5.i83:                                       ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i75
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit85": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i75
  store ptr %_2.i, ptr %_35, align 8, !alias.scope !74, !noalias !79
  %48 = getelementptr inbounds i8, ptr %_35, i64 8
  store ptr %_12.i, ptr %48, align 8, !alias.scope !74, !noalias !79
  %49 = getelementptr inbounds i8, ptr %_35, i64 16
  store ptr %_16.i, ptr %49, align 8, !alias.scope !74, !noalias !79
  %50 = getelementptr inbounds i8, ptr %_35, i64 24
  store ptr %_5.i, ptr %50, align 8, !alias.scope !74, !noalias !79
  %51 = getelementptr inbounds i8, ptr %_35, i64 32
  store i64 %_6.i, ptr %51, align 8, !alias.scope !74, !noalias !79
  %52 = getelementptr inbounds i8, ptr %_35, i64 40
  store i8 %5, ptr %52, align 8, !alias.scope !74, !noalias !79
  %53 = getelementptr inbounds i8, ptr %_35, i64 41
  store i8 %7, ptr %53, align 1, !alias.scope !74, !noalias !79
  %54 = getelementptr inbounds i8, ptr %_35, i64 42
  store i8 %9, ptr %54, align 2, !alias.scope !74, !noalias !79
; call solana_account_info::AccountInfo::realloc
  call void @_ZN19solana_account_info11AccountInfo7realloc17ha4197952dec82defE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_33, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_35, i64 noundef 287, i1 noundef zeroext false) #11
  %55 = load i64, ptr %_33, align 8, !range !37, !noundef !5
  %56 = icmp eq i64 %55, -9223372036854775782
  br i1 %56, label %bb40, label %bb39

bb12:                                             ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit68"
  %57 = call i64 @llvm.usub.sat.i64(i64 %_13, i64 %_20)
  call void @llvm.lifetime.start.p0(i64 184, ptr nonnull %_26)
  call void @llvm.experimental.noalias.scope.decl(metadata !80)
  %_2.i86 = load ptr, ptr %system_program, align 8, !alias.scope !80, !noalias !83, !nonnull !5, !align !6, !noundef !5
  %58 = getelementptr inbounds i8, ptr %system_program, i64 8
  %_12.i87 = load ptr, ptr %58, align 8, !alias.scope !80, !noalias !83, !nonnull !5, !noundef !5
  %self.val.i.i88 = load i64, ptr %_12.i87, align 8, !noalias !85, !noundef !5
  %cond.i.i89 = icmp ne i64 %self.val.i.i88, 0
  call void @llvm.assume(i1 %cond.i.i89)
  %strong1.i.i90 = add i64 %self.val.i.i88, 1
  store i64 %strong1.i.i90, ptr %_12.i87, align 8, !noalias !85
  %_7.i.i91 = icmp eq i64 %strong1.i.i90, 0
  br i1 %_7.i.i91, label %bb4.i.i101, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i92

bb4.i.i101:                                       ; preds = %bb12
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i92: ; preds = %bb12
  %59 = getelementptr inbounds i8, ptr %system_program, i64 16
  %_16.i93 = load ptr, ptr %59, align 8, !alias.scope !80, !noalias !83, !nonnull !5, !noundef !5
  %self.val.i1.i94 = load i64, ptr %_16.i93, align 8, !noalias !85, !noundef !5
  %cond.i2.i95 = icmp ne i64 %self.val.i1.i94, 0
  call void @llvm.assume(i1 %cond.i2.i95)
  %strong1.i3.i96 = add i64 %self.val.i1.i94, 1
  store i64 %strong1.i3.i96, ptr %_16.i93, align 8, !noalias !85
  %_7.i4.i97 = icmp eq i64 %strong1.i3.i96, 0
  br i1 %_7.i4.i97, label %bb4.i5.i100, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit102"

bb4.i5.i100:                                      ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i92
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit102": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i92
  %60 = getelementptr inbounds i8, ptr %system_program, i64 24
  %_5.i98 = load ptr, ptr %60, align 8, !alias.scope !80, !noalias !83, !nonnull !5, !align !6, !noundef !5
  %61 = getelementptr inbounds i8, ptr %system_program, i64 32
  %_6.i99 = load i64, ptr %61, align 8, !alias.scope !80, !noalias !83, !noundef !5
  %62 = getelementptr inbounds i8, ptr %system_program, i64 40
  %63 = load i8, ptr %62, align 8, !range !9, !alias.scope !80, !noalias !83, !noundef !5
  %64 = getelementptr inbounds i8, ptr %system_program, i64 41
  %65 = load i8, ptr %64, align 1, !range !9, !alias.scope !80, !noalias !83, !noundef !5
  %66 = getelementptr inbounds i8, ptr %system_program, i64 42
  %67 = load i8, ptr %66, align 2, !range !9, !alias.scope !80, !noalias !83, !noundef !5
  call void @llvm.experimental.noalias.scope.decl(metadata !86)
  %_2.i103 = load ptr, ptr %payer, align 8, !alias.scope !86, !noalias !89, !nonnull !5, !align !6, !noundef !5
  %68 = getelementptr inbounds i8, ptr %payer, i64 8
  %_12.i104 = load ptr, ptr %68, align 8, !alias.scope !86, !noalias !89, !nonnull !5, !noundef !5
  %self.val.i.i105 = load i64, ptr %_12.i104, align 8, !noalias !91, !noundef !5
  %cond.i.i106 = icmp ne i64 %self.val.i.i105, 0
  call void @llvm.assume(i1 %cond.i.i106)
  %strong1.i.i107 = add i64 %self.val.i.i105, 1
  store i64 %strong1.i.i107, ptr %_12.i104, align 8, !noalias !91
  %_7.i.i108 = icmp eq i64 %strong1.i.i107, 0
  br i1 %_7.i.i108, label %bb4.i.i118, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i109

bb4.i.i118:                                       ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit102"
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i109: ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit102"
  %69 = getelementptr inbounds i8, ptr %payer, i64 16
  %_16.i110 = load ptr, ptr %69, align 8, !alias.scope !86, !noalias !89, !nonnull !5, !noundef !5
  %self.val.i1.i111 = load i64, ptr %_16.i110, align 8, !noalias !91, !noundef !5
  %cond.i2.i112 = icmp ne i64 %self.val.i1.i111, 0
  call void @llvm.assume(i1 %cond.i2.i112)
  %strong1.i3.i113 = add i64 %self.val.i1.i111, 1
  store i64 %strong1.i3.i113, ptr %_16.i110, align 8, !noalias !91
  %_7.i4.i114 = icmp eq i64 %strong1.i3.i113, 0
  br i1 %_7.i4.i114, label %bb4.i5.i117, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit119"

bb4.i5.i117:                                      ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i109
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit119": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i109
  %70 = getelementptr inbounds i8, ptr %payer, i64 24
  %_5.i115 = load ptr, ptr %70, align 8, !alias.scope !86, !noalias !89, !nonnull !5, !align !6, !noundef !5
  %71 = getelementptr inbounds i8, ptr %payer, i64 32
  %_6.i116 = load i64, ptr %71, align 8, !alias.scope !86, !noalias !89, !noundef !5
  %72 = getelementptr inbounds i8, ptr %payer, i64 40
  %73 = load i8, ptr %72, align 8, !range !9, !alias.scope !86, !noalias !89, !noundef !5
  %74 = getelementptr inbounds i8, ptr %payer, i64 41
  %75 = load i8, ptr %74, align 1, !range !9, !alias.scope !86, !noalias !89, !noundef !5
  %76 = getelementptr inbounds i8, ptr %payer, i64 42
  %77 = load i8, ptr %76, align 2, !range !9, !alias.scope !86, !noalias !89, !noundef !5
  %self.val.i.i122 = load i64, ptr %_12.i, align 8, !noalias !92, !noundef !5
  %cond.i.i123 = icmp ne i64 %self.val.i.i122, 0
  call void @llvm.assume(i1 %cond.i.i123)
  %strong1.i.i124 = add i64 %self.val.i.i122, 1
  store i64 %strong1.i.i124, ptr %_12.i, align 8, !noalias !92
  %_7.i.i125 = icmp eq i64 %strong1.i.i124, 0
  br i1 %_7.i.i125, label %bb4.i.i135, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i126

bb4.i.i135:                                       ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit119"
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i126: ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit119"
  %self.val.i1.i128 = load i64, ptr %_16.i, align 8, !noalias !92, !noundef !5
  %cond.i2.i129 = icmp ne i64 %self.val.i1.i128, 0
  call void @llvm.assume(i1 %cond.i2.i129)
  %strong1.i3.i130 = add i64 %self.val.i1.i128, 1
  store i64 %strong1.i3.i130, ptr %_16.i, align 8, !noalias !92
  %_7.i4.i131 = icmp eq i64 %strong1.i3.i130, 0
  br i1 %_7.i4.i131, label %bb4.i5.i134, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit136"

bb4.i5.i134:                                      ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i126
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit136": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i126
  %78 = getelementptr inbounds i8, ptr %_26, i64 72
  store ptr %_2.i103, ptr %78, align 8
  %_28.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 80
  store ptr %_12.i104, ptr %_28.sroa.4.0..sroa_idx, align 8
  %_28.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 88
  store ptr %_16.i110, ptr %_28.sroa.5.0..sroa_idx, align 8
  %_28.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 96
  store ptr %_5.i115, ptr %_28.sroa.6.0..sroa_idx, align 8
  %_28.sroa.7.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 104
  store i64 %_6.i116, ptr %_28.sroa.7.0..sroa_idx, align 8
  %_28.sroa.8.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 112
  store i8 %73, ptr %_28.sroa.8.0..sroa_idx, align 8
  %_28.sroa.9.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 113
  store i8 %75, ptr %_28.sroa.9.0..sroa_idx, align 1
  %_28.sroa.10.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 114
  store i8 %77, ptr %_28.sroa.10.0..sroa_idx, align 2
  %_28.sroa.12.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 120
  store ptr %_2.i, ptr %_28.sroa.12.0..sroa_idx, align 8
  %_28.sroa.12.sroa.4.0._28.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 128
  store ptr %_12.i, ptr %_28.sroa.12.sroa.4.0._28.sroa.12.0..sroa_idx.sroa_idx, align 8
  %_28.sroa.12.sroa.5.0._28.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 136
  store ptr %_16.i, ptr %_28.sroa.12.sroa.5.0._28.sroa.12.0..sroa_idx.sroa_idx, align 8
  %_28.sroa.12.sroa.6.0._28.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 144
  store ptr %_5.i, ptr %_28.sroa.12.sroa.6.0._28.sroa.12.0..sroa_idx.sroa_idx, align 8
  %_28.sroa.12.sroa.7.0._28.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 152
  store i64 %_6.i, ptr %_28.sroa.12.sroa.7.0._28.sroa.12.0..sroa_idx.sroa_idx, align 8
  %_28.sroa.12.sroa.8.0._28.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 160
  store i8 %5, ptr %_28.sroa.12.sroa.8.0._28.sroa.12.0..sroa_idx.sroa_idx, align 8
  %_28.sroa.12.sroa.9.0._28.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 161
  store i8 %7, ptr %_28.sroa.12.sroa.9.0._28.sroa.12.0..sroa_idx.sroa_idx, align 1
  %_28.sroa.12.sroa.10.0._28.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 162
  store i8 %9, ptr %_28.sroa.12.sroa.10.0._28.sroa.12.0..sroa_idx.sroa_idx, align 2
  store i64 0, ptr %_26, align 8
  %_43.sroa.4.0._26.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 8
  store ptr inttoptr (i64 8 to ptr), ptr %_43.sroa.4.0._26.sroa_idx, align 8
  %_43.sroa.5.0._26.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 16
  store i64 0, ptr %_43.sroa.5.0._26.sroa_idx, align 8
  %79 = getelementptr inbounds i8, ptr %_26, i64 24
  store ptr %_2.i86, ptr %79, align 8
  %_27.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 32
  store ptr %_12.i87, ptr %_27.sroa.4.0..sroa_idx, align 8
  %_27.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 40
  store ptr %_16.i93, ptr %_27.sroa.5.0..sroa_idx, align 8
  %_27.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 48
  store ptr %_5.i98, ptr %_27.sroa.6.0..sroa_idx, align 8
  %_27.sroa.7.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 56
  store i64 %_6.i99, ptr %_27.sroa.7.0..sroa_idx, align 8
  %_27.sroa.8.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 64
  store i8 %63, ptr %_27.sroa.8.0..sroa_idx, align 8
  %_27.sroa.9.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 65
  store i8 %65, ptr %_27.sroa.9.0..sroa_idx, align 1
  %_27.sroa.10.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 66
  store i8 %67, ptr %_27.sroa.10.0..sroa_idx, align 2
  %80 = getelementptr inbounds i8, ptr %_26, i64 168
  store ptr inttoptr (i64 8 to ptr), ptr %80, align 8
  %81 = getelementptr inbounds i8, ptr %_26, i64 176
  store i64 0, ptr %81, align 8
; call anchor_lang::system_program::transfer
  %82 = call { i64, ptr } @_ZN11anchor_lang14system_program8transfer17h1c9302c6a5a1797fE(ptr noalias nocapture noundef nonnull align 8 dereferenceable(184) %_26, i64 noundef %57) #11
  %83 = extractvalue { i64, ptr } %82, 0
  call void @llvm.lifetime.end.p0(i64 184, ptr nonnull %_26)
  %84 = icmp eq i64 %83, 2
  br i1 %84, label %bb14, label %bb36

bb36:                                             ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit136"
  %85 = extractvalue { i64, ptr } %82, 1
  br label %bb25

bb40:                                             ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit85"
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_33)
  %self1.val.i.i.i137 = load i64, ptr %_12.i, align 8, !noundef !5
  %val.i.i.i138 = add i64 %self1.val.i.i.i137, -1
  store i64 %val.i.i.i138, ptr %_12.i, align 8
  %86 = icmp eq i64 %val.i.i.i138, 0
  br i1 %86, label %bb1.i.i.i145, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i139"

bb1.i.i.i145:                                     ; preds = %bb40
  %87 = getelementptr i8, ptr %_12.i, i64 8
  %self2.val.i.i.i146 = load i64, ptr %87, align 8, !noundef !5
  %val6.i.i.i147 = add i64 %self2.val.i.i.i146, -1
  store i64 %val6.i.i.i147, ptr %87, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i139"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i139": ; preds = %bb1.i.i.i145, %bb40
  %self1.val.i.i2.i140 = load i64, ptr %_16.i, align 8, !noundef !5
  %val.i.i3.i141 = add i64 %self1.val.i.i2.i140, -1
  store i64 %val.i.i3.i141, ptr %_16.i, align 8
  %88 = icmp eq i64 %val.i.i3.i141, 0
  br i1 %88, label %bb1.i.i4.i142, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit148"

bb1.i.i4.i142:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i139"
  %89 = getelementptr i8, ptr %_16.i, i64 8
  %self2.val.i.i5.i143 = load i64, ptr %89, align 8, !noundef !5
  %val6.i.i6.i144 = add i64 %self2.val.i.i5.i143, -1
  store i64 %val6.i.i6.i144, ptr %89, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit148"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit148": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i139", %bb1.i.i4.i142
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_35)
  br label %bb25

bb39:                                             ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit85"
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_52)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_52, ptr noundef nonnull align 8 dereferenceable(24) %_33, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_33)
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %90 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17heba0ebbdde914d9aE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_52) #11
  %_53.0 = extractvalue { i64, ptr } %90, 0
  %_53.1 = extractvalue { i64, ptr } %90, 1
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_52)
  %_35.val = load ptr, ptr %48, align 8, !nonnull !5, !noundef !5
  %_35.val5 = load ptr, ptr %49, align 8
  %self1.val.i.i.i149 = load i64, ptr %_35.val, align 8, !noundef !5
  %val.i.i.i150 = add i64 %self1.val.i.i.i149, -1
  store i64 %val.i.i.i150, ptr %_35.val, align 8
  %91 = icmp eq i64 %val.i.i.i150, 0
  br i1 %91, label %bb1.i.i.i157, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i151"

bb1.i.i.i157:                                     ; preds = %bb39
  %92 = getelementptr i8, ptr %_35.val, i64 8
  %self2.val.i.i.i158 = load i64, ptr %92, align 8, !noundef !5
  %val6.i.i.i159 = add i64 %self2.val.i.i.i158, -1
  store i64 %val6.i.i.i159, ptr %92, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i151"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i151": ; preds = %bb1.i.i.i157, %bb39
  %93 = icmp ne ptr %_35.val5, null
  call void @llvm.assume(i1 %93)
  %self1.val.i.i2.i152 = load i64, ptr %_35.val5, align 8, !noundef !5
  %val.i.i3.i153 = add i64 %self1.val.i.i2.i152, -1
  store i64 %val.i.i3.i153, ptr %_35.val5, align 8
  %94 = icmp eq i64 %val.i.i3.i153, 0
  br i1 %94, label %bb1.i.i4.i154, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit160"

bb1.i.i4.i154:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i151"
  %95 = getelementptr i8, ptr %_35.val5, i64 8
  %self2.val.i.i5.i155 = load i64, ptr %95, align 8, !noundef !5
  %val6.i.i6.i156 = add i64 %self2.val.i.i5.i155, -1
  store i64 %val6.i.i6.i156, ptr %95, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit160"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit160": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i151", %bb1.i.i4.i154
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_35)
  br label %bb25

bb25:                                             ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit39", %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit148", %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit", %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit160", %bb36, %bb28
  %_0.sroa.5.0 = phi ptr [ %_42.1, %bb28 ], [ %_53.1, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit160" ], [ %85, %bb36 ], [ undef, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit" ], [ undef, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit148" ], [ undef, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit39" ]
  %_0.sroa.0.0 = phi i64 [ %_42.0, %bb28 ], [ %_53.0, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit160" ], [ %83, %bb36 ], [ 2, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit" ], [ 2, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit148" ], [ 2, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit39" ]
  %96 = insertvalue { i64, ptr } poison, i64 %_0.sroa.0.0, 0
  %97 = insertvalue { i64, ptr } %96, ptr %_0.sroa.5.0, 1
  ret { i64, ptr } %97
}

; variants::length_bindings
; Function Attrs: nounwind
define hidden { i64, ptr } @_ZN8variants15length_bindings17h4e58ce528c306274E(ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %pool, ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %system_program, ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %payer) unnamed_addr #0 {
start:
  %_52 = alloca [24 x i8], align 8
  %_35 = alloca [48 x i8], align 8
  %_33 = alloca [24 x i8], align 8
  %_26 = alloca [184 x i8], align 8
  %_22 = alloca [48 x i8], align 8
  %_17 = alloca [32 x i8], align 8
  %_16.sroa.5 = alloca [24 x i8], align 8
  %_15 = alloca [24 x i8], align 8
  %_10 = alloca [48 x i8], align 8
  %_6 = alloca [48 x i8], align 8
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_6)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !96)
  %_2.i = load ptr, ptr %pool, align 8, !noalias !5, !nonnull !5, !align !6, !noundef !5
  %0 = getelementptr inbounds i8, ptr %pool, i64 8
  %_12.i = load ptr, ptr %0, align 8, !noalias !5, !nonnull !5, !noundef !5
  %self.val.i.i = load i64, ptr %_12.i, align 8, !noalias !99, !noundef !5
  %cond.i.i = icmp ne i64 %self.val.i.i, 0
  tail call void @llvm.assume(i1 %cond.i.i)
  %strong1.i.i = add i64 %self.val.i.i, 1
  store i64 %strong1.i.i, ptr %_12.i, align 8, !noalias !99
  %_7.i.i = icmp eq i64 %strong1.i.i, 0
  br i1 %_7.i.i, label %bb4.i.i, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i

bb4.i.i:                                          ; preds = %start
  tail call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i: ; preds = %start
  %1 = getelementptr inbounds i8, ptr %pool, i64 16
  %_16.i = load ptr, ptr %1, align 8, !noalias !5, !nonnull !5, !noundef !5
  %self.val.i1.i = load i64, ptr %_16.i, align 8, !noalias !99, !noundef !5
  %cond.i2.i = icmp ne i64 %self.val.i1.i, 0
  tail call void @llvm.assume(i1 %cond.i2.i)
  %strong1.i3.i = add i64 %self.val.i1.i, 1
  store i64 %strong1.i3.i, ptr %_16.i, align 8, !noalias !99
  %_7.i4.i = icmp eq i64 %strong1.i3.i, 0
  br i1 %_7.i4.i, label %bb4.i5.i, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit"

bb4.i5.i:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i
  tail call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i
  %2 = getelementptr inbounds i8, ptr %pool, i64 24
  %_5.i = load ptr, ptr %2, align 8, !noalias !5, !nonnull !5, !align !6, !noundef !5
  %3 = getelementptr inbounds i8, ptr %pool, i64 32
  %_6.i = load i64, ptr %3, align 8, !noalias !5, !noundef !5
  %4 = getelementptr inbounds i8, ptr %pool, i64 40
  %5 = load i8, ptr %4, align 8, !range !9, !noalias !5, !noundef !5
  %6 = getelementptr inbounds i8, ptr %pool, i64 41
  %7 = load i8, ptr %6, align 1, !range !9, !noalias !5, !noundef !5
  %8 = getelementptr inbounds i8, ptr %pool, i64 42
  %9 = load i8, ptr %8, align 2, !range !9, !noalias !5, !noundef !5
  store ptr %_2.i, ptr %_6, align 8, !alias.scope !96, !noalias !101
  %10 = getelementptr inbounds i8, ptr %_6, i64 8
  store ptr %_12.i, ptr %10, align 8, !alias.scope !96, !noalias !101
  %11 = getelementptr inbounds i8, ptr %_6, i64 16
  store ptr %_16.i, ptr %11, align 8, !alias.scope !96, !noalias !101
  %12 = getelementptr inbounds i8, ptr %_6, i64 24
  store ptr %_5.i, ptr %12, align 8, !alias.scope !96, !noalias !101
  %13 = getelementptr inbounds i8, ptr %_6, i64 32
  store i64 %_6.i, ptr %13, align 8, !alias.scope !96, !noalias !101
  %14 = getelementptr inbounds i8, ptr %_6, i64 40
  store i8 %5, ptr %14, align 8, !alias.scope !96, !noalias !101
  %15 = getelementptr inbounds i8, ptr %_6, i64 41
  store i8 %7, ptr %15, align 1, !alias.scope !96, !noalias !101
  %16 = getelementptr inbounds i8, ptr %_6, i64 42
  store i8 %9, ptr %16, align 2, !alias.scope !96, !noalias !101
; call solana_account_info::AccountInfo::data_len
  %first_len = call noundef i64 @_ZN19solana_account_info11AccountInfo8data_len17hab41f5a7fca37a40E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_6) #11
  %_6.val = load ptr, ptr %10, align 8, !nonnull !5, !noundef !5
  %_6.val10 = load ptr, ptr %11, align 8
  %self1.val.i.i.i = load i64, ptr %_6.val, align 8, !noundef !5
  %val.i.i.i = add i64 %self1.val.i.i.i, -1
  store i64 %val.i.i.i, ptr %_6.val, align 8
  %17 = icmp eq i64 %val.i.i.i, 0
  br i1 %17, label %bb1.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i"

bb1.i.i.i:                                        ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit"
  %18 = getelementptr i8, ptr %_6.val, i64 8
  %self2.val.i.i.i = load i64, ptr %18, align 8, !noundef !5
  %val6.i.i.i = add i64 %self2.val.i.i.i, -1
  store i64 %val6.i.i.i, ptr %18, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i": ; preds = %bb1.i.i.i, %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit"
  %19 = icmp ne ptr %_6.val10, null
  call void @llvm.assume(i1 %19)
  %self1.val.i.i2.i = load i64, ptr %_6.val10, align 8, !noundef !5
  %val.i.i3.i = add i64 %self1.val.i.i2.i, -1
  store i64 %val.i.i3.i, ptr %_6.val10, align 8
  %20 = icmp eq i64 %val.i.i3.i, 0
  br i1 %20, label %bb1.i.i4.i, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit"

bb1.i.i4.i:                                       ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i"
  %21 = getelementptr i8, ptr %_6.val10, i64 8
  %self2.val.i.i5.i = load i64, ptr %21, align 8, !noundef !5
  %val6.i.i6.i = add i64 %self2.val.i.i5.i, -1
  store i64 %val6.i.i6.i, ptr %21, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i", %bb1.i.i4.i
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_6)
  %_7 = icmp ult i64 %first_len, 287
  br i1 %_7, label %bb3, label %bb21

bb3:                                              ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit"
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_10)
  call void @llvm.experimental.noalias.scope.decl(metadata !102)
  %self.val.i.i13 = load i64, ptr %_12.i, align 8, !noalias !105, !noundef !5
  %cond.i.i14 = icmp ne i64 %self.val.i.i13, 0
  call void @llvm.assume(i1 %cond.i.i14)
  %strong1.i.i15 = add i64 %self.val.i.i13, 1
  store i64 %strong1.i.i15, ptr %_12.i, align 8, !noalias !105
  %_7.i.i16 = icmp eq i64 %strong1.i.i15, 0
  br i1 %_7.i.i16, label %bb4.i.i26, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i17

bb4.i.i26:                                        ; preds = %bb3
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i17: ; preds = %bb3
  %self.val.i1.i19 = load i64, ptr %_16.i, align 8, !noalias !105, !noundef !5
  %cond.i2.i20 = icmp ne i64 %self.val.i1.i19, 0
  call void @llvm.assume(i1 %cond.i2.i20)
  %strong1.i3.i21 = add i64 %self.val.i1.i19, 1
  store i64 %strong1.i3.i21, ptr %_16.i, align 8, !noalias !105
  %_7.i4.i22 = icmp eq i64 %strong1.i3.i21, 0
  br i1 %_7.i4.i22, label %bb4.i5.i25, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit27"

bb4.i5.i25:                                       ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i17
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit27": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i17
  store ptr %_2.i, ptr %_10, align 8, !alias.scope !102, !noalias !107
  %22 = getelementptr inbounds i8, ptr %_10, i64 8
  store ptr %_12.i, ptr %22, align 8, !alias.scope !102, !noalias !107
  %23 = getelementptr inbounds i8, ptr %_10, i64 16
  store ptr %_16.i, ptr %23, align 8, !alias.scope !102, !noalias !107
  %24 = getelementptr inbounds i8, ptr %_10, i64 24
  store ptr %_5.i, ptr %24, align 8, !alias.scope !102, !noalias !107
  %25 = getelementptr inbounds i8, ptr %_10, i64 32
  store i64 %_6.i, ptr %25, align 8, !alias.scope !102, !noalias !107
  %26 = getelementptr inbounds i8, ptr %_10, i64 40
  store i8 %5, ptr %26, align 8, !alias.scope !102, !noalias !107
  %27 = getelementptr inbounds i8, ptr %_10, i64 41
  store i8 %7, ptr %27, align 1, !alias.scope !102, !noalias !107
  %28 = getelementptr inbounds i8, ptr %_10, i64 42
  store i8 %9, ptr %28, align 2, !alias.scope !102, !noalias !107
; call solana_account_info::AccountInfo::data_len
  %second_len = call noundef i64 @_ZN19solana_account_info11AccountInfo8data_len17hab41f5a7fca37a40E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_10) #11
  %_10.val = load ptr, ptr %22, align 8, !nonnull !5, !noundef !5
  %_10.val9 = load ptr, ptr %23, align 8
  %self1.val.i.i.i28 = load i64, ptr %_10.val, align 8, !noundef !5
  %val.i.i.i29 = add i64 %self1.val.i.i.i28, -1
  store i64 %val.i.i.i29, ptr %_10.val, align 8
  %29 = icmp eq i64 %val.i.i.i29, 0
  br i1 %29, label %bb1.i.i.i36, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i30"

bb1.i.i.i36:                                      ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit27"
  %30 = getelementptr i8, ptr %_10.val, i64 8
  %self2.val.i.i.i37 = load i64, ptr %30, align 8, !noundef !5
  %val6.i.i.i38 = add i64 %self2.val.i.i.i37, -1
  store i64 %val6.i.i.i38, ptr %30, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i30"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i30": ; preds = %bb1.i.i.i36, %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit27"
  %31 = icmp ne ptr %_10.val9, null
  call void @llvm.assume(i1 %31)
  %self1.val.i.i2.i31 = load i64, ptr %_10.val9, align 8, !noundef !5
  %val.i.i3.i32 = add i64 %self1.val.i.i2.i31, -1
  store i64 %val.i.i3.i32, ptr %_10.val9, align 8
  %32 = icmp eq i64 %val.i.i3.i32, 0
  br i1 %32, label %bb1.i.i4.i33, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit39"

bb1.i.i4.i33:                                     ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i30"
  %33 = getelementptr i8, ptr %_10.val9, i64 8
  %self2.val.i.i5.i34 = load i64, ptr %33, align 8, !noundef !5
  %val6.i.i6.i35 = add i64 %self2.val.i.i5.i34, -1
  store i64 %val6.i.i6.i35, ptr %33, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit39"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit39": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i30", %bb1.i.i4.i33
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_10)
  %_11 = icmp ult i64 %second_len, 287
  br i1 %_11, label %bb6, label %bb21

bb6:                                              ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit39"
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_15)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_17)
; call solana_sysvar::rent::<impl solana_sysvar::Sysvar for solana_rent::Rent>::get
  call void @"_ZN13solana_sysvar4rent69_$LT$impl$u20$solana_sysvar..Sysvar$u20$for$u20$solana_rent..Rent$GT$3get17h451d81047c683abdE"(ptr noalias nocapture noundef nonnull sret([32 x i8]) align 8 dereferenceable(32) %_17) #11
  %_37 = load i64, ptr %_17, align 8, !range !24, !noundef !5
  %trunc.not = icmp eq i64 %_37, 0
  %34 = getelementptr inbounds i8, ptr %_17, i64 8
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_16.sroa.5, ptr noundef nonnull align 8 dereferenceable(24) %34, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_17)
  br i1 %trunc.not, label %bb25, label %bb24

bb25:                                             ; preds = %bb6
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_15, ptr noundef nonnull align 8 dereferenceable(24) %_16.sroa.5, i64 24, i1 false)
; call solana_rent::Rent::minimum_balance
  %_13 = call noundef i64 @_ZN11solana_rent4Rent15minimum_balance17had8abba6b93c5f14E(ptr noalias noundef nonnull readonly align 8 dereferenceable(24) %_15, i64 noundef 287) #11
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_22)
  call void @llvm.experimental.noalias.scope.decl(metadata !108)
  %self.val.i.i42 = load i64, ptr %_12.i, align 8, !noalias !111, !noundef !5
  %cond.i.i43 = icmp ne i64 %self.val.i.i42, 0
  call void @llvm.assume(i1 %cond.i.i43)
  %strong1.i.i44 = add i64 %self.val.i.i42, 1
  store i64 %strong1.i.i44, ptr %_12.i, align 8, !noalias !111
  %_7.i.i45 = icmp eq i64 %strong1.i.i44, 0
  br i1 %_7.i.i45, label %bb4.i.i55, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i46

bb4.i.i55:                                        ; preds = %bb25
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i46: ; preds = %bb25
  %self.val.i1.i48 = load i64, ptr %_16.i, align 8, !noalias !111, !noundef !5
  %cond.i2.i49 = icmp ne i64 %self.val.i1.i48, 0
  call void @llvm.assume(i1 %cond.i2.i49)
  %strong1.i3.i50 = add i64 %self.val.i1.i48, 1
  store i64 %strong1.i3.i50, ptr %_16.i, align 8, !noalias !111
  %_7.i4.i51 = icmp eq i64 %strong1.i3.i50, 0
  br i1 %_7.i4.i51, label %bb4.i5.i54, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit56"

bb4.i5.i54:                                       ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i46
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit56": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i46
  store ptr %_2.i, ptr %_22, align 8, !alias.scope !108, !noalias !113
  %35 = getelementptr inbounds i8, ptr %_22, i64 8
  store ptr %_12.i, ptr %35, align 8, !alias.scope !108, !noalias !113
  %36 = getelementptr inbounds i8, ptr %_22, i64 16
  store ptr %_16.i, ptr %36, align 8, !alias.scope !108, !noalias !113
  %37 = getelementptr inbounds i8, ptr %_22, i64 24
  store ptr %_5.i, ptr %37, align 8, !alias.scope !108, !noalias !113
  %38 = getelementptr inbounds i8, ptr %_22, i64 32
  store i64 %_6.i, ptr %38, align 8, !alias.scope !108, !noalias !113
  %39 = getelementptr inbounds i8, ptr %_22, i64 40
  store i8 %5, ptr %39, align 8, !alias.scope !108, !noalias !113
  %40 = getelementptr inbounds i8, ptr %_22, i64 41
  store i8 %7, ptr %40, align 1, !alias.scope !108, !noalias !113
  %41 = getelementptr inbounds i8, ptr %_22, i64 42
  store i8 %9, ptr %41, align 2, !alias.scope !108, !noalias !113
; call solana_account_info::AccountInfo::lamports
  %_20 = call noundef i64 @_ZN19solana_account_info11AccountInfo8lamports17h3208c65b27977111E(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_22) #11
  %_22.val = load ptr, ptr %35, align 8, !nonnull !5, !noundef !5
  %_22.val8 = load ptr, ptr %36, align 8
  %self1.val.i.i.i57 = load i64, ptr %_22.val, align 8, !noundef !5
  %val.i.i.i58 = add i64 %self1.val.i.i.i57, -1
  store i64 %val.i.i.i58, ptr %_22.val, align 8
  %42 = icmp eq i64 %val.i.i.i58, 0
  br i1 %42, label %bb1.i.i.i65, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i59"

bb1.i.i.i65:                                      ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit56"
  %43 = getelementptr i8, ptr %_22.val, i64 8
  %self2.val.i.i.i66 = load i64, ptr %43, align 8, !noundef !5
  %val6.i.i.i67 = add i64 %self2.val.i.i.i66, -1
  store i64 %val6.i.i.i67, ptr %43, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i59"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i59": ; preds = %bb1.i.i.i65, %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit56"
  %44 = icmp ne ptr %_22.val8, null
  call void @llvm.assume(i1 %44)
  %self1.val.i.i2.i60 = load i64, ptr %_22.val8, align 8, !noundef !5
  %val.i.i3.i61 = add i64 %self1.val.i.i2.i60, -1
  store i64 %val.i.i3.i61, ptr %_22.val8, align 8
  %45 = icmp eq i64 %val.i.i3.i61, 0
  br i1 %45, label %bb1.i.i4.i62, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit68"

bb1.i.i4.i62:                                     ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i59"
  %46 = getelementptr i8, ptr %_22.val8, i64 8
  %self2.val.i.i5.i63 = load i64, ptr %46, align 8, !noundef !5
  %val6.i.i6.i64 = add i64 %self2.val.i.i5.i63, -1
  store i64 %val6.i.i6.i64, ptr %46, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit68"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit68": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i59", %bb1.i.i4.i62
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_22)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_15)
  %_23.not.not = icmp ugt i64 %_13, %_20
  br i1 %_23.not.not, label %bb12, label %bb14

bb24:                                             ; preds = %bb6
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %47 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17heba0ebbdde914d9aE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_16.sroa.5) #11
  %_42.0 = extractvalue { i64, ptr } %47, 0
  %_42.1 = extractvalue { i64, ptr } %47, 1
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_15)
  br label %bb21

bb14:                                             ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit136", %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit68"
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_33)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_35)
  call void @llvm.experimental.noalias.scope.decl(metadata !114)
  %self.val.i.i71 = load i64, ptr %_12.i, align 8, !noalias !117, !noundef !5
  %cond.i.i72 = icmp ne i64 %self.val.i.i71, 0
  call void @llvm.assume(i1 %cond.i.i72)
  %strong1.i.i73 = add i64 %self.val.i.i71, 1
  store i64 %strong1.i.i73, ptr %_12.i, align 8, !noalias !117
  %_7.i.i74 = icmp eq i64 %strong1.i.i73, 0
  br i1 %_7.i.i74, label %bb4.i.i84, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i75

bb4.i.i84:                                        ; preds = %bb14
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i75: ; preds = %bb14
  %self.val.i1.i77 = load i64, ptr %_16.i, align 8, !noalias !117, !noundef !5
  %cond.i2.i78 = icmp ne i64 %self.val.i1.i77, 0
  call void @llvm.assume(i1 %cond.i2.i78)
  %strong1.i3.i79 = add i64 %self.val.i1.i77, 1
  store i64 %strong1.i3.i79, ptr %_16.i, align 8, !noalias !117
  %_7.i4.i80 = icmp eq i64 %strong1.i3.i79, 0
  br i1 %_7.i4.i80, label %bb4.i5.i83, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit85"

bb4.i5.i83:                                       ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i75
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit85": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i75
  store ptr %_2.i, ptr %_35, align 8, !alias.scope !114, !noalias !119
  %48 = getelementptr inbounds i8, ptr %_35, i64 8
  store ptr %_12.i, ptr %48, align 8, !alias.scope !114, !noalias !119
  %49 = getelementptr inbounds i8, ptr %_35, i64 16
  store ptr %_16.i, ptr %49, align 8, !alias.scope !114, !noalias !119
  %50 = getelementptr inbounds i8, ptr %_35, i64 24
  store ptr %_5.i, ptr %50, align 8, !alias.scope !114, !noalias !119
  %51 = getelementptr inbounds i8, ptr %_35, i64 32
  store i64 %_6.i, ptr %51, align 8, !alias.scope !114, !noalias !119
  %52 = getelementptr inbounds i8, ptr %_35, i64 40
  store i8 %5, ptr %52, align 8, !alias.scope !114, !noalias !119
  %53 = getelementptr inbounds i8, ptr %_35, i64 41
  store i8 %7, ptr %53, align 1, !alias.scope !114, !noalias !119
  %54 = getelementptr inbounds i8, ptr %_35, i64 42
  store i8 %9, ptr %54, align 2, !alias.scope !114, !noalias !119
; call solana_account_info::AccountInfo::realloc
  call void @_ZN19solana_account_info11AccountInfo7realloc17ha4197952dec82defE(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_33, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_35, i64 noundef 287, i1 noundef zeroext false) #11
  %55 = load i64, ptr %_33, align 8, !range !37, !noundef !5
  %56 = icmp eq i64 %55, -9223372036854775782
  br i1 %56, label %bb36, label %bb35

bb12:                                             ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit68"
  %57 = call i64 @llvm.usub.sat.i64(i64 %_13, i64 %_20)
  call void @llvm.lifetime.start.p0(i64 184, ptr nonnull %_26)
  call void @llvm.experimental.noalias.scope.decl(metadata !120)
  %_2.i86 = load ptr, ptr %system_program, align 8, !alias.scope !120, !noalias !123, !nonnull !5, !align !6, !noundef !5
  %58 = getelementptr inbounds i8, ptr %system_program, i64 8
  %_12.i87 = load ptr, ptr %58, align 8, !alias.scope !120, !noalias !123, !nonnull !5, !noundef !5
  %self.val.i.i88 = load i64, ptr %_12.i87, align 8, !noalias !125, !noundef !5
  %cond.i.i89 = icmp ne i64 %self.val.i.i88, 0
  call void @llvm.assume(i1 %cond.i.i89)
  %strong1.i.i90 = add i64 %self.val.i.i88, 1
  store i64 %strong1.i.i90, ptr %_12.i87, align 8, !noalias !125
  %_7.i.i91 = icmp eq i64 %strong1.i.i90, 0
  br i1 %_7.i.i91, label %bb4.i.i101, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i92

bb4.i.i101:                                       ; preds = %bb12
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i92: ; preds = %bb12
  %59 = getelementptr inbounds i8, ptr %system_program, i64 16
  %_16.i93 = load ptr, ptr %59, align 8, !alias.scope !120, !noalias !123, !nonnull !5, !noundef !5
  %self.val.i1.i94 = load i64, ptr %_16.i93, align 8, !noalias !125, !noundef !5
  %cond.i2.i95 = icmp ne i64 %self.val.i1.i94, 0
  call void @llvm.assume(i1 %cond.i2.i95)
  %strong1.i3.i96 = add i64 %self.val.i1.i94, 1
  store i64 %strong1.i3.i96, ptr %_16.i93, align 8, !noalias !125
  %_7.i4.i97 = icmp eq i64 %strong1.i3.i96, 0
  br i1 %_7.i4.i97, label %bb4.i5.i100, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit102"

bb4.i5.i100:                                      ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i92
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit102": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i92
  %60 = getelementptr inbounds i8, ptr %system_program, i64 24
  %_5.i98 = load ptr, ptr %60, align 8, !alias.scope !120, !noalias !123, !nonnull !5, !align !6, !noundef !5
  %61 = getelementptr inbounds i8, ptr %system_program, i64 32
  %_6.i99 = load i64, ptr %61, align 8, !alias.scope !120, !noalias !123, !noundef !5
  %62 = getelementptr inbounds i8, ptr %system_program, i64 40
  %63 = load i8, ptr %62, align 8, !range !9, !alias.scope !120, !noalias !123, !noundef !5
  %64 = getelementptr inbounds i8, ptr %system_program, i64 41
  %65 = load i8, ptr %64, align 1, !range !9, !alias.scope !120, !noalias !123, !noundef !5
  %66 = getelementptr inbounds i8, ptr %system_program, i64 42
  %67 = load i8, ptr %66, align 2, !range !9, !alias.scope !120, !noalias !123, !noundef !5
  call void @llvm.experimental.noalias.scope.decl(metadata !126)
  %_2.i103 = load ptr, ptr %payer, align 8, !alias.scope !126, !noalias !129, !nonnull !5, !align !6, !noundef !5
  %68 = getelementptr inbounds i8, ptr %payer, i64 8
  %_12.i104 = load ptr, ptr %68, align 8, !alias.scope !126, !noalias !129, !nonnull !5, !noundef !5
  %self.val.i.i105 = load i64, ptr %_12.i104, align 8, !noalias !131, !noundef !5
  %cond.i.i106 = icmp ne i64 %self.val.i.i105, 0
  call void @llvm.assume(i1 %cond.i.i106)
  %strong1.i.i107 = add i64 %self.val.i.i105, 1
  store i64 %strong1.i.i107, ptr %_12.i104, align 8, !noalias !131
  %_7.i.i108 = icmp eq i64 %strong1.i.i107, 0
  br i1 %_7.i.i108, label %bb4.i.i118, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i109

bb4.i.i118:                                       ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit102"
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i109: ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit102"
  %69 = getelementptr inbounds i8, ptr %payer, i64 16
  %_16.i110 = load ptr, ptr %69, align 8, !alias.scope !126, !noalias !129, !nonnull !5, !noundef !5
  %self.val.i1.i111 = load i64, ptr %_16.i110, align 8, !noalias !131, !noundef !5
  %cond.i2.i112 = icmp ne i64 %self.val.i1.i111, 0
  call void @llvm.assume(i1 %cond.i2.i112)
  %strong1.i3.i113 = add i64 %self.val.i1.i111, 1
  store i64 %strong1.i3.i113, ptr %_16.i110, align 8, !noalias !131
  %_7.i4.i114 = icmp eq i64 %strong1.i3.i113, 0
  br i1 %_7.i4.i114, label %bb4.i5.i117, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit119"

bb4.i5.i117:                                      ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i109
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit119": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i109
  %70 = getelementptr inbounds i8, ptr %payer, i64 24
  %_5.i115 = load ptr, ptr %70, align 8, !alias.scope !126, !noalias !129, !nonnull !5, !align !6, !noundef !5
  %71 = getelementptr inbounds i8, ptr %payer, i64 32
  %_6.i116 = load i64, ptr %71, align 8, !alias.scope !126, !noalias !129, !noundef !5
  %72 = getelementptr inbounds i8, ptr %payer, i64 40
  %73 = load i8, ptr %72, align 8, !range !9, !alias.scope !126, !noalias !129, !noundef !5
  %74 = getelementptr inbounds i8, ptr %payer, i64 41
  %75 = load i8, ptr %74, align 1, !range !9, !alias.scope !126, !noalias !129, !noundef !5
  %76 = getelementptr inbounds i8, ptr %payer, i64 42
  %77 = load i8, ptr %76, align 2, !range !9, !alias.scope !126, !noalias !129, !noundef !5
  %self.val.i.i122 = load i64, ptr %_12.i, align 8, !noalias !132, !noundef !5
  %cond.i.i123 = icmp ne i64 %self.val.i.i122, 0
  call void @llvm.assume(i1 %cond.i.i123)
  %strong1.i.i124 = add i64 %self.val.i.i122, 1
  store i64 %strong1.i.i124, ptr %_12.i, align 8, !noalias !132
  %_7.i.i125 = icmp eq i64 %strong1.i.i124, 0
  br i1 %_7.i.i125, label %bb4.i.i135, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i126

bb4.i.i135:                                       ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit119"
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i126: ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit119"
  %self.val.i1.i128 = load i64, ptr %_16.i, align 8, !noalias !132, !noundef !5
  %cond.i2.i129 = icmp ne i64 %self.val.i1.i128, 0
  call void @llvm.assume(i1 %cond.i2.i129)
  %strong1.i3.i130 = add i64 %self.val.i1.i128, 1
  store i64 %strong1.i3.i130, ptr %_16.i, align 8, !noalias !132
  %_7.i4.i131 = icmp eq i64 %strong1.i3.i130, 0
  br i1 %_7.i4.i131, label %bb4.i5.i134, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit136"

bb4.i5.i134:                                      ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i126
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit136": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h483b225c12779e86E.exit.i126
  %78 = getelementptr inbounds i8, ptr %_26, i64 72
  store ptr %_2.i103, ptr %78, align 8
  %_28.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 80
  store ptr %_12.i104, ptr %_28.sroa.4.0..sroa_idx, align 8
  %_28.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 88
  store ptr %_16.i110, ptr %_28.sroa.5.0..sroa_idx, align 8
  %_28.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 96
  store ptr %_5.i115, ptr %_28.sroa.6.0..sroa_idx, align 8
  %_28.sroa.7.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 104
  store i64 %_6.i116, ptr %_28.sroa.7.0..sroa_idx, align 8
  %_28.sroa.8.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 112
  store i8 %73, ptr %_28.sroa.8.0..sroa_idx, align 8
  %_28.sroa.9.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 113
  store i8 %75, ptr %_28.sroa.9.0..sroa_idx, align 1
  %_28.sroa.10.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 114
  store i8 %77, ptr %_28.sroa.10.0..sroa_idx, align 2
  %_28.sroa.12.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 120
  store ptr %_2.i, ptr %_28.sroa.12.0..sroa_idx, align 8
  %_28.sroa.12.sroa.4.0._28.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 128
  store ptr %_12.i, ptr %_28.sroa.12.sroa.4.0._28.sroa.12.0..sroa_idx.sroa_idx, align 8
  %_28.sroa.12.sroa.5.0._28.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 136
  store ptr %_16.i, ptr %_28.sroa.12.sroa.5.0._28.sroa.12.0..sroa_idx.sroa_idx, align 8
  %_28.sroa.12.sroa.6.0._28.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 144
  store ptr %_5.i, ptr %_28.sroa.12.sroa.6.0._28.sroa.12.0..sroa_idx.sroa_idx, align 8
  %_28.sroa.12.sroa.7.0._28.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 152
  store i64 %_6.i, ptr %_28.sroa.12.sroa.7.0._28.sroa.12.0..sroa_idx.sroa_idx, align 8
  %_28.sroa.12.sroa.8.0._28.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 160
  store i8 %5, ptr %_28.sroa.12.sroa.8.0._28.sroa.12.0..sroa_idx.sroa_idx, align 8
  %_28.sroa.12.sroa.9.0._28.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 161
  store i8 %7, ptr %_28.sroa.12.sroa.9.0._28.sroa.12.0..sroa_idx.sroa_idx, align 1
  %_28.sroa.12.sroa.10.0._28.sroa.12.0..sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 162
  store i8 %9, ptr %_28.sroa.12.sroa.10.0._28.sroa.12.0..sroa_idx.sroa_idx, align 2
  store i64 0, ptr %_26, align 8
  %_43.sroa.4.0._26.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 8
  store ptr inttoptr (i64 8 to ptr), ptr %_43.sroa.4.0._26.sroa_idx, align 8
  %_43.sroa.5.0._26.sroa_idx = getelementptr inbounds i8, ptr %_26, i64 16
  store i64 0, ptr %_43.sroa.5.0._26.sroa_idx, align 8
  %79 = getelementptr inbounds i8, ptr %_26, i64 24
  store ptr %_2.i86, ptr %79, align 8
  %_27.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 32
  store ptr %_12.i87, ptr %_27.sroa.4.0..sroa_idx, align 8
  %_27.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 40
  store ptr %_16.i93, ptr %_27.sroa.5.0..sroa_idx, align 8
  %_27.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 48
  store ptr %_5.i98, ptr %_27.sroa.6.0..sroa_idx, align 8
  %_27.sroa.7.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 56
  store i64 %_6.i99, ptr %_27.sroa.7.0..sroa_idx, align 8
  %_27.sroa.8.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 64
  store i8 %63, ptr %_27.sroa.8.0..sroa_idx, align 8
  %_27.sroa.9.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 65
  store i8 %65, ptr %_27.sroa.9.0..sroa_idx, align 1
  %_27.sroa.10.0..sroa_idx = getelementptr inbounds i8, ptr %_26, i64 66
  store i8 %67, ptr %_27.sroa.10.0..sroa_idx, align 2
  %80 = getelementptr inbounds i8, ptr %_26, i64 168
  store ptr inttoptr (i64 8 to ptr), ptr %80, align 8
  %81 = getelementptr inbounds i8, ptr %_26, i64 176
  store i64 0, ptr %81, align 8
; call anchor_lang::system_program::transfer
  %82 = call { i64, ptr } @_ZN11anchor_lang14system_program8transfer17h1c9302c6a5a1797fE(ptr noalias nocapture noundef nonnull align 8 dereferenceable(184) %_26, i64 noundef %57) #11
  %83 = extractvalue { i64, ptr } %82, 0
  call void @llvm.lifetime.end.p0(i64 184, ptr nonnull %_26)
  %84 = icmp eq i64 %83, 2
  br i1 %84, label %bb14, label %bb32

bb32:                                             ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit136"
  %85 = extractvalue { i64, ptr } %82, 1
  br label %bb21

bb36:                                             ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit85"
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_33)
  %self1.val.i.i.i137 = load i64, ptr %_12.i, align 8, !noundef !5
  %val.i.i.i138 = add i64 %self1.val.i.i.i137, -1
  store i64 %val.i.i.i138, ptr %_12.i, align 8
  %86 = icmp eq i64 %val.i.i.i138, 0
  br i1 %86, label %bb1.i.i.i145, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i139"

bb1.i.i.i145:                                     ; preds = %bb36
  %87 = getelementptr i8, ptr %_12.i, i64 8
  %self2.val.i.i.i146 = load i64, ptr %87, align 8, !noundef !5
  %val6.i.i.i147 = add i64 %self2.val.i.i.i146, -1
  store i64 %val6.i.i.i147, ptr %87, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i139"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i139": ; preds = %bb1.i.i.i145, %bb36
  %self1.val.i.i2.i140 = load i64, ptr %_16.i, align 8, !noundef !5
  %val.i.i3.i141 = add i64 %self1.val.i.i2.i140, -1
  store i64 %val.i.i3.i141, ptr %_16.i, align 8
  %88 = icmp eq i64 %val.i.i3.i141, 0
  br i1 %88, label %bb1.i.i4.i142, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit148"

bb1.i.i4.i142:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i139"
  %89 = getelementptr i8, ptr %_16.i, i64 8
  %self2.val.i.i5.i143 = load i64, ptr %89, align 8, !noundef !5
  %val6.i.i6.i144 = add i64 %self2.val.i.i5.i143, -1
  store i64 %val6.i.i6.i144, ptr %89, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit148"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit148": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i139", %bb1.i.i4.i142
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_35)
  br label %bb21

bb35:                                             ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit85"
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_52)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_52, ptr noundef nonnull align 8 dereferenceable(24) %_33, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_33)
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %90 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17heba0ebbdde914d9aE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_52) #11
  %_53.0 = extractvalue { i64, ptr } %90, 0
  %_53.1 = extractvalue { i64, ptr } %90, 1
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_52)
  %_35.val = load ptr, ptr %48, align 8, !nonnull !5, !noundef !5
  %_35.val5 = load ptr, ptr %49, align 8
  %self1.val.i.i.i149 = load i64, ptr %_35.val, align 8, !noundef !5
  %val.i.i.i150 = add i64 %self1.val.i.i.i149, -1
  store i64 %val.i.i.i150, ptr %_35.val, align 8
  %91 = icmp eq i64 %val.i.i.i150, 0
  br i1 %91, label %bb1.i.i.i157, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i151"

bb1.i.i.i157:                                     ; preds = %bb35
  %92 = getelementptr i8, ptr %_35.val, i64 8
  %self2.val.i.i.i158 = load i64, ptr %92, align 8, !noundef !5
  %val6.i.i.i159 = add i64 %self2.val.i.i.i158, -1
  store i64 %val6.i.i.i159, ptr %92, align 8
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i151"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i151": ; preds = %bb1.i.i.i157, %bb35
  %93 = icmp ne ptr %_35.val5, null
  call void @llvm.assume(i1 %93)
  %self1.val.i.i2.i152 = load i64, ptr %_35.val5, align 8, !noundef !5
  %val.i.i3.i153 = add i64 %self1.val.i.i2.i152, -1
  store i64 %val.i.i3.i153, ptr %_35.val5, align 8
  %94 = icmp eq i64 %val.i.i3.i153, 0
  br i1 %94, label %bb1.i.i4.i154, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit160"

bb1.i.i4.i154:                                    ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i151"
  %95 = getelementptr i8, ptr %_35.val5, i64 8
  %self2.val.i.i5.i155 = load i64, ptr %95, align 8, !noundef !5
  %val6.i.i6.i156 = add i64 %self2.val.i.i5.i155, -1
  store i64 %val6.i.i6.i156, ptr %95, align 8
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit160"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit160": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17hd21cc102c3250caeE.exit.i151", %bb1.i.i4.i154
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_35)
  br label %bb21

bb21:                                             ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit", %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit148", %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit39", %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit160", %bb32, %bb24
  %_0.sroa.5.0 = phi ptr [ %_42.1, %bb24 ], [ %_53.1, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit160" ], [ %85, %bb32 ], [ undef, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit39" ], [ undef, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit148" ], [ undef, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit" ]
  %_0.sroa.0.0 = phi i64 [ %_42.0, %bb24 ], [ %_53.0, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit160" ], [ %83, %bb32 ], [ 2, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit39" ], [ 2, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit148" ], [ 2, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17he2b79e3d1577878cE.exit" ]
  %96 = insertvalue { i64, ptr } poison, i64 %_0.sroa.0.0, 0
  %97 = insertvalue { i64, ptr } %96, ptr %_0.sroa.5.0, 1
  ret { i64, ptr } %97
}

; Function Attrs: mustprogress nofree norecurse nosync nounwind willreturn memory(readwrite, inaccessiblemem: write)
define hidden noundef ptr @__rust_alloc(i64 noundef %size, i64 noundef %align) unnamed_addr #1 {
start:
  %0 = icmp ne i64 %align, 0
  tail call void @llvm.assume(i1 %0)
  %1 = icmp ult i64 %align, -9223372036854775807
  tail call void @llvm.assume(i1 %1)
  %2 = load i64, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noundef !5
  %3 = icmp eq i64 %2, 0
  %pos.sroa.0.0.i = select i1 %3, i64 12884934656, i64 %2
  %4 = tail call i64 @llvm.usub.sat.i64(i64 %pos.sroa.0.0.i, i64 %size)
  %_12.i = sub i64 0, %align
  %5 = and i64 %4, %_12.i
  %_15.i = icmp ult i64 %5, 12884901896
  br i1 %_15.i, label %"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17h60644b318ad66e77E.exit", label %bb7.i

bb7.i:                                            ; preds = %start
  store i64 %5, ptr inttoptr (i64 12884901888 to ptr), align 4294967296
  %6 = inttoptr i64 %5 to ptr
  br label %"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17h60644b318ad66e77E.exit"

"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17h60644b318ad66e77E.exit": ; preds = %start, %bb7.i
  %_0.sroa.0.0.i = phi ptr [ %6, %bb7.i ], [ null, %start ]
  ret ptr %_0.sroa.0.0.i
}

; Function Attrs: mustprogress nofree norecurse nosync nounwind willreturn memory(none)
define hidden void @__rust_dealloc(ptr nocapture noundef readnone %ptr, i64 noundef %size, i64 noundef %align) unnamed_addr #2 {
start:
  ret void
}

; Function Attrs: mustprogress nofree norecurse nosync nounwind willreturn memory(readwrite, inaccessiblemem: write)
define hidden noundef ptr @__rust_realloc(ptr nocapture noundef readonly %ptr, i64 noundef %size, i64 noundef %align, i64 noundef %new_size) unnamed_addr #1 {
start:
  %0 = icmp ne i64 %align, 0
  tail call void @llvm.assume(i1 %0)
  %1 = icmp ult i64 %align, -9223372036854775807
  tail call void @llvm.assume(i1 %1)
  %2 = load i64, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noundef !5
  %3 = icmp eq i64 %2, 0
  %pos.sroa.0.0.i.i = select i1 %3, i64 12884934656, i64 %2
  %4 = tail call i64 @llvm.usub.sat.i64(i64 %pos.sroa.0.0.i.i, i64 %new_size)
  %_12.i.i = sub i64 0, %align
  %5 = and i64 %4, %_12.i.i
  %_15.i.i = icmp ult i64 %5, 12884901896
  br i1 %_15.i.i, label %_ZN4core5alloc6global11GlobalAlloc7realloc17h1e18f8b8dd0f752cE.exit, label %"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17h60644b318ad66e77E.exit.i"

"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17h60644b318ad66e77E.exit.i": ; preds = %start
  store i64 %5, ptr inttoptr (i64 12884901888 to ptr), align 4294967296
  %6 = inttoptr i64 %5 to ptr
  %_0.sroa.0.0.sroa.speculated.i.i = tail call noundef i64 @llvm.umin.i64(i64 %size, i64 %new_size)
  tail call void @llvm.memcpy.p0.p0.i64(ptr nonnull align 1 %6, ptr align 1 %ptr, i64 %_0.sroa.0.0.sroa.speculated.i.i, i1 false)
  br label %_ZN4core5alloc6global11GlobalAlloc7realloc17h1e18f8b8dd0f752cE.exit

_ZN4core5alloc6global11GlobalAlloc7realloc17h1e18f8b8dd0f752cE.exit: ; preds = %start, %"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17h60644b318ad66e77E.exit.i"
  %_0.sroa.0.0.i2.i = phi ptr [ %6, %"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17h60644b318ad66e77E.exit.i" ], [ null, %start ]
  ret ptr %_0.sroa.0.0.i2.i
}

; Function Attrs: mustprogress nofree norecurse nosync nounwind willreturn memory(readwrite, inaccessiblemem: write)
define hidden noundef ptr @__rust_alloc_zeroed(i64 noundef %size, i64 noundef %align) unnamed_addr #1 {
start:
  %0 = icmp ne i64 %align, 0
  tail call void @llvm.assume(i1 %0)
  %1 = icmp ult i64 %align, -9223372036854775807
  tail call void @llvm.assume(i1 %1)
  %2 = load i64, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noundef !5
  %3 = icmp eq i64 %2, 0
  %pos.sroa.0.0.i.i = select i1 %3, i64 12884934656, i64 %2
  %4 = tail call i64 @llvm.usub.sat.i64(i64 %pos.sroa.0.0.i.i, i64 %size)
  %_12.i.i = sub i64 0, %align
  %5 = and i64 %4, %_12.i.i
  %_15.i.i = icmp ult i64 %5, 12884901896
  br i1 %_15.i.i, label %_ZN4core5alloc6global11GlobalAlloc12alloc_zeroed17h611fb870d90be2d4E.exit, label %"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17h60644b318ad66e77E.exit.i"

"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17h60644b318ad66e77E.exit.i": ; preds = %start
  store i64 %5, ptr inttoptr (i64 12884901888 to ptr), align 4294967296
  %6 = inttoptr i64 %5 to ptr
  tail call void @llvm.memset.p0.i64(ptr nonnull align 1 %6, i8 0, i64 %size, i1 false)
  br label %_ZN4core5alloc6global11GlobalAlloc12alloc_zeroed17h611fb870d90be2d4E.exit

_ZN4core5alloc6global11GlobalAlloc12alloc_zeroed17h611fb870d90be2d4E.exit: ; preds = %start, %"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17h60644b318ad66e77E.exit.i"
  %_0.sroa.0.0.i2.i = phi ptr [ %6, %"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17h60644b318ad66e77E.exit.i" ], [ null, %start ]
  ret ptr %_0.sroa.0.0.i2.i
}

; Function Attrs: mustprogress nocallback nofree nounwind willreturn memory(argmem: write)
declare void @llvm.memset.p0.i64(ptr nocapture writeonly, i8, i64, i1 immarg) #3

; Function Attrs: mustprogress nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: write)
declare hidden void @llvm.assume(i1 noundef) #4

; Function Attrs: mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite)
declare void @llvm.memcpy.p0.p0.i64(ptr noalias nocapture writeonly, ptr noalias nocapture readonly, i64, i1 immarg) #5

; Function Attrs: cold noreturn nounwind memory(inaccessiblemem: write)
declare hidden void @llvm.trap() #6

; Function Attrs: mustprogress nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare hidden i64 @llvm.usub.sat.i64(i64, i64) #7

; solana_account_info::AccountInfo::data_len
; Function Attrs: nounwind
declare noundef i64 @_ZN19solana_account_info11AccountInfo8data_len17hab41f5a7fca37a40E(ptr noalias noundef readonly align 8 dereferenceable(48)) unnamed_addr #0

; solana_sysvar::rent::<impl solana_sysvar::Sysvar for solana_rent::Rent>::get
; Function Attrs: nounwind
declare void @"_ZN13solana_sysvar4rent69_$LT$impl$u20$solana_sysvar..Sysvar$u20$for$u20$solana_rent..Rent$GT$3get17h451d81047c683abdE"(ptr dead_on_unwind noalias nocapture noundef writable sret([32 x i8]) align 8 dereferenceable(32)) unnamed_addr #0

; solana_rent::Rent::minimum_balance
; Function Attrs: nounwind
declare noundef i64 @_ZN11solana_rent4Rent15minimum_balance17had8abba6b93c5f14E(ptr noalias noundef readonly align 8 dereferenceable(24), i64 noundef) unnamed_addr #0

; solana_account_info::AccountInfo::lamports
; Function Attrs: nounwind
declare noundef i64 @_ZN19solana_account_info11AccountInfo8lamports17h3208c65b27977111E(ptr noalias noundef readonly align 8 dereferenceable(48)) unnamed_addr #0

; anchor_lang::system_program::transfer
; Function Attrs: nounwind
declare { i64, ptr } @_ZN11anchor_lang14system_program8transfer17h1c9302c6a5a1797fE(ptr noalias nocapture noundef align 8 dereferenceable(184), i64 noundef) unnamed_addr #0

; solana_account_info::AccountInfo::realloc
; Function Attrs: nounwind
declare void @_ZN19solana_account_info11AccountInfo7realloc17ha4197952dec82defE(ptr dead_on_unwind noalias nocapture noundef writable sret([24 x i8]) align 8 dereferenceable(24), ptr noalias noundef readonly align 8 dereferenceable(48), i64 noundef, i1 noundef zeroext) unnamed_addr #0

; <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
; Function Attrs: nounwind
declare { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17heba0ebbdde914d9aE"(ptr noalias nocapture noundef readonly align 8 dereferenceable(24)) unnamed_addr #0

; Function Attrs: mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite)
declare void @llvm.lifetime.start.p0(i64 immarg, ptr nocapture) #8

; Function Attrs: mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite)
declare void @llvm.lifetime.end.p0(i64 immarg, ptr nocapture) #8

; Function Attrs: nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: readwrite)
declare void @llvm.experimental.noalias.scope.decl(metadata) #9

; Function Attrs: nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare i64 @llvm.umin.i64(i64, i64) #10

attributes #0 = { nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #1 = { mustprogress nofree norecurse nosync nounwind willreturn memory(readwrite, inaccessiblemem: write) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #2 = { mustprogress nofree norecurse nosync nounwind willreturn memory(none) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #3 = { mustprogress nocallback nofree nounwind willreturn memory(argmem: write) }
attributes #4 = { mustprogress nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: write) }
attributes #5 = { mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite) }
attributes #6 = { cold noreturn nounwind memory(inaccessiblemem: write) }
attributes #7 = { mustprogress nocallback nofree nosync nounwind speculatable willreturn memory(none) }
attributes #8 = { mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite) }
attributes #9 = { nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: readwrite) }
attributes #10 = { nocallback nofree nosync nounwind speculatable willreturn memory(none) }
attributes #11 = { nounwind }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 8, !"PIC Level", i32 2}
!1 = !{!"rustc version 1.79.0-dev"}
!2 = !{!3}
!3 = distinct !{!3, !4, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!4 = distinct !{!4, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!5 = !{}
!6 = !{i64 1}
!7 = !{!3, !8}
!8 = distinct !{!8, !4, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!9 = !{i8 0, i8 2}
!10 = !{!8}
!11 = !{!12}
!12 = distinct !{!12, !13, !"_ZN8variants14inner_baseline17hd0a84941d87bea94E: %system_program"}
!13 = distinct !{!13, !"_ZN8variants14inner_baseline17hd0a84941d87bea94E"}
!14 = !{!15}
!15 = distinct !{!15, !13, !"_ZN8variants14inner_baseline17hd0a84941d87bea94E: %payer"}
!16 = !{!17, !12, !15}
!17 = distinct !{!17, !13, !"_ZN8variants14inner_baseline17hd0a84941d87bea94E: %account"}
!18 = !{!19}
!19 = distinct !{!19, !20, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!20 = distinct !{!20, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!21 = !{!19, !22, !17, !12, !15}
!22 = distinct !{!22, !20, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!23 = !{!22, !17, !12, !15}
!24 = !{i64 0, i64 2}
!25 = !{!26}
!26 = distinct !{!26, !27, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!27 = distinct !{!27, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!28 = !{!26, !29, !17, !12, !15}
!29 = distinct !{!29, !27, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!30 = !{!29, !17, !12, !15}
!31 = !{!32}
!32 = distinct !{!32, !33, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!33 = distinct !{!33, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!34 = !{!32, !35, !17, !12, !15}
!35 = distinct !{!35, !33, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!36 = !{!35, !17, !12, !15}
!37 = !{i64 0, i64 -9223372036854775781}
!38 = !{!39}
!39 = distinct !{!39, !40, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!40 = distinct !{!40, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!41 = !{!39, !12}
!42 = !{!43, !17, !15}
!43 = distinct !{!43, !40, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!44 = !{!43, !39, !17, !12, !15}
!45 = !{!46}
!46 = distinct !{!46, !47, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!47 = distinct !{!47, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!48 = !{!46, !15}
!49 = !{!50, !17, !12}
!50 = distinct !{!50, !47, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!51 = !{!50, !46, !17, !12, !15}
!52 = !{!53, !55, !17, !12, !15}
!53 = distinct !{!53, !54, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!54 = distinct !{!54, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!55 = distinct !{!55, !54, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!56 = !{!57}
!57 = distinct !{!57, !58, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!58 = distinct !{!58, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!59 = !{!57, !60}
!60 = distinct !{!60, !58, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!61 = !{!60}
!62 = !{!63}
!63 = distinct !{!63, !64, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!64 = distinct !{!64, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!65 = !{!63, !66}
!66 = distinct !{!66, !64, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!67 = !{!66}
!68 = !{!69}
!69 = distinct !{!69, !70, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!70 = distinct !{!70, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!71 = !{!69, !72}
!72 = distinct !{!72, !70, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!73 = !{!72}
!74 = !{!75}
!75 = distinct !{!75, !76, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!76 = distinct !{!76, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!77 = !{!75, !78}
!78 = distinct !{!78, !76, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!79 = !{!78}
!80 = !{!81}
!81 = distinct !{!81, !82, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!82 = distinct !{!82, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!83 = !{!84}
!84 = distinct !{!84, !82, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!85 = !{!84, !81}
!86 = !{!87}
!87 = distinct !{!87, !88, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!88 = distinct !{!88, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!89 = !{!90}
!90 = distinct !{!90, !88, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!91 = !{!90, !87}
!92 = !{!93, !95}
!93 = distinct !{!93, !94, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!94 = distinct !{!94, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!95 = distinct !{!95, !94, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!96 = !{!97}
!97 = distinct !{!97, !98, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!98 = distinct !{!98, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!99 = !{!97, !100}
!100 = distinct !{!100, !98, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!101 = !{!100}
!102 = !{!103}
!103 = distinct !{!103, !104, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!104 = distinct !{!104, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!105 = !{!103, !106}
!106 = distinct !{!106, !104, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!107 = !{!106}
!108 = !{!109}
!109 = distinct !{!109, !110, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!110 = distinct !{!110, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!111 = !{!109, !112}
!112 = distinct !{!112, !110, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!113 = !{!112}
!114 = !{!115}
!115 = distinct !{!115, !116, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!116 = distinct !{!116, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!117 = !{!115, !118}
!118 = distinct !{!118, !116, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!119 = !{!118}
!120 = !{!121}
!121 = distinct !{!121, !122, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!122 = distinct !{!122, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!123 = !{!124}
!124 = distinct !{!124, !122, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!125 = !{!124, !121}
!126 = !{!127}
!127 = distinct !{!127, !128, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!128 = distinct !{!128, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!129 = !{!130}
!130 = distinct !{!130, !128, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!131 = !{!130, !127}
!132 = !{!133, !135}
!133 = distinct !{!133, !134, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!134 = distinct !{!134, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!135 = distinct !{!135, !134, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
