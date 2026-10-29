; ModuleID = 'local_clones.54a9f71c9eb325d2-cgu.0'
source_filename = "local_clones.54a9f71c9eb325d2-cgu.0"
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
define internal fastcc void @"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h2e34e619fca25b95E"(ptr noalias nocapture noundef readonly align 8 dereferenceable(80) %_1) unnamed_addr #0 {
start:
  %_1.val = load i64, ptr %_1, align 8, !noundef !2
  %0 = icmp eq i64 %_1.val, 0
  br i1 %0, label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h44f1b71ab4a18c57E.exit", label %bb2.i.i.i

bb2.i.i.i:                                        ; preds = %start
  %1 = getelementptr inbounds i8, ptr %_1, i64 8
  %_1.val2 = load ptr, ptr %1, align 8, !nonnull !2, !noundef !2
  %size.i.i.i.i = mul nuw i64 %_1.val, 34
  tail call void @__rust_dealloc(ptr noundef nonnull %_1.val2, i64 noundef %size.i.i.i.i, i64 noundef 1) #19
  br label %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h44f1b71ab4a18c57E.exit"

"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h44f1b71ab4a18c57E.exit": ; preds = %start, %bb2.i.i.i
  %2 = getelementptr inbounds i8, ptr %_1, i64 24
  %.val = load i64, ptr %2, align 8, !noundef !2
  %3 = icmp eq i64 %.val, 0
  br i1 %3, label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h44f1b71ab4a18c57E.exit"
  %4 = getelementptr inbounds i8, ptr %_1, i64 32
  %.val1 = load ptr, ptr %4, align 8, !nonnull !2, !noundef !2
  tail call void @__rust_dealloc(ptr noundef nonnull %.val1, i64 noundef %.val, i64 noundef 1) #19
  br label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit"

"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit": ; preds = %"_ZN4core3ptr89drop_in_place$LT$alloc..vec..Vec$LT$solana_instruction..account_meta..AccountMeta$GT$$GT$17h44f1b71ab4a18c57E.exit", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i"
  ret void
}

; core::ptr::drop_in_place<solana_account_info::AccountInfo>
; Function Attrs: nounwind
define internal fastcc void @"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h5f1c8e7e6cd82dc9E"(ptr %_1.8.val, ptr %_1.16.val) unnamed_addr #0 {
start:
  %0 = icmp ne ptr %_1.8.val, null
  tail call void @llvm.assume(i1 %0)
  %self1.val.i.i = load i64, ptr %_1.8.val, align 8, !noundef !2
  %val.i.i = add i64 %self1.val.i.i, -1
  store i64 %val.i.i, ptr %_1.8.val, align 8
  %1 = icmp eq i64 %val.i.i, 0
  br i1 %1, label %bb1.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h430f4539b493dfc4E.exit"

bb1.i.i:                                          ; preds = %start
  %2 = getelementptr i8, ptr %_1.8.val, i64 8
  %self2.val.i.i = load i64, ptr %2, align 8, !noundef !2
  %val6.i.i = add i64 %self2.val.i.i, -1
  store i64 %val6.i.i, ptr %2, align 8
  %3 = icmp eq i64 %val6.i.i, 0
  br i1 %3, label %bb3.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h430f4539b493dfc4E.exit"

bb3.i.i:                                          ; preds = %bb1.i.i
  tail call void @__rust_dealloc(ptr noundef nonnull %_1.8.val, i64 noundef 32, i64 noundef 8) #19
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h430f4539b493dfc4E.exit"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h430f4539b493dfc4E.exit": ; preds = %start, %bb1.i.i, %bb3.i.i
  %4 = icmp ne ptr %_1.16.val, null
  tail call void @llvm.assume(i1 %4)
  %self1.val.i.i2 = load i64, ptr %_1.16.val, align 8, !noundef !2
  %val.i.i3 = add i64 %self1.val.i.i2, -1
  store i64 %val.i.i3, ptr %_1.16.val, align 8
  %5 = icmp eq i64 %val.i.i3, 0
  br i1 %5, label %bb1.i.i4, label %"_ZN4core3ptr93drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$$u5b$u8$u5d$$GT$$GT$$GT$17hbc8272b012d321d8E.exit"

bb1.i.i4:                                         ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h430f4539b493dfc4E.exit"
  %6 = getelementptr i8, ptr %_1.16.val, i64 8
  %self2.val.i.i5 = load i64, ptr %6, align 8, !noundef !2
  %val6.i.i6 = add i64 %self2.val.i.i5, -1
  store i64 %val6.i.i6, ptr %6, align 8
  %7 = icmp eq i64 %val6.i.i6, 0
  br i1 %7, label %bb3.i.i7, label %"_ZN4core3ptr93drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$$u5b$u8$u5d$$GT$$GT$$GT$17hbc8272b012d321d8E.exit"

bb3.i.i7:                                         ; preds = %bb1.i.i4
  tail call void @__rust_dealloc(ptr noundef nonnull %_1.16.val, i64 noundef 40, i64 noundef 8) #19
  br label %"_ZN4core3ptr93drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$$u5b$u8$u5d$$GT$$GT$$GT$17hbc8272b012d321d8E.exit"

"_ZN4core3ptr93drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$$u5b$u8$u5d$$GT$$GT$$GT$17hbc8272b012d321d8E.exit": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h430f4539b493dfc4E.exit", %bb1.i.i4, %bb3.i.i7
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
define internal fastcc void @_ZN5alloc7raw_vec11finish_grow17hb4d66002d98bfee3E(ptr dead_on_unwind noalias nocapture noundef writable writeonly align 8 dereferenceable(24) %_0, i64 noundef %0, i64 %1, ptr noalias nocapture noundef readonly align 8 dereferenceable(24) %current_memory) unnamed_addr #2 {
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
define internal fastcc void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h8d4d5f490980070bE"(ptr noalias nocapture noundef align 8 dereferenceable(16) %slf, i64 noundef %len, i64 noundef %additional) unnamed_addr #3 {
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
  br i1 %3, label %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hebb24428a4271b88E.exit.i", label %bb4.i.i

bb4.i.i:                                          ; preds = %bb10.i
  %self.val22.i = load ptr, ptr %2, align 8, !alias.scope !4, !nonnull !2, !noundef !2
  store ptr %self.val22.i, ptr %_20.i, align 8, !alias.scope !7, !noalias !4
  %_9.sroa.5.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_20.i, i64 16
  store i64 %_12.i, ptr %_9.sroa.5.0._0.sroa_idx.i.i, align 8, !alias.scope !7, !noalias !4
  br label %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hebb24428a4271b88E.exit.i"

"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hebb24428a4271b88E.exit.i": ; preds = %bb4.i.i, %bb10.i
  %.sink.i.i = phi i64 [ 1, %bb4.i.i ], [ 0, %bb10.i ]
  %4 = getelementptr inbounds i8, ptr %_20.i, i64 8
  store i64 %.sink.i.i, ptr %4, align 8, !alias.scope !7, !noalias !4
; call alloc::raw_vec::finish_grow
  call fastcc void @_ZN5alloc7raw_vec11finish_grow17hb4d66002d98bfee3E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %self5.i, i64 noundef %_0.sroa.0.0.i.i, i64 %cap3.sroa.0.0.sroa.speculated.i, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_20.i) #19, !noalias !4
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_20.i), !noalias !4
  %_53.i = load i64, ptr %self5.i, align 8, !range !10, !noalias !4, !noundef !2
  %trunc.not.i = icmp eq i64 %_53.i, 0
  %5 = getelementptr inbounds i8, ptr %self5.i, i64 8
  br i1 %trunc.not.i, label %bb3, label %bb20.i

bb20.i:                                           ; preds = %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hebb24428a4271b88E.exit.i"
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

bb3:                                              ; preds = %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hebb24428a4271b88E.exit.i"
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
  br i1 %_7.i, label %bb4.i, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hd6f9a7e4b42c9137E.exit

bb4.i:                                            ; preds = %start
  tail call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hd6f9a7e4b42c9137E.exit: ; preds = %start
  %1 = getelementptr inbounds i8, ptr %self, i64 16
  %_16 = load ptr, ptr %1, align 8, !nonnull !2, !noundef !2
  %self.val.i1 = load i64, ptr %_16, align 8, !noundef !2
  %cond.i2 = icmp ne i64 %self.val.i1, 0
  tail call void @llvm.assume(i1 %cond.i2)
  %strong1.i3 = add i64 %self.val.i1, 1
  store i64 %strong1.i3, ptr %_16, align 8
  %_7.i4 = icmp eq i64 %strong1.i3, 0
  br i1 %_7.i4, label %bb4.i5, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17h4ebb85024c25fa18E.exit

bb4.i5:                                           ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hd6f9a7e4b42c9137E.exit
  tail call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17h4ebb85024c25fa18E.exit: ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hd6f9a7e4b42c9137E.exit
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
define internal fastcc void @"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h64efd261fcb332ffE"(ptr dead_on_unwind noalias nocapture noundef writable writeonly align 8 dereferenceable(24) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %iterator) unnamed_addr #0 {
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
  br i1 %4, label %bb3.i, label %"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17h8a01ced5281eac18E.exit.i"

bb14.i.i:                                         ; preds = %bb3.i.i
  %9 = getelementptr inbounds i8, ptr %iterator, i64 8
  %self.val6.i.i = load ptr, ptr %9, align 8, !alias.scope !19, !noalias !22, !nonnull !2, !noundef !2
  %10 = getelementptr inbounds i8, ptr %iterator, i64 24
  %self.val7.i.i = load ptr, ptr %10, align 8, !alias.scope !19, !noalias !22, !nonnull !2, !noundef !2
  %11 = ptrtoint ptr %self.val7.i.i to i64
  %12 = ptrtoint ptr %self.val6.i.i to i64
  %13 = sub nuw i64 %11, %12
  br label %bb3.i

