use crate::*;
use anchor_spl::token_interface::TokenInterface;
#[derive(Accounts)]
pub struct ClaimCashback<'info> {
    /// CHECK: Destination authority and accumulator seed; no signature required.
    #[account(mut)] pub user: AccountInfo<'info>,
    #[account(mut,seeds=[b"user_volume_accumulator",user.key().as_ref()],bump)]
    pub user_volume_accumulator: Account<'info,UserVolumeAccumulator>,
    pub quote_mint: InterfaceAccount<'info,Mint>,
    pub quote_token_program: Interface<'info,TokenInterface>,
    #[account(mut,associated_token::mint=quote_mint,associated_token::authority=user_volume_accumulator,associated_token::token_program=quote_token_program)]
    pub user_volume_accumulator_wsol_token_account: InterfaceAccount<'info,TokenAccount>,
    #[account(mut,token::mint=quote_mint,token::authority=user,token::token_program=quote_token_program)]
    pub user_wsol_token_account: InterfaceAccount<'info,TokenAccount>,
    pub system_program: Program<'info,System>,
    /// CHECK: Anchor event authority PDA.
    #[account(seeds=[b"__event_authority"],bump)]
    pub event_authority:AccountInfo<'info>,
    pub program:Program<'info,crate::program::PumpAmmRecovered>,
}
pub fn claim(ctx:Context<ClaimCashback>)->Result<()> {
    let timestamp=Clock::get()?.unix_timestamp;
    let amount=ctx.accounts.user_volume_accumulator_wsol_token_account.amount;
    let user=ctx.accounts.user.key();
    crate::utils::token::transfer_from_user_volume_accumulator(
        ctx.accounts.quote_token_program.as_ref(),
        &ctx.accounts.quote_mint,
        &ctx.accounts.user_volume_accumulator_wsol_token_account,
        &ctx.accounts.user_wsol_token_account,
        amount,
        &user,
        &ctx.accounts.user_volume_accumulator,
        ctx.bumps.user_volume_accumulator,
    )?;
    let u=&mut ctx.accounts.user_volume_accumulator;
    u.total_cashback_claimed=u.total_cashback_claimed.checked_add(amount).ok_or(error!(PumpAmmError::Overflow))?;
    let event=ClaimCashbackEvent{user:ctx.accounts.user.key(),amount,timestamp,total_claimed:u.total_cashback_claimed,total_cashback_earned:u.cashback_earned};emit!(event);emit_cpi!(event);Ok(())
}
#[event]
#[derive(Clone)]
pub struct ClaimCashbackEvent{pub user:Pubkey,pub amount:u64,pub timestamp:i64,pub total_claimed:u64,pub total_cashback_earned:u64}
