; ModuleID = 'flags.5c9a9ecaad1c12d6-cgu.0'
source_filename = "flags.5c9a9ecaad1c12d6-cgu.0"
target datalayout = "e-m:e-p:64:64-i64:64-n32:64-S128"
target triple = "sbf"

@_ZN5flags11tuple_shape17h32763d19498d12dcE = hidden unnamed_addr alias void (ptr, ptr), ptr @_ZN5flags11tuple_moved17hffaae8c84f9a34cdE

; flags::original_shape
; Function Attrs: nounwind
define hidden void @_ZN5flags14original_shape17hcea5e8c283ec765eE(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([24 x i8]) align 8 dereferenceable(24) %_0, i64 noundef %start1, i64 noundef %end, i64 noundef %0, i1 noundef zeroext %1) unnamed_addr #0 {
start:
  tail call void @llvm.experimental.noalias.scope.decl(metadata !2)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !5)
  %.sink1.i.i.i.i = tail call i64 @llvm.usub.sat.i64(i64 %end, i64 %start1)
  %.not.i.i = icmp ugt i64 %end, %start1
  br i1 %.not.i.i, label %bb4.i.i.i, label %"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h1423818991c4382bE.exit"

bb4.i.i.i:                                        ; preds = %start
  %_4.i.i.i.i = icmp sgt i64 %.sink1.i.i.i.i, -1
  br i1 %_4.i.i.i.i, label %bb5.i.i.i.i.i, label %bb7.i.i

bb5.i.i.i.i.i:                                    ; preds = %bb4.i.i.i
  %2 = load i64, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !8, !noundef !13
  %3 = icmp eq i64 %2, 0
  %pos.sroa.0.0.i.i.i.i.i.i.i = select i1 %3, i64 12884934656, i64 %2
  %4 = tail call i64 @llvm.usub.sat.i64(i64 %pos.sroa.0.0.i.i.i.i.i.i.i, i64 %.sink1.i.i.i.i)
  %_15.i.i.i.i.i.i.i = icmp ult i64 %4, 12884901896
  br i1 %_15.i.i.i.i.i.i.i, label %bb7.i.i, label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i"

"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i": ; preds = %bb5.i.i.i.i.i
  store i64 %4, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !8
  %5 = inttoptr i64 %4 to ptr
  br label %bb3.i.i.i.i.i.i.i

bb3.i.i.i.i.i.i.i:                                ; preds = %bb3.i.i.i.i.i.i.i, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i"
  %6 = phi i64 [ %9, %bb3.i.i.i.i.i.i.i ], [ 0, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i" ]
  %self.sroa.0.08.i.i.i.i.i.i.i = phi i64 [ %_0.i1.i.i.i.i.i.i.i.i.i, %bb3.i.i.i.i.i.i.i ], [ %start1, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i" ]
  %_0.i1.i.i.i.i.i.i.i.i.i = add nuw i64 %self.sroa.0.08.i.i.i.i.i.i.i, 1
  %7 = icmp eq i64 %_0.i1.i.i.i.i.i.i.i.i.i, %0
  %8 = icmp eq i64 %self.sroa.0.08.i.i.i.i.i.i.i, 0
  %protocol.sroa.0.0.in2.i.i.i.i.i.i.i.i.i = select i1 %1, i1 %7, i1 %8
  %creator.sroa.0.0.in.i.i.i.i.i.i.i.i.i = select i1 %1, i1 %8, i1 %7
  %_13.i.i.i.i.i.i.i.i.i = zext i1 %protocol.sroa.0.0.in2.i.i.i.i.i.i.i.i.i to i8
  %_15.i.i.i.i.i.i.i.i.i = select i1 %creator.sroa.0.0.in.i.i.i.i.i.i.i.i.i, i8 2, i8 0
  %_0.i.i.i.i.i.i.i.i.i = or disjoint i8 %_15.i.i.i.i.i.i.i.i.i, %_13.i.i.i.i.i.i.i.i.i
  %dst.i.i.i.i.i.i.i.i.i.i = getelementptr inbounds i8, ptr %5, i64 %6
  store i8 %_0.i.i.i.i.i.i.i.i.i, ptr %dst.i.i.i.i.i.i.i.i.i.i, align 1, !noalias !14
  %9 = add i64 %6, 1
  %_0.i.i.i.i.i.i.i.i.i.i = icmp ult i64 %_0.i1.i.i.i.i.i.i.i.i.i, %end
  br i1 %_0.i.i.i.i.i.i.i.i.i.i, label %bb3.i.i.i.i.i.i.i, label %"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h1423818991c4382bE.exit"

bb7.i.i:                                          ; preds = %bb5.i.i.i.i.i, %bb4.i.i.i
  %_15.sroa.4.0.i.i = phi i64 [ 0, %bb4.i.i.i ], [ 1, %bb5.i.i.i.i.i ]
; call alloc::raw_vec::handle_error
  tail call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef %_15.sroa.4.0.i.i, i64 %.sink1.i.i.i.i) #10, !noalias !35
  unreachable

"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h1423818991c4382bE.exit": ; preds = %bb3.i.i.i.i.i.i.i, %start
  %vector.sroa.0.027.i.i = phi i64 [ 0, %start ], [ %.sink1.i.i.i.i, %bb3.i.i.i.i.i.i.i ]
  %vector.sroa.5.026.i.i = phi i64 [ 1, %start ], [ %4, %bb3.i.i.i.i.i.i.i ]
  %f.val1.i.i.i.i.i.i.i = phi i64 [ 0, %start ], [ %9, %bb3.i.i.i.i.i.i.i ]
  store i64 %vector.sroa.0.027.i.i, ptr %_0, align 8, !alias.scope !36, !noalias !37
  %vector.sroa.5.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %vector.sroa.5.026.i.i, ptr %vector.sroa.5.0._0.sroa_idx.i.i, align 8, !alias.scope !36, !noalias !37
  %vector.sroa.9.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_0, i64 16
  store i64 %f.val1.i.i.i.i.i.i.i, ptr %vector.sroa.9.0._0.sroa_idx.i.i, align 8, !alias.scope !36, !noalias !37
  ret void
}

; flags::match_shape
; Function Attrs: nounwind
define hidden void @_ZN5flags11match_shape17h0230d9f2598987d0E(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([24 x i8]) align 8 dereferenceable(24) %_0, i64 noundef %start1, i64 noundef %end, i64 noundef %0, i1 noundef zeroext %1) unnamed_addr #0 {
start:
  tail call void @llvm.experimental.noalias.scope.decl(metadata !38)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !41)
  %.sink1.i.i.i.i = tail call i64 @llvm.usub.sat.i64(i64 %end, i64 %start1)
  %.not.i.i = icmp ugt i64 %end, %start1
  br i1 %.not.i.i, label %bb4.i.i.i, label %"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h4a8b5d49cc04131cE.exit"

bb4.i.i.i:                                        ; preds = %start
  %_4.i.i.i.i = icmp sgt i64 %.sink1.i.i.i.i, -1
  br i1 %_4.i.i.i.i, label %bb5.i.i.i.i.i, label %bb7.i.i

bb5.i.i.i.i.i:                                    ; preds = %bb4.i.i.i
  %2 = load i64, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !44, !noundef !13
  %3 = icmp eq i64 %2, 0
  %pos.sroa.0.0.i.i.i.i.i.i.i = select i1 %3, i64 12884934656, i64 %2
  %4 = tail call i64 @llvm.usub.sat.i64(i64 %pos.sroa.0.0.i.i.i.i.i.i.i, i64 %.sink1.i.i.i.i)
  %_15.i.i.i.i.i.i.i = icmp ult i64 %4, 12884901896
  br i1 %_15.i.i.i.i.i.i.i, label %bb7.i.i, label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i"

"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i": ; preds = %bb5.i.i.i.i.i
  store i64 %4, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !44
  %5 = inttoptr i64 %4 to ptr
  br label %bb3.i.i.i.i.i.i.i

bb3.i.i.i.i.i.i.i:                                ; preds = %bb3.i.i.i.i.i.i.i, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i"
  %6 = phi i64 [ %8, %bb3.i.i.i.i.i.i.i ], [ 0, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i" ]
  %self.sroa.0.010.i.i.i.i.i.i.i = phi i64 [ %_0.i1.i.i.i.i.i.i.i.i.i, %bb3.i.i.i.i.i.i.i ], [ %start1, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i" ]
  %_0.i1.i.i.i.i.i.i.i.i.i = add nuw i64 %self.sroa.0.010.i.i.i.i.i.i.i, 1
  %_4.i.i3.i.i.i.i.i.i.i = icmp eq i64 %_0.i1.i.i.i.i.i.i.i.i.i, %0
  %_10.i.i.i.i.i.i.i.i.i = icmp eq i64 %self.sroa.0.010.i.i.i.i.i.i.i, 0
  %_10.sink.i.i.i.i.i.i.i.i.i = select i1 %1, i1 %_10.i.i.i.i.i.i.i.i.i, i1 %_4.i.i3.i.i.i.i.i.i.i
  %_3.sink.in.i.i.i.i.i.i.i.i.i = select i1 %1, i1 %_4.i.i3.i.i.i.i.i.i.i, i1 %_10.i.i.i.i.i.i.i.i.i
  %_3.sink.i.i.i.i.i.i.i.i.i = zext i1 %_3.sink.in.i.i.i.i.i.i.i.i.i to i8
  %_8.i.i.i.i.i.i.i.i.i = select i1 %_10.sink.i.i.i.i.i.i.i.i.i, i8 2, i8 0
  %7 = or disjoint i8 %_8.i.i.i.i.i.i.i.i.i, %_3.sink.i.i.i.i.i.i.i.i.i
  %dst.i.i.i.i.i.i.i.i.i.i = getelementptr inbounds i8, ptr %5, i64 %6
  store i8 %7, ptr %dst.i.i.i.i.i.i.i.i.i.i, align 1, !noalias !49
  %8 = add i64 %6, 1
  %_0.i.i.i.i.i.i.i.i.i.i = icmp ult i64 %_0.i1.i.i.i.i.i.i.i.i.i, %end
  br i1 %_0.i.i.i.i.i.i.i.i.i.i, label %bb3.i.i.i.i.i.i.i, label %"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h4a8b5d49cc04131cE.exit"

bb7.i.i:                                          ; preds = %bb5.i.i.i.i.i, %bb4.i.i.i
  %_15.sroa.4.0.i.i = phi i64 [ 0, %bb4.i.i.i ], [ 1, %bb5.i.i.i.i.i ]
; call alloc::raw_vec::handle_error
  tail call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef %_15.sroa.4.0.i.i, i64 %.sink1.i.i.i.i) #10, !noalias !70
  unreachable

"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h4a8b5d49cc04131cE.exit": ; preds = %bb3.i.i.i.i.i.i.i, %start
  %vector.sroa.0.027.i.i = phi i64 [ 0, %start ], [ %.sink1.i.i.i.i, %bb3.i.i.i.i.i.i.i ]
  %vector.sroa.5.026.i.i = phi i64 [ 1, %start ], [ %4, %bb3.i.i.i.i.i.i.i ]
  %f.val1.i.i.i.i.i.i.i = phi i64 [ 0, %start ], [ %8, %bb3.i.i.i.i.i.i.i ]
  store i64 %vector.sroa.0.027.i.i, ptr %_0, align 8, !alias.scope !71, !noalias !72
  %vector.sroa.5.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %vector.sroa.5.026.i.i, ptr %vector.sroa.5.0._0.sroa_idx.i.i, align 8, !alias.scope !71, !noalias !72
  %vector.sroa.9.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_0, i64 16
  store i64 %f.val1.i.i.i.i.i.i.i, ptr %vector.sroa.9.0._0.sroa_idx.i.i, align 8, !alias.scope !71, !noalias !72
  ret void
}

