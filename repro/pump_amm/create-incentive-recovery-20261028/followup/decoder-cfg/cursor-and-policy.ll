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

; native_transfer_fee::decode_transfer_fees
; Function Attrs: nofree norecurse nosync nounwind memory(read, argmem: readwrite, inaccessiblemem: none)
define hidden void @_ZN19native_transfer_fee20decode_transfer_fees17ha159194b81c54f25E(ptr dead_on_unwind noalias nocapture noundef writable writeonly sret([56 x i8]) align 8 dereferenceable(56) %_0, ptr noalias nocapture noundef nonnull readonly align 1 %data.0, i64 noundef %data.1) unnamed_addr #1 {
start:
  %0 = icmp eq i64 %data.1, 82
  br i1 %0, label %bb1, label %bb2

bb1:                                              ; preds = %start
  store i64 0, ptr %_0, align 8
  br label %bb28

bb2:                                              ; preds = %start
  %_4 = icmp ult i64 %data.1, 167
  br i1 %_4, label %bb9, label %bb1.i

bb28:                                             ; preds = %bb32, %bb15, %bb41, %bb21, %bb48, %bb17, %bb13, %bb9, %bb1
  ret void

bb1.i:                                            ; preds = %bb2, %bb3.i21
  %_13.i.i2.i.idx = phi i64 [ %_13.i.i2.i.add, %bb3.i21 ], [ 82, %bb2 ]
  %.not.i.not = icmp eq i64 %_13.i.i2.i.idx, 165
  br i1 %.not.i.not, label %bb7, label %bb3.i21

bb3.i21:                                          ; preds = %bb1.i
  %_13.i.i2.i.ptr = getelementptr inbounds i8, ptr %data.0, i64 %_13.i.i2.i.idx
  %_13.i.i2.i.add = add nuw nsw i64 %_13.i.i2.i.idx, 1
  %.val.i = load i8, ptr %_13.i.i2.i.ptr, align 1, !noalias !3, !noundef !2
  %_0.i.not.i = icmp eq i8 %.val.i, 0
  br i1 %_0.i.not.i, label %bb1.i, label %bb9

bb9:                                              ; preds = %bb3.i21, %bb7, %bb2
  store i64 2, ptr %_0, align 8
  br label %bb28

bb7:                                              ; preds = %bb1.i
  %1 = getelementptr inbounds [0 x i8], ptr %data.0, i64 0, i64 165
  %_9 = load i8, ptr %1, align 1, !noundef !2
  %2 = icmp eq i8 %_9, 1
  br i1 %2, label %bb10, label %bb9

bb10:                                             ; preds = %bb7
  %new_len.i = add i64 %data.1, -166
  %data.i22 = getelementptr inbounds i8, ptr %data.0, i64 166
  br label %bb33

bb32:                                             ; preds = %bb49
  store i64 2, ptr %_0, align 8
  br label %bb28

bb33:                                             ; preds = %bb10, %bb49
  %data.i2498 = phi ptr [ %data.i22, %bb10 ], [ %data.i24, %bb49 ]
  %new_len.i2397 = phi i64 [ %new_len.i, %bb10 ], [ %new_len.i23, %bb49 ]
  %fees.sroa.0.096 = phi i64 [ 0, %bb10 ], [ %fees.sroa.0.1, %bb49 ]
  %offset.sroa.0.095 = phi i64 [ 0, %bb10 ], [ %_96.0, %bb49 ]
  %fees.sroa.7.sroa.8.sroa.6.094 = phi i16 [ undef, %bb10 ], [ %fees.sroa.7.sroa.8.sroa.6.1, %bb49 ]
  %fees.sroa.7.sroa.8.sroa.5.093 = phi i64 [ undef, %bb10 ], [ %fees.sroa.7.sroa.8.sroa.5.1, %bb49 ]
  %fees.sroa.7.sroa.8.sroa.0.092 = phi i64 [ undef, %bb10 ], [ %fees.sroa.7.sroa.8.sroa.0.1, %bb49 ]
  %fees.sroa.7.sroa.6.091 = phi i16 [ undef, %bb10 ], [ %fees.sroa.7.sroa.6.1, %bb49 ]
  %fees.sroa.7.sroa.5.090 = phi i64 [ undef, %bb10 ], [ %fees.sroa.7.sroa.5.1, %bb49 ]
  %fees.sroa.7.sroa.0.089 = phi i64 [ undef, %bb10 ], [ %fees.sroa.7.sroa.0.1, %bb49 ]
  %_19 = icmp ult i64 %new_len.i2397, 2
  br i1 %_19, label %bb13, label %bb35

