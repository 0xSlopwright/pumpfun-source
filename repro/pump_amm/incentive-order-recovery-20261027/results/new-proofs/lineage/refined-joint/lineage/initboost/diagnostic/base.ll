; ModuleID = 'base.eb34936c00c31155-cgu.0'
source_filename = "base.eb34936c00c31155-cgu.0"
target datalayout = "e-m:e-p:64:64-i64:64-n32:64-S128"
target triple = "sbf"

%"solana_pubkey::Pubkey" = type { [32 x i8] }

@alloc_31365cfefba383c4d2bf6b6a04cc10aa = private unnamed_addr constant <{ [17 x i8] }> <{ [17 x i8] c"capacity overflow" }>, align 1
@alloc_e760b8a82485eab475ddc4c0d696a7ac = private unnamed_addr constant <{ ptr, [8 x i8] }> <{ ptr @alloc_31365cfefba383c4d2bf6b6a04cc10aa, [8 x i8] c"\11\00\00\00\00\00\00\00" }>, align 8
@alloc_7cb3f93b3ba6531fd2aa2397755a323b = private unnamed_addr constant <{ [103 x i8] }> <{ [103 x i8] c"/home/runner/work/platform-tools/platform-tools/out/rust/library/alloc/src/vec/spec_from_iter_nested.rs" }>, align 1
@alloc_9c83b52252c910a197dd2a3d1d5a127e = private unnamed_addr constant <{ ptr, [16 x i8] }> <{ ptr @alloc_7cb3f93b3ba6531fd2aa2397755a323b, [16 x i8] c"g\00\00\00\00\00\00\00;\00\00\00\12\00\00\00" }>, align 8
@alloc_b38aff3a6ff2b35340e262da817c1070 = private unnamed_addr constant <{ [85 x i8] }> <{ [85 x i8] c"/home/runner/work/platform-tools/platform-tools/out/rust/library/alloc/src/vec/mod.rs" }>, align 1
@alloc_21fb3a4531199f65e9b4751b9e3816cb = private unnamed_addr constant <{ ptr, [16 x i8] }> <{ ptr @alloc_b38aff3a6ff2b35340e262da817c1070, [16 x i8] c"U\00\00\00\00\00\00\00(\0C\00\00\0D\00\00\00" }>, align 8
@alloc_837d2dfc2ca6132d7e624d246f381ca4 = private unnamed_addr constant <{ [14 x i8] }> <{ [14 x i8] c"pool-authority" }>, align 1
@_ZN18pump_amm_recovered4pump2ID17he4e01eb591eb9fd8E = external global %"solana_pubkey::Pubkey"
@alloc_bfc098cb63b041e1e9ec31a95db422e0 = private unnamed_addr constant <{ [4 x i8] }> <{ [4 x i8] c"pool" }>, align 1
@alloc_d1e50873cb16f1fc41ca481a2a657dfa = private unnamed_addr constant <{ [8 x i8] }> <{ [8 x i8] c"\E4E\A5.Q\CB\9A\1D" }>, align 1
@_ZN18pump_amm_recovered2ID17h808a92cd622e7a23E = external local_unnamed_addr global %"solana_pubkey::Pubkey"
@alloc_7a7952b5e0d15f2b72d0341cef6d4739 = private unnamed_addr constant <{ [17 x i8] }> <{ [17 x i8] c"__event_authority" }>, align 1

; core::ptr::drop_in_place<solana_instruction::Instruction>
; Function Attrs: nounwind
define internal fastcc void @"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h229e98e0f664984fE"(ptr noalias nocapture noundef readonly align 8 dereferenceable(80) %_1) unnamed_addr #0 {
start:
  %_1.val = load i64, ptr %_1, align 8, !noundef !2
  %0 = icmp eq i64 %_1.val, 0
  br i1 %0, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h0d80cbdbf095606cE.exit", label %bb2.i.i.i

bb2.i.i.i:                                        ; preds = %start
  %1 = getelementptr inbounds i8, ptr %_1, i64 8
  %_1.val2 = load ptr, ptr %1, align 8, !nonnull !2, !noundef !2
  %size.i.i.i.i = mul nuw i64 %_1.val, 34
  tail call void @__rust_dealloc(ptr noundef nonnull %_1.val2, i64 noundef %size.i.i.i.i, i64 noundef 1) #19
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h0d80cbdbf095606cE.exit"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h0d80cbdbf095606cE.exit": ; preds = %start, %bb2.i.i.i
  %2 = getelementptr inbounds i8, ptr %_1, i64 24
  %.val = load i64, ptr %2, align 8, !noundef !2
  %3 = icmp eq i64 %.val, 0
  br i1 %3, label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h0d80cbdbf095606cE.exit"
  %4 = getelementptr inbounds i8, ptr %_1, i64 32
  %.val1 = load ptr, ptr %4, align 8, !nonnull !2, !noundef !2
  tail call void @__rust_dealloc(ptr noundef nonnull %.val1, i64 noundef %.val, i64 noundef 1) #19
  br label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit"

"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h0d80cbdbf095606cE.exit", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i"
  ret void
}

; core::ptr::drop_in_place<[solana_account_info::AccountInfo; 1]>
; Function Attrs: nounwind
define internal fastcc void @"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17hb81a6a6cb5b44108E"(ptr %_1.8.val, ptr %_1.16.val) unnamed_addr #0 {
start:
  %0 = icmp ne ptr %_1.8.val, null
  tail call void @llvm.assume(i1 %0)
  %self1.val.i.i.i = load i64, ptr %_1.8.val, align 8, !noundef !2
  %val.i.i.i = add i64 %self1.val.i.i.i, -1
  store i64 %val.i.i.i, ptr %_1.8.val, align 8
  %1 = icmp eq i64 %val.i.i.i, 0
  br i1 %1, label %bb1.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h6b0177af4d3a7204E.exit.i"

bb1.i.i.i:                                        ; preds = %start
  %2 = getelementptr i8, ptr %_1.8.val, i64 8
  %self2.val.i.i.i = load i64, ptr %2, align 8, !noundef !2
  %val6.i.i.i = add i64 %self2.val.i.i.i, -1
  store i64 %val6.i.i.i, ptr %2, align 8
  %3 = icmp eq i64 %val6.i.i.i, 0
  br i1 %3, label %bb3.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h6b0177af4d3a7204E.exit.i"

bb3.i.i.i:                                        ; preds = %bb1.i.i.i
  tail call void @__rust_dealloc(ptr noundef nonnull %_1.8.val, i64 noundef 32, i64 noundef 8) #19
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h6b0177af4d3a7204E.exit.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h6b0177af4d3a7204E.exit.i": ; preds = %bb3.i.i.i, %bb1.i.i.i, %start
  %4 = icmp ne ptr %_1.16.val, null
  tail call void @llvm.assume(i1 %4)
  %self1.val.i.i2.i = load i64, ptr %_1.16.val, align 8, !noundef !2
  %val.i.i3.i = add i64 %self1.val.i.i2.i, -1
  store i64 %val.i.i3.i, ptr %_1.16.val, align 8
  %5 = icmp eq i64 %val.i.i3.i, 0
  br i1 %5, label %bb1.i.i4.i, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h943e945399c8a536E.exit"

bb1.i.i4.i:                                       ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h6b0177af4d3a7204E.exit.i"
  %6 = getelementptr i8, ptr %_1.16.val, i64 8
  %self2.val.i.i5.i = load i64, ptr %6, align 8, !noundef !2
  %val6.i.i6.i = add i64 %self2.val.i.i5.i, -1
  store i64 %val6.i.i6.i, ptr %6, align 8
  %7 = icmp eq i64 %val6.i.i6.i, 0
  br i1 %7, label %bb3.i.i7.i, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h943e945399c8a536E.exit"

bb3.i.i7.i:                                       ; preds = %bb1.i.i4.i
  tail call void @__rust_dealloc(ptr noundef nonnull %_1.16.val, i64 noundef 40, i64 noundef 8) #19
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h943e945399c8a536E.exit"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h943e945399c8a536E.exit": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h6b0177af4d3a7204E.exit.i", %bb1.i.i4.i, %bb3.i.i7.i
  ret void
}

; alloc::alloc::exchange_malloc
; Function Attrs: inlinehint nounwind
define internal fastcc noalias noundef ptr @_ZN5alloc5alloc15exchange_malloc17h6cd8dd11b0e3424eE() unnamed_addr #1 {
start:
  %0 = tail call noundef dereferenceable_or_null(34) ptr @__rust_alloc(i64 noundef 34, i64 noundef 1) #19
  %1 = icmp eq ptr %0, null
  br i1 %1, label %bb2, label %bb3

bb3:                                              ; preds = %start
  ret ptr %0

bb2:                                              ; preds = %start
; call alloc::alloc::handle_alloc_error
  tail call void @_ZN5alloc5alloc18handle_alloc_error17hdf8d5797c8d8bbffE(i64 noundef 1, i64 noundef 34) #20
  unreachable
}

; alloc::raw_vec::finish_grow
; Function Attrs: noinline nounwind
define internal fastcc void @_ZN5alloc7raw_vec11finish_grow17ha6f52f457de2be34E(ptr dead_on_unwind noalias nocapture noundef writable writeonly align 8 dereferenceable(24) %_0, i64 noundef %0, i64 %1, ptr noalias nocapture noundef readonly align 8 dereferenceable(24) %current_memory) unnamed_addr #2 {
start:
  %2 = icmp eq i64 %0, 0
  br i1 %2, label %bb8, label %bb9

bb9:                                              ; preds = %start
  %3 = getelementptr inbounds i8, ptr %current_memory, i64 8
  %4 = load i64, ptr %3, align 8, !range !3, !noundef !2
  %5 = icmp eq i64 %4, 0
  br i1 %5, label %bb2, label %bb3

bb8:                                              ; preds = %start
  %6 = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 0, ptr %6, align 8
  br label %bb7

bb3:                                              ; preds = %bb9
  %ptr = load ptr, ptr %current_memory, align 8, !nonnull !2, !noundef !2
  %7 = getelementptr inbounds i8, ptr %current_memory, i64 16
  %8 = load i64, ptr %7, align 8, !noundef !2
  %cond = icmp eq i64 %4, 1
  tail call void @llvm.assume(i1 %cond)
  %9 = icmp eq i64 %8, 0
  br i1 %9, label %bb1.i.i, label %bb4.i.i

bb1.i.i:                                          ; preds = %bb3
  %10 = icmp eq i64 %1, 0
  br i1 %10, label %bb14, label %bb5.i.i.i

bb5.i.i.i:                                        ; preds = %bb1.i.i
  %11 = tail call noundef ptr @__rust_alloc(i64 noundef %1, i64 noundef 1) #19
  %12 = icmp eq ptr %11, null
  br i1 %12, label %bb13, label %bb14

bb4.i.i:                                          ; preds = %bb3
  %cond.i.i = icmp ule i64 %8, %1
  tail call void @llvm.assume(i1 %cond.i.i)
  %raw_ptr.i.i = tail call noundef ptr @__rust_realloc(ptr noundef nonnull %ptr, i64 noundef %8, i64 noundef 1, i64 noundef %1) #19
  %13 = icmp eq ptr %raw_ptr.i.i, null
  br i1 %13, label %bb13, label %bb14

bb2:                                              ; preds = %bb9
  %14 = icmp eq i64 %1, 0
  br i1 %14, label %bb14, label %bb5.i.i25

bb5.i.i25:                                        ; preds = %bb2
  %15 = tail call noundef ptr @__rust_alloc(i64 noundef %1, i64 noundef 1) #19
  %16 = icmp eq ptr %15, null
  br i1 %16, label %bb13, label %bb14

bb14:                                             ; preds = %bb5.i.i25, %bb4.i.i, %bb5.i.i.i, %bb1.i.i, %bb2
  %_0.sroa.0.0.i.i.pn.ph = phi ptr [ inttoptr (i64 1 to ptr), %bb2 ], [ inttoptr (i64 1 to ptr), %bb1.i.i ], [ %11, %bb5.i.i.i ], [ %raw_ptr.i.i, %bb4.i.i ], [ %15, %bb5.i.i25 ]
  %_0.sroa.4.0.i.i.pn.ph = phi i64 [ 0, %bb2 ], [ 0, %bb1.i.i ], [ %1, %bb5.i.i.i ], [ %1, %bb4.i.i ], [ %1, %bb5.i.i25 ]
  %17 = getelementptr inbounds i8, ptr %_0, i64 8
  %18 = getelementptr inbounds i8, ptr %_0, i64 16
  store ptr %_0.sroa.0.0.i.i.pn.ph, ptr %17, align 8
  store i64 %_0.sroa.4.0.i.i.pn.ph, ptr %18, align 8
  br label %bb7

