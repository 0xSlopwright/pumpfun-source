use super::*;
use crate::instructions::swap::trade_v2::{calculate_buy_result, calculate_sell_quote, preview_total_quote, BuyPreviewContext};
use crate::utils::transfer_fee;
use crate::instructions::swap::trade_v2::BuyResult;
use anchor_lang::Discriminator;

pub use crate::instructions::swap::buy::BuyEvent;

#[event]
#[derive(Clone)]
pub struct SellEvent {
    pub timestamp: i64,
    pub base_amount_in: u64,
    pub min_quote_amount_out: u64,
    pub user_base_token_reserves: u64,
    pub user_quote_token_reserves: u64,
    pub pool_base_token_reserves: u64,
    pub pool_quote_token_reserves: u64,
    pub quote_amount_out: u64,
    pub lp_fee_basis_points: u64,
    pub lp_fee: u64,
    pub protocol_fee_basis_points: u64,
    pub protocol_fee: u64,
    pub quote_amount_out_without_lp_fee: u64,
    pub user_quote_amount_out: u64,
    pub pool: Pubkey,
    pub user: Pubkey,
    pub user_base_token_account: Pubkey,
    pub user_quote_token_account: Pubkey,
    pub protocol_fee_recipient: Pubkey,
    pub protocol_fee_recipient_token_account: Pubkey,
    pub coin_creator: Pubkey,
    pub coin_creator_fee_basis_points: u64,
    pub coin_creator_fee: u64,
    pub cashback_fee_basis_points: u64,
    pub cashback: u64,
    pub buyback_fee_basis_points: u64,
    pub buyback_fee: u64,
    pub virtual_quote_reserves: i128,
    pub can_boost: bool,
    pub base_supply: u64,
    pub holder_rewards_bps: u64,
    pub holder_rewards: u64,
    pub creator_fee_unclaimed: u64,
    pub quote_transfer_fee: u64,
}

