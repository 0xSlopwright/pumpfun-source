; ModuleID = 'with_clone.88697a41b73b8194-cgu.0'
source_filename = "with_clone.88697a41b73b8194-cgu.0"
target datalayout = "e-m:e-p:64:64-i64:64-n32:64-S128"
target triple = "sbf"

@alloc_796d64aa23638b9d8a2f64f9cfd12664 = private unnamed_addr constant <{ [6 x i8] }> <{ [6 x i8] c"buy_v2" }>, align 1

; with_clone::emission
; Function Attrs: nounwind
define hidden void @_ZN10with_clone8emission17he159ce9e3a31ecfeE(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([48 x i8]) align 8 dereferenceable(48) %_0, ptr noalias nocapture noundef readonly align 8 dereferenceable(128) %ctx, ptr noalias noundef readonly align 8 dereferenceable(96) %result) unnamed_addr #0 {
start:
  %_15 = alloca [48 x i8], align 8
  %_11 = alloca [512 x i8], align 8
  %first = alloca [24 x i8], align 8
  %_5 = alloca [512 x i8], align 8
  %event = alloca [512 x i8], align 8
  call void @llvm.lifetime.start.p0(i64 512, ptr nonnull %event)
  call void @llvm.lifetime.start.p0(i64 512, ptr nonnull %_5)
; call pump_amm_recovered::instructions::swap::trade_v2::create_buy_event
  call void @_ZN18pump_amm_recovered12instructions4swap8trade_v216create_buy_event17h883d3a5977e5b3f0E(ptr noalias nocapture noundef nonnull sret([512 x i8]) align 8 dereferenceable(512) %_5, ptr noalias nocapture noundef nonnull readonly align 8 dereferenceable(128) %ctx, ptr noalias noundef nonnull readonly align 8 dereferenceable(96) %result, i64 noundef 0, i64 noundef 0, i64 noundef 0, i64 noundef 0, i64 noundef 0, i64 noundef 0, i64 noundef 0, i64 noundef 0, i128 noundef 0, i64 noundef 0, ptr noalias noundef nonnull readonly align 1 @alloc_796d64aa23638b9d8a2f64f9cfd12664, i64 noundef 6) #6
  %0 = load i64, ptr %_5, align 8, !range !2, !noundef !3
  %1 = icmp eq i64 %0, -9223372036854775808
  %2 = getelementptr inbounds i8, ptr %_5, i64 8
  %_18.0 = load i64, ptr %2, align 8
  %3 = getelementptr inbounds i8, ptr %_5, i64 16
  %_18.1 = load ptr, ptr %3, align 8
  br i1 %1, label %bb9, label %bb10