bb13:                                             ; preds = %bb5.i.i.i, %bb4.i.i, %bb5.i.i25
  %19 = getelementptr inbounds i8, ptr %_0, i64 8
  %20 = getelementptr inbounds i8, ptr %_0, i64 16
  store i64 1, ptr %19, align 8
  store i64 %1, ptr %20, align 8
  br label %bb7

bb7:                                              ; preds = %bb14, %bb13, %bb8
  %storemerge24 = phi i64 [ 1, %bb8 ], [ 0, %bb14 ], [ 1, %bb13 ]
  store i64 %storemerge24, ptr %_0, align 8
  ret void
}

; alloc::raw_vec::RawVec<T,A>::reserve::do_reserve_and_handle
; Function Attrs: cold nounwind
define internal fastcc void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h721ba3b6601c4b82E"(ptr noalias nocapture noundef align 8 dereferenceable(16) %slf, i64 noundef %len, i64 noundef %additional) unnamed_addr #3 {
start:
  %_20.i = alloca [24 x i8], align 8
  %self5.i = alloca [24 x i8], align 8
  tail call void @llvm.experimental.noalias.scope.decl(metadata !4)
  %0 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %len, i64 %additional)
  %_29.1.i = extractvalue { i64, i1 } %0, 1
  br i1 %_29.1.i, label %bb2, label %bb10.i

bb10.i:                                           ; preds = %start
  %_29.0.i = extractvalue { i64, i1 } %0, 0
  %_12.i = load i64, ptr %slf, align 8, !alias.scope !4, !noundef !2
  %1 = shl i64 %_12.i, 1
  %cap.sroa.0.0.sroa.speculated.i = tail call i64 @llvm.umax.i64(i64 %1, i64 %_29.0.i)
  %cap3.sroa.0.0.sroa.speculated.i = tail call i64 @llvm.umax.i64(i64 %cap.sroa.0.0.sroa.speculated.i, i64 8)
  %_4.i.i = icmp sgt i64 %cap3.sroa.0.0.sroa.speculated.i, -1
  %_0.sroa.0.0.i.i = zext i1 %_4.i.i to i64
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %self5.i), !noalias !4
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_20.i), !noalias !4
  %2 = getelementptr inbounds i8, ptr %slf, i64 8
  %3 = icmp eq i64 %_12.i, 0
  br i1 %3, label %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h15e90ad63b96054dE.exit.i", label %bb4.i.i

bb4.i.i:                                          ; preds = %bb10.i
  %self.val22.i = load ptr, ptr %2, align 8, !alias.scope !4, !nonnull !2, !noundef !2
  store ptr %self.val22.i, ptr %_20.i, align 8, !alias.scope !7, !noalias !4
  %_9.sroa.5.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_20.i, i64 16
  store i64 %_12.i, ptr %_9.sroa.5.0._0.sroa_idx.i.i, align 8, !alias.scope !7, !noalias !4
  br label %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h15e90ad63b96054dE.exit.i"

"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h15e90ad63b96054dE.exit.i": ; preds = %bb4.i.i, %bb10.i
  %.sink.i.i = phi i64 [ 1, %bb4.i.i ], [ 0, %bb10.i ]
  %4 = getelementptr inbounds i8, ptr %_20.i, i64 8
  store i64 %.sink.i.i, ptr %4, align 8, !alias.scope !7, !noalias !4
; call alloc::raw_vec::finish_grow
  call fastcc void @_ZN5alloc7raw_vec11finish_grow17ha6f52f457de2be34E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %self5.i, i64 noundef %_0.sroa.0.0.i.i, i64 %cap3.sroa.0.0.sroa.speculated.i, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_20.i) #19, !noalias !4
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_20.i), !noalias !4
  %_53.i = load i64, ptr %self5.i, align 8, !range !10, !noalias !4, !noundef !2
  %trunc.not.i = icmp eq i64 %_53.i, 0
  %5 = getelementptr inbounds i8, ptr %self5.i, i64 8
  br i1 %trunc.not.i, label %bb3, label %bb20.i

bb20.i:                                           ; preds = %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h15e90ad63b96054dE.exit.i"
  %e.0.i = load i64, ptr %5, align 8, !range !3, !noalias !4, !noundef !2
  %6 = getelementptr inbounds i8, ptr %self5.i, i64 16
  %e.1.i = load i64, ptr %6, align 8, !noalias !4
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %self5.i), !noalias !4
  br label %bb2

bb2:                                              ; preds = %bb20.i, %start
  %_0.sroa.4.0.i.ph = phi i64 [ undef, %start ], [ %e.1.i, %bb20.i ]
  %_0.sroa.0.0.i.ph = phi i64 [ 0, %start ], [ %e.0.i, %bb20.i ]
; call alloc::raw_vec::handle_error
  tail call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef %_0.sroa.0.0.i.ph, i64 %_0.sroa.4.0.i.ph) #20
  unreachable

bb3:                                              ; preds = %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h15e90ad63b96054dE.exit.i"
  %v.0.i = load ptr, ptr %5, align 8, !noalias !4, !nonnull !2, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %self5.i), !noalias !4
  store ptr %v.0.i, ptr %2, align 8, !alias.scope !4
  store i64 %cap3.sroa.0.0.sroa.speculated.i, ptr %slf, align 8, !alias.scope !4
  ret void
}

; <solana_account_info::AccountInfo as core::clone::Clone>::clone
; Function Attrs: inlinehint nounwind memory(readwrite, inaccessiblemem: write)
define internal fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"(ptr dead_on_unwind noalias nocapture noundef writable writeonly align 8 dereferenceable(48) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %self) unnamed_addr #4 {
start:
  %_2 = load ptr, ptr %self, align 8, !nonnull !2, !align !11, !noundef !2
  %0 = getelementptr inbounds i8, ptr %self, i64 8
  %_12 = load ptr, ptr %0, align 8, !nonnull !2, !noundef !2
  %self.val.i = load i64, ptr %_12, align 8, !noundef !2
  %cond.i = icmp ne i64 %self.val.i, 0
  tail call void @llvm.assume(i1 %cond.i)
  %strong1.i = add i64 %self.val.i, 1
  store i64 %strong1.i, ptr %_12, align 8
  %_7.i = icmp eq i64 %strong1.i, 0
  br i1 %_7.i, label %bb4.i, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h8679e0e231284616E.exit

bb4.i:                                            ; preds = %start
  tail call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h8679e0e231284616E.exit: ; preds = %start
  %1 = getelementptr inbounds i8, ptr %self, i64 16
  %_16 = load ptr, ptr %1, align 8, !nonnull !2, !noundef !2
  %self.val.i1 = load i64, ptr %_16, align 8, !noundef !2
  %cond.i2 = icmp ne i64 %self.val.i1, 0
  tail call void @llvm.assume(i1 %cond.i2)
  %strong1.i3 = add i64 %self.val.i1, 1
  store i64 %strong1.i3, ptr %_16, align 8
  %_7.i4 = icmp eq i64 %strong1.i3, 0
  br i1 %_7.i4, label %bb4.i5, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hc6590fc8aae6103fE.exit

bb4.i5:                                           ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h8679e0e231284616E.exit
  tail call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hc6590fc8aae6103fE.exit: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h8679e0e231284616E.exit
  %2 = getelementptr inbounds i8, ptr %self, i64 24
  %_5 = load ptr, ptr %2, align 8, !nonnull !2, !align !11, !noundef !2
  %3 = getelementptr inbounds i8, ptr %self, i64 32
  %_6 = load i64, ptr %3, align 8, !noundef !2
  %4 = getelementptr inbounds i8, ptr %self, i64 40
  %5 = load i8, ptr %4, align 8, !range !12, !noundef !2
  %6 = getelementptr inbounds i8, ptr %self, i64 41
  %7 = load i8, ptr %6, align 1, !range !12, !noundef !2
  %8 = getelementptr inbounds i8, ptr %self, i64 42
  %9 = load i8, ptr %8, align 2, !range !12, !noundef !2
  store ptr %_2, ptr %_0, align 8
  %10 = getelementptr inbounds i8, ptr %_0, i64 8
  store ptr %_12, ptr %10, align 8
  %11 = getelementptr inbounds i8, ptr %_0, i64 16
  store ptr %_16, ptr %11, align 8
  %12 = getelementptr inbounds i8, ptr %_0, i64 24
  store ptr %_5, ptr %12, align 8
  %13 = getelementptr inbounds i8, ptr %_0, i64 32
  store i64 %_6, ptr %13, align 8
  %14 = getelementptr inbounds i8, ptr %_0, i64 40
  store i8 %5, ptr %14, align 8
  %15 = getelementptr inbounds i8, ptr %_0, i64 41
  store i8 %7, ptr %15, align 1
  %16 = getelementptr inbounds i8, ptr %_0, i64 42
  store i8 %9, ptr %16, align 2
  ret void
}

; <alloc::vec::Vec<T> as alloc::vec::spec_from_iter::SpecFromIter<T,I>>::from_iter
; Function Attrs: nounwind
define internal fastcc void @"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17he2ea7706e75fbc91E"(ptr dead_on_unwind noalias nocapture noundef writable writeonly align 8 dereferenceable(24) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %iterator) unnamed_addr #0 {
start:
  %_22.i.i.i = alloca [48 x i8], align 8
  %_8.i = alloca [48 x i8], align 8
  %vector.i = alloca [24 x i8], align 8
  tail call void @llvm.experimental.noalias.scope.decl(metadata !13)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %vector.i), !noalias !16
  %0 = getelementptr inbounds i8, ptr %iterator, i64 32
  %1 = load ptr, ptr %0, align 8, !alias.scope !13, !noalias !18, !noundef !2
  %2 = icmp eq ptr %1, null
  %3 = load ptr, ptr %iterator, align 8, !alias.scope !13, !noalias !18, !noundef !2
  %4 = icmp eq ptr %3, null
  br i1 %2, label %bb3.i.i, label %bb2.i.i

bb3.i.i:                                          ; preds = %start
  br i1 %4, label %bb8.i, label %bb14.i.i

bb2.i.i:                                          ; preds = %start
  %5 = getelementptr inbounds i8, ptr %iterator, i64 40
  %.val10.i.i = load ptr, ptr %5, align 8, !alias.scope !19, !noalias !22, !nonnull !2, !noundef !2
  %6 = ptrtoint ptr %.val10.i.i to i64
  %7 = ptrtoint ptr %1 to i64
  %8 = sub nuw i64 %6, %7
  br i1 %4, label %bb3.i, label %"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17hbf00049a10d98dc6E.exit.i"

bb14.i.i:                                         ; preds = %bb3.i.i
  %9 = getelementptr inbounds i8, ptr %iterator, i64 8
  %self.val6.i.i = load ptr, ptr %9, align 8, !alias.scope !19, !noalias !22, !nonnull !2, !noundef !2
  %10 = getelementptr inbounds i8, ptr %iterator, i64 24
  %self.val7.i.i = load ptr, ptr %10, align 8, !alias.scope !19, !noalias !22, !nonnull !2, !noundef !2
  %11 = ptrtoint ptr %self.val7.i.i to i64
  %12 = ptrtoint ptr %self.val6.i.i to i64
  %13 = sub nuw i64 %11, %12
  br label %bb3.i

"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17hbf00049a10d98dc6E.exit.i": ; preds = %bb2.i.i
  %14 = getelementptr inbounds i8, ptr %iterator, i64 8
  %self.val.i.i = load ptr, ptr %14, align 8, !alias.scope !19, !noalias !22, !nonnull !2, !noundef !2
  %15 = getelementptr inbounds i8, ptr %iterator, i64 24
  %self.val5.i.i = load ptr, ptr %15, align 8, !alias.scope !19, !noalias !22, !nonnull !2, !noundef !2
  %16 = ptrtoint ptr %self.val5.i.i to i64
  %17 = ptrtoint ptr %self.val.i.i to i64
  %18 = sub nuw i64 %16, %17
  %19 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %8, i64 %18)
  %_29.1.i.i = extractvalue { i64, i1 } %19, 1
  %_29.0.i.i = extractvalue { i64, i1 } %19, 0
  br i1 %_29.1.i.i, label %bb2.i, label %bb3.i

bb3.i:                                            ; preds = %"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17hbf00049a10d98dc6E.exit.i", %bb14.i.i, %bb2.i.i
  %_29.0.sink.i26.i = phi i64 [ %_29.0.i.i, %"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17hbf00049a10d98dc6E.exit.i" ], [ %8, %bb2.i.i ], [ %13, %bb14.i.i ]
  %20 = icmp eq i64 %_29.0.sink.i26.i, 0
  br i1 %20, label %bb8.i, label %bb4.i.i

