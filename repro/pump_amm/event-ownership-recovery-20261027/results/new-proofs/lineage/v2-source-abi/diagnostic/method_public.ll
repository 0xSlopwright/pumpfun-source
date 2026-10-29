; ModuleID = 'method_public.e153f5330cd3bef3-cgu.0'
source_filename = "method_public.e153f5330cd3bef3-cgu.0"
target datalayout = "e-m:e-p:64:64-i64:64-n32:64-S128"
target triple = "sbf"

@vtable.0 = private unnamed_addr constant <{ ptr, [16 x i8], ptr, ptr, ptr }> <{ ptr @"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h6bc92e6cfbb0a1fdE", [16 x i8] c"\18\00\00\00\00\00\00\00\08\00\00\00\00\00\00\00", ptr @"_ZN58_$LT$alloc..string..String$u20$as$u20$core..fmt..Write$GT$9write_str17h4b62f46a222bd5b2E", ptr @"_ZN58_$LT$alloc..string..String$u20$as$u20$core..fmt..Write$GT$10write_char17hfde5b685689164ccE", ptr @_ZN4core3fmt5Write9write_fmt17h70d6cf21e14341f5E }>, align 8
@alloc_cc656815297f75969399c3f4b1ad3de4 = private unnamed_addr constant <{ [55 x i8] }> <{ [55 x i8] c"a Display implementation returned an error unexpectedly" }>, align 1
@vtable.1 = private unnamed_addr constant <{ ptr, [16 x i8], ptr }> <{ ptr @"_ZN4core3ptr37drop_in_place$LT$core..fmt..Error$GT$17h7dcfcd2438fa474fE", [16 x i8] c"\00\00\00\00\00\00\00\00\01\00\00\00\00\00\00\00", ptr @"_ZN53_$LT$core..fmt..Error$u20$as$u20$core..fmt..Debug$GT$3fmt17h85666afa16c4890eE" }>, align 8
@alloc_0c7342d701a2219de6bddb6c078f5127 = private unnamed_addr constant <{ [84 x i8] }> <{ [84 x i8] c"/home/runner/work/platform-tools/platform-tools/out/rust/library/alloc/src/string.rs" }>, align 1
@alloc_d5d9fccaf545b6e0545ef73245a3c43f = private unnamed_addr constant <{ ptr, [16 x i8] }> <{ ptr @alloc_0c7342d701a2219de6bddb6c078f5127, [16 x i8] c"T\00\00\00\00\00\00\00\FF\09\00\00\0E\00\00\00" }>, align 8
@alloc_99ac8a81a24cac863217ce4a5cbfabea = private unnamed_addr constant <{ [5 x i8] }> <{ [5 x i8] c"Error" }>, align 1
@alloc_1f1600f67af89fc229573eafc1a3b5f5 = private unnamed_addr constant <{ [4 x i8] }> <{ [4 x i8] c"\17\00\00\00" }>, align 4
@alloc_87a669f3b9d62b27d278f66f77744caa = private unnamed_addr constant <{ [16 x i8] }> <{ [16 x i8] c"method_public.rs" }>, align 1

; core::fmt::Write::write_fmt
; Function Attrs: nounwind
define internal noundef zeroext i1 @_ZN4core3fmt5Write9write_fmt17h70d6cf21e14341f5E(ptr noalias noundef align 8 dereferenceable(24) %self, ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %args) unnamed_addr #0 {
start:
; call core::fmt::write
  %0 = tail call noundef zeroext i1 @_ZN4core3fmt5write17h7d5c5d972f6bf082E(ptr noundef nonnull align 1 %self, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.0, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(48) %args) #16
  ret i1 %0
}

; core::ptr::drop_in_place<core::fmt::Error>
; Function Attrs: inlinehint mustprogress nofree norecurse nosync nounwind willreturn memory(none)
define internal void @"_ZN4core3ptr37drop_in_place$LT$core..fmt..Error$GT$17h7dcfcd2438fa474fE"(ptr noalias nocapture nonnull readnone align 1 %_1) unnamed_addr #1 {
start:
  ret void
}

; core::ptr::drop_in_place<alloc::string::String>
; Function Attrs: nounwind
define internal void @"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h6bc92e6cfbb0a1fdE"(ptr noalias nocapture noundef readonly align 8 dereferenceable(24) %_1) unnamed_addr #0 {
start:
  %_1.val = load i64, ptr %_1, align 8, !noundef !2
  %0 = icmp eq i64 %_1.val, 0
  br i1 %0, label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h8a4dff4e08cbb960E.exit", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i": ; preds = %start
  %1 = getelementptr inbounds i8, ptr %_1, i64 8
  %_1.val1 = load ptr, ptr %1, align 8, !nonnull !2, !noundef !2
  tail call void @__rust_dealloc(ptr noundef nonnull %_1.val1, i64 noundef %_1.val, i64 noundef 1) #16
  br label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h8a4dff4e08cbb960E.exit"

"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h8a4dff4e08cbb960E.exit": ; preds = %start, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i"
  ret void
}

; <core::fmt::Error as core::fmt::Debug>::fmt
; Function Attrs: inlinehint nounwind
define internal noundef zeroext i1 @"_ZN53_$LT$core..fmt..Error$u20$as$u20$core..fmt..Debug$GT$3fmt17h85666afa16c4890eE"(ptr noalias nocapture nonnull readonly align 1 %self, ptr noalias noundef align 8 dereferenceable(64) %f) unnamed_addr #2 {
start:
; call core::fmt::Formatter::write_str
  %_0 = tail call noundef zeroext i1 @_ZN4core3fmt9Formatter9write_str17h97ca3d8b34e3baaaE(ptr noalias noundef nonnull align 8 dereferenceable(64) %f, ptr noalias noundef nonnull readonly align 1 @alloc_99ac8a81a24cac863217ce4a5cbfabea, i64 noundef 5) #16
  ret i1 %_0
}