bb13:                                             ; preds = %bb33
  store i64 %fees.sroa.0.096, ptr %_0, align 8
  %_21.sroa.4.0._0.sroa_idx = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %fees.sroa.7.sroa.0.089, ptr %_21.sroa.4.0._0.sroa_idx, align 8
  %_21.sroa.4.sroa.4.0._21.sroa.4.0._0.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_0, i64 16
  store i64 %fees.sroa.7.sroa.5.090, ptr %_21.sroa.4.sroa.4.0._21.sroa.4.0._0.sroa_idx.sroa_idx, align 8
  %_21.sroa.4.sroa.5.0._21.sroa.4.0._0.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_0, i64 24
  store i16 %fees.sroa.7.sroa.6.091, ptr %_21.sroa.4.sroa.5.0._21.sroa.4.0._0.sroa_idx.sroa_idx, align 8
  %_21.sroa.4.sroa.7.0._21.sroa.4.0._0.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_0, i64 32
  store i64 %fees.sroa.7.sroa.8.sroa.0.092, ptr %_21.sroa.4.sroa.7.0._21.sroa.4.0._0.sroa_idx.sroa_idx, align 8
  %_21.sroa.4.sroa.7.sroa.4.0._21.sroa.4.sroa.7.0._21.sroa.4.0._0.sroa_idx.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_0, i64 40
  store i64 %fees.sroa.7.sroa.8.sroa.5.093, ptr %_21.sroa.4.sroa.7.sroa.4.0._21.sroa.4.sroa.7.0._21.sroa.4.0._0.sroa_idx.sroa_idx.sroa_idx, align 8
  %_21.sroa.4.sroa.7.sroa.5.0._21.sroa.4.sroa.7.0._21.sroa.4.0._0.sroa_idx.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_0, i64 48
  store i16 %fees.sroa.7.sroa.8.sroa.6.094, ptr %_21.sroa.4.sroa.7.sroa.5.0._21.sroa.4.sroa.7.0._21.sroa.4.0._0.sroa_idx.sroa_idx.sroa_idx, align 8
  br label %bb28

bb35:                                             ; preds = %bb33
  %_73.sroa.0.0.copyload = load i16, ptr %data.i2498, align 1
  %3 = icmp eq i16 %_73.sroa.0.0.copyload, 0
  br i1 %3, label %bb15, label %bb16

bb15:                                             ; preds = %bb35
  store i64 %fees.sroa.0.096, ptr %_0, align 8
  %_26.sroa.4.0._0.sroa_idx = getelementptr inbounds i8, ptr %_0, i64 8
  store i64 %fees.sroa.7.sroa.0.089, ptr %_26.sroa.4.0._0.sroa_idx, align 8
  %_26.sroa.4.sroa.4.0._26.sroa.4.0._0.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_0, i64 16
  store i64 %fees.sroa.7.sroa.5.090, ptr %_26.sroa.4.sroa.4.0._26.sroa.4.0._0.sroa_idx.sroa_idx, align 8
  %_26.sroa.4.sroa.5.0._26.sroa.4.0._0.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_0, i64 24
  store i16 %fees.sroa.7.sroa.6.091, ptr %_26.sroa.4.sroa.5.0._26.sroa.4.0._0.sroa_idx.sroa_idx, align 8
  %_26.sroa.4.sroa.7.0._26.sroa.4.0._0.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_0, i64 32
  store i64 %fees.sroa.7.sroa.8.sroa.0.092, ptr %_26.sroa.4.sroa.7.0._26.sroa.4.0._0.sroa_idx.sroa_idx, align 8
  %_26.sroa.4.sroa.7.sroa.4.0._26.sroa.4.sroa.7.0._26.sroa.4.0._0.sroa_idx.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_0, i64 40
  store i64 %fees.sroa.7.sroa.8.sroa.5.093, ptr %_26.sroa.4.sroa.7.sroa.4.0._26.sroa.4.sroa.7.0._26.sroa.4.0._0.sroa_idx.sroa_idx.sroa_idx, align 8
  %_26.sroa.4.sroa.7.sroa.5.0._26.sroa.4.sroa.7.0._26.sroa.4.0._0.sroa_idx.sroa_idx.sroa_idx = getelementptr inbounds i8, ptr %_0, i64 48
  store i16 %fees.sroa.7.sroa.8.sroa.6.094, ptr %_26.sroa.4.sroa.7.sroa.5.0._26.sroa.4.sroa.7.0._26.sroa.4.0._0.sroa_idx.sroa_idx.sroa_idx, align 8
  br label %bb28

bb16:                                             ; preds = %bb35
  %_27 = icmp ult i64 %new_len.i2397, 4
  br i1 %_27, label %bb17, label %bb38

bb17:                                             ; preds = %bb16
  store i64 2, ptr %_0, align 8
  br label %bb28

bb38:                                             ; preds = %bb16
  %data.i11 = getelementptr inbounds i8, ptr %data.i2498, i64 2
  %_83.sroa.0.0.copyload = load i16, ptr %data.i11, align 1
  %length = zext i16 %_83.sroa.0.0.copyload to i64
  %4 = add nuw nsw i64 %length, 4
  %_6.i = icmp ugt i64 %4, %new_len.i2397
  br i1 %_6.i, label %bb41, label %bb42

bb41:                                             ; preds = %bb38
  store i64 2, ptr %_0, align 8
  br label %bb28

bb42:                                             ; preds = %bb38
  %5 = icmp eq i16 %_73.sroa.0.0.copyload, 1
  br i1 %5, label %bb20, label %bb26

bb20:                                             ; preds = %bb42
  %switch = icmp eq i64 %fees.sroa.0.096, 1
  %_40 = icmp ult i16 %_83.sroa.0.0.copyload, 108
  %or.cond = or i1 %switch, %_40
  br i1 %or.cond, label %bb21, label %"_ZN19native_transfer_fee20decode_transfer_fees28_$u7b$$u7b$closure$u7d$$u7d$17h1e51aa3c84d78dc7E.exit"