"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17h8a01ced5281eac18E.exit.i": ; preds = %bb2.i.i
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

bb3.i:                                            ; preds = %"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17h8a01ced5281eac18E.exit.i", %bb14.i.i, %bb2.i.i
  %_29.0.sink.i26.i = phi i64 [ %_29.0.i.i, %"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17h8a01ced5281eac18E.exit.i" ], [ %8, %bb2.i.i ], [ %13, %bb14.i.i ]
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

bb2.i:                                            ; preds = %"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17h8a01ced5281eac18E.exit.i"
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
  br i1 %4, label %bb2.i.i.i, label %"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17h8a01ced5281eac18E.exit.i.i.i"

bb14.i.i.i.i:                                     ; preds = %bb3.i.i.i.i
  %35 = icmp ne ptr %_12.sroa.4.0.copyload.i, null
  tail call void @llvm.assume(i1 %35)
  %36 = icmp ne ptr %_12.sroa.8.0.copyload.i, null
  tail call void @llvm.assume(i1 %36)
  %37 = ptrtoint ptr %_12.sroa.8.0.copyload.i to i64
  %38 = ptrtoint ptr %_12.sroa.4.0.copyload.i to i64
  %39 = sub nuw i64 %37, %38
  br label %bb2.i.i.i

"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17h8a01ced5281eac18E.exit.i.i.i": ; preds = %bb2.i.i.i.i
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

bb2.i.i.i:                                        ; preds = %"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17h8a01ced5281eac18E.exit.i.i.i", %bb14.i.i.i.i, %bb2.i.i.i.i
  %_29.0.sink.i8.i.i.i = phi i64 [ %_29.0.i.i.i.i, %"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17h8a01ced5281eac18E.exit.i.i.i" ], [ %34, %bb2.i.i.i.i ], [ %39, %bb14.i.i.i.i ]
  %_5.i.i.i.i = icmp ult i64 %_15.sroa.4.0.ph.i, %_29.0.sink.i8.i.i.i
  br i1 %_5.i.i.i.i, label %bb1.i.i.i.i, label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h9913d195b8e5745dE.exit.i.i.i"

bb1.i.i.i.i:                                      ; preds = %bb2.i.i.i
; call alloc::raw_vec::RawVec<T,A>::reserve::do_reserve_and_handle
  call fastcc void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h8d4d5f490980070bE"(ptr noalias noundef nonnull align 8 dereferenceable(16) %vector.i, i64 noundef 0, i64 noundef %_29.0.sink.i8.i.i.i) #19, !noalias !33
  %_29.pre.i.i.i = load i64, ptr %30, align 8, !alias.scope !36, !noalias !33
  %self1.i.i.pre.i = load ptr, ptr %29, align 8, !alias.scope !36, !noalias !33
  br label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h9913d195b8e5745dE.exit.i.i.i"

"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h9913d195b8e5745dE.exit.i.i.i": ; preds = %bb1.i.i.i.i, %bb2.i.i.i
  %self1.i.i.i = phi ptr [ %28, %bb2.i.i.i ], [ %self1.i.i.pre.i, %bb1.i.i.i.i ]
  %_29.i.i.i = phi i64 [ 0, %bb2.i.i.i ], [ %_29.pre.i.i.i, %bb1.i.i.i.i ]
  br i1 %2, label %bb3.i.i.i.i.i, label %bb1.i.i.i.i.i

bb1.i.i.i.i.i:                                    ; preds = %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h9913d195b8e5745dE.exit.i.i.i"
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

bb3.i.i.i.i.i:                                    ; preds = %bb9.i.i.i.i.i.i.i, %bb1.i.i.i.i.i, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h9913d195b8e5745dE.exit.i.i.i"
  %_4.sroa.5.0.i.i.i.i = phi i64 [ %_29.i.i.i, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h9913d195b8e5745dE.exit.i.i.i" ], [ %_29.i.i.i, %bb1.i.i.i.i.i ], [ %52, %bb9.i.i.i.i.i.i.i ]
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
  br i1 %56, label %"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h7b1ee4d6f9d724ccE.exit", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i.i.i.i.i": ; preds = %bb5.i.i.i.i.i.i
  tail call void @__rust_dealloc(ptr noundef nonnull %3, i64 noundef %_12.sroa.7.0.copyload.i, i64 noundef 1) #19, !noalias !65
  br label %"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h7b1ee4d6f9d724ccE.exit"

bb8.i.i.i.i.i:                                    ; preds = %bb3.i.i.i.i.i, %bb3.i.i.i.i
  %_4.sroa.5.0.i32.i.i.i = phi i64 [ %_4.sroa.5.0.i.i.i.i, %bb3.i.i.i.i.i ], [ 0, %bb3.i.i.i.i ]
  store i64 %_4.sroa.5.0.i32.i.i.i, ptr %30, align 8, !alias.scope !36, !noalias !68
  br label %"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h7b1ee4d6f9d724ccE.exit"

bb5.i.i.i:                                        ; preds = %"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17h8a01ced5281eac18E.exit.i.i.i"
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

"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h7b1ee4d6f9d724ccE.exit": ; preds = %bb5.i.i.i.i.i.i, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i.i.i.i.i", %bb8.i.i.i.i.i
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_0, ptr noundef nonnull align 8 dereferenceable(24) %vector.i, i64 24, i1 false), !noalias !13
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %vector.i), !noalias !16
  ret void
}

; local_clones::execute
; Function Attrs: nounwind
define hidden { i64, ptr } @_ZN12local_clones7execute17he60d832caa4f2bc7E(ptr noalias nocapture noundef readonly align 8 dereferenceable(40) %ctx) unnamed_addr #0 {
start:
  %_21.i = alloca [24 x i8], align 8
  %val.sroa.3.i = alloca [120 x i8], align 8
  %val.sroa.5.i = alloca [36 x i8], align 4
  %_9.i = alloca [176 x i8], align 8
  %_5.i50 = alloca [24 x i8], align 8
  %data.i = alloca [16 x i8], align 8
  %_182 = alloca [24 x i8], align 8
  %_107 = alloca [1 x i8], align 1
  %_103 = alloca [32 x i8], align 8
  %_100 = alloca [16 x i8], align 8
  %_97 = alloca [48 x i8], align 8
  %_93 = alloca [24 x i8], align 8
  %_85 = alloca [24 x i8], align 8
  %_82 = alloca [32 x i8], align 1
  %ix = alloca [80 x i8], align 8
  %_77 = alloca [48 x i8], align 8
  %ix_data = alloca [24 x i8], align 8
  %inner_data = alloca [24 x i8], align 8
  %authority_info = alloca [48 x i8], align 8
  %_68 = alloca [24 x i8], align 8
  %_66 = alloca [16 x i8], align 8
  %_60 = alloca [32 x i8], align 1
  %_58 = alloca [32 x i8], align 1
  %_57 = alloca [32 x i8], align 1
  %_55 = alloca [48 x i8], align 8
  %event = alloca [128 x i8], align 8
  %_48 = alloca [16 x i8], align 8
  %_30 = alloca [96 x i8], align 8
  %bump = alloca [1 x i8], align 1
  %index = alloca [2 x i8], align 2
  %authority_account = alloca [48 x i8], align 8
  %quote_token_program = alloca [48 x i8], align 8
  %_16 = alloca [16 x i8], align 8
  %_7 = alloca [32 x i8], align 8
  %_4 = alloca [33 x i8], align 1
  %authority = alloca [32 x i8], align 1
  %creator = alloca [32 x i8], align 1
  %0 = getelementptr inbounds i8, ptr %ctx, i64 8
  %a = load ptr, ptr %0, align 8, !nonnull !2, !align !70, !noundef !2
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %creator)
  %1 = getelementptr inbounds i8, ptr %a, i64 16
  %_154 = load ptr, ptr %1, align 8, !nonnull !2, !align !70, !noundef !2
  %_155 = load ptr, ptr %_154, align 8, !nonnull !2, !align !11, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %creator, ptr noundef nonnull align 1 dereferenceable(32) %_155, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %authority)
  call void @llvm.lifetime.start.p0(i64 33, ptr nonnull %_4)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_7)
  %_110 = load ptr, ptr %a, align 8, !nonnull !2, !align !70, !noundef !2
  %_156 = getelementptr inbounds i8, ptr %_110, i64 40
  store ptr @alloc_837d2dfc2ca6132d7e624d246f381ca4, ptr %_7, align 8
  %2 = getelementptr inbounds i8, ptr %_7, i64 8
  store i64 14, ptr %2, align 8
  %3 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_7, i64 0, i64 1
  store ptr %_156, ptr %3, align 8
  %4 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_7, i64 0, i64 1, i32 1
  store i64 32, ptr %4, align 8
; call solana_pubkey::Pubkey::find_program_address
  call void @_ZN13solana_pubkey6Pubkey20find_program_address17h5c8eecf7b7496a06E(ptr noalias nocapture noundef nonnull sret([33 x i8]) align 1 dereferenceable(33) %_4, ptr noalias noundef nonnull readonly align 8 %_7, i64 noundef 2, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) @_ZN18pump_amm_recovered4pump2ID17he4e01eb591eb9fd8E) #19
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %authority, ptr noundef nonnull align 1 dereferenceable(32) %_4, i64 32, i1 false)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_7)
  call void @llvm.lifetime.end.p0(i64 33, ptr nonnull %_4)
  %5 = call i32 @memcmp(ptr noundef nonnull dereferenceable(32) %creator, ptr noundef nonnull dereferenceable(32) %authority, i64 32)
  %6 = icmp ne i32 %5, 0
  %_111 = load ptr, ptr %a, align 8, !nonnull !2, !align !70, !noundef !2
  %_12 = getelementptr inbounds i8, ptr %_111, i64 8
