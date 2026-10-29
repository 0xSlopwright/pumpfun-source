use anchor_lang::prelude::*;

use pump_amm_recovered::{Liquidity, PumpAmmError};

pub use pump_amm_recovered::ID;

#[event]
#[derive(Clone)]
pub struct DepositEvent {
    pub timestamp: i64,
    pub lp_token_amount_out: u64,
    pub max_base_amount_in: u64,
    pub max_quote_amount_in: u64,
    pub user_base_token_reserves: u64,
    pub user_quote_token_reserves: u64,
    pub pool_base_token_reserves: u64,
    pub pool_quote_token_reserves: u64,
    pub base_amount_in: u64,
    pub quote_amount_in: u64,
    pub lp_mint_supply: u64,
    pub pool: Pubkey,
    pub user: Pubkey,
    pub user_base_token_account: Pubkey,
    pub user_quote_token_account: Pubkey,
    pub user_pool_token_account: Pubkey,
    pub quote_transfer_fee: u64,
}

#[event]
#[derive(Clone)]
pub struct WithdrawEvent {
    pub timestamp: i64,
    pub lp_token_amount_in: u64,
    pub min_base_amount_out: u64,
    pub min_quote_amount_out: u64,
    pub user_base_token_reserves: u64,
    pub user_quote_token_reserves: u64,
    pub pool_base_token_reserves: u64,
    pub pool_quote_token_reserves: u64,
    pub base_amount_out: u64,
    pub quote_amount_out: u64,
    pub lp_mint_supply: u64,
    pub pool: Pubkey,
    pub user: Pubkey,
    pub user_base_token_account: Pubkey,
    pub user_quote_token_account: Pubkey,
    pub user_pool_token_account: Pubkey,
    pub quote_transfer_fee: u64,
}



pub fn deposit(ctx: &mut Context<Liquidity>, amount: u64, base_limit: u64, quote_limit: u64) -> Result<()> {
    let a = &mut *ctx.accounts;
    require!(a.global_config.disable_flags & 2 == 0, PumpAmmError::DisabledDeposit);
    let (base_reserve, user_quote_token_reserves, user_base_token_reserves, pool_quote_token_reserves) = (
        a.pool_base_token_account.amount, a.user_quote_token_account.amount,
        a.user_base_token_account.amount, a.pool_quote_token_account.amount,
    );
    let quote_reserve = a.pool.available_quote_reserves(pool_quote_token_reserves)?;
    let old_supply = a.pool.lp_supply;
    let base_amount = u64::try_from(ceil_div(
        (base_reserve as u128) * (amount as u128), old_supply as u128,
    )?).map_err(|_| error!(PumpAmmError::Truncation))?;
    require_gte!(base_limit, base_amount, PumpAmmError::ExceededSlippage);
    let quote_amount = u64::try_from(ceil_div(
        (quote_reserve as u128) * (amount as u128), old_supply as u128,
    )?).map_err(|_| error!(PumpAmmError::Truncation))?;
    let fee_data = pump_amm_recovered::utils::transfer_fee::from_mint(&a.quote_mint.to_account_info())?;
    let quote_transfer_amount = pump_amm_recovered::utils::transfer_fee::amount_before_fee(&fee_data, quote_amount)?;
    let quote_transfer_fee = quote_transfer_amount.checked_sub(quote_amount)
        .ok_or_else(|| error!(PumpAmmError::Overflow))?;
    require_gte!(quote_limit, quote_transfer_amount, PumpAmmError::ExceededSlippage);
    let base_program = if a.base_mint.to_account_info().owner == a.token_program.as_ref().key {
        a.token_program.as_ref()
    } else {
        a.token_2022_program.as_ref()
    };
    pump_amm_recovered::utils::token::transfer_checked(base_program, &a.base_mint,
        &a.user_base_token_account, &a.pool_base_token_account,
        a.user.as_ref(), base_amount, &[])?;
    let quote_program = if a.quote_mint.to_account_info().owner == a.token_program.as_ref().key {
        a.token_program.as_ref()
    } else {
        a.token_2022_program.as_ref()
    };
    pump_amm_recovered::utils::token::transfer_checked(quote_program, &a.quote_mint,
        &a.user_quote_token_account, &a.pool_quote_token_account,
        a.user.as_ref(), quote_transfer_amount, &[])?;
    pump_amm_recovered::utils::token::mint_to_pool(&a.token_2022_program, &a.lp_mint,
        &a.user_pool_token_account, amount, &a.pool)?;
    a.pool.lp_supply = a.pool.lp_supply.checked_add(amount)
        .ok_or_else(|| error!(PumpAmmError::Overflow))?;
    if a.pool.can_boost() {
        let effective_virtual = a.pool.total_virtual_quote_reserves()?;
        let virtual_reserve = u128::try_from(effective_virtual)
            .map_err(|_| error!(PumpAmmError::Overflow))?;
        let change = virtual_reserve.checked_mul(amount as u128)
            .ok_or_else(|| error!(PumpAmmError::Overflow))?
            .checked_div(old_supply as u128).ok_or_else(|| error!(PumpAmmError::DivisionByZero))?;
        let change = i128::try_from(change).map_err(|_| error!(PumpAmmError::Overflow))?;
        a.pool.virtual_quote_reserves = a.pool.virtual_quote_reserves.checked_add(change)
            .ok_or_else(|| error!(PumpAmmError::Overflow))?;
    }
    let event = DepositEvent {
        timestamp: Clock::get()?.unix_timestamp,
        lp_token_amount_out: amount,
        max_base_amount_in: base_limit,
        max_quote_amount_in: quote_limit,
        user_base_token_reserves,
        user_quote_token_reserves,
        pool_base_token_reserves: base_reserve,
        pool_quote_token_reserves,
        base_amount_in: base_amount,
        quote_amount_in: quote_amount,
        lp_mint_supply: old_supply,
        pool: a.pool.key(),
        user: a.user.key(),
        user_base_token_account: a.user_base_token_account.key(),
        user_quote_token_account: a.user_quote_token_account.key(),
        user_pool_token_account: a.user_pool_token_account.key(),
        quote_transfer_fee,
    };
    emit!(event);
    emit_cpi!(event);
    Ok(())
}




