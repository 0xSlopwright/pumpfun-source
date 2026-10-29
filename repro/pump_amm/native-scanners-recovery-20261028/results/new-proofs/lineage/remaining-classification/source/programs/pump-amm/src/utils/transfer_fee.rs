use crate::*;
pub use native_transfer_fee::DecodedTransferFee;
use native_transfer_fee::decode_transfer_fees;

pub type TransferFeeData = Option<DecodedTransferFee>;

pub fn from_mint(mint: &AccountInfo) -> Result<TransferFeeData> {
    if mint.owner != &anchor_spl::token_2022::ID {
        return const { Ok(None) };
    }
    let data = mint.try_borrow_data()?;
    let fees = decode_transfer_fees(&data)
        .map_err(|_| error!(PumpAmmError::UnsupportedQuoteMint))?;
    let epoch = Clock::get()?.epoch;
    Ok(fees.map(|(older, newer)| if epoch >= newer.epoch { newer } else { older }))
}

pub fn calculate_fee(data: &TransferFeeData, amount: u64) -> Result<u64> {
    match *data {
        None => Ok(0),
        Some(fee) => fee.calculate_fee(amount)
            .ok_or_else(|| error!(PumpAmmError::Overflow)),
    }
}

pub fn amount_after_fee(data: &TransferFeeData, amount: u64) -> Result<u64> {
    amount.checked_sub(calculate_fee(data, amount)?)
        .ok_or_else(|| error!(PumpAmmError::Overflow))
}

pub fn amount_before_fee(data: &TransferFeeData, amount: u64) -> Result<u64> {
    match *data {
        None => Ok(amount),
        Some(fee) => fee.calculate_pre_fee_amount(amount)
            .ok_or_else(|| error!(PumpAmmError::Overflow)),
    }
}