; call pump_amm_recovered::state::pool::<impl pump_amm_recovered::state::Pool>::can_boost
  %can_boost = call noundef zeroext i1 @"_ZN18pump_amm_recovered5state4pool49_$LT$impl$u20$pump_amm_recovered..state..Pool$GT$9can_boost17h0c832e039775c349E"(ptr noalias noundef nonnull readonly align 8 dereferenceable(280) %_12) #19
  %brmerge = or i1 %6, %can_boost
  br i1 %brmerge, label %bb36, label %bb4

bb4:                                              ; preds = %start
  %7 = getelementptr inbounds i8, ptr %a, i64 8
  %_112 = load ptr, ptr %7, align 8, !nonnull !2, !align !70, !noundef !2
  %8 = getelementptr inbounds i8, ptr %_112, i64 947
  %9 = load i8, ptr %8, align 1, !range !12, !noundef !2
  %_13.not = icmp eq i8 %9, 0
  br i1 %_13.not, label %bb36, label %bb6

bb6:                                              ; preds = %bb4
  %10 = getelementptr inbounds i8, ptr %a, i64 48
  %_113 = load ptr, ptr %10, align 8, !nonnull !2, !align !70, !noundef !2
  %11 = getelementptr inbounds i8, ptr %_113, i64 104
  %q = load i64, ptr %11, align 8, !noundef !2
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_16)
  %12 = getelementptr inbounds i8, ptr %a, i64 40
  %_114 = load ptr, ptr %12, align 8, !nonnull !2, !align !70, !noundef !2
  %13 = getelementptr inbounds i8, ptr %_114, i64 104
  %_17 = load i64, ptr %13, align 8, !noundef !2
; call pump_amm_recovered::instructions::boost::calculate_virtual_quote_reserves
  call void @_ZN18pump_amm_recovered12instructions5boost32calculate_virtual_quote_reserves17h1995da5b3ccf08fcE(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_16, i64 noundef %_17, i64 noundef %q) #19
  %14 = load i64, ptr %_16, align 8, !range !71, !noundef !2
  %15 = icmp eq i64 %14, 2
  %16 = getelementptr inbounds i8, ptr %_16, i64 8
  br i1 %15, label %bb40, label %bb39

bb40:                                             ; preds = %bb6
  %_160 = load i64, ptr %16, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_16)
  %17 = icmp eq i64 %_160, 0
  %_20 = icmp uge i64 %_160, %q
  %or.cond = or i1 %17, %_20
  br i1 %or.cond, label %bb36, label %bb11

bb39:                                             ; preds = %bb6
  %_161.1 = load ptr, ptr %16, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_16)
  br label %bb36

bb11:                                             ; preds = %bb40
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %quote_token_program)
  %18 = getelementptr inbounds i8, ptr %a, i64 72
  %_164 = load ptr, ptr %18, align 8, !nonnull !2, !align !70, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !72)
  call void @llvm.experimental.noalias.scope.decl(metadata !75)
  %_2.i = load ptr, ptr %_164, align 8, !alias.scope !75, !noalias !72, !nonnull !2, !align !11, !noundef !2
  %19 = getelementptr inbounds i8, ptr %_164, i64 8
  %_12.i = load ptr, ptr %19, align 8, !alias.scope !75, !noalias !72, !nonnull !2, !noundef !2
  %self.val.i.i = load i64, ptr %_12.i, align 8, !noalias !77, !noundef !2
  %cond.i.i = icmp ne i64 %self.val.i.i, 0
  call void @llvm.assume(i1 %cond.i.i)
  %strong1.i.i = add i64 %self.val.i.i, 1
  store i64 %strong1.i.i, ptr %_12.i, align 8, !noalias !77
  %_7.i.i = icmp eq i64 %strong1.i.i, 0
  br i1 %_7.i.i, label %bb4.i.i, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hd6f9a7e4b42c9137E.exit.i

bb4.i.i:                                          ; preds = %bb11
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hd6f9a7e4b42c9137E.exit.i: ; preds = %bb11
  %20 = getelementptr inbounds i8, ptr %_164, i64 16
  %_16.i = load ptr, ptr %20, align 8, !alias.scope !75, !noalias !72, !nonnull !2, !noundef !2
  %self.val.i1.i = load i64, ptr %_16.i, align 8, !noalias !77, !noundef !2
  %cond.i2.i = icmp ne i64 %self.val.i1.i, 0
  call void @llvm.assume(i1 %cond.i2.i)
  %strong1.i3.i = add i64 %self.val.i1.i, 1
  store i64 %strong1.i3.i, ptr %_16.i, align 8, !noalias !77
  %_7.i4.i = icmp eq i64 %strong1.i3.i, 0
  br i1 %_7.i4.i, label %bb4.i5.i, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit"

bb4.i5.i:                                         ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hd6f9a7e4b42c9137E.exit.i
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hd6f9a7e4b42c9137E.exit.i
  %21 = getelementptr inbounds i8, ptr %_164, i64 24
  %_5.i = load ptr, ptr %21, align 8, !alias.scope !75, !noalias !72, !nonnull !2, !align !11, !noundef !2
  %22 = getelementptr inbounds i8, ptr %_164, i64 32
  %_6.i = load i64, ptr %22, align 8, !alias.scope !75, !noalias !72, !noundef !2
  %23 = getelementptr inbounds i8, ptr %_164, i64 40
  %24 = load i8, ptr %23, align 8, !range !12, !alias.scope !75, !noalias !72, !noundef !2
  %25 = getelementptr inbounds i8, ptr %_164, i64 41
  %26 = load i8, ptr %25, align 1, !range !12, !alias.scope !75, !noalias !72, !noundef !2
  %27 = getelementptr inbounds i8, ptr %_164, i64 42
  %28 = load i8, ptr %27, align 2, !range !12, !alias.scope !75, !noalias !72, !noundef !2
  store ptr %_2.i, ptr %quote_token_program, align 8, !alias.scope !72, !noalias !75
  %29 = getelementptr inbounds i8, ptr %quote_token_program, i64 8
  store ptr %_12.i, ptr %29, align 8, !alias.scope !72, !noalias !75
  %30 = getelementptr inbounds i8, ptr %quote_token_program, i64 16
  store ptr %_16.i, ptr %30, align 8, !alias.scope !72, !noalias !75
  %31 = getelementptr inbounds i8, ptr %quote_token_program, i64 24
  store ptr %_5.i, ptr %31, align 8, !alias.scope !72, !noalias !75
  %32 = getelementptr inbounds i8, ptr %quote_token_program, i64 32
  store i64 %_6.i, ptr %32, align 8, !alias.scope !72, !noalias !75
  %33 = getelementptr inbounds i8, ptr %quote_token_program, i64 40
  store i8 %24, ptr %33, align 8, !alias.scope !72, !noalias !75
  %34 = getelementptr inbounds i8, ptr %quote_token_program, i64 41
  store i8 %26, ptr %34, align 1, !alias.scope !72, !noalias !75
  %35 = getelementptr inbounds i8, ptr %quote_token_program, i64 42
  store i8 %28, ptr %35, align 2, !alias.scope !72, !noalias !75
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %authority_account)
  %_115 = load ptr, ptr %a, align 8, !nonnull !2, !align !70, !noundef !2
  %_165 = load ptr, ptr %_115, align 8, !nonnull !2, !align !70, !noundef !2
  call void @llvm.experimental.noalias.scope.decl(metadata !78)
  call void @llvm.experimental.noalias.scope.decl(metadata !81)
  %_2.i33 = load ptr, ptr %_165, align 8, !alias.scope !81, !noalias !78, !nonnull !2, !align !11, !noundef !2
  %36 = getelementptr inbounds i8, ptr %_165, i64 8
  %_12.i34 = load ptr, ptr %36, align 8, !alias.scope !81, !noalias !78, !nonnull !2, !noundef !2
  %self.val.i.i35 = load i64, ptr %_12.i34, align 8, !noalias !83, !noundef !2
  %cond.i.i36 = icmp ne i64 %self.val.i.i35, 0
  call void @llvm.assume(i1 %cond.i.i36)
  %strong1.i.i37 = add i64 %self.val.i.i35, 1
  store i64 %strong1.i.i37, ptr %_12.i34, align 8, !noalias !83
  %_7.i.i38 = icmp eq i64 %strong1.i.i37, 0
  br i1 %_7.i.i38, label %bb4.i.i48, label %_ZN5alloc2rc10RcInnerPtr10inc_strong17hd6f9a7e4b42c9137E.exit.i39

bb4.i.i48:                                        ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit"
  call void @llvm.trap()
  unreachable

_ZN5alloc2rc10RcInnerPtr10inc_strong17hd6f9a7e4b42c9137E.exit.i39: ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit"
  %37 = getelementptr inbounds i8, ptr %_165, i64 16
  %_16.i40 = load ptr, ptr %37, align 8, !alias.scope !81, !noalias !78, !nonnull !2, !noundef !2
  %self.val.i1.i41 = load i64, ptr %_16.i40, align 8, !noalias !83, !noundef !2
  %cond.i2.i42 = icmp ne i64 %self.val.i1.i41, 0
  call void @llvm.assume(i1 %cond.i2.i42)
  %strong1.i3.i43 = add i64 %self.val.i1.i41, 1
  store i64 %strong1.i3.i43, ptr %_16.i40, align 8, !noalias !83
  %_7.i4.i44 = icmp eq i64 %strong1.i3.i43, 0
  br i1 %_7.i4.i44, label %bb4.i5.i47, label %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit49"