; <alloc::string::String as core::fmt::Write>::write_char
; Function Attrs: inlinehint nounwind
define internal noundef zeroext i1 @"_ZN58_$LT$alloc..string..String$u20$as$u20$core..fmt..Write$GT$10write_char17hfde5b685689164ccE"(ptr noalias nocapture noundef align 8 dereferenceable(24) %self, i32 noundef %c) unnamed_addr #2 {
start:
  %_10.sroa.0.i = alloca i32, align 4
  tail call void @llvm.experimental.noalias.scope.decl(metadata !3)
  %_12.i = icmp ult i32 %c, 128
  br i1 %_12.i, label %bb4.i, label %bb12.i.i

bb12.i.i:                                         ; preds = %start
  call void @llvm.lifetime.start.p0(i64 4, ptr nonnull %_10.sroa.0.i)
  store i32 0, ptr %_10.sroa.0.i, align 4, !noalias !3
  %_73.i.i = icmp ult i32 %c, 2048
  br i1 %_73.i.i, label %bb7.i.i, label %bb14.i.i

bb14.i.i:                                         ; preds = %bb12.i.i
  %_74.i.i = icmp ult i32 %c, 65536
  br i1 %_74.i.i, label %bb8.i.i, label %bb9.i.i

bb7.i.i:                                          ; preds = %bb12.i.i
  %_20.i.i = lshr i32 %c, 6
  %0 = trunc i32 %_20.i.i to i8
  %1 = or disjoint i8 %0, -64
  store i8 %1, ptr %_10.sroa.0.i, align 4, !alias.scope !6, !noalias !3
  %2 = trunc i32 %c to i8
  %_22.i.i = and i8 %2, 63
  %3 = or disjoint i8 %_22.i.i, -128
  %_10.sroa.0.i.1.sroa_idx11 = getelementptr inbounds i8, ptr %_10.sroa.0.i, i64 1
  store i8 %3, ptr %_10.sroa.0.i.1.sroa_idx11, align 1, !alias.scope !6, !noalias !3
  br label %_ZN4core4char7methods15encode_utf8_raw17h84badf475ef2bb54E.exit.i

bb8.i.i:                                          ; preds = %bb14.i.i
  %_30.i.i = lshr i32 %c, 12
  %4 = trunc i32 %_30.i.i to i8
  %5 = or disjoint i8 %4, -32
  store i8 %5, ptr %_10.sroa.0.i, align 4, !alias.scope !6, !noalias !3
  %_34.i.i = lshr i32 %c, 6
  %6 = trunc i32 %_34.i.i to i8
  %_32.i.i = and i8 %6, 63
  %7 = or disjoint i8 %_32.i.i, -128
  %_10.sroa.0.i.1.sroa_idx10 = getelementptr inbounds i8, ptr %_10.sroa.0.i, i64 1
  store i8 %7, ptr %_10.sroa.0.i.1.sroa_idx10, align 1, !alias.scope !6, !noalias !3
  %8 = trunc i32 %c to i8
  %_36.i.i = and i8 %8, 63
  %9 = or disjoint i8 %_36.i.i, -128
  %_10.sroa.0.i.2.sroa_idx12 = getelementptr inbounds i8, ptr %_10.sroa.0.i, i64 2
  store i8 %9, ptr %_10.sroa.0.i.2.sroa_idx12, align 2, !alias.scope !6, !noalias !3
  br label %_ZN4core4char7methods15encode_utf8_raw17h84badf475ef2bb54E.exit.i

bb9.i.i:                                          ; preds = %bb14.i.i
  %_45.i.i = lshr i32 %c, 18
  %10 = trunc i32 %_45.i.i to i8
  %_43.i.i = and i8 %10, 7
  %11 = or disjoint i8 %_43.i.i, -16
  store i8 %11, ptr %_10.sroa.0.i, align 4, !alias.scope !6, !noalias !3
  %_49.i.i = lshr i32 %c, 12
  %12 = trunc i32 %_49.i.i to i8
  %_47.i.i = and i8 %12, 63
  %13 = or disjoint i8 %_47.i.i, -128
  %_10.sroa.0.i.1.sroa_idx = getelementptr inbounds i8, ptr %_10.sroa.0.i, i64 1
  store i8 %13, ptr %_10.sroa.0.i.1.sroa_idx, align 1, !alias.scope !6, !noalias !3
  %_53.i.i = lshr i32 %c, 6
  %14 = trunc i32 %_53.i.i to i8
  %_51.i.i = and i8 %14, 63
  %15 = or disjoint i8 %_51.i.i, -128
  %_10.sroa.0.i.2.sroa_idx = getelementptr inbounds i8, ptr %_10.sroa.0.i, i64 2
  store i8 %15, ptr %_10.sroa.0.i.2.sroa_idx, align 2, !alias.scope !6, !noalias !3
  %16 = trunc i32 %c to i8
  %_55.i.i = and i8 %16, 63
  %17 = or disjoint i8 %_55.i.i, -128
  %_10.sroa.0.i.3.sroa_idx = getelementptr inbounds i8, ptr %_10.sroa.0.i, i64 3
  store i8 %17, ptr %_10.sroa.0.i.3.sroa_idx, align 1, !alias.scope !6, !noalias !3
  br label %_ZN4core4char7methods15encode_utf8_raw17h84badf475ef2bb54E.exit.i

_ZN4core4char7methods15encode_utf8_raw17h84badf475ef2bb54E.exit.i: ; preds = %bb9.i.i, %bb8.i.i, %bb7.i.i
  %_510.i.i = phi i64 [ 4, %bb9.i.i ], [ 3, %bb8.i.i ], [ 2, %bb7.i.i ]
  tail call void @llvm.experimental.noalias.scope.decl(metadata !9)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !12)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !15)
  %18 = getelementptr inbounds i8, ptr %self, i64 16
  %len.i.i.i.i.i = load i64, ptr %18, align 8, !alias.scope !18, !noalias !19, !noundef !2
  %19 = load i64, ptr %self, align 8, !alias.scope !21, !noalias !19, !noundef !2
  %_7.i.i.i.i.i = sub i64 %19, %len.i.i.i.i.i
  %_5.i.i.i.i.i = icmp ult i64 %_7.i.i.i.i.i, %_510.i.i
  br i1 %_5.i.i.i.i.i, label %bb1.i.i.i.i.i, label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17hbafba5d5828b9f7eE.exit.i"