; flags::shared_shape
; Function Attrs: nounwind
define hidden void @_ZN5flags12shared_shape17h0ce15f12e5c9a8c5E(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([24 x i8]) align 8 dereferenceable(24) %_0, i64 noundef %start1, i64 noundef %end, i64 noundef %0, i1 noundef zeroext %1) unnamed_addr #0 {
start:
  tail call void @llvm.experimental.noalias.scope.decl(metadata !73)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !76)
  %.sink1.i.i.i.i = tail call i64 @llvm.usub.sat.i64(i64 %end, i64 %start1)
  %.not.i.i = icmp ugt i64 %end, %start1
  br i1 %.not.i.i, label %bb4.i.i.i, label %"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17he2201012fc8c3a7bE.exit"

bb4.i.i.i:                                        ; preds = %start
  %_4.i.i.i.i = icmp sgt i64 %.sink1.i.i.i.i, -1
  br i1 %_4.i.i.i.i, label %bb5.i.i.i.i.i, label %bb7.i.i

bb5.i.i.i.i.i:                                    ; preds = %bb4.i.i.i
  %2 = load i64, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !79, !noundef !13
  %3 = icmp eq i64 %2, 0
  %pos.sroa.0.0.i.i.i.i.i.i.i = select i1 %3, i64 12884934656, i64 %2
  %4 = tail call i64 @llvm.usub.sat.i64(i64 %pos.sroa.0.0.i.i.i.i.i.i.i, i64 %.sink1.i.i.i.i)
  %_15.i.i.i.i.i.i.i = icmp ult i64 %4, 12884901896
  br i1 %_15.i.i.i.i.i.i.i, label %bb7.i.i, label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i"

"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i": ; preds = %bb5.i.i.i.i.i
  store i64 %4, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !79
  %5 = inttoptr i64 %4 to ptr
  br label %bb3.i.i.i.i.i.i.i

bb3.i.i.i.i.i.i.i:                                ; preds = %bb3.i.i.i.i.i.i.i, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i"
  %6 = phi i64 [ %8, %bb3.i.i.i.i.i.i.i ], [ 0, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i" ]
  %self.sroa.0.08.i.i.i.i.i.i.i = phi i64 [ %7, %bb3.i.i.i.i.i.i.i ], [ %start1, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i" ]
  %7 = add nuw i64 %self.sroa.0.08.i.i.i.i.i.i.i, 1
  %first.i.i.i.i.i.i.i.i.i = icmp eq i64 %self.sroa.0.08.i.i.i.i.i.i.i, 0
  %last.i.i.i.i.i.i.i.i.i = icmp eq i64 %7, %0
  %first.last.i.i.i.i.i.i.i.i.i = select i1 %1, i1 %last.i.i.i.i.i.i.i.i.i, i1 %first.i.i.i.i.i.i.i.i.i
  %creator.sroa.0.0.in.i.i.i.i.i.i.i.i.i = select i1 %1, i1 %first.i.i.i.i.i.i.i.i.i, i1 %last.i.i.i.i.i.i.i.i.i
  %_12.i.i.i.i.i.i.i.i.i = zext i1 %first.last.i.i.i.i.i.i.i.i.i to i8
  %_14.i.i.i.i.i.i.i.i.i = select i1 %creator.sroa.0.0.in.i.i.i.i.i.i.i.i.i, i8 2, i8 0
  %_0.i.i.i.i.i.i.i.i.i = or disjoint i8 %_14.i.i.i.i.i.i.i.i.i, %_12.i.i.i.i.i.i.i.i.i
  %dst.i.i.i.i.i.i.i.i.i.i = getelementptr inbounds i8, ptr %5, i64 %6
  store i8 %_0.i.i.i.i.i.i.i.i.i, ptr %dst.i.i.i.i.i.i.i.i.i.i, align 1, !noalias !84
  %8 = add i64 %6, 1
  %_0.i.i.i.i.i.i.i.i.i.i = icmp ult i64 %7, %end
  br i1 %_0.i.i.i.i.i.i.i.i.i.i, label %bb3.i.i.i.i.i.i.i, label %"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17he2201012fc8c3a7bE.exit"

bb7.i.i:                                          ; preds = %bb5.i.i.i.i.i, %bb4.i.i.i
  %_15.sroa.4.0.i.i = phi i64 [ 0, %bb4.i.i.i ], [ 1, %bb5.i.i.i.i.i ]
; call alloc::raw_vec::handle_error
  tail call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef %_15.sroa.4.0.i.i, i64 %.sink1.i.i.i.i) #10, !noalias !105
  unreachable

"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17he2201012fc8c3a7bE.exit": ; preds = %bb3.i.i.i.i.i.i.i, %start
  %vector.sroa.0.027.i.i = phi i64 [ 0, %start ], [ %.sink1.i.i.i.i, %bb3.i.i.i.i.i.i.i ]
  %vector.sroa.5.026.i.i = phi i64 [ 1, %start ], [ %4, %bb3.i.i.i.i.i.i.i ]
  %f.val1.i.i.i.i.i.i.i = phi i64 [ 0, %start ], [ %8, %bb3.i.i.i.i.i.i.i ]
  store i64 %vector.sroa.0.027.i.i, ptr %_0, align 8, !alias.scope !106, !noalias !107
  %vector.sroa.5.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %vector.sroa.5.026.i.i, ptr %vector.sroa.5.0._0.sroa_idx.i.i, align 8, !alias.scope !106, !noalias !107
  %vector.sroa.9.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_0, i64 16
  store i64 %f.val1.i.i.i.i.i.i.i, ptr %vector.sroa.9.0._0.sroa_idx.i.i, align 8, !alias.scope !106, !noalias !107
  ret void
}

; flags::moved_shape
; Function Attrs: nounwind
define hidden void @_ZN5flags11moved_shape17hf5d3543c74ba9aabE(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([24 x i8]) align 8 dereferenceable(24) %_0, i64 noundef %start1, i64 noundef %end, i64 noundef %count, i1 noundef zeroext %sell) unnamed_addr #0 {
start:
  tail call void @llvm.experimental.noalias.scope.decl(metadata !108)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !111)
  %.sink1.i.i.i.i = tail call i64 @llvm.usub.sat.i64(i64 %end, i64 %start1)
  %.not.i.i = icmp ugt i64 %end, %start1
  br i1 %.not.i.i, label %bb4.i.i.i, label %"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h6d6a45ef5b16952eE.exit"

bb4.i.i.i:                                        ; preds = %start
  %_4.i.i.i.i = icmp sgt i64 %.sink1.i.i.i.i, -1
  br i1 %_4.i.i.i.i, label %bb5.i.i.i.i.i, label %bb7.i.i

bb5.i.i.i.i.i:                                    ; preds = %bb4.i.i.i
  %0 = load i64, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !114, !noundef !13
  %1 = icmp eq i64 %0, 0
  %pos.sroa.0.0.i.i.i.i.i.i.i = select i1 %1, i64 12884934656, i64 %0
  %2 = tail call i64 @llvm.usub.sat.i64(i64 %pos.sroa.0.0.i.i.i.i.i.i.i, i64 %.sink1.i.i.i.i)
  %_15.i.i.i.i.i.i.i = icmp ult i64 %2, 12884901896
  br i1 %_15.i.i.i.i.i.i.i, label %bb7.i.i, label %bb3.lr.ph.i.i.i.i.i.i.i

bb3.lr.ph.i.i.i.i.i.i.i:                          ; preds = %bb5.i.i.i.i.i
  store i64 %2, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !114
  %3 = inttoptr i64 %2 to ptr
  br label %bb3.i.i.i.i.i.i.i

bb3.i.i.i.i.i.i.i:                                ; preds = %bb3.i.i.i.i.i.i.i, %bb3.lr.ph.i.i.i.i.i.i.i
  %4 = phi i64 [ 0, %bb3.lr.ph.i.i.i.i.i.i.i ], [ %7, %bb3.i.i.i.i.i.i.i ]
  %self.sroa.0.08.i.i.i.i.i.i.i = phi i64 [ %start1, %bb3.lr.ph.i.i.i.i.i.i.i ], [ %_0.i1.i.i.i.i.i.i.i.i.i, %bb3.i.i.i.i.i.i.i ]
  %_0.i1.i.i.i.i.i.i.i.i.i = add nuw i64 %self.sroa.0.08.i.i.i.i.i.i.i, 1
  %5 = icmp eq i64 %_0.i1.i.i.i.i.i.i.i.i.i, %count
  %6 = icmp eq i64 %self.sroa.0.08.i.i.i.i.i.i.i, 0
  %protocol.sroa.0.0.in2.i.i.i.i.i.i.i.i.i = select i1 %sell, i1 %5, i1 %6
  %creator.sroa.0.0.in.i.i.i.i.i.i.i.i.i = select i1 %sell, i1 %6, i1 %5
  %_13.i.i.i.i.i.i.i.i.i = zext i1 %protocol.sroa.0.0.in2.i.i.i.i.i.i.i.i.i to i8
  %_15.i.i.i.i.i.i.i.i.i = select i1 %creator.sroa.0.0.in.i.i.i.i.i.i.i.i.i, i8 2, i8 0
  %_0.i.i.i.i.i.i.i.i.i = or disjoint i8 %_15.i.i.i.i.i.i.i.i.i, %_13.i.i.i.i.i.i.i.i.i
  %dst.i.i.i.i.i.i.i.i.i.i = getelementptr inbounds i8, ptr %3, i64 %4
  store i8 %_0.i.i.i.i.i.i.i.i.i, ptr %dst.i.i.i.i.i.i.i.i.i.i, align 1, !noalias !119
  %7 = add i64 %4, 1
  %_0.i.i.i.i.i.i.i.i.i.i = icmp ult i64 %_0.i1.i.i.i.i.i.i.i.i.i, %end
  br i1 %_0.i.i.i.i.i.i.i.i.i.i, label %bb3.i.i.i.i.i.i.i, label %"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h6d6a45ef5b16952eE.exit"