bb4.i5.i47:                                       ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hd6f9a7e4b42c9137E.exit.i39
  call void @llvm.trap()
  unreachable

"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit49": ; preds = %_ZN5alloc2rc10RcInnerPtr10inc_strong17hd6f9a7e4b42c9137E.exit.i39
  %38 = getelementptr inbounds i8, ptr %_165, i64 24
  %_5.i45 = load ptr, ptr %38, align 8, !alias.scope !81, !noalias !78, !nonnull !2, !align !11, !noundef !2
  %39 = getelementptr inbounds i8, ptr %_165, i64 32
  %_6.i46 = load i64, ptr %39, align 8, !alias.scope !81, !noalias !78, !noundef !2
  %40 = getelementptr inbounds i8, ptr %_165, i64 40
  %41 = load i8, ptr %40, align 8, !range !12, !alias.scope !81, !noalias !78, !noundef !2
  %42 = getelementptr inbounds i8, ptr %_165, i64 41
  %43 = load i8, ptr %42, align 1, !range !12, !alias.scope !81, !noalias !78, !noundef !2
  %44 = getelementptr inbounds i8, ptr %_165, i64 42
  %45 = load i8, ptr %44, align 2, !range !12, !alias.scope !81, !noalias !78, !noundef !2
  store ptr %_2.i33, ptr %authority_account, align 8, !alias.scope !78, !noalias !81
  %46 = getelementptr inbounds i8, ptr %authority_account, i64 8
  store ptr %_12.i34, ptr %46, align 8, !alias.scope !78, !noalias !81
  %47 = getelementptr inbounds i8, ptr %authority_account, i64 16
  store ptr %_16.i40, ptr %47, align 8, !alias.scope !78, !noalias !81
  %48 = getelementptr inbounds i8, ptr %authority_account, i64 24
  store ptr %_5.i45, ptr %48, align 8, !alias.scope !78, !noalias !81
  %49 = getelementptr inbounds i8, ptr %authority_account, i64 32
  store i64 %_6.i46, ptr %49, align 8, !alias.scope !78, !noalias !81
  %50 = getelementptr inbounds i8, ptr %authority_account, i64 40
  store i8 %41, ptr %50, align 8, !alias.scope !78, !noalias !81
  %51 = getelementptr inbounds i8, ptr %authority_account, i64 41
  store i8 %43, ptr %51, align 1, !alias.scope !78, !noalias !81
  %52 = getelementptr inbounds i8, ptr %authority_account, i64 42
  store i8 %45, ptr %52, align 2, !alias.scope !78, !noalias !81
  call void @llvm.lifetime.start.p0(i64 2, ptr nonnull %index)
  %_116 = load ptr, ptr %a, align 8, !nonnull !2, !align !70, !noundef !2
  %53 = getelementptr inbounds i8, ptr %_116, i64 280
  %_25 = load i16, ptr %53, align 8, !noundef !2
  store i16 %_25, ptr %index, align 2
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %bump)
  %54 = getelementptr inbounds i8, ptr %_116, i64 282
  %_27 = load i8, ptr %54, align 2, !noundef !2
  store i8 %_27, ptr %bump, align 1
  call void @llvm.lifetime.start.p0(i64 96, ptr nonnull %_30)
  %_166 = getelementptr inbounds i8, ptr %_116, i64 8
  %_167 = getelementptr inbounds i8, ptr %_116, i64 40
  %_168 = getelementptr inbounds i8, ptr %_116, i64 72
  store ptr @alloc_bfc098cb63b041e1e9ec31a95db422e0, ptr %_30, align 8
  %55 = getelementptr inbounds i8, ptr %_30, i64 8
  store i64 4, ptr %55, align 8
  %56 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_30, i64 0, i64 1
  store ptr %index, ptr %56, align 8
  %57 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_30, i64 0, i64 1, i32 1
  store i64 2, ptr %57, align 8
  %58 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_30, i64 0, i64 2
  store ptr %_166, ptr %58, align 8
  %59 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_30, i64 0, i64 2, i32 1
  store i64 32, ptr %59, align 8
  %60 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_30, i64 0, i64 3
  store ptr %_167, ptr %60, align 8
  %61 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_30, i64 0, i64 3, i32 1
  store i64 32, ptr %61, align 8
  %62 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_30, i64 0, i64 4
  store ptr %_168, ptr %62, align 8
  %63 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_30, i64 0, i64 4, i32 1
  store i64 32, ptr %63, align 8
  %64 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_30, i64 0, i64 5
  store ptr %bump, ptr %64, align 8
  %65 = getelementptr inbounds [6 x { ptr, i64 }], ptr %_30, i64 0, i64 5, i32 1
  store i64 1, ptr %65, align 8
  %66 = getelementptr inbounds i8, ptr %a, i64 32
  %_121 = load ptr, ptr %66, align 8, !nonnull !2, !align !70, !noundef !2
  %_122 = load ptr, ptr %10, align 8, !nonnull !2, !align !70, !noundef !2
  %67 = getelementptr inbounds i8, ptr %a, i64 64
  %_123 = load ptr, ptr %67, align 8, !nonnull !2, !align !70, !noundef !2
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_48)
  store ptr %_30, ptr %_48, align 8
  %68 = getelementptr inbounds i8, ptr %_48, i64 8
  store i64 6, ptr %68, align 8
; call pump_amm_recovered::utils::token::transfer_checked
  %69 = call { i64, ptr } @_ZN18pump_amm_recovered5utils5token16transfer_checked17h68c2296e64024d0aE(ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %quote_token_program, ptr noalias noundef nonnull readonly align 8 dereferenceable(128) %_121, ptr noalias noundef nonnull readonly align 8 dereferenceable(216) %_122, ptr noalias noundef nonnull readonly align 8 dereferenceable(216) %_123, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %authority_account, i64 noundef %_160, ptr noalias noundef nonnull readonly align 8 %_48, i64 noundef 1) #19
  %70 = extractvalue { i64, ptr } %69, 0
  %71 = icmp eq i64 %70, 2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_48)
  br i1 %71, label %bb44, label %bb32

bb44:                                             ; preds = %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit49"
  %_124 = load ptr, ptr %a, align 8, !nonnull !2, !align !70, !noundef !2
  %72 = getelementptr inbounds i8, ptr %_124, i64 232
  %73 = zext i64 %_160 to i128
  store i128 %73, ptr %72, align 8
  %_125 = load ptr, ptr %10, align 8, !nonnull !2, !align !70, !noundef !2
  %_173 = getelementptr inbounds i8, ptr %_125, i64 32
  call void @llvm.experimental.noalias.scope.decl(metadata !84)
  call void @llvm.lifetime.start.p0(i64 120, ptr nonnull %val.sroa.3.i)
  call void @llvm.lifetime.start.p0(i64 36, ptr nonnull %val.sroa.5.i)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %data.i), !noalias !84
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_5.i50), !noalias !84
  %_13.i = load ptr, ptr %_173, align 8, !alias.scope !84, !nonnull !2, !align !70, !noundef !2
; call solana_account_info::AccountInfo::try_borrow_data
  call void @_ZN19solana_account_info11AccountInfo15try_borrow_data17h59f29d158b311ea0E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_5.i50, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_13.i) #19, !noalias !84
  %74 = load i64, ptr %_5.i50, align 8, !range !87, !noalias !84, !noundef !2
  %75 = icmp eq i64 %74, -9223372036854775782
  %76 = getelementptr inbounds i8, ptr %_5.i50, i64 8
  %_16.0.i = load ptr, ptr %76, align 8, !noalias !84
  %77 = getelementptr inbounds i8, ptr %_5.i50, i64 16
  %_16.1.i = load ptr, ptr %77, align 8, !noalias !84
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_5.i50), !noalias !84
  br i1 %75, label %bb9.i, label %bb8.i

bb9.i:                                            ; preds = %bb44
  %_14.0.i = load ptr, ptr %_16.0.i, align 8, !noalias !84, !nonnull !2, !align !11, !noundef !2
  %78 = getelementptr inbounds i8, ptr %_16.0.i, i64 8
  %_14.1.i = load i64, ptr %78, align 8, !noalias !84, !noundef !2
  store ptr %_14.0.i, ptr %data.i, align 8, !noalias !84
  %79 = getelementptr inbounds i8, ptr %data.i, i64 8
  store i64 %_14.1.i, ptr %79, align 8, !noalias !84
  call void @llvm.lifetime.start.p0(i64 176, ptr nonnull %_9.i), !noalias !84
; call <anchor_spl::token_interface::TokenAccount as anchor_lang::AccountDeserialize>::try_deserialize_unchecked
  call void @"_ZN93_$LT$anchor_spl..token_interface..TokenAccount$u20$as$u20$anchor_lang..AccountDeserialize$GT$25try_deserialize_unchecked17hdff8c46343ab1a4eE"(ptr noalias nocapture noundef nonnull sret([176 x i8]) align 8 dereferenceable(176) %_9.i, ptr noalias noundef nonnull align 8 dereferenceable(16) %data.i) #19, !noalias !84
  %80 = getelementptr inbounds i8, ptr %_9.i, i64 136
  %81 = load i32, ptr %80, align 8, !range !88, !noalias !84, !noundef !2
  %82 = icmp eq i32 %81, 2
  %_25.0.i = load i64, ptr %_9.i, align 8, !noalias !84
  %83 = getelementptr inbounds i8, ptr %_9.i, i64 8
  %_25.1.i = load ptr, ptr %83, align 8, !noalias !84
  br i1 %82, label %bb11.i, label %"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1db800c841482e56E.exit.thread"

