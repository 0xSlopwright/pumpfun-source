; ModuleID = 'private.479e785d1050cde-cgu.0'
source_filename = "private.479e785d1050cde-cgu.0"
target datalayout = "e-m:e-p:64:64-i64:64-n32:64-S128"
target triple = "sbf"

; private::instructions::trade_v2::handler
; Function Attrs: mustprogress nofree noinline norecurse nosync nounwind willreturn memory(argmem: read, inaccessiblemem: write)
define internal fastcc noundef i64 @_ZN7private12instructions8trade_v27handler17h32946a356dfbe8c9E(ptr readonly %ctx.8.val, i8 %ctx.33.val, i64 noundef %amount) unnamed_addr #0 {
start:
  %0 = icmp ne ptr %ctx.8.val, null
  tail call void @llvm.assume(i1 %0)
  %_4 = load i64, ptr %ctx.8.val, align 8, !noundef !2
  %_5 = zext i8 %ctx.33.val to i64
  %_3 = add i64 %_5, %amount
  %_0 = add i64 %_3, %_4
  ret i64 %_0
}

; private::call
; Function Attrs: mustprogress nofree norecurse nosync nounwind willreturn memory(read, inaccessiblemem: none)
define hidden noundef i64 @_ZN7private4call17hdaf1ab402b8fea6dE(ptr noalias nocapture noundef readonly align 8 dereferenceable(40) %ctx, i64 noundef %amount) unnamed_addr #1 {
start:
  %0 = getelementptr inbounds i8, ptr %ctx, i64 8
  %ctx.val = load ptr, ptr %0, align 8, !nonnull !2, !align !3, !noundef !2
  %1 = getelementptr inbounds i8, ptr %ctx, i64 33
  %ctx.val1 = load i8, ptr %1, align 1, !noundef !2
; call private::instructions::trade_v2::handler
  %_0 = tail call fastcc noundef i64 @_ZN7private12instructions8trade_v27handler17h32946a356dfbe8c9E(ptr nonnull %ctx.val, i8 %ctx.val1, i64 noundef %amount) #3
  ret i64 %_0
}

; Function Attrs: nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: write)
declare void @llvm.assume(i1 noundef) #2

attributes #0 = { mustprogress nofree noinline norecurse nosync nounwind willreturn memory(argmem: read, inaccessiblemem: write) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #1 = { mustprogress nofree norecurse nosync nounwind willreturn memory(read, inaccessiblemem: none) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #2 = { nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: write) }
attributes #3 = { nounwind }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 8, !"PIC Level", i32 2}
!1 = !{!"rustc version 1.79.0-dev"}
!2 = !{}
!3 = !{i64 8}