bb1.i.i.i.i.i:                                    ; preds = %_ZN4core4char7methods15encode_utf8_raw17h84badf475ef2bb54E.exit.i
; call alloc::raw_vec::RawVec<T,A>::reserve::do_reserve_and_handle
  tail call fastcc void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h0ba88d63bdaad079E"(ptr noalias noundef nonnull align 8 dereferenceable(16) %self, i64 noundef %len.i.i.i.i.i, i64 noundef %_510.i.i) #16, !noalias !19
  %len.pre.i.i.i.i = load i64, ptr %18, align 8, !alias.scope !18, !noalias !19
  br label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17hbafba5d5828b9f7eE.exit.i"

"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17hbafba5d5828b9f7eE.exit.i": ; preds = %bb1.i.i.i.i.i, %_ZN4core4char7methods15encode_utf8_raw17h84badf475ef2bb54E.exit.i
  %len.i.i.i.i = phi i64 [ %len.i.i.i.i.i, %_ZN4core4char7methods15encode_utf8_raw17h84badf475ef2bb54E.exit.i ], [ %len.pre.i.i.i.i, %bb1.i.i.i.i.i ]
  %20 = getelementptr inbounds i8, ptr %self, i64 8
  %self1.i1.i.i.i = load ptr, ptr %20, align 8, !alias.scope !18, !noalias !19, !nonnull !2, !noundef !2
  %dst.i.i.i.i = getelementptr inbounds i8, ptr %self1.i1.i.i.i, i64 %len.i.i.i.i
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(1) %dst.i.i.i.i, ptr noundef nonnull align 4 dereferenceable(1) %_10.sroa.0.i, i64 %_510.i.i, i1 false), !noalias !18
  %21 = add i64 %len.i.i.i.i, %_510.i.i
  store i64 %21, ptr %18, align 8, !alias.scope !18, !noalias !19
  call void @llvm.lifetime.end.p0(i64 4, ptr nonnull %_10.sroa.0.i)
  br label %_ZN5alloc6string6String4push17h96dfc48c19bd6e38E.exit

bb4.i:                                            ; preds = %start
  %_4.i = trunc i32 %c to i8
  tail call void @llvm.experimental.noalias.scope.decl(metadata !24)
  %22 = getelementptr inbounds i8, ptr %self, i64 16
  %len.i.i = load i64, ptr %22, align 8, !alias.scope !27, !noundef !2
  %23 = load i64, ptr %self, align 8, !alias.scope !27, !noundef !2
  %_4.i.i = icmp eq i64 %len.i.i, %23
  br i1 %_4.i.i, label %bb1.i.i, label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$4push17h7b179b3172e20362E.exit.i"

bb1.i.i:                                          ; preds = %bb4.i
; call alloc::raw_vec::RawVec<T,A>::grow_one
  tail call fastcc void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$8grow_one17h460d810f3a374600E"(ptr noalias noundef nonnull align 8 dereferenceable(16) %self) #16
  br label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$4push17h7b179b3172e20362E.exit.i"

"_ZN5alloc3vec16Vec$LT$T$C$A$GT$4push17h7b179b3172e20362E.exit.i": ; preds = %bb1.i.i, %bb4.i
  %24 = getelementptr inbounds i8, ptr %self, i64 8
  %self1.i.i = load ptr, ptr %24, align 8, !alias.scope !27, !nonnull !2, !noundef !2
  %end.i.i = getelementptr inbounds i8, ptr %self1.i.i, i64 %len.i.i
  store i8 %_4.i, ptr %end.i.i, align 1, !noalias !27
  %25 = add i64 %len.i.i, 1
  store i64 %25, ptr %22, align 8, !alias.scope !27
  br label %_ZN5alloc6string6String4push17h96dfc48c19bd6e38E.exit

_ZN5alloc6string6String4push17h96dfc48c19bd6e38E.exit: ; preds = %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17hbafba5d5828b9f7eE.exit.i", %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$4push17h7b179b3172e20362E.exit.i"
  ret i1 false
}

; <alloc::string::String as core::fmt::Write>::write_str
; Function Attrs: inlinehint nounwind
define internal noundef zeroext i1 @"_ZN58_$LT$alloc..string..String$u20$as$u20$core..fmt..Write$GT$9write_str17h4b62f46a222bd5b2E"(ptr noalias nocapture noundef align 8 dereferenceable(24) %self, ptr noalias nocapture noundef nonnull readonly align 1 %s.0, i64 noundef %s.1) unnamed_addr #2 {
start:
  tail call void @llvm.experimental.noalias.scope.decl(metadata !28)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !31)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !34)
  %0 = getelementptr inbounds i8, ptr %self, i64 16
  %len.i.i.i.i = load i64, ptr %0, align 8, !alias.scope !37, !noalias !38, !noundef !2
  %1 = load i64, ptr %self, align 8, !alias.scope !40, !noalias !38, !noundef !2
  %_7.i.i.i.i = sub i64 %1, %len.i.i.i.i
  %_5.i.i.i.i = icmp ult i64 %_7.i.i.i.i, %s.1
  br i1 %_5.i.i.i.i, label %bb1.i.i.i.i, label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17hbafba5d5828b9f7eE.exit"

bb1.i.i.i.i:                                      ; preds = %start
; call alloc::raw_vec::RawVec<T,A>::reserve::do_reserve_and_handle
  tail call fastcc void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h0ba88d63bdaad079E"(ptr noalias noundef nonnull align 8 dereferenceable(16) %self, i64 noundef %len.i.i.i.i, i64 noundef %s.1) #16, !noalias !38
  %len.pre.i.i.i = load i64, ptr %0, align 8, !alias.scope !37, !noalias !38
  br label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17hbafba5d5828b9f7eE.exit"