pub(crate) use crate::instructions::swap::trade_v2::*;
fn checked64(x: u128) -> Result<u64> { u64::try_from(x).map_err(|_| error!(PumpAmmError::Truncation)) }
use crate::curve::fees::fee;
fn fees(a: &TradeV2, base_reserve: u64, quote_reserve: u64, quote_amount: u64) -> Result<crate::curve::fees::AppliedFees> {
    if a.global_config.whitelist_pda == a.user.key() { return Ok(Default::default()); }
    crate::curve::fees::select_and_apply_v2(&a.pool, &a.global_config, &a.fee_config, a.fee_config.to_account_info().data_len(),
        a.base_mint.supply, base_reserve, quote_reserve, quote_amount)
}
pub fn execute(ctx: Context<TradeV2>, amount: u64, limit: u64, mode: u8) -> Result<()> {
    let a = &mut *ctx.accounts;
    require!(a.global_config.disable_flags & (if mode == 1 {16} else {8}) == 0, if mode == 1 {PumpAmmError::DisabledSell} else {PumpAmmError::DisabledBuy});
    prepare(a)?;
    if mode == 2 {
        require_gt!(limit, 0, PumpAmmError::ZeroBaseAmount);
        require_gt!(amount, 0, PumpAmmError::ZeroQuoteAmount);
    } else {
        require_gt!(amount, 0, PumpAmmError::ZeroBaseAmount);
        if mode == 0 { require_gt!(limit, 0, PumpAmmError::ZeroQuoteAmount); }
    }
    crate::instructions::swap::trade_v2::validate_buyback_token_account(
        &a.global_config, a.buyback_fee_recipient.as_ref(), &a.quote_mint.key(), &a.quote_token_program.key(),
    )?;
    if mode == 1 && a.user_volume_accumulator.user == Pubkey::default() {
        a.user_volume_accumulator.user = a.user.key();
    }
    let old_virtual = a.pool.virtual_quote_reserves;
    let old_accrued=a.pool.protocol_fees.checked_add(a.pool.creator_fees).ok_or_else(|| error!(PumpAmmError::Overflow))?;
    let can_boost=old_virtual.checked_add(old_accrued as i128).ok_or_else(|| error!(PumpAmmError::Overflow))? != 0;
    let real_quote_reserves = a.pool_quote_token_account.amount.checked_sub(old_accrued).ok_or_else(|| error!(PumpAmmError::Overflow))?;
    let q = (a.pool_quote_token_account.amount as i128).checked_add(old_virtual).ok_or_else(|| error!(PumpAmmError::Overflow))?;
    let q = u64::try_from(q).map_err(|_| error!(PumpAmmError::Overflow))?;
    let b = a.pool_base_token_account.amount;
    let curve_initial = if mode == 0 {
        crate::curve::constant_product::quote_for_base(amount, b, q)?
    } else if mode == 1 {
        crate::curve::constant_product::quote_for_sell(amount, b, q)?
    } else { 0 };
    let early_quote_fee_data = if mode == 2 {
        Some(transfer_fee::from_mint(a.quote_mint.as_ref().as_ref())?)
    } else { None };
    let available = if mode == 2 {
        let available = transfer_fee::amount_after_fee(early_quote_fee_data.as_ref().unwrap(), amount)?;
        require_gt!(available, 0, PumpAmmError::BuyNotEnoughQuoteTokensToCoverFees);
        available
    } else { 0 };
    let selected = fees(a, b, q, if mode == 2 { available } else { curve_initial })?;
    let sell_quote = if mode == 1 {
        Some(calculate_sell_quote(curve_initial, &selected, real_quote_reserves)?)
    } else { None };
    let quote_fee_data = match early_quote_fee_data {
        Some(data) => data,
        None => transfer_fee::from_mint(a.quote_mint.as_ref().as_ref())?,
    };
    let creator_bps = if a.pool.coin_creator == Pubkey::default() {0} else {selected.creator_fee_bps};
    let (base_amount, curve_quote, lp_fee, protocol_fee, creator_fee, total_quote) = if mode == 0 {
        let quote = curve_initial;
        let l = selected.lp_fee; let p = selected.protocol_fee; let c = selected.creator_fee;
        let total = quote.checked_add(l).and_then(|v|v.checked_add(p)).and_then(|v|v.checked_add(c)).ok_or_else(|| error!(PumpAmmError::Overflow))?;
        (amount,quote,l,p,c,total)
    } else if mode == 1 {
        let quote = curve_initial;
        let l = selected.lp_fee; let p = selected.protocol_fee; let c = selected.creator_fee;
        let total = sell_quote.unwrap().1;
        (amount,quote,l,p,c,total)
    } else {
        let total_fee_bps = selected.lp_fee_bps.saturating_add(selected.protocol_fee_bps).saturating_add(creator_bps);
        let sum = (total_fee_bps as u128) + 10000;
        let estimated = checked64((available as u128)*10000/sum)?;
        require_gt!(estimated,0, PumpAmmError::BuyNotEnoughQuoteTokensToCoverFees);
        let l=fee(estimated,selected.lp_fee_bps)?;let p=fee(estimated,selected.protocol_fee_bps)?;let c=fee(estimated,creator_bps)?;
        let required = estimated.checked_add(l).and_then(|v|v.checked_add(p)).and_then(|v|v.checked_add(c)).ok_or_else(|| error!(PumpAmmError::Overflow))?;
        let adjusted_estimate = estimated.checked_sub(required.saturating_sub(available)).ok_or(PumpAmmError::BuyNotEnoughQuoteTokensToCoverFees)?;
        require_gt!(adjusted_estimate, 0, PumpAmmError::BuySlippageBelowMinBaseAmountOut);
        let exact_fees = crate::curve::fees::AppliedFees {
            lp_fee_bps: selected.lp_fee_bps, protocol_fee_bps: selected.protocol_fee_bps,
            creator_fee_bps: selected.creator_fee_bps, lp_fee: l, protocol_fee: p, creator_fee: c,
        };
        let preview = preview_total_quote(BuyPreviewContext {
            pool: &a.pool, global_config: &a.global_config,
            quote_transfer_fee: &quote_fee_data, fees: &exact_fees,
        }, adjusted_estimate)?;
        let quote = adjusted_estimate.checked_sub(preview.saturating_sub(amount))
            .ok_or(PumpAmmError::BuyNotEnoughQuoteTokensToCoverFees)?;
        require_gt!(quote, 0, PumpAmmError::BuySlippageBelowMinBaseAmountOut);
        let adjusted=quote.saturating_sub(1);
        let out=checked64((b as u128)*(adjusted as u128)/((q as u128)+(adjusted as u128)))?;
        require_gte!(out, limit, PumpAmmError::BuySlippageBelowMinBaseAmountOut);
        (out,quote,l,p,c,quote.checked_add(l).and_then(|v|v.checked_add(p)).and_then(|v|v.checked_add(c)).ok_or(PumpAmmError::Overflow)?)
    };
    if mode == 1 {
        let transfer_fee=super::quote_transfer_fee(&a.quote_mint.to_account_info(),total_quote,false)?;
        require_gte!(total_quote.checked_sub(transfer_fee).ok_or(PumpAmmError::Overflow)?,limit,PumpAmmError::ExceededSlippage);
        transfer(&a.base_token_program.to_account_info(),&a.base_mint,&a.user_base_token_account,&a.pool_base_token_account,&a.user.to_account_info(),&a.pool,base_amount,true)?;
        transfer(&a.quote_token_program.to_account_info(),&a.quote_mint,&a.user_quote_token_account,&a.pool_quote_token_account,&a.user.to_account_info(),&a.pool,total_quote,false)?;
    }
    let buyback_bps = if a.pool.is_mayhem_mode {0} else {a.global_config.buyback_basis_points};
    let result_fees = crate::curve::fees::AppliedFees {
        lp_fee_bps: selected.lp_fee_bps, protocol_fee_bps: selected.protocol_fee_bps,
        creator_fee_bps: selected.creator_fee_bps, lp_fee, protocol_fee, creator_fee,
    };
    let buy_result = if mode != 1 {
        Some(calculate_buy_result(a.global_config.buyback_basis_points, a.pool.is_mayhem_mode as u8,
            &quote_fee_data, base_amount, curve_quote, &result_fees)?)
    } else { None };
    let buyback_fee = if let Some(result) = &buy_result { result.buyback_fee } else {
        let fee = u64::try_from((protocol_fee as u128)*(buyback_bps as u128)/10000)
            .expect("buyback fee is at most protocol_fee");
        let _ = protocol_fee.checked_sub(fee).expect("buyback_fee never exceeds protocol_fee");
        fee
    };
    let buyback_received = transfer_fee::amount_after_fee(&quote_fee_data, buyback_fee)?;
    let quote_transfer_fee = if let Some(result) = &buy_result {result.quote_transfer_fee}
        else {transfer_fee::calculate_fee(&quote_fee_data, total_quote)?};
    let pool_quote = if let Some(result) = &buy_result {result.pool_quote_amount_in} else {total_quote};
    if mode == 0 { require_gte!(limit,buy_result.as_ref().unwrap().total_user_quote()?, PumpAmmError::ExceededSlippage); }
    if mode == 1 { require_gte!(total_quote.checked_sub(quote_transfer_fee).ok_or(PumpAmmError::Overflow)?,limit, PumpAmmError::ExceededSlippage); }

    let buyback_fee = if mode != 1 {
        buy_transfers(a, buy_result.as_ref().unwrap())?
    } else {
        let buyback_fee = a.pool.accrue_fees(&a.global_config, protocol_fee, creator_fee)?;
        if buyback_fee > 0 {
            crate::utils::token::transfer_from_pool_to_raw(
                a.quote_token_program.as_ref(), &a.quote_mint, &a.pool_quote_token_account,
                &a.pool, a.buyback_fee_recipient.as_ref(), buyback_fee,
            )?;
        }
        buyback_fee
    };

    if mode != 1 {
        let event = BuyEvent {
            timestamp: Clock::get()?.unix_timestamp,
            base_amount_out: base_amount,
            max_quote_amount_in: if mode == 2 {amount} else {limit},
            user_base_token_reserves: a.user_base_token_account.amount,
            user_quote_token_reserves: a.user_quote_token_account.amount,
            pool_base_token_reserves: b,
            pool_quote_token_reserves: a.pool_quote_token_account.amount,
            quote_amount_in: if mode == 2 {amount} else {curve_quote},
            lp_fee_basis_points: selected.lp_fee_bps,
            lp_fee: lp_fee,
            protocol_fee_basis_points: selected.protocol_fee_bps,
            protocol_fee: protocol_fee,
            quote_amount_in_with_lp_fee: curve_quote+lp_fee,
            user_quote_amount_in: if mode == 2 {curve_quote} else {total_quote},
            pool: a.pool.key(),
            user: a.user.key(),
            user_base_token_account: a.user_base_token_account.key(),
            user_quote_token_account: a.user_quote_token_account.key(),
            protocol_fee_recipient: Pubkey::default(),
            protocol_fee_recipient_token_account: Pubkey::default(),
            coin_creator: a.pool.coin_creator,
            coin_creator_fee_basis_points: selected.creator_fee_bps,
            coin_creator_fee: creator_fee,
            track_volume: false,
            total_unclaimed_tokens: a.user_volume_accumulator.total_unclaimed_tokens,
            total_claimed_tokens: a.user_volume_accumulator.total_claimed_tokens,
            current_sol_volume: a.user_volume_accumulator.current_sol_volume,
            last_update_timestamp: a.user_volume_accumulator.last_update_timestamp,
            min_base_amount_out: if mode == 2 {limit} else {amount},
            ix_name: if mode == 2 {"buy_exact_quote_in_v2".to_string()} else {"buy_v2".to_string()},
            cashback_fee_basis_points: 0,
            cashback: 0,
            buyback_fee_basis_points: buyback_bps,
            buyback_fee: buyback_received,
            virtual_quote_reserves: old_virtual,
            can_boost: can_boost,
            base_supply: if a.pool.is_mayhem_mode {1_000_000_000_000_000} else {a.base_mint.supply},
            holder_rewards_bps: if a.pool.is_holder_reward { selected.creator_fee_bps } else { 0 },
            holder_rewards: if a.pool.is_holder_reward { creator_fee } else { 0 },
            creator_fee_unclaimed: a.pool.creator_fees,
            quote_transfer_fee,
        };
        emit!(event.clone()); emit_cpi!(event);
    } else {
        let event = SellEvent {
            timestamp: Clock::get()?.unix_timestamp,
            base_amount_in: base_amount,
            min_quote_amount_out: limit,
            user_base_token_reserves: a.user_base_token_account.amount,
            user_quote_token_reserves: a.user_quote_token_account.amount,
            pool_base_token_reserves: b,
            pool_quote_token_reserves: a.pool_quote_token_account.amount,
            quote_amount_out: curve_quote,
            lp_fee_basis_points: selected.lp_fee_bps,
            lp_fee: lp_fee,
            protocol_fee_basis_points: selected.protocol_fee_bps,
            protocol_fee: protocol_fee,
            quote_amount_out_without_lp_fee: curve_quote-lp_fee,
            user_quote_amount_out: total_quote,
            pool: a.pool.key(),
            user: a.user.key(),
            user_base_token_account: a.user_base_token_account.key(),
            user_quote_token_account: a.user_quote_token_account.key(),
            protocol_fee_recipient: Pubkey::default(),
            protocol_fee_recipient_token_account: Pubkey::default(),
            coin_creator: a.pool.coin_creator,
            coin_creator_fee_basis_points: selected.creator_fee_bps,
            coin_creator_fee: creator_fee,
            cashback_fee_basis_points: 0,
            cashback: 0,
            buyback_fee_basis_points: buyback_bps,
            buyback_fee: buyback_received,
            virtual_quote_reserves: old_virtual,
            can_boost: can_boost,
            base_supply: if a.pool.is_mayhem_mode {1_000_000_000_000_000} else {a.base_mint.supply},
            holder_rewards_bps: if a.pool.is_holder_reward { selected.creator_fee_bps } else { 0 },
            holder_rewards: if a.pool.is_holder_reward { creator_fee } else { 0 },
            creator_fee_unclaimed: a.pool.creator_fees,
            quote_transfer_fee,
        };
        emit!(event.clone()); emit_cpi!(event);
    }
    Ok(())
}
fn transfer<'info>(program: &AccountInfo<'info>, mint: &InterfaceAccount<'info, Mint>, user: &InterfaceAccount<'info, TokenAccount>, vault: &InterfaceAccount<'info, TokenAccount>, user_authority: &AccountInfo<'info>, pool: &Account<'info, Pool>, amount: u64, to_pool: bool) -> Result<()> {
    if to_pool {
        crate::utils::token::transfer_checked(program, mint, user, vault, user_authority, amount, &[])
    } else {
        crate::utils::token::transfer_from_pool(program, mint, vault, user, amount, pool)
    }
}