bb10:                                             ; preds = %start
  %_17.sroa.7.0._5.sroa_idx = getelementptr inbounds i8, ptr %_5, i64 24
  %val.sroa.6.0.event.sroa_idx = getelementptr inbounds i8, ptr %event, i64 24
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(488) %val.sroa.6.0.event.sroa_idx, ptr noundef nonnull align 8 dereferenceable(488) %_17.sroa.7.0._5.sroa_idx, i64 488, i1 false)
  call void @llvm.lifetime.end.p0(i64 512, ptr nonnull %_5)
  store i64 %0, ptr %event, align 8
  %val.sroa.4.0.event.sroa_idx = getelementptr inbounds i8, ptr %event, i64 8
  store i64 %_18.0, ptr %val.sroa.4.0.event.sroa_idx, align 8
  %val.sroa.5.0.event.sroa_idx = getelementptr inbounds i8, ptr %event, i64 16
  store ptr %_18.1, ptr %val.sroa.5.0.event.sroa_idx, align 8
  call void @llvm.lifetime.start.p0(i64 512, ptr nonnull %_11)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !4)
  tail call void @llvm.experimental.noalias.scope.decl(metadata !7)
  %_2.i = load i64, ptr %val.sroa.6.0.event.sroa_idx, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %4 = getelementptr inbounds i8, ptr %event, i64 32
  %_3.i = load i64, ptr %4, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %5 = getelementptr inbounds i8, ptr %event, i64 40
  %_4.i = load i64, ptr %5, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %6 = getelementptr inbounds i8, ptr %event, i64 48
  %_5.i = load i64, ptr %6, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %7 = getelementptr inbounds i8, ptr %event, i64 56
  %_6.i = load i64, ptr %7, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %8 = getelementptr inbounds i8, ptr %event, i64 64
  %_7.i = load i64, ptr %8, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %9 = getelementptr inbounds i8, ptr %event, i64 72
  %_8.i = load i64, ptr %9, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %10 = getelementptr inbounds i8, ptr %event, i64 80
  %_9.i = load i64, ptr %10, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %11 = getelementptr inbounds i8, ptr %event, i64 88
  %_10.i = load i64, ptr %11, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %12 = getelementptr inbounds i8, ptr %event, i64 96
  %_11.i = load i64, ptr %12, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %13 = getelementptr inbounds i8, ptr %event, i64 104
  %_12.i = load i64, ptr %13, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %14 = getelementptr inbounds i8, ptr %event, i64 112
  %_13.i = load i64, ptr %14, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %15 = getelementptr inbounds i8, ptr %event, i64 120
  %_14.i = load i64, ptr %15, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %16 = getelementptr inbounds i8, ptr %event, i64 128
  %_15.i = load i64, ptr %16, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %17 = getelementptr inbounds i8, ptr %event, i64 136
  %18 = getelementptr inbounds i8, ptr %_11, i64 136
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %18, ptr noundef nonnull align 8 dereferenceable(32) %17, i64 32, i1 false), !alias.scope !9
  %19 = getelementptr inbounds i8, ptr %event, i64 168
  %20 = getelementptr inbounds i8, ptr %_11, i64 168
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %20, ptr noundef nonnull align 8 dereferenceable(32) %19, i64 32, i1 false), !alias.scope !9
  %21 = getelementptr inbounds i8, ptr %event, i64 200
  %22 = getelementptr inbounds i8, ptr %_11, i64 200
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %22, ptr noundef nonnull align 8 dereferenceable(32) %21, i64 32, i1 false), !alias.scope !9
  %23 = getelementptr inbounds i8, ptr %event, i64 232
  %24 = getelementptr inbounds i8, ptr %_11, i64 232
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %24, ptr noundef nonnull align 8 dereferenceable(32) %23, i64 32, i1 false), !alias.scope !9
  %25 = getelementptr inbounds i8, ptr %event, i64 264
  %26 = getelementptr inbounds i8, ptr %_11, i64 264
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %26, ptr noundef nonnull align 8 dereferenceable(32) %25, i64 32, i1 false), !alias.scope !9
  %27 = getelementptr inbounds i8, ptr %event, i64 296
  %28 = getelementptr inbounds i8, ptr %_11, i64 296
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %28, ptr noundef nonnull align 8 dereferenceable(32) %27, i64 32, i1 false), !alias.scope !9
  %29 = getelementptr inbounds i8, ptr %event, i64 328
  %30 = getelementptr inbounds i8, ptr %_11, i64 328
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(32) %30, ptr noundef nonnull align 8 dereferenceable(32) %29, i64 32, i1 false), !alias.scope !9
  %31 = getelementptr inbounds i8, ptr %event, i64 360
  %_23.i = load i64, ptr %31, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %32 = getelementptr inbounds i8, ptr %event, i64 368
  %_24.i = load i64, ptr %32, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %33 = getelementptr inbounds i8, ptr %event, i64 504
  %34 = load i8, ptr %33, align 8, !range !10, !alias.scope !7, !noalias !4, !noundef !3
  %35 = getelementptr inbounds i8, ptr %event, i64 376
  %_26.i = load i64, ptr %35, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %36 = getelementptr inbounds i8, ptr %event, i64 384
  %_27.i = load i64, ptr %36, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %37 = getelementptr inbounds i8, ptr %event, i64 392
  %_28.i = load i64, ptr %37, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %38 = getelementptr inbounds i8, ptr %event, i64 400
  %_29.i = load i64, ptr %38, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %39 = getelementptr inbounds i8, ptr %event, i64 408
  %_30.i = load i64, ptr %39, align 8, !alias.scope !7, !noalias !4, !noundef !3
