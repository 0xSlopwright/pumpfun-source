; ModuleID = 'instantiated_private.c316d9953728b856-cgu.0'
source_filename = "instantiated_private.c316d9953728b856-cgu.0"
target datalayout = "e-m:e-p:64:64-i64:64-n32:64-S128"
target triple = "sbf"

; instantiated_private::instantiated
; Function Attrs: mustprogress nofree norecurse nosync nounwind willreturn memory(none)
define hidden noundef i64 @_ZN20instantiated_private12instantiated17h14484b0f3c840a09E(i64 noundef %value, i8 noundef %bump) unnamed_addr #0 {
start:
  %_9 = shl i64 %value, 1
  %_11 = zext i8 %bump to i64
  %_0 = add i64 %_9, %_11
  ret i64 %_0
}

attributes #0 = { mustprogress nofree norecurse nosync nounwind willreturn memory(none) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 8, !"PIC Level", i32 2}
!1 = !{!"rustc version 1.79.0-dev"}