"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17hbafba5d5828b9f7eE.exit": ; preds = %start, %bb1.i.i.i.i
  %len.i.i.i = phi i64 [ %len.i.i.i.i, %start ], [ %len.pre.i.i.i, %bb1.i.i.i.i ]
  %2 = getelementptr inbounds i8, ptr %self, i64 8
  %self1.i1.i.i = load ptr, ptr %2, align 8, !alias.scope !37, !noalias !38, !nonnull !2, !noundef !2
  %dst.i.i.i = getelementptr inbounds i8, ptr %self1.i1.i.i, i64 %len.i.i.i
  tail call void @llvm.memcpy.p0.p0.i64(ptr nonnull align 1 %dst.i.i.i, ptr nonnull align 1 %s.0, i64 %s.1, i1 false), !noalias !37
  %3 = add i64 %len.i.i.i, %s.1
  store i64 %3, ptr %0, align 8, !alias.scope !37, !noalias !38
  ret i1 false
}

; alloc::raw_vec::finish_grow
; Function Attrs: noinline nounwind
define internal fastcc void @_ZN5alloc7raw_vec11finish_grow17hee6eed026d7d93e4E(ptr dead_on_unwind noalias nocapture noundef writable writeonly align 8 dereferenceable(24) %_0, i64 noundef %0, i64 %1, ptr noalias nocapture noundef readonly align 8 dereferenceable(24) %current_memory) unnamed_addr #3 {
start:
  %2 = icmp eq i64 %0, 0
  br i1 %2, label %bb8, label %bb9

bb9:                                              ; preds = %start
  %3 = getelementptr inbounds i8, ptr %current_memory, i64 8
  %4 = load i64, ptr %3, align 8, !range !43, !noundef !2
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
  %cond = icmp eq i64 %4, %0
  tail call void @llvm.assume(i1 %cond)
  %9 = icmp eq i64 %8, 0
  br i1 %9, label %bb1.i.i, label %bb4.i.i

bb1.i.i:                                          ; preds = %bb3
  %10 = icmp eq i64 %1, 0
  br i1 %10, label %bb6, label %bb5.i.i.i

bb5.i.i.i:                                        ; preds = %bb1.i.i
  %11 = tail call noundef ptr @__rust_alloc(i64 noundef %1, i64 noundef %0) #16
  %12 = icmp eq ptr %11, null
  br i1 %12, label %bb6.thread, label %bb14

bb4.i.i:                                          ; preds = %bb3
  %cond.i.i = icmp ule i64 %8, %1
  tail call void @llvm.assume(i1 %cond.i.i)
  %raw_ptr.i.i = tail call noundef ptr @__rust_realloc(ptr noundef nonnull %ptr, i64 noundef %8, i64 noundef %0, i64 noundef %1) #16
  %13 = icmp eq ptr %raw_ptr.i.i, null
  br i1 %13, label %bb6.thread, label %bb14

bb2:                                              ; preds = %bb9
  %14 = icmp eq i64 %1, 0
  br i1 %14, label %bb6, label %bb5.i.i25

bb5.i.i25:                                        ; preds = %bb2
  %15 = tail call noundef ptr @__rust_alloc(i64 noundef %1, i64 noundef %0) #16
  %16 = icmp eq ptr %15, null
  br i1 %16, label %bb6.thread, label %bb14

bb6.thread:                                       ; preds = %bb4.i.i, %bb5.i.i.i, %bb5.i.i25
  %17 = getelementptr inbounds i8, ptr %_0, i64 8
  %18 = getelementptr inbounds i8, ptr %_0, i64 16
  store i64 %0, ptr %17, align 8
  store i64 %1, ptr %18, align 8
  br label %bb7

bb6:                                              ; preds = %bb2, %bb1.i.i
  %ptr.i.i.i = getelementptr i8, ptr null, i64 %0
  br label %bb14

bb14:                                             ; preds = %bb5.i.i25, %bb4.i.i, %bb5.i.i.i, %bb6
  %_0.sroa.4.0.i.i.pn10 = phi i64 [ 0, %bb6 ], [ %1, %bb5.i.i.i ], [ %1, %bb4.i.i ], [ %1, %bb5.i.i25 ]
  %_0.sroa.0.0.i.i.pn9 = phi ptr [ %ptr.i.i.i, %bb6 ], [ %11, %bb5.i.i.i ], [ %raw_ptr.i.i, %bb4.i.i ], [ %15, %bb5.i.i25 ]
  %19 = getelementptr inbounds i8, ptr %_0, i64 8
  %20 = getelementptr inbounds i8, ptr %_0, i64 16
  store ptr %_0.sroa.0.0.i.i.pn9, ptr %19, align 8
  store i64 %_0.sroa.4.0.i.i.pn10, ptr %20, align 8
  br label %bb7

bb7:                                              ; preds = %bb14, %bb6.thread, %bb8
  %storemerge24 = phi i64 [ 1, %bb8 ], [ 0, %bb14 ], [ 1, %bb6.thread ]
  store i64 %storemerge24, ptr %_0, align 8
  ret void
}

; alloc::raw_vec::RawVec<T,A>::reserve::do_reserve_and_handle
; Function Attrs: cold nounwind
define internal fastcc void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h0ba88d63bdaad079E"(ptr noalias nocapture noundef align 8 dereferenceable(16) %slf, i64 noundef %len, i64 noundef %additional) unnamed_addr #4 {
start:
  %_20.i = alloca [24 x i8], align 8
  %self5.i = alloca [24 x i8], align 8
  tail call void @llvm.experimental.noalias.scope.decl(metadata !44)
  %0 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %len, i64 %additional)
  %_29.1.i = extractvalue { i64, i1 } %0, 1
  br i1 %_29.1.i, label %bb2, label %bb10.i

