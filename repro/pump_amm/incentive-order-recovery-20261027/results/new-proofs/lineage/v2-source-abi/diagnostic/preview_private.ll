; ModuleID = 'preview_private.f6261d5a81e224fd-cgu.0'
source_filename = "preview_private.f6261d5a81e224fd-cgu.0"
target datalayout = "e-m:e-p:64:64-i64:64-n32:64-S128"
target triple = "sbf"

; preview_private::local::preview_total_quote
; Function Attrs: noinline nounwind
define internal fastcc void @_ZN15preview_private5local19preview_total_quote17h2c39c32134960084E(ptr dead_on_unwind noalias nocapture noundef writable align 8 dereferenceable(16) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(32) %context, i64 noundef %quote_amount_in) unnamed_addr #0 {
start:
  %fees = alloca [48 x i8], align 8
  %_6 = alloca [104 x i8], align 8
  %result = alloca [96 x i8], align 8
  %0 = getelementptr inbounds i8, ptr %context, i64 8
  %_15 = load ptr, ptr %0, align 8, !nonnull !2, !align !3, !noundef !2
  %_25 = load ptr, ptr %_15, align 8, !nonnull !2, !noundef !2
  %_16 = load ptr, ptr %context, align 8, !nonnull !2, !align !3, !noundef !2
  %_26 = load ptr, ptr %_16, align 8, !nonnull !2, !noundef !2
  %1 = getelementptr inbounds i8, ptr %context, i64 16
  %quote_transfer_fee = load ptr, ptr %1, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.lifetime.start.p0(i64 96, ptr nonnull %result)
  call void @llvm.lifetime.start.p0(i64 104, ptr nonnull %_6)
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %fees)
  %2 = getelementptr inbounds i8, ptr %context, i64 24
  %_17 = load ptr, ptr %2, align 8, !nonnull !2, !align !3, !noundef !2
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %fees, ptr noundef nonnull align 8 dereferenceable(48) %_17, i64 48, i1 false)
  %3 = getelementptr inbounds i8, ptr %_25, i64 928
  %_8 = load i64, ptr %3, align 8, !noundef !2
  %4 = getelementptr inbounds i8, ptr %_26, i64 283
  %5 = load i8, ptr %4, align 1, !range !4, !noundef !2
; call pump_amm_recovered::instructions::swap::trade_v2::calculate_buy_result
  call void @_ZN18pump_amm_recovered12instructions4swap8trade_v220calculate_buy_result17h649da20258074667E(ptr noalias nocapture noundef nonnull sret([104 x i8]) align 8 dereferenceable(104) %_6, i64 noundef %_8, i8 noundef %5, ptr noalias noundef nonnull readonly align 8 dereferenceable(32) %quote_transfer_fee, i64 noundef 0, i64 noundef %quote_amount_in, ptr noalias noundef nonnull readonly align 8 dereferenceable(48) %fees) #4
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %fees)
  %_20 = load i64, ptr %_6, align 8, !range !5, !noundef !2
  %trunc.not = icmp eq i64 %_20, 0
  %6 = getelementptr inbounds i8, ptr %_6, i64 8
  %_21.sroa.0.0.copyload = load i64, ptr %6, align 8
  %_21.sroa.5.0..sroa_idx = getelementptr inbounds i8, ptr %_6, i64 16
  %_21.sroa.5.0.copyload = load ptr, ptr %_21.sroa.5.0..sroa_idx, align 8
  br i1 %trunc.not, label %bb6, label %bb5

bb6:                                              ; preds = %start
  %_21.sroa.6.0..sroa_idx = getelementptr inbounds i8, ptr %_6, i64 24
  %val.sroa.5.0.result.sroa_idx = getelementptr inbounds i8, ptr %result, i64 16
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(80) %val.sroa.5.0.result.sroa_idx, ptr noundef nonnull align 8 dereferenceable(80) %_21.sroa.6.0..sroa_idx, i64 80, i1 false)
  call void @llvm.lifetime.end.p0(i64 104, ptr nonnull %_6)
  store i64 %_21.sroa.0.0.copyload, ptr %result, align 8
  %val.sroa.4.0.result.sroa_idx = getelementptr inbounds i8, ptr %result, i64 8
  store ptr %_21.sroa.5.0.copyload, ptr %val.sroa.4.0.result.sroa_idx, align 8