#[inline(never)]
fn prepare(a:&mut TradeV2) -> Result<()> {
    crate::instructions::swap::trade_v2::validate_cashback_coin(a.pool.is_cashback_coin as u8)?;
    let pool_info=a.pool.to_account_info();
    if pool_info.data_len()<287 {
        let needed=Rent::get()?.minimum_balance(287).saturating_sub(pool_info.lamports());
        if needed>0 {anchor_lang::system_program::transfer(CpiContext::new(a.system_program.to_account_info(),anchor_lang::system_program::Transfer {from:a.user.to_account_info(),to:pool_info.clone()}),needed)?;}
        pool_info.realloc(287,false)?;
    }
    Ok(())
}



#[inline(never)]
fn buy_transfers<'info>(a: &mut TradeV2<'info>, result: &BuyResult) -> Result<u64> {
    crate::utils::token::transfer_from_pool(
        a.base_token_program.as_ref(), &a.base_mint, &a.pool_base_token_account,
        &a.user_base_token_account, result.base_amount_out, &a.pool,
    )?;
    let buyback_fee = a.pool.accrue_fees(
        &a.global_config, result.fees.protocol_fee, result.fees.creator_fee,
    )?;
    crate::utils::token::transfer_checked(
        a.quote_token_program.as_ref(), &a.quote_mint, &a.user_quote_token_account,
        &a.pool_quote_token_account, a.user.as_ref(), result.pool_quote_amount_in, &[],
    )?;
    crate::utils::token::transfer_checked_to_account_info(
        a.quote_token_program.as_ref(), &a.quote_mint, &a.user_quote_token_account,
        a.buyback_fee_recipient.as_ref(), a.user.as_ref(), buyback_fee,
    )?;
    if a.user_volume_accumulator.user == Pubkey::default() { a.user_volume_accumulator.user.as_mut().copy_from_slice(a.user.key.as_ref()); }
    Ok(buyback_fee)
}