bb10.i:                                           ; preds = %start
  %_29.0.i = extractvalue { i64, i1 } %0, 0
  %_12.i = load i64, ptr %slf, align 8, !alias.scope !44, !noundef !2
  %1 = shl i64 %_12.i, 1
  %cap.sroa.0.0.sroa.speculated.i = tail call i64 @llvm.umax.i64(i64 %1, i64 %_29.0.i)
  %cap3.sroa.0.0.sroa.speculated.i = tail call i64 @llvm.umax.i64(i64 %cap.sroa.0.0.sroa.speculated.i, i64 8)
  %_4.i.i = icmp sgt i64 %cap3.sroa.0.0.sroa.speculated.i, -1
  %_0.sroa.0.0.i.i = zext i1 %_4.i.i to i64
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %self5.i), !noalias !44
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_20.i), !noalias !44
  %2 = getelementptr inbounds i8, ptr %slf, i64 8
  %3 = icmp eq i64 %_12.i, 0
  br i1 %3, label %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h6611e853133caea7E.exit.i", label %bb4.i.i

bb4.i.i:                                          ; preds = %bb10.i
  %self.val22.i = load ptr, ptr %2, align 8, !alias.scope !44, !nonnull !2, !noundef !2
  store ptr %self.val22.i, ptr %_20.i, align 8, !alias.scope !47, !noalias !44
  %_9.sroa.5.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_20.i, i64 16
  store i64 %_12.i, ptr %_9.sroa.5.0._0.sroa_idx.i.i, align 8, !alias.scope !47, !noalias !44
  br label %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h6611e853133caea7E.exit.i"

"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h6611e853133caea7E.exit.i": ; preds = %bb4.i.i, %bb10.i
  %.sink.i.i = phi i64 [ 1, %bb4.i.i ], [ 0, %bb10.i ]
  %4 = getelementptr inbounds i8, ptr %_20.i, i64 8
  store i64 %.sink.i.i, ptr %4, align 8, !alias.scope !47, !noalias !44
; call alloc::raw_vec::finish_grow
  call fastcc void @_ZN5alloc7raw_vec11finish_grow17hee6eed026d7d93e4E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %self5.i, i64 noundef %_0.sroa.0.0.i.i, i64 %cap3.sroa.0.0.sroa.speculated.i, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_20.i) #16, !noalias !44
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_20.i), !noalias !44
  %_53.i = load i64, ptr %self5.i, align 8, !range !50, !noalias !44, !noundef !2
  %trunc.not.i = icmp eq i64 %_53.i, 0
  %5 = getelementptr inbounds i8, ptr %self5.i, i64 8
  br i1 %trunc.not.i, label %bb3, label %bb20.i

bb20.i:                                           ; preds = %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h6611e853133caea7E.exit.i"
  %e.0.i = load i64, ptr %5, align 8, !range !43, !noalias !44, !noundef !2
  %6 = getelementptr inbounds i8, ptr %self5.i, i64 16
  %e.1.i = load i64, ptr %6, align 8, !noalias !44
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %self5.i), !noalias !44
  br label %bb2

bb2:                                              ; preds = %bb20.i, %start
  %_0.sroa.4.0.i.ph = phi i64 [ undef, %start ], [ %e.1.i, %bb20.i ]
  %_0.sroa.0.0.i.ph = phi i64 [ 0, %start ], [ %e.0.i, %bb20.i ]
; call alloc::raw_vec::handle_error
  tail call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef %_0.sroa.0.0.i.ph, i64 %_0.sroa.4.0.i.ph) #17
  unreachable

bb3:                                              ; preds = %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h6611e853133caea7E.exit.i"
  %v.0.i = load ptr, ptr %5, align 8, !noalias !44, !nonnull !2, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %self5.i), !noalias !44
  store ptr %v.0.i, ptr %2, align 8, !alias.scope !44
  store i64 %cap3.sroa.0.0.sroa.speculated.i, ptr %slf, align 8, !alias.scope !44
  ret void
}

; alloc::raw_vec::RawVec<T,A>::grow_one
; Function Attrs: noinline nounwind
define internal fastcc void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$8grow_one17h460d810f3a374600E"(ptr noalias nocapture noundef align 8 dereferenceable(16) %self) unnamed_addr #3 {
start:
  %_20.i = alloca [24 x i8], align 8
  %self5.i = alloca [24 x i8], align 8
  %_3 = load i64, ptr %self, align 8, !noundef !2
  tail call void @llvm.experimental.noalias.scope.decl(metadata !51)
  %0 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %_3, i64 1)
  %_29.1.i = extractvalue { i64, i1 } %0, 1
  br i1 %_29.1.i, label %bb2, label %bb10.i

bb10.i:                                           ; preds = %start
  %_29.0.i = extractvalue { i64, i1 } %0, 0
  %1 = shl i64 %_3, 1
  %cap.sroa.0.0.sroa.speculated.i = tail call i64 @llvm.umax.i64(i64 %1, i64 %_29.0.i)
  %cap3.sroa.0.0.sroa.speculated.i = tail call i64 @llvm.umax.i64(i64 %cap.sroa.0.0.sroa.speculated.i, i64 8)
  %_4.i.i = icmp sgt i64 %cap3.sroa.0.0.sroa.speculated.i, -1
  %_0.sroa.0.0.i.i = zext i1 %_4.i.i to i64
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %self5.i), !noalias !51
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_20.i), !noalias !51
  %2 = getelementptr inbounds i8, ptr %self, i64 8
  %3 = icmp eq i64 %_3, 0
  br i1 %3, label %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h6611e853133caea7E.exit.i", label %bb4.i.i

bb4.i.i:                                          ; preds = %bb10.i
  %self.val22.i = load ptr, ptr %2, align 8, !alias.scope !51, !nonnull !2, !noundef !2
  store ptr %self.val22.i, ptr %_20.i, align 8, !alias.scope !54, !noalias !51
  %_9.sroa.5.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_20.i, i64 16
  store i64 %_3, ptr %_9.sroa.5.0._0.sroa_idx.i.i, align 8, !alias.scope !54, !noalias !51
  br label %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h6611e853133caea7E.exit.i"

"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h6611e853133caea7E.exit.i": ; preds = %bb4.i.i, %bb10.i
  %.sink.i.i = phi i64 [ 1, %bb4.i.i ], [ 0, %bb10.i ]
  %4 = getelementptr inbounds i8, ptr %_20.i, i64 8
  store i64 %.sink.i.i, ptr %4, align 8, !alias.scope !54, !noalias !51
