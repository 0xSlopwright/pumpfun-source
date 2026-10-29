; ModuleID = 'public.ab89800727f5bfe5-cgu.0'
source_filename = "public.ab89800727f5bfe5-cgu.0"
target datalayout = "e-m:e-p:64:64-i64:64-n32:64-S128"
target triple = "sbf"

; public::instructions::sweep_fees::handler
; Function Attrs: mustprogress nofree noinline norecurse nosync nounwind willreturn memory(read, inaccessiblemem: none)
define hidden noundef i64 @_ZN6public12instructions10sweep_fees7handler17h0df7d494bfb6afaeE(ptr noalias nocapture noundef readonly align 8 dereferenceable(40) %ctx, i64 noundef %amount) unnamed_addr #0 {
start:
  %0 = getelementptr inbounds i8, ptr %ctx, i64 8
  %_7 = load ptr, ptr %0, align 8, !nonnull !2, !align !3, !noundef !2
  %_4 = load i64, ptr %_7, align 8, !noundef !2
  %_3 = add i64 %_4, %amount
  %1 = getelementptr inbounds i8, ptr %ctx, i64 33
  %_6 = load i8, ptr %1, align 1, !noundef !2
  %_5 = zext i8 %_6 to i64
  %_0 = add i64 %_3, %_5
  ret i64 %_0
}

; public::call
; Function Attrs: mustprogress nofree norecurse nosync nounwind willreturn memory(read, inaccessiblemem: none)
define hidden noundef i64 @_ZN6public4call17h18636d9cc4c1c2ceE(ptr noalias nocapture noundef readonly align 8 dereferenceable(40) %ctx, i64 noundef %amount) unnamed_addr #1 {
start:
; call public::instructions::sweep_fees::handler
  %_0 = tail call noundef i64 @_ZN6public12instructions10sweep_fees7handler17h0df7d494bfb6afaeE(ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(40) %ctx, i64 noundef %amount) #2
  ret i64 %_0
}

attributes #0 = { mustprogress nofree noinline norecurse nosync nounwind willreturn memory(read, inaccessiblemem: none) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #1 = { mustprogress nofree norecurse nosync nounwind willreturn memory(read, inaccessiblemem: none) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #2 = { nounwind }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 8, !"PIC Level", i32 2}
!1 = !{!"rustc version 1.79.0-dev"}
!2 = !{}
!3 = !{i64 8}