; call <alloc::string::String as core::clone::Clone>::clone
  call void @"_ZN60_$LT$alloc..string..String$u20$as$u20$core..clone..Clone$GT$5clone17h415f8832ba4c6f63E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %_11, ptr noalias noundef nonnull readonly align 8 dereferenceable(24) %event) #6
  %40 = getelementptr inbounds i8, ptr %event, i64 416
  %_33.i = load i64, ptr %40, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %41 = getelementptr inbounds i8, ptr %event, i64 424
  %_34.i = load i64, ptr %41, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %42 = getelementptr inbounds i8, ptr %event, i64 432
  %_35.i = load i64, ptr %42, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %43 = getelementptr inbounds i8, ptr %event, i64 440
  %_36.i = load i64, ptr %43, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %44 = getelementptr inbounds i8, ptr %event, i64 448
  %_37.i = load i128, ptr %44, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %45 = getelementptr inbounds i8, ptr %event, i64 505
  %46 = load i8, ptr %45, align 1, !range !10, !alias.scope !7, !noalias !4, !noundef !3
  %47 = getelementptr inbounds i8, ptr %event, i64 464
  %_39.i = load i64, ptr %47, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %48 = getelementptr inbounds i8, ptr %event, i64 472
  %_40.i = load i64, ptr %48, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %49 = getelementptr inbounds i8, ptr %event, i64 480
  %_41.i = load i64, ptr %49, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %50 = getelementptr inbounds i8, ptr %event, i64 488
  %_42.i = load i64, ptr %50, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %51 = getelementptr inbounds i8, ptr %event, i64 496
  %_43.i = load i64, ptr %51, align 8, !alias.scope !7, !noalias !4, !noundef !3
  %52 = getelementptr inbounds i8, ptr %_11, i64 24
  store i64 %_2.i, ptr %52, align 8, !alias.scope !4, !noalias !7
  %53 = getelementptr inbounds i8, ptr %_11, i64 32
  store i64 %_3.i, ptr %53, align 8, !alias.scope !4, !noalias !7
  %54 = getelementptr inbounds i8, ptr %_11, i64 40
  store i64 %_4.i, ptr %54, align 8, !alias.scope !4, !noalias !7
  %55 = getelementptr inbounds i8, ptr %_11, i64 48
  store i64 %_5.i, ptr %55, align 8, !alias.scope !4, !noalias !7
  %56 = getelementptr inbounds i8, ptr %_11, i64 56
  store i64 %_6.i, ptr %56, align 8, !alias.scope !4, !noalias !7
  %57 = getelementptr inbounds i8, ptr %_11, i64 64
  store i64 %_7.i, ptr %57, align 8, !alias.scope !4, !noalias !7
  %58 = getelementptr inbounds i8, ptr %_11, i64 72
  store i64 %_8.i, ptr %58, align 8, !alias.scope !4, !noalias !7
  %59 = getelementptr inbounds i8, ptr %_11, i64 80
  store i64 %_9.i, ptr %59, align 8, !alias.scope !4, !noalias !7
  %60 = getelementptr inbounds i8, ptr %_11, i64 88
  store i64 %_10.i, ptr %60, align 8, !alias.scope !4, !noalias !7
  %61 = getelementptr inbounds i8, ptr %_11, i64 96
  store i64 %_11.i, ptr %61, align 8, !alias.scope !4, !noalias !7
  %62 = getelementptr inbounds i8, ptr %_11, i64 104
  store i64 %_12.i, ptr %62, align 8, !alias.scope !4, !noalias !7
  %63 = getelementptr inbounds i8, ptr %_11, i64 112
  store i64 %_13.i, ptr %63, align 8, !alias.scope !4, !noalias !7
  %64 = getelementptr inbounds i8, ptr %_11, i64 120
  store i64 %_14.i, ptr %64, align 8, !alias.scope !4, !noalias !7
  %65 = getelementptr inbounds i8, ptr %_11, i64 128
  store i64 %_15.i, ptr %65, align 8, !alias.scope !4, !noalias !7
  %66 = getelementptr inbounds i8, ptr %_11, i64 360
  store i64 %_23.i, ptr %66, align 8, !alias.scope !4, !noalias !7
  %67 = getelementptr inbounds i8, ptr %_11, i64 368
  store i64 %_24.i, ptr %67, align 8, !alias.scope !4, !noalias !7
  %68 = getelementptr inbounds i8, ptr %_11, i64 504
  store i8 %34, ptr %68, align 8, !alias.scope !4, !noalias !7
  %69 = getelementptr inbounds i8, ptr %_11, i64 376
  store i64 %_26.i, ptr %69, align 8, !alias.scope !4, !noalias !7
  %70 = getelementptr inbounds i8, ptr %_11, i64 384
  store i64 %_27.i, ptr %70, align 8, !alias.scope !4, !noalias !7
  %71 = getelementptr inbounds i8, ptr %_11, i64 392
  store i64 %_28.i, ptr %71, align 8, !alias.scope !4, !noalias !7
  %72 = getelementptr inbounds i8, ptr %_11, i64 400
  store i64 %_29.i, ptr %72, align 8, !alias.scope !4, !noalias !7
  %73 = getelementptr inbounds i8, ptr %_11, i64 408
  store i64 %_30.i, ptr %73, align 8, !alias.scope !4, !noalias !7
  %74 = getelementptr inbounds i8, ptr %_11, i64 416
  store i64 %_33.i, ptr %74, align 8, !alias.scope !4, !noalias !7
  %75 = getelementptr inbounds i8, ptr %_11, i64 424
  store i64 %_34.i, ptr %75, align 8, !alias.scope !4, !noalias !7
  %76 = getelementptr inbounds i8, ptr %_11, i64 432
  store i64 %_35.i, ptr %76, align 8, !alias.scope !4, !noalias !7
  %77 = getelementptr inbounds i8, ptr %_11, i64 440
  store i64 %_36.i, ptr %77, align 8, !alias.scope !4, !noalias !7
  %78 = getelementptr inbounds i8, ptr %_11, i64 448
  store i128 %_37.i, ptr %78, align 8, !alias.scope !4, !noalias !7
  %79 = getelementptr inbounds i8, ptr %_11, i64 505
  store i8 %46, ptr %79, align 1, !alias.scope !4, !noalias !7
  %80 = getelementptr inbounds i8, ptr %_11, i64 464
  store i64 %_39.i, ptr %80, align 8, !alias.scope !4, !noalias !7
  %81 = getelementptr inbounds i8, ptr %_11, i64 472
  store i64 %_40.i, ptr %81, align 8, !alias.scope !4, !noalias !7
  %82 = getelementptr inbounds i8, ptr %_11, i64 480
  store i64 %_41.i, ptr %82, align 8, !alias.scope !4, !noalias !7
  %83 = getelementptr inbounds i8, ptr %_11, i64 488
  store i64 %_42.i, ptr %83, align 8, !alias.scope !4, !noalias !7
  %84 = getelementptr inbounds i8, ptr %_11, i64 496
  store i64 %_43.i, ptr %84, align 8, !alias.scope !4, !noalias !7
