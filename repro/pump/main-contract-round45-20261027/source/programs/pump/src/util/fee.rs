use anchor_lang::prelude::*;

/// Shared checked ceiling division, preserving addition/subtraction/division order.
#[inline(never)]
pub fn checked_ceil_div(numerator: u128, denominator: u128) -> Result<u128> {
    let sum = numerator.checked_add(denominator)
        .ok_or_else(|| error!(crate::PumpError::Overflow))?;
    let adjusted = sum.checked_sub(1)
        .ok_or_else(|| error!(crate::PumpError::Overflow))?;
    adjusted.checked_div(denominator)
        .ok_or_else(|| error!(crate::PumpError::DivisionByZero))
}

pub fn fee(quote_amount: u64, basis_points: u64) -> Result<u64> {
    let value = checked_ceil_div(u128::from(quote_amount) * u128::from(basis_points), 10000)?;
    u64::try_from(value).map_err(|_| error!(crate::PumpError::Truncation))
}

use crate::PumpError;
use crate::trade_types::{FeeConfig, FeeTier, Fees};
const WSOL: Pubkey = anchor_lang::solana_program::pubkey!("So11111111111111111111111111111111111111112");
const QUOTE_2:Pubkey=Pubkey::new_from_array([131,13,252,159,222,95,230,184,170,124,4,164,118,233,30,138,198,187,38,74,173,144,250,25,201,223,73,216,92,62,91,94]);
const USDC:Pubkey=anchor_lang::solana_program::pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

pub(crate) fn validate_config_length(length: usize) -> Result<()> {
    require!(length >= 2512, PumpError::FeeConfigTooShort);
    Ok(())
}

pub(crate) fn selected(config:&FeeConfig,cap:u128,quote:Pubkey)->Result<Fees>{
    let tiers=if quote==Pubkey::default() || quote==WSOL || quote==QUOTE_2 {
        &config.fee_tiers
    }else if quote==USDC {
        &config.stable_fee_tiers
    }else{
        let fees=&config.exotic_flat_fees;
        return Ok(if fees.lp_fee_bps!=0 || fees.protocol_fee_bps!=0 || fees.creator_fee_bps!=0 {
            fees.clone()
        }else{config.flat_fees.clone()});
    };
    let first=tiers.first().ok_or_else(||error!(PumpError::FeeTiersEmpty))?;
    if cap<first.market_cap_lamports_threshold{return Ok(first.fees.clone())}
    Ok(tiers.iter().rev().find(|t|t.market_cap_lamports_threshold<=cap).unwrap_or(first).fees.clone())
}

// D02: First-threshold gate before reverse search matters for unsorted tables.
pub(crate) fn tier(tiers: &[FeeTier], cap: u128) -> Result<Fees> {
    let first = tiers.first().ok_or(error!(PumpError::FeeTiersEmpty))?;
    if cap < first.market_cap_lamports_threshold { return Ok(first.fees.clone()); }
    Ok(tiers.iter().rev().find(|t| t.market_cap_lamports_threshold <= cap)
        .unwrap_or(first).fees.clone())
}
