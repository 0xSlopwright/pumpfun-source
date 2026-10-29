; ModuleID = 'method_public_multi.ddede70d49d8f5c5-cgu.0'
source_filename = "method_public_multi.ddede70d49d8f5c5-cgu.0"
target datalayout = "e-m:e-p:64:64-i64:64-n32:64-S128"
target triple = "sbf"

@vtable.0 = private unnamed_addr constant <{ ptr, [16 x i8], ptr, ptr, ptr }> <{ ptr @"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE", [16 x i8] c"\18\00\00\00\00\00\00\00\08\00\00\00\00\00\00\00", ptr @"_ZN58_$LT$alloc..string..String$u20$as$u20$core..fmt..Write$GT$9write_str17h4b62f46a222bd5b2E", ptr @"_ZN58_$LT$alloc..string..String$u20$as$u20$core..fmt..Write$GT$10write_char17hfde5b685689164ccE", ptr @_ZN4core3fmt5Write9write_fmt17h1033032c8916b47fE }>, align 8
@alloc_cc656815297f75969399c3f4b1ad3de4 = private unnamed_addr constant <{ [55 x i8] }> <{ [55 x i8] c"a Display implementation returned an error unexpectedly" }>, align 1
@vtable.1 = private unnamed_addr constant <{ ptr, [16 x i8], ptr }> <{ ptr @"_ZN4core3ptr37drop_in_place$LT$core..fmt..Error$GT$17h48fdba4933fa3f94E", [16 x i8] c"\00\00\00\00\00\00\00\00\01\00\00\00\00\00\00\00", ptr @"_ZN53_$LT$core..fmt..Error$u20$as$u20$core..fmt..Debug$GT$3fmt17h85666afa16c4890eE" }>, align 8
@alloc_0c7342d701a2219de6bddb6c078f5127 = private unnamed_addr constant <{ [84 x i8] }> <{ [84 x i8] c"/home/runner/work/platform-tools/platform-tools/out/rust/library/alloc/src/string.rs" }>, align 1
@alloc_d5d9fccaf545b6e0545ef73245a3c43f = private unnamed_addr constant <{ ptr, [16 x i8] }> <{ ptr @alloc_0c7342d701a2219de6bddb6c078f5127, [16 x i8] c"T\00\00\00\00\00\00\00\FF\09\00\00\0E\00\00\00" }>, align 8
@alloc_99ac8a81a24cac863217ce4a5cbfabea = private unnamed_addr constant <{ [5 x i8] }> <{ [5 x i8] c"Error" }>, align 1
@alloc_1f1600f67af89fc229573eafc1a3b5f5 = private unnamed_addr constant <{ [4 x i8] }> <{ [4 x i8] c"\17\00\00\00" }>, align 4
@alloc_d4fd717091ef596d00441be5892cf33f = private unnamed_addr constant <{ [22 x i8] }> <{ [22 x i8] c"method_public_multi.rs" }>, align 1
@alloc_7bf4d83167a444e3cf51563928dad022 = private unnamed_addr constant <{ [4 x i8] }> <{ [4 x i8] c"\04\00\00\00" }>, align 4

; core::fmt::Write::write_fmt
; Function Attrs: nounwind
define internal noundef zeroext i1 @_ZN4core3fmt5Write9write_fmt17h1033032c8916b47fE(ptr noalias noundef align 8 dereferenceable(24) %self, ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %args) unnamed_addr #0 {
start:
; call core::fmt::write
  %0 = tail call noundef zeroext i1 @_ZN4core3fmt5write17h7d5c5d972f6bf082E(ptr noundef nonnull align 1 %self, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.0, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(48) %args) #16
  ret i1 %0
}

; core::ptr::drop_in_place<core::fmt::Error>
; Function Attrs: inlinehint mustprogress nofree norecurse nosync nounwind willreturn memory(none)
define internal void @"_ZN4core3ptr37drop_in_place$LT$core..fmt..Error$GT$17h48fdba4933fa3f94E"(ptr noalias nocapture nonnull readnone align 1 %_1) unnamed_addr #1 {
start:
  ret void
}

; core::ptr::drop_in_place<alloc::string::String>
; Function Attrs: nounwind
define internal void @"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE"(ptr noalias nocapture noundef readonly align 8 dereferenceable(24) %_1) unnamed_addr #0 {
start:
  %_1.val = load i64, ptr %_1, align 8, !noundef !2
  %0 = icmp eq i64 %_1.val, 0
  br i1 %0, label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h5abfcdc26ca5dbe7E.exit", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i": ; preds = %start
  %1 = getelementptr inbounds i8, ptr %_1, i64 8
  %_1.val1 = load ptr, ptr %1, align 8, !nonnull !2, !noundef !2
  tail call void @__rust_dealloc(ptr noundef nonnull %_1.val1, i64 noundef %_1.val, i64 noundef 1) #16
  br label %"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h5abfcdc26ca5dbe7E.exit"

"_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17h5abfcdc26ca5dbe7E.exit": ; preds = %start, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i"
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
  br i1 %_5.i.i.i.i.i, label %bb1.i.i.i.i.i, label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4e6b266acd8549c0E.exit.i"

bb1.i.i.i.i.i:                                    ; preds = %_ZN4core4char7methods15encode_utf8_raw17h84badf475ef2bb54E.exit.i
; call alloc::raw_vec::RawVec<T,A>::reserve::do_reserve_and_handle
  tail call fastcc void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h9b552dd50a0c679dE"(ptr noalias noundef nonnull align 8 dereferenceable(16) %self, i64 noundef %len.i.i.i.i.i, i64 noundef %_510.i.i) #16, !noalias !19
  %len.pre.i.i.i.i = load i64, ptr %18, align 8, !alias.scope !18, !noalias !19
  br label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4e6b266acd8549c0E.exit.i"

"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4e6b266acd8549c0E.exit.i": ; preds = %bb1.i.i.i.i.i, %_ZN4core4char7methods15encode_utf8_raw17h84badf475ef2bb54E.exit.i
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
  br i1 %_4.i.i, label %bb1.i.i, label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$4push17h69a0e9b11f8b1178E.exit.i"

bb1.i.i:                                          ; preds = %bb4.i
; call alloc::raw_vec::RawVec<T,A>::grow_one
  tail call fastcc void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$8grow_one17h159576207275dc4cE"(ptr noalias noundef nonnull align 8 dereferenceable(16) %self) #16
  br label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$4push17h69a0e9b11f8b1178E.exit.i"

"_ZN5alloc3vec16Vec$LT$T$C$A$GT$4push17h69a0e9b11f8b1178E.exit.i": ; preds = %bb1.i.i, %bb4.i
  %24 = getelementptr inbounds i8, ptr %self, i64 8
  %self1.i.i = load ptr, ptr %24, align 8, !alias.scope !27, !nonnull !2, !noundef !2
  %end.i.i = getelementptr inbounds i8, ptr %self1.i.i, i64 %len.i.i
  store i8 %_4.i, ptr %end.i.i, align 1, !noalias !27
  %25 = add i64 %len.i.i, 1
  store i64 %25, ptr %22, align 8, !alias.scope !27
  br label %_ZN5alloc6string6String4push17h96dfc48c19bd6e38E.exit

_ZN5alloc6string6String4push17h96dfc48c19bd6e38E.exit: ; preds = %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4e6b266acd8549c0E.exit.i", %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$4push17h69a0e9b11f8b1178E.exit.i"
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
  br i1 %_5.i.i.i.i, label %bb1.i.i.i.i, label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4e6b266acd8549c0E.exit"

bb1.i.i.i.i:                                      ; preds = %start
; call alloc::raw_vec::RawVec<T,A>::reserve::do_reserve_and_handle
  tail call fastcc void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h9b552dd50a0c679dE"(ptr noalias noundef nonnull align 8 dereferenceable(16) %self, i64 noundef %len.i.i.i.i, i64 noundef %s.1) #16, !noalias !38
  %len.pre.i.i.i = load i64, ptr %0, align 8, !alias.scope !37, !noalias !38
  br label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4e6b266acd8549c0E.exit"

"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4e6b266acd8549c0E.exit": ; preds = %start, %bb1.i.i.i.i
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
define internal fastcc void @_ZN5alloc7raw_vec11finish_grow17he7d0070d036ce094E(ptr dead_on_unwind noalias nocapture noundef writable writeonly align 8 dereferenceable(24) %_0, i64 noundef %0, i64 %1, ptr noalias nocapture noundef readonly align 8 dereferenceable(24) %current_memory) unnamed_addr #3 {
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
define internal fastcc void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h9b552dd50a0c679dE"(ptr noalias nocapture noundef align 8 dereferenceable(16) %slf, i64 noundef %len, i64 noundef %additional) unnamed_addr #4 {
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
  br i1 %3, label %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hef4c02fd94bc604cE.exit.i", label %bb4.i.i

bb4.i.i:                                          ; preds = %bb10.i
  %self.val22.i = load ptr, ptr %2, align 8, !alias.scope !44, !nonnull !2, !noundef !2
  store ptr %self.val22.i, ptr %_20.i, align 8, !alias.scope !47, !noalias !44
  %_9.sroa.5.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_20.i, i64 16
  store i64 %_12.i, ptr %_9.sroa.5.0._0.sroa_idx.i.i, align 8, !alias.scope !47, !noalias !44
  br label %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hef4c02fd94bc604cE.exit.i"