bb8.i:                                            ; preds = %bb44
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_21.i), !noalias !84
  store i64 %74, ptr %_21.i, align 8, !noalias !84
  %residual.sroa.2.0._21.sroa_idx.i = getelementptr inbounds i8, ptr %_21.i, i64 8
  store ptr %_16.0.i, ptr %residual.sroa.2.0._21.sroa_idx.i, align 8, !noalias !84
  %residual.sroa.3.0._21.sroa_idx.i = getelementptr inbounds i8, ptr %_21.i, i64 16
  store ptr %_16.1.i, ptr %residual.sroa.3.0._21.sroa_idx.i, align 8, !noalias !84
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %84 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17h2734901f082d5dd2E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_21.i) #19, !noalias !84
  %_22.0.i = extractvalue { i64, ptr } %84, 0
  %_22.1.i = extractvalue { i64, ptr } %84, 1
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_21.i), !noalias !84
  br label %"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1db800c841482e56E.exit"

"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1db800c841482e56E.exit.thread": ; preds = %bb9.i
  %_24.sroa.6.0._9.sroa_idx.i = getelementptr inbounds i8, ptr %_9.i, i64 16
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(120) %val.sroa.3.i, ptr noundef nonnull align 8 dereferenceable(120) %_24.sroa.6.0._9.sroa_idx.i, i64 120, i1 false), !noalias !84
  %_24.sroa.8.0._9.sroa_idx.i = getelementptr inbounds i8, ptr %_9.i, i64 140
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 4 dereferenceable(36) %val.sroa.5.i, ptr noundef nonnull align 4 dereferenceable(36) %_24.sroa.8.0._9.sroa_idx.i, i64 36, i1 false), !noalias !84
  call void @llvm.lifetime.end.p0(i64 176, ptr nonnull %_9.i), !noalias !84
  %85 = getelementptr inbounds i8, ptr %_125, i64 40
  store i64 %_25.0.i, ptr %85, align 8, !alias.scope !84
  %val.sroa.2.0..sroa_idx.i = getelementptr inbounds i8, ptr %_125, i64 48
  store ptr %_25.1.i, ptr %val.sroa.2.0..sroa_idx.i, align 8, !alias.scope !84
  %val.sroa.3.0..sroa_idx.i = getelementptr inbounds i8, ptr %_125, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(120) %val.sroa.3.0..sroa_idx.i, ptr noundef nonnull align 8 dereferenceable(120) %val.sroa.3.i, i64 120, i1 false)
  %val.sroa.4.0..sroa_idx.i = getelementptr inbounds i8, ptr %_125, i64 176
  store i32 %81, ptr %val.sroa.4.0..sroa_idx.i, align 8, !alias.scope !84
  %val.sroa.5.0..sroa_idx.i = getelementptr inbounds i8, ptr %_125, i64 180
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 4 dereferenceable(36) %val.sroa.5.0..sroa_idx.i, ptr noundef nonnull align 4 dereferenceable(36) %val.sroa.5.i, i64 36, i1 false)
  %86 = icmp ne ptr %_16.1.i, null
  call void @llvm.assume(i1 %86)
  %borrow.i.i.i.i = load i64, ptr %_16.1.i, align 8, !noalias !84, !noundef !2
  %val.i.i.i.i = add i64 %borrow.i.i.i.i, -1
  store i64 %val.i.i.i.i, ptr %_16.1.i, align 8, !noalias !84
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %data.i), !noalias !84
  call void @llvm.lifetime.end.p0(i64 120, ptr nonnull %val.sroa.3.i)
  call void @llvm.lifetime.end.p0(i64 36, ptr nonnull %val.sroa.5.i)
  br label %bb47

bb11.i:                                           ; preds = %bb9.i
  call void @llvm.lifetime.end.p0(i64 176, ptr nonnull %_9.i), !noalias !84
  %87 = icmp ne ptr %_16.1.i, null
  call void @llvm.assume(i1 %87)
  %borrow.i.i.i10.i = load i64, ptr %_16.1.i, align 8, !noalias !84, !noundef !2
  %val.i.i.i11.i = add i64 %borrow.i.i.i10.i, -1
  store i64 %val.i.i.i11.i, ptr %_16.1.i, align 8, !noalias !84
  br label %"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1db800c841482e56E.exit"

"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1db800c841482e56E.exit": ; preds = %bb8.i, %bb11.i
  %_0.sroa.4.1.i = phi ptr [ %_25.1.i, %bb11.i ], [ %_22.1.i, %bb8.i ]
  %_0.sroa.0.1.i = phi i64 [ %_25.0.i, %bb11.i ], [ %_22.0.i, %bb8.i ]
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %data.i), !noalias !84
  %88 = insertvalue { i64, ptr } poison, i64 %_0.sroa.0.1.i, 0
  %89 = insertvalue { i64, ptr } %88, ptr %_0.sroa.4.1.i, 1
  call void @llvm.lifetime.end.p0(i64 120, ptr nonnull %val.sroa.3.i)
  call void @llvm.lifetime.end.p0(i64 36, ptr nonnull %val.sroa.5.i)
  %90 = icmp eq i64 %_0.sroa.0.1.i, 2
  br i1 %90, label %bb47, label %bb32

bb47:                                             ; preds = %"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1db800c841482e56E.exit.thread", %"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1db800c841482e56E.exit"
  call void @llvm.lifetime.start.p0(i64 128, ptr nonnull %event)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_55)
; call solana_sysvar::clock::<impl solana_sysvar::Sysvar for solana_clock::Clock>::get
  call void @"_ZN13solana_sysvar5clock71_$LT$impl$u20$solana_sysvar..Sysvar$u20$for$u20$solana_clock..Clock$GT$3get17h0c5111a066f59c1cE"(ptr noalias nocapture noundef nonnull sret([48 x i8]) align 8 dereferenceable(48) %_55) #19
  %_178 = load i64, ptr %_55, align 8, !range !10, !noundef !2
  %trunc.not = icmp eq i64 %_178, 0
  br i1 %trunc.not, label %bb49, label %bb48

bb49:                                             ; preds = %bb47
  %_179.sroa.8.0..sroa_idx = getelementptr inbounds i8, ptr %_55, i64 40
  %_179.sroa.8.0.copyload = load i64, ptr %_179.sroa.8.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_55)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_57)
  %_126 = load ptr, ptr %a, align 8, !nonnull !2, !align !70, !noundef !2
  %91 = getelementptr inbounds i8, ptr %_126, i64 40
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_57, ptr noundef nonnull align 8 dereferenceable(32) %91, i64 32, i1 false)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_58)
; call pump_amm_recovered::utils::bonding_curve
  call void @_ZN18pump_amm_recovered5utils13bonding_curve17haaeab9b6da598483E(ptr noalias nocapture noundef nonnull sret([32 x i8]) align 1 dereferenceable(32) %_58, ptr noalias noundef nonnull readonly align 1 dereferenceable(32) %91) #19
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_60)
  %_128 = load ptr, ptr %a, align 8, !nonnull !2, !align !70, !noundef !2
  %_184 = load ptr, ptr %_128, align 8, !nonnull !2, !align !70, !noundef !2
  %_185 = load ptr, ptr %_184, align 8, !nonnull !2, !align !11, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_60, ptr noundef nonnull align 1 dereferenceable(32) %_185, i64 32, i1 false)
  %92 = getelementptr inbounds i8, ptr %_128, i64 232
  %_61 = load i128, ptr %92, align 8, !noundef !2
  %_130 = load ptr, ptr %10, align 8, !nonnull !2, !align !70, !noundef !2
  %93 = getelementptr inbounds i8, ptr %_130, i64 104
  %_62 = load i64, ptr %93, align 8, !noundef !2
  %94 = getelementptr inbounds i8, ptr %event, i64 112
  store i64 %_179.sroa.8.0.copyload, ptr %94, align 8
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %event, ptr noundef nonnull align 1 dereferenceable(32) %_57, i64 32, i1 false)
  %95 = getelementptr inbounds i8, ptr %event, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %95, ptr noundef nonnull align 1 dereferenceable(32) %_58, i64 32, i1 false)
  %96 = getelementptr inbounds i8, ptr %event, i64 64
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %96, ptr noundef nonnull align 1 dereferenceable(32) %_60, i64 32, i1 false)
  %97 = getelementptr inbounds i8, ptr %event, i64 96
  store i128 %_61, ptr %97, align 8
  %98 = getelementptr inbounds i8, ptr %event, i64 120
  store i64 %_62, ptr %98, align 8
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_60)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_58)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_57)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_66)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_68)
; call <pump_amm_recovered::instructions::boost::InitBoostEvent as anchor_lang::Event>::data
  call void @"_ZN94_$LT$pump_amm_recovered..instructions..boost..InitBoostEvent$u20$as$u20$anchor_lang..Event$GT$4data17h6882ce6ddcf4aadfE"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_68, ptr noalias noundef nonnull readonly align 8 dereferenceable(128) %event) #19
  %99 = getelementptr inbounds i8, ptr %_68, i64 8
  %_188 = load ptr, ptr %99, align 8, !nonnull !2, !noundef !2
  %100 = getelementptr inbounds i8, ptr %_68, i64 16
  %_187 = load i64, ptr %100, align 8, !noundef !2
  store ptr %_188, ptr %_66, align 8
  %101 = getelementptr inbounds i8, ptr %_66, i64 8
  store i64 %_187, ptr %101, align 8
