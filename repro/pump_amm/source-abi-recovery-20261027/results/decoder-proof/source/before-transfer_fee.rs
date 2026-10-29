use crate::*;
use anchor_spl::token_2022::spl_token_2022::{
    extension::{BaseStateWithExtensions, StateWithExtensions, transfer_fee::{TransferFee, TransferFeeConfig}},
    state::Mint as SplMint,
};

#[derive(Clone, Copy, Debug)]
pub struct DecodedTransferFee {
    pub epoch: u64,
    pub maximum_fee: u64,
    pub transfer_fee_basis_points: u16,
}

impl DecodedTransferFee {
    fn spl_fee(&self) -> TransferFee {
        TransferFee {
            epoch: self.epoch.into(),
            maximum_fee: self.maximum_fee.into(),
            transfer_fee_basis_points: self.transfer_fee_basis_points.into(),
        }
    }
}

pub type TransferFeeData = Option<DecodedTransferFee>;

pub fn from_mint(mint: &AccountInfo) -> Result<TransferFeeData> {
    if mint.owner != &anchor_spl::token_2022::ID {
        return Ok(None);
    }
    let data = mint.try_borrow_data()?;
    let mint = StateWithExtensions::<SplMint>::unpack(&data)
        .map_err(|_| error!(PumpAmmError::UnsupportedQuoteMint))?;
    let config = match mint.get_extension::<TransferFeeConfig>() {
        Ok(config) => config,
        Err(_) => return Ok(None),
    };
    let epoch = Clock::get()?.epoch;
    let fee = config.get_epoch_fee(epoch);
    Ok(Some(DecodedTransferFee {
        epoch: fee.epoch.into(),
        maximum_fee: fee.maximum_fee.into(),
        transfer_fee_basis_points: fee.transfer_fee_basis_points.into(),
    }))
}

pub fn calculate_fee(data: &TransferFeeData, amount: u64) -> Result<u64> {
    match data {
        None => Ok(0),
        Some(fee) => fee.spl_fee().calculate_fee(amount)
            .ok_or_else(|| error!(PumpAmmError::Overflow)),
    }
}

pub fn amount_after_fee(data: &TransferFeeData, amount: u64) -> Result<u64> {
    amount.checked_sub(calculate_fee(data, amount)?)
        .ok_or_else(|| error!(PumpAmmError::Overflow))
}

pub fn amount_before_fee(data: &TransferFeeData, amount: u64) -> Result<u64> {
    match data {
        None => Ok(amount),
        Some(fee) => fee.spl_fee().calculate_pre_fee_amount(amount)
            .ok_or_else(|| error!(PumpAmmError::Overflow)),
    }
}