"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hef4c02fd94bc604cE.exit.i": ; preds = %bb4.i.i, %bb10.i
  %.sink.i.i = phi i64 [ 1, %bb4.i.i ], [ 0, %bb10.i ]
  %4 = getelementptr inbounds i8, ptr %_20.i, i64 8
  store i64 %.sink.i.i, ptr %4, align 8, !alias.scope !47, !noalias !44
; call alloc::raw_vec::finish_grow
  call fastcc void @_ZN5alloc7raw_vec11finish_grow17he7d0070d036ce094E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %self5.i, i64 noundef %_0.sroa.0.0.i.i, i64 %cap3.sroa.0.0.sroa.speculated.i, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_20.i) #16, !noalias !44
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_20.i), !noalias !44
  %_53.i = load i64, ptr %self5.i, align 8, !range !50, !noalias !44, !noundef !2
  %trunc.not.i = icmp eq i64 %_53.i, 0
  %5 = getelementptr inbounds i8, ptr %self5.i, i64 8
  br i1 %trunc.not.i, label %bb3, label %bb20.i

bb20.i:                                           ; preds = %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hef4c02fd94bc604cE.exit.i"
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

bb3:                                              ; preds = %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hef4c02fd94bc604cE.exit.i"
  %v.0.i = load ptr, ptr %5, align 8, !noalias !44, !nonnull !2, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %self5.i), !noalias !44
  store ptr %v.0.i, ptr %2, align 8, !alias.scope !44
  store i64 %cap3.sroa.0.0.sroa.speculated.i, ptr %slf, align 8, !alias.scope !44
  ret void
}

; alloc::raw_vec::RawVec<T,A>::grow_one
; Function Attrs: noinline nounwind
define internal fastcc void @"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$8grow_one17h159576207275dc4cE"(ptr noalias nocapture noundef align 8 dereferenceable(16) %self) unnamed_addr #3 {
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
  br i1 %3, label %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hef4c02fd94bc604cE.exit.i", label %bb4.i.i

bb4.i.i:                                          ; preds = %bb10.i
  %self.val22.i = load ptr, ptr %2, align 8, !alias.scope !51, !nonnull !2, !noundef !2
  store ptr %self.val22.i, ptr %_20.i, align 8, !alias.scope !54, !noalias !51
  %_9.sroa.5.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_20.i, i64 16
  store i64 %_3, ptr %_9.sroa.5.0._0.sroa_idx.i.i, align 8, !alias.scope !54, !noalias !51
  br label %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hef4c02fd94bc604cE.exit.i"

"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hef4c02fd94bc604cE.exit.i": ; preds = %bb4.i.i, %bb10.i
  %.sink.i.i = phi i64 [ 1, %bb4.i.i ], [ 0, %bb10.i ]
  %4 = getelementptr inbounds i8, ptr %_20.i, i64 8
  store i64 %.sink.i.i, ptr %4, align 8, !alias.scope !54, !noalias !51
; call alloc::raw_vec::finish_grow
  call fastcc void @_ZN5alloc7raw_vec11finish_grow17he7d0070d036ce094E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(24) %self5.i, i64 noundef %_0.sroa.0.0.i.i, i64 %cap3.sroa.0.0.sroa.speculated.i, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(24) %_20.i) #16, !noalias !51
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_20.i), !noalias !51
  %_53.i = load i64, ptr %self5.i, align 8, !range !50, !noalias !51, !noundef !2
  %trunc.not.i = icmp eq i64 %_53.i, 0
  %5 = getelementptr inbounds i8, ptr %self5.i, i64 8
  br i1 %trunc.not.i, label %bb3, label %bb20.i

bb20.i:                                           ; preds = %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hef4c02fd94bc604cE.exit.i"
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

bb3:                                              ; preds = %"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hef4c02fd94bc604cE.exit.i"
  %v.0.i = load ptr, ptr %5, align 8, !noalias !51, !nonnull !2, !noundef !2
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %self5.i), !noalias !51
  store ptr %v.0.i, ptr %2, align 8, !alias.scope !51
  store i64 %cap3.sroa.0.0.sroa.speculated.i, ptr %self, align 8, !alias.scope !51
  ret void
}

; method_public_multi::BuyResult::total_user_quote
; Function Attrs: nounwind
define hidden void @_ZN19method_public_multi9BuyResult16total_user_quote17hf6a22b87e70fe291E(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([16 x i8]) align 8 dereferenceable(16) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(96) %self) unnamed_addr #0 {
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
  %10 = call noundef zeroext i1 @"_ZN71_$LT$pump_amm_recovered..PumpAmmError$u20$as$u20$core..fmt..Display$GT$3fmt17h56303ef102d3d7dbE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_1f1600f67af89fc229573eafc1a3b5f5, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i.i) #16, !noalias !61
  br i1 %10, label %bb3.i.i, label %"_ZN19method_public_multi9BuyResult16total_user_quote28_$u7b$$u7b$closure$u7d$$u7d$17hdde7d6f795e7dcd0E.exit"

bb3.i.i:                                          ; preds = %bb2
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.1, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #17, !noalias !61
  unreachable

"_ZN19method_public_multi9BuyResult16total_user_quote28_$u7b$$u7b$closure$u7d$$u7d$17hdde7d6f795e7dcd0E.exit": ; preds = %bb2
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
  store ptr @alloc_d4fd717091ef596d00441be5892cf33f, ptr %_6.sroa.4.0._2.sroa_idx.i, align 8
  %_6.sroa.4.sroa.4.0._6.sroa.4.0._2.sroa_idx.sroa_idx.i = getelementptr inbounds i8, ptr %_2.i, i64 16
  store i64 22, ptr %_6.sroa.4.sroa.4.0._6.sroa.4.0._2.sroa_idx.sroa_idx.i, align 8
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

bb4:                                              ; preds = %"_ZN19method_public_multi9BuyResult16total_user_quote28_$u7b$$u7b$closure$u7d$$u7d$17hdde7d6f795e7dcd0E.exit", %bb3
  ret void
}

; method_public_multi::call
; Function Attrs: nounwind
define hidden void @_ZN19method_public_multi4call17hd5ffa9574ec7de12E(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([16 x i8]) align 8 dereferenceable(16) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(96) %result) unnamed_addr #0 {
start:
; call method_public_multi::BuyResult::total_user_quote
  tail call void @_ZN19method_public_multi9BuyResult16total_user_quote17hf6a22b87e70fe291E(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_0, ptr noalias noundef nonnull readonly align 8 dereferenceable(96) %result) #16
  ret void
}

; method_public_multi::check
; Function Attrs: nounwind
define hidden { i64, ptr } @_ZN19method_public_multi5check17h764fd84438468780E(ptr noalias nocapture noundef readonly align 8 dereferenceable(96) %result, i64 noundef %limit) unnamed_addr #0 {
start:
  %_11.i16.i = alloca [0 x i8], align 1
  %formatter.i17.i = alloca [64 x i8], align 8
  %buf.i18.i = alloca [24 x i8], align 8
  %formatter.i10.i = alloca [64 x i8], align 8
  %buf.i11.i = alloca [24 x i8], align 8
  %formatter.i3.i = alloca [64 x i8], align 8
  %buf.i4.i = alloca [24 x i8], align 8
  %formatter.i.i = alloca [64 x i8], align 8
  %buf.i.i = alloca [24 x i8], align 8
  %_16.i = alloca [24 x i8], align 8
  %_15.i = alloca [48 x i8], align 8
  %_14.sroa.4.i = alloca [55 x i8], align 1
  %_8.i = alloca [24 x i8], align 8
  %_7.i = alloca [48 x i8], align 8
  %_6.sroa.4.i = alloca [55 x i8], align 1
  %values.i = alloca [16 x i8], align 8
  %formatter.i = alloca [64 x i8], align 8
  %buf.i = alloca [24 x i8], align 8
  %_20 = alloca [16 x i8], align 8
  %_11 = alloca [24 x i8], align 8
  %_10 = alloca [160 x i8], align 8
  %_5 = alloca [16 x i8], align 8
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_5)
; call method_public_multi::BuyResult::total_user_quote
  call void @_ZN19method_public_multi9BuyResult16total_user_quote17hf6a22b87e70fe291E(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_5, ptr noalias noundef nonnull readonly align 8 dereferenceable(96) %result) #16
  %0 = load i64, ptr %_5, align 8, !range !62, !noundef !2
  %1 = icmp eq i64 %0, 2
  %2 = getelementptr inbounds i8, ptr %_5, i64 8
  br i1 %1, label %bb15, label %bb14

bb15:                                             ; preds = %start
  %_24 = load i64, ptr %2, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_5)
  %_3 = icmp ugt i64 %_24, %limit
  br i1 %_3, label %bb11, label %bb10

bb14:                                             ; preds = %start
  %_25.1 = load ptr, ptr %2, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_5)
  br label %bb10

bb11:                                             ; preds = %bb15
  call void @llvm.lifetime.start.p0(i64 160, ptr nonnull %_10)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_11)
; call pump_amm_recovered::PumpAmmError::name
  call void @_ZN18pump_amm_recovered12PumpAmmError4name17h450aae3bd6299013E(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_11, ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_7bf4d83167a444e3cf51563928dad022) #16
