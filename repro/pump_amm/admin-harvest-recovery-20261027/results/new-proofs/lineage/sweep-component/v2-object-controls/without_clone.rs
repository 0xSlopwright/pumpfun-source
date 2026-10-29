use anchor_lang::prelude::*;
use pump_amm_recovered::trade_v2::{TradeEventContext, BuyResult, create_buy_event};
pub fn emission(ctx: TradeEventContext, result: &BuyResult) -> Result<(Vec<u8>,Vec<u8>)> {
    let event = create_buy_event(ctx, result, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "buy_v2")?;
    let first = anchor_lang::Event::data(&event);
    let second = anchor_lang::Event::data(&event);
    Ok((first, second))
}
