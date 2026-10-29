#![no_std]
#[derive(Clone, Copy, Debug)]
pub struct DecodedTransferFee {pub epoch:u64,pub maximum_fee:u64,pub transfer_fee_basis_points:u16}
#[no_mangle]
pub fn fee_amount_first(fee:&DecodedTransferFee, amount:u64)->Option<u64> {
    let bps=fee.transfer_fee_basis_points as u128;
    if amount==0 || bps==0 {Some(0)} else {
        let n=(amount as u128).checked_mul(bps)?;
        let raw=n.checked_add(10000)?.checked_sub(1)?.checked_div(10000)?.try_into().ok()?;
        Some(core::cmp::min(raw,fee.maximum_fee))
    }
}

#[no_mangle]
pub fn fee_amount_separate(fee:&DecodedTransferFee, amount:u64)->Option<u64> {
    if amount==0 { return Some(0); }
    let bps=fee.transfer_fee_basis_points as u128;
    if bps==0 {Some(0)} else {
        let n=(amount as u128).checked_mul(bps)?;
        let raw=n.checked_add(10000)?.checked_sub(1)?.checked_div(10000)?.try_into().ok()?;
        Some(core::cmp::min(raw,fee.maximum_fee))
    }
}

#[no_mangle]
pub fn inverse_delayed_max(fee:&DecodedTransferFee, amount:u64)->Option<u64> {
    let bps=fee.transfer_fee_basis_points as u128;
    match (bps,amount) {
        (0,_)=>Some(amount),(_,0)=>Some(0),(10000,_)=>fee.maximum_fee.checked_add(amount),
        _=>{let n=(amount as u128).checked_mul(10000)?;let d=10000u128.checked_sub(bps)?;let raw=n.checked_add(d)?.checked_sub(1)?.checked_div(d)?;
        if raw.checked_sub(amount as u128)? >= fee.maximum_fee as u128 {amount.checked_add(fee.maximum_fee)}else{u64::try_from(raw).ok()}}
    }
}