/// V2 sell execution follows the original transfer and state-update order.
#[inline(never)]
pub fn execute_sell(ctx: Context<TradeV2>, base_amount: u64, limit: u64) -> Result<()> {
    let a = &mut *ctx.accounts;
    require!(a.global_config.disable_flags & 16 == 0, PumpAmmError::DisabledSell);
    prepare(a)?;
    require_gt!(base_amount, 0, PumpAmmError::ZeroBaseAmount);
    crate::instructions::swap::trade_v2::validate_buyback_token_account(
        &a.global_config, a.buyback_fee_recipient.as_ref(), &a.quote_mint.key(), &a.quote_token_program.key(),
    )?;

    let user_base_reserves = a.user_base_token_account.amount;
    let user_quote_reserves = a.user_quote_token_account.amount;
    let b = a.pool_base_token_account.amount;
    let raw_quote_reserves = a.pool_quote_token_account.amount;
    let real_quote_reserves = crate::liquidity_quote_reserves(&a.pool, raw_quote_reserves)?;
    let q = a.pool.effective_quote_reserves(raw_quote_reserves)?;
    let old_virtual = a.pool.virtual_quote_reserves;
    let curve_quote = crate::curve::constant_product::quote_for_sell(base_amount, b, q)?;
    let selected = fees(a, b, q, curve_quote)?;
    let (quote_without_lp_fee, total_quote) = calculate_sell_quote(curve_quote, &selected, real_quote_reserves)?;
    let quote_fee_data = transfer_fee::from_mint(a.quote_mint.as_ref().as_ref())?;
    let quote_received = transfer_fee::amount_after_fee(&quote_fee_data, total_quote)?;
    require_gte!(quote_received, limit, PumpAmmError::ExceededSlippage);
    let quote_transfer_fee = total_quote.checked_sub(quote_received)
        .ok_or_else(|| error!(PumpAmmError::Overflow))?;

    crate::utils::token::transfer_checked(
        a.base_token_program.as_ref(), &a.base_mint, &a.user_base_token_account,
        &a.pool_base_token_account, a.user.as_ref(), base_amount, &[],
    )?;
    crate::utils::token::transfer_from_pool(
        a.quote_token_program.as_ref(), &a.quote_mint, &a.pool_quote_token_account,
        &a.user_quote_token_account, total_quote, &a.pool,
    )?;
    let buyback_fee = a.pool.accrue_fees(
        &a.global_config, selected.protocol_fee, selected.creator_fee,
    )?;
    crate::utils::token::transfer_from_pool_to_raw(
        a.quote_token_program.as_ref(), &a.quote_mint, &a.pool_quote_token_account,
        &a.pool, a.buyback_fee_recipient.as_ref(), buyback_fee,
    )?;
    if a.user_volume_accumulator.user == Pubkey::default() {
        a.user_volume_accumulator.user.as_mut().copy_from_slice(a.user.key.as_ref());
    }
    let buyback_received = transfer_fee::amount_after_fee(&quote_fee_data, buyback_fee)?;
    let event = crate::instructions::swap::trade_v2::create_sell_event(
        crate::instructions::swap::trade_v2::TradeEventContext {
            pool: &a.pool,
            global_config: &a.global_config,
            user_volume_accumulator: &a.user_volume_accumulator,
            base_supply: a.base_mint.supply,
            user: a.user.key(),
            user_base_token_account: a.user_base_token_account.key(),
            user_quote_token_account: a.user_quote_token_account.key(),
        },
        base_amount, limit, user_base_reserves, user_quote_reserves, b,
        raw_quote_reserves, curve_quote, &selected, quote_without_lp_fee, total_quote,
        old_virtual, buyback_received, quote_transfer_fee,
    )?;
        emit!(event.clone()); emit_cpi!(event);
    Ok(())
}