bb4.i.i:                                          ; preds = %bb3.i
  %_4.i.i.i = icmp sgt i64 %_29.0.sink.i26.i, -1
  br i1 %_4.i.i.i, label %bb5.i.i.i.i, label %bb7.i

bb5.i.i.i.i:                                      ; preds = %bb4.i.i
  %21 = tail call noundef ptr @__rust_alloc(i64 noundef %_29.0.sink.i26.i, i64 noundef 1) #19, !noalias !24
  %22 = icmp eq ptr %21, null
  br i1 %22, label %bb7.i, label %bb14.i4.i

bb14.i4.i:                                        ; preds = %bb5.i.i.i.i
  %23 = ptrtoint ptr %21 to i64
  br label %bb8.i

bb2.i:                                            ; preds = %"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17hbf00049a10d98dc6E.exit.i"
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_8.i), !noalias !16
  store ptr @alloc_e760b8a82485eab475ddc4c0d696a7ac, ptr %_8.i, align 8, !noalias !16
  %24 = getelementptr inbounds i8, ptr %_8.i, i64 8
  store i64 1, ptr %24, align 8, !noalias !16
  %25 = getelementptr inbounds i8, ptr %_8.i, i64 32
  store ptr null, ptr %25, align 8, !noalias !16
  %26 = getelementptr inbounds i8, ptr %_8.i, i64 16
  store ptr inttoptr (i64 8 to ptr), ptr %26, align 8, !noalias !16
  %27 = getelementptr inbounds i8, ptr %_8.i, i64 24
  store i64 0, ptr %27, align 8, !noalias !16
; call core::panicking::panic_fmt
  call void @_ZN4core9panicking9panic_fmt17h0f7a5cdbeae7e874E(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(48) %_8.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_9c83b52252c910a197dd2a3d1d5a127e) #20, !noalias !16
  unreachable

bb8.i:                                            ; preds = %bb14.i4.i, %bb3.i, %bb3.i.i
  %_15.sroa.4.0.ph.i = phi i64 [ 0, %bb3.i ], [ %_29.0.sink.i26.i, %bb14.i4.i ], [ 0, %bb3.i.i ]
  %_15.sroa.10.0.ph.i = phi i64 [ 1, %bb3.i ], [ %23, %bb14.i4.i ], [ 1, %bb3.i.i ]
  %28 = inttoptr i64 %_15.sroa.10.0.ph.i to ptr
  store i64 %_15.sroa.4.0.ph.i, ptr %vector.i, align 8, !noalias !16
  %29 = getelementptr inbounds i8, ptr %vector.i, i64 8
  store ptr %28, ptr %29, align 8, !noalias !16
  %30 = getelementptr inbounds i8, ptr %vector.i, i64 16
  store i64 0, ptr %30, align 8, !noalias !16
  %_12.sroa.4.0.iterator.sroa_idx.i = getelementptr inbounds i8, ptr %iterator, i64 8
  %_12.sroa.4.0.copyload.i = load ptr, ptr %_12.sroa.4.0.iterator.sroa_idx.i, align 8, !alias.scope !13, !noalias !18
  %_12.sroa.7.0.iterator.sroa_idx.i = getelementptr inbounds i8, ptr %iterator, i64 16
  %_12.sroa.7.0.copyload.i = load i64, ptr %_12.sroa.7.0.iterator.sroa_idx.i, align 8, !alias.scope !13, !noalias !18
  %_12.sroa.8.0.iterator.sroa_idx.i = getelementptr inbounds i8, ptr %iterator, i64 24
  %_12.sroa.8.0.copyload.i = load ptr, ptr %_12.sroa.8.0.iterator.sroa_idx.i, align 8, !alias.scope !13, !noalias !18
  %_12.sroa.12.0.iterator.sroa_idx.i = getelementptr inbounds i8, ptr %iterator, i64 40
  %_12.sroa.12.0.copyload.i = load ptr, ptr %_12.sroa.12.0.iterator.sroa_idx.i, align 8, !alias.scope !13, !noalias !18
  tail call void @llvm.experimental.noalias.scope.decl(metadata !27)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !30)
  br i1 %2, label %bb3.i.i.i.i, label %bb2.i.i.i.i

bb3.i.i.i.i:                                      ; preds = %bb8.i
  br i1 %4, label %bb8.i.i.i.i.i, label %bb14.i.i.i.i

bb2.i.i.i.i:                                      ; preds = %bb8.i
  %31 = icmp ne ptr %_12.sroa.12.0.copyload.i, null
  tail call void @llvm.assume(i1 %31)
  %32 = ptrtoint ptr %_12.sroa.12.0.copyload.i to i64
  %33 = ptrtoint ptr %1 to i64
  %34 = sub nuw i64 %32, %33
  br i1 %4, label %bb2.i.i.i, label %"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17hbf00049a10d98dc6E.exit.i.i.i"

bb14.i.i.i.i:                                     ; preds = %bb3.i.i.i.i
  %35 = icmp ne ptr %_12.sroa.4.0.copyload.i, null
  tail call void @llvm.assume(i1 %35)
  %36 = icmp ne ptr %_12.sroa.8.0.copyload.i, null
  tail call void @llvm.assume(i1 %36)
  %37 = ptrtoint ptr %_12.sroa.8.0.copyload.i to i64
  %38 = ptrtoint ptr %_12.sroa.4.0.copyload.i to i64
  %39 = sub nuw i64 %37, %38
  br label %bb2.i.i.i

"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17hbf00049a10d98dc6E.exit.i.i.i": ; preds = %bb2.i.i.i.i
  %40 = icmp ne ptr %_12.sroa.4.0.copyload.i, null
  tail call void @llvm.assume(i1 %40)
  %41 = icmp ne ptr %_12.sroa.8.0.copyload.i, null
  tail call void @llvm.assume(i1 %41)
  %42 = ptrtoint ptr %_12.sroa.8.0.copyload.i to i64
  %43 = ptrtoint ptr %_12.sroa.4.0.copyload.i to i64
  %44 = sub nuw i64 %42, %43
  %45 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %34, i64 %44)
  %_29.1.i.i.i.i = extractvalue { i64, i1 } %45, 1
  %_29.0.i.i.i.i = extractvalue { i64, i1 } %45, 0
  br i1 %_29.1.i.i.i.i, label %bb5.i.i.i, label %bb2.i.i.i

bb2.i.i.i:                                        ; preds = %"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17hbf00049a10d98dc6E.exit.i.i.i", %bb14.i.i.i.i, %bb2.i.i.i.i
  %_29.0.sink.i8.i.i.i = phi i64 [ %_29.0.i.i.i.i, %"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17hbf00049a10d98dc6E.exit.i.i.i" ], [ %34, %bb2.i.i.i.i ], [ %39, %bb14.i.i.i.i ]
  %_5.i.i.i.i = icmp ult i64 %_15.sroa.4.0.ph.i, %_29.0.sink.i8.i.i.i
  br i1 %_5.i.i.i.i, label %bb1.i.i.i.i, label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h85fa6fde94103678E.exit.i.i.i"

bb1.i.i.i.i:                                      ; preds = %bb2.i.i.i
; call alloc::raw_vec::RawVec<T,A>::reserve::do_reserve_and_handle
  call fastcc void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h721ba3b6601c4b82E"(ptr noalias noundef nonnull align 8 dereferenceable(16) %vector.i, i64 noundef 0, i64 noundef %_29.0.sink.i8.i.i.i) #19, !noalias !33
  %_29.pre.i.i.i = load i64, ptr %30, align 8, !alias.scope !36, !noalias !33
  %self1.i.i.pre.i = load ptr, ptr %29, align 8, !alias.scope !36, !noalias !33
  br label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h85fa6fde94103678E.exit.i.i.i"

"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h85fa6fde94103678E.exit.i.i.i": ; preds = %bb1.i.i.i.i, %bb2.i.i.i
  %self1.i.i.i = phi ptr [ %28, %bb2.i.i.i ], [ %self1.i.i.pre.i, %bb1.i.i.i.i ]
  %_29.i.i.i = phi i64 [ 0, %bb2.i.i.i ], [ %_29.pre.i.i.i, %bb1.i.i.i.i ]
  br i1 %2, label %bb3.i.i.i.i.i, label %bb1.i.i.i.i.i

bb1.i.i.i.i.i:                                    ; preds = %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h85fa6fde94103678E.exit.i.i.i"
  %46 = icmp ne ptr %_12.sroa.12.0.copyload.i, null
  tail call void @llvm.assume(i1 %46)
  %47 = icmp eq ptr %1, %_12.sroa.12.0.copyload.i
  br i1 %47, label %bb3.i.i.i.i.i, label %bb5.i.i.i.i.i.i.i

bb5.i.i.i.i.i.i.i:                                ; preds = %bb1.i.i.i.i.i
  %48 = ptrtoint ptr %_12.sroa.12.0.copyload.i to i64
  %49 = ptrtoint ptr %1 to i64
  %50 = sub nuw i64 %48, %49
  br label %bb9.i.i.i.i.i.i.i

bb9.i.i.i.i.i.i.i:                                ; preds = %bb9.i.i.i.i.i.i.i, %bb5.i.i.i.i.i.i.i
  %51 = phi i64 [ %_29.i.i.i, %bb5.i.i.i.i.i.i.i ], [ %52, %bb9.i.i.i.i.i.i.i ]
  %i.sroa.0.0.i.i.i.i.i.i.i = phi i64 [ 0, %bb5.i.i.i.i.i.i.i ], [ %_32.i.i.i.i.i.i.i, %bb9.i.i.i.i.i.i.i ]
  %_47.i.i.i.i.i.i.i = getelementptr inbounds i8, ptr %1, i64 %i.sroa.0.0.i.i.i.i.i.i.i
  %_47.val.i.i.i.i.i.i.i = load i8, ptr %_47.i.i.i.i.i.i.i, align 1, !noalias !37, !noundef !2
  %dst.i.i.i.i.i.i.i.i.i.i.i = getelementptr inbounds i8, ptr %self1.i.i.i, i64 %51
  store i8 %_47.val.i.i.i.i.i.i.i, ptr %dst.i.i.i.i.i.i.i.i.i.i.i, align 1, !noalias !48
  %52 = add i64 %51, 1
  %_32.i.i.i.i.i.i.i = add nuw i64 %i.sroa.0.0.i.i.i.i.i.i.i, 1
  %_34.i.i.i.i.i.i.i = icmp eq i64 %_32.i.i.i.i.i.i.i, %50
  br i1 %_34.i.i.i.i.i.i.i, label %bb3.i.i.i.i.i, label %bb9.i.i.i.i.i.i.i