bb7.i.i:                                          ; preds = %bb5.i.i.i.i.i, %bb4.i.i.i
  %_15.sroa.4.0.i.i = phi i64 [ 0, %bb4.i.i.i ], [ 1, %bb5.i.i.i.i.i ]
; call alloc::raw_vec::handle_error
  tail call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef %_15.sroa.4.0.i.i, i64 %.sink1.i.i.i.i) #10, !noalias !140
  unreachable

"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h6d6a45ef5b16952eE.exit": ; preds = %bb3.i.i.i.i.i.i.i, %start
  %8 = phi ptr [ inttoptr (i64 1 to ptr), %start ], [ %3, %bb3.i.i.i.i.i.i.i ]
  %f.val1.i.i.i.i.i.i.i = phi i64 [ 0, %start ], [ %7, %bb3.i.i.i.i.i.i.i ]
  store i64 %.sink1.i.i.i.i, ptr %_0, align 8, !alias.scope !141, !noalias !142
  %vector.sroa.4.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_0, i64 8
  store ptr %8, ptr %vector.sroa.4.0._0.sroa_idx.i.i, align 8, !alias.scope !141, !noalias !142
  %vector.sroa.6.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_0, i64 16
  store i64 %f.val1.i.i.i.i.i.i.i, ptr %vector.sroa.6.0._0.sroa_idx.i.i, align 8, !alias.scope !141, !noalias !142
  ret void
}

; flags::tuple_moved
; Function Attrs: nounwind
define hidden void @_ZN5flags11tuple_moved17hffaae8c84f9a34cdE(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([24 x i8]) align 8 dereferenceable(24) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(32) %_1) unnamed_addr #0 {
start:
  %sell = load ptr, ptr %_1, align 8, !nonnull !13, !align !143, !noundef !13
  %0 = getelementptr inbounds i8, ptr %_1, i64 8
  %count = load ptr, ptr %0, align 8, !nonnull !13, !align !144, !noundef !13
  %1 = getelementptr inbounds i8, ptr %_1, i64 16
  %range.0 = load i64, ptr %1, align 8, !noundef !13
  %2 = getelementptr inbounds i8, ptr %_1, i64 24
  %range.1 = load i64, ptr %2, align 8, !noundef !13
  tail call void @llvm.experimental.noalias.scope.decl(metadata !145)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !148)
  %.sink1.i.i.i.i = tail call i64 @llvm.usub.sat.i64(i64 %range.1, i64 %range.0)
  %.not.i.i = icmp ugt i64 %range.1, %range.0
  br i1 %.not.i.i, label %bb4.i.i.i, label %"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h9be1ad1936ce01a7E.exit"

bb4.i.i.i:                                        ; preds = %start
  %_4.i.i.i.i = icmp sgt i64 %.sink1.i.i.i.i, -1
  br i1 %_4.i.i.i.i, label %bb5.i.i.i.i.i, label %bb7.i.i

bb5.i.i.i.i.i:                                    ; preds = %bb4.i.i.i
  %3 = load i64, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !151, !noundef !13
  %4 = icmp eq i64 %3, 0
  %pos.sroa.0.0.i.i.i.i.i.i.i = select i1 %4, i64 12884934656, i64 %3
  %5 = tail call i64 @llvm.usub.sat.i64(i64 %pos.sroa.0.0.i.i.i.i.i.i.i, i64 %.sink1.i.i.i.i)
  %_15.i.i.i.i.i.i.i = icmp ult i64 %5, 12884901896
  br i1 %_15.i.i.i.i.i.i.i, label %bb7.i.i, label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i"

"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i": ; preds = %bb5.i.i.i.i.i
  store i64 %5, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !151
  %6 = inttoptr i64 %5 to ptr
  br label %bb3.i.i.i.i.i.i.i

bb3.i.i.i.i.i.i.i:                                ; preds = %"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h3e12586d5f588a40E.exit.i.i.i.i.i.i.i", %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i"
  %7 = phi i64 [ %13, %"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h3e12586d5f588a40E.exit.i.i.i.i.i.i.i" ], [ 0, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i" ]
  %self.sroa.0.08.i.i.i.i.i.i.i = phi i64 [ %_0.i1.i.i.i.i.i.i.i.i.i, %"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h3e12586d5f588a40E.exit.i.i.i.i.i.i.i" ], [ %range.0, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i" ]
  %_0.i1.i.i.i.i.i.i.i.i.i = add nuw i64 %self.sroa.0.08.i.i.i.i.i.i.i, 1
  %8 = load i8, ptr %sell, align 1, !range !156, !noalias !157, !noundef !13
  %_4.not.i.i.i.i.i.i.i.i.i = icmp eq i8 %8, 0
  br i1 %_4.not.i.i.i.i.i.i.i.i.i, label %bb7.i.i.i.i.i.i.i.i.i, label %bb5.i.i.i.i.i.i.i.i.i

bb5.i.i.i.i.i.i.i.i.i:                            ; preds = %bb3.i.i.i.i.i.i.i
  %_7.i.i.i.i.i.i.i.i.i = load i64, ptr %count, align 8, !noalias !157, !noundef !13
  %9 = icmp eq i64 %_0.i1.i.i.i.i.i.i.i.i.i, %_7.i.i.i.i.i.i.i.i.i
  %10 = icmp eq i64 %self.sroa.0.08.i.i.i.i.i.i.i, 0
  br label %"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h3e12586d5f588a40E.exit.i.i.i.i.i.i.i"

bb7.i.i.i.i.i.i.i.i.i:                            ; preds = %bb3.i.i.i.i.i.i.i
  %11 = icmp eq i64 %self.sroa.0.08.i.i.i.i.i.i.i, 0
  %_12.i.i.i.i.i.i.i.i.i = load i64, ptr %count, align 8, !noalias !157, !noundef !13
  %12 = icmp eq i64 %_0.i1.i.i.i.i.i.i.i.i.i, %_12.i.i.i.i.i.i.i.i.i
  br label %"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h3e12586d5f588a40E.exit.i.i.i.i.i.i.i"

"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h3e12586d5f588a40E.exit.i.i.i.i.i.i.i": ; preds = %bb7.i.i.i.i.i.i.i.i.i, %bb5.i.i.i.i.i.i.i.i.i
  %protocol.sroa.0.0.in2.i.i.i.i.i.i.i.i.i = phi i1 [ %9, %bb5.i.i.i.i.i.i.i.i.i ], [ %11, %bb7.i.i.i.i.i.i.i.i.i ]
  %creator.sroa.0.0.in.i.i.i.i.i.i.i.i.i = phi i1 [ %10, %bb5.i.i.i.i.i.i.i.i.i ], [ %12, %bb7.i.i.i.i.i.i.i.i.i ]
  %_13.i.i.i.i.i.i.i.i.i = zext i1 %protocol.sroa.0.0.in2.i.i.i.i.i.i.i.i.i to i8
  %_15.i.i.i.i.i.i.i.i.i = select i1 %creator.sroa.0.0.in.i.i.i.i.i.i.i.i.i, i8 2, i8 0
  %_0.i.i.i.i.i.i.i.i.i = or disjoint i8 %_15.i.i.i.i.i.i.i.i.i, %_13.i.i.i.i.i.i.i.i.i
  %dst.i.i.i.i.i.i.i.i.i.i = getelementptr inbounds i8, ptr %6, i64 %7
  store i8 %_0.i.i.i.i.i.i.i.i.i, ptr %dst.i.i.i.i.i.i.i.i.i.i, align 1, !noalias !174
  %13 = add i64 %7, 1
  %_0.i.i.i.i.i.i.i.i.i.i = icmp ult i64 %_0.i1.i.i.i.i.i.i.i.i.i, %range.1
  br i1 %_0.i.i.i.i.i.i.i.i.i.i, label %bb3.i.i.i.i.i.i.i, label %"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h9be1ad1936ce01a7E.exit"

bb7.i.i:                                          ; preds = %bb5.i.i.i.i.i, %bb4.i.i.i
  %_15.sroa.4.0.i.i = phi i64 [ 0, %bb4.i.i.i ], [ 1, %bb5.i.i.i.i.i ]
; call alloc::raw_vec::handle_error
  tail call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef %_15.sroa.4.0.i.i, i64 %.sink1.i.i.i.i) #10, !noalias !179
  unreachable

"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h9be1ad1936ce01a7E.exit": ; preds = %"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h3e12586d5f588a40E.exit.i.i.i.i.i.i.i", %start
  %vector.sroa.0.027.i.i = phi i64 [ 0, %start ], [ %.sink1.i.i.i.i, %"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h3e12586d5f588a40E.exit.i.i.i.i.i.i.i" ]
  %vector.sroa.5.026.i.i = phi i64 [ 1, %start ], [ %5, %"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h3e12586d5f588a40E.exit.i.i.i.i.i.i.i" ]
  %f.val1.i.i.i.i.i.i.i = phi i64 [ 0, %start ], [ %13, %"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h3e12586d5f588a40E.exit.i.i.i.i.i.i.i" ]
  store i64 %vector.sroa.0.027.i.i, ptr %_0, align 8, !alias.scope !180, !noalias !181
  %vector.sroa.5.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %vector.sroa.5.026.i.i, ptr %vector.sroa.5.0._0.sroa_idx.i.i, align 8, !alias.scope !180, !noalias !181
  %vector.sroa.9.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_0, i64 16
  store i64 %f.val1.i.i.i.i.i.i.i, ptr %vector.sroa.9.0._0.sroa_idx.i.i, align 8, !alias.scope !180, !noalias !181
  ret void
}