; call pump_amm_recovered::<impl core::convert::From<pump_amm_recovered::PumpAmmError> for u32>::from
  %_12 = tail call noundef i32 @"_ZN18pump_amm_recovered93_$LT$impl$u20$core..convert..From$LT$pump_amm_recovered..PumpAmmError$GT$$u20$for$u20$u32$GT$4from17ha853179884b7c251E"(i32 noundef 4) #16
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i16.i)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i), !noalias !63
  store i64 0, ptr %buf.i, align 8, !noalias !63
  %_9.sroa.4.0.buf.sroa_idx.i = getelementptr inbounds i8, ptr %buf.i, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i, align 8, !noalias !63
  %_9.sroa.5.0.buf.sroa_idx.i = getelementptr inbounds i8, ptr %buf.i, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i, align 8, !noalias !63
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i), !noalias !63
  %3 = getelementptr inbounds i8, ptr %formatter.i, i64 52
  store i32 0, ptr %3, align 4, !noalias !63
  %4 = getelementptr inbounds i8, ptr %formatter.i, i64 48
  store i32 32, ptr %4, align 8, !noalias !63
  %5 = getelementptr inbounds i8, ptr %formatter.i, i64 56
  store i8 3, ptr %5, align 8, !noalias !63
  store i64 0, ptr %formatter.i, align 8, !noalias !63
  %6 = getelementptr inbounds i8, ptr %formatter.i, i64 16
  store i64 0, ptr %6, align 8, !noalias !63
  %7 = getelementptr inbounds i8, ptr %formatter.i, i64 32
  store ptr %buf.i, ptr %7, align 8, !noalias !63
  %8 = getelementptr inbounds i8, ptr %formatter.i, i64 40
  store ptr @vtable.0, ptr %8, align 8, !noalias !63
; call <pump_amm_recovered::PumpAmmError as core::fmt::Display>::fmt
  %9 = call noundef zeroext i1 @"_ZN71_$LT$pump_amm_recovered..PumpAmmError$u20$as$u20$core..fmt..Display$GT$3fmt17h56303ef102d3d7dbE"(ptr noalias noundef nonnull readonly align 4 dereferenceable(4) @alloc_7bf4d83167a444e3cf51563928dad022, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i) #16, !noalias !67
  br i1 %9, label %bb3.i, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1577995294be3c28E.exit"

bb3.i:                                            ; preds = %bb11
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i16.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.1, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #17, !noalias !67
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1577995294be3c28E.exit": ; preds = %bb11
  %10 = getelementptr inbounds i8, ptr %_10, i64 56
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %10, ptr noundef nonnull align 8 dereferenceable(24) %buf.i, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i), !noalias !63
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i), !noalias !63
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i16.i)
  %11 = getelementptr inbounds i8, ptr %_10, i64 32
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %11, ptr noundef nonnull align 8 dereferenceable(24) %_11, i64 24, i1 false)
  %12 = getelementptr inbounds i8, ptr %_10, i64 152
  store i32 %_12, ptr %12, align 8
  store i64 0, ptr %_10, align 8
  %_14.sroa.4.0._10.sroa_idx = getelementptr inbounds i8, ptr %_10, i64 8
  store ptr @alloc_d4fd717091ef596d00441be5892cf33f, ptr %_14.sroa.4.0._10.sroa_idx, align 8
  %_14.sroa.4.sroa.4.0._14.sroa.4.0._10.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_10, i64 16
  store i64 22, ptr %_14.sroa.4.sroa.4.0._14.sroa.4.0._10.sroa_idx.sroa_idx, align 8
  %_14.sroa.4.sroa.5.0._14.sroa.4.0._10.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_10, i64 24
  store i32 21, ptr %_14.sroa.4.sroa.5.0._14.sroa.4.0._10.sroa_idx.sroa_idx, align 8
  %13 = getelementptr inbounds i8, ptr %_10, i64 80
  store i8 2, ptr %13, align 8
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_11)
; call <anchor_lang::error::Error as core::convert::From<anchor_lang::error::AnchorError>>::from
  %14 = call { i64, ptr } @"_ZN104_$LT$anchor_lang..error..Error$u20$as$u20$core..convert..From$LT$anchor_lang..error..AnchorError$GT$$GT$4from17hefc4a4c4d9276c8eE"(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(160) %_10) #16
  %15 = extractvalue { i64, ptr } %14, 0
  %16 = extractvalue { i64, ptr } %14, 1
  call void @llvm.lifetime.end.p0(i64 160, ptr nonnull %_10)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_20)
; call method_public_multi::BuyResult::total_user_quote
  call void @_ZN19method_public_multi9BuyResult16total_user_quote17hf6a22b87e70fe291E(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_20, ptr noalias noundef nonnull readonly align 8 dereferenceable(96) %result) #16
  %17 = load i64, ptr %_20, align 8, !range !62, !noundef !2
  %18 = icmp eq i64 %17, 2
  %19 = getelementptr inbounds i8, ptr %_20, i64 8
  br i1 %18, label %bb18, label %bb17

bb10:                                             ; preds = %_ZN11anchor_lang5error5Error11with_values17h761558b6318a00f6E.exit, %"_ZN4core3ptr46drop_in_place$LT$anchor_lang..error..Error$GT$17h040c268f9a5b79fdE.exit", %bb15, %bb14
  %_0.sroa.5.0 = phi ptr [ %_25.1, %bb14 ], [ undef, %bb15 ], [ %16, %_ZN11anchor_lang5error5Error11with_values17h761558b6318a00f6E.exit ], [ %_30.1, %"_ZN4core3ptr46drop_in_place$LT$anchor_lang..error..Error$GT$17h040c268f9a5b79fdE.exit" ]
  %_0.sroa.0.0 = phi i64 [ %0, %bb14 ], [ 2, %bb15 ], [ %15, %_ZN11anchor_lang5error5Error11with_values17h761558b6318a00f6E.exit ], [ %17, %"_ZN4core3ptr46drop_in_place$LT$anchor_lang..error..Error$GT$17h040c268f9a5b79fdE.exit" ]
  %20 = insertvalue { i64, ptr } poison, i64 %_0.sroa.0.0, 0
  %21 = insertvalue { i64, ptr } %20, ptr %_0.sroa.5.0, 1
  ret { i64, ptr } %21

bb18:                                             ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1577995294be3c28E.exit"
  %_29 = load i64, ptr %19, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_20)
  call void @llvm.lifetime.start.p0(i64 55, ptr nonnull %_14.sroa.4.i)
  call void @llvm.lifetime.start.p0(i64 55, ptr nonnull %_6.sroa.4.i)
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %values.i)
  store i64 %limit, ptr %values.i, align 8
  %22 = getelementptr inbounds i8, ptr %values.i, i64 8
  store i64 %_29, ptr %22, align 8
  %switch.i = icmp eq i64 %15, 0
  br i1 %switch.i, label %bb3.i5, label %bb2.i

bb3.i5:                                           ; preds = %bb18
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_7.i)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_8.i)
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i16.i)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i.i), !noalias !68
  store i64 0, ptr %buf.i.i, align 8, !noalias !68
  %_9.sroa.4.0.buf.sroa_idx.i.i = getelementptr inbounds i8, ptr %buf.i.i, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i.i, align 8, !noalias !68
  %_9.sroa.5.0.buf.sroa_idx.i.i = getelementptr inbounds i8, ptr %buf.i.i, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i.i, align 8, !noalias !68
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i.i), !noalias !68
  %23 = getelementptr inbounds i8, ptr %formatter.i.i, i64 52
  store i32 0, ptr %23, align 4, !noalias !68
  %24 = getelementptr inbounds i8, ptr %formatter.i.i, i64 48
  store i32 32, ptr %24, align 8, !noalias !68
  %25 = getelementptr inbounds i8, ptr %formatter.i.i, i64 56
  store i8 3, ptr %25, align 8, !noalias !68
  store i64 0, ptr %formatter.i.i, align 8, !noalias !68
  %26 = getelementptr inbounds i8, ptr %formatter.i.i, i64 16
  store i64 0, ptr %26, align 8, !noalias !68
  %27 = getelementptr inbounds i8, ptr %formatter.i.i, i64 32
  store ptr %buf.i.i, ptr %27, align 8, !noalias !68
  %28 = getelementptr inbounds i8, ptr %formatter.i.i, i64 40
  store ptr @vtable.0, ptr %28, align 8, !noalias !68
; call core::fmt::num::imp::<impl core::fmt::Display for u64>::fmt
  %29 = call noundef zeroext i1 @"_ZN4core3fmt3num3imp52_$LT$impl$u20$core..fmt..Display$u20$for$u20$u64$GT$3fmt17h507b2a1c734f693aE"(ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %values.i, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i.i) #16, !noalias !72
  br i1 %29, label %bb3.i.i, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit.i"