bb3.i.i.i.i.i:                                    ; preds = %bb9.i.i.i.i.i.i.i, %bb1.i.i.i.i.i, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h85fa6fde94103678E.exit.i.i.i"
  %_4.sroa.5.0.i.i.i.i = phi i64 [ %_29.i.i.i, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h85fa6fde94103678E.exit.i.i.i" ], [ %_29.i.i.i, %bb1.i.i.i.i.i ], [ %52, %bb9.i.i.i.i.i.i.i ]
  br i1 %4, label %bb8.i.i.i.i.i, label %bb4.i.i.i.i.i

bb4.i.i.i.i.i:                                    ; preds = %bb3.i.i.i.i.i
  %53 = icmp ne ptr %_12.sroa.8.0.copyload.i, null
  tail call void @llvm.assume(i1 %53)
  %_11.i.not8.i.i.i.i.i.i = icmp eq ptr %_12.sroa.4.0.copyload.i, %_12.sroa.8.0.copyload.i
  br i1 %_11.i.not8.i.i.i.i.i.i, label %bb5.i.i.i.i.i.i, label %bb3.i.i.i.i.i.i

bb3.i.i.i.i.i.i:                                  ; preds = %bb4.i.i.i.i.i, %bb3.i.i.i.i.i.i
  %54 = phi i64 [ %55, %bb3.i.i.i.i.i.i ], [ %_4.sroa.5.0.i.i.i.i, %bb4.i.i.i.i.i ]
  %_31.i79.i.i.i.i.i.i = phi ptr [ %_31.i.i.i.i.i.i.i, %bb3.i.i.i.i.i.i ], [ %_12.sroa.4.0.copyload.i, %bb4.i.i.i.i.i ]
  %_31.i.i.i.i.i.i.i = getelementptr inbounds i8, ptr %_31.i79.i.i.i.i.i.i, i64 1
  %_19.i.i.i.i.i.i.i = load i8, ptr %_31.i79.i.i.i.i.i.i, align 1, !noalias !53, !noundef !2
  %dst.i.i.i.i.i.i.i.i = getelementptr inbounds i8, ptr %self1.i.i.i, i64 %54
  store i8 %_19.i.i.i.i.i.i.i, ptr %dst.i.i.i.i.i.i.i.i, align 1, !noalias !59
  %55 = add i64 %54, 1
  %_11.i.not.i.i.i.i.i.i = icmp eq ptr %_31.i.i.i.i.i.i.i, %_12.sroa.8.0.copyload.i
  br i1 %_11.i.not.i.i.i.i.i.i, label %bb5.i.i.i.i.i.i, label %bb3.i.i.i.i.i.i

bb5.i.i.i.i.i.i:                                  ; preds = %bb3.i.i.i.i.i.i, %bb4.i.i.i.i.i
  %f.val1.i.i.i.i.i.i = phi i64 [ %_4.sroa.5.0.i.i.i.i, %bb4.i.i.i.i.i ], [ %55, %bb3.i.i.i.i.i.i ]
  store i64 %f.val1.i.i.i.i.i.i, ptr %30, align 8, !alias.scope !36, !noalias !64
  %56 = icmp eq i64 %_12.sroa.7.0.copyload.i, 0
  br i1 %56, label %"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17had8fd9fc89eded6aE.exit", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i.i.i.i.i": ; preds = %bb5.i.i.i.i.i.i
  tail call void @__rust_dealloc(ptr noundef nonnull %3, i64 noundef %_12.sroa.7.0.copyload.i, i64 noundef 1) #19, !noalias !65
  br label %"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17had8fd9fc89eded6aE.exit"

bb8.i.i.i.i.i:                                    ; preds = %bb3.i.i.i.i.i, %bb3.i.i.i.i
  %_4.sroa.5.0.i32.i.i.i = phi i64 [ %_4.sroa.5.0.i.i.i.i, %bb3.i.i.i.i.i ], [ 0, %bb3.i.i.i.i ]
  store i64 %_4.sroa.5.0.i32.i.i.i, ptr %30, align 8, !alias.scope !36, !noalias !68
  br label %"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17had8fd9fc89eded6aE.exit"

bb5.i.i.i:                                        ; preds = %"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17hbf00049a10d98dc6E.exit.i.i.i"
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_22.i.i.i), !noalias !69
  store ptr @alloc_e760b8a82485eab475ddc4c0d696a7ac, ptr %_22.i.i.i, align 8, !noalias !69
  %57 = getelementptr inbounds i8, ptr %_22.i.i.i, i64 8
  store i64 1, ptr %57, align 8, !noalias !69
  %58 = getelementptr inbounds i8, ptr %_22.i.i.i, i64 32
  store ptr null, ptr %58, align 8, !noalias !69
  %59 = getelementptr inbounds i8, ptr %_22.i.i.i, i64 16
  store ptr inttoptr (i64 8 to ptr), ptr %59, align 8, !noalias !69
  %60 = getelementptr inbounds i8, ptr %_22.i.i.i, i64 24
  store i64 0, ptr %60, align 8, !noalias !69
; call core::panicking::panic_fmt
  call void @_ZN4core9panicking9panic_fmt17h0f7a5cdbeae7e874E(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(48) %_22.i.i.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_21fb3a4531199f65e9b4751b9e3816cb) #20, !noalias !69
  unreachable

bb7.i:                                            ; preds = %bb5.i.i.i.i, %bb4.i.i
  %_15.sroa.4.0.i = phi i64 [ 0, %bb4.i.i ], [ 1, %bb5.i.i.i.i ]
; call alloc::raw_vec::handle_error
  tail call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef %_15.sroa.4.0.i, i64 %_29.0.sink.i26.i) #20, !noalias !16
  unreachable

"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17had8fd9fc89eded6aE.exit": ; preds = %bb5.i.i.i.i.i.i, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i.i.i.i.i", %bb8.i.i.i.i.i
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_0, ptr noundef nonnull align 8 dereferenceable(24) %vector.i, i64 24, i1 false), !noalias !13
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %vector.i), !noalias !16
  ret void
}

; base::execute
; Function Attrs: nounwind
define hidden { i64, ptr } @_ZN4base7execute17he9242003e380d292E(ptr noalias nocapture noundef readonly align 8 dereferenceable(40) %ctx) unnamed_addr #0 {
start:
  %_21.i = alloca [24 x i8], align 8
  %val.sroa.3.i = alloca [120 x i8], align 8
  %val.sroa.5.i = alloca [36 x i8], align 4
  %_9.i = alloca [176 x i8], align 8
  %_5.i28 = alloca [24 x i8], align 8
  %data.i = alloca [16 x i8], align 8
  %_180 = alloca [24 x i8], align 8
  %_106 = alloca [1 x i8], align 1
  %_102 = alloca [32 x i8], align 8
  %_99 = alloca [16 x i8], align 8
  %_96 = alloca [48 x i8], align 8
  %_92 = alloca [24 x i8], align 8
  %_84 = alloca [24 x i8], align 8
  %_81 = alloca [32 x i8], align 1
  %ix = alloca [80 x i8], align 8
  %_76 = alloca [48 x i8], align 8
  %ix_data = alloca [24 x i8], align 8
  %inner_data = alloca [24 x i8], align 8
  %authority_info = alloca [48 x i8], align 8
  %_67 = alloca [24 x i8], align 8
  %_65 = alloca [16 x i8], align 8
  %_59 = alloca [32 x i8], align 1
  %_57 = alloca [32 x i8], align 1
  %_56 = alloca [32 x i8], align 1
  %_54 = alloca [48 x i8], align 8
  %event = alloca [128 x i8], align 8
  %_47 = alloca [16 x i8], align 8
  %_44 = alloca [48 x i8], align 8
  %_28 = alloca [96 x i8], align 8
  %bump = alloca [1 x i8], align 1
  %index = alloca [2 x i8], align 2
  %_16 = alloca [16 x i8], align 8
  %_7 = alloca [32 x i8], align 8
  %_4 = alloca [33 x i8], align 1
  %authority = alloca [32 x i8], align 1
  %creator = alloca [32 x i8], align 1
  %0 = getelementptr inbounds i8, ptr %ctx, i64 8
  %a = load ptr, ptr %0, align 8, !nonnull !2, !align !70, !noundef !2
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %creator)
  %1 = getelementptr inbounds i8, ptr %a, i64 16
  %_153 = load ptr, ptr %1, align 8, !nonnull !2, !align !70, !noundef !2
  %_154 = load ptr, ptr %_153, align 8, !nonnull !2, !align !11, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %creator, ptr noundef nonnull align 1 dereferenceable(32) %_154, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %authority)
  call void @llvm.lifetime.start.p0(i64 33, ptr nonnull %_4)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_7)
  %_109 = load ptr, ptr %a, align 8, !nonnull !2, !align !70, !noundef !2
  %_155 = getelementptr inbounds i8, ptr %_109, i64 40
  store ptr @alloc_837d2dfc2ca6132d7e624d246f381ca4, ptr %_7, align 8
  %2 = getelementptr inbounds i8, ptr %_7, i64 8
  store i64 14, ptr %2, align 8
  %3 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_7, i64 0, i64 1
  store ptr %_155, ptr %3, align 8
  %4 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_7, i64 0, i64 1, i32 1
  store i64 32, ptr %4, align 8
; call solana_pubkey::Pubkey::find_program_address
  call void @_ZN13solana_pubkey6Pubkey20find_program_address17h5c8eecf7b7496a06E(ptr noalias nocapture noundef nonnull sret([33 x i8]) align 1 dereferenceable(33) %_4, ptr noalias noundef nonnull readonly align 8 %_7, i64 noundef 2, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) @_ZN18pump_amm_recovered4pump2ID17he4e01eb591eb9fd8E) #19
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %authority, ptr noundef nonnull align 1 dereferenceable(32) %_4, i64 32, i1 false)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_7)
  call void @llvm.lifetime.end.p0(i64 33, ptr nonnull %_4)
  %5 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %creator, ptr noundef nonnull dereferenceable(32) %authority, i64 32)
  %6 = icmp ne i32 %5, 0
  %_110 = load ptr, ptr %a, align 8, !nonnull !2, !align !70, !noundef !2
  %_12 = getelementptr inbounds i8, ptr %_110, i64 8
; call pump_amm_recovered::state::pool::<impl pump_amm_recovered::state::Pool>::can_boost
  %can_boost = call noundef zeroext i1 @"_ZN18pump_amm_recovered5state4pool49_$LT$impl$u20$pump_amm_recovered..state..Pool$GT$9can_boost17h0c832e039775c349E"(ptr noalias noundef nonnull readonly align 8 dereferenceable(280) %_12) #19
  %brmerge = or i1 %6, %can_boost
  br i1 %brmerge, label %bb34, label %bb4

bb4:                                              ; preds = %start
  %7 = getelementptr inbounds i8, ptr %a, i64 8
  %_111 = load ptr, ptr %7, align 8, !nonnull !2, !align !70, !noundef !2
  %8 = getelementptr inbounds i8, ptr %_111, i64 947
  %9 = load i8, ptr %8, align 1, !range !12, !noundef !2
  %_13.not = icmp eq i8 %9, 0
  br i1 %_13.not, label %bb34, label %bb6

bb6:                                              ; preds = %bb4
  %10 = getelementptr inbounds i8, ptr %a, i64 48
  %_112 = load ptr, ptr %10, align 8, !nonnull !2, !align !70, !noundef !2
  %11 = getelementptr inbounds i8, ptr %_112, i64 104
  %q = load i64, ptr %11, align 8, !noundef !2
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_16)
  %12 = getelementptr inbounds i8, ptr %a, i64 40
  %_113 = load ptr, ptr %12, align 8, !nonnull !2, !align !70, !noundef !2
  %13 = getelementptr inbounds i8, ptr %_113, i64 104
  %_17 = load i64, ptr %13, align 8, !noundef !2
; call pump_amm_recovered::instructions::boost::calculate_virtual_quote_reserves
  call void @_ZN18pump_amm_recovered12instructions5boost32calculate_virtual_quote_reserves17h1995da5b3ccf08fcE(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_16, i64 noundef %_17, i64 noundef %q) #19
  %14 = load i64, ptr %_16, align 8, !range !71, !noundef !2
  %15 = icmp eq i64 %14, 2
  %16 = getelementptr inbounds i8, ptr %_16, i64 8
  br i1 %15, label %bb38, label %bb37

bb38:                                             ; preds = %bb6
  %_159 = load i64, ptr %16, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_16)
  %17 = icmp eq i64 %_159, 0
  %_20 = icmp uge i64 %_159, %q
  %or.cond = or i1 %17, %_20
  br i1 %or.cond, label %bb34, label %bb11

bb37:                                             ; preds = %bb6
  %_160.1 = load ptr, ptr %16, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_16)
  br label %bb34

