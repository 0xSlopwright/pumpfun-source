; ModuleID = 'native_transfer_fee.e5fa555380ebe706-cgu.0'
source_filename = "native_transfer_fee.e5fa555380ebe706-cgu.0"
target datalayout = "e-m:e-p:64:64-i64:64-n32:64-S128"
target triple = "sbf"

; native_transfer_fee::DecodedTransferFee::calculate_fee
; Function Attrs: mustprogress nofree norecurse nosync nounwind willreturn memory(argmem: read)
define hidden { i64, i64 } @_ZN19native_transfer_fee18DecodedTransferFee13calculate_fee17h5027e20d2b4a3b03E(ptr noalias nocapture noundef readonly align 8 dereferenceable(24) %self, i64 noundef %amount) unnamed_addr #0 {
start:
  %0 = icmp eq i64 %amount, 0
  br i1 %0, label %bb10, label %bb2

bb2:                                              ; preds = %start
  %1 = getelementptr inbounds i8, ptr %self, i64 16
  %_4 = load i16, ptr %1, align 8, !noundef !2
  %2 = icmp eq i16 %_4, 0
  br i1 %2, label %bb10, label %bb13

bb10:                                             ; preds = %bb13, %bb2, %start, %bb27
  %_0.sroa.9.0 = phi i64 [ %_0.sroa.0.0.sroa.speculated.i, %bb27 ], [ 0, %start ], [ 0, %bb2 ], [ undef, %bb13 ]
  %_0.sroa.0.0 = phi i64 [ 1, %bb27 ], [ 1, %start ], [ 1, %bb2 ], [ 0, %bb13 ]
  %3 = insertvalue { i64, i64 } poison, i64 %_0.sroa.0.0, 0
  %4 = insertvalue { i64, i64 } %3, i64 %_0.sroa.9.0, 1
  ret { i64, i64 } %4

bb13:                                             ; preds = %bb2
  %_7 = zext i64 %amount to i128
  %bps = zext i16 %_4 to i128
  %5 = mul nuw nsw i128 %bps, %_7
  %_40 = icmp ult i128 %5, 184467440737095516150001
  br i1 %_40, label %bb27, label %bb10

bb27:                                             ; preds = %bb13
  %_35 = add nuw nsw i128 %5, 9999
  %_38 = udiv i128 %_35, 10000
  %_41 = trunc i128 %_38 to i64
  %6 = getelementptr inbounds i8, ptr %self, i64 8
  %_23 = load i64, ptr %6, align 8, !noundef !2
  %_0.sroa.0.0.sroa.speculated.i = tail call noundef i64 @llvm.umin.i64(i64 %_41, i64 %_23)
  br label %bb10
}

; native_transfer_fee::DecodedTransferFee::calculate_pre_fee_amount
; Function Attrs: mustprogress nofree norecurse nosync nounwind willreturn memory(argmem: read)
define hidden { i64, i64 } @_ZN19native_transfer_fee18DecodedTransferFee24calculate_pre_fee_amount17hb30777c99a4574a3E(ptr noalias nocapture noundef readonly align 8 dereferenceable(24) %self, i64 noundef %post_fee_amount) unnamed_addr #0 {
start:
  %0 = getelementptr inbounds i8, ptr %self, i64 16
  %_4 = load i16, ptr %0, align 8, !noundef !2
  %transfer_fee_basis_points = zext i16 %_4 to i128
  %1 = icmp eq i16 %_4, 0
  br i1 %1, label %bb16, label %bb1

bb1:                                              ; preds = %start
  %2 = icmp eq i64 %post_fee_amount, 0
  br i1 %2, label %bb16, label %bb2

bb16:                                             ; preds = %bb8, %bb24, %bb3, %bb6, %bb1, %start, %bb38, %bb9, %bb22
  %_0.sroa.15.0 = phi i64 [ %_36.0, %bb22 ], [ %_59.0, %bb38 ], [ %_61, %bb9 ], [ %post_fee_amount, %start ], [ 0, %bb1 ], [ undef, %bb6 ], [ undef, %bb3 ], [ undef, %bb24 ], [ undef, %bb8 ]
  %_0.sroa.0.0 = phi i64 [ 1, %bb22 ], [ 1, %bb38 ], [ %_0.sroa.0.2, %bb9 ], [ 1, %start ], [ 1, %bb1 ], [ 0, %bb6 ], [ 0, %bb3 ], [ 0, %bb24 ], [ 0, %bb8 ]
  %3 = insertvalue { i64, i64 } poison, i64 %_0.sroa.0.0, 0
  %4 = insertvalue { i64, i64 } %3, i64 %_0.sroa.15.0, 1
  ret { i64, i64 } %4

bb2:                                              ; preds = %bb1
  %5 = icmp eq i16 %_4, 10000
  br i1 %5, label %bb6, label %bb3

bb6:                                              ; preds = %bb2
  %6 = getelementptr inbounds i8, ptr %self, i64 8
  %_5 = load i64, ptr %6, align 8, !noundef !2
  %7 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %_5, i64 %post_fee_amount)
  %_36.1 = extractvalue { i64, i1 } %7, 1
  br i1 %_36.1, label %bb16, label %bb22

bb3:                                              ; preds = %bb2
  %_8 = zext i64 %post_fee_amount to i128
  %_38 = icmp ult i16 %_4, 10001
  br i1 %_38, label %bb24, label %bb16

bb22:                                             ; preds = %bb6
  %_36.0 = extractvalue { i64, i1 } %7, 0
  br label %bb16

bb24:                                             ; preds = %bb3
  %8 = mul nuw nsw i128 %_8, 10000
  %_39 = sub nuw nsw i128 10000, %transfer_fee_basis_points
  %9 = sub nsw i128 %8, %transfer_fee_basis_points
  %_47 = add nsw i128 %9, 9999
  %_51 = udiv i128 %_47, %_39
  %_53.not = icmp ult i128 %_51, %_8
  br i1 %_53.not, label %bb16, label %bb34

bb34:                                             ; preds = %bb24
  %_54 = sub nuw nsw i128 %_51, %_8
  %10 = getelementptr inbounds i8, ptr %self, i64 8
  %_27 = load i64, ptr %10, align 8, !noundef !2
  %_26 = zext i64 %_27 to i128
  %_22.not = icmp ult i128 %_54, %_26
  br i1 %_22.not, label %bb9, label %bb8

bb9:                                              ; preds = %bb34
  %_60 = icmp ult i128 %_51, 18446744073709551616
  %_61 = trunc i128 %_51 to i64
  %_0.sroa.0.2 = zext i1 %_60 to i64
  br label %bb16

bb8:                                              ; preds = %bb34
  %11 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %post_fee_amount, i64 %_27)
  %_59.1 = extractvalue { i64, i1 } %11, 1
  br i1 %_59.1, label %bb16, label %bb38

bb38:                                             ; preds = %bb8
  %_59.0 = extractvalue { i64, i1 } %11, 0
  br label %bb16
}

; Function Attrs: mustprogress nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare hidden { i64, i1 } @llvm.uadd.with.overflow.i64(i64, i64) #1

; Function Attrs: nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare i64 @llvm.umin.i64(i64, i64) #2

attributes #0 = { mustprogress nofree norecurse nosync nounwind willreturn memory(argmem: read) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #1 = { mustprogress nocallback nofree nosync nounwind speculatable willreturn memory(none) }
attributes #2 = { nocallback nofree nosync nounwind speculatable willreturn memory(none) }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 8, !"PIC Level", i32 2}
!1 = !{!"rustc version 1.79.0-dev"}
!2 = !{}