bb3.i.i:                                          ; preds = %bb3.i5
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i16.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.1, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #17, !noalias !72
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit.i": ; preds = %bb3.i5
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_8.i, ptr noundef nonnull align 8 dereferenceable(24) %buf.i.i, i64 24, i1 false), !noalias !73
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i.i), !noalias !68
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i.i), !noalias !68
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i16.i)
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i16.i)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i4.i), !noalias !74
  store i64 0, ptr %buf.i4.i, align 8, !noalias !74
  %_9.sroa.4.0.buf.sroa_idx.i5.i = getelementptr inbounds i8, ptr %buf.i4.i, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i5.i, align 8, !noalias !74
  %_9.sroa.5.0.buf.sroa_idx.i6.i = getelementptr inbounds i8, ptr %buf.i4.i, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i6.i, align 8, !noalias !74
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i3.i), !noalias !74
  %30 = getelementptr inbounds i8, ptr %formatter.i3.i, i64 52
  store i32 0, ptr %30, align 4, !noalias !74
  %31 = getelementptr inbounds i8, ptr %formatter.i3.i, i64 48
  store i32 32, ptr %31, align 8, !noalias !74
  %32 = getelementptr inbounds i8, ptr %formatter.i3.i, i64 56
  store i8 3, ptr %32, align 8, !noalias !74
  store i64 0, ptr %formatter.i3.i, align 8, !noalias !74
  %33 = getelementptr inbounds i8, ptr %formatter.i3.i, i64 16
  store i64 0, ptr %33, align 8, !noalias !74
  %34 = getelementptr inbounds i8, ptr %formatter.i3.i, i64 32
  store ptr %buf.i4.i, ptr %34, align 8, !noalias !74
  %35 = getelementptr inbounds i8, ptr %formatter.i3.i, i64 40
  store ptr @vtable.0, ptr %35, align 8, !noalias !74
; call core::fmt::num::imp::<impl core::fmt::Display for u64>::fmt
  %36 = call noundef zeroext i1 @"_ZN4core3fmt3num3imp52_$LT$impl$u20$core..fmt..Display$u20$for$u20$u64$GT$3fmt17h507b2a1c734f693aE"(ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %22, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i3.i) #16, !noalias !78
  br i1 %36, label %bb3.i7.i, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit8.i"

bb3.i7.i:                                         ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit.i"
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i16.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.1, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #17, !noalias !78
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit8.i": ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit.i"
  %37 = getelementptr inbounds i8, ptr %_7.i, i64 24
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %37, ptr noundef nonnull align 8 dereferenceable(24) %buf.i4.i, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i3.i), !noalias !74
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i4.i), !noalias !74
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i16.i)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_7.i, ptr noundef nonnull align 8 dereferenceable(24) %_8.i, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_8.i)
  %_6.sroa.4.8.sroa_idx.i = getelementptr inbounds i8, ptr %_6.sroa.4.i, i64 7
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(48) %_6.sroa.4.8.sroa_idx.i, ptr noundef nonnull align 8 dereferenceable(48) %_7.i, i64 48, i1 false)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_7.i)
  %38 = icmp ne ptr %16, null
  call void @llvm.assume(i1 %38)
  %39 = getelementptr inbounds i8, ptr %16, i64 80
  call void @llvm.experimental.noalias.scope.decl(metadata !79)
  %40 = load i8, ptr %39, align 8, !range !82, !alias.scope !79, !noundef !2
  %41 = icmp eq i8 %40, 2
  br i1 %41, label %_ZN11anchor_lang5error5Error11with_values17h761558b6318a00f6E.exit, label %bb2.i.i

bb2.i.i:                                          ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit8.i"
  call void @llvm.experimental.noalias.scope.decl(metadata !83)
  %42 = icmp eq i8 %40, 0
  br i1 %42, label %bb2.i.i.i, label %_ZN11anchor_lang5error5Error11with_values17h761558b6318a00f6E.exit

bb2.i.i.i:                                        ; preds = %bb2.i.i
  %43 = getelementptr inbounds i8, ptr %16, i64 88
  call void @llvm.experimental.noalias.scope.decl(metadata !86)
  call void @llvm.experimental.noalias.scope.decl(metadata !89)
  %_1.val.i.i.i.i.i = load i64, ptr %43, align 8, !alias.scope !92, !noundef !2
  %44 = icmp eq i64 %_1.val.i.i.i.i.i, 0
  br i1 %44, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i": ; preds = %bb2.i.i.i
  %45 = getelementptr inbounds i8, ptr %16, i64 96
  %_1.val1.i.i.i.i.i = load ptr, ptr %45, align 8, !alias.scope !92, !nonnull !2, !noundef !2
  call void @__rust_dealloc(ptr noundef nonnull %_1.val1.i.i.i.i.i, i64 noundef %_1.val.i.i.i.i.i, i64 noundef 1) #16, !noalias !92
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i", %bb2.i.i.i
  %46 = getelementptr inbounds i8, ptr %16, i64 112
  %_1.val.i1.i.i.i.i = load i64, ptr %46, align 8, !alias.scope !93, !noundef !2
  %47 = icmp eq i64 %_1.val.i1.i.i.i.i, 0
  br i1 %47, label %_ZN11anchor_lang5error5Error11with_values17h761558b6318a00f6E.exit, label %_ZN11anchor_lang5error5Error11with_values17h761558b6318a00f6E.exit.sink.split

bb2.i:                                            ; preds = %bb18
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_15.i)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %_16.i)
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i16.i)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i11.i), !noalias !96
  store i64 0, ptr %buf.i11.i, align 8, !noalias !96
  %_9.sroa.4.0.buf.sroa_idx.i12.i = getelementptr inbounds i8, ptr %buf.i11.i, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i12.i, align 8, !noalias !96
  %_9.sroa.5.0.buf.sroa_idx.i13.i = getelementptr inbounds i8, ptr %buf.i11.i, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i13.i, align 8, !noalias !96
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i10.i), !noalias !96
  %48 = getelementptr inbounds i8, ptr %formatter.i10.i, i64 52
  store i32 0, ptr %48, align 4, !noalias !96
  %49 = getelementptr inbounds i8, ptr %formatter.i10.i, i64 48
  store i32 32, ptr %49, align 8, !noalias !96
  %50 = getelementptr inbounds i8, ptr %formatter.i10.i, i64 56
  store i8 3, ptr %50, align 8, !noalias !96
  store i64 0, ptr %formatter.i10.i, align 8, !noalias !96
  %51 = getelementptr inbounds i8, ptr %formatter.i10.i, i64 16
  store i64 0, ptr %51, align 8, !noalias !96
  %52 = getelementptr inbounds i8, ptr %formatter.i10.i, i64 32
  store ptr %buf.i11.i, ptr %52, align 8, !noalias !96
  %53 = getelementptr inbounds i8, ptr %formatter.i10.i, i64 40
  store ptr @vtable.0, ptr %53, align 8, !noalias !96
; call core::fmt::num::imp::<impl core::fmt::Display for u64>::fmt
  %54 = call noundef zeroext i1 @"_ZN4core3fmt3num3imp52_$LT$impl$u20$core..fmt..Display$u20$for$u20$u64$GT$3fmt17h507b2a1c734f693aE"(ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %values.i, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i10.i) #16, !noalias !100
  br i1 %54, label %bb3.i14.i, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit15.i"

bb3.i14.i:                                        ; preds = %bb2.i
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i16.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.1, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #17, !noalias !100
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit15.i": ; preds = %bb2.i
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_16.i, ptr noundef nonnull align 8 dereferenceable(24) %buf.i11.i, i64 24, i1 false), !noalias !101
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i10.i), !noalias !96
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i11.i), !noalias !96
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i16.i)
  call void @llvm.lifetime.start.p0(i64 0, ptr nonnull %_11.i16.i)
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %buf.i18.i), !noalias !102
  store i64 0, ptr %buf.i18.i, align 8, !noalias !102
  %_9.sroa.4.0.buf.sroa_idx.i19.i = getelementptr inbounds i8, ptr %buf.i18.i, i64 8
  store ptr inttoptr (i64 1 to ptr), ptr %_9.sroa.4.0.buf.sroa_idx.i19.i, align 8, !noalias !102
  %_9.sroa.5.0.buf.sroa_idx.i20.i = getelementptr inbounds i8, ptr %buf.i18.i, i64 16
  store i64 0, ptr %_9.sroa.5.0.buf.sroa_idx.i20.i, align 8, !noalias !102
  call void @llvm.lifetime.start.p0(i64 64, ptr nonnull %formatter.i17.i), !noalias !102
  %55 = getelementptr inbounds i8, ptr %formatter.i17.i, i64 52
  store i32 0, ptr %55, align 4, !noalias !102
  %56 = getelementptr inbounds i8, ptr %formatter.i17.i, i64 48
  store i32 32, ptr %56, align 8, !noalias !102
  %57 = getelementptr inbounds i8, ptr %formatter.i17.i, i64 56
  store i8 3, ptr %57, align 8, !noalias !102
  store i64 0, ptr %formatter.i17.i, align 8, !noalias !102
  %58 = getelementptr inbounds i8, ptr %formatter.i17.i, i64 16
  store i64 0, ptr %58, align 8, !noalias !102
  %59 = getelementptr inbounds i8, ptr %formatter.i17.i, i64 32
  store ptr %buf.i18.i, ptr %59, align 8, !noalias !102
  %60 = getelementptr inbounds i8, ptr %formatter.i17.i, i64 40
  store ptr @vtable.0, ptr %60, align 8, !noalias !102
; call core::fmt::num::imp::<impl core::fmt::Display for u64>::fmt
  %61 = call noundef zeroext i1 @"_ZN4core3fmt3num3imp52_$LT$impl$u20$core..fmt..Display$u20$for$u20$u64$GT$3fmt17h507b2a1c734f693aE"(ptr noalias noundef nonnull readonly align 8 dereferenceable(8) %22, ptr noalias noundef nonnull align 8 dereferenceable(64) %formatter.i17.i) #16, !noalias !106
  br i1 %61, label %bb3.i21.i, label %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit22.i"