bb21:                                             ; preds = %bb20
  store i64 2, ptr %_0, align 8
  br label %bb28

"_ZN19native_transfer_fee20decode_transfer_fees28_$u7b$$u7b$closure$u7d$$u7d$17h1e51aa3c84d78dc7E.exit": ; preds = %bb20
  %data.i7 = getelementptr inbounds i8, ptr %data.i2498, i64 76
  %_19.sroa.0.0.copyload.i = load i64, ptr %data.i7, align 1, !alias.scope !6, !noalias !9
  %data.i2.i = getelementptr inbounds i8, ptr %data.i2498, i64 84
  %_29.sroa.0.0.copyload.i = load i64, ptr %data.i2.i, align 1, !alias.scope !6, !noalias !9
  %data.i.i = getelementptr inbounds i8, ptr %data.i2498, i64 92
  %_39.sroa.0.0.copyload.i = load i16, ptr %data.i.i, align 1, !alias.scope !6, !noalias !9
  %data.i = getelementptr inbounds i8, ptr %data.i2498, i64 94
  %_19.sroa.0.0.copyload.i29 = load i64, ptr %data.i, align 1, !alias.scope !11, !noalias !14
  %data.i2.i33 = getelementptr inbounds i8, ptr %data.i2498, i64 102
  %_29.sroa.0.0.copyload.i34 = load i64, ptr %data.i2.i33, align 1, !alias.scope !11, !noalias !14
  %data.i.i35 = getelementptr inbounds i8, ptr %data.i2498, i64 110
  %_39.sroa.0.0.copyload.i36 = load i16, ptr %data.i.i35, align 1, !alias.scope !11, !noalias !14
  br label %bb26

bb26:                                             ; preds = %bb42, %"_ZN19native_transfer_fee20decode_transfer_fees28_$u7b$$u7b$closure$u7d$$u7d$17h1e51aa3c84d78dc7E.exit"
  %fees.sroa.7.sroa.0.1 = phi i64 [ %_19.sroa.0.0.copyload.i, %"_ZN19native_transfer_fee20decode_transfer_fees28_$u7b$$u7b$closure$u7d$$u7d$17h1e51aa3c84d78dc7E.exit" ], [ %fees.sroa.7.sroa.0.089, %bb42 ]
  %fees.sroa.7.sroa.5.1 = phi i64 [ %_29.sroa.0.0.copyload.i, %"_ZN19native_transfer_fee20decode_transfer_fees28_$u7b$$u7b$closure$u7d$$u7d$17h1e51aa3c84d78dc7E.exit" ], [ %fees.sroa.7.sroa.5.090, %bb42 ]
  %fees.sroa.7.sroa.6.1 = phi i16 [ %_39.sroa.0.0.copyload.i, %"_ZN19native_transfer_fee20decode_transfer_fees28_$u7b$$u7b$closure$u7d$$u7d$17h1e51aa3c84d78dc7E.exit" ], [ %fees.sroa.7.sroa.6.091, %bb42 ]
  %fees.sroa.7.sroa.8.sroa.0.1 = phi i64 [ %_19.sroa.0.0.copyload.i29, %"_ZN19native_transfer_fee20decode_transfer_fees28_$u7b$$u7b$closure$u7d$$u7d$17h1e51aa3c84d78dc7E.exit" ], [ %fees.sroa.7.sroa.8.sroa.0.092, %bb42 ]
  %fees.sroa.7.sroa.8.sroa.5.1 = phi i64 [ %_29.sroa.0.0.copyload.i34, %"_ZN19native_transfer_fee20decode_transfer_fees28_$u7b$$u7b$closure$u7d$$u7d$17h1e51aa3c84d78dc7E.exit" ], [ %fees.sroa.7.sroa.8.sroa.5.093, %bb42 ]
  %fees.sroa.7.sroa.8.sroa.6.1 = phi i16 [ %_39.sroa.0.0.copyload.i36, %"_ZN19native_transfer_fee20decode_transfer_fees28_$u7b$$u7b$closure$u7d$$u7d$17h1e51aa3c84d78dc7E.exit" ], [ %fees.sroa.7.sroa.8.sroa.6.094, %bb42 ]
  %fees.sroa.0.1 = phi i64 [ 1, %"_ZN19native_transfer_fee20decode_transfer_fees28_$u7b$$u7b$closure$u7d$$u7d$17h1e51aa3c84d78dc7E.exit" ], [ %fees.sroa.0.096, %bb42 ]
  %6 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %offset.sroa.0.095, i64 %4)
  %_96.1 = extractvalue { i64, i1 } %6, 1
  br i1 %_96.1, label %bb48, label %bb49

bb49:                                             ; preds = %bb26
  %_96.0 = extractvalue { i64, i1 } %6, 0
  %_3.i = icmp ugt i64 %_96.0, %new_len.i
  %new_len.i23 = sub nuw i64 %new_len.i, %_96.0
  %data.i24 = getelementptr inbounds i8, ptr %data.i22, i64 %_96.0
  br i1 %_3.i, label %bb32, label %bb33

bb48:                                             ; preds = %bb26
  store i64 2, ptr %_0, align 8
  br label %bb28
}