; call solana_program::log::sol_log_data
  call void @_ZN14solana_program3log12sol_log_data17h0e9d6cc0899543bbE(ptr noalias noundef nonnull readonly align 8 %_66, i64 noundef 1) #19
  %_68.val = load i64, ptr %_68, align 8, !noundef !2
  %102 = icmp eq i64 %_68.val, 0
  br i1 %102, label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i": ; preds = %bb49
  call void @__rust_dealloc(ptr noundef nonnull %_188, i64 noundef %_68.val, i64 noundef 1) #19
  br label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit"

"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit": ; preds = %bb49, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i"
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_68)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_66)
  %_71 = getelementptr inbounds i8, ptr %a, i64 96
; call <solana_account_info::AccountInfo as core::clone::Clone>::clone
  call fastcc void @"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %authority_info, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %_71) #19
  %103 = getelementptr inbounds i8, ptr %ctx, i64 34
  %authority_bump = load i8, ptr %103, align 2, !noundef !2
; call <pump_amm_recovered::instructions::boost::InitBoostEvent as anchor_lang::Event>::data
  call void @"_ZN94_$LT$pump_amm_recovered..instructions..boost..InitBoostEvent$u20$as$u20$anchor_lang..Event$GT$4data17h6882ce6ddcf4aadfE"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %inner_data, ptr noalias noundef nonnull readonly align 8 dereferenceable(128) %event) #19
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %ix_data)
  %me.sroa.0.0.copyload.i = load i64, ptr %inner_data, align 8, !alias.scope !89, !noalias !92
  %me.sroa.4.0.self.sroa_idx.i = getelementptr inbounds i8, ptr %inner_data, i64 8
  %me.sroa.4.0.copyload.i = load ptr, ptr %me.sroa.4.0.self.sroa_idx.i, align 8, !alias.scope !89, !noalias !92, !nonnull !2, !noundef !2
  %me.sroa.5.0.self.sroa_idx.i = getelementptr inbounds i8, ptr %inner_data, i64 16
  %me.sroa.5.0.copyload.i = load i64, ptr %me.sroa.5.0.self.sroa_idx.i, align 8, !alias.scope !89, !noalias !92
  %_18.i = getelementptr inbounds i8, ptr %me.sroa.4.0.copyload.i, i64 %me.sroa.5.0.copyload.i
  %104 = getelementptr inbounds i8, ptr %_77, i64 32
  store ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, ptr %104, align 8
  %105 = getelementptr inbounds i8, ptr %_77, i64 40
  store ptr getelementptr inbounds (<{ [8 x i8] }>, ptr @alloc_d1e50873cb16f1fc41ca481a2a657dfa, i64 1, i32 0, i64 0), ptr %105, align 8
  store ptr %me.sroa.4.0.copyload.i, ptr %_77, align 8
  %_198.sroa.4.0._77.sroa_idx = getelementptr inbounds i8, ptr %_77, i64 8
  store ptr %me.sroa.4.0.copyload.i, ptr %_198.sroa.4.0._77.sroa_idx, align 8
  %_198.sroa.5.0._77.sroa_idx = getelementptr inbounds i8, ptr %_77, i64 16
  store i64 %me.sroa.0.0.copyload.i, ptr %_198.sroa.5.0._77.sroa_idx, align 8
  %_198.sroa.6.0._77.sroa_idx = getelementptr inbounds i8, ptr %_77, i64 24
  store ptr %_18.i, ptr %_198.sroa.6.0._77.sroa_idx, align 8
; call <alloc::vec::Vec<T> as alloc::vec::spec_from_iter::SpecFromIter<T,I>>::from_iter
  call fastcc void @"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h64efd261fcb332ffE"(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %ix_data, ptr noalias nocapture noundef nonnull align 8 dereferenceable(48) %_77) #19
  call void @llvm.lifetime.start.p0(i64 80, ptr nonnull %ix)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_82)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_82, ptr noundef nonnull align 1 dereferenceable(32) @_ZN18pump_amm_recovered2ID17h808a92cd622e7a23E, i64 32, i1 false)
  %106 = getelementptr inbounds i8, ptr %ix_data, i64 8
  %_201 = load ptr, ptr %106, align 8, !nonnull !2, !noundef !2
  %107 = getelementptr inbounds i8, ptr %ix_data, i64 16
  %_200 = load i64, ptr %107, align 8, !noundef !2
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_85)
; call alloc::alloc::exchange_malloc
  %_87 = call fastcc noundef ptr @_ZN5alloc5alloc15exchange_malloc17h6cd8dd11b0e3424eE() #19
  %_131 = load ptr, ptr %authority_info, align 8, !nonnull !2, !align !11, !noundef !2
  call void @llvm.memmove.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_87, ptr noundef nonnull align 1 dereferenceable(32) %_131, i64 32, i1 false)
  %_89.sroa.4.0..sroa_idx = getelementptr inbounds i8, ptr %_87, i64 32
  store i8 1, ptr %_89.sroa.4.0..sroa_idx, align 1
  %_89.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_87, i64 33
  store i8 0, ptr %_89.sroa.5.0..sroa_idx, align 1
  store i64 1, ptr %_85, align 8, !alias.scope !94, !noalias !97
  %108 = getelementptr inbounds i8, ptr %_85, i64 8
  store ptr %_87, ptr %108, align 8, !alias.scope !94, !noalias !97
  %109 = getelementptr inbounds i8, ptr %_85, i64 16
  store i64 1, ptr %109, align 8, !alias.scope !94, !noalias !97
; call solana_instruction::Instruction::new_with_bytes
  call void @_ZN18solana_instruction11Instruction14new_with_bytes17h2a18064ce4a85141E(ptr noalias nocapture noundef nonnull sret([80 x i8]) align 8 dereferenceable(80) %ix, ptr noalias nocapture noundef nonnull readonly align 1 dereferenceable(32) %_82, ptr noalias noundef nonnull readonly align 1 %_201, i64 noundef %_200, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_85) #19
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_85)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_82)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_97)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %_97, ptr noundef nonnull align 8 dereferenceable(48) %authority_info, i64 48, i1 false)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_100)
  call void @llvm.lifetime.start.p0(i64 32, ptr nonnull %_103)
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %_107)
  store i8 %authority_bump, ptr %_107, align 1
  store ptr @alloc_7a7952b5e0d15f2b72d0341cef6d4739, ptr %_103, align 8
  %110 = getelementptr inbounds i8, ptr %_103, i64 8
  store i64 17, ptr %110, align 8
  %111 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_103, i64 0, i64 1
  store ptr %_107, ptr %111, align 8
  %112 = getelementptr inbounds [2 x { ptr, i64 }], ptr %_103, i64 0, i64 1, i32 1
  store i64 1, ptr %112, align 8
  store ptr %_103, ptr %_100, align 8
  %113 = getelementptr inbounds i8, ptr %_100, i64 8
  store i64 2, ptr %113, align 8
; call solana_program::program::invoke_signed
  call void @_ZN14solana_program7program13invoke_signed17hcf4e7a0d8dc0ee99E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_93, ptr noalias noundef nonnull readonly align 8 dereferenceable(80) %ix, ptr noalias noundef nonnull readonly align 8 %_97, i64 noundef 1, ptr noalias noundef nonnull readonly align 8 %_100, i64 noundef 1) #19
  %114 = load i64, ptr %_93, align 8, !range !87, !noundef !2
  %115 = icmp eq i64 %114, -9223372036854775782
  br i1 %115, label %bb55, label %bb54

bb48:                                             ; preds = %bb47
  %116 = getelementptr inbounds i8, ptr %_55, i64 8
  %_180.sroa.0.0.copyload = load i64, ptr %116, align 8
  %_180.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_55, i64 16
  %_180.sroa.5.0.copyload = load i64, ptr %_180.sroa.5.0..sroa_idx, align 8
  %_180.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_55, i64 24
  %_180.sroa.6.0.copyload = load i64, ptr %_180.sroa.6.0..sroa_idx, align 8
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_55)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_182)
  store i64 %_180.sroa.0.0.copyload, ptr %_182, align 8
  %residual3.sroa.2.0._182.sroa_idx = getelementptr inbounds i8, ptr %_182, i64 8
  store i64 %_180.sroa.5.0.copyload, ptr %residual3.sroa.2.0._182.sroa_idx, align 8
  %residual3.sroa.3.0._182.sroa_idx = getelementptr inbounds i8, ptr %_182, i64 16
  store i64 %_180.sroa.6.0.copyload, ptr %residual3.sroa.3.0._182.sroa_idx, align 8
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %117 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17h2734901f082d5dd2E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_182) #19
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_182)
  br label %bb31

bb55:                                             ; preds = %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit"
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_107)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_103)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_100)
  %118 = getelementptr inbounds i8, ptr %_97, i64 8
  %_97.val31 = load ptr, ptr %118, align 8, !nonnull !2, !noundef !2
  %119 = getelementptr inbounds i8, ptr %_97, i64 16
  %_97.val32 = load ptr, ptr %119, align 8
; call core::ptr::drop_in_place<solana_account_info::AccountInfo>
  call fastcc void @"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h5f1c8e7e6cd82dc9E"(ptr nonnull %_97.val31, ptr %_97.val32) #19
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_97)
; call core::ptr::drop_in_place<solana_instruction::Instruction>
  call fastcc void @"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h2e34e619fca25b95E"(ptr noalias noundef nonnull align 8 dereferenceable(80) %ix) #19
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix)
  %ix_data.val21 = load i64, ptr %ix_data, align 8, !noundef !2
  %120 = icmp eq i64 %ix_data.val21, 0
  br i1 %120, label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit52", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i51"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i51": ; preds = %bb55
  call void @__rust_dealloc(ptr noundef nonnull %_201, i64 noundef %ix_data.val21, i64 noundef 1) #19
  br label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit52"

