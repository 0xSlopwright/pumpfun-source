; ModuleID = 'without_clone.fbc1fe255982cbfd-cgu.0'
source_filename = "without_clone.fbc1fe255982cbfd-cgu.0"
target datalayout = "e-m:e-p:64:64-i64:64-n32:64-S128"
target triple = "sbf"

@alloc_796d64aa23638b9d8a2f64f9cfd12664 = private unnamed_addr constant <{ [6 x i8] }> <{ [6 x i8] c"buy_v2" }>, align 1

; without_clone::emission
; Function Attrs: nounwind
define hidden void @_ZN13without_clone8emission17h86b3440e5803b9e7E(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([48 x i8]) align 8 dereferenceable(48) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(128) %ctx, ptr noalias noundef readonly align 8 dereferenceable(96) %result) unnamed_addr #0 {
start:
  %_13 = alloca [48 x i8], align 8
  %_5 = alloca [512 x i8], align 8
  %event = alloca [512 x i8], align 8
  call void @llvm.lifetime.start.p0(i64 512, ptr nonnull %event)
  call void @llvm.lifetime.start.p0(i64 512, ptr nonnull %_5)
; call pump_amm_recovered::instructions::swap::trade_v2::create_buy_event
  call void @_ZN18pump_amm_recovered12instructions4swap8trade_v216create_buy_event17h883d3a5977e5b3f0E(ptr noalias nocapture noundef nonnull sret([512 x i8]) align 8 dereferenceable(512) %_5, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(128) %ctx, ptr noalias noundef nonnull readonly align 8 dereferenceable(96) %result, i64 noundef 0, i64 noundef 0, i64 noundef 0, i64 noundef 0, i64 noundef 0, i64 noundef 0, i64 noundef 0, i64 noundef 0, i128 noundef 0, i64 noundef 0, ptr noalias noundef nonnull readonly align 1 @alloc_796d64aa23638b9d8a2f64f9cfd12664, i64 noundef 6) #5
  %0 = load i64, ptr %_5, align 8, !range !2, !noundef !3
  %1 = icmp eq i64 %0, -9223372036854775808
  %2 = getelementptr inbounds i8, ptr %_5, i64 8
  %_16.0 = load i64, ptr %2, align 8
  %3 = getelementptr inbounds i8, ptr %_5, i64 16
  %_16.1 = load ptr, ptr %3, align 8
  br i1 %1, label %bb7, label %bb8

bb8:                                              ; preds = %start
  %_15.sroa.7.0._5.sroa_idx = getelementptr inbounds i8, ptr %_5, i64 24
  %val.sroa.6.0.event.sroa_idx = getelementptr inbounds i8, ptr %event, i64 24
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(488) %val.sroa.6.0.event.sroa_idx, ptr noundef nonnull align 8 dereferenceable(488) %_15.sroa.7.0._5.sroa_idx, i64 488, i1 false)
  call void @llvm.lifetime.end.p0(i64 512, ptr nonnull %_5)
  store i64 %0, ptr %event, align 8
  %val.sroa.4.0.event.sroa_idx = getelementptr inbounds i8, ptr %event, i64 8
  store i64 %_16.0, ptr %val.sroa.4.0.event.sroa_idx, align 8
  %val.sroa.5.0.event.sroa_idx = getelementptr inbounds i8, ptr %event, i64 16
  store ptr %_16.1, ptr %val.sroa.5.0.event.sroa_idx, align 8
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_13)
; call <pump_amm_recovered::instructions::swap::buy::BuyEvent as anchor_lang::Event>::data
  call void @"_ZN92_$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$u20$as$u20$anchor_lang..Event$GT$4data17h57caa0e5519d5df2E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_13, ptr noalias noundef nonnull readonly align 8 dereferenceable(512) %event) #5
  %4 = getelementptr inbounds i8, ptr %_13, i64 24