; native_transfer_fee::supported_mint_data
; Function Attrs: nofree norecurse nosync nounwind memory(read, inaccessiblemem: none)
define hidden noundef zeroext i1 @_ZN19native_transfer_fee19supported_mint_data17h9252bc5a9a60970eE(ptr noalias nocapture noundef nonnull readonly align 1 %data.0, i64 noundef %data.1, i1 noundef zeroext %allow_extensions) unnamed_addr #2 {
start:
  %0 = icmp eq i64 %data.1, 82
  br i1 %0, label %bb54, label %bb2

bb2:                                              ; preds = %start
  %_4 = icmp ult i64 %data.1, 167
  br i1 %_4, label %bb54, label %bb1.i

bb54:                                             ; preds = %bb3.i17, %bb51, %bb45, %bb39, %bb41, %bb36, %bb33, %bb28, %bb30, %bb62, %bb19, %bb59, %bb15, %bb67, %bb1.i23.preheader, %bb1.i23.1, %bb1.i23.2, %bb1.i23.3, %bb1.i23.4, %bb1.i23.5, %bb1.i23.6, %bb1.i23.7, %bb1.i23.8, %bb1.i23.9, %bb1.i23.10, %bb1.i23.11, %bb1.i23.12, %bb1.i23.13, %bb1.i23.14, %bb1.i23.15, %bb1.i23.16, %bb1.i23.17, %bb1.i23.18, %bb1.i23.19, %bb1.i23.20, %bb1.i23.21, %bb1.i23.22, %bb1.i23.23, %bb1.i23.24, %bb1.i23.25, %bb1.i23.26, %bb1.i23.27, %bb1.i23.28, %bb1.i23.29, %bb1.i23.30, %bb1.i23.31, %bb8, %bb2, %start
  %_0.sroa.0.0.off0 = phi i1 [ true, %start ], [ false, %bb2 ], [ false, %bb8 ], [ false, %bb51 ], [ false, %bb45 ], [ false, %bb39 ], [ false, %bb41 ], [ false, %bb36 ], [ false, %bb33 ], [ false, %bb28 ], [ false, %bb30 ], [ false, %bb62 ], [ false, %bb19 ], [ true, %bb59 ], [ true, %bb15 ], [ false, %bb67 ], [ false, %bb1.i23.preheader ], [ false, %bb1.i23.1 ], [ false, %bb1.i23.2 ], [ false, %bb1.i23.3 ], [ false, %bb1.i23.4 ], [ false, %bb1.i23.5 ], [ false, %bb1.i23.6 ], [ false, %bb1.i23.7 ], [ false, %bb1.i23.8 ], [ false, %bb1.i23.9 ], [ false, %bb1.i23.10 ], [ false, %bb1.i23.11 ], [ false, %bb1.i23.12 ], [ false, %bb1.i23.13 ], [ false, %bb1.i23.14 ], [ false, %bb1.i23.15 ], [ false, %bb1.i23.16 ], [ false, %bb1.i23.17 ], [ false, %bb1.i23.18 ], [ false, %bb1.i23.19 ], [ false, %bb1.i23.20 ], [ false, %bb1.i23.21 ], [ false, %bb1.i23.22 ], [ false, %bb1.i23.23 ], [ false, %bb1.i23.24 ], [ false, %bb1.i23.25 ], [ false, %bb1.i23.26 ], [ false, %bb1.i23.27 ], [ false, %bb1.i23.28 ], [ false, %bb1.i23.29 ], [ false, %bb1.i23.30 ], [ false, %bb1.i23.31 ], [ false, %bb3.i17 ]
  ret i1 %_0.sroa.0.0.off0

bb1.i:                                            ; preds = %bb2, %bb3.i17
  %_13.i.i2.i.idx = phi i64 [ %_13.i.i2.i.add, %bb3.i17 ], [ 82, %bb2 ]
  %.not.i.not = icmp eq i64 %_13.i.i2.i.idx, 165
  br i1 %.not.i.not, label %bb8, label %bb3.i17

bb3.i17:                                          ; preds = %bb1.i
  %_13.i.i2.i.ptr = getelementptr inbounds i8, ptr %data.0, i64 %_13.i.i2.i.idx
  %_13.i.i2.i.add = add nuw nsw i64 %_13.i.i2.i.idx, 1
  %.val.i = load i8, ptr %_13.i.i2.i.ptr, align 1, !noalias !16, !noundef !2
  %_0.i.not.i = icmp eq i8 %.val.i, 0
  br i1 %_0.i.not.i, label %bb1.i, label %bb54

bb8:                                              ; preds = %bb1.i
  %1 = getelementptr inbounds [0 x i8], ptr %data.0, i64 0, i64 165
  %_9 = load i8, ptr %1, align 1, !noundef !2
  %2 = icmp eq i8 %_9, 1
  br i1 %2, label %bb11, label %bb54

bb11:                                             ; preds = %bb8
  %new_len.i = add i64 %data.1, -166
  %data.i18 = getelementptr inbounds i8, ptr %data.0, i64 166
  br label %bb15

bb15:                                             ; preds = %bb11, %bb67
  %data.i2038 = phi ptr [ %data.i18, %bb11 ], [ %data.i20, %bb67 ]
  %new_len.i1937 = phi i64 [ %new_len.i, %bb11 ], [ %new_len.i19, %bb67 ]
  %offset.sroa.0.036 = phi i64 [ 0, %bb11 ], [ %_90.0, %bb67 ]
  %seen.sroa.0.035 = phi i64 [ 0, %bb11 ], [ %13, %bb67 ]
  %_18 = icmp ult i64 %new_len.i1937, 2
  br i1 %_18, label %bb54, label %bb59