; call <pump_amm_recovered::instructions::swap::buy::BuyEvent as anchor_lang::Event>::data
  call void @"_ZN92_$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$u20$as$u20$anchor_lang..Event$GT$4data17h57caa0e5519d5df2E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %first, ptr noalias noundef nonnull readonly align 8 dereferenceable(512) %_11) #6
  %_11.val = load i64, ptr %_11, align 8, !noundef !3
  %85 = icmp eq i64 %_11.val, 0
  br i1 %85, label %"_ZN4core3ptr74drop_in_place$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$GT$17hba719db663ed6ae1E.exit", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i": ; preds = %bb10
  %86 = getelementptr inbounds i8, ptr %_11, i64 8
  %_11.val5 = load ptr, ptr %86, align 8, !nonnull !3, !noundef !3
  call void @__rust_dealloc(ptr noundef nonnull %_11.val5, i64 noundef %_11.val, i64 noundef 1) #6
  br label %"_ZN4core3ptr74drop_in_place$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$GT$17hba719db663ed6ae1E.exit"

"_ZN4core3ptr74drop_in_place$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$GT$17hba719db663ed6ae1E.exit": ; preds = %bb10, %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i"
  call void @llvm.lifetime.end.p0(i64 512, ptr nonnull %_11)
  %87 = getelementptr inbounds i8, ptr %_15, i64 24
  call void @llvm.lifetime.start.p0(i64 48, ptr nonnull %_15)
; call <pump_amm_recovered::instructions::swap::buy::BuyEvent as anchor_lang::Event>::data
  call void @"_ZN92_$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$u20$as$u20$anchor_lang..Event$GT$4data17h57caa0e5519d5df2E"(ptr noalias nocapture noundef nonnull sret([24 x i8]) align 8 dereferenceable(24) %87, ptr noalias noundef nonnull readonly align 8 dereferenceable(512) %event) #6
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(24) %_15, ptr noundef nonnull align 8 dereferenceable(24) %first, i64 24, i1 false)
  call void @llvm.memcpy.p0.p0.i64(ptr noundef nonnull align 8 dereferenceable(48) %_0, ptr noundef nonnull align 8 dereferenceable(48) %_15, i64 48, i1 false)
  call void @llvm.lifetime.end.p0(i64 48, ptr nonnull %_15)
  %event.val = load i64, ptr %event, align 8, !noundef !3
  %88 = icmp eq i64 %event.val, 0
  br i1 %88, label %"_ZN4core3ptr74drop_in_place$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$GT$17hba719db663ed6ae1E.exit7", label %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i6"