bb11:                                             ; preds = %bb38
  call void @llvm.lifetime.start.p0(i64 2, ptr nonnull %index)
  %_114 = load ptr, ptr %a, align 8, !nonnull !2, !align !70, !noundef !2
  %18 = getelementptr inbounds i8, ptr %_114, i64 280
  %_23 = load i16, ptr %18, align 8, !noundef !2
  store i16 %_23, ptr %index, align 2
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %bump)
  %19 = getelementptr inbounds i8, ptr %_114, i64 282
  %_25 = load i8, ptr %19, align 2, !noundef !2
  store i8 %_25, ptr %bump, align 1
  call void @llvm.lifetime.start.p0(i64 96, ptr nonnull %_28)
  %_163 = getelementptr inbounds i8, ptr %_114, i64 8
  %_164 = getelementptr inbounds i8, ptr %_114, i64 40
  %_165 = getelementptr inbounds i8, ptr %_114, i64 72
  store ptr @alloc_bfc098cb63b041e1e9ec31a95db422e0, ptr %_28, align 8
  %20 = getelementptr inbounds i8, ptr %_28, i64 8
  store i64 4, ptr %20, align 8
  %21 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_28, i64 0, i64 1
  store ptr %index, ptr %21, align 8
  %22 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_28, i64 0, i64 1, i32 1
  store i64 2, ptr %22, align 8
  %23 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_28, i64 0, i64 2
  store ptr %_163, ptr %23, align 8
  %24 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_28, i64 0, i64 2, i32 1
  store i64 32, ptr %24, align 8
  %25 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_28, i64 0, i64 3
  store ptr %_164, ptr %25, align 8
  %26 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_28, i64 0, i64 3, i32 1
  store i64 32, ptr %26, align 8
  %27 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_28, i64 0, i64 4
  store ptr %_165, ptr %27, align 8
  %28 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_28, i64 0, i64 4, i32 1
  store i64 32, ptr %28, align 8
  %29 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_28, i64 0, i64 5
  store ptr %bump, ptr %29, align 8
  %30 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_28, i64 0, i64 5, i32 1
  store i64 1, ptr %30, align 8
  %31 = getelementptr inbounds i8, ptr %a, i64 72
  %_39 = load ptr, ptr %31, align 8, !nonnull !2, !align !70, !noundef !2
  %32 = getelementptr inbounds i8, ptr %a, i64 32
  %_119 = load ptr, ptr %32, align 8, !nonnull !2, !align !70, !noundef !2
  %_120 = load ptr, ptr %10, align 8, !nonnull !2, !align !70, !noundef !2
  %33 = getelementptr inbounds i8, ptr %a, i64 64
  %_121 = load ptr, ptr %33, align 8, !nonnull !2, !align !70, !noundef !2
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_44)
  %_166 = load ptr, ptr %_114, align 8, !nonnull !2, !align !70, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !72)
  call void @llvm.experimental.noalias.scope.decl(metadata !75)
  %_2.i = load ptr, ptr %_166, align 8, !alias.scope !75, !noalias !72, !nonnull !2, !align !11, !noundef !2
  %34 = getelementptr inbounds i8, ptr %_166, i64 8
  %_12.i = load ptr, ptr %34, align 8, !alias.scope !75, !noalias !72, !nonnull !2, !noundef !2
  %self.val.i.i = load i64, ptr %_12.i, align 8, !noalias !77, !noundef !2
  %cond.i.i = icmp ne i64 %self.val.i.i, 0
  call void @llvm.assume(i1 %cond.i.i)
  %strong1.i.i = add i64 %self.val.i.i, 1
  store i64 %strong1.i.i, ptr %_12.i, align 8, !noalias !77
  %_7.i.i = icmp eq i64 %strong1.i.i, 0
  br i1 %_7.i.i, label %bb4.i.i, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h8679e0e231284616E.exit.i

bb4.i.i:                                          ; preds = %bb11
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h8679e0e231284616E.exit.i: ; preds = %bb11
  %35 = getelementptr inbounds i8, ptr %_166, i64 16
  %_16.i = load ptr, ptr %35, align 8, !alias.scope !75, !noalias !72, !nonnull !2, !noundef !2
  %self.val.i1.i = load i64, ptr %_16.i, align 8, !noalias !77, !noundef !2
  %cond.i2.i = icmp ne i64 %self.val.i1.i, 0
  call void @llvm.assume(i1 %cond.i2.i)
  %strong1.i3.i = add i64 %self.val.i1.i, 1
  store i64 %strong1.i3.i, ptr %_16.i, align 8, !noalias !77
  %_7.i4.i = icmp eq i64 %strong1.i3.i, 0
  br i1 %_7.i4.i, label %bb4.i5.i, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit"

bb4.i5.i:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h8679e0e231284616E.exit.i
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17h8679e0e231284616E.exit.i
  %36 = getelementptr inbounds i8, ptr %_166, i64 24
  %_5.i = load ptr, ptr %36, align 8, !alias.scope !75, !noalias !72, !nonnull !2, !align !11, !noundef !2
  %37 = getelementptr inbounds i8, ptr %_166, i64 32
  %_6.i = load i64, ptr %37, align 8, !alias.scope !75, !noalias !72, !noundef !2
  %38 = getelementptr inbounds i8, ptr %_166, i64 40
  %39 = load i8, ptr %38, align 8, !range !12, !alias.scope !75, !noalias !72, !noundef !2
  %40 = getelementptr inbounds i8, ptr %_166, i64 41
  %41 = load i8, ptr %40, align 1, !range !12, !alias.scope !75, !noalias !72, !noundef !2
  %42 = getelementptr inbounds i8, ptr %_166, i64 42
  %43 = load i8, ptr %42, align 2, !range !12, !alias.scope !75, !noalias !72, !noundef !2
  store ptr %_2.i, ptr %_44, align 8, !alias.scope !72, !noalias !75
  %44 = getelementptr inbounds i8, ptr %_44, i64 8
  store ptr %_12.i, ptr %44, align 8, !alias.scope !72, !noalias !75
  %45 = getelementptr inbounds i8, ptr %_44, i64 16
  store ptr %_16.i, ptr %45, align 8, !alias.scope !72, !noalias !75
  %46 = getelementptr inbounds i8, ptr %_44, i64 24
  store ptr %_5.i, ptr %46, align 8, !alias.scope !72, !noalias !75
  %47 = getelementptr inbounds i8, ptr %_44, i64 32
  store i64 %_6.i, ptr %47, align 8, !alias.scope !72, !noalias !75
  %48 = getelementptr inbounds i8, ptr %_44, i64 40
  store i8 %39, ptr %48, align 8, !alias.scope !72, !noalias !75
  %49 = getelementptr inbounds i8, ptr %_44, i64 41
  store i8 %41, ptr %49, align 1, !alias.scope !72, !noalias !75
  %50 = getelementptr inbounds i8, ptr %_44, i64 42
  store i8 %43, ptr %50, align 2, !alias.scope !72, !noalias !75
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_47)
  store ptr %_28, ptr %_47, align 8
  %51 = getelementptr inbounds i8, ptr %_47, i64 8
  store i64 6, ptr %51, align 8
; call pump_amm_recovered::utils::token::transfer_checked
  %52 = call { i64, ptr } @_ZN18pump_amm_recovered5utils5token16transfer_checked17h68c2296e64024d0aE(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_39, ptr noalias noundef nonnull readonly align 8 dereferenceable(128) %_119, ptr noalias noundef nonnull readonly align 8 dereferenceable(216) %_120, ptr noalias noundef nonnull readonly align 8 dereferenceable(216) %_121, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_44, i64 noundef %_159, ptr noalias noundef nonnull readonly align 8 %_47, i64 noundef 1) #19
  %53 = extractvalue { i64, ptr } %52, 0
  %54 = icmp eq i64 %53, 2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_47)
  %self1.val.i.i.i = load i64, ptr %_12.i, align 8, !noundef !2
  %val.i.i.i = add i64 %self1.val.i.i.i, -1
  store i64 %val.i.i.i, ptr %_12.i, align 8
  %55 = icmp eq i64 %val.i.i.i, 0
  br i1 %55, label %bb1.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h6b0177af4d3a7204E.exit.i"

bb1.i.i.i:                                        ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit"
  %56 = getelementptr i8, ptr %_12.i, i64 8
  %self2.val.i.i.i = load i64, ptr %56, align 8, !noundef !2
  %val6.i.i.i = add i64 %self2.val.i.i.i, -1
  store i64 %val6.i.i.i, ptr %56, align 8
  %57 = icmp eq i64 %val6.i.i.i, 0
  br i1 %57, label %bb3.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h6b0177af4d3a7204E.exit.i"

bb3.i.i.i:                                        ; preds = %bb1.i.i.i
  call void @__rust_dealloc(ptr noundef nonnull %_12.i, i64 noundef 32, i64 noundef 8) #19
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h6b0177af4d3a7204E.exit.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h6b0177af4d3a7204E.exit.i": ; preds = %bb3.i.i.i, %bb1.i.i.i, %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit"
  %self1.val.i.i2.i = load i64, ptr %_16.i, align 8, !noundef !2
  %val.i.i3.i = add i64 %self1.val.i.i2.i, -1
  store i64 %val.i.i3.i, ptr %_16.i, align 8
  %58 = icmp eq i64 %val.i.i3.i, 0
  br i1 %58, label %bb1.i.i4.i, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h943e945399c8a536E.exit"

bb1.i.i4.i:                                       ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h6b0177af4d3a7204E.exit.i"
  %59 = getelementptr i8, ptr %_16.i, i64 8
  %self2.val.i.i5.i = load i64, ptr %59, align 8, !noundef !2
  %val6.i.i6.i = add i64 %self2.val.i.i5.i, -1
  store i64 %val6.i.i6.i, ptr %59, align 8
  %60 = icmp eq i64 %val6.i.i6.i, 0
  br i1 %60, label %bb3.i.i7.i, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h943e945399c8a536E.exit"

bb3.i.i7.i:                                       ; preds = %bb1.i.i4.i
  call void @__rust_dealloc(ptr noundef nonnull %_16.i, i64 noundef 40, i64 noundef 8) #19
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h943e945399c8a536E.exit"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h943e945399c8a536E.exit": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h6b0177af4d3a7204E.exit.i", %bb1.i.i4.i, %bb3.i.i7.i
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_44)
  br i1 %54, label %bb41, label %bb32

bb41:                                             ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h943e945399c8a536E.exit"
  %_123 = load ptr, ptr %a, align 8, !nonnull !2, !align !70, !noundef !2
  %61 = getelementptr inbounds i8, ptr %_123, i64 232
  %62 = zext i64 %_159 to i128
  store i128 %62, ptr %61, align 8
  %_124 = load ptr, ptr %10, align 8, !nonnull !2, !align !70, !noundef !2
  %_171 = getelementptr inbounds i8, ptr %_124, i64 32
  call void @llvm.experimental.noalias.scope.decl(metadata !78)
  call void @llvm.lifetime.start.p0(i64 120, ptr nonnull %val.sroa.3.i)
  call void @llvm.lifetime.start.p0(i64 36, ptr nonnull %val.sroa.5.i)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %data.i), !noalias !78
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_5.i28), !noalias !78
  %_13.i = load ptr, ptr %_171, align 8, !alias.scope !78, !nonnull !2, !align !70, !noundef !2
; call solana_account_info::AccountInfo::try_borrow_data
  call void @_ZN19solana_account_info11AccountInfo15try_borrow_data17h59f29d158b311ea0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_5.i28, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_13.i) #19, !noalias !78
  %63 = load i64, ptr %_5.i28, align 8, !range !81, !noalias !78, !noundef !2
  %64 = icmp eq i64 %63, -9223372036854775782
  %65 = getelementptr inbounds i8, ptr %_5.i28, i64 8
  %_16.0.i = load ptr, ptr %65, align 8, !noalias !78
  %66 = getelementptr inbounds i8, ptr %_5.i28, i64 16
  %_16.1.i = load ptr, ptr %66, align 8, !noalias !78
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_5.i28), !noalias !78
  br i1 %64, label %bb9.i, label %bb8.i

bb9.i:                                            ; preds = %bb41
  %_14.0.i = load ptr, ptr %_16.0.i, align 8, !noalias !78, !nonnull !2, !align !11, !noundef !2
  %67 = getelementptr inbounds i8, ptr %_16.0.i, i64 8
  %_14.1.i = load i64, ptr %67, align 8, !noalias !78, !noundef !2
  store ptr %_14.0.i, ptr %data.i, align 8, !noalias !78
  %68 = getelementptr inbounds i8, ptr %data.i, i64 8
  store i64 %_14.1.i, ptr %68, align 8, !noalias !78
  call void @llvm.lifetime.start.p0(i64 176, ptr nonnull %_9.i), !noalias !78
; call <anchor_spl::token_interface::TokenAccount as anchor_lang::AccountDeserialize>::try_deserialize_unchecked
  call void @"_ZN93_$LT$anchor_spl..token_interface..TokenAccount$u20$as$u20$anchor_lang..AccountDeserialize$GT$25try_deserialize_unchecked17hdff8c46343ab1a4eE"(ptr noalias nocapture noundef nonnull sret([176 x i8]) align 8 dereferenceable(176) %_9.i, ptr noalias noundef nonnull align 8 dereferenceable(16) %data.i) #19, !noalias !78
  %69 = getelementptr inbounds i8, ptr %_9.i, i64 136
  %70 = load i32, ptr %69, align 8, !range !82, !noalias !78, !noundef !2
  %71 = icmp eq i32 %70, 2
  %_25.0.i = load i64, ptr %_9.i, align 8, !noalias !78
  %72 = getelementptr inbounds i8, ptr %_9.i, i64 8
  %_25.1.i = load ptr, ptr %72, align 8, !noalias !78
  br i1 %71, label %bb11.i, label %"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1f82827fb906f3b1E.exit.thread"

bb8.i:                                            ; preds = %bb41
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_21.i), !noalias !78
  store i64 %63, ptr %_21.i, align 8, !noalias !78
  %residual.sroa.2.0._21.sroa_idx.i = getelementptr inbounds i8, ptr %_21.i, i64 8
  store ptr %_16.0.i, ptr %residual.sroa.2.0._21.sroa_idx.i, align 8, !noalias !78
  %residual.sroa.3.0._21.sroa_idx.i = getelementptr inbounds i8, ptr %_21.i, i64 16
  store ptr %_16.1.i, ptr %residual.sroa.3.0._21.sroa_idx.i, align 8, !noalias !78
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %73 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17h2734901f082d5dd2E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_21.i) #19, !noalias !78
  %_22.0.i = extractvalue { i64, ptr } %73, 0
  %_22.1.i = extractvalue { i64, ptr } %73, 1
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_21.i), !noalias !78
  br label %"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1f82827fb906f3b1E.exit"