bb59:                                             ; preds = %bb15
  %_64.sroa.0.0.copyload = load i16, ptr %data.i2038, align 1
  %3 = icmp eq i16 %_64.sroa.0.0.copyload, 0
  br i1 %3, label %bb54, label %bb19

bb19:                                             ; preds = %bb59
  %_24 = icmp ult i64 %new_len.i1937, 4
  br i1 %_24, label %bb54, label %bb62

bb62:                                             ; preds = %bb19
  %data.i7 = getelementptr inbounds i8, ptr %data.i2038, i64 2
  %_74.sroa.0.0.copyload = load i16, ptr %data.i7, align 1
  %length = zext i16 %_74.sroa.0.0.copyload to i64
  %4 = add nuw nsw i64 %length, 4
  %_32 = icmp ugt i64 %4, %new_len.i1937
  %_33 = icmp ugt i16 %_64.sroa.0.0.copyload, 26
  %or.cond = or i1 %_33, %_32
  br i1 %or.cond, label %bb54, label %bb27

bb27:                                             ; preds = %bb62
  %5 = zext nneg i16 %_64.sroa.0.0.copyload to i64
  %bit = shl nuw nsw i64 1, %5
  %_36 = and i64 %bit, 100749394
  %6 = icmp eq i64 %_36, 0
  br i1 %6, label %bb30, label %bb28

bb30:                                             ; preds = %bb27
  %_37 = and i64 %bit, 786432
  %7 = icmp eq i64 %_37, 0
  br i1 %7, label %bb54, label %bb33

bb28:                                             ; preds = %bb27
  br i1 %allow_extensions, label %bb33, label %bb54

bb33:                                             ; preds = %bb30, %bb28
  %_38 = and i64 %bit, %seen.sroa.0.035
  %8 = icmp eq i64 %_38, 0
  br i1 %8, label %bb35, label %bb54

bb35:                                             ; preds = %bb33
  switch i16 %_64.sroa.0.0.copyload, label %bb51 [
    i16 1, label %bb36
    i16 6, label %bb39
    i16 14, label %bb45
  ]

bb51:                                             ; preds = %bb1.i23.31, %bb41, %bb36, %bb35
  %9 = tail call { i64, i1 } @llvm.uadd.with.overflow.i64(i64 %offset.sroa.0.036, i64 %4)
  %_90.1 = extractvalue { i64, i1 } %9, 1
  br i1 %_90.1, label %bb54, label %bb67

bb36:                                             ; preds = %bb35
  %_40 = icmp ult i16 %_74.sroa.0.0.copyload, 108
  br i1 %_40, label %bb54, label %bb51

bb39:                                             ; preds = %bb35
  %10 = icmp eq i16 %_74.sroa.0.0.copyload, 0
  br i1 %10, label %bb54, label %bb41

bb45:                                             ; preds = %bb35
  %_43 = icmp ult i16 %_74.sroa.0.0.copyload, 64
  br i1 %_43, label %bb54, label %bb1.i23.preheader

bb1.i23.preheader:                                ; preds = %bb45
  %_13.i.i2.i24.ptr = getelementptr inbounds i8, ptr %data.i2038, i64 36
  %.val.i28 = load i8, ptr %_13.i.i2.i24.ptr, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29 = icmp eq i8 %.val.i28, 0
  br i1 %_0.i.not.i29, label %bb1.i23.1, label %bb54

bb41:                                             ; preds = %bb39
  %11 = getelementptr inbounds [0 x i8], ptr %data.i2038, i64 0, i64 4
  %_41 = load i8, ptr %11, align 1, !noundef !2
  %12 = icmp eq i8 %_41, 1
  br i1 %12, label %bb51, label %bb54

bb1.i23.1:                                        ; preds = %bb1.i23.preheader
  %_13.i.i2.i24.ptr.1 = getelementptr inbounds i8, ptr %data.i2038, i64 37
  %.val.i28.1 = load i8, ptr %_13.i.i2.i24.ptr.1, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.1 = icmp eq i8 %.val.i28.1, 0
  br i1 %_0.i.not.i29.1, label %bb1.i23.2, label %bb54

bb1.i23.2:                                        ; preds = %bb1.i23.1
  %_13.i.i2.i24.ptr.2 = getelementptr inbounds i8, ptr %data.i2038, i64 38
  %.val.i28.2 = load i8, ptr %_13.i.i2.i24.ptr.2, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.2 = icmp eq i8 %.val.i28.2, 0
  br i1 %_0.i.not.i29.2, label %bb1.i23.3, label %bb54

bb1.i23.3:                                        ; preds = %bb1.i23.2
  %_13.i.i2.i24.ptr.3 = getelementptr inbounds i8, ptr %data.i2038, i64 39
  %.val.i28.3 = load i8, ptr %_13.i.i2.i24.ptr.3, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.3 = icmp eq i8 %.val.i28.3, 0
  br i1 %_0.i.not.i29.3, label %bb1.i23.4, label %bb54