; call pump_amm_recovered::instructions::swap::trade_v2::BuyResult::total_user_quote
  call void @_ZN18pump_amm_recovered12instructions4swap8trade_v29BuyResult16total_user_quote17h929d3313a31d5658E(ptr noalias nocapture noundef nonnull sret([16 x i8]) align 8 dereferenceable(16) %_0, ptr noalias noundef nonnull readonly align 8 dereferenceable(96) %result) #4
  call void @llvm.lifetime.end.p0(i64 96, ptr nonnull %result)
  br label %bb4

bb5:                                              ; preds = %start
  call void @llvm.lifetime.end.p0(i64 104, ptr nonnull %_6)
  store i64 %_21.sroa.0.0.copyload, ptr %_0, align 8
  %7 = getelementptr inbounds i8, ptr %_0, i64 8
  store ptr %_21.sroa.5.0.copyload, ptr %7, align 8
  call void @llvm.lifetime.end.p0(i64 96, ptr nonnull %result)
  br label %bb4

bb4:                                              ; preds = %bb5, %bb6
  ret void
}

; preview_private::call
; Function Attrs: nounwind
define hidden void @_ZN15preview_private4call17h93ef7b3c83174bbdE(ptr dead_on_unwind noalias nocapture noundef writable sret([16 x i8]) align 8 dereferenceable(16) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(32) %context, i64 noundef %quote_amount_in) unnamed_addr #1 {
start:
; call preview_private::local::preview_total_quote
  tail call fastcc void @_ZN15preview_private5local19preview_total_quote17h2c39c32134960084E(ptr noalias nocapture noundef nonnull align 8 dereferenceable(16) %_0, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(32) %context, i64 noundef %quote_amount_in) #4
  ret void
}

; Function Attrs: mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite)
declare void @llvm.memcpy.p0.p0.i64(ptr noalias nocapture writeonly, ptr noalias nocapture readonly, i64, i1 immarg) #2

; pump_amm_recovered::instructions::swap::trade_v2::calculate_buy_result
; Function Attrs: noinline nounwind
declare void @_ZN18pump_amm_recovered12instructions4swap8trade_v220calculate_buy_result17h649da20258074667E(ptr dead_on_unwind noalias nocapture noundef writable sret([104 x i8]) align 8 dereferenceable(104), i64 noundef, i8 noundef, ptr noalias noundef readonly align 8 dereferenceable(32), i64 noundef, i64 noundef, ptr noalias noundef readonly align 8 dereferenceable(48)) unnamed_addr #0

; pump_amm_recovered::instructions::swap::trade_v2::BuyResult::total_user_quote
; Function Attrs: nounwind
declare void @_ZN18pump_amm_recovered12instructions4swap8trade_v29BuyResult16total_user_quote17h929d3313a31d5658E(ptr dead_on_unwind noalias nocapture noundef writable sret([16 x i8]) align 8 dereferenceable(16), ptr noalias noundef readonly align 8 dereferenceable(96)) unnamed_addr #1

; Function Attrs: mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite)
declare void @llvm.lifetime.start.p0(i64 immarg, ptr nocapture) #3

; Function Attrs: mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite)
declare void @llvm.lifetime.end.p0(i64 immarg, ptr nocapture) #3

attributes #0 = { noinline nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #1 = { nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #2 = { mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite) }
attributes #3 = { mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite) }
attributes #4 = { nounwind }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 8, !"PIC Level", i32 2}
!1 = !{!"rustc version 1.79.0-dev"}
!2 = !{}
!3 = !{i64 8}
!4 = !{i8 0, i8 2}
!5 = !{i64 0, i64 2}