bb3.i21.i:                                        ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit15.i"
; call core::result::unwrap_failed
  call void @_ZN4core6result13unwrap_failed17h2dbd2ef42161686dE(ptr noalias noundef nonnull readonly align 1 @alloc_cc656815297f75969399c3f4b1ad3de4, i64 noundef 55, ptr noundef nonnull align 1 %_11.i16.i, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @vtable.1, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) @alloc_d5d9fccaf545b6e0545ef73245a3c43f) #17, !noalias !106
  unreachable

"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit22.i": ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit15.i"
  %62 = getelementptr inbounds i8, ptr %_15.i, i64 24
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %62, ptr noundef nonnull align 8 dereferenceable(24) %buf.i18.i, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 64, ptr nonnull %formatter.i17.i), !noalias !102
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %buf.i18.i), !noalias !102
  call void @llvm.lifetime.end.p0(i64 0, ptr nonnull %_11.i16.i)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_15.i, ptr noundef nonnull align 8 dereferenceable(24) %_16.i, i64 24, i1 false)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %_16.i)
  %_14.sroa.4.8.sroa_idx.i = getelementptr inbounds i8, ptr %_14.sroa.4.i, i64 7
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(48) %_14.sroa.4.8.sroa_idx.i, ptr noundef nonnull align 8 dereferenceable(48) %_15.i, i64 48, i1 false)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_15.i)
  %63 = icmp ne ptr %16, null
  call void @llvm.assume(i1 %63)
  %64 = getelementptr inbounds i8, ptr %16, i64 56
  call void @llvm.experimental.noalias.scope.decl(metadata !107)
  %65 = load i8, ptr %64, align 8, !range !82, !alias.scope !107, !noundef !2
  %66 = icmp eq i8 %65, 2
  br i1 %66, label %_ZN11anchor_lang5error5Error11with_values17h761558b6318a00f6E.exit, label %bb2.i23.i

bb2.i23.i:                                        ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit22.i"
  call void @llvm.experimental.noalias.scope.decl(metadata !110)
  %67 = icmp eq i8 %65, 0
  br i1 %67, label %bb2.i.i24.i, label %_ZN11anchor_lang5error5Error11with_values17h761558b6318a00f6E.exit

bb2.i.i24.i:                                      ; preds = %bb2.i23.i
  %68 = getelementptr inbounds i8, ptr %16, i64 64
  call void @llvm.experimental.noalias.scope.decl(metadata !113)
  call void @llvm.experimental.noalias.scope.decl(metadata !116)
  %_1.val.i.i.i.i25.i = load i64, ptr %68, align 8, !alias.scope !119, !noundef !2
  %69 = icmp eq i64 %_1.val.i.i.i.i25.i, 0
  br i1 %69, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i28.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i26.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i26.i": ; preds = %bb2.i.i24.i
  %70 = getelementptr inbounds i8, ptr %16, i64 72
  %_1.val1.i.i.i.i27.i = load ptr, ptr %70, align 8, !alias.scope !119, !nonnull !2, !noundef !2
  call void @__rust_dealloc(ptr noundef nonnull %_1.val1.i.i.i.i27.i, i64 noundef %_1.val.i.i.i.i25.i, i64 noundef 1) #16, !noalias !119
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i28.i"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i28.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i26.i", %bb2.i.i24.i
  %71 = getelementptr inbounds i8, ptr %16, i64 88
  %_1.val.i1.i.i.i29.i = load i64, ptr %71, align 8, !alias.scope !120, !noundef !2
  %72 = icmp eq i64 %_1.val.i1.i.i.i29.i, 0
  br i1 %72, label %_ZN11anchor_lang5error5Error11with_values17h761558b6318a00f6E.exit, label %_ZN11anchor_lang5error5Error11with_values17h761558b6318a00f6E.exit.sink.split

_ZN11anchor_lang5error5Error11with_values17h761558b6318a00f6E.exit.sink.split: ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i28.i", %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i"
  %.sink12 = phi i64 [ 120, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i" ], [ 96, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i28.i" ]
  %_1.val.i1.i.i.i29.i.sink = phi i64 [ %_1.val.i1.i.i.i.i, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i" ], [ %_1.val.i1.i.i.i29.i, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i28.i" ]
  %.sink10.ph = phi ptr [ %39, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i" ], [ %64, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i28.i" ]
  %.sink.ph = phi i64 [ 81, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i" ], [ 57, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i28.i" ]
  %_6.sroa.4.i.sink.ph = phi ptr [ %_6.sroa.4.i, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i" ], [ %_14.sroa.4.i, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i28.i" ]
  %73 = getelementptr inbounds i8, ptr %16, i64 %.sink12
  %_1.val1.i3.i.i.i31.i = load ptr, ptr %73, align 8, !nonnull !2, !noundef !2
  call void @__rust_dealloc(ptr noundef nonnull %_1.val1.i3.i.i.i31.i, i64 noundef %_1.val.i1.i.i.i29.i.sink, i64 noundef 1) #16, !noalias !2
  br label %_ZN11anchor_lang5error5Error11with_values17h761558b6318a00f6E.exit

_ZN11anchor_lang5error5Error11with_values17h761558b6318a00f6E.exit: ; preds = %_ZN11anchor_lang5error5Error11with_values17h761558b6318a00f6E.exit.sink.split, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit22.i", %bb2.i23.i, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i28.i", %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit8.i", %bb2.i.i, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i"
  %.sink10 = phi ptr [ %39, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i" ], [ %39, %bb2.i.i ], [ %39, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit8.i" ], [ %64, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i28.i" ], [ %64, %bb2.i23.i ], [ %64, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit22.i" ], [ %.sink10.ph, %_ZN11anchor_lang5error5Error11with_values17h761558b6318a00f6E.exit.sink.split ]
  %.sink = phi i64 [ 81, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i" ], [ 81, %bb2.i.i ], [ 81, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit8.i" ], [ 57, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i28.i" ], [ 57, %bb2.i23.i ], [ 57, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit22.i" ], [ %.sink.ph, %_ZN11anchor_lang5error5Error11with_values17h761558b6318a00f6E.exit.sink.split ]
  %_6.sroa.4.i.sink = phi ptr [ %_6.sroa.4.i, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i" ], [ %_6.sroa.4.i, %bb2.i.i ], [ %_6.sroa.4.i, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit8.i" ], [ %_14.sroa.4.i, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i28.i" ], [ %_14.sroa.4.i, %bb2.i23.i ], [ %_14.sroa.4.i, %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E.exit22.i" ], [ %_6.sroa.4.i.sink.ph, %_ZN11anchor_lang5error5Error11with_values17h761558b6318a00f6E.exit.sink.split ]
  store i8 0, ptr %.sink10, align 8
  %_5.sroa.4.0..sroa_idx.i = getelementptr inbounds i8, ptr %16, i64 %.sink
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(55) %_5.sroa.4.0..sroa_idx.i, ptr noundef nonnull align 1 dereferenceable(55) %_6.sroa.4.i.sink, i64 55, i1 false)
  call void @llvm.lifetime.end.p0(i64 55, ptr nonnull %_14.sroa.4.i)
  call void @llvm.lifetime.end.p0(i64 55, ptr nonnull %_6.sroa.4.i)
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %values.i)
  br label %bb10

bb17:                                             ; preds = %"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1577995294be3c28E.exit"
  %_30.1 = load ptr, ptr %19, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_20)
  %74 = icmp eq i64 %15, 0
  %75 = getelementptr inbounds i8, ptr %16, i64 32
  br i1 %74, label %bb2.i8, label %bb3.i6

bb2.i8:                                           ; preds = %bb17
  call void @llvm.experimental.noalias.scope.decl(metadata !123)
  call void @llvm.experimental.noalias.scope.decl(metadata !126)
  %_1.val.i.i.i.i = load i64, ptr %75, align 8, !alias.scope !129, !noundef !2
  %76 = icmp eq i64 %_1.val.i.i.i.i, 0
  br i1 %76, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i": ; preds = %bb2.i8
  %77 = getelementptr inbounds i8, ptr %16, i64 40
  %_1.val1.i.i.i.i = load ptr, ptr %77, align 8, !alias.scope !129, !nonnull !2, !noundef !2
  call void @__rust_dealloc(ptr noundef nonnull %_1.val1.i.i.i.i, i64 noundef %_1.val.i.i.i.i, i64 noundef 1) #16, !noalias !129
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i", %bb2.i8
  %78 = getelementptr inbounds i8, ptr %16, i64 56
  call void @llvm.experimental.noalias.scope.decl(metadata !130)
  %_1.val.i1.i.i.i = load i64, ptr %78, align 8, !alias.scope !133, !noundef !2
  %79 = icmp eq i64 %_1.val.i1.i.i.i, 0
  br i1 %79, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit4.i.i.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i2.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i2.i.i.i": ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i"
  %80 = getelementptr inbounds i8, ptr %16, i64 64
  %_1.val1.i3.i.i.i = load ptr, ptr %80, align 8, !alias.scope !133, !nonnull !2, !noundef !2
  call void @__rust_dealloc(ptr noundef nonnull %_1.val1.i3.i.i.i, i64 noundef %_1.val.i1.i.i.i, i64 noundef 1) #16, !noalias !133
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit4.i.i.i"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit4.i.i.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i2.i.i.i", %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i"
  call void @llvm.experimental.noalias.scope.decl(metadata !134)
  %81 = load i64, ptr %16, align 8, !range !62, !alias.scope !137, !noundef !2
  %82 = icmp eq i64 %81, 2
  br i1 %82, label %"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE.exit.i.i.i", label %bb2.i.i.i.i