bb1.i23.4:                                        ; preds = %bb1.i23.3
  %_13.i.i2.i24.ptr.4 = getelementptr inbounds i8, ptr %data.i2038, i64 40
  %.val.i28.4 = load i8, ptr %_13.i.i2.i24.ptr.4, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.4 = icmp eq i8 %.val.i28.4, 0
  br i1 %_0.i.not.i29.4, label %bb1.i23.5, label %bb54

bb1.i23.5:                                        ; preds = %bb1.i23.4
  %_13.i.i2.i24.ptr.5 = getelementptr inbounds i8, ptr %data.i2038, i64 41
  %.val.i28.5 = load i8, ptr %_13.i.i2.i24.ptr.5, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.5 = icmp eq i8 %.val.i28.5, 0
  br i1 %_0.i.not.i29.5, label %bb1.i23.6, label %bb54

bb1.i23.6:                                        ; preds = %bb1.i23.5
  %_13.i.i2.i24.ptr.6 = getelementptr inbounds i8, ptr %data.i2038, i64 42
  %.val.i28.6 = load i8, ptr %_13.i.i2.i24.ptr.6, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.6 = icmp eq i8 %.val.i28.6, 0
  br i1 %_0.i.not.i29.6, label %bb1.i23.7, label %bb54

bb1.i23.7:                                        ; preds = %bb1.i23.6
  %_13.i.i2.i24.ptr.7 = getelementptr inbounds i8, ptr %data.i2038, i64 43
  %.val.i28.7 = load i8, ptr %_13.i.i2.i24.ptr.7, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.7 = icmp eq i8 %.val.i28.7, 0
  br i1 %_0.i.not.i29.7, label %bb1.i23.8, label %bb54

bb1.i23.8:                                        ; preds = %bb1.i23.7
  %_13.i.i2.i24.ptr.8 = getelementptr inbounds i8, ptr %data.i2038, i64 44
  %.val.i28.8 = load i8, ptr %_13.i.i2.i24.ptr.8, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.8 = icmp eq i8 %.val.i28.8, 0
  br i1 %_0.i.not.i29.8, label %bb1.i23.9, label %bb54

bb1.i23.9:                                        ; preds = %bb1.i23.8
  %_13.i.i2.i24.ptr.9 = getelementptr inbounds i8, ptr %data.i2038, i64 45
  %.val.i28.9 = load i8, ptr %_13.i.i2.i24.ptr.9, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.9 = icmp eq i8 %.val.i28.9, 0
  br i1 %_0.i.not.i29.9, label %bb1.i23.10, label %bb54

bb1.i23.10:                                       ; preds = %bb1.i23.9
  %_13.i.i2.i24.ptr.10 = getelementptr inbounds i8, ptr %data.i2038, i64 46
  %.val.i28.10 = load i8, ptr %_13.i.i2.i24.ptr.10, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.10 = icmp eq i8 %.val.i28.10, 0
  br i1 %_0.i.not.i29.10, label %bb1.i23.11, label %bb54

bb1.i23.11:                                       ; preds = %bb1.i23.10
  %_13.i.i2.i24.ptr.11 = getelementptr inbounds i8, ptr %data.i2038, i64 47
  %.val.i28.11 = load i8, ptr %_13.i.i2.i24.ptr.11, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.11 = icmp eq i8 %.val.i28.11, 0
  br i1 %_0.i.not.i29.11, label %bb1.i23.12, label %bb54

bb1.i23.12:                                       ; preds = %bb1.i23.11
  %_13.i.i2.i24.ptr.12 = getelementptr inbounds i8, ptr %data.i2038, i64 48
  %.val.i28.12 = load i8, ptr %_13.i.i2.i24.ptr.12, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.12 = icmp eq i8 %.val.i28.12, 0
  br i1 %_0.i.not.i29.12, label %bb1.i23.13, label %bb54

bb1.i23.13:                                       ; preds = %bb1.i23.12
  %_13.i.i2.i24.ptr.13 = getelementptr inbounds i8, ptr %data.i2038, i64 49
  %.val.i28.13 = load i8, ptr %_13.i.i2.i24.ptr.13, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.13 = icmp eq i8 %.val.i28.13, 0
  br i1 %_0.i.not.i29.13, label %bb1.i23.14, label %bb54

bb1.i23.14:                                       ; preds = %bb1.i23.13
  %_13.i.i2.i24.ptr.14 = getelementptr inbounds i8, ptr %data.i2038, i64 50
  %.val.i28.14 = load i8, ptr %_13.i.i2.i24.ptr.14, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.14 = icmp eq i8 %.val.i28.14, 0
  br i1 %_0.i.not.i29.14, label %bb1.i23.15, label %bb54

bb1.i23.15:                                       ; preds = %bb1.i23.14
  %_13.i.i2.i24.ptr.15 = getelementptr inbounds i8, ptr %data.i2038, i64 51
  %.val.i28.15 = load i8, ptr %_13.i.i2.i24.ptr.15, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.15 = icmp eq i8 %.val.i28.15, 0
  br i1 %_0.i.not.i29.15, label %bb1.i23.16, label %bb54