"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1f82827fb906f3b1E.exit.thread": ; preds = %bb9.i
  %_24.sroa.6.0._9.sroa_idx.i = getelementptr inbounds i8, ptr %_9.i, i64 16
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(120) %val.sroa.3.i, ptr noundef nonnull align 8 dereferenceable(120) %_24.sroa.6.0._9.sroa_idx.i, i64 120, i1 false), !noalias !78
  %_24.sroa.8.0._9.sroa_idx.i = getelementptr inbounds i8, ptr %_9.i, i64 140
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 4 dereferenceable(36) %val.sroa.5.i, ptr noundef nonnull align 4 dereferenceable(36) %_24.sroa.8.0._9.sroa_idx.i, i64 36, i1 false), !noalias !78
  call void @llvm.lifetime.end.p0(i64 176, ptr nonnull %_9.i), !noalias !78
  %74 = getelementptr inbounds i8, ptr %_124, i64 40
  store i64 %_25.0.i, ptr %74, align 8, !alias.scope !78
  %val.sroa.2.0..sroa_idx.i = getelementptr inbounds i8, ptr %_124, i64 48
  store ptr %_25.1.i, ptr %val.sroa.2.0..sroa_idx.i, align 8, !alias.scope !78
  %val.sroa.3.0..sroa_idx.i = getelementptr inbounds i8, ptr %_124, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(120) %val.sroa.3.0..sroa_idx.i, ptr noundef nonnull align 8 dereferenceable(120) %val.sroa.3.i, i64 120, i1 false)
  %val.sroa.4.0..sroa_idx.i = getelementptr inbounds i8, ptr %_124, i64 176
  store i32 %70, ptr %val.sroa.4.0..sroa_idx.i, align 8, !alias.scope !78
  %val.sroa.5.0..sroa_idx.i = getelementptr inbounds i8, ptr %_124, i64 180
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 4 dereferenceable(36) %val.sroa.5.0..sroa_idx.i, ptr noundef nonnull align 4 dereferenceable(36) %val.sroa.5.i, i64 36, i1 false)
  %75 = icmp ne ptr %_16.1.i, null
  call void @llvm.assume(i1 %75)
  %borrow.i.i.i.i = load i64, ptr %_16.1.i, align 8, !noalias !78, !noundef !2
  %val.i.i.i.i = add i64 %borrow.i.i.i.i, -1
  store i64 %val.i.i.i.i, ptr %_16.1.i, align 8, !noalias !78
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %data.i), !noalias !78
  call void @llvm.lifetime.end.p0(i64 120, ptr nonnull %val.sroa.3.i)
  call void @llvm.lifetime.end.p0(i64 36, ptr nonnull %val.sroa.5.i)
  br label %bb44

bb11.i:                                           ; preds = %bb9.i
  call void @llvm.lifetime.end.p0(i64 176, ptr nonnull %_9.i), !noalias !78
  %76 = icmp ne ptr %_16.1.i, null
  call void @llvm.assume(i1 %76)
  %borrow.i.i.i10.i = load i64, ptr %_16.1.i, align 8, !noalias !78, !noundef !2
  %val.i.i.i11.i = add i64 %borrow.i.i.i10.i, -1
  store i64 %val.i.i.i11.i, ptr %_16.1.i, align 8, !noalias !78
  br label %"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1f82827fb906f3b1E.exit"

"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1f82827fb906f3b1E.exit": ; preds = %bb8.i, %bb11.i
  %_0.sroa.4.1.i = phi ptr [ %_25.1.i, %bb11.i ], [ %_22.1.i, %bb8.i ]
  %_0.sroa.0.1.i = phi i64 [ %_25.0.i, %bb11.i ], [ %_22.0.i, %bb8.i ]
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %data.i), !noalias !78
  %77 = insertvalue { i64, ptr } poison, i64 %_0.sroa.0.1.i, 0
  %78 = insertvalue { i64, ptr } %77, ptr %_0.sroa.4.1.i, 1
  call void @llvm.lifetime.end.p0(i64 120, ptr nonnull %val.sroa.3.i)
  call void @llvm.lifetime.end.p0(i64 36, ptr nonnull %val.sroa.5.i)
  %79 = icmp eq i64 %_0.sroa.0.1.i, 2
  br i1 %79, label %bb44, label %bb32

bb44:                                             ; preds = %"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1f82827fb906f3b1E.exit.thread", %"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1f82827fb906f3b1E.exit"
  call void @llvm.lifetime.start.p0(i64 128, ptr nonnull %event)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_54)
; call solana_sysvar::clock::<impl solana_sysvar::Sysvar for solana_clock::Clock>::get
  call void @"_ZN13solana_sysvar5clock71_$LT$impl$u20$solana_sysvar..Sysvar$u20$for$u20$solana_clock..Clock$GT$3get17h0c5111a066f59c1cE"(ptr noalias nocapture noundef nonnull sret([48 x i8]) align 8 dereferenceable(48) %_54) #19
  %_176 = load i64, ptr %_54, align 8, !range !10, !noundef !2
  %trunc.not = icmp eq i64 %_176, 0
  br i1 %trunc.not, label %bb46, label %bb45

bb46:                                             ; preds = %bb44
  %_177.sroa.8.0..sroa_idx = getelementptr inbounds i8, ptr %_54, i64 40
  %_177.sroa.8.0.copyload = load i64, ptr %_177.sroa.8.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_54)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_56)
  %_125 = load ptr, ptr %a, align 8, !nonnull !2, !align !70, !noundef !2
  %80 = getelementptr inbounds i8, ptr %_125, i64 40
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_56, ptr noundef nonnull align 8 dereferenceable(32) %80, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_57)
; call pump_amm_recovered::utils::bonding_curve
  call void @_ZN18pump_amm_recovered5utils13bonding_curve17haaeab9b6da598483E(ptr noalias nocapture noundef nonnull sret([32 x i8]) align 1 dereferenceable(32) %_57, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %80) #19
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_59)
  %_127 = load ptr, ptr %a, align 8, !nonnull !2, !align !70, !noundef !2
  %_182 = load ptr, ptr %_127, align 8, !nonnull !2, !align !70, !noundef !2
  %_183 = load ptr, ptr %_182, align 8, !nonnull !2, !align !11, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_59, ptr noundef nonnull align 1 dereferenceable(32) %_183, i64 32, i1 false)
  %81 = getelementptr inbounds i8, ptr %_127, i64 232
  %_60 = load i128, ptr %81, align 8, !noundef !2
  %_129 = load ptr, ptr %10, align 8, !nonnull !2, !align !70, !noundef !2
  %82 = getelementptr inbounds i8, ptr %_129, i64 104
  %_61 = load i64, ptr %82, align 8, !noundef !2
  %83 = getelementptr inbounds i8, ptr %event, i64 112
  store i64 %_177.sroa.8.0.copyload, ptr %83, align 8
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %event, ptr noundef nonnull align 1 dereferenceable(32) %_56, i64 32, i1 false)
  %84 = getelementptr inbounds i8, ptr %event, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %84, ptr noundef nonnull align 1 dereferenceable(32) %_57, i64 32, i1 false)
  %85 = getelementptr inbounds i8, ptr %event, i64 64
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %85, ptr noundef nonnull align 1 dereferenceable(32) %_59, i64 32, i1 false)
  %86 = getelementptr inbounds i8, ptr %event, i64 96
  store i128 %_60, ptr %86, align 8
  %87 = getelementptr inbounds i8, ptr %event, i64 120
  store i64 %_61, ptr %87, align 8
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_59)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_57)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_56)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_65)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_67)
; call <pump_amm_recovered::instructions::boost::InitBoostEvent as anchor_lang::Event>::data
  call void @"_ZN94_$LT$pump_amm_recovered..instructions..boost..InitBoostEvent$u20$as$u20$anchor_lang..Event$GT$4data17h6882ce6ddcf4aadfE"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_67, ptr noalias noundef nonnull readonly align 8 dereferenceable(128) %event) #19
  %88 = getelementptr inbounds i8, ptr %_67, i64 8
  %_186 = load ptr, ptr %88, align 8, !nonnull !2, !noundef !2
  %89 = getelementptr inbounds i8, ptr %_67, i64 16
  %_185 = load i64, ptr %89, align 8, !noundef !2
  store ptr %_186, ptr %_65, align 8
  %90 = getelementptr inbounds i8, ptr %_65, i64 8
  store i64 %_185, ptr %90, align 8
; call solana_program::log::sol_log_data
  call void @_ZN14solana_program3log12sol_log_data17h0e9d6cc0899543bbE(ptr noalias noundef nonnull readonly align 8 %_65, i64 noundef 1) #19
  %_67.val = load i64, ptr %_67, align 8, !noundef !2
  %91 = icmp eq i64 %_67.val, 0
  br i1 %91, label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i": ; preds = %bb46
  call void @__rust_dealloc(ptr noundef nonnull %_186, i64 noundef %_67.val, i64 noundef 1) #19
  br label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit"

"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit": ; preds = %bb46, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i"
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_67)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_65)
  %_70 = getelementptr inbounds i8, ptr %a, i64 96
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %authority_info, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_70) #19
  %92 = getelementptr inbounds i8, ptr %ctx, i64 34
  %authority_bump = load i8, ptr %92, align 2, !noundef !2
; call <pump_amm_recovered::instructions::boost::InitBoostEvent as anchor_lang::Event>::data
  call void @"_ZN94_$LT$pump_amm_recovered..instructions..boost..InitBoostEvent$u20$as$u20$anchor_lang..Event$GT$4data17h6882ce6ddcf4aadfE"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %inner_data, ptr noalias noundef nonnull readonly align 8 dereferenceable(128) %event) #19
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %ix_data)
  %me.sroa.0.0.copyload.i = load i64, ptr %inner_data, align 8, !alias.scope !83, !noalias !86
  %me.sroa.4.0.self.sroa_idx.i = getelementptr inbounds i8, ptr %inner_data, i64 8
  %me.sroa.4.0.copyload.i = load ptr, ptr %me.sroa.4.0.self.sroa_idx.i, align 8, !alias.scope !83, !noalias !86, !nonnull !2, !noundef !2
  %me.sroa.5.0.self.sroa_idx.i = getelementptr inbounds i8, ptr %inner_data, i64 16
  %me.sroa.5.0.copyload.i = load i64, ptr %me.sroa.5.0.self.sroa_idx.i, align 8, !alias.scope !83, !noalias !86
  %_18.i = getelementptr inbounds i8, ptr %me.sroa.4.0.copyload.i, i64 %me.sroa.5.0.copyload.i
  %93 = getelementptr inbounds i8, ptr %_76, i64 32
  store ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, ptr %93, align 8
  %94 = getelementptr inbounds i8, ptr %_76, i64 40
  store ptr getelementptr inbounds (<{ [8 x i8] }>, ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, i64 1, i32 0, i64 0), ptr %94, align 8
  store ptr %me.sroa.4.0.copyload.i, ptr %_76, align 8
  %_196.sroa.4.0._76.sroa_idx = getelementptr inbounds i8, ptr %_76, i64 8
  store ptr %me.sroa.4.0.copyload.i, ptr %_196.sroa.4.0._76.sroa_idx, align 8
  %_196.sroa.5.0._76.sroa_idx = getelementptr inbounds i8, ptr %_76, i64 16
  store i64 %me.sroa.0.0.copyload.i, ptr %_196.sroa.5.0._76.sroa_idx, align 8
  %_196.sroa.6.0._76.sroa_idx = getelementptr inbounds i8, ptr %_76, i64 24
  store ptr %_18.i, ptr %_196.sroa.6.0._76.sroa_idx, align 8