; flags::tuple_shared
; Function Attrs: nounwind
define hidden void @_ZN5flags12tuple_shared17he35bb407718df417E(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([24 x i8]) align 8 dereferenceable(24) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(32) %_1) unnamed_addr #0 {
start:
  %sell = load ptr, ptr %_1, align 8, !nonnull !13, !align !143, !noundef !13
  %0 = getelementptr inbounds i8, ptr %_1, i64 8
  %count = load ptr, ptr %0, align 8, !nonnull !13, !align !144, !noundef !13
  %1 = getelementptr inbounds i8, ptr %_1, i64 16
  %range.0 = load i64, ptr %1, align 8, !noundef !13
  %2 = getelementptr inbounds i8, ptr %_1, i64 24
  %range.1 = load i64, ptr %2, align 8, !noundef !13
  tail call void @llvm.experimental.noalias.scope.decl(metadata !182)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !185)
  %.sink1.i.i.i.i = tail call i64 @llvm.usub.sat.i64(i64 %range.1, i64 %range.0)
  %.not.i.i = icmp ugt i64 %range.1, %range.0
  br i1 %.not.i.i, label %bb4.i.i.i, label %"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17hd25ddd0f323f8f11E.exit"

bb4.i.i.i:                                        ; preds = %start
  %_4.i.i.i.i = icmp sgt i64 %.sink1.i.i.i.i, -1
  br i1 %_4.i.i.i.i, label %bb5.i.i.i.i.i, label %bb7.i.i

bb5.i.i.i.i.i:                                    ; preds = %bb4.i.i.i
  %3 = load i64, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !188, !noundef !13
  %4 = icmp eq i64 %3, 0
  %pos.sroa.0.0.i.i.i.i.i.i.i = select i1 %4, i64 12884934656, i64 %3
  %5 = tail call i64 @llvm.usub.sat.i64(i64 %pos.sroa.0.0.i.i.i.i.i.i.i, i64 %.sink1.i.i.i.i)
  %_15.i.i.i.i.i.i.i = icmp ult i64 %5, 12884901896
  br i1 %_15.i.i.i.i.i.i.i, label %bb7.i.i, label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i"

"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i": ; preds = %bb5.i.i.i.i.i
  store i64 %5, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !188
  %6 = inttoptr i64 %5 to ptr
  br label %bb3.i.i.i.i.i.i.i

bb3.i.i.i.i.i.i.i:                                ; preds = %bb3.i.i.i.i.i.i.i, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i"
  %7 = phi i64 [ %10, %bb3.i.i.i.i.i.i.i ], [ 0, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i" ]
  %self.sroa.0.08.i.i.i.i.i.i.i = phi i64 [ %8, %bb3.i.i.i.i.i.i.i ], [ %range.0, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i" ]
  %8 = add nuw i64 %self.sroa.0.08.i.i.i.i.i.i.i, 1
  %first.i.i.i.i.i.i.i.i.i = icmp eq i64 %self.sroa.0.08.i.i.i.i.i.i.i, 0
  %_7.i.i.i.i.i.i.i.i.i = load i64, ptr %count, align 8, !noalias !193, !noundef !13
  %last.i.i.i.i.i.i.i.i.i = icmp eq i64 %8, %_7.i.i.i.i.i.i.i.i.i
  %9 = load i8, ptr %sell, align 1, !range !156, !noalias !193, !noundef !13
  %_9.not.i.i.i.i.i.i.i.i.i = icmp eq i8 %9, 0
  %first.last.i.i.i.i.i.i.i.i.i = select i1 %_9.not.i.i.i.i.i.i.i.i.i, i1 %first.i.i.i.i.i.i.i.i.i, i1 %last.i.i.i.i.i.i.i.i.i
  %creator.sroa.0.0.in.i.i.i.i.i.i.i.i.i = select i1 %_9.not.i.i.i.i.i.i.i.i.i, i1 %last.i.i.i.i.i.i.i.i.i, i1 %first.i.i.i.i.i.i.i.i.i
  %_12.i.i.i.i.i.i.i.i.i = zext i1 %first.last.i.i.i.i.i.i.i.i.i to i8
  %_14.i.i.i.i.i.i.i.i.i = select i1 %creator.sroa.0.0.in.i.i.i.i.i.i.i.i.i, i8 2, i8 0
  %_0.i.i.i.i.i.i.i.i.i = or disjoint i8 %_14.i.i.i.i.i.i.i.i.i, %_12.i.i.i.i.i.i.i.i.i
  %dst.i.i.i.i.i.i.i.i.i.i = getelementptr inbounds i8, ptr %6, i64 %7
  store i8 %_0.i.i.i.i.i.i.i.i.i, ptr %dst.i.i.i.i.i.i.i.i.i.i, align 1, !noalias !210
  %10 = add i64 %7, 1
  %_0.i.i.i.i.i.i.i.i.i.i = icmp ult i64 %8, %range.1
  br i1 %_0.i.i.i.i.i.i.i.i.i.i, label %bb3.i.i.i.i.i.i.i, label %"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17hd25ddd0f323f8f11E.exit"

bb7.i.i:                                          ; preds = %bb5.i.i.i.i.i, %bb4.i.i.i
  %_15.sroa.4.0.i.i = phi i64 [ 0, %bb4.i.i.i ], [ 1, %bb5.i.i.i.i.i ]
; call alloc::raw_vec::handle_error
  tail call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef %_15.sroa.4.0.i.i, i64 %.sink1.i.i.i.i) #10, !noalias !215
  unreachable

"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17hd25ddd0f323f8f11E.exit": ; preds = %bb3.i.i.i.i.i.i.i, %start
  %vector.sroa.0.027.i.i = phi i64 [ 0, %start ], [ %.sink1.i.i.i.i, %bb3.i.i.i.i.i.i.i ]
  %vector.sroa.5.026.i.i = phi i64 [ 1, %start ], [ %5, %bb3.i.i.i.i.i.i.i ]
  %f.val1.i.i.i.i.i.i.i = phi i64 [ 0, %start ], [ %10, %bb3.i.i.i.i.i.i.i ]
  store i64 %vector.sroa.0.027.i.i, ptr %_0, align 8, !alias.scope !216, !noalias !217
  %vector.sroa.5.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %vector.sroa.5.026.i.i, ptr %vector.sroa.5.0._0.sroa_idx.i.i, align 8, !alias.scope !216, !noalias !217
  %vector.sroa.9.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_0, i64 16
  store i64 %f.val1.i.i.i.i.i.i.i, ptr %vector.sroa.9.0._0.sroa_idx.i.i, align 8, !alias.scope !216, !noalias !217
  ret void
}

; flags::tuple_shared_lastfirst
; Function Attrs: nounwind
define hidden void @_ZN5flags22tuple_shared_lastfirst17haabb7340a0742cc1E(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([24 x i8]) align 8 dereferenceable(24) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(32) %_1) unnamed_addr #0 {
start:
  %sell = load ptr, ptr %_1, align 8, !nonnull !13, !align !143, !noundef !13
  %0 = getelementptr inbounds i8, ptr %_1, i64 8
  %count = load ptr, ptr %0, align 8, !nonnull !13, !align !144, !noundef !13
  %1 = getelementptr inbounds i8, ptr %_1, i64 16
  %range.0 = load i64, ptr %1, align 8, !noundef !13
  %2 = getelementptr inbounds i8, ptr %_1, i64 24
  %range.1 = load i64, ptr %2, align 8, !noundef !13
  tail call void @llvm.experimental.noalias.scope.decl(metadata !218)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !221)
  %.sink1.i.i.i.i = tail call i64 @llvm.usub.sat.i64(i64 %range.1, i64 %range.0)
  %.not.i.i = icmp ugt i64 %range.1, %range.0
  br i1 %.not.i.i, label %bb4.i.i.i, label %"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h5d454d95591b6f71E.exit"

bb4.i.i.i:                                        ; preds = %start
  %_4.i.i.i.i = icmp sgt i64 %.sink1.i.i.i.i, -1
  br i1 %_4.i.i.i.i, label %bb5.i.i.i.i.i, label %bb7.i.i

bb5.i.i.i.i.i:                                    ; preds = %bb4.i.i.i
  %3 = load i64, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !224, !noundef !13
  %4 = icmp eq i64 %3, 0
  %pos.sroa.0.0.i.i.i.i.i.i.i = select i1 %4, i64 12884934656, i64 %3
  %5 = tail call i64 @llvm.usub.sat.i64(i64 %pos.sroa.0.0.i.i.i.i.i.i.i, i64 %.sink1.i.i.i.i)
  %_15.i.i.i.i.i.i.i = icmp ult i64 %5, 12884901896
  br i1 %_15.i.i.i.i.i.i.i, label %bb7.i.i, label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i"

"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i": ; preds = %bb5.i.i.i.i.i
  store i64 %5, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !224
  %6 = inttoptr i64 %5 to ptr
  br label %bb3.i.i.i.i.i.i.i

