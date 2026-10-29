use anchor_lang::prelude::*;
use pump_amm_recovered::boost::InitBoost;
pub unsafe fn base(raw: *const ()) -> [u8; 32] { let a = &*(raw as *const InitBoost<'_>); a.pool.base_mint.to_bytes() }
pub unsafe fn creator(raw: *const ()) -> [u8; 32] { let a = &*(raw as *const InitBoost<'_>); a.creator.key().to_bytes() }
pub unsafe fn virtual_quote(raw: *const ()) -> i128 { let a = &*(raw as *const InitBoost<'_>); a.pool.virtual_quote_reserves }