bb2.i.i.i.i:                                      ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit4.i.i.i"
  call void @llvm.experimental.noalias.scope.decl(metadata !138)
  %83 = icmp eq i64 %81, 0
  br i1 %83, label %"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE.exit.i.i.i", label %bb2.i.i.i.i.i

bb2.i.i.i.i.i:                                    ; preds = %bb2.i.i.i.i
  %84 = getelementptr inbounds i8, ptr %16, i64 8
  call void @llvm.experimental.noalias.scope.decl(metadata !141)
  %_1.val.i.i.i.i.i.i = load i64, ptr %84, align 8, !alias.scope !144, !noundef !2
  %85 = icmp eq i64 %_1.val.i.i.i.i.i.i, 0
  br i1 %85, label %"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE.exit.i.i.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i.i": ; preds = %bb2.i.i.i.i.i
  %86 = getelementptr inbounds i8, ptr %16, i64 16
  %_1.val1.i.i.i.i.i.i = load ptr, ptr %86, align 8, !alias.scope !144, !nonnull !2, !noundef !2
  call void @__rust_dealloc(ptr noundef nonnull %_1.val1.i.i.i.i.i.i, i64 noundef %_1.val.i.i.i.i.i.i, i64 noundef 1) #16, !noalias !144
  br label %"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE.exit.i.i.i"

"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE.exit.i.i.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i.i", %bb2.i.i.i.i.i, %bb2.i.i.i.i, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit4.i.i.i"
  %87 = getelementptr inbounds i8, ptr %16, i64 80
  call void @llvm.experimental.noalias.scope.decl(metadata !145)
  %88 = load i8, ptr %87, align 8, !range !82, !alias.scope !148, !noundef !2
  %89 = icmp eq i8 %88, 2
  br i1 %89, label %"_ZN4core3ptr46drop_in_place$LT$anchor_lang..error..Error$GT$17h040c268f9a5b79fdE.exit", label %bb2.i5.i.i.i

bb2.i5.i.i.i:                                     ; preds = %"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE.exit.i.i.i"
  call void @llvm.experimental.noalias.scope.decl(metadata !149)
  %90 = icmp eq i8 %88, 0
  br i1 %90, label %bb2.i.i6.i.i.i, label %"_ZN4core3ptr46drop_in_place$LT$anchor_lang..error..Error$GT$17h040c268f9a5b79fdE.exit"

bb2.i.i6.i.i.i:                                   ; preds = %bb2.i5.i.i.i
  %91 = getelementptr inbounds i8, ptr %16, i64 88
  call void @llvm.experimental.noalias.scope.decl(metadata !152)
  call void @llvm.experimental.noalias.scope.decl(metadata !155)
  %_1.val.i.i.i.i.i.i.i = load i64, ptr %91, align 8, !alias.scope !158, !noundef !2
  %92 = icmp eq i64 %_1.val.i.i.i.i.i.i.i, 0
  br i1 %92, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i.i.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i.i.i": ; preds = %bb2.i.i6.i.i.i
  %93 = getelementptr inbounds i8, ptr %16, i64 96
  %_1.val1.i.i.i.i.i.i.i = load ptr, ptr %93, align 8, !alias.scope !158, !nonnull !2, !noundef !2
  call void @__rust_dealloc(ptr noundef nonnull %_1.val1.i.i.i.i.i.i.i, i64 noundef %_1.val.i.i.i.i.i.i.i, i64 noundef 1) #16, !noalias !158
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i.i.i"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i.i.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i.i.i", %bb2.i.i6.i.i.i
  %94 = getelementptr inbounds i8, ptr %16, i64 112
  %_1.val.i1.i.i.i.i.i.i = load i64, ptr %94, align 8, !alias.scope !159, !noundef !2
  %95 = icmp eq i64 %_1.val.i1.i.i.i.i.i.i, 0
  br i1 %95, label %"_ZN4core3ptr46drop_in_place$LT$anchor_lang..error..Error$GT$17h040c268f9a5b79fdE.exit", label %bb1.sink.split.i

bb3.i6:                                           ; preds = %bb17
  call void @llvm.experimental.noalias.scope.decl(metadata !162)
  %.val.i.i.i = load i64, ptr %75, align 8, !range !165, !alias.scope !162, !noundef !2
  %96 = xor i64 %.val.i.i.i, -9223372036854775808
  %97 = icmp ult i64 %96, 26
  %cond1.i.i.i.i = icmp ne i64 %96, 14
  %cond.not1.i.i.i.i = and i1 %97, %cond1.i.i.i.i
  %98 = icmp eq i64 %.val.i.i.i, 0
  %or.cond.i.i.i.i = or i1 %98, %cond.not1.i.i.i.i
  br i1 %or.cond.i.i.i.i, label %"_ZN4core3ptr55drop_in_place$LT$solana_program_error..ProgramError$GT$17ha5aeafb37898daa3E.exit.i.i.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i7"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i7": ; preds = %bb3.i6
  %99 = getelementptr inbounds i8, ptr %16, i64 40
  %.val1.i.i.i = load ptr, ptr %99, align 8, !alias.scope !162, !nonnull !2, !noundef !2
  call void @__rust_dealloc(ptr noundef nonnull %.val1.i.i.i, i64 noundef %.val.i.i.i, i64 noundef 1) #16, !noalias !166
  br label %"_ZN4core3ptr55drop_in_place$LT$solana_program_error..ProgramError$GT$17ha5aeafb37898daa3E.exit.i.i.i"

"_ZN4core3ptr55drop_in_place$LT$solana_program_error..ProgramError$GT$17ha5aeafb37898daa3E.exit.i.i.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i7", %bb3.i6
  call void @llvm.experimental.noalias.scope.decl(metadata !169)
  %100 = load i64, ptr %16, align 8, !range !62, !alias.scope !172, !noundef !2
  %101 = icmp eq i64 %100, 2
  br i1 %101, label %"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE.exit.i.i7.i", label %bb2.i.i.i2.i

bb2.i.i.i2.i:                                     ; preds = %"_ZN4core3ptr55drop_in_place$LT$solana_program_error..ProgramError$GT$17ha5aeafb37898daa3E.exit.i.i.i"
  call void @llvm.experimental.noalias.scope.decl(metadata !173)
  %102 = icmp eq i64 %100, 0
  br i1 %102, label %"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE.exit.i.i7.i", label %bb2.i.i.i.i3.i

bb2.i.i.i.i3.i:                                   ; preds = %bb2.i.i.i2.i
  %103 = getelementptr inbounds i8, ptr %16, i64 8
  call void @llvm.experimental.noalias.scope.decl(metadata !176)
  %_1.val.i.i.i.i.i4.i = load i64, ptr %103, align 8, !alias.scope !179, !noundef !2
  %104 = icmp eq i64 %_1.val.i.i.i.i.i4.i, 0
  br i1 %104, label %"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE.exit.i.i7.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i5.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i5.i": ; preds = %bb2.i.i.i.i3.i
  %105 = getelementptr inbounds i8, ptr %16, i64 16
  %_1.val1.i.i.i.i.i6.i = load ptr, ptr %105, align 8, !alias.scope !179, !nonnull !2, !noundef !2
  call void @__rust_dealloc(ptr noundef nonnull %_1.val1.i.i.i.i.i6.i, i64 noundef %_1.val.i.i.i.i.i4.i, i64 noundef 1) #16, !noalias !179
  br label %"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE.exit.i.i7.i"

"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE.exit.i.i7.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i5.i", %bb2.i.i.i.i3.i, %bb2.i.i.i2.i, %"_ZN4core3ptr55drop_in_place$LT$solana_program_error..ProgramError$GT$17ha5aeafb37898daa3E.exit.i.i.i"
  %106 = getelementptr inbounds i8, ptr %16, i64 56
  call void @llvm.experimental.noalias.scope.decl(metadata !180)
  %107 = load i8, ptr %106, align 8, !range !82, !alias.scope !183, !noundef !2
  %108 = icmp eq i8 %107, 2
  br i1 %108, label %"_ZN4core3ptr46drop_in_place$LT$anchor_lang..error..Error$GT$17h040c268f9a5b79fdE.exit", label %bb2.i2.i.i.i

bb2.i2.i.i.i:                                     ; preds = %"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE.exit.i.i7.i"
  call void @llvm.experimental.noalias.scope.decl(metadata !184)
  %109 = icmp eq i8 %107, 0
  br i1 %109, label %bb2.i.i3.i.i.i, label %"_ZN4core3ptr46drop_in_place$LT$anchor_lang..error..Error$GT$17h040c268f9a5b79fdE.exit"

bb2.i.i3.i.i.i:                                   ; preds = %bb2.i2.i.i.i
  %110 = getelementptr inbounds i8, ptr %16, i64 64
  call void @llvm.experimental.noalias.scope.decl(metadata !187)
  call void @llvm.experimental.noalias.scope.decl(metadata !190)
  %_1.val.i.i.i.i.i.i8.i = load i64, ptr %110, align 8, !alias.scope !193, !noundef !2
  %111 = icmp eq i64 %_1.val.i.i.i.i.i.i8.i, 0
  br i1 %111, label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i.i11.i", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i.i9.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i.i9.i": ; preds = %bb2.i.i3.i.i.i
  %112 = getelementptr inbounds i8, ptr %16, i64 72
  %_1.val1.i.i.i.i.i.i10.i = load ptr, ptr %112, align 8, !alias.scope !193, !nonnull !2, !noundef !2
  call void @__rust_dealloc(ptr noundef nonnull %_1.val1.i.i.i.i.i.i10.i, i64 noundef %_1.val.i.i.i.i.i.i8.i, i64 noundef 1) #16, !noalias !193
  br label %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i.i11.i"