bb3.i.i.i.i.i.i.i:                                ; preds = %bb3.i.i.i.i.i.i.i, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i"
  %7 = phi i64 [ %10, %bb3.i.i.i.i.i.i.i ], [ 0, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i" ]
  %self.sroa.0.08.i.i.i.i.i.i.i = phi i64 [ %8, %bb3.i.i.i.i.i.i.i ], [ %range.0, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i" ]
  %8 = add nuw i64 %self.sroa.0.08.i.i.i.i.i.i.i, 1
  %_6.i.i.i.i.i.i.i.i.i = load i64, ptr %count, align 8, !noalias !229, !noundef !13
  %last.i.i.i.i.i.i.i.i.i = icmp eq i64 %8, %_6.i.i.i.i.i.i.i.i.i
  %first.i.i.i.i.i.i.i.i.i = icmp eq i64 %self.sroa.0.08.i.i.i.i.i.i.i, 0
  %9 = load i8, ptr %sell, align 1, !range !156, !noalias !229, !noundef !13
  %_9.not.i.i.i.i.i.i.i.i.i = icmp eq i8 %9, 0
  %first.last.i.i.i.i.i.i.i.i.i = select i1 %_9.not.i.i.i.i.i.i.i.i.i, i1 %first.i.i.i.i.i.i.i.i.i, i1 %last.i.i.i.i.i.i.i.i.i
  %creator.sroa.0.0.in.i.i.i.i.i.i.i.i.i = select i1 %_9.not.i.i.i.i.i.i.i.i.i, i1 %last.i.i.i.i.i.i.i.i.i, i1 %first.i.i.i.i.i.i.i.i.i
  %_12.i.i.i.i.i.i.i.i.i = zext i1 %first.last.i.i.i.i.i.i.i.i.i to i8
  %_14.i.i.i.i.i.i.i.i.i = select i1 %creator.sroa.0.0.in.i.i.i.i.i.i.i.i.i, i8 2, i8 0
  %_0.i.i.i.i.i.i.i.i.i = or disjoint i8 %_14.i.i.i.i.i.i.i.i.i, %_12.i.i.i.i.i.i.i.i.i
  %dst.i.i.i.i.i.i.i.i.i.i = getelementptr inbounds i8, ptr %6, i64 %7
  store i8 %_0.i.i.i.i.i.i.i.i.i, ptr %dst.i.i.i.i.i.i.i.i.i.i, align 1, !noalias !246
  %10 = add i64 %7, 1
  %_0.i.i.i.i.i.i.i.i.i.i = icmp ult i64 %8, %range.1
  br i1 %_0.i.i.i.i.i.i.i.i.i.i, label %bb3.i.i.i.i.i.i.i, label %"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h5d454d95591b6f71E.exit"

bb7.i.i:                                          ; preds = %bb5.i.i.i.i.i, %bb4.i.i.i
  %_15.sroa.4.0.i.i = phi i64 [ 0, %bb4.i.i.i ], [ 1, %bb5.i.i.i.i.i ]
; call alloc::raw_vec::handle_error
  tail call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef %_15.sroa.4.0.i.i, i64 %.sink1.i.i.i.i) #10, !noalias !251
  unreachable

"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h5d454d95591b6f71E.exit": ; preds = %bb3.i.i.i.i.i.i.i, %start
  %vector.sroa.0.027.i.i = phi i64 [ 0, %start ], [ %.sink1.i.i.i.i, %bb3.i.i.i.i.i.i.i ]
  %vector.sroa.5.026.i.i = phi i64 [ 1, %start ], [ %5, %bb3.i.i.i.i.i.i.i ]
  %f.val1.i.i.i.i.i.i.i = phi i64 [ 0, %start ], [ %10, %bb3.i.i.i.i.i.i.i ]
  store i64 %vector.sroa.0.027.i.i, ptr %_0, align 8, !alias.scope !252, !noalias !253
  %vector.sroa.5.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %vector.sroa.5.026.i.i, ptr %vector.sroa.5.0._0.sroa_idx.i.i, align 8, !alias.scope !252, !noalias !253
  %vector.sroa.9.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_0, i64 16
  store i64 %f.val1.i.i.i.i.i.i.i, ptr %vector.sroa.9.0._0.sroa_idx.i.i, align 8, !alias.scope !252, !noalias !253
  ret void
}

; flags::tuple_buy
; Function Attrs: nounwind
define hidden void @_ZN5flags9tuple_buy17hfe9ac61c439cb10dE(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([24 x i8]) align 8 dereferenceable(24) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(32) %_1) unnamed_addr #0 {
start:
  %sell = load ptr, ptr %_1, align 8, !nonnull !13, !align !143, !noundef !13
  %0 = getelementptr inbounds i8, ptr %_1, i64 8
  %count = load ptr, ptr %0, align 8, !nonnull !13, !align !144, !noundef !13
  %1 = getelementptr inbounds i8, ptr %_1, i64 16
  %range.0 = load i64, ptr %1, align 8, !noundef !13
  %2 = getelementptr inbounds i8, ptr %_1, i64 24
  %range.1 = load i64, ptr %2, align 8, !noundef !13
  tail call void @llvm.experimental.noalias.scope.decl(metadata !254)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !257)
  %.sink1.i.i.i.i = tail call i64 @llvm.usub.sat.i64(i64 %range.1, i64 %range.0)
  %.not.i.i = icmp ugt i64 %range.1, %range.0
  br i1 %.not.i.i, label %bb4.i.i.i, label %"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h8d614cd7277ed5d6E.exit"

bb4.i.i.i:                                        ; preds = %start
  %_4.i.i.i.i = icmp sgt i64 %.sink1.i.i.i.i, -1
  br i1 %_4.i.i.i.i, label %bb5.i.i.i.i.i, label %bb7.i.i

bb5.i.i.i.i.i:                                    ; preds = %bb4.i.i.i
  %3 = load i64, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !260, !noundef !13
  %4 = icmp eq i64 %3, 0
  %pos.sroa.0.0.i.i.i.i.i.i.i = select i1 %4, i64 12884934656, i64 %3
  %5 = tail call i64 @llvm.usub.sat.i64(i64 %pos.sroa.0.0.i.i.i.i.i.i.i, i64 %.sink1.i.i.i.i)
  %_15.i.i.i.i.i.i.i = icmp ult i64 %5, 12884901896
  br i1 %_15.i.i.i.i.i.i.i, label %bb7.i.i, label %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i"

"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i": ; preds = %bb5.i.i.i.i.i
  store i64 %5, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noalias !260
  %6 = inttoptr i64 %5 to ptr
  br label %bb3.i.i.i.i.i.i.i

bb3.i.i.i.i.i.i.i:                                ; preds = %bb3.i.i.i.i.i.i.i, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i"
  %7 = phi i64 [ %10, %bb3.i.i.i.i.i.i.i ], [ 0, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i" ]
  %self.sroa.0.08.i.i.i.i.i.i.i = phi i64 [ %8, %bb3.i.i.i.i.i.i.i ], [ %range.0, %"_ZN5alloc3vec16Vec$LT$T$C$A$GT$7reserve17h812736e8c5a9885cE.exit.i.i.i.i" ]
  %8 = add nuw i64 %self.sroa.0.08.i.i.i.i.i.i.i, 1
  %first.i.i.i.i.i.i.i.i.i = icmp eq i64 %self.sroa.0.08.i.i.i.i.i.i.i, 0
  %_7.i.i.i.i.i.i.i.i.i = load i64, ptr %count, align 8, !noalias !265, !noundef !13
  %last.i.i.i.i.i.i.i.i.i = icmp eq i64 %8, %_7.i.i.i.i.i.i.i.i.i
  %9 = load i8, ptr %sell, align 1, !range !156, !noalias !265, !noundef !13
  %_9.not.i.i.i.i.i.i.i.i.i = icmp eq i8 %9, 0
  %last.first.i.i.i.i.i.i.i.i.i = select i1 %_9.not.i.i.i.i.i.i.i.i.i, i1 %last.i.i.i.i.i.i.i.i.i, i1 %first.i.i.i.i.i.i.i.i.i
  %creator.sroa.0.0.in.i.i.i.i.i.i.i.i.i = select i1 %_9.not.i.i.i.i.i.i.i.i.i, i1 %first.i.i.i.i.i.i.i.i.i, i1 %last.i.i.i.i.i.i.i.i.i
  %_12.i.i.i.i.i.i.i.i.i = zext i1 %last.first.i.i.i.i.i.i.i.i.i to i8
  %_14.i.i.i.i.i.i.i.i.i = select i1 %creator.sroa.0.0.in.i.i.i.i.i.i.i.i.i, i8 2, i8 0
  %_0.i.i.i.i.i.i.i.i.i = or disjoint i8 %_14.i.i.i.i.i.i.i.i.i, %_12.i.i.i.i.i.i.i.i.i
  %dst.i.i.i.i.i.i.i.i.i.i = getelementptr inbounds i8, ptr %6, i64 %7
  store i8 %_0.i.i.i.i.i.i.i.i.i, ptr %dst.i.i.i.i.i.i.i.i.i.i, align 1, !noalias !282
  %10 = add i64 %7, 1
  %_0.i.i.i.i.i.i.i.i.i.i = icmp ult i64 %8, %range.1
  br i1 %_0.i.i.i.i.i.i.i.i.i.i, label %bb3.i.i.i.i.i.i.i, label %"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h8d614cd7277ed5d6E.exit"

bb7.i.i:                                          ; preds = %bb5.i.i.i.i.i, %bb4.i.i.i
  %_15.sroa.4.0.i.i = phi i64 [ 0, %bb4.i.i.i ], [ 1, %bb5.i.i.i.i.i ]
; call alloc::raw_vec::handle_error
  tail call void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef %_15.sroa.4.0.i.i, i64 %.sink1.i.i.i.i) #10, !noalias !287
  unreachable

"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h8d614cd7277ed5d6E.exit": ; preds = %bb3.i.i.i.i.i.i.i, %start
  %vector.sroa.0.027.i.i = phi i64 [ 0, %start ], [ %.sink1.i.i.i.i, %bb3.i.i.i.i.i.i.i ]
  %vector.sroa.5.026.i.i = phi i64 [ 1, %start ], [ %5, %bb3.i.i.i.i.i.i.i ]
  %f.val1.i.i.i.i.i.i.i = phi i64 [ 0, %start ], [ %10, %bb3.i.i.i.i.i.i.i ]
  store i64 %vector.sroa.0.027.i.i, ptr %_0, align 8, !alias.scope !288, !noalias !289
  %vector.sroa.5.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %vector.sroa.5.026.i.i, ptr %vector.sroa.5.0._0.sroa_idx.i.i, align 8, !alias.scope !288, !noalias !289
  %vector.sroa.9.0._0.sroa_idx.i.i = getelementptr inbounds i8, ptr %_0, i64 16
  store i64 %f.val1.i.i.i.i.i.i.i, ptr %vector.sroa.9.0._0.sroa_idx.i.i, align 8, !alias.scope !288, !noalias !289
  ret void
}