; call alloc::raw_vec::finish_grow
  call fastcc void @_ZN5alloc7raw_vec11finish_grow17hee6eed026d7d93e4E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %self5.i, i64 noundef %_0.sroa.0.0.i.i, i64 %cap3.sroa.0.0.sroa.speculated.i, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_20.i) #16, !noalias !51
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_20.i), !noalias !51
  %_53.i = load i64, ptr %self5.i, align 8, !range !50, !noalias !51, !noundef !2
  %trunc.not.i = icmp eq i64 %_53.i, 0
  %5 = getelementptr inbounds i8, ptr %self5.i, i64 8
  br i1 %trunc.not.i, label %bb3, label %bb20.i

bb20.i:                                           ; preds = %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h6611e853133caea7E.exit.i"
  %e.0.i = load i64, ptr %5, align 8, !range !43, !noalias !51, !noundef !2
  %6 = getelementptr inbounds i8, ptr %self5.i, i64 16
  %e.1.i = load i64, ptr %6, align 8, !noalias !51
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %self5.i), !noalias !51
  br label %bb2

bb2:                                              ; preds = %bb20.i, %start
  %_0.sroa.4.0.i.ph = phi i64 [ undef, %start ], [ %e.1.i, %bb20.i ]
  %_0.sroa.0.0.i.ph = phi i64 [ 0, %start ], [ %e.0.i, %bb20.i ]
; call alloc::raw_vec::handle_error
  tail call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef %_0.sroa.0.0.i.ph, i64 %_0.sroa.4.0.i.ph) #17
  unreachable

bb3:                                              ; preds = %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h6611e853133caea7E.exit.i"
  %v.0.i = load ptr, ptr %5, align 8, !noalias !51, !nonnull !2, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %self5.i), !noalias !51
  store ptr %v.0.i, ptr %2, align 8, !alias.scope !51
  store i64 %cap3.sroa.0.0.sroa.speculated.i, ptr %self, align 8, !alias.scope !51
  ret void
}

; method_public::BuyResult::total_user_quote
; Function Attrs: nounwind
define hidden void @_ZN13method_public9BuyResult16total_user_quote17h4adcf4a4c02db35bE(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([16 x i8]) align 8 dereferenceable(16) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(96) %self) unnamed_addr #0 {
start:
  %_11.i.i = alloca [0 x i8], align 1
  %formatter.i.i = alloca [64 x i8], align 8
  %buf.i.i = alloca [24 x i8], align 8
  %_3.i = alloca [24 x i8], align 8
  %_2.i = alloca [160 x i8], align 8
  %0 = getelementptr inbounds i8, ptr %self, i64 80
  %_3 = load i64, ptr %0, align 8, !noundef !2
  %1 = getelementptr inbounds i8, ptr %self, i64 72
  %_4 = load i64, ptr %1, align 8, !noundef !2
  %2 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %_3, i64 %_4)
  %_8.1 = extractvalue { i64, i1 } %2, 1
  br i1 %_8.1, label %bb2, label %bb3

bb3:                                              ; preds = %start
  %_8.0 = extractvalue { i64, i1 } %2, 0
  %3 = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %_8.0, ptr %3, align 8
  store i64 2, ptr %_0, align 8
  br label %bb4

bb2:                                              ; preds = %start
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_2.i)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_3.i)
; call pump_amm_recovered::PumpAmmError::name
  call void @_ZN18pump_amm_recovered12PumpAmmError4name17h450aae3bd6299013E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_3.i, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_1f1600f67af89fc229573eafc1a3b5f5) #16
; call pump_amm_recovered::<impl core::convert::From<pump_amm_recovered::PumpAmmError> for u32>::from
  %_4.i = tail call noundef i32 @"_ZN18pump_amm_recovered93_$LT$impl$u20$core..convert..From$LT$pump_amm_recovered..PumpAmmError$GT$$u20$for$u20$u32$GT$4from17ha853179884b7c251E"(i32 noundef 23) #16
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i.i)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i.i), !noalias !57
  store i64 0, ptr %buf.i.i, align 8, !noalias !57
  %_9.sroa.4.0.buf.sroa_idx.i.i = getelementptr inbounds i8, ptr %buf.i.i, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i.i, align 8, !noalias !57
  %_9.sroa.5.0.buf.sroa_idx.i.i = getelementptr inbounds i8, ptr %buf.i.i, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i.i, align 8, !noalias !57
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i.i), !noalias !57
  %4 = getelementptr inbounds i8, ptr %formatter.i.i, i64 52
  store i32 0, ptr %4, align 4, !noalias !57
  %5 = getelementptr inbounds i8, ptr %formatter.i.i, i64 48
  store i32 32, ptr %5, align 8, !noalias !57
  %6 = getelementptr inbounds i8, ptr %formatter.i.i, i64 56
  store i8 3, ptr %6, align 8, !noalias !57
  store i64 0, ptr %formatter.i.i, align 8, !noalias !57
  %7 = getelementptr inbounds i8, ptr %formatter.i.i, i64 16
  store i64 0, ptr %7, align 8, !noalias !57
  %8 = getelementptr inbounds i8, ptr %formatter.i.i, i64 32
  store ptr %buf.i.i, ptr %8, align 8, !noalias !57
  %9 = getelementptr inbounds i8, ptr %formatter.i.i, i64 40
  store ptr @vtable.0, ptr %9, align 8, !noalias !57
; call <pump_amm_recovered::PumpAmmError as core::fmt::Display>::fmt
  %10 = call noundef zeroext i1 @"_ZN71_$LT$pump_amm_recovered..PumpAmmError$u20$as$u20$core..fmt..Display$GT$3fmt17h56303ef102d3d7dbE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_1f1600f67af89fc229573eafc1a3b5f5, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i.i) #16, !noalias !57
  br i1 %10, label %bb3.i.i, label %"_ZN13method_public9BuyResult16total_user_quote28_$u7b$$u7b$closure$u7d$$u7d$17h25711b59cbb159f5E.exit"