#[inline(never)]
pub fn execute_buy(ctx: Context<TradeV2>, amount: u64, limit: u64) -> Result<()> {
    let a = &mut *ctx.accounts;
    require!(a.global_config.disable_flags & 8 == 0, PumpAmmError::DisabledBuy);
    prepare(a)?;
    require_gt!(amount, 0, PumpAmmError::ZeroBaseAmount);
    require_gt!(limit, 0, PumpAmmError::ZeroQuoteAmount);
    crate::instructions::swap::trade_v2::validate_buyback_token_account(
        &a.global_config, a.buyback_fee_recipient.as_ref(), &a.quote_mint.key(), &a.quote_token_program.key(),
    )?;
    let user_base_reserves = a.user_base_token_account.amount;
    let user_quote_reserves = a.user_quote_token_account.amount;
    let b = a.pool_base_token_account.amount;
    let raw_quote_reserves = a.pool_quote_token_account.amount;
    crate::liquidity_quote_reserves(&a.pool, raw_quote_reserves)?;
    let q = a.pool.effective_quote_reserves(raw_quote_reserves)?;
    let old_virtual = a.pool.virtual_quote_reserves;
    let quote = crate::curve::constant_product::quote_for_base(amount, b, q)?;
    let selected = fees(a, b, q, quote)?;
    let quote_fee_data = transfer_fee::from_mint(a.quote_mint.as_ref().as_ref())?;
    let result = calculate_buy_result(a.global_config.buyback_basis_points, a.pool.is_mayhem_mode as u8,
        &quote_fee_data, amount, quote, &selected)?;
    require_gte!(limit, result.total_user_quote()?, PumpAmmError::ExceededSlippage);
    let buyback_fee = buy_transfers(a, &result)?;
    let buyback_received = transfer_fee::amount_after_fee(&quote_fee_data, buyback_fee)?;
    let event = crate::instructions::swap::trade_v2::create_buy_event(
        crate::instructions::swap::trade_v2::TradeEventContext {
            pool: &a.pool, global_config: &a.global_config,
            user_volume_accumulator: &a.user_volume_accumulator,
            base_supply: a.base_mint.supply, user: a.user.key(),
            user_base_token_account: a.user_base_token_account.key(),
            user_quote_token_account: a.user_quote_token_account.key(),
        }, &result, limit, amount, result.quote_amount_in, result.user_quote_amount_in,
        user_base_reserves, user_quote_reserves, b, raw_quote_reserves,
        old_virtual, buyback_received, "buy_v2",
    )?;
    emit!(event.clone()); emit_cpi!(event);
    Ok(())
}

