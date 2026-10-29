; ModuleID = 'fee_gate_model.241e622fe8257979-cgu.0'
source_filename = "fee_gate_model.241e622fe8257979-cgu.0"
target datalayout = "e-m:e-p:64:64-i64:64-n32:64-S128"
target triple = "sbf"

; core::clone::Clone::clone_from
; Function Attrs: inlinehint mustprogress nofree norecurse nosync nounwind willreturn memory(argmem: readwrite)
define hidden void @_ZN4core5clone5Clone10clone_from17he2cd371f05f2a874E(ptr noalias nocapture noundef writeonly align 1 dereferenceable(3) %self, ptr noalias nocapture noundef readonly align 1 dereferenceable(3) %source) unnamed_addr #0 {
start:
  %_0.sroa.0.0.copyload.i = load i24, ptr %source, align 1, !alias.scope !2
  store i24 %_0.sroa.0.0.copyload.i, ptr %self, align 1
  ret void
}

; core::clone::Clone::clone_from
; Function Attrs: inlinehint mustprogress nofree norecurse nosync nounwind willreturn memory(argmem: readwrite)
define hidden void @_ZN4core5clone5Clone10clone_from17hea59246dd457c7e3E(ptr noalias nocapture noundef writeonly align 8 dereferenceable(48) %self, ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %source) unnamed_addr #0 {
start:
  tail call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %self, ptr noundef nonnull align 8 dereferenceable(48) %source, i64 48, i1 false)
  ret void
}

; fee_gate_model::apply_masks
; Function Attrs: mustprogress nofree norecurse nosync nounwind willreturn memory(argmem: readwrite)
define hidden void @_ZN14fee_gate_model11apply_masks17h4dc4eb07eb59967aE(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([48 x i8]) align 8 dereferenceable(48) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %fees, ptr noalias nocapture noundef readonly align 1 dereferenceable(3) %gates) unnamed_addr #1 {
start:
  %0 = getelementptr inbounds i8, ptr %gates, i64 1
  %1 = load i8, ptr %0, align 1, !range !5, !noundef !6
  %_4 = zext nneg i8 %1 to i64
  %creator_mask = sub nsw i64 0, %_4
  %2 = getelementptr inbounds i8, ptr %gates, i64 2
  %3 = load i8, ptr %2, align 1, !range !5, !noundef !6
  %_7 = zext nneg i8 %3 to i64
  %lp_mask = sub nsw i64 0, %_7
  %4 = load i8, ptr %gates, align 1, !range !5, !noundef !6
  %_10 = zext nneg i8 %4 to i64
  %protocol_mask = sub nsw i64 0, %_10
  %_13 = load i64, ptr %fees, align 8, !noundef !6
  %_12 = and i64 %_13, %lp_mask
  %5 = getelementptr inbounds i8, ptr %fees, i64 8
  %_15 = load i64, ptr %5, align 8, !noundef !6
  %_14 = and i64 %_15, %protocol_mask
  %6 = getelementptr inbounds i8, ptr %fees, i64 16
  %_17 = load i64, ptr %6, align 8, !noundef !6
  %_16 = and i64 %_17, %creator_mask
  %7 = getelementptr inbounds i8, ptr %fees, i64 24
  %_19 = load i64, ptr %7, align 8, !noundef !6
  %_18 = and i64 %_19, %lp_mask
  %8 = getelementptr inbounds i8, ptr %fees, i64 32
  %_21 = load i64, ptr %8, align 8, !noundef !6
  %_20 = and i64 %_21, %protocol_mask
  %9 = getelementptr inbounds i8, ptr %fees, i64 40
  %_23 = load i64, ptr %9, align 8, !noundef !6
  %_22 = and i64 %_23, %creator_mask
  store i64 %_12, ptr %_0, align 8
  %10 = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %_14, ptr %10, align 8
  %11 = getelementptr inbounds i8, ptr %_0, i64 16
  store i64 %_16, ptr %11, align 8
  %12 = getelementptr inbounds i8, ptr %_0, i64 24
  store i64 %_18, ptr %12, align 8
  %13 = getelementptr inbounds i8, ptr %_0, i64 32
  store i64 %_20, ptr %13, align 8
  %14 = getelementptr inbounds i8, ptr %_0, i64 40
  store i64 %_22, ptr %14, align 8
  ret void
}