"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i.i11.i": ; preds = %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i.i.i.i.i9.i", %bb2.i.i3.i.i.i
  %113 = getelementptr inbounds i8, ptr %16, i64 88
  %_1.val.i1.i.i.i.i.i12.i = load i64, ptr %113, align 8, !alias.scope !194, !noundef !2
  %114 = icmp eq i64 %_1.val.i1.i.i.i.i.i12.i, 0
  br i1 %114, label %"_ZN4core3ptr46drop_in_place$LT$anchor_lang..error..Error$GT$17h040c268f9a5b79fdE.exit", label %bb1.sink.split.i

bb1.sink.split.i:                                 ; preds = %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i.i11.i", %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i.i.i"
  %.sink2.i = phi i64 [ 120, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i.i.i" ], [ 96, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i.i11.i" ]
  %_1.val.i1.i.i.i.i.i12.sink.i = phi i64 [ %_1.val.i1.i.i.i.i.i.i, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i.i.i" ], [ %_1.val.i1.i.i.i.i.i12.i, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i.i11.i" ]
  %.sink.ph.i = phi i64 [ 160, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i.i.i" ], [ 128, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i.i11.i" ]
  %115 = getelementptr inbounds i8, ptr %16, i64 %.sink2.i
  %_1.val1.i3.i.i.i.i.i14.i = load ptr, ptr %115, align 8, !nonnull !2, !noundef !2
  call void @__rust_dealloc(ptr noundef nonnull %_1.val1.i3.i.i.i.i.i14.i, i64 noundef %_1.val.i1.i.i.i.i.i12.sink.i, i64 noundef 1) #16, !noalias !2
  br label %"_ZN4core3ptr46drop_in_place$LT$anchor_lang..error..Error$GT$17h040c268f9a5b79fdE.exit"

"_ZN4core3ptr46drop_in_place$LT$anchor_lang..error..Error$GT$17h040c268f9a5b79fdE.exit": ; preds = %"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE.exit.i.i.i", %bb2.i5.i.i.i, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i.i.i", %"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE.exit.i.i7.i", %bb2.i2.i.i.i, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i.i11.i", %bb1.sink.split.i
  %.sink.i = phi i64 [ 160, %"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE.exit.i.i.i" ], [ 160, %bb2.i5.i.i.i ], [ 160, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i.i.i" ], [ 128, %"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE.exit.i.i7.i" ], [ 128, %bb2.i2.i.i.i ], [ 128, %"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE.exit.i.i.i.i.i11.i" ], [ %.sink.ph.i, %bb1.sink.split.i ]
  call void @__rust_dealloc(ptr noundef nonnull %16, i64 noundef %.sink.i, i64 noundef 8) #16
  br label %bb10
}

; method_public_multi::with_bonus
; Function Attrs: nounwind
define hidden void @_ZN19method_public_multi10with_bonus17h52a224b6bdeda4b6E(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([16 x i8]) align 8 dereferenceable(16) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(96) %result, i64 noundef %bonus) unnamed_addr #0 {
start:
  %_5 = alloca [16 x i8], align 8
  call void @llvm.lifetime.start.p0(i64 16, ptr nonnull %_5)
; call method_public_multi::BuyResult::total_user_quote
  call void @_ZN19method_public_multi9BuyResult16total_user_quote17hf6a22b87e70fe291E(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_5, ptr noalias noundef nonnull readonly align 8 dereferenceable(96) %result) #16
  %0 = load i64, ptr %_5, align 8, !range !62, !noundef !2
  %1 = icmp eq i64 %0, 2
  %2 = getelementptr inbounds i8, ptr %_5, i64 8
  br i1 %1, label %bb5, label %bb4

bb5:                                              ; preds = %start
  %_9 = load i64, ptr %2, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_5)
  %_3 = add i64 %_9, %bonus
  %3 = inttoptr i64 %_3 to ptr
  br label %bb3

bb4:                                              ; preds = %start
  %_10.1 = load ptr, ptr %2, align 8, !noundef !2
  call void @llvm.lifetime.end.p0(i64 16, ptr nonnull %_5)
  br label %bb3

bb3:                                              ; preds = %bb4, %bb5
  %_10.1.sink = phi ptr [ %3, %bb5 ], [ %_10.1, %bb4 ]
  %4 = getelementptr inbounds i8, ptr %_0, i64 8
  store ptr %_10.1.sink, ptr %4, align 8
  store i64 %0, ptr %_0, align 8
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