bb3.i.i:                                          ; preds = %bb2
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.1, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #17, !noalias !57
  unreachable

"_ZN13method_public9BuyResult16total_user_quote28_$u7b$$u7b$closure$u7d$$u7d$17h25711b59cbb159f5E.exit": ; preds = %bb2
  %11 = getelementptr inbounds i8, ptr %_2.i, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %11, ptr noundef nonnull align 8 dereferenceable(24) %buf.i.i, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i.i), !noalias !57
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i.i), !noalias !57
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i.i)
  %12 = getelementptr inbounds i8, ptr %_2.i, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %12, ptr noundef nonnull align 8 dereferenceable(24) %_3.i, i64 24, i1 false)
  %13 = getelementptr inbounds i8, ptr %_2.i, i64 152
  store i32 %_4.i, ptr %13, align 8
  store i64 0, ptr %_2.i, align 8
  %_6.sroa.4.0._2.sroa_idx.i = getelementptr inbounds i8, ptr %_2.i, i64 8
  store ptr @alloc_87a669f3b9d62b27d278f66f77744caa, ptr %_6.sroa.4.0._2.sroa_idx.i, align 8
  %_6.sroa.4.sroa.4.0._6.sroa.4.0._2.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_2.i, i64 16
  store i64 16, ptr %_6.sroa.4.sroa.4.0._6.sroa.4.0._2.sroa_idx.sroa_idx.i, align 8
  %_6.sroa.4.sroa.5.0._6.sroa.4.0._2.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_2.i, i64 24
  store i32 15, ptr %_6.sroa.4.sroa.5.0._6.sroa.4.0._2.sroa_idx.sroa_idx.i, align 8
  %14 = getelementptr inbounds i8, ptr %_2.i, i64 80
  store i8 2, ptr %14, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_3.i)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %15 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17hefc4a4c4d9276c8eE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_2.i) #16
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_2.i)
  %_10.0 = extractvalue { i64, ptr } %15, 0
  %_10.1 = extractvalue { i64, ptr } %15, 1
  store i64 %_10.0, ptr %_0, align 8
  %16 = getelementptr inbounds i8, ptr %_0, i64 8
  store ptr %_10.1, ptr %16, align 8
  br label %bb4

bb4:                                              ; preds = %"_ZN13method_public9BuyResult16total_user_quote28_$u7b$$u7b$closure$u7d$$u7d$17h25711b59cbb159f5E.exit", %bb3
  ret void
}

; method_public::call
; Function Attrs: nounwind
define hidden void @_ZN13method_public4call17h146f5fe29d7f971cE(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([16 x i8]) align 8 dereferenceable(16) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(96) %result) unnamed_addr #0 {
start:
; call method_public::BuyResult::total_user_quote
  tail call void @_ZN13method_public9BuyResult16total_user_quote17h4adcf4a4c02db35bE(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_0, ptr noalias noundef nonnull readonly align 8 dereferenceable(96) %result) #16
  ret void
}

; Function Attrs: mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite)
declare void @llvm.memcpy.p0.p0.i64(ptr noalias nocapture writeonly, ptr noalias nocapture readonly, i64, i1 immarg) #5

; <pump_amm_recovered::PumpAmmError as core::fmt::Display>::fmt
; Function Attrs: nounwind
declare noundef zeroext i1 @"_ZN71_$LT$pump_amm_recovered..PumpAmmError$u20$as$u20$core..fmt..Display$GT$3fmt17h56303ef102d3d7dbE"(ptr noalias noundef readonly align 4 dereferenceable(4), ptr noalias noundef align 8 dereferenceable(64)) unnamed_addr #0

; core::result::unwrap_failed
; Function Attrs: cold noinline noreturn nounwind
declare void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1, i64 noundef, ptr noundef nonnull align 1, ptr noalias noundef readonly align 8 dereferenceable(24), ptr noalias noundef readonly align 8 dereferenceable(24)) unnamed_addr #6

; Function Attrs: mustprogress nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: write)
declare hidden void @llvm.assume(i1 noundef) #7

; core::fmt::Formatter::write_str
; Function Attrs: nounwind
declare noundef zeroext i1 @_ZN4core3fmt9Formatter9write_str17h97ca3d8b34e3baaaE(ptr noalias noundef align 8 dereferenceable(64), ptr noalias noundef nonnull readonly align 1, i64 noundef) unnamed_addr #0

; Function Attrs: nounwind allockind("alloc,uninitialized,aligned") allocsize(0)
declare noalias noundef ptr @__rust_alloc(i64 noundef, i64 allocalign noundef) unnamed_addr #8

; Function Attrs: nounwind allockind("realloc,aligned") allocsize(3)
declare noalias noundef ptr @__rust_realloc(ptr allocptr noundef, i64 noundef, i64 allocalign noundef, i64 noundef) unnamed_addr #9

; Function Attrs: mustprogress nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare hidden { i64, i1 } @llvm.uadd.with.overflow.i64(i64, i64) #10

; alloc::raw_vec::handle_error
; Function Attrs: cold noreturn nounwind
declare void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef, i64) unnamed_addr #11

; Function Attrs: nounwind allockind("free")
declare void @__rust_dealloc(ptr allocptr noundef, i64 noundef, i64 noundef) unnamed_addr #12

; core::fmt::write
; Function Attrs: nounwind
declare noundef zeroext i1 @_ZN4core3fmt5write17h7d5c5d972f6bf082E(ptr noundef nonnull align 1, ptr noalias noundef readonly align 8 dereferenceable(24), ptr noalias nocapture noundef readonly align 8 dereferenceable(48)) unnamed_addr #0

; pump_amm_recovered::PumpAmmError::name
; Function Attrs: nounwind
declare void @_ZN18pump_amm_recovered12PumpAmmError4name17h450aae3bd6299013E(ptr dead_on_unwind noalias nocapture noundef writable sret([24 x i8]) align 8 dereferenceable(24), ptr noalias noundef readonly align 4 dereferenceable(4)) unnamed_addr #0

