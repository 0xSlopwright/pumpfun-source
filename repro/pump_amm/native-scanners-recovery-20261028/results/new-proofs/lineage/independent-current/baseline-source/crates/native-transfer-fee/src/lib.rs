#![no_std]

#[derive(Clone, Copy, Debug)]
pub struct DecodedTransferFee {
    pub epoch: u64,
    pub maximum_fee: u64,
    pub transfer_fee_basis_points: u16,
}

impl DecodedTransferFee {
    pub fn calculate_fee(&self, amount: u64) -> Option<u64> {
        if amount == 0 {
            return Some(0);
        }
        let bps = self.transfer_fee_basis_points as u128;
        if bps == 0 {
            return Some(0);
        }
        let product = (amount as u128).checked_mul(bps)?;
        let raw: u64 = product.checked_add(10_000)?.checked_sub(1)?
            .checked_div(10_000)?.try_into().ok()?;
        Some(core::cmp::min(raw, self.maximum_fee))
    }

    pub fn calculate_pre_fee_amount(&self, post_fee_amount: u64) -> Option<u64> {
        let transfer_fee_basis_points = self.transfer_fee_basis_points as u128;
        match (transfer_fee_basis_points, post_fee_amount) {
            (0, _) => Some(post_fee_amount),
            (_, 0) => Some(0),
            (10_000, _) => self.maximum_fee.checked_add(post_fee_amount),
            _ => {
                let numerator = (post_fee_amount as u128).checked_mul(10_000)?;
                let denominator = 10_000u128.checked_sub(transfer_fee_basis_points)?;
                let raw_pre_fee_amount = numerator.checked_add(denominator)?
                    .checked_sub(1)?.checked_div(denominator)?;
                if raw_pre_fee_amount.checked_sub(post_fee_amount as u128)? >= self.maximum_fee as u128 {
                    post_fee_amount.checked_add(self.maximum_fee)
                } else {
                    u64::try_from(raw_pre_fee_amount).ok()
                }
            }
        }
    }
}
