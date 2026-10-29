use anchor_lang::prelude::*;
use pump_amm_recovered::boost::{InitBoost, InitBoostEvent, calculate_virtual_quote_reserves};
pub use pump_amm_recovered::ID;
pub fn execute(ctx: Context<InitBoost>) -> Result<()> {
    let a = &mut *ctx.accounts;
    let creator = a.creator.key();
    let authority = Pubkey::find_program_address(
        &[b"pool-authority", a.pool.base_mint.as_ref()], &pump_amm_recovered::pump::ID,
    ).0;
    let is_pool_authority = creator == authority;
    let can_boost = a.pool.can_boost();
    if !is_pool_authority || can_boost || !a.global_config.boost_enabled
    {
        return Ok(());
    }
    let q = a.pool_quote_token_account.amount;
    let amount = calculate_virtual_quote_reserves(a.pool_base_token_account.amount, q)?;
    if amount == 0 || amount >= q {
        return Ok(());
    }
    let p = &a.pool;
    pump_amm_recovered::utils::token::transfer_checked(
        &a.quote_token_program.to_account_info(),
        &a.quote_mint,
        &a.pool_quote_token_account,
        &a.boost_vault,
        &a.pool.to_account_info(),
        amount,
        &[&[
            b"pool",
            &p.index.to_le_bytes(),
            p.creator.as_ref(),
            p.base_mint.as_ref(),
            p.quote_mint.as_ref(),
            &[p.pool_bump],
        ]],
    )?;
    a.pool.virtual_quote_reserves = amount as i128;
    a.pool_quote_token_account.reload()?;
    let event = InitBoostEvent {
        timestamp: Clock::get()?.unix_timestamp,
        mint: a.pool.base_mint,
        bonding_curve: pump_amm_recovered::utils::bonding_curve(&a.pool.base_mint),
        pool: a.pool.key(),
        virtual_quote_reserves: a.pool.virtual_quote_reserves,
        real_quote_reserves_after: a.pool_quote_token_account.amount,
    };
    emit!(event);
    emit_cpi!(event);
    Ok(())
}