bb1.i23.16:                                       ; preds = %bb1.i23.15
  %_13.i.i2.i24.ptr.16 = getelementptr inbounds i8, ptr %data.i2038, i64 52
  %.val.i28.16 = load i8, ptr %_13.i.i2.i24.ptr.16, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.16 = icmp eq i8 %.val.i28.16, 0
  br i1 %_0.i.not.i29.16, label %bb1.i23.17, label %bb54

bb1.i23.17:                                       ; preds = %bb1.i23.16
  %_13.i.i2.i24.ptr.17 = getelementptr inbounds i8, ptr %data.i2038, i64 53
  %.val.i28.17 = load i8, ptr %_13.i.i2.i24.ptr.17, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.17 = icmp eq i8 %.val.i28.17, 0
  br i1 %_0.i.not.i29.17, label %bb1.i23.18, label %bb54

bb1.i23.18:                                       ; preds = %bb1.i23.17
  %_13.i.i2.i24.ptr.18 = getelementptr inbounds i8, ptr %data.i2038, i64 54
  %.val.i28.18 = load i8, ptr %_13.i.i2.i24.ptr.18, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.18 = icmp eq i8 %.val.i28.18, 0
  br i1 %_0.i.not.i29.18, label %bb1.i23.19, label %bb54

bb1.i23.19:                                       ; preds = %bb1.i23.18
  %_13.i.i2.i24.ptr.19 = getelementptr inbounds i8, ptr %data.i2038, i64 55
  %.val.i28.19 = load i8, ptr %_13.i.i2.i24.ptr.19, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.19 = icmp eq i8 %.val.i28.19, 0
  br i1 %_0.i.not.i29.19, label %bb1.i23.20, label %bb54

bb1.i23.20:                                       ; preds = %bb1.i23.19
  %_13.i.i2.i24.ptr.20 = getelementptr inbounds i8, ptr %data.i2038, i64 56
  %.val.i28.20 = load i8, ptr %_13.i.i2.i24.ptr.20, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.20 = icmp eq i8 %.val.i28.20, 0
  br i1 %_0.i.not.i29.20, label %bb1.i23.21, label %bb54

bb1.i23.21:                                       ; preds = %bb1.i23.20
  %_13.i.i2.i24.ptr.21 = getelementptr inbounds i8, ptr %data.i2038, i64 57
  %.val.i28.21 = load i8, ptr %_13.i.i2.i24.ptr.21, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.21 = icmp eq i8 %.val.i28.21, 0
  br i1 %_0.i.not.i29.21, label %bb1.i23.22, label %bb54

bb1.i23.22:                                       ; preds = %bb1.i23.21
  %_13.i.i2.i24.ptr.22 = getelementptr inbounds i8, ptr %data.i2038, i64 58
  %.val.i28.22 = load i8, ptr %_13.i.i2.i24.ptr.22, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.22 = icmp eq i8 %.val.i28.22, 0
  br i1 %_0.i.not.i29.22, label %bb1.i23.23, label %bb54

bb1.i23.23:                                       ; preds = %bb1.i23.22
  %_13.i.i2.i24.ptr.23 = getelementptr inbounds i8, ptr %data.i2038, i64 59
  %.val.i28.23 = load i8, ptr %_13.i.i2.i24.ptr.23, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.23 = icmp eq i8 %.val.i28.23, 0
  br i1 %_0.i.not.i29.23, label %bb1.i23.24, label %bb54

bb1.i23.24:                                       ; preds = %bb1.i23.23
  %_13.i.i2.i24.ptr.24 = getelementptr inbounds i8, ptr %data.i2038, i64 60
  %.val.i28.24 = load i8, ptr %_13.i.i2.i24.ptr.24, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.24 = icmp eq i8 %.val.i28.24, 0
  br i1 %_0.i.not.i29.24, label %bb1.i23.25, label %bb54

bb1.i23.25:                                       ; preds = %bb1.i23.24
  %_13.i.i2.i24.ptr.25 = getelementptr inbounds i8, ptr %data.i2038, i64 61
  %.val.i28.25 = load i8, ptr %_13.i.i2.i24.ptr.25, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.25 = icmp eq i8 %.val.i28.25, 0
  br i1 %_0.i.not.i29.25, label %bb1.i23.26, label %bb54

bb1.i23.26:                                       ; preds = %bb1.i23.25
  %_13.i.i2.i24.ptr.26 = getelementptr inbounds i8, ptr %data.i2038, i64 62
  %.val.i28.26 = load i8, ptr %_13.i.i2.i24.ptr.26, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.26 = icmp eq i8 %.val.i28.26, 0
  br i1 %_0.i.not.i29.26, label %bb1.i23.27, label %bb54

bb1.i23.27:                                       ; preds = %bb1.i23.26
  %_13.i.i2.i24.ptr.27 = getelementptr inbounds i8, ptr %data.i2038, i64 63
  %.val.i28.27 = load i8, ptr %_13.i.i2.i24.ptr.27, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.27 = icmp eq i8 %.val.i28.27, 0
  br i1 %_0.i.not.i29.27, label %bb1.i23.28, label %bb54

bb1.i23.28:                                       ; preds = %bb1.i23.27
  %_13.i.i2.i24.ptr.28 = getelementptr inbounds i8, ptr %data.i2038, i64 64
  %.val.i28.28 = load i8, ptr %_13.i.i2.i24.ptr.28, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.28 = icmp eq i8 %.val.i28.28, 0
  br i1 %_0.i.not.i29.28, label %bb1.i23.29, label %bb54

