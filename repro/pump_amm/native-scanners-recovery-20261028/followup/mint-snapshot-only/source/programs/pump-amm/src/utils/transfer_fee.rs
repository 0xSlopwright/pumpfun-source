use crate::*;
pub use native_transfer_fee::DecodedTransferFee;

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


/// Extract the epoch fee pair while validating the Token-2022 mint TLV envelope.
fn decode_transfer_fees(data: &[u8]) -> std::result::Result<Option<(DecodedTransferFee, DecodedTransferFee)>, ()> {
    if data.len() == 82 {
        return Ok(None);
    }
    if data.len() < 167 || data[82..165].iter().any(|byte| *byte != 0) || data[165] != 1 {
        return Err(());
    }
    let mut remaining = &data[166..];
    let mut fees = None;
    while remaining.len() >= 2 {
        let kind = u16::from_le_bytes(remaining[..2].try_into().unwrap());
        if kind == 0 {
            break;
        }
        if remaining.len() < 4 {
            return Err(());
        }
        let length = u16::from_le_bytes(remaining[2..4].try_into().unwrap()) as usize;
        let value = remaining.get(4..4 + length).ok_or(())?;
        if kind == 1 {
            if fees.is_some() || length < 108 {
                return Err(());
            }
            let read_fee = |bytes: &[u8]| DecodedTransferFee {
                epoch: u64::from_le_bytes(bytes[..8].try_into().unwrap()),
                maximum_fee: u64::from_le_bytes(bytes[8..16].try_into().unwrap()),
                transfer_fee_basis_points: u16::from_le_bytes(bytes[16..18].try_into().unwrap()),
            };
            fees = Some((read_fee(&value[72..90]), read_fee(&value[90..108])));
        }
        remaining = &remaining[4 + length..];
    }
    Ok(fees)
}
