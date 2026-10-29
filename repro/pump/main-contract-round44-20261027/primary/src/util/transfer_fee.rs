use crate::*;
use crate::trade::native_transfer_fee::Fee;

#[inline(never)]
pub fn calculate_fee(fee:&Option<Fee>,amount:u64)->Result<u64>{
 match *fee {
  None=>Ok(0),
  Some(fee)=>fee.calculate_fee(amount).ok_or_else(||error!(PumpError::Overflow)),
 }
}

#[inline(never)]
pub fn post_fee_amount(fee:&Option<Fee>,amount:u64)->Result<u64>{
 let fee=calculate_fee(fee,amount)?;
 amount.checked_sub(fee).ok_or_else(||error!(PumpError::Overflow))
}

#[inline(never)]
pub fn pre_fee_amount(fee:&Option<Fee>,amount:u64)->Result<u64>{
 match *fee {
  None=>Ok(amount),
  Some(fee)=>fee.calculate_pre_fee_amount(amount).ok_or_else(||error!(PumpError::Overflow)),
 }
}

pub(crate) fn quote_fee_snapshot(mint:&AccountInfo)->Result<Option<(u64,u64,u64)>>{
    use anchor_spl::token_2022::spl_token_2022::{extension::{BaseStateWithExtensions,ExtensionType,StateWithExtensions,transfer_fee::TransferFeeConfig},state::Mint as SplMint};
    if mint.owner==&anchor_spl::token::ID{return Ok(None);}
    let data=mint.try_borrow_data()?;
    let parsed=StateWithExtensions::<SplMint>::unpack(&data)?;
    // TLV tags are forward compatible. Validate every declared payload while
    // finding a single transfer-fee config, including across unknown tags.
    let tlv=parsed.get_tlv_data();
    let mut cursor=0usize;
    let mut selected=None;
    while cursor<tlv.len() {
        if tlv.len()-cursor<2 {break;}
        let tag=u16::from_le_bytes([tlv[cursor],tlv[cursor+1]]);
        if tag==0 {break;}
        if tlv.len()-cursor<4 {return err!(PumpError::UnsupportedQuoteMint);}
        let length=u16::from_le_bytes([tlv[cursor+2],tlv[cursor+3]]) as usize;
        let begin=cursor+4;
        let end=begin.checked_add(length).ok_or_else(||error!(PumpError::UnsupportedQuoteMint))?;
        let value=tlv.get(begin..end).ok_or_else(||error!(PumpError::UnsupportedQuoteMint))?;
        if tag==ExtensionType::TransferFeeConfig as u16 {
            if selected.is_some() {return err!(PumpError::UnsupportedQuoteMint);}
            let prefix=value.get(..std::mem::size_of::<TransferFeeConfig>())
                .ok_or_else(||error!(PumpError::UnsupportedQuoteMint))?;
            selected=Some(anchor_lang::__private::bytemuck::try_from_bytes::<TransferFeeConfig>(prefix)
                .map_err(|_|error!(PumpError::UnsupportedQuoteMint))?);
        }
        cursor=end;
    }
    Ok(match selected {
        Some(fees)=>{
            let epoch=Clock::get()?.epoch;
            let selected=fees.get_epoch_fee(epoch);
            Some((u64::from(selected.epoch),u64::from(selected.maximum_fee),u16::from(selected.transfer_fee_basis_points) as u64))
        }
        None=>None,
    })
}

