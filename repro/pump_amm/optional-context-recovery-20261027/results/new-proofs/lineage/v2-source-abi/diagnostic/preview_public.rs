use anchor_lang::prelude::Result;
use pump_amm_recovered::trade_v2::{BuyPreviewContext, calculate_buy_result};
mod local {
 use super::*;
#[inline(never)]
pub fn preview_total_quote(context: BuyPreviewContext, quote_amount_in: u64) -> Result<u64> {
    let global_config = context.global_config.as_ref();
    let pool = context.pool.as_ref();
    let quote_transfer_fee = context.quote_transfer_fee;
    let result = {
        let fees = context.fees.clone();
        calculate_buy_result(
            global_config.buyback_basis_points,
            pool.is_mayhem_mode as u8,
            quote_transfer_fee,
            0,
            quote_amount_in,
            &fees,
        )
    }?;
    result.total_user_quote()
}
}
pub fn call(context: BuyPreviewContext, quote_amount_in: u64) -> Result<u64> { local::preview_total_quote(context, quote_amount_in) }

pub use local::preview_total_quote;