"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit52": ; preds = %bb55, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i51"
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data)
  call void @llvm.lifetime.end.p0(i64 128, ptr nonnull %event)
  call void @llvm.lifetime.end.p0(i64 96, ptr nonnull %_30)
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %bump)
  call void @llvm.lifetime.end.p0(i64 2, ptr nonnull %index)
  %authority_account.val28 = load ptr, ptr %46, align 8, !nonnull !2, !noundef !2
  %authority_account.val29 = load ptr, ptr %47, align 8
; call core::ptr::drop_in_place<solana_account_info::AccountInfo>
  call fastcc void @"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h5f1c8e7e6cd82dc9E"(ptr nonnull %authority_account.val28, ptr %authority_account.val29) #19
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %authority_account)
  %quote_token_program.val26 = load ptr, ptr %29, align 8, !nonnull !2, !noundef !2
  %quote_token_program.val27 = load ptr, ptr %30, align 8
; call core::ptr::drop_in_place<solana_account_info::AccountInfo>
  call fastcc void @"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h5f1c8e7e6cd82dc9E"(ptr nonnull %quote_token_program.val26, ptr %quote_token_program.val27) #19
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %quote_token_program)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %authority)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %creator)
  br label %bb37

bb54:                                             ; preds = %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit"
; call <anchor_lang::error::Error as core::convert::From<solana_program_error::ProgramError>>::from
  %121 = call { i64, ptr } @"_ZN107_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$solana_program_error..ProgramError$GT$$GT$4from17h2734901f082d5dd2E"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_93) #19
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %_107)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %_103)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_100)
  %122 = getelementptr inbounds i8, ptr %_97, i64 8
  %_97.val = load ptr, ptr %122, align 8, !nonnull !2, !noundef !2
  %123 = getelementptr inbounds i8, ptr %_97, i64 16
  %_97.val30 = load ptr, ptr %123, align 8
; call core::ptr::drop_in_place<solana_account_info::AccountInfo>
  call fastcc void @"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h5f1c8e7e6cd82dc9E"(ptr nonnull %_97.val, ptr %_97.val30) #19
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_97)
; call core::ptr::drop_in_place<solana_instruction::Instruction>
  call fastcc void @"_ZN4core3ptr52drop_in_place$LT$solana_instruction..Instruction$GT$17h2e34e619fca25b95E"(ptr noalias noundef nonnull align 8 dereferenceable(80) %ix) #19
  call void @llvm.lifetime.end.p0(i64 80, ptr nonnull %ix)
  %ix_data.val = load i64, ptr %ix_data, align 8, !noundef !2
  %124 = icmp eq i64 %ix_data.val, 0
  br i1 %124, label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit54", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i53"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i53": ; preds = %bb54
  call void @__rust_dealloc(ptr noundef nonnull %_201, i64 noundef %ix_data.val, i64 noundef 1) #19
  br label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit54"

"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit54": ; preds = %bb54, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i53"
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %ix_data)
  br label %bb31