; pump_amm_recovered::<impl core::convert::From<pump_amm_recovered::PumpAmmError> for u32>::from
; Function Attrs: nounwind
declare noundef i32 @"_ZN18pump_amm_recovered93_$LT$impl$u20$core..convert..From$LT$pump_amm_recovered..PumpAmmError$GT$$u20$for$u20$u32$GT$4from17ha853179884b7c251E"(i32 noundef) unnamed_addr #0

; <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
; Function Attrs: nounwind
declare { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17hefc4a4c4d9276c8eE"(ptr noalias nocapture noundef readonly align 8 dereferenceable(160)) unnamed_addr #0

; Function Attrs: mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite)
declare void @llvm.lifetime.start.p0(i64 immarg, ptr nocapture) #13

; Function Attrs: mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite)
declare void @llvm.lifetime.end.p0(i64 immarg, ptr nocapture) #13

; Function Attrs: nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: readwrite)
declare void @llvm.experimental.noalias.scope.decl(metadata) #14

; Function Attrs: nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare i64 @llvm.umax.i64(i64, i64) #15

attributes #0 = { nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #1 = { inlinehint mustprogress nofree norecurse nosync nounwind willreturn memory(none) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #2 = { inlinehint nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #3 = { noinline nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #4 = { cold nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #5 = { mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite) }
attributes #6 = { cold noinline noreturn nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #7 = { mustprogress nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: write) }
attributes #8 = { nounwind allockind("alloc,uninitialized,aligned") allocsize(0) "alloc-family"="__rust_alloc" "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #9 = { nounwind allockind("realloc,aligned") allocsize(3) "alloc-family"="__rust_alloc" "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #10 = { mustprogress nocallback nofree nosync nounwind speculatable willreturn memory(none) }
attributes #11 = { cold noreturn nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #12 = { nounwind allockind("free") "alloc-family"="__rust_alloc" "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #13 = { mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite) }
attributes #14 = { nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: readwrite) }
attributes #15 = { nocallback nofree nosync nounwind speculatable willreturn memory(none) }
attributes #16 = { nounwind }
attributes #17 = { noreturn nounwind }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 8, !"PIC Level", i32 2}
!1 = !{!"rustc version 1.79.0-dev"}
!2 = !{}
!3 = !{!4}
!4 = distinct !{!4, !5, !"_ZN5alloc6string6String4push17h96dfc48c19bd6e38E: %self"}
!5 = distinct !{!5, !"_ZN5alloc6string6String4push17h96dfc48c19bd6e38E"}
!6 = !{!7}
!7 = distinct !{!7, !8, !"_ZN4core4char7methods15encode_utf8_raw17h84badf475ef2bb54E: %dst.0"}
!8 = distinct !{!8, !"_ZN4core4char7methods15encode_utf8_raw17h84badf475ef2bb54E"}
!9 = !{!10}
!10 = distinct !{!10, !11, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17hbafba5d5828b9f7eE: %self"}
!11 = distinct !{!11, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17hbafba5d5828b9f7eE"}
!12 = !{!13}
!13 = distinct !{!13, !14, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17hf835be05a771eba6E: %self"}
!14 = distinct !{!14, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17hf835be05a771eba6E"}
!15 = !{!16}
!16 = distinct !{!16, !17, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h89742bcf4bc8d461E: %self"}
!17 = distinct !{!17, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h89742bcf4bc8d461E"}
!18 = !{!16, !13, !10, !4}
!19 = !{!20}
!20 = distinct !{!20, !11, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17hbafba5d5828b9f7eE: %other.0"}
!21 = !{!22, !16, !13, !10, !4}
!22 = distinct !{!22, !23, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h2decb66f9485630fE: %self"}
!23 = distinct !{!23, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h2decb66f9485630fE"}
!24 = !{!25}
!25 = distinct !{!25, !26, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$4push17h7b179b3172e20362E: %self"}
!26 = distinct !{!26, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$4push17h7b179b3172e20362E"}
!27 = !{!25, !4}
!28 = !{!29}
!29 = distinct !{!29, !30, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17hbafba5d5828b9f7eE: %self"}
!30 = distinct !{!30, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17hbafba5d5828b9f7eE"}
!31 = !{!32}
!32 = distinct !{!32, !33, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17hf835be05a771eba6E: %self"}
!33 = distinct !{!33, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17hf835be05a771eba6E"}
!34 = !{!35}
!35 = distinct !{!35, !36, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h89742bcf4bc8d461E: %self"}
!36 = distinct !{!36, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h89742bcf4bc8d461E"}
!37 = !{!35, !32, !29}
!38 = !{!39}
!39 = distinct !{!39, !30, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17hbafba5d5828b9f7eE: %other.0"}
!40 = !{!41, !35, !32, !29}
!41 = distinct !{!41, !42, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h2decb66f9485630fE: %self"}
!42 = distinct !{!42, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h2decb66f9485630fE"}
!43 = !{i64 0, i64 -9223372036854775807}
!44 = !{!45}
!45 = distinct !{!45, !46, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14grow_amortized17h32358133a2f24adfE: %self"}
!46 = distinct !{!46, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14grow_amortized17h32358133a2f24adfE"}
!47 = !{!48}
!48 = distinct !{!48, !49, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h6611e853133caea7E: %_0"}
!49 = distinct !{!49, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h6611e853133caea7E"}
!50 = !{i64 0, i64 2}
!51 = !{!52}
!52 = distinct !{!52, !53, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14grow_amortized17h32358133a2f24adfE: %self"}
!53 = distinct !{!53, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14grow_amortized17h32358133a2f24adfE"}
!54 = !{!55}
!55 = distinct !{!55, !56, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h6611e853133caea7E: %_0"}
!56 = distinct !{!56, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h6611e853133caea7E"}
!57 = !{!58}
!58 = distinct !{!58, !59, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hafe62244214bd810E: %_0"}
!59 = distinct !{!59, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17hafe62244214bd810E"}
