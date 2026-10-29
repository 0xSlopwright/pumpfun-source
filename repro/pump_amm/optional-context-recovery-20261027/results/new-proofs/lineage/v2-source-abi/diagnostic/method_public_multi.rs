use anchor_lang::prelude::*;
use pump_amm_recovered::{PumpAmmError, curve::fees::AppliedFees};
pub struct BuyResult {
 pub fees: AppliedFees,
 pub base_amount_out: u64,
 pub quote_amount_in: u64,
 pub user_quote_amount_in: u64,
 pub buyback_fee: u64,
 pub pool_quote_amount_in: u64,
 pub quote_transfer_fee: u64,
}
impl BuyResult {
 pub fn total_user_quote(&self) -> Result<u64> {
  self.pool_quote_amount_in.checked_add(self.buyback_fee)
   .ok_or_else(|| error!(PumpAmmError::Overflow))
 }
}
pub fn call(result: &BuyResult) -> Result<u64> { result.total_user_quote() }

pub fn check(result: &BuyResult, limit: u64) -> Result<()> {
 require_gte!(limit, result.total_user_quote()?, PumpAmmError::ExceededSlippage);
 Ok(())
}
pub fn with_bonus(result: &BuyResult, bonus: u64) -> Result<u64> {
 Ok(result.total_user_quote()?.wrapping_add(bonus))
}
