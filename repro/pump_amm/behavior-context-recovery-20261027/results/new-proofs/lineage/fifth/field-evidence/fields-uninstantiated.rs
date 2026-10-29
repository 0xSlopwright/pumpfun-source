use anchor_lang::prelude::*;
use pump_amm_recovered::boost::InitBoost;
pub fn base(a: &InitBoost<'_>) -> Pubkey { a.pool.base_mint }
pub fn creator(a: &InitBoost<'_>) -> Pubkey { a.creator.key() }
pub fn virtual_quote(a: &InitBoost<'_>) -> i128 { a.pool.virtual_quote_reserves }