; call <pump_amm_recovered::instructions::swap::buy::BuyEvent as anchor_lang::Event>::data
  call void @"_ZN92_$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$u20$as$u20$anchor_lang..Event$GT$4data17h57caa0e5519d5df2E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %4, ptr noalias noundef nonnull readonly align 8 dereferenceable(512) %event) #5
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %_0, ptr noundef nonnull align 8 dereferenceable(48) %_13, i64 48, i1 false)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_13)
  %event.val = load i64, ptr %event, align 8, !noundef !3
  %5 = icmp eq i64 %event.val, 0
  br i1 %5, label %"_ZN4core3ptr74drop_in_place$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$GT$17h1afd21a32b58e46fE.exit", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i": ; preds = %bb8
  %event.val4 = load ptr, ptr %val.sroa.4.0.event.sroa_idx, align 8, !nonnull !3, !noundef !3
  call void @__rust_dealloc(ptr noundef nonnull %event.val4, i64 noundef %event.val, i64 noundef 1) #5
  br label %"_ZN4core3ptr74drop_in_place$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$GT$17h1afd21a32b58e46fE.exit"

"_ZN4core3ptr74drop_in_place$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$GT$17h1afd21a32b58e46fE.exit": ; preds = %bb8, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i"
  call void @llvm.lifetime.end.p0(i64 512, ptr nonnull %event)
  br label %bb6

bb7:                                              ; preds = %start
  call void @llvm.lifetime.end.p0(i64 512, ptr nonnull %_5)
  %6 = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %_16.0, ptr %6, align 8
  %7 = getelementptr inbounds i8, ptr %_0, i64 16
  store ptr %_16.1, ptr %7, align 8
  store i64 -9223372036854775808, ptr %_0, align 8
  call void @llvm.lifetime.end.p0(i64 512, ptr nonnull %event)
  br label %bb6

bb6:                                              ; preds = %bb7, %"_ZN4core3ptr74drop_in_place$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$GT$17h1afd21a32b58e46fE.exit"
  ret void
}

; Function Attrs: mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite)
declare void @llvm.memcpy.p0.p0.i64(ptr noalias nocapture writeonly, ptr noalias nocapture readonly, i64, i1 immarg) #1

; Function Attrs: nounwind allockind("free")
declare void @__rust_dealloc(ptr allocptr noundef, i64 noundef, i64 noundef) unnamed_addr #2

; pump_amm_recovered::instructions::swap::trade_v2::create_buy_event
; Function Attrs: noinline nounwind
declare void @_ZN18pump_amm_recovered12instructions4swap8trade_v216create_buy_event17h883d3a5977e5b3f0E(ptr dead_on_unwind noalias nocapture noundef writable sret([512 x i8]) align 8 dereferenceable(512), ptr noalias nocapture noundef readonly align 8 dereferenceable(128), ptr noalias noundef readonly align 8 dereferenceable(96), i64 noundef, i64 noundef, i64 noundef, i64 noundef, i64 noundef, i64 noundef, i64 noundef, i64 noundef, i128 noundef, i64 noundef, ptr noalias noundef nonnull readonly align 1, i64 noundef) unnamed_addr #3

; <pump_amm_recovered::instructions::swap::buy::BuyEvent as anchor_lang::Event>::data
; Function Attrs: nounwind
declare void @"_ZN92_$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$u20$as$u20$anchor_lang..Event$GT$4data17h57caa0e5519d5df2E"(ptr dead_on_unwind noalias nocapture noundef writable sret([24 x i8]) align 8 dereferenceable(24), ptr noalias noundef readonly align 8 dereferenceable(512)) unnamed_addr #0

; Function Attrs: mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite)
declare void @llvm.lifetime.start.p0(i64 immarg, ptr nocapture) #4

; Function Attrs: mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite)
declare void @llvm.lifetime.end.p0(i64 immarg, ptr nocapture) #4

attributes #0 = { nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #1 = { mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite) }
attributes #2 = { nounwind allockind("free") "alloc-family"="__rust_alloc" "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #3 = { noinline nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #4 = { mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite) }
attributes #5 = { nounwind }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 8, !"PIC Level", i32 2}
!1 = !{!"rustc version 1.79.0-dev"}
!2 = !{i64 0, i64 -9223372036854775807}
!3 = !{}