"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i6": ; preds = %"_ZN4core3ptr74drop_in_place$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$GT$17hba719db663ed6ae1E.exit"
  %event.val4 = load ptr, ptr %val.sroa.4.0.event.sroa_idx, align 8, !nonnull !3, !noundef !3
  call void @__rust_dealloc(ptr noundef nonnull %event.val4, i64 noundef %event.val, i64 noundef 1) #6
  br label %"_ZN4core3ptr74drop_in_place$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$GT$17hba719db663ed6ae1E.exit7"

"_ZN4core3ptr74drop_in_place$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$GT$17hba719db663ed6ae1E.exit7": ; preds = %"_ZN4core3ptr74drop_in_place$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$GT$17hba719db663ed6ae1E.exit", %"_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h6b30618160528bb2E.exit.i.i.i.i.i6"
  call void @llvm.lifetime.end.p0(i64 512, ptr nonnull %event)
  br label %bb8

bb9:                                              ; preds = %start
  call void @llvm.lifetime.end.p0(i64 512, ptr nonnull %_5)
  %89 = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %_18.0, ptr %89, align 8
  %90 = getelementptr inbounds i8, ptr %_0, i64 16
  store ptr %_18.1, ptr %90, align 8
  store i64 -9223372036854775808, ptr %_0, align 8
  call void @llvm.lifetime.end.p0(i64 512, ptr nonnull %event)
  br label %bb8

bb8:                                              ; preds = %bb9, %"_ZN4core3ptr74drop_in_place$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$GT$17hba719db663ed6ae1E.exit7"
  ret void
}

; Function Attrs: mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite)
declare void @llvm.memcpy.p0.p0.i64(ptr noalias nocapture writeonly, ptr noalias nocapture readonly, i64, i1 immarg) #1

; Function Attrs: nounwind allockind("free")
declare void @__rust_dealloc(ptr allocptr noundef, i64 noundef, i64 noundef) unnamed_addr #2

; <alloc::string::String as core::clone::Clone>::clone
; Function Attrs: nounwind
declare void @"_ZN60_$LT$alloc..string..String$u20$as$u20$core..clone..Clone$GT$5clone17h415f8832ba4c6f63E"(ptr dead_on_unwind noalias nocapture noundef writable sret([24 x i8]) align 8 dereferenceable(24), ptr noalias noundef readonly align 8 dereferenceable(24)) unnamed_addr #0

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

; Function Attrs: nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: readwrite)
declare void @llvm.experimental.noalias.scope.decl(metadata) #5

attributes #0 = { nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #1 = { mustprogress nocallback nofree nounwind willreturn memory(argmem: readwrite) }
attributes #2 = { nounwind allockind("free") "alloc-family"="__rust_alloc" "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #3 = { noinline nounwind "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #4 = { mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite) }
attributes #5 = { nocallback nofree nosync nounwind willreturn memory(inaccessiblemem: readwrite) }
attributes #6 = { nounwind }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 8, !"PIC Level", i32 2}
!1 = !{!"rustc version 1.79.0-dev"}
!2 = !{i64 0, i64 -9223372036854775807}
!3 = !{}
!4 = !{!5}
!5 = distinct !{!5, !6, !"_ZN92_$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$u20$as$u20$core..clone..Clone$GT$5clone17hf9f8e876f14b9ea2E: %_0"}
!6 = distinct !{!6, !"_ZN92_$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$u20$as$u20$core..clone..Clone$GT$5clone17hf9f8e876f14b9ea2E"}
!7 = !{!8}
!8 = distinct !{!8, !6, !"_ZN92_$LT$pump_amm_recovered..instructions..swap..buy..BuyEvent$u20$as$u20$core..clone..Clone$GT$5clone17hf9f8e876f14b9ea2E: %self"}
!9 = !{!5, !8}
!10 = !{i8 0, i8 2}