; Function Attrs: mustprogress nofree norecurse nosync nounwind willreturn memory(readwrite, inaccessiblemem: write)
define hidden noundef ptr @__rust_alloc(i64 noundef %size, i64 noundef %align) unnamed_addr #1 {
start:
  %0 = icmp ne i64 %align, 0
  tail call void @llvm.assume(i1 %0)
  %1 = icmp ult i64 %align, -9223372036854775807
  tail call void @llvm.assume(i1 %1)
  %2 = load i64, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noundef !13
  %3 = icmp eq i64 %2, 0
  %pos.sroa.0.0.i = select i1 %3, i64 12884934656, i64 %2
  %4 = tail call i64 @llvm.usub.sat.i64(i64 %pos.sroa.0.0.i, i64 %size)
  %_12.i = sub i64 0, %align
  %5 = and i64 %4, %_12.i
  %_15.i = icmp ult i64 %5, 12884901896
  br i1 %_15.i, label %"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17hf5671b1469f11754E.exit", label %bb7.i

bb7.i:                                            ; preds = %start
  store i64 %5, ptr inttoptr (i64 12884901888 to ptr), align 4294967296
  %6 = inttoptr i64 %5 to ptr
  br label %"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17hf5671b1469f11754E.exit"

"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17hf5671b1469f11754E.exit": ; preds = %start, %bb7.i
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
  %2 = load i64, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noundef !13
  %3 = icmp eq i64 %2, 0
  %pos.sroa.0.0.i.i = select i1 %3, i64 12884934656, i64 %2
  %4 = tail call i64 @llvm.usub.sat.i64(i64 %pos.sroa.0.0.i.i, i64 %new_size)
  %_12.i.i = sub i64 0, %align
  %5 = and i64 %4, %_12.i.i
  %_15.i.i = icmp ult i64 %5, 12884901896
  br i1 %_15.i.i, label %_ZN4core5alloc6global11GlobalAlloc7realloc17h31d7a281ad66c1d2E.exit, label %"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17hf5671b1469f11754E.exit.i"

"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17hf5671b1469f11754E.exit.i": ; preds = %start
  store i64 %5, ptr inttoptr (i64 12884901888 to ptr), align 4294967296
  %6 = inttoptr i64 %5 to ptr
  %_0.sroa.0.0.sroa.speculated.i.i = tail call noundef i64 @llvm.umin.i64(i64 %size, i64 %new_size)
  tail call void @llvm.memcpy.p0.p0.i64(ptr nonnull align 1 %6, ptr align 1 %ptr, i64 %_0.sroa.0.0.sroa.speculated.i.i, i1 false)
  br label %_ZN4core5alloc6global11GlobalAlloc7realloc17h31d7a281ad66c1d2E.exit

_ZN4core5alloc6global11GlobalAlloc7realloc17h31d7a281ad66c1d2E.exit: ; preds = %start, %"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17hf5671b1469f11754E.exit.i"
  %_0.sroa.0.0.i2.i = phi ptr [ %6, %"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17hf5671b1469f11754E.exit.i" ], [ null, %start ]
  ret ptr %_0.sroa.0.0.i2.i
}

; Function Attrs: mustprogress nofree norecurse nosync nounwind willreturn memory(readwrite, inaccessiblemem: write)
define hidden noundef ptr @__rust_alloc_zeroed(i64 noundef %size, i64 noundef %align) unnamed_addr #1 {
start:
  %0 = icmp ne i64 %align, 0
  tail call void @llvm.assume(i1 %0)
  %1 = icmp ult i64 %align, -9223372036854775807
  tail call void @llvm.assume(i1 %1)
  %2 = load i64, ptr inttoptr (i64 12884901888 to ptr), align 4294967296, !noundef !13
  %3 = icmp eq i64 %2, 0
  %pos.sroa.0.0.i.i = select i1 %3, i64 12884934656, i64 %2
  %4 = tail call i64 @llvm.usub.sat.i64(i64 %pos.sroa.0.0.i.i, i64 %size)
  %_12.i.i = sub i64 0, %align
  %5 = and i64 %4, %_12.i.i
  %_15.i.i = icmp ult i64 %5, 12884901896
  br i1 %_15.i.i, label %_ZN4core5alloc6global11GlobalAlloc12alloc_zeroed17hfb50924373d20c61E.exit, label %"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17hf5671b1469f11754E.exit.i"

"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17hf5671b1469f11754E.exit.i": ; preds = %start
  store i64 %5, ptr inttoptr (i64 12884901888 to ptr), align 4294967296
  %6 = inttoptr i64 %5 to ptr
  tail call void @llvm.memset.p0.i64(ptr nonnull align 1 %6, i8 0, i64 %size, i1 false)
  br label %_ZN4core5alloc6global11GlobalAlloc12alloc_zeroed17hfb50924373d20c61E.exit

_ZN4core5alloc6global11GlobalAlloc12alloc_zeroed17hfb50924373d20c61E.exit: ; preds = %start, %"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17hf5671b1469f11754E.exit.i"
  %_0.sroa.0.0.i2.i = phi ptr [ %6, %"_ZN93_$LT$solana_program_entrypoint..BumpAllocator$u20$as$u20$core..alloc..global..GlobalAlloc$GT$5alloc17hf5671b1469f11754E.exit.i" ], [ null, %start ]
  ret ptr %_0.sroa.0.0.i2.i
}

; Function Attrs: mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite)
declare void @llvm.memcpy.p0.p0.i64(ptr noalias nocapture writeonly, ptr noalias nocapture readonly, i64, i1 immarg) #3

; alloc::raw_vec::handle_error
; Function Attrs: cold noreturn nounwind
declare void @_ZN5alloc7raw_vec12handle_error17h22fdf317f3a37641E(i64 noundef, i64) unnamed_addr #4

; Function Attrs: mustprogress nocallback nofree nounwind willreturn memory(argmem: write)
declare void @llvm.memset.p0.i64(ptr nocapture writeonly, i8, i64, i1 immarg) #5

; Function Attrs: mustprogress nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: write)
declare hidden void @llvm.assume(i1 noundef) #6

; Function Attrs: mustprogress nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare hidden i64 @llvm.usub.sat.i64(i64, i64) #7

; Function Attrs: nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: readwrite)
declare void @llvm.experimental.noalias.scope.decl(metadata) #8

; Function Attrs: nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare i64 @llvm.umin.i64(i64, i64) #9