bb1.i23.29:                                       ; preds = %bb1.i23.28
  %_13.i.i2.i24.ptr.29 = getelementptr inbounds i8, ptr %data.i2038, i64 65
  %.val.i28.29 = load i8, ptr %_13.i.i2.i24.ptr.29, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.29 = icmp eq i8 %.val.i28.29, 0
  br i1 %_0.i.not.i29.29, label %bb1.i23.30, label %bb54

bb1.i23.30:                                       ; preds = %bb1.i23.29
  %_13.i.i2.i24.ptr.30 = getelementptr inbounds i8, ptr %data.i2038, i64 66
  %.val.i28.30 = load i8, ptr %_13.i.i2.i24.ptr.30, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.30 = icmp eq i8 %.val.i28.30, 0
  br i1 %_0.i.not.i29.30, label %bb1.i23.31, label %bb54

bb1.i23.31:                                       ; preds = %bb1.i23.30
  %_13.i.i2.i24.ptr.31 = getelementptr inbounds i8, ptr %data.i2038, i64 67
  %.val.i28.31 = load i8, ptr %_13.i.i2.i24.ptr.31, align 1, !noalias !19, !noundef !2
  %_0.i.not.i29.31 = icmp eq i8 %.val.i28.31, 0
  br i1 %_0.i.not.i29.31, label %bb51, label %bb54

bb67:                                             ; preds = %bb51
  %_90.0 = extractvalue { i64, i1 } %9, 0
  %13 = or i64 %bit, %seen.sroa.0.035
  %_3.i = icmp ugt i64 %_90.0, %new_len.i
  %new_len.i19 = sub nuw i64 %new_len.i, %_90.0
  %data.i20 = getelementptr inbounds i8, ptr %data.i18, i64 %_90.0
  br i1 %_3.i, label %bb54, label %bb15
}

; Function Attrs: mustprogress nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare hidden { i64, i1 } @llvm.uadd.with.overflow.i64(i64, i64) #3

; Function Attrs: nocallback nofree nosync nounwind speculatable willreturn memory(none)
declare i64 @llvm.umin.i64(i64, i64) #4

attributes #0 = { mustprogress nofree norecurse nosync nounwind willreturn memory(argmem: read) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #1 = { nofree norecurse nosync nounwind memory(read, argmem: readwrite, inaccessiblemem: none) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #2 = { nofree norecurse nosync nounwind memory(read, inaccessiblemem: none) "target-cpu"="generic" "target-features"="+store-imm,+jmp-ext" }
attributes #3 = { mustprogress nocallback nofree nosync nounwind speculatable willreturn memory(none) }
attributes #4 = { nocallback nofree nosync nounwind speculatable willreturn memory(none) }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 8, !"PIC Level", i32 2}
!1 = !{!"rustc version 1.79.0-dev"}
!2 = !{}
!3 = !{!4}
!4 = distinct !{!4, !5, !"_ZN91_$LT$core..slice..iter..Iter$LT$T$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$3any17haaef4174c871c780E: %self"}
!5 = distinct !{!5, !"_ZN91_$LT$core..slice..iter..Iter$LT$T$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$3any17haaef4174c871c780E"}
!6 = !{!7}
!7 = distinct !{!7, !8, !"_ZN19native_transfer_fee20decode_transfer_fees28_$u7b$$u7b$closure$u7d$$u7d$17h1e51aa3c84d78dc7E: %bytes.0"}
!8 = distinct !{!8, !"_ZN19native_transfer_fee20decode_transfer_fees28_$u7b$$u7b$closure$u7d$$u7d$17h1e51aa3c84d78dc7E"}
!9 = !{!10}
!10 = distinct !{!10, !8, !"_ZN19native_transfer_fee20decode_transfer_fees28_$u7b$$u7b$closure$u7d$$u7d$17h1e51aa3c84d78dc7E: %_0"}
!11 = !{!12}
!12 = distinct !{!12, !13, !"_ZN19native_transfer_fee20decode_transfer_fees28_$u7b$$u7b$closure$u7d$$u7d$17h1e51aa3c84d78dc7E: %bytes.0"}
!13 = distinct !{!13, !"_ZN19native_transfer_fee20decode_transfer_fees28_$u7b$$u7b$closure$u7d$$u7d$17h1e51aa3c84d78dc7E"}
!14 = !{!15}
!15 = distinct !{!15, !13, !"_ZN19native_transfer_fee20decode_transfer_fees28_$u7b$$u7b$closure$u7d$$u7d$17h1e51aa3c84d78dc7E: %_0"}
!16 = !{!17}
!17 = distinct !{!17, !18, !"_ZN91_$LT$core..slice..iter..Iter$LT$T$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$3any17ha4f28c28359451edE: %self"}
!18 = distinct !{!18, !"_ZN91_$LT$core..slice..iter..Iter$LT$T$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$3any17ha4f28c28359451edE"}
!19 = !{!20}
!20 = distinct !{!20, !21, !"_ZN91_$LT$core..slice..iter..Iter$LT$T$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$3any17h8abbfe44e33c2cc3E: %self"}
!21 = distinct !{!21, !"_ZN91_$LT$core..slice..iter..Iter$LT$T$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$3any17h8abbfe44e33c2cc3E"}