; core::fmt::num::imp::<impl core::fmt::Display for u64>::fmt
; Function Attrs: nounwind
declare noundef zeroext i1 @"_ZN4core3fmt3num3imp52_$LT$impl$u20$core..fmt..Display$u20$for$u20$u64$GT$3fmt17h507b2a1c734f693aE"(ptr noalias noundef readonly align 8 dereferenceable(8), ptr noalias noundef align 8 dereferenceable(64)) unnamed_addr #0

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
!10 = distinct !{!10, !11, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4e6b266acd8549c0E: %self"}
!11 = distinct !{!11, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4e6b266acd8549c0E"}
!12 = !{!13}
!13 = distinct !{!13, !14, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h2a553790acaeecd8E: %self"}
!14 = distinct !{!14, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h2a553790acaeecd8E"}
!15 = !{!16}
!16 = distinct !{!16, !17, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h86e1c5df09afd104E: %self"}
!17 = distinct !{!17, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h86e1c5df09afd104E"}
!18 = !{!16, !13, !10, !4}
!19 = !{!20}
!20 = distinct !{!20, !11, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4e6b266acd8549c0E: %other.0"}
!21 = !{!22, !16, !13, !10, !4}
!22 = distinct !{!22, !23, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17hea11c80158d134a8E: %self"}
!23 = distinct !{!23, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17hea11c80158d134a8E"}
!24 = !{!25}
!25 = distinct !{!25, !26, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$4push17h69a0e9b11f8b1178E: %self"}
!26 = distinct !{!26, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$4push17h69a0e9b11f8b1178E"}
!27 = !{!25, !4}
!28 = !{!29}
!29 = distinct !{!29, !30, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4e6b266acd8549c0E: %self"}
!30 = distinct !{!30, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4e6b266acd8549c0E"}
!31 = !{!32}
!32 = distinct !{!32, !33, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h2a553790acaeecd8E: %self"}
!33 = distinct !{!33, !"_ZN132_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$$RF$T$C$core..slice..iter..Iter$LT$T$GT$$GT$$GT$11spec_extend17h2a553790acaeecd8E"}
!34 = !{!35}
!35 = distinct !{!35, !36, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h86e1c5df09afd104E: %self"}
!36 = distinct !{!36, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$15append_elements17h86e1c5df09afd104E"}
!37 = !{!35, !32, !29}
!38 = !{!39}
!39 = distinct !{!39, !30, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$17extend_from_slice17h4e6b266acd8549c0E: %other.0"}
!40 = !{!41, !35, !32, !29}
!41 = distinct !{!41, !42, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17hea11c80158d134a8E: %self"}
!42 = distinct !{!42, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17hea11c80158d134a8E"}
!43 = !{i64 0, i64 -9223372036854775807}
!44 = !{!45}
!45 = distinct !{!45, !46, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14grow_amortized17h770e95498cd8dbabE: %self"}
!46 = distinct !{!46, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14grow_amortized17h770e95498cd8dbabE"}
!47 = !{!48}
!48 = distinct !{!48, !49, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hef4c02fd94bc604cE: %_0"}
!49 = distinct !{!49, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hef4c02fd94bc604cE"}
!50 = !{i64 0, i64 2}
!51 = !{!52}
!52 = distinct !{!52, !53, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14grow_amortized17h770e95498cd8dbabE: %self"}
!53 = distinct !{!53, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14grow_amortized17h770e95498cd8dbabE"}
!54 = !{!55}
!55 = distinct !{!55, !56, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hef4c02fd94bc604cE: %_0"}
!56 = distinct !{!56, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17hef4c02fd94bc604cE"}
!57 = !{!58, !60}
!58 = distinct !{!58, !59, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1577995294be3c28E: %_0"}
!59 = distinct !{!59, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1577995294be3c28E"}
!60 = distinct !{!60, !59, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1577995294be3c28E: %self"}
!61 = !{!58}
!62 = !{i64 0, i64 3}
!63 = !{!64, !66}
!64 = distinct !{!64, !65, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1577995294be3c28E: %_0"}
!65 = distinct !{!65, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1577995294be3c28E"}
!66 = distinct !{!66, !65, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h1577995294be3c28E: %self"}
!67 = !{!64}
!68 = !{!69, !71}
!69 = distinct !{!69, !70, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E: %_0"}
!70 = distinct !{!70, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E"}
!71 = distinct !{!71, !70, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E: %self"}
!72 = !{!69}
!73 = !{!71}
!74 = !{!75, !77}
!75 = distinct !{!75, !76, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E: %_0"}
!76 = distinct !{!76, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E"}
!77 = distinct !{!77, !76, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E: %self"}
!78 = !{!75}
!79 = !{!80}
!80 = distinct !{!80, !81, !"_ZN4core3ptr83drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ComparedValues$GT$$GT$17h65080a2f336ce848E: %_1"}
!81 = distinct !{!81, !"_ZN4core3ptr83drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ComparedValues$GT$$GT$17h65080a2f336ce848E"}
!82 = !{i8 0, i8 3}
!83 = !{!84}
!84 = distinct !{!84, !85, !"_ZN4core3ptr55drop_in_place$LT$anchor_lang..error..ComparedValues$GT$17hec231cbf216c18ecE: %_1"}
!85 = distinct !{!85, !"_ZN4core3ptr55drop_in_place$LT$anchor_lang..error..ComparedValues$GT$17hec231cbf216c18ecE"}
!86 = !{!87}
!87 = distinct !{!87, !88, !"_ZN4core3ptr74drop_in_place$LT$$LP$alloc..string..String$C$alloc..string..String$RP$$GT$17h8a1f5bc56933ca44E: %_1"}
!88 = distinct !{!88, !"_ZN4core3ptr74drop_in_place$LT$$LP$alloc..string..String$C$alloc..string..String$RP$$GT$17h8a1f5bc56933ca44E"}
!89 = !{!90}
!90 = distinct !{!90, !91, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE: %_1"}
!91 = distinct !{!91, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE"}
!92 = !{!90, !87, !84, !80}
!93 = !{!94, !87, !84, !80}
!94 = distinct !{!94, !95, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE: %_1"}
!95 = distinct !{!95, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE"}
!96 = !{!97, !99}
!97 = distinct !{!97, !98, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E: %_0"}
!98 = distinct !{!98, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E"}
!99 = distinct !{!99, !98, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E: %self"}
!100 = !{!97}
!101 = !{!99}
!102 = !{!103, !105}
!103 = distinct !{!103, !104, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E: %_0"}
!104 = distinct !{!104, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E"}
!105 = distinct !{!105, !104, !"_ZN45_$LT$T$u20$as$u20$alloc..string..ToString$GT$9to_string17h26f1f66d0635f680E: %self"}
!106 = !{!103}
!107 = !{!108}
!108 = distinct !{!108, !109, !"_ZN4core3ptr83drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ComparedValues$GT$$GT$17h65080a2f336ce848E: %_1"}
!109 = distinct !{!109, !"_ZN4core3ptr83drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ComparedValues$GT$$GT$17h65080a2f336ce848E"}
!110 = !{!111}
!111 = distinct !{!111, !112, !"_ZN4core3ptr55drop_in_place$LT$anchor_lang..error..ComparedValues$GT$17hec231cbf216c18ecE: %_1"}
!112 = distinct !{!112, !"_ZN4core3ptr55drop_in_place$LT$anchor_lang..error..ComparedValues$GT$17hec231cbf216c18ecE"}
!113 = !{!114}
!114 = distinct !{!114, !115, !"_ZN4core3ptr74drop_in_place$LT$$LP$alloc..string..String$C$alloc..string..String$RP$$GT$17h8a1f5bc56933ca44E: %_1"}
!115 = distinct !{!115, !"_ZN4core3ptr74drop_in_place$LT$$LP$alloc..string..String$C$alloc..string..String$RP$$GT$17h8a1f5bc56933ca44E"}
!116 = !{!117}
!117 = distinct !{!117, !118, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE: %_1"}
!118 = distinct !{!118, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE"}
!119 = !{!117, !114, !111, !108}
!120 = !{!121, !114, !111, !108}
!121 = distinct !{!121, !122, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE: %_1"}
!122 = distinct !{!122, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE"}
!123 = !{!124}
!124 = distinct !{!124, !125, !"_ZN4core3ptr52drop_in_place$LT$anchor_lang..error..AnchorError$GT$17h685208825b2ad344E: %_1"}
!125 = distinct !{!125, !"_ZN4core3ptr52drop_in_place$LT$anchor_lang..error..AnchorError$GT$17h685208825b2ad344E"}
!126 = !{!127}
!127 = distinct !{!127, !128, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE: %_1"}
!128 = distinct !{!128, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE"}
!129 = !{!127, !124}
!130 = !{!131}
!131 = distinct !{!131, !132, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE: %_1"}
!132 = distinct !{!132, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE"}
!133 = !{!131, !124}
!134 = !{!135}
!135 = distinct !{!135, !136, !"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE: %_1"}
!136 = distinct !{!136, !"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE"}
!137 = !{!135, !124}
!138 = !{!139}
!139 = distinct !{!139, !140, !"_ZN4core3ptr52drop_in_place$LT$anchor_lang..error..ErrorOrigin$GT$17hf97d91cd969b9c2cE: %_1"}
!140 = distinct !{!140, !"_ZN4core3ptr52drop_in_place$LT$anchor_lang..error..ErrorOrigin$GT$17hf97d91cd969b9c2cE"}
!141 = !{!142}
!142 = distinct !{!142, !143, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE: %_1"}
!143 = distinct !{!143, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE"}
!144 = !{!142, !139, !135, !124}
!145 = !{!146}
!146 = distinct !{!146, !147, !"_ZN4core3ptr83drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ComparedValues$GT$$GT$17h65080a2f336ce848E: %_1"}
!147 = distinct !{!147, !"_ZN4core3ptr83drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ComparedValues$GT$$GT$17h65080a2f336ce848E"}
!148 = !{!146, !124}
!149 = !{!150}
!150 = distinct !{!150, !151, !"_ZN4core3ptr55drop_in_place$LT$anchor_lang..error..ComparedValues$GT$17hec231cbf216c18ecE: %_1"}
!151 = distinct !{!151, !"_ZN4core3ptr55drop_in_place$LT$anchor_lang..error..ComparedValues$GT$17hec231cbf216c18ecE"}
!152 = !{!153}
!153 = distinct !{!153, !154, !"_ZN4core3ptr74drop_in_place$LT$$LP$alloc..string..String$C$alloc..string..String$RP$$GT$17h8a1f5bc56933ca44E: %_1"}
!154 = distinct !{!154, !"_ZN4core3ptr74drop_in_place$LT$$LP$alloc..string..String$C$alloc..string..String$RP$$GT$17h8a1f5bc56933ca44E"}
!155 = !{!156}
!156 = distinct !{!156, !157, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE: %_1"}
!157 = distinct !{!157, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE"}
!158 = !{!156, !153, !150, !146, !124}
!159 = !{!160, !153, !150, !146, !124}
!160 = distinct !{!160, !161, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE: %_1"}
!161 = distinct !{!161, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE"}
!162 = !{!163}
!163 = distinct !{!163, !164, !"_ZN4core3ptr63drop_in_place$LT$anchor_lang..error..ProgramErrorWithOrigin$GT$17h25ef7a429c98edc9E: %_1"}
!164 = distinct !{!164, !"_ZN4core3ptr63drop_in_place$LT$anchor_lang..error..ProgramErrorWithOrigin$GT$17h25ef7a429c98edc9E"}
!165 = !{i64 0, i64 -9223372036854775782}
!166 = !{!167, !163}
!167 = distinct !{!167, !168, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE: %_1"}
!168 = distinct !{!168, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE"}
!169 = !{!170}
!170 = distinct !{!170, !171, !"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE: %_1"}
!171 = distinct !{!171, !"_ZN4core3ptr80drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ErrorOrigin$GT$$GT$17h77d8758baf22ecceE"}
!172 = !{!170, !163}
!173 = !{!174}
!174 = distinct !{!174, !175, !"_ZN4core3ptr52drop_in_place$LT$anchor_lang..error..ErrorOrigin$GT$17hf97d91cd969b9c2cE: %_1"}
!175 = distinct !{!175, !"_ZN4core3ptr52drop_in_place$LT$anchor_lang..error..ErrorOrigin$GT$17hf97d91cd969b9c2cE"}
!176 = !{!177}
!177 = distinct !{!177, !178, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE: %_1"}
!178 = distinct !{!178, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE"}
!179 = !{!177, !174, !170, !163}
!180 = !{!181}
!181 = distinct !{!181, !182, !"_ZN4core3ptr83drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ComparedValues$GT$$GT$17h65080a2f336ce848E: %_1"}
!182 = distinct !{!182, !"_ZN4core3ptr83drop_in_place$LT$core..option..Option$LT$anchor_lang..error..ComparedValues$GT$$GT$17h65080a2f336ce848E"}
!183 = !{!181, !163}
!184 = !{!185}
!185 = distinct !{!185, !186, !"_ZN4core3ptr55drop_in_place$LT$anchor_lang..error..ComparedValues$GT$17hec231cbf216c18ecE: %_1"}
!186 = distinct !{!186, !"_ZN4core3ptr55drop_in_place$LT$anchor_lang..error..ComparedValues$GT$17hec231cbf216c18ecE"}
!187 = !{!188}
!188 = distinct !{!188, !189, !"_ZN4core3ptr74drop_in_place$LT$$LP$alloc..string..String$C$alloc..string..String$RP$$GT$17h8a1f5bc56933ca44E: %_1"}
!189 = distinct !{!189, !"_ZN4core3ptr74drop_in_place$LT$$LP$alloc..string..String$C$alloc..string..String$RP$$GT$17h8a1f5bc56933ca44E"}
!190 = !{!191}
!191 = distinct !{!191, !192, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE: %_1"}
!192 = distinct !{!192, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE"}
!193 = !{!191, !188, !185, !181, !163}
!194 = !{!195, !188, !185, !181, !163}
!195 = distinct !{!195, !196, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE: %_1"}
!196 = distinct !{!196, !"_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17h16a384a1ca8e016bE"}