attributes #0 = { nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #1 = { mustprogress nofree norecurse nosync nounwind willreturn memory(readwrite, inaccessiblemem: write) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #2 = { mustprogress nofree norecurse nosync nounwind willreturn memory(none) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #3 = { mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite) }
attributes #4 = { cold noreturn nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #5 = { mustprogress nocallback nofree nounwind willreturn memory(argmem: write) }
attributes #6 = { mustprogress nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: write) }
attributes #7 = { mustprogress nocallback nofree nosync nounwind speculatable willreturn memory(none) }
attributes #8 = { nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: readwrite) }
attributes #9 = { nocallback nofree nosync nounwind speculatable willreturn memory(none) }
attributes #10 = { noreturn nounwind }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 8, !"PIC Level", i32 2}
!1 = !{!"rustc version 1.79.0-dev"}
!2 = !{!3}
!3 = distinct !{!3, !4, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h1423818991c4382bE: %_0"}
!4 = distinct !{!4, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h1423818991c4382bE"}
!5 = !{!6}
!6 = distinct !{!6, !7, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17habe0d8f3917c86e3E: %_0"}
!7 = distinct !{!7, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17habe0d8f3917c86e3E"}
!8 = !{!9, !6, !11, !3, !12}
!9 = distinct !{!9, !10, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h68d14ca99def6e3dE: %_0"}
!10 = distinct !{!10, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h68d14ca99def6e3dE"}
!11 = distinct !{!11, !7, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17habe0d8f3917c86e3E: %iterator"}
!12 = distinct !{!12, !4, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h1423818991c4382bE: %iterator"}
!13 = !{}
!14 = !{!15, !17, !19, !21, !23, !25, !26, !28, !29, !31, !32, !34, !6, !11, !3, !12}
!15 = distinct !{!15, !16, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17hb25ec5f25e327733E: %_1"}
!16 = distinct !{!16, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17hb25ec5f25e327733E"}
!17 = distinct !{!17, !18, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17h2f7e08eafa6e4dcbE: %_1"}
!18 = distinct !{!18, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17h2f7e08eafa6e4dcbE"}
!19 = distinct !{!19, !20, !"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h7a478a3d74ed52a4E: %_1"}
!20 = distinct !{!20, !"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h7a478a3d74ed52a4E"}
!21 = distinct !{!21, !22, !"_ZN4core4iter6traits8iterator8Iterator4fold17h1f63777492d32154E: %f"}
!22 = distinct !{!22, !"_ZN4core4iter6traits8iterator8Iterator4fold17h1f63777492d32154E"}
!23 = distinct !{!23, !24, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h683656f7c6049b02E: %self"}
!24 = distinct !{!24, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h683656f7c6049b02E"}
!25 = distinct !{!25, !24, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h683656f7c6049b02E: %g"}
!26 = distinct !{!26, !27, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h2fa834079c33fcc3E: %self"}
!27 = distinct !{!27, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h2fa834079c33fcc3E"}
!28 = distinct !{!28, !27, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h2fa834079c33fcc3E: %f"}
!29 = distinct !{!29, !30, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h4fd02882dbd2796cE: %self"}
!30 = distinct !{!30, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h4fd02882dbd2796cE"}
!31 = distinct !{!31, !30, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h4fd02882dbd2796cE: %iterator"}
!32 = distinct !{!32, !33, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17h3e34b5cc5928ccccE: %self"}
!33 = distinct !{!33, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17h3e34b5cc5928ccccE"}
!34 = distinct !{!34, !33, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17h3e34b5cc5928ccccE: %iterator"}
!35 = !{!6, !11, !3, !12}
!36 = !{!6, !3}
!37 = !{!11, !12}
!38 = !{!39}
!39 = distinct !{!39, !40, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h4a8b5d49cc04131cE: %_0"}
!40 = distinct !{!40, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h4a8b5d49cc04131cE"}
!41 = !{!42}
!42 = distinct !{!42, !43, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17hc1170d2b0c8e589bE: %_0"}
!43 = distinct !{!43, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17hc1170d2b0c8e589bE"}
!44 = !{!45, !42, !47, !39, !48}
!45 = distinct !{!45, !46, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h68d14ca99def6e3dE: %_0"}
!46 = distinct !{!46, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h68d14ca99def6e3dE"}
!47 = distinct !{!47, !43, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17hc1170d2b0c8e589bE: %iterator"}
!48 = distinct !{!48, !40, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h4a8b5d49cc04131cE: %iterator"}
!49 = !{!50, !52, !54, !56, !58, !60, !61, !63, !64, !66, !67, !69, !42, !47, !39, !48}
!50 = distinct !{!50, !51, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17ha4cd7fea9eed47f1E: %_1"}
!51 = distinct !{!51, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17ha4cd7fea9eed47f1E"}
!52 = distinct !{!52, !53, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17hb675b12a42a1283cE: %_1"}
!53 = distinct !{!53, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17hb675b12a42a1283cE"}
!54 = distinct !{!54, !55, !"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17he564ca5e337e9d16E: %_1"}
!55 = distinct !{!55, !"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17he564ca5e337e9d16E"}
!56 = distinct !{!56, !57, !"_ZN4core4iter6traits8iterator8Iterator4fold17h7a5616ff33b807fdE: %f"}
!57 = distinct !{!57, !"_ZN4core4iter6traits8iterator8Iterator4fold17h7a5616ff33b807fdE"}
!58 = distinct !{!58, !59, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h88b7c71edfc56dbcE: %self"}
!59 = distinct !{!59, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h88b7c71edfc56dbcE"}
!60 = distinct !{!60, !59, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h88b7c71edfc56dbcE: %g"}
!61 = distinct !{!61, !62, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h0bf61de08aac3e7bE: %self"}
!62 = distinct !{!62, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h0bf61de08aac3e7bE"}
!63 = distinct !{!63, !62, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h0bf61de08aac3e7bE: %f"}
!64 = distinct !{!64, !65, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h1a9e37fa0fa386d6E: %self"}
!65 = distinct !{!65, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h1a9e37fa0fa386d6E"}
!66 = distinct !{!66, !65, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h1a9e37fa0fa386d6E: %iterator"}
!67 = distinct !{!67, !68, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17h4ed2c87de538319dE: %self"}
!68 = distinct !{!68, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17h4ed2c87de538319dE"}
!69 = distinct !{!69, !68, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17h4ed2c87de538319dE: %iterator"}
!70 = !{!42, !47, !39, !48}
!71 = !{!42, !39}
!72 = !{!47, !48}
!73 = !{!74}
!74 = distinct !{!74, !75, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17he2201012fc8c3a7bE: %_0"}
!75 = distinct !{!75, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17he2201012fc8c3a7bE"}
!76 = !{!77}
!77 = distinct !{!77, !78, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h480b7870bb13b455E: %_0"}
!78 = distinct !{!78, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h480b7870bb13b455E"}
!79 = !{!80, !77, !82, !74, !83}
!80 = distinct !{!80, !81, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h68d14ca99def6e3dE: %_0"}
!81 = distinct !{!81, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h68d14ca99def6e3dE"}
!82 = distinct !{!82, !78, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h480b7870bb13b455E: %iterator"}
!83 = distinct !{!83, !75, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17he2201012fc8c3a7bE: %iterator"}
!84 = !{!85, !87, !89, !91, !93, !95, !96, !98, !99, !101, !102, !104, !77, !82, !74, !83}
!85 = distinct !{!85, !86, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17h516c440280278860E: %_1"}
!86 = distinct !{!86, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17h516c440280278860E"}
!87 = distinct !{!87, !88, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17hf8b631da94a40ebbE: %_1"}
!88 = distinct !{!88, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17hf8b631da94a40ebbE"}
!89 = distinct !{!89, !90, !"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h3f0ede588ecbed0aE: %_1"}
!90 = distinct !{!90, !"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h3f0ede588ecbed0aE"}
!91 = distinct !{!91, !92, !"_ZN4core4iter6traits8iterator8Iterator4fold17h1892a38c5b8b9977E: %f"}
!92 = distinct !{!92, !"_ZN4core4iter6traits8iterator8Iterator4fold17h1892a38c5b8b9977E"}
!93 = distinct !{!93, !94, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h12eb70a8a04bc530E: %self"}
!94 = distinct !{!94, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h12eb70a8a04bc530E"}
!95 = distinct !{!95, !94, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h12eb70a8a04bc530E: %g"}
!96 = distinct !{!96, !97, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h8f083b54095f9beeE: %self"}
!97 = distinct !{!97, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h8f083b54095f9beeE"}
!98 = distinct !{!98, !97, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h8f083b54095f9beeE: %f"}
!99 = distinct !{!99, !100, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h2ced92369eac1f65E: %self"}
!100 = distinct !{!100, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h2ced92369eac1f65E"}
!101 = distinct !{!101, !100, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h2ced92369eac1f65E: %iterator"}
!102 = distinct !{!102, !103, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17h3b8122add4b2259cE: %self"}
!103 = distinct !{!103, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17h3b8122add4b2259cE"}
!104 = distinct !{!104, !103, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17h3b8122add4b2259cE: %iterator"}
!105 = !{!77, !82, !74, !83}
!106 = !{!77, !74}
!107 = !{!82, !83}
!108 = !{!109}
!109 = distinct !{!109, !110, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h6d6a45ef5b16952eE: %_0"}
!110 = distinct !{!110, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h6d6a45ef5b16952eE"}
!111 = !{!112}
!112 = distinct !{!112, !113, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h3bde6ae4c774d1edE: %_0"}
!113 = distinct !{!113, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h3bde6ae4c774d1edE"}
!114 = !{!115, !112, !117, !109, !118}
!115 = distinct !{!115, !116, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h68d14ca99def6e3dE: %_0"}
!116 = distinct !{!116, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h68d14ca99def6e3dE"}
!117 = distinct !{!117, !113, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h3bde6ae4c774d1edE: %iterator"}
!118 = distinct !{!118, !110, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h6d6a45ef5b16952eE: %iterator"}
!119 = !{!120, !122, !124, !126, !128, !130, !131, !133, !134, !136, !137, !139, !112, !117, !109, !118}
!120 = distinct !{!120, !121, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17h8362b5090294ecceE: %_1"}
!121 = distinct !{!121, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17h8362b5090294ecceE"}
!122 = distinct !{!122, !123, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17hd04a8394c2c0613bE: %_1"}
!123 = distinct !{!123, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17hd04a8394c2c0613bE"}
!124 = distinct !{!124, !125, !"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h353c7d109daaec6aE: %_1"}
!125 = distinct !{!125, !"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h353c7d109daaec6aE"}
!126 = distinct !{!126, !127, !"_ZN4core4iter6traits8iterator8Iterator4fold17h92bd3fe72163f660E: %f"}
!127 = distinct !{!127, !"_ZN4core4iter6traits8iterator8Iterator4fold17h92bd3fe72163f660E"}
!128 = distinct !{!128, !129, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h544b640e0464c543E: %self"}
!129 = distinct !{!129, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h544b640e0464c543E"}
!130 = distinct !{!130, !129, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h544b640e0464c543E: %g"}
!131 = distinct !{!131, !132, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h9db03eb2dd2b3115E: %self"}
!132 = distinct !{!132, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h9db03eb2dd2b3115E"}
!133 = distinct !{!133, !132, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h9db03eb2dd2b3115E: %f"}
!134 = distinct !{!134, !135, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h42b514ad174dcab0E: %self"}
!135 = distinct !{!135, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h42b514ad174dcab0E"}
!136 = distinct !{!136, !135, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h42b514ad174dcab0E: %iterator"}
!137 = distinct !{!137, !138, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17hd7513c6e06e27e1bE: %self"}
!138 = distinct !{!138, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17hd7513c6e06e27e1bE"}
!139 = distinct !{!139, !138, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17hd7513c6e06e27e1bE: %iterator"}
!140 = !{!112, !117, !109, !118}
!141 = !{!112, !109}
!142 = !{!117, !118}
!143 = !{i64 1}
!144 = !{i64 8}
!145 = !{!146}
!146 = distinct !{!146, !147, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h9be1ad1936ce01a7E: %_0"}
!147 = distinct !{!147, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h9be1ad1936ce01a7E"}
!148 = !{!149}
!149 = distinct !{!149, !150, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17hdba1b929347eda03E: %_0"}
!150 = distinct !{!150, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17hdba1b929347eda03E"}
!151 = !{!152, !149, !154, !146, !155}
!152 = distinct !{!152, !153, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h68d14ca99def6e3dE: %_0"}
!153 = distinct !{!153, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h68d14ca99def6e3dE"}
!154 = distinct !{!154, !150, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17hdba1b929347eda03E: %iterator"}
!155 = distinct !{!155, !147, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h9be1ad1936ce01a7E: %iterator"}
!156 = !{i8 0, i8 2}
!157 = !{!158, !160, !162, !164, !165, !167, !168, !170, !171, !173, !149, !154, !146, !155}
!158 = distinct !{!158, !159, !"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h3e12586d5f588a40E: %_1"}
!159 = distinct !{!159, !"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h3e12586d5f588a40E"}
!160 = distinct !{!160, !161, !"_ZN4core4iter6traits8iterator8Iterator4fold17h6ef745dacd1d87acE: %f"}
!161 = distinct !{!161, !"_ZN4core4iter6traits8iterator8Iterator4fold17h6ef745dacd1d87acE"}
!162 = distinct !{!162, !163, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h958b512ebc707a2cE: %self"}
!163 = distinct !{!163, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h958b512ebc707a2cE"}
!164 = distinct !{!164, !163, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h958b512ebc707a2cE: %g"}
!165 = distinct !{!165, !166, !"_ZN4core4iter6traits8iterator8Iterator8for_each17hbd35ab7a15d94c4eE: %self"}
!166 = distinct !{!166, !"_ZN4core4iter6traits8iterator8Iterator8for_each17hbd35ab7a15d94c4eE"}
!167 = distinct !{!167, !166, !"_ZN4core4iter6traits8iterator8Iterator8for_each17hbd35ab7a15d94c4eE: %f"}
!168 = distinct !{!168, !169, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17hf8b8895404964a44E: %self"}
!169 = distinct !{!169, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17hf8b8895404964a44E"}
!170 = distinct !{!170, !169, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17hf8b8895404964a44E: %iterator"}
!171 = distinct !{!171, !172, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17hbfd151e2bd6c4632E: %self"}
!172 = distinct !{!172, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17hbfd151e2bd6c4632E"}
!173 = distinct !{!173, !172, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17hbfd151e2bd6c4632E: %iterator"}
!174 = !{!175, !177, !158, !160, !162, !164, !165, !167, !168, !170, !171, !173, !149, !154, !146, !155}
!175 = distinct !{!175, !176, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17hb1e26d8d99ca20a9E: %_1"}
!176 = distinct !{!176, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17hb1e26d8d99ca20a9E"}
!177 = distinct !{!177, !178, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17ha26f26def163376bE: %_1"}
!178 = distinct !{!178, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17ha26f26def163376bE"}
!179 = !{!149, !154, !146, !155}
!180 = !{!149, !146}
!181 = !{!154, !155}
!182 = !{!183}
!183 = distinct !{!183, !184, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17hd25ddd0f323f8f11E: %_0"}
!184 = distinct !{!184, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17hd25ddd0f323f8f11E"}
!185 = !{!186}
!186 = distinct !{!186, !187, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h44cb83ee8d01389fE: %_0"}
!187 = distinct !{!187, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h44cb83ee8d01389fE"}
!188 = !{!189, !186, !191, !183, !192}
!189 = distinct !{!189, !190, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h68d14ca99def6e3dE: %_0"}
!190 = distinct !{!190, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h68d14ca99def6e3dE"}
!191 = distinct !{!191, !187, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h44cb83ee8d01389fE: %iterator"}
!192 = distinct !{!192, !184, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17hd25ddd0f323f8f11E: %iterator"}
!193 = !{!194, !196, !198, !200, !201, !203, !204, !206, !207, !209, !186, !191, !183, !192}
!194 = distinct !{!194, !195, !"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h3ba98504b5274916E: %_1"}
!195 = distinct !{!195, !"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h3ba98504b5274916E"}
!196 = distinct !{!196, !197, !"_ZN4core4iter6traits8iterator8Iterator4fold17h6c7a5828e8df9984E: %f"}
!197 = distinct !{!197, !"_ZN4core4iter6traits8iterator8Iterator4fold17h6c7a5828e8df9984E"}
!198 = distinct !{!198, !199, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h718ec90de88e79bdE: %self"}
!199 = distinct !{!199, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h718ec90de88e79bdE"}
!200 = distinct !{!200, !199, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h718ec90de88e79bdE: %g"}
!201 = distinct !{!201, !202, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h4b822713f759ee86E: %self"}
!202 = distinct !{!202, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h4b822713f759ee86E"}
!203 = distinct !{!203, !202, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h4b822713f759ee86E: %f"}
!204 = distinct !{!204, !205, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17hfd6798cd786c6a93E: %self"}
!205 = distinct !{!205, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17hfd6798cd786c6a93E"}
!206 = distinct !{!206, !205, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17hfd6798cd786c6a93E: %iterator"}
!207 = distinct !{!207, !208, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17hc0f0ac05e99bed77E: %self"}
!208 = distinct !{!208, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17hc0f0ac05e99bed77E"}
!209 = distinct !{!209, !208, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17hc0f0ac05e99bed77E: %iterator"}
!210 = !{!211, !213, !194, !196, !198, !200, !201, !203, !204, !206, !207, !209, !186, !191, !183, !192}
!211 = distinct !{!211, !212, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17h253524f2a7118e0dE: %_1"}
!212 = distinct !{!212, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17h253524f2a7118e0dE"}
!213 = distinct !{!213, !214, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17hffb6524cecc7e77dE: %_1"}
!214 = distinct !{!214, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17hffb6524cecc7e77dE"}
!215 = !{!186, !191, !183, !192}
!216 = !{!186, !183}
!217 = !{!191, !192}
!218 = !{!219}
!219 = distinct !{!219, !220, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h5d454d95591b6f71E: %_0"}
!220 = distinct !{!220, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h5d454d95591b6f71E"}
!221 = !{!222}
!222 = distinct !{!222, !223, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h2aa3eb1b0fe73b83E: %_0"}
!223 = distinct !{!223, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h2aa3eb1b0fe73b83E"}
!224 = !{!225, !222, !227, !219, !228}
!225 = distinct !{!225, !226, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h68d14ca99def6e3dE: %_0"}
!226 = distinct !{!226, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h68d14ca99def6e3dE"}
!227 = distinct !{!227, !223, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17h2aa3eb1b0fe73b83E: %iterator"}
!228 = distinct !{!228, !220, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h5d454d95591b6f71E: %iterator"}
!229 = !{!230, !232, !234, !236, !237, !239, !240, !242, !243, !245, !222, !227, !219, !228}
!230 = distinct !{!230, !231, !"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h3589ef1d78f9bd67E: %_1"}
!231 = distinct !{!231, !"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h3589ef1d78f9bd67E"}
!232 = distinct !{!232, !233, !"_ZN4core4iter6traits8iterator8Iterator4fold17ha588aea1e24533efE: %f"}
!233 = distinct !{!233, !"_ZN4core4iter6traits8iterator8Iterator4fold17ha588aea1e24533efE"}
!234 = distinct !{!234, !235, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h41bd7bbce4256f83E: %self"}
!235 = distinct !{!235, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h41bd7bbce4256f83E"}
!236 = distinct !{!236, !235, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h41bd7bbce4256f83E: %g"}
!237 = distinct !{!237, !238, !"_ZN4core4iter6traits8iterator8Iterator8for_each17hb0be9f56a6bcacc5E: %self"}
!238 = distinct !{!238, !"_ZN4core4iter6traits8iterator8Iterator8for_each17hb0be9f56a6bcacc5E"}
!239 = distinct !{!239, !238, !"_ZN4core4iter6traits8iterator8Iterator8for_each17hb0be9f56a6bcacc5E: %f"}
!240 = distinct !{!240, !241, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h9f7b05ae453bb64fE: %self"}
!241 = distinct !{!241, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h9f7b05ae453bb64fE"}
!242 = distinct !{!242, !241, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h9f7b05ae453bb64fE: %iterator"}
!243 = distinct !{!243, !244, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17hda91e61113dccbebE: %self"}
!244 = distinct !{!244, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17hda91e61113dccbebE"}
!245 = distinct !{!245, !244, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17hda91e61113dccbebE: %iterator"}
!246 = !{!247, !249, !230, !232, !234, !236, !237, !239, !240, !242, !243, !245, !222, !227, !219, !228}
!247 = distinct !{!247, !248, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17h2de66512f7525f0cE: %_1"}
!248 = distinct !{!248, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17h2de66512f7525f0cE"}
!249 = distinct !{!249, !250, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17h74218933284eda47E: %_1"}
!250 = distinct !{!250, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17h74218933284eda47E"}
!251 = !{!222, !227, !219, !228}
!252 = !{!222, !219}
!253 = !{!227, !228}
!254 = !{!255}
!255 = distinct !{!255, !256, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h8d614cd7277ed5d6E: %_0"}
!256 = distinct !{!256, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h8d614cd7277ed5d6E"}
!257 = !{!258}
!258 = distinct !{!258, !259, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17he93ae474d0b13b93E: %_0"}
!259 = distinct !{!259, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17he93ae474d0b13b93E"}
!260 = !{!261, !258, !263, !255, !264}
!261 = distinct !{!261, !262, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h68d14ca99def6e3dE: %_0"}
!262 = distinct !{!262, !"_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15try_allocate_in17h68d14ca99def6e3dE"}
!263 = distinct !{!263, !259, !"_ZN111_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter_nested..SpecFromIterNested$LT$T$C$I$GT$$GT$9from_iter17he93ae474d0b13b93E: %iterator"}
!264 = distinct !{!264, !256, !"_ZN98_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$alloc..vec..spec_from_iter..SpecFromIter$LT$T$C$I$GT$$GT$9from_iter17h8d614cd7277ed5d6E: %iterator"}
!265 = !{!266, !268, !270, !272, !273, !275, !276, !278, !279, !281, !258, !263, !255, !264}
!266 = distinct !{!266, !267, !"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h6b919ebdd3f3e54bE: %_1"}
!267 = distinct !{!267, !"_ZN4core4iter8adapters3map8map_fold28_$u7b$$u7b$closure$u7d$$u7d$17h6b919ebdd3f3e54bE"}
!268 = distinct !{!268, !269, !"_ZN4core4iter6traits8iterator8Iterator4fold17h81bf3b0e97ab5e75E: %f"}
!269 = distinct !{!269, !"_ZN4core4iter6traits8iterator8Iterator4fold17h81bf3b0e97ab5e75E"}
!270 = distinct !{!270, !271, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h2d4e966d2bad1da0E: %self"}
!271 = distinct !{!271, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h2d4e966d2bad1da0E"}
!272 = distinct !{!272, !271, !"_ZN102_$LT$core..iter..adapters..map..Map$LT$I$C$F$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4fold17h2d4e966d2bad1da0E: %g"}
!273 = distinct !{!273, !274, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h02b99e4248154c13E: %self"}
!274 = distinct !{!274, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h02b99e4248154c13E"}
!275 = distinct !{!275, !274, !"_ZN4core4iter6traits8iterator8Iterator8for_each17h02b99e4248154c13E: %f"}
!276 = distinct !{!276, !277, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h3124b456cab84690E: %self"}
!277 = distinct !{!277, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h3124b456cab84690E"}
!278 = distinct !{!278, !277, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted17h3124b456cab84690E: %iterator"}
!279 = distinct !{!279, !280, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17h7be59d87e4b14dd5E: %self"}
!280 = distinct !{!280, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17h7be59d87e4b14dd5E"}
!281 = distinct !{!281, !280, !"_ZN97_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$alloc..vec..spec_extend..SpecExtend$LT$T$C$I$GT$$GT$11spec_extend17h7be59d87e4b14dd5E: %iterator"}
!282 = !{!283, !285, !266, !268, !270, !272, !273, !275, !276, !278, !279, !281, !258, !263, !255, !264}
!283 = distinct !{!283, !284, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17h99c6aa4afcb36b1dE: %_1"}
!284 = distinct !{!284, !"_ZN5alloc3vec16Vec$LT$T$C$A$GT$14extend_trusted28_$u7b$$u7b$closure$u7d$$u7d$17h99c6aa4afcb36b1dE"}
!285 = distinct !{!285, !286, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17h0a1c25c36e67b06bE: %_1"}
!286 = distinct !{!286, !"_ZN4core4iter6traits8iterator8Iterator8for_each4call28_$u7b$$u7b$closure$u7d$$u7d$17h0a1c25c36e67b06bE"}
!287 = !{!258, !263, !255, !264}
!288 = !{!258, !255}
!289 = !{!263, !264}