; fee_gate_model::paired_conditions
; Function Attrs: mustprogress nofree norecurse nosync nounwind willreturn memory(argmem: readwrite)
define hidden void @_ZN14fee_gate_model17paired_conditions17h648133af1c4cbe71E(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([48 x i8]) align 8 dereferenceable(48) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %fees, ptr noalias nocapture noundef readonly align 1 dereferenceable(3) %gates) unnamed_addr #1 {
start:
  %0 = getelementptr inbounds i8, ptr %gates, i64 1
  %1 = load i8, ptr %0, align 1, !range !5, !noundef !6
  %_5.not = icmp eq i8 %1, 0
  %2 = getelementptr inbounds i8, ptr %fees, i64 16
  %_6 = load i64, ptr %2, align 8
  %3 = getelementptr inbounds i8, ptr %fees, i64 40
  %_7 = load i64, ptr %3, align 8
  %_19.sroa.0.0 = select i1 %_5.not, i64 0, i64 %_7
  %_18.sroa.0.0 = select i1 %_5.not, i64 0, i64 %_6
  %4 = getelementptr inbounds i8, ptr %gates, i64 2
  %5 = load i8, ptr %4, align 1, !range !5, !noundef !6
  %_10.not = icmp eq i8 %5, 0
  %_11 = load i64, ptr %fees, align 8
  %6 = getelementptr inbounds i8, ptr %fees, i64 24
  %_12 = load i64, ptr %6, align 8
  %_21.sroa.0.0 = select i1 %_10.not, i64 0, i64 %_12
  %_20.sroa.0.0 = select i1 %_10.not, i64 0, i64 %_11
  %7 = load i8, ptr %gates, align 1, !range !5, !noundef !6
  %_15.not = icmp eq i8 %7, 0
  %8 = getelementptr inbounds i8, ptr %fees, i64 8
  %_16 = load i64, ptr %8, align 8
  %9 = getelementptr inbounds i8, ptr %fees, i64 32
  %_17 = load i64, ptr %9, align 8
  %_23.sroa.0.0 = select i1 %_15.not, i64 0, i64 %_17
  %_22.sroa.0.0 = select i1 %_15.not, i64 0, i64 %_16
  store i64 %_20.sroa.0.0, ptr %_0, align 8
  %10 = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %_22.sroa.0.0, ptr %10, align 8
  %11 = getelementptr inbounds i8, ptr %_0, i64 16
  store i64 %_18.sroa.0.0, ptr %11, align 8
  %12 = getelementptr inbounds i8, ptr %_0, i64 24
  store i64 %_21.sroa.0.0, ptr %12, align 8
  %13 = getelementptr inbounds i8, ptr %_0, i64 32
  store i64 %_23.sroa.0.0, ptr %13, align 8
  %14 = getelementptr inbounds i8, ptr %_0, i64 40
  store i64 %_19.sroa.0.0, ptr %14, align 8
  ret void
}

; <fee_gate_model::Fees as core::clone::Clone>::clone
; Function Attrs: inlinehint mustprogress nofree norecurse nosync nounwind willreturn memory(argmem: readwrite)
define hidden void @"_ZN59_$LT$fee_gate_model..Fees$u20$as$u20$core..clone..Clone$GT$5clone17h74b6cf78de409601E"(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([48 x i8]) align 8 dereferenceable(48) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(48) %self) unnamed_addr #0 {
start:
  tail call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %_0, ptr noundef nonnull align 8 dereferenceable(48) %self, i64 48, i1 false)
  ret void
}

; <fee_gate_model::Gates as core::clone::Clone>::clone
; Function Attrs: inlinehint mustprogress nofree norecurse nosync nounwind willreturn memory(argmem: read)
define hidden i24 @"_ZN60_$LT$fee_gate_model..Gates$u20$as$u20$core..clone..Clone$GT$5clone17hb00c3e8cf18f01b4E"(ptr noalias nocapture noundef readonly align 1 dereferenceable(3) %self) unnamed_addr #2 {
start:
  %_0.sroa.0.0.copyload = load i24, ptr %self, align 1
  ret i24 %_0.sroa.0.0.copyload
}

; Function Attrs: mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite)
declare void @llvm.memcpy.p0.p0.i64(ptr noalias nocapture writeonly, ptr noalias nocapture readonly, i64, i1 immarg) #3

attributes #0 = { inlinehint mustprogress nofree norecurse nosync nounwind willreturn memory(argmem: readwrite) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #1 = { mustprogress nofree norecurse nosync nounwind willreturn memory(argmem: readwrite) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #2 = { inlinehint mustprogress nofree norecurse nosync nounwind willreturn memory(argmem: read) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #3 = { mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite) }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 8, !"PIC Level", i32 2}
!1 = !{!"rustc version 1.79.0-dev"}
!2 = !{!3}
!3 = distinct !{!3, !4, !"_ZN60_$LT$fee_gate_model..Gates$u20$as$u20$core..clone..Clone$GT$5clone17hb00c3e8cf18f01b4E: %self"}
!4 = distinct !{!4, !"_ZN60_$LT$fee_gate_model..Gates$u20$as$u20$core..clone..Clone$GT$5clone17hb00c3e8cf18f01b4E"}
!5 = !{i8 0, i8 2}
!6 = !{}