; call <alloc::vec::Vec<T> as alloc::vec::spec_from_iter::SpecFromIter<T,I>>::from_iter
  call fastcc void @"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17he2ea7706e75fbc91E"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %ix_data, ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_76) #19
  call void @llvm.lifetime.start.p0(i64 80, ptr nonnull %ix)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_81)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_81, ptr noundef nonnull align 1 dereferenceable(32) @_ZN18pump_amm_recovered2ID17h808a92cd622e7a23E, i64 32, i1 false)
  %95 = getelementptr inbounds i8, ptr %ix_data, i64 8
  %_199 = load ptr, ptr %95, align 8, !nonnull !2, !noundef !2
  %96 = getelementptr inbounds i8, ptr %ix_data, i64 16
  %_198 = load i64, ptr %96, align 8, !noundef !2
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_84)
; call alloc::alloc::exchange_malloc
  %_86 = call fastcc noundef ptr @_ZN5alloc5alloc15exchange_malloc17h6cd8dd11b0e3424eE() #19
  %_130 = load ptr, ptr %authority_info, align 8, !nonnull !2, !align !11, !noundef !2
  call void @llvm.memmove.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_86, ptr noundef nonnull align 1 dereferenceable(32) %_130, i64 32, i1 false)
  %_88.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_86, i64 32
  store i8 1, ptr %_88.sroa.4.0..sroa_idx, align 1
  %_88.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_86, i64 33
  store i8 0, ptr %_88.sroa.5.0..sroa_idx, align 1
  store i64 1, ptr %_84, align 8, !alias.scope !88, !noalias !91
  %97 = getelementptr inbounds i8, ptr %_84, i64 8
  store ptr %_86, ptr %97, align 8, !alias.scope !88, !noalias !91
  %98 = getelementptr inbounds i8, ptr %_84, i64 16
  store i64 1, ptr %98, align 8, !alias.scope !88, !noalias !91
; call solana_instruction::Instruction::new_with_bytes
  call void @_ZN18solana_instruction11Instruction14new_with_bytes17h2a18064ce4a85141E(ptr noalias nocapture noundef nonnull sret([80 x i8]) align 8 dereferenceable(80) %ix, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %_81, ptr noalias noundef nonnull readonly align 1 %_199, i64 noundef %_198, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_84) #19
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_84)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_81)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_96)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %_96, ptr noundef nonnull align 8 dereferenceable(48) %authority_info, i64 48, i1 false)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_99)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_102)
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %_106)
  store i8 %authority_bump, ptr %_106, align 1
  store ptr @alloc_7a7952b5e0d15f2b72d0341cef6d4739, ptr %_102, align 8
  %99 = getelementptr inbounds i8, ptr %_102, i64 8
  store i64 17, ptr %99, align 8
  %100 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_102, i64 0, i64 1
  store ptr %_106, ptr %100, align 8
  %101 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_102, i64 0, i64 1, i32 1
  store i64 1, ptr %101, align 8
  store ptr %_102, ptr %_99, align 8
  %102 = getelementptr inbounds i8, ptr %_99, i64 8
  store i64 2, ptr %102, align 8
; call solana_program::program::invoke_signed
  call void @_ZN14solana_program7program13invoke_signed17hcf4e7a0d8dc0ee99E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_92, ptr noalias noundef nonnull readonly align 8 dereferenceable(80) %ix, ptr noalias noundef nonnull readonly align 8 %_96, i64 noundef 1, ptr noalias noundef nonnull readonly align 8 %_99, i64 noundef 1) #19
  %103 = load i64, ptr %_92, align 8, !range !81, !noundef !2
  %104 = icmp eq i64 %103, -9223372036854775782
  br i1 %104, label %bb52, label %bb51

bb45:                                             ; preds = %bb44
  %105 = getelementptr inbounds i8, ptr %_54, i64 8
  %_178.sroa.0.0.copyload = load i64, ptr %105, align 8
  %_178.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_54, i64 16
  %_178.sroa.5.0.copyload = load i64, ptr %_178.sroa.5.0..sroa_idx, align 8
  %_178.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_54, i64 24
  %_178.sroa.6.0.copyload = load i64, ptr %_178.sroa.6.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_54)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_180)
  store i64 %_178.sroa.0.0.copyload, ptr %_180, align 8
  %residual3.sroa.2.0._180.sroa_idx = getelementptr inbounds i8, ptr %_180, i64 8
  store i64 %_178.sroa.5.0.copyload, ptr %residual3.sroa.2.0._180.sroa_idx, align 8
  %residual3.sroa.3.0._180.sroa_idx = getelementptr inbounds i8, ptr %_180, i64 16
  store i64 %_178.sroa.6.0.copyload, ptr %residual3.sroa.3.0._180.sroa_idx, align 8
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %106 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17h2734901f082d5dd2E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_180) #19
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_180)
  br label %bb30

bb52:                                             ; preds = %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit"
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_106)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_102)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_99)
  %107 = getelementptr inbounds i8, ptr %_96, i64 8
  %_96.val26 = load ptr, ptr %107, align 8, !nonnull !2, !noundef !2
  %108 = getelementptr inbounds i8, ptr %_96, i64 16
  %_96.val27 = load ptr, ptr %108, align 8
; call core::ptr::drop_in_place<[solana_account_info::AccountInfo; 1]>
  call fastcc void @"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17hb81a6a6cb5b44108E"(ptr nonnull %_96.val26, ptr %_96.val27) #19
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_96)
; call core::ptr::drop_in_place<solana_instruction::Instruction>
  call fastcc void @"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h229e98e0f664984fE"(ptr noalias noundef nonnull align 8 dereferenceable(80) %ix) #19
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix)
  %ix_data.val22 = load i64, ptr %ix_data, align 8, !noundef !2
  %109 = icmp eq i64 %ix_data.val22, 0
  br i1 %109, label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit30", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i29"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i29": ; preds = %bb52
  call void @__rust_dealloc(ptr noundef nonnull %_199, i64 noundef %ix_data.val22, i64 noundef 1) #19
  br label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit30"

"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit30": ; preds = %bb52, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i29"
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data)
  call void @llvm.lifetime.end.p0(i64 128, ptr nonnull %event)
  call void @llvm.lifetime.end.p0(i64 96, ptr nonnull %_28)
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %bump)
  call void @llvm.lifetime.end.p0(i64 2, ptr nonnull %index)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %authority)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %creator)
  br label %bb35

bb51:                                             ; preds = %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit"
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %110 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17h2734901f082d5dd2E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_92) #19
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_106)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_102)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_99)
  %111 = getelementptr inbounds i8, ptr %_96, i64 8
  %_96.val = load ptr, ptr %111, align 8, !nonnull !2, !noundef !2
  %112 = getelementptr inbounds i8, ptr %_96, i64 16
  %_96.val25 = load ptr, ptr %112, align 8
; call core::ptr::drop_in_place<[solana_account_info::AccountInfo; 1]>
  call fastcc void @"_ZN4core3ptr74drop_in_place$LT$$u5b$solana_account_info..AccountInfo$u3b$$u20$1$u5d$$GT$17hb81a6a6cb5b44108E"(ptr nonnull %_96.val, ptr %_96.val25) #19
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_96)
; call core::ptr::drop_in_place<solana_instruction::Instruction>
  call fastcc void @"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h229e98e0f664984fE"(ptr noalias noundef nonnull align 8 dereferenceable(80) %ix) #19
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix)
  %ix_data.val = load i64, ptr %ix_data, align 8, !noundef !2
  %113 = icmp eq i64 %ix_data.val, 0
  br i1 %113, label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit32", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i31"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i31": ; preds = %bb51
  call void @__rust_dealloc(ptr noundef nonnull %_199, i64 noundef %ix_data.val, i64 noundef 1) #19
  br label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit32"

"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit32": ; preds = %bb51, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i31"
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data)
  br label %bb30

bb35:                                             ; preds = %bb34, %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit30"
  %_0.sroa.9.0 = phi ptr [ %_0.sroa.9.3, %bb34 ], [ undef, %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit30" ]
  %_0.sroa.0.0 = phi i64 [ %_0.sroa.0.3, %bb34 ], [ 2, %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit30" ]
  %114 = insertvalue { i64, ptr } poison, i64 %_0.sroa.0.0, 0
  %115 = insertvalue { i64, ptr } %114, ptr %_0.sroa.9.0, 1
  ret { i64, ptr } %115

bb30:                                             ; preds = %bb45, %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit32"
  %.pn = phi { i64, ptr } [ %106, %bb45 ], [ %110, %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h01bd9d9403ad3302E.exit32" ]
  %_0.sroa.0.1 = extractvalue { i64, ptr } %.pn, 0
  call void @llvm.lifetime.end.p0(i64 128, ptr nonnull %event)
  br label %bb32

bb32:                                             ; preds = %"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1f82827fb906f3b1E.exit", %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h943e945399c8a536E.exit", %bb30
  %.pn.pn = phi { i64, ptr } [ %.pn, %bb30 ], [ %52, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h943e945399c8a536E.exit" ], [ %78, %"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1f82827fb906f3b1E.exit" ]
  %_0.sroa.0.2 = phi i64 [ %_0.sroa.0.1, %bb30 ], [ %53, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h943e945399c8a536E.exit" ], [ %_0.sroa.0.1.i, %"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1f82827fb906f3b1E.exit" ]
  %_0.sroa.9.2 = extractvalue { i64, ptr } %.pn.pn, 1
  call void @llvm.lifetime.end.p0(i64 96, ptr nonnull %_28)
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %bump)
  call void @llvm.lifetime.end.p0(i64 2, ptr nonnull %index)
  br label %bb34

bb34:                                             ; preds = %bb38, %bb4, %start, %bb32, %bb37
  %_0.sroa.9.3 = phi ptr [ %_0.sroa.9.2, %bb32 ], [ %_160.1, %bb37 ], [ undef, %start ], [ undef, %bb4 ], [ undef, %bb38 ]
  %_0.sroa.0.3 = phi i64 [ %_0.sroa.0.2, %bb32 ], [ %14, %bb37 ], [ 2, %start ], [ 2, %bb4 ], [ 2, %bb38 ]
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %authority)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %creator)
  br label %bb35
}

; Function Attrs: mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite)
declare void @llvm.memcpy.p0.p0.i64(ptr noalias nocapture writeonly, ptr noalias nocapture readonly, i64, i1 immarg) #5

; Function Attrs: mustprogress nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare hidden { i64, i1 } @llvm.uadd.with.overflow.i64(i64, i64) #6

; alloc::raw_vec::handle_error
; Function Attrs: cold noreturn nounwind
declare void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef, i64) unnamed_addr #7

; core::panicking::panic_fmt
; Function Attrs: cold noinline noreturn nounwind
declare void @_ZN4core9panicking9panic_fmt17h0f7a5cdbeae7e874E(ptr noalias nocapture noundef readonly align 8 dereferenceable(48), ptr noalias noundef readonly align 8 dereferenceable(24)) unnamed_addr #8

; <anchor_spl::token_interface::TokenAccount as anchor_lang::AccountDeserialize>::try_deserialize_unchecked
; Function Attrs: nounwind
declare void @"_ZN93_$LT$anchor_spl..token_interface..TokenAccount$u20$as$u20$anchor_lang..AccountDeserialize$GT$25try_deserialize_unchecked17hdff8c46343ab1a4eE"(ptr dead_on_unwind noalias nocapture noundef writable sret([176 x i8]) align 8 dereferenceable(176), ptr noalias noundef align 8 dereferenceable(16)) unnamed_addr #0

; solana_account_info::AccountInfo::try_borrow_data
; Function Attrs: nounwind
declare void @_ZN19solana_account_info11AccountInfo15try_borrow_data17h59f29d158b311ea0E(ptr dead_on_unwind noalias nocapture noundef writable sret([24 x i8]) align 8 dereferenceable(24), ptr noalias noundef readonly align 8 dereferenceable(48)) unnamed_addr #0

; <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
; Function Attrs: nounwind
declare { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17h2734901f082d5dd2E"(ptr noalias nocapture noundef readonly align 8 dereferenceable(24)) unnamed_addr #0

; Function Attrs: mustprogress nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: write)
declare hidden void @llvm.assume(i1 noundef) #9

; Function Attrs: cold noreturn nounwind memory(inaccessiblemem: write)
declare hidden void @llvm.trap() #10

; alloc::alloc::handle_alloc_error
; Function Attrs: cold noreturn nounwind
declare void @_ZN5alloc5alloc18handle_alloc_error17hdf8d5797c8d8bbffE(i64 noundef, i64 noundef) unnamed_addr #7

; Function Attrs: nounwind allockind("alloc,uninitialized,aligned") allocsize(0)
declare noalias noundef ptr @__rust_alloc(i64 noundef, i64 allocalign noundef) unnamed_addr #11

; Function Attrs: nounwind allockind("realloc,aligned") allocsize(3)
declare noalias noundef ptr @__rust_realloc(ptr allocptr noundef, i64 noundef, i64 allocalign noundef, i64 noundef) unnamed_addr #12

; Function Attrs: nounwind allockind("free")
declare void @__rust_dealloc(ptr allocptr noundef, i64 noundef, i64 noundef) unnamed_addr #13