pub fn withdraw(ctx: &mut Context<Liquidity>, amount: u64, base_limit: u64, quote_limit: u64) -> Result<()> {
    let a = &mut *ctx.accounts;
    require!(a.global_config.disable_flags & 4 == 0, PumpAmmError::DisabledWithdraw);
    require_gte!(a.pool.lp_supply, a.lp_mint.supply, PumpAmmError::SeedLockViolation);
    let (base_reserve, user_quote_token_reserves, user_base_token_reserves, pool_quote_token_reserves) = (
        a.pool_base_token_account.amount, a.user_quote_token_account.amount,
        a.user_base_token_account.amount, a.pool_quote_token_account.amount,
    );
    let quote_reserve = a.pool.available_quote_reserves(pool_quote_token_reserves)?;
    let old_supply = a.pool.lp_supply;
    let base_amount = u64::try_from(liquidity_floor_ratio(
        base_reserve, amount, old_supply,
    )?).map_err(|_| error!(PumpAmmError::Truncation))?;
    require_gte!(base_amount, base_limit, PumpAmmError::ExceededSlippage);
    let quote_amount = u64::try_from(liquidity_floor_ratio(
        quote_reserve, amount, old_supply,
    )?).map_err(|_| error!(PumpAmmError::Truncation))?;
    let fee_data = pump_amm_recovered::utils::transfer_fee::from_mint(&a.quote_mint.to_account_info())?;
    let quote_received = pump_amm_recovered::utils::transfer_fee::amount_after_fee(&fee_data, quote_amount)?;
    let quote_transfer_fee = quote_amount.checked_sub(quote_received)
        .ok_or_else(|| error!(PumpAmmError::Overflow))?;
    require_gte!(quote_received, quote_limit, PumpAmmError::ExceededSlippage);
    let base_program = if a.base_mint.to_account_info().owner == a.token_program.as_ref().key {
        a.token_program.as_ref()
    } else {
        a.token_2022_program.as_ref()
    };
    pump_amm_recovered::utils::token::transfer_from_pool(base_program, &a.base_mint,
        &a.pool_base_token_account, &a.user_base_token_account, base_amount, &a.pool)?;
    let quote_program = if a.quote_mint.to_account_info().owner == a.token_program.as_ref().key {
        a.token_program.as_ref()
    } else {
        a.token_2022_program.as_ref()
    };
    pump_amm_recovered::utils::token::transfer_from_pool(quote_program, &a.quote_mint,
        &a.pool_quote_token_account, &a.user_quote_token_account, quote_amount, &a.pool)?;
    pump_amm_recovered::utils::token::burn_from_user(&a.token_2022_program, &a.lp_mint,
        &a.user_pool_token_account, a.user.as_ref(), amount)?;
    a.pool.lp_supply = a.pool.lp_supply.checked_sub(amount)
        .ok_or_else(|| error!(PumpAmmError::Overflow))?;
    if a.pool.can_boost() {
        let effective_virtual = a.pool.total_virtual_quote_reserves()?;
        let virtual_reserve = u128::try_from(effective_virtual)
            .map_err(|_| error!(PumpAmmError::Overflow))?;
        let change = ceil_div(
            virtual_reserve.checked_mul(amount as u128)
                .ok_or_else(|| error!(PumpAmmError::Overflow))?,
            old_supply as u128,
        )?;
        let change = u64::try_from(change).map_err(|_| error!(PumpAmmError::Truncation))?;
        let change = i128::from(change);
        a.pool.virtual_quote_reserves = a.pool.virtual_quote_reserves.checked_sub(change)
            .ok_or_else(|| error!(PumpAmmError::Overflow))?;
    }
    let event = WithdrawEvent {
        timestamp: Clock::get()?.unix_timestamp,
        lp_token_amount_in: amount,
        min_base_amount_out: base_limit,
        min_quote_amount_out: quote_limit,
        user_base_token_reserves,
        user_quote_token_reserves,
        pool_base_token_reserves: base_reserve,
        pool_quote_token_reserves,
        base_amount_out: base_amount,
        quote_amount_out: quote_amount,
        lp_mint_supply: old_supply,
        pool: a.pool.key(),
        user: a.user.key(),
        user_base_token_account: a.user_base_token_account.key(),
        user_quote_token_account: a.user_quote_token_account.key(),
        user_pool_token_account: a.user_pool_token_account.key(),
        quote_transfer_fee,
    };
    emit!(event);
    emit_cpi!(event);
    Ok(())
}

extern "Rust" {
#[link_name = "_ZN18pump_amm_recovered5curve4fees8ceil_div17hec1b98a6acb4cd9fE"]
fn external_ceil_div(a:u128,b:u128)->Result<u128>;
}
fn ceil_div(a:u128,b:u128)->Result<u128>{unsafe { external_ceil_div(a,b) }}

extern "Rust" {
#[link_name = "_ZN18pump_amm_recovered5curve16constant_product21liquidity_floor_ratio17h49ea4279b1c4490fE"]
fn external_liquidity_floor_ratio(a:u64,b:u64,c:u64)->Result<u128>;
}
fn liquidity_floor_ratio(a:u64,b:u64,c:u64)->Result<u128>{unsafe { external_liquidity_floor_ratio(a,b,c) }}