#[inline(never)]
pub fn execute_buy_exact_quote(ctx: Context<TradeV2>, amount: u64, limit: u64) -> Result<()> {
    let a = &mut *ctx.accounts;
    require!(a.global_config.disable_flags & 8 == 0, PumpAmmError::DisabledBuy);
    prepare(a)?;
    require_gt!(limit, 0, PumpAmmError::ZeroBaseAmount);
    require_gt!(amount, 0, PumpAmmError::ZeroQuoteAmount);
    crate::instructions::swap::trade_v2::validate_buyback_token_account(
        &a.global_config, a.buyback_fee_recipient.as_ref(), &a.quote_mint.key(), &a.quote_token_program.key(),
    )?;
    let user_base_reserves = a.user_base_token_account.amount;
    let user_quote_reserves = a.user_quote_token_account.amount;
    let b = a.pool_base_token_account.amount;
    let raw_quote_reserves = a.pool_quote_token_account.amount;
    crate::liquidity_quote_reserves(&a.pool, raw_quote_reserves)?;
    let q = a.pool.effective_quote_reserves(raw_quote_reserves)?;
    let old_virtual = a.pool.virtual_quote_reserves;
    let quote_fee_data = transfer_fee::from_mint(a.quote_mint.as_ref().as_ref())?;
    let available = transfer_fee::amount_after_fee(&quote_fee_data, amount)?;
    require_gt!(available, 0, PumpAmmError::BuyNotEnoughQuoteTokensToCoverFees);
    let selected = fees(a, b, q, available)?;
    let (estimate, exact_fees) = crate::instructions::swap::trade_v2::estimate_buy_quote(&a.pool, &selected, available)?;
    let preview = preview_total_quote(BuyPreviewContext { pool: &a.pool, global_config: &a.global_config,
        quote_transfer_fee: &quote_fee_data, fees: &exact_fees }, estimate)?;
    let quote = estimate.checked_sub(preview.saturating_sub(amount))
        .ok_or(PumpAmmError::BuyNotEnoughQuoteTokensToCoverFees)?;
    require_gt!(quote, 0, PumpAmmError::BuySlippageBelowMinBaseAmountOut);
    let out = crate::curve::constant_product::base_for_quote(quote, b, q)?;
    require_gte!(out, limit, PumpAmmError::BuySlippageBelowMinBaseAmountOut);
    let result = calculate_buy_result(a.global_config.buyback_basis_points, a.pool.is_mayhem_mode as u8,
        &quote_fee_data, out, quote, &exact_fees)?;
    let buyback_fee = buy_transfers(a, &result)?;
    let buyback_received = transfer_fee::amount_after_fee(&quote_fee_data, buyback_fee)?;
    let event = crate::instructions::swap::trade_v2::create_buy_event(
        crate::instructions::swap::trade_v2::TradeEventContext {
            pool: &a.pool, global_config: &a.global_config,
            user_volume_accumulator: &a.user_volume_accumulator,
            base_supply: a.base_mint.supply, user: a.user.key(),
            user_base_token_account: a.user_base_token_account.key(),
            user_quote_token_account: a.user_quote_token_account.key(),
        }, &result, amount, limit, amount, result.quote_amount_in,
        user_base_reserves, user_quote_reserves, b, raw_quote_reserves,
        old_virtual, buyback_received, "buy_exact_quote_in_v2",
    )?;
    emit!(event.clone()); emit_cpi!(event);
    Ok(())
}