; solana_pubkey::Pubkey::find_program_address
; Function Attrs: nounwind
declare void @_ZN13solana_pubkey6Pubkey20find_program_address17h5c8eecf7b7496a06E(ptr dead_on_unwind noalias nocapture noundef writable sret([33 x i8]) align 1 dereferenceable(33), ptr noalias noundef nonnull readonly align 8, i64 noundef, ptr noalias noundef readonly align 1 dereferenceable(32)) unnamed_addr #0

; Function Attrs: mustprogress nofree nounwind willreturn memory(argmem: read)
declare hidden i32 @memcmp(ptr nocapture, ptr nocapture, i64) local_unnamed_addr #14

; pump_amm_recovered::state::pool::<impl pump_amm_recovered::state::Pool>::can_boost
; Function Attrs: nounwind
declare noundef zeroext i1 @"_ZN18pump_amm_recovered5state4pool49_$LT$impl$u20$pump_amm_recovered..state..Pool$GT$9can_boost17h0c832e039775c349E"(ptr noalias noundef readonly align 8 dereferenceable(280)) unnamed_addr #0

; pump_amm_recovered::instructions::boost::calculate_virtual_quote_reserves
; Function Attrs: nounwind
declare void @_ZN18pump_amm_recovered12instructions5boost32calculate_virtual_quote_reserves17h1995da5b3ccf08fcE(ptr dead_on_unwind noalias nocapture noundef writable sret([16 x i8]) align 8 dereferenceable(16), i64 noundef, i64 noundef) unnamed_addr #0

; pump_amm_recovered::utils::token::transfer_checked
; Function Attrs: nounwind
declare { i64, ptr } @_ZN18pump_amm_recovered5utils5token16transfer_checked17h68c2296e64024d0aE(ptr noalias noundef readonly align 8 dereferenceable(48), ptr noalias noundef readonly align 8 dereferenceable(128), ptr noalias noundef readonly align 8 dereferenceable(216), ptr noalias noundef readonly align 8 dereferenceable(216), ptr noalias noundef readonly align 8 dereferenceable(48), i64 noundef, ptr noalias noundef nonnull readonly align 8, i64 noundef) unnamed_addr #0

; solana_sysvar::clock::<impl solana_sysvar::Sysvar for solana_clock::Clock>::get
; Function Attrs: nounwind
declare void @"_ZN13solana_sysvar5clock71_$LT$impl$u20$solana_sysvar..Sysvar$u20$for$u20$solana_clock..Clock$GT$3get17h0c5111a066f59c1cE"(ptr dead_on_unwind noalias nocapture noundef writable sret([48 x i8]) align 8 dereferenceable(48)) unnamed_addr #0

; pump_amm_recovered::utils::bonding_curve
; Function Attrs: nounwind
declare void @_ZN18pump_amm_recovered5utils13bonding_curve17haaeab9b6da598483E(ptr dead_on_unwind noalias nocapture noundef writable sret([32 x i8]) align 1 dereferenceable(32), ptr noalias noundef readonly align 1 dereferenceable(32)) unnamed_addr #0

; <pump_amm_recovered::instructions::boost::InitBoostEvent as anchor_lang::Event>::data
; Function Attrs: nounwind
declare void @"_ZN94_$LT$pump_amm_recovered..instructions..boost..InitBoostEvent$u20$as$u20$anchor_lang..Event$GT$4data17h6882ce6ddcf4aadfE"(ptr dead_on_unwind noalias nocapture noundef writable sret([24 x i8]) align 8 dereferenceable(24), ptr noalias noundef readonly align 8 dereferenceable(128)) unnamed_addr #0

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
declare void @llvm.lifetime.start.p0(i64 immarg, ptr nocapture) #15

; Function Attrs: mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite)
declare void @llvm.lifetime.end.p0(i64 immarg, ptr nocapture) #15

; Function Attrs: nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: readwrite)
declare void @llvm.experimental.noalias.scope.decl(metadata) #16

; Function Attrs: nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare i64 @llvm.umax.i64(i64, i64) #17

; Function Attrs: nocallback nofree nounwind willreturn memory(argmem: readwrite)
declare void @llvm.memmove.p0.p0.i64(ptr nocapture writeonly, ptr nocapture readonly, i64, i1 immarg) #18

attributes #0 = { nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #1 = { inlinehint nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #2 = { noinline nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #3 = { cold nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #4 = { inlinehint nounwind memory(readwrite, inaccessiblemem: write) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #5 = { mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite) }
attributes #6 = { mustprogress nocallback nofree nosync nounwind speculatable willreturn memory(none) }
attributes #7 = { cold noreturn nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #8 = { cold noinline noreturn nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #9 = { mustprogress nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: write) }
attributes #10 = { cold noreturn nounwind memory(inaccessiblemem: write) }
attributes #11 = { nounwind allockind("alloc,uninitialized,aligned") allocsize(0) "alloc-family"="__rust_alloc" "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #12 = { nounwind allockind("realloc,aligned") allocsize(3) "alloc-family"="__rust_alloc" "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #13 = { nounwind allockind("free") "alloc-family"="__rust_alloc" "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #14 = { mustprogress nofree nounwind willreturn memory(argmem: read) }
attributes #15 = { mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite) }
attributes #16 = { nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: readwrite) }
attributes #17 = { nocallback nofree nosync nounwind speculatable willreturn memory(none) }
attributes #18 = { nocallback nofree nounwind willreturn memory(argmem: readwrite) }
attributes #19 = { nounwind }
attributes #20 = { noreturn nounwind }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 8, !"PIC Level", i32 2}
!1 = !{!"rustc version 1.79.0-dev"}
!2 = !{}
!3 = !{i64 0, i64 -9223372036854775807}
!4 = !{!5}
!5 = distinct !{!5, !6, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14grow_amortized17h1622d0fa794c2757E: %self"}
!6 = distinct !{!6, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14grow_amortized17h1622d0fa794c2757E"}
!7 = !{!8}
!8 = distinct !{!8, !9, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h15e90ad63b96054dE: %_0"}
!9 = distinct !{!9, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h15e90ad63b96054dE"}
!10 = !{i64 0, i64 2}
!11 = !{i64 1}
!12 = !{i8 0, i8 2}
!13 = !{!14}
!14 = distinct !{!14, !15, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17had8fd9fc89eded6aE: %iterator"}
!15 = distinct !{!15, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17had8fd9fc89eded6aE"}
!16 = !{!17, !14}
!17 = distinct !{!17, !15, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17had8fd9fc89eded6aE: %_0"}
!18 = !{!17}
!19 = !{!20, !14}
!20 = distinct !{!20, !21, !"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17hbf00049a10d98dc6E: %self"}
!21 = distinct !{!21, !"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17hbf00049a10d98dc6E"}
!22 = !{!23, !17}
!23 = distinct !{!23, !21, !"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17hbf00049a10d98dc6E: %_0"}
!24 = !{!25, !17, !14}
!25 = distinct !{!25, !26, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h7ca68daa701570ffE: %_0"}
!26 = distinct !{!26, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h7ca68daa701570ffE"}
!27 = !{!28}
!28 = distinct !{!28, !29, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17ha9f1a1b9ad5d5d19E: %self"}
!29 = distinct !{!29, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17ha9f1a1b9ad5d5d19E"}
!30 = !{!31}
!31 = distinct !{!31, !32, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h6f8262946d31431fE: %self"}
!32 = distinct !{!32, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h6f8262946d31431fE"}
!33 = !{!34, !35, !17, !14}
!34 = distinct !{!34, !32, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h6f8262946d31431fE: %iterator"}
!35 = distinct !{!35, !29, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17ha9f1a1b9ad5d5d19E: %iterator"}
!36 = !{!31, !28}
!37 = !{!38, !40, !42, !44, !45, !47, !31, !34, !28, !35, !17, !14}
!38 = distinct !{!38, !39, !"_ZN91_$LT$core..slice..iter..Iter$LT$T$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17hb87f43bb376ce581E: argument 0"}
!39 = distinct !{!39, !"_ZN91_$LT$core..slice..iter..Iter$LT$T$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17hb87f43bb376ce581E"}
!40 = distinct !{!40, !41, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h23bb574bd519ed5cE: %g"}
!41 = distinct !{!41, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h23bb574bd519ed5cE"}
!42 = distinct !{!42, !43, !"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h2f54396dbf47f5baE: %self"}
!43 = distinct !{!43, !"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h2f54396dbf47f5baE"}
!44 = distinct !{!44, !43, !"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h2f54396dbf47f5baE: %f"}
!45 = distinct !{!45, !46, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h687078be6464bf22E: %self"}
!46 = distinct !{!46, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h687078be6464bf22E"}
!47 = distinct !{!47, !46, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h687078be6464bf22E: %f"}
!48 = !{!49, !51, !38, !40, !42, !44, !45, !47, !31, !34, !28, !35, !17, !14}
!49 = distinct !{!49, !50, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17h354948731d8ff27cE: %_1"}
!50 = distinct !{!50, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17h354948731d8ff27cE"}
!51 = distinct !{!51, !52, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17hbc18ffb31d895376E: %_1"}
!52 = distinct !{!52, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17hbc18ffb31d895376E"}
!53 = !{!54, !56, !58, !42, !44, !45, !47, !31, !34, !28, !35, !17, !14}
!54 = distinct !{!54, !55, !"_ZN103_$LT$alloc..vec..into_iter..IntoIter$LT$T$C$A$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4next17h8136b917865df04aE: %self"}
!55 = distinct !{!55, !"_ZN103_$LT$alloc..vec..into_iter..IntoIter$LT$T$C$A$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4next17h8136b917865df04aE"}
!56 = distinct !{!56, !57, !"_ZN4core4iter6traits8iterator8Iterator4fold17h2aeb830ced73c834E: %self"}
!57 = distinct !{!57, !"_ZN4core4iter6traits8iterator8Iterator4fold17h2aeb830ced73c834E"}
!58 = distinct !{!58, !57, !"_ZN4core4iter6traits8iterator8Iterator4fold17h2aeb830ced73c834E: %f"}
!59 = !{!60, !62, !56, !58, !42, !44, !45, !47, !31, !34, !28, !35, !17, !14}
!60 = distinct !{!60, !61, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17h354948731d8ff27cE: %_1"}
!61 = distinct !{!61, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17h354948731d8ff27cE"}
!62 = distinct !{!62, !63, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17hbc18ffb31d895376E: %_1"}
!63 = distinct !{!63, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17hbc18ffb31d895376E"}
!64 = !{!56, !58, !42, !44, !45, !47, !34, !35, !17, !14}
!65 = !{!66, !56, !58, !42, !44, !45, !47, !31, !34, !28, !35, !17, !14}
!66 = distinct !{!66, !67, !"_ZN86_$LT$alloc..vec..into_iter..IntoIter$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17hb9e3cbea05f65700E: %self"}
!67 = distinct !{!67, !"_ZN86_$LT$alloc..vec..into_iter..IntoIter$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17hb9e3cbea05f65700E"}
!68 = !{!42, !44, !45, !47, !34, !35, !17, !14}
!69 = !{!31, !34, !28, !35, !17, !14}
!70 = !{i64 8}
!71 = !{i64 0, i64 3}
!72 = !{!73}
!73 = distinct !{!73, !74, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!74 = distinct !{!74, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!75 = !{!76}
!76 = distinct !{!76, !74, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!77 = !{!73, !76}
!78 = !{!79}
!79 = distinct !{!79, !80, !"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1f82827fb906f3b1E: %self"}
!80 = distinct !{!80, !"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1f82827fb906f3b1E"}
!81 = !{i64 0, i64 -9223372036854775781}
!82 = !{i32 0, i32 3}
!83 = !{!84}
!84 = distinct !{!84, !85, !"_ZN90_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..iter..traits..collect..IntoIterator$GT$9into_iter17h8d588fa5eef91eedE: %self"}
!85 = distinct !{!85, !"_ZN90_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..iter..traits..collect..IntoIterator$GT$9into_iter17h8d588fa5eef91eedE"}
!86 = !{!87}
!87 = distinct !{!87, !85, !"_ZN90_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..iter..traits..collect..IntoIterator$GT$9into_iter17h8d588fa5eef91eedE: %_0"}
!88 = !{!89}
!89 = distinct !{!89, !90, !"_ZN5alloc5slice4hack8into_vec17h478f429d6c284bc1E: %_0"}
!90 = distinct !{!90, !"_ZN5alloc5slice4hack8into_vec17h478f429d6c284bc1E"}
!91 = !{!92}
!92 = distinct !{!92, !90, !"_ZN5alloc5slice4hack8into_vec17h478f429d6c284bc1E: %b.0"}