bb37:                                             ; preds = %bb36, %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit52"
  %_0.sroa.9.0 = phi ptr [ %_0.sroa.9.3, %bb36 ], [ undef, %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit52" ]
  %_0.sroa.0.0 = phi i64 [ %_0.sroa.0.3, %bb36 ], [ 2, %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit52" ]
  %125 = insertvalue { i64, ptr } poison, i64 %_0.sroa.0.0, 0
  %126 = insertvalue { i64, ptr } %125, ptr %_0.sroa.9.0, 1
  ret { i64, ptr } %126

bb31:                                             ; preds = %bb48, %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit54"
  %.pn = phi { i64, ptr } [ %117, %bb48 ], [ %121, %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h89d39154bc9cb7beE.exit54" ]
  %_0.sroa.0.1 = extractvalue { i64, ptr } %.pn, 0
  call void @llvm.lifetime.end.p0(i64 128, ptr nonnull %event)
  br label %bb32

bb32:                                             ; preds = %"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1db800c841482e56E.exit", %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit49", %bb31
  %.pn.pn = phi { i64, ptr } [ %.pn, %bb31 ], [ %69, %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit49" ], [ %89, %"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1db800c841482e56E.exit" ]
  %_0.sroa.0.2 = phi i64 [ %_0.sroa.0.1, %bb31 ], [ %70, %"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE.exit49" ], [ %_0.sroa.0.1.i, %"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1db800c841482e56E.exit" ]
  %_0.sroa.9.2 = extractvalue { i64, ptr } %.pn.pn, 1
  call void @llvm.lifetime.end.p0(i64 96, ptr nonnull %_30)
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %bump)
  call void @llvm.lifetime.end.p0(i64 2, ptr nonnull %index)
  %authority_account.val = load ptr, ptr %46, align 8, !nonnull !2, !noundef !2
  %authority_account.val25 = load ptr, ptr %47, align 8
  %self1.val.i.i.i = load i64, ptr %authority_account.val, align 8, !noundef !2
  %val.i.i.i = add i64 %self1.val.i.i.i, -1
  store i64 %val.i.i.i, ptr %authority_account.val, align 8
  %127 = icmp eq i64 %val.i.i.i, 0
  br i1 %127, label %bb1.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h430f4539b493dfc4E.exit.i"

bb1.i.i.i:                                        ; preds = %bb32
  %128 = getelementptr i8, ptr %authority_account.val, i64 8
  %self2.val.i.i.i = load i64, ptr %128, align 8, !noundef !2
  %val6.i.i.i = add i64 %self2.val.i.i.i, -1
  store i64 %val6.i.i.i, ptr %128, align 8
  %129 = icmp eq i64 %val6.i.i.i, 0
  br i1 %129, label %bb3.i.i.i, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h430f4539b493dfc4E.exit.i"

bb3.i.i.i:                                        ; preds = %bb1.i.i.i
  call void @__rust_dealloc(ptr noundef nonnull %authority_account.val, i64 noundef 32, i64 noundef 8) #19
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h430f4539b493dfc4E.exit.i"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h430f4539b493dfc4E.exit.i": ; preds = %bb3.i.i.i, %bb1.i.i.i, %bb32
  %130 = icmp ne ptr %authority_account.val25, null
  call void @llvm.assume(i1 %130)
  %self1.val.i.i2.i = load i64, ptr %authority_account.val25, align 8, !noundef !2
  %val.i.i3.i = add i64 %self1.val.i.i2.i, -1
  store i64 %val.i.i3.i, ptr %authority_account.val25, align 8
  %131 = icmp eq i64 %val.i.i3.i, 0
  br i1 %131, label %bb1.i.i4.i, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h5f1c8e7e6cd82dc9E.exit"

bb1.i.i4.i:                                       ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h430f4539b493dfc4E.exit.i"
  %132 = getelementptr i8, ptr %authority_account.val25, i64 8
  %self2.val.i.i5.i = load i64, ptr %132, align 8, !noundef !2
  %val6.i.i6.i = add i64 %self2.val.i.i5.i, -1
  store i64 %val6.i.i6.i, ptr %132, align 8
  %133 = icmp eq i64 %val6.i.i6.i, 0
  br i1 %133, label %bb3.i.i7.i, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h5f1c8e7e6cd82dc9E.exit"

bb3.i.i7.i:                                       ; preds = %bb1.i.i4.i
  call void @__rust_dealloc(ptr noundef nonnull %authority_account.val25, i64 noundef 40, i64 noundef 8) #19
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h5f1c8e7e6cd82dc9E.exit"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h5f1c8e7e6cd82dc9E.exit": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h430f4539b493dfc4E.exit.i", %bb1.i.i4.i, %bb3.i.i7.i
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %authority_account)
  %quote_token_program.val = load ptr, ptr %29, align 8, !nonnull !2, !noundef !2
  %quote_token_program.val24 = load ptr, ptr %30, align 8
  %self1.val.i.i.i55 = load i64, ptr %quote_token_program.val, align 8, !noundef !2
  %val.i.i.i56 = add i64 %self1.val.i.i.i55, -1
  store i64 %val.i.i.i56, ptr %quote_token_program.val, align 8
  %134 = icmp eq i64 %val.i.i.i56, 0
  br i1 %134, label %bb1.i.i.i64, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h430f4539b493dfc4E.exit.i57"

bb1.i.i.i64:                                      ; preds = %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h5f1c8e7e6cd82dc9E.exit"
  %135 = getelementptr i8, ptr %quote_token_program.val, i64 8
  %self2.val.i.i.i65 = load i64, ptr %135, align 8, !noundef !2
  %val6.i.i.i66 = add i64 %self2.val.i.i.i65, -1
  store i64 %val6.i.i.i66, ptr %135, align 8
  %136 = icmp eq i64 %val6.i.i.i66, 0
  br i1 %136, label %bb3.i.i.i67, label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h430f4539b493dfc4E.exit.i57"

bb3.i.i.i67:                                      ; preds = %bb1.i.i.i64
  call void @__rust_dealloc(ptr noundef nonnull %quote_token_program.val, i64 noundef 32, i64 noundef 8) #19
  br label %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h430f4539b493dfc4E.exit.i57"

"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h430f4539b493dfc4E.exit.i57": ; preds = %bb3.i.i.i67, %bb1.i.i.i64, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h5f1c8e7e6cd82dc9E.exit"
  %137 = icmp ne ptr %quote_token_program.val24, null
  call void @llvm.assume(i1 %137)
  %self1.val.i.i2.i58 = load i64, ptr %quote_token_program.val24, align 8, !noundef !2
  %val.i.i3.i59 = add i64 %self1.val.i.i2.i58, -1
  store i64 %val.i.i3.i59, ptr %quote_token_program.val24, align 8
  %138 = icmp eq i64 %val.i.i3.i59, 0
  br i1 %138, label %bb1.i.i4.i60, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h5f1c8e7e6cd82dc9E.exit68"

bb1.i.i4.i60:                                     ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h430f4539b493dfc4E.exit.i57"
  %139 = getelementptr i8, ptr %quote_token_program.val24, i64 8
  %self2.val.i.i5.i61 = load i64, ptr %139, align 8, !noundef !2
  %val6.i.i6.i62 = add i64 %self2.val.i.i5.i61, -1
  store i64 %val6.i.i6.i62, ptr %139, align 8
  %140 = icmp eq i64 %val6.i.i6.i62, 0
  br i1 %140, label %bb3.i.i7.i63, label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h5f1c8e7e6cd82dc9E.exit68"

bb3.i.i7.i63:                                     ; preds = %bb1.i.i4.i60
  call void @__rust_dealloc(ptr noundef nonnull %quote_token_program.val24, i64 noundef 40, i64 noundef 8) #19
  br label %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h5f1c8e7e6cd82dc9E.exit68"

"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h5f1c8e7e6cd82dc9E.exit68": ; preds = %"_ZN4core3ptr84drop_in_place$LT$alloc..rc..Rc$LT$core..cell..RefCell$LT$$RF$mut$u20$u64$GT$$GT$$GT$17h430f4539b493dfc4E.exit.i57", %bb1.i.i4.i60, %bb3.i.i7.i63
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %quote_token_program)
  br label %bb36

bb36:                                             ; preds = %bb40, %bb4, %start, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h5f1c8e7e6cd82dc9E.exit68", %bb39
  %_0.sroa.9.3 = phi ptr [ %_0.sroa.9.2, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h5f1c8e7e6cd82dc9E.exit68" ], [ %_161.1, %bb39 ], [ undef, %start ], [ undef, %bb4 ], [ undef, %bb40 ]
  %_0.sroa.0.3 = phi i64 [ %_0.sroa.0.2, %"_ZN4core3ptr53drop_in_place$LT$solana_account_info..AccountInfo$GT$17h5f1c8e7e6cd82dc9E.exit68" ], [ %14, %bb39 ], [ 2, %start ], [ 2, %bb4 ], [ 2, %bb40 ]
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %authority)
  call void @llvm.lifetime.end.p0(i64 32, ptr nonnull %creator)
  br label %bb37
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
!5 = distinct !{!5, !6, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14grow_amortized17habd2dbc019aecebcE: %self"}
!6 = distinct !{!6, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14grow_amortized17habd2dbc019aecebcE"}
!7 = !{!8}
!8 = distinct !{!8, !9, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hebb24428a4271b88E: %_0"}
!9 = distinct !{!9, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hebb24428a4271b88E"}
!10 = !{i64 0, i64 2}
!11 = !{i64 1}
!12 = !{i8 0, i8 2}
!13 = !{!14}
!14 = distinct !{!14, !15, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h7b1ee4d6f9d724ccE: %iterator"}
!15 = distinct !{!15, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h7b1ee4d6f9d724ccE"}
!16 = !{!17, !14}
!17 = distinct !{!17, !15, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h7b1ee4d6f9d724ccE: %_0"}
!18 = !{!17}
!19 = !{!20, !14}
!20 = distinct !{!20, !21, !"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17h8a01ced5281eac18E: %self"}
!21 = distinct !{!21, !"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17h8a01ced5281eac18E"}
!22 = !{!23, !17}
!23 = distinct !{!23, !21, !"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$9size_hint17h8a01ced5281eac18E: %_0"}
!24 = !{!25, !17, !14}
!25 = distinct !{!25, !26, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h4387f549939feed8E: %_0"}
!26 = distinct !{!26, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h4387f549939feed8E"}
!27 = !{!28}
!28 = distinct !{!28, !29, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17hbb4ccdcb87326f9fE: %self"}
!29 = distinct !{!29, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17hbb4ccdcb87326f9fE"}
!30 = !{!31}
!31 = distinct !{!31, !32, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17hd24b1175e882517eE: %self"}
!32 = distinct !{!32, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17hd24b1175e882517eE"}
!33 = !{!34, !35, !17, !14}
!34 = distinct !{!34, !32, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17hd24b1175e882517eE: %iterator"}
!35 = distinct !{!35, !29, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17hbb4ccdcb87326f9fE: %iterator"}
!36 = !{!31, !28}
!37 = !{!38, !40, !42, !44, !45, !47, !31, !34, !28, !35, !17, !14}
!38 = distinct !{!38, !39, !"_ZN91_$LT$core..slice..iter..Iter$LT$T$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h5b65e42e8753b1ebE: argument 0"}
!39 = distinct !{!39, !"_ZN91_$LT$core..slice..iter..Iter$LT$T$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h5b65e42e8753b1ebE"}
!40 = distinct !{!40, !41, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h6315eaa759a85395E: %g"}
!41 = distinct !{!41, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h6315eaa759a85395E"}
!42 = distinct !{!42, !43, !"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h637af995e93dfb49E: %self"}
!43 = distinct !{!43, !"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h637af995e93dfb49E"}
!44 = distinct !{!44, !43, !"_ZN106_$LT$core..iter..adapters..chain..Chain$LT$A$C$B$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h637af995e93dfb49E: %f"}
!45 = distinct !{!45, !46, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h4e81ad8b9588310dE: %self"}
!46 = distinct !{!46, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h4e81ad8b9588310dE"}
!47 = distinct !{!47, !46, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h4e81ad8b9588310dE: %f"}
!48 = !{!49, !51, !38, !40, !42, !44, !45, !47, !31, !34, !28, !35, !17, !14}
!49 = distinct !{!49, !50, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17h6885f3a6be0b54aaE: %_1"}
!50 = distinct !{!50, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17h6885f3a6be0b54aaE"}
!51 = distinct !{!51, !52, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17h72296bb633825e1cE: %_1"}
!52 = distinct !{!52, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17h72296bb633825e1cE"}
!53 = !{!54, !56, !58, !42, !44, !45, !47, !31, !34, !28, !35, !17, !14}
!54 = distinct !{!54, !55, !"_ZN103_$LT$alloc..vec..into_iter..IntoIter$LT$T$C$A$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4next17hba4229e831a75a19E: %self"}
!55 = distinct !{!55, !"_ZN103_$LT$alloc..vec..into_iter..IntoIter$LT$T$C$A$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4next17hba4229e831a75a19E"}
!56 = distinct !{!56, !57, !"_ZN4core4iter6traits8iterator8Iterator4fold17h064942c95d6d7852E: %self"}
!57 = distinct !{!57, !"_ZN4core4iter6traits8iterator8Iterator4fold17h064942c95d6d7852E"}
!58 = distinct !{!58, !57, !"_ZN4core4iter6traits8iterator8Iterator4fold17h064942c95d6d7852E: %f"}
!59 = !{!60, !62, !56, !58, !42, !44, !45, !47, !31, !34, !28, !35, !17, !14}
!60 = distinct !{!60, !61, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17h6885f3a6be0b54aaE: %_1"}
!61 = distinct !{!61, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17h6885f3a6be0b54aaE"}
!62 = distinct !{!62, !63, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17h72296bb633825e1cE: %_1"}
!63 = distinct !{!63, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17h72296bb633825e1cE"}
!64 = !{!56, !58, !42, !44, !45, !47, !34, !35, !17, !14}
!65 = !{!66, !56, !58, !42, !44, !45, !47, !31, !34, !28, !35, !17, !14}
!66 = distinct !{!66, !67, !"_ZN86_$LT$alloc..vec..into_iter..IntoIter$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h01c8bbcb4b918b08E: %self"}
!67 = distinct !{!67, !"_ZN86_$LT$alloc..vec..into_iter..IntoIter$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h01c8bbcb4b918b08E"}
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
!79 = distinct !{!79, !80, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %_0"}
!80 = distinct !{!80, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE"}
!81 = !{!82}
!82 = distinct !{!82, !80, !"_ZN71_$LT$solana_account_info..AccountInfo$u20$as$u20$core..clone..Clone$GT$5clone17h4ec75bc53a487f4cE: %self"}
!83 = !{!79, !82}
!84 = !{!85}
!85 = distinct !{!85, !86, !"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1db800c841482e56E: %self"}
!86 = distinct !{!86, !"_ZN11anchor_lang8accounts7account16Account$LT$T$GT$6reload17h1db800c841482e56E"}
!87 = !{i64 0, i64 -9223372036854775781}
!88 = !{i32 0, i32 3}
!89 = !{!90}
!90 = distinct !{!90, !91, !"_ZN90_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..iter..traits..collect..IntoIterator$GT$9into_iter17h9a31b857da50c985E: %self"}
!91 = distinct !{!91, !"_ZN90_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..iter..traits..collect..IntoIterator$GT$9into_iter17h9a31b857da50c985E"}
!92 = !{!93}
!93 = distinct !{!93, !91, !"_ZN90_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..iter..traits..collect..IntoIterator$GT$9into_iter17h9a31b857da50c985E: %_0"}
!94 = !{!95}
!95 = distinct !{!95, !96, !"_ZN5alloc5slice4hack8into_vec17h5c71e7b17a745576E: %_0"}
!96 = distinct !{!96, !"_ZN5alloc5slice4hack8into_vec17h5c71e7b17a745576E"}
!97 = !{!98}
!98 = distinct !{!98, !96, !"_ZN5alloc5slice4hack8into_vec17h5c71e7b17a745576E: %b.0"}
