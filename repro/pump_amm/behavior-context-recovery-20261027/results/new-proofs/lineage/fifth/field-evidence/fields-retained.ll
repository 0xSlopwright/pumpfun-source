; ModuleID = 'fields.50899e723ebe221-cgu.0'
source_filename = "fields.50899e723ebe221-cgu.0"
target datalayout = "e-m:e-p:64:64-i64:64-n32:64-S128"
target triple = "sbf"

; fields::base
; Function Attrs: mustprogress nofree norecurse nosync nounwind willreturn memory(readwrite, inaccessiblemem: none)
define hidden void @_ZN6fields4base17h92f3def5afce6fc1E(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([32 x i8]) align 1 dereferenceable(32) %_0, ptr nocapture noundef readonly %raw) unnamed_addr #0 {
start:
  %_3 = load ptr, ptr %raw, align 8, !nonnull !2, !align !3, !noundef !2
  %0 = getelementptr inbounds i8, ptr %_3, i64 40
  tail call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_0, ptr noundef nonnull align 8 dereferenceable(32) %0, i64 32, i1 false)
  ret void
}

; fields::creator
; Function Attrs: mustprogress nofree norecurse nosync nounwind willreturn memory(readwrite, inaccessiblemem: none)
define hidden void @_ZN6fields7creator17h4e21dfe4fa0dce1cE(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([32 x i8]) align 1 dereferenceable(32) %_0, ptr nocapture noundef readonly %raw) unnamed_addr #0 {
start:
  %0 = getelementptr inbounds i8, ptr %raw, i64 16
  %_3 = load ptr, ptr %0, align 8, !nonnull !2, !align !3, !noundef !2
  %_4 = load ptr, ptr %_3, align 8, !nonnull !2, !align !4, !noundef !2
  tail call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 1 dereferenceable(32) %_0, ptr noundef nonnull align 1 dereferenceable(32) %_4, i64 32, i1 false)
  ret void
}

; fields::virtual_quote
; Function Attrs: mustprogress nofree norecurse nosync nounwind willreturn memory(read, inaccessiblemem: none)
define hidden noundef i128 @_ZN6fields13virtual_quote17hcd1982207f47b70dE(ptr nocapture noundef readonly %raw) unnamed_addr #1 {
start:
  %_3 = load ptr, ptr %raw, align 8, !nonnull !2, !align !3, !noundef !2
  %0 = getelementptr inbounds i8, ptr %_3, i64 232
  %_0 = load i128, ptr %0, align 8, !noundef !2
  ret i128 %_0
}

; Function Attrs: mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite)
declare void @llvm.memcpy.p0.p0.i64(ptr noalias nocapture writeonly, ptr noalias nocapture readonly, i64, i1 immarg) #2

attributes #0 = { mustprogress nofree norecurse nosync nounwind willreturn memory(readwrite, inaccessiblemem: none) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #1 = { mustprogress nofree norecurse nosync nounwind willreturn memory(read, inaccessiblemem: none) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #2 = { mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite) }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 8, !"PIC Level", i32 2}
!1 = !{!"rustc version 1.79.0-dev"}
!2 = !{}
!3 = !{i64 8}
!4 = !{i64 1}
